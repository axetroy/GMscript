// ==UserScript==
// @name    remove the jump link in BAIDU
// @author  burningall
// @description 去除百度搜索跳转链接
// @version     2015.8.24
// @include     *www.baidu.com*
// @grant		GM_setValue
// @grant		GM_getValue
// @grant       GM_registerMenuCommand
// @grant		GM_xmlhttpRequest
// @run-at      document-start
// @compatible  chrome  完美运行
// @compatible  firefox  完美运行
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @supportURL      http://www.burningall.com
// @contributionURL troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==

//======说明=======
/*
如果觉得卡顿
请修改配置参数项

config.isAnimate:GM_getValue("isAnimate",false) 		关闭CSS3动画(默认开启)
config.mixRequireMod:false 								关闭混合请求(默认开启)


不懂代码就不用管

混合请求说明：存在两种请求方式
1，把所有跳转链接请求个遍，类似于图片的延迟加载。页面滚动到哪里请求到哪里。
2，把当前页面的href的参数&fn=baiduhome_pg修改成&fn=baidulocal，得到一个全新的页面。也没的链接没有跳转，然后替换到当前页面的链接。

如果关闭混合请求，那么执行第一种，第二种不执行。

为什么关闭第二种方式：(不推荐关闭，理论上是好的)
存在缺陷，替换的链接不全。
请求的文件比第一种大，可能造成性能的问题。(chrome下和firefox下测试均没问题，当然，其他脚本\扩展也是用这种方法)。
请求方式的统一性。
 */

(function(document) {
	//=====配置参数======
	var config = {
		macthRules: 'a[href*="www.baidu.com/link?url"]:not([transcoding]):not([transcoded]):not([transcodedall]):not(.m)', //需要跳转的链接
		reloadRules: 'a[transcoded*="false"]', //请求失败，需要再次请求的链接
		isAnimate: GM_getValue("isAnimate",true), //是否需要请求动画，false为关闭动画，默认为true，开启
		transcodingAll:false,//是否正在请求全部，不要修改
		turn:false,//防止过多请求数，不要修改
		mixRequireMod:true//混合请求，默认开启
	};
	//匹配正则
	var regRules = {
		isJumpLink: /www.baidu.com\/link\?url=/ig,
		sliceResponse: {
			step1: /.*window\.location\.replace\(\"(.*)\"\).*$/img,
			step2: /^(.*)(<noscript>.*<\/noscript>$)/img
		}
	};
	//======事件对象=======
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
	//======公共函数=======
	function getText(obj){
		if( obj.innerText ){
			return obj.innerText;
		}else{
			return obj.textContent;
		}
	}
	function ajax(url,json,a){
		a = a ? a : window;
		if( typeof json.beforeFn !=="undefined"){
			if( json.beforeFn.call(a,url)===false ) return;//this>>>a
		}
		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			onreadystatechange: function(response) {
				if (response.readyState == 4) {
					var status = response.status + '';
					if (status.charAt(0) == "4" || status.charAt(0) == "5") { //4XX，5XX错误
						if( typeof json.failFn !=="undefined"){
							json.failFn.call(a,status,url);//this>>>a
						}
					} else {
						if( typeof json.successFn !=="undefined"){
							json.successFn.call(a,response.responseText,url);//this>>>a
						}
					}
				}
			}
		});
	}
	//======主体对象=======
	function init(agm) {
		return new Init(agm);
	}
	function Init(agm) {
		this.addStyle();
		if (!agm) {
			return this;
		}
		this.jumpLinks = document.querySelectorAll(agm);//获取到要跳转的A链接
		this.inViewPort = [];//在可视区域内的跳转链接
		for (var j = 0; j < this.jumpLinks.length; j++) {
			this.a = this.jumpLinks[j];
			if (this.visible() === true) {
				this.inViewPort.push(this.jumpLinks[j]);
			}
		}
		return this;
	}
	Init.prototype.all = function(callBack){
		var searchWord = document.getElementById('kw').value;
		
		var url = window.top.location.href.replace('https', 'http').replace(/(\&)(tn=\w+)(\&)/img, '$1' + 'tn=baidulocal' + '$3').replace(/(\&)(wd=\w+)(\&)/img, '$1' + 'wd='+ searchWord + '$3');
		
		ajax(url,{
			"beforeFn":function(url){
				config.transcodingAll=true;
				config.turn=false;
			},
			"failFn":function(status,url){
				this.setAttribute("transcoded","false");
			},
			"successFn":function(response,url){
				var html = document.createElement('html');
				html.innerHTML = response.replace(/http\:\/\/(.*)\.gif/img, "https://wwwbaidu.com"); //防止讨厌的http百度图片
				
				var requireAtag = html.querySelectorAll('.f>a');//请求得到的所有A标签
				var info = {};//href：innerText
				for (var i = 0; i < requireAtag.length; i++) {
					if (typeof(info[requireAtag[i].href]) == "undefined") {
						info[ requireAtag[i].href ] = getText( requireAtag[i] );
					}
				}
				var currentAtag = document.querySelectorAll('.t>a:not(.OP_LOG_LINK):not([transcoded])');//当前页的A标签
				for (var href in info) {
					for (var j = 0; j < currentAtag.length; j++) {
						if ( info[href].replace(/\s*/img, '') == getText( currentAtag[j] ).replace(/\s*/img,'') ) {
							currentAtag[j].href = href;
							currentAtag[j].setAttribute('transcodedAll','true');
							// currentAtag[j].style.background = 'red';
							
						}
					}
				}
				config.transcodingAll=false;
				config.turn = true;
				if(callBack) callBack();
			}
		});
	};
	if( config.mixRequireMod===false ){
		console.log( config.mixRequireMod );
		Init.prototype.all = function(callBack){
			if(callBack) callBack();
			return;
		};
	}
	Init.prototype.onebyone = function(){
		if (this.inViewPort.length <= 0) {
			return;
		}
		for (var i = 0; i < this.inViewPort.length; i++) {
			this.a = this.inViewPort[i];
			if( this.a.getAttribute("all") ){
				continue;
			}
			ajax(this.a.href.replace("http", "https") + "&wd=&eqid=0",{
				"beforeFn":function(url){
					this.setAttribute("transcoding", "true");
				},
				"failFn":function(status,url){
					this.setAttribute("transcoded", "false");
					console.log( '请求' + url + '结果：' + status );
				},
				"successFn":function(responseStr,url){
					var trueLink = responseStr.replace(regRules.sliceResponse.step1, "$1").replace(regRules.sliceResponse.step2, '$1');
					this.href = trueLink;
					this.removeAttribute("transcoding");
					this.setAttribute("transcoded", "true");
				}
			},this.a);
		}
		return this;
	};
	Init.prototype.addStyle = function() {
		if (config.isAnimate === false || document.getElementById('transcoded')) {
			return;
		}
		this.cssString = 'a[transcoded]{position:relative}a[transcoded*="false"]:before{background:rgba(197,31,32,0.5)}a[transcoded*="true"]:before{background:rgba(43,138,23,0.5)}a[transcoded]:before{content:"";position:absolute;width:0;height:100%;line-height:100%;display:inline-block;animation:slide 1s ease-in-out .2s backwards;-webkit-animation:slide 1s ease-in-out .2s backwards;-moz-animation:slide 1s ease-in-out .2s backwards;-o-animation:slide 1s ease-in-out .2s backwards;-ms-animation:slide 1s ease-in-out .2s backwards}@keyframes slide{0%{width:0}80%{width:100%}100%{width:0}}@-webkit-keyframes slide{0%{width:0}80%{width:100%}100%{width:0}}@-moz-keyframes slide{0%{width:0}80%{width:100%}100%{width:0}}@-o-keyframes slide{0%{width:0}80%{width:100%}100%{width:0}}@-ms-keyframes slide{0%{width:0}80%{width:100%}100%{width:0}}';
		this.css = document.createTextNode(this.cssString);
		this.style = document.createElement('style');
		this.style.id = "transcoded";
		this.style.type = "text/css";
		this.style.appendChild(this.css);
		document.head.appendChild(this.style);
	};
	Init.prototype.visible = function() {
		var obj = this.a,
			pos = obj.getBoundingClientRect(),
			w,
			h;
		if (document.documentElement.getBoundingClientRect) {
			w = document.documentElement.clientWidth || document.body.clientWidth;
			h = document.documentElement.clientHeight || document.body.clientHeight;
			var inViewPort = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
			if (inViewPort === true) {
				return false;
			} else {
				return true;
			}
		}
	};
	//======执行=======
	handler(document).bind({
		"DOMContentLoaded": function() {
			if( config.transcodingAll===false ){
				init().all(function() {
					var inViewPortElement = init('a[transcodedAll]').inViewPort;
					for( var i=0;i<inViewPortElement.length;i++ ){
						inViewPortElement[i].setAttribute("transcoded","true");
					}
					init(config.macthRules).onebyone();
				});
			}
			handler(document).ob({
				"childList":true,
				"subtree":true
			},function(){
				if( config.transcodingAll===false ){
					init().all(function() {
						init(config.macthRules).onebyone();
					});
				}
			});
		},
		"mouseover": function(e) {
			var a = e.target;
			if (a.tagName == "A" && regRules.isJumpLink.test(a.href) && a.getAttribute('transcoded') !== "true") {
				var href = a.href.replace("http", "https") + "&wd=&eqid=0";
				ajax(href,{
					"beforeFn":function(url){
						this.setAttribute("transcoding", "true");
					},
					"successFn":function(responseStr,url){
						var trueLink = responseStr.replace(regRules.sliceResponse.step1, "$1").replace(regRules.sliceResponse.step2, '$1');
						this.href = trueLink;
						this.removeAttribute("transcoding");
						this.setAttribute("transcoded", "true");
					}
				},a);
			}
		}
	});
	handler(window).bind('scroll',function(){
		init(config.macthRules).onebyone();
		init(config.reloadRules).onebyone();
		var inViewPortElement = init('a[transcodedAll]').inViewPort;
		for( var i=0;i<inViewPortElement.length;i++ ){
			inViewPortElement[i].setAttribute("transcoded","true");
		}
	});
	//======注册菜单====
	function turnAnimate(){
		if( window.confirm("打开请求动画\n【确定】>>>打开动画\n【取消】>>>关闭动画\n\n当前状态:"+GM_getValue("isAnimate",true)+"\n\n刷新页面生效")===true ){
			GM_setValue("isAnimate",true);
		}else{
			GM_setValue("isAnimate",false);
		}
	}
	GM_registerMenuCommand("请求动画开关",turnAnimate);
})(document);