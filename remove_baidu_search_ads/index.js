'use strict';

let $ = require('./libs/jqLite');

let $interval = require('./libs/$interval');

let main = require('./src/main');

let loop = $interval(()=> {
  new main().filter().turn();
}, 50);


// init
$(()=> {
  new main().filter().turn();
  $interval.cancel(loop);
  $(window.document).observe(() => {
    new main().filter().turn();
  });
});

console.info('去广告启动...');