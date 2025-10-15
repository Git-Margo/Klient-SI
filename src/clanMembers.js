function clanMembers (Par) {
	var self = this;
	var content;
	var prepareToSort;
	var lastSortChoice = 'invertrank';

	this.createTabHeaderMemberList = function () {
		var charInf = Par.getCharInf();
		var $nickLoc = $('<div>').html(charInf[0] + '/' + charInf[1]);
		var $profAndLevel = $('<div>').html(charInf[4]);
		var $rank = $('<div>').html(charInf[2]);
		var status = $('<div>').html(charInf[3]);
		$nickLoc.tip(_t('sortForName'));
		$profAndLevel.tip(_t('sortForLvl'));
		$rank.tip(_t('sortForRank'));
		status.tip(_t('sortForStatus'));
		return Par.createRecords([$nickLoc, $profAndLevel, $rank, status], 'table-header hover-header');
	};

	this.update = function (v) {
		this.init()
		this.clearTable();
		for (var i = 0; i < v.length; i += 11) {
			var sliceD = v.slice(i, i + 11);
			var $tr = Par.createOneMember(sliceD, true, true);
			var id = sliceD[0];
			var memberList = Par.getMemberList();
			prepareToSort.push($tr);
			memberList[id] = sliceD;
		}
		this.createMembersListTable('invertrank');
	};

	this.clearTable = function () {
		prepareToSort = [];
		for (var i = 0; i < prepareToSort.length; i++) {
			prepareToSort[i].remove();
			delete prepareToSort[i];
		}
	};

	this.deleteTable = function () {
		content.find('.clan-members-table').detach();
		content.find('.clan-members-table').remove();
	};

	this.createMembersListTable = function (type) {
		var header = this.createTabHeaderMemberList();
		var $table = $('<table>').addClass('clan-members-table');
		var sortedArray = this.getSortedTable(type);
		this.deleteTable();
		for (var k in sortedArray) {
			var $tr = sortedArray[k];
			$table.append($tr);
		}

		$table.prepend(header);
		content.find('.scroll-pane').append($table);
		this.createHeaderSortButtons();
		$('.scroll-wrapper', content).trigger('update');
	};

	this.createHeaderSortButtons = function () {
		var $firstTr = content.find('.clan-members-table tr').first();
		for (var i = 0; i < 4; i++) {
			this.clickSort($firstTr, i);
		}
	};

	this.clickSort = function ($firstTr, i) {
		var t = ['name', 'lvl', 'rank', 'status'];
		var $e = $firstTr.children().eq(i);
		$e.click(function () {
			var choice = t[i];
			var bool =  lastSortChoice == choice;
			if (bool) lastSortChoice = 'invert' + choice;
			else lastSortChoice = choice;
			self.createClanListTable(lastSortChoice);
		});
	};

	this.createClanListTable = function (type) {
		var header = this.createTabHeaderMemberList();
		var $table = $('<table>').addClass('clan-members-table');
		var sortedArray = this.getSortedTable(type);
		this.deleteTable();
		for (var k in sortedArray) {
			var $tr = sortedArray[k];
			$table.append($tr);
		}

		$table.prepend(header);
		content.find('.scroll-pane').append($table);
		this.createHeaderSortButtons();
		$('.scroll-wrapper', content).trigger('update');
	};

	this.getSortedTable = function (type) {
		switch (type) {
			case 'name' :
				return this.sortByName(prepareToSort, '.char-stats');
			case 'invertname' :
				return this.sortByName(prepareToSort, '.char-stats', true);
			case 'lvl' :
				return this.sortByAmount(prepareToSort, '.member-lvl');
			case 'invertlvl' :
				return this.sortByAmount(prepareToSort, '.member-lvl', true);
			case 'rank' :
				return this.sortByRank(prepareToSort, '.member-rank');
			case 'invertrank' :
				return this.sortByRank(prepareToSort, '.member-rank', true);
			case 'status' :
				return this.sortByOnline(prepareToSort, '.online-status');
			case 'invertstatus' :
				return this.sortByOnline(prepareToSort, '.online-status', true);
		}
	};

	this.sortByRank = function (o, selector, invert) {
		var array = [];
		for (var k in o)
			array[k] = o[k];
		array.sort(function (a, b) {
			var nA = parseInt(a.find(selector).attr('id-rank'));
			var nB = parseInt(b.find(selector).attr('id-rank'));
			if (invert) return nB - nA;
			else return nA - nB;
		});
		return array;
	};

	this.sortByOnline = function (o, selector, invert) {
		var array = [];
		var online = [];
		for (var k in o) {
			if (o[k].find(selector).html() != 'online') array.push(o[k]);
			else online.push(o[k]);
		}

		array.sort(function (a, b) {
			return self.orderPlayerPerTimeOffline(a, b, invert);
		});

		for (var i = 0; i < online.length; i++) {
			if (invert) array.push(online[i]);
			else array.unshift(online[i]);
		}
		return array;
	};

	this.orderPlayerPerTimeOffline = function (a, b, invert) {
		var aVal = parseInt(a.find('.time-offline').attr('time-offline'));
		var bVal = parseInt(b.find('.time-offline').attr('time-offline'));
		if (invert) return bVal - aVal;
		else return aVal - bVal;
	};

	this.sortByName = function (o, selector, invert) {
		var array = [];
		for (var k in o)
			array[k] = o[k];
		array.sort(function (a, b) {
			var nA = a.find(selector).text().toLowerCase()[0];
			var nB = b.find(selector).text().toLowerCase()[0];
			if (invert) return (nA > nB) ? -1 : (nA < nB) ? 1 : 0;
			else return (nA < nB) ? -1 : (nA > nB) ? 1 : 0;
		});
		return array;
	};

	this.sortByAmount = function (o, selector, invert) {
		var array = [];
		for (var k in o)
			array[k] = o[k];
		array.sort(function (a, b) {
			var nA = parseInt(a.find(selector).html());
			var nB = parseInt(b.find(selector).html());
			if (invert) return nB - nA;
			else return nA - nB;
		});
		return array;
	};

	this.createButRankEdit = function ($mem, r, id, name) {
		var myrank = Par.getProp('myrank');
		var edit = myrank & 19;
		var clRank = hero.clan.rank;
		if (!edit || r >= clRank) return;
		//var $but = tpl.get('button').addClass('small green');
		var $but = drawSIButton('Edytuj');
		$but.tip(_t('memberManage'));
		var bck = $('<div>').addClass('add-bck');
		$mem.find('.edit').append($but);
		$but.append(bck);
		$but.click(function () {
			var memberList = Par.getMemberList();
			var member = memberList[id];
			var str = _t('player_edit %name%', {'%name%': name}, 'clan');
			Par.updatePlayerEdit(member);
			//Par.showChooseCard('clan', 'clan-edit');
			//Par.updateHeader(str);
		});
	};

	this.createAddToGroup = function ($mem, id) {
		//return;
		var hId = hero.id;
		if (hId == id) return;
		//var $but = tpl.get('button').addClass('small green');
		var $but = drawSIButton('Grupuj');
		$but.tip(_t('sendInviteToGroup'));
		//var bck = $('<div>').addClass('add-bck');
		$mem.find('.add-to-group').append($but);
		//$but.append(bck);
		$but.click(function () {
			_g('party&a=inv&id=' + id);
		});
	};

	this.hideDisableCards = function () {
		var $w = Par.getShowcaseWnd().$;
		var $card = $w.find('.card');
		$card.eq(1).add($card.eq(3)).css('display', 'inline-block');
		$card.eq(4).css('display', 'none');
	};

	this.init = function () {
		content = self.getClanMembersContent();
		$('#clanbox').empty();
		$('#clanbox').append(content);
	};

	this.getClanMembersContent = function () {
		return $(
			'<div class="clan-members-content">' +
			'<div class="scroll-wrapper">' +
			'<div class="scroll-pane">' +
			'<table class="clan-members-table"></table>' +
			'</div>' +
			'</div>' +
			'</div>'
		)
	};

	this.getClanMember = function () {
		return $(
			'<div class="clan-member">' +
			'<div class="icon-wrapper">' +
			'<div class="icon"></div>' +
			'</div>' +
			'<div class="char-info">' +
			'<div class="char-stats"></div>' +
			'<div class="last-visit"></div>' +
			'</div>' +
			'<div class="edit"></div>' +
			'<div class="add-to-group"></div>' +
			'</div>'
		);
	};
};

