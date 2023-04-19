import { string } from 'yup';

const validateForm = async (inputValue, urlsAdded) => {
  const urlSchema = string().url().notOneOf(urlsAdded);
  await urlSchema.validate(inputValue);
};

export default validateForm;
