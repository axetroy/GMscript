import $ from '../../libs/jqLite';

class Main {
  constructor(agm = '') {
    if (!agm) return this;
    this.inViewPort = [];

    $(agm).each((aEle) => {
      if ($.fn.visible(aEle)) this.inViewPort.push(aEle);
    });
  }

  redirect() {
    $(this.inViewPort).each(function (aEle) {
      if (!aEle || !aEle.href) return;
      let href = aEle.href.trim().replace(/^.*link\.zhihu\.com\/\?target=(.*?)$/im, '$1')
        .trim().replace(/^\s*http[^\/]*\/\//, 'http://');
      href = decodeURIComponent(href);
      aEle.href = href;
    });
    return this;
  }

}

export default Main