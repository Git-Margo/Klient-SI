/*
 * jQuery Margonem plugin
 * @requires jQuery v1.2 or above
 * 
 * Designed specially for Margonem MMORPG (www.margonem.pl)
 * Do not use anywhere else.
 *  
 */
 
(function($) {
	function evImg(e)
	{
		if(!isset(e.data.il)||e.data.il.length==0) { e.data.cb(e.data.o); return; }
		var img=new Image();
		$(img).bind('load',{il:e.data.il.slice(1),cb:e.data.cb,o:e.data.o},evImg).error(function(){
			log("Can't load image from "+$(this).attr('src'),2);
		}).attr({src:e.data.il[0]});
	}
	$.fn.extend({
		// centers any absolute positioned element
		absCenter: function() {
			return $(this).css({left:Math.round(document.body.scrollLeft+$(window).width()/2-$(this).width()/2),
				top:Math.round(document.body.scrollTop+$(window).height()/2-$(this).height()/2)});
		},
		/* Run a function after all images including backgrounds are loaded.
		*/
		listImgs: function() {
			var il=[];
			var b=$(this).css('background-image');
			if(b!='none')	il[il.length]=b.substr(4,b.length-5);
			$(this).children(function(i){
				b=$(this).css('background-image');
				if(b!='none')	il[il.length]=b.substr(4,b.length-5);
			});
			$(this).children('img').each(function(i){
				b=$(this).attr('src');
				if(b!='')	il[il.length]=b;
			});
			return il;
		},
		preload: function () {
			$('#imgload').show();
			evImg({data:{il:$(this).listImgs(),o:this,cb:function(o){$(o).dequeue();}}})
			return $(this).queue(function(){$('#imgload').hide();});			
		},
		/* insert text at current cursor position in textarea
		 original: http://alexking.org/blog/2003/06/02/inserting-at-the-cursor-using-javascript
		*/
		insertAtCaret: function(myValue){
			if (document.selection) {
        this.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
			}
      else if (this.selectionStart || this.selectionStart == '0') {
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      } else {
        this.value += myValue;
        this.focus();
      }
    },
    /* 2 values - set selection, 1 value - set caret pos, no value - return current selection range
			original: http://pastie.org/226790 */
		caret: function(begin, end) {
		  if (this.length == 0) return;
		  if (typeof begin == 'number') {
		  	if(begin==-1) begin=$(this).val().length;
		    end = (typeof end == 'number') ? end: begin;
		    return this.each(function() {
		      if (this.setSelectionRange) {
		        this.focus();
		        this.setSelectionRange(begin, end);
		      } else if (this.createTextRange) {
		        var range = this.createTextRange();
		        range.collapse(true);
		        range.moveEnd('character', end);
		        range.moveStart('character', begin);
		        range.select();
		      }
		    });
		  } else {
		    if (this[0].setSelectionRange) {
		      begin = this[0].selectionStart;
		      end = this[0].selectionEnd;
		    } else if (document.selection && document.selection.createRange) {
		      var range = document.selection.createRange();
		      begin = 0 - range.duplicate().moveStart('character', -100000);
		      end = begin + range.text.length;
		    }
		    return {
		      begin: begin,
		      end: end
		    };
		  }
		},
    helperDiv: function(o) {
    	if(!isset(o))o={};
    	var of=$(this).position(), cont=$(this).parent(), z=parseInt($(this).css('zIndex')), ov=0;    	
    	if(o.cointaner)cont=o.cointaner;
    	if(o.oversize)ov=o.oversize;
    	var css={};
    	if(o.css) css=o.css;
    	css.display='none';
    	css.position='absolute';
    	css.top=parseInt($(this).css('top'))-ov;
    	css.left=parseInt($(this).css('left'))-ov;
    	css.width=$(this).width()+ov*2;
    	css.height=$(this).height()+ov*2;
    	if(z && !css.zIndex) css.zIndex=z; 
    	var id='';
    	if(o.id) id=' id='+o.id;    	
    	return $('<div'+id+'></div>').css(css).prependTo(cont);
		},
    log: function (msg) {
      console.log("%s: %o", msg, this);
      return this;
    }		
	});
})(jQuery);
