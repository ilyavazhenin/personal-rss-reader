// eslint-disable-next-line import/no-extraneous-dependencies
import uniqueId from 'lodash.uniqueid';

const urlTemplate = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

const makeDOM = (response) => {
  const parsedData = new DOMParser();
  const parsedDom = parsedData.parseFromString(response, 'text/xml');
  if (!parsedDom.querySelector('rss' && '[version]')) {
    const rssNotValid = new Error();
    rssNotValid.type = 'RSSNotValid';
    throw rssNotValid;
  }
  return parsedDom;
};

const getPostsDataFromDOM = (DOM) => {
  const posts = Array.from(DOM.querySelectorAll('item'));
  const postsData = posts.map((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      postID: item.querySelector('guid').textContent,
    };
    return post;
  });

  return postsData;
};

const getFeedHeadingsFromDOM = (DOM) => {
  const feedTitle = DOM.querySelector('channel > title').textContent;
  const feedDescr = DOM.querySelector('channel > description').textContent;
  const feed = {
    feedID: uniqueId('feed'),
    title: feedTitle,
    description: feedDescr,
  };
  return feed;
};

export {
  urlTemplate, makeDOM, getPostsDataFromDOM, getFeedHeadingsFromDOM,
};
