const changeVisitedPostsStyle = (postElement) => {
  postElement.addEventListener('click', (e) => {
    const postTitleID = e.target.getAttribute('data-id');
    const visitedPost = document.querySelector(`a[data-id="${postTitleID}"]`);
    visitedPost.classList.remove('fw-bold');
    visitedPost.classList.add('fw-normal', 'link-secondary');
  });
};

export default changeVisitedPostsStyle;
