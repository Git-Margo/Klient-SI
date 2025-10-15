function disableItemsManager() {

	this.CONST = {
		AUCTION:"AUCTION"
	}

	this.allKinds = ['mail', 'shop', 'barter', 'salvage', 'enhance', 'enhance-ingr', 'extraction', 'bonus-reselect', this.CONST.AUCTION];

	this.allDisableItemStats = null;
	this.allDisableItemClass = null;
	this.allAllowItemClass   = null;
	this.allEnableTpl        = null;
	this.disableExpiresStat  = null;
	this.disableEq           = null;
	this.disabledItems 			 = [];

	this.activeDisableKinds  = {};

	this.init = () => {
		this.initAllDisableKinds()
	};

	this.testExpires = () => {
		for (let k in this.allDisableItemStats) {
			let oneDisableKind = this.allDisableItemStats[k];

			if (oneDisableKind.includes('expires')) {
				console.error('[DisableItemsManager.js, testExpires] Stat expires is forbidden');
				return;
			}

		}
	};

	this.testKinds = (obj) => {
		for (let i = 0; i < this.allKinds.length; i++) {
			let kind = this.allKinds[i];
			if (!obj.hasOwnProperty(kind)) {
				console.error("[DisableItemsManager.js, testKinds] Has not property:", kind, obj);
				console.trace();
				return;
			}
		}
	};

	this.initAllDisableKinds = () => {
		this.allDisableItemStats = { // for disable items with below stats
			'mail'    : ['permbound', 'soulbound'],
			'shop'    : [],
			'barter'  : [],
			'salvage' : ['cursed', 'artisan_worthless', {
				'lvl': ['<', 20]
			}],
			'enhance': ['cursed', {
				'lvl': ['<', 20]
			}],
			'enhance-ingr': ['cursed', 'artisan_worthless', {
				'lvl': ['<', 20]
			}],
			'extraction': [],
			'bonus-reselect': [],
			[this.CONST.AUCTION]:['noauction', 'permbound'],
		};

		this.allAllowItemStats = { // for disable all items exclude with below stats
			'mail'    : [],
			'shop'    : [],
			'barter'  : [],
			'salvage' : [],
			'enhance' : [],
			'enhance-ingr': [],
			'extraction': ['enhancement_upgrade_lvl'],
			'bonus-reselect': ['bonus'],
			[this.CONST.AUCTION]:[],
		};

		this.allDisableItemClass = { // for disable items with below classes
			'mail'    : [],
			'shop'    : [17, 19, 25, 26, 27],
			'barter'  : [],
			'salvage' : [],
			'enhance' : [],
			'enhance-ingr' : [],
			'extraction' : [],
			'bonus-reselect': [],
			[this.CONST.AUCTION]: [17, 18, 19, 25, 26, 27],
		};

		this.allAllowItemClass = { // for disable all items exclude with below classes
			'mail'    : [],
			'shop'    : [],
			'barter'  : [],
			'salvage' : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29],
			'enhance' : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29],
			'enhance-ingr' : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29],
			'extraction': [], // Array from 1 to 14
			'bonus-reselect': [],
			[this.CONST.AUCTION]:[],
		};

		this.allEnableTpl = {
			'mail'    : null,         // if null --> all item names are enable
			'shop'    : null,         // If [4234, 4234] --> only enable tpl: 4234, 4234
			'barter'  : null,         // This array is add dynamically --> this.startSpecificItemKindDisable second argument
			'salvage' : null,
			'enhance' : null,
			'enhance-ingr' : null,
			'extraction' : null,
			'bonus-reselect': null,
			[this.CONST.AUCTION]:null
		};

		this.enableLinkedConditions = {
			'mail'    : null,
			'shop'    : null,
			'barter'  : null,
			'salvage' : null,
			'enhance' : null,
			'enhance-ingr' : [
				{classes: [26], stats :['enhancement_add']},
				{classes: [26], stats :['enhancement_add_point']},
			],
			'extraction' : null,
			'bonus-reselect': null,
			[this.CONST.AUCTION]:null
		};

		// if stat expires EXIST in item

		// option:

		// expires true  => disabled expires items,
		// expires false => disabled not expires items,
		// expires null  => ignore expires, and not expires items

		this.disableExpiresStat = {
			'mail'    : null,
			'shop'    : null,
			'barter'  : true,
			'salvage' : 'all',
			'enhance' : 'all',
			'enhance-ingr' : 'all',
			'extraction' : null,
			'bonus-reselect': null,
			[this.CONST.AUCTION]:null
		};

		this.disableEq = {
			'mail'         : false,
			'shop'         : false,
			'barter'       : false,
			'salvage'      : true,
			'enhance'      : false,
			'enhance-ingr' : true,
			'extraction'   : true,
			'bonus-reselect': true,
			[this.CONST.AUCTION]:null
		};

		// this.testKinds(this.allDisableItemStats);
		this.testKinds(this.allAllowItemStats);
		// this.testKinds(this.allDisableItemClass);
		this.testKinds(this.allAllowItemClass);
		this.testKinds(this.allEnableTpl);
		this.testKinds(this.disableExpiresStat);
		this.testKinds(this.disableEq);
		this.testExpires();
	};

	this.addToActiveDisableKinds = (disableKind) => {
		this.activeDisableKinds[disableKind] = true;
	};

	this.removeFromActiveDisableKinds = (disableKind) => {
		delete this.activeDisableKinds[disableKind];
	};

	this.addDisableClassToItem = ($item, kind) => {
		$item.addClass(kind + '-disable disable-item-mark');
		this.addDisableIcon($item);
	};

	this.addDisableIcon = ($item) => {
		if ($item.find('.choose-icon').length) return; // don't disable item if is checked now

		let cl           = 'disable-icon';
		let $disableIcon = $item.find(`.${cl}`)

		if (!$disableIcon.length) {
			let $icon = $('<div>').addClass(cl);
			$item.append($icon);
		}
	};

	this.removeDisableIcon = ($item) => {
		$item.find('.disable-icon').remove();
	};

	this.prepareClassToDisable = (purchase) => {
		let canBuy = purchase.split(',');
		let classToDisable = Array.from(new Array(27), (x, index) => index + 1);

		while (canBuy.length) {
			let val = parseInt(canBuy[0]);
			let index = classToDisable.indexOf(val);

			if (index > -1) classToDisable.splice(index, 1);

			canBuy.splice(0, 1);

		}

		return classToDisable;
	};

	// this.isPremiumShop = () => {
	// 	return Engine.shop && Engine.shop.getPremiumShop();
	// };
	//
	// this.isOnlyBuyShop = () => {
	// 	return Engine.shop && Engine.shop.isOnlyBuyShop();
	// };

	this.checkShopItemShouldBeDisable = (item) => {
		let purchase = get_shop_purchase();

		if (purchase == '*' ) return false;
		else {

			if (purchase == '') return true;
			else {

				let classToDisable = this.prepareClassToDisable(purchase);
				if (classToDisable.indexOf(item.cl) > -1) return true;

			}
		}

		return false;
	};

	this.manageItemDisableInHeroEQ = (item, $itemView) => {
		this.manageItemDisable(item, $itemView, this.activeDisableKinds);
	}

	this.manageItemDisable = (item, $itemView, activeDisableKinds) => {
		let linkedConditionsFulfilled = this.checkLinkedConditionsFulfilled(activeDisableKinds, item);
		if (linkedConditionsFulfilled) return;

		let arrayResult = this.createArrayResult(activeDisableKinds, item)

		for (let k in arrayResult) {
			let result = arrayResult[k];
			if (result) this.addDisableClassToItem($itemView, result);
		}
	};

	this.checkRequires = (item, activeDisableKinds) => {

		let linkedConditionsFulfilled = this.checkLinkedConditionsFulfilled(activeDisableKinds, item);
		if (linkedConditionsFulfilled) return true;

		let arrayResult = this.createArrayResult(activeDisableKinds, item)

		for (let k in arrayResult) {
			if (arrayResult[k]) return true
		}

		return  false;
	};

	this.createArrayResult = (activeDisableKinds, item) => {
		let arrayResult = [];

		arrayResult.push(this.checkShops(activeDisableKinds, item));
		arrayResult.push(this.checkStats(activeDisableKinds, item));
		arrayResult.push(this.checkStats(activeDisableKinds, item, false));
		arrayResult.push(this.checkExpires(activeDisableKinds, item));
		arrayResult.push(this.checkClass(activeDisableKinds, item));
		arrayResult.push(this.checkClass(activeDisableKinds, item, false));
		arrayResult.push(this.checkEq(activeDisableKinds, item));
		arrayResult.push(this.checkTpl(activeDisableKinds, item));

		return arrayResult;
	}

	this.checkShops = (activeDisableKinds, item) => {

		if (this.activeDisableKinds['shop']) {                              //shop have difference disable class of items...
			if (is_only_buy_shop()) return false
			let shouldBeDisable = this.checkShopItemShouldBeDisable(item);
			if (shouldBeDisable) {
				// this.addDisableClassToItem($itemView[0], 'shop');
				return 'shop';
			}
		}
		return false
	};

	this.checkStats = (activeDisableKinds, item, disableClass = true) => {
		for (let k in activeDisableKinds) {

			if (!this.checkDisableKindExist(k))      return false;
			if (k == 'shop' && is_only_buy_shop()) continue;

			let statsToItemDisable  = disableClass ? this.allDisableItemStats[k] : this.allAllowItemStats[k];

			for (let j = 0; j < statsToItemDisable.length; j++) {
				let oneStat = statsToItemDisable[j]; // one stat or object of stats e.g "{ 'lvl': { '<', 20 } }"

				if (
					!this.statCheckCanDisabled(item, oneStat) && disableClass ||
					this.statCheckCanDisabled(item, oneStat) && !disableClass
				) {
					continue;
				}
				//this.addDisableClassToItem($itemView[0], k);
				return k;
				// return;
			}

		}
		return false;
	};

	this.checkStat = (itemStats, oneStat) => {
		return itemStats.hasOwnProperty(oneStat);
	};

	this.statCheckCanDisabled = (item, oneStat) => {
		let itemStats           = parseItemStat(item.stat);
		if (typeof oneStat === 'object') {
			for (const stat in oneStat) {
				if (this.checkStat(itemStats, stat)) {
					const
						[ operator, value ] = oneStat[stat],
						itemStatValue = itemStats[stat];
					if (count(operator, itemStatValue, value )) return true; // e.g (itemLvl < lvl)
				} else {
					return true;
				}
			}
		} else {
			if (this.checkStat(itemStats, oneStat)) return true;
		}
		return false;
	};

	this.checkClass = (activeDisableKinds, item, disableClass = true) => {
		for (let k in activeDisableKinds) {

			if (!this.checkDisableItemClassNameExist(k)) return false;

			let disableItemClassData  = disableClass ? this.allDisableItemClass[k] : this.allAllowItemClass[k];

			if (k == 'shop' && is_only_buy_shop()) continue;
			if (!disableItemClassData.length)        continue;

			if (
				(disableItemClassData.indexOf(item.cl) > -1 && disableClass) ||
				(disableItemClassData.indexOf(item.cl) === -1 && !disableClass)
			) {
				// this.addDisableClassToItem($itemView[0], k);
				return k;
			}
		}
		return false
	};

	this.checkExpires = (activeDisableKinds, item) => {
		let itemStats           = parseItemStat(item.stat);
		for (let k in activeDisableKinds) {

			if (!this.checkDisableItemClassNameExist(k)) return false;

			let expiresData  = this.disableExpiresStat[k];

			if (k == 'shop' && is_only_buy_shop()) continue;
			if (expiresData == null)                 continue;
			if (!this.checkStat(itemStats, 'expires')) continue;

			let isExpired = checkItemExpires(item);

			switch (expiresData) {
				case null:
					break;
				case true:
					if (isExpired) {
						// this.addDisableClassToItem($itemView[0], k);
						return k;
					}
					break;
				case false:
					if (!isExpired) {
						// this.addDisableClassToItem($itemView[0], k);
						return k;
					}
					break;
				case 'all': // all expire items should be disabled (with expires stat)
					// this.addDisableClassToItem($itemView[0], k);
					return k;
				default :
					console.error('[DisableItemsManager.js, checkExpires] BAD TYPE EXPIRES OPTION', expiresData);
					return false
			}

		}
		return false;
	};

	this.checkEq = (activeDisableKinds, item) => {
		for (let k in activeDisableKinds) {
			if (!this.checkDisableKindExist(k)) return false;
			if (this.disableEq[k] === null) continue;
			if (item.st !== 0 && this.disableEq[k]) return k;
		}
		return false;
	}

	this.createResultItemData = ($itemView, disableKind) => {
		return  {
			itemView:$itemView[0],
			disableKind:disableKind
		}
	}

	this.checkTpl = (activeDisableKinds, item) => {
		for (let k in activeDisableKinds) {
			if (this.allEnableTpl[k] != null) {

				if (!this.allEnableTpl[k].includes(item.tpl)) {
					//this.addDisableClassToItem($itemView[0], k);
					return k;
				}

			}
		}
		return false
	};

	this.checkLinkedConditionsFulfilled = (activeDisableKinds, item) => {
		for (let k in activeDisableKinds) {
			if (this.enableLinkedConditions[k] != null) {

				for (let kk in this.enableLinkedConditions[k]) {

					let record = this.enableLinkedConditions[k][kk]
					let result = this.checkOneLinkedRecord(record, item);

					if (result) return true;
				}

			}
		}
		return false
	};

	this.checkOneLinkedRecord = (record, item) => {
		let arrayResult = [];

		if (record.stats) {
			let a = [];

			for (let i = 0; i < record.stats.length; i++) {
				let oneStat = record.stats[i];
				a.push(this.statCheckCanDisabled(item, oneStat));
			}

			let statResult = this.checkIsArrayWithAllTheSameVal(a, true);
			arrayResult.push(statResult);
		}

		if (record.classes) {
			arrayResult.push(record.classes.includes(item.cl));
		}

		return this.checkIsArrayWithAllTheSameVal(arrayResult, true);
	}

	this.checkIsArrayWithAllTheSameVal = (a, val) => {
		return a.every((x) => {return x == val});
	}

	this.getEnabledItems = () => {
		const hItems = getHItems();
		return Object.keys(hItems)
			.map(Number)
			.filter((value) => !this.disabledItems.includes(value))
	};

	this.startSpecificItemKindDisable = (disableKind, enableTplArray) => {
		if (!this.checkDisableKindExist(disableKind)) return;

		this.addToActiveDisableKinds(disableKind);

		let hItems = getHItems();

		if (enableTplArray) this.addToEnableTplByKind(disableKind, enableTplArray);

		for (let k in hItems) {
			let $view = $('#item' + k);
			if (!$view.length) return console.warn('[DisableItemsManager.js, startSpecificItemKindDisable] $view not find', k);
			this.manageItemDisable(hItems[k], $view, this.activeDisableKinds);
		}
	};

	this.endSpecificItemKindDisable = (disableKind) => {
		if (!this.checkDisableKindExist(disableKind)) return;

		this.removeFromActiveDisableKinds(disableKind);

		this.removeFromEnableTpl(disableKind);

		this.manageOfDeleteDisableItemMarkClass(disableKind);
	};

	this.manageOfDeleteDisableItemMarkClass = (disableKind) => {
		let cl = disableKind + '-disable';

		let $disableItemsTab = $('.' + cl);
		let self = this;

		$disableItemsTab.removeClass(cl);
		$disableItemsTab.each(function () {

			for (let i = 0; i < self.allKinds.length; i++) {
				let kind = self.allKinds[i];
				if ($(this).hasClass(kind+ '-disable')) return
			}
			$(this).removeClass('disable-item-mark');
			self.removeDisableIcon($(this))

		});
	};


	this.addToEnableTplByKind = (kind, tplArray) => {
		this.allEnableTpl[kind] = tplArray;
	};

	this.removeFromEnableTpl = (kind) => {
		this.allEnableTpl[kind] = null;
	};

	this.checkDisableKindExist = (disableKind) => {
		let statsToItemDisable = this.allDisableItemStats[disableKind];
		if (statsToItemDisable) return true;
		else {
			console.error('[DisableItemsManager.js, checkDisableKindExist] Bad disable kind!!! ', disableKind);
			return false;
		}
	};

	this.checkDisableItemClassNameExist = (disableItemClassName) => {
		let disableItemClassData = this.allDisableItemClass[disableItemClassName];
		if (disableItemClassData) return true;
		else {
			console.error('[DisableItemsManager.js, checkDisableItemClassNameExist] Bad disable ItemClass!!! ', disableItemClassName);
			return false;
		}
	};

};
