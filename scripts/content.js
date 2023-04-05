(function () {
    highlightUtil.appendToolbarNode();
})();

const localpath = window.location.href;
chrome.storage.local.get(localpath, (res) => {
    const store = res[localpath];
    // if (store) {
    //     const { startOffset, endOffset, innerHTML, xpath } = store;
    //     const node = document.querySelector(xpath);

    //     if (node && innerHTML && shouldChange(node.innerHTML, innerHTML)) {
    //         node.innerHTML = innerHTML;
    //     }
    // }
});

document.addEventListener('mouseup', (event) => {
    const txt = window.getSelection().toString();
    const range = window.getSelection().getRangeAt(0);
    const cloneRange = range.cloneRange();
    const localpath = window.location.href;
    const ele = range.commonAncestorContainer;

    highlightUtil.hideToolbar();
    if (txt && ele.nodeType === 3) {
        const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        highlightUtil.setToolbarStyle(scrollLeft + event.clientX, scrollTop + event.clientY);

        if (ele.parentNode.nodeName === 'HIGHLIGHT') {
            console.log('remove highlight !!!');
            highlightUtil.removeHightLineStyle(ele);
        } else {
            console.log('set highlight !!!');

            const storeObj = {
                startOffset: range.startOffset,
                endOffset: range.endOffset,
                txt,
                xpath: '',
                innerHTML: '',
            };

            highlightUtil.setRange(range);

            // const ele = range.commonAncestorContainer;
            // const innerHTML = ele.innerHTML;
            // const path = getElementXPath(ele);

            // storeObj.xpath = path;
            // storeObj.innerHTML = innerHTML;

            // chrome.storage.local.remove([localpath]);
            // chrome.storage.local.set(
            //     {
            //         [localpath]: storeObj,
            //     },
            //     function () {
            //         // console.log('保存成功！', storeObj);
            //     }
            // );
        }
    }
});
