/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function MinigameLoader(){
  this.game = null;
  this.v = null;
  this.data = null;
  var _t = this;
  this.loadImages=function(files){
    var amount = 0;
    for(var i in files.list){
      var img = new Image();
      img.src = 'games/js/'+this.data.name+'/img/'+files.list[i];
      img.onload=function(){amount++;if (amount==files.amount) _t.start()}
    }
  }
  this.loadCss=function(file){
    $('head').append('<link rel="stylesheet" type="text/css" href="games/js/'+this.data.name+'/'+file+'?ts='+unix_time()+'" />');
  }
  this.initGame=function(data){
    this.v = data;
    this.task({c:'init'});
  }
  this.loadScripts=function(data){
    this.data = data;
    //$('#centerbox').append('<div style="position:absolute;top:100px;left:100px;background-color:#000;color:#fff" id="load_game">Åadowanie gry</div>');
    if (window['g_'+data.name] == undefined){
      $.getScript('games/js/'+data.name+'/g_'+data.name+'.js?ts='+unix_time(), function(){
        _t.game = new window['g_'+data.name](_t);
        _t.game.initData = data;
        if (isset(data.files)) _t.loadImages(data.files); else _t.start();
        if (isset(data.css)) _t.loadCss(data.css);
      });
    }else{
      _t.game = new window['g_'+data.name](_t);
      _t.game.initData = data;
      _t.start();
    }
  }
  this.start=function(){
    $('#load_game').remove();
    this.game.run();
  }
  this.task=function(data){
    if (this.game!=null) this.game.lock();
    $.ajax({
      url: `${g.worldConfig.getApiDomain()}/minigames/${g.worldConfig.getWorldName()}`,
      type: 'post',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      dataType: 'json',
      data: {d:data,g:_t.v},
      success:function(msg){
        if (_t.game!=null) _t.game.unlock();
        _t.parseMessage(msg);
      }
    });
  }
  this.parseMessage=function(msg){
    if (!msg) return false;
    switch(msg.t){
      case 'init':this.loadScripts(msg);break;
      case 'nogame':if (this.game != null) this.game.endGame(); else _g('endgame');
      default:this.game.parseMessage(msg);
    }
  }
}
