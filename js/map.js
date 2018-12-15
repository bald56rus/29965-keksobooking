'use strict';

(function () {
  var PinSize = {
    WIDTH: 65,
    HEIGHT: 75,
    ROUND_HEIGHT: 65
  };
  var map = document.querySelector('.map');
  var pin = document.querySelector('.map__pin--main');
  var defaultPinPosition = {};
  var getPinPosition = function () {
    var isCircle = map.classList.contains('map--faded');
    var x = parseInt(pin.style.left, 10);
    x += PinSize.WIDTH / 2;
    var y = parseInt(pin.style.top, 10);
    y += isCircle ? PinSize.ROUND_HEIGHT / 2 : PinSize.HEIGHT;
    return {x: x, y: y};
  };
  var restorePinPosition = function () {
    pin.style.top = defaultPinPosition.top;
    pin.style.left = defaultPinPosition.left;
  };
  var activateMap = function () {
    map.classList.remove('map--faded');
  };
  var deactivateMap = function () {
    restorePinPosition();
    map.classList.add('map--faded');
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
