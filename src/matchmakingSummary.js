function matchmakingSummary() {
	var $content;
	var self = this;
	var hugeRewardTpl;
	var bigRewardTpl;
	var smallRewardTpl;
	var firstProgressItemFetch = true;

	this.init = function () {
		this.initWindow();
		this.initNextFightButton();
		this.initCloseButton();
		this.setShow(false);
	};

	this.newBattleSummaryItem = function (item) {
		var slots = $('#matchmaking-summary').find('.progress-tpl-slot-id-' + item.id);

		slots.each(function () {
			var $clone = item.$.clone();
			$(this).append($clone);

			$clone.click(function () {
				createMenuToItem(item, $(this).parent(), $(this));
			});
		});
	};

	function canPreviewStatMenu(i, m) {
		var fun = '_g("moveitem&st=2&tpl=' + i.id + '"); g.tplsManager.deleteMessItemsByLoc("p"); g.tplsManager.deleteMessItemsByLoc("s");';
		m.push([_t('show', null, 'item'), fun, true]);
	}

	function createMenuToItem(data, $wrapper, $item) {
		var m = [];
		if (isset(parseItemStat(data.stat).canpreview)) canPreviewStatMenu(data, m);
		if ($wrapper) canTakeItem($wrapper, m);

		if (m.length == 0) return;
		showMenu({target:$item}, m);
	}

	// function parseItemStats (item) {
	// 	var s = item.stat.split(';');
	// 	var obj = {};
	// 	for (var i = 0; i < s.length; i++) {
	// 		var pair = s[i].split('=');
	// 		obj[pair[0]] = isset(pair[1]) ? pair[1] : null;
	// 	}
	// 	return obj;
	// }

	function canTakeItem ($wrapper, m) {
		var reward_stage = $wrapper.attr('reward_stage');
		if (reward_stage == null) return;
		var idX = $wrapper.attr('reward_idx');

		var fun = '_g("match&a=summary&reward_stage=' + reward_stage + '&reward_idx=' + idX + '");';
		m.push([_t('take_reward', null, 'matchmaking'), fun, true]);
	}

	this.getMatchmakingSummaryHtml = function () {
		return $(
		'<div id="matchmaking-summary">' +

		'	 <div class="header-text"></div>' +

		'	 <div class="summary-content">' +
		'		 <div class="classification-match wood-bar">' +
		'				<div class="classification-match-val wood-bar-val"></div>' +
		'		 </div>' +
		'		 <div class="difficult-stars wood-bar">' +
		'				<div class="difficult-stars-val wood-bar-val">' +
		'					<div class="text" data-trans="#fight_dificult"></div>' +
		'					<div class="stars-wrapper"></div>' +
		'				</div>' +
		'		 </div>' +
		'		 <div id="result-panel">' +
		'			 <div class="your-side">' +
		'				 <div class="your-result"></div>' +
		'				 <div class="your-name-and-level"></div>' +
		'				 <div class="your-prof"></div>' +
		'				 <div class="your-pr"></div>' +
		'			 </div>' +
		'			 <div class="middle-side">' +
		'				 <div class="middle-wrapper">' +
		'					 <div class="avatars-info-wrapper">' +
		'						 <div class="your-outfit-wrapper">' +
		'							 <div class="out-icon"></div>' +
		'						 </div>' +
		'						 <div class="vs-img-wrapper">' +
		'							 <div class="vs-img"></div>' +
		'						 </div>' +
		'						 <div class="enemy-outfit-wrapper">' +
		'							 <div class="out-icon"></div>' +
		'						 </div>' +
		'					 </div>' +
		'				 </div>' +
		'				 <div class="pr-change"></div>' +
		'				 <div class="arrow"></div>' +
		'			 </div>' +
		'			 <div class="enemy-side">' +
		'				 <div class="enemy-result"></div>' +
		'				 <div class="enemy-name-and-level"></div>' +
		'				 <div class="enemy-prof"></div>' +
		'				 <div class="enemy-pr"></div>' +
		'      </div>' +
		'		 </div>' +

		'		 <div class="progress-points wood-bar">' +
		'				<div class="progress-points-val wood-bar-val"></div>' +
		'		 </div>' +

		'    <div class="current-stage"></div>' +

		'    <div class="price-info"></div>' +

		'  </div>' +
		'  <div class="bottom-panel-graphics">' +
		//'    <div class="tokens-amount"></div>' +
		//'    <div class="close-wrapper"></div>' +
		'	 </div>' +
		'</div>'
		);
	};

	this.initWindow = function () {
		$content = self.getMatchmakingSummaryHtml();
		$content.find('.header-text').html(_t('mass_summary', null, 'auction'));
		$('body').append($content);
	};

	this.initCloseButton = function () {
		createMMButton(_t('close'), $content.find('.bottom-panel-graphics'), function () {
			self.setShow(false);
		});
	};

	this.initNextFightButton = function () {
		createMMButton(_t('next_fight'), $content.find('.bottom-panel-graphics'), function () {
			self.setShow(false);
			_g('fight&a=nextmatch');
		});
	};

	this.setShow = function (state) {
		$content.css('display', state ? 'block' : 'none');
	};


	this.simulate = function () {
		var v = {
			'big_reward_tpl': {
				cl: 15,
				icon: "sur/kam07.gif",
				loc: "t",
				name: "Eterium",
				pr: 1,
				st: 0,
				stat: "nodepo;capacity=100;soulbound;unique",
				tpl: 23944
			},
			daily_stage: {
				id: 0,
				points_cur: 8,
				points_max: 12,
				points_step: 4,
				rewards_last: 0,
				rewards_cur: 0,
				rewards_max: 3
			},
			small_reward_tpl: {
				cl: 16,
				icon: "zlo/skrzynia.gif",
				loc: "t",
				name: "Skrzynia z niespodziankï¿½",
				pr: 0,
				st: 0,
				stat: "lootbox2=1111;soulbound",
				tpl: 23806
			},
			opponent_icon: "/paid/bdm02.gif",
			opponent_lvl: 150,
			opponent_prof: "w",
			opponent_rating: 1295,
			points_gained: 2,
			rating: 1505,
			rating_delta: 5,
			result: 0,
			shop_id: 472
		};
		this.updateSummary(v);
	};

	this.updateSummary = function (v) {
		this.setShow(true);
		this.createRewardItems(v);
		var data = {
			result: self.getResult(v.result),
			name: hero.nick,
			lvl: getHeroLevel(),
			oplvl: hero.getOperationLevel(),
			prof: hero.prof,
			pr: v.rating,
			icon: hero.img

		};
		var data2 = {
			result: self.getResult(v.result, true),
			name: self.tLang('opponent'),
			lvl: v.opponent_lvl,
			oplvl: v.opponent_oplvl,
			prof: v.opponent_prof,
			pr: v.opponent_rating,
			icon: v.opponent_icon

		};
		self.updateGreenHeader(data.result);

		self.updateOutfit('your', data);
		self.updateOutfit('enemy', data2);
		self.updateStars(v.difficulty_rank);
		self.updateClassificationMatch(v.placement_cur, v.placement_max);
		self.setArrow(data.result);
		self.setChangePr(data.result, v.rating_delta);
		self.setProgressPoints(v.points_gained);
		var r = v.daily_stage;
		self.setMachmakingProgressStage(r.id, r.points_cur, r.points_max, r.rewards_max, r.rewards_cur, r.rewards_last);
		if (firstProgressItemFetch) firstProgressItemFetch = false;
		else g.tplsManager.removeCallback('d', self.newBattleSummaryItem);
		g.tplsManager.fetch('d', self.newBattleSummaryItem);
	};

	this.updateStars = function (amount) {
		$content.find('.difficult-stars-val').find('.text').html(_t('fight_dificult'));
		var starWrapper = $content.find('.difficult-stars-val').find('.stars-wrapper');
		starWrapper.empty();
		for (var i = 1; i < 11; i+=2) {
			var $star = $('<div>').addClass('star');
			if (i < amount + 1) {

				if (i == amount && i % 2) $star.addClass('half-star');

			} else $star.addClass('empty-star');

			starWrapper.append($star);
		}
	};

	this.updateClassificationMatch = function (min, max) {
		var $val = $content.find('.classification-match-val');
		var $dificult = $content.find('.difficult-stars');
		var bool = min >= max;
		if (bool) {
			$val.css('display', 'none');
			$dificult.css({
				'margin-top': '15px',
				'margin-bottom' : '12px'
			});
		} else {
			$val.css('display', 'block');
			$dificult.css({
				'margin-top': '8px',
				'margin-bottom' : '0px'
			});
		}


		$content.find('.classification-match-val').html(_t('classification_match') + ' ' + min + '/' + max);
	};

	this.getResult = function (result, invert) {
		var cl;
		switch(result) {
			case 1 :
				if (invert) cl = 'win';
				else cl = 'lose';
				break;
			case 0:
				if (invert) cl = 'lose';
				else cl = 'win';
				break;
			case 2:
				cl = 'draw';
				break;
		}
		return cl;
	};

	this.createHugeRewardTpl = function (v) {
		if (isset(hugeRewardTpl)) return;
		hugeRewardTpl = v;
	};

	this.createBigRewardTpl = function (v) {
		if (isset(bigRewardTpl)) return;
		bigRewardTpl = v;
	};

	this.createSmallRewardTpl = function (v) {
		if (isset(smallRewardTpl)) return;
		smallRewardTpl = v;
	};

	this.createRewardItems = function (v) {
		self.createHugeRewardTpl(v.huge_reward_tpl);
		self.createBigRewardTpl(v.big_reward_tpl);
		self.createSmallRewardTpl(v.small_reward_tpl);
	};

	this.getRomeVal = function (v) {
		switch (v) {
			case 0 :
				return 'I';
			case 1 :
				return 'II';
			case 2 :
				return 'III';
			case 3 :
				return 'IV';
			case 4 :
				return 'V';
			case 5 :
				return 'VI';
		}
	};

	this.setMachmakingProgressStage = function (id, currentPoints, maxPoints, amountItems, rewards_cur, rewards_last) {
		var $progressStage = g.matchmaking.getprogressBarTpl();
		var barW = 250;
		var first = [true];

		$content.find('.current-stage').empty().append($progressStage);
		self.setTokenAmounts();

		var w = barW / amountItems;
		var p = barW * (currentPoints / maxPoints);
		var $itemsWrapper = $progressStage.find('.items-wrapper');

		$progressStage.find('.background-bar').css('width', p);
		$progressStage.find('.stage').html(self.tLang('stage') + ' ' + self.getRomeVal(id));
		$progressStage.find('.ratio').html(currentPoints + '/' + maxPoints);

		for (var i = 1; i < amountItems + 1; i++) {
			var $itemsChestSlot = $('<div>').addClass('item-chest-slot');
			var pos = i * w;
			var $border = $('<div>').addClass('item-chest-border');

			$itemsChestSlot.append($border);
			self.appendPriceItemToSlot(first, $border, $itemsChestSlot, i, rewards_cur, rewards_last, amountItems, currentPoints, id);
			$itemsChestSlot.css('left', pos);
			$itemsWrapper.append($itemsChestSlot);

			if (i == amountItems) continue;

			var $measure = $('<div>').addClass('measure');
			$measure.css('left', pos);
			$itemsWrapper.append($measure);
		}
	};

	this.appendPriceItemToSlot = function (first, $border, $itemsChestSlot, i, rewards_cur, rewards_last, amountItems, currentPoints, index) {
		var cl = '';
		var available = false;
		var disabled = false;
		var cl2 = 'unavailable-level';
		var idTpl = smallRewardTpl;

		if (rewards_last >= i) {
			cl += 'disabled';
			cl2 = 'disabled ' + cl2;
			disabled = true;
		}

		if (currentPoints == 0 && rewards_cur == 0 && rewards_last == 0) {
			cl += 'disabled';
			cl2 = 'disabled ' + cl2;
			disabled = true;
		}

		if (!disabled && i <= rewards_cur ) {
			cl += ' available-level';
			available = true;
		} else cl += ' unavailable-level';

		if (i == amountItems) {
			cl += '-last';
			cl2 += '-last';
			idTpl = bigRewardTpl;
		}

		if (i === 5 && index === 3) {
			idTpl = hugeRewardTpl;
		}

		if ($('#matchmaking-summary').find('.first').length == 0 && available && !disabled) {
			cl += ' first';
			$itemsChestSlot.attr('reward_stage', index);
			$itemsChestSlot.attr('reward_idx', (i - 1));
		}

		$border.addClass(cl);
		$itemsChestSlot.addClass(cl2);
		$itemsChestSlot.addClass('progress-tpl-slot-id-' + idTpl);
	};

	this.setProgressPoints = function (points) {
		$content.find('.progress-points-val').html(_t('got_points', {'%val%':points}, 'matchmaking'));
	};

	this.setTokenAmounts = function () {
		//var amount = HeroEquipment.getCountAbbyssCurrency();
		var amount = 6;
		var $span2 = $('<span>').html(amount);
		$content.find('.tokens-amount').empty();
		$content.find('.tokens-amount').append($span2);
	};

	this.setChangePr = function (result, pr) {
		$content.find('.pr-change').html(pr + ' PR').removeClass('win lose').addClass(result);//rating_delta
	};

	this.setArrow = function (result) {
		$content.find('.arrow').removeClass('win lose').addClass(result);
	};

	this.updateGreenHeader = function (result) {
		var str = result == 'win' ? 'battle_banner_win_header' : 'battle_banner_lose_header';
		$content.find('.edit-header-label').html(_t(str, null, 'battle'));
	};

	this.updateOutfit = function (side, data) {
		var $wrapper = $content.find('.' + side + '-side');
		var url = CFG.opath + data.icon;
		let characterData = {
			level			: data.lvl,
			operationLevel	: data.oplvl,
			prof			: data.prof

		}
		let characterInfo = getCharacterInfo(characterData);


		$wrapper.find('.' + side + '-result').html(_t(data.result + '_p', null, 'matchmaking')).removeClass('win lose').addClass(data.result);
		$wrapper.find('.' + side + '-name-and-level').html(data.name);
		//$wrapper.find('.' + side + '-prof').html(data.lvl + data.prof);
		$wrapper.find('.' + side + '-prof').html(characterInfo);
		$wrapper.find('.' + side + '-pr').html(data.pr + ' PR').removeClass('win lose').addClass(data.result);
		const $outfitWrapper = $content.find('.' + side + '-outfit-wrapper').find('.out-icon')
		createImgStyle($outfitWrapper, url);
	};

	this.tLang = function (name ) {
		return _t(name, null, 'matchmaking');
	};

	this.init();


}
