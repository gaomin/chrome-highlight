(function () {
    markToolbar.appendToolbarNode();
})();

const localpath = window.location.href;
chrome.storage.local.get(localpath, (res) => {
    const store = res[localpath];
    if (store) {
        markModel.model = store;
        store.forEach((s) => {
            const { startOffset, endOffset, rangeInnerHTML, rangeText, xpath } = s;
            const node = document.querySelector(xpath);
            console.log(startOffset, endOffset, rangeInnerHTML, rangeText, xpath, node);
            if (node && rangeInnerHTML && markUtil.shouldChange(node.innerHTML, rangeInnerHTML)) {
                node.innerHTML = rangeInnerHTML;
                console.log(node.innerHTML)
            }
        })
    }
});

document.addEventListener('mouseup', (event) => {
    const txt = window.getSelection().toString();
    const range = window.getSelection().getRangeAt(0);
    const ele = range.commonAncestorContainer;
    markToolbar.hideToolbar();

    if (txt && ele.nodeType === 3) {
        const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        markToolbar.setToolbarStyle(scrollLeft + event.clientX, scrollTop + event.clientY);
        markToolbar.showToolbar();

        markModel.range = range;
    }
});
