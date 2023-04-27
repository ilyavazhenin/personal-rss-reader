const state = {
  form: {
    status: 'readyToInput', // success, fail, fetching
    error: '',
  },
  urlsAdded: [],
  feedsAdded: [], // { feedID, title, descripton }
  postsAdded: [], // { feedID, postID, title, description, link, isNew: true/false }
  visitedPosts: [], // postIDs
};

export default state;
