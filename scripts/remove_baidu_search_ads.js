import $ from '../libs/jqLite';
import $interval from '../libs/$interval';
import Main from '../src/remove_baidu_search_ads/main';

let loop = $interval(()=> {
  new Main().filter().turn();
}, 50);

// init
$(()=> {
  new Main().filter().turn();
  $interval.cancel(loop);
  $(document).observe(() => new Main().filter().turn());
  console.info('去广告启动...');
});