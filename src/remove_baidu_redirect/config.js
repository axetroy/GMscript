// config
let CONFIG = {
  rules: `
      a[href*="www.baidu.com/link?url"]
      :not(.m)
      :not([decoding])
      :not([decoded])
    `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1'),
  debug: false,
  debugStyle: `
  a[decoded]{
    background-color:green !important;
    color:#303030 !important;
  };
  a[decoding]{
    background-color:yellow !important;
    color:#303030 !important;
  }
  `,
  isDecodingAll: false
};

export default CONFIG;