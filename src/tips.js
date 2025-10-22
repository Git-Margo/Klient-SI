/** Api object for controlling tips. <p><h3>Usage</h3>Every DOM element which will be
 *  contained in a <strong>selector</strong> used in init method
 *  needs to have 'tip' attribute. This attribute will be used as a
 *  Tip content and displayed over the target element. <br />
 *  Elements can also have optional attribute <strong>ctip</strong> which describes
 *  class of an appearing Tip box, it also defines config object which will be used
 *  for a Tip displayed over an DOM element with this ctip attribute. Simple
 *  if element will have ctip="t_item" then Tip object will have class="t_item"
 *  attribute and Tip will get behavior described in types list. Although
 *  class of a Tip box can be overwritten by a specific attribute in type object
 *  corresponding to name given in ctip attribute.
 *  type object.</p>
 *  <p>
 *  <h3>Type object</h3>
 *  Tip.init(selector, types) can take types list as a second (optional) parameter, this is an associative
 *  array (simply object) that contains list of configuration objects corresponding
 *  to elements with specific value of a <strong>ctip</strong> attribute. <br />For example if
 *  in that list will be an object assigned to <strong>egType</strong> then if
 *  user activates tip on an element which has attribute <strong>ctip="egType"</strong>
 *  , tip appearing over this element will behave like its described in this config object.<br />
 *  <h4>Object options:</h4>
 *  <ul>
 *    <li>classOverride: Tip class takes this value instead of ctip value, default: null - it takes value of ctip attribute</li>
 *    <li>tipPosition: position of the Tip box related to target DOM element, possible: top/bottom/left/right, default: top</li>
 *    <li>mouseTrack: if Tip should follof mouse when mofing over an target element, possible: true/false, default: false</li>
 *    <li>show: function used to show Tip, it takes tip DOM element as a parameter</li>
 *    <li>hide: function used to show Tip, it takes tip DOM element as a parameter</li>
 *  </ul>
 *  </p>
 *  Below is a simple example how to attach tips to DOM elements which have 'tip' attribute and adding t_item to behavior objects list:
 *  @class
 *  @example
 *  Tip.init('[tip]', {
 *    t_item:{
 *      classOverride:'tipObjectClass',
 *      tipPosition: 'bottom',
 *      mouseTrack: true,
 *      show:function(el){
 *        el.show();
 *      },
 *      hide:function(el){
 *        el.fadeOut(1000)
 *      }
 *    }
 *  });
 **/
var Tip = {
  types: {
    _default:{
      classOverride:null,
      tipPosition: 'top',
      mouseTrack: false,
      show: function(el){
        el.fadeIn(200);
      },
      hide: function(el){
        el.fadeOut(200);
      }
    }
  },
  /** If tips are enabled or not, controlled by enable()/disable() methods
   *@private*/
  enabled:true,
  /** If tip is temporary hidden on target element
   *@private*/
  hidden:false,
  /** Content of a tip attribute of target element, needed to compare with new tip value and update if needed
   *@private*/
  activeContent: null,
  /** Target element
   *@private*/
  target: null,
	currentCfg: null,
	mousePos: {x: null, y: null},
	isParent: function(c, p){
		if(c == p){
			return true;
		}
		var tab = $(c).parents();
		for(var t=0;t<tab.length;t++){
			if(tab[t] == p){
				return true;
			}
		}
		return false;
	},
	resize: function(){
		if(this.tip === null || this.target === null) return;
		if (this.activeContent != this.target.attr('tip')){
			this.update(this.target.attr('tip'));
		}
		var fakeE = {clientY: this.mousePos.y, clientX: this.mousePos.x};
		var fakeCfg = {tipPosition: this.currentCfg.tipPosition, mouseTrack: this.currentCfg.mouseTrack};
		this.reposition(fakeCfg, fakeE);
	},
  /**
    Initiates tips on elements described by selector parameter, also can take types as an auxiliary parameter.
    @param {string} selector Describes which DOM elements should be affected by tip behavior, takes standard jQuery selector.
    @param {object} [types] Object with list of behavior types.
   */
  init:function(selector, types){
    var T = this;
    if (types == undefined) types = {};
    this.types = $.extend(this.types, types);
    $(document).on('mouseover mouseout mousemove', selector+' .notippropagation', function(e){
      // e.stopPropagation();
      return false;
    });
    $(document).on('mouseover mouseout mousemove', selector, function(e){
      // e.stopPropagation();
      if (T.tip == null) T.initHtml();
      if (T.target == null) T.hidden = false;
      if (!T.enabled || T.hidden) return;
      var type = $(this).attr('ctip') ? (T.types[$(this).attr('ctip')] != undefined ? $(this).attr('ctip') : '_default') : '_default';

      if ($(this).attr('ctip') == 't_npc' && $(this).attr('id')) {
        let npcId = ($(this).attr('id')).replace(/npc/, '');
        refreshTipOfNpc(npcId);
      }

      var cfg = $.extend({}, T.types._default, T.types[type]);
      var cl = $(this).attr('ctip') && cfg['classOverride'] == null ? $(this).attr('ctip') : cfg['classOverride'];



      if ($(this).attr('data-type')) {
        T.tip.attr('data-type', $(this).attr('data-type'))
      } else {
        T.tip.removeAttr('data-type')
      }

      if (e.type == 'mouseover'){
				T.tip.stop(true, true);
        T.update($(this).attr('tip'));
        T.target = $(this);
        T.tip.removeAttr('class').addClass(cl);
	      cfg.show(T.tip);
				T.mousePos.x = e.clientX;
				T.mousePos.y = e.clientY;
				T.currentCfg = cfg;
        T.reposition(cfg, e);
        T.autoUpdateInterval = setInterval(function(){
          if (T.target == null){clearInterval(T.autoUpdateInterval);return;}
          if (T.activeContent != T.target.attr('tip')){
            T.update(T.target.attr('tip'));
          }
        }, 100);
      }else if(e.type == 'mouseout'){
				if(T.target === null || !T.isParent(e.toElement, T.target[0])){
	        //if ($(this).attr('id') == T.target.attr('id')){
						T.tip.stop(true, true);
	          cfg.hide(T.tip);
	          T.afterHide()
	        //}
				}
      }else if(e.type == 'mousemove'){
        if (cfg.mouseTrack) T.reposition(cfg, e);
      }
    })
  },
  autoUpdateInterval:null,
  /** Clearing out target handler and interval which checks when to update tip.
   *@private*/
  afterHide:function(){
    this.target = null;
    clearInterval(this.autoUpdateInterval);
  },
  /**
   * Repositions tip when mouse is over target element. It runs automaticly, once if mouseTrack is disabled, and multiple times when it is set to true.
   * @param {object} cfg Object with data required to determine position of the tip and possibility of mouse tracking
   * @param {event} e Simple DOM event object used to determine actual mouse position, can be also simple object with properties top,left
   * @private
   **/
  reposition:function(cfg, e){
    var xy = this.getPos(cfg, e);
    var th = this.tip.outerHeight(), tw=this.tip.outerWidth();
    switch(cfg.tipPosition){
      case 'top':
        if (xy.top < 0) xy = this.getPos({tipPosition:'bottom',mouseTrack:cfg.mouseTrack}, e);
        if (xy.left < 0) xy.left = 0;if (xy.left+tw > $(window).width()) xy.left = $(window).width() - tw;
        break;
      case 'bottom':
        if (xy.top+th > $(window).height()-10) xy = this.getPos({tipPosition:'top',mouseTrack:cfg.mouseTrack}, e);
        if (xy.left < 0) xy.left = 0;if (xy.left+tw > $(window).width()-10) xy.left = $(window).width() - tw;
        break;
      case 'left':
        if (xy.left < 0) xy = this.getPos({tipPosition:'right',mouseTrack:cfg.mouseTrack}, e);
        if (xy.top < 0) xy.top = 0;if (xy.top+th > $(window).height()-10) xy.top = $(window).height() - th;
        break;
      case 'right':
        if (xy.left+tw > $(window).width()-10) xy = this.getPos({tipPosition:'left',mouseTrack:cfg.mouseTrack}, e);
        if (xy.top < 0) xy.top = 0;if (xy.top+th > $(window).height()-10) xy.top = $(window).height() - th;
        break;
    }
    this.tip.css(xy);
  },
  /**
   * Gets top/left data for tip positioning based on config object passed as a cfg parameter
   * @param {object} cfg Object with data required to determine position of the tip and possibility of mouse tracking
   * @param {event} e Simple DOM event object used to determine actual mouse position, can be also simple object with properties top,left
   * @private
   **/
  getPos:function(cfg, e){
    var xy = cfg.mouseTrack ? {top:e.clientY,left:e.clientX} : this.target.offset();
    var th = this.tip.outerHeight(), tw=this.tip.outerWidth();
    switch(cfg.tipPosition){
      case 'top':
        xy.top -= (cfg.mouseTrack ? (th+10) : th+2);
        xy.left -= (tw/2-(cfg.mouseTrack ? 0 : this.target.outerWidth()/2));
        break;
      case 'bottom':
        xy.top += (cfg.mouseTrack ? 10 : this.target.outerHeight()+2);
        xy.left -= (tw/2-(cfg.mouseTrack ? 0 : this.target.outerWidth()/2));
        break;
      case 'left':
        xy.left -= ((cfg.mouseTrack ? 10 : 2)+tw);
        xy.top -= (th/2-(cfg.mouseTrack ? 0 : this.target.outerHeight()/2));
        break;
      case 'right':
        xy.left += (cfg.mouseTrack ? 10 : (this.target.outerWidth()+2));
        xy.top -= (th/2-(cfg.mouseTrack ? 0 : this.target.outerHeight()/2));
        break;
    }
    return xy;
  },
  /**
   * Updates tip content, runs automaticly when tip attribute of target element is changed.
   * @private
   */
  update:function(content){
    this.activeContent = content;
    this.tipContentHandler.html(this.activeContent);
  },
  /**
   * Prepares html for tip DOM element.
   * @private
   */
  initHtml:function(){
    var T = this;
    T.tip = $(document.createElement('div')).attr('id', 'tip').append('<div id=tip-o1></div><div id=tip-o2></div><div class="tipInnerContainer content"></div>');
    T.tipContentHandler = T.tip.find('.tipInnerContainer');
    $('body').append(T.tip);
  },
  /** Temporary hides tip, tip is enabled again after mouseover on next tipped element or mouseout of active target.*/
  hide:function(){
    if (this.tip != undefined) this.tip.hide();
    this.afterHide();
    this.hidden = true;
  },
  /** Disable showing tips permamently, until enable() is called.*/
  disable:function(){
    if (this.tip != undefined) this.tip.hide();
    this.afterHide();
    this.enabled = false;
  },
  /** Enable tips, should be used after Tip.disable() so tips could be shown again.*/
  enable:function(){this.enabled=true}
};
Tip.init('[tip]');
