function barter () {

	let content;
	this.items = {};

	this.barterId         = null;
	this.barterName       = null;

	this.desireItemId     = null;

	this.lastCreatedId    = null;

	this.showAffectedOfferId = null;

	this.barterOffersData     = null;
	this.barterOwnedData      = null;
	this.barterAvailableData  = null;
	this.barterUsagesData     = null;

	this.allParseOffers   = null;
	this.allCategories    = null;

	this.haveReagentsList = null;
	this.needReagentsList = null;

	this.init = function () {
		g.windowCloseManager.callWindowCloseConfig(g.windowsData.windowCloseConfig.BARTER)
		this.initWindow();
		this.initLabels();
		this.initFetch();
		this.blockMove();
		this.initSelect();
		this.initSearch();
		this.initStartLvl();
		this.initStopLvl();
		//this.initScrollsBar();
		this.createSafeCheckbox();
	};

	this.createSafeCheckbox = () => {
		const containerEl = content[0].querySelector('.safe-mode');
		const checkbox = new Checkbox(
			{
				label: _t('safe'),
				id: 'safe-mode-barter',
				checked: g.settingsOptions.isExchangeSafeMode(),
				highlight: false
			},
			(state) => this.onSelected(state),
		);
		const checkboxEl = checkbox.getCheckbox();
		containerEl.appendChild(checkboxEl);
		$(containerEl).tip(_t('exchange-safe-tip'))
		containerEl.setAttribute('data-tip-type', 't-left');
	}

	this.onSelected = (state) => {
		this.sendSafeModeState(state)
	}

	this.sendSafeModeState = (state) => {
		_g(`barter&action=safemode&enabled=${Number(state)}`)
	}

	this.initStartLvl = function () {
		var $search = this.wnd.$.find('.start-lvl');
		$search.keyup(() => {
			this.startFilter();
		});
	};

	this.initStopLvl = function () {
		var $search = this.wnd.$.find('.stop-lvl');
		$search.keyup(() => {
			this.startFilter();
		});
	};

	this.initLabels = () => {
		this.wnd.$.find('.recipe-list-label').html(goldTxt("Lista wymian", true));
		this.wnd.$.find('.recipe-reagent-label').html(goldTxt('Reagenty', true));
		this.wnd.$.find('.recipe-lvl').html('Lvl');
		//<div class="recipe-title"></div>


	};

	this.updateTitle = () => {
		var title = goldTxt(this.barterName, true);
		this.wnd.$.find('.recipe-title').html(title);
	};

	this.initWindow = () => {
		var title = 'Barter';
		content = this.getHtmlLeftGroupedListAndRightDescriptionWindow();
		content.find('.item-changer-label').html(goldTxt(title));
		this.wnd = {};
		this.wnd.$ = content;
		$('#barter-window').replaceWith(this.wnd.$);
		$('#barter-window').css('display', 'block');
		this.wnd.$.find('.close-but').click(() => {
			this.close();
		})
	};

	this.initFetch = function () {
		g.tplsManager.fetch('f', this.createBarterItem);
	};

	this.addToCategories = (offer, item) => {
		let cl    = item.cl;
		let id    = item.id;
		let name  = item.name;

		this.items[id] = item;

		if (!this.allCategories.hasOwnProperty(cl)) this.allCategories[cl] = [];

		offer.category       = cl;
		offer.resultItemName = name;

		this.allCategories[cl].push(offer);
	};

	this.updateItem = (item) => {

		let id = item.id;

		for (let i = 0; i < this.allParseOffers.length; i++) {
			let checkOffer = this.allParseOffers[i];

			for (let k = 0; k < checkOffer.recived.length; k++) {

				let recivedId = checkOffer.recived[k][0];

				if (recivedId == id) this.addToCategories(checkOffer, item);

			}

		}

	};

	this.createBarterItem = (i) => {
		this.items[i.id] = i;

		let stats = parseItemStat(i.stat);

		this.setItemType(i, stats);
	};

	this.createAllCategoriesDisableAndEnable = () => {
		let allCategoriesDisableAndEnable = {};

		for (let k in this.allCategories) {
			allCategoriesDisableAndEnable[k] = {
				enable    : [],
				disable   : []
			};
			let oneCategory = this.allCategories[k];
			for (let i = 0; i < oneCategory.length; i++) {

				let oneOfferData = oneCategory[i];

				if (oneOfferData.maxAmount)  allCategoriesDisableAndEnable[k].enable.push(oneOfferData);
				else                         allCategoriesDisableAndEnable[k].disable.push(oneOfferData);
			}
		}

		for (let k in allCategoriesDisableAndEnable) {
			allCategoriesDisableAndEnable[k].disable.sort(this.compare);
			allCategoriesDisableAndEnable[k].enable.sort(this.compare);
		}

		return allCategoriesDisableAndEnable;
	};

	this.buildRecipeList = () => {
		let allCategoriesDisableAndEnable = this.createAllCategoriesDisableAndEnable();
		this.cleanList();

		this.drawAllRecipesOnList(allCategoriesDisableAndEnable);
		this.countRecipesPerGroup();
	};

	this.drawAllRecipesOnList = (allCategoriesDisableAndEnable) => {
		for (let k in allCategoriesDisableAndEnable) {
			let oneCategory = allCategoriesDisableAndEnable[k];

			for (let i = 0; i < oneCategory.enable.length; i++) {
				let oneOfferData = oneCategory.enable[i];
				let $oneOfferOnList = this.createOneOfferOnList(oneOfferData);
				this.createGroupElement(oneOfferData, $oneOfferOnList)
			}

			for (let i = 0; i < oneCategory.disable.length; i++) {
				let oneOfferData = oneCategory.disable[i];
				let $oneOfferOnList = this.createOneOfferOnList(oneOfferData);
				this.createGroupElement(oneOfferData, $oneOfferOnList)
			}
		}
	};

	this.compare = (a, b) => {
		const nameA = a.resultItemName.toUpperCase();
		const nameB = b.resultItemName.toUpperCase();

		let comparison = 0;

		if (nameA > nameB)      comparison = 1;
		else if (nameA < nameB) comparison = -1;

		return comparison;
	};

	this.createOneOfferOnList = (data) => {
		let amount = data.maxAmount;
		let resultItemId = data.recived[0][0];
		let resultItem  = this.items[resultItemId];

		let $one        = (this.getHtmlOneItemOnDivideList()).addClass('crafting-recipe-in-list ' + (amount ? 'enabled' : 'disabled'));
		let amountStr   = amount > 0 ? ' (' + amount +')' : '';

		$one.addClass('offer-id-' + data.id);
		$one.addClass('affectedId-id-' + data.affectedId);
		$one.find('.name').html(data.resultItemName + amountStr);

		this.createAttrToCraftingRecipe($one, resultItem);
		this.recipeClick($one, data);
		return $one;
	};

	this.createAttrToCraftingRecipe = ($recipe, itemData) => {
		let reqp      = 'all';
		let typeItem  = 'all';
		let cls       = ['unique', 'heroic', 'legendary'];
		let stats     = parseItemStat(itemData.stat);

		if (isset(stats.lvl)) $recipe.attr('lvl', stats.lvl);
		if (isset(stats.reqp)) reqp = stats.reqp;

		for (var i = 0; i < cls.length; i++) { // @ToDo - remove this loop after rarity changes
			if (itemData.itemTypeName === cls[i]) typeItem = cls[i];
		}

		$recipe.attr('typeItem', typeItem);
		$recipe.attr('reqp', reqp);
	};

	this.recipeClick = function (recipe, data) {
		recipe.click((e) => {
			e.stopPropagation();
			this.showAffectedOfferId = data.affectedId;
			this.createOffer(data);
		});
	};

	this.createOffer = (data) => {
		var $header = this.getHtmlCraftingDescriptionHeader();
		var $reagents = this.getCraftingDescriptionReagents();
		var buttonTpl = this.getHtmlRecipeDescriptionButton();
		var $button = $('<button>' + _t('use_it', null, 'item') + '</button>');

		let recivedId     = data.recived[0][0];
		let recivedAmount = data.recived[0][1];
		let item          = this.items[recivedId];

		this.desireItemId = recivedId;

		let $icon = this.createViewItem(item);
		var $itemSlot = $header.find('.result-item');


		g.tplsManager.changeItemAmount(item, $icon, recivedAmount);
		$icon.attr('data-tip-type', item.$.data('tipType'));
		$icon.attr('data-item-type', item.$.data('itemType'));
		$icon.data('item', item);

		$itemSlot.append($icon);

		this.rightClickItem($icon, item, false);

		let limitCell = this.createLimitCell(data);
		limitCell = limitCell != '-' ? ('<br><span class="limit-cell">' + _t('limit', null, 'item_changer') + limitCell + '</span>') : '';

		let itemType = item.itemType;

		$header.find('.recipe-name').addClass(itemType).html(item.name + limitCell);

		const sortedReagents = this.sortReagents(data.required);
		this.createReagents($reagents, sortedReagents);
		this.createCost($reagents, data);
		this.useRecipeBtn($button, data);

		buttonTpl.find('.use-recipe-btn').append($button);

		let $w = this.wnd.$;

		$w.find('.choose-recipe').css('display', 'block');
		$w.find('.recipe-header').html($header);
		$w.find('.recipe-wrapper').empty();
		$w.find('.choose-recipe').find('.recipe-description-button').remove();
		$w.find('.recipe-wrapper').append($reagents);
		$w.find('.recipe-wrapper').append(buttonTpl);
		$w.find('.right-column').find('.crafting-cost-panel').remove();
		$w.find('.bottom-row-panel').find('.do-recipe').find('.button').remove();
		$w.find('.bottom-row-panel').find('.do-recipe').append($button);

		this.markChooseOffer();
		this.manageEnableClassOfButton();
	};

	this.sortReagents = (reagents) => reagents.sort(([a],[b]) => { // destructuring a & b (first value = reagentId)
		a = this.items[a];
		b = this.items[b];
		return b.itemTypeSort - a.itemTypeSort || // sort by type
			b.pr - a.pr ||                        // sort by price
			a.name.localeCompare(b.name)          // sort alphabetically
	});

	this.markChooseOffer = () => {
		let cl = 'mark-offer';
		this.wnd.$.find('.' + cl).removeClass(cl);
		this.wnd.$.find('.affectedId-id-' + this.showAffectedOfferId).addClass(cl);
	};


	 this.setItemType = (item, stats) => {
		 let itemType = {
			'heroic'      : 't-her',
			'upgraded'  :'t-upgraded',
			'elite'     : 't-uniupg',
			'unique'    : 't-uniupg',
			'legendary' : 't-leg',
			'artefact'  : 't-art',
			'common'    : 't-norm' // must be last
		};

		for (let k in itemType) {
			if (!isset(stats[k]) && k !== 'common') continue;
			item.itemType = itemType[k];
			return;
		}
	};

	this.rightClickItem = ($icon, item, block) => {
		$icon.bind('contextmenu', function (e, mE) {
			item.createOptionMenu(getE(e, mE), false, block);
		});
	};

	this.useRecipeBtn = function ($button, data) {
		var str = _t('use_it', null, 'item');
		$button.find('.label').html(str);

		$button.bind('click',  () => {
			this.askAlert(data);
		})

	};

	this.createLimitCell = (data, breakLine) => {
		if (!data.limit) return '-';

		//console.log(data);

		var u = this.findUsagesById(data.id);
		var uVal = u ? u : 0;

		var br = breakLine ? '<br>' : ' ';

		switch (data.limit.period) {
			case 0:
				return '-';
			case 1:
				return uVal + '/' + data.limit.max + br + _t('on_day');
			case 2:
				return uVal + '/' + data.limit.max + br + _t('on_week');
			case 3:
				return uVal + '/' + data.limit.max + br + _t('on_month');
            case 4:
                const dayOrDays = data.limit.limitPeriodDays > 1 ? _t('days') : _t('day')
                return uVal + '/' + data.limit.max + _t('on') + data.limit.limitPeriodDays + br + dayOrDays;
		}
	};

	this.findUsagesById = (id) => {
		for (let i = 0; i < this.barterUsagesData.length; i++) {
			let oneUsage = this.barterUsagesData[i];
			if (oneUsage[0] == id) return oneUsage[1];
		}
		return null;
	};

	this.getAmountAvailable = function (offerId, tplId) {

		for (let i = 0 ; i < this.barterAvailableData.length; i++) {

			let barterOffer = this.barterAvailableData[i];

			if (barterOffer.offerId == offerId) {

				if (!barterOffer.hasOwnProperty('tplId')) return barterOffer.count;
				else {
					if (barterOffer.tplId == tplId) return barterOffer.count;
				}

			}

		}

		return 0;


		//return this.availableOffersAmount[offerId] ? this.availableOffersAmount[offerId] : null;
	};

	this.askAlert = (data) => {
		const [[requiredId]] = data.required;
		let offerId = data.id;

		let limitTxt = data.limit ? (_t('limit', null, 'item_changer') + '<b>' + this.createLimitCell(data)  + '</b><br>') : '';

		let txt = _t('accept_barter_offer') + '<br>' + limitTxt;

		mAlert(txt, 1, [
			() => data.mode === 2 ? this.doBarter(offerId, requiredId) : this.doBarter(offerId),
			() => {
				console.log('none');
			}
		]);
	};

	this.doBarter = (offerId, requiredId) => {
		const required = isset(requiredId) ? `&requiredId=${requiredId}` : '';
		_g(`barter&id=${this.barterId}&offerId=${offerId}&action=use&usesCount=1&available=0&desiredItem=${this.desireItemId}${required}`);
	};

	this.setCostInData = (data, dataAlert) => {

		dataAlert['m'] = 'yesno4';

	};

	this.initSelect = () => {
		//var $r = $('#barter');
		var prof = {
			all: _t('prof_all', null, 'eq_prof'),
			m: _t('prof_mag', null, 'eq_prof'),
			w: _t('prof_warrior', null, 'eq_prof'),
			p: _t('prof_paladyn', null, 'eq_prof'),
			t: _t('prof_tracker', null, 'eq_prof'),
			h: _t('prof_hunter', null, 'eq_prof'),
			b: _t('prof_bladedancer', null, 'eq_prof')
		};
		var $select1 = this.wnd.$.find('.choose-prof');

		for (var k in prof) {
			var $option = $('<option>').attr('val', k).html(prof[k]);
			$select1.append($option)
		}

		var type = {
			all: 				_t('type_all' , null, 'auction'),
			unique: 		_t('type_unique' , null, 'auction'),
			heroic: 		_t('type_heroic' , null, 'auction'),
			legendary: 	_t('type_legendary' , null, 'auction')
		};

		var $select2 = this.wnd.$.find('.choose-item-type');
		for (var k in type) {
			$select2.append($('<option>').attr('val', k).html(type[k]))
		}

		$select1.change(()=> {
			this.startFilter();
		});
		$select2.change(()=> {
			this.startFilter();
		});

		this.wnd.$.find('.start-lvl').attr('placeholder', _t('start'));
		this.wnd.$.find('.stop-lvl').attr('placeholder', _t('stop'));
	};

	this.initSearch = () => {
		let $searchInput = this.wnd.$.find('.search');
		let $searchX = this.wnd.$.find('.search-x');

		$searchInput.keyup(() => {
			this.startFilter()
		});
		$searchInput.attr('placeholder', _t('search'));

		$searchX.bind('click', () => {
			$searchInput.val('').blur().trigger('keyup');
		});
	};

	this.startFilter = () => {
		this.wnd.$.find('.one-item-on-divide-list').removeClass('hide');
		this.searchKeyUp();
		this.lvlKeyUp();
		this.getValueFromProf();
		this.getValueFromItemType();
		this.countRecipesPerGroup();
		//this.updateScroll();
	};

	this.searchKeyUp = () => {
		let v = this.wnd.$.find('.search').val();
		let $allRecipes = this.wnd.$.find('.one-item-on-divide-list');
		if (v == '') {}
		else {
			$allRecipes.each(function () {
				let txt = ($(this).find('.name').html()).toLowerCase();
				let disp = txt.search(v.toLowerCase()) > - 1 ? true : false;
				disp ? $(this).removeClass('hide') : $(this).addClass('hide');
			});
		}
	};

	this.lvlKeyUp = () => {
		let v1 = this.wnd.$.find('.start-lvl').val();
		let v2 = this.wnd.$.find('.stop-lvl').val();
		let $allRecipes = this.wnd.$.find('.one-item-on-divide-list');
		if (v1 == '' && v2 == '') return;
		else {
			if (v1 == '') v1 = 0;
			if (v2 == '') v2 = 1000;
			$allRecipes.each(function () {
				if ($(this).css('display') == 'none') return;
				let lvl = $(this).attr('lvl');
				let disp = lvl >= parseInt(v1) && lvl <= parseInt(v2) ? true : false;
				disp ? $(this).removeClass('hide') : $(this).addClass('hide');
			});
		}
	};

	this.getValueFromProf = () => {
		let val = this.wnd.$.find('.choose-prof option:selected').attr('val');
		if (val == 'all') return;
		let $allRecipes = this.wnd.$.find('.one-item-on-divide-list');
		$allRecipes.each(function () {
			if ($(this).css('display') == 'none') return;
			let reqp = $(this).attr('reqp');
			let disp = reqp.indexOf(val) > -1 ? true : false;
			disp ? $(this).removeClass('hide') : $(this).addClass('hide');
		});
	};

	this.getValueFromItemType = () => {
		let val = this.wnd.$.find('.choose-item-type option:selected').attr('val');
		if (val == 'all') return;
		let $allRecipes = this.wnd.$.find('.one-item-on-divide-list');
		$allRecipes.each(function () {
			if ($(this).css('display') == 'none') return;
			let typeItem = $(this).attr('typeitem');
			var disp;
			switch (val) {
				case 'unique' :
					if (typeItem == 'unique' || typeItem == 'heroic' || typeItem == 'legendary') disp = true;
					else disp = false;
					break;
				case 'heroic' :
					if (typeItem == 'heroic' || typeItem == 'legendary') disp = true;
					else disp = false;
					break;
				case 'legendary' :
					if (typeItem == 'legendary') disp = true;
					else disp = false;
					break;
			}
			disp ? $(this).removeClass('hide') : $(this).addClass('hide');
		});
	};

	this.countRecipesPerGroup = () => {
		let $groups = this.wnd.$.find('.divide-list-group');
		$groups.each(function(index, el) {
			let $el = $(el);
			let amount = $el.find('.group-list .one-item-on-divide-list:not(.hide)').length;
			$(el).find('.amount').html(amount);
		});
	};

	this.createCost = ($costPanel, data) => {
		if (!data.cost) {
			$costPanel.find('.crafting-cost-wrapper').html('-');
			return;
		}

		//var $costCell = tpl.get('cost-wrapper');
		var $costCell = this.getHtmlCostWrapper();
		switch (data.cost.currency) {
			case 1:
				var $reagent = this.createCostReagent(_t('gold'), data.cost.value, hero.gold, 'money-icon');
				$costPanel.append($reagent);
				break;
			case 2:
				var $reagent = this.createCostReagent(_t('stat-credits'), data.cost.value, hero.credits, 'draconite-icon');
				$costPanel.append($reagent);
				break;
				break;
			case 3:
				let have = this.lookForOwnedById(data.cost.itemTpl);
				var $reagent = this.createCostReagent(false, data.cost.value, have, false, data.cost.itemTpl);
				$costPanel.append($reagent);
				break;
			case 4:
				var $reagent = this.createCostReagent(_t('stat-honor'), data.cost.value, hero.honor, 'honor-icon');
				$costPanel.append($reagent);
				//$costCell.append($costCell.append($cost));
				break;
			default:
				console.error('bad', data.cost.currency)
		}
		$costPanel.find('.crafting-cost-wrapper').append($costCell);
	};

	this.setCostAvailableData = function($el, value = true) {
		$el.attr('data-cost-available', value);
	};

	this.createViewItem = (item) => {
		return g.tplsManager.getClone(item.id, item.loc);
	};

	this.createReagents = ($reagentsWrapper, required) => {
		let oneUseReagentsArray = [];

		this.clearHaveReagentsList();
		this.clearNeedReagentsList();

		for (var i = 0; i < required.length; i++) {
			let id          = required[i][0];
			let need        = required[i][1];
			let item        = this.items[id];
			let $icon       = this.createViewItem(item);
			let $reagent    = this.getHtmlCraftingReagent();
			let $itemSlot   = $reagent.find('.item-slot');
			let amountItem  = checkItemStat(item, 'amount');


			let owned = 0;
			let have  = 0;

			let itemType = item.itemType;

			$icon.addClass('pattern-item');
			$icon.find('small').remove();

			if (amountItem) need  = need * getAmountItem(item);

			this.setNeedReagentsList(id, need);

			let $have = $reagent.find('.have');
			let $need = $reagent.find('.need');

			this.setLabelWithRoundVal($have, have);
			this.setLabelWithRoundVal($need, need);

			$reagent.find('.item-name').addClass(itemType).html(item.name);
			$itemSlot.addClass('reagent-tpl-' + id);
			$itemSlot.append($icon);

			this.rightClickItem($icon, item, false);

			let canFind = true;

			while (canFind) {
				let correctItem = this.findOneReagent(id, oneUseReagentsArray);
				canFind = false;
				if (correctItem) {
					canFind = true;

					if (amountItem)               owned = owned + getAmountItem(correctItem);
					if (!amountItem) owned++;

					if (have >= need) continue;

					if (amountItem)               have = have + getAmountItem(correctItem);
					if (!amountItem) have++;

					this.setBarterItem(correctItem, $itemSlot);

				}
			}

			this.setHaveReagentsList(id, have);

			let $ownedItems = $reagent.find('.owned-items');
			this.setLabelWithRoundVal($ownedItems, owned, 'Posiadane: ');

			$reagentsWrapper.find('.reagents-list').append($reagent);
		}
	};

	this.setLabelWithRoundVal = ($el, val, prefix) => {
		if (val > 9995) $el.tip(val);
		else $el.tip('');
		let _prefix = prefix ? prefix : '';
		$el.html(_prefix + round(val, 4));
	};

	this.setHaveReagentsList = (tplId, amount) => {
		this.haveReagentsList[tplId] = amount;
	};

	this.createCostReagent = (nameCurrency, need, have, cl, itemTpl) => {
		let $reagent  = this.getHtmlCraftingReagent();
		let $itemSlot = $reagent.find('.item-slot');

		let $icon;
		let currency;

		$reagent.addClass('currency-reagent')

		if (cl) {
			$icon = this.getHtmlCostItemComponent();
			$icon.find('.icon').addClass(cl);
		}

		if (itemTpl) {
			let item  = this.items[itemTpl];
			$icon     = this.createViewItem(item);
			currency  = item.name;
			$icon.addClass('currency-item');
		}

		if (nameCurrency) currency = nameCurrency;

		let value = have > need ? need : have;

		let $ownedItems = $reagent.find('.owned-items');
		let $have       = $reagent.find('.have');
		let $need       = $reagent.find('.need');

		this.setLabelWithRoundVal($ownedItems, have, 'Posiadane: ');
		this.setLabelWithRoundVal($have, value);
		this.setLabelWithRoundVal($need, need);

		$reagent.find('.item-name').html(currency);
		$itemSlot.append($icon);
		return $reagent
	};

	this.getItemSlot = (tplId) => {
		let $wrapper = this.wnd.$.find('.reagent-tpl-' + tplId);

		return $wrapper;
	};

	this.setBarterItem = (itemData, $itemSlot) => {
		let id          = itemData.id;
		let tplId       = itemData.tpl;
		let $icon2      = $('#item' + id).clone(false);
		let amountItem  = checkItemStat(itemData, 'amount');
		let fillAllItems    = $itemSlot;

		if (!$itemSlot) $itemSlot = this.getItemSlot(tplId);

		let $reagentWrapper = $itemSlot.closest('.reagent-wrapper');

		$itemSlot.append($icon2);

		$icon2.css({left:0, top:0});

		let have = this.getHaveReagentsList(tplId);

		if (amountItem)               have = have + getAmountItem(itemData);
		if (!amountItem) have++;

		this.setHaveReagentsList(tplId, have);

		let $have = $reagentWrapper.find('.have');

		this.setLabelWithRoundVal($have, have);

		if (!fillAllItems) {
			this.manageEnableClassOfButton();
		}
	};

	this.clearHaveReagentsList = () => {
		this.haveReagentsList = {};
	};

	this.getHaveReagentsList = (tplId) => {
		if (!this.haveReagentsList.hasOwnProperty(tplId)) return 0;
		return this.haveReagentsList[tplId];
	};

	this.setHaveReagentsList = (tplId, amount) => {
		this.haveReagentsList[tplId] = amount;
	};

	this.clearNeedReagentsList = () => {
		this.needReagentsList = {};
	};

	this.setNeedReagentsList = (tplId, amount) => {
		this.needReagentsList[tplId] = amount;
	};

	this.checkCanUseOffer = () => {

		for (let tplId in this.needReagentsList) {
			let need = this.needReagentsList[tplId];
			let have = this.haveReagentsList[tplId];
			if (have < need) return false;
		}

		return (this.getOfferAvailableByCost() ? true : false);
	};

	this.manageEnableClassOfButton = () => {
		let canUseOffer = this.checkCanUseOffer() ? true : false;
		let $button = this.wnd.$.find('.choose-recipe').find('.use-recipe-btn').find('button');
		$button.removeAttr('disabled');
		if (canUseOffer) return;
		$button.attr('disabled', 'disabled');
	};

	this.fixItemsData = (hItems, newItems) => {
		let mergeItems = {};
		let addItemsFromNewItems = {};

		for (let itemId in hItems) {

			if (newItems.hasOwnProperty(itemId)) {

				if (!newItems[itemId].hasOwnProperty('del')) mergeItems[itemId] = newItems[itemId];

				addItemsFromNewItems[itemId] = true;

			} else mergeItems[itemId] = hItems[itemId];

		}

		for (let id in newItems) {

			if (addItemsFromNewItems.hasOwnProperty(id)) continue;
			mergeItems[id] = newItems[id];

		}

		return mergeItems;
	};

	this.findOneReagent = (tplId, _missIdItemsArrays) => {
		let hItems            = getHItems();
		let confusing         = ['upg', 'soulbound', 'lowreq', 'opis2', 'timelimit_upgs', 'lvlupgs', 'recovered'];
		let tmpConfuseItem    = null;
		let tmpConfuseAmount  = null;
		let missIdItemsArrays = _missIdItemsArrays ? _missIdItemsArrays : [];

		let newItems = lookForInLoadQueue('newItem');     //
																											//  Big problem with items... After used barter offer, hItems is
		if (newItems) {                                   //  not updated here. So... I need take data from g.loadQueue
			hItems = this.fixItemsData(hItems, newItems);   //  and merge hItems and newItems...
		}                                                 //

		for (let k in hItems) {
			let item      = hItems[k];

			if (!item.hasOwnProperty('id')) item.id = k;

			let id        = item.id;
			let stats     = parseItemStat(item.stat);

			if (item.st > 0)                                      continue;
			if (missIdItemsArrays.includes(id))                   continue;
			if (item.tpl != tplId)                                continue;
			//if (item.haveStat('expires') && item.checkExpires())  continue;
			if (checkItemStat(item, 'expires') && checkItemExpires(item))  continue;

			let confuseStatsAmount = this.getAmountOfConfuseStats(confusing, stats);
			if (confuseStatsAmount) {

				if (tmpConfuseAmount == null || tmpConfuseAmount > confuseStatsAmount) {
					tmpConfuseAmount = confuseStatsAmount;
					tmpConfuseItem = item;
				}

			} else {
				missIdItemsArrays.push(id);
				return item;
			}
		}

		if (tmpConfuseItem) {
			missIdItemsArrays.push(tmpConfuseItem.id);
			return tmpConfuseItem;
		}

		return null;
	};

	this.getAmountOfConfuseStats = (confuseStatsArray, itemStatsObject) => {
		let confuseStatsAmount = 0;
		for (let i = 0; i < confuseStatsArray.length; i++) {
			let oneStat = confuseStatsArray[i];
			if (itemStatsObject.hasOwnProperty(oneStat)) confuseStatsAmount++;
		}
		return confuseStatsAmount;
	};

	this.lookForOwnedById = (id) => {
		for (let i = 0; i < this.barterOwnedData.length; i++) {
			let _id = this.barterOwnedData[i][0];
			if (id == _id) return this.barterOwnedData[i][1];
		}
		return 0;
	}

	this.createGroupElement = (oneOfferData, $oneOfferOnList) => {

		let category = oneOfferData.category;
		let $offerGroup = this.wnd.$.find('.group-' + category);
		let $offerGroupHeader;

		if ($offerGroup.length < 1) {;
			$offerGroup = this.getHtmlDivideListGroup();
			$offerGroupHeader = $offerGroup.find('.group-header');

			$offerGroup.addClass(`group-${category} active`);
			$offerGroup.find('.label').html(_t('au_cat' + category, null, 'auction'));
			this.wnd.$.find('.recipe-list').append($offerGroup);
			$offerGroupHeader.click(function () {
				$offerGroup.toggleClass('active');
			});
		}
		$offerGroup.find('.group-list').append($oneOfferOnList);
	};

	this.cleanList = function () {
		var $w = this.wnd.$;
		$w.find('.recipe-list').empty();
	};

	this.update = (v, d) => {
		this.barterId             = v.id;
		this.barterName           = v.name;

		this.barterOffersData     = v.offers;
		this.barterOwnedData      = v.owned;
		this.barterAvailableData  = v.available;
		this.barterUsagesData     = v.usages;

		this.allCategories = {};
		this.lastCreatedId = 0;

		this.updateTitle();

		this.createOffers();

		for (let k in this.items) {
			let item = this.items[k];
			this.updateItem(item);
		}

		this.buildRecipeList();

		if (this.showAffectedOfferId != null) this.showAgainClickOffer();
	};

	this.showAgainClickOffer = () => {
		for (let i = 0; i < this.allParseOffers.length; i++) {
			if (this.showAffectedOfferId == this.allParseOffers[i].affectedId ){
				this.createOffer(this.allParseOffers[i]);
				return;
			}
		}
	};

	this.getOfferAvailableByCost = () => {
		for (let i = 0; i < this.allParseOffers.length; i++) {
			if (this.showAffectedOfferId == this.allParseOffers[i].affectedId ){
				return this.allParseOffers[i].maxAmount;
			}
		}
		console.warn('not find')
		return 0;
	};

	this.createOffers = () => {
		this.allParseOffers = [];
		for (let i = 0 ; i < this.barterOffersData.length; i++) {

			let oneDataOffer = this.barterOffersData[i];

			switch (oneDataOffer.mode) {
				case 1:
					this.prepareNormalOffer(oneDataOffer);
					break;
				case 2:
					this.prepareChooseOneRequiredFromBigRequiredListOffer(oneDataOffer);
					break;
				default:
					return console.error('bad offer mode:', oneDataOffer.mode);
			}

		}
	};

	this.prepareNormalOffer = (oneDataOffer) => {
		let recived = oneDataOffer.recived;

		for (let i = 0; i < recived.length; i++) {
			let oneRecived = recived[i];

			let maxAmount    = this.getAmountAvailable(oneDataOffer.id);

			let newOffer = {
				id              : oneDataOffer.id,
				affectedId      : this.lastCreatedId,
				mode            : oneDataOffer.mode,
				required        : oneDataOffer.required,
				recived         : [oneRecived],
				maxAmount       : maxAmount,
				category        : null,
				resultItemName  : null
			};

			this.lastCreatedId++;

			if (oneDataOffer.limit) newOffer.limit = oneDataOffer.limit;
			if (oneDataOffer.cost)  newOffer.cost = oneDataOffer.cost;

			this.allParseOffers.push(newOffer);
		}

	};

	this.prepareChooseOneRequiredFromBigRequiredListOffer = (oneDataOffer) => {
		let required     = oneDataOffer.required;

		for (let i = 0; i < required.length; i++) {
			let oneRequired = required[i];
			let requiredId  = oneRequired[0];

			let maxAmount    = this.getAmountAvailable(oneDataOffer.id, requiredId);

			let newOffer = {
				id              : oneDataOffer.id,
				affectedId      : this.lastCreatedId,
				mode            : oneDataOffer.mode,
				required        : [oneRequired],
				recived         : oneDataOffer.recived,
				category        : null,
				maxAmount       : maxAmount,
				resultItemName  : null
			};

			this.lastCreatedId++;

			if (oneDataOffer.limit) newOffer.limit = oneDataOffer.limit;
			if (oneDataOffer.cost)  newOffer.cost = oneDataOffer.cost;

			this.allParseOffers.push(newOffer);
		}
	};

	this.blockMove = function () {
		g.lock.add('barter');
	};

	this.unblockMove = function () {
		g.lock.remove('barter');
	};

	this.close = () => {
		this.unblockMove();
		this.wnd.$.empty();
		$('#barter-window').css('display', 'none');

		g.tplsManager.removeCallback('f', this.createBarterItem);
		g.tplsManager.deleteMessItemsByLoc('f');
		delete (this.wnd);
		g.barter = false;
	}

	this.getHtmlOneItemOnDivideList = function () {
		return $(`
		    <div class="one-item-on-divide-list">
        <div class="name-wrapper">
            <div class="name"></div>
        </div>
      </div>
		`);
	};


	this.getHtmlLeftGroupedListAndRightDescriptionWindow = function () {
		return $(`
		<div id="barter-window">


				<div class="recipe-title"></div>
				<div class="recipe-list-label"></div>
				<div class="safe-mode"></div>
				<div class="recipe-reagent-label"></div>
				<div class="recipe-list-search">
					<input class="search" placeholder="Szukaj">
					<div class="recipe-lvl"></div>
				</div>
				<div class="recipe-header"></div>
				<div class="recipe-list"></div>
				<div class="choose-recipe">
					<div class="reagent-list-label"></div>
					<div class="recipe-wrapper"></div>
				</div>
				<input class="start-lvl" val=""/>
				<input class="stop-lvl" val=""/>
				<select class="choose-item-type"></select>
				<select class="choose-prof"></select>
				<div class="close-but"></div>
				</div>
		`);
	};

	this.getCraftingDescriptionReagents = () => {
		return $(`
			<div class="recipe-description-reagents">
				<div class="reagents-list"></div>
			</div>
		`);
	};

	this.getHtmlCraftingDescriptionHeader = () => {
		return $(`
			<div class="recipe-description-header">
				<div class="item-name-wrapper">
					<div class="result-item item-slot"></div>
					<div class="recipe-name"></div>
				</div>
			</div>
		`)
	};

	this.getHtmlCostWrapper = () => {
		return $(`
			<div class="cost-wrapper"></div>
		`);
	};

	this.getHtmlCostItem = () => {
		return $(`
		    <div class="cost-item">
        <div class="item-wrapper"></div>
        <div class="require-state">
            <div class="require-state-inner">
                <span class="current-owned"></span><span class="seperator">/</span><span class="need-to-use"></span>
            </div>
        </div>
      </div>
		`);
	};

	this.getHtmlCraftingReagent = () => {
		return $(`
			<div class="recipe-reagent">
          <div class="reagent-wrapper">
              <div class="item-reagent-wrapper">
                  <div class="item-reagent item-slot"></div>
              </div>
              <div class="reagent-info">
                  <div class="item-name"></div>
                  <div class="amount-items">
                      <span class="have"></span>/<span class="need"></span>
                  </div>
              </div>
              <div class="owned-items"></div>
          </div>
      </div>
		`);
	};

	this.getHtmlCostItemComponent = () => {
		return $(`
			<div class="cost-icon-component">
          <div class="cost-icon-wrapper">
              <div class="text"></div>
              <div class="cost"></div>
              <div class="icon"></div>
          </div>
      </div>
		`);
	};

	this.getHtmlDivideListGroup = () => {
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
		`);
	}

	this.getHtmlRecipeDescriptionButton = () => {
		return $(`
			<div class="recipe-description-button">
				<div class="use-recipe-btn"></div>
			</div>
		`);
	}

}
