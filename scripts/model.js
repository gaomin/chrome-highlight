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

    addStore: function (id) {
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
        console.log('add', this.model)
        this.setStorage();
    },

    removeStore: function (id) {
        if (!id) return;
        this.model = this.model.filter(v => v.id !== id);
        console.log('delete', this.model);
        this.setStorage();
    },

    setStorage: function () {
        const path = window.location.href;
        chrome.storage.local.set({
            [path]: this.model,
        }).then(() => {
            console.log('保存成功！', this.model);
        });
    },
}