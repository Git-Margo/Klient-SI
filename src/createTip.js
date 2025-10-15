new (function () {
	$.fn.tip = function (txt) {
		if (txt === '') return;
		$(this).attr('tip', txt);
	};
})();
