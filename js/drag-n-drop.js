'use strict';

(function () {
  var MOUSE_SHAKE_OFFSET = 5;
  var map = window.map.canvas;
  var pin = window.map.pin;
  var PinMoveAreaEnum = {
    MIN_X: 0,
    MAX_X: map.offsetWidth - pin.offsetWidth,
    MIN_Y: 130,
    MAX_Y: 630
  };
  var position = {};
  pin.addEventListener('mousedown', function (evt) {
    PinMoveAreaEnum.MAX_X = map.offsetWidth - pin.offsetWidth;
    var startPosition = {x: evt.clientX, y: evt.clientY};
    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var offset = {
        x: startPosition.x - moveEvt.clientX,
        y: startPosition.y - moveEvt.clientY
      };
      if (Math.abs(offset.y) < MOUSE_SHAKE_OFFSET && Math.abs(offset.x) < MOUSE_SHAKE_OFFSET) {
        return;
      }
      startPosition = {x: moveEvt.clientX, y: moveEvt.clientY};
      var top = (pin.offsetTop - offset.y);
      var left = (pin.offsetLeft - offset.x);
      if (top >= PinMoveAreaEnum.MIN_Y && top <= PinMoveAreaEnum.MAX_Y) {
        position.y = top;
        pin.style.top = top + 'px';
      }
      if (left >= PinMoveAreaEnum.MIN_X && left <= PinMoveAreaEnum.MAX_X) {
        position.x = left;
        pin.style.left = left + 'px';
      }
    };
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      var pinMoveEvent = new CustomEvent('pin-move', {
        'detail': {position: position},
        'bubbles': true,
        'cancelable': true
      });
      pin.dispatchEvent(pinMoveEvent);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
