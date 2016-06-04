import $ from '../../libs/jqLite';
import {$debounce} from '../../libs/$debounce';
import $addStyle from '../../libs/$addStyle';
import main from './main';
import init from './init';
import CONFIG from './config';

let observe = ()=> {

  $(document).observe($debounce(function (target, addList = [], removeList = []) {
    if (!addList.length) return;
    CONFIG.isDecodingAll ? new main(CONFIG.rules).oneByOne() : init();
    CONFIG.debug && $addStyle(CONFIG.debugStyle);
  }, 100))

};

export default observe;