// ==UserScript==
// @name    去百度搜索置顶推广
// @author  burningall
// @description 去除插入在百度搜索结果头部、尾部的推广链接。
// @version     2015.8.26
// @grant        none
// @include     *www.baidu.com*
// @supportURL      http://www.burningall.com
// @run-at      document-start
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

    function init() {
        return new RemoveAds();
    }
    function RemoveAds() {
        this.ads = document.querySelectorAll('#content_left>div:not([class*=result]):not([class*=container]):not(.leftBlock):not([adsFilted]),#content_left>table:not(.result):not([adsFilted])');
        this.length = this.ads.length;
        var a = {};
        var temps = [];
        for( var i=0;i<this.length;i++){
            var v = this.ads[i];
            if( typeof a[v] =="undefined" ){
                a[v] = 1;
                temps.push( v );
            }
        }
        this.ads = temps;
        this.length =this.ads.length;
    }
    var count = {
        "num":0,
        "hadChange":false
    };
    RemoveAds.prototype.filter = function(){
        for(var i=0;i<this.length;i++ ){
            this.ads[i].style.cssText = "display:none !important";
            this.ads[i].setAttribute("adsFilted","");
            console.log( this.ads[i] );
            count.num++;
        }
        count.hadChange = this.length>0 ? true : false;
        return this;
    };
    RemoveAds.prototype.showTip = function() {
        if( count.hadChange !== true ) return this;
        var insertPos = document.querySelector('.nums');
        if (insertPos) {
            var span = document.querySelector('span.adTip') || document.createElement('span'),
                spanTextStr = "……累计过滤" + count.num + "条推广链接";
            if (this.tipWord) {
                if( span.innerText ){
                    span.innerText = spanTextStr;
                }else{
                    span.textContent = spanTextStr;
                }
            } else {
                if( span.innerText ){
                    span.innerText = spanTextStr;
                }else{
                    span.textContent = spanTextStr;
                }
                span.className = "adTip";
                insertPos.appendChild(span);
            }
        }
        count.hadChange = false;
    };
    handler(document).bind("DOMContentLoaded",function(){
        handler(this).ob({
            "childList":true,
            "subtree":true
        },function(){
            init().filter().showTip();
        });
    });
})(document);