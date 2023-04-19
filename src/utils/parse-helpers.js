const urlTemplate = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

const makeDOM = (response) => {
  const parsedData = new DOMParser();
  const parsedDom = parsedData.parseFromString(response, 'text/xml');
  return parsedDom;
};

const getPostsDataFromDOM = (DOM) => {
  const posts = Array.from(DOM.querySelectorAll('item'));
  return posts;
};

let feedIDCounter = 0;

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

export {
  urlTemplate, makeDOM, getPostsDataFromDOM, getFeedHeadingsFromDOM,
};
