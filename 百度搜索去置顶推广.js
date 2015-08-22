// ==UserScript==
// @name    去百度搜索置顶推广
// @author  burningall
// @description 去除插入在百度搜索结果头部、尾部的推广链接。
// @version     2015.8.22
// @include     *www.baidu.com*
// @supportURL      http://www.burningall.com
// @run-at      document-start
// @contributionURL troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==

(function(document) {

    function ob(target, config, fn) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                fn.call(target);
            });
        });
        observer.observe(target, config);
    }

    function init() {
        return new RemoveAds();
    }

    function RemoveAds() {
        var adlist = document.querySelectorAll('#content_left>*'),
            adlistLength = adlist.length,
            id;
        this.tip = document.querySelectorAll('.nums')[0];
        for (var i = 0; i < adlistLength; i++) {
            id = adlist[i].getAttribute("id");
            if (id > 1000 || id === null) {
                num++;
                adlist[i].style.cssText = "display: none !important;";
                adlist[i].remove(this);
                // console.log( adlist[i] );
                this.showTip();
            }
        }
    }
    //记录已过滤的广告数
    var num = 0;
    RemoveAds.prototype.showTip = function() {
        if (this.tip) {
            var span = document.querySelectorAll('span.adTip')[0] || document.createElement('span');
            if (document.querySelectorAll('span.adTip').length > 0) {
                span.textContent = "……已过滤" + num + "条推广链接";
            } else {
                span.textContent = "……已过滤" + num + "条推广链接";
                span.className = "adTip";
                this.tip.appendChild(span);
            }
        }
    };
    ob(document, {
        "childList": true,
        "subtree": true
    }, function() {
        init();
    });
})(document);