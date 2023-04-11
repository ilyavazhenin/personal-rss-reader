const postLiClassList = ['list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0'];
const postButtonClassList = ['btn', 'btn-outline-primary', 'btn-sm'];

const createPostButton = (itemData) => {
  const postButton = document.createElement('button');
  postButton.classList.add(...postButtonClassList);
  postButton.setAttribute('type', 'button');
  postButton.setAttribute('data-id', `${itemData.postID}`);
  postButton.setAttribute('data-bs-toggle', 'modal');
  postButton.setAttribute('data-bs-target', '#modal');
  return postButton;
};

const createPostLink = (itemData) => {
  const postLink = document.createElement('a');
  postLink.classList.add('fw-bold');
  postLink.setAttribute('data-id', `${itemData.postID}`);
  postLink.setAttribute('target', '_blank');
  postLink.textContent = itemData.title;
  postLink.setAttribute('href', `${itemData.link}`);
  return postLink;
};

const createPostLi = () => {
  const postLi = document.createElement('li');
  postLi.classList.add(...postLiClassList);
  return postLi;
};

export { createPostLi, createPostButton, createPostLink };
