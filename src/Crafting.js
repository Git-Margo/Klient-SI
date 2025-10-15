const CRAFT_MODULES = {
  ITEM_CRAFT: 'item-craft',
  RECIPES: 'recipes'
};
const ITEM_CRAFT_MODULES = {
  ENHANCEMENT: 'enhancement',
  SALVAGE: 'salvage',
  EXTRACTION: 'extraction',
}

class Crafting {
  constructor() {
    this.cards = {
      'item-craft': {
        name: this.tLang('item-craft', 'crafting'),
        requireLvl: 20,
        initAction: () => {
          this.open('enhancement');
        }
      },
      'recipes': {
        name: this.tLang('recipe'),
        initAction: () => {
          if (hero.getLevel() >= 20) _g('craft&a=list')
        }
      }
    };

    this.window = new CraftingWindow(this.tLang('crafting'));
    this.wndEl = this.window.getWindow();
    this.itemCraft = new ItemCraft(this.tLang('crafting'),this.wndEl);
    this.createTabs();
  }

  createTabs() {
    const tabsOptions = {
      tabsEl: {
        navEl: this.wndEl.querySelector('.crafting__tabs'),
        contentsEl: this.wndEl.querySelector('.crafting__contents')
      }
    };
    this.Tabs = new Tabs(this.cards,tabsOptions);
  }

  open(type, v) {
    const eng = this.getEngine();
    let subType = null;
    if (this.isItemCraftModule(type)) {
      subType = type;
      type = CRAFT_MODULES.ITEM_CRAFT;
    }
    if (!this.Tabs.canCardOpen(type)) return;
    this.closeOthers(type);
    this.Tabs.activateCard(type);
    this.window.closeOtherWindows();

    switch (type) {
      case CRAFT_MODULES.RECIPES:
        if (!eng.crafting.recipes) {
          eng.crafting.recipes = new Recipes(this.wndEl);
          eng.crafting.recipes.init();
        }
        eng.crafting.recipes.update(v);
        break;
      case CRAFT_MODULES.ITEM_CRAFT:
        this.itemCraft.open(subType !== null && subType !== void 0 ? subType : 'default');
        break;
    }
    this.Tabs.checkRequires();
    this.window.windowOpen();
  }

  isItemCraftModule (name) {
    return name === 'default' || Object.values(ITEM_CRAFT_MODULES).includes(name);
  }

  isOpen() {
    return this.window.opened;
  }

  closeOthers(name) {
    if (this.getEngine().crafting.recipes && name !== CRAFT_MODULES.RECIPES) this.getEngine().crafting.recipes.close();
    if (this.getEngine().crafting.itemCraft && name !== CRAFT_MODULES.ITEM_CRAFT) this.getEngine().crafting.itemCraft.close();
  }

  getEngine() {
    return g;
  }

  tLang(name, category = 'recipes', val = null) {
    return _t(name, val, category);
  }

  triggerOpen() {
    _g('artisanship&action=open');
  }

  triggerClose() {
    this.window.close();
  }
}
