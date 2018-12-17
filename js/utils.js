'use strict';

(function () {
  var popupContainer = document.querySelector('main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var activePopup;
  var KeyCodeEnum = {
    ESC: 27
  };
  var HouseTypeEnum = {
    FLAT: {name: 'Квартира', minPrice: 1000},
    BUNGALO: {name: 'Бунгало', minPrice: 0},
    HOUSE: {name: 'Дом', minPrice: 5000},
    PALACE: {name: 'Дворец', minPrice: 10000}
  };
  var getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  var shuffleArray = function (source) {
    for (var i = 0; i < source.length; i++) {
      var j = getRandom(0, source.length - 1);
      var swap = source[i];
      source[i] = source[j];
      source[j] = swap;
    }
    return source;
  };
  var isKeyPressed = function (keyCode, handler) {
    return function (evt) {
      if (evt.keyCode === keyCode) {
        handler();
      }
    };
  };
  var closePopupHandler = function () {
    activePopup.remove();
    document.removeEventListener('click', closePopupHandler);
    document.removeEventListener('keydown', escPressHandler);
  };
  var escPressHandler = isKeyPressed(KeyCodeEnum.ESC, closePopupHandler);
  var errorHandler = function () {
    activePopup = errorTemplate.cloneNode(true);
    popupContainer.appendChild(activePopup);
    var closeBtn = activePopup.querySelector('.error__button');
    closeBtn.addEventListener('click', closePopupHandler);
    document.addEventListener('click', closePopupHandler);
    document.addEventListener('keydown', escPressHandler);
  };
  window.utils = {
    KeyCodeEnum: KeyCodeEnum,
    HouseTypeEnum: HouseTypeEnum,
    isKeyPressed: isKeyPressed,
    errorHandler: errorHandler,
    shuffleArray: shuffleArray,
    popupContainer: popupContainer
  };
})();
