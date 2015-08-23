// ==UserScript==
// @name    remove the jump link in BAIDU
// @author  burningall
// @description 去除百度搜索跳转链接
// @version     2015.8.24
// @include     *www.baidu.com*
// @grant		GM_xmlhttpRequest
// @run-at      document-start
// @compatible  chrome  完美运行
// @compatible  firefox  完美运行
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @supportURL      http://www.burningall.com
// @contributionURL troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==

(function(document){
//=====配置参数======
var config = {
	macthRules: 'a[href*="www.baidu.com/link?url"]:not([transcoding]):not([transcoded])',//需要跳转的链接
	reloadRules: 'a[transcoded*="false"]',//请求失败，需要再次请求的链接
	isAnimate: true,//是否需要请求动画
	hasOb: true//判断是否已监听
};
//匹配正则
var regRules = {
	isJumpLink : /www.baidu.com\/link\?url=/ig,
	sliceResponse : {
		step1 : /.*window\.location\.replace\(\"(.*)\"\).*$/img,
		step2 : /^(.*)(<noscript>.*<\/noscript>$)/img
	}
};
//======事件对象=======
function handler(obj){
	return new Event(obj);
}
function Event(obj){
	this.element = obj;
	return this;
}
Event.prototype.addEvent = function(type,fn){
	var obj = this.element;
	var ev;
	return obj.addEventListener ?
			obj.addEventListener(type, function(e){
				ev = window.event ? window.event : (e ? e : null);
				ev.target = ev.target || ev.srcElement;
				if( fn.call(obj,ev)===false ){
					ev.cancelBubble = true;//阻止冒泡
					ev.preventDefault();//chrome，firefox下阻止默认事件
				}
			}, false)
			 :
			obj.attachEvent('on' + type, function(e){
				ev = window.event ? window.event : (e ? e : null);
				ev.target = ev.target || ev.srcElement;
				if(fn.call(obj,ev)===false ){
					ev.cancelBubble = true;//阻止冒泡
					return false;//阻止默认事件，针对IE8
				}
			});
};
Event.prototype.bind = function(type,fn){
	var obj = this.element;
	if(arguments.length==1){
		for(var attr in type){
			this.addEvent(attr,type[attr]);
		}
	}
	else if(arguments.length==2){
		var events = type.split(' ');
		var eventsLength = events.length;
		var j=0;
		while(j<eventsLength){
			this.addEvent(events[j],fn);
			j++;
		}
	}
	return this;
};
Event.prototype.ob = function(config,fn){
	var target = this.element;
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
    observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation) {
                    fn.call(target);
            });
        });
    observer.observe(target, config);
    return this;
};
//======主体对象=======
function init(agm){
	return new Init(agm);
}
function Init(agm){
	if( !agm ){
		return this;
	}
	this.agm = agm;
	this.links = document.querySelectorAll(agm);
	this.inViewPort = [];
	this.a = null;
	for(var j=0;j<this.links.length;j++){
		this.a = this.links[j];
		if( this.visible()===true ){
			this.inViewPort.push( this.links[j] );
		}
	}
	if( this.inViewPort.length<=0 ){
		return;
	}
	this.addStyle();
	for( var i=0;i<this.inViewPort.length;i++ ){
		this.a = this.inViewPort[i];
		this.transcode(this.a,function(url){
			this.href = url;
		});
	}
	return this;
}
Init.prototype.addStyle = function(){
	if( config.isAnimate===false || document.getElementById('transcoded') ){
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
Init.prototype.visible = function(){
	var obj = this.a;
    var pos = obj.getBoundingClientRect();
    if (document.documentElement.getBoundingClientRect) {
        var w = document.documentElement.clientWidth || document.body.clientWidth;
        var h = document.documentElement.clientHeight || document.body.clientHeight;
        var jugg = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
        if (jugg === true) {
            return false;
        } else {
            return true;
        }
    }
};
Init.prototype.transcode = function(a,secFn){
	if( a.getAttribute("transcoded")=="true" ){
		return;
	}
	var href = a.href.replace("http","https") + "&wd=&eqid=0";
	a.setAttribute("transcoding","true");
	GM_xmlhttpRequest({
	  method: "GET",
	  url: href,
	  onreadystatechange:function( response ){
	  	if(response.readyState==4){
	  		var status = response.status+'';
	  		if( status.charAt(0)=="4" || status.charAt(0)=="5" ){//4XX，5XX错误
	  			a.removeAttribute("transcoding");
	  			a.setAttribute("transcoded","false");
	  		}else{
	  			var url = response.responseText.replace(regRules.sliceResponse.step1,"$1").replace(regRules.sliceResponse.step2,'$1');
	  			a.setAttribute('jump-link',href);
	  			a.removeAttribute("transcoding");
	  			a.setAttribute("transcoded","true");
	  			secFn.call(a,url);
	  		}
	  	}
	  }
	});
};
//======执行=======

handler(document).bind({
	"DOMContentLoaded":function(){
		init(config.macthRules);
	},
	"mouseover":function(e){
		var a = e.target;
		if( a.tagName=="A" && regRules.isJumpLink.test(a.href) && a.getAttribute('transcoded')!=="true" ){
			var href = a.href.replace("http","https") + "&wd=&eqid=0";
			init().transcode(a,function(url){
				this.href = url;
			});
		}
	}
}).ob({
	"childList":true,
	"subtree":true
},function(){
	init(config.macthRules);
});

handler(window).bind({
	"scroll":function(){
		init(config.macthRules);
		init(config.reloadRules);
	},
	"load":function(){
		if(config.hasOb){
			return;
		}
		init(config.macthRules);
	}
});


})(document);