import './styles.scss';
import onChange from 'on-change';
import axios from 'axios';

import state from './state.js';
import render from './render.js';
import validateForm from './utils/form-validation.js';

import {
  urlTemplate,
  getFeedAndPosts,
} from './utils/parse-helpers.js';

const runApp = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    rssExampleP: document.querySelector('#example'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescr: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
    postsList: document.querySelector('.posts .list-group'),
    feedList: document.querySelector('.feeds .list-group'),
  };

  const watchedState = onChange(state, render(elements));

  const processForm = async (url) => { // validates form and proceeds with axios
    validateForm(url, state.urlsAdded)
      .then(() => axios.get(`${urlTemplate}${url}`))
      .then((response) => {
        getFeedAndPosts(response.data.contents, watchedState, url);
      })
      .catch((err) => {
        // console.log(JSON.stringify(err), err.message);
        watchedState.form.error = err.name;
        state.form.isValid = false;
      });
  };

  // Main controller:
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const inputValue = formData.get('url');
    processForm(inputValue);
  });
};

export default runApp;
