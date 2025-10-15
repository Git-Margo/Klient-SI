class BonusReselectWindow {
  constructor() {
    this.selectedItem = null;
    this.requestBlock = false;
    this.receivedTpls = {};
    this.getEngine().lock.add('bonus-reselect');
    this.initWindow();
    this.createContent();
    this.createConfirmButton();
    this.getEngine().tplsManager.fetch('w', this.newReceivedItem.bind(this));
    this.getEngine().disableItemsManager.startSpecificItemKindDisable('bonus-reselect');

    this.windowOpen();
  }

  getWindowTpl()  {
    return $(`
      <div class="bonus-reselect-wnd__content">
        <div class="enhance__info enhance__info--1">
          <div class="info-icon"></div>
          <div class="enhance__info--top">${_t('bonus-reselect-info', null, 'enhancement')}</div>
        </div>
        <div class="bonus-reselect-wnd__item"></div>
        <div class="bonus-reselect-wnd__finalize">
          <div class="enhance__info">${_t('bonus-reselect-info2', null, 'enhancement')}</div>
          <div class="bonus-reselect-wnd__require"></div>
          <div class="bonus-reselect-wnd__buttons"></div>
        </div>
      </div>
    `)[0]
  }

  initWindow() {
    this.contentEl = this.getWindowTpl();
    this.wndEl = $('#bonus-reselect-wnd')[0]
    this.contentWrapperEl = this.wndEl.querySelector('.bonus-reselect-wnd__content');
    this.contentWrapperEl.innerHTML = '';
    this.contentWrapperEl.appendChild(this.contentEl);

    const closeEl = this.wndEl.querySelector('.close-but');
    closeEl.addEventListener('click', this.close.bind(this));

    this.setTitle();
  }

  setTitle() {
    const title = goldTxt(this.tLang('bonus-reselect-title'), true);
    this.wndEl.querySelector('.bonus-reselect-wnd__title').innerHTML = title;
  };

  createContent() {
    this.selectedItemSlotEl = this.contentEl.querySelector('.bonus-reselect-wnd__item');
    this.requireItemSlotEl = this.contentEl.querySelector('.bonus-reselect-wnd__require');
    this.buttonsContainerEl = this.contentEl.querySelector('.bonus-reselect-wnd__buttons');
  }

  newReceivedItem(item) {
    const iconEl = isset(item.$) ? item.$[0] : createItem(item)[0];
    this.updateAmount(item, iconEl);
    this.requireItemSlotEl.appendChild(iconEl);
  }

  updateAmount(item, iconEl) {
    const amount = this.receivedTpls[item.id];
    if (amount > 0) this.getEngine().tplsManager.changeItemAmount(item, $(iconEl), amount);
  }

  onClickInventoryItem(i) {
    // click or drop on grid
    if (this.requestBlock) return;
    const itemId = parseInt(i.id);

    if (this.selectedItem === itemId) {
      this.clearAll();
      return;
    }

    if (!this.selectedItem) {
      this.sendPreviewRequest(itemId);
      return;
    }

    if (i.st !== 0) return;
  }

  sendPreviewRequest(itemId) {
    this.requestBlock = true;

    _g("bonus_reselect&action=status&item=".concat(itemId));
  }

  sendReselectRequest() {
    _g("bonus_reselect&action=apply&item=".concat(this.selectedItem), v => {
      if (!isset(v.message)) {
        this.close();
      }
    });
  }

  afterUpdateSelectedItem (item) {
    this.addItemToExtract();
  }

  addItemToExtract() {
    let item = this.getEngine().item[this.selectedItem];
    let itemEl = $('#item' + item.id).clone(false)[0];
    itemEl.style.top = null;
    itemEl.style.left = null;

    itemEl.addEventListener('click', () => {
      this.onClickInventoryItem(item);
    });
    this.getEngine().itemsMovedManager.addItem(item, 'bonus-reselect', () => {
      this.onClickInventoryItem(item);
    });
    this.dimRestart();
    // item.on('delete', () => this.clearAll());
    this.selectedItemSlotEl.innerHTML = '';
    this.selectedItemSlotEl.appendChild(itemEl);
  }

  removeSelectedItem () {
    this.selectedItemSlotEl.innerHTML = '';
  }

  removeRequireItems () {
    this.requireItemSlotEl.innerHTML = '';
  }

  createConfirmButton() {
    const opts = {
      text: this.tLang('bonus-reselect-submit'),
      classes: ['small', 'green'],
      action: this.confirmOnClick.bind(this),
      disabled: true
    };
    this.submitBtn = new Button(opts);
    this.buttonsContainerEl.appendChild(this.submitBtn.getButton());
  }

  confirmOnClick() {
    const text = this.tLang('confirm-prompt');

    mAlert(text, 1, [
      () => this.sendReselectRequest(),
      () => {}
    ]);
  }

  setStateConfirmButton(statusResponse) {
    if (this.checkRequiresItemsAmount(statusResponse)) {
      this.submitBtn.setState(false);
    } else {
      this.submitBtn.setState(true);
    }
  }

  checkRequiresItemsAmount({
    ingredientItemQuantity,
    ingredientItemTplId
  }) {
    const itemsAmount = checkItemsAmount(ingredientItemTplId);
    return itemsAmount >= ingredientItemQuantity;
  }

  update(v) {
    if (isset(v.status)) {
      this.requestBlock = false;
      const {
        ingredientItemQuantity,
        ingredientItemTplId,
        itemId
      } = v.status;
      this.selectedItem = itemId;
      this.addItemToExtract();
      this.receivedTpls[ingredientItemTplId] = ingredientItemQuantity;
      this.setStateConfirmButton(v.status);
    }
  }

  dimRestart() {
    this.getEngine().disableItemsManager.endSpecificItemKindDisable('bonus-reselect');
    this.getEngine().disableItemsManager.startSpecificItemKindDisable('bonus-reselect');
  }

  windowOpen() {
    this.wndEl.style.display = 'block';
    this.opened = true;

    // $(this.wndEl).absCenter();
    this.wndEl.style.top = '90px';
    this.wndEl.style.left = '86px';
  }

  windowClose() {
    this.wndEl.style.display = 'none';
    this.opened = false;
  }

  close() {
    this.windowClose();
    this.clearAll();
    this.getEngine().disableItemsManager.endSpecificItemKindDisable('bonus-reselect');
    this.getEngine().tplsManager.fetch('w', this.newReceivedItem.bind(this));
    this.getEngine().bonusReselectWindow = false;
    this.getEngine().lock.remove('bonus-reselect');
  }

  tLang(name, category = 'enhancement') {
    return _t(name, null, category);
  }

  clearAll() {
    this.selectedItem = null;
    this.removeSelectedItem();
    this.removeRequireItems();
    this.getEngine().tplsManager.deleteMessItemsByLoc('w');
    // this.getEngine().items.deleteAllViewsByViewName('bonus-reselect-item');
    this.getEngine().itemsMovedManager.removeItemsByTarget('bonus-reselect');
    this.submitBtn.setState(true);
  }

  getEngine() {
    return g;
  }

};
