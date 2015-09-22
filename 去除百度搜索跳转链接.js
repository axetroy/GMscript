// ==UserScript==
// @name    remove the jump link in BAIDU
// @author  burningall
// @description 去除百度搜索跳转链接
// @version     2015.9.22
// @include     *www.baidu.com*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @compatible  chrome  完美运行
// @compatible  firefox  完美运行
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @supportURL      http://www.burningall.com
// @contributionURL troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==
(function(win,doc,undefined) {
  //=====配置参数======
  var config = {
    // 需要跳转的链接
    macthRules: 'a[href*="www.baidu.com/link?url"]:not([transcoding]):not([transcoded]):not([transcodedAll]):not(.m)',
    // 请求失败，需要再次请求的链接
    reloadRules: 'a[transcoded*="false"]',
    // 是否需要请求动画，false为关闭动画，默认为true，开启
    isAnimate: GM_getValue("isAnimate",true),
    // 是否正在请求全部，不要修改
    transcodingAll:false,
    // 混合请求，默认开启
    mixRequireMod:true
  };
  // CSS3动画
  var styleStr = 'a[transcoded]{position:relative}'+
                 // 请求失败 
                 'a[transcoded*="false"]:before{background:rgba(197,31,32,0.5)}'+
                 // 请求成功
                 'a[transcoded*="true"]:before{background:rgba(43,138,23,0.5)}'+
                 // 公共样式
                 'a[transcoded]:before{'+
                                      'content:"";'+
                                      'position:absolute;'+
                                      'width:0;'+
                                      'height:100%;'+
                                      'line-height:100%;'+
                                      'display:inline-block;'+
                                      'animation:slide 1s ease-in-out .2s backwards;'+
                                      '-webkit-animation:slide 1s ease-in-out .2s backwards;'+
                                      '-moz-animation:slide 1s ease-in-out .2s backwards;'+
                                      '-o-animation:slide 1s ease-in-out .2s backwards;'+
                                      '-ms-animation:slide 1s ease-in-out .2s backwards}'+
                  // 动画
                  '@keyframes slide{'+
                                      '0%{width:0}'+
                                      '80%{width:100%}'+
                                      '100%{width:0}}'+
                  '@-webkit-keyframes slide{'+
                                      '0%{width:0}'+
                                      '80%{width:100%}'+
                                      '100%{width:0}}'+
                  '@-moz-keyframes slide{'+
                                      '0%{width:0}'+
                                      '80%{width:100%}'+
                                      '100%{width:0}}'+
                  '@-o-keyframes slide{'+
                                      '0%{width:0}'+
                                      '80%{width:100%}'+
                                      '100%{width:0}}'+
                  '@-ms-keyframes slide{'+
                                      '0%{width:0}'+
                                      '80%{width:100%}'+
                                      '100%{width:0}}';
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
        ev = win.event ? win.event : (e ? e : null);
        ev.target = ev.target || ev.srcElement;
        if (fn.call(obj, ev) === false) {
          ev.cancelBubble = true;
          ev.preventDefault();
        }
      }, false) :
      obj.attachEvent('on' + type, function(e) {
        ev = win.event ? win.event : (e ? e : null);
        ev.target = ev.target || ev.srcElement;
        if (fn.call(obj, ev) === false) {
          ev.cancelBubble = true;
          return false;
        }
      });
  };
  // 事件绑定
  Event.prototype.bind = function(type, fn) {
    var obj = this.element;
    // 传入一个参数
    if (arguments.length == 1) {
      for (var attr in type) {
        this.addEvent(attr, type[attr]);
      }
    }
    // 传入json
    else if (arguments.length == 2) {
      var events = type.split(' ');
      var j = 0;
      while (j < events.length) {
        this.addEvent(events[j], fn);
        j++;
      }
    }
    return this;
  };
  // 监听
  Event.prototype.ob = function(config, fn) {
    var target = this.element;
    var MutationObserver = win.MutationObserver || win.WebKitMutationObserver || win.MozMutationObserver,
      observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          fn.call(target);
        });
      });
    observer.observe(target, config);
    return this;
  };
  //======公共函数=======
  // 获取DOM节点的文本
  function getText(obj){
    return obj.innerText ? obj.innerText : obj.textContent;
  }
  // AJAX
  function ajax(url,json,a){
    // this>>>a
    a = a ? a : win;
    if( json.beforeFn ){
      // 如果返回值为false，则不请求
      if( json.beforeFn.call(a,url)===false ) return;//this>>>a
    }
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onreadystatechange: function(response) {
        if (response.readyState == 4) {
          var status = response.status + '';
          if (status.charAt(0) == "4" || status.charAt(0) == "5") { //4XX，5XX错误
            if( json.failFn ) json.failFn.call(a,status,url);//this>>>a
          } else {
            if( json.successFn ) json.successFn.call(a,response.responseText,url);//this>>>a
          }
        }
      }
    });
  }
  //======主体对象=======
  function init(agm) {
    return new Init(agm);
  }
  // 初始化
  function Init(agm) {
    // 添加动画
    this.addStyle(styleStr);
    // 不传参数则返回
    if (!agm) return this;
    // 获取到要跳转的A链接
    var jumpLinks = doc.querySelectorAll(agm);
    // 在可视区域内的跳转链接
    this.inViewPort = [];
    for (var j = 0,leng = jumpLinks.length; j < leng; j++) {
      this.a = jumpLinks[j];
      // 在可视区域内
      if ( this.visible() ) this.inViewPort.push(jumpLinks[j]);
    }
    // 删除百度搜索追踪
    var trackDiv = doc.querySelectorAll('#content_left *[data-click]');
    for( var i=0,len=trackDiv.length;i<len;i++ ){
      trackDiv[i].removeAttribute('data-click');
    }
    return this;
  }
  // 全局请求
  Init.prototype.all = function(callBack){
    // 搜索框的关键字
    var searchWord = doc.getElementById('kw').value,
    // 构建新的请求url，把tn=baidulocal替换成tn=baidulocal
      url = win.top.location.href.replace('https', 'http').replace(/(\&)(tn=\w+)(\&)/img, '$1' + 'tn=baidulocal' + '$3').replace(/(\&)(wd=\w+)(\&)/img, '$1' + 'wd='+ searchWord + '$3');
    ajax(url,{
      // 请求发出前
      "beforeFn":function(url){
        config.transcodingAll=true;
      },
      // 请求失败 
      "failFn":function(status,url){
        this.setAttribute("transcoded","false");
        console.log( '请求' + url + '结果：' + status );
      },
      // 请求成功
      "successFn":function(response,url){
        var html = doc.createElement('html');
        // 讨厌的http百度图片
        html.innerHTML = response.replace(/http\:\/\/(.*)\.gif/img, "http://wwwbaidu.com");
        // 请求得到的所有A标签
        var requireAtag = html.querySelectorAll('.f>a'),
        // 存放信息的哈希表
          info = {};//href：innerText
        // 存放href和innerText到info中
        for (var i = 0,length = requireAtag.length; i < length; i++) {
          if ( info[requireAtag[i].href] === undefined) info[ requireAtag[i].href ] = getText( requireAtag[i] );
        }
        // 当前页的需要跳转的A标签
        var currentAtag = doc.querySelectorAll('.t>a:not(.OP_LOG_LINK):not([transcoded]):not([transcodedAll])');
        // 循环匹配，替换url
        for (var trueLink in info) {
          for (var j = 0,len = currentAtag.length; j < len; j++) {
            // 如果符合条件
            if ( info[trueLink].replace(/\s*/img, '') == getText( currentAtag[j] ).replace(/\s*/img,'') ) {
              currentAtag[j].href = trueLink;
              currentAtag[j].setAttribute('transcodedAll','true');
              currentAtag[j].setAttribute('transcoded','true');
              // currentAtag[j].style.background = 'red';
            }
          }
        }
        config.transcodingAll=false;
        // 回调函数
        if(callBack) callBack();
      }
    });
  };
  // 关闭混合请求
  if( !config.mixRequireMod ){
    Init.prototype.all = function(callBack){
      if(callBack) callBack();
      return;
    };
  }
  // 逐一请求
  Init.prototype.onebyone = function(){
    var leng = this.inViewPort.length;
    // 如果可视区域内不存在跳转链接
    if (leng <= 0) return;
    // 对在可视区域内的跳转链接，进行循环逐一请求
    for (var i = 0; i < leng; i++) {
      this.a = this.inViewPort[i];
      // 如果已经全局请求过了
      if( this.a.getAttribute("transcodedAll") ) continue;
      // url构建：url必须要加上"&wd=&eqid=0"，否则出错
      ajax(this.a.href.replace("http", "https") + "&wd=&eqid=0",{
        // 请求前
        "beforeFn":function(url){
          this.setAttribute("transcoding", "true");
        },
        // 请求失败
        "failFn":function(status,url){
          this.setAttribute("transcoded", "false");
          console.log( '请求' + url + '结果：' + status );
        },
        // 请求成功
        "successFn":function(responseStr,url){
          var trueLink = responseStr.match(/\(\"\S+\"\)/img)[0].replace(/^[\(\"]*|[\)\"]*$/img,"");
          this.href = trueLink;
          this.removeAttribute("transcoding");
          this.setAttribute("transcoded", "true");
        }
      },this.a);
    }
    return this;
  };
  // 添加动画
  Init.prototype.addStyle = function(styleStr) {
    // 如果已存在则返回
    if ( !config.isAnimate || doc.getElementById('transcodedStyle')) return;
    var textNode = doc.createTextNode(styleStr);
    var style = doc.createElement('style');
    style.id = "transcodedStyle";
    style.type = "text/css";
    style.appendChild(textNode);
    doc.head.appendChild(style);
  };
  // 检查是否在可视区域内
  Init.prototype.visible = function() {
    var obj = this.a,pos = obj.getBoundingClientRect(),w,h;
    if (doc.documentElement.getBoundingClientRect) {
      w = doc.documentElement.clientWidth || doc.body.clientWidth;
      h = doc.documentElement.clientHeight || doc.body.clientHeight;
      var inViewPort = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
      return inViewPort ? false : true;
    }
  };
  //======执行=======
  handler(doc).bind({
    // 页面加载完毕则开始执行
    "DOMContentLoaded": function() {
      if( config.transcodingAll===false ){
        // 全局请求
        init().all(function() {
          // 给全局请求添加动画
          var inViewPortEle = init('a[transcodedAll]').inViewPort;
          for( var i=0,length = inViewPortEle.length;i<length;i++ ){
            inViewPortEle[i].setAttribute("transcoded","true");
          }
          // 逐一请求
          init(config.macthRules).onebyone();
          // 翻页监听
          handler(doc).ob({
            "childList":true,
            "subtree":true
          },function(){
            if( !config.transcodingAll ){
              init().all(function() {
                init(config.macthRules).onebyone();
              });
            }
          });
        });
      }
    },
    // 鼠标移入跳转链接则请求
    "mouseover": function(e) {
      var a = e.target;
      if (a.tagName == "A" && /www.baidu.com\/link\?url=/img.test(a.href) && a.getAttribute('transcoded') !== "true") {
        var href = a.href.replace("http", "https") + "&wd=&eqid=0";
        ajax(href,{
          "beforeFn":function(url){
            this.setAttribute("transcoding", "true");
          },
          "successFn":function(responseStr,url){
            var trueLink = responseStr.match(/\(\"\S+\"\)/img)[0].replace(/^[\(\"]*|[\)\"]*$/img,"");
            this.href = trueLink;
            this.removeAttribute("transcoding");
            this.setAttribute("transcoded", "true");
          }
        },a);
      }
    }
  });
  // 页面滚动则LazyLoad
  handler(win).bind('scroll',function(){
    // 逐一请求
    init(config.macthRules).onebyone();
    // 再次请求失败的url
    init(config.reloadRules).onebyone();
    // 给全局请求添加动画
    var inViewPortEle = init('a[transcodedAll]').inViewPort;
    for( var i=0,length = inViewPortEle.length;i<length;i++ ){
      inViewPortEle[i].setAttribute("transcoded","true");
    }
  });
  //======注册菜单====
  function turnAnimate(){
    if( win.confirm("打开请求动画\n【确定】>>>打开动画\n【取消】>>>关闭动画\n\n当前状态:"+GM_getValue("isAnimate",true)+"\n\n刷新页面生效") ){
      GM_setValue("isAnimate",true);
    }else{
      GM_setValue("isAnimate",false);
    }
  }
  GM_registerMenuCommand("请求动画开关",turnAnimate);
})(window,document,undefined);