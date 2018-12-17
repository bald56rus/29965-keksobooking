'use strict';

(function () {
  var RoomGuestCapacityEnum = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0]
  };
  var HouseTypeEnum = window.utils.HouseTypeEnum;
  var KeyCode = window.utils.KeyCode;
  var popupContainer = window.utils.popupContainer;
  var isKeyPressed = window.utils.isKeyPressed;
  var postedEvent = new CustomEvent('advert-posted', {'bubbles': true, 'cancelable': true});
  var cancelEvent = new CustomEvent('advert-cancel', {'bubbles': true, 'cancelable': true});
  var form = document.querySelector('.ad-form');
  var formControls = form.querySelectorAll('input, select, button, textarea');
  var avatar = form.querySelector('.ad-form-header__input');
  var avatarPreview = form.querySelector('.ad-form-header__preview').querySelector('img');
  var location = form.querySelector('#address');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var timein = form.querySelector('#timein');
  var timeout = form.querySelector('#timeout');
  var rooms = form.querySelector('#room_number');
  var guests = form.querySelector('#capacity');
  var guestsOptions = guests.querySelectorAll('option');
  var photo = form.querySelector('.ad-form__upload').querySelector('input');
  var photoPreviewContainer = form.querySelector('.ad-form__photo');
  var popupTemplate = document.querySelector('#success').content.querySelector('.success');
  var activePopup = null;
  var errorHandler = window.utils.errorHandler;
  var setPinPosition = function (position) {
    location.value = position.x + ', ' + position.y;
  };
  var fileUploader = function (fileInput, callback) {
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  var avatarChangeHandler = function () {
    fileUploader(avatar, function (img) {
      avatarPreview.src = img;
    });
  };
  var typeChangeHandler = function () {
    var minPrice = HouseTypeEnum[type.value.toUpperCase()].minPrice;
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
  var validateGuests = function (disableDeniedOptions) {
    guests.setCustomValidity('');
    disableDeniedOptions = disableDeniedOptions || false;
    var allowedGuests = RoomGuestCapacityEnum[rooms.value];
    if (allowedGuests.indexOf(parseInt(guests.value, 10)) === -1) {
      guests.setCustomValidity('Необходимо выбрать значение из списка разрешенных вариантов');
    }
    if (!disableDeniedOptions) {
      return;
    }
    guestsOptions.forEach(function (option) {
      option.disabled = allowedGuests.indexOf(parseInt(option.value, 10)) < 0;
    });
  };
  var roomsChangeHandler = function () {
    validateGuests(true);
  };
  var guestsChangeHandler = function () {
    validateGuests();
  };
  var photoUploadHandler = function () {
    fileUploader(photo, function (img) {
      var preview = document.createElement('img');
      preview.width = 70;
      preview.height = 70;
      preview.src = img;
      photoPreviewContainer.appendChild(preview);
    });
  };
  var formResetHandler = function () {
    deactivateForm();
    setTimeout(function () {
      form.dispatchEvent(cancelEvent);
    }, 1);
  };
  var closePopupHandler = function () {
    activePopup.remove();
    document.removeEventListener('click', closePopupHandler);
    document.removeEventListener('keydown', escPressHandler);
  };
  var escPressHandler = isKeyPressed(KeyCode.ESC, closePopupHandler);
  var advertPostedHandler = function () {
    deactivateForm();
    form.reset();
    form.dispatchEvent(postedEvent);
    activePopup = popupTemplate.cloneNode(true);
    popupContainer.appendChild(activePopup);
    document.addEventListener('click', closePopupHandler);
    document.addEventListener('keydown', escPressHandler);
  };
  var formSubmitHandler = function (evt) {
    evt.preventDefault();
    var advert = new FormData(form);
    window.backend.post(form.action, advert, advertPostedHandler, errorHandler);
  };
  var toggleFormControls = function (disabled) {
    formControls.forEach(function (field) {
      field.disabled = disabled;
    });
  };
  var activateForm = function () {
    typeChangeHandler();
    timeChangeHandler();
    roomsChangeHandler();
    guestsChangeHandler();
    form.addEventListener('reset', formResetHandler);
    form.addEventListener('submit', formSubmitHandler);
    avatar.addEventListener('change', avatarChangeHandler);
    type.addEventListener('change', typeChangeHandler);
    timein.addEventListener('change', timeChangeHandler);
    timeout.addEventListener('change', timeChangeHandler);
    rooms.addEventListener('change', roomsChangeHandler);
    guests.addEventListener('change', guestsChangeHandler);
    photo.addEventListener('change', photoUploadHandler);
    form.classList.remove('ad-form--disabled');
    toggleFormControls(false);
  };
  var deactivateForm = function () {
    form.classList.add('ad-form--disabled');
    toggleFormControls(true);
    form.removeEventListener('reset', formResetHandler);
    form.removeEventListener('submit', formSubmitHandler);
    avatar.removeEventListener('change', avatarChangeHandler);
    type.removeEventListener('change', typeChangeHandler);
    timein.removeEventListener('change', timeChangeHandler);
    timeout.removeEventListener('change', timeChangeHandler);
    rooms.removeEventListener('change', roomsChangeHandler);
    guests.removeEventListener('change', guestsChangeHandler);
    photo.removeEventListener('change', photoUploadHandler);
  };
  window.advert = {
    activate: activateForm,
    deactivate: deactivateForm,
    setPinPosition: setPinPosition
  };
  var initialize = function () {
    setPinPosition(window.map.getPinPosition());
    toggleFormControls(true);
  };
  initialize();
})();
