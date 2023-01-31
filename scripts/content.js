
const localpath = window.location.href;
chrome.storage.local.get(localpath, (res) =>{
    console.log('store', res, res[localpath]);
    const store = res[localpath];
    if (store) {
      const { startOffset, endOffset, innerHTML, xpath} = store;
      const nodes = document.querySelectorAll(xpath);
      console.log('nodes',xpath,  nodes, innerHTML);
      if (nodes.length) {
        let parent = nodes[0];
        if (parent.length > 1) {
            parent = nodes.filter(node => node.innerHTML == innerHTML)[0];
        } 
        
        console.log('parent', parent, parent.innerHTML, innerHTML);
        // parent.innerHTML = innerHTML;
        // let range = document.createRange();
        // range.setStart(parent.firstChild, startOffset);
        // range.setEnd(parent.firstChild, endOffset);
  
        // console.log('range', range);
        // const newParent = document.createElement("i");
        // newParent.setAttribute("style", "color:#f00;");
        // range.surroundContents(newParent);
      }
    }
});


document.addEventListener("mouseup", (event) => {
  console.log(window.getSelection(), window.getSelection().getRangeAt(0));

  const txt = window.getSelection().toString();
  const range = window.getSelection().getRangeAt(0);
  const localpath = window.location.href;
  const ele = range.commonAncestorContainer;
  const innerHTML = ele.innerHTML;
  console.log('xxxx', innerHTML);

  if (txt) {
    const storeObj = {
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      txt,
      xpath: '',
      innerHTML: innerHTML
    };

    // const newParent = document.createElement("i");
    // newParent.setAttribute("style", "color:#f00;");
    // newParent.appendChild(range.extractContents());
    // range.insertNode(newParent);

    const ele = range.commonAncestorContainer;
    const path = getElementXPath(ele);
    storeObj.xpath = path;
    // storeObj.innerHTML = ele.innerHTML;

    chrome.storage.local.remove([localpath])
    chrome.storage.local.set({
      [localpath]: storeObj
    }, function() {
      console.log('保存成功！', storeObj);
    })
  }
});

/*
 * Gets XPATH string representation for given DOM element, stolen from firebug_lite.
 * example: #content article section:nth-of-type(3) div p
 *
 * To keep paths short, the path generated tries to find a parent element with a unique
 * id, eg: #content article section:nth-of-type(3) div p
 */
var getElementXPath = function (element) {
  var paths = [],
    index,
    nodeName,
    tagName,
    sibling,
    pathIndex;

  for (; element && element.nodeType == 1; element = element.parentNode) {
    (index = 0), (nodeName = element.nodeName);

    if (element.id) {
      tagName = element.nodeName.toLowerCase();
      paths.splice(0, 0, '#' + element.id);
      return paths.join(" ");
    }

    for (
      sibling = element.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      if (sibling.nodeType != 1) continue;

      if (sibling.nodeName == nodeName) ++index;
    }

    tagName = element.nodeName.toLowerCase();
    pathIndex = index ? ":nth-of-type(" + (index + 1) + ")" : "";
    paths.splice(0, 0, tagName + pathIndex);
  }

  return paths.length ? " " + paths.join(" ") : null;
};
