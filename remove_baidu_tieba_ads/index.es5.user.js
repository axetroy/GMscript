(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// ==UserScript==
// @name              去除贴吧列表里面的广告
// @author            axetroy
// @description       去除贴吧掺夹在[帖子列表][回复列表]里的广告
// @version           2016.4.9
// @include           http://tieba.baidu.com/*
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
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

;(function (window, document) {

  'use strict';

  var _this3 = this;

  var ES6Support = true;

  try {
    var test_tpl_str;
    var test_arrow_fn;

    (function () {
      var test_let = true;
      var test_const = true;
      test_tpl_str = '233';

      test_arrow_fn = function test_arrow_fn() {
        var a = arguments.length <= 0 || arguments[0] === undefined ? '233' : arguments[0];
      };

      var test_class = function test_class() {
        _classCallCheck(this, test_class);
      };
    })();
  } catch (e) {
    /**
     * 促进大家升级浏览器，拯救前端，就是拯救我自己
     */
    alert('你的浏览器不支持ECMA6，去除贴吧列表里面的广告将失效，请升级浏览器和脚本管理器');
    ES6Support = false;
  }

  if (!ES6Support) return;

  var config = {
    // 是否是调试模式
    debug: false,
    adRules: '\n      ul#thread_list *[data-daid],\n      ul#thread_list>li:not([data-field]):not(.thread_top_list_folder)\n      ,\n      #j_p_postlist *[data-daid],\n      #j_p_postlist *[data-isautoreply]\n      ,\n      #thread_list>li\n      :not([class*="list"])\n      :not([data-field])\n      ,\n      .p_postlist>div\n      :not(.p_postlist)\n      :not([class*="post"])\n      :not([data-field])\n      ,\n      #aside *[data-daid],\n      #aside>div[class*="clearfix"],\n      #aside DIV[id$="ad"],\n      #aside #encourage_entry,\n      .my_app,.j_encourage_entry，\n      .right_section>div.u9_aside,\n      .right_section>div.clearfix,\n      .right_section *[data-daid]\n      ,\n      #pb_adbanner,#pb_adbanner *[data-daid]\n      ,\n      #com_u9_head,\n      .u9_head,\n      div.search_form>div[class*="clearfix"]\n      ,\n      .firework-wrap\n    '.trim().replace(/\n/img, '').replace(/\s{1,}([^a-z\*])/ig, '$1'),
    keyRules: '\n      #j_p_postlist a[data-swapword]:not([filted]),\n      #j_p_postlist a.ps_cb:not([filted])\n    '.trim().replace(/\n/img, '').replace(/\s{1,}([^a-z\*])/ig, '$1')
  };

  var noop = function noop() {};

  var jqLite = (function () {
    function jqLite() {
      var selectors = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      _classCallCheck(this, jqLite);

      this.selectors = selectors;
      var elements = typeof selectors === 'string' ? document.querySelectorAll(selectors) : selectors.length ? selectors : [selectors];
      for (var i = 0; i < elements.length; i++) {
        this[i] = elements[i];
      }
      this.length = elements.length;
    }

    jqLite.prototype.each = function each() {
      var fn = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];

      for (var i = 0; i < this.length; i++) {
        fn.call(this, this[i], i);
      }
      return this;
    };

    jqLite.prototype.bind = function bind() {
      var types = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var fn = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];

      this.each(function (ele) {
        types.trim().split(/\s{1,}/).forEach(function (type) {
          ele.addEventListener(type, function (e) {
            var target = e.target || e.srcElement;
            if (fn.call(target, e) === false) {
              e.returnValue = true;
              e.cancelBubble = true;
              e.preventDefault && e.preventDefault();
              e.stopPropagation && e.stopPropagation();
              return false;
            }
          }, false);
        });
      });
    };

    jqLite.prototype.observe = function observe() {
      var _this = this;

      var fn = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];
      var config = arguments.length <= 1 || arguments[1] === undefined ? { childList: true, subtree: true } : arguments[1];

      this.each(function (ele) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            fn.call(_this, mutation.target, mutation.addedNodes, mutation.removedNodes);
          });
        });
        observer.observe(ele, config);
      });
      return this;
    };

    jqLite.visible = function visible(ele) {
      var pos = ele.getBoundingClientRect();
      var w = undefined;
      var h = undefined;
      var inViewPort = undefined;
      if (document.documentElement.getBoundingClientRect) {
        w = document.documentElement.clientWidth || document.body.clientWidth;
        h = document.documentElement.clientHeight || document.body.clientHeight;
        inViewPort = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
        return inViewPort ? false : true;
      }
    };

    jqLite.debounce = function debounce(fn, delay) {
      var timer = undefined;
      return function () {
        var _this2 = this;

        var agm = arguments;
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          fn.apply(_this2, agm);
        }, delay);
      };
    };

    return jqLite;
  })();

  var $ = function $() {
    var selectors = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    return new jqLite(selectors);
  };

  var $timeout = function $timeout() {
    var fn = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];
    var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    return window.setTimeout(fn, delay);
  };

  $timeout.cancel = function (timerId) {
    window.clearTimeout(timerId);
  };

  var $interval = function $interval(fn, delay) {
    var interval = function interval() {
      fn.call(_this3);
      id = setTimeout(interval, delay);
    };

    var id = setTimeout(interval, delay);

    return function () {
      window.clearTimeout(id);
    };
  };

  $interval.cancel = function (timerFunc) {
    timerFunc();
  };

  var main = (function () {
    function main() {
      var agm = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      _classCallCheck(this, main);

      if (!agm) return this;

      this.ads = $(agm);
    }

    main.prototype.filter = function filter() {
      this.ads.each(function (ele) {
        if (ele.$$filtered) return;
        ele.style.cssText = config.debug ? '\n          border:2px solid red;\n        ' : '\n          display:none !important;\n          visibility:hidden !important;\n          width:0 !important;\n          height:0 !important;\n          overflow:hidden !important;\n        ';
        ele.$$filtered = true;
      });
      return this;
    };

    main.prototype.keyword = function keyword() {
      $(config.keyRules).each(function (aEle) {
        if (aEle.$$filtered) return;
        aEle.removeAttribute('data-swapword');
        aEle.removeAttribute('class');
        aEle.removeAttribute('href');
        aEle.style.cssText = config.debug ? '\n          color:#fff !important;\n          background-color:red !important;\n        ' : '\n          color:inherit !important;\n        ';
        aEle.$$filtered = true;
      });
      return this;
    };

    return main;
  })();

  var loop = $interval(function () {
    new main(config.adRules).filter().keyword();
  }, 50);

  console.info('贴吧去广告启动...');

  $(document).bind('DOMContentLoaded', function () {

    $interval.cancel(loop);

    // init
    new main(config.adRules).filter().keyword();

    var observeDebounce = jqLite.debounce(function (target, addList, removeList) {
      if (!addList || !addList.length) return;
      new main(config.adRules).filter().keyword();
    }, 200);

    $(document).observe(function (target, addList, removeList) {
      observeDebounce(target, addList, removeList);
    });

    var scrollDebounce = jqLite.debounce(function () {
      new main(config.adRules).filter().keyword();
    }, 200);
    $(window).bind('scroll', function () {
      scrollDebounce();
    });
  });
})(window, document);

/* jshint ignore:end */

},{}]},{},[1]);
