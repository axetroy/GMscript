// ==UserScript==
// @name    去除百度搜索跳转链接
// @author  burningall
// @description 去除百度搜索跳转链接
// @version     2015.8.22
// @include     *www.baidu.com*
// @grant		GM_addStyle
// @grant		GM_xmlhttpRequest
// @run-at      document-start
// @compatible  chrome  推荐
// @compatible  firefox  不推荐
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @supportURL      http://www.burningall.com
// @contributionURL troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==

(function(document){
//=====配置规则======
var macthList = [
	{
		hostname:'www.baidu.com',
		rule:'a[href*="www.baidu.com/link?url"]:not([transcoding]):not([transcoded])'
	},
	{
		hostname:'www.google.com',
		rule:''
	}
];
function getRules(){
	for(var i=0;i<macthList.length;i++){
		// console.log( macthList[i] );
		if(location.hostname==macthList[i].hostname){
			return macthList[i].rule;
		}
	}
}
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
	if( document.getElementById('transcoded') ){
		return;
	}
	var cssString = 'a[transcoding]:before{content:"";width:1em;height:1em;line-height:1em;border-radius:50%;display:inline-block}a[transcoding]:before{background:yellow}a[transcoded]:before{content:"";width:1em;height:1em;line-height:1em;border-radius:50%;display:inline-block}a[transcoded]:before{background:green}';
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
	  			console.log( response.status );
	  			a.removeAttribute("transcoding");
	  			a.setAttribute("transcoded","false");
	  		}else{
	  			var reg1 = /.*window\.location\.replace\(\"(.*)\"\).*$/img;
	  			var reg2 = /^(.*)(<noscript>.*<\/noscript>$)/img;
	  			var url = response.responseText.replace(reg1,"$1").replace(reg2,'$1');
	  			a.removeAttribute("transcoding");
	  			a.setAttribute("transcoded","true");
	  			secFn(a,url);
	  		}
	  	}
	  }
	});
}
function init(){
	var links = document.querySelectorAll(getRules()),
		inViewPort = [],
		a = null,
		href = "";
	for(var j=0;j<links.length;j++){
		a = links[j];
		if( visible( links[j] ) ){
			inViewPort.push( links[j] );
		}
	}
	if( inViewPort.length<=0 ){
		return;
	}
	addStyle();
	for( var i=0;i<inViewPort.length;i++ ){
		a = inViewPort[i];
		href = a.href.replace("http","https") + "&wd=&eqid=0";
		transcode(href,a,function(a,url){
			a.href = url;
		});
	}
}
//======执行=======
//判断是否已监听
var hasOb = false;
//判断url是否符合百度跳转
var urlReg = /www.baidu.com\/link\?url=/ig;
bind(document,{
	"DOMContentLoaded":function(){
		init();
		ob(document,{
			"childList":true,
			"subtree":true
		},function(){
			init();
			hasOb = true;
		});
	},
	"mouseover":function(e){
		if( e.target.tagName=="A" && urlReg.test(e.target.href) ){
			var a = e.target;
			var href = a.href.replace("http","https") + "&wd=&eqid=0";
			transcode(href,a,function(a,url){
				a.href = url;
			});
		}
	}
});
bind(window,{
	"scroll":init,
	"load":function(){
		if(hasOb){
			return;
		}
		console.log('onload');
		init();
		ob(document,{
			"childList":true,
			"subtree":true
		},function(){
			init();
		});		
	}
});

})(document);