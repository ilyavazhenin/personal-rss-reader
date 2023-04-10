const state = {
  form: {
    isValid: '',
    error: '',
    tempInputValue: '',
  },
  urlsAdded: [],
  feedsAdded: [], //{ feedID, title, descripton }
  postsAdded: [], //{ feedID, postID, title, description, link }
};

export default state;
