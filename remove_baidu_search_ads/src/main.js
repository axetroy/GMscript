/**
 * Created by axetroy on 16-4-12.
 */

let $ = require('../libs/jqLite');
let config = require('./config');

class main {

  constructor(rules = config.rules) {
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

module.exports = main;