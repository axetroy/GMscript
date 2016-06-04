
const common = {
  // 获取当前所在的位置，是贴吧列表，还是贴吧内容页
  getPosition(){
    const url = location.href;
    const postInside = /.*tieba.baidu.com\/p\/.*/ig;
    const postList = /.*tieba.baidu.com\/(f\?.*|[^p])/ig;
    return postInside.test(url) ? 'post' : postList.test(url) ? 'list' : null;
  },
  // 获取当前页的贴吧名
  getBarName(){
    return $(".card_title_fname").text().trim();
  }
};

export default common;
