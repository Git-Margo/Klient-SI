function news () {
	var self = this;
	var content;
	var intervals = {};
	var tileWidth = 134;
	var tileNewsGraphWidth = 402;
	var globalBckUrl;
	var getTimePromo;
	var timeToChangeGraph;
	var banerInterval;
	var newsCurrentIndex = 0;

	this.leftPromo = 0;		// sory  ['left' + kind] ['leftPromo']
	this.leftNews = 0;
	this.$pagination = null;
	this.newsLength = null;

	this.wnd = null;

	this.init = function () {
		this.initWindow();
		this.getNews();
		this.initArrows();
		g.lock.add('new_window');
		$('#b_news').removeClass('notif');
	};

	this.connectEvents = function () {
		$(document).on('click', '.news-section .news-pagination-item', self.paginationOnClick.bind(self));
		content.find('.left-news-btn').click(self.newsPrev.bind(self));
		content.find('.right-news-btn').click(self.newsNext.bind(self));
	};

	this.initArrows = function () {
		content.find('.left-arrow').click(function () {
			self.updatePosition(true, '.for-you', tileWidth, 'Promo');
		});
		content.find('.right-arrow').click(function () {
			self.updatePosition(false, '.for-you', tileWidth, 'Promo');
		});
	};

	this.initPagination = function() {
		this.$pagination = content.find('.news-pagination');
		for (var i = 0; i < self.newsLength; i++) {
			var $el = $('<div class="news-pagination-item" />');
			if (i === 0) {
				$el.addClass('active');
			}
			this.$pagination.append($el);
		}
	};

	this.paginationOnClick = function(e) {
		var $target = $(e.currentTarget),
			index = $target.index();

		this.goTo(index);
	};

	this.paginationUpdate = function(index) {
		var $activePaginationItem = this.$pagination.find('.news-pagination-item:eq('+index+')');
		$activePaginationItem
			.addClass('active')
			.siblings('.news-pagination-item')
			.removeClass('active');
	};

	this.goTo = function(index) {
		var $wrapper = content.find('.news-section-overflow'),
			newPosition = -(index * tileNewsGraphWidth);

		self.paginationUpdate(index);
		newsCurrentIndex = index;
		$wrapper.css('left', newPosition);
		self.setIntervalNews();
	};

	this.setIntervalNews = function() {
		if (banerInterval) {
			clearInterval(banerInterval);
		}
		var length = self.newsLength;
		if (length <= 1) return;
		banerInterval = setInterval(function () {
			newsCurrentIndex++;
			var nextSlide = newsCurrentIndex >= length ? 0 : newsCurrentIndex;
			self.goTo(nextSlide);
		}, 5000);
	};

	this.newsNext = function() {
		newsCurrentIndex++;
		var nextSlide = newsCurrentIndex >= self.newsLength ? 0 : newsCurrentIndex;
		self.goTo(nextSlide);
	};

	this.newsPrev = function() {
		newsCurrentIndex--;
		var prevSlide = newsCurrentIndex < 0 ? self.newsLength - 1 : newsCurrentIndex;
		self.goTo(prevSlide);
	};

	this.updateArrowsInNewGrapic = function () {
		content.find('.left-news-btn').click(function (e) {
			e.stopPropagation();
			self.initTimeToChangeGraph();
			self.updatePosition(true, '.news-section-overflow', tileNewsGraphWidth, 'News');
		});
		content.find('.right-news-btn').click(function (e) {
			e.stopPropagation();
			self.initTimeToChangeGraph();
			self.updatePosition(false, '.news-section-overflow', tileNewsGraphWidth, 'News');
		});
	};


	this.initFetch = function () {
		g.tplsManager.fetch('o', self.newPackItem);
	};

	this.newPackItem = function (item) {
		var $items = g.news.wnd.$.find('.offer-' + item.id);
		$items.each(function () {
			var $clone = item.$.clone();
			var serwerAmount = $(this).attr('data-amount');
			g.tplsManager.changeItemAmount(item, $clone, serwerAmount);
			$(this).append($clone);
			$clone.click(function (e) {
				itemMenu('tplo', this, e);
			});
			$clone.attr('id', 'tpl' + item.id);
		});
	};

	//this.createNewsText = function (data) {
	//	var $msg = $('<div>').addClass('new-message');
	//	$msg.html(parseNewsBB(data.replace(/\\/gi, '')));
	//	self.wnd.$.find('.news-text-section').find('.section-content').append($msg);
	//
	//};

	this.createNewsText = function (data) {
		var $msg = self.wnd.$.find('.news-section-overflow').html(parseNewsBB(data.replace(/\\/gi, '')));
		self.newsLength = $msg.find("a").children().length;
		self.wnd.$.find('.news-section-overflow').css('width', self.newsLength * tileNewsGraphWidth);
		self.wnd.$.find('.news-graph-arrow').css('display', self.newsLength > 1 ? 'block' : 'none');
		self.connectEvents();
		self.setIntervalNews();
		self.initPagination();
	};

	this.initWindow = function () {
		var title = goldTxt(_t('news', null, 'news'));
		content = this.getNewsPanel();
		content.find('.news-panel-label').html(title);
		this.wnd = {};
		this.wnd.$ = content;
		$('body').append(this.wnd.$);
		var str1 = goldTxt(_t('whatIsNew', null,'news'));
		var str2 = goldTxt(_t('forYou', null,'news'));
		var str3 = goldTxt(_t('timePromo', null,'news'));
		this.wnd.$.absCenter();
		this.wnd.$.find('.whatIsNew').html(str1);
		this.wnd.$.find('.forYou').html(str2);
		this.wnd.$.find('.timePromo').html(str3);
		this.wnd.$.find('.closebut').click(function () {
			self.close();
		});
	};

	this.getNews =function () {
		var url = 'https://forum.margonem.pl/ajax/premiumnews.php';
		$.ajax({
			url: url,
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			success: function (response) {
				var data = JSON.parse(response);
				self.createNewsText(data);
			},
			error: function () {
				console.log('error');
			}
		});
	};

	this.updateChanged = function (data) {
		for (var k in data) {
			if (data[k].is_used) this.setTileUsed(data[k].id);
		}
	};

	this.setTileUsed = function (id) {
		self.wnd.$.find('.promo-tile-id-' + id).addClass('is-used');
	};

	this.update = function (v) {
		var $wrapper = content.find('.news-for-you-section').find('.for-you');
		var data = v.active;
		this.updateGlobalBackground(v.background);
		getTimePromo = true;

		var count = this.getContLocalAndGlobalPromo(data);
		var kind = count.global > 2 ? 'small' : 'big';
		var width = count.local * tileWidth;

		this.showOrHideArrows(count.local);

		var count = 1;
		//for (var k in data) {
		//var rec = data[k];
		for (var i = 0; i < data.length; i++) {
			var rec = data[i];
			if (rec.is_personal == 1)		this.createClassicTile(rec);
			else 	{
				this.createTimePromoTile(rec, kind, count);
				count++;
			}
		}

		$wrapper.css('left', 0);
		$wrapper.css('width', width + 'px');
		this.initFetch();
		//console.log('update');
	};

	this.showOrHideArrows = function (count) {
		var display = count > 3 ? 'block' : 'none';
		self.wnd.$.find('.news-arrow').css('display', display);
	};

	this.getContLocalAndGlobalPromo = function (data) {
		var countLocal = 0;
		var countGlobal = 0;
		//for (var k in data) {
		//	if (data[k].is_personal == 1)  countLocal++;
		for (var i = 0; i < data.length; i++) {
			if (data[i].is_personal == 1)  countLocal++;
			else                           countGlobal++;
		}
		return {
			local		:countLocal,
			global	:countGlobal
		}
	};

	this.updateGlobalBackground = function (bck) {
		if (!isset(bck)) {
			console.warn('News: no promo background from engine');
			return;
		}
		var image = 'url('+cdnUrl+'/obrazki/promocje/' + bck + ')';
		globalBckUrl = image;
		self.wnd.$.find('.time-promo-background').css('background', image );
	};

	this.createClassicTile = function (rec) {
		var id = rec.id;
		//var image = 'url(../img/spr4.png)'; //data[k].image; 'spr4.png'
		var image = 'url('+cdnUrl+'/obrazki/promocje/' + rec.image + ')'; //data[k].image; 'spr4.png'
		var $tile = self.getNewClassicTile().addClass('promo-tile-id-' + id);
		var shortTime = isset(rec.lvl_max) && isset(rec.seconds_left);
		var price = isset(rec.price) ? rec.price : 0;

		$tile.find('.tile-background').css('background', image );
		$tile.find('.title-bck').css('background', image + '0 -167px');
		$tile.find('.graphic-bck').css('background', image + '0px -209px');
		$tile.find('.buy-info').html(price + _t('sl', null,'clan'));
		if (rec.lvl_max) $tile.find('.requires-level').html('Max Lvl: ' + rec.lvl_max + (shortTime ? ' | ' : ''));

		var $buy = drawSIButton(_t('buy_promo'));
		$tile.find('.buy-button-wrapper').append($buy);
		$buy.click(function () {
			self.usePromoId(rec.id);
		});

		this.createSlotsOnItems($tile, rec.offer);
		this.setInterval(id, rec.seconds_left, $tile, shortTime);

		content.find('.news-for-you-section').find('.for-you').append($tile);

		if (rec.is_used) this.setTileUsed(id);
	};

	this.createTimePromoTile = function (rec, kind, count) {
		var id =  rec.id;
		var $tile = self.getNewsTimePromo().addClass(kind).addClass('promo-tile-id-' + id);
		var image = globalBckUrl; //globalBckUrl
		var position = kind == 'big' ? '0px -381px' : '-85px -381px';
		var buttonPosition = kind == 'big' ? ['-85px -493px', '-85px -530px'] : ['-85px -567px', '-85px -596px'];
		var price = isset(rec.price) ? rec.price : 0;

		$tile.find('.tile-background').css('background', image );
		$tile.find('.tile-background').css('background-position', position);
		$tile.find('.title-time-promo-tile').html('Pakiet ' + count);//rec.name
		$tile.find('.price-time-promo-tile').html(price + ' ' + _t('sl', null,'clan'));

		var $buy = $('<div>').addClass('buy-button').css({
			'background': image,
			'background-position': buttonPosition[0]
		});
		$buy.hover(function () {
			$buy.css('background-position', buttonPosition[1])
		}, function () {
			$buy.css('background-position', buttonPosition[0])
		});
		$buy.append($('<div>').html(_t('buy_promo')).addClass('label'));
		$tile.find('.buy-button-wrapper').append($buy);
		$buy.click(function () {
			self.usePromoId(id);
		});

		//this.createSlotsOnItems($tile, rec.offer, [image, '-147px -381px']);
		this.createSlotsOnItems($tile, rec.offer);
		self.wnd.$.find('.package-wrapper').append($tile);

		if (rec.is_used) this.setTileUsed(id);
		if (getTimePromo) {
			getTimePromo = false;
			var $con = self.wnd.$.find('.news-time-promo-section');
			this.setInterval(id, rec.seconds_left, $con);
		}
	};

	this.usePromoId = function (id) {
		_g('promotions&a=use&id=' + id)
	};

	//this.updatePosition = function (next) {
	//	var $wrapper = content.find('.news-for-you-section').find('.for-you');
	//	var w = parseInt($wrapper.css('width'));
	//	var wOverflow = parseInt(content.find('.news-for-you-section').find('.section-content').width());
	//
	//	if (next) left += tileWidth;
	//	else left -= tileWidth;
	//
	//	if (left > 0) left = 0;
	//	if (Math.abs(left) > w - wOverflow) left = -(w - wOverflow);
	//
	//	$wrapper.css('left', left);
	//};


	this.updatePosition = function (next, wrapperContentSelector, widthOneElement, kind) {
		var $wrapper = content.find(wrapperContentSelector);
		var w = parseInt($wrapper.css('width'));
		var wOverflow = parseInt($wrapper.parent().width());
		var nextTileNotExist = false;

		var key = 'left' + kind;	//		this.leftNews orn this.leftPromo


		if (next) self[key] += widthOneElement;
		else self[key] -= widthOneElement;

		if (self[key] > 0) self[key] = 0;
		if (Math.abs(self[key]) > w - wOverflow) {
			self[key] = -(w - wOverflow);
			nextTileNotExist = true;
		}

		$wrapper.css('left', self[key]);


		return nextTileNotExist;
	};


	this.setInterval = function (id, time, $tile, shortTime) {
		if (intervals[id]) this.clearInterval(id);
		var t = time;
		if (!isset(time)) return;
		console.log(shortTime)
		$tile.find('.requires-text').html(getSecondLeft(t, shortTime));
		if (t == 0) return;
		intervals[id] = setInterval(function () {
			if (t == 0) self.clearInterval(id)
			$tile.find('.requires-text').html(getSecondLeft(t--, shortTime));
		}, 1000);
	};

	this.clearInterval = function (id) {
		clearInterval(intervals[id]);
		intervals[id] = null;
		delete intervals[id];
	};

	this.createSlotsOnItems = function ($tile, offer, timeBackground) {
		for (var i = 0; i < offer.length; i++) {
			var rec = offer[i];
			var id = rec[0];
			var amount = rec[1];
			var $slot = $('<div>').addClass('item-slot offer-' + id);
			if (timeBackground) $slot.css({
				'background': timeBackground[0],
				'background-position': timeBackground[1]
			});
			$slot.attr('data-amount', amount);
			$tile.find('.tile-items-wrapper').append($slot);
		}
	};


	this.close = function () {
		for (var i in intervals) {
			this.clearInterval(i);
		}
		intervals = {};
		delete intervals;
		if (banerInterval) {
			clearInterval(banerInterval);
			banerInterval = null;
		}
		self.wnd.$.remove();
		g.tplsManager.removeCallback('o', self.newPackItem);
		g.tplsManager.deleteMessItemsByLoc('o');
		delete (self.wnd);
		g.news = false;
		delete(self);
		g.lock.remove('new_window');
	};

	this.getNewsPanel = function () {
		return $(
			'<div class="news-panel">'+
			'<div class="header-wrapper">' +
			'<div class="graphic"></div>' +
			'<div class="news-panel-label"></div>' +
			'</div>' +
			'<div class="middle-graphics"></div>' +




			'<div class="news-content">' +
			'	<div class="crazy-bar"></div>' +
			'	<div class="news-section">' +
			'		<div class="section-content">' +
			'			<div class="news-section-overflow"></div>' +
			'		</div>' +
			'		<div class="left-news-btn news-graph-arrow news-arrow-element"></div>' +
			'		<div class="right-news-btn news-graph-arrow news-arrow-element"></div>' +
			'		<div class="news-pagination"></div>' +
			'	</div>' +
			'	<div class="news-for-you-section">' +
			'		<div class="section-header forYou"></div>' +
			'		<div class="section-content">' +
			'			<div class="for-you"></div>' +
			'		</div>' +
			'		<div class="left-arrow news-arrow news-arrow-element"></div>' +
			'		<div class="right-arrow news-arrow news-arrow-element"></div>' +
			'	</div>' +
			'	<div class="news-time-promo-section">' +
			'		<div class="section-content">' +
			'			<div class="time-promo-background"></div>' +
			'			<div class="package-positioner">' +
			'				<div class="package-wrapper"></div>' +
			'			</div>' +
			'			<div class="requires-text-wrapper">' +
			'				<div class="requires-text"></div>' +
			'			</div>' +
			'		</div>' +
			'	</div>' +
			'</div>' +




			'<div class="bottom-panel-graphics"></div>' +
			'<div class="closebut"></div>' +
			'</div>');
	};

	this.getNewClassicTile = function () {
		return $(
			'<div class="news-classic-tile">' +
			'<div class="tile-background">' +
			'<div class="graphic-bck"></div>' +
			'<div class="title-bck"></div>' +
			'</div>' +
			'<div class="tile-items-positioner">' +
			'<div class="tile-items-wrapper"></div>' +
			'</div>' +
			'<div class="requires-text-wrapper">' +
			'<div class="requires-level"></div>' +
			'<div class="requires-text"></div>' +
			'</div>' +
			'<div class="used-text"></div>' +
			'<div class="buy-button-wrapper"></div>' +
			'<div class="buy-info"></div>' +
			'</div>'
		);
	};

	this.getNewsTimePromo = function () {
		return $(
		'<div class="news-time-promo-tile">' +
			'<div class="tile-background"></div>' +
			'<div class="title-time-promo-tile"></div>' +
			'<div class="price-time-promo-tile"></div>' +
			'<div class="tile-items-positioner">' +
			'<div class="tile-items-wrapper"></div>' +
			'</div>' +
			'<div class="used-text-wrapper">' +
			'<div class="used-text"></div>' +
			'</div>' +
			'<div class="buy-button-wrapper"></div>' +
			'<div class="buy-info"></div>' +
			'</div>'
		);
	};
}

