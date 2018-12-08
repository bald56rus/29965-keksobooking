'use strict';

(function () {
  var main = document.querySelector('main');
  var activeErrorPopup;
  var errorPopupTemplate = document.querySelector('#error').content.querySelector('.error');
  var typesMap = {
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
  var getRandomValue = function (source, truncate) {
    truncate = truncate || false;
    shuffleArray(source);
    var index = getRandom(0, source.length - 1);
    var value = source[index];
    if (truncate) {
      source.splice(index, 1);
    }
    return value;
  };
  var getRandomValues = function (source) {
    var destination = [];
    var counter = getRandom(0, source.length - 1);
    while (destination.length < counter) {
      var value = getRandomValue(source, true);
      destination.push(value);
    }
    return destination;
  };
  var keydownHandler = function (keydownEvt, keyCode, action) {
    if (keydownEvt.keyCode === keyCode) {
      action();
    }
  };
  var errorPopupCloseHandler = function () {
    activeErrorPopup.remove();
    document.removeEventListener('click', errorPopupCloseHandler);
  };

  var escPressHandler = function (evt) {
    window.utils.keydownHandler(evt, 27, errorPopupCloseHandler);
    document.removeEventListener('keydown', escPressHandler);
  };

  var errorHandler = function (message) {
    activeErrorPopup = errorPopupTemplate.cloneNode(true);
    activeErrorPopup.querySelector('.error__message').textContent = message;
    var errorCloseBtn = activeErrorPopup.querySelector('.error__button');
    errorCloseBtn.addEventListener('click', errorPopupCloseHandler);
    document.addEventListener('click', errorPopupCloseHandler);
    document.addEventListener('keydown', escPressHandler);
    main.appendChild(activeErrorPopup);
  };

  window.utils = {
    typesMap: typesMap,
    getRandom: getRandom,
    shuffleArray: shuffleArray,
    getRandomValue: getRandomValue,
    getRandomValues: getRandomValues,
    keydownHandler: keydownHandler,
    errorHandler: errorHandler
  };
})();
