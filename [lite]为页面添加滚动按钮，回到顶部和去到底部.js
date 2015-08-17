// ==UserScript==
// @name    Lite Add button for Smooth Scroll to the top / bottom
// @author  burningall
// @description 为页面添加按钮，平滑的滚动到顶部/底部
// @version     2015.8.15
// @include     *
// @grant       GM_addStyle
// @run-at      document-start
// @compatible  chrome  完美支持
// @compatible  firefox  完美支持
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @supportURL      http://www.burningall.com
// @contributionURL troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==
// 
// 
// 
//=======快捷键======
//alt+1>>>>>>回到顶部
//alt+2>>>>>>去到底部
//================公共函数区============
(function(window, document) {

    function addEvent(obj, type, fn) {
        return obj.addEventListener ?
            obj.addEventListener(type, function(e) {
                var ev = window.event ? window.event : (e ? e : null);
                ev.target = ev.target || ev.srcElement;
                if (fn.call(obj, ev) === false) { //回掉函数为false，则阻止默认时间
                    e.cancelBubble = true; //阻止冒泡
                    e.preventDefault(); //chrome，firefox下阻止默认事件
                }
            }, false) :
            obj.attachEvent('on' + type, function(e) {
                //fn.call(obj,e);//解决IE8下，this是window的问题
                var ev = window.event ? window.event : (e ? e : null);
                ev.target = ev.target || ev.srcElement;
                if (fn.call(obj, ev) === false) {
                    e.cancelBubble = true; //阻止冒泡
                    return false; //阻止默认事件，针对IE8
                }
            });
    }

    function getSize(obj) {
        return document.documentElement[obj] !== 0 ? document.documentElement[obj] : document.body[obj];
    }

    function hasScroll() {
        return getSize('scrollHeight') > getSize('clientHeight') ? true : false;
    }

    function getStyle(obj, attr) {
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
    }

    function $(id) {
        return document.getElementById(id);
    }

    function animate(obj, json, cfgjson) {
        clearInterval(obj.animate);
        obj.animate = setInterval(function() {
            var bStop = true; //判断运动是否停止
            for (var attr in json) { //attr代表属性,'width','height'.而json[attr]代表数值
                // 1. 取得当前的值（可以是width，height，opacity等的值）
                var objAttr = 0;
                if (attr == 'opacity') { //当前值
                    objAttr = Math.round(parseFloat(getStyle(obj, attr)) * 100);
                } else if (attr == "scrollTop") {
                    objAttr = parseInt(getSize("scrollTop"));
                } else {
                    objAttr = parseInt(getStyle(obj, attr));
                }
                // 2.计算运动速度
                var jsonattr = parseFloat(json[attr]); //目标值
                var speedConfig = (cfgjson && typeof(cfgjson.speed) != 'undefined') ? cfgjson.speed : 10;
                var iSpeed = (jsonattr - objAttr) / speedConfig; //(目标数值-当前数值)/10
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed); //如果速度>0，则速度向上取整，如果小于0，则保留小数
                // 3. 检测所有运动是否到达目标
                //objAttr,当前点，json[attr]为目标点
                if ((iSpeed > 0 && objAttr <= jsonattr) || (iSpeed < 0 && objAttr >= jsonattr)) { //如果有其中一项没有达到目标
                    bStop = false;
                }
                if (attr == "opacity") {
                    obj.style.filter = 'alpha(opacity:' + (objAttr + iSpeed) + ')';
                    obj.style.opacity = (objAttr + iSpeed) / 100;
                } else if (attr == "scrollTop") {
                    document.documentElement.scrollTop = document.body.scrollTop = objAttr + iSpeed;
                } else {
                    obj.style[attr] = objAttr + iSpeed + 'px'; //赋值开始运动
                }
                if (bStop) { // 表示所有运动都到达目标值
                    clearInterval(obj.animate);
                    if (cfgjson && typeof cfgjson.endFn != 'undefined') {
                        cfgjson.endFn.call(obj);
                    }
                }
            } //for
        }, 20);
    }
    //================样式区============
    var cssText = '#scrollMars-troy{position:fixed;right:30px;z-index:9999999}#scrollMars-troy #mars-point{width:100px;height:100px;position:absolute;top:0;left:-40px}#scrollMars-troy div div.sroll-btn-troy{width:50px;height:50px;text-align:center;background:#303030;color:#fff;display:block;opacity:0.8;filter:alpha(opacity=80);cursor:pointer;border-radius:50%;box-shadow:2px 2px 40px 2px #303030;line-height:50px;font-size:35px;font-style:inherit;font-weight:bold;font-family:"宋体"}#scrollMars-troy div div.sroll-btn-troy:hover{background:#FF0000}';
    GM_addStyle(cssText);
    //================主要代码区============
    function scroll(dir) { //obj随意，dir>0往上滚，dir<0往下滚
        var position, speed, scrollTop, scrollHeight, clientHeight;
        clearInterval(document.timerScroll);
        scrollHeight = getSize('scrollHeight');
        clientHeight = getSize('clientHeight');
        document.timerScroll = setInterval(function() {
            scrollTop = getSize('scrollTop');
            if (dir > 0) { //往上滚动
                speed = (scrollTop / 10) + 1;
                position = scrollTop - speed;
                if (position <= 0) { //如果滚到顶部
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                    clearInterval(document.timerScroll);
                }
            } else { //往下滚动
                speed = ((scrollHeight - scrollTop - clientHeight) / 10) + 1;
                position = scrollTop + speed;
                if (position + clientHeight >= scrollHeight) { //如果滚到底部
                    document.body.scrollTop = document.documentElement.scrollTop = scrollHeight;
                    clearInterval(document.timerScroll);
                }
            }
            document.body.scrollTop = document.documentElement.scrollTop = position;
        }, 20);
    }

    function marsMove(dir) {
        var mars = $('scrollMars-troy');
        var point = $('mars-point');
        if (dir == "moveIn") { //移入
            clearTimeout(mars.timerHover);
            animate(mars, {
                "right": "30",
                "opacity": "100"
            });
            animate(point, {
                "left": "0"
            });
        } else if (dir == "moveOut") { //移出
            clearTimeout(mars.timerHover);
            mars.timerHover = setTimeout(function() {
                animate(mars, {
                    "right": "-30",
                    "opacity": "30"
                });
                animate(point, {
                    "left": "-40"
                });
            }, 3000);
        }
    }

    function init() {
        var scrollBtn = $("scrollMars-troy");
        if (scrollBtn) {
            scrollBtn.style.top = (getSize('clientHeight') / 3) + 'px';
        }
        if (hasScroll() === true && !scrollBtn) { //如果有滚动条，并且没有按钮
            var mars = document.createElement('div'),
                goTop, goBtm, point;
            mars.id = "scrollMars-troy";
            window.top.document.documentElement.appendChild(mars);
            mars.innerHTML =
                '<div id=\'mars-point\'></div>' +
                '<div>' +
                '    <div id=\'goTop-troy\' title=\'返回顶部\' class=\'sroll-btn-troy\'></div>' +
                '    <div id=\'goBtm-troy\' title=\'去到底部\' class=\'sroll-btn-troy\'></div>' +
                '</div>';
            goTop = $("goTop-troy");
            goBtm = $("goBtm-troy");
            goTop.innerHTML = "↑";
            goBtm.innerHTML = "↓";
            $('scrollMars-troy').style.top = (getSize('clientHeight') / 3) + 'px';
            addEvent(goTop, "click", function() {
                scroll(1);
                return false;
            });
            addEvent(goBtm, "click", function() {
                scroll(-1);
                return false;
            });
            addEvent(mars, 'mouseover', function() {
                marsMove("moveIn");
                return false;
            });
            addEvent(mars, 'mouseout', function() {
                marsMove("moveOut");
                return false;
            });
            addEvent(mars, 'mousedown', function() {
                return false;
            });
            marsMove("moveOut");
        }
    }
    //================执行区============
    addEvent(window, "mousewheel", function() {
        clearInterval(document.timerScroll);
    });
    addEvent(window, "DOMMouseScroll", function() {
        clearInterval(document.timerScroll);
    });
    addEvent(window.top, "resize", function() { //页面大小改变，初始化按钮
        init();
    });

    addEvent(document, 'DOMContentLoaded', function() {
        init();
    });
    //================快捷键区============
    addEvent(window, 'keydown', function(e) {
        if (e.altKey && e.keyCode == 49) { //alt+1，向上滚动
            scroll(1);
        } else if (e.altKey && e.keyCode == 50) { //alt+2，向下滚动
            scroll(-1);
        } else if (e.ctrlKey && e.altKey) { //ctrl+alt,调出按钮
            marsMove("moveIn");
        }
    }); //监听keydown，快捷键

})(window, document);