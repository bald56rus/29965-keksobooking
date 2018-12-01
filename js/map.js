'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var typesMap = {
    flat: {name: 'Квартира', minPrice: 1000},
    bungalo: {name: 'Бунгало', minPrice: 0},
    house: {name: 'Дом', minPrice: 5000},
    palace: {name: 'Дворец', minPrice: 10000}
  };
  var roomGuestCapacity = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0]
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
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
  var similarAds = [];
  var popupActive;
  var pinActive;
  var adForm = document.querySelector('.ad-form');
  var adFormFieldList = adForm.querySelectorAll('input, select');
  var filterForm = document.querySelector('.map__filters-container');
  var filterFormFieldList = filterForm.querySelectorAll('input, select');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var popupTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var locationField = adForm.querySelector('#address');
  var typeField = adForm.querySelector('#type');
  var priceField = adForm.querySelector('#price');
  var timeinField = adForm.querySelector('#timein');
  var timeoutField = adForm.querySelector('#timeout');
  var roomQuantityField = adForm.querySelector('#room_number');
  var capacityField = adForm.querySelector('#capacity');
  var formResetBtn = adForm.querySelector('.ad-form__reset');

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
  var getRandomLocation = function () {
    var pinWidth = 50;
    var mapWidth = document.querySelector('.map__overlay').clientWidth;
    var minX = pinWidth;
    var maxX = mapWidth - pinWidth;
    var minY = 130;
    var maxY = 630;
    var x = getRandom(minX, maxX);
    var y = getRandom(minY, maxY);
    return {x: x, y: y};
  };
  var generateRandomAd = function (presetAvatars, presetTitles) {
    var location = getRandomLocation();
    return {
      author: {
        avatar: getRandomValue(presetAvatars, true)
      },
      offer: {
        title: getRandomValue(presetTitles, true),
        address: location.x + ', ' + location.y,
        price: getRandom(1000, 1000000),
        type: getRandomValue(types),
        rooms: getRandom(1, 5),
        guests: getRandom(0, 5),
        checkin: getRandomValue(timeinList),
        checkout: getRandomValue(timeoutList),
        features: getRandomValues(features.slice()),
        description: '',
        photos: shuffleArray(photos)
      },
      location: location
    };
  };
  var generateRandomAds = function () {
    var ads = [];
    var presetAvatars = avatars.slice();
    var presetTitles = titles.slice();
    for (var i = 0; i < 8; i++) {
      var ad = generateRandomAd(presetAvatars, presetTitles);
      ads.push(ad);
    }
    return ads;
  };
  var createPin = function (ad) {
    var pin = pinTemplate.cloneNode(true);
    pin.style.top = ad.location.y + 'px';
    pin.style.left = ad.location.x + 'px';
    var img = pin.querySelector('img');
    img.src = ad.author.avatar;
    img.alt = ad.offer.title;
    pin.appendChild(img);
    return pin;
  };
  var renderAdElement = function (source, destination, value) {
    var element = source.querySelector(destination);
    element.textContent = value;
  };
  var renderAdImgElement = function (source, destination, value) {
    var element = source.querySelector(destination);
    element.src = value;
  };
  var renderAdFeatures = function (parent, featureList) {
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
  var createPopup = function (ad) {
    var popup = popupTemplate.cloneNode(true);
    var popupCloseBtn = popup.querySelector('.popup__close');
    popupCloseBtn.addEventListener('click', closeAdPopupHandler);
    renderAdImgElement(popup, '.popup__avatar', ad.author.avatar);
    renderAdElement(popup, '.popup__title', ad.offer.title);
    renderAdElement(popup, '.popup__text--address', ad.offer.address);
    renderAdElement(popup, '.popup__text--price', ad.offer.price + '₽/ночь.');
    renderAdElement(popup, '.popup__type', typesMap[ad.offer.type].name);
    renderAdElement(popup, '.popup__text--capacity', ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей');
    renderAdElement(popup, '.popup__text--time', 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
    renderAdFeatures(popup, ad.offer.features);
    renderAdElement(popup, '.popup__description', ad.offer.description);
    renderAdPhotos(popup, ad.offer.photos);
    return popup;
  };
  var showDetailsAd = function (pin, ad) {
    closeAdPopupHandler();
    pinActive = pin;
    pinActive.classList.add('map__pin--active');
    popupActive = createPopup(ad);
    document.addEventListener('keydown', escPressHandler);
    map.insertBefore(popupActive, filterForm);
  };
  var showSimilarAds = function (ads) {
    var pins = document.createDocumentFragment();
    ads.forEach(function (ad) {
      var pin = createPin(ad);
      pin.addEventListener('click', function () {
        showDetailsAd(pin, ad);
      });
      pins.appendChild(pin);
      similarAds.push(pin);
    });
    mapPins.appendChild(pins);
  };
  var closeAdPopupHandler = function () {
    if (!popupActive) {
      return;
    }
    popupActive.remove();
    document.removeEventListener('keydown', escPressHandler);
    if (pinActive) {
      pinActive.classList.remove('map__pin--active');
      pinActive = null;
    }
  };
  var escPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeAdPopupHandler();
    }
  };
  var getPinLocation = function (isCircle) {
    var mainPinAffterStyle = getComputedStyle(mainPin, '::after');
    var x = mainPin.offsetLeft + mainPin.offsetWidth / 2;
    var y = mainPin.offsetTop;
    y += isCircle ? mainPin.offsetHeight / 2 : mainPin.offsetHeight + parseFloat(mainPinAffterStyle.height);
    return {x: x, y: y};
  };
  var setPinLocation = function () {
    var pinLocation = getPinLocation(map.classList.contains('map--faded'));
    locationField.value = pinLocation.x + ', ' + pinLocation.y;
  };
  var toggleMapState = function (isDisabled) {
    toggleFormState(adForm, isDisabled);
    toggleFieldsState(adFormFieldList, isDisabled);
    toggleFormState(filterForm, isDisabled);
    toggleFieldsState(filterFormFieldList, isDisabled);
    if (isDisabled) {
      closeAdPopupHandler();
      clearSimilarAds();
      map.classList.add('map--faded');
      typeField.removeEventListener('change', typeChangeHandler);
      timeinField.removeEventListener('change', timeChangeHandler);
      timeoutField.removeEventListener('change', timeChangeHandler);
      roomQuantityField.removeEventListener('change', roomQuantityChangeHandler);
      capacityField.removeEventListener('change', capacityChangeHandler);
      formResetBtn.addEventListener('click', resetBtnClickHandler);
      mainPin.addEventListener('mouseup', mainPinMoveHandler);
    } else {
      map.classList.remove('map--faded');
      showSimilarAds(generateRandomAds());
      typeChangeHandler();
      timeChangeHandler();
      roomQuantityChangeHandler();
      typeField.addEventListener('change', typeChangeHandler);
      timeinField.addEventListener('change', timeChangeHandler);
      timeoutField.addEventListener('change', timeChangeHandler);
      roomQuantityField.addEventListener('change', roomQuantityChangeHandler);
      capacityField.addEventListener('change', capacityChangeHandler);
      mainPin.removeEventListener('mouseup', mainPinMoveHandler);
      formResetBtn.addEventListener('click', resetBtnClickHandler);
    }
    setPinLocation();
  };
  var toggleFormState = function (form, isDisabled) {
    if (isDisabled) {
      form.classList.add('ad-form--disabled');
    } else {
      form.classList.remove('ad-form--disabled');
    }
  };
  var toggleFieldsState = function (fields, isDisabled) {
    fields.forEach(function (field) {
      field.disabled = isDisabled;
    });
  };
  var typeChangeHandler = function () {
    var minPrice = typesMap[typeField.value].minPrice;
    priceField.min = minPrice;
    priceField.placeholder = minPrice;
  };
  var timeChangeHandler = function (evt) {
    if (!evt) {
      timeinField.selectedIndex = timeoutField.selectedIndex;
      return;
    }
    var source = evt.target;
    var target = source.name === 'timein' ? timeoutField : timeinField;
    target.selectedIndex = source.selectedIndex;
  };
  var roomQuantityChangeHandler = function () {
    capacityField.setCustomValidity('');
    var allowedGuests = roomGuestCapacity[roomQuantityField.value];
    if (allowedGuests.indexOf(parseInt(capacityField.value, 10)) === -1) {
      capacityField.setCustomValidity('Необходимо выбрать значение из списка разрешенных вариантов');
    }
    capacityField.querySelectorAll('option').forEach(function (option) {
      option.disabled = allowedGuests.indexOf(parseInt(option.value, 10)) < 0;
    });
  };
  var capacityChangeHandler = function () {
    capacityField.setCustomValidity('');
    var allowedGuests = roomGuestCapacity[roomQuantityField.value];
    if (allowedGuests.indexOf(parseInt(capacityField.value, 10)) === -1) {
      capacityField.setCustomValidity('Необходимо выбрать значение из списка разрешенных вариантов');
    }
  };
  var mainPinMoveHandler = function () {
    toggleMapState(false);
  };
  var clearSimilarAds = function () {
    similarAds.forEach(function (pin) {
      if (pin !== mainPin) {
        pin.remove();
      }
    });
    similarAds.length = 0;
  };
  var resetBtnClickHandler = function () {
    toggleMapState(true);
  };
  toggleMapState(true);
})();
