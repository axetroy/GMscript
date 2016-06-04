// ==UserScript==
// @name    Block somebody
// @author  burningall
// @description 在贴吧屏蔽某人,眼不见心不烦
// @version     2016.6.4
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
// @compatible  chrome  两个字，破费
// @compatible  firefox  两个字，破费
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @supportURL      http://www.burningall.com
// @contributionURL troy450409405@gmail.com|alipay.com
// @namespace https://greasyfork.org/zh-CN/users/3400-axetroy
// ==/UserScript==

/*

 Github源码:https://github.com/axetroy/GMscript

 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _jqLite = __webpack_require__(1);

	var _jqLite2 = _interopRequireDefault(_jqLite);

	var _icon = __webpack_require__(33);

	var _icon2 = _interopRequireDefault(_icon);

	var _panel = __webpack_require__(34);

	var _panel2 = _interopRequireDefault(_panel);

	var _common = __webpack_require__(36);

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var panel = new _panel2.default();
	var POSITION = _common2.default.getPosition();

	var initCount = 0;
	var $icon = (0, _jqLite2.default)(document.createElement("a")).addClass('block-icon').html(_icon2.default);
	var init = function init() {
	  if (POSITION === 'post') {
	    initCount++;
	    (0, _jqLite2.default)('.p_postlist .l_post').each(function (post) {
	      var $name = (0, _jqLite2.default)(post).find('.d_author ul.p_author li.d_name');
	      if (!$name[0]) return;

	      var id = $name.find('a[data-field].p_author_name').text().trim();

	      if (!id) return;

	      var icon = $icon[0].cloneNode(true);

	      if (GM_listValues().indexOf(id) > -1) return post.remove();

	      if ($name.find('svg').length) return;

	      (0, _jqLite2.default)(icon).click(function () {
	        var bar = _common2.default.getBarName();

	        var reason = '在帖子中选择';


	        GM_setValue(id, { id: id, bar: bar, reason: reason, date: new Date() });
	        (0, _jqLite2.default)('.p_postlist .l_post').each(function (ele) {
	          var username = (0, _jqLite2.default)(ele).attr('data-field').replace(/\'/g, '"');
	          if (!username) return;
	          username = JSON.parse(username).author.user_name || JSON.parse(username).author.name_u;
	          username = username.replace(/\&ie\=.*$/ig, '');
	          username = decodeURI(username);
	          if (username === id) ele.remove();
	        });
	      });

	      $name[0].appendChild(icon);
	    });
	  } else if (POSITION === 'list') {
	    (function () {
	      var interval = setInterval(function () {
	        var postList = (0, _jqLite2.default)('ul#thread_list li[data-field].j_thread_list');
	        if (!postList.length) return;

	        clearInterval(interval);
	        initCount++;
	        postList.each(function (post) {
	          var $name = (0, _jqLite2.default)(post).find('.j_threadlist_li_right .tb_icon_author');
	          if (!$name[0]) return;

	          var id = $name.find('a[data-field].frs-author-name').text().trim();
	          var icon = $icon[0].cloneNode(true);

	          if (GM_listValues().indexOf(id) > -1) return post.remove();

	          (0, _jqLite2.default)(icon).click(function () {
	            var bar = _common2.default.getBarName();

	            var reason = '贴吧首页选择';

	            if (!id) return;
	            GM_setValue(id, { id: id, bar: bar, reason: reason, date: new Date() });

	            (0, _jqLite2.default)('ul#thread_list li[data-field].j_thread_list').each(function (_post) {
	              var username = (0, _jqLite2.default)(_post).find('a[data-field].frs-author-name').text().trim();
	              if (!username) return;
	              if (username === id) _post.remove();
	            });
	          });

	          $name[0].appendChild(icon);
	        });
	      }, 100);
	    })();
	  }
	};

	(0, _jqLite2.default)(function () {

	  GM_registerMenuCommand("控制面板", panel.create);
	  GM_addStyle(__webpack_require__(38));

	  (0, _jqLite2.default)(document).bind('keyup', function (e) {
	    if (e.keyCode === 120) panel.create();
	  });

	  init();

	  (0, _jqLite2.default)(document).observe(function (target) {
	    var addedNodes = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	    var removedNodes = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];


	    addedNodes = Array.from(addedNodes);

	    // if (!addedNodes || !addedNodes.length || removedNodes.length) return;

	    addedNodes.forEach(function (node) {
	      // 翻页
	      if (node.id === 'content_leftList' || node.id === 'j_p_postlist') {
	        initCount > 0 && init();
	      }
	    });

	    // 楼中楼翻页
	    if (target && (0, _jqLite2.default)(target).hasClass('j_lzl_m_w')) {
	      (function () {

	        var $lzlList = (0, _jqLite2.default)(target).find('li.lzl_single_post');

	        $lzlList.each(function (lzl) {
	          var $lzl = (0, _jqLite2.default)(lzl);
	          if ($lzl.attr('filter')) return;

	          $lzl.attr('filter', true);
	          var id = JSON.parse($lzl.attr('data-field').replace(/\'/g, '"')).user_name;
	          id = decodeURI(id);

	          if (!id) return;

	          if (GM_listValues().indexOf(id) > -1) return lzl.remove();

	          var $name = $lzl.find('.lzl_cnt');

	          if ($name.find('svg').length) return;

	          var icon = $icon[0].cloneNode(true);

	          (0, _jqLite2.default)(icon).click(function (e) {
	            var bar = _common2.default.getBarName();

	            var reason = '楼中楼选择';


	            GM_setValue(id, { id: id, bar: bar, reason: reason, date: new Date() });

	            $lzlList.each(function (_lzl) {
	              var username = (0, _jqLite2.default)(_lzl).find('div.lzl_cnt a.j_user_card').text().trim();
	              if (!username) return;
	              if (username === id) _lzl.remove();
	            });
	          });
	          $lzl.find('.lzl_content_reply')[0].appendChild(icon);
	          // $name[0].insertBefore(icon, $name[0].childNodes[0]);
	        });
	      })();
	    }

	    //
	    var $lzlList = (0, _jqLite2.default)('ul.j_lzl_m_w');
	    if (!$lzlList.length) return;

	    $lzlList.each(function (lzls) {
	      if ((0, _jqLite2.default)(lzls).attr('filter')) return;

	      (0, _jqLite2.default)(lzls).attr('filter', true);

	      (0, _jqLite2.default)(lzls).find('li.lzl_single_post').each(function (lzl) {
	        var $lzl = (0, _jqLite2.default)(lzl);
	        var $name = $lzl.find('.lzl_cnt');

	        if ($name.find('svg').length) return;

	        var icon = $icon[0].cloneNode(true);

	        var id = JSON.parse($lzl.attr('data-field').replace(/\'/g, '"')).user_name;

	        if (GM_listValues().indexOf(id) > -1) return lzl.remove();

	        if (!id) return;

	        (0, _jqLite2.default)(icon).click(function (e) {
	          var bar = _common2.default.getBarName();

	          var reason = '楼中楼选择';

	          GM_setValue(id, { id: id, bar: bar, reason: reason, date: new Date() });
	          // 删除当前楼中楼的
	          $lzlList.each(function (_lzl) {
	            var $floor = (0, _jqLite2.default)(_lzl).find('div.lzl_cnt');
	            $floor.each(function (_post) {
	              var username = (0, _jqLite2.default)(_post).find('a.j_user_card').text().trim();
	              if (!username) return;
	              if (username === id) _post.parentElement.remove();
	            });
	          });
	          // 删除帖子里面楼层的
	          init();
	        });
	        // $name[0].insertBefore(icon, $name[0].childNodes[0]);
	        // $name[0].insertBefore(icon, $lzl.find('.lzl_content_reply'));
	        // $lzl.find('.lzl_content_reply')[0].insertBefore(icon, $lzl.find('.lzl_content_reply')[0].childNodes[1])
	        $lzl.find('.lzl_content_reply')[0].appendChild(icon);
	      });
	    });
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// es6 Array.from

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	// es6 Object.assign


	__webpack_require__(2);

	__webpack_require__(30);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var noop = function noop(x) {
	  return x;
	};

	var jqLite = function () {
	  function jqLite() {
	    var _this = this;

	    var selectors = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	    var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

	    _classCallCheck(this, jqLite);

	    this.selectors = selectors;
	    this.context = context;
	    this.length = 0;

	    switch (typeof selectors === 'undefined' ? 'undefined' : _typeof(selectors)) {
	      case 'undefined':
	        break;
	      case 'string':
	        Array.from(context.querySelectorAll(selectors), function (ele, i) {
	          _this[i] = ele;
	          _this.length++;
	        }, this);
	        break;
	      case 'object':
	        if (selectors.length) {
	          Array.from(selectors, function (ele, i) {
	            _this[i] = ele;
	            _this.length++;
	          }, this);
	        } else {
	          this[0] = selectors;
	          this.length = 1;
	        }
	        break;
	      case 'function':
	        this.ready(selectors);
	        break;
	      default:

	    }
	  }

	  _createClass(jqLite, [{
	    key: 'eq',
	    value: function eq() {
	      var n = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	      return new jqLite(this[n]);
	    }
	  }, {
	    key: 'find',
	    value: function find(selectors) {
	      return new jqLite(selectors, this[0]);
	    }
	  }, {
	    key: 'each',
	    value: function each() {
	      var fn = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];

	      for (var i = 0; i < this.length; i++) {
	        fn.call(this, this[i], i);
	      }
	      return this;
	    }
	  }, {
	    key: 'bind',
	    value: function bind() {
	      var types = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var fn = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];

	      this.each(function (ele) {
	        types.trim().split(/\s{1,}/).forEach(function (type) {
	          ele.addEventListener(type, function (e) {
	            var target = e.target || e.srcElement;
	            if (fn.call(target, e) === false) {
	              e.returnValue = true;
	              e.cancelBubble = true;
	              e.preventDefault && e.preventDefault();
	              e.stopPropagation && e.stopPropagation();
	              return false;
	            }
	          }, false);
	        });
	      });
	    }
	  }, {
	    key: 'click',
	    value: function click() {
	      var fn = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];

	      this.bind('click', fn);
	      return this;
	    }
	  }, {
	    key: 'ready',
	    value: function ready() {
	      var _this2 = this;

	      var fn = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];

	      window.addEventListener('DOMContentLoaded', function (e) {
	        fn.call(_this2, e);
	      }, false);
	    }
	  }, {
	    key: 'observe',
	    value: function observe() {
	      var _this3 = this;

	      var fn = arguments.length <= 0 || arguments[0] === undefined ? noop : arguments[0];
	      var config = arguments.length <= 1 || arguments[1] === undefined ? { childList: true, subtree: true } : arguments[1];

	      this.each(function (ele) {
	        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	        var observer = new MutationObserver(function (mutations) {
	          mutations.forEach(function (mutation) {
	            fn.call(_this3, mutation.target, mutation.addedNodes, mutation.removedNodes);
	          });
	        });
	        observer.observe(ele, config);
	      });
	      return this;
	    }
	  }, {
	    key: 'attr',
	    value: function (_attr) {
	      function attr(_x, _x2) {
	        return _attr.apply(this, arguments);
	      }

	      attr.toString = function () {
	        return _attr.toString();
	      };

	      return attr;
	    }(function (attr, value) {
	      // one agm
	      if (arguments.length === 1) {
	        // get attr value
	        if (typeof attr === 'string') {
	          return this[0].getAttribute(attr);
	        }
	        // set attr with a json
	        else if ((typeof attr === 'undefined' ? 'undefined' : _typeof(attr)) === 'object') {
	            this.each(function (ele) {
	              for (var at in attr) {
	                if (attr.hasOwnProperty(at)) {
	                  ele.setAttribute(at, value);
	                }
	              }
	            });
	            return value;
	          }
	      }
	      // set
	      else if (arguments.length === 2) {
	          this.each(function (ele) {
	            ele.setAttribute(attr, value);
	          });
	          return this;
	        } else {
	          return this;
	        }
	    })
	  }, {
	    key: 'removeAttr',
	    value: function removeAttr(attr) {
	      if (arguments.length === 1) {
	        this.each(function (ele) {
	          ele.removeAttribute(attr);
	        });
	      }
	      return this;
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      this.each(function (ele) {
	        ele.remove();
	      });
	      this.length = 0;
	      return this;
	    }

	    // get the element style

	  }, {
	    key: 'style',
	    value: function style(attr) {
	      return this[0].currentStyle ? this[0].currentStyle[attr] : getComputedStyle(this[0])[attr];
	    }

	    // (attr,value) || 'string' || {}

	  }, {
	    key: 'css',
	    value: function css() {
	      for (var _len = arguments.length, agm = Array(_len), _key = 0; _key < _len; _key++) {
	        agm[_key] = arguments[_key];
	      }

	      if (agm.length === 1) {
	        // get style
	        if (typeof agm[0] === 'string') {
	          // set style as a long text
	          if (/:/ig.test(agm[0])) {
	            this.each(function (ele) {
	              ele.style.cssText = attr;
	            });
	          } else {
	            return this[0].currentStyle ? this[0].currentStyle[agm[0]] : getComputedStyle(this[0])[agm[0]];
	          }
	        }
	        // set style as a object
	        else {
	            this.each(function (ele) {
	              for (var _attr2 in agm[0]) {
	                if (agm[0].hasOwnProperty(_attr2)) {
	                  ele.style[_attr2] = agm[0][_attr2];
	                }
	              }
	            });
	          }
	      }
	      // set as (key,value)
	      else if (agm.length === 2) {
	          this.each(function (ele) {
	            ele.style[agm[0]] = agm[1];
	          });
	        }
	      return this;
	    }
	  }, {
	    key: 'width',
	    value: function width(value) {
	      var element = this[0];
	      // window or document
	      if (element.window === element || element.body) {
	        return document.body.scrollWidth > document.documentElement.scrollWidth ? document.body.scrollWidth : document.documentElement.scrollWidth;
	      }
	      // set width
	      else if (value) {
	          this.each(function (ele) {
	            ele.style.width = value + 'px';
	          });
	          return this;
	        }
	        // get width
	        else {
	            return this[0].offsetWidth || parseFloat(this.style('width'));
	          }
	    }
	  }, {
	    key: 'height',
	    value: function height(value) {
	      var ele = this[0];
	      // window or document
	      if (ele.window === ele || ele.body) {
	        return document.body.scrollHeight > document.documentElement.scrollHeight ? document.body.scrollHeight : document.documentElement.scrollHeight;
	      }
	      // set height
	      else if (value) {
	          this.each(function (ele) {
	            ele.style.height = value + 'px';
	          });
	          return this;
	        }
	        // get height
	        else {
	            return this[0].offsetHeight || parseFloat(this.style('height'));
	          }
	    }
	  }, {
	    key: 'html',
	    value: function html(value) {
	      if (value !== undefined) {
	        this.each(function (ele) {
	          ele.innerHTML = typeof value === 'function' ? value(ele) : value;
	        });
	      } else {
	        return this[0].innerHTML;
	      }
	      return this;
	    }
	  }, {
	    key: 'text',
	    value: function text(value) {
	      if (value === undefined) return this[0].innerText || this[0].textContent;

	      this.each(function (ele) {
	        ele.innerText = ele.textContent = value;
	      });
	      return this;
	    }
	  }, {
	    key: 'val',
	    value: function val(value) {
	      if (value === undefined) return this[0].value;
	      this.each(function (ele) {
	        ele.value = value;
	      });
	      return this;
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      this.each(function (ele) {
	        ele.style.display = '';
	      });
	      return this;
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.each(function (ele) {
	        ele.style.display = 'none';
	      });
	      return this;
	    }

	    // content str || jqLite Object || DOM
	    // here is jqLite Object

	  }, {
	    key: 'append',
	    value: function append(content) {
	      this.each(function (ele) {
	        ele.appendChild(content[0]);
	      });
	      return this;
	    }
	  }, {
	    key: 'prepend',


	    // content str || jqLite Object || DOM
	    // here is jqLite Object
	    value: function prepend(content) {
	      this.each(function (ele) {
	        ele.insertBefore(content[0], ele.children[0]);
	      });
	      return this;
	    }
	  }, {
	    key: 'hasClass',
	    value: function hasClass(className) {
	      if (!this[0]) return false;
	      return this[0].classList.contains(className);
	    }
	  }, {
	    key: 'addClass',
	    value: function addClass(className) {
	      this.each(function (ele) {
	        ele.classList.add(className);
	      });
	      return this;
	    }
	  }, {
	    key: 'removeClass',
	    value: function removeClass(className) {
	      this.each(function (ele) {
	        ele.classList.remove(className);
	      });
	      return this;
	    }
	  }, {
	    key: 'index',
	    get: function get() {
	      var index = 0;
	      var brothers = this[0].parentNode.children;
	      for (var i = 0; i < brothers.length; i++) {
	        if (brothers[i] == this[0]) {
	          index = i;
	          break;
	        }
	      }
	      return index;
	    }
	  }], [{
	    key: 'fn',
	    get: function get() {
	      var visible = function visible(ele) {
	        var pos = ele.getBoundingClientRect();
	        var w = void 0;
	        var h = void 0;
	        var inViewPort = void 0;
	        var docEle = document.documentElement;
	        var docBody = document.body;
	        if (docEle.getBoundingClientRect) {
	          w = docEle.clientWidth || docBody.clientWidth;
	          h = docEle.clientHeight || docBody.clientHeight;
	          inViewPort = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
	          return inViewPort ? false : true;
	        }
	      };
	      var merge = function merge() {
	        for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	          sources[_key2] = arguments[_key2];
	        }

	        return Object.assign.apply(Object, [{}].concat(sources));
	      };
	      return {
	        visible: visible,
	        merge: merge
	      };
	    }
	  }]);

	  return jqLite;
	}();

	var $ = function $() {
	  var selectors = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	  var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

	  return new jqLite(selectors, context);
	};
	$.fn = jqLite.fn;

	exports.default = $;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx         = __webpack_require__(3)
	  , $export     = __webpack_require__(5)
	  , toObject    = __webpack_require__(15)
	  , call        = __webpack_require__(17)
	  , isArrayIter = __webpack_require__(20)
	  , toLength    = __webpack_require__(24)
	  , getIterFn   = __webpack_require__(26);
	$export($export.S + $export.F * !__webpack_require__(29)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , $$      = arguments
	      , $$len   = $$.length
	      , mapfn   = $$len > 1 ? $$[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        result[index] = mapping ? mapfn(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(4);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(6)
	  , core      = __webpack_require__(7)
	  , hide      = __webpack_require__(8)
	  , redefine  = __webpack_require__(13)
	  , ctx       = __webpack_require__(3)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
	    , key, own, out, exp;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if(target && !own)redefine(target, key, out);
	    // export
	    if(exports[key] != out)hide(exports, key, exp);
	    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
	  }
	};
	global.core = core;
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 6 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 7 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(9)
	  , createDesc = __webpack_require__(10);
	module.exports = __webpack_require__(11) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(12)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// add fake Function#toString
	// for correct work wrapped methods / constructors with methods like LoDash isNative
	var global    = __webpack_require__(6)
	  , hide      = __webpack_require__(8)
	  , SRC       = __webpack_require__(14)('src')
	  , TO_STRING = 'toString'
	  , $toString = Function[TO_STRING]
	  , TPL       = ('' + $toString).split(TO_STRING);

	__webpack_require__(7).inspectSource = function(it){
	  return $toString.call(it);
	};

	(module.exports = function(O, key, val, safe){
	  if(typeof val == 'function'){
	    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	    val.hasOwnProperty('name') || hide(val, 'name', key);
	  }
	  if(O === global){
	    O[key] = val;
	  } else {
	    if(!safe)delete O[key];
	    hide(O, key, val);
	  }
	})(Function.prototype, TO_STRING, function toString(){
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});

/***/ },
/* 14 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(16);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(18);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(19);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(21)
	  , ITERATOR   = __webpack_require__(22)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(23)('wks')
	  , uid    = __webpack_require__(14)
	  , Symbol = __webpack_require__(6).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(6)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(25)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(27)
	  , ITERATOR  = __webpack_require__(22)('iterator')
	  , Iterators = __webpack_require__(21);
	module.exports = __webpack_require__(7).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(28)
	  , TAG = __webpack_require__(22)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(22)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(5);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(31)});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(9)
	  , toObject = __webpack_require__(15)
	  , IObject  = __webpack_require__(32);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(12)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(28);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Created by axetroy on 5/8/16.
	 */
	var svg = "\n<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"14\" height=\"14\" viewBox=\"0 0 200 200\" version=\"1.1\" style=\"\n    vertical-align: sub;\n\">\n<g class=\"transform-group\">\n  <g transform=\"scale(0.1953125, 0.1953125)\">\n    <path d=\"M822.809088 510.318592q0-91.994112-49.711104-168.56064l-430.829568 430.258176q78.280704 50.853888 169.703424 50.853888 63.424512 0 120.849408-24.855552t99.136512-66.567168 66.281472-99.707904 24.569856-121.4208zm-570.820608 170.846208l431.40096-430.829568q-77.13792-51.996672-171.4176-51.996672-84.566016 0-155.990016 41.711616t-113.135616 113.707008-41.711616 156.561408q0 92.565504 50.853888 170.846208zm698.812416-170.846208q0 89.708544-34.854912 171.4176t-93.422592 140.562432-139.99104 93.708288-170.560512 34.854912-170.560512-34.854912-139.99104-93.708288-93.422592-140.562432-34.854912-171.4176 34.854912-171.131904 93.422592-140.276736 139.99104-93.708288 170.560512-34.854912 170.560512 34.854912 139.99104 93.708288 93.422592 140.276736 34.854912 171.131904z\" fill=\"#272636\"></path>\n    </g>\n  </g>\n</svg>\n";

	exports.default = svg;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by axetroy on 5/10/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _jqLite = __webpack_require__(1);

	var _jqLite2 = _interopRequireDefault(_jqLite);

	var _formatDate = __webpack_require__(35);

	var _formatDate2 = _interopRequireDefault(_formatDate);

	var _common = __webpack_require__(36);

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Panel = function () {
	  function Panel() {
	    _classCallCheck(this, Panel);
	  }

	  _createClass(Panel, [{
	    key: 'create',
	    value: function create() {
	      if ((0, _jqLite2.default)('#block-mask').length) return;
	      var root = document.createElement('div');

	      this.$mask = (0, _jqLite2.default)(root.cloneNode(false)).attr('id', 'block-mask');
	      this.$panel = (0, _jqLite2.default)(root.cloneNode(false)).attr('id', 'block-panel').html(__webpack_require__(37));

	      this.$mask.append(this.$panel);

	      this.$menu = this.$panel.find('.block-menu ul li');
	      this.$session = this.$panel.find('.block-content .session');
	      this.$config = this.$session.eq(0);
	      this.$block = this.$session.eq(1);
	      this.$list = this.$session.eq(2);

	      this.init();
	      this.link();

	      document.documentElement.appendChild(this.$mask[0]);
	      return this;
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      this.$mask.remove();
	    }
	  }, {
	    key: 'link',
	    value: function link() {
	      var _this2 = this;

	      var _this = this;

	      // 屏蔽列表的点击事件
	      this.$list.click(function (e) {
	        var $target = (0, _jqLite2.default)(e.target);
	        var index = +$target.attr('list-index');
	        var blockID = $target.attr('block-id');

	        _this2.$list.find('table>tbody>tr').each(function (ele) {
	          if ((0, _jqLite2.default)(ele).find('.block-remove').attr('block-id') === blockID) {
	            ele.remove();
	            GM_deleteValue(blockID);
	          }
	        });
	      });

	      // 控制面板的切换
	      this.$menu.click(function (e) {
	        var index = (0, _jqLite2.default)(e.target).index;
	        _this2.$menu.removeClass('active').eq(index).addClass('active');
	        _this2.$session.hide().eq(index).show();
	        return false;
	      });

	      // 点击屏蔽按钮
	      // block someone
	      this.$block.find('.block-block-submit').click(function (e) {
	        var _map = ['id', 'bar', 'reason'].map(function (name) {
	          return _this2.$block.find('.block-' + name);
	        });

	        var _map2 = _slicedToArray(_map, 3);

	        var $id = _map2[0];
	        var $bar = _map2[1];
	        var $reason = _map2[2];

	        var _map3 = [$id, $bar, $reason].map(function (input) {
	          return input.val();
	        });

	        var _map4 = _slicedToArray(_map3, 3);

	        var id = _map4[0];
	        var bar = _map4[1];
	        var reason = _map4[2];


	        if (!id) return;
	        GM_setValue(id, { id: id, bar: bar, reason: reason, date: new Date() });
	        $id.val('');
	        $reason.val('');
	      });

	      // 关掉控制面板
	      this.$mask.click(function (e) {
	        if ((0, _jqLite2.default)(e.target).attr('id') === 'block-mask') _this2.remove();
	      });
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      this.$menu.eq(0).addClass('active');
	      this.$session.hide().eq(0).show();
	      this.$panel.find('.block-bar').val(_common2.default.getBarName());

	      this.$list.html(function () {
	        var GMList = GM_listValues();
	        var list = [];

	        for (var i = 0; i < GMList.length; i++) {
	          list[i] = GM_getValue(GMList[i]);
	        }

	        var tableStr = '';

	        list.forEach(function (v, i) {
	          var time = '';
	          if (v.date) {
	            var date = new Date(v.date);
	            time = (0, _formatDate2.default)(date, 'yyyy-MM-dd');
	          }
	          tableStr += '\n            <tr>\n              <td>' + v.id + '</td>\n              <td>' + v.bar + '</td>\n              <td>' + v.reason + '</td>\n              <td>' + time + '</td>\n              <td>\n                <a class="block-remove btn" href="javascript:void(0)" block-id="' + v.id + '" list-index="' + i + '">移除</a>\n              </td>\n            </tr>\n          ';
	        });

	        return '\n          <table>\n            <thead>\n              <tr>\n                <th><b>贴吧ID</b></th>\n                <th><b>所在贴吧</b></th>\n                <th><b>屏蔽理由</b></th>\n                <th><b>屏蔽时间</b></th>\n                <th><b>操作</b></th>\n              </tr>\n            </thead>\n            <tbody>\n              ' + tableStr + '\n            </tbody>\n          </table>\n        ';
	      });
	    }
	  }]);

	  return Panel;
	}();

	exports.default = Panel;

/***/ },
/* 35 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = formatDate;
	function formatDate(date, fmt) {
	  var o = {
	    "M+": date.getMonth() + 1, //月份
	    "d+": date.getDate(), //日
	    "h+": date.getHours(), //小时
	    "m+": date.getMinutes(), //分
	    "s+": date.getSeconds(), //秒
	    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
	    "S": date.getMilliseconds() //毫秒
	  };
	  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	  for (var k in o) {
	    if (new RegExp("(" + k + ")").test(fmt)) {
	      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	    }
	  }
	  return fmt;
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var common = {
	  // 获取当前所在的位置，是贴吧列表，还是贴吧内容页

	  getPosition: function getPosition() {
	    var url = location.href;
	    var postInside = /.*tieba.baidu.com\/p\/.*/ig;
	    var postList = /.*tieba.baidu.com\/(f\?.*|[^p])/ig;
	    return postInside.test(url) ? 'post' : postList.test(url) ? 'list' : null;
	  },

	  // 获取当前页的贴吧名
	  getBarName: function getBarName() {
	    return $(".card_title_fname").text().trim();
	  }
	};

	exports.default = common;

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = "<h2 class=\"block-title\">控制面板</h2>\n<div class=\"block-container\">\n\n  <div class=\"block-menu\">\n    <ul>\n      <li>配置</li>\n      <li>屏蔽</li>\n      <li>名单</li>\n    </ul>\n  </div>\n\n  <div class=\"block-content\">\n\n    <div class=\"session block-config\">\n      <h2>暂时没什么可配置的...</h2>\n    </div>\n\n    <div class=\"session block-block\">\n\n      <form style=\"margin: 0 auto;\">\n        <div>\n          <label>\n            *贴吧ID\n          </label>\n          <input class=\"block-id form-control\" type=\"text\" placeholder=\"贴吧ID\"/>\n        </div>\n\n        <div>\n          <label>\n            屏蔽原因\n          </label>\n          <input class=\"block-reason form-control\" type=\"text\" placeholder=\"屏蔽原因\"/>\n        </div>\n\n        <div>\n          <label>\n            所在贴吧\n          </label>\n          <input class=\"block-bar form-control\" type=\"text\" placeholder=\"所在贴吧\" value=\"\"/>\n        </div>\n\n        <input class=\"block-block-submit btn\" type=\"button\" value=\"提交\"/>\n      </form>\n\n    </div>\n\n    <div class=\"session block-list\">\n    </div>\n  </div>\n\n  <div class=\"block-clear\"></div>\n\n</div>";

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(39);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(41)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(40)();
	// imports


	// module
	exports.push([module.id, "@charset \"UTF-8\";\n/** 公共部分 **/\n@font-face {\n  font-family: ifont;\n  src: url(\"http://at.alicdn.com/t/font_1442373896_4754455.eot?#iefix\") format(\"embedded-opentype\"), url(\"http://at.alicdn.com/t/font_1442373896_4754455.woff\") format(\"woff\"), url(\"http://at.alicdn.com/t/font_1442373896_4754455.ttf\") format(\"truetype\"), url(\"http://at.alicdn.com/t/font_1442373896_4754455.svg#ifont\") format(\"svg\"); }\n\n#block-mask {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 9999999;\n  width: 100%;\n  height: 100%;\n  background: rgba(45, 45, 45, 0.6);\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n  font-size: 14px;\n  line-height: 1.42857143em;\n  /** 非公共部分 **/ }\n  #block-mask * {\n    -webkit-box-sizing: border-box;\n    box-sizing: border-box; }\n  #block-mask label {\n    display: inline-block;\n    max-width: 100%;\n    margin-bottom: 5px;\n    font-weight: 700; }\n  #block-mask .btn {\n    display: inline-block;\n    padding: 6px 12px;\n    font-size: 14px;\n    line-height: 1.42857143;\n    text-align: center;\n    white-space: nowrap;\n    vertical-align: middle;\n    -ms-touch-action: manipulation;\n    touch-action: manipulation;\n    cursor: pointer;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    user-select: none;\n    background-image: none;\n    border: 1px solid transparent;\n    border-radius: 4px;\n    margin-top: 5px;\n    margin-bottom: 5px;\n    color: #333;\n    background-color: #fff;\n    border-color: #333; }\n  #block-mask .form-group {\n    margin-bottom: 15px; }\n  #block-mask .form-control {\n    display: block;\n    width: 100%;\n    height: 34px;\n    padding: 6px 12px;\n    font-size: 14px;\n    line-height: 1.42857143;\n    color: #555;\n    background-color: #fff;\n    background-image: none;\n    border: 1px solid #ccc;\n    border-radius: 4px;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;\n    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; }\n    #block-mask .form-control:focus {\n      border-color: #66afe9;\n      outline: 0;\n      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);\n      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\n  #block-mask p {\n    color: #fff;\n    line-height: 3em; }\n  #block-mask a {\n    color: #555;\n    text-decoration: none; }\n  #block-mask .block-clear {\n    visibility: hidden;\n    font-size: 0;\n    width: 0;\n    height: 0;\n    clear: both; }\n  #block-mask ul {\n    list-style: none; }\n    #block-mask ul li {\n      color: #555; }\n  #block-mask #block-panel {\n    position: relative;\n    top: 100px;\n    width: 800px;\n    height: auto;\n    margin: 0 auto;\n    background: #fff;\n    z-index: inherit; }\n    #block-mask #block-panel .block-title {\n      text-align: center;\n      line-height: 36px;\n      font-size: 1.6em;\n      border-bottom: 1px solid #ccc; }\n    #block-mask #block-panel .block-container {\n      margin-top: 10px;\n      padding-bottom: 10px; }\n    #block-mask #block-panel .block-menu {\n      width: 10%;\n      float: left; }\n      #block-mask #block-panel .block-menu ul {\n        text-align: center; }\n        #block-mask #block-panel .block-menu ul li {\n          line-height: 4em;\n          cursor: pointer; }\n          #block-mask #block-panel .block-menu ul li.active {\n            background: #6B6B6B;\n            color: #fff; }\n    #block-mask #block-panel .block-content {\n      width: 90%;\n      padding-left: 20px;\n      float: left;\n      max-height: 400px;\n      overflow-y: auto; }\n      #block-mask #block-panel .block-content .block-list table {\n        width: 100%; }\n        #block-mask #block-panel .block-content .block-list table tr {\n          text-align: center;\n          line-height: 24px; }\n\na.block-icon {\n  display: inline; }\n", ""]);

	// exports


/***/ },
/* 40 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);