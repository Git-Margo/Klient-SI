/**************************************** MAILS */
let blockGetNextPage    = false;
function updateDataMails (data) {
  if (isset(data.show) && data.show.tab === 'received') {
    loadMails(data);
  }
  if (isset(data.removeAttachments)) {
    data.removeAttachments.list.map(attachment => mailDelAtt(attachment))
  }
  if (isset(data.remove)) {
    data.remove.list.map(mail => mailDel(mail.id))
  }
}
function loadMails(m) {
  if (isset(m.show) && m.show.tab === 'sent') return;

  var refresh=g.mails;
  if(!g.mails) {
    g.mails=true;
    g.mailsPages = new MailsPages();
    g.mailsWindow = new MailsWindow();
    g.mailsWindow.initScrollBar();
    $('#mails').fadeIn('fast');
    g.lock.add('mails');
    g.windowCloseManager.callWindowCloseConfig(g.windowsData.windowCloseConfig.MAIL)
  }

  if (m.show.page) {
    g.mailsPages.updatePages(m.show.page);
  }

  const currentPage = g.mailsPages.getCurrentPage();
  const maxPage     = g.mailsPages.getMaxPage();
  const firstPageUpdate = (currentPage === 1 || maxPage === 0) && !isset(m.remove);

  if (firstPageUpdate) {
    clearMessages();
    g.mailsWindow.scrollTop();
  }

  var ms=[],dark=false;

  m.show.list.map(mail => {
    var att='', batt='';
    if(mail.gold>0) att = '<span class="mail_gold">' + _t('gold_att %amount%', {'%amount%': mail.gold}, 'mails'); + '</span>' //'ZÅoto: '+m[i+4];
    if(mail.credits>0) att +=' '+_t('sl_att %amount%', {'%amount%':mail.credits}, 'mails'); //'SÅ: '+m[i+5];
    if(mail.item>0){
      att+='<span class=mailitem id="mailatt'+mail.item+'"></span>';
    }
    if(att!='') {
      batt= `<span class=mail_att><button onclick="oncePerRequest(this, 'mail&action=get&id=${mail.id}')" class=get tip="${_t('get_attachment', null, 'mails')}"></button>
        <button onclick="oncePerRequest(this, 'mail&action=delete&id=${mail.id}&lastPage=${currentPage}')" class=getdel tip="${_t('get_attachment_del', null, 'mails')}"></button></span>
        <button onclick="oncePerRequest(this, 'mail&action=delete&id=${mail.id}&lastPage=${currentPage}')" class=del style="display:none" tip="${_t('del_message', null, 'mails')}"></button>`; //UsuÅ wiadomoÅÄ
    } else {
      att=_t('no_attach', null, 'mails');
      batt=`<button onclick="oncePerRequest(this, 'mail&action=delete&id=${mail.id}&lastPage=${currentPage}')" class=del tip="${_t('del_message', null, 'mails')}"></button>`; //UsuÅ wiadomoÅÄ
    }
    att='<span class=mail_att>'+att+'<br></span>';
    var ago = calculateDiff(unix_time(), mail.ts);
    var fraudExceptionSenders = ['Aukcjoner', 'Auctioneer', 'System', 'Grabarz', 'Baraki w Ithan', 'Zajazd u Makiny', 'Ratusz w Karka-han', 'Karczma pod ZÅotÄ WywernÄ' , 'Karczma Umbara', 'Karczma pod Fioletowym KrysztaÅem', 'Karczma pod PosÄpnym Czerepem', 'Siedziba ergassaj', 'Alabastrowy Hotel', 'Knajpa pod Czarnym Tulipanem', 'Zajazd pod TÄczowym Å»ukiem', 'Zajazd pod ZÅamanym Dukatem', 'Kamienica Kandelia', 'Arena GladiatorÃ³w', 'Zajazd pod RÃ³Å¼Ä WiatrÃ³w', 'Tawerna pod BosmaÅskim Biczem', 'Kamienica Bursztynek', 'ZbÃ³jnicka spiÅ¼arnia', 'OberÅ¼a pod ZÅotym KÅosem', 'Austeria Karibiego', 'Kwatery u Morcera']; //
    var is_special = fraudExceptionSenders.indexOf(mail.sender) > -1 || /\*/.test(mail.sender)

    var b_nick = '<b class=mailnick onclick=mailReply('+mail.id+') tip="'+_t('from_tip', null, 'mails')+'" rollover=30>'+mail.sender+'</b> ';
    var nick_html = mail.sender.replace(/\*/g, '');

    if(is_special)b_nick = '<b tip="'+ _t('npc_msg') +'"class="mailnick special">'+nick_html+'</b> ';

    ms.push('<div id=msg'+mail.id+' class=onemail'+(dark?' style="background:url(img/mail-back2.jpg?v='+_CLIENTVER+')"':'')+'><span class=mhead>'
      +'&nbsp;'+_t('from', null, 'mails')+b_nick //Odpowiedz nadawcy
      //ago+' temu'
      +_t('ago %ago%', {'%ago%':ago}, 'mails')+(checkFraud(mail.message) && fraudExceptionSenders.indexOf(mail.sender) < 0?'<span class="fraudInfo">'+_t('fraud_possible', null, 'mails')+'</span>':'')+'<small style="float:right">'+ut_fulltime(mail.ts)+'</small>' //MoÅ¼liwa prÃ³ba oszustwa!
      +'<hr clear=all style="color:#a87227; background:#a87227; height:1px; border:none">'
      +'<span style="float:right; top:-5px; position:relative; right:5px">'+batt+'</span>'
      +'&nbsp;<b>'+_t('attachments', null, 'mails')+/*ZaÅÄczniki:*/'</b> '+att+'</span><span style="padding:4px">'+parseMailBB((mail.message.replace(/position\s*:\s*(fixed|absolute)/gi, '')))+'</span></div>');
    dark=!dark;
  });
  // if(refresh) {
  //   $('#newmail').after(ms.join(''));
  // } else if (firstPageUpdate) {
  if (!firstPageUpdate) {
    $('#inbox').append(ms.join(''))
  } else {
    $('#inbox').html('<div class=newmsgout>'
      +(isset(hero.clan) && hero.clan.rank&64 ? '<div class="clanmail_infobox">'+_t('clanmsg_info %clan_rcp_name%', {'%clan_rcp_name%':_t('clanmsg_rcp_name', null,'mails')}, 'mails')+'</div>' : '')
      +'<button onclick=newMail() class=newmsg></button>'
      +'<span class=neml>'+_t('to', null, 'mails')+'<input style="width:200px" id=mailto> <small style="font-size:85%">'+_t('send_cost', null, 'mails')+'</small></span> <br clear=all>' //(koszt: 100 zÅota)
      +'<div id=newmail class=neml><textarea id=mailmsg></textarea>'
      +'<table><tr>'
      +'<td>'+_t('gold_attachment', null, 'mails')+'<input style="width:60px" id=mailgold>' //ZÅoto:
      +'<td>'+_t('item_attachment', null, 'mails')+'<td><span id=mailitem class=mailitem></span>' //Przedmiot:
      +'<td width=100>'+_t('chats_left', null, 'mails')+'<b id=mailchars>0</b>/1000' //ZnakÃ³w
      +'<td><button onclick=cancelMail() class=cancelmsg></button>'
      +'<td><button onclick=sendMail() class=sendmsg></button>'
      +'</table></div></div>'+ms.join('')+'<br><br>'
    );
    $('#mailmsg').keyup(function(){
      var t=$('#mailmsg').val();
      if(t.length>1000) $('#mailmsg').val($('#mailmsg').val().substring(0, 1000));
      $('#mailchars').html($('#mailmsg').val().length);
    });
    $('#inbox .get, #inbox .getdel, #inbox .del').attr('rollover',22);
    $('#inbox .reply').attr('rollover',15);

    const submitBtnEl = drawSIButton(_t('refresh', null, 'mails'));
    submitBtnEl.on('click', () => mailsRefresh());
    $('#mails .wrapper-refresh-btn').html(submitBtnEl);
  }
}

function mailsRefresh() {
  _g('mail&action=refresh');
}

function hideMails() {
  if(g.mails) {
    g.mails=false;
    g.mailsPages=null;
    g.mailsWindow=null;
    $('#mails').fadeOut('fast');
    $('.clanmail_infobox').hide();
    g.lock.remove('mails');
  }
}

function clearMessages() {
  $('#inbox .onemail').remove();
}

function newMail() {
  clearMail();
  $('.clanmail_infobox').show();
  $('#inbox .neml').show();
}

function cancelMail() {
  $('#inbox .neml').hide();
}

function clearMail() {
  $('#inbox .neml').hide();
  $('#inbox .neml INPUT, #inbox .neml TEXTAREA').val('');
  $('#mailitem').empty();
}

function mailReply(id) {
  newMail();
  $('#mailto').val($('#msg'+id+' B.mailnick').html());
  $('.neml TEXTAREA').focus();
}

function mailAtt(e) {
  if(!g.mails) return;
  var it=$(e).attr('id').substr(4);
  $('#mailitem').empty();
  $('#item'+it).clone().css({
    position:'relative',
    top:0,
    left:0
  }).attr({
    id:'att-item',
    iid:it
  })
    .appendTo('#mailitem').click(function(e){
    $(this).remove();
  });
}

function sendMail() {
  let mailTo  = esc($('#mailto').val());
  let msg     = esc($('#mailmsg').val());
  let goldVal = parsePrice($('#mailgold').val());
  let itemId  = $('#mailitem DIV').attr('iid');
  itemId      = itemId == undefined ? '' : itemId;

  _g('mail&action=send&recipient=' + mailTo + '&gold=' + goldVal + '&item=' + itemId + '&msg=' + msg, (v) => {
    if (isset(v.message) && isset(v.message[3201002])) clearMail();
  });
}

function mailDel(id) {
  $('#msg'+id).find("button").removeAttr("onclick");
  $('#msg'+id).fadeOut('fast',function(){
    $(this).remove()
  });
}

function mailDelAtt({ id, gold }) {
  var $msg = $('#msg' + id);
  if (gold === 0) {
    $msg.find('.mail_att').remove();
    $msg.find('.del').show();
  } else {
    $msg.find('.mailitem').remove();
    $msg.find('.mail_gold').html(_t('gold_att %amount%', {'%amount%':gold}, 'mails') + '<br>');
  }
}

