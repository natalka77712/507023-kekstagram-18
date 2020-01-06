'use strict';

(function () {
  var MIN_AVATAR = 1;
  var MAX_AVATAR = 6;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var COMMENTS = ['Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

  var NAMES = ['Виктор', 'Василий', 'Диана', 'Мария', 'Николай', 'Светлана'];

  var DESCRIPTIONS = ['Все супер!', 'Цените мгновения, они прекрасны', 'Как не хочется возвращаться домой',
    'Шикарные пейзажи', 'Бери от жизни все!', 'Настрой на победу!', 'Любите и берегите друг друга'];

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

  window.data = {
    DESCRIPTIONS: DESCRIPTIONS,
    generateCommentsArray: generateCommentsArray,
    generatePhotoImage: generatePhotoImage,
  };
})();
