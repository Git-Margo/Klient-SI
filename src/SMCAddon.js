function SMCAddon() {

	var self = this;
	this.wnd = null;

	this.init = function () {
		self.initWindow();
		self.createAllButtons();
		self.initCheckboxes();
		self.acceptBut();
		self.initCloseButton();
	};

	this.initCloseButton = function () {
		var $btn = drawSIButton('Zamknij')
		$('#smc-addon').append($btn);
		$btn.addClass('smc-addon-close');
		$btn.click(function () {
			self.close();
		});
	};

	this.initWindow = function () {
		this.wnd = {
			$: $('#smc-addon')
		};
	};

	this.close = function () {
		$('#smc-addon').css('display', 'none');
	};

	this.createAllButtons = function () {
		var days = [1, 3, 7, 14, 30];
		for (var i in days)
			self.createButton(days[i]);
		self.createButton();
	};

	this.createButton = function (day) {
		var id = 'banday_' + (day ? day : 'custom');
		var $banDay = self.getBanDayRow();//.attr('id', id);
		var $nr = $banDay.find('.nr');
		$banDay.find('.checkbox').attr('id', id);
		if (day) $nr.attr('for', 'banday_' + day).html(day);
		else {
			$nr.remove();
			var $input = $('<input>').attr({
				'id': 'custom_banday_value',
				'for': 'banday_custom'
			}).addClass('default');
			$banDay.find('.table-wrapper').append($input);
		}
		self.wnd.$.find('.days').append($banDay);
	};

	this.acceptBut = function () {
		var $btn = drawSIButton('Ok');
		self.wnd.$.find('.ban-btn').append($btn);
		//$btn.find('.label').html('OK');
		$btn.click(function () {
			var $active = self.wnd.$.find('.checkbox:checked');

			var type = $active.length ? $active.attr('id').substr(7) : null;
			var amount = type == 'custom' ? $('#custom_banday_value').val() : type;
			var bool = !isNaN(parseInt(amount)) && $('.ban-reason').val().length >= 10;
			if (bool) {
				_g('gm&a=ban&nick=' + esc(self.nick) + '&days=' + amount + '&reason=' + esc($('#banday_reason').val()), function () {
					self.close();
				});
			} else mAlert(_t('banday_wrong_values_error'));

		});
	};

	this.update = function (nick) {
		$('#smc-addon').css('display', 'block');
		this.nick = nick;
		this.updateNick();
	};

	this.updateNick = function () {
		self.wnd.$.find('.question').html(_t('bandays_amount for %name%', {'%name%': self.nick}));
	};

	this.initCheckboxes = function () {
		self.wnd.$.find('.banday-row').bind('click', function () {
			$('.banday-row').find('input').removeAttr('checked');
			$(this).find('.checkbox').attr('checked', true);
			$(this).find('input').focus();
		});
	};

	this.getBanDayRow = function () {
		return $(
		'<div class="banday-row">' +
			'<div class="table-wrapper">' +
			'<div class="checkbox-wrapper">' +
			'<input class="checkbox" type="checkbox">' +
			'</div>' +
			'<span class="nr"></span>' +
			'</div>' +
			'</div>'
		);
	};



	this.init();

};
