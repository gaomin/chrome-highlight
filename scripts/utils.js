const highlightUtil = {
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
        if (!highlightUtil.range) return;
        const parent = document.createElement('highlight');
        parent.setAttribute('style', `background-color: ${bgColor}`);
        parent.appendChild(highlightUtil.range?.extractContents());
        highlightUtil.range.insertNode(parent);
    },

    removeHightLineStyle: function (textNode) {
        const highlightNode = textNode.parentNode;
        const parentNode = highlightNode.parentNode;
        highlightNode.parentNode.insertBefore(textNode, highlightNode);
        parentNode.removeChild(highlightNode);
        parentNode.normalize();
    },

    appendToolbarNode: function () {
        const node = document.querySelector('#highlight-container');
        if (node) return;
        const container = document.createElement('div');
        container.id = 'highlight-container';
        const toolbar = document.createElement('div');
        toolbar.id = 'highlight-toolbar';
        const defaultColors = ['lightpink', 'darkseagreen', 'gold'];

        defaultColors.forEach((color) => {
            const btn = document.createElement('span');
            btn.setAttribute('class', 'highlight-toolbar-color');
            btn.setAttribute('style', `background-color: ${color}`);
            btn.addEventListener('mouseup', (event) => {
                event.stopPropagation();
                const bgColor = getComputedStyle(event.target).backgroundColor;
                highlightUtil.setHightLineStyle(bgColor);
                toolbar.style.display = 'none';
            });
            toolbar.appendChild(btn);
        });

        container.appendChild(toolbar);
        document.body.appendChild(container);
        return container;
    },

    setToolbarStyle: function (x, y) {
        const node = document.querySelector('#highlight-toolbar');
        if (!node) return;
        node.style.display = 'inline-block';
        node.style.left = x + 'px';
        node.style.top = y + 'px';
    },

    hideToolbar() {
        const node = document.querySelector('#highlight-toolbar');
        if (!node) return;
        node.style.display = 'none';

        highlightUtil.range = null;
    },

    shouldChange: function (content, newContent) {
        const regex = /<\/?highlight.*?>/g;
        const htmlContent = newContent.replaceAll(regex, '');
        return content.includes(newContent);
    },

    // TODO： 交互节点

    // TODO: 数据存储
    addStore: function () {},

    removeStore: function () {},

    getStore: function () {},
};
