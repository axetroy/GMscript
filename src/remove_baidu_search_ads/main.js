import $ from '../../libs/jqLite';
import CONFIG from './config';

class Main {

  constructor(rules = CONFIG.rules) {
    this.ads = $(rules);
    this.length = this.ads.length;
  }

  filter() {
    this.ads.each((ele, i)=> {
      ele.style.cssText = `
          display:none !important;
          visibility:hidden !important;
          width:0 !important;
          height:0 !important;
          overflow:hidden !important;
          // background-color:red !important;
          // border:1px solid red;
        `;
      ele.setAttribute('filtered', '');
    });
    return this;
  }

  turn() {
    $('#content_left input[type=checkbox]:not(filtered)').each(function (ele) {
      ele.checked = false;
      ele.setAttribute('filtered', '');
    });
    return this;
  }

}

export default Main;