// libs
import $ from '../../libs/jqLite';
import {$debounce} from '../../libs/$debounce';
import main from './main';

let mouseover = ()=> {
  $(document).bind('mouseover', $debounce(function (e) {
    let aEle = e.target;
    if (aEle.tagName !== "A"
      || !aEle.href
      || !/www\.baidu\.com\/link\?url=/im.test(aEle.href)
      || !!$(aEle).attr('decoded')
    ) {
      return;
    }
    new main().one(aEle);
  }, 100, true));
};

export default mouseover;
