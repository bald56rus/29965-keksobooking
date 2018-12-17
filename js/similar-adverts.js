'use strict';

(function () {
  var QUANTITY_VISIBLE_ADVERTS = 5;
  var DEBOUNCE_TIMEOUT = 500;
  var HousePriceEnum = {
    LOW_MAX: 10000,
    MIDDLE_MIN: 10000,
    MIDDLE_MAX: 50000,
    HIGH_MIN: 50000
  };
  var HouseTypeEnum = window.utils.HouseTypeEnum;
  var KeyCodeEnum = window.utils.KeyCodeEnum;
  var map = window.map.canvas;
  var errorHandler = window.utils.errorHandler;
  var shuffle = window.utils.shuffleArray;
  var isKeyPressed = window.utils.isKeyPressed;
  var popupTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var pins = document.querySelector('.map__pins');
  var filterContainer = document.querySelector('.map__filters-container');
  var filterFields = filterContainer.querySelectorAll('select, input');
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
  var pinActive = null;
  var similarAdverts = [];
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
  var createPopup = function (advert) {
    var popup = popupTemplate.cloneNode(true);
    popup.querySelector('.popup__avatar').src = advert.author.avatar;
    popup.querySelector('.popup__title').textContent = advert.offer.title;
    popup.querySelector('.popup__text--address').textContent = advert.offer.address;
    popup.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь.';
    popup.querySelector('.popup__type').textContent = HouseTypeEnum[advert.offer.type.toUpperCase()].name;
    popup.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
    popup.querySelector('.popup__text--time', 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout);
    createFeatures(popup, advert.offer.features);
    popup.querySelector('.popup__description').textContent = advert.offer.description;
    createPhotos(popup, advert.offer.photos);
    var closeBtn = popup.querySelector('.popup__close');
    closeBtn.addEventListener('click', function () {
      closePopup();
    });
    return popup;
  };
  var escPressHandler = isKeyPressed(KeyCodeEnum.ESC, closePopup);
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
  var truncateAdverts = function (adverts) {
    return QUANTITY_VISIBLE_ADVERTS >= adverts.length ? adverts : shuffle(adverts).slice(0, QUANTITY_VISIBLE_ADVERTS);
  };
  var similarBy = function (filter) {
    return function (advert) {
      return filter.value === 'any' ? true : advert.offer[filterMap[filter.id]].toString() === filter.value;
    };
  };
  var similarByPrice = function (advert) {
    if (priceFilter.value === 'any') {
      return true;
    }
    switch (priceFilter.value) {
      case 'low': {
        return advert.offer.price < HousePriceEnum.LOW_MAX;
      }
      case 'middle': {
        return advert.offer.price >= HousePriceEnum.MIDDLE_MIN && advert.offer.price <= HousePriceEnum.MIDDLE_MAX;
      }
      case 'high': {
        return advert.offer.price > HousePriceEnum.HIGH_MIN;
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
    return !selectedFeatures.some(function (feature) {
      return advertFeatures.indexOf(feature) === -1;
    });
  };
  var showFilteredAdverts = function () {
    clearSimilarAdverts();
    var filteredAdverts = window.data.get()
      .filter(similarBy(typeFilter))
      .filter(similarByPrice)
      .filter(similarBy(roomsFilter))
      .filter(similarBy(guestsFilter))
      .filter(similarByFeatures);
    showSimilarAdverts(filteredAdverts);
  };
  var showSimilarAdverts = function (adverts) {
    var _pins = document.createDocumentFragment();
    truncateAdverts(adverts).forEach(function (advert) {
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
  var filterFieldChangeHandler = function () {
    timerId = setTimeout(function () {
      clearTimeout(timerId);
      showFilteredAdverts();
    }, DEBOUNCE_TIMEOUT);
  };
  var featuresChangeHandler = function (evt) {
    if (evt.target.checked) {
      selectedFeatures.push(evt.target.value);
    } else {
      var index = selectedFeatures.indexOf(evt.target.value);
      selectedFeatures.splice(index, 1);
    }
  };
  var activateFilter = function () {
    filterFields.forEach(function (field) {
      field.addEventListener('change', filterFieldChangeHandler);
    });
    featuresFilter.forEach(function (feature) {
      feature.addEventListener('change', featuresChangeHandler);
    });
  };
  var deactivateFilter = function () {
    filterFields.forEach(function (field) {
      field.removeEventListener('change', filterFieldChangeHandler);
    });
    featuresFilter.forEach(function (feature) {
      feature.removeEventListener('change', featuresChangeHandler);
    });
  };
  window.similarAdverts = {
    showSimilarAdverts: showSimilarAdverts,
    clearSimilarAdverts: clearSimilarAdverts,
    activateFilter: activateFilter,
    deactivateFilter: deactivateFilter
  };
  var initialize = function () {
    window.backend.get('https://js.dump.academy/keksobooking/data', window.data.set, errorHandler);
  };
  initialize();
})();
