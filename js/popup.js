'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var popupTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var popupActive;
  var pinActive;
  var map = window.map.map;
  var filter = window.map.filter;

  var createElement = function (source, destination, value) {
    var element = source.querySelector(destination);
    element.textContent = value;
  };
  var createImgElement = function (source, destination, value) {
    var element = source.querySelector(destination);
    element.src = value;
  };
  var createFeatures = function (parent, featureList) {
    var destination = parent.querySelector('.popup__features');
    if (featureList.length === 0) {
      destination.remove();
      return;
    }
    destination.innerHTML = '';
    var template = document.createElement('li');
    template.classList.add('popup__feature');
    for (var i = 0; i < featureList.length; i++) {
      var feature = template.cloneNode(true);
      feature.classList.add('popup__feature--' + featureList[i]);
      destination.appendChild(feature);
    }
  };
  var createPhotos = function (parent, photoList) {
    var destination = parent.querySelector('.popup__photos');
    var template = destination.querySelector('.popup__photo');
    destination.innerHTML = '';
    for (var i = 0; i < photoList.length; i++) {
      var photo = template.cloneNode(true);
      photo.src = photoList[i];
      destination.appendChild(photo);
    }
  };
  var createPopup = function (advert) {
    var popup = popupTemplate.cloneNode(true);
    var popupCloseBtn = popup.querySelector('.popup__close');
    popupCloseBtn.addEventListener('click', closePopupHandler);
    createImgElement(popup, '.popup__avatar', advert.author.avatar);
    createElement(popup, '.popup__title', advert.offer.title);
    createElement(popup, '.popup__text--address', advert.offer.address);
    createElement(popup, '.popup__text--price', advert.offer.price + '₽/ночь.');
    createElement(popup, '.popup__type', window.utils.typesMap[advert.offer.type].name);
    createElement(popup, '.popup__text--capacity', advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей');
    createElement(popup, '.popup__text--time', 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout);
    createFeatures(popup, advert.offer.features);
    createElement(popup, '.popup__description', advert.offer.description);
    createPhotos(popup, advert.offer.photos);
    return popup;
  };
  var closePopupHandler = function () {
    if (!popupActive) {
      return;
    }
    popupActive.remove();
    if (pinActive) {
      pinActive.classList.remove('map__pin--active');
      pinActive = null;
    }
    document.removeEventListener('keydown', escPressHandler);
  };
  var escPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopupHandler();
    }
  };
  var showPopupHandler = function (pin, advert) {
    closePopupHandler();
    pinActive = pin;
    pinActive.classList.add('map__pin--active');
    popupActive = createPopup(advert);
    document.addEventListener('keydown', escPressHandler);
    map.insertBefore(popupActive, filter);
  };
  window.popup = {
    showPopup: showPopupHandler,
    closePopup: closePopupHandler
  };
})();
