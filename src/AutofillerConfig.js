const defaultOptions = {};

class AutofillerConfig {
  constructor(options, data, saveCallback) {
    this.data = data;
    this.saveCallback = saveCallback;
    this.isOpen = false;
    this.options = Object.assign(Object.assign({}, defaultOptions), options);
    this.setInitialData();
    this.windowInit();
    this.setContent();
  }

  setContent() {
    this.setHeading();
    this.createGroups(); // this.setCheckboxes();

    this.setButtons();
  }

  setHeading() {
    const headingEl = this.wndEl.querySelector('.autofiller-config__heading');
    headingEl.textContent = this.options.heading;
  }

  setButtons() {
    const buttonsContainerEl = this.wndEl.querySelector('.autofiller-config__buttons');
    buttonsContainerEl.innerHTML = '';
    const buttonOptions = [
      { text: _t('save', null, 'buttons'), classes: ['small', 'green'], action: () => this.onClickSave() },
      { text: _t('cancel', null, 'buttons'), classes: ['small', 'green'], action: () => this.windowClose() },
    ];

    for (const options of buttonOptions) {
      const button = new Button(options).getButton();
      buttonsContainerEl.appendChild(button);
    }
  }

  onClickSave() {
    this.saveCallback(this.tempData);
    this.windowClose();
  }

  filtersUpdate(data) {
    this.data = JSON.parse(JSON.stringify(data));
    this.setInitialData();
  }

  createGroups() {
    if (!isset(this.options.groups)) {
      errorReport('Autofiller.js', 'createGroups', 'No groups defined');
      return;
    }

    const groupsEl = this.wndEl.querySelector('.autofiller-config__groups');
    groupsEl.innerHTML = '';

    for (const { id, title } of this.options.groups) {
      const groupEl = this.getAutofillerConfigGroupTpl()[0];
      const groupTitleEl = groupEl.querySelector('.autofiller-config__title');
      groupTitleEl.textContent = title;
      groupEl.classList.add(`group-${id}`);
      groupsEl.appendChild(groupEl);
    }
  }

  setCheckboxes() {
    for (const filter in this.tempData) {
      const filterData = this.tempData[filter];

      for (const { key, checked, groupId } of filterData) {
        const groupEl = this.wndEl.querySelector(`.group-${groupId} .autofiller-config__checkboxes`);
        const label = this.getLabel(filter, key);
        const checkbox = new Checkbox(
          {
            name: `${filter}_${key}`,
            label,
            value: key,
            i: key,
            checked,
            attrs: {
              'data-type': 'cl',
            },
          },
          (checked) => this.onSelected(checked, filter, key),
        ).getCheckbox();
        groupEl.appendChild(checkbox);
      }
    }
  }

  clearCheckboxes() {
    this.wndEl.querySelectorAll(`.autofiller-config__checkboxes`).forEach((el) => (el.innerHTML = ''));
  }

  onSelected(checked, filter, key) {

    let obj = this.tempData[filter].find((x) => x.key === key);
    obj.checked = checked;
  }

  getLabel(filterType, key) {
    let label;

    switch (filterType) {
      case 'cl':
        label = _t(`au_cat${key}`, null, 'auction');
        break;
      case 'rarity':
        label = _t(`rarity_${key}`, null, 'item');
        break;
      default:
        errorReport('Autofiller.js', 'getLabel', `No filter type ${filterType}`);
    }

    return label;
  }

  windowInit() {
    this.wndEl = $('#autofiller-config')[0];

    const closeEl = this.wndEl.querySelector('.close-but');
    closeEl.addEventListener('click', this.close.bind(this));

    const title = goldTxt(this.options.title, true);
    this.wndEl.querySelector('.autofiller-config__header').innerHTML = title;
  }

  windowToggle() {
    if (this.isOpen) this.windowClose();
    else this.windowOpen();
  }

  setInitialData() {
    this.tempData = JSON.parse(JSON.stringify(this.data));
  }

  windowOpen() {
    this.setInitialData();
    this.setCheckboxes();
    this.wndEl.style.display = 'block';
    this.isOpen = true;
    // $(this.wndEl).absCenter();
    this.wndEl.style.top = '31px';
    this.wndEl.style.left = '56px';
  }

  windowClose() {
    this.wndEl.style.display = 'none';
    this.isOpen = false;
    this.clearCheckboxes();
    this.tempData = {};
  }

  windowRemove() {
    this.windowClose();
  }

  close() {
    this.windowClose();
  }

  getEngine() {
    return g;
  }

  getAutofillerConfigTpl() {
    return $(`
      <div class='autofiller-config'>
        <div class='autofiller-config__heading'></div>
        <div class='autofiller-config__groups'></div>
        <div class='autofiller-config__buttons btns-spacing'></div>
      </div>
    `);
  }

  getAutofillerConfigGroupTpl() {
    return $(`
      <div class='autofiller-config__group'>
        <div class='autofiller-config__title'></div>
        <div class='autofiller-config__checkboxes'></div>
      </div>
    `);
  }
}
