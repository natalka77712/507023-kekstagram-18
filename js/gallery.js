'use strict';

(function () {

  var bigPicture = document.querySelector('.big-picture');
  var pictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
  bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  var similarPictures = document.querySelector('.pictures');
  var main = document.querySelector('main');
  var similarPictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');

  var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');

  var renderPhoto = function (photo) {
    var photoItem = similarPictureTemplate.cloneNode(true);

    photoItem.querySelector('.picture__likes').textContent = photo.likes;
    photoItem.querySelector('.picture__img').src = photo.url;
    photoItem.querySelector('.picture__img').alt = photo.description;
    photoItem.querySelector('.picture__comments').textContent = photo.comments.message;

    photoItem.addEventListener('click', function () {
      renderBigPicture(photo);
      bigPicture.classList.remove('hidden');
      document.addEventListener('keydown', onPictureEscPress);
    });

    return photoItem;
  };

  var renderBigPicture = function (photo) {
    bigPicture.querySelector('.big-picture__img img').src = photo.url;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;
    bigPicture.querySelector('.social__caption').alt = photo.description;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;

    var commentsUnit = bigPicture.querySelectorAll('.social__comment');
    for (var i = 0; i < commentsUnit.length; i++) {
      if (photo.comments[i]) {
        commentsUnit[i].querySelector('.social__picture').src = photo.comments[i].avatar;
        commentsUnit[i].querySelector('.social__picture').alt = photo.comments[i].name;
        commentsUnit[i].querySelector('.social__text').textContent = photo.comments[i].message;
      }
    }
  };

  var onPictureEscPress = function (evt) {
    window.util.onKeyEscPress(evt, closePreview);
  };

  var closePreview = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onPictureEscPress);
  };

  pictureCloseButton.addEventListener('click', function () {
    closePreview();
  });

  var successHandler = function (photos) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderPhoto(photos[i]));
    }
    similarPictures.appendChild(fragment);

    if (document.querySelector('.error')) {
      document.querySelector('.error').remove();
    }
  };

  var errorHandler = function (errorMessage) {
    var errorNode = errorTemplate.cloneNode(true);
    errorNode.querySelector('.error__title').textContent = errorMessage;
    main.appendChild(errorNode);
  };

  var init = function () {
    window.backend.load(successHandler, errorHandler);
  };

  init();

  window.gallery = {
    similarPictures: similarPictures,
    main: main,
  };
})();
