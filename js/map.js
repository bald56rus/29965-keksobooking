'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var typesMap = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var roomGuestCapacity = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0]
  };
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
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

  var getRandom = function (minPrice, max) {
    return Math.floor(Math.random() * (max - minPrice + 1)) + minPrice;
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
  var getRandomLocation = function (mapWorkspace) {
    var x = getRandom(mapWorkspace.MinX, mapWorkspace.MaxX);
    var y = getRandom(mapWorkspace.MinY, mapWorkspace.MaxY);
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
  var createPopup = function (ad) {
    var popup = popupTemplate.cloneNode(true);
    var popupCloseBtn = popup.querySelector('.popup__close');
    popupCloseBtn.addEventListener('click', closeAdPopupHandler);
    renderAdImgElement(popup, '.popup__avatar', ad.author.avatar);
    renderAdElement(popup, '.popup__title', ad.offer.title);
    renderAdElement(popup, '.popup__text--address', ad.offer.address);
    renderAdElement(popup, '.popup__text--price', ad.offer.price + '₽/ночь.');
    renderAdElement(popup, '.popup__type', typesMap[ad.offer.type]);
    renderAdElement(popup, '.popup__text--capacity', ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей');
    renderAdElement(popup, '.popup__text--time', 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
    renderAdFeatures(popup, ad.offer.features);
    renderAdElement(popup, '.popup__description', ad.offer.description);
    renderAdPhotos(popup, ad.offer.photos);
    return popup;
  };
  var showAdPopup = function (pin, ad) {
    closeAdPopupHandler();
    pinActive = pin;
    pinActive.classList.add('map__pin--active');
    popupActive = createPopup(ad);
    document.addEventListener('keydown', escPressHandler);
    map.insertBefore(popupActive, filterForm);
  };
  var showAdPins = function (ads) {
    var pins = document.createDocumentFragment();
    ads.forEach(function (ad) {
      var pin = createPin(ad);
      pin.addEventListener('click', function () {
        showAdPopup(pin, ad);
      });
      pins.appendChild(pin);
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
  var toggleMapState = function (isDisabled) {
    toggleFormState(adForm, isDisabled);
    toggleFieldsState(adFormFieldList, isDisabled);
    toggleFormState(filterForm, isDisabled);
    toggleFieldsState(filterFormFieldList, isDisabled);
    if (isDisabled) {
      clearSimilarAds();
      map.classList.add('map--faded');
      mainPin.addEventListener('mouseup', mainPinMoveHandler);
    } else {
      map.classList.remove('map--faded');
      showAdPins(generateRandomAds());
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
    var pinLocation = getPinLocation(map.classList.contains('map--faded'));
    locationField.value = pinLocation.x + ', ' + pinLocation.y;
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
    var minPrice = 0;
    switch (typeField.value) {
      case 'flat': {
        minPrice = 1000;
        break;
      }
      case 'house': {
        minPrice = 5000;
        break;
      }
      case 'palace': {
        minPrice = 10000;
        break;
      }
    }
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
    mapPins.querySelectorAll('.map__pin').forEach(function (pin) {
      if (pin !== mainPin) {
        pin.remove();
      }
    });
  };
  var resetBtnClickHandler = function () {
    toggleMapState(true);
  };
  toggleMapState(true);
})();
