const state = {
  form: {
    isValid: '',
    error: '',
  },
  urlsAdded: [],
  feedsAdded: [], // { feedID, title, descripton }
  postsAdded: [], // { feedID, postID, title, description, link, read: true/false }
  updateTimer: null,
  visitedPosts: [], // postIDs
};

export default state;
