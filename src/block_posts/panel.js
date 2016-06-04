/**
 * Created by axetroy on 5/10/16.
 */

import $ from '../../libs/jqLite';
import formatDate from './formatDate';
import common from './common';

class Panel {
  constructor() {

  }

  create() {
    if ($('#block-mask').length) return;
    let root = document.createElement('div');

    this.$mask = $(root.cloneNode(false)).attr('id', 'block-mask');
    this.$panel = $(root.cloneNode(false))
      .attr('id', 'block-panel')
      .html(require('./panel.html'));

    this.$mask.append(this.$panel);

    this.$menu = this.$panel.find('.block-menu ul li');
    this.$session = this.$panel.find('.block-content .session');
    this.$config = this.$session.eq(0);
    this.$block = this.$session.eq(1);
    this.$list = this.$session.eq(2);

    this.init();
    this.link();

    document.documentElement.appendChild(this.$mask[0]);
    return this;
  }

  remove() {
    this.$mask.remove();
  }

  link() {
    let _this = this;

    // 屏蔽列表的点击事件
    this.$list.click((e)=> {
      let $target = $(e.target);
      let index = +$target.attr('list-index');
      let blockID = $target.attr('block-id');

      this.$list.find('table>tbody>tr').each((ele)=> {
        if ($(ele).find('.block-remove').attr('block-id') === blockID) {
          ele.remove();
          GM_deleteValue(blockID);
        }
      });

    });

    // 控制面板的切换
    this.$menu.click((e)=> {
      let index = $(e.target).index;
      this.$menu.removeClass('active').eq(index).addClass('active');
      this.$session.hide().eq(index).show();
      return false;
    });

    // 点击屏蔽按钮
    // block someone
    this.$block.find('.block-block-submit').click(e=> {

      let [$id,$bar,$reason] = ['id', 'bar', 'reason'].map(name=> {
        return this.$block.find(`.block-${name}`);
      });

      let [id,bar,reason] = [$id, $bar, $reason].map(input=> {
        return input.val();
      });

      if (!id) return;
      GM_setValue(id, {id, bar, reason, date: new Date()});
      $id.val('');
      $reason.val('');
    });

    // 关掉控制面板
    this.$mask.click((e)=> {
      if ($(e.target).attr('id') === 'block-mask') this.remove();
    });

  }

  init() {
    this.$menu.eq(0).addClass('active');
    this.$session.hide().eq(0).show();
    this.$panel.find('.block-bar').val(common.getBarName());

    this.$list.html(()=> {
      let GMList = GM_listValues();
      let list = [];

      for (let i = 0; i < GMList.length; i++) {
        list[i] = GM_getValue(GMList[i]);
      }

      let tableStr = '';

      list.forEach((v, i)=> {
        let time = '';
        if (v.date) {
          let date = new Date(v.date);
          time = formatDate(date, 'yyyy-MM-dd');
        }
        tableStr += `
            <tr>
              <td>${v.id}</td>
              <td>${v.bar}</td>
              <td>${v.reason}</td>
              <td>${time}</td>
              <td>
                <a class="block-remove btn" href="javascript:void(0)" block-id="${v.id}" list-index="${i}">移除</a>
              </td>
            </tr>
          `;
      });

      return `
          <table>
            <thead>
              <tr>
                <th><b>贴吧ID</b></th>
                <th><b>所在贴吧</b></th>
                <th><b>屏蔽理由</b></th>
                <th><b>屏蔽时间</b></th>
                <th><b>操作</b></th>
              </tr>
            </thead>
            <tbody>
              ${tableStr}
            </tbody>
          </table>
        `;
    });

  }

}

export default Panel;