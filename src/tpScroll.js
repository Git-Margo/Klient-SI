function tpScroll() {
	var self = this;
	var content;
	var loadedMaps = [];
	var activeIdMapChoice = null;
	var activeCoordsChoice = null;
	this.itemId;
	this.data = {};
	this.wnd = {};
	self.scale = null;
	self.big = 1;

	this.init = function () {
		this.initWindow();
		this.modifyContent();
		this.initSearch();
		//this.addCurrentMap();
	};

	this.addCurrentMap = function () {
		data[map.id] = {
			name : map.name,
			img: CFG.mpath + map.file,
			cords: [
				[11, 12],
				[1, 15],
				[4, 2]
			]
		}
	};

	this.initWindow = function () {
		var title = _t('kcs_set');
		content = self.getDividePanel();
		content.find('.green-panel-label').html(title);
		this.wnd.$ = content;
		$('#tp-scroll').append(this.wnd.$);
		this.wnd.$.find('.closebut').click(function () {
			self.close();
		});
	};

	this.initSearch = function () {
		var $search = this.wnd.$.find('.search-item');
		$search.keyup(function () {
			var v = $(this).val();
			var $allItems = self.wnd.$.find('.divide-list-group');
			if (v == '') $allItems.css('display', 'block');
			else {
				$allItems.each(function () {
					var txt = ($(this).find('.label').html()).toLowerCase();
					var disp = txt.search(v.toLowerCase()) > - 1 ? 'block' : 'none';
					$(this).css('display', disp);
				});
			}
		});
		$search.attr('placeholder', _t('search'));
	};

	this.update = function (v) {
		this.itemId = v.item_id;
		this.data = v.targets;
		const cities = [];
		for (const idMap in this.data) {
			const mapName = this.data[idMap].n;
			var $oneCity = self.getTplDivideGroup().addClass('city-' + idMap);
			$oneCity.find('.label').text(mapName);
			$oneCity.on('click', () => this.onClickEvent(idMap));

			cities.push($oneCity);
		}

		this.appendCityToWrapper(cities);
		this.openCurrentLocation();
	};

	this.appendCityToWrapper = function (cities) {
		if (cities.length > 0) {
			cities.sort(function (a, b) {
				var nA = a.find('.label').text().toLowerCase()[0];
				var nB = b.find('.label').text().toLowerCase()[0];
				return nA < nB ? -1 : nA > nB;
			});
			var $cityWrapper = this.wnd.$.find('.left-scroll').find('.scroll-pane');
			for (var i = 0; i < cities.length; i++) {
				$cityWrapper.append(cities[i]);
			}
		}
	};

	this.modifyContent = function () {
		var $wrapper = $('<div>').addClass('mini-map-wrapper');
		var $positioner = $('<div>').addClass('mini-map-positioner');
		$wrapper.append($positioner);
		self.wnd.$.find('.right-scroll').find('.scroll-pane').append($wrapper);

		var $cityName = $('<div>').addClass('city-name');
		self.wnd.$.find('.left-column-header').html(goldTxt(_t('loc')));
		self.wnd.$.find('.right-column-header').append($cityName);

		self.wnd.$.find('.header-wrapper').html(goldTxt(_t('kcs_set')));


		var $cityBufferWrapper = $('<div>').addClass('city-buffer-wrapper');
		var $cityBuffer = $('<div>').html(goldTxt('Ladowanie mapy')).addClass('city-buffer');
		$cityBufferWrapper.append($cityBuffer);
		self.wnd.$.find('.right-column').append($cityBufferWrapper);

		self.wnd.$.find('.city-buffer');

		var $btn = drawSIButton(_t('set_tp')).addClass('set-tp-stone black');
		self.wnd.$.find('.bottom-part').append($btn);

		$btn.click(function () {
			const [ x, y ] = activeCoordsChoice;

			_g('moveitem&st=2&id=' + self.itemId + '&town_id=' + activeIdMapChoice + '&town_x=' + x + '&town_y=' + y, function () {
				self.close();
			});
		});
	};

	this.cordEvents = function ($cord, idMap, idTp) {
		$cord.hover(function () {
			self.wnd.$.find('.cord-' + idTp).addClass('hover');
		}, function () {
			self.wnd.$.find('.cord-' + idTp).removeClass('hover');
		});
		$cord.click(function (e) {
			self.wnd.$.find('.cords').removeClass('active');
			self.wnd.$.find('.cord-' + idTp).addClass('active');

			self.wnd.$.find('.one-item-on-divide-list').removeClass('active');
			self.wnd.$.find('.city-' + idMap).find('.cord-list-' + idTp).addClass('active');
			self.setChoice(idMap, $cord.data('coords'));
			e.stopPropagation();
		});
		$(document).on('click', '.cord-'+idTp+'.map-'+idMap, function() {
			self.wnd.$.find('.city-'+idMap+' .cord-list-'+idTp).click();
		});
	};

	this.resetChoice = function () {
		activeIdMapChoice = null;
		activeCoordsChoice = null;
		self.wnd.$.find('.set-tp-stone').addClass('black');
	};

	this.setChoice = function (idMap, coords) {
		activeIdMapChoice = idMap;
		activeCoordsChoice = coords;
		self.wnd.$.find('.set-tp-stone').removeClass('black');
	};

	this.showHideBuffer = function (show) {
		self.wnd.$.find('.city-buffer-wrapper').css('display', show ? 'block' : 'none');
	};

	this.onClickEvent = (id) => {
		const $city = this.wnd.$.find(`.city-${id}`)
		if ($city.hasClass('active')) {
			$city.removeClass('active');
			return;
		}
		_g('moveitem&st=1&id=' + this.itemId + '&locationId=' + id);
	};

	this.openCurrentLocation = () => {
		const currentMapId = map.id;
		if (isset(this.data[currentMapId])) {
			this.onClickEvent(currentMapId);
			const scrollPos = this.checkCityTabPosition(currentMapId);
			$('.left-column .scroll-pane', self.wnd.$).scrollTop(scrollPos);
		}
	};

	this.checkCityTabPosition = (id) => self.wnd.$.find(`.left-scroll .city-${id}`).position().top;

	this.showLocation = (data) => {
		const $group = self.wnd.$.find(`.left-column .city-${data.id}`);
		this.createCords($group, data.coords, data.id)
		this.activeGeoupItem($group)

		//var i = new Image();
		//i.src = (CFG.mpath + data.file);

		if (loadedMaps.indexOf(data.name) < 0) self.showHideBuffer(true);
		self.wnd.$.find('.one-item-on-divide-list').removeClass('active');
		self.resetChoice();

		//i.onload = function () {
		ImgLoader.onload(
			CFG.mpath + data.file,
			null,
			function () {
				var $positioner = self.wnd.$.find('.mini-map-positioner').empty();
				self.setMapBackground(data, this.width, this.height, $positioner);

				loadedMaps.push(data.name);

				for (var c = 0; c < data.coords.length; c++) {
					var cords = data.coords[c];
					var $cords = $('<div>').addClass('cords cord-' + c + ' map-' + data.id);
					$cords.tip(cords[0] + ', ' + cords[1]);
					$positioner.append($cords);
					self.setCords($cords, cords);
				}
				self.showHideBuffer(false);
			}
		);
	};

	this.createCords = ($oneCity, allCords, idMap) => {
		var $cords = $oneCity.find('.group-list');
		$cords.html('');

		for (var idCord = 0; idCord <allCords.length; idCord++) {
			var cords = allCords[idCord];
			var $oneCord = self.getOneItemOnDivideList().addClass('cord-list-' + idCord);
			$oneCord.find('.name').html(cords[0] + ', ' + cords[1]);
			$oneCord.data('coords', cords);
			$cords.append($oneCord);
			this.cordEvents($oneCord, idMap, idCord);
		}
	}

	this.setMapBackground = function (data, w, h, $positioner) {
		var x = w / 32;
		var y = h / 32;
		var size = {x: x, y: y };

		self.wnd.$.find('.city-name').html(goldTxt(data.name));
		self.setScale(size);

		$positioner.css({
			'background'			: 'url(' + CFG.mpath + data.file + ') no-repeat',
			'width'						: '100%',
			'height'					: '100%',
			'background-size'	: 'contain'
		});

	};

	this.activeGeoupItem = function ($clicked) {
		var active = $clicked.hasClass('active');
		self.wnd.$.find('.divide-list-group').removeClass('active');
		if (!active) $clicked.addClass('active');
	};

	this.setCords = function ($obj, cords) {
		$obj.css('left', (self.scale * cords[0]) + 'px');
		$obj.css('top', (self.scale * cords[1]) + 'px');
	};

	this.setScale = function (size) {
		var miniMapWrapper = self.wnd.$.find('.mini-map-wrapper');
		var ratio = miniMapWrapper.width() / miniMapWrapper.height();
		self.scale = size.x > size.y * ratio? miniMapWrapper.width() / size.x : miniMapWrapper.height() / size.y;
	};

	this.close = function () {
		self.wnd.$.remove();
		delete this.data;
		delete (self.wnd);
		g.tpScroll = false;
		delete(self);
	};

	this.getDividePanel = function () {
		return $(
			'<div class="divide-panel tp-scroll">' +
			'  <div class="header-wrapper"></div>' +
			'	 <div class="left-column">' +
			'    <div class="left-column-header"></div>' +
			'    <div class="search-item-wrapper">' +
			'      <input class="search-item"/>' +
			'    </div>' +
			'    <div class="left-scroll scroll-wrapper classic-bar">' +
			'      <div class="scroll-pane"></div>' +
			'    </div>' +
			'  </div>' +
			'  <div class="right-column">' +
			'    <div class="right-column-header"></div>' +
			'    <div class="right-scroll scroll-wrapper classic-bar">' +
			'      <div class="scroll-pane"></div>' +
			'    </div>' +
			'  </div>' +
			'  <div class="bottom-part"></div>' +
			'  <div class="closebut"></div>' +
			'</div>'
		);
	};

	this.getTplDivideGroup = function () {
		return $(
			'<div class="divide-list-group">' +
			'  <div class="card-graphic"></div>' +
			'  <div class="label"></div>' +
			'  <div class="direction"></div>' +
			'  <div class="group-list"></div>' +
			'</div>'
		);
	};

	this.getOneItemOnDivideList = function () {
		return $(
		'<div class="one-item-on-divide-list">' +
		'  <div class="name-wrapper">' +
		'    <div class="name"></div>' +
		'  </div>' +
		'</div>'
		);
	};

	this.init();

};
