class Extraction {
  constructor(wndEl) {
    this.wndEl = wndEl;
    this.receivedCounter = 0;
    this.receivedTpls = {};
    this.selectedExtractItem = null;
    this.requestBlock = false;
    this.createContent();
    this.droppableInit();
    // this.getEngine().items.fetch(
    //   this.getEngine().itemsFetchData.NEW_EXTRACTION_RECEIVED_ITEM,
    //   this.newReceivedItem.bind(this),
    // );
    // this.getEngine().tpls.fetch(
    //   this.getEngine().itemsFetchData.NEW_EXTRACTION_RECEIVED_TPL,
    //   this.newReceivedItem.bind(this),
    // );
    this.getEngine().tplsManager.fetch('j', this.newReceivedItem.bind(this));
    this.getEngine().disableItemsManager.startSpecificItemKindDisable('extraction');
    // this.getEngine().interfaceItems.setDisableSlots('extraction');
  }

  getEnhancementTpl() {
    return $(`
        <div class='extraction'>
            <div class='extraction__content'>
                <div class='scroll-wrapper classic-bar'>
                    <div class='crafting__bg'></div>
                    <div class='scroll-pane'>
                        <div class='extraction__content-inner'>
                            <div class='extraction__info'>${_t('info', null, 'extraction')}</div>
                            <div class='extraction__item items-grid'></div>
                            <div class='extraction__receives'>
                            <div class='extraction__label'>${_t('result', null, 'extraction')}</div>
                            </div>
                            <div class='extraction__payment'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `)[0];
  }

  createContent() {
    const template = this.getEnhancementTpl();
    this.contentEl = this.wndEl.querySelector('.extraction-content');
    this.contentEl.innerHTML = '';
    this.contentEl.appendChild(template);
    this.extractItemSlot = this.contentEl.querySelector('.extraction__item');
    this.extractItemSlotReceive = this.contentEl.querySelector('.extraction__receives');

    const paymentsEl = this.contentEl.querySelector('.extraction__payment');
    this.paymentSelector = new PaymentSelector({
      infobox: this.tLang('info2'),
      submit: {
        btnText: this.tLang('submit_btn'),
        btnOnClick: (selectedPayment, value) => this.confirmOnClick(selectedPayment, value)
      },
      hidden: true
    });
    paymentsEl.appendChild(this.paymentSelector.getComponent())
  }

  confirmOnClick (selectedCurrency, value) {
    const
      val = selectedCurrency === 'gold' ?
        {'%val%': formNumberToNumbersGroup(value), '%val2%': _t('cost_gold')} :
        {'%val%': formNumberToNumbersGroup(value), '%val2%': _t('cost_credits')},
      costInfo = this.tLang('extract_cost %val%', 'extraction', val),
      confirmInfo = this.tLang('confirm-prompt'),
      text = parseBasicBB(costInfo) + confirmInfo;

    mAlert(text, 1, [
      () => this.sendExtractRequest(selectedCurrency),
      () => {}
    ]);
  }

  sendExtractRequest (selectedPayment) {
    const extractItem = this.selectedExtractItem;
    _g(`extractor&action=extract&currency=${selectedPayment}&item=${extractItem}`)
  }

  droppableInit() {
    $(this.extractItemSlot).droppable({
      accept: '.inventory-item',
      drop: (e, ui) => {
        ui.draggable.css('opacity', '');
        this.onClickInventoryItem(ui.draggable.data('item'));
      },
    });
  }

  newReceivedItem(item) {
    const iconEl = isset(item.$) ? item.$[0] : createItem(item)[0];
    this.setReceivedItemSlot(iconEl, this.receivedCounter);

    if (!isset(item.tpl)) {
      this.updateAmount(item, iconEl);
    }

    this.extractItemSlotReceive.appendChild(iconEl);
    this.receivedCounter++;
  }

  updateAmount(item, iconEl) {
    const amount = this.receivedTpls[item.id];
    if (amount > 0) this.getEngine().tplsManager.changeItemAmount(item, $(iconEl), amount);
  }

  setReceivedItemSlot(iconEl, index) {
    const newY = Math.floor(index / 8),
      newX = index - newY * 8;
    iconEl.style.left = newX * 32 + newX + 1 + 'px';
    iconEl.style.top = newY * 32 + newY + 1 + 'px';
  }

  sendPreviewRequest() {
    if (!this.selectedExtractItem) return;
    this.requestBlock = true;

    _g('extractor&action=preview&item='.concat(this.selectedExtractItem), this.afterPreviewRequest.bind(this));
  }

  afterPreviewRequest({ extractor }) {
    this.requestBlock = false;

    if (isset(extractor) && isset(extractor.preview)) {
      this.addItemToExtract();
    } else {
      this.selectedExtractItem = null;
    }
  }

  addItemToExtract() {
    let item = this.getEngine().item[this.selectedExtractItem];
    let itemEl = $('#item' + item.id).clone(false)[0];
    itemEl.style.top = null;
    itemEl.style.left = null;
    itemEl.addEventListener('click', () => {
      this.onClickInventoryItem(item);
    });
    this.getEngine().itemsMovedManager.addItem(item, 'extraction', () => {
      this.onClickInventoryItem(item);
    });
    // item.on('delete', () => this.clearAll());
    this.extractItemSlot.innerHTML = '';
    this.extractItemSlot.appendChild(itemEl);
    // item.on('afterUpdate', () => this.extractItemAfterUpdate(item.id));
    this.extractItemAfterUpdate(item.id);
  }

  extractItemAfterUpdate(itemId) {}

  onClickInventoryItem(i) {
    if (this.requestBlock) return;
    const itemId = parseInt(i.id);

    if (!this.selectedExtractItem) {
      this.selectedExtractItem = itemId;
      this.sendPreviewRequest();
      return;
    }

    if (this.selectedExtractItem === itemId) {
      this.clearAll();
      return;
    }

    if (i.st !== 0) return;
  }

  update(v) {
    this.requestBlock = false;
    if (isset(v.completed)) {
      setTimeout(() => this.clearAll(), 100)
    }
    if (isset(v.preview)) {
      const { ingredientItemTplId, ingredientItemAmount, progressItemTplId, progressItemAmount, prices } = v.preview;
      if (ingredientItemTplId) this.receivedTpls[ingredientItemTplId] = ingredientItemAmount;
      this.receivedTpls[progressItemTplId] = progressItemAmount;
      this.paymentSelector.updatePayments(prices);
    }
  }

  dimRestart() {
    this.getEngine().disableItemsManager.endSpecificItemKindDisable('extraction');
    this.getEngine().disableItemsManager.startSpecificItemKindDisable('extraction');
  }

  removeExtractItem () {
    this.extractItemSlot.innerHTML = '';
  }

  removeExtractReceiveItems () {
    this.extractItemSlotReceive.innerHTML = '';
  }

  clearAll() {
    this.selectedExtractItem = null;
    this.paymentSelector.reset();
    this.getEngine().tplsManager.deleteMessItemsByLoc('j');
    // this.getEngine().items.deleteMessItemsByLoc('j');
    // this.getEngine().items.deleteAllViewsByViewName('extraction-item');
    this.removeExtractItem();
    this.removeExtractReceiveItems();
    this.getEngine().itemsMovedManager.removeItemsByTarget('extraction');
    this.dimRestart();
    this.receivedCounter = 0;
  }

  close() {
    this.clearAll();
    this.paymentSelector.destroy();
    this.getEngine().disableItemsManager.endSpecificItemKindDisable('extraction');
    // this.getEngine().interfaceItems.setEnableSlots('extraction');
    this.getEngine().crafting.extraction = false;
  }

  tLang(name, category = 'extraction', params = null) {
    return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, params, category) : '';
  }

  getEngine() {
    return g;
  }
}
