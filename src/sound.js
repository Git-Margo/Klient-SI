soundManager.url = 'js/';
soundManager.flashVersion = 9;
soundManager.useFlashBlock = false;
var sound = {manager:new MargoSound()};
soundManager.onready(function() {
  sound.manager.synchroStart('manager');
});
sound.bgList = {
  '002':'002.mp3',
  '003':'003.mp3',
  '004':'004.mp3',
  '006':'006.mp3',
  '013':'013.mp3',
  '014':'014.mp3',
  '015':'015.mp3',
  '027':'027.mp3',
  '27n':'027.mp3',
  '032':'032.mp3',
  '007':'007.mp3',
  '07n':'007.mp3',
  '018':'018.mp3',
  '019':'019.mp3',
  '19n':'019.mp3',
  '035':'035.mp3',
  '35n':'035.mp3',
  '005':'005.mp3',
  '008':'008.mp3',
  '009':'009.mp3',
  '010':'010.mp3',
  '011':'011.mp3',
  '012':'012.mp3',
  '021':'021.mp3',
  '033':'033.mp3',
  '034':'034.mp3',
  'aa1':'a.mp3',
  'aa2':'a.mp3',
  'bb':'b.mp3',
  'cc1':'c.mp3',
  'cc2':'c.mp3',
  'dd1':'d.mp3',
  'dd2':'d.mp3',
  'dd3':'d.mp3',
  'dd4':'d.mp3',
  'ee':'e.mp3',
  'f':'f.mp3',
  'g':'g.mp3',
  'h':'h.mp3',
  'i':'i.mp3',
  'j':'j.mp3',
  'k':'k.mp3',
  'l':'l.mp3'
};

sound.fileList={
  '002.mp3':[1],
  '003.mp3':[2],
  '004.mp3':[1],
  '006.mp3':[1],
  '013.mp3':[2],
  '014.mp3':[2],
  '015.mp3':[2],
  '027.mp3':[1],
  '032.mp3':[3],
  '007.mp3':[4],
  '018.mp3':[8],
  '019.mp3':[7],
  '035.mp3':[4],
  '005.mp3':[3],
  '008.mp3':[3],
  '009.mp3':[3],
  '010.mp3':[4],
  '011.mp3':[4],
  '012.mp3':[3],
  '021.mp3':[4],
  '033.mp3':[8],
  '034.mp3':[7],
  'a.mp3':[0],
  'b.mp3':[0],
  'c.mp3':[6],
  'd.mp3':[6],
  'e.mp3':[5],
  'f.mp3':[0],
  'g.mp3':[0],
  'h.mp3':[0],
  'i.mp3':[6],
  'j.mp3':[5],
  'k.mp3':[5],
  'l.mp3':[5]
}

sound.groups={
  0:'no_group',
  1:'bad_caves',
  2:'caves',
  3:'bad_fields',
  4:'fields',
  5:'insides',
  6:'bad_insides',
  7:'sea',
  8:'desert'
};

function MargoSound(){
  var T = this;
  this.data = {position:0,file:null,play:0,shuffle:1,quality:'lq',volume:100};
  this.synchro = {game:false,map:false,manager:false,activated:false};
  this.playing = null;
  this.tmpPlaying = null;
  this.activeFile = null;
  this.fadeLength=2000;
  this.intervalCounter = 0;
  this.id=0;
  this.passingThrough=false;
  this.volumeMarkerDraggable=false;

  this.init = function(){
    if (this.data.file != null && this.groupCompare(this.data.file, this.getMapFile())){
      this.playing = this.getNextSound(this.data.position, false, this.data.file);
    }else{
      this.playing = this.getNextSound(0, false, this.getMapFile());
    }
    if (parseInt(this.data.play) == 1){
      this.playing.play();
    }
  }

  this.getMapFile = function(){
    var rData = /(.*?)\.jpg/.exec(map.bg);
    if(!isset(sound.bgList[rData[1]])){
			return "l.mp3";
		}
		return sound.bgList[rData[1]];
  }

  this.groupCompare = function(file1, file2){
		if (file1 || file2) return false;
    if (typeof(sound.fileList[file1][0])=='undefined' || typeof(sound.fileList[file2][0])=='undefined') return false;
    return sound.fileList[file1][0] == sound.fileList[file2][0]; // for now each file is in only in one group
  }

  this.getNextSound = function(position, startFade, file){
    this.activeFile = file;
    return soundManager.createSound({
      id:'sound'+T.id++,
      position:position,
      volume: startFade ? 0 : T.data.volume,
      url:'https://micc.garmory-cdn.cloud/music/'+T.data.quality+'/'+file,
      whileplaying: function(){
        var timeLeft = this.duration - this.position;
        if (timeLeft < T.fadeLength && this.readyState == 3){
          if (T.passingThrough == false){
            T.passingThrough = true;
            T.tmpPlaying = T.getNextSound(0, T.data.shuffle ? true : false, T.getNextFile());
            //T.tmpPlaying.setVolume(0);
            T.tmpPlaying.play();
          }
          this.setVolume(((timeLeft/T.fadeLength)*100)*(T.data.volume/100));
        }else{
          if (T.intervalCounter >= 10){
            T.saveSettings();
            T.intervalCounter = 0;
          }else{
            T.intervalCounter++;
          }
        }
        if (this.volume < T.data.volume){
          if (this.position < T.fadeLength){
            var vol = ((this.position/T.fadeLength)*100)*(T.data.volume/100);
            this.setVolume(vol>100?100:vol);
          }else{
            this.setVolume(T.data.volume);
          }
        }
      },
      onfinish: function(){
        T.playing.destruct();
        T.playing = T.tmpPlaying;
        T.passingThrough = false
      }
    });
  }

  this.attachVolumeMarkerDrag = function(){
    if (!this.volumeMarkerDraggable){
      $('#volumeSlider .marker').draggable({
        axis:'y',
        containment:'parent',
        stop:function(){sound.manager.setVolume(2*Math.abs(parseInt($('#volumeSlider .marker').css('top'))-50))},
        drag:function(){sound.manager.setVolume(2*Math.abs(parseInt($('#volumeSlider .marker').css('top'))-50))}
      });
      this.volumeMarkerDraggable = true;
    }
  }

  this.setVolume = function(volume){
    volume = parseInt(volume < 0 ? 0 : volume > 100 ? 100 : volume);
    this.data.volume = volume;
    this.saveSettings();
    if (this.playing){
      this.playing.setVolume(volume);
    }
  }

  this.volumeDown = function(){
    this.setVolume(this.data.volume - 5);
  }

  this.volumeUp = function(){
    this.setVolume(this.data.volume + 5);
  }

  // gets next file when playing next sound without going to another map
  this.getNextFile = function(){
    var next = this.getMapFile();
    var group = sound.fileList[this.activeFile][0];
    if (this.data.shuffle && group != 0){
      var list = this.getActiveGroup();
      if (list.length > 0){
        do{
          next = list[Math.floor(Math.random() * (list.length-1 - 0 + 1))];
        }while(next == this.activeFile)
      }
    }
    return next;
  }

  this.getActiveGroup = function(){
    var group = sound.fileList[this.activeFile][0];
    var list = [];
    for (var i in sound.fileList){
      if (sound.fileList[i][0] == group) list.push(i);
    }
    return list;
  }

  //Retrieves settings from cookie
  this.initSettings = function(){
    var cookie = getCookie('margoSound');
    if (cookie){
      var data = cookie.split(',');
      if (typeof(data[0])!='undefined' && typeof(data[1])!='undefined' && !isNaN(parseInt(data[1])) &&
				typeof(data[2])!='undefined' && typeof(data[3])!='undefined' &&
				typeof(data[4])!='undefined' && typeof(data[5])!='undefined'){
        this.data.position = data[1];
        this.data.file = data[0];
        this.data.play = data[2];
        this.data.shuffle = data[3];
        this.data.quality = data[4];
        this.data.volume = parseInt(data[5]);
        this.data.volume = this.data.volume < 0 ? 0 : this.data.volume > 100 ? 100 : this.data.volume;
        return true;
      }
    }
  }
  this.saveSettings = function(){
    var d=new Date();d.setTime(d.getTime()+36000000*24*30*12);
		var pos = 0;
		if(this.playing && this.playing.position != null) {
			pos = this.playing.position;
		}
    setCookie('margoSound', this.activeFile+','+pos+','+this.data.play+','+this.data.shuffle+','+this.data.quality+','+this.data.volume, d, false, false, false);
  }

  //starts sound only when game, map and soundmanager2 are ready
  this.synchroStart = function(element){
    this.synchro[element]=true;
    if (this.synchro.map && this.synchro.manager && this.synchro.game && !this.synchro.activated){
      this.init();
      this.synchro.activated = true;
    }
  }

  this.start = function(){
    this.stop();
    this.playing = this.getNextSound(0, false, this.getMapFile());
		if(this.playing){
	    this.playing.play();
		}
    this.data.play = 1;
    if (this.data.play == 1) $('#startbutton').addClass('active'); else $('#startbutton').removeClass('active');
  }

  this.stop = function(){
    this.data.play = 0;
    this.saveSettings();
    if (this.playing){
      this.playing.destruct();
    }
    if (this.data.play == 1) $('#startbutton').addClass('active'); else $('#startbutton').removeClass('active');
  }

  this.toggleStart = function(){
    if (this.data.play == 1) this.stop(); else this.start();
  }

  this.toggleShuffle = function(){
    this.data.shuffle = this.data.shuffle == 1 ? 0 : 1;
    this.saveSettings();
    if (this.data.shuffle == 1) $('#shufflebutton').addClass('active'); else $('#shufflebutton').removeClass('active');
  }

  this.toggleQuality = function(){
    this.data.quality = this.data.quality == 'lq' ? 'hq' : 'lq';
    if (this.data.quality == 'hq') $('#hdbutton').addClass('active'); else $('#hdbutton').removeClass('active');
    this.saveSettings();
    if (this.data.play){
      this.engineStop();
      this.initSettings();
      this.init();
    }
  }

  this.engineStop = function(){
    if (this.playing) this.playing.destruct();
    if (this.tmpPlaying) this.tmpPlaying.destruct();
  }
  //Start/Stop
  //WÅÄcz/wyÅÄcz losowanie ÅcieÅ¼ki dÅºwiÄkowej.
  //ZmieÅ jakoÅÄ dÅºwiÄku.
  //Ustaw poziom gÅoÅnoÅci muzyki.
  this.generateMenu = function(){
    var ret = '<div id=soundInterface>\n\
               <div onclick="sound.manager.toggleStart(); return false;" tip="'+_t('start_stop', null, 'music_interface')+'" id=startbutton class='+(sound.manager.data.play == 1 ? 'active' : '')+'></div>\n\
               <div onclick="sound.manager.toggleShuffle(); return false;" tip="'+_t('on_off', null, 'music_interface')+'" id=shufflebutton class='+(sound.manager.data.shuffle == 1 ? 'active' : '')+'></div>\n\
               <div onclick="sound.manager.toggleQuality();return false;" tip="'+_t('quality_change', null, 'music_interface')+'" id=hdbutton class='+(sound.manager.data.quality == 'hq' ? 'active' : '')+'></div>\n\
               <div id=volumeSlider><div tip="'+_t('volume_change', null, 'music_interface')+'" onmouseover="sound.manager.attachVolumeMarkerDrag()" class=marker style="top:'+(50-50*(this.data.volume/100))+'px"></div></div>\n\
               </div>';
    this.volumeMarkerDraggable = false;
    return ret;
  }

  this.initSettings();
}
