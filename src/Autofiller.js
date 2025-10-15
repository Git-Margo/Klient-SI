const defaultOptions = {
  btnTip: (i) => {
    return _t('great_merchamp_info %val%', { '%val%': i }, 'shop');
  },
};

class Autofiller {
  constructor(options) {
    this.bagsAmount = 3;
    this.el = this.getAutofillerTpl()[0];
    this.options = Object.assign(Object.assign({}, defaultOptions), options);
    this.autofillerConfig = new AutofillerConfig(this.options.configWindow, this.getData(), (data) =>
      this.saveData(data),
    );
    this.itemGrabber = new ItemGrabber(this.options.itemGrabberOptions);
    this.afterDataSave(this.getData());
    this.setContent();
  }

  setContent() {
    this.setButtons();
  }

  setButtons() {
    const buttonOptions = this.prepareButtonOptions();

    for (const options of buttonOptions) {
      const button = new Button(options).getButton();
      this.el.appendChild(button);
    }
  }

  prepareButtonOptions() {
    const buttons = [];
    const configButton = {
      text: configIcon(),
      classes: ['autofiller-config-btn'],
      action: () => this.autofillerConfig.windowToggle(),
      tip: _t('config_tip', null, 'buttons'),
      disabled: false,
    };

    for (let i = 1; i <= this.bagsAmount; i++) {
      buttons.push({
        text: i.toString(),
        classes: ['small', 'green'],
        action: () => this.autofillFrom(i),
        tip: this.options.btnTip(i),
        disabled: false,
      });
    }

    buttons.push(configButton);
    return buttons;
  }

  autofillFrom(bagNumber) {
    const items = this.itemGrabber.grab(bagNumber);
    this.options.btnFn(items);
  }

  afterDataSave(data) {
    const parsedData = this.parseData(data);
    this.applyDataToItemGrabber(parsedData);
  }

  parseData(data) {
    //returns only checked values
    const obj = {};
    Object.keys(data).forEach(function (filterName, index) {
      obj[filterName] = data[filterName].filter((x) => x.checked).map((x) => x.key);
    });
    return obj;
  }

  applyDataToItemGrabber(data) {
    for (const filterName in data) {
      switch (filterName) {
        case 'cl':
          this.options.itemGrabberOptions.allow.cls = data.cl;
          break;

        case 'rarity':
          const stat = this.options.itemGrabberOptions.allow.stats.find((stat) => stat.name === 'rarity');

          if (stat) {
            stat.params = ['includes', data.rarity];
          }

          break;

        default:
          errorReport('Autofiller.js', 'applyDataToItemGrabber', `No filter type ${filterName}`);
      }
    }

    this.itemGrabber.setFilters(this.options.itemGrabberOptions);
  }

  mergeFilters (a, b) {
    const result = JSON.parse(JSON.stringify(b));

    for (const key of Object.keys(a)) {
      if (result.hasOwnProperty(key)) {
        for (const objA of a[key]) {
          const keyA = objA.key;
          const foundB = result[key].find((objB) => objB.key === keyA);

          if (!foundB) {
            result[key].push(objA);
          }
        }
      } else {
        result[key] = a[key];
      }
    }

    return result;
  }

  getData() {
    const storageData = margoStorage.get(this.options.storageName);
    return storageData ? this.mergeFilters(this.options.filters, storageData) : { ...this.options.filters };
  }

  saveData(data) {
    margoStorage.set(this.options.storageName, data);
    this.autofillerConfig.filtersUpdate(data);
    this.afterDataSave(data);
  }

  enabled() {
    this.el.classList.remove('disabled');
  }

  disabled() {
    this.el.classList.add('disabled');
  }

  reset() {
    this.autofillerConfig.windowRemove();
  }

  getContent() {
    return this.el;
  }

  getEngine() {
    return g;
  }

  getAutofillerTpl() {
    return $(`<div class='autofiller'></div>`);
  }
}
