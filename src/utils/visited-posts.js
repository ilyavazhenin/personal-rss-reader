const passPostDataToModal = (elements, postID, state) => {
  const { modalTitle, modalDescr } = elements;
  const post = state.postsAdded.find((elem) => elem.postID === postID);
  modalTitle.textContent = post.title;
  modalDescr.textContent = post.description;
  elements.modalLink.setAttribute('href', `${post.link}`);
};

const changeVisitedPostsStyle = (postID) => {
  const visitedPost = document.querySelector(`a[data-id="${postID}"]`);
  visitedPost.classList.remove('fw-bold');
  visitedPost.classList.add('fw-normal', 'link-secondary');
};

export { changeVisitedPostsStyle, passPostDataToModal };
