'use strict';

(function () {
  var AMOUNT_IMAGES = 25;

  var bigPicture = document.querySelector('.big-picture');
  var pictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
  bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  var similarPictures = document.querySelector('.pictures');
  var similarPictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');

  var generatePhotosArray = function () {
    var photos = [];
    for (var i = 0; i < AMOUNT_IMAGES; i++) {
      photos.push(window.data.generatePhotoImage(i));
    }
    return photos;
  };

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

  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderPhoto(photos[i]));
    }
    similarPictures.appendChild(fragment);
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

  var init = function () {
    var photosArray = generatePhotosArray();
    renderPhotos(photosArray);
    renderBigPicture(photosArray[0]);
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

  init();

  window.gallery = {
    similarPictures: similarPictures,
  };
})();
