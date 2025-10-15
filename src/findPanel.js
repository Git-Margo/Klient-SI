function findPanel (Par) {
	var content;
	var self = this;
	var attrDataTab;

	this.init = function () {
		this.initContent();
		this.initAttrTab();
		this.createFindPanel();
		this.createShowFindPanelBtn();
		this.hideElements();
	};

	this.hideElements = function () {
		//content.find('.atribute-value-wrapper, .save-atribute-wrapper').css('display', 'none');
		content.find('.atribute-value-wrapper').css('display', 'none');
	};

	this.initContent = function () {
		content = self.getFindPanelHtml();
		$('#clanFilter').append(content);
		//$('.clan-list-find-content').addScrollBar({track: true});
	};

	this.initAttrTab = function () {
		var ClanAtributs = Par.getClanAtributs();
		attrDataTab = ClanAtributs.getAttrDataTab();
	};

	this.createFindPanel = function () {
		this.createHideBtn();
		this.createFindBtn();
		this.createFindPanelHeaders();
		this.createAllAtributes();
	};

	this.createAllAtributes = function () {
		var $attrWrapper = content.find('.clan-list-find-content');
		var ClanAtributs = Par.getClanAtributs();
		for (var id in attrDataTab) {
			if (attrDataTab[id].name == 'empty') continue;
			ClanAtributs.createAtribute($attrWrapper, id, content, false, true);
		}
	};

	this.createFindPanelHeaders = function () {
		var key = 'clan-find-header-';
		var $span = $('<span>').addClass('gfont').attr('name', Par.tLang('advanced-find'))
		$span.html(Par.tLang('advanced-find'))
		content.find('.' + key + 0).html(Par.tLang(key + 0));
		content.find('.' + key + 1).html(Par.tLang(key + 1));
		content.find('.' + key + 2).html(Par.tLang(key + 2));
		//content.find('.clan-list-find-header').html(Par.tLang('advanced-find'));
		content.find('.clan-list-find-header').html($span);
	};

	this.showFindPanel = function () {
		content.toggleClass('active');
		$('#clanFilter').toggle();
	};

	this.hideFindPanel = function () {
		$('#clanFilter').css('display', 'none');
	};

	this.createShowFindPanelBtn = function () {
		var $btn = drawSIButton(Par.tLang('filter'));
		$('#clanbox').find('.clan-list-show-btn').append($btn);
		$btn.click(self.showFindPanel);
	};

	this.createHideBtn = function () {
		var $btn = drawSIButton(_t('hide'));
		$btn.click(self.hideFindPanel);
		content.find('.clan-list-hide-btn').append($btn);
	};

	this.createFindBtn = function () {
		var $btn = drawSIButton(_t('search'));
		$btn.click(self.sortAttrClans);
		content.find('.clan-list-find-btn').append($btn);
	};

	this.sortAttrClans = function () {
		var filter = '&filters=' + self.getFilter().join('');
		var ClanList = Par.getClanList();
		ClanList.sendRequest(1, filter);
		console.log(filter);
		self.hideFindPanel();
	};

	this.checkClanMatch = function ($oneClan, oneClanAttrs, filter) {
		var match = true;
		for (var id in filter) {
			var kindSort = !isset(attrDataTab[id].find) ? 'Equal' : attrDataTab[id].find;
			var func = 'is' + kindSort;
			var val = this.getLookingForVal(filter[id], id);
			if (self[func](oneClanAttrs[id], val)) continue;
			match = false;
			break;
		}
		if (!match) $oneClan.addClass('hide');
	};

	this.getLookingForVal = function (val, id) {
		var range = attrDataTab[id].range;
		if (!range) return val;
		if (range[3]) return Math.abs((val - range[1]) / range[2]);
		else return (val - range[0]) / range[2];
	};

	this.isEqual = function (a, findVal) {
		return parseInt(a, 2) == findVal;
	};

	this.isBiggerOrEqual = function (a, findVal) {
		return parseInt(a, 2) >= findVal;
	};

	this.isLesserOrEqual = function (a, findVal) {
		return parseInt(a, 2) <= findVal;
	};

	//this.getFilter = function () {
	//	var filter = {};
	//	for (var k in attrDataTab) {
	//		var bool = attrDataTab[k].input == 'i';
	//		var $o = content.find('.input-val-' + k);
	//		if (bool) $o.val();
	//		var v = bool ? $o.val() : $o.attr('value');
	//		if (v != '') filter[k] = v;
	//	}
	//	return filter;
	//};

	this.getFilter = function () {
		//var filter = {};
		var a = new Array(15);
		for (var k in attrDataTab) {
			var id = attrDataTab[k].clanListFilter;
			if (attrDataTab[k].name == 'empty') continue;
			var kind = attrDataTab[k].input;
			var $o = content.find('.input-val-' + k);
			//if (bool) $o.val();
			var v;
			switch (kind) {
				case 'i' :
					v = $o.val();
					break;
				case 'm' :
					v = $o.attr('value');
					break;
				case 'c' :
					v = $o.find('.active').attr('value');
					break;
			}

			//var v = bool ? $o.val() : $o.attr('value');
			if (v != '') {
				//filter[k] = v;
				a[id] = v + '|';
			} else {
				a[id] = '|';
			}
		}
		//return filter;
		return a;
	};


	this.getFindPanelHtml = function () {
		return $(
		'<div class="clan-list-find-panel">' +
			'<div class="clan-list-find-header"></div>' +
			'<div class="clan-list-atributes">' +
				'<div class="scroll-wrapper clan-list-find-content">' +
					'<div class="scroll-pane">' +
						'<div class="background-wrapper">' +
							'<div class="clan-find-header-0"></div>' +
							'<div class="clan-part-0"></div>' +
							'<div class="clan-find-header-1"></div>' +
							'<div class="clan-part-1"></div>' +
							'<div class="clan-find-header-2"></div>' +
							'<div class="clan-part-2"></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="clan-list-butts-wrapper">' +
				'<div class="clan-list-butts">' +
					'<div class="clan-list-hide-btn"></div>' +
					'<div class="clan-list-find-btn"></div>' +
				'</div>' +
			'</div>' +
		'</div>')
	};

}