function clanList (Par) {
	var self = this;
	var content;
	var currentPage;
	var clansCount;
	var clansPerPage;
	var canLoadNextPage;
	var sortColum = 0;
	var normalSort = true;
	var maxPage;
	var findPanelLoaded = false;
	var timeOut = null;
	var lastVal;

	this.update = function (data) {
		currentPage = data.cur_page;
		clansCount = data.clans_count;
		clansPerPage = data.clans_per_page;
		maxPage = data.max_page;

		if (currentPage == 1) {
			this.init();
			var FindPanel = Par.getFindPanel();
			if (!findPanelLoaded) FindPanel.init();
			canLoadNextPage = true;
		}
		var l = data['id'].length;
		var $table = content.find('.clan-list-table');
		if (currentPage == maxPage) canLoadNextPage = false;

		for (var i = 0; i < l; i++) {
			var id = 					data['id'][i];
			//var $logo =				this.createLogo(data['logo'][i]);
			var clName = 			data['name'][i];
			var $name = 			$('<td>').addClass('no-border').text(clName);
			//var add = 				$logo.add($name);
			var power = 			data['level'][i];
			var members = 		data['members_count'][i];
			var attributes = 	data['attributes'][i];
			var recruit = this.getRectruit(data['attributes'][i], id);
			var minLev = 		  ((data['attributes'][i] >> 2) & 31) * 10;
			var cl = 					'normal-td';
			var $tr = Par.createRecords(
				[$name, power, members, minLev, recruit],
				['clan-name-td ' + cl, 'clan-lvl-td ' + cl, 'clan-members-td ' + cl, 'clan-minlvl-td ' + cl, cl]
			);
			$tr.addClass('hover one-clan-tr clan-id-' + id);
			self.trClick($tr, id);
			self.addIdToMyClan($tr, clName);
			$table.append($tr);
		}
		if (currentPage == 1) {
			var header = this.createTabHeaderClanList();
			$table.prepend(header);
			this.createHeaderSortButtons();
		}
	};

	this.getGetNextPage = function () {
		if (!canLoadNextPage) return;
		//$('.scroll-wrapper', content).trigger("stopDragBar");
		self.sendRequest(currentPage + 1);
	};

	this.getRectruit = function (attr, id) {
		var v = ((attr >> 21) & 3);
		//var v = 2;
		if (v == 0) return _t('no');
		else {
			var $btn;
			if (v == 2) {
				$btn = drawSIButton(_t('Join_now'));
				$btn.click(function () {
					_g('clan&a=join&id=' + id);
					return false;
				});
			} else {
				$btn = drawSIButton(_t('Apply_now'));
				$btn.click(function () {
					_g('clan&a=apply&id=' + id);
					return false;
				});
			}
			return $btn;
		}
	};

	this.createSkills = function (data, i) {
		var skills = {
			'maxParticipants' : {'lvl': data['maxParticipants'][i]},
			'expBonus' : 				{'lvl': data['expBonus'][i]},
			'questExpBonus' : 	{'lvl': data['questExpBonus'][i]},
			'allyEnemyCount' : 	{'lvl': data['allyEnemyCount'][i]},
			'blessing' : 				{'lvl': data['blessing'][i]},
			'cursedItem' :  		{'lvl': data['cursedItem'][i]},
			'healPower' :				{'lvl': data['healPower'][i]},
			'timeTickets' :				{'lvl': data['timeTickets'][i]}
		};
		return skills;
	};

	this.writeDataInElement = function ($tr, attributes, level, depoTabs, skils, outfit) {
		var CA = Par.getClanAtributs();
		var attrData = CA.getMapOfBits(attributes, level, depoTabs, skils, outfit);
		$tr.data('atribute', attrData);
	};

	this.addIdToMyClan = function ($tr, name) {
		//var myClName = Par.getProp('name');
		var myClName = 'asdasd'
		var name = 'cos';
		if (name == myClName) {
			$tr.addClass('my-clan-list-clan');
		}
	};

	this.trClick = function ($tr, id) {
		$tr.click(function () {
			_g("clan&a=getclan&id=" + id);
		});
	};

	this.createLogo = function (url) {
		var $logo = $('<td>').addClass('logo');
		$logo.css({
			'background': 'url(' + url + ')',
			'background-size': '100% 100%'
		});
		return $logo;
	};

	this.createTabHeaderClanList = function () {
		var clanInf = Par.getClanInf();
		var cl1 = 'table-header hover-header';
		var rLang = Par.tLang('recruitment');
		var lMinLang = Par.tLang('min_level');
		return Par.createRecords(
			[clanInf[0], clanInf[1], clanInf[2], lMinLang, rLang], cl1);
	};

	this.createHeaderSortButtons = function () {
		var $firstTr = content.find('.clan-list-table tr').first();
		for (var i = 0; i < 5; i++) {
			this.clickSort($firstTr, i);
		}
	};

	this.clickSort = function ($firstTr, i) {
		var $e = $firstTr.children().eq(i);
		$e.click(function () {
			if (sortColum == i) normalSort = !normalSort;
			else {
				sortColum = i;
				normalSort = true;
			}
			self.sendRequest(1);
		});
	};

	this.sendRequest = function (page, filter) {
		var val = content.find('.clan-name-input').val();
		var search = val == '' ? '': '&search=' + esc(val);
		var ascending = normalSort ? 1 : 0;

		var f = filter ? filter : '';

		_g('clan&a=list&page=' + page + '&sort=' + sortColum + '&ascending=' + ascending + search + f);
	};

	this.init = function () {
		$('#clanbox').unbind('scroll');
		this.initContent();
		this.initInputSearch();
		this.initScrollEvent();
	};

	this.initContent = function () {
		if (isset(content)) lastVal = content.find('.clan-name-input').val();
		else lastVal = '';
		$('#clanbox').empty();
		content = self.getClanListContent();
		$('#clanbox').append(content);
		content.find('.clan-name-input').focus();

	};

	this.initInputSearch = function () {
		var $search = content.find('.clan-name-input');
		$search.val(lastVal);
		$search.keyup(function () {
			if (timeOut) {
				clearTimeout(timeOut);
				timeOut = null;
				self.createTimeout();
			}
			else self.createTimeout()
		});
	};

	this.createTimeout = function () {
		timeOut = setTimeout(function () {
			self.sendRequest(1);
		}, 1000)
	};

	this.toBinary = function (val) {
		return (val >>> 0).toString(2)
	};

	this.getClanListContent = function () {
		return $(
			'<div class="clan-list-content">' +
			'<div class="clan-list-show-btn"></div>' +
			'<input class="clan-name-input default"/>' +
			'<div class="first-scroll-wrapper scroll-wrapper">' +
			'<div class="scroll-pane">' +
			'<table class="clan-list-table"></table>'+
			'</div>' +
			'</div>' +
			'</div>'
		);
	};

	this.resetLastVal = function () {
		content.find('.clan-name-input').val('');
	};

	this.initScrollEvent = function () {
		$('#clanbox').scroll(function() {
			if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight) {
				if ($('#clanbox').find('.clan-list-content').length < 1) return;
				self.getGetNextPage();
			}
		});
	};
}

