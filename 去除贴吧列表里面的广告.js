// ==UserScript==
// @name    去除贴吧列表里面的广告
// @author  burningall
// @description 去除贴吧掺夹在【帖子列表】【回复列表】里的广告
// @version     2015.8.1.1
// @include         http://tieba.baidu.com/*
// @run-at      document-start
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
                    ev.cancelBubble = true; //阻止冒泡
                    ev.preventDefault(); //chrome，firefox下阻止默认事件
                }
            }, false) :
            obj.attachEvent('on' + type, function(e) {
                ev = window.event ? window.event : (e ? e : null);
                ev.target = ev.target || ev.srcElement;
                if (fn.call(obj, ev) === false) {
                    ev.cancelBubble = true; //阻止冒泡
                    return false; //阻止默认事件，针对IE8
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
        this.adlist = document.querySelectorAll('[data-daid],#thread_list>li:not([class~=j_thread_list]),#j_p_postlist>div:not([data-field])');
        this.keyword = document.querySelectorAll('#j_p_postlist a[data-swapword],#j_p_postlist a.ps_cb');
    }
    Init.prototype.filter = function() {
        for (var i = 0; i < this.adlist.length; i++) {
            if (this.adlist[i].className == "thread_top_list_folder") continue;
            this.adlist[i].style.cssText = "display: none !important;";
            this.adlist[i].remove(this);
            // console.log(this.adlist[i]);
            count.adlist++;
        }
        for (var j = 0; j < this.keyword.length; j++) {
            handler(this.keyword[j]).bind("click mouseover", function() {
                return false;
            });
            this.keyword[j].removeAttribute('data-swapword');
            this.keyword[j].removeAttribute('class');
            this.keyword[j].removeAttribute('href');
            this.keyword[j].style.color = '#333';
            // console.log(this.keyword[j]);
            count.keyword++;
        }
        return this;
    };
    Init.prototype.count = function(){
        this.ul = document.querySelectorAll('ul.nav_list');
        this.li = document.getElementById('filterTip') || document.createElement('li');
        this.li.id = "filterTip";
        this.li.innerText = this.li.textContent = "已过滤：" + count.adlist + "条广告贴，" + count.keyword + "个关键字";
        this.ul[0].appendChild(this.li);
        // console.log( count.keyword );
        return this;
    };
    handler(document).bind({
        "DOMContentLoaded": function() {
            init().filter().count();
            handler(document).ob({
                "childList": true,
                "subtree": true
            }, function() {
                init().filter().count();
            });
        }
    });
})(document);