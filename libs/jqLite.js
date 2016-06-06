'use strict';

// es6 Array.from
import 'babel-polyfill/node_modules/babel-runtime/node_modules/core-js/modules/es6.array.from';
// es6 Object.assign
import 'babel-polyfill/node_modules/babel-runtime/node_modules/core-js/modules/es6.object.assign';

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

  eq(n = 0) {
    return new jqLite(this[n]);
  }

  find(selectors) {
    return new jqLite(selectors, this[0]);
  }

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

  click(fn = noop) {
    this.bind('click', fn);
    return this;
  };

  ready(fn = noop) {
    window.addEventListener('DOMContentLoaded', e => {
      fn.call(this, e);
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

  remove() {
    this.each(ele=> {
      ele.remove();
    });
    this.length = 0;
    return this;
  }

  // get the element style
  style(attr) {
    return this[0].currentStyle ? this[0].currentStyle[attr] : getComputedStyle(this[0])[attr];
  }

  // (attr,value) || 'string' || {}
  css(...agm) {
    if (agm.length === 1) {
      // get style
      if (typeof agm[0] === 'string') {
        // set style as a long text
        if (/:/ig.test(agm[0])) {
          this.each(ele=> {
            ele.style.cssText = attr;
          });
        }
        else {
          return this[0].currentStyle ? this[0].currentStyle[agm[0]] : getComputedStyle(this[0])[agm[0]];
        }
      }
// set style as a object
      else {
        this.each(ele=> {
          for (let attr in agm[0]) {
            if (agm[0].hasOwnProperty(attr)) {
              ele.style[attr] = agm[0][attr];
            }
          }
        });
      }
    }
// set as (key,value)
    else if (agm.length === 2) {
      this.each(ele=> {
        ele.style[agm[0]] = agm[1];
      })
    }
    return this;
  }

  width(value) {
    let element = this[0];
    // window or document
    if (element.window === element || element.body) {
      return document.body.scrollWidth > document.documentElement.scrollWidth ?
        document.body.scrollWidth : document.documentElement.scrollWidth;
    }
    // set width
    else if (value) {
      this.each(ele=> {
        ele.style.width = value + 'px';
      });
      return this;
    }
    // get width
    else {
      return this[0].offsetWidth || parseFloat(this.style('width'));
    }
  };

  height(value) {
    let ele = this[0];
    // window or document
    if (ele.window === ele || ele.body) {
      return document.body.scrollHeight > document.documentElement.scrollHeight ?
        document.body.scrollHeight : document.documentElement.scrollHeight;
    }
    // set height
    else if (value) {
      this.each(ele=> {
        ele.style.height = value + 'px';
      });
      return this;
    }
    // get height
    else {
      return this[0].offsetHeight || parseFloat(this.style('height'));
    }
  }

  html(value) {
    if (value !== undefined) {
      this.each(ele=> {
        ele.innerHTML = typeof value === 'function' ? value(ele) : value;
      });
    } else {
      return this[0].innerHTML;
    }
    return this;
  }

  text(value) {
    if (value === undefined) return this[0].innerText || this[0].textContent;

    this.each(ele=> {
      ele.innerText = ele.textContent = value;
    });
    return this;
  }

  val(value) {
    if (value === undefined) return this[0].value;
    this.each(ele=> {
      ele.value = value;
    });
    return this;
  }

  show() {
    this.each(ele=> {
      ele.style.display = '';
    });
    return this;
  }

  hide() {
    this.each(ele=> {
      ele.style.display = 'none';
    });
    return this;
  }

// content str || jqLite Object || DOM
// here is jqLite Object
  append(content) {
    this.each(ele=> {
      ele.appendChild(content[0]);
    });
    return this;
  };

// content str || jqLite Object || DOM
// here is jqLite Object
  prepend(content) {
    this.each(ele=> {
      ele.insertBefore(content[0], ele.children[0]);
    });
    return this;
  }

  hasClass(className) {
    if (!this[0]) return false;
    return this[0].classList.contains(className);
  }

  addClass(className) {
    this.each(ele=> {
      ele.classList.add(className);
    });
    return this;
  }

  removeClass(className) {
    this.each(ele=> {
      ele.classList.remove(className);
    });
    return this;
  }

  get index() {
    let index = 0;
    let brothers = this[0].parentNode.children;
    for (let i = 0; i < brothers.length; i++) {
      if (brothers[i] == this[0]) {
        index = i;
        break;
      }
    }
    return index;
  }

  static get fn() {
    const visible = (ele)=> {
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
    const merge = (...sources) => {
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

export default $;