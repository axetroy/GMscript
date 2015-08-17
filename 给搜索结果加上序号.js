// ==UserScript==
// @name Sort Search Engine Result
// @author	burningall
// @description	给百度\谷歌\必应搜索结果加上序号
// @version     2015.6.2.7
// @include		*www.baidu.com*
// @include		*news.baidu.com*
// @include		*zhidao.baidu.com*
// @include		*wenku.baidu.com*
// @include		*v.baidu.com*
// @include		*tieba.baidu.com/f/search/*
// @include		*image.baidu.com*
// @include		*www.google.com*
// @include		*cn.bing.com*
// @include		*www.sogou.com*
// @include		*www.haosou.com*
// @include		*www.youdao.com*
// @include		*www.dongting.com*
// @supportURL		http://www.burningall.com
// @contributionURL	troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==

(function(){
		var macthList=[
			{
				hostname:'www.baidu.com',
				rule:'#content_left>div[srcid] *[class~=t],[class~=op_best_answer_question]'
			},
			{
				hostname:'news.baidu.com',
				rule:'ul>li[class~=result]>h3'
			},
			{
				hostname:'zhidao.baidu.com',
				rule:'#wgt-list>dl'
			},
			{
				hostname:'wenku.baidu.com',
				rule:'.search-result>.topicBox>.topicName,.search-result>dl>dt'
			},
			{
				hostname:'v.baidu.com',
				rule:'li[class~=result] span[class~=title]'
			},
			{
				hostname:'tieba.baidu.com',
				rule:'.s_post_list>.s_post>span[class~=p_title]'
			},
			{
				hostname:'image.baidu.com',
				rule:'.imglist>li'
			},
			{
				hostname:'www.google.com',
				rule:'.srg>li[class~=g] *[class~=r],._yE>div[class~=_kk]'
			},
			{
				hostname:'cn.bing.com',
				rule:'#b_results>li[class~=b_ans],#b_results>li[class~=b_algo],#b_results>li[class~=b_algo]'
			},
			{
				hostname:'www.sogou.com',
				rule:'.results>div'
			},
			{
				hostname:'www.haosou.com',
				rule:'.res-list h3'
			},
			{
				hostname:'www.youdao.com',
				rule:'#results>*[class~=res-list] h3'
			},
			{
				hostname:'www.dongting.com',
				rule:'.plaza>ul>li'
			}
		];
	function getRule(){
		for(var i=0;i<macthList.length;i++){
			if(location.host==macthList[i].hostname){
				return document.querySelectorAll(macthList[i].rule);
			};
		};
	};
	function addEvent(obj, event, fn) {
		return obj.addEventListener ? obj.addEventListener(event, fn, false) : obj.attachEventListener('on' + event, fn);
	};
	var cssText="display:inline-block;background:#434849;color:#D7D7D7;font-family:'微软雅黑';font-size:16px;text-align:center;width:20px;line-height:20px;border-radius:50%;float:left;"
	var div = document.createElement('div');
	function show(){
		var list=getRule();
		for(var i=0;i<list.length;i++){
			if(list[i].getAttribute('sortIndex')){
				continue;
			}else{
				list[i].setAttribute('sortIndex',i);
				list[i].inner=list[i].innerHTML;
				div.innerHTML='<div style=' + cssText + '>' + (i+1) + '</div>';
				list[i].innerHTML=div.innerHTML+list[i].inner;
			};
		};
		var check=document.querySelector('#content_left input[type=checkbox]');
		check && check.removeAttribute('checked');
	};
	function delayed(){
		clearTimeout(document.sortTimer)
		document.sortTimer=setTimeout(show,500)
	}
	addEvent(document,'DOMContentLoaded',function(){
		show();
		addEvent(document,'scroll',delayed);
		addEvent(document,'keyup',delayed);
		addEvent(document,'click',delayed);
	});
})()