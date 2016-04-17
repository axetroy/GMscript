/**
 * Created by axetroy on 16-4-11.
 */

var header = `// ==UserScript==
// @name              remove the jump link in BAIDU (ECMA6)
// @author            axetroy
// @collaborator      axetroy
// @description       去除百度搜索跳转链接
// @version           2016.4.17
// @grant             GM_xmlhttpRequest
// @include           *www.baidu.com*
// @connect           *www.baidu.com*
// @compatible        chrome  完美运行
// @compatible        firefox  完美运行
// @supportURL        http://www.burningall.com
// @run-at            document-start
// @contributionURL   troy450409405@gmail.com|alipay.com
// @namespace         https://greasyfork.org/zh-CN/users/3400-axetroy
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// ==/UserScript==

// Github源码：https://github.com/axetroy/GMscript/tree/master/remove_baidu_redirect

/* jshint ignore:start */
`;
var footer = `

/* jshint ignore:end */
`;
module.exports = {header,footer};