function LootPreview () {
	var content;
	let fetchCounter = 0;
	const amountOfFetches = 2;
	var self = this;

	this.wnd = {};
	this.tpls = [];
	this.content = [];
	this.reagents = [];
	this.recipePreview  = false;

	this.init = function () {
		this.initWindow();
		this.initFetch();
		this.initCloseBut();
	};

	this.initCloseBut = function () {
		self.wnd.$.find('.close-but').click(self.close)
	};

	this.initFetch = function () {
		g.tplsManager.fetch('p', self.newTplPreview);
		g.tplsManager.fetch('s', self.newOpenItem);
	};

	this.newOpenItem = (i, finish) => {
		this.wnd.$.find('.item-container').append(i.$);
		if (finish) {
			fetchCounter++;
			if (fetchCounter === amountOfFetches) this.afterFetch();
		}
	};

	this.newTplPreview = (i, finish) => {
		if (finish) {
			if (!this.recipePreview) {
				this.wnd.$.find('.scroll-pane').empty();
			}

			fetchCounter++;
			if (fetchCounter === amountOfFetches) self.afterFetch();
		}
	};

	this.afterFetch = () => {
		this.tpls = this.prepareTplsArray();
		this.tpls.map(item => {
			const
				type = this.getType(item.id),
				selfItemAsContent = item.id === this.tplId;
			this.createPreviewItem({ item, type });
		});
	}

	this.createPreviewItem = function ({ item: i, type }) {
		const
			$item = self.getLootPreviewOneItem(),
			destination = self.recipePreview ? `.${type}-list` : '', // default .scroll-pane
			$clone = i.$.clone();

		$item.find('.item-wrapper').append($clone);
		$item.find('.name-wrapper').append(i.name);
		$item.find('.amount-wrapper').append(`x${i.amount}`);
		self.wnd.$.find(`.scroll-pane ${destination}`).append($item);
		$('.scroll-wrapper', content).trigger('update');
	};

	this.prepareTplsArray = () => {
		const items = [...this.content, ...this.reagents];

		return this.sortTpls(items.map(({ id, amount }) => {
			const loc = id === this.tplId ? 's' : 'p';
			const tpl = g.tplsManager.getTplByIdAndLoc(id, loc);
			return {...tpl, ...{ amount }}
		}));
	}

	this.getType = (id) => {
		return this.content.find(x => x.id === id) ? 'content' : 'reagents';
	}

	this.sortTpls = (data) => {
		return Object.values(data).sort((a, b) =>
			b.itemTypeSort - a.itemTypeSort || // sort by type
			b.pr - a.pr ||                     // sort by price
			a.name.localeCompare(b.name)       // sort alphabetically
		);
	};

	this.update = function (v) {
		let desc = '';
		this.tplId = v.tpl_id;
		this.recipePreview = isset(v.reagents);
		this.reagents = [];
		this.content = v.content;
		this.wnd.$.find('.scroll-pane').empty();
		this.wnd.$.find('.item-container').empty();
		if (this.recipePreview) {
			this.setRecipePreview(v);
			desc = _t('desc', null, 'recipe_preview');
			this.wnd.$.addClass('recipe-preview')
		} else {
			desc = v.type === 'lootbox' ? _t('will_get') : _t('shuffle')
			this.wnd.$.removeClass('recipe-preview')
		}
		this.wnd.$.find('.items-txt').html(desc);
	};

	this.setRecipePreview = (v) => {
		this.reagents = v.reagents;
		let recipeContent = self.getRecipePreviewContent();
		this.wnd.$.find('.scroll-pane').html(recipeContent);
		this.wnd.$.find('.content-txt').text(_t('result', null, 'recipe_preview'));
		this.wnd.$.find('.reagents-txt').text(_t('reagents', null, 'recipe_preview'));
	};

	this.initWindow = function () {
		this.wnd.$ = self.getLootPreviewHtml();
		$('body').append(this.wnd.$);
		this.wnd.$.absCenter();
	};

	this.close = function () {
		g.tplsManager.removeCallback('p', self.newTplPreview);
		g.tplsManager.deleteMessItemsByLoc('p');
		g.tplsManager.removeCallback('s', self.newOpenItem);
		g.tplsManager.deleteMessItemsByLoc('s');
		self.wnd.$.remove();
		g.lootPreview = null;
	};

	this.getLootPreviewHtml = function () {
		return $(
			'<div id="loot-preview">' +
			'		<div class="close-but"></div>' +
			'		<div class="item-container"></div>' +
			'		<div class="items-txt"></div>' +
			'		<div class="scroll-wrapper">' +
			'			<div class="scroll-pane"></div>' +
			'		</div>' +
			'</div>'
		);
	};

	this.getLootPreviewOneItem = function () {
		return $(
			'<div class="loot-preview-one-item">' +
			'		<div class="item-wrapper"></div>' +
			'		<div class="name-wrapper"></div>' +
			'       <div class="amount-wrapper"></div>'+
			'</div>'
		);
	};

	this.getRecipePreviewContent = function () {
		return $(`
			<div data-template="recipe-preview-content">
				<div class="content-txt"></div>
				<div class="content-list"></div>
				<div class="reagents-txt"></div>
				<div class="reagents-list"></div>
			</div>
		`);
	};
}
