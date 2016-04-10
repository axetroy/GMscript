// ==UserScript==
// @name              remove the jump link in BAIDU (ECMA6)
// @author            axetroy
// @description       去除百度搜索跳转链接
// @version           2016.4.10.2
// @grant             GM_xmlhttpRequest
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


if (typeof require !== 'undefined' && typeof require === 'function') {
  require("babel-polyfill");
}

/* jshint ignore:start */
((window, document) => {

  'use strict';

  var ECMA6_Support = true;

  try {
    let test_let = true;
    const test_const = true;
    var test_tpl_str = `233`;
    var test_arrow_fn = (a = '233') => {
    };
    var test_promise = new Promise(function (resolve, reject) {
      resolve();
    });
    class test_class {

    }
  } catch (e) {
    /**
     * 促进大家升级浏览器，拯救前端，就是拯救我自己
     */
    alert('你的浏览器不支持ECMA6，去除百度搜索跳转链接将失效，请升级浏览器和脚本管理器');
    ECMA6_Support = false;
  }

  if (!ECMA6_Support) return;

  let noop = (x) => x;

  /**
   * a lite jquery mock
   */
  class jqLite {
    constructor(selectors = '', context = document) {
      this.selectors = selectors;
      this.context = context;
      this.length = 0;

      switch (typeof selectors) {
        case 'undefined':
          break;
        case 'string':
          Array.from(context.querySelectorAll(selectors), (ele, i) => {
            this[i] = ele;
            this.length++;
          }, this);
          break;
        case 'object':
          if (selectors.length) {
            Array.from(selectors, (ele, i) => {
              this[i] = ele;
              this.length++;
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

    };

    each(fn = noop) {
      for (let i = 0; i < this.length; i++) {
        fn.call(this, this[i], i);
      }
      return this;
    };

    bind(types = '', fn = noop) {
      this.each((ele)=> {
        types.trim().split(/\s{1,}/).forEach((type)=> {
          ele.addEventListener(type, (e) => {
            let target = e.target || e.srcElement;
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

    ready(fn = noop) {
      this.context.addEventListener('DOMContentLoaded', e => {
        fn.call(this);
      }, false);
    }

    observe(fn = noop, config = {childList: true, subtree: true}) {
      this.each((ele) => {
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        let observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            fn.call(this, mutation.target, mutation.addedNodes, mutation.removedNodes);
          });
        });
        observer.observe(ele, config);
      });
      return this;
    };

    attr(attr, value) {
      // one agm
      if (arguments.length === 1) {
        // get attr value
        if (typeof attr === 'string') {
          return this[0].getAttribute(attr);
        }
        // set attr with a json
        else if (typeof attr === 'object') {
          this.each(function (ele) {
            for (let at in attr) {
              if (attr.hasOwnProperty(at)) {
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
          ele.setAttribute(attr, value);
        });
        return this;
      }
      else {
        return this;
      }
    };

    removeAttr(attr) {
      if (arguments.length === 1) {
        this.each((ele)=> {
          ele.removeAttribute(attr);
        });
      }
      return this;
    }

    get text() {
      let ele = this[0];
      return ele.innerText ? ele.innerText : ele.textContent;
    };

    static get fn() {
      let visible = (ele)=> {
        let pos = ele.getBoundingClientRect();
        let w;
        let h;
        let inViewPort;
        let docEle = document.documentElement;
        let docBody = document.body;
        if (docEle.getBoundingClientRect) {
          w = docEle.clientWidth || docBody.clientWidth;
          h = docEle.clientHeight || docBody.clientHeight;
          inViewPort = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
          return inViewPort ? false : true;
        }
      };
      let debounce = (fn, delay)=> {
        let timer;
        return function () {
          let agm = arguments;
          window.clearTimeout(timer);
          timer = window.setTimeout(()=> {
            fn.apply(this, agm);
          }, delay);
        }
      };
      let merge = (...sources) => {
        return Object.assign({}, ...sources);
      };
      return {
        visible,
        debounce,
        merge
      }
    };

  }

  let $ = (selectors = '', context = document) => {
    return new jqLite(selectors, context);
  };

  /**
   * timeout wrapper
   * @param fn
   * @param delay
   * @returns {number}
   */
  let $timeout = (fn = noop, delay = 0) => {
    return window.setTimeout(fn, delay);
  };

  /**
   * cancel timer
   * @param timerId
   * @returns {*}
   */
  $timeout.cancel = function (timerId) {
    window.clearTimeout(timerId);
    return timerId;
  };

  /**
   * http service
   * @param ops
   * @returns {Promise}
   */
  let $http = function (ops = {}) {
    let deferred = $q.defer();

    let onreadystatechange = (response)=> {
      if (response.readyState !== 4) return;
      response.requestUrl = ops.url;
      if (/^(2|3)/.test(response.status)) {
        deferred.resolve(response);
      } else {
        deferred.reject(response);
      }
    };

    let ontimeout = (response)=> {
      response.requestUrl = ops.url;
      response && response.finalUrl ? deferred.resolve(response) : deferred.reject(response);
    };

    let onerror = (response)=> {
      response.requestUrl = ops.url;
      response && response.finalUrl ? deferred.resolve(response) : deferred.reject(response);
    };

    ops = jqLite.fn.merge({
      onreadystatechange,
      ontimeout,
      onerror
    }, ops);

    // make the protocol agree
    if (!new RegExp(`^${window.location.protocol}`).test(ops.url)) {
      ops.url = ops.url.replace(/^(http|https):/im, window.location.protocol);
    }

    GM_xmlhttpRequest(ops);
    return deferred.promise;
  };

  $http.head = function (url, ops = {}) {
    var deferred = $q.defer();
    ops = jqLite.fn.merge(ops, {url, method: 'HEAD'});
    $http(ops)
      .then(function (response) {
        deferred.resolve(response);
      }, function (response) {
        deferred.reject(response);
      });
    return deferred.promise;
  };

  $http.get = function (url, ops = {}) {
    let deferred = $q.defer();
    ops = jqLite.fn.merge(ops, {url, method: 'GET'});
    $http(ops)
      .then(function (response) {
        deferred.resolve(response);
      }, function (response) {
        deferred.reject(response);
      });
    return deferred.promise;
  };

  $http.post = function (url, ops = {}) {
    var deferred = $q.defer();
    ops = jqLite.fn.merge(ops, {url, method: 'POST'});
    $http(ops)
      .then(function (response) {
        deferred.resolve(response);
      }, function (response) {
        deferred.reject(response);
      });
    return deferred.promise;
  };

  /**
   * simple deferred object like angularJS $q or q promise library
   * @param fn                 promise function
   * @returns {Promise}
   */
  let $q = function (fn = noop) {
    return new Promise(fn);
  };

  /**
   * generator a deferred object use like angularJS's $q service
   * @returns {{}}
   */
  $q.defer = function () {
    let deferred = {};

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

  // config
  const config = {
    rules: `
      a[href*="www.baidu.com/link?url"]
      :not(.m)
      :not([decoding])
      :not([decoded])
    `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1'),
    debug: false,
    debugDecoded: `
      background-color:green !important;
      color:#303030 !important;
    `,
    debugDecoding: `
      background-color:yellow !important;
      color:#303030 !important;
    `
  };

  let isDecodingAll = false;

  /**
   * the main class to bootstrap this script
   */
  class main {
    constructor(agm = '') {
      if (!agm) return this;

      this.inViewPort = [];

      $(agm).each(ele => jqLite.fn.visible(ele) && this.inViewPort.push(ele))
    }

    /**
     * request a url which has origin links
     * @returns {Promise}
     */
    all() {
      var deferred = $q.defer();

      let url = window.top.location.href.replace(/(\&)(tn=\w+)(\&)/img, '$1' + 'tn=baidulocal' + '$3');

      isDecodingAll = true;

      $http.get(url, {timeout: 5000})
        .then(function (response) {
          isDecodingAll = false;

          if (!response) return;
          let responseText = response.responseText;

          // remove the image/script/css resource
          responseText = responseText.replace(/src=[^>]*/, '');

          let html = document.createElement('html');
          html.innerHTML = responseText;

          $('.t>a:not(.OP_LOG_LINK):not([decoded])').each(sourceEle=> {
            $('.f>a', html).each((targetEle) => {
              if ($(sourceEle).text === $(targetEle).text) {
                sourceEle.href = targetEle.href;
                $(sourceEle).attr('decoded', true);
                config.debug && (sourceEle.style.cssText = config.debugDecoded);
              }
            });
          });

          deferred.resolve(response);

        }, function (response) {
          isDecodingAll = false;
          deferred.reject(response);
        });

      return deferred.promise;
    }

    one(aEle) {
      var deferred = $q.defer();

      if (!main.match(aEle)) return $q.reject();

      $(aEle).attr('decoding', true);

      // debug info
      config.debug && (aEle.style.cssText = config.debugDecoding);

      $http.get(aEle.href)
        .then(function (response) {
          $(aEle)
            .attr('href', response.finalUrl)
            .attr('decoded', true)
            .removeAttr('decoding');
          // debug info
          config.debug && (aEle.style.cssText = config.debugDecoded);
          deferred.resolve(response);
        }, function (response) {
          console.error(response);
          deferred.reject(response);
        });

      return deferred.promise;
    }

    /**
     * request the A tag's href one by one those in view port
     * @returns {main}
     */
    oneByOne() {
      $(this.inViewPort).each(aEle => {
        if (!main.match(aEle)) return;
        this.one(aEle);
      });
      return this;
    }

    /**
     * match the Element
     */
    static match(ele) {
      if (ele.tagName !== "A"
        || !ele.href
        || !/www\.baidu\.com\/link\?url=/im.test(ele.href)
        || !!$(ele).attr('decoded')
        || !!$(ele).attr('decoding')
      ) {
        return false;
      } else {
        return true;
      }
    }

  }

  console.info('去跳转启动...');

  /**
   * bootstrap the script
   */
  $(()=> {

    let init = ()=> {
      new main(config.rules).all()
        .then(function () {
          return $q.resolve();
        }, function () {
          return $q.resolve();
        })
        .then(function () {
          new main(config.rules).oneByOne();
        });
    };

    // init
    init();

    let observeDebounce = jqLite.fn.debounce((target, addList = [], removeList = []) => {
      if (!addList.length) return;
      isDecodingAll ? new main(config.rules).oneByOne() : init();
    }, 100);
    $(document).observe(function (target, addList = [], removeList = []) {
      observeDebounce(target, addList, removeList);
    });

    let scrollDebounce = jqLite.fn.debounce(() => {
      new main(config.rules).oneByOne();
    }, 100);
    $(window).bind('scroll', ()=> {
      scrollDebounce();
    });

    $(document).bind('mouseover', (e) => {
      let aEle = e.target;

      if (!main.match(aEle)) return;

      new main().one(aEle);
    });

  });

})(window, document);


/* jshint ignore:end */