//patch for IE8 - doesnt have indexOf for array
window.ImgLoader = (new function () {

  let THIS = this;

  this.onload = function(path, beforeOnloadCallback, afterOnloadCallback, onError, reonloadImage) {
    //let image = new Image();
    let image;

    //image.src = path + "?limit=true";

    if (reonloadImage) image = reonloadImage;
    else {
      image = new Image();

      if (beforeOnloadCallback) beforeOnloadCallback(image);
    }



    //image.onload = function () {
    //  if (afterOnloadCallback) afterOnloadCallback.apply(image);
    //};
    //
    //image.onerror = function (e) {
    //  debugger;
    //  if (onError) onError(e)
    //};


    let xhr = new XMLHttpRequest();

    //xhr.open("GET", path + "?limit=true");
    xhr.open("GET", path);
    //xhr.open("GET", path);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      let urlCreator = window.URL || window.webkitURL;
      let imageUrl = urlCreator.createObjectURL(this.response);

      image.src = imageUrl;

      image.onload = function () {
        if (afterOnloadCallback) afterOnloadCallback.apply(image);
      };

      //image.onerror = function (e) {
      //    debugger;
      //    if (onError) onError(e)
      //};


    };

    xhr.onerror = function (e) {
      if (xhr.status != 0) {
        console.error(`image ${path} error loaded`);
        if (onError) onError(e);
        return;
      }

      let randomTime = Math.floor(Math.random() * 100);

      console.warn(`429 status. Try download again after ${randomTime}`, path);

      setTimeout(function () {
        THIS.onload(path, beforeOnloadCallback, afterOnloadCallback, onError, image)
      }, randomTime);

    };


    xhr.send();

    return image;

  }

}())

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}


window.isInt = (value) => {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

window.isIntVal = (val) => {
  let parseVal = parseInt(val)
  if (Number.isNaN(parseInt(parseVal))) return false;

  return parseVal == val;
};

window.isStringVal = (v) => {
  return typeof v == "string"
};

window.isFloatVal = (val) => {
  let parseVal = parseFloat(val);
  if (Number.isNaN(parseFloat(parseVal))) return false;

  return parseVal == val;
};

window.isPl = function () {
  return _l() == 'pl';
}

window.isEn = function () {
  return _l() == 'en';
}

/**
 *Checks if used item reaches hero gold limit and display confirmation box if needed
 */
function checkItemGoldLimitReach(id){
  //if(g.item[id].cl != 17) return false;
  var iData = parseItemStat(g.item[id].stat);
  var val = null;
  if(isset(iData.gold)) val = parseInt(iData.gold);
  if(isset(iData.goldpack)) val = parseInt(iData.goldpack);
  if(val){
    if (val+hero.gold>hero.goldlim){
      //'Uwaga, przekroczysz limit dostÄpnego zÅota, nadwyÅ¼ka zÅota w iloÅci '+(amount+hero.gold-hero.goldlim)+' sztuk zostanie stracona. Czy chcesz kontynuowaÄ ?'
      //mAlert(_t('gold_limit_reach_info %loss%', {'%loss%':(val+hero.gold-hero.goldlim)}, 'item'), 2, [function(){moveItemSafe(id, 'st=1')}, function(){}]);
      moveItemSafe(id, 'st=1');
      return true;
    }
  }
  return false;
}

function checkMailGoldLimitReach(amount, mid, call){
  var val = amount
  if(val){
    if (val+hero.gold>hero.goldlim){
      //'Uwaga, przekroczysz limit dostÄpnego zÅota, nadwyÅ¼ka zÅota w iloÅci '+(amount+hero.gold-hero.goldlim)+' sztuk zostanie stracona. Czy chcesz kontynuowaÄ ?'
      mAlert(_t('gold_limit_reach_info %loss%', {'%loss%':(val+hero.gold-hero.goldlim)}, 'item'), 2, [function(){_g('mail&a=get&id='+mid)}, function(){}]);
      return true;
    }
  }
  return false;
}

function checkMailDelGoldLimitReach(amount, mid, call){
  var val = amount
  if(val){
    if (val+hero.gold>hero.goldlim){
      //'Uwaga, przekroczysz limit dostÄpnego zÅota, nadwyÅ¼ka zÅota w iloÅci '+(amount+hero.gold-hero.goldlim)+' sztuk zostanie stracona. Czy chcesz kontynuowaÄ ?'
      mAlert(_t('gold_limit_reach_info %loss%', {'%loss%':(val+hero.gold-hero.goldlim)}, 'item'), 2, [function(){_g('mail&a=del&id='+mid)}, function(){}]);
      return true;
    }
  }
  return false;
}

$(document).ready(function(){
  $(window).on('error', function(){
    //log(dump(arguments[0]),3);
    //log('WystÄpiÅ nieoczekiwany bÅÄd z dodatkiem.', 1);
    });
  /* mouse events */
  $(document).mouseover(function(e){
    if(isset(g)) g.away.update();
    $targ=$(e.target);
    if($targ.attr('rollover')) {
      var bp=$targ.css('backgroundPosition');
      if(e.target.id=='') $targ.attr('id','rndid#'+Math.random())
      if(!isset(bp) && $targ.css('backgroundPositionX')!='')
        bp=$targ.css('backgroundPositionX')+' '+$targ.css('backgroundPositionY');
      if(!isset(bp)) bp='0 0';
      var bp2=bp.split(' ');
      $targ.data('bp',bp).css('backgroundPosition',bp2[0]+' -'+$targ.attr('rollover')+'px');
    }
    if($targ.attr('rollover2')) {
      var bp=$targ.css('backgroundPosition');
      if(!isset(bp)) bp='0 0';
      $targ.data('bp',bp).css('backgroundPosition','-'+$targ.attr('rollover2')+'px 0');
    }
    if($targ.attr('wmap')) map.highlightMap($targ.attr('wmap'));
  });
  $(document).mouseout(function(e){
    $targ=$(e.target);
    if($targ.attr('rollover')) $targ.css('backgroundPosition',$targ.data('bp'));
    if($targ.attr('rollover2')) $targ.css('backgroundPosition',$targ.data('bp'));
    //if($targ.attr('tip')) hideTip();
    if($targ.attr('wmap')) map.fadeoutMap($targ.attr('wmap'));
  });

});//on ready

/* custom alertbox
 * txt - message
 * mode - 0 default, 1 ok/cancel, 2 yes/no buttons, 3 - input
 * callback - function or array of functions called when button
 * hMode - auxClass of malert window when neded, look in css for keyword "hmode_" to see list of hMode possibilities
 */
function mAlert(txt,mode,callback,hMode)
{
  $('#alert').hide();
	$('#alert .a2').remove();
	$('#alert .a1').after($('<div>').addClass('a2'));
	$('#alert .a2').html(txt);
  $('#alert .a3 .custom-buttons-container').remove();
  if(!isset(mode)) mode=0;
  $('#alert').attr('class', '').addClass('mode'+mode+(isset(hMode)?' hmode_'+hMode:''));
  if(mode==3) {
    $('#alert .a2').append('<div class="mAlertInputContainer"><div class="bLeft"></div><input maxlength="25" name="mAlertInput" /><div class="bRight"></div></div>');
  }
  const okTxt = mode == 2 ? _t('yes', null, 'buttons') : _t('ok', null, 'buttons');
  const cancelTxt = mode == 2 ? _t('no', null, 'buttons') : _t('cancel', null, 'buttons');
  $('#alert .a3').html('');
  $('#alert .a3').append(drawSIButton(okTxt, 'wood', null, { id: 'a_ok' }));
  $('#alert .a3').append(drawSIButton(cancelTxt, 'wood', null, { id: 'a_cancel' }));
  $('#a_ok').show();
  $('#a_cancel').show();
  if(mode==1 || mode==2 || mode==3 || mode==4) { // mode=1 ok/cancel, 2= yes/no, 3 - input with ok/cancel
    $('#a_ok').on('click', () => {
      $('#alert').fadeOut(300);
      $('#a_ok').blur();
    });
    $('#a_cancel').on('click', () => {
      $('#alert').fadeOut(300);
      $('#a_ok').blur();
    });
    if(isset(callback)) {
      if(callback.length >= 1 && typeof callback[0] == "function") $('#a_ok').on('click', callback[0]);
      if(callback.length >= 2 && typeof callback[1] == "function") $('#a_cancel').on('click', callback[1]);
    }
  } else if (mode === 6) {
    $('#a_ok').css('display', 'none');
    $('#a_cancel').css('display', 'none');
    const $customButtonsContainer = $('<div>', {class: 'custom-buttons-container'});
    callback.map(button => {
      const btn = drawSIButton(button.txt, 'wood', () => {
        button.callback();
        $('#alert').fadeOut(300);
      });
      $customButtonsContainer.append(btn);
    })
    $('#alert .a3').append($customButtonsContainer);
  } else { // only ok button

		var selector1 = '#a_ok';
		var selector2 = '#a_cancel';
		if (mode==5) {
			selector1 = '#a_cancel';
			selector2 = '#a_ok';
		}

		$(selector2).hide();
    $(selector1).unbind('click').click(function(){
      $(selector1).unbind('click');
      $('#alert').fadeOut(300);
      $(selector1).blur();
    });
    if(isset(callback) && callback) $(selector1).click(callback);
  }
  $('#alert').absCenter().fadeIn('fast',function(){
   // $('#a_ok').focus();
    $('#alert input[name="mAlertInput"]').focus();
  });
}
function fadeMsg()
{
  for(var k in g.msg) {
    if(typeof(g.msg[k]) == 'function') continue; //IE8 fix
    g.msg[k].t--;
    var t=g.msg[k].t;
    if(t>0) {
      //if(!g.msg[k].s) g.msg[k].s=$('#'+$('#msg'+k).shadowId());
      if(t<25 && !$.fx.off) {
        g.msg[k].e.css('opacity',t/25);
      //g.msg[k].s.css('opacity',t/25);
      }
    } else {
      //g.msg[k].e.removeShadow().remove();
      g.msg[k].e.remove();
      delete g.msg[k];
      $('#msg').absCenter();
      //$('#msg DIV').redrawShadow();
      for(var i in g.msg) g.msg[i].s=false;
    }
  }
}

function askAlert (data) {
  var callbacks = [];
  var re = data.re;
  const question = TextModifyByTag.parseText(data.q);
  var mode = 0;

  var icon = '';
  if (isset(data.ip)) {
    var patch = CFG[data.ik] + '' + data.ip;
    patch = patch.replace(/"/g, '&quot;');
    icon = '<div class="icon" style="background-image: url(' + patch + ')"></div>';
    if (isset(data.it)) {
      if (typeof data.it == 'string') {
        data.it = escapeHTML(data.it);
      }
      icon = '<div class="text">' + _t('stamina_shop_cost') + '<span class="red"> ' + data.it + '</span></div>' + icon;
    }
    icon = '<div class="icon-wrapper">' + icon + '</div>';
  }
  var html = question + icon;
  switch(data.m) {
    case 'okcancel':
      g.askre = re;
      mode = 1;
      callbacks = [function(){
        _g(g.askre+'1')
      }, function(){
        _g(g.askre+'0')
      }];
      break;
    case 'yesno':
      g.askre = re;
      mode = 2;
      callbacks= [function(){
        _g(g.askre+'1')
      }, function(){
        _g(g.askre+'0')
      }];
      break;
    case 'input':
    case 'inputNumeric':
      const type = data.m === 'inputNumeric' ? 'number' : 'text';
      g.askre = re;
      mode = 3;
      callbacks = [function(){
        let alertVal = $('#alert .a2 input[name="mAlertInput"]').val();
        _g(g.askre + esc(alertVal))
      }, function(){
        _g(g.askre + '&inputCancel=1')
      }];

      mAlert(html, mode, callbacks, null);
      const $input = $('#alert .a2 input[name="mAlertInput"]');
      $input.removeAttr('maxlength');
      $input.attr('type', type);
      if (type === 'number') {
        $input.val(0);
        $input.addClass('with-spin');
      } else {
        $input.val('');
        $input.removeClass('with-spin');
      }
      return;
    case 'buttons':
      mode = 6;
      const { buttons } = data.config;
      callbacks = buttons.map(button => {
        const btnTitle = isset(button.title.text) ? button.title.text : _t('ETK_' + button.title.key) // ETK = Engine Translate Key
        return {
          txt: btnTitle,
          hotkeyClass: '',
          callback: () => {
            _g(re + button.opt);
            return true;
          }
        }
      })
  }

  mAlert(html, mode, callbacks, null)
}

window.getHeroLevel = function () {
  if (!hero) {
    return 0;
  }

  return hero.getLevel();
};

window.getHeroProf = function () {
  if (!hero) {
    return 0;
  }

  return hero.getProf();
};

function calculateDiff(s1, s2){
  var diff = Math.abs(isset(s2) ? s1 - s2 : s1)/60;
  if(diff<110) return _t('time_min %val%', {'%val%':Math.round(diff)}, 'time_diff')
  else if(diff<1440) return _t('time_h %val%', {'%val%':Math.round(diff/60)}, 'time_diff')
  else return _t('time_days %val%', {'%val%':Math.round(diff/1440)}, 'time_diff');
}
function removeMessages(str){
	var regexp = new RegExp(str, "g");
	var found = false;
	for(var t in g.msg){
		var txt = g.msg[t].e.html();
		if(regexp.test(txt)){
			g.msg[t].t=0;
			found = true;
		}
	}
	if(found){
		fadeMsg();
	}
}
function message(msg) {
  var idx=g.msg.length;
  msg = TextModifyByTag.parseText(decodeHtmlEntities(msg));
  $('<div id=msg'+idx+' onclick="g.msg['+idx+'].t=1">'+parseContentBB(msg)+'</div>').appendTo('#msg');//.dropShadow({blur:$.fx.off?0:1,opacity:1});
  g.msg[idx]={
    t:100,
    e:$('#msg'+idx),
    s:false
  };
  //$('#msg DIV').redrawShadow();
  $('#msg').absCenter();
}
function achMessage(msg){
  var idx=g.msg.length;
  var data = msg.split(',');
  $('<div id="msg'+idx+'" class="achievement" onclick="g.msg['+idx+'].t=1">'+parsePopupBB(data[3])+'</div>').appendTo('#msg');//.dropShadow({blur:$.fx.off?0:1,opacity:1});
  g.msg[idx]={
    t:100,
    e:$('#msg'+idx),
    s:false
  };
  //$('#msg DIV').redrawShadow();
  $('#msg').absCenter();
}
function showDialog(title,txt)
{
  var lio=title.lastIndexOf('.'),lml=title.length-lio;
  if(lio>0 && (lml==4 || lml==5)) {
    $('#dlgwin .w2').css('backgroundImage',`url(img/${title}?v=${_CLIENTVER})`).html(txt);
    $('#dlgtitle').empty();
  }
  else {
    $('#dlgwin .w2').css('backgroundImage',`url(img/empty-title.png?v=${_CLIENTVER})`).html(txt);
    $('#dlgtitle').html(title);
  }
  $('#dlgwin').absCenter().fadeIn('fast');
  $('#dlgwin .w1').css('backgroundPosition','0 '+($('#dlgwin .w1').height()-28)+'px');
  g.lock.add('dialogalert');
}
/***** PHP equivalents *****/

function isset(x)
{
  return typeof(x)!='undefined';
}
function urlencode(str)
{
  return escape(str).replace(/\+/g,'%2B').replace(/%20/g, '+').replace(/\*/g, '%2A').replace(/\//g, '%2F').replace(/@/g, '%40');
}
function addslashes (str)
{
  return (str+'').replace(/([\\"'])/g, "\\$1").replace(/\u0000/g, "\\0");
}
function is_int(a) {
  var b=parseInt(a);
  if (isNaN(b)) return false;
  return a==b && a.toString()==b.toString();
}
/***** time functions *****/
function ts() { //TS in microseconds
  var now = new Date();
  return parseInt(now.getTime());
}
function unix_time(raw) {
  var now = new Date();
  //var time = (now.getTime()/1000) - ((isset(raw) && raw) ? 0 : g.serverTimeDiff);
	var time = now.getTime()/1000;

  if(!isset(raw)) return Math.round(time);
  else return time;
}
function datediff(first_ts, second_ts) {
	if (typeof (second_ts) == 'undefined') second_ts = unix_time();
	var ret = ['', 0];
	var diff = Math.abs(Math.ceil((first_ts - second_ts) / 60));
	ret[1] = (first_ts - second_ts) > 0 ? '+' : '-';

	if (diff < 110) ret[0] = Math.round(diff) + 'min';
	else if (diff < 1440) ret[0] = Math.round(diff / 60) + 'h';
	else ret[0] = Math.round(diff / 1440) + ' dni';

	return ret;
};
function ut_date(ts) { // date from unix timestamp
  var d=new Date(ts*1000),y=d.getFullYear();
  return d.getDate()+"/"+(d.getMonth()+1)+"/"+y;
}
function ut_time(ts) { // time from unix timestamp
  var d=new Date(Math.round(ts*1000));
  return d.getHours()+":"+zero(d.getMinutes())+":"+zero(d.getSeconds());
}
function ut_time_ns(ts) { // time from unix timestamp
  var d=new Date(Math.round(ts*1000));
  return d.getHours()+":"+zero(d.getMinutes());
}
function ut_fulltime(ts,full) { // date&time from unix timestamp
  var d=new Date(ts*1000);
  return d.getDate()+"/"+zero(d.getMonth()+1)+"/"+(isset(full)?d.getFullYear():zero(d.getFullYear()%100))+' '+zero(d.getHours())+":"+zero(d.getMinutes()) + (isset(full) ? ":"+zero(d.getSeconds()) : '');
}
function getCurrentDate () {
  const
      date = new Date(),
      day = zero(date.getDate()),
      month = zero(date.getMonth()+1),
      year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
function c_date(days) { // cookie time
  var d=new Date();
  d.setTime(d.getTime()+360000*24*days);
  return d;
}

/***** usefull functions *****/
window.round = function (n, precise, sep, cutAfter = 0) {
  precise = isset(precise) ? precise : 1;
  n = Math.abs(parseFloat(n));
  var sign = (n < 0) ? '-' : '';
  var result = '';
  switch (precise) {
    case 10:
      if (!isset(sep)) sep = ' ';
      if (n.toString().length < 4) {
        result = n;
      } else {
        result = n.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1" + sep);
      }
      break;
    default:
      var data = roundParser(n);
      if (!isset(sep)) sep = '.';
      result = Math.round(data.val * Math.pow(10, precise - 1)) / Math.pow(10, precise - 1);
      if (cutAfter) {
        result = cutFloat(result, cutAfter);
      }
      result = result + data.postfix;
      result = result.replace(/\./, sep);
      if (n < 9999) return sign + n;
      break;
  }
  return sign + result;
};

function cutFloat (n, cutAfter) {
  if (!(n.toString().indexOf('.') >= 0)) return n; // cut if n is float only

  var h = Math.pow(10, 12),
    num = (Math.floor(n * h) / h).toString();
  return num.substring(0, num.indexOf(".") + cutAfter + 1);   //= 123.35
}

function roundParser(n){
  n = Math.floor(n);
  var diff = n.toString().length%3;
  var length = n.toString().length;
  var postfix = '';
  var val = n/Math.pow(10,length>9?9:length-(diff==0?3:diff));
  var postfixList={'0':'','3':'k','6':'m','9':'g'};
  for (var i in postfixList){
    if (length > parseInt(i)){postfix = postfixList[i];}
  }
  return {val:val,postfix:postfix};
}
//simple round with precision
function roundNumber(num, dec) {
  var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
  return result;
}
window.formNumberToNumbersGroup = function (number) {
  var array = ((number.toString()).split('')).reverse();
  var newArray = [];
  if (number.toString().indexOf('.') > -1) return number;
  for (var i = 0; i < array.length; i++ ) {
    var bool1 = i % 3 == 0;
    var bool2 = i != 0;
    if (bool1 && bool2) newArray.push(" ");
    newArray.push(array[i]);
  }
  newArray.reverse();
  return newArray.join('');
};
/* converts 12.3k to 12300 */
function parsePrice(x)
{
  x+='';
  if(x=='' || x==' ') return '';
  x=x.split(',').join('.');
  if(x.slice(-1)=='g' || x.slice(-1)=='G') return Math.round(parseFloat(x)*1000000000);
  if(x.slice(-1)=='m' || x.slice(-1)=='M') return Math.round(parseFloat(x)*1000000);
  if(x.slice(-1)=='k' || x.slice(-1)=='K') return Math.round(parseFloat(x)*1000);
  return parseInt(x);
}
function zero(x,z)
{
  if(!isset(z)) z=2;
  x=x.toString();
  while(x.length<z) x='0'+x;
  return x;
}
function mp(x) // changes 5 to +5, -5 to -5
{
  if(x>0) return '+'+x; else return x;
}

/* imglist - array with urls, cb - callback function after all loaded*/
function loadImgs(imglist,cb)
{
  evImg({
    data:{
      il:imglist,
      cb:cb
    }
  })
}
function evImg(e)
{
  if(!isset(e.data.il)||e.data.il.length==0) {
    e.data.cb();
    return;
  }
  var img=new Image();
  $(img).bind('load',{
    il:e.data.il.slice(1),
    cb:e.data.cb
  },evImg).error(function(){
    log("Can't load image from "+$(this).attr('src'),2);
  }).attr({
    src:e.data.il[0]
  });
}
function listImgs(obj)
{
  var il=[];
  var b=$(obj).css('background-image');
  if(b!='none')	il[il.length]=b.substr(5,b.length-7);
  $(obj+' *').each(function(i){
    b=$(this).css('background-image');
    if(b!='none')	il[il.length]=b.substr(5,b.length-7);
  });
  $(obj+' img').each(function(i){
    b=$(this).attr('src');
    if(b!='')	il[il.length]=b;
  });
  return il;
}
function showObj(obj)
{
  $('#imgload').show();
  loadImgs(listImgs(obj),function(){
    $('#imgload').hide();
    $(obj).fadeIn(250)
  });
}
/* escape only important characters */
function esc(str) {
  if (!str) return '';
  return encodeURIComponent(str);
  //return str.replace(/%/g,"%25").replace(/&/g,"%26").replace(/#/g,"%23")
  //.replace(/\?/g,"%3f").replace(/\n/g,"%0A").replace(/\r/g,"%0D");
}

function strip_tags(html, allowed){
  //it adds space after all replaced text
  if(arguments.length < 3) {
    html=html.replace(/<\/?(?!\!)[^>]*>/gi, ' ');
  } else {
    var specified = eval("["+arguments[2]+"]");
    if(allowed){
      var regex='</?(?!(' + specified.join('|') + '))\b[^>]*>';
      html=html.replace(new RegExp(regex, 'gi'), ' ');
    } else{
      var regex='</?(' + specified.join('|') + ')\b[^>]*>';
      html=html.replace(new RegExp(regex, 'gi'), ' ');
    }
  }
  var clean_string = html;
  return clean_string;
};

function checkFraud(txt){
  //words check
  var fraudWords = ['hasÅ','pass','login','logo','konto'];
  var fraudPattern = new RegExp(fraudWords.join('|'), 'ig');
  if (fraudPattern.test(txt)) return true;

  //urls check
  var pattern = new RegExp('https?://([-A-Za-z0-9+&@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#/%=~_()|])', 'ig');
  var urlPattern = new RegExp('^http://([a-z1-9.]*?)(margonem\.pl)[^/\\?=a-z]?', 'ig');
  var result = null;
  if (pattern.test(txt)){
    do{
      result = pattern.exec(txt);
      if (result && urlPattern.test(result[0])) return true;
    }while(result);
  }
  return false;
}
function parseLinks(string){
  return string.replace(
    new RegExp('https?://([-A-Za-z0-9+&@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#/%=~_()|])', 'ig'),
    '<a href="$1" onclick="goToUrl(\'$1\');return false;">$1</a>'
  );
}

function showEnWindow(header, html, params, onclose){
	g.lock.add('en_window');
	if(isset(params)){
		var check = ['class'];
		$('#en_wnd').attr('class', 'en-window-wrapper');
		for(var i in check){
			switch(check[i]){
				case 'class':
					$('#en_wnd').addClass(params['class']);
					break;
			}
		}
	}
	$('#enwnd_header_txt').html(goldTxt(header));
	$('#enwnd_content').html(html);
	$('#en_wnd').show().absCenter();
	$('#en_wnd .close-button').unbind('click').bind('click', function(){
		var ret = isset(onclose) ? onclose() : true;
		if(ret) hideEnWindow();
	})
}

function goldTxt(txt, all){
	let cl = all ? 'gfont gfont-all' : 'gfont';
  return '<span class="' + cl + '" name="'+txt+'">'+txt+'</span>';
}

function updateGoldTxt ($goldTxt, str) {
  $goldTxt.find('.gfont').html(str).attr('name', str);
}

function updateGoldTxtColor ($goldTxt, colors) {
  //let $gFont = $goldTxt.find('.gfont');

  $goldTxt.removeClass('white');

  if (!colors) return;

  for (let i = 0; i <  colors.length; i++) {
    $goldTxt.addClass(colors[i])
  }
}

function copyStructure (arrayOrObject) {
  return JSON.parse(JSON.stringify(arrayOrObject));
}

function hideEnWindow(){
	g.lock.remove('en_window');
	$('#en_wnd').hide();
}
function drawButton(txt, callback){
	return '<div onclick="'+callback+'" class=mButton><div class=inner-part></div><div class=left></div><div class=right></div><div class="content">'+goldTxt(txt)+'</div></div>';
}
function tutorialStart(idx){
  return;
  __tutorials.start(idx);
}

function strtotime (str, now) {
    // http://kevin.vanzonneveld.net
    // +   original by: Caio Ariede (http://caioariede.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: David
    // +   improved by: Caio Ariede (http://caioariede.com)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Wagner B. Soares
    // +   bugfixed by: Artur Tchernychev
    // %        note 1: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
    // *     example 1: strtotime('+1 day', 1129633200);
    // *     returns 1: 1129719600
    // *     example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
    // *     returns 2: 1130425202
    // *     example 3: strtotime('last month', 1129633200);
    // *     returns 3: 1127041200
    // *     example 4: strtotime('2009-05-04 08:30:00');
    // *     returns 4: 1241418600
    var i, l, match, s, parse = '';

    str = str.replace(/\s{2,}|^\s|\s$/g, ' '); // unecessary spaces
    str = str.replace(/[\t\r\n]/g, ''); // unecessary chars
    if (str === 'now') {
        return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
    } else if (!isNaN(parse = Date.parse(str))) {
        return parse / 1000 | 0;
    } else if (now) {
        now = new Date(now * 1000); // Accept PHP-style seconds
    } else {
        now = new Date();
    }

    str = str.toLowerCase();

    var __is = {
        day: {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        },
        mon: [
            'jan',
            'feb',
            'mar',
            'apr',
            'may',
            'jun',
            'jul',
            'aug',
            'sep',
            'oct',
            'nov',
            'dec'
        ]
    };

    var process = function (m) {
        var ago = (m[2] && m[2] === 'ago');
        var num = (num = m[0] === 'last' ? -1 : 1) * (ago ? -1 : 1);

        switch (m[0]) {
        case 'last':
        case 'next':
            switch (m[1].substring(0, 3)) {
            case 'yea':
                now.setFullYear(now.getFullYear() + num);
                break;
            case 'mon':
                now.setMonth(now.getMonth() + num);
                break;
            case 'wee':
                now.setDate(now.getDate() + (num * 7));
                break;
            case 'day':
                now.setDate(now.getDate() + num);
                break;
            case 'hou':
                now.setHours(now.getHours() + num);
                break;
            case 'min':
                now.setMinutes(now.getMinutes() + num);
                break;
            case 'sec':
                now.setSeconds(now.getSeconds() + num);
                break;
            default:
                var day = __is.day[m[1].substring(0, 3)];
                if (typeof day !== 'undefined') {
                    var diff = day - now.getDay();
                    if (diff === 0) {
                        diff = 7 * num;
                    } else if (diff > 0) {
                        if (m[0] === 'last') {
                            diff -= 7;
                        }
                    } else {
                        if (m[0] === 'next') {
                            diff += 7;
                        }
                    }
                    now.setDate(now.getDate() + diff);
                }
            }
            break;

        default:
            if (/\d+/.test(m[0])) {
                num *= parseInt(m[0], 10);

                switch (m[1].substring(0, 3)) {
                case 'yea':
                    now.setFullYear(now.getFullYear() + num);
                    break;
                case 'mon':
                    now.setMonth(now.getMonth() + num);
                    break;
                case 'wee':
                    now.setDate(now.getDate() + (num * 7));
                    break;
                case 'day':
                    now.setDate(now.getDate() + num);
                    break;
                case 'hou':
                    now.setHours(now.getHours() + num);
                    break;
                case 'min':
                    now.setMinutes(now.getMinutes() + num);
                    break;
                case 'sec':
                    now.setSeconds(now.getSeconds() + num);
                    break;
                }
            } else {
                return false;
            }
            break;
        }
        return true;
    };

    match = str.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/);
    if (match !== null) {
        if (!match[2]) {
            match[2] = '00:00:00';
        } else if (!match[3]) {
            match[2] += ':00';
        }

        s = match[1].split(/-/g);

        s[1] = __is.mon[s[1] - 1] || s[1];
        s[0] = +s[0];

        s[0] = (s[0] >= 0 && s[0] <= 69) ? '20' + (s[0] < 10 ? '0' + s[0] : s[0] + '') : (s[0] >= 70 && s[0] <= 99) ? '19' + s[0] : s[0] + '';
        return parseInt(this.strtotime(s[2] + ' ' + s[1] + ' ' + s[0] + ' ' + match[2]) + (match[4] ? match[4] / 1000 : ''), 10);
    }

    var regex = '([+-]?\\d+\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday)' + '|(last|next)\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday))' + '(\\sago)?';

    match = str.match(new RegExp(regex, 'gi')); // Brett: seems should be case insensitive per docs, so added 'i'
    if (match === null) {
        return false;
    }

    for (i = 0, l = match.length; i < l; i++) {
        if (!process(match[i].split(' '))) {
            return false;
        }
    }

    return now.getTime() / 1000 | 0;
}

function getAllProfName(p) {
	var prof = {
		m: _t('prof_mag', null, 'eq_prof'),
		w: _t('prof_warrior', null, 'eq_prof'),
		p: _t('prof_paladyn', null, 'eq_prof'),
		t: _t('prof_tracker', null, 'eq_prof'),
		h: _t('prof_hunter', null, 'eq_prof'),
		b: _t('prof_bladedancer', null, 'eq_prof')
	};
	return prof[p];
}

function getHalfByte(intvalue, index){
  return (intvalue>>(4*index))&0xf;
}

function parseItemStat(s){
  s = s.split(';');
  var obj = {};
  for (var i=0; i<s.length; i++){
    var pair = s[i].split('=');
    obj[pair[0]] = isset(pair[1]) ? pair[1] : null;
  }
  return obj;
}

function checkItemExpires (item) {
  let _ts            = ts() / 1000;
  let itemStats      = parseItemStat(item.stat);

  return _ts > itemStats.expires;
}

function checkItemStat (item, oneStat) {
  let stats     = parseItemStat(item.stat);
  return stats.hasOwnProperty(oneStat);
}

function getAmountItem (item) {
  let stats     = parseItemStat(item.stat);
  return parseInt(stats['amount']);
}

function getParseGold (val) {
  var precise = val.toString().length > 9 ? 12 : 10;
  var sep = val.toString().length > 9 ? '.' : ' ';
  return round(val, precise, sep, 3);
}

function itemIsDisabled ($item) {
  return $item.hasClass('disable-item-mark');
}

function setBarterItem ($item) {
  if (!g.barter || !g.barter.checkShowAffectedOfferId()) return;
  let id = $item.attr('id').substr(4);
  g.barter.setBarterItem(g.item[id]);

}

function setAuctionOffItem ($item) {
  if (!g.auctions) return false;
  let id = $item.attr('id').substr(4);
  g.auctions.putAuctionOffItem(g.item[id])
  return true;
}

function setSalvageItem ($item) {
  if (!g.crafting || !g.crafting.salvage) return false;
  let id = $item.attr('id').substr(4);
  g.crafting.salvage.onClickInventoryItem(g.item[id]);
  return true;
}

function setEnhanceItem ($item) {
  if (!g.crafting || !g.crafting.enhancement) return false;
  let id = $item.attr('id').substr(4);
  g.crafting.enhancement.onClickInventoryItem(g.item[id]);
  return true;
}

function setExtractionItem ($item) {
  if (!g.crafting || !g.crafting.extraction) return false;
  let id = $item.attr('id').substr(4);
  g.crafting.extraction.onClickInventoryItem(g.item[id]);
  return true;
}

function setBonusReselectItem ($item) {
  if (!g.bonusReselectWindow) return false;
  let id = $item.attr('id').substr(4);
  g.bonusReselectWindow.onClickInventoryItem(g.item[id]);
  return true;
}


function htmlspecialchars(p_string) {
	p_string = p_string.replace(/&/g, '&amp;');
	p_string = p_string.replace(/"/g, '&quot;');
	p_string = p_string.replace(/'/g, '&#039;');
	return p_string;
};

function getStartMonth (ts) {
	var d = new Date(ts * 1000);
	return d.getMonth();
}

function getStartDay (ts) {
	var d = new Date(ts * 1000);
	return d.getDate();
}

function getStartWeekDay (ts) {
	var d = new Date(ts * 1000);
	return d.getDay();
}

function getStartYear (ts) {
	var d = new Date(ts * 1000);
	return d.getFullYear();
};

function showIthanMap(){
  var I = new Image();
  I.src = CFG.npath+'ithan-bard-map.png';
  I.onload=function(){
    mAlert('<img style="width:'+I.width+';height:'+I.height+';" src="'+CFG.npath+'ithan-bard-map.png" />');
  }
}

function _l(){
  var tmp = location.host.split('.');
  var loc = 'pl';
  switch(tmp[tmp.length-1]){
    case 'com': loc = 'en';
  }
  return loc;
}
function extMgrCookieGet(raw){
  var ids = getCookie('__mExts');
  if(isset(raw) && raw) return ids;
  if(ids !== null){
    var tmp = {};
    ids = ids.split(',')
    for(var i=0; i<ids.length; i++){
      var t = parseInt(ids[i].substr(1));
      if(!isNaN(t)) tmp[t] = ids[i].substr(0,1);
    }
    return tmp;
  }
  else return {};
}
var _tMessagesQueue = [];
var _tQueueTimeout  = null;
var _tDefaultCategory = 'default';
function _tSend(){
  /*$.ajax({
    url:'http://work.garmory.pl/messages/add',
    type:'post',
    data:{messages:_tMessagesQueue}
  });*/
  _tMessagesQueue = [];
}
function invertKeyInputOnSpecificMap (id) {
  if ([3714].indexOf(id) > -1) return true;
}
function setNormalKeySet (state) {
  if (state) {
    g.keys.wsad = {
      65:'W',
      87:'N',
      68:'E',
      83:'S'
    };
    g.keys.arrows = {
      37:'W',
      38:'N',
      39:'E',
      40:'S'
    }
  } else {
    g.keys.wsad = {
      65:'E',
      87:'S',
      68:'W',
      83:'N'
    };
    g.keys.arrows = {
      37:'E',
      38:'S',
      39:'W',
      40:'N'
    };
  }
}

/*
function createTranslationsAttrData (ret) {
  let data  = {};
  let vars  = ret.match(/\%(.*?)\%/g);

  for (let k in vars) {
    let split = vars[k].split(':');

    let fullStr  = vars[k];
    let attrName = split[0];

    if (split.length == 1) {

      data[attrName] = {
        fullStr   : fullStr,
        strAttr   : attrName,
        modify    : null
      }

    } else {
      if (split.length > 2) {
        console.error('Translations','createTranslationsAttrData', 'Only one modify require!', split);
        return
      }

      attrName        = split[0] + '%';
      let modifyName  = split[1].slice(0, -1);

      data[attrName] = {
        fullStr   : fullStr,
        strAttr   : attrName,
        modify    : modifyName
      };

    }

  }

  return data
}
*/

function createTranslationsAttrData (ret, parameters) {
  let data  = {};
  //let vars  = ret.match(/\%(.*?)\%/g);

  for (let k in parameters) {
    let isCorrect = checkCorrectParameter(k);
    if (!isCorrect) {
      console.error('Translations.js', 'createTranslationsAttrData', 'Translations parameter name is incorrect!', k);
      return data
    }
    let parameter = getParams(k);
    let r         = new RegExp('\%' + parameter +  '(.*?)\%', "g");
    let vars      = ret.match(r);

    manageOneAttrData(ret, data, vars);

  }

  return data
}

function checkCorrectParameter (parameter) {
  return parameter[0] == '%' && parameter[parameter.length - 1] == '%'
}

function getParams (parameter) {
  let _str = parameter.substring(0, parameter.length - 1);
  _str = _str.substring(1);

  return _str;
}

function checkHeroHaveClan () {
  return hero.clan ? true : false;
}

function checkHeroHaveParty () {
  return !(g.party == false || g.party == 0);
}

function manageOneAttrData (ret, data, vars) {
  for (let k in vars) {
    let split = vars[k].split(':');

    let fullStr  = vars[k];
    let attrName = split[0];

    if (split.length == 1) {

      data[attrName] = {
        fullStr   : fullStr,
        strAttr   : attrName,
        modify    : null
      }

    } else {
      if (data[attrName]) {
        console.error('Translations','manageOneAttrData', 'With modify, parameter name can occurred only one in all string!', ret);
        return
      }

      if (split.length > 2) {
        console.error('Translations','manageOneAttrData', 'Only one modify require!', split);
        return
      }

      attrName        = split[0] + '%';
      let modifyName  = split[1].slice(0, -1);

      data[attrName] = {
        fullStr   : fullStr,
        strAttr   : attrName,
        modify    : modifyName
      };

    }

  }
}

function getNewValAfterModify (val, modify) {
  switch (modify) {
    case 'GET_LEFT'     : return getSecondLeft(val, {short:true});
    case 'GET_CURRENCY'	: return getCurrency(val);
    case 'GET_SEX'		  : return getSex(val);
    case 'GET_PROF'		  : return getProfession(val);
    case 'ARRAY_PARAM'	: return arrayParams(val);
  }

  console.error('Translations', 'getNewValAfterModify', 'Unregistered translations modify:', modify);

  return val;
}

function getCurrency (arrayVal) {
  return arrayParams (arrayVal, (val) => {
    let data 		= val.split('=');

    if (data.length != 2) {
      console.error('[Translations.js] getCurrency Incorrect currency data', val);
      return '';
    }

    let currency 	= data[0];
    let amount 		= data[1];

    return amount + ' ' + getCurrencyTextByChar(currency);
  });
}

function getProfession (arrayVal) {
  return arrayParams (arrayVal, (val) => {
    let data 		= val.split('=');

    if (data.length !== 2) {
      console.error('Translations.js', 'getProfession', 'Incorrect profession data', val);
      return '';
    }
    let profChar = data[1];

    return getAllProfName(profChar);
  });
}

function getSex (arrayVal) {
  return arrayParams (arrayVal, (val) => {
    let data 		= val.split('=');

    if (data.length !== 2) {
      console.error('Translations.js', 'getSex', 'Incorrect sex data', val);
      return '';
    }
    let sexChar = data[1];

    switch (sexChar) {
      case 'm':
        return _t('male');
      case 'f':
        return _t('female');
      default:
        errorReport('Translations.js', 'getSex', 'Incorrect sex data', val);
        return '';
    }
  });
}

function getCurrencyTextByChar (char) {
  switch (char) {
    case 'gold':
    case 'z':
      return _t('cost_gold');
    case 'credits':
    case 's':
      return _t('sl');

    default: console.error('[Translations.js] getCurrencyTextByChar Currency not exist', char);
      return '';
  }
}

function arrayParams (arrayVal, modifyFunc) {
  let a = arrayVal.split(';');

  if (a.length == 1) return modifyFunc ? modifyFunc(arrayVal) : arrayVal;

  let val = '';

  for (let k in a) {
    let v = a[k];

    val += modifyFunc ? modifyFunc(v) : v;

    let oneBeforeLast = parseInt(k) + 1 == a.length - 1;

    if (oneBeforeLast)  val += ' i ';
    else 				val += ', ';
  }

  val.substring(0, val.length - 2);

  return val.substring(0, val.length - 2);
}

function getTranslationsWithParameters (ret, parameters, damageWrapper) {

  let data = createTranslationsAttrData(ret, parameters);

  for (let attrName in parameters) {
    let newVal;
    let stringToReplace;
    let oneAttr = data[attrName];

    if (oneAttr && oneAttr.modify) {

      let fullStr       = oneAttr.fullStr;
      let modify        = oneAttr.modify;

      newVal            = getNewValAfterModify(parameters[attrName], modify);
      stringToReplace   = fullStr;

    } else {
      newVal            = parameters[attrName];
      stringToReplace   = attrName;
    }

    if (damageWrapper)  ret = ret.replace(new RegExp(stringToReplace, 'g'), '<span class="damage">' + newVal + '</span>');
    else                ret = ret.replace(new RegExp(stringToReplace, 'g'), newVal);

  }

  return ret;
}

function createSiInput ({ cl, type, placeholder, changeClb, clearClb}) {

  let $niInput = null;

  if (type && type == 'number') {
    $niInput = $(`<div class="si-input">
        <input type="number" class="default">
        <div class="clear-cross"></div>
    </div>`);
  } else {
    $niInput = $(`<div class="si-input">
        <input class="default">
        <div class="clear-cross"></div>
    </div>`);
  }

  let $input    = $niInput.find('input');
  let $clearCross = $niInput.find('.clear-cross');

  if (cl) $niInput.addClass(cl);

  $clearCross.tip(_t('delete'));
  $clearCross.on('click', () => {
    let clearVal = $input.val();

    if ($input.val('') != '') $input.val('');

    manageClearCrossVisible();
    if (clearClb) clearClb(clearVal);
  });

  $input.on('change', (e) => {
    manageClearCrossVisible();

    if (e.isTrigger) return

    if (changeClb) {
      let val = $input.val();
      changeClb(val)
    }
  });

  $input.keyup( () => {
    manageClearCrossVisible();
  });

  function manageClearCrossVisible () {
    let clearCrossVisibility 	= $niInput.hasClass('isClearCross');
    let val	= $input.val();
    if (val === '') {
      if (clearCrossVisibility) $niInput.removeClass('isClearCross');
    } else {
      if (!clearCrossVisibility) $niInput.addClass('isClearCross');
    }
  }

  if (placeholder) createInputPlaceholder(placeholder);

  return $niInput;
}

function createInputPlaceholder (txt, $input) {
  $input.attr("placeholder", txt);
}

function createSiCheckBox (str, cl, clb) {
  let $oneCheckBox = $(`<div class="one-checkbox">
        <div class="checkbox"></div>
        <span class="label"></span>
    </div>`);

  $oneCheckBox.addClass(cl);
  $oneCheckBox.find('.label').html(str);
  $oneCheckBox.click(function () {

    let $checkbox = $(this).find('.checkbox');
    $checkbox.toggleClass('active');
    let active = $checkbox.hasClass('active')

    clb(active, $oneCheckBox);
  });

  return $oneCheckBox;
}



function createSiMenu ($menu, data, indexOption, clb) {

  const init = () => {
    initMenu();
    initOptions();
    initCLick();
    initFunc();

    if (indexOption != null) {
      $menu[0].options[indexOption].selected = true;
    }
  }

  const initMenu = () => {
    $menu.addClass('menu default');
    $menu.data(data);
  }

  const createOption = (text, val) => {
    let $option = $('<option>').html(text);

    $option.attr('value', val);

    return $option;
  }

  const initOptions = () => {
    for (let k in data) {
      let $option = createOption(data[k].text, data[k].val);

      appendOptionToMenu($option);
    }
  }

  const initCLick = () => {
    if (!clb) return;

    $menu.on('change', () => {
      clb($menu.val());
    });
  }

  const appendOptionToMenu = ($option) => {
    $menu.append($option);
  }

  const initFunc = () => {
    $menu.getValue = () => {
      return $menu.val();
    };
  }

  init();
}

function createSmallDraconiteIcon (price) {
  return createSmallCurrencyIconWithCost (price, 'small-draconite')
};

function createSmallGoldIcon (price) {
  return createSmallCurrencyIconWithCost (price, 'small-money')
};

function createSmallCurrencyIconWithCost (price, currencyClass) {
  let $wrapper	= $('<span>').addClass("small-currency-icon");
  let $icon 		= $('<div>').addClass(`icon ${currencyClass}`);
  let $cost		= $('<span>').addClass('value').html(formNumberToNumbersGroup(price));

  $wrapper.append($cost);
  $wrapper.append($icon);

  return $wrapper;
}

function createSmallButtonWithBackground (imgClass, btnClasses, clb) {
  //const btn = tpl.get('button')[0];
  const btn = $(`<div class="button">
        <div class="background"></div>
        <div class="label"></div>
    </div>`)[0];
  const bck = $('<div class="add-bck"></div>')[0];
  btn.append(bck)
  btn.classList.add('small');
  btn.classList.add('small-button-with-background');
  btn.classList.add(...btnClasses);
  bck.classList.add(...imgClass);
  //btn.querySelector('.label').innerHTML = name;
  btn.addEventListener('click', clb);
  return btn;
};

function _t(name, parameters, category){
  var cat = isset(category) ? category : _tDefaultCategory;
  if(isset(__translations[cat]) && isset(__translations[cat][name])){
    var ret = __translations[cat][name];
    if(isset(parameters)){

      ret = getTranslationsWithParameters(ret, parameters);
      // for(var i in parameters){
      //   ret = ret.replace(new RegExp(i, 'g'), parameters[i]);
      // }
    }
    return ret;
  }
  var alreadySend = false;
  for(var i=0; i<_tMessagesQueue.length; i++){
    if(_tMessagesQueue[i].m == name && cat == _tMessagesQueue[i].c){
      alreadySend = true;
      break;
    }
  }
  if(!alreadySend){
    _tMessagesQueue.push({m:name,c:cat});
    clearTimeout(_tQueueTimeout);
    _tQueueTimeout = setTimeout(function(){_tSend()}, 500);
  }
  return '[T:'+cat+']'+name;
}

function lengthObject (obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

function createMMButton (txt, wrapper, clb) {
  var $btn = $(
    '<div class="MM-button">' +
      '<div class="left"></div>' +
      '<div class="content">' +
        '<span class="gfont">' + txt + '</span>' +
      '</div>' +
      '<div class="right"></div>' +
    '</div>'
  );
  wrapper.append($btn);
  $btn.click(clb);
}

function createBigButtonButton (txt, wrapper, clb) {
  var $btn = $(
    '<div class="big-button">' +
    '<div class="left"></div>' +
    '<div class="content">' +
    '<span class="gfont">' + txt + '</span>' +
    '</div>' +
    '<div class="right"></div>' +
    '</div>'
  );
  wrapper.append($btn);
  $btn.click(clb);
}

function drawSIButton (txt, type = 'def', clb, options = {}) {
  const classes = type === 'def' ? 'SI-button' : `btn-${type}`;
  const $btn =  $(`
    <div class="btn ${classes}">
      <div class="left"></div>
      <div class=label>
        <span class="gfont" name="${txt}">${txt}</span>
      </div>
      <div class="right"></div>
    </div>
  `);
  if (isset(options.id)) $btn.attr('id', options.id);
  if (clb) $btn.click(clb);

  return $btn;
}

function initClanAttrChange() {
  var list = {
    '[name=clan-list-item-menu]':             _t('clan_list', null, 'clan'),
    '[name=clan-official-page-item-menu]':    _t('clan-official-page', null, 'clan'),
    '[name=clan-private-page-item-menu]':     _t('clan_priv-page', null, 'clan'),
    '[name=clan-recruit-item-menu]':          _t('clan_recruit', null, 'clan'),
    '[name=clan-members-item-menu]':          _t('clan_members', null, 'clan'),
    '[name=clan-treasure-item-menu]':         _t('clan_treasury', null, 'clan'),
    '[name=clan-manage-item-menu]':           _t('clan_manage', null, 'clan'),
    '[name=clan-diplomacy-item-menu]':        _t('clan_diplomacy', null, 'clan'),
    '[name=clan-history-item-menu]':          _t('clan_history', null, 'clan'),
    '[name=clan-close-item-menu]':            _t('close'),
    '[name=clan-skills-item-menu]':           _t('clan_skills', null, 'clan'),
    '[name=clan-quests-item-menu]':           _t('clan_quests', null, 'clan')
  };
  for (var i in list) {
    $(i).attr('name', list[i]);
  }

}

function initBMAttrChange() {
  var list = {
    '[name=add-normal-attack-bm]':         _t('add-normal-attack', null, 'skills'),
    '[name=add-move-bm]':                  _t('add-move', null, 'skills'),
    '[name=save-and-close-bm]':            _t('save-btn', null, 'skills'),
    '[name=clear-bm-list]':                _t('clear-list', null, 'skills'),
    '[name=close-bm]':                     _t('close')
  };
  for (var i in list) {
    $(i).attr('name', list[i]);
  }

}

function initStaticStrings(){
  var list = {

    '#bm-label1':                          "DostÄpne od 25 poziomu",
    '#bm-label2':                          _t('mbattle'),
    '#add-normal-attack-bm':               _t('add-normal-attack', null, 'skills'),
    '#add-move-bm':                        _t('add-move', null, 'skills'),
    '#save-and-close-bm':                  _t('save-btn', null, 'skills'),
    '#clear-bm-list':                      _t('clear-list', null, 'skills'),
    '#close-bm':                           _t('close'),

    '[name=add-normal-attack-bm]':         _t('add-normal-attack', null, 'skills'),
    '[name=add-move-bm]':                  _t('add-move', null, 'skills'),
    '[name=save-and-close-bm]':            _t('save-btn', null, 'skills'),
    '[name=clear-bm-list]':                _t('clear-list', null, 'skills'),
    '[name=close-bm]':                     _t('close'),

    "#ban-reason-label":    _t('banday_reason_label'),

		"#clan-list-item-menu":           _t('clan_list', null, 'clan'),
    "#clan-official-page-item-menu":  _t('clan-official-page', null, 'clan'),
    "#clan-private-page-item-menu":   _t('clan_priv-page', null, 'clan'),
    "#clan-recruit-item-menu":        _t('clan_recruit', null, 'clan'),
    "#clan-members-item-menu":        _t('clan_members', null, 'clan'),
    "#clan-treasure-item-menu":       _t('clan_treasury', null, 'clan'),
    "#clan-manage-item-menu":         _t('clan_manage', null, 'clan'),
    "#clan-diplomacy-item-menu":      _t('clan_diplomacy', null, 'clan'),
    "#clan-history-item-menu":        _t('clan_history', null, 'clan'),
    "#clan-close-item-menu":          _t('close'),
    "#clan-skills-item-menu":         _t('clan_skills', null, 'clan'),
    "#clan-quests-item-menu":         _t('clan_quests', null, 'clan'),

    '[name=clan-list-item-menu]':             _t('clan_list', null, 'clan'),
    '[name=clan-official-page-item-menu]':    _t('clan-official-page', null, 'clan'),
    '[name=clan-private-page-item-menu]':     _t('clan_priv-page', null, 'clan'),
    '[name=clan-recruit-item-menu]':          _t('clan_recruit', null, 'clan'),
    '[name=clan-members-item-menu]':          _t('clan_members', null, 'clan'),
    '[name=clan-treasure-item-menu]':         _t('clan_treasury', null, 'clan'),
    '[name=clan-manage-item-menu]':           _t('clan_manage', null, 'clan'),
    '[name=clan-diplomacy-item-menu]':        _t('clan_diplomacy', null, 'clan'),
    '[name=clan-history-item-menu]':          _t('clan_history', null, 'clan'),
    '[name=clan-close-item-menu]':            _t('close'),
    '[name=clan-skills-item-menu]':           _t('clan_skills', null, 'clan'),
    '[name=clan-quests-item-menu]':           _t('clan_quests', null, 'clan'),

    '#match-details-title-txt' : _t('details', null, "matchmaking"), //Proponowane przedmioty nie sÄ w tej chwili dostÄpne.
    '#for-you-disabled-text' : _t('for_you_alert'), //Proponowane przedmioty nie sÄ w tej chwili dostÄpne.
    '#pre-premium-header-txt' : _t('iconstar'), // Premium
    '#for-you-txt' : _t('badged', null, 'extManager'), // Proponowane
    '#match-details-txt': _t('details_progress', null, 'matchmaking'),
    '#_t1':_t('loading_inprogress', null, 'static'), //Trwa Åadowanie gry...
    '#_t2':_t('loading_inprogress_long', null, 'static'), //JeÅ¼eli za pÃ³Å minuty gra nie zaÅaduje siÄ, naciÅnij klawisz F5
    //'#_t3new':_t('stamina_increase'), //ZwiÄksz swÃ³j zapas wyczerpania o 4 godziny:
    '#_t3':_t('stamina_renew_4h', null, 'static'), //ZwiÄksz swÃ³j zapas wyczerpania o 4 godziny:
    '#st_pay_1':_t('for_today', null, 'static'), //Na dziÅ: <b style="color:red">1SÅ</b>
    '#st_pay_2':_t('for_week', null, 'static'), //Na tydzieÅ od jutra: <b style="color:red">2SÅ</b>
    '#st_pay_8':_t('for_30days', null, 'static'), //Na 30 dni od jutra: <b style="color:red">8SÅ</b>
    '#imgload': _t('just_while...', null, 'static'),//Momencik...
    '#_t4':_t('item_drop_question', null, 'static'), //Co chcesz zrobiÄ z tym przedmiotem?
    '#_t5':_t('item_drop_throw', null, 'static'), //WyrzuciÄ*
    '#_t6':_t('item_drop_destroy', null, 'static'), //ZniszczyÄ
    '#_t7':_t('item_drop_nothing', null, 'static'), //ZniszczyÄ
    '#_t8':_t('item_throw_*info', null, 'static'), //* Wyrzucenie objÄte jest podatkiem 100 zÅota za przedmiot.
    '#opt1':_t('opt_1',null,'SettingsOptions'), //Blokuj wiadomoÅci prywatne
    '#opt6':_t('opt_6',null,'SettingsOptions'), //Blokuj pocztÄ od nieznajomych
    '#opt2':_t('opt_2',null,'SettingsOptions'), //Blokuj zaproszenia do klanu i zgÅoszenia dyplomacji
    '#opt3':_t('opt_3',null,'SettingsOptions'), //Blokuj handel z innymi graczami
    '#opt5':_t('opt_5',null,'SettingsOptions'), //Blokuj proÅby o akceptacjÄ przyjaciÃ³Å
    '#opt4':_t('opt_4',null,'SettingsOptions'), //Kiedy atakuje potwÃ³r pozwalaj wybraÄ tryb walki
    '#opt7':_t('opt_7',null,'SettingsOptions'), //WyÅÄcz chodzenie myszkÄ
    '#opt8':_t('opt_8',null,'SettingsOptions'), //WyÅÄcz efekty animacji
    '#opt9':_t('opt_9',null,'SettingsOptions'), //Nie informuj o logowaniu siÄ klanowiczÃ³w
    '#opt10':_t('opt_10',null,'SettingsOptions'), //Nie upominaj za bÅÄdy na czacie
    '#opt11':_t('opt_11',null,'SettingsOptions'), //WyÅÄcz efekty cyklu dnia i nocy
    '#opt12':_t('opt_12',null,'SettingsOptions'), //Nie przechodÅº automatycznie przez przejÅcia
    '#opt13':_t('opt_13',null,'SettingsOptions'), //Nie podÅwietlaj przedmiotÃ³w w torbie
    '#opt14':_t('opt_14',null,'SettingsOptions'), //Blokuj zaproszenia do druÅ¼yn spoza przyjaciÃ³Å i klanu.
    '#opt15':_t('opt_15',null,'SettingsOptions'),
    '#opt16':_t('opt_16',null,'SettingsOptions'), //WyÅÄcz efekty pogodowe.
    '#opt18':_t('opt_18',null,'SettingsOptions'),
    '#opt27':_t('opt_27',null,'SettingsOptions'), //WÅÄcz automatyczne zamykanie okna walki
    '#opt28':_t('opt_28',null,'SettingsOptions'), //WyÅwietlanie wiadomoÅci od wrogÃ³w
    '#opt29':_t('opt_29',null,'SettingsOptions'),
    '#opt32':_t('opt_32',null,'SettingsOptions'),
    '#b_quests|tip':_t('quests_tip', null, 'buttons'), //Aktywne questy
    '#b_clans|tip':_t('clans_tip', null, 'buttons'), //Lista klanÃ³w
    '#b_pvp|tip':_t('pvp_tip', null, 'buttons'), //Miecze: zgoda na PvP<br>Tarcza: brak zgody
    '#b_recipes|tip':_t('b_recipes', null, 'buttons'), //Miecze: zgoda na PvP<br>Tarcza: brak zgody
    '#b_config|tip':_t('config_tip', null, 'buttons'), //Konfiguracja
    '#b_map|tip':_t('map_tip', null, 'buttons'), //Minimapa Åwiata gry
    '#b_skills|tip':_t('skills_tip', null, 'buttons'), //Lista umiejÄtnoÅci
    '#b_friends|tip':_t('friends_tip', null, 'buttons'), //Lista przyjaciÃ³Å i wrogÃ³w
    '#b_addons|tip':_t('addons_tip', null, 'buttons'), //Dodatki do gry
    '#skillSwitch|tip':_t('skillset_chng', null, 'buttons'), //Kliknij aby zmieniÄ zestaw umiejÄtnoÅci
    '#bchat|tip':_t('chat_button_nfo', null, 'buttons'), //<strong>Czat - pomoc</strong><br />KlikniÄcie na nick - wiadomoÅÄ prywatna.<br />Ctrl+klikniÄcie na nick - wklejenie nicka w pole wiadomoÅci.<br /><br /><strong>Przydatne komendy:</strong><br />/r - odpowiedÅº na wiadomoÅÄ prywatnÄ<br />/g - wiadomoÅÄ dla druÅ¼yny<br />/k - wiadomoÅÄ na czacie klanowym<br />/lvl nick - sprawdzenie poziomu i profesji gracza
		'#b_news|tip':_t('news', null, 'news'),
		'#b_help|tip':_t('help_tip', null, 'buttons'),
		'#b_integration|tip':'One Night Casino',
		'#b_matchmaking|tip':_t('matchmaking'),
		'#_t9':_t('chathorror_header', null, 'static'), //Lista nieistniejÄcych wyrazÃ³w:<br><span style='color:gold'></span><br><br>Wpisz powyÅ¼szy(e) wyraz(y) poprawnie:
    '#_t10':_t('chathorror_send', null, 'static'), //WyÅlij wiadomoÅÄ z bÅÄdami
    '#_t11':_t('chathorror_cancel', null, 'static'), //Anuluj wysÅanie
    '#_t12':_t('chathorror_config', null, 'static'), //(upominanie za bÅÄdy moÅ¼na wyÅÄczyÄ w konfiguracji)
    '#_t13':_t('yt_close', null, 'static'), //zamknij
    '#_t14':_t('hide', null, 'static'), //ukryj
    '#warn|tip':_t('warn_tip', null, 'static'), //Nowa wiadomoÅÄ w konsoli
    '#bm_party|tip':_t('bm_party_tip', null, 'static'), //JesteÅ w druÅ¼ynie
    '#bm_movie|tip':_t('bm_movie_tip', null, 'static'), //Okienko z filmem
    '#bm_register|tip':_t('bm_register', null, 'ingame_register'), //Okienko z filmem
    '#new_event_calendar|tip':_t('event_calendar', null, 'event_calendar'),
    '#_t15':_t('addon_list_h2', null, 'static'), //Lista dodatkÃ³w
    '#_t16':_t('addon_list_mine', null, 'static'), //W tej chwili niedostÄpne.
    '#_t17':_t('addon_active', null, 'static'),//Edycja wÅasnego dodatku
    '#_t18':_t('addon_name', null, 'static'), //Nazwa:
    '#_t19':_t('addon_run', null, 'static'), //Uruchom:
    '#_t20':_t('addon_save', null, 'static'), //Zapisz:
    '#h1_add_active':_t('addons_active', null, 'static'), //<h2>Aktywne dodatki</h2> W tej chwili niedostÄpne.
    '#_t21':_t('addon_start_header', null, 'static'), //KrÃ³tkie wprowadzenie do dodatkÃ³w
    '#_t22':_t('addon_start_txt', null, 'static'),
    '#addon_help_txt':_t('addon_help_txt', null, 'extManager'),

    '#ad_type_txt':_t('ad_type_txt', null, 'extManager'),
    '#ad_opt_badged':_t('ad_opt_badged', null, 'extManager'),
    '#ad_opt_verified':_t('ad_opt_verified', null, 'extManager'),
    '#ad_opt_all':_t('ad_opt_all', null, 'extManager'),
    '#ad_opt_popular':_t('ad_opt_popular', null, 'extManager'),
    '#ad_opt_unverified':_t('ad_opt_unverified', null, 'extManager'),
    /*
     * Aby tworzyÄ wÅasne dodatki trzeba znaÄ jQuery, gdyÅ¼ tej biblioteki uÅ¼ywa klient Margonem.
      Do projektowania dodatkÃ³w przyda siÄ <b>konsola.</b>
      JeÅli dana komenda nie jest komendÄ konsolowÄ system traktuje jÄ jako JS.
      Przydatna bÄdzie wiÄc komenda dump sÅuÅ¼Äca do wyÅwietlania zawartoÅci zmiennych.
      Poza tym atrybut tip sÅuÅ¼y do pokazywania tzw. dymkÃ³w ponad elementami html, np. &lt;img src='...' tip='Test'&gt;.
     */
    '#pvpIndicatorsListButton|tip':_t('show_list', null, 'pklist'), //Zobacz listÄ
    '#mytr_gold|tip':_t('mytr_gold_tip', null, 'static'), //Enter akceptuje<br>Esc cofa zmianÄ
    '#au0':_t('au_auction_list', null, 'auction'), //Lista aukcji
    '#au1':_t('au_cat1', null, 'auction'), //BroÅ biaÅa jednorÄczna
    '#au2':_t('au_cat2', null, 'auction'), //BroÅ biaÅa dwurÄczna
    '#au3':_t('au_cat3', null, 'auction'), //BroÅ biaÅa pÃ³ÅtorarÄczna
    '#au4':_t('au_cat4', null, 'auction'), //BroÅ dystansowa
    '#au5':_t('au_cat5', null, 'auction'), //BroÅ pomocnicza
    '#au6':_t('au_cat6', null, 'auction'), //RÃ³Å¼dÅ¼ki magiczne
    '#au7':_t('au_cat7', null, 'auction'), //Laski magiczne
    '#au8':_t('au_cat8', null, 'auction'), //Zbroje
    '#au9':_t('au_cat9', null, 'auction'), //HeÅmy
    '#au10':_t('au_cat10', null, 'auction'),//,Buty
    '#au11':_t('au_cat11', null, 'auction'),//RÄkawice
    '#au12':_t('au_cat12', null, 'auction'),//PierÅcienie
    '#au13':_t('au_cat13', null, 'auction'),//Naszyjniki
    '#au14':_t('au_cat14', null, 'auction'),//Tarcze
    '#au15':_t('au_cat15', null, 'auction'),//Neutralne
    '#au16':_t('au_cat16', null, 'auction'),//Konsumpcyjne
    '#au21':_t('au_cat21', null, 'auction'),//StrzaÅy
    '#au22':_t('au_cat22', null, 'auction'),//Talizmany
    '#au23':_t('au_cat23', null, 'auction'),//KsiÄÅ¼ki
    '#au99':_t('au_cat99', null, 'auction'),//Eventowe
    '#_t23':_t('au_yours', null, 'auction'),//Twoje aukcje:
    '#_t24':_t('au_yours_nfo', null, 'auction'),//Aby dodaÄ nowÄ aukcje kliknij przedmiot w ekwipunku.
    '#_24_2':_t('price_th', null, 'auction'),
    '#_t25':_t('au_buynow', null, 'auction'),// Kup teraz:
    '#_t26':_t('au_time', null, 'auction'), //Czas:
    '#_t27':_t('au_limit_nfo', null, 'auction'), //PamiÄtaj, Å¼e twÃ³j limit zÅota wynosi
    '#_t28':_t('au_buynow_price', null, 'auction'), //Cena kup teraz:
    '#_t29':_t('au_sl', null, 'auction'), //SÅ.
    '#_t30':_t('au_price_info_txt', null, 'auction'), //Cena przedmiotu to 10SÅ + 1/10 poziomu przedmiotu, +20% za unikat, +50% za heroik, +200% za legendarny.Jakkolwiek gracz otrzymuje 10% tej sumy, reszta to koszty odwiÄzania.
    '#depo-txt-rent':_t('depo-txt-rent', null, 'depo'),  //Wynajem do:
    '#_t31':_t('depo_info_msg', null, 'depo'), //Koszt wynajmu depozytu na 1 miesiÄc to<br>6SÅ od 20 poziomu postaci lub 1mln zÅota od 75 poziomu.</span><br>
    '#_t32':_t('depo_next_renew', null, 'depo'), //NastÄpne przedÅuÅ¼enie do:
    '#db_txt':_t('depo-balance', null, 'depo'), //ZÅoto w depozycie:
    '#_t33|tip':_t('add_normal_attack_tip', null, 'bm'), //Dodaje zwykÅy atak do listy umiejejÄtnoÅci
    '#_t34|tip':_t('remove_all_fromlist', null, 'bm'), //Usuwa wszystkie elementy z listy
    '#_t35|tip':_t('hide_editor_panel', null, 'bm'), //Schowaj panel edytora
    '#_t36':_t('auto_skills_list', null, 'bm'), //Lista automatycznie wykonywanych umiejÄtnoÅci podczas szybkiej walki:
    '#bm_rpt_switch|tip':_t('loop_skills', null, 'bm'), //Powtarzanie umiejÄtnoÅci po wykonaniu ostatniej z listy
    '#tourbattleButton|tip':_t('tour_btn_txt', null, 'battle'), //Szybka walka (skrÃ³t - F)
    '#autobattleButton|tip':_t('auto_btn_txt', null, 'battle'), //Szybka walka (skrÃ³t - F)
    '#autobattleAllButton|tip':_t('auto_all_btn_txt', null, 'battle'), //KoÅczy walkÄ automatycznie
    '#surrenderBattleButton':_t('surrender', null, 'battle'),
    '#surrenderBattleButton|tip':_t('surrender-tip', null, 'battle'),
    '#event_calendar_switch|tip':_t('show_calendar', null, 'event_calendar'),
    '#_t37':_t('actions_head', null, 'help'),//AKCJE:
    '#_t38':_t('actions_txt', null, 'help'),

    /*  <strong>Poruszanie siÄ</strong> - lewy przycisk myszy (pojedyncze klikniÄcie lub wciÅniÄcie i przesuwanie), strzaÅki lub WSAD.<br />
        <strong>Rozmowa z mieszkaÅcem</strong> - lewy przycisk myszy na jego postaci: <i>"Rozmawiaj"</i>.<br />
        <strong>Podniesienie przedmiotu, zerwanie roÅliny</strong> - naleÅ¼y stanÄÄ na przedmiocie, lewy przycisk myszy na swojej postaci: <i>"PodnieÅ"</i>.<br />
        <strong>SprzedaÅ¼ i handel przedmiotami</strong> - lewy przycisk myszki na przedmiot w ekwipunku.<br />
        <strong>Kupno przedmiotu</strong> - lewy przycisk myszy na przedmiot w sklepie.<br />
        <strong>ZaÅoÅ¼enie przedmiotu</strong> - przeciÄgniÄcie przedmiotu w odpowiednie pole zakÅadania ekwipunku.<br />
        <strong>SpoÅ¼ycie jedzenia, mikstury</strong> - dwukrotnie lewy przycisk myszy na przedmiocie.<br />
        <strong>Pisanie nowej wiadomoÅci na czacie</strong> - Enter.<br />
        <strong>RozwiniÄcie czatu</strong> - litera C.<br /><br />
        <strong style="color:#400; font-size:16px;">WALKA:</strong><br />
        <strong>RozpoczÄcie walki</strong> - klikniecie na przeciwniku: lewy przycisk - walka turowa, prawy przycisk - walka szybka .<br />
        <strong>Atak przeciwnika</strong> - prawy przycisk myszy na przeciwniku podczas walki, tylko <i>"Walka turowa"</i>.<br />
        <strong>Krok do przodu</strong> - prawy przycisk myszy na swojej postaci podczas walki, tylko <i>"Walka turowa"</i>.<br />
        <strong>Pobranie Åupu</strong> - przycisk <i>"PotwierdÅº"</i>.<br />
        <strong>Zamykanie ekranu walki</strong> - litera Z.<br />
        <strong>Wybranie nastÄpnego przeciwnika</strong> - TAB<br />
        <strong>PoÅcigi</strong> - TAB na mapach pvp wybiera przeciwnika, klikniÄcie na nim rozpoczyna poÅcig.<br /><br />

        <strong>Masz pytanie?</strong> - <a href="http://www.margonem.pl/?task=help" target="_blank">FAQ i panel rozwiÄzywania problemÃ³w</a>.<br />
        <strong>PeÅna pomoc</strong> - <a target="_blank" href="http://pomoc.margonem.pl/index.php?a=art_show&val=1">pomoc.margonem.pl</a>
     */
    '#_t39':_t('battle_help_txt', null, 'help'),
    /**
     *W trybie walki turowej klikamy na siebie lub przeciwnika aby wybraÄ rodzaj akcji.
      <br><b>KlikniÄcie prawym przyciskiem</b> myszy powoduje wykonanie domyÅlnej akcji.
      Dla postaci wÅasnej jest to krok do przodu, dla przeciwnika jest to atak.
      <br><b>Kiedy postacie siÄ zasÅaniajÄ</b> po lewej stronie okna walki sÄ
      przeÅºroczyste sÅabo widoczne przyciski. KlikajÄc je rzÄd walczÄcych postaci
      przenosi siÄ na pierwszy plan. UÅ¼ywa siÄ tego w walkach z duÅ¼ymi potworami,
      ktÃ³re zasÅaniajÄ innych przeciwnikÃ³w.
      <br>Okno walki moÅ¼na zamknÄÄ klawiszem <b>Z</b>.
      <br>MoÅ¼na zmieniÄ rozmiar logu walki za pomocÄ klawisza <b>B</b>.
     */
    '#_t40':_t('gold_shop_head_info'),
    '#_t41':_t('add_gold_sl_au'),
    '#_t42':_t('au_price_info_txt_gold', null, 'auction'),
    '#_t43':_t('add_gold_sl_au_info'),
    '#itemWaitBox .hoverbutton|tip':_t('item_wait_info'),
    '#addon_search_div span':_t('add_search', null, 'extManager'),
    '#ah_price_special|placeholder':_t('gold_price_placeholder'),
    '#intelect-increase':_t('intelect-increase'),
    '#dexternity-increase':_t('dexternity-increase'),
    '#strength-increase':_t('strength-increase'),
    '.bag-2-slot|tip':_t('bag_space'),
    '.bag-3-slot|tip':_t('bag_space'),
    '.bag-4-slot|tip':_t('keys_bag_space'),
  };
  for(var i in list){
    var tmp = i.split('|');
    if(tmp.length == 1){
      $(tmp[0]).html(list[i]);
    }else if(tmp.length == 2){
     $(tmp[0]).attr(tmp[1], list[i]);
    }
  }
}

function getSecondLeft(time, shortForm) {
  var m = Math.floor(time / 60);
  var h = Math.floor(m / 60);
  var d = Math.floor(h / 24);

  var secondLeft = (time - m * 60);
  var minutesLeft = m - h * 60;
  var hoursLeft = h - d * 24;

  if (shortForm) {
    if (d == 0 && h == 0) return minutesLeft + 'm : ' + secondLeft + 's';
    if (d == 0)           return hoursLeft + 'h : ' + minutesLeft + 'm';
    return d + 'd : ' + hoursLeft + 'h';
  }
  return d + 'd : ' + hoursLeft + 'h : ' + minutesLeft + 'm : ' + secondLeft + 's';
}

function calculateDiffFull (s1, s2) {
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

function convertTimeToSec (time) { // time is 2d / 1h / 65m / 20s etc
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

function convertSecToTime (seconds) {
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

// vanilla js get siblings
window.siblings = el => [...el.parentElement.children].filter(children => children !== el);

window.count = (operator, a, b) => {
  switch (operator) {
    case '<': return a < b;
    case '<=': return a <= b;
    case '>': return a > b;
    case '>=': return a >= b;
    case '==': return a == b;
    case '===': return a === b;
  }
}

window.removeFromArray = (arr, el) => {
  const index = arr.indexOf(el);
  if (index > -1) {
    arr.splice(index, 1);
    return true;
  }
  return false;
}

window.arrayEquals = (array1, array2) => {
  const array1Sorted = array1.slice().sort();
  const array2Sorted = array2.slice().sort();
  return JSON.stringify(array1Sorted) === JSON.stringify(array2Sorted);
}

window.setAttributes = (el, attrs) => {
  for(const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

window.throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

window.debounce = function(callback, wait, immediate = false) {
  let timeout = null;
  return function (itemId) {
    const callNow = immediate && !timeout;
    const next = () => callback.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(next, wait);
    if (callNow) {
      next()
    }
  }
};

window.createItem = (i, tip = i.tip) => {
  // return $(`<div class="item" id="item${i.id}" ctip="t_item"></div>`).attr('tip', tip);
  return $(`<div class="item" data-type="t_item" id="item${i.id}" ctip="tip-wrapper normal-tip"></div>`).attr('tip', tip);
}

window.removeSpaces = (s) => {
  return s.replace(/\s/g,'');
};

window.removeClassStartingWith = (node, prefix) => {
  const regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
  node.className = node.className.replace(regx, '');
  return node;
}

window.roundShorten = (string) => { // for item amount/ammo - i'm not happy with that :(
  const replacer = (match, p1, p2, suffix, offset, string) => {
    if (p1.length === 3 && p2.length === 2) return `${p1}${suffix}`; //199.36k -> 199k
    if (p1.length === 2 && p2.length === 2) return `${p1}.${p2.slice(0, -1)}${suffix}`; //99.99k -> 99.9k
    return string;
  }
  return round(string,9, '.', 2).replace(/^(\d*)[.](\d*)([kmg])$/g, replacer);
};

window.createButton = (name, classes, clb = false) => {
  const buttonEl = drawSIButton(name)[0];
  buttonEl.classList.add(classes);
  if (clb) buttonEl.addEventListener('click', clb);

  return buttonEl;
};

window.checkItemsAmount = (tplId) => {
  let hItems = g.hItems;
  let amount = 0;

  for (let k in hItems) {
    let item = hItems[k];
    if (item.st > 0) continue;
    if (item.tpl != tplId) continue;

    amount += parseInt(parseItemStat(item.stat).amount);
  }

  return amount;
};

window.decodeHtmlEntities = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

window.isItemInSell = (id) => {
  if (g.shop && g.shop.id !== 0) {
    const $itemInSell = $('#shop_sell #item'+id);
    return $itemInSell.length > 0;
  }
  return false;
}

window.getClassOfItemRank = () => {
  let showItemsRanks = g.settingsOptions.isShowItemsRankOn();

  return showItemsRanks ? '' : 'nodisp';
}

window.itemRarity = {
  'common': {
    name: _t('rarity_common', null, 'item'),
    namePlural: _t('rarity_plural_common', null, 'item'),
    color: '#9da1a7',
    sort: 1,
  },
  'unique': {
    name: _t('rarity_unique', null, 'item'),
    namePlural: _t('rarity_plural_unique', null, 'item'),
    color: '#fffb00',
    sort: 2,
  },
  'heroic': {
    name: _t('rarity_heroic', null, 'item'),
    namePlural: _t('rarity_plural_heroic', null, 'item'),
    color: '#38b8eb',
    sort: 3,
  },
  'upgraded': {
    name: _t('rarity_upgraded', null, 'item'),
    namePlural: _t('rarity_plural_upgraded', null, 'item'),
    color: '#ff59af',
    sort: 4,
  },
  'legendary': {
    name: _t('rarity_legendary', null, 'item'),
    namePlural: _t('rarity_plural_legendary', null, 'item'),
    color: '#ff8400',
    sort: 5,
  },
  'artefact': {
    name: _t('rarity_artefact', null, 'item'),
    namePlural: _t('rarity_plural_artefact', null, 'item'),
    color: '#e84646',
    sort: 6,
  },
};

window.addToArrayRecord = function (a, indexToAdd, v) {
  a.splice(indexToAdd,0,v)
}

window.warningReport = function (file, method, message, optionalData) {
  optionalData = optionalData ? optionalData: '';
  console.warn(`[${file}, ${method}] ${message}`, optionalData);
};

window.errorReport = function (file, method, message, optionalData) {
  optionalData = optionalData ? optionalData: '';
  console.error(`[${file}, ${method}] ${message}`, optionalData);
}

window.configIcon = () => {
  const configIconEl = document.createElement('div');
  configIconEl.classList.add('config-icon');
  return configIconEl;
}

window.createImgStyle = function ($imgWrapper, src, cssObjNormal, cssObjBig, crazyWidth) {
  //var i = new Image();
  //i.src = src;
  //i.onload = function () {
  //  createImgStyleAfterOnload(i, $imgWrapper, src, cssObjNormal, cssObjBig, crazyWidth);
  //}
  ImgLoader.onload(
      src,
      null,
      function () {
        createImgStyleAfterOnload(this, $imgWrapper, src, cssObjNormal, cssObjBig, crazyWidth);
      }
  )
};

window.createImgStyleAfterOnload = function (imageData, $imgWrapper, src, cssObjNormal, cssObjBig, crazyWidth) {
  var $img = $imgWrapper.find('.img-avatar-correct');
  var defaultWidth = crazyWidth ? crazyWidth : 48;
  if ($img.length < 1) {
    var $imgTable = $('<div>').addClass('table-img-avatar');
    var $imgTableCell = $('<div>').addClass('table-cell-img-avatar');
    $img = $('<div>').addClass('img-avatar-correct');
    $imgTableCell.append($img);
    $imgTable.append($imgTableCell);
    $imgWrapper.append($imgTable)
  }

  var bckStyleOld = $img.css('background-image');
  var bckStyleNew = 'url("' + src + '")';
  if (bckStyleOld == bckStyleNew) return;

  var w = imageData.width / 4;
  var h = imageData.height / 4;

  if (cssObjNormal && isset(cssObjNormal.sprite) && !cssObjNormal.sprite) {
    w = imageData.width;
    h = imageData.height;
  }

  $img.css('background-image', bckStyleNew);
  $img.css('background-size', '');

  if (w > defaultWidth) {
    $img.css('background-size', '400% 400%');
    if (cssObjBig) $img.css(cssObjBig);
  } else {
    $img.width(w);
    $img.height(h);
  }
  if (h < 48 && !cssObjNormal) return;
  if (cssObjNormal) {
    if (parseInt(cssObjNormal.width) > w) cssObjNormal.width = w + 'px';
    if (parseInt(cssObjNormal.height) > h) cssObjNormal.height = h + 'px';
    $img.css(cssObjNormal);
  }
};

window.checkInputValIsEmptyProcedure = (v, _alertText) => {
  let empty = checkValIsEmpty(v);
  if (!empty) return false;

  sendEmptyAlertText(_alertText);
  return true;
}

window.checkParsePriceValueIsCorrect = (v) => {
  let nan = isNaN(v);

  //if (nan) mAlert("Incorrect money val!");
  if (nan) mAlert(_t("split_bad_value", null, 'item'));

  return !nan
};

window.checkInputValIsEmptyProcedure = (v, _alertText) => {
  let empty = checkValIsEmpty(v);
  if (!empty) return false;

  sendEmptyAlertText(_alertText);
  return true;
}

window.isSeptemberEnd = () => {
  const targetDate = new Date(2023, 8, 30, 23, 0, 0); // Month is zero-based (8 is September).
  const now = new Date();
  return now > targetDate;
}

window.checkBetterItemClass = (items, targetItem) => {
  if (Array.isArray(items)) {
    for (const itemId of items) {
      const i = g.item[itemId];
      if (isset(i) && i.itemTypeSort > targetItem.itemTypeSort) return true;
    }
  } else {
    if (items.itemTypeSort > targetItem.itemTypeSort) return true;
  }

  return false;
}

window.checkReducedRequirementItems = (items) => {
  if (Array.isArray(items)) {
    for (const itemId of items) {
      const i = g.item[itemId];
      if (isset(i) && isset(parseItemStat(i.stat)["lowreq"])) return true;
    }
  } else {
    if (isset(parseItemStat(items.stat)["lowreq"])) return true;
  }

  return false;
}

window.checkEnhancedItems = (item) => {
  if (Array.isArray(item)) {
    for (const itemId of item) {
      const i = g.item[itemId];
      if (isset(i) && isset(parseItemStat(i.stat)["enhancement_upgrade_lvl"])) return true;
    }
  } else {
    if (isset(parseItemStat(item.stat)["enhancement_upgrade_lvl"])) return true;
  }

  return false;
}

window.checkPersonalItems = (item) => {
  if (Array.isArray(item)) {
    for (const itemId of item) {
      const i = g.item[itemId];
      if (isset(i) && isset(parseItemStat(i.stat)["personal"])) return true;
    }
  } else {
    if (isset(parseItemStat(item.stat)["personal"])) return true;
  }

  return false;
}

window.enhancedItemConfirm = (clb) => {
  const
    info = _t('enhanced-item-confirm');

  mAlert(info, 1, [
    () => clb(),
    () => {}
  ]);
}

window.enhancedItemConfirmIfNeeded = (item, callback) => {
  if (checkEnhancedItems(item)) {
    enhancedItemConfirm(callback);
    return;
  }
  callback();
}

const checkValIsEmpty = (v) => {
  return String(v).trim() === '';
}

const sendEmptyAlertText = (_alertText) => {
  // let alertText = _alertText ? _alertText : 'Nie wpisano Å¼adnej wartoÅci!';
  let alertText = _alertText ? _alertText : _t('No_value_was_entered!');
  mAlert(alertText);
}

window.setTipWhenNameToLong = function ($el, tip) {
  if ($el[0].scrollWidth > Math.round($el.innerWidth())) $el.tip(parseBasicBB(tip));
  else $el.tip();
};

window.isTestWorld = () => {
  const testWorlds = ['dev', 'tabaluga', 'experimental'];
  return testWorlds.includes(g.worldConfig.getWorldName());
}

function getCurrencyIcon(val) {
  return '';
}