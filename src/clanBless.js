function clanBless (Par) {
	var content;
	var blessLvl;
	var self = this;
	var firstFetch = true;

	this.init = function () {

	};

	this.update = function (v) {
		this.initContent();
		this.initTexts();
		//this.initBackBtn();
		this.setBlessLevel(v);
		if (firstFetch) firstFetch = false;
		else g.tplsManager.removeCallback('b', self.newBlessItem);
		this.initFetch();
		//this.clearDisabled();
		this.updateScroll();
	};

	this.clearDisabled = function () {
		content.find('.scroll-pane').find('.disabled').removeClass('disabled');
	};

	this.setBlessLevel = function (v) {
		blessLvl = v.bless_max;
	};

	this.getOneBlessSkillHtml = function () {
		return $('<div class="one-bless-skill">' +
			'<div class="item-wrapper"></div>' +
			'<div class="info-wrapper">' +
			'<div class="bless-name"></div>' +
			'<div class="bless-description"></div>' +
			'</div>' +
			'<div class="bless-use">'+
				'<div class="bless-duration"></div>' +
			'</div>' +
			'</div>'
		);
	};

	this.newBlessItem = function (item) {
		var $wrapper = content.find('.scroll-pane');
		var lvl = $wrapper.children().length;
		var id = item['id'];

		if ($wrapper.find('.bless-' + id).length > 0) {
			lvl = $wrapper.find('.bless-' + id).index();
			if (lvl + 1 > blessLvl) self.setDisabled($wrapper.find('.bless-' + id));
			return;
		}

		var $oneBless = self.getOneBlessSkillHtml();
		$oneBless.addClass('bless-' +  id);

		var name = item['name'];
		var stats = parseItemStat(item.stat);
		var description = stats['opis'];
		var duration = stats['ttl'];
		var price = item['pr'];
		var $btn = self.useBlessBtn(lvl, price);
		//var str = Par.tLang('use_cost');
		var $clone = self.createCloneItem(item.$);

		$oneBless.find('.item-wrapper').append($clone);
		$oneBless.find('.bless-name').html(name);
		$oneBless.find('.bless-description').html(parseClanBB(description));
		$oneBless.find('.bless-duration').html(_t('battleTime', null, 'matchmaking') + ' ' + duration + 'min');
		$oneBless.find('.bless-use').prepend($btn);

		if (lvl + 1 > blessLvl) self.setDisabled($oneBless);
		$wrapper.append($oneBless);
	};

	this.createCloneItem = function ($item) {
		var $clone = $item.clone(false);
		var str = $clone.attr('tip');
		str = str.replace('s-7', 's-7 left');
		return $clone.attr('tip', str);
	};

	this.rebuiltDisabled = function () {
		var $allOneBless = content.find(".one-bless-skill");
		$allOneBless.removeClass('disabled');
		$allOneBless.each(function() {
			var lvl = $(this).index() + 1;
			if (lvl > blessLvl) self.setDisabled($(this));
		});
	};

	this.setDisabled = function ($oneBless) {
		$oneBless.addClass('disabled');
	};

	this.useBlessBtn = function (lvl, cost) {
		var str = _t('use_it', null, 'item');
		var $btn = drawSIButton(str + ' ' + round(cost));
		//$btn.find('.label').html(str);
		$btn.click(function () {
			//_g('clan&a=use_bless&lvl=' + (lvl + 1));
			_g('clan&a=skills_use&name=blessing&opt=' + (lvl + 1));
		});
		return $btn;
	};


	this.initFetch = function () {
		g.tplsManager.fetch('b', self.newBlessItem);
	};

	this.getClanBlessContent = function () {
		return $(
		'<div class="clan-bless-content">' +
		'<div class="bless-main-header"></div>' +
		'<div class="bless-header"></div>' +
			'<div class="scroll-wrapper">' +
			'<div class="scroll-pane"></div>' +
			'</div>' +
			//'<div class="back-to-skill-btn"></div>' +
			'</div>');
	};

	this.initContent = function () {
		content = self.getClanBlessContent();
		$('#clanbox').empty();
		$('#clanbox').append(content);
	};

	this.initBackBtn = function() {
		var str = Par.tLang('back');
		var $btn = drawSIButton(str).addClass('small green');
		$btn.find('.label').html(str);
		$btn.click(self.showSkils);
		content.find('.back-to-skill-btn').append($btn)
	};

	this.showSkils = function () {
		var str = Par.tLang('clan_skills');
		//Par.showChooseCard('clan', 'clan-skills');
		//Par.updateHeader(str);
	};

	this.updateScroll = function () {
		$('.scroll-wrapper', content).trigger('update');
	};

	this.initTexts = function () {
		content.find('.bless-header').html(Par.tLang('bless-header'));
		content.find('.bless-main-header').html(Par.tLang('clan_blesses'));
	};


	this.init();
};
