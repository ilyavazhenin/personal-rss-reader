import i18next from 'i18next';

import resources from './locales/index.js';
import state from './state.js';
import changeVisitedPostsStyle from './utils/visited-posts.js';
import { createPostButton, createPostLi, createPostLink } from './utils/posts-render-helpers.js';

const errParagraph = document.createElement('p');
errParagraph.classList.add('feedback', 'm-0', 'position-absolute', 'small');

const i18nInst = i18next.createInstance();
i18nInst.init({
  debug: true,
  lng: 'ru',
  resources,
});

const feedLiClassList = ['list-group-item', 'border-0', 'border-end-0'];
const feedPClassList = ['m-0', 'small', 'text-black-50'];

const renderPosts = (elements) => {
  document.querySelector('#feeds-zone').classList.remove('d-none');
  const alreadyRenderedIDs = Array.from(document.querySelectorAll('.posts a'))
    .map((item) => item.getAttribute('data-id'));

  state.postsAdded.filter((post) => !alreadyRenderedIDs.includes(post.postID))
    .forEach((el) => {
      const postLi = createPostLi();
      const postLink = createPostLink(el);
      const postButton = createPostButton(el);
      postButton.textContent = i18nInst.t('viewPost');

      postButton.addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.target.getAttribute('data-id');
        const post = state.postsAdded.find((elem) => elem.postID === id);
        const { modalTitle, modalDescr } = elements;
        modalTitle.textContent = post.title;
        modalDescr.textContent = post.description;
        elements.modalLink.setAttribute('href', `${post.link}`);
      });

      elements.postsList.prepend(postLi);
      postLi.appendChild(postLink);
      postLi.appendChild(postButton);

      changeVisitedPostsStyle(postLi);
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

const renderSuccessForm = (elements) => {
  elements.input.classList.remove('is-invalid');
  errParagraph.classList.remove('text-danger');
  errParagraph.classList.add('text-success');
  errParagraph.textContent = i18nInst.t('rssLoaded');
  elements.rssExampleP.insertAdjacentElement('afterend', errParagraph);
  const { input } = elements;
  input.value = '';
  elements.input.focus();
};

const renderErrorsForm = (elements) => {
  elements.input.classList.add('is-invalid');
  errParagraph.classList.remove('text-success');
  errParagraph.classList.add('text-danger');
  errParagraph.textContent = i18nInst.t(`errors.${state.form.error}`);
  elements.rssExampleP.insertAdjacentElement('afterend', errParagraph);
};

const render = (elements) => (path, value) => {
  if (path === 'form.isValid' && value === true) renderSuccessForm(elements);
  if (path === 'form.error') renderErrorsForm(elements);
  if (path === 'feedsAdded') renderFeed(elements);
  if (path === 'postsAdded') renderPosts(elements);
  // console.log(state, 'state after render');
};

export default render;
