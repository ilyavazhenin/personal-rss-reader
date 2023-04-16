import './styles.scss';
import onChange from 'on-change';
import axios from 'axios';

import state from './state.js';
import { form, render } from './render.js';
import validateForm from './utils/form-validation.js';

import {
  makeDOM,
  getPostsDataFromDOM,
  getFeedHeadingsFromDOM,
  getOnlyNewPosts,
  urlTemplate,
} from './utils/parse-helpers.js';

const runApp = () => {
  const watchedState = onChange(state, render);

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

  const processForm = async (url) => { // validates form and proceeds with axios
    validateForm(url, state.urlsAdded)
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
          state.updateTimer = setTimeout(checkForNewPosts.bind(null, state), 5000);
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

  // Main controller:
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const inputValue = formData.get('url');
    processForm(inputValue);
  });
};

export default runApp;
