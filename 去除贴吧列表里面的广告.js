// ==UserScript==
// @name	去除贴吧列表里面的广告
// @author	burningall
// @description	去除贴吧掺夹在【帖子列表】【回复列表】里的广告
// @version     2015.8.1.1
// @include			http://tieba.baidu.com/*
// @supportURL		http://www.burningall.com
// @contributionURL	troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==
(function(document){
    var adlist=document.querySelectorAll('[data-daid],#thread_list>li:not([class~=j_thread_list]),#j_p_postlist>div:not([data-field])');
    var adlistLength = adlist.length;
    for(var i=0;i<adlistLength;i++){
    	if(adlist[i].className=="thread_top_list_folder") continue;
        adlist[i].style.cssText = "display: none !important;";
        adlist[i].parentNode.removeChild(adlist[i]);
    }
    var keyword = document.querySelectorAll('#j_p_postlist a[data-swapword],#j_p_postlist a.ps_cb');
    var keywordLength = keyword.length;
    for(var j=0;j<keywordLength;j++){
    	keyword[j].onclick = function(){
    		return false;
    	};
    	keyword[j].removeAttribute('data-swapword');
    	keyword[j].removeAttribute('class');
    	keyword[j].removeAttribute('href');
    	keyword[j].style.color = '#333';
    }
})(document);