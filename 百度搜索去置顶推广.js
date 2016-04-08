// ==UserScript==
// @name              去百度搜索置顶推广
// @author            axetroy
// @description       去除插入在百度搜索结果头部、尾部的推广链接。
// @version           2016.4.8
// @grant             none
// @include           *www.baidu.com*
// @connect           *
// @supportURL        http://www.burningall.com
// @run-at            document-start
// @contributionURL   troy450409405@gmail.com|alipay.com
// @namespace         https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==

/* jshint ignore:start */

;(function (window) {

  'use strict';

  var ES6Support = true;

  try {
    class test {

    }
  } catch (e) {
    /**
     * 促进大家升级浏览器，拯救前端，就是拯救我自己
     */
    alert('你的浏览器不支持ECMA6，去百度搜索置顶推广将失效，请升级浏览器和脚本管理器');
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
        if (Object.prototype.toString.call(types) === '[object String]') {
          types.trim().split(/\s{1,}/).forEach((type)=> {
            ele.addEventListener(type, (e) => {
              e = window.event ? window.event : (e ? e : null);
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
        } else {
          ele.addEventListener(type, (e) => {
            e = window.event ? window.event : (e ? e : null);
            let target = e.target || e.srcElement;
            if (fn.call(target, e) === false) {
              e.returnValue = true;
              e.cancelBubble = true;
              e.preventDefault && e.preventDefault();
              e.stopPropagation && e.stopPropagation();
              return false;
            }
          }, false);
        }

      });
    }

    observe(config, fn = noop) {
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

  }

  let $ = (selectors) => {
    return new jqLite(selectors);
  };

  const defaultRules = `
    #content_left>div
    :not([class*=result])
    :not([class*=container])
    :not(.leftBlock)
    :not(#rs_top_new)
    :not([filtered])
    ,
    #content_left>table
    :not(.result)
    :not([filtered])
    ,
    #content_right>table td
    div#ec_im_container
    ,
    div.s-news-list-wrapper>div
    :not([data-relatewords*="1"])
  `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1');

  let adsCount = 0;

  class main {

    constructor(rules = defaultRules) {
      this.ads = $(rules);
      this.length = this.ads.length;
    }

    filter() {
      this.ads.each((ele, i)=> {
        ele.style.cssText = `
          display:none !important;
          visibility:hidden !important;
          width:0 !important;
          height:0 !important;
          overflow:hidden !important;
          // background-color:red !important;
          // border:1px solid red;
        `;
        ele.setAttribute('filtered', '');
        adsCount++;
      });
      return this;
    }

    turn() {
      $('#content_left input[type=checkbox]:not(filtered)').each(function (ele) {
        ele.checked = false;
        ele.setAttribute('filtered', '');
      });
      return this;
    }

  }

  let $interval = window.setInterval(function () {
    new main().filter().turn();
  }, 50);

  $(window.document).bind('DOMContentLoaded', () => {
    new main().filter().turn();
    window.clearInterval($interval);
    $(window.document).observe({
      "childList": true,
      "subtree": true
    }, () => {
      new main().filter().turn();
    });

  });

  console.info('去广告启动...');

})(typeof window === 'undefined' ? this : window);

/* jshint ignore:end */
