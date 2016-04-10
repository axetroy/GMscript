/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

let $ = require('../libs/jqLite');
let main = require('./main');
let config = require('./config');

let scroll = function () {
  return ()=> {
    let scrollDebounce = $.fn.debounce(() => {
      new main(config.rules).oneByOne();
    }, 100);
    $(window).bind('scroll', ()=> {
      scrollDebounce();
    });
  }
};

module.exports = scroll();