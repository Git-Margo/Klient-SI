// let Templates = require('../Templates');
// let AuctionData = require('core/auction/AuctionData');

function OneOffer () {

    let $offer;
    let id                  = null;
    let localDuration       = null;
    let itemAttachToSlot    = false;

    const init = (d) => {
        // setD(_d);
        setLocalDuration(d.time);
        setId(d.id);
        init$Offer(d);
        setItemAttachToSlotState(false)
    };

    const setItemAttachToSlotState = (state) => {
        itemAttachToSlot = state;
    };

    const setId = (_id) => {
        id = _id;
    };

    const init$Offer = (d) => {
        let actualKindOfAuction = g.auctions.getActualKindOfAuction();

        $offer = getPrepareOfferToTable(d, actualKindOfAuction);
    };

    const updateOffer = (d) => {
        setLocalDuration(d.time);

        let actualKindOfAuction = g.auctions.getActualKindOfAuction();

        let $newOffer = getPrepareOfferToTable(d, actualKindOfAuction);
        $offer.replaceWith($newOffer);
        $offer = $newOffer;
        setItemAttachToSlotState(false);
    };

    const setLocalDuration = (duration) => {
        localDuration = duration;
    };

    const decreaseLocalDuration = () => {
        localDuration--;
    };

    const checkAuctionIsEnd = () => {
        return localDuration < 0;
    };

    const updateTime = () => {
        decreaseLocalDuration();

        if (checkAuctionIsEnd()) {
            removeOffer();
            g.auctions.removeFromOfferList(id);
            return
        }

        updateTimeInOffer();
    };

    const updateTimeInOffer = () => {
        let $itemTimeTd = $offer.find('.item-time-td').find('.time-wrapper');
        let oldDuration = $itemTimeTd.html();
        let newDuration = getSecondLeft(localDuration, {short:true});

        if (oldDuration == newDuration) return;

        $itemTimeTd.html(newDuration);
    };

    const getItemInSlot = (id) => {
        let $itemSlot   = $('<div>').addClass('item-slot');

        return $itemSlot
    };

    const removeOffer = () => {
        $offer.remove();
    };


    const createTimeCeil = (d) => {
        let $timeWrapper = $('<div>').addClass('time-wrapper');

        let t       = '<br>' + ut_fulltime(ts() / 1000 + d.time);
        let str     = _t("end_time %val%", {"%val%": t}, "end_time_auction");

        $timeWrapper.tip(str);
        $timeWrapper.html(getSecondLeft(d.time, {short:true}));

        return $timeWrapper;
    };

    const getPrepareOfferToTable = (d, actualKindOfAuction) => {
        let id              = d.id;
        let classStr        = 'auction-td center ';
        let isFeatured      = d.is_featured;

        if (isFeatured) classStr += "is-featured ";

        let auctionBidAndBuyNowActions = g.auctions.getAuctionBidAndBuyNowActions()
        let recordWithActionTD = g.auctions.getAuctionWindow().checkTabWithActionTDByActualKindOfAuction(actualKindOfAuction);


        let d1 = [
              getItemInSlot(id),
            getNameWrapper(),
              createTimeCeil(d),
              auctionBidAndBuyNowActions.getBidCeil(d),
              auctionBidAndBuyNowActions.getBuyNowCeil(d)
          ];

        let d2 = [
            classStr + AuctionData.AUCTION_CEIL.ITEM_SLOT_TD.key,
            classStr + AuctionData.AUCTION_CEIL.ITEM_NAME_TD.key,
            //classStr + AuctionData.AUCTION_CEIL.ITEM_LEVEL_TD.key,
            classStr + AuctionData.AUCTION_CEIL.ITEM_TIME_TD.key,
            classStr + AuctionData.AUCTION_CEIL.ITEM_BID_TD.key,
            classStr + AuctionData.AUCTION_CEIL.ITEM_BUY_NOW_TD.key
        ];

        if (recordWithActionTD) {
            d1.push(getAllAction(d));
            d2.push(classStr + AuctionData.AUCTION_CEIL.AUCTION_ACTION_TD.key);
        }

        let $resultOffer = g.auctions.createRecords(d1, d2);

        if (isFeatured) $resultOffer.addClass('is-featured-tr');

        return $resultOffer
    };

    const getNameWrapper = () => {
        return '<span class="auction-item-name"></span><span class="auction-item-lvl"></span>'
    }

    const getAllAction = (d) => {
        let $auctionWrapper         = $('<div>').addClass('auction-wrapper');

        if (d.own_auction) {
            $auctionWrapper.append(getDeleteAuction(d));
        }

        return $auctionWrapper;
    };

    const getDeleteAuction = (d) => {

        let canNotRemoveAuction = g.auctions.tLang('canNotRemoveAuction')
        let removeAuction       = g.auctions.tLang('removeAuction')

        //let tip     = d.bidder ? 'Nie mozna zakonczyc auckji. Przedmiot jest juz licytowany.' : 'Zakoncz aukcje.';
        let tip     = d.bidder ? canNotRemoveAuction : removeAuction;
        let addCl   = d.bidder ? 'inactive' : '';

        let b = drawSIButton('X');
        let $b = $(b);

        $b.on('click', () => {
            if ($b.hasClass('inactive')) return;

            let str         = g.auctions.tLang('removeAuctionConfirm');
            let auctionId   = d.id;

            mAlert(str, 1, [
                () => {g.auctions.getAuctionRequest().deleteAuctionRequest(auctionId)},
                () => {}
            ]);
        })

        $b.tip(tip);
        $b.addClass(addCl);

        return $b;
    };

    const get$Offer = () => {
        return $offer;
    }

    this.init = init;
    this.updateTime = updateTime;
    this.get$Offer = get$Offer;
    this.removeOffer = removeOffer;
    this.updateOffer = updateOffer;
    this.setItemAttachToSlotState = setItemAttachToSlotState;

}