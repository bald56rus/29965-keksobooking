'use strict';

(function () {
  var popupTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var pins = document.querySelector('.map__pins');
  var map = window.map.canvas;
  var QUANTITY_VISIBLE_SIMILAR_ADVERTS = 5;
  var filterContainer = document.querySelector('.map__filters-container');
  var typeFilter = filterContainer.querySelector('#housing-type');
  var priceFilter = filterContainer.querySelector('#housing-price');
  var roomsFilter = filterContainer.querySelector('#housing-rooms');
  var guestsFilter = filterContainer.querySelector('#housing-guests');
  var featuresFilter = filterContainer.querySelectorAll('.map__checkbox');
  var selectedFeatures = [];
  var timerId = null;
  var filterMap = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
  };
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
  var trancateVisibleAdverts = function (adverts) {
    if (QUANTITY_VISIBLE_SIMILAR_ADVERTS >= adverts.length) {
      return adverts;
    }
    return adverts.slice(0, QUANTITY_VISIBLE_SIMILAR_ADVERTS);
  };
  var similarBy = function (filter) {
    return function (advert) {
      return advert.offer[filterMap[filter.id]].toString() === filter.value;
    };
  };
  var similarByPrice = function (advert) {
    switch (priceFilter.value) {
      case 'low': {
        return advert.offer.price < 10000;
      }
      case 'middle': {
        return advert.offer.price >= 10000 && advert.offer.price <= 50000;
      }
      case 'high': {
        return advert.offer.price > 50000;
      }
      default: {
        return false;
      }
    }
  };
  var similarByFeatures = function (advert) {
    var advertFeatures = advert.offer.features;
    if (selectedFeatures.length > advertFeatures.length) {
      return false;
    }
    for (var i = 0; i < selectedFeatures.length; i++) {
      if (advertFeatures.indexOf(selectedFeatures[i]) === -1) {
        return false;
      }
    }
    return true;
  };
  var showFilteredAdverts = function () {
    clearSimilarAdverts();
    var originalAdverts = window.data.get();
    var filteredAdverts = originalAdverts.slice();
    if (typeFilter.value !== 'any') {
      filteredAdverts = filteredAdverts.filter(similarBy(typeFilter));
    }
    if (priceFilter.value !== 'any') {
      filteredAdverts = filteredAdverts.filter(similarByPrice);
    }
    if (roomsFilter.value !== 'any') {
      filteredAdverts = filteredAdverts.filter(similarBy(roomsFilter));
    }
    if (guestsFilter.value !== 'any') {
      filteredAdverts = filteredAdverts.filter(similarBy(guestsFilter));
    }
    if (selectedFeatures.length > 0) {
      filteredAdverts = filteredAdverts.filter(similarByFeatures);
    }
    showSimilarAdverts(filteredAdverts);
  };
  var showSimilarAdverts = function (adverts) {
    var _pins = document.createDocumentFragment();
    trancateVisibleAdverts(adverts).forEach(function (advert) {
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
    filterContainer.querySelectorAll('select, input').forEach(function (field) {
      field.addEventListener('change', function () {
        timerId = setTimeout(function () {
          clearTimeout(timerId);
          showFilteredAdverts();
        }, 500);
      });
    });
    featuresFilter.forEach(function (feature) {
      feature.addEventListener('change', function (evt) {
        if (evt.target.checked) {
          selectedFeatures.push(evt.target.value);
        } else {
          var index = selectedFeatures.indexOf(evt.target.value);
          selectedFeatures.splice(index, 1);
        }
      });
    });
  };
  initialize();
})();
