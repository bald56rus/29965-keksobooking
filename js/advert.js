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
  var resetBtn = advertForm.querySelector('.ad-form__reset');

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
  var lock = function () {
    window.utils.toggleFormState(advertForm, true);
    window.utils.toggleFieldsState(advertFormFields, true);
    type.removeEventListener('change', typeChangeHandler);
    timein.removeEventListener('change', timeChangeHandler);
    timeout.removeEventListener('change', timeChangeHandler);
    roomQuantity.removeEventListener('change', roomQuantityChangeHandler);
    capacity.removeEventListener('change', capacityChangeHandler);
    resetBtn.removeEventListener('click', resetBtnHandler);
    var pinLocation = window.map.getPinLocation();
    setPinLocation(true, pinLocation.x, pinLocation.y);
  };
  var unlock = function () {
    type.addEventListener('change', typeChangeHandler);
    timein.addEventListener('change', timeChangeHandler);
    timeout.addEventListener('change', timeChangeHandler);
    roomQuantity.addEventListener('change', roomQuantityChangeHandler);
    capacity.addEventListener('change', capacityChangeHandler);
    resetBtn.addEventListener('click', resetBtnHandler);
    typeChangeHandler();
    timeChangeHandler();
    roomQuantityChangeHandler();
    window.utils.toggleFormState(advertForm, false);
    window.utils.toggleFieldsState(advertFormFields, false);
  };
  var resetBtnHandler = function () {
    window.map.lock();
    window.popup.closePopup();
    window.similarAdverts.clearSimilarAdverts();
    setTimeout(function () {
      lock();
    }, 1);
  };

  window.advert = {
    setPinLocation: setPinLocation,
    lock: lock,
    unlock: unlock
  };

  lock();
})();
