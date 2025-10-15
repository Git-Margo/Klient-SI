/**************************** BATTLES */
var tmpForumLog = [];
let poolTimeHasExist = false;
function fight(f, allData)
{
  var close=false;
  if(isset(f.init)) {
    if (!(isset(allData.loot) && isset(allData.loot.init)) && g.init > 4) {
        closeLootWindow(true);
        getEngine().buildsManager.getBuildsWindow().closePanel();
    }
    attach_battle_log();
    // if (isset(f.close) && f.close) return;
   // g.playerCatcher.stopFollow();
    if (!isset(f.close)) $('#battle').fadeIn();
    $('#battlelog').empty();
    $('#battle .troop, #battle BIG').remove();
    g.windowCloseManager.callWindowCloseConfig(g.windowsData.windowCloseConfig.BATTLE)
    g.battle={
      f:[],
      wRatio:1.5,
      log:[],
      logBuffer:[],
      forumLog:[],
      intervalMove: null,
      line:[[],[],[],[],[],[]],
      move: -1,
      auto:parseInt(f.auto),
      myteam:f.myteam,
      disabledSkills: null,
      skills:[],
			heroMana : null,
			heroEnergy: null,
      endBattle: false,
      is_auto_fight_for_all_available: false
    };
    tmpForumLog = [];
    if (getCookie('battleLogSize') == 'big' && getEngine().chatController.getChatWindow().getChatSize() != 2){$('#battlelog,#battlepanelback,#battlepanel,#battle .border-b').addClass('big');map.resizeView()}
    g.lock.add('battle');
    var flist1=[], flist2=[];
    for(var k in f.w){
      //if(f.w[k].team!=2) flist1.push(f.w[k].name+'('+f.w[k].lvl+f.w[k].prof+')');
      //else flist2.push(f.w[k].name+'('+f.w[k].lvl+f.w[k].prof+')');

        let oneWarrior = f.w[k];
        let charaData = {
            showNick        : true,
            level           : oneWarrior.lvl,
            operationLevel  : oneWarrior.oplvl,
            prof            : oneWarrior.prof,
            nick            : oneWarrior.name
        }

        let characterInfo    = getCharacterInfo(charaData);

        if(f.w[k].team!=2)  flist1.push(characterInfo);
        else                flist2.push(characterInfo);
    }

    $('#battlelog').append(battleMsg('0;0;txt='+_t('battle_starts_between %grp1% %grp2%', {'%grp1%': flist1.join(', '), '%grp2%':flist2.join(', ')}))); //+'RozpoczÄÅa siÄ walka pomiÄdzy '+flist1.join(', ')+' a '+flist2.join(', '))
    $('#battlepanel SMALL').html(ut_fulltime(unix_time()));
    var $b=$('#battle');
    if(!$('.lines', $b).length) {
        for (var i = 0; i < 7; i++) {
            let tip = i ? _t('first_plan_buttons') : _t('first_plan_default');
            $('<div tip="' + tip + '" class=lines>' + (i ? i : '*') + '</div>') //'UÅ¼yj tych przyciskÃ³w aby pokazaÄ dany szereg na pierwszym planie
                .css({
                    top: 170 + 30 * i,
                    opacity: 0.1
                })
                .click(function (e) {
                    showTroops($(this).html())
                })
                .hover(function (e) {
                    $('#battle .lines').css('opacity', e.type == 'mouseenter' ? 0.5 : 0.1)
                })
                .appendTo($b);
        }
    }
  } else {
    if (!isset(f.close)) {
      if (g.battle.f.length == 0) window.location.reload();
      if ($('#battle').css('display') != 'block')
        $('#battle').css('display', 'block');
    }
  }
  if (isset(f.close)) close=true;

  // if(isset(f.ansgame)) ansgame.start(f.ansgame);
  // else ansgame.close();
    if (f.skills_disabled) setSkillsDisabled(f.skills_disabled)
  if(isset(f.skills)) {
    g.battle.skills=[];
		var d = 4;
		d = 10;
		//TODO warunek do usuniecia
		//if(g.worldname == "experimental" || g.worldname == "dev"){
		//	d = 5;
		//}
    for(var i=0; i<f.skills.length; i+=d)
      g.battle.skills[parseInt(f.skills[i])]={
        name    : f.skills[i+1],
        attr    : f.skills[i+2],
        cost    : self.getFormCost(f.skills[i + 8]),
		require : getRequire(f.skills[i+1], f.skills[i+6])
    };
  }
  if(isset(f.skills_combo_max)){
    g.battle.skills_combo_max = [];
    g.battle.skills_combo_max = f.skills_combo_max
  }

  if(isset(f.w)) {
      newTroops(f.w);
      warriorsAfterUpdate();
  }
  updateBuffs();
	updateCurrent(f.current);
  if(isset(f.m) && checkMsgOrder(f)){
    for(var k in g.battle.logBuffer) {
      g.battle.log.push(g.battle.logBuffer[k].m);
      $('#battlelog').append(battleMsg(g.battle.logBuffer[k].m,isset(f.init)));
      $('#battlelog').scrollTop(99999);
    }
    g.battle.logBuffer = [];
  }
  if (isset(f.poolTime) && isset(f.poolTime.left)) {
    setIntervalPoolTime(f.poolTime.left);
  }
  if (!isset(f.start_move)) {
    this.clearIntervalPoolTime();
  }
  if(isset(f.move)) {
      if (f.move < 0) {
          updateMoveTime(-1);
      } else {
          setIntervalMove(f.move);
      }
  }
  if (isset(f.is_auto_fight_for_all_available)) {
    g.battle.is_auto_fight_for_all_available = f.is_auto_fight_for_all_available;
  }
  if(f.battleground) map.setBack(f.battleground);
  if(isset(f.w)) {
      if(isAutoFightForMeActive() && !g.battle.auto) {
          $('#autobattleButton').css('display', 'none');
          $('#tourbattleButton').css('display', 'block');
          if (g.battle.is_auto_fight_for_all_available) $('#autobattleAllButton').css('display', 'block');
      } else {
          $('#autobattleButton').css('display', 'block');
          $('#tourbattleButton').css('display', 'none');
          if (g.battle.is_auto_fight_for_all_available) $('#autobattleAllButton').css('display', 'block');
      }
  }

    if (isset(f.endBattle) && f.endBattle) {
        setEndBattle();
    }

  if(close){
    clearIntervalMove();
    closeBattle();
  }
}

const hideActionButtons = () => {
    $('#autobattleButton').css('display', 'none');
    $('#tourbattleButton').css('display', 'none');
    $('#autobattleAllButton').css('display', 'none');
    $('#surrenderBattleButton').css('display', 'none');
}

function getFormCost (require) {
    if (require == '') return '';

    let requireArray 	= require.split(';')
    let requireObj 		= {};

    for(let k in requireArray) {
        let keyValuePair = requireArray[k].split('=');
        requireObj[keyValuePair[0]] = keyValuePair[1];
    }

    if (isset(requireObj.energy)) return requireObj.energy.replace(/\*c?plvl/, '') + 'e';
    if (isset(requireObj.mana)) 	return requireObj.mana.replace(/\*c?plvl/, '') + 'm';

    return '';
}

function setSkillsDisabled(_disabledSkills) {
    g.battle.disabledSkills = _disabledSkills;
    // console.log(disabledSkills);
};

function checkDisabled (id) {
    return g.battle.disabledSkills.includes(parseInt(id));
}

function getRequire (skillName, require) {
    // debugger;
    // console.log(require)
    // return '';

    if (require == '') return require;

    let requireArray = require.split(';');
    let reqwValue;

    for (let k in requireArray) {
        let nameAndValStr = requireArray[k];
        let d = nameAndValStr.split('=');
        if (d[0] == 'reqw') {
            reqwValue = d[1];
            break
        }
    }

    if (!reqwValue) return '';

    // console.log(skillName, reqwValue);

    return reqwValue;
}

function clearIntervalPoolTime () {
    if (g.battle.intervalPoolTime != null) {
        clearInterval(g.battle.intervalPoolTime);
    }
}

function setIntervalPoolTime (maxTime) {
    poolTimeHasExist = true;
    let counter = maxTime;

    clearIntervalPoolTime();
    updatePoolTime(counter); // first update

    g.battle.intervalPoolTime = setInterval(() => {
        counter--;
        if (counter === -1) {
            clearIntervalPoolTime();
            return;
        }
        updatePoolTime(counter); // update by 1 sec
    }, 1000)
}

function updatePoolTime (time) {
    const $poolTimer = $('#pooltime');
    if($poolTimer.css('display') === 'none') $poolTimer.css('display', 'block');
    const msg = _t('battle-time', { '%val%': time }, 'battle');
    $poolTimer.text(msg);
}

function clearIntervalMove () {
    if (g.battle.intervalMove != null) {
        clearInterval(g.battle.intervalMove);
    }
}
function setIntervalMove (time) {
    let counter = time;

    clearIntervalMove();
    updateMoveTime(counter); // first update

    g.battle.intervalMove = setInterval(function () {
        counter--;
        if (counter === -1) {
            clearIntervalMove();
            return;
        }
        updateMoveTime(counter); // update by 1 sec
    }, 1000)
}
function updateMoveTime (time) {
    g.battle.move = time;
    var movemsg=_t('someoneelse_move', null, 'battle'); //'Ruch kogoÅ innego.'
    var showSurrender = true;
    if (time > 0) {
        movemsg=_t('your_move %sec%', {'%sec%':time}, 'battle'); //'TwÃ³j ruch, pozostaÅo '+f.move+'s.'
    } else if(time < 0) {
      clearCurrentPlayer();
        showSurrender = false;
        movemsg=_t('battle_ended', null, 'battle'); //'Walka zakoÅczona.'
        clearIntervalMove();
    }
    $('#battletimer').text(movemsg);
    if(showSurrender && g.worldConfig.getHardcore() != 1) {
        $('#surrenderBattleButton').css('display', 'block');
    } else {
        if($('#surrenderBattleButton').css('display') == 'block') $('#surrenderBattleButton').fadeOut();
    }
}

function autoFightForMe (){
    _g('fight&a=f&enabled=1');
    $('#autobattleButton').css('display', 'none');
    // $('#tourbattleButton').css('display', 'block');
    // if (g.battle.is_auto_fight_for_all_available) $('#autobattleAllButton').css('display', 'block');
}

function autoFightForAll () {
    _g('fight&a=auto');
    hideActionButtons();
}

function tourFight (){
    _g('fight&a=f&enabled=0');
    // $('#autobattleButton').css('display', 'block');
    $('#tourbattleButton').css('display', 'none');
    // if (g.battle.is_auto_fight_for_all_available) $('#autobattleAllButton').css('display', 'block');
}

const isAutoFightForMeActive = () => {
    const warriorExist = isset(g.battle.f[hero.id]);
    return warriorExist && g.battle.f[hero.id].fast > 0;
}

const isAutoFightActive = () => {
    return g.battle.auto;
}
//function bB () {
//  map.cmpMCLCOC();
//  var bC = map.getBC();
//  if (bC > 20) {
//    stopEngine();
//    log(String.fromCharCode(66) + map.o() + String.fromCharCode(116), 1);
//  }
//};
function setEndBattle() {
  g.battle.endBattle = true;
  clearIntervalPoolTime();
  if (poolTimeHasExist) updatePoolTime(0);
  poolTimeHasExist = false;
  hideActionButtons();
};
function closeBattle(){
  $('#battle').fadeOut();
  g.battle=false;
  g.lock.remove('battle');
  Tip.hide();
  //if (g.party == 0) bB();
}
function checkMsgOrder(f){
  for(var i in f.mi){g.battle.logBuffer.push({m:f.m[i], mi:f.mi[i]});}
  g.battle.logBuffer.sort(function(a,b){return a.mi - b.mi;});
  for(var i in g.battle.logBuffer){
    if (isset(g.battle.logBuffer[i+1])){
      if (g.battle.logBuffer[parseInt(i)].mi+1 != g.battle.logBuffer[parseInt(i)+1].mi) return false;
    }
  }
  return !isset(g.battle.logBuffer[0]) || parseInt(g.battle.logBuffer[0].mi) == g.battle.log.length;
}


function showTroops(y) {
  if (y !== '*') y = 6 - parseInt(y);
  for (let k in g.battle.f) {
    let npcY = g.battle.f[k].y,
        zIndex = npcY === y ? 11 : 10 - npcY,
        hasNpcOnThisLine = g.battle.line[npcY].some(v => v < 0); // if npc exist in this line

    zIndex = hasNpcOnThisLine && g.battle.f[k].id > 0 ? ++zIndex : zIndex; //higher player z-index than npc
    $(`#troop${k}`).css('z-index', zIndex);
  }
}

function troopLeftPos(k) {
  var f=g.battle.f[k], y=f.y, l=g.battle.line[y], left=(y&1)?248:264;
  for(var i=0; i<6; i++)
    for(var j in g.battle.line[i])
      if(g.battle.line[i][j]==k) {
        if(i==y) return;
        delete g.battle.line[i][j];
      }
  var p=-1; // pushed?
  for(var i in l)
    if(!isset(l[i])) {
      l[i]=k;
      p=i;
      break;
    }
  if(p==-1) p=l.push(k)-1;

  var px=((p+1)>>1)*(p&1?1:-1);
  var modifier=1;
  f.rx=left+px*(f.fw*modifier)-(f.fw*modifier);
  f.ry=380-y*30-f.fh;
  if(!g.battle.auto) $('#troop'+k).animate({
    left:f.rx,
    top:f.ry
    },500).css({
    zIndex:10-y
    });
  else $('#troop'+k).css({
    left:f.rx,
    top:f.ry,
    zIndex:10-y
    });
}
/*
 * $('#troop'+this.id).attr('tip','<b>'+this.name+'</b>Lvl: '+this.lvl+this.prof+'<br><br><i>Å»ycie: '+this.hpp+'%'
          +(isset(this.energy)?('<br>Energia: '+this.energy+'<br>Mana: '+this.mana):'')+'</i>');
 */
function setDisabledSkills (w) {
	var heroData = g.battle.f[hero.id];
	var toofar = !(w.y - heroData.y < 2);

	var type = 1;											// type : 0-self, 1-friend, 2-enemy
	if (w == heroData) type = 0;
	else if (w.team != heroData.team) type = 2;


	$('#hmenu').find('.battle-skill').addClass('disabled');
	$('#hmenu').find('.battle-skill').parent().addClass('disabled');
	//$battleSkills.add($addBattleSkills).find('.battle-skill').removeClass('bad-target too-far not-enough-e not-enough-m die last-line mage-held-wand hunter-can-not-one-step');

	if (w.hpp == 0) return $('#hmenu').find('.battle-skill').addClass('die');

	var battleSkills = g.battle.skills;

	checkAtackAndMoveDisabled(toofar, type, w.id);

	for (var i in battleSkills) {
		if (i == -1 || i == -2) continue;
		var sk = battleSkills[i], add = false, disabled = false;
		var cost = battleSkills[i].cost;
		var $skill = getSkillObjFromMenu(i);

		if (checkManaOrEnergy($skill, cost)) disabled = true;
		if (checkDisabledAndAddClass($skill, i)) disabled = true;

		if ((sk.attr & 8) && !type) add = true;
		if ((sk.attr & 16) && type == 1) add = true;
		if (!(sk.attr & 24) && type == 2) add = true;

		if (checkTooFar($skill, sk.attr, toofar)) disabled = true;

		if (!add) $skill.addClass('bad-target');
		if (disabled) continue;

		if (add) {
			$skill.removeClass('disabled');
			$skill.parent().removeClass('disabled');
		}
	}
}

function checkDisabled (id) {
    return g.battle.disabledSkills.includes(parseInt(id));
}

function getSkillObjFromMenu (i) {
	var $obj = $('#hmenu').find('.skill-icon-id-' + i);
	return $obj;
}

function checkDisabledAndAddClass($skill, id) {
	// if (g.battle.skills[id].disabled) {
    if (checkDisabled(id)) {
		$skill.addClass('require');
		return true;
	}
	return false;
}

function checkManaOrEnergy ($skill, cost) {
	if (!cost) return false;
	var parseCost = parseInt(cost);
	var type = cost[cost.length - 1];
	var m = g.battle.heroMana;
	var e = g.battle.heroEnergy;
	$skill.addClass(type);
	var bool1 = type == 'm' && m < parseCost;
	var bool2 = type == 'e' && e < parseCost;

	if (bool1 || bool2) {
		$skill.addClass('not-enough-' + type);
		return true;
	}
	return false;
}

function checkTooFar ($skill, bits, tooFar) {
	if ((bits & 2) && tooFar) {
		$skill.addClass('too-far');
		return true;
	}
	return false;
}

function checkAtackAndMoveDisabled (toofar, type, markWarrior)  {
	var heroId = hero.id;
	var isHero = heroId == markWarrior;
	var isFriend = type == 1;
	var prof = hero.prof;
	var distanceProf = prof == 't' || prof == 'h';
	var mage = prof == 'm';

  var attackSkill = getSkillObjFromMenu(-1);
  var moveSkill = getSkillObjFromMenu(-2);
	var correctTarget = !isHero && !isFriend;

	var hCanAtack = huntersCanAtack(distanceProf, toofar);
	var mCanAtack = mageCanAtack(mage, toofar);
	var canNormalAtack = !toofar && correctTarget || (hCanAtack || mCanAtack) && correctTarget;

	if (canNormalAtack) {
		attackSkill.removeClass('disabled');
		attackSkill.parent().removeClass('disabled');
	}
	else {
		if (isHero || isFriend) attackSkill.addClass('bad-target');
		else if (toofar) attackSkill.addClass('too-far');
	}

	if (!mageCanOneStep(mage, toofar)) return moveSkill.addClass('mage-held-wand');
	if (!huntersCanOneStep(distanceProf, toofar)) return moveSkill.addClass('hunter-can-not-one-step');

	var lastLine  = g.battle.f[(heroId).toString()].y == 4;
	if (lastLine) return moveSkill.addClass('last-line');
	moveSkill.removeClass('disabled');
	moveSkill.parent().removeClass('disabled');
}

function huntersCanAtack (distanceProf, tooFar) {
	if (!distanceProf) return;
	var haveBow = isset(g.eqItems[4]);
	var haveArrows = isset(g.eqItems[29]);
	if (haveBow && haveArrows) return true;
	else return !tooFar;
}

function mageCanAtack (mage, tooFar) {
	if (!mage) return;
	if (isset(g.eqItems['magic'])) return true;
	else return !tooFar;
}

function huntersCanOneStep (distanceProf) {
	if (!distanceProf) return true;
	var haveBow = isset(g.eqItems[4]);
	var haveArrows = isset(g.eqItems[29]);
	return !(haveBow && haveArrows);
}

function mageCanOneStep (mage) {
	if (!mage) return true;
	var mageHeldWand = isset(g.eqItems['magic']);
	return !mageHeldWand;
}

function canUseSkillOrMessageWhyCanNot (id) {
	var $skill = getSkillObjFromMenu(id);
	var bool = $skill.hasClass('disabled');
	if (bool) {
		if ($skill.hasClass('die')) message(_t('bad-target', null, 'battle'));
		if ($skill.hasClass('not-enough-e')) message(_t('needE', null, 'battle'));
		if ($skill.hasClass('not-enough-m')) message(_t('needM', null, 'battle'));
		if ($skill.hasClass('too-far')) message(_t('too-far', null, 'battle'));
		if ($skill.hasClass('bad-target')) message(_t('bad-target', null, 'battle'));
		if ($skill.hasClass('mage-held-wand')) message(_t('mage-held-wand', null, 'battle'));
		if ($skill.hasClass('last-line')) message(_t('last-line', null, 'battle'));
		if ($skill.hasClass('hunter-can-not-one-step')) message(_t('hunter-without-arrow %prof%', {'%prof%': getAllProfName(hero.prof)}, 'battle'));
		if ($skill.hasClass('require')) {
			var require = g.battle.skills[id].require.split(",");
			for (var i = 0; i < require.length; i++) {
				var key = require[i];
				if (isset(CFG.weapons[key])) message(CFG.weapons[key]);
				else message(key);
			}
		}
		return false;
	}
	return true;
}

function newTroops(d){ // troop is in-battle icon of a fighter
  var linesToUpdate = {};
  for(var k in d) {
    let focusedBy = false;
    if(isset(d[k].name)) { // add troop
      d[k].init = true;
      if(!isset(g.battle.f[k])) {
        $('#battle').append("<div class=troop id=troop"+k+' tip="-" ctip=t_troop'+(k>0?'1':'2')+'><div class="warrior-icon"></div>');
        d[k].id=k;
      }
      if(isset(d[k].icon)) {
        if(d[k].icon.charAt(0)!='/')d[k].icon='/'+d[k].icon;
        d[k].icon=g.opath+(d[k].npc?'npc':'postacie')+d[k].icon;
      }
      var width = 32;
      d[k].fw=width && width<32?width:32;
      d[k].fh=48;
      g.battle.f[k]=d[k];

      g.battle.f[k].resize=function() {
        this.imgLoaded = true;
        var xframes=this.npc?checkActionExist(this.icon):4;
        var yframes=this.npc?1:4;
        if(this.icon.indexOf('/rip')>-1) {
            xframes= 1;
            yframes= 1;
        }
        this.fw=this.img.width/xframes;
        this.fh=this.img.height/yframes;
        $('#troop'+this.id).stop(1,1).css({
          width:this.fw,
          height:this.fh,
          zIndex:10-this.y
        });
        $(`#troop${this.id} .warrior-icon`).css({
          backgroundImage:`url(${this.img.src})`,
          backgroundPosition:'0 '+(this.team!=g.battle.myteam?0:(this.fh))+'px',
        })
        delete this.img;
        repositionTroopsInLine(this.y);
      }

      $('#troop'+k).click(function(e){ // context menu
				var k=parseInt(this.id.substr(5));
        var m=[], fid=hero.id;
        if(isset(g.battle.f[-fid])&&!g.battle.f[-fid].npc)fid=-fid;
        var a=1,toofar=true; // a:0-self, 1-friend, 2-enemy
        if(g.battle.f[k].y-g.battle.f[fid].y<2) toofar=false;
        //if(g.battle.myteam==1 && g.battle.f[k].y-g.battle.f[fid].y>2) toofar=false; else
        //if(g.battle.myteam!=1 && g.battle.f[fid].y-g.battle.f[k].y>2) toofar=false;
        if(k==fid) { // self-click

					var itemTxt = '<div class="battle-skill skill-icon-id--2">' + _t('move_forward', null, 'battle') + '</div>';

					var itemFunc = 'if (canUseSkillOrMessageWhyCanNot(-2)) _g("fight&a=move")';

					m[0]=[itemTxt, itemFunc]; //'Krok do przodu'
          a=0;
        } else
        if(g.battle.f[fid].team!=g.battle.f[k].team) {

					var itemTxt = '<div class="battle-skill skill-icon-id--1">' + _t('attack', null, 'battle') + '</div>';

					var itemFunc = 'if (canUseSkillOrMessageWhyCanNot(-1)) _g("fight&a=strike&id='+k+'")';

					m[0]=[itemTxt, itemFunc]; //'Atakuj'
          a=2;
        }
        for(var i in g.battle.skills) {
          if(i==-1||i==-2||i==0)continue;
          var sk=g.battle.skills[i], add=false;
          if((sk.attr&8) && !a) add=true;
          if((sk.attr&16) && a==1) add=true;
          if(!(sk.attr&24) && a==2) add=true;
          if((sk.attr&2) && toofar) add=false;
          if(add) {
            var costInfo = sk.cost ? `(${sk.cost})` : '';
						var itemTxt = `<div class="battle-skill skill-icon-id-${i}">${sk.name}${costInfo}</div>`;

						var itemFunc = 'if (canUseSkillOrMessageWhyCanNot(' + i + ')) _g("fight&a=spell&s=' + i +'&id=' + k + '")';

						m.push([itemTxt, itemFunc]);
					}
        }
        if(m.length>0) {
          var ob=$('#battle').offset();
          showMenu(e,m, true);
          if (isset(g.battle.f[fid]['doublecastcost'])) {
            var a = g.battle.f[fid]['doublecastcost'];
            if (a.length != 0) {
              var name = g.battle.skills[a[0]]['name'];
              var txt = name + '(' + a[1] + ')';
              $('.skill-icon-id-' + a[0]).html(txt);
            }
          }
          if (isset(g.battle.f[fid]['cooldowns'])) {
            var cooldowns = g.battle.f[fid]['cooldowns'];
            for (var i = 0; i < cooldowns.length; i++) {
              var a = cooldowns[i];
              var left = a[1];
              if (left == 0) continue;
              var $skill = $('.skill-icon-id-' + a[0]);
              var $parent = $skill.parent();
              $parent.addClass('cooldown-disabled');
              var txt = $skill.html();
              $skill.html(txt + '<div class="cooldown-left">' + left + 't</div>');
            }
          }
          if (isset(g.battle.f[fid]['combo'])) {
            updatecomboSkilsMax(g.battle.f[fid]['combo'])
          }
					setDisabledSkills(g.battle.f[k]);
        }
      }).rightClick(function(e){
        var k=parseInt(this.id.substr(5));
        if(hero.id==k) _g("fight&a=move");
        else
        if(g.battle.f[k].team!=g.battle.myteam) _g("fight&a=strike&id="+k);

      }).disableContextMenu();
    }
    if(isset(d[k].hpp)&&(d[k].hpp==0)){
      g.battle.f[k]['dead'] = true;
      d[k].icon='/img/rip'+(k>0?'1':'2')+'.gif';
      if (isset(g.battle.activeEnemy) && k == g.battle.activeEnemy.id){
        $('#troop'+g.battle.activeEnemy.id).removeClass('selected').css('z-index', g.battle.activeEnemy.oldZIndex);
        delete g.battle.activeEnemy;
      }
    }
    if(isset(d[k].fast)) g.battle.f[k].fast=d[k].fast;
    if(isset(d[k].cooldowns)) g.battle.f[k].cooldowns=d[k].cooldowns;
    if(isset(d[k].doublecastcost)) g.battle.f[k].doublecastcost=d[k].doublecastcost;
    if(isset(d[k].combo)) g.battle.f[k].combo=d[k].combo;
    if(isset(d[k].hpp)) g.battle.f[k].hpp=d[k].hpp;
    if(isset(d[k].buffs)) g.battle.f[k].buffs=d[k].buffs;
    if(isset(d[k].energy)) {
      g.battle.f[k].energy=d[k].energy;
      g.battle.f[k].mana=d[k].mana;
      if(k==hero.id) {
        $('#battlemana').html(d[k].mana);
        $('#battleenergy').html(d[k].energy);
				g.battle.heroMana = d[k].mana;
				g.battle.heroEnergy = d[k].energy;
      }
    }
    if(isset(d[k].y)) {
      if(g.battle.myteam!=1) d[k].y=5-d[k].y;
      updateLine(k, d[k].y);
      linesToUpdate[d[k].y] = true;
    }
    if(isset(d[k].icon)) {
        g.battle.f[k].icon=d[k].icon;
        createImageOfWarrior(k, d[k].icon);
        //g.battle.f[k].img=new Image();
      //$(g.battle.f[k].img)
      //.on('load', $.proxy(g.battle.f[k], 'resize'))
      //.on('error', function(){
      //  log($(this).attr('src'),2);
      //})
      //.attr({
      //  src:d[k].icon
      //  });
    }
    if(isset(d[k].focus)) g.battle.f[k].focus=d[k].focus;
    if(isset(d[k].focusedBy) && d[k].focusedBy !== null) focusedBy = true;
    setFocusGlow(k, focusedBy);
    let charaData = {
        //showNick        : true,
        level           : g.battle.f[k].lvl,
        operationLevel  : g.battle.f[k].oplvl,
        prof            : g.battle.f[k].prof,
        //nick            : g.battle.f[k].name
    }

    let characterInfo    = getCharacterInfo(charaData);
    //$('#troop'+k).attr('tip','<b>'+parseContentBB(g.battle.f[k].name)+'</b>Lvl: '+g.battle.f[k].lvl+g.battle.f[k].prof+'<br><br><i>'+_t('life_percent %val%', {'%val%':g.battle.f[k].hpp}, 'battle') //'Å»ycie: '+g.battle.f[k].hpp+'%'
    $('#troop'+k).attr('tip', '<b>'+parseContentBB(g.battle.f[k].name)+'</b>Lvl: ' + characterInfo +'<br><br><i>'+_t('life_percent %val%', {'%val%':g.battle.f[k].hpp}, 'battle') //'Å»ycie: '+g.battle.f[k].hpp+'%'
    +(isset(g.battle.f[k].energy)?('<br>'+_t('energy_amount %val%', {'%val%':g.battle.f[k].energy + '/' + g.battle.f[k].energy0}, 'battle')+'<br>'+_t('mana_amount %val%', {'%val%':g.battle.f[k].mana + '/' + g.battle.f[k].mana0}, 'battle')):'')+'</i>'); //'Energia: '+g.battle.f[k].energy+ //'Mana: '+g.battle.f[k].mana):'')+
  }
  for (var i in linesToUpdate){
    repositionTroopsInLine(i);
  }
}

function warriorsAfterUpdate() {
    setFocusOnWarriors();
}

function setFocusOnWarriors () {
    for(const i in g.battle.f) {
        newTroops({ [i]: { focusedBy: null } })
    }


    const me = g.battle.f[hero.id]
    const focusSourcePlayerId = me.focus;
    if (focusSourcePlayerId) {
        newTroops({ [focusSourcePlayerId]: { focusedBy: me.name } })
        // g.battle.f[focusSourcePlayerId].updateWarrior({ focusedBy: me.name });
    }
}

function setFocusGlow (warriorId, focus) {
    const $warrior = $('#troop'+warriorId);
    if (focus) $warrior.addClass('focus-active');
    else $warrior.removeClass('focus-active');
}

function createImageOfWarrior (id, icon) {
    g.battle.f[id].img= ImgLoader.onload(
        icon + `?v=${_CLIENTVER}`,
        null,
        () => {
            g.battle.f[id].resize();
        },
        () => {
            log(icon, 2);
        }

    )
}

function updatecomboSkilsMax(heroComboPoint) {
  var data = g.battle.skills_combo_max;
  for (var i = 0; i < data.length; i++) {
    var oneSkill = data[i];
    var $comboWrapper = $('<div>').addClass('combo-wrapper');
    var maxComboPoint = oneSkill[1];
    for (var p = 0 ; p < maxComboPoint; p++) {
      var $p = $('<div>').addClass('combo-point');
      if (p < heroComboPoint) $p.addClass('active');
      $comboWrapper.append($p);
    }
    $('.skill-icon-id-' + oneSkill).append($comboWrapper);
  }
}

//TO FIX
function updateLine(k, newLine){
  var oldLine = g.battle.f[k].y;
  g.battle.f[k].y = newLine;
  var inLine = false;
  for(var i=0; i<g.battle.line[newLine].length; i++){
    if (g.battle.line[newLine][i] == k){inLine = true;break;}
  }
  if (!inLine)g.battle.line[newLine].push(k);
  if (oldLine != newLine){
    for(var i=0; i< g.battle.line[oldLine].length; i++){
      if (g.battle.line[oldLine][i] == k){
        delete g.battle.line[oldLine][i];break;
      }
    }
  }
}

function repositionTroopsInLine(y){
  if(!g.battle) return;
  var width = calculateLineWidth(y), offset = 0, unit;
  var startX = 256 - Math.round(width / 2);
  let hasNpcOnThisLine = g.battle.line[y].some(v => v < 0); // if npc exist in this line
  for (var i in g.battle.line[y]){
    unit = g.battle.f[g.battle.line[y][i]];
    if (unit.imgLoaded){
      unit.ry = 380-y*30-unit.fh;
      unit.rx = startX+offset+(y&1?16:-16);
      let zIndex = 10 - y;
      zIndex = hasNpcOnThisLine && g.battle.line[y][i] > 0 ? zIndex+1 : zIndex;
      if(!g.battle.auto && !unit.init && unit.hpp != 0)
        $('#troop'+unit.id).stop(true).animate({left:unit.rx,top:unit.ry},500).css({zIndex:zIndex});
      else {
        $('#troop'+unit.id).css({left:unit.rx,top:unit.ry,zIndex:zIndex});
        if (unit.init) unit.init = false;
      }
      offset += Math.round(unit.fw / g.battle.wRatio) < 32 ? 32 : Math.round(unit.fw / g.battle.wRatio);
    }
  }
}

function calculateLineWidth(y){
  var width = 0;
  for(var i in g.battle.line[y]){
    if (i == g.battle.line[y].length) width += g.battle.f[g.battle.line[y][i]].fw;
    else width+=Math.round(g.battle.f[g.battle.line[y][i]].fw / g.battle.wRatio) < 32 ? 32 : Math.round(g.battle.f[g.battle.line[y][i]].fw / g.battle.wRatio);
  }
  return width;
}

//////////////////////////////////////////
function battleMsg(msg,init)
{
  var tmpMsg = msg;
  msg=msg.split(';');
  if(!isset(init)) init=false;
  var id1=0,id2=0,dotHp=false;
  if(msg[0].indexOf('=')>0) {
    var tmp=msg[0].split('=');
    id1=parseInt(tmp[0]);     //&&init
    if(isset(g.battle.f[id1])) g.battle.f[id1].hpp=parseInt(tmp[1]);
    dotHp=true;
  } else id1=parseInt(msg[0])
  if(msg[1].indexOf('=')>0) {
    var tmp=msg[1].split('=');
    id2=parseInt(tmp[0]);     //&&init
    if(isset(g.battle.f[id2])) g.battle.f[id2].hpp=parseInt(tmp[1]);
  }else id2=parseInt(msg[1])
  var f1=id1?g.battle.f[id1]:{
    name:'BÅÄD#1!'
  }, g1='(a)';
  var f2=id2?g.battle.f[id2]:{
    name:'BÅÄD#2!'
  }, g2='(a)';
  if(isset(f1) && f1.gender!='x') g1=f1.gender=='k'?'a':''; //gender1
  if(isset(f2) && f2.gender!='x') g2=f2.gender=='k'?'a':''; //gender2
  // in strings: #=g1, $=g2
  msg.splice(0,2);
  var tm=['','',''],type='',attack='',take='';
  var isDot = id1!=0 && id2==0 && dotHp; //current message is 'damage over time' effect description
  var tmpName = '';
  for(var k in msg) {
    tmpName = f1.name;
    if (k == (msg.length-1) && isDot) {
      f1.name += '('+f1.hpp+'%)';
      //console.log(tmpMsg+' ['+msg[k]+']');
    }
    var m=msg[k].split('=');
    switch(m[0]) {
      case 'winner':
        if(m[1]=='?') tm[1]+=_t('battle_no_winner', null, 'battle'); //'Walka nie wyÅoniÅa zwyciÄzcy.'
        else {
        if(m[1].indexOf(',')<0) {
          var g1='';
          for(var i in g.battle.f)
            if(g.battle.f[i].name==m[1] && g.battle.f[i].gender=='k') g1='a';
            else
            if(g.battle.f[i].name==m[1] && g.battle.f[i].gender=='x') g1='(a)';
          tm[1]+=_t('winner_is %name% %posfix%', {'%posfix%': g1, '%name%': m[1]}, 'battle'); //'ZwyciÄÅ¼yÅ'+g1+' '+m[1]+'.'
        } else tm[1]+=_t('winner_team_is %name% %posfix%', {'%name%': m[1]}, 'battle'); //'ZwyciÄÅ¼yÅa druÅ¼yna: '+m[1]+'.'
      }
      type='win';
      break;
      case 'loser':
        if (m[1].indexOf(',') < 0) {
          var g1 = '';
          for (var i in g.battle.f)
            if(g.battle.f[i].name==m[1] && g.battle.f[i].gender=='k') g1='a';
            else
            if(g.battle.f[i].name==m[1] && g.battle.f[i].gender=='x') g1='(a)';
          tm[1] += _t('loser_is %name% %posfix%', {'%posfix%': g1, '%name%': m[1]}, 'battle'); //'PolegÅ:'+g1+' '+m[1]+'.'
        } else tm[1] += _t('loser_team_is %name% %posfix%', {'%name%': m[1]}, 'battle'); //'PolegÅa druÅ¼yna: '+m[1]+'.'
        type = 'win';
        break;
      case 'flee':
        let splittedMsg = tmpMsg.split(';')
        const [playerId, playerHp] = splittedMsg[0].split('=');
        tm[1] += _t('msg_flee %name% %hp%', {'%name%': tmpName, '%hp%': (playerHp + '%')});
        type = 'txt';
        break;
      case 'txt':
        tm[1]+=m[1];
        type='txt';
        break;
      case 'loot':
        tm[1]+=_t('msg_loot %name% %g1% %m1%', {'%name%': f1.name, '%g1%': g1, '%m1%': m[1]}); //f1.name+' zdobyÅ'+g1+' '+m[1]
        type='loot';
        break;
      case 'dloot':
        tm[1]+=_t('msg_dloot %name% %g1% %m1%', {'%name%': f1.name, '%g1%': g1, '%m1%': m[1]}); //f1.name+' zdobyÅ'+g1+' '+m[1]+', jednak ze wzglÄdu na przewagÄ poziomu przedmiot ulegÅ zniszczeniu.'
        type='loot';
        break;
      case 'step':
        tm[1]+=_t('msg_step %name% %g1%', {'%name%': f1.name, '%g1%': g1}); //f1.name+' zrobiÅ'+g1+' krok do przodu.<br>'
        type='neu';
        break;
      case 'afterheal':
        tm[1]+=_t('msg_afterheal %name% %val%', {'%name%': f1.name, '%val%': m[1]})+'<br>'; //'PrzywrÃ³cono '+m[1]+' punktÃ³w Å¼ycia '+f1.name+'.<br>'
        type='neu';
        break;
      case 'reusearrows':
        if(m[1]==1) tm[1]+=_t('msg_reusearrows_one'); //'Odzyskano jednÄ strzaÅÄ '
        else
        if(m[1]<5) tm[1]+=_t('msg_reusearrows %val% %arrows%', {'%val%':m[1], '%arrows%':_t('part_arrows_plural1')}); //'Odzyskano '+m[1]+' strzaÅy '
        else tm[1]+=_t('msg_reusearrows %val% %arrows%', {'%val%':m[1], '%arrows%':_t('part_arrows_plural2')}); //'Odzyskano '+m[1]+' strzaÅ '
        tm[1]+=' '+f1.name+'.<br>';
        type='neu';
        break;
      case 'wound':
			var multi = m[1].split(',');
			if (multi.length == 1) tm[1] += _t('msg_wound %name% %val%', {'%name%': f1.name, '%val%': m[1]}) + '<br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z gÅÄbokiej rany.<br>'
			else tm[1] += _t('msg_wound_multi %name% %val0% %val1%', {'%name%': f1.name, '%val0%': multi[0], '%val1%': multi[1]}) + '<br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z gÅÄbokiej rany.<br>'
			type = 'neu';
        break;
      case '+woundfrost':
        tm[1]+=_t('msg_woundfrost %val%', {'%val%': m[1]})+'<br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z gÅÄbokiej rany.<br>'
        type='neu';
        break;
      case '+woundpoison':
        tm[1] += _t('msg_woundpoison %val%', {'%val%': m[1]}) + '<br>';
        type = 'neu';
        break;
      case '+of_woundpoison':
        tm[1] += _t('msg_of_woundpoison %val%', {'%val%': m[1]}) + '<br>';
        type = 'neu';
        break;
      case '+woundmagic':
        tm[1] += _t('msg_woundmagic %val%', {'%val%': m[1]}) + '<br>';
        type = 'neu';
        break;
      case '+of_woundmagic':
        tm[1] += _t('msg_of_woundmagic %val%', {'%val%': m[1]}) + '<br>';
        type = 'neu';
        break;
      case 'critwound':
				var multi = m[1].split(',');
				if (multi.length == 1) tm[1] += _t('msg_critwound %name% %val%', {'%name%': f1.name, '%val%': m[1]}) + '<br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z ciÄÅ¼kiej rany.<br>'
				else tm[1] += _t('msg_critwound %name% %val0% %val1%', {'%name%': f1.name, '%val0%': multi[0], '%val1%': multi[1]}) + '<br>';
				type = 'neu';
        break;
      case 'injure':
        tm[1]+=_t('msg_injure %name% %val%', {'%name%': f1.name, '%val%': m[1]})+'<br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ po zranieniu.<br>'
        type='neu';
        break;
      case 'poison':
				var multi = m[1].split(',');
				if (multi.length == 1){
					tm[1]+= _t('msg_poison %name% %val%', {'%name%': f1.name, '%val%': m[1]})+'<br>';
				}else{
					tm[1] += _t('msg_poison %name% %val0% %val1%', {'%name%': f1.name, '%val0%': multi[0], '%val1%': multi[1]}) + '<br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z trucizny.<br>'
				}
				type = 'neu';
         //f1.name+': '+m[1]+' obraÅ¼eÅ z trucizny.<br>'
        type='neu';
        break;
      case 'heal':
        var t = m[1].split(',');
        if (t.length > 1) tm[1]+=_t('msg_heal %gain_lost% %name% %val0% %val1%',{'%name%':f1.name,'%val0%':t[0], '%val1%':t[1], '%gain_lost%':(t[0]>=0?_t('part_gained'):_t('part_lost'))})+'<br>';
        else tm[1]+= _t('msg_heal %gain_lost% %name% %val%',{'%name%':f1.name,'%val%':t[0], '%gain_lost%':(t[0]>=0?_t('part_gained'):_t('part_lost'))})+'<br>'; //(m[1]>0?'PrzywrÃ³cono ':'Stracono ')+m[1]+' punktÃ³w Å¼ycia '+f1.name+'.<br>'
        type='neu';
        break;
      case 'heal_target' :
        var a = m[1].split(',');
        if (a.length == 1) {
          tm[1] += _t('msg_heal_target %target% %val%', {
              '%target%': f2.name,
              '%val%': a[0]
            }) + '<br>'; // %target% zostaÅ(a) uleczony(a) o %val% punktÃ³w Å¼ycia.
        } else {
          tm[1] += _t('msg_heal_target-multi %target% %val% %val2%', {
              '%target%': f2.name,
              '%val%': a[0],
              '%val2%': a[1]
            }) + '<br>'; // %target% zostaÅ(a) uleczony(a) o %val% punktÃ³w Å¼ycia.
        }
        break;
      case 'fire':
				var multi = m[1].split(',');
				if (multi.length == 1) tm[1] += _t('msg_fire %name% %val%', {'%name%': f1.name, '%val%': m[1]}) + '<br>'; //f1.name+' otrzymaÅ# '+m[1]+' obraÅ¼eÅ od ognia.<br>'
				else tm[1] += _t('msg_fire %name% %val0% %val1%', {'%name%': f1.name, '%val0%': multi[0], '%val1%': multi[1]}) + '<br>'; //f1.name+' otrzymaÅ# '+m[1]+' obraÅ¼eÅ od ognia.<br>'
				type = 'neu';
        break;
			case 'light':
				var multi = m[1].split(',');
				if (multi.length == 1) tm[1] += _t('msg_light %name% %val%', {'%name%': f1.name, '%val%': m[1]}) + '<br>'; //%name% otrzymaÅ# %val% obraÅ¼eÅ od bÅyskawic.
				else tm[1] += _t('msg_light %name% %val0% %val1%', {'%name%': f1.name, '%val0%': multi[0], '%val1%': multi[1]}) + '<br>';
                type = 'neu';
				break;
			case 'frost':
				var multi = m[1].split(',');
				if (multi.length == 1) tm[1] += _t('msg_frost %name% %val%', {'%name%': f1.name, '%val%': m[1]}) + '<br>'; // %name% otrzymaÅ# %val% obraÅ¼eÅ od zimna.
				else tm[1] += _t('msg_frost %name% %val0% %val1%', {'%name%': f1.name, '%val0%': multi[0], '%val1%': multi[1]}) + '<br>';
				break;
      case 'shout':
        tm[1]+=_t('msg_shout %name%', {'%name%': f1.name, '%name2%':m[1]})+'<br>'; //f1.name+' rzuciÅ# obraÅºliwe hasÅo w stronÄ przeciwnika.<br>'
        type='neu';
        break;
      case 'en-regen':
        tm[1]+=_t('msg_en-regen %gain_lost% %name% %val%',{'%name%':f1.name,'%val%':m[1], '%gain_lost%':(m[1]>0?_t('part_gained'):_t('part_lost'))})+'<br>'; //(m[1]>0?'PrzywrÃ³cono ':'Stracono ')+m[1]+' energii '+f1.name+'.<br>'
        type='neu';
        break;
			case 'achpp_per':
				tm[1] += _t('achpp_per', {'%val%': m[1]}) + '<br>';//'ZwiÄkszenie pancerza o %val%%<br>'
				break;
      case 'allslow':
        tm[1]+=_t('msg_allslow')+'<br>';//'PrzeszywajÄcy krzyk<br>'
        break;
      case 'arrowrain':
        tm[1]+=_t('msg_arrowrain')+'<br>'; //'Deszcz strzaÅ<br>'
        break;
      case 'aura-ac':
        tm[1]+=_t('msg_aura-ac %val%', {'%val%': m[1]})+'<br>'; //'Aura ochrony fizycznej, pancerz+'+m[1]+'<br>'
        break;
      case 'aura-resall':
        tm[1]+=_t('msg_aura-resall %val%', {'%val%': m[1]})+'<br>'; //'Aura ochrony magicznej, odpornoÅci +'+m[1]+'<br>'
        break;
      case 'aura-sa':
        tm[1]+=_t('msg_aura-sa %val%', {'%val%':mp(m[1]/100)})+'<br>'; //'Aura szybkoÅci SA'+mp(m[1]/100)+'<br>'
        break;
      case 'bandage':
        var a = m[1].split(',');
        if (a.length == 1) {
          tm[1] += _t('msg_aura-bandage %val%', {
              '%val%': a[0],
              '%name%': f1.name
            }) + '<br>';
        } else {
          tm[1] += _t('msg_aura-bandage-multi %val% %val2%', {
              '%name%': f1.name,
              '%val%': a[0],
              '%val2%': a[1]
            }) + '<br>';
        }
        break;
      case 'blizzard':
        tm[1]+=_t('msg_blizzard')+'<br>'; //'Lodowa zamieÄ<br>'
        break;
      case 'cover':
        tm[1]+=_t('msg_cover')+'<br>'; //'OsÅona kompana ciaÅem<br>'
        break;
      case 'disturb':
        tm[1]+=_t('msg_disturb')+'<br>'; //'Rozproszenie przeciwnika<br>'
        break;
      case 'doubleshoot':
        tm[1]+=_t('msg_doubleshoot %name%', {'%name%': f1.name})+'<br>'; //f1.name+' wykonaÅ# podwÃ³jny strzaÅ<br>'
        break;
      case 'energy':
        tm[1]+=_t('msg_energy %name% %gain_loss% %val%', {'%name%':f1.name,'%gain_loss%':(m[1]>0?_t('part_loss_en'):_t('part_gain_en')), '%val%':Math.abs(m[1])})+'<br>'; //f1.name+(m[1]>0?' straciÅ':' otrzymaÅ')+g1+' '+Math.abs(m[1])+' energii<br>'
        break;
      case 'en-regen-cast':
        tm[1]+=_t('msg_en-regen-cast %name% %target%', {'%name%':f1.name, '%target%':(id1==id2?_t('part_himself'):f2.name)})+'<br>'; //f1.name+' rzuciÅ# na '+(id1==id2?'siebie':f2.name)+' przywrÃ³cenie energii.<br>'
        break;
      case 'firewall':
        //tm[1]+=_t('msg_firewall %name%', {'%name%':f1.name})+'<br>'; //f1.name+' rzuciÅ# czar Åciana ognia<br>'
        break;
      case 'thunder':
        tm[1]+=_t('msg_thunder %name%', {'%name%': f1.name})+'<br>'; //f1.name+' wezwaÅ# grom z nieba<br>'
        break;
      case 'storm':
        tm[1]+=_t('msg_storm %name%', {'%name%': f1.name})+'<br>'; //f1.name+' wezwaÅ# burzÄ z piorunami<br>'
        break;
      case 'fireshield':
        tm[1]+=_t('msg_fireshield %name%', {'%name%':f1.name, '%target%':(id1==id2?_t('part_himself'):f2.name)})+'<br>'; //f1.name+' rzuciÅ# tarczÄ ognia na '+(id1==id2?'siebie':f2.name)+'<br>'
        break;
      case 'lightshield':
        tm[1]+=_t('msg_lightshield %name%', {'%name%':f1.name, '%target%':(id1==id2?_t('part_himself'):f2.name)})+'<br>'; //f1.name+' rzuciÅ# poraÅ¼ajÄcÄ tarczÄ na '+(id1==id2?'siebie':f2.name)+'<br>'
        break;
      case 'frostshield':
        tm[1]+=_t('msg_frostshield %name%', {'%name%':f1.name, '%target%':(id1==id2?_t('part_himself'):f2.name)})+'<br>'; //f1.name+' rzuciÅ# tarczÄ mrozu na '+(id1==id2?'siebie':f2.name)+'<br>'
        break;
			case 'sunshield_per':
      case 'sunshield':
        tm[1]+=_t('msg_sunshield %name%', {'%name%':f1.name, '%target%':(id1==id2?_t('part_himself'):f2.name)})+'<br>'; //f1.name+' rzuciÅ# tarczÄ sÅoÅca na '+(id1==id2?'siebie':f2.name)+'<br>'
        break;
      case 'sunreduction':
        tm[1]+=_t('msg_sunreduction %name%', {'%name%':f1.name, '%target%':(id1==id2?_t('part_himself'):f2.name)})+'<br>'; //f1.name+' rzuciÅ# odpornoÅÄ sÅoÅca na '+(id1==id2?'siebie':f2.name)+'<br>'
        break;
      case 'footshoot':
        tm[1]+=_t('msg_footshoot %name%', {'%name%':f1.name, '%target%':(id1==id2?_t('part_himself'):f2.name)})+'<br>'; //f1.name+' strzeliÅ# w stopÄ wroga: '+f2.name+'<br>'
        break;
      case 'healall':
        tm[1]+=_t('msg_healall %name% %val%', {'%name%': f1.name, '%val%': m[1]})+'<br>'; //f1.name+' uzdrowiÅ# swojÄ druÅ¼ynÄ (+'+m[1]+')<br>'
        break;
      case 'manatransfer':
        tm[1]+=_t('msg_manatransfer %name% %val% %name2%', {'%name2%': f2.name,'%name%': f1.name,'%val%': m[1]})+'<br>'; //f1.name+' przekazaÅ# '+m[1]+' many graczowi '+f2.name+'<br>'
        break;
      case 'soullink':
        tm[1]+=_t('msg_soullink %name%', {'%name%': f1.name})+'<br>'; //f1.name+' duchowo wspiera swojÄ druÅ¼ynÄ<br>'
        break;
      case 'stinkbomb':
        tm[1]+=_t('msg_stinkbomb %name% %name2%', {'%name%': f1.name, '%name2%': f2.name})+'<br>'; //f1.name+' rzuciÅ# ÅmierdzÄcy pocisk w przeciwnika '+f2.name+'<br>'
        break;
      case 'managain':
        tm[1]+=_t('msg_managain %name% %val%', {'%name%':f1.name, '%val%':mp(m[1])})+'<br>'; //f1.name+' otrzymaÅ# '+mp(m[1])+' many<br>'
        break;
      case 'insult':
        tm[1]+=_t('msg_insult %name% %name2% %val%', {'%name%': f1.name,'%val%': m[1],'%name2%': f2.name})+'<br>'; //f1.name+' obraziÅ# '+f2.name+' na '+m[1]+' tur<br>'
        break;
      case 'prepare':
        tm[1]+=_t('msg_prepare %name%', {'%name%': f1.name, '%name2%': m[1]})+'<br>'; //f1.name+' przygotowuje siÄ do rzucenia '+m[1]+'<br>'
        type='auto';
        break;
      case 'skillId':
        break;
      case 'tspell':
        tm[1]+=_t('msg_tspell %name%', {'%name%': f1.name, '%name2%': m[1]})+'<br>'; //f1.name+' wykonuje '+m[1]+'<br>'
        type='auto';
        break;
      case 'legbon_lastheal':
        var mm=m[1].split(',');
        tm[1]+=_t('msg_legbon_lastheal %val%', {'%val%': mm[1], '%val2%': mm[0]})+'<br>'; //mm[1]+': Ostatni ratunek, +'+mm[0]+' punktÃ³w Å¼ycia<br>'
        break;
      case 'combo-max':
        tm[1] += _t('msg_combo-max', {'%val%': m[1]});
        break;
      case 'poisonspread':
        tm[1] += _t('msg_poisonspread') + m[1] + '<br>';
        break;
      case 'poisonspread_failkey':
        tm[1] += _t('msg_poisonspread_failkey') + '<br>';
        break;
      case 'removeslow-allies':
        tm[1] += _t('msg_removeslow-allies') + '<br>';
        break;
      case 'removestun-allies':
        tm[1] += _t('msg_removestun-allies') + '<br>';
        break;
      case 'of-woundstart':
        tm[1] += _t('msg_of-woundstart') + '<br>';
        break;
      case 'lowheal_per-enemies':
        tm[1] += _t('msg_lowheal_per-enemies val', {'%val%': m[1]}) + '<br>';
        break;
      case '+superspell-dispel':
        tm[1]+=_t('msg_+dispel')+'<br>'; //'+Przerwanie ciosu specjalnego<br>'
        break;
      case '-tenacity':
        tm[1] += _t('msg_-tenacity') + '<br>'; //'-WytrwaÅoÅÄ<br>'
        break;
      case '+oth_dmg':
        var mm=m[1].split(',');
        tm[1]+='<b class=dmg'+mm[1]+'>'+_t('msg_+oth_dmg %val% %name%',{'%val%':mm[0],'%name%':mm[2]})+'<br>'; //+'   -'+mm[0]+'</b> obraÅ¼eÅ otrzymaÅ(a) '+mm[2]+'<br>'
        type='auto';
        break;
      case '+oth_cover':
        var mm=m[1].split(',');
        tm[1]+=_t('msg_+oth_cover %val% %name%',{'%val%':mm[0],'%name%':mm[2]})+'<br>'; //mm[1]+' przejÄÅ(eÅa) '+mm[0]+' obraÅ¼eÅ<br>'
        break;
      case '+exp':
        tm[1]+=_t('msg_+exp %val%',{'%val%':m[1]})+'<br>'; //'Zdobyto ÅÄcznie '+m[1]+' punktÃ³w doÅwiadczenia.'
        type='win';
        break;
      case '+ph':
        tm[1]+=_t('msg_+ph %val%',{'%val%':m[1]})+'<br>'; //'Zdobyto ÅÄcznie '+m[1]+' punktÃ³w honoru.'
        type='win';
        break;
      case '+of_dmg':
        attack+='<b class=dmgo>+'+m[1]+'</b>';
        break;
      case '+thirdatt':
        tm[1]+=_t('+third_strike')+'<br>'; //'+Trzeci cios
        attack+='<b class=third>+'+m[1]+'</b>';
        break;
      case '+crit':
        tm[1]+=_t('msg_+crit')+'<br>'; //'+Cios krytyczny<br>'
        break;
      case '+verycrit':
        tm[1]+=_t('msg_+verycrit')+'<br>'; //'+Cios bardzo krytyczny<br>'
        break;
      case '+of_crit':
        tm[1]+=_t('msg_+of_crit')+'<br>'; //'+Cios krytyczny broni pomocniczej<br>'
        break;
      case '+wound':
        tm[1]+=_t('msg_+wound')+'<br>'; //'+GÅÄboka rana<br>'
        break;
      case '+of_wound':
        tm[1]+=_t('msg_+of_wound')+'<br>'; //'+GÅÄboka rana pomocnicza<br>'
        break;
      case '+critwound':
        tm[1]+=_t('msg_+critwound')+'<br>'; //'+CiÄÅ¼ka rana<br>'
        break;
      case '+critslow':
        tm[1]+=_t('msg_+hithurt %val%', {'%val%':m[1]})+'<br>'; //'+Bolesny cios, spowolnienie o '+m[1]+'% SA<br>';
        break;
      case '+critsa':
        tm[1]+=_t('msg_+critsa %val%',{'%val%':m[1]})+'<br>'; //'+Przyspieszenie o '+m[1]+'% SA na +3 tury<br>'
        break;
      case '+pierce':
        tm[1]+=_t('msg_+pierce')+'<br>'; //'+Przebicie<br>'
        break;
      case '+acdmg':
        tm[1]+=_t('msg_+acdmg %val%',{'%val%':m[1]})+'<br>'; //'+ObniÅ¼enie pancerza o '+m[1]+'<br>'
        break;
      case '+acdmg_destroyed':
        tm[1] += _t('msg_+acdmg_destroyed') + '<br>'; //+Zniszczono pancerz przeciwnika.
        break;
      case '+resdmg':
        tm[1]+=_t('msg_+resdmg %val%',{'%val%':m[1]})+'<br>';//'+ObniÅ¼enie odpornoÅci o '+m[1]+'%<br>'
        break;
      case '+stun':
        tm[1]+=_t('msg_+stun')+'<br>'; //'+OgÅuszenie<br>'
        break;
      case '+stun2':
        tm[1]+=_t('msg_+stun2')+'<br>'; //'+PotÄÅ¼ne ogÅuszenie<br>'
        break;
      case '+stun2-f':
        tm[1]+=_t('msg_+stun2-f')+'<br>'; //'+PotÄÅ¼ne poparzenie<br>'
        break;
      case '+stun2-l':
        tm[1]+=_t('msg_+stun2-l')+'<br>'; //'+PotÄÅ¼ne poraÅ¼enie<br>'
        break;
      case '+stun2-c':
        tm[1]+=_t('msg_+stun2-c')+'<br>'; //'+PotÄÅ¼ne zamroÅ¼enie<br>'
        break;
      case '+stun2-d':
        tm[1]+=_t('msg_+stun2-d')+'<br>'; //'+PotÄÅ¼na przeszywajÄca strzaÅa<br>'
        break;
      case '+freeze':
        tm[1]+=_t('msg_+freeze')+'<br>'; //'+ZamroÅ¼enie<br>'
        break;
      case '+distract':
        tm[1]+=_t('msg_+distract')+'<br>'; //'+WytrÄcenie z rÃ³wnowagi<br>'
        break;
      case '+fastarrow':
        tm[1]+=_t('msg_+fastarrow')+'<br>'; //'+Szybka strzaÅa<br>'
        break;
      case '-redmanadest' :
        tm[1] += _t('msg_-redmanadest %val%', {'%val%': m[1]}) + '<br>'; // -redukcja niszczenia %val% many
        break;
      case '-redendest' :
        tm[1] += _t('msg_-redendest %val%', {'%val%': m[1]}) + '<br> '; //-redukcja niszczenia %val% energii
        break;
      case '+lowheal2turns' :
        tm[1] += _t('msg_+lowheal2turns %val%', {'%val%': m[1]}) + '<br>'; // +redukcja leczenia turowego o %val% Å¼ycia
        break;
      case '-lowcritallval' :
        tm[1] += _t('msg_-lowcritallval %val%', {'%val%': m[1]}) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
        break;
			case 'surpass_bonus_total' :
				tm[1] += _t('surpass_bonus_total %val% %name%', {'%val%': m[1], '%name%': f1.name.replace(new RegExp('\\(.+?\\)'), '')}) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
				break;
      case '+engback':
        tm[1]+=_t('msg_+engback %val%', {'%val%':mp(m[1])})+'<br>'; //mp(m[1])+' energii<br>'
        break;
      case '+swing':
        tm[1]+=_t('msg_+swing')+'<br>'; //'+Szeroki zamach<br>'
        break;
      case '+injure':
        tm[1]+=_t('msg_+injure %val%', {'%val%':m[1]})+'<br>'; //'+Zranienie ('+m[1]+')<br>'
        break;
      case '+firearrow':
        tm[1]+=_t('msg_+firearrow')+'<br>'; //'+PÅonÄca strzaÅa<br>'
        break;
      case '+manadest':
      case '-manadest':
        //tm[1] += _t('msg_+manadest %val%', {'%val%': m[1]}) + '<br>'; //'+Zniszczono '+m[1]+' many<br>'

        var a = m[1].split(',');
        if (a.length == 1) tm[1] += _t(`msg_${m[0]} %val%`, {'%val%': a[0]}) + '<br>'; //'+Zniszczono '+m[1]+' many<br>'
        else {
          tm[1] += _t(`msg_${m[0]}_multi %val%`, {
              '%val%': a[0],
              '%val2%': a[1]
            }) + '<br>';
        }
        break;
      case '+endest':
      case '-endest':
        //tm[1] += _t('msg_+endest %val%', {'%val%': m[1]}) + '<br>'; //'+Zniszczono '+m[1]+' energii<br>'

        var a = m[1].split(',');
        if (a.length == 1) tm[1] += _t(`msg_${m[0]} %val%`, {'%val%': a[0]}) + '<br>'; //'+Zniszczono '+m[1]+' energii<br>'
        else {
          tm[1] += _t(`msg_${m[0]}_multi %val%`, {
              '%val%': a[0],
              '%val2%': a[1]
            }) + '<br>';
        }
        break;
      case '+abdest':
        tm[1]+=_t('msg_+abdest %val%', {'%val%':m[1]})+'<br>'; //'+Zniszczono '+m[1]+' absorpcji<br>'
        break;
      case '+actdmg':
        tm[1]+=_t('msg_+actdmg %val%', {'%val%':m[1]})+'<br>'; //'ObniÅ¼enie odpornoÅci na truciznÄ o '+m[1]+'%<br>'
        break;
      case '+resdmgf':
        tm[1]+=_t('msg_+resdmgf %val%', {'%val%':m[1]})+'<br>'; //'ObniÅ¼enie odpornoÅci na ogieÅ o '+m[1]+'%<br>'
        break;
      case '+resdmgc':
        tm[1]+=_t('msg_+resdmgc %val%', {'%val%':m[1]})+'<br>'; //'ObniÅ¼enie odpornoÅci na zimno o '+m[1]+'%<br>'
        break;
      case '+resdmgl':
        tm[1]+=_t('msg_+resdmgl %val%', {'%val%':m[1]})+'<br>'; //'ObniÅ¼enie odpornoÅci na bÅyskawice o '+m[1]+'%<br>'
        break;
      case '+legbon_verycrit':
        tm[1]+=_t('msg_+legbon_verycrit')+'<br>'; //'+Cios bardzo krytyczny<br>'
        break;
			case '-legbon_cleanse':
				tm[2] += _t('msg_-legbon_cleanse') + '<br>';
				break;
			case '-legbon_glare':
				tm[2] += _t('msg_-legbon_glare') + '<br>';
				break;
      case '+superspell-prevented':
        tm[2] += _t('msg_+superspell-prevented') + '<br>';
        break;
			case '+legbon_curse':
        tm[1]+=_t('msg_+legbon_curse')+'<br>'; //'+KlÄtwa<br>'
        break;
      case '+legbon_pushback':
        tm[1]+=_t('msg_+legbon_pushback')+'<br>'; //'+OdepchniÄcie<br>'
        break;
			case '+legbon_holytouch':
				tm[1] += _t('msg_+legbon_holytouch %val%') + '<br>';
				break;
			case 'legbon_holytouch_heal':
				tm[1] += _t('msg_legbon_holytouch_heal %val%', {'%val%': m[1], '%name%': f1.name}) + '<br>';
				type='neu';
				break;
      case '-legbon_dmgred':
        tm[1]+=_t('msg_-legbon_dmgred %val%', {'%val%': m[1]})+'<br>'; //'-Aktywna ochrona fizyczna '+m[1]+'% obraÅ¼eÅ na caÅÄ walkÄ<br />'
        break;
      case 'anguish':
          let anguishArray = m[1].split(",");
          type = 'neu'
          if (anguishArray.length == 1) {
              tm[1] += _t('msg_anguish %name% %hpp% %val0%', {'%name%': tmpName, '%hpp%': f1.hpp, '%val0%': anguishArray[0]}) + '<br>';
          } else {
              tm[1] += _t('msg_anguish %name% %hpp% %val0% %val1%', {'%name%': tmpName, '%hpp%': f1.hpp, '%val0%': anguishArray[0], 'val1' : anguishArray[1]}) + '<br>';
          }
          break;
      case '-legbon_facade':
          tm[1] += _t('msg_-legbon_facade %val%', {'%val%': m[1]}) + '<br>';
          break;
      case '+legbon_anguish':
          tm[1] += _t('msg_+legbon_anguish %val%', {'%val%': m[1]}) + '<br>';
          break;
      case '-legbon_retaliation':
          tm[1] += _t('msg_-legbon_retaliation %val%', {'%val%': m[1]}) + '<br>';
          break;
      case '+legbon_frenzy_main':
          tm[1] += _t('msg_+legbon_frenzy_main %val%', {'%val%': m[1]}) + '<br>';
          break;
      case '+legbon_frenzy_off':
          tm[1] += _t('msg_+legbon_frenzy_off %val%', {'%val%': m[1]}) + '<br>';
          break;
      case '-blok':
        tm[2]+=_t('msg_-blok %val%', {'%val%': m[1]})+'<br>'; //'-Zablokowanie '+m[1]+' obraÅ¼eÅ<br>'
        break;
      case '-evade':
        tm[2]+=_t('msg_-evade')+'<br>'; //'-Unik<br>'
        break;
      case '-parry':
        tm[2]+=_t('msg_-parry')+'<br>'; //'-Parowanie<br>'
        break;
      case '-pierceb':
        tm[2]+=_t('msg_-pierceb')+'<br>'; //'-Blok przebicia<br>'
        break;
      case '-contra':
        tm[2]+=_t('msg_-contra')+'<br>'; //'-Kontra<br>'
        break;
      case '+rage':
        tm[2] += _t('msg_+rage %val%', {'%val%': m[1]}) + '<br>'; //'+WÅciekÅoÅÄ: atak %val%<br>'
        break;
      case '-rage':
        tm[2]+=_t('msg_-rage')+'<br>'; //'-WÅciekÅoÅÄ<br>'
        break;
      case '-absorb':
        tm[2]+=_t('msg_-absorb %val%', {'%val%': m[1]})+'<br>'; //'-Absorpcja '+m[1]+' obraÅ¼eÅ fizycznych<br>'
        break;
      case '-absorbm':
        tm[2]+=_t('msg_-absorbm %val%', {'%val%': m[1]})+'<br>'; //'-Absorpcja '+m[1]+' obraÅ¼eÅ magicznych<br>'
        break;
      case '-arrowblock':
        tm[2]+=_t('msg_-arrowblock')+'<br>'; //'StrzaÅa zablokowana<br>'
        break;
      case '-reddest_per' :
        tm[2] += _t('msg_-reddest_per %val%', {'%val%': m[1]}) + '<br>';  // 'Redukcja many i energii o %val% %'
        break;
      case '-thirdatt':
        take+='<b class=third>-'+m[1]+'</b>';
        break;
      case '-legbon_critred':
      case '+legbon_puncture':
        tm[2] += _t(`msg_${m[0]} %val%`, {'%val%': m[1]}) + '<br>';
        break;
      case '-legbon_resgain':
        tm[2]+=_t('msg_-legbon_resgain')+'<br>'; //'-Ochrona Å¼ywioÅÃ³w<br>'
        break;
      case 'ansgame':
        tm[1]+=_t('msg_ansgame', {'%name%': f1.name})+'<br>';
        break;
      case 'reddest_per0':
			case '-reddest_per0':
        break;
			case '-redabdest_per':
				tm[1] += _t('msg_redabdest_per %m1%', {'%m1%': m[1]}) + '<br>'; // redukcja niszczenia absor
				break;
			case 'aura-ac_per':
				tm[1] += _t('msg_aura-ac_per %val%', {'%val%': m[1]}) + '<br>'; // 'Aura ochrony fizycznej, pancerz+%val%.'
				break;
			case 'aura-sa_per':
				tm[1] += _t('msg_aura-sa_per %val%', {'%val%': mp(m[1])}) + '<br>'; //'Aura szybkoÅci SA'+mp(m[1]/100)+'<br>'
				break;
			case '+energy':
				tm[1] += _t('msg_+energy %val%', {'%val%': m[1]}) + '<br>'; // +ObniÅ¼enie energii o %val% po zamroczeniu
				break;
			case 'energyout':
				tm[1] += _t('msg_energyout %val%', {'%val%': m[1]}) + '<br>'; // -%val% energii przez 5 kolejnych ciosÃ³w
				break;
			case 'mlightshiled':
				tm[1] += _t('msg_mlightshiled %name%', {
						'%name%': f1.name,
						'%target%': (id1 == id2 ? _t('part_himself') : f2.name)
					}) + '<br>'; // '%name% rzuciÅ tarczÄ bÅyskawic na siebie (lub zamiast siebie na kompana).'
				break;
			case 'lightshield2':
				tm[1] += _t('msg_lightshield2 %name%', {
						'%name%': f1.name,
						'%target%': (id1 == id2 ? _t('part_himself') : f2.name)
					}) + '<br>'; // '%name% rzuca magicznÄ barierÄ na siebie (lub zamiast siebie na kompana)
				break;
			case 'antidote':
				tm[1] += _t('msg_antidote %val%', {
						'%val%': m[1],
					}) + '<br>';
				break;
			case 'stealmana':
				tm[1] += _t('msg_stealmana %name%', {
						'%val%': m[1],
						'%target%': f2.name
					}) + '<br>'; // '%name% kradnie manÄ przeciwnika %target%'
				break;
			case 'rime_per':
				var mm = m[1].split(',');
				tm[1] += _t('msg_rime_per %val% %name%', {'%val%': mm[0], '%name%': f1.name}) + '<br>'; // '%name% wykonuje podmuch mrozu, spowolnienie przeciwnikÃ³w o %val%%'
				break;
			case 'trickyknife':
				tm[1] += _t('msg_trickyknife %name% %target%', {'%name%': f1.name, '%target%': f2.name}) + '<br>'; // '%name% zadaje przeciwnikowi %target% zdradziecki cios'
				break;
			case 'healall_per':
        var a = m[1].split(',');
        if (a.length == 1) {
          tm[1] += _t('msg_healall_per %name% %val%', {
              '%name%': f1.name,
              '%val%': a[0]
            }) + '<br>';
        } else {
          tm[1] += _t('msg_healall_per_multi %name% %val% %val2%', {
              '%name%': f1.name,
              '%val%': a[0],
              '%val2%': a[1]
            }) + '<br>';
        }
				break;
			case '+critslow_per':
				tm[1] += _t('msg_+critslow_per= %val%', {'%val%': m[1]}) + '<br>'; // '+Krytyczne spowolnienie o %val%%'
				break;
			case '+critsa_per':
				tm[1] += _t('msg_+critsa_per %val%', {'%val%': m[1]}) + '<br>'; // Przyspieszenie SA o %val%% po krytyku na 3 tury;
				break;
			case '+immobilize':
				tm[1] += _t('msg_+immobilize') + '<br>'; //'+Unieruchomienie<br>'
				break;
			case '+mcurse':
				tm[1] += _t('msg_+mcurse') + '<br>'; //'+KlÄtwa<br>'
				break;
			case '+absorb':
				tm[2] += _t('msg_+absorb %val%', {'%val%': m[1]}) + '<br>'; // Odnowienie absorpcji %val%
				break;
			case '+absorbm':
				tm[2] += _t('msg_+absorbm %val%', {'%val%': m[1]}) + '<br>'; // Odnowienie absorpcji magicznej %val%
				break;
			case '+vulture':
				tm[2] += _t('msg_+vulture= %val%', {'%val%': m[1]}) + '<br>'; // '+Wzmocnienie ataku o %val% %'
				break;
			case '-redacdmg':
				tm[2] += _t('msg_-redacdmg %val%', {'%val%': m[1]}) + '<br>'; //  'Redukcja niszczenia pancerza o %val%'
				break;
			case '-redacdmg_per':
				tm[2] += _t('msg_-redacdmg_per %val%', {'%val%': m[1]}) + '<br>'; //  'Redukcja niszczenia pancerza o %val% %'
				break;
			case '-redmanadest_per':
				tm[2] += _t('msg_-redmanadest_per %val%', {'%val%': m[1]}) + '<br>'; //  'Redukcja niszczenia many o %val% %'
				break;
			case '-redendest_per':
				tm[2] += _t('msg_-redendest_per %val%', {'%val%': m[1]}) + '<br>'; //  'Redukcja niszczenia energii o %val% %'
				break;
			case '-resmanaendest':
				var mm = m[1].split(',');
				tm[2] += _t('msg_-resmanaendest %val%', {'%val1%': mm[0], '%val2%': mm[1]}) + '<br>';
				break;
			case '+critpoison_per':
				tm[2] += _t('msg_+critpoison_per %val%', {'%val%': m[1]}) + '<br>'; // +Czarna krew %val%
				break;
			case 'alllowdmg':
				var mm = m[1].split(',');
				tm[1] += _t('msg_alllowdmg %val% %name%', {'%val%': mm[0], '%name%': mm[2]}) + '<br>'; // '%name% posyÅa emanujÄcÄ strzaÅÄ w stronÄ przeciwnikÃ³w osÅabiajÄc ich atak o %val% % na +5 tur'
				break;
			case 'allslow_per':
				var mm = m[1].split(',');
				tm[1] += _t('msg_allslow_per %val% %name%', {'%val%': mm[0], '%name%': f1.name}) + '<br>'; // '%name% wykonuje przeraÅ¼ajÄcy okrzyk spowalniajÄcy wrogÃ³w o %val%%'
				break;
			case 'blackout':
				tm[1] += _t('msg_blackout') + '<br>'; // 'Zamroczenie'
				break;
			case 'aura-adddmg2_per-meele':
				tm[1] += _t('msg_blesswords_perw %val% %name%', {'%val%': m[1], '%name%': f1.name}) + '<br>'; // '%name% wykonuje bÅogosÅawieÅstwo mieczy, wzmocnienie o %val%%'
				break;
			case 'chainlightning':
				break;
			case 'chainlightning_perw':
				tm[1] += _t('msg_chainlightning_perw %name%', {'%name%': f1.name}) + '<br>'; // '%name% przyzywa z nieba ÅaÅcuch piorunÃ³w.'
				break;
			case 'critstagnation':
				tm[1] += _t('msg_critstagnation') + '<br>'; // '+Stagnacja'
				break;
			case 'distractshoot':
				tm[1] += _t('msg_distractshoot') + '<br>'; // '+WytrÄcajÄca strzaÅa'
				break;
			case 'disturbshoot':
				tm[1] += _t('msg_disturbshoot') + '<br>'; // 'RozpraszajÄcy strzaÅ'
				break;
			case '+rotatingblade':
				break;
			case 'daggerthrow':
				break;
			case 'vamp':
				tm[1] += _t('msg_vamp %val%', {'%name%': f1.name, '%target%': f2.name, '%val%': m[1]}) + '<br>'; // '%name% poÅ¼era przeciwnikowi %target% %val% Å¼ycia'
				break;
			case 'woundextend':
				tm[1] += _t('msg_woundextend %name% %target%', {'%name%': f1.name, '%target%': f2.name}) + '<br>'; // '%name% rozszarpuje rany %target%'
				break;
			case 'heal_per':
				tm[1] += _t('msg_heal_per %name%', {
						'%name%': f1.name,
						'%target%': (id1 == id2 ? _t('part_himself') : f2.name)
					}) + '<br>'; // %name% uzdrawia siebie (lub zamiast siebie to kompana)
				break;
      //case 'frost':
      //  tm[1] += _t('msg_frost %name% %val%', {'%name%': f1.name, '%val%': m[1]}) + '<br>'; // %name% otrzymaÅ# %val% obraÅ¼eÅ od zimna.
      //  break;
      //case 'light':
      //  tm[1] += _t('msg_light %name% %val%', {'%name%': f1.name, '%val%': m[1]}) + '<br>'; //%name% otrzymaÅ# %val% obraÅ¼eÅ od bÅyskawic.
      //  break;
      case 'physical':
        tm[1] += _t('msg_physical %name% %val%', {'%name%': f1.name, '%val%': m[1]}) + '<br>'; //%name% otrzymaÅ# %val% obraÅ¼eÅ fizycznych.
        break;
      case 'poison_lowdmg_per-enemies':
       tm[1] += _t('msg_poison_lowdmg_per-enemies %val%', {'%name%': tmpName, '%val%': m[1]}) + '<br>'; // OsÅabienie o %val%% zadawanych obraÅ¼eÅ przez zatrutych przeciwnikÃ³w.
        break;
      case '-poison_lowdmg_per':
        tm[1] += _t('msg_-poison_lowdmg_per %val%', {'%val%': m[1]}) + '<br>'; // -OsÅabienie przez truciznÄ zadawanych obraÅ¼eÅ o x%"
        break;
      case 'dmg_hpp':
        tm[1] += _t('msg_-dmg_hpp') + '<br>'; //'Przeciwnik jest odporny na ten atak'
        break;


			case 'balloflight':
      case 'active_decblock_per':
      case 'active_absorbdest_per':
				break;
			case '+crush':
			case 'vamp_time':
			case '+taken_dmg':
			case '+critpierce':
			case 'critval-enemies':
			case 'critmval-enemies':
			case 'critval-allies':
			case 'critmval-allies':
                if (m[0] != 'vamp_time') {
                    tm[1] += _t('eng_game_only_val_' + m[0] + ' %val%', {'%val%': m[1]}) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
                } else {
                    var a = m[1].split(',');
                    if (a.length == 1) {
                        tm[1] += _t('eng_game_only_val_vamp_time %val%', {
                            '%val%': a[0]
                        }) + '<br>';
                    } else {
                        tm[1] += _t('eng_game_only_val_vamp_time %val% %val2%', {
                            '%val%': a[0],
                            '%val2%': a[1]
                        }) + '<br>';
                    }
                }
				break;
            //only nick from message
            case '+spell-taken_dmg' :
                tm[1] += _t('eng_game_only_nick_' + m[0] + ' %name%', {'%name%': m[1]}) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
                break;
            //only nick
			case '+spell-vamp_time':
			case 'distortion':
				tm[1] += _t('eng_game_only_nick_' + m[0] + ' %name%', {'%name%': f1.name}) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
				break;
            //only opponent nick
            case 'stinkbomb_crit' :
            case 'stinkbomb_pierce' :
                tm[1] += _t('eng_game_only_nick_' + m[0] + ' %name%', {'%name%': f2.name}) + '<br>'; // %name% ma obniÅ¼onÄ szansÄ na cios krytyczny.
                break;
            //nick and value
			case 'heal_per-allies':
            case 'heal_per-enemies' :
			case 'hp_per-allies':
			case 'hp_per-enemies':
				tm[1] += _t('eng_game_nick_and_value_' + m[0] + ' %name% %val%', {'%name%': tmpName, '%val%': m[1]}) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
				break;
            //opponent_nick and value
			case 'dmg-target_physical':
				tm[1] += _t('eng_game_opponent_nick_and_value_' + m[0] + ' %target% %val%', {'%target%': f2.name, '%val%': m[1]}) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
				break;
            //nick and opponent
			case 'spell-taken_dmg':
			case '-spell-distortion':
				tm[1] += _t('eng_game_nick_and_opponent_' + m[0] + ' %name% %target%', {'%name%': f1.name, '%target%': f2.name}) + '<br>';
				break;
            //nick and FRIENDNICK
			case '-spell-immunity_to_dmg':
				tm[1] += _t('eng_game_nick_and_friendnick_' + m[0] + ' %name%', {'%name%': f1.name}) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
				break;
            //only info
			case '-immunity_to_dmg':
      case '+spell-taken_dmg-all':
				tm[1] += _t('end-game-without-percent' + m[0]) + '<br>';
				break;
      case 'active_decblock_per-enemies':
      case 'active_block_per':
      case '+abdest_per':
      case '+abmdest_per':
        tm[1] += _t('msg_only_val_' + m[0], { '%val%': m[1] }) + '<br>';
        break;

			case "resfire_per":
				tm[1] += _t('msg_resfire_per %val%', {'%val%': m[1]}) + '<br>';
				break;
			case "reslight_per":
				tm[1] += _t('msg_reslight_per %val%', {'%val%': m[1]}) + '<br>';
				break;
			case "resfrost_per":
				tm[1] += _t('msg_resfrost_per %val%', {'%val%': m[1]}) + '<br>';
				break;
			case 'mana':
				if (m[1] > 0) console.warn('mana error');
				else tm[1] += _t('msg_receivemana %name% %val%', {'%name%': f1.name, '%val%': Math.abs(m[1])}) + '<br>';
				break;
            case 'tcustom':
                tm[1] += _t('msg_tcustom_target %target% %val%', {
                    '%target%': f2.name,
                    '%val%': m[1]
                }) + '<br>'; // %target% - uÅ¼ycie specjalnej mikstury: %val%.
                type = 'txt';
                break;
            case 'removedot' :
            case 'removedot-allies' :
            case 'removestun' :
                tm[1] += _t('skill_' + m[0], null, 'new_skills') + '<br/>';
                break;

      default:
        if(m[0].substr(1,3)=='dmg') {
          if(m[0].charAt(0)=='+') attack+='<b class='+m[0].substr(1)+'>+'+m[1]+'</b>';
          else take+='<b class='+m[0].substr(1)+'>-'+m[1]+'</b>';
        }
        else tm[2]+=_t('msg_unknown_prameter %val%', {'%val%':msg[k]})+'</b><br>'; //'Nieznany parametr: <b>'+msg[k]
    }
  }
  if (tmpName != '') f1.name = tmpName;
  if(type=='auto') type=g.battle.f[id1].team<2?'attack':'attack2';
  if(attack!='') {
    type=g.battle.f[id1].team<2?'attack':'attack2';
    tm[0]=_t('msg_dmgdone %name1% %hpp% %val%', {'%name1%':f1.name,'%hpp%':f1.hpp, '%val%':attack})+'<br>'; //f1.name+'('+f1.hpp+'%) uderzyÅ# z siÅÄ '+attack+'<br>'
    tm[2]+=_t('msg_dmgtaken %name1% %hpp% %val%', {'%name1%':f2.name,'%hpp%':f2.hpp, '%val%':take})+'<br>'; //f2.name+'('+f2.hpp+'%) otrzymaÅ$ '+take+' obraÅ¼eÅ<br>'
    if(!g.battle.auto) {
      var id2='big'+Math.round(Math.random()*1000);
      $('#battle').append($('<big id='+id2+'>'+take+'</big>').rightClick(function(e){
        e.preventDefault()
        }));
      $('#'+id2).css({
        left:f2.rx+f2.fw/2-$('#'+id2).width()/2,
        top:f2.ry-16
        }).animate({
        opacity:0,
        top:f2.ry-48
        },1500);
      setTimeout(function(){
        $('#'+id2).remove()
        },1500);
    }
  }
  if(type!='') type=' class='+type;

  // pushing messages to array so user can copy them later in bbCode format
  var wrapper = '';
  switch(type.split('=')[1]){
    case 'attack2':wrapper = 'i';break;
    case 'attack':wrapper = '';break;
    default:wrapper = (type == 'neu' ? 'u' : 'b');
  }

  //replace gender signs #,$ only in pl version (display in forum copy log)
  var tmp3 = tm.join('');
  if(_l() == 'pl') tmp3 = tmp3.replace(/#/g, g1).replace(/\$/g, g2);
  var tmp2 = strip_tags(tmp3.replace(/<br>/gim, "\n"), false);

  g.battle.forumLog.push(wrapper == '' ? tmp2 : '['+wrapper+']'+tmp2+'[/'+wrapper+']');
  tmpForumLog.push(wrapper == '' ? tmp2 : '['+wrapper+']'+tmp2+'[/'+wrapper+']');

  //replace gender signs #,$ only in pl version (display in ingame log)
  var tmpM = tm.join('');
  tmpM = parseContentBB(tmpM, false);
  if(_l() == 'pl') tmpM = tmpM.replace(/#/g, g1).replace(/\$/g, g2);
  return '<div'+type+'>'+tmpM+'</div>';
}

function attach_battle_log(){
  $('#battlelog').click( function(){
    var tarea=$('#battle_for_forum');
    if( tarea.length == 0){
      tarea = $('<textarea id="battle_for_forum" style="position:relative;top:10px;left:10px;z-index:350;width:345px;height:370px;font-size:11px"></textarea>').click(function(){
        $(this).focus();
        $(this).select();
      })
    }
    showDialog(_t('copy_battle_log'),'<div class="scroll400 questlist"></div>'); //Kopiuj przebieg walki
    var log = g.battle.forumLog ? g.battle.forumLog : tmpForumLog;
    tarea.val(log.join("\n"));
    $(tarea).appendTo('#dlgwin .w1 .w2 .scroll400');
  });
}

function toggleBattleLog(){
  var size = getCookie('battleLogSize');
  switch(size){
    case 'big':
      $('#battlelog,#battlepanelback,#battlepanel,#battle .border-b').removeClass('big');
      setCookie('battleLogSize', 'small');
      break;
    default:
      $('#battlelog,#battlepanelback,#battlepanel,#battle .border-b').addClass('big');
      //if (getEngine().chatController.getChatWindow().getChatSize() == 2) showChat(1);
      //if (getEngine().chatController.getChatWindow().getChatSize() == 2) getEngine().chatController.getChatWindow().showChat(1);
      setCookie('battleLogSize', 'big');
      break;
  }
  map.resizeView();
}

function selectNextEnemy(previous){
  this.activated = false;
  this.findNext = function(reversed){
    var activated = null;
    var tmpList = [];
    for (var i in g.battle.f){
      if (g.battle.f[i].hpp > 0) tmpList.push(i);
    }
    if (reversed) tmpList = tmpList.reverse();
    for(var i=0; i<tmpList.length; i++){
      if (!isset(g.battle.activeEnemy)) {activated = tmpList[i];break;}
      else{
        if (g.battle.activeEnemy.id == tmpList[i] && isset(tmpList[i+1])) {activated = tmpList[i+1];break;}
      }
    }
    if (activated != null) {this.activate(activated);return;}
    if (isset(g.battle.activeEnemy)){
      $('#troop'+g.battle.activeEnemy.id).removeClass('selected').css('z-index', g.battle.activeEnemy.oldZIndex);
      delete g.battle.activeEnemy;
    }
  }
  this.activate = function(id){
    if (isset(g.battle.activeEnemy)){
      $('#troop'+g.battle.activeEnemy.id).css('z-index', g.battle.activeEnemy.oldZIndex);
    }
    $('.troop').removeClass('selected');
    this.activated = true;
    g.battle.activeEnemy = {
      id:id,
      oldZIndex:$('#troop'+id).css('z-index')
    };
    $('#troop'+id).addClass('selected').css('z-index', 200);
  }
  this.findNext(previous);
}
$('#battle').on('wheel', function(e){
  if (e.target.id == 'battle') selectNextEnemy(e.wheelDelta == undefined ? e.detail < 0 : e.wheelDelta < 0);
})
var updateCurrent= function (current) {
	if (!isset(current)) return;
  clearCurrentPlayer();
  $('#troop'+current).append($('<div>').addClass('current-player'));
};

var clearCurrentPlayer = function () {
  $('.current-player').remove();
};

var updateBuffs=function(){
  var buffs = [
    _t('deep_wound', null, 'buff'),
    _t('wound', null, 'buff'),
    _t('critical_deep_wound', null, 'buff'),
    _t('poisoned', null, 'buff'),
    _t('fire', null, 'buff'),
    _t('swow_down', null, 'buff'),
    _t('speed_up', null, 'buff'),
    _t('frostbite', null, 'buff'),
    _t('shock', null, 'buff')
  ];
  for(var i in g.battle.f){
    var $e = $('#troop'+i);
    $e.find('.buff').remove();
    if(g.battle.f[i].buffs && g.battle.f[i].hpp>0){
      var tmp = g.battle.f[i].buffs;
      var amount = 0;
      while(tmp){
        amount += tmp&1;
        tmp>>=1;
      }
      var kk = 0;
      for(var p=0;p<buffs.length;p++){
        if(g.battle.f[i].buffs>>p&1){
          var row = Math.ceil((amount-kk)/2)-1;
          var inrow = (amount - row*2) >= 2 ? 2 : 1;
          $e.append(
            $('<div tip="'+buffs[p]+'" style="background-position:'+((-p*16)-1.5)+'px -2px" class="buff '+(g.battle.f[i].team==1?'l':'r')+'"></div>').css({
              left:($e.width()/2) - ((inrow*15)/2) + ((kk%2)*15),
              bottom:row*15
            }).click(function(){

            })
          );
          kk++;
        }
      }
    }
  }
}

// var ansgame = new(function(){
//   var choosen = {};
//   var active = false;
//   var send = false;
//   this.start = function(img){
//     if(parseInt(img) === 0){
//       this.close();
//       return;
//     }
//     if(active) return ;
//     var $r = $('<div class="ansRound"><div class=message>'+_t('ans_game msg', null, 'battle')+'</div></div>');
//     var part = (2*Math.PI)/8;
//     var T = this;
//     for(var i=0; i<8; i++){
//       $r.append($('<div class="unit" id="ansunit_'+(i)+'"></div>').click(function(){
//         T.choose($(this).attr('id').substr(8));
//       }).css({
//         top:180+(70*Math.sin(part*i))-12,
//         left:256+(70*Math.cos(part*i))-12,
//         background:'url(/obrazki/npc/'+img+') -'+(i*32)+'px 0px'
//       }));
//     }
//     $r.appendTo('#centerbox');
//     active = true;
//   };
//   this.choose = function(id){
//     if(send) return;
//     if(isset(choosen[id])){
//       delete choosen[id];
//       $('#ansunit_'+id).removeClass('active');
//       return;
//     }
//     choosen[id] = true;
//     $('#ansunit_'+id).addClass('active');
//     var amount = 0;
//     var arr = [];
//     for(var i in choosen){
//       arr.push(parseInt(i));
//     }
//     if(arr.length == 2){
//       arr.sort(function(a,b){return a-b});
//       _g('fight&a=ansgame&s='+(arr[0]+(arr[1]*256)));
//       $('#centerbox .ansRound').remove();
//       send = true;
//     };
//   };
//   this.check = function(){return active};
//   this.close = function(){
//     $('#centerbox .ansRound').remove();
//     send = false;
//     active = false;
//     choosen = {};
//   };
// })();


function battle_surrender() {
  _g('fight&a=surrender');
}

function canLeave() {
    var battle = g.battle;
    if (self.checkWT() && isset(battle.f[hero.id].dead) && !battle.endBattle) {
        mAlert(_t('leave_alert', null, 'battle'), 2, [function () {
            leaveBattle();
        }, function () {}]);
    } else {
        leaveBattle();
        return;
    }
};

function checkWT() {
    var warriorsList = g.battle.f;
    if (warriorsList) {
        for (var i in warriorsList) {
            var wt = warriorsList[i].wt;
            if (isset(wt) && wt >= 80) {
                return true;
            }
        }
    }
    return false;
};

function hideTroopsIfNotPositioned () {
    var $troops = $('#battle .troop')
    if ($troops.css('left') === '0px' && $troops.css('top') === '0px') {
        $troops.hide();
    }
}

function leaveBattle() {
    _g('fight&a=exit');
};
