function AuctionOffItemPanel () {

    // let $auctionContent     = null;
    let auctionOffButton    = null;
    let content             = null;
    let auctionOffItem      = null;
    let wnd                 = null;

    const init = () => {
        // $auctionContent = _$auctionContent;
        //$auctionContent = g.auctions.getAuctionWindow().getContent();

        initWindow();
        createInputs();
        initRemoveAuctionOffItemEvent();
        createButtonAuctionOff();
        createButtonCloseAuctionOff();
        createSpecialFeatureCheckbox();
        prepareCurrencyIcon();
        createPlaceHoldersInInput();
        setTipInElements();
        initCloseButton();
        initLabels();
    }

    const initCloseButton = () => {
        let $btn = content.find('.auction-off-item-panel-close');
        $btn.on('click', () => {
            hideAndUnsetAuctionItemOff()
        })
    }


    const initLabels = () => {
        content.find('.auction-bid').find('.label').html(g.auctions.tLang('filter_bid'))
        content.find('.auction-additional-gold-payment').find('.label').html(g.auctions.tLang('auction-additional-gold-payment'))
        content.find('.auction-buy-now').find('.label').html(g.auctions.tLang('auction-buy-now'))
        content.find('.auction-duration').find('.label').html(g.auctions.tLang('auction-duration'))
        content.find('.auction-tax').find('.tax-label').html(g.auctions.tLang('auction-tax'))
        content.find('.auction-cost').find('.cost-label').html(g.auctions.tLang('auction-cost'))
    }

    const setTipInElements = () => {
        content.find('.buy-info-icon').tip(_t('break_soulbound_info'))
    }

    const createInputs = () => {
        content.find('.auction-bid').append(createSiInput({}));
        content.find('.auction-additional-gold-payment').append(createSiInput({}));
        content.find('.auction-buy-now').append(createSiInput({}));
        content.find('.auction-duration').append(createSiInput({type:'number'}));
    }

    const createPlaceHoldersInInput = () => {
        createInputPlaceholder('Min. 500', content.find('.auction-buy-now').find('input'));
        createInputPlaceholder('Min. 500', content.find('.auction-bid').find('input'));
        createInputPlaceholder('Min. 500', content.find('.auction-additional-gold-payment').find('input'));
        createInputPlaceholder('2-168', content.find('.auction-duration').find('input'));
    }

    const allInputChangeTrigger = () => {
        content.find('.auction-buy-now').find('input').trigger('change');
        content.find('.auction-bid').find('input').trigger('change');
        content.find('.auction-additional-gold-payment').find('input').trigger('change');
        content.find('.auction-duration').find('input').trigger('change');
    }

    const prepareCurrencyIcon = () => {
        let $gold   = createSmallGoldIcon(0);
        let $sl     = createSmallDraconiteIcon(AuctionData.COST_FEATURED_AUCTION);

        let $auctionCost = content.find('.auction-cost').find('.second-span');

        $auctionCost.append($gold);
        $auctionCost.append($sl)
    }

    const getCheckboxText = (active) => {
        let featuredCount   = g.auctions.getFeaturedCount();
        let v               = featuredCount + (active ? 1 : 0);
        let str             = g.auctions.tLang('featured_offer');

        return `${str} (${v}/${AuctionData.MAX_FEATURED_COUNT})`;
    }

    const createSpecialFeatureCheckbox = () => {

        let txt = getCheckboxText(false);
        let $oneCheckbox = createSiCheckBox(txt, '', () => {

            //let active  = getIsFeatured();

            updateCheckbox();
            manageVisibleElements();
        });
        content.find('.special-offer').append($oneCheckbox);
    };

    const updateCheckbox = () => {
        let active  = getIsFeatured();
        updateCheckBoxLabel(active);
    };

    const updateCheckBoxLabel = (active) => {
        let txt     = getCheckboxText(active);

        content.find('.special-offer').find('.one-checkbox').find('.label').html(txt);
    };

    const manageVisibleElements = () => {
        let isAuctionOffItem    = checkAuctionOffItem();
        let isSoulbound         = isAuctionOffItem && checkSoulbound(auctionOffItem);
        let active              = getIsFeatured();

        manageVisibleSpecialOffer();

        if (isAuctionOffItem) {
            let val = getAuctionCostByPatern(auctionOffItem);
            setValOfGoldIconAndVal(val);
            setVisibleGoldIconAndVal(true);

        } else {
            setVisibleGoldIconAndVal(false);
        }

        if (active) {

            if (isSoulbound) {
                setVisibleAdditionalGoldPayment(true);
                setVisibleAdditionalSoulboundPayment(true);
                setVisibleAuctionBid(false);
                setVisibleBuyIconInfo(true);

                let v = getUnbindCost(auctionOffItem) + _t('sl');

                setStatesOfBuyNowInput(true, v);
            } else {
                setVisibleAdditionalGoldPayment(false);
                setVisibleAdditionalSoulboundPayment(false);
                setVisibleAuctionBid(true);
                setVisibleBuyIconInfo(false);

                manageValOfBuyNowWhenAuctionIsNotFeatured()
            }

            setVisibleDraconiteIconAndVal(true);
            setStatesOfAuctionDuration(true, 336);

        } else {

            if (isSoulbound) {
                setVisibleAdditionalGoldPayment(true);
                setVisibleAdditionalSoulboundPayment(true);
                setVisibleAuctionBid(false);
                //setStatesOfAuctionDuration(true, 48);
                setVisibleBuyIconInfo(true);

                let v = getUnbindCost(auctionOffItem) + _t('sl');
                setStatesOfBuyNowInput(true, v);

            } else {

                setVisibleAdditionalGoldPayment(false);
                setVisibleAdditionalSoulboundPayment(false);
                setVisibleAuctionBid(true);
                //setStatesOfBuyNowInput(false, '');
                //setStatesOfAuctionDuration(false, 48);
                setVisibleBuyIconInfo(false);

                manageValOfBuyNowWhenAuctionIsNotFeatured();
            }

            setStatesOfAuctionDuration(false, 168);
            setVisibleDraconiteIconAndVal(false);

        }

        setTaxValue(isSoulbound);
        allInputChangeTrigger();

    }

    const getUnbindCost = (itemData) => {
        return isset(itemData.unbindCost) ? itemData.unbindCost : null
    }

    const initWindow = () => {
        content = g.auctions.getAuctionTemplates().get('auction-off-item-panel');

        $('#auction-off-item-panel').append(content);

        hide();
    };

    const close = () => {
        removeAuctionOffItemAndManageVisibleElements();
        content.remove();
    }

    const createButtonCloseAuctionOff = () => {
        let button = createButton(_t('cancel'), ['small'],  () => {
            hideAndUnsetAuctionItemOff();
        });

        content.find('.auction-off-btn-wrapper').append($(button));
    }

    const createButtonAuctionOff = () => {
        let str = g.auctions.tLang('au_create');
        auctionOffButton = createButton(str, ['small', 'green'],  () => {
            setAuctionOffAction();
        });

        let $button = $(auctionOffButton);

        content.find('.auction-off-btn-wrapper').append($button)
    };

    const setAuctionOffAction = () => {
        if (!auctionOffItem) return;

        let data = getDataFromInputsToAuctionOffItem();
        if (data == null) return;

        const
            confirmationQueue = new ConfirmationQueue(),
            condition = isTooLowPriceForLegendItem(auctionOffItem, data);

        confirmationQueue
            .addCondition(() => condition, _t('too-low-price-legend-item-confirm', null, 'auction'))
            .processConditions(() => sendRequestToCreateAuction(auctionOffItem.id, data));
    }

    const isTooLowPriceForLegendItem = (auctionOffItem, data) => {
        const requireCls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ,13, 14, 29],
            itemStats = parseItemStat(auctionOffItem.stat);
        return isset(data.buy_out) && data.buy_out >=500 && data.buy_out <= 100000000 &&
            requireCls.includes(auctionOffItem.cl) &&
            isset(itemStats['lvl']) && itemStats['lvl'] > 20 &&
            isset(itemStats['rarity']) && itemStats['rarity'] === 'legendary';
    }

    const sendRequestToCreateAuction = (itemId, data) => {
        g.auctions.getAuctionRequest().setAuctionOffActionRequest(auctionOffItem.id, data);
        hideAndUnsetAuctionItemOff();
        setIsFeatured(false);
    }

    const isShow = () => {
        return content.css('display') != 'none';
    }

    const manageOfShow = () => {
        showAndSet();

        updateCheckbox();
    }

    const showAndSet = () => {
        content.css('display', 'block');
    }

    const hideAndUnsetAuctionItemOff = () => {
        removeAuctionOffItemAndManageVisibleElements();
        hide();
    }

    const checkPermbound = (itemData) => {
        let stats = parseItemStat(itemData.stat);
        return isset(stats["permbound"]);
    }

    const checkSoulbound = (itemData) => {
        let stats = parseItemStat(itemData.stat);
        return isset(stats["soulbound"]);
    }

    const hide = () => {
        content.css('display', 'none');
    }

    const getIsFeatured = () => {
        return content.find('.special-offer').find('.checkbox.active').length ? 1 : 0;
    };

    const setIsFeatured = (state) => {
        let $ch = content.find('.special-offer').find('.checkbox.active');
        state ? $ch.addClass('active') : $ch.removeClass('active');
    };

    const getDataFromInputsToAuctionOffItem = () => {
        let bid                 = content.find('.auction-bid').find('input').val();
        let buyNow              = content.find('.auction-buy-now').find('input').val();
        let duration            = content.find('.auction-duration').find('input').val();
        let additionGoldPayment = content.find('.auction-additional-gold-payment').find('input').val();
        let isFeatured          = getIsFeatured();

        let arg = {};

        if (checkSoulbound(auctionOffItem)) {
            if (additionGoldPayment !== null)       arg['price'] = parsePrice(removeSpaces(additionGoldPayment));
            if (!isFeatured && duration !== null)   arg['time'] = duration;
        } else {
            if (bid !== '')                       arg['price'] = parsePrice(removeSpaces(bid));
            if (buyNow !== '')                    arg['buy_out'] = parsePrice(removeSpaces(buyNow));
            if (!isFeatured && duration !== null)   arg['time'] = duration;
        }

        arg['is_featured'] = isFeatured;

        return arg;
    };

    const removeAuctionOffItem = () => {

        if (!auctionOffItem) return

        let idItem = auctionOffItem.id;
        //removeItemView(idItem, Engine.itemsViewData.AUCTION_SELL_ITEM_VIEW);
        removeItemFromItemMovedManager(idItem);
        setAuctionOffItem(null);
        clearItemSlot();
    };

    const removeAuctionOffItemAndManageVisibleElements = () => {
        removeAuctionOffItem();
        manageVisibleElements();
    }

    const clearItemSlot = () => {
        content.find('#auction-off-item').remove();
    };

    const getAuctionOffItem = () => {
        return auctionOffItem;
    }

    const setAuctionOffItem = (itemData) => {
        auctionOffItem = itemData;
    };

    const checkAuctionOffItem = () => {
        return auctionOffItem ? true : false;
    }

    const removeItemFromItemMovedManager = (idItem) => {
        g.itemsMovedManager.removeItem(idItem);
    };

    const attackRightClickToToCloneItemToSlot = ($item, itemData) => {
        $item.contextmenu(function (e, mE) {
            let callback = {
                txt: _t('unbuy all'),
                f: function () {
                    // removeAuctionOffItem();
                    removeAuctionOffItemAndManageVisibleElements()
                }
            };
            itemData.createOptionMenu(getE(e, mE), callback, {move: true, use: true});
        });
    };

    const putAuctionOffItem = (itemData) => {

        // if (!checkIsItem(itemData)) return;              // ??? need?
        if (checkPermbound(itemData)) return;
        if (checkSoulbondIsBlocked(itemData)) return;

        removeAuctionOffItem();

        let $cloneItem      = getCloneItemToItemSlot(itemData);

        setAuctionOffItem(itemData);
        manageVisibleElements();
        attackRightClickToToCloneItemToSlot($cloneItem, itemData);
        addItemSlotItemToItemsMoveManager(itemData);
        attachCloneItemToItemSlot($cloneItem);
    };

    const attachCloneItemToItemSlot = ($cloneItem) => {
        content.find('.item-slot').append($cloneItem);
    };

    const getCloneItemToItemSlot = (itemData) => {

        return $('#item'+itemData.id).clone().css({
            position:'relative',
            top:0,
            left:0
        }).attr({
            id:'auction-off-item',
            iid:itemData.id
        });
    };

    const addItemSlotItemToItemsMoveManager = (itemData) => {
        let ITEM_TO_AUCTION =  "ITEM_TO_AUCTION";
        g.itemsMovedManager.addItem(itemData, ITEM_TO_AUCTION, function () {
            removeAuctionOffItemAndManageVisibleElements()
        });
    };

    const checkIsItem = (item) => {
        return item instanceof Item;
    };

    const checkSoulbondIsBlocked = (itemData) => {
        if (!checkSoulbound(itemData)) return false;

        //let soulboundVal = valueBoundItem(itemData);
        let soulboundVal = getUnbindCost(itemData);

        if (soulboundVal == null) soulboundVal = 0;

        // if (soulboundVal <= 0) return true;

        return soulboundVal <= 0;

        // return false;
    };

    const setVisibleBuyIconInfo = (state) => {
        setVisibleInElementByState(content.find('.buy-info-icon'), state)
    };

    const setVisibleDraconiteIconAndVal = (state) => {
        let $el = content.find('.small-currency-icon').find('.small-draconite').parent();
        $el.css('display', state ? 'table-cell': 'none')
    };

    const setVisibleGoldIconAndVal = (state) => {
        let $el = content.find('.small-currency-icon').find('.small-money').parent();
        $el.css('display', state ? 'table-cell': 'none')
    };

    const getAuctionCostByPatern = (itemData) => {
        let stat = parseItemStat(itemData.stat);
        let lvl = stat.lvl;

        if (!lvl) lvl = 10;

        return Math.max(lvl, 10) * 10;
    };

    const setValOfGoldIconAndVal = (val) => {
        let $el = content.find('.small-currency-icon').find('.small-money').parent().find('.value');
        $el.html(val);
    };

    const manageVisibleSpecialOffer = () => {
        let featuredCount       = g.auctions.getFeaturedCount();
        let visibleSpecialOffer = featuredCount != AuctionData.MAX_FEATURED_COUNT;

        setVisibleSpecialOffer(visibleSpecialOffer)
    };

    const setVisibleSpecialOffer = (state) => {
        //setVisibleInElementByState(content.find('.special-offer'), state);

        let pEvents = state ? 'initial' : 'none';
        let opacity = state ? 1 : 0.5;
        let tip     = state ? '' : _t('special_offer_limit_reach');
        let $sO     = content.find('.special-offer');

        $sO.tip(tip);

        $sO.find('.one-checkbox').css({
            "pointer-events"    : pEvents,
            opacity             : opacity
        })
    };

    const setVisibleAdditionalGoldPayment = (state) => {
        setVisibleInElementByState(content.find('.auction-additional-gold-payment'), state)
    };

    const setVisibleAdditionalSoulboundPayment = (state) => {
        setVisibleInElementByState(content.find('.additional-soulbond-payment'), state)
    };

    const setVisibleAuctionBid = (state) => {
        setVisibleInElementByState(content.find('.auction-bid'), state)
    };

    const manageValOfBuyNowWhenAuctionIsNotFeatured = () => {
        let $buyNowInput = content.find(".auction-buy-now").find("input");
        let val          = $buyNowInput.val();

        // let newVal = val.search('SL') > -1 ? '' : val;
        let newVal = val.search(_t('sl')) > -1 ? '' : val;

        setStatesOfBuyNowInput(false, newVal);
    };

    const setStatesOfBuyNowInput = (disableState, val) => {
        setDisabledInputAndVal(content.find(".auction-buy-now").find("input"), disableState, val)
    };

    const setStatesOfAuctionDuration = (disableState, val) => {
        setDisabledInputAndVal(content.find(".auction-duration").find("input"), disableState, val)
    }

    const setDisabledInputAndVal = ($element, disableState, val) => {
        $element.prop('disabled', disableState);
        $element.val(val);
    }

    const setVisibleInElementByState = ($element, state) => {
        $element.css('display', state ? 'block': 'none')
    }

    const setTaxValue = (isSoulbound) => {
        const { creditsRatio, goldRatio, goldRatioFromSurcharge } = getTaxes();
        const taxValue = isSoulbound ?
          `${goldRatioFromSurcharge}% (${_t('gold_plural')})<br>
           ${creditsRatio}% (${_t('credits_plural')})` :
          `${goldRatio}%`;

        const $taxValue = content.find(".tax-val");
        $taxValue.html(taxValue);
    }

    const getTaxes = () => {
        const { gainedCreditsRatio, gainedGoldRatio, gainedGoldRatioFromSurcharge } = g.auctions.getConfig();
        const creditsRatio = 100 - gainedCreditsRatio;
        const goldRatio = 100 - gainedGoldRatio;
        const goldRatioFromSurcharge = 100 - gainedGoldRatioFromSurcharge;
        return { creditsRatio, goldRatio, goldRatioFromSurcharge }
    }

    //const valueBoundItem = (item) => {
    //    let stats = parseItemStat(item.stat);
    //    if (!isset(stats['lvl'])) return 0;
    //
    //    let baseMin     = 20;
    //    let baseReal    = 10 + (parseInt(stats['lvl']) / 10);
    //    let multipler   = 1;
    //
    //    if (isset(item.itemTypeName === 'legendary')) {
    //        multipler   = 3;
    //        baseMin     = 30;
    //    } else if (isset(item.itemTypeName === 'heroic')) {
    //        multipler   = 1.5;
    //        baseMin     = 30;
    //    } else if (isset(item.itemTypeName === 'unique')) {
    //        multipler = 1.2;
    //    }
    //
    //    let real = Math.min(baseReal, baseMin) * multipler;
    //
    //    return Math.round(real) * CFG.sl_multipler[_l()];
    //};

    const initRemoveAuctionOffItemEvent = () => {
        content.find('.item-slot').on('click', removeAuctionOffItemAndManageVisibleElements);
    };

    this.close = close;
    this.manageOfShow = manageOfShow;
    this.getAuctionOffItem = getAuctionOffItem;
    this.setAuctionOffItem = setAuctionOffItem;
    this.putAuctionOffItem = putAuctionOffItem;
    this.manageVisibleElements = manageVisibleElements;
    this.manageVisibleSpecialOffer = manageVisibleSpecialOffer;
    this.updateCheckbox = updateCheckbox;
    this.init = init;
}
