'use strict';

(function () {
  var get = function (url, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      return onLoad(xhr.response);
    });
    xhr.addEventListener('error', function () {
      return onError(xhr.responseText);
    });
    xhr.open('GET', url);
    xhr.send();
  };
  var post = function (url, data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      return onLoad(xhr.response);
    });
    xhr.addEventListener('error', function () {
      return onError(xhr.responseText);
    });
    xhr.open('POST', url);
    xhr.send(data);
  };

  window.backend = {
    get: get,
    post: post
  };
})();
