const markModel = {
    _range: null,
    _model: [],

    set range(range) {
        this._range = range;
    },

    get range() {
        return this._range;
    },

    set model(model) {
        this._model = model;
    },

    get model() {
        return this._model;
    },

    getModel(id) {
        if (!id) return;
        return this.model.filter(v => v.id === id)[0];
    },

    addStore(id) {
        if (!this.range) return;
        const rangeContent = this.range.cloneContents();
        const text = rangeContent.textContent;
        const container = this.range.commonAncestorContainer;
        const xpath = markUtil.getElementXPath(container);

        const store = {
            id,
            xpath,
            startOffset: this.range.startOffset,
            endOffset: this.range.endOffset,
            rangeText: text,
            // rangeFragment: rangeContent,
            rangeInnerHTML: container.innerHTML
        };
        this.model.push(store);
        this.setStorage();
    },

    modifyStore(id) {
        if (!id) return;
        const container = this.range.commonAncestorContainer;
        const parent = container.parentNode.parentNode;
        const store = this.model.filter(v => v.id === id)[0];
        if (store) {
            store.rangeInnerHTML = parent.innerHTML;
            model = this.model.filter(v => v.id !== id);
            model.push(store);
            this.model = model;
            this.setStorage();
        }
    },

    removeStore(id) {
        if (!id) return;
        this.model = this.model.filter(v => v.id !== id);
        this.setStorage();
    },

    setStorage() {
        const path = window.location.href;
        chrome.storage.local.set({
            [path]: this.model,
        }).then(() => {
            // console.log('保存成功！', this.model);
        });
    },

    addNote(id, text) {
        if (!id) return;
        const store = this.model.filter(v => v.id === id)[0];
        if (!store) return;
        if (text) {
            if (text !== store.note) {
                store.note = text;
                const markNode = document.getElementById(id);
                if (markNode) {
                    const parent = markNode.parentNode;
                    store.rangeInnerHTML = parent.innerHTML;
                }
                this.setStorage();
            }
        } else {
            this.removeNote(id);
        }
    },

    removeNote(id) {
        if (!id) return;
        const store = this.model.filter(v => v.id === id)[0];
        if (store) {
            store.note = null;
            const markNode = document.getElementById(id);
            if (markNode) {
                const parent = markNode.parentNode;
                store.rangeInnerHTML = parent.innerHTML;
            }
            this.setStorage();
        }
    }
}