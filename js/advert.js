'use strict';

(function () {
  var roomGuestCapacity = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0]
  };
  var advertPostedEvent = new CustomEvent('advert-posted', {'bubbles': true, 'cancelable': true});
  var advertCancelEvent = new CustomEvent('advert-cancel', {'bubbles': true, 'cancelable': true});
  var advertForm = document.querySelector('.ad-form');
  var advertFormFields = advertForm.querySelectorAll('input, select');
  var location = advertForm.querySelector('#address');
  var type = advertForm.querySelector('#type');
  var price = advertForm.querySelector('#price');
  var timein = advertForm.querySelector('#timein');
  var timeout = advertForm.querySelector('#timeout');
  var roomQuantity = advertForm.querySelector('#room_number');
  var capacity = advertForm.querySelector('#capacity');

  var setPinPosition = function (position) {
    location.value = position.x + ', ' + position.y;
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
  var advertFormResetHandler = function (evt) {
    evt.preventDefault();
    deactivateForm();
    setTimeout(function () {
      advertForm.dispatchEvent(advertCancelEvent);
    }, 1);
  };
  var advertFormSubmitHandler = function (evt) {
    evt.preventDefault();
    deactivateForm();
    advertForm.reset();
    advertForm.dispatchEvent(advertPostedEvent);
  };
  var activateForm = function () {
    typeChangeHandler();
    timeChangeHandler();
    roomQuantityChangeHandler();
    capacityChangeHandler();
    advertForm.addEventListener('reset', advertFormResetHandler);
    advertForm.addEventListener('submit', advertFormSubmitHandler);
    type.addEventListener('change', typeChangeHandler);
    timein.addEventListener('change', timeChangeHandler);
    timeout.addEventListener('change', timeChangeHandler);
    roomQuantity.addEventListener('change', roomQuantityChangeHandler);
    capacity.addEventListener('change', capacityChangeHandler);
    advertForm.classList.remove('ad-form--disabled');
    advertFormFields.forEach(function (field) {
      field.disabled = false;
    });
  };
  var deactivateForm = function () {
    advertForm.classList.add('ad-form--disabled');
    advertFormFields.forEach(function (field) {
      field.disabled = true;
    });
    advertForm.removeEventListener('reset', advertFormResetHandler);
    advertForm.removeEventListener('submit', advertFormSubmitHandler);
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
