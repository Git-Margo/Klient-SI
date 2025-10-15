/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var __skins = {
  skinsQueue:[],
  loadBlocks:0,
  def:{
    'halloween':{ //halloween skin
      dir:'img/skins/halloween',
      name: 'Halloween 2012',
      css:'#corners .lt-hor{}'+
          '#corners .lt-ver{top:4px}'+
          '#corners .ld-hor{top:507px}'+
          '#corners .ld-ver{top:477px}'+
          '#corners .rt-hor{left:475px}'+
          '#corners .rt-ver{left: 492px; top: 5px;}'+
          '#corners .rd-ver{left: 491px; top: 477px}'+
          '#corners .rd-hor{left: 475px; top: 507px;}'+
          '#panel{background:url(img/skins/halloween/panel.png?v='+_CLIENTVER+');}'+
          '#stats{background-image:url(img/skins/halloween/stats.png?v='+_CLIENTVER+');}'+
          '#buttons DIV {background-image:url(img/skins/halloween/if-buttons.png?v='+_CLIENTVER+')}'+
          '#bottombar {background:url(img/skins/halloween/bottom-bar.png?v='+_CLIENTVER+');}'+
          '#bchat{background:url(img/skins/halloween/if-buttons.png?v='+_CLIENTVER+') no-repeat -136px -44px;}'+
          '#pvpmode {background-image:url(img/skins/halloween/pvpmode.png?v='+_CLIENTVER+');}'+
          '#logoutbut{background:url(img/skins/halloween/if-buttons.png?v='+_CLIENTVER+') no-repeat -68px -44px;}'+
          '#helpbut {background:url(img/skins/halloween/if-buttons.png?v='+_CLIENTVER+') no-repeat 0 -44px;}'+
          '#inpchat {background:url(img/skins/halloween/bottom-bar.png?v='+_CLIENTVER+') no-repeat -50px -10px;}'+
          '#skillSwitch.first{background: url(img/skins/halloween/um_set.gif?v='+_CLIENTVER+') 0px -32px;}'+
          '#skillSwitch.second{background: url(img/skins/halloween/um_set.gif?v='+_CLIENTVER+') 0px 0px;}'+
          '#nick{color: black;text-shadow: 0px 0px 5px orange, 0px 0px 10px red, 0px 0px 5px orange;}'+
          '#lagmeter{background:url(img/skins/halloween/lagometer.png?v='+_CLIENTVER+');}'+
          '#volumeSlider .marker{background-image:url(/img/skins/halloween/music_interface.png?v='+_CLIENTVER+')}'+
          '#startbutton, #shufflebutton, #hdbutton{background-image:url(/img/skins/halloween/music_interface.png?v='+_CLIENTVER+')}'+
          '#chat, #chattabs S{background-image:url(img/skins/halloween/chat.png?v='+_CLIENTVER+')}'+
          '#leorn1, #leorn2{display:none}'+
          '#chat.left {background-color:#444;background-image:url(img/skins/halloween/chat-left.png?v='+_CLIENTVER+')}'+
          '#chat.left #chattabs s {background-image:url(img/skins/halloween/chat-left.png?v='+_CLIENTVER+')}'+
          '#ver{left:545px;}'+
          '#life1, #life2, #exp1, #exp2{left:535px}'
    },
    'default':{//default skin
      dir:'img',
      name: 'Default margonem skin'
    }
  },
  load:function(name){
    if(this.loadBlocks) return this.skinsQueue.push(name);
    var T = this;
    if(!isset(this.def[name])) throw 'Skin "'+name+'" is not defined';
    $('#__loaded_skin').remove();
    $('<style id="__loaded_skin">'+T.def[name].css+'</style>').appendTo('head');
    var imgs = $('#corners img');
    for(var i=0; i<imgs.length; i++){
      this.loadBlocks++;
      this.imgObj(T.def[name].dir, $(imgs.get(i)));
    }
  },
  runQueue:function(){
    if(this.skinsQueue.length && !this.loadBlocks) this.load(this.skinsQueue.splice(0,1)[0]);
  },
  imgObj:function(dir, $obj){
    return new (function(dir, $obj){
      var tmp = $obj.attr('src').split('/');
      if(tmp.length){
        var img = new Image();
        img.src = dir+'/'+tmp[tmp.length-1];
        img.onload=function(){
          $obj.attr('src', dir+'/'+tmp[tmp.length-1]);
          __skins.loadBlocks--;
          __skins.runQueue();
        }
        img.onerror=function(){
          __skins.loadBlocks--;
          __skins.runQueue();
        }
      }
    })(dir, $obj);
  }
}
