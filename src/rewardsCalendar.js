function rewardsCalendar () {
	var self = this;
	var content;
	var oneDayTime = 3600 * 24;
	var halfDayTime = 3600 * 12;
	var nowTs = null;
	var ts = null;
	var setShowMonth = null;
	var setShowYear = null;
	var existItemsInThisMonth = false;
	this.rewardDays = null;
	this.rewardItems = {};
	this.init = function () {
		this.initWindow();
		this.setActualTs();
		this.initHeaderDays();
		this.initPrevNextMonth();
		this.initFetch();
		this.setPrevActualNextMonthAndYear();
	};

	this.setActualTs = function () {
		nowTs = self.getTodayWithoutMinutes(getWorldTime());
		ts = nowTs;
		ts = self.getFirstDayOfMonthTs(ts);
		setShowMonth = getStartMonth(ts);
		setShowYear = getStartYear(ts);
	};

	this.initPrevNextMonth = function () {
		self.wnd.$.find('.prev-month, .click-prev').click(function () {
			var newShowMonth = setShowMonth - 1;
			if (newShowMonth < 0) {
				setShowYear--;
				setShowMonth = 11;
			} else setShowMonth = newShowMonth;
			self.updateMonthAndDaysAfterChangeMonth()
		});
		self.wnd.$.find('.next-month, .click-next').click(function () {
			var newShowMonth = setShowMonth + 1;
			if (newShowMonth > 11) {
				setShowYear++;
				setShowMonth = 0;
			} else setShowMonth = newShowMonth;
			self.updateMonthAndDaysAfterChangeMonth()
		});
	};

	this.updateMonthAndDaysAfterChangeMonth = function () {
		var date = new Date(setShowYear, setShowMonth);
		ts = date.getTime() / 1000;
		self.setPrevActualNextMonthAndYear();
		self.setOneMonthDays();
		self.updateBackground()
	};

	this.initHeaderDays = function () {
		var $wrapper = self.wnd.$.find('.calendar-days-header');
		for (var i = 0; i < 7; i++) {
			var $day = $('<div>').html(_t('days' + i)).addClass('day-header day-' + i);
			$wrapper.append($day);
		}
	};

	this.setPrevActualNextMonthAndYear = function () {
		var indexMonth = getStartMonth(ts);
		var prev = indexMonth - 1 < 0 ? 11 : indexMonth - 1;
		var next = indexMonth + 1 > 11 ? 0 : indexMonth + 1;
		self.wnd.$.find('.prev-month').html(_t('month' + prev));
		self.wnd.$.find('.actual-month').html(_t('month' + indexMonth));
		self.wnd.$.find('.next-month').html(_t('month' + next));
		self.wnd.$.find('.calendar-year').html(getStartYear(ts));
	};

	this.setOneMonthDays = function () {
		self.wnd.$.find('.calendar-days-content').empty();
		existItemsInThisMonth = false;
		var firstDayOfMonthTs  = self.getFirstDayOfMonthTs(ts);

		var weekDay = getStartWeekDay(firstDayOfMonthTs);
		var helpTs = firstDayOfMonthTs;
		while(weekDay != 1) {
			helpTs = self.getPreviousDayTs(helpTs);
			var dayNr = getStartDay(helpTs);
			var eventName = self.checkIfThisDayEventExist(helpTs);
			self.createDay(helpTs, eventName, dayNr, 'not', true);
			weekDay = getStartWeekDay(helpTs);
		}

		var newTs = firstDayOfMonthTs;
		var oldTs = firstDayOfMonthTs;

		while(getStartDay(oldTs) <= getStartDay(newTs)) {
			oldTs = newTs;
			newTs = self.getNextDayTs(oldTs);
			var eventName = self.checkIfThisDayEventExist(oldTs);
			var dayNr = getStartDay(oldTs);
			self.createDay(oldTs, eventName, dayNr, 'current');
		}

		while(getStartWeekDay(newTs) != 1) {
			oldTs = newTs;
			newTs = self.getNextDayTs(oldTs);
			var dayNr = getStartDay(oldTs);
			var eventName = self.checkIfThisDayEventExist(oldTs);
			self.createDay(oldTs, eventName, dayNr, 'not');
		}
	};

	this.getTodayWithoutMinutes = function (newTs) {
		var day  = getStartDay(newTs);
		var month= getStartMonth(newTs);
		var year = getStartYear(newTs);

		var d = new Date(year, month, day);
		return d.getTime() / 1000;
	};

	this.getPreviousDayTs = function (helpTs) {
		var newTs = helpTs - halfDayTime;
		var day  = getStartDay(newTs);
		var month= getStartMonth(newTs);
		var year = getStartYear(newTs);

		var d = new Date(year, month, day);
		return d.getTime() / 1000;
	};

	this.getNextDayTs = function (helpTs) {
		var newTs = helpTs + 3 * halfDayTime;
		var day  = getStartDay(newTs);
		var month= getStartMonth(newTs);
		var year = getStartYear(newTs);

		var d = new Date(year, month, day);
		return d.getTime() / 1000;
	};

	//this.getWeekDayOfFirstDayOfMonth = function (checkTs) {
	//	var d = new Date(getStartYear(checkTs), getStartMonth(checkTs));
	//	return getStartWeekDay(d.getTime() / 1000);
	//};

	this.getFirstDayOfMonthTs = function (checkTs) {
		var d = new Date(getStartYear(checkTs), getStartMonth(checkTs));
		return d.getTime() / 1000;
	};

	this.createDay = function (dayTs, eventName, dayNr, cl, prepend) {
		var $dayWrapper = $('<div>').addClass('day-wrapper');
		var $day = $('<div>').addClass('day ' + cl);
		var $dayNr = $('<div>').html(dayNr).addClass('day-nr');
		$dayWrapper.append($day);
		$day.append($dayNr);
		if (eventName) {
			existItemsInThisMonth = true;
			var $eventName = $('<div>').html(parseBasicBB(eventName)).addClass('event-name');
			$day.prepend($eventName);
			var dayRewardData = self.getRewardDataByTs(dayTs);
			var $reward = $('<div>').addClass('reward');
			var $itemWrapper = $('<div>').addClass('item-wrapper');
			$reward.append($itemWrapper);
			$day.append($reward);

			if (isset(dayRewardData)) {
				const { tplId, quantity, isOpened } = dayRewardData;
				if (isOpened) {
					$reward.addClass('is-open');
				} else {
					$reward.addClass('can-open');
					$itemWrapper.addClass('lock');
					$reward.on('click', function () {
						_g('rewards_calendar&action=open&day_no=' +(parseInt(self.getDayIndex(dayTs)) + 1));
					});
				}
				if (tplId) {
					$reward.addClass('visible-item');
					$reward.addClass('reward-tpl-' + tplId);
					$reward.attr('data-amount', quantity);
					self.addItem(tplId, $reward);
				}
			}
		}
		if (dayTs == nowTs) $day.addClass('today');
		if (prepend) self.wnd.$.find('.calendar-days-content').prepend($dayWrapper);
		else self.wnd.$.find('.calendar-days-content').append($dayWrapper);
		if (eventName) {
			var $eventName = $dayWrapper.find('.event-name');
			self.setTipWhenNameToLong($eventName, eventName);
		}
	};

	this.getRewardDataByTs = function (dayTs) {
		var dayIndex = self.getDayIndex(dayTs);
		return this.data.days[dayIndex];
	};

	this.getDayIndex = function (dayTs) {
		return this.rewardDays[dayTs];
	};

	this.initWindow = function () {
		//var title = _t('event_calendar', null, 'event_calendar');
		content = self.getRewardsCalendarHtml();
		//content.find('.news-panel-label').html(title);
		this.wnd = {};
		this.wnd.$ = content;
		var $wrapper = $('#calendar-wrapper');
		$wrapper.append(this.wnd.$);
		this.wnd.$.find('.closebut').click(function () {
			self.close();
		});
		$wrapper.css('display', 'block');
		$('#new_event_calendar').removeClass('notif');
	};

	this.initScroll = function () {
		$('.scroll-wrapper', content).addScrollBar({track: true});
	};

	this.updateScroll = function () {
		$('.scroll-wrapper', content).trigger('update');
	};

	this.initFetch = function () {
		g.tplsManager.fetch('v', self.newRewardCalendarItem);
	};

	this.newRewardCalendarItem = function (i) {
		self.rewardItems[i.id] = i;
		self.addItem(i.id);
	};

	this.addItem = function (id, $wrapper) {
		var item = self.rewardItems[id];
		if (!item) return;
		var $rewardWrapper = $wrapper ? $wrapper : self.wnd.$.find('.reward-tpl-' + id);
		if ($rewardWrapper.length < 1) return;
		var $clone = item.$.clone();
		var serwerAmount = $rewardWrapper.attr('data-amount');
		g.tplsManager.changeItemAmount(item, $clone, serwerAmount);
		$clone.attr('data-tip-type', item.$.data('tipType'));
		$clone.attr('data-item-type', item.$.data('itemType'));
		$rewardWrapper.find('.item-wrapper').empty().append($clone);
	};

	this.update = function (data) {
		//var data = self.getData();
		this.updateData(data);
		this.updateDaysTs();
		this.setOneMonthDays();
		this.updateBackground();
	};

	this.updateBackground = function () {
		var bck = existItemsInThisMonth ? cdnUrl+'/obrazki/calendar' + self.data.background_img.substr(1)  : `img/calendar-background.png?v=${_CLIENTVER}`;
		var icons = existItemsInThisMonth ? cdnUrl+'/obrazki/calendar' + self.data.day_img.substr(1) : `img/calendar-windows-1.png?v=${_CLIENTVER}`;

		var selector =
			'.day:not(.today), ' +
			'.day:not(.today)>.event-name,' +
			'.day:not(.today)>.reward.is-open,' +
			'.day:not(.today)>.reward.can-open';
		self.wnd.$.find('.calendar-background').css('background-image', 'url(' + bck + ')');
		self.wnd.$.find(selector).css('background-image', 'url('+ icons + ')');
	};

	this.updateDaysTs = function () {
		this.rewardDays = {};
		var length = Object.keys(this.data.days).length;
		var dayTs = this.data.start_ts;
		for (var i = 0; i < length; i++) {
			this.rewardDays[dayTs] = i;
			dayTs = self.getNextDayTs(dayTs);
		}
	};

	this.checkIfThisDayEventExist = function (dayTs) {
		if (self.data.start_ts <= dayTs && dayTs < self.data.end_ts) {
			if (self.getRewardDataByTs(dayTs)) return self.data.name;
		}
		return false;
	};

	this.updateData = function (data) {
		this.data = {};
		this.data = data;
		this.data.start_ts =  self.getTodayWithoutMinutes(this.data.start_ts)
	};

	this.getRewardsCalendarHtml = function () {
		return $(
		'<div class="rewards-calendar">' +
			'<div class="calendar-background"></div>' +
			'<div class="calendar-year"></div>' +
			'<div class="calendar-month-header">' +
			'<div class="month-wrapper">' +
			'<div class="prev-month month-item"></div>' +
			'<div class="click-prev month-item direction"><</div>' +
			'<div class="actual-month"></div>' +
			'<div class="click-next month-item direction">></div>' +
			'<div class="next-month month-item"></div>' +
			'</div>' +
			'</div>' +
			'<div class="calendar-days-header"></div>' +
			'<div class="calendar-days-content"></div>' +
			'<div class="closebut"></div>' +
			'</div>');
	};

	this.getData = function () {
		return  {
			"start_ts": self.getTodayWithoutMinutes(1536656299),
			//"end_ts": 1540025899,
			"end_ts": 1541116800,
			"name_event": 'advent',
			"background_img": "advent-background.png",
			"day_img": "advent-windows.png",
			"max_closed": 1,
			"extra_opening":
			{
				"price": 13,
				"max": 2,
				"cur": 0
			},
			"days": [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[1,1]]
		};
	};

	this.close = function () {
		self.wnd.$.remove();
		g.tplsManager.removeCallback('v', self.newRewardCalendarItem);
		g.tplsManager.deleteMessItemsByLoc('v');
		delete (self.wnd);
		g.rewardsCalendar = false;
		delete(self);
		$('#calendar-wrapper').css('display', 'none');
	};

	this.setTipWhenNameToLong = function ($el, tip) {
		if ($el[0].scrollWidth >  $el.innerWidth()) $el.attr('tip', parseBasicBB(tip));
		else $el.removeAttr('tip');
	};

	this.init();

}
