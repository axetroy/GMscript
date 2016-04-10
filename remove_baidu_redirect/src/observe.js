/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

let $ = require('../libs/jqLite');
let main = require('./main');
let init = require('./init');
let config = require('./config');

let observe = function () {
  return ()=> {
    let observeDebounce = $.fn.debounce((target, addList = [], removeList = []) => {
      if (!addList.length) return;

      config.isDecodingAll ? new main(config.rules).oneByOne() : init();
    }, 100);
    $(document).observe(function (target, addList = [], removeList = []) {
      observeDebounce(target, addList, removeList);
    });
  }
};

module.exports = observe();
