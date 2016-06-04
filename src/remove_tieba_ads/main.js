import $ from '../../libs/jqLite';
import CONFIG from './config';
import $interval from '../../libs/$interval';
import {$debounce} from '../../libs/$debounce';

class main {
  constructor(agm = '') {
    if (!agm) return this;

    this.ads = $(agm);

  }

  filter() {
    this.ads.each((ele)=> {
      if (ele.$$filtered) return;
      ele.style.cssText = CONFIG.debug ? `
          border:2px solid red;
        ` : `
          display:none !important;
          visibility:hidden !important;
          width:0 !important;
          height:0 !important;
          overflow:hidden !important;
        `;
      ele.$$filtered = true;
    });
    return this;
  }

  keyword() {
    $(CONFIG.keyRules).each(function (aEle) {
      if (aEle.$$filtered) return;
      aEle.removeAttribute('data-swapword');
      aEle.removeAttribute('class');
      aEle.removeAttribute('href');
      aEle.style.cssText = CONFIG.debug ? `
          color:#fff !important;
          background-color:red !important;
        ` : `
          color:inherit !important;
        `;
      aEle.$$filtered = true;
    });
    return this;
  }

}

let loop = $interval(()=> {
  new main(CONFIG.adRules).filter().keyword();
}, 50);

console.info('贴吧去广告启动...');

$(document).bind('DOMContentLoaded', ()=> {

  $interval.cancel(loop);

  // init
  new main(CONFIG.adRules).filter().keyword();

  $(document).observe($debounce(function (target, addList, removeList) {
    if (!addList || !addList.length) return;
    new main(CONFIG.adRules).filter().keyword();
  }, 200));

  $(window).bind('scroll', $debounce(function () {
    new main(CONFIG.adRules).filter().keyword();
  }, 200));

});