'use strict';

(function () {
  var filterForm = document.querySelector('.map__filters');
  var filterFormFields = filterForm.querySelectorAll('input, select');
  var advertPinTemplate = document.querySelector('#pin').content.querySelector('button');
  var similarAdverts = [];
  var advertPins = document.querySelector('.map__pins');
  var workspace = window.map.workspace;

  var createAdvertPin = function (advert) {
    var advertPin = advertPinTemplate.cloneNode(true);
    advertPin.style.top = advert.location.y + 'px';
    advertPin.style.left = advert.location.x + 'px';
    var img = advertPin.querySelector('img');
    img.src = advert.author.avatar;
    img.alt = advert.offer.title;
    advertPin.appendChild(img);
    return advertPin;
  };
  var avatars = [
    'img/avatars/user01.png',
    'img/avatars/user02.png',
    'img/avatars/user03.png',
    'img/avatars/user04.png',
    'img/avatars/user05.png',
    'img/avatars/user06.png',
    'img/avatars/user07.png',
    'img/avatars/user08.png',
  ];
  var titles = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var types = ['palace', 'flat', 'house', 'bungalo'];
  var timeinList = ['12:00', '13:00', '14:00'];
  var timeoutList = timeinList;
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photos = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var generateRandomAdvert = function (presetAvatars, presetTitles) {
    var location = {
      x: window.utils.getRandom(workspace.minX, workspace.maxX),
      y: window.utils.getRandom(workspace.minY, workspace.maxY)
    };
    return {
      author: {
        avatar: window.utils.getRandomValue(presetAvatars, true)
      },
      offer: {
        title: window.utils.getRandomValue(presetTitles, true),
        address: location.x + ', ' + location.y,
        price: window.utils.getRandom(1000, 1000000),
        type: window.utils.getRandomValue(types),
        rooms: window.utils.getRandom(1, 5),
        guests: window.utils.getRandom(0, 5),
        checkin: window.utils.getRandomValue(timeinList),
        checkout: window.utils.getRandomValue(timeoutList),
        features: window.utils.getRandomValues(features.slice()),
        description: '',
        photos: window.utils.shuffleArray(photos)
      },
      location: location
    };
  };

  var generateRandomAdverts = function () {
    var adverts = [];
    var presetAvatars = avatars.slice();
    var presetTitles = titles.slice();
    for (var i = 0; i < 8; i++) {
      var advert = generateRandomAdvert(presetAvatars, presetTitles);
      adverts.push(advert);
    }
    return adverts;
  };

  var successHandler = function (adverts) {
    var pins = document.createDocumentFragment();
    adverts.forEach(function (advert) {
      if (advert.hasOwnProperty('offer')) {
        var advertPin = createAdvertPin(advert);
        advertPin.addEventListener('click', function () {
          window.popup.showPopup(advertPin, advert);
        });
        pins.appendChild(advertPin);
        similarAdverts.push(advertPin);
      }
    });
    advertPins.appendChild(pins);
    window.utils.toggleFormState(filterForm, false);
    window.utils.toggleFieldsState(filterFormFields, false);
  };

  var showSimilarAdverts = function () {
    window.backend.get('https://js.dump.academy/keksobooking/data', successHandler, window.utils.errorHandler);
  };

  var clearSimilarAdverts = function () {
    similarAdverts.forEach(function (pin) {
      if (pin !== window.map.mainPin) {
        pin.remove();
      }
    });
    similarAdverts.length = 0;
    window.utils.toggleFormState(filterForm, true);
    window.utils.toggleFieldsState(filterFormFields, true);
  };

  window.similarAdverts = {
    showSimilarAdverts: showSimilarAdverts,
    clearSimilarAdverts: clearSimilarAdverts
  };

  clearSimilarAdverts();
})();
