(function () {
    markToolbar.appendToolbarNode();
})();

const localpath = window.location.href;
chrome.storage.local.get(localpath, (res) => {
    const store = res[localpath];
    if (store) {
        markModel.model = store;
        store.forEach((s) => {
            const { rangeInnerHTML, xpath } = s;
            const node = document.querySelector(xpath);
            if (node && rangeInnerHTML && markUtil.shouldChange(node.innerHTML, rangeInnerHTML)) {
                node.innerHTML = rangeInnerHTML;
            }
        })
    }
});

document.addEventListener('mouseup', (event) => {
    const txt = window.getSelection().toString();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const ele = range.commonAncestorContainer;
        markToolbar.hideToolbar();

        if (txt && ele.nodeType === 3) {
            const rangeBoundingClientRect = range.getBoundingClientRect();
            markToolbar.setToolbarStyle(rangeBoundingClientRect)
            markToolbar.showToolbar();
            markModel.range = range;
        }
    }
});

window.addEventListener('resize', (event) => {
    if (!markModel.range) return;
    const rangeBoundingClientRect = markModel.range.getBoundingClientRect();
    markToolbar.setToolbarStyle(rangeBoundingClientRect);
})
