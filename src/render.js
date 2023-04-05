import i18next from 'i18next';
// import { setLocale } from 'yup';

import resources from './locales/index.js';
import state from './state.js';

const errParagraph = document.createElement('p');
errParagraph.classList.add('feedback', 'm-0', 'position-absolute', 'small');

const form = document.querySelector('form');
const input = document.querySelector('input');
const rssExampleP = document.querySelector('#example');

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



const renderFeed = () => {
  document.querySelector('#feeds-zone').classList.remove('d-none');

  state.lastFeedAdded.posts.forEach(el => {
    const postLi = document.createElement('li');
    const postLink = document.createElement('a');
    const postButton = document.createElement('button');  

    postLi.classList.add(...postLiClassList);
    postLink.classList.add('fw-bold');
    postButton.classList.add(...postButtonClassList);
    postLink.setAttribute('data-id', `${el.id}`);
    postLink.setAttribute('target', '_blank');
    postButton.setAttribute('type', 'button');
    postButton.setAttribute('data-id', `${el.id}`);
    postButton.setAttribute('data-bs-toggle', 'modal');
    postButton.setAttribute('data-bs-target', '#modal');
    postLink.textContent = el.title;
    postLink.setAttribute('href', `${el.link}`);
    postButton.textContent = i18nInst.t('viewPost');

    postsList.appendChild(postLi);
    postLi.appendChild(postLink);
    postLi.appendChild(postButton);
  });

  const feedLi = document.createElement('li');
  const feedH3 = document.createElement('h3');
  const feedP = document.createElement('p');

  feedLi.classList.add(...feedLiClassList);
  feedH3.classList.add('h6', 'm-0');
  feedP.classList.add(...feedPClassList);

  feedH3.textContent = state.lastFeedAdded.title;
  feedP.textContent = state.lastFeedAdded.description;

  feedList.appendChild(feedLi);
  feedLi.appendChild(feedH3);
  feedLi.appendChild(feedP);
};

const renderSuccess = () => {
  console.log('LETS REMOVE CLASS');
  input.classList.remove('is-invalid');
  errParagraph.classList.remove('text-danger');
  errParagraph.classList.add('text-success');
  errParagraph.textContent = i18nInst.t('rssLoaded');
  rssExampleP.insertAdjacentElement('afterend', errParagraph);
  input.value = '';
  input.focus();
};

const renderWithError = () => {
  input.classList.add('is-invalid');
  errParagraph.classList.remove('text-success');
  errParagraph.classList.add('text-danger');
  errParagraph.textContent = i18nInst.t(`errors.${state.form.error}`);
  rssExampleP.insertAdjacentElement('afterend', errParagraph);
};

const render = (path, value) => {
  const formIsValid = value;
  console.log(path, 'CHANGED PATH');
  if (!formIsValid) {
    console.log('RENDERING ERRORS');
    renderWithError();
  }
  
  if (formIsValid) {
    console.log('RENDERING SUCCESS');
    renderSuccess();
    renderFeed();
  }

  console.log(state, 'state after render');
};

export { form, render };
