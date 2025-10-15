function newGateway(d2) {
  var gwids = [];
  for(var k=0; k<d2.length; k+=5) {
    var gwid="gw"+(d2[k+2]*256+d2[k+1]);
    var tip = htmlspecialchars(escapeHTML(g.townname[d2[k]]))+(d2[k+3]?'<br>('+_t('require_key', null, 'gtw')+')':''); //wymaga klucza
    var data = {min:(parseInt(d2[k+4])&0xffff),max:((parseInt(d2[k+4])>>16)&0xffff)};
    var available = true;
    if (d2[k+4]!=0)
      if (data.min != data.max){
        tip += '<br>'+_t('gateway_availavle', null, 'gtw')+ //PrzejÅcie dostÄpne'
        (data.min!=0?_t('from_lvl %lvl%', {'%lvl%':data.min}, 'gtw'):'')+ //' od '+data.min
        (data.max>=1000?'':_t('to_lvl %lvl%', {'%lvl%':data.max}, 'gtw'))+_t('lvl_lvl', null, 'gtw'); //' do '+data.max //' poziomu'
        if(data.min!=0 && data.min>getHeroLevel()) available = false;
        else if(data.max<1000 && data.max<getHeroLevel()) available = false;
      }

      else{
        tip += '<br>'+_t('gateway_availavle_for %lvl%', {'%lvl%':data.max}, 'gtw'); //PrzejÅcie dostÄpne dla '+data.max+' poziomu'
        if(data.max != getHeroLevel()) available = false;
      }
    $("<div class=\"gw gwmap"+d2[k]+"\" id="+gwid+" style='top:"+(d2[k+2]*32)+"px; left:"+(d2[k+1]*32)+"px' tip='"+tip+"'></div>").click(function(e){
      hero.mClick(e)
    }).appendTo('#base');
    g.gw[d2[k+1]+'.'+d2[k+2]]=available;
    g.gwIds[d2[k]] = d2[k+1]+'.'+d2[k+2];
  }
  if(isset(g.gw[hero.x+'.'+hero.y])) hero.autoWalkLock=true;

  //remove all quest track placeholders if any exist on a place of gateway
  for(var i in g.gw){
    var tmp = i.split('.');
    questTrack.removePlaceholder([1,tmp[0],tmp[1]]); //workaround to remove placeholders from gateways
    for(var i in g.gwIds) questTrack.checkGwAndHighlight(i);
  }
}

function loadImg(url,id,cb) {
  //var img=new Image();
  if(url.indexOf('/')) url=g.opath+url;
  //$(img).on('load', cb).on('error', function(){
  //  log($(this).attr('src'),2);
  //}).attr({
  //  dest:id,
  //  src:url
  //});

  let img = ImgLoader.onload(
      url,
      null,
      cb,
      () => {
        log(url,2);
      }
  );

  img.setAttribute("dest", id);
}


const mergeNpcDataWithNpcTplData = (data) => {
  let tplId 		= data.tpl;
  let tplData 	= getEngine().npcTplManager.getCloneNpcTpl(tplId);

  if (tplData != null) {

    for (let oneAttr in tplData) {
      if (oneAttr == "id") {
        continue;
      }

      if (oneAttr == "nick" && data.nick) {
        continue;
      }

      data[oneAttr] = tplData[oneAttr];
    }

  }
};

const mergeNpcDataWithNpcIconData = (data) => {
  let iconId 		= data.icon.id;
  let icon 		= getEngine().npcIconManager.getNpcIcon(iconId);

  if (icon != null) data.icon = icon;
  else {
    if (data.icon.special) 		data.icon = data.icon.special;
    else 						errorReport("elements.js", "mergeNpcDataWithNpcIconData", "nima", data)
  }
};

const parseNpcData = (data) => {
  if (data.canWalkOver) {
    data.walkover = data.canWalkOver;
    delete data.canWalkOver;
  }

  if (isset(data.group)) {
    data.grp = data.group;
    delete data.group;
  }
}


function preNewNpc(d) {
  for (var t in d) {
    //if (isset(g.npc[t]) && isset(d[t].del) && isset(g.npc[t].y) && isset(g.npc[t].y)) map.nodes.changeCollision(g.npc[t].x, g.npc[t].y, false);
    //else {

    let id            = d[t].id;
    let tplId         = d[t].tpl;
    let oneNpcData    = d[t];
    let oneNpcObject  = g.npc[id];
    let npcTpl        = g.npcTplManager.getNpcTpl(tplId);

    let newXNpc       = oneNpcData.x;
    let newYNpc       = oneNpcData.y;


    if (oneNpcObject) {

      let npcX          = oneNpcObject.x;
      let npcY          = oneNpcObject.y;

      if ((npcX != newXNpc || npcY != newYNpc)) {
        map.nodes.changeCollision(npcX, npcY, false);
      }
    }

    if (npcTpl) {

      let type = npcTpl.type;

      if (type!=4 && type!=7) {

        if (isset(oneNpcData.y) && isset(oneNpcData.y)) {

          let value = !d[t].walkover;
          map.nodes.changeCollision(newXNpc, newYNpc, value);

        } else {
          console.error("x or y undefined", oneNpcData);
        }


      }
    }

  }

  newNpc(d);

  if(map.nodes != null) {
    map.nodes.reloadGroups();
  }
}

function refreshTipOfNpc (npcId) {

  let o = g.npc[npcId];
  if (!o) return;

  if (!o.hasOwnProperty('elasticLevelFactor')) return;

  if (o.lvl || o.type != 4) {
    //this.tip = [this.getTip(), 't_npc'];
    let tip = g.tips.npc(o);
    $('#npc' + npcId).attr('tip', tip);
  }
}

function getElasticMobLevel (npcObj) {
  let level = getElasticMobLevelAfterSubElasticLevelFactor(npcObj);

  return Math.min(level, 300);
}

function getElasticMobLevelAfterSubElasticLevelFactor (npcObj) {

  let eLF = parseInt(npcObj.elasticLevelFactor);

  if (!g.party) return parseInt(getHeroLevel()) + eLF;

  let member = getMemberFromHeroMapWithTheBigestLevel();

  return member ? (parseInt(member.lvl) + eLF) : (parseInt(getHeroLevel()) + eLF);
}

function getMemberFromHeroMapWithTheBigestLevel () {
  let temp = null;
  let others = g.other;
  let members = g.party;
  for (let k in members) {
    if (!others[k]) continue;

    if (!temp) {
      if (others[k].lvl > getHeroLevel()) temp = others[k];
    }
    else {
      if (temp.lvl < others[k].lvl) temp = others[k];
    }
  }

  return temp
};

function updateDeleteNpcData (deleteNpcData) {
  for (let i = 0; i < deleteNpcData.length; i++) {
    let id = deleteNpcData[i].id;
    if (isset(g.npc[id])) deleteNpcInstance(id);
  }
}

function deleteNpcInstance (id) {
  let npcToDelete   = g.npc[id];
  let $bubbleDialog = $('#npc' + id + ' #bubbledialog');
  let $npc          = $('#npc' + id);

  map.nodes.changeCollision(npcToDelete.x, npcToDelete.y, false);

  if($bubbleDialog.length) $('#bubbledialog').detach();

  $npc.remove();

  if(isset(npcToDelete.x)) delete g.npccol[npcToDelete.x + 256 * npcToDelete.y];

  delete g.npc[id];

  questTrack.checkTaskNpc(id);
}

function newNpc(d) {
  for(let kk in d) {
    mergeNpcDataWithNpcTplData(d[kk]);
    mergeNpcDataWithNpcIconData(d[kk]);
    parseNpcData(d[kk]);
  }

  if(!isset(g.tips.npc))
    g.tips.npc=function(n) {
      // var notip = false;
      var tip="<b>"+htmlspecialchars(parseBasicBB(n.nick))+"</b>";
      if(n.type!=4) {
        if (n.wt > 99) tip += '<i>' + _t('wt_titan', null, 'npc') + '</i>'; //tytan
        else if (n.wt > 89) tip += '<i>' + _t('wt_colossus', null, 'npc') + '</i>'; //kolos
        else if(n.wt>79) tip+='<i>'+_t('wt_hero', null, 'npc')+'</i>'; //heros
        else if(n.wt>29) tip+='<i>'+_t('wt_elite3', null, 'npc')+'</i>'; //elita III
        else if(n.wt>19){
          tip+='<i>'+_t('wt_elite2')+'</i>';
          //if () notip = true;
          // notip = true;
        }
        else
        if(n.wt>9) tip+='<i>'+_t('eliteI', null, 'npc')+'</i>'; //elita
        var lvlcol='';

        let level;

        if (n.hasOwnProperty('elasticLevelFactor')) level = getElasticMobLevel(n);
        else                                        level = n.lvl;

        if(n.type==2 || n.type==3) {
          var dl=level-getHeroLevel();
          if(dl<-13) lvlcol='style="color:#888"';
          else
          if(dl>10) lvlcol='style="color:#f50"';
          else
          if(dl>5) lvlcol='style="color:#ff0"';
        }
        var coma = level == 0 ? '' : ', ';
        tip+='<span '+lvlcol+'>'+(level?(level+" lvl"):'')+(n.grp?coma+'grp':'')+'</span>';
      }
      // if((RegExp('^/obrazki/npc/tmp/').test(n.icon)?'nodef':'')) notip = true;
      return tip;//!notip?tip:null;
    }
  for(k in d) {

    let npcId = d[k].id;
    var tmpBubble = null;
    if(isset(g.npc[npcId])) {
      if($('#npc'+npcId+' #bubbledialog').length){
        tmpBubble = $('#bubbledialog').detach(); //tmp holder for dialog bubble if there is any inside removed npc
      }
      $('#npc'+ npcId).remove();
      if(isset(g.npc[npcId].x)) delete g.npccol[g.npc[npcId].x+256*g.npc[npcId].y];
      //if(isset(g.agressiveNpc[k])) delete g.agressiveNpc[k];
      delete g.npc[npcId];
    }
    /*
    if(isset(d[k].del)){
      questTrack.checkTaskNpc(k);
      continue;
      if(tmpBubble) $(body).append(tmpBubble.css('display', 'none')); //detaching bubble to body if npc is removed
    }
    */
    //if (d[k].type == 6 && !isset(g.agressiveNpc[k])){g.agressiveNpc[k] = false};
    if(d[k].icon.charAt(0)!='/')d[k].icon='/'+d[k].icon;
    d[k].icon=g.opath+'npc'+d[k].icon;
    //d[k].id=k;
    g.npc[npcId]=d[k];
    g.npc[npcId].imgStatus = false;
    var wtip='';
    var tip = g.tips.npc(d[k]);
    if(d[k].type!=4 || d[k].lvl) wtip=" ctip=t_npc "+(tip?"tip='"+g.tips.npc(d[k])+"'":'')+"";

    if (d[k].isIconInvisible) {

    } else {
      $('#base').append("<div class=\"npc "+(RegExp('^/obrazki/npc/tmp/').test(d[k].icon)?'nodef':'')+"\" id=npc" + npcId + wtip + "></div>");
    }

    //if(isset(d[k].qm) && d[k].qm){
    //if((d[k].actions >> 7) & 1 || (d[k].actions >> 6) & 1) {
    if(d[k].hasOnetimeQuest || d[k].hasDailyQuest) {
      if(_l() == 'pl'){
        $('#npc'+npcId).append('<img src="'+CFG.epath+'y-quest-mark.gif">');
      }else{
        $('#npc'+npcId).append('<div class="qm'+(d[k].qm%2==0?' daily':'')+'">'+(d[k].qm<3?'?':'!')+'</div>');
      }
    }
    var order = 0.0;
    var renewableOrObject = d[k].type == 4 || d[k].type == 7;
    if (renewableOrObject) order += parseInt(d[k].wt);
    order = (renewableOrObject && order < 0) ? 0.01 : order += d[k].y;
    $('#npc'+npcId).css({
      left:d[k].x*32,
      top:d[k].y*32-16,
      zIndex:getLayerOrder(order,10)
      }).bind('contextmenu', function(e){
        var k=this.id.substr(3);
        if(g.npc[k].type==2 || g.npc[k].type==3 || g.npc[k].type==9){
          e.preventDefault();
          return _g("fight&a=attack&id=-"+k+'&ff=1');
        }
      }).click(function(e){
        //prevent click when bubble dialog is being closed
        if(isset(g.talk.block) && g.talk.block){
          delete g.talk.block;
          return false;
        }
        var k=this.id.substr(3);
        if(Math.abs(g.npc[k].x-hero.x)>1 || Math.abs(g.npc[k].y-hero.y)>1) {
          hero.mClick(e);
          return;
        }

        let currentNpc  = g.npc[k];
        let samePos     = currentNpc.x == hero.x && currentNpc.y == hero.y;

        if (currentNpc.walkover && !samePos) {
          //let mouseBlock = hero.opt & (1 << 7 - 1);
          let mouseBlock = !getEngine().settingsOptions.isMouseHeroWalkOn();
          if (!mouseBlock) hero.mClick(e);
          return;
        }

        var m=[];
        var fightOnly = true;
        if(g.npc[k].type==4) return;
        if(g.npc[k].type==0 || g.npc[k].type==6 || g.npc[k].type==7){m[0]=[_t('talk', null, 'menu'),'_g("talk&id='+k+'")'];fightOnly=false}; //'Rozmawiaj'
        if(g.npc[k].type==2 || g.npc[k].type==3) m[0]=[_t('attack', null, 'menu'),'_g("fight&a=attack&ff=1&id=-'+k+'")']; //'Atakuj'
        if(g.npc[k].type==2 || g.npc[k].type==3) m[1]=[_t('attack_turn', null, 'menu'),'_g("fight&a=attack&id=-'+k+'")']; //'Walcz turowo'
        if(g.npc[k].type==5){m[0]=[(g.npc[k].wt==1)?_t('run', null, 'menu'):_t('lookat', null, 'menu'),'_g("talk&id='+k+'")'];fightOnly = false;} //'Uruchom', 'Obejrzyj'
        if(isset(g.npc[k].e2jmp) && g.npc[k].e2jmp == 1){
          m.push([_t('e2jump_over', null, 'menu'),'_g("e2jmp&x='+g.npc[k].x+'&y='+g.npc[k].y+'")']);
          fightOnly = false;
        }
        if(fightOnly){
          if(getHeroLevel() <25 && !g.party && g.npc[k].grp == 0) return _g("fight&a=attack&id=-"+k+'&ff=1');
          return _g("fight&a=attack&id=-"+k);
        }
        if(!g.talk.id) showMenu(e,m);
      }).mousedown(function(e){
        return false
      })
      if(g.npc[npcId].type==4 && (g.npc[npcId].tip == '' || !isset(g.npc[npcId].tip)) && (g.npc[npcId].nick == '' || !isset(g.npc[npcId].nick))){
        $('#npc'+npcId).mouseenter(function(){
          _areaRegStorage.registerArea($(this).attr('id').substr(3));
        });
      }
    if(d[k].type!=4 && d[k].type!=7){
      if (!d[k].walkover) {
        g.npccol[d[k].x + 256 * d[k].y] = true;
        hero.checkNPCRoadCollision(d[k].x, d[k].y);
      }
    }
    g.npc[npcId].imgload=function(){
      var action = checkActionExist(this.icon);
      this.imgStatus=true;

      this.fw=this.img.width / action;
      this.fh=this.img.height;

      var tmpLeft = this.x*32+16-Math.round(this.fw/2)+((this.type>3&&!(this.fw%64))?-16:0);
      var wpos=Math.round(this.x)+Math.round(this.y)*256, wat=0;
      if(isset(map) && isset(map.water[wpos])) wat=map.water[wpos]/4;
      $('#npc'+this.id).css({
        backgroundImage:'url('+this.img.src+')',
        left:tmpLeft,
        top:this.y*32+32-this.fh+(wat>8?0:0),
        width:(tmpLeft+this.fw>map.x*32?map.x*32-tmpLeft:this.fw),
        height:this.fh-(wat>8?((wat-8)*4):0)
      }).removeClass('nodef');

      if (this.type == 4) {
        $('#npc'+this.id).css({
          'pointer-events': 'none',
          top: this.y*32+32-this.fh,
          height: this.fh
        });
      }

      // this.fw=this.img.width;
      // this.fh=this.img.height;
      delete this.img;
      if(isset(g.checklist['npc'+this.id])) g.checklist['npc'+this.id](this);
      // synchro, in case of dialog comes earlier than npc table is filled
      if(g.talk.insideDialogSynchroId == this.id)initiateNpcInsideDialog(this.id);
      if(g.talk.dialogCloud == this.id) createDialogCloud(this.id);
      if(tmpBubble) $('#npc'+this.id).append(tmpBubble);

      //highlighting area for tutorial purpose
      if((this.id).toString().match(/23085|21933|22310|21952|22172|17176/) && !__tutorials.val&&1){
        Highlighter.startH.synchroStart('npc');
        Highlighter.startH.npcId = this.id;
      }
      //g.objectCallbacks.runCallbackQueue(this.id, 'imageLoad', 'npc');
    }
    createImageInNpcArray(npcId);
    //g.npc[k].img=new Image();
    //$(g.npc[k].img)
    //.on('load', $.proxy(g.npc[k], 'imgload'))
    //.on('error', function(){
    //  log($(this).attr('src'),2);
    //})
    //.attr({
    //  src:g.npc[k].icon
    //});
    //g.objectCallbacks.runCallbackQueue(this.id, 'load', 'npc');
    questTrack.checkTaskNpc(npcId);
  }
}

function createImageInNpcArray (id) {
  const currentNpc  = g.npc[id];
  const src         = currentNpc.icon;

  currentNpc.img = ImgLoader.onload(
      src,
      null,
      () => {
        currentNpc.imgload();
      },
      () => {
        log(src, 2);
      }
  );
}


function checkActionExist (filePatch) {
  var myRe = new RegExp(/_s_(.*?)_e_/g);
  var myArray = myRe.exec(filePatch);
  //var frameAmount = 0;

  if (!myArray) return 1;

  if (myArray.length > 2) {
    console.warn('multiple declaration', filePatch);
    return 1;
  }

  var args = myArray[1];

  for (var ii = 0; ii < args.length; ii++){
    var k = args[ii];
    var pInt = parseInt(k);
    if (!Number.isInteger(pInt)) {
      //frameAmount = 1;
      console.warn('argument is not integer');
      return 1
    }
    // else {
    //   frameAmount = Math.max(frameAmount, (pInt + 1));
    // }
  }
  return 5;
}

var _areaRegStorage = new (function(){
  this.activeAreas = [];
  this.registerArea = function(id){
    if(this.activeAreas.indexOf(id)>=0) return;
    if(!isset(g.npc[id])) return;
    this.activeAreas.push(id);
    this.fadeObject(id);
  }
  this.unregisterArea = function(id){
    this.activeAreas.splice(this.activeAreas.indexOf(id), 1);
    //if($.browser.msie || $.browser.opera){
    //  $('#npc'+id).css('visibility', 'visible').stop(true).animate({opacity:1}, 200);
    //}else{
      $('#npc'+id).css('pointer-events', 'auto');
      $('#npc'+id).stop(true).animate({opacity:1}, 200);
    //}
  }
  this.fadeObject = function(id){
    //if($.browser.msie || $.browser.opera){
    //  $('#npc'+id).stop(true).animate({opacity:0}, 200, function(){$(this).css('visibility', 'hidden')});
    //}else{
      $('#npc'+id).css('pointer-events', 'none');
      $('#npc'+id).stop(true).animate({opacity:0.5}, 200);
    //}
  }
  this.checkAreas = function(e){
    var toremove = [];
    for(var i=0; i<this.activeAreas.length; i++){
      if(!this.isMouseInArea(e, this.activeAreas[i])){
        toremove.push(this.activeAreas[i]);
      }
    }
    for(var i=0; i<toremove.length; i++){
      this.unregisterArea(toremove[i]);
    }
  }
  this.isMouseInArea = function(e, id){
    var of = $('#npc'+id).offset();
    var o = g.npc[id];
    if(e.clientX < of.left || e.clientX > (of.left+o.fw) || e.clientY < of.top || e.clientY > (of.top+o.fh)) return false;
    return true;
  }
})();

function deleteFromEqItems (i) {
	var name;
	if (i.cl > 0 && i.cl < 4) name = 'weapon';
	if (i.cl > 5 && i.cl < 8) name = 'magic';
	if (name == null) name = i.cl;
	var eqI = g.eqItems[name];
	if (eqI && eqI == i) delete g.eqItems[name];
}

function getHItems () {
  return g.hItems;
}

function deleteFromHItems (i) {
  delete g.hItems[i.id];
}

function newItem(d) {
  //npc.atak :: 0=dialog, 1=void, 2=attacks, 3=aggresive attack, 4=static object, 5=machine, 6=agressive dialogue, 7=renewable
  var updateCodeWindow = false;
  var lastCl = null;
  var superMarketEqItemCounter = 0;

  for(var k in d) {
    var oldInitlvl = null;
    if(d[k].loc == 'v' && adventCallendar.checkItem(d[k], k)) continue;
    if(isset(g.item[k])) {

      //let auctionItemWithoutChangeLoc = d[k].loc === 'a' && g.item[k].loc === 'a';
      let itemChangeLocFromGToA       = d[k].loc === 'a' && g.item[k].loc === 'g'
      //
      //if (auctionItemWithoutChangeLoc) continue

      var tpos=$('#item'+k).attr('tpos'); //recalc trade items total value
      if(!isNaN(tpos)) {
        var myitem=$('#item'+k).attr('mine')=='true';
        if(myitem) {
          g.trade.myval-=g.item[k].pr;
          $('#mytr_value').html(round(g.trade.myval));
          g.trade.myitems&=~(1<<tpos);
        } else {
          g.trade.val-=g.item[k].pr;
          $('#tr2_value').html(round(g.trade.val));
          g.trade.items&=~(1<<tpos);
        }
      }
      if(isset(d[k].del) && (isset(g.item[k]) && g.item[k].loc == 'x')) waitItemManage.remove(k);
      // $('#item'+k).remove(); // this find only one element with that id

      if (itemChangeLocFromGToA)  $('#bag #item'+k).remove();
      else                        $('[id="item'+k+'"]').remove();

      if(g.item[k].st==0 && g.item[k].loc=='g' && !isset(g.item[k].returned)) g.bags[Math.floor(g.item[k].y/6)][1]--;
      oldInitlvl = isset(g.item[k].initLvl) ? g.item[k].initLvl : null;
      if (isset(g.item[k].returned)) delete g.item[k].returned;
      if ((g.item[k].loc=='d' || g.item[k].loc=='c')
        && isset(g.depo.tmpDropMatrix[g.item[k].x])
        && isset(g.depo.tmpDropMatrix[g.item[k].x][g.item[k].y]))
        delete(g.depo.tmpDropMatrix[g.item[k].x][g.item[k].y]);
      g.bagsPlaces.remove(g.item[k].y*7+g.item[k].x);
      if (g.item[k].loc == 'g') {
        g.itemsMovedManager.removeItem(k);
        deleteFromEqItems(g.item[k]);
        deleteFromHItems(g.item[k]);
        if (isset(g.crafting)) {
          let itemId = parseInt(k);
          if (g.crafting.enhancement) {
            if (g.crafting.enhancement.selectedEnhanceItem === itemId && g.item[k].st !== d[k].st) { // item updated - no deleted
              g.crafting.enhancement.clearAll(itemId);
            }
            if (g.crafting.enhancement.enchant.selectedInventoryItems.includes(itemId)) {
              // g.crafting.enhancement.enchant.removeReagentItem(itemId);
              g.crafting.enhancement.enchant.onReagentDelete(itemId);
            }
          }
          if (g.crafting.salvage && g.crafting.salvage.selectedInventoryItems.includes(itemId)) {
            g.crafting.salvage.onReagentDelete(itemId);
          }
        }

      }
      delete g.item[k];
    }
    if(isset(d[k].del)) continue;
    if(isset(d[k].name))
      d[k].name = parseItemBB(d[k].name, true)
    if(d[k].loc=='g' && d[k].own!=hero.id) continue;
    d[k].id=k;
    d[k].readyToAction=true;
    d[k].builds = getBuildsWithItem(d[k])
    // if(d[k].loc=='n')d[k].pr=Math.round(d[k].pr*g.shop.sellp*0.01);
    d[k].tip=itemTip(d[k], true);
    g.item[k]=d[k];

    g.item[k].$item = createItem(d[k], d[k].tip);

    if(oldInitlvl !== null) g.item[k].initLvl = oldInitlvl;
    switch(d[k].loc) {
      case 'r': //recovery list
        g.itemRecovery.addItem(d[k]);
        break;
      case 'q': //quest award
        var $item = createItem(d[k]);
        $item.addClass('rewitem'+k)
        $('.rew_item_'+k).append($item);
        break;
      case 'm':
        var $item = createItem(d[k]);
        $('#base').append($item);
        $('#item'+k).css({
          left:d[k].x*32,
          top:d[k].y*32,
          zIndex:getLayerOrder(d[k].y, 1)
          }).click(function(e){hero.mClick(e)});
        break;
      case 'g': //owned by player
        if (isset(g.itemRecovery)) g.itemRecovery.removeItem(k);
        newEquip(d[k]);
        if (isset(g.bonusReselectWindow) && g.bonusReselectWindow.selectedItem == k)
          g.bonusReselectWindow.afterUpdateSelectedItem(d[k]);
        if (isset(g.crafting) &&
            isset(g.crafting.enhancement) &&
            g.crafting.enhancement.selectedEnhanceItem == k
        ) g.crafting.enhancement.afterUpdateEnhanceItem(d[k]);


        g.buildsManager.getBuildsCommons().newBuildItem(d[k]);
        if (g.matchmaking.getEqPanelOpen()) g.matchmaking.getBuildsCommons().newBuildItem(d[k]);

        break;
      case 'n': //shop items


        break;
      case 't': //trade between players
        var myitem=hero.id==d[k].own;
        var fun = myitem ? "_g('trade&a=del&tid="+k+"')" : "clickItem(this,"+k+")";
        var $item = createItem(d[k]);
        $item.attr({'onClick': fun, 'data-id': k});
        $('#'+(myitem?'mytr':'tr2')+'_items')
        .append($item);
        for(var i=0; i<10; i++)
          if(!((myitem?g.trade.myitems:g.trade.items)&(1<<i))) {
            var tx=i%5, ty=(i>4)?1:0;
            if(myitem)	g.trade.myitems|=1<<i;
            else 	g.trade.items|=1<<i;
            $('#item'+k).css({
              left:tx*33,
              top:ty*33
              }).attr('tpos',i).attr('mine',myitem);
            break;
          }
        if(myitem) {
          g.trade.myval+=d[k].pr;
          $('#mytr_value').html(round(g.trade.myval, 3));
        }
        else {
          g.trade.val+=d[k].pr;
          $('#tr2_value').html(round(g.trade.val, 3));
        }
        break;
      case 's':
        var myitem=hero.id==d[k].own;
        var fun = myitem ? "_g('trade&a=del&sid="+k+"')" : "clickItem(this,"+k+")";
        var $item = createItem(d[k]);
        $item.addClass('trshow_item');
        $item.attr('onClick', fun);
        $('#'+(myitem?'mytr':'tr2')+'_sitems')
        .append($item);
        $('#item'+k).attr('mine',myitem);
        break;
      case 'b': //mail attachment
        $('#mailatt'+k).html(createItem(d[k]));
        // $('#mailatt'+k).html("<div class=item id='item"+k+"' ctip='t_item' tip='"+d[k].tip+"' style='background-image:url("+g.opath+'itemy/'+d[k].icon+")' onclick=clickItem(this,"+k+")></div>");
        break;
      case '$':
        codeManager.addItem(g.item[k]);
        updateCodeWindow = true;
        break;
      case 'd': //depo
      case 'c': //clandepo
        $('#depo-items').append(createItem(d[k]));
        let doubled = false;
        //filling in depo position markers array
        if (!isset(g.depo.tmpDropMatrix[d[k].x])) g.depo.tmpDropMatrix[d[k].x]={};
        if (isset(g.depo.tmpDropMatrix[d[k].x][d[k].y])) {
          doubled = true;
          // console.log(d[k].x,d[k].y)
        }
        g.depo.tmpDropMatrix[d[k].x][d[k].y]=k;

        let correctPos 	= g.depo.depoOpenTabs.correctPosToSetItemInDepo(d[k].x, d[k].y);
        let _x 		= correctPos.x;
        let _y 		= correctPos.y;
        if (doubled) $('#item'+k).addClass('doubled');
        $('#item'+k).css({
          left  : _x * 33,
          top   : _y * 33
        }).click(function(){depoGet(this)})
        .draggable({
          helper:'clone',
          cancel: '.disable-item-mark',     // cancel: '.disable-item-mark' INSTEAD itemIsDisabled($view)
          appendTo:'body',
          cursorAt:{
            top:16,
            left:16
          },
          zIndex:450,
          containment:[0,0,g.maxx-32,g.maxy-32],
          start:function(e,ui){
            g.depo.drag=true;
            g.mouseMove.enabled=false;
            Tip.disable();
            $(this).css('opacity',0.7);
          },
          //drag:depoDrag,
          stop:function(e,ui){
            g.mouseMove.enabled=true;
            g.depo.drag=false;
            clearTimeout(g.depo.sectionActivateTimeout);
            Tip.enable();
            $(this).css('opacity',1);
            var x=e.clientX-g.left, y=e.clientY-g.top;
            var id=this.id.substr(4);
            if(x>=g.drops.dpx && x<=g.drops.dpx2 && y>=g.drops.dpy && y<=g.drops.dpy2) {
              var dx=Math.min(13,Math.floor((x-g.drops.dpx)/33));
              var dy=Math.min(7,Math.floor((y-g.drops.dpy)/33));

              //if (g.depo.clan) _g('clan&a=depo&a2=move&id='+id+'&dx='+g.item[id].x+'&dy='+g.item[id].y+'&px='+(dx+((g.depo.section-1)*14))+'&py='+dy);
              //else _g('depo&move='+id+'&x='+(dx+((g.depo.section-1)*14))+'&y='+dy);

              //clan&a=depo&op=item_move&id=500086824&x=0&y=0

              dx = dx+((g.depo.section-1)*14);

              let newPos 	= g.depo.depoOpenTabs.correctPosMoveItemsInDepo(dx, dy);
              dx 			= newPos.x;
              dy 			= newPos.y;
/*
              if (g.depo.clan) _g('clan&a=depo&op=item_move&id='+id+'&x='+(dx+((g.depo.section-1)*14))+'&y='+dy);
              else _g('depo&move='+id+'&x='+(dx+((g.depo.section-1)*14))+'&y='+dy);
*/
              if (g.depo.clan)  _g('clan&a=depo&op=item_move&id='+id+'&x='+dx+'&y='+dy);
              else              _g('depo&move='+id+'&x='+dx+'&y='+dy);
            }
            if(x>=g.drops.bx && x<=g.drops.bx2 && y>=g.drops.by && y<=g.drops.by2) {
              var dx=Math.min(6,Math.floor((x-g.drops.bx)/33));
              var dy=Math.min(5,Math.floor((y-g.drops.by)/33))+g.bag*6;

              //if (g.depo.clan) _g('clan&a=depo&a2=get&id='+id+'&dx='+g.item[id].x+'&dy='+g.item[id].y+'&px='+dx+'&py='+dy);
              //else _g('depo&get='+id+'&x='+dx+'&y='+dy);

              //clan&a=depo&op=item_get&id=500086823&x=3&y=2

              if (g.depo.clan) _g('clan&a=depo&op=item_get&id='+id+'&x='+dx+'&y='+dy);
              else _g('depo&get='+id+'&x='+dx+'&y='+dy);
            }
          }
        });
        break;
      case 'x': //loot waiting items
        waitItemManage.add(k);
        break;
      case 'v': //advent items
        adventCallendar.addItem(k, d[k].x+d[k].y*6);
        break;
			case 'k':
				if(g.loots.source == "fight") {
					lootItem(d[k]);
				}else{
					lootboxItem(d[k]);
				}
				break;
      case 'l': //loot window
        if(g.loots.source == "fight") {
          lootItem(d[k]);
        }else{
          lootboxItem(d[k]);
        }
        break;
      case 'e': //register rewards
        ingameRegistration.addItem(k);
        break;
      case 'u': // enhancement preview item (clone with negative id and has changes in stats)
        g.crafting.enhancement.newReceivedItem(d[k]);
        break;
      case 'a': // enhancement preview item (clone with negative id and has changes in stats)
        if(g.auctions) {
          g.auctions.getAuctionItems().newReceivedItem(d[k]);
        }
        break;
      case 'j': // extraction preview item (clone with negative id and has changes in stats)
        g.crafting.extraction.newReceivedItem(d[k]);
        break;
    }

    //possible highlight classes
    var hClass = [];
    var i = g.item[k];
    addHClassesToHClass(i, hClass);

    //add .new highlight class for newly creaded items in players bag
    //console.log('new item['+i.id+'], init:'+i.initLvl+', highlighted earlier:'+(g.highlightedItems.indexOf(i.id)<0 ? 'no' : 'yes')+', loc:'+i.loc);
    if(((g.highlightedItems.indexOf(i.id)<0 && i.initLvl>4 && i.loc == 'g') || (isset(i.nn) && i.nn==1)) && i.cl!=25){
      hClass.push('new');
      g.highlightedItems.push(i.id)
      if(Math.floor(i.y/6) != parseInt(g.bag)){
        if(!$('[bag='+Math.floor(i.y/6)+']').find('.itemHighlighter').length){
          $('[bag='+Math.floor(i.y/6)+']').prepend('<div class="itemHighlighter new"></div>');
        }
      }
    }
    delete i.nn;
    if(isset(i.moved)) delete i.moved;
    if(hClass.length && i.loc != 'r' && !(i.cl==24 && i.loc=='g' && i.st>=20)){
      //var $o = $('<div class="itemHighlighter '+hClass.join(' ')+' '+(hero.opt&4096 ? 'nodisp' : '')+'"></div>');
      var $o = $('<div class="itemHighlighter '+hClass.join(' ')+' ' + getClassOfItemRank() +'"></div>');
      $('#item'+i.id).mouseenter(function(){
        $(this).find('.itemHighlighter.new').removeClass('new');
      })
      $('#item'+i.id).prepend($o);
      //$('.item'+i.id).prepend($o);

      $('.item'+i.id).each(function () {
        $(this).prepend($o.clone())
      })


      g.item[k].$item.prepend($o.clone());
    }

    let itemsStats            = parseItemStat(d[k].stat);
    let expiresStatExist      = isset(itemsStats.expires);
    let timelimitStatExist    = isset(itemsStats.timelimit);
    let amountStatExist       = isset(itemsStats.amount);
    let cursedStatExist       = isset(itemsStats.cursed);
    let bagStatExist          = isset(itemsStats.bag);

    // if(d[k].cl==18 && d[k].stat.match(/expires=([0-9]+)/) && d[k].loc == 'g'){

    if(d[k].cl==18 && expiresStatExist && d[k].loc == 'g'){
      // var matches = d[k].stat.match(/expires=([0-9]+)/);
      // if (parseInt(matches[1])-unix_time()<3*86400) {
      if (parseInt(itemsStats.expires)-unix_time()<3*86400) {
        $('#item'+k).css('background-color','#780000');
        g.item[k].$item.css('background-color','#780000');
      }
    }
    // if(d[k].stat.match(/timelimit=([0-9]+)/)){
    if(timelimitStatExist){
      $('#item'+k).mouseover(function(){
        var id = $(this).attr('id').substr(4);
        $('#item'+id).attr('tip', itemTip(g.item[id]));
        g.item[k].$item.attr('tip', itemTip(g.item[id]));
      })
    }
    // if(d[k].stat.match(/expires=([0-9]+)/)){
    if(expiresStatExist){
      var expiresInterval;
      $('#item'+k).mouseenter(function(){
        var id = $(this).attr('id').substr(4);
        $('#item'+id).attr('tip', itemTip(g.item[id]));
        expiresInterval = setInterval(function () {
          $('#item'+id).attr('tip', itemTip(g.item[id]));
        }, 1000)
      });
      $('#item'+k).mouseleave(function(){
        clearInterval(expiresInterval);
      });
    }
    if(d[k].loc!='m' && d[k].tip.indexOf('noammo')>0) $('#item'+k).css('backgroundColor','#a00');
    // var am1=d[k].stat.match(/amount=([0-9]+)/);
    // var am1=d[k].stat.match(/amount=([0-9]+)/);
    // if(am1 && am1[1]>0 && d[k].st!=10) {
    if(amountStatExist && parseInt(itemsStats.amount)>0 && d[k].st!=10) {
      // updateItemAmount($('#item'+k), am1[1]);
      updateItemAmount($('#item'+k), parseInt(itemsStats.amount));
    }

    // if((/cursed/).test(d[k].stat)){
    if(cursedStatExist){
      // var am1=d[k].stat.match(/amount=([0-9]+)/);
      // if(!am1 || (am1 && parseInt(am1[1])<=0)) {
      if(!amountStatExist || (amountStatExist && parseInt(itemsStats.amount)<=0)) {
        $('#item'+k).css('backgroundColor','#a00');
        g.item[k].$item.css('backgroundColor','#a00');
      }
    }

    if(d[k].cl==24 && d[k].loc=='g' && d[k].st>=20) {
      // var bs1=d[k].stat.match(/bag=([0-9]+)/);
      let bs1 = null;
      if (bagStatExist) {
        bs1 = itemsStats.bag;
      }
      bs1=parseInt(bs1 == null ? 0 : bs1);
      g.bags[d[k].st-20][0]=bs1;
      updateItemAmount($('#item'+k), bs1-g.bags[d[k].st-20][1], {id:'bs'+(d[k].st-20)});
      updateItemAmount(g.item[k].$item, bs1-g.bags[d[k].st-20][1], {id:'bs'+(d[k].st-20)});
    } else {
      if(d[k].st==0 && d[k].loc=='g')g.bags[Math.floor(d[k].y/6)][1]++;
    }

    $('#item'+k+', .rewitem'+k).append(`<img src="img/def-item.gif?v=${_CLIENTVER}" class="imhdefolder" />`)
    g.item[k].$item.append(`<img src="img/def-item.gif?v=${_CLIENTVER}" class="imhdefolder" />`)

    loadImg('itemy/'+d[k].icon,k,function(){
      var k=$(this).attr('dest');
      $('#item'+k+' .imhdefolder, .rewitem'+k+' .imhdefolder').remove();
      $('#item'+k+', .rewitem'+k).append(this);
      g.item[k].$item.find('.imhdefolder').remove();
      g.item[k].$item.append($(this).clone());
    });
    if (isset(g.ah.synchroItems[k])){
      //$('#ah_list table tbody').append(ah_item_row_mod(g.ah.synchroItems[k], null));
      //$('#ah_list table tbody').find('.auction-record-id-' + k).replaceWith(ah_item_row_mod(g.ah.synchroItems[k], null));
      delete g.ah.synchroItems[k];
    }
  }
  updateBags();
  if(updateCodeWindow) codeManager.updateItems();
  g.bagsPlaces.onItemsUpdated();
}

function getBuildsWithItem (item) {
  if (!((item.cl >= 1 && item.cl <= 14) || item.cl === 29)) return null;
  const builds = g.buildsManager.getBuildsCommons().getItemByIdInBuilds(item.id);
  return builds !== null ? Object.keys(builds) : null;
}

function clickItem (e, id) {
  showMenuItem(g.item[id], $(e));
}

showMenuItem = function(data, $item) {
  if (isset((parseItemStat(data.stat)).canpreview)) {
    var fun = '_g("moveitem&st=2&id=' + data.id + '"); g.tplsManager.deleteMessItemsByLoc("p");g.tplsManager.deleteMessItemsByLoc("s");';
    showMenu(
        {target:$item},
        [
          [_t('show', null, 'item'), fun, true]
        ]
    );
  }
};

function updateItemAmount($e, amount, params){
  var sml = $e.find('small');
  if(!sml.length){
    sml = $('<small></small>').css('opacity', 0.5);
    if(isset(params)) {
      for(var i in params){sml.attr(i, params[i]);}
    }
    $e.append(sml);
  }
  amount = typeof amount === 'string' && amount.includes(':') ? '' : roundShorten(amount);
  sml.html(amount);
}

function setItemType (i, itemTypeName, itemTypeSort) {
  i['itemTypeSort'] = itemTypeSort;
  i['itemTypeName'] = itemTypeName;
}

function addHClassesToHClass (i, hClass) {
  const itemType = { // [className, sort number]
    'heroic': ['t_her', 2],
    'upgraded': ['t_upg', 3],
    'elite' : ['t_uni', 1],
    'unique': ['t_uni', 1],
    'legendary': ['t_leg', 4],
    'artefact': ['t_art', 5],
    'common': ['t_norm', 0] // must be last
  };
  const stats = parseItemStat(i.stat);

  if (isset(stats.rarity)) {
    const rarity = stats.rarity;
    const [itemTypeClass, itemTypeSort] = itemType[rarity];
    hClass.push(itemTypeClass);
    setItemType(i, rarity, itemTypeSort);
  } else {
    setItemType(i, 'common', 0);
    for (const h in itemType) {
      if (isset(stats[h])) {
        const [itemTypeClass, itemTypeSort] = itemType[h];
        hClass.push(itemTypeClass);
        setItemType(i, h, itemTypeSort);
        break;
      }
    }
  }
}

function updateBags () {
  var totalFreeSlots = 0;
  for(var i=0;i<g.bags.length; i++) {
    if (g.bags[i] && g.bags[i][0]) {
      var amount = g.bags[i][0] - g.bags[i][1];
      var value = amount < 0 ? 0 : amount;
      if (i !== (g.bags.length - 1)) { // exclude bag for keys
        totalFreeSlots += value;
      }
      $('#bs' + i).html(value);
    }
  }
  g.freeSlots = totalFreeSlots;
  if (g.loots) {
    lootsUpdateFreeBagSlots();
  }
  //lootsUpdateFreeBagSlots(totalFreeSlots);
}

function callSuperMarket () {
  $.ajax({
    url: 'https://www.margonem.pl/ajax/shopapi.php?tids=&prof=' + hero.prof + '&lvl=' + getHeroLevel() ,
    type: 'POST',
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    success: function (response) {
      if (response == null) {
        $('#for-you-plug-disabled').css('display', 'block');
        return;
      }
      if (response['alsoBuyList']) {}
      if (response['hotList']) {}
      if (response['suggestedList']) {
        var sMarketCounter = 0;
        var $wrapper = $('#shop_sell');
        var list = response['suggestedList'];
        for (var i = 0; i < list.length; i++) {
          var tpl = list[i];
          if(isset(g.superMarketItems[tpl])) {
            if (sMarketCounter > 8) return;
            var item = g.superMarketItems[tpl];
            newSuperMargetItems($wrapper, item, sMarketCounter);
            sMarketCounter++;
          }
        }
      }
    }
  });
}

function isSuperMarketEqItem (item) {
  var cl = item.cl;
  return cl < 15 || cl == 22 || cl == 24;
}

function newSuperMargetItems (wrapper, i, newSuperMargetItems) {
  var newY = Math.floor(newSuperMargetItems / 3);
  var newX = newSuperMargetItems - newY * 3;
  var $clone = $('#item' + i.id).clone();
  $clone.attr('id', '#for-you-item' + i.id);
  $clone.css({
    display: 'block',
    left: 14 + newX * 51 + newX,
    top:  -23 + newY * 53 + newY
  }).appendTo(wrapper);
  $clone.find('img').attr('src', CFG.ipath + i.icon);
  $clone.click(function () {
    shop_buy($('#item' + i.id), i);
  });
}

function eqItemsTable(i) {
	if (i.st == 0 || i.cl > 14 && i.cl != 25 && i.cl != 29) return;

	var name;
	if (i.cl > 0 && i.cl < 4) name = 'weapon';
	if (i.cl > 5 && i.cl < 8) name = 'magic';
	if (name == null) name = i.cl;
	g.eqItems[name] = i;
}

function hItemsTable (i) {
  g.hItems[i.id] = i;
}

function getItemBySlotCords (x, y) {
  for (let k in g.hItems) {
    let item = g.hItems[k];
    if (item.st > 0) continue;
    if (item.x == x && item.y == y) return item;
  }
  return false;
}

function checkBonusReselect (item, itemInSlot, dx, dy) {
  var itemStats = parseItemStat(item.stat);
  var itemInSlotStats = parseItemStat(itemInSlot.stat);
  if (
      isset(itemStats.bonus_reselect) &&
      //isset(itemStats.target_rarity) &&
      isset(itemInSlotStats.bonus)
      //itemStats.target_rarity === itemInSlot.itemTypeName
  ) {
    movedOnItemConfirm(_t('bonus_reselect_confirm', {'%val%': itemInSlot.name}), item.id, dx, dy);
    return true;
  }
  return false;
}

function checkEnhancementAdd (item, itemInSlot, dx, dy) {
  var itemStats = parseItemStat(item.stat);
  if (
      (isset(itemStats.enhancement_add) || isset(itemStats.enhancement_add_point)) &&
      itemInSlot.cl >= 1 && itemInSlot.cl <= 14
  ) {
    this.movedOnItemConfirm(_t('enhancement_add_confirm'), item.id, dx, dy);
    return true;
  }
  return false;
}

function movedOnItemConfirm (msg, itemId, dx, dy) {
  mAlert(msg,2,[function(){
    moveItemSafe(itemId, 'st=0&x='+dx+'&y='+dy);
    return true;
  }, function(){
    return true;
  }]);
}

function newEquip(i) {
	eqItemsTable(i);
  hItemsTable(i);
  if(i.st && i.st<11) { // equipped
    $('#panel').append(createItem(i));
    $('#item'+i.id).css({
      left:eq.wx[i.st-1]+18,
      top:eq.wy[i.st-1]+111
      });
  } else
  if(i.st>19) { // bags
    $('#panel').append(createItem(i));
    $('#item'+i.id).css({
      left:25+(i.st-20)*33,
      top:469
    }).attr('bag',i.st-20).click(function(e){
      $(this).find('.itemHighlighter').removeClass('new');
      g.bag=$(this).attr('bag');
      $('#hlbag').css({
        left:25+g.bag*33
        });
      $('#bag').css({
        top:-198*g.bag
        });
    });
  } else {
    $('#bag').append(createItem(i));
    g.bagsPlaces.add(7*i.y+i.x);
    $('#item'+i.id).css({
      left:i.x*33,
      top:i.y*33
    }).click(function(e){
      if (itemIsDisabled($(this))) return
      shop_sell(this);
      trade_sell(this);
      mailAtt(this);
      // auctionSell(this);
      setAuctionOffItem($(this))
      deposit(this);
      // setBarterItem($(this));
      if(setSalvageItem($(this))) return;
      if(setEnhanceItem($(this))) return;
      if(setExtractionItem($(this))) return;
      if(setBonusReselectItem($(this))) return;
      itemMenu('item', this, e);
      //if(e.ctrlKey) _g('moveitem&st=-2&id='+$(this).attr('id').substr(4))
    });
  }

  let $item = $('#item'+i.id);

  g.disableItemsManager.manageItemDisable(i, $item);

  if(true) {
    $item.draggable({
      helper:'clone',
      appendTo:'body',
      distance: 10,
      cancel: '.disable-item-mark',
      cursorAt:{
        top:16,
        left:16
      },
      scroll: false,
      zIndex:450,
      containment:[0,0,g.maxx-32,g.maxy-32],
      start:function(e,ui){
        if (isItemInSell(i.id)) return false;
        Tip.disable();
        $(this).css('opacity',0.7);
        g.mouseMove.enabled=false;
      },
      drag: function() {
        if (isItemInSell(i.id)) return false;
      },
      stop:function(e,ui){
        g.mouseMove.enabled=true;
        clearTimeout(g.depo.sectionActivateTimeout);
        Tip.enable();
        $(this).css('opacity',1);
        var x=e.clientX-g.left, y=e.clientY-g.top;
        var id=this.id.substr(4);

        let itemStats             = parseItemStat(g.item[id].stat);
        let amountStatExists      = isset(itemStats.amount);
        let teleportStatExist     = isset(itemStats.teleport);
        let bagStatExist          = isset(itemStats.bag);
        let soulboundStatExist    = isset(itemStats.soulbound);
        let emoStatExist          = isset(itemStats.emo);
        let notakeoffStatExist    = isset(itemStats.notakeoff);

        //drop on inventory
        if(x>=g.drops.bx && x<=g.drops.bx2 && y>=g.drops.by && y<=g.drops.by2) {
          var dx=Math.min(6,Math.floor((x-g.drops.bx)/33));
          var dy=Math.min(5,Math.floor((y-g.drops.by)/33))+g.bag*6;
          //splitting items with shiftkey
          // if(g.item[id].stat.match(/amount/) && e.shiftKey){

          if(amountStatExists && e.shiftKey){
            var stats = parseItemStat(g.item[id].stat);
            var am = stats.amount;
            if(am>1){
              // if(isset(stats.quest)) return mAlert(_t('quest_item_cant_split', null, 'item'), 0); //'PrzedmiotÃ³w questowych nie moÅ¼na dzieliÄ.'
              //if(isset(stats.upgraded)) return mAlert(_t('this_item_cant_split', null, 'item'), 0); //'Tego przedmiotu nie da siÄ podzieliÄ.'
              if(!(isset(stats.capacity))) return mAlert(_t('this_item_cant_split', null, 'item'), 0); //'Tego przedmiotu nie da siÄ podzieliÄ.'
              g.split = [id,dx,dy,am];
              mAlert(_t('item_split %max%', {'%max%':(am-1)}, 'item'),3, //'Podziel przedmiot, maksymalna iloÅÄ: '+(am-1)
                [function(){
                    if(isset(g.split)){
                      var v = parsePrice(removeSpaces($('input[name="mAlertInput"]').val()));
                      if(isNaN(v) || v >= g.split[3]){setTimeout(function(){mAlert(_t('split_bad_value', null, 'item'), 0)},300);return;} //'Podano nieprawidÅowÄ wartoÅÄ!'
                      else if(v<1){}
                      else moveItemSafe(g.split[0], 'st=0&x='+g.split[1]+'&y='+g.split[2]+'&split='+v);
                    }
                    delete g.split;
                 },
                 function(){
                   delete g.split;
                 }
                ]);
              return;
            }
          }
          //if(g.item[id].x != dx || g.item[id].y != dy) {
          if(g.item[id].st != 0 || (g.item[id].x != dx || g.item[id].y != dy)) {
            const itemInSlot = getItemBySlotCords(dx, dy);
            if (isItemInSell(itemInSlot.id)) return;
            if (itemInSlot && g.item[id].loc === "g" && itemInSlot.loc === "g") {
              if (checkBonusReselect(g.item[id], itemInSlot, dx, dy)) return;
              if (checkEnhancementAdd(g.item[id], itemInSlot, dx, dy)) return;
            }
            moveItemSafe(id, 'st=0&x='+dx+'&y='+dy);
          }
        }


        //drop on EQ
        if(x>=g.drops.ex && x<=g.drops.ex2 && y>=g.drops.ey && y<=g.drops.ey2) {
          var dx=x-g.drops.ex,dy=y-g.drops.ey;
          if(dx<eq.wx[8]+33 && dy>=eq.wy[8]){
            moveItemSafe(id, 'st=9');
          }else {
            if(!checkItemGoldLimitReach(id)){
              /*if(g.item[id].cl==16 && hero.hp==hero.maxhp && g.item[id].stat.indexOf('leczy=-')==-1
                                                  && (g.item[id].stat.indexOf('leczy=')>=0||g.item[id].stat.indexOf('fullheal=')>=0))
                                                  mAlert('JesteÅ w peÅni siÅ, nie potrzebujesz tego.'); else*/
              // if(g.item[id].cl<15 || g.item[id].cl==16 || g.item[id].cl==17 || (g.item[id].cl==18 && /teleport=/.test(g.item[id].stat))
              if(g.item[id].cl<15 || g.item[id].cl==16 || g.item[id].cl==17 || (g.item[id].cl==18 && teleportStatExist)
                || g.item[id].cl==22 || g.item[id].cl==23 || g.item[id].cl==25 || g.item[id].cl==29
                || g.item[id].cl==30 || g.item[id].cl==31 || g.item[id].cl==32) moveItemSafe(id, 'st=1');
              else mAlert(_t('cant_wera_this', null, 'item')); //'Nie moÅ¼esz tego zaÅoÅ¼yÄ.'
            }
          }
        }


        //drop item to bags slots area
        if(x>=g.drops.gx && x<=g.drops.gx2 && y>=g.drops.gy && y<=g.drops.gy2) {
          var dx=Math.min(6,Math.floor((x-g.drops.gx)/33));
          if(dx<3 || dx==6){
            // if(g.item[id].stat.match(/bag=/) && (g.item[id].st < 20 || g.item[id].st > 26) && !g.item[id].stat.match(/soulbound/)){
            if(bagStatExist && (g.item[id].st < 20 || g.item[id].st > 26) && !soulboundStatExist){
              //'<center><span style="color:red;font-weight:bold;">Czy chcesz zaÅoÅ¼yÄ tÄ torbÄ ?</span><br /><br /><strong>Tak</strong> - chcÄ zaÅoÅ¼yÄ torbÄ (powoduje zwiÄzanie przedmiotu)<br /><strong>Nie</strong> - umieÅÄ jÄ tylko w tym pojemniku</center><br />'
              mAlert(_t('bag_drop_infotxt', null, 'item'), 2, [
                function(){
                  moveItemSafe(id, 'st='+(20+dx)+'&put=1'); //
                },
                function(){
                  moveItemSafe(id, 'st='+(20+dx)+'&put=2');
                }
              ])
            }else moveItemSafe(id, 'st='+(20+dx));
          }
        }
        if(x<512 && g.trade.id) _g('trade&a=add&sid='+id);
        else
        if(g.depo.vis && x>=g.drops.dpx && x<=g.drops.dpx2 && y>=g.drops.dpy && y<=g.drops.dpy2) {
          var dx=Math.min(13,Math.floor((x-g.drops.dpx)/33));
          var dy=Math.min(7,Math.floor((y-g.drops.dpy)/33));

          dx = dx+(g.depo.section-1)*14;

          let newPos 	= g.depo.depoOpenTabs.correctPosMoveItemsInDepo(dx, dy);
          dx 			= newPos.x;
          dy 			= newPos.y;

/*
          if (g.depo.clan) _g('clan&a=depo&op=item_put&id='+id+'&x='+(dx+(g.depo.section-1)*14)+'&y='+dy);
          else _g('depo&put='+id+'&x='+(dx+(g.depo.section-1)*14)+'&y='+dy);
*/
          if (g.depo.clan) _g('clan&a=depo&op=item_put&id='+id+'&x='+dx+'&y='+dy);
          else _g('depo&put='+id+'&x='+dx+'&y='+dy);

          //if (g.depo.clan) _g('clan&a=depo&op=item_put&id=' + id + '&x=' + dx + '&y=' + dy);
          //else _g('depo&put=' + id + '&x=' + dx + '&y=' + dy);


        } else if(g.crafting.salvage) {
          // no drop alert if salvage
        } else if(g.crafting.enhancement) {
          // no drop alert if enhancement
        } else if(g.crafting.extraction) {
          // no drop alert if extraction
        } else if(x<512 && !g.lock.check()) {
          if(g.item[id].name=='ÅnieÅ¼ka') {
            var sx=(x+$('#base').scrollLeft())>>5,
            sy=(y+$('#base').scrollTop())>>5;
            for(var k in g.other)
              if(g.other[k].x==sx && g.other[k].y==sy) _g('emo&a=snowball&id='+k+'&iid='+id);
          // }else if((/emo=.*?/).test(g.item[id].stat)){
          }else if(emoStatExist){
            var s = parseItemStat(g.item[id].stat);
            var sx=(x+$('#base').scrollLeft())>>5,
            sy=(y+$('#base').scrollTop())>>5;
            for(var k in g.other)
              if(g.other[k].x==sx && g.other[k].y==sy) _g('emo&a='+s.emo+'&id='+k+'&iid='+id);
          /*}else if(/emo=pillow/.test(g.item[id].stat)){
            var sx=(x+$('#base').scrollLeft())>>5,
            sy=(y+$('#base').scrollTop())>>5;
            for(var k in g.other)
              if(g.other[k].x==sx && g.other[k].y==sy) _g('emo&a=pillow&id='+k+'&iid='+id);
          }else if(/emo=cocos/.test(g.item[id].stat)){
            var sx=(x+$('#base').scrollLeft())>>5,
            sy=(y+$('#base').scrollTop())>>5;
            for(var k in g.other)
              if(g.other[k].x==sx && g.other[k].y==sy) _g('emo&a=cocos&id='+k+'&iid='+id);
          }else if(/emo=water/.test(g.item[id].stat)){
            var sx=(x+$('#base').scrollLeft())>>5,
            sy=(y+$('#base').scrollTop())>>5;
            for(var k in g.other)
              if(g.other[k].x==sx && g.other[k].y==sy) _g('emo&a=water&id='+k+'&iid='+id);
          }else if(/emo=emohug[1-3]/.test(g.item[id].stat)){
            var sx=(x+$('#base').scrollLeft())>>5,
            sy=(y+$('#base').scrollTop())>>5;
            for(var k in g.other)
              if(g.other[k].x==sx && g.other[k].y==sy) _g('emo&a=water&id='+k+'&iid='+id);
          }else if(/emo=holly/.test(g.item[id].stat)){
            var sx=(x+$('#base').scrollLeft())>>5,
            sy=(y+$('#base').scrollTop())>>5;
            for(var k in g.other)
              if(g.other[k].x==sx && g.other[k].y==sy) _g('emo&a=holly&id='+k+'&iid='+id);
          }else if(/emo=gift/.test(g.item[id].stat)){
            var sx=(x+$('#base').scrollLeft())>>5,
            sy=(y+$('#base').scrollTop())>>5;
            for(var k in g.other)
              if(g.other[k].x==sx && g.other[k].y==sy) _g('emo&a=gift&id='+k+'&iid='+id);
          }else if(/emo=ghost/.test(g.item[id].stat)){
            var sx=(x+$('#base').scrollLeft())>>5,
            sy=(y+$('#base').scrollTop())>>5;
            for(var k in g.other)
              if(g.other[k].x==sx && g.other[k].y==sy) _g('emo&a=ghost&id='+k+'&iid='+id);
          }else if(/emo=kiss2/.test(g.item[id].stat)){
            var sx=(x+$('#base').scrollLeft())>>5,
            sy=(y+$('#base').scrollTop())>>5;
            for(var k in g.other)
              if(g.other[k].x==sx && g.other[k].y==sy) _g('emo&a=kiss2&id='+k+'&iid='+id);*/
          // } else if (/.*notakeoff.*/.test(g.item[id].stat) && (g.item[id].cl == 25 && parseInt(g.item[id].st) == 10))
          } else if (notakeoffStatExist && (g.item[id].cl == 25 && parseInt(g.item[id].st) == 10))
            mAlert(_t('cant_drop_spell', null, 'item')); //'Nie moÅ¼esz zdjÄÄ tego czaru'
          else {
            if (g.item[id].cl == 25 && parseInt(g.item[id].st) == 10) {//bless
              mAlert(_t('drop_bless_question', null, 'item'), 1, [function(){ //'Czy na pewno chcesz zdjÄÄ bÅogosÅawieÅstwo?'
                moveItemSafe(id, 'st=-2')
                }]);
            }else {
              if(!map.is_drop_item_tax) {
                $('#_t8').css('display', 'none');
                $('#drop_ground .asterisk').css('display', 'none');
              }
              $('#dropmenu H3').html(g.item[id].name);
              $('#dropmenu').attr('iid', id).absCenter().fadeIn();
            }
          }
        }
      }
    }).dblclick(function(e){
      if (itemIsDisabled($(this))) return
      if($('#trade').css('display')=='block' || $('#shop').css('display')=='block'
        || $('#mails').css('display')=='block' || $('#auctions').css('display')=='block') return;
      var id=this.id.substr(4);
      if(checkItemGoldLimitReach(id)) return;
      if(g.item[id].cl == 16 || g.item[id].cl == 27 || g.item[id].cl == 23
        || g.item[id].cl==30 || g.item[id].cl==31 || g.item[id].cl==32
        || (g.item[id].cl == 25 && g.item[id].st == 0)) moveItemSafe(id, 'st=1');
    });
  }
}
function itemMenu(kind, e, ev){
	var itemsToCheck;


	switch (kind) {
		case 'item':
			itemsToCheck = g.item;
			break;
		case 'tplo':
			itemsToCheck = g.tplsManager.getItems().o;
			break;
		default:
			console.warn('bad item menu kind :' + kind);
			return;
	}

	var change = kind === 'item' ? 'item' : 'tpl';
	var id=$(e).attr('id').replace(change, '');
	var tplId = kind === 'item' ? itemsToCheck[id].tpl : id;

	if (isset(itemsToCheck[id])) {
    var stats = parseItemStat(itemsToCheck[id].stat);
    if(isset(stats.play)){
      var fun = null;
      var name = '';
      if(typeof soundManager.getSoundById('dialogSound'+id) == 'object'){
        name = _t('turn_off', null, 'item'); //WyÅÄcz
        fun = 'soundManager.destroySound("dialogSound'+id+'")';
      }else{
        var tmp = stats.play.split(',');
        name = isset(tmp[1])?tmp[1]:_t('use_it', null, 'item'); //'UÅ¼yj'
        fun = 'soundManager.destroySound("dialogSound'+id+'"); soundManager.createSound({id:"dialogSound'+id+'",url: "'+tmp[0]+'",autoPlay: true})';
      }
      showMenu(ev,[[name, fun, true]]);
    }
    if(isset(stats.furniture)){
      showMenu(ev, [[_t('use_furniture', null, 'item'), '_fc.init('+id+')', true]]);
    }
    if(isset(stats.canpreview)){

			fun = '_g("moveitem&st=2&tpl=' + tplId + '"); g.tplsManager.deleteMessItemsByLoc("p"); g.tplsManager.deleteMessItemsByLoc("s");';
      //var fun2 = '_g("moveitem&st=1&id=' + id + '");';
      var fun2 = 'moveItemSafe("'+ id+ '" , "st=1");';
			var menu = [];
			if (kind == 'item') menu.push([_t('use_it', null, 'item'), fun2, true]);
			menu.push([_t('show', null, 'item'), fun, true]);

			showMenu(ev, menu);
			//showMenu(ev,
      //  [
      //    [_t('canpreview'), fun, true],
      //    //[_t('take_reward', null, 'matchmaking'), fun2, true]
      //  ]
      //);
    }

    if (isset(stats.bonus_not_selected)) {
      var fun = `_g("moveitem&st=2&id=${id}")`;
      showMenu(
          ev,
          [
            [_t('select_bonus', null, 'item'), fun, true]
          ]
      );
    }
  }
}
/*Furniture controller*/
var _fc = new (function(){
  var data = ['/img/meble_test/m-dywan.gif', 0, null];
  var id = null;
  var cols = null;
  var $e = null;
  var pos = [null, null];
  var size = [0,0];
  var collision = false;
  var T = this;
  this.init = function(id){
    if($e){
      $e.remove();
      $e = null;
    }
    /*var stats = parseItemStat(g.item[id].stat);
    var tmp = stats.furniture.split('|');*/
    id = id;
    var img = new Image();
    img.src = data[0];
    $('#centerbox').append($('<div class=furnitureArea></div>').css({
      width:512,
      height:$('#base').scrollTop()>0?544:512,
      top:$('#base').scrollTop()>0?-16:0
    }));
    img.onload = function(){
      size = [this.width, this.height];
      $e = $('<div class="furnitureIcon init"></div>').css({
        'background-image':'url('+data[0]+')',
        width:size[0],
        height:size[1],
        top:224,
        left:224
      });
      $e.appendTo('#centerbox .furnitureArea');
      T.config();
      g.lock.add('furniture');
    }
  }
  this.config = function(){
    cols = {};
    if(data[2]){
      var tmp = data[2].split(',');
      for(var i=0; i<tmp.length; i++){
        cols[tmp[i]] = 1;
      }
    }else{var l = (size[0]/32)*(size[1]/32);for(var i=0; i<l;i++) cols[i%(size[0]/32)+'x'+Math.floor(i/(size[0]/32))]=1;}
    $e.draggable({
      grid:[32,32],
      containment:'parent',
      start:function(){
        $e.removeClass('init');
      },
      drag:function(){
        T.checkCol();
      },
      stop:function(){
        T.accept();
        T.reset();
      }
    });
    var sx = $('.furnitureArea').width()/32;
    var sy = $('.furnitureArea').height()/32;
    var npcCol = new Array(sx*sy);
    var mcol = map.col;
    for(var i in g.npc){
      npcCol[(g.npc[i].x - map.offset[0]) + (g.npc[i].y - map.offset[1])*sx] = 1;
    }
    for(var y=0; y<sy; y++){
      for(var x=0; x<sx; x++){
        if(mcol.charAt((y+map.offset[1])*map.x + x+map.offset[0]) == '1' || npcCol[x+y*sx] === 1) $('.furnitureArea').append($('<div id="fCol_'+x+'x'+y+'" class=blocker></div>').css({
          top:y*32,
          left:x*32
        }));
      }
    }
  }
  this.checkCol = function(){
    pos = [parseInt($e.css('left'))/32, parseInt($e.css('top'))/32];
    $('.furnitureArea .blocker').removeClass('active');
    collision = false;
    for(var i in cols){
      var tmp = i.split('x');
      var id = '#fCol_'+(parseInt(tmp[0])+pos[0])+'x'+(parseInt(tmp[1])+pos[1]);
      if($(id).length){
        collision = true;
        $(id).addClass('active');
      }
    }
  }
  this.accept = function(){
    //if(!collision) console.log(pos);
  }
  this.reset = function(){
    $('#centerbox .furnitureArea').remove();
    g.lock.remove('furniture');
  }
})();
function Pet(d, master){
  this.domElement = $(document.createElement('div'))
                    .addClass('pet')
                    .appendTo('#base')
                    .attr('ctip', 't_npc');
  this.master = master;
  this.fw=32;this.fh=48;
  this.step=0;
  this.moving = false; //is pet in move
  this.stepIteration = 0;
  this.dir=0;this.pos=0;
  this.stop=false;
  this.actionInterval=null;
  var t = this;
  this.doAction=__doAction;
	this.frameActions = [];
  this.stopAction=function(unlockMove){
    clearInterval(this.actionInterval);
    this.actionInterval = null;
    this.stop=typeof(unlockMove) != 'undefined' && unlockMove ? false : true;
  }

  this.createPetImage = (path) => {
    ImgLoader.onload(
        path,
        null,
        function () {
          t.fw  = this.width/(4+t.auxFrames+(t.anim?1:0));
          t.fh  = this.height/4;

          t.domElement.css({
            width               : t.fw,
            height              : t.fh,
            'background-image'  : 'url(' + path + ')'
          });
        },
        () => {}
    )
  }
  this.update=function(d, isNew){
    if (isset(d)){
      var actionPossible = true;
      if (isset(this.outfit) && this.outfit != d['outfit']) actionPossible = false;
      var outUpdate = false;
      for(var k in d){
        if(k == 'outfit' && (!isset(this.outfit) || this.outfit != d[k])){
          outUpdate = true;
        }
        this[k] = d[k]
      }
      if (isset(d['outfit']) && outUpdate){
        this.stopAction(true);
        //var img = new Image();
        var r           = new RegExp('-([0-9]+)(a?)\.gif');
        var fData       = r.exec(this.outfit);//frames aux data

        if(!fData) fData = [0,0,''];

        this.auxFrames  = isNaN(parseInt(fData[1])) ? 0 : parseInt(fData[1]);
        this.anim       = fData[2] == 'a';
        var tmpPath     = this.outfit.substr(0, 1) != '/' ? '/'+this.outfit : this.outfit;
        //img.src = CFG.ppath+tmpPath;
        //img.onload=function(){
        //  t.fw = this.width/(4+t.auxFrames+(t.anim?1:0));
        //  t.fh = this.height/4;
        //  t.domElement.css({
        //    width: t.fw,
        //    height: t.fh,
        //    'background-image': 'url('+CFG.ppath+tmpPath+')'
        //  });
        //}
        t.createPetImage(CFG.ppath + tmpPath);
      }
      if (isset(d['name'])){
        this.stopAction(true);
        var p_tip = '<b>'+d['name']+'</b>';
        if (isset(d['elite']) && d['elite']){
          var name = null;
          switch(parseInt(d['elite'])){
            case 1:name = _t('elite', null, 'pet');break;
            case 2:name = _t('elite_her', null, 'pet');break;
            case 3:name = _t('elite_leg', null, 'pet');break;
          }
          if(name !== null) p_tip += '<i class="elite cls_'+d['elite']+'">'+name+'</i>'
        }
        p_tip += '<span style="color:#888">'+_t('owner %name%', {'%name%':this.master.nick}, 'pet')+'</span>'; //WÅaÅciciel: '+this.master.nick+'
        this.domElement.attr('tip', p_tip);
      }
      if (isset(d['actions'])){
        var actions = d['actions'].split('|');
				this.frameActions = [];
        for (var i in actions){
          var data = actions[i].split('#');
          this.frameActions.push({
            name:data[0],
            special:(isset(data[1])?parseInt(data[1]):3)
          });
        }
      }
      if (isset(d['action'])){
        /*
         * action: multibyte value (max 32bytes)
         * 0x000f - pet position
         * 0x00f0 - pet special action
         * 0x0f00 - special action additional param
         */
				if (!isset(d['actions'])) this.frameActions = [];
        var pos = getHalfByte(d['action'],0);
        if (!isset(isNew) && this.pos == pos && actionPossible) this.doAction();
        this.pos=pos;
        this.move();
      }
    }
    this.calculatePosition(isset(isNew)&&isNew);
  }
  this.calculatePosition=function(isNew){
    if (this.master == null) return;
    var ox = this.x, oy = this.y;
    var posMod = {1:[0,-1],2:[1,0],3:[0,1],4:[-1,0]};
    var m = this.master;
    // update position only if owner moves
    if (isNew || (!isNew && ((Math.abs(m.x-this.x)+Math.abs(m.y-this.y)) > 1) || this.pos)){
      var x = m.x+((m.dir==1||m.dir==2)?(1*(m.dir==2?-1:1)):0);
      var y = m.y+((m.dir==0||m.dir==3)?(1*(m.dir==0?-1:1)):0);
      if (this.pos && isset(posMod[this.pos])){
        x = m.x+posMod[this.pos][0];
        y = m.y+posMod[this.pos][1];
      }
      /*console.log('################ TEST');
      console.log('map loaded: '+ map.loaded);
      console.log('x>=0 && y>=0: '+ (x>=0 && y>=0));
      console.log('x<map.x && y<map.y: '+ (x<map.x && y<map.y));
      console.log('isset(g.npccol[x+y*256]): '+ isset(g.npccol[x+y*256]));
      console.log('map.col.charAt(x+y*map.x)==\'0\': '+ map.col.charAt(x+y*map.x)=='0');
      */
      if (!map.loaded || !(x>=0 && y>=0 && x<map.x && y<map.y && !isset(g.npccol[x+y*256]) && (map.col.charAt(x+y*map.x)=='0' || map.col.charAt(x+y*map.x)==''))){
        x = m.x;
        y = m.y;
      }

      this.x = x;
      this.y = y;
      if (isNew){
        this.rx = x;
        this.ry = y;
      }
      if(ox != this.x || this.y != oy && !isNew){
        this.stopAction(true);
      }
    }
  }

  this.remove=function(){
    this.domElement.remove();
  }
  this.domElement.click(function(e){
    if (t.own){
      var m=new Array();
      if (!isset(t.quest) || !t.quest) m.push([_t('menu_hide', null, 'pet'), 'hideMyPet()']); //'Schowaj'
      else m.push([_t('menu_hide', null, 'pet'), 'hideMyPet(true)']);
      for(var i=0; i<t.frameActions.length; i++){
        var a = (1+i<<4)|(t.frameActions[i].special<<8);
        m.push([t.frameActions[i].name, '_g("pet&a='+(a)+'")']);
      }
      for(var i=1; i<=5; i++){
        if (i==t.pos || (i==5&&t.pos==0)) continue;
        var n = '';
        switch(i){
          case 5:n = _t('menu_comeafter', null, 'pet');break; //'IdÅº za mnÄ'
          case 1:n = _t('menu_standbehind', null, 'pet');break; //'StaÅ za mnÄ'
          case 2:n = _t('menu_standright', null, 'pet');break; //'StaÅ po prawej'
          case 3:n = _t('menu_standfront', null, 'pet');break; //'StaÅ przede mnÄ'
          case 4:n = _t('menu_standleft', null, 'pet');break; //'StaÅ po lewej'
        }
        m.push([n, '_g("pet&a='+i+'")']);
      }
      showMenu(e,m);
    }
  });
  this.run=function(){
    var ox=this.rx,oy=this.ry;
    if(this.x>this.rx){this.rx+=0.25;this.dir=2;}
    if(this.x<this.rx){this.rx-=0.25;this.dir=1;}
    if(this.y>this.ry){this.ry+=0.25;this.dir=0;}
    if(this.y<this.ry){this.ry-=0.25;this.dir=3;}

    if(this.x-this.rx>2)  this.rx=this.x-2;
    if(this.y-this.ry>2)  this.ry=this.y-2;
    if(this.x-this.rx<-2) this.rx=this.x+2;
    if(this.y-this.ry<-2) this.ry=this.y+2;

    if(ox!=this.rx || oy!=this.ry) {
      var df=0;
      if(this.x!=this.rx) {
        df=Math.abs(this.x-this.rx);
        df=df-parseInt(df);
      } else
      if(this.y!=this.ry) {
        df=Math.abs(this.y-this.ry);
        df=df-parseInt(df);
      }
      this.moving = true;
      this.step=Math.floor(this.stepIteration*4);
      this.stepIteration += 0.125;
      if(this.stepIteration >= 1) this.stepIteration = 0;
    }else{
      this.step = 0;
      this.moving = false;
    }
  }

  this.move=function(){
    if (this.stop) return;
    this.run();
    var wpos=Math.round(this.rx)+Math.round(this.ry)*256, wat=0;
    if(isset(map) && isset(map.water[wpos])) wat=map.water[wpos];
    var tmpW = map.x*32;
    var rOffset = (t.rx*32+16)+(t.fw>>1); //how much px right frame border is going to right side
    this.domElement.css({
      left:t.rx*32+16-(t.fw>>1),
      top:t.ry*32+32-t.fh+((wat/4)>8?0:wat),
      zIndex: getLayerOrder(t.y, 9),
      width:rOffset>tmpW ? t.fw+(tmpW-rOffset) : t.fw,
      backgroundPosition:-((t.step+(t.anim&&t.moving?1:0))*t.fw)+'px '+(-t.dir*t.fh)+'px',
      height:t.fh-((wat/4)>8?(wat-32):wat)
    });
  }
}

function PetStore(d){
  this.domElement = $(document.createElement('div'))
                    .addClass('pet')
                    .attr('tip', _t('click_to_show_special_actions', null, 'pet')); //'Kliknij aby zobaczyÄ dostÄpne akcje specjalne'
  this.stop=false;
  this.actionInterval=null;
  this.demoInterval=null;
  this.actionsList=[];
  this.outfit=0;
  this.wait=0;
  this.actionFrame=0;
  var t = this;

  this.doAction=__doAction;
  this.specialAction=function(a,s){
    this.action = a<<4|(isset(s)&&s?(s<<8):0);
    this.doAction();
    this.wait = 5;
  }
  this.stopAction=function(){;
    clearInterval(this.actionInterval);
    this.actionInterval = null;
    this.stop=false;
  }
  this.startDemo = function(){
    this.demoInterval = setInterval(function(){
      if (t.actionInterval !== null) return;
      if (t.wait > 0) {t.wait--;return;}
      else if (t.wait== 0){
        t.outfit=0;
        t.wait=-1;
      }
      t.outfit=(t.outfit+1) & 15;
      var x=(t.outfit&3)*t.fw;
      var y=(t.outfit>>2);
      if(y==2) y=3;
      else if(y==3) y=2;
      y*=t.fh;
      t.domElement.css({backgroundPosition:"-"+(x+(t.anim?1:0*t.fw))+"px -"+y+"px"});
    }, 200);
  }
  this.init=function(d){
    this.idx = d.idx;
    var tmplist = d.stat.split(',');
    var alist = tmplist.pop().split('|');
    if (alist.length){
      for(var k=0; k<alist.length; k++){
        var tmpO = {action:k,name:alist[k].replace(/#.*/, ''),special:3};
        var tmpSpec = alist[k].match(/#([0-9]*)/);
        if (tmpSpec && isset(tmpSpec[1])) tmpO.special = parseInt(tmpSpec[1]);
        t.actionsList.push(tmpO);
      }
    }
    //var img = new Image();
    var r = new RegExp('-([0-9]+)(a?)\.gif');
    var fData = r.exec(tmplist[1]); //frames aux data
    //this.auxFrames = isNaN(parseInt(fData[1])) ? 0 : parseInt(fData[1]);
    this.anim = fData[2] == 'a';
    t.img = tmplist[1];
    t.petImageOnload(CFG.ppath + t.img, d);
    //img.src = CFG.ppath+t.img;
    //img.onload=function(){
    //  var maxWidth=48;
    //  var maxHeight=75;
    //  t.fw = this.width/(4+t.actionsList.length+(t.anim?1:0));
    //  t.fh = this.height/4;
    //  var leftMod=d.idx*58-(d.idx-1),topMod=3;
    //  var top=(maxHeight/2-t.fh/2)+topMod;
    //  var left=(maxWidth/2-t.fw/2)+leftMod;
    //  t.domElement.css({
    //    width: t.fw,
    //    height: t.fh,
    //    top:top,
    //    left:left,
    //    overflow:'hidden',
    //    'background-image': 'url('+CFG.ppath+t.img+')'
    //  });
    //  t.domElement.appendTo('#shop_sell');
    //
    //  var m = [];
    //  for(var i=0; i<t.actionsList.length; i++){
    //    var a = 1+i;
    //    var s = t.actionsList[i].special;
    //    m.push([t.actionsList[i].name, '__doPreviewAction('+d.idx+', '+a+','+s+'); return false;']);
    //  }
    //  if (m.length){
    //    var actionBox = $('<div class="petActionBox idx'+d.idx+'"></div>').css({
    //      left:d.idx*58-(d.idx-1)
    //    });
    //    for (var i=0; i<m.length; i++){
    //      actionBox.append('<div class="petActionButton" tip="'+m[i][0]+'" onclick="'+m[i][1]+'">'+(i+1)+'</div>');
    //    }
    //    $('#shop_sell').append(actionBox);
    //  }
    //}
    this.startDemo();
  }
  this.remove=function(){
    this.stopAction(true);
    clearInterval(this.demoInterval);
    this.demoInterval = null;
    $('#shop_sell .petActionBox.idx'+this.idx).remove();
    this.domElement.remove();
  }

  this.petImageOnload = (path, d) => {
    let t = this;
    ImgLoader.onload(
        path,
        null,
        function () {
          var maxWidth  = 48;
          var maxHeight = 75;

          t.fw          = this.width / (4 + t.actionsList.length + (t.anim ? 1 : 0));
          t.fh          = this.height / 4;

          var leftMod   = d.idx * 58 - (d.idx - 1), topMod = 3;
          var top       = (maxHeight / 2 - t.fh / 2) + topMod;
          var left      = (maxWidth / 2 - t.fw / 2) + leftMod;

          t.domElement.css({
            width               : t.fw,
            height              : t.fh,
            top                 : top,
            left                : left,
            overflow            : 'hidden',
            'background-image'  : 'url(' + CFG.ppath + t.img + ')'
          });
          t.domElement.appendTo('#shop_sell');

          var m = [];
          for (var i = 0; i < t.actionsList.length; i++) {
            var a = 1 + i;
            var s = t.actionsList[i].special;

            m.push([t.actionsList[i].name, '__doPreviewAction(' + d.idx + ', ' + a + ',' + s + '); return false;']);
          }

          if (m.length) {
            var actionBox = $('<div class="petActionBox idx' + d.idx + '"></div>').css({
              left: d.idx * 58 - (d.idx - 1)
            });
            for (var i = 0; i < m.length; i++) {
              actionBox.append('<div class="petActionButton" tip="' + m[i][0] + '" onclick="' + m[i][1] + '">' + (i + 1) + '</div>');
            }
            $('#shop_sell').append(actionBox);
          }
        }
    )
  }

  this.init(d);
}

//workaround function ..dont ask :)
function hideMyPet(ask){
  if (isset(ask)) mAlert(_t('are_u_sure', null, 'pet'), 2, [function(){_g('pet&a=0')}]); //'Czy jesteÅ pewien ?'
  else _g('pet&a=0');
}
function __doPreviewAction(idx,a,s){
  g.shop.preview[idx].object.specialAction(a,s);
}
function __doAction(){
  var T = this;
  this.stopAction();
  if (!isset(this.action) || !this.action>>4) return;
  var a = getHalfByte(this.action, 1);
  var special = getHalfByte(this.action, 2);
  var inverted = false;
  var waitBeforeInvert = 0;
  var speed = 100;
  if (special > 13 && special <= 15){
    switch(special){
      case 13:speed = 150;break;
      case 14:speed = 200;break;
      case 15:speed = 300;break;
    }
  }
  //console.log(special)
  if ((special >= 0 && special <= 9));
  else if (special >= 10 && special <= 12){
    inverted = true;
    switch(special){ //sets amount of intervals to skip before invert animation starts
      case 11:waitBeforeInvert = 50;break;
      case 12:waitBeforeInvert = 200;break;
    }
    special = 0;
  }else special = 3;
  var loops = special == 0 ? 1 : special;
  this.stop=true;
  this.actionFrame = 0;
  this.actionCounter = 0;
  setTimeout(function(){
    T.actionInterval = setInterval(function(){
      if (T.actionFrame == 4 && waitBeforeInvert){waitBeforeInvert--;return;}
      T.dir = 0;
      var x = -((3+(T.anim?1:0)+a)*T.fw);
      var frame = T.actionFrame;
      if (inverted && T.actionFrame >= 3){
        frame = 3 - ((T.actionFrame>3&&T.actionFrame%3==0)?3:T.actionFrame%3);
      }
      var y = -(frame*T.fh);
      T.domElement.css({
        backgroundPosition:x+'px '+y+'px'
      });
      T.actionFrame++;
      if ((T.actionFrame==4 && !inverted) || (inverted && T.actionFrame == 7)){
        T.actionFrame = 0;
        T.actionCounter++;
        if (T.actionCounter == loops){
          if(speed != 100){
            setTimeout(function(){T.stopAction(special != 0);},speed);
          }else{
            T.stopAction(special != 0);
          }
        }
        if (special == 0) T.stop = true;
      }
    },speed);
  }, 100);
}


function getAddClFromRelation (relation) {
  switch (relation) {
    case SocietyData.RELATION.NONE : return "";
    case SocietyData.RELATION.FRIEND : return 'fr';
    case SocietyData.RELATION.ENEMY : return 'en';
    case SocietyData.RELATION.CLAN : return 'cl';
    case SocietyData.RELATION.CLAN_ALLY : return 'cl-fr';
    case SocietyData.RELATION.CLAN_ENEMY : return 'cl-en';
    case SocietyData.RELATION.FRACTION_ALLY : return 'fr-fr';
    case SocietyData.RELATION.FRACTION_ENEMY : return 'fr-en';
    default : return ""
  }
}

function newOther(d) {
  for(k in d) {
    if(isset(d[k].del)) {
      if (isset(g.other[k]) && isset(g.other[k].pet)){
        g.other[k].pet.remove();
        delete g.other[k].pet;
      }
      delete g.other[k];
      $('#other'+k).remove();
      $('#otherWanted'+k).remove();
      removeOtherChampion(k);
      continue;
    }

    let otherExist = isset(g.other[k]);

    if (otherExist && d[k].action && d[k].action == "CREATE") {
      delete g.other[k].wanted;
      delete g.other[k].matchmaking_champion;
    }

    var tPet = isset(d[k].pet) ? d[k].pet : null;
    if (isset(d[k].pet)) delete d[k].pet;
    //if(!isset(g.other[k])) {
    if(!otherExist) {
      g.other[k]=d[k];
      g.other[k].id=k;
      g.other[k].fw=32;
      g.other[k].fh=48;
      g.other[k].rx=d[k].x;
      g.other[k].ry=d[k].y;
      g.other[k].step=0;
      var cl='t_other';
      //if(d[k].relation!='') cl+=' t_'+d[k].relation;
      if(d[k].relation!='') cl+=' t_'+getAddClFromRelation(d[k].relation);
      $('#base').append("<div class=other id=other"+k+' ctip="'+cl+'"></div>');
      //if (isset(d[k].wanted) && parseInt(d[k].wanted)==1){$('#base').append("<div class=otherWanted id=otherWanted"+k+'></div>');}

      $('#other'+k).click(function(e){
        var k=this.id.substr(5);
        //if(k == g.playerCatcher.activePlayer){
        //  g.playerCatcher.startFollow();
        //  return;
        //}
        if(Math.abs(g.other[k].x-hero.x)>1 || Math.abs(g.other[k].y-hero.y)>1) {
          hero.mClick(e);
          return;
        }
        var m=[];
        if(hero.x==g.other[k].x && hero.y==g.other[k].y) {
          var items = getGroundItem();
          if (items) {
            for (var i = 0; i < items.length; i++) {
              m.push([_t('take', null, 'menu') + ' ' + items[i].name, '_g("takeitem&id=' + items[i].id + '")']); //'PodnieÅ'
            }
          }
          const renewableNpcs = getRenewableNpc();
          if (renewableNpcs) {
            for (var i = 0; i < renewableNpcs.length; i++) {
              m.push([_t('take', null, 'menu') + ' ' + renewableNpcs[i].name, '_g("talk&id=' + renewableNpcs[i].id + '")']); //'PodnieÅ'
            }
          }
          if(isset(g.gw[hero.x+'.'+hero.y])) m.push([_t('go', null, 'menu'),'_g("walk")']); //'PrzejdÅº'
        }
        var fdist=g.worldConfig.getPvp()?7:5;
        if(Math.abs(hero.x-g.other[k].x)<fdist && Math.abs(hero.y-g.other[k].y)<fdist)
          m[3]=[_t('attack', null, 'menu'),'_g("fight&a=attack&id='+k+'")']; //'Atakuj'
        if(Math.abs(hero.x-g.other[k].x)<2 && Math.abs(hero.y-g.other[k].y)<2) {
          m[4]=[_t('trade', null, 'menu'),'trade_start('+k+')']; //'Handluj'
          if(getHeroLevel()>29) m[5]=[_t('kiss', null, 'menu'),'_g("emo&a=kiss&id='+k+'")']; //'PocaÅuj'
          // if(isset(hero.vip)&&!isset(g.other[k].vip)) m[6]=[_t('crimson_bless', null, 'menu'),'_g("emo&a=bless&id='+k+'")']; //'Karmazynowe bÅogosÅawieÅstwo'
          if(isset(hero.vip)) m[6]=[_t('crimson_bless', null, 'menu'),'_g("emo&a=bless&id='+k+'")']; //'Karmazynowe bÅogosÅawieÅstwo'
          var r=g.other[k].relation;
          var cls = ('wph').search(hero.prof) >= 0 ? 'wph' : 'mtb';
          //if((!g.worldConfig.getPvp() || (g.worldConfig.getPvp() && cls.search(g.other[k].prof)>=0)) && (!(g.other[k].attr&4) || (r=='fr' || r=='cl' || r=='cl-fr' || r=='fr-fr')) && (!g.party || g.party[hero.id].r)) m[7]=[_t('team_invite', null, 'menu'),'_g("party&a=inv&id='+k+'")']; //'ZaproÅ do druÅ¼yny'
          if((!g.worldConfig.getPvp() || (g.worldConfig.getPvp() && cls.search(g.other[k].prof)>=0)) && (!(g.other[k].attr&4) || (r==SocietyData.RELATION.FRIEND || r==SocietyData.RELATION.CLAN || r==SocietyData.RELATION.CLAN_ALLY || r==SocietyData.RELATION.FRACTION_ALLY)) && (!g.party || g.party[hero.id].r)) m[7]=[_t('team_invite', null, 'menu'),'_g("party&a=inv&id='+k+'")']; //'ZaproÅ do druÅ¼yny'
        }
        if(m.length>0) showMenu(e,m);
      });
    }else for(var k2 in d[k]) g.other[k][k2]=d[k][k2];

    updateDataWantedOther(d[k], k);
    updateDataMatchmakingChampionOther(d[k], k);

    if(isset(d[k].lvl) && (!isset(d[k].ble) && isset(g.other[k].ble))) delete(g.other[k].ble);
    if (tPet){
      if (isset(g.other[k].pet)) g.other[k].pet.update(tPet);
      else{
        g.other[k].pet = new Pet(tPet, g.other[k]);
        g.other[k].pet.update(tPet, true);
      }
    }else if(isset(d[k].nick) && isset(g.other[k].pet)){
      g.other[k].pet.remove();
      delete g.other[k].pet;
    }

    if(!isset(g.tips.other))
      g.tips.other=function(other) {
        var tip='<b'+(isset(other.vip)?' style="color:#f63"':'')+'>'+other.nick+'</b>';
        tip += isset(other.guest) && other.guest?'<i style="color:#f1f1f1">'+_t('deputy')+'</i>':''; //ZastÄpca
        if(isset(other.matchmaking_champion)&&parseInt(other.matchmaking_champion)==1) tip+='<b class=champion>'+_t('champion')+'</b>'; //Czempion
        if(isset(other.wanted)&&parseInt(other.wanted)==1) tip+='<b class=wanted>'+_t('wanted_info', null, 'pklist')+'</b>'; //Poszukiwany<br/>listem goÅczym
        if(isset(other.is_blessed) && other.is_blessed) tip+= '<b class="bless">'+_t('bless_singular')+'</b>';
        if(isset(other.clan)) tip+='['+escapeHTML(other.clan.name)+']<br>';
        //if(other.lvl) tip+='Lvl: '+(isset(other.lowexp) && other.lowexp ? '<sup><small>(-)</small></sup>' : '')+other.lvl+other.prof;
        //if(other.lvl) tip+='Lvl: '+other.lvl+other.prof;
        tip+='Lvl: ' + getCharacterInfo({level:other.lvl, operationLevel: other.oplvl, prof: other.prof});
        if(other.rights) {
          var rank;
          if(other.rights&1) rank=0;
          else if(other.rights&16) rank=1;
          else if(other.rights&2) rank=2;
          else if(other.rights&4) rank=4;
          else if(other.rights&8) rank=5;
          else rank=3;
          if (isset(g.names.ranks[rank]) && g.names.ranks[rank] !== '') tip+='<i>'+g.names.ranks[rank]+'</i>';
        }
        if(other.attr&1) tip+='<br><img src=img/mute.gif>';
        if(other.attr&2) tip+=' <img src=img/warning.gif>';
        return tip;
      }
    if(isset(d[k].lvl)) {
      $('#other'+k).attr('tip',g.tips.other(g.other[k]));
    }
    if(isset(d[k].icon)) {
      if(d[k].icon.charAt(0)!='/')d[k].icon='/'+d[k].icon;
      loadImg('postacie'+d[k].icon,k,function(){
        k=$(this).attr('dest');
        if(!isset(k) || !isset(g.other[k])){}
        else {
          g.other[k].fw=this.width/4;
          g.other[k].fh=this.height/4;
          $('#other'+k).css({
            backgroundImage:'url('+$(this).attr('src')+')',
            width:g.other[k].fw
          });
          moveOther(k);
          if(isset(g.checklist['other'+k])) g.checklist['other'+k](g.other[k]);
        }
      });
    }
    if(isset(d[k].stasis)) {
      var stasisVal = d[k].stasis;
      if (stasisVal > 0) emotion('stasis', k, false);
      else removeEmotionBySourceIdAndEmoType('stasis', k)
    }
    if(isset(d[k].stasis_incoming_seconds)) {
      var stasisIncomingVal = d[k].stasis_incoming_seconds;
      if (stasisIncomingVal > 0) emotion('away', k, false);
      else removeEmotionBySourceIdAndEmoType('away', k)
    }
    if(g.other[k].x-g.other[k].rx>2)g.other[k].rx=g.other[k].x-2;
    if(g.other[k].y-g.other[k].ry>2)g.other[k].ry=g.other[k].y-2;
    if(g.other[k].x-g.other[k].rx<-2)g.other[k].rx=g.other[k].x+2;
    if(g.other[k].y-g.other[k].ry<-2)g.other[k].ry=g.other[k].y+2;
    moveOther(k);
  }
}

function updateDataWantedOther (data, id) {

  let createData = data.action && data.action == "CREATE";

  if (!createData) {
    return
  }

  let $base = $('#base');

  let $otherWanted      = $base.find('#otherWanted' + id);
  let otherWantedExist  = $otherWanted.length > 0;

  if (data.wanted) {

    if (!otherWantedExist) {
      $base.append("<div class=characterWanted id=otherWanted" + id + '></div>')
    }

  } else {
    if (otherWantedExist) {
      $otherWanted.remove();
    }
  }

}

function updateDataWantedHero (data) {

  let $base = $('#base');

  let $heroWanted       = $base.find('#heroWanted');
  let heroWantedExist   = $heroWanted.length > 0;

  if (!isset(data.wanted)) {
    return
  }

  if (data.wanted) {

    if (!heroWantedExist) {
      $base.append("<div class=characterWanted id=heroWanted></div>")
    }

  } else {
    if (heroWantedExist) {
      $heroWanted.remove();
    }
  }

}

function updateCharacterAuraPos (rx, ry, $characterAura) {

  let left    = rx * 32 - 12;
  let top     = ry * 32 + 32 - 16;

  $characterAura.css({
    left    : left,
    top     : top,
    display :'block'
  })
}

var stasisOverlayInfo = new (function() {
  $('#stasis-overlay .stasis-overlay__title').text(_t('stasis'));
  $('#stasis-overlay .stasis-overlay__text-inner').html(_t('stasis_overlay_text'));
});
function moveOther(k) {
  var wpos=Math.round(g.other[k].rx)+Math.round(g.other[k].ry)*256, wat=0;
  if(isset(map) && isset(map.water[wpos])) wat=map.water[wpos];

  $('#other'+k).css({
    left:g.other[k].rx*32+16-(g.other[k].fw>>1),
    top:g.other[k].ry*32+32-g.other[k].fh+((wat/4)>8?0:wat),
    height:g.other[k].fh-((wat/4)>8?(wat-32):wat),
    zIndex:getLayerOrder(g.other[k].ry, 10),
    backgroundPosition:(g.other[k].step*g.other[k].fw)+'px '+(-g.other[k].dir*g.other[k].fh)+'px'
  });
  //$('#otherWanted'+k).css({
  //  left: g.other[k].rx*32-10,
  //  top: g.other[k].ry*32+32-16,
  //  display:'block'
  //})

  let $otherWanted = $('#otherWanted'+k);

  if ($otherWanted.length) {
    updateCharacterAuraPos(g.other[k].rx, g.other[k].ry, $otherWanted);
  }

  let $otherChampionMatchmaking = $('#otherChampionMatchmaking'+k);

  if ($otherChampionMatchmaking.length) {
    updateCharacterAuraPos(g.other[k].rx, g.other[k].ry, $otherChampionMatchmaking);
  }

}
function runOther(k) {
  var ox=g.other[k].rx,oy=g.other[k].ry;
  if(g.other[k].x>g.other[k].rx)g.other[k].rx+=0.25;
  if(g.other[k].x<g.other[k].rx)g.other[k].rx-=0.25;
  if(g.other[k].y>g.other[k].ry)g.other[k].ry+=0.25;
  if(g.other[k].y<g.other[k].ry)g.other[k].ry-=0.25;
  if(ox!=g.other[k].rx || oy!=g.other[k].ry) {
    var df=0;
    if(g.other[k].x!=g.other[k].rx) {
      df=Math.abs(g.other[k].x-g.other[k].rx);
      df=df-parseInt(df);
    } else
    if(g.other[k].y!=g.other[k].ry) {
      df=Math.abs(g.other[k].y-g.other[k].ry);
      df=df-parseInt(df);
    }
    g.other[k].step=(g.other[k].x==g.other[k].rx && g.other[k].y==g.other[k].ry)?0:df*4;
    moveOther(k);
  }
  if(g.other[k].pet != undefined){
    g.other[k].pet.update();
    g.other[k].pet.move();
  }

}

function newRip(d) // RIP icon in place of death
{
  var now=unix_time();
  for(var i=0; i+7<d.length; i+=9) {
    var left=300+1*d[i+6]-now;
    if(left<0) continue;
    //var tip='<b>'+_t('rip_prefix')+' '+htmlspecialchars(d[i])+'</b>Lvl: '+d[i+1]+d[i+2]+'<i>'+htmlspecialchars(d[i+6])+'</i><i>'+htmlspecialchars(d[i+7])+'</i>';

    let charData = {
      level           : d[i + 1],
      operationLevel  : d[i + 2],
      prof            : d[i + 3],
    }

    let charInfo = getCharacterInfo(charData)
    var tip='<b>'+_t('rip_prefix')+' '+htmlspecialchars(d[i])+'</b>Lvl: '+charInfo+'<i>'+htmlspecialchars(d[i+7])+'</i><i>'+htmlspecialchars(d[i+8])+'</i>';


    var k=Math.round(Math.random()*100000);
    $('#base').append("<div class=rip id=rip"+k+" ctip=t_rip tip='"+tip+"'></div>");
    $('#rip'+k).css({
      left:d[i+4]*32,
      top:d[i+5]*32,
      zIndex:getLayerOrder(d[i+5], 0)
      }).click(function(e){hero.mClick(e)});
    if('wpb'.indexOf(d[i+3])>=0)$('#rip'+k).css('backgroundImage','url(img/rip2.gif)');
    setTimeout('$("#rip'+k+'").fadeOut(2000,function(){$("#rip'+k+'").remove()})', left*1000);
  }
}
function getLayerOrder(y, offset) {
  return y * 2 + offset;
}

function addCharacterInfoTip ($objectToTip, charData) {

  //let br 					= "<br>";
  //let colon 				= ": ";
  //let nick 				    = charData.nick;
  //let level 				= charData.level;
  //let operationLevel 		= charData.operationLevel;
  //let prof 				    = charData.prof;
  //
  //if (level < 301) {
  //  operationLevel = 0;
  //}
  //
  //let operationLevelStr 	= operationLevel ? (_t('character_operation_lvl') + colon + operationLevel + br) : '';
  //
  //
  //let tip = _t('character_nick') + colon + nick + br +
  //    _t('character_lvl') + colon + level + br +
  //    operationLevelStr +
  //    _t('character_prof') + colon + getAllProfName(prof) + br;
  //
  ////$objectToTip.attr('tip', tip);
  //$objectToTip.tip(tip);

  CharacterInfo.addCharacterInfoTip($objectToTip, charData);
}

function getCharacterInfo (charData) {
  //let nick;
  //
  //if (charData.showNick) {
  //  nick = charData.nick;
  //  nick += " ";
  //} else {
  //  nick = "";
  //}
  //
  //let operationLevel 		=  charData.operationLevel;
  //let level 				=  charData.level;
  //let prof				    =  charData.prof;
  //
  //if (level < 301) {
  //  operationLevel = 0;
  //}
  //
  //let strOperationLevel 	= operationLevel ? ("|" + operationLevel + prof) : '';
  //let strProf 			    = prof ? prof : '';
  //
  //return nick + "(" + level + strProf + strOperationLevel + ")";

  return CharacterInfo.getCharacterInfo(charData);
}

function getKindOfShowLevelAndOperationLevel () {
  //return 0;
  return getEngine().settingsOptions.getKindOfShowLevelAndOperationLevel()
}
