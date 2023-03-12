import './styles.scss';
import { string } from 'yup';
import onChange from 'on-change';

const state = {
  form: {
    isValid: true,
    errors: [],
    tempInputValue: '',
  },
  feedsAdded: [],
};

console.log(state, 'initial state');

const form = document.querySelector('form');
const input = document.querySelector('input');
const errParagraph = document.createElement('p');
errParagraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success', 'text-danger');

const validateForm = async (url) => {
  let urlSchema = string().url();
  await urlSchema.validate(url)
    .then(() => {
      if (state.feedsAdded.includes(url)) {
        state.form.errors[0] = 'RSS already exists';
        watchedState.form.isValid = false;
      }

      if (!state.feedsAdded.includes(url)) {
        watchedState.form.isValid = true;
        state.form.errors = [];
        state.feedsAdded.push(url);
      }
      
    })
    .catch((data) => {
      console.log(data, 'errors in validation');
      state.form.errors.push(data.message);
      watchedState.form.isValid = false;
      console.log(state, 'after errors');
    });
};

const render = () => {
  if (!state.form.isValid) {
    input.classList.add('is-invalid');
    errParagraph.textContent = state.form.errors[0];
    form.append(errParagraph);
  }
  
  if (state.form.isValid) {
    console.log('LETS REMOVE CLASS');
    input.classList.remove('is-invalid');
    errParagraph.remove();
  }
  console.log('rendered OK!');
  console.log(state, 'state after render');
};

const watchedState = onChange(state, render);

form.addEventListener('submit', async (e) => {
  console.log(e);
  e.preventDefault();
  const formData = new FormData(form);
  const inputValue = formData.get('url');
  validateForm(inputValue);
});