import $ from '../../libs/jqLite';
import {$debounce} from '../../libs/$debounce';
import $addStyle from '../../libs/$addStyle';
import main from './main';
import CONFIG from './config';

let scroll = ()=> {
  $(window).bind('scroll', $debounce(function () {
    new main(CONFIG.rules).oneByOne();
    CONFIG.debug && $addStyle(CONFIG.debugStyle);
  }, 100));
};

export default scroll;