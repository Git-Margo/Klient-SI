/* Item's tip parser.
 Author: Thinker, first version 3.2009
 www.margonem.pl
*/
if(typeof(ut_date) == "undefined") {
  window.ut_date = function (ts) { // date from unix timestamp
    var d=new Date(ts*1000),y=d.getFullYear();
    return d.getDate()+"/"+(d.getMonth()+1)+"/"+y;
  }
}

if(typeof(htmlspecialchars) == "undefined") {
  window.htmlspecialchars = function (p_string) {
          p_string = p_string.replace(/&/g, '&amp;');
          p_string = p_string.replace(/"/g, '&quot;');
          p_string = p_string.replace(/'/g, '&#039;');
          return p_string;
  }
}

if(typeof(_l) == 'undefined') {
  window._l = function () {
    var tmp = location.host.split('.');
    var loc = 'pl';
    switch(tmp[tmp.length-1]){
      case 'com': loc = 'en';
    }
    return loc;
  }
}

if (!window.getHeroLevel) {
  window.getHeroLevel = function () {

    if (typeof hero != 'undefined') {

        if (hero !== null && typeof hero === 'object' && !Array.isArray(hero)) {
          return hero.lvl
        } else {
          return 0;
        }

    } else {
      return 0;
    }

  }
}

if(typeof(parseItemStat) == "undefined") {
  window.parseItemStat = function (s) {
    s = s.split(';');
    var obj = {};
    for (var i=0; i<s.length; i++){
        var pair = s[i].split('=');
        obj[pair[0]] = isset(pair[1]) ? pair[1] : null;
    }
    return obj;
  }
}

if(typeof(calculateDiffFull) == "undefined") {
  window.calculateDiffFull = function (s1, s2) {
    const diff = (s1 - s2) * 1000;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    let dayHidden = d < 1;
    let hourHidden = dayHidden && h < 1;
    let secHidden = d > 0;

    return (!dayHidden ? _t('time_days_short %val%', {'%val%': d}, 'time_diff') : '') + ' ' +
        (!hourHidden ? _t('time_h_short %val%',    {'%val%': h}, 'time_diff') : '') + ' ' +
        (_t('time_min_short %val%',  {'%val%': m}, 'time_diff')) + ' ' +
        (!secHidden ? _t('time_sec_short %val%',  {'%val%': s}, 'time_diff') : '')
        ;
  };
}

if(typeof(convertTimeToSec) == "undefined") {
  window.convertTimeToSec = function (time) { // time is 2d / 1h / 65m / 20s etc
    var unit = time.replace(/[0-9]/g, ''); //remove digits
    var value = time.replace(/\D/g, ''); //remove all except digits
    var seconds;
    switch (unit) {
      case 'd':
        seconds = value * 60 * 60 * 24;
        break;
      case 'h':
        seconds = value * 60 * 60;
        break;
      case 'm':
        seconds = value * 60;
        break;
      case 's':
        seconds = value;
        break;
    }
    return seconds;
  }
}

if(typeof(convertSecToTime) == "undefined") {
  window.convertSecToTime = function (seconds) {
    var days = Math.floor(seconds / (24*60*60));
    seconds -= days * (24*60*60);
    var hours = Math.floor(seconds / (60*60));
    seconds -= hours   * (60*60);
    var minutes = Math.floor(seconds / (60));
    seconds -= minutes * (60);
    return {
      "d": days,
      "h": hours,
      "m": minutes,
      "s": seconds
    };
  }
}

window.createTransVal = (val, unit = '', prefix = '', suffix = '', key = '%val%') => ({[key]: `${prefix}${val}${unit}${suffix}`});

if(typeof(_t) == 'undefined'){
  var _t = function(name, parameters, category){
    var cat = isset(category) ? category : 'default';
    if(isset(__translations[cat]) && isset(__translations[cat][name])){
      var ret = __translations[cat][name];
      if(isset(parameters)){
        for(var i in parameters){
          ret = ret.replace(i, parameters[i]);
        }
      }
      return ret;
    }
    return '[T:'+cat+']'+name;
  }
}

const isRanges = (val) => {
  return val.includes(':') && val.split(':').length > 1;
}

const getRanges = (val) => {
  const newVal = val.replace(/[\(\)]/g,'');
  const t = newVal.split(':');
  return _t('start') + ' ' + t[0] + ' ' + _t('stop') + ' ' + t[1];
}

const parseTargetClass = (rawValue) => {
    const otherTranslations = {
        EQUIPPABLE: _t('all_equippable'),
        WEAPONS: _t('all_weapons'),
        HANDHELD: _t('all_handheld'),
    };

    let text;

    if (otherTranslations[rawValue]) {
        text = otherTranslations[rawValue];
    } else {
        const cls = rawValue.split(",");
        const translated = cls
            .map(c => {
                const idx = parseInt(c.trim(), 10);
                return this.eq.classes[idx] || null;
            })
            .filter(Boolean);

        if (translated.length === 0) return "";

        text = translated.join(", ");
    }
    return text;
}

eq={
  wx : [37,0,37,74,0,37,74,37,0,0],
  wy : [0,36,36,36,72,72,72,108,108,0],
  classes : [
    '',
    _t('cl_onehanded', null, 'eq_cl'),
    _t('cl_twohanded', null, 'eq_cl'),
    _t('cl_bastard', null, 'eq_cl'),
    _t('cl_distance', null, 'eq_cl'),
    _t('cl_helpers', null, 'eq_cl'),
    _t('cl_wands', null, 'eq_cl'),
    _t('cl_staffs', null, 'eq_cl'),
    _t('cl_armor', null, 'eq_cl'),
    _t('cl_helmets', null, 'eq_cl'),
    _t('cl_boots', null, 'eq_cl'),
    _t('cl_gloves', null, 'eq_cl'),
    _t('cl_rings', null, 'eq_cl'),
    _t('cl_neclaces', null, 'eq_cl'),
    _t('cl_shield', null, 'eq_cl'),
    _t('cl_neutral', null, 'eq_cl'),
    _t('cl_usable', null, 'eq_cl'),
    _t('cl_gold', null, 'eq_cl'),
    _t('cl_keys', null, 'eq_cl'),
    _t('cl_quests', null, 'eq_cl'),
    _t('cl_renewable', null, 'eq_cl'),
    _t('cl_arrows', null, 'eq_cl'),
    _t('cl_talisman', null, 'eq_cl'),
    _t('cl_books', null, 'eq_cl'),
    _t('cl_bags', null, 'eq_cl'),
    _t('cl_bless', null, 'eq_cl'),
    _t('cl_improve', null, 'eq_cl'),
    _t('recipe', null, 'recipes'),
    _t('cl_coinage', null, 'eq_cl'),
    _t('cl_arrows', null, 'eq_cl'),
    _t('cl_outfits', null, 'eq_cl'), // 30
    _t('cl_pets', null, 'eq_cl'), // 31
    _t('cl_teleports', null, 'eq_cl'), // 32
  ],
  prof : {
    'w' : _t('prof_warrior', null, 'eq_prof'),
    'p' : _t('prof_paladyn', null, 'eq_prof'),
    'm' : _t('prof_mag', null, 'eq_prof'),
    'h' : _t('prof_hunter', null, 'eq_prof'),
    'b' : _t('prof_bladedancer', null, 'eq_prof'),
    't' : _t('prof_tracker', null, 'eq_prof')
  },
  weapon : {
    'sw' : _t('w_meele', null, 'eq_w'),
    '1h' : _t('w_onehanded', null, 'eq_w'),
    '2h' : _t('w_twohanded', null, 'eq_w'),
    'bs' : _t('w_bastard', null, 'eq_w'),
    'dis' : _t('w_distance', null, 'eq_w'),
    'fire' : _t('w_fire', null, 'eq_w'),
    'light' : _t('w_light', null, 'eq_w'),
    'frost' : _t('w_frost', null, 'eq_w'),
    'sh' : _t('w_shield', null, 'eq_w'),
    'h' : _t('w_helper', null, 'eq_w'),
    'poison' : _t('w_poison')
  }
};

function parseOpisStat (data, stats) {
  data = data.replace(/#DATE#|#YEAR#/g, function (m) {
    switch (m) {
      case '#DATE#':
        if (!isset(stats.created)) return ut_date(unix_time());
        return ut_date(stats.created);
      case '#YEAR#':
        return getYear(stats, 0, 0)
    }
  });


  data = data.replace(/#YEAR,([-0-9]+),(D|M)#/g, function (m0, m1, m2) {
    switch (m2) {
      case "D"	: return getYear(stats, parseInt(m1), 0);
      case "M"	: return getYear(stats, 0, 	parseInt(m1));
      default :
        console.error(`undefined m2: ${m2}`);
        return getYear(stats, 0, 0)
    }
  });

  return data;
}

function getYear (stats, modifyDays, modifyMonths) {
  if (!isset(stats.created)) {
    var tmp_date = new Date();

    if (modifyDays) 	tmp_date.setDate(tmp_date.getDate() + modifyDays);
    if (modifyMonths) 	tmp_date.setMonth(tmp_date.getMonth() + modifyMonths);

    return tmp_date.getFullYear();
  }

  let time = stats.created;

  if (modifyDays || modifyMonths) {
    var d = new Date(stats.created * 1000);

    if (modifyDays) 	d.setDate(d.getDate() + modifyDays);
    if (modifyMonths) 	d.setMonth(d.getMonth() + modifyMonths);

    time = d.getTime() / 1000;
  }

  return ut_date(time).substr(-4);
}

function addUnit (unit) {
  return unit;
}

function itemTip(i, nosafe){
  var htmlspecialchars = window.htmlspecialchars;
  if(!nosafe)
    htmlspecialchars = function(val) {return val;};
  var s=['','','','','','','','','',''];
  let builds = '';
  if(typeof(g)=='undefined') var g={};
  if(isset(i.name)) s[0]=`<b class="item-name">${parseItemBB(i.name)}</b>`;
  if(isset(i.cl)){
    // if (i.cl==25 && parseInt(i.st)!=10)
	// 		s[1]= '<span class="type-text">' + _t('itype %type% %value%', {'%type%':_t('type'),'%value%':_t('cl_mixtures')})+'</span><br />';//'Typ: Mikstury<br>';
    // else
      s[1]= '<span class="type-text">' +_t('itype %type% %value%', {'%type%':_t('type'),'%value%':eq.classes[i.cl]})+'</span><br />';//'Typ: '+eq.classes[i.cl]+'<br>';
  }
  if(isset(i.builds) && i.builds !== null){
    builds = `<span class="type-text">${_t('one_battle_set', null, 'builds')}: ${i.builds.join(', ')}</span><br />`;
  }
	var soulbound = false;
	var permbound = false;
	var binds = false;
  // var st=i.stat.split(';');

  var st                  = parseItemStat(i.stat);
  let permboundStatExist  = isset(st.permbound);
  let cursedStatExist     = isset(st.cursed);

  var typePrefix = cursedStatExist ? (_t('cursed_prefix')+' ') : '';
  const s9stats = {
    reqp: null,
    maxuselvl: null,
    maxstatslvl: null,
    target_min_lvl: null,
    target_max_lvl: null,
    level: null,
    lvlnext: null,
    reqgold: null,
    reqs: null,
    reqz: null,
    reqi: null,
    rskl: null
  }

  for(var k in st) {
    // if(typeof(st[k]) != 'string') continue;//IE8 FIX
    // var a=st[k].split('='), b;
    // let a = [k, st[k] == null ? '' : st[k]];

    let a= [k];

    if (st[k] != null) {
      a.push(st[k]);
    }

    switch(a[0]) {
      case 'name':
        s[0]="<b>"+htmlspecialchars(parseItemBB(a[1]))+"</b>";
        s[0]+="<i>"+htmlspecialchars(parseItemBB(i.name))+"</i>";
        break;
      case 'rarity':
        if (a[1] === 'common') break; //no type info for common items
        s[0] += `<b class="${a[1]}">* ${typePrefix}${_t(`type_${a[1]}`)} *</b>`
        break;
      case 'unique' :s[0]+='<b class=unique>* '+typePrefix+_t('type_unique')+' *</b>';break;
      case 'heroic' :s[0]+='<b class=heroic>* '+typePrefix+_t('type_heroic')+' *</b>';break;
      case 'legendary' :s[0]+='<b class=legendary>* '+typePrefix+_t('type_legendary')+' *</b>';break;
      case 'artefact' :s[0]+='<b class=artefact>* '+typePrefix+_t('type_artifact')+' *</b>';break;
      case 'upgraded' :s[0]+='<b class=upgraded>* '+typePrefix+_t('type_modified')+' *</b>';break;
      case 'enhancement_upgrade_lvl' :
        var $head = $(s[0]);
        $head.append(` +${a[1]}`);
        s[0] = $head[0].outerHTML;
        break;
      case 'bonus' :
        const [ statName, ...statValues ] = a[1].split(',');
        const
            prefix = '(+',
            suffix = ')';
        let unit = '';
        let trans;
        switch (statName) {
          case 'critmval':
            unit = '%';
            trans = _t(`bonus_of-${statName} %val%`, createTransVal(statValues[0], unit, prefix, suffix), 'newOrder');
            break;
          case 'sa':
            trans = _t('no_percent_bonus_sa %val%', createTransVal((statValues[0]/100), unit, prefix, suffix));
            break;
          case 'ac':
            trans = _t(`item_${statName} %val%`, createTransVal(statValues[0], unit, prefix, suffix));
            break;
          case 'act':
          case 'resfire':
          case 'reslight':
          case 'resfrost':
            unit = '%';
            trans = _t(`item_${statName} %val%`, createTransVal(statValues[0], unit, prefix, suffix), 'newOrder');
            break;
          case 'crit':
          case 'critval':
          case 'resdmg':
            unit = '%';
            trans = _t(`bonus_${statName} %val%`, createTransVal(statValues[0], unit, prefix, suffix), 'newOrder');
            break;
          case 'slow':
            trans = _t(`bonus_${statName} %val%`, createTransVal((statValues[0]/100), unit, prefix, suffix));
            break;
          case 'enfatig':
          case 'manafatig':
            trans = _t(`bonus_${statName}`, {
              ...createTransVal(statValues[0], '%', prefix, suffix, '%val1%'),
              ...createTransVal(statValues[1], unit, prefix, suffix, '%val2%')
            });
            break;
          default:
            trans = _t(`bonus_${statName} %val%`, createTransVal(statValues[0], unit, prefix, suffix));
        }
        s[4] += `<span style="color: #87f187;">${_t('enh_bonus %val%', { '%val%': trans })}</span><br>`;
        break;
      case 'bonus_not_selected':
        s[4] += `<span style="color: #FE5555;">${_t('bonus_not_selected')}</span><br>`;
        break;
      case 'upg' :
        var tmpS = parseItemStat(i.stat);
        //if(!isset(tmpS.upgby)){
          s[0]+='<b class=upgraded>* '+_t('type_modification %val%', {'%val%':a[1]})+' *</b>';
        //}else{
          //s[0]+='<b class=upgraded>* '+_t('type_modification_upgb %val% %name%', {'%val%':a[1], '%name%':tmpS.upgby})+' *</b>';
        //}
        if(isset(tmpS.upgby)){
          s[7]+='<span style="color:yellow">'+_t('type_modification_upgb %val% %name%', {'%val%':a[1], '%name%':tmpS.upgby})+'</span><br />';
        }
        break; //ulepszony o XX%
      //case 'upgby': s[1] += 'asd'break;
      case 'improve':
        var tmp = a[1].split(',');
        var mpx = 1;
        switch(tmp[0]){
          case 'armor':
          case 'jewels':
            mpx = 1.3;
            break;
          case 'armorb':
          case 'weapon':
            mpx = 1;
            break;
        }
        s[3] += _t('improves %items%', {'%items%':_t('improve_'+tmp[0])})+'<br />';
        s[3] += _t('types_list %upg_normal% %upg_uni% %upg_hero%', {
          '%upg_normal%'    : Math.round(mpx*tmp[1]),
          '%upg_uni%'       : Math.round(mpx*tmp[1]*0.7),
          '%upg_hero%'      : Math.round(mpx*tmp[1]*0.4)
        })+'<br />';
        s[3] += _t('improve_item_bound_info')+'<br />';
        break;
      case 'upgby': break;
      case 'lowreq' :
        if (!a[1]) break;
        s[0]+='<b class=upgraded>* '+_t('type_lower_req %val%', {'%val%':a[1]})+' *</b>';break; //zmniejszone wymagania +' o '++'lvl

      case 'expires' :
        if(a[1]-unix_time()<0) {
          var expired = true;
          s[11]='<b class="item-expired expires">' + _t('item_expired') + '</b>';
        } //'WaÅ¼ny do: '+ut_date(a[1])+
        else s[11]='<b class="item-expired">' + _t('valid_expires %date%', {'%val%': calculateDiffFull(a[1], unix_time())}) + '</b>'; //'WaÅ¼ny do: '+ut_date(a[1])+'<br>'
        break;
      case 'expire_date' :
        s[1] += _t('expire_date %date%', { '%date%': a[1] }) + '<br>'; //'DziaÅa do: dd.mm.rrrr'
        break;
      case 'expire_duration' :
        var seconds = convertTimeToSec(a[1]);
        var timeObj = convertSecToTime(seconds);
        var t = '';
        for (var x in timeObj) {
          if(timeObj[x] === 0) continue;
          switch (x) {
            case 'd':
              t += _t('time_days %val%', { '%val%': timeObj[x] }, 'time_diff') + ' ';
              break;
            case 'h':
              t += _t('time_h %val%', { '%val%': timeObj[x] }, 'time_diff') + ' ';
              break;
            case 'm':
              t += _t('time_min %val%', { '%val%': timeObj[x] }, 'time_diff') + ' ';
              break;
            case 's':
              t += _t('time_sec %val%', { '%val%': timeObj[x] }, 'time_diff');
              break;
          }
        }
        s[11] = '<b class="item-expired">' + _t('expire_duration %time%', { '%time%': t }) + '</b>'; //'DziaÅa przez: time'
        break;

      case 'ac' :s[1]+= _t('item_ac %val%', {'%val%':a[1]})+'<br>';break; //'Pancerz : '+a[1]+'
      case 'act' :s[1]+=_t('item_act %val%', {'%val%':mp(a[1])})+'<br>';break; //OdpornoÅÄ na truciznÄ '+mp(a[1])+'%
      case 'resfire' :s[1]+=_t('item_resfire %val%', {'%val%':mp(a[1])})+'<br>';break; //'OdpornoÅÄ na ogieÅ '+mp(a[1])+'%
      case 'reslight' :s[1]+= _t('item_reslight %val%', {'%val%':mp(a[1])})+'<br>';break; //'OdpornoÅÄ na bÅyskawice '+mp(a[1])+'%<br>'
      case 'resfrost' :s[1]+= _t('item_resfrost %val%', {'%val%':mp(a[1])})+'<br>';break; //'OdpornoÅÄ na zimno '+mp(a[1])+'%<br>'
      case 'dmg'  :
        const defaultTranslation = 'item_dmg %val%';
        const translation = i.cl !== 4 ? defaultTranslation : 'item_distance_dmg %val%';
        s[1]+= _t(translation, {'%val%':a[1].replace(',','-')})+'<br>';
        break; //ObraÅ¼enia fizyczne/ObraÅ¼enia fizyczne dystansowe
      case 'pdmg' :s[1]+= _t('item_pdmg %val%', {'%val%':a[1]})+'<br>' ;break; //'Atak fizyczny: +'+a[1]+'<br>'
      case 'perdmg' :s[1]+= _t('item_perdmg %val%', {'%val%':a[1]})+'<br>' ;break; //'Atak zwiÄkszony o '+a[1]+'%<br>'
      case 'zr'   :s[2]+= _t('item_zr %val%', {'%val%':a[1]})+'<br>';break; //'Atak+zrÄcznoÅÄ/'+a[1]+'<br>'
      case 'sila'  :s[2]+= _t('item_sila %val%', {'%val%':a[1]})+'<br>';break; //'Atak+siÅa/'+a[1]+'<br>'
      case 'int'  :s[2]+= _t('item_int %val%')+'<br>' ;break; //'Atak magiczny<br>'
      //after cursed items
      case 'lowcritallval' :s[3]+= _t('bonus_lowcritallval %val%', {'%val%':a[1]})+'<br>';break;
      case 'lowheal2turns' :s[3]+= _t('bonus_lowheal2turns %val%', {'%val%':a[1]})+'<br>';break;
      case 'resacdmg' :s[3] += _t('bonus_resacdmg %val%', {'%val%':a[1]})+'<br>';break;
      case 'resmanaendest' :s[3] += _t('bonus_resmanaendest %val%', {'%val%':a[1], '%val2%':Math.max(1, Math.round(a[1] * 0.444))})+'<br>';break;

      /*************** SKILLS */
      case 'str' :s[2]+= _t('skill_str %val%', {'%val%':a[1]})+'<br>';break; //'Atak +'+a[1]+'*siÅa<br>';
      case 'of-str' :s[2]+= _t('skill_of-str %val%', {'%val%':a[1]})+'<br>' ;break; //'Atak pomocniczy +'+a[1]+'*siÅa<br>'
      case 'agi'  :s[2]+= _t('skills_agi %val%', {'%val%': a[1]})+'<br>';break; // 'Atak +'+a[1]+'*zrÄcznoÅÄ<br>'
      case 'firebon'  :s[2]+= _t('skills_firebon %val%', {'%val%':a[1]})+'<br>';break; //'Atak ogniem +'+a[1]+'*intelekt<br>'
      case 'lightbon'  :s[2]+=_t('skills_lightbon %val%', {'%val%':a[1]})+'<br>';break; //'Atak bÅyskawicami +'+a[1]+'*intelekt<br>'
      case 'frostbon'  :s[2]+=_t('skills_frostbon %val%', {'%val%':a[1]})+'<br>';break; //'Atak zimnem +'+a[1]+'*intelekt<br>'
      //case 'critslow' :s[3]+=_t('skills_critslow %val%', {'%val%':a[1]})+'<br>' ;break; //'Spowolni //enie SA o '+a[1]+'0% po krytyku<br>'
      case 'critslow' :s[3]+=_t('skills_critslow_new_old %val%', {'%val%':(a[1]*10)})+'<br>' ;break; //'Spowolni //enie SA o '+a[1]+'0% po krytyku<br>'
      case 'critsa' :s[3]+=_t('skills_critsa %val%', {'%val%':a[1]})+'<br>';break; //'Przyspieszenie SA o '+a[1]+'% po krytyku na 3 tury.<br>'
      case 'lastcrit' :s[3]+=_t('skills_lastcrit %val%', {'%val%':a[1]})+'<br>';break; //'Ostatni cios krytyczny +'+a[1]+'%<br>'
      case 'decevade' :s[3]+=_t('skills_decevade %val%', {'%val%':a[1]})+'<br>';break; //'Szansa na unik przeciwnika zmniejszona o '+a[1]+' punktÃ³w<br>'
      case 'redslow' :s[3]+=_t('skills_redslow %val%', {'%val%':a[1]})+'<br>' ;break; //'Czas spowolnienia zmniejszony o '+a[1]+'%<br>'
      case 'woundred' :s[3]+=_t('skills_woundred %val%', {'%val%':a[1]})+'<br>' ;break; //'ObraÅ¼enia od gÅÄbokich ran zmniejszone o '+a[1]+'%<br>'
      case 'healpower' :s[3]+=_t('skills_healpower %val%', {'%val%':a[1]})+'<br>' ;break; //'Leczenie z konsumpcyjnych mocniejsze o '+a[1]+'0%<br>'
      case 'engback' :s[3]+=_t('skills_engback %val%', {'%val%':a[1]})+'<br>' ;break; //'Odzyskanie '+a[1]+'% energii po krytyku<br>'
      case 'sa-clothes'  :s[3]+=_t('skills_sa-clothes %val%', {'%val%':a[1]})+'<br>';break; //'SA ubraÅ zwiÄkszone o '+a[1]+'%<br>'
      case 'red-sa'  :s[3]+=_t('skills_red-sa %val%', {'%val%':a[1]})+'<br>' ;break; //'Czas ataku -'+a[1]+'% SA<br>'
      case 'footshoot'  :s[3]+=_t('skills_footshoot %val%', {'%val%':a[1]})+'<br>' ;break; //'Krok do przodu jest wolniejszy o '+a[1]+'%<br>'
      case 'critwound'  :s[3]+=_t('skills_critwound %val%', {'%val%':a[1]})+'<br>' ;break; //'Zranienie '+a[1]+'% szans po krytyku<br>'
      case 'swing' :s[3]+=_t('skills_swing %val%', {'%val%':a[1]})+'<br>' ;break; //'Szansa '+a[1]+'% na atak do 3 przeciwnikÃ³w<br>'
      case 'distract' :s[3]+=_t('skills_distract %val%', {'%val%':a[1]})+'<br>';break; //'Szansa '+a[1]+'% na wytrÄcenie z rÃ³wnowagi po krytyku<br>'
      case 'injure' :s[3]+=_t('skills_injure %val%', {'%val%':a[1]})+'<br>' ;break; //'Szansa '+a[1]+'% na zranienie przeciwnika<br>'
      case 'rage' :s[3]+=_t('skills_rage %val% %turn%', {'%val%':a[1], '%turn%':(parseInt(a[1])>1?_t('turns') : _t('turn'))})+'<br>' ;break; //'WÅciekÅoÅÄ '+a[1]+(parseInt(a[1])>1?' tury' : ' tura')+' po otrzymaniu krytyka<br>'
      case 'reusearrows' :s[3]+=_t('skills_reusearrows %val%', {'%val%':a[1]})+'<br>';break; //'Odzyskiwanie '+a[1]+'% strzaÅ po walce<br>'
      case 'pcontra' :s[3]+=_t('skills_pcontra %val%', {'%val%':a[1]})+'<br>';break; //a[1]+'% szans na kontrÄ po parowaniu<br>'
      case 'fastarrow' :s[3]+=_t('skills_fastarrow %val%', {'%val%':a[1]})+'<br>';break; //a[1]+'% szans 4-krotnie szybsze oddanie strzaÅu<br>'
      case 'bandage' :s[3]+=_t('skills_bandage %val%', {'%val%':a[1]})+'<br>' ;break; //'Uleczenie '+a[1]+' punktÃ³w Å¼ycia<br>'
      case 'set' :s[3]+=_t('skills_set %val%', {'%val%':a[1]})+'<br>' ;break; //'Automatyczne wykonanie '+a[1]+' tur w walce<br>'
      case 'fireshield' :s[3]+=_t('skills_fireshield %val%', {'%val%':a[1]})+'<br>' ;break; //'PochÅania '+a[1]+'% obraÅ¼eÅ od zimna<br>'
      case 'frostshield' :s[3]+=_t('skills_frostshield %val%', {'%val%':a[1]})+'<br>' ;break; //'PochÅania '+a[1]+'% obraÅ¼eÅ od ognia<br>'
      case 'lightshield' :s[3]+=_t('skills_lightshield %val%', {'%val%':a[1]})+'<br>';break; //'Spowalnia atakujÄcego o '+a[1]+'% SA<br>'
      case 'longfireshield' :s[3]+=_t('skills_longfireshield %val%', {'%val%':a[1]})+'<br>';break; //'Tarcza ognia utrzymuje siÄ '+a[1]+' tur<br>'
      case 'longfrostshield' :s[3]+=_t('skills_longfrostshield %val%', {'%val%':a[1]})+'<br>';break; //'Tarcza zimna utrzymuje siÄ '+a[1]+' tur<br>'
      case 'longlightshield' :s[3]+=_t('skills_longlightshield %val%', {'%val%':a[1]})+'<br>';break; //'Tarcza bÅyskawic utrzymuje siÄ '+a[1]+' tur<br>'
      case 'soullink' :s[3]+=_t('skills_soullink %val%', {'%val%':a[1]})+'<br>';break; //'PrzejÄcie '+a[1]+'% obraÅ¼eÅ<br>'
      case 'poisonbon' :s[3]+=_t('skills_poisonbon %val%', {'%val%':a[1]})+'<br>';break; //'Bonus '+a[1]+' obraÅ¼eÅ do trucizny<br>'
      case 'of-thirdatt' :s[3]+=_t('skills_of-thirdatt %val%', {'%val%':a[1]})+'<br>';break; //a[1]+'% szans na 3 atak<br>'
      case 'woundchance' :s[3]+=_t('skills_woundchance %val%', {'%val%':a[1]})+'<br>';break; //'+'+a[1]+'% szans na gÅÄbokÄ ranÄ<br>'
      case 'wounddmgbon' :s[3]+=_t('skills_wounddmgbon %val%', {'%val%':a[1]})+'<br>';break; //'Bonus '+a[1]+' obraÅ¼eÅ do gÅÄbokiej rany<br>'
      case 'arrowrain' :s[3]+=_t('skills_arrowrain %val%', {'%val%':a[1]})+'<br>' ;break; //'Wielokrotny atak o sile '+a[1]+' obraÅ¼eÅ<br>'
      case 'doubleshoot' :break;
      case 'disturb' :s[3]+=_t('skills_disturb %val%', {'%val%':a[1], '%val2%':(parseInt(a[1])*2)})+'<br>';break; //'ObniÅ¼enie krytyka o '+a[1]+'% i przebicia o '+(parseInt(a[1])*2)+'%<br>'
      case 'shout' :s[3]+=_t('skills_shout %val%', {'%val%':a[1]>1?_t('enemies %amount%', {'%amount%':a[1]}):_t('oneenemy')})+'<br>';break; //'Obraza '+(a[1]>1?(a[1]+' przeciwnikÃ³w<br>') : (' przeciwnika<br>'))
      case 'insult' :s[3]+=_t('skills_insult %val%', {'%val%':a[1]})+'<br>' ;break; //'Obraza przeciwnika na '+a[1]+' tur(y)<br>'
      case 'frostpunch'  :s[2]+=_t('skills_frostpunch %val%', {'%val%':a[1]})+'<br>';break; //'PchniÄcie mrozu '+a[1]+' obraÅ¼eÅ<br>'
      case 'redstun' :s[3]+=_t('skills_redstun %val%', {'%val%':a[1]})+'<br>';break; //'Czas ogÅuszenia i zamroÅ¼enia zmniejszony o '+a[1]+'%<br>'
      case 'lightmindmg'  :s[2]+=_t('skills_lightmindmg %val%', {'%val%':a[1]})+'<br>';break; //'ObraÅ¼enia od bÅyskawic przynajmniej '+a[1]+'% wartoÅci maksymalnej<br>'
      case 'actdmg'  :s[2]+=_t('skills_actdmg %val%', {'%val%':a[1]})+'<br>';break; //'ObniÅ¼a odpornoÅÄ na truciznÄ o '+a[1]+'%<br>'
      case 'hpsa'  :s[2]+=_t('skills_hpsa %val%', {'%val%':a[1]})+'<br>' ;break; //'Przyspieszenie o 20% przez '+a[1]+' tur<br>'
      case 'mresdmg'  :s[2]+=_t('skills_mresdmg %val%', {'%val%':a[1]})+'<br>';break; //'ObniÅ¼a odpornoÅÄ na jeden lub kilka rodzajÃ³w magii o '+a[1]+'%<br>'
      case 'cursed': s[7] += _t('item_cursed')+'<br>'; break;
      case 'reqw' :
        s[9]+='<b class="att">'+_t('skills_req_weapon');
        var wp=a[1].split(',');
        for(var k in wp)
          s[9]+=(isset(eq.weapon[wp[k]])?eq.weapon[wp[k]] : '???')+(isset(wp[parseInt(k)+1])?', ' : '');
        s[9]+='</b><br>';
        break;
      case 'rskl' :
        if(isset(i.tmpSkills) && isset(i.tmpSkills.names)) {
          b=a[1].split('-');
          if(isset(i.tmpSkills.names[b[0]])){
            s9stats.rskl = '<b class="att'+((b[1]>i.tmpSkills.names[b[0]].l)?' noreq' : '')+'">'+_t('skills_req_skill')+'<br>&nbsp;&nbsp;&nbsp;'
            +(isset(i.tmpSkills.names[b[0]])?i.tmpSkills.names[b[0]].n : '???')
            +' ('+b[1]+')</b><br>';
          //if (i.tmpSkills.names[b[0]].n.match(/pomocniczej/)) {console.log(i.tmpSkills.names[b[0]]); console.log(b[1]); console.log(i)}
          }else s9stats.rskl ='<b class="att noreq">error</b>'
        }
      break;

      case 'hp'   :s[3]+=_t('bonus_hp %val%', {'%val%':mp(a[1])})+'<br>';break; //'Å»ycie '+mp(a[1])+'<br>'
      case 'sa1'  :
      case 'sa'   :s[3]+=_t('no_percent_bonus_sa %val%', {'%val%': mp(a[1] / 100)})+'<br>' ;break; //'SA '+mp(a[1])+'%<br>'
      case 'ds'   :s[3]+=_t('bonus_ds %val%', {'%val%':mp(a[1])})+'<br>' ;break; //'SiÅa '+mp(a[1])+'<br>'
      case 'dz'   :s[3]+=_t('bonus_dz %val%', {'%val%':mp(a[1])})+'<br>' ;break; //'ZrÄcznoÅÄ '+mp(a[1])+'<br>'
      case 'di'   :s[3]+=_t('bonus_di %val%', {'%val%':mp(a[1])})+'<br>' ;break; //'Intelekt '+mp(a[1])+'<br>'
      case 'da'   :s[3]+=_t('bonus_da %val%', {'%val%':mp(a[1])})+'<br>' ;break; //'Wszystkie cechy '+mp(a[1])+'<br>'
      case 'gold' :
        if (a[1].split(':').length > 1) {
          var newVal = a[1].replace(/[\(\)]/g,'');
          var t = newVal.split(':');
          newVal = _t('start') + ' ' + t[0] + ' ' + _t('stop') + ' ' + t[1];
        } else newVal = mp(a[1]);
        s[3] +=_t('bonus_gold %val%', {'%val%': newVal}) + '<br>';
        break; //'ZÅoto '+mp(a[1])+'<br>'
      case 'creditsbon' :
          if(a[1] && a[1] > 1){
              s[3]+=_t('bonus_creditsbon %val%', {'%val%':a[1]})+'<br>';
          }else{
              s[3]+=_t('bonus_creditsbon')+'<br>';
          }
          break; //'Dodaje jednÄ SmoczÄ ÅzÄ<br>'
	  case 'runes' :s[3]+=_t('bonus_runes %val%', {'%val%':a[1]})+'<br>' ;break; //'Dodaje N smoczych run<br>'
      case 'goldpack' :s[3]+=_t('bonus_goldpack %val%', {'%val%':a[1]})+'<br>';break; //'Zawiera '+a[1]+' zÅota<br>'
      case 'leczy' :
        if(a[1]>0) s[3]+=_t('bonus_leczy %val%', {'%val%':a[1]})+'<br>'; //'Leczy '+a[1]+' punktÃ³w Å¼ycia<br>'
        else {
          if (a[1].split(':').length > 1) {
            var newVal = a[1].replace(/[\(\)]/g,'');
            var t = newVal.split(':');
            newVal = _t('start') + ' ' + t[0] + ' ' + _t('stop') + ' ' + t[1];
            s[3] += _t('bonus_truje2 %val%', {'%val%': newVal}) + '<br>';
          } else s[3] += _t('bonus_truje %val%', {'%val%': Math.abs(a[1])})  + '<br>';
        }
        break; //'Trucizna, ujmuje '+Math.abs(a[1])+' punktÃ³w Å¼ycia<br>'
      case 'perheal' :			//'Leczy '+a[1]+'% Å¼ycia<br>'
        if (a[1] > 0) {
          s[3] += _t('bonus_perheal %val%', {'%val%': a[1]}) + '</span><br>';
        } else {
          s[3] += _t('bonus_perheal_minus %val%', {'%val%': Math.abs(a[1]) + '%'}) + '</span><br>';
        }
        break;
      case 'stamina' :
        s[3] += _t('stamina %val%', {'%val%': a[1]}) + '<br>';
        break;
      case 'fullheal' :s[3]+=_t('bonus_fullheal %val%', {'%val%':round(a[1],2)})+'<br>';break; //'PeÅne leczenie, pozostaÅo '+round(a[1],2)+' punktÃ³w uleczania.<br>'
      case 'perheal' :s[3]+=_t('bonus_perheal %val%', {'%val%':a[1]})+'<br>';break; //'Leczy '+a[1]+'% Å¼ycia<br>'
      case 'blok' :s[3]+=_t('bonus_blok %val%', {'%val%':mp(a[1])})+'<br>' ;break; //'Blok '+mp(a[1])+'<br>'

      case 'crit' :s[3]+=_t('bonus_crit %val%', {'%val%':(a[1].startsWith('-') ? '' : '+') + a[1]})+'<br>' ;break; //'Cios krytyczny +'+a[1]+'%<br>'
      case 'of-crit' :s[3]+=_t('bonus_of-crit %val%', {'%val%':a[1]})+'<br>';break; //'Cios krytyczny pomocniczy +'+a[1]+'%<br>'
      case 'critval' :s[3]+=_t('bonus_critval %val%', {'%val%':(a[1].startsWith('-') ? '' : '+')+a[1]})+'<br>' ;break; //'SiÅa krytyka fizycznego +'+a[1]+'%<br>'
      case 'of-critval' :s[3]+=_t('bonus_of-critval %val%', {'%val%':a[1]})+'<br>';break; //'SiÅa krytyka broni pomocniczej +'+a[1]+'%<br>'
      case 'critmval' :s[3]+=_t('bonus_of-critmval %val%', {'%val%':(a[1].startsWith('-') ? '' : '+')+a[1]})+'<br>';break; //'SiÅa krytyka magicznego +'+a[1]+'%<br>'
      case 'critmval_f' :s[3]+=_t('bonus_critmval_f %val%', {'%val%':a[1]})+'<br>';break; //'SiÅa krytycznego uderzenia magii ognia +'+a[1]+'%<br>'
      case 'critmval_c' :s[3]+=_t('bonus_critmval_c %val%', {'%val%':a[1]})+'<br>';break; //'SiÅa krytycznego uderzenia magii zimna +'+a[1]+'%<br>'
      case 'critmval_l' :s[3]+=_t('bonus_critmval_l %val%', {'%val%':a[1]})+'<br>';break; //'SiÅa krytycznego uderzenia magii bÅyskawic +'+a[1]+'%<br>'
      case 'heal' :s[3]+=_t('bonus_heal %val%', {'%val%':a[1]})+'<br>';break; //'Przywraca '+a[1]+' punktÃ³w Å¼ycia podczas walki<br>'
      case 'evade' :s[3]+=_t('bonus_evade %val%', {'%val%':mp(a[1])})+'<br>';break; //'Unik '+mp(a[1])+'<br>'
      case 'pierce' :s[3]+=_t('bonus_pierce %val%', {'%val%':a[1]})+'<br>';break; //'Przebicie pancerza +'+a[1]+'%<br>'
      case 'pierceb' :s[3]+=_t('bonus_pierceb %val%', {'%val%':a[1]})+'<br>';break; //a[1]+'% szans na zablokowanie przebicia<br>'
      case 'contra' :s[3]+=_t('bonus_contra %val%', {'%val%':a[1]})+'<br>';break; //'+'+a[1]+'% szans na kontrÄ po krytyku<br>'
      case 'parry' :s[3]+=_t('bonus_parry %val%', {'%val%':a[1]})+'<br>';break; //'+'+a[1]+'% szans na sparowanie ataku<br>'
      case 'revive':
        s[3] += _t('revive %amount%', {'%amount%':a[1]})+'<br>';break;
      case 'frost' :
        b=a[1].split(',');
        s[2]+=_t('bonus_frost %val% %slow%', {'%val%':b[1],'%slow%':(b[0]/100)})+'<br>'; //'ObraÅ¼enia od zimna +'+b[1]+'<br>oraz spowalnia cel o '+(b[0]/100)+' SA<br>'
        break;
      case 'poison' :
        b=a[1].split(',');
        s[2]+=_t('bonus_poison %val% %slow%', {'%val%':b[1],'%slow%':(b[0]/100)})+'<br>';break; //'ObraÅ¼enia od trucizny +'+b[1]+'<br>oraz spowalnia cel o '+(b[0]/100)+' SA<br>'
      case 'slow' :s[3]+=_t('bonus_slow %val%', {'%val%':(a[1]/100)})+'<br>';break; //'ObniÅ¼a SA przeciwnika o '+(a[1]/100)+'<br>'
      case 'wound' :
        b=a[1].split(',');
        s[3]+=_t('bonus_wound %val% %dmg%', {'%val%':b[0],'%dmg%':b[1]})+'<br>'; //'GÅÄboka rana, '+b[0]+'% szans na +'+b[1]+' obraÅ¼eÅ<br>'
        break;
      case 'fire' :s[2]+=_t('bonus_fire %val%', {'%val%':a[1]})+'<br>';break; //'ObraÅ¼enia od ognia ~'+a[1]+'<br>'
      case 'light' :s[2]+=_t('bonus_light %val%', {'%val%':a[1].replace(',','-')})+'<br>';break; //'ObraÅ¼enia od bÅyskawic 1-'+a[1]+'<br>'
      case 'adest' :s[3]+=_t('bonus_adest %val%', {'%val%':a[1]})+'<br>';break; //'Zadaje '+a[1]+' obraÅ¼eÅ wÅaÅcicielowi<br>'
      case 'absorb' :s[3]+=_t('bonus_absorb %val%', {'%val%':a[1]})+'<br>';break; //'Absorbuje do '+a[1]+' obraÅ¼eÅ fizycznych<br>'
      case 'absorbm' :s[3]+=_t('bonus_absorbm %val%', {'%val%':a[1]})+'<br>';break; //'Absorbuje do '+a[1]+' obraÅ¼eÅ magicznych<br>'
      case 'hpbon' :s[3]+=_t('bonus_hpbon %val%', {'%val%':a[1]})+'<br>';break; //'+'+a[1]+' Å¼ycia za 1 pkt siÅy<br>'
      case 'acdmg' :s[3]+=_t('bonus_acdmg %val%', {'%val%':a[1]})+'<br>';break; //'Niszczy '+a[1]+' punktÃ³w pancerza podczas ciosu<br>'
      case 'resdmg' :s[3]+=_t('bonus_resdmg %val%', {'%val%':a[1]})+'<br>';break; //'ObniÅ¼enie odpornoÅci o '+a[1]+'% podczas ciosu<br>'
      case 'energy' :
        if(a[1]>0) s[3]+=_t('bonus_energy1 %val%', {'%val%':a[1]})+'<br>'; //'Koszt energii: '+a[1]+'<br>'
        else s[3]+=_t('bonus_energy2 %val%', {'%val%':Math.abs(a[1])})+'<br>'; //'Zysk energii: '+Math.abs(a[1])+'<br>'
        break;
      case 'energybon' :s[3]+=_t('bonus_energybon %val%', {'%val%':mp(a[1])})+'<br>';break; //'Energia '+mp(a[1])+'<br>'
      case 'energygain' :s[3]+=_t('bonus_energygain %val%', {'%val%':mp(a[1])})+'<br>';break; //'Energia '+mp(a[1])+' co turÄ<br>'
      case 'en-regen' :s[3]+=_t('bonus_en-regen %val%', {'%val%':a[1]})+'<br>';break; //'Odzyskanie 5x'+a[1]+' energii<br>'
      case 'energyp' :
        if(a[1]>0) s[3]+=_t('bonus_energyp1 %val%', {'%val%':mp(a[1])})+'<br>'; //'Energia '+mp(a[1])+'%<br>'
        else s[3]+=_t('bonus_energyp2 %val%', {'%val%':Math.abs(a[1])})+'<br>'; //'Zysk energii: '+Math.abs(a[1])+'%<br>'
        break;
      case 'mana' :
        if(a[1]>0) s[3]+=_t('bonus_mana1 %val%', {'%val%':a[1]})+'<br>'; //'Koszt many: '+a[1]+'<br>'
        else s[3]+=_t('bonus_mana2 %val%', {'%val%':Math.abs(a[1])})+'<br>'; //'Zysk many: '+Math.abs(a[1])+'<br>'
        break;
      case 'manabon' :s[3]+=_t('bonus_manabon %val%', {'%val%':mp(a[1])})+'<br>';break; //'Mana '+mp(a[1])+'<br>'
      case 'managain' :s[3]+=_t('bonus_managain %val%', {'%val%':mp(a[1])})+'<br>';break; //'Mana '+mp(a[1])+' co turÄ<br>'
      case 'manastr' :s[3]+=_t('bonus_manastr %val%', {'%val%':a[1]})+'<br>';break; //'Mana +'+a[1]+'*intelekt<br>'
      case 'manarestore' :s[3]+=_t('bonus_manarestore %val%', {'%val%':a[1]})+'<br>';break; //'PrzywrÃ³cenie '+a[1]+' many<br>'
      case 'manatransfer' :s[3]+=_t('bonus_manatransfer %val%', {'%val%':a[1]})+'<br>';break; //'Transfer '+a[1]+' many<br>'
      case 'stun' :s[3]+=_t('bonus_stun %val%', {'%val%':a[1]})+'<br>';break; //'Szansa na ogÅuszenie '+a[1]+'%<br>'
      case 'freeze' :s[3]+=_t('bonus_freeze %val%', {'%val%':a[1]})+'<br>';break; //'Szansa na zamroÅ¼enie '+a[1]+'%<br>'
      case 'hpcost' :s[3]+=_t('bonus_hpcost %val%', {'%val%':a[1]})+'<br>';break; //'Strata '+a[1]+'% Å¼ycia<br>'
      case 'cover' :s[3]+=_t('bonus_cover %val%', {'%val%':a[1]})+'<br>';break; //'PrzejÄcie na siebie '+a[1]+'% obraÅ¼eÅ<br>'
      case 'allslow' :s[3]+=_t('bonus_allslow %val%', {'%val%':a[1]})+'<br>';break; //'Spowolnienie wrogÃ³w o '+a[1]+'% SA<br>'
      case 'firearrow':
      case 'firepunch':
      case 'firebolt' :s[3]+=_t('bonus_firebolt %val%', {'%val%':a[1]})+'<br>';break; //a[1]+' dodatkowych obraÅ¼eÅ od ognia<br>'
      case 'firewall' :s[3]+=_t('bonus_firewall %val%', {'%val%':a[1]})+'<br>';break; //'Åciana ognia '+a[1]+' obraÅ¼eÅ<br>'
      case 'thunder' :s[3]+=_t('bonus_thunder %val%', {'%val%':a[1]})+'<br>';break; //a[1]+' obraÅ¼eÅ od bÅyskawic<br>'
      case 'storm' :s[3]+=_t('bonus_storm %val%', {'%val%':a[1]})+'<br>';break; //a[1]+' obraÅ¼eÅ od burzy bÅyskawic<br>'
      case 'lowdmg' :s[3]+=_t('bonus_lowdmg %val%', {'%val%':a[1]})+'<br>';break; //'NastÄpny atak wroga obniÅ¼ony o '+a[1]+'%<br>'
      case 'blizzard' :s[3]+=_t('bonus_blizzard %val%', {'%val%':a[1]})+'<br>';break; ///a[1]+' obraÅ¼eÅ od zamieci<br>'
      case 'sunshield' :s[3]+=_t('bonus_sunshield %val%', {'%val%':a[1], '%val2%':(a[1]/2)})+'<br>';break; //'Tarcza sÅoÅca +'+a[1]+' pancerza, +'+(a[1]/2)+' leczenia<br>'
      case 'sunreduction' :s[3]+=_t('bonus_sunreduction %val%', {'%val%':a[1]})+'<br>';break; //'ObraÅ¼enia od zimna i bÅyskawic -'+a[1]+'%<br>'
      case 'healall' :s[3]+=_t('bonus_healall %val%', {'%val%':a[1]})+'<br>';break; //'PrzywrÃ³cenie wszystkim '+a[1]+' punktÃ³w Å¼ycia<br>'
      case 'heal1' :s[3]+=_t('bonus_heal1 %val%', {'%val%':a[1]})+'<br>';break; //'Moc leczenia +'+a[1]+'<br>'
      case 'aura-ac' :s[3]+=_t('bonus_aura-ac %val%', {'%val%':mp(a[1])})+'<br>';break; //'Aura: pancerz '+mp(a[1])+'<br>'
      case 'aura-resall' :s[3]+=_t('bonus_aura-resall %val%', {'%val%':mp(a[1])})+'<br>';break; //'Aura: odpornoÅci magiczne '+mp(a[1])+'%<br>'
      case 'aura-sa' :s[3]+=_t('bonus_aura-sa %val%', {'%val%':mp(a[1]/100)})+'<br>';break; //'Aura: SA '+mp(a[1]/100)+'<br>'
      case 'absorbd' :s[3]+=_t('bonus_absorbd %val%', {'%val%':a[1]})+'<br>';break; //'Absorpcja o '+a[1]+'% skuteczniejsza przeciw broni dystansowej<br>'
      case 'stinkbomb' :s[3]+=_t('bonus_stinkbomb %val% %crit%', {'%val%':(parseInt(a[1])*2), '%crit%':a[1]})+'<br>';break; //'ObniÅ¼enie szansy na przebicie o '+(parseInt(a[1])*2)+'% i krytyka o '+a[1]+'%<br>'

      case 'target_rarity' :		// Wymagana rzadkoÅÄ przedmiotu: %val%
        let itemTypeTrans = _t(`type_${a[1]}`);
        s[3] += _t(`bonus_${a[0]} %val%`, { '%val%': itemTypeTrans}) + '<br>';
        break;
      case 'bonus_reselect' :		// ZastÄpuje aktualny bonus wzmocnienia innym, losowym
        s[3] += _t(`bonus_${a[0]}`) + '<br>';
        break;
      case 'force_binding' :		// WiÄÅ¼e z wÅaÅcicielem ulepszany przedmiot
      case 'socket_component' :		// Komponent sÅuÅ¼Äcy do tworzenia symboli
      case 'socket_enhancer' :
        s[3] += _t(`${a[0]}`) + '<br>';
        break;

      case 'abdest' :s[3]+=_t('bonus_abdest %val%', {'%val%':a[1]})+'<br>';break; //'Niszczenie '+a[1]+' absorpcji przed atakiem<br>'
      case 'endest' :s[3]+=_t('bonus_endest %val%', {'%val%':a[1]})+'<br>';break; //'Niszczenie '+a[1]+' energii podczas ataku<br>'
      case 'manadest' :s[3]+=_t('bonus_manadest %val%', {'%val%':a[1]})+'<br>';break; //'Niszczenie '+a[1]+' many podczas ataku<br>'
      case 'lowevade' :s[3]+=_t('bonus_lowevade %val%', {'%val%':a[1]})+'<br>';break; //'Podczas ataku unik przeciwnika jest mniejszy o '+a[1]+'<br>'
      case 'lowcrit' :s[3]+=_t('bonus_lowcrit %val%', {'%val%':a[1]})+'<br>';break; //'Podczas obrony szansa na cios krytyczny przeciwnika jest mniejsza o '+a[1]+'%<br>'
      case 'arrowblock' :s[3]+=_t('bonus_arrowblock %val%', {'%val%':a[1]})+'<br>';break; //'Podczas obrony szansa na zablokowanie strzaÅy/beÅtu '+a[1]+'%<br>'
      case 'honorbon'	:s[3]+=_t('bonus_honorbon %val%', {'%val%':a[1]})+'<br>';break;		//'zwiÄksza iloÅÄ otrzymywanych punktÃ³w honoru<br>'
      case 'enhancement_add'	:s[3]+=_t('bonus_enhancement_add %val%', {'%val%':a[1]+'%'})+'<br>';break;		//Dodaje %val% punktÃ³w wymaganych do zaklÄcia przedmiotu
      case 'enhancement_add_point'	:s[3]+=_t('bonus_enhancement_add_point')+'<br>';break;		//Ulepsza przedmiot o jeden punkt
      case 'add_enhancement_refund':
      case 'reset_custom_teleport':
      case 'add_tab_deposit':
        s[4] += _t('bonus_' +  a[0]) + '<br>';
        break;
      case 'add_battleset': //Odblokowuje nowy zestaw do walki
        s[4] += _t(a[0]) + '<br>';
        break;
      case 'enhancement_refund' :
        s[4] += _t('bonus_' +  a[0]) + '<br>';
        if (a[1] > 1) s[4] += _t('bonus_' +  a[0] + '_amount', {'%val%': a[1]}) + '<br>';
        break;
      case 'manafatig':
      case 'enfatig':
        const p = a[1].split(',');
        s[3] += _t('bonus_' +  a[0], {'%val1%': mp(p[0]) + addUnit('%'), '%val2%': p[1]}) + '<br>';
        break;
      //case 'quest_expbon' :s[3]+=_t('bonus_quest_expbon %val%', {'%val%':a[1] + '%'})+'<br>';break;	//'zwiÄksza iloÅÄ zdobywanych punktÃ³w doÅwiadczenia za questy<br>'
      case 'quest_expbon' :
				if (a[1] > 0)  s[3]+= _t('bonus_quest_expbon higher %val%', {'%val%':a[1] + '%'})+'<br>';	//'zwiÄksza iloÅÄ zdobywanych punktÃ³w doÅwiadczenia za questy<br>'
      	else 					 s[3]+= _t('bonus_quest_expbon lower %val%', {'%val%':a[1] + '%'})+'<br>';	//'zwiÄksza iloÅÄ zdobywanych punktÃ³w doÅwiadczenia za questy<br>'
				break;

      case 'bag'  :
        var posfix = _l() == 'pl' ? ($.inArray(a[1]%10,[2,3,4])<0||a[1]>=6&&a[1]<=19?'Ã³w' : 'y') : (a[1] > 1  ? 's' : '');
        s[3]+=_t('bonus_bag %val%', {'%val%':a[1], '%posfix%':posfix})+'<br>';
        break; //'MieÅci '+a[1]+' przedmiot'+($.inArray(a[1]%10,[2,3,4])<0||a[1]>=6&&a[1]<=19?'Ã³w' : 'y')+'<br>'
      case 'pkey' :s[3]+=_t('bonus_pkey')+'<br>';break; //'Klucz gÅÃ³wny<br>'
      case 'rkeydesc' :s[3]+=_t('bonus_rkeydesc', {'%val%':a[1]})+'<br>';break; //'Otwiera: a[1]'
      case 'btype'  :
        const btypes = a[1].split(',')
        const typeTranslations = [];
        for (const type of btypes) {
          typeTranslations.push(eq.classes[type].toLowerCase());
        }
        s[4] += _t('bonus_btype %val%', {'%val%': typeTranslations.join(', ')}) + '<br>';
        break; //'Tylko '+eq.classes[a[1]].toLowerCase()+'<br>'

      case 'respred' :s[3]+=_t('bonus_respred %val%', {'%val%':a[1]})+'<br>';break; //'PrzyÅpiesza wracanie do siebie o '+a[1]+'%<br>'
      case 'afterheal' :
      case 'afterheal2' :
        var b=a[1].split(',');
        s[3]+=b[0]+_t('bonus_afterheal2 %val%', {'%val%':b[1]})+'<br>'; //'% szans na wyleczenie '+b[1]+' obraÅ¼eÅ po walce<br>'
        break;
      case 'action':
        var c = a[1].split(',');
        switch(c[0]){
          case 'flee': s[3] += _t('flee_item_description')+'<br />'; break;
          case 'mail': s[3] += _t('mail_item_description')+'<br />'; break;
          case 'auction': s[3] += _t('auction_item_description')+'<br />'; break;
          case 'nloc':
            if(c[1] == '*') s[3] += _t('nloc_heros_item_description')+'<br />';
            else s[3] += `${_t('nloc_monster_item_description')}: ${c[1]}<br />`;
            break;
          case 'fatigue':
            var f_val = parseInt(c[1]);
            if(f_val > 0){
              s[3] += _t('fatigue_positive %val%', {'%val%':Math.abs(f_val)})+'<br />';
            }else{
              s[3] += _t('fatigue_negative %val%', {'%val%':Math.abs(f_val)})+'<br />';
            }
            break;
          case 'fightperheal':
            if(c.length == 2) s[3] += _t('fightperheal %amount%', {'%amount%':c[1]})+'<br/>';
            else if (c.length == 3) s[3] += _t('fightperheal %from% %to%', {'%from%':c[1], '%to%':c[2]})+'<br/>';
            break;
          case 'deposit':
            s[3] += _t('call_depo') + '<br />';
            break;
          case 'clandeposit':
            s[3] += _t('call_clandepo') + '<br />';
            break;
					case 'shop':
						s[3] += _t('call_shop') + '<br />';
						break;
        }
        break;
			case 'recipe':
				s[3] = _t('recipe_dbl_click') + '<br>';
				break;
      case 'outfit_selector':
        s[3] += _t('outfit_selector') + '<br />';
        break;
      case 'outfit' :
        var b=a[1].split(','),tm='',perm=false;
        if(b[0]<1) {
          perm = true;
        }
        else
        if(b[0]==1) tm=_t('outfit_1min'); //'1 minutÄ'
        else
        if(b[0]<5) tm=b[0]+_t('outfit_mins1'); //" minuty"
        else
        if(b[0]<99) tm=b[0]+_t('outfit_mins2'); //" minut"
        else
        if(b[0]<300) tm=round(b[0]/60)+_t('outfit_hrs1'); //" godziny"
        else tm=round(b[0]/60)+_t('outfit_hrs2'); //" godzin"

        var changeOn = '';
        if (isset(b[2])) changeOn = _t('in') + b[2];

        if (perm) s[3]+=_t('outfit_change_perm') + changeOn +'<br>'; //'Zmienia twÃ³j wyglÄd na staÅe<br>'
        else s[3]+=_t('outfit_change_for %time%', {'%time%': tm}) + changeOn +'<br>'; //'Zmienia twÃ³j wyglÄd na '+tm+'<br>'
        break;
      case 'battlestats':
        if (!isset(g.skills)) {
          g.skills = new skills();
        }
        s[3] += _t('battlestats', {'%val%': g.skills.parseStatsToItemTip(a[1])})+'<br/>'; //Mikstura specjalna do uÅ¼ycia w walce. Efekt:<br/>%val%<br/>MoÅ¼na uÅ¼ywaÄ raz na walkÄ.
        break;
      case 'freeskills':
        s[3] += _t('freeskills', {'%val%': a[1]}) + '<br />';
        break;
      case 'npc_expbon':
        if(a[1] > 0) s[3] += _t('npx_expbon higher %amount%', {'%amount%': Math.abs(a[1]) + '%'})+'<br/>';
        else if(a[1] < 0) s[3] += _t('npx_expbon lower %amount%', {'%amount%': Math.abs(a[1]) + '%'})+'<br/>';
        break;
      case 'wanted_change':
        if (a[1] >= 0) s[4] += _t(`${a[0]} higher %val%`, {'%val%': Math.abs(a[1])}) + '<br/>';
        else s[4] += _t(`${a[0]} lower %val%`, {'%val%': Math.abs(a[1])}) + '<br/>';
        break;
      case 'npc_lootbon':
        s[3] += _t('npx_lootbon higher %amount%', {'%amount%':a[1]})+'<br/>';
        break;
      case 'timelimit' :
        var b=a[1].split(',');
        if(b[0]<1) s[3]+=_t('timelimit_can be used %val% sec', {'%val%':b[0]})+'<br>'; //'MoÅ¼na uÅ¼ywaÄ co '+b[0]+' sekund<br>'
        else if(b[0]==1) s[3]+=_t('timelimit_can be used every min')+'<br>' ; //'MoÅ¼na uÅ¼ywaÄ co 1 minutÄ<br>'
        else if(b[0]<5) s[3]+=_t('timelimit_can be used %val% minutes', {'%val%':b[0]})+'<br>'; //'MoÅ¼na uÅ¼ywaÄ co '+b[0]+' minuty<br>'
        else s[3]+=_t('timelimit_can be used %val% minutes2', {'%val%':b[0]})+'<br>' ; //'MoÅ¼na uÅ¼ywaÄ co '+b[0]+' minut<br>'
        if (isset(b[1])){
          var sec = Math.floor((parseInt(b[1])-unix_time()) / 60);
          if (sec<0) s[3]+=_t('timelimit_readyToUse_now')+'<br>'; //'Gotowy do uÅ¼ycia<br>'
          else if(sec<1) s[3]+=_t('timelimit_readyToUse_inawhile')+'<br>'; //'Gotowy do uÅ¼ycia za chwilÄ<br>'
          else if(sec==1) s[3]+=_t('timelimit_readyToUse_inaminute')+'<br>'; //'Gotowy do uÅ¼ycia za minutÄ<br>'
          else if(sec<5) s[3]+=_t('timelimit_readyToUse_in %val% sec', {'%val%':sec})+'<br>'; //'Gotowy do uÅ¼ycia za '+sec+' minuty<br>';
          else s[3]+=_t('timelimit_readyToUse_in %val% min', {'%val%':sec})+'<br>'; //'Gotowy do uÅ¼ycia za '+sec+' minut<br>'
        }
        break;
      case 'ttl' :
        if (i.cl==25&&(i.loc=='t'||i.loc=='n'||i.loc=='o'||i.loc=='r'||i.loc=='d'||i.loc=='c'||(i.loc=='g' && (i.st==0 || i.st==9))||(i.loc=='s'&&i.st==0))) s[4]+=_t('ttl1 %date%', {'%val%': a[1]})+'<br />'; //'DziaÅa '+a[1]+'min<br>';
        else s[4]+=_t('ttl2 %date%', {'%val%': a[1]})+'<br />'; //'Zniknie za '+a[1]+'min<br>'
        break;
      case 'amount':
				var stats = parseItemStat(i.stat);
				var am = parseInt(stats.amount);
				var split = true;
				if (am <= 1) split = false;
				if (isset(stats.quest)) split = false;
				if (i.st != 10) {
          let val = isRanges(a[1]) ? getRanges(a[1]) : a[1];
					if (cursedStatExist ) {
						s[4] += '<span class="amount-text">' + _t('cursed_amount %val%', {'%val%': val}) + '</span><br>' ;
					} else {
						s[4] += '<span class="amount-text">' + _t('amount %val% %split%', {'%val%': val,'%split%': ''}) + '</span><br>';
					}
				}
				break; //'IloÅÄ: '+a[1]+'
			case 'cansplit' :
				if (i.st == 0 || i.st == 9 || i.loc == 'o') s[4] += (parseInt(a[1]) ? _t('split_possible') : _t('split_impossible'))  + '<br>'; // i.loc == 'o'  FIX TO NEWS ON SI
				break;
			case 'nosplit' :
				s[4] += _t('split_impossible') + '<br>';
				break;
			case 'maxuselvl':
        s9stats.maxuselvl = '<b class="att">' + _t('maxuselvl') + a[1] + '</b><br>';
				break;
			case 'maxstatslvl':
        s9stats.maxstatslvl = '<b class="att">' + _t('maxstatslvl') + a[1] + '</b><br>';
				break;
			case 'capacity' :if (i.st!=10) s[4]+=_t('capacity %val%', {'%val%':a[1]})+'<br>';break; //'Maksimum '+a[1]+' sztuk razem<br>'
      case 'noauction' :
        var stop = false;
        // for (var k in st) {
        //   if (st[k] == "permbound") stop = true;
        // }

        if (permboundStatExist) {
          stop = true;
        }

        if (stop) break;
        s[4] += _t('noauction') + '<br>';   // 'Tego przedmiotu nie moÅ¼na wystawiÄ na aukcjÄ'
        break;
      case 'nodepo' :
				if (i.cl == 25 && (i.loc == 'g' && (i.st != 0 && i.st != 9))) break;
				s[4]+=_t('nodepo_info')+'<br />';
				break; //'Przedmiotu nie moÅ¼na przechowywaÄ w depozycie <br>'
      case 'nodepoclan' :
				var stop = false;
				// for (var k in st) {
				// 	if (st[k] == "permbound") stop = true;
				// }

        if (permboundStatExist) {
          stop = true;
        }

				if (stop) break;
				s[4]+=_t('nodepoclan_info')+'<br />';
				break; //'Przedmiotu nie moÅ¼na przechowywaÄ w depozycie <br>'

      case 'legbon' :
        s[5] += '<i class=legbon>';
        var b = a[1].split(',');
        var val = null;
        switch (b[0]) {
          case 'verycrit' : if (val == null) val = 17;
          case 'holytouch' : if (val == null) val = 7;
          case 'curse' : if (val == null) val = 9;
          case 'pushback' : if (val == null) val = 8;
          case 'lastheal' : if (val == null) val = 18;
          case 'critred' : if (val == null) val = 25;
          case 'resgain' : if (val == null) val = 16;
          case 'dmgred' : if (val == null) val = 16;
          case 'cleanse' : if (val == null) val = 12;
          case 'glare' : if (val == null) val = 9;
          case 'facade': if (val == null) val = 13;
          case 'anguish': if (val == null) val = 8;
          case 'retaliation': if (val == null) val = 16;
          case 'puncture': if (val == null) val = 12;
          case 'frenzy': if (val == null) val = 2;
            s[5] += _t('legbon_' + b[0], {'%val%': val});
            break; //'Fizyczna osÅona: obraÅ¼enia fizyczne zmniejszone o 12%.'
          default :
            s[5] += _t('legbon_undefined %val%', {'%val%': b[0]});
            break; //'Nieznany bonus: '+b[0]
        }
        s[5] += '</i>';
        break;
      case 'legbon_test' :
        s[5] += '<i class=legbon>';
        var b = a[1].split(',');
        var val = null;
        switch (b[0]) {
          case 'verycrit' :
          case 'holytouch' :
          case 'curse' :
          case 'pushback' :
          case 'lastheal' :
          case 'critred' :
          case 'resgain' :
          case 'dmgred' :
          case 'cleanse' :
          case 'glare' :
          case 'facade':
          case 'anguish':
          case 'retaliation':
          case 'puncture':
          case 'frenzy':
            s[5] += 'TEST: ' + _t('legbon_' + b[0], {'%val%': b[1]});
            break; //'Fizyczna osÅona: obraÅ¼enia fizyczne zmniejszone o 12%.'
          default :
            s[5] += _t('legbon_undefined %val%', {'%val%': b[0]});
            break; //'Nieznany bonus: '+b[0]
        }
        s[5] += '</i>';
        break;
      case 'lvlnext':
        s9stats.lvlnext = '<b class="lvl-next">'+ _t('match_bonus_' +  a[0] + ' %val%', {'%val%': a[1]}) + '</b>';
        break;
      case 'lvlupgcost':
      case 'lvlupgs':
        s[4] += _t('match_bonus_' +  a[0] + ' %val%', {'%val%': a[1]}) + '<br>';
        break;
      case 'upglvl':
        s[4] += _t('match_bonus_' +  a[0] + ' %val%', {'%val%': _t(a[1])}) + '<br>';
        break;

      case 'expadd':	//Dodaje %val%-krotnoÅÄ doÅwiadczenia za zabicie przeciwnika na twoim poziomie
        s[4] += _t('bonus_' +  a[0] + ' %val%', {'%val%': a[1]}) + '<br>';
        break;

      case 'expaddlvl':	//Dodaje %val%-krotnoÅÄ doÅwiadczenia za zabicie przeciwnika na poziomie %val2%
        var b = a[1].split(',');
        var lvl = b[0];
        if (typeof hero != 'undefined' && getHeroLevel() < b[0]) {
          lvl = getHeroLevel()
        }
        s[4] += _t('bonus_' +  a[0]+ ' %val%', {'%val%': b[1], '%val2%': lvl}) + '<br>';
        break;

      case 'townlimit' :s[5]+='<i class=idesc>'+_t('townlimit')+'</i>';break; //'DziaÅa tylko w wybranych lokacjach<br>'
      case 'teleport':
        let [tp_id, tp_x, tp_y, tp_map] = a[1].split(',');
        s[7] = `<i class=idesc>${_t('teleport')}:<br>${tp_map} (${tp_x},${tp_y}).</i> ${s[7]}`;
				break;
			case 'custom_teleport':
				if (a.length == 1 ) s[7] += '<i class=idesc>' +_t('dbl_click_to_set') +'</i>';
				else {
          let [tp_id, tp_x, tp_y, tp_map] = a[1].split(',');
          s[7] = `<i class=idesc>${_t('teleport')}:<br>${tp_map} (${tp_x},${tp_y}).</i> ${s[7]}`;
        }
				break;
			case 'furniture' :s[6]+=_t('furniture', null, 'itemtip')+'<br>';break;
      case 'nodesc'    :s[6]+='<i class=idesc>'+_t('nodesc')+'</i>';break; //Przedmiot niezidentyfikowany
      case 'created':break;
      case 'pumpkin_weight':
        const weight = `${a[1]/1000}kg`;
        s[7] += `<i class="idesc">${_t('pumpkin_weight')} ${weight}</i><br>`;
        break;
      case 'opis':
        var stats = parseItemStat(i.stat);
        //if(isset(stats.created)){
        //a[1] = a[1].replace(/#DATE#|#YEAR#/g, function(m) {
        //  switch (m) {
        //    case '#DATE#':
        //      if (!isset(stats.created))
        //        return ut_date(unix_time());
        //      return ut_date(stats.created);
        //    case '#YEAR#':
        //      if (!isset(stats.created)) {
        //        //if (i.loc == 'n' || i.loc == 'v') {
        //          var tmp_date = new Date();
        //          return tmp_date.getFullYear();
        //        //}
        //        //return '2012';
        //      }
        //      return ut_date(stats.created).substr(-4);
        //  }
        //});
        //}
        a[1] = parseOpisStat(a[1], stats);

        s[7]+='<i class=idesc>'+parseItemBB(a[1])+'</i>';
        break;

      case 'loot': //nick,plec,liczebnoÅÄ grupy,ts,npc
        var b=a[1].split(','), gr='';
        if(b[2]==2) gr=_t('with_player'); //' wraz z kompanem';
        if(b[2]>2) gr=_t('with_company'); //' wraz z druÅ¼ynÄ';
        s[7]+='<i class=looter>'+htmlspecialchars(_t('loot_with %day% %npc% %grpinf% %name%', {'%day%':ut_date(b[3]), '%npc%':b[4], '%grpinf%':gr,'%name%':b[0]}))+'</i><br>'; //'W dniu '+ut_date(b[3])+' zostaÅ(a) pokonany(a) '+b[4]+' przez '+b[0]+gr+'
        break;
      case 'lootbox' :
        break;
      case 'lootbox2' :
        break;
      case 'animation' :
        break;

			case 'timelimit_upgmax' :
				s[3] += _t('Corecttimelimit_upgmax', {'%val%':a[1]}) + '<br>';
				break;
			case 'upgtimelimit' :
				s[4] += _t('Corectupgtimelimit') + '<br>';
				break;
			case 'timelimit_upgs' :
				s[3] += _t('Corecttimelimit_upgs', {'%val%':a[1]}) + '<br>';
				break;

      case 'soulbound' :
        soulbound = true
        break;
      case 'permbound' :
        permbound = true
        break;
      case 'canpreview' :
        s[8] += _t('canpreviewitem') + '<br>';
        break;
      case 'recovered' :s[8]+=_t('recovered')+'<br>';break; //'Przedmiot odzyskany, obniÅ¼ona wartoÅÄ, nie moÅ¼e byÄ wystawiany na aukcjÄ<br>'
      case 'binds' :
        binds = true;
        break;
      case 'unbind' :s[8]+=_t('unbind')+'<br>';break; //'PrzeciÄgnij na postaÄ, by aktywowaÄ<br>' : 'WiÄÅ¼e po zaÅoÅ¼eniu<br>'
      case 'unbind_credits' :break;
      case 'undoupg' :s[8]+=_t('undoupg')+'<br>';break; //'PrzeciÄgnij na postaÄ, by aktywowaÄ<br>' : 'WiÄÅ¼e po zaÅoÅ¼eniu<br>'
      case 'notakeoff' :s[8]=_t('notakeoff')+'<br>';break; //'Czar niemoÅ¼liwy do zdjÄcia<br>'

      case 'summonparty' :s[8]=_t('summonparty')+'<br>';break; //'PrzywoÅuje do Ciebie wszystkich czÅonkÃ³w Twojej druÅ¼yny<br>'

      case 'lvl' :
        s9stats.level = '<b class="att'+((a[1]>getHeroLevel())?' noreq' : '')+'">'+_t('lvl %lvl%', {'%lvl%':a[1]})+'</b><br>';break; //'Wymagany poziom: '+a[1]+
      case 'reqp' :
        s9stats.reqp='<b class="att'+((a[1].indexOf(hero.prof)<0)?' noreq' : '')+'">'+_t('reqp')+' ';
        for(var j=0; j<a[1].length; j++)
          s9stats.reqp+=(j?', ' : '')+eq.prof[a[1].charAt(j)];
        s9stats.reqp+='</b><br>'; //((j==2 && a[1].length!=2)?'<br>&nbsp;' : '')+
        break;
      case 'target_class' :
        const text = parseTargetClass(a[1]);
        s9stats.target_class = `<b class="att">${_t('req_item')}: ${text}</b>`;
        break;
      case 'reqgold' : s9stats.reqgold = '<b class="att'+((a[1]>hero.gold)?' noreq' : '')+'">'+_t('reqgold %val%', {'%val%':a[1]})+'</b><br>';break; //'Wymagane zÅoto: '+a[1]+
      case 'reqs' : s9stats.reqs = '<b class="att'+((a[1]>hero.bstr)?' noreq' : '')+'">'+_t('reqs %val%', {'%val%':a[1]})+'</b><br>';break; //'Wymagana siÅa: '+a[1]+
      case 'reqz' : s9stats.reqz ='<b class="att'+((a[1]>hero.bagi)?' noreq' : '')+'">'+_t('reqz %val%', {'%val%':a[1]})+'</b><br>';break; //'Wymagana zrÄcznoÅÄ: '+a[1]+
      case 'reqi' :s9stats.reqi ='<b class="att'+((a[1]>hero.bint)?' noreq' : '')+'">'+_t('reqi %val%', {'%val%':a[1]})+'</b><br>';break; //'Wymagana intelekt: '+a[1]+
      case 'pet':
        //if (a[1].match(/elite/)) s[0] += '<i style="color:yellow">'+_t('pet_elite', null, 'pet_tip')+'</i>'; //elita
        //if (a[1].match(/heroic/)) s[0] += '<i style="color:#2090FE">'+_t('pet_heroic', null, 'pet_tip')+'</i>';
        //if (a[1].match(/legendary/)) s[0] += '<i style="color:#FA9A20;">'+_t('pet_legendary', null, 'pet_tip')+'</i>';
        var tmplist = a[1].split(',');
        for(var j=2;j<tmplist.length;j++){
          if (tmplist[j] == 'elite' || tmplist[j] == 'quest' || tmplist[j] == 'heroic' || tmplist[j] == 'legendary') continue;
          var alist = tmplist[j].split('|');
          if (alist.length){
            s[2] = '<span style="color:lime">'+_t('pet_tasks')+'<br />'; //Wykonuje polecenia:
            for(var k=0; k<alist.length; k++){
              s[2] += '- '+alist[k].replace(/#.*/, '')+'<br />';
            }
            s[2] += '</span>';
          }
          break;
        }
        if (a[1].match(/,quest/)) s[2] += _t('pet_logout_hide')+'<br />'; //'Chowaniec znika po wyjÅciu z gry
        break;
      case 'outexchange': // MoÅ¼liwoÅÄ wymiany stroju na nowy.
      case 'personal': //Przedmiot spersonalizowany
      case 'artisan_worthless': // BezuÅ¼yteczny skÅadnik rzemieÅlniczy
        s[8]+=_t(a[0])+'<br>';
        break;
      case 'artisanbon' :
        s[8] += _t(`${a[0]} %val%`, { '%val%': a[1] + '%'}) + '<br>';
        break;
      case 'target_min_lvl' :
      case 'target_max_lvl' :
        s9stats[a[0]] = '<b class="att">' + _t(`${a[0]} %val%`, { '%val%': a[1] }) + '</b><br>';
        break;
      case 'book' :
      case 'price':
      case 'resp':
      case 'key' :
      case 'mkey' :
      case 'rkey' :
      case 'rlvl' :
      case 'motel' :
      case 'emo' :
      case 'quest' :
      case 'play':
      case 'szablon' :
      case 'null':
      case 'progress' :break;
      default:if(a[0]!='') s[3]+=_t('unknown_stat %val%', {'%val%':a[0]})+'<br>';break; //'Nieznany stat: '+a[0]+'<br>'
    }
  }
	var beforeBoundS8 = s[8];
	if (permbound) {
      if (i.loc=='n') {
        s[8]=_t('permbound')+'<br>'; //'WiÄÅ¼e na staÅe po kupieniu';
      } else {
        if (i.cl==22 && !(isset(expired) && expired)) {
          s[8]= _t('permbound1')+'<br>';
        } else {
          s[8]= _t('permbound_item')+'<br>';
        }
        s[8] += beforeBoundS8;
      }
	} else if (soulbound) {
      if (i.cl==22 && !(isset(expired) && expired)) {
        s[8]= _t('soulbound1')+'<br>';
      } else {
        s[8]= _t('soulbound2')+'<br>';
      }
      // s[8]=(i.cl==22)?_t('soulbound1')+'<br>' : _t('soulbound2')+'<br>'; // 'Aktywny i zwiÄzany z wÅaÅcicielem<br>' : 'ZwiÄzany z wÅaÅcicielem<br>';
      s[8] += beforeBoundS8;
	} else if (binds) {
      if (i.cl==22) {
        s[8]+=!(isset(expired) && expired)?_t('binds1')+'<br>':'';
      } else {
        s[8]+=_t('binds2')+'<br>';
      }
      //'PrzeciÄgnij na postaÄ, by aktywowaÄ<br>' : 'WiÄÅ¼e po zaÅoÅ¼eniu<br>'
    }
  s[8] = s[8] + builds;
  s9statsParse(s9stats, s);
  if(i.pr && (!(isset(i.cl) && i.cl==25) || (i.loc=='n' || i.loc=='t' && (isset(i.cl) && i.cl==25))))s[9]+='<div class="value-item">'+_t('item_value %val%', {'%val%':round(i.pr,3)}) + '</div>'; //"WartoÅÄ: "+round(i.pr,2)
  else s[9]=s[9].replace(/\<br>$/g,"");

  return s.join('');
}

function s9statsParse (s9stats, s) {
  for (const stat of Object.keys(s9stats)) {
    if(s9stats[stat] !== null) s[9] += s9stats[stat];
  }
}
