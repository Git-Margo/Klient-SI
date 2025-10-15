class BonusSelector {
    constructor(wrapperEl, _options) {
        this.wrapperEl = wrapperEl;
        this.selected = null;
        this.defaultOptions = {
            onSelectedClb: false,
            ownSubmitBtn: false,
            itemId: false,
            onSubmitClb: false
        };
        this.options = Object.assign(Object.assign({}, this.defaultOptions), _options);
        this.createContent();
    }

    createContent() {
        this.el = this.getBonusSelectorTpl();
        this.bonusesEl = this.el.querySelector('.bonus-selector__bonuses');
        this.buttonsContainerEl = this.el.querySelector('.bonus-selector__submit');
    }

    createBonusChoose(bonuses) {
        let i = 0;
        this.bonusesEl.innerHTML = '';

        for (const bonus of bonuses) {
            const radio = this.getRadioTpl();
            let [name, values] = bonus;
            const input = radio.querySelector('input');
            const label = radio.querySelector('label');
            setAttributes(input, {
                id: name,
                name: 'enhance-bonus',
                value: i
            });
            label.setAttribute('for', name);
            label.innerHTML = this.bonusStatsParser(name, values.split(',')); //`${bonusName} - +${bonusValue}`;

            this.bonusesEl.appendChild(radio);
            input.addEventListener('change', this.onSelected.bind(this));
            i++;
        }

        if (!this.options.ownSubmitBtn) this.createButtons();
        this.wrapperEl.appendChild(this.el);
    }

    onSelected(e) {
        this.selected = parseInt(e.target.value);
        if (!this.options.ownSubmitBtn) this.setStateSubmitButton();
        if (this.options.onSelectedClb && typeof this.options.onSelectedClb === "function") this.options.onSelectedClb(this.selected);
    }

    createButtons() {
        this.buttonsContainerEl.innerHTML = '';
        this.createConfirmButton();
        this.createCancelButton();
    }

    createConfirmButton() {
        const opts = {
            txt: this.tLang('accept', 'buttons'),
            onClick: this.confirmOnClick.bind(this)
        };
        this.submitBtnEl = drawSIButton(opts.txt)[0];
        this.submitBtnEl.classList.add('disable');
        this.submitBtnEl.addEventListener('click', opts.onClick);

        this.buttonsContainerEl.appendChild(this.submitBtnEl);
    }

    createCancelButton() {
        const opts = {
            txt: this.tLang('cancel', 'buttons'),
            onClick: this.cancelOnClick.bind(this)
        };
        this.cancelBtnEl = drawSIButton(opts.txt)[0];
        this.cancelBtnEl.addEventListener('click', opts.onClick);

        this.buttonsContainerEl.appendChild(this.cancelBtnEl);
    }

    confirmOnClick() {
        const text = this.tLang('confirm-prompt');

        mAlert(text, 1, [
            () => this.submit(),
            () => {}
        ]);
    }

    cancelOnClick() {
        if (this.options.onSubmitClb && typeof this.options.onSubmitClb === 'function') this.options.onSubmitClb(false);
    }

    setStateSubmitButton() {
        if (this.selected !== null) {
            this.enableSubmitButton();
        } else {
            this.disableSubmitButton();
        }
    }

    enableSubmitButton() {
        this.submitBtnEl.classList.remove('disable');
    }

    disableSubmitButton() {
        this.submitBtnEl.classList.add('disable');
    }

    submit() {
        if (typeof this.options.onSubmitClb === 'function' && this.selected != null)
            this.options.onSubmitClb(true, this.selected);
    }

    bonusStatsParser(statName, statValues) {
        const prefix = '(+',
            suffix = ')';
        let unit = '';
        let trans;

        switch (statName) {
            case 'critmval':
                unit = '%';
                trans = _t("bonus_of-".concat(statName, " %val%"), createTransVal(statValues[0], unit, prefix, suffix), 'newOrder');
                break;

            case 'sa':
                trans = _t('no_percent_bonus_sa %val%', createTransVal(statValues[0] / 100, unit, prefix, suffix));
                break;

            case 'ac':
                trans = _t("item_".concat(statName, " %val%"), createTransVal(statValues[0], unit, prefix, suffix));
                break;

            case 'act':
            case 'resfire':
            case 'reslight':
            case 'resfrost':
                unit = '%';
                trans = _t("item_".concat(statName, " %val%"), createTransVal(statValues[0], unit, prefix, suffix), 'newOrder');
                break;

            case 'crit':
            case 'critval':
            case 'resdmg':
                unit = '%';
                trans = _t("bonus_".concat(statName, " %val%"), createTransVal(statValues[0], unit, prefix, suffix), 'newOrder');
                break;

            case 'slow':
                trans = _t("bonus_".concat(statName, " %val%"), createTransVal(statValues[0] / 100, unit, prefix, suffix));
                break;
            case 'enfatig':
            case 'manafatig':
                trans = _t(`bonus_${statName}`, {
                    ...createTransVal(statValues[0], '%', prefix, suffix, '%val1%'),
                    ...createTransVal(statValues[1], unit, prefix, suffix, '%val2%')
                });
                break;

            default:
                trans = _t("bonus_".concat(statName, " %val%"), createTransVal(statValues[0], unit, prefix, suffix));
        }

        return trans;
    }

    getBonusSelectorTpl () {
        return $(`
        <div class="bonus-selector">
            <div class="bonus-selector__bonuses"></div>
            <div class="bonus-selector__submit"></div>
        </div>`)[0]
    }

    getRadioTpl () {
        return $(`
        <div class="radio-custom">
            <input type="radio" id="xxx" name="xxx">
            <label for="xxx"></label>
        </div>`)[0]
    }

    tLang(name, category = 'enhancement', params = null) {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, params, category) : '';
    }

}
