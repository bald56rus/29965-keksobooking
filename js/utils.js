'use strict';

(function () {
  var popupContainer = document.querySelector('main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var activePopup;
  var KeyCode = {
    ESC: 27
  };
  var houseTypeMap = {
    flat: {name: 'Квартира', minPrice: 1000},
    bungalo: {name: 'Бунгало', minPrice: 0},
    house: {name: 'Дом', minPrice: 5000},
    palace: {name: 'Дворец', minPrice: 10000}
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
  var escPressHandler = isKeyPressed(KeyCode.ESC, closePopupHandler);
  var errorHandler = function () {
    activePopup = errorTemplate.cloneNode(true);
    popupContainer.appendChild(activePopup);
    var closeBtn = activePopup.querySelector('.error__button');
    closeBtn.addEventListener('click', closePopupHandler);
    document.addEventListener('click', closePopupHandler);
    document.addEventListener('keydown', escPressHandler);
  };

  window.utils = {
    KeyCode: KeyCode,
    houseTypeMap: houseTypeMap,
    isKeyPressed: isKeyPressed,
    errorHandler: errorHandler,
    shuffleArray: shuffleArray,
    popupContainer: popupContainer
  };
})();
