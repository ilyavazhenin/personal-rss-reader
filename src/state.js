const state = {
  form: {
    isValid: '',
    error: '',
  },
  urlsAdded: [],
  feedsAdded: [], // { feedID, title, descripton }
  postsAdded: [], // { feedID, postID, title, description, link }
  updateTimer: null,
};

export default state;
