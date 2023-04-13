(function () {
    markUtil.appendToolbarNode();
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

    markUtil.hideToolbar();
    if (txt && ele.nodeType === 3) {

        if (ele.parentNode.nodeName === 'mark') {
            console.log('remove mark !!!');
            markUtil.removeHightLineStyle(ele);
        } else {
            console.log('set mark !!!');
            const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            markUtil.setToolbarStyle(scrollLeft + event.clientX, scrollTop + event.clientY);
            markUtil.showToolbar();

            const storeObj = {
                startOffset: range.startOffset,
                endOffset: range.endOffset,
                txt,
                xpath: '',
                innerHTML: '',
            };

            markUtil.setRange(range);

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
