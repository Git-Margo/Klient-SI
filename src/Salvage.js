class Salvage {
    constructor(wndEl) {
        this.wndEl = wndEl;
        this.reagentsGridSize = {
            x: 5,
            y: 2
        };
        this.maxReagentsLimit = this.reagentsGridSize.y * this.reagentsGridSize.x;
        this.selectedInventoryItems = [];
        this.reagentSlotsOld = {};
        this.reagentSlots = {};
        this.receivedItems = {};
        this.requestBlock = false;
        this.createContent();
        this.droppableInit();
        this.getEngine().tplsManager.fetch('h', this.newReceivedItem.bind(this));
        this.getEngine().disableItemsManager.startSpecificItemKindDisable('salvage');
        //this.getEngine().interfaceItems.setDisableSlots('salvage');
    }

    getSalvageTpl() {
        return $(`
		<div class="salvage">
            <div class="salvage__content">
                <div class="salvage__info">${_t('info', null, 'salvager')}</div>
                <div class="salvage__reagents items-grid">
                    <div class="salvage__label">${_t('selected', null, 'salvager')}</div>
                </div>
                <div class="salvage__receives">
                    <div class="salvage__label">${_t('result', null, 'salvager')}</div>
                </div>
                <div class="salvage__submit"></div>
            </div>
        </div>
	`);
    }

    newReceivedItem(i, finish) {
        if (!isset(this.receivedItems[i.id])) return;
        const iconEl = i.$[0];
        // $(iconEl).tip(MargoTipsParser.getTip(i), 't_item');
        this.updateAmount(i, iconEl);
        this.receivedItems[i.id]['icon'] = iconEl;
        this.receivedItems[i.id]['itemTypeSort'] = i.itemTypeSort;
        if (finish) {
            this.appendReceivedItems();
        }
    }

    appendReceivedItems() {
        const sortedTpls = this.sortTpls(this.receivedItems);

        for (let i = 0; i < sortedTpls.length; i++) {
            this.setReceivedItemSlot(sortedTpls[i].icon, i);
            this.receivesGridEl.appendChild(sortedTpls[i].icon);
        }
    }

    sortTpls(data) {
        return Object.values(data).sort((a, b) => a.itemTypeSort - b.itemTypeSort);
    }

    setReceivedItemSlot(iconEl, index) {
        const newY = Math.floor(index / 8),
            newX = index - newY * 8;
        iconEl.style.left = newX * 32 + newX + 1 + 'px';
        iconEl.style.top = newY * 32 + newY + 1 + 'px';
    }

    updateAmount(item, iconEl) {
        const amount = this.receivedItems[item.id].amount;
        this.getEngine().tplsManager.changeItemAmount(item, $(iconEl), amount);
    }

    createContent() {
        const template = this.getSalvageTpl()[0];
        this.contentEl = this.wndEl.querySelector('.salvage-content');
        this.contentEl.innerHTML = '';
        this.contentEl.appendChild(template);
        this.createConfirmButton();
        this.reagentsGridEl = this.contentEl.querySelector('.salvage__reagents');
        this.receivesGridEl = this.contentEl.querySelector('.salvage__receives');
    }

    createConfirmButton() {
        const confirmButton = drawSIButton(_t('submit', null, 'salvager'))[0];//$(drawButton(_t('submit', null, 'salvager'), this.confirmOnClick.bind(this)))[0];
        const buttonEl = this.contentEl.querySelector('.salvage__submit');
        confirmButton.classList.add('disable');
        confirmButton.addEventListener('click', this.confirmOnClick.bind(this));
        buttonEl.appendChild(confirmButton);
    }

    confirmOnClick() {
        const text = _t('confirm-prompt', null, 'salvager');

        mAlert(text, 1, [
            () => this.preSalvage(),
            () => {}
        ]);
    }

    preSalvage () {
        enhancedItemConfirmIfNeeded(this.selectedInventoryItems, () => this.doSalvage());
    }

    doSalvage() {
        if (this.selectedInventoryItems.length > 0) {
            const ids = this.selectedInventoryItems.join(",");

            _g("salvager&action=salvage&selectedItems=".concat(ids), () => {
                //this.clearAll();
            });
        }
    }

    setConfirmButton() {
        const confirmBtnEl = this.contentEl.querySelector('.salvage__submit .SI-button');

        if (Object.keys(this.reagentSlots).length > 0) {
            confirmBtnEl.classList.remove('disable');
        } else {
            confirmBtnEl.classList.add('disable');
        }
    }

    sendRequest() {
        if (this.selectedInventoryItems.length > 0) {
            const ids = this.selectedInventoryItems.join(",");
            this.requestBlock = true;

            _g(`salvager&action=preview&selectedItems=${ids}`, this.afterRequest.bind(this));
        }
    }

    afterRequest(res) {
        if (!isset(res.item_tpl && isset(res.msg)) && this.selectedInventoryItems.length > 0) {
            // remove last selected el
            this.selectedInventoryItems.pop();
        }

        this.requestBlock = false;
    }

    droppableInit() {
        // $(this.reagentsGridEl).droppable({
        //     accept: '.item',
        //     drop: (e, ui) => {
        //         var id = ui.draggable.attr('id').substr(4);
        //         this.onClickInventoryItem(g.item[id]);
        //     }
        // });
    }

    onClickInventoryItem(i) {
        if (this.requestBlock) return;
        const itemId = parseInt(i.id);

        if (!this.selectedInventoryItems.includes(itemId)) {
            if (!this.canSelectNextItem()) return;
            this.selectedInventoryItems.push(itemId);
            this.sendRequest();
        } else {
            this.reagentDelete(itemId);
        }
    }

    canSelectNextItem() {
        const selectedItemsAmount = this.selectedInventoryItems.length;
        return selectedItemsAmount < this.maxReagentsLimit;
    }

    addReagentItem(i) {
        let slot = null;

        for (var y = 0; y < this.reagentsGridSize.y; y++) {
            for (var x = 0; x < this.reagentsGridSize.x; x++) {
                if (!isset(this.reagentSlots[x + ',' + y])) {
                    slot = [x, y];
                    break;
                }
            }

            if (slot) break;
        }

        if (slot !== null) {
            this.reagentSlots[slot[0] + ',' + slot[1]] = i.id;
            let itemEl = $('#item' + i.id).clone(false)[0];
            // itemEl.dataset.item = i;
            itemEl.style.top = slot[1] * 32 + slot[1] + 1 + 'px';
            itemEl.style.left = slot[0] * 32 + slot[0] + 1 + 'px';
            this.reagentsGridEl.appendChild(itemEl);
            itemEl.addEventListener('click', () => {
                this.onClickInventoryItem(i);
                Tip.hide();
            });
            this.getEngine().itemsMovedManager.addItem(i, 'salvage', () => {
                this.onClickInventoryItem(i);
            });
        }

        this.setConfirmButton();
    }

    onReagentDelete (itemId) {
        removeFromArray(this.selectedInventoryItems, itemId);
        this.deboucedReagentDelete(itemId);
    }

    deboucedReagentDelete = debounce((itemId) => { // ugly but it's the only solution
        this.reagentDelete(itemId);
    }, 100);

    reagentDelete (itemId) { // unselect item or external - e.g. change battle set
        removeFromArray(this.selectedInventoryItems, itemId);
        if (this.selectedInventoryItems.length > 0) {
            this.sendRequest();
        } else {
            this.clearAll();
        }
    }

    removeReagentItem(itemId) {
        removeFromArray(this.selectedInventoryItems, itemId);
        this.removeReagentItemIconIfExist(itemId);
        // this.getEngine().items.deleteViewIcon(itemId, 'salvage');
        this.getEngine().itemsMovedManager.removeItem(itemId);
        this.setConfirmButton();
    }

    removeReagentItemIconIfExist (itemId) {
        const item = this.reagentsGridEl.querySelector(`#item${itemId}`);
        if (item) item.parentNode.removeChild(item);
    }

    removeAllReagentItems () {
        const items = this.reagentsGridEl.querySelectorAll('.item');
        for (const item of items) {
            item.parentNode.removeChild(item);
        }
    }

    update(v) {
        this.removeAllReceivedItems();
        this.reagentSlotsOld = this.reagentSlots;
        this.reagentSlots = {};
        const sortedReagentsIds = arrayEquals(v.item, this.selectedInventoryItems) ? this.selectedInventoryItems : v.item;

        for (const itemId of sortedReagentsIds) {
            this.removeReagentItemIconIfExist(itemId);
            //this.getEngine().items.deleteViewIconIfExist(itemId, 'salvage');
            const item = this.getEngine().item[itemId];
            this.addReagentItem(item);
        }

        for (const received of v.recived) {
            const [itemId, amount] = received;
            this.receivedItems[itemId] = {
                id: itemId,
                amount: amount,
                icon: null,
                itemTypeSort: null
            };
        }

        this.removeOldReagentItems();
    }

    removeOldReagentItems() {
        const oldIds = Object.values(this.reagentSlotsOld);
        const newIds = Object.values(this.reagentSlots);

        if (oldIds.length > newIds.length) {
            let difference = oldIds.filter(x => !newIds.includes(x));

            for (const itemId of difference) {
                this.removeReagentItem(itemId);
            }
        }
    }

    removeAllReceivedItems() {
        this.receivedItems = {};
        this.getEngine().tplsManager.deleteMessItemsByLoc('h');

        const items = this.receivesGridEl.querySelectorAll('.item');
        for (const item of items) {
            item.parentNode.removeChild(item);
        }
    }

    clearAll() {
        this.reagentSlots = {};
        this.selectedInventoryItems = [];
        this.removeAllReagentItems();
        //this.getEngine().items.deleteAllViewsByViewName('salvage');
        this.getEngine().itemsMovedManager.removeItemsByTarget('salvage');
        this.removeAllReceivedItems();
        this.setConfirmButton();
    }

    close() {
        this.clearAll();
        this.getEngine().tplsManager.removeCallback('h', this.newReceivedItem.bind(this));
        this.getEngine().disableItemsManager.endSpecificItemKindDisable('salvage');
        //this.getEngine().interfaceItems.setEnableSlots('salvage');
        this.getEngine().crafting.salvage = false;
    }

    getEngine() {
        return g;
    }

};
