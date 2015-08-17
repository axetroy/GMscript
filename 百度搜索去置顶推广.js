// ==UserScript==
// @name	去百度搜索置顶推广
// @author	burningall
// @description	去除插入在百度搜索结果头部、尾部的推广链接。
// @version     2015.6.2
// @include		*www.baidu.com*
// @supportURL		http://www.burningall.com
// @contributionURL	troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==

(function(document) {
    function addEvent(obj, event, fn) {
        return obj.addEventListener ? obj.addEventListener(event, fn, false) : obj.attachEventListener('on' + event, fn);
    }
    function removeAds() {
        var adlist = document.querySelectorAll('#content_left>*');
        for (var i = 0; i < adlist.length; i++) {
            var id = adlist[i].getAttribute("id");
            if (id > 1000 || id === null) {
                adlist[i].style.cssText = "display: none !important;";
                adlist[i].remove(adlist[i]);
            }
        }
    }
    addEvent(document, 'DOMNodeInserted', function() {
        removeAds();
    });
})(document);