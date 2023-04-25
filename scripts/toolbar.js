const markToolbar = {
    range: null,
    setRange: function (_range) {
        this.range = _range;
    },

    setHightLineStyle: function (bgColor) {
        if (!markToolbar.range) return;
        const textNode = markToolbar.range.commonAncestorContainer;
        if (textNode.parentNode.nodeName.toLowerCase() === 'mark') {
            textNode.parentNode.setAttribute('style', `background-color: ${bgColor}`);
        } else {
            const parent = document.createElement('mark');
            parent.setAttribute('style', `background-color: ${bgColor}`);
            parent.appendChild(markToolbar.range?.extractContents());
            markToolbar.range.insertNode(parent);
        }
        markToolbar.hideToolbar();
    },

    removeHightLineStyle: function () {
        const txt = window.getSelection().toString();
        const range = window.getSelection().getRangeAt(0);
        const textNode = range.commonAncestorContainer;

        if (txt && textNode.nodeType === 3 && textNode.parentNode.nodeName.toLowerCase() === 'mark') {
            const markNode = textNode.parentNode;
            const parentNode = markNode.parentNode;
            markNode.parentNode.insertBefore(textNode, markNode);
            parentNode.removeChild(markNode);
            parentNode.normalize();
        }

        markToolbar.hideToolbar();
    },

    appendToolbarNode: function () {
        const node = document.querySelector('#mark-container');
        if (node) return;
        const container = document.createElement('div');
        container.id = 'mark-container';
        const toolbar = document.createElement('div');
        toolbar.id = 'mark-toolbar';
        toolbar.style.display = 'none';

        // add clear btn
        const clearBtn = document.createElement('img');
        clearBtn.id = 'mark-toolbar-clear';
        const imgUri = chrome.runtime.getURL('../images/rubber.png');
        clearBtn.style.width = '20px';
        clearBtn.src = imgUri;
        clearBtn.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            markToolbar.removeHightLineStyle();
        });
        toolbar.appendChild(clearBtn);


        // set color pickers
        const defaultColors = ['lightpink', 'darkseagreen', 'gold'];
        defaultColors.forEach((color) => {
            const btn = document.createElement('span');
            btn.setAttribute('class', 'mark-toolbar-color');
            btn.setAttribute('style', `background-color: ${color}`);
            btn.addEventListener('mouseup', (event) => {
                event.stopPropagation();
                console.log(window.getSelection().toString())
                const bgColor = getComputedStyle(event.target).backgroundColor;
                markToolbar.setHightLineStyle(bgColor);
            });
            toolbar.appendChild(btn);
        });

        container.appendChild(toolbar);
        document.body.appendChild(container);

        return container;
    },

    setToolbarStyle: function (x, y) {
        const node = document.querySelector('#mark-toolbar');
        if (!node) return;

        node.style.left = x + 'px';
        node.style.top = y + 'px';
    },

    showToolbar() {
        const node = document.querySelector('#mark-toolbar');
        if (!node) return;
        node.style.display = 'grid';
    },

    hideToolbar() {
        const node = document.querySelector('#mark-toolbar');
        if (!node) return;
        node.style.display = 'none';
    },


}