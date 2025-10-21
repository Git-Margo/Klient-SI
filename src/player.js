/** hero.opt possibilities:
 *  1 - block priv messages
 *  2 - block clan invitations
 *  4 - block trade
 *  8 - ask about quick fight
 *  16 - block friends invitation
 *  32 - block mails from not friends
 *  64 - turn off mouse player move
 *  128 - animation effects off
 *  256 - inform about clan members login
 *  512 - inform about chat
 *  1024 - use first/second set
 *  2048 - auto walk through gateways
 *  4096 - item highlight
 **/
//setInterval(function(){if(hero.ml.length)console.log(hero.ml)},200)
function player() {
    var tmpWalkDest = ''; //coords of point where player triggered autowalk _g('walk') (if turned on in options)
    //var _sp = null;
    let self = this;
    this.autoWalkLock = false;
    this.updated = false;
    this.autoFightLock = false;
    this.ml = [];
    this.mts = [];
    var base = {
        'pid':getCookie('mchar_id'),
        'x':-1,
        'y':-1,
        'rx':-1,
        'ry':-1,
        'mx':-1,
        'my':-1,
        'step':0,
        'fw':32,
        'fh':48,
        'remoteDir':0,
        'isMoving':0,
        'dir': -1,
				'sendDir': -1,
        'hp':1,
        'maxhp':1,
        'ml':[],
        'clanrank':100  //temp
    };
    for(var i in base) this[i]=base[i];
    delete base;
    if(this.pid<1) this.pid=getCookie('user_id');
    this.hash=getCookie('chash');
    if(this.hash) this.hash=this.hash.substr(0,10);
    this.statsval=[];
    var roaddir=-1;
    var stab=0;
    let stasisIncomingTimeout = null;
    var $_h = $("<div id=hero tip='"+_t('my_character', null, 'map')+"'></div>").click(function(e){ //Moja postaÄ
        hero.click(e);
    });
    $('#base').append($_h);
    this.checkNPCRoadCollision = function(x,y){
        if(road.length){
            for(var i=0; i<road.length; i++){
                if(road[i].x == x && road[i].y == y){road = road.splice(i+1, road.length-i); break;}
            }
        }
    };

    this.addStep = function(step){
        this.ml.push(step);
        this.mts.push(unix_time(false, true));
    };
    this.resetSteps = function(){
        this.ml = [];
        this.mts = [];
    };
    this.sliceSteps = function(idx){
        this.ml = this.ml.slice(idx);
        this.mts = this.mts.slice(idx);
    };

		this.updateWStat= function(tab, name, defaultVal, cname){
			if(!cname) cname = name;
			if(isset(tab[name])){
				this[cname]= tab[name];
			}else{
				this[cname] = defaultVal;
			}
		}

		this.inMove = function () {
			if(this.dir == -1)
				return false;
			if(road.length > 0)
				return true;
			if(hero.isMoving < 4)
				return true;
			if(roaddir != -1)
				return true;
			if(!hero.sendDir)
				return true;
			return false;
		};

    this.setHeroInLastServerPos = () => {
        if (road.length) road=[];

        this.x = this.lastServerX;
        this.y = this.lastServerY;

        hero.centerViewOnMe();
    }

    this.createHeroImage = (icon) => {
        ImgLoader.onload(
            icon,
            null,
            function () {
                hero.fw=this.width>>2;
                hero.fh=this.height>>2;
                var lx=Math.round(hero.rx*32+16-hero.fw/2);
                var ly=Math.round(hero.ry*32+32-hero.fh);
                var wpos=Math.round(hero.rx)+Math.round(hero.ry)*256, wat=0;
                if(isset(map) && isset(map.water[wpos])) wat=map.water[wpos];
                $('#hero').css({
                    backgroundImage:'url('+$(this).attr('src')+')',
                    width:hero.fw,
                    height:hero.fh-((wat/4)>8?(wat-32):wat),
                    left:lx,
                    top:ly+((wat/4)>8?0:wat),
                    backgroundPosition:(hero.step*hero.fw)+'px '+(-hero.dir*hero.fh)+'px',
                    zIndex: getLayerOrder(hero.y, 10)
                });
                if(!__tutorials.val&&1){
                    Highlighter.startH.synchroStart('hero');
                }
                progressbar.reposition();
            },
            () => {
                log(icon, 2);
            }
        )
    }

    this.getLevel = () => {
        return this.lvl;
    };

    this.getOperationLevel = () => {
        if (!this.oplvl) {
            return 0;
        }

        return this.oplvl;
    };

    this.getNick = () => {
        return this.nick;
    };

    this.getProf = () => {
        return this.prof;
    };

    this._u=function(d, allData) {
        var ox=this.x>=0 ? this.x : null, oy=this.y>=0 ? this.y : null, ocl=this.clan;
        var oldLvl = isset(this.lvl) ? getHeroLevel() : null;
        for(var k in d) {
					if(k == "dir") continue;
					if(is_int(d[k]))
						this[k]=parseInt(d[k]);
					else
						this[k]=d[k];
				}

        if (d.hasOwnProperty('x')) this.lastServerX = d['x'];
        if (d.hasOwnProperty('y')) this.lastServerY = d['y'];

        ////#1 checking if server sends "back" command to user and finding new path for hero (if he has an active path already)
        //if(isset(d.x) && isset(d.y)){
        //    var diff = Math.sqrt(Math.pow(ox - d.x, 2) + Math.pow(oy - d.y, 2));
        //    if(diff > 2 && road.length){
        //        //this.ml = []; //MLRESET
        //        this.resetSteps();
        //        road=[];
        //        this.rx = d.x;
        //        this.ry = d.y;
        //    }
        //}//#1 end

        if (oldLvl == 1 && getHeroLevel() == 2) tutorialStart(4);
        let additionalTipInfo = '';
        additionalTipInfo += (isset(this.matchmaking_champion) && this.matchmaking_champion) ? `<b style="color:#E8BA00">${_t('champion')}</b>` : '';
        additionalTipInfo += (isset(this.wanted) && this.wanted>=90) ? '<b><span style="color:red">'+_t('my_char_wanted', null, 'map')+'</span></b>' : ''; //Poszukiwana<br />listem goÅczym
        const currentTip = `<center>${_t('my_character', null, 'map')}</center>`;
        $('#hero').attr('tip', currentTip + additionalTipInfo);

        updateDataMatchmakingChampionHero(d);
        updateDataWantedHero(d);

        if (isset(this.preview_acc) && getHeroLevel() < 20){
            var reg_noshow = getCookie('reg_noshow');
            if((reg_noshow === null || !parseInt(reg_noshow)) && _l() == 'en') $('#bm_register').show();
        }
        if(!isset(this.clan) && isset(ocl)) {
            $('.clan').fadeOut();
            g.lock.remove('clans');
        }
        if (this.clan) {
            if (newChatMode) g.chatController.getChatChannelsAvailable().setAvailable(ChatData.CHANNEL.CLAN, true);
        }
        if (getHeroLevel() >= 25){
            if (getHeroLevel() == 25) tutorialStart(16);
            $('#skillSwitch').show();
						var classname = "";
						switch(hero.cur_skill_set) {
							case 1:
								classname = "first";
							break;
							case 2:
								classname = "second";
							break;
							case 3:
								classname = "third";
							break;
							default:
								classname = "none";
							break;
						}
            $('#skillSwitch').attr('class',classname);
        }
				if(isset(d['cur_battle_set']) && isset(g.battlesets)) {
					g.battlesets.update(d['cur_battle_set']);
				}
        if(isset(d['clanrank']) && g.clan && g.clan.ranks) g.clan.myrank=g.clan.ranks[this.clan.rank].r;
        //tmp+=' srv:'+this.x+','+this.y;
        if((d.back==1)|| ((ox!=this.x || oy!=this.y) && g.lock.check() && this.ml.length>0)){
        /*this.ml=[];*/
					this.resetSteps();
					if (road.length) road=[];
				} //MLRESET
        else{
            if(this.ml.length>0) {
                var idx=-1;
                for(var k in this.ml){
                    if(this.ml[k]==this.x+','+this.y) idx=parseInt(k);
                }
                if(idx>=0){
                    //this.ml=this.ml.slice(idx+1);//MLSLICE
                    this.sliceSteps(idx+1);
                    this.x=ox;
                    this.y=oy;
                    //tmp+=' ml.slice('+(idx+1)+')';
                }else{
                    var p0=this.ml[0].split(',');
                    if((Math.abs(p0[0]-this.x)+Math.abs(p0[1]-this.y)>1)) {
                        //this.ml=[];//MLRESET
                        this.resetSteps();
                        this.rx=this.x;
                        this.ry=this.y;
                    }
                }
            }
        }
        if (ox!=this.x||oy!=this.y){
            function tmpCenter(){
                if(hero.rx>=0 && hero.rx>=0){
                    hero.centerViewOnMe();
                }else{
                    setTimeout(function(){
                        tmpCenter();
                    },50)
                }
            }
            tmpCenter();
        }
        if(isset(d['dir'])) {
            this.remoteDir = d['dir'];
            if(!this.inMove() || allData['d']) {
                this.dir = this.remoteDir;
            }
        }
        if(isset(d['img'])) {
            // console.log(this.mpath);
            // if(this.mpath.indexOf('http:')>=0) g.mpath=this.mpath+'obrazki/miasta/';
            // else
            // if(this.mpath!="") g.mpath='http://'+location.host+'/obrazki/miasta/';
            this.icon=g.opath+'postacie'+this.img;
            this.createHeroImage(this.icon);
            //var img=new Image();
            //$(img).on('load', function(){
            //    hero.fw=this.width>>2;
            //    hero.fh=this.height>>2;
            //    var lx=Math.round(hero.rx*32+16-hero.fw/2);
            //    var ly=Math.round(hero.ry*32+32-hero.fh);
            //    var wpos=Math.round(hero.rx)+Math.round(hero.ry)*256, wat=0;
            //    if(isset(map) && isset(map.water[wpos])) wat=map.water[wpos];
            //    $('#hero').css({
            //        backgroundImage:'url('+$(this).attr('src')+')',
            //        width:hero.fw,
            //        height:hero.fh-((wat/4)>8?(wat-32):wat),
            //        left:lx,
            //        top:ly+((wat/4)>8?0:wat),
            //        backgroundPosition:(hero.step*hero.fw)+'px '+(-hero.dir*hero.fh)+'px',
            //        zIndex: getLayerOrder(hero.y, 10)
            //    });
            //    if(!__tutorials.val&&1){
            //        Highlighter.startH.synchroStart('hero');
            //    }
            //    progressbar.reposition();
            //    //g.objectCallbacks.runCallbackQueue(this.id, 'imageLoad', 'hero');
            //}).on('error', function(){
            //    log($(this).attr('src'),2);
            //}).attr({
            //    src:this.icon
            //});
            $('#b_pvp').data('bp',this.pvp?'-200px 0px':'-200px -27px')
                .css('backgroundPosition',this.pvp?'-200px 0px':'-200px -27px');
        }
        if(isset(d['nick'])) {
            //var n=this.nick+' Â· '+getHeroLevel()+this.prof;

            let charaData = {
                showNick        : true,
                level           : getHeroLevel(),
                operationLevel  : hero.getOperationLevel(),
                prof            : hero.getProf(),
                nick            : hero.getNick()
            }

            let nick    = getCharacterInfo(charaData);
            let $nick   = $('#nick');


            if(nick.length > 30) {
                $nick.html(nick).css({
                    'font-size':'11px'
                });
            } else {
                $nick.html(nick);
            }

            addCharacterInfoTip($nick, charaData)
        }
        if(isset(d['bag'])) {
            g.bag=d['bag'];
            $('#bag').css({
                top:-198*g.bag
            });
            $('#hlbag').css({
                left:25+33*g.bag
            });
        }
				if(isset(d['warrior_stats'])){
					var tab = d['warrior_stats'];
					this.updateWStat(tab, 'st', 0);
					this.updateWStat(tab, 'ag', 0);
					this.updateWStat(tab, 'it', 0);
					this.updateWStat(tab, 'resfire', 0);
					this.updateWStat(tab, 'resfrost', 0);
					this.updateWStat(tab, 'reslight', 0);
					this.resis = this.resfire+'/'+this.reslight+'/'+this.resfrost;
					this.updateWStat(tab, 'act', 0);
					this.updateWStat(tab, 'hp', 0);
					this.updateWStat(tab, 'maxhp', 0);
					this.updateWStat(tab, 'sa', 0);
					this.updateWStat(tab, 'crit', 0);
					this.updateWStat(tab, 'ac', 0);
					this.updateWStat(tab, 'evade', [0, 0]);
					this.updateWStat(tab, 'lowcrit', 0);
					this.updateWStat(tab, 'heal', 0);
					this.updateWStat(tab, 'manadest', 0);
					this.updateWStat(tab, 'endest', 0);
					this.updateWStat(tab, 'acdmg', 0);
					this.updateWStat(tab, 'slow', 0);
					this.updateWStat(tab, 'mana', 0);
					this.updateWStat(tab, 'absorb', 0);
					this.updateWStat(tab, 'absorbm', 0);
					this.updateWStat(tab, 'acmdmg', 0);
					this.updateWStat(tab, 'managain', 0);
					this.updateWStat(tab, 'of_crit', 0);
					this.updateWStat(tab, 'of_critval', 0);
					this.updateWStat(tab, 'blok', 0, 'block');
					this.updateWStat(tab, 'critval', 0);
					this.updateWStat(tab, 'energy', 0);
					this.updateWStat(tab, 'lowevade', 0);
					this.updateWStat(tab, 'energygain', 0);
					this.updateWStat(tab, 'of_poison1', 0);
					this.updateWStat(tab, 'poison1', 0);
          var at = [];
          if (isset(tab.attack)) {
            const attack = tab.attack;
            for (const k in attack) {
              if (k === 'range') continue;
              const values = attack[k];
              values['average'] = Math.round((values.min + values.max) / 2);
              switch (k) {
                case 'physicalMainHand':
                  at.push(values['average']);
                  break;
                case 'physicalOffHand':
                  at.push(values['average']+'o');
                  break;
                case 'lightning':
                  at.push(values['average']+'l');
                  break;
                case 'fire':
                  at.push(values['average']+'f');
                  break;
                case 'frost':
                  at.push(values['average']+'c');
                  break;
                case 'poisonMainHand':
                  this.poison1 = values.average;
                  break;
                case 'poisonOffHand':
                  this.of_poison1 = values.average;
                  break;
                default:
                  console.log(`Error: "${k}" attack stat is not exist.`);
              }
            }
          }
					// if(isset(tab.dmg)){
					// 	at.push(tab.dmg);
					// }
					// if(isset(tab.dmgo)){
					// 	at.push(tab.dmgo+'o');
					// }
					// if(isset(tab.dmgf)){
					// 	at.push(tab.dmgf+'f');
					// }
					// if(isset(tab.dmgc)){
					// 	at.push(tab.dmgc+'c');
					// }
					// if(isset(tab.dmgl)){
					// 	at.push((tab.dmgl / 2)+'l');
					// }
					// if(isset(tab.dmgp)){
					// 	at.push(tab.dmgp+'p');
					// }
					this.dmg = at.join(",");
					this.updateWStat(tab, 'critmval', 0);
					this.updateWStat(tab, 'critmval_f', 0);
					this.updateWStat(tab, 'critmval_c', 0);
					this.updateWStat(tab, 'critmval_l', 0);
					this.critmval2 = this.critmval_f+','+this.critmval_c+','+this.critmval_l;
				}
        if(isset(d['gold'])||isset(d['ttl'])||isset(d['credits'])||isset(d['ph'])||isset(d['hp'])||isset(d['warrior_stats'])) {
            if(isset(d['credits'])) $('#premiumshop .sl_amount_ps').html(d['credits']);
            $('#base3').html('<div>'+this.st+'</div><div>'+this.ag+'</div><div>'+this.it).attr('tip',_t('base_stats', null, 'player')+'<br>'+this.bstr+'/'+this.bagi+'/'+this.bint); //Statystyki bazowe:
            $('#gold').html(round(this.gold,10)).attr('tip',_t('goldlimit', null, 'player')+'<br>'+round(this.goldlim,10)); //Limit zÅota:
            $('#ah_gl').html(round(this.goldlim,10));
            var life=parseFloat(this.hp)/parseFloat(this.maxhp);
            if (isset(d['hp'])){
                if (life <= 0.2 && this.hp > 1){
                    tutorialStart(5);
                    var amount = 0;
                    for(var i in g.item){
                        let itemStat = parseItemStat(g.item[i].stat);
                        let leczyStatExist = isset(itemStat.leczy);

                        // if(g.item[i].loc == 'g' && g.item[i].stat.indexOf('leczy')>=0) amount ++;
                        if(g.item[i].loc == 'g' && leczyStatExist) amount ++;
                        if(amount>=5) break;
                    }
                    if(amount<5 && $('#lehim_button').css('display') == 'none') $('#hieronim_button').fadeIn();
                }
            }
            $('#life2').css('width',Math.round(1+106*life)+"px");
            $('#life1').attr('tip','<B>'+_t('life_points', null, 'player')+':</B>'+round(this.hp,10)+' / '+round(this.maxhp,10));
            this.nextexp=Math.round(Math.pow(getHeroLevel(),4)+10);
            var prevexp=Math.round(Math.pow(getHeroLevel()-1,4)+10);
            if(getHeroLevel()==1)prevexp=0;
            var exp=Math.min(Math.max((this.exp-prevexp)/(this.nextexp-prevexp),0.001),1);
            $('#exp2').css('width',Math.round(1+106*exp)+"px");
            $('#exp1').attr('tip','<B>'+_t('experience', null, 'player')+':</B>'+round(this.exp, (Math.ceil(this.exp.toString().length / 3) < 2 ? 2 : Math.ceil(this.exp.toString().length / 3)))+' / '+round(this.nextexp, (Math.ceil(this.nextexp.toString().length / 3) < 2 ? 2 : Math.ceil(this.nextexp.toString().length / 3)))
            +'<br>'+_t('to %lvl% %exp%', {'%lvl%':(getHeroLevel()+1), '%exp%':round(this.nextexp-this.exp,10)}, 'player')); //+'Do '+(this.lvl+1)+' poziomu:</B>'+round(this.nextexp-this.exp,10)

            //var avga=Math.round((parseInt(this.mina)+parseInt(this.maxa))/2);
            //statsval[0]=avga+' &plusmn;'+Math.round(avga-this.mina)+'<br>~'+this.maga+'<br>'+this.sa+'<br>'+this.ac+'<BR>'+this.acm+'<br>';
            var rs=this.resis.split('/'), at=this.dmg.toString().split(',');
            this.fulldmg=[];
            for(var i in at) {
                var lc=(at[i]+'').charAt(at[i].length-1);
                this.fulldmg+='<span class="dmg'+(lc>'a'?lc:'')+' dmg-stat">+'+round(parseInt(at[i]),1)+'</span>';
            }
            if (this.of_poison1 > 0 || this.poison1 > 0) {
                this.fulldmg+='<span class="dmg-poison dmg-stat">+'+round(parseInt(this.of_poison1 + this.poison1),1)+'</span>';
            }

            this.resist='<span class=dmgf>'+rs[0]+'</span> / <span class=dmgl>'
            +rs[1]+'</span> / <span class=dmgc>'+rs[2]+'</span> / <span style="color:lime">'+this.act+'</span> %';
            this.statsval[0]=this.fulldmg+'<br>'+this.ac+'<br>'+this.sa+'<br><br>'+this.resist;
            //this.statsval[1]=this.honor+'<br>'+this.credits+'<br><span tip="'+this.pttl+'">'+Math.max(0,this.ttl)+'</span>';
          	var ttl_value = this.ttl_value;
						var staminaTip =  _t('limit_on_day', {'%val%': Math.round(ttl_value / 60)});
						this.statsval[1]=this.honor+'<br>'+this.credits+'<br><span tip="' + staminaTip + '">'+Math.max(0,this.ttl)+'</span>';
            this.statsval[1]+='<div class="stats-row"><div class="golden-text">'+_t('dragon_runes')+':</div><span>'+this.runes+'</span></div>';
            if(_l() == 'en') this.statsval[1]+='<div class="golden-text" id="ach_link" onclick="_g(\'ach\')">'+_t('ach_btn')+'</div>';
            var blRound = Math.round(20*this.block/Math.min(getHeroLevel(), 300));
            var bl=' (' + (blRound > 50 ? 50 : blRound) + '%)';
            var critTip = '';
            if (this.of_crit >= 0.01){
                critTip = _t('critical_dmg_help_txt %crit% %crit_val%', {'%crit%': this.of_crit, '%crit_val%': this.of_critval}); //'Krytyk pomocniczy: <strong>'+this.of_crit+'%</strong><br />Moc krytyka pomocniczego: <strong>x'+this.of_critval+'</strong>'
            }
            var critmval = this.critmval2.split(',');
            var critmvalTipAuxLines = '';
            var critmvalTip = '';
            var addTip = false;
            var tmpCritmval = '';
            var critSum = 0;
            for(var i in critmval){
                var mName = '';
                switch(parseInt(i)){
                    case 0:
                        mName = _t('fire', null, 'critval'); //'ognia';
                        break;
                    case 1:
                        mName = _t('cold', null, 'critval');
                        break;
                    case 2:
                        mName =_t('lightning', null, 'critval'); //'bÅyskawic';
                        break;
                }
                critmvalTipAuxLines += _t('m_crit_strenght %name% %val%', {'%name%':mName, '%val%': critmval[i]})+(i!=2?'<br />':''); //'SiÅa krytyka magii '+mName+': <strong>x'+critmval[i]+'</strong>'+(i!=2?'<br />':'');
                if (parseFloat(critmval[i]) != this.critmval){
                    addTip = true;
                }
                critSum += parseFloat(critmval[i]);
            }
            if (addTip){
                critmvalTip = critmvalTipAuxLines;
                tmpCritmval = '<span tip="'+critmvalTip+'">'+Math.round((critSum / 3) * Math.pow (10, 2)) / Math.pow (10, 2)+'*</span>';
            }else{
                tmpCritmval = this.critmval;
            }
            this.statsval[2]='<span '+(critTip != '' ? 'tip="'+critTip+'"' : '')+'>'+this.crit+'%'+(critTip != '' ? '*' : '')+'</span><br><span  '+(critTip != '' ? 'tip="'+critTip+'"' : '')+'>x'+this.critval+(critTip != '' ? '*' : '')+'</span><br>x'+tmpCritmval+'<br>'+(isset(this.evade)?this.evade[0]+' ('+this.evade[1]+'%)':0)+'<br>'+(isset(this.block)?this.block+bl:0);
            this.statsval[3]=this.heal+'<br>'+(isset(this.absorb) ? this.absorb : 0)+'<br>'+(isset(this.absorbm) ? this.absorbm : 0)+'<br>'+(isset(this.energy) ? this.energy : 0)+'<br>'+(isset(this.mana) ? this.mana : 0);
            this.statsval[4]=sound.manager.generateMenu();
            $('#stats').html('<b>'+this.statsval[stab]+'</b>');
            $('#exp2').css('backgroundImage','url(img/'+((this.ttl>0)?`exp.png?v=${_CLIENTVER}`:`noexp.png?v=${_CLIENTVER})`));
            if(this.ttl<=0 && $('#hieronim_button').css('display') == 'none' && !g.worldConfig.getPvp() && _l() == 'pl') $('#lehim_button').fadeIn();
        }
        if(isset(d['mails'])) {
            if(this.mails > 0) $('#mailnotifier').html(this.mails_all)
                .attr('tip', _t('last_mail_msg %from%', {'%from%':this.mails_last}))  //'Ostatnia wiadomoÅÄ od:<br><b>'+this.mails_last+'</b>'
                .animate({
                    top:485
                });
            else $('#mailnotifier').animate({
                top:512
            });
        }
        if (isset(d['stasis'])) {
            var stasisVal = d['stasis'];
            if (stasisVal > 0) emotion('stasis', this.id, false);
            else removeEmotionBySourceIdAndEmoType('stasis', this.id)
            this.setStasisMapOverlay(stasisVal);
        }
        if (isset(d['stasis_incoming_seconds'])) {
            var stasisIncomingVal = d['stasis_incoming_seconds'];
            if (stasisIncomingVal > 0) emotion('away', this.id, false);
            else removeEmotionBySourceIdAndEmoType('away', this.id)
            this.stasisIncomingInfo(stasisIncomingVal);
        }

        let interfaceAnimationOn = g.settingsOptions.isInterfaceAnimationOn()
        let showItemsRankOn = g.settingsOptions.isShowItemsRankOn()

        //$.fx.off=hero.opt&128;
        $.fx.off = !interfaceAnimationOn;
        if(showItemsRankOn) {
            $('.itemHighlighter').removeClass('nodisp');
        } else {
            $('.itemHighlighter').addClass('nodisp');
        }
        //g.objectCallbacks.runCallbackQueue(this.id, 'load', 'hero');
        this.updated = true;
        if(g.talk.dialogCloud == 'hero') createDialogCloud('hero');
    };

    this.setStasisMapOverlay = function(v) {
        var $stasisOverlay = $('#stasis-overlay');
        if (v) {
            $stasisOverlay.show();
            $stasisOverlay.find('.stasis-overlay__title').text(_t('stasis'));
            $stasisOverlay.find('.stasis-overlay__text').html(_t('stasis_overlay_text'));
        } else {
            $stasisOverlay.hide();
        }
    };

    this.stasisIncomingInfo = (v) => {
        let countdown = v;
        const $stasisIncomingLayer = $('#stasis-incoming-overlay');
        const $stasisIncomingText = $stasisIncomingLayer.find('.stasis-incoming-overlay__text');
        const intervalFn = () => {
            $stasisIncomingText.html(_t('stasis-incoming', { '%val%': countdown-- }));
            if (countdown === 0) {
                removeInterval();
            }
        };
        const removeInterval = () => {
            if (stasisIncomingTimeout) clearInterval(stasisIncomingTimeout);
        }

        removeInterval();

        if (v) {
            intervalFn();
            stasisIncomingTimeout = setInterval(intervalFn, 1000);
            $stasisIncomingLayer.show();
        } else {
            $stasisIncomingLayer.hide();
        }
    };

    this.updatePet=function(d){
        var del=true;for(var k in d){del=false;break;}
        if(!isset(this.pet)){
            d.own=true;
            this.pet = new Pet(d, this);
            this.pet.update(d,true);
        }
        else{
            if (del){this.pet.remove();delete this.pet;}
            else this.pet.update(d);
        }
    };
    $('#stats').click(function(e){
        var of=$('#stats').offset(), mx=e.clientX-of.left-2, my=e.clientY-of.top;
        if(my>25 || mx<0) return;
        stab=Math.min(Math.floor(mx/23),4);
        if (stab == 4) hero.statsval[4]=sound.manager.generateMenu(); //workaround for sound menu which is generated right before its called
        $('#stats').html('<b>'+hero.statsval[stab]+'</b>').css({
            backgroundPosition:'0 -'+(98*stab)+'px'
        });
    });

    this.togglePvp=function() {
        this.pvp=this.pvp?0:1;
        _g('setpvp&mode='+this.pvp);
        $('#b_pvp').data('bp',this.pvp?'-200px 0px':'-200px -27px')
            .css('backgroundPosition',this.pvp?'-200px 0px':'-200px -27px');
    };

  const checkCanCallCenterMapOnHero = () => {
    if (getEngine().startFightBlockade.checkBlockade()) {
      return true
    }

    return !getEngine().lock.check();
  }

    this.centerViewOnMe=function(){
        this.run();
        var lx=Math.round(this.rx*32+16-this.fw/2);
        var ly=Math.round(this.ry*32+32-this.fh);
        var wpos=Math.round(this.rx)+Math.round(this.ry)*256, wat=0;
        if(isset(map.water[wpos])) wat=map.water[wpos];

        if (checkCanCallCenterMapOnHero()) {
          map.center(lx, ly);
        }
    };

    this.run=function() {
        if(this.rx!=this.x || this.ry!=this.y) {
            if(Math.abs(this.rx-this.x)+Math.abs(this.ry-this.y)>3){ //teleport or something else which changes player position more that by 3 fields
                this.rx=this.x;
                this.ry=this.y;
                this.step=0;
                if(isset(this.pet)) this.pet.update();
            }else{
                if(this.rx<this.x) this.rx+=0.25;
                if(this.rx>this.x) this.rx-=0.25;
                if(this.ry<this.y) this.ry+=0.25;
                if(this.ry>this.y) this.ry-=0.25;
                this.step=this.x==this.rx&&this.y==this.ry?0:Math.floor((this.rx+this.ry)*2)%4;
            }
            //if(this.rx==this.x && this.ry == this.y) if(isset(this.pet)){console.log(this.pet.stop ? 't' : 'f'); this.pet.move(); }
            var lx=Math.round(this.rx*32+16-this.fw/2);
            var ly=Math.round(this.ry*32+32-this.fh);
            var wpos=Math.round(this.rx)+Math.round(this.ry)*256, wat=0;
            if(isset(map.water[wpos])) wat=map.water[wpos];
            $('#hero').css({
                left:lx,
                top:ly+((wat/4)>8?0:wat),
                height:this.fh-((wat/4)>8?(wat-32):wat),
                zIndex:getLayerOrder(hero.y, 10),
                width:lx+this.fw > map.x*32 ? this.fw - (lx+this.fw - map.x*32) : this.fw
            });
            let $heroChampionMatchmaking = $('#heroChampionMatchmaking');
            let $heroWanted              = $('#heroWanted');

            if ($heroWanted.length) {
                updateCharacterAuraPos(this.rx, this.ry, $heroWanted);
            }

            if ($heroChampionMatchmaking.length) {
                updateCharacterAuraPos(this.rx, this.ry, $heroChampionMatchmaking);
            }

            // if (!g.lock.check()) map.center(lx,ly);
            if (!g.lock.check()) {
              if (checkCanCallCenterMapOnHero()) {
                map.center(lx, ly);
              }
            }
            $('#botloc').text(this.x+','+this.y);
        } else if(hero.isMoving < 4) {
            hero.isMoving++;
						if(roaddir != -1 && road.length == 0) {
							this.dir = roaddir;
							hero.isMoving = 0;
							roaddir = -1;
						}
        }
				//console.log("run obrot "+this.dir+" remote "+this.remoteDir);
        $('#hero').css({
            backgroundPosition:(this.step*this.fw)+'px '+(-this.dir*this.fh)+'px'
        });
        //if((this.rx==this.x) && (this.ry==this.y) && (road.length>0)) this.go('R');
        if(_l() == 'en' && this.updated) questTrack.draw();
        if(isset(this.pet)) this.pet.move();
    };

    //this.checkAgressiveNpcs=function(){
    //    for(var i in g.agressiveNpc){
    //        if (!isset(g.npc[i]))
    //            continue;
    //        let dialog_radius = isset(g.npc[i].dialog_radius) ? g.npc[i].dialog_radius: 1;
    //        if (!g.agressiveNpc[i] && (Math.abs(g.npc[i].x-this.x) <= dialog_radius && Math.abs(g.npc[i].y-this.y) <= dialog_radius)){
    //            g.agressiveNpc[i] = true;
    //            _g('talk&id='+i);
    //        }
    //    }
    //};

    this.go=function(d) {
        if(g.lock.check()||g.menu) road=[];
        if(g.lock.check() || g.menu || hero.ml.length>9 || $('#alert').css('display')=='block') return false;
        if(hero.rx != hero.x || hero.ry!= hero.y) return false;
				hero.isMoving = 0;
        var nx=hero.x, ny=hero.y;
        switch(d) {
            case 'W':
                if(hero.dir==1) nx=hero.x-1; else hero.dir=1;
                break;
            case 'E':
                if(hero.dir==2) nx=hero.x+1; else hero.dir=2;
                break;
            case 'N':
                if(hero.dir==3) ny=hero.y-1; else hero.dir=3;
                break;
            case 'S':
                if(hero.dir==0) ny=hero.y+1; else hero.dir=0;
                break;
            case 'R':
                var l=road.length-1;
                if(nx>road[l].x) hero.dir=1;
                else
                if(nx<road[l].x) hero.dir=2;
                else
                if(ny>road[l].y) hero.dir=3;
                else
                if(ny<road[l].y) hero.dir=0;
                nx=road[l].x;
                ny=road[l].y;
                road=road.slice(0,-1);
                break;
        }
        if(d!='R' && road.length) road=[];
        var nextstep = true;
        if(hero.ml.length){
            var check = hero.ml[hero.ml.length-1].split(',');
            if((Math.abs(nx-parseInt(check[0]))+Math.abs(ny-parseInt(check[1]))) > 1){
                nextstep=false;
                //this.ml=[];////MLRESET
                hero.resetSteps();
            }
        }
        if(nx>=0 && ny>=0 && nx<map.x && ny<map.y
            && !isset(g.npccol[nx+ny*256])
            && (!map.col || map.col.charAt(nx+ny*map.x)=='0')
            && Math.abs(hero.rx-hero.x)+Math.abs(hero.ry-hero.y)<0.3
            && nextstep
        ){
            var nxy=nx+','+ny;
            //hero.checkAgressiveNpcs();
            if(hero.x!=nx || hero.y!=ny){
                //this.ml[this.ml.length]=nxy;//MLADD
                hero.addStep(nxy);
                let autoGoThroughGatewayOn = g.settingsOptions.isAutoGoThroughGatewayOn()
                var targetNpc = g.lastClickedTarget !== null ? $(g.lastClickedTarget).hasClass('npc') : false;
                //if(isset(g.gw[nx+'.'+ny]) && !(hero.opt & 2048) && !hero.autoWalkLock && !targetNpc){
                if(isset(g.gw[nx+'.'+ny]) && autoGoThroughGatewayOn && !hero.autoWalkLock && !targetNpc){
                    tmpWalkDest = nxy;
                    setTimeout(function(){hero.autowalk()}, 500);
                }else if(!isset(g.gw[nx+'.'+ny])){
                    hero.autoWalkLock = false;
                }
            }
            hero.x=nx;
            hero.y=ny;
            if(isset(hero.pet)) hero.pet.update();
            return true;
        }
        return false;
    };
    this.autowalk = function(){
        if(tmpWalkDest == (this.rx+','+this.ry)) _g('walk');
    };
    this.click=function(e) {
        var m=[];
        var items = getGroundItem();
        if (items) {
            for (var i = 0; i < items.length; i++) {
                m.push([_t('take', null, 'menu') + ' ' + items[i].name, '_g("takeitem&id=' + items[i].id + '")']); //'PodnieÅ'
            }
        }
        const renewableNpcs = getRenewableNpc();
        if (renewableNpcs) {
            for (var i = 0; i < renewableNpcs.length; i++) {
                m.push([_t('take', null, 'menu') + ' ' + renewableNpcs[i].nick, '_g("talk&id=' + renewableNpcs[i].id + '")']); //'PodnieÅ'
            }
        }
        if(isset(g.gw[this.x+'.'+this.y])) m.push([_t('go', null, 'menu'),'_g("walk")']);
        if(getHeroLevel()>19) m.push([_t('emo_mad', null, 'menu'),'_g("emo&a=angry")']);
        if(m.length) showMenu(e,m,true);
    };

		this.isBlockedSearchPath = function () {
			if(map.id>=0xCCD && map.id<=0xCD0 || map.id == 0xE82){
				return true;
			}
			return false;
		};

		this.blockedInfoSearchPath = function () {
			mAlert(_t("block_mouse_move"));
		};


    this.searchPath=function (dx,dy) {
      if(self.isBlockedSearchPath()) return self.blockedInfoSearchPath();
      var startPoint = map.nodes.getNode(hero.x, hero.y);
      var endPoint = map.nodes.getNode(dx, dy);
      if (!startPoint.hasSameGroup(endPoint)) {
        map.nodes.clearAllNodes();
        startPoint.setScore(0, map.hce8(endPoint, startPoint));
        endPoint =  map.nodeSetLoop(endPoint, startPoint, map.findStep);
      }
      map.nodes.clearAllNodes();
      startPoint.setScore(0, map.hce(startPoint, endPoint));
      map.nodeSetLoop(startPoint, endPoint, map.mapStep);
      var checkPoint = endPoint;
      road = [];
      while (checkPoint !== null && checkPoint.id != startPoint.id) {
        road.push({
          x: checkPoint.x,
          y: checkPoint.y
        });
        checkPoint = checkPoint.from;
      }
      if(checkPoint !== null) {
        road.push({x: checkPoint.x, y:checkPoint.y});
      }
      if(road.length>1 && g.playerCatcher.follow == null)
          $('#target').stop().css({
              left:road[0].x*32,
              top:road[0].y*32,
              display:'block',
              opacity:1,
              'z-index':1
          }).fadeOut(1000);
    };
    this.mClick=function(e) {
        let mouseHeroWalkOn = g.settingsOptions.isMouseHeroWalkOn();

        //if((hero.opt&64 && !g.playerCatcher.follow) || g.lock.check() || $('#alert').css('display')=='block') return;
        if((!mouseHeroWalkOn && !g.playerCatcher.follow) || g.lock.check() || $('#alert').css('display')=='block') return;
        var o=$('#ground').offset();
        var dx=(e.clientX-o.left)>>5,dy=(e.clientY-o.top)>>5;
        hero.searchPath(dx,dy);
    };
    $('#ground').click(function(e){
        if(!$(e.target).hasClass('endtalk2') && $('#bubbledialog').css('display') == 'block' && g.talk.id && isset(g.talk.bubbleEndLineCommand)){
            _g(g.talk.bubbleEndLineCommand);
            return;
        }
        //g.playerCatcher.stopFollow();
        hero.mClick(e);
    });
    //_sp = this.searchPath;
}
