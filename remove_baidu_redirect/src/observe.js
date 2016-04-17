/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

let $ = require('../../libs/jqLite');
let $debounce = require('../../libs/$debounce').$debounce;
let $addStyle = require('../../libs/$addStyle');

let main = require('./main');
let init = require('./init');
let config = require('./config');

let observe = ()=> {

  let observeDebounce = $debounce((target, addList = [])=> {
    if (!addList.length) return;
    config.isDecodingAll ? new main(config.rules).oneByOne() : init();
    config.debug && $addStyle(config.debugStyle);
  }, 100);

  $(document).observe((target, addList = [], removeList = [])=> {
    observeDebounce(target, addList, removeList);
  });
};

module.exports = observe;
