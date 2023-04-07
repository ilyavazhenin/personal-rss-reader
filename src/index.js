import './styles.scss';
import { string } from 'yup';
import onChange from 'on-change';

import state from './state.js';
import { form, render } from './render.js';
import axios from 'axios';

const watchedState = onChange(state, render);

let feedIDCounter = 0;
let postIDCounter = 0;

const getPostsDataFromDOM = (DOM) => {
  const feedTitle = DOM.querySelector('channel > title').textContent;
  const feedDescr = DOM.querySelector('channel > description').textContent;
  const feed = {
    feedID: ++feedIDCounter,
    title: feedTitle,
    description: feedDescr,
  };
  state.feedsAdded.push(feed);
  const posts = Array.from(DOM.querySelectorAll('item'));
  console.log(posts, 'POSTS');
  
  posts.forEach(el => {
    const post = { 
      title: el.querySelector('title').textContent,
      description: el.querySelector('description').textContent,
      link: el.querySelector('link').textContent,
      postID: ++postIDCounter,
      feedID: feedIDCounter,
    };
    state.postsAdded.push(post);
  })

};

const makeDOM = (resp) => {
  const parsedData = new DOMParser();
  const parsedDom = parsedData.parseFromString(resp, 'text/xml');
  return parsedDom;
};

const validateForm = async (url) => {
  let urlSchema = string().url();
  await urlSchema.validate(url)
    .then(() => {
      if (state.urlsAdded.includes(url)) {
        const rssExistsErr = new Error();
        rssExistsErr.name = 'RSSAlreadyAdded';
        rssExistsErr.message = 'RSS already added';
        throw rssExistsErr; 
      }
    })
    .then(() => axios.get(`https://allorigins.hexlet.app/raw?url=${url}`))
    .then(response => {
      console.log(response, 'just response');
      state.DOM = makeDOM(response.data);
      console.log(state.DOM, 'STATE DOM');
      if (state.DOM.querySelector('rss' && '[version]')) {
        state.form.isValid = true;
        state.form.error = '';
        getPostsDataFromDOM(state.DOM);
        watchedState.urlsAdded.push(url);
        // return;
      }
      else {
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
      // А если не следить, то без сброса значения isValid, рендер не срабатывает в случае изменения типа ошибки.
      state.form.isValid = ''; 
    });
};

// controller:
form.addEventListener('submit', async (e) => {
  console.log(e);
  e.preventDefault();
  const formData = new FormData(form);
  const inputValue = formData.get('url');
  validateForm(inputValue)
});
