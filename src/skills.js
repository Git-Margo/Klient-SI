function skills() {
	var self = this;
	var haveCost = true;
	var weapon = {
		'sw': ["weapon"],
		'1h': [1],
		'2h': [2],
		'bs': [3],
		'dis': [4],
		'fire': ['fire'],
		'light': ['light'],
		'frost': ['frost'],
		'sh': [14],
		'orb': [2],
		'h': [5],
		'poison': ['poison'],
		'phydis': ['phydis'],
		'wound': ['wound']
	};
	this.isInit = false;
	this.skills = [];
	this.allSkillsData = [];
	var tabs = [];
	var skills_el = [];

	this.init = function () {
		self.isInit = true;
		var $b = drawSIButton(_t('edit'));
		$('#skills_footer').find('.bm-edit-button').append($b);
		$('#skills_footer').find('.info-bm-icon').tip("Funkcja pozwalajÄca na ustalanie kolejnoÅci uÅ¼ywanych umiejÄtnoÅci w walce automatycznej");
		$b.click(function () {
			g.bmEditor.toggleShow();
		});
	};

	this.getElement = function (id) {
		return skills_el[id];
	};
	this.changeSet = function () {
		hero.cur_skill_set++;
		if(hero.cur_skill_set > 3)
			hero.cur_skill_set = 1;
		_g('skills&set=' + hero.cur_skill_set, function () {
		//_g('skills&set=' + (hero.opt & 1024 ? '1' : '2'), function () {
			if ($('#skills').is(':visible')) {
				self.show();
			}
		});
	};
	this.show = function () {
		tabs = [];
		self.skills = [];
		skills_el = [];
		_g('skillshop');
		$("#skills_body").empty();
		$("#skills_title").find('.resetSkillPoints').remove();
		self.createResetButton();
	};
	this.createResetButton = function () {
		var $reset = drawSIButton(_t('reset_btn', null, 'skills'));
		$reset.addClass('resetSkillPoints');
		$('#skills_title').append($reset);
		$reset.click(function () {
			_g('skills&reset=1');
		});
	};
	this.hide = function () {
		//g.bmEditor.disable();
		if (g.bmEditor.visible) g.bmEditor.hidePanel();
		$('#skills').fadeOut('fast');
		$('#skills_title .skillLearnInfo').fadeOut('fast');
		$("#skills_body").empty();
		self.skills = [];
		g.lock.remove('skills');
	};
	this.parseStat = function (data) {
		var obj = {};
		var t = [];
		if (isset(data) && data.length > 0) {
			t = data.split(";");
		}
		for (var i = 0; i < t.length; i++) {
			var str = t[i].split("=");
			obj[str[0]] = str[1];
		}
		return obj;
	};

	this.updateSelectedSkills = function (data) {
		self.selectedSkills = [];
		$('#skills').find('.set-active-state').removeClass('active');
		var count = 0;
		for (var i = 0; i < data.length; i++) {
			var id = data[i];
			if (parseInt(data[i]) > 0) count++;
			self.selectedSkills.push(data[i]);
			$('.skill-icon-' + id).parent().parent().parent().find('.set-active-state').addClass('active');
		}
		$('#skillInBattleCount').html('(' + count + '/14)').attr('tip', _t('use_battle_skill'));;
	};

	this.updateFreeSkills = function (time) {
		var $timer = $('#skills').find('.freeSkillsLabel');
		if (time < 1) return $timer.css('display', 'none');
		$timer.css('display', 'block');
		var t = time - unix_time();
		$timer.html(goldTxt(_t('free_skills') + self.getSecondLeft(t, true)));
		if (self.timeInterval) self.clearTimeInterval();
		self.timeInterval = setInterval(function () {
			$timer.html(goldTxt(_t('free_skills') + self.getSecondLeft(t, true)));
			if (t < 1 && self.timeInterval) {
				self.clearTimeInterval();
				$timer.css('display', 'none');
				_g('skillshop');
			}
			t--;
		}, 1000);
	};
	this.getSecondLeft = function (time, shortForm) {
		var m = Math.floor(time / 60);
		var h = Math.floor(m / 60);
		var d = Math.floor(h / 24);

		var secondLeft = (time - m * 60);
		var minutesLeft = m - h * 60;
		var hoursLeft = h - d * 24;

		if (shortForm) {
			if (d == 0 && h == 0) return minutesLeft + 'm : ' + secondLeft + 's';
			if (d == 0)           return hoursLeft + 'h : ' + minutesLeft + 'm';
			return d + 'd : ' + hoursLeft + 'h';
		}
		return d + 'd : ' + hoursLeft + 'h : ' + minutesLeft + 'm : ' + secondLeft + 's';
	};
	this.clearTimeInterval = function () {
		clearInterval(self.timeInterval);
		self.timeInterval = null;
	};

	// this.new_skill = function (data, index) {
	// 	var attr = data[index + 2];
	// 	var ilvl = data[index + 7].split("/");
	// 	var kind = data[index + 9].split("|");
	// 	var obj = {
	// 		id: data[index], //id
	// 		name: data[index + 1], //name
	// 		attr: attr, //unk???
	// 		grp: data[index + 3], //grouped by required lvl
	// 		xy: data[index + 4], //index position from left in group
	// 		desc: data[index + 5], //description
	// 		req: self.parseStat(data[index + 6]), //current required
	// 		stats: self.parseStat(data[index + 8]), //current stats
	// 		next_req: self.parseStat(kind[0]), //next required
	// 		next_stat: self.parseStat(kind[1]), //next stats
	// 		clvl: parseInt(ilvl[0]), //current skill lvl
	// 		mlvl: parseInt(ilvl[1]), //max skill lvl
	// 		type: attr & 1, // type (passive,active)
	// 		changed: false,
	// 		correct: true,
	// 		ns: [data[index + 6], data[index + 8], kind[0], kind[1]] //non splited
	// 	};

	this.new_skill = function (id, skill, { isLearnable, lvl }) {
		const { name, attr, xy, desc, pos, maxLvl, reqs, stats } = skill;
		// var ilvl = data[index + 7].split("/");
		const currentStatsIndex = lvl > 0 ? lvl - 1 : lvl;
		const kind = isLearnable ? [reqs, stats[lvl]] : ['unav'];
		const _parsedStats = lvl > 0 ? self.parseStat(stats[currentStatsIndex]) : '';
		// var kind = [];
		var obj = {
			id,
			name,
			attr, //unk???
			grp: pos, //grouped by required lvl
			xy, //index position from left in group
			desc, //description
			req: self.parseStat(reqs), //current required
			stats: _parsedStats, //current stats
			next_req: self.parseStat(kind[0]), //next required
			next_stat: self.parseStat(kind[1]), //next stats
			clvl: lvl, //current skill lvl
			mlvl: maxLvl, //max skill lvl
			type: attr & 1, // type (passive,active)
			changed: false,
			correct: true,
			ns: [reqs, stats[currentStatsIndex], kind[0], kind[1]] //non splited
		};

		if(!isset(self.skills[obj.id])){
			obj.changed = true;
		}else{
			var c = self.skills[obj.id];
			if(c.ns[0] != obj.ns[0] || c.ns[1] != obj.ns[1] || c.ns[2] != obj.ns[2] || c.ns[3] != obj.ns[3]){
				obj.changed = true;
			}
		}
		self.skills[obj.id] = obj;
		if (!isset(tabs[obj.grp])) {
			tabs[obj.grp] = {
				el: null,
				head: null,
				list: []
			};
		}
		var bool = (!isset(obj.req.reqp) || obj.req.reqp.indexOf(hero.prof) != -1);
		if(tabs[obj.grp].list.indexOf(obj.id) == -1 && bool){
			tabs[obj.grp].list.push(obj.id);
		}
	};
	this.skillTip = function(obj) {
		var text = "";
		text += "<b>"+obj.name+"</b><br>";
		text += "<div class='skill_section'>";
		var req_str = _t("lower_requirements", null, "skills");
		text += "<div class='skill_sec_header'>"+req_str+"</div>";
		//text += "<u>Wymagania:</u><br>";
		var t = self.statToText($.extend(obj.req, obj.next_req));
		if(t.length > 0){
			text += t;
		}else{
			text += _t("none");
		}
		text += "</div>";
		text += "<div class='skill_desc skill_section'>"+obj.desc+"</div>";
		t = self.statToText(obj.stats);
		if(t.length > 0){
			text += "<div class='skill_section'>";
			var stats_str = _t("stats_stats", null, "skills");
			text += "<div class='skill_sec_header'>"+stats_str+"</div>";
			//text += "<u>DziaÅanie umiejÄtnoÅci:</u><br>";
			text += t;
			text += "</div>";
		}
		t = self.statToText(obj.next_stat);
		if(t.length > 0){
			text += "<div class='skill_next skill_section'>";
			var stats_str = _t("stats_next_stats", null, "skills");
			text += "<div class='skill_sec_header'>"+stats_str+"</div>";
			//text +="<u>NastÄpne dziaÅanie umiejÄtnoÅci:</u><br>";
			text += t;
			text += "</div>";
			if(haveCost){
				var costClass = self.freeSkills > 0 ? ' freeskills' : '';
				text += "<div class='skill_sec_cost" + costClass + "'>";
				var cost = round(Math.floor(Math.pow(Math.min(300, getHeroLevel()), 1.9)), 1);
				var cost_str = _t("cost_lvl %cost%", {"%cost%": cost}, "skills");
				text += cost_str;
				text += "</div>";
			}
		}
		return text;
	};
	this.parseStatsToItemTip = function(data) {
		var preparedData = data.replace(/\+/g, ";").replace(/:/g, "=");//.replace('+', ';').replace(':', '=');
		var stats = this.parseStat(preparedData);
		return self.statToText(stats);
	};
	this.getRoundLang = function (v) {
		if (v > 4) return _t('five_round');
		if (v > 1) return _t('two_round');
		return  _t('one_round');
	};
	this.statToText = function(stats){
		const skillsUsingByTrans = ["en-regen", "lightshield_per", "resfire_per", "resfrost_per", "reslight_per", "antidote", "dmg_evade_hpp-target_light", "dmg_evade_hpp-target_light", "energyout", "immunity_to_dmg"];
		var tab = [];
		for(var t in stats){
			var text = "";
			var stat = t;
			var first = stats[t];
			var br = first.indexOf("@");
			var additional = null;
			if(br != -1 && br < first.length){
				var va = first.substr(br + 1);
				first = first.substr(0, br);
				var prefix = skillsUsingByTrans.includes(stat) ? _t('by') : _t('on');
				additional = prefix + va + self.getRoundLang(va);
			}
			br = first.indexOf("*plvl");
			if(br != -1 && br < first.length){
				first = first.substr(0, br);
				if(additional == null){
					additional = "";
				}
				additional += _t('value_increase_per_player');
			}
			br = first.indexOf("*cplvl");
			if(br != -1 && br < first.length){
				first = first.substr(0, br);
				if(additional == null){
					additional = "";
				}
				additional += _t('value_increase_per_player_max');
			}
			var transCat = "default";
			var value = first;
			var second = "";
			var spanClass = 'normal';
			switch (stat) {
				/*basic */
				case 'step':
					text += '<span class=' + spanClass + '>' + _t('skill_' + stat);
					break;
				case 'norm-atack':
					text += '<span class=' + spanClass + '>' + _t('skill_' + stat);
					break;
				/*item_*/
				case 'acshield_per' :
				case 'perdmg':
				case 'ac_per':
				case 'pdmg' :
				case 'ac':
					text += '<span class=' + spanClass + '>' + _t('item_' + stat + ' %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;

				/*skills_*/

				case 'decevade_per':
				case 'active_decevade_per':
					text += '<span class=' + spanClass + '>' + _t('skills_' + stat + ' %val%', {
							'%val%': value,
							'%val2%': second,
							'%val3%': (value < 2 ? _t('percentPoints1') : value > 4 ? _t('percentPoints3') : _t('percentPoints2'))
						}, transCat);
					break;
				case 'decevade':
					var str = value > 4 ? '' : '2';
					text += '<span class=' + spanClass + '>' + _t('skills_' + str + stat + ' %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;
				case 'agi':
				case 'firebon':
				case 'lightbon':
				case 'frostbon':
					text += '<span class=' + spanClass + '>' + _t('skills_' + stat + ' %val%', {
							'%val%': mp(Math.floor(parseFloat(value) * 100)),
							'%val2%': mp(Math.floor(parseFloat(second) * 100))
						}, transCat);
					break;
				case 'critslow_per':
				case 'critslow':
				case 'critsa_per':
				case 'critsa':
				case 'immobilize' :
				case 'lastcrit':
				//case 'decevade_per':
				//case 'decevade':
				case 'redslow':
				case 'woundred':
				case 'healpower':
				case 'engback':
				case 'sa-clothes':
				case 'red-sa':
				case 'footshoot':
				case 'critwound':
				case 'swing':
				case 'distract':
				case 'injure':
				case 'reusearrows':
				case 'pcontra':
				case 'fastarrow':
				case 'bandage_per':
				case 'bandage':
				case 'set':
				case 'resfrost_per':
				case 'resfire_per':
				case 'longfireshield':
				case 'longfrostshield':
				case 'longlightshield':
				case 'soullink':
				case 'poisonbon':
				case 'of-thirdatt':
				case 'woundchance':
				case 'wounddmgbon_perw':
				case 'wounddmgbon':
				case 'arrowrain':
				case 'insult':
				case 'frostpunch':
				case 'redstun':
				case 'active_redstun':
				case 'lightmindmg':
				case 'actdmg':
				case 'hpsa':
				case 'mresdmg':
					text += '<span class=' + spanClass + '>' + _t('skills_' + stat + ' %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;
				/*skill_*/
				case 'disturbshoot':
					text += '<span class=' + spanClass + '>' + _t('skill_' + stat + ' %val%', {
							'%val%': value,
							'%val2%': value * 2
						}, transCat) ;
					break;
				case 'str':
				//case 'footshoot2':
				case 'stepslow_per':
				//case 'poisonbon_perw':		!!!!
				case 'poisonbon_poison-perw':
				//case 'arrowrain_perw':	!!!!
				case 'arrowrain_all-perw':
				case 'manarestore_per':
				case 'rime_per':
				//case 'firepunch_perw':	!!!!
				case 'firepunch_fire-perw':
				case 'heal1_per':
				//case 'pdmg_perw':	!!!!
				case 'pdmg_physical-perw':
				case 'energyrestore_per':
				case 'allcritval':
				case 'vamp':
				case 'reddest_per':
				//case 'rotatingblade':
				//case 'daggerthrow':
				case 'poisonstab_perw':
				case 'woundextend':
				//case 'blackout':
				case 'energyout':
				case 'adrenalin_per':
				case 'adrenalin_sa_per':
				case 'adrenalin_sa_threshold_per':
				case 'adrenalin_evade_per':
				case 'adrenalin_evade_threshold_per':
				case 'critpoison_per':
				case 'slowfreeze_per':
				case 'absorb_per':
				case 'absorbm_per':
				case 'heal_per':
				case 'distractshoot':
				case 'blind_per':
				case 'alllowdmg':
				//case 'blesswords_perw':
				case 'aura-adddmg2_per-meele':
				//case 'firedmg_perw':	!!!!
				case 'firedmg_fire-perw':
				case 'chainlightning_perw':
				case 'absagain_per':
				case 'stealmana_per':
				case 'allcritmval':
				case 'reslight_per':
				case 'mcurse':
				case 'weakness_per':
				//case 'disturbshoot':
				case 'antidote':
				case 'lowtension':
				case 'vulture_perw':
				case 'of-wounddmgbon_perw':
				case 'act':
				case 'rage_3turns':
				case 'critrage_perw':
				case 'resfire':
				case 'reslight':
				case 'resfrost':
				case 'adddmg_physical-perw':
				case 'active_acdmg_physical-perw':
				case 'adddmg_fire-perw':
				case 'active_acdmg_per':
				case 'active_absorbdest_per':
				case 'active_block_per':
				case 'decblock_per':
				case 'active_decblock_per':
				case 'active_decblock_per-enemies':
				case 'ac2_per':
				case 'active_add_light_cumulaction':
				case 'redacdmg_per':
					text += '<span class=' + spanClass + '>' + _t('skill_' + stat + ' %val%', {
						'%val%': value,
						'%val2%': second
					}, transCat);
					break;
				case 'trickyknife':
					break;
				case 'blackout':
					break;
				/*skill_ mp()*/
				case 'str1h' :
				case 'str2h' :
				case 'of-str':
					text += '<span class=' + spanClass + '>' + _t('skill_' + stat + ' %val%', {
							'%val%': mp(Math.floor(parseFloat(value) * 100)),
							'%val2%': mp(Math.floor(parseFloat(second) * 100))
						}, transCat) ;
					break;
				/*bonus_*/
				case 'runes':
				case 'goldpack':
				case 'perheal':
				case 'crit':
				case 'active_crit':
				case 'of-crit':
				case 'critval':
				case 'of-critval':
				case 'critmval':
				case 'critmval_f':
				case 'critmval_c':
				case 'critmval_l':
				case 'heal':
				case 'pierce':
				case 'pierceb':
				case 'contra':
				case 'parry':
				case 'fire':
				case 'light':
				case 'adest':
				case 'absorb':
				case 'absorbm':
				case 'hpbon':
				case 'acdmg_per':
				//case 'acdmg_perw':	!!!!
				case 'acdmg_physical-perw':
				case 'acdmg':
				case 'active_acdmg':
				case 'resdmg':
				case 'en-regen':
				case 'manastr':
				case 'manarestore':
				case 'manatransfer':
				case 'stun':
				case 'freeze':
				case 'hpcost':
				case 'cover':
				case 'allslow':
				case 'allslow_per':
				//case 'firearrow_perw':	!!!!
				case 'dmg_evade-target_fire-perw':
				case 'dmg-target_fire-perw':
				case 'firewall_perw':
				//case 'firewall':
				case 'thunder':
				case 'storm':
				case 'lowdmg':
				case 'lowdmg_self':
				case 'lowdmg_enemy':
				case 'blizzard':
				case 'sunshield_per':
				case 'sunreduction':
				case 'healall_per':
				case 'healall':
				case 'heal1':
				case 'absorbd':
				case 'abdest':
				case 'endest':
				case 'manadest':
				case 'lowevade':
				case 'lowcrit':
				case 'arrowblock':
				//case 'evade_per':
				case 'redabdest_per':
					text += '<span class=' + spanClass + '>' + _t('bonus_' + stat + ' %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;
				case 'evade_per':
					text += '<span class=' + spanClass + '>' + _t('bonus_' + stat + ' %val%', {
							'%val%': value,
							'%val2%': second,
							'%val3%': (value < 2 ? _t('percentPoints1') : value > 4 ? _t('percentPoints3') : _t('percentPoints2'))
						}, transCat);
					break;
				/*bonus_ mp()*/
				case 'hp':
				case 'sa_per':
				case 'sa2_per':
				case 'ds':
				case 'dz':
				case 'di':
				case 'da':
				case 'gold':
				case 'blok_per':
				case 'blok':
				case 'evade':
				case 'energybon':
				case 'energygain':
				case 'manabon':
				case 'managain':
				case 'aura-resall':
					text += '<span class=' + spanClass + '>' + _t('bonus_' + stat + ' %val%', {
							'%val%': mp(value),
							'%val2%': mp(second)
						}, transCat);
					break;
				case 'dmg_evade_hpp-target':
				case 'dmg_evade_hpp-target_light':
				case 'lightshield2_per':
				case 'lightshield_per':
				case 'lightshield':
					text += '<span class=' + spanClass + '>' + _t('skills_' + stat + ' %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;
				case 'cooldown':// - Czas odnowienia: x tur. //dla x=1 "tura", x=2,3,4 "tury" x>4 "tur"
					text += '<span class=' + spanClass + '>' + _t('skill_' + stat, {
							'%val%': value,
							'%val2%': second
						}, transCat);
					text += value == 1 ?_t('turn') : value > 4 ? _t('turn5') : _t('turns');
					break;
				case 'reqarrows':
					var str = value > 4 ? '5arrow' : value > 1 ? '2arrow' : 'arrow';
					text += value + ' ' + _t(str);
					break;
				case 'rage':
					text += '<span class=' + spanClass + '>' + _t('skills_rage %val% %turn%', {
							'%val%': value,
							'%turn%': (parseInt(value) > 1 ? (parseInt(value) > 4 ? _t('five_round') : _t('two_round')): ' ' + _t('turn')),
							'%val2%': second
						}, transCat);
					break;
				case 'doubleshoot' :
					text += '<span class=' + spanClass + '>' + _t('skill_doubleshoot');
					break;
				case 'disturb' :
					text += '<span class=' + spanClass + '>' + _t('skills_disturb %val%', {
							'%val%': value,
							'%val2%': (parseInt(value) * 2),
							'%val3%': second,
							'%val4%': (parseInt(second) * 2)
						}, transCat);
					break;
				case 'shout' :
					text += '<span class=' + spanClass + '>' + _t('skills_shout %val%', {
							'%val%': value > 1 ? _t('enemies %amount%', {
								'%amount%': value,
								'%val2%': second
							}, transCat) : (value + ' ' + _t('oneenemy'))
						});
					break;
				case 'sa1'  :
					text += '<span class=' + spanClass + '>' + _t('bonus_sa1 %val%', {
						'%val%': value / 100,
						'%val2%': second / 100
					}, transCat);
					break;
				case 'leczy' :
					if (value > 0) text += '<span class=' + spanClass + '>' + _t('bonus_leczy %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					else text += '<span class=' + spanClass + '>' + _t('bonus_truje %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;
				case 'fullheal' :
					text += '<span class=' + spanClass + '>' + _t('bonus_fullheal %val%', {
							'%val%': round(value, 2),
							'%val2%': round(second, 2)
						}, transCat);
					break;
				case 'creditsbon' :
					text += '<span class=' + spanClass + '>' + _t('bonus_creditsbon');
					break;
				case 'revive':
					text += '<span class=' + spanClass + '>' + _t('revive %amount%', {'%amount%': value, '%val2%': second}, transCat);
					break;
				case 'frost' :
					b = value.split(',');
					text += '<span class=' + spanClass + '>' + _t('bonus_frost %val% %slow%', {
							'%val%': b[1],
							'%slow%': (b[0] / 100)
						}, transCat);
					break;
				case 'poison' :
					b = value.split(',');
					text += '<span class=' + spanClass + '>' + _t('bonus_poison %val% %slow%', {
							'%val%': b[1],
							'%slow%': (b[0] / 100)
						}, transCat);
					break;
				case 'slow' :
					text += '<span class=' + spanClass + '>' + _t('bonus_slow %val%', {
							'%val%': (value / 100),
							'%val2%': (second / 100)
						}, transCat);
					break;
				case 'wound' :
					b = value.split(',');
					text += '<span class=' + spanClass + '>' + _t('bonus_wound %val% %dmg%', {
							'%val%': b[0],
							'%dmg%': b[1]
						}, transCat);
					break;
				case 'energy' :
					if (value > 0) text += '<span class=' + spanClass + '>' + _t('bonus_energy1 %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					else text += '<span class=' + spanClass + '>' + _t('bonus_energy2 %val%', {
							'%val%': Math.abs(value),
							'%val2%': Math.abs(second)
						}, transCat);
					break;
				case 'energyp' :
					if (value > 0) text += '<span class=' + spanClass + '>' + _t('bonus_energyp1 %val%', {
							'%val%': mp(value),
							'%val2%': mp(second)
						}, transCat);
					else text += '<span class=' + spanClass + '>' + _t('bonus_energyp2 %val%', {
							'%val%': Math.abs(value),
							'%val2%': Math.abs(second)
						}, transCat);
					break;
				case 'mana' :
					if (value > 0) text += '<span class=' + spanClass + '>' + _t('bonus_mana1 %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					else text += '<span class=' + spanClass + '>' + _t('bonus_mana2 %val%', {
							'%val%': Math.abs(value),
							'%val2%': Math.abs(second)
						}, transCat);
					break;
				case 'firearrow' :
				case 'firepunch' :
				case 'firebolt' :
					text += '<span class=' + spanClass + '>' + _t('bonus_firebolt %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;

				case 'sunshield' :
					text += '<span class=' + spanClass + '>' + _t('bonus_sunshield %val%', {
							'%val%': value,
							'%val2%': (value / 2)
						}, transCat);
					break;
				case 'aura-ac_per' :
				case 'aura-ac' :
					text += '<span class=' + spanClass + '>' + _t('bonus_aura-ac %val%', {
							'%val%': mp(value),
							'%val2%': mp(second)
						}, transCat);
					break;
				case 'aura-sa_per':
					text += '<span class=' + spanClass + '>' + _t('bonus_aura-sa_per %val%', {
							'%val%': mp(value),
							'%val2%': mp(second)
						}, transCat);
					break;
				case 'removedot' :
				case 'removedot-allies' :
				case 'removestun' :
					text += '<span class=' + spanClass + '>' + _t('skill_' + stat, null, 'new_skills');
					break;
				case 'aura-sa' :
					text += '<span class=' + spanClass + '>' + _t('bonus_aura-sa %val%', {
							'%val%': mp(value / 100),
							'%val2%': mp(second / 100)
						}, transCat);
					break;
				case 'stinkbomb' :
					text += '<span class=' + spanClass + '>' + _t('bonus_stinkbomb %val% %crit%', {
							'%val%': (parseInt(value) * 2),
							'%crit%': value,
							'%val2%': (parseInt(second) * 2),
							'%crit2%': second
						}, transCat);
					break;
				case 'reqp' :
					break;
				case 'reqw' :
					b = value.split(',');
					var ret = [];
					for (var i in b) {
						var wp = weapon[b[i]];
						for (var j in wp) {
							var t = wp[j];
							if (hero.prof == 'm' && (t == 1 || t == 2)) {
								t += 5;
							}
							var str = _t("wp_"+t, null, "si_skills_req");
							ret.push(str);
						}
					}
					text += ret.join(", ");
					break;
				case 'lvl':
					break;
				case 'unav':
					break;
				case 'add_attacks':
					var str = value > 1 ?  'add_moreAttacks %val%' : 'add_attacks %val%';

					text += '<span class=' + spanClass + '>' + _t(str, {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;
				// eng game

				//wartoï¿½ï¿½ z %
					//1. common
				case 'dmg_to_npc_per': 									// - "Obraï¿½enia zadawane potworom: val%"
				case 'dmg_from_npc_per': 								// - "Obraï¿½enia otrzymywane od potworï¿½w: val%"
				case 'dmg_to_player_per': 							// - "Obraï¿½enia zadawane graczom: val%"
				case 'dmg_from_player_per': 						// - "Obraï¿½enia otrzymywane od graczy: val%"
				case 'chest_armor_per': 								// - "Zwiï¿½kszenie pancerza ze zbroi o val%"
					//2. Wojownik:
				//case 'critval_enemies': 								// - "Siï¿½a krytyka fizycznego przeciwnikï¿½w: val%"
				case 'critval-enemies': 								// - "Siï¿½a krytyka fizycznego przeciwnikï¿½w: val%"
				//case 'critval_allies': 									// - "Siï¿½a krytyka fizycznego sojusznikï¿½w: val%"
				case 'critval-allies': 									// - "Siï¿½a krytyka fizycznego sojusznikï¿½w: val%"
				//case 'critmval_enemies': 								// - "Siï¿½a krytyka magicznego przeciwnikï¿½w: val%"
				case 'critmval-enemies': 								// - "Siï¿½a krytyka magicznego przeciwnikï¿½w: val%"
				//case 'critmval_allies': 								// - "Siï¿½a krytyka magicznego sojusznikï¿½w: val%"
				case 'critmval-allies': 								// - "Siï¿½a krytyka magicznego sojusznikï¿½w: val%"
				case 'crush_threshold_per': 						// - "Zmiaï¿½dï¿½enie, gdy przynajmniej val% obraï¿½eï¿½ przejdzie przez pancerz przeciwnika"
				case 'crush_dmg_per': 									// - "Zwiï¿½kszenie obraï¿½eï¿½ o val% po zmiaï¿½dï¿½eniu"
					//3. Tancerz ostrzy:
				case 'vamp_time_per': 									// - "Zwraca ï¿½ycie w wielkoï¿½ci val% zadanych obraï¿½eï¿½"
				case 'dmg-swing_physical-perw': 				// - "Atak o sile val% obraï¿½eï¿½ na 2 pozostaï¿½ych przeciwnikï¿½w"
					//4. ï¿½owca:
				case 'taken_dmg_per': 									// - "Zwiï¿½kszenie o val% przyjmowanych obraï¿½eï¿½"
				case 'critpierce_per': 									// - "Zwiï¿½kszenie niszczenia pancerza o val% podczas przebicia pancerza przeciwnika ciosem krytycznym"
					//5. Mag:
				case 'dmg-row_fire-perw': 							// - "ï¿½ciana ognia o mocy val% posiadanego ataku od ognia"
				case 'dmg-force-4_light-perw':					// - "ï¿½aï¿½cuch piorunï¿½w o mocy val% posiadanego ataku od bï¿½yskawic"
					//6. Paladyn:
				case 'hp_per-allies': 									// - "Aura ï¿½ycia: +val% ï¿½ycia dla sojusznikï¿½w"
				case 'hp_per-enemies': 									// - "Aura ï¿½ycia: val% ï¿½ycia dla przeciwnikï¿½w"
					//7. Tropiciel:
				case 'heal_per-allies': 								// - "Zwiï¿½kszenie leczenia turowego z posiadanego ekwipunku sojusznikï¿½w o +val%"
				case 'heal_per-enemies':
					text += '<span class=' + spanClass + '>' + _t('end-game-percent' + stat + ' %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;
				//wartoï¿½ï¿½ bez %
					//3. Tancerz ostrzy:
				case 'acdmg': 													// - "Niszczy val punktï¿½w pancerza podczas ciosu"
				case 'dmg-line_physical': 							// - "Atak o sile val obraï¿½eï¿½ w kaï¿½dego z trafionych przeciwnikï¿½w"
					//5. Mag:
				case 'immunity_to_dmg': 								// - "Niewraï¿½liwoï¿½ï¿½ na otrzymywane obraï¿½enia"
					//6. Paladyn:
				case 'dmg-target_physical': 						// - "Zadaje val obraï¿½eï¿½ fizycznych przeciwnikowi"
					//7. Tropiciel:
				case 'distortion': 											// - "Postaï¿½ spaczona automatycznie zaatakuje sama siebie"
					text += '<span class=' + spanClass + '>' + _t('end-game-without-percent' + stat +  ' %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;

				//dwie wartoï¿½ci w stacie
					//6. Paladyn:
				case 'manaendest': 											// - "Niszczenie many o val i energii o val2"
					text += '<span class=' + spanClass + '>' + _t('end-game-more-val' + stat +  ' %val% %val2% %val3% %val4%', {
							'%val%': value,
							'%val2%': second,
							'%val3%': Math.round(value / 3),
							'%val4%': Math.round(second / 3)
						}, transCat);
					break;
				//do ukrycia
					//3. Tancerz ostrzy:
				case 'rotatingblade': 									// - trzeba ukryï¿½ ten stat w panelu UM, posï¿½uï¿½y tylko jako etykietka w logu walki
				case 'daggerthrow': 										// - trzeba ukryï¿½ ten stat w panelu UM, posï¿½uï¿½y tylko jako etykietka w logu walki
					//5. Mag:
				case 'chainlightning': 									// - trzeba ukryï¿½ ten stat w panelu UM, posï¿½uï¿½y tylko jako etykietka w logu walki
				case 'firewall': 												// - trzeba ukryï¿½ ten stat w panelu UM, posï¿½uï¿½y tylko jako etykietka w logu walki
					//6. Paladyn:
				case 'balloflight': 										// - trzeba ukryï¿½ ten stat w panelu UM, posï¿½uï¿½y tylko jako etykietka w logu walki
					break;

				//new stats


				case 'doublecastcost_per':// - UÅ¼ycie umiejÄtnoÅci drugi raz z rzÄdu podnosi jej koszt o x%
				case 'combo-crit':// - +x pkt. kombinacji za kaÅ¼dy zadany cios krytyczny
				case 'combo-block':// - +x pkt. kombinacji za kaÅ¼dy zablokowany cios
				case 'combo-evade':// - +x pkt. kombinacji za kaÅ¼dy unikniÄty cios
				case 'combo-wound':// - +x pkt. kombinacji za kaÅ¼dÄ zadanÄ gÅÄbokÄ ranÄ
				case 'combo-pierce':// - +x pkt. kombinacji za kaÅ¼dy zablokowany cios
				case 'combo-skill':// - +x pkt. kombinacji za kaÅ¼de uÅ¼ycie tej umiejÄtnoÅci
				case 'combo-max':// - ZuÅ¼ywa wszystkie punkty kombinacji oraz dodaje bonus za maksymalnie x pkt.
				case 'combo_perdmg':// - ZwiÄkszenie obraÅ¼eÅ o x% za kaÅ¼dy pkt. kombinacji
				case 'combo_resfire_per':// - Dodaje x% odpornoÅci na ogieÅ za kaÅ¼dy pkt. kombinacji
				case 'combo_resfrost_per':// - Dodaje x% odpornoÅci na zimno za kaÅ¼dy pkt. kombinacji
				case 'combo_reslight_per':// - Dodaje x% odpornoÅci na bÅyskawice za kaÅ¼dy pkt. kombinacji
				case 'combo_dmg_hpp-target':// - Zadaje wrogiemu graczowi obraÅ¼enia rÃ³wne x% jego maksymalnego Å¼ycia za kaÅ¼dy pkt. kombinacji
				case 'dmg_hpp-target':// - Zadaje wrogiemu graczowi obraÅ¼enia rÃ³wne x% jego maksymalnego Å¼ycia
				case 'combo_dmg_hpp-target_fire':// - Zadaje wrogiemu graczowi obraÅ¼enia od ognia rÃ³wne x% jego maksymalnego Å¼ycia za kaÅ¼dy pkt. kombinacji
				case 'dmg_hpp-target_fire':// - Zadaje wrogiemu graczowi obraÅ¼enia od ognia rÃ³wne x% jego maksymalnego Å¼ycia
				case 'combo_dmg_hpp-target_frost':// - Zadaje wrogiemu graczowi obraÅ¼enia od zimna rÃ³wne x% jego maksymalnego Å¼ycia za kaÅ¼dy pkt. kombinacji
				case 'dmg_hpp-target_frost':// - Zadaje wrogiemu graczowi obraÅ¼enia od zimna rÃ³wne x% jego maksymalnego Å¼ycia
				case 'combo_dmg_hpp-target_light':// - Zadaje wrogiemu graczowi obraÅ¼enia od bÅyskawic rÃ³wne x% jego maksymalnego Å¼ycia za kaÅ¼dy pkt. kombinacji
				case 'dmg_hpp-target_light':// - Zadaje wrogiemu graczowi obraÅ¼enia od bÅyskawic rÃ³wne x% jego maksymalnego Å¼ycia
				case 'combo_heal_per': //- Przywraca x% Å¼ycia za kaÅ¼dy pkt. kombinacji
				case 'combo_energyrestore_per':// - Przywraca x% energii za kaÅ¼dy pkt. kombinacji
				case 'combo_manarestore_per':// - Przywraca x% many za kaÅ¼dy pkt. kombinacji
				case 'combo_lowdmg_enemy':// - Zmniejsza zadawane przez przeciwnika obraÅ¼enia o x% za kaÅ¼dy pkt. kombinacji
				case 'dmg_hpp-row_fire':// - Wypala x% maksymalnego Å¼ycia graczy stojÄcych w jednej linii
				case 'dmg_hpp-row_frost':// - WymraÅ¼a x% maksymalnego Å¼ycia graczy stojÄcych w jednej linii
				case 'dmg_hpp-row_light':// - PoraÅ¼a x% maksymalnego Å¼ycia graczy stojÄcych w jednej linii
				case 'lowheal_per-enemies':// - OsÅabia o x% leczenie z aktywnych umiejÄtnoÅci przeciwnika
				case 'achpp_per':// - Dodaje 1% pancerza za kaÅ¼de brakujÄce x% Å¼ycia
				case 'adrenalin_reddest_threshold_per':// - PrÃ³g adrenaliny rÃ³wny x% Å¼ycia
				case 'adrenalin_reddest_per_sum':// - ZwiÄksza redukcjÄ niszczenia many i energii o x%
				case 'poisonspread':// - Rozprzestrzenienie trucizny na x przeciwnikÃ³w
				case 'taken_dmg_per-row':
				case 'taken_dmg_per-all':
				case 'perdmg-allies':
				case 'active_crit-allies':
				case 'disturb_crit':
				case 'disturb_pierce':
				case 'stinkbomb_crit':
				case 'stinkbomb_pierce':
					text += '<span class=' + spanClass + '>' + _t('skill_' + stat + ' %val%', {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;
				case 'removeslow-allies':// - UsuniÄcie spowolnieÅ ze swojej druÅ¼yny
				case 'removestun-allies':// - UsuniÄcie ogÅuszeÅ ze swojej druÅ¼yny
				case 'of-woundstart':// - Rani przeciwnika gÅÄbokÄ ranÄ pomocniczÄ, gdy ten nie byÅ wczeÅniej zraniony
				case 'poison_lowdmg_per-enemies':// - osÅabienie zadawanych obraÅ¼eÅ przez zatrutych przeciwnikÃ³w
					text += '<span class=' + spanClass + '>' + _t('skill_' + stat, {
							'%val%': value,
							'%val2%': second
						}, transCat);
					break;
				case 'cooldown':// - Czas odnowienia: x tur. //dla x=1 "tura", x=2,3,4 "tury" x>4 "tur"
					text += '<span class=' + spanClass + '>' + _t('skill_' + stat, {
							'%val%': value,
							'%val2%': second
						}, transCat);
					text += x == 1 ?_t('turn') : x > 4 ? _t('turn5') : _t('turns');
					break;
				//case 'reqarrows':// - Wymaga x strzaÅ //dla x=1 "strzaÅy, x>1 "strzaÅ




				default:
					if (stat != '') text += '<span class=' + spanClass + '>' + _t('unknown_stat %val%', {'%val%': stat}, transCat) + "</span>"; //'Nieznany stat: '+stat+'<br>'
					break;
			}
			if(additional !== null){
				text += additional;
			}
			if(text.length > 0){
				tab.push("- "+text);
			}
		}
		return tab.join("<br>");
	};
	this.changeStyle = function(obj, els){

		// if(g.bmEditor.enabled){
		// 	els.handler.removeClass("clickable");
		// 	return false;
		// }

		if (obj.clvl == 0) els.border.find('.set-active-state').addClass('disabled');
		else els.border.find('.set-active-state').removeClass('disabled');

		if(obj.clvl == obj.mlvl){
			els.el.removeClass("disabled");
			els.handler.removeClass("clickable");
			els.border.find('.learn-btn').addClass('disabled');
			return false;
		}
		if(obj.next_req.hasOwnProperty("unav")){
			els.handler.removeClass("clickable");
			els.el.addClass("disabled");
			els.border.find('.learn-btn').addClass('disabled');
			return false;
		}
		els.el.removeClass("disabled");
		els.handler.addClass("clickable");
		els.border.find('.learn-btn').removeClass('disabled');
		return true;
	};
	this.oneSkill = function (obj, sec, t) {
		if(t > 5) return;
		var rlvl = 0;
		if (obj.req.lvl) {
			rlvl = parseInt(obj.req.lvl);
		} else if (obj.next_req.lvl) {
			rlvl = parseInt(obj.next_req.lvl);
		}
		var els = null;
		if (!isset(skills_el[obj.id])) {
			//create
			var $e = $("<div>").addClass("skillbox_border");

			var $e2 = $("<div>").addClass("skillbox").appendTo($e);
			var $hicon = $("<div>").addClass("skillbox_icon_holder").appendTo($e2);
			var $lvl = $("<div>").addClass("skillbox_lvl");
			els = {
				el: $e2,
				handler: $hicon,
				lvl: $lvl,
				border: $e
			};
			//if(obj.id == 106){ //hardcoded bmEditor
			//	var str = _t("edit_fight_mastery", null, "skills");
			//	$("<div>").addClass("skillbox_bm").attr("tip", str).appendTo($e2)
			//		.click(function(){
			//			var c = self.skills[obj.id];
			//			if(c.clvl > 0){
			//				g.bmEditor.toggleShow();
			//			}
			//	});
			//}
			$("<div>").addClass("skillbox_icon skill-icon-" + obj.id).appendTo($hicon);

			var learnCl = obj.changed ? '' : 'disabled';
			var $learBtn = $('<div>').addClass('learn-btn ' + learnCl);
			var cost = round(Math.floor(Math.pow(Math.min(300, getHeroLevel()), 1.9)), 1);
			var cost_str = _t('learn_btn', null, 'skills')  + '. ' + _t("cost_lvl %cost%", {"%cost%": cost}, "skills");
			$learBtn.attr("tip", cost_str);
			$e.append($learBtn);
			$learBtn.click(function () {
				var c = self.skills[obj.id];
				if (self.changeStyle(c, els)) {
					if (!isset(c.blocked)) {
						c.blocked = true;
						_g('skills&learn=' + obj.id + '&lvl=' + (c.clvl + 1), function () {
							c.blocked = false;
						});
					}
				}
			});

			if(obj.type){
				$("<div>").addClass("skillbox_active").appendTo($e2);//.click(function(){
				// 	var c = self.skills[obj.id];
				// 	self.changeStyle(c, els);
				// });
				$("<div>").addClass("add_to_bm").appendTo($e2).click(function () {
					g.bmEditor.addAndSave(obj.id);
				});
				var $setActiveState = $('<div>').addClass('set-active-state');
				$e.append($setActiveState);
				if (self.selectedSkills.indexOf(parseInt(obj.id)) > -1) $setActiveState.addClass('active');
				$setActiveState.attr('tip', 'WÅÄcz/wyÅÄcz umiejÄtnoÅÄ w walce');
				$setActiveState.click(function () {
					var canChange = self.changeSelectedSkills(obj.id);
					if (canChange) _g('skills&selectedskills=' + self.selectedSkills);
				})
			}
			self.changeStyle(self.skills[obj.id], els);
			$lvl.appendTo($e2);
			skills_el[obj.id] = els;
			if (t == 0) {
				$("<div>").addClass("skillbox_shadow mini2").appendTo(sec);
			} else {
				$("<div>").addClass("skillbox_shadow").appendTo(sec);
			}
			$e.appendTo(sec);
			//hardcoded 6 elements
			if (t == 5) {
				$("<div>").addClass("skillbox_shadow mini").appendTo(sec);
			}
		} else {
			els = skills_el[obj.id];
			self.changeStyle(self.skills[obj.id], els);
		}
		//set changable values
		if(obj.changed){
			var tip = self.skillTip(obj);
			els.el.attr("tip", tip);
			var power = "";
			if (obj.clvl == obj.mlvl) {
				power = "learned-skill cl-6";
			} else if (obj.clvl > 0) {
				var pp = obj.clvl / obj.mlvl;
				power = "learned-skill cl-" + Math.ceil(pp * 5);
			}
			if(!els.lvl.hasClass(power)){
				els.lvl.removeClass().addClass("skillbox_lvl " + power);
			}
			els.lvl.text(obj.clvl + "/" + obj.mlvl);

			if (obj.id == 106) { //hardcoded bmEditor
				var bmIcon = els.el.find(".skillbox_bm");
				if (obj.clvl > 0){
					bmIcon.show();
				}else{
					bmIcon.hide();
				}
			}
		}
		return rlvl;
	};

	this.changeSelectedSkills = function (id) {
		var index = self.selectedSkills.indexOf(parseInt(id));
		if (index > - 1) {
			self.selectedSkills[index] = 0;
			return true;
		}
		for (var i = 0; i < this.selectedSkills.length; i++) {
			if (this.selectedSkills[i] == 0) {
				this.selectedSkills[i] = id;
				return true;
			}
		}
		if (this.selectedSkills.length < 17) {
			this.selectedSkills.push(id);
			return true;
		}
		return false;
	};

	this.show_tab = function (tab) {
		if (tab.el === null) {
			tab.el = $("<div>").addClass("skills_tab").appendTo("#skills_body");
			var header = $("<div>").addClass("skills_tab_header").appendTo(tab.el);
			tab.head = $("<div>").addClass("skills_tab_text").appendTo(header);
		}
		var rlvl = 25;
		for (var t in tab.list) {
			var oid = tab.list[t];
			var l = self.oneSkill(self.skills[oid], tab.el, t);
			if (l > rlvl) {
				rlvl = l;
			}
		}
		//set text in header of this section
		var rpkt = rlvl - 25;
		var tab_text = _t("skill_req_desc", null, "skills");
		if (rpkt > 1) {
			tab_text = _t("skill_req_desc %lvl% %points%", {
				"%lvl%": rlvl,
				"%points%": rpkt
			}, "skills");
		}
		tab.head.text(tab_text);
	}
	this.refresh = function(d){
		for (var t in tabs) {
			self.show_tab(tabs[t]);
		}
		if(Tip.resize) Tip.resize();
	};

	this.updateBmAvailability = function () {
		var $b = $('#skills_footer').find('.bm-edit-button>.SI-button');
		var $l = $('#bm-label1');
		if (getHeroLevel() < 25) {
			$l.css('display', 'block');
			$b.addClass('black')
		} else {
			$l.css('display', 'none');
			$b.removeClass('black')
		}
	};

	this.load = function (skill_list, freeSkills, skill_data) {
		//self.skills = [];
		if (isset(skill_data)) {
			self.allSkillsData = skill_data;
		}
		self.freeSkills = freeSkills;
		$('#skillcount').attr('tip', _t('use_skill_points'));
		$('#skillcount .skills_learnt').empty();
		$('#skillcount .skills_total').empty();
		g.lock.add('skills');
		for (let [id, skill] of Object.entries(self.allSkillsData)) {
			self.new_skill(id, skill, skill_list[id]);
		}
		self.refresh();
		self.updateBmAvailability();
		if ($('#skills').css('display') != 'block') {
			$('#skills DIV.skills').hide();
			$('#skills').fadeIn('fast', function () {
				// g.bmEditor.enable()
			});
		}
	}
}
