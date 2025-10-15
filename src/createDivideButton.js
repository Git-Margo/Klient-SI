new (function () {
	var self = this;
	$.fn.createDivideButton = function (data, id, setFirstOpt, clb) {
		$(this).addClass('divide-button input-val-' + id);
		var l = lengthObject(data);
		var percent = 100 / l;
		for (var i = 0; i < l; i++) {
			var d = data[i];
			var cl = self.getBckClass(i, l, setFirstOpt);
			var $option = $('<div>').addClass('option');
			var $label = $('<div>').html(d.text).addClass('label');
			var $bck = $('<div>').addClass('bck ' + cl);
			$bck.attr('value', d.val);
			$option.append($bck, $label);
			$(this).append($option);
			$option.css('width', percent + '%');
			$option.click(function () {
				$(this).parent().find('.bck').removeClass('active');
				$(this).find('.bck').addClass('active');
				if (clb) {
					var v = $(this).find('.bck').attr('value');
					clb(v);
				}
			});
		}
	};

	this.getBckClass = function (i, l, setFirstOpt) {
		if (i == 0) return 'left ' + (setFirstOpt ? 'active' : '');

		if (l == (i + 1)) return l == 2 ? 'right-no-border' : 'right';

		return 'middle'
	};
})();