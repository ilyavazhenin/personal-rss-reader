import './styles.scss';
import { string } from 'yup';
import onChange from 'on-change';
import axios from 'axios';

import state from './state.js';
import { form, render } from './render.js';

import {
  makeDOM,
  getPostsDataFromDOM,
  getFeedHeadingsFromDOM,
  getOnlyNewPosts,
  urlTemplate,
} from './utils/parse-helpers.js';

const watchedState = onChange(state, render);

const processForm = async (url) => { // validates form, proceeds with axios response, catches errors
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
    .then(() => axios.get(`${urlTemplate}${url}`))
    .then((response) => {
      const DOM = makeDOM(response.data.contents);
      watchedState.form.isValid = true;
      state.form.error = '';
      if (DOM.querySelector('rss' && '[version]')) {
        const postsData = getPostsDataFromDOM(DOM);
        const newFeed = getFeedHeadingsFromDOM(DOM);
        const newPosts = getOnlyNewPosts(postsData, state.postsAdded);
        watchedState.postsAdded = state.postsAdded.concat(newPosts);
        watchedState.feedsAdded = state.feedsAdded.concat(newFeed);
        state.urlsAdded.push(url);
      } else {
        const rssNotValid = new Error();
        rssNotValid.name = 'RSSNotValid';
        rssNotValid.message = 'No valid RSS at this URL';
        throw rssNotValid;
      }
    })
    .catch((err) => {
      // console.log(JSON.stringify(err), err.message);
      watchedState.form.error = err.name;
      state.form.isValid = false;
    });
};

const checkForNewPosts = () => {
  clearTimeout(state.updateTimer);
  const requests = state.urlsAdded.map((url) => axios.get(`${urlTemplate}${url}`));
  Promise.all(requests)
    .then((responses) => responses.forEach((response) => {
      const tempDOM = makeDOM(response.data.contents);
      const postsData = getPostsDataFromDOM(tempDOM);
      const newPosts = getOnlyNewPosts(postsData, state.postsAdded);
      watchedState.postsAdded = state.postsAdded.concat(newPosts);
      state.updateTimer = setTimeout(checkForNewPosts, 5000);
    }));
};

// Main controller:
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const inputValue = formData.get('url');
  processForm(inputValue)
    .then(() => {
      state.updateTimer = setTimeout(checkForNewPosts.bind(null, state), 5000);
    });
});
