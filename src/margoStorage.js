
function MargoStorage () {
	var ls = localStorage;
	var storageName = 'MargonemOld';
	var data = null;

	var save = function () {
		ls.setItem(storageName, JSON.stringify(data));
	};

	this.get = function (name, default_value) {
		var path = name.split('/');
		var root = data;
		while (path.length) {
			var first = path.splice(0, 1)[0];
			if (typeof(root[first]) != 'undefined') root = root[first];
			else {
				return typeof(default_value) == 'undefined' ? null : default_value;
			}
		}
		return root;
	};

	this.set = function (name, value) {
		var path = name.split('/');
		var root = data;
		while (path.length > 1) {
			var first = path.splice(0, 1)[0];
			if (typeof(root[first]) == 'undefined') root[first] = {};
			root = root[first];
		}
		root[path[0]] = value;
		save();
	};

	this.remove = function (name) {
		var path = name.split('/');
		var root = data;
		var propertyToRemove = path.splice(0, 1)[0];
		while (path.length >= 1) {
			root = root[propertyToRemove];
			propertyToRemove = path.splice(0, 1)[0];
		}
		if (typeof(root[propertyToRemove]) == 'undefined') throw name + " not found in storage";
		delete(root[propertyToRemove]);
		save();
	};

	data = JSON.parse(ls.getItem(storageName));
	if (data == null) {
		data = {};
		save();
	}
}

margoStorage = new MargoStorage();