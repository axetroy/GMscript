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
      aEle.href = aEle.href.trim().replace(/^.*link\.zhihu\.com\/\?target=(.*?)$/im, '$1')
        .trim().replace(/^\s*http[^\/]*\/\//, 'http://');
    });
    return this;
  }

}

export default Main