'use strict';

let main = require('./main');
let $q = require('../libs/$q');
let config = require('./config');

let init = ()=> {
  new main(config.rules).all()
    .then(function () {
      return $q.resolve(true);
    }, function () {
      return $q.resolve(true);
    })
    .then(function () {
      new main(config.rules).oneByOne();
    });
};

module.exports = init;