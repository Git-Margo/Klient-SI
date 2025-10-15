class PaymentSelector {
  constructor(options) {
    this.disable = true;
    this.paymentOptions = [];
    this.selected = null;
    this.defaultValidators = {
      gold: amount => hero.gold >= amount,
      credits: amount => hero.credits >= amount
    };
    this.options = Object.assign({}, options);
    this.el = this.getTpl();
    this.paymentMethodsEl = this.el.querySelector('.payment-selector__methods');
    this.buttonsContainerEl = this.el.querySelector('.payment-selector__submit');
    this.infoboxEl = this.el.querySelector('.info-box');
    this.setHidden(!!this.options.hidden);
    if (this.options.infobox) {
      this.infoboxEl.textContent = this.options.infobox;
    } else {
      this.infoboxEl.remove();
    }
    if (this.options.submit)
      this.createSubmitButton();
    if (Array.isArray(this.options.payments)) {
      this.updatePayments(this.options.payments);
    }
  }
  getTpl() {
    return $(`<div class="payment-selector">
      <div class="info-box"></div>
      <div class="payment-selector__methods"></div>
      <div class="payment-selector__submit"></div>
    </div>`)[0];
  }

  getOptionTpl() {
    return $(`<div class="payment-selector__option">
      <div class="payment-selector__icon"></div>
      <div class="payment-selector__amount"></div>
    </div>`)[0];
  }
  applyDefaultValidators(paymentOptions) {
    return paymentOptions.map(option => {
        if (!option.validate && this.defaultValidators[option.code]) {
          return Object.assign(Object.assign({}, option), {
            validate: this.defaultValidators[option.code]
          });
        }
        return option;
      }
    );
  }
  sortPaymentOptions(paymentOptions) {
    const orderMap = {
      gold: 0,
      credits: 1
    };
    return paymentOptions.slice().sort( (a, b) => {
        var _a, _b;
        const indexA = (_a = orderMap[a.code]) !== null && _a !== void 0 ? _a : 99;
        const indexB = (_b = orderMap[b.code]) !== null && _b !== void 0 ? _b : 99;
        return indexA - indexB;
      }
    );
  }
  updatePayments(payments) {
    let paymentOptions;
    if (Array.isArray(payments)) {
      paymentOptions = this.applyDefaultValidators(payments);
    } else {
      paymentOptions = this.convertPaymentsObjectToOptions(payments);
    }
    this.paymentOptions = this.sortPaymentOptions(paymentOptions);
    this.selected = null;
    this.clearPayment();
    this.createChoosePayment();
    this.setHidden(false);
  }
  convertPaymentsObjectToOptions(paymentsObj) {
    const labelsMap = {
      gold: 'Gold',
      credits: 'Credits'
    };
    return Object.entries(paymentsObj).map( ([code,amount]) => {
        return {
          code,
          label: labelsMap[code] ? labelsMap[code] : code,
          amount,
          validate: this.defaultValidators[code]// add default validator, if exist
        };
      }
    );
  }
  createChoosePayment() {
    if (!Array.isArray(this.paymentOptions) || !this.paymentOptions.length) {
      this.clearPayment();
      return;
    }
    this.clearPayment();
    const radioData = this.paymentOptions.map(option => ({
      value: option.code,
      name: option.code,
      label: this.createPaymentOption(option.code, option.label, option.amount)
    }));
    const radioList = new RadioList({
      radios: radioData,
      name: 'payment-selector',
      onSelected: this.onSelected.bind(this)
    },{
      isInline: true
    }).getList();
    this.paymentMethodsEl.appendChild(radioList);
  }
  createPaymentOption(currency, label, amount) {
    const optionEl = this.getOptionTpl();
    optionEl.classList.add(`payment-selector__option--${currency}`);
    // optionEl.querySelector('.payment-selector__icon').textContent = label;
    optionEl.querySelector('.payment-selector__amount').innerHTML = round(amount, 2);
    return optionEl;
  }
  onSelected(e) {
    this.selected = e.target.value;
    if (this.options.submit)
      this.setStateConfirmButton();
  }
  createSubmitButton() {
    const opts = {
      text: this.options.submit.btnText ? this.options.submit.btnText : this.tLang('submit_btn'),
      classes: ['small', 'green'],
      action: this.confirmOnClick.bind(this),
      disabled: true
    };
    this.submitBtnEl = new Button(opts);
    this.buttonsContainerEl.appendChild(this.submitBtnEl.getButton());
  }
  checkRequires() {
    if (!this.selected)
      return false;
    const option = this.paymentOptions.find(opt => opt.code === this.selected);
    if (!option)
      return false;
    if (option.validate)
      return option.validate(option.amount);
    // no validator = true
    return true;
  }
  setStateConfirmButton() {
    if (!this.selected) {
      this.disableSubmitButton();
      return;
    }
    if (this.checkRequires()) {
      this.enableSubmitButton();
    } else {
      this.disableSubmitButton();
    }
  }
  enableSubmitButton() {
    this.submitBtnEl.setState(false);
  }
  disableSubmitButton() {
    this.submitBtnEl.setState(true);
  }
  confirmOnClick() {
    if (this.selected && this.options.submit && this.options.submit.btnOnClick) {
      this.options.submit.btnOnClick(this.selected, this.paymentOptions.find(opt => opt.code === this.selected)?.amount ?? 0);
    }
  }
  setHidden(state) {
    this.disable = state;
    if (this.disable) {
      this.el.classList.add('payment-selector--hidden');
    } else {
      this.el.classList.remove('payment-selector--hidden');
    }
  }
  clearPayment() {
    this.paymentMethodsEl.innerHTML = '';
  }
  getComponent() {
    return this.el;
  }
  reset() {
    this.selected = null;
    this.paymentOptions = [];
    this.disableSubmitButton();
    this.clearPayment();
    this.setHidden(true);
  }
  destroy() {// cleanup
  }
  tLang(name, category='extraction', params=null) {
    return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, params, category) : '';
  }
}
