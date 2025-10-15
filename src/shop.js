/********************************************* SHOP */
var lastCl = null;
var superMarketEqItemCounter = 0;

this.shopNewItem = (i, finish) => {
  g.shop.tpls[i.id] = i;
  if (finish) {
    this.createOffers(g.shop.items_offers);
  }
}

function createOffers (offers) {
  offers.map(item => this.createSingleOffer(item))
}

function createSingleOffer (offer) {
  const item = {...g.shop.tpls[offer.tplId]};
  item.offerId = offer.id;
  item.quantity = offer.quantity;
  item.pr = offer.price;
  item.prc = g.shop.cur;
  item.$ = item.$.clone();
  item.$.tip(itemTip(item));
  g.shop.items[item.offerId] = item;
  if (isset(parseItemStat(item.stat).amount)) {
    g.tplsManager.changeItemAmount(item, item.$, offer.quantity);
  }
  $('#shop_store').append(item.$);

  var hide = false;
  var forYouId = 479;
  var forYouShop = forYouId == g.shop.id;

  if (forYouShop) {
    g.superMarketItems[item.id] = item;
    if (!isSuperMarketEqItem(item)) hide = true;
    else {
      if (lastCl == null) lastCl = item.cl;
      if (lastCl != item.cl) {
        lastCl = item.cl;
        superMarketEqItemCounter = (Math.floor(superMarketEqItemCounter / 8) + 1) * 8;
      }
    }
  }

  var display = hide ? 'none' : 'block';
  var newY    = forYouShop ? Math.floor(superMarketEqItemCounter / 8)  : offer.y;
  var newX    = forYouShop ? superMarketEqItemCounter - newY * 8       : offer.x;

  item.$.css({
    display:  display,
    left:     newX * 33,
    top:      newY * 33
  }).click(function() {
    shop_buy(this, item)
  });

  if (forYouShop && !hide) superMarketEqItemCounter++;
}

function shop_show(d, items){
  if (g.shop.id !== 0) shop_close(true);
  g.windowCloseManager.callWindowCloseConfig(g.windowsData.windowCloseConfig.SHOP)
  if(d.id == 436){
    return smoczeKuferki(d, items);
  }else{
    $("#window-smoczeKuferki").remove();
  }
  tutorialStart(7);

  var forYouId = 479;
  if (d.id == forYouId) {
    callSuperMarket();
    $("#shop_store").addClass('for_you_shop');
    $('#for-you-plug').css('display', 'block');
    $('#for-you-txt').css('display', 'block');
  } else {
    $("#shop_store").removeClass('for_you_shop');
    $('#for-you-plug').css('display', 'none');
    $('#for-you-txt').css('display', 'none');
  }
  $('#for-you-plug-disabled').css('display', 'none');

  for(var k in d)	g.shop[k]=d[k];
  g.shop.type = 1; // 0 - normal shop, 1 - outfit shop with preview
  for(var k in items){
    if (items[k].loc == 'n'){
      if (!(items[k].cl==30 || items[k].cl==31)){g.shop.type = 0;break;}
    }
  }
  if (g.shop.type==1) $('#shop').addClass('outfit'); //css({'background-image':'url(/img/shop-outfit.png)'});
  else $('#shop').removeClass('outfit'); //css({'background-image':'url(/img/shop.png)'})
  g.shop.tpls = {}
  g.shop.items = {}
  g.shop.b=[];
  g.shop.s=[];
  $('#gold_shop_banner').css('display', 'none');
  $('#sl_shop_banner').css('display', 'none');
  var desc='';
  if(g.shop.cur=='ph') desc=_t('sell_for_ph')+'<br>'; //'SprzedaÅ¼ za: <b>Punkty Honoru</b>.<br />'
  else
  if(g.shop.cur=='sl'){
    desc=_t('sell_for_sl')+'<br>'; //'SprzedaÅ¼ za: <b>Smocze Åzy</b>.<br />'
    $('#sl_shop_banner').css('display', 'block');
  }
  else
  if(g.shop.cur=='zl')
  {
    $('#gold_shop_banner').css('display', 'block');
    desc='<b>'+_t('sell_prices')+'</b>: '; //Ceny sprzedaÅ¼y
    if(g.shop.sellp<150) desc+=_t('sell_price_cheap'); //'tanio'
    else
    if(g.shop.sellp>299) desc+=_t('sell_price_vExpensive'); //'bardzo drogo'
    else
    if(g.shop.sellp>199) desc+=_t('sell_price_expensive'); else //'drogo'
      desc+=_t('sell_price_normal') //'normalnie'
    desc+='<br><b>'+_t('rebuy_price')+'</b> '+g.shop.buyp+'%<br><b>'+_t('max_per_item')+'</b> '+g.shop.maxbuyp+'<br />';
    //'Cena skupu:
    //Maks. za przedmiot:
  }
  else{
    var data = g.shop.cur.split('|');
    desc='<div style="height:32px"><div style="float:left;padding-top:9px;"><b>'+_t('selling_for_info')+'</b></div><div style="margin:0px 5px;background-image:url('+CFG.ipath+data[1]+');height:32px;width:32px;float:left" /><div style="padding-top:9px;margin-left:40px;width:150px;">'+data[0]+'.</div></div><div class="clearfix"></div><br/>'; //SprzedaÅ¼ za:
  }
  desc+='<b>'+_t('shopper_buys')+'</b> ' //Skupuje:
  if(g.shop.purchase=='*') desc+=_t('buys_all'); //'wszystko'
  else
  if(g.shop.purchase=='') desc+=_t('buys_nothing'); //'nic'
  else

  {
    var p=g.shop.purchase.split(',');
    for(var k in p)
      p[k]=eq.classes[parseInt(p[k])];
    desc+=p.join(', ');
  }
  $('#shop_desc').html(desc)
  $('#shop').fadeIn('fast');
  g.tplsManager.fetch('n', shopNewItem);
  //preload().
  g.lock.add('shop');
}

function check_shop () {
  let hide = $('#shop').css('display') == 'none';
  return !hide;
}

function is_only_buy_shop () {
  return check_shop() && get_shop_purchase() == '';
}

function get_shop_purchase () {
  return g.shop.purchase;
}

function shop_close(fast){
  $('#shop>DIV').not('#for-you-plug-disabled, #for-you-txt').empty();
  $('#shop>SPAN').empty();
  $('#shop_store').empty();
  g.tplsManager.removeCallback('n', shopNewItem);
  g.tplsManager.deleteMessItemsByLoc('n');
  g.lock.remove('shop');
  clear_shop_preview();
  superMarketEqItemCounter = 0;
  lastCl = null;
  if (fast) $('#shop').css('display', 'none');
  else $('#shop').fadeOut('fast');
  g.shop={
    'id':0
  };
}
function shop_recover_items() {
  _g('recovery');
}

function pre_shop_accept() {
  const sellItems = g.shop.s;
  const confirmationQueue = new ConfirmationQueue();

  confirmationQueue
    .addCondition(() => checkEnhancedItems(sellItems), _t('enhanced-item-confirm'))  // enchanted item
    .addCondition(() => checkPersonalItems(sellItems), _t('personal-item-confirm2')) // personal item
    .processConditions(() => {
      shop_accept()
    });
}
function shop_accept(){
  if ($.isEmptyObject(g.shop.b) && $.isEmptyObject(g.shop.s)) return;

  switch(g.shop.cur){
    case 'ph':
      if(-g.shop.bill>hero.honor) {
        mAlert(_t('shop_to_low_ph')); //'Masz zbyt maÅo PunktÃ³w Honoru by dokonaÄ wybranego zakupu.'
        return;
      }
      break;
    case 'zl':
      if(-g.shop.bill>hero.gold) {
        mAlert(_t('shop_to_low_gold')); //'Masz zbyt maÅo zÅota by dokonaÄ wybranego zakupu.'
        return;
      }
      break;
    case 'sl':
      if(-g.shop.bill>hero.credits) {
        mAlert(_t('shop_to_low_credits')); //'Masz zbyt maÅo Smoczych Åez by dokonaÄ wybranego zakupu.'
        return;
      }
      break;
    default:
      var amount = 0;
      var data = g.shop.cur.split('|');
      for(it in g.item){
        var item = g.item[it];

        let itemStats = parseItemStat(item.stat);
        let amountStatExists = isset(itemStats.amount);


        if (item.loc == 'g' && item.name == data[0]){
          // var match = /amount=([0-9]+)/.exec(item.stat);
          // if (match !== null && isset(match[1])) amount += parseInt(match[1]);
          if (amountStatExists) amount += parseInt(itemStats.amount);
          else amount++;
        }
      }
      if (-g.shop.bill>amount){
        mAlert(_t('shop_to_low_items %type%', {'%type%':data[0]})); //'Masz zbyt maÅo sztuk wymaganego Årodka pÅatnoÅci ('+data[0]+') by dokonaÄ wybranego zakupu.'
        return;
      }
      break;
  }
  var bl=[];
  const shopB = g.shop.b.filter(n => n); // to remove empty indexes in array
  for(var k in shopB) {
    bl[k] = shopB[k].offerId + ',' + shopB[k].q;
  }
  var sl=[];
  for(var k in g.shop.s)
    sl.push(g.shop.s[k]);
  _g('shop&buy='+bl.join(';')+'&sell='+sl.join(','));
}
function clearShop() {
  g.shop.b=[];
  g.shop.s=[];
  clear_shop_preview();
  if (g.shop.id == 479)  $('#shop>DIV').not('#shop_sell, #for-you-plug-disabled, #for-you-txt').empty();
  else $('#shop>DIV').empty();
}
function shop_buy(e, item) {
  var id = item.offerId ? item.offerId : item.id; // offerId for shop items, id for superMarget items

  var idx=-1;
  for(var k in g.shop.b)
    if(g.shop.b[k].offerId==id) {
      g.shop.b[k].q++;
      idx=k;
    }
  if(idx<0) {
    for(var i=0; i<(g.shop.type==0?5:3); i++)
      if(!g.shop.b[i]) {
        idx=i;
        break;
      }
    if(idx==-1) return;
  }
  if(!g.shop.b[idx])g.shop.b[idx]={
    id:id,
    q:1,
    offerId: item.offerId
  };
  if (g.shop.type==1){
    if (!isset(g.shop.preview)) g.shop.preview=[];
    if (!isset(g.shop.preview[idx])){
      var cl = g.shop.items[id].cl;
      var st = parseItemStat(g.shop.items[id].stat);
      var showType = null;
      if (cl === 30) showType = 'outfit';
      else if (cl === 31) showType = 'pet';

      if (showType != null){
        //var img = new Image();
        //var posX=0,left,top;
        //var leftMod=idx*58-(idx-1),topMod=3;
        if (showType == 'pet'){
          g.shop.preview[idx] = {
            object:new PetStore({stat:st.pet,idx:idx}),
            outfit:0
          };
          if (!$('#shop_sell .infobox').length)
            $('#shop_sell').append('<div class="infobox" style="color:gold;position:absolute;font-size:0.7em;top:83px">'+_t('mascot_preview_info')+'</div>') //Kliknij na cyfrÄ pod maskotkÄ, aby zobaczyÄ odpowiadajÄcÄ jej akcjÄ.
        }else{
          var out = st.outfit.split(',');
          outfitOnload (CFG.opath+out[1], idx, showType);
          //img.src = CFG.opath+out[1];
          //img.onload=function(){
          //  console.log('outfit onload')
          //  var maxWidth=48;
          //  var maxHeight=75;
          //  var frameWidth=(showType == 'pet' ? 32 : (this.width/4));
          //  var frameHeight=(this.height/4);
          //  var previewWidth=maxWidth<frameWidth?maxWidth:frameWidth;
          //  var previewHeight=maxHeight<frameHeight?maxHeight:frameHeight;
          //  var rotation=true;
          //  if (maxWidth<frameWidth||maxHeight<frameHeight){
          //    posX=(frameWidth>previewWidth?(frameWidth/2-previewWidth/2):frameWidth)*-1;
          //    rotation=false;
          //  }
          //  top=(maxHeight/2-previewHeight/2)+topMod;
          //  left=(maxWidth/2-previewWidth/2)+leftMod;
          //  var preview = $(document.createElement('div')).css({
          //    width:previewWidth,
          //    height:previewHeight,
          //    position:'absolute',
          //    overflow:'hidden',
          //    background:'url('+img.src+') '+posX+'px 0px',
          //    top:top,
          //    left:left
          //  });
          //  g.shop.preview[idx] = {
          //    object:preview,
          //    outfit:0
          //  };
          //  if (rotation){
          //    g.shop.preview[idx].interval=setInterval(function(){
          //      g.shop.preview[idx].outfit=(g.shop.preview[idx].outfit+1) & 15;
          //      var x=(g.shop.preview[idx].outfit&3)*previewWidth;
          //      var y=(g.shop.preview[idx].outfit>>2);
          //      if(y==2) y=3;
          //      else if(y==3) y=2;
          //      y*=previewHeight;
          //      g.shop.preview[idx].object.css({backgroundPosition:"-"+x+"px -"+y+"px"});
          //    }, 400);
          //  }
          //  $('#shop_sell').append(g.shop.preview[idx].object);
          //}
        }
      }
    }
  }

  if (isset((parseItemStat(item.stat)).canpreview)) {
    var fun = '_g("moveitem&st=2&tpl=' + id + '"); g.tplsManager.deleteMessItemsByLoc("p");g.tplsManager.deleteMessItemsByLoc("s");';
    showMenu(
      {target:e},
      [
        [_t('show', null, 'item'), fun, true]
      ]
    );
  }

  var pos=(g.shop.type==0?idx:idx*2);
  $('#shq'+pos).html(g.shop.b[idx].q);
  // var $e = $("<div class=item ctip=t_item tip='"+item.tip+"' ></div>")
  var $e = item.$.clone().attr('idx',idx)
    .css({
      top: '',
      left:33*pos,
      display: 'block'
    })
    .click(function(e){
      var idx=$(this).attr('idx');
      if(g.shop.b[idx].q>1) {
        g.shop.b[idx].q--;
        $('#shq'+(g.shop.type==0?idx:idx*2)).html(g.shop.b[idx].q);
      }	else {
        $('#shq'+(g.shop.type==0?idx:idx*2)).empty();
        $('#shop_buy [idx='+idx+']').remove();
        if (g.shop.type==1){
          if (isset(g.shop.preview[idx])){
            clearInterval(g.shop.preview[idx].interval);
            g.shop.preview[idx].object.remove();
            delete g.shop.preview[idx];
          }
        }
        delete g.shop.b[idx];
        $('#item'+item.id).trigger('groupbuy_off');
      }
      Tip.hide();
      shop_bcalc();
    });
  $e.find('small, .itemHighlighter').remove();
  $('#shop_buy').append($e);
  shop_bcalc();
}
function outfitOnload (src, idx, showType) {
  ImgLoader.onload(
      src,
      null,
      function() {
        var posX          = 0,left,top;
        var leftMod       = idx*58-(idx-1),topMod=3;
        var maxWidth      = 48;
        var maxHeight     = 75;
        var frameWidth    = (showType == 'pet' ? 32 : (this.width/4));
        var frameHeight   = (this.height/4);
        var previewWidth  = maxWidth<frameWidth?maxWidth:frameWidth;
        var previewHeight = maxHeight<frameHeight?maxHeight:frameHeight;
        var rotation      = true;

        if (maxWidth<frameWidth||maxHeight<frameHeight){
          posX        = (frameWidth>previewWidth?(frameWidth/2-previewWidth/2):frameWidth)*-1;
          rotation    = false;
        }

        top   =(maxHeight/2-previewHeight/2)+topMod;
        left  =(maxWidth/2-previewWidth/2)+leftMod;

        var preview = $(document.createElement('div')).css({
          width       : previewWidth,
          height      : previewHeight,
          position    : 'absolute',
          overflow    : 'hidden',
          background  : 'url(' + src + ') '+posX+'px 0px',
          top         : top,
          left        : left
        });

        g.shop.preview[idx] = {
          object  : preview,
          outfit  : 0
        };

        if (rotation) {
          g.shop.preview[idx].interval=setInterval(function(){
            g.shop.preview[idx].outfit=(g.shop.preview[idx].outfit+1) & 15;

            var x   =(g.shop.preview[idx].outfit&3)*previewWidth;
            var y   =(g.shop.preview[idx].outfit>>2);

            if(y==2) y=3;
            else if(y==3) y=2;

            y*=previewHeight;
            g.shop.preview[idx].object.css({backgroundPosition:"-"+x+"px -"+y+"px"});
          }, 400);
        }
        $('#shop_sell').append(g.shop.preview[idx].object);
      }
  );
}
function clear_shop_preview(){
  if (isset(g.shop.preview)){
    for(var i in g.shop.preview){
      clearInterval(g.shop.preview[i].interval);
      g.shop.preview[i].object.remove();
    }
    delete g.shop.preview;
  }
}
function shop_bcalc()
{
  let bill=0;
  for(var k in g.shop.b) {
    bill-=g.shop.items[g.shop.b[k].id].pr*g.shop.b[k].q;
  }
  for(var k in g.shop.s) {
    const amount = checkItemStat(g.item[g.shop.s[k]], 'amount') ? getAmountItem(g.item[g.shop.s[k]]) : 1;
    const shopTax = g.shop.buyp * 0.01;
    const oneItemPrice = Math.floor(g.item[g.shop.s[k]].pr / amount);
    const oneItemShopPrice = Math.min(oneItemPrice * shopTax, g.shop.maxbuyp);
    bill += Math.round(oneItemShopPrice * amount);

    // bill+=Math.min(g.shop.maxbuyp * amount, Math.round(g.item[g.shop.s[k]].pr*g.shop.buyp*0.01));
  }
  switch(g.shop.cur){
    case 'zl':
      $('#shop_bilans').html(((bill>0)?'+':'')+round(bill,3)+((-bill>hero.gold)?' (!)':''));
      break;
    case 'sl':
      $('#shop_bilans').html(((bill>0)?'+':'')+round(bill,3)+((-bill>hero.credits)?' (!)':''));
      break;
    case 'ph':
      $('#shop_bilans').html(((bill>0)?'+':'')+round(bill,3)+((-bill>hero.honor)?' (!)':''));
      break;
    default:
      var amount = 0;
      var data = g.shop.cur.split('|');
      for(it in g.item){
        var item = g.item[it];
        if (item.loc == 'g' && item.name == data[0]){

          let itemStats         = parseItemStat(item.stat);
          let amountStatExist   = isset(itemStats.amount);

          // var match = /amount=([0-9]+)/.exec(item.stat);
          // if (match !== null && isset(match[1])) amount += parseInt(match[1]);
          if (amountStatExist) amount += parseInt(itemStats.amount);
          else amount++;
        }
      }
      $('#shop_bilans').html(((bill>0)?'+':'')+round(bill,3)+((-bill>amount)?' (!)':''));
      break;
  }
  //$('#shop_bilans').html(((bill>0)?'+':'')+round(bill,2)+((g.shop.cur=='zl' && -bill>hero.gold)?' (!)':''));
  g.shop.bill=bill;
}
function shop_sell(e){
  var continue_sell = function(){
    const $item = createItem(g.item[id]);
    $item
      .attr('idx', idx)
      .css({
        left:33*(idx%5),
        top:33*Math.floor(idx/5)
      }).append($(e).find('img').clone())
      .click(function(e){
        var idx=$(this).attr('idx');
        $('#shop_sell [idx='+idx+']').remove();
        delete g.shop.s[idx];
        Tip.hide();
        shop_bcalc();
      }).appendTo('#shop_sell');
    shop_bcalc();
  }

  if($('#shop').css('display')=='none') return;
  var id=$(e).attr('id').substr(4), idx=-1;

  var cl = g.item[id].cl;
  if (cl == 17 || cl == 19 || cl == 25 || cl == 26 || cl == 27 || cl == 28 ) { // gold, bless, upgrades, recipes, coinage
    mAlert(_t('sell_cannot'));
    return;
  }

  if(g.shop.purchase=='') {
    mAlert(_t('seller_wont_buy_anything')); //'Ten sprzedawca nic od ciebie nie kupi.'
    return;
  }
  if(g.shop.purchase!=='*'){
    var p=g.shop.purchase.split(','), cansell=false;
    for(var k in p) if(p[k]==g.item[id].cl) cansell=true;
    if(!cansell) {
      mAlert(_t('seller_wont_buy_this')); //'Ten sprzedawca nie skupuje takich rzeczy.'
      return;
    }
  }
  for(var i in g.shop.s) if(g.shop.s[i]==id) return;
  for(var i=0; i<20; i++)
    if(!g.shop.s[i]) {
      idx=i;
      g.shop.s[i]=id;
      break;
    }
  if(idx==-1) return;

  let itemStat          = parseItemStat(g.item[id].stat);
  let questStatExists   = isset(itemStat['quest']);

  // if(g.item[id].stat.search('quest=') >= 0){
  if(questStatExists){
    _g('shop&can_sell='+id, function(r){
      if(r.can_sell == 1) continue_sell();
    })
  }else continue_sell()
}
function slShopOpen(){
  if (isset(hero.guest)) {
    var infoTxt = _t('guest_cannot_buy_draconite');
    mAlert(infoTxt);
    return;
  }
  if(_l() != 'pl'){
    return window.open("https://margonem.com/draconite");
  }
  //hideGoldShop()
  var $f;
  if(isset(g.worldConfig.getWorldName()) && (g.worldConfig.getWorldName() === "dev" || g.worldConfig.getWorldName() === "experimental")){
    $f = $('<div style="background:white;z-index:1000;position:absolute;width:787px;height:537px;" id="slshop">' +
      `<div style="background:url(/img/belka-platnosci.png?v=${_CLIENTVER});width:787px;height:31px;"></div>` +
      '<iframe style="width:787px;height:506px;" src="https://www.margonem.pl/profile/payments"></iframe>' +
      '<div class="closebut" rollover="22" id="sl_shop_close_button" onclick="slShopClose()"></div></div>');
  }else{
    $f = $(`<div style="z-index:1000;position:absolute;width:787px;height:537px;" id="slshop"><div style="background:url(/img/belka-platnosci.png?v=${_CLIENTVER});width:787px;height:31px;"></div><iframe style="width:787px;height:506px;" src="https://www.margonem.pl/profile/payments"></iframe><div class="closebut" rollover="22" id="sl_shop_close_button" onclick="slShopClose()"></div></div>`);
  }
  $('#centerbox').append($f);
}
function slShopClose(){
  $('#slshop').remove();
}
function showStaminaShop(){
  g.lock.add('staminashop');
  updateStaminaDescription()
  $('#staminashop').absCenter().fadeIn();
}
function staminaShopOptionChoose (i, increase) {
  var t = [
    _t('stamina_shop choosen_option', null, 'default'),
    _t('stamina_shop_sure', null, 'default'),
    "<div style='text-align:center'>",
    "</div>",
    '<br/><br/>',
    _t('stamina_buy_info_increase', null, 'default'),
    _t('stamina_buy_info-decrease', null, 'default')
  ];
  var obj = {'%state%': increase ? _t('add') : _t('sub')};
  var newT = {
    1: _t('for_today_desc', obj, 'static'),
    7: _t('for_week_desc', obj, 'static'),
    30: _t('for_30days_desc', obj, 'static')
  };
  var str = t[2] + t[0] + t[4] + newT[i] + t[4] + (increase ? t[5]: t[6]) + t[4] + t[1] + t[4] + t[3];

  mAlert(str, 1,[function () {
    //_g('creditshop&ttl=' + i);
    _g('creditshop&ttl_days=' + i + '&ttl_del=' + (increase ? '0' : '1'));
    hideStaminaShop();
  },function () {

  }]);
}
function updateStaminaDescription () {
  var end = hero.ttl_end;
  var del = hero.ttl_del;
  var $desc = $('#staminashop').find('#_t3new');

  //if (end) {
  //	$desc.css('display', 'block');
  //	var state = del == 0 ? _t('stamina_increase') : _t('stamina_decrease');
  //	$desc.html(state + ' ' + ut_date(end));
  //} else {
  //	$desc.css('display', 'none');
  //}
  if (!end || end && end < ts() / 1000) $desc.css('display', 'none');
  else {
    $desc.css('display', 'block');
    var state = del == 0 ? _t('stamina_increase') : _t('stamina_decrease');
    $desc.html(state + ' ' + ut_fulltime(end));
  }
}

function hideStaminaShop(){
  $('#staminashop').fadeOut();g.lock.remove('staminashop');return false;
}
function buyStamina(amount){
  var arr = {1:1,2:7,8:30};
  _g('creditshop&ttl='+arr[amount]);
  $('.staminaOption').removeClass('step2');
}
/*function showTeatrPromo(){
 g.lock.remove('europromo');
 $('#euroPromoShop').remove();
 g.lock.add('teatrpromo');
 $('#centerbox').append('<div id="teatrPromo"><div class=header><div class=closebut rollover="22" onclick="$(\'#teatrPromo\').remove(); g.lock.remove(\'teatrpromo\')"></div></div><div class=body></div></div>');
 $('#teatrPromo').append('<div class="teatrpromolink" onclick="teatrPromo();"></div>');
 }
 function teatrPromo(){
 g.lock.remove('teatrpromo');
 $('#teatrPromo').remove();
 _g('creditshop&npc=63146');
 }*/
/*function showEasterPromo(){
 $('#easterpromo').remove();g.lock.remove('easterpromo');
 g.lock.add('easterpromo');
 $('#centerbox').append('<div id="easterpromo"><div class=header><div class=closebut rollover="22" onclick="$(\'#easterpromo\').remove(); g.lock.remove(\'easterpromo\')"></div></div><div class=body></div></div>');
 $('#easterpromo .body').append('<div class="link outfity" onclick="easterpromo(67495); return false;"></div>');
 $('#easterpromo .body').append('<div class="link maskotki" onclick="easterpromo(67555); return false;"></div>');
 $('#easterpromo .body').append('<div class="link pamiatki" onclick="easterpromo(67556); return false;"></div>');
 $('#easterpromo .body').append('<div class="link skrzynka" onclick="easterpromo(66650); return false;"></div>');
 return false;
 }
 function easterpromo(id){
 g.lock.remove('easterpromo');
 $('#easterpromo').remove();
 _g('creditshop&npc='+id);
 }*/


/*
 function showHalloweenPromo(){
 $('#halloweenInvitation').remove();g.lock.remove('halloweenInvitation');
 g.lock.add('halloweenpromo');
 $('#centerbox').append('<div id="halloweenpromo"><div class=header><div class=closebut rollover="22" onclick="$(\'#halloweenpromo\').remove(); g.lock.remove(\'halloweenpromo\')"></div></div><div class=body></div></div>');
 $('#halloweenpromo .body').append('<div class="mascot" onclick="halloweenPromo(57989); return false;"></div>');
 $('#halloweenpromo .body').append('<div class="packet" onclick="halloweenPromo(64103); return false;"></div>');
 $('#halloweenpromo .body').append('<div class="souvenirs" onclick="halloweenPromo(64102); return false;"></div>');
 $('#halloweenpromo .body').append('<div class="pozitivs" onclick="halloweenPromo(51396); return false;"></div>');
 $('#halloweenpromo .body').append('<div class="emots" onclick="halloweenPromo(64083); return false;"></div>');
 $('#halloweenpromo .body').append('<div class="outfits1" onclick="halloweenPromo(64065); return false;"></div>');
 $('#halloweenpromo .body').append('<div class="outfits2" onclick="halloweenPromo(64064); return false;"></div>');
 }
 function halloweenPromo(id){
 g.lock.remove('halloweenpromo');
 $('#halloweenpromo').remove();
 _g('creditshop&npc='+id);
 }


 function showNibywyspaPromo(){
 g.lock.remove('letniestrojepromo');
 $('#letniestrojepromo').remove();
 g.lock.add('nibywyspapromo');
 $('#centerbox').append('<div id="nibywyspapromo"><div class=header><div class=closebut rollover="22" onclick="$(\'#nibywyspapromo\').remove(); g.lock.remove(\'nibywyspapromo\')"></div></div><div class=body></div></div>');
 $('#nibywyspapromo').append('<div style="position: absolute;bottom: 25px;width: 300px;height: 50px;left: 106px;" class="teatrpromolink" onclick="nibywyspaPromo();"></div>');
 }
 function nibywyspaPromo(){
 g.lock.remove('nibywyspapromo');
 $('#nibywyspapromo').remove();
 _g('creditshop&npc=10054');
 }
 function showValentinePromo(){
 g.lock.add('valentinepromo');
 $('#centerbox').append('<div id="valentinepromo"><div class=header><div class=closebut rollover="22" onclick="$(\'#valentinepromo\').remove(); g.lock.remove(\'valentinepromo\')"></div></div><div class=body></div></div>');
 $('#valentinepromo').append('<div style="position: absolute;bottom: 25px;width: 300px;height: 50px;left: 106px;" class="teatrpromolink" onclick="valentinePromo();"></div>');
 }
 function valentinePromo(){
 g.lock.remove('valentinepromo');
 $('#valentinepromo').remove();
 _g('creditshop&npc=54309');
 }
 function showInvitation(){
 g.lock.remove('halloweenpromo');
 $('#halloweenpromo').remove();
 g.lock.add('halloweenInvitation');
 $('#centerbox').append('<div id="halloweenInvitation"><div class=closebut rollover="22" onclick="$(\'#halloweenInvitation\').remove(); g.lock.remove(\'halloweenInvitation\')"></div><div class=body></div></div>');
 }
 /*function showLetnieStrojePromo(){
 g.lock.remove('nibywyspapromo');
 $('#nibywyspapromo').remove();
 g.lock.add('letniestrojepromo');
 $('#centerbox').append('<div id="letniestrojepromo"><div class=header><div class=closebut rollover="22" onclick="$(\'#letniestrojepromo\').remove(); g.lock.remove(\'letniestrojepromo\')"></div></div><div class=body></div></div>');
 $('#letniestrojepromo').append('<div class="teatrpromolink" onclick="letnieStrojePromo();"></div>');
 }
 function letnieStrojePromo(){
 g.lock.remove('letniestrojepromo');
 $('#letniestrojepromo').remove();
 _g('creditshop&npc=56988');
 }*/
function showGoldShop(data){
  data = data.split(';');
  $('#goldShop .options').html();
  for(var i=0; i<data.length; i++){
    var tmp = data[i].split('=');
    $('<div class="goldBox box_'+i+'"><div class="bg" onclick="goldShopBuy('+tmp[0]+', '+tmp[1]+')"><span class=sl>'+tmp[0]+_t('sl', null, 'clan')+'</span><span class=gold>'+round(tmp[1],3)+'</span></div></div>').appendTo('#goldShop .options');
  }
  $('#goldShop').show();
}
function hideGoldShop(){
  $('#goldShop').hide().find('.options').html('');return false;
}
function goldShopBuy(sl,gold){
  mAlert(_t('gold_buy_confirm %sl% %gold%', {'%sl%':sl,'%gold%':gold}),2,[function(){_g('creditshop&credits_gold='+sl)}, null])
}

function shopSellOrBuyAction (v) {
  if ((isset(v.sellAction) && v.sellAction === "FINALIZED") || (isset(v.buyAction) && v.buyAction === "FINALIZED")) {
    clearShop();
  }
  if (isset(v.buyAction) && v.buyAction === "FINALIZED") {

  }
}
