function itemChanger () {
	var self = this;
	var content;
	var available = [];
	var owned = [];
	var usages = [];
	var allOfferts = true;
	var idBarter = null;
	var nameBarter = null;
	var barterItems = {};
	this.wnd = null;

	this.init = function () {
		this.initWindow();
		this.initFetch();
		this.initTableHeader();
		//this.initScroll();
		this.initSelect();
		this.initStartLvl();
		this.initStopLvl();
		this.initCheckbox();
		this.initClose()
		this.wnd.$.find('.filter-label').html('Lvl:');
		g.lock.add('itemChanger');
	};

	this.initClose = function () {
		this.wnd.$.find('.close-but').click(function () {
			self.close();
		});
	};

	this.initCheckbox = function () {
		//var $checkbox = tpl.get('one-checkbox');
		var $checkbox = $('<div>').addClass('my-checkbox');
		var $txt = $('<div>').html(_t('available_barter')).addClass('label');
		$checkbox.append($txt);
		self.wnd.$.find('.bottom-item-changer-panel').append($checkbox);
		$checkbox.click(function () {
			$(this).toggleClass('active');
			allOfferts = !$(this).hasClass('active');
			_g('barter&id=' + idBarter + '&action=show&available=' + (allOfferts ? 0 : 1));
		})
	};

	this.createRecords = function (ob, addClass) {
		var $tr = $('<tr>');
		for (var i = 0; i < ob.length; i++) {
			var $td = $('<td>').html(ob[i]);
			if (typeof addClass == 'object') {
				$td.addClass(addClass[i]);
			} else {
				$td.addClass(addClass);
			}
			$tr.append($td);
		}
		return $tr;
	};

	this.initFetch = function () {
		g.tplsManager.fetch('f', self.createBarterItem);
	};

	this.initTableHeader = function () {
		var $table = self.wnd.$.find('.static-bar-table');
		$table.append(self.createRecords(
			[
				_t('cost_table'),
				_t('item', null, 'recover'),
				//'Limit',
				_t('action', null, 'recover')
			],
			[
				'barter-table-header cost-cell',
				'barter-table-header item-cell',
				//'barter-table-header limit',
				'barter-table-header action'
			]));
	};

	this.initWindow = function () {
		var title = 'Barter';
		content = self.getTplItemChanger();
		content.find('.item-changer-label').html(goldTxt(title));
		this.wnd = {};
		this.wnd.$ = content;
		$('#item-changer').append(this.wnd.$);
		$('#item-changer').css('display', 'block');
	};

	this.updateTitle = function(title) {
		self.wnd.$.find('.item-changer-label').html(goldTxt(title));
	};

	this.updateScroll = function () {
		$('.scroll-wrapper', self.wnd.$).trigger('update');
	};

	this.createBarterItem = function (i) {
		if (barterItems[i.id]) delete barterItems[i.id];
		barterItems[i.id] = i;
	};

	//this.getItemType = function (itemType) {
	//	switch (itemType) {
	//		case 't-norm':
	//			return '*';
	//		case 't-her':
	//			return 'h';
	//		case 't-leg':
	//			return 'l';
	//		case 't-uniupg':
	//			return 'u';
	//		default :
	//			console.warn('bug type item' + itemType);
	//	}
	//};

	this.getNewItemType = function (stats) {
		if (stats.hasOwnProperty('heroic')) return 'h';
		if (stats.hasOwnProperty('unique')) return 'u';
		if (stats.hasOwnProperty('legendary')) return 'l';
		return '*';
	};

	this.createAttrToSort = function (data, $tr) {
		// var stats = g.tplsManager.parseTplStat(data.stat);
		var stats = parseItemStat(data.stat);
		var itemType = self.getNewItemType(stats);

		//var reqp = [
		//	'pw',
		//	'm',
		//	'w',
		//	'bh',
		//	'wm',
		//	'pw',
		//	'm',
		//	'w',
		//	'bh',
		//	'wm'
		//];
		//Math.floor(Math.random() * 10);
		//stats.reqp = reqp[Math.floor(Math.random() * 10)];

		if (isset(stats.lvl))  self.lvlParse(stats, $tr);
		if (isset(stats.reqp)) self.profParse(stats, $tr);
		if (itemType)			 		 self.itemTypeParse(data, $tr);
		if (data.cl) 					 self.parseItemCl(data, $tr);
	};

	this.lvlParse = function (stats, $tr) {
		var newLvl = parseInt(stats.lvl);
		if ($tr.attr('lvl')) {

			var oldLvl = parseInt($tr.attr('lvl'));
			if (newLvl > oldLvl) $tr.attr('lvl', newLvl);

		} else $tr.attr('lvl', newLvl);
	};

	this.profParse = function (stats, $tr) {
		var newReqp = stats.reqp == 'all' ? ['*'] : stats.reqp.split('');
		if ($tr.attr('reqp')) {

			var oldReqp = $tr.attr('reqp').split(',');
			if (oldReqp[0] == '*') return;
			if (newReqp[0] == '*') {
				$tr.attr('reqp', '*');
				return;
			}

			var diff = [];
			for (var i = 0; i < newReqp.length; i++) {
				if (oldReqp.indexOf(newReqp[i]) < 0) diff.push(newReqp[i]);
			}

			$tr.attr('reqp', oldReqp.concat(diff).join());

		} else $tr.attr('reqp', newReqp.join())
	};

	this.itemTypeParse = function (data, $tr) {
		//var newItemType = [self.getItemType(data.itemType)];
		//var newItemType = [self.getItemType(data.itemType)];

		// var stats = g.tplsManager.parseTplStat(data.stat);
		var stats = parseItemStat(data.stat);
		var newItemType = [self.getNewItemType(stats)];

		if ($tr.attr('itemType')) {
			var oldItemType = $tr.attr('itemType').split(',');

			if (oldItemType[0] == '*') return;
			if (newItemType[0] == '*') {
				$tr.attr('itemType', '*');
				return;
			}
			var diff = [];
			for (var i = 0; i < newItemType.length; i++) {
				if (oldItemType.indexOf(newItemType[i]) < 0) diff.push(newItemType[i]);
			}
			$tr.attr('itemType', oldItemType.concat(diff).join());

		} else $tr.attr('itemType', newItemType.join());
	};

	this.parseItemCl = function (data, $tr) {
		var newCl = [data.cl];

		if ($tr.attr('itemCl')) {
			var oldItemCl = $tr.attr('itemCl').split(',');

			var diff = [];
			for (var i = 0; i < newCl.length; i++) {
				if (oldItemCl.indexOf(newCl[i]) < 0) diff.push(newCl[i]);
			}
			$tr.attr('itemCl', oldItemCl.concat(diff).join());

		} else $tr.attr('itemCl', newCl.join());
	};

	this.getItemType = function (itemType) {
		switch (itemType) {
			case 't-norm':
				return '*';
			case 't-her':
				return 'h';
			case 't-leg':
				return 'l';
			case 't-uniupg':
				return 'u';
				default :
				console.warn('bug type item' + itemType);
		}
	};

	this.createOffer = function (data, $table) {
		var idOffer = data.id;
		var $wrapper = $('<div>').addClass('action-wrapper');
		var $wrapper2 = $('<div>').addClass('cost-wrapper');

		$wrapper2.append(self.createLimitCell(data));
		$wrapper.append(self.createButtonAction(data));
		$wrapper.append($wrapper2);

		var $tr = self.createRecords(
			[
				//self.createLimitCell(data, true),
				self.createCost(data),
				self.createItemCell(data),
				$wrapper
				//self.createButtonAction(data)
			],
			[
				'cost-cell',
				'item-cell',
				//'limit',
				'action'
			]).addClass('one-barter-offer barter-offer-' + idOffer);

		for (var i = 0; i < data.recived.length; i++) {
			var d = data.recived[i];
			var tplId = d[0];
			self.createAttrToSort(barterItems[tplId], $tr);
		}

		$table.append($tr);


		if (!self.getAvailable(idOffer)) return;
        var costAvailable = $tr.find('.cost-wrapper').attr('data-cost-available');
        if (costAvailable === "false") return;
		self.wnd.$.find('.barter-offer-' + idOffer).find('.action').find('.SI-button').removeClass('black');
	};

	this.prepareArray = function (arrayToChange, arrayData) {
		for (var i = 0; i < arrayData.length; i++) {
			arrayToChange.push(arrayData[i]);
		}
	};

	this.setStateDoActionButtonFromTpl = function (tplId, offerId) {
		var $btn = self.wnd.$.find('.barter-offer-' + offerId).find('.action').find('.button');
		$btn.removeClass('disable');
		if (!this.getOwned(tplId)) $btn.addClass('disable');
	};

	this.update = function (v) {
		var $table = self.wnd.$.find('.table-item-changer-content').empty();
		idBarter = v.id;
		available = [];
		usages = [];
		owned = [];
		nameBarter = v.name;

		this.updateTitle(nameBarter);
		this.prepareArray(available, v.available);
		this.prepareArray(usages, v.usages);
		this.prepareArray(owned, v.owned);


		for (var i = 0; i < v.offers.length; i++) {
			var oneOffer = v.offers[i];
			self.createOffer(oneOffer, $table);
		}
		self.resetFilter();
		self.updateScroll();
	};

	this.createCost = function (data) {
		if (!data.cost) return '-';
		var $costCell = self.getTplCostWrapper();
		switch (data.cost.currency) {
			case 1:
				var costAvailable = data.cost.value < hero.gold;
				var valClass = costAvailable ? 'green' : 'red';
				this.setCostAvailableData($costCell, costAvailable);
				$costCell.html(round(data.cost.value, 2)).addClass(valClass);
				break;
			case 2:
				var costAvailable = data.cost.value < hero.credits;
				var valClass = costAvailable ? 'green' : 'red';
				this.setCostAvailableData($costCell, costAvailable);
				$costCell.html(data.cost.value+ _t('sl', null, 'clan')).addClass(valClass);
				break;
			break;
			case 3:
				self.createCostItem(data.cost.itemTpl, data.cost.value, $costCell);
				break;
			case 4:
				var costAvailable = data.cost.value < hero.honor;
				var valClass = costAvailable ? 'green' : 'red';
				this.setCostAvailableData($costCell, costAvailable);
				$costCell.html(data.cost.value+ 'PH').addClass(valClass);
				break;
		}
		return $costCell;
	};

	this.setCostAvailableData = function($el, value) {
		value = typeof value !== 'undefined' ? value : true;
		$el.attr('data-cost-available', value);
	};

	this.createButtonAction = function (data) {
		var $but = drawSIButton(_t('do_offer')).addClass('black');

		if (available !== null) {
			$but.bind('click', function () {
				self.askAlert(data);
			});
		}

		return $but;
	};

	this.setCostInData = function (data) {
		if (!data.cost) {
			return '';
		}
		switch (data.cost.currency) {
			case 1:
				return '<br>' + _t('all_cost') + '<span id="alert-cost-item-changer">' + data.cost.value + '</span>';
			case 2:
				return '<br>' + _t('all_cost') + '<span id="alert-cost-item-changer">' + data.cost.value + '</span><span>' + _t('sl') + '</span>';
			case 3:
				return '<br>' + _t('all_cost') + '<span id="alert-cost-item-changer">' + data.cost.value + '</span><span> ' + barterItems[data.cost.itemTpl].name + '</span>';
			case 4:
				return '<br>' + _t('all_cost') + '<span id="alert-cost-item-changer">' + data.cost.value + '</span><span>' + 'PH' + '</span>';
			default:
				console.log('bug currency: ' + data.cost.currency);
		}
	};

	this.createLimitCell = function (data, breakLine) {
		if (!data.limit) return '-';

		var u = self.getUsages(data.id);
		var uVal = u ? u : 0;

		var asd = breakLine ? '<br>' : ' ';

		switch (data.limit.period) {
			case 0:
				return '-';
			case 1:
				return uVal + '/' + data.limit.max + asd + _t('on_day');
			case 2:
				return uVal + '/' + data.limit.max + asd + _t('on_week');
			case 3:
				return uVal + '/' + data.limit.max + asd + _t('on_month');
		}
	};

	this.createItemCell = function (data) {
		var $cell = self.getTplRequireAndReceiveItem();

		if (data.mode == 1) self.createRequire(data, $cell.find('.require-wrapper-align'));
		else {
			var $wrapper = $cell.find('.require-wrapper-align');
			self.createRequire(data, $wrapper, false, true);
		}

		self.createRecive(data.recived, $cell.find('.recive-wrapper-align'));
		return $cell;
	};

	//this.createRequire = function (required, $requireWrapper) {
	//	for (var i = 0; i < required.length; i++) {
	//		var d = required[i];
	//		var tplId = d[0];
	//		//var $tpl = tpl.get('require-item');
	//		var $tpl = self.getTplRequireItem();
	//		var needToUse = d[1];
	//		var o = self.getOwned(tplId);
	//		var ownedVal = o ? parseInt(o) : 0;
	//		var cl = parseInt(needToUse) <= ownedVal ? 'green' : 'red';
	//
	//		$tpl.addClass('tpl-item-' + tplId).find('.item-wrapper').append(barterItems[tplId].$.clone());
	//		$tpl.find('.require-state').removeClass('green red').addClass(cl);
	//		$tpl.find('.current-owned').html(ownedVal);
	//		$tpl.find('.need-to-use').html(needToUse);
	//
	//		$requireWrapper.append($tpl);
	//	}
	//};

	this.createRequire = function (data, $requireWrapper, setItemInRequire, openItemChangeGroup) {
		var required = data.required;
		for (var i = 0; i < required.length; i++) {
			var $tpl = self.getTplRequireItem();
			$requireWrapper.append($tpl);

			if (openItemChangeGroup) {
				$tpl.addClass('choose-item can-choose-item');
				$tpl.find('.seperator').html('?');
				self.openItemChangerGroup($tpl, data);
				return;
			}

			var d = required[i];
			var tplId = d[0];
			var needToUse = d[1];
			self.fillRequireItem($tpl, tplId, needToUse);
			self.addItemToRequire($tpl, tplId, needToUse);
			if (setItemInRequire) {
				g.itemChangerGroup.setItemInGroup(data, $tpl, tplId, needToUse);
			}
		}
	};

	this.addItemToRequire = function ($tpl, tplId, needToUse) {
		var item = barterItems[tplId];
		var $clone = item.$.clone();
		$clone.attr('data-id', tplId);
		$tpl.find('.item-wrapper').append($clone);

		$clone.click(function(e) {
			var $target = $(this);
			var id = $target.attr('data-id');
			self.showMenuItem(e, id, $target);
		});
	};

	this.fillRequireItem = function ($tpl, tplId, needToUse) {
		var o = self.getOwned(tplId);
		var ownedVal = o ? parseInt(o) : 0;
		var cl = parseInt(needToUse) <= ownedVal ? 'green' : 'red';

		$tpl.addClass('tpl-item-' + tplId);
		$tpl.find('.require-state').removeClass('green red').addClass(cl);
		$tpl.find('.current-owned').html(ownedVal);
		$tpl.find('.need-to-use').html(needToUse);
	};

	this.openItemChangerGroup = function ($tpl, data) {
		$tpl.click(function (e) {
			e.stopPropagation();
			if (g.itemChangerGroup) g.itemChangerGroup.close();
			g.itemChangerGroup = new itemChangerGroup();
			g.itemChangerGroup.init();
			g.itemChangerGroup.update(data);
		});
	};

	this.createRecive = function (recived, $reciveWrapper) {
		for (var i = 0 ; i < recived.length; i++) {
			var d = recived[i];
			//var $tpl = tpl.get('recive-item');
			var $tpl = self.getTplReciveItem();
			var tplId = d[0];
			var amount = d[1];
			var item = barterItems[tplId];
			var $clone = item.$.clone();
			$clone.attr('data-id', tplId);
			$tpl.addClass('tpl-item-' + tplId).find('.item-wrapper').append($clone);
			$reciveWrapper.append($tpl);
			g.tplsManager.changeItemAmount(item, $clone, amount);

			$clone.click(function(e) {
				var $target = $(this);
				var id = $target.attr('data-id');
				self.showMenuItem(e, id, $target);
			});
		}
	};

	this.createCostItem = function (tplId, amount, $costWrapper) {
        var $tpl = self.getTplCostItem();
        var o = self.getOwned(tplId);
        var ownedVal = o ? parseInt(o) : 0;
        var available = parseInt(amount) <= ownedVal;
		var $itemWrapper = $tpl.addClass('tpl-item-' + tplId).find('.item-wrapper');
        $tpl.find('.require-state').removeClass('green red').addClass(available ? 'green' : 'red');
        $tpl.find('.current-owned').html(ownedVal);
        $tpl.find('.need-to-use').html(amount);
		var $clone = barterItems[tplId].$.clone();
		$clone.attr('data-id', tplId);
		$itemWrapper.append($clone);
		$costWrapper.append($tpl);
		this.setCostAvailableData($costWrapper, available);

		$clone.click(function(e) {
			var $target = $(this);
			var id = $target.attr('data-id');
			self.showMenuItem(e, id, $target);
		});
	};

	this.showMenuItem = function(e, id, $item) {
		if (isset((parseItemStat(g.tplsManager.getItems().f[id].stat)).canpreview)) {
			var fun = '_g("moveitem&st=2&tpl=' + id + '"); g.tplsManager.deleteMessItemsByLoc("p");g.tplsManager.deleteMessItemsByLoc("s");';
			showMenu(
				{target:$item},
				[
					[_t('show', null, 'item'), fun, true]
				]
			);
		}
	};

	this.newRecipeItem = function ($itemSlot, data, i) {
		var item = new Item(i, data, 'item');
		$itemSlot.append(item.$);
		if (!item.hasMenu) return;
		item.$.css('cursor', 'url(../img/gui/cursor/5.png), auto');
		item.$.click(function (e) {
			item.createOptionMenu(e);
		});
	};

	this.initSelect = function () {
		var $r = self.wnd.$;
		var $m = $r.find('.choose-prof');
		var $m2 = $r.find('.choose-item-type');
		var $m3 = $r.find('.choose-cl');
		var data1 = {
			'*': _t('class', null, 'eq_prof'),
			'm': _t('prof_mage', null, 'auction'),
			'w': _t('prof_warrior', null, 'auction'),
			'p': _t('prof_paladin', null, 'auction'),
			't': _t('prof_tracker', null, 'auction'),
			'h': _t('prof_hunter', null, 'auction'),
			'b': _t('prof_bdancer', null, 'auction')
		};

		for (var k in data1) {
			var $option = $('<option>').attr('val', k).html(data1[k]);
			$m.append($option)
		}
		var data2 = {
			'*':  _t('type_item_changer'),
			'u':  _t('type_unique', null, 'auction'),
			'h':  _t('type_heroic', null, 'auction'),
			'l':  _t('type_legendary', null, 'auction')
		};

		for (var k in data2) {
			var $option = $('<option>').attr('val', k).html(data2[k]);
			$m2.append($option)
		}
		var classes = ['cl_onehanded', 'cl_twohanded', 'cl_bastard', 'cl_distance','cl_helpers', 'cl_wands', 'cl_staffs',
			'cl_armor', 'cl_helmets', 'cl_boots', 'cl_gloves', 'cl_rings', 'cl_neclaces', 'cl_shield', 'cl_neutral', 'cl_usable',
			'cl_gold', 'cl_keys', 'cl_quests', 'cl_renewable', 'cl_arrows', 'cl_talisman', 'cl_books', 'cl_bags', 'cl_bless',
			'cl_improve'
		];

		var data3 = {};

		for (var i = 0; i < classes.length; i++) {
			data3[i + 1] = _t(classes[i], null, 'eq_cl');
		}

		$m3.append($('<option>').attr('val', '*').html(_t('type', null, 'item_changer')));
		for (var k in data3) {
			var $option = $('<option>').attr('val', k).html(data3[k]);
			$m3.append($option)
		}

		$m.change(function ()  {self.startFilter();});
		$m2.change(function () {self.startFilter();});
		$m3.change(function () {self.startFilter();});

		$r.find('.start-lvl').attr('placeholder', _t('start'));
		$r.find('.stop-lvl').attr('placeholder', _t('stop'));
	};

	this.initStartLvl = function () {
		var $search = this.wnd.$.find('.start-lvl');
		$search.keyup(function () {
			self.startFilter();
		});
	};

	this.initStopLvl = function () {
		var $search = this.wnd.$.find('.stop-lvl');
		$search.keyup(function () {
			self.startFilter();
		});
	};

	this.startFilter = function () {
		self.wnd.$.find('.one-barter-offer').css('display', 'table-row');
		self.lvlKeyUp();
		self.getValueFromProf();
		self.getValueFromItemType();
		self.getValueFromCl();
		self.updateScroll();
	};

	this.resetFilter = function () {
		this.wnd.$.find('.start-lvl').val('');
		this.wnd.$.find('.stop-lvl').val('');
		this.wnd.$.find('.menu').each(function () {
			var val = $(this).find("option:first").val();
			$(this).val(val);
		})
	};

	this.lvlKeyUp = function () {
		var v1 = this.wnd.$.find('.start-lvl').val();
		var v2 = this.wnd.$.find('.stop-lvl').val();
		var $allRecipes = self.wnd.$.find('.one-barter-offer');
		if (v1 == '' && v2 == '') return;
		else {
			if (v1 == '') v1 = 0;
			if (v2 == '') v2 = 1000;
			$allRecipes.each(function () {
				if ($(this).css('display') == 'none') return;
				var lvl = $(this).attr('lvl');
				var disp = lvl >= parseInt(v1) && lvl <= parseInt(v2) ? 'table-row' : 'none';
				$(this).css('display', disp);
			});
		}
	};

	this.getValueFromProf = function () {
		//var val = self.wnd.$.find('.choose-prof').find('.menu-option').attr('value');
		var val = self.wnd.$.find('.choose-prof  option:selected').attr('val');
		if (val == '*') return;
		var $allRecipes = self.wnd.$.find('.one-barter-offer');
		$allRecipes.each(function () {
			if ($(this).css('display') == 'none') return;
			var reqp = $(this).attr('reqp');
			if (!reqp) return;
			var split = $(this).attr('reqp').split(',');
			var disp = split.indexOf(val) > -1 ? 'table-row' : 'none';
			$(this).css('display', disp);
		});
	};

	this.getValueFromCl = function () {
		//var val = self.wnd.$.find('.choose-cl').find('.menu-option').attr('value');
		var val = self.wnd.$.find('.choose-cl option:selected').attr('val');
		if (val == '*') return;
		var $allRecipes = self.wnd.$.find('.one-barter-offer');
		$allRecipes.each(function () {
			if ($(this).css('display') == 'none') return;
			var itemCl = $(this).attr('itemCl');
			if (!itemCl) return;
			var split = $(this).attr('itemCl').split(',');
			var disp = split.indexOf(val) > -1 ? 'table-row' : 'none';
			$(this).css('display', disp);
		});
	};

	this.getValueFromItemType = function () {
		//var val = self.wnd.$.find('.choose-item-type').find('.menu-option').attr('value');
		var val = self.wnd.$.find('.choose-item-type  option:selected').attr('val');
		if (val == 'a') return;
		var $allRecipes = self.wnd.$.find('.one-barter-offer');
		$allRecipes.each(function () {
			if ($(this).css('display') == 'none') return;
			var itemType = $(this).attr('itemType');
			if (!itemType) return
			var itemsArray = itemType.split(',');
			var disp;
			switch (val) {
				case 'u' :
					var u = self.check(itemsArray, 'u') || self.check(itemsArray, 'h') || self.check(itemsArray, 'l');
					if (u) disp = 'table-row';
					else disp = 'none';
					break;
				case 'h' :
					var h = self.check(itemsArray, 'h') || self.check(itemsArray, 'l');
					if (h) disp = 'table-row';
					else disp = 'none';
					break;
				case 'l' :
					var l = self.check(itemsArray, 'l');
					if (l) disp = 'table-row';
					else disp = 'none';
					break;
			}
			$(this).css('display', disp);
		});
	};

	this.check = function (itemsArray, typeItem) {
		return itemsArray.indexOf(typeItem) > -1;
	};

	this.getAvailable = function (offerId) {
		for (var i = 0; i <available.length; i++) {
			var oneA = available[i];
			if (oneA[0] == offerId) return oneA[1];
		}
		return null;
	};

	this.getOwned = function (tplId) {
		for (var i = 0; i <owned.length; i++) {
			var oneO = owned[i];
			if (oneO[0] == tplId) return oneO[1];
		}
		return null;
	};

	this.getUsages = function (idOffer) {
		for (var i = 0; i <usages.length; i++) {
			var oneU = usages[i];
			if (oneU[0] == idOffer) return oneU[1];
		}
		return null;
	};

	this.askAlert = function (data) {
		var offerId = data.id;
		var maxAvailable = self.getAvailable(offerId);


		var limitTxt = data.limit ? (_t('limit', null, 'item_changer') + '<b>' + self.createLimitCell(data)  + '</b><br>') : '';

		var txt =
			limitTxt +
			_t('reagents', null, 'item_changer') + '<b>' + maxAvailable + ' szt.</b>' +
			self.setCostInData(data);



		mAlert(txt, 3, [
			function (){
				var v = $('#alert input[name="mAlertInput"]').val();
				_g('barter&id=' + idBarter + '&offerId=' + offerId + '&action=use&usesCount=' + v + '&available=' + (allOfferts ? 0 : 1));
			}, function () {
				console.log('none');
			}
		]);

		if (data.cost) {
			$('#alert .a2').keyup(function () {
				var v = $('#alert input[name="mAlertInput"]').val();
				if (v == '') {
					v = 0;
					//$('#alert input[name="mAlertInput"]').val(0);
				}
				$('#alert-cost-item-changer').html(parseInt(data.cost.value) * parseInt(v));
			});
		}
		$('#alert input[name="mAlertInput"]').val(1);
		$('#alert input[name="mAlertInput"]')[0].setAttribute('type', 'number');
		//$('#alert input[name="mAlertInput"]')[0].setAttribute('min', 0);
	};

	this.close = function () {
		g.lock.remove('itemChanger');
		$('#item-changer').css('display', 'none');
		self.wnd.$.remove();
		g.tplsManager.removeCallback('f', self.createBarterItem);
		g.tplsManager.deleteMessItemsByLoc('f');
		delete (self.wnd);
		available = [];
		owned = [];
		usages = [];
		barterItems = {};
		g.itemChanger = false;
	};


	this.getTplItemChanger = function () {
		return $(
			'<div class="item-changer">' +
			'<div class="header-wrapper">' +
			'<div class="graphic"></div>' +
			'<div class="item-changer-label"></div>' +
			'</div>' +

			'<div class="filter-wrapper">' +
			'<div class="filter-label"></div>' +
			'<input class="start-lvl default"/>' +
			'<input class="stop-lvl default"/>' +
			'<div class="choose-prof-wrapper">' +
			'<select class="choose-prof menu"></select>' +
			'</div>' +
			'<div class="choose-item-type-wrapper">' +
			'<select class="choose-item-type menu"></select>' +
			'</div>' +
			'<div class="choose-cl-wrapper">' +
			'<select class="choose-cl menu"></select>' +
			'</div>' +
			'</div>' +

			'<table class="static-bar-table"></table>' +
			'<div class="scroll-wrapper classic-bar">' +
			'<div class="scroll-pane">' +
			'<div class="middle-graphics"></div>' +
			'<div class="paper-graphics"></div>' +
			'<table class="table-item-changer-content"></table>' +
			'</div>' +
			'</div>' +
			'<div class="bottom-item-changer-panel">' +
			'<div class="bottom-panel-graphics"></div>' +
			'</div>' +
			'<div class="close-but"></div>' +
			'</div>'
			)
	};

	this.getTplRequireAndReceiveItem = function () {
		return $(
			'<div class="require-and-receive-item">' +
			'<div class="require-wrapper">' +
			'<div class="require-wrapper-align"></div>' +
			'</div>' +
			'<div class="arrow"></div>' +
			'<div class="recive-wrapper">' +
			'<div class="recive-wrapper-align"></div>' +
			'</div>' +
			'</div>'
		);
	};

	this.getTplRequireItem = function () {
		return $(
			'<div class="require-item">'+
			'<div class="item-wrapper"></div>'+
			'<div class="require-state">'+
			'<span class="current-owned"></span>/<span class="need-to-use"></span>'+
			'</div>'+
			'</div>'
		);
	}

	this.getTplCostWrapper = function () {
		return $(
			'<div class="cost-wrapper"></div>'
		)
	};

	this.getTplCostItem = function () {
		return $(
			'<div class="cost-item">' +
			'<div class="item-wrapper"></div>' +
            '<div class="require-state">'+
            '<span class="current-owned"></span>/<span class="need-to-use"></span>'+
            '</div>'+
			'</div>'
		)
	};

	this.getTplReciveItem = function () {
		return $(
			'<div class="recive-item">' +
			'<div class="item-wrapper"></div>' +
			'</div>'
		);
	}

}

