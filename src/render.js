import state from './state.js';
import { changeVisitedPostsStyle, passPostDataToModal } from './utils/visited-posts.js';
import { createPostButton, createPostLi, createPostLink } from './utils/posts-render-helpers.js';

const feedLiClassList = ['list-group-item', 'border-0', 'border-end-0'];
const feedPClassList = ['m-0', 'small', 'text-black-50'];

const renderPosts = (elements, i18instance) => {
  document.querySelector('#feeds-zone').classList.remove('d-none');
  state.postsAdded.filter((post) => post.isNew === true)
    .forEach((el) => {
      const postLi = createPostLi();
      const postLink = createPostLink(el);
      const postButton = createPostButton(el);
      postButton.textContent = i18instance.t('viewPost');

      elements.postsList.prepend(postLi);
      postLi.appendChild(postLink);
      postLi.appendChild(postButton);
    });
};

const renderFeed = (elements) => {
  const feedLi = document.createElement('li');
  const feedH3 = document.createElement('h3');
  const feedP = document.createElement('p');

  feedLi.classList.add(...feedLiClassList);
  feedH3.classList.add('h6', 'm-0');
  feedP.classList.add(...feedPClassList);

  feedH3.textContent = state.feedsAdded[state.feedsAdded.length - 1].title;
  feedP.textContent = state.feedsAdded[state.feedsAdded.length - 1].description;

  elements.feedList.prepend(feedLi);
  feedLi.appendChild(feedH3);
  feedLi.appendChild(feedP);
};

const focusFieldAfterSuccess = (elements) => {
  const { input } = elements;
  input.value = '';
  elements.input.focus();
};

const renderSuccessForm = (elements, i18instance) => {
  elements.input.classList.remove('is-invalid');
  elements.feedBackP.classList.remove('text-danger');
  elements.feedBackP.classList.add('text-success');
  elements.feedBackP.textContent = i18instance.t('rssLoaded');
  elements.rssExampleP.insertAdjacentElement('afterend', elements.feedBackP);
};

const renderErrorsForm = (elements, i18instance) => {
  elements.input.classList.add('is-invalid');
  elements.feedBackP.classList.remove('text-success');
  elements.feedBackP.classList.add('text-danger');
  elements.feedBackP.textContent = i18instance.t(`errors.${state.form.error}`);
  elements.rssExampleP.insertAdjacentElement('afterend', elements.feedBackP);
};

const render = (elements, i18instance) => (path, value) => {
  if (path === 'form.status' && value === 'success') renderSuccessForm(elements, i18instance);
  if (path === 'form.status' && value === 'readyToInput') focusFieldAfterSuccess(elements);
  if (path === 'form.error') renderErrorsForm(elements, i18instance);
  if (path === 'feedsAdded') renderFeed(elements);
  if (path === 'postsAdded') renderPosts(elements, i18instance);
  if (path === 'visitedPosts') {
    changeVisitedPostsStyle(value[value.length - 1]);
    passPostDataToModal(elements, value[value.length - 1], state);
  }
};

export default render;
