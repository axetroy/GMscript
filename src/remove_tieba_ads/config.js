const CONFIG = {
  // 是否是调试模式
  debug: false,
  adRules: `
      ul#thread_list *[data-daid],
      ul#thread_list>li:not([data-field]):not(.thread_top_list_folder)
      ,
      #j_p_postlist *[data-daid],
      #j_p_postlist *[data-isautoreply]
      ,
      #thread_list>li
      :not([class*="list"])
      :not([data-field])
      ,
      .p_postlist>div
      :not(.p_postlist)
      :not([class*="post"])
      :not([data-field])
      ,
      #aside *[data-daid],
      #aside>div[class*="clearfix"],
      #aside DIV[id$="ad"],
      #aside #encourage_entry,
      .my_app,.j_encourage_entry，
      .right_section>div.u9_aside,
      .right_section>div.clearfix,
      .right_section *[data-daid]
      ,
      #pb_adbanner,#pb_adbanner *[data-daid]
      ,
      #com_u9_head,
      .u9_head,
      div.search_form>div[class*="clearfix"]
      ,
      .firework-wrap
    `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-z\*])/ig, '$1'),
  keyRules: `
      #j_p_postlist a[data-swapword]:not([filted]),
      #j_p_postlist a.ps_cb:not([filted])
    `.trim().replace(/\n/img, '').replace(/\s{1,}([^a-z\*])/ig, '$1')
};

export default CONFIG;