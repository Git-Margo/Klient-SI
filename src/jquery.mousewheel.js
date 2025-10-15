/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * $LastChangedDate: 2007-12-14 23:57:10 -0600 (Fri, 14 Dec 2007) $
 * $Rev: 4163 $
 *
 * Version: 3.0
 *
 * Requires: $ 1.2.2+
 */
(function($){
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
$.event.special.mousewheel={setup:function(){var handler=$.event.special.mousewheel.handler;if(this.addEventListener)this.addEventListener((isFirefox?'DOMMouseScroll':'mousewheel'),handler,false);else
this.onmousewheel=handler;},teardown:function(){var handler=$.event.special.mousewheel.handler;$(this).unbind('mousemove.mousewheel');if(this.removeEventListener)this.removeEventListener((isFirefox?'DOMMouseScroll':'mousewheel'),handler,false);else
this.onmousewheel=function(){};$.removeData(this,'mwcursorposdata');},handler:function(event){var args=Array.prototype.slice.call(arguments,1);event=window.event;$.extend(event,$.data(this,'mwcursorposdata')||{});var delta=0,returnValue=true;if(event.wheelDelta)delta=event.wheelDelta/120;if(event.detail)delta=-event.detail/3;event.data=event.data||{};event.type="mousewheel";args.unshift(delta);args.unshift(event);return $.event.dispatch.apply(this,args);}};$.fn.extend({mousewheel:function(fn){return fn?this.bind("mousewheel",fn):this.trigger("mousewheel");},unmousewheel:function(fn){return this.unbind("mousewheel",fn);}});})(jQuery);
