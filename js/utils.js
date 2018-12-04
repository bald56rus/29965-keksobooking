'use strict';

(function () {
  var typesMap = {
    flat: {name: 'Квартира', minPrice: 1000},
    bungalo: {name: 'Бунгало', minPrice: 0},
    house: {name: 'Дом', minPrice: 5000},
    palace: {name: 'Дворец', minPrice: 10000}
  };
  var getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  var shuffleArray = function (source) {
    for (var i = 0; i < source.length; i++) {
      var j = getRandom(0, source.length - 1);
      var swap = source[i];
      source[i] = source[j];
      source[j] = swap;
    }
    return source;
  };
  var getRandomValue = function (source, truncate) {
    truncate = truncate || false;
    shuffleArray(source);
    var index = getRandom(0, source.length - 1);
    var value = source[index];
    if (truncate) {
      source.splice(index, 1);
    }
    return value;
  };
  var getRandomValues = function (source) {
    var destination = [];
    var counter = getRandom(0, source.length - 1);
    while (destination.length < counter) {
      var value = getRandomValue(source, true);
      destination.push(value);
    }
    return destination;
  };
  var toggleFormState = function (form, isDisabled) {
    if (isDisabled) {
      form.classList.add('ad-form--disabled');
    } else {
      form.classList.remove('ad-form--disabled');
    }
  };
  var toggleFieldsState = function (fields, isDisabled) {
    fields.forEach(function (field) {
      field.disabled = isDisabled;
    });
  };
  window.utils = {
    typesMap: typesMap,
    getRandom: getRandom,
    shuffleArray: shuffleArray,
    getRandomValue: getRandomValue,
    getRandomValues: getRandomValues,
    toggleFormState: toggleFormState,
    toggleFieldsState: toggleFieldsState
  };
})();
