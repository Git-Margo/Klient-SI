/* Margonem chat by Thinker */
//function setupChat()
//{
//    $('#chat S').click(pushChatButton);
//    $('#chb0').addClass('choosen');
//    showChat(g.chat.state);
//    $('#inpchat').val('');
//    $('#inpchat').blur(function(e){
//        if(!g.chat.write)return;
//        $('#inpchat').fadeOut('fast');
//        $('#lastmsg').fadeIn('fast');
//        g.chat.write=false;
//    }).focus(function(e){
//        $('#lastmsg').fadeOut('fast');
//        $('#inpchat').fadeIn('fast');
//    });
//    $('#bottxt').click(startChatWrite);
//    $('#chathorror INPUT').keypress(function(e){
//        if(e.which==13) chatHorrorCheck();
//    });
//    addScrollbar('chattxt', g.chat.state==3?255:500, 'chatscrollbar', true);
//    chatScrollbar('chattxt', g.chat.state==3?255:500, 'chatscrollbar');
//    $('#chattabs').click(function(){
//        chatScrollbar('chattxt', g.chat.state==3?255:500, 'chatscrollbar');
//    });
//    $('body').click( function(e){
//        if(e.target.nodeName!='INPUT' && e.target.id != 'lastmsg' )$('#inpchat').blur();
//    });
//		$('body').bind('contextmenu', function(e){
//			if(e.target.nodeName!='INPUT' && e.target.id != 'lastmsg' ) {
//				var $t = $(e.target);
//				if (!isset($t.attr('c_nick'))) return;
//				var nick = $t.attr('c_nick');
//				if (nick == hero.nick) return;
//				var u = hero.uprawnienia;
//				if (u == 0) return;
//				e.preventDefault();
//				g.mCAddon.update(nick);
//				if (u == 4 || u == 16) g.sMCAddon.update(nick)
//			}
//		});
//    $('#bottombar').click(function(){
//        $('#inpchat').show(1, function(){$(this).focus()});
//    });
//}
//function chatScroll(dtop) {
//    $("#chattxt").scrollTop($("#chattxt").prop("scrollHeight"));
//}
//function chatSendMsg(ic)
//{
//    ic=$.trim(ic);
//    if(ic=='/cls') _g('chat&tab='+g.chat.tab, { c: '/cls'});
//    else
//    if(ic!='') {
//        if(ic==g.chat.lastwrite && ic.charAt(0)!='/') mAlert(_t('dont_repeat_msg', null, 'chat')); //'Nie powtarzaj wiadomoÅci.'
//        else if(ts()-g.chat.lastmyts<1500) mAlert(_t('dont_write_so_fast', null, 'chat')); //'Nie pisz tak szybko.'
//        else chatSend(ic);
//        g.chat.lastwrite=ic;
//        //log('chatspeed: '+(ts()-g.chat.lastmyts));
//        g.chat.lastmyts=ts();
//    }
//    $('#lastmsg').remove();
//    $('#inpchat').blur();
//    setTimeout(function(){
//        $('#inpchat').val('');
//    },500);
//
//}

//function startChatWrite()
//{
//    tutorialStart(14);
//    g.chat.write=true;
//    var val='';
//    switch(g.chat.tab) {
//        case 1:
//            val= _l() == 'pl' ? '/k ' : '/g';
//            break;
//        case 2:
//            val=_l() == 'pl' ? '/g ' : '/p';
//            break;
//        case 3:
//            if(g.chat.lastnick!='') val='@'+g.chat.lastnick.split(' ').join('_')+' '; else val='@';
//            break;
//    }
//    var $ic=$('#inpchat');
//    if($ic.val()=='') $ic.val(val).show(1, function(){$(this).focus()}); else $ic.show(1, function(){$(this).focus()});
//    chatScrollbar('chattxt', g.chat.state==3?255:500, 'chatscrollbar');
//}
//function toggleChat() {
//    g.chat.state++;
//    if (g.chat.state>=4) g.chat.state=0;
//    showChat(g.chat.state)
//}
//function showChat(y){
//
//    //if (newChatMode) if (g.chatController) g.chatController.getChatWindow().setChatState(g.chat.state)
//
//    if (y==3 && $(window).width() < 1068){
//        return showChat(0);
//    }
//    switch(parseInt(y)){
//        case 1:
//            $('#chat').height(90).show();
//            if(window.opera) $('#chattxt').height(68);
//            $('#youtube').height(512-90+3);
//            chatScroll(-1);
//            $('#mailnotifier').fadeTo(100, 0.5);
//            $('#chatMoveHandler').css({display:'block'});
//            $('#pvpStatMainBox').css({top:416});
//            break;
//        case 2:
//            $('#chat').height(160).show();
//            if(window.opera) $('#chattxt').height(138);
//            $('#youtube').height(512-160+3);
//            chatScroll(-1);
//            $('#mailnotifier').fadeTo(100, 0.5);
//            $('#chatMoveHandler').css({display:'block'});
//            $('#pvpStatMainBox').css({top:346});
//            if (getCookie('battleLogSize') == 'big') toggleBattleLog();
//            break;
//        case 3:
//            makeChatLeft();
//            $('#mailnotifier').fadeTo(100, 1);
//            $('#youtube').height(512);
//            $('#pvpStatMainBox').css({top:503});
//            break;
//        case 0:
//            makeChatRight();
//            $('#chat').hide();
//            $('#mailnotifier').fadeTo(100, 1);
//            $('#pvpStatMainBox').css({top:503});
//            $('#youtube').height(512);
//            break;
//    }
//    g.chat.state=y;
//    setCookie('cy',y);
//    map.resizeView();
//    reCenter();
//}

//function pushChatButton(e)
//{
//    if(isset(e.n)) n=e.n;
//    else n=parseInt($(e.target).attr('id').substr(3));
//    $('#chb'+g.chat.tab).removeClass('choosen');
//    $('#chat S:eq('+n+')').addClass('choosen').removeClass('newmsg');
//    var $container = $('#chattxt');
//    $container.empty();
//    for(var t in g.chat.tabs[n]) {
//      $container.append(g.chat.tabs[n][t].clone(true, true));
//    }
//    g.chat.tab=n;
//    $('#inpchat').val('');
//    chatScroll(-1);
//}

//function chatSend(ic) {
//  if(!parseChatCommand(ic)) _g('chat',{c:ic});
//}
//function parseChatCommand(msg){
//    if(msg.substr(0,1) != '/') return false;
//    var tmp = msg.split(' ');
//    if(tmp.length > 1){
//        switch(tmp[0]){
//            case '/ban':
//                if(!(hero.uprawnienia&4)) return true;
//                var days = [1,3,7,14,30];
//                var nick = msg.substr(5);
//                var html = '<div style="font-weight:bold">'+_t('bandays_amount for %name%', {'%name%': nick})+'</div>';
//                html += '<div style="margin:10px 0px; text-align:center">';
//                for(var i=0; i<days.length; i++){
//                    html += '<div class="banday_row"><div class="radio_check" id="banday_'+days[i]+'"></div> <label for="banday_'+days[i]+'">'+days[i]+'</label></div>';
//                }
//                html += '<div class="banday_row"><div class="radio_check" id="banday_custom"></div> <label for="banday_custom"><input id="custom_banday_value" style="width:30px;" /></label></div>';
//                html += '</div>';
//                html += '<div style="text-align:center; margin-bottom:10px;"><label for="banday_reason">'+_t('banday_reason_label')+'</label><br /><input style="width:350px;" id="banday_reason" /></div>';
//                mAlert(html, 1, [function(){
//                    var type = $('.radio_check.active').length ? $('.radio_check.active').attr('id').substr(7) : null;
//                    if(typeof(type) != 'undefined') type;
//                    var amount = type == 'custom' ? $('#custom_banday_value').val() : type;
//                    if(!isNaN(parseInt(amount)) && $('#banday_reason').val().length >= 10){
//                        //console.log('gm&a=ban&nick='+nick+'&days='+amount+'&reason='+$('#banday_reason').val())
//                        _g('gm&a=ban&nick='+nick+'&days='+amount+'&reason='+$('#banday_reason').val());
//                    }else{
//                        setTimeout(function(){
//                            mAlert(_t('banday_wrong_values_error'));
//                        }, 200);
//                    }
//                }], 'question');
//                $('.banday_row').click(function(){
//                    $('.radio_check').removeClass('active');
//                    $(this).find('.radio_check').addClass('active');
//                    $(this).find('input').focus();
//                });
//                return true;
//                break;
//        }
//    }
//    return false;
//}
//function chatHorrorCheck()
//{
//    if(g.chat.cor==$('#chathorror INPUT').val()) {
//        $('#chathorror').fadeOut();
//        var cor=g.chat.cor.split(' '),  mis=g.chat.mis.split(' '), bad=g.chat.bad;
//        for(var k in mis) {
//            var re=new RegExp('([ ,.-])'+mis[k]+'([ .,-])','gi');
//            bad=bad.replace(re, "$1"+cor[k]+"$2");
//        }
//        if(ts()-g.chat.lastmyts<1500) mAlert(_t('dont_write_so_fast', null, 'chat'));
//        else {
//            g.chat.lastmyts=ts();
//            _g('chat', { c: esc($.trim(bad)) });
//        }
//    } else {
//        mAlert('PrÃ³buj ponownie. PamiÄtaj, Å¼e trzeba uÅ¼ywaÄ polskich znakÃ³w,'
//        +'<br>miÄdzy wyrazami muszÄ byÄ wyÅÄcznie spacje,<br>a kolejnoÅÄ wyrazÃ³w musi byÄ taka jak wymieniona.');
//        $ch.find('INPUT').val('').focus();
//    }
//}
//function chatSendBad()
//{
//    if(ts()-g.chat.lastmyts<1500) mAlert(_t('dont_write_so_fast', null, 'chat'));
//    else {
//        g.chat.lastmyts=ts();
//        _g('chat', { c: esc($.trim(g.chat.bad)) });
//        $('#chathorror').fadeOut();
//    }
//}

function goToUrl(url, safe)
{
  var safeUrl = escapeHTML(url);
  if (safe) {
      let wnd       = window.open(url);
      wnd.opener    = null;
      return
  }

  mAlert(_t('url_chat_warning %url%', {'%url%':'<span class="link">'+safeUrl+'</span>'}), 2,
    [ function(){
        var wnd     = window.open(url);
        wnd.opener  = null;
    }, function(){}]
  );
}

//function showMovie(url, hidden)
//{
//    var u1=url.split('v='),u2=u1[1].split('&');
//    var url2 = 'http://www.youtube.com/v/'+u2[0];
//    $('#youtube CENTER').html(
//        '<object width="480" height="385"><param name="movie" value="'+url2
//        +'&autoplay=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param>'
//        +'<embed src="'+url2+'&autoplay='+(isset(hidden) ? '0' : '1')+'" type="application/x-shockwave-flash" allowscriptaccess="always" '
//        +'allowfullscreen="true" width="480" height="385"></embed></object>');
//    $('#youtube').css({
//        left:0
//    });
//    if (!isset(hidden)) $('#youtube').fadeIn();
//    else{$('#youtube').css({left:-512}).show();}
//    setCookie('ytm', encodeURIComponent(url));
//}
//function hideMovie()
//{
//    $('#youtube').fadeOut(function(){
//        $('#youtube CENTER').empty()
//    });
//    deleteCookie('ytm');
//}

//function minimizeMovie()
//{
//    $('#youtube').animate({
//        left:-512
//    },500);
//    $('#bm_movie').fadeIn();
//}
//function maximizeMovie()
//{
//    $('#youtube').animate({
//        left:0
//    },500);
//    $('#bm_movie').fadeOut();
//}

//function chatTextWithHeroNick(ret, text) {
//    var re = new RegExp('^'+hero.nick+' | '+hero.nick+' | '+hero.nick+'$|^'+hero.nick+'$', 'ig');
//  var tab = text.split(re);
//    let newTab = [];
//
//    for (let k in tab) {
//        let text = tab[k];
//        newTab.push(createTextNodeOrSpanLinkedItem(text));
//    }
//
//  var $hero = $('<b>').addClass('yourname').text(hero.nick);
//  for (var t=0;t<newTab.length;t++) {
//
//      appendTextToColorChatMsg(ret, newTab[t]);
//
//      //ret.append(tab[t]);
//
//    let isLast = t == newTab.length - 1;
//    if (isLast) ret.append(newTab[newTab.length - 1]);
//    else {
//      ret.append(document.createTextNode(' '));
//      ret.append($hero.clone());
//      ret.append(document.createTextNode(' '));
//    }
//  }
//  //ret.append(newTab[newTab.length - 1]);
//}

//function appendTextToColorChatMsg (ret, obj) {
//    let isArray = Array.isArray(obj);
//
//    if (isArray) {
//
//        for (let k in obj) {
//            ret.append(obj[k]);
//        }
//
//    } else ret.append(obj);
//
//};

//function createChatURL(o) {
//  //TODO change text for links to forum/youtube np. 'forum, temat=XXX'
//  var url = o.toObject('https');
//  var $u = $("<u>");
//  $u.addClass('link');
//
//  $u.click(function(){
//    goToUrl(url.href);
//  });
//  $u.text(url.href);
//  return $u;
//}

//function checkCorrectlyURL(url) {
//  var rx = /^(?:(https?:\/\/)|(www\.))/i;
//  return rx.test(url);
//}

//function parseChatText(obj) {
//  var ret = $('<span>');
//  ret.addClass('chatmsg')
//  var entertown = obj.s =='entertown';
//  if(obj.s == 'sys_info' || obj.s == 'sys_red') {
//    var html = parseChatBB(obj.t);
//    if (!entertown && obj.t.indexOf('url') == -1) {
//      var re = new RegExp('^'+hero.nick+' | '+hero.nick+' | '+hero.nick+'$|^'+hero.nick+'$', 'ig');
//      html = html.replace(re, ' <b class="yourname">'+hero.nick+'</b> ');
//    }
//
//      let messageHaveLinkedItem = checkReceiveMessageHaveLinkedItem(html, true);
//
//      if (messageHaveLinkedItem) ret.append(createTextNodeOrSpanLinkedItem(html, true, true));
//      else 						 ret.append(html);
//
//    //ret.append(html);
//  } else {
//    if (!isset(window.linkify)) {
//      var text = obj.t;
//      if (!entertown) {
//        chatTextWithHeroNick(ret, text);
//      } else {
//        ret.append(document.createTextNode(text));
//      }
//    } else {
//      var tokens = linkify.tokenize(obj.t);
//      for (var t in tokens) {
//        var o = tokens[t];
//        var text = o.toString();
//        if (o.type == 'url' && checkCorrectlyURL(text)) {
//          ret.append(createChatURL(o));
//        } else {
//          if (!entertown) {
//            chatTextWithHeroNick(ret, text);
//          } else {
//            ret.append(document.createTextNode(text));
//          }
//        }
//      }
//    }
//  }
//  return ret;
//}

//let KIND_LINKED_ITEM = {
//  ITEM  : "ITEM",
//  TPL   : "TPL"
//};
//
//const createShortLinkedItemSpan = (kindLinkedItem, hid, name) => {
//  let $span       = $('<span>');
//
//  name        = escapeHTML(name, true);
//
//  $span.html(`[${name}]`);
//  $span.addClass('linked-chat-item');
//
//  return $span;
//}

//function createLinkedItemSpan (str, index, myArray, escStringMode) {
//    let text        = myArray[0];
//    let params      = text.split(":");
//
//
//  let valToReplaceAll = escStringMode ? '&quot;' : '"';
//  let name            = params[1].replaceAll(valToReplaceAll, '');
//
//
//    let $span       = $('<span>');
//
//    name        = escapeHTML(name, true);
//
//    $span.html(name);
//    $span.addClass('linked-chat-item');
//
//    return $span[0];
//};

//const parseReceiveMessageWithLinkedItem = (str, escStringMode) => {
//
//  let kindLinkedItem = getKindLinkedItem(str, escStringMode);
//
//  if (kindLinkedItem == null) return;
//
//  let data          = getPrepareDataToCreateElementsArray(str, kindLinkedItem, escStringMode);
//  let elementsArray = getArrayWith$spanTextAnd$linkedItems(kindLinkedItem, data.htmlString, data.itemsData);
//
//  return elementsArray;
//};


//const getKindLinkedItem = (str, escStringMode) => {
//
//  let isItemLinkedItem = checkIsItemLinkedItem(str, escStringMode);
//  let isTplLinkedItem = checkIsTplLinkedItem(str, escStringMode);
//
//  if (isItemLinkedItem) return KIND_LINKED_ITEM.ITEM;
//  if (isTplLinkedItem)  return KIND_LINKED_ITEM.TPL;
//
//  console.error('ChatLinkedItemsManager', 'getKindLinkedItem', 'not find KindLinkedItem in string!', str);
//
//  return null;
//};

//const getPrepareDataToCreateElementsArray = (str, kindLinkedItem, escStringMode) => {
//  let myRe        = getReceiveMessagePattern(kindLinkedItem, escStringMode);
//  let lengthStr   = str.length;
//  let counter     = 0;
//  let lastIndex   = 0;
//  let htmlString  = [];
//  let itemsData   = [];
//  let myArray;
//
//  while ((myArray = myRe.exec(str)) !== null) {
//
//    let index = myArray.index;
//
//    if (lastIndex < index) {
//      let text = str.substr(lastIndex, index - lastIndex);
//
//      htmlString.push(createTxtSpanString(text));
//      itemsData.push(getItemData(str, kindLinkedItem, index, myArray, escStringMode));
//      htmlString.push(createItemSpanString(counter));
//
//    } else {
//      itemsData.push(getItemData(str, kindLinkedItem, index, myArray, escStringMode));
//      htmlString.push(createItemSpanString(counter));
//    }
//
//    counter++;
//
//    lastIndex = myArray.index + myArray[0].length;
//  }
//
//  if (lastIndex != lengthStr) {
//    let text = str.substr(lastIndex, lengthStr - 1);
//
//    htmlString.push(createTxtSpanString(text));
//  }
//
//  return {
//    htmlString,
//    itemsData
//  }
//};

//const getArrayWith$spanTextAnd$linkedItems = (kindLinkedItem, allText, itemsData) => {
//  let $join         = $('<div>' + allText.join('') + '</div>');
//  let elementsArray = [];
//
//  for (let i in itemsData) {
//    let d   = itemsData[i];
//    let $el = createShortLinkedItemSpan(kindLinkedItem, d.hid, d.name);
//
//    $join.find('.item-'+ i).replaceWith($el);
//  }
//
//  $join.children().each(function () {
//    elementsArray.push($(this));
//  });
//
//  return elementsArray;
//};

//const createTxtSpanString = (text) => {
//  return `<span class="text">${text}</span>`
//};
//
//const createItemSpanString = (counter) => {
//  return `<span class="item-${counter}"></span>`
//};
//
//
//const getItemData = (str, kindLinkedItem, index, myArray, escStringMode) => {
//  let text    = myArray[0];
//  let params  = text.split(":");
//  //let hid     = params[0].replace("ITEM#", '');
//  let hid     = params[0].replace(kindLinkedItem + "#", '');
//
//  let valToReplaceAll = escStringMode ? '&quot;' : '"';
//  let name            = params[1].replaceAll(valToReplaceAll, '');
//
//  return {
//    name:name,
//    hid:hid
//  }
//};

//function createTextNodeOrSpanLinkedItem(text, escStringMode, unsecure) {
//    let receiveMessageHaveLinkedItem = checkReceiveMessageHaveLinkedItem(text, escStringMode)
//
//    if (receiveMessageHaveLinkedItem) {
//        return parseReceiveMessageWithLinkedItem(text, escStringMode, unsecure);
//    } else {
//        return document.createTextNode(text);
//    }
//}

//const checkReceiveMessageHaveLinkedItem = (str, escStringMode) => {
//  let isItemLinkedItem  = checkIsItemLinkedItem(str, escStringMode);
//  let isTplLinkedItem   = checkIsTplLinkedItem(str, escStringMode);
//
//  return isItemLinkedItem || isTplLinkedItem;
//};
//
//const checkIsItemLinkedItem = (str, escStringMode) => {
//  return checkLinkedItemByKind(KIND_LINKED_ITEM.ITEM, str, escStringMode);
//};
//
//const checkIsTplLinkedItem = (str, escStringMode) => {
//  return checkLinkedItemByKind(KIND_LINKED_ITEM.TPL, str, escStringMode);
//};
//
//const checkLinkedItemByKind = (kindLinkedItem, str, escStringMode) => {
//  let re  = getReceiveMessagePattern(kindLinkedItem, escStringMode);
//
//  return re.exec(str) ? true : false
//};

//const isTplLinkedItem = (str, escStringMode) => {
//  let itemRe  = getReceiveMessagePattern(KIND_LINKED_ITEM.TPL, escStringMode);
//
//  return itemRe.exec(str) ? true : false
//};
//
//const getReceiveMessagePattern = (kindLinkedItem, escStringMode) => {
//  let myRe;
//
//  if (escStringMode)  myRe = new RegExp(kindLinkedItem + `#([0-9]+):(\&quot;.*?&quot;)`, "g");
//  else                myRe = new RegExp(kindLinkedItem + `#([0-9]+):(\".*?")`, "g");
//
//  //if (escStringMode) 	myRe = /ITEM#([0-9]+):(\&quot;.*?&quot;)/g;
//  //else				myRe = /ITEM#([0-9]+):(\".*?")/g;
//
//  return myRe;
//};

//function updateChatLastMsg() {
//  if (g.chat.lastMsg === null || g.chat.write)
//    return;
//  var chloc = ['', _t('[K]', null, 'chat'), _t('[G]', null, 'chat'), _t('[P]', null, 'chat')];
//  var $lastMsg = $('<div>');
//  $lastMsg.attr('id', 'lastmsg');
//  var kind = document.createTextNode(chloc[g.chat.lastMsg.kind]);
//  $lastMsg.append(kind);
//  $lastMsg.append(g.chat.lastMsg.$el.children().clone());
//
//  $('#bottxt').empty().append($lastMsg);
//  if (!g.chat.write)
//    $('#lastmsg').fadeIn();
//}

//function getChatStyleMsg(obj) {
//  if (obj.n != '' && obj.k == 3 && obj.n != hero.nick && obj.n != 'System') {
//    return 'priv2';
//  }
//  if (obj.s == '') {
//    if (obj.k == 1)
//      return 'clant';
//    if (obj.k == 2)
//      return 'team';
//    if (obj.k == 3)
//      return 'priv';
//  }
//  return obj.s;
//}

//function getChatInfoMsg(obj) {
//  if (obj.n != '') {
//    if (obj.k == 3) {
//      return 'Â«' + obj.n + ' -> ' + obj.nd + 'Â» ';
//    } else {
//      return obj.n2 = 'Â«' + obj.n + 'Â» ';
//    }
//  } else {
//    return '';
//  }
//  return obj.n2;
//}

//function testHaxDomain(txt) {
//  var hax_domains = [
//    'margcnem.pl',
//    'margonem.tl.pl',
//    'marg0nem.pl',
//    'margonem.esy.es',
//    'margonem.eeu.pl',
//    'margoncm.pl',
//    'margonem.hol.es'
//  ];
//
//  for (var k in hax_domains) {
//    if (txt.search(hax_domains[k]) >= 0)
//      return true;
//  }
//  return false;
//}
//
//function displayChatMsg($el, obj) {
//  //add to own tab and general
//  g.chat.tabs[obj.k].push($el);
//  if (obj.k != 0)
//    g.chat.tabs[0].push($el.clone(true, true));
//  if (obj.ts > g.chat.ts)
//    g.chat.ts = obj.ts;
//  if (obj.k == g.chat.tab || g.chat.tab == 0)
//    $('#chattxt').append($el.clone(true, true));
//}

//function oneChatMsg(obj) {
//  var $el = $('<div>');
//  var $info = $('<span>');
//  var $text = parseChatText(obj);
//  var style = getChatStyleMsg(obj);
//  var infoTxt = getChatInfoMsg(obj);
//  $el.append($info);
//  $el.append($text);
//  $el.addClass(style);
//  $info.text(infoTxt);
//  if (g.chat.tab == 0 && isset(obj.fr) && obj.fr == 1) {
//    $info.addClass('fr');
//  }
//  if (obj.n != '' && obj.n != 'System') {
//    var cNick = obj.n;
//    if (cNick == hero.nick && isset(obj.nd)) {
//      cNick = obj.nd;
//    }
//    $info.addClass('chnick');
//    $info.attr('tip', ut_time(obj.ts));
//    $info.attr('c_nick', cNick);
//  }
//  displayChatMsg($el, obj);
//  return $el;
//}

//function updateChatNewMsg(notReadTabs) {
//  if (!g.chat.init) {
//    g.chat.init = 1;
//    return;
//  }
//  for (var k in notReadTabs) {
//    if (g.chat.tab != k)
//      $('#chb' + k).addClass('newmsg');
//  }
//}

//function hasIgnoreChatMsg(obj) {
//  for (var k in g.chat.parsers)
//    if (g.chat.parsers[k](obj))
//      return true;
//  if (testHaxDomain(obj.t))
//    return true;
//  return false;
//}

//function newChatMsg2(dc) {
//  var left = g.chat.state == 3 ? 255 : 500;
//  var ch = [];
//  for (var k in dc)
//    ch[parseInt(k)] = dc[k];
//  g.ch = ch;
//  if (ch[0].ts > g.chat.ts) {
//    var notReadTabs = [];
//    var lastMessageFromHero = ch[ch.length - 1].n == hero.nick;
//    for (var i = ch.length - 1; i >= 0; i--) {
//      var obj = ch[i];
//      if(hasIgnoreChatMsg(obj))
//        continue;
//      g.chat.lastMsg = {kind: obj.k, $el: oneChatMsg(obj)};
//      if (obj.k == 3 && obj.n != hero.nick && obj.n != 'System') {
//        g.chat.lastnick = obj.n;
//      }
//      if (!lastMessageFromHero) {
//        notReadTabs[obj.k] = true;
//      }
//    }
//    chatScroll(-1);
//    updateChatLastMsg();
//    updateChatNewMsg(notReadTabs);
//  }
//  chatScrollbar('chattxt', left, 'chatscrollbar');
//}

//newChatMsg = newChatMsg2;

function removeScrollbar(id, handleId){
    $('#'+handleId).remove();
    $('#'+id).unbind('mousewheel');
}
function addScrollbar(id, left, handleId, scrollToBottom)
{
    if ($('#'+handleId).length){
        $('#'+handleId).remove();
        $('#'+id).unbind('mousewheel');
    }
    var $el= $('#'+id).css({
        'overflow': 'hidden'
    });
    var elH=$el.prop('scrollHeight');
    var barH=Math.max(15,parseInt($el.height()*$el.height()/parseFloat(elH)));
    $('<div></div>')
        .css({
            position:'absolute',
            top:$el.position().top+'px',
            left:left+'px',
            width:'10px',
            height:barH+'px'
        })
        .draggable({
            axis: 'y',
            appendTo: 'body',
            drag: function(){
                $el = $('#'+id);
                var elH=$el.prop('scrollHeight');
                if(elH <= $el.height()){
                    $(this).css({
                        height: $el.height()+'px',
                        visibility: 'hidden'
                    });
                    // $(this).data('draggable').containment= [left,$el.offset().top,left,$el.offset().top];
                    $(this).draggable("option", "containment", [left,$el.offset().top,left,$el.offset().top]);
                    return;
                }
                var barH=Math.max(15,parseInt($el.height()*$el.height()/parseFloat(elH)));
                $(this).css({
                    height: barH+'px'
                });
                if($el.height()-barH == 0 ) return;
                $el.scrollTop((elH-$el.height())*parseFloat(parseFloat($(this).position().top-$el.position().top)/parseFloat($el.height()-barH)));
                // $(this).data('draggable').containment= [left,$el.offset().top,left,$el.offset().top+$el.height()-barH];
                $(this).draggable("option", "containment", [left,$el.offset().top,left,$el.offset().top+$el.height()-barH]);
                if($(this).position().top-$el.position().top == $el.height()-barH )
                    $(this).attr('on_bottom', '1');
                else
                    $(this).attr('on_bottom', '0');
            }
        })
        .attr('id', handleId)
        .attr('on_bottom', scrollToBottom ? '1' : '0')
        .appendTo(((handleId=='chatscrollbar'&&g.chat.state==2)?$el.parent().parent():$el.parent()));
    //$('#'+id).bind('mousewheel', function(event, delta){
    //    var $el= $('#'+id);
    //    if($el.prop('scrollHeight' )<= $el.height()) return;
    //
    //    $('#'+handleId).css('top', $('#'+handleId).position().top - delta * 10);
    //    if (delta > 0)
    //        $('#'+handleId).attr('on_bottom', '0');
    //    chatScrollbar(id, left, handleId);
    //});
}
function chatScrollbar(id, left, handleId)
{
    var $el= $('#'+id), $bar = $('#'+handleId);
    if( $el.position() == null ) return;
    var elH=$el.prop('scrollHeight');
    if(elH <= Math.round($el.outerHeight())){
        $bar.css({
            height: $el.height(),
            top: $el.position().top
        });
        if(isset($bar.data('uiDraggable')))
            $bar.draggable("option", "containment", [left,$el.offset().top,left,$el.offset().top]);
            // $bar.data('draggable').containment=[left,$el.offset().top,left,$el.offset().top];
        $bar.css({
            top: $el.position().top,
            visibility: 'hidden'
        });
        $el.scrollTop($el.offset().top);
        return;
    }
    $bar.css({
        visibility: 'visible'
    });
    var barH=Math.max(15,parseInt($el.height()*$el.height()/parseFloat(elH)));
    $bar.css({
        height: barH
    });
    //log($el.height()+' '+barH+' '+ $el.position().top+' '+$el.offset().top);
    if ($bar.attr('on_bottom') == '1') {
        $bar.css({
            'top': $el.height() - barH + $el.position().top
        });
    }
    if($el.position().top>$bar.position().top)
        $bar.css('top', $el.position().top);
    if($el.height()-barH == 0 ) return;
    $el.scrollTop((elH-$el.height())*parseFloat(parseFloat($bar.position().top-$el.position().top)/parseFloat($el.height()-barH)));
    // $bar.data('draggable').containment= [left,$el.offset().top,left,$el.offset().top+$el.height()-barH];
    $bar.draggable("option", "containment", [left,$el.offset().top,left,$el.offset().top+$el.height()-barH]);
    if($bar.position().top-$el.position().top >= $('#'+id).height()-barH )
        $bar.attr('on_bottom', '1');
}

//function makeChatLeft(){
//    $('#chat').detach().appendTo('body').css({width:'',height:'',display:'block',top:$('#centerbox').offset().top,left:$('#centerbox').offset().left-276}).addClass('left');
//    var chatTxtContainer = $(document.createElement('div')).css({padding:'4px 20px 3px 5px'}).attr('id', 'chatTxtContainer');
//    $('#chattxt').detach().appendTo(chatTxtContainer).css({height:503});
//    $('#chat').append(chatTxtContainer);
//    $('#chatscrollbar').css({left:256});
//    chatScrollbar('chattxt', g.chat.state==3?255:500, 'chatscrollbar');
//    chatScroll(-1);
//}

//function makeChatRight(){
//    $('#chat').detach().appendTo('#centerbox').css({width:512,bottom:25,left:0,top:'auto'}).removeClass('left');
//    $('#chattxt').detach().appendTo('#chat');
//    $('#chatTxtContainer').remove();
//    $('#chattxt').css({padding:'',height:''});
//    $('#chatscrollbar').css({left:500});
//    chatScrollbar('chattxt', g.chat.state==3?255:500, 'chatscrollbar');
//    chatScroll(-1);
//}


//function chatTo(nick, raw){
//    var val = '', cPos = -1;
//    if (isset(raw) && raw) {
//        var parts = [];
//        var tmpVal = $('#inpchat').val();
//        cPos = tmpVal != '' ? $('#inpchat').caret().begin + nick.length+1 : -1;
//        if (tmpVal != ''){
//            parts.push(tmpVal.slice(0, $('#inpchat').caret().begin));
//            parts.push(nick+' ');
//            parts.push(tmpVal.slice($('#inpchat').caret().end));
//        }else{parts.push(nick+' ');}
//        val = parts.join('');
//    }
//    else{
//        var n2 = nick.replace(/ /g,'_');
//        val = '@'+n2+' ';
//    }
//    $('#inpchat').val(val);
//    setTimeout("$('#inpchat').focus().caret("+cPos+")",20);
//}
//$(document).on('click', '[c_nick]', function(e){chatTo($(this).attr('c_nick'), e.ctrlKey);});
