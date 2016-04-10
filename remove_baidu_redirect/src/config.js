// config
let config = {
  rules: `
      a[href*="www.baidu.com/link?url"]
      :not(.m)
      :not([decoding])
      :not([decoded])
    `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1'),
  debug: false,
  isDecodingAll: false
};

if (config.debug) {
  GM_addStyle(`
    a[decoded]{
      background-color:green !important;
      color:#303030 !important;
    };
    a[decoding]{
      background-color:yellow !important;
      color:#303030 !important;
    }
  `);
}

module.exports = config;