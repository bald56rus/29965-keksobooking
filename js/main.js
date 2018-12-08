'use strict';

(function () {
  var pinMoveHandler = function (evt) {
    evt.preventDefault();
    window.advert.setPinPosition(evt.detail.position);
  };
  var advertCancelHandler = function (evt) {
    evt.preventDefault();
    window.similarAdverts.clearSimilarAdverts();
    window.map.deactivate();
    window.advert.setPinPosition(window.map.getPinPosition());
    document.removeEventListener('advert-cancel', advertCancelHandler);
    document.removeEventListener('advert-posted', advertPostedHandler);
    document.addEventListener('pin-move', activateMapHandler);
  };
  var advertPostedHandler = function (evt) {
    evt.preventDefault();
    window.similarAdverts.clearSimilarAdverts();
    window.map.deactivate();
    window.advert.setPinPosition(window.map.getPinPosition());
    document.removeEventListener('advert-posted', advertPostedHandler);
    document.removeEventListener('advert-cancel', advertCancelHandler);
    document.addEventListener('pin-move', activateMapHandler);
  };
  var activateMapHandler = function (evt) {
    evt.preventDefault();
    window.map.activate();
    window.advert.activate();
    window.advert.setPinPosition(window.map.getPinPosition());
    window.similarAdverts.showSimilarAdverts(window.data.get());
    document.removeEventListener('pin-move', activateMapHandler);
    document.addEventListener('pin-move', pinMoveHandler);
    document.addEventListener('advert-cancel', advertPostedHandler);
    document.addEventListener('advert-cancel', advertCancelHandler);
  };
  document.addEventListener('DOMContentLoaded', function () {
    window.backend.get('https://js.dump.academy/keksobooking/data', window.data.set, function () {});
    document.addEventListener('pin-move', activateMapHandler);
  });
})();
