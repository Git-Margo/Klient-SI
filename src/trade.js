/************************** TRADE */

let timeout = null;
let gainedCreditsRatio = 0.1;
const disableClass = 'disabled';
const $tradeAccept = $('#tradeaccept');

function tradeInit(pid){
  g.windowCloseManager.callWindowCloseConfig(g.windowsData.windowCloseConfig.TRADE)
  g.lock.add("trade");
  g.trade={
    id:pid,
    items:0,
    myitems:0,
    myval:0,
    val:0,
    mygold:0,
    gold:0,
    accept:0,
    myaccept:0
  };
  $('#tradeaccept').css('backgroundPosition','-69px -209px');
  $('#tradeaccept2').css('backgroundPosition','0 -209px');
  $('#tr2_gold').html('');
  $('#mytr_gold').val('');
  $('#tr2_value').html('0');
  $('#mytr_value').html('0');
  $('#mytrader').css({
    backgroundImage:'url('+hero.icon+')',
    width: hero.fw,
    height: hero.fh,
    backgroundPosition: '0 -'+hero.fh+'px'
  }).attr('tip',hero.nick);
  if(isset(g.other[pid])) tradeSetupOther(g.other[pid])
  else g.checklist['other'+pid]=tradeSetupOther;
  $('#trade').fadeIn('fast');
}

function tradeUpdate(tr) {
  for(var k in tr)
    if(k!='init') g.trade[k]=tr[k];

  if (isset(tr.gainedCreditsRatio)) {
    gainedCreditsRatio = tr.gainedCreditsRatio;
  }

  if (isset(tr.acceptLockSeconds)) {
    setTimer(tr.acceptLockSeconds);
  }

  if(isset(tr.gold)) {
    $('#tr2_gold').html(round(tr.gold,3));
  }
  if(isset(tr.mygold)) {
    $('#mytr_gold').val(round(tr.mygold,3));
  }

  const creditsRatio = (1 - gainedCreditsRatio) * 100; // percent
  if(isset(tr.credits)) {
    $('#tr2_credits').html(tr.credits).tip(_t('credits-tip', { "%val%": creditsRatio }, 'trade'));
  }
  if(isset(tr.mycredits)) {
    $('#mytr_credits').html(tr.mycredits).tip(_t('credits-tip', { "%val%": creditsRatio }, 'trade'));
  }
  if(isset(tr.myaccept)) $('#tradeaccept').css('backgroundPosition',tr.myaccept?'-207px -209px':'-69px -209px');
  if(isset(tr.accept)) $('#tradeaccept2').css('backgroundPosition',tr.accept?'-276px -209px':'0px -209px');
  if(isset(tr.close)) tradeClose();
}

const setTimer = (sec) => {
  if (timeout) clearTimeout(timeout);

  if (!checkBlockAccept()) {
    $tradeAccept.addClass(disableClass);
    $tradeAccept.tip(_t("change_money_or_items"))
  }

  timeout = setTimeout(() => {
    $tradeAccept.removeClass(disableClass);

    Tip.hide();
    $tradeAccept.removeAttr('tip');
  }, sec * 1000);

};

const checkBlockAccept = () => {
  return $tradeAccept.hasClass(disableClass);
};

function tradeSetupOther(ot)
{
  $('#trader2').css({
    backgroundImage:'url('+g.opath+'postacie'+ot.icon+')',
    width: ot.fw,
    height: ot.fh,
    backgroundPosition: '0 -'+(2*ot.fh)+'px'
  }).attr('tip',ot.nick);
}
function trade_sell(e)
{
  var id=$(e).attr('id').substr(4);
  if($('#trade').css('display') === 'block') {
    const confirmationQueue = new ConfirmationQueue;
    confirmationQueue
      .addCondition(() => checkPersonalItems([id]), _t('personal-item-confirm2')) // personal item
      .processConditions(() => {
        _g('trade&a=add&tid='+id);
      });
  }
}
function trade_gold() {
  var mygold=parsePrice($('#mytr_gold').val());
  if(mygold>hero.gold) {
    mAlert(_t('gold_low', null, 'trade')); //'Nie masz tyle zÅota!'

    $('#mytr_gold').val(round(g.trade.mygold,3));
  } else _g('trade&a=gold&val='+mygold);
}
function tradeAccept() {
  if (checkBlockAccept()) return;
  let buyPersonalItem = false;
  if(!g.trade.myaccept) {
    var buy='',sell='';
    for(var k in g.item)
      if(g.item[k].loc=='t') {
        if(g.item[k].own==hero.id) sell+=','+k;
        else {
            buy+=','+k;
            if (checkPersonalItems(g.item[k])) buyPersonalItem = true;
        }
      }

      if (buyPersonalItem) {
          const confirmInfo = _t('personal-item-confirm', null, 'trade');
          mAlert(confirmInfo, 1, [
              () => _g('trade&a=accept&buy='+g.trade.gold+buy+'&sell='+g.trade.mygold+sell)
          ]);
          return;
      }
    _g('trade&a=accept&buy='+g.trade.gold+buy+'&sell='+g.trade.mygold+sell);
  }
  else _g('trade&a=noaccept');
}
function tradeClear(ok) {
  var returnedItems = {};
  for(var k in g.item)
    if(g.item[k].loc=='t' || g.item[k].loc=='s') {
      $('#item'+k).remove();
      if((!ok || g.item[k].loc=='s') && g.item[k].own==hero.id) {
        g.item[k].loc='g';
        g.item[k].returned=true;
        returnedItems[k] = g.item[k];
        $('#item'+k).css({
          backgroundImage:'url('+CFG.ipath+g.item[k].icon+')'
        });
      }
      else delete g.item[k];
    }
  newItem(returnedItems);
}
function trade_start(id){
  _g("trade&a=ask&id="+id);
}
function tradeCancel() {
  _g('trade&a=cancel');
}
function tradeClose()
{
  g.lock.remove("trade");
  $('#trade').fadeOut('fast');
  tradeClear(g.trade.myaccept&&g.trade.accept)
  g.trade={
    'id':0
  }
}
