const MODULES = {
  ENHANCEMENT: 'enhancement',
  SALVAGE: 'salvage',
  EXTRACTION: 'extraction',
  SOCKET_ENCHANTMENT: 'socket_enchantment',
  SOCKET_EXTRACTION: 'socket_extraction',
  SOCKET_COMPOSITION: 'socket_composition',
};

const groups = [{
  id: 1, slug: 'item-power', name: _t('cat_item-power', null, 'crafting'), tabs: [
    { slug: MODULES.ENHANCEMENT, name: _t(MODULES.ENHANCEMENT, null, 'enhancement') },
    { slug: MODULES.SALVAGE, name: _t(MODULES.SALVAGE, null, 'salvager') },
    { slug: MODULES.EXTRACTION, name: _t(MODULES.EXTRACTION, null, 'extraction') }
  ]},
  { id: 3, slug: 'item-sockets', name: _t('cat_item-socket', null, 'crafting'), tabs: [
    { slug: MODULES.SOCKET_COMPOSITION, name: _t(MODULES.SOCKET_COMPOSITION, null, 'crafting') },
    { slug: MODULES.SOCKET_ENCHANTMENT, name: _t(MODULES.SOCKET_ENCHANTMENT, null, 'crafting') },
    { slug: MODULES.SOCKET_EXTRACTION, name: _t(MODULES.SOCKET_EXTRACTION, null, 'crafting') },
  ]},
];
class ItemCraft {
  constructor(title, wndEl) {
    this.wndEl = wndEl;
    this.opened = false;
    this.Tabs = null;
    this.cards = {};
  }
  open(type=MODULES.ENHANCEMENT) {
    if (!this.opened) {
      this.createContent();
      this.createNavigation();
      this.createTabs();
      this.initSearch();
    }
    this.opened = true;
    if (type === 'default')
      type = MODULES.ENHANCEMENT;
    if (!this.Tabs.canCardOpen(type))
      return;
    this.closeOthers(type);
    if (this.Tabs) {
      this.Tabs.activateCard(type);
    }
    const eng = this.getEngine();
    switch (type) {
      case MODULES.SALVAGE:
        if (!eng.crafting.salvage) {
          eng.crafting.salvage = new Salvage(this.wndEl);
        }
        break;
      case MODULES.ENHANCEMENT:
        if (!eng.crafting.enhancement) {
          eng.crafting.enhancement = new Enhancement(this.wndEl);
        }
        break;
      case MODULES.EXTRACTION:
        if (!eng.crafting.extraction) {
          eng.crafting.extraction = new Extraction(this.wndEl);
        }
        break;
    }
    this.Tabs.checkRequires();
  }
  createTabs() {console.log(isTestWorld())
    this.cards = {
      [MODULES.ENHANCEMENT]: {
        name: _t(MODULES.ENHANCEMENT, null, 'enhancement'),
        requireLvl: 20,
        tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.ENHANCEMENT}']`),
        initAction: () => {
          this.open(MODULES.ENHANCEMENT);
        }
      },
      [MODULES.SALVAGE]: {
        name: _t(MODULES.SALVAGE, null, 'salvager'),
        requireLvl: 20,
        tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.SALVAGE}']`),
        initAction: () => {
          this.open(MODULES.SALVAGE);
        }
      },
      [MODULES.EXTRACTION]: {
        name: _t(MODULES.EXTRACTION, null, 'extraction'),
        requireLvl: 20,
        tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.EXTRACTION}']`),
        initAction: () => {
          this.open(MODULES.EXTRACTION);
        }
      },
      [MODULES.SOCKET_ENCHANTMENT]: {
        name: _t(MODULES.SOCKET_ENCHANTMENT, null, 'crafting'),
        requireLvl: 20,
        disabled: !isTestWorld(),
        tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.SOCKET_ENCHANTMENT}']`),
        initAction: () => {
          this.open(MODULES.SOCKET_ENCHANTMENT);
        }
      },
      [MODULES.SOCKET_EXTRACTION]: {
        name: _t(MODULES.SOCKET_EXTRACTION, null, 'crafting'),
        requireLvl: 20,
        disabled: !isTestWorld(),
        tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.SOCKET_EXTRACTION}']`),
        initAction: () => {
          this.open(MODULES.SOCKET_EXTRACTION);
        }
      },
      [MODULES.SOCKET_COMPOSITION]: {
        name: _t(MODULES.SOCKET_COMPOSITION, null, 'crafting'),
        requireLvl: 20,
        disabled: !isTestWorld(),
        tabEl: this.contentEl.querySelector(`[data-tab-id='${MODULES.SOCKET_COMPOSITION}']`),
        initAction: () => {
          this.open(MODULES.SOCKET_COMPOSITION);
        }
      },
    };

    const tabsOptions = {
      tabsEl: {
        contentsEl: this.contentEl.querySelector('.item-craft__tab-contents')
      }
    };

    this.Tabs = new Tabs(this.cards,tabsOptions);
  }

  createNavigation() {
    for (const group of groups) {
      this.createGroupElement(group);
    }
  }

  createGroupElement(group) {
    const category = group.slug;
    const offerGroupEl = this.getHtmlDivideListGroup();
    const offerGroupHeaderEl = offerGroupEl.querySelector('.group-header');
    offerGroupEl.classList.add(`group-${category}`, 'active');
    offerGroupEl.querySelector('.label').innerHTML = group.name;
    this.wndEl.querySelector('.items-list').appendChild(offerGroupEl);
    offerGroupHeaderEl.addEventListener('click', () => {
      offerGroupEl?.classList.toggle('active');
    });

    if (!group.tabs) return;
    for (const tab of group.tabs) {
      const tabEl = this.createGroupItem(tab);
      offerGroupEl.querySelector('.group-list').appendChild(tabEl);
    }
  }

  createGroupItem(data) {
    let one = this.getHtmlOneItemOnDivideList();
    one.classList.add('crafting-recipe-in-list');
    one.dataset.tabId = data.slug;
    one.querySelector('.name').innerHTML = data.name;
    return one;
  }

  createContent() {
    const template = this.getHtmlLeftGroupedListAndRightDescriptionWindow();
    this.contentEl = this.wndEl.querySelector('.item-craft-content');
    this.contentEl.innerHTML = '';
    this.contentEl.appendChild(template);
    this.createTabContent();
  }

  createTabContent() {
    const itemCraftTabContentsEl = document.createElement('div');
    itemCraftTabContentsEl.classList.add('item-craft__tab-contents');
    const contentEl = this.contentEl.querySelector('.content');
    contentEl.innerHTML = '';
    contentEl.appendChild(itemCraftTabContentsEl);
  }

  initSearch() {
    const searchInput = this.wndEl.querySelector('.search');

    searchInput.addEventListener('keyup', () => this.startFilter());
    searchInput.setAttribute('placeholder', _t('search'));
  }

  startFilter() {
    const searchInput = this.wndEl.querySelector('.search');
    const searchValue = searchInput?.value?.trim().toLowerCase() || '';
    const allItems = this.wndEl.querySelectorAll('.one-item-on-divide-list');

    allItems.forEach(item => {
      const nameElement = item.querySelector('.name');
      const itemText = nameElement?.textContent?.toLowerCase() || '';

      const shouldShow = !searchValue || itemText.includes(searchValue);
      item.classList.toggle('hide', !shouldShow);
    });
  }

  closeAll() {
    if (this.getEngine().crafting.salvage) this.getEngine().crafting.salvage.close();
    if (this.getEngine().crafting.enhancement) this.getEngine().crafting.enhancement.close();
    if (this.getEngine().crafting.extraction) this.getEngine().crafting.extraction.close();
  }

  closeOthers(name) {
    if (this.getEngine().crafting.salvage && name !== MODULES.SALVAGE) this.getEngine().crafting.salvage.close();
    if (this.getEngine().crafting.enhancement && name !== MODULES.ENHANCEMENT) this.getEngine().crafting.enhancement.close();
    if (this.getEngine().crafting.extraction && name !== MODULES.EXTRACTION) this.getEngine().crafting.extraction.close();
  }

  getWindow() {
    return this.wndEl;
  }

  closeOtherWindows() {
    const e = this.getEngine();
    const v = e.windowsData.windowCloseConfig.CRAFTING;
    e.windowCloseManager.callWindowCloseConfig(v);
  }

  close() {
    this.closeAll();
  }

  getEngine() {
    return g;
  }

  getHtmlOneItemOnDivideList () {
    return $(`
		    <div class="one-item-on-divide-list">
        <div class="name-wrapper">
            <div class="name"></div>
        </div>
      </div>
		`)[0];
  };


  getHtmlLeftGroupedListAndRightDescriptionWindow () {
    return $(`
		  <div class="left-grouped-list-and-right-description-window">
		    <div class="columns">
          <div class="left-column">
<!--            <div class="title"></div>-->
            <div class="filters">
              <div class="list-search">
                <input class="search" placeholder="Szukaj">
              </div>
            </div>
            <div class="items-list"></div>
          </div>
          <div class="right-column">
<!--            <div class="title"></div>-->
            <div class="content"></div>
          </div>
        </div>
      </div>
		`)[0];
  };

  getHtmlDivideListGroup () {
    return $(`
		<div class="divide-list-group">
			<div class="group-header">
				<div class="card-graphic"></div>
				<div class="label"></div>
				<div class="direction"></div>
				<div class="amount"></div>
			</div>
			<div class="group-list"></div>
		</div>
		`)[0];
  }
}
