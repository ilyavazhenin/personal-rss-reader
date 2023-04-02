const state = {
  form: {
    isValid: true,
    error: '',
    tempInputValue: '',
  },
  urlsAdded: [],
  lastFeedAdded: {
    id: 0,
    title: null,
    description: null,
    posts: [], //id, link, title, description
  },
};

export default state;