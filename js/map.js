'use strict';

(function () {
  var PIN_WIDTH = 65;
  var ROUND_PIN_HEIGHT = 65;
  var PIN_HEIGHT = 75;
  var map = document.querySelector('.map');
  var mapActivateEvent = new Event('map-acivated');
  var mapDeactivateEvent = new Event('map-deacivated');
  var pin = document.querySelector('.map__pin--main');
  var defaultPinPosition = {};

  var getPinPosition = function () {
    var isCircle = map.classList.contains('map--faded');
    var x = parseInt(pin.style.left, 10);
    x += PIN_WIDTH / 2;
    var y = parseInt(pin.style.top, 10);
    y += isCircle ? ROUND_PIN_HEIGHT / 2 : PIN_HEIGHT;
    return {x: x, y: y};
  };

  var restorePinPosition = function () {
    pin.style.top = defaultPinPosition.top;
    pin.style.left = defaultPinPosition.left;
  };

  var activateMap = function () {
    map.classList.remove('map--faded');
    map.dispatchEvent(mapActivateEvent);
  };

  var deactivateMap = function () {
    restorePinPosition();
    map.classList.add('map--faded');
    map.dispatchEvent(mapDeactivateEvent);
  };

  window.map = {
    canvas: map,
    pin: pin,
    getPinPosition: getPinPosition,
    activate: activateMap,
    deactivate: deactivateMap
  };
  var initialize = function () {
    defaultPinPosition = {
      top: pin.offsetTop + 'px',
      left: pin.offsetLeft + 'px'};
  };
  initialize();
})();
