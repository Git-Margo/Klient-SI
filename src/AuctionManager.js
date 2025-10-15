function AuctionManager () {

    let featuredCount       = null;
    let totalOffers          = null;
    let auctionMode         = 0;
    let actualKindOfAuction = null;
    let offerList          = null;
    let pairItemIdOfferIdObject = null;
    let auctionsConfig          = null;

    let auctionTemplates               = null;
    let auctionWindow               = null;
    let auctionRequest                = null;
    let auctionTime                = null;
    let auctionSort                 = null;
    let auctionPages                = null;
    let auctionItems               = null;
    let auctionOffItemPanel         = null;
    let auctionSearchItems          = null;
    let auctionItemCategory         = null;
    let auctionCards                = null;
    let auctionBidAndBuyNowActions  = null;

    const init = () => {
        g.windowCloseManager.callWindowCloseConfig(g.windowsData.windowCloseConfig.AUCTION)
        clearOfferList();
        clearPairItemIdOfferIdObject();
        createSupportedClass();
        initSupportedClass();
        addLock();
    };

    const createSupportedClass = () => {
        auctionTemplates = new AuctionTemplates();
        auctionRequest = new AuctionRequest();
        auctionTime = new AuctionTime();
        auctionPages = new AuctionPages();
        auctionSort = new AuctionSort();
        auctionWindow = new AuctionWindow();
        auctionItems = new AuctionItems();
        auctionOffItemPanel = new AuctionOffItemPanel();
        auctionCards = new AuctionCards();
        auctionSearchItems = new AuctionSearchItems();
        auctionItemCategory = new AuctionItemCategory();
        auctionBidAndBuyNowActions = new AuctionBidAndBuyNowActions()
    };

    const initSupportedClass = () => {
        auctionTemplates.init();
        auctionTime.init();
        auctionRequest.init();
        auctionSort.init();
        auctionPages.init();
        auctionCards.init();
        auctionWindow.init();
        auctionItems.init();
        auctionBidAndBuyNowActions.init();
        auctionSearchItems.init();
        auctionItemCategory.init();
        auctionOffItemPanel.init();
    }

    const updateData = (data) => {
        if (data.configuration) {
            setConfig(data.configuration)
        }

        if (data.status) {
            if (isset(data.status.featuredCount)) {
                setFeaturedCount(data.status.featuredCount);
                auctionOffItemPanel.manageVisibleSpecialOffer();
                auctionOffItemPanel.updateCheckbox();
            }
        }

        if (data.add) {
            let isExist = checkOfferExistInList(data.add.id);
            if (!isExist) incrementTotalOffers();

            if (actualKindOfAuction == AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF) {
                updateNormalAuction([data.add], true, actualKindOfAuction);
                if (!isExist) auctionWindow.scrollTop();
            }
            else {
                updateNormalAuction([data.add], false, actualKindOfAuction);
            }
            auctionWindow.updateAmountOfAuction();
        }

        if (data.remove) {
            decrementTotalOffers();
            removeFromOfferList(data.remove);
            //auctionWindow.updateScroll();
            auctionWindow.updateAmountOfAuction();
        }

        if (data.show) {
            let kind    = data.show.tab;
            let offers  = data.show.offers;

            if (kind != actualKindOfAuction) return;

            if (isset(data.show.totalOffers)) updateTotalOffers(data.show.totalOffers);

            if (data.show.page) {
                auctionPages.updatePages(data.show.page);
                auctionWindow.updateAmountOfAuction();
            }

            let currentPage = auctionPages.getCurrentPage();
            let maxPage     = auctionPages.getMaxPage();

            let firstPageUpdate = currentPage == 1 || maxPage == 0;

            if (firstPageUpdate) {
                let showCategoryExist = auctionItemCategory.isShowCategoryExist();

                if (showCategoryExist) {
                    auctionWindow.clearOfferListAndOffersTableAndAttachHeaderOfTable();
                } else {
                    clearAllStates();
                    auctionWindow.setFirstHeaderOfTable();
                }
            }

            updateNormalAuction(offers, false, actualKindOfAuction);

            //if (firstPageUpdate) auctionWindow.updateScroll();

            //auctionWindow.updateBarPos()
        }

    };

    const updateTotalOffers = (_totalOffers) => {
        setTotalOffers(_totalOffers);
    };

    const setTotalOffers = (_totalOffers) => {
        totalOffers = _totalOffers;
    };

    const getTotalOffers = () => {
        return totalOffers;
    };

    const decrementTotalOffers = () => {
        if (totalOffers == null) {
            console.error('AuctionManager.js', 'decrementTotalOffers', 'Can not decrement totalOffers, totalOffers = null!');
            return;
        }
        setTotalOffers(totalOffers - 1);
    };

    const incrementTotalOffers = () => {
        if (totalOffers == null) {
            console.error('AuctionManager.js', 'incrementTotalOffers', 'Can not increment totalOffers, totalOffers = null!');
            return;
        }
        setTotalOffers(totalOffers + 1);
    };

    const updateNormalAuction = (data, prepend, _actualKindOfAuction) => {

        //auctionItems.updateFetch();

        for (let k in data) {

            let d       = data[k];
            let offerId = d.id;
            let itemId  = d.item_id;
            let isExist = checkOfferExistInList(offerId);

            let oneOffer;

            if (isExist) {
                oneOffer = getOneOffer(offerId);
                oneOffer.updateOffer(d)
            } else {
                oneOffer = new OneOffer();
                oneOffer.init(d, _actualKindOfAuction);

                addToOfferList(offerId, oneOffer);
                addToPairItemIdOfferIdObject(itemId, offerId);
            }

            let itemExistInFetchItem = auctionItems.checkItemExistInAllFetchItems(itemId);
            if (itemExistInFetchItem) auctionItems.attachIconToSlotProcedure(itemId);

            let $offer = oneOffer.get$Offer();

            if (!isExist) auctionWindow.addToOffersTable($offer, prepend);
        }
    };

    const close = () => {
        auctionOffItemPanel.close();
        auctionTime.destroy();

        g.disableItemsManager.endSpecificItemKindDisable(g.disableItemsManager.CONST.AUCTION);
        g.auctions = false;
        removeLock();
        auctionWindow.close();
    };

    const addLock = () => {
        g.lock.add('auctions');
    };

    const removeLock = () => {
        g.lock.remove('auctions');
    };

    const getAuctionWindow = () => {
        return auctionWindow;
    };

    const getAuctionRequest = () => {
        return auctionRequest;
    }

    const getAuctionSearchItems = () => {
        return auctionSearchItems;
    };

    const getAuctionItemCategory = () => {
        return auctionItemCategory;
    };

    const getAuctionTemplates = () => {
        return auctionTemplates;
    };

    const getAuctionSort = () => {
        return auctionSort;
    };

    const getAuctionItems = () => {
        return auctionItems;
    };

    const getAuctionCards = () => {
        return auctionCards;
    };

    const getAuctionOffItemPanel = () => {
        return auctionOffItemPanel;
    };

    const getAuctionPages = () => {
        return auctionPages;
    };

    const getAuctionBidAndBuyNowActions = () => {
        return auctionBidAndBuyNowActions;
    };

    const putAuctionOffItem = (itemData) => {
        if (actualKindOfAuction != AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF) auctionWindow.setMyAuctionOffTabAction();
        auctionOffItemPanel.manageOfShow(itemData);
        auctionOffItemPanel.putAuctionOffItem(itemData);
    };

    //const clearAuctionsInTableWithOffers = () => {
    //    clearOfferList();
    //    auctionWindow.clearOffersTable();
    //};

    const clearAllStates = () => {
        auctionItemCategory.clearItemCategory();
        // auctionSort.setStandardSort();
        auctionWindow.clearAuctionsInTableWithOffers();
    };

    const setActualKindOfAuction = (_actualKindOfAuction) => {
        actualKindOfAuction = _actualKindOfAuction;
    };

    const updateTimeOfAuction = () => {
        for (let k in offerList) {
            offerList[k].updateTime();
        }
    };

    const setFeaturedCount = (_featuredCount) => {
        // console.log(featuredCount)
        featuredCount = _featuredCount
    };

    const getFeaturedCount = () => {
        return featuredCount;
    };

    const removeFromOfferList = (id) => {
        offerList[id].removeOffer();
        delete offerList[id];
    };


    const getOneOfferByItemId = (itemId) => {

        let offerId = pairItemIdOfferIdObject[itemId];
        if (offerId == null) return null;

        return getOneOffer(offerId);
    };

    const addToPairItemIdOfferIdObject = (itemId, offerId) => {
        pairItemIdOfferIdObject[itemId] = offerId;
    };

    const addToOfferList = (id, offer) => {
        offerList[id] = offer
    };

    const checkOfferExistInList = (id) => {
        return offerList[id] ? true : false;
    };

    const getOneOffer = (id) => {
        return offerList[id];
    };

    const clearOfferList = () => {
        offerList = {};
    };

    const clearPairItemIdOfferIdObject = () => {
        pairItemIdOfferIdObject = {};
    };

    const getActualKindOfAuction = () => {
        return actualKindOfAuction;
    };

    const getAuctionMode = () => {
        return auctionMode
    };

    const setAuctionMode = (_auctionMode) => {
        auctionMode = _auctionMode
    };

    const getConfig = () => {
        return auctionsConfig;
    };

    const setConfig = (_auctionsConfig) => {
        auctionsConfig = _auctionsConfig
    };

    const tLang = (key) => {
        return _t(key, null, 'auction');
    }

    const createRecords = (ob, addClass, callback) => {
        var $tr = $('<tr>');
        for (var i = 0; i < ob.length; i++) {
            var $td = $('<td>').html(ob[i]);

            if (typeof addClass == 'object')  $td.addClass(addClass[i]);
            else                              $td.addClass(addClass);

            offerCallback ($td, callback, i);

            $tr.append($td);
        }
        return $tr;
    };

    function offerCallback ($td, callback, i) {
        if (callback && callback[i])  $td.on('click', () => {callback[i]()});
    }

    this.init = init;
    this.close = close;

    this.tLang = tLang;
    this.updateData = updateData;
    this.updateTimeOfAuction = updateTimeOfAuction;

    this.getAuctionBidAndBuyNowActions = getAuctionBidAndBuyNowActions;
    this.getAuctionWindow = getAuctionWindow;
    this.getAuctionItems = getAuctionItems;
    this.getAuctionCards = getAuctionCards;
    this.getAuctionOffItemPanel = getAuctionOffItemPanel;
    this.getAuctionPages = getAuctionPages;
    this.getAuctionSort = getAuctionSort;
    this.getAuctionRequest = getAuctionRequest;
    this.getAuctionSearchItems = getAuctionSearchItems;
    this.getAuctionItemCategory = getAuctionItemCategory;
    this.getAuctionTemplates = getAuctionTemplates;

    this.getTotalOffers = getTotalOffers;
    this.getOneOfferByItemId = getOneOfferByItemId;
    this.getFeaturedCount = getFeaturedCount;
    this.getOneOffer = getOneOffer;
    this.getActualKindOfAuction = getActualKindOfAuction;
    this.getAuctionMode = getAuctionMode;
    this.setActualKindOfAuction = setActualKindOfAuction;
    this.setAuctionMode = setAuctionMode;
    this.createRecords = createRecords;
    this.getConfig = getConfig;

    this.removeFromOfferList = removeFromOfferList;
    this.clearOfferList = clearOfferList;
    this.clearPairItemIdOfferIdObject = clearPairItemIdOfferIdObject;
    this.putAuctionOffItem = putAuctionOffItem;
    this.clearAllStates = clearAllStates;
    // this.clearAllStates = clearAllStates;
}
