// ==UserScript==
// @name    去除贴吧列表里面的广告
// @author  burningall
// @description 去除贴吧掺夹在【帖子列表】【回复列表】里的广告
// @version     2015.8.25.2
// @grant        none
// @run-at      document-start
// @include         http://tieba.baidu.com/*
// @supportURL      http://www.burningall.com
// @contributionURL troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==

(function(document) {
    function handler(obj) {
        return new Event(obj);
    }
    function Event(obj) {
        this.element = obj;
        return this;
    }
    Event.prototype.addEvent = function(type, fn) {
        var obj = this.element;
        var ev;
        return obj.addEventListener ?
            obj.addEventListener(type, function(e) {
                ev = window.event ? window.event : (e ? e : null);
                ev.target = ev.target || ev.srcElement;
                if (fn.call(obj, ev) === false) {
                    ev.cancelBubble = true;
                    ev.preventDefault();
                }
            }, false) :
            obj.attachEvent('on' + type, function(e) {
                ev = window.event ? window.event : (e ? e : null);
                ev.target = ev.target || ev.srcElement;
                if (fn.call(obj, ev) === false) {
                    ev.cancelBubble = true;
                    return false;
                }
            });
    };
    Event.prototype.bind = function(type, fn) {
        var obj = this.element;
        if (arguments.length == 1) {
            for (var attr in type) {
                this.addEvent(attr, type[attr]);
            }
        } else if (arguments.length == 2) {
            var events = type.split(' ');
            var eventsLength = events.length;
            var j = 0;
            while (j < eventsLength) {
                this.addEvent(events[j], fn);
                j++;
            }
        }
        return this;
    };
    Event.prototype.ob = function(config, fn) {
        var target = this.element;
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
            observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    fn.call(target);
                });
            });
        observer.observe(target, config);
        return this;
    };
    var count = {
        "adlist": 0,
        "keyword": 0
    };
    function init() {
        return new Init();
    }
    function Init() {
        this.adlistSelector = '[data-daid]:not([filted]),#thread_list>li:not([class~=j_thread_list]):not(.thread_top_list_folder):not([filted]),#j_p_postlist>div:not([data-field]):not([filted])';
        this.keywordSelector = '#j_p_postlist a[data-swapword]:not([filted]),#j_p_postlist a.ps_cb:not([filted])';
        this.adlist = document.querySelectorAll(this.adlistSelector);
        this.keyword = document.querySelectorAll(this.keywordSelector);
        this.adlistLength =  this.adlist.length;
        this.keywordLength =  this.keyword.length;
    }
    Init.prototype.filter = function() {
        for (var i = 0; i < this.adlistLength; i++) {
            this.adlist[i].style.cssText = "display: none !important;";
            this.adlist[i].setAttribute("filted","true");
            // this.adlist[i].remove(this);
            count.adlist++;
        }
        for (var j = 0; j < this.keywordLength; j++) {
            this.keyword[j].setAttribute("filted","true");
            this.keyword[j].removeAttribute('data-swapword');
            this.keyword[j].removeAttribute('class');
            this.keyword[j].removeAttribute('href');
            this.keyword[j].style.color = '#333';
            handler(this.keyword[j]).bind("click mouseover", function() {
                return false;
            });
            count.keyword++;
        }
        return this;
    };
    Init.prototype.count = function(callBack){
        this.ul = document.querySelectorAll('ul.nav_list');
        this.li = document.getElementById('filterTip') || document.createElement('li');
        this.li.id = "filterTip";
        if( this.li.innerText ){
            this.li.innerText = "广告帖:" + count.adlist + "关键字:" + count.keyword + "";
        }else{
            this.li.textContent = "广告帖:" + count.adlist + "关键字:" + count.keyword + "";
        }
        if( !document.getElementById('filterTip') ){
            this.ul[0].appendChild(this.li);
        }
        if (callBack) callBack();
        return this;
    };
    handler(document).bind("DOMContentLoaded",function(){
       init().filter().count();
       var obElement = document.querySelector("#content") ? document.querySelector("#content") : document.querySelector("#j_p_postlist");
        handler(obElement).ob({
            "childList":true,
            "subtree":true
        },function(){
            init().filter().count();
        });
    });
})(document);