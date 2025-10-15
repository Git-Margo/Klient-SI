function clanSkills (Par) {
	var self = this;
	var content;
	this.amountPoint = 0;
	var percentSklis = [
		'expBonus',
		'healPower',
		'questExpBonus'
	];
	var minSkils = [
		'timeTickets'
	];

	this.update = function (v) {
		this.initContent();
		this.amountPoint = v.points;
		this.showOrHideResetBtn();
		//this.clearContent();
		this.createSkills(v.quest_bonuses, v.quest_bonuses_use);
		this.updateHeader();
		this.showOrHideAddBtn();
		this.updateScroll();
	};

	this.skillsWithMinutes = function (name) {
		var bool = minSkils.indexOf(name) > -1;
		if (!bool) return '';
		return ' min';
	};

	this.skillsWithPercent = function (name, data) {
		var bool = percentSklis.indexOf(name) > -1;
		var val = data.val;
		if (!bool) return val;
		return (val * 100) + '%';
	};

	this.showOrHideResetBtn = function () {
		var bool = self.canUse();
		var $btn = content.find('.clan-skill-reset>.button');
		$btn.css('display', 'none');
		if (bool) $btn.css('display', 'block');
	};

	this.createSkills = function (skills, useData) {
		var $sp = content.find('.scroll-pane');
		for (var k in skills) {
			this.createOneSkill(k, skills[k], useData, $sp);
		}
	};

	this.createOneSkill = function (name, data, useData, $par) {
		var $s = self.getClanSkill();
		var $b = this.addPointBtn($s, name, data);
		var type = data.type;
		var skillState = useData[name];
		var skillVal = data.val;
		var val;

		val = this.skillsWithPercent(name, data);
		val += this.skillsWithMinutes(name, data);
		this.createSklillBckLevel($s, data);
		this.createProgresLevel($s, data);

		$s.addClass(name + '-skill');
		$s.find('.skill-icon').addClass(name);
		$s.find('.skill-clan-name').html(Par.tLang(name));
		$s.find('.skill-clan-description').html(Par.tLang(name + 'description'));
		$s.find('.skill-actual-val').html('<b>' + Par.tLang('skill-actual-val') + ' ' + val + '</b>');
		$s.find('.skill-clan-buts-add-point').append($b);


		switch (type) {
			case 0:
				break;
			case 1:
				var $btn = this.createShowBlessBtn(skillState);
				$s.find('.skill-increase-decrease').empty().append($btn);
				break;
			case 2:
				var $onOffBtn = this.onOffButton(name, data, skillState);
				$s.find('.skill-clan-buts-turn-on-off').append($onOffBtn);
				break;
			case 3:
				var $increaseDecreaseBtn = this.increaseDecreaseButton(name, data, skillState, skillVal);
				$s.find('.skill-increase-decrease').append($increaseDecreaseBtn);
				break;
		}
		$par.append($s);
	};

	this.createProgresLevel = function ($skill, data) {
		var cur = data.lvl;
		var max = data.maxlvl;
		var $emptyWrapper = $skill.find('.skill-slots-wrapper');
		var $useWrapper = $skill.find('.skill-points-wrapper');
		for (var i = 0; i < max; i++) {
			var $one = $('<div>');
			var cl = '';
			if (i == 0) cl = 'left';
			else {
				if (i != max - 1) cl = 'middle';
				else cl = 'right';
			}
			$one.addClass(cl + ' empty-lvl');
			$emptyWrapper.append($one)
		}

		for (var i = 0; i < cur; i++) {
			var $one = $('<div>').addClass('use-lvl');
			$useWrapper.append($one);
		}
	};

	this.increaseDecreaseButton = function (name, data, skillState, skillVal) {
		var $btn = drawSIButton(Par.tLang('show_blesses'));
		var tip = '';
		var disable = false;

		if (skillState) {
			disable = true;
			tip += _t('skillBonusUsed') + '<br>';
		}
		if (skillVal == 0) {
			disable = true;
			tip += _t('notBuySkill') + '<br>';
		}
		if (disable) {
			$btn.addClass('black');
			$btn.tip(tip);
			return $btn;
		}

		$btn.click(function () {
			var $content = $('<div>');
			var $label1 = $('<div>').addClass('label').html(_t('timeTicketsAlert1'));
			var $wrapper = $('<div>').addClass('stamina_pay_options');
			var $span = $('<span>').addClass('st_pay_1').html(_t('for_today_new'));
			var $b1 = $('<button>').addClass('bal_pay_decrease active');
			var $b2 = $('<button>').addClass('bal_pay_increase active');
			$wrapper.append($span);
			$wrapper.append($b2);
			$wrapper.append($b1);

			$b1.click(function () {
				mAlert(_t('new_stamina_alert_sub'), 1, [function () {
					_g('clan&a=skills_use&name=' + name + '&opt=2');
				}]);
			});
			$b2.click(function () {
				mAlert(_t('new_stamina_alert_add'), 1, [function () {
					_g('clan&a=skills_use&name=' + name + '&opt=1');
				}]);
			});
			$content.append($label1);
			$content.append($wrapper);
			mAlert($content, 5);
		});
		return $btn;
	};

	this.onOffButton = function (name, data, skillState) {
		var $btn;
		var opt;
		var notBuySkill = data.lvl == 0;

		console.log(skillState);
		if (skillState) {
			$btn = drawSIButton(_t('turn_off', null, 'loot'));// $btn.find('.label').html(_t('turn_off', null, 'loot'));
			opt = 2;
		} else {
			$btn = drawSIButton(_t('turn_on', null, 'loot'));//$btn.find('.label').html(_t('turn_on', null, 'loot'));
			$btn.addClass('green');
			opt = 1;
		}

		if (notBuySkill) {
			$btn.addClass('black');
			$btn.tip(_t('notBuySkill'));
			return $btn;
		}


		$btn.click(function () {
			_g('clan&a=skills_use&name='+ name + '&opt=' + opt);
		});
		return $btn;
	};

	this.createSklillBckLevel = function ($skill, data) {
		var $bck = $skill.find('.skill-level-bck');
		var $lvl = $skill.find('.skill-level');
		var max = data.maxlvl;
		var lvl = data.lvl;
		var cl = Math.round(6 * lvl / max);
		var textCl = lvl > 0 ? 'chosen' : '';
		$lvl.html(lvl + '/' + max).addClass(textCl);
		$bck.addClass('cl-' + cl);
	};

	this.canUse = function () {
		var myRank = Par.getProp('myrank');
		return myRank & 1 ? 1 : 0;
	};

	this.addPointBtn = function ($skill, name, data) {
		var canUse = self.canUse();
		var tip = '';
		var disable = false;
		var maxProgress = data.maxlvl == data.lvl;

		if (!canUse) {
			//$skill.find('.skill-clan-buts-label').css('display', 'none');
			disable = true;
			tip += Par.tLang('clan_skills_can_use');
			//return null;
		}

		if (maxProgress) {
			$skill.find('.skill-clan-buts-label').css('display', 'none');
			return null;
		}
		if (self.amountPoint == 0 && !maxProgress) {
			disable = true;
			tip += tip != '' ? '<br><br>' : '';
			tip += _t('skillPointsNotExist');
		}
		if (Par.getProp('gold') < data.nextcost) {
			disable = true;
			tip += tip != '' ? '<br><br>' : '';
			tip += _t('notEnoughGold');
		}

		var cl = disable ? 'black' : '';
		var $but = drawSIButton(_t('uprage_clan_skill') + ' ' + round(data.nextcost,5)).addClass(cl);
		$but.tip(tip);
		if (disable) return $but;
		$but.click(function () {
			var txt = _t('acceptSkillupgrade', {'%cost%':round(data.nextcost,5)}, 'clan');
			mAlert(txt, 1, [function () {
				_g('clan&a=skills_upgrade&name=' + name);
			}]);
		});
		return $but;
	};

	this.clearContent = function () {
		content.find('.scroll-pane').empty();
	};

	this.updateScroll = function () {
		$('.scroll-wrapper', content).trigger('update');
	};

	this.init = function () {
		this.initContent();
		//this.resetSkillsBtn();
	};

	this.resetSkillsBtn = function () {
		var str = 'clan-skills-reset';
		var $btn = tpl.get('button');
		var $div1 = $('<div>').addClass('small-draconite');
		var $div2 = $('<div>').addClass('cost').html('20k');
		var canUse = self.canUse();
		$btn.append($div2, $div1);
		$btn.addClass('small purple');
		$btn.find('.label').html(Par.tLang(str));
		if (!canUse) return;
		$btn.click(self.resetSkilsRequest);
		content.find('.clan-skill-reset').append($btn);
	};

	this.resetSkilsRequest = function () {
		var bool = self.canUse();
		if (!bool) return;
		_g('clan&a=skills_reset');
	};

	this.showOrHideAddBtn = function () {
		var t = [
			'none', 'table-cell'
		];
		var show = self.amountPoint > 0 ? t[1] : t[0];
		content.find('.skill-upgrade').css('display', show);
	};

	this.initContent = function () {
		content = self.getClanSkillsContent();
		$('#clanbox').empty();
		$('#clanbox').append(content);
	};

	this.updateHeader = function () {
		var str;
		var canUse = this.canUse();
		var header = content.find('.clan-skill-header');
		var cl = self.amountPoint > 0 ? 'green' : 'red';
		var span = '<span class="'+ cl +'">' + self.amountPoint + '</span>';
		var $span = $('<div>').addClass('small-info MM-info-icon');
		if (canUse) {
			str = Par.tLang('choose_skillpoints');
		} else str = Par.tLang('only_leader');
		$span.tip(_t('one_clan_skill_point'));
		header.html(str + span);
		header.append($span);

	};

	this.createShowBlessBtn = function (skillState) {
		var label = Par.tLang('show_blesses');
		//var $btn = tpl.get('button').addClass('small green');
		var $btn = drawSIButton(label);
		$btn.click(self.showBless);
		return $btn;
	};

	this.showBless = function () {
		_g('clan&a=skills_use&name=blessing');
		var str = Par.tLang('clan_blesses');
		//Par.showChooseCard('clan', 'clan-bless');
		//Par.updateHeader(str);
	};

	this.getClanSkillsContent = function () {
		return $(
			'<div class="clan-skills-content">' +
			'<div class="clan-skill-main-header"></div>' +
			'<div class="clan-skill-header"></div>' +
			'<div class="clan-skill-reset"></div>' +
			'<div class="scroll-wrapper">' +
			'<div class="scroll-pane"></div>' +
			'</div>' +
			'</div>'
		);
	};

	this.getClanSkill = function () {
		return $(
			'<div class="one-clan-skill">' +
			'<div class="skill-icon-wrapper">' +
			'<div class="skill-icon"></div>' +
			'<div class="skill-level-bck">' +
			'<span class="skill-level"></span>' +
			'</div>' +
			'<div class="skill-increase-decrease"></div>' +
			'</div>' +
			'<div class="skill-clan-info">' +
			'<div class="skill-clan-name"></div>' +
			'<div class="skill-clan-description"></div>' +
			'<div class="skill-progress">' +
			'<div class="skill-slots-wrapper"></div>' +
			'<div class="skill-points-wrapper"></div>' +
			'</div>' +
			'<div class="skill-actual-val"></div>' +
			'</div>' +
			'<div class="skill-clan-buts-wrapper">' +
			'<div class="skill-clan-buts-label" data-trans="#use_clan_point"></div>' +
			'<div class="skill-clan-buts-add-point"></div>' +
			'<div class="skill-clan-buts-turn-on-off"></div>' +
			'</div>' +
			'</div>'
		);
	};

	this.init();

};
