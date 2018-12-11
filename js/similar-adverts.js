'use strict';

(function () {
  var popupTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var pins = document.querySelector('.map__pins');
  var map = window.map.canvas;
  var filterContainer = document.querySelector('.map__filters-container');
  var popupActive = null;
  var pinActive;
  var similarAdverts = [];
  var typeMap = window.utils.typeMap;
  var keyCodeMap = window.utils.keyCodeMap;
  var errorHandler = window.utils.errorHandler;
  var createFeatures = function (parent, features) {
    var destination = parent.querySelector('.popup__features');
    if (features.length === 0) {
      destination.remove();
      return;
    }
    destination.innerHTML = '';
    var featureTemplate = document.createElement('li');
    featureTemplate.classList.add('popup__feature');
    features.forEach(function (feature) {
      var advertFeature = featureTemplate.cloneNode(true);
      advertFeature.classList.add('popup__feature--' + feature);
      destination.appendChild(advertFeature);
    });
  };
  var createPhotos = function (parent, photos) {
    var destination = parent.querySelector('.popup__photos');
    if (photos.length === 0) {
      destination.remove();
      return;
    }
    var photoTemplate = destination.querySelector('.popup__photo');
    destination.innerHTML = '';
    photos.forEach(function (photo) {
      var advertPhoto = photoTemplate.cloneNode(true);
      advertPhoto.src = photo;
      destination.appendChild(advertPhoto);
    });
  };
  var closePopup = function () {
    if (popupActive === null) {
      return;
    }
    popupActive.remove();
    popupActive = null;
    pinActive.classList.remove('map__pin--active');
    pinActive = null;
    document.removeEventListener('keydown', escPressHandler);
  };
  var escPressHandler = window.utils.isKeyPressed(keyCodeMap.ESC, closePopup);
  var createPopup = function (advert) {
    var popup = popupTemplate.cloneNode(true);
    popup.querySelector('.popup__avatar').src = advert.author.avatar;
    popup.querySelector('.popup__title').textContent = advert.offer.title;
    popup.querySelector('.popup__text--address').textContent = advert.offer.address;
    popup.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь.';
    popup.querySelector('.popup__type').textContent = typeMap[advert.offer.type].name;
    popup.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
    popup.querySelector('.popup__text--time', 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout);
    createFeatures(popup, advert.offer.features);
    popup.querySelector('.popup__description').textContent = advert.offer.description;
    createPhotos(popup, advert.offer.photos);
    var popupCloseBtn = popup.querySelector('.popup__close');
    popupCloseBtn.addEventListener('click', function () {
      closePopup();
    });
    return popup;
  };
  var showPopup = function (pin, advert) {
    closePopup();
    pin.classList.add('map__pin--active');
    pinActive = pin;
    popupActive = createPopup(advert);
    map.insertBefore(popupActive, filterContainer);
    document.addEventListener('keydown', escPressHandler);
  };
  var createPin = function (advert) {
    var pin = pinTemplate.cloneNode(true);
    pin.style.top = advert.location.y + 'px';
    pin.style.left = advert.location.x + 'px';
    var img = pin.querySelector('img');
    img.src = advert.author.avatar;
    img.alt = advert.offer.title;
    pin.appendChild(img);
    pin.addEventListener('click', function () {
      showPopup(pin, advert);
    });
    return pin;
  };
  var showSimilarAdverts = function (adverts) {
    var _pins = document.createDocumentFragment();
    adverts.forEach(function (advert) {
      var pin = createPin(advert);
      similarAdverts.push(pin);
      _pins.appendChild(pin);
    });
    pins.appendChild(_pins);
  };
  var clearSimilarAdverts = function () {
    closePopup();
    similarAdverts.forEach(function (similarAdvert) {
      similarAdvert.remove();
    });
    similarAdverts.length = 0;
  };
  window.similarAdverts = {
    showSimilarAdverts: showSimilarAdverts,
    clearSimilarAdverts: clearSimilarAdverts
  };
  var initialize = function () {
    window.backend.get('https://js.dump.academy/keksobooking/data', window.data.set, errorHandler);
  };
  initialize();
})();
