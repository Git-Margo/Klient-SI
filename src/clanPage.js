
function clanPage(Par, which, $parent) {
	var self = this;
	var content;
	var $w;
	var menu;
	var bbCode;

	this.update = function (v) {
		this.updatePage(v);
		this.hideOrShowEditBut();
		this.updateScroll();
	};

	this.updatePage = function (v) {
		if (v) bbCode =  deletePositionFixed(v.official);
		else {
			var str = which == 'priv-page' ? 'info' : 'official';
			bbCode = Par.getProp(str);
		}
		content.find('.page-content').html(parseClanBB(bbCode));
	};

	this.hideOrShowEditBut = function () {
		if ($parent != 'clan') return;
		var allow = which == 'priv-page' ? 'priv' : 'official';
		var bool = this['allow' + allow + 'Edit']();
		var $b = $w.find('.clan-' + allow + '-page-content').find('.edit-page-but');
		$b.css('display', bool ? 'block' : 'none');
	};

	this.allowprivEdit = function () {
		var mR = Par.getProp('myrank');
		return mR & 32;
	};

	this.allowofficialEdit = function () {
		var mR = Par.getProp('myrank');
		return mR & 64;
	};

	this.updateScroll = function () {
		$('.scroll-wrapper', content).trigger('update');
	};

	this.init = function () {
		this.initWindow();
		this.initContent();
		this.initEditPageBut();
	};

	this.initWindow = function () {
		var bool = $parent == 'clan' ? 1 : 0;
		var t = [
			['showcase', Par.getShowcaseWnd().$],
			['clan', Par.wnd.$]
		];
		menu = t[bool][0];
		$w = t[bool][1];
	};

	this.initContent = function () {
		content = tpl.get('clan-page-content');
		content.addClass('clan-' + which + '-content');
		$w.find('.card-content').append(content);
		$('.scroll-wrapper', content).addScrollBar({track: true});
	};

	this.showOtherClanOfficial = function () {
		var cards = Par.getShowcaseWnd().$.find('.card');
		Par.showChooseCard(menu, 'clan-' + which);
		cards.removeClass('active');
		cards.eq(0).addClass('active');
	};

	this.initEditPageBut = function () {
		if ($parent != 'clan') return;
		var $but = tpl.get('button').addClass('small green');
		var bck = $('<div>').addClass('add-bck');
		var $where = content.find('.edit-page-but');
		$where.append($but);
		$but.append(bck);
		this.butClick($but);
	};

	this.butClick = function ($b) {
		$b.click(function () {
			Par.showChooseCard(menu, 'clan-edit-' + which);
			if (which == 'official-page')
				Par.updateEditOfficialPage(bbCode);
			else
				Par.updateEditPrivPage(bbCode);
		});
	};

	this.init();

};

