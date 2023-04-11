import { string } from 'yup';

const validateForm = async (inputValue, urlsAdded) => {
  const urlSchema = string().url();
  await urlSchema.validate(inputValue)
    .then(() => {
      if (urlsAdded.includes(inputValue)) {
        const rssExistsErr = new Error();
        rssExistsErr.name = 'RSSAlreadyAdded';
        rssExistsErr.message = 'RSS already added';
        throw rssExistsErr;
      }
    });
};

export default validateForm;
