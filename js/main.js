'use strict';

var ESC_KEYCODE = 27;
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

var bigPicture = document.querySelector('.big-picture');
var pictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
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

var onPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePreview();
  }
};

var closePreview = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onPictureEscPress);
};

pictureCloseButton.addEventListener('click', function () {
  closePreview();
});

var imageUpload = document.querySelector('.img-upload');
var uploadInput = imageUpload.querySelector('.img-upload__input');
var imgUploadOverlay = imageUpload.querySelector('.img-upload__overlay');
var popupCloseButton = imgUploadOverlay.querySelector('.img-upload__cancel');
var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview');

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function () {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  imgUploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

uploadInput.addEventListener('change', openPopup);
popupCloseButton.addEventListener('click', closePopup);


var effects = {
  none: {
    class: 'effects__preview--none',
  },
  chrome: {
    class: 'effects__preview--chrome',
    effectName: 'grayscale',
    min: 0,
    max: 1,
    points: ''
  },
  sepia: {
    class: 'effects__preview--sepia',
    effectName: 'sepia',
    min: 0,
    max: 1,
    points: ''
  },
  marvin: {
    class: 'effects__preview--marvin',
    effectName: 'invert',
    min: 0,
    max: 100,
    points: '%'
  },
  phobos: {
    class: 'effects__preview--phobos',
    effectName: 'blur',
    min: 0,
    max: 3,
    points: 'px'
  },
  heat: {
    class: 'effects__preview--heat',
    effectName: 'brightness',
    min: 1,
    max: 3,
    points: ''
  }
};

var effectsList = document.querySelector('.effects');

effectsList.addEventListener('change', function (evt) {
  var currentEffect = effects[evt.target.value];
  var previewPicture = imgUploadPreview.querySelector('img');
  previewPicture .style.filter = currentEffect.effectName + '(' + currentEffect.max + currentEffect.points + ')';
  imgUploadPreview.classList = 'img-upload__preview';
  previewPicture.classList.add(currentEffect.class);
});

var scale = similarPictures.querySelector('.scale');
var scaleBigger = scale.querySelector('.scale__control--bigger');
var scaleInputElement = scale.querySelector('.scale__control--value');
var scaleSmaller = scale.querySelector('.scale__control--smaller');
var hashtagsInput = document.querySelector('.text__hashtags');

var Scale = {
  MAX: 100,
  MIN: 25,
  STEP: 25
};

var Flag = {
  MINUS: -1,
  PLUS: 1
};

var HASHTAGS_OPTIONS = {
  MAX_QAUNTITY: 5,
  MAX_LENGTH: 20,
};

var setScaleValue = function (flag) {
  var valueInput = parseFloat(scaleInputElement.value);
  var totalValue = valueInput + flag * Scale.STEP;

  if (totalValue > Scale.MAX) {
    totalValue = Scale.MAX;
  } else if (totalValue < Scale.MIN) {
    totalValue = Scale.MIN;
  }

  scaleInputElement.value = totalValue + '%';
  imgUploadPreview.style.transform = 'scale(' + (totalValue / Scale.MAX) + ')';
};

scaleSmaller.addEventListener('click', function () {
  setScaleValue(Flag.MINUS);
});

scaleBigger.addEventListener('click', function () {
  setScaleValue(Flag.PLUS);
});

var validationHashtags = function () {
  var hashtags = hashtagsInput.value.split(' ').map(function (elem) {
    return elem.toLowerCase();
  }).filter(function (elem) {
    return elem !== '';
  });
  hashtagsInput.value = hashtags.join(' ');

  for (var i = 0; i < hashtags.length; i++) {
    var firstToken = hashtags[i][0];
    var inkr = i + 1;
    if (firstToken !== '#') {
      hashtagsInput.setCustomValidity('Хэштег должен начинаться с символа #');
    } else if (hashtags.length > HASHTAGS_OPTIONS.MAX_QAUNTITY) {
      hashtagsInput.setCustomValidity('Не более 5 хэштегов');
    } else if (hashtags[i].length > HASHTAGS_OPTIONS.MAX_LENGTH) {
      hashtagsInput.setCustomValidity('Хэштег не может быть длиннее 20 символов, включая решетку');
    } else if (firstToken === '#' && hashtags[i].length === 1) {
      hashtagsInput.setCustomValidity('Хэштег не может состоять из одной решетки');
    } else if (hashtags[i].indexOf('#', 1) !== -1) {
      hashtagsInput.setCustomValidity('Хэштеги должны разделяться пробелом');
      break;
    } else if (hashtags.indexOf(hashtags[i], inkr) !== -1) {
      hashtagsInput.setCustomValidity('Хэштеги не могут повторяться');
      break;
    } else {
      hashtagsInput.setCustomValidity('');
    }
  }
};

hashtagsInput.addEventListener('change', validationHashtags);


var textInput = imageUpload.querySelector('.text__description');

var onFocusNotCloseMenu = function (input) {
  input.addEventListener('focus', function () {
    document.removeEventListener('keydown', onPopupEscPress);
  });
};

onFocusNotCloseMenu(textInput);
onFocusNotCloseMenu(hashtagsInput);

init();
