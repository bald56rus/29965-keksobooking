'use strict';

(function () {
  var createRequest = function (onLoad, onError) {
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.addEventListener('load', function () {
      return onLoad(request.response);
    });
    request.addEventListener('error', function () {
      return onError(request.response);
    });
    return request;
  };
  var get = function (url, onLoad, onError) {
    var request = createRequest(onLoad, onError);
    request.open('GET', url);
    request.send();
  };
  var post = function (url, data, onLoad, onError) {
    var request = createRequest(onLoad, onError);
    request.open('POST', url);
    request.send(data);
  };
  window.backend = {
    get: get,
    post: post
  };
})();
