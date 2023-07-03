const markList = {
    appendNode() {
        const node = document.querySelector('#gmmark-list');
        if (node) return;
        const container = document.querySelector('#gmmark-container');
        const listNode = document.createElement('div');
        listNode.id = 'gmmark-list';

        const icon = this.createIcon();
        const list = this.createList();

        listNode.append(icon, list)
        container.append(listNode);
    },

    createIcon() {
        const icon = document.createElement('img');
        icon.id = 'gmmark-list-icon';
        const imgUri = chrome.runtime.getURL('../images/list.svg');
        icon.src = imgUri;
        return icon;
    },


    createList() {
        const list = document.createElement('div');
        list.id = 'gmmark-list-nodes';

        const localpath = window.location.href;
        chrome.storage.local.get(localpath, (res) => {
            const store = res[localpath];
            if (store) {
                const cards = store.map(s => this.createCard(s));
                list.append(...cards);
            }
        });

        return list;
    },

    createCard(data) {
        const { rangeText } = data;
        const node = document.createElement('div');
        node.className = 'gmmark-list-node';
        const html = `
            <span class="gmmark-list-node-bg"></span>
            <span>${rangeText}</span>
        `;
        node.innerHTML = html;
        return node;
    },


}