let KIND_LINKED_ITEM = {
	ITEM  : "ITEM",
	TPL   : "TPL"
};

const createShortLinkedItemSpan = (kindLinkedItem, hid, name) => {
	let $span       = $('<span>');

	name        = escapeHTML(name, true);

	$span.html(`[${name}]`);
	$span.addClass('linked-chat-item');

	return $span;
};

const parseReceiveMessageWithLinkedItem = (str, escStringMode, unsecure) => {

	let kindLinkedItem = getKindLinkedItem(str, escStringMode);

	if (kindLinkedItem == null) return;

	let data          = getPrepareDataToCreateElementsArray(str, kindLinkedItem, escStringMode, unsecure);
	let elementsArray = getArrayWith$spanTextAnd$linkedItems(kindLinkedItem, data.htmlString, data.itemsData, unsecure);

	return elementsArray;
};

const checkSendMessageIsItemLinked = (str) => {
	let myRe    = getSendMessagePattern();

	return myRe.exec(str);
};

const getKindLinkedItem = (str, escStringMode) => {

	let isItemLinkedItem = checkIsItemLinkedItem(str, escStringMode);
	let isTplLinkedItem = checkIsTplLinkedItem(str, escStringMode);

	if (isItemLinkedItem) return KIND_LINKED_ITEM.ITEM;
	if (isTplLinkedItem)  return KIND_LINKED_ITEM.TPL;

	console.error('ChatLinkedItemsManager', 'getKindLinkedItem', 'not find KindLinkedItem in string!', str);

	return null;
};

const getPrepareDataToCreateElementsArray = (str, kindLinkedItem, escStringMode, unsecure) => {
	let myRe        = getReceiveMessagePattern(kindLinkedItem, escStringMode);
	let lengthStr   = str.length;
	let counter     = 0;
	let lastIndex   = 0;
	let htmlString  = [];
	let itemsData   = [];
	let myArray;

	while ((myArray = myRe.exec(str)) !== null) {

		let index = myArray.index;

		if (lastIndex < index) {
			let text = str.substr(lastIndex, index - lastIndex);

			htmlString.push(createTxtSpanString(text, unsecure));
			itemsData.push(getItemData(str, kindLinkedItem, index, myArray, escStringMode));
			htmlString.push(createItemSpanString(counter, unsecure));

		} else {
			itemsData.push(getItemData(str, kindLinkedItem, index, myArray, escStringMode));
			htmlString.push(createItemSpanString(counter, unsecure));
		}

		counter++;

		lastIndex = myArray.index + myArray[0].length;
	}

	if (lastIndex != lengthStr) {
		let text = str.substr(lastIndex, lengthStr - 1);

		htmlString.push(createTxtSpanString(text, unsecure));
	}

	return {
		htmlString,
		itemsData
	}
};

const getArrayWith$spanTextAnd$linkedItems = (kindLinkedItem, allText, itemsData) => {
	//let $join         = $('<div>' + allText.join('') + '</div>');
	let $join         = $('<div>').html(allText);
	let elementsArray = [];

	for (let i in itemsData) {
		let d   = itemsData[i];
		let $el = createShortLinkedItemSpan(kindLinkedItem, d.hid, d.name);

		$join.find('.item-'+ i).replaceWith($el);
	}

	$join.children().each(function () {
		elementsArray.push($(this));
	});

	return elementsArray;
};

const createTxtSpanString = (text, unsecure) => {
	//return `<span class="text">${text}</span>`
	//return $('<span>').text(text);
	return unsecure ? `<span class="text">${text}</span>` : $('<span>').text(text);
};

const createItemSpanString = (counter, unsecure) => {
	//return `<span class="item-${counter}"></span>`
	//return $('<span>').addClass(`item-${counter}`);
	return unsecure ? `<span class="item-${counter}"></span>` : $('<span>').addClass(`item-${counter}`);
};


const getItemData = (str, kindLinkedItem, index, myArray, escStringMode) => {
	let text    = myArray[0];
	let params  = text.split(":");
	//let hid     = params[0].replace("ITEM#", '');
	let hid     = params[0].replace(kindLinkedItem + "#", '');

	let valToReplaceAll = escStringMode ? '&quot;' : '"';
	let name            = params[1].replaceAll(valToReplaceAll, '');

	return {
		name:name,
		hid:hid
	}
};

const checkReceiveMessageHaveLinkedItem = (str, escStringMode) => {
	let isItemLinkedItem  = checkIsItemLinkedItem(str, escStringMode);
	let isTplLinkedItem   = checkIsTplLinkedItem(str, escStringMode);

	return isItemLinkedItem || isTplLinkedItem;
};

const checkIsItemLinkedItem = (str, escStringMode) => {
	return checkLinkedItemByKind(KIND_LINKED_ITEM.ITEM, str, escStringMode);
};

const checkIsTplLinkedItem = (str, escStringMode) => {
	return checkLinkedItemByKind(KIND_LINKED_ITEM.TPL, str, escStringMode);
};

const checkLinkedItemByKind = (kindLinkedItem, str, escStringMode) => {
	let re  = getReceiveMessagePattern(kindLinkedItem, escStringMode);

	return re.exec(str) ? true : false
};

const isTplLinkedItem = (str, escStringMode) => {
	let itemRe  = getReceiveMessagePattern(KIND_LINKED_ITEM.TPL, escStringMode);

	return itemRe.exec(str) ? true : false
};

const getReceiveMessagePattern = (kindLinkedItem, escStringMode) => {
	let myRe;

	switch (kindLinkedItem) {
		case KIND_LINKED_ITEM.ITEM:

			if (escStringMode)  myRe = new RegExp(kindLinkedItem + `#([0-9a-z]{64}|[0-9]{7,11}):(\&quot;.*?&quot;)`, "g");
			else                myRe = new RegExp(kindLinkedItem + `#([0-9a-z]{64}|[0-9]{7,11}):(\".*?")`, "g");

			break;
		case KIND_LINKED_ITEM.TPL:

			if (escStringMode)  myRe = new RegExp(kindLinkedItem + `#([0-9]+):(\&quot;.*?&quot;)`, "g");
			else                myRe = new RegExp(kindLinkedItem + `#([0-9]+):(\".*?")`, "g");

			break
	}

	return myRe;
};

const getSendMessagePattern = () => {

	return new RegExp(KIND_LINKED_ITEM.ITEM + '#([0-9a-z]{64}|[0-9]{7,11})+(\\.[a-z]+)?', "g");
};