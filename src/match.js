function MatchManager () {
	var currentState = null;
	var timer = null;
	var $alert = null;
	var $overlay = null;
	var hugeRewardTpl;
	var bigRewardTpl;
	var smallRewardTpl;
	var firstProgressItemFetch = true;
	var firstSeasonItemFetch = true;
	var firstTakeRewardItemFetch = true;
	var yourPosition = null;
	var $activeButtonMenu = null;
	var abbyssCurrency = 0;
	var chempionCurrency = 0;
	var chooseOutfit = null;
	var oldSeasonData = null
	var $dialog = {
		header: null,
		body: null
	};

	var queueState = {
		startTime: null,
		avgTime: null,
		avgTimeFunc: null,
		endTime: null,
		$element: null,
		tipFunc: null,
		onUpdate: null
	};

	var hideWindows = [];

	let buildsCommons = null;
	let eqPanelOpen = false;
	let rewardsToGet = false;


	const initBuildsCommons = () => {
		buildsCommons = new BuildsCommons();
		buildsCommons.init('');
	};

	this.getOldSeasonData = function () {
		return oldSeasonData;
	};

	function showAlls() {
		for(var t in hideWindows) {
			hideWindows[t].show();
		}
		hideWindows = [];
	};

	function hideAlls() {
		if($("#dlgwin").css("display") != "none") {
			hideWindows.push($("#dlgwin"));
			$("#dlgwin").hide();
		}
		if($("#config").css("display") != "none") {
			hideWindows.push($("#config"));
			$("#config").hide();
		}
		var above = "battle";
		var list = $("#centerbox").children();
		var fromNow = false;
		list.each(function() {
			if(fromNow && $(this).attr("id") && $(this).css("display") != "none" && $(this).attr("id") != "chat") {
				hideWindows.push($(this));
				$(this).hide();
			}
			if($(this).attr("id") == above) {
				fromNow = true;
			}
		});
	}

	function secondToTime (val) {
		var sec = val % 60;
		var min = (val - sec) / 60;
		var rmin = min % 60;
		var hou = (val - (rmin * 60) - sec) / 3600;
		return {
			s: sec,
			m: rmin,
			mf: min,
			h: hou
		};
	}

	function timeToStr (h, m, s, empty) {
		var txt = "";
		if (empty == null)
			empty = false;
		if (!empty || (empty && s != 0)) {
			txt = s + " s";
		}
		if (m > 0) {
			txt = m + " min " + txt;
		}
		if (h > 0) {
			if (!empty || (empty && h != 0)) {
				txt = h + " h " + txt;
			}
		}
		return txt;
	}

	function updateTimeElement (diff) {
		if (queueState.$element == null)
			return;
		var time = secondToTime(diff);
		if (diff >= 6000) {
			queueState.$element.text("99:59");
		} else if (diff >= 60) {
			queueState.$element.text(zero(time.mf) + ":" + zero(time.s));
		} else {
			queueState.$element.text(time.s + " s");
		}
		if (queueState.tipFunc != null) {
			var txt = timeToStr(time.h, time.m, time.s);
			queueState.$element.attr("tip", queueState.tipFunc(txt));
		}
	}

	function queueLoop () {
		var now = unix_time();
		var diff = now - queueState.startTime;
		var avg = queueState.avgTime;
		if (diff < 0)
			diff = 0;
		if (queueState.onUpdate != null) {
			var time = secondToTime(diff);
			var atime = secondToTime(queueState.avgTime);
			var since = timeToStr(time.h, time.m, time.s);
			var average = "~" + timeToStr(atime.h, atime.m, atime.s, true);
			if (queueState.avgTime == 0) {
				average = "-";
			}
			queueState.onUpdate(since, average);
		}
		updateTimeElement(diff);
	}

	function acceptLoop () {
		var now = unix_time();
		var diff = queueState.endTime - now;
		if (diff < 0)
			diff = 0;
		updateTimeElement(diff);
	}

	function releaseLoop () {
		if (timer != null) {
			clearInterval(timer);
			timer = null;
		}
	}

	function getDateFromTimestamp (val) {
		var d = new Date(val * 1000),
			y = d.getFullYear();
		return _t("date %d %m %y", {
			"%d%": d.getDate(),
			"%m%": (d.getMonth() + 1),
			"%y%": y
		}, "matchmaking");
	}

	function getDiffMinutesFromTimestamps (minuend, subtrahend) {
		var diff = minuend - subtrahend;
		if(diff < 0)
			diff = 0;
		var mins = 0;
		var secs = diff % 60;
		mins = (diff - secs) / 60;
		return mins + ":" + zero(secs) + " min";
	}

	function profSymbolToText (sym) {
		var prof_name = "";
		switch (sym) {
		case "w":
			prof_name = "prof_warrior";
			break;
		case "p":
			prof_name = "prof_paladyn";
			break;
		case "b":
			prof_name = "prof_bladedancer";
			break;
		case "m":
			prof_name = "prof_mag";
			break;
		case "h":
			prof_name = "prof_hunter";
			break;
		case "t":
			prof_name = "prof_tracker";
			break;
		}
		return prof_name;
	}

	function resultSymbolToText (sym) {
		var name = "";
		switch (sym) {
		case 0:
			name = "Win";
			break;
		case 1:
			name = "Lose";
			break;
		case 2:
			name = "Draw";
			break;
		}
		return name;
	}

	function createItem (id, st, container, priceItem) {
		var data = null;
		if (!priceItem) {
			if (id == 0) return;

			if (isset(g.item) && isset(g.item[id])) data = g.item[id];
			else return;
		} else data = priceItem;
		var $item = $('<div>').addClass('item');
		var $img = $('<img>');
		$item.attr({
			'tip' : itemTip(data),
			'ctip': 't_item'
		});
		$img.attr('src', CFG.ipath + data.icon);
		$item.append($img);
		$item.addClass("MM-item-st-" + st);
		var hClasses = {
			'upgraded':'t_upg',
			'unique':'t_uni',
			'heroic':'t_her',
			'legendary':'t_leg',
			'artefact':'t_art'
		};

    let stats = parseItemStat(data.stat);

		for (var h in hClasses) {
			// if(RegExp(h).test(data.stat)) {
			if(isset(stats[h])) {
				var $o = $('<div>').addClass('itemHighlighter ' + hClasses[h]);
				$o.addClass(getClassOfItemRank());
				$item.prepend($o);
				break;
			}
		}
		if (container) container.append($item);
		return {$:$item}
	}

	function showOverlay () {
		if ($overlay != null) {
			hideOverlay();
		}
		$overlay = $("<div>").addClass("MM-overlay").appendTo("body");
		$("#bottombar, #pvpmode, #botloc, #lagmeter, #chat, #bchat").addClass("MM-overlay-element");
		$("#pvpmode").addClass("MM-overlay-element2");
	}

	function hideOverlay () {
		if ($overlay != null) {
			$overlay.remove();
			$("#bottombar, #botloc, #lagmeter, #chat, #bchat").removeClass("MM-overlay-element");
			$("#pvpmode").removeClass("MM-overlay-element2");
			$overlay = null;
		}
	}

	function hideAlert () {
		if ($alert == null)
			return;
		g.lock.remove('mmalert');
		$alert.remove();
		$alert = null;
	}

	function acceptAlert () {
		$("#alert").hide();
		showOverlay();
		var confirm = function () {
			updateDialogWaiting();
			//showOverlay();
			_g('match&a=accept_opp&ans=1');
		};
		var reject = function () {
			_g('match&a=accept_opp&ans=0');
			hideOverlay();
		};
		g.lock.add('mmalert');
		queueState.tipFunc = null;
		var txt = _t("found_opponent", null, "matchmaking");
		$alert = $("<div>").addClass("MM-alert").appendTo("body");
		$("<div>").addClass("a1").appendTo($alert);
		var $txt = $("<div>").addClass("a2 MM-asktxt").html(txt).appendTo($alert);
		var $timer = $("<div>").addClass("MM-timer").appendTo($txt);
		var $buttons = $("<div>").addClass("a3").appendTo($alert);
		var $butOk = $("<button>").addClass("bal_yes").appendTo($buttons);
		var $butCancel = $("<button>").addClass("bal_no").appendTo($buttons);
		$butOk.unbind('click').click(function () {
			confirm();
			$butOk.unbind('click');
			$butOk.blur();
			hideAlert();
		});
		$butCancel.unbind('click').click(function () {
			reject();
			$butCancel.unbind('click');
			$butOk.blur();
			hideAlert();
		});
		$alert.absCenter().fadeIn('fast', function () {
			$butOk.focus();
		});
		queueState.$element = $timer;
		acceptLoop();
	}

	function toggleQueue () {
		if (currentState == 0) {
			_g('match&a=signin');
		} else if (currentState == 1) {
			_g('match&a=signout');
		}
	}

	function openProgress () {
		_g('match&a=profile');
	}

	function openSeason () {
		_g('match&a=season');
	}

	function openStatistics (id) {
		if (id == null) {
			//_g('match&a=profile');
			_g('match&a=statistics');
		} else {
			_g('match&a=statistics_detailed&player_id=' + id);
		}
	}

	function openHistory (page) {
		if (page == null)
			page = 1;
		_g('match&a=history&page=' + page);
	}

	function openGeneralRanking (page) {
		if (page == null)
			page = 1;
		_g('match&a=ladder_global&page=' + page);
	}

	function openClanRanking (page) {
		if (page == null)
			page = 1;
		_g('match&a=ladder_clan&page=' + page);
	}

	function openFriendsRanking (page) {
		if (page == null)
			page = 1;
		_g('match&a=ladder_friends&page=' + page);
	}

	function openFight () {
		_g('match&a=prepared');
		updateDialogWaiting();
	}

	function drawButton (name) {
		return '<div class=MM-button><div class=left></div><div class="content">' + goldTxt(name) + '</div><div class=right></div></div>';
	}

	function createBigButton (name, secondName) {
		var $el = $("<div>").addClass("MM-big-button MM-" + name + "-button");
		if (secondName == null)
			secondName = name;
		var $header = $("<div>").addClass("MM-big-button-header MM-" + secondName + "-header");
		$header.appendTo($el);
		return $el;
	}

	function showMatchDialog () {
		if ($("#MM-window").length > 0) {
			$dialog.body.empty();
			$("#MM-window").find(".closebut").show();
			return;
		}
		$dialog.header = null;
		$dialog.body = null;
		var $cont = $("<div>").attr("id", "MM-window").addClass("MM-dialog-container").appendTo("body");
		var $header = $("<div>").addClass("MM-dialog-header").appendTo($cont);
		var $wnd = $("<div>").addClass("MM-dialog").appendTo($cont);
		var $headerTxt = $("<div>").addClass("MM-dialog-header-txt").appendTo($wnd);
		var $headerClose = $("<div>").addClass("closebut").appendTo($wnd);
		var $space = $("<div>").addClass("MM-dialog-space").appendTo($wnd);
		$headerClose.attr("rollover", "22");
		$headerClose.click(function () {
			removeDialog();
		});
		$cont.absCenter().fadeIn('fast');
		g.lock.add('mmdialog');
		$dialog.header = $headerTxt;
		$dialog.body = $space;
	}

	function removeDialog () {
		//if (g.matchmaking.canToggleMatchmaking()) {
			$("#MM-window").remove();
			g.lock.remove('mmdialog');
			$dialog.header = null;
			$dialog.body = null;
		//}
	}

	function hideCloseDialog () {
		if ($("#MM-window").length > 0) {
			$("#MM-window").find(".closebut").hide();
		}
	}

	function queueTipTime (txt) {
		return _t("time_in_queue %val", {
			"%val%": txt
		}, "matchmaking");
	}

	function queueTipTimeAvg ($el, sec) {
		var time = secondToTime(sec);
		var txt = "~" + timeToStr(time.h, time.m, time.s, true);
		if (sec == 0) {
			txt = "-";
		}
		var str = _t("average_wait_time %val", {
			"%val%": txt
		}, "matchmaking");
		$el.text(str);
	}

	function drawRow (tab) {
		var el = $("<tr>").addClass("MM-table-row");
		var idx = 1;
		for (var t in tab) {
			$("<td>").addClass("MM-table-col MM-table-col-" + idx).append(tab[t]).appendTo(el);
			idx++;
		}
		return el;
	}

	function addTimer () {
		var $timer = $("<div>").addClass("MM-dialog-timer").appendTo($dialog.body);
		var $timerTxt = $("<div>").addClass("MM-dialog-timer-txt").appendTo($timer);
		queueState.$element = $timerTxt;
	}

	function addPaginator (cname, curr, max, func) {
		if (cname == null)
			cname = "";
		var cont = $("<div>").addClass("MM-paginator " + cname);
		var $contxt = $("<div>").addClass("contxt");
		var page = $("<span>").addClass("txt").appendTo($contxt);
		var ipage = $("<input>").addClass("inptxt").appendTo($contxt);
		var page2 = $("<span>").addClass("txt2").appendTo($contxt);
		ipage.val(curr);
		ipage.change(function () {
			var val = parseInt(ipage.val());
			if (val >= 1 && val <= max) {
				func(val);
			} else {
				ipage.val(curr);
			}
		});
		page.text(_t("page", null, "matchmaking"));
		page2.text("/" + max);
		var prev = $(drawButton("<", "")).appendTo(cont);
		$contxt.appendTo(cont);
		var next = $(drawButton(">", "")).appendTo(cont);
		prev.click(function () {
			if (curr <= 1)
				return;
			func(curr - 1);
		});
		next.click(function () {
			if (curr >= max)
				return;
			func(curr + 1);
		});
		cont.appendTo($dialog.body);
	}

	function createProgressDialogHtml () {
	return $(
		'<div class="progress-wnd section">' +
			'<div class="left-side">' +
				'<div class="char-info"></div>' +
				'<div class="char-prof"></div>' +
				'<div class="outfit-wrapper">' +
					'<div class="outfit-img"></div>' +
				'</div>' +
				'<div class="progress-buttons-wrapper">' +
					'<div class="details-btn"></div>' +
					'<div class="go-to-shop-btn"></div>' +
				'</div>' +
			'</div>' +
			'<div class="right-side"></div>' +
				'<div class="progress-bottom-panel">' +
				'<div class="back-to-main"></div>' +
				'<div class="get-all"></div>' +
			'</div>' +
		'</div>'
		);
	}

	function createSeasonDialogHtml () {
		return $(
			'<div class="season-wnd section">' +
			'  <div class="season-reward-header"></div>' +
			'	 <div class="reward-wrapper">' +
			'    <div class="reward-graphic"></div>' +
			'	 </div>' +
			'  <div class="season-winners-header"></div>' +
				//'  <div class="winners-wrapper"></div>' +
			'	<div class="winners-background"></div>' +
			'	<div class="winners-wrapper">' +
			'		<div class="header-info"></div>' +
			'		<div class="txt-info"></div>' +
			'		<div class="outfits-wrapper"></div>' +
			'		  <div class="players-in-ranking-info"></div>' +
			'		  <div class="amount-players-got-outfit-info"></div>' +
			'		  <div class="wrapper-outfit-info"></div>' +
			'   </div>' +
			' </div>' +

			'  <div class="your-season-record"></div>' +
			'  <div class="your-career-record"></div>' +
			'</div>'
		);
	}

	function createMatchmakingProgressStageHtml() {
		return $(
			'<div class="matchmaking-progress-stage">' +
				'<div class="points-side">' +
					'<div class="stage"></div>' +
					'<div class="ratio"></div>' +
				'</div>' +
				'<div class="bar-and-item-side">' +
					'<div class="progress-bar">' +
						'<div class="background-bar"></div>' +
					'</div>' +
					'<div class="items-wrapper"></div>' +
				'</div>' +
			'</div>'
		);
	}

	function checkAbbyssItem (i){
		return /eterium/.test((i.name).toLowerCase());
	}

	function increaseAbbyssItemAmount (i){
		if (!checkAbbyssItem(i)) return;
		var add = isset(parseItemStat(i.stat).amount) ? parseInt(parseItemStat(i.stat).amount) : 1;
		abbyssCurrency += add;
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

	function countAbbyssCurrency () {
		abbyssCurrency = 0;
		for (var k in g.item) {
			if (g.item[k].loc != 'g') continue;
			increaseAbbyssItemAmount(g.item[k]);
		}
	}

	function checkChempionItem (i){
		return /y czempion/.test((i.name).toLowerCase());
	}

	function increaseChempionItemAmount (i){
		if (!checkChempionItem(i)) return;
		var add = isset(parseItemStat(i.stat).amount) ? parseInt(parseItemStat(i.stat).amount) : 1;
		chempionCurrency += add;
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

	function countChempionCurrency () {
		chempionCurrency = 0;
		for (var k in g.item) {
			if (g.item[k].loc != 'g') continue;
			increaseChempionItemAmount(g.item[k]);
		}
	}

	function createRewardItems (v) {
		createHugeRewardTpl(v.huge_reward_tpl);
		createBigRewardTpl(v.big_reward_tpl);
		createSmallRewardTpl(v.small_reward_tpl);
	}

	function createHugeRewardTpl (v) {
		if (isset(hugeRewardTpl)) return;
		hugeRewardTpl = v;
	}

	function createBigRewardTpl (v) {
		if (isset(bigRewardTpl)) return;
		bigRewardTpl = v;
	}

	function createSmallRewardTpl(v) {
		if (isset(smallRewardTpl)) return;
		smallRewardTpl = v;
	}

	function newProgressItem (item) {
		var slots = $('#MM-window').find('.progress-tpl-slot-id-' + item.id);
		slots.each(function () {
			var $clone = item.$.clone();
			$(this).append($clone);

			$clone.click(function () {
				createMenuToItem(item, $(this).parent(), $(this));
			});
		});
	}

	function canTakeItem ($wrapper, m) {
		var reward_stage = $wrapper.attr('reward_stage');
		if (reward_stage == null) return;
		var idX = $wrapper.attr('reward_idx');

		var fun = '_g("match&a=profile&reward_stage=' + reward_stage + '&reward_idx=' + idX + '");';
		m.push([_t('take_reward', null, 'matchmaking'), fun, true]);
	}

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

	function updateDialogProgress (v) {
		var $pD = createProgressDialogHtml();
		showMatchDialog();
		statisticsButtons();
		$pD.appendTo($dialog.body);
		createRewardItems(v);
		countAbbyssCurrency();
		countChempionCurrency();

		var $details = $(drawButton(_t('details', null, 'matchmaking'), ''));
		var $goShopChempions  = $(drawButton(_t('champions-shop', null, 'matchmaking'), ''));
		var $back = $(drawButton(_t("back", null, "matchmaking"), ''));
		var $getAll = $(drawButton(_t("get-all", null, "matchmaking"), ''));

		//$pD.find('.char-info').html(hero.nick + ' ' + hero.lvl + 'lvl');
		//$pD.find('.char-prof').html(_t(profSymbolToText(hero.prof), null, 'eq_prof'));

		let charaData = {
			//showNick        : true,
			level           : getHeroLevel(),
			operationLevel  : hero.getOperationLevel(),
			prof            : hero.getProf(),
			//nick            : hero.getNick()
		}

		$pD.find('.char-info').html(hero.nick);
		$pD.find('.char-prof').html(getCharacterInfo(charaData));

		createImgStyle($pD.find('.outfit-img'), hero.icon);

		$pD.find('.right-side').empty();
		$pD.find('.details-btn').append($details);
		$pD.find('.go-to-shop-btn').append($goShopChempions);
		$pD.find('.back-to-main').append($back);
		$pD.find('.get-all').append($getAll);

		$getAll.click(getAllRewards)

		$details.click(function () {
			g.matchmaking.toggleDetailsWnd();
		});

		$goShopChempions.click(function () {
			removeDialog();
			_g('creditshop&npc=471')
		});
		$back.click(updateDialogHome);

		rewardsToGet = false;
		for (var k in v.daily_stages) {
			var oneStage = v.daily_stages[k];
			setMachmakingProgressStage(oneStage.id, oneStage.points_cur, oneStage.points_max, oneStage.rewards_max, oneStage.rewards_cur, oneStage.rewards_last);
			getAllBtnSetState();
		}
		if (firstProgressItemFetch) firstProgressItemFetch = false;
		else g.tplsManager.removeCallback('d', newProgressItem);
		g.tplsManager.fetch('d', newProgressItem);
		//g.matchmakingTutorial.setTutorialById(1);
	}

	function updateDialogSeasonPosition (v) {
		if (!v) v = oldSeasonData;
		if (!oldSeasonData) oldSeasonData = v;
		if (v.ladder_position == 0) return;
		if (v.rewards.length == 0) return;
		var $html = $(
		'<div id="season-wrapper">' +
			'<div class="your-place"></div>' +
			'<div class="txt-info-1 txt-info" data-trans="#txt-info-1#matchmaking"></div>' +
			'<div class="txt-info-2 txt-info" data-trans="#txt-info-2#matchmaking"></div>' +
			'<div class="your-reward-wrapper">' +
			'		<div class="your-reward"></div>' +
			'		<div class="your-outfits"></div>' +
			'</div>' +
			'<div class="take-in-next-time"></div>' +
			'<div class="take-reward-now"></div>' +
		'</div>'
	);
		if (yourPosition == null) yourPosition = v.ladder_position;

		g.matchmaking.show();
		showMatchDialog();
		var $nextTime = $(drawButton(_t("take_reward_in_next_time", null, "matchmaking"), ''));
		var $takeReward = $(drawButton(_t("take_rewards_now"), ''));

		$html.find('.your-place').html(_t('your_place %place%', {'%place%': '#' + yourPosition}, 'matchmaking'));
		$html.find('.txt-info-1').html(_t('txt-info-1', null, 'matchmaking'));
		$html.find('.txt-info-2').html(_t('txt-info-2', null, 'matchmaking'));
		$html.find('.take-in-next-time').append($nextTime);
		$html.find('.take-reward-now').append($takeReward);
		$html.appendTo($dialog.body);

		$nextTime.click(function () {
			g.matchmaking.show();
		});

		$takeReward.click(function () {
			if ($(this).hasClass('black')) return;
			var url = 'match&a=season&reward_season=1';
			url += chooseOutfit ? '&outfit_idx=' + chooseOutfit : '';
			_g(url, function (data) {
				if (isset(data.item)) {
					//self.wnd.$.find('.show-reward-season-item').css('display', 'none');
					//self.showMatchmakingMenu();
					//$('#MM-window').find('.take-reward').remove();
					yourPosition = null;
					g.matchmaking.show();
				}
			});
		});

		for (var k in v.rewards) {
			var r = v.rewards[k];
			var itemWrapper = $('<div>').addClass('item-wrapper tpl-' + r[0]);
			itemWrapper.attr('data-amount', r[1]);
			$('#season-wrapper').find('.your-reward').append(itemWrapper);
		}

		if (firstTakeRewardItemFetch) firstTakeRewardItemFetch = false;
		else g.tplsManager.removeCallback('i', newRewardSeasonItem);
		g.tplsManager.fetch('i', newRewardSeasonItem);

		if (!isset(v.outfit_one)) return;
		$('#season-wrapper').find('.your-outfits').append(outfitWrapperWithCheckbox(v.outfit_one, 'woman'));
		$('#season-wrapper').find('.your-outfits').append(outfitWrapperWithCheckbox(v.outfit_two, 'man'));
		blockTakeRewardButtonAndClearCheckbox();
	}

	function blockTakeRewardButtonAndClearCheckbox () {
		chooseOutfit = null;
		$('#season-wrapper').find('.active').removeClass('active');
		$('#season-wrapper').find('.take-reward-now').find('.MM-button').addClass('black');
	}

	function outfitWrapperWithCheckbox (patch, kind) {
		var $outfitCheckWrapper = $('<div>').addClass('outfit-check-wrapper ' + kind);
		var $outfitWrapper = $('<div>').addClass('outfit-wrapper');
		var $checkbox = $('<div>').addClass('one-checkbox');
		var $txt = $('<div>').html(_t(kind)).addClass('label');
		$outfitCheckWrapper.append($checkbox);
		$outfitCheckWrapper.append($outfitWrapper);
		$checkbox.click(function () {
			self.wnd.$.find('.season-reward-main').find('.black').removeClass('black');
			chooseOutfit = getOutfitIndex(kind);
			if ($(this).hasClass('active')) return;

			$(this).parent().parent().find('.active').removeClass('active');
			$(this).parent().find('.outfit-wrapper').addClass('active');
			$(this).parent().find('.checkbox').addClass('active');
		});
		$outfitWrapper.click(function () {
			$('#season-wrapper').find('.black').removeClass('black');
			chooseOutfit = getOutfitIndex(kind);
			if ($(this).hasClass('active')) return;

			$(this).parent().parent().find('.active').removeClass('active');
			$(this).parent().find('.outfit-wrapper').addClass('active');
			$(this).parent().find('.checkbox').addClass('active');
		});
		$outfitWrapper.append(getOutfit(patch));
		$outfitWrapper.append($txt);

		return $outfitCheckWrapper;
	}

	getOutfitIndex = function (kind) {
		switch (kind) {
			case 'woman':
				return 1;
			case 'man':
				return 2;
		}
	};

	function createGetRewardButton() {
		var $wrapper = $('#season-wrapper').find('.take-reward-now');
		var $but = tpl.get('button').addClass('small green');
		$but.find('.label').html(_t('take_rewards_now'));
		$wrapper.append($but);
		$but.click(function () {
			if ($(this).hasClass('black')) return;

			var url = 'match&a=season&reward_season=1';
			url += chooseOutfit ? '&outfit_idx=' + chooseOutfit : '';

			_g(url, function (data) {
				if (isset(data.item)) {
					self.wnd.$.find('.show-reward-season-item').css('display', 'none');
					self.showMatchmakingMenu();
				}
			});
		});
	}

	function setMachmakingProgressStage(id, currentPoints, maxPoints, amountItems, rewards_cur, rewards_last) {
		var $progressWnd = $dialog.body.find('.progress-wnd');
		var $progressStage = createMatchmakingProgressStageHtml();
		var barW = 250;
		var first = [true];
		$progressWnd.find('.right-side').append($progressStage);

		var w = barW / amountItems;
		var p = barW * (currentPoints / maxPoints);
		var $itemsWrapper = $progressStage.find('.items-wrapper');

		$progressStage.find('.background-bar').css('width', p);
		$progressStage.find('.stage').html(_t('stage', null, "matchmaking") + ' ' + getRomeVal(id));
		$progressStage.find('.ratio').html(currentPoints + '/' + maxPoints);

		for (var i = 1; i < amountItems + 1; i++) {
			var $itemsChestSlot = $('<div>').addClass('item-chest-slot');
			var pos = i * w;
			var $border = $('<div>').addClass('item-chest-border');

			$itemsChestSlot.append($border);
			appendPriceItemToSlot(first, $border, $itemsChestSlot, i, rewards_cur, rewards_last, amountItems, currentPoints, id);
			$itemsChestSlot.css('left', pos);
			$itemsWrapper.append($itemsChestSlot);

			if (i == amountItems) continue;
			var $measure = $('<div>').addClass('measure');
			$measure.css('left', pos);
			$itemsWrapper.append($measure);
		}
		if (rewards_last < rewards_cur) rewardsToGet = true;
	}

	function appendPriceItemToSlot(first, $border, $itemsChestSlot, i, rewards_cur, rewards_last, amountItems, currentPoints, index) {
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

		if ($('#MM-window').find('.first').length == 0 && available && !disabled) {
			cl += ' first';
			$itemsChestSlot.attr('reward_stage', index);
			$itemsChestSlot.attr('reward_idx', (i - 1));
		}
		$border.addClass(cl);
		$itemsChestSlot.addClass(cl2);
		$itemsChestSlot.addClass('progress-tpl-slot-id-' + idTpl);
	}

	function getRomeVal (v) {
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
	}

	function newSeasonItem (i) {
		var $place = $('.season-wnd').find('.tpl-' + i.id);

		$place.each(function () {
			var $clone = i.$.clone();
			var amount = $(this).attr('data-amount');
			if (amount > 1) {
				g.tplsManager.changeItemAmount(i, $clone, amount)
			}
			$(this).html($clone);

			var stats = parseItemStat(i.stat);
			if (!isset(stats.canpreview)) return;
			$clone.click(function () {
				var fun = '_g("moveitem&st=2&tpl=' + i.id + '"); g.tplsManager.deleteMessItemsByLoc("p"); g.tplsManager.deleteMessItemsByLoc("s");';
				showMenu({target:$clone}, [[_t('show', null, 'item'), fun, true]]);
			});
		});
	}

	function newRewardSeasonItem (i) {
		var $place = $('#season-wrapper').find('.tpl-' + i.id);
		$place.each(function () {
			var $clone = i.$.clone();
			var amount = $(this).attr('data-amount');
			if (amount > 1) {
				g.tplsManager.changeItemAmount(i, $clone, amount)
			}
			$(this).append($clone);
			$clone.click(function () {
				createMenuToItem(i, $(this).parent(), $(this));
			});
		});
	}

	function updateDialogSeason (v) {
		var $sD = createSeasonDialogHtml();
		const txtInfo = v.outfit_one && v.outfit_two ? 'txt-info-outfits' : 'txt-info';

		$sD.find('.season-winners-header').html(_t('last_season_winners', null, "matchmaking"));
		$sD.find('.season-reward-header').html(_t('rewards_of_season', null, "matchmaking"));
		//$sD.find('.winners-wrapper').html(_t('winners_not_exist', null, "matchmaking"));

		$sD.find('.played-battle').html(_t('played-battle', null, "matchmaking") + '?/?');
		$sD.find('.header-info').html(_t('season-header-info', null, "matchmaking"));
		$sD.find('.txt-info').html(_t(txtInfo, null, "matchmaking"));
		$sD.find('.players-in-ranking-info').html(_t('players-in-ranking-info', null, "matchmaking") + '<span>' + v.players_cur + '/' + v.players_max + '</span>');
		$sD.find('.amount-players-got-outfit-info').html(_t('amount-players-got-outfit-info', null, "matchmaking") + '<span>' + v.outfits_cur_count + '</span>');

		$sD.find('.wrapper-outfit-info').append(getOutfit(v.outfit_one));
		$sD.find('.wrapper-outfit-info').append(getOutfit(v.outfit_two));

		if (!(v.outfit_one && v.outfit_two)) {
			$sD.find('.outfits-wrapper').css('display', 'none');
		}

		$sD.find('.your-season-record').html(_t('your-season-record', null, 'matchmaking') + ': '+ v.rating_best_season + ' PR');
		$sD.find('.your-career-record').html(_t('your-career-record', null, 'matchmaking') + ': '+ v.rating_best_career + ' PR');

		showMatchDialog();
		statisticsButtons();
		$sD.appendTo($dialog.body);
		footerDialog();
		$('.season-wnd').find('.item-wrapper').remove();
		createSeasonReward(v);
		if (firstSeasonItemFetch) firstSeasonItemFetch = false;
		else g.tplsManager.removeCallback('r', newSeasonItem);
		g.tplsManager.fetch('r', newSeasonItem);
		//g.matchmakingTutorial.setTutorialById(4);
	}

	function getOutfit (patch) {
		var $out = $('<div>').addClass('season-outfit').css('background-image', 'url(' + CFG.opath + patch + ')');
		return $out;
	}

	function createSeasonReward (v) {
		const { rewards } = v;
		const sortedKeys = Object.keys(rewards).sort((a, b) => {
			const aNum = parseInt(a.split('-')[0]) || parseInt(a);
			const bNum = parseInt(b.split('-')[0]) || parseInt(b);
			return aNum - bNum;
		});

		for (var k of sortedKeys) {
			var $wrapper = $('<div>').addClass('rage-wrapper');
			var $place = $('<div>').html('#' + k).addClass('place place-' + k);

			for (var i = 0 ; i < rewards[k].length; i++ ) {
				var r = rewards[k][i];
				var itemWrapper = $('<div>').addClass('item-wrapper tpl-' + r[0]);
				itemWrapper.attr('data-amount', r[1]);
				$wrapper.append(itemWrapper);
			}
			$wrapper.prepend($place);
			$('.season-wnd').find('.reward-wrapper').append($wrapper);
		}
		setSeasonScroll(v.rewards.length);
	}

	function setSeasonScroll (length) {
		var $season = $('.season-wnd');
		$season.find('active').removeClass('active');
		if (length <= 6) return;
		$season.find('.winners-background').addClass('active');
		$season.find('.winners-wrapper').addClass('active');
		$season.find('.season-winners-header').addClass('active');
		$season.find('.reward-wrapper').addClass('active');
	}

	function updateDialogHome () {
		showMatchDialog();
		//$dialog.header.html(_t("pvp", null, "matchmaking"));
		var $buttons = $("<div>").addClass("MM-button-bar").appendTo($dialog.body);
		var statsButton = createBigButton("stat").appendTo($buttons);
		var fightButton = createBigButton("fight").appendTo($buttons);
		var rankButton = createBigButton("rank").appendTo($buttons);

		var $matches = $(
			'<div class="completed-matches">' +
			'		<div class="MM-info-icon info-icon"></div>' +
			'		<div class="text"></div>' +
			'</div>'
		);

		var $warning = $(
			'<div class="warning-points">' +
			'   <div class="text"></div>' +
			'   <div class="MM-info-icon info-icon"></div>' +
			'</div>'
		);
		$matches.attr('tip', _t('matches_point_desc'));
		$warning.attr('tip', _t('warning_point_desc'));

		$warning.appendTo($dialog.body);

		fightButton.append($matches);

		//var $checkbox = $("<div>").addClass("my-checkbox").html(_t('dont_show', null, 'matchmaking-tutorial'));
		//var $checkboxWrapper = $("<div>").addClass("my-checkbox-wrapper").appendTo($dialog.body);//.appendTo($wnd);
		//$checkboxWrapper.append($checkbox);


		//$checkboxWrapper.click(function () {
		//	var $ch = $(this).find('.my-checkbox');
		//	$ch.toggleClass('active');
		//	var active = $ch.hasClass('active');
		//	margoStorage.set('MM_Tutorial/status', active);
		//});

		statsButton.click(function () {
			$activeButtonMenu = '.on-progress';
			openProgress();
			//openStatistics();
		});
		fightButton.click(toggleQueue);
		rankButton.click(function () {
			$activeButtonMenu = '.on-global';
			openGeneralRanking();
		});

		if (yourPosition) {
			var $takeReward = $(drawButton(_t("take_reward", null, "matchmaking"), "")).addClass('take-reward');
			$dialog.body.append($takeReward);
			$takeReward.click(function () {
				updateDialogSeasonPosition();
			});
		}
		var inQueue = (currentState == 1 ? true : false);
		fightButton.toggleClass("MM-queue-button", inQueue);
		fightButton.toggleClass("MM-fight-button", !inQueue);
		if (inQueue) {
			var $average = $("<div>").addClass("MM-dialog-average").appendTo($dialog.body);
			addTimer();
			queueState.tipFunc = queueTipTime;
			queueState.avgTimeFunc = function (sec) {
				queueTipTimeAvg($average, sec);
			};
			if (queueState.avgTime != null) {
				queueState.avgTimeFunc(queueState.avgTime);
			}
			queueLoop();
		}
		_g('match&a=main');
		if(g.matchmaking.isBlockedShowMatchmakingMenu()) {
			removeDialog();
			return false;
		}
		$("#MM-window").absCenter();
		//g.matchmakingTutorial.initTutorialStateInMMWnd();
		//var old = g.matchmaking.getOldSeasonData();
		//if (old == null) g.matchmakingTutorial.setTutorialById(0);
	}

	function statisticsButtons () {
		var progressButton = $(drawButton("Profil",''));
		var statButton = $(drawButton(_t("yourstatistics", null, "matchmaking"), ""));
		var historyButton = $(drawButton(_t("battlehistory", null, "matchmaking"), ""));
		var seasonButton = $(drawButton(_t("season", null, "matchmaking"), ""));

		progressButton.click(function () {
			$activeButtonMenu = '.on-progress';
			openProgress();
		}).addClass("on-progress MM-tab-button MM-tab-button-menu");
		statButton.click(function () {
			$activeButtonMenu = '.on-statistics';
			openStatistics();
		}).addClass("on-statistics MM-tab-button MM-tab-button-menu");
		historyButton.click(function () {
			$activeButtonMenu = '.on-history';
			openHistory();
		}).addClass("on-history MM-tab-button MM-tab-button-menu");
		seasonButton.click(function () {
			$activeButtonMenu = '.on-season';
			openSeason();
		}).addClass("on-season MM-tab-button MM-tab-button-menu");
		progressButton.appendTo($dialog.body);
		statButton.appendTo($dialog.body);
		historyButton.appendTo($dialog.body);
		seasonButton.appendTo($dialog.body);
		setAcitveButton();
	}

	function setAcitveButton () {
		if (!$activeButtonMenu) return;
		$dialog.body.find('.MM-ranking-buttons').removeClass('active');
		$dialog.body.find($activeButtonMenu).addClass('active');
	}

	function rankingsButtons () {
		var generalButton = $(drawButton(_t("general", null, "matchmaking"), ''));
		var clanButton = $(drawButton(_t("clan", null, "matchmaking"), ""));
		var friendButton = $(drawButton(_t("friends", null, "matchmaking"), ""));


		generalButton.click(function () {
			$activeButtonMenu = '.on-global';
			openGeneralRanking();
		}).addClass("on-global MM-tab-button MM-tab-button-menu MM-ranking-buttons");
		clanButton.click(function () {
			if (!isset(hero.clan)) {
				$activeButtonMenu = '.on-clan';
				//updateDialogGeneralRanking({data:'', kind:'clan'});
				showMatchDialog();
				rankingsButtons();
				$("<div>").html(_t('clan_not_exist')).addClass("info-text").appendTo($dialog.body);
				footerDialog();
				return;
			}
			$activeButtonMenu = '.on-clan';
			openClanRanking();
		}).addClass("on-clan MM-tab-button MM-tab-button-menu MM-ranking-buttons");
		friendButton.click(function () {
			$activeButtonMenu = '.on-friends';
			openFriendsRanking();
		}).addClass("on-friends MM-tab-button MM-tab-button-menu MM-ranking-buttons");
		generalButton.appendTo($dialog.body);
		clanButton.appendTo($dialog.body);
		friendButton.appendTo($dialog.body);
		setAcitveButton();
	}

	function infoIcon () {
		var el = $("<div>").addClass("MM-info-icon-cont");
		$("<div>").addClass("MM-info-icon").appendTo(el);
		return el;
	}

	function activeIcon () {
		var el = $("<div>").addClass("MM-active-icon-cont");
		$("<div>").addClass("MM-active-icon").appendTo(el);
		return el;
	}

	function statisticsHeader (first) {
		statisticsButtons();
		var table = $("<table>").addClass("MM-table MM-table-statistics");
		var h_dane = $("<span>").text(first);
		var h_pr = $("<span>").text(_t("pr %val", {
			"%val%": ""
		}, "matchmaking"));
		var h_pw = $("<span>").text(_t("pw %val", {
			"%val%": ""
		}, "matchmaking"));
		var h_stat = $("<span>").text(_t("wins_losse_draws", null, "matchmaking"));
		var header_row = drawRow([h_dane, h_pr, h_pw, h_stat]);
		var pr_tip = _t("pr_tip", null, "matchmaking");
		h_pr.parent().attr("tip", pr_tip);
		var pw_tip = _t("pw_tip", null, "matchmaking");
		h_pw.parent().attr("tip", pw_tip);
		var stat_tip = _t("wpr_tip", null, "matchmaking");
		h_stat.parent().attr("tip", stat_tip);
		infoIcon().prependTo(h_pr.parent());
		infoIcon().prependTo(h_pw.parent());
		infoIcon().prependTo(h_stat.parent());
		$("<div>").addClass("MM-table-container").append(table).appendTo($dialog.body);
		header_row.addClass("MM-table-header");
		header_row.appendTo(table);
		return {
			table: table,
			dane: h_dane,
			pr: h_pr,
			pw: h_pw,
			stat: h_stat
		};
	}

	function statisticsHeader2 (first) {
		statisticsButtons();
		var table = $("<table>").addClass("MM-table MM-table-statistics");
		var h_dane = $("<span>").text(first);
		var h_place = $("<span>").text('M');
		var h_pr = $("<span>").text(_t("pr %val", {
			"%val%": ""
		}, "matchmaking"));
		var h_pw = $("<span>").text(_t("pw %val", {
			"%val%": ""
		}, "matchmaking"));
		var h_stat = $("<span>").text(_t("wins_losse_draws", null, "matchmaking"));
		var header_row = drawRow([h_dane, h_place, h_pr, h_pw, h_stat]);

		var place_tip = _t("ranking_place", null, "matchmaking");
		h_place.parent().attr("tip", place_tip);

		var pr_tip = _t("pr_tip", null, "matchmaking");
		h_pr.parent().attr("tip", pr_tip);

		var pw_tip = _t("pw_tip", null, "matchmaking");
		h_pw.parent().attr("tip", pw_tip);

		var stat_tip = _t("wpr_tip", null, "matchmaking");
		h_stat.parent().attr("tip", stat_tip);

		infoIcon().prependTo(h_place.parent());
		infoIcon().prependTo(h_pr.parent());
		infoIcon().prependTo(h_pw.parent());
		infoIcon().prependTo(h_stat.parent());

		$("<div>").addClass("MM-table-container").append(table).appendTo($dialog.body);
		header_row.addClass("MM-table-header");
		header_row.appendTo(table);
		return {
			table: table,
			dane: h_dane,
			place: h_place,
			pr: h_pr,
			pw: h_pw,
			stat: h_stat
		};
	}

	function footerDialog (refresh = false, kind) {
		var str = _t("back", null, "matchmaking");
		var html = drawButton(str, "");
		$(html).addClass("MM-back-button").click(updateDialogHome).appendTo($dialog.body);

		if (refresh) {
			var str = _t("refresh", null, "buttons");
			var html = drawButton(str, "");
			$(html).addClass("MM-refresh-button").click(() => _g(`match&a=ladder_${kind}&page=1`)).appendTo($dialog.body);
		}

		$("#MM-window").absCenter();
	}

	function bindDetailedStats(el, id) {
		el.click(function () {
			openStatistics(id);
		});
	}

	function updateDialogStatistics (data) {
		showMatchDialog();
		var header = statisticsHeader2(_t("chardata", null, "matchmaking"));
		var chars = 0;
		var sumPW = 0;
		var sumWins = 0;
		var sumLoss = 0;
		var sumDraw = 0;
		for (var t in data) {
			var id = data[t].playerId;
			var c_place = $("<div>").addClass("MM-statistics-dane-place");
			var c_dane = $("<div>").addClass("MM-statistics-dane");
			var c_pr = $("<span>").addClass("MM-statistics-value");
			var c_pw = $("<span>").addClass("MM-statistics-value");
			var c_stat = $("<span>").addClass("MM-statistics-value");
			var icon = $("<div>").addClass("MM-statistics-icon");
			var nick = $("<span>").addClass("MM-statistics-value MM-statistics-nick");
			var lvllabel = $("<span>").addClass("MM-statistics-lvl");
			var row;
			createImgStyle(icon, CFG.opath + data[t].icon, {'height': '22px'}, {'background-size': '400% 800%'});
			icon.appendTo(c_dane);
			if (id == hero.id) {
				activeIcon().appendTo(c_dane);
			}
			nick.text(t).appendTo(c_dane);

			let charaData = {
				level           : data[t].lvl,
				operationLevel  : data[t].oplvl,
				prof            : data[t].prof,
			}


			let characterInfo = getCharacterInfo(charaData);


			lvllabel.html(characterInfo).appendTo(c_dane);
			c_place.text(data[t].ladder_pos);
			c_pr.text(data[t].rating);
			c_pw.text(data[t].wins_ratio + "%");
			c_stat.text(data[t].wins + "/" + data[t].losses + "/" + data[t].draws);
			if (data[t].status != 0) {
				sumPW += data[t].wins_ratio;
				sumWins += data[t].wins;
				sumLoss += data[t].losses;
				sumDraw += data[t].draws;
				chars++;
			}

			var txt = _t('in_classification %val%', {'%val%':data[t].placement_cur + '/' + data[t].placement_max}, 'matchmaking');

			if (data[t].status != 0) row = drawRow([c_dane, c_place, c_pr, c_pw, c_stat]);
			else {
				row = drawRow([c_dane, txt]);
				row.children().last().attr('colspan', 4);
			}

			row.addClass("MM-statistics-row");
			bindDetailedStats(row, id);
			row.appendTo(header.table);

      const $nick = row.find('.MM-statistics-nick');
      setTipWhenNameToLong($nick, $nick.text());
		}
		var avgVal = chars == 0 ? 0 : Math.round(sumPW / chars * 100) / 100;
		header.pw.append($("<div>").addClass("MM-statistics-value").text(avgVal + "%"));
		header.stat.append($("<div>").addClass("MM-statistics-value").text(sumWins + "/" + sumLoss + "/" + sumDraw));
		$("<div>").addClass("MM-statistics-info").html(_t("statisticsinfo_tip", null, "matchmaking")).appendTo($dialog.body);
		footerDialog();
		//g.matchmakingTutorial.setTutorialById(2)
	}

	function updateDialogStatisticsDetailed (data) {
		showMatchDialog();
		var header = statisticsHeader(_t("classopponents", null, "matchmaking"));
		header.table.addClass("MM-table-statistics-detailed");
		header.pw.append($("<div>").addClass("MM-statistics-value").text(data["all"].wins_ratio + "%"));
		header.stat.append($("<div>").addClass("MM-statistics-value").text(data["all"].wins + "/" + data["all"].losses + "/" + data["all"].draws));
		for (var t in data) {
			if (t == "all")
				continue;
			var c_dane = $("<span>").addClass("MM-statistics-value");
			var c_pr = $("<span>").addClass("MM-statistics-value");
			var c_pw = $("<span>").addClass("MM-statistics-value");
			var c_stat = $("<span>").addClass("MM-statistics-value");
			var icon = $("<div>").addClass("MM-statistics-icon");
			var nick = $("<span>").addClass("MM-statistics-value")
			var lvllabel = $("<span>").addClass("MM-statistics-lvl");

			c_dane.text(_t(profSymbolToText(t), null, "eq_prof"));
			c_pr.text(mp(data[t].rating));
			c_pw.text(data[t].wins_ratio + "%");
			c_stat.text(data[t].wins + "/" + data[t].losses + "/" + data[t].draws);
			var row = drawRow([c_dane, c_pr, c_pw, c_stat]);
			row.appendTo(header.table);
		}
		//footerDialog();
		var str = _t("back", null, "matchmaking");
		var html = drawButton(str, "");
		$(html).addClass("MM-back-button").click(function () {
			openStatistics();
		}).appendTo($dialog.body);
		$("#MM-window").absCenter();
		//g.matchmakingTutorial.setTutorialById(2);
	}

	function updateDialogHistory (data) {
		showMatchDialog();
		statisticsButtons();
		var table = $("<table>").addClass("MM-table MM-table-history");
		var h_result = $("<span>").text(_t("result", null, "matchmaking"));
		var h_opp = $("<span>").text(_t("opponentData", null, "matchmaking"));
		var h_pr = $("<span>").text(_t("pr %val", {
			"%val%": ""
		}, "matchmaking"));
		var h_length = $("<span>").text(_t("fight-length", null, "matchmaking"));
		var h_time = $("<span>").text(_t("time", null, "matchmaking"));
		var h_date = $("<span>").text(_t("date", null, "matchmaking"));
		var header_row = drawRow([h_result, h_opp, h_pr, h_length, h_time, h_date]);
		var pr_tip = _t("pr_tip", null, "matchmaking");
		h_pr.parent().attr("tip", pr_tip);
		infoIcon().prependTo(h_pr.parent());
		var last_date = null;
		var last_date_counter = 0;
		var last_date_$ = null;
		header_row.addClass("MM-table-header");
		header_row.appendTo(table);
		for (var t in data.positions) {
			var obj = data.positions[t];
			var c_result = $("<span>");
			var c_opp = $("<div>");
			var c_pr = $("<span>");
			var c_length = $("<span>");
			var c_time = $("<span>");
			var date = getDateFromTimestamp(obj.start_ts);
			var row_tab = [c_result, c_opp, c_pr, c_length, c_time];
			var take_last_$ = false;
			if (date != last_date) {
				var c_date = $("<span>");
				c_date.text(date);
				last_date = date;
				row_tab.push(c_date);
				last_date_counter = 1;
				take_last_$ = true;
			} else if (last_date_$ != null && last_date_counter > 0) {
				last_date_counter++;
				last_date_$.attr("rowspan", last_date_counter);
			}
			var result_name = resultSymbolToText(obj.result);
			c_result.text(_t(result_name, null, "matchmaking"));
			c_result.addClass("MM-hi-" + result_name);
			//var opp_str = _t("prof-lvl %prof %lvl", {
			//	"%prof%": _t(profSymbolToText(obj.opponent_prof), null, "eq_prof"),
			//	"%lvl%": obj.opponent_lvl
			//}, "matchmaking");

			let characterData = {
        showNick 		    : true,
				level			      : obj.opponent_lvl,
				operationLevel	: obj.opponent_oplvl,
				nick 			      : obj.opponent_nick,
				prof 			      : obj.opponent_prof,
        htmlElement		  : true
			}

			var opp_str = getCharacterInfo(characterData)

			c_opp.html(opp_str);
			c_pr.text(mp(obj.rating_delta));
			c_length.text(getDiffMinutesFromTimestamps(obj.end_ts, obj.start_ts));
			c_time.text(ut_time_ns(obj.start_ts));
			var row = drawRow(row_tab);
			if (take_last_$)
				last_date_$ = row.find("td").eq(5);
			row.appendTo(table);
		}
		$("<div>").addClass("MM-table-container").append(table).appendTo($dialog.body);
    const $nicks = table.find('.character-info-nick');
    $nicks.each((index, nick) => {
      setTipWhenNameToLong($(nick), $(nick).text());
    });
		addPaginator("MM-history-page", data.cur_page, data.max_page, openHistory);
		footerDialog();
		//g.matchmakingTutorial.setTutorialById(3)
	}

	function createSet (id, set, array, onset) {
		var $el = createBigButton("eq", "eq-" + id);
		var container = $("<div>").addClass("MM-eq-container");
		container.appendTo($el);
		var skill = $("<div>").addClass("MM-um-set");
		skill.appendTo(container);
		var skillSet = set.skill_set;
		skill.addClass("MM-um-set-" + skillSet);
		var items = set.items;
		for (var st = 0; st < 8; st++) {
			createItem(items[st], st + 1, container);
		}
		$el.click(function () {
			_g('match&a=battleset&ans=' + id);
		});
		return $el;
	}

	function updateDialogWaiting () {
		showMatchDialog();
		hideCloseDialog();
		//showOverlay();
		//$dialog.header.html(_t("pvp", null, "matchmaking"));
		var $table = $("<div>").appendTo($dialog.body);
		$table.addClass("MM-wating-container");
		var str = _t("waiting_msg", null, "matchmaking");
		var $text = $("<div>").text(str).appendTo($table);
		$text.addClass("MM-wating-txt");

		function animate () {
			$text.animate({
				opacity: 1
			}, 400).delay(300).animate({
				opacity: 0.2
			}, 300, function () {
				animate();
			});
		}
		animate();
	}

	function updateDialogPrepartion (data) {
		showMatchDialog();
		hideCloseDialog();
		//showOverlay();
		//$dialog.header.html(_t("pvp", null, "matchmaking"));
		//var selected = data.selected_battle_set - 1;
		//var id = 1;
		//var arraySet = [];
        //
		//for (var t in data.battle_sets) {
		//	var set = data.battle_sets[t];
		//	var $set = createSet(id, set, arraySet);
		//	id++;
		//	arraySet.push($set);
		//	$dialog.body.append($set);
		//}
		//arraySet[selected].addClass("selected");
		setEqPanelOpen(true);
		getEngine().buildsManager.getBuildsWindow().closePanel();
		createBuilds();

		queueState.endTime = unix_time() + data.time_left;
		addTimer();
		acceptLoop();
		var $versus = $("<div>").addClass("MM-versus").appendTo($dialog.body);
		var youIcon = $("<div>").addClass("MM-prepare-icon MM-prepare-icon-you");
		createImgStyle(youIcon, hero.icon);
		// youIcon.css("background-image", 'url("' + hero.icon + '")');
		youIcon.appendTo($versus);
		var youInfo = $("<div>").addClass("MM-prepare-info MM-prepare-info-you");



		let characterData = {
			level:getHeroLevel(),
			operationLevel: hero.getOperationLevel(),
			prof: hero.getProf(),
			nick : _t("you", null, "matchmaking"),
			showNick: true

		};
		let characterInfo = getCharacterInfo(characterData);


		var youInfoTxt = _t("prepare-info", {
			"%prof%": characterInfo,
			"%lvl%": '',
			"%pr%": data.rating
		}, "matchmaking");
		youInfo.html(youInfoTxt);
		youInfo.appendTo($versus);
		var oppIcon = $("<div>").addClass(`MM-prepare-icon MM-prepare-icon-opp hidden-prof hidden-prof--${data.opponent_prof}`);
		oppIcon.appendTo($versus);
		var oppInfo = $("<div>").addClass("MM-prepare-info MM-prepare-info-opp");
		var oppInfoTxt = $("<div>").addClass("MM-statistics-value");
		oppInfoTxt.html(_t('opponent', null, 'matchmaking') + '<br>' + _t(profSymbolToText(data.opponent_prof), null, "eq_prof"));
		oppInfo.html(oppInfoTxt);
		oppInfo.appendTo($versus);
		var vs_txt = $("<div>").addClass("MM-big-button-header MM-vs-header");
		vs_txt.appendTo($versus);
		var fightButton = $(drawButton(_t("fight2", null, "matchmaking"), ""));
		fightButton.click(openFight).addClass("MM-go-fight-button");
		fightButton.appendTo($versus);
		$("#MM-window").absCenter();
		if (currentState == 4) {
			$('#MM-window').find('.MM-go-fight-button').addClass('disable');
			$('#MM-window').find('.MM-eq-button').each(function () {
				if ($(this).hasClass('selected')) $(this).addClass('chosen-tile');
				else $(this).addClass('disabled-tile');
			});
			var $blinkLabel = $('<div>').addClass('blink-wait-label');
			$blinkLabel.html(_t('wait-for-label', null, 'matchmaking'));
			$blinkLabel.appendTo($dialog.body);
		}
	}

	const createBuilds = () => {
		let buildsWindow 				= getEngine().buildsManager.getBuildsWindow();
		let buildsManagerBuildsCommons 	= getEngine().buildsManager.getBuildsCommons();
		let data 						= buildsManagerBuildsCommons.getCrazyDataToMatchmaking();
		let currentId 					= buildsWindow.getCurrentId();
		//let $wrapper 					= self.wnd.$.find('.choose-eq').find('.builds-wrapper').find('.scroll-pane').empty();
		//let $wrapper 					= $dialog.body.empty();
		let $wrapper 					= $('<div>').addClass('builds-scroll-wrapper');

		buildsCommons.clearBuilds();

		for (let id in data) {
			let oneBuild 	= new OneBuild();
			let oneData 	= data[id];

			buildsCommons.addOneBuildToBuildList(id, oneBuild);

			oneBuild.init(oneData);
			oneBuild.update(oneData);
			$wrapper.append(oneBuild.get$build());
		}

		$dialog.body.append($wrapper);

		buildsCommons.initItemsFetch();

		this.setActiveBuild(currentId);
	};

	function updateDialogGeneralRanking (obj) {
		var data = obj.data;
		var kind = obj.kind;
		var f;
		showMatchDialog();
		//$dialog.header.html(_t("pvp", null, "matchmaking"));
		rankingsButtons();

		if (kind == 'friends' && lengthObject(data.positions) == 0) {
			$("<div>").html(_t('friend_not_exist')).addClass("info-text").appendTo($dialog.body);
			footerDialog();
			return;
		}

		var table = $("<table>").addClass("MM-table MM-table-ladder");
		var h_lp = $("<span>").text(_t("lp", null, "matchmaking"));
		var h_nick = $("<span>").text(_t("playernick", null, "matchmaking"));
		//var h_plvl = $("<span>").text(_t("profandlevel", null, "matchmaking"));
		var h_plvl = $("<span>").text(_t("playerData", null, "matchmaking"));
		var h_pr = $("<span>").text(_t("pr %val", {
			"%val%": ""
		}, "matchmaking"));
		var h_wr = $("<span>").text(_t("pw %val", {
			"%val%": ""
		}, "matchmaking"));
		var h_wld = $("<span>").text(_t("wins_losse_draws", null, "matchmaking"));
		var header_row = drawRow([h_lp, h_nick, h_plvl, h_pr, h_wr, h_wld]);
		var pr_tip = _t("pr_tip", null, "matchmaking");
		h_pr.parent().attr("tip", pr_tip);
		var pw_tip = _t("pw_tip", null, "matchmaking");
		h_wr.parent().attr("tip", pw_tip);
		var stat_tip = _t("wpr_tip", null, "matchmaking");
		h_wld.parent().attr("tip", stat_tip);
		infoIcon().prependTo(h_pr.parent());
		infoIcon().prependTo(h_wr.parent());
		infoIcon().prependTo(h_wld.parent());
		header_row.addClass("MM-table-header");
		header_row.appendTo(table);
		for (var t in data.positions) {
			var obj = data.positions[t];
			var c_lp = $("<span>").text(obj.position + ".");
			var c_nick = $("<div>").text(obj.nick);
			//var prof = obj.prof == ' ' ? '' : _t(profSymbolToText(obj.prof), null, "eq_prof");
			if (obj.nick == hero.nick) {
				c_nick.addClass("MM-your-nick")
			}
			c_nick.attr("tip", obj.nick);
			//var plvl_str = _t("prof-lvl %prof %lvl", {
			//	"%prof%": prof,
			//	"%lvl%": obj.lvl
			//}, "matchmaking");


			let characterData = {
				level			: obj.lvl,
				operationLevel	: obj.oplvl,
				prof 			: obj.prof
			}

			let plvl_str = getCharacterInfo(characterData);

			var c_plvl = $("<span>").text(plvl_str);
			var c_pr = $("<span>").text(obj.rating);
			var c_wr = $("<span>").text(obj.wins_ratio + "%");
			var c_wld = $("<span>").text(obj.wins + "/" + obj.losses + "/" + obj.draws);
			var row = drawRow([c_lp, c_nick, c_plvl, c_pr, c_wr, c_wld]);
			addOutfitTip(row, obj.ikona);
			row.appendTo(table);
		}
		$("<div>").addClass("MM-tab").appendTo($dialog.body);
		$("<div>").addClass("MM-table-container").append(table).appendTo($dialog.body);

		switch (kind) {
			case 'global':
				f = openGeneralRanking;
				//g.matchmakingTutorial.setTutorialById(5);
				break;
			case 'clan':
				f = openClanRanking;
				//g.matchmakingTutorial.setTutorialById(6);
				break;
			case 'friends':
				f = openFriendsRanking;
				//g.matchmakingTutorial.setTutorialById(7);
				break;
		}

		addPaginator("MM-ranking-page", data.cur_page, data.max_page, f);
		footerDialog(true, kind);
	}

	function addOutfitTip ($rec, ikona) {
		var p = CFG.opath + ikona;
		$rec.addClass('MM-statistics-row');
		//var $img = $('<div>').css('background-image', 'url("' + p + '");');
		var $img = '<div class="outfit-tip" style=background-image:url("' + p + '")></div>';
		$rec.addClass('hover-tr');
		//c_nick.attr("tip", obj.nick);
		$rec.attr('tip', $img);
	}

	function addQueueIcon () {
		var el = $("<div>").attr("id", "MM-in-queue-icon");
		queueState.onUpdate = function (txt, txt2) {
			var str = _t("time_in_queue %val", {
				"%val%": txt
			}, "matchmaking");
			str += "<br>";
			str += _t("average_wait_time %val", {
				"%val%": "<br>" + txt2
			}, "matchmaking");
			el.attr("tip", str);
		};
		el.appendTo("#centerbox");
		queueLoop();
	}

	const setEqPanelOpen = (state) => {
		eqPanelOpen= state;
	}

	this.changeState = function (val) {
		var initState = false;
		if (currentState != val) {
			initState = true;
		}
		currentState = val;

		switch (currentState) {
			case 4 :
				setEqPanelOpen(true);
				break;
			default :
				setEqPanelOpen(false);
		}


		if (initState) {
			if(currentState > 1) {
				hideAlls();
			}
			hideAlert();
			hideOverlay();
			releaseLoop();
			queueState.onUpdate = null;
			$("#MM-in-queue-icon").remove();
		}
		switch (val) {
		case 0:
			if (initState && $dialog.body != null) {
				updateDialogHome();
			}
			hideOverlay();
			showAlls();
			break;
		case 1:
			if (initState) {
				hideOverlay();
				addQueueIcon();
				queueState.avgTime = null;
				if ($dialog.body != null) {
					updateDialogHome();
				}
				if (timer == null) {
					timer = setInterval(queueLoop, 1000);
				}
			}
			break;
		case 2:
			if (initState) {
				removeDialog();
				acceptAlert();
				if (timer == null) {
					timer = setInterval(acceptLoop, 1000);
				}
			}
			break;
		case 3:
			if (initState) {
				removeDialog();
				if (timer == null) {
					timer = setInterval(acceptLoop, 1000);
				}
			}
			break;
		case 4:
			if (initState) {
				//hideAlert();
				//updateDialogWaiting();
				removeDialog();
				if (timer == null) {
					timer = setInterval(acceptLoop, 1000);
				}
			}
			break;
		case 5:
			if (initState) {
				removeDialog();
			}
			break;
		}
	};

	this.changeSearch = function (obj) {
		queueState.startTime = unix_time() - obj.since;
		queueState.avgTime = obj.avg_duration;
		if (queueState.avgTimeFunc != null) {
			queueState.avgTimeFunc(queueState.avgTime);
		}
		queueLoop();
	};

	this.onConfirmation = function (obj) {
		queueState.endTime = unix_time() + obj.time_left;
		acceptLoop();
		if (obj.accept == 1) {
			hideAlert();
			hideOverlay();
			updateDialogWaiting();
		}
	};

	this.onProgress = function (obj) {
		if(g.init >= 5) {
			updateDialogProgress(obj);
		} else {
			g.loadQueue.push({
				fun: updateDialogProgress,
				data: obj
			});
		}
	};

	this.onMatchmakingSeasonPosition = function (v) {
		if (g.init >= 5) {
			updateDialogSeasonPosition(v);
		} else {
			g.loadQueue.push({
				fun: updateDialogSeasonPosition,
				data: v
			});
		}
	};

	this.onSeason = function (obj) {
		if(g.init >= 5) {
			updateDialogSeason(obj);
		} else {
			g.loadQueue.push({
				fun: updateDialogSeason,
				data: obj
			});
		}
	};

	this.onPreparation = function (obj) {
		if(g.init >= 5) {
			updateDialogPrepartion(obj);
		} else {
			g.loadQueue.push({
				fun: updateDialogPrepartion,
				data: obj
			});
		}
	};

	this.onStatistics = function (obj) {
		if(g.init >= 5) {
			updateDialogStatistics(obj);
		} else {
			g.loadQueue.push({
				fun: updateDialogPrepartion,
				data: obj
			});
		}
	};

	this.onStatisticsDetailed = function (obj) {
		if(g.init >= 5) {
			updateDialogStatisticsDetailed(obj);
		} else {
			g.loadQueue.push({
				fun: updateDialogStatisticsDetailed,
				data: obj
			});
		}
	};

	this.onMain = function (v) {
		warningPoints(v.warnings_cur, v.warnings_max);
		matchesPoints(v.matches_cur, v.matches_min);
	};

	function warningPoints (cur, min) {
		$('#MM-window').find('.warning-points').find('.text').html( _t('warning_points') + ': ' + cur + '/' + min);
	}

	function matchesPoints (cur, min) {
		var val = cur >= min ? min : cur;
		$('#MM-window').find('.completed-matches').find('.text').html(val + '/' + min);
		$('#MM-window').find('.completed-matches').css('display', min == 0 ? 'none' : 'block');
	}

	this.onHistory = function (obj) {
		if(g.init >= 5) {
			updateDialogHistory(obj);
		} else {
			g.loadQueue.push({
				fun: updateDialogHistory,
				data: obj
			});
		}
	};

	this.onGeneralRanking = function (obj, kind) {
		if(g.init >= 5) {
			updateDialogGeneralRanking({data:obj, kind: kind});
		} else {
			g.loadQueue.push({
				fun: updateDialogGeneralRanking,
				data: {obj:obj, kind: kind}
			});
		}
	};

	this.onClanRanking = function (obj) {
		if(g.init >= 5) {
			updateDialogClanRanking(obj);
		} else {
			g.loadQueue.push({
				fun: updateDialogClanRanking,
				data: obj
			});
		}
	};

	this.onFriendsRanking = function (obj) {
		if(g.init >= 5) {
			updateDialogFriendsRanking(obj);
		} else {
			g.loadQueue.push({
				fun: updateDialogFriendsRanking,
				data: obj
			});
		}
	};

	this.isBlockedShowMatchmakingMenu = function() {
		return g.trade.id != 0;
	};

	this.canToggleMatchmaking = function () {
		return !($('#MM-window').find('.MM-versus').length > 0 || $('#MM-window').find('.MM-wating-container').length > 0);
	};

	this.show = function () {
		if (this.canToggleMatchmaking()) {
			showMatchDialog();
			updateDialogHome();
		}
	};

	this.toggleDetailsWnd = function () {
		var $e = $('#match-details-wnd');
		var show = $e.css('display') == 'block';
		$e.css('display', show ? 'none' : 'block');
	}

	this.getprogressBarTpl = function () {
		return createMatchmakingProgressStageHtml();
	};

	this.setActiveBuild = (id) => {
		//var $wrapper = self.wnd.$.find('.choose-eq');
		var $wrapper = $dialog.body.find(".builds-scroll-wrapper");
		$wrapper.find('.one-build').removeClass('active');
		$wrapper.find('.one-build').eq(parseInt(id) - 1).addClass('active');
	}

	this.getEqPanelOpen = () => {
		return eqPanelOpen;
	};

	this.getBuildsCommons = () => {
		return buildsCommons;
	}

	const getAllRewards = () => {
		_g('match&a=collect');
	}

	const getAllBtnSetState = () => {
		const getAllBtn = $dialog.body.find('.progress-bottom-panel .get-all .MM-button');
		!rewardsToGet ? getAllBtn.addClass('disabled') : getAllBtn.removeClass('disabled');
	}

	initBuildsCommons();

	return this;
}

function BattleSets () {
	var self = this;
	var sets = [];

	function createButton (id) {
		var el = $("<div>");
		el.addClass("MM-battleset-switch-button MM-battleset-switch-button-" + id);
		//el.text(id);
		el.click(function () {
			self.change(id)
		});
		return el;
	}

	function start () {
		var holder = $("<div>").appendTo("#panel");
		holder.addClass("MM-battleset-switch");
		sets.push(createButton(1).appendTo(holder));
		sets.push(createButton(2).appendTo(holder));
		sets.push(createButton(3).appendTo(holder));
	}

	this.change = function (id) {
		_g('moveitem&set=' + id, function () {
			if ($('#skills').is(':visible')) {
				g.skills.show();
			}
		});
	};

	this.update = function (id) {
		for (var t in sets) {
			sets[t].removeClass("MM-battleset-switch-button-selected");
		}
		sets[id - 1].addClass("MM-battleset-switch-button-selected");
	};
	start();
	return this;
}
