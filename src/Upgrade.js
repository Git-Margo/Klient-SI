class Upgrade {
  constructor(el) {
    this.el = el;
    this.disable = true;
    // this.hidden = false;
    this.lastData = null;
    this.upgradeLvl = null;
    this.selectedBonus = null;
    this.requireItem = {};
    this.createContent();
    this.bonusSelector = new BonusSelector(this.bonusChooseEl, {
      onSelectedClb: this.onBonusSelected.bind(this),
      ownSubmitBtn: true
    })
    this.setDisableState(true);
    // this.setHiddenState(true);
    this.resetGold();
    this.getEngine().tplsManager.fetch('u', this.newRequireItem.bind(this));
  }

  newRequireItem(i, finish) {
    const iconEl = i.$[0];
    this.updateAmount(i, iconEl);
    this.requireItemSlotEl.appendChild(iconEl);
  }

  updateAmount(item, iconEl) {
    if (!isset(this.requireItem)) return;
    const amount = this.requireItem.amount;
    this.getEngine().tplsManager.changeItemAmount(item, $(iconEl), amount);
  }

  setDisableState(state) {
    this.disable = state;

    if (this.disable) {
      this.el.classList.add('disabled', 'hidden');
    } else {
      this.el.classList.remove('disabled', 'hidden');
    }
  }

  // setHiddenState(state) {
  //   this.hidden = state;
  //
  //   if (this.hidden) {
  //     this.el.classList.add('hidden');
  //   } else {
  //     this.el.classList.remove('hidden');
  //   }
  // }

  createContent() {
    this.createConfirmButton();
    this.bonusChooseEl = this.el.querySelector('.enhance__bonus');
    this.goldAmountEl = this.el.querySelector('.enhance__r-gold-amount');
    this.requireItemSlotEl = this.el.querySelector('.enhance__r-item');
  }

  onBonusSelected(selected) {
    this.selectedBonus = selected;
    if (this.lastData) {
      this.setStateConfirmButton(this.lastData);
    } else {
      this.enableConfirmButton();
    }
  }

  clearBonus() {
    this.bonusChooseEl.innerHTML = '';
  }

  createConfirmButton() {
    const opts = {
      selector: '.enhance__submit2',
      txt: this.tLang('submit_btn2'),
      onClick: this.confirmOnClick.bind(this)
    };
    const buttonEl = this.el.querySelector(opts.selector);
    this.confirmBtnEl = drawSIButton(opts.txt)[0];
    this.confirmBtnEl.classList.add('disable');
    this.confirmBtnEl.addEventListener('click', opts.onClick);
    buttonEl.appendChild(this.confirmBtnEl);
  }

  confirmOnClick() {
    const
      val = this.lastData ? {'%val%': formNumberToNumbersGroup(this.lastData.goldPrice)} : null,
      costInfo = this.tLang('upgrade_cost %val%', 'enhancement', val),
      confirmInfo = this.tLang('confirm-prompt'),
      text = val ? costInfo + confirmInfo : confirmInfo;

    mAlert(text, 1, [
      () => this.doUpgrade(),
      () => {}
    ]);
  }

  doUpgrade() {
    const bonusParam = this.upgradeLvl === 4 ? `&bonusIdx=${this.selectedBonus}` : '';

    _g(`enhancement&action=upgrade&item=${this.getEnhancement().selectedEnhanceItem}${bonusParam}`, (v) => {
      if (isset(v.enhancement.progressing)) {
        this.reset();
      }
    });
  }

  enableConfirmButton() {
    this.confirmBtnEl.classList.remove('disable');
  }

  disableConfirmButton() {
    this.confirmBtnEl.classList.add('disable');
  }

  update({
    data,
    disable
    //hidden
  }) {
    if (typeof data !== 'undefined') {
      this.lastData = data;
      const {
        bonuses,
        goldPrice,
        ingredientPrice,
        ingredientTplId,
        upgradeLevel
      } = data;
      this.upgradeLvl = upgradeLevel;
      this.setGoldAmount({
        goldPrice
      });
      this.setRequireItem({
        ingredientPrice,
        ingredientTplId
      });

      if (bonuses.length > 0) {
        this.bonusSelector.createBonusChoose(bonuses);
      }

      this.setStateConfirmButton(data);
    }

    if (typeof disable !== 'undefined') {
      this.setDisableState(disable);
    }

    // if (typeof hidden !== 'undefined') {
    //   this.setHiddenState(hidden);
    // }
  }

  setStateConfirmButton(data) {
    const {
      bonuses
    } = data;

    if (bonuses.length > 0 && this.selectedBonus === null) {
      this.disableConfirmButton(); // need choose bonus first

      return;
    }

    if (this.checkRequires(data)) {
      this.enableConfirmButton();
    } else {
      this.disableConfirmButton();
    }
  }

  checkRequires(data) {
    const {
      goldPrice,
      ingredientPrice,
      ingredientTplId
    } = data;
    return goldPrice <= hero.gold && this.checkRequiresItemsAmount(ingredientTplId, ingredientPrice);
  }

  checkRequiresItemsAmount(tplId, neededAmount) {
    let hItems = this.getEngine().hItems;
    let amount = 0;

    for (let k in hItems) {
      let item = hItems[k];
      if (item.st > 0) continue;
      if (item.tpl != tplId) continue;
      amount += parseInt(parseItemStat(item.stat).amount);
    }

    return amount >= neededAmount;
  }

  setRequireItem({
    ingredientPrice,
    ingredientTplId
  }) {
    this.requireItem = {
      id: ingredientTplId,
      amount: ingredientPrice
    };
  }

  setGoldAmount({
    goldPrice
  }) {
    const parsedPrice = round(goldPrice ,2);
    this.goldAmountEl.innerHTML = parsedPrice;
  }

  resetGold() {
    this.setGoldAmount({
      goldPrice: 0
    });
  }

  removeRequireItem() {
    this.requireItem = {};
    this.getEngine().tplsManager.deleteMessItemsByLoc('u');

    const item = this.requireItemSlotEl.querySelector(`.item`);
    if (item) item.parentNode.removeChild(item);
  }

  reset() {
    this.requireItemsFromEQ = [];
    this.upgradeLvl = null;
    this.lastData = null;
    this.selectedBonus = null;
    this.removeRequireItem();
    this.setDisableState(true);
    // this.setHiddenState(true);
    this.disableConfirmButton();
    this.resetGold();
    this.clearBonus();
  }

  destroy() {
    this.removeRequireItem();
    this.getEngine().tplsManager.removeCallback('u', this.newRequireItem.bind(this));
  }

  tLang(name, category = 'enhancement', params = null) {
    return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, params, category) : '';
  }

  getEnhancement() {
    return this.getEngine().crafting.enhancement;
  }

  getEngine() {
    return g;
  }

}
