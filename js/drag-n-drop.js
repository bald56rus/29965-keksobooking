'use strict';

(function () {
  var map = window.map.canvas;
  var pin = window.map.pin;
  var PinMoveArea = {
    MIN_X: 0,
    MAX_X: map.offsetWidth - pin.clientWidth,
    MIN_Y: 130,
    MAX_Y: 630
  };
  var position = {};
  pin.addEventListener('mousedown', function (evt) {
    var startPosition = {x: evt.clientX, y: evt.clientY};
    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var offset = {
        x: startPosition.x - moveEvt.clientX,
        y: startPosition.y - moveEvt.clientY
      };
      startPosition = {x: moveEvt.clientX, y: moveEvt.clientY};
      var top = (pin.offsetTop - offset.y);
      if (top >= PinMoveArea.MIN_Y && top <= PinMoveArea.MAX_Y) {
        position.y = top;
        pin.style.top = top + 'px';
      }
      var left = (pin.offsetLeft - offset.x);
      if (left >= PinMoveArea.MIN_X && left <= PinMoveArea.MAX_X) {
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
