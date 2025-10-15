class Progressbar {
  constructor(el) {
    this.el = el;
    this.lastMax = 0;
    this.lastCurrent = 0;
    this.lastPreview = 0;
    this.lastUpgradeLevel = 0;
    this.currentProgressEl = el.querySelector('.enhance__progress--current');
    this.previewProgressEl = el.querySelector('.enhance__progress--preview');
    this.currentProgressTextEl = el.querySelector('.enhance__progress-text--current');
    this.previewProgressTextEl = el.querySelector('.enhance__progress-text--preview');
  }

  update ({ current, gained, max, upgradeLevel }) {
    let currentWidth = !max ? 0 : current / max * 100;
    if (typeof gained !== 'undefined') {
      this.setPreview(gained, current, max, upgradeLevel);
    } else {
      this.lastCurrent = current <= max ? current : max;
      this.lastMax = max;
      this.lastUpgradeLevel = upgradeLevel;
      let progressText = current || max ? `${current} / ${max}` : ' ';
      this.setProgress(currentWidth, 0, progressText, 0);
    }
  }

  setPreview (gained, preview, max, upgradeLevel) {
    let current = this.lastCurrent;
    let previewWidth;
    let currentWidth;
    let currentVal = current;
    if (upgradeLevel === this.lastUpgradeLevel) { // same lvl
      preview = preview - this.lastCurrent;
      currentWidth = !max ? 0 : current / max * 100;
    } else { // next lvl
      currentWidth = 0;
      currentVal = 0;
    }
    previewWidth = !max ? 0 : (currentVal + preview) / max * 100;
    this.lastPreview = preview = gained;
    let progressText = `${this.lastCurrent} / ${max}`;
    this.setProgress(currentWidth, previewWidth, progressText, preview);
    return;
  }

  setProgress (currentWidth, previewWidth = 0, progressText, preview = 0) {
    this.currentProgressEl.style.width = currentWidth + '%';
    this.currentProgressTextEl.innerText = progressText;
    this.previewProgressEl.style.width = (previewWidth <= 100 ? previewWidth : 100) + '%'; // max 100%

    this.previewProgressTextEl.innerText = `+${preview}`;

    if (!preview) {
      this.previewTextHide();
    } else {
      this.previewTextShow();
    }
  }

  previewTextShow() {
    this.previewProgressTextEl.style.display = 'block';
  }

  previewTextHide() {
    this.previewProgressTextEl.style.display = 'none';
    this.previewProgressTextEl.innerHTML = '';
  }

  isFull () {
    // return this.lastPreview >= this.lastMax || this.lastCurrent === this.lastMax;
    return this.lastCurrent === this.lastMax && this.lastCurrent !== 0;
  }

  completed() {
    this.setProgress(100, 0, this.tLang('completed'), 0);
    return true;
  }

  reset() {
    this.update({
      current: 0,
      max: 0,
      upgradeLevel: 0
    });
  }

  tLang(key) {
    return g.crafting.enhancement.tLang(key);
  }

}
