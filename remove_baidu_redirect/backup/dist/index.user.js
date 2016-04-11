(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint ignore:start */
'use strict';

(function () {

  'use strict';

  var $ = require('./libs/jqLite');

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

/* jshint ignore:end */

},{"./libs/jqLite":4,"./src/init":6,"./src/mouseover":8,"./src/observe":9,"./src/scroll":10}],2:[function(require,module,exports){
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

},{"./$q":3,"./jqLite":4}],3:[function(require,module,exports){

'use strict';

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

},{}],4:[function(require,module,exports){

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

},{}],5:[function(require,module,exports){
// config
'use strict';

var config = {
  rules: '\n      a[href*="www.baidu.com/link?url"]\n      :not(.m)\n      :not([decoding])\n      :not([decoded])\n    '.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1'),
  debug: true,
  isDecodingAll: false
};

if (config.debug) {
  GM_addStyle('\n    a[decoded]{\n      background-color:green !important;\n      color:#303030 !important;\n    };\n    a[decoding]{\n      background-color:yellow !important;\n      color:#303030 !important;\n    }\n  ');
}

module.exports = config;

},{}],6:[function(require,module,exports){
'use strict';

var main = require('./main');
var $q = require('../libs/$q');
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

},{"../libs/$q":3,"./config":5,"./main":7}],7:[function(require,module,exports){
/**
 * the main class to bootstrap this script
 */

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var config = require('./config');
var $ = require('./../libs/jqLite');
var $q = require('./../libs/$q');
var $http = require('./../libs/$http');

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

    $http.get(aEle.href, { timeout: 2000, anonymous: true }).then(function (response) {
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

},{"./../libs/$http":2,"./../libs/$q":3,"./../libs/jqLite":4,"./config":5}],8:[function(require,module,exports){
/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

var $ = require('../libs/jqLite');
var main = require('./main');

var mouseoverDebounce = $.fn.debounce(function (e) {
  var aEle = e.target;

  if (aEle.tagName !== "A" || !aEle.href || !/www\.baidu\.com\/link\?url=/im.test(aEle.href) || !!$(aEle).attr('decoded')) {
    return;
  }

  new main().one(aEle);
}, 100);

var mouseover = function mouseover() {
  return function () {
    $(document).bind('mouseover', function (e) {
      mouseoverDebounce(e);
    });
  };
};

module.exports = mouseover();

},{"../libs/jqLite":4,"./main":7}],9:[function(require,module,exports){
/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

var $ = require('../libs/jqLite');
var main = require('./main');
var init = require('./init');
var config = require('./config');

var observe = function observe() {
  return function () {
    var observeDebounce = $.fn.debounce(function (target) {
      var addList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
      var removeList = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

      if (!addList.length) return;

      config.isDecodingAll ? new main(config.rules).oneByOne() : init();
    }, 100);
    $(document).observe(function (target) {
      var addList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
      var removeList = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

      observeDebounce(target, addList, removeList);
    });
  };
};

module.exports = observe();

},{"../libs/jqLite":4,"./config":5,"./init":6,"./main":7}],10:[function(require,module,exports){
/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

var $ = require('../libs/jqLite');
var main = require('./main');
var config = require('./config');

var scroll = function scroll() {
  return function () {
    var scrollDebounce = $.fn.debounce(function () {
      new main(config.rules).oneByOne();
    }, 100);
    $(window).bind('scroll', function () {
      scrollDebounce();
    });
  };
};

module.exports = scroll();

},{"../libs/jqLite":4,"./config":5,"./main":7}]},{},[1]);
