window.onload = function () {
    markToolbar.appendNode();
    // markList.appendNode();
}

const localpath = window.location.href;
chrome.storage.local.get(localpath, (res) => {
    const store = res[localpath];
    // console.log(store);
    if (store) {
        markModel.model = store;
        store.forEach((s) => {
            const { rangeInnerHTML, xpath, rangeText } = s;
            const $node = $(xpath).filter((index, elem) => elem.innerText.includes(rangeText));
            if ($node.length > 1) {
                $node.each((index, elem) => {
                    if (elem && rangeInnerHTML && markUtil.shouldChange(elem.innerHTML, rangeInnerHTML)) {
                        $(elem).html(rangeInnerHTML);
                    }
                })
            } else {
                if ($node && rangeInnerHTML && markUtil.shouldChange($node.html(), rangeInnerHTML)) {
                    $node.html(rangeInnerHTML);
                }
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
            const { top, bottom, right } = rangeBoundingClientRect;
            const { x, y } = event;
            const lineHeight = parseInt($(ele.parentElement).css('line-height'));
            const newBottom = lineHeight && (bottom - top > lineHeight) ? top + lineHeight : bottom;
            markToolbar.setToolbarStyle({ top, right: Math.min(x, right), bottom: y > newBottom ? bottom : newBottom });
            markToolbar.showToolbar();
            markModel.range = range;
        }
    }
});

window.addEventListener('resize', (event) => {
    if (!markModel.range) return;
    const rangeBoundingClientRect = markModel.range.getBoundingClientRect();
    const ele = markModel.range.commonAncestorContainer;
    const { top, bottom, right } = rangeBoundingClientRect;
    const lineHeight = parseInt($(ele.parentElement).css('line-height'));
    const newBottom = lineHeight && (bottom - top > lineHeight) ? top + lineHeight : bottom;
    markToolbar.setToolbarStyle({ top, right, bottom: newBottom });
})

document.addEventListener('mouseup', (event) => {
    const markNode = document.querySelector('#gmmark-notebox');
    const toolbarNote = document.querySelector('#gmmark-toolbar-notes');
    if (event.target && !(event.target === toolbarNote || (markNode && event.target === markNode) || (markNode && markNode.contains(event.target)))) {
        const node = document.querySelector('#gmmark-notebox');
        if (node) {
            node.style.display = 'none';
        }
    }
})
