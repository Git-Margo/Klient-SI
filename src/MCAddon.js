function MCAddon() {

	var self = this;
	this.wnd = null;
	this.nick = null;
	var amountOfWarningText = 14;

	this.init = function () {
		self.initWindow();
		self.initAllText();
		self.initAllMuteBtns();
		self.initUnmuteBtn();
		self.initCloseButton();
	};

	this.initCloseButton = function () {
		self.createButton('Zamknij', 'mc-close-btn', $('.mc-header'), function () {
			self.close();
		})
	};

	this.initWindow = function () {
		self.wnd = {
			$:null
		};
		self.wnd.$ = $('#mc-addon')
	};

	this.initAllText = function () {
		var $wrapper = self.wnd.$.find('.all-texts');
		for (var i = 0; i < amountOfWarningText; i++) {
			var one_text = self.getMcText();
			var txt = _t(i, null, 'mc-addon');
			$wrapper.append(one_text);
			one_text.find('.label-text').html(txt);//.tip(txt);
			self.createButton('send', 'green small', one_text.find('.send'), function () {
				var text = $(this).find('.label').parent().parent().parent().find('.label-text').html();
				_g('console&custom=.reminder' + esc(` "` + self.nick.replaceAll(" ", "_") + `" "` + text + `"`));
			});
		}
		this.createCustomWarning($wrapper);
	};

	this.createCustomWarning = ($wrapper) => {
		var one_text = self.getMcText();
		$wrapper.append(one_text);
		const $input = createSiInput({ cl:'custom-warning-input' });
		one_text.find('.label-text').html($input);
		self.createButton('send', 'green small', one_text.find('.send'), function () {
			const text = $(this).find('.label').parent().parent().parent().find('.label-text input').val();
			if (text !== '') _g('console&custom=.reminder' + esc(` "` + self.nick.replace(" ", "_") + `" "` + text + `"`));
		});
	}

	this.initAllMuteBtns = function () {
		let t 			= [1, 6, 12, 18, 24, 36, 48, 60, 72];
		let $wrapper 	= self.wnd.$.find('.times-of-mute');

		for (let i = 0; i < t.length; i++) {
			self.createMuteButton($wrapper, t[i]);
		}
	};

	this.createMuteButton = ($wrapper, time) => {
		self.createButton(time, 'green small', $wrapper, function () {
			_g('console&custom=.mute' + esc(" " + self.nick.replaceAll(" ", "_") + " " + time));
		});
	}

	this.initUnmuteBtn = function () {
		self.createButton('Unmute', 'green small', self.wnd.$.find('.unmute'), function () {
			//var msg = '/unmute ' + self.nick;
			//Chat.sendMessage(msg);
			//chatSend(msg)
			_g('console&custom=.unmute' + esc(" " + self.nick.replaceAll(" ", "_")));
		});
	};

	this.createButton = function (text, cl, $parent, clb) {
		var $btn = drawSIButton(text).addClass(cl);
		$parent.append($btn);
		$btn.click(clb);
	};

	this.update = function ({ playerId, nick, attr }) {
		$('#mc-addon').css('display', 'block');
		self.wnd.$.find('.nick-header').html(nick);
		self.nick = nick.replaceAll(/ /gi, '_');

		const hadWarn = attr & 2;
		self.wnd.$.find('.had-warn').css('display', hadWarn ? 'block' : 'none');

		if (hadWarn) $('#mc-addon').addClass('is-warn');
		else $('#mc-addon').removeClass('is-warn');
	};

	this.close = function () {
		$('#mc-addon').css('display', 'none');
	};

	this.getMcText = function () {
		return $(
		'<div class="mc-text">' +
			'<div class="label-wrapper">' +
			'<div class="label-text"></div>' +
			'</div>' +
			'<div class="send"></div>' +
			'</div>'
		);
	};

	this.init();

};
