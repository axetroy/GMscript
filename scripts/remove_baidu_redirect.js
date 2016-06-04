import $ from '../libs/jqLite';
import init from '../src/remove_baidu_redirect/init';
import observe from '../src/remove_baidu_redirect/observe';
import mouseover from '../src/remove_baidu_redirect/mouseover';
import scroll from '../src/remove_baidu_redirect/scroll';

$(()=> {

  // init
  init();

  // observe the document
  observe();

  // when mouse over on a A Tag and request
  mouseover();

  // scroll and request
  scroll();

  console.info('去baidu搜索跳转链接启动');

});