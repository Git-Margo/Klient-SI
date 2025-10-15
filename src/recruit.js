function recruit(Par, otherClan) {
	var content;
	var attrDataTab;
	var self = this;
	var cards;

	this.initCards = function () {
		cards = [
			['recruit-main', 			false],
			['recruit-candidate', self.clickCuruitCandidate],
			['recruit-invite', 		self.clickRecruitInvite]
		];
	};

	this.init = function () {
		this.initContent();
		this.initCards();
		this.initMenu();
		this.initTexts();
		this.initAttrTab();
		this.initTableHeaders();
		//this.initButtonsWrapper();
		this.initInviteBut();
		if (!otherClan) this.initSaveAttrBtn();
	};

	this.initButtonsWrapper = function () {
		var $b1 = drawSIButton(_t('accept_all')).addClass('small green');
		var $b2 = drawSIButton(_t('refuse_all')).addClass('small');
		content.find('.buttons-wrapper').append($b1);
		content.find('.buttons-wrapper').append($b2);
		$b1.click(function () {
			console.log(1)
		});
		$b2.click(function () {
			console.log(2)
		});
	};

	this.clickCuruitCandidate = function () {
		_g('clan&a=recruit_applications_show');
	};

	this.clickRecruitInvite = function () {
		_g('clan&a=invite_show');
	};

	this.getContent = function () {
		return content;
	};

	this.initMenu = function () {
		var $menu = content.find('.clan-recruit-menu').find('.cards-header');
		for (var i = 0; i < cards.length; i++) {
			self.createRecruitCardMenu(cards[i], $menu);
		}
	};

	this.inviteToClan = function () {
		var i = content.find('.player-nick');
		_g('clan&a=invite&n=' + esc(i.val()), function () {
			i.val('');
		});
	};

	this.initInviteBut = function () {
		var myRank = Par.getProp('myrank');
		var bool = myRank & Math.pow(2, 3) ? 1 : 0;
		if (bool) content.find('.invite-to-clan').find('.input-wrapper').css('display', 'table-cell');
		else {
			content.find('.input-wrapper').css('display', 'none');
			return;
		}
		content.find('.invite-to-clan').find('.label-info').html(Par.tLang('clan_invite_new'));
		var $btn = drawSIButton(Par.tLang('inviteClan'));
		content.find('.invite-but').append($btn);
		$btn.click(self.inviteToClan);
	};

	this.createRecruitCardMenu = function (obj, $menu) {
		var name = obj[0];
		var clb = obj[1];
		var text = Par.tLang(name);
		var $div = drawSIButton(text).addClass('card card-' + name);
		var $label = $('<span>').html(text);
		$menu.append($div);
		$div.append($label);
		$div.click(function () {
			if (name == 'recruit-candidate' || name == 'recruit-invite') {
				var myRank = Par.getProp('myrank');
				var bool = myRank & Math.pow(2, 3) ? 1 : 0;
				if (!bool) {
					mAlert(_t('accessDenied'));
					return;
				}
			}
			self.showSection(name);
			if (clb) clb();
		});
	};

	this.initTableHeaders = function () {
		var t0 = [
			_t('date', null, 'matchmaking'),
			'Nick',
			'Lvl',
			_t('prof_th', null, 'auction'),
			_t('decision', null, 'clan'),
			_t('invitedBy', null, 'clan'),
			_t('delete', null, 'clan')
		];
		var a = Par.createRecords([t0[0], t0[1], t0[2], t0[4]], 'table-header');
		var b = Par.createRecords([t0[0], t0[1], t0[2], t0[5], t0[6]], 'table-header');
		content.find('.recruit-candidate-table').append(a);
		content.find('.recruit-invite-table').append(b);
	};

	this.showSection = function (name) {
		content.find('.card').removeClass('active');
		content.find('.card-' + name).addClass('active');
		content.find('.recruit-section').removeClass('active');
		content.find('.section-' + name).addClass('active');
	};

	this.update = function (v, clanData) {
		//if (clanData) {
			this.updateAtributes();
			//return;
		//}
		//if (v.clan_applications) this.updateClanApplications(v.clan_applications);
		//if (v.clan_invitations) this.updateClanInvitations(v.clan_invitations);
		self.showSection('recruit-main');
	};

	this.updateClanApplications = function (v) {
		var $applicationWrapper = content.find('.recruit-candidate-table');
		$applicationWrapper.find('.one-applicant').remove();
		for (var p in v) {
			var oneP = v[p];
			this.createOneTr(oneP, $applicationWrapper);
		}
	};

	this.updateClanInvitations = function (v) {
		var $applicationWrapper = content.find('.recruit-invite-table');
		$applicationWrapper.find('.one-invitation').remove();
		for (var p in v) {
			var oneP = v[p];
			this.createOneTrInvitation(oneP, $applicationWrapper);
		}
	};

	this.createOneTr = function (oneP, $table) {
		var $accept = drawSIButton(_t('accept_applicant')).addClass('small green');
		var $refuse = drawSIButton(_t('refuse_applicant')).addClass('small');
		var $wrapper = $('<div>').addClass('buttons-wrapper');

		let $characterInfoElement = createCharacterInfoElement(oneP);

		var $tr = Par.createRecords([ut_date(oneP.send_ts), oneP.recruit_nick, $characterInfoElement, $wrapper], 'normal-td');
		$tr.addClass('one-applicant');
		$wrapper.append($accept);
		$wrapper.append($refuse);
		content.find('.section-recruit-candidate').find('.recruit-candidate-table').append($tr);
		$table.append($tr);
		$accept.click(function () {
			_g('clan&a=recruit_applications_accept&id=' + oneP.id)
		});
		$refuse.click(function () {
			_g('clan&a=recruit_applications_reject&id=' + oneP.id);
		})
	};

	const createCharacterInfoElement = (data) => {
		let characterInfoData 		= {
			nick			: data.recruit_nick,
			level			: data.recruit_lvl,
			operationLevel	: data.recruit_oplvl,
			prof			: data.recruit_prof
		};
		let $characterInfoWrapper 	= $('<div>').addClass('character-info-wrapper');
		let characterInfo 			= getCharacterInfo(characterInfoData);

		$characterInfoWrapper.html(characterInfo);

		//characterInfoData.showNick = true;

		addCharacterInfoTip($characterInfoWrapper, characterInfoData);

		return $characterInfoWrapper;
	}

	this.createOneTrInvitation = function (oneP, $table) {
		var $remove = drawSIButton(_t('delete'));
		var $wrapper = $('<div>').addClass('buttons-wrapper');

		let $characterInfoElement = createCharacterInfoElement(oneP);

		var $tr = Par.createRecords([ut_date(oneP.send_ts), oneP.recruit_nick, $characterInfoElement, oneP.recruiter_nick, $wrapper], 'normal-td');
		$tr.addClass('one-invitation');
		//$remove.find('.label').html(_t('delete'));
		$wrapper.append($remove);
		content.find('.section-recruit-candidate').find('.recruit-candidate-table').append($tr);
		$table.append($tr);
		$remove.click(function () {
			_g('clan&a=invite_cancel&id=' + oneP.id)
		});
	};

	this.updateAtributes = function () {
		var myClanBits = Par.getProp('attributes').toString();
		var ClanAtributes = Par.getClanAtributs();
		var skills = Par.getProp('quest_bonuses');
		var outfit = Par.getProp('has_outfit');
		var level = Par.getProp('level');
		var depoTabs = Par.getProp('depo_tabs');
		var bits = ClanAtributes.getMapOfBits(myClanBits, level, depoTabs, skills, outfit);

		var myRank = Par.getProp('myrank');
		var edit = myRank & 1 ? 1 : 0;
		//this.createAllAtributs(bits, true, 'inInput');
		this.createAllAtributs(bits, edit, edit ? 'inInput' : '.atribute-value');
	};

	this.initContent = function () {
		var str1 = 'clan-recruit-content';
		var str2 = 'clan-other-recruit-content';
		content = self.getClanRecruitHtml();
		$('#clanbox').empty();
		if (otherClan) {
			content.removeClass(str1).addClass(str2);
			Par.getShowcaseWnd().$.find('.card-content').append(content);
		}
		else $('#clanbox').append(content);
	};

	this.initTexts = function () {
		var myRank = Par.getProp('myrank');
		var bool = myRank & Math.pow(2, 3) ? 1 : 0;
		if (bool) content.find('.clan-recruit-header-option').html(Par.tLang('header-option'));
		content.find('.clan-recruit-header-atribute').html(Par.tLang('header-atribute'));
		content.find('.clan-recruit-header-0').html(Par.tLang('basic_atributes'));
		content.find('.clan-recruit-header-1').html(Par.tLang('additional_atributes'));
		if (!otherClan) return;
		content.find('.clan-recruit-header-2').html(Par.tLang('clan_skills'));
	};

	this.initAttrTab = function () {
		var ClanAtributs = Par.getClanAtributs();
		attrDataTab = ClanAtributs.getAttrDataTab();
	};

	this.initSaveAttrBtn = function () {
		var myRank = Par.getProp('myrank');
		var edit = myRank & 1 ? 1 : 0;
		if (!edit) return;
		var $btn = drawSIButton(Par.tLang('save')).addClass('green');
		//var str = Par.tLang('save');
		//$btn.find('.label').html(str);
		$btn.click(function () {
			var ClanAtributs = Par.getClanAtributs();
			ClanAtributs.saveAtributes();
		});

		content.find('.save-atributes').append($btn);
	};

	this.createAllAtributs = function (bits, edit, selectorToOption) {
		var $attrWrapper = content.find('.scroll-pane');
		var ClanAtributs = Par.getClanAtributs();
		$attrWrapper.find('.one-clan-atribute').remove();
		var arg = bits ? [bits, selectorToOption] : false;
		for (var id in attrDataTab) {
			if (id > 99 && !otherClan) break;
			ClanAtributs.createAtribute($attrWrapper, id, content, arg, edit, true);
		}
		this.updateRights();
	};

	this.updateRights = function () {
		var t = [
			'none',
			'table-cell'
		];
		var display;
		if (otherClan) display = t[0];
		else {
			var myRank = Par.getProp('myrank');
			display = myRank & 1 ? t[1] : t[0];
		}
		//content.find('.input-wrapper, .save-atribute-wrapper').css('display', display);
		content.find('.one-clan-atribute').find('.input-wrapper').css('display', display);
	};

	this.getClanRecruitHtml = function () {
		return $(
			'<div class="clan-recruit-content">'+
			'<div class="clan-recruit-menu">'+
			'<div class="cards-header-wrapper">'+
			'<div class="header-background-graphic"></div>'+
			'<div class="cards-header"></div>'+
			'</div>'+
			'</div>'+
			'<div class="recruit-section section-recruit-main">'+
			'<div class="scroll-wrapper">'+
			'<div class="scroll-pane">'+
			'<div class="background-wrapper">'+
			'<div class="clan-recruit-header-option"></div>'+
			'<div class="invite-to-clan">'+
			'<div class="v-align">'+
			'<div class="label-info v-item"></div>'+
			'<div class="input-wrapper v-item">'+
			'<input class="player-nick default">'+
			'</div>'+
			'<div class="invite-but v-but v-item"></div>'+
			'</div>'+
			'</div>'+
			'<!--<div class="clan-recruit-header-0"></div>-->'+
			'<div class="clan-recruit-header-atribute"></div>'+
			'<div class="clan-part-0"></div>'+
			'<!--<div class="clan-recruit-header-1"></div>-->'+
			'<div class="clan-part-1"></div>'+
			'<!--<div class="clan-recruit-header-2"></div>-->'+
			'<div class="clan-part-2"></div>'+
			'<div class="save-atributes"></div>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'<div class="recruit-section section-recruit-candidate">'+
			'<div class="scroll-wrapper">'+
			'<div class="scroll-pane">'+
			'<div class="background-wrapper">'+
			'<table class="recruit-candidate-table"></table>'+
			'<div class="buttons-wrapper"></div>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'<div class="recruit-section section-recruit-invite">'+
			'<div class="scroll-wrapper">'+
			'<div class="scroll-pane">'+
			'<div class="background-wrapper">'+
			'<table class="recruit-invite-table"></table>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>'
		);
	};
}
