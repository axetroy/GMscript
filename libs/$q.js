
'use strict';

let Es6_Promise = require('es6-promise');
let polyfill = Es6_Promise.polyfill;
let Promise = Es6_Promise.Promise;

/**
 * simple deferred object like angularJS $q or q promise library
 * @param fn                 promise function
 * @returns {Promise}
 */
let $q = function (fn = noop) {
  return new Promise(fn);
};

/**
 * generator a deferred object use like angularJS's $q service
 * @returns {{}}
 */
$q.defer = function () {
  let deferred = {};

  deferred.promise = new Promise(function (resolve, reject) {
    deferred.resolve = function (response) {
      resolve(response);
    };
    deferred.reject = function (response) {
      reject(response);
    };
  });

  return deferred;
};

$q.resolve = function (response) {
  return $q(function (resolve, reject) {
    resolve(response);
  });
};

$q.reject = function (response) {
  return $q(function (resolve, reject) {
    reject(response);
  });
};

module.exports = $q;