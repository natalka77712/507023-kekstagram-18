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

var getRandomArrayItem = function (array) {
  var random = array[Math.floor(Math.random() * array.length)];
  return random;
};

var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var generateCommentsArray = function (item) {
  var images = [];

  for (var i = 1; i <= item; i++) {
    images.push({
      author: {
        avatar: 'img/avatar-' + getRandomInRange(MIN_AVATAR, MAX_AVATAR) + '.svg',
        message: getRandomArrayItem(COMMENTS),
        name: getRandomArrayItem(NAMES)
      },
    });
  }
  return images;
};

var generatePhotoImage = function (index) {
  return {
    url: 'photos/' + (index + 1) + '.jpg',
    description: getRandomArrayItem(DESCRIPTIONS),
    likes: getRandomInRange(MIN_LIKES, MAX_LIKES),
    comments: generateCommentsArray()
  };
};

var renderPhoto = function (photo) {
  var photoItem = similarPictureTemplate.cloneNode(true);

  photoItem.querySelector('.picture__likes').textContent = photo.likes;
  photoItem.querySelector('.picture__img').src = photo.url;
  photoItem.querySelector('.picture__img').alt = photo.description;
  photoItem.querySelector('.picture__comments').textContent = photo.comments.message;

  return photoItem;
};

var generatePhotosArray = function () {
  var photos = [];
  for (var i = 0; i < AMOUNT_IMAGES; i++) {
    photos.push(generatePhotoImage(i));
  }

  return photos;
};

var renderPhotos = function (photos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPhoto(photos[i]));
  }
  similarPictures.appendChild(fragment);
};

var init = function () {
  renderPhotos(generatePhotosArray());
};

init();
