//var wnd = require('../Window.js');
//var tpl = require('../Templates');
function itemChangerGroup () {
	var self = this;
	var content;
	var itemChooseTplId = null;
	var itemChooseData = null;
	this.wnd = null;

	this.init = function () {
		this.initWindow();
		this.wnd.$.find('.header-wrapper-text').html(_t('barter_group_header') + ':');
		//this.initBackgroundGrid();
	};

	this.initBackgroundGrid = function () {
		for (var i= 0; i < 40; i++) {
			self.wnd.$.find('.background-grid').append($('<div>').addClass('background-grid-element'))
		}
	};

	this.initFetch = function () {
		g.tplsManager.fetch('f', self.createItemChangerGroupItem);
	};

	this.createItemChangerGroupItem = function (i) {
		var $place = self.wnd.$.find('.tpl-item-' + i.id).find('.item-wrapper');
		$place.each(function () {
			var $clone = i.$.clone();
			$(this).html($clone);
			//$clone.contextmenu(function (e, mE) {
			//	i.createOptionMenu(getE(e, mE));
			//});
			if ($(this).parent().hasClass('recive-item')) {
				var amount = $(this).attr('data-amount');
				g.tplsManager.changeItemAmount(i, $clone, amount);
				$clone.attr('data-tip-type', i.$.data('tipType'));
				$clone.attr('data-item-type', i.$.data('itemType'));
			}
		});
	};

	this.initWindow = function () {
		var title = 'Barter';
		content = self.getItemChangerGroup();
		content.find('.header-wrapper').html(goldTxt(title));
		this.wnd = {$:content};
		$('#item-changer-group').append(this.wnd.$);

		content.find('.close-but').click(self.close);
	};

	this.update = function (data) {
		self.createGrid(data);
		self.initFetch();
		//self.wnd.center();
	};

	this.setItemInGroup = function (data, $tpl, tplId, needToUse) {
		$tpl.click(function () {
			itemChooseTplId = tplId;
			itemChooseData = data;
			var offerId = data.id;
			var $clone = $tpl.find('.item').clone();
			var $tpl2  = g.itemChanger.wnd.$.find('.barter-offer-' + offerId).find('.choose-item');
			$tpl2.removeClass('can-choose-item');
			g.itemChanger.fillRequireItem($tpl2, tplId, needToUse);
			g.itemChanger.setStateDoActionButtonFromTpl(tplId, offerId);
			$tpl2.find('.seperator').html('/');
			$tpl2.find('.item-wrapper').html($clone);
			$tpl2.attr('set-group-item', tplId);
			self.close();
		});
	};

	this.createGrid = function (data) {
		var $grid = self.wnd.$.find('.grid').empty();
		g.itemChanger.createRequire(data, $grid, true);
	};

	this.close = function () {
		self.wnd.$.remove();
		g.tplsManager.removeCallback('f', self.createItemChangerGroupItem);
		delete (self.wnd);
		g.itemChangerGroup = false;
	};

	this.getItemChangerGroup = function () {
		return $(
			'<div class="item-changer-group">' +
			'<div class="close-but"></div>' +
			'<div class="header-wrapper"></div>' +
			'<div class="header-wrapper-text"></div>' +
			'<div class="background-grid"></div>' +
			'<div class="grid"></div>' +
			'</div>'
		);
	}

};