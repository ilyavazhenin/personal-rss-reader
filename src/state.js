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

// const newState = {
//   form: {
//     isValid: true,
//     error: '',
//     tempInputValue: '',
//   },
//   urlsAdded: [],
//   feedsAdded: {
//     id: 0,
//     title: null,
//     description: null,
//   },
//   postsAdded: {
//     relatedFeedID: 0,
//     posts: [], //id, link, title, description
//   }
// };

export default state;