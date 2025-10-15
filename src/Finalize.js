class Finalize {
  constructor(el) {
    this.el = el;
    this.radioList = {
      radios: [
        {
          id: 1,
          name: 'extraction-payment',
          value: 'z',
          label: '',
          selected: false,
        },
        {
          id: 2,
          name: 'extraction-payment',
          value: 's',
          label: '',
          selected: false,
        },
      ],
      onSelected: this.onSelected.bind(this),
    };
    this.CURRENCY = {
      GOLD: 'gold',
      CREDITS: 'credits',
    };
    this.disable = true;
    this.payments = null;
    this.selected = null;
    this.paymentEl = this.el.querySelector('.extraction__payment');
    this.buttonsContainerEl = this.el.querySelector('.extraction__submit');
    this.setDisableState(true);
    this.createConfirmButton();
  }

  createChoosePayment() {
    if (!this.payments) return;
    const { gold, credits } = this.payments;
    this.clearPayment();
    this.radioList.radios[0].label = this.createPaymentOption(this.CURRENCY.GOLD, gold.toString());
    this.radioList.radios[1].label = this.createPaymentOption(this.CURRENCY.CREDITS, credits.toString());
    const radioList = new RadioList(this.radioList, {
      isInline: true,
    }).getList();
    this.paymentEl.appendChild(radioList);
  }

  createPaymentOption(currency, val) {
    const optionEl = this.getExtractionPaymentOptionTpl();
    optionEl.classList.add('extraction__currency--'.concat(currency));
    optionEl.querySelector('.amount').innerHTML = round(val, 2);
    return optionEl;
  }

  getExtractionPaymentOptionTpl() {
    return $(`
        <div class='extraction__currency'>
            <div class='icon'></div>
            <div class='amount'></div>
        </div>
    `)[0];
  }

  onSelected(e) {
    this.selected = e.target.value; // value radio input from Radio.ts

    this.setStateConfirmButton();
  }

  setStateConfirmButton() {
    if (this.selected === null) {
      this.disableConfirmButton(); // need choose bonus first

      return;
    }

    if (this.checkRequires()) {
      this.enableConfirmButton();
    } else {
      this.disableConfirmButton();
    }
  }

  enableConfirmButton() {
    this.submitBtnEl.classList.remove('disable');
  }

  disableConfirmButton() {
    this.submitBtnEl.classList.add('disable');
  }

  checkRequires() {
    if (!this.payments) return false;
    const { gold, credits } = this.payments;
    return (
      (gold <= hero.gold && this.selected === 'z') ||
      (credits <= hero.credits && this.selected === 's')
    );
  }

  createConfirmButton() {
    const opts = {
      txt: this.tLang('submit_btn'),
      classes: 'disable',
      onClick: this.confirmOnClick.bind(this),
    };
    this.submitBtnEl = createButton(opts.txt, opts.classes, opts.onClick);
    this.buttonsContainerEl.appendChild(this.submitBtnEl);
  }

  confirmOnClick() {
    var _a, _b;

    const val =
        this.selected === 'z'
          ? {
              '%val%': formNumberToNumbersGroup((_a = this.payments) === null || _a === void 0 ? void 0 : _a.gold),
              '%val2%': _t('cost_gold'),
            }
          : {
              '%val%': formNumberToNumbersGroup((_b = this.payments) === null || _b === void 0 ? void 0 : _b.credits),
              '%val2%': _t('cost_credits'),
            },
      costInfo = this.tLang('extract_cost %val%', 'extraction', val),
      confirmInfo = this.tLang('confirm-prompt'),
      text = parseBasicBB(costInfo) + confirmInfo;

    mAlert(text, 1, [
      () => this.sendExtractRequest(),
      () => {}
    ]);
  }

  sendExtractRequest() {
    const extractItem = this.getExtraction().selectedExtractItem;

    _g(`extractor&action=extract&currency=${this.selected}&item=${extractItem}`);
  }

  update(payments) {
    this.payments = payments;
    this.createChoosePayment();
    this.setDisableState(false);
  }

  setDisableState(state) {
    this.disable = state;

    if (this.disable) {
      this.el.classList.add('disabled');
    } else {
      this.el.classList.remove('disabled');
    }
  }

  clearPayment() {
    this.paymentEl.innerHTML = '';
  }

  reset() {
    this.selected = null;
    this.payments = null;
    this.disableConfirmButton();
    this.clearPayment();
    this.setDisableState(true);
  }

  destroy() {}

  tLang(name, category = 'extraction', params = null) {
    return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, params, category) : '';
  }

  getExtraction() {
    return this.getEngine().crafting.extraction;
  }

  getEngine() {
    return g;
  }
}
