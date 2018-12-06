'use strict';

(function () {
  var PIN_WIDTH = 65;
  var PIN_HEIGHT = 87;
  var ROUND_PIN_HEIGHT = 65;
  var roomGuestCapacity = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0]
  };
  var advertForm = document.querySelector('.ad-form');
  var advertFormFields = advertForm.querySelectorAll('input, select');
  var location = advertForm.querySelector('#address');
  var type = advertForm.querySelector('#type');
  var price = advertForm.querySelector('#price');
  var timein = advertForm.querySelector('#timein');
  var timeout = advertForm.querySelector('#timeout');
  var roomQuantity = advertForm.querySelector('#room_number');
  var capacity = advertForm.querySelector('#capacity');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var activeSuccessPopup;

  var setPinLocation = function (isCircle, x, y) {
    x += PIN_WIDTH / 2;
    y += isCircle ? ROUND_PIN_HEIGHT / 2 : PIN_HEIGHT;
    location.value = x + ', ' + y;
  };
  var typeChangeHandler = function () {
    var minPrice = window.utils.typesMap[type.value].minPrice;
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

  var successPopupHandler = function () {
    activeSuccessPopup.remove();
    advertForm.reset();
    lock();
    window.map.lock();
    document.removeEventListener('click', successPopupHandler);
  };

  var escPressHandler = function (evt) {
    window.utils.keydownHandler(evt, 27, successPopupHandler);
    document.removeEventListener('keydown', escPressHandler);
  };

  var successHandler = function () {
    activeSuccessPopup = successTemplate.cloneNode(true);
    activeSuccessPopup.addEventListener('click', successPopupHandler);
    document.addEventListener('keydown', escPressHandler);
    window.map.main.appendChild(activeSuccessPopup);
  };
  var submitFormHandler = function (evt) {
    evt.preventDefault();
    var url = 'https://js.dump.academy/keksobooking';
    window.backend.post(url, new FormData(advertForm), successHandler, window.utils.errorHandler);
  };
  var resetFormHandler = function () {
    window.map.lock();
    window.popup.closePopup();
    window.similarAdverts.clearSimilarAdverts();
    setTimeout(function () {
      lock();
    }, 1);
  };
  var lock = function () {
    window.utils.toggleFormState(advertForm, true);
    window.utils.toggleFieldsState(advertFormFields, true);
    type.removeEventListener('change', typeChangeHandler);
    timein.removeEventListener('change', timeChangeHandler);
    timeout.removeEventListener('change', timeChangeHandler);
    roomQuantity.removeEventListener('change', roomQuantityChangeHandler);
    capacity.removeEventListener('change', capacityChangeHandler);
    advertForm.removeEventListener('submit', submitFormHandler);
    advertForm.removeEventListener('reset', resetFormHandler);

    var pinLocation = window.map.getPinLocation();
    setPinLocation(true, pinLocation.x, pinLocation.y);
  };
  var unlock = function () {
    type.addEventListener('change', typeChangeHandler);
    timein.addEventListener('change', timeChangeHandler);
    timeout.addEventListener('change', timeChangeHandler);
    roomQuantity.addEventListener('change', roomQuantityChangeHandler);
    capacity.addEventListener('change', capacityChangeHandler);
    advertForm.addEventListener('submit', submitFormHandler);
    advertForm.addEventListener('reset', resetFormHandler);
    typeChangeHandler();
    timeChangeHandler();
    roomQuantityChangeHandler();
    window.utils.toggleFormState(advertForm, false);
    window.utils.toggleFieldsState(advertFormFields, false);
  };

  window.advert = {
    setPinLocation: setPinLocation,
    lock: lock,
    unlock: unlock
  };

  lock();
})();
