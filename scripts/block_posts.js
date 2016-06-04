import $ from '../libs/jqLite';
import svg from '../src/block_posts/icon';
import Panel from '../src/block_posts/panel';
import common from '../src/block_posts/common';

const panel = new Panel();
const POSITION = common.getPosition();

let initCount = 0;
let $icon = $(document.createElement("a")).addClass('block-icon').html(svg);
const init = ()=> {
  if (POSITION === 'post') {
    initCount++;
    $('.p_postlist .l_post').each((post)=> {
      let $name = $(post).find('.d_author ul.p_author li.d_name');
      if (!$name[0]) return;

      let id = $name.find('a[data-field].p_author_name').text().trim();

      if (!id) return;

      let icon = $icon[0].cloneNode(true);

      if (GM_listValues().indexOf(id) > -1) return post.remove();

      if ($name.find('svg').length) return;

      $(icon).click(()=> {
        let [bar,reason] = [common.getBarName(), '在帖子中选择'];

        GM_setValue(id, {id, bar, reason, date: new Date()});
        $('.p_postlist .l_post').each(ele=> {
          let username = $(ele).attr('data-field').replace(/\'/g, '"');
          if (!username) return;
          username = JSON.parse(username).author.user_name || JSON.parse(username).author.name_u;
          username = username.replace(/\&ie\=.*$/ig, '');
          username = decodeURI(username);
          if (username === id) ele.remove();
        });
      });

      $name[0].appendChild(icon);

    })
  }
  else if (POSITION === 'list') {
    let interval = setInterval(()=> {
      let postList = $('ul#thread_list li[data-field].j_thread_list');
      if (!postList.length) return;

      clearInterval(interval);
      initCount++;
      postList.each(post=> {
        let $name = $(post).find('.j_threadlist_li_right .tb_icon_author');
        if (!$name[0]) return;

        let id = $name.find('a[data-field].frs-author-name').text().trim();
        let icon = $icon[0].cloneNode(true);

        if (GM_listValues().indexOf(id) > -1) return post.remove();

        $(icon).click(()=> {
          let [bar,reason] = [common.getBarName(), '贴吧首页选择'];
          if (!id) return;
          GM_setValue(id, {id, bar, reason, date: new Date()});

          $('ul#thread_list li[data-field].j_thread_list').each(_post=> {
            let username = $(_post).find('a[data-field].frs-author-name').text().trim();
            if (!username) return;
            if (username === id) _post.remove();
          });

        });

        $name[0].appendChild(icon);

      })
    }, 100);
  }
};

$(()=> {

  GM_registerMenuCommand("控制面板", panel.create);
  GM_addStyle(require("!style!css!sass!./../src/block_posts/style.scss"));

  $(document).bind('keyup', (e)=> {
    if (e.keyCode === 120) panel.create();
  });

  init();

  $(document).observe((target, addedNodes = [], removedNodes = [])=> {

    addedNodes = Array.from(addedNodes);

    // if (!addedNodes || !addedNodes.length || removedNodes.length) return;


    addedNodes.forEach((node)=> {
      // 翻页
      if (node.id === 'content_leftList' || node.id === 'j_p_postlist') {
        initCount > 0 && init();
      }
    });

    // 楼中楼翻页
    if (target && $(target).hasClass('j_lzl_m_w')) {

      let $lzlList = $(target).find('li.lzl_single_post');

      $lzlList.each(lzl=> {
        let $lzl = $(lzl);
        if ($lzl.attr('filter')) return;

        $lzl.attr('filter', true);
        let id = JSON.parse($lzl.attr('data-field').replace(/\'/g, '"')).user_name;
        id = decodeURI(id);

        if (!id) return;

        if (GM_listValues().indexOf(id) > -1) return lzl.remove();

        let $name = $lzl.find('.lzl_cnt');

        if ($name.find('svg').length) return;

        let icon = $icon[0].cloneNode(true);

        $(icon).click(e=> {
          let [bar,reason] = [common.getBarName(), '楼中楼选择'];

          GM_setValue(id, {id, bar, reason, date: new Date()});

          $lzlList.each(_lzl=> {
            let username = $(_lzl).find('div.lzl_cnt a.j_user_card').text().trim();
            if (!username) return;
            if (username === id) _lzl.remove();
          });

        });
        $lzl.find('.lzl_content_reply')[0].appendChild(icon);
        // $name[0].insertBefore(icon, $name[0].childNodes[0]);
      });
    }

    //
    let $lzlList = $('ul.j_lzl_m_w');
    if (!$lzlList.length) return;

    $lzlList.each(lzls=> {
      if ($(lzls).attr('filter')) return;

      $(lzls).attr('filter', true);

      $(lzls).find('li.lzl_single_post').each(lzl=> {
        let $lzl = $(lzl);
        let $name = $lzl.find('.lzl_cnt');

        if ($name.find('svg').length) return;

        let icon = $icon[0].cloneNode(true);

        let id = JSON.parse($lzl.attr('data-field').replace(/\'/g, '"')).user_name;

        if (GM_listValues().indexOf(id) > -1) return lzl.remove();

        if (!id) return;

        $(icon).click(e=> {
          let [bar,reason] = [common.getBarName(), '楼中楼选择'];
          GM_setValue(id, {id, bar, reason, date: new Date()});
          // 删除当前楼中楼的
          $lzlList.each(_lzl=> {
            let $floor = $(_lzl).find('div.lzl_cnt');
            $floor.each(_post=> {
              let username = $(_post).find('a.j_user_card').text().trim();
              if (!username) return;
              if (username === id) _post.parentElement.remove();
            });
          });
          // 删除帖子里面楼层的
          init();
        });
        // $name[0].insertBefore(icon, $name[0].childNodes[0]);
        // $name[0].insertBefore(icon, $lzl.find('.lzl_content_reply'));
        // $lzl.find('.lzl_content_reply')[0].insertBefore(icon, $lzl.find('.lzl_content_reply')[0].childNodes[1])
        $lzl.find('.lzl_content_reply')[0].appendChild(icon);
      });
    })

  });

});