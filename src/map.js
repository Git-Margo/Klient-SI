function ground()
{
  var oid='#ground';
  this.id=-1;
  this.loaded=false;
  this.col='';
  this.water=[];
  this.config = new MapConfig();
  var halfx=256, halfy=256;
  var lcx=0, lcy=0;
  this.maplist=[];
  this.setCoords=function(coords){
    this.maplist=[];
    coords=coords.split(';');
    for(var k in coords) {
      var c=coords[k].split(',');
      this.maplist[parseInt(c[0])]={
        name:c[1],
        x:parseInt(c[2]),
        y:parseInt(c[3]),
        width:parseInt(c[4]),
        height:parseInt(c[5])
        };
    }
    this.highlightMarker();
    $('#mapfilter').trigger('keyup');
  };
  $('#mapfilter').keyup(function(){
    var i=0, lst=[], t=$('#mapfilter').val().toLowerCase();
    for(var k in map.maplist) {
      var m=map.maplist[k];
      if(i<200 && ((t=='') || (m.name.toLowerCase().indexOf(t)>=0))) lst[i]='<b wmap='+k+'>'+escapeHTML(m.name)+'</b>';
      i++;
    }
    lst.sort(function(p1,p2){
      var m1=p1.replace(/Å/,'S').substring(p1.indexOf('>')+1,p1.length-5);
      var m2=p2.replace(/Å/,'S').substring(p2.indexOf('>')+1,p2.length-5);
      return m1==m2?0:(m1>m2?1:-1);
    });
    $('#maplist').html(lst.join(''));
  });
  this.overmap=false;
  $('#inmap2 IMG').mousemove(function(e){
    var $in2=$('#inmap2'), mx=e.clientX-g.left, my=e.clientY-g.top, o=map.overmap, top=false;
    if(my>350) top=true;
    mx+=$in2.scrollLeft();
    my+=$in2.scrollTop();
    if(o && mx>=o.x && mx<=o.x+o.width && my>=o.y && my<=o.y+o.width) return;
    for(var k in map.maplist)
    {
      o=map.maplist[k];
      if(mx>=o.x+20 && mx<=o.x+o.width+20 && my>=o.y+5 && my<=o.y+o.height+5)
      {
        map.overmap=o;
        var mt=$('#maptip');
        mt.html(o.name).css({
          left:o.x
          });
        mt.css({
          top:top?(o.y-mt.outerHeight()):(o.y+o.height)
          }).show();
        return;
      }
    }
    map.overmap=false;
    $('#maptip').hide();
  });
  $('#maptip').mouseover(function(e){
    $(this).hide()
    });
  this.redrawMapImage = function (mapImage, backgroundOffsetX, backgroundOffsetY, xSize, ySize)  {
    let canvas 		= document.createElement("canvas");
    let ctx 		= canvas.getContext("2d");
    let tileSize 	= 32;

    if (!xSize || !ySize || !isset(backgroundOffsetX) || !isset(backgroundOffsetY)) {
      return;
    }

    canvas.width  	= xSize * tileSize;
    canvas.height 	= ySize * tileSize;

    ctx.drawImage(mapImage,
        Math.abs(backgroundOffsetX) * tileSize, 	Math.abs(backgroundOffsetY) * tileSize,
        canvas.width, 								canvas.height,
        0,											0,
        canvas.width, 								canvas.height
    );

    canvas.toBlob(function(blob) {

      let urlCreator  = window.URL || window.webkitURL;
      let imageUrl    = urlCreator.createObjectURL(blob);

      map.afterOnloadMapImage(imageUrl, canvas)

    },'image/png');
  };

  this._u=function(data) {
    for(var k in data){
      if(is_int(data[k])) this[k]=parseInt(data[k]);
      else this[k]=data[k];
      if (k=='bg') sound.manager.synchroStart('map');
      if (k=='welcome' && data[k] != '') message(data[k]);
      if (k=='params') this.config.update(data[k]);
    }
		if (data.file) {
			//tutorials after visiting specific locations
			var startIds = {579: 1, 1058: 1, 1059: 1, 1060: 1, 1062: 1, 1084: 1};
			if (!(isset(startIds[this.id]) || isset(startIds[this.mainid])) && getHeroLevel() < 7) tutorialStart(9);
			else if (isset(startIds[this.id])) tutorialStart(2);
			if ([2, 9, 35].indexOf(this.id) >= 0 && _l() == 'en') tutorialStart(21);

			$(oid).css({
				width: this.x * 32,
				height: this.y * 32
			});

            this.mapImageOnload(g.mpath + this.file);
			//img = new Image();
			g.gameLoader.startStep('map');
			//$(img).on('load', function () {
			//	g.gameLoader.finishStep('map');
			//	var src = $(this).attr('src');
			//	$('#bground').css({
			//		backgroundImage: 'url(' + src + ')'
			//	});
			//	$($(this).attr('obj')).css({
			//		backgroundImage: 'url(' + src + ')'
			//	});
			//	//message(map.name);
			//	map.loaded = true;
			//	var w = this.width, h = this.height;
			//	var ratio = Math.min(0.5, 500.0 / Math.max(w, h));
			//	h = Math.round(h * ratio);
			//	w = Math.round(w * ratio);
			//	$('#inmap').html('<img src=' + src + ' style="width:' + w + 'px; height:' + h + 'px; margin-top:' + (256 - (h >> 1))
			//		+ 'px; margin-left:' + (256 - (w >> 1)) + 'px"><div id=mapdot></div>');
			//	map.mmh = h;
			//	map.mmw = w;
			//	map.mmr = ratio;
			//	//checkWeather(map.id);
			//	//setMapFilter(map.id);
            //
			//	var invertKeys = invertKeyInputOnSpecificMap(map.id);
			//	setNormalKeySet(!invertKeys);
            //
			//}).on('error', function () {
			//	log($(this).attr('src'), 2);
			//}).attr({
			//	obj: oid,
			//	src: g.mpath + this.file
			//});
			//this.setBallTip();
			$('#botloc').attr('tip', escapeHTML(this.name));
			if (this.water) {
				var w = this.water.split('|');
				this.water = [];
				for (var i = 0; i < w.length; i++) {
					var ww = w[i].split(',');
					for (var j = 1 * ww[0]; j <= 1 * ww[1]; j++)
						this.water[j + 256 * ww[2]] = 4 * ww[3];
				}
			} else this.water = [];
			this.setBack(this.bg);
			//this.bB();
		}
    //if (data.external_properties && data.external_properties.weather) this.weatherRayControllerServe(data.external_properties)
    //if (data.external_properties && data.external_properties.mapFilter) this.weatherRayControllerServe(data.external_properties)
    //if (data.external_properties && data.external_properties.night) g.nightController.updateData(data.external_properties)


    if (isset(data.srajId)) {
      let srajData = getEngine().srajStore.getSrajTemplate(data.srajId, "APPEAR");
      if (srajData) {
        getEngine().rajController.parseJSONRajController(srajData);
      }
    }

		this.setBallTip();
  };

  this.weatherRayControllerServe = (weatherData) => {
    //if (!get_config_opt(16)) {
    if (g.settingsOptions.isWeatherAndEventEffectsOn()) {
      if (weatherData.weather) this.setWeather(weatherData.weather)
    }

    if (weatherData.mapFilter) setMapFilter(weatherData.mapFilter);

  }

  this.mapImageOnload = (src) => {
    ImgLoader.onload(
        src,
        function (img) {
          let objAttribute = document.createAttribute("obj");
          let srcAttribute = document.createAttribute("src");

          objAttribute.value = oid;
          srcAttribute.value = src;

          img.setAttributeNode(objAttribute);
          img.setAttributeNode(srcAttribute);
        },
        function () {

          if (map.backgroundOffset)     map.redrawMapImage(this, map.backgroundOffset.x, map.backgroundOffset.y, map.x, map.y);
          else                          map.afterOnloadMapImage(src, this);

        },
        function () {
          log(src, 2);
        })
  };

  this.afterOnloadMapImage = (src, image) => {
    g.gameLoader.finishStep('map');

    $('#bground').css({
      backgroundImage: 'url(' + src + ')'
    });

    $($(image).attr('obj')).css({
      backgroundImage: 'url(' + src + ')'
    });

    map.loaded  = true;

    let w       = image.width;
    let h       = image.height;
    let ratio   = Math.min(0.5, 500.0 / Math.max(w, h));

    h           = Math.round(h * ratio);
    w           = Math.round(w * ratio);

    $('#inmap').html('<img src=' + src + ' style="width:' + w + 'px; height:' + h + 'px; margin-top:' + (256 - (h >> 1))
        + 'px; margin-left:' + (256 - (w >> 1)) + 'px"><div id=mapdot></div>');

    map.mmh = h;
    map.mmw = w;
    map.mmr = ratio;

    var invertKeys = invertKeyInputOnSpecificMap(map.id);
    setNormalKeySet(!invertKeys);
  };

  this.setWeather = (weather) => {

    let list = weather.list;

    if (!list) return;

    for (let k in list) {

      let weatherAction = list[k].action;
      let weatherName   = list[k].name;

      if (weatherAction == 'CREATE') changeWeather(weatherName);
      if (weatherAction == 'REMOVE') removeWeather(weatherName);

    }

  }

  this.setBallTip=function(){ //temporary until new interface element appears
    var pvpy=0, pvpstr=_t('pvp_mode', null, 'map') + ' ';//Tryb PvP:
    switch(this.pvp) {
      case 0:
        pvpy=3;
        pvpstr+=_t('pvp_off', null, 'map'); //'wyÅÄczone';
        break;
      case 1:
        tutorialStart(15);
        pvpy=2;
        pvpstr+=_t('pvp_ask', null, 'map');//'//za zgodÄ';
        break;
      case 2:
        tutorialStart(15);
        pvpy=0;
        pvpstr+=_t('pvp_on', null, 'map');//'wÅÄczone';
        break;
      case 3:
        pvpy=3;
        pvpstr+=_t('pvp_off', null, 'map');//'wyÅÄczone';
        break;
      case 4:
        tutorialStart(15);
        pvpy=1;
        pvpstr+=_t('pvp_arena', null, 'map');//'Arena';
        break;
    }
    const
      canParty = !map.config.getIsPartiesDisabled() ? _t('party_on') : _t('party_off'),
      partyTxt = `${_t('party', null, 'map')}: ${canParty}`;
    pvpstr+='<br/>' + partyTxt
    if (isset(this.conquer)){
      if (g.pvpIndicator == null) g.pvpIndicator = new PvpIndicator();
      if (this.conquer!=0){
        if ((/m|t|b/.test(hero.prof)&&this.conquer<0)||(/w|p|h/.test(hero.prof)&&this.conquer>0)){
          g.pvpIndicator.setValue(Math.abs(this.conquer));
          multiplier = 1+(Math.abs(this.conquer)/100)*3;
          pvpstr+='<br /><span style="color:lime">'+_t('location_conquered %percent%', {'%percent%':Math.abs(this.conquer)}, 'map')+'<br>'+_t('multiplier_counter+ %val%', {'%val%':roundNumber(multiplier,2)}, 'map')+'</span>'; //'Lokacja podbita w: '+Math.abs(this.conquer)+'% <br />ZwiÄkszenie doÅwiadczenia: '+roundNumber(multiplier,2)+'x
        }else{
          g.pvpIndicator.setValue(Math.abs(this.conquer)*-1);
          multiplier = 1+(Math.abs(this.conquer)/100)*3;
          pvpstr+='<br /><span style="color:red">'+_t('location_lost %percent%', {'%percent%':Math.abs(this.conquer)}, 'map')+'<br>'+_t('multiplier_counter- %val%', {'%val%':roundNumber(multiplier,2)}, 'map')+'</span>'; //Lokacja stracona w: '+Math.abs(this.conquer)+'% <br />Zmniejszenie doÅwiadczenia: '+roundNumber(multiplier,2)+'x
        }
      }else{
        pvpstr+='<br />'+_t('location_conquer_possible'); //'MoÅ¼liwy podbÃ³j lokacji'
      }
      g.pvpIndicator.toggleShow(true);
    }else if(g.worldConfig.getPvp()){
      pvpstr += '<br />'+_t('click_to_show_locationdata', null, 'map'); //Kliknij aby pokazaÄ dane lokacji
    }else{
      if(!g.worldConfig.getBrutal()) pvpstr += '<br />'+_t('click_to_show_killers', null, 'map'); //Kliknij aby zobaczyÄ listÄ dedaczy
    }
    $('#pvpmode').unbind('click');
    $('#pvpStatMainBox .bgLayer').attr('tip', pvpstr);
    $('#pvpmode').attr('tip',pvpstr).css({
      backgroundPosition:'0 -'+17*pvpy+'px'
    }).click(function(){
      if (g.pvpIndicator != null){
        g.pvpIndicator.toggleShow();
      }else if(g.worldConfig.getPvp()){
        _g('conquer');
      }else{
        if(!g.worldConfig.getBrutal()) PK_watch.start();
      }
    });
  };

  this.setBack=function(b) {
    var bgs={
      'bridge01.jpg':'001.jpg',
      'castle03.jpg':'020.jpg',
      'castletown01.jpg':'035.jpg',
      'castletown02.jpg':'026.jpg',
      'cave01.jpg':'004.jpg',
      'cave02.jpg':'027.jpg',
      'cave04.jpg':'003.jpg',
      'evilcastle02.jpg':'015.jpg',
      'farmvillage01.jpg':'007.jpg',
      'forest01.jpg':'009.jpg',
      'foresttown01.jpg':'007.jpg',
      'fort01.jpg':'035.jpg',
      'fort02.jpg':'031.jpg',
      'grassland01.jpg':'010.jpg',
      'heaven02.jpg':'030.jpg',
      'mine01.jpg':'020.jpg',
      'minetown01.jpg':'035.jpg',
      'minetown02.jpg':'025.jpg',
      'mountain01.jpg':'005.jpg',
      'plan-astr.jpg':'002.jpg',
      'posttown01.jpg':'035.jpg',
      'posttown02.jpg':'026.jpg',
      'ruins01.jpg':'011.jpg',
      'sewer01.jpg':'020.jpg',
      'shop01.jpg':'017.jpg',
      'snowfield01.jpg':'012.jpg',
      'swamp01.jpg':'008.jpg',
      'woods01.jpg':'010.jpg',
      'matchmaking.jpg':'matchmaking.jpg',
    };
    if (b.length <= 7) $('#battle').css('backgroundImage','url('+CFG.bpath+b+')');
    else $('#battle').css('backgroundImage','url(img/b/'+(isset(bgs[b])?bgs[b]:'011.jpg')+')');
    if(b != "matchmaking.jpg") {
      $('#tradeground').css('backgroundImage', $('#battle').css('backgroundImage'));
    }
  };
  this.cols=function(c) {
    var idx=0, tc=[];
    for(var i=0; i<c.length; i++) {
      var a=c.charCodeAt(i);
      if(a>95 && a<123)	for(var j=95; j<a; j++) for(var k=0;k<6;k++) tc[idx++]='0';
      else {
        a-=32;
        for(var j=0; j<6; j++) tc[idx++]=(a & Math.pow(2,j))?'1':'0';
      }
    }
    this.col=tc.join('');
    this.nodes = new MapNodesContainer(this.x, this.y, isCollision, isPermanentlyCollision);
  };
  $('#base').scroll(function(){
    $('#bground').css({
      top:$('#base').scrollTop(),
      left:$('#base').scrollLeft(),
      'backgroundPosition': '-'+($('#base').scrollLeft())+'px '+'-'+($('#base').scrollTop())+'px'
    });
  });
  this.center=function(cenx,ceny,animate) {
    var xMax = Math.min(this.x*32-(512),cenx-halfx);
    var yMax = Math.min(this.y*32-($('#base').height()),ceny-halfy);
    if (isset(animate) && animate) $('#base').stop().animate({scrollLeft:xMax,scrollTop:yMax}, 500);
    else{
      $('#base').scrollLeft(xMax).scrollTop(yMax);
      $('#bground').css({
        top:$('#base').scrollTop(),
        left:$('#base').scrollLeft(),
        'backgroundPosition': '-'+($('#base').scrollLeft())+'px '+'-'+($('#base').scrollTop())+'px'
      });
    }
    lcx=cenx;
    lcy=ceny;
    this.scrollpos = [xMax, yMax];
    this.offset = [Math.floor(($('#base').scrollLeft()/32)),Math.floor($('#base').scrollTop()/32)];
  };
  //this.cmpMCLCOC = function () {
  //  if (map.mClC > oC) bC = 0;
  //  else bC++;
  //  oC = map.mClC
  //};
  this.resizeView=function(xsize,ysize) {
    if(!isset(xsize)) {
      let chatSize = getEngine().chatController.getChatWindow().getChatSize()
      var xsize=512,ysize=512-(chatSize==2||chatSize==0?0:(($('#chat').css('display')=='none')?0:$('#chat').height()-4));
    }
    $('#base').width(xsize).height(ysize);
    $('#trade').css('top',ysize-512);
    $('#bground').width(xsize).height(ysize);
    $('#battle').css('top',ysize-512-((g.battle && getCookie('battleLogSize') == 'big')?66:0));
    halfx=xsize>>1;
    halfy=ysize>>1;
    this.center(lcx,lcy);
  };
  //this.mClC = 0;
  //var bC = 0;
  //var oC = 0;
  //this.getBC = function () {
  //  return bC;
  //};
  //this.o = function () {
  //  return 'o';
  //};
  this.showMini=function(tab) {
    $('#inmap .trackDot').remove();
    tutorialStart(10);
    if(!isset(tab)) var tab=0;
    if(!this.maplist.length) _g('minimap'); else setTimeout(this.markerAnimator, 300);
    var x=(256-(this.mmw>>1))+Math.round((hero.x*32+16)*this.mmr), y=(256-(this.mmh>>1))+Math.round((hero.y*32+16)*this.mmr);
    $('#mapdot').css({
      top:y-2,
      left:x-2
    });
    if(questTrack.activeTrack){
      for(var i in questTrack.trackList[questTrack.activeTrack]){
        var p = questTrack.trackList[questTrack.activeTrack][i];
        var $a = $('.trackDot[mappos="'+p.pos[1]+'_'+p.pos[2]+'"]');
        if($a.length){
          $a.attr('tip', ($a.attr('tip')+'<br />'+p.txt));
        }else{
          $('#inmap').append(
            $('<div class="trackDot"></div>').attr('tip', htmlspecialchars(p.txt)).css({
              top:(256-(this.mmh>>1))+Math.round((parseInt(p.pos[2])*32+16)*this.mmr)-2,
              left:(256-(this.mmw>>1))+Math.round((parseInt(p.pos[1])*32+16)*this.mmr)-2
            }).attr('mappos', p.pos[1]+'_'+p.pos[2])
          )
        }
      }
    }
    if(tab==1) $("#inmap2wrapper").show();
    else
    if(tab==2) $("#inmap2wrapper").hide();
    $("#minimap").fadeIn("fast");
    $('#mapfilter').val('').trigger('keyup');
    //if(tab!=2)$('#mapfilter').focus();
    this.tab = tab;
    g.lock.add('minimap');
  };
  //this.bB = function () {
  //  $('#base').click(function () {
  //    //if (map.mClC > 100) map.mClC = 0;
  //    //map.mClC++;
  //    map.manageClickMCLC();
  //  });
  //  $(document).keypress(function (key) {
  //    if (map.mClC > 100) map.mClC = 0;
  //    map.mClC++;
  //  });
  //};
  //this.manageClickMCLC = () => {
  //  if (map.mClC > 100) map.mClC = 0;
  //  map.mClC++;
  //}
  this.toggle=function() {
    var $m=$('#minimap');
    if($m.css('display')=='none') this.showMini(2);
    else {
      $m.fadeOut();
      g.lock.remove('minimap');
    }
  };
  this.highlightMap=function(id)
  {
    var m=this.maplist[id];
    $('#hlmap').css({
      left:m.x,
      top:m.y-1,
      width:m.width-2,
      height:m.height-2
      }).show();
  };
  this.highlightMarker=function(){
		if (!isset(this.marker)){
      var id = this.mainid == 0 ? this.id : this.mainid;
      var m=this.maplist[id];
      if(typeof(m) != 'undefined'){
        this.marker=$(document.createElement('div')).css({position:'absolute',left:m.x+1,top:m.y+1,width:m.width,height:m.height,'background-color':'#ff0000',opacity:0.5});
        $('#inmap2').append(this.marker);
        this.marker.attr('tip', '<center><strong>'+_t('you_are_here', null, 'map')+'</strong><br />'+escapeHTML(this.maplist[id].name)+(this.mainid == 0 ? '' : ', '+this.name)+'</center>');
      }
    }
    this.markerAnimator();
  };
  this.markerAnimator = function(){
    if (isset(map.marker) && map.marker.is(':visible')) {
			//if (!(hero.opt & (1 << 8 - 1))) { //animation is off on on
            let interfaceAnimationOn = g.settingsOptions.isInterfaceAnimationOn();
            if (interfaceAnimationOn) { //animation is off on on
				map.marker.animate({opacity: map.marker.css('opacity') == 0.2 ? 0.5 : 0.2}, 500, 'swing', map.markerAnimator);
			}
		}
  };
  this.fadeoutMap=function(id){
    $('#hlmap').hide();
  };
  var getLowestFScore = function (set) {
    var ret = null;
    var retId = null;
    for (var t=0;t<set.length;t++) {
      var o = set[t];
      if (ret == null || o.fScore < ret.fScore) {
        retId = t;
        ret = o;
      }
    }
    return retId;
  };
  this.hce = function (node1, node2) {
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
  };
  this.hce8 = function (node1, node2) {
    return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
  };
  this.nodeSetLoop = function (startNode, endNode, iterator) {
    var openSet = [];
    var closeSet = [];
    openSet.push(startNode);
    while (openSet.length > 0) {
      var current = getLowestFScore(openSet);
      var node = openSet[current];
      openSet.splice(current, 1);
      closeSet.push(node);
      if(node.id == endNode.id) {
        return node;
      }
      var neighbors = node.getNeighbors();
      var gScore = node.gScore + 1;
      for (var t in neighbors) {
        var neighborsNode = neighbors[t];
        if (closeSet.indexOf(neighborsNode) != -1)
          continue;
        if (iterator(node, neighborsNode, endNode, openSet, gScore))
          return neighborsNode;
      }
    }
  };
  this.findStep = function (mainNode, node, endNode, openSet, gScore) {
    if(node.group !== null && endNode.group == node.group) {
      return true;
    }
    if (openSet.indexOf(node) == -1)
      openSet.push(node);
    if (node.gScore !== null && gScore >= node.gScore) {
      return false;
    }
    var hScore = gScore + map.hce8(node, endNode);
    node.setFromAndScore(mainNode, gScore, hScore);
    return false;
  };

  this.mapStep = function (mainNode, node, endNode, openSet, gScore) {
    if(node.isBlocked()) {
      return false;
    }
    if (openSet.indexOf(node) == -1) {
      openSet.push(node);
    } else if (gScore >= node.gScore) {
      return false;
    }
    var hScore = gScore + map.hce(node, endNode);
    node.setFromAndScore(mainNode, gScore, hScore);
    return false;
  };
}

function MapNode (x, y, positionToId) {
    var self = this;
    this.id = positionToId(x, y);
    this.x = x;
    this.y = y;
    this.neighbors = [];
    this.blocked = false;
    this.permanently = false;
    this.group = null;

    self.gScore = null;
    self.fScore = null;
    self.from = null;

    this.inTouchWith = function (otherNode) {
        return Math.abs(otherNode.x - self.x) <= 1 && Math.abs(otherNode.y - self.y) <= 1;
    };

    this.setCollision = function (value) {
      //Ignore collision change when it is permamently
      if (self.permanently && !value)
        return;
      self.blocked = value;
    };

    this.setPermanentlyCollision = function () {
      self.permanently = true;
    };

    this.forceRemoveCollision = function() {
      self.permanently = false;
      self.blocked = false;
      self.setGroupId(0);
    }

    this.isBlocked = function () {
      return self.blocked;
    };

    this.getNeighbors = function () {
      return self.neighbors;
    };

    this.isFreeAndWithoutGroup = function () {
      return self.group === null && !self.blocked;
    };

    this.setGroupId = function (value) {
      self.group = value;
    };

    this.hasSameGroup = function (otherNode) {
      return self.group == otherNode.group && self.group !== null;
    };

    this.setScore = function (gScore, fScore) {
      self.gScore = gScore;
      self.fScore = fScore;
    };

    this.setFromAndScore = function (from, gScore, fScore) {
      self.from = from;
      self.gScore = gScore;
      self.fScore = fScore;
    };

    this.clear = function () {
      self.gScore = null;
      self.fScore = null;
      self.from = null;
    };

    this.reload = function (nodesMap) {
        self.neighbors = [];
        var neighborsVectors = [{
            x: 0,
            y: -1
        }, {
            x: 0,
            y: 1
        }, {
            x: -1,
            y: 0
        }, {
            x: 1,
            y: 0
        }];
        var possibleNeighborsIds = [];
        for (var t in neighborsVectors) {
            var vector = neighborsVectors[t];
            var neighborsId = positionToId(self.x + vector.x, self.y + vector.y);
            possibleNeighborsIds.push(neighborsId);
        }
        for (var t in possibleNeighborsIds) {
            var checkId = possibleNeighborsIds[t];
            if (isset(nodesMap[checkId]) && self.inTouchWith(nodesMap[checkId])) {
                self.neighbors.push(nodesMap[checkId]);
            }
        }
    };

    return this;
}

function MapNodesContainer(maxX, maxY, getCollision, isPermanentlyCollision) {
  var self = this;
  var allNodes = 0;
  var recalcGroupsIds = [];
  var usedKeys = new usedSet();
  this.nodes = {};

  function usedSet () {
    var set = [true];
    this.getFree = function () {
      for (var t = 0; t < set.length; t++) {
        if (set[t] == false) {
          set[t] = true;
          return t;
        }
      }
      set.push(true);
      return set.length - 1;
    };
    this.release = function (n) {
      set[n] = false;
    }
  }

  this.getNode = function(x, y) {
    var id = positionToId(x, y);
    var node = self.nodes[id];
    if(isset(node) && node.x == x && node.y == y) {
      return node;
    }
    return null;
  };

  this.getAllNeighbors = function (node) {
    var tab = [];
    var waitingForCheck = [];
    if (!node.isBlocked()) {
      waitingForCheck.push(node);
    }
    while (waitingForCheck.length > 0) {
      var node = waitingForCheck.shift();
      tab.push(node);
      var neighbors = node.getNeighbors();
      for (var t in neighbors) {
        var neighborsNode = neighbors[t];
        if (neighborsNode.isBlocked()) continue;
        var waiting = waitingForCheck.indexOf(neighborsNode);
        if (waiting != -1) continue;
        var stored = tab.indexOf(neighborsNode);
        if (stored != -1) continue;
        waitingForCheck.push(neighborsNode);
      }
    }
    return tab;
  };

  this.clearAllNodes = function () {
    for(var t in self.nodes) {
      self.nodes[t].clear();
    }
  };

  this.createGroups = function () {
    var checkIdx = 0;
    var node = getFirstNodeWithoutGroup(checkIdx);
    var currentGroupId = 0;
    while(node != null) {
      checkIdx = node.id;
      var allInGroup = self.getAllNeighbors(node);
      if(allInGroup.length > 0) {
        var groupId = usedKeys.getFree();
        for(var t in allInGroup) {
          allInGroup[t].setGroupId(groupId);
        }
        currentGroupId++;
      }
      node = getFirstNodeWithoutGroup(checkIdx);
    }
    return currentGroupId;
  };

  this.changeCollision = function (x, y, value) {
    var groupIp = null;
    var node = self.getNode(x, y);
    if(node !== null) {
      groupId = node.group;
      node.setCollision(value);
    }
    if(groupId !== null && recalcGroupsIds.indexOf(groupId) == -1)
        recalcGroupsIds.push(groupId);
  };

  this.removeAllCollisions = function () {
    for(var t in self.nodes) {
      var node = self.nodes[t];
      node.forceRemoveCollision();
    }
  };

  this.reloadGroups = function () {
    for(var t in self.nodes) {
      var node = self.nodes[t];
      if(recalcGroupsIds.indexOf(node.group) != -1)
        node.setGroupId(null);
    }
    for(var t in recalcGroupsIds) {
      usedKeys.release(recalcGroupsIds[t]);
    }
    recalcGroupsIds = [];
    self.createGroups();
  };

  function getFirstNodeWithoutGroup(startIdx) {
    for(var t=startIdx;t<allNodes;t++) {
      var node = self.nodes[t];
      if(node.isFreeAndWithoutGroup()) {
        return node;
      }
    }
    return null;
  }

  function positionToId(x, y) {
    return x * maxY + y;
  }

  function init() {
    allNodes = map.x * map.y;
    for(var x = 0; x < map.x; x++) {
      for(var y = 0; y < map.y; y++) {
        var node = new MapNode(x, y, positionToId);
        self.nodes[node.id] = node;
      }
    }
    for(var t in self.nodes) {
      var node = self.nodes[t];
      var collision = getCollision(node.x, node.y);
      if (isPermanentlyCollision(node.x, node.y)) {
        node.setPermanentlyCollision();
      }
      node.setCollision(collision);
      node.reload(self.nodes);
    }
    self.createGroups();
  }
  init();
}
