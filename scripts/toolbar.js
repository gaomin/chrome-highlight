const markToolbar = {
    setHightLineStyle(bgColor, closeToolbar = true) {
        if (!markModel.range) return;
        const textNode = markModel.range.commonAncestorContainer;
        if (textNode.nodeType === 3) {
            if (textNode.parentNode.nodeName.toLowerCase() === 'gmmark') {
                const id = textNode.parentNode.id;
                textNode.parentNode.setAttribute('style', `background-color: ${bgColor}; display: inline`);
                markModel.modifyStore(id);
            } else {
                const parent = document.createElement('gmmark');
                const id = markUtil.getUuid();
                parent.id = id;
                parent.setAttribute('style', `background-color: ${bgColor}; display: inline`);
                parent.appendChild(markModel.range.extractContents());
                markModel.range.insertNode(parent);
                markModel.addStore(id);
            }
        } else {
            const markNode = Array.prototype.filter.call(textNode.children, node => node.nodeName.toLowerCase() === 'gmmark')[0];
            if (markNode) {
                const id = markNode.id;
                markNode.setAttribute('style', `background-color: ${bgColor}; display: inline`);
                markModel.modifyStore(id);
            }
        }
        closeToolbar && this.hideToolbar();
    },

    removeHightLineStyle() {
        if (!markModel.range) return;
        const textNode = markModel.range.commonAncestorContainer;
        let markId = null;
        if (textNode.nodeType === 3 && textNode.parentNode.nodeName.toLowerCase() === 'gmmark') {
            const markNode = textNode.parentNode;
            const parentNode = markNode.parentNode;
            markId = markNode.id;
            parentNode.insertBefore(textNode, markNode);
            parentNode.removeChild(markNode);
            parentNode.normalize();
        } else {
            const markNode = Array.prototype.filter.call(textNode.children, node => node.nodeName.toLowerCase() === 'gmmark')[0];
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

    setHightLineNoteStyle(markId, text) {
        const markNode = document.getElementById(markId);
        if (markNode) {
            if (text) {
                markNode.setAttribute('class', 'hasNote');
                markNode.setAttribute('title', text);
            } else {
                markNode.removeAttribute('class');
                markNode.removeAttribute('title');
            }
        }
    },

    getMarkId() {
        if (!markModel.range) return;
        const textNode = markModel.range.commonAncestorContainer;
        let markId = null;
        if (textNode.nodeType === 3 && textNode.parentNode.nodeName.toLowerCase() === 'gmmark') {
            const markNode = textNode.parentNode;
            markId = markNode.id;
        } else {
            const markNode = Array.prototype.filter.call(textNode.children, node => node.nodeName.toLowerCase() === 'gmmark')[0];
            if (markNode) {
                markId = markNode.id;
            }
        }
        // console.log(markId);
        return markId;
    },

    appendNode() {
        const node = document.querySelector('#gmmark-container');
        if (node) return;
        const container = document.createElement('div');
        container.id = 'gmmark-container';
        const toolbar = document.createElement('div');
        toolbar.id = 'gmmark-toolbar';
        toolbar.style.display = 'none';

        // set default color, 备选颜色: '#fbda41',
        const defaultColorBtns = this.createDeafultColor();
        // add color picker
        const colorPicker = this.createColorPicker();
        // add notes 
        const notes = this.createNotes();
        // add clear btn
        const clearBtn = this.createClearBtn();

        toolbar.append(...defaultColorBtns, colorPicker, notes, clearBtn);

        const noteBox = this.createNoteBox();

        container.append(toolbar, noteBox);
        document.body.append(container);

        return container;
    },

    createNoteBox() {
        const noteBox = document.createElement('div');
        noteBox.id = 'gmmark-notebox';
        noteBox.style.display = 'none';

        const okBtn = document.createElement('button');
        okBtn.id = "gmmark-notebox-ok";
        okBtn.textContent = 'OK'
        okBtn.type = 'button';
        okBtn.addEventListener('click', () => {
            const areaNode = document.querySelector('#gmmark-notebox-text');
            if (areaNode) {
                const markId = this.getMarkId();
                const text = areaNode.value.trim();
                this.setHightLineNoteStyle(markId, text);
                markModel.addNote(markId, text);
                noteBox.style.display = 'none';
            }
        });

        const textarea = document.createElement('textarea');
        textarea.id = 'gmmark-notebox-text'
        textarea.rows = '3';
        textarea.value = '';

        noteBox.append(okBtn, textarea);
        return noteBox;
    },


    setNoteBoxStyle(x, y) {
        const node = document.querySelector('#gmmark-notebox');
        if (!node) return;
        const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        node.style.display = 'block';
        node.style.left = scrollLeft + x + 'px';
        node.style.top = scrollTop + y + 'px';
    },

    createNotes() {
        const notes = document.createElement('img');
        notes.id = 'gmmark-toolbar-notes';
        const imgUri = chrome.runtime.getURL('../images/notes.svg');
        notes.style.width = '20px';
        notes.src = imgUri;
        notes.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            const { clientX, clientY } = event;
            this.setNoteBoxStyle(clientX, clientY);
            const markId = this.getMarkId();
            const model = markModel.getModel(markId);

            if (model) {
                const textarea = document.querySelector('#gmmark-notebox-text');
                const { note = '' } = model;
                textarea.value = note;
            }
        });

        return notes;
    },

    createDeafultColor() {
        const defaultColors = ['yellow', '#f0a1a8', '#fb80b5', '#fb8b05', '#93d6dc', '#57c3c2'];
        const nodes = [];
        defaultColors.forEach((color) => {
            const btn = document.createElement('span');
            btn.setAttribute('class', 'gmmark-toolbar-color');
            btn.setAttribute('style', `background-color: ${color}`);
            btn.addEventListener('mouseup', (event) => {
                event.stopPropagation();
                const bgColor = getComputedStyle(event.target).backgroundColor;
                this.setHightLineStyle(bgColor, false);
            });
            nodes.push(btn);
        });

        return nodes;
    },

    createColorPicker() {
        let styleNode;
        const colorPicker = document.createElement('input');
        colorPicker.id = 'gmmark-toolbar-color-picker';
        colorPicker.type = 'color';
        colorPicker.addEventListener('mouseup', (event) => {
            event.stopPropagation();
        });
        colorPicker.addEventListener("change", (event) => {
            styleNode = document.querySelector("#gmmark-temp-warp")
            if (!styleNode) {
                styleNode = document.createElement('style');
                styleNode.id = "gmmark-temp-warp"
                document.head.appendChild(styleNode);
                sheet = styleNode.sheet;
                sheet.addRule('::selection', 'background:transparent');
            }
            styleNode.disabled = false;
            const color = event.target.value;
            this.setHightLineStyle(color, false);

        }, false);

        colorPicker.addEventListener("change", (event) => {
            styleNode.disabled = true;
        }, false);

        return colorPicker;
    },


    createClearBtn() {
        const clearBtn = document.createElement('img');
        clearBtn.id = 'gmmark-toolbar-clear';
        const imgUri = chrome.runtime.getURL('../images/rubber.png');
        clearBtn.style.width = '20px';
        clearBtn.src = imgUri;
        clearBtn.addEventListener('mouseup', (event) => {
            event.stopPropagation();
            this.removeHightLineStyle();
        });
        return clearBtn;
    },

    setToolbarStyle: function ({ top, right, bottom }) {
        const node = document.querySelector('#gmmark-toolbar');
        if (!node) return;
        const toolbarWidth = 70;
        const toolbarHeight = 70;
        const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const maxWidth = document.body.clientWidth;
        const maxHeight = window.innerHeight + scrollTop;

        const posx = scrollLeft + right + toolbarWidth > maxWidth ? maxWidth - toolbarWidth : scrollLeft + right;
        const posy = scrollTop + bottom + toolbarHeight > maxHeight ? scrollTop + top - toolbarHeight : scrollTop + bottom;
        node.style.left = posx + 15 + 'px';
        node.style.top = posy + 'px';
    },

    showToolbar() {
        const node = document.querySelector('#gmmark-toolbar');
        if (!node) return;
        node.style.display = 'grid';
    },

    hideToolbar() {
        const node = document.querySelector('#gmmark-toolbar');
        if (!node) return;
        node.style.display = 'none';
    },


}