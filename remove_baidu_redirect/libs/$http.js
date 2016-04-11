/**
 * http service
 * @param ops
 * @returns {Promise}
 */

let $q = require('./$q');
let $ = require('./jqLite');

let $http = function (ops = {}) {
  let deferred = $q.defer();

  let onreadystatechange = (response)=> {
    if (response.readyState !== 4) return;
    response.requestUrl = ops.url;
    if (/^(2|3)/.test(response.status) || response.finalUrl) {
      deferred.resolve(response);
    }
    else {
      deferred.reject(response);
    }
  };

  let ontimeout = (response)=> {
    response.requestUrl = ops.url;
    response && response.finalUrl ? deferred.resolve(response) : deferred.reject(response);
  };

  let onerror = (response)=> {
    response.requestUrl = ops.url;
    response && response.finalUrl ? deferred.resolve(response) : deferred.reject(response);
  };

  ops = $.fn.merge({
    onreadystatechange,
    ontimeout,
    onerror
  }, ops);

  // make the protocol agree
  if (!new RegExp(`^${window.location.protocol}`).test(ops.url)) {
    ops.url = ops.url.replace(/^(http|https):/im, window.location.protocol);
  }

  GM_xmlhttpRequest(ops);
  return deferred.promise;
};

['HEAD', 'GET', 'POST'].forEach(function (method) {
  $http[method.toLocaleLowerCase()] = function (url, ops = {}) {
    var deferred = $q.defer();
    ops = $.fn.merge(ops, {url, method: method});
    $http(ops)
      .then(function (response) {
        deferred.resolve(response);
      }, function (response) {
        deferred.reject(response);
      });
    return deferred.promise;
  }
});

$http.jsonp = (url)=> {
  let deferred = $q.defer();

  let func = function (resp) {
    script.remove();
    resp ? deferred.resolve(resp) : deferred.reject(resp);
  };

  let script = document.createElement('script');
  script.setAttribute("type", "text/javascript");
  script.src = url + '?callback=func';
  document.body.appendChild(script);


  return deferred.promise;
};

module.exports = $http;