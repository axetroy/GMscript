// ==UserScript==
// @name    remove the posts which make you sick
// @author  burningall
// @description 移除讨厌鬼的帖子
// @version     2015.8.20
// @include     *tieba.baidu.com/p/*
// @include     *tieba.baidu.com/*
// @include     *tieba.baidu.com/f?*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @compatible  chrome  推荐
// @compatible  firefox  性能稍微不足
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @supportURL      http://www.burningall.com
// @contributionURL troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==

(function(window,document){
//==============默认配置==============
var defaultdConfig = {
    'blockWay': '遮罩屏蔽', //遮罩屏蔽或删除节点
    'color': '#ffffff', //遮罩颜色
    'opacity': '0.8', //遮罩透明度
    'blurpx': '3', //高斯模糊大小
};
//==============TQuery=================
function $(tArg){
    return new TQuery(tArg);
}
function TQuery(tArg){
    this.arg = tArg;//保存传进来的参数
    this.elements = [];//用来保存选择的元素
    this.doc = document;
    switch( typeof tArg ){
        case "undefined" :
            return this;
        case "function" :
            addEvent(this.doc,'DOMContentLoaded',function(){
                tArg.call(this);
            });
            break;
        case "string" :
                switch( tArg.charAt(0) ){
                    case '<' :  //<div></div>，创建元素
                        var oDiv = this.doc.createElement('div');//创建一个容器
                        var oFragment = this.doc.createDocumentFragment();//创建文档碎片
                        oDiv.innerHTML = tArg;
                        var child = oDiv.childNodes;
                        //储存在文档碎片中
                        for( var t=0;t<child.length;t++ ){
                            var clone = child[t].cloneNode(true);
                            oFragment.appendChild(clone);
                        }
                        //输出到对象中
                        var temp = [];
                        for(var i=0;i<oFragment.childNodes.length;i++){
                            temp.push(oFragment.childNodes[i]);
                        }
                        this.elements = temp;
                        break;
                    default:    //默认情况下是选择符
                        var aElems = this.doc.querySelectorAll(tArg);
                        for(var o=0;o<aElems.length;o++){
                            this.elements.push(aElems[o]);
                        }
                }
            break;
        case "object" : //对象
            this.elements.push(tArg);
            break;
    }
    this.length = this.elements.length;
}
TQuery.prototype.find = function(str){
    var childElements = [];//存放临时数据
    for(var i=0;i<this.length;i++){
        var aElems = this.elements[i].querySelectorAll(str);
        var length = aElems.length;
        var j =0;
        while(j<length){
            childElements.push( aElems[j] );
            j++;
        }
    }
    this.elements = childElements;
    this.length = childElements.length;//返回新的长度
    return this;
};
TQuery.prototype.click = function(fn){
    var length = this.elements.length;
    for(var i=0;i<length;i++){
        addEvent(this.elements[i],'click',fn);
    }
    return this;//返回对象，进行链式操作
};
TQuery.prototype.bind = function(type,fn){
    if(arguments.length==1){//如果只传一个json参数e
        for(var k=0;k<this.length;k++){
            for(var attr in type){
                addEvent(this.elements[k],attr,type[attr]);
            }
        }
    }else{//如果传两个参数，则统一执行一个e
        var events = type.split(' ');
        var eventsLength = events.length;
        for(var i=0;i<this.length;i++){
            var j=0;
            while(j<eventsLength){
                addEvent(this.elements[i],events[j],fn);
                j++;
            }
        }
    }
    return this;//返回对象，进行链式操作
};
TQuery.prototype.on = function(type,fn){
    if(arguments.length==1){//如果只传一个json参数
        for(var k=0;k<this.length;k++){
            for(var attr in type){
                this.elements[k][ 'on'+attr ] = type[attr];
            }
        }
    }else{//如果传两个参数e,fn
        var events = type.split(' ');//获取每个事件
        var eventsLength = events.length;
        for(var i=0;i<this.length;i++){
            var j =0;
            while(j<eventsLength){
                this.elements[i][ 'on'+events[j] ] = fn;
                j++;
            }
        }
    }
    return this;//返回对象，进行链式操作
};
TQuery.prototype.toggle = function(){
    var _arguments = arguments;
    var length = _arguments.length;
    var count = 0;
    for(var i=0;i<this.length;i++){
        var _this = this.elements[i];
        this.on('click',function(){
            _arguments[count++%length].call(_this);//执行 ，解决this错误的问题
        });
    }
    return this;//返回对象，进行链式操作
};
TQuery.prototype.css = function(attr,value){
    var type = /^(width|left|top|bottom|right|line-height|font-size)+/ig;
    var type2 = /^(height|margin|padding)+/ig;
    var type3 = /\d+(px)/ig;
    var type4 = /\:/ig;
    if(arguments.length==2){//设置单个样式
        if( type.test(attr) && value.indexOf('%')<0 ){
            value = parseFloat(value).toFixed(2) + 'px';
        }
        for(var m=0;m<this.length;m++){
            this.elements[m].style[attr] = value;
        }
    }else{//一个参数
        if(typeof attr=="string"){//获取样式
            if( type4.test(attr) ){//如果一长串字符串设置,background:#303030;font-size:20px;
                for(var x=0;x<this.length;x++){
                    this.elements[x].style.cssText = attr;
                }
            }else{
                return this.elements[0].currentStyle ? this.elements[0].currentStyle[attr] : getComputedStyle(this.elements[0])[attr];
            }
        }else if( typeof(attr) == "object" && Object.prototype.toString.call(attr).toLowerCase() == "[object object]" && !attr.length ){//json
            //json设置样式
            var css = "";
            for(var i =0;i<this.length;i++){
                //纯CSS写法
                for(var k in attr){
                    //k == 属性名字,width,height,opacity等
                    //attr[k] == 属性值,300px,#303030等
                    if((type.test(k) || type2.test(k)) && attr[k].indexOf('%')<0 ){//如果是带像素的属性，并且没有%符号
                        attr[k] = parseFloat( attr[k] ).toFixed(2) + 'px';
                    }
                    css += k+":"+attr[k].toString()+";";
                }
                this.elements[i].style.cssText = css;
            }
        }
    }
    return this;//返回对象，进行链式操作
};
TQuery.prototype.style = function(attr){
    //IE下，如果宽高设置为百分比，则返回也是百分比。
    return this.elements[0].currentStyle ? this.elements[0].currentStyle[attr] : getComputedStyle(this.elements[0])[attr];
};
TQuery.prototype.size = function(attr){
    return this.doc.documentElement[attr] ? this.doc.documentElement[attr] : this.doc.body[attr];
};
TQuery.prototype.animate = function(json,configjson){
    //如果两个参数.animate('width','300');
    for(var i=0;i<this.length;i++){
        var _this = this.elements[i];
        clearInterval(_this.animate);
        _this.animate = setInterval(function() {
            //注意，此处this指的是window（匿名函数）
            var bStop = true;//判断运动是否停止
            for(var attr in json){//attr代表属性,'width','height'.而json[attr]代表数值
                // 1. 取得当前的值（可以是width，height，opacity等的值）
                var objAttr = 0 ;
                if(attr == 'opacity'){//获取当前数值
                    objAttr = Math.round(parseFloat( $(_this).style(attr) ) * 100);
                }else{
                    objAttr = parseInt( $(_this).style(attr) );
                }
                // 2.计算运动速度
                var jsonattr = parseFloat( json[attr] );
                var speedConfig = (configjson && typeof ( configjson.speed ) != 'undefined') ? configjson.speed : 10;
                var iSpeed = (jsonattr - objAttr) / speedConfig;    //(目标数值-当前数值)/10
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);   //如果速度>0，则速度向上取整，如果小于0，则保留小数
                // 3. 检测所有运动是否到达目标
                //objAttr,当前点，json[attr]为目标点
                if ( (iSpeed>0 && objAttr <= jsonattr) || (iSpeed<0 && objAttr >= jsonattr) ) {//如果有其中一项没有达到目标
                    bStop = false;
                }
                if (attr == "opacity") {
                    _this.style.filter = 'alpha(opacity:' + (objAttr + iSpeed) + ')';
                    _this.style.opacity = (objAttr + iSpeed) / 100;
                } else {
                    _this.style[attr] = objAttr + iSpeed + 'px';    //赋值开始运动
                }
                if( configjson && typeof configjson.load !='undefined' ){
                    configjson.load.call(_this);
                }
                if (bStop) { // 表示所有运动都到达目标值
                    clearInterval(_this.animate);
                    if( configjson && typeof configjson.end != 'undefined' ){
                        configjson.end.call(_this);
                    }
                }
            }//for
        },30);
    }//for
    return this;//返回对象，进行链式操作
};
TQuery.prototype.attr = function(attr,value){
    //attr不能是数字
    if(arguments.length==2){//2个参数，设置属性
        for(var k=0;k<this.length;k++){
            if(this.elements[k][attr]){
                this.elements[k][attr] = value;
            }else{
                this.elements[k].setAttribute(attr,value);
            }
        }
    }else if(arguments.length==1){//1个参数
        if( typeof(attr) == "object" && Object.prototype.toString.call(attr).toLowerCase() == "[object object]" && !attr.length ){//如果是json，则分别设置属性
            for(var i=0;i<this.length;i++){
                for(var j in attr){
                    if( this.elements[i][j] ){//如果属性是可以直接读取
                        this.elements[i][j] = attr[j];
                    }else{//如果是自定义属性
                        this.elements[i].setAttribute(j,attr[j]);
                    }
                }
            }
        }else{//读取属性
            return this.elements[0][attr] || this.elements[0].getAttribute(attr);
        }
    }
    return this;//返回对象，进行链式操作
};
TQuery.prototype.value = function(setting){
    if(setting){//设置
        for(var i=0;i<this.length;i++){
            this.elements[i].value = setting;
        }
        return this;
    }
    //读取
    return this.elements[0].value;
};
TQuery.prototype.html = function(setting){
    if(setting){//设置
        for(var i=0;i<this.length;i++){
            this.elements[i].innerHTML = setting;
        }
        return this;
    }
    return this.elements[0].innerHTML;
};
TQuery.prototype.text = function(setting){
    if(setting){//设置
        for(var i=0;i<this.length;i++){
            this.elements[i].innerText = this.elements[i].textContent = setting;
        }
        return this;
    }
    //读取
    return this.elements[0].innerText || this.elements[0].textContent;
};
TQuery.prototype.insertBefore =function(obj){
    var oFragment = this.doc.createDocumentFragment();//创建文档碎片
    for(var i=0;i<this.length;i++){
        oFragment.appendChild(this.elements[i]);
    }
    obj.parentNode.insertBefore(oFragment,obj);
    return this;//返回对象，进行链式操作
};
TQuery.prototype.remove = function(){
    for(var i=0;i<this.length;i++){
        this.elements[i].remove();
    }
    return this;//返回对象，进行链式操作
};
TQuery.prototype.eq = function(n){
    var m = n || 0;
    this.length = 1;
    return $(this.elements[m]);//作为对象存进this.elements，以便链式结构
};
TQuery.prototype.get = function(n){
    n = n || 0;
    if(n=='all' && this.length>1){//如果没有参数，并且多个，则返回数组
        return this.elements;
    }
    return this.elements[n];
};
TQuery.prototype.extend = function(name,fn){
    TQuery.prototype[name] = fn;
    return this;//返回对象，进行链式操作
};
TQuery.prototype.constructor = TQuery;


//==============公共函数=================
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

function hasClass(obj, cName) {
    // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
    return !!obj.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
}

//==============主要函数=================
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
    var $name = $(".card_title_fname").text(),
        newText = $name.replace(/\s*/ig,'');
    return newText;
}

function blockMod() {
    if (GM_getValue('setting-blockWay', defaultdConfig.blockWay) == '遮罩屏蔽') {
        return "wrap"; //遮罩模式,1
    } else {
        return "remove"; //删除节点,2
    }
}

function createList() {
    $('#showList').html(" "); //先清空，后生成
    var li = '',
        json = null,
        length = GM_listValues().length,
        key,
        value;
    for (var i = 0; i < length; i++) {
        key = GM_listValues()[i];
        value = GM_getValue(GM_listValues()[i], '');
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
    $('#showList').html(li);
}

function searchInList() {
    var userInfo = "",
        userInfoStr = "",
        list = document.querySelectorAll('#showList tr'),
        listLength = list.length,
        inputValue = $('#sear').value();
    createList();
    for (var i = 0; i < listLength; i++) {
        userInfo = JSON.parse($(list[i]).attr('data-value'));
        var $List = $('#showList tr');
        if (userInfo.name.indexOf(inputValue) >= 0 || userInfo.id.indexOf(inputValue) >= 0 || userInfo.bar.indexOf(inputValue) >= 0 || userInfo.reson.indexOf(inputValue) >= 0) { //匹配name，id，bar,reson
            $List.eq(i).css('display','block');
        }else{
             $List.eq(i).css('display','none');
        }
    } //for
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
//注册菜单
GM_registerMenuCommand("控制面板", showPannle);
//显示控制面板
function showPannle(){
    if( $("#pannal").length>=1 ){//已存在
        return;
    }
    var oFragment = document.createDocumentFragment(),//创建文档碎片
        pannal = document.createElement('div'),//控制面板
        pannal_wrap = pannal.cloneNode(false),//遮罩层
        config = {
            "blockWay": GM_getValue('setting-blockWay', defaultdConfig.blockWay),//屏蔽方式
            "color": GM_getValue('setting-col', defaultdConfig.color),//遮罩颜色
            "opacity": GM_getValue('setting-opa', defaultdConfig.opacity),//遮罩透明度
            "blur": GM_getValue('setting-gus', defaultdConfig.blurpx)//高斯模糊
        };
    $(pannal_wrap).attr("id","wrap");
    $(pannal).attr("id","pannal");
    pannal.innerHTML = 
        '<h3 id="pannal-tittle" style="cursor:move;font-size:20px;line-height:20px;color:#fff;background:#165557;">配置参数</h3>'+
        '<div id="pannal-setting">'+
        '    屏蔽方式：<select id="blockWay">'+
        '                <option>遮罩屏蔽</option>'+
        '                <option>删除节点</option>'+
        '            </select><br/>'+
        '    遮罩层颜色：<input id="col" type="color" value="'+config.color+'" /><br/>'+
        '    遮罩透明度(0~1)：<span id="opa-text">'+config.opacity+'</span><input id="opa" type="range" value="'+config.opacity+'" min="0" max="1" step="0.1" /><br/>'+
        '    高斯模糊像素(0~10)：<span id="gus-text">'+config.blur+'</span><input id="gus" type="range" value="'+config.blur+'" min="0" max="10" step="1" /><br/>'+
        '</div>'+
        '<hr/>'+
        '<h3>添加讨厌鬼</h3>'+
        '<div id="addBlackList">'+
        '    数字ID(选填)：<input id="userId" type="text" placeholder="user_id"/><br/>'+
        '    贴吧ID(必填)：<input id="userName" type="text" placeholder="user_name" list="lst" autocomplete="off"/><br/>'+
        '    <datalist id="lst" autocomplete="on"></datalist>'+
        '    所在贴吧：<input id="curBar" type="text" value="'+barName()+'" /><br/>'+
        '    屏蔽原因：<input id="reson" type="text" list="lstr" value="" />'+
        '</div>'+
        '<hr/>'+
        '<h3>功能</h3>'+
        '<div id="fn">'+
        '    <input id="save" type="button" value="保存" />'+
        '    <input id="clear" type="button" value="初始化" />'+
        '    <input id="view" type="button" value="列表" />'+
        '</div>'+
        '<div id="list" style="margin:0;">'+
        '    <input id="sear" type="text" list="BlackList" placeholder="搜索" autocomplete="off" />'+
        '    <table id="showList"></table>'+
        '</div>'+
        '<div id="block-keyWord">'+
        '    <input type="text" placeholder="输入关键字" id="blockWord" /><input type="button" value="添加" id="addWord" /></br>'+
        '    <div id="tag-area"></div>'+
        '    <input type="button" value="查看日志" id="showLog" />'+
        '    <div id="tag-log"></div>'+
        '</div>'+
        '<span id="queit">X</span>';
    oFragment.appendChild(pannal);
    oFragment.appendChild(pannal_wrap);
    document.body.className = 'blur';
    document.documentElement.appendChild(oFragment);
    //居中
    $(pannal).css({
        "top": ($().size('clientHeight') - pannal.offsetHeight) / 2 + "px",
        "left":($().size('clientWidth') - pannal.offsetWidth) / 2 + "px"
    });
    //初始化数据
    $('#blockWay').attr('value',GM_getValue('setting-blockWay', defaultdConfig.blockWay) );//屏蔽方式
    //生成屏蔽名单列表
    createList();   
    //生成关键字标签
    key().createTag();
    //可拖拽
    $().drag( $('#pannal-tittle').get(0),pannal );
    //展开收起
    var height = parseInt( pannal.offsetHeight );
    $('#view').toggle(function(){
        $('#list').animate({"height":height},{"end":function(){
            $(this).css({
                "height":height,
                "overflow-y":"auto"
            });
        }});
        $('#block-keyWord').animate({"height":height},{"end":function(){
            $(this).css({
                "height":height,
                "overflow-y":"auto"
            });
        }});
    },function(){
        $('#list').animate({"height":"0"});
        $('#block-keyWord').animate({"height":"0"});
    });
}
//==============主要对象=================
function init(){
    return new Init();
}
function Init(){
    var user,userName,userId,pos,temp,lzl,selector;
    this.user = [];//用于储存所有用户信息，包括name，id
    // this.userLzl = [];//用于储存所有用户信息，包括name，id
    selector = position()=="post" ? '#j_p_postlist>div[data-field]' : '#thread_list>li[data-field]';
    this.list = document.querySelectorAll(selector);//所有用户所占的DIV，LI
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
    //  var lzlName = JSON.parse( this.listLzl[j].getAttribute("data-field").replace(/\'/ig,'\"') ).user_name;
    //  var lzlId = "";
    //  temp = {};
    //  temp.name = lzlName;
    //  temp.id = lzlId;
    //  // console.log( lzlName );
    //  // console.log( j );
    //  this.userLzl.push(temp);
    // }
    return this;
}

//页面加载开始屏蔽
Init.prototype.block = function(){
    this.oMar = document.createElement("div");//创建遮罩层
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
    $(this.oMar).attr("class","mar").css({
        "background":config.color,
        "opacity":config.opacity
    });
    for (var i = 0; i < listLength; i++) {//GM_listValues().length
        for(var j=0;j<userLength;j++){
            obj = this.list[j];//要屏蔽的模块
            if( GM_listValues()[i]==this.user[j].name ){
                if(blockMod()=="remove"){
                    $(obj).css("display","none");
                }else if(blockMod()=="wrap"){
                    if( $(obj).find(".mar").length >= 1 ){
                        continue;
                    }
                    oMarClone = this.oMar.cloneNode(true);//克隆遮罩层
                    //要屏蔽的模块
                    $(obj).css({
                        "position":"relative",
                        "filter":"blur(" + config.blur +"px)",
                        "-webkit-filter":"blur(" + config.blur +"px)",
                        "-moz-filter":"blur(" + config.blur +"px)",
                        "-o-filter":"blur(" + config.blur +"px)",
                        "-ms-filter":"blur(" + config.blur +"px)",
                        "backface-visibility":"hidden",
                        "-webkit-backface-visibility":"hidden",
                        "-moz-backface-visibility":"hidden",
                        "-o-backface-visibility":"hidden",
                        "-ms-backface-visibility":"hidden",
                    });
                    if (GM_listValues()[i] == this.user[j].name) {
                        data = GM_getValue(GM_listValues()[i], '');
                    }
                    $(oMarClone).attr("data",data);
                    obj.appendChild(oMarClone);
                }
            }
        }
        //屏蔽楼中楼
        // for(var k=0;k<userLzlLength;k++){
        //  objLzl = this.listLzl[k];//要屏蔽的模块
        //  if( GM_listValues()[i]==this.userLzl[k].name ){//如果匹配到
        //      if(blockMod()=="remove"){
        //          objLzl.style.display = "none";
        //      }else if(blockMod()=="wrap"){
        //          if( objLzl.querySelectorAll('.mar').length >= 1 ){
        //              continue;
        //          }
        //          oMarClone = oMar.cloneNode(true);//克隆遮罩层
        //          //要屏蔽的模块
        //          objLzl.style.cssText = "position:relative;filter:blur(" + config.blur +"px);-webkit-filter:blur(" + config.blur + "px);-moz-filter:blur(" + config.blur + "px);-o-filter:blur(" + config.blur + "px);backface-visibility:hidden;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;";
        //          if (GM_listValues()[i] == this.userLzl[k].name) {
        //              data = GM_getValue(GM_listValues()[i], '');
        //          }
        //          oMarClone.setAttribute('data', data);
        //          objLzl.appendChild(oMarClone);
        //      }
        //  }
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
    $("#lst").html(str);
};
//关键字过滤
var log = [];//保存日志
function key(){
    return new keyWord();
}
function keyWord(){
    //已保存的关键字
    this.wordArr = GM_getValue("keyWord",[]);
    if( this.wordArr.length<=0 || $('a.j_th_tit').length<=0 ){
        return this;
    }
    var str = this.wordArr.join("|");
    //正则匹配
    this.reg = new RegExp(""+ str +"","i");
    //所有帖子标题
    this.list = $('a.j_th_tit').get("all");
}
keyWord.prototype.filter = function(){
    log = [];
    var list = this.list || [],
        postTitle,
        target,
        _this = this;
    var reg = new RegExp(""+ this.wordArr.join("|") +"","i");
    for(var i=0;i<list.length;i++){
        //帖子标题
        postTitle = $(list[i]).text();
        //帖子块
        target = list[i].parentNode.parentNode.parentNode.parentNode.parentNode;
        if( reg.test(postTitle)===true ){
            log.push( postTitle );
            target.style.display = "none";
        }else{
            target.style.display = "block";
        }
    }
};
keyWord.prototype.createTag = function(){
    //生成标签
    var oFragment = document.createDocumentFragment(),
        tag = document.createElement('span'),
        cloneTag;
    tag.className = "blockTag";
    for(var k=0;k<this.wordArr.length;k++){
        cloneTag = tag.cloneNode();
        $(cloneTag).html( this.wordArr[k] );
        oFragment.appendChild(cloneTag);
    }

    $('#tag-area').html(" ").get(0).appendChild(oFragment);
};
//监听
$().extend("ob",function(){
    var target = this.elements[0];
    return new Ob(target);
});
function Ob(target){
    this.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    this.target = target;
    return this;
}
Ob.prototype.observer = function(config,fn){
    var MutationObserver = this.MutationObserver,
        observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation) {
                    fn.call(this.target);
            });
        });
    observer.observe(this.target, config);
};

//拖拽
$().extend("drag",function(pressTarget,MoveTarget,json){
    return new Drag(pressTarget,MoveTarget,json);
});
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
//==============主要事件=================
$(window).bind({
    "DOMContentLoaded":function(){
        //脚本初始化
        init().block();
        //关键字过滤
        key().filter();
        //插入控制面板按钮
        $('.u_setting').bind('mouseover',function(){
            if( $('.u_pannal').length>0 ){
                return;
            }
             $('<li class="u_pannal"></li>').html('<a href="#" id="showPannle" style="line-height:30px;">控制面板</a>').insertBefore(  $('.u_setting .u_logout').get(0) );
        });
    },
    "load":function(){
        init().block();
        //监听翻页
        if(position()=="post" ){
            $("#j_p_postlist").ob().observer({"childList":true},function(){
                init().block();
            });
        }else{
            $('#thread_list').ob().observer({"childList":true},function(){//帖子列表
                init().block();
            });
        }
    }
});

$(document).bind('click',function(e){
    var target = e.target || e.srcElement,
        id=target.id || null;
    //如果点击到ID
    if ($(target).attr('data-field') && hasClass(target.parentNode, 'd_name') || $(target).attr('data-field') && hasClass(target.parentNode, 'tb_icon_author')) { //如果点到了名字上面
        (function(target){
        var data3,name,id,parent;
        if( $("#confirmBox") ){
            $("#confirmBox").remove();
        }
        if(hasClass(target.parentNode,"d_name")){
            parent = target.parentNode.parentNode.parentNode.parentNode;
            data3 = JSON.parse($(parent).attr("data-field")).author;
            name = data3.user_name;
            id = data3.user_id;
        }else{
            parent = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            data3 = JSON.parse($(parent).attr("data-field"));
            name = data3.author_name;
            id = data3.id;
        }
        var confirmBox = document.createElement("div");
        $(confirmBox).attr("id","confirmBox").html("<p>是否屏蔽</p><p>" + name + "</p><input type='button' value='确认' id='confirm-yes' /><input type='button' value='取消' id='confirm-no' />");
        document.documentElement.appendChild(confirmBox);
        $(confirmBox).animate({"top":"100","opacity":"100"},{"end":function(){
            clearTimeout(confirmBox.fadeOut);
            this.fadeOut=setTimeout(function(){
                $(confirmBox).animate({"top":"60","opacity":"0"},{"end":function(){
                    $(this).remove();
                }});
            },3000);
        }});
        $('#confirm-yes').on('click',function(){
            GM_setValue(name,'{"name":"' + name + '","id":"' + id + '","bar":"' + barName() + '","reson":"不顺眼"}');
            init().block();
            confirmBox.remove(this);
        });
        $("#confirm-no").on('click',function(){
            confirmBox.remove(this);
        });
        })(target);
        //阻止默认事件和冒泡
        return false;
    }
    //屏蔽列表删除键
    else if( hasClass(target,"deletThis") ){
        var ele = $(target.parentNode.parentNode);
        var thisKey = JSON.parse(ele.attr('data-value')).name; //获取当前结点的key
        GM_deleteValue(thisKey); //删除变量
        ele.remove(); //删除节点
    }
    //如果点击到遮罩层
    else if (hasClass(target, 'mar')){
        $(".mar").html(" ");
        //获取data数据
        var data = JSON.parse($(target).attr('data'));
        //第一次点击
        if (!target.ready) {
            $(target).css({
                "border-left":"5px solid rgb(174, 103, 34)"
            });
            target.ready = true;
        }
        //再次点击
        else if(target.ready === true){
            $(target.parentNode).css({
                "position":"relative",
                "-webkit-filter":"none",
                "-moz-filter":"none",
                "o-filter":"none",
                "ms-filter":"none",
                "filter":"none"
            });
            $(target).css({
                "background":"none",
                "opacity":"1",
                "filter":"alpha(opacity=100)"
            }).html('<input type="button" id="keeplock" value="继续屏蔽" /><input type="button" id="unlockNow" value="暂时解除 "/><input type="button" id="unlock" value="永久解除" />' + '<p>' + data.name + '(' + data.id + ')，其在' + data.bar + '因[' + data.reson + ']被屏蔽' + '</p>');
            target.ready = null;
        }
    }
    //点击屏蔽关键字删除
    else if( hasClass(target, 'blockTag') ){
        var word = $(target).text();
        var arr = GM_getValue("keyWord",[]);
        var temp = [];
        for(var i=0;i<arr.length;i++){
            if(arr[i]!=word){
                temp.push( arr[i] );
            }
        }
        GM_setValue("keyWord",temp);
        $(target).remove();
        //重新屏蔽
        // keyfilter();
        key().filter();
        return false;
    }
    else{
        switch(id){
            //解除屏蔽
            case "unlock" :
                var $ele1 =  $(target.parentNode);
                var data2 = JSON.parse( $ele1.attr("data") );
                GM_deleteValue(data2.name); //删除键名
                $ele1.remove();
                break;
            //暂时解除
            case "unlockNow" : 
                target.parentNode.remove(this);
                break;
            //继续屏蔽
            case "keeplock" : 
                var targetParent = target.parentNode;
                var config = {
                    "blockWay": GM_getValue('setting-blockWay', defaultdConfig.blockWay),//屏蔽方式
                    "color": GM_getValue('setting-col', defaultdConfig.color),//遮罩颜色
                    "opacity": GM_getValue('setting-opa', defaultdConfig.opacity),//遮罩透明度
                    "blur": GM_getValue('setting-gus', defaultdConfig.blurpx)//高斯模糊
                };
                $(targetParent.parentNode).css({
                    "position":"relative",
                    "filter":"blur(" + config.blur +"px)",
                    "-webkit-filter":"blur(" + config.blur + "px)",
                    "-moz-filter":"blur(" + config.blur + "px)",
                    "-o-filter":"blur(" + config.blur + "px)",
                    "-ms-filter":"blur(" + config.blur + "px)",
                    "backface-visibility":"hidden",
                    "-webkit-backface-visibility":"hidden",
                    "-moz-backface-visibility":"hidden",
                    "-o-backface-visibility":"hidden",
                    "-ms-backface-visibility":"hidden"
                });
                $(targetParent).css({
                    "opacity":config.opacity,
                    "background":config.color,
                    "border":"none"
                }).html(" ");
                break;
            //退出
            case "queit" : 
                $('#pannal,#wrap').remove();
                document.body.className = '';
                break;
            case "wrap" : 
                $('#pannal,#wrap').remove();
                document.body.className = '';
                break;
            //保存
            case "save" : 
                //判断屏蔽方式
                GM_setValue('setting-blockWay', $("#blockWay").value() );
                //遮罩颜色
                GM_setValue('setting-col', $("#col").value() );
                //遮罩透明度1
                GM_setValue('setting-opa', $('#opa').value() );
                //高斯模糊半径
                GM_setValue('setting-gus', $('#gus').value());
                //添加黑名单
                var name = $('#userName').value();
                if(name === "" || name === null){
                    return;
                }
                GM_setValue($('#userName').value(), '{"name":"' + $('#userName').value() + '","id":"' + $("#userId").value() + '","bar":"' + $("#curBar").value() + '","reson":"' + $("#reson").value() + '"}');
                init().block();
                createList();//重新生成列表
                break;
            //初始化
            case "clear" : 
                clearall();
                createList();
                break;
            //添加关键字
            case "addWord":
                var input = $("#blockWord").value();
                if(input===""){
                    return;
                }
                var keyArr = GM_getValue("keyWord",[]);
                keyArr.push(input);
                var a = {};
                var newTemp = [];
                for(var f=0;f<keyArr.length;f++){
                    if(typeof (a[ keyArr[f] ]) == "undefined" ){
                        a[ keyArr[f] ] = 1;
                        newTemp.push( keyArr[f] );
                    }
                }
                GM_setValue("keyWord",newTemp);
                //生成标签
                key().createTag();
                //过滤
                key().filter();
                break;
            //显示日志
            case "showLog":
                var str = "";
                for(var x=0;x<log.length;x++){
                    str += "<p>" + log[x] + "</p>";
                }
                $("#tag-log").html(str);
                break;
            //显示控制面板
            case "showPannle":
                showPannle();
                break;
            default:
                return;
        }
    }
});

$(document).bind('input',function(e){
    var target = e.target || e.srcElement,
        id = target.id;
    switch(id){
        case "sear" : 
            searchInList();
            break;
        case "opa" : 
            $('#opa-text').html( $('#opa').value() );
            break;
        case "gus" : 
            $('#gus-text').html( $('#gus').value() );
            break;
        case "userName" : 
            if( $("#lst").html() === "" || $("#lst").html() === null ){
                init().autoTips();
            }
            break;
        default : 
            return;
    }
});

$(window).bind('keyup',function(e){
    var target = e.target || e.srcElement;
    if(e.keyCode==8){//backspace
        if ( target.id=="sear" && target.value === '') {
            createList();
            return;
        }
    }else if(e.ctrlKey && e.keyCode == 114){//快捷键ctrl+F3，显示控制面板
        showPannle();
    }
});

//==============样式=================
var style = 'body{-webkit-backface-visibility:hidden}.blur{filter:blur(5px) grayscale(1);-webkit-filter:blur(5px) grayscale(1);-moz-filter:blur(5px) grayscale(1);-o-filter:blur(5px) grayscale(1);-ms-filter:blur(5px) grayscale(1)}#pannal{width:200px;height:auto;background:#263238;color:#fff;position:fixed;z-index:1000000000;text-align:center;box-shadow:0 0 20px 5px #000000}#pannal>div{margin:10px 0}#pannal input{color:#3e3e3e;border:1px solid transparent;height:20px;line-height:20px}#pannal input:focus{background-color:#263238;color:#fff;border:1px solid;-webkit-transition:all 0.2s ease-in-out;transition:all 0.2s ease-in-out}#pannal h3{color:#00ffe2}#pannal-setting input[type=range]{width:80%}#fn input{padding:5px 10px;margin:0 5px;cursor:pointer}#fn input:hover{background:#004d40;color:#fff}#pannal>span#queit{position:absolute;width:21px;height:21px;line-height:21px;font-size:21px;top:0;right:0;cursor:pointer;opacity:0.8;background:#fff;color:#303030}#blockWay{color:#3e3e3e;border:none}#wrap{position:fixed;width:100%;height:100%;background:rgba(155,155,155,0.5);top:0;left:0;z-index:999999999}.mar{width:100%;height:100%;position:absolute;top:0;left:0;z-index:999999998;-webkit-backface-visibility:hidden;text-align:center;font-size:16px}.mar input{background:#303030;color:#fff;padding:5px 10px;margin:5px 10px;font-family:"宋体";font-size:14px;border:none}.mar input:hover{background:#004d40;-webkit-transition:all 0.2s ease-in-out;transition:all 0.2s ease-in-out}.mar p{color:#2B2929;font-weight:bold;background-color:rgba(72,70,70,0.35);line-height:30px;width:60%;margin:0 auto}.mar p:hover{color:#fff;background-color:#004d40;-webkit-transition:all 0.2s ease-in-out;transition:all 0.2s ease-in-out}#list{position:absolute;top:0;left:200px;width:400px;height:0;overflow-x:hidden;overflow-y:auto;background:inherit;margin:0}#list tr:hover{background:#004d40;-webkit-transition:all 0.2s ease-in-out;transition:all 0.2s ease-in-out}.key{float:left;clear:both;margin-left:10px;width:120px;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.col{border:none}.deletThis{float:right;cursor:pointer;margin-right:10px;padding:0 5px;border:0;height:18px}.disable-btn{background:#6B6B6B;cursor:not-allowed}#addBlackList input{width:80%}#thread_list>li[data-field] .threadlist_lz>.threadlist_author:hover,.l_post .d_name:hover{background:#004d40;-webkit-transition:all 0.2s ease-in-out;transition:all 0.2s ease-in-out}#sear{position:relative;margin:0 auto;text-align:center;height:21px;width:100%;border:none}#confirmBox{width:300px;background:rgba(5,49,43,0.8);position:fixed;left:50%;top:60px;margin-left:-150px;text-align:center;z-index:999999;opacity:0;box-shadow:1px 1px 10px 2px #000000}#confirmBox input{border:none;padding:10px 30px;margin:10px;cursor:pointer}#confirmBox input:hover{background:#004d40;-webkit-transition:all 0.2s ease-in-out;transition:all 0.2s ease-in-out}#confirmBox p{font-size:18px;color:#fff;margin-top:20px}#block-keyWord{position:absolute;top:0;right:100%;width:200px;height:0;margin:0 !important;padding:0;background-color:inherit;overflow:auto}span.blockTag{padding:5px 10px;display:inline-block;border:1px solid;border-radius:5px;position:relative;margin:2px 5px}span.blockTag:hover{background:#08454A}#blockWord{margin:10px 0}#addWord{padding:0 5px !important;background-color:transparent !important;border:1px solid #fff !important;color:#fff !important}#addWord:hover{background-color:#015444 !important}#tag-log>p{margin:10px 0;text-align:left;text-indent:2em;line-height:2em}#tag-log>p:hover{background:#004d40;-webkit-transition:all 0.2s ease-in-out;transition:all 0.2s ease-in-out}';
GM_addStyle(style);
})(window,document);