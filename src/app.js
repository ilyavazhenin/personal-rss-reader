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
  parseDataFromSource,
} from './utils/parse-helpers.js';

export default () => {
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
    feedBackP: document.querySelector('p.feedback'),
  };

  const i18nInst = i18next.createInstance();
  i18nInst.init({
    debug: true,
    lng: 'ru',
    resources,
  }).then(() => {
    const watchedState = onChange(state, render(elements, i18nInst));

    const pushOnlyNewPosts = (postsData) => {
      const newPosts = [];
      postsData.forEach((post) => {
        const { postID } = post;
        if (!some(state.postsAdded, ['postID', postID])) {
          newPosts.push(post);
        }
      });
      watchedState.postsAdded.push(...newPosts);
    };

    const checkForNewPosts = () => {
      setTimeout(() => {
        const requests = state.urlsAdded.map((url) => axios.get(`${urlTemplate}${url}`));
        Promise.allSettled(requests)
          .then((responses) => responses.forEach((response) => {
            if (response.status === 'fulfilled') {
              const { postsData } = parseDataFromSource(response.value.data.contents);
              pushOnlyNewPosts(postsData);
            }
          }));
        checkForNewPosts();
      }, 5000);
    };

    const getFeedAndPosts = (responseContent, url) => {
      const { postsData, feedData } = parseDataFromSource(responseContent);
      watchedState.form.status = 'success';
      state.form.error = '';
      pushOnlyNewPosts(postsData);
      watchedState.feedsAdded.push(feedData);
      watchedState.form.status = 'readyToInput';
      state.urlsAdded.push(url);
    };

    const processForm = async (url) => {
      validateForm(url, state.urlsAdded)
        .then(() => {
          watchedState.form.status = 'fetching';
          return axios.get(`${urlTemplate}${url}`);
        })
        .then((response) => {
          getFeedAndPosts(response.data.contents, url);
        })
        .catch((err) => {
          if (err.name === 'AxiosError') watchedState.form.error = err.name;
          else watchedState.form.error = err.type;
          state.form.status = 'fail';
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
      watchedState.visitedPosts.push(id);
    });

    // Post links controller to make posts style visited:
    elements.postsList.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      if (id) watchedState.visitedPosts.push(id);
    });

    checkForNewPosts();
  });
};
