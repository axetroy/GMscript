// ==UserScript==
// @name              remove the jump link in BAIDU
// @author            axetroy
// @description       去除百度搜索跳转链接
// @version           2016.4.9.3
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

  let noop = function () {
  };

  class jqLite {
    constructor(selectors = '') {
      this.selectors = selectors;
      let elements = typeof selectors === 'string' ?
        document.querySelectorAll(selectors) :
        selectors.length ? selectors : [selectors];
      for (let i = 0; i < elements.length; i++) {
        this[i] = elements[i];
      }
      this.length = elements.length;
    }

    each(fn = noop) {
      for (let i = 0; i < this.length; i++) {
        fn.call(this, this[i], i);
      }
      return this;
    }

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
    }

    static visible(ele) {
      let pos = ele.getBoundingClientRect();
      let w;
      let h;
      let inViewPort;
      if (document.documentElement.getBoundingClientRect) {
        w = document.documentElement.clientWidth || document.body.clientWidth;
        h = document.documentElement.clientHeight || document.body.clientHeight;
        inViewPort = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
        return inViewPort ? false : true;
      }
    }

    static text(ele) {
      return ele.innerText ? ele.innerText : ele.textContent;
    }

    static debounce(fn, delay) {
      let timer;
      return function () {
        let agm = arguments;
        window.clearTimeout(timer);
        timer = window.setTimeout(()=> {
          fn.apply(this, agm);
        }, delay);
      }
    }

  }

  let $ = (selectors = '') => {
    return new jqLite(selectors);
  };

  let $cache = {};

  let $timeout = (fn = noop, delay = 0) => {
    return window.setTimeout(fn, delay);
  };

  $timeout.cancel = function (timerId) {
    window.clearTimeout(timerId);
  };

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
    if ($cache[url]) {
      $timeout(function () {
        deferred.resolve({aEle, url, response: $cache[url]});
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

    if (config.debug) console.info(`ajax:${url}`);

    if (aEle && aEle.setAttribute) aEle.setAttribute("decoding", "true");

    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onreadystatechange: function (response) {
        if (response.readyState !== 4) return;
        var data = {aEle, url, response};
        $cache[url] = response;
        if (/^(2|3)/.test(response.status)) {
          aEle && aEle.setAttribute('decoded', 'true');
          deferred.resolve(data);
        } else {
          aEle && aEle.setAttribute('decoded', 'false');
          deferred.reject(data);
        }
      }
    });

    return deferred.promise;
  };

  let $q = function (fn = noop) {
    return new Promise(fn);
  };

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

  let redirect = `www.baidu.com/link?url`;
  let config = {
    rules: `
      a[href*="${redirect}"]
      :not(.m)
      :not([decoding])
      :not([decoded])
      :not([decodeAll])
    `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1'),
    reloadRules: `a[decoded*="false"]`,
    debug: false
  };
  let isDecodingAll = false;

  class main {
    constructor(agm = '') {
      if (!agm) return this;
      // 可视区域内的A链接
      this.inViewPort = [];

      $(agm).each((ele) => {
        if (jqLite.visible(ele)) this.inViewPort.push(ele);
      });
    }

    all() {
      var deferred = $q.defer();

      let url = window.top.location.href.replace(/(\&)(tn=\w+)(\&)/img, '$1' + 'tn=baidulocal' + '$3');

      isDecodingAll = true;
      $ajax(url)
        .then(function (data) {
          isDecodingAll = false;

          if (!data.response) return;
          let response = data.response.responseText;
          let html = document.createElement('html');
          html.innerHTML = response;

          $('.t>a:not(.OP_LOG_LINK):not([decoded]):not([decodeAll])').each((sourceEle)=> {
            $(html.querySelectorAll('.f>a')).each((targetEle) => {
              if (jqLite.text(sourceEle) === jqLite.text(targetEle)) {
                sourceEle.href = targetEle.href;
                sourceEle.setAttribute('decodeAll', 'true');
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

    one() {
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

  $(document).bind('DOMContentLoaded', ()=> {

    // init
    new main(config.rules).all()
      .then(function () {
        new main(config.rules).one();
      });

    let observeDebounce = jqLite.debounce((target, addList, removeList) => {
      if (!addList || !addList.length) return;
      if (isDecodingAll === true) {
        new main(config.rules).one();
      } else {
        new main(config.rules).all()
          .then(function () {
            new main(config.rules).one();
          });
      }
    }, 200);

    $(document).observe(function (target, addList, removeList) {
      observeDebounce(target, addList, removeList);
    });

    $(document).bind('mouseover', (e) => {
      let aEle = e.target;
      if (aEle.tagName !== "A" || !aEle.href || !/w{3}\.baidu\.com\/link\?url=/im.test(aEle.href)) return;
      $ajax(aEle.href, aEle)
        .then(function (data) {
          data.aEle.href = data.response.finalUrl;
        });
    });

    let scrollDebounce = jqLite.debounce(() => {
      new main(config.rules).one();
    }, 200);
    $(window).bind('scroll', ()=> {
      scrollDebounce();
    });

  });

})(window, document);

/* jshint ignore:end */


