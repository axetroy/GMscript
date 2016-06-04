// ==UserScript==
// @name              去百度搜索置顶推广 (ECMA6)
// @author            axetroy
// @contributor       axetroy
// @description       去除插入在百度搜索结果头部、尾部的推广链接。
// @version           2016.6.4
// @grant             none
// @include           *www.baidu.com*
// @include           *zhidao.baidu.com/search*
// @connect           *
// @supportURL        http://www.burningall.com
// @compatible        chrome  完美运行
// @compatible        firefox  完美运行
// @run-at            document-start
// @contributionURL   troy450409405@gmail.com|alipay.com
// @namespace         https://greasyfork.org/zh-CN/users/3400-axetroy
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
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

	var _$interval = __webpack_require__(55);

	var _$interval2 = _interopRequireDefault(_$interval);

	var _main = __webpack_require__(56);

	var _main2 = _interopRequireDefault(_main);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var loop = (0, _$interval2.default)(function () {
	  new _main2.default().filter().turn();
	}, 50);

	// init
	(0, _jqLite2.default)(function () {
	  new _main2.default().filter().turn();
	  _$interval2.default.cancel(loop);
	  (0, _jqLite2.default)(document).observe(function () {
	    return new _main2.default().filter().turn();
	  });
	  console.info('去广告启动...');
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
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var $interval = function $interval(fn, delay) {
	  var interval = function interval() {
	    fn.call(undefined);
	    id = setTimeout(interval, delay);
	  };

	  var id = setTimeout(interval, delay);

	  return function () {
	    window.clearTimeout(id);
	  };
	};

	$interval.cancel = function (timerFunc) {
	  timerFunc();
	};

	exports.default = $interval;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _jqLite = __webpack_require__(1);

	var _jqLite2 = _interopRequireDefault(_jqLite);

	var _config = __webpack_require__(57);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Main = function () {
	  function Main() {
	    var rules = arguments.length <= 0 || arguments[0] === undefined ? _config2.default.rules : arguments[0];

	    _classCallCheck(this, Main);

	    this.ads = (0, _jqLite2.default)(rules);
	    this.length = this.ads.length;
	  }

	  _createClass(Main, [{
	    key: 'filter',
	    value: function filter() {
	      this.ads.each(function (ele, i) {
	        ele.style.cssText = '\n          display:none !important;\n          visibility:hidden !important;\n          width:0 !important;\n          height:0 !important;\n          overflow:hidden !important;\n          // background-color:red !important;\n          // border:1px solid red;\n        ';
	        ele.setAttribute('filtered', '');
	      });
	      return this;
	    }
	  }, {
	    key: 'turn',
	    value: function turn() {
	      (0, _jqLite2.default)('#content_left input[type=checkbox]:not(filtered)').each(function (ele) {
	        ele.checked = false;
	        ele.setAttribute('filtered', '');
	      });
	      return this;
	    }
	  }]);

	  return Main;
	}();

	exports.default = Main;

/***/ },
/* 57 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var CONFIG = {
	  rules: '\n    #content_left>div\n    :not([class*=result])\n    :not([class*=container])\n    :not(.leftBlock)\n    :not(#rs_top_new)\n    :not([filtered])\n    ,\n    #content_left>table\n    :not(.result)\n    :not([filtered])\n    ,\n    #content_right>table td\n    div#ec_im_container\n    ,\n    div.s-news-list-wrapper>div\n    :not([data-relatewords*="1"])\n    ,\n    div.list-wraper dl[data-oad]\n    :not([data-fb])\n    :not([filtered])\n  '.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1')
	};

	exports.default = CONFIG;

/***/ }
/******/ ]);