/* jshint ignore:start */
(() => {

  'use strict';

  let $ = require('./libs/jqLite');

  let init = require('./src/init');

  let observe = require('./src/observe');

  let mouseover = require('./src/mouseover');

  let scroll = require('./src/scroll');

  $(()=> {

    // init
    init();

    // observe the document
    observe();

    // when mouse over on a A Tag and request
    mouseover();

    // scroll and request
    scroll();

  });

  console.info('去跳转启动...');


})();


/* jshint ignore:end */