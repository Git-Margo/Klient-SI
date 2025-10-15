// let AuctionData = require('core/auction/AuctionData');

function AuctionItems() {

    let allFetchItems       = {};

    const init = () => {
        initDisableItems()
    }

    const newReceivedItem = (item) => {
        if (!allFetchItems[item.id]) allFetchItems[item.id] = item;
        attachIconToSlotProcedure(item.id);
    }

    const initDisableItems = () => {
        const AUCTION = "AUCTION";
        g.disableItemsManager.startSpecificItemKindDisable(g.disableItemsManager.CONST.AUCTION);
    };

    const checkItemExistInAllFetchItems = (itemId) => {
        return allFetchItems[itemId] ? true : false;
    };

    // const newAuctionItem = (i) => {
    //     let id = i.id;
    //     allFetchItems[id] = i;
    //
    //     let itemExistInFetchItem = checkItemExistInAllFetchItems(id);
    //     if (itemExistInFetchItem) attachIconToSlotProcedure(id);
    //     attachIconToSlotProcedure(id);
    // };

    const attachIconToSlotProcedure = (itemId) => {
        let itemData    = allFetchItems[itemId];
        let oneOffer   = g.auctions.getOneOfferByItemId(itemId);

        if (oneOffer == null) return;

        let $offer     = oneOffer.get$Offer();

        attachItemDataToSlotInOffer(itemData, itemId, $offer);
        oneOffer.setItemAttachToSlotState(true)
    };

    const attachItemDataToSlotInOffer = (itemData, itemId, $offer) => {

        const $icon = g.item[itemId].$item.clone();

        // attackRightClickToToCloneItem($icon, itemData);

        let stat = parseItemStat(itemData.stat);

        $offer.find('.' + AuctionData.AUCTION_CEIL.ITEM_NAME_TD.key).find('.auction-item-name').html(itemData.name);
        $offer.find('.' + AuctionData.AUCTION_CEIL.ITEM_NAME_TD.key).find('.auction-item-lvl').html(stat.lvl ? ' (' + stat.lvl + ')' : '');
        $offer.find('.' + AuctionData.AUCTION_CEIL.ITEM_SLOT_TD.key).find('.item-slot').empty().append($icon);
    };

    const attackRightClickToToCloneItem = ($item, itemData) => {
        $item.contextmenu(function (e, mE) {
            itemData.createOptionMenu(getE(e, mE), false);
        });
    };

    const getItemName = (itemId) => {
        if (!allFetchItems[itemId]) {
            console.error('AuctionManager', 'getItemName', 'Item not exist: '+ itemId, allFetchItems);
            return '';
        }
        return allFetchItems[itemId].name
    };


    this.init = init;
    //this.updateFetch = updateFetch;
    this.newReceivedItem = newReceivedItem;
    this.checkItemExistInAllFetchItems = checkItemExistInAllFetchItems;
    this.getItemName = getItemName;
    this.attachIconToSlotProcedure = attachIconToSlotProcedure;

}