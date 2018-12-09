'use strict';

(function () {
  var main = document.querySelector('main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var activePopup;
  var keyCodeMap = {
    ESC: 27
  };
  var typeMap = {
    flat: {name: 'Квартира', minPrice: 1000},
    bungalo: {name: 'Бунгало', minPrice: 0},
    house: {name: 'Дом', minPrice: 5000},
    palace: {name: 'Дворец', minPrice: 10000}
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
  var escPressHandler = isKeyPressed(keyCodeMap.ESC, closePopupHandler);
  var errorHandler = function () {
    activePopup = errorTemplate.cloneNode(true);
    main.appendChild(activePopup);
    var closeBtn = activePopup.querySelector('.error__button');
    closeBtn.addEventListener('click', closePopupHandler);
    document.addEventListener('click', closePopupHandler);
    document.addEventListener('keydown', escPressHandler);
  };

  window.utils = {
    keyCodeMap: keyCodeMap,
    typeMap: typeMap,
    isKeyPressed: isKeyPressed,
    errorHandler: errorHandler
  };
})();
