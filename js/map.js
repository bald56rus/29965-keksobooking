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
    mainPin.style.top = 375 + 'px';
    mainPin.style.left = 570 + 'px';
  };

  var getPinLocation = function (isCircle) {
    var mainPinAffterStyle = getComputedStyle(mainPin, '::after');
    var x = mainPin.offsetLeft + mainPin.offsetWidth / 2;
    var y = mainPin.offsetTop;
    y += isCircle ? mainPin.offsetHeight / 2 : mainPin.offsetHeight + parseFloat(mainPinAffterStyle.height);
    return {x: x, y: y};
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
