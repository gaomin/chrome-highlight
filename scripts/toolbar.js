const markToolbar = {
    setHightLineStyle: function (bgColor, closeToolbar = true) {
        if (!markModel.range) return;
        const textNode = markModel.range.commonAncestorContainer;
        if (textNode.nodeType === 3) {
            if (textNode.parentNode.nodeName.toLowerCase() === 'mark') {
                textNode.parentNode.setAttribute('style', `background-color: ${bgColor}`);
            } else {
                const parent = document.createElement('mark');
                const id = markUtil.getUuid();
                parent.id = id;
                parent.setAttribute('style', `background-color: ${bgColor}`);
                parent.appendChild(markModel.range?.extractContents());
                markModel.range.insertNode(parent);
                markModel.addStore(id);
            }
        } else {
            const markNode = Array.prototype.filter.call(textNode.children, node => node.nodeName.toLowerCase() === 'mark')[0];
            if (markNode) {
                markNode.setAttribute('style', `background-color: ${bgColor}`);
            }
        }
        closeToolbar && this.hideToolbar();
    },

    removeHightLineStyle: function () {
        if (!markModel.range) return;
        const textNode = markModel.range.commonAncestorContainer;
        let markId = null;
        if (textNode.nodeType === 3 && textNode.parentNode.nodeName.toLowerCase() === 'mark') {
            const markNode = textNode.parentNode;
            const parentNode = markNode.parentNode;
            markId = markNode.id;
            parentNode.insertBefore(textNode, markNode);
            parentNode.removeChild(markNode);
            parentNode.normalize();
        } else {
            const markNode = Array.prototype.filter.call(textNode.children, node => node.nodeName.toLowerCase() === 'mark')[0];
            const newTextNode = document.createTextNode(markNode.innerHTML);
            if (markNode) {
                markId = markNode.id;
                const parentNode = markNode.parentNode;
                parentNode.insertBefore(newTextNode, markNode);
                parentNode.removeChild(markNode);
                parentNode.normalize();
            }
        }

        this.hideToolbar();
        markModel.removeStore(markId);
    },

    appendToolbarNode: function () {
        const node = document.querySelector('#mark-container');
        if (node) return;
        const container = document.createElement('div');
        container.id = 'mark-container';
        const toolbar = document.createElement('div');
        toolbar.id = 'mark-toolbar';
        toolbar.style.display = 'none';


        // set default color
        const defaultColors = ['yellow', '#f0a1a8', '#fb80b5', '#fbda41', '#fb8b05', '#93d6dc', '#57c3c2'];
        defaultColors.forEach((color) => {
            const btn = document.createElement('span');
            btn.setAttribute('class', 'mark-toolbar-color');
            btn.setAttribute('style', `background-color: ${color}`);
            btn.addEventListener('mouseup', (event) => {
                event.stopPropagation();
                const bgColor = getComputedStyle(event.target).backgroundColor;
                this.setHightLineStyle(bgColor, false);
            });
            toolbar.appendChild(btn);
        });


        // add color picker
        let styleNode;
        const colorPicker = document.createElement('input');
        colorPicker.id = 'mark-toolbar-color-picker';
        colorPicker.type = 'color';
        colorPicker.addEventListener('mouseup', (event) => {
            event.stopPropagation();
        });
        colorPicker.addEventListener("input", (event) => {
            styleNode = document.querySelector("#mark-temp-warp")
            if (!styleNode) {
                styleNode = document.createElement('style');
                styleNode.id = "mark-temp-warp"
                document.head.appendChild(styleNode);
                sheet = styleNode.sheet;
                sheet.addRule('::selection', 'background:transparent');
            }
            styleNode.disabled = false;
            const color = event.target.value;
            this.setHightLineStyle(color, false);

        }, false);

        colorPicker.addEventListener("change", (event) => {
            const color = event.target.value;
            this.setHightLineStyle(color);
            styleNode.disabled = true;
        }, false);
        toolbar.appendChild(colorPicker);

        // add clear btn
        const clearBtn = document.createElement('img');
        clearBtn.id = 'mark-toolbar-clear';
        const imgUri = chrome.runtime.getURL('../images/rubber.png');
        clearBtn.style.width = '20px';
        clearBtn.src = imgUri;
        clearBtn.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            this.removeHightLineStyle();
        });
        toolbar.appendChild(clearBtn);


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