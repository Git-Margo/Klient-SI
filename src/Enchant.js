class Enchant {
  constructor(el) {
    this.el = el;
    this.reagentsGridSize = {
      x: 5,
      y: 2
    };
    this.maxReagentsLimit = this.reagentsGridSize.y * this.reagentsGridSize.x;
    this.reagentSlots = {};
    this.addReagentsBlock = true;
    this.selectedInventoryItems = [];
    this.createContent();
    this.droppableInit();
  }

  createContent() {
    this.createAutofiller();
    this.createConfirmButton();
    this.reagentsGridEl = this.el.querySelector('.enhance__reagents');
    this.usageCounterEl = this.el.querySelector('.enhance__counter');
    if (this.getEngine().enhanceUsages) this.updateUsages(this.getEngine().enhanceUsages);
  }

  createAutofiller () {
    this.autofillerEl = this.el.querySelector('.enhance__autofiller');
    const autofillerOptions = {
      btnTip: (i) => _t('advanced_craftsman_choose_bag %val%', {'%val%': i}),
      btnFn: (items) => this.autofillFrom(items),
      storageName: 'ENCHANT_AUTOFILLER',
      filters: {
        cl: [
          { key: 1, checked: true, groupId: 1 },
          { key: 2, checked: true, groupId: 1 },
          { key: 3, checked: true, groupId: 1 },
          { key: 4, checked: true, groupId: 1 },
          { key: 5, checked: true, groupId: 1 },
          { key: 6, checked: true, groupId: 1 },
          { key: 7, checked: true, groupId: 1 },
          { key: 8, checked: true, groupId: 1 },
          { key: 9, checked: true, groupId: 1 },
          { key: 10, checked: true, groupId: 1 },
          { key: 11, checked: true, groupId: 1 },
          { key: 12, checked: true, groupId: 1 },
          { key: 13, checked: true, groupId: 1 },
          { key: 14, checked: true, groupId: 1 },
          { key: 29, checked: true, groupId: 1 },
        ],
        // rarity: Object.keys(itemRarity).map(rarity => ({ key: rarity, checked: true, groupId: 2 })),
      },
      configWindow: {
        title: _t('advanced_craftsman'),
        heading: this.tLang('info6'),
        cssClass: '',
        groups: [
          { id: 1,  title: _t('itemKinds', null, 'autofiller') },
          // { id: 2,  title: _t('itemKinds', null, 'autofiller') }
        ],
      },
      itemGrabberOptions: {
        allow: {
          cls: [],
          stats: [
            { name: 'rarity', params: ['===', 'common']},
            // ['rarity', ['includes', ['common', 'legendary']]],
            { name: 'lvl', params: ['>=', 20]}
          ],
        },
        deny: {
          stats: ['artisan_worthless'],
        }
      }
    }
    this.autofiller = new Autofiller(autofillerOptions);
    this.autofiller.disabled();
    this.autofillerEl.appendChild(this.autofiller.getContent());
  }

  autofillFrom (items) {
    this.addManyReagentItems(items);
  }

  droppableInit() {
    $(this.reagentsGridEl).droppable({
      accept: '.inventory-item',
      drop: (e, ui) => {
        ui.draggable.css('opacity', '');
        this.onClickReagent(ui.draggable.data('item'));
      }
    });
  }

  onClickReagent(i) {
    if (this.addReagentsBlock || this.getEnhancement().requestBlock) return;
    const itemId = i.id;

    if (!this.selectedInventoryItems.includes(itemId)) {
      if (!this.canSelectNextItem()) return;
      this.selectedInventoryItems.push(itemId);
      // i.on('delete', () => {
      //   this.removeReagentItem(itemId);
      // });
      this.sendReagentsRequest(i);
    } else {
      this.reagentDelete(itemId, true);
    }
  }

  isCorrectReagent (i) {
    const enhancedItem = this.getEngine().item[this.getEnhancement().selectedEnhanceItem];
    if (enhancedItem.id === i.id) return false;

    const hasTargetRarity = checkItemStat(i, 'target_rarity');
    const itemStats = parseItemStat(i.stat);
    return !hasTargetRarity || (hasTargetRarity && itemStats['target_rarity'] === enhancedItem.itemTypeName);
  }

  onReagentDelete (itemId) {
    removeFromArray(this.selectedInventoryItems, itemId);
    this.deboucedReagentDelete(itemId);
  }

  deboucedReagentDelete = debounce((itemId) => { // ugly but it's the only solution
    this.reagentDelete(itemId);
  }, 10);

  reagentDelete (itemId, byClick = false) { // unselect item or external - e.g. change battle set
    const i = g.item[itemId];
    removeFromArray(this.selectedInventoryItems, itemId);
    if (this.selectedInventoryItems.length > 0) {
      this.sendReagentsRequest(i, false);
    } else {
      this.removeReagentItem(itemId);
      if (byClick) this.onEmptyReagents();
    }
  }

  onEmptyReagents() {
    this.getEnhancement().onEmptyReagents();
  }

  sendReagentsRequest(i, addItem = true) {
    this.getEnhancement().sendRequest(this.getEnhancement().RT.CHECK_PROGRESS, this.selectedInventoryItems, () => {
      if (addItem) {
        this.addReagentItem(i);
      } else {
        if (isset(i)) this.removeReagentItem(i.id);
      }
    }); // this.sendRequest(this.RT.ADD_COMPONENT_ITEM);
  }

  addManyReagentItems (items) {
    let i = 0;
    for (const item of items) {
      if (this.isCorrectReagent(item) && !this.isReagentItemIsSelectedAlready(item.id) && this.canSelectNextItem()) {
        i++;
        this.selectedInventoryItems.push(item.id);
        this.addReagentItem(item);
      }
    }

    if (i > 0) {
      this.getEnhancement().sendRequest(this.getEnhancement().RT.CHECK_PROGRESS, this.selectedInventoryItems);
    }
  }

  isReagentItemIsSelectedAlready (itemId) {
    return this.selectedInventoryItems.includes(itemId);
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
      let itemEl = $('#bagc #item' + i.id).clone(false)[0];
      // let itemEl = this.getEngine().items.createViewIcon(i.id, 'enhance-reagent')[0][0];
      itemEl.dataset.item = i;
      itemEl.style.top = slot[1] * 32 + slot[1] + 1 + 'px';
      itemEl.style.left = slot[0] * 32 + slot[0] + 1 + 'px';
      this.reagentsGridEl.appendChild(itemEl);
      itemEl.addEventListener('click', () => {
        this.onClickReagent(i);
      });
      this.getEngine().itemsMovedManager.addItem(i, 'enhance', () => {
        this.onClickReagent(i);
      });
    }

    this.setEnchantConfirmButton();
  }

  removeReagentItem(itemId) {
    for (const key in this.reagentSlots) {
      if (this.reagentSlots[key] == itemId) delete this.reagentSlots[key];
    }

    removeFromArray(this.selectedInventoryItems, itemId);
    this.removeReagentItemIconIfExist(itemId);
    // this.getEngine().items.deleteViewIconIfExist(itemId, 'enhance-reagent');
    this.getEngine().itemsMovedManager.removeItem(itemId);
    this.setEnchantConfirmButton();
  }

  removeReagentItemIconIfExist (itemId) {
    const item = this.reagentsGridEl.querySelector(`#item${itemId}`);
    if (item) item.parentNode.removeChild(item);
  }

  canSelectNextItem() {
    const selectedItemsAmount = this.selectedInventoryItems.length;
    return selectedItemsAmount < this.maxReagentsLimit;
  }

  createConfirmButton() {
    const opts = {
      selector: '.enhance__submit',
      txt: this.tLang('submit_btn'),
      onClick: this.confirmOnClick.bind(this)
    };
    const
        confirmButton = drawSIButton(opts.txt)[0],
        buttonEl = this.el.querySelector(opts.selector);

    confirmButton.classList.add('disable');
    confirmButton.addEventListener('click', opts.onClick);
    buttonEl.appendChild(confirmButton);
  }

  setEnchantConfirmButton() {
    const confirmBtnEl = this.el.querySelector('.enhance__submit .SI-button');

    if (Object.keys(this.reagentSlots).length > 0) {
      confirmBtnEl.classList.remove('disable');
    } else {
      confirmBtnEl.classList.add('disable');
    }
  }

  confirmOnClick() {
    const
      confirmationQueue = new ConfirmationQueue(),
      enhancedItem = this.getEngine().item[this.getEnhancement().selectedEnhanceItem],
      doEnchant = () => this.getEnhancement().sendRequest(this.getEnhancement().RT.ENCHANT, this.selectedInventoryItems, this.afterEnchant.bind(this));

    confirmationQueue
      .addCondition(() => true, this.tLang('confirm-prompt')) // default confirm
      .addCondition(() => checkReducedRequirementItems(this.selectedInventoryItems), _t('reduced-requirement-item-confirm')) // reduced requirement items
      .addCondition(() => checkBetterItemClass(this.selectedInventoryItems, enhancedItem), _t('better-item-class-confirm')) // better class item
      .addCondition(() => checkEnhancedItems(this.selectedInventoryItems), _t('enhanced-item-confirm')) // enchanted item
      .addCondition(() => checkPersonalItems(this.selectedInventoryItems), _t('personal-item-confirm')) // personal item
      .processConditions(doEnchant);
  }

  afterEnchant(v) {// this.getEnhancement().requestBlock = false;
    // this.clearReagents();
  }

  setEnchantDisableState(state = true) {
    if (state) {
      this.el.classList.add('disabled');
      this.addReagentsBlock = true;
      this.setReagentsDisableState(true);
    } else {
      this.el.classList.remove('disabled');
      this.addReagentsBlock = false;
      this.setReagentsDisableState(false);
    }

    this.setEnchantConfirmButton();
  }

  setReagentsDisableState(state = true) {
    if (state) {
      this.reagentsGridEl.classList.add('disabled');
      this.autofiller.disabled();
      this.addReagentsBlock = true;
    } else {
      this.reagentsGridEl.classList.remove('disabled');
      this.autofiller.enabled();
      this.addReagentsBlock = false;
    }

    this.setEnchantConfirmButton();
  }

  updateUsages ({ count, limit }) {
    this.usageCounterEl.textContent = `${count}/${limit}`;
  }

  update({
    data,
    disable
  }) {
    if (typeof disable !== 'undefined') {
      this.setEnchantDisableState(disable);
    }
  }

  clearReagents() {
    this.selectedInventoryItems = [];
    this.reagentSlots = {};
    // this.getEngine().items.deleteAllViewsByViewName('enhance-reagent');

    const items = this.reagentsGridEl.querySelectorAll('.item');
    for (const item of items) {
      item.parentNode.removeChild(item);
    }

    const enhanceItem = this.getEnhancement().selectedEnhanceItem ? [this.getEnhancement().selectedEnhanceItem] : []
    this.getEngine().itemsMovedManager.removeItemsByTarget('enhance', enhanceItem); // uncheck overflow selected items

    this.setEnchantConfirmButton();
  }

  reset() {
    this.setEnchantDisableState(false);
    this.setReagentsDisableState(true);
    this.setEnchantConfirmButton();
    this.clearReagents();
  }

  destroy () {
    this.autofiller.reset();
  }

  tLang(name, category = 'enhancement') {
    return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, null, category) : '';
  }

  getEnhancement() {
    return this.getEngine().crafting.enhancement;
  }

  getEngine() {
    return g;
  }

}
