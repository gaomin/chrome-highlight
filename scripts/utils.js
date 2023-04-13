const markUtil = {
    range: null,
    setRange: function (_range) {
        this.range = _range;
    },
    /*
     * Gets XPATH string representation for given DOM element, stolen from firebug_lite.
     * example: #content article section:nth-of-type(3) div p
     *
     * To keep paths short, the path generated tries to find a parent element with a unique
     * id, eg: #content article section:nth-of-type(3) div p
     */
    getElementXPath: function (element) {
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

            for (sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                if (sibling.nodeType != 1) continue;

                if (sibling.nodeName == nodeName) ++index;
            }

            tagName = element.nodeName.toLowerCase();
            pathIndex = index ? ':nth-of-type(' + (index + 1) + ')' : '';
            paths.splice(0, 0, tagName + pathIndex);
        }

        return paths.length ? ' ' + paths.join(' ') : null;
    },

    setHightLineStyle: function (bgColor) {
        if (!markUtil.range) return;
        const parent = document.createElement('mark');
        parent.setAttribute('style', `background-color: ${bgColor}`);
        parent.appendChild(markUtil.range?.extractContents());
        markUtil.range.insertNode(parent);
    },

    removeHightLineStyle: function (textNode) {
        const markNode = textNode.parentNode;
        const parentNode = markNode.parentNode;
        markNode.parentNode.insertBefore(textNode, markNode);
        parentNode.removeChild(markNode);
        parentNode.normalize();
    },

    appendToolbarNode: function () {
        const node = document.querySelector('#mark-container');
        if (node) return;
        const container = document.createElement('div');
        container.id = 'mark-container';
        const toolbar = document.createElement('div');
        toolbar.id = 'mark-toolbar';

        // add clear btn
        const clearBtn = document.createElement('img');
        clearBtn.id = 'mark-toolbar-clear';
        const imgUri = chrome.runtime.getURL('../images/rubber.png');
        clearBtn.style.width = '20px';
        clearBtn.src = imgUri;
        toolbar.appendChild(clearBtn);


        // set color pickers
        const defaultColors = ['lightpink', 'darkseagreen', 'gold'];
        defaultColors.forEach((color) => {
            const btn = document.createElement('span');
            btn.setAttribute('class', 'mark-toolbar-color');
            btn.setAttribute('style', `background-color: ${color}`);
            btn.addEventListener('mouseup', (event) => {
                event.stopPropagation();
                const bgColor = getComputedStyle(event.target).backgroundColor;
                markUtil.setHightLineStyle(bgColor);
                toolbar.style.display = 'none';
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

        markUtil.range = null;
    },

    shouldChange: function (content, newContent) {
        const regex = /<\/?mark.*?>/g;
        const htmlContent = newContent.replaceAll(regex, '');
        return content.includes(newContent);
    },

    // TODO： 交互节点


};
