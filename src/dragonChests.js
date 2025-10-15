function dragonChests () {
	var self = this;
	var itemsArray = [];
	this.counter = null;

	this.init = function () {
		this.initWnd();
		this.initCloseBut();
	};

	this.ShowChestsPanel = function() {
		self.$.css('display', 'block' );
	};

	this.hideChestsPanel = function() {
		self.$.css('display', 'none' );
		g.tplsManager.removeCallback('n', shopNewItem);
		g.tplsManager.deleteMessItemsByLoc('n');
		g.shop={
			'id':0
		};
	};

	this.initCloseBut = function () {
		self.$.find('.close-chests-window').click(self.hideChestsPanel)
	};

	this.initWnd = function () {
		this.$ = $('#chests-window');
	};

	this.createAllChests = function (items, offers) {
		self.ShowChestsPanel();
		self.$.find('.chests-choice-wrapper').empty();
		self.counter = 0;
		for (var t in items){
			if (items[t].loc == "n") itemsArray[items[t].id] = items[t];
		}
		offers.map(offer => this.addOne(offer));
	};

	this.addOne = function (offer) {
		const item = itemsArray[offer.tplId];
		var $promoChest = this.createHtmlChest();
		var cl = self.getClass(item.name);
		var $btnWrapper = $promoChest.find('.btn-wrapper');
		var buyTxt = _t('buying_items', null, 'shop');
		var pr = offer.price;

		$promoChest.find('.chest-img').addClass(cl);
		$promoChest.find('.price-txt').html(offer.price + ' ' + _t('sl'));
		$promoChest.find('.txt-html').html(_t('chest_' + self.counter));
		$promoChest.find('.header-txt').html((item.name).toUpperCase());
		this.$.find('.chests-choice-wrapper').append($promoChest);

		createMMButton(buyTxt, $btnWrapper, function () {
			self.chestClick(pr, offer.id);
		});
		createMMButton(_t('items_list'), $btnWrapper, function () {
			_g('moveitem&st=2&tpl=' + item.id);
			g.tplsManager.deleteMessItemsByLoc('p');
			g.tplsManager.deleteMessItemsByLoc('s');
		});
		self.counter++;
	};

	this.getClass = function (name) {

		var red = new RegExp('czerwonego', 'gi');
		var black = new RegExp('czarnego', 'gi');

		if (name.match(red)) return 'red-dragon-chest-g';
		if (name.match(black)) return 'black-dragon-chest-g';
	};

	this.chestClick = function (price, id) {
		if (hero.credits < price) mAlert(_t('low_sl'))
		else _g("shop&buy=" + id + ",1&sell=");
	};

	this.createHtmlChest = function () {
		return $(
			'<div class="promo-chest">' +
				'<div class="header-txt"></div>' +
				'<div class="img-wrapper">' +
					'<div class="chest-img"></div>' +
				'</div>' +
				'<div class="txt-wrapper">' +
					'<div class="txt-html"></div>' +
				'</div>' +
				'<div class="btn-wrapper"></div>' +
				'<div class="price-txt"></div>' +
			'</div>'
		);
	};

	this.init();
}
