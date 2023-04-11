/* eslint-disable import/extensions */
// eslint-disable-next-line no-unused-vars
import modal from 'bootstrap/js/dist/modal.js';
import i18next from 'i18next';
// import { setLocale } from 'yup';

import resources from './locales/index.js';
import state from './state.js';

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

// setLocale({
//   mixed: {
//     default: 'invalid field',
//   },
//   string: {
//     url: () => ({ key: 'errors.notURL'}),
//   },
// });
const postsList = document.querySelector('.posts .list-group');
const feedList = document.querySelector('.feeds .list-group');
const postLiClassList = ['list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0'];
const postButtonClassList = ['btn', 'btn-outline-primary', 'btn-sm'];
const feedLiClassList = ['list-group-item', 'border-0', 'border-end-0'];
const feedPClassList = ['m-0', 'small', 'text-black-50'];

const renderPosts = () => {
  document.querySelector('#feeds-zone').classList.remove('d-none');
  const alreadyRenderedIDs = Array.from(document.querySelectorAll('.posts a'))
    .map((item) => item.getAttribute('data-id'));
  console.log(alreadyRenderedIDs, 'LIST OF ALL POSTS ON PAGE');

  state.postsAdded.filter((post) => {
    console.log(post, 'CHECK');
    return !alreadyRenderedIDs.includes(post.postID);
  })
    .forEach((el) => {
      const postLi = document.createElement('li');
      const postLink = document.createElement('a');
      const postButton = document.createElement('button');

      postLi.classList.add(...postLiClassList);
      postLink.classList.add('fw-bold');
      postButton.classList.add(...postButtonClassList);
      postLink.setAttribute('data-id', `${el.postID}`);
      postLink.setAttribute('target', '_blank');
      postLink.textContent = el.title;
      postLink.setAttribute('href', `${el.link}`);
      postButton.setAttribute('type', 'button');
      postButton.setAttribute('data-id', `${el.postID}`);
      postButton.setAttribute('data-feedID', `${el.feedID}`);
      postButton.setAttribute('data-bs-toggle', 'modal');
      postButton.setAttribute('data-bs-target', '#modal');
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
      // помечаем прочитанные посты, нужно ли хранить в стейте?
      // Пока обошелся только html, ведь синхронизации с бэком нет:
      postLi.addEventListener('click', (e) => {
        const postTitleID = e.target.getAttribute('data-id');
        const visitedPost = document.querySelector(`a[data-id="${postTitleID}"]`);
        visitedPost.classList.remove('fw-bold');
        visitedPost.classList.add('fw-normal', 'link-secondary');
      });
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
  console.log('LETS REMOVE CLASS');
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
  console.log(path, 'CHANGED PATH');
  if (path === 'form.isValid') {
    const formIsValid = value;

    if (!formIsValid) {
      console.log('RENDERING ERRORS');
      renderErrorsForm();
    }

    if (formIsValid) {
      console.log('RENDERING SUCCESS');
      renderSuccessForm();
    }
  }

  if (path === 'feedsAdded') renderFeed();
  if (path === 'postsAdded') renderPosts();
  console.log(state, 'state after render');
};

export { form, render };
