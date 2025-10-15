// let Templates = require('../Templates');
// let AuctionData = require('core/auction/AuctionData');
// let Storage = require('core/Storage');

function AuctionSearchItems () {

	let $auctionContent = null;
	let content = null;

	let $auctionTypeMenu   = null;
	let $itemProfMenu   = null;
	let $itemRarityMenu = null;
	let $newFilterMenu  = null;

	let storageFilters  = null;

	let AUCTION_FILTERS = 'AUCTION_FILTERS';

	let $nameItemInput = null;
	let $minPriceInput = null;
	let $maxPriceInput = null;
	let $minLevelInput = null;
	let $maxLevelInput = null;

	const init = () => {
		//$auctionContent = _$auctionContent;
		$auctionContent = g.auctions.getAuctionWindow().getContent();

		initContent();
		// getFiltersFromLocalStorage();
		initVars();
		// initChangeEventInInput();
		initAllMenus();
		initButtons();
		createPlaceHoldersInInput();
		attachKeysEventToTextInput();
	};

	const initVars = () => {
		$auctionTypeMenu = content.find('.auction-type-wrapper').find('.menu-wrapper');
		$itemProfMenu = content.find('.item-prof-wrapper').find('.menu-wrapper');
		$itemRarityMenu = content.find('.item-rarity-wrapper').find('.menu-wrapper');
		$newFilterMenu = content.find('.new-filter-wrapper').find('.menu-wrapper');

		$nameItemInput = createSiInput({cl:'name-item-input', changeClb: updateSetFilters, clearClb:updateSetFilters});
		$minPriceInput = createSiInput({cl:'min-price-input', changeClb: updateSetFilters, clearClb:updateSetFilters});
		$maxPriceInput = createSiInput({cl:'max-price-input', changeClb: updateSetFilters, clearClb:updateSetFilters});
		$minLevelInput = createSiInput({cl:'min-level-input', changeClb: updateSetFilters, clearClb:updateSetFilters, type:'number'});
		$maxLevelInput = createSiInput({cl:'max-level-input', changeClb: updateSetFilters, clearClb:updateSetFilters, type:'number'});

		content.find('.item-name-wrapper').append($nameItemInput);
		content.find('.item-price-wrapper').prepend($minPriceInput);
		content.find('.item-price-wrapper').append($maxPriceInput);
		content.find('.item-lvl-wrapper').prepend($minLevelInput);
		content.find('.item-lvl-wrapper').append($maxLevelInput);

		$nameItemInput = $nameItemInput.find('input');
		$minPriceInput = $minPriceInput.find('input');
		$maxPriceInput = $maxPriceInput.find('input');
		$minLevelInput = $minLevelInput.find('input');
		$maxLevelInput = $maxLevelInput.find('input');
	};

	const initContent = () => {
		content = g.auctions.getAuctionTemplates().get('auction-search-item');
		$auctionContent.find('.main-column-auction').prepend(content)
	};

	const createPlaceHoldersInInput = () => {
		let minPrice = g.auctions.tLang('min-price');
		let maxPrice = g.auctions.tLang('max-price');
		let minLevel = g.auctions.tLang('min-level');
		let maxLevel = g.auctions.tLang('max-level');

		createInputPlaceholder(_t('name_th', null, 'auction'), $nameItemInput);
		createInputPlaceholder(minPrice,   $minPriceInput);
		createInputPlaceholder(maxPrice,   $maxPriceInput);
		createInputPlaceholder(minLevel,   $minLevelInput);
		createInputPlaceholder(maxLevel,   $maxLevelInput);
	};

	// const getValFromMenu = ($element) => {
	// 	let v = $element.getValue();
	//
	// 	return v == undefined ? null: v;
	// };

	const getValFromInput = ($element) => {
		return $element.val();
	};

	// const getFiltersFromLocalStorage = () => {
	// 	let data = margoStorage.get(AUCTION_FILTERS, []);
	//
	// 	storageFilters = checkCorrectData(data);
	// };

	// const checkCorrectData = (data) => {
	// 	let filterKeys = AuctionData.FILTER_KEYS;
	// 	for (let k in data) {
	// 		let d = data[k]
	// 		let notExistKey = null;
	//
	// 		if (!isset(d[filterKeys.FILTER_NAME]))   notExistKey = filterKeys.FILTER_NAME;
	// 		if (!isset(d[filterKeys.MIN_LEVEL]))     notExistKey = filterKeys.MIN_LEVEL;
	// 		if (!isset(d[filterKeys.MAX_LEVEL]))     notExistKey = filterKeys.MAX_LEVEL;
	// 		if (!isset(d[filterKeys.RARITY]))        notExistKey = filterKeys.RARITY;
	// 		if (!isset(d[filterKeys.MIN_PRICE]))     notExistKey = filterKeys.MIN_PRICE;
	// 		if (!isset(d[filterKeys.MAX_PRICE]))     notExistKey = filterKeys.MAX_PRICE;
	// 		if (!isset(d[filterKeys.AUCTION_TYPE]))  notExistKey = filterKeys.AUCTION_TYPE;
	// 		if (!isset(d[filterKeys.PROF]))          notExistKey = filterKeys.PROF;
	// 		if (!isset(d[filterKeys.NAME_ITEM]))     notExistKey = filterKeys.NAME_ITEM;
	//
	// 		if (notExistKey != null) {
	// 			errorReport('AuctionSearchItems.js', 'checkCorrectData', `Key: ${notExistKey} not exist!`, d);
	// 			return []
	// 		}
	// 	}
	// 	return data;
	// };

	// const setFiltersInLocalStorage = () => {
	// 	margoStorage.set(AUCTION_FILTERS, storageFilters);
	// };

	// const addToStorageFilters = (index, filterName, minLevel, maxLevel, rarity, minPrice, maxPrice, auctionType, prof, nameItem) => {
	//
	// 	let filterKeys = AuctionData.FILTER_KEYS;
	// 	let o = {
	// 		[filterKeys.FILTER_NAME]  : filterName,
	// 		[filterKeys.MIN_LEVEL]    : minLevel,
	// 		[filterKeys.MAX_LEVEL]    : maxLevel,
	// 		[filterKeys.RARITY]       : rarity,
	// 		[filterKeys.MIN_PRICE]    : minPrice,
	// 		[filterKeys.MAX_PRICE]    : maxPrice,
	// 		[filterKeys.AUCTION_TYPE] : auctionType,
	// 		[filterKeys.PROF]         : prof,
	// 		[filterKeys.NAME_ITEM]    : nameItem
	// 	};
	//
	// 	if (index == null) 	storageFilters.push(o)
	// 	else 				storageFilters.splice(index, 0, o);
	// }

	// const removeFromStorageFilters = (index) => {
	// 	if (!storageFilters[index]) {
	// 		errorReport('AuctionSearchItems.js', 'removeFromStorageFilters', `ID not exist : ${index}`, storageFilters);
	// 		return
	// 	}
	//
	// 	storageFilters.splice(index, 1);
	// };

	const initButtons = () => {
		let $btn = createButton(_t('filter_refresh', null, 'auction'), ['green', 'small'], () => {

			//g.auctions.clearAuctionsInTableWithRecords();
			//g.auctions.getAuctionWindow().setFirstHeaderOfTable();
			g.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
			g.auctions.getAuctionWindow().setVisibleAllAuctionsInfoWrapper(false);
			g.auctions.getAuctionWindow().setVisibleAmountOfAuction(true);
		});

		$auctionContent.find('.refresh-button-wrapper').append($btn);
	};

	const attachKeysEventToTextInput = () => {
		let textInput = [

			$nameItemInput,
			$minPriceInput,
			$maxPriceInput,
			$minLevelInput,
			$maxLevelInput
		];

		for (let k in textInput) {
			attachKeyEventToOneFilter(textInput[k])
		}
	};

	const attachKeyEventToOneFilter = (oneEvent) => {
		oneEvent.on('keydown', function (e) {
			if (e.key == "Enter") {
				callFindItems();
			}
		});
	};

	const callFindItems = () => {
		//g.auctions.clearAuctionsInTableWithRecords();
		//g.auctions.getAuctionWindow().setFirstHeaderOfTable();
		g.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
	};

	const getFilterString = (_page) => {
		let tabType       = g.auctions.getActualKindOfAuction();
		let auctionMode   = g.auctions.getAuctionMode();
		let page          = _page ? _page : g.auctions.getAuctionPages().getCurrentPage();


		let filterKeys  = AuctionData.FILTER_KEYS;
		let o           = geValFromAllInput();

		changeNullToEmptyString(o);

		//lvlMin|lvlMax|prof|minRarity|priceMin|priceMax|buyType|tabType|mode|page|string
		return esc(o[filterKeys.MIN_LEVEL]) +
			'|' + esc(o[filterKeys.MAX_LEVEL]) +
			'|' + o[filterKeys.PROF] +
			'|' + o[filterKeys.RARITY] +
			'|' + esc(o[filterKeys.MIN_PRICE]) +
			'|' + esc(o[filterKeys.MAX_PRICE]) +
			'|' + o[filterKeys.AUCTION_TYPE] +
			'|' + tabType +
			'|' + auctionMode +
			'|' + page +
			'|' + esc(o[filterKeys.NAME_ITEM]);
	};

	const changeNullToEmptyString = (obj) => {
		for (let k in obj) {
			if (obj[k] == null) obj[k] = '';
		}
	};

	const geValFromAllInput = () => {
		let minLevel = getValFromInput($minLevelInput);
		let maxLevel = getValFromInput($maxLevelInput);
		let minPrice = getValFromInput($minPriceInput);
		let maxPrice = getValFromInput($maxPriceInput);
		let nameItem = getValFromInput($nameItemInput);

		let rarity      = $itemRarityMenu.getValue();
		let auctionType = $auctionTypeMenu.getValue();
		let prof 		= $itemProfMenu.getValue();

		minLevel = isNaN(parseInt(minLevel)) ? null : parsePrice(minLevel);
		maxLevel = isNaN(parseInt(maxLevel)) ? null : parsePrice(maxLevel);
		minPrice = isNaN(parseInt(minPrice)) ? null : parsePrice(minPrice);
		maxPrice = isNaN(parseInt(maxPrice)) ? null : parsePrice(maxPrice);

		nameItem = nameItem == '' ? null : nameItem;

		let filterKeys = AuctionData.FILTER_KEYS;

		return {
			[filterKeys.NAME_ITEM]    : nameItem,
			[filterKeys.MIN_LEVEL]    : minLevel,
			[filterKeys.MAX_LEVEL]    : maxLevel,
			[filterKeys.PROF]    	    : prof,
			[filterKeys.MIN_PRICE]    : minPrice,
			[filterKeys.MAX_PRICE]    : maxPrice,
			[filterKeys.RARITY]       : rarity,
			[filterKeys.AUCTION_TYPE] : auctionType
		}
	};

	// const initChangeEventInInput = () => {
	// 	$nameItemInput.on('change', ()=> {overrideFilterAction()});
	// 	$minPriceInput.on('change', ()=> {overrideFilterAction()});
	// 	$maxPriceInput.on('change', ()=> {overrideFilterAction()});
	// 	$minLevelInput.on('change', ()=> {overrideFilterAction()});
	// 	$maxLevelInput.on('change', ()=> {overrideFilterAction()});
	// }

	const initAllMenus = () => {

		let typeAucionMenu = [
			//{text:'Typ aukcji', val: AuctionData.TYPE_OF_BUY_AUCTION.ALL},
			{text: _t('auction_type', null, 'auctions'), val: AuctionData.TYPE_OF_BUY_AUCTION.ALL},
			{text: _t('au_catmybids', null, 'auction'), 	val: AuctionData.TYPE_OF_BUY_AUCTION.BIDS},
			{text: _t('filter_buyout', null, 'auction'), val: AuctionData.TYPE_OF_BUY_AUCTION.BUY_NOW},
		];

		let rarityMenuItem = [
			{text: _t('rarity', null, 'auctions'), val: null},
			{text: getTextType("all"), 			val: AuctionData.TYPE_OF_RARITY.ALL},
			{text: getTextType("unique"), 		val: AuctionData.TYPE_OF_RARITY.UNIQUE},
			{text: getTextType("heroic"), 		val: AuctionData.TYPE_OF_RARITY.HEROIC},
			{text: getTextType("legendary"), 	val: AuctionData.TYPE_OF_RARITY.LEGENDARY}
		];

		let profMenuItem = [
			{text: g.auctions.tLang('filter_prof'), 	val: null},
			{text: getTextProf("warrior"), 				val: "w"},
			{text: getTextProf("paladin"), 				val: "p"},
			{text: getTextProf("mage"), 				val: "m"},
			{text: getTextProf("hunter"), 				val: "h"},
			{text: getTextProf("bdancer"), 				val: "b"},
			{text: getTextProf("tracker"), 				val: "t"}
		];

		createSiMenu($itemProfMenu, profMenuItem, null, function (e) {
			console.log('asd');
			updateSetFilters()
		});

		createSiMenu($auctionTypeMenu, typeAucionMenu, null, function (e) {
			updateSetFilters();
		});

		createSiMenu($itemRarityMenu, rarityMenuItem, null, function (e) {
			updateSetFilters()
		});

		// updateNewFilterMenu();
	};

	const updateSetFilters = () => {
		callFindItems();
		g.auctions.getAuctionWindow().setVisibleAllAuctionsInfoWrapper(false);
		g.auctions.getAuctionWindow().setVisibleAmountOfAuction(true);
		// overrideFilterAction();
	}

	// const overrideFilterAction = () => {
	// 	return;
	// 	let index = $newFilterMenu.getValue();
	//
	// 	$newFilterMenu.getValue();
	//
	// 	if (index == AuctionData.FILTER_ID.EMPTY_FILTER || index == AuctionData.FILTER_ID.ADD_FILTER) return;
	//
	// 	if (!checkFilterExist(index)) {
	// 		errorReport('AuctionSearchItems.js', 'overrideFilterAction', `Filter index not exist! : ${index}`, storageFilters);
	// 		return;
	// 	}
	//
	// 	let filterName = getFilterNameByIndex(index);
	//
	// 	updateFilterFromLocalStorage(filterName, index);
	// };

	// const updateFilterFromLocalStorage = (filterName, index) => {
	//
	// 	let data        = geValFromAllInput();
	// 	let filterKeys  = AuctionData.FILTER_KEYS;
	//
	// 	removeFromStorageFilters(index)
	//
	// 	addToStorageFilters(
	// 		index,
	// 		filterName,
	// 		data[filterKeys.MIN_LEVEL],
	// 		data[filterKeys.MAX_LEVEL],
	// 		data[filterKeys.RARITY],
	// 		data[filterKeys.MIN_PRICE],
	// 		data[filterKeys.MAX_PRICE],
	// 		data[filterKeys.AUCTION_TYPE],
	// 		data[filterKeys.PROF],
	// 		data[filterKeys.NAME_ITEM]
	// 	)
	// 	setFiltersInLocalStorage();
	// };

	// const createDataToNewFilterMenu = () => {
	//
	// 	let newFilterMenuItem = [];
	//
	// 	newFilterMenuItem.push({text: _t('no_filter', null, 'auction'), val: AuctionData.FILTER_ID.EMPTY_FILTER});
	//
	// 	for (let index in storageFilters) {
	// 		let d = storageFilters[index];
	// 		let filterName    = d[AuctionData.FILTER_KEYS.FILTER_NAME];
	// 		let removeClb     = getRemoveCallbackToNewFilterItem(index, d);
	//
	// 		newFilterMenuItem.push({
	// 			text  : filterName,
	// 			val   : index,
	// 			remove: {txt: _t('delete'), clb:removeClb},
	// 		})
	// 	}
	//
	// 	newFilterMenuItem.push({text: '+', tip: _t('new_filter', null, 'ah_filter_history'), disableSelected: true, val: AuctionData.FILTER_ID.ADD_FILTER});
	//
	// 	return newFilterMenuItem;
	// };

	// const getRemoveCallbackToNewFilterItem = (index, data) => {
	// 	return () => {
	// 		let str = _t('confirm_delete_filter', {'%val%': data.FILTER_NAME}, 'ah_filter_history');
	// 		confirmWithCallback({
	// 			msg: str,
	// 			clb: () => {
	// 				removeFromStorageFilters(index);
	// 				setFiltersInLocalStorage()
	// 				updateNewFilterMenu();
	// 			}
	// 		});
	// 	}
	// };

	// const updateNewFilterMenu = () => {
	// 	let newFilterMenuItem = createDataToNewFilterMenu();
	//
	// 	$newFilterMenu.empty();
	// 	createSiMenu($newFilterMenu, newFilterMenuItem, true, function (value) {
	//
	// 		clickNewFilterMenu(value)
	//
	// 	});
	// };

	// const clickNewFilterMenu = (value) => {
	// 	if (value == AuctionData.FILTER_ID.EMPTY_FILTER) {
	// 		setClearFilter();
	// 		callFindItems();
	// 		return;
	// 	}
	//
	// 	if (value == AuctionData.FILTER_ID.ADD_FILTER) createPopupToWriteNameOfNewFilter();
	// 	else {
	// 		setFilterAction(value);
	// 		callFindItems();
	// 	}
	// };

	// const createPopupToWriteNameOfNewFilter = () => {
	//
	// 	confirmWitchTextInput(_t('give_filter_name', null, 'auction'), (val) => {
	// 		if (checkNameOfFilterExist(val)) {
	// 			message('Filter name already exist!');
	// 			return;
	// 		}
	// 		addFilterAction(val);
	// 	});
	// };

	// const checkNameOfFilterExist = (name) => {
	// 	for (let k in storageFilters) {
	// 		if (storageFilters[k].FILTER_NAME == name) return true
	// 	}
	// 	return false;
	// };

	// const addFilterAction = (filterName) => {
	// 	let data        = geValFromAllInput();
	// 	let filterKeys  = AuctionData.FILTER_KEYS;
	//
	// 	addToStorageFilters(
	// 		null,
	// 		filterName,
	// 		data[filterKeys.MIN_LEVEL],
	// 		data[filterKeys.MAX_LEVEL],
	// 		data[filterKeys.RARITY],
	// 		data[filterKeys.MIN_PRICE],
	// 		data[filterKeys.MAX_PRICE],
	// 		data[filterKeys.AUCTION_TYPE],
	// 		data[filterKeys.PROF],
	// 		data[filterKeys.NAME_ITEM]
	// 	)
	// 	setFiltersInLocalStorage();
	// 	updateNewFilterMenu();
	// };

	// const setFilterAction = (val) => {
	// 	if (!checkFilterExist(val)) {
	// 		errorReport('AuctionSearchItems', 'setFilterAction', `Filter not exist: ${val}`, storageFilters);
	// 		return
	// 	}
	//
	// 	setFilterByIdFilter(val);
	// };

	// const checkFilterIdExist = (id) => {
	// 	return isset(storageFilters[id])
	// };

	// const setFilterByIdFilter = (id) => {
	// 	let data        = copyStructure(storageFilters[id]);
	//
	// 	changeNullToEmptyString(data);
	//
	// 	setFilterByDataObject(data)
	// };

	// const setClearFilter = () => {
	// 	let filterKeys  = AuctionData.FILTER_KEYS;
	// 	setFilterByDataObject({
	// 		[filterKeys.NAME_ITEM]    : '',
	// 		[filterKeys.MIN_LEVEL]    : '',
	// 		[filterKeys.MAX_LEVEL]    : '',
	// 		[filterKeys.MIN_PRICE]    : '',
	// 		[filterKeys.MAX_PRICE]    : '',
	// 		[filterKeys.RARITY]       : '',
	// 		[filterKeys.PROF]         : '',
	// 		[filterKeys.AUCTION_TYPE] : AuctionData.TYPE_OF_BUY_AUCTION.ALL,
	// 	})
	// }

	// const setFilterByDataObject = (data) => {
	//
	// 	let filterKeys  = AuctionData.FILTER_KEYS;
	//
	// 	$nameItemInput.val(data[filterKeys.NAME_ITEM]);
	// 	$minPriceInput.val(data[filterKeys.MIN_PRICE]);
	// 	$maxPriceInput.val(data[filterKeys.MAX_PRICE]);
	// 	$minLevelInput.val(data[filterKeys.MIN_LEVEL]);
	// 	$maxLevelInput.val(data[filterKeys.MAX_LEVEL]);
	//
	// 	$nameItemInput.trigger('change');
	// 	$minPriceInput.trigger('change');
	// 	$maxPriceInput.trigger('change');
	// 	$minLevelInput.trigger('change');
	// 	$maxLevelInput.trigger('change');
	//
	// 	$auctionTypeMenu.setOptionWithoutCallbackByValue(data[filterKeys.AUCTION_TYPE]);
	// 	$itemProfMenu.setOptionWithoutCallbackByValue(data[filterKeys.PROF]);
	// 	$itemRarityMenu.setOptionWithoutCallbackByValue(data[filterKeys.RARITY]);
	// }

	// const checkFilterExist = (index) => {
	// 	return storageFilters[index] ? true : false
	// };

	// const getFilterNameByIndex = (index) => {
	// 	return storageFilters[index][AuctionData.FILTER_KEYS.FILTER_NAME];
	// };

	function getTextProf(val) {
		return _t("prof_" + val, null, "auction");
	}

	function getTextType (val) {
		return _t("type_" + val, null, "auction");
	}

	// this.geValFromAllInput = geValFromAllInput;
	this.getFilterString = getFilterString;
	this.init = init;
};