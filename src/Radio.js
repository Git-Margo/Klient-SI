class Radio {
  constructor(radioData, onSelected) {
    this.onSelected = onSelected;
    this.el = this.getRadioTpl();
    this.createRadio(radioData);
  }

  createRadio({ id, name, value, label, selected, i }) {
    const inputEl = this.el.querySelector('input'),
      labelEl = this.el.querySelector('label');

    inputEl.addEventListener('change', (e) => {
      if (this.onSelected) this.onSelected(e);
    });

    if (!isset(id) && isset(i)) {
      id = `${name}_${i}`;
    }

    setAttributes(inputEl, { id, name, value });

    if (isset(selected) && selected) {
      inputEl.checked = true;
    }

    if (label) {
      labelEl.setAttribute('for', id.toString());

      if (typeof label === 'object') {
        // if html
        labelEl.appendChild(label);
      } else {
        // string
        labelEl.innerHTML = label;
      }
    }
  }

  getRadio() {
    return this.el;
  }

  getRadioTpl() {
    return $(`
      <div class="radio-custom">
          <input type="radio" id="xxx" name="xxx">
          <label for="xxx"></label>
      </div>
    `)[0];
  }
}
