(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by axetroy on 16-4-17.
 */

"use strict";

var addCssByStyle = function addCssByStyle(cssString) {
  var doc = document;
  var style = doc.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute('id', 'remove_redirect_debug');

  if (style.styleSheet) {
    // IE
    style.styleSheet.cssText = cssString;
  } else {
    // w3c
    var cssText = doc.createTextNode(cssString);
    style.appendChild(cssText);
  }

  var heads = doc.getElementsByTagName("head");
  heads.length ? heads[0].appendChild(style) : doc.documentElement.appendChild(style);
};

var $addStyle = function $addStyle(styleCSSText) {
  var style = document.getElementById('remove_redirect_debug');
  !style && addCssByStyle(styleCSSText);
};

module.exports = $addStyle;

},{}],2:[function(require,module,exports){
/*
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @param fn {function}  需要调用的函数
 * @param delay  {number}    延迟时间，单位毫秒
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */
"use strict";

var $throttle = function $throttle(fn, delay, immediate, debounce) {
  var curr = +new Date(),
      //当前事件
  last_call = 0,
      last_exec = 0,
      timer = null,
      diff,
      //时间差
  context,
      //上下文
  args,
      exec = function exec() {
    last_exec = curr;
    fn.apply(context, args);
  };
  return function () {
    curr = +new Date();
    context = this, args = arguments, diff = curr - (debounce ? last_call : last_exec) - delay;
    clearTimeout(timer);
    if (debounce) {
      if (immediate) {
        timer = setTimeout(exec, delay);
      } else if (diff >= 0) {
        exec();
      }
    } else {
      if (diff >= 0) {
        exec();
      } else if (immediate) {
        timer = setTimeout(exec, -diff);
      }
    }
    last_call = curr;
  };
};

/*
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
 * @param fn {function}  要调用的函数
 * @param delay   {number}    空闲时间
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */

var $debounce = function $debounce(fn, delay, immediate) {
  return $throttle(fn, delay, immediate, true);
};

module.exports = { $debounce: $debounce, $throttle: $throttle };

},{}],3:[function(require,module,exports){
/**
 * http service
 * @param ops
 * @returns {Promise}
 */

'use strict';

var $q = require('./$q');
var $ = require('./jqLite');

var $http = function $http() {
  var ops = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var deferred = $q.defer();

  var onreadystatechange = function onreadystatechange(response) {
    if (response.readyState !== 4) return;
    response.requestUrl = ops.url;
    if (/^(2|3)/.test(response.status) || response.finalUrl) {
      deferred.resolve(response);
    } else {
      deferred.reject(response);
    }
  };

  var ontimeout = function ontimeout(response) {
    response.requestUrl = ops.url;
    response && response.finalUrl ? deferred.resolve(response) : deferred.reject(response);
  };

  var onerror = function onerror(response) {
    response.requestUrl = ops.url;
    response && response.finalUrl ? deferred.resolve(response) : deferred.reject(response);
  };

  ops = $.fn.merge({
    onreadystatechange: onreadystatechange,
    ontimeout: ontimeout,
    onerror: onerror
  }, ops);

  // make the protocol agree
  if (!new RegExp('^' + window.location.protocol).test(ops.url)) {
    ops.url = ops.url.replace(/^(http|https):/im, window.location.protocol);
  }

  GM_xmlhttpRequest(ops);
  return deferred.promise;
};

['HEAD', 'GET', 'POST'].forEach(function (method) {
  $http[method.toLocaleLowerCase()] = function (url) {
    var ops = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var deferred = $q.defer();
    ops = $.fn.merge(ops, { url: url, method: method });
    $http(ops).then(function (response) {
      deferred.resolve(response);
    }, function (response) {
      deferred.reject(response);
    });
    return deferred.promise;
  };
});

$http.jsonp = function (url) {
  var deferred = $q.defer();

  var func = function func(resp) {
    script.remove();
    resp ? deferred.resolve(resp) : deferred.reject(resp);
  };

  var script = document.createElement('script');
  script.setAttribute("type", "text/javascript");
  script.src = url + '?callback=func';
  document.body.appendChild(script);

  return deferred.promise;
};

module.exports = $http;

},{"./$q":4,"./jqLite":5}],4:[function(require,module,exports){

'use strict';

var Es6_Promise = require('es6-promise');
var polyfill = Es6_Promise.polyfill;
var Promise = Es6_Promise.Promise;

/**
 * simple deferred object like angularJS $q or q promise library
 * @param fn                 promise function
 * @returns {Promise}
 */
var $q = function $q() {
  var fn = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];

  return new Promise(fn);
};

/**
 * generator a deferred object use like angularJS's $q service
 * @returns {{}}
 */
$q.defer = function () {
  var deferred = {};

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

},{"es6-promise":6}],5:[function(require,module,exports){

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
      var merge = function merge() {
        for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
          sources[_key] = arguments[_key];
        }

        return Object.assign.apply(Object, [{}].concat(sources));
      };
      return {
        visible: visible,
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

},{}],6:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.1.2
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function() {
        process.nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertx() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }
    function lib$es6$promise$then$$then(onFulfillment, onRejection) {
      var parent = this;
      var state = parent._state;

      if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
        return this;
      }

      var child = new this.constructor(lib$es6$promise$$internal$$noop);
      var result = parent._result;

      if (state) {
        var callback = arguments[state - 1];
        lib$es6$promise$asap$$asap(function(){
          lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
        });
      } else {
        lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }
    var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
      if (maybeThenable.constructor === promise.constructor &&
          then === lib$es6$promise$then$$default &&
          constructor.resolve === lib$es6$promise$promise$resolve$$default) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();
        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: lib$es6$promise$then$$default,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (Array.isArray(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          lib$es6$promise$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(this.promise, this._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var input   = this._input;

      for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      var resolve = c.resolve;

      if (resolve === lib$es6$promise$promise$resolve$$default) {
        var then = lib$es6$promise$$internal$$getThen(entry);

        if (then === lib$es6$promise$then$$default &&
            entry._state !== lib$es6$promise$$internal$$PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === lib$es6$promise$promise$$default) {
          var promise = new c(lib$es6$promise$$internal$$noop);
          lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
        }
      } else {
        this._willSettleAt(resolve(entry), i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        this._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, this._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":8}],7:[function(require,module,exports){
'use strict';

(function () {

  'use strict';

  var $ = require('./../libs/jqLite');

  var init = require('./src/init');

  var observe = require('./src/observe');

  var mouseover = require('./src/mouseover');

  var scroll = require('./src/scroll');

  $(function () {

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

},{"./../libs/jqLite":5,"./src/init":10,"./src/mouseover":12,"./src/observe":13,"./src/scroll":14}],8:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],9:[function(require,module,exports){
// config
'use strict';

var config = {
  rules: '\n      a[href*="www.baidu.com/link?url"]\n      :not(.m)\n      :not([decoding])\n      :not([decoded])\n    '.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1'),
  debug: false,
  debugStyle: '\n  a[decoded]{\n    background-color:green !important;\n    color:#303030 !important;\n  };\n  a[decoding]{\n    background-color:yellow !important;\n    color:#303030 !important;\n  }\n  ',
  isDecodingAll: false
};

module.exports = config;

},{}],10:[function(require,module,exports){
'use strict';

var $q = require('../../libs/$q');
var main = require('./main');
var config = require('./config');

var init = function init() {
  new main(config.rules).all().then(function () {
    return $q.resolve(true);
  }, function () {
    return $q.resolve(true);
  }).then(function () {
    new main(config.rules).oneByOne();
  });
};

module.exports = init;

},{"../../libs/$q":4,"./config":9,"./main":11}],11:[function(require,module,exports){
/**
 * the main class to bootstrap this script
 */

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $ = require('../../libs/jqLite');
var $q = require('../../libs/$q');
var $http = require('../../libs/$http');
var config = require('./config');

var main = (function () {
  function main() {
    var _this = this;

    var agm = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    _classCallCheck(this, main);

    if (!agm) return this;

    this.inViewPort = [];

    $(agm).each(function (ele) {
      return $.fn.visible(ele) && _this.inViewPort.push(ele);
    });
  }

  /**
   * request a url which has origin links
   * @returns {Promise}
   */

  main.prototype.all = function all() {
    var deferred = $q.defer();

    var url = window.top.location.href.replace(/(\&)(tn=\w+)(\&)/img, '$1' + 'tn=baidulocal' + '$3');

    config.isDecodingAll = true;

    $http.get(url, { timeout: 2000 }).then(function (response) {
      config.isDecodingAll = false;

      if (!response) return;
      var responseText = response.responseText;

      // remove the image/script/css resource
      responseText = responseText.replace(/(src=[^>]*|link=[^>])/g, '');

      var html = document.createElement('html');
      html.innerHTML = responseText;

      $('.t>a:not(.OP_LOG_LINK):not([decoded])').each(function (sourceEle) {
        $('.f>a', html).each(function (targetEle) {
          if ($(sourceEle).text === $(targetEle).text) {
            sourceEle.href = targetEle.href;
            $(sourceEle).attr('decoded', true);
          }
        });
      });

      deferred.resolve(response);
    }, function (response) {
      config.isDecodingAll = false;
      deferred.reject(response);
    });

    return deferred.promise;
  };

  main.prototype.one = function one(aEle) {
    var deferred = $q.defer();

    $(aEle).attr('decoding', true);

    $http.head(aEle.href, { timeout: 2000, anonymous: true }).then(function (response) {
      $(aEle).attr('href', response.finalUrl).attr('decoded', true).removeAttr('decoding');
      deferred.resolve(response);
    }, function (response) {
      $(aEle).removeAttr('decoding');
      deferred.reject(response);
    });

    return deferred.promise;
  };

  /**
   * request the A tag's href one by one those in view port
   * @returns {main}
   */

  main.prototype.oneByOne = function oneByOne() {
    var _this2 = this;

    $(this.inViewPort).each(function (aEle) {
      if (!main.match(aEle)) return;
      _this2.one(aEle);
    });
    return this;
  };

  /**
   * match the Element
   */

  main.match = function match(ele) {
    if (ele.tagName !== "A" || !ele.href || !/www\.baidu\.com\/link\?url=/im.test(ele.href) || !!$(ele).attr('decoded') || !!$(ele).attr('decoding')) {
      return false;
    } else {
      return true;
    }
  };

  return main;
})();

module.exports = main;

},{"../../libs/$http":3,"../../libs/$q":4,"../../libs/jqLite":5,"./config":9}],12:[function(require,module,exports){
/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

// libs
var $ = require('../../libs/jqLite');
var $debounce = require('../../libs/$debounce').$debounce;

var main = require('./main');

var mouseoverDebounce = $debounce(function (e) {
  var aEle = e.target;
  if (aEle.tagName !== "A" || !aEle.href || !/www\.baidu\.com\/link\?url=/im.test(aEle.href) || !!$(aEle).attr('decoded')) {
    return;
  }
  new main().one(aEle);
}, 100, true);

var mouseover = function mouseover() {
  $(document).bind('mouseover', function (e) {
    mouseoverDebounce(e);
  });
};

module.exports = mouseover;

},{"../../libs/$debounce":2,"../../libs/jqLite":5,"./main":11}],13:[function(require,module,exports){
/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

var $ = require('../../libs/jqLite');
var $debounce = require('../../libs/$debounce').$debounce;
var $addStyle = require('../../libs/$addStyle');

var main = require('./main');
var init = require('./init');
var config = require('./config');

var observe = function observe() {

  var observeDebounce = $debounce(function (target) {
    var addList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    if (!addList.length) return;
    config.isDecodingAll ? new main(config.rules).oneByOne() : init();
    config.debug && $addStyle(config.debugStyle);
  }, 100);

  $(document).observe(function (target) {
    var addList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var removeList = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    observeDebounce(target, addList, removeList);
  });
};

module.exports = observe;

},{"../../libs/$addStyle":1,"../../libs/$debounce":2,"../../libs/jqLite":5,"./config":9,"./init":10,"./main":11}],14:[function(require,module,exports){
/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

// libs
var $ = require('../../libs/jqLite');
var $debounce = require('../../libs/$debounce').$debounce;
var $addStyle = require('../../libs/$addStyle');

var main = require('./main');
var config = require('./config');

var scroll = function scroll() {
  var scrollDebounce = $debounce(function () {
    new main(config.rules).oneByOne();
    config.debug && $addStyle(config.debugStyle);
  }, 100);

  $(window).bind('scroll', function () {
    scrollDebounce();
  });
};

module.exports = scroll;

},{"../../libs/$addStyle":1,"../../libs/$debounce":2,"../../libs/jqLite":5,"./config":9,"./main":11}]},{},[7]);
