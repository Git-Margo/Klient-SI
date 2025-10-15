class Enhancement {
  constructor(wndEl) {
    this.wndEl = wndEl;
    this.selectedEnhanceItem = null;
    this.requestBlock = false;
    this.RT = {
      SET_ENHANCE_ITEM: 'SET_ENHANCE_ITEM',
      CHECK_PROGRESS: 'CHECK_PROGRESS',
      ENCHANT: 'ENCHANT',
      UPGRADE: 'UPGRADE'
    };
    this.createContent();
    // this.getEngine().items.fetch('u', this.newReceivedItem.bind(this));
    // this.getEngine().disableItemsManager.startSpecificItemKindDisable('enhance');
    this.dimStartDefault();
    // this.getEngine().interfaceItems.setDisableSlots('enhance');
  }

  getEnhancementTpl() {
      return $(`
      <div class="enhance">
          <div class="enhance__content">
              <div class="crafting__bg"></div>
              <div class="enhance__info enhance__info--top mt-0">
                  <div class="enhance__info--1">
                      <div class="info-icon" data-trans="data-tip#info_tip#enhancement"></div>
                      <div class="enhance__info--top">${_t('info', null, 'enhancement')}</div>
                  </div>
                  <div class="enhance__info--3">
                      <div class="enhance__info--top">${_t('info3', null, 'enhancement')}</div>
                  </div>
              </div>
              <div class="enhance__top">
                  <div class="enhance__item enhance__item--current">
                      <div class="slot"></div>
                      <div class="lvl"></div>
                  </div>
                  <div class="enhance__progressbar">
                      <div class="enhance__progress-bg"></div>
                      <div class="enhance__progress enhance__progress--current"></div>
                      <div class="enhance__progress enhance__progress--preview"></div>
                      <div class="enhance__progress-text enhance__progress-text--current"></div>
                      <div class="enhance__progress-text enhance__progress-text--preview"></div>
                  </div>
                  <div class="enhance__item enhance__item--receive">
                      <div class="slot"></div>
                      <div class="lvl"></div>
                  </div>
              </div> 
              
              <div class="enhance__enchant">
                  <div class="enhance__info enhance__info--top">${_t('info5', null, 'enhancement')}</div>
                  <div class="enhance__autofiller"></div>
                  <div class="enhance__reagents items-grid disabled">
                      <div class="enhance__label">${_t('selected', null, 'enhancement')}</div>
                  </div>
                  <div class="enhance__limit">
                      <span>${_t('limit', null, 'enhancement')}</span>:
                      <span class="enhance__counter"></span>
                  </div> 
                  <div class="enhance__submit"></div> 
              </div>
              
              <div class="enhance__enhance">
                      <div class="enhance__bonus"></div>
                      <div class="enhance__requires">
                          <div class="enhance__r-gold">
                              <div class="enhance__r-gold-icon"></div>
                              <div class="enhance__r-gold-amount"></div>
                          </div>
                          <div class="enhance__r-item"></div>
                      </div>
                      <div class="enhance__submit2"></div> 
                  </div>
          </div>
      </div>`);
  }

  createContent() {
    const template = this.getEnhancementTpl()[0];
    this.contentEl = this.wndEl.querySelector('.enhancement-content');
    this.contentEl.innerHTML = '';
    this.contentEl.appendChild(template);
    this.topInfoEl = this.contentEl.querySelector('.enhance__info--top');
    this.enhanceItemSlotCurrent = this.contentEl.querySelector('.enhance__item--current .slot');
    this.enhanceItemSlotCurrentLvl = this.contentEl.querySelector('.enhance__item--current .lvl');
    this.enhanceItemSlotReceive = this.contentEl.querySelector('.enhance__item--receive .slot');
    this.enhanceItemSlotReceiveLvl = this.contentEl.querySelector('.enhance__item--receive .lvl');

    const enchantEl = this.contentEl.querySelector('.enhance__enchant');
    this.enchant = new Enchant(enchantEl);

    const progressbarEl = this.contentEl.querySelector('.enhance__progressbar');
    this.progressbar = new Progressbar(progressbarEl);

    const upgradeEl = this.contentEl.querySelector('.enhance__enhance');
    this.upgrade = new Upgrade(upgradeEl);
  }

  newReceivedItem(item) {
    const iconEl = createItem(item)[0];
    // const iconEl = this.getEngine().items.createViewIcon(i.id, 'enhance-require-item', 'u')[0][0];
    this.enhanceItemSlotReceive.appendChild(iconEl);
    this.receivedItemAfterUpdate(item);
  }

  receivedItemAfterUpdate (item) {
    this.setUpgradeLvl( true, item);
  }

  setUpgradeLvl (received = true, item) {
    let itemUpgradeLvlEl = received ? this.enhanceItemSlotReceiveLvl : this.enhanceItemSlotCurrentLvl;
    let upgradeLvl = parseInt(isset(item) && isset(parseItemStat(item.stat).enhancement_upgrade_lvl) ? parseItemStat(item.stat).enhancement_upgrade_lvl : 0)
    let oldUpgradeLvl = parseInt(itemUpgradeLvlEl.getAttribute('data-lvl'));
    if (upgradeLvl !== oldUpgradeLvl) {
      // this.changeLvlAnim();
      itemUpgradeLvlEl.setAttribute('data-lvl', upgradeLvl)
      itemUpgradeLvlEl.innerHTML = upgradeLvl ? upgradeLvl : '';
    }
  }

  // changeLvlAnim () {
  //   this.enhanceItemSlotReceiveLvl.classList.add('upper');
  //   setTimeout(() => {
  //     this.enhanceItemSlotReceiveLvl.classList.remove('upper');
  //   }, 200)
  // }

  sendRequest(requestType, selectedInventoryItems = [], callback) {
    if (!this.selectedEnhanceItem) return;
    const reagentIds = selectedInventoryItems.join(",");

    switch (requestType) {
      case this.RT.SET_ENHANCE_ITEM:
        this.requestBlock = true;
        _g(`enhancement&action=status&item=${this.selectedEnhanceItem}`, this.afterRequest.bind(this));
        break;

      case this.RT.CHECK_PROGRESS:
        this.requestBlock = false;
        _g(`enhancement&action=progress_preview&item=${this.selectedEnhanceItem}&ingredients=${reagentIds}`, () => {
          if (callback) callback();
          this.requestBlock = false;
        });
        break;

      case this.RT.ENCHANT:
        _g(`enhancement&action=progress&item=${this.selectedEnhanceItem}&ingredients=${reagentIds}`, callback);
        break;
      // case this.RT.UPGRADE:
      //   _g(`enhancement&action=upgrade&item=${this.selectedEnhanceItem}`, callback);
      //   break;
    }
  }

  afterRequest({
    enhancement
  }) {
    this.requestBlock = false;

    if (isset(enhancement) && isset(enhancement.upgradable || enhancement.progressing || enhancement.completed)) {
      this.addItemToEnchant();
    }
  }

  afterUpdateEnhanceItem (item) {
    // console.log(item);
    this.addItemToEnchant();
  }

  addItemToEnchant() {
    // let item = this.getEngine().items.getItemById(this.selectedEnhanceItem);
    let item = this.getEngine().item[this.selectedEnhanceItem];

    // let itemEl = this.getEngine().items.createViewIcon(item.id, 'enhance-item')[0][0];
    let itemEl = $('#item' + item.id).clone(false)[0];
    itemEl.style.top = null;
    itemEl.style.left = null;
    itemEl.addEventListener('click', () => {
      this.onClickInventoryItem(item);
    });
    this.getEngine().itemsMovedManager.addItem(item, 'enhance', () => {
      this.onClickInventoryItem(item);
    });
    this.enhanceItemSlotCurrent.innerHTML = '';
    this.enhanceItemSlotCurrent.appendChild(itemEl);
    this.setUpgradeLvl(false, item);
    this.dimStartIngredients();
  }

  onEmptyReagents() {
    this.sendRequest(this.RT.SET_ENHANCE_ITEM);
    // this.progressbar.update({
    //   preview: 0
    // });
  }

  onClickInventoryItem(i) {
    if (this.requestBlock) return;
    const itemId = parseInt(i.id);

    if (!this.selectedEnhanceItem) {
      this.selectedEnhanceItem = itemId;
      this.sendRequest(this.RT.SET_ENHANCE_ITEM);
      return;
    }

    if (this.selectedEnhanceItem === itemId) {
      this.clearAll();
      return;
    }

    if (i.st !== 0) return;
    this.enchant.onClickReagent(i);
  }

  update(v) {
    this.requestBlock = false;
    this.enchant.setReagentsDisableState(false);
    this.enchant.setEnchantConfirmButton();

    if (isset(v.progressing)) {
      this.progressbar.update({ current: v.progressing.current, max: v.progressing.max, upgradeLevel: v.progressing.upgradeLevel });
      this.enchant.clearReagents();
    }

    if (isset(v.progress_preview)) {
      this.progressbar.update({ gained: v.progress_preview.gained, current: v.progress_preview.current, max: v.progress_preview.max, upgradeLevel: v.progress_preview.upgradeLevel });
    }

    if (isset(v.upgradable)) {
      this.enchant.reset();
      this.progressbar.update({ current: v.upgradable.current, max: v.upgradable.max, upgradeLevel: v.upgradable.upgradeLevel });
      this.upgrade.update({ data: v.upgradable, disable: false });
      this.enchant.setReagentsDisableState(true);
      // if (v.upgradable.upgradeLevel === 4) {
      this.enchant.setEnchantDisableState(true);
      this.setTopInfo(true);
      // }
    }

    if (isset(v.completed)) {
      this.onCompleted();
    }
    if (isset(v.usages_preview)) {
      this.getEngine().enhanceUsages = v.usages_preview;
      this.enchant.updateUsages(this.getEngine().enhanceUsages);
    }
  }

  setTopInfo(isChooseBonus = false) {
    isChooseBonus ? this.topInfoEl.classList.add('is-bonus') : this.topInfoEl.classList.remove('is-bonus');
  }

  onCompleted() {
    this.enchant.update({ disable: true });
    this.upgrade.update({ disable: true });
    this.progressbar.completed();
    this.removeEnhancementReceiveItem(); // remove preview item
    this.upgradeLvlReset();
  }

  dimStartDefault () {
    this.getEngine().disableItemsManager.endSpecificItemKindDisable('enhance-ingr');
    this.getEngine().disableItemsManager.startSpecificItemKindDisable('enhance');
  }

  dimStartIngredients () {
    this.getEngine().disableItemsManager.endSpecificItemKindDisable('enhance');
    this.getEngine().disableItemsManager.startSpecificItemKindDisable('enhance-ingr');
  }

  removeEnhancementItem () {
    this.enhanceItemSlotCurrent.innerHTML = '';
  }

  removeEnhancementReceiveItem () {
    this.enhanceItemSlotReceive.innerHTML = '';
  }

  upgradeLvlReset () {
    this.setUpgradeLvl(true);
    this.setUpgradeLvl(false);
  }

  clearAll() {
    this.selectedEnhanceItem = null;
    this.progressbar.reset();
    this.upgrade.reset();
    this.enchant.reset();
    this.setTopInfo();
    // this.getEngine().items.deleteMessItemsByLoc('u');
    this.removeEnhancementItem();
    this.removeEnhancementReceiveItem();
    // this.getEngine().items.deleteAllViewsByViewName('enhance-item');
    this.getEngine().itemsMovedManager.removeItemsByTarget('enhance');
    this.getEngine().itemsMovedManager.removeItemsByTarget('enhance-ingr');
    this.upgradeLvlReset();
    this.dimStartDefault();
  }

  close() {
    this.clearAll();
    this.upgrade.destroy();
    this.enchant.destroy();
    // this.getEngine().items.removeCallback('u', this.newReceivedItem);
    this.getEngine().disableItemsManager.endSpecificItemKindDisable('enhance');
    this.getEngine().disableItemsManager.endSpecificItemKindDisable('enhance-ingr');
    // this.getEngine().interfaceItems.setEnableSlots('enhance');
    this.getEngine().crafting.enhancement = false;
  }

  tLang(name, category = 'enhancement') {
    return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, null, category) : '';
  }

  getEngine() {
    return g;
  }

}
