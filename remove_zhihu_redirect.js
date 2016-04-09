// ==UserScript==
// @name              去除知乎跳转
// @author            axetroy
// @description       去除知乎重定向，不再跳转
// @version           2016.4.9
// @include           *www.zhihu.com*
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
    class test_class {

    }
  } catch (e) {
    /**
     * 促进大家升级浏览器，拯救前端，就是拯救我自己
     */
    alert('你的浏览器不支持ECMA6，去除知乎跳转将失效，请升级浏览器和脚本管理器');
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

  let redirect = `link.zhihu.com/?target=`;
  let config = {
    rules: `
      a[href*="${redirect}"]
    `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1')
  };

  class main {
    constructor(agm = '') {
      if (!agm) return this;
      this.inViewPort = [];

      $(agm).each((aEle) => {
        if (jqLite.visible(aEle)) this.inViewPort.push(aEle);
      });
    }

    redirect() {
      $(this.inViewPort).each(function (aEle) {
        if (!aEle || !aEle.href) return;
        aEle.href = aEle.href.trim().replace(/^.*link\.zhihu\.com\/\?target=(.*?)$/im, '$1')
          .trim().replace(/^\s*http[^\/]*\/\//, 'http://');
      });
      return this;
    }

  }

  console.info('知乎去跳转启动...');

  $(document).bind('DOMContentLoaded', ()=> {

    // init
    new main(config.rules).redirect();

    let observeDebounce = jqLite.debounce((target, addList, removeList) => {
      if (!addList || !addList.length) return;
      new main(config.rules).redirect();
    }, 200);

    $(document).observe(function (target, addList, removeList) {
      observeDebounce(target, addList, removeList);
    });

    let scrollDebounce = jqLite.debounce(() => {
      new main(config.rules).redirect();
    }, 200);
    $(window).bind('scroll', ()=> {
      scrollDebounce();
    });

  });

})(window, document);

/* jshint ignore:end */


