// ==UserScript==
// @name    remove the jump link in BAIDU
// @author  burningall
// @description 去除百度搜索跳转链接
// @version     2015.8.23
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
	isAnimate: true,//是否需要动画
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
//======监听=======
function addEvent(obj, type, fn){
	return obj.addEventListener ?
			obj.addEventListener(type, function(e){
				var ev = window.event ? window.event : (e ? e : null);
				if( fn.call(obj,ev)===false ){
					e.cancelBubble = true;//阻止冒泡
					e.preventDefault();//chrome，firefox下阻止默认事件
				}
			}, false)
			 :
			obj.attachEvent('on' + type, function(e){
				var ev = window.event ? window.event : (e ? e : null);
				ev.target = ev.target || ev.srcElement;
				if(fn.call(obj,ev)===false ){
					e.cancelBubble = true;//阻止冒泡
					return false;//阻止默认事件，针对IE8
				}
			});
}
function bind(obj,type,fn){
	//如果传入一个json参数
	if(arguments.length==2){
		for(var attr in type){
			addEvent(obj,attr,type[attr]);
		}
	}
	//传入两个字符串参数
	else if(arguments.length==3){
		var events = type.split(' ');
		var eventsLength = events.length;
		var j=0;
		while(j<eventsLength){
			addEvent(obj,events[j],fn);
			j++;
		}
	}
}
function ob(target,config,fn){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
    observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation) {
                    fn.call(target);
            });
        });
    observer.observe(target, config);
}
//======公共函数=======
function addStyle(){
	if( config.isAnimate===false || document.getElementById('transcoded') ){
		return;
	}
	var cssString = 'a[transcoded]{position:relative}a[transcoded*="false"]:before{background:rgba(197,31,32,0.5)}a[transcoded*="true"]:before{background:rgba(43,138,23,0.5)}a[transcoded]:before{content:"";position:absolute;width:0;height:100%;line-height:100%;display:inline-block;animation:slide 1s ease-in-out .2s backwards}@keyframes slide{0%{width:0}80%{width:100%}100%{width:0}}@-webkit-keyframes slide{0%{width:0}80%{width:100%}100%{width:0}}@-moz-keyframes slide{0%{width:0}80%{width:100%}100%{width:0}}';
	var style = document.createElement('style');
	var css = document.createTextNode(cssString);
	style.type = "text/css";
	style.id = "transcoded";
	style.appendChild(css);
	document.head.appendChild(style);
}
function visible(obj) {
    var pos = obj.getBoundingClientRect();
    if (document.documentElement.getBoundingClientRect) {
        var w = document.documentElement.clientWidth || document.body.clientWidth;
        var h = document.documentElement.clientHeight || document.body.clientHeight;
        var jugg = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
        if (jugg === true) {
            //不可视
            return false;
        } else {
            //可视
            return true;
        }
    }
}
function transcode(urlLink,a,secFn){
	if( a.getAttribute("transcoded")=="true" ){
		return;
	}
	a.setAttribute("transcoding","true");
	GM_xmlhttpRequest({
	  method: "GET",
	  url: urlLink,
	  onreadystatechange:function( response ){
	  	if(response.readyState==4){
	  		var status = response.status+'';
	  		if( status.charAt(0)=="4" || status.charAt(0)=="5" ){//4XX，5XX错误
	  			// console.log( response.status );
	  			a.removeAttribute("transcoding");
	  			a.setAttribute("transcoded","false");
	  		}else{
	  			var url = response.responseText.replace(regRules.sliceResponse.step1,"$1").replace(regRules.sliceResponse.step2,'$1');
	  			a.setAttribute('jump-link',urlLink);
	  			a.removeAttribute("transcoding");
	  			a.setAttribute("transcoded","true");
	  			secFn(a,url);
	  		}
	  	}
	  }
	});
}
function init(rules){
	var links = document.querySelectorAll(rules),
		inViewPort = [],
		a = null,
		href = "";
	for(var j=0;j<links.length;j++){
		a = links[j];//所有的跳转链接
		if( visible( links[j] ) ){
			inViewPort.push( links[j] );
		}
	}
	if( inViewPort.length<=0 ){
		return;
	}
	addStyle();
	for( var i=0;i<inViewPort.length;i++ ){
		a = inViewPort[i];//可视区域内的跳转链接
		if( regRules.isJumpLink.test( a.href )===true ){
			continue;
		}
		href = a.href.replace("http","https") + "&wd=&eqid=0";
		transcode(href,a,function(a,url){
			a.href = url;
		});
	}
}
//======执行=======
bind(document,{
	"DOMContentLoaded":function(){
		init(config.macthRules);
		ob(document,{
			"childList":true,
			"subtree":true
		},function(){
			init(config.macthRules);
			config.hasOb = true;
		});
	},
	"mouseover":function(e){
		var a = e.target;
		if( a.tagName=="A" && regRules.isJumpLink.test(a.href) && a.getAttribute('transcoded')!=="true" ){
			var href = a.href.replace("http","https") + "&wd=&eqid=0";
			transcode(href,a,function(a,url){
				a.href = url;
			});
		}
	}
});
bind(window,{
	"scroll":function(){
		init(config.macthRules);
		init(config.reloadRules);
	},
	"load":function(){
		if(config.hasOb){
			return;
		}
		init(config.macthRules);
		ob(document,{
			"childList":true,
			"subtree":true
		},function(){
			init(config.macthRules);
		});		
	}
});

})(document);