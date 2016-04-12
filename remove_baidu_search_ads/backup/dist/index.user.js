(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var $ = require('./libs/jqLite');

var $interval = require('./libs/$interval');

var main = require('./src/main');

var loop = $interval(function () {
  new main().filter().turn();
}, 50);

// init
$(function () {
  new main().filter().turn();
  $interval.cancel(loop);
  $(window.document).observe(function () {
    new main().filter().turn();
  });
});

console.info('去广告启动...');

},{"./libs/$interval":2,"./libs/jqLite":3,"./src/main":5}],2:[function(require,module,exports){
/**
 * Created by axetroy on 16-4-12.
 */

"use strict";

var $interval = function $interval(fn, delay) {
  var interval = function interval() {
    fn.call(undefined);
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

module.exports = $interval;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var noop = function noop(x) {
  return x;
};

var jqLite = (function () {
  function jqLite() {
    var _this = this;

    var selectors = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

    _classCallCheck(this, jqLite);

    this.selectors = selectors;
    this.context = context;
    this.length = 0;

    switch (typeof selectors) {
      case 'undefined':
        break;
      case 'string':
        Array.from(context.querySelectorAll(selectors), function (ele, i) {
          _this[i] = ele;
          _this.length++;
        }, this);
        break;
      case 'object':
        if (selectors.length) {
          Array.from(selectors, function (ele, i) {
            _this[i] = ele;
            _this.length++;
          }, this);
        } else {
          this[0] = selectors;
          this.length = 1;
        }
        break;
      case 'function':
        this.ready(selectors);
        break;
      default:

    }
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

  jqLite.prototype.ready = function ready() {
    var _this2 = this;

    var fn = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];

    this.context.addEventListener('DOMContentLoaded', function (e) {
      fn.call(_this2);
    }, false);
  };

  jqLite.prototype.observe = function observe() {
    var _this3 = this;

    var fn = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];
    var config = arguments.length <= 1 || arguments[1] === undefined ? { childList: true, subtree: true } : arguments[1];

    this.each(function (ele) {
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          fn.call(_this3, mutation.target, mutation.addedNodes, mutation.removedNodes);
        });
      });
      observer.observe(ele, config);
    });
    return this;
  };

  jqLite.prototype.attr = function attr(_attr, value) {
    // one agm
    if (arguments.length === 1) {
      // get attr value
      if (typeof _attr === 'string') {
        return this[0].getAttribute(_attr);
      }
      // set attr with a json
      else if (typeof _attr === 'object') {
          this.each(function (ele) {
            for (var at in _attr) {
              if (_attr.hasOwnProperty(at)) {
                ele.setAttribute(at, value);
              }
            }
          });
          return value;
        }
    }
    // set
    else if (arguments.length === 2) {
        this.each(function (ele) {
          ele.setAttribute(_attr, value);
        });
        return this;
      } else {
        return this;
      }
  };

  jqLite.prototype.removeAttr = function removeAttr(attr) {
    if (arguments.length === 1) {
      this.each(function (ele) {
        ele.removeAttribute(attr);
      });
    }
    return this;
  };

  _createClass(jqLite, [{
    key: 'text',
    get: function get() {
      var ele = this[0];
      return ele.innerText ? ele.innerText : ele.textContent;
    }
  }], [{
    key: 'fn',
    get: function get() {
      var visible = function visible(ele) {
        var pos = ele.getBoundingClientRect();
        var w = undefined;
        var h = undefined;
        var inViewPort = undefined;
        var docEle = document.documentElement;
        var docBody = document.body;
        if (docEle.getBoundingClientRect) {
          w = docEle.clientWidth || docBody.clientWidth;
          h = docEle.clientHeight || docBody.clientHeight;
          inViewPort = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
          return inViewPort ? false : true;
        }
      };
      var debounce = function debounce(fn, delay) {
        var timer = undefined;
        return function () {
          var _this4 = this;

          var agm = arguments;
          window.clearTimeout(timer);
          timer = window.setTimeout(function () {
            fn.apply(_this4, agm);
          }, delay);
        };
      };
      var merge = function merge() {
        for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
          sources[_key] = arguments[_key];
        }

        return Object.assign.apply(Object, [{}].concat(sources));
      };
      return {
        visible: visible,
        debounce: debounce,
        merge: merge
      };
    }
  }]);

  return jqLite;
})();

var $ = function $() {
  var selectors = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

  return new jqLite(selectors, context);
};
$.fn = jqLite.fn;

module.exports = $;

},{}],4:[function(require,module,exports){
/**
 * Created by axetroy on 16-4-12.
 */

'use strict';

var config = {
  rules: '\n    #content_left>div\n    :not([class*=result])\n    :not([class*=container])\n    :not(.leftBlock)\n    :not(#rs_top_new)\n    :not([filtered])\n    ,\n    #content_left>table\n    :not(.result)\n    :not([filtered])\n    ,\n    #content_right>table td\n    div#ec_im_container\n    ,\n    div.s-news-list-wrapper>div\n    :not([data-relatewords*="1"])\n    ,\n    div.list-wraper dl[data-oad]\n    :not([data-fb])\n    :not([filtered])\n  '.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1')
};

module.exports = config;

},{}],5:[function(require,module,exports){
/**
 * Created by axetroy on 16-4-12.
 */

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $ = require('../libs/jqLite');
var config = require('./config');

var main = (function () {
  function main() {
    var rules = arguments.length <= 0 || arguments[0] === undefined ? config.rules : arguments[0];

    _classCallCheck(this, main);

    console.log(rules);
    this.ads = $(rules);
    this.length = this.ads.length;
  }

  main.prototype.filter = function filter() {
    this.ads.each(function (ele, i) {
      ele.style.cssText = '\n          display:none !important;\n          visibility:hidden !important;\n          width:0 !important;\n          height:0 !important;\n          overflow:hidden !important;\n          // background-color:red !important;\n          // border:1px solid red;\n        ';
      ele.setAttribute('filtered', '');
    });
    return this;
  };

  main.prototype.turn = function turn() {
    $('#content_left input[type=checkbox]:not(filtered)').each(function (ele) {
      ele.checked = false;
      ele.setAttribute('filtered', '');
    });
    return this;
  };

  return main;
})();

module.exports = main;

},{"../libs/jqLite":3,"./config":4}]},{},[1]);
