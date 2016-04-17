/**
 * Created by axetroy on 16-4-10.
 */

'use strict';

// libs
let $ = require('../../libs/jqLite');
let $debounce = require('../../libs/$debounce').$debounce;

let main = require('./main');

let mouseoverDebounce = $debounce(e=> {
  let aEle = e.target;
  if (aEle.tagName !== "A"
    || !aEle.href
    || !/www\.baidu\.com\/link\?url=/im.test(aEle.href)
    || !!$(aEle).attr('decoded')
  ) {
    return;
  }
  new main().one(aEle);
}, 100, true);

let mouseover = ()=> {
  $(document).bind('mouseover', e => {
    mouseoverDebounce(e);
  });
};

module.exports = mouseover;



