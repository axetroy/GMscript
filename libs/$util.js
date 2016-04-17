/**
 * Created by axetroy on 16-4-17.
 */

// object.assign for merge and copy
require('../node_modules/babel-polyfill/node_modules/core-js/modules/es6.object.assign');

const TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/;

let noop;
let toString = Object.prototype.toString;
let createMap;
let equals;
let merge;
let extend;
let copy;

let isDefined;
let isUndefined;
let isArray;
let isDate;
let isBoolean;
let isElement;
let isNumber;
let isObject;
let isString;
let isFunction;
let isRegExp;
let isWindow;
let isFile;
let isBlob;
let isTypedArray;
let isArrayBuffer;

noop = ()=> {
};

createMap = () => {
  return Object.create(null);
};

isDefined = ($$defined)=> {
  return !isUndefined($$defined);
};
isUndefined = (value, undefined)=> {
  return typeof value === 'undefined' || value === undefined;
};
isArray = Array.isArray;
isDate = (date)=> {
  return toString.call(date) === '[object Date]'
};
isBoolean = (value)=> {
  return typeof value === 'boolean' || value instanceof Boolean;
};
isElement = (node)=> {
  return !!(node && (node.nodeName || (node.prop && node.attr)));
};
isNumber = (value)=> {
  return isNaN(value) ? false : typeof value === 'number' || value instanceof Number;
};
isObject = (value)=> {
  return value !== null && typeof value === 'object';
};
isString = (value)=> {
  return typeof value === 'string' || value instanceof String;
};
isFunction = (value)=> {
  return typeof value === 'function';
};
isRegExp = (value)=> {
  return toString.call(value) === '[object RegExp]';
};
isWindow = (obj)=> {
  return obj && obj.window === obj;
};
isFile = (obj)=> {
  return toString.call(obj) === '[object File]';
};
isBlob = (obj)=> {
  return toString.call(obj) === '[object Blob]';
};
isTypedArray = (value)=> {
  return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
};
isArrayBuffer = (obj)=> {
  return toString.call(obj) === '[object ArrayBuffer]';
};

equals = (o1, o2)=> {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
  var t1 = typeof o1, t2 = typeof o2;
  if (t1 === t2 && t1 === 'object') {
    // array
    if (isArray(o1)) {
      if (!isArray(o2)) return false;
      let length = o1.length;
      if (length === o2.length) {
        for (let key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    }
    //date
    else if (isDate(o1)) {
      if (!isDate(o2)) return false;
      return equals(o1.getTime(), o2.getTime());
    }
    // RegExp
    else if (isRegExp(o1)) {
      if (!isRegExp(o2)) return false;
      return o1.toString() === o2.toString();
    }
    else {
      if (isWindow(o1) || isWindow(o2)) return false;

      for (let attr in o2) {
        if (o2.hasOwnProperty(attr)) {
          if (!attr in o1 || o2[attr] !== o1[attr]) return false;
        }
      }

      return true;
    }
  }
  else if (t1 === 'function') {
    if (t2 !== 'function') return false;
    return o1.toString() === o2.toString();
  }
  else {
    return o1 === o2;
  }
  return false;
};

merge = (...sources)=> {
  return Object.assign({}, ...sources);
};

extend = (target, ...source)=> {
  return Object.assign(target, ...source);
};

copy = (obj)=> {
  return merge(obj);
};


module.exports = {
  noop,
  isDefined,
  isUndefined,
  isArray,
  isDate,
  isBoolean,
  isElement,
  isNumber,
  isObject,
  isString,
  isFunction,
  isRegExp,
  isWindow,
  isFile,
  isBlob,
  isTypedArray,
  isArrayBuffer,
  equals,
  merge,
  extend,
  copy
};