'use strict';

(function () {
  var pin = window.map.pin;
  var pinPosition = {};
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
      pinPosition.y = top;
      var left = (pin.offsetLeft - offset.x);
      pinPosition.x = left;
      pin.style.top = top + 'px';
      pin.style.left = left + 'px';
    };
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      var pinMoveEvent = new CustomEvent('pin-move', {
        'detail': {position: pinPosition},
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
  pin.addEventListener('mouseup', function () {
    window.map.activate();
  });
})();
