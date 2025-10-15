const defaultOptions = {};
class Tabs {

  constructor(cards, options) {
    this.cards = cards;
    this.currentTab = null;
    this.tabElementList = {};
    this.options = Object.assign(Object.assign({}, defaultOptions), options);
    this.createContent();
    this.createCards();
  }

  createContent() {
    if (this.options.tabsEl.navEl) {
      this.navEl = this.options.tabsEl.navEl;
      this.navEl.classList.add('tabs-nav');
    }
    if (this.options.tabsEl.contentsEl) {
      this.contentsEl = this.options.tabsEl.contentsEl;
      this.contentsEl.classList.add('tabs-contents');
    }
  }

  createCards() {
    for (const key in this.cards) {
      this.createOneCard(key, this.cards[key]);
    }
  }

  createOneCard(slug, cardData) {
    let $cardTab, $cardContent;
    if (this.options.tabsEl.navEl) {
      $cardTab = drawSIButton(cardData.name)[0];
      $cardTab.classList.add(`${slug}-tab`);
    } else {
      $cardTab = cardData.tabEl;
    }

    if (isset(cardData.disabled) && cardData.disabled) {
      $cardTab.classList.add(`disabled`);
      if (cardData.disabledTip) {
        $($cardTab).tip(cardData.disabledTip);
      }
    }

    if (this.options.tabsEl.navEl) this.navEl.appendChild($cardTab);

    if (cardData.contentTargetEl) {
      $cardContent = cardData.contentTargetEl;
    } else {
      $cardContent = document.createElement('div');
      this.contentsEl.appendChild($cardContent);
    }

    this.addToTabElementList(slug, $cardTab, $cardContent);

    $cardContent.classList.add(`${slug}-content`);
    $cardContent.classList.add(`tabs-content-option`);


    $cardTab.addEventListener('click', () => {
      if ($cardTab.classList.contains('disabled')) return;

      if (cardData.initAction) {
        cardData.initAction();
      } else {
        this.activateCard(slug);
        if (cardData.afterShowFn) cardData.afterShowFn();
      }
    });
  }

  setCurrentTab(slug) {
    this.currentTab = slug;
  }

  getCurrentTab() {
    return this.currentTab;
  }

  callAfterShowFn (slug) {
    let cardData = this.cards[slug];
    if (cardData.afterShowFn) cardData.afterShowFn();
  }

  activateCard(slug) {
    this.setCurrentTab(slug);
    this.addActiveForCurrentTab(slug);
    this.removeActiveForOtherTabs(slug);
  }

  addActiveForCurrentTab(slug) {
    const $cardTab = this.getCard(slug);
    const $cardContent = this.getCardContent(slug);
    $cardTab.classList.add('active');
    $cardContent.classList.add('active');
  }

  removeActiveForOtherTabs(currentSlug) {
    const otherSlugs = Object.keys(this.tabElementList).filter(slug => slug !== currentSlug);

    otherSlugs.forEach(slug => {
        const tabElement = this.tabElementList[slug];
        tabElement.tab.classList.remove('active');
        tabElement.content.classList.remove('active');
      }
    );
  }

  addToTabElementList(slug, tab, content) {
    this.tabElementList[slug] = { tab, content };
  }

  getCard(slug) {
    return this.tabElementList[slug].tab;
  }

  getCardContent(slug) {
    return this.tabElementList[slug].content;
  }

  checkRequires() {
    for (const card in this.cards) {
      const cardData = this.cards[card];
      if (isset(cardData.disabled) && cardData.disabled) continue;

      const $cardTab = this.getCard(card);
      if (isset(cardData.requireLvl) && cardData.requireLvl && hero.getLevel() < cardData.requireLvl) {
        $cardTab.classList.add(`disabled`);
        $($cardTab).tip(this.tLang('need__lvl', 'default', { '%val%': cardData.requireLvl }));
      } else {
        $cardTab.classList.remove(`disabled`);
        $($cardTab).tip('');
      }
    }
  }

  getFirstAvailableCard () {
    for (const card in this.cards) {
      const cardData = this.cards[card];
      if (isset(cardData.disabled) && cardData.disabled) continue;
      if (this.checkOneCardRequires(card)) return card;
    }
  }

  canCardOpen (type) {
    const availableCard = this.getFirstAvailableCard();
    if (!this.checkOneCardRequires(type) && availableCard) {
      const cardData = this.cards[availableCard];
      if (cardData.initAction) {
        cardData.initAction();
      }
      return false;
    }
    return true;
  }

  checkOneCardRequires(cardName) {
    const cardData = this.cards[cardName];
    return !(isset(cardData.requireLvl) && cardData.requireLvl && hero.getLevel() < cardData.requireLvl);
  }

  tLang(name, category = 'default', val = null) {
    _t(name, val, category);
  }
}
