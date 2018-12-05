'use strict';

(function () {
  var isDisabled = true;
  var workspace = {minX: 0, maxX: 1135, minY: 130, maxY: 630};
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  window.map = {
    isDisabled: isDisabled,
    workspace: workspace,
    map: map,
    mainPin: mainPin
  };

  var resetPinLocation = function () {
    var x = 570;
    var y = 375;
    mainPin.style.top = y + 'px';
    mainPin.style.left = x + 'px';
  };

  var getPinLocation = function () {
    return {x: mainPin.offsetLeft, y: mainPin.offsetTop};
  };

  var lock = function () {
    window.map.isDisabled = true;
    resetPinLocation();
    map.classList.add('map--faded');
  };

  var unlock = function () {
    window.map.isDisabled = false;
    map.classList.remove('map--faded');
  };

  window.map.lock = lock;
  window.map.unlock = unlock;
  window.map.getPinLocation = getPinLocation;

  lock();
})();
