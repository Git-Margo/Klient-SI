class BonusSelectorWindow {

    constructor({ bonuses, itemId, fromReselect = false }) {
        g.windowCloseManager.callWindowCloseConfig(g.windowsData.windowCloseConfig.BONUS_SELECTOR)
        this.initWindow();
        this.itemId = itemId;
        this.fromReselect = fromReselect; // open this window by reselect or context menu
        this.wndEl.querySelector('.enhance__info').innerHTML = _t('info4', null, 'enhancement');
        this.bonusSelectorEl = this.wndEl.querySelector('.enhance__bonus');
        this.bonusSelectorEl.innerHTML = '';
        this.bonusSelector = new BonusSelector(this.bonusSelectorEl, {
            itemId: itemId,
            onSubmitClb: this.onSubmit.bind(this)
        });
        this.bonusSelector.createBonusChoose(bonuses);
        this.getEngine().lock.add('bonus-selector');
        this.windowOpen();
    }

    initWindow() {
        this.wndEl = $('#bonus-selector-wnd')[0]

        const closeEl = this.wndEl.querySelector('.close-but');
        closeEl.addEventListener('click', this.close.bind(this));

        this.setTitle();
    }

    setTitle() {
        const title = goldTxt(_t('select_bonus', null, 'item'), true);
        this.wndEl.querySelector('.bonus-selector-wnd__title').innerHTML = title;
    };

    onSubmit(result, selectedBonus) {
        if (result) {
            const request = this.fromReselect
              ? `bonus_reselect&action=select&item=${this.itemId}&bonusIdx=${selectedBonus}`
              : `moveitem&st=2&id=${this.itemId}&bonusIdx=${selectedBonus}`;
            _g(request);
        }
        this.close();
    }

    windowOpen() {
        this.wndEl.style.display = 'block';
        this.opened = true;

        // $(this.wndEl).absCenter();
        this.wndEl.style.top = '120px';
        this.wndEl.style.left = '86px';
    }

    windowClose() {
        this.wndEl.style.display = 'none';
        this.opened = false;
    }

    close() {
        this.windowClose();
        this.getEngine().lock.remove('bonus-selector');
        this.getEngine().bonusSelectorWindow = false;
    }

    tLang(name, category = 'enhancement') {
        return _t(name, null, category);
    }

    getEngine() {
        return g;
    }

};
