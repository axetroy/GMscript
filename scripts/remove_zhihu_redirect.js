/**
 * Created by axetroy on 16-6-4.
 */

import $ from '../libs/jqLite'
import {$debounce} from '../libs/$debounce';
import Main from '../src/remove_zhihu_redirect/main';

let redirect = `link.zhihu.com/?target=`;

let config = {
  rules: `
      a[href*="${redirect}"]
    `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1')
};

$(function () {
  // init
  new Main(config.rules).redirect();

  $(document).observe($debounce(function (target, addList, removeList) {
    if (!addList || !addList.length) return;
    new Main(config.rules).redirect();
  }, 200));

  $(window).bind('scroll', $debounce(function () {
    new Main(config.rules).redirect();
  }, 200));
});
