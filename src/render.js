import state from './state.js';
import { changeVisitedPostsStyle, passPostDataToModal } from './utils/visited-posts.js';
import { createPostButton, createPostLi, createPostLink } from './utils/posts-render-helpers.js';

const errParagraph = document.createElement('p');
errParagraph.classList.add('feedback', 'm-0', 'position-absolute', 'small');

const feedLiClassList = ['list-group-item', 'border-0', 'border-end-0'];
const feedPClassList = ['m-0', 'small', 'text-black-50'];

const renderPosts = (elements, i18instance) => {
  document.querySelector('#feeds-zone').classList.remove('d-none');
  const alreadyRenderedIDs = Array.from(document.querySelectorAll('.posts a'))
    .map((item) => item.getAttribute('data-id'));

  state.postsAdded.filter((post) => !alreadyRenderedIDs.includes(post.postID))
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

const renderSuccessForm = (elements, i18instance) => {
  elements.input.classList.remove('is-invalid');
  errParagraph.classList.remove('text-danger');
  errParagraph.classList.add('text-success');
  errParagraph.textContent = i18instance.t('rssLoaded');
  elements.rssExampleP.insertAdjacentElement('afterend', errParagraph);
  const { input } = elements;
  input.value = '';
  elements.input.focus();
};

const renderErrorsForm = (elements, i18instance) => {
  elements.input.classList.add('is-invalid');
  errParagraph.classList.remove('text-success');
  errParagraph.classList.add('text-danger');
  errParagraph.textContent = i18instance.t(`errors.${state.form.error}`);
  elements.rssExampleP.insertAdjacentElement('afterend', errParagraph);
};

const render = (elements, i18instance) => (path, value) => {
  if (path === 'form.isValid' && value === true) renderSuccessForm(elements, i18instance);
  if (path === 'form.error') renderErrorsForm(elements, i18instance);
  if (path === 'feedsAdded') renderFeed(elements);
  if (path === 'postsAdded') renderPosts(elements, i18instance);
  if (path === 'visitedPosts') {
    changeVisitedPostsStyle(value[value.length - 1]);
    passPostDataToModal(elements, value[value.length - 1], state);
  }
};

export default render;
