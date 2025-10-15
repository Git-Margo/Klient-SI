class RadioList {
  constructor(radiosData, _options) {
    this.radiosData = radiosData;
    this.defaultOptions = {
      isInline: false,
    };
    this.options = Object.assign(Object.assign({}, this.defaultOptions), _options);
    this.radioListEl = this.getRadioListTpl();
    this.createContent();
  }

  getRadioListTpl() {
    return $(`<div class='radio-list'></div>`)[0];
  }

  createContent() {
    let i = 0;
    for (const radio of this.radiosData.radios) {
      radio.name = this.radiosData.name;
      radio.i = i++;
      const clb = this.radiosData.onSelected ? this.radiosData.onSelected : null;
      const radioEl = new Radio(radio, clb).getRadio();
      this.radioListEl.appendChild(radioEl);

      if (this.options.isInline) {
        this.radioListEl.classList.add('radio-list--inline');
      }
    }
  }

  getList() {
    return this.radioListEl;
  }
}
