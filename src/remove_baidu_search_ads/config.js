const CONFIG = {
  rules: `
    #content_left>div
    :not([class*=result])
    :not([class*=container])
    :not(.leftBlock)
    :not(#rs_top_new)
    :not([filtered])
    ,
    #content_left>table
    :not(.result)
    :not([filtered])
    ,
    #content_right>table td
    div#ec_im_container
    ,
    div.s-news-list-wrapper>div
    :not([data-relatewords*="1"])
    ,
    div.list-wraper dl[data-oad]
    :not([data-fb])
    :not([filtered])
  `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-zA-Z])/g, '$1')
};

export default CONFIG;