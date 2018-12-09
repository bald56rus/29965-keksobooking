'use strict';

(function () {
  var roomGuestCapacity = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0]
  };
  var typeMap = window.utils.typeMap;
  var keyCodeMap = window.utils.keyCodeMap;
  var advertPostedEvent = new CustomEvent('advert-posted', {'bubbles': true, 'cancelable': true});
  var advertCancelEvent = new CustomEvent('advert-cancel', {'bubbles': true, 'cancelable': true});
  var form = document.querySelector('.ad-form');
  var url = form.action;
  var advertFormFields = form.querySelectorAll('input, select');
  var location = form.querySelector('#address');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var timein = form.querySelector('#timein');
  var timeout = form.querySelector('#timeout');
  var roomQuantity = form.querySelector('#room_number');
  var capacity = form.querySelector('#capacity');
  var popupTemplate = document.querySelector('#success').content.querySelector('.success');
  var activePopup;
  var errorHandler = window.utils.errorHandler;

  var setPinPosition = function (position) {
    location.value = position.x + ', ' + position.y;
  };
  var typeChangeHandler = function () {
    var minPrice = typeMap[type.value].minPrice;
    price.min = minPrice;
    price.placeholder = minPrice;
  };
  var timeChangeHandler = function (evt) {
    if (!evt) {
      timein.selectedIndex = timeout.selectedIndex;
      return;
    }
    var source = evt.target;
    var target = source.name === 'timein' ? timeout : timein;
    target.selectedIndex = source.selectedIndex;
  };
  var roomQuantityChangeHandler = function () {
    capacity.setCustomValidity('');
    var allowedGuests = roomGuestCapacity[roomQuantity.value];
    if (allowedGuests.indexOf(parseInt(capacity.value, 10)) === -1) {
      capacity.setCustomValidity('Необходимо выбрать значение из списка разрешенных вариантов');
    }
    capacity.querySelectorAll('option').forEach(function (option) {
      option.disabled = allowedGuests.indexOf(parseInt(option.value, 10)) < 0;
    });
  };
  var capacityChangeHandler = function () {
    capacity.setCustomValidity('');
    var allowedGuests = roomGuestCapacity[roomQuantity.value];
    if (allowedGuests.indexOf(parseInt(capacity.value, 10)) === -1) {
      capacity.setCustomValidity('Необходимо выбрать значение из списка разрешенных вариантов');
    }
  };
  var formResetHandler = function () {
    deactivateForm();
    setTimeout(function () {
      form.dispatchEvent(advertCancelEvent);
    }, 1);
  };
  var closePopupHandler = function () {
    activePopup.remove();
    document.removeEventListener('click', closePopupHandler);
    document.removeEventListener('keydown', escPressHandler);
  };
  var escPressHandler = window.utils.isKeyPressed(keyCodeMap.ESC, closePopupHandler);
  var advertPostedHandler = function () {
    deactivateForm();
    form.reset();
    form.dispatchEvent(advertPostedEvent);
    activePopup = popupTemplate.cloneNode(true);
    document.querySelector('main').appendChild(activePopup);
    document.addEventListener('click', closePopupHandler);
    document.addEventListener('keydown', escPressHandler);
  };
  var formSubmitHandler = function (evt) {
    evt.preventDefault();
    var advert = new FormData(form);
    window.backend.post(url, advert, advertPostedHandler, errorHandler);
  };
  var activateForm = function () {
    typeChangeHandler();
    timeChangeHandler();
    roomQuantityChangeHandler();
    capacityChangeHandler();
    form.addEventListener('reset', formResetHandler);
    form.addEventListener('submit', formSubmitHandler);
    type.addEventListener('change', typeChangeHandler);
    timein.addEventListener('change', timeChangeHandler);
    timeout.addEventListener('change', timeChangeHandler);
    roomQuantity.addEventListener('change', roomQuantityChangeHandler);
    capacity.addEventListener('change', capacityChangeHandler);
    form.classList.remove('ad-form--disabled');
    advertFormFields.forEach(function (field) {
      field.disabled = false;
    });
  };
  var deactivateForm = function () {
    form.classList.add('ad-form--disabled');
    advertFormFields.forEach(function (field) {
      field.disabled = true;
    });
    form.removeEventListener('reset', formResetHandler);
    form.removeEventListener('submit', formSubmitHandler);
    type.removeEventListener('change', typeChangeHandler);
    timein.removeEventListener('change', timeChangeHandler);
    timeout.removeEventListener('change', timeChangeHandler);
    roomQuantity.removeEventListener('change', roomQuantityChangeHandler);
    capacity.removeEventListener('change', capacityChangeHandler);
  };
  window.advert = {
    activate: activateForm,
    deactivate: deactivateForm,
    setPinPosition: setPinPosition
  };
  var initialize = function () {
    setPinPosition(window.map.getPinPosition());
  };
  initialize();
})();
