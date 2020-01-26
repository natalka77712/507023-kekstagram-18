'use strict';

(function () {
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

  var DEFAULT_PREVIEW_PATH = 'img/upload-default-image.jpg';

  var imageUpload = document.querySelector('.img-upload');
  var uploadInput = imageUpload.querySelector('.img-upload__input');
  var imgUploadForm = document.querySelector('.img-upload__form');
  var imgUploadOverlay = imageUpload.querySelector('.img-upload__overlay');
  var popupCloseButton = imgUploadOverlay.querySelector('.img-upload__cancel');
  var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview');
  var effectsList = document.querySelector('.effects');
  var scale = window.gallery.similarPictures.querySelector('.scale');
  var scaleBigger = scale.querySelector('.scale__control--bigger');
  var scaleControlValue = scale.querySelector('.scale__control--value');
  var scaleSmaller = scale.querySelector('.scale__control--smaller');
  var sizeValue = scale.querySelector('.scale__control--value');
  var hashtagsInput = document.querySelector('.text__hashtags');
  var textInput = imageUpload.querySelector('.text__description');
  var pin = document.querySelector('.effect-level__pin');
  var effectValue = document.querySelector('.effect-level__value');
  var depth = document.querySelector('.effect-level__depth');

  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var onPopupEscPress = function (evt) {
    window.util.onKeyEscPress(evt, closePopup);
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

  effectsList.addEventListener('change', function (evt) {
    var currentEffect = effects[evt.target.value];
    var previewPicture = imgUploadPreview.querySelector('img');
    previewPicture .style.filter = currentEffect.effectName + '(' + currentEffect.max + currentEffect.points + ')';
    imgUploadPreview.classList = 'img-upload__preview';
    previewPicture.classList.add(currentEffect.class);
  });

  var setScaleValue = function (flag) {
    var valueInput = parseFloat(scaleControlValue.value);
    var totalValue = valueInput + flag * Scale.STEP;

    if (totalValue > Scale.MAX) {
      totalValue = Scale.MAX;
    } else if (totalValue < Scale.MIN) {
      totalValue = Scale.MIN;
    }

    scaleControlValue.value = totalValue + '%';
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

  var onFocusNotCloseMenu = function (input) {
    input.addEventListener('focus', function () {
      document.removeEventListener('keydown', onPopupEscPress);
    });
  };

  onFocusNotCloseMenu(textInput);
  onFocusNotCloseMenu(hashtagsInput);

  document.querySelector('.effects__list').addEventListener('change', function () {
    effectValue.setAttribute('value', 100);
    pin.style.left = '100%';
    depth.style.width = '100%';
  });

  pin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var widthLine = document.querySelector('.effect-level__line').offsetWidth;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var difference = pin.offsetLeft - shift.x;

      if (difference > 0 && difference < widthLine) {
        pin.style.left = difference * 100 / widthLine + '%';
        depth.style.width = difference * 100 / widthLine + '%';
        var fixNumber = difference / widthLine;
        document.querySelector('.img-upload__preview').style.filter = 'grayscale(' + fixNumber.toFixed(2) + ')';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      var saturation = Math.floor(pin.offsetLeft * 100 / widthLine);

      effectValue.setAttribute('value', saturation);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var reset = function () {
    textInput.value = '';
    hashtagsInput.value = '';
    sizeValue.value = '100%';
    imgUploadPreview.src = DEFAULT_PREVIEW_PATH;
    imgUploadPreview.style = '';
    imgUploadPreview.classList = '';
  };

  var markInvalid = function (element) {
    element.style.outline = '2px red solid';
  };

  hashtagsInput.addEventListener('invalid', function () {
    markInvalid(hashtagsInput);
  });

  textInput.addEventListener('invalid', function () {
    markInvalid(textInput);
  });

  var loadSuccessHandler = function () {
    closePopup();
    reset();
    var successInfo = successTemplate.cloneNode(true);
    window.gallery.main.appendChild(successInfo);

    var successBtn = successInfo.querySelector('.success__button');

    var handleEscPress = function (evt) {
      window.util.onKeyEscPress(evt, removeSuccessMessage);
    };

    var removeSuccessMessage = function () {
      window.gallery.main.removeChild(successInfo);
      successBtn.removeEventListener('click', removeSuccessMessage);
      document.removeEventListener('keydown', handleEscPress);
      document.removeEventListener('click', removeSuccessMessage);
    };

    successBtn.addEventListener('click', removeSuccessMessage);

    document.addEventListener('keydown', handleEscPress);

    document.addEventListener('click', removeSuccessMessage);

    if (document.querySelector('.error')) {
      document.querySelector('.error').remove();
    }
  };

  var errorHandler = function (errorMessage) {
    closePopup();

    var errorNode = errorTemplate.cloneNode(true);
    errorNode.querySelector('.error__title').textContent = errorMessage;
    window.gallery.main.appendChild(errorNode);

    var errorBtn = errorNode.querySelectorAll('.error__button');

    var handleEscPress = function (evt) {
      window.util.isEscEvent(evt, removeErrorMessage);
    };

    var removeErrorMessage = function () {
      window.gallery.main.removeChild(errorNode);
      document.removeEventListener('keydown', handleEscPress);
      document.removeEventListener('click', removeErrorMessage);
    };

    var errorBtnHandler = function (button) {
      button.addEventListener('click', removeErrorMessage);
    };

    document.addEventListener('keydown', handleEscPress);

    document.addEventListener('click', removeErrorMessage);

    for (var i = 0; i < errorBtn.length; i++) {
      errorBtnHandler(errorBtn[i]);
    }
  };

  popupCloseButton.addEventListener('click', function () {
    closePopup();
  });

  imgUploadForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(imgUploadForm), loadSuccessHandler, errorHandler);
    evt.preventDefault();
  });

})();
