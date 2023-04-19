import some from 'lodash.some';
import axios from 'axios';
import state from '../state.js';

const urlTemplate = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

let feedIDCounter = 0;

const makeDOM = (response) => {
  const parsedData = new DOMParser();
  const parsedDom = parsedData.parseFromString(response, 'text/xml');
  return parsedDom;
};

const getPostsDataFromDOM = (DOM) => {
  const posts = Array.from(DOM.querySelectorAll('item'));
  return posts;
};

const getFeedHeadingsFromDOM = (DOM) => {
  const feedTitle = DOM.querySelector('channel > title').textContent;
  const feedDescr = DOM.querySelector('channel > description').textContent;
  const feed = {
    feedID: feedIDCounter += 1,
    title: feedTitle,
    description: feedDescr,
  };
  return feed;
};

const getOnlyNewPosts = (postsArray, addedPosts) => {
  const newPosts = [];
  postsArray.forEach((item) => {
    const postID = item.querySelector('guid').textContent;
    if (!some(addedPosts, ['postID', postID])) {
      const post = {
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
        postID,
        feedID: feedIDCounter,
      };
      newPosts.push(post);
    }
  });
  return newPosts;
};

const checkForNewPosts = (watchedState) => {
  clearTimeout(state.updateTimer);
  const requests = state.urlsAdded.map((url) => axios.get(`${urlTemplate}${url}`));
  Promise.all(requests)
    .then((responses) => responses.forEach((response) => {
      const tempDOM = makeDOM(response.data.contents);
      const postsData = getPostsDataFromDOM(tempDOM);
      const newPosts = getOnlyNewPosts(postsData, state.postsAdded);
      watchedState.postsAdded.push(...newPosts);
      state.updateTimer = setTimeout(checkForNewPosts.bind(null, watchedState), 5000);
    }));
};

const getFeedAndPosts = (responseContent, watchedState, url) => {
  const DOM = makeDOM(responseContent);
  // eslint-disable-next-line no-param-reassign
  watchedState.form.isValid = true;
  state.form.error = '';
  if (DOM.querySelector('rss' && '[version]')) {
    const postsData = getPostsDataFromDOM(DOM);
    const newFeed = getFeedHeadingsFromDOM(DOM);
    const newPosts = getOnlyNewPosts(postsData, state.postsAdded);
    watchedState.postsAdded.push(...newPosts);
    watchedState.feedsAdded.push(newFeed);
    state.urlsAdded.push(url);
    state.updateTimer = setTimeout(checkForNewPosts.bind(null, watchedState), 5000);
  } else {
    const rssNotValid = new Error();
    rssNotValid.type = 'RSSNotValid';
    throw rssNotValid;
  }
};

export { urlTemplate, getFeedAndPosts };
