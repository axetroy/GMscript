// ==UserScript==
// @name              remove the jump link in BAIDU (ECMA6)
// @author            axetroy
// @description       去除百度搜索跳转链接
// @version           2016.4.11
// @grant             GM_xmlhttpRequest
// @grant             GM_addStyle
// @include           *www.baidu.com*
// @connect           tags
// @connect           *
// @compatible        chrome  完美运行
// @compatible        firefox  完美运行
// @supportURL        http://www.burningall.com
// @run-at            document-start
// @contributionURL   troy450409405@gmail.com|alipay.com
// @namespace         https://greasyfork.org/zh-CN/users/3400-axetroy
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// ==/UserScript==

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