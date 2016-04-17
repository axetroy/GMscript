
'use strict';

let noop = x => x;

class jqLite {
  constructor(selectors = '', context = document) {
    this.selectors = selectors;
    this.context = context;
    this.length = 0;

    switch (typeof selectors) {
      case 'undefined':
        break;
      case 'string':
        Array.from(context.querySelectorAll(selectors), (ele, i) => {
          this[i] = ele;
          this.length++;
        }, this);
        break;
      case 'object':
        if (selectors.length) {
          Array.from(selectors, (ele, i) => {
            this[i] = ele;
            this.length++;
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

  };

  each(fn = noop) {
    for (let i = 0; i < this.length; i++) {
      fn.call(this, this[i], i);
    }
    return this;
  };

  bind(types = '', fn = noop) {
    this.each((ele)=> {
      types.trim().split(/\s{1,}/).forEach((type)=> {
        ele.addEventListener(type, (e) => {
          let target = e.target || e.srcElement;
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
  };

  ready(fn = noop) {
    this.context.addEventListener('DOMContentLoaded', e => {
      fn.call(this);
    }, false);
  }

  observe(fn = noop, config = {childList: true, subtree: true}) {
    this.each((ele) => {
      let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          fn.call(this, mutation.target, mutation.addedNodes, mutation.removedNodes);
        });
      });
      observer.observe(ele, config);
    });
    return this;
  };

  attr(attr, value) {
    // one agm
    if (arguments.length === 1) {
      // get attr value
      if (typeof attr === 'string') {
        return this[0].getAttribute(attr);
      }
      // set attr with a json
      else if (typeof attr === 'object') {
        this.each(function (ele) {
          for (let at in attr) {
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
    }
    else {
      return this;
    }
  };

  removeAttr(attr) {
    if (arguments.length === 1) {
      this.each((ele)=> {
        ele.removeAttribute(attr);
      });
    }
    return this;
  }

  get text() {
    let ele = this[0];
    return ele.innerText ? ele.innerText : ele.textContent;
  };

  static get fn() {
    let visible = (ele)=> {
      let pos = ele.getBoundingClientRect();
      let w;
      let h;
      let inViewPort;
      let docEle = document.documentElement;
      let docBody = document.body;
      if (docEle.getBoundingClientRect) {
        w = docEle.clientWidth || docBody.clientWidth;
        h = docEle.clientHeight || docBody.clientHeight;
        inViewPort = pos.top > h || pos.bottom < 0 || pos.left > w || pos.right < 0;
        return inViewPort ? false : true;
      }
    };
    let merge = (...sources) => {
      return Object.assign({}, ...sources);
    };
    return {
      visible,
      merge
    }
  };

}

let $ = (selectors = '', context = document) => {
  return new jqLite(selectors, context);
};
$.fn = jqLite.fn;

module.exports = $;