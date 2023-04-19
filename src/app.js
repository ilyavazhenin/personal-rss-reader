import i18next from 'i18next';

import onChange from 'on-change';
import axios from 'axios';
import some from 'lodash.some';

import resources from './locales/index.js';
import state from './state.js';
import render from './render.js';
import validateForm from './utils/form-validation.js';

import {
  urlTemplate,
  makeDOM,
  getPostsDataFromDOM,
  getFeedHeadingsFromDOM,
} from './utils/parse-helpers.js';

const runApp = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    rssExampleP: document.querySelector('#example'),
    modalWindow: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescr: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
    postsList: document.querySelector('.posts .list-group'),
    feedList: document.querySelector('.feeds .list-group'),
  };

  const i18nInst = i18next.createInstance();
  i18nInst.init({
    debug: true,
    lng: 'ru',
    resources,
  }).then(() => {
    const watchedState = onChange(state, render(elements, i18nInst));

    const pushOnlyNewPosts = (DOMobj, addedPosts) => {
      const postsData = getPostsDataFromDOM(DOMobj);
      const newPosts = [];
      postsData.forEach((item) => {
        const postID = item.querySelector('guid').textContent;
        if (!some(addedPosts, ['postID', postID])) {
          const post = {
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent,
            link: item.querySelector('link').textContent,
            postID,
          };
          newPosts.push(post);
        }
      });
      watchedState.postsAdded.push(...newPosts);
    };

    const checkForNewPosts = () => {
      clearTimeout(state.updateTimer);
      const requests = state.urlsAdded.map((url) => axios.get(`${urlTemplate}${url}`));
      Promise.all(requests)
        .then((responses) => responses.forEach((response) => {
          const DOM = makeDOM(response.data.contents);
          pushOnlyNewPosts(DOM, state.postsAdded);
          state.updateTimer = setTimeout(checkForNewPosts.bind(null, watchedState), 5000);
        }));
    };
    // WORKS!
    const getFeedAndPosts = (responseContent, url) => {
      const DOM = makeDOM(responseContent);
      // eslint-disable-next-line no-param-reassign
      watchedState.form.isValid = true;
      state.form.error = '';
      if (DOM.querySelector('rss' && '[version]')) {
        const newFeed = getFeedHeadingsFromDOM(DOM);
        pushOnlyNewPosts(DOM, state.postsAdded);
        watchedState.feedsAdded.push(newFeed);
        state.urlsAdded.push(url);
        state.updateTimer = setTimeout(checkForNewPosts.bind(null, watchedState), 5000);
      } else {
        const rssNotValid = new Error();
        rssNotValid.type = 'RSSNotValid';
        throw rssNotValid;
      }
    };

    const processForm = async (url) => {
      validateForm(url, state.urlsAdded)
        .then(() => axios.get(`${urlTemplate}${url}`))
        .then((response) => {
          getFeedAndPosts(response.data.contents, url);
        })
        .catch((err) => {
          // eslint-disable-next-line no-param-reassign
          if (err.name === 'AxiosError') err.type = 'AxiosError'; // coz axios error obj differs :(
          watchedState.form.error = err.type;
          state.form.isValid = false;
        });
    };

    // Main submit controller:
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(elements.form);
      const inputValue = formData.get('url');
      processForm(inputValue);
    });

    // Posts 'Read Full' button controller:
    elements.modalWindow.addEventListener('show.bs.modal', (e) => {
      const id = e.relatedTarget.getAttribute('data-id');
      const post = state.postsAdded.find((elem) => elem.postID === id);
      const { modalTitle, modalDescr } = elements;
      modalTitle.textContent = post.title;
      modalDescr.textContent = post.description;
      elements.modalLink.setAttribute('href', `${post.link}`);
    });
  });
};

export default runApp;
