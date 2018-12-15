'use strict';

(function () {
  var pinMoveHandler = function (evt) {
    evt.preventDefault();
    window.advert.setPinPosition(evt.detail.position);
  };
  var advertFormHandler = function (evt) {
    evt.preventDefault();
    window.similarAdverts.clearSimilarAdverts();
    window.map.deactivate();
    window.similarAdverts.deactivateFilter();
    window.advert.setPinPosition(window.map.getPinPosition());
    document.removeEventListener('advert-posted', advertFormHandler);
    document.removeEventListener('advert-cancel', advertFormHandler);
    document.addEventListener('pin-move', activateMapHandler);
  };
  var activateMapHandler = function (evt) {
    evt.preventDefault();
    window.map.activate();
    window.advert.activate();
    window.advert.setPinPosition(window.map.getPinPosition());
    window.similarAdverts.showSimilarAdverts(window.data.get());
    window.similarAdverts.activateFilter();
    document.removeEventListener('pin-move', activateMapHandler);
    document.addEventListener('pin-move', pinMoveHandler);
    document.addEventListener('advert-posted', advertFormHandler);
    document.addEventListener('advert-cancel', advertFormHandler);
  };
  document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('pin-move', activateMapHandler);
  });
})();
