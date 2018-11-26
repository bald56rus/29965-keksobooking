'use strict';

(function () {
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

  var getPresetAvatars = function () {
    var avatars = [];
    for (var i = 1; i <= 8; i++) {
      avatars.push('img/avatars/user0' + i + '.png');
    }
    return avatars;
  };

  var getPresetTitles = function () {
    return [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ];
  };

  var getRandomType = function () {
    var types = ['palace', 'flat', 'house', 'bungalo'];
    return getRandomValue(types);
  };

  var getRandomFeatures = function () {
    var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
    return getRandomValues(features);
  };

  var getRandomPhotos = function () {
    var photos = [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ];
    return shuffleArray(photos);
  };

  var getMapWorkspace = function () {
    var pinWidth = 50;
    var mapWidth = document.querySelector('.map__overlay').clientWidth;
    var minX = pinWidth;
    var maxX = mapWidth - pinWidth;
    var minY = 130;
    var maxY = 630;
    return {MinX: minX, MinY: minY, MaxX: maxX, MaxY: maxY};
  };

  var getRandomLocation = function (map) {
    var x = getRandom(map.MinX, map.MaxX);
    var y = getRandom(map.MinY, map.MaxY);
    return {x: x, y: y};
  };

  var generateRandomAd = function (avatar, title, type, checkin, checkout, features, photos) {
    var mapWorkspace = getMapWorkspace();
    var location = getRandomLocation(mapWorkspace);
    return {
      author: {
        avatar: avatar
      },
      offer: {
        title: title,
        address: location.x + ', ' + location.y,
        price: getRandom(1000, 1000000),
        type: type,
        rooms: getRandom(1, 5),
        guests: getRandom(0, 5),
        checkin: checkin,
        checkout: checkout,
        features: features,
        description: '',
        photos: photos
      },
      location: location
    };
  };

  var generateRandomAds = function () {
    var ads = [];
    var avatars = getPresetAvatars();
    var titles = getPresetTitles();
    var checkinList = ['12:00', '13:00', '14:00'];
    var checkoutList = checkinList;
    for (var i = 0; i < 8; i++) {
      var avatar = getRandomValue(avatars, true);
      var title = getRandomValue(titles, true);
      var type = getRandomType();
      var checkin = getRandomValue(checkinList);
      var checkout = getRandomValue(checkoutList);
      var features = getRandomFeatures();
      var photos = getRandomPhotos();
      var ad = generateRandomAd(avatar, title, type, checkin, checkout, features, photos);
      ads.push(ad);
    }
    return ads;
  };

  var renderAdPin = function (template, ad) {
    var adPin = template.cloneNode(true);
    adPin.style.top = ad.location.y + 'px';
    adPin.style.left = ad.location.x + 'px';
    var img = adPin.querySelector('img');
    img.src = ad.author.avatar;
    img.alt = ad.offer.title;
    adPin.appendChild(img);
    return adPin;
  };

  var renderAdElement = function (source, destination, value) {
    var element = source.querySelector(destination);
    element.textContent = value;
  };

  var renderAdFeatures = function (parent, featureList) {
    var features = parent.querySelector('.popup__features');
    features.innerHTML = '';
    var template = document.createElement('li');
    template.classList.add('popup__feature');
    for (var i = 0; i < featureList.length; i++) {
      var feature = template.cloneNode(true);
      feature.classList.add('popup__feature--' + featureList[i]);
      features.appendChild(feature);
    }
  };

  var renderAdPhotos = function (parent, photoList) {
    var photos = parent.querySelector('.popup__photos');
    var template = photos.querySelector('.popup__photo');
    photos.innerHTML = '';
    for (var i = 0; i < photoList.length; i++) {
      var photo = template.cloneNode(true);
      photo.src = photoList[i];
      photos.appendChild(photo);
    }
  };

  var renderAd = function (template, ad) {
    var types = {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом',
      palace: 'Дворец'
    };
    var view = template.cloneNode(true);
    renderAdElement(view, '.popup__avatar', ad.author.avatar);
    renderAdElement(view, '.popup__title', ad.offer.title);
    renderAdElement(view, '.popup__text--address', ad.offer.address);
    renderAdElement(view, '.popup__text--price', ad.offer.price + '₽/ночь.');
    renderAdElement(view, '.popup__type', types[ad.offer.type]);
    renderAdElement(view, '.popup__text--capacity', ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей');
    renderAdElement(view, '.popup__text--time', 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
    renderAdFeatures(view, ad.offer.features);
    renderAdElement(view, '.popup__description', ad.offer.description);
    renderAdPhotos(view, ad.offer.photos);
    return view;
  };

  var showAdPins = function (ads) {
    var mapPins = document.querySelector('.map__pins');
    var pins = document.createDocumentFragment();
    var pinTemplate = document.querySelector('#pin').content.querySelector('button');
    for (var i = 0; i < ads.length; i++) {
      var pin = renderAdPin(pinTemplate, ads[i]);
      pins.appendChild(pin);
    }
    mapPins.appendChild(pins);
  };

  var showAd = function (ad) {
    var map = document.querySelector('.map');
    var filter = document.querySelector('map__filters-container');
    var template = document.querySelector('#card').content.querySelector('.map__card');
    var view = renderAd(template, ad);
    map.insertBefore(view, filter);
  };

  var activateMap = function () {
    var map = document.querySelector('.map');
    map.classList.remove('map--faded');
  };

  activateMap();
  var ads = generateRandomAds();
  showAdPins(ads);
  showAd(ads[0]);
})();
