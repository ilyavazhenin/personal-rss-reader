import some from 'lodash.some';

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

export {
  getPostsDataFromDOM, getFeedHeadingsFromDOM, getOnlyNewPosts, makeDOM, urlTemplate,
};