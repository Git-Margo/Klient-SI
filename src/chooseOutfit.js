function chooseOutfit () {

	var self = this;
	this.itemId      = null;
	this.ttl         = null;
	this.active      = null;
	this.$allOutfits = [];

	var animPos = {
		x: 3,
		y: 0
	};
	var repeat       = false;
	var animInterval = null;
	var maxFrame     = 4;
	var animX        = {};
	var animY        = {};

	this.init = function () {
		self.initWindow();
		self.initAnimUpdate();
		self.initButtons();
		$('.choose-outfit-info').html(_t('choose-outfit-info'));
	};

	this.initButtons = function () {
		//var $but1 = Templates.get('button').addClass('green disable small');
		//var $but2 = Templates.get('button').addClass('green small');

		var $but1 = drawSIButton(_t('accept', null, 'trade')).addClass('black');
		var $but2 = drawSIButton(_t('cancel'));

		self.wnd.$.find('.save-button').append($but1);
		self.wnd.$.find('.cancel-button').append($but2);

		$but1.bind('click', function () {
			self.acceptAlert();
		});
		$but2.bind('click', function () {
			self.close();
		});
	};

	this.acceptAlert = function () {
		var txt = _t('one-choose')
		//mAlert(txt, [{
		//	txt: _t('accept', null, 'trade'),
		//	callback: function () {
		//		console.log(self.active);
		//		_g("moveitem&st=2&id=" + self.itemId +"&outfit_id=" + self.active, function () {
		//			self.close();
		//		});
		//		return true;
		//	}
		//}, {
		//	txt: _t('cancel'),
		//	callback: function () {
		//		return true;
		//	}
		//}]);


		mAlert(txt, 1, [
			function (){
				_g("moveitem&st=2&id=" + self.itemId +"&outfit_id=" + self.active, function () {
					self.close();
				});
			}, function () {
				console.log('none');
			}
		]);
	}

	this.update = function (data) {
		self.itemId = data.item_id;
		self.ttl = data.outfitsTTL;
		for (var k in data.outfits) {
			self.createOutfits(data.outfits[k], k);
		}
		//self.wnd.center();
	};

	this.initAnimUpdate = function () {
		animInterval = setInterval( function () {
			self.updateFrames();
			self.draw();
		}, 200)
	};

	this.createOutfits = function (outfits, id) {
		const genderHtmlCodes = {
			1: '&#9794;',
			2: '&#9792;'
		};
		var $outfitWrapper = self.getTplChooseOutfitWrapper();
		var $outfit = $outfitWrapper.find('.outfit');

		var $span = $('<span>').html(outfits.name);
		var $gender = $('<div>').addClass('gender gender-' + outfits.gender);
		var $wrapper = $('<div>');

		$gender.html(genderHtmlCodes[outfits.gender]);
		$wrapper.append($span);
		$wrapper.append($gender);

		$outfitWrapper.find('.outfit-name').html($wrapper);
		$outfitWrapper.append($outfit);

		self.setImage($outfit, outfits.img);
		self.wnd.$.find('.all-outfits').append($outfitWrapper);
		$outfitWrapper.click(function () {
			self.wnd.$.find('.choose-outfit-wrapper').removeClass('active');
			self.wnd.$.find('.save-button').find('.SI-button').removeClass('black');
			$outfitWrapper.addClass('active');
			self.active = id;
		})
	};

	this.setImage = function ($outfit, url) {
		//var i = new Image();
		//i.src = CFG.opath + '/' + url;
		//i.onload = function () {
		//	var fW = i.width / 4;
		//	var fH = i.height / 4;
        //
		//	$outfit.css({
		//		background: 'url(' + i.src + ') no-repeat',
		//		width:fW,
		//		height:fH
		//	});
        //
		//	self.setAnimFrames(fW, fH);
		//	self.$allOutfits.push($outfit)
		//}

		ImgLoader.onload(
			CFG.opath + '/' + url,
			null,
			function () {
				var fW = this.width / 4;
				var fH = this.height / 4;

				$outfit.css({
					background	: 'url(' + this.src + ') no-repeat',
					width		: fW,
					height		: fH
				});

				self.setAnimFrames(fW, fH);
				self.$allOutfits.push($outfit)
			})
	};

	this.updateFrames = function () {
		animPos.x++;

		if (animPos.x == maxFrame) {
			animPos.x = 0;

			if (repeat) {
				repeat = false;
				animPos.y++;
			} else repeat = true;

			if (animPos.y == maxFrame) animPos.y = 0;
		}
	};

	this.draw = function () {
		for (var i = 0; i < self.$allOutfits.length; i++) {
			self.setOutfitPosition(self.$allOutfits[i]);
		}
	};

	this.setOutfitPosition = function ($el) {
		$el.css('background-position', animX[animPos.x] + 'px ' + animY[animPos.y] + 'px');
	};

	this.initWindow = function () {
		//var title = 'Wybierz outfit';
		var content = self.getTplChooseOutfit();
		//content.find('.item-changer-label').html(goldTxt(title));

		this.wnd = {};
		this.wnd.$ = content;
		$('#choose-outfit').append(this.wnd.$);
		$('#choose-outfit').css('display', 'block');
		this.wnd.$.find('.closebut').click(self.close);
	};

	this.setAnimFrames = function (oneFrameWidth, oneFrameHeight) {
		animX = [0, -oneFrameWidth, -oneFrameWidth * 2, -oneFrameWidth * 3];
		animY = [0, -oneFrameHeight, -oneFrameHeight * 2, -oneFrameHeight * 3];
	};

	this.close = function () {
		self.clearAnimInterval();
		self.wnd.$.remove();
		delete (self.wnd);
		g.chooseOutfit = null;
	};

	this.clearAnimInterval = function () {
		clearInterval(animInterval);
	};

	this.getTplChooseOutfit = function () {
		return $(
			'<div class="choose-outfit">' +
			' <div class="middle-graphics"></div>' +
			' <div class="choose-outfit-info"></div>' +
			' <div class="all-outfits"></div>' +
			' <div class="buttons-wrapper">' +
			'   <div class="save-button"></div>' +
			'   <div class="cancel-button"></div>' +
			' </div>' +
			' <div class="closebut"></div>' +
			'</div>'
		)
	}

	this.getTplChooseOutfitWrapper = function () {
		return $(
			'<div class="choose-outfit-wrapper">' +
			' <div class="outfit-name"></div>' +
			' <div class="outfit"></div>' +
			'</div>'
		);
	}

}
