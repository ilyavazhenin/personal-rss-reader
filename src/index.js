/* eslint-disable import/extensions */
import './styles.scss';
import { string } from 'yup';
import onChange from 'on-change';
import axios from 'axios';

import state from './state.js';
import { form, render } from './render.js';

import {
  makeDOM, getPostsDataFromDOM, getFeedHeadingsFromDOM, getOnlyNewPosts,
} from './parse-utils.js';

const watchedState = onChange(state, render);

const validateForm = async (url) => {
  const urlSchema = string().url();
  await urlSchema.validate(url)
    .then(() => {
      if (state.urlsAdded.includes(url)) {
        const rssExistsErr = new Error();
        rssExistsErr.name = 'RSSAlreadyAdded';
        rssExistsErr.message = 'RSS already added';
        throw rssExistsErr;
      }
    })
    .then(() => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`))
    .then((response) => {
      console.log(response, 'just response');
      state.DOM = makeDOM(response.data.contents);
      console.log(state.DOM, 'STATE DOM');
      watchedState.form.isValid = true;
      state.form.error = '';
      if (state.DOM.querySelector('rss' && '[version]')) {
        const postsData = getPostsDataFromDOM(state.DOM);
        const newFeed = getFeedHeadingsFromDOM(state.DOM);
        const newPosts = getOnlyNewPosts(postsData, state.postsAdded);
        watchedState.postsAdded = state.postsAdded.concat(newPosts);
        watchedState.feedsAdded = state.feedsAdded.concat(newFeed);
        console.log(state.postsAdded, 'добавленные посты в стейт ПЕРЕД рендерингом');
        state.urlsAdded.push(url);
      } else {
        const rssNotValid = new Error();
        rssNotValid.name = 'RSSNotValid';
        rssNotValid.message = 'No valid RSS at this URL';
        throw rssNotValid;
      }
    })
    .catch((err) => {
      console.log(JSON.stringify(err), err.message, ' - MESSAGE ERROR');
      state.form.error = err.name;
      watchedState.form.isValid = false;
      // ниже костыль, пока не знаю как заставить рендер срабатывать один раз. Если добавлю
      // слежение за полем form.error - будет рендерится два раза подряд.
      // А если не следить, то без сброса значения isValid,
      // рендер не срабатывает в случае изменения типа ошибки.
      state.form.isValid = '';
    });
};

const checkForNewPosts = () => {
  if (!state.urlsAdded.length) throw new Error('No feeds added to auto-update');
  clearTimeout(state.updatingTimer);
  const requests = state.urlsAdded.map((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`));
  Promise.all(requests)
    .then((responses) => responses.forEach((response) => {
      const tempDOM = makeDOM(response.data);
      const postsData = getPostsDataFromDOM(tempDOM);
      const newPosts = getOnlyNewPosts(postsData, state.postsAdded);
      watchedState.postsAdded = state.postsAdded.concat(newPosts);
      console.log(state.postsAdded, 'добавленные посты в стейт ПЕРЕД рендерингом');
      state.updatingTimer = setTimeout(checkForNewPosts, 5000);
    }))
    .catch((e) => console.log(JSON.stringify(e), e.message, 'REFRESH ERROR'));
};

// controller:
form.addEventListener('submit', async (e) => {
  console.log(e);
  e.preventDefault();
  const formData = new FormData(form);
  const inputValue = formData.get('url');
  validateForm(inputValue);
  state.updatingTimer = setTimeout(checkForNewPosts.bind(null, state), 5000);
});
