import i18next from 'i18next';

import resources from './locales/index.js';
import state from './state.js';
import changeVisitedPostsStyle from './utils/visited-posts.js';
import { createPostButton, createPostLi, createPostLink } from './utils/posts-render-helpers.js';

const errParagraph = document.createElement('p');
errParagraph.classList.add('feedback', 'm-0', 'position-absolute', 'small');

const form = document.querySelector('form');
const input = document.querySelector('input');
const rssExampleP = document.querySelector('#example');
const modalTitle = document.querySelector('.modal-title');
const modalDescr = document.querySelector('.modal-body');
const modalLink = document.querySelector('.full-article');

const i18nInst = i18next.createInstance();
i18nInst.init({
  debug: true,
  lng: 'ru',
  resources,
});

const postsList = document.querySelector('.posts .list-group');
const feedList = document.querySelector('.feeds .list-group');
const feedLiClassList = ['list-group-item', 'border-0', 'border-end-0'];
const feedPClassList = ['m-0', 'small', 'text-black-50'];

const renderPosts = () => {
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
        modalTitle.textContent = post.title;
        modalDescr.textContent = post.description;
        modalLink.setAttribute('href', `${post.link}`);
      });

      postsList.prepend(postLi);
      postLi.appendChild(postLink);
      postLi.appendChild(postButton);

      changeVisitedPostsStyle(postLi);
    });
};

const renderFeed = () => {
  const feedLi = document.createElement('li');
  const feedH3 = document.createElement('h3');
  const feedP = document.createElement('p');

  feedLi.classList.add(...feedLiClassList);
  feedH3.classList.add('h6', 'm-0');
  feedP.classList.add(...feedPClassList);

  feedH3.textContent = state.feedsAdded[state.feedsAdded.length - 1].title;
  feedP.textContent = state.feedsAdded[state.feedsAdded.length - 1].description;

  feedList.prepend(feedLi);
  feedLi.appendChild(feedH3);
  feedLi.appendChild(feedP);
};

const renderSuccessForm = () => {
  input.classList.remove('is-invalid');
  errParagraph.classList.remove('text-danger');
  errParagraph.classList.add('text-success');
  errParagraph.textContent = i18nInst.t('rssLoaded');
  rssExampleP.insertAdjacentElement('afterend', errParagraph);
  input.value = '';
  input.focus();
};

const renderErrorsForm = () => {
  input.classList.add('is-invalid');
  errParagraph.classList.remove('text-success');
  errParagraph.classList.add('text-danger');
  errParagraph.textContent = i18nInst.t(`errors.${state.form.error}`);
  rssExampleP.insertAdjacentElement('afterend', errParagraph);
};

const render = (path, value) => {
  if (path === 'form.isValid' && value === true) renderSuccessForm();
  if (path === 'form.error') renderErrorsForm();
  if (path === 'feedsAdded') renderFeed();
  if (path === 'postsAdded') renderPosts();
  // console.log(state, 'state after render');
};

export { form, render };
