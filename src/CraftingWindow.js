class CraftingWindow {
  constructor(title) {
    this.opened = false;
    this.content = '';
    this.initWindow(title);
  }
  closeAll() {
    if (this.getEngine().crafting.recipes) this.getEngine().crafting.recipes.close();
    if (this.getEngine().crafting.salvage) this.getEngine().crafting.salvage.close();
    if (this.getEngine().crafting.enhancement) this.getEngine().crafting.enhancement.close();
    if (this.getEngine().crafting.extraction) this.getEngine().crafting.extraction.close();
  }

  manageVisible() {
    if (!this.opened) {
      this.closeOtherWindows();
      this.windowOpen();
    } else {
      this.windowClose();
    }
  }

  windowOpen() {
    this.wndEl.style.display = 'block';
    this.opened = true;
    g.lock.add('crafting');
  }

  windowClose() {
    this.wndEl.style.display = 'none';
    this.opened = false;
    g.lock.remove('crafting');
  }

  initWindow(title) {
    this.wndEl = $('#crafting')[0];

    const closeEl = this.wndEl.querySelector('.close-but');
    closeEl.addEventListener('click', this.close.bind(this));

    this.setTitle();
  }

  setTitle() {
    const title = goldTxt(_t('crafting', null, 'recipes'), true);
    this.wndEl.querySelector('.crafting__title').innerHTML = title;
  }

  getWindow() {
    return this.wndEl;
  }

  getEngine() {
    return g;
  }

  closeOtherWindows() {
    const e = this.getEngine();
    const v = e.windowsData.windowCloseConfig.CRAFTING;
    e.windowCloseManager.callWindowCloseConfig(v);
  }

  close() {
    this.closeAll();
    this.windowClose();
    delete this.getEngine().crafting.recipes;
  }
}
