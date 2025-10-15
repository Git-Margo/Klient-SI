function clanQuests (Par) {
	var self = this;
	var content;
	var hideFinished = false;
	var allQuestsAmount;
	var completQuestAmount;

	this.update = function (v) {
		this.initContent();
		this.initToogleShowBtn();
		this.createQuests(v);
		this.updateScroll();
		this.initFetch();
		this.initQuestHeader();
	};

	this.initToogleShowBtn = function () {
		var $btn = drawSIButton('');
		content.find('.toggle-show').append($btn);
		self.hideOrShowFinished();
		$btn.click(function () {
			hideFinished = !hideFinished;
			self.hideOrShowFinished();
			self.updateScroll();
		});
	};

	this.hideOrShowFinished = function () {
		var display = hideFinished ? 'none' : 'block';
		content.find('.complete-and-unactive-quests').css('display', display);
		var $label = content.find('.toggle-show').find('.label');
		var str = Par.tLang((hideFinished ? 'show' : 'hide') + '-finish');
		$label.find('.gfont').html(str).attr('name', str);
	};

	this.createQuests = function (data) {
		var $sp = content.find('.scroll-pane');
		allQuestsAmount = 0;
		completQuestAmount = 0;
		for (var one in data) {
			this.createOneQuest(one, data[one], $sp);
			if (data[one].finished) completQuestAmount++;
			allQuestsAmount++;
		}
	};

	this.createOneQuest = function (id, data, $par) {
		var $q = self.getOneClanQuest()
		var f = data.finished;
		var active = data.active == 1 || data.task == 'bring' && !f;
		var task = data.task;

		var status = this.getQuestStatus(active, task, f);
		var kind = Par.tLang(data.task);
		var $where = active == 1 ? '.active-quests' : '.complete-and-unactive-quests';
		var div = data.done / data.todo;
		var $progresText = $('<div>').addClass('progress-text').html(kind + ' ' + data.done + ' / ' + data.todo);

		if (active == 1) $where = '.active-quests';
		else $where = f ? '.complete-quests' : '.unactive-quests';

		$q.addClass(status + ' ' + id);
		$q.find('.quest-header').html(data.title);
		$q.find('.quest-content').html(data.description);
		$q.find('.quest-progress').append($progresText);
		$q.find('.quest-state').html(Par.tLang(status)).addClass(status);
		$q.find('.quest-percent').html((Math.round(div * 100)) + '%');
		$q.find('.background-bar').css('width', (div * 442) + 'px');

		this.createAllMeasure($q.find('.clan-progress-bar'));

		if (active && isset(data.gold)) this.buyQuest(data.gold, $q);
		if (!f && task == 'bring') this.giveItem(id, data, $q);
		if (task == 'kill') {
			var str = '';
			for (var i = 0; i < data.kill_names.length; i++) {
				str += data.kill_names[i] + ', ';
			}
			var str2 = str.slice(0, str.length - 2);
			var $smallIcon = $('<div>').addClass('small-info MM-info-icon');
			$smallIcon.tip(str2)
			$q.find('.quest-progress').append($smallIcon);
		}

		$par.find($where).append($q);
	};

	this.createAllMeasure = function ($bar) {
		var $measureWrapper = $('<div>').addClass('measure-wrapper');
		for (var i = 0; i < 9; i++) {
			$measureWrapper.append($('<div>').addClass('measure'));
		}
		$bar.append($measureWrapper);
	};

	this.getQuestStatus = function (active, task, finished) {
		if (finished) return 'quest_completed';
		if (active) return 'quest_active';
		return 'quest_unactive';
	};

	this.buyQuest = function (gold, $q) {
		this.createBuyPanel($q, gold);
	};

	this.createBuyPanel = function ($parent, gold) {
		var tip = '',
			disable = false,
			canUse = self.canUse(),
			g = round(gold, 5),
			$actionPanel = $parent.find('.right-side'),
			str = Par.tLang('buy_quest') + ' ' + g;// + '<span class="small-money"></span>' + gold;

		if (!canUse) {
			tip += tip != '' ? '<br><br>' : '';
			tip += Par.tLang('clan_quests_can_use');
			disable = true;
		}

		if (Par.getProp('gold') < gold) {
			tip += tip != '' ? '<br><br>' : '';
			tip += _t('notEnoughGold');
			disable = true;
		}

		var cl = !disable ? '' : 'black';

		var $btn = drawSIButton(str).addClass(cl);
		//$btn.tip(tip);

		var $questBuyWrapper = $('<div>').addClass('quest-buy-wrapper');
		$questBuyWrapper.append($btn);
		$actionPanel.append($questBuyWrapper);
		if (disable) return;
		$btn.click(self.buyQuestAlert);
	};

	this.canUse = function () {
		var myRank = Par.getProp('myrank');
		return myRank & 1 ? 1 : 0;
	};

	this.buyQuestAlert = function () {
		var bool = self.canUse();
		if (!bool) return;
		_g('clan&a=buy_quest&ans=-1');
	};

	this.giveItem = function (id, data, $parent) {
		var bring = data.task == 'bring';
		if (!bring) return;
		this.createGiveItemPanel(id, data, $parent);
	};

	this.createGiveItemPanel = function (id, data, $parent) {
		var $questBringItemPanel = $parent.find('.quest-bring-item-wrapper');
		var $questBringItem = self.getQuestBringItem();
		$questBringItemPanel.append($questBringItem);

		var $inp = $questBringItem.find('input');
		$inp.attr('quest-clan-id', id);
		$inp.focusout(function () {
			var val = parseInt($(this).val());
			if (!val || !Number.isInteger(val) || val < 0) $(this).val('');
		});

		//var $but = tpl.get('button').addClass('small green');
		var $but = drawSIButton(Par.tLang('give_item'));
		$questBringItem.find('.give-item-btn').append($but);
		$questBringItem.find('.item-wrapper').addClass('item-id-' + data.bring_tpl);
		//$but.find('.label').html(Par.tLang('give_item'));
		$but.click(function () {
			self.giveItemAlert($inp);
		});
	};

	this.giveItemAlert = function ($input) {
		var v = $input.val();
		if (v == 0) return mAlert(_t('fill_area_how_items'));
		var nr = v > 4 ? 1 : v > 1 ? 2 : 3;
		var str =_t('give_q_item' + nr + ' %amount%', {'%amount%': v}, 'clan');
		Par.alert(str, function () {
			var id = $input.attr('quest-clan-id');
			_g('clan&a=bring&id=' + id + '&amount=' + v, function () {
				$input.val('');
			});
		});
	};

	this.updateScroll = function () {
		$('.scroll-wrapper', content).trigger('update');
	};

	this.init = function () {
		//this.initContent();
		//this.initToogleShowBtn();
		//this.initFetch();
	};

	this.initQuestHeader = function () {
		var $span = $('<div>').addClass('small-info MM-info-icon');
		$span.tip(_t('one_quest_clan_skill_point'));
		content.find('.quest-content-header').html(Par.tLang('clan_quests'));
		content.find('.complete-quest-amount').html(_t('finishClanQuests') + ' ' + completQuestAmount + '/' + allQuestsAmount);
		content.find('.complete-quest-amount').append($span);
	};

	this.initFetch = function () {
		g.tplsManager.fetch('q', self.newBringItem);
	};

	this.newBringItem = function (i) {
		content.find('.item-id-' + i.id).append(i.$);
	};

	this.initContent = function () {
		content = self.getClanQuestsContent();
		$('#clanbox').empty();
		$('#clanbox').append(content);
	};

	this.getOneClanQuest = function () {
		return $(
		'<div class="one-clan-quest">' +
			'<div class="left-side">' +
			'<div class="quest-header"></div>' +
			'<div class="quest-content"></div>' +
			'<div class="quest-bring-item-wrapper"></div>' +
			'</div>' +
			'<div class="right-side"></div>' +
			'<div class="quest-progress-wrapper">' +
			'<div class="quest-progress"></div>' +
			'<div class="clan-progress-bar">' +
			'<div class="background-bar"></div>' +
			'</div>' +
			'<div class="quest-percent"></div>' +
			'</div>' +
			'<div class="quest-state"></div>' +
			'</div>'
		);
	};

	this.getQuestBringItem = function () {
		return $(
		'<div class="quest-bring-item" class="v-align" >' +
			'<div class="item-wrapper v-item"></div>' +
			'<div class="input-wrapper v-item">' +
			'<input type="number" class="default">' +
			'</div>' +
			'<div class="give-item-btn v-item"></div>' +
			'</div>'
		);
	};

	this.getClanQuestsContent = function () {
		return $(
		'<div class="clan-quests-content">' +
		'<div class="quest-content-header"></div>' +
		'<div class="complete-quest-amount"></div>' +
		'<div class="toggle-show"></div>' +
		'<div class="scroll-wrapper">' +
			'<div class="scroll-pane">' +
			'<div class="active-quests"></div>' +
			'<div class="complete-and-unactive-quests">' +
			'<div class="unactive-quests"></div>' +
			'<div class="complete-quests"></div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
	};

	this.init();

}
