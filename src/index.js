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
        const rssExistsErr = new Error();
        rssExistsErr.type = 'rssAlreadyAdded';
        rssExistsErr.message = 'RSS already added';
        throw rssExistsErr; 
      }

      if (!state.feedsAdded.includes(url)) {
        state.form.isValid = true;
        state.form.error = '';
        watchedState.feedsAdded.push(url);
      }
      
    })
    .catch((err) => {
      console.log(JSON.stringify(err), err.message, ' - MESSAGE ERROR');
      state.form.error = err.type;
      watchedState.form.isValid = false;
      // ниже костыль, пока не знаю как заставить рендер срабатывать один раз. Если поставлю
      // так же слежение за полем form.error - будет рендерится два раза подряд. 
      // А если не следить, то без сброса значения isValid, рендер не срабатывает в случае изменения типа ошибки.
      state.form.isValid = ''; 
    });
};

// controller:
form.addEventListener('submit', async (e) => {
  console.log(e);
  e.preventDefault();
  const formData = new FormData(form);
  const inputValue = formData.get('url');
  validateForm(inputValue);
});
