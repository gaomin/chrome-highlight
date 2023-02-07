/*
 * Gets XPATH string representation for given DOM element, stolen from firebug_lite.
 * example: #content article section:nth-of-type(3) div p
 *
 * To keep paths short, the path generated tries to find a parent element with a unique
 * id, eg: #content article section:nth-of-type(3) div p
 */
const getElementXPath = function (element) {
    let paths = [],
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
            return paths.join(' ');
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
        pathIndex = index ? ':nth-of-type(' + (index + 1) + ')' : '';
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? ' ' + paths.join(' ') : null;
};


const setHightLineStyle = function (range) {
    const parent = document.createElement('highlight');
    parent.setAttribute('style', 'color:#f00;');
    parent.appendChild(range.extractContents());
    range.insertNode(parent);
};


const removeHightLineStyle = function (textNode) {
    const highlightNode = textNode.parentNode;
    const parentNode = highlightNode.parentNode;
    highlightNode.parentNode.insertBefore(textNode, highlightNode);
    parentNode.removeChild(highlightNode);
    parentNode.normalize();
};

const shouldChange = function (content, newContent) {
    const regex = /<\/?highlight.*?>/g
    const htmlContent = newContent.replaceAll(regex, '');
    return content.includes(newContent);
}


// TODO： 交互节点


// TODO: 数据存储
const addStore = function() {

}

const removeStore = function() {

}

const getStore = function() {

}