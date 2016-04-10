// ==UserScript==
// @name              remove the jump link in BAIDU (ECMA6)
// @author            axetroy
// @description       去除百度搜索跳转链接
// @version           2016.4.10.1
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
;(function (window, document) {

  'use strict';

  var ES6Support = true;

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
    ES6Support = false;
  }

  if (!ES6Support) return;

  let noop = () => {
  };

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
      if (!arguments.length === 1) {
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
        }
        return value;
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
      return {
        visible,
        debounce
      }
    };

  }

  let $ = (selectors = '', context = document) => {
    return new jqLite(selectors, context);
  };

  /**
   * cache the ajax response result
   * @type {{}}
   */
  let $$cache = {};

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

  let $$count = 0;

  /**
   * ajax function
   * @param url           the url request
   * @param aEle          the A link element [non essential variables]
   * @returns {Promise}
   */
  let $ajax = (url, aEle) => {
    var deferred = $q.defer();

    // if in BAIDU home page
    if (new RegExp(`${window.location.host}\/?$`, 'im').test(url)) {
      $timeout(function () {
        deferred.resolve({aEle, url, response: ''});
        return deferred.promise;
      });
    }

    // if has cache
    if ($$cache[url]) {
      $timeout(function () {
        deferred.resolve({aEle, url, response: $$cache[url]});
        return deferred.promise;
      });
    }

    // not match the url
    if (!/w{3}\.baidu\.com\/link\?url=/im.test(url) && !/w{3}\.baidu\.com\/s/.test(url)) {
      $timeout(function () {
        deferred.resolve({aEle, url, response: {finalUrl: url}});
        return deferred.promise;
      });
    }

    // make the protocol agree
    if (!new RegExp(`^${window.location.protocol}`).test(url)) {
      url = url.replace(/^(http|https):/im, window.location.protocol);
    }

    if (config.debug) console.info(`${$$count++}-ajax:${url}`);

    if (aEle) $(aEle).attr('decoding', '');

    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      // timeout: 5000,
      anonymous: !!aEle,
      onreadystatechange: function (response) {
        if (response.readyState !== 4) return;
        let data = {aEle, url, response};
        if (/^(2|3)/.test(response.status)) {
          $$cache[url] = response;
          aEle && $(aEle).attr('decoded', '');
          deferred.resolve(data);
        } else {
          deferred.reject(data);
        }
        aEle && $(aEle).removeAttr('decoding');
      },
      ontimeout: (response)=> {
        let data = {aEle, url, response};
        config.debug && console.error(data);
        aEle && $(aEle).removeAttr('decoding');
        deferred.reject(data);
        response && response.finalUrl ? deferred.resolve(data) : deferred.reject(data);
      },
      onerror: (response)=> {
        let data = {aEle, url, response};
        config.debug && console.error(data);
        aEle && $(aEle).removeAttr('decoding');
        response && response.finalUrl ? deferred.resolve(data) : deferred.reject(data);
      }
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
      deferred.resolve = function (data) {
        resolve(data);
      };
      deferred.reject = function (data) {
        reject(data);
      };
    });

    return deferred;
  };

  $q.resolve = function (data) {
    return $q(function (resolve, reject) {
      resolve(data);
    });
  };

  $q.reject = function (data) {
    return $q(function (resolve, reject) {
      reject(data);
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
    debug: true
  };

  let isDecodingAll = false;

  /**
   * the main class to bootstrap this script
   */
  class main {
    constructor(agm = '') {
      if (!agm) return this;

      this.inViewPort = [];

      $(agm).each((ele) => {
        if (jqLite.fn.visible(ele)) this.inViewPort.push(ele);
      });
    }

    /**
     * request a url which has origin links
     * @returns {Promise}
     */
    all() {
      var deferred = $q.defer();

      let url = window.top.location.href.replace(/(\&)(tn=\w+)(\&)/img, '$1' + 'tn=baidulocal' + '$3');

      isDecodingAll = true;
      $ajax(url)
        .then(function (data) {
          isDecodingAll = false;

          if (!data.response) return;
          let response = data.response.responseText;

          // remove the image which load with http not https
          response = response.replace(/src=[^>]*/, '');

          let html = document.createElement('html');
          html.innerHTML = response;

          $('.t>a:not(.OP_LOG_LINK):not([decoded])').each((sourceEle)=> {
            $('.f>a', html).each((targetEle) => {
              if ($(sourceEle).text === $(targetEle).text) {
                sourceEle.href = targetEle.href;
                $(sourceEle).attr('decoded', '');
                if (config.debug) sourceEle.style.background = 'green';
              }
            });
          });

          deferred.resolve(data);
        }, function (data) {
          isDecodingAll = false;
          deferred.reject(data);
        });

      return deferred.promise;
    }

    /**
     * request the A tag's href one by one those in view port
     * @returns {main}
     */
    oneByOne() {
      $(this.inViewPort).each(function (aEle) {
        if (/www\.baidu\.com\/link\?url=/im.test(aEle.href) === false)return;
        $ajax(aEle.href, aEle)
          .then(function (data) {
            if (!data) return;
            data.aEle.href = data.response.finalUrl;
            if (config.debug) data.aEle.style.background = 'green';
          });
      });
      return this;
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
          new main(config.rules).oneByOne();
        }, function () {
          new main(config.rules).oneByOne();
        });
    };

    // init
    init();

    let observeDebounce = jqLite.fn.debounce((target, addList, removeList) => {
      if (!addList || !addList.length) return;
      if (isDecodingAll === true) {
        new main(config.rules).oneByOne();
      } else {
        init();
      }
    }, 200);
    $(document).observe(function (target, addList, removeList) {
      observeDebounce(target, addList, removeList);
    });

    let scrollDebounce = jqLite.fn.debounce(() => {
      new main(config.rules).oneByOne();
    }, 200);
    $(window).bind('scroll', ()=> {
      scrollDebounce();
    });

    let overDebouce = jqLite.fn.debounce((e)=> {
      let aEle = e.target;
      if (aEle.tagName !== "A" || !aEle.href || !/w{3}\.baidu\.com\/link\?url=/im.test(aEle.href)) return;
      $ajax(aEle.href, aEle)
        .then(function (data) {
          data.aEle.href = data.response.finalUrl;
        });
    }, 100);
    $(document).bind('mouseover', (e) => {
      overDebouce(e);
    });


  });

})(window, document);


/* jshint ignore:end */


