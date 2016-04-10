/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

let $ = require('../libs/jqLite');
let main = require('./main');


let mouseoverDebounce = $.fn.debounce((e) => {
  let aEle = e.target;

  if (aEle.tagName !== "A"
    || !aEle.href
    || !/www\.baidu\.com\/link\?url=/im.test(aEle.href)
    || !!$(aEle).attr('decoded')
  ) {
    return;
  }

  new main().one(aEle);
  
}, 100);

let mouseover = function () {
  return ()=> {
    $(document).bind('mouseover', (e) => {
      mouseoverDebounce(e);
    });
  }
};

module.exports = mouseover();



