function AuctionWindow () {

    let content;
    // let wnd;
    let $offersTable        = null;
    let blockGetNextPage    = false;

    const init = () => {
        initWindow();
        setSelectorVars();
        //initDroppable();
        initCards();
        //createButtonAuctionOff();
        createButtonAuctionRenew();
        initScrollBar();
        addPlugToScrollbar();
        initCloseButton();
        initYourAuctionMenuTypeSwitch();
        setChooseCategoryInfo();
    }

    const initYourAuctionMenuTypeSwitch = () => {
        let data = [];

        let e = AuctionData.TYPE_OF_AUCTION.EVENT;
        let n = AuctionData.TYPE_OF_AUCTION.NORMAL;

        data.push({'text': _t(n + '_auction'), 'val': n});
        data.push({'text': _t(e + '_auction'), 'val': e});

        let $switch = $('<div>');

        $switch.createDivideButton(data, 0, true, (val) => {
            let v;

            // console.log(val)

            if (val == AuctionData.TYPE_OF_AUCTION.NORMAL)  v = 0;
            else                                            v = 1;

            g.auctions.setAuctionMode(v);
            //g.auctions.clearRecordList();
            //clearOffersTable();
            //setFirstHeaderOfTable();
            g.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
            g.auctions.getAuctionWindow().setVisibleAllAuctionsInfoWrapper(false);
            g.auctions.getAuctionWindow().setVisibleAmountOfAuction(true);
        });

        content.find('.auction-switch-wrapper').append($switch);
    };

    const initCloseButton = () => {
        content.find('.auction-close-button').click(()=> {
            //g.auctions.getAuctionOffItemPanel().close();
            g.auctions.close();
            //close();
        })
    }

    const addPlugToScrollbar = () => {
        let $scrollAuctionPlug = $('<div>').addClass('scroll-auction-plug');
        $('.scroll-wrapper', content).find('.scrollbar-wrapper').append($scrollAuctionPlug);
    }

    const scrollTop = () => {
        //$('.scroll-wrapper', content).trigger('scrollTop');

        let el = $('.all-auction-section')[0];

        el.scrollTo({
            top: 0,
            left: 0
        });

    };

    const initWindow = () => {
        content = g.auctions.getAuctionTemplates().get('auction-window');

        // wnd = Engine.windowManager.add({
        //     content           : content,
        //     nameWindow        : Engine.windowsData.name.AUCTION_WND2,
        //     title             : Engine.auctions.tLang('auction_title'),
        //     managePosition	  : {position:Engine.windowsData.position.CENTER_OR_STICK_TO_EQ},
        //     onclose: () => {
        //         Engine.auctions.getAuctionOffItemPanel().close();
        //         Engine.auctions.close();
        //         close();
        //     }
        // });
        $('#auction-window').append(content);
        // wnd.center();
    };

    const close = () => {
        // wnd.remove();
        content.remove();
    };

    //const createButtonAuctionOff = () => {
    //    let str     = g.auctions.tLang('auction_off_item');
    //    let $button = createButton(str, ['small', 'green'],  () => {
    //
    //        let actualKindOfAuction = g.auctions.getActualKindOfAuction()
    //
    //        if (actualKindOfAuction != AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF) setMyAuctionOffTabAction();
    //
    //        g.auctions.getAuctionOffItemPanel().manageOfShow();
    //        g.auctions.getAuctionOffItemPanel().manageVisibleElements();
    //    });
    //    content.find('.auction-off-btn-wrapper').append($button)
    //};

    const setMyAuctionOffTabAction = () => {
        g.auctions.getAuctionCards().clickCard(1, null);
        setCardAction(AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF);
    }

    const manageVisibleElements = () => {
        let actualKindOfAuction = g.auctions.getActualKindOfAuction();
        let $renewBtn           = content.find('.auction-renew-btn-wrapper');
        let display             = actualKindOfAuction == AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF ? 'block' : 'none';
        let displayInfoWrapper  = actualKindOfAuction == AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION;

        setVisibleAllAuctionsInfoWrapper(displayInfoWrapper);
        setVisibleAmountOfAuction(!displayInfoWrapper);
        $renewBtn.css('display', display);
    }

    const setChooseCategoryInfo = () => {
        let $info = content.find('.all-auction-info');
        $info.text(g.auctions.tLang('choose_category'));
    };

    const setVisibleAllAuctionsInfoWrapper = (state) => {
        let $infoWrapper = content.find('.all-auction-info-wrapper');
        $infoWrapper.css('display', state ? 'block' : 'none');
    };

    const setVisibleAmountOfAuction = (state) => {
        let $amountOfAuction = content.find('.amount-of-auction');

        $amountOfAuction.css('display', state ? 'block' : 'none');
    }

    const createButtonAuctionRenew = () => {
        let strB     = g.auctions.tLang('renev_all_auction');
        let $button = createButton(strB, ['small', 'green'],  () => {

            let strC     = g.auctions.tLang('renev_all_auction_confirmation');

            confirmWitchTextInput(strC, (val) => {
                renewAllAuction(val);
            })
        });
        content.find('.auction-renew-btn-wrapper').append($button)
    };

    const clearOfferListAndOffersTableAndAttachHeaderOfTable = () => {
        clearAuctionsInTableWithOffers();
        setFirstHeaderOfTable();
    };

    const clearAuctionsInTableWithOffers = () => {
        g.auctions.clearOfferList();
        g.auctions.clearPairItemIdOfferIdObject();
        clearOffersTable();
    };

    const renewAllAuction = (val) => {
        g.auctions.getAuctionRequest().renewAllAuctionRequest(val);
    };

    const initScrollBar = () => {
        let el = $('.all-auction-section')[0];

        el.onscroll = function(e) {
            if (!checkIsScrollBottom()) return;

            if (blockGetNextPage) return;

            blockGetNextPage = true;
            setTimeout(() => {
                blockGetNextPage = false
            }, 500);

            scrollMove();
        };
    };

    const scrollMove = (e) => {
        let auctionPages = g.auctions.getAuctionPages();
        auctionPages.getNextPageAction();
    };

    const checkIsScrollBottom = () => {
        let el = $('.all-auction-section')[0];

        return el.scrollTop + el.offsetHeight >= el.scrollHeight - 1 && el.scrollTop + el.offsetHeight <= el.scrollHeight + 1;
    };

    const getContent = () => {
        return content
    };

    const setSelectorVars = () => {
        $offersTable        = content.find('.auction-table')
    };

    const clearOffersTable = () => {
        $offersTable.empty();
        content.find('.auction-table-header').empty();
    };

    const addToOffersTable = ($offer, prepend) => {
        if (prepend)    $offersTable.prepend($offer);
        else            $offersTable.append($offer);
    };

    const getSortVal = (_sorType) => {

        let auctionSort = g.auctions.getAuctionSort();
        let sortType    = auctionSort.getSortType();

        if (sortType != _sorType) return null;

        let sortOrder = auctionSort.getSortOrder();
        switch (sortOrder) {
            case  AuctionData.SORT_ORDER.ASC:  return false;
            case  AuctionData.SORT_ORDER.DESC: return true;
            default : errorReport('AuctionManager', "getSortVal", 'Bad val of sortOrder:'+ sortOrder);
        }

        return null;
    };

    const checkTabWithActionTDByActualKindOfAuction = (actualKindOfAuction) => {
        let recordWithAction = null;

        if (actualKindOfAuction == AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION || actualKindOfAuction == AuctionData.KIND_MY_AUCTION.MY_BID) recordWithAction = false;
        else recordWithAction = true;

        return recordWithAction
    }

    const getSortedData = (actualKindOfAuction) => {

        let recordWithActionTD = checkTabWithActionTDByActualKindOfAuction(actualKindOfAuction);

        if (recordWithActionTD) return {
            [AuctionData.AUCTION_CEIL.ITEM_SLOT_TD.key]     : null,
            [AuctionData.AUCTION_CEIL.ITEM_NAME_TD.key]     : getSortVal(AuctionData.AUCTION_CEIL.ITEM_NAME_TD.sort),
            [AuctionData.AUCTION_CEIL.ITEM_TIME_TD.key]     : getSortVal(AuctionData.AUCTION_CEIL.ITEM_TIME_TD.sort),
            [AuctionData.AUCTION_CEIL.ITEM_BID_TD.key]      : getSortVal(AuctionData.AUCTION_CEIL.ITEM_BID_TD.sort),
            [AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.key]  : getSortVal(AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.sort),
            [AuctionData.AUCTION_CEIL.AUCTION_ACTION_TD.key]: null
        };

        if (!recordWithActionTD) return {
            [AuctionData.AUCTION_CEIL.ITEM_SLOT_TD.key]     : null,
            [AuctionData.AUCTION_CEIL.ITEM_NAME_TD.key]     : getSortVal(AuctionData.AUCTION_CEIL.ITEM_NAME_TD.sort),
            [AuctionData.AUCTION_CEIL.ITEM_TIME_TD.key]     : getSortVal(AuctionData.AUCTION_CEIL.ITEM_TIME_TD.sort),
            [AuctionData.AUCTION_CEIL.ITEM_BID_TD.key]      : getSortVal(AuctionData.AUCTION_CEIL.ITEM_BID_TD.sort),
            [AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.key]  : getSortVal(AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.sort)
        };
    };

    const setFirstHeaderOfTable = () => {
        let actualKindOfAuction = g.auctions.getActualKindOfAuction();
        let $tableHeader        = content.find('.auction-table-header');
        let $header             = createHeaderToTab(actualKindOfAuction, getSortedData(actualKindOfAuction));

        $tableHeader.append($header);

        scrollTop();
    };

    const getClassToElAndSortedDirection = (sortedData, name) => {
        let sortedVal;

        if (sortedData[name] == null)   sortedVal = '';
        else                            sortedVal = 'sort-arrow ' + (sortedData[name] ? 'sort-arrow-up' : 'sort-arrow-down');

        return name + ' ' + sortedVal;
    };

    const createHeaderToTab = (actualKindOfAuction, sortedData) => {

        let classStr1           = 'header-auction-td center ';
        let classStr2           = 'header-auction-td center hover-td ';
        let auctionSort         = g.auctions.getAuctionSort();
        let recordWithActionTD  = checkTabWithActionTDByActualKindOfAuction(actualKindOfAuction);


        let d1 = [
            'Item',
            $('<span>').html(_t('name_th', null, 'auction')),
            $('<span>').html(_t('au_time', null, 'auction')),
            $('<span>').html(_t('price_bid', null, 'auction')),
            $('<span>').html(_t('filter_buyout', null, 'auction'))
            //$('<span>').html(_t('clan_action', null, 'clan')),
        ];

        let d2 = [
            classStr1 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_SLOT_TD.key),
            classStr2 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_NAME_TD.key),
            classStr2 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_TIME_TD.key),
            classStr2 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_BID_TD.key),
            classStr2 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.key)
            //classStr1 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.AUCTION_ACTION_TD.key)
        ];

        let d3 = [
            false,
            () => {auctionSort.callChangeSort(AuctionData.AUCTION_CEIL.ITEM_NAME_TD.sort)},
            () => {auctionSort.callChangeSort(AuctionData.AUCTION_CEIL.ITEM_TIME_TD.sort)},
            () => {auctionSort.callChangeSort(AuctionData.AUCTION_CEIL.ITEM_BID_TD.sort)},
            () => {auctionSort.callChangeSort(AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.sort)}
            //false
        ];

        if (recordWithActionTD) {
            d1.push($('<span>').html(_t('clan_action', null, 'clan')));

            d2.push(classStr1 + getClassToElAndSortedDirection(sortedData, AuctionData.AUCTION_CEIL.AUCTION_ACTION_TD.key));

            d3.push(false)
        }


        let $offer = g.auctions.createRecords(d1,d2,d3)

        return $offer
    };

    //const initDroppable = () => {
    //    content.find('.add-item-section').find('.item-slot').droppable({
    //        accept: '.inventory-item',
    //        drop: function (e, ui) {
    //            ui.draggable.css('opacity', '');
    //            setAuctionOffItem(ui.draggable.data('item'), false);
    //        }
    //    });
    //};

    const initCards = () => {
        let con   = content.find('.cards-header');
        let str1  = _t('tab_others_auctions', null, 'auction'); //"Aukcje Graczy";
        let str2  = _t('tab_my', null, 'auction'); //"Twoje Aukcje";
        // let str3  = _t('tab_observed', null, 'auction'); //"Obserwowane";
        let str4  = _t('tab_au_catmybids', null, 'auction'); //"Licytowane";

        let auctionCards = g.auctions.getAuctionCards();

        auctionCards.newCard(con, str1, function () {
            setCardAction(AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION)
        } );
        auctionCards.newCard(con, str2, function () {
            setCardAction(AuctionData.KIND_MY_AUCTION.MY_AUCTION_OFF)
        });
        auctionCards.newCard(con, str4, function () {
            setCardAction(AuctionData.KIND_MY_AUCTION.MY_BID)
        });

        setFirstCard();
    };

    const setCardAction = (_actualKindOfAuction) => {
        setCard(_actualKindOfAuction);
        manageVisibleElements();
        //g.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();

        if (_actualKindOfAuction == AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION)    g.auctions.clearAllStates();
        else                                                                        g.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
    }

    const setFirstCard = () => {
        g.auctions.getAuctionCards().clickCard(0, null);
        setCard(AuctionData.KIND_OTHERS_AUCTION.ALL_AUCTION);
        manageVisibleElements();
    }

    const setCard = (_actualKindOfAuction) => {
        //g.auctions.clearAllStates();
        g.auctions.getAuctionItemCategory().clearItemCategory();
        g.auctions.setActualKindOfAuction(_actualKindOfAuction);
        //setFirstHeaderOfTable();
    }

    const updateAmountOfAuction = () => {
        //let maxPages    = Engine.auctions.getAuctionPages().getMaxPage();
        let str         = _t('quantity_of_auction', null, 'auction');
        let itemsTotal  = g.auctions.getTotalOffers();

        //content.find('.amount-of-auction').html(`${str}: ${maxPages * AuctionData.MAX_QUANTITY_OF_ITEMS_PACKAGE}`);
        content.find('.amount-of-auction').html(`${str}: ${itemsTotal}`);
    };

    //const updateScroll = () => {
    //    $('.scroll-wrapper', content).trigger('update');
    //};

    //const updateBarPos = () => {
    //    $('.scroll-wrapper', content).trigger('updateBarPos');
    //};

    const stopDragBar = () => {
        let $el = $('.all-auction-section');
        let el = $el[0];

        el.scrollTo({
            top : el.scrollTop,
            left: 0
        });

    };

    this.init = init;
    this.close = close;
    this.initCards = initCards;
    this.stopDragBar = stopDragBar;
    //this.updateScroll = updateScroll;
    //this.updateBarPos = updateBarPos;
    this.updateAmountOfAuction = updateAmountOfAuction;
    this.setFirstHeaderOfTable = setFirstHeaderOfTable;
    this.checkTabWithActionTDByActualKindOfAuction = checkTabWithActionTDByActualKindOfAuction;
    this.setCard = setCard;
    this.getContent = getContent;
    this.addToOffersTable = addToOffersTable;
    this.clearOffersTable = clearOffersTable;
    this.scrollTop = scrollTop;
    this.setSelectorVars = setSelectorVars;
    this.setMyAuctionOffTabAction = setMyAuctionOffTabAction;
    this.initScrollBar = initScrollBar;
    this.clearAuctionsInTableWithOffers = clearAuctionsInTableWithOffers;
    this.clearOfferListAndOffersTableAndAttachHeaderOfTable = clearOfferListAndOffersTableAndAttachHeaderOfTable;
    this.setVisibleAllAuctionsInfoWrapper = setVisibleAllAuctionsInfoWrapper;
    this.setVisibleAmountOfAuction = setVisibleAmountOfAuction;

}
