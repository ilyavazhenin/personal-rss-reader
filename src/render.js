import state from './state.js';

const errParagraph = document.createElement('p');
errParagraph.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success', 'text-danger');

const form = document.querySelector('form');
const input = document.querySelector('input');

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
    input.value = '';
    input.focus();
  }
  console.log('rendered OK!');
  console.log(state, 'state after render');
};

export { form, render };
