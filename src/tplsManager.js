function isset(x) {
	return typeof(x) != 'undefined';
}
function tplsManager() {
	var self = this;
	var tpls = {};
	var locationCallbacks = {};
	var fetchPackageController = {};

	this.updateDATA = function (d) {
		//for (var i in d) {
		//	if (isset(tpls[i])) this.deleteTpl(i);
		//	this.newTpl(i, d[i]);
		//}
		let idFetchPackage = self.addAndGetIdToFetchPackageController(d);
		for (var i in d) {
			if (this.checkExist(i, d[i])) this.deleteTpl(d[i].loc, i);
			this.newTpl(i, d[i], idFetchPackage, true);
		}
		this.checkClearFetchPackageController(idFetchPackage);
	};

	this.addAndGetIdToFetchPackageController = function (d) {
		let id = 0;

		while (fetchPackageController[id]) {
			id++;
		}

		fetchPackageController[id] = {};

		for (let k in d) {
			let loc = d[k].loc;
			if (!loc) continue;
			if (!isset(fetchPackageController[id][loc])) fetchPackageController[id][loc] = 0;
			fetchPackageController[id][loc]++;
		}

		return id;
	};

	this.checkClearFetchPackageController = (idFetchPackage) => {
		if (!fetchPackageController[idFetchPackage]) return;

		if (!Object.keys(fetchPackageController[idFetchPackage]).length) delete fetchPackageController[idFetchPackage]
	};

	this.checkExist = function (i, obj) {
			var loc = obj.loc;
			var oneLoc = tpls[loc];
			if (isset(oneLoc) && isset(oneLoc[i])) return oneLoc[i];

		return false;
	};

	this.getTplByIdAndLoc = function (id, locTpl) {			// locTpl - when id tpl located in more loc

		if (locTpl) {
			let allInOneLocTpls = tpls[locTpl];
			for (let tplId in allInOneLocTpls) {
				if (tplId == id) return tpls[locTpl][tplId];
			}
			return null
		}
	};

	this.getClone = function (itemId, tplLoc) {

		let i = self.getTplByIdAndLoc(itemId, tplLoc);	// This is not good solution, but... Sometimes tpl have the same tplId, then you should use argument loc too :(

		return i.$.clone(true);
	};

	this.newTpl = function (i, d, idFetchPackage, getNow) {
		var $item = createItem(d, itemTip(d));
		// var $item = $('<div>').attr({
		// 	'tip': itemTip(d),
		// 	'ctip': "t_item"
		// }).addClass('item');

		var hClass = [];
		var $bck = $('<img>').attr('src', CFG.ipath + d.icon);

		addHClassesToHClass(d, hClass);

		if (hClass.length) {
			//var cl = hClass.join(' ') + ' ' + (hero.opt & 4096 ? 'nodisp' : '');
			let showItemsRankOn = g.settingsOptions.isShowItemsRankOn();
			var cl = hClass.join(' ') + ' ' + getClassOfItemRank();
			var $h = $('<div>').addClass('itemHighlighter ' + cl);
			$item.append($h);
		}

		// var stats = g.tplsManager.parseTplStat(d.stat);
		var stats = parseItemStat(d.stat);
		var isAmount = isset(stats['amount']);

		if (isAmount) updateItemAmount($item, parseInt(stats['amount']));

		$item.append($bck);
		if (!isset(tpls[d.loc])) tpls[d.loc] = {};
		tpls[d.loc][i] = $.extend(d, {$:$item});
		self.newTplInLocation(d.loc, tpls[d.loc][i], idFetchPackage, getNow);
	};

	this.deleteTpl = function (loc, i) {
		delete(tpls[loc][i]);
	};

	this.newTplInLocation = function (loc, tpl, idFetchPackage) {
		let finishFetch = self.checkFetchFinish(idFetchPackage, tpl.loc);
		if (isset(locationCallbacks[loc])) {
			for (var i in locationCallbacks[loc]) {
				self.delayLocationCallbacks(tpl, loc, i, finishFetch);
			}
		}
	};

	this.decreaseFetchPackageController  = function (idFetchPackage, loc) {
		fetchPackageController[idFetchPackage][loc]--;

		if (fetchPackageController[idFetchPackage][loc] < 1) delete fetchPackageController[idFetchPackage][loc];

		this.checkClearFetchPackageController(idFetchPackage);
	};

	this.checkClearFetchPackageController = (idFetchPackage) => {
		if (!fetchPackageController[idFetchPackage]) return;

		if (!Object.keys(fetchPackageController[idFetchPackage]).length) delete fetchPackageController[idFetchPackage]
	};

	this.checkFetchFinish = function (idFetchPackage, loc) {
		self.decreaseFetchPackageController(idFetchPackage, loc);

		if (fetchPackageController[idFetchPackage]) {
			return !isset(fetchPackageController[idFetchPackage][loc]);
		}

		return true;
	};

	this.deleteMessItemsByLoc = function (loc) {
		//for (var k in tpls) {
		//	if (tpls[k].loc == loc) delete tpls[k];
		//}

		if (isset(tpls[loc])) {
			var obj = tpls[loc];
			for (var k in obj) {
				delete obj[k]
			}
		}
	};

	this.delayLocationCallbacks = function (tpl, loc, i, finish) {
		var locCallback = locationCallbacks[loc][i];
		locCallback(tpl, finish);
	};

	this.fetchLocationTpls = function (loc) {
		//var ret = [];
		//for (var i in tpls) {
		//	if (tpls[i].loc == loc) ret.push(tpls[i]);
		//}
		//
		//return ret;

		var ret = [];
		if (isset(tpls[loc])) {
			var objcs = tpls[loc];
			for (var i in objcs) {
					ret.push(objcs[i]);
				}
		}

		return ret;
	};

	this.addCallback = function (loc, c) {
		if (!isset(locationCallbacks[loc])) locationCallbacks[loc] = [];
		locationCallbacks[loc].push(c);
	};

	this.removeCallback = function (loc, c) {
		if (!isset(locationCallbacks[loc])) return;
		var idx = locationCallbacks[loc].indexOf(c);
		if (idx >= 0) {
			locationCallbacks[loc].splice(idx, 1);
		}
	};

	this.fetch = function (locations, f) {
		var locations = locations.split(',');
		if (typeof(f) != 'function') return;

		for (var i = 0; i < locations.length; i++) {
			self.addCallback(locations[i], f);
			var loc_tpls = self.fetchLocationTpls(locations[i]);
			let lastIndex = loc_tpls.length - 1;
			for (var k in loc_tpls) {
				let finish = lastIndex == k;
				f(loc_tpls[k], finish);
			}
		}
	};

	// this.parseTplStat = function (s) {
	// 	s = s.split(';');
	// 	var obj = {};
	// 	for (var i = 0; i < s.length; i++) {
	// 		var pair = s[i].split('=');
	// 		obj[pair[0]] = isset(pair[1]) ? pair[1] : null;
	// 	}
	// 	return obj;
	// };

	this.changeItemAmount = function (item, $item, serverAmount, options = { refreshPrice: false, recalcPrice: false }) {
		var newVal;
		var $cloneAmount = $item.find('small');
		var stat = parseItemStat(item.stat);

		if ($cloneAmount.length > 0 && $cloneAmount.html() !== '') {
			//var v = $cloneAmount.html() == '' ? 1 : parseInt($cloneAmount.html());
			var v = 1;
			if (isset(stat['amount'])) v = stat['amount'];
			newVal = parseInt(v) * serverAmount;
			$cloneAmount.html(newVal);
      // self.changeAMountInTip(stat, $item, newVal);
      if (serverAmount == 1) {
        return;
      }
      changeAmountInTip(item, $item, newVal, { refreshPrice: options.refreshPrice, recalcPrice: options.recalcPrice, serverAmount });

		} else {
			if (serverAmount == 1) return;
			var $newAmount = $('<small>');
			newVal = serverAmount;
			$newAmount.html(newVal);
			$item.append($newAmount);
      // self.changeAMountInTip(stat, $item, newVal);
      changeAmountInTip(item, $item, newVal, { refreshPrice: options.refreshPrice, recalcPrice: options.recalcPrice, serverAmount });
		}
	};

	this.changeAMountInTip = function (stat, $item, newVal) {
		var tip = $item.attr('tip');
		var $tip = $(tip);
		//var stat = parseItemStat(item.stat);
		var cursedFlag = isset(stat['cursed']);
		var strTab = [
			_t('cursed_amount %val%', {'%val%':newVal}),
			_t('amount %val% %split%', {'%val%':newVal,'%split%':''})
		];
		var amountStr = strTab[cursedFlag ? 0 : 1];

		var $newAmount = $('<span>').html(amountStr).addClass('amount-text');
		var $newBr = $('<br>');
		var add = false;
		var typeIndex = 0;
		var amountIndex = 0;

		var str = '';
		for (var i = 0; i < $tip.length; i++) {
			if ($($tip[i]).hasClass('type-text')) typeIndex = i;
			if ($($tip[i]).hasClass('amount-text')) {
				$tip[i] = null;
				$tip[i] = $newAmount[0];
				amountIndex = i;
				add = true;
			}
		}

		if (!add) {
			$tip.splice(typeIndex + 2, 0, $newAmount[0]);
			$tip.splice(typeIndex + 3, 0, $newBr[0]);
		}

		for (var i = 0; i < $tip.length; i++) {
			str += isset($tip[i].outerHTML) ? $tip[i].outerHTML : $tip[i].data;
		}

		$item.tip(str);
	};

  const changeAmountInTip = function (item, $item, newVal, { recalcPrice = false, refreshPrice = false, serverAmount }) {
    newVal = formNumberToNumbersGroup(newVal);
    // var tip = $item.getTipData();
    const tip = getTipContent(item);
    var $tip = $('<div>').append(tip);

    $tip.find('.amount').remove();
    $tip.find('.item').append($('<div>').html(newVal).addClass('amount'));

    if (recalcPrice || refreshPrice) {
      let newPrice;
      if (refreshPrice) newPrice = item.pr * 1;
      if (recalcPrice) newPrice = item.pr * serverAmount;
      $tip.find('.value-item .val').text(round(newPrice, (newPrice < 10000 ? 10 : 2)));
    }

    var $amountText = $tip.find('.amount-text');

    if ($amountText.length > 0) $amountText.html(newVal);
    else {
      // var cursedFlag = isset(item._cachedStats.cursed);
      var cursedFlag = isset(stat['cursed']);
      // var cursedFlag = item.issetCursedStat();
      //var valAndTag = '<span class="amount-text">' + newVal + '</span>';

      var strTab = [
        _t('cursed_amount %val%', {'%val%':''}),
        _t('amount %val% %split%', {'%val%':'','%split%':''})
      ];
      var amountStr = strTab[cursedFlag ? 0 : 1];
      var $section = $tip.siblings('.s-4');
      var $wrapper = $('<span>').html(amountStr);
      var dmgWrapper = $('<span>').addClass('damage');
      $amountText = $('<span>').html(newVal).addClass('amount-text');
      dmgWrapper.append($amountText);
      $wrapper.append(dmgWrapper);


      if ($section.length > 0) $section.append($wrapper);
      else {
        $section = $('<div>').addClass('item-tip-section s-4');
        $section.append($wrapper);
        const allSections = $tip.children();
        allSections.push($section[0]);
        allSections.sort((a, b) => {
          const nA = $(a).attr('class').toLowerCase();
          const nB = $(b).attr('class').toLowerCase();
          return (nA < nB) ? -1 : (nA > nB) ? 1 : 0;
        });
        $tip = $('<div>').html(allSections);
      }
    }

    // item.setTip($item, $tip[0].innerHTML, {forceNewId:true});

    $item.tip($tip[0].innerHTML);
  };

  const getTipContent = (item, cmpStats = null) => {
    return MargoTipsParser.getTip(item);
  }

	this.onClear = function () {
		//TODO: remove ground items
	};

	this.getItems = function () {
		return tpls;
	};

	this.test = function () {
		return {
			tpls: tpls,
			callbacks: locationCallbacks
		};

	}
};
