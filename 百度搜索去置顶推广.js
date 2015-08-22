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
        this.ads = document.querySelectorAll('#content_left>*');
        this.length = this.ads.length;
        for (var i = 0; i < this.length; i++) {
            this.id = this.ads[i].getAttribute("id");
            if (this.id > 1000 || this.id === null) {
                num++;
                this.ads[i].style.cssText = "display: none !important;";
                this.ads[i].remove(this);
                // console.log( this.ads[i] );
                this.showTip();
            }
        }
    }
    var num = 0;
    RemoveAds.prototype.showTip = function() {
        this.tip = document.querySelectorAll('.nums')[0];
        if (this.tip) {
            this.tipWord = document.querySelectorAll('span.adTip')[0];
            this.span = this.tipWord || document.createElement('span');
            if (this.tipWord) {
                this.span.textContent = "……已过滤" + num + "条推广链接";
            } else {
                this.span.textContent = "……已过滤" + num + "条推广链接";
                this.span.className = "adTip";
                this.tip.appendChild(this.span);
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