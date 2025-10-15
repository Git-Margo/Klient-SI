function Recipes (wndEl){
	this.wnd = {};
	this.wndEl = wndEl;

	var self = this;
	var content;
	var showId = null;
	var allRecipe = {};

	this.recipes = [];
	this.items = {};

	var hClasses = {
		'upgraded':'t_upg',
		'unique':'t_uni',
		'heroic':'t_her',
		'legendary':'t_leg',
		'artefact':'t_art'
	};

	this.init = function () {
		this.wnd.$ = this.getRecipesTpl();
		this.initLabels();
		this.initSelect();
		this.initSearch();
		this.initStartLvl();
		this.initStopLvl();
		this.createCloseBut();

		const recipesContentEl = this.wndEl.querySelector('.recipes-content');
		recipesContentEl.innerHTML = '';
		recipesContentEl.appendChild(this.wnd.$[0]);

		g.tplsManager.fetch('c', this.newRecipeItem.bind(this));
	};

	this.getRecipesTpl = () => $(`
		<div id="recipes" class="recipes">
			<div class="recipes-inner">
				<div class="recipe-list-label"></div>
				<div class="recipe-reagent-label"></div>
				<div class="recipe-list-search">
					<input class="search" placeholder="Szukaj">
					<div class="recipe-lvl">Lvl</div>
				</div>
				<div class="recipe-header"></div>
				<div class="recipe-list"></div>
				<div class="choose-recipe">
					<div class="reagent-list-label"></div>
					<div class="recipe-wrapper"></div>
				</div>
				<input class="start-lvl" val=""/>
				<input class="stop-lvl" val=""/>
				<select class="choose-item-type"></select>
				<select class="choose-prof"></select>
			</div>
		</div>
	`);

	this.initLabels = () => {
		this.wnd.$.find('.recipe-list-label').html(goldTxt(_t('exchange_list', null, 'item_changer'), true));
		this.wnd.$.find('.recipe-reagent-label').html(goldTxt(_t('reagents_recipe', null, 'recipes'), true));
		this.wnd.$.find('.recipe-lvl').html('Lvl');
		//<div class="recipe-title"></div>
	};

	this.initSelect = function () {
		var $r = this.wnd.$;
		var prof = {
			all: _t('prof_all', null, 'eq_prof'),
			m: _t('prof_mag', null, 'eq_prof'),
			w: _t('prof_warrior', null, 'eq_prof'),
			p: _t('prof_paladyn', null, 'eq_prof'),
			t: _t('prof_tracker', null, 'eq_prof'),
			h: _t('prof_hunter', null, 'eq_prof'),
			b: _t('prof_bladedancer', null, 'eq_prof')
		};
		var $select1 = $r.find('.choose-prof');

		for (var k in prof) {
			var $option = $('<option>').attr('val', k).html(prof[k]);
			$select1.append($option)
		}

		var type = {
			all: 				_t('type_all' , null, 'auction'),
			unique: 		_t('type_unique' , null, 'auction'),
			heroic: 		_t('type_heroic' , null, 'auction'),
			legendary: 	_t('type_legendary' , null, 'auction')
		};

		var $select2 = $r.find('.choose-item-type');
		for (var k in type) {
			$select2.append($('<option>').attr('val', k).html(type[k]))
		}

		$select1.change(function () {
			self.startFilter();
		});
		$select2.change(function () {
			self.startFilter();
		});
		$r.find('.start-lvl').attr('placeholder', _t('start'));
		$r.find('.stop-lvl').attr('placeholder', _t('stop'));
	};

	this.getValueFromItemType = function () {
		var val = this.wnd.$.find('.choose-item-type option:selected').attr('val');
		if (val == 'all') return;
		var $allRecipes = self.wnd.$.find('.one-recipe-on-list');
		$allRecipes.each(function () {
			if ($(this).css('display') == 'none') return;
			var typeItem = $(this).attr('typeitem');
			var disp;
			switch (val) {
				case 'unique' :
					if (typeItem == 'unique' || typeItem == 'heroic' || typeItem == 'legendary') disp = 'block';
					else disp = 'none';
					break;
				case 'heroic' :
					if (typeItem == 'heroic' || typeItem == 'legendary') disp = 'block';
					else disp = 'none';
					break;
				case 'legendary' :
					if (typeItem == 'legendary') disp = 'block';
					else disp = 'none';
					break;
			}
			$(this).css('display', disp);
		});
	};

	this.getValueFromProf = function () {
		var val = this.wnd.$.find('.choose-prof option:selected').attr('val');
		if (val == 'all') return;
		var $allRecipes = self.wnd.$.find('.one-recipe-on-list');
			$allRecipes.each(function () {
				if ($(this).css('display') == 'none') return;
				var reqp = $(this).attr('reqp');
				var disp = reqp.indexOf(val) > -1 ? 'block' : 'none';
				$(this).css('display', disp);
		});
	};

	this.createRecipesList = function (recipeData, id,  categorySort, nameSortAllCategory) {
		var enabled = recipeData.enabled ? 'enabled' : 'disabled';
		var $one = self.getOneRecipeOnList().addClass('recipe-in-list ' + enabled);
		$one.addClass(`recipe-id-${id}`);
		$one.find('.name').html(recipeData.name);
		self.appendRecipeToGroup($one, recipeData.itemTpl, categorySort, nameSortAllCategory, recipeData.enabled);
		this.recipeClick($one, id);
	};

	this.appendRecipeToGroup = function ($recipe, tplId, categorySort, nameSortAllCategory, enabled) {
		const item = g.tplsManager.getTplByIdAndLoc(tplId, 'c')

		var reqp = 'all';
		var typeItem = 'all';
		var cls = ['unique', 'heroic', 'legendary'];
		let itemCl    = item.cl;
		let stats     = parseItemStat(item.stat);

		if (isset(stats.lvl)) $recipe.attr('lvl', stats.lvl);
		if (isset(stats.reqp)) reqp = stats.reqp;

		for (const cl of cls) {  // @ToDo - remove this loop after rarity changes
			if (item.itemTypeName === cl) typeItem = cl;
		}

		$recipe.attr('typeItem', typeItem);
		$recipe.attr('reqp', reqp);

		if (!isset(nameSortAllCategory[itemCl])) {
			nameSortAllCategory[itemCl] = {
				enabled   : [],
				disabled  : []
			};
		}
		if (enabled) nameSortAllCategory[itemCl].enabled.push($recipe);
		else         nameSortAllCategory[itemCl].disabled.push($recipe);
	};

	this.recipeGroupHtml = function () {
		return $(`
		<div class="recipe-group">
			<div class="group-header">
				<div class="card-graphic"></div>
				<div class="label"></div>
				<div class="direction"></div>
			</div>
			<div class="group-list"></div>
		</div>
		`);
	};

	this.createGroupElement = function (cl, $recipe) {
		var $recipeGroup = self.wnd.$.find('.group-' + cl);
		let $recipeGroupHeader;
		if ($recipeGroup.length < 1) {
			$recipeGroup = self.recipeGroupHtml();
			$recipeGroupHeader = $recipeGroup.find('.group-header');
			$recipeGroup.addClass('group-' + cl);
			$recipeGroup.find('.label').html(_t('au_cat' + cl, null, 'auction'));
			self.wnd.$.find('.recipe-list').append($recipeGroup);
			$recipeGroupHeader.click(function () {
				$recipeGroup.toggleClass('active');
			});
		}
		$recipeGroup.find('.group-list').append($recipe);
	};

	this.createRecipe = function (recipeData, id) {
		var $header = self.getRecipeDescriptionHeader();
		var $reagents = self.getRecipeDescriptionReagents();
		var $button = self.getRecipeDescriptionButton();

		this.createResultItem($header, recipeData.itemTpl);
		this.useRecipeBtn($button, recipeData.enabled);
		this.createReagents($reagents, recipeData);
		$header.find('.recipe-name').html(recipeData.name);
		if (allRecipe[id]) delete allRecipe[id];
		allRecipe[id] = {
			'header': $header,
			'reagents': $reagents,
			'button': $button
		}
	};

	this.createResultItem = function (recipe, tplId) {
		const $icon = this.getRecipeIcon(tplId);
		const $itemSlot = recipe.find('.result-item');
		$itemSlot.append($icon);
	};

	this.createReagents = function (recipe, recipeData) {
		var ingredients = recipeData.ingredients;
		var miss = recipeData.missing;
		for (const ingredient of ingredients) {
			const [tplId, amount] = ingredient;
			const item = this.items[tplId];
			let have;
			const $reagent = self.getRecipeReagent();
			const $itemSlot = $reagent.find('.item-slot');
			const foundMiss = miss && miss.find(el => el[0] === tplId);
			if (foundMiss) {
				const [missTplId, missAmount] = foundMiss;
				$reagent.find('.amount-items').addClass('disabled');
				have = amount - missAmount;
			} else {
				have = amount;
			}
			$reagent.find('.have').html(have);
			$reagent.find('.need').html(amount);
			$reagent.find('.item-name').html(item.name);
			recipe.find('.reagents-list').append($reagent);

			const $icon = this.getRecipeIcon(tplId);
			$itemSlot.append($icon)
		}
	};

	this.cleanList = function () {
		var $w = this.wnd.$;
		$w.find('.recipe-description').remove();
		$w.find('.recipe-in-list').remove();
		$w.find('.empty').css('display', 'block');
	};

	this.useRecipeBtn = function (recipe, canUse) {
		var $btn = $('<button>').addClass('small');
		$btn.html(_t('use_recipe', null, 'recipes'));
		if (!canUse) $btn.attr('disabled', 'disabled');
		recipe.find('.use-recipe-btn').append($btn);
	};

	this.confirmUseRecipe = function (id) {
		_g('craft&a=use&id=' + id);
	};

	this.recipeClick = function (recipe, id) {
		recipe.click(function (e) {
			e.stopPropagation();
			var cl = 'active-recipe';
			self.wnd.$.find('.one-recipe-on-list').removeClass(cl);
			$(this).addClass(cl);
			self.showRecipe(id);
		});
	};

	this.showRecipe = function (id) {
		var $w = self.wnd.$;
		var o = allRecipe[id];
		showId = id;
		$w.find('.mark-offer').removeClass('mark-offer');
		$w.find('.recipe-id-' + id).addClass('mark-offer');
		$w.find('.reagent-list-label').html(_t('reagent_list'));
		$w.find('.choose-recipe').css('display', 'block');
		$w.find('.recipe-header .recipe-description-header').detach();
		$w.find('.recipe-header').html(o.header);
		$w.find('.recipe-wrapper .recipe-description-reagents').detach();
		$w.find('.recipe-wrapper').html(o.reagents);
		$w.find('.recipe-wrapper').append(o.button);
		var $b = self.wnd.$.find('.use-recipe-btn>button');
		if ($b.attr('disabled')) return;
		$b.click(function () {
			self.confirmUseRecipe(id);
		});
	};

	this.startFilter = function () {
		self.wnd.$.find('.one-recipe-on-list').css('display', 'block');
		self.searchKeyUp();
		self.lvlKeyUp();
		self.getValueFromProf();
		self.getValueFromItemType()
	};

	this.initSearch = function () {
		var $search = this.wnd.$.find('.search');
		$search.keyup(function () {
			self.startFilter();
		});
		$search.attr('placeholder', _t('search'));
	};

	this.searchKeyUp = function () {
		var v = self.wnd.$.find('.search').val();
		var $allRecipes = self.wnd.$.find('.one-recipe-on-list');
		if (v == '') {}
		else {
			$allRecipes.each(function () {
				var txt = ($(this).find('.name').html()).toLowerCase();
				var disp = txt.search(v.toLowerCase()) > - 1 ? 'block' : 'none';
				$(this).css('display', disp);
			});
		}
	};

	this.lvlKeyUp = function () {
		var v1 = this.wnd.$.find('.start-lvl').val();
		var v2 = this.wnd.$.find('.stop-lvl').val();
		var $allRecipes = self.wnd.$.find('.one-recipe-on-list');
		if (v1 == '' && v2 == '') return;
		else {
			if (v1 == '') v1 = 0;
			if (v2 == '') v2 = 1000;
			$allRecipes.each(function () {
				if ($(this).css('display') == 'none') return;
				var lvl = $(this).attr('lvl');
				var disp = lvl >= parseInt(v1) && lvl <= parseInt(v2) ? 'block' : 'none';
				$(this).css('display', disp);
			});
		}
	};

	this.initStartLvl = function () {
		var $search = this.wnd.$.find('.start-lvl');
		$search.keyup(function () {
			self.startFilter();
		});
	};

	this.initStopLvl = function () {
		var $search = this.wnd.$.find('.stop-lvl');
		$search.keyup(function () {
			self.startFilter();
		});
	};

	this.getRecipeIcon = function (tplId) {
		const icon = g.tplsManager.getClone(tplId, 'c');
		icon.find('small').remove();
		return icon;
	};

	this.newRecipeItem = function (item, finish) {
		this.items[item.id] = item;
		if (finish) {
			this.createAllRecipes();
		}
	};

	this.showMenuItem = function(e, data, $item) {
		if (isset((parseItemStat(data.stat)).canpreview)) {
			var fun = '_g("moveitem&st=2&tpl=' + data.id + '"); g.tplsManager.deleteMessItemsByLoc("p");g.tplsManager.deleteMessItemsByLoc("s");';
			showMenu(
				{target:$item},
				[
					[_t('show', null, 'item'), fun, true]
				]
			);
		}
	};

	this.update = function (v) {
		this.recipes = v;
	};

	this.createAllRecipes = function () {
		this.wnd.$.css('display', 'block');
		var categorySort = {};
		var nameSortAllCategory = {};
		this.cleanList();

		for (var id in this.recipes) {
			var recipeData = this.recipes[id];

			this.createRecipesList(recipeData, id, categorySort, nameSortAllCategory);
			this.createRecipe(recipeData, id);
		}

		for (var k in nameSortAllCategory) {
			var oneCategory = nameSortAllCategory[k];

			oneCategory.enabled.sort(function (a, b) {
				let nA = $(a).find('.name').html();
				let nB = $(b).find('.name').html();
				return (nA < nB) ? -1 : (nA > nB) ? 1 : 0;
			});

			oneCategory.disabled.sort(function (a, b) {
				let nA = $(a).find('.name').html();
				let nB = $(b).find('.name').html();
				return (nA < nB) ? -1 : (nA > nB) ? 1 : 0;
			});

			for (let e2 in oneCategory.enabled) {
				self.createGroupElement(k, oneCategory.enabled[e2]);
			}

			for (let e1 in oneCategory.disabled) {
				self.createGroupElement(k, oneCategory.disabled[e1]);
			}
		}

		if (showId !== null) self.showRecipe(showId);
		//this.updateScroll();
	};

	this.deleteRecipes = function () {
		for (var k in allRecipe) {
			var r = allRecipe[k];
			delete allRecipe[k];
			r.header.remove();
			r.reagents.remove();
			r.button.remove();
		}
	};

	this.createCloseBut = function () {
		self.wnd.$.find('.close-but').click(this.close);
	};

	this.tLang = function (name ) {
		return _t(name, null, 'recipes');
	};

	this.getOneRecipeOnList = function () {
		return $(
			'<div class="one-recipe-on-list">' +
				//'<div class="item-wrapper">' +
					'<div class="result-item item-slot"></div>' +
				//'</div>' +
				'<div class="name-wrapper">' +
					'<div class="name"></div>' +
				'</div>' +
			'</div>');
	};

	this.getRecipeReagent = function () {
		return $(
			'<div class="recipe-reagent">' +
				'<div class="reagent-wrapper">' +
					'<div class="item-reagent-wrapper">' +
						'<div class="item-reagent item-slot"></div>' +
					'</div>' +
					'<div class="reagent-info">' +
						'<div class="item-name"></div>' +
						'<div class="amount-items">' +
							'<span class="have"></span>/<span class="need"></span>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>');
	};

	this.getRecipeDescriptionHeader = function () {
			return $(
			'<div class="recipe-description-header">' +
				'<div class="item-name-wrapper">' +
					'<div class="result-item item-slot"></div>' +
					'<div class="recipe-name"></div>' +
				'</div>' +
			'</div>'
			);
	};

	this.getRecipeDescriptionReagents = function () {
		return $(
		'<div class="recipe-description-reagents">' +
			'<div class="reagents-list"></div>' +
		'</div>'
		);
	};

	this.getRecipeDescriptionButton = function () {
		return $(
		'<div class="recipe-description-button">' +
			'<div class="use-recipe-btn"></div>' +
		'</div>');
	};

	this.close = () => {
		this.recipes = [];
		this.items = {};
		g.tplsManager.removeCallback('c');
		//self.wnd.$.css('display', 'none');
	}
}

