/*
 * Margonem MMORPG engine ver. 2.0
 * Author: Thinker (oanemizguel AT gmail)
 */
let newChatMode = true;
let expeMode = false;


var map,hero,road=[];
// let newCommunicationMode = ['experimental', 'dev', 'local'].includes(location.hostname.split('.')[0]);
let newCommunicationMode = true;
$(document).ready(function () {
    log(navigator.userAgent);
    if (isSeptemberEnd()) $('#b_integration').css('display', 'none');
		var interfaceCookie = getCookie('interface');
		if (interfaceCookie == null) setDefaultInterfaceCookie();
		else {
        if (interfaceCookie != 'si') setDefaultInterfaceCookie();
    }
        window.cdnUrl = 'https://micc.garmory-cdn.cloud';
		CFG = {
			oimg : '/img', //annother img
      imgpath: cdnUrl + '/obrazki/',
			opath: cdnUrl + '/obrazki/postacie/', //players image path
			npath: cdnUrl + '/obrazki/npc/', //npc image path
			mpath: cdnUrl + '/obrazki/miasta/', //city image path
			ipath: cdnUrl + '/obrazki/itemy/', //items path
			ppath: cdnUrl + '/obrazki/pets', //pets path
			epath: cdnUrl + '/obrazki/interface/emo/', //emo path
			fpath: cdnUrl + '/obrazki/interface/environmentalEffects/', //environmental effects path
			bpath: cdnUrl + '/obrazki/battle/',
			sl_multipler: {
				'en': 75,
				'pl': 75
			},
			weapons :{
				'sw': _t('w_bastard', null, 'battle'),
				'1h': _t('w_onehanded', null, 'battle'),
				'2h': _t('w_twohanded', null, 'battle'),
				'bs': _t('w_bastard', null, 'battle'),
				'dis': _t('w_distance', null, 'battle'),
				'h': _t('w_helper', null, 'battle'),
				'icon-6': _t('w_wand', null, 'battle'),
				'orb': _t('w_rod', null, 'battle'),
				'sh': _t('w_shield', null, 'battle'),
				'fire': _t('w_fire', null, 'battle'),
				'light': _t('w_light', null, 'battle'),
				'frost': _t('w_frost', null, 'battle'),
				'poison': _t('w_poison', null, 'battle'),
				'phydis': _t('w_phydis', null, 'battle'),
				'wound': _t('w_wound', null, 'battle')
			},
            serverStorage: {
                version: 1.0,
                keysToRemove: []
            }
		}
		let settingsOptions = new SettingsOptions();
		let settingsStorage = new SettingsStorage();
		let requestCorrect = new RequestCorrect();
        settingsStorage.init();
        settingsOptions.init();
        requestCorrect.init();

		g={// booleans:
            refreshAfterResponse : false,
            settingsStorage: settingsStorage,
            settingsOptions: settingsOptions,
            requestCorrect: requestCorrect,
        tutorialVal:null,
        blockSendNextInit: null,
        gm:0,
        battle:0,
        dead:0,
        party:0,
        fredit:0,
        //moveitemrequest:false,
        clan:0,
        mails:0,
        ctrlKey:0,
        skills: new skills(),
        delays:{before: new Date(), now: new Date(), limit: newCommunicationMode ? 200 : 500, run:null},
        diff:{before:new Date(),t:50,s:0,c:0},
        tickSuccess: true,
        menu:false,
        menushowing:false ,
        stop:true,
        requestAnimationFrameUpdateFinished: false,
        heroIdle: true,
        idleRequestCounter: 0,
        tmpParams:[],
        engineStopped:false,
        initAjaxState: true,
        gtDelay:50,
        tutor:0,
        pvpIndicator:null,
        gamestarted: false,
        qlogVisible:false,
        emoIntervals:{},
        highlightedItems:[],//holder for item id's which were already highlighted to not highlight them anymore before refresh
        chestAnimation:false,
        chestAnimationType: 'colorized',
        ah:{
            cat:0,
            filter:['','','',0,'','',''],
            page:0,
            even:false,
            synchroItems:{}
        },
        sl_multiplier : {
            pl:75,
            en:75
        },
        lastAf:0,//last time when auto attack was used
			itemChanger: false,
        barter:false,
			itemChangerGroup: false,
			depo:{
            gold:0,
            expire:0,
            clan:false,
            vis:false,
            section:1,
            drag:false,
            size:1,
            hoverSection:null,
            sectionActivateTimeout:null,
            tmpDropMatrix:{},
            switchScroll: 0
        },
        dialog:{
            soundId:0
        },
        battlesets: new BattleSets(),
				matchmaking: new MatchManager(),
        book:false,
        addons:[],
        mExtAddons:[],
        loots:false,

        names:{
            ranks:[_t('admin', null, 'ranks'), _t('super_mg', null, 'ranks'),_t('mg', null, 'ranks'),_t('chat_mod', null, 'ranks'),_t('super_chat_mod', null, 'ranks')]
            //ranks:['Administrator','Super MG','Mistrz Gry','Moderator czatu','Super moderator']
        },
        thefifthelement:'<img src="'+cdnUrl+'/obrazki/www/buka.jpg" style="margin-left:3px">',
        checklist:[],
        zero:0,
        lock:{
            list:[],
            /* Adds element to lock list*/
            add:function(id){
                if(this.list.indexOf(id)<0) this.list.push(id);
                hero.resetSteps();
                hero.setHeroInLastServerPos();

            },
            /* Removes element from lock list */
            remove:function(id){
                if(this.list.indexOf(id)>=0) this.list.splice(this.list.indexOf(id),1);
            },
            /* Checks if lock is active */
            check:function(name){
                if(isset(name)) return this.list.indexOf(name)>=0;
                return this.list.length > 0 ? true : false;
            }
        },
        logoff: {
            start: null,
            time: null
        }
    };
    var addons=getCookie('addons');
    if(addons) g.addons=addons.split(' ');

    //adding addons from addons.margonem.pl to addons list
    var ids = extMgrCookieGet();
    if(ids !== null){
        for(var i in ids){
            var id = parseInt(i);
            var build = 'public';
            switch(ids[i]){
                case 'd':build = 'dev';break;
                case 'v':build = 'verified';break;
            }
            var path = 'https://addons2.margonem.pl/get/'+Math.floor(id/1000)+'/'+id+build+'.js';
            g.mExtAddons.push(path);
        }
    }
    //var ytm = getCookie('ytm');
    //if (ytm) {showMovie(decodeURIComponent(ytm),true);$('#bm_movie').fadeIn();}
    g.windowsData = {
      windowCloseConfig: {
        BARTER: 'BARTER',
        CRAFTING: 'CRAFTING',
        WORLD_WINDOW: 'WORLD_WINDOW',
        BATTLE: 'BATTLE',
        SHOP: 'SHOP',
        DIALOGUE: 'DIALOGUE',
        MAIL: 'MAIL',
        RELOAD: 'RELOAD',
        AUCTION: 'AUCTION',
        DEPO: 'DEPO',
        BONUS_SELECTOR: 'BONUS_SELECTOR',
        TRADE: 'TRADE',
      }
    },
    g.worldConfig = new WorldConfig();
    g.rajController = new RajController();
    g.srajStore = new SrajStore();

    g.rajController.init();
    g.srajStore.init();

    g.crossStorage = new CrossStorage();
    g.crossStorage.init();
    g.bmEditor=new bmEditor(); //creating battlemaster skill editor object
    g.playerCatcher=new PlayerCatcher();
    g.gameLoader=new GameLoader();
    g.crafting = new Crafting();
    g.windowCloseManager = new WindowCloseManager();
    g.addonswait=[];
    // g.ie6=$.browser.msie && /MSIE 6\.0/i.test(window.navigator.userAgent) && !/MSIE 7\.0/i.test(window.navigator.userAgent);
    g.mpath= CFG.mpath;
    g.opath= cdnUrl + "/obrazki/";
    g.townname=[];
    g.gw={};
    g.gwIds={};
    g.npc=[];
    //g.agressiveNpc=[];
    g.lastClickedTarget=null;
    g.objectCallbacks={
        imageLoad:{npc:{},other:{},hero:{}},
        load:{npc:{},other:{},hero:{}},
        addCallback:function(fun,callbackType,objectType,objectId){
            if (isset(this[callbackType][objectType])){
                if (!isset(this[callbackType][objectType][objectId])) this[callbackType][objectType][objectId] = [];
                this[callbackType][objectType][objectId].splice(0, 0, fun);
            }
        },
        runCallbackQueue:function(id,callbackType,objectType){
            if (isset(this[callbackType][objectType][id])){
                while(this[callbackType][objectType][id].length) this[callbackType][objectType][id].pop()(id);
                delete this[callbackType][objectType][id];
            }
        }
    };
    g.reconnect={
        interval:null,
        timeout:20,
        start:function(){
            if (this.interval) return;
            log(_t('server_connection_fail', null, 'reload'), 1); //'Brak odpowiedzi serwera, sprawdÅº poÅÄczenie internetowe. TrwajÄ automatyczne prÃ³by wznowienia poÅÄczenia'
            log(_t('auto_reload in', null, 'reload')+'<span id="reconnectInfo">20s</span>') //'PrzeÅadowanie strony za <span id="reconnectInfo">20s</span>
            if (!this.interval)
                if ($('#loading').css('display')=='block') $('#console').fadeIn();
            this.interval=setInterval(function(){
                if (g.reconnect.timeout<=0){
                    window.location.reload();
                }else{
                    _g('_');
                    g.reconnect.timeout--;
                    $('#reconnectInfo').html(g.reconnect.timeout+'s');
                }
            },1000);
        },
        stop:function(){
            if (this.interval){
                $('#reconnectInfo').html(_t('canceled', null, 'reload')).attr('id', ''); //'[anulowano]'
                clearInterval(this.interval);
                this.interval=null;
                this.timeout=20;
                $('#console').fadeOut();
            }
        }
    }
    //g.ver=new (function(){
    //    var v_html   = null;
    //    var v_engine = null;
    //    this.html=function(ver){
    //        v_html = parseInt(ver);
    //        this.compare();
    //    }
    //    this.engine=function(ver){
    //        v_engine = parseInt(ver);
    //        this.compare();
    //    }
    //    this.compare=function(){
    //        if(!isNaN(v_html) && v_engine && v_html < v_engine){
    //            if(v_engine && location.href.substr(-1*v_engine.toString().length) != v_engine.toString()){
    //                location.replace(location.href+'?'+v_engine);
    //            }
    //            $('#ver')
    //                .attr('tip', _t('client_ver_conflict_info')) //'<b>Niezgodna wersja klienta. Kliknij tutaj aby odÅwieÅ¼yÄ okno gry. <br />JeÅli komunikat sie powtarza wciÅnij CTRL+R lub odÅwieÅ¼ cache przeglÄdarki (CTRL+SHIFT+DEL - wybÃ³r odpowiedniej opcji).</b>'
    //                .addClass('alert').addClass('pointer').click(function(){
    //                    window.location.reload();
    //                });
    //            setInterval(function(){$('#ver').toggleClass('alert')}, 1000);
    //        }
    //    }
    //    this.html(__CLIENTVER);
    //})();
    g.npccol=[];
    g.other=[];
    g.tplsManager=null;
    g.npcTplManager=null;
    g.item=[];
		g.eqItems={};
    g.hItems={};
    g.bag=0;
    g.bagupd=0;
    g.sound={};
    g.bags=[[42,0],[0,0],[0,0],false,false,false,[0,0]];
    g.bagsPlaces = { //used to check if there are two or more items on the same place in bag
        doubleItemsWarning: false,
        items:{},
        highlights:{},
        check:function(pos){
            return isset(this.items[pos]) && this.items[pos] > 0 ? this.items[pos] : 0;
        },
        add:function(pos){
            if (!isset(this.items[pos])) this.items[pos] = 1;
            else this.items[pos]++;
            if (this.check(pos) > 1){
                this.addHighlight(pos);
            }
        },
        remove:function(pos){
            if (isset(this.items[pos])){
                this.items[pos]--;
                if (this.check(pos) <= 1){
                    this.removeHighlight(pos);
                }
            }
        },
        addHighlight:function(pos){
            if (!isset(this.highlights[pos])){
                this.highlights[pos] = $(document.createElement('div')).addClass('highlight').css({
                    top:(Math.floor(pos/7)*33)+'px',
                    left:(pos%7)*33+'px'
                }).prependTo('#bag');
            }
        },
        removeHighlight:function(pos){
            if (isset(this.highlights[pos])){
                this.highlights[pos].remove();
                delete this.highlights[pos];
            }
        },
        showWarning: function () {
            mAlert(_t('doubled_items'));
        },
        onItemsUpdated: function () {
            if (g.bagsPlaces.check(0) > 1) {
                if (!this.doubleItemsWarning) {
                    this.showWarning();
                    this.doubleItemsWarning = true;
                }
            } else {
                this.doubleItemsWarning = false;
            }
        }
    };
    g.freeSlots = 0;
    var bo=$('#bagc').offset();
    g.tmpSound = null;
    g.tmpSoundId = 0;
    g.drops={
        bx:bo.left,
        by:bo.top,
        bx2:bo.left+$('#bagc').width(),
        by2:bo.top+$('#bagc').height(),
        ex:530,
        ey:111,
        ex2:637,
        ey2:251,
        gx:537,
        gy:470,
        gx2:537+7*33,
        gy2:503,
        dpx:27,
        dpy:237,
        dpx2:27+33*14,
        dpy2:237+8*33
    }; //deposit
    g.init=1;
    g.sync=0; // send empty query counter
    g.ats=0; // ajax TS
    g.lag=0;
    g.lastKey=[0,0];
    g.mouseMove={ //mouse status (down/up) to be used to move player around
        active:false,
        lastCoords:null,
        enabled:true,
        runInterval:0,
        dragged:false
    };
    g.keys={
        chat:99,
        console:96,
        battleclose:90,
        minimap:109, // c,~,z,m
        lookplayer: 9,

        //invertArrows:{
        //    37:'E',
        //    38:'S',
        //    39:'W',
        //    40:'N'
        //},
        //invertWsad:{
        //    65:'E',
        //    87:'S',
        //    68:'W',
        //    83:'N'
        //},
        //normalArrows:{
        //    37:'W',
        //    38:'N',
        //    39:'E',
        //    40:'S'
        //},
        //normalWsad:{
        //    65:'W',
        //    87:'N',
        //    68:'E',
        //    83:'S'
        //},
        //arrows:{
        //    37:'W',
        //    38:'N',
        //    39:'E',
        //    40:'S'
        //},
        //wsad:{
        //    65:'W',
        //    87:'N',
        //    68:'E',
        //    83:'S'
        //}
        arrows: {},
        wsad:   {}
    };
    g.talk={
        'id':0,
        'nick':'',
        'dialogCloud':null,
        'scrollCheckInterval':null
    };
    g.tip={
        'id':'',
        'on':true
    };
    g.tips={}; // tips functions
    g.shop={
        'id':0
    };
    g.superMarketItems = {};
    g.trade={
        'id':0
    };
    g.tradeLocked=[];
    g.tmpTradeAcceptStatus=[0,0];
    g.loadQueue=[];
    g.chat={
        init:0,
        tab:0,
        write:0,
        txt:['','','',''],
        tabs: [[], [], [], []],
        lastMsg: null,
        lastnick:'',
        ts:0,
        lastwrite:'',
        lastmyts:0,
        state:getCookie('cy')?getCookie('cy'):0,
        //moveInitiated:false, //if chat move is in progress
        parsers:[]
    };
    g.aid=getCookie('user_id');
    g.lastEv = null;
    g.ev='';
    g.browser_token = 0;
    g.msg=[];

    g.away={
        ts:unix_time(true),
        update:function(){
            g.away.ts=unix_time(true)
        },
        logOut:function(){
            var sec=unix_time(true)-g.away.ts;
            if(sec>900) {
                $('#dazed').html(_t('no_activiti_logout_info')).fadeIn();
                /*
                 *'<div>ZostaÅeÅ wylogowany z powodu braku aktywnoÅci.<br><br>'
                 +'<button onclick="window.location.reload()">WejdÅº do gry</button></div>'
                 */
                stopEngine();
                log('Too long away: engine stopped.',1);
            }
        }
    };

    if(g.tutor!=null && $(window).width()>999) {
        g.tutors=[];
        if(_l() != 'pl'){
            var list = ['06', '12', '13', '16', '17', '18', '24', '28', '32', '34'];
            for(var i=0; i<list.length; i++){
                g.tutors.push('img/bnr/en/help'+list[i]+'.png');
            }
            //for(var i=0; i<46; i++) // animated
            //  if(i+1 != 35) g.tutors.push('img/en/bnr/help'+(i+1)+'.png'); //dont show help35
        }else{
            //var list = [
            //    1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12,
            //    13, 18, 19, 20, 21, 22, 23, 24, 28,
            //    32, 33, 34, 35, 36, 37, 38, 39, 40,
            //    41, 42, 43, 44, 45, 46, 47, 48, 49, 50
            //];
            var list = [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12,
                13, 18, 19, 20, 21, 22, 23, 24,
                33, 36, 37, 38, 39, 40,
                41, 42, 43, 44, 47, 49, 50
            ];

            for(var i in list){
                g.tutors.push('img/bnr/help'+list[i].toString()+'.png');
            }
        }
    } else g.tutor=0;
    map=new ground();
    hero=new player();


    getStatusOfLocalOpt();

    $(window).resize(reCenter);
    reCenter();

    $('#imgload').absCenter();

    $(document).keypress(function(e){
        g.away.update();
        if(isset(g.logkey)) log('press: '+e.which+' / '+e.keyCode+(g.ctrlKey?' ctrl':'')+(e.altKey?' alt':'')+(e.shiftKey?' shift':''));
        if(e.which==102 && g.ctrlKey) {
            g.ctrlKey=false;
            return
        } // firefox ctrl+F bug
        if(e.shiftKey || g.ctrlKey || e.altKey) return;
        if(e.keyCode==27 && g.loots) {
            cancelLoots();
            return
        }
        if((e.which==120||e.which==88)&&map.pvp>0&&unix_time(true)-g.lastAf>=1&&(e.target.tagName!='INPUT' && e.target.tagName!='TEXTAREA')){
            var members = [];
            if (g.party) {
                for (var idMember in g.party) {
                    members.push(idMember);
                }
            }
            for (var i in g.other) {
                if ((Math.abs(hero.rx - g.other[i].x) <= 1 && Math.abs(hero.ry - g.other[i].y) <= 1)){
                    if (members.indexOf(i) > -1) continue;
                    _g("fight&a=attack&auto=1&id="+i);
                    g.lastAf = unix_time(true);
                    break;
                }
            }
        }
        if(e.which==32&&(e.target.tagName!='INPUT' && e.target.tagName!='TEXTAREA')){
            if(_l() == 'en'){
                if($('#minimap').css('display') == 'block'){map.showMini(isset(map.tab)?(map.tab==1?2:1):1)}
            }else{
                if (g.menu) hideMenu();
                else $('#hero').click();
            }
        }
        if(e.which==13) { // enter
            if(e.target.id=='conin') {
                consoleParse($('#conin').val());
                $('#conin').val('');
            } else
            //if(e.target.id=='inpchat') chatSendMsg($('#inpchat').val());
            if(e.target.id=='inpchat') getEngine().chatController.getChatWindow().manageChatWindowAfterEnter();
            else
            if(e.target.id=='mytr_gold') trade_gold();
            else
            if(e.target.tagName=='TEXTAREA') return;
            else
            if(e.target.tagName=='BUTTON'){
                if(e.target.id=='a_ok') $('#a_ok').blur();
                return;
            }
            else
            if(e.target.tagName=='INPUT') return;
            else
            if (g.loots && checkLotsItemsExit() && $("#loots").css('display') == 'block'){
                sendLoots(1, false);
                return;
            } else {
                //startChatWrite();
                getEngine().chatController.getChatInputWrapper().manageMarkAfterInputFocus();
                getEngine().chatController.getChatInputWrapper().focus();
                getEngine().chatController.getChatInputWrapper().setBlockNearOnEnterUp(true);
            }
        }else
        //if(e.target.id=='inpchat') {
        //    if(e.keyCode==27) {
        //        //$('#inpchat').fadeOut('fast',function(){$('#inpchat').val('');});
        //        $('#inpchat').val('').blur();
        //        g.chat.write=false;
        //    }
        //}
        if(e.target.tagName!='TEXTAREA' && e.target.tagName!='INPUT' && e.which==109) map.toggle();
        if(e.which==g.keys.console && (e.target.tagName!='INPUT' || e.target.id=='conin')) { // tilde
            toggleConsole();
            return false;
        }
        if(e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA') return;
        // if(isset(g.keys.arrows[e.keyCode])) {
        //     hero.go(g.keys.arrows[e.keyCode]);
        //     e.preventDefault();
        // }
        // if(isset(g.keys.wsad[e.which])) {
        //     hero.go(g.keys.wsad[e.which]);
        //     e.preventDefault();
        // }
        if(e.which>96 && e.which<128 && isset(g.keys.wsad[e.which-32])) {
            hero.go(g.keys.wsad[e.which-32]);
            e.preventDefault();
        }
        //quest,qlog show/hide by pressing "q" only in en ver.
        if((e.which == 113 || e.which == 81) && _l() == 'en'){
            if(!g.qlogVisible) _g('quests');
            else{
                $('#dlgwin .closebut').click();
            }
        }
    });
    $(document).keydown(function(e){
        _mPos.event(e);
        if(!e.ctrlKey) g.ctrlKey = false; //workaround for holding ctrl when loosing window focus (ctrl keyup doesnt fire then)
        g.lastClickedTarget=null;
        g.away.update();
        //if(e.which==9 && !g.battle && !(e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA')){g.playerCatcher.next();e.preventDefault()};
        if(e.which==9 && g.battle != 0 && !(e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA')){selectNextEnemy(e.shiftKey);e.preventDefault()};
        if(e.which==g.keys.battleclose && $('#battle').css('display') == 'block' && !(e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA')) canLeave();
        if(isset(g.logkey)) log('dn:'+e.which+' / '+e.keyCode+(g.ctrlKey?' ctrl':'')+(e.altKey?' alt':'')+(e.shiftKey?' shift':''));
        var cancel=0;
        if((e.altKey) && (e.which>48) && (e.which<53)) { //(g.ctrlKey||e.altKey)
            //pushChatButton({
            //    n:(e.which-49)
            //});
            cancel=1;
        }
        if((g.ctrlKey && e.which==40) && (g.chat.tab<3)) {
            //pushChatButton({
            //    n:g.chat.tab+1
            //});
            cancel=1;
            e.preventDefault();
        }
        if((g.ctrlKey && e.which==38) && (g.chat.tab>0)) {
            //pushChatButton({
            //    n:g.chat.tab-1
            //});
            cancel=1;
            e.preventDefault();
        }
        if(e.which==27) e.preventDefault();
        if(cancel) {
            e.preventDefault();
            return;
        }
        if(e.target.tagName=='INPUT' || e.target.tagName=='TEXTAREA') return;
        if(e.which==17) g.ctrlKey=true;
        if(e.shiftKey || g.ctrlKey || e.altKey) return;
        if(e.which == 70 && !g.battle) hero.autoFightLock = true;
        if(e.which == 70 && g.battle && !(isset(g.battle.f[hero.id].fast) && g.battle.f[hero.id].fast) && !hero.autoFightLock){
            $('#autobattleButton').click();
            hero.autoFightLock = true;
        }
        if(e.which == g.keys.lookplayer){
          g.playerCatcher.next();
          e.preventDefault();
        }
        if(isset(g.keys.arrows[e.keyCode]) || isset(g.keys.wsad[e.which])) {
            //g.playerCatcher.stopFollow();
            g.lastKey=[e.keyCode,e.which];
            e.preventDefault();
        }
    });

    $(document).keyup(function(e){
        if(e.which==17) g.ctrlKey=false;
        if(e.shiftKey || g.ctrlKey || e.altKey) return;
        if(e.target.tagName!='TEXTAREA' && e.target.tagName!='INPUT' && e.which==67) {
            //toggleChat();
            getEngine().chatController.getChatWindow().chatToggle();
        }
        //if(e.target.tagName!='TEXTAREA' && e.target.tagName!='INPUT' && e.which==67)
        if(e.target.tagName!='TEXTAREA' && e.target.tagName!='INPUT' && e.which==66) toggleBattleLog();
        if(e.keyCode==g.lastKey[0] || e.which==g.lastKey[1]) g.lastKey=[0,0];
        if(e.which == 70) hero.autoFightLock = false;
    });

    // moving a player by holding down mousebutton
    $(document).mousedown(function(e){
        if ($(e.target).hasClass('quest-log-header')) return false;
        if(!e.ctrlKey) g.ctrlKey = false; //workaround for holding ctrl when loosing window focus (ctrl keyup doesnt fire then)
        g.mouseMove.lastCoords={clientX:e.clientX,clientY:e.clientY};
        // if(e.button == 0 || (isset($.browser.msie) && e.button == 1 && e.target.id == 'ground' && e.target.id == 'hero')){
        if(e.button == 0){
            g.mouseMove.active=true;
            g.mouseMove.lastCoords={clientX:e.clientX,clientY:e.clientY};
            g.mouseMove.runInterval=0;
        }
    });
    $(document).mouseup(function(e){
        // if(e.button == 0 || (isset($.browser.msie) && e.button == 1)){
        if(e.button == 0){
            g.mouseMove.active=false;
            g.mouseMove.dir=null;
        }
        g.mouseMove.dragged=false;
    });
    $(document).mousemove(function(e){
        if (g.mouseMove.active){
            if (g.mouseMove.dragged) saveLastCords(e);
            else g.mouseMove.dragged = (Math.abs(g.mouseMove.lastCoords.clientX-e.clientX) > 10 || Math.abs(g.mouseMove.lastCoords.clientY-e.clientY) > 10);
        }
        _areaRegStorage.checkAreas(e); //for unfading npc.type==4
    });
    $(window).blur(function() {
        g.mouseMove.active = false;
        g.mouseMove.dir = null;
        g.mouseMove.dragged = false;
    });
    // ajax
    $().ajaxError(function(event, request, settings){
        log('(Ajax) '+settings.url,2);
        g.ats=0;
    });
    $().ajaxStart(function() {
    }).ajaxStop(function() {
    });

    //setupChat();
	$('#cfg_options .server-opt').click(serveroptclick);
	//$('#cfg_options .local-opt').click(localoptclick);

    //$("UL.boxhover").css('opacity',0.5);
    //$("#hlbag").css('opacity',0.3);

    // $.prototype.css2=$.prototype.css;
    // $.prototype.css=function( key, value ) {
    //     if(key=='left' || key=='top' || isset(key.left) || isset(key.top)) this.trigger('position');
    //     return this.css2(key,value);
    // }

    $('#dlgwin').draggable({
        handle:'#dlgtitle'
    });
    log('System ready.');
    //var serv_name = window.location.host.replace(/\.margonem\.pl/,'');

    if (newCommunicationMode) initWebSocket();
    else {
        var __nga = isNaN(parseInt(getCookie('__nga'))) ? 0 : parseInt(getCookie('__nga'));
        if (!__nga){
            $.getJSON("/engine?t=getvar_addon&callback=?",{
                //name:serv_name
            },function(d){
                if(d!='')loadScript(d);
                startGame();
            });
        } else {
            startGame();
        }
    }
    // if (g.worldConfig.getRpg()) roleplay();

    /*onerror=function(msg,url,line){
     console.log(msg+' '+url+' '+line);
     return false;
     }*/
    if(g.addons.length || g.mExtAddons.length){
        var added = [];
        var toLoad = g.addons.concat(g.mExtAddons);
        for(var sc in toLoad){
            if(added.indexOf(toLoad[sc])>=0) continue;
            loadScript(toLoad[sc]);
            added = toLoad[sc];
        }
        delete added;
    }

    $(document).click(function(e){
        g.lastClickedTarget = e.target;
        if(isset(g)) g.away.update();
        if($(e.target).attr('tip')) Tip.hide();
        if(g.menushowing) g.menushowing=false;
        else hideMenu();
    });
    setTimeout(function(){
        if(g.gamestarted) return;
        startGame();
    },10000);
    $('#loading span').css('margin-top',$(window).height()/2+165);
    //addScrollbar('myfriends', 242, 'myfrscrollbar', false);
    //$('#fradd').click(function(){chatScrollbar('myfriends', 243, 'myfrscrollbar');});
    $('#myfrscrollbar').css({
        backgroundColor:'black'
    });
    //addScrollbar('myenemies', 499, 'myenscrollbar', false);
    //$('#enadd').click(function(){chatScrollbar('myenemies', 499, 'myenscrollbar');});
    $('#myenscrollbar').css({
        backgroundColor:'black'
    });
    //setting different images for pl/en in minimap
    $('#inmap2 img').attr('src', cdnUrl + '/obrazki/interface/minimap-si'+(_l()=='en'?'-en':'')+'.png');
    setInterval(function(){$('.npc .qm').toggleClass('ani');},200);

});

function getEngine () {
    return g;
}

function createSettingsMenus () {

    const getDataToCreateMenu = (settingsNumber, key, callback) => {

        key = key ? key : null;

        let data = getEngine().settingsOptions.getMenuData(settingsNumber, key);

        if (!data) {
            return
        }

        return {
            settingNumber 		: settingsNumber,
            settingKey 			: key,
            descriptionLang 	: getDescriptionLang(settingsNumber, key),
            value				: data.index,
            list				: data.list,
            changeCallback 		: function (index) {
                getEngine().settingsStorage.sendRequest(settingsNumber, key, index);
                if (callback) {
                    callback(index);
                }
            }
        }
    }

    const getDescriptionLang = (settingsNumber, key) => {
        let keyStr = key ? ("__key_" + key) : "";

        return _t("opt_" + settingsNumber + keyStr, null, "SettingsOptions")
    }

    const createOneMenu = (settingsNumber, key, $wrapper, callback) => {
        let menuData 		= getDataToCreateMenu(settingsNumber, key, callback);
        let $menu 			= $wrapper.find('.menu');
        let $description 	= $wrapper.find('.option-description');

        $description.html(menuData.descriptionLang);

        createSiMenu($menu, menuData.list, menuData.value, function (index) {
            menuData.changeCallback(index)
        });

        //$menu.createMenu(menuData.list, false, function (index) {
        //    menuData.changeCallback(index)
        //});

        //$menu.setOptionWithoutCallbackByValue(menuData.value);
    }

    const init = ()=> {
        let menus = [
            {
                id 			: SettingsData.KEY.KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL,
                key 		: SettingsData.VARS.OPERATION_LEVEL.MODE,
                wrapper 	: $('#opt' + SettingsData.KEY.KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL),
                callback    : function () {getEngine().refreshAfterResponse = true}
            }
        ];

        for (let k in menus) {
            createOneMenu(menus[k].id, menus[k].key, menus[k].wrapper, menus[k].callback);
        }
    }


    init();
}

function initAfterServerStorageLoaded () {
    getEngine().chatController.getChatDataUpdater().setDataFromServerStorage()
};


function afterServerStorageReloaded () {

};

function manageHeroIdle (inMove) {
    if (inMove) {
        g.heroIdle = false;
        g.idleRequestCounter = 0;
    } else {
        g.idleRequestCounter++;
        if (g.idleRequestCounter > 1) {
            g.heroIdle = true;
        }
    }
};

function saveLastCords (e) {
    g.mouseMove.lastCoords={clientX:e.clientX,clientY:e.clientY}
}

function setDefaultInterfaceCookie () {
    var ddd = new Date();
    ddd.setTime(ddd.getTime() + 3600000 * 24 * 30);
    setCookie('interface',  'si', ddd, '/', 'margonem.pl');
}
function lookForInLoadQueue(nameElement) {
	for (var k in g.loadQueue) {
		var element = g.loadQueue[k];
		if (element.fun.name == nameElement) return element.data
	}
	return null;
}

function getRenewableNpc () {
    var a = [];
    for (var k in g.npc) {
        if (g.npc[k].type == 7 && g.npc[k].x == hero.x && g.npc[k].y == hero.y) a.push(g.npc[k]);
    }
    return a.length ? a : null;
}

function getGroundItem () {
    var a = [];
    for (var k in g.item) {
        //if (g.item[k].loc == 'm' && g.item[k].x == hero.x && g.item[k].y == hero.y) return g.item[k];
        if (g.item[k].loc == 'm' && g.item[k].x == hero.x && g.item[k].y == hero.y) a.push(g.item[k]);
    }
    return a.length ? a : null;
}

function getDirFromMousePosition(e){ //sets direction of movement based on mouse position according to player
    if (
        (e.clientX > $('#base').offset().left && e.clientX < ($('#base').offset().left + $('#base').width())) &&
        (e.clientY > $('#base').offset().top && e.clientY < ($('#base').offset().top + $('#base').height()))
    ){
        var angle = Math.atan2($('#hero').offset().top + hero.fh/2 - e.clientY,$('#hero').offset().left + hero.fw/2 - e.clientX);
        var dir = '';
        if (angle > 2.25 || angle <= -2.25) dir = isCollision(hero.x+1,hero.y) ? (angle >= 0 ? 'N' : 'S') : 'E';
        else if(angle > 0.75 && angle <= 2.25) dir = isCollision(hero.x,hero.y-1) ? (angle >= 1.5 ? 'E' : 'W') : 'N';
        else if(angle > -0.75 && angle <= 0.75) dir = isCollision(hero.x-1,hero.y) ? (angle >= 0 ? 'N' : 'S') : 'W';
        else if(angle > -2.25 && angle <= -0.75) dir = isCollision(hero.x,hero.y+1) ? (angle >= -1.5 ? 'W' : 'E') : 'S';
        return dir;
    }
}
function isPermanentlyCollision(x,y){
    return map.col.charAt(x + y * map.x) == '1';
}
function isCollision(x,y){
    return map.col.charAt(x+y*map.x) == '1' || isset(g.npccol[x+256*y]);
}
function reCenter()
{
    g.maxx=$(window).width();
    g.maxy=$(window).height();
    g.top=(g.maxy-537)>>1;
    var leftMod=g.tutor;
    let chatController = getEngine().chatController
    if (chatController && chatController.getChatWindow().getChatSize()==2){
        leftMod=276;
    }
    g.left=(g.maxx-786+leftMod)>>1;
    $('#centerbox, #centerbox2').css({
        top:g.top,
        left:g.left
    });
    if (chatController && chatController.getChatWindow().getChatSize()==2){
        $('#chat').css({
            top:g.top,
            left:g.left-276
        });
    }
    if(isset(Highlighter)) Highlighter.onresize();
    __tutorials.onresize();
    $('#en_wnd').absCenter();
}

function toggleConsole()
{
    if($('#console').css('display')=='none') {
        $('#console').fadeIn(300);
        $("#contxt").scrollTop(9999999);
        $('#conin').val('').focus();
        $('#warn').hide();
        g.lock.add('console');
    } else {
        $('#conin').blur();
        $('#console').fadeOut(300);
        g.lock.remove('console');
    }
}

 $(window).on('load', function() {
     //if(g.ie6) $('img[@src$=.png]').ifixpng(); // fix IE6 png bug
     //if (newCommunicationMode) initWebSocket();
     //else                      startGame();

     //if (!newCommunicationMode) startGame();
     //startGame();
 });

var gameStartAttempts = 0; //timeout counter for addons

function startGame() {
    gameStartAttempts ++;
    console.log("Addons Wait!", g.addonswait);
    if(g.gamestarted) return;
    if(g.addonswait.join('').length!=0) {
        setTimeout(startGame,100);
        return;
    }
    if(g.addonswait.join('').length!=0){
        for(var i=0; i<g.addonswait.length; i++){
            log('Addon '+g.addonswait[i]+' not loaded', 2);
        }
        g.addonswait = [];
    }
    console.log("START!", g.addonswait);
    g.gamestarted=true;
    log('Starting the game.');
    g.gameLoader.startStep('loc');
    sendFirstInit();
	//	var ts = "&clientTs=" + unix_time(true);
	//_g('init&initlvl=1' + ts + '&mucka='+Math.random(), function(){g.gameLoader.finishStep('loc')});
   // g.diff.before = new Date();
   // g.gt=setInterval(gameThread,g.gtDelay);
    if (!newCommunicationMode) {
    (function(){(function(O000000){function OO00000(O0O0000,OOO0000,O00O000){var OO0O000='';for(var O0OO000=0;O0OO000<O00O000;O0OO000++){OO0O000+=O0O0000[OOO0000+O0OO000];}return OO0O000;}var OOOO000=0;var O000O00=function(){OOOO000++;};var OO00O00=O000000['\x73\x70\x6c\x69\x74']('');var O0O0O00=window;var OOO0O00=[null,null,null,null,null];var O00OO00=[true,true,true,true];var OO0OO00=[];var O0OOO00=[];var OOOOO00=0;function O0000O0(){while(OOOOO00<OO00O00['\x6c\x65\x6e\x67\x74\x68']){var OO000O0=OO00O00[OOOOO00]['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](0);var O0O00O0=OO00O00[OOOOO00+1]['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](0);var OOO00O0=O0O00O0&0x7f;var O00O0O0=null;if(O0O00O0&0x80){O00O0O0=0;var OO0O0O0=OO00000(OO00O00,OOOOO00+2,OOO00O0)['\x73\x70\x6c\x69\x74']('');for(var O0OO0O0 in OO0O0O0){var OOOO0O0=OO0O0O0[O0OO0O0]['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](0);if(OOOO0O0>0x0f){O00O0O0=O00O0O0<<8;}else{O00O0O0=O00O0O0<<4;}O00O0O0|=OOOO0O0;}}else{O00O0O0=OO00000(OO00O00,OOOOO00+2,OOO00O0);}OOOOO00+=OOO00O0+2;switch(OO000O0){case 0x01:OOO0O00[0]=O00O0O0;break;case 0x02:OOO0O00[0]=O0O0O00;break;case 0x03:OOO0O00[O00O0O0['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](0)%OOO0O00['\x6c\x65\x6e\x67\x74\x68']]=OOO0O00[O00O0O0['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](1)%OOO0O00['\x6c\x65\x6e\x67\x74\x68']];break;case 0x04:OOO0O00[0]=OOO0O00[0][OOO0O00[1]];break;case 0x05:OOO0O00[0]=OOO0O00[0]+OOO0O00[1];break;case 0x06:OOO0O00[0]=OOO0O00[0]-OOO0O00[1];break;case 0x07:var O000OO0=OOO0O00[0]%OOO0O00[1];OOO0O00[0]=OOO0O00[0]/OOO0O00[1];OOO0O00[1]=O000OO0;break;case 0x08:OOO0O00[0]=OOO0O00[0]*OOO0O00[1];break;case 0x09:OOOOO00=O00O0O0;break;case 0x10:if(O00OO00[3]){OOOOO00=O00O0O0;}break;case 0x11:if(!O00OO00[3]){OOOOO00=O00O0O0;}break;case 0x12:OOO0O00[1]=OOO0O00[0]();break;case 0x13:OO0OO00['\x70\x75\x73\x68'](OOO0O00[0]);break;case 0x14:OOO0O00[0]=OO0OO00['\x70\x6f\x70']();break;case 0x15:OOO0O00[0]=OOO0O00[0]^OOO0O00[1];break;case 0x16:O00OO00[0]=OOO0O00[0]>OOO0O00[1];O00OO00[1]=OOO0O00[0]<OOO0O00[1];O00OO00[2]=OOO0O00[0]===OOO0O00[1];O00OO00[3]=OOO0O00[0]===0;break;case 0x17:var OO00OO0=[];var O0O0OO0=OO0OO00['\x70\x6f\x70']();var OOO0OO0=OO0OO00['\x70\x6f\x70']();var O00OOO0=OO0OO00['\x6c\x65\x6e\x67\x74\x68'];for(;OOO0OO0>0;OOO0OO0--){OO00OO0['\x70\x75\x73\x68'](OO0OO00[O00OOO0-O0O0OO0-OOO0OO0]);}OOO0O00[1]=OOO0O00[0]['\x61\x70\x70\x6c\x79'](OOO0O00[1],OO00OO0);break;case 0x18:OOO0O00[0]=null;break;case 0x19:OOO0O00[0]=OO0OO00[O00O0O0];break;case 0x20:(function(){var OO0OOO0=OOO0O00[1];var O0OOOO0=OOO0O00[0];var OOOOOO0=function(){var O00000O=[];for(var OO0000O=0;OO0000O<arguments['\x6c\x65\x6e\x67\x74\x68'];OO0000O++){O00000O['\x70\x75\x73\x68'](arguments[OO0000O]);}var O0O000O=OOOOO00;OO0OO00['\x70\x75\x73\x68'](O0O000O);OO0OO00['\x70\x75\x73\x68'](O00000O);OOOOO00=OO0OOO0;if(O0O000O>=OO00O00['\x6c\x65\x6e\x67\x74\x68']){O0000O0();}};OOO0O00[0]=function(){OOOOOO0['\x61\x70\x70\x6c\x79'](this,arguments);};if(typeof O0OOOO0!='\x66\x75\x6e\x63\x74\x69\x6f\x6e'){O0OOOO0=O000O00;}OOO0O00[0]['\x74\x6f\x53\x74\x72\x69\x6e\x67']=function(){return O0OOOO0['\x74\x6f\x53\x74\x72\x69\x6e\x67']();};}());break;case 0x21:OOOOO00=OO00O00['\x6c\x65\x6e\x67\x74\x68'];break;case 0x22:OOO0O00[0][OOO0O00[1]]=OOO0O00[2];break;case 0x23:OOO0O00[0]=OO0OO00['\x6c\x65\x6e\x67\x74\x68'];break;case 0x24:OOO0O00[0]=OO0OO00[OOO0O00[1]];break;case 0x25:OO0OO00[OOO0O00[0]]=OOO0O00[1];break;case 0x26:OOO0O00[0]=typeof OOO0O00[0];break;case 0x27:OOO0O00[0]=new OOO0O00[0]();break;case 0x28:var O0OO0O0=2*2+2;break;case 0x29:OOO0O00[0]=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](OOO0O00[0]);break;case 0x0a:if(O00OO00[2]){OOOOO00=O00O0O0;}break;case 0x0b:if(!O00OO00[2]){OOOOO00=O00O0O0;}break;case 0x0c:if(O00OO00[0]){OOOOO00=O00O0O0;}break;case 0x0d:if(O00OO00[0]||O00OO00[2]){OOOOO00=O00O0O0;}break;case 0x0e:if(O00OO00[1]){OOOOO00=O00O0O0;}break;case 0x0f:if(O00OO00[1]||O00OO00[2]){OOOOO00=O00O0O0;}break;case 0x1a:OOO0O00[0]=[];break;case 0x1b:OOOOO00=OOO0O00[0];break;case 0x1c:OO00O00[OOO0O00[0]]=OOO0O00[1];break;case 0x1f:OOO0O00[0]=OOOOO00;break;case 0x2a:OOO0O00[0]=OOO0O00[0]['\x73\x70\x6c\x69\x74']('');for(var O0OO0O0 in OOO0O00[0]){OOO0O00[0][O0OO0O0]=O0O0O00['\x53\x74\x72\x69\x6e\x67']['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](OOO0O00[0][O0OO0O0]['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](0)^0x67);}OOO0O00[0]=OOO0O00[0]['\x6a\x6f\x69\x6e']('');break;case 0x2b:OOO0O00[0]=OO0OO00[OO0OO00['\x6c\x65\x6e\x67\x74\x68']-O00O0O0];break;}}}O0000O0();}('\x01\x81\x09\x13\x00\x09\x82\x3c\x06\x03\x02\x00\x03\x13\x00\x1a\x00\x13\x00\x01\x82\x4f\x06\x13\x00\x01\x82\xb7\x07\x13\x00\x01\x82\x60\x0a\x03\x02\x01\x00\x19\x81\x00\x20\x00\x03\x02\x03\x00\x09\x81\x4c\x01\x81\x06\x13\x00\x01\x81\x41\x13\x00\x09\x82\x40\x0a\x01\x81\x4a\x13\x00\x09\x82\x44\x0e\x21\x00\x03\x02\x00\x03\x13\x00\x01\x02\x38\x00\x2a\x00\x03\x02\x01\x00\x02\x00\x04\x00\x03\x02\x01\x00\x14\x00\x03\x02\x03\x00\x03\x02\x00\x01\x13\x00\x01\x82\x30\x03\x03\x02\x01\x00\x19\x81\x04\x20\x00\x03\x02\x02\x00\x01\x02\x38\x00\x2a\x00\x03\x02\x01\x00\x02\x00\x22\x00\x09\x81\xa1\x14\x00\x01\x81\x9d\x13\x00\x09\x82\x2a\x04\x14\x00\x1b\x00\x01\x0c\x05\x02\x01\x08\x15\x02\x12\x09\x0b\x08\x06\x03\x2a\x00\x13\x00\x01\x81\x92\x03\x02\x01\x00\x20\x00\x13\x00\x01\x81\x02\x13\x00\x01\x81\x00\x13\x00\x01\x10\x06\x03\x03\x22\x11\x02\x09\x13\x2b\x0e\x14\x13\x02\x09\x02\x15\x2a\x00\x03\x02\x01\x00\x02\x00\x03\x02\x02\x00\x04\x00\x03\x02\x01\x02\x17\x00\x14\x00\x14\x00\x09\x81\x33\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x03\x02\x00\x04\x13\x00\x01\x81\x07\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x02\x00\x01\x01\x4f\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x02\x1c\x00\x03\x02\x01\x00\x01\x81\x01\x05\x00\x13\x00\x03\x02\x02\x00\x01\x81\x07\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x01\x02\x06\x00\x03\x02\x02\x00\x01\x81\x01\x03\x02\x01\x00\x03\x02\x00\x02\x06\x00\x03\x02\x02\x00\x29\x00\x03\x02\x01\x00\x14\x00\x1c\x00\x03\x02\x01\x00\x03\x02\x04\x00\x01\x81\x01\x05\x00\x03\x02\x02\x00\x01\x81\x06\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x01\x02\x06\x00\x03\x02\x02\x00\x03\x02\x00\x02\x16\x00\x10\x82\x1d\x0b\x01\x81\x01\x03\x02\x01\x00\x03\x02\x00\x02\x06\x00\x03\x02\x02\x00\x03\x02\x00\x04\x05\x00\x03\x02\x04\x00\x03\x02\x00\x02\x29\x00\x03\x02\x01\x00\x03\x02\x00\x04\x1c\x00\x09\x82\x1a\x02\x14\x00\x03\x02\x04\x00\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00\x09\x82\x31\x0f\x09\x82\x20\x07\x09\x82\x27\x0d\x09\x82\x31\x0f\x01\x82\x1f\x0b\x13\x00\x01\x82\x1f\x0f\x13\x00\x01\x82\x21\x0c\x13\x00\x09\x81\xf5\x14\x00\x14\x00\x01\x03\x0f\x14\x54\x2a\x00\x03\x02\x03\x00\x13\x00\x01\x82\x23\x07\x13\x00\x09\x82\xa7\x0e\x14\x00\x01\x81\x05\x25\x00\x01\x1d\x30\x02\x03\x4b\x47\x54\x56\x47\x23\x02\x04\x47\x56\x5e\x51\x5e\x47\x55\x54\x5d\x52\x5e\x5d\x52\x5e\x47\x20\x2a\x33\x2a\x00\x13\x00\x13\x00\x03\x02\x00\x03\x13\x00\x01\x82\x27\x03\x13\x00\x09\x82\x8d\x06\x14\x00\x14\x00\x14\x00\x09\x82\x31\x0f\x01\x82\x1f\x0f\x13\x00\x01\x82\x20\x03\x13\x00\x01\x82\x29\x02\x13\x00\x09\x81\xf5\x14\x00\x14\x00\x01\x82\x2a\x00\x13\x00\x09\x82\x2a\x04\x09\x82\x31\x0f\x03\x02\x00\x01\x13\x00\x03\x02\x00\x04\x13\x00\x01\x82\x2b\x0a\x13\x00\x09\x82\x7d\x0f\x03\x02\x00\x04\x13\x00\x19\x81\x05\x13\x00\x03\x02\x04\x00\x01\x81\x06\x03\x02\x01\x00\x03\x02\x00\x04\x16\x00\x0a\x82\x2e\x0f\x01\x03\x0f\x14\x54\x2a\x00\x13\x00\x01\x82\x2e\x0d\x13\x00\x09\x82\x8d\x06\x14\x00\x14\x00\x14\x00\x14\x00\x03\x02\x04\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x03\x02\x00\x04\x13\x00\x09\x82\x1f\x07\x01\x81\x05\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x03\x00\x01\x06\x0b\x02\x09\x00\x13\x0f\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x03\x04\x00\x03\x02\x02\x00\x01\x81\x00\x03\x02\x01\x00\x03\x02\x00\x02\x16\x00\x0a\x82\x37\x02\x03\x02\x00\x03\x04\x00\x13\x00\x01\x81\x01\x05\x00\x03\x02\x01\x00\x09\x82\x35\x03\x03\x02\x00\x02\x13\x00\x01\x81\x00\x13\x00\x02\x00\x03\x02\x01\x00\x19\x81\x04\x17\x00\x01\x81\x00\x03\x02\x01\x00\x03\x02\x00\x02\x16\x00\x0a\x82\x3a\x08\x14\x00\x01\x81\x01\x05\x00\x03\x02\x01\x00\x09\x82\x38\x0f\x14\x00\x03\x02\x04\x00\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x01\x04\x0f\x02\x15\x08\x2a\x00\x03\x02\x01\x00\x02\x00\x04\x00\x03\x02\x02\x00\x01\x02\x00\x08\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x02\x04\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x01\x04\x0f\x02\x15\x08\x2a\x00\x03\x02\x01\x00\x02\x00\x04\x00\x03\x02\x02\x00\x01\x02\x00\x08\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x02\x03\x02\x02\x03\x22\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x01\x05\x04\x0b\x0e\x04\x0c\x2a\x00\x13\x00\x01\x82\x4c\x05\x03\x02\x01\x00\x20\x00\x03\x02\x02\x00\x13\x00\x01\x81\x02\x13\x00\x01\x81\x00\x13\x00\x01\x10\x06\x03\x03\x22\x11\x02\x09\x13\x2b\x0e\x14\x13\x02\x09\x02\x15\x2a\x00\x03\x02\x01\x00\x02\x00\x03\x02\x03\x00\x04\x00\x03\x02\x01\x03\x17\x00\x14\x00\x14\x00\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x01\x82\x4d\x0b\x13\x00\x09\x82\x7b\x0b\x03\x02\x01\x02\x01\x81\x01\x25\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x03\x02\x00\x04\x13\x00\x01\x82\x51\x08\x13\x00\x09\x82\x7b\x0b\x03\x02\x03\x02\x01\x06\x0b\x02\x09\x00\x13\x0f\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x03\x04\x00\x13\x00\x19\x81\x01\x03\x02\x04\x00\x01\x06\x0b\x02\x09\x00\x13\x0f\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x04\x04\x00\x13\x00\x01\x81\x00\x13\x00\x01\x81\x00\x03\x02\x02\x00\x2b\x81\x03\x03\x02\x01\x02\x16\x00\x0f\x82\x5e\x04\x03\x02\x00\x03\x03\x02\x01\x02\x04\x00\x13\x00\x2b\x81\x02\x03\x02\x01\x00\x03\x02\x00\x04\x04\x00\x13\x00\x01\x82\x58\x0d\x13\x00\x09\x82\x6c\x0d\x14\x00\x14\x00\x0a\x82\x5c\x06\x03\x02\x00\x02\x16\x00\x11\x82\x5b\x08\x2b\x81\x01\x03\x02\x01\x00\x01\x81\x01\x05\x00\x03\x02\x01\x00\x2b\x81\x02\x16\x00\x0c\x82\x5d\x03\x01\x82\x5c\x02\x13\x00\x09\x82\xb7\x07\x09\x82\x5e\x04\x03\x02\x01\x02\x01\x81\x01\x05\x00\x03\x02\x02\x00\x01\x81\x01\x03\x02\x01\x00\x14\x00\x05\x00\x13\x00\x09\x82\x55\x0b\x14\x00\x14\x00\x14\x00\x14\x00\x03\x02\x04\x00\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x03\x02\x00\x04\x13\x00\x19\x81\x02\x16\x00\x10\x82\x63\x06\x01\x82\x63\x06\x13\x00\x19\x81\x02\x1b\x00\x01\x81\x05\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x03\x00\x01\x06\x0b\x02\x09\x00\x13\x0f\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x03\x04\x00\x03\x02\x02\x00\x01\x81\x00\x03\x02\x01\x00\x03\x02\x00\x02\x16\x00\x0a\x82\x68\x09\x03\x02\x00\x03\x04\x00\x13\x00\x01\x81\x01\x05\x00\x03\x02\x01\x00\x09\x82\x66\x0a\x03\x02\x00\x02\x13\x00\x01\x04\x0f\x02\x15\x08\x2a\x00\x03\x02\x01\x00\x02\x00\x04\x00\x03\x02\x01\x00\x01\x81\x00\x13\x00\x19\x81\x00\x17\x00\x14\x00\x14\x00\x03\x02\x04\x00\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x03\x02\x00\x04\x13\x00\x01\x81\x06\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x02\x00\x01\x81\x07\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x03\x00\x01\x06\x08\x05\x0d\x02\x04\x13\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x03\x26\x00\x16\x00\x0b\x82\x79\x0f\x03\x02\x00\x02\x26\x00\x16\x00\x0b\x82\x79\x0f\x01\x06\x0b\x02\x09\x00\x13\x0f\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x03\x04\x00\x03\x02\x04\x00\x03\x02\x00\x02\x04\x00\x03\x02\x01\x04\x16\x00\x0b\x82\x79\x0f\x01\x01\x1f\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x03\x04\x00\x03\x02\x04\x00\x03\x02\x00\x02\x04\x00\x03\x02\x01\x04\x16\x00\x0b\x82\x79\x0f\x01\x01\x1e\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x03\x04\x00\x03\x02\x04\x00\x03\x02\x00\x02\x04\x00\x03\x02\x01\x04\x16\x00\x14\x00\x03\x02\x04\x00\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x01\x04\x15\x08\x06\x03\x2a\x00\x03\x02\x01\x00\x02\x00\x04\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x01\x04\x23\x06\x13\x02\x2a\x00\x03\x02\x01\x00\x02\x00\x04\x00\x27\x00\x03\x02\x02\x00\x01\x07\x00\x02\x13\x33\x0e\x0a\x02\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x02\x04\x00\x03\x02\x03\x00\x01\x81\x00\x13\x00\x13\x00\x03\x02\x00\x03\x03\x02\x01\x02\x17\x00\x03\x02\x03\x01\x01\x81\x04\x03\x02\x01\x00\x01\x82\x16\x0d\x08\x00\x03\x02\x01\x00\x01\x81\x18\x08\x00\x03\x02\x01\x00\x01\x81\x3c\x08\x00\x03\x02\x01\x00\x01\x81\x3c\x08\x00\x03\x02\x01\x00\x01\x82\x3e\x08\x08\x00\x03\x02\x01\x03\x05\x00\x13\x00\x01\x81\x01\x13\x00\x01\x81\x00\x13\x00\x01\x07\x14\x02\x13\x33\x0e\x0a\x02\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x02\x04\x00\x03\x02\x01\x02\x17\x00\x14\x00\x01\x81\x00\x13\x00\x13\x00\x01\x0b\x13\x08\x32\x33\x24\x34\x13\x15\x0e\x09\x00\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x02\x04\x00\x03\x02\x01\x02\x17\x00\x03\x02\x04\x01\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x01\x81\x07\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x03\x00\x01\x08\x5c\x47\x17\x06\x13\x0f\x5a\x48\x2a\x00\x03\x02\x01\x00\x01\x14\x5c\x47\x03\x08\x0a\x06\x0e\x09\x5a\x0a\x06\x15\x00\x08\x09\x02\x0a\x49\x17\x0b\x2a\x00\x05\x00\x03\x02\x02\x00\x03\x02\x01\x03\x01\x0a\x5c\x47\x02\x1f\x17\x0e\x15\x02\x14\x5a\x2a\x00\x05\x00\x03\x02\x01\x02\x05\x00\x03\x02\x02\x00\x01\x81\x06\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x01\x02\x05\x00\x03\x02\x01\x00\x01\x01\x5a\x2a\x00\x05\x00\x03\x02\x02\x00\x01\x81\x05\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x01\x02\x05\x00\x03\x02\x03\x00\x01\x08\x03\x08\x04\x12\x0a\x02\x09\x13\x2a\x00\x03\x02\x01\x00\x02\x00\x04\x00\x03\x02\x02\x00\x01\x06\x04\x08\x08\x0c\x0e\x02\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x02\x03\x02\x02\x03\x22\x00\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x03\x02\x00\x04\x13\x00\x01\x81\x0c\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x04\x00\x01\x81\x06\x03\x02\x01\x00\x23\x00\x06\x00\x03\x02\x01\x00\x24\x00\x03\x02\x03\x00\x01\x01\x5a\x2a\x00\x13\x00\x01\x81\x01\x13\x00\x01\x81\x00\x13\x00\x01\x05\x14\x17\x0b\x0e\x13\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x03\x04\x00\x03\x02\x01\x03\x17\x00\x14\x00\x03\x02\x03\x01\x01\x81\x00\x03\x02\x01\x00\x03\x02\x00\x03\x04\x00\x03\x02\x01\x04\x16\x00\x01\x81\x01\x03\x02\x01\x00\x03\x02\x00\x03\x04\x00\x03\x02\x01\x00\x14\x00\x03\x02\x04\x00\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x03\x02\x00\x04\x13\x00\x01\x08\x03\x08\x04\x12\x0a\x02\x09\x13\x2a\x00\x03\x02\x01\x00\x02\x00\x04\x00\x03\x02\x02\x00\x01\x06\x04\x08\x08\x0c\x0e\x02\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x02\x04\x00\x03\x02\x02\x00\x01\x05\x14\x17\x0b\x0e\x13\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x02\x04\x00\x03\x02\x03\x00\x01\x02\x5c\x47\x2a\x00\x13\x00\x01\x81\x01\x13\x00\x01\x81\x00\x13\x00\x03\x02\x00\x03\x03\x02\x01\x02\x17\x00\x14\x00\x03\x02\x02\x01\x01\x81\x00\x03\x02\x03\x00\x01\x06\x0b\x02\x09\x00\x13\x0f\x2a\x00\x03\x02\x01\x00\x03\x02\x00\x02\x04\x00\x03\x02\x04\x00\x03\x02\x00\x03\x03\x02\x01\x04\x16\x00\x0d\x82\xb5\x09\x03\x02\x01\x00\x03\x02\x00\x02\x04\x00\x13\x00\x01\x82\xb4\x02\x13\x00\x09\x82\x9d\x00\x14\x00\x0a\x82\xb5\x0f\x01\x81\x01\x03\x02\x01\x03\x05\x00\x03\x02\x03\x00\x09\x82\xb1\x0e\x18\x00\x03\x02\x01\x00\x14\x00\x03\x02\x04\x00\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x14\x00\x1b\x00\x03\x02\x00\x01\x13\x00\x03\x02\x00\x02\x13\x00\x03\x02\x00\x03\x13\x00\x03\x02\x00\x04\x13\x00\x01\x82\x1f\x07\x13\x00\x01\x82\x1f\x0b\x13\x00\x01\x82\xba\x04\x13\x00\x09\x81\xf5\x14\x00\x14\x00\x01\x82\x60\x06\x03\x02\x01\x00\x01\x81\x02\x25\x00\x14\x00\x03\x02\x04\x00\x14\x00\x03\x02\x03\x00\x14\x00\x03\x02\x02\x00\x14\x00\x03\x02\x01\x00\x14\x00\x1b\x00'));}());
    }
}

function sendFirstInit (captchaAnswer) {
    var ts = "&clientTs=" + unix_time(true);
    let captchaRequest = '';
    let serverStorage = '&configGet=1';
    if (captchaAnswer) captchaRequest = captchaAnswer;
    setBlockSendNextInit(false);
    _g('init&initlvl=1' + ts + captchaRequest + serverStorage + '&mucka='+Math.random(), function(){g.gameLoader.finishStep('loc')});
    if (newCommunicationMode) {
        window.setLastRequest();
    }
    g.diff.before = new Date();
    g.gt=setInterval(gameThread,g.gtDelay);
    //emotion('VisualEffects|VisualEffects2', false, false);
}

function loadScript(scname) {
    g.addonswait.push(scname);
    $.ajax({
        type: "GET",
        url: scname,
        success: function(){
            log('Addon '+scname+' loaded successfully.');
            for(var k in g.addonswait){
                if(g.addonswait[k]==scname){
                    g.addonswait.splice(k,1);
                    break;
                }
            }
        },
        error: function (){
            console.log('error')
            log('Addon '+scname+' loaded fail.');
            for(var k in g.addonswait){
                if(g.addonswait[k]==scname){
                    g.addonswait.splice(k,1);
                    break;
                }
            }
        },
        dataType: "script",
        cache: true
    });
}

var __f = true;
function getWebdriver () {
    return navigator.webdriver;
}

let webdriverAlert = false

function gameThread()
{
    if (getWebdriver()) {
        if (!webdriverAlert) {
            mAlert(_t('forbidden_webdriver'));
            webdriverAlert =true;
        }
        return
    }
    g.requestAnimationFrameUpdateFinished = false;
    if(g.init<4 || !map.loaded || !g.ev) return;
    else if(g.init<5) {
        g.init++;

        $('#loading').fadeOut(1000);
        log('Game started.');
        if (!isset(g.talk.insideDialogSynchroId) && !g.talk.id){g.lock.remove('npcdialog');}
        sound.manager.synchroStart('game');
        //if(CB_Cookie.flash_cookie_ready == undefined) window.location="http://www.margonem.pl";
        return;
    }
    for(var k in g.loadQueue) {
        if(typeof(g.loadQueue[k]) != 'object') continue; //IE8 FIX
        g.loadQueue[k].fun(g.loadQueue[k].data);
        delete g.loadQueue[k];
    }
    //if (g.mouseMove.active == 1 && !(hero.opt&64 || g.lock.check() || $('#alert').css('display')=='block')){

    let mouseHeroWalkOn = g.settingsOptions.isMouseHeroWalkOn();

    if (g.mouseMove.active == 1 && !(!mouseHeroWalkOn || g.lock.check() || $('#alert').css('display')=='block')){
        if (g.mouseMove.enabled && g.mouseMove.dragged){
            if (g.mouseMove.runInterval == 0 && !hero.isBlockedSearchPath()) {
                hero.go(getDirFromMousePosition(g.mouseMove.lastCoords));
            }
            g.mouseMove.mouseInterval = g.mouseMove.mouseInterval==4?0:g.mouseMove.mouseInterval+1;
        }
    }else{
        if(isset(g.keys.arrows[g.lastKey[0]])) hero.go(g.keys.arrows[g.lastKey[0]]);
        if(isset(g.keys.wsad[g.lastKey[1]])) hero.go(g.keys.wsad[g.lastKey[1]]);
    }
    if((hero.rx==hero.x) && (hero.ry==hero.y) && (road.length>0)) hero.go('R');
    var tt = new Date();
    hero.run();
    for(var k in g.other)
        runOther(k);
    g.sync++;
    g.delays.now = new Date();
    //setup g.delays.limit to choose frequency (in ms) of game thread ajax calls
    g.diff.c++;
    g.diff.s+= (g.delays.now.getTime() - g.diff.before.getTime());
    if (g.diff.c>=(__f?20:100)){
        __f=false;
        g.diff.t = Math.floor(g.diff.s/g.diff.c);
        g.diff.c=0;
        g.diff.s=0;
    }
    if(g.delays.now.getTime() - g.delays.before.getTime() >= g.delays.limit) {
        //if(g.loots && checkLotsItemsExit() > 0) sendLoots(0);
        //else if (g.initAjaxState || g.init >= 4) _g('_');

        if (g.initAjaxState || g.init >= 4) {
            if (newCommunicationMode) {

                if (checkCanSendTaskFromTaskQueue()) sendTaskFromQueue();
                else {


                    let data = getEngine().serverStorage.getPackageToSendToServerStorage();

                    if (data) {
                        getEngine().serverStorage.createOldDataAndResetNewData();
                        getEngine().serverStorage.sendDataToServerStorage(data);
                    }
                    else            _g('_');

                }

            }
            else _g('_');

        }

    }
    if($('#inpchat').val()=='/r' && g.chat.lastnick!='') $('#inpchat').val('@'+g.chat.lastnick.split(' ').join('_')+' ');
    fadeMsg();
		for(var t in callOnUpdateGame) {
			callOnUpdateGame[t]();
		}
    g.away.logOut();
    g.diff.before = new Date();
    //adventCallendar.isDecember();
//$().trigger('gameThread');
    g.requestAnimationFrameUpdateFinished = true;
}
var callOnUpdateGame = {};
function checkLotsItemsExit() {
	return g.loots.want.length > 0  || g.loots.not.length > 0 || g.loots.must.length > 0;
};

function addToUpdateEveryGameUpdate(func, kind) {
	if (callOnUpdateGame[kind]) return;

    callOnUpdateGame[kind] = func;
}

function clearUpdateEveryGameUpdate() {
	callOnUpdateGame = {};
}

function removeFromUpdateEveryGameUpdate(kind) {
    if (!callOnUpdateGame[kind]) return;

    delete callOnUpdateGame[kind];
    //var idx = callOnUpdateGame.indexOf(func);
	//if(idx != -1) {
	//	callOnUpdateGame.splice(idx, 1);
	//}
}
function __g(url){
    _g(url, function(m){
        console.warn('Debug call -> _g(\''+url+'\')');
        console.log(m);
    });
}
function _g(url,callback) {
    //console.log(url)
    //console.trace();
    //workaround for one tutorial step in starting building
    if (g.init>4 && url == 'walk' && !(__tutorials.val&2) && __tutorials.val !== null){
        _g('tutorial&opt='+(__tutorials.val|2), function(){_g('___walk')});return;
    }
    url = url=='___walk'?'walk':url;
    g.sync=0;
    g.delays.before = new Date();
    if(url=='_' && g.ats) return;
    if(hero.ml.length){
        url+='&ml='+hero.ml.join(';');
        url+='&mts='+hero.mts.join(';');
        //console.log(hero.ml)
        //console.log(hero.mts)
    } else if(g.init > 4 && hero.remoteDir != hero.dir) {
      url += "&pdir="+hero.dir;
			hero.sendDir = true;
    }
    //if(_mPos.queue) /*url+='&myszka='+*/ _mPos.getQueue();
/*    if(g.init>4 && hero.cdir != '') {
        url+='&pdir=1';//+hero.cdir;
        hero.cdir = '';
    }*/
    if(g.ev) {
      url+='&ev='+g.ev;
      g.ev += 0.01;
    }
    if(g.browser_token) {
      url+="&browser_token="+g.browser_token;
    }
    if(g.bagupd!=g.bag) {
        g.bagupd=g.bag;
        url+='&bag='+g.bag;
    }
    g.ats=ts();
    var data = {};
    if(arguments.length>1) data=typeof(arguments[1]) == 'object' ? arguments[1] : {};
    g.initAjaxState = false;
    var xhr = $.ajax({
        //url:'/engine?t='+url+'&aid='+g.aid,
        url:'/engine?t='+url,
        type:'post',
        contentType: "application/json; charset=UTF-8",
        data: data ? JSON.stringify(data) : null,
        success:function(d, ts, xhr){
            var ret = false;
            if (!g.engineStopped) ret = parseInput(d, callback, xhr);
            g.initAjaxState = ret;
            //g.moveitemrequest = false;
        },
        error:function(d){
            if (g.lock.check('item_block_move')) g.lock.remove('item_block_move');
            if (parseInt(d.status) == 504) {
                log(_t('Request rejected'), 1);
                g.initAjaxState = true;
                g.ats=0;
                return;
            }
            if (parseInt(d.status) != 200) log(d.status+' - '+d.statusText, 2);
        }
    });
    //xhr._moveitem = url.match(/moveitem/);
}

/** Parse json input data*/

let worldTime = null;

function setWorldTime (_worldTime) {
    worldTime = _worldTime;
}

function getWorldTime () {
    return worldTime;
}

function parseInput(d, callback, xhr){
    if(d == '') window.location.reload();
    if(getEngine().refreshAfterResponse) {
        window.location.reload();
        return;
    }

    if(!isset(d) || !d) {
        g.reconnect.start();
        return true;
    }

    if(isset(d['settings'])) {
        getEngine().settingsStorage.updateData(d['settings']);
    }

    if(isset(d['world_time'])) setWorldTime(d['world_time']);
    //////////////// tasks
    //if(isset(d.clientver)){
    //    callOnUpdateGame = []; //call after init&initlvl=1
    //    g.ver.engine(d.clientver);
    //}
    if(isset(d['config'])) getEngine().serverStorage.updateData(d['config']);
    if(isset(d['sraj_tpl'])) {
        getEngine().srajStore.updateData(d['sraj_tpl']);
    }
    if(isset(d['sraj'])) {
        let srajToCall = d['sraj'];
        for (let k in srajToCall) {
            let e           = srajToCall[k];
            let srajId      = e.id;
            let srajData    = getEngine().srajStore.getSrajTemplate(srajId, "APPEAR");
            if (srajData) {
                getEngine().rajController.parseJSONRajController(srajData);
            }
        }
    }
    if(isset(d['sraj_cancel'])) {
        let srajToCall = d['sraj_cancel'];
        for (let k in srajToCall) {
            let e           = srajToCall[k];
            let srajId      = e.id;
            let srajData    = getEngine().srajStore.getSrajTemplate(srajId, "CANCEL");
            if (srajData) {
                getEngine().rajController.parseJSONRajController(srajData);
            }
        }
    }
    if(isset(d['t'])) {


        switch(d['t']){
            case 'stop':
                if (isset(d['wait_for'])){
										var str = _t("regexp_wait_for_relog");
										//wait for - relog
										if((new RegExp(str, "g")).test(d['wait_for'])){
                      let waitForSec = isset(d['wait_for_sec']) ? (d['wait_for_sec'] * 1000) : g.delays.limit;
											removeMessages(str);
											message(d['wait_for']);
											setTimeout(function(){
												var tsToSend = "&clientTs=" + unix_time(true);
                                                let serverStorage = '&configGet=1';
                                                _g('init&initlvl=1' + serverStorage + tsToSend + '&mucka='+Math.random(), function(){
													removeMessages(str);
													g.gameLoader.finishStep('loc');
												});
											}, waitForSec);
											return true;
										}
										//wait for - rest
										message(d['wait_for']);
                    setTimeout(function(){
                        $('#loading').show();
                        window.location.reload();
                    }, 5500);
										return true;
                }else{
                    log('Engine stopped.',3);
										stopEngine();
                }
                break;
            case 'reload':
                if(g.logoff.start !== null && g.logoff.time !== null){
                  location.href='http://'+location.href.split('.').splice(-2).join('.');
                }else{
                  $('#loading').show();
                  window.location = window.location.href;
                }
                break;
            case 'force_reload':
                window.location.reload();
                break;
        }
    }
    if(isset(d['worldConfig'])) g.worldConfig.update(d['worldConfig']);
    if(isset(d['guest_time'])){
        if(d['guest_time'] == 0) mAlert(_t('guest_playtime_runout')); //'Czas gry dla goÅcia upÅynÄÅ'
        stopEngine();
    }
    //if(isset(d['time'])){
    //    var now = new Date();
    //    g.serverTimeDiff=parseInt(now.getTime().toString().substring(0,10))-parseInt(d['time']);
    //}
    if(isset(d['force_regcomplete'])) ingameRegistration.forceDialog();
    if(isset(d['tutorial'])){__tutorials.val=d['tutorial'];__tutorials.runQueue();}
    if(isset(d['h'])) hero._u(d['h'], d);

    if(isset(d['walking'])) getEngine().startFightBlockade.updateData(d['walking']);

    if(isset(d['progressbar'])) progressbar.update(d['progressbar']);
    else progressbar.hide();
    if(isset(d['pet'])) hero.updatePet(d['pet']);
    if(isset(d['town'])) map._u(d['town']);
    if(isset(d['townname'])) g.townname=d['townname'];
    if(isset(d['conquer'])) {map.conquer=parseInt(d['conquer']);map.setBallTip();}
    if(isset(d['cl'])) map.cols(d['cl']);
    //if(isset(d['js_script'])) eval(d['js_script']);
    if(isset(d['gw2'])) newGateway(d['gw2']);
    if(isset(d['recovery'])) g.itemRecovery = new ItemRecovery(d['recovery']);
    if(isset(d['qtrack']) && _l() != 'pl') questTrack.updateQtrack(d['qtrack']);//qTrack(d.qtrack);
    if(isset(d['settrack'])  && _l() != 'pl')questTrack.startTracking(d['settrack']);
    if(isset(d['icons'])) g.npcIconManager.updateData(d['icons']);
    if(isset(d['npc_tpls'])) g.npcTplManager.updateData(d['npc_tpls']);
    if(isset(d['npcs_del'])) updateDeleteNpcData(d['npcs_del']);
    //if(isset(d['npc'])) g.loadQueue.push({
    //    fun:preNewNpc,
    //    data:d['npc']
    //});
    if(isset(d['npcs'])) g.loadQueue.push({
        fun:preNewNpc,
        data:d['npcs']
    });
    if (isset(d['game'])){
        var g_loader = new MinigameLoader();
        g_loader.initGame(d['game']);
    }
    if(isset(d['advent'])) adventCallendar.parseData(d['advent']);
    if(isset(d['loot_preview'])) {
        initLootPreview(d['loot_preview']);
    }
    if(isset(d['recipe_preview'])) {
        initLootPreview(d['recipe_preview']);
    }

    /////////////// artisanship
    if(isset(d['artisanship'])){
        if (d['artisanship'].open) {
            if (isset(d['enhancement']) && isset(d['enhancement'].usages_preview)) g.crafting.enhanceUsages = d['enhancement'].usages_preview;
            g.crafting.open(d['artisanship'].open);
        } else if (d['artisanship'].close) {
            g.crafting.close();
        }
    }
    /////////////// enhancement
    if(isset(d['enhancement'])){
        if (isset(g.crafting.enhancement)) {
            g.crafting.enhancement.update(d['enhancement']);
        }
    }
    /////////////// salvage
    if(isset(d['salvager_preview'])){
        if (isset(g.crafting.salvage)) {
            g.crafting.salvage.update(d['salvager_preview']);
        }
    }
    /////////////// extraction
    if(isset(d['extractor'])){
        if (isset(g.crafting.extraction)) {
            g.crafting.extraction.update(d['extractor']);
        }
    }
    /////////////// chose bonus selector
    if(isset(d['choose_bonus_selector'])){
        if (g.bonusSelectorWindow) g.bonusSelectorWindow.close();
        g.bonusSelectorWindow = new BonusSelectorWindow(d['choose_bonus_selector']);
    }

    /////////////// bonus reselect
    if(isset(d['bonus_reselect'])){
        const bReselect = d['bonus_reselect'];
        if (isset(bReselect.show)) {
            if (!g.bonusReselectWindow) {
                g.bonusReselectWindow = new BonusReselectWindow();
            }
        }
        if (isset(bReselect.status)) {
            if (!g.bonusReselectWindow) {
                g.bonusReselectWindow = new BonusReselectWindow();
            }
            g.bonusReselectWindow.update(bReselect);
        }
        if (isset(bReselect.select)) {
            const fromReselect = true;
            const res = { ...bReselect.select, fromReselect };
            if (g.bonusSelectorWindow) g.bonusSelectorWindow.close();
            g.bonusSelectorWindow = new BonusSelectorWindow(res);
        }
    }
    if(isset(d['recipes'])){
        // if (!g.recipes) g.recipes = new recipes();
        // g.recipes.update(d['recipes'])
        g.crafting.open('recipes', d['recipes']);
    }
    if(isset(d['shop'])) {
        if (isset(d['shop'].sellAction) || isset(d['shop'].buyAction)) {
            shopSellOrBuyAction(d['shop']);
        } else {
            shop_show(d['shop'], d['item_tpl']);
        }
    }

    ////
    if(isset(d['item_tpl'])) g.tplsManager.updateDATA(d['item_tpl']);
    if(isset(d['item'])){
        for(var i in d['item']){
            d['item'][i].initLvl = g.init;
            //if(xhr._moveitem) d['item'][i].moved = true;
        }
        g.loadQueue.push({
            fun:newItem,
            data:d['item']
        });
    }
    if(isset(d['builds'])) {
        g.buildsManager.updateData(d['builds'])
        //g.loadQueue.push({
        //    fun  : g.buildsManager.updateData,
        //    data : d['builds']
        //});
    }
    if(isset(d['other'])) g.loadQueue.push({
        fun:newOther,
        data:d['other']
    });
    if(isset(d['registration'])) ingameRegistration.parseRegisternoobInfo(d['registration']);
    if(isset(d['codeprom']))codeManager.updateBonusWindow(d['codeprom']);
    if(isset(d['calendar']))eventCalendar.show(d['calendar']);
    if(isset(d['rip'])) newRip(d['rip']);
    if(isset(d['d'])) npcTalk(d['d']);
    if(isset(d['gold_pricelist'])) showGoldShop(d['gold_pricelist']);
    if(isset(d['quests'])) {
        //showDialog('quests-title.png','<div class="scroll400 questlist">'+d['quests']+'</div>');
        //if (!belugaComMode)
        g.questLog.update(d['quests']);
    }
    if(isset(d['qlog'])) qlog.init(d['qlog']);
    if(isset(d['friends'])) {
        tutorialStart(12);
        var fr='';
        for(var k=0; k<d['friends'].length; k+=11)
        {
            var x=d['friends'];
            //var frl=/60; // last time online
            var frstate=x[k+9];
            var frcol='#999';
            if(frstate=='online') frcol='#6f6';
            else
            if(frstate.indexOf('online')>-1) frcol='#09f';
            else frstate=_t('offline_from %time%', {'%time%': calculateDiff(parseInt(x[k+10]))}); //'offline od XXX'
            var frbut='<div class=delfr onclick=\'deleteFriend("'+x[k]+'","'+x[k+1]+'")\'></div>'
                +'<div class=chatfr onclick=\'getEngine().chatController.getChatInputWrapper().setPrivateMessageProcedure("'+x[k+1].replaceAll(' ', '_')+'")\'></div>'
								+'<div class=frparty onclick=\'friendInviteParty("'+x[k]+'")\'></div>';
            if(g.fredit) {
                frbut='';
                if(k>0) frbut='<div class=frup onclick=\'_g("friends&a=fup&id='+x[k]+'")\'></div>';
                if(k+11<d['friends'].length) frbut+='<div class=frdn onclick=\'_g("friends&a=fdown&id='+x[k]+'")\'></div>';
            }

            let charaData = {
                showNick        : true,
                level           : x[k+3],
                operationLevel  : x[k+4],
                prof            : x[k+5],
                nick            : x[k+1]
            }

            let characterInfo    = getCharacterInfo(charaData);


            var fr1='<div class=frbox><div class=frchar style="background-image:url('+g.opath+'postacie'+x[k+2]
                //+')"></div>'+frbut+'<b>'+x[k+1]+'('+x[k+3]+x[k+4]+')</b><br>'
                +')"></div>'+frbut+'<b>' + characterInfo + '</b><br>'
                +'<small style="color:'+frcol+'">('+frstate+')</small><br>'
                +'<nobr><span class=frloc>'+escapeHTML(x[k+6])+'('+x[k+7]+','+x[k+8]+')</span></nobr></div>';
            if(g.fredit || frstate.indexOf('online')<0) fr+=fr1; else fr=fr1+fr;
        }
        $('#myfriends').html(fr);
        $("#friends").fadeIn("fast");

        g.lock.add('friends');
    }
    if(isset(d['enemies'])) {
        var enstate=[_t('active_sometime_ago'),_t('active_fewdays_ago'),_t('inactive_longtime')];
        //var enstate=['niedawno aktywny(a)','byÅ(a) kilka dni temu','od dawna nieaktywny(a)'];
        var enstcol=['#6f6','#888','#000'];
        var en=[];
        var x=d['enemies'];
        for(var i=0; i<x.length; i+=7) {
            var enbut='<div class=delen onclick=_g("friends&a=edel&id='+x[i]+'")></div>';
            if(g.fredit) {
                enbut='';
                if(i>0) enbut='<div class=frup onclick=\'_g("friends&a=eup&id='+x[i]+'")\'></div>';
                if(i+7<x.length) enbut+='<div class=frdn onclick=\'_g("friends&a=edown&id='+x[i]+'")\'></div>';
            }

            let charaData = {
                showNick        : true,
                level           : x[i+3],
                operationLevel  : x[i+4],
                prof            : x[i+5],
                nick            : x[i+1]
            }

            let characterInfo    = getCharacterInfo(charaData);

            en[en.length]='<div class=frbox><div class=frchar style="background-image:url('+g.opath+'postacie'+x[2+i]
            //+')"></div>'+enbut+x[1+i]+'('+x[3+i]+x[4+i]+')'
            +')"></div>'+enbut+characterInfo
            +'<br><small style="color:'+enstcol[parseInt(x[6+i])]+'">('+enstate[parseInt(x[6+i])]+')</small></div>';
        }
        $('#myenemies').html(en.join(''));
    }
    $('#friends .frbox').each(function(){ //k
        if ($(this).attr('scrollHeight') > 66)
            $(this).css({
                fontSize: '12px'
            });
    });
    $('#friends .frbox').css('overflow', 'visible');
    //getEngine().chatController.getChatWindow().chatScrollbar('myfriends', 243, 'myfrscrollbar');
    //getEngine().chatController.getChatWindow().chatScrollbar('myenemies', 499, 'myenscrollbar');
    /////////////// simple
    if(isset(d['gm'])) g.gm=true;
    if(isset(d['alert'])){
        if(d['alert'].match(/Active quests/) === null) {
            if (isset(d['redirect'])) { // for logout message
                mAlert(parsePopupBB(d['alert']), 0, function () { window.location.href = 'https://' + d['redirect']; });
            } else {
                mAlert(parsePopupBB(d['alert']));
            }
        }
    }
    if(isset(d['alert3'])){
        mAlert('<h2>'+_t('achievement_list')+'</h2><div class="scrollable">'+d['alert3']+'</div>')
    }
    //if(isset(d['js'])) eval(d['js']);
    if(isset(d['raj']) && !isset(d['t'])) {
        parseJSONRajController(d['raj']);
    }
    if(isset(d['message'])) {
        for (let i = 0; i < d['message'].length; i++) {
            g.codeMessageManager.updateData(d['message'][i], CodeMessageData.SOURCE.MESSAGE);
        }
    }
    if(isset(d['msg'])) for(var k in d['msg']){
        if (d['msg'][k].substr(0,3)=='ach'){
            achMessage(d['msg'][k]);
        }else{
            if (d['msg'][k] == _t('quest_started')) tutorialStart(8); //'RozpoczÄto quest!'
            message(d['msg'][k]);
        }
    }
    //if(isset(d['event_done'])) EndOfTheWorld.check(d['event_done']);
    if(isset(d['ask'])){
        if (isset(d['ask'].q)) d['ask'].q = parsePopupBB(d['ask'].q);
        askAlert(d['ask']);
    }
    if(isset(d['play'])){
        if (isset(d['play'].path)) {
            if (g.tmpSound !== null) g.tmpSound.destruct();
            g.tmpSound = soundManager.createSound({
                id: `dialogSound_${g.tmpSoundId++}`,
                url: cdnUrl + "/obrazki/" + d['play'].path,
                autoPlay: true,
                onfinish: function () {
                    g.tmpSound.destruct();
                }
            });
        } else if (isset(d['play'].stop && g.tmpSound !== null)) g.tmpSound.destruct();
    }
    if(isset(d['alert2'])){
        g.askre=d['alert2'].re;
        mAlert(parsePopupBB(d['alert2'])+'<br /><center><span style="font-size:0.8em;color:#666;">'+_t('write_ok_to_confirm')+'</span></center>', 3, [null], 'warn'); //Wpisz OK aby potwierdziÄ
        $('#a_cancel').css('display', 'none');
        $('#a_ok').unbind('click').click(function(){
            var val = $('#alert input[name="mAlertInput"]').val();
            if (val=='ok'||val=='OK') $('#alert').fadeOut();
        });
    }
    if(isset(d['n'])) log(d['n']);
    if(isset(d['w'])) log(d['w'],1);
    if(isset(d['e'])) if(d['e']!='ok') log(d['e'],2);
    if(isset(d['ev'])){
      g.ev=d['ev'];
      g.reconnect.stop();
    }
    if(isset(d['js_script'])) eval(d['js_script']);
    if(isset(d['browser_token'])) {
      g.browser_token = d['browser_token'];
    }
		if(isset(d['emo'])) g.loadQueue.push({
			fun:newEmoData,
			data:d['emo']
		});


    //if(isset(d['emo'])) {
    //    //for (var i = 0; i < d['emo'].length; i += 3)
    //    //    emotion(d['emo'][i], d['emo'][i + 1], d['emo'][i + 2]);

    //    for (var i = 0; i < d['emo'].length; i++) {
    //        var dataE = d['emo'][i];
    //        var targetId = isset(dataE.target_id) ? dataE.target_id : false;
    //        emotion(dataE.name, dataE.source_id, targetId, dataE.end_ts, d);
    //    }
		//
		//
    //}
    if(isset(d['minimap'])) map.setCoords(d['minimap']);
    if(isset(d['book'])) bookSetup(d['book']);
    if(isset(d['motel'])) motelSetup(d['motel']);
    if (isset(d['loot'])) lootWindow(d['loot']);
    if (isset(d['logoff_time_left'])) logout_logoff(d['logoff_time_left']);
    //////////////// party
    if(isset(d['party'])) {
        var party=d['party'];
        //if(party.length==0) {
        if (newChatMode) g.chatController.getChatChannelsAvailable().setAvailable(ChatData.CHANNEL.GROUP, true);
        if(!Object.keys(party).length) {
            $('#bm_party').fadeOut();
            $('#party').css({
                top:-9999
            });
            g.party=false;
            g.chatController.getChatChannelsAvailable().setAvailable(ChatData.CHANNEL.GROUP, false);
            g.chatController.getChatChannelCardWrapper().showNotReadElement(ChatData.CHANNEL.GROUP, false);
        } else {
            if(!g.party) $('#bm_party').fadeIn();
            g.party=[];
            // for(var i=0; i<party.members.length; i+=3) {
            for(var i in party.members) {
                var rec = party.members[i];
                g.party[parseInt(i)] = {
                    'n': rec.nick,
                    'r': rec.commander ? 1:0,
                    's': rec.stasis ? 1:0,
                };
            }
            var lead=false;
            if(g.party[hero.id].r) lead=true;
            var pp='';
            for(var k in g.party){
                var leadertxt = _l() == 'pl' ? '[D]' : '[L]';
                var stasis = g.party[k].s ? 'pm-nick--stasis' : '';
                pp='<div class="party_member">'+(g.party[k].r?leadertxt:pp)+'<span class="pm-nick '+stasis+'">'+g.party[k].n+'</span>'+((lead&&k!=hero.id)?
                ' <nobr><b onclick="_g(\'party&a=rm&id='+k+'\')" tip="'+_t('throwout_group_member')+'">[X]</b>'
                +' <b onclick="_g(\'party&a=give&id='+k+'\')" tip="'+_t('give_leadership')+'">'+leadertxt+'</b></nobr>':'')+'</div>' //Oddaj dowÃ³dztwo
                +(g.party[k].r?pp:'');
            }
						var partygrpkill = "";
						if(isset(party.partygrpkill)) {
							var val = parseInt(party.partygrpkill);
							var tip = _t('group_kill_exp_nocount');
							var cname = "noactive";
							if(val == 1) {
								tip = _t('group_kill_exp_count'); //'W tej druÅ¼ynie naliczane bÄdzie zabijanie grupowe w questach':'W tej druÅ¼ynie nie bÄdzie naliczane zabijanie grupowe w questach'
								cname = "active";
							}
							partygrpkill = " <div tip='"+tip+"' id='grpkill' class='"+cname+"'></div>";
						}
            $('#party P').html(pp+(lead?'<b onclick="_g(\'party&a=disband\')" class=pcen>['+_t('solve_group')+']</b>' //RozwiÄÅ¼ grupÄ
                :'<b onclick="_g(\'party&a=rm&id='+hero.id+'\')" class=pcen>['+_t('leave_group')+']</b>') //OpuÅÄ grupÄ
            +'<div style="font-size:10px; margin-top:2px;color:white; text-align:center">'+(isset(party.partyexp)?('exp '+party.partyexp+'%'):'')
            +partygrpkill+'</div>');

            var po=$('#party').position();
            if(parseInt(po.top)<0) $('#party').css({
                top:-$('#party').height()
            });
        }
    }
    //////////////////////// clan
    if(isset(d['clanmap'])) {
        $('.clan').fadeIn();
        g.lock.add('clans');
        if (!g.clanController) g.clanController = new ClanController();
        g.clanController.updateClanList(d['clanmap']);
    }
    if(isset(d['members'])) {
        $('.clan').fadeIn();

        if (!g.clanController) g.clanController = new ClanController();
        g.clanController.updateMembers(d['members']);
    }
    //if(isset(d['clanlist'])) {
    //    tutorialStart(11);
    //    var cl=d['clanlist'];
    //    var hcl=[], half=cl.length>> 1, myClan= '';
    //    for(var i=0; i<cl.length; i+=2) {
    //        var str = "<b onclick='_g(\"clan&a=getclan&id=" + cl[i] + "\")'" + ((cl[i] != hero.clan) ? '' : ' class=myclan') + ">" + cl[i + 1] + "</b>" + ((i == half) ? '<td>' : '');
    //
    //        if (cl[i] != hero.clan) hcl[i >> 1] = str;
    //        else myClan = str;
    //    }
    //    g.clanlist = '<table class=clanlist><tr><td>' + myClan + hcl.join('') + '</table>';
    //    $('#clanbox').html(g.clanlist);
    //    $('.clan').fadeIn();
    //    g.lock.add('clans');
    //}
    if(isset(d['myclan'])) {
        g.lock.add('clans');
        if (!g.clanController) g.clanController = new ClanController();
        g.clanController.update(d['myclan']);
        //g.clanController.updateClasses(d['myclan']);
        $('#clanmenu>.boxhover>li.disabled').removeClass('disabled').addClass('to-disable');
        $('#create_new_clan').css('display', 'none');

        if(isset(d['myclan'].created)) g.clan=d['myclan'];
        else {
            for (var k in d['myclan']) g.clan[k] = d['myclan'][k];
        }
        if(isset(d['myclan'].goldlog)) {
            var glog=g.clan.goldlog.split('<br>'), log2=[], s;
            for(var i in glog){
                s=glog[i].split(';');
                log2[i]={
                    'kind':s[0],
                    'txt':s[1]
                };
            }
            g.clan.goldlog=log2;
        }
        if(isset(d['myclan'].ranks)) {
            var ranks=g.clan.ranks.split(';'),r2=[];
            for(var i in ranks) {
                ranks[i]=ranks[i].split(',');
                r2[parseInt(ranks[i][0])]={
                    'name':ranks[i][1],
                    'r':parseInt(ranks[i][2])
                };
            }
            g.clan.ranks=r2;
            g.clan.myrank=r2[hero.clan.rank].r;
        }
        g.clan.logoimg="<div class=cl_logo><br>"+escapeHTML(g.clan.name)+"</div>";
        //if(g.clan.logo=='') g.clan.logoimg="<div class=cl_logo><br>"+escapeHTML(g.clan.name)+"</div>";
        //else g.clan.logoimg=`<div class="cl_logo" style="background-image:url('${g.clan.logo.replace(/'/g, "\\'")}')"></div>`;
        if(isset(d['myclan'].mlist)) {
            var mem = [];
            var mlist='';
            for(var i=0; i<g.clan.mlist.length; i+=2) {
                var memId = g.clan.mlist[i];
                var memName = g.clan.mlist[i + 1];
                mem.push({'text': memName, 'val': memId});
            }
            mem.sort((a, b) => a.text.localeCompare(b.text)); // sort by name
            mem.map(m => {
                mlist+='<option value="'+m.val+'">'+m.text+'</option>';
            });
            g.clan.mlist=mlist+'</select>';
        }
        if(!isset(d['myclan'].created) && isset(g.clan.fn)) g.clan.fn();
        if ( $('.clan').css('display') == 'none') {
            $('.clan').css('display', 'block');
            clanOfficial();
        }
    }

    if (isset(d['clan_applications'])) g.clanController.updateRecruitApplications(d['clan_applications']);
    if (isset(d['clan_invitations']))  g.clanController.updateRecruitInvitations(d['clan_invitations']);

    if (isset(d['clan_skills'])) g.clanController.updateClanSkills(d['clan_skills']);
    if (isset(d['clan_skills_blessing'])) g.clanController.updateClanBless(d['clan_skills_blessing']);
    if (isset(d['clan_quests'])) g.clanController.updateClanQuests(d['clan_quests']);
    //if(isset(d['members'])) {
    //    g.clan.m=d['members'];
    //    clanMembers();
    //}
    if(isset(d['clan'])){
        var id=d['clan'].id;
        var cl=d['clan'];
        var txt="<div class='clan-official-page'>";
        txt+="<div class=cl_logo><br>"+escapeHTML(cl.name)+"</div>";
        //if(cl.logo=='') txt+="<div class=cl_logo><br>"+escapeHTML(cl.name)+"</div>";
        //else txt+=`<div class="cl_logo" style="background-image:url('${cl.logo.replace(/'/g, "\\'")}')"></div>`;
        txt+=parseClanBB(cl.official);
        if (id == g.clan.id && g.clan.myrank&64) {
            txt += "<br><br><button onclick=clEditMain()>";
            txt += 'Edytuj oficjalnÄ stronÄ';
            txt += "</button>";
        }
        txt+='</div><center><table class=members><tr><th width=35>'+_t('th_lp', null, 'clan')+'<th>'+_t('th_nick', null, 'clan')+'<th>'+_t('th_rank', null, 'clan'); //Lp., Nick, Ranga
        let memberCounter = 0;

        for(var i=0; i<cl.members.length; i+=6) {
            memberCounter++;

            let charaData = {
                showNick        : true,
                level           : cl.members[i + 1],
                operationLevel  : cl.members[i + 2],
                prof            : cl.members[i + 3],
                nick            : cl.members[i]
            }

            let characterInfo    = getCharacterInfo(charaData);

            //txt+='<tr><td>'+memberCounter+'<td>'+cl.members[i]+' ('+cl.members[i+1]+cl.members[i+2]+')<td>'+cl.members[i+3];
            txt+= `<tr>
                        <td>${memberCounter}</td>
                        <td>${characterInfo}</td>
                        <td>${cl.members[i+4]}</td>
                   </tr>
                   `;
        }
        //txt += parseClanBB(cl.official);

        let $html = $(txt+'</table></center>');
        setLogoInClan($html, d.clan.logo)

        //$('#clanbox').html(txt+'</table></center>');
        $('#clanbox').html($html);
    }
    if(isset(d['clan_fr'])) g.clan.fr=d['clan_fr'];
    if(isset(d['clan_en'])) {
        g.clan.en=d['clan_en'];
        clanDiplomacy();
    }
    ////////////// trade
    if(isset(d['trade'])) {
        g.tmpTradeAcceptStatus = [g.trade.accept, g.trade.myaccept];
        var tr=d['trade'];
        if(isset(tr.init)) tradeInit(tr.init);
        tradeUpdate(tr);
    }
    ////////////// chat
    if(isset(d['cls'])) {
        if(d['cls']=='*')	g.chat.txt=['','','',''];
        else g.chat.txt[d['cls']]='';
        if(d['cls']=='*' || d['cls']==g.chat.tab) $('#chattxt').empty();
        //getEngine().chatController.getChatWindow().chatScrollbar('chattxt', getEngine().chatController.getChatWindow().getChatSize()==2?255:500, 'chatscrollbar');
    }
    //if(isset(d['c'])) newChatMsg2(d['c']); // chat

    if(isset(d['businessCards'])) {
        g.businessCardManager.updateData(d['businessCards']);
    }
    if(isset(d['chat'])) {
        g.chatController.getChatDataUpdater().updateData(d['chat']);
    }
    if(isset(d['f'])) fight(d['f'], d); //////////// battle
		//////////////// MM
		if(isset(d['matchmaking_state'])) g.matchmaking.changeState(d['matchmaking_state']);
		if(isset(d['matchmaking_search'])) g.matchmaking.changeSearch(d['matchmaking_search']);
		if(isset(d['matchmaking_confirmation'])) g.matchmaking.onConfirmation(d['matchmaking_confirmation']);
		if(isset(d['matchmaking_preparation'])) g.matchmaking.onPreparation(d['matchmaking_preparation']);
		if(isset(d['matchmaking_statistics'])) g.matchmaking.onStatistics(d['matchmaking_statistics']);
		if(isset(d['matchmaking_history'])) g.matchmaking.onHistory(d['matchmaking_history']);
		if(isset(d['matchmaking_ladder_global'])) g.matchmaking.onGeneralRanking(d['matchmaking_ladder_global'], 'global');
		if(isset(d['matchmaking_ladder_clan'])) g.matchmaking.onGeneralRanking(d['matchmaking_ladder_clan'], 'clan');
		if(isset(d['matchmaking_ladder_friends'])) g.matchmaking.onGeneralRanking(d['matchmaking_ladder_friends'], 'friends');
		if(isset(d['matchmaking_statistics_detailed'])) g.matchmaking.onStatisticsDetailed(d['matchmaking_statistics_detailed']);
		if(isset(d['match_profile'])) g.matchmaking.onProgress(d['match_profile']);
    if(isset(d['matchmaking_season_rewards'])) g.matchmaking.onMatchmakingSeasonPosition(d['matchmaking_season_rewards']);
		if(isset(d['match_season'])) g.matchmaking.onSeason(d['match_season']);
		if(isset(d['match_summary'])) g.matchmakingSummary.updateSummary(d['match_summary']);
		if(isset(d['match_main'])) g.matchmaking.onMain(d['match_main']);
		if(isset(d['rewards_calendar_active'])) $('#new_event_calendar').css('display', 'block');
		if(isset(d['rewards_calendar'])) initRewardsCalendar(d['rewards_calendar']);
		//if(isset(d['barter'])) initItemChanger(d['barter']);
		if(isset(d['barter'])) initBarter(d['barter']);
		if(isset(d['captcha'])) initCaptcha(d['captcha']);
		if(isset(d['login'])) {
            if (!isset(d['promotions'])) {
                initPoll(d);
            }
        }
		if(isset(d['choose_outfit'])) initChooseOutfit(d['choose_outfit']);
	if(isset(d['choose_teleport'])) {
      if (isset(d['choose_teleport'].location_data)) {
          g.tpScroll.showLocation(d['choose_teleport'].location_data);
      } else {
          if (g.tpScroll) g.tpScroll.close();
          g.tpScroll = new tpScroll();
          g.tpScroll.update(d['choose_teleport']);
      }
	}
    if(isset(d['promotions'])) {
        if (!g.news) g.news = new news();
        g.news.init();
        g.news.update(d['promotions']);
    }
    if(isset(d['promotion_changed'])) g.news.updateChanged(d['promotion_changed']);
		if(isset(d['notices'])) {
			if (d['notices'].indexOf(1) > -1) $('#b_news').addClass('notif');
			if (d['notices'].indexOf(2) > -1) $('#new_event_calendar').addClass('notif');
		}


    //////////// daze screen
    if(isset(d['wanted'])){PK_watch.update(d['wanted']);}
    if(isset(d['dead'])) {
        var sec=d['dead']%60;
        var min='';
        g.deadCounter=d['dead'];
        if(d['dead']>59) min=Math.floor(d['dead']/60)+'min ';
        $('#dazeleft').html(_t('unconcious_info_txt %time%', {'%time%':'<b>'+min+sec+'</b>'}));
        /*
         *"<b>JesteÅ nieprzytomny.</b><br>"
         +"Nie wiesz co siÄ wokÃ³Å Ciebie dzieje. Chyba ktoÅ CiÄ przenosi.<br>"
         +"Ockniesz siÄ, kiedy wrÃ³cÄ Ci siÅy, za <b>"+min+sec+"sek.</b>"
         **/
        if(!g.dead) {
            __tutorials.skipSelected(5);
            tutorialStart(6);
            g.dead=true;
            g.deadCounter=d['dead'];
            $('#dazed').fadeIn('fast');
        }
    } else {
        if(g.dead && g.deadCounter < 1) {
            g.dead=false;
            g.deadCounter=0;
            hero.centerViewOnMe();
            $('#dazed').fadeOut('fast');
        }
    }
    //////////////// mails
    if(isset(d['mails'])) updateDataMails(d['mails']);

    /////////////// auctions
    if (isset(d['auctions'])) {
        if (!g.auctions) {
            g.auctions = new AuctionManager();
            g.auctions.init();
        }
        g.auctions.updateData(d['auctions'])
    }
    // if(isset(d['myah']))
    //     auctionShow(d['myah'],d['mybids']);
    // if(isset(d['ah']))
    //     auctionBrowse(d['ah'],d['ahp']);
    ////////////// deposit
    if(isset(d['depo'])) depoShow(d['depo']);
    if(isset(d['clan_depo'])) depoShow(d['clan_depo'], true);
    if(isset(d['depo_opentabs'])) {
        let depoOpenTabs = getEngine().depo.depoOpenTabs;
        let beforeFirstUpdate = depoOpenTabs.getBeforeFirstUpdate();

        getEngine().depo.depoOpenTabs.updateData(d['depo_opentabs']);
        depoUpdateNotLoadedItemsCards();
        depoManageMultiZeroZero();

        if (beforeFirstUpdate) {
            let tabToShow = depoOpenTabs.getTabToShow(d['depo_opentabs']);
            if (g.depo.size > 1) {
                setTimeout(function(){
                    depoSwitchSection(tabToShow)
                    depoSwitchSectionInSpecificPos(tabToShow)
                }, 200);
            }
        }
    }
    //////////////// skills

	if (isset(d['selectedskills']))	g.skills.updateSelectedSkills(d['selectedskills']);

	if(isset(d['skill_list']) && !isset(d['battleskills'])) {
        if (!g.skills.isInit) g.skills.init();
	    g.skills.load(d['skill_list'], d['freeskills_ts'], d['skill_data']);
	}
	if(isset(d['freeskills_ts'])) {
		g.skills.updateFreeSkills(d['freeskills_ts']);
	}
    if(isset(d['skills_learnt'])) $('#skillcount .skills_learnt').text(d['skills_learnt']);
    if(isset(d['skills_total'])) $('#skillcount .skills_total').text(d['skills_total']);
    if(isset(d['battleskills'])&&d['battleskills'].max>0) {

        g.bmEditor.init();
        g.bmEditor.update(d['battleskills'])
    }
    if(isset(d['battleskills']))g.bmEditor.refreshSkillList(d['battleskills'].list);
    if(isset(d['conquer-stats'])) conquerStats.show(d['conquer-stats']);
    if(isset(d['settings'])) {
        cfgupdate();
        if (getEngine().init > 4) {
            config_save()
        } else {
            createSettingsMenus();
        }
    }
    if(isset(d['chatModerator'])) {
        if (isset(d['chatModerator'].open)) {
            g.mCAddon.update(d['chatModerator'].open);
        }
    }
    if(g.init<4 && d['e']=='ok') {

        if (g.init == 1 && g.blockSendNextInit) return;
        g.init++;

        let payLoad = null;
//console.log(g.init)


        if (g.init == 2 && getEngine().serverStorage.getReloadServerStorageAfterAnswerInInit1()) {
            //console.log('reloadServerStorage');
            payLoad	 = getEngine().serverStorage.prepareMergeObjToSend();
            getEngine().serverStorage.createOldDataAndResetNewData();
        }

        var name = '';
        switch(g.init){
            case 2:name = 'player';break;
            case 3:name = 'items';break;
            case 4:name = 'npc';break;
        }
        g.gameLoader.startStep(name)

        var tsToSend = "&clientTs=" + unix_time(true);
        //_g('init&initlvl='+g.init+ tsToSend +'&mucka='+Math.random(), function(){g.gameLoader.finishStep(name)});


        if (payLoad)    {
            let serverStorage = '&configSet=1';
            _g('init&initlvl='+g.init+ tsToSend + serverStorage + '&mucka='+Math.random(), function(){g.gameLoader.finishStep(name)}, payLoad);
        }
        else _g('init&initlvl='+g.init+ tsToSend +'&mucka='+Math.random(), function(){g.gameLoader.finishStep(name)});


    }
    var lag=ts()-g.ats, lag2=Math.min(Math.floor(lag/50),5);
    g.ats=0;
    if(g.lag!=lag2) $('#lagmeter').css({
        backgroundPosition:'0 -'+(17*lag2)+'px'
    });
    $('#lagmeter').attr('tip', lag+'ms');
    g.lag=lag2;
    if (isset(callback) && typeof callback == 'function') callback(d);
		hero.sendDir = false;
    return true;
}

function deleteFriend(id, nick) {
	var str = _t("ask_delete_friend %nick%", {
		"%nick%": nick
	}, "default");
	mAlert(str, 2, [function () {
		_g("friends&a=fdel&id=" + id);
	}, function () {}]);
}
function friendInviteParty(id) {
	_g("party&a=inv&id="+id);
}


/*************************************** CONTEXT MENU */
function showMenu(e,menu,forceshow) {
    var m='<div id=h-orn1></div><div id=h-orn2></div>';
    if(menu.length == 1 && !(isset(menu[0][2]) && menu[0][2]) && !(isset(forceshow) && forceshow)){
        return eval(menu[0][1]);
    }
    for(var k in menu)
        m+="<button onclick='"+menu[k][1]+"'>"+menu[k][0]+"</button><br>";
    $('#hmenu').html(m);//+"<button class=last>Anuluj</button>");
    $('#hmenu BUTTON').last().attr('class','last');
    var mw=$('#hmenu').width(), mh=$('#hmenu').height();
    var of = $(e.target).offset();
    var tw = $(e.target).width(), th = $(e.target).height();
    var tx=of.left - mw/2 + tw/2;
    var ty=of.top - mh/2 + th/2;
    Tip.hide();
    $('#hmenu').css({
        'left':tx,
        'top':ty
    }).fadeIn('fast');
    g.menu=true;
    g.menushowing=true;
}
function hideMenu(){
    g.menu=false;
    $('#hmenu').fadeOut('fast');
}

function fillNick (data) {
    return data
      .split('~')
      .join(',')
      .split('[NICK]')
      .join(hero.nick);
}

function fillNickUppercase (data) {
    return nickUppercase(data);
}

function fillSex (data) {
    return TextModifyByTag.sexModify(data);
}


/***************************************** NPC DIALOG */
function npcTalk(d)
{
    //reseting height or replies DOM element so diff between left
    //space and needed space can be checked later to add scroll
    clearInterval(g.talk.scrollCheckInterval);
    //removeScrollbar('dlgin', 'talkscroll');
    $('#dlgin').css({'margin-right':''});
    //$('#replies').css({height:''}).html('');
    //reset end

    var dialogCloud = null;
    var bubble = !g.talk.id ? true : false;
    /*if(!g.talk.id && d.length==6 && !/#BOXOFF#/.test(d[4]) && d[3]&4){
     bubble = true;
     }*/

    if (!g.lock.check('npcdialog')) {
        g.lock.add('npcdialog');
    }

    if(parseInt(d[0])==4){
        if(!g.talk.id) {
            g.lock.remove('npcdialog');
            delete (g.talk.bubblevisible);
            return;
        }
    } else {
        g.windowCloseManager.callWindowCloseConfig(g.windowsData.windowCloseConfig.DIALOGUE)
    }
    var dlg='', dlge='', lines=0;
    for(var k=0; k<d.length; k+=3) {
        d[k]=parseInt(d[k]);
        if(!d[k]) { // npc info
            g.talk.name=d[k+1];
            g.talk.id=d[k+2];
            g.talk.type=1;
            g.talk.dialogCloud=d[k+2];
            if(isset(g.npc[g.talk.id])) g.talk.type=g.npc[g.talk.id].type;
            else bubble = false;
            //g.agressiveNpc[g.talk.id]=true;
            continue;
        }
        if(d[k]==4) { // end dialog
            //$('#dialog').fadeOut('fast');
            $('#dialog').css('display', 'none');
            $('#hero_dialog_img').remove();
            $('#bubbledialog').fadeOut('fast');
            g.talk.dialogCloud = null;
            $('.dialogCloud').remove();
            map.resizeView();
            var tmpIdc = g.talk.id+'';
            if(tmpIdc.match(/23085|21933|22310|21952|22172|17176/)){
                //tutorialStart(18);
            }
            g.talk.id=0;
            g.lock.remove('npcdialog');
            delete g.talk.block;
            hero.centerViewOnMe(); //center view on player in case of earlier change to npc position
            delete g.talk.insideDialogSynchroId;
            return;
        }

        d[k+1] = fillNick(d[k+1]);
        d[k+1] = fillNickUppercase(d[k+1]);
        d[k+1] = fillSex(d[k+1]);

        let centerOnNpc = false;
        let centerOnHero = false;
        let centerOnPet = false;

        if(/#([0-9]+|this|player|pet)#/.test(d[k+1])){ //swing to npc pointed in dialog script (#npc_id#)

            var npcId   = /#([0-9]+|this|player|pet)#/.exec(d[k+1])[1];
            d[k+1]      = d[k+1].replace(/#([0-9]+|this|player|pet)#/,'');
            switch(npcId){
                case 'player':
                    centerOnHero = true;
                    //createDialogCloud((hero.y*32 - hero.fh + 16), (hero.x*32 + hero.fw/2 - 8))
                    g.talk.name=hero.nick;
                    g.talk.dialogCloud = 'hero';
                    $('#dlgin h4 b').html(parseBasicBB(g.talk.name)+':');
                    break;
                case 'pet':
                    if (!hero.pet) {

                        npcId = g.talk.id;
                        if (isset(g.npc[npcId])) {
                            centerOnNpc = true;
                            initiateNpcInsideDialog(npcId, true, false);
                        } else {
                            g.talk.insideDialogSynchroId=npcId;
                        }
                        g.talk.dialogCloud = npcId;

                    } else {

                        centerOnPet = true;
                        g.talk.name=hero.pet.name;
                        g.talk.dialogCloud = 'pet';
                        $('#dlgin h4 b').html(parseBasicBB(g.talk.name)+':');
                    }
                    break;
                case 'this':
                default:
                    npcId = npcId == 'this' ? g.talk.id : npcId;
                    if (isset(g.npc[npcId])) {
                        centerOnNpc = true;
                        initiateNpcInsideDialog(npcId, true, false);
                    } else {
                        g.talk.insideDialogSynchroId=npcId;
                    }
                    g.talk.dialogCloud = npcId;
            }
        }
        if(/#TOWN#/i.test(d[k+1])){
            d[k+1] = d[k+1].replace(/#TOWN#/i, '');
            g.talk.name=map.name;
        }
        if(/#BOXOFF#/.test(d[k+1])){
            d[k+1] = d[k+1].replace(/#BOXOFF#/, '');
            bubble = false;
        }
        if(/#REWARD/.test(d[k+1])){
            var rew = d[k+1].split('#REWARD').splice(1);
            var list = {};
            var profs = null;
            for(var i=0; i<rew.length; i++){
                var parts = rew[i].split(',');
                for(var j=0; j<parts.length; j++){
                    var pair = parts[j].split(':');
                    if(pair[0] == 'prof'){
                        var pList = pair[1].split(' ');
                        profs = {};
                        for(var p=0; p<pList.length; p++){
                            var tmp = pList[p].replace(' ', '').split('->');
                            profs[tmp[1]] = tmp[0];
                        }
                    }else{
                        var tmp = pair[0].split('.');
                        if(!isset(list[tmp[1]])) list[tmp[1]] = [];
                        if(tmp[0] == 'item'){
                            if(typeof(list[tmp[1]][tmp[0]]) != 'object') list[tmp[1]][tmp[0]] = [];
                            list[tmp[1]][tmp[0]].push(pair[1].replace(' ',''));
                        }else{
                            list[tmp[1]][tmp[0]] = pair[1].replace(' ','');
                        }
                    }
                }
            }
            //console.log(list);
            //console.log(profs);
            var rewards = drawRewards(profs, list);
            d[k+1] = d[k+1].replace(/#REWARD.*/, '<h2>'+_t('reward_header', null, 'talk')+'</h2>'+rewards.join(''));
        }
        if(/#PLAY\(.*?\)/.test(d[k+1])){
            var path = /#PLAY\((.*?)\)/.exec(d[k+1])[1];
            d[k+1]=d[k+1].replace(/#PLAY\((.*?)\)/,'');
            soundManager.createSound({
                id: 'dialogSound'+g.dialog.soundId++,
                url: path,
                autoPlay: true
            });
        }
        var shop = '';
        if(/#SHOP\(.*?\)#/.test(d[k+1])){
            var id = /#SHOP\((.*?)\)#/.exec(d[k+1])[1];
            d[k+1]=d[k+1].replace(/#SHOP\(.*?\)#/,'');
            shop = 'showShopPanel(\''+id+'\')';
        }
        if(/#IMG\(.*?\)/.test(d[k+1])){
            $('#hero_dialog_img').remove();
            var path = /#IMG\((.*?)\)/.exec(d[k+1])[1];
            if(path == 'remove') return;
            d[k+1]=d[k+1].replace(/#IMG\((.*?)\)/,'');
            //var img = new Image();
            //img.src = path;
            //img.onload=function(){
            ImgLoader.onload(
                path,
                null,
                function(){
                var T = this;
                $('<div id="hero_dialog_img"></div>').css({
                    width           :T.width,
                    height          :T.height,
                    background      :'url('+path+')',
                    top             :32*hero.y - hero.fh,
                    position        :'absolute',
                    left            :32*hero.x + 16 - T.width/2,
                    'z-index'       :parseInt($('#hero').css('z-index'))-1
                }).appendTo('#base');
            });
        }
        var h = false;
        if(d[k+1].substr(0,1) == '_'){h = true;d[k+1] = d[k+1].substr(1);}
        if (/<sakwa>/.test(d[k+1])){
            d[k+1]=d[k+1].replace(/<sakwa>/,'');
            $(document.createElement('div')).css({
                width:64,height:32,
                background:'url(img/arrow-right.gif)',
                position:'absolute',
                top:218,
                left:465,
                zIndex:331
            }).attr('id', 'sakwa-arrow').appendTo('#centerbox').delay(4000).fadeOut(1000, function(){$(this).remove()});
            arrowIntervalAmount = 0;
            arrowInterval = setInterval(function(){arrowIntervalAmount++;$('#sakwa-arrow').toggle();if(arrowIntervalAmount==6) clearInterval(arrowInterval)},500);
        }
        if(d[k]&1) { // npc talk
            var endtalk=_t('end_talk1', null, 'talk'); //'ZakoÅcz rozmowÄ'
            if(g.talk.type==4 || g.talk.type==5) endtalk=_t('end_talk2', null, 'talk'); //'Koniec'
            g.talk.bubbleEndLineCommand = 'talk&id='+g.talk.id+'&c='+d[k+2];
            g.talk.bubbleEndLineTxt = endtalk;
            g.talk.bubbleTxt = d[k+1];
            if(d[k+1].length>180) bubble = false;
            dlg+='<h4><b>'+parseBasicBB(g.talk.name)+'</b></h4>'+parseContentBB(d[k+1]);
            if(d[k]&4) dlge+='<li class="icon LINE_EXIT" onclick="_g(\'talk&id='+g.talk.id+'&c='+d[k+2]+'\')"><div class="icon LINE_EXIT"></div>'+endtalk+'</li>';
            else if(d[k+2]){
                dlge+='<li class="icon LINE_NEXT" onclick="_g(\'talk&id='+g.talk.id+'&c='+d[k+2]+'\')"><div class="icon LINE_NEXT"></div>'+_t('dialog_next', null, 'talk')+'</li>';
                bubble = false;
            }
            //}
        }
        /* d[k] possibilities:
         LINE_OPTION=2, - zwykÅa odpowiedÅº
         LINE_EXIT=4 - wyjÅcie
         LINE_NEWQUEST=8 - nowy quest
         LINE_CONTQUEST=16 - kontynuacja questa
         LINE_SHOP=32
         LINE_ATTACK=64
         LINE_GAME=128 - wbudowana gra
         LINE_HEAL=256 - Makatara uleczy 100% HP
         LINE_NEXT
         */
        // player options
        if(d[k]&2){
            lines++;
            if(lines>1 || !(d[k]&4)) bubble = false;
            g.talk.bubbleEndLineCommand = 'talk&id='+g.talk.id+'&c='+d[k+2];
            g.talk.bubbleEndLineTxt = d[k+1];
            if(d[k+1].length>180) bubble = false;
            var ic = getLineClass(d[k]); //(_l() == 'en' ? getLineClass(d[k]) : (((d[k]&4)?'LINE_EXIT':'LINE_OPTION')));
            dlge+='<li onclick="_g(\'talk&id='+g.talk.id+'&c='+d[k+2]+'\'); '+shop+'"'
            +'class="icon '+ic+/*((d[k]&4)?' shoptalk':'')+*/'"><div class="icon '+ic+'"></div>'+d[k+1]+'</li>';
        }
        if (centerOnNpc) {
            if (!bubble) map.resizeView(512, 192);
            initiateNpcInsideDialog(npcId, true, true);
        }
        if (centerOnHero) {
            if (!bubble) map.resizeView(512, 192);
            map.center(hero.x*32, hero.y*32, true);
        }
        if (centerOnPet) {
            if (!bubble) map.resizeView(512, 192);
            map.center(hero.pet.x*32, hero.pet.y*32, true);
        }
    }
    //npcId = !isset(npcId) || npcId == 'player' ? g.talk.id : npcId;
    var tmpId = npcId+'';
    if(tmpId.match(/23085|21933|22310|21952|22172|17176/)) tutorialStart(1);
    if(bubble){
        dlge = '<i style="color:#999;cursor:pointer" onclick="event.stopPropagation(); _g(\''+g.talk.bubbleEndLineCommand+'\'); g.talk.block=true; return false;" class="endtalk2">'+parseContentBB(g.talk.bubbleEndLineTxt)+'</i>'
        $('#bubbledialog .container').html(parseContentBB(g.talk.bubbleTxt) + '<div class="interface">'+dlge+'</div>');
        var initBubble = function(){
            var $target;
            if (isset(npcId) && (npcId == 'player' || npcId == 'pet')) {
                if (npcId == 'player')  $target = $('#hero');
                if (npcId == 'pet')     $target = $('#base').find('.pet');
            } else if (!isset(npcId)) {
                $target = $('#npc'+g.talk.id);
            } else {
                $target = $('#npc'+npcId);
            }
            var npc = {
                left: parseInt($target.css('left')),
                top: parseInt($target.css('top'))
            }
            var pos = {
                top:npc.top - $('#bubbledialog').height(),
                zIndex:parseInt($target.css('z-index')) + 10
            };
            if(npc.left+32+$('#bubbledialog').width() > $('#base').width()){
                $('#bubbledialog').removeClass('left');
                pos.left = npc.left - $('#bubbledialog').width();
            }else{
                $('#bubbledialog').addClass('left');
                pos.left = npc.left+32;
            }
            $('#bubbledialog').css(pos).show();
            g.talk.bubblevisible = true;
        }
        if(isset(g.npc[g.talk.id])){
            if(g.npc[g.talk.id].y>=5) initBubble();
            else{
                $('#dlgin .message').html(dlg);
                $('#dlgin .replies').html(dlge);
                $('#dialog').show();
                map.resizeView(512,192);
            }
        }
        else var npcloadinterval = setInterval(function(){
            if(isset(g.npc[g.talk.id])){
                if(g.npc[g.talk.id].y>=5) initBubble();
                else{
                    $('#dlgin .message').html(dlg);
                    $('#dlgin .replies').html(dlge);
                    $('#dialog').show();
                    map.resizeView(512,192);
                }
                clearInterval(npcloadinterval);
            }
        },100);
    }else if(!bubble){
        $('#dlgin .message').html(dlg);
        $('#dlgin .replies').html(parseContentBB(dlge, false));
        $('#dialog').show();
        /*if($('#dlgin .replies').innerHeight() > $('#dlgin').height() - $('#dlgin .message').innerHeight() - 25){
         $('#dlgin .replies').height($('#dlgin').height() - $('#dlgin .message').innerHeight() - 25).find('li').css({'margin-right':'20px'});
         addScrollbar('replies', 490, 'talkscroll');
         }*/
        map.resizeView(512,192);
        //if(questTrack.activeTrack) $('span.track_arrow').attr('tip', questTrack.trackList[questTrack.activeTrack][0].txt);
    }
    if(!bubble){

        $('#dlgin').scrollTop(0);

        //clearInterval(g.talk.scrollCheckInterval);
        //g.talk.scrollCheckInterval = setInterval(function(){
        //    if($('#talkscroll').length) return;
        //    if($('#dlgin').height()<($('#dlgin .message').innerHeight() + $('#dlgin .replies').innerHeight())){
        //        $('#dlgin').css({'margin-right':20});
        //        addScrollbar('dlgin', 490, 'talkscroll');
        //    }
        //},100);
        //if($('#dlgin').height()<($('#dlgin .message').innerHeight() + $('#dlgin .replies').innerHeight())){
        //    $('#dlgin').css({'margin-right':20});
        //    addScrollbar('dlgin', 490, 'talkscroll');
        //}
    }
    if(g.talk.dialogCloud){
        createDialogCloud(g.talk.dialogCloud);
    }
}

function parseJSONRajController (d) {
    let data;
    try {
        data = JSON.parse(d);
    } catch(e) {
        console.error('RajController.js', 'parseJSON', 'Incorrect JSON format!', d);
    }

    if (data.weather)   map.weatherRayControllerServe(data);
    if (data.mapFilter) map.weatherRayControllerServe(data);
    if (data.night) g.nightController.updateData(data);

    if (data.interfaceKind && elementIsObject(data.interfaceKind) && data.interfaceKind.kind == "NI") {
        setNiInterfaceCookie();
    }
}
function showShopPanel(name){
    shop_close();
    switch(name){
        case 'gold':shop_close();_g('creditshop&credits_gold=-1');break;
        case 'sl':slShopOpen();break;
    }
}
function drawRewards(profs, list){
    //console.log(list);
    //console.log(profs);
    var ret = [];
    for(var i in list){
        var p = list[i];
        var html = '<div class="rewardLine'+((profs !== null && profs[i].search(hero.prof)>=0) || profs === null ? ' mine' : '')+'">';
        if(isset(p.item)){
            html += '<div class="rewardElement rew_item"><span class="label">'+_t('rew_item', null, 'talk')+'</span>';
            for(var j=0; j<p.item.length; j++){
                html += '<div class="container rew_item_'+p.item[j]+'"></div>';
            }
            html += '</div>';
        }
        if(isset(p.gold)) html += '<div class="rewardElement rew_gold"><span>'+_t('rew_gold', null, 'talk')+'</span> '+p.gold+'</div>';
        if(isset(p.exp)) html += '<div class="rewardElement rew_exp"><span>'+_t('rew_exp', null, 'talk')+'</span> '+p.exp+'</div>';
        if(isset(p.ph)) html += '<div class="rewardElement rew_ph"><span>'+_t('rew_ph', null, 'talk')+'</span> '+p.ph+'</div>';
        html += '<div class=clear></div></div>';
        ret.push(html);
    }
    return ret;
}
function getLineClass(val){
    var opts = {
        2:'LINE_OPTION',
        4:'LINE_EXIT',
        8:'LINE_NEW_QUEST',
        16:'LINE_CONT_QUEST',
        32:'LINE_SHOP',
        64:'LINE_ATTACK',
        128:'LINE_GAME',
        256:'LINE_HEAL'
    };
    var i=256;
    while(i>1){
        if(val&i) return 'icon '+opts[i];
        i>>=1;
    }
    return null;
}
function createDialogCloud(id){
    var pos = [0,0];
    switch (id) {
        case 'hero':
            if(!(hero.x && hero.y)) return;
            pos = [(hero.y*32 - hero.fh + 16), (hero.x*32 + hero.fw/2 - 8)];
        break;
        case 'pet':
            if(!(hero.pet.x && hero.pet.y)) return;
            pos = [(hero.pet.y*32 - hero.pet.fh + 16), (hero.pet.x*32 + hero.pet.fw/2 - 8)];
            break;
        default :
            id = parseInt(id);
            if(!isset(g.npc[id]) || id != g.talk.dialogCloud) return;
            pos = [(g.npc[id].y*32 - g.npc[id].fh + 16), (g.npc[id].x*32 + g.npc[id].fw/2 - 8)];
    }
    //if(id == 'hero'){
    //    if(!(hero.x && hero.y)) return;
    //    pos = [(hero.y*32 - hero.fh + 16), (hero.x*32 + hero.fw/2 - 8)];
    //}else{
    //    id = parseInt(id);
    //    if(!isset(g.npc[id]) || id != g.talk.dialogCloud) return;
    //    pos = [(g.npc[id].y*32 - g.npc[id].fh + 16), (g.npc[id].x*32 + g.npc[id].fw/2 - 8)];
    //}
    $('.dialogCloud').remove();
    $(document.createElement('div')).css({
        width:16,height:16,
        background:'url('+CFG.epath+'npctalk.gif)',
        position:'absolute',
        top: pos[0],
        left: pos[1],
        zIndex: 222
    }).addClass('dialogCloud').appendTo('#base');
}
function initiateNpcInsideDialog(npcId, init = false, center = true){ //needed for elements synchronisation after refresh
    if (center) map.center(g.npc[npcId].x*32, g.npc[npcId].y*32, (isset(init) && init));
    g.talk.name=g.npc[npcId].nick;
    $('#dlgin h4 b').html(parseBasicBB(g.talk.name));
    g.talk.id=npcId;
}
/*************************************** CONFIGURATION */
function cfgupdate()
{
	// for(var i=1; i<=29; i++) {
	// 	if (hero.opt2 & (1 << (i - 1))) {
    //         $('#config [opt=' + i + ']').addClass('active');
    //     } else {
    //         $('#config [opt=' + i + ']').removeClass('active');
    //     }
	// }

    for(let k in SettingsData.KEY) {
        // if (hero.opt2 & (1 << (i - 1))) {
        let keyValue = SettingsData.KEY[k];
        if (getEngine().settingsStorage.getValue(keyValue)) {
            $('#config [opt=' + keyValue + ']').addClass('active');
        } else {
            $('#config [opt=' + keyValue + ']').removeClass('active');
        }
    }
	//for(var i=150; i<=151; i++) {
	//	$('#config [opt=' + i + ']').css('backgroundPosition', hero.localOption2[i] ? '0 -22px' : '0 0');
	//}
}
function getStateLocalOptFromStorage (i) {
	var status = margoStorage.get('silocalopt/' + i + '/status');
	if (status == null) {
		margoStorage.set('silocalopt/' + i + '/status', false);
		return false;
	} else {
		return status;
	}
}
function clan_click() {
    if (hero.clan) _g("clan&a=myclan");
    else  _g("clan&a=list&page=1");
}

function config_show()
{
    // hero.opt2=hero.opt;
	// 	hero.localOption2 = {};
  	// for (var k in hero.localOption) {
	// 		hero.localOption2[k] = hero.localOption[k]
	// 	}
    cfgupdate();
    $('#config').absCenter().fadeIn();
    g.lock.add('config');
}
function getStatusOfLocalOpt () {
	hero.localOption = {};
	var localOpt = $('.local-opt');

	localOpt.each(function () {
		var attr = $(this).attr('opt');
		hero.localOption[attr] = getStateLocalOptFromStorage(attr);
	});
}
function serveroptclick(e)
{
	// x=$(e.target).attr('opt');
	// hero.opt2^=1<<(x-1);
	// cfgupdate();

    let $el = $(e.target);
    let id = $el.attr('opt');

    if ($el.hasClass('active')) {
        $el.removeClass('active');
    } else {
        $el.addClass('active');
    }

    let val = getEngine().settingsStorage.getValue(id);

    getEngine().settingsStorage.sendRequest(id, null, !val);

    // hero.opt2^=1<<(x-1);
    // cfgupdate();
}
//function localoptclick(e)
//{
//	var x = $(e.target).attr('opt');
//	hero.localOption2[x] = !hero.localOption2[x];
//	cfgupdate();
//}
function changeClient () {
    setNiInterfaceCookie();
    window.location.reload();
}

function setNiInterfaceCookie () {
    var ddd = new Date();
    ddd.setTime(ddd.getTime() + 3600000 * 24 * 30);
    setCookie('interface',  'ni', ddd, '/', 'margonem.pl');
}

// function get_config_opt (which) {
// 	return hero.opt & (1 << which - 1);
// }

function config_save()
{
    // _g('config&opt='+hero.opt2);
    // hero.opt=hero.opt2;
    // $('#config').fadeOut();
    g.lock.remove('config');
    //$.fx.off=hero.opt&128;
    $.fx.off= !g.settingsOptions.isInterfaceAnimationOn();

    let showItemsRankOn = g.settingsOptions.isShowItemsRankOn();

    //if(hero.opt&4096){
    if(showItemsRankOn) {
        $('.itemHighlighter').removeClass('nodisp');
    }else{
        $('.itemHighlighter').addClass('nodisp');
    }
		// var oldWeatherState = hero.localOption[15];
		// hero.localOption = {};

		// for (var k in hero.localOption2) {
		// 	var status = hero.localOption2[k];
		// 	hero.localOption[k] = status;
		// 	margoStorage.set('silocalopt/' + k + '/status', status);
		// }
		//var newWeatherState = hero.localOption[150];
		// var newWeatherState = get_config_opt(16);
		// if (oldWeatherState == newWeatherState) return;
		// clearWeather();
		// if (!newWeatherState) checkWeather();
    g.nightController.rebuiltAfterSettingsSave();
}
function config_cancel()
{
    $('#config').fadeOut();
    g.lock.remove('config');
}
/*********************** OTHER */
function logout_logoff(time){
    if (time > 0) {
        g.logoff.time = time;
        const ci = setInterval(() => {
            const $counter = $("#logout_logoff_time_left");
            const counterIsExist = $counter.length === 1;
            --time;
            if (counterIsExist && time >= 0) {
                $counter.text(time);
            } else {
                clearInterval(ci);
            }
        }, 1000);
        const str = _t('logout-time %val%', {'%val%': `<span id="logout_logoff_time_left">${time}</span>`}, 'logoff');
        mAlert(str, 1, [
            () => {
                location.href = 'http://' + location.href.split('.').splice(-2).join('.');
                clearInterval(ci);
            }, () => {
                _g("logoff&a=stop");
                clearInterval(ci);
            }
        ]);
    } else {
        g.logoff.start = null;
        g.logoff.time = null;
    }
}
function logout(force)
{
    if(_l() != 'pl') return location.href='http://margonem.com';
    if(isset(hero.preview_acc) && hero.preview_acc == 1 && !isset(force)){
        var html = '<div>'+_t('logout_tmpacc')+'</div>';
        return mAlert(html, 2, [function(){logout(true)}]);
    }
    if(g.logoff.start === null && !g.battle) {
        _g("logoff&a=start", function (data) {
            if(!isset(data.alert))  g.logoff.start = unix_time();
        });
    }
}
function showHelp()
{
    showDialog((_l()=='en'?'en/':'')+'help-title.png', $('#h_help').html());
    if (!$('#h_help_scrolled_scroll').length)
        addScrollbar('h_help_scrolled', 380, 'h_help_scrolled_scroll', false);
}
function showNews() {
	if (!g.news) _g('promotions&a=show');
}
function partyToggle()
{
    var o=$('#party').position();
    if(parseInt(o.top)<0) $('#party').animate({
        top:0
    },'slow');
    else $('#party').animate({
        top:-$('#party').height()
    },'slow');
}

/** WEATHER CONTROLL **/

function clearWeather () {
	clearUpdateEveryGameUpdate();
	$('.weather-moving-thing').remove();
	$('.weatherwrapper').remove();
}

//function elementIsObject (element) {
//    let isObject = typeof element === "object";
//
//    return isObject;
//}

function elementIsObject (element) {
    let isObject = !elementIsArray(element) && typeof element === "object";

    return isObject;
}

function elementIsArray (element) {
    return Array.isArray(element);
}

function checkFilterDataCorrect (data) {
    if (!elementIsObject(data)) {
        console.error('WeatherManager.js', 'checkFilterDataCorrect', 'mapFilter must be object!', data);
        return false
    }

    if (isset(data.remove)) return true;

    if (!data.color) {
        console.error('WeatherManager.js', 'checkFilterDataCorrect', 'attr color not exist!', data);
        return false;
    }

    if (!isset(data.color.r) || !isset(data.color.g) || !isset(data.color.b) || !isset(data.color.a)) {
        console.error('WeatherManager.js', 'checkFilterDataCorrect', 'attr color.r or color.g or color.b or color.a not exist!', data);
        return false
    }
    if (!isset(data.color.g)) return false
    if (!isset(data.color.b)) return false
    if (!isset(data.color.a)) return false

    if (!isInt(data.color.r) || !isInt(data.color.g) || !isInt(data.color.b)) {
        console.error('WeatherManager.js', 'checkFilterDataCorrect', 'attr color.r or color.g or color.b must be integer!', data);
        return false
    }
    if (!isFloatVal(data.color.a)) {
        console.error('WeatherManager.js', 'checkFilterDataCorrect', 'attr color.a must be double val!', data);
        return false
    }

    return true;
}

function setMapFilter (v) {
	// var ocean = [3720, 3372, 3373, 3378, 3379, 3380, 3381, 3382, 3383, 3384, 3385, 3387, 3388, 3389, 3390, 3391, 3392, 3394, 3395, 3396, 3397, 3398, 3399, 3416];
    //
	// if (ocean.indexOf(id) >= 0) {

    if (!checkFilterDataCorrect(v)) return;

    $('.mapfilterwrapper').remove();

    if (isset(v.remove)) return;

    // var bck = {
    //     'ocean': 'rgba(0, 0, 255, 0.2)'
    // };
    //var ie = isset($.browser.msie) && $.browser.msie;

    var w       = $('#ground').width();
    var h       = $('#ground').height();
    var wbase   = $('<div class="mapfilterwrapper"></div>');

    wbase.css({
        width       : w,
        height      : h,
        background  : `rgba(${v.color.r},${v.color.g},${v.color.b},${v.color.a})`,
        zIndex      : getLayerOrder(map.y, 10)
    });

    $("#base").append(wbase);
}

// function checkWeather () {
// 	if (get_config_opt(16)) return;
// 	//if (getStateLocalOptFromStorage(150)) return;
// 	//var snow = [3001, 3002, 3004, 2990, 2991, 2992, 2993, 2988, 2417, 2418, 2399, 2549, 2550, 2554, 2682, 2680,1721, 180, 2975, 1387, 1730, 2063, 2056,4070, 4071, 1, 2, 9, 33, 35, 114, 257, 574, 4093, 4094, 4095, 4096, 4097, 4098, 4102];
// 	var snow = [4548, 4549, 4480, 3001, 3002, 3004, 2990, 2991, 2992, 2993, 2988, 2417, 2418, 2399, 2549, 2550, 2554, 2682, 2680,1721, 180, 2975, 1387, 1730, 2063, 2056, 4331, 4338, 5878, 5886, 5891, 5892, 5903, 5883, 5884, 5924, 5932];
// 	var snow2 = [2553];
// 	var rain = [2403, 2405, 3142, 3481, 3526, 4008, 4277, 4327, 4334, 4379, 4697];
// 	var fish = [3720, 3372, 3373, 3378, 3379, 3380, 3381, 3382, 3383, 3384, 3385, 3387, 3388, 3389, 3390, 3391, 3392, 3394, 3395, 3396, 3397, 3398, 3399, 3416];
// 	var light = [3842, 3843, 3845, 3846, 3847, 3848, 3849, 3850, 3851, 3852, 3853, 3854, 3855, 3856, 3857, 3858, 3859, 3876, 3879, 3885, 4272, 4273, 4275, 4276, 4278, 4286, 4292, 4293, 4294, 4295, 4296];
// 	var latern = [4297 ];
//     var bat = [5000];
//
// 	//var bat = [1, 2, 9, 33, 35, 114, 257, 574, 589, 630, 2029, 3481, 3526, 3459, 3460, 3473, 3478, 3479, 3480, 3499, 3500, 3501, 3472];
// 	if(snow.indexOf(map.id) >= 0) changeWeather('snow');
// 	if(snow2.indexOf(map.id) >= 0) changeWeather('snow2');
// 	if(rain.indexOf(map.id) >= 0) changeWeather('rain');
// 	if(fish.indexOf(map.id) >= 0) changeWeather('fish');
// 	if(light.indexOf(map.id) >= 0) changeWeather('light');
// 	if(latern.indexOf(map.id) >= 0) changeWeather('latern');
// 	if(bat.indexOf(map.id) >= 0) changeWeather('bat');
// }

function changeWeather(_name){

    let name = _name.toLowerCase();
    //if (name == "fish" || name == "bat" || name == "light" || name == "latern") return showFished(false, name);
    if (isMoveObjectsWeather(name)) return showFished(false, name);

    let $weatherDiv = $('<div>').addClass(`weatherwrapper weather-${name}`);
    let $ground     = $('#ground');

    $weatherDiv.css({
        width               : $ground.width(),
        height              : $ground.height(),
        backgroundImage     : `url(${CFG.fpath}/weather/weather_${name}.gif)`,
        zIndex              : getLayerOrder(map.y, 10)
    });

    $('#base').append($weatherDiv);
}

function isMoveObjectsWeather (name) {
    return ["fish", "bat", "halloweenbat", "light", "latern"].includes(name);
}

function removeWeather (_name) {
    let name = _name.toLowerCase();

    if (isMoveObjectsWeather(name)) removeFromUpdateEveryGameUpdate(name);

    $('#base').find(`.weather-${name}`).remove();
}

function weatherMovingThing(objType, moveVector, speed) {
	var self = this;
	this.onRemove = null;
	this.container = null;
	this.pos = {
		top: 0,
		left: 0
	};
	this.addPos = {
		top: 0,
		left: 0
	};
	speed *= 1 + (Math.random()/12);
	this.moveVector = {
		x: moveVector[0] * speed,
		y: moveVector[1] * speed
	};
	this.last = null;
	this.$ = $("<div>").addClass("weather-moving-thing");
	if(objType)
		this.$.addClass(objType);

	this.borderDest = function (val, st, max, add) {
		if(val > 0) {
			return max+add;
		} else if(val < 0) {
			return -add;
		}
		return st;
	};

	this.update = function (time) {
		var dt = (time - self.last) / 10;
		self.pos.left += self.moveVector.x * dt;
		self.pos.top += self.moveVector.y * dt;
		self.last = time;
		self.$.css(self.pos);
		if(this.test()){
			self.remove();
		}
	};

	this.test = function () {
		var pos = self.$.position();
		var top = this.addPos.top - self.$.height() - 20;
		var left = this.addPos.left - self.$.width();
		var right = self.container.width() - this.addPos.left + self.$.width();
		var bottom = self.container.height() - this.addPos.top + self.$.height();
		if(pos.top < top || pos.left < left || pos.left > right || pos.top > bottom) {
			return true;
		}
		return false;
	}

	this.remove = function () {
		if(self.onRemove) self.onRemove();
		self.$.remove();
	};

	this.appendTo = function (container) {
		self.last = Date.now();
		self.$.hide();
		container.append(self.$);
		self.container = container;
	};

	this.setPos = function (startX, startY) {
		this.pos.top = startY;
		this.pos.left = startX;
		self.$.show();
		self.$.css(this.pos);
	}
	return this;
}

function showFished (ie, kind) {
    var gameBase = $("#base");
    var config = {
        limit:{
            'fish': 15,
            'bat': 5,
            'halloweenbat': 5,
						'light': 30,
						'latern': 20
        }
    };
	function creatureFish (vec, speed, left, right){
		this.left = left;
		this.right = right;
		this.vec = vec;
		this.clone = function (id) {
			return new weatherMovingThing("weather-"+ kind +" weather-"+ kind +"-"+id, vec, speed);
		};
		return this;
	}

    var laternTypes = {
        "lampion0": {
            type: new creatureFish([-0.9, -0.43], 0.5, [0, 0], [0, 0]),
            ids: [0],
            nokey: true
        },
        "lampion1": {
            type: new creatureFish([0.9, 0.43], 0.5, [0, 0], [0, 0]),
            ids: [1],
            nokey: true
        },
        "lampion2": {
            type: new creatureFish([-0.9, -0.43], 0.5, [0, 0], [0, 0]),
            ids: [2],
            nokey: true
        },
        "lampion3": {
            type: new creatureFish([0.9, 0.43], 0.5, [0, 0], [0, 0]),
            ids: [3],
            nokey: true
        },
        "lampion4": {
            type: new creatureFish([-0.9, -0.43], 0.5, [0, 0], [0, 0]),
            ids: [4],
            nokey: true
        }
    };
		var lightTypes = {
			"light": {
				type: new creatureFish([-0.9, -0.43], 0.5, [0, 0], [0, 0]),
				ids: [0],
				nokey: true
			},
			"light1": {
				type: new creatureFish([0.9, -0.43], 0.8, [0, 0], [0, 0]),
				ids: [3],
				nokey: true
			},
			"lightconstant": {
				type: new creatureFish([-0.9, -0.43], 0.4, [0, 0], [0, 0]),
				ids: [1],
				nokey: true
			},
			"lightconstant1": {
				type: new creatureFish([0.9, -0.43], 0.6, [0, 0], [0, 0]),
				ids: [4],
				nokey: true
			}
		};
    var batsTypes = {
        "bat": {
            type: new creatureFish([-0.9, -0.43], 1, [0, 0], [0, 0]),
            ids: [0],
            nokey: true
        },
        "bat1": {
            type: new creatureFish([0.9, -0.43], 0.8, [0, 0], [0, 0]),
            ids: [3],
            nokey: true
        },
        //"batpump": {
        //    type: new creatureFish([-0.9, -0.43], 1.3, [0, 0], [0, 0]),
        //    ids: [1],
        //    nokey: true
        //},
        //"batpump1": {
        //    type: new creatureFish([0.9, -0.43], 1.3, [0, 0], [0, 0]),
        //    ids: [4],
        //    nokey: true
        //},
        //"batskull": {
        //    type: new creatureFish([-0.9, -0.43], 1.2, [0, 0], [0, 0]),
        //    ids: [2],
        //    nokey: true
        //},
        //"batskull1": {
        //    type: new creatureFish([0.9, -0.43], 1.2, [0, 0], [0, 0]),
        //    ids: [5],
        //    nokey: true
        //},
        //"batpumpupdown": {
        //    type: new creatureFish([0.1, 0.43], 0.8, [0, 0], [0, 0]),
        //    ids: [6],
        //    nokey: true
        //},
        //"batpumpupdown1": {
        //    type: new creatureFish([0.2, -0.6], 1.1, [0, 0], [0, 0]),
        //    ids: [7],
        //    nokey: true
        //},
        //"batskullupdown": {
        //    type: new creatureFish([-0.2, 0.8], 1.2, [0, 0], [0, 0]),
        //    ids: [8],
        //    nokey: true
        //},
        //"batskullupdown1": {
        //    type: new creatureFish([-0.1, -0.73], 0.8, [0, 0], [0, 0]),
        //    ids: [9],
        //    nokey: true
        //},
        "batupdown": {
            type: new creatureFish([-0.1, 0.43], 0.8, [0, 0], [0, 0]),
            ids: [10],
            nokey: true
        },
        //"batupdown1": {
        //    type: new creatureFish([0.1, -0.6],1, [0, 0], [0, 0]),
        //    ids: [11],
        //    nokey: true
        //}
    };
    var halloweenBatsTypes = {
        "bat": {
            type: new creatureFish([-0.9, -0.43], 1, [0, 0], [0, 0]),
            ids: [0],
            nokey: true
        },
        "bat1": {
            type: new creatureFish([0.9, -0.43], 0.8, [0, 0], [0, 0]),
            ids: [3],
            nokey: true
        },
        "batpump": {
            type: new creatureFish([-0.9, -0.43], 1.3, [0, 0], [0, 0]),
            ids: [1],
            nokey: true
        },
        "batpump1": {
            type: new creatureFish([0.9, -0.43], 1.3, [0, 0], [0, 0]),
            ids: [4],
            nokey: true
        },
        "batskull": {
            type: new creatureFish([-0.9, -0.43], 1.2, [0, 0], [0, 0]),
            ids: [2],
            nokey: true
        },
        "batskull1": {
            type: new creatureFish([0.9, -0.43], 1.2, [0, 0], [0, 0]),
            ids: [5],
            nokey: true
        },
        "batpumpupdown": {
            type: new creatureFish([0.1, 0.43], 0.8, [0, 0], [0, 0]),
            ids: [6],
            nokey: true
        },
        "batpumpupdown1": {
            type: new creatureFish([0.2, -0.6], 1.1, [0, 0], [0, 0]),
            ids: [7],
            nokey: true
        },
        "batskullupdown": {
            type: new creatureFish([-0.2, 0.8], 1.2, [0, 0], [0, 0]),
            ids: [8],
            nokey: true
        },
        "batskullupdown1": {
            type: new creatureFish([-0.1, -0.73], 0.8, [0, 0], [0, 0]),
            ids: [9],
            nokey: true
        },
        "batupdown": {
            type: new creatureFish([-0.1, 0.43], 0.8, [0, 0], [0, 0]),
            ids: [10],
            nokey: true
        },
        "batupdown1": {
            type: new creatureFish([0.1, -0.6],1, [0, 0], [0, 0]),
            ids: [11],
            nokey: true
        }
    };
	var fishTypes = {
		"kalamarnica": {
			type: new creatureFish([-0.9, -0.43], 0.5, [40, 6], [-16, 30]),
			ids: [0,1,2],
			nokey: false
		},
		"kalamarnical": {
			type: new creatureFish([0.9, -0.43], 0.5, [-40, 6], [16, 30]),
			ids: [3,4,5],
			nokey: false
		},
		"krewetka": {
			type: new creatureFish([-1, 0], 0.25, [16, 16], [16, -16]),
			ids: [6],
			nokey: false
		},
		"krewetkal": {
			type: new creatureFish([1, 0], 0.25, [-16, 16], [-16, -16]),
			ids: [7],
			nokey: false
		},
		"meduza": {
			type: new creatureFish([0, -1], 0.05, [32, 32], [-32, 32]),
			ids: [8,9,10],
			nokey: true
		},
		"rekin": {
			type: new creatureFish([1, 0.1736], 1, [-30, -24], [-30, 24]),
			ids: [11,12],
			nokey: true
		},
		"rekinl": {
			type: new creatureFish([-1, 0.1736], 1, [30, -24], [30, 24]),
			ids: [13,14],
			nokey: true
		},
		"rybka": {
			type: new creatureFish([-0.985, -0.174], 0.75, [24, -24], [24, 24]),
			ids: [15,16,17],
			nokey: false
		},
		"rybkal": {
			type: new creatureFish([0.985, -0.174], 0.75, [-24, -24], [-24, 24]),
			ids: [18,19,20],
			nokey: false
		},
		"wegorz": {
			type: new creatureFish([-0.869, -0.233], 0.5, [20, -22], [24, 24]),
			ids: [21,22],
			nokey: false
		},
		"wegorzl": {
			type: new creatureFish([0.869, -0.233], 0.5, [-20, -22], [-24, 24]),
			ids: [23,24],
			nokey: false
		},
		"big-wegorz": {
			type: new creatureFish([0.934, 0.358], 0.5, [32, -10], [-24, -18]),
			ids: [25,26],
			nokey: true
		},
		"big-wegorzl": {
			type: new creatureFish([-0.934, 0.358], 0.5, [-32, -10], [24, -18]),
			ids: [27,28],
			nokey: true
		}
	};
	//var w = $('#ground').width();
	//var h = $('#ground').height();
   // var wbase = $('<div class=weatherwrapper></div>')
	//
   // if (kind == 'fish') {
   //     wbase.css({
   //         width: w,
   //         height: h,
   //         background: 'rgba(0,0,255,0.2)',
   //         zIndex: ie ? 1 : getLayerOrder(map.y, 10)
   //     });
   // }
	//var wbase = $('<div class=weatherwrapper></div>').css({
	//		width: w,
	//		height: h,
	//		background: 'rgba(0,0,255,0.2)',
	//		zIndex: ie ? 1 : getLayerOrder(map.y, 10)
	//});

	function getRandom (tab) {
		var len = tab.length - 1;
		return tab[Math.round(Math.random()*len)];
	}
	function getARandom(tab) {
		var t = [];
		for(var i in tab){
			t.push(i);
		}
		var len = t.length - 1;
		return tab[t[Math.round(Math.random()*len)]];
	}

	//bubbles
	var bubbles = [];
	var limitBubbles = 75;
	var spawnBubble = function () {
		var size = 1+Math.round(Math.random()*9);
		var el = new weatherMovingThing("weather-bubble weather-bubble-"+size, [0,-1], 0.5);
		var x = $("#base").scrollLeft() + Math.round(Math.random() * $("#base").width());
		var y = $("#base").scrollTop() + $("#base").height();
		el.appendTo(gameBase);
		el.setPos(x, y);
		bubbles.push(el);
		el.onRemove = function () {
			var idx = bubbles.indexOf(this);
			if(idx != -1) bubbles.splice(idx, 1);
		};
	};

	function randFishPosition (obj, con, el) {
		var ret = {
			x: con.scrollLeft(),
			y: con.scrollTop()
		};
		var c = {
			y: 0,
			x: 1
		};
		var blockRandX = false;
		var blockRandY = false;
		if(obj.vec[0] < 0) {
			c.x = 1;
		} else if(obj.vec[0] > 0) {
			c.x = 0;
			ret.x -= el.width();
		} else {
			c.x = 0;
			ret.x -= el.width();
			blockRandY = true;
		}
		if(obj.vec[1] < 0) {
			c.y = 1;
		} else if(obj.vec[1] > 0) {
			c.y = 0.1;
			ret.y -= el.height();
		} else {
			c.y = 0;
			ret.y -= el.height();
			blockRandX = true;
		}
		if(!blockRandX && !blockRandY){
			if(Math.random() > 0.5) {
				c.y = Math.random();
			} else {
				c.x = Math.random();
			}
		} else if(blockRandX) {
			c.y = Math.random();
		} else if(blockRandY) {
			c.x = Math.random();
		}
		ret.x += c.x * con.width();
		ret.y += c.y * con.height() - 20;
		return ret;
	}

	function createOneFish (cl, keyAmount, rybki, gameBase) {
		var id = getRandom(cl.ids);
		var ryba = cl.type.clone(id);
		ryba.appendTo(gameBase);
		var pos = randFishPosition(cl.type, gameBase, ryba.$);
		ryba.addPos.top = ryba.moveVector.y * keyAmount * ryba.$.height();
		ryba.addPos.left = ryba.moveVector.x * keyAmount * ryba.$.width();
		pos.x -= ryba.addPos.left;
		pos.y -= ryba.addPos.top;
		ryba.setPos(pos.x, pos.y);
		return ryba;
	}

	function createFishesKey (i, cl, leader, rybki, gameBase) {
		var id = getRandom(cl.ids);
		var ryba = cl.type.clone(id);
		var left = cl.type.left;
		var right = cl.type.right;
		var x = leader.pos.left;
		var y = leader.pos.top;
		var modPos = i;
		if(modPos & 1) {
			modPos = modPos + 1;
			modPos /= 2;
			x += cl.type.left[0] * modPos;
			y += cl.type.left[1] * modPos;
		} else {
			modPos /= 2;
			x += cl.type.right[0] * modPos;
			y += cl.type.right[1] * modPos;
		}
		var old_test = ryba.test;
		ryba.test = function () {
			if(leader.leaderAlive) {
				return false;
			} else {
				return old_test.apply(this, arguments);
			}
		};
		ryba.onRemove = function () {
			var idx = rybki.indexOf(ryba);
			if(idx != -1) rybki.splice(idx, 1);
		};
		ryba.appendTo(gameBase);
		ryba.setPos(x, y);
		return ryba;
	}

	//fishes
	var rybki = [];
	var limitRybek = config.limit['bat'];

	function getCreatureTypes(kind) {
		switch (kind) {
			case 'bat' :
				return batsTypes;
            case 'halloweenbat' :
				return halloweenBatsTypes;
			case 'fish' :
				return fishTypes;
			case 'light' :
				return lightTypes;
            case 'latern' :
                return laternTypes;
		}
	}

	function spawnFishes(){
      var typeTab = getCreatureTypes(kind);
      var cl = getARandom(typeTab);

		var keyMAmount = Math.round(Math.random()*4);
		if(cl.nokey) {
			keyMAmount = 1;
		}
		var keyAmount = keyMAmount * 2 - 1;
		var leader = createOneFish(cl, keyMAmount, rybki, gameBase);
		rybki.push(leader);
		leader.leaderAlive = true;
		leader.onRemove = function () {
			var idx = rybki.indexOf(leader);
			this.leaderAlive = false;
			if(idx != -1) rybki.splice(idx, 1);
		};
		for(var i=1;i<keyAmount;i++) {
			var m = createFishesKey (i, cl, leader, rybki, gameBase);
			rybki.push(m);
		}
	};
	var div = 5;
	var div2 = 80;
	var update = function () {
		if(div2 >= 80) {
			while(rybki.length < limitRybek) {
				spawnFishes();
			}
			div2 = 0;
		}
		if(div >= 5 && (kind == 'fish')) {
			if(bubbles.length < limitBubbles) {
				spawnBubble();
			}
			div = 0;
		}
		div++;
		div2++;
		var time = Date.now();
		for(var t in rybki){
			rybki[t].update(time);
		}
		//if(kind == 'bat' || kind == 'light') return;
      if(kind == 'bat' || kind == 'halloweenbat' || kind == 'light'|| kind == 'latern') return;
		for(var t in bubbles){
			bubbles[t].update(time);
		}
	};
	addToUpdateEveryGameUpdate(update, kind);
	//gameBase.append(wbase);
}

/**************************** CLAN */
//function clanMap()
//{
//    //$('#clanbox').html(g.clan.logoimg+parseClanBB(g.clan.info));
//    //g.clan.fn=clanPriv;
//    _g('clan');
//}

function newClanList () {
    _g('clan&a=list&page=1');
    if (g.clanController) g.clanController.resetLastValClanList();
    g.clan.fn=newClanList;
}
function clanRecruit()
{
    //var html = '';
    //if(g.clan.myrank&32) html += '<button onclick=clEditPriv()>'+_t('clan_edit_privpage', null, 'clan')+'</button> '; //Edytuj
    //$('#clanbox').html(g.clan.logoimg+ html +parseClanBB(g.clan.info));
    g.clanController.updateRecruit();
    g.clan.fn=clanRecruit;
}
function clanPriv()
{
    var html = '';
    html += g.clan.logoimg+ html +parseClanBB(g.clan.info);
    if(g.clan.myrank&32) html += '<br><br><button onclick=clEditPriv()>'+_t('clan_edit_privpage', null, 'clan')+'</button>'; //Edytuj

    let $html = $(`<div class="clan-priv-page">${html}</div>`);
    setLogoInClan($html)

    //$('#clanbox').html(`<div class="clan-priv-page">${html}</div>`);
    $('#clanbox').html($html);
    g.clan.fn=clanPriv;
}
function setLogoInClan ($html, _logo) {
    let logo = isset(_logo) ? _logo : g.clan.logo;

    if(logo == '') return;

    if (!$html.length) {
        console.error('.cl_logo not exist!');
        return;
    }

    if ($html.length == 1) {

        $html.find('.cl_logo').empty().css('background-image', 'url(' + logo + ')')
        return;

    } else {

        let $clLogo = $html.find('.cl_logo');
        if ($clLogo.length) $clLogo.empty().css('background-image', 'url(' + logo + ')')
        else {
            $html.each(function () {

                let hasClLogoClass = $(this).hasClass('cl_logo');
                if (hasClLogoClass) $(this).empty().css('background-image', 'url(' + logo + ')');

            })
        }

    }
}
function clanOfficial() {
    _g('clan&a=getclan&id='+ g.clan.id);
    g.clan.fn=clanOfficial;
}

function clChRank(n) {
    _g('clan&a=member&id='+g.clan.m[n]+'&rank='+$('#cl_chrank').val())
}
function clDismiss(n)
{
    mAlert(_t('player_dismiss_confirm', {'%name%':g.clan.m[n+1]}, 'clan'),1,[function(){ //'Na pewno chcesz wyrzuciÄ gracza '+g.clan.m[n+1]+'?'
        _g('clan&a=member&dismiss=1&id='+g.clan.m[n])
    },function(){}])
}
function clLeadership(n)
{
    mAlert(_t('give_clan_leadership_confirm %name%', {'%name%':g.clan.m[n+1]}, 'clan'), 2, [
        function(){
            _g('clan&a=member&id='+g.clan.m[n]+'&leader=1'+(parseInt($('#cl_payself').val())?'&pay=self':''))
        },
        function(){}
    ]);
}
//function clMemberEdit(n) {
//    var t=g.clan.logoimg+'<div style="margin:25px"><h2>'+_t('player_edit %name%', {'%name%':g.clan.m[n+1]}, 'clan') //+'Edycja gracza '+g.clan.m[n+1]
//        +'</h2><br><center><big>'+_t('rank', null, 'clan')+'<select id=cl_chrank '+((g.clan.myrank&2)?'':'disabled')+'>', t2=''; //'Ranga:
//    for(var k in g.clan.ranks)
//        if(k<hero.clanrank) t2='<option value='+k+((k==g.clan.m[n+7])?' selected':'')+'>'+g.clan.ranks[k].name+'</option>'+t2;
//    t+=t2+'</select><br><br>';
//    if(g.clan.myrank&16) t+='<button onclick=clDismiss('+n+')>'+_t('dismiss_member', null, 'clan')+'</button> '; //WyrzuÄ
//    t+='<button onclick=g.clan.fn()>'+_t('cancel', null, 'clan')+'</button> <button onclick=clChRank('+n+')>'+_t('save', null, 'clan')+'</button></big>'; //Anuluj //Zapisz
//    if(g.clan.myrank&1) t+='<br><br><select id=cl_payself><option value=0>'+_t('clan_sl', null, 'clan')+'</option><option value=1>'+_t('private_sl', null, 'clan')+'</option>' //SÅ klanowe //SÅ prywatne
//    +'</select> <button onclick=clLeadership('+n+')>'+_t('give_clan_leadership', null, 'clan')+'</button>'; //PrzekaÅ¼ przywÃ³dztwo klanu (10SÅ)
//    $('#clanbox').html(t+'<br><br><small>'+_t('ranks_info_txt', null, 'clan')+'</small></center></div>'); //Uwaga: moÅ¼na edytowaÄ oraz nadawaÄ rangi tylko poniÅ¼ej swojej.
//}
/*
function clanMembers()
{
    var txt='', m=g.clan.m, edit=g.clan.myrank&19;
    for(var i=0; i<m.length; i+=10) {
        txt+='<tr class='+((m[i+8]=='online')?'clm_online':'clm_offline')+'><td><span class=nick>'+m[i+1]+' ('+m[i+2]+m[i+3]
        +')</span><br /><span class=location>'+m[i+4]+' ('+m[i+5]+','+m[i+6]+')</span><td>'
        +(isset(g.clan.ranks[m[i+7]])?g.clan.ranks[m[i+7]].name:'')
        +'<td class=status>'+((m[i+8]=='online' || m[i+8]=='offline')?m[i+8]:_t('offline_from %time%', {'%time%':calculateDiff(parseInt(m[i+8]))}, 'clan')) //'offline <br />od '+
        +'<td class=gg>'+((m[i+9]=='0')?'-':('<a href="gg:'+m[i+9]+'" title='+m[i+9]+'>gg</a>'));
        if(edit) {
            txt+='<td class=edit style="padding:1px">';
            if(m[i+7]<hero.clanrank)txt+='<button onclick="clMemberEdit('+i+')" tip="'+_t('clan_e_info', null, 'clan')+'">E</button>'; //Edycja rangi<br>i wyrzucanie
        }
    }
    $('#clanbox').html(g.clan.logoimg
    +'<center><table class=members><tr><th>'+_t('th_nick', null, 'clan')+'<th>'+_t('th_rank', null, 'clan')+'<th>'+_t('th_status', null, 'clan')+'<th>gg' //Nick i lokacja //Ranga //Status
    +(edit?'<th>':'')
    +txt+'</table></center>');
    g.clan.fn=clanMembers;
}
*/
function clGoldIn() {
    var amount = parsePrice($('#cl_gold').val())
    let formAmount = formNumberToNumbersGroup(amount);
    mAlert(_t('gold_deposit_confirm %amount%', {'%amount%':formAmount}, 'clan'), //'Czy na pewno chcesz wpÅaciÄ <b>'+amount+'</b> zÅota do skarbca ?'
        1, [function(){_g('clan&a=save&f=gold&v='+amount)},function(){}]);
}
function clGoldOut() {
    var amount = parsePrice($('#cl_gold').val()?$('#cl_gold').val():0)

    //'Czy na pewno chcesz wypÅaciÄ <b>'+round(amount,10)+'</b> zÅota graczowi <b>'+$("#cl_goldout option[value='"+$('#cl_goldout').val()+"']").text()+'</b> ?'
    mAlert(_t('gold_widthdraw %amount% %player%', {'%amount%':round(amount,10), '%player%':$("#cl_goldout option[value='"+$('#cl_goldout').val()+"']").text()}, 'clan'),
        1, [function(){_g('clan&a=save&f=gold&v=-'+parsePrice(amount)+'&pid='+$('#cl_goldout').val())},function(){}]);

}
function clCreditsIn() {
    var cram=$('#cl_credits').val();
    /**
     *'Czy jesteÅ pewny, Å¼e chcesz wpÅaciÄ <b>'+cram+' SÅ do skarbca?</b> '
     +'Ze&nbsp;skarbca nie moÅ¼na wypÅacaÄ SÅ, wiÄc jeÅli nie zostanÄ wydane, przepadnÄ po rozwiÄzaniu klanu.'
     */
    mAlert(_t('credits_in %amount%', {'%amount%':cram}, 'clan'),
        1, [function(){
            _g('clan&a=save&f=credits&v='+cram)
        },function(){}]);
}
function clanTreasury()
{
    var hist=[],k=0;
    ;
    for(var i in g.clan.goldlog)
        if((k<6) && (g.clan.goldlog[i].kind=='gold'||g.clan.goldlog[i].kind=='credit')) {
            var h=g.clan.goldlog[i].txt.split(']');
            hist[k]=h.slice(1).join(']');
            k++;
        }
    var t=g.clan.logoimg+"<div class=treasury><h2>"+_t('treasury_manage', null, 'clan')+"</h2><table><tr><td>"+_t('gold_amount %amount%', {'%amount%':round(g.clan.gold,10)}, 'clan') //Skarbiec //"ZÅoto: "+round(g.clan.gold,10)
        +"<br>"+_t('gold_cl', null, 'clan')+"<input id=cl_gold><button onclick=clGoldIn()>"+_t('put_gold', null, 'clan')+"</button><br>"; //ZÅoto: , WpÅaÄ
    if(g.clan.myrank&4) t+='<select id=cl_goldout>'+g.clan.mlist+'</select><button onclick=clGoldOut()>'+_t('give_gold %amount%', {'%amount%':g.clan.credits}, 'clan')+'</button><br>'; //WypÅaÄ
    t+="<td>"+_t('slamount %amount%', {'%amount%':g.clan.credits}, 'clan')+"<br>"; //Smocze Åzy: "+g.clan.credits+
    if(g.clan.bits&1) t+=_t('put_sl', null, 'clan')+'<input id=cl_credits><button onclick=clCreditsIn()>'+_t('put_sl_in', null, 'clan')+'</button><br>' //WpÅaÄ SÅ:
    +((g.clan.myrank&1)?'<button onclick=_g("clan&a=credits&allow=0")>'+_t('put_sl_off', null, 'clan')+'</button><br>':''); //WyÅÄcz wpÅacanie SÅ
    else t+=_t('put_sl_turnedoff')+'<br>' //WpÅacanie SÅ zablokowane.
    +((g.clan.myrank&1)?'<button onclick=_g("clan&a=credits&allow=1")>'+_t('put_sl_on', null, 'clan')+'</button><br>':''); //UdostÄpnij skarbiec SÅ
    t+="</table>";
    if(g.clan.bits&2) t+=_t('outfit_available', null, 'clan')+'<button onclick=_g("clan&a=wear")>'+_t('use_outfit', null, 'clan')+'</button><br>' // StrÃ³j klanowy dostÄpny.  //Ubierz siÄ
    else t+=_t('outfit_notavailable', null, 'clan')+'<br>'; //StrÃ³j klanowy nie jest dostÄpny.
    var clvl=(g.clan.bits>>2)&7;
    //t+='<div style="padding:2px; margin:4px; background:beige; width:100%;"><b style="padding-right:30px;line-height:30px;">'+_t('clan_rank %lvl% %exp%', {'%lvl%':clvl, '%exp%':(clvl*3)}, 'clan')+'</b>'; //'Ranga klanu: '+clvl+'/5 (+'+(clvl*3)+'% exp) '
    //if(clvl<5)
     //   t+='<div style="width: 250px;float:right;"><button style="margin:7px 5px 0px 0px;"onclick="$(\'#depoUpgradeConfirmBox\').toggle(); return false;">'+_t('show_clan_upg_opts', null, 'clan')+'</button>'; //'PokaÅ¼ opcje ulepszenia klanu
    //'Koszt ulepszenia:<br /><span style="color:red">'+round(g.clan.upg_gold,10)+' zÅ '+(g.clan.upg_cr?('+'+g.clan.upg_cr+' SÅ'):'')</span>
    //Kliknij aby ulepszyÄ klan.
    //Potwierdzam!
    t+='<div style="background-color:beige;border:1px solid #000;position:absolute;padding:3px;display:none" id="depoUpgradeConfirmBox">'+_t('upg_cost %gold% %sl%', {'%gold%':round(g.clan.upg_gold,10),'%sl%':(g.clan.upg_cr?('+'+g.clan.upg_cr+_t('sl', null, 'clan')):'')})+'<br /><button tip="'+_t('click_to_upg', null, 'clan')+'" onclick="_g(\'clan&a=upgrade\'); return false;">'+_t('upg_confirm', null, 'clan')+'</button></div></div></div>';

    let $html = $(t+hist.join('<br>')+"</div>");
    setLogoInClan($html);

    //$('#clanbox').html(t+hist.join('<br>')+"</div>");
    $('#clanbox').html($html);
    g.clan.fn=clanTreasury;
}

function clInvite() {
    _g('clan&a=invite&n='+$('#cl_invite').val());
}
function clDrop() {
    _g('clan&a=member&dismiss=1&id='+$('#cl_drop').val());
}
function clRename() {
    _g('clan&a=save&f=name&v='+esc($('#cl_name').val())+(parseInt($('#cl_payself').val())?'&pay=self':''));
}
function clDisband() {
    if(g.clan.gold>0) {
        //"Skarbiec klanowy nie jest pusty,<br>rozwiÄzujÄc klan stracisz jego zawartoÅÄ."
        mAlert(_t('disband_gold_info', null, 'clan'),1,
            [function(){
                _g('clan&a=disband&agree='+$('#cl_disband').val());
            },
                function(){}]);
    }
    else _g('clan&a=disband&agree='+$('#cl_disband').val());
}
function clLeave() {
  const v = $('#cl_leave').val();
    _g('clan&a=leave&agree=' + v, function(e) {
        if (v === 'OK') {
            $('.clan').css('display', 'none');
            $('#clanmenu>.boxhover>li.to-disable').addClass('disabled');
            delete hero.clan;
            g.clan = 0;
        }
    });
}
function clSaveLogo() {
    var val = $('#cl_logo').val();
    if (val !== '') {
        _g('clan&a=save&f=logo&v='+val);
    } else {
        mAlert(_t('https_alert', null, 'clan'));
    }
}
function checkHttps(url) {
    var pattern = /^(https)/;
    return pattern.test(url);
}
function htmlRank(name,id,rid)
{
    return '<b><label for=cl_rank'+rid+'>'+name+':</label> <input id=cl_rank'+rid
        +((g.clan.ranks[id].r&rid)?' checked':'')+' type=checkbox></b>'
}
function printRankSelect(max, val, firstPostfix){
    var tt = '';
    for(var i=0; i<=max; i++){
        tt += '<option '+(i==val?'selected="selected"':'')+' value="'+i+'">'+i+(isset(firstPostfix) && i == 0 ? ' '+firstPostfix : "")+'</option>';
    }
    return tt;
}
function clRankSave(id)
{
    var r=0, nid=$('#cl_rankid').val();
    for(var i=1; i<12; i++){
        if(i<9){
            if($('#cl_rank'+Math.pow(2,i)+':checked').val()=='on') r+=Math.pow(2,i);
        }else{
            var val = 0;
            switch(i){
                case 9:r += $('#dt').val()<<9 ;break;
                case 10:r += $('#du').val()<<12 ;break;
                case 11:r += $('#dl').val()<<15 ;break;
            }
        }
    }
    _g('clan&a=rank&a2=edit&rid='+id+'&name='+esc($('#cl_rankname').val())+'&r='+r
    +((isset(nid)&&id!=nid)?('&nrid='+nid):''));
}
function clRankDel(id)
{
    mAlert(_t('confirm_rank_delete', null, 'clan'),1,[function(){
        _g('clan&a=rank&a2=del&rid='+id)
    },function(){}])
}
function clRankEdit(id)
{
    var t=g.clan.logoimg+'<div style="margin:10px; line-height:130%"><h2>'+_t('edit_rank %name%', {'%name%':g.clan.ranks[id].name}, 'clan')+'</h2><br><center>';
    if(id<100) t+='<div class=rankedit>'
    +htmlRank(_t('rank_rEdit', null, 'clan'),id,2)+htmlRank(_t('rank_treasury', null, 'clan'),id,4) //'Nadawanie rang', 'Skarbnik'
    +htmlRank(_t('rank_inviting', null, 'clan'),id,8)+htmlRank(_t('rank_dismiss', null, 'clan'),id,16) //'Zapraszanie', 'Wyrzucanie'
    +htmlRank(_t('rank_privatepage', null, 'clan'),id,32)+htmlRank(_t('rank_officialpage', null, 'clan'),id,64) //'Strona prywatna', 'Strona oficjalna'
    +htmlRank(_t('rank_diplomate', null, 'clan'),id,128)+htmlRank(_t('rank_outfit', null, 'clan'),id,256) //'Dyplomata', 'StrÃ³j klanowy'
        //Dostepne zakÅadki (0-5, 0-nie moÅ¼na korzystaÄ z depozytu)
        //PrzeglÄdanie depozytu[?]:
        //IloÅÄ widocznych zakÅadek nie moÅ¼e byÄ mniejsza niÅ¼ iloÅÄ zakÅadek, ktÃ³rych moÅ¼na uÅ¼ywaÄ.
    +'<b><label tip="'+_t('rank_tabs_view_tip', null, 'clan')+'" for="dt">'+_t('rank_tabs_view', null, 'clan')+'</label><select onchange="if($(this).val()<$(\'#du\').val()){$(this).val($(\'#du\').val());mAlert(\''+_t('rank_tabs_view_info', null, 'clan')+'\')}"class=txt id="dt">'+printRankSelect(5, ((g.clan.ranks[id].r&(0x200+0x400+0x800))>>9), _t('tabs_view no_access', null, 'clan'))+'</select></b>' //'- brak dostÄpu'
        //DostÄpne zakÅadki (0-5, 0-nie moÅ¼na uzywaÄ)
        //UÅ¼ywanie depozytu[?]:
    +'<b><label tip="'+_t('rank_tabs_usage_tip', null, 'clan')+'" for="du">'+_t('rank_tabs_usage', null, 'clan')+'</label><select onchange="if($(\'#dt\').val()<$(this).val())$(\'#dt\').val($(this).val())" class=txt id="du">'+printRankSelect(5, ((g.clan.ranks[id].r&(0x1000+0x2000+0x4000))>>12), _t('tabs_view no_usage', null, 'clan'))+'</select></b>' //'- nie moÅ¼na uÅ¼ywaÄ'
        //Limit przedmiotÃ³w na dzieÅ moÅ¼liwych do wyjÄcia z depozytu (0-3, 0-brak limitu)
        //Limit depozytu[?]:
    +'<b><label tip="'+_t('rank_tabs_itemlimit_tip', null, 'clan')+'" for="dl">'+_t('rank_tabs_itemlimit', null, 'clan')+'</label><select class=txt id="dl">'+printRankSelect(3, ((g.clan.ranks[id].r&(0x8000+0x10000))>>15), _t('tabs_view no_limit', null, 'clan'))+'</select></b>' //'- bez limitu'
    +'</div>';
    t+='<b>'+_t('rank_name', null, 'clan')+'</b><input id="cl_rankname" value="'+g.clan.ranks[id].name+'"><br>'; //Nazwa rangi:
    if(id && id<100) t+='<b>ID rangi (1-99):</b><input id="cl_rankid" value="'+id+'" size=2><br>';
    t+='<br><big>' + (id != 100 ? '<button onclick="clRankDel('+id+')">' +_t('rank_del', null, 'clan')+'</button>' :  '') + '<button onclick="g.clan.fn()">'+_t('rank_cancel', null, 'clan')+'</button>' //UsuÅ, Anuluj
    +' <button onclick=clRankSave('+id+')>'+_t('rank_save', null, 'clan')+'</button></big></center>'; //Zapisz

    let $html = $(t+'</div>');
    setLogoInClan($html);

    //$('#clanbox').html(t+'</div>');
    $('#clanbox').html($html);

    $('#cl_rankid').mask('00');
}
function clAddNewRank()
{
    _g('clan&a=rank&a2=add&rid='+$('#cl_newr_id').val()+'&name='+esc($('#cl_newr_name').val())+'&r=0')
}
function clanManage()
{
    var t=g.clan.logoimg+'<div style="margin:10px; line-height:1.5"><h2>'+_t('clan_manage_header', null, 'clan')+'</h2>'; //ZarzÄdzanie klanem
    //if(g.clan.myrank&16) t+='<select id=cl_drop>'+g.clan.mlist+'<button onclick=clDrop()>WyrzuÄ z klanu</button><br>';
    if(g.clan.myrank&1) t+=_t('clan_name_change', null, 'clan')+'<input id=cl_name><select id=cl_payself><option value=0>'+_t('clan_sl', null, 'clan')+'</option>' //Zmien nazwÄ klanu (15SÅ):, SÅ klanowe
    +'<option value=1>'+_t('private_sl', null, 'clan')+'</option></select><button onclick=clRename()>'+_t('cl_name_save', null, 'clan')+'</button><br>' //SÅ prywatne, ZmieÅ
    +_t('logo_url', null, 'clan')+'<input id=cl_logo style="width:260px" value="'+htmlspecialchars(g.clan.logo)+'"><button onclick=clSaveLogo()>'+_t('logo_save', null, 'clan')+'</button>' //Logo (peÅny adres http):, Zapisz
    +_t('ok_to_confirm', null, 'clan')+'<input size=2 id=cl_disband><button onclick=clDisband()>'+_t('clan_resolve', null, 'clan')+'</button> '; //'Wpisz OK:, RozwiÄÅ¼ klan
    else t+=_t('ok_to_confirm', null, 'clan')+'<input size=2 id=cl_leave><button onclick=clLeave()>'+_t('clan_leave', null, 'clan')+'</button> '; //'Wpisz OK:, OpuÅÄ klan
    //if(g.clan.myrank&8) t+='<input id=cl_invite><button onclick=clInvite()>'+_t('clan_invite_new', null, 'clan')+'</button><br>'; //ZaproÅ do klanu
    //if(g.clan.myrank&32) t+='<button onclick=clEditPriv()>'+_t('clan_edit_privpage', null, 'clan')+'</button> '; //Edytuj prywatnÄ stronÄ
    //if(g.clan.myrank&64) t+='<button onclick=clEditMain()>'+_t('clan_edit_mainpage', null, 'clan')+'</button>'; //s
    if(g.clan.myrank&96) t+='<br>';
    t+="<table class='members rankstable'><tr><th>ID<th>"+_t('rank_th', null, 'clan')/*Ranga*/
    +"<th tip='"+_t('creator_th', null, 'clan')+"'><div class=\"clr_ico founder\"></div>"//+_t('founder', null, 'clan_right_short')
    +"<th tip='"+_t('rEdit_th', null, 'clan')+"'><div class=\"clr_ico rank_edit\"></div>"//+_t('rank_edit', null, 'clan_right_short')
    +"<th tip='"+_t('gold_th', null, 'clan')+"'><div class=\"clr_ico treasury_ico\"></div>"//+_t('treasury', null, 'clan_right_short')
    +"<th tip='"+_t('invit_th', null, 'clan')+"'><div class=\"clr_ico g_invite\"></div>"//+_t('g_invite', null, 'clan_right_short')
    +"<th tip='"+_t('dismiss_th', null, 'clan')+"'><div class=\"clr_ico g_expel\"></div>"//+_t('g_expel', null, 'clan_right_short')
    +"<th tip='"+_t('privedit_th', null, 'clan')+"'><div class=\"clr_ico private_edit\"></div>"//+_t('private_edit', null, 'clan_right_short')
    +"<th tip='"+_t('mainedit_th', null, 'clan')+"'><div class=\"clr_ico official_edit\"></div>"//+_t('official_edit', null, 'clan_right_short')
    +"<th tip='"+_t('diplom_th', null, 'clan')+"'><div class=\"clr_ico diplomat\"></div>"//+_t('diplomat', null, 'clan_right_short')
    +"<th tip='"+_t('outUse_th', null, 'clan')+"'><div class=\"clr_ico g_outfit\"></div>"//+_t('g_outfit', null, 'clan_right_short')
    +"<th tip='"+_t('tabview_th', null, 'clan')+"'><div class=\"clr_ico depo_tabs_view\"></div>"//+_t('depo_tabs_view', null, 'clan_right_short')
    +"<th tip='"+_t('tabuse_th', null, 'clan')+"'><div class=\"clr_ico depo_tabs_access\"></div>"//+_t('depo_tabs_access', null, 'clan_right_short')
    +"<th tip='"+_t('tablimit_th', null, 'clan')+"'><div class=\"clr_ico depo_tabs_withdraw\"></div>"//+_t('depo_tabs_withdraw', null, 'clan_right_short')
    var re=g.clan.myrank&1; // rankedit
    if(re)t+='<th width=50>';
    var t2='';
    for(var k in g.clan.ranks) {
        var tt='<tr class=cen><td width=30>'+k+'<td class=left>'+g.clan.ranks[k].name;
        for(var i=0; i<12; i++){
            if(i<9){
                tt+='<td>'+((g.clan.ranks[k].r&Math.pow(2,i))?'â':'-');
            }else{
                var val = 0;
                switch(i){
                    case 9:val = (g.clan.ranks[k].r&(0x200+0x400+0x800))>>9;break;
                    case 10:val = (g.clan.ranks[k].r&(0x1000+0x2000+0x4000))>>12;break;
                    case 11:val = (g.clan.ranks[k].r&(0x8000+0x10000))>>15;break;
                }
                tt+='<td>'+((val)?val:'-');
            }
        }
        if(re) tt+='<td><button onclick=clRankEdit('+k+')>'+_t('redit_td', null, 'clan')+'</button>'; //Edytuj
        t2=tt+t2;
    }
    t+=t2;
    if(re) t+='<tr><td><input size=2 id=cl_newr_id><td><input id=cl_newr_name><td colspan=13><button onclick=clAddNewRank()>'+_t('add_new_rank', null, 'clan')+'</button>'; //Dodaj nowÄ rangÄ
    t+='</table>';

    let $html = $(t+'</div>');
    setLogoInClan($html);


    //$('#clanbox').html(t+'</div>');
    $('#clanbox').html($html);
    g.clan.fn=clanManage;
}
//function clSavePriv() { _g('clan&a=save&f=info&v='+esc($('#cl_priv').val())); }
function clSavePriv() {
    _g('clan&a=save&f=info',false, {
        v:$('#cl_priv').val()
    });
}

function clEditPriv() {
    $('#clanbox').html(
      '<div style="margin:10px;"><h2>'+
      _t('private_page', null, 'clan')+
      '</h2><center><textarea class=cl_edit id=cl_priv>'+ //Strona prywatna
        escapeHTML(g.clan.info)+
      '</textarea><br>'+

      '<button onclick=clSavePriveteMain()>'+
      _t('privPage_save', null, 'clan')+
      '</button>' +

      '<button onclick=g.clan.fn()>'+
      _t('privPage_cancel', null, 'clan')+
      '</button></center></div>'); //Zapisz, Anuluj
}
//function clSaveMain() { _g('clan&a=save&f=official&v='+esc($('#cl_main').val())); }
function clSavePriveteMain() {
    _g('clan&a=save&f=info', false, {
        v:$('#cl_priv').val()
    });
}
function clSaveOfficialMain() {
    _g('clan&a=save&f=official', false, {
        v: $('#cl_main').val()
    });
}
function clEditMain() {
    $('#clanbox').html('<div style="margin:10px;"><h2>'+_t('main_page', null, 'clan')+'</h2><center><textarea class=cl_edit id=cl_main>' //Strona oficjalna
    +escapeHTML(g.clan.official)+'</textarea><br>'+
      '<button onclick=clSaveOfficialMain()>'+_t('privPage_save')+'</button>'+
      '<button onclick=g.clan.fn()>'+_t('privPage_cancel', null, 'clan')+'</button></center></div>'); //Zapisz
}
function clDelFr(n)
{
    //'Na pewno chcesz anulowaÄ ten sojusz?'
    mAlert(_t('cancel_alignment', null, 'clan'),2,[function(){
        _g('clan&a=dipl&id='+n+'&op=cancel_a')
    },function(){}])
}
function clDelEn(n)
{
    //'Na pewno chcesz anulowaÄ tÄ wojnÄ?'
    mAlert(_t('cancel_war', null, 'clan'),2,[function(){
        _g('clan&a=dipl&id='+n+'&op=cancel_e')
    },function(){}])
}
function clNewFr() {
    _g('clan&a=dipl&name='+esc($('#clan_fr').val())+'&op=ally')
}
function clNewEn() {
    _g('clan&a=dipl&name='+esc($('#clan_en').val())+'&op=enemy')
}
function clanDiplomacy()
{
    //Dyplomacja klanu '+g.clan.name+'
    var t=g.clan.logoimg+'<h2>'+_t('clan_diplomacy_header %name%', {'%name%':escapeHTML(g.clan.name)}, 'clan')+'</h2><div style="margin:10px;">';
    var dipl=g.clan.myrank&128;
    t+='<table class=members><tr><th>'+_t('friend_clans', null, 'clan')+'<th width=50><th width=50><th width=50>'+_t('clan_power', null, 'clan')+'<th width=50>'+_t('plrs_amount', null, 'clan')+(dipl?'<th width=25>':''); //Przyjazne klany, Moc, Graczy
    for(var i=0; i<g.clan.fr.length; i+=4)
        t+='<tr><td colspan=3>'+escapeHTML(g.clan.fr[i+1])+'<td>'+g.clan.fr[i+2]+'<td>'+g.clan.fr[i+3]
        +(dipl?('<td><button onclick=clDelFr('+g.clan.fr[i]+') tip="'+_t('cl_del', null, 'clan')+'">X</button>'):''); //UsuÅ
    t+='<tr><td colspan=6>'+_t('new_alignment', null, 'clan')+'<input id=clan_fr><button onclick=clNewFr()>'+_t('inviteClan', null, 'clan')+'</button>'; //Nowy sojusz:, ZaproÅ
    t+='<tr><th>'+_t('enemy_clans', null, 'clan')+'<th>'+_t('clan_wins', null, 'clan')/*Wygr.*/+'<th>'+_t('clan_losts', null, 'clan')/*Przegr.*/+'<th>'+_t('clan_power', null, 'clan')+'<th>'+_t('plrs_amount', null, 'clan')+''+(dipl?'<th>':''); //Wrogie klany
    for(var i=0; i<g.clan.en.length; i+=6)
        t+='<tr><td>'+escapeHTML(g.clan.en[i+3])+'<td class=cen>'+g.clan.en[i+1]+'<td class=cen>'+g.clan.en[i+2]
        +'<td>'+g.clan.en[i+4]+'<td>'+g.clan.en[i+5]
        +(dipl?('<td><button onclick=clDelEn('+g.clan.en[i]+') tip="'+_t('cl_del', null, 'clan')+'">X</button>'):'');
    t+='<tr><td colspan=6>'+_t('new_enemy', null, 'clan')+'<input id=clan_en><button onclick=clNewEn()>'+_t('addClan', null, 'clan')+'</button>';

    let $html = $(t+'</table></div>');
    setLogoInClan($html);

    //$('#clanbox').html(t+'</table></div>');
    $('#clanbox').html($html);
    g.clan.fn=clanDiplomacy;
}
function clanHistory(depo)
{
    depo = isset(depo) && depo ? true : false;
    var hist=[];
    var r = new RegExp('depozyt zakÅ|z depozytu|do depozytu,', 'gi');
    for(var i in g.clan.goldlog){
        if(!isset(g.clan.goldlog[i].txt)) continue;
        if((!depo && !g.clan.goldlog[i].txt.match(r)) || depo) hist[i]='<div class="histRow">'+g.clan.goldlog[i].txt+'</div>';
    }
    $('#clanbox').html('<div class=history><h2>'+_t('clan_ops_histry', null, 'clan')+'</h2><div class="depohist_filter"><span class="'+(depo?'active':'')+'" onclick="clanHistory(true)">'+_t('hist_filter_depo', null, 'clan')+'</span><span class="'+(depo?'':'active')+'" onclick="clanHistory(false)">'+_t('hist_filter_nodepo', null, 'clan')+'</span></div>'+hist.join('')+'</div>'); //Historia operacji klanowych<
    g.clan.fn=clanHistory;
}

/************************ Sync Request */
function moveItemSafe(id, cmd) {
	if(isset(g.item[id]) && g.item[id].readyToAction) {
		g.item[id].readyToAction = false;
		if(cmd != "") cmd = "&"+cmd;


      let itemHasStatToBlockHeroMove = checkItemHasStatToBlockHeroMove(id);
      if (itemHasStatToBlockHeroMove) g.lock.add('item_block_move');

      _g("moveitem&id="+id+cmd, function(data) {

          if (itemHasStatToBlockHeroMove) g.lock.remove('item_block_move');

			if(isset(g.item[id])) {
				g.item[id].readyToAction = true;
			}
            if (isset(data['alert'])) return;
            // var aPatt = new RegExp("animation");
            // var rPatt = new RegExp("recipe");
            let itemStats             = parseItemStat(g.item[id].stat);
            let animationStatExist    = isset(itemStats.animation);

            // if (aPatt.test(g.item[id].stat)) g.chestAnimation = true;
            // if (aPatt.test(g.item[id].stat)) g.chestAnimation = true;
            if (animationStatExist) g.chestAnimation = true;
            //if (rPatt.test(g.item[id].stat)) _g("craft&a=list");
		});
	}
}


function checkItemHasStatToBlockHeroMove (id) {
    let stat = parseItemStat(g.item[id].stat);
    if (!stat.hasOwnProperty('action')) return false;

    let action = stat.action;

    if (action.search('shop') > -1) return true;

    switch (action) {
        case 'deposit':
        case 'mail':
        case 'auction':
        case 'clandeposit':
            return true;
        default:
          return false;
    }
}


function oncePerRequest(th, cmd) {
    $(th).removeAttr("onclick").unbind("click");
    var enable = true;
    if(enable) {
        enable = false;
        _g(cmd, function() {
            enable = true;
        });
    }
}

/************************* RECIPE */
function initRecipes (data) {

}

/************************* AUCTIONS */
function ah_item(id)
{
    g.ah.even=!g.ah.even;
    const itemStats       = parseItemStat(g.item[id].stat);
    let amountStatExist   = isset(itemStats.amount);

    var it=g.item[id], cl='', lvl='';
    if(isset(itemStats.unique)) cl="class=unique";
    if(isset(itemStats.heroic)) cl="class=heroic";
    if(isset(itemStats.legendary)) cl="class=legendary";
    if(isset(itemStats.artefact))  cl="class=artefact";
    if(isset(itemStats.lvl)) {
        lvl=' ('+itemStats.lvl+')';
    }
    // var match=it.stat.match(/(amount)=([0-9]+)/);
    var small = '';
    // if (match && parseInt(match[2])>0 && it.st!=10){
    if (amountStatExist && parseInt(itemStats.amount)>0 && it.st!=10){
        // small = '<small style="opacity:0.5">'+match[2]+'</small>';
        small = '<small style="opacity:0.5">'+itemStats.amount+'</small>';
    }

    $(document).on('click', '.ahitem #item'+id, function(e) {
        if (isset(itemStats.canpreview)) {
            var fun = '_g("moveitem&st=2&tpl=' + it.tpl + '"); g.tplsManager.deleteMessItemsByLoc("p");g.tplsManager.deleteMessItemsByLoc("s");';
            showMenu(
                e,
                [
                    [_t('show', null, 'item'), fun, true]
                ]
            );
        }
    });

    var $item = createItem(it);
    $item.append(small);
    $item.css('background-image', `url("${CFG.ipath}${it.icon}")`);
    const row = `
        <tr ${(g.ah.even?'':' class="even"')}>
            <td style="text-align:left">
                <div class="ahitem">${$item[0].outerHTML}</div>
            </td>
            <td style="text-align:left" ${cl}>${it.name}${lvl}<td>
    `;
    return row;
}
function ah_time()
{
    $('.ah_time').each(function(){
        var $t=$(this), tm=parseInt($t.attr('timer'));
        if(tm<1) $t.html(_t('auction_ended', null, 'auction')).prev().html('-').prev().html('-'); //Aukcja<br>zakoÅczona
        else {
            $t.attr('timer',tm-1);
            var t=[Math.floor(tm/3600),Math.floor(tm/60)%60,tm%60];
            if(tm<3600) $t.html(t[1]+'m'+t[2]+'s');
            else $t.html(t[0]+'h'+t[1]+'m');
        }
    });
}
function auctionsHide()
{
    if(g.ah.timer) {
        clearInterval(g.ah.timer);
        g.ah.timer=0;
    }
    g.ah.opened = false;
    $('#auctions').fadeOut();
    g.lock.remove('auctions');
}
function ah_pr(p, yes, no, force_sl)
{
    if(p==0) return no;
    if(force_sl) return '<b style="color:red">'+round(p,3)+_t('sl')+'</b>'+yes;
    return round(p,3)+yes;
}
function ah_sort_time(tab) {
	var ret = [];
	for(var t in tab) {
		var obj = tab[t];
		obj.id = t;
		ret.push(obj);
	}
	ret.sort(function(a, b){
		return a.time - b.time;
	});
	return ret;
}
function auctionShow(myah, mybids)
{
    g.ah.opened = true;
    g.lock.add('auctions');
    var retry = false;
    for(var t in myah) {
      if(!isset(g.item[t])) {
        retry = true;
        break;
      }
    }
    for(var t in mybids) {
      if(!isset(g.item[t])) {
        retry = true;
        break;
      }
    }
    if(retry) {
        setTimeout(function(){
            auctionShow(myah,mybids)
        },100);
        return;
    }
    $('#ahselect B').removeClass('selected');
    $('#ahselect B:first').addClass('selected');
    $('#ah_item, #ah_item-s').empty();
    $('#ah_new, #ah_new-s, #ah_list').hide();
    $('#ah_window').show();
    /*
     *  'Koszt wystawienia przedmiotu wynosi '+Math.max(100,hero.lvl*10)
     +' zÅota, a po jego sprzedaÅ¼y pobierane jest 10% podatku. Zamiast pisaÄ 1000 moÅ¼esz napisaÄ 1k (tysiÄc)'
     +' lub&nbsp;analogicznie: 1m (milion), 1g (miliard).'
     **/
    $('#ah_new SMALL').html(_t('auction_cost %cost%', {'%cost%': Math.max(100,getHeroLevel()*10)}, 'auction'));
    // bidder (0=nie ma, 1=jakiÅ jest, 2=bieÅ¼Äcy player to bidder tego itemka
    var myitems=[];
    myah = ah_sort_time(myah);
    for(var i in myah){
      var obj = myah[i];
      if(isset(g.item[obj.id])) {
          myitems.push(ah_item_row_mod(obj, 1));
      } else log("AuctionItem#"+obj.id+" not found.",1);
    }
    var mybs=[];
    mybids = ah_sort_time(mybids);
    for(var i in mybids){
      var obj = mybids[i];
      if(isset(g.item[obj.id])) {
          mybs.push(ah_item_row_mod(obj, 2));
      } else log("AuctionItem#"+obj.id+" not found.",1);
    }
    $('#ah_mylist').html('<h5></h5><table><tr><th width=30>'+_t('item_th', null, 'auction')+'</th><th>'+_t('name_th', null, 'auction')+'</th><th>'+_t('price_th', null, 'auction')+'</th>' //Item, Nazwa, Cena
    +'<th>'+_t('price_buynow_th', null, 'auction')+'</th><th width=50>'+_t('endat_th', null, 'auction')+'</th><th>'+_t('offer_th', null, 'auction')+''+myitems.join('')+'</th></tr>' //Cena kup teraz, Koniec, Oferta
    +'</table><h5 class=bids></h5><table><tr><th width=30>'+_t('item_th', null, 'auction')+'</th><th>'+_t('name_th', null, 'auction')+'</th><th>'+_t('price_th', null, 'auction')+'</th>' //Nazwa
    +'<th>'+_t('price_buynow_th', null, 'auction')+'</th><th width=50>'+_t('endat_th', null, 'auction')+mybs.join('')+'</th></tr></table>');
    if(!g.ah.timer) g.ah.timer=setInterval(ah_time,1000);
    $('#auctions').fadeIn();
}
function ah_bid(id)
{ /*
 *  '<center>Czy na pewno chcesz licytowaÄ przedmiot<br><b>'+g.item[id].name+'</b><br>za '
 +round(parsePrice($('#bid'+id).val()),3)+' zÅota?</center>'
 */
    var val = Math.abs(parsePrice($('#bid'+id).val()));
    mAlert(_t('item_confirm_au %name% %val%', {'%name%':g.item[id].name,'%price%':round(val,10)}, 'auction'), 1, [function(){
        _g('ah&bid='+id+'&price='+val
        +'&cat='+g.ah.cat+'&page='+g.ah.page+'&filter='+g.ah.filter.join('|'));
    },function(){}])
}
function ah_bid_credits(id)
{ /*
 *  '<center>Czy na pewno chcesz licytowaÄ przedmiot<br><b>'+g.item[id].name+'</b><br>za '
 +round(parsePrice($('#bid'+id).val()),3)+' zÅota?</center>'
 */
    mAlert(_t('item_confirm_au_sl %name% %val%', {'%name%':g.item[id].name,'%price%':round(parsePrice($('#bid'+id).val()),3)}, 'auction'), 1, [function(){
        _g('ah&bid='+id+'&price='+parsePrice($('#bid'+id).val())
        +'&cat='+g.ah.cat+'&page='+g.ah.page+'&filter='+g.ah.filter.join('|'));
    },function(){}])
}
function ah_bo_g(id, priceG)
{
    //'<center>Czy na pewno chcesz kupiÄ przedmiot<br><b>'+g.item[id].name+'</b> ?</center>'
    mAlert(_t('item_confirm_buynow %name% %price%', {
            '%name%':g.item[id].name,
            '%price%': formNumberToNumbersGroup(priceG)
        }, 'auction'), 1,
        [function(){
            _g('ah&bo='+id+'&cat='+g.ah.cat+'&page='+g.ah.page
            +'&filter='+g.ah.filter.join('|'));
        }, function(){}])
}
function ah_bo_sl(id, priceSl)
{
    //'<center>Czy na pewno chcesz kupiÄ przedmiot<br><b>'+g.item[id].name+'</b> ?</center>'
    mAlert(_t('item_confirm_buynow_sl %name% %price%', {
            '%name%':g.item[id].name,
            '%price%': formNumberToNumbersGroup(priceSl)
        }, 'auction'), 1,
        [function(){
            _g('ah&bo='+id+'&cat='+g.ah.cat+'&page='+g.ah.page
                +'&filter='+g.ah.filter.join('|'));
        }, function(){}])
}
function ah_bo_sl_g(id, priceG, priceSl)
{
    //'<center>Czy na pewno chcesz kupiÄ przedmiot<br><b>'+g.item[id].name+'</b> ?</center>'
    mAlert(_t('item_confirm_buynow_sl_gold %name% %price% %price2%', {
            '%name%':g.item[id].name,
            '%price%': formNumberToNumbersGroup(priceSl),
            '%price2%': formNumberToNumbersGroup(priceG)
        }, 'auction'), 1,
        [function(){
            _g('ah&bo='+id+'&cat='+g.ah.cat+'&page='+g.ah.page
                +'&filter='+g.ah.filter.join('|'));
        }, function(){}])
}
function ah_checkbid(id,pr,cl)
{
    if(!cl) cl = "bid";
    var $b=$('#bid'+id);
    $b.nextAll('button').attr('class',(parsePrice($b.val())>=Math.round(pr*1.1)?'':'no')+cl);
}
function ah_price_node(id, val, bidder, cl) {
    var val2 = ah_pr(val,'','-');
    var ret = '<input value="'+val2+'" style="width:50px" id=bid'+id;
    if(bidder) {
        ret += ' onkeyup=ah_checkbid('+id+','+val+',"'+cl+'")';
    }
    ret += '><br><button onclick=ah_'+cl+'('+id+') class=';
    if(!bidder) {
        ret += cl;
    } else {
        var str = _t('minimal_offer %val%', {'%val%':round(Math.round(val*1.1),10)}, 'auction');
        ret += 'no'+cl+' tip="'+str+'"';
    }
    ret += '></button>';
    return ret;
}
function ah_recordHolder (id) {

}

function ah_item_row_mod(obj, type){
    var price = "-";
    var buyout = "-";
    var toEnd = "-";
    var bidder = 0;
    if(isset(obj.bidder)) {
      bidder = obj.bidder;
    }
    if(type === null) {
      if(isset(obj.bid_c)) {
          price = ah_price_node(obj.id, obj.bid_c, bidder!=0, "bid_credits");
      } else if(isset(obj.bid_g)) {
          price = ah_price_node(obj.id, obj.bid_g, bidder!=0, "bid");
      }
    } else {
      if(isset(obj.bid_c)) {
          price = ah_pr(obj.bid_c,'','-');
      } else if(isset(obj.bid_g)) {
          price = ah_pr(obj.bid_g,'','-');
      }
    }
    if(isset(obj.bo_c) && isset(obj.bo_g)) {
        var buy=ah_pr(obj.bo_g,'','-');
        var buySL=ah_pr(obj.bo_c,'','-', true);
        buyout = buySL+"<br>"+buy;
        if(type === null)
          buyout += '<br><button onclick="ah_bo_sl_g('+obj.id+', '+obj.bo_g+', '+obj.bo_c+')" class=buyout></button>';
    } else if(isset(obj.bo_c)) {
        buyout = ah_pr(obj.bo_c,'','-', true);
        if(type === null)
          buyout += '<br><button onclick="ah_bo_sl('+obj.id+', '+obj.bo_c+')" class=buyout></button>';
    } else if(isset(obj.bo_g)) {
        buyout = ah_pr(obj.bo_g,'','-');
        if(type === null)
          buyout += '<br><button onclick="ah_bo_g('+obj.id+', '+obj.bo_g+')" class=buyout></button>';
    }
    if(type == 1) {
      var bid = _t('au_offer_yes');
      if(bidder == 0) {
        bid = _t('au_offer_no')+'<br><button onclick=_g("ah&end='+obj.id+'") class=end></button>';
      }
      return ah_item(obj.id)+price+"<td>"+buyout+"</td>"+"<td class=ah_time timer="+obj.time+"></td><td>"+bid+"</td>";
    }
    return ah_item(obj.id)+price+"<td>"+buyout+"</td>"+"<td class=ah_time timer="+obj.time+"></td>";
}
function auctionBrowse(ahData,ahp)
{
    var items=[];
    g.ah.page=ahp[0];
    var ah = ah_sort_time(ahData);
    for(var i in ah) {
      var obj = ah[i];
      if(isset(g.item[obj.id])) {
          var it=g.item[obj.id];
          items.push(ah_item_row_mod(obj, null));
      } else {
				var tr = '<tr class="auction-record-id-' + obj.id +' "></tr>';
				items.push(tr);
				g.ah.synchroItems[obj.id] = obj;
			}
    }
    var pages='';
    if(ahp[1]>1) {
        if(ahp[0]>1) pages='<button onclick=ah_page('+(ahp[0]-1)+') class=prev></button> ';
        pages+='<b style="color:#700">['+ahp[0]+'/'+ahp[1]+']</b>';
        if(ahp[0]<ahp[1]) pages+=' <button onclick=ah_page('+(ahp[0]+1)+') class=next></button>';
        pages='<center>'+pages+'</center>';
    }
    //var types=['zwykÅe','unikaty','heroiczne','legendarne'],
    var types=[_t('type_all', null, 'auction'),_t('type_unique', null, 'auction'),_t('type_heroic', null, 'auction'),_t('type_legendary', null, 'auction')]
    /*tprofs={
     '*':'wszystkie',
     'w':'wojownik',
     'p':'paladyn',
     'm':'mag',
     'h':'Åowca',
     'b':'tancerz ostrzy',
     't':'tropiciel'
     };*/
    tprofs={
        '*':_t('prof_all', null, 'auction'),
        'w':_t('prof_warrior', null, 'auction'),
        'p':_t('prof_paladin', null, 'auction'),
        'm':_t('prof_mage', null, 'auction'),
        'h':_t('prof_hunter', null, 'auction'),
        'b':_t('prof_bdancer', null, 'auction'),
        't':_t('prof_tracker', null, 'auction')
    };
    var f=g.ah.filter, opts='', profs; // filter=0lvlmin|1lvlmax|2prof|3mintype|4pricemin|5pricemax|6name
    for(var idx=0;idx<4;idx++)
        opts+='<option value='+idx+((f[3]==idx)?' selected':'')+'>'+types[idx];
    for(var k in tprofs)
        profs+='<option value='+k+((f[2]==k)?' selected':'')+'>'+tprofs[k];
    $('#ah_list').html('<div id=ah_filter>Lvl:<input id=ah_lvl1 value="'+f[0]+'">-<input id=ah_lvl2 value="'+f[1]+'">'
        // Co najmniej:
        // Cena:
    +_t('at_least', null, 'auction')+'<select id=ah_type>'+opts+'</select>'+_t('price_filter', null, 'auction')+'<input id=ah_pr1 value="'
    +f[4]+'">-<input id=ah_pr2 value="'+f[5]+'">'
        //Prof:
        // Nazwa:
    +'<br>'+_t('filter_prof', null, 'auction')+'<select id=ah_prof>'+profs+'</select>'+_t('filter_name', null, 'auction')+'<input id=ah_search value="'+f[6]+'">'
    +'<button onclick=ah_apply() rollover=285></button></div><div class=sep></div>'
        //Item, Nazwa
    +'<table><tr><th width=30>'+_t('item_th', null, 'auction')+'</th> <th>'+_t('name_th', null, 'auction')+'</th> <th>'+_t('price_th', null, 'auction')+'</th> <th>'+_t('price_buynow_th', null, 'auction')+'</th>'
    +'<th width=50>'+_t('endat_th', null, 'auction')+'</th></tr>'+items.join('')+'</table>'+pages);
    $('#ah_window').hide();
    $('#ah_list').show();
}
function ah_apply()
{
    g.ah.filter=[
        $('#ah_lvl1').val(),
        $('#ah_lvl2').val(),
        $('#ah_prof').val(),
        $('#ah_type').val(),
        parsePrice($('#ah_pr1').val()),
        parsePrice($('#ah_pr2').val()),
        $('#ah_search').val()
    ];

    _g('ah&cat=' + g.ah.cat + '&page=1&filter=' + ah_getFilterJoinStr());
}
function ah_getFilterJoinStr(){
    let cloneFilter     = JSON.parse(JSON.stringify(g.ah.filter));
    cloneFilter[6]      = cloneFilter[6] ? esc(cloneFilter[6]): '';

    return cloneFilter.join('|');
}
function ah_page(x)
{
    _g('ah&cat='+g.ah.cat+'&page='+x+'&filter='+g.ah.filter.join('|'));
}
/*
function auctionSell(e)
{
    if(!isset(g.ah.opened) || !g.ah.opened) return false;
    var it=$(e).attr('id').substr(4);

    if(g.item[it].stat.indexOf('permbound')>-1) return mAlert(_t('sell_cannot_permbound'));
    if(g.item[it].stat.indexOf('noauction')>-1) return mAlert(_t('noauction_block', null, 'auction'));

    var sb=g.item[it].stat.indexOf('soulbound')>-1;
    var stats = parseItemStat(g.item[it].stat);

    var price = 0;

    if(sb){
        var a = stats.lvl, b = stats.lvl; //a = item lvl
        a = Math.min(30.0, 10.0 + a / 10.0); //base for hero/leg
        b = Math.min(20.0, 10.0 + b / 10.0); //base for uni

        if(isset(stats.legendary)) {a *= 3.0;price = Math.round(a);}
        else if(isset(stats.heroic)) {a *= 1.5;price = Math.round(a)}
        else if(isset(stats.unique)) {b *= 1.2;price = Math.round(b);}
        else price = Math.round(b);

        if(isNaN(price)) return mAlert(_t('noauction_block', null, 'auction'));
        price *= g.sl_multiplier[_l()];
        $('#au_unbind_price').text(isNaN(price)?'---':price);
    }

    $('#ah_item, #ah_item-s').empty();
    toggleAuxGoldAuction(true);
    $('#ah_time').val('48');

    $('#item'+it).clone().css({
        position:'relative',
        top:0,
        left:0
    }).attr({
        id:'ah-item',
        iid:it
    }).appendTo('#ah_item'+(sb?'-s':'')).click(function(e){
        $(this).remove();
        $('#ah_new, #ah_new-s').hide();
    });
    $('#ah_new'+(sb?'':'-s')).hide();
    $('#ah_new'+(sb?'-s':'')).fadeIn();

    if(!isNaN(price)){
        if(isset(stats.legendary) || isset(stats.heroic)){
            $('#ah_new-s .special_gold').css('display', 'block');
        }else{
            $('#ah_new-s .special_gold_info').css('display', 'block');
        }
    }


}
*/
function ah_sellItem()
{
    if($('#ah-item').length) {
        const id = $('#ah-item').attr('iid'),
            price = parsePrice($('#ah_price').val().split(' ').join('')),
            priceBO = parsePrice($('#ah_bo').val().split(' ').join('')),
            time = $('#ah_time').val();

        _g(`ah&sell=${id}&price=${price}&bo=${priceBO}&time=${time}`);
    }
}
function ah_sellItemS()
{
    var item = g.item[$('#ah-item').attr('iid')];
    if (item.stat.search(/soulbound/)>=0){
        //'UWAGA! Wystawiasz na aukcjÄ przedmiot zwiÄzany, jeÅli nie zostanie sprzedany automatycznie ulegnie zniszczeniu. Czy na pewno chcesz wystawiÄ ten przedmiot na aukcjÄ ?'
        var price = getAuxGoldPrice();
        if(!price) mAlert(_t('soulbound_sell_info', null, 'auction'), 2, [function(){_g('ah&sell='+$('#ah-item').attr('iid'));}]);
        else _g('ah&sell='+$('#ah-item').attr('iid')+'&price='+price);
    }else{
        _g('ah&sell='+$('#ah-item').attr('iid'));
    }
}

function getAuxGoldPrice(){
    return parsePrice($('#ah_price_special').val());
}

function toggleAuxGoldAuction(forceClear){
    $('#_t41').toggleClass('active');
    if(isset(forceClear)){
        $('#_t41').removeClass('active');
        $('#ah_price_special').val('');
        $('#ah_new-s .special_gold').css('display', 'none');
        $('#ah_new-s .special_gold_info').css('display', 'none');
    }
    if($('#_t41').hasClass('active')){
        $('#ah_price_special_hidden').css('display', 'inline-block');
        $('#_t42').css('display', 'block');
    }else{
        $('#ah_price_special_hidden').css('display', 'none');
        $('#_t42').css('display', 'none');
    }
}

function ah_select(cat,t)
{
    $('#ahselect B').removeClass('selected');
    g.ah.cat=cat;
    if(cat==0) {
        _g("ah");
        $('#b_myah').css({
            backgroundPosition:'0 -38px'
        }).removeAttr('rollover');
    } else {
        $('#b_myah').css({
            backgroundPosition:'0 0px'
        }).attr('rollover','19');
        //_g('ah&cat='+cat+'&page=1&filter='+g.ah.filter.join('|'));
        _g('ah&cat='+cat+'&page=1&filter=' + ah_getFilterJoinStr());
        $(t).addClass('selected');
    }
}
/********************* DEPOSIT */
function depoShow(d, clanDepo)
{
    if (!g.depo.depoOpenTabs) {
        g.depo.depoOpenTabs = new DepoOpenTabs();
        g.depo.depoOpenTabs.init();
    }
    g.windowCloseManager.callWindowCloseConfig(g.windowsData.windowCloseConfig.DEPO)
    g.lock.add('depo');
    $('#depo-buttons').hide();
    g.depo.clan = (isset(clanDepo) && clanDepo) ? true : false;
    g.depo.gold=d.gold;
    g.depo.expire=d.expire;
    g.depo.multiItemsAtZeroZeroArray=d.has_multi_items_at_zero_zero;
    g.depo.isDebtOverLimit=d.is_debt_over_limit;
    g.depo.nextExpiration=d.next_expiration;
    g.multiItemsAtZeroZeroOnceWarning = false;
    if (!g.depo.clan){
        var date = new Date(d.expire*1000);
        g.depo.expireLock = date.getFullYear()>=2038;
    }
    g.depo.size=d.size;
    g.depo.msize=d.msize;
    const $payButtons = $('#depo .depo-pay');

    if (g.depo.clan) {
        $('#depo-back').append('<span class="clandeponame">'+_t('clan_depo', null, 'depo')+'</span>'); //Depozyt klanowy
        g.depo.visibleTabs = ((0x200+0x400+0x800)&d.myrights)>>9;
        g.depo.myrights = d.myrights;
        if (g.depo.visibleTabs == 0 && !(g.depo.myrights&1)) {
            g.lock.remove('depo');
            return mAlert(_t('no_rights_to_see_cd', null, 'depo'));
        } //Nie masz uprawnieÅ do oglÄdania depozytu klanowego.'
        $('#depo-back').addClass('clan_depo');
        $('#depo-balance,#depo-gold,#depo-goldin,#depo-goldout,#depo-del,#depo-pays,#depo-payz,#depo-buttons').css('display', 'none');
        if (g.depo.size>0) {
            $('#depo-time').html(_l() == 'pl' ? 'tak' : 'yes').css('color', '#fffefe');
        } else {
            $('#depo-time').html(_l() == 'pl' ? 'nie' : 'no').css('color', 'red');
        }
        $('#depo-txt-rent').html(_t('depo_available_info', null, 'depo'));
		    $('#depo-toggle').css('display','none');
    } else {
        $('#depo-back').find('.clandeponame').remove();
        $('#depo-back').removeClass('clan_depo');
        $('#depo-balance, #depo-gold, #depo-goldin, #depo-goldout, #depo-del, #depo-pays, #depo-payz, #depo-toggle').css('display', '');
        $('#depo-time').css('color' ,'#fffefe');
        //Koszt wynajmu depozytu na 1 miesiÄc to<br>6SÅ od 20 poziomu postaci lub 1mln zÅota od 75 poziomu.
        let txt = g.depo.isDebtOverLimit ? 'depo_debt_cost' : 'depo_monthcost';
        $('#depo-buttons .infotxtdepo.private-section .shadowed').html(_t(txt, null, 'depo')+'<br>');
        $('#depo-buttons').attr('class', 'private-on');

        $payButtons.html('');
        const buttonOptions = [
            { text: _t('pay_tears %val%', {'%val%': d.cost_prolong.credits }, 'depo'), classes: ['small', 'green'], action: () => depoPay('credits') },
            { text: _t('pay_gold %val%', {'%val%': round(d.cost_prolong.gold) }, 'depo'), classes: ['small', 'green'], action: () => depoPay('gold') },
        ];
        for (const options of buttonOptions) {
            const button = new Button(options).getButton();
            $payButtons.append(button);
        }
    }

    $('#depo-gold .info-tip').tip(_t('unit_tip', null, 'depo'));

    g.depo.vis=true;
    //g.lock.add('depo');

    $('#depo-items').css('width', 462*g.depo.size);
    var depotxt = _t('depotxt', null, 'depo');
    var html = '';
    if (g.depo.size < g.depo.msize) {
        //PowiÄksz depozyt
        //'OpÅaÄ depozyt aby miec moÅ¼liwoÅÄ jego rozszerzenia'
        //Czy na pewno chcesz powiÄkszyÄ depozyt? Koszt jednego ulepszenia to 45SÅ.
        if (!g.depo.clan) {
					html +=
						'<div tip="<b>' +

						_t('depo_upgrade', null, 'depo') +

						'</b>' +

						((d.expire && d.expire >= unix_time()) ? depotxt : _t('depo_upgrade_error', null, 'depo')) +

						'" class="depoUpgrade" onclick="' +

						((d.expire && d.expire >= unix_time()) ? 'mAlert(\'' + _t('depo_upgrade_confirm', null, 'depo') + '\', 2, [function(){_g(\'depo&upgrade=1\')}])' : 'return false;') +

						'">+</div>';

				} else {
					if (g.depo.myrights&1) {
						var alertStr;
						var gold = d.cost_upgrade.gold;
						var credits = d.cost_upgrade.credits;

						if (d.size == 0)  alertStr = _t('buydepoalert', {'%gold%': round(gold), '%credits%':credits}, 'depo');
						else  						alertStr = _t('increasedepoalert', {'%gold%': round(gold), '%credits%':credits}, 'depo');

						$('#upgrade_alert_str').html(alertStr);
						$('#clan_depo_pay_1').html(_t('stamina_shop_cost') + '<b> ' + round(gold)+ '</b>');
						$('#clan_depo_pay_2').html(_t('stamina_shop_cost') + '<b> ' + credits + ' SÅ</b>');

						var costUpgrade = round(gold) + ' lub ' + credits + 'SÅ';
						var tipStr = _t('depo_upgrade_clan', {'%val%' : costUpgrade}, 'depo');
						html += '<div tip="'+ tipStr + '" class="depoUpgrade" onclick="showUpgradeClanDepoAlert()">+</div>';
					}
				}
    } else {
      html += '<div class="depoUpgrade haveFull" onclick="return false;">+</div>';
    }
    html += '<br>';
    html += '<div class=depoSwitchWrapper>';
    html += '<span class="d-movebar" onclick="return depoSwitchSectionScroll(-1);"><</span>';
    html += '<div class=depoTabScrollWrapper>';

    for(var i=1;i<=g.depo.msize;i++){
      var active = g.depo.clan ? i <= g.depo.visibleTabs : true;
      var notExists = i > g.depo.size;

        let allDepoCardClass = "one-depo-card";
        //allDepoCardClass += ' d-section' + (i==g.depo.section?' active':'');
        allDepoCardClass += ' d-section';
        allDepoCardClass += !active?' disabled':'';
        allDepoCardClass += (notExists?' notExists':'');
        allDepoCardClass += !g.depo.depoOpenTabs.getLoadedItemsTab(i - 1) ? " not-loaded-items" : '';


        //html += '<span onclick="return '+((active && !notExists)?'depoSwitchSection('+i+')':'false')+'" sId="'+i+'" class="one-depo-card d-section'+(i==g.depo.section?' active':'')+(!active?' disabled':'')+(notExists?' notExists':'')+'">'+i+'</span>';
        html += '<span onclick="return '+((active && !notExists)?'depoSwitchSection('+i+')':'false')+'" sId="'+i+'" class="' + allDepoCardClass + '">'+i+'</span>';
    }
    html += '</div>';
    html += '<span class="d-movebar" onclick="return depoSwitchSectionScroll(1);">></span>';
    /*var depotxt = '<br />- jedno powiÄkszenie depozytu dodaje 112 miejsc na przedmioty<br />'+
     '- powiÄkszenie dziaÅa na wszystkich postaciach i Åwiatach<br />'+
     '- powiÄkszenie wykupuje siÄ tylko raz, wysokoÅÄ abonamentu za depozyt nie ulega zmianie<br />'+
     '- czÅonkowie KB oraz gracze, ktÃ³rzy zakupili przynajmniej 1000SÅ mogÄ powiÄkszyÄ depozyt do 4x, pozostali 3x';*/
    html+='</div>';
    $('#depo-sections').html(html);

	//$('#depo-sections').find('.d-section').droppable({
	//	over: function () {
	//		timeOut = setTimeout(function () {
	//			self.setVisible(nr);
	//		}, 1000);
	//	},
	//	out: function () {
	//		clearTimeout(timeOut);
	//		timeOut = null;
	//	}
	//});


    $("#depo-sections .depoTabScrollWrapper").scrollLeft(g.depo.switchScroll);
    if (g.depo.clan && g.depo.size>1) setTimeout(function(){depoSwitchSection(g.depo.section)},200);

    function getMaxOffsetDroppable() {
        var $depoSections = $('#depo-sections');
        var depoSectionsOffsetLeft = $depoSections.offset().left;
        var depoSectionsWidth = $depoSections.width();
        return depoSectionsOffsetLeft + depoSectionsWidth - 36;
    }

    $('#depo-sections .d-section:not(.depoUpgrade,.disabled,.notExists)').droppable({
        accept:'.item',
        over: function (e, ui) {
            if (ui.position.left > getMaxOffsetDroppable()) return; // fix for drop on hidden slots
            var index= $(e.target).index() + 1;
            //if (g.depo.hoverSection == index) return;
            //g.depo.hoverSection = index;
            depoSwitchSection(index);
        },
        drop:function(e,ui){
            if (ui.position.left > getMaxOffsetDroppable()) return; // fix for drop on hidden slots
            var id = ui.draggable.attr('id').substr(4);
            var sid = $(this).attr('sid');
            var br = false;


            const ITEM_IN_ROW           = DepoData.ITEM_IN_ROW;
            const ITEM_IN_COLUMN 		= DepoData.ITEM_IN_COLUMN;
            const MAX_X_IN_OPEN_TAB 	= DepoData.MAX_X_IN_OPEN_TAB;

            var xLength = (parseInt(sid) + 0) * ITEM_IN_ROW;
            var xStart 	= xLength - ITEM_IN_ROW;

            let v   	= Math.floor(xStart / DepoData.MAX_X_IN_OPEN_TAB);
            let yStart 	= v * ITEM_IN_COLUMN;
            let yEnd 	= yStart + ITEM_IN_COLUMN;

            xStart  -= v * MAX_X_IN_OPEN_TAB;
            xLength -= v * MAX_X_IN_OPEN_TAB;

            /*
            for(var y=0; y<g.depo.size; y++){
                for(var x=14*(sid-1); x<sid*14; x++){
            */

            for (var y = yStart; y < yEnd; y++) {
                for (var x = xStart; x < xLength; x++) {

                    if (!isset(g.depo.tmpDropMatrix[x]) || (isset(g.depo.tmpDropMatrix[x]) && !isset(g.depo.tmpDropMatrix[x][y]))){


                        let newPos 	= g.depo.depoOpenTabs.correctPosMoveItemsInDepo(x, y);
                        x 			= newPos.x;
                        y 			= newPos.y;


                        switch(g.item[id].loc){

                            case 'g':return g.depo.clan ? _g('clan&a=depo&op=item_put&id='+id+'&x='+x+'&y='+y) : _g('depo&put='+id+'&x='+x+'&y='+y);

                            case 'd':return _g('depo&move='+id+'&x='+x+'&y='+y);

                            case 'c':return _g('clan&a=depo&op=item_move&id='+id+'&x='+x+'&y='+y);
                        }
                    }
                }
            }
            //'Brak miejsca w wybranej zakÅadce'
            mAlert(_t('depo_no_space_intab', null, 'depo'));
        }
    });
    if (!g.depo.clan){
        if(!d.expire) {
            $('#depo-items').empty();
            $('#depo-time').html(_t('depo_missing', null, 'depo')); //'brak'
            $('#depo-buttons span.next_renew').hide();
        }else{
            if(g.depo.expireLock) $('#depo-toggle, #depo-buttons').css('display', 'none');
            $('#depo-time').html(ut_fulltime(d.expire,true));
            if (d.expire < unix_time()) {$('#depo-time').css('color' ,'red');}
            else{$('#depo-time').css('color' ,'#fffefe');}
            $('#depo-buttons span.next_renew').show();
            $('#depo-buttons span.next_renew span.date').html(ut_fulltime(g.depo.nextExpiration,true));
        }
    }
    $('#depo-gold INPUT').val('');
    $('#depo-balance b').html(d.gold);
    $('#depo').fadeIn();
}

function depoManageMultiZeroZero () {
    if (!this.checkIsMultiZeroZeroinGroupOfTabs(g.depo.multiItemsAtZeroZeroArray)) return;
    if (!g.multiItemsAtZeroZeroOnceWarning) {
        g.multiItemsAtZeroZeroOnceWarning = true;
        message(_t('depoMultiZeroZero'));
    }
}

function checkIsMultiZeroZeroinGroupOfTabs (v) {
    const [start, end] = getEngine().depo.depoOpenTabs.getCurrentTabRange();
    const cutArr = v.slice(start, end);
    return cutArr.includes(1);
}

function payToggle () {
    if (isset(g.depo) && !g.depo.nextExpiration) {
        mAlert(_t('max_next_expiration', null, 'depo'));
        return;
    }
    $('#depo-buttons').toggle();
}

function depoUpdateNotLoadedItemsCards () {
    let $cards = $('.one-depo-card');

    $cards.each(function () {

        let $e 		= $(this);
        let index 	= $e.attr("sId");

        if (!isset(index)) {
            return
        }

        const loadedItemsCard = g.depo.depoOpenTabs.getLoadedItemsTab(parseInt(index) - 1);
        if (loadedItemsCard) {
            $e.removeClass('not-loaded-items');
            $e.tip('');
        }
    });
}

function depoCallLoadItemsCard (nr) {
    if (g.depo.clan) {
        return;
    }

    const loadedItemsCard = g.depo.depoOpenTabs.getLoadedItemsTab(nr);

    if (!loadedItemsCard) {
        g.depo.depoOpenTabs.sendRequestToLoadItem(nr);
    }
}

function clanDepoUpgradeOpt()
{
	$('#upgradeclandepoalert')
}
function showUpgradeClanDepoAlert () {
	$('#upgradeclandepoalert').absCenter().fadeIn();
}
function hideUpgradeClanDepoAlert () {
	$('#upgradeclandepoalert').css('display', 'none');
}
function depoHide()
{
    g.depo.depoOpenTabs = null;
    $('#depo').fadeOut();
    g.depo.tmpDropMatrix={};
    g.depo.switchScroll = 0;
    g.lock.remove('depo');
    g.depo.vis=false;
    for(var i in g.item){
        if (g.item[i].loc == 'd' || g.item[i].loc == 'c'){$('#item'+i).remove();delete g.item[i];}
    }
    if (g.depo.clan) _g('clan&a=depo&op=close');
}
function depoSwitchSection(section){
    if (section<=g.depo.msize&&section>=1){
        g.depo.section = section;
        $('#depo-items-wrapper').scrollLeft((section-1)*462);
        $('#depo-sections .d-section:not(.depoUpgrade)').removeClass('active');
        var list = $('#depo-sections .d-section');
        $(list[section-1]).addClass('active');

        depoCallLoadItemsCard(section - 1)
    }
}
function depoSwitchSectionScroll(val) {
  var $el = $("#depo-sections .depoTabScrollWrapper");
  var pos = $el.scrollLeft();
  var step = 43 * val;
  var npos = pos + step;
  //if(npos < 0) {
  //  npos = 0;
  //} else if(npos > $el.width()) {
  //  npos = $el.width();
  //}

  if(npos < 0) {
    npos = 0;
  }
  $el.scrollLeft(npos);
  g.depo.switchScroll = npos;
}

function depoSwitchSectionInSpecificPos(val) {
    let $el = $("#depo-sections .depoTabScrollWrapper");
    let pos = 43 * (val - 1);

    $el.scrollLeft(pos);
    g.depo.switchScroll = pos;
}

/* used for callback when dragging items*/
//function depoDrag(e,ui){
//	if (g.depo.size>1){
//        console.log('dupa')
//        var s = $('#depo-sections .depoSwitchWrapper');
//        if (e.clientX>s.offset().left && e.clientX<s.offset().left+s.width() && e.clientY>s.offset().top && e.clientY<s.offset().top+s.height()){
//            var section = Math.ceil((e.clientX - s.offset().left) / ($('#depo-sections .depoSwitchWrapper').width()/g.depo.size));
//            if (section != g.depo.hoverSection){
//                clearTimeout(g.depo.sectionActivateTimeout)
//                g.depo.sectionActivateTimeout = setTimeout(function(){
//                    depoSwitchSection(section);
//                }, 300)
//            }
//        }else{
//            clearTimeout(g.depo.sectionActivateTimeout);
//        }
//    }
//}

function depositOld(e)
{
    if(!g.depo.vis) return;
    var it=$(e).attr('id').substr(4);
    for(var y=0; y<8; y++){
        for(var x=14*(g.depo.section-1); x<g.depo.section*14; x++){
            if (!isset(g.depo.tmpDropMatrix[x]) || (isset(g.depo.tmpDropMatrix[x]) && !isset(g.depo.tmpDropMatrix[x][y]))){
                //if (g.depo.clan) return _g('clan&a=depo&op=item_put&id='+it+'&dx='+x+'&dy='+y);
                if (g.depo.clan) return _g('clan&a=depo&op=item_put&id='+it+'&x='+x+'&y='+y);
                else return _g('depo&put='+it+'&x='+x+'&y='+y);break;
            }
        }
    }
    //'Brak miejsca w wybranej zakÅadce, czy przejÅÄ do wolnej zakÅadki ?'
    if (g.depo.size>1) mAlert(_t('depo_tabno_space ask', null, 'depo'), 2, [function(){
        for(var s=0; s<g.depo.size; s++){
            for(var y=0; y<8; y++){
                for(var x=14*s; x<(s+1)*14; x++){
                    if (!isset(g.depo.tmpDropMatrix[x]) || (isset(g.depo.tmpDropMatrix[x]) && !isset(g.depo.tmpDropMatrix[x][y]))){
                        return depoSwitchSection(s+1);
                    }
                }
            }
        }
        mAlert(_t('depo_no_space', null, 'depo')); //'Brak miejsca w depozycie'
    },function(){}]);
    else mAlert(_t('depo_no_space', null, 'depo'));
}
function deposit(e)
{
    if(!g.depo.vis) return;
    var it=$(e).attr('id').substr(4);

    let slotsDataToFindFirstFreeSlot = g.depo.depoOpenTabs.getSlotsDataToFindFirstFreeSlot(g.depo.section - 1);

    let xStart = slotsDataToFindFirstFreeSlot.xStart
    let xEnd = slotsDataToFindFirstFreeSlot.xEnd
    let yStart = slotsDataToFindFirstFreeSlot.yStart
    let yEnd = slotsDataToFindFirstFreeSlot.yEnd


    for(var y=yStart; y<yEnd; y++){
        for(var x=xStart; x<xEnd; x++){
            if (!isset(g.depo.tmpDropMatrix[x]) || (isset(g.depo.tmpDropMatrix[x]) && !isset(g.depo.tmpDropMatrix[x][y]))){
                //if (g.depo.clan) return _g('clan&a=depo&op=item_put&id='+it+'&dx='+x+'&dy='+y);
                if (g.depo.clan) return _g('clan&a=depo&op=item_put&id='+it+'&x='+x+'&y='+y);
                else return _g('depo&put='+it+'&x='+x+'&y='+y);break;
            }
        }
    }
    ////'Brak miejsca w wybranej zakÅadce, czy przejÅÄ do wolnej zakÅadki ?'
    //if (g.depo.size>1) mAlert(_t('depo_tabno_space ask', null, 'depo'), 2, [function(){
    //    for(var s=0; s<g.depo.size; s++){
    //        for(var y=0; y<8; y++){
    //            for(var x=14*s; x<(s+1)*14; x++){
    //                if (!isset(g.depo.tmpDropMatrix[x]) || (isset(g.depo.tmpDropMatrix[x]) && !isset(g.depo.tmpDropMatrix[x][y]))){
    //                    return depoSwitchSection(s+1);
    //                }
    //            }
    //        }
    //    }
    //    mAlert(_t('depo_no_space', null, 'depo')); //'Brak miejsca w depozycie'
    //},function(){}]);
    //else mAlert(_t('depo_no_space', null, 'depo'));
}
function depoPay(c)
{
    if(c=='gold' && getHeroLevel()<75) mAlert(_t('low_lvl_to_paygold', null, 'depo')); //'Masz zbyt niski poziom, by opÅaciÄ depozyt zÅotem!'
    else
    if(c=='credits' && getHeroLevel()<20) mAlert(_t('low_lvl_to_usedepo', null, 'depo')); else //'Masz zbyt niski poziom, by korzystaÄ z depozytu.'
        _g('depo&pay='+c+'&time=1');
}
function findEmptyBagPlace(){
    var list = {};
    for(var i=0; i<3; i++){
        if (g.bags[i] && (g.bags[i][0] - g.bags[i][1]) > 0){
            for(var k in g.item) if (g.item[k].loc == 'g' && g.item[k].st == 0) list[g.item[k].x+g.item[k].y*7] = true;
            for(var y=i*6; y<((i+1)*6); y++){
                for(var x=0; x<7; x++){
                    if (!isset(list[x+y*7])){
                        return [x,y];
                    }
                }
            }
        }
    }
    return false;
}
function depoGet(e)
{
    var it=$(e).attr('id').substr(4);
    if (g.depo.clan){
        var place = findEmptyBagPlace();
        //if (place) _g('clan&a=depo&op=get&id='+it+'&dx='+g.item[it].x+'&dy='+g.item[it].y+'&px='+place[0]+'&py='+place[1]);
        if (place) _g('clan&a=depo&op=item_get&id='+it);
        else mAlert(_t('depo_no_space_inbag', null, 'depo')); //'Nie masz wolnego miejsca w torbach'
    }
    else _g('depo&get='+it);
}
function depoGoldin() {
    const val = parsePrice(removeSpaces($('#depo-gold INPUT').val()));
    if (checkInputValIsEmptyProcedure(val)) return;
    if (!checkParsePriceValueIsCorrect(val)) return;
    _g('depo&goldin=' + val);
    $('#depo-gold INPUT').val('');
}
function depoGoldout() {
    const val = parsePrice(removeSpaces($('#depo-gold INPUT').val()));
    if (checkInputValIsEmptyProcedure(val)) return;
    if (!checkParsePriceValueIsCorrect(val)) return;
    _g('depo&goldout=' + val);
    $('#depo-gold INPUT').val('');
}
/******************************* BOOKS */
function bookSetup(b)
{
    g.book=b;
    g.book.content=g.book.content.split('#PAGE#');
    g.book.pages=g.book.content.length;
    g.book.page=1;
    $('#book_c').html(parseContentBB(g.book.content[0]));
    $('#book_t').html('<h1>'+parseContentBB(g.book.title)+'</h1>'+parseContentBB(g.book.author));
    $('#book_p').html('<span>1</span>/'+g.book.pages);
    $('#books').fadeIn();
}
function bookPage(d)
{
    g.book.page=Math.max(1,Math.min(g.book.pages,g.book.page+d));
    $('#book_c').html(parseContentBB(g.book.content[g.book.page-1]));
    $('#book_p').html('<span>'+g.book.page+'</span>/'+g.book.pages);
}
/******************************** ROOMS */
function motelSetup(m)
{
    g.lock.add('motel');
    //PokÃ³j, Stan, Cena*, IloÅÄ
    var txt='<h2>'+m.name+'</h2>'+m.desc+'<table><tr><th>'+_t('room_th', null, 'motel')+'<th>'+_t('state_th', null, 'motel')+'<th>'+_t('price_th', null, 'motel')+'<th width=80>'+_t('amount_th', null, 'motel')+'<th width=105>';
    for(var i=0; i<m.rooms.length; i+=5) {
        txt+='<tr><td><b>'+m.rooms[i+1]+'</b><td class=cen>';
        var parseGold = round(m.rooms[i + 2],3);
        if(m.rooms[i+3]==2) { // my room
            txt+='<b style="color:blue">wynajmujesz do '+ ut_fulltime(m.rooms[i + 4]) +'</b><td id=motel_price'+ m.rooms[i] + ' class=cen value='+ m.rooms[i + 2] +'>'+ parseGold
            +'<td class=cen><select onclick=changePrice(' + m.rooms[i] + ') id=rotime'+m.rooms[i]+' style="width:60px">'
                //1m-c, 2m-ce, 3m-ce, 6m-cy, 12m-cy
            +'<option value=1>'+_t('time_1m',null, 'motel')+'<option value=2>'+_t('time_2m',null, 'motel')+'<option value=3>'+_t('time_3m',null, 'motel')+'<option value=6>'+_t('time_6m',null, 'motel')+''
            +'<option value=12>'+_t('time_12m',null, 'motel')+'</select><br><input type=text class="dep_keys_amount" maxlength="2" id=rokey'+m.rooms[i]
            +' value=1 style="width:60px"><br>'+_t('all**', null, 'motel') //wszystkie**
            +'<td class=cen><button onclick=rentRoom('+m.rooms[i]+')>'+_t('long_opt', null, 'motel')+'</button>' //PrzedÅuÅ¼
            +'<button onclick=dupKeys('+m.rooms[i]+')>'+_t('keysadd_opt', null, 'motel')+'</button>' //DorÃ³b klucze
            +'<button onclick=delKeys('+m.rooms[i]+')>'+_t('keysrm_opt', null, 'motel')+'</button>'; //UsuÅ klucze
        } else
        if(m.rooms[i+3]==0) { // free room
            txt+='<b style="color:green">'+_t('room_free')+'</b><td id=motel_price' + m.rooms[i] + ' class=cen value='+ m.rooms[i + 2] +'>' + parseGold
            +'<td class=cen><select onclick=changePrice(' + m.rooms[i] + ') id=rotime'+m.rooms[i]+' style="width:60px">'
            +'<option value=1>'+_t('time_1m',null, 'motel')+'<option value=2>'+_t('time_2m',null, 'motel')+'<option value=3>'+_t('time_3m',null, 'motel')+'<option value=6>'+_t('time_6m',null, 'motel')+''
            +'<option value=12>'+_t('time_12m',null, 'motel')+'</select>'
            +'<td class=cen><button onclick=rentRoom('+m.rooms[i]+')>'+_t('rent_this',null, 'motel')+'</button>'; //Wynajmij
        } else
            txt+='<b style="color:red">'+_t('room_taken', null, 'motel')+ ' do<br>' + ut_fulltime(m.rooms[i + 4])  + '</b><td class=cen>' + parseGold + '<td class=cen>-<td class=cen>-';
    }
    $('#rooms_c').html(txt+'</table>'+_t('room_info_txt2', null, 'motel')); //*Cena za jednostkÄ (1 miesiÄc, 1 klucz)<br>**Poza tymi we wÅasnym ekwipunku
    $('.dep_keys_amount').mask('0#');
    $('#rooms').fadeIn('fast');
}
function changePrice (id)
{
    var $mPrice = $('#motel_price' + id);
    var v1 = $('#rotime' + id).val();
    var v2 = $mPrice.attr('value');
    $mPrice.html(round(v1 * v2,3), 5);
}
function rentRoom(id)
{
    var rtime=$('#rotime'+id).val(),                        //'miesiÄc'
      rtime2=_t('rm_1month', null, 'motel');
    if(rtime>4) rtime2=rtime+_t('rm_2months', null, 'motel'); //' miesiÄcy'
    else
    if(rtime>1) rtime2=rtime+_t('rm_2months*', null, 'motel'); //' miesiÄce';

    var oneM = $('#motel_price' + id).attr('value');
    var price = round(oneM * rtime, 5);
    mAlert(_t('room_confirm_question2 %time% %gold%', {'%time%': rtime2, '%gold%': price}, 'motel'),2, //'Czy jesteÅ pewien, Å¼e chcesz wynajÄÄ ten pokÃ³j<br>na '+rtime2+'?'
        [function(){
            _g("rooms&rent="+id+"&m="+rtime)
        },function(){}]);
}
function dupKeys(id)
{
    const $input = $('#rokey' + id);
    const amount = $input.val();
    if (Number(amount) < 1 || Number(amount) > 10) {
        mAlert(_t('duplicate_key_bad_value', null, 'motel'));
        return;
    }

    var oneM = $('#motel_price' + id).attr('value');
    var gold = round(parsePrice(oneM) * amount * 0.1, 5);
    var pl = amount > 4 ? 3 : amount > 1  ? 2 : 1;
    mAlert(_t('duplicate_key_confirm' + pl + ' %amount% %gold%', {'%amount%': amount, '%gold%': gold}, 'motel'),2, //'Czy jesteÅ pewien, Å¼e chcesz usunÄÄ wszystkie klucze<br>do tego pokoju?'
      [function(){
          _g("rooms&room="+id+"&keydup="+amount);
      },function(){}]);
}
function delKeys(id)
{
    var oneM = $('#motel_price' + id).attr('value');
    var gold = round(oneM * 0.3, 5);
    mAlert(_t('room_key_remove_confirm2 %gold%', {'%gold%': gold}, 'motel'),2, //'Czy jesteÅ pewien, Å¼e chcesz usunÄÄ wszystkie klucze<br>do tego pokoju?'
        [function(){
            _g("rooms&delkeys="+id)
        },function(){}]);
}
/***************************** LOOTS */
function lootWindow(d)
{
    if(isset(d.init)) {
        if (g.loots) closeLootWindow(true);
        createLootAnim();
        tutorialStart(3);
        $('#loots TR').empty();
        $('#loots').absCenter().fadeIn('fast');
        $('#loots_header_label').html(goldTxt(_t('loots_header')));
        const timeToEnd = d.endTs - g.ev;
        $('#loots_counter').html(Math.floor(timeToEnd));
        // if(isset(d.free)) {
        //     lootsUpdateFreeBagSlots(d.free);
        //     updateBags();
        // }
        updateBags();
        try{ //workaround dla buga ze starszymi wersjami przegladarek nieobslugujacymi selektora ':focus' /Doceluf
            if (!$('#inpchat:focus')){
                $('#loots_button').focus();
            }
        }catch(e){
            try{
                if ($(document.activeElement).attr('id') != 'inpchat'){
                    $('#loots_button').focus();
                }
            }catch(e){
                $('#loots_button').focus();
            }
        }
        var time = timeToEnd;
        g.loots={
            init:d.init,
					  owners: d.owners ? d.owners : null,
            source: (d.source?d.source:null),
            interval: setInterval(function () {
                time--;
                $('#loots_counter').html(Math.floor(time));
                if (time < 1) closeLootWindow();
            }, 1000)
        };
    }

    if (!g.loots) return;

    // if (isset(d.free)) lootsUpdateFreeBagSlots(d.free);
    updateBags();

    g.loots.want= [];
    g.loots.must= [];
    g.loots.not = [];

    for (var k in d.states) {
        var state = d.states[k];
        switch (state) {
            case 0:
                g.loots.not.push(k);
                break;
            case 1:
                g.loots.want.push(k);
                break;
            case 2:
                g.loots.must.push(k);
                break;
        }
        setStateOnOneLootItem(k, state);
    }


    //$('#loots_counter').html(d.timer);
    //if(d.timer<1) {
    //    $('#loots').fadeOut('fast');
    //    g.loots=false;
    //}
}

function lootsUpdateFreeBagSlots () {
    $('#loots_bag').html(_t('bag_room %amount%', {'%amount%': g.freeSlots}, 'loot')); //'Miejsca w torbie:<br>'+d.free
}

function closeLootWindow (fast) {
    if (fast) $('#loots').css('display', 'none');
    else $('#loots').fadeOut('fast');
    clearInterval(g.loots.interval);
    g.loots=false;
}

function setStateOnOneLootItem (id, state) {
    var $lootItem = $('#loot' + id);
    if (!$lootItem.length) return;
    if ($lootItem.find('.yours').length) return;
    $lootItem.find('.sel').removeClass('sel');

    var w = g.loots.want;
    var n = g.loots.not;
    var m = g.loots.must;

    var allStates = {
        0: {
            text: _t('dont_want', null, 'loot'),
            selector: '.no'
        },
        1: {
            text: _t('want', null, 'loot'),
            selector: '.yes'
        },
        2: {
            text:_t('really_want', null, 'loot'),
            selector: '.need'
        }
    };

    if (state != undefined) {
        $lootItem.find(allStates[state].selector).addClass('sel').attr('tip', allStates[state].text);
        return;
    }

    for (var i = 0; i < w.length; i++) {
        if (id == w[i]) $lootItem.find(allStates[1].selector).addClass('sel').attr('tip', allStates[1].text);
    }
    for (var i = 0; i < n.length; i++) {
        if (id == n[i]) $lootItem.find(allStates[0].selector).addClass('sel').attr('tip', allStates[0].text);
    }
    for (var i = 0; i < m.length; i++) {
        if (id == m[i]) $lootItem.find(allStates[2].selector).addClass('sel').attr('tip', allStates[2].text);
    }
}


function createLootAnim () {
    var $loots = $('#loots');
    $loots.removeClass('colorized video');

    if (!g.chestAnimation) return;

    if (g.chestAnimationType === 'colorized') {
        $loots.addClass('colorized');
        g.chestAnimation = false;
        return;
    } else if (g.chestAnimationType == 'video') {
        var $video = $('<video>').attr('id', 'chest-animation');
        var $source = $('<source>').attr({
            'src':  'video/chest.m4v',
            'type': 'video/x-m4v'
        });
        $video.append($source);
        $loots.append($video);
        $video[0].play();
        $video[0].onended = function () {
            $video.animate({
                'left': 0 - 10,
                'top' : 0 - 10,
                'opacity': 0,
                'width': $loots.width(),
                'height': $loots.height()
            }, function () {
                $video.remove();
                g.chestAnimation = false;
            });
        };
    }
}
//function sendLoots(fin)
//{
//    _g('loot&not='+g.loots.not.join(',')+'&want='+g.loots.want.join(',')
//    +'&must='+g.loots.must.join(',')+'&final='+fin);
//    if(fin==1) $('#loots').fadeOut('fast');
//}


function sendLoots (finalVal, changeMindItemId, decision) {
    var arr = {
        want: [],
        not: [],
        must: []
    };
    var w = g.loots.want;
    var n = g.loots.not;
    var m = g.loots.must;

    for (var i = 0; i < w.length ; i++) {
        var id = w[i];
        if ($('#loot' + id).hasClass('yours')) continue;
        if (changeMindItemId != false && id == changeMindItemId) arr[decision].push(changeMindItemId);
        else arr['want'].push(id);
    }

    for (var i = 0; i < n.length ; i++) {
        var id = n[i];
        if ($('#loot' + id).hasClass('yours')) continue;
        if (changeMindItemId != false && id == changeMindItemId) arr[decision].push(changeMindItemId);
        else arr['not'].push(id);
    }

    for (var i = 0; i < m.length ; i++) {
        var id = m[i];
        if ($('#loot' + id).hasClass('yours')) continue;
        if (changeMindItemId != false && id == changeMindItemId) arr[decision].push(changeMindItemId);
        else arr['must'].push(id);
    }

    var url = "loot&want=" + arr.want.join(',') + "&not=" + arr.not.join(',') + "&must=" + arr.must.join(',') +'&final=' + finalVal;

    _g(url);

    if (finalVal) closeLootWindow();
}



function cancelLoots()
{
    _g('loot&not='+g.loots.not.concat(g.loots.want,g.loots.must).join(',')+'&final=1');
    $('#loots').fadeOut('fast');
    g.loots=false;
}
//function setLoots(m,id)
//{
//    function rmA(arr,it) {
//        var i=$.inArray(it,arr);
//        if(i>-1) arr.splice(i,1);
//        return arr;
//    }
//    g.loots.want=rmA(g.loots.want,id);
//    g.loots.not=rmA(g.loots.not,id);
//    g.loots.must=rmA(g.loots.must,id);
//    $('#loot'+id+' B').removeClass('sel');
//    switch(m) {
//        case 0:
//            g.loots.want.push(id);
//            $('#loot'+id+' B.yes').addClass('sel');
//            break;
//        case 1:
//            g.loots.not.push(id);
//            $('#loot'+id+' B.no').addClass('sel');
//            break;
//        case 2:
//            g.loots.must.push(id);
//            $('#loot'+id+' B.need').addClass('sel');
//            break;
//        default:
//            log(2,'setLoots inproper list ('+m+').');
//            break;
//    }
//}
function lootboxItem(i)
{
  if (!g.loots) return;
	var avatarLoot = i.loc == 'k';
	//avatarLoot = true;
	var yours = avatarLoot && i.own == hero.id ? "class='yours' ": "";
	var lootStr = '';
	var lootItem = createItem(i);
	var itemWprapper = `<td ${yours} id="loot${i.id}" class="loot-wrapper"><div class="loot">${lootItem[0].outerHTML}</div>`;

	lootStr += itemWprapper;

	if (avatarLoot) {

		var charData = getNameAndAvatar(i.own);
		var nick = '<div class="nick">' + charData.name + '</div>';
		var icon = '<div class="icon" style="background-image:url(' + charData.imgUrl + ')"></div';
		lootStr += nick + icon;
	} else {
		//var lootDecision =
		//	"<div class='loot-decision'>" +
		//	"<b class='yes sel' onclick='setLoots(0,\""+i.id+"\")' tip='"+_t('want', null, 'loot')+"'></b>" + //ChcÄ
		//	"<b class=no onclick='setLoots(1,\""+i.id+"\")' tip='"+_t('dont_want', null, 'loot')+"'></b>" + //Nie chcÄ
		//	(g.loots.init>1?"<b class=need onclick='setLoots(2,\""+i.id+"\")' tip='"+_t('really_want', null, 'loot')+"'></b>":'');

        var stats = parseItemStat(i.stat);
        var cantNeed = "";
        if (isset(stats["reqp"]) && stats["reqp"].indexOf(hero.prof) == -1) {
            cantNeed = "cant-need";
        }

      var onClickYes  = "onclick='sendLoots(0, \""+i.id+"\", \"want\")'";
      var onClickNo   = "onclick='sendLoots(0, \""+i.id+"\", \"not\")'";
      var onClickMust = "onclick='sendLoots(0, \""+i.id+"\", \"must\")'";

        var lootDecision

        if (g.loots.source == 'lootbox') {

            lootDecision = '';

        } else {
            lootDecision =
                "<div class='loot-decision'>" +
                "<b class='yes sel' " + onClickYes + " tip='" + _t('want', null, 'loot') + "'></b>" + //ChcÄ
                "<b class=no " + onClickNo + " tip='" + _t('dont_want', null, 'loot') + "'></b>" + //Nie chcÄ
                (g.loots.init > 1 ? "<b class='need " + cantNeed + "' " + onClickMust + " tip='" + _t('really_want', null, 'loot') + "'></b>" : '');
        }

		lootStr += lootDecision;
		//g.loots.want.push(i.id.toString());
	}


	$('#loots TR').append(lootStr);
	var $animLootWrappers = $('#loots.colorized .loot-wrapper');
	if ($animLootWrappers.length > 0) {
        $animLootWrappers.addClass(getNewItemType(stats));
    }

  setStateOnOneLootItem(i.id);

	if (avatarLoot) {
		var $textInfo = $('#loot' + i.id).find('.nick');
		if ($textInfo[0].scrollWidth >  $textInfo.innerWidth()) $textInfo.tip(charData.name);
	}

}
function getNewItemType (stats) {
    if (stats.hasOwnProperty('heroic')) return 't-her';
    if (stats.hasOwnProperty('unique')) return 't-uniupg';
    if (stats.hasOwnProperty('upgraded')) return 't-upgraded';
    if (stats.hasOwnProperty('legendary')) return 't-leg';
    if (stats.hasOwnProperty('artefact')) return 't-art';
    return 'none';
};
function lootItem (i) {
	return lootboxItem(i);
}
function getNameAndAvatar (id) {
	if (hero.id == id) {
		return {
			name: hero.nick,
			imgUrl: hero.icon
		};
	} else {
		var o = g.other[id];
		if (o) {
			return {
				name: o.nick,
				imgUrl: CFG.opath + o.icon
			};
		}
		var others = lookForInLoadQueue('newOther');
		if (others && others[id]) {
			return {
				name: 	others[id].nick,
				imgUrl:	CFG.opath + others[id].icon
			}
		}
		if (g.loots.owners[id]) {
			return {
				name: 	g.loots.owners[id].nick,
				imgUrl:	CFG.opath + g.loots.owners[id].icon
			}
		}
		return {
			name: 	'Undefined',
			imgUrl:	'/img/def-npc.gif'
		}
	}
}
//////////
function newEmoData (d) {
	for (var i = 0; i < d.length; i++) {
		var dataE = d[i];
		if (dataE.source_type == 2) continue;
		if (dataE.target_type == 2) continue;
		var targetId = isset(dataE.target_id) ? dataE.target_id : false;
    emotion(dataE.name, dataE.source_id, targetId, dataE.end_ts, d);
	}
}

//var objData = hero.id!=id1?allData['other'][id1]:hero;
////if($(o1).length<1) return; //setTimeout(function(){emotion(emo,id1,id2)},250);
//if ($(o1).length < 1) {
//	if (obj || objData) {
//		setTimeout(function() {
//			emotion(emo,id1,id2,allData)
//		}, 250);
//		return;
//	}
//}
//if(id2!= false) {

function emotion(emo,id1,id2,endTs)
{
    if(g.init<4) {
        setTimeout("emotion('"+emo+"',"+id1+","+id2+")",500);
        return;
    }
    var fromServerEmoName = emo;
    var o1=hero.id!=id1?('#other'+id1):'#hero';
    var obj = hero.id!=id1?g.other[id1]:hero;
    if($(o1).length<1) {
        if (id1 == false && id2 == false) {}
        else return;
    } //setTimeout(function(){emotion(emo,id1,id2)},250);
    if(id2!= false) {
        var o2=hero.id!=id2?('#other'+id2):'#hero';
        if($(o2).length<1) return;
    }
    var eid='emo'+Math.round(Math.random()*10000);

    let _img        = null;
    let classToAdd  = null;

    if(emo.substr(0,5) == 'flag-'){
        //var img='<img src="'+CFG.epath+emo+'" class="emo emo-' + emo + '" id='+eid+'>';
        _img = ImgLoader.onload(CFG.epath + emo);
        classToAdd = emo;
        emo = 'flag';
    }else{
        //var img='<img src="'+CFG.epath+emo+'.gif" class="emo emo-' + emo + '" id='+eid+'>';
        _img = ImgLoader.onload(CFG.epath + emo + ".gif");
        classToAdd = emo;
    }

    let atribute = document.createAttribute("id");
    _img.classList.add("emo");
    _img.classList.add("emo-" + classToAdd);
    atribute.value = eid;
    _img.setAttributeNode(atribute);

    let img = $(_img);

    var t1=8000;
    var org_emo = emo;
    emo = /fire/.test(emo) ? 'fireworks' : org_emo;
    emo = /VisualEffects/.test(emo) ? 'VisualEffects' : emo;
    var emoUrl = CFG.epath + org_emo + '.gif';
    var emoUrlPng = CFG.epath + org_emo + '.png';
    switch(emo) {
        case 'away':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            break;
        case 'angry':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            setTimeout("$('#"+eid+"').fadeOut(500)",t1-500);
            setTimeout("$('#"+eid+"').remove()",t1);
            break;
        case 'logoff':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            setTimeout("$('#"+eid+"').remove()", 5000);
            break
        case 'lvlup':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            setTimeout("$('#"+eid+"').remove()", 1000);
            break;
        case 'login':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            setTimeout("$('#"+eid+"').remove()", 2000);
            break;
        case 'teleported':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            setTimeout("$('#"+eid+"').remove()", 3000);
            break;
        case 'respawned':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            setTimeout("$('#"+eid+"').remove()", 2000);
            break;
        case 'abyssout':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            setTimeout("$('#"+eid+"').remove()", 2000);
            break;
        case 'VisualEffects':
            $.getScript('https://www.margonem.pl/js/' + org_emo.split('|')[1] + '.min.js');
            break;
        case 'pvpprotected':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            setTimeout("$('#"+eid+"').remove()", (endTs - (g.ev? g.ev : 0)) * 1000);
            break;
        case 'flag':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            //$(o1).append(img);
            setTimeout("$('#"+eid+"').fadeOut(500, function(){$(this).remove()})",5000);
            break;
        case 'curse':
            (function(){
                //var im = new Image();
                //im.src = CFG.epath+'klatwa.gif?11';
                var c = 0;
                ImgLoader.onload(
                    CFG.epath+'klatwa.gif?11',
                    null,
                    function() {
                        console.log('asd');
                        var tt = this;
                        var $o = $('<div></div>').css({
                            bottom:$(o1).height(),
                            left:$(o1).width()/2 - tt.width/2,
                            width:tt.width,
                            height:tt.height/5,
                            position:'absolute',
                            'z-index':(parseInt($(o2).css('z-index'))-1),
                            'background-image':'url('+CFG.epath+'klatwa.gif?11)'
                        }).addClass('notippropagation').appendTo(o1);
                        setEmoInterval(emo, function(){
                            $o.css({backgroundPosition:'0px -'+(c%4*32)+'px'});
                            c++;
                            if(c==8){
                                popEmoInterval(emo);
                                $o.fadeOut(null, function(){$(this).remove()});
                            }
                        },200);
                    })
            })();
            break;
        case 'lampion1':
        case 'lampion2':
        case 'lampion3':
        case 'lampion4':
        case 'lampion5':
            (function(){
                //var im = new Image();
                //im.src = emoUrl;
                var c = 0;
                ImgLoader.onload(
                    emoUrl,
                    null,
                    function(){
                    var start_pos = [parseInt($(o1).css('left')), parseInt($(o1).css('top'))];
                    var $o = $('<div></div>').css({
                        width:48,
                        height:48,
                        left:start_pos[0],
                        top:start_pos[1],
                        position:'absolute',
                        'background-image':'url('+emoUrl+')',
                        backgroundPosition:'0px -'+(19*48)+'px'
                    }).addClass('notippropagation').appendTo($('#ground'));

                    setEmoInterval(emo, function(){

                        var y = start_pos[1] - c*5;
                        var x = start_pos[0] + c*3;

                        var bg_pos_y = c < 20 ? ((19*48) - (c*48)) : 0;
                        $o.css({
                            backgroundPosition: '0px -'+ bg_pos_y +'px',
                            top: y,
                            left: x,
                            zIndex: getLayerOrder(Math.ceil(y/32), 20)
                        });
                        c++;
                        if(c==100){
                            popEmoInterval(emo);
                            $o.fadeOut(null, function(){$(this).remove()});
                        }
                    },120);
                })
            })();
            break;
        case 'guma1':
        case 'guma2':
        case 'guma3':
        case 'guma4':
            (function(){
                //var im = new Image();
                //im.src = emoUrl;
                var c = 0;
                ImgLoader.onload(emoUrl, null, function(){
                    var tt = this;
                    var $o = $('<div></div>').css({
                        bottom:0,
                        left:$(o1).width()/2 - 16,
                        width:32,
                        height:48,
                        position:'absolute',
                        'z-index':(parseInt($(o2).css('z-index'))-1),
                        'background-image':'url('+emoUrl+')'
                    }).addClass('notippropagation').appendTo(o1);
                    setEmoInterval(emo, function(){
                        $o.css({backgroundPosition:'0px -'+(c*48)+'px'});
                        c++;
                        if(c==11){
                            popEmoInterval(emo);
                            $o.fadeOut(null, function(){$(this).remove()});
                        }
                    },120);
                });
            })();
            break;
        case 'roza':
            (function(){
                //var im = new Image();
                //im.src = emoUrl;
                var c = 0;
                ImgLoader.onload(emoUrl, null, function(){
                    var tt = this;
                    var $o = $('<div></div>').css({
                        bottom:0,
                        left:$(o2).width()/2 - 16,
                        width:32,
                        height:32,
                        position:'absolute',
                        'z-index':(parseInt($(o2).css('z-index'))-1),
                        'background-image':'url('+emoUrl+')'
                    }).addClass('notippropagation').appendTo(o2);
                    setEmoInterval(emo, function(){
                        $o.css({backgroundPosition:'0px -'+(c*32)+'px'});
                        c++;
                        if(c==10){
                            popEmoInterval(emo);
                            setTimeout(function(){
                                $o.remove();
                            }, 5000);
                        }
                    },150);
                });
            })();
            break;
        case 'buzia1':
        case 'buzia2':
            (function(){
                //var im = new Image();
                //im.src = emoUrl;
                var c = 0;
                var frames = emo == 'buzia1' ? 23 : 35;
                ImgLoader.onload(emoUrl, null, function(){
                    var tt = this;
                    var $o = $('<div></div>').css({
                        bottom:0,
                        left:$(o2).width()/2 - 17,
                        width:32,
                        height:48,
                        position:'absolute',
                        'z-index':(parseInt($(o2).css('z-index'))-1),
                        'background-image':'url('+emoUrl+')'
                    }).addClass('notippropagation').appendTo(o2);
                    setEmoInterval(emo, function(){
                        $o.css({backgroundPosition:'0px -'+(c*48)+'px'});
                        c++;
                        if(c==(frames+1)){
                            popEmoInterval(emo);
                            $o.fadeOut(null, function(){$(this).remove()});
                        }
                    },50);
                })
            })();
            break;
        case 'banki':
            (function(){
                //var im = new Image();
                //im.src = emoUrl;
                var c = 0;
                ImgLoader.onload(emoUrl, null, function(){
                    var tt = this;
                    var $o = $('<div></div>').css({
                        bottom:0,
                        left:$(o1).width()/2 - 16,
                        width:32,
                        height:48,
                        position:'absolute',
                        'z-index':(parseInt($(o2).css('z-index'))-1),
                        'background-image':'url('+emoUrl+')'
                    }).addClass('notippropagation').appendTo(o1);
                    setEmoInterval(emo, function(){
                        $o.css({backgroundPosition:'0px -'+(c*48)+'px'});
                        c++;
                        if(c==25){
                            popEmoInterval(emo);
                            $o.fadeOut(null, function(){$(this).remove()});
                        }
                    },120);
                })
            })();
            break;
        case 'emonutki':
            (function(){
                //var im = new Image();
                //im.src = emoUrl;
                var c = 0;
                ImgLoader.onload(emoUrl, null, function(){
                    var tt = this;
                    var $o = $('<div></div>').css({
                        bottom:$(o1).height(),
                        left:$(o1).width()/2 - tt.width/2,
                        width:32,
                        height:32,
                        position:'absolute',
                        'z-index':(parseInt($(o2).css('z-index'))-1),
                        'background-image':'url('+emoUrl+')'
                    }).addClass('notippropagation').appendTo(o1);
                    setEmoInterval(emo, function(){
                        $o.css({backgroundPosition:'0px -'+(c*32)+'px'});
                        c++;
                        if(c==25){
                            popEmoInterval(emo);
                            $o.fadeOut(null, function(){$(this).remove()});
                        }
                    },100);
                });
            })();
            break;
        case 'emosnow':
            (function(){
                //var im = new Image();
                //im.src = emoUrl;
                var c = 0;
                ImgLoader.onload(emoUrl, null, function(){
                    var tt = this;
                    var $o = $('<div></div>').css({
                        top:obj.y*32,
                        left:obj.x*32-32,
                        width:32,
                        height:32,
                        position:'absolute',
                        'z-index':(parseInt($(o2).css('z-index'))-1),
                        'background-image':'url('+emoUrl+')'
                    }).addClass('notippropagation').appendTo('#base');
                    setEmoInterval(emo, function(){
                        $o.css({backgroundPosition:'0px -'+(c*32)+'px'});
                        c++;
                        if(c==45){
                            popEmoInterval(emo);
                            $o.fadeOut(null, function(){$(this).remove()});
                        }
                    },70);
                })
            })();
            break;
        case 'bat':
            //var im = new Image();
            //im.src = emoUrl;
            ImgLoader.onload(emoUrl, null, function(){
                var T = this;
                var $e = $('<div><img src="'+emoUrl+'"/></div>').css({
                    width:T.width,
                    height:T.height,
                    bottom:$(o1).height(),
                    position:'absolute',
                    left:$(o1).width()/2 - T.width/2
                }).addClass('notippropagation').appendTo(o1);
                $e.delay(3000).fadeOut('fast');
            })
            break;
        case 'spider':
            //var im = new Image();
            //im.src = emoUrl;
            ImgLoader.onload(emoUrl, null, function(){
                var T = this;
                var $e = $('<div><img src="'+emoUrl+'"/></div>').css({
                    width:T.width,
                    height:T.height,
                    bottom:$(o1).height(),
                    position:'absolute',
                    left:$(o1).width()/2 - T.width/2
                }).addClass('notippropagation').appendTo(o1);
                $e.delay(3000).fadeOut('fast');
            })
            break;
        case 'ptaszek':
            (function(){
                //var im = new Image();
                //im.src = emoUrlPng;
                var c = 0;
                ImgLoader.onload(emoUrl, null, function(){
                    var tt = this;
                    var $o = $('<div></div>').css({
                        bottom:$(o1).height(),
                        left:$(o1).width()/2 - tt.width/2,
                        width:tt.width,
                        height:tt.height/7,
                        position:'absolute',
                        'z-index':(parseInt($(o2).css('z-index'))-1),
                        'background-image':'url('+emoUrlPng+')'
                    }).addClass('notippropagation').appendTo(o1);
                    setEmoInterval(emo, function(){
                        $o.css({backgroundPosition:'0px -'+(c%7*32)+'px'});
                        c++;
                        if(c==56){
                            $o.fadeOut(null, function(){
                                popEmoInterval(emo);
                                $(this).remove();
                            });
                        }
                    },85);
                })
            })();
            break
        case 'kuciak':
            (function(){
                //var im = new Image();
                //im.src = emoUrlPng;
                var c = 0;
                ImgLoader.onload(emoUrl, null, function(){
                    var tt = this;
                    var $o = $('<div></div>').css({
                        bottom:$(o1).height(),
                        left:$(o1).width()/2 - tt.width/2,
                        width:tt.width,
                        height:tt.height/22,
                        position:'absolute',
                        'z-index':(parseInt($(o2).css('z-index'))-1),
                        'background-image':'url('+emoUrlPng+')'
                    }).addClass('notippropagation').appendTo(o1);
                    setEmoInterval(emo, function(){
                        $o.css({backgroundPosition:'0px -'+(c%22*32)+'px'});
                        c++;
                        if(c==22){
                            popEmoInterval(emo);
                            setTimeout(function(){
                                $o.fadeOut(null, function(){
                                    $(this).remove();
                                });
                            },3000);
                        }
                    },150);
                })
            })();
            break
        case 'ghost':
            (function(){
                //var im = new Image();
                //im.src = emoUrl;
                var c = 0;
                ImgLoader.onload(
                    emoUrl,
                    null,
                    function() {
                        var tt = this;
                        var $o = $('<div></div>').css({
                            top:obj.y*32-50,
                            left:obj.x*32,
                            width:tt.width,
                            height:tt.height/6,
                            position:'absolute',
                            'z-index':(parseInt($(o2).css('z-index'))-1),
                            'background-image':'url('+emoUrl+')'
                        }).appendTo('#base');
                        setEmoInterval(emo, function(){
                            $o.css({backgroundPosition:'0px -'+((c%5)*48)+'px'});
                            c++;
                            if(c==16){
                                popEmoInterval(emo);
                                $o.fadeOut(null, function(){$(this).remove()});
                            }
                        },200);
                    })
            })();
            break;
        case 'zombie':
            (function(){
                //var im = new Image();
                //im.src = CFG.epath + 'lapa.gif?11';
                var c = 0;
                ImgLoader.onload(emoUrl, null, function(){
                    var $o = $('<div></div>').css({
                        top:(obj.y)*32+3,
                        left:obj.x*32+8,
                        width:16,
                        height:32,
                        position:'absolute',
                        'z-index':(parseInt($(o1).css('z-index'))),
                        'background-image':'url('+ CFG.epath +'lapa.gif?11)'
                    }).appendTo('#base');
                    setEmoInterval(emo, function(){
                        $o.css({backgroundPosition:'0px -'+(c*32)+'px'});
                        c++;
                        if(c==6){
                            popEmoInterval(emo);
                            $o.fadeOut(null, function(){$(this).remove()});
                        }
                    },300);
                })
            })();
            break;
        case 'holly':
            (function(){
                var $s=$('<div class=imgemo2></div>')
                    .css({backgroundImage:'url('+emoUrl+')'})
                    .appendTo('#base');
                var of1=$(o1).offset(),of2=$(o2).offset(),dist=Math.max(Math.abs(of1.left-of2.left),Math.abs(of1.top-of2.top));
                $s.css({
                    width:32,
                    height:32,
                    left:of1.left+$('#base').scrollLeft()-g.left,
                    top:of1.top+$('#base').scrollTop()+8-g.top
                })
                    .animate({
                        left:of2.left+$('#base').scrollLeft()-g.left,
                        top:of2.top+$('#base').scrollTop()-20-g.top
                    },500+dist*5,
                    function(){
                        var c=0;
                        setEmoInterval(emo, function(){
                            c++;
                            if(c>6) {
                                $s.remove();
                                popEmoInterval(emo);
                                return;
                            }
                            $s.css('backgroundPosition','0 -'+(c*32)+'px');
                        },300);
                    });
            })();
            break;
        case 'emohug1':
        case 'emohug2':
        case 'emohug3':
            (function(){
                var frames = {
                    emohug1:12,
                    emohug2:15,
                    emohug3:8
                };
                var f_amount = frames[emo];
                var $s=$('<div class=imgemo2></div>')
                    .css({backgroundImage:'url('+emoUrl+')'})
                    .appendTo('#base');
                var of1=$(o1).offset(),of2=$(o2).offset(),dist=Math.max(Math.abs(of1.left-of2.left),Math.abs(of1.top-of2.top));
                $s.css({
                    width:32,
                    height:32,
                    left:of1.left+$('#base').scrollLeft()-g.left,
                    top:of1.top+$('#base').scrollTop()+8-g.top
                })
                    .animate({
                        left:of2.left+$('#base').scrollLeft()-g.left,
                        top:of2.top+$('#base').scrollTop()-20-g.top
                    },500+dist*5,
                    function(){
                        var c=0;
                        var interval = setInterval(function(){
                            c++;
                            if(c>(f_amount-1)) {
                                $s.fadeOut(function(){$(this).remove()});
                                clearInterval(interval);
                                return;
                            }
                            $s.css('backgroundPosition','0 -'+(c*32)+'px');
                        }, 200);
                    });
            })();
            break;
        case 'gift':
            (function(){
                var $s=$('<div class=imgemo2></div>')
                    .css({backgroundImage:'url('+emoUrl+')'})
                    .appendTo('#base');
                var of1=$(o1).offset(),of2=$(o2).offset(),dist=Math.max(Math.abs(of1.left-of2.left),Math.abs(of1.top-of2.top));
                $s.css({
                    width:32,
                    height:32,
                    left:of1.left+$('#base').scrollLeft()-g.left,
                    top:of1.top+$('#base').scrollTop()+8-g.top
                })
                    .animate({
                        left:of2.left+$('#base').scrollLeft()-g.left,
                        top:of2.top+$('#base').scrollTop()+8-g.top
                    },500+dist*5,
                    function(){
                        var c=0;
                        setEmoInterval(emo, function(){
                            c++;
                            if(c>9) {
                                setTimeout(function(){
                                    $s.fadeOut(200, function(){$(this).remove()});
                                },1000)
                                popEmoInterval(emo);
                                return;
                            }
                            $s.css('backgroundPosition','0 -'+(c*32)+'px');
                        },200);
                    });
            })();
            break;
        case 'kiss':
            $('#base').append('<img src="'+emoUrl+'" class=emo2 id='+eid+'>');
            var of1=$(o1).offset(),of2=$(o2).offset();
            $('#'+eid).css({
                left:(of1.left+of2.left>>1)+$('#base').scrollLeft()+8-g.left,
                top:(of1.top+of2.top>>1)+$('#base').scrollTop()-16-g.top
            });
            setTimeout("$('#"+eid+"').fadeOut(500)",t1-500);
            setTimeout("$('#"+eid+"').remove()",t1);
            break;
        case 'battle':
            //$(o1).append(img);
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            break;
        case 'stasis':
            //$(o1).append(img);
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            break;
        case 'frnd':
            appendConteinerAndEmo(o1, img, fromServerEmoName);
            //$(o1).append(img);
            setTimeout("$('#"+eid+"').fadeOut(500, function(){$(this).remove()})",3750);
            //setTimeout("$('#"+eid+"').remove()",t1);
            break;
        case 'snowball':
            var $s=$('<div class=imgemo2></div>')
                .css({backgroundImage:'url('+emoUrl+')'})
                .appendTo('#base');
            var of1=$(o1).offset(),of2=$(o2).offset(),dist=Math.max(Math.abs(of1.left-of2.left),Math.abs(of1.top-of2.top));
            $s.css({
                left:of1.left+$('#base').scrollLeft()+8-g.left,
                top:of1.top+$('#base').scrollTop()+16-g.top
            })
                .animate({
                    left:of2.left+$('#base').scrollLeft()+8-g.left,
                    top:of2.top+$('#base').scrollTop()+8-g.top
                },500+dist*5,
                function(){
                    var c=0;
                    setEmoInterval(emo, function(){
                        c++;
                        if(c>5) {
                            $s.remove();
                            popEmoInterval(emo);
                            return;
                        }
                        $s.css('backgroundPosition','0 -'+(c*16)+'px');
                    },200);
                });
            break;
        case 'cocos':
            var $s=$('<div class=imgemo2></div>')
                .css({backgroundImage:'url('+emoUrl+')',width:32,height:32})
                .appendTo('#base');
            var of1=$(o1).offset(),of2=$(o2).offset(),dist=Math.max(Math.abs(of1.left-of2.left),Math.abs(of1.top-of2.top));
            $s.css({
                left:of1.left+$('#base').scrollLeft()-g.left,
                top:of1.top+$('#base').scrollTop()-g.top
            })
                .animate({
                    left:of2.left+$('#base').scrollLeft()-g.left,
                    top:of2.top+$('#base').scrollTop()-g.top
                },500+dist*5,
                function(){
                    var c=0;
                    setEmoInterval(emo, function(){
                        c++;
                        if(c>10) {
                            $s.remove();
                            popEmoInterval(emo);
                            return;
                        }
                        $s.css('backgroundPosition','0 -'+(c*32)+'px');
                    },200);
                });
            break;
        case 'pillow':
            (function(){
                var $s = $('<div class=imgemo2></div>')
                    .css({backgroundImage: 'url('+CFG.epath+'poducha.gif)'})
                    .appendTo('#base');
                var of1 = $(o1).offset(), of2 = $(o2).offset(), dist = Math.max(Math.abs(of1.left - of2.left), Math.abs(of1.top - of2.top));
                $s.css({
                    width: 32,
                    height: 32,
                    left: of1.left + $('#base').scrollLeft() - g.left,
                    top: of1.top + $('#base').scrollTop() - g.top
                }).animate({
                    left: of2.left + $('#base').scrollLeft() - g.left,
                    top: of2.top + $('#base').scrollTop() - g.top
                }, {
                    duration: 500 + dist * 5,
                    complete: function() {
                        var c = 0;
                        setEmoInterval(emo, function() {
                            c++;
                            if (c > 8) {
                                $s.remove();
                                popEmoInterval(emo);
                                return;
                            }
                            $s.css('backgroundPosition', '0px -' + (3*32 + (c * 32)) + 'px');
                        }, 100);
                    }
                });
                var preHit = 1;
                var preHitAnimation = setInterval(function(){
                    if(preHit > 3){
                        clearInterval(preHitAnimation);
                        return;
                    }
                    $s.css('backgroundPosition', '0px -' + (preHit * 32) + 'px');
                    preHit++
                }, 125)
            })();
            break;
        case 'kiss2':
            var $s=$('<div class=imgemo2></div>')
                .css({backgroundImage:'url('+emoUrl+')'})
                .appendTo('#base');
            var of1=$(o1).offset(),of2=$(o2).offset(),dist=Math.max(Math.abs(of1.left-of2.left),Math.abs(of1.top-of2.top));
            $s.css({
                width:32,
                height:32,
                left:of1.left+$('#base').scrollLeft()-g.left,
                top:of1.top+$('#base').scrollTop()+16-g.top
            })
                .animate({
                    left:of2.left+$('#base').scrollLeft()-g.left,
                    top:of2.top+$('#base').scrollTop()-g.top-15
                },500+dist*5,
                function(){
                    var c=0;
                    setEmoInterval(emo, function(){
                        c++;
                        if(c>13) {
                            $s.remove();
                            popEmoInterval(emo);
                            return;
                        }
                        //$s.css('backgroundPosition','0 -'+(c*16)+'px');
                    },200);
                });
            break;
        case 'fireworks':
            (function(){
                /**
                 * w - frame width
                 * h - frame height
                 * i - animation frames
                 * b - after [b] frames start explosion
                 * f - amount of flight frames
                 * r - repeat flight animation
                 */
                var cfg = {w:48,h:48,i:25,b:20,f:2,r:true}
                switch(org_emo){
                    case 'fire_1':
                    case 'fire_2':
                        cfg.i = 12; cfg.b = 4; cfg.r=false; cfg.f=4;
                        break;
                    case 'fire_3':
                    case 'fire_4':
                    case 'fire_5':
                    case 'fire_6':
                    case 'fire_7':
                        cfg.i = 15; cfg.b = 5; cfg.r=false; cfg.f=5;
                        break;
                    case 'fire_8':
                        cfg.i = 22; cfg.b = 5; cfg.r=false; cfg.f=5;
                        break;
                    case 'fire_9':
                        cfg.i = 15; cfg.b = 3; cfg.r=false; cfg.f=3;
                        break;
                }
                var $s=$('<div class=imgemo2></div>').css({
                    backgroundImage:'url('+emoUrl+')',
                    width:48,
                    height:48
                })
                    .appendTo('#base');
                var of1=$(o1).offset(),c=0,topf=of1.top+$('#base').scrollTop()-16-g.top;
                $s.css({
                    left:of1.left+$('#base').scrollLeft()-8-g.left,
                    top:topf
                });
                setEmoInterval(emo, function(){
                    c++;
                    if(c>cfg.i) {
                        $s.remove();
                        popEmoInterval(emo);
                        return;
                    }
                    if(c<cfg.b) $s.css({
                        backgroundPosition:'0 -'+((cfg.r ? (c%cfg.f) : c)*48)+'px',
                        top:topf-c*(cfg.r ? 6 : 12)
                    });
                    else $s.css('backgroundPosition','0 -'+((c-(cfg.r ? cfg.b-2 : 0))*48)+'px');
                },75);
            })();
            break;
        case 'water':
            (function(){
                var $s=$('<div class=imgemo2></div>').css({
                    backgroundImage:'url('+emoUrlPng+')',
                    width:16,
                    height:56
                })
                    .appendTo('#base');
                var of1=$(o1).offset(),c=0,topf=of1.top+$('#base').scrollTop()-16-g.top;
                $s.css({
                    left:of1.left+$('#base').scrollLeft()+8-g.left,
                    top:topf
                });
                setEmoInterval(emo, function(){
                    c++;
                    if(c>10) {
                        $s.remove();
                        popEmoInterval(emo);
                    }
                    else $s.css('backgroundPosition','0 -'+(c*64)+'px');
                },125);
            })();
            break;
        case 'stars':
            (function(){
                var $s=$('<div class=imgemo2></div>').css({
                    backgroundImage:'url('+CFG.epath+'gwiazdki.gif)',
                    width:32,
                    height:32
                })
                    .appendTo('#base');
                var of1=$(o1).offset(),c=0,topf=of1.top+$('#base').scrollTop()-16-g.top;
                $s.css({
                    left:of1.left+$('#base').scrollLeft()-g.left,
                    top:topf
                });
                setEmoInterval(emo, function(){
                    c++;
                    if(c>=20) {
                        $s.remove();
                        popEmoInterval(emo);
                    }
                    else $s.css('backgroundPosition','0 -'+(c*32)+'px');
                },80);
            })();
            break;
        case 'termofor':
            (function(){
                var $s=$('<div class=imgemo2></div>').css({
                    backgroundImage:'url('+emoUrl+')',
                    width:32,
                    height:32
                })
                    .appendTo('#base');
                var of1=$(o1).offset(),c=0,topf=of1.top+$('#base').scrollTop()-32-g.top;
                $s.css({
                    left:of1.left+$('#base').scrollLeft()-g.left,
                    top:topf
                });
                setEmoInterval(emo, function(){
                    c++;
                    if(c>=11) {
                        $s.remove();
                        popEmoInterval(emo);
                    }
                    else $s.css('backgroundPosition','0 -'+(c*32)+'px');
                },200);
            })();
            break;
        case 'noemo':
            $(o1+' IMG').remove();
            break;
    }
}

function appendConteinerAndEmo (selector, $emo, name) {
    var $cointainer = $(selector).find('.emo-cointainer');
    if ($cointainer.length < 1) {
        $cointainer = $('<div>').addClass('emo-cointainer');
        $(selector).append($cointainer);
    }
    var $e = $cointainer.find('.emo-' + name);
    if ($e.length > 0) $e.remove();
    $cointainer.append($emo);
}

function removeEmotionBySourceIdAndEmoType(type, sourceId) {
    if (g.other[sourceId])        $('#other' + sourceId).find('.emo-' + type).remove();
    else if (hero.id == sourceId) $('#hero').find('.emo-' + type).remove();
}

/*
 * Registers global interval for emotion animation so it could be easily removed later
 * @emo emotion type
 * @fun function to run
 * @ms miliseconds (like in setInterval() function)
 */
function setEmoInterval(emo, fun, ms){
    if (!isset(g.emoIntervals[emo]))g.emoIntervals[emo] = [];
    g.emoIntervals[emo].splice(0, 0, setInterval(fun, ms));
}

/*
 * Removes oldest interval from interval group named by @emo
 * @emo emotion group
 */
function popEmoInterval(emo){
    if (isset(g.emoIntervals[emo]) && g.emoIntervals[emo].length > 0) clearInterval(g.emoIntervals[emo].pop());
}

function setBlockSendNextInit (state) {
    g.blockSendNextInit = state;
};

function startEngine(){
    g.engineStopped=false;
}

function stopEngine(){
    g.engineStopped=true;
    clearInterval(g.gt);
    sound.manager.engineStop();
}

function PvpIndicator(){
    this.toggleShow = function(force){
        if ($('#pvpStatMainBox').css('display') == 'none' || isset(force)){
            $('#pvpStatMainBox').show(100);
        }else{
            $('#pvpStatMainBox').hide(100);
        }
    }
    this.setValue = function(val){
        if (val == 0){
            $('#pvpStatContainer .indicator').css({width:0});
            //$('#pvpStatContainer .infoBox').html('MoÅ¼liwy podbÃ³j lokacji.').show().animate({top:(50-$('#pvpStatContainer .infoBox').width()/2)});
        }else{
            var indicator = Math.abs(val)/2;
            //var multiplier = 1+(Math.abs(val)/100)*3;
            if (val < 0){
                $('#pvpStatContainer .raise .indicator').css({width:0});
                $('#pvpStatContainer .fall .indicator').animate({width:indicator});
                //$('#pvpStatContainer .infoBox').html('<span style="color:red">Lokacja stracona w: '+Math.abs(val)+'% <br />Zmniejszenie doÅwiadczenia: '+roundNumber(multiplier,2)+'x</span>').animate({top:(50+indicator-$('#pvpStatContainer .infoBox').height()/2)}).show();
            }else{
                $('#pvpStatContainer .raise .indicator').animate({width:indicator});
                $('#pvpStatContainer .fall .indicator').css({width:0});
                //$('#pvpStatContainer .infoBox').html('<span style="color:lime">Lokacja podbita w: '+Math.abs(val)+'% <br />ZwiÄkszenie doÅwiadczenia: '+roundNumber(multiplier,2)+'x</span>').animate({top:(50-indicator-$('#pvpStatContainer .infoBox').height()/2)}).show();
            }
        }

    }
}


function PlayerCatcher() {
    this.activePlayer = null;
    this.alreadyActive = [];
    this.follow = null;
    this.followInterval = null;
    this.tmpZIndex = null;

    this.next = function(){
      //if (map.pvp == 0) return;
      if (this.followInterval != null) clearInterval(this.followInterval);
      this.follow = null;
      this.revertZIndex();
      for(var i in g.other){
          var cnt = false;
          if (Math.abs(g.other[i].x - hero.x) <= 8 && Math.abs(g.other[i].y - hero.y) <= 8){
              for (var k = 0; k < this.alreadyActive.length; k++){
                  if (this.alreadyActive[k] == i){
                      cnt = true;
                      break;
                  }
              }
              if (cnt) continue;
              else {this.activatePlayer(i);return;}
          }
      }
      this.resetAll();
    };

    this.revertZIndex = function () {
      if (this.activePlayer != null && isset(g.other[this.activePlayer])){
          $('#other'+this.activePlayer).css('z-index', this.tmpZIndex);
      }
    };

    this.activatePlayer = function (id) {
      this.alreadyActive.push(id)
      $('.other').css('border', '');
      this.activePlayer = id;
      this.tmpZIndex = $('#other'+this.activePlayer).css('z-index');
      $('#other'+this.activePlayer).css({'border':'1px solid #ff0000', 'z-index':221});
    };

    this.startFollow = function () {};
    this.calculatePath = function () {};
    this.refreshPath = function () {};
    this.stopFollow = function () {};
    this.resetAll = function () {
      $('.other').css('border', '');
      this.alreadyActive = [];
      this.activePlayer = null;
    };
}

function GameLoader(){
    this.steps = {
        map:{msg:_t('map_file', null, 'loader'),status:false}, //'Plik mapy'
        loc:{msg:_t('location', null, 'loader'),status:false}, //'Lokacja'
        npc:{msg:_t('npc', null, 'loader'),status:false}, //'Npc'
        items:{msg:_t('items', null, 'loader'),status:false}, //'Przedmioty'
        player:{msg:_t('player', null, 'loader'),status:false} //'Gracz'
    }
    this.maxStep=5;
    this.infoDelay=null;
    this.startStep=function(name){
        $('#loading .progressInfo').append('<span class="step_'+name+'">'+this.steps[name].msg+'</span>');
    }
    this.finishStep=function(name){
        $('#loading .progressInfo .step_'+name).css('color','lime');
        this.steps[name].status=true;
        this.progress();
    }
    this.activateDelayedInfo = function(){
        this.infoDelay = setInterval(function(){
            $('#loading .helptxt').fadeIn(500);
        },10000)
    }
    this.progress = function(){
        var step=0;
        if (this.infoDelay !== null){
            clearInterval(g.gameLoader.infoDelay);
        }
        this.activateDelayedInfo()
        for(var i in this.steps){
            if (this.steps[i].status) step++;
        }
        $('#loading .bar').width($('#loading .progressbar').width()/this.maxStep*step);
        if (step==5){
            $('#loading .progressbar').delay(600).fadeOut();
            $('#loading .progressInfo').delay(600).fadeOut();
            clearInterval(g.gameLoader.infoDelay);
            delete g.gameLoader;
        }
    }
    this.activateDelayedInfo();
}

var conquerStats = {
    result:[],
    order:false,
    show:function(data){
        this.result=[];
        if (data.length>0){
            data = data.split('|');
            for (var i=0; i<data.length; i+=4){
                var conquer = /m|t|b/.test(hero.prof) ? parseInt(data[i+3])*-1 : parseInt(data[i+3]);
                this.result.push({id:parseInt(data[i]),pId:parseInt(data[i+1]),name:data[i+2],c:parseInt(conquer)});
            }
            this.result.sort(function(e1,e2){
                return e2.c - e1.c;
            })
        }
        this.display();
        if (this.result.length>13){
            addScrollbar('conquerStatWrapper', 370, 'conquestSroll', false);
        }
    },
    display:function(){
        mAlert('<div id="conquer_stats_box">'+this.render(this.order)+'</div>', null, null, 'msg');
    },
    prepareList:function(groupped){
        if (!groupped) return this.result;
        var tmpResult = {};
        for(var i=0; i<this.result.length; i++){
            var pId = this.result[i].pId == 0 ? id : this.result[i].pId;
            if (!isset(tmpResult[pId])) tmpResult[pId] = [];
            tmpResult[pId].push(this.result[i]);
        }
        return tmpResult;
    },
    render:function(groupped){
        var list = this.prepareList(groupped);
        var html='<h3>'+_t('conquer_loc_stats', null, 'map')+':</h3><div id="conquerStatWrapper">'; //Statystyki podbitych lokacji:
        if (this.result.length>0){
            if(groupped){
                for(var i in list){
                    html += '<div class="conquerGroup">';
                    for(var j=0; j<list[i].length; j++){
                        html += this.renderLine(list[i][j], (j == list[i].length-1));
                    }
                    html += '</div>';
                }
            }else{
                html += '<div>';
                for(var i=0; i<list.length; i++){
                    html += this.renderLine(list[i], (i == list.length-1));
                }
                html += '</div>';
            }
        }else{
            html += _t('no_data', null, 'map'); //'Brak danych...'
        }
        html += '</div>'
        return html;
    },
    getTip:function(e){
        var multiplier = 1+(e.c/100)*3;
        if (e.c < 0){
            return _t('loc_lost %val% %exp%', {'%val%':Math.abs(e.c), '%exp%':roundNumber(multiplier,2)}, 'map'); //'Lokacja stracona w: '+Math.abs(e.c)+'% <br />Zmniejszenie doÅwiadczenia: '+roundNumber(multiplier,2)+'x';
        }else{
            return _t('loc_conquer %val% %exp%', {'%val%':e.c, '%exp%':roundNumber(multiplier,2)}, 'map'); //'Lokacja podbita w: '+e.c+'% <br />ZwiÄkszenie doÅwiadczenia: '+roundNumber(multiplier,2)+'x';
        }
    },
    renderLine:function(e, last){
        return '<div tip="'+this.getTip(e)+'" class="el'+(e.c>0?' g':' r')+(last?' last':'')+'">'+
            '<div class="name">'+(e.name.length>25 ? e.name.substr(0, 25)+'...' : e.name)+' <strong>'+Math.abs(e.c)+'%</strong></div>'+
            '<div class="bar">'+
            '<div class="red"><div style="width:'+(e.c<0?(Math.abs(e.c)/2)+'px':'0px')+'" class=indicator></div></div>'+
            '<div class="green"><div style="width:'+(e.c>0?(e.c/2)+'px':'0px')+'" class=indicator></div></div>'+
            '<div style="clear:both"></div>'+
            '</div>'+
            '<div style="clear:both"></div>'+
            '</div>';
    },
    changeOrder:function(){

    }
}

function ItemRecovery(data){
    /** Map with itemId:removeTime */
    this.times = {};
    /** Amount of items possible to recover */
    this.recoverAmount = 0;
    /** Item buffer */
    this.itemsBuffer = [];
    /** Used to check if item is confirmed when second of .recoverItem() is made */
    this.itemToConfirm = null;
    this.init = function(data){
        if (data.length>0){
            for (var i=0; i<data.length; i+=2){
                this.times[data[i]] = data[i+1];
                this.recoverAmount++;
            }
        }
        if (this.recoverAmount == 0) mAlert(_t('no_items_to_recover', null, 'recover'), null, null, 'msg'); //'Brak przedmiotÃ³w do odzyskania...'
    }
    /** Renders list from items put in itemsBuffer array. Adds scrollbar if list
     *has more than 8 elements
     */
    this.renderBufferedItems = function(){
        var html = '';
        for (var i=0; i<this.itemsBuffer.length; i++){
            var it = this.itemsBuffer[i];

            var hClasses = {
                'upgraded':'t_upg',
                'unique':'t_uni',
                'heroic':'t_her',
                'legendary':'t_leg',
                'artefact':'t_art'
            }
            var hClass = [];
            for(var h in hClasses){if(RegExp(h).test(it.stat)){hClass.push(hClasses[h]);break;}}

            const $item = createItem(it);
            //const $itemHighlighter = $(`<!--<div class="itemHighlighter ${hClass.join(' ')} ${(hero.opt&4096 ? 'nodisp' : '')}"></div>-->`);
            const $itemHighlighter = $(`<div class="itemHighlighter ${hClass.join(' ')} ${getClassOfItemRank()}"></div>`);
            $item.append($itemHighlighter);

            html += '<li id="recovery'+it.id+'" class="'+(i == this.itemsBuffer.length-1 ? 'last' : '')+'">'+
            $item[0].outerHTML+
                //Zniszczony '+calculateDiff(it.time, unix_time())+' temu
                //PrzywrÃ³Ä za 1 sÅ
            '<div class="recoveryInfo"><span class="dateInfo">'+_t('item_destroyed %timeago%', {'%timeago%':calculateDiff(it.time, unix_time())}, 'recover')+'</span><span class="button" onclick="g.itemRecovery.recoverItem('+it.id+')">'+_t('recover_1sl', null, 'recover')+'</span></div>'+
            '</li>';
        }
        //Odzyskiwanie przedmiotÃ³w
        //- PrzywrÃ³cenie dowolnego przedmiotu kosztuje 1 SÅ<br />- Po przywrÃ³ceniu przedmiot ma wartoÅÄ 1 sztuki zÅota, jest zwiÄzany z postaciÄ oraz nie moÅ¼e byÄ wystawiony na aukcje
        mAlert('<h4>'+_t('item_recover_header')+'</h4><p style="color:red">'+_t('item_recover_info', null, 'recover')+'</p><br /><div id="itemRecoveryList">'+
            (this.recoverAmount == 0 ? _t('no_items_on_list', null, 'recover') : '<ul>'+html+'</ul>')+'</div>' //'Brak przedmiotÃ³w na liÅcie...'
            , null, null, 'msg');
        $('#alert').css({'left':$('#base').offset().left+256-$('#alert').width()/2});
        if (this.recoverAmount > 8) addScrollbar('itemRecoveryList', 370, 'recoverItemScroll');
    }
    /** Adds item object to buffer array. If buffer length is qoal to amount of
     *items possible to recover then its displayed in alert box. Sorts items
     *by remove time descending*/
    this.addItem = function(item){
        item.time = this.times[item.id];
        this.itemsBuffer.push(item);
        if (this.itemsBuffer.length == this.recoverAmount){
            this.itemsBuffer.sort(function(e1,e2){
                return e2.time - e1.time;
            })
            this.renderBufferedItems();
        }
    }
    /** Recovers item with given id. When called first time it sets the item to be
     *confirmed, confirmation is made with second call with the same id used. If
     *id is different in second call then it marks new item.
     **/
    this.recoverItem = function(id){
        if (!this.itemToConfirm){
            this.itemToConfirm = id;
            $('#recovery'+id+' span.button').html(_t('accept', null, 'recover')); //'PotwierdÅº!'
        }else{
            if (this.itemToConfirm == id){
                _g('recovery&item='+id);
            }else{
                $('#recovery'+this.itemToConfirm+' span.button').html(_t('recover_1sl', null, 'recover')) //'PrzywrÃ³Ä za 1 sÅ'
                $('#recovery'+id+' span.button').html(_t('confirm_recover', null, 'recover')); //'PotwierdÅº!'
                this.itemToConfirm = id;
            }
        }
    }
    /** Removes item from the list after successfull recover.*/
    this.removeItem = function(id){
        if ($('#recovery'+id)){
            this.recoverAmount--;
            $('#recovery'+id).remove();
            if (this.recoverAmount <= 8) $('#recoverItemScroll').remove();
        }
    }
    this.init(data);
}

var PK_watch={
    list:null,
    miniPos:0, //0-bottom, 1-top
    firstRun:true,
    filter:'',
    watchList:[],
    enabled:false,
    mini:null,
    container:null,
    firstParse:false,
    box:null,
    hasScroll:false,
    blockSendPkToChat: false,
    parse:function(data){
        if (lengthObject(data) != 0) {
            //var data2 = data.split(';');
            this.list = {};
            for (var k in data){
                this.list[k] =[ data[k].id, data[k].nick, data[k].town, '', data[k].x, data[k].y, data[k].lvl, data[k].oplvl, data[k].prof]
            }
            //for (var i=0; i<data2.length; i++){
						//
            //}
            //for (var i=0; i<data2.length; i++){
            //    var tmp = data2[i].split(',');
            //    this.list[tmp[0]] = tmp;
            //}
        }else{
            this.list = null;
        }
        this.firstParse=true;
        this.updateHtml();
    },
    lvl: function (name) {
        if (!this.blockSendPkToChat) {
            //chatSendMsg('/lvl '+name);
            getEngine().chatController.getChatWindow().manageChatWindowAfterEnter();
            this.blockSendPkToChat = true;
            setTimeout(() => {
                this.blockSendPkToChat = false;
            }, 3000)
        }
    },
    updateHtml:function(){
        if (this.enabled){
            this.container.find('.list li').addClass('old');
            if (this.firstParse){
                this.container.find('.waiter').remove();
                if ($('#pk_filter').css('display') == 'none') $('#pk_filter').css('display', 'inline');
            }
            for(var i in this.list){
                var tmp = this.list[i];

                let charaData = {
                    showNick        : true,
                    level           : tmp[6],
                    operationLevel  : tmp[7],
                    prof            : tmp[8],
                    nick            : tmp[1]
                }

                let characterInfo    = getCharacterInfo(charaData);

                //var body = '<div class="name">'+this.getButton(tmp[0])+'<span onclick="PK_watch.lvl(\''+tmp[1]+'\'); return false;" class="name">'+tmp[1]+'</span></div><div class="loc">'+tmp[2]+'<span>('+tmp[4]+','+tmp[5]+')</span></div><div class=clear></div>';
                var body = '<div class="name">'+this.getButton(tmp[0])+'<span onclick="PK_watch.lvl(\''+tmp[1]+'\'); return false;" class="name">'+characterInfo+'</span></div><div class="loc">'+tmp[2]+'<span>('+tmp[4]+','+tmp[5]+')</span></div><div class=clear></div>';
                var other = this.container.find('#pk'+tmp[0]).detach();
                if (other.length) other.html(body).attr('class', '');
                else other = $(document.createElement('li')).html(body);
                other.attr('id', 'pk'+tmp[0]);//.addClass('loc'+tmp[3]);
                var reg = new RegExp(this.filter, 'ig');
                if (this.filter == '' || reg.test(tmp[1])){
                    var matches = tmp[1].match(reg);
                    //var tmpLocMatch = this.container.find('.list .loc'+tmp[3]+':first');
                    if (this.filter != '') other.find('div.name span.name').replaceWith(other.find('div.name span.name').html().replace(reg,'<span class="sel">'+matches[0]+'</span>'));
                    if (map.name == tmp[2]){
                        this.container.find('.list').prepend(other);
                    }else{
                        //var tmpLocMatch = this.container.find('.list .loc'+tmp[3]+':first');
                        //if (tmpLocMatch.length) other.insertBefore(tmpLocMatch);
                        //else this.container.find('.list').append(other);
                        this.container.find('.list').append(other);
                    }
                }
            }
            this.container.find('.list .old').remove();
            var amount = this.container.find('.list li').length;
            if (amount>10 && !this.hasScroll){addScrollbar('pk_list_container', 490, 'pk_list_scroll', false);this.hasScroll=true;}
            else if(this.hasScroll && amount<=10){removeScrollbar('pk_list_container', 'pk_list_scroll');this.hasScroll=false;}
            if (this.firstParse){
                if (amount<=0) $('#pk_list_info').css('display', 'block');
                else $('#pk_list_info').css('display', 'none');
            }
        }
        this.showOrUpdateMini();
    },
    applyFilter:function(val){
        this.filter = val;
        this.updateHtml();
        this.saveSettings();
    },
    start:function(data){
        this.enabled=true;
        this.getSettings();
        var T = this;
        if (!this.container && this.enabled){
            var input = $(document.createElement('input')).attr('id', 'pk_filter').keyup(function(e){
                T.applyFilter($(this).val());
            }).val(this.filter);
            //Lista graczy poszukiwanych listem goÅczym:
            //Filtruj:
            //Wczytywanie listy...
            this.container = $(document.createElement('div')).attr('id', 'pk_list').append('<h3>'+_t('pklist_header', null, 'pklist')+'</h3><span class=header>'+_t('pk_filter', null, 'pklist')+'</span>').append(input).append('<span class="waiter">'+_t('loading_list', null,'pklist')+'</span>');
            this.container.append($(document.createElement('span')).click(function(){T.hide()}).addClass('pk_closeButton closebut'));
            this.container.append($(document.createElement('div')).attr('id', 'pk_list_container'));
            var list = $(document.createElement('ul')).addClass('list');
            this.container.find('#pk_list_container').append(list).append('<div id="pk_list_info">'+_t('list_empty', null, 'pklist')+'</div>'); //Lista jest pusta...
            $('#centerbox').append(this.container);
            this.container.fadeIn();
            this.enabled=true;
            this.container.on('click', '#pk_list_container span.ctrl', function(e){
                var id = parseInt($(this).parent().parent().attr('id').substr(2));
                T.toggleWatch(parseInt(id));
            });
            g.lock.add('pkwatch');
        }
        _g('wanted&show=1');
        this.update(data);
    },
    update:function(data){
        this.getSettings();
        if (isset(data)) this.parse(data);
        this.updateHtml();
        if (this.watchList.length<=0 && !this.enabled) _g('wanted&show=0');
    },
    getButton:function(id){
        var isW = this.watchList.indexOf(parseInt(id))>=0; //is wanted
        //'UsuÅ z listy obserwowanych'
        //'Dodaj do listy obserwowanych'
        return '<span tip="'+(isW?_t('remove_observed', null, 'pklist'):_t('add_observed', null, 'pklist'))+'" class="ctrl '+(isW?'r':'g')+'">'+(isW?'[-]':'[+]')+'</span> ';
    },
    toggleWatch:function(id){
        if (this.watchList.indexOf(id)<0) this.addToWatch(id);
        else this.removeFromWatch(id);
    },
    addToWatch:function(id){
        var limit = 10;
        var added = false;
        if (this.watchList.indexOf(id)<0 && this.watchList.length>=limit){
            for(var i=0;i<this.watchList.length;i++){
                if (!isset(this.list[this.watchList[i]])){this.watchList.splice(i, 1, id);added=true;break;}
            }
        }else if(this.watchList.indexOf(id)<0){
            this.watchList.push(id);added=true;
        }
        if (added){
            this.updateHtml();
            this.saveSettings();
        }else{
            //'OsiÄgniÄto limit obserwowanych, usuÅ kogoÅ z listy aby dodaÄ nastÄpnego.'
            mAlert(_t('observed_limi_reached', null, 'pklist'));
        }
    },
    removeFromWatch:function(id){
        if (this.watchList.indexOf(id)>=0) this.watchList.splice(this.watchList.indexOf(id),1);
        this.saveSettings();
        this.updateHtml();
    },
    showOrUpdateMini:function(){
        var T=this;
        if (this.watchList.length>0){
            var amount = 0;
            var container = $(document.createElement('div')).addClass('pk_mini_wrapper');
            for(var i in this.list){
                var tmp = this.list[i];
                if (this.watchList.indexOf(parseInt(tmp))>=0){
                    var tmpLocMatch = container.find('.m_loc'+tmp[3]+':first');
                    var body = $(document.createElement('div')).addClass('el').addClass('m_loc'+tmp[3]);
                    body.append('<span class=name>'+tmp[1]+'</span> <span class=loc>'+tmp[2]+'('+tmp[4]+','+tmp[5]+')</span>');
                    if (tmp[3] == map.id) container.prepend(body);
                    else if (tmpLocMatch.length) body.insertBefore(tmpLocMatch);
                    else container.append(body);
                    amount++;
                }
            }
            container.append('<div style="clear:both"></div>');
            if (!this.mini && amount) {
                this.mini = $(document.createElement('div')).attr('id', 'pk_mini');
                this.mini.appendTo('#centerbox2');
            }
            if (this.mini != null && amount){
                this.mini.html('');
                this.mini.append(container).append($(document.createElement('div')).addClass('list').click(function(){
                    T.start();
                    //'OtwÃ³rz listÄ'
                }).attr('tip', _t('open_list', null, 'pklist'))).append($(document.createElement('div')).addClass('del').click(function(){
                    T.watchList=[];
                    T.saveSettings();
                    T.update();
                }).attr('tip', _t('clear_list', null, 'pklist'))); //'WyczyÅÄ listÄ'
            }
        }else{
            if (this.mini != null){this.mini.remove();this.mini = null;}
        }
    },
    getSettings:function(){
        var cfg = getCookie('pkWatch');
        if (cfg){
            cfg = cfg.split('|');
            //this.filter=cfg[0];
            this.miniPos=parseInt(cfg[1]);
            var tmp=cfg[2].split(',');
            this.watchList=[];
            for(var i=0; i<tmp.length; i++) if (!isNaN(parseInt(tmp[i]))) this.watchList.push(parseInt(tmp[i]));
        }
    },
    saveSettings:function(){
        setCookie('pkWatch', '0|'+this.miniPos+'|'+(this.watchList.length?this.watchList.join(','):''));
    },
    hide:function(force){
        g.lock.remove('pkwatch')
        if (this.watchList.length<=0 || (isset(force) && force)) _g('wanted&show=0');
        this.enabled=false;
        this.list=null;
        this.hasScroll=false;
        this.firstParse=false;
        if (this.container != null) this.container.remove();
        this.container = null;
    }
}

var qlog = new (function(d){
    this.init = function(d){
        g.qlogVisible = true;
        var html = '';
        var ql = [];
        for(var i=0;i<d.length;i+=5){
            var gq = /g/.test(d[i]);
            var day = /d/.test(d[i]);
            var ext = '';
            var qId = d[i].replace(/g|d/, '');
            var qtrack = getCookie('qtrack'+hero.id);
            var txt = d[i+4].split('<br>');
            var brings = [];
            for(var j=1; j<txt.length; j++){
                brings.push('- '+txt[j].replace(/#[KB]\.([0-9]+)#/g, ''));
            }
            if(day || gq) ext = '<small class="dg_q" tip="'+(day?_t('daily_quest', null, 'quest'):_t('quild_quest', null, 'quest'))+'">'+(day?'D':'G')+'</small>';
            var img = new Image();
            img.extId = qId;
            img.src = CFG.npath+d[i+3];
            img.onload = function(){
                var ratio = [];
                var mw = 50, mh = 60;
                ratio.push(this.width > mw ? mw/this.width : 1);
                ratio.push(this.height > mh ? mh/this.height : 1);
                var min = 1;
                for(var i=0; i<ratio.length; i++) if(ratio[i] < min) min = ratio[i];
                var $im = $(this);
                if(min !== 1){
                    $im.css({
                        width:Math.floor(this.width*min),
                        heigh:Math.floor(this.height*min)
                    });
                }
                $('#questObj_'+this.extId).append($im.addClass('questObjImg'));
            };
            ql.push('<div id="questObj_'+qId+'" class=questObj><h3>'+
            ext+d[i+1]+'<small class="btn q_abadon" onclick=cancelQuest(\''+qId+'\')>abandon</small>'
            +'<small onclick=questTrack.toggleTrack(\''+qId+'\') class="btn q_track '+(parseInt(qId)==qtrack?'active':'')+'" id=qtrack'+qId+'>track</small>'
            +'</h3><div style="width:285px;">'+d[i+2]+': <span class="qmsg">'+txt[0]+'</span><div class="auxinfo">'+brings.join('<br>')+'</div></div></div>');
        }
        showDialog((_l()=='en' ? 'en/' : '')+'quests-title.png','<div class="scroll400 questlist">'+ql.join('<p></p>')+'</div>')
    }
});
var cancelQuest = function(id){
    mAlert(_t('quest_cancel_confirm', null, 'quest'), 2, [function(){questTrack.stopTracking(id);_g('quests&cancel='+id);}]);
}
var questTrack = new (function(){
    var updating = false;
    this.trackList={};
    this.activeTrack=null;
    this.tasks = {};
    this.gwHighlight = null;
    this.trackedNpcs = {};
    this.resetTasks=function(){
        this.tasks = {};
        this.trackedNpcs = {};
        for(var i in this.trakList) delete(this.trakList[i].closerPos);
    }
    this.checkTaskNpc=function(id){
        var tmp = g.npc[id];
        if(isset(this.trackedNpcs[id]) && typeof(tmp) == 'undefined'){
            if(isset(this.trackList[this.activeTrack][this.trackedNpcs[id]].closerPos[id])){
                var rqt = false; //remove qTarget, add placeholder
                var rqtPos = this.trackList[this.activeTrack][this.trackedNpcs[id]].closerPos[id];
                $('#qTarget_'+rqtPos[1]+'_'+rqtPos[2]).remove();
                if(this.trackList[this.activeTrack][this.trackedNpcs[id]].pos[1] == this.trackList[this.activeTrack][this.trackedNpcs[id]].closerPos[id][1] &&
                    this.trackList[this.activeTrack][this.trackedNpcs[id]].pos[2] == this.trackList[this.activeTrack][this.trackedNpcs[id]].closerPos[id][2]){
                    rqt = this.trackedNpcs[id];
                }
                delete(this.trackList[this.activeTrack][this.trackedNpcs[id]].closerPos[id]);
                delete(this.trackedNpcs[id]);
                if(rqt){
                    this.putPlaceholder(rqt, /#[B]\.([0-9]+)#/.test(this.trackList[this.activeTrack].data) ? 'item' : 'npc');
                }
            }
        }else if(typeof(tmp) != 'undefined' && this.activeTrack){
            var tmpid = null;
            for( var i in this.tasks){
                if(this.tasks[i] == tmp.nick) tmpid = i;

                //check if NPC has the same position as any task (BRING pointed at shop NPC)
                if(tmpid == null && isset(this.trackList[this.activeTrack])){
                    var p = this.trackList[this.activeTrack][i].pos;
                    if(parseInt(p[1]) == tmp.x &&
                        parseInt(p[2]) == tmp.y){
                        tmpid = i;
                    }
                }
            }
            if(tmpid !== null){
                this.trackedNpcs[id] = tmpid;
                if(!isset(this.trackList[this.activeTrack][tmpid].closerPos)) this.trackList[this.activeTrack][tmpid].closerPos = {};
                this.trackList[this.activeTrack][tmpid].closerPos[id] = [1,tmp.x,tmp.y];
                this.removePlaceholder(this.trackList[this.activeTrack][tmpid].closerPos[id]);
            }
        }
    }
    this.updateQtrack=function(d){
        if($('#quests').css('display')=='block'){
            _g('quests');
        }
        $('.qArrow').remove();
        $('.qTarget').remove();
        $('.qtrack_placeholder').remove();
        $('.gw').removeClass('highlight');
        updating = true;
        //array of quests ids which were reset during loop
        //needed to avoid reseting them again in one loop
        var reset = [];
        $('.qArrow').remove();
        //var update = false;
        for(var i in d){

            if(d[i] == '*'){
                this.trackList = {};
                continue;
            }
            if(d[i] == ''){
                if(d.length==1 && this.activeTrack && isset(this.trackList[this.activeTrack])){
                    delete this.trackList[this.activeTrack];
                    this.stopTracking();
                }
                continue;
            };
            var e = d[i].split('|');
            if(reset.indexOf(e[0])<0){
                reset.push(e[0]);
                this.trackList[e[0]] = [];
            }
            this.trackList[e[0]].push({
                pos:e[2].split('.'),
                data:e[1],
                txt:e[1].replace(/#[KB]\.([0-9]+)#/g, ''),
                quest:e[0]
            });
        }
        if(getCookie('qtrack'+hero.id) && !this.activeTrack) this.startTracking(parseInt(getCookie('qtrack'+hero.id)));
        if(this.settrack) this.startTracking(this.settrack);
        updating = false;
        this.upgradeTasks();
        this.draw();
    }
    this.toggleTrack = function(id){
        if(id == this.activeTrack) return this.stopTracking();
        else this.startTracking(id);
    }
    this.startTracking=function(id){
        this.resetTasks();
        this.stopTracking();
        $('.qArrow').remove();
        $('.qTarget').remove();
        $('.qtrack_placeholder').remove();
        $('.gw').removeClass('highlight');
        this.gwHighlight = null;
        if(isset(this.trackList[id])){
            var d=new Date();d.setTime(d.getTime()+36000000*24*30*12);
            setCookie('qtrack'+hero.id,id, d);
            $('#qtrack'+id).addClass('active');
            this.activeTrack = id;
            this.upgradeTasks();
            this.draw();
        }else{
            this.settrack = id;
        }
    }
    //add tasks kill/bring (if they exist) from active tracked
    this.upgradeTasks = function(){
        this.resetTasks();
        if(this.activeTrack && isset(this.trackList[this.activeTrack])){
            var tmp = this.trackList[this.activeTrack];
            var checknpcs = false;
            for(var i=0; i<tmp.length; i++){
                if(/#[BK]\.([0-9]+)#/.test(tmp[i].data)){
                    this.tasks[i] = tmp[i].data.replace(/(.*?#)|\s(\(.*)/g, ''); //setting task to npc/item name found in qtrack description
                    var type = 'item';
                    if(/#[B]\.([0-9]+)#/.test(tmp[i].data) && tmp[i].pos.length==4){
                        type = 'npc';
                        this.tasks[i] = tmp[i].pos[3]; //exception for situation when task is "bring" but targets NPC to "kill" which will provide an searched item
                    }
                    this.putPlaceholder(i, type);
                    checknpcs = true;
                }
            }
            if(checknpcs) for(var i in g.npc) this.checkTaskNpc(i);
        }
    }
    this.putPlaceholder=function(tid, type){
        var pos = this.trackList[this.activeTrack][tid].pos;
        if(isset(g.gw[pos[1]+'.'+pos[2]])) return;
        var id = pos[1]+'_'+pos[2];
        var $p = $('#placeholder'+id);
        $('#qTarget_'+pos[1]+'_'+pos[2]).remove();
        if(!$p.length){
            $('<div class="qtrack_placeholder ph_'+type+'" id="placeholder'+id+'"></div>')
                .css({
                    top:pos[2]*32+4,
                    left:pos[1]*32
                }).attr('tip', _t('quest_placeholder_'+type, {'%NAME%':this.tasks[tid]}, 'quest')).appendTo('#base');
        }
    }
    this.checkGwAndHighlight=function(id){
        if(!isset(this.trackList[this.activeTrack])) return;
        for(var i in this.trackList[this.activeTrack]){
            if(isset(g.gwIds[id]) && this.trackList[this.activeTrack][i].pos[0] == id){
                $('.gwmap'+id).addClass('highlight');
                this.gwHighlight = id;
            }
        }
    }
    this.removePlaceholder=function(pos){
        var id = pos[1]+'_'+pos[2];
        $('#placeholder'+id).remove();
    }
    this.stopTracking=function(id){
        if(typeof(id) != 'undefined'){
            if(id != this.activeTrack) return;
        }
        deleteCookie('qtrack'+hero.id);
        $('.btn.q_track').removeClass('active');
        this.activeTrack = null;
        this.subtrack = [];
        $('.qArrow').remove();
        $('.qTarget').remove();
        $('.qtrack_placeholder').remove();
        $('.gw').removeClass('highlight');
        this.gwHighlight = null;
    }
    this.draw=function(){
        if(updating) return;
        if(!isset(this.trackList[this.activeTrack])) return this.stopTracking()
        for(var i in this.trackList[this.activeTrack]){
            var tmp = this.trackList[this.activeTrack][i].pos;
            if(parseInt(tmp[0]) == -1 || parseInt(tmp[1]) == -1 || parseInt(tmp[2]) == -1) continue;
            else if(parseInt(tmp[0]) > 0){
                this.checkGwAndHighlight(tmp[0]);
            }
            this.updateArrow(this.trackList[this.activeTrack][i]);
        }
    }
    this.updateArrow=function(data){
        var id = data.pos.join('_').replace(' ', '_');
        var pos = data.pos;
        if(isset(data.closerPos)){
            var closestDist = null
            var tmppos = [data.pos];
            for(var i in data.closerPos){
                tmppos.push(data.closerPos[i]);
            }
            for(var i in tmppos){
                var tPos = tmppos[i];
                var tdx=hero.rx-parseInt(tPos[1]);
                var tdy=hero.ry-parseInt(tPos[2]);
                var tdv=Math.max(Math.abs(tdx),Math.abs(tdy));
                if(closestDist === null || closestDist > tdv){
                    closestDist = tdv;
                    pos = tmppos[i];
                    $('.qTarget').remove();
                }
            }
        }
        var dx=hero.rx-parseInt(pos[1]),
            dy=hero.ry-parseInt(pos[2]),
            dv=Math.max(Math.abs(dx),Math.abs(dy)),
            dist=Math.min(99, 16*Math.sqrt(dx*dx+dy*dy));
        var min = 50, max = 130;
        var d2=Math.min(max, 16*Math.sqrt(dx*dx+dy*dy))
        if(dv) {
            dx=Math.round(dist*dx/dv);
            dy=Math.round(dist*dy/dv);
        } else {
            dx=0;
            dy=0;
        }
        var $a = $('#qArrow_'+id);
        var $b = $('[pos="'+pos[1]+'_'+pos[2]+'"]');
        if(!$a.length){
            var tip = [];
            //joining description of two arrows together
            if($b.length){
                $a = $b;
                for(var i in this.trackList[this.activeTrack]){
                    var tmpT = this.trackList[this.activeTrack][i];
                    if(pos[1] == tmpT.pos[1] && pos[1] == tmpT.pos[1]) tip.push(tmpT.txt);
                }
            }else{
                tip.push(data.txt)
                $a = $('<div class="qArrow" notippropagation="1" id="qArrow_'+id+'"></div>')
                    .appendTo('#base')
                    .click(function(e){
                        e.stopPropagation();
                    }).attr('pos', pos[1]+'_'+pos[2]);
            }
            $a.attr('tip', tip.join('<br />'));
        }

        var range = max - min;
        var tdist = d2 - max + range;
        var fade = tdist >= range ? 1 : (tdist<=0 ? 0 : tdist/range);
        if(!$('#placeholder'+pos[1]+'_'+pos[2]).length && !isset(g.gw[pos[1]+'.'+pos[2]])){
            var $b = $('#qTarget_'+pos[1]+'_'+pos[2]);
            if(fade<1){
                if(!$b.length) $b = $('<div class="qTarget" id="qTarget_'+pos[1]+'_'+pos[2]+'"></div>').
                    appendTo('#base');
            }else{
                $('#qTarget_'+pos[1]+'_'+pos[2]).remove();
            }
            $b.css({
                opacity:(1-fade),
                top:pos[2]*32+14,
                left:pos[1]*32 + 16 - 26
            });
        }
        $a.css({
            backgroundPosition: (-24*Math.round(12+8*Math.atan2(dy,dx)/Math.PI))+'px 0',
            display: fade <=0 ? 'none' : 'block'
        }).css({
            opacity: 0.6 * (fade > 0 ? Math.min(1,fade) : 1),
            left: (hero.rx*32 + hero.fw/2)-dx-12,
            top: (hero.ry*32) - dy
        });
    }
})();


var Highlighter = new (function(){
    this.darkboxes = {
        top:null,
        right:null,
        bottom:null,
        left:null
    };
    this.coords = null;
    this.lightArea = function(x1,y1,x2,y2){
        this.coords = arguments;
        this.onresize();
        __tutorials.onresize();
    }
    this.onresize=function(){
        if(this.coords === null) return;
        var of = $('#centerbox').offset();
        var wH = $(window).height();
        var wW = $(window).width();
        for(var i in this.darkboxes){
            if(this.darkboxes[i] === null){
                this.darkboxes[i] = $('<div class="highlighter_darkbox"></div>');
                this.darkboxes[i].appendTo('body');
            }
            var css = {};
            switch(i){
                case 'top':css = {
                    width:wW,
                    height:of.top+this.coords[1],
                    top:0,
                    left:0
                }
                    break;
                case 'right':css = {
                    width:wW - (of.left+this.coords[0]+this.coords[2]),
                    height:this.coords[3],
                    top:of.top+this.coords[1],
                    left:of.left + this.coords[2]+this.coords[0]
                }
                    break;
                case 'bottom':css = {
                    width:wW,
                    height:wH - (of.top+this.coords[3]+this.coords[1]),
                    top:of.top+this.coords[3]+this.coords[1],
                    left:0
                }
                    break;
                case 'left':css = {
                    width:of.left+this.coords[0],
                    height:this.coords[3],
                    top:of.top+this.coords[1],
                    left:0
                }
                    break;
            }
            this.darkboxes[i].css(css);
        }
    }
    this.hide = function(){
        if(this.coords === null) return;
        for(var i in this.darkboxes){
            this.darkboxes[i].remove();
            this.darkboxes[i] = null;
        }
        this.coords = null;
    }

    this.startH = new (function(p){
        //synchronizer for highlighting area between
        //player and first meet npc (in starting willage)
        this.p = p;
        this.req = {'npc': false, 'hero': false, 'tutorial': false};
        this.npcid = null;
        this.synchroStart = function(name){
            this.req[name] = true;
            for(var i in this.req) if(!this.req[i]) return;
            if(this.npcId === null) return;
            this.show();
        }
        this.show = function(){
            var of = $('#centerbox').offset();
            var coords = [0,0,0,0];
            var n = g.npc[this.npcId];
						var mt = $('#base').scrollTop();
						var ml = $('#base').scrollLeft();
            if(hero.y > n.y){
                coords[1] = parseInt($('#npc'+this.npcId).css('top'));
                coords[3] = Math.abs(parseInt($('#npc'+this.npcId).css('top')) - (parseInt($('#hero').css('top')) + hero.fh));
            }else{
                coords[1] = parseInt($('#hero').css('top'));
                coords[3] = Math.abs(parseInt($('#hero').css('top')) - (parseInt($('#npc'+this.npcId).css('top')) + g.npc[this.npcId].fh));
            }

            if(hero.x > n.x){
                coords[0] = parseInt($('#npc'+this.npcId).css('left'));
                coords[2] = Math.abs(parseInt($('#npc'+this.npcId).css('left')) - (parseInt($('#hero').css('left')) + hero.fw));
            }else{
                coords[0] = parseInt($('#hero').css('left'));
                coords[2] = Math.abs(parseInt($('#hero').css('left')) - (parseInt($('#npc'+this.npcId).css('left')) + g.npc[this.npcId].fw));
            }
						coords[0] -= ml;
						coords[1] -= mt;
            this.p.lightArea.apply(this.p, coords)
        }
    })(this);

    this.startG = new (function(p){
        //synchronizer for highlighting gateways area
        this.p = p;
        this.synchroStart = function(id){
            var coords = null;
            //obszary przejÅÄ w domkach startowych
            switch(id){
                case 1063:
                    coords = [7*32, 12*32, 64, 32];
                    break;
                case 1095:
                    coords = [7*32, 13*32, 64, 32];
                    break;
                case 1076:
                    coords = [6*32, 12*32, 96, 32];
                    break;
                case 1061:
                    coords = [7*32, 13*32, 96, 32];
                    break;
                case 1091:
                    coords = [8*32, 11*32, 32, 32];
                    break;
                case 583:
                    coords = [9*32, 10*32, 64, 32];
                    break;
            }
            this.p.lightArea.apply(this.p, coords);
        }
    })(this);
})();


//ground shaker
function shake(){
    this.shakeCounter = 0;
    var T = this;
    this.interval = setInterval(function(){
        var start = map.scrollpos;
        if(T.shakeCounter == 50){
            clearInterval(T.interval);
            $('#base').scrollTop(start[1])
            $('#base').scrollLeft(start[0]);
            return;
        }
        var rx = Math.random() > 0.5 ? -1 : 1;
        var ry = Math.random() > 0.5 ? -1 : 1;
        $('#base').scrollTop(Math.ceil(Math.random()*10*rx)+start[1])
        $('#base').scrollLeft(Math.ceil(Math.random()*10*ry)+start[0]);
        T.shakeCounter++;
    },30);
}

var EndOfTheWorld = new (function(){
    this.val = {};
    this.started = false;
    this.endTimeout = null;
    this.endTimeout2 = null;
    this.timeoutShake = function(){
        var T = this;
        shake();
        this.endTimeout2 = setTimeout(function(){
            T.timeoutShake();
        }, Math.round(Math.random() * (75 - 45) + 45) * 1000);
    }
    this.check = function(data){
        this.val = data.split(';');

        if(!parseInt(this.val[0])){
            clearTimeout(this.endTimeout);
            clearTimeout(this.endTimeout2);
            this.started = false;
        }else if(!this.started){
            var T = this;
            this.endTimeout = setTimeout(function(){
                T.timeoutShake();
            }, Math.round(Math.random() * (30 - 15) + 15) * 1000);
            this.started = true;
        }
    }
})();

var _mPos = new (function(){
    this.buffer = [];
    this.flushInterval = null;
    this.queue = false;
    this.activeAddon = null;
    this.uninstallTmpType = null;
    this.init = function(){
        var T = this;
        $(document).bind('mousemove click', function(e){
            T.event(e);
        });
        this.flushInterval = setInterval(function(){
            T.flush();
        }, 10000);
    }
    this.flush = function(){
        if(this.buffer.length>=100){
            this.queue = this.buffer.join(';');
            this.buffer = [];
        }
    }
    this.getQueue = function(){
        var q = this.queue;
        this.queue = false;
        return q;
    }
    this.event = function(e){
        var val = e.type=='keydown' ? e.which : (e.clientX + (e.clientY+1)*10000);
        if(this.buffer.length >= 100) this.buffer.splice(0,1);
        if(!isNaN(val)) this.buffer.push(e.type=='keydown' ? e.which : (e.clientX + (e.clientY+1)*10000));
    }
    this.init();
})();

var extManager = new (function(){
    var T = this;
    var defComment = _t('default_comment_txt', null, 'extManager');
    this.activePanel = null;
    this.searchDelay = null;

    function install (id) {
      var t = T.getRequestedBuildTypeByParams();
      if(t == 'v' && !T.activeAddon.verified) t = 'p';
      var c = T.getCookie();
      var params = T.scrollEventParams;
      c[id] = t;
      T.saveCookie(c);

      T.refreshControlls(id);
    }

    function getActiveAddonURL() {
      var t = T.getRequestedBuildTypeByParams();
      if(t == 'v' && !T.activeAddon.verified) t = 'p';
      var type;
      switch(t) {
        case 'v':type ='verified';break;
        case 'p':type ='public';break;
        case 'd':type ='dev';break;
      }
      return 'https://addons2.margonem.pl/get/'+Math.floor(T.activeAddon.id / 1000)+'/'+T.activeAddon.id+type+'.js';
    }

    this.scrollEvent = function(){ //runs on scroll down when scrolling down addons lists
        if($('#'+this.activePanel+' .view_port .content_loader').length) return;
        if(Math.ceil(T.amount/T.limit) <= this.lastPage) return;
        this.scrollEventParams.page = this.lastPage === null ? 1 : this.lastPage+1
        var params = [];
        for(var i in this.scrollEventParams){
            var tmp = this.scrollEventParams[i];
            if(tmp !== null){
                params.push(i+'='+tmp);
            }
        }
        $('#'+this.activePanel+' .view_port').append('<div class="content_loader">'+_t('loading_content', null, 'extManager')+'</div>');
        this.call('list?'+params.join('&'));
    }

    this.updateList = function(list){
        var html = this.printList(list.addons);
        $('#'+this.activePanel+' .view_port .content_loader').replaceWith(html);

        if(isset(list.l)) T.limit = list.l;
        if(isset(list.am)) T.amount = list.am;
        if(isset(list.p)) T.lastPage = list.p;
    }

    this.printList = function(list){
        var $page = $('<div class=page></div>');
        for(var i=0; i<list.length; i++){
            var html = '<div id="addon_'+list[i].id+'" onclick="extManager.callDetails('+list[i].id+')" class=addon>';
            html +='<div class="image" '+(!list[i].img_url ? 'tip="'+_t('no_image', null, 'extManager')+'"' : '')+' style="'+(list[i].img_url ? 'background-image:url(https://addons2.margonem.pl'+list[i].img_url+')' : `background-image:url(/img/addon_holder.png?v=${_CLIENTVER})`)+'"></div>';
            html +='<div class=description>';

            html +='<h2 class=name>'+list[i].name+'</h2>';
            html +='<div class=author>'+list[i].acc_name+'</div>';
            var ptVal = list[i].points > 0 ? 'plus' : (list[i].points < 0 ? 'minus' : 'zero');
            html +='<div class="point_holder"><span tip="'+_t('addon_points_tip', null, 'extManager')+'" class="ptVal'+ptVal+'">'+(list[i].points>0?'+':'')+list[i].points+'</span>'
            if(list[i].attr == 0){
                html +='<div class=old>'+_t('update_needed', null, 'extManager')+' <span class=update onclick="extManager.update('+list[i].id+')">'+_t('update_me', null, 'extManager')+'</span></div>';
            }
            html +='</div>';
            html +='</div>';
            $page.append(html);
        }
        return $page;
    }
    this.printControlls = function(id){
        var c = this.getCookie();
        var html = '';
        if(!isset(c[id])) html+= '<span tip="'+_t('install_tip', null, 'extManager')+'" class="install button" onclick="extManager.install('+id+')">'+_t('ad_install', null, 'extManager')+'</span>';
        if(isset(c[id])) html+= '<span tip="'+_t('uninstall_tip', null, 'extManager')+'" class="uninstall button" onclick="extManager.uninstall('+id+')">'+_t('ad_uninstall', null, 'extManager')+'</span>';
        //html+= '<span tip="'+_t('report_tip', null, 'extManager')+'" class="report button" onclick="extManager.report('+id+')">'+_t('ad_report', null, 'extManager')+'</span>';
        html += '<span tip="'+_t('closeaddon_tip', null, 'extManager')+'" class="close button" onclick="extManager.addonClose('+id+')">'+_t('ad_close', null, 'extManager')+'</span>'
        return html;
    }
    this.call = function(task, params, _type){
        var T = this;
        let type = _type ? _type : 'GET';
        let apiUrl = 'https://public-api.margonem.pl/addons/'+task;
        $.ajax({
            url: apiUrl,
            data:isset(params) ? params : {},
            type:type,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            dataType:'json',
            success:T.parseResponse
        });
    }
    this.parseResponse = function(msg){
        if(isset(msg.list)) T.updateList(msg.list);
        if(isset(msg.update)) T.updateInfo(msg.update);
        if(isset(msg.addon)) T.addonDetails(msg.addon);
        if(isset(msg.message)) mAlert(_t(msg.message, null, 'extManager'));
    }
    this.callDetails = function(id){
        this.call('details/'+id, null);
    }
    this.addonDetails = function(addon){
        this.activeAddon = addon;
        var html = '<div id="addonDetails">';
        html += '<div>';
        html +='<div class="image" '+(!addon.img_url ? 'tip="'+_t('no_image', null, 'extManager')+'"' : '')+' style="'+(addon.img_url ? 'background-image:url(https://addons2.margonem.pl'+addon.img_url+')' : `background-image:url(/img/addon_holder.png?v=${_CLIENTVER})`)+'"></div>';
        html +='<div class=description>';
        var ptVal = addon.points > 0 ? 'plus' : (addon.points < 0 ? 'minus' : 'zero');
        var likes = '<div><div class="ptValBox"><span tip="'+_t('addon_points_tip', null, 'extManager')+'" class="ptVal'+ptVal+'">'+(addon.points>0?'+':'')+addon.points+'</span></div><div onclick="extManager.toggleLike('+addon.id+', \'like\')" tip="'+_t('addon_like', null, 'extManager')+'" class="ad_points_but like '+(addon.like === 1 ? 'active' : '')+'"></div>'+
            '<div onclick="extManager.toggleLike('+addon.id+', \'unlike\')" tip="'+_t('addon_unlike', null, 'extManager')+'" class="ad_points_but unlike '+(addon.like === -1 ? 'active' : '')+'"></div>'+
            (!addon.reported ? ('<div onclick="extManager.report('+addon.id+')" tip="'+_t('addon_report', null, 'extManager')+'" class="ad_points_but report"></div>') : '')+'</div>';
        html +='<h2 class=name>'+addon.name+'</h2>';
        html +='<div class=author><a target="_blank" href="https://www.margonem.pl/profile/view,'+addon.acc_id+'">'+addon.acc_name+'</a></div>';
        html +='<div class=infoBox>'+_t('created_at %time%', {'%time%':ut_date(addon.created_at)}, 'extManager')+'<br />'+likes+'</div>';
        html +='<div class=controlls>'+this.printControlls(addon.id)+'</div>';
        html +='</div>';

        html +='<div class="content">';
        html +='<div class=contentWrapper>';
        html +='<p>'+addon.description+'</p>';
        html +='<div class=commentBox>';
        html +='<strong>'+_t('add_comment', null, 'extManager')+'</strong>';
        html +='<textarea id=addonCommentArea>'+defComment+'</textarea><br />';
        html +='<span tip="'+_t('comment_tip', null, 'extManager')+'" class="comment button" onclick="extManager.publishComment('+addon.id+')">'+_t('ad_comment', null, 'extManager')+'</span>';
        html +='<div class=commentsList>';
        if(addon.comments.length){
            for(var i=0; i<addon.comments.length; i++){
                var c = addon.comments[i];
                var time = calculateDiff(addon.comments[i].created_at, unix_time());
                html += '<div class=singlecomment><span class=nick>'+c.nick+'</span> <span class="time">('+time+')</span> '+c.body+'</div>';
            }
        }else{
            html+= _t('no_addon_comments');
        }
        html +='</div>';
        html +='</div>';
        html +='</div>';
        html +='</div>';

        html += '</div>';
        html += '</div>';
        $('#addonDetails').remove();
        $('#addons').append(html);
        var oldtxt = null;
        $('#addonCommentArea').click(function(){
            if($(this).val() == defComment){
                $(this).val('');
            }
        }).blur(function(){
            if($(this).val() == '') $(this).val(defComment);
        })
    }
    this.publishComment = function(id){
        //return mAlert('Komentowanie dodatkÃ³w na razie jest niedostÄpne')
        var v = $('#addonCommentArea').val();
        if(v == defComment || v == '') return mAlert(_t('give_comment_txt', null, 'extManager'));
        this.call('details/'+id, {
            comment:v
        }, 'POST');
    }
    this.report = function(id){
        if(this.activeAddon.reported) return;
        var T = this;
        function reportCommit(val){
            if(val == '' || val.length < 5) return mAlert(_t('report_short', null, 'extManager'));
            T.call('details/'+id, {
                report:val
            }, 'POST');
        }
        mAlert(_t('report_reason', null, 'extManager'), 3, [
            function(){reportCommit($('#alert input[name="mAlertInput"]').val())}
        ]);
    }
    this.toggleLike = function(id, type){
        //if(type == 'unlike'){
        //  return this.report(id);
        //}else{
        this.call('details/'+id, {
            like:type
        }, 'POST');
        //}
    }
    this.addonClose = function(){
        $('#addonDetails').remove();
        this.activeAddon = null;
        this.uninstallTmpType = null;
    }
    this.task = function(params, forceRefresh){
        //return mAlert('Panel dodatkÃ³w chwiliwo wyÅÄczony, wczeÅniej zainstalowane dodatki wczytujÄ siÄ graczom, ktÃ³rzy je zainstalowali');
        var type = null;
        var name = null;
        if(typeof(params) == 'object'){
            name = params.tab;
            type = params.type;
        }else{
            name = params;
        }
        g.lock.add('addons');
        tutorialStart(13);
        var panels = ['add_list', 'add_mine', 'add_active', 'add_help'];
        $('.add_list_menu .menu_element').removeClass('active');
        if(panels.indexOf(name) >= 0){
            if(name == this.activePanel && !(isset(forceRefresh) && forceRefresh)) return;
            $('.content_loader').remove();
            this.clearActivePanel();
            $('#addons>DIV:not(#addon_search_div)').hide();
            $('#addons,#addonspanel').show();
            $('#'+name).show();
            this.activePanel = name;
        }
        switch(name){
            case 'add_list':
                $('#addon_search_div').show();
                this.scrollEventParams.tab = 'all';
                if(type) this.scrollEventParams.type = type;
                else{
                    this.scrollEventParams.type = 'all';
                    $('#ad_opt_all').addClass('active');
                }
                this.scrollEvent();
                break;
            case 'add_mine':
                $('#addon_search_div').show();
                this.scrollEventParams.tab = 'mine';
                //this.scrollEventParams.hs3 = getCookie('hs3');
                this.scrollEvent();
                break;
            case 'add_active':
                $('#addon_search_div').show();
                this.scrollEventParams.tab = 'installed';
                this.scrollEventParams.ids = this.getCookie(true);
                this.scrollEvent();
                break;
            case 'quit':
                $('#addon_search_div').hide();
                this.exit();
                break;
            case 'add_help':
                $('#addon_search_div').hide();
                break;
        }
    }

    /*gets build type
     * d - dev, p - public, v - vefified
     * depends on active list parameters
     */
    this.getRequestedBuildTypeByParams = function(){
        if(this.uninstallTmpType !== null) return this.uninstallTmpType;
        var t = null;
        var params = this.scrollEventParams;
        if(params.tab == 'all'){
            if(params.type == 'all' || params.type == 'badged' || params.type == 'popular') t = 'v';
            if(params.type == 'unverified') t = 'p';
        }
        if(params.tab == 'mine') t = 'd';
        //console.log(t);
        return t;
    }

    this.install = function(id){
        if(T.activeAddon.verified) {
            install(id);
            return;
        }
        mAlert(_t('install-not-verified-addon %url%', {'%url%': getActiveAddonURL()}), 2, [
            function() {
                install(id);
            },
            function() {}
        ]);
    }

    this.uninstall = function(id){
        var c = this.getCookie();
        if(isset(c[id])){
            if(this.scrollEventParams.tab == 'installed') this.uninstallTmpType = c[id];
            delete c[id];
        }
        this.saveCookie(c);
        this.refreshControlls(id);
    }
    /*this.update = function(id){
     this.call('update&id='+id);
     }
     this.updateInfo = function(msg){
     if(!msg) return mAlert(_t('update_not_available', null, 'extManager'));
     else{
     if(msg.lvl < 2) return mAlert(_t('update_not_releaesed_yet', null, 'extManager'));
     if(msg.newId && msg.oldId){
     var c = this.getCookie();
     var idx = c.indexOf(parseInt(msg.oldId));
     if(idx>=0){
     c.splice(idx, 1, parseInt(msg.newId))
     }else{
     c.push(parseInt(msg.newId))
     }
     this.saveCookie(c);
     $('#addon_'+msg.oldId+' .old').html('<span style="color:lime">Ok!</span>').fadeOut();
     $('#addon_'+msg.oldId+' .controlls .uninstall').attr('onclick', 'extManager.uninstall('+msg.newId+')');
     }
     }
     }*/
    this.refreshControlls = function(id){
        $('#addonDetails .controlls').html(this.printControlls(id));
    }
    this.getCookie = extMgrCookieGet;
    this.saveCookie = function(arr){
        var tmp = [];
        for(var i in arr){
            tmp.push(arr[i].toString()+i);
        }
        var d=new Date();d.setTime(d.getTime()+36000000*24*30*12)
        setCookie('__mExts', tmp.join(','), d);
    }
    this.clearActivePanel = function(){
        $('#'+this.activePanel+' .view_port').html('');
        this.activePanel = null;
        this.scrollEventParams = {
            type:null,
            tab:'all',
            page:1,
            name:typeof(this.scrollEventParams) != 'undefined' ? this.scrollEventParams.name : null,
            ids:null
        };
        this.addonClose();
        this.limit = null;
        this.amount = null;
        this.lastPage = null;
    }
    this.exit = function(){
        this.clearActivePanel();
        $('#addons,#addonspanel').hide();
        g.lock.remove('addons');
    }

    $(document).ready(function(){
        $('.view_port').on('scroll', function(e){
            if(($(this).prop('scrollHeight') - $(this).scrollTop() - $(this).height()) <= 0){
                T.scrollEvent();
            }
        });
        $('.add_list_menu .menu_element').click(function(){
            $('.add_list_menu .menu_element').removeClass('active');
            var type = $(this).attr('id').substr(7);
            T.task({type:type,tab:'add_list'}, true);
            $(this).addClass('active');
        });
        $('#addon_search').keyup(function(){
            T.scrollEventParams.name = $('#addon_search').val();
            var TT = this;
            if(T.searchDelay !== null) clearTimeout(T.searchDelay);
            T.searchDelay = setTimeout(function(){
                if(T.activePanel == 'add_list'){
                    var $e = $('.add_list_menu .menu_element.active')
                    var type = $e.attr('id').substr(7);
                    T.task({type:type,tab:T.activePanel}, true);
                    $e.addClass('active');
                }else{
                    T.task(T.activePanel, true);
                }
            }, 500);
        });
    })
})();

var waitItemManage = new (function(){
    this.list = []; //id's of waiting items
    this.add = function(id){
        if(this.list.indexOf(id) < 0){
            $('#itemWaitBox .items-container').prepend('<div class="itemWrapper" id="itemWaitWrapper'+id+'"></div>');
            this.list.push(id);
        }
        $('#itemWaitWrapper'+id).append(createItem(g.item[id]));
        this.check();
    }
    this.remove = function(id){
        var idx = this.list.indexOf(id);
        if(idx >= 0){
            $('#itemWaitWrapper'+id).remove();
            this.list.splice(idx, 1);
            this.check();
        }
    }
    this.check = function(){
        if(this.list.length){
            $('#itemWaitBox').show();
        }else{
            $('#itemWaitBox').hide();
        }
    }
})();
//function smoczeKuferki(d, items){
//	$("#window-smoczeKuferki").remove();
//	g.lock.add('smocze-kuferki');
//	var dlmain = $("<div>")
//		.attr("id","window-smoczeKuferki").addClass("dragonbox_main").appendTo("body");
//	var top = $("<div>").addClass("dragonbox_top").appendTo(dlmain);
//	$("<div>").addClass("closebut").click(function(){
//		g.lock.remove('smocze-kuferki');
//		shop_close();
//		$(dlmain).fadeOut("fast", function(){
//			$(this).remove();
//		});
//	}).css({
//		"marginTop": 6
//	}).appendTo(top);
//	var main = $("<div>").addClass("dragonbox_body").appendTo(dlmain);
//	var boxmain = $("<div>").addClass("dragonbox_wrapper").appendTo(main);
//	$("<div>").addClass("dragonbox_bottom").appendTo(dlmain);
//	var cid = 1;
//	function addOne(id){
//		if(!isset(items[id])) return;
//		if(cid > 2) return;
//		var icon = "/obrazki/itemy/"+items[id].icon;
//		var container = $("<div>").addClass("dragonbox dragonbox-cl"+cid);
//		var cost = items[id].pr;
//		$("<span>").addClass("cost").text(cost+_t("sl")).appendTo(container);
//		var cicon = $("<div>").addClass("cicon").appendTo(container);
//		$("<div>").addClass("icon")
//			.css("backgroundImage", "url("+icon+")").appendTo(cicon);
//		$("<div>").addClass("button buy_this").click(function(){
//			mAlert(
//				_t("accept_dragon_chest", null, "shop")+
//				"<div class='dragonbox_confirm'>"+
//				_t("stamina_shop_cost")+" "
//			+cost+_t("sl")
//			+"</div>",
//			2, [function(){
//				_g("shop&buy="+id+",1&sell=");
//			},function(){}]);
//
//		}).appendTo(container);
//		boxmain.append(container);
//		cid++;
//	}
//	for(var t in items){
//		if(items[t].loc == "n"){
//			addOne(t);
//		}
//	}
//
//	var co = $("<div>").addClass("other_option").appendTo(main);
//	$("<span>").text("Brakuje SÅ?:").addClass("big").appendTo(co);
//	$("<div>").addClass("button buy_sl").click(function(){
//		slShopOpen();
//	}).appendTo(co);
//	$("<div>").addClass("button back_shop").click(function(){
//		g.lock.remove('smocze-kuferki');
//		shop_close();
//		$(dlmain).fadeOut("fast", function(){
//			$(this).remove();
//		});
//		$('#premiumshop').show();
//	}).appendTo(co);
//	$('#dlgwin .w1').css('backgroundPosition','0 '+($('#dlgwin .w1').height()-28)+'px');
//	dlmain.absCenter();
//}

function initItemChanger (v) {
	if (!g.itemChanger) {
		g.itemChanger = new itemChanger();
		g.itemChanger.init();
	}
	g.itemChanger.update(v);
}

function initBarter (v) {
    if (!g.barter) {
        g.barter = new barter();
        g.barter.init();
    }
    g.barter.update(v);
}

function initChooseOutfit (v) {
    if (g.chooseOutfit) g.chooseOutfit.close();
    g.chooseOutfit = new chooseOutfit();
    g.chooseOutfit.init();
    g.chooseOutfit.update(v);
}

function initCaptcha (v) {
    if (!g.captcha) {
        g.captcha = new captcha();
    }
    g.captcha.update(v);
}

function initPoll () {
    if (!g.poll) {
        g.poll = new poll();
        g.poll.init();
    }
}

function initRewardsCalendar (v) {
	if (!g.rewardsCalendar) g.rewardsCalendar = new rewardsCalendar();
	g.rewardsCalendar.update(v);
}

function smoczeKuferki (d, items) {
    g.chests.createAllChests(items, d.items_offers);
}

function initDragonChests () {
    g.chests = new dragonChests();
}

function initMCAddon() {
	g.mCAddon = new MCAddon();
}

function initSMCAddon() {
	g.sMCAddon = new SMCAddon();
}

function initLootPreview (v) {
    if (g.lootPreview) g.lootPreview.close();
    g.lootPreview = new LootPreview();
    g.lootPreview.init();
    g.lootPreview.update(v);
}
function initMatchmakingSummary () {
    g.matchmakingSummary = new matchmakingSummary();
}
function callSmoczeKuferki(){
	if(_l() == 'pl'){
		shop_close();
		return _g("creditshop&npc=436");
	}
}

//function initMatchmakingTutorialManager() {
//    g.matchmakingTutorial = new MatchmakingTutorial();
//}

function initTplsManager () {
    g.tplsManager = new tplsManager();
}

function initNpcIconManager () {
    g.npcIconManager = new NpcIconManager();
    g.npcIconManager.init();
}
function initServerStorage () {
    g.serverStorage = new ServerStorage();
}

function initNpcTplManager () {
    g.npcTplManager = new NpcTplManager();
    g.npcTplManager.init();
}

function initStartFightBlockade () {
  g.startFightBlockade = new StartFightBlockade();
  g.startFightBlockade.init();
}

function initCodeMessageController () {
    g.codeMessageManager = new CodeMessageManager();
    g.codeMessageManager.init();
}

function initBuildsManager () {
    g.buildsManager = new BuildsManager();
    g.buildsManager.init();
}

function initChatController () {
    //return
    if (!newChatMode) return;
    g.chatController = new ChatController();
    g.chatController.init();
}
function initBusinessCardsManager () {
    //return
    if (!newChatMode) return;
    g.businessCardManager = new BusinessCardsManager();
    g.businessCardManager.init();
}

function initNightController () {
    g.nightController = new nightController();
    g.nightController.init();
}

function initDisableItemsManager () {
    g.disableItemsManager = new disableItemsManager();
    g.disableItemsManager.init();
}

function initItemsMovedManager () {
    g.itemsMovedManager = new itemsMovedManager();
    g.itemsMovedManager.init();
}

function initQuestLog () {
    g.questLog = new questLog();
    g.questLog.init();
}

function showPremiumPanel(){
	$('#premiumshop').show();
}
function initPremiumShop(){
    for(var i=0; i<16; i++){
        var t = _t('premium_item_'+i, null, 'premium_panel');
				if(_l() == "pl" && (i == 0 || i == 12)){
					t = _t('premium_item_pl_'+i, null, 'premium_panel');
				}
        var $o = $('<div tip="'+t+'" class="premiumItem" onclick="premiumShopItemClick('+i+')"></div>');
        $o.css({
            top:36+Math.floor(i/4)*107+(Math.floor(i/4)>1?(Math.floor(i/4)-1):0),
            left:28+i%4*124
        })
        var ti = i;
        if(_l() == 'en'){
            if(i == 2) ti = 11;
            if(i>10) ti += 1;
            if(ti == 16) ti = 2;
        }
        $o.append($('<div class=item_bg></div>').css({
            backgroundPosition:(-ti%6*81)+'px '+(-621-Math.floor(ti/6)*84)+'px',
        }));
        $('#premiumshop .items_wrapper').append($o);
    }
}
function premiumShopItemClick(idx){
    if(g.lock.check('shop') || g.lock.check('staminashop')) return;
    var pl = [
        436, 304, 301, 'gold',
        'for-you', 299, 302, 296,
        293, 295, 298, 306,
        294, 'stamina', 297, 300
    ];
    var en = [
        73821, 73822, 73830, 'gold',
        73823, 73824, 73825, 73826,
        73827, 73828, 73829, 73831,
        73832, 73833, 73834, 74122
    ];
    var ar = _l() == 'pl' ? pl : en;
    if(isset(ar[idx])){
        if(ar[idx] == 'gold') _g('creditshop&credits_gold=-1');
        if(ar[idx] == 'stamina') showStaminaShop();
        if(ar[idx] == 'for-you') _g('creditshop&filters=1&npc=479&filterlvlunder=10&filterlvlabove=5');
        if(typeof(ar[idx]) == 'number') _g('creditshop&npc='+ar[idx]);
        //$('#premiumshop').hide();
    }
}


//promo codes window
var codeManager = new (function(){
    var T = this;
    var usedCode = null;
    var data = null;
    var html = null;
    var items = null;
    var ready = [];
    var inactive = false;
    const self = this;

    this.showCodeInputWindow = function(){
        mAlert(_t('give_promo_code', null, 'codeManager'), 3, [function(){
            T.sendCode($('.mAlertInputContainer input').val());
        }]);
    }
    this.sendCode = function(code){
        this.reset();
        usedCode = code;
        _g('codeprom&code='+code);
    }
    this.prepareItemBoxes = function(){
        var $html = $('<div class=item_boxes_inner></div>');
        if(items === null) return html;
        for(var i=0; i<3; i++){
            if(items[i].length){
                var $o = $('<div class=item_group id=item_group_'+i+'></div>');
                for(var k in items[i]){
                    let item = items[i][k];
                    // let $i = $('<div class=item id="item'+item.id+'" ctip=t_item tip=\''+item.tip+'\'></div>');
                    let $i = $('<div class=item id="item'+item.id+'" data-type="t_item" ctip="tip-wrapper normal-tip" tip=\''+item.tip+'\'></div>');
                    $i.css({
                        top:item.y%3*33+1,
                        left:item.x*33+1
                    });
                    $i.click(function() {
                        self.showMenuItem(item, $i);
                    });
                    $o.append($i);
                }
                $o.append($('<div id="choose_'+i+'" class="promogroup_button">'+_t('promo_choose', null, 'promocodes')+'</div>').click(T.choosegroup));
                if(isset(items[i+1]) && items[i+1].length) $o.append('<div class="or_container">'+_t('promo_or', null, 'promocodes')+'</div>')
                $html.append($o);
            }
        }
        return $html;
    }
    this.showMenuItem = function(item, $item) {
        if (isset(parseItemStat(item.stat).canpreview)) {
            var fun = '_g("moveitem&st=2&tpl=' + item.tpl + '"); g.tplsManager.deleteMessItemsByLoc("p");g.tplsManager.deleteMessItemsByLoc("s");';
            showMenu(
              {target:$item},
              [
                  [_t('show', null, 'item'), fun, true]
              ]
            );
        }
    };
    this.choosegroup = function($o){
        if(inactive) return false;
        var id = parseInt($($o.target).attr('id').substr(7))+1;
        $('#alert').hide()
        _g('codeprom&code='+usedCode+'&opt='+id, function(){T.reset});
    }
    this.updateItems = function(){
        if(ready.indexOf('items') < 0) ready.push('items');
        this.createBonusWindow();
    }
    this.updateBonusWindow = function(info){
        data = info;
        if(ready.indexOf('data') < 0) ready.push('data');
        this.createBonusWindow();
    }
    this.createBonusWindow = function(){
        if(!(ready.indexOf('data') >= 0 && ready.indexOf('items') >= 0)) return false;
        var html = '';
        html += '<div class="promocodes">';
        html += '<div class=promoname>'+data.name+'</div>';
        html += '<div class=promodesc>'+data.desc+'</div>';
        if(data.used){
            html += '<div class=promoalert>'+data.used+'</div>';
            inactive = true;
        }
        if(data.expire > 0 && data.expire < unix_time()){
            html += '<div class=promoexpirealert>'+_t('promo_expired', null, 'promocodes')+'</div>';
            inactive = true;
        }
        html += '<div id="item_boxes"></div>';
        html += '</div>';
        var boxAmount=0;
        for(var i=0; i<3; i++){boxAmount += items[i].length ? 1 : 0}
        html += '<div class=aux_bottom_info>'
        if(boxAmount > 1) html += '<div>'+_t('multiple_group_info', null, 'promocodes')+'</div>';
        html += '<div>'+(data.usage_limit != 0 ? _t('promo_use_count %use% %max%', {'%use%': data.usage_limit - data.usage_count}, 'promocodes') : _t('promo_unlimited %use% %max%', null, 'promocodes'))+'</div>';
        html += '</div>'
        mAlert(html, 1);
        $('#a_ok').hide();

        if(inactive){
            $('#alert .promocodes').addClass('inactive');
        }
        $('#item_boxes').append(this.prepareItemBoxes());
        $('#alert').absCenter();
    }
    this.addItem = function(item){
        if(items === null) items = [[],[],[]];
        var idx = Math.floor(item.y/3);
        items[idx].push(item);
    }
    this.reset = function(){
        usedCode = null;
        html = null;
        ready = [];
        items = null;
        data = null;
        inactive = false;
    }
})();

ingameRegistration = new (function(){
    var t = this;
    var sections = null;
    this.show = function(){
        var header = _t('reg_header', null, 'ingame_register');
        var html =	'<div class="registration-wrapper">'+
            '<div class="header">'+_t('complete_registration', null, 'ingame_register')+'<div class="mark-outer"><div class="mark"></div></div></div>'+
            '<div class="short-info"></div>'+
            '<div class="main-container">'+
            '<div class="input-section">'+
            '<div class="section-wrapper login">'+
            '<div class="row r_login">'+
            '<label for="r_login">'+_t('reg_login_label', null, 'ingame_register')+'</label>'+
            '<div class=input-wrapper><input id="r_login" /></div>'+
            '</div>'+
            '<div class="row r_password">'+
            '<label for="r_pass">'+_t('reg_passwd_label', null, 'ingame_register')+'</label>'+
            '<div class=input-wrapper><input type=password id="r_pass" /></div>'+
            '</div>'+
            '</div>'+
            '<div class="section-wrapper email">'+
            '<div class="row r_email">'+
            '<label for="r_email">'+_t('reg_email_label', null, 'ingame_register')+'</label>'+
            '<div class=input-wrapper><input id="r_email" /></div>'+
            '</div>'+
            '</div>'+
            '<div class="section-wrapper born">'+
            '<div class="row birth">'+
            '<label for="r_bdate_day">'+_t('reg_birth_label', null, 'ingame_register', 'ingameRegistration.save()')+'</label>'+
            '<div class=birth-wrapper>'+
            '<div class="input-wrapper birth-day"><input placeholder="dd" maxlength=2 id="r_bdate_day" /></div>'+
            '<div class="input-wrapper birth-month"><input placeholder="mm" maxlength=2 id="r_bdate_month" /></div>'+
            '<div class="input-wrapper birth-year"><input placeholder="yyyy" maxlength=4 id="r_bdate_year" /></div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="save-area">'+drawButton(_t('save_form', null, 'ingame_register'), 'ingameRegistration.save()')+'</div>'+
            '</div>'+
            '<div class="reward-section">'+
            '<div class=inner>'+
            '<div class=header>'+_t('rew_head', null, 'ingame_register')+'<div class="mark-outer"><div class="mark"></div></div></div>'+
            '<div class="rewards-row row1"><div class="rew-info-holder"></div><div class="reward-box" id=rewards0><div class="item0 item-wrapper-register"></div><div class="item1 item-wrapper-register"></div><div class="item2 item-wrapper-register"></div></div></div>'+
            '<div class="rewards-row row2"><div class="rew-info-holder"></div><div class="reward-box" id=rewards1><div class="item0 item-wrapper-register"></div><div class="item1 item-wrapper-register"></div><div class="item2 item-wrapper-register"></div></div></div>'+
            '<div class="rewards-row row3"><div class="rew-info-holder"></div><div class="reward-box" id=rewards2><div class="item0 item-wrapper-register"></div><div class="item1 item-wrapper-register"></div><div class="item2 item-wrapper-register"></div></div></div>'+
            '<div class="mark-outer"><div class="mark"></div></div>'+
            '<div class="collect-area">'+drawButton(_t('collect_form', null, 'ingame_register'), 'ingameRegistration.collect()')+'</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="check-area" onclick="ingameRegistration.checkbox()"><div class="checkbox_wrapper" id="check_reg"></div>'+_t('dont_show_again', null, 'ingame_register')+'</div>'+
            '</div>'

        showEnWindow(header, html);
        this.init();
    }

    this.collect = function(){
        _g('registernoob&collect=1')
    }

    this.save = function(){
        var requests = {
            'regcomp':false,
            'chmail':false,
            'chbdate':false
        };
        var ps = ['chmail', 'chbdate']; //protected_sections
        var scriptname = '';
        for(var i in requests){
            var data = {
                chash:getCookie('chash'),
                user_id:getCookie('user_id')
            };
            switch(i){
                case 'regcomp':
                    if(sections.login) continue;
                    data.login = $('#r_login').val();
                    data.pass = $('#r_pass').val();
                    scriptname = 'regcomp';
                    break;
                case 'chmail':
                    if(!sections.login || sections.email) continue;
                    data.newmail = $('#r_email').val();
                    data.newmail2 = $('#r_email').val();
                    scriptname = 'chmail';
                    break;
                case 'chbdate':
                    if(!sections.login || sections.born) continue;
                    data.bdate = $('#r_bdate_year').val()+'-'+$('#r_bdate_month').val()+'-'+$('#r_bdate_day').val();
                    scriptname = 'chbdate';
                    break;
            }
            var timeout = setTimeout(function(){
                _g('registernoob');
            }, 100);
            (function(script){
                clearTimeout(timeout);
                $.ajax({
                    url:'http://margonem.com/ajax/'+script,
                    type:'post',
                    dataType:'json',
                    data:data,
                    success:function(m){
                        requests[script] = true;
                        t.validate(script, m);
                        clearTimeout(timeout);
                        timeout = setTimeout(function(){
                            _g('registernoob');
                        }, 100);
                    }
                });
            })(scriptname);

        }
    }

    this.validate = function(section, m){
        var holder = null;
        switch(section){
            case 'regcomp':
                holder = $('.section-wrapper.login');
                break;
            case 'chmail':
                holder = $('.section-wrapper.email');
                break;
            case 'chbdate':
                holder = $('.section-wrapper.born');
                break;
        }
        if(holder){
            var $msg = holder.find('.msg_holder');
            if(!$msg.length){
                $msg = $('<div class="msg_holder"></div>');
                holder.append($msg);
            }
            $msg.attr('tip', m.msg);
            if(m.ok) $msg.addClass('isok').attr('tip', _t('correct', null, 'ingame_register'));
            else $msg.removeClass('isok')
        }
    }

    this.addItem = function(id){
        var i = g.item[id];
        $('#rewards'+i.y+' .item'+i.x).html(createItem(i));
    }

    //parse info from engine after _g('registernoob')
    this.parseRegisternoobInfo = function(msg){
        sections = msg;
        var ps = ['email', 'born']; //protected_sections
        var finished = true;

        if(msg['login'] == 1){
            $('.registration-wrapper .short-info').html(_t('register_info_short2', null, 'ingame_register'))
        }else{
            $('.registration-wrapper .short-info').html(_t('register_info_short', null, 'ingame_register'))
        }

        for(var i in msg){
            if(msg[i] != 2) finished = false;
            var txt = '';
            var rewards = null;
            var section = null;
            switch(i){
                case 'born':
                    section = $('.section-wrapper.born');
                    rewards = $('#rewards2');
                    break;
                case 'email':
                    section = $('.section-wrapper.email');
                    rewards = $('#rewards1');
                    break;
                case 'login':
                    section = $('.section-wrapper.login');
                    rewards = $('#rewards0');
                    break;
            }
            switch(msg[i]){
                case 0:
                    if(ps.indexOf(i) >= 0 && !sections.login){
                        section.find('input').attr('tip', _t('fill_in_login_first', null, 'ingame_register')).attr('disabled', 'disabled');
                        section.css('opacity', 0.3);
                    }else{
                        section.find('input').attr('tip', _t('fill_in_fields', null, 'ingame_register')).attr('disabled', '');
                        section.css('opacity', 1);
                    }
                    rewards.css('opacity', 0.3)//.parent().find('.rew-info-holder').html('<div class="rew-info" tip="'+_t('fields_needed_reward_info %fields%', {'%fields%': _t('reward_fields_'+i, null, 'ingame_register')}, 'ingame_register')+'"></div>')
                    break;
                case 1:
                    section.find('input').attr('disabled', 'disabled').val(_t(i == 'born' ? 'disabled_info_short' : 'disabled_info', null, 'ingame_register')).attr('tip', '')//.attr('tip', _t('disabled_info_tip', null, 'ingame_register'));
                    section.find('label').css('opacity', 0.5);
                    rewards.css('opacity', 1).parent().find('.rew-info-holder').html('<div class="rew-info" tip="'+_t('collect_reward_info', null, 'ingame_register')+'"></div>')
                    section.find('')
                    break;
                case 2:
                    section.find('label').css('opacity', 0.5);
                    section.find('input').attr('disabled', 'disabled').val(_t(i == 'born' ? 'disabled_info_short' : 'disabled_info', null, 'ingame_register')).attr('tip', '')//.attr('tip', _t('disabled_info_tip', null, 'ingame_register'));
                    rewards.css('opacity', 0.3).parent().find('.rew-info-holder').html('<div class="rew-info" style="opacity:0.3" tip="'+_t('collected_reward_info', null, 'ingame_register')+'"></div>')
                    break;
            }
        }
        if(finished){
            $('#bm_register').hide();
            delete hero.preview_acc;
            hideEnWindow();
            message(_t('register_finished', null, 'ingame_register'));
        }
    }
    this.forceDialog = function(){
        this.checkbox(1);
        this.show();
    }
    this.checkbox = function(force_value){
        if(isset(force_value)){
            if(force_value) $('#check_reg').removeClass('active');
            else $('#check_reg').addClass('active');
        }else{
            $('#check_reg').toggleClass('active');
        }
        setCookie('reg_noshow', $('#check_reg').hasClass('active') ? 1 : 0);
        if(!$('#check_reg').hasClass('active')) $('#bm_register').show();
        else $('#bm_register').hide();
    }
    this.init = function(){
        _g('registernoob');
    }
})();

eventCalendar = new (function(){
    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }
    var T = this;
    var startDate = null;
    var data = null;
    var mNames = [
        _t('m_styczen', null, 'event_calendar'),
        _t('m_luty', null, 'event_calendar'),
        _t('m_marzec', null, 'event_calendar'),
        _t('m_kwiecien', null, 'event_calendar'),
        _t('m_maj', null, 'event_calendar'),
        _t('m_czerwiec', null, 'event_calendar'),
        _t('m_lipiec', null, 'event_calendar'),
        _t('m_sierpien', null, 'event_calendar'),
        _t('m_wrzesien', null, 'event_calendar'),
        _t('m_pazdziernik', null, 'event_calendar'),
        _t('m_listopad', null, 'event_calendar'),
        _t('m_grudzien', null, 'event_calendar')
    ];

    var dNames = [
        _t('d_monday', null, 'event_calendar'),
        _t('d_tuesday', null, 'event_calendar'),
        _t('d_wednesday', null, 'event_calendar'),
        _t('d_thursday', null, 'event_calendar'),
        _t('d_friday', null, 'event_calendar'),
        _t('d_saturday', null, 'event_calendar'),
        _t('d_sunday', null, 'event_calendar'),
    ];

    this.show = function(d){
        return;
        $('#eventCallendar').show();
        data = d;
        for(var i in data){
            if(/#lvl\[.*?\]#/.test(data[i].descr)){
                var tmpData = /#lvl\[([0-9]*),([0-9]*)\]#/.exec(data[i].descr);
                data[i].lvl_req = [parseInt(tmpData[1]), parseInt(tmpData[2])];
                data[i].descr = data[i].descr.replace(/#lvl\[.*?\]#/, '');
            }
        }
        startDate = this.getStartPoint(new Date());
        this.changeDateCalback();
        g.lock.add('event_calendar');
    }
    this.close = function(){
        $('#eventCallendar').hide();
        g.lock.remove('event_calendar');
    }

    this.changeDateCalback = function(){
        $('#eventCallendar .date-display').html(startDate.getDate()+'-'+(startDate.getMonth()+1)+'-'+startDate.getFullYear());
        $('#eventCallendar .month-display').html(mNames[startDate.getMonth()]);
        this.printWeek();
    }

    this.printWeek = function(){
        $('#eventCallendar .days-wrapper .cell').remove();
        var old_year = null;
        for(var i=0; i<14; i++){
            var date = new Date(startDate.getTime()+(i*24*3600*1000));
            if(old_year === null){
                old_year = date.getFullYear();
            }

            //date.setUTCDate(startDate.getUTC)
            //date.(startDate.getTime() + 1000 * (i*24*3600));
            //console.log(date);
            var display = [];
            for(var k in data){
                if(isset(data[k].lvl_req)){
                    var l = data[k].lvl_req;
                    var lvl = getHeroLevel();
                    if(!(lvl >= l[0] && lvl <= l[1])){
                        continue;
                    }
                }
                var tmp = data[k];
                tmp.attr = tmp.attr&~1;
                //console.log(tmp);
                var y,m,d;
                switch(tmp.attr){
                    //case 1: //one time event
                    case 6: //annual
                    case 0: //annual
                        //var d = pad(parseInt((tmp.date).toString().substr(2,2)));
                        //var m = pad(parseInt((tmp.date).toString().substr(0,2)));

                        var t_date = parseInt(tmp.date);
                        var d = t_date % 100;
                        var m = parseInt(Math.floor(t_date/100));

                        var y = date.getFullYear();

                        if(old_year != y){
                            y = old_year;
                        }

                        var start = strtotime(pad(y)+'-'+pad(m)+'-'+pad(d)+' 00:00:00');
                        var end = start+24*3600-1+((tmp.duration-1)*24*3600);
                        var d_time = date.getTime()/1000;
                        //console.log(d_time);
                        //console.log((pad(y)+'-'+pad(m)+'-'+pad(d)+' 00:00:00')+'   '+end);
                        if(d_time>=start && d_time<=end){
                            display.push(tmp);
                            if(k==44){
                                //console.log(tmp.name)
                                //console.log(date);
                                //console.log(d_time);
                            }
                        }

                        break;
                    case 2: //weekly
                        var dur = (tmp.duration>7 ? 7 : tmp.duration);
                        var d_arr = [];
                        var d = tmp.date;
                        while(d<tmp.date+dur){
                            d_arr.push(d%7);
                            d++
                        }
                        //console.log(d_arr)
                        if(d_arr.indexOf(date.getDay()) >= 0){
                            //console.log(date.getDay()+', #'+date.getDate()+'-'+date.getMonth());
                            //console.log(date)
                            display.push(tmp);
                        }
                        break;
                    case 4: //monthly
                        if(tmp.date<40){
                            var d = pad(tmp.date)
                            var m = pad(date.getMonth()+1);
                            var y = date.getFullYear();
                            var start = strtotime(pad(y)+'-'+pad(m)+'-'+pad(d)+' 00:00:00');
                            var end = start;
                            if(tmp.duration > 1){
                                var end = strtotime('+'+(tmp.duration-1)+' days', start) + 24*3600 - 1; //setting to last day with time 23:59:59
                            }
                            var d_time = date.getTime()/1000;
                            if(d_time>start && d_time<end){
                                display.push(tmp);
                            }
                        }else{
                            var m = pad(date.getMonth()+1);
                            var y = date.getFullYear();
                            var start = strtotime(pad(y)+'-'+pad(m)+'-'+pad(d)+' 00:00:00');
                            var start_date = new Date(start*1000);
                            var week_day = tmp.date%10;
                            var week_num = Math.floor((tmp.date-30)/10);
                            var start_day = start_date.getDay() == 0 ? 7 : start_date.getDay();
                            var start_dd = start + ((week_day - start_day)*24*3600) + ((week_num - ((week_day - start_day) < 0 ? 0 : 1))*7*24*3600);
                            var end = start_dd + (tmp.duration)*24*3600-1;

                            var d_time = date.getTime()/1000;
                            if(d_time>=start_dd && d_time<=end){
                                display.push(tmp);
                            }
                        }
                        break;
                }
            }


            var html = '<div class=cell>\n\
                    <div class="inner-cell">\n\
                      <div class="day-and-date">\n\
                      </div>\n\
                      <div class="events-holder">\n\
                      </div>\n\
                    </div>\n\
                  </div>'


            var $o = $(html);
            $o.find('.inner-cell .day-and-date').append('<span class=dayname>'+dNames[i%7]+'</span>');
            $o.find('.inner-cell .day-and-date').append('<span class=day>'+date.getDate()+'/'+(pad(date.getMonth()+1))+'</span>');
            display.sort(function(a,b){
                return a.duration - b.duration;
            });
            var tmpDisp = display.splice(0,2);
            var $holder = $o.find('.events-holder');
            for(var n in tmpDisp){
                var $singleEvent = $('<div class="single-event"></div>');
                var tmp = tmpDisp[n];
                $singleEvent.append('<span class=ev_name>'+tmp.name+'</span>').attr('tip', tmp.descr);
                if(tmp.icon){
                    var $bg = $('<div class=bg></div>');
                    if(tmp.icon.match(/\./)) $bg.css({backgroundImage:'url('+tmp.icon+')'});
                    else $bg.css({backgroundColor:tmp.icon,opacity:0.2});
                    $singleEvent.prepend($bg);
                }
                $holder.append($singleEvent);
            }
            $('#eventCallendar .days-wrapper').append($o);
        }
        $('.single-event').mouseenter(function(){
            $(this).animate()
        }).mouseleave(function(){

        })
    }

    this.nextMonth = function(){
        startDate.setMonth(startDate.getMonth()+1);
        startDate = this.getStartPoint(startDate);
        this.changeDateCalback();
    };
    this.nextWeek = function(){
        startDate.setDate(startDate.getDate()+7);
        this.changeDateCalback();
    };
    this.prevMonth = function(){
        startDate.setMonth(startDate.getMonth()-1);
        startDate = this.getStartPoint(startDate);
        this.changeDateCalback();
    };
    this.prevWeek = function(){
        startDate.setDate(startDate.getDate()-7);
        this.changeDateCalback();
    }

    //always returns date starting from previous monday of given date
    this.getStartPoint = function(d){
        if(d.getDay() != 1){
            d.setTime(d.getTime() - (((d.getDay() == 0 ? 7 : d.getDay()) -1)*24*3600000));
        }
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        return d;
    }

    this.initCall = function(){
        _g('calendar');
    }
    $(document).ready(function(){
        $('#eventCallendar .week-switch.next .inner-cell').click(function(){T.nextWeek()});
        $('#eventCallendar .week-switch.previous .inner-cell').click(function(){T.prevWeek()});
        $('#event_calendar_switch').click(T.initCall);
        $('#eventCallendar .month-switch.next').click(function(){T.nextMonth()});
        $('#eventCallendar .month-switch.previous').click(function(){T.prevMonth()});
    });
})();


adventCallendar = new (function(){
    var visible = false;
    var items = {};
    this.parseData = function(data){
        this.initWindow();
        for(var i=0; i<data.length; i++){
            if(data[i]){
                $('#advent_window_'+i).addClass('open').removeClass('closed');
                this.addItem(data[i], i);
            }
        }
        this.show();
    }

    //this.isDecember = function () {
    //    var d = new Date();
    //    var n = d.getMonth();
    //    if (_l() == 'en') return;
    //    if (n == 11) $('#bm_advent').css('display','block');
    //};

    this.show = function(html){
        if(!visible){
            $('#adventCallendar').show();
            visible = true;
        }
    }

    this.checkItem = function(item, id){
        id = parseInt(id);
        var idx = item.x+(item.y*6);
        return isset(items[idx]) && items[idx] == id;
    }
    this.addItem = function(id, idx){
        id = parseInt(id);
        if(!(isset(g.item[id]) && $('#advent_window_'+idx).length)) return;
        if(isset(items[idx]) && items[idx] == id) return;
        $('#adv_item_wrapper_'+idx).html(createItem(g.item[id]));
        items[idx] = id;
    }
    this.initWindow = function(){
      if(!$('.advent-window').length){
          var html = '<div class=inner>';
          for(var i=0; i<24; i++){
              html += '<div class="advent-window closed" id="advent_window_'+i+'">'+
              '<span tip="'+_t('open_window', null, 'advent')+'">'+(i+1)+'</span><div class="item-container" id="adv_item_wrapper_'+(i)+'"></div>'+
              '</div>';
          }
          html +='</div>'
          $('#adventCallendar .windows-wrapper').html(html);
          $('#advent_header_txt').html(goldTxt(_t('advent_header', null, 'advent')))
          $('#adventCallendar .advent-window span').click(function(){
              var day = parseInt($(this).parent().attr('id').substr(14));
              _g('advent&day='+(day+1));
          });
      }
    }

    this.close = function(){
        $('#adventCallendar').hide();
        visible = false;
    }

    this.callInit = function(){
        this.initWindow();
        _g('advent');
    }
})();

var progressbar = new (function(){
    var getBar = function(){
        return $('#hero .__progress_bar').length ? $('#hero .__progress_bar') : null;
    };

    this.update = function(data){
        var value = data[1] - data[0];
        if(value < data[1]) {
            var bar = getBar();
            if (!bar) {
                bar = $('<div class="__progress_bar"><div class="inner"></div></div>');
                $('#hero').append(bar);
            }

            bar.find('.inner').css({
                width: (value/data[1] * 100)+'%'
            });

            this.reposition();
            g.lock.add('progressbar');
        }else{
            this.hide();
        }
    };


    this.reposition = function(){
        var bar = getBar();
        if(bar){
            bar.css({
                left:$('#hero').width() / 2 - bar.width() / 2
            })
        }
    };

    this.hide = function(){
        var bar = getBar();
        if(bar) bar.remove();

        g.lock.remove('progressbar');
    }
})();

/*(function(){
 var goAprilSnake = function(){
 var $o = $('<div class=aprilsnake></div>');
 $('#centerbox').append($o);

 clearInterval()
 $o.animate({
 left:-96
 }, 7000, 'linear');
 }

 releaseSnake = function(){
 setTimeout(function(){
 goAprilSnake();
 releaseSnake();
 }, 25000 + Math.random() * 5000);
 }

 setTimeout(function(){
 releaseSnake();
 goAprilSnake();
 }, 10000 + Math.random() * 5000);

 })();*/


//always at the end
tutorialStart(0);
//if(_l()=='pl') __skins.load('halloween');
$(document).ready(function(){
    //if(_l() != 'pl') $('#premiumshop .buymore_ps').hide();
    initStartFightBlockade();
    initCodeMessageController();
    initTplsManager();
    initNpcIconManager();
    initServerStorage();
    initNpcTplManager();
    initNightController()
    initBusinessCardsManager();
    initChatController();
    initDisableItemsManager();
    initItemsMovedManager();
    initQuestLog();
    //initMatchmakingTutorialManager();
    initStaticStrings();
    initClanAttrChange();
    initBMAttrChange();
    initPremiumShop();
    initMatchmakingSummary();
    initDragonChests();
    initMCAddon();
    initSMCAddon();
    initBuildsManager();
    setTimeout(function() {
        let data		= {
            ['M_CLIENT_DATA'] : {
                WIDTH  : (___M_WIDTH_0  + ___M_WIDTH_1  + ___M_WIDTH_2  + ___M_WIDTH_3  + ___M_WIDTH_4  + document.documentElement.clientWidth) / 6,
                HEIGHT : (___M_HEIGHT_0 + ___M_HEIGHT_1 + ___M_HEIGHT_2 + ___M_HEIGHT_3 + ___M_HEIGHT_4 + document.documentElement.clientHeight) / 6,
                TIME   : (___M_TIME_0   + ___M_TIME_1   + ___M_TIME_2   + ___M_TIME_3   + ___M_TIME_4   + new Date().getTime()) / 6,
                ZOOM   : (___M_ZOOM_0   + ___M_ZOOM_1   + ___M_ZOOM_2   + ___M_ZOOM_3   + ___M_ZOOM_4   + devicePixelRatio) / 6,
                MOBILE : navigator.userAgentData.mobile
            }
        };

        getEngine().serverStorage.sendData(data);


    },0);

});
