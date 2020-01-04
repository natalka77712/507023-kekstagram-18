'use strict';

var AMOUNT_IMAGES = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_AVATAR = 1;
var MAX_AVATAR = 6;
var COMMENTS = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var NAMES = ['Виктор', 'Василий', 'Диана', 'Мария', 'Николай', 'Светлана'];

var DESCRIPTIONS = ['Все супер!', 'Цените мгновения, они прекрасны', 'Как не хочется возвращаться домой',
  'Шикарные пейзажи', 'Бери от жизни все!', 'Настрой на победу!', 'Любите и берегите друг друга'];

var similarPictures = document.querySelector('.pictures');
var similarPictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

var getCommentsCount = function () {
  return getRandomInRange(0, 5);
};

var getRandomArrayItem = function (array) {
  var random = array[Math.floor(Math.random() * array.length)];
  return random;
};

var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var generateCommentsArray = function () {
  var comments = [];
  var commentsCount = getCommentsCount();

  for (var i = 1; i <= commentsCount; i++) {
    comments.push({
      avatar: 'img/avatar-' + getRandomInRange(MIN_AVATAR, MAX_AVATAR) + '.svg',
      message: getRandomArrayItem(COMMENTS),
      name: getRandomArrayItem(NAMES)
    });
  }
  return comments;
};

var generatePhotoImage = function (index) {
  return {
    url: 'photos/' + (index + 1) + '.jpg',
    description: getRandomArrayItem(DESCRIPTIONS),
    likes: getRandomInRange(MIN_LIKES, MAX_LIKES),
    comments: generateCommentsArray()
  };
};

var generatePhotosArray = function () {
  var photos = [];
  for (var i = 0; i < AMOUNT_IMAGES; i++) {
    photos.push(generatePhotoImage(i));
  }

  return photos;
};

var renderPhoto = function (photo) {
  var photoItem = similarPictureTemplate.cloneNode(true);

  photoItem.querySelector('.picture__likes').textContent = photo.likes;
  photoItem.querySelector('.picture__img').src = photo.url;
  photoItem.querySelector('.picture__img').alt = photo.description;
  photoItem.querySelector('.picture__comments').textContent = photo.comments.message;

  return photoItem;
};

var renderPhotos = function (photos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPhoto(photos[i]));
  }
  similarPictures.appendChild(fragment);
};

var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');
bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');

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

init();
