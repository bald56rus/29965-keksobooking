'use strict';

(function () {
  var pin = window.map.mainPin;
  var workspace = window.map.workspace;
  var mouseDownHandler = function (evt) {
    var isPinMoved = false;
    var current = {x: evt.clientX, y: evt.clientY};
    var mouseMoveHandler = function (moveEvt) {
      var offset = {
        x: current.x - moveEvt.clientX,
        y: current.y - moveEvt.clientY
      };
      if (Math.abs(offset.x) < 10 && Math.abs(offset.y) < 10) {
        return;
      }
      isPinMoved = true;
      var top = pin.offsetTop - offset.y;
      if (top >= workspace.minY && top <= workspace.maxY) {
        current.y = moveEvt.clientY;
        pin.style.top = top + 'px';
      }
      var left = pin.offsetLeft - offset.x;
      if (left >= workspace.minX && left <= workspace.maxX) {
        current.x = moveEvt.clientX;
        pin.style.left = left + 'px';
      }
    };
    var mouseUpHandler = function () {
      if (isPinMoved) {
        window.advert.setPinLocation(false, current.x, current.y);
      } else {
        var pinLocation = window.map.getPinLocation();
        window.advert.setPinLocation(false, pinLocation.x, pinLocation.y);
      }
      if (window.map.isDisabled) {
        window.similarAdverts.showSimilarAdverts();
        window.map.unlock();
        window.advert.unlock();
      }
      pin.removeEventListener('mousemove', mouseMoveHandler);
      pin.removeEventListener('mouseup', mouseUpHandler);
    };
    pin.addEventListener('mousemove', mouseMoveHandler);
    pin.addEventListener('mouseup', mouseUpHandler);
  };
  pin.addEventListener('mousedown', mouseDownHandler);
})();
