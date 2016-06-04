let addCssByStyle = (cssString) => {
  let doc = document;
  let style = doc.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute('id', 'remove_redirect_debug');

  if (style.styleSheet) {// IE
    style.styleSheet.cssText = cssString;
  } else {// w3c
    let cssText = doc.createTextNode(cssString);
    style.appendChild(cssText);
  }

  let heads = doc.getElementsByTagName("head");
  heads.length ? heads[0].appendChild(style) : doc.documentElement.appendChild(style);
};

let $addStyle = (styleCSSText) => {
  let style = document.getElementById('remove_redirect_debug');
  !style && addCssByStyle(styleCSSText);
};

export default $addStyle;