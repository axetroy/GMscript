// ==UserScript==
// @name    check the links is visitable or not
// @author  burningall
// @description 检查超链接是否有效
// @version     2015.8.22
// @include     *
// @grant       GM_registerMenuCommand
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
var config = {
	"autoLoad": true,//true>>>>自动ajax判断(存在性能问题)，false>>>>>鼠标移入才ajax判断
	"rules": /[a-zA-z]+:\/\/[^\s]*/img,
	"debug": true,//true>>>>>调试模式，请求成功会显示绿色
	"log": false//true>>>>>控制台打印请求的a链接
	};
function Ob(target,config,fn){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation) {
                    fn.call(target);
            });
        });
    observer.observe(target, config);
}

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

function visible(obj) {
    var pos = obj.getBoundingClientRect();
    if (document.documentElement.getBoundingClientRect) {
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
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

function check(urlLink,a,secFn,failFn){
	a.setAttribute("checking",true);
	GM_xmlhttpRequest({
	  method: "GET",
	  url: urlLink,
	  onerror: function(response ){
	  	failFn(a);
	  },
	  onreadystatechange:function(response){
	  	if(response.readyState==4){
	  		var status = response.status+'';
	  		if( status.charAt(0)=="4" || status.charAt(0)=="5" ){//4XX，5XX错误
	  			failFn(a);
	  		}else{
	  			secFn(a);
	  		}
	  	}
	  }
	});
}

function slice(array){
	// if( array.length<10 ){
	// 	return array;
	// }
	var arr = [];
	var temps = [];
	//分成10组
	var step = Math.ceil((array.length - 1) / 10);
	for (var j = 0; j < array.length; j++) {
		//每隔10个
		if (j > 0 && j % step === 0) {
			arr.push(temps);
			temps = [];
		}
		//收尾零头
		if (array.length - j < step) {
			temps.push(array[j]);
			if (array.length - 1 == j) {
				arr.push(temps);
				temps = [];
			}
		} else {
			temps.push(array[j]);
		}
	}
	return arr;
}

function linkIsAvailable(a){
	var match = /登陆|退出|login|logout/img,
		href = a.href,
		html = a.innerHTML,
		text = a.innerText || a.textContent;
	if( match.test(href) || match.test(html) || match.test(text) || a.getElementsByTagName('img').length>0 ){
		return false;
	}
	return true;
}

function init(){
	/**
	 * 不考虑：
	 * <a href="javascript:;"></a>	||	<a href="javascript:void(0);"></a>
	 * <a href="#"></a>
	 */
	// document.querySelectorAll('a[href]');
	var link = document.querySelectorAll('a[href]:not([href*="logout"]):not([href*="login"]):not([href^="javascript"]):not([href$="#"]):not([checking]):not([visited])');
	var inViewPort = [];
	var a;
	for(var i=0;i<link.length;i++){
		a = link[i];
		if( linkIsAvailable(a)===false ) continue;
		if( visible(a) && a.href!=="" ){
			inViewPort.push(a);
		}
	}
	// console.log( inViewPort.length );\
	//切割数组
	var newInViewPort = slice(inViewPort);
	if( inViewPort.length<1 || newInViewPort.length<1 || inViewPort.length>200 ){
		return;
	}
	//计时器
	var num = 0;
	// start(num);
	(function start(index){
		for( var j=0;j<newInViewPort[index].length;j++ ){
			a = newInViewPort[index][j];
			//判断这组是否加载完毕
			var jugg = [];
			//已访问过,并且成功，则跳过
			if( a.getAttribute('visited') && a.getAttribute('visited')=="true" ){
				continue;
			}
			check(a.href,a,function(a){
				//请求成功
				if( config.debug===true ){//开发者模式
					a.style.cssText = "background:rgba(22, 189, 96, 0.75) !important; text-decoration:none !important;";
				}
				a.setAttribute('visited',"true");
				a.removeAttribute('checking');
				jugg.push(true);
				//所有组请求响应完毕
				if (num >= newInViewPort.length) {//newInViewPort.length==10最大
						return;
				}
				//当前组请求响应完毕，则进行下一组
				if( jugg.length >= newInViewPort[index].length - 1 ){
					start(num++);
				}
			},function(a){
				//请求失败
				a.style.cssText = "background:red; text-decoration:line-through;";
				a.setAttribute('visited',"false");
				a.removeAttribute('checking');
				jugg.push(true);
				//所有组请求响应完毕，则停止
				if (num >= newInViewPort.length ) {//newInViewPort.length==10最大
						return;
				}
				//当前组请求响应完毕，则进行下一组
				if( jugg.length >= newInViewPort[index].length - 1 ){
					start(num++);
				}
			});
			if( config.log===true ){
				console.log( a );
				// console.log(index + ":" + j);
			}
		}
	})(num);
}

addEvent(document,'mouseover',function(e){
	var target = e.target || e.srcElement;
	var a = target;
	if( a.tagName == "A" && config.rules.test(a.href) ){
		if( linkIsAvailable(a)===false ){
			return;
		}
		check(a.href,a,function(a){
			//加载成功
			if( config.debug===true ){//开发者模式
				target.style.cssText = "background:rgba(22, 189, 96, 0.75) !important; text-decoration:none !important;";
			}
			if( a.getAttribute('visited') && a.getAttribute('visited')=="false" ){
				a.style.cssText = "background:none; text-decoration:none;";
			}
			a.setAttribute('visited',"true");
			a.removeAttribute('checking');
		},function(){
			//加载失败
			a.style.cssText = "background:red; text-decoration:line-through;";
			a.setAttribute('visited',"false");
			a.removeAttribute('checking');
		});
	}
});

addEvent(window,'scroll',function(){
	init();
});

addEvent(window,'resize',function(){
	init();
});

addEvent(window,'DOMContentLoaded',function(){
	if( config.autoLoad === true ){
		init();
		new Ob(document.documentElement,{
			"childList":true,
			"subtree":true
		},function(){
			init();
		});
	}
});

//注册菜单
GM_registerMenuCommand("检查全部链接", init);
})(document);