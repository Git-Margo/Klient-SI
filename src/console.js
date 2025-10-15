// saves a message in console.
// arg1 is message
// arg2 stands for log level, ommit for informations, 1-warning,2-error,3-fatal error
function log()
{
  var name='';
  var fe=false;
  if(arguments.length>1)
    switch(parseInt(arguments[1])) {
      case 1:
        name='Warning: ';
        if (hero.uprawnienia==0 && arguments[0].match(/Pakiet odrzucony, poprzednie/)) fe=true;
        break;
      case 2:
        name='Error: ';
        break;
      case 3:
        fe=true;
        name='Fatal error: ';
        $('#console').show();
        break;
      default:
        name='Unknow: ';
    }
  if(arguments.length>2 && arguments[2]) name='';
  $('#contxt').append("<DIV"+(arguments.length>1?(" class=loglvl_"+arguments[1]):"")+">"+name+arguments[0]+"</DIV>").scrollTop(999999);
  if(name!='' && !fe) $('#warn').fadeIn();
}

function installAddon(url) {
	g.addons.push(url);
	var d=new Date();
	d.setTime(d.getTime()+3600000*24*30);
	setCookie('addons',g.addons.join(' '),d);
	log('Script '+url+' added succesfully.');
}

// executes a command send from console
function consoleParse(cmnd)
{
  if(cmnd.substr(0,1) == '.') return _g('console&custom='+esc(cmnd));
  var c=cmnd.split(' ');
  cmd=c[0];
  c[0]='';
  var par=c.join(' ').substr(1);
  var gm_cmd=['tp','loc','nloc','noclip'];
  //if(!g.gm)	for(k in gm_cmd) if(gm_cmd[k]==cmd) { log('Go away bastard!',1); return; }
  switch(cmd){
    case 'ver'   :
      log("Margonem MMORPG ver 2.0");
      break;
    case 'about' :
      log("Margonem MMORPG (c) by Thinker 2005-2009 [www.margonem.pl, thinker@margonem.pl]");
      break;
    case 'cls'   :
      $('#contxt').empty();
      break;
    case 'dump'  :
      log("<b>Dumping variable "+par+"</b><br>"+dump(eval(par)));
      break;
    case 'show'  :
      if (par === 'loots') return;

      $('#'+par).show();
      if(par == 'battle') {
        hideTroopsIfNotPositioned();
        g.lock.add('battle');
      }
      break;
    case 'hide'  :
      $('#'+par).hide();
      break;
    case 'stop'  :
      stopEngine();
      break;
    case 'ff'    :
      _g('fight&a=f');
      break;
    case 'fb'    :
      _g('fight&a=break');
      break;
    case 'group' :
      log(sound.manager.getActiveGroup());
      break;
    case 'equip' :
      var l=location.host.split('.'), w=l[0];
      if(w.indexOf('game')==0) w=w.substr(4);
			if(isset(g.worldConfig.getWorldName())) w = g.worldConfig.getWorldName();
      for(var k in g.item) if(g.item[k].loc=='g') log(g.item[k].name+' ITEM#'+g.item[k].hid+'.'+w); break;
    case 'addon' :
      if(par.length<5) break;
      if(!par.match(/^https?:\/\/.+\..+/)){
        log('Wrong addon url, missing "http://" prefix', 1);
        break;
      }
      par = par.replace(/\s/g, '');
      if(g.addons.indexOf(par)>=0){log('This addon is installed already'); break;}
      var url = par;
      var res = /^https?:\/\/addons2\.margonem\.pl\/get\/(\d*?)\/(\d*?)verified\.js$/.exec(url);
      if (res === null || parseInt(res[0]) == Math.floor(parseInt(res[1]) / 1000)) {
      mAlert(_t('install-not-verified-addon %url%', {'%url%': escapeHTML(url)}), 2, [
        function() {
          installAddon(url);
        },
        function() {}
      ]);
      } else {
        installAddon(url);
      }
      break;
    case 'adreset':
      g.addons=[];
      setCookie('addons','',0);
      setCookie('__mExts','',0);
      log('Addons cleared.');
      break;
    /* GM commands */
    case 'gadblock':
      var d=new Date();
      var val = par=='off'?0:1;
      d.setTime(d.getTime()+3600000*24*30);
      setCookie('__nga', val, d);
      if (val==1) log('Global addon blocked (\'gadblock off\' to unblock)');
      else log('Global addon unblocked (\'gadblock on\' to block)');
      break;
    case 'tp':
      _g('gm&a=teleport&target='+par);
      break;
    case 'loc':
      _g('gm&a=locate&who='+esc(par));
      break;
    case 'nloc':
      _g('gm&a=npclocate&who='+esc(par));
      break;
    case 'noclip':
      g.npccol=[];
      map.col='';
      if(isset(map.nodes)) {
        map.nodes.removeAllCollisions();
      }
      break;
    case 'outfit':
      var _img = new Image();
      //par = (par.indexOf('http:')<0 && par.indexOf('file:///')<0 ? ('file:///'+par.replace(/\\/g, '/')) : par)
      _img.src = par;
      log('outfit '+par);
      _img.onload=function(){
        hero.fw = this.width/4;
        hero.fh = this.height/4;
        $('#hero').css('background-image', 'url('+par+')');
        log('Outfit loaded');
      }
      _img.onerror=function(){
        log('Error while loading outfit file.', 2);
      }
      break;
    case 'respnpc':
      _g('gm&a=respnpc');
      break;
    case '':
      break;
    default:
      log('<i>> '+cmnd.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')+'</i>');
      try {
        eval(cmnd);
      } catch(e) {
        log(e,2,true);
      }
    break;
  }
}

function dump(arr,level) {
  var dumped_text = "";
  if(!level) level = 0;
  if(level>3) return '';

  //The padding given at the beginning of the line.
  var level_padding = "";
  for(var j=0;j<level+1;j++) level_padding += "&nbsp;&nbsp;";//"    ";

  if(typeof(arr) == 'object') { //Array/Hashes/Objects
    for(var item in arr) {
      var value = arr[item];

      if(typeof(value) == 'object') { //If it is an array,
        dumped_text += level_padding + "'" + item + "' :<BR>";
        dumped_text += dump(value,level+1);
      } else
      if(typeof(value) == 'undefined')
        dumped_text += level_padding + "'" + item + "' => \"undefinied\"<BR>";
      else
        dumped_text += level_padding + "'" + item + "' => \"" + value.toString().replace(/</g,"&lt;") + "\"<BR>";

    }
  } else { //Stings/Chars/Numbers etc.
    dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
  }
  return dumped_text;
}
