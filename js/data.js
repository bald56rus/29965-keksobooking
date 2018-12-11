'use strict';

(function () {
  var data = [];
  var getData = function () {
    return data;
  };
  var setData = function (newData) {
    data = newData;
  };
  window.data = {
    get: getData,
    set: setData
  };
})();
