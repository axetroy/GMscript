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
    alert('你的浏览器不支持ECMA6，去除贴吧列表里面的广告将失效，请升级浏览器和脚本管理器');
    ES6Support = false;
  }

  if (!ES6Support) return;

  let config = {
    // 是否是调试模式
    debug: false,
    adRules: `
      ul#thread_list *[data-daid],
      ul#thread_list>li:not([data-field]):not(.thread_top_list_folder)
      ,
      #j_p_postlist *[data-daid],
      #j_p_postlist *[data-isautoreply]
      ,
      #thread_list>li
      :not([class*="list"])
      :not([data-field])
      ,
      .p_postlist>div
      :not(.p_postlist)
      :not([class*="post"])
      :not([data-field])
      ,
      #aside *[data-daid],
      #aside>div[class*="clearfix"],
      #aside DIV[id$="ad"],
      #aside #encourage_entry,
      .my_app,.j_encourage_entry，
      .right_section>div.u9_aside,
      .right_section>div.clearfix
      ,
      #pb_adbanner,#pb_adbanner *[data-daid]
      ,
      #com_u9_head,
      .u9_head,
      div.search_form>div[class*="clearfix"]
      ,
      .firework-wrap
    `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-z\*])/ig, '$1'),
    keyRules: `
      #j_p_postlist a[data-swapword]:not([filted]),
      #j_p_postlist a.ps_cb:not([filted])
    `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-z\*])/ig, '$1')
  };

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

  let $timeout = (fn = noop, delay = 0) => {
    return window.setTimeout(fn, delay);
  };

  $timeout.cancel = function (timerId) {
    window.clearTimeout(timerId);
  };

  let $interval = (fn, delay) => {
    let interval = () => {
      fn.call(this);
      id = setTimeout(interval, delay);
    };

    let id = setTimeout(interval, delay);

    return function () {
      window.clearTimeout(id);
    }
  };

  $interval.cancel = (timerFunc) => {
    timerFunc();
  };

  class main {
    constructor(agm = '') {
      if (!agm) return this;

      this.ads = $(agm);

    }

    filter() {
      this.ads.each((ele)=> {
        if (ele.$$filtered) return;
        ele.style.cssText = config.debug ? `
          border:2px solid red;
        ` : `
          display:none !important;
          visibility:hidden !important;
          width:0 !important;
          height:0 !important;
          overflow:hidden !important;
        `;
        ele.$$filtered = true;
      });
      return this;
    }

    keyword() {
      $(config.keyRules).each(function (aEle) {
        if (aEle.$$filtered) return;
        aEle.removeAttribute('data-swapword');
        aEle.removeAttribute('class');
        aEle.removeAttribute('href');
        aEle.style.cssText = config.debug ? `
          color:#fff !important;
          background-color:red !important;
        ` : `
          color:inherit !important;
        `;
        aEle.$$filtered = true;
      });
      return this;
    }

  }

  let loop = $interval(()=> {
    new main(config.adRules).filter().keyword();
  }, 50);

  console.info('贴吧去广告启动...');

  $(document).bind('DOMContentLoaded', ()=> {

    $interval.cancel(loop);

    // init
    new main(config.adRules).filter().keyword();


    let observeDebounce = jqLite.debounce((target, addList, removeList) => {
      if (!addList || !addList.length) return;
      new main(config.adRules).filter().keyword();
    }, 200);

    $(document).observe(function (target, addList, removeList) {
      observeDebounce(target, addList, removeList);
    });

    let scrollDebounce = jqLite.debounce(() => {
      new main(config.adRules).filter().keyword();
    }, 200);
    $(window).bind('scroll', ()=> {
      scrollDebounce();
    });

  });

})(window, document);

/* jshint ignore:end */
