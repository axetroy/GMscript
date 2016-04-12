/**
 * Created by axetroy on 16-4-11.
 */

var header = `// ==UserScript==
// @name              去百度搜索置顶推广 (ECMA6)
// @author            axetroy
// @contributor       axetroy
// @description       去除插入在百度搜索结果头部、尾部的推广链接。
// @version           2016.4.12
// @grant             none
// @include           *www.baidu.com*
// @include           *zhidao.baidu.com/search*
// @connect           *
// @supportURL        http://www.burningall.com
// @compatible        chrome  完美运行
// @compatible        firefox  完美运行
// @run-at            document-start
// @contributionURL   troy450409405@gmail.com|alipay.com
// @namespace         https://greasyfork.org/zh-CN/users/3400-axetroy
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// ==/UserScript==

// Github源码：https://github.com/axetroy/GMscript/tree/master/remove_baidu_search_ads

/* jshint ignore:start */
`;
var footer = `

/* jshint ignore:end */`;

module.exports = {header,footer};