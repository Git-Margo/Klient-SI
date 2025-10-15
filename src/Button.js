class Button {
  constructor(buttonData) {
    this.disabled = false;
    this.createButton(buttonData);
  }

  createButton({
                 text,
                 classes,
                 action,
                 tip,
                 disabled
               }) {
    this.el = drawSIButton(text)[0];
    if (classes) this.el.classList.add(...classes);
    this.el.addEventListener('click', e => {
      if (action) action(e);
    });

    if (disabled) {
      this.setState(true);
    }

    if (tip) {
      this.setTip(tip);
    }

    if (!(typeof text === 'string' || typeof text === 'undefined')) {
      this.el.querySelector('.label .gfont').remove();
      this.el.querySelector('.label').appendChild(text);
    }
  }

  setState(isDisable) {
    this.disabled = isDisable;

    if (this.disabled) {
      this.el.classList.add('disable');
    } else {
      this.el.classList.remove('disable');
    }
  }

  getState() {
    return this.disabled;
  }

  setTip (value) {
    return $(this.el).tip(value);
  }

  getButton() {
    return this.el;
  }
};
