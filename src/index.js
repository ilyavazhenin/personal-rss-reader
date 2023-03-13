import './styles.scss';
import { string } from 'yup';
import onChange from 'on-change';

import state from './state.js';
import { form, render } from './render.js';

const watchedState = onChange(state, render);

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

// controller to change model on submit event:
form.addEventListener('submit', async (e) => {
  console.log(e);
  e.preventDefault();
  const formData = new FormData(form);
  const inputValue = formData.get('url');
  validateForm(inputValue);
});
