import i18next from 'i18next';
// import { setLocale } from 'yup';

import resources from './locales/index.js';
import state from './state.js';

const errParagraph = document.createElement('p');
errParagraph.classList.add('feedback', 'm-0', 'position-absolute', 'small');

const form = document.querySelector('form');
const input = document.querySelector('input');

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

const renderSuccess = () => {
  console.log('LETS REMOVE CLASS');
  input.classList.remove('is-invalid');
  errParagraph.classList.remove('text-danger');
  errParagraph.classList.add('text-success');
  errParagraph.textContent = i18nInst.t('rssLoaded');
  form.append(errParagraph);
  input.value = '';
  input.focus();
};

const renderWithError = () => {
  input.classList.add('is-invalid');
  errParagraph.classList.remove('text-success');
  errParagraph.classList.add('text-danger');
  errParagraph.textContent = i18nInst.t(`errors.${state.form.error}`);
  form.append(errParagraph);
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
  }

  console.log(state, 'state after render');
};

export { form, render };
