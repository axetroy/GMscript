/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

// libs
let $ = require('../../libs/jqLite');
let $debounce = require('../../libs/$debounce').$debounce;
let $addStyle = require('../../libs/$addStyle');

let main = require('./main');
let config = require('./config');

let scroll = ()=> {
  let scrollDebounce = $debounce(()=> {
    new main(config.rules).oneByOne();
    config.debug && $addStyle(config.debugStyle);
  }, 100);

  $(window).bind('scroll', ()=> {
    scrollDebounce();
  });
};

module.exports = scroll;