function playerEdit (Par) {
	var self = this;
	var content;
	var id;
	var name;

	this.update = function (m) {
		this.init();
		id = m[0];
		name = m[1];
		this.createHeaderAndTable(m);
		this.createMenu();
		this.hideOrShow();
		Tip.hide()
	};

	this.createHeaderAndTable = function (m) {
		var str = 'player-edit-table';
		var header = this.createHeaderMemberList();
		var $table = content.find('.' + str);
		var $tr = Par.createOneMember(m, false, false);
		$table.html('');
		$table.append(header, $tr);
	};

	this.init = function () {
		content = this.getClanEditContetn();
		$('#clanbox').empty();
		$('#clanbox').append(content);
		this.createBut();
	};

	this.createHeaderMemberList = function () {
		var charInf = Par.getCharInf();
		return Par.createRecords([charInf[0] + '/' + charInf[1], charInf[2]], 'table-header');
	};

	this.createBut = function () {
		var t = [
			Par.tLang('cl_name_save'),
			Par.tLang('cl_send'),
			Par.tLang('del_member'),
			Par.tLang('back')
		];
		Par.addControll(t[0], 'change-rank-but', this.changeRank, content).addClass('small green');
		Par.addControll(t[1], 'send-but', this.changeBoss, content).addClass('small');
		Par.addControll(t[2], 'remove-from-clan', this.removeFromClan, content).addClass('small');
		Par.addControll(t[3], 'back-to-members', this.backToMemberList, content).addClass('small green');
	};

	this.changeRank = function () {
		var v = content.find('.rank-menu').val();
		_g('clan&a=member&id=' + id + '&rank=' + v, function () {
			self.backToMemberList();
		})
	};

	this.hideOrShow = function () {
		var mr = Par.getProp('myrank');
		var t = [
			'block',
			'none'
		];
		content.find('.send-tears').css('display', mr & 1 ? t[0] : t[1]);
		content.find('.edit-rank').css('display', mr & 2 ? t[0] : t[1]);
		content.find('.remove-from-clan').css('display', mr & 16 ? t[0] : t[1]);
	};

	this.changeBoss = function () {
		var msg = _t('give_clan_leadership_confirm %name%', {'%name%': name}, 'clan');
		Par.alert(msg, self.changeBossReq);
	};

	this.changeBossReq = function () {
		var v = content.find('.send-menu').val();
		_g('clan&a=member&id=' + id + '&leader=1' + (parseInt(v) ? '' : '&pay=self'), function () {
			self.backToMemberList();
		});
	};

	this.removeFromClan = function () {
		var msg = _t('player_dismiss_confirm', {'%name%': name}, 'clan');
		Par.alert(msg, function () {
			_g('clan&a=member&dismiss=1&id=' + id, function () {
				self.backToMemberList();
			});
		});
	};

	this.backToMemberList = function () {
		_g('clan&a=members');
	};

	this.createMenu = function () {
		var t = [
			Par.tLang('change_rank'),
			Par.tLang('give_clan_leadership')
		];
		var ranks = Par.getProp('ranks');
		var cR = hero.clan.rank;
		var rank = Par.getMemberList()[id][8];
		var r1 = [];
		var r2 = [
			{'text': Par.tLang('clan_sl'), 'val': 1},
			{'text': Par.tLang('private_sl'), 'val': 0}
		];
		for (var k in ranks) {
			if (k >= cR) continue;
			r1.push({'text': ranks[k].name, 'val': k});
		}
		content.find('.edit-rank>.label').html(t[0]);
		content.find('.send-tears>.label').html(t[1]);
		//content.find('.rank-menu').empty().createMenu(r1);
		var s1 = content.find('.rank-menu').empty();
		var s2 = content.find('.send-menu').empty()

		var r1Reverse = r1.reverse();
		for (var k in r1Reverse) {
			s1.append($('<option>').html(r1[k].text).attr('value', r1[k].val));
		}

		for (var k in r2) {
			s2.append($('<option>').html(r2[k].text).attr('value', r2[k].val));
		}


		//content.find('.send-menu').empty().createMenu(r2, true);
		//content.find('.rank-menu>span').html(ranks[rank].name).attr('value', rank);
		content.find('.edit-rank').find('select').val(rank);
		content.find('.rank-menu>span').html(ranks[rank].name).attr('value', rank);
	};

	this.getClanEditContetn = function () {
		return $(
		'<div class="clan-edit-content">' +
			'<table class="player-edit-table"></table>' +
			'<div class="player-edit-pane">' +
			'<div class="edit-rank">' +
			'<div class="label"></div>' +
			'<div class="v-align">' +
			'<div class="v-item">' +
			'<select class="rank-menu menu default"></select>' +
			'</div>' +
			'<div class="change-rank-but v-but v-item"></div>' +
			'</div>' +
			'</div>' +
			'<div class="send-tears">' +
			'<div class="label"></div>' +
			'<div class="v-align">' +
			'<div class="v-item">' +
			'<select class="send-menu menu default"></select>' +
			'</div>' +
			'<div class="send-but v-but v-item"></div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="bottom-buttons">' +
			'<div class="remove-from-clan"></div>' +
			'<div class="back-to-members"></div>' +
			'</div>' +
			'</div>'
		);
	};
};

