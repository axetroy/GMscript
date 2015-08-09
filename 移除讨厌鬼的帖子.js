// ==UserScript==
// @name	remove the posts which make you sick
// @author	burningall
// @description	移除讨厌鬼的帖子
// @version     2015.8.9
// @include		*tieba.baidu.com/p/*
// @include		*tieba.baidu.com/*
// @include		*tieba.baidu.com/f?*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant		GM_listValues
// @grant		GM_deleteValue
// @run-at		document-start
// @compatible  chrome  推荐
// @compatible  firefox  性能稍微不足
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @supportURL		http://www.burningall.com
// @contributionURL	troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==
// 
(function(window,document){
//默认配置（可以修改）
var defaultdConfig = {
	'blockWay': '遮罩屏蔽', //屏蔽方式或删除节点
	'color': '#ffffff', //遮罩颜色
	'opacity': '0.8', //遮罩透明度
	'blurpx': '3', //高斯模糊大小
};
//==============公共函数==============
function $(id) {
	return document.getElementById(id);
}
function addEvent(obj, type, fn){
	return obj.addEventListener ?
			obj.addEventListener(type, function(e){
				var ev = window.event ? window.event : (e ? e : null);
				ev.target = ev.target || ev.srcElement;
				if( fn.call(obj,ev)===false ){//回掉函数为false，则阻止默认时间
					e.cancelBubble = true;//阻止冒泡
					e.preventDefault();//chrome，firefox下阻止默认事件
				}
			}, false)
			 :
			obj.attachEvent('on' + type, function(e){
				//fn.call(obj,e);//解决IE8下，this是window的问题
				var ev = window.event ? window.event : (e ? e : null);
				ev.target = ev.target || ev.srcElement;
				if(fn.call(obj,ev)===false ){
					e.cancelBubble = true;//阻止冒泡
					return false;//阻止默认事件，针对IE8
				}
			});
}

function animate(obj,json,cfgjson){
		var objAttr = 0,//当前值
			bStop = true,//判断是否停止
			jsonattr = 0,//目标值
			speedConfig = 0,//速度参数
			iSpeed = 0;//当前速度
		clearInterval(obj.animate);
		obj.animate = setInterval(function() {
			var bStop = true;//判断运动是否停止
			for(var attr in json){//attr代表属性,'width','height'.而json[attr]代表数值
				// 1. 取得当前的值（可以是width，height，opacity等的值）
				objAttr = 0 ;
				if(attr == 'opacity'){//获取当前数值
					objAttr = Math.round(parseFloat( getStyle(obj,attr) ) * 100);
				}else{
					objAttr = parseInt( getStyle(obj,attr) );
				}
				// 2.计算运动速度
				jsonattr = parseFloat( json[attr] );
				speedConfig = (cfgjson && typeof ( cfgjson.speed ) != 'undefined') ? cfgjson.speed : 10;
				iSpeed = (jsonattr - objAttr) / speedConfig;	//(目标数值-当前数值)/10
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);	//如果速度>0，则速度向上取整，如果小于0，则保留小数
				// 3. 检测所有运动是否到达目标
				//objAttr,当前点，json[attr]为目标点
				if ( (iSpeed>0 && objAttr <= jsonattr) || (iSpeed<0 && objAttr >= jsonattr) ) {//如果有其中一项没有达到目标
					bStop = false;
				}
				if (attr == "opacity") {
					obj.style.filter = 'alpha(opacity:' + (objAttr + iSpeed) + ')';
					obj.style.opacity = (objAttr + iSpeed) / 100;
				} else {
					obj.style[attr] = objAttr + iSpeed + 'px';	//赋值开始运动
				}
				if (bStop) { // 表示所有运动都到达目标值
					clearInterval(obj.animate);
					if( cfgjson && typeof cfgjson.endFn != 'undefined' ){
						cfgjson.endFn.call(obj);
					}
				}
			}//for
		},20);
}

function getSize(attr) {
	return document.documentElement[attr] ? document.documentElement[attr] : document.body[attr];
}

function getStyle(obj, attr) {
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}

function hasClass(obj, cName) {
	// ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
	return !!obj.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
}

function position(){
	var url = location.href,
		postIn = /.*tieba.baidu.com\/p\/.*/ig,
		postList = /.*tieba.baidu.com\/(f\?.*|[^p])/ig;
	if (postIn.test(url)) { //如果是帖子内
		return "post";//1
	} else if (postList.test(url)) { //如果在帖子列表
		return "list";//0
	}
}

function barName() {
	var name = document.querySelector('.card_title_fname'),
		text = name.innerText || name.textContent,
		newText = text.replace(/\s*/ig,'');
	return newText;
}

function toggle(obj){
	return new Toggle(obj);
}
function Toggle(obj){
	this.obj = obj;
	return this;
}
Toggle.prototype.slide = function(){
	var _arguments = arguments,
		length = _arguments.length,
		count = 0;
	addEvent(this.obj,'click',function(){
		_arguments[count++%length].call(this);//执行	，解决this错误的问题
	});
	return this;//返回对象，进行链式操作
};

function createList() {
	$('showList').innerHTML = ''; //先清空，后生成
	var li = '',
		json = null,
		length = GM_listValues().length;
	for (var i = 0; i < length; i++) {
		var key = GM_listValues()[i];
		var value = GM_getValue(GM_listValues()[i], '');
		if (value.length < 10 || value === true || value === false) continue;
		json = JSON.parse(value);
		li +='<tr data-value=' + value + '>'+
					'<td style="min-width:100px">' + json.name + '</td>'+
					'<td style="min-width:100px">' + json.id + '</td>'+
					'<td style="min-width:75px">' + json.bar + '</td>'+
					'<td style="min-width:75px">' + json.reson + '</td>'+
					'<td style="min-width:50px"><input type="button" class="deletThis" value="删除"/></td>'+
			'</tr>';
	} //for
	$('showList').innerHTML += li;
}
function searchInList() {
	createList();
	var str = '',
		userInfo = "",
		userInfoStr = "",
		list = document.querySelectorAll('#showList tr'),
		listLength = list.length,
		inputValue = $('sear').value;
	$('showList').innerHTML = ''; //清空列表
	for (var i = 0; i < listLength; i++) {
		userInfo = JSON.parse(list[i].getAttribute('data-value'));
		if (userInfo.name.indexOf(inputValue) >= 0 || userInfo.id.indexOf(inputValue) >= 0 || userInfo.bar.indexOf(inputValue) >= 0 || userInfo.reson.indexOf(inputValue) >= 0) { //匹配name，id，bar,reson
			userInfoStr = JSON.stringify(userInfo);
			str += '<tr data-value=' + userInfoStr + '>'+
						'<td style="width:100px">' + userInfo.name + '</td>'+
						'<td style="width:100px">' + userInfo.id + '</td>'+
						'<td style="width:75px">' + userInfo.bar + '</td>'+
						'<td style="width:75px">' + userInfo.reson + '</td>'+
						'<td style="width:50px"><input type="button" class="deletThis" value="删除"/></td>'+
					'</tr>';
		}
	} //for
	$('showList').innerHTML = str; //生成列表
}
//将脚本还原到最初状态
function clearall(){
	var length = GM_listValues().length;
	for(var i=0;i<length;i++){
		console.log(GM_deleteValue(GM_listValues()[i]) + ":" + GM_getValue(GM_listValues()[i], ''));
	}
	GM_setValue('setting-blockWay', defaultdConfig.blockWay); //屏蔽方式
	GM_setValue('setting-col', defaultdConfig.color); //默认遮罩的颜色
	GM_setValue('setting-opa', defaultdConfig.opacity); //默认遮罩透明度
	GM_setValue('setting-gus', defaultdConfig.blurpx); //默认遮罩下的高斯模糊半径
}

function blockMod() {
	if (GM_getValue('setting-blockWay', defaultdConfig.blockWay) == '遮罩屏蔽') {
		return "wrap"; //遮罩模式,1
	} else {
		return "remove"; //删除节点,2
	}
}

function init(){
	return new Init();
}
function Init(){
	var user,userName,userId,pos,temp,lzl;
	this.user = [];//用于储存所有用户信息，包括name，id
	// this.userLzl = [];//用于储存所有用户信息，包括name，id
	this.list = position()=="post" ? document.querySelectorAll('#j_p_postlist>div[data-field]') : document.querySelectorAll('#thread_list>li[data-field]');//所有用户所占的DIV，LI
	// this.listLzl = document.querySelectorAll('.j_lzl_m_w>li[data-field]:not(.lzl_li_pager)');
	// pos = position()=="post" ? document.querySelectorAll('.l_post .d_name') : document.querySelectorAll('#thread_list>li[data-field] .threadlist_lz>.threadlist_author');//点击屏蔽，屏蔽按钮需要插入的位置
	var listLength = this.list.length;
	for(var i=0;i<listLength;i++){
		userName = position()=="post" ? JSON.parse(this.list[i].getAttribute('data-field')).author.user_name : JSON.parse(this.list[i].getAttribute('data-field')).author_name;
		userId = position()=="post" ? JSON.parse(this.list[i].getAttribute('data-field')).author.user_id : JSON.parse(this.list[i].getAttribute('data-field')).id;
		temp = {};
		temp.name = userName;
		temp.id = userId;
		this.user.push(temp);
	}
	//楼中楼
	// var listLzlLength = this.listLzl.length;
	// console.log( listLzlLength );
	// for(var j=0;j<listLzlLength;j++){
	// 	var lzlName = JSON.parse( this.listLzl[j].getAttribute("data-field").replace(/\'/ig,'\"') ).user_name;
	// 	var lzlId = "";
	// 	temp = {};
	// 	temp.name = lzlName;
	// 	temp.id = lzlId;
	// 	// console.log( lzlName );
	// 	// console.log( j );
	// 	this.userLzl.push(temp);
	// }
	// console.log( this.userLzl );
	return this;
}

// Init.prototype.eachBlock = function(Obj,user,i){
// 	var length = Obj.length,oMarClone,data,
// 		config = {
// 			"blockWay": GM_getValue('setting-blockWay', defaultdConfig.blockWay),//屏蔽方式
// 			"color": GM_getValue('setting-col', defaultdConfig.color),//遮罩颜色
// 			"opacity": GM_getValue('setting-opa', defaultdConfig.opacity),//遮罩透明度
// 			"blur": GM_getValue('setting-gus', defaultdConfig.blurpx)//高斯模糊
// 		};
// 	for(var j=0;j<length;j++){
// 		obj = Obj[j];//要屏蔽的模块
// 		if( GM_listValues()[i]==user[j].name ){
// 			if(blockMod()=="remove"){
// 				obj.style.display = "none";
// 			}else if(blockMod()=="wrap"){
// 				if( obj.querySelectorAll('.mar').length >= 1 ){
// 					continue;
// 				}
// 				oMarClone = this.oMar.cloneNode(true);//克隆遮罩层
// 				//要屏蔽的模块
// 				obj.style.cssText = "position:relative;filter:blur(" + config.blur +"px);-webkit-filter:blur(" + config.blur + "px);-moz-filter:blur(" + config.blur + "px);-o-filter:blur(" + config.blur + "px);backface-visibility:hidden;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;";
// 				if (GM_listValues()[i] == name) {
// 					data = GM_getValue(GM_listValues()[i], '');
// 				}
// 				oMarClone.setAttribute('data', data);
// 				obj.appendChild(oMarClone);
// 			}
// 		}
// 	}
// };

//页面加载开始屏蔽
Init.prototype.block = function(){
	this.oMar = document.createElement('div');//创建遮罩层
	var obj,objLzl,data,oMarClone,
		listLength = GM_listValues().length,
		userLength = this.user.length,
		// userLzlLength = this.userLzl.length,
		config = {
			"blockWay": GM_getValue('setting-blockWay', defaultdConfig.blockWay),//屏蔽方式
			"color": GM_getValue('setting-col', defaultdConfig.color),//遮罩颜色
			"opacity": GM_getValue('setting-opa', defaultdConfig.opacity),//遮罩透明度
			"blur": GM_getValue('setting-gus', defaultdConfig.blurpx)//高斯模糊
		};
	this.oMar.className = 'mar';
	this.oMar.style.cssText = "background:" + config.color + ";opacity:" + config.opacity + ";";
	for (var i = 0; i < listLength; i++) {//GM_listValues().length
		for(var j=0;j<userLength;j++){
			obj = this.list[j];//要屏蔽的模块
			if( GM_listValues()[i]==this.user[j].name ){
				if(blockMod()=="remove"){
					obj.style.display = "none";
				}else if(blockMod()=="wrap"){
					if( obj.querySelectorAll('.mar').length >= 1 ){
						continue;
					}
					oMarClone = this.oMar.cloneNode(true);//克隆遮罩层
					//要屏蔽的模块
					obj.style.cssText = "position:relative;filter:blur(" + config.blur +"px);-webkit-filter:blur(" + config.blur + "px);-moz-filter:blur(" + config.blur + "px);-o-filter:blur(" + config.blur + "px);backface-visibility:hidden;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;";
					if (GM_listValues()[i] == this.user[j].name) {
						data = GM_getValue(GM_listValues()[i], '');
					}
					oMarClone.setAttribute('data', data);
					obj.appendChild(oMarClone);
				}
			}
		}
		//屏蔽楼中楼
		// for(var k=0;k<userLzlLength;k++){
		// 	objLzl = this.listLzl[k];//要屏蔽的模块
		// 	if( GM_listValues()[i]==this.userLzl[k].name ){//如果匹配到
		// 		if(blockMod()=="remove"){
		// 			objLzl.style.display = "none";
		// 		}else if(blockMod()=="wrap"){
		// 			if( objLzl.querySelectorAll('.mar').length >= 1 ){
		// 				continue;
		// 			}
		// 			oMarClone = oMar.cloneNode(true);//克隆遮罩层
		// 			//要屏蔽的模块
		// 			objLzl.style.cssText = "position:relative;filter:blur(" + config.blur +"px);-webkit-filter:blur(" + config.blur + "px);-moz-filter:blur(" + config.blur + "px);-o-filter:blur(" + config.blur + "px);backface-visibility:hidden;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;";
		// 			if (GM_listValues()[i] == this.userLzl[k].name) {
		// 				data = GM_getValue(GM_listValues()[i], '');
		// 			}
		// 			oMarClone.setAttribute('data', data);
		// 			objLzl.appendChild(oMarClone);
		// 		}
		// 	}
		// }
	} //for,遍历屏蔽
};
//智能提示
Init.prototype.autoTips = function(){
	var list = [],//储存所有用户名
		temp = {},
		str = "";
	for(var i=0;i<this.user.length;i++){
		if(typeof temp[this.user[i].name]=="undefined"){
			temp[this.user[i].name] = 1;
			list.push(this.user[i].name);
		}
	}
	for(var j=0;j<list.length;j++){
		str += '<option value="' + list[j] + '" />';
	}
	$("lst").innerHTML = str;
};
//监听
function ob(target,config,fn){
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
		observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				fn.call(target);
			});
		});
	observer.observe(target, config);
}
//拖拽
function drag(pressTarget,MoveTarget,json){
	return new Drag(pressTarget,MoveTarget,json);
}
function Drag(pressTarget,MoveTarget,json){
	var _this = this;
	this.disX = 0;
	this.disY = 0;
	if(json){
		this.json = json;
	}
	this.MoveTarget = MoveTarget;
	pressTarget.onmousedown = function(e){
		_this.fnDown(e);
		return false;//chrome,firefox去除文字选中
	};
}
Drag.prototype.fnDown = function(e){//鼠标按下（未松开）
	var ev = e || window.event;
	var _this = this;
	this.disX = e.clientX - this.MoveTarget.offsetLeft;
	this.disY = e.clientY - this.MoveTarget.offsetTop;
	if(this.MoveTarget.setCaptrue){//IE，解决文字选中
		this.MoveTarget.onmousemove = function(ev){
			_this.fnMove(ev);
		};
		this.MoveTarget.onmouseup = function(){
			var this_ = this;
			_this.fnUp(this_);
		};
		this.MoveTarget.setCaptrue();//添加事件捕获
	}else{
		document.onmousemove = function(e){
			_this.fnMove(e);
		};
		document.onmouseup = function(){
			var this_ = this;
			_this.fnUp(this_);
		};
	}
};
Drag.prototype.fnMove = function(e){//鼠标移动，则div移动
	var ev = e || window.event;
	var L = this.json ? this.range(e.clientX - this.disX,this.json.L[0],this.json.L[1]) : (e.clientX - this.disX);
	var T = this.json ? this.range(e.clientY - this.disY,this.json.T[0],this.json.T[1]) : (e.clientY - this.disY);
	this.MoveTarget.style.left = L + 'px';
	this.MoveTarget.style.top = T + 'px';
};
Drag.prototype.fnUp = function(this_){//鼠标松开，则停止
		this_.onmousemove = null;
		this_.onmouseup = null;
		if( this_.setCaptrue ){
			this_.releaseCapture();//释放捕获
		}
};
Drag.prototype.range = function(iNow,iMin,iMax){
	if(iNow>iMax){
		return iMax;
	}else if(iNow<iMin){
		return iMin;
	}else{
		return iNow;
	}
};
//脚本初始化
addEvent(window,'DOMContentLoaded',function(){
	init().block();
	//监听翻页
	if( $('j_p_postlist') ){
		ob($('j_p_postlist'),{"childList":true},function(){//帖子内
			init().block();
		});
	}else{
		ob($('thread_list'),{"childList":true},function(){//帖子列表
			init().block();
		});
	}
});
addEvent(window,'load',function(){
	init().block();
});
addEvent(document,'click',function(e){
	var target = e.target || e.srcElement,
		id=target.id || null;
	//如果点击到ID
	if (target.getAttribute('data-field') && hasClass(target.parentNode, 'd_name') || target.getAttribute('data-field') && hasClass(target.parentNode, 'tb_icon_author')) { //如果点到了名字上面
		(function(target){
		var data3,name,id,parent;
		if( $("confirmBox") ){
			$("confirmBox").remove(this);
		}
		if(hasClass(target.parentNode,"d_name")){
			parent = target.parentNode.parentNode.parentNode.parentNode;
			data3 = JSON.parse(parent.getAttribute("data-field")).author;
			name = data3.user_name;
			id = data3.user_id;
		}else{
			parent = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
			data3 = JSON.parse(parent.getAttribute("data-field"));
			name = data3.author_name;
			id = data3.id;
		}
		var confirmBox = document.createElement("div");
		confirmBox.id = "confirmBox";
		confirmBox.innerHTML = "<p>是否屏蔽</p><p>" + name + "</p><input type='button' value='确认' id='confirm-yes' /><input type='button' value='取消' id='confirm-no' />";
		document.documentElement.appendChild(confirmBox);
		animate(confirmBox,{"top":"100","opacity":"100"},{"endFn":function(){
			clearTimeout(confirmBox.fadeOut);
			confirmBox.fadeOut=setTimeout(function(){
				animate(confirmBox,{"top":"60","opacity":"0"},{"endFn":function(){
					confirmBox.remove(this);
				}});
			},3000);
		}});
		$("confirm-yes").onclick = function(){
			GM_setValue(name,'{"name":"' + name + '","id":"' + id + '","bar":"' + barName() + '","reson":"不顺眼"}');
			init().block();
			confirmBox.remove(this);
		};
		$("confirm-no").onclick = function(){
			confirmBox.remove(this);
		};
		})(target);
		//阻止默认事件和冒泡
		return false;
	}
	//屏蔽列表删除键
	else if( hasClass(target,"deletThis") ){
		var thisKey = JSON.parse(target.parentNode.parentNode.getAttribute('data-value')).name; //获取当前结点的key
		GM_deleteValue(thisKey); //删除变量
		target.parentNode.parentNode.remove(this); //删除节点
	}
	//如果点击到遮罩层
	else if (hasClass(target, 'mar')){
		//清空HTML
		var allMar = document.querySelectorAll('.mar');
		for (var i = 0; i < allMar.length; i++) {
			allMar[i].innerHTML = '';
		}
		//获取data数据
		var data = JSON.parse(target.getAttribute('data'));
		//第一次点击
		if (!target.ready) {
			target.ready = true;
			target.style.borderLeft = '5px solid rgb(174, 103, 34)';
		}
		//再次点击
		else if(target.ready === true){
			target.parentNode.style.cssText = "position:relative;-webkit-filter:none;-moz-filter:none;o-filter:none;ms-filter:none;filter:none;";
			target.style.cssText = "background:none;opacity:1;filter:alpha(opacity=100);";
			target.innerHTML = '\
								<input type="button" id="keeplock" value="继续屏蔽" />\
								<input type="button" id="unlockNow" value="暂时解除 "/>\
								<input type="button" id="unlock" value="永久解除" />\
								' + '<p>' + data.name + '(' + data.id + ')，其在' + data.bar + '因[' + data.reson + ']被屏蔽' + '</p>';
			target.ready = null;
		}
	}
	else{
		switch(id){
			//解除屏蔽
			case "unlock" : 
				var data2 = JSON.parse(target.parentNode.getAttribute("data"));
				GM_deleteValue(data2.name); //删除键名
				target.parentNode.remove(this);
				break;
			//暂时解除
			case "unlockNow" : 
				target.parentNode.remove(this);
				break;
			//继续屏蔽
			case "keeplock" : 
				var config = {
					"blockWay": GM_getValue('setting-blockWay', defaultdConfig.blockWay),//屏蔽方式
					"color": GM_getValue('setting-col', defaultdConfig.color),//遮罩颜色
					"opacity": GM_getValue('setting-opa', defaultdConfig.opacity),//遮罩透明度
					"blur": GM_getValue('setting-gus', defaultdConfig.blurpx)//高斯模糊
				};
				target.parentNode.parentNode.style.cssText = "position:relative;filter:blur(" + config.blur +"px);-webkit-filter:blur(" + config.blur + "px);-moz-filter:blur(" + config.blur + "px);-o-filter:blur(" + config.blur + "px);backface-visibility:hidden;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;";
				target.parentNode.style.cssText = "opacity:" + config.opacity + ";background:" + config.color + ";border:none;";
				target.parentNode.innerHTML = '';
				break;
			//退出
			case "queit" : 
				$('pannal').remove(this);
				$('wrap').remove(this);
				document.body.className = '';
				break;
			case "wrap" : 
				$('pannal').remove(this);
				$('wrap').remove(this);
				document.body.className = '';
				break;
			//保存
			case "save" : 
				//判断屏蔽方式
				GM_setValue('setting-blockWay', $('blockWay').value);
				//遮罩颜色
				GM_setValue('setting-col', $('col').value);
				//遮罩透明度1
				GM_setValue('setting-opa', $('opa').value);
				//高斯模糊半径
				GM_setValue('setting-gus', $('gus').value);
				//添加黑名单
				if($('userName').value===""){
					return;
				}
				GM_setValue($('userName').value, '{"name":"' + $('userName').value + '","id":"' + $("userId").value + '","bar":"' + $("curBar").value + '","reson":"' + $("reson").value + '"}');
				init().block();
				createList();//重新生成列表
				break;
			//初始化
			case "clear" : 
				clearall();
				break;
			default:
				return ;
		}
	}
	
});

addEvent(document,'input',function(e){
	var target = e.target || e.srcElement,
		id = target.id;
	switch(id){
		case "sear" : 
			searchInList();
			break;
		case "opa" : 
			$('opa-text').innerHTML = $('opa').value;
			break;
		case "gus" : 
			$('gus-text').innerHTML = $('gus').value;
			break;
		case "userName" : 
			if( $("lst").innerHTML === "" || $("lst").innerHTML === null ){
				init().autoTips();
			}
			break;
		default : 
			return;
	}
});
//控制面板相关
addEvent(window,'keyup',function(e){
	var target = e.target || e.srcElement;
	if(e.keyCode==8){//backspace
		if (target.id=="sear"&&$('sear').value === '') {
			createList();
			return;
		}
	}
	else if(e.ctrlKey && e.keyCode == 114){//快捷键ctrl+F3
		var oFragment = document.createDocumentFragment(),//创建文档碎片
			pannal = document.createElement('div'),//控制面板
			pannal_wrap = document.createElement('div');//遮罩层
		pannal_wrap.id = 'wrap';
		pannal.id = 'pannal';
		var config = {
			"blockWay": GM_getValue('setting-blockWay', defaultdConfig.blockWay),//屏蔽方式
			"color": GM_getValue('setting-col', defaultdConfig.color),//遮罩颜色
			"opacity": GM_getValue('setting-opa', defaultdConfig.opacity),//遮罩透明度
			"blur": GM_getValue('setting-gus', defaultdConfig.blurpx)//高斯模糊
		};
		pannal.innerHTML = '\
					<h3 id="pannal-tittle" style="cursor:move;font-size:20px;line-height:20px;color:#fff;background:#165557;">配置参数</h3>\
					<div id="pannal-setting">\
						屏蔽方式：<select id="blockWay">\
									<option>遮罩屏蔽</option>\
									<option>删除节点</option>\
								</select><br/>\
						遮罩层颜色：<input id="col" type="color" value="'+config.color+'" /><br/>\
						遮罩透明度(0~1)：<span id="opa-text">'+config.opacity+'</span><input id="opa" type="range" value="'+config.opacity+'" min="0" max="1" step="0.1" /><br/>\
						高斯模糊像素(0~10)：<span id="gus-text">'+config.blur+'</span><input id="gus" type="range" value="'+config.blur+'" min="0" max="10" step="1" /><br/>\
					</div>\
					<hr/>\
					<h3>添加讨厌鬼</h3>\
					<div id="addBlackList">\
						数字ID(选填)：<input id="userId" type="text" placeholder="user_id"/><br/>\
						贴吧ID(必填)：<input id="userName" type="text" placeholder="user_name" list="lst" autocomplete="off"/><br/>\
						<datalist id="lst" autocomplete="on"></datalist>\
						所在贴吧：<input id="curBar" type="text" value="'+barName()+'" /><br/>\
						屏蔽原因：<input id="reson" type="text" list="lstr" value="" />\
					</div>\
					<hr/>\
					<h3>功能</h3>\
					<div id="fn">\
						<input id="save" type="button" value="保存" />\
						<input id="clear" type="button" value="初始化" />\
						<input id="view" type="button" value="列表" />\
					</div>\
					<div id="list" style="margin:0;">\
						<input id="sear" type="text" list="BlackList" placeholder="搜索" autocomplete="off" />\
						<table id="showList"></table>\
					</div>\
					<span id="queit">X</span>\
		';
		oFragment.appendChild(pannal);
		oFragment.appendChild(pannal_wrap);
		document.body.className = 'blur';
		document.documentElement.appendChild(oFragment);
		//居中
		pannal.style.cssText = "top:" + (getSize('clientHeight') - pannal.offsetHeight) / 2 + "px"+ ";left:" + (getSize('clientWidth') - pannal.offsetWidth) / 2 + "px";
		//初始化数据
		$('blockWay').value = GM_getValue('setting-blockWay', defaultdConfig.blockWay); //屏蔽方式
		//生成屏蔽名单列表
		createList();
		//可拖拽
		drag($('pannal-tittle'),pannal);
		//展开收起
		toggle($('view')).slide(function(){
			animate($("list"),{"height":parseInt( getStyle($('pannal'), 'height') )});
		},function(){
			animate($("list"),{"height":"0"});
		});
	}
});


//==========样式区============
var style = '\
	body{\
		-webkit-backface-visibility: hidden;\
	}\
	/*给body添加滤镜*/\
	.blur{\
		-webkit-filter: blur(5px) grayscale();\
		-moz-filter: blur(5px) grayscale();\
		-o-filter: blur(5px) grayscale();\
		-ms-filter: blur(5px) grayscale();\
		filter: blur(5px) grayscale();\
	}\
	#pannal{\
		width:200px;\
		height:auto;\
		background:rgba(38, 50, 56, 1);\
		color:#fff;\
		position:fixed;\
		z-index:1000000000;\
		text-align:center;\
		box-shadow:0 0 20px 5px #000000;\
	}\
	#pannal>div{\
		margin:10px 0;\
	}\
	#pannal input{\
		color:#3e3e3e;\
		border:1px solid transparent;\
		height:20px;\
		line-height:20px;\
	}\
	#pannal input:focus{\
		background-color:rgba(38, 50, 56, 1);\
		color:#fff;\
		border:1px solid;\
		transition:all 0.2s ease-in-out;\
	}\
	#pannal h3{\
		color:rgb(0, 255, 226);\
	}\
	#pannal-setting input[type=range]{\
		width:80%;\
	}\
	#fn input{\
		padding:10px;\
		margin:0 5px;\
		cursor:pointer;\
	}\
	#fn input:hover{\
		background:#004d40;\
		color:#fff;\
	}\
	#pannal>span{\
		position:absolute;\
		width:21px;\
		height:21px;\
		line-height:21px;\
		font-size:21px;\
		top:0;\
		right:0;\
		cursor:pointer;\
		opacity:0.8;\
		background:#fff;\
		color:#303030;\
	}\
	#blockWay{\
		color:#3e3e3e;\
		border:none;\
	}\
	#wrap{\
		position:fixed;\
		width:100%;\
		height:100%;\
		background:rgba(155, 155, 155,0.5);\
		top:0;\
		left:0;\
		z-index:999999999;\
	}\
	.mar{\
		width:100%;\
		height:100%;\
		position:absolute;\
		top:0;\
		left:0;\
		z-index:999999998;\
		-webkit-backface-visibility：hidden;\
		text-align:center;\
		font-size:16px;\
	}\
	.mar input{\
		background:#303030;\
		color:#fff;\
		padding:5px 10px;\
		margin:5px 10px;\
		font-family:"宋体";\
		font-size:14px;\
		border:none;\
	}\
	.mar input:hover{\
		background:#004d40;\
		transition:all 0.2s ease-in-out;\
	}\
	.mar p{\
		color:##2B2929;\
		font-weight:bold;\
		background-color:rgba(72, 70, 70, 0.35);\
		line-height:30px;\
		width:60%;\
		margin:0 auto;\
	}\
	.mar p:hover{\
		color:#fff;\
		background-color:#004d40;\
		transition:all 0.2s ease-in-out;\
	}\
	#list{\
		position:absolute;\
		top:0;\
		left:200px;\
		width:400px;\
		height:0;\
		overflow-x:hidden;\
		overflow-y:auto;\
		background:inherit;\
		margin:0;\
	}\
	#list tr:hover{\
		background:#004d40;\
		transition:all 0.2s ease-in-out;\
	}\
	.key{\
		float:left;\
		clear:both;\
		margin-left:10px;\
		width:120px;\
		text-align:left;\
		overflow:hidden;\
		text-overflow:ellipsis;\
		white-space:nowrap;\
	}\
	.col{\
		border:none;\
	}\
	.deletThis{\
		float:right;\
		cursor:pointer;\
		margin-right:10px;\
		padding:0 5px;\
		border:0;\
		height:18px;\
	}\
	.disable-btn{\
		background:#6B6B6B;\
		cursor:not-allowed;\
	}\
	#addBlackList input{\
		width:80%;\
	}\
	/*userName列表*/\
	#thread_list>li[data-field] .threadlist_lz>.threadlist_author:hover,.l_post .d_name:hover{\
		background:#004d40;\
		transition:all 0.2s ease-in-out;\
	}\
	#sear{\
		position:relative;\
		margin:0 auto;\
		text-align:center;\
		height:21px;\
		width:100%;\
		border:none;\
	}\
	#confirmBox{\
		width:300px;\
		background:rgba(5, 49, 43, 0.8);\
		position:fixed;\
		left:50%;\
		top:60px;\
		margin-left:-150px;\
		text-align:center;\
		z-index:999999;\
		opacity:0;\
		box-shadow:1px 1px 10px 2px #000000;\
	}\
	#confirmBox input{\
		border:none;\
		padding:10px 30px;\
		margin:10px;\
		cursor:pointer;\
	}\
	#confirmBox input:hover{\
		background:#004d40;\
		transition:all 0.2s ease-in-out;\
	}\
	#confirmBox p{\
		font-size:18px;\
		color:#fff;\
		margin-top:20px;\
	}\
';
GM_addStyle(style);
})(window,document);