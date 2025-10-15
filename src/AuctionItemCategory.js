// let AuctionData = require('core/auction/AuctionData');
// let Templates = require('../Templates');

function AuctionItemCategory () {

    //let $auctionContent = null;
    let $dropDownMenuSectionData = {};
    let showCategory                = null;
    let $categoryList       = {};

    const init = () => {
        initAllCategory();
    }

    const initYourAuctionMenu = () => {
        let category            = AuctionData.MY_AUCTION
        let strHeader           = _t('auction_type',  null,'auctions');
        let $yourAuction        = createDropdownMenuSection(category, strHeader);
        let $categoryWrapper    = $yourAuction.find('.item-category-wrapper');

        $yourAuction.addClass('type-auction-switch');

        for (let k in AuctionData.TYPE_OF_AUCTION) {
            let auctionMenuItem = createAuctionMenuItem(k, _t(k+ '_auction'));

            $categoryWrapper.append(auctionMenuItem);
        }

        $categoryWrapper.find('.action-menu-item').first().addClass('selected');

        addDropDownMenuSectionToList(category, $yourAuction);

        let content                 = g.auctions.getAuctionWindow().getContent();
        let $allCategoriesAuction   = content.find('.all-categories-auction');

        $allCategoriesAuction.append($yourAuction);
    }

    const createAuctionMenuItem = (key, label) =>  {
        let $auctionMenuItem = g.auctions.getAuctionTemplates().get("action-menu-item");

        $auctionMenuItem.find('.label').html(label);
        //$auctionMenuItem.addClass(key);

        $auctionMenuItem.on('click', () => {
            let v;
            let content = g.auctions.getAuctionWindow().getContent();

            content.find('.type-auction-switch').find('.selected').removeClass('selected');
            $auctionMenuItem.addClass('selected');

            if (key == AuctionData.TYPE_OF_AUCTION.NORMAL)  v = 0;
            else                                            v = 1;

            g.auctions.setAuctionMode(v);
            //g.auctions.clearRecordList();
            //g.auctions.getAuctionWindow().clearOffersTable();
            //g.auctions.getAuctionWindow().setFirstHeaderOfTable();
            // Engine.auctions.sendClickCardRequest();
            g.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
            g.auctions.getAuctionWindow().setVisibleAllAuctionsInfoWrapper(false);
            g.auctions.getAuctionWindow().setVisibleAmountOfAuction(true);
        });

        return $auctionMenuItem
    }

    const setShowCategory = (_showCategory) => {
        showCategory = _showCategory;
    };

    const clearItemCategory = () => {
        setShowCategory(0);
        removeClassSelectedFromCategory()
    }

    const removeActiveCategory = () => {

    }

    const initAllCategory = () => {

        let content = g.auctions.getAuctionWindow().getContent();
        let $allCategoriesAuction = content.find('.all-categories-auction');

        for (let category in AuctionData.CATEGORY) {

            let o                   = AuctionData.CATEGORY[category];
            //let strHeader           = getTextCat(category);
            //let $oneTypeCategory    = createDropdownMenuSection(category, strHeader);
            //let $categoryWrapper    = $oneTypeCategory.find('.item-category-wrapper');

            //addDropDownMenuSectionToList(category, $oneTypeCategory)

            for (var t in o) {
                var id = o[t];
                let $oneCategory = createOneCategory(id);

                $categoryList[id] = $oneCategory;
                $allCategoriesAuction.append($oneCategory);
            }

            //$allCategoriesAuction.append($oneTypeCategory);
        }
    };

    const createDropdownMenuSection = function (categoryName, strHeader) {
        let $oneTypeCategory    = g.auctions.getAuctionTemplates().get("drop-down-menu-section");
        // let strHeader           = getTextCat(categoryName);

        $oneTypeCategory.find(".type-header-label").html(strHeader);

        $oneTypeCategory.find('.type-header').on('click', () => {
            toggleTypeOfCategoryState(categoryName);
            manageVisibleTypeOfCategory(categoryName)
            //g.auctions.getAuctionWindow().updateScroll();
        });

        return $oneTypeCategory;
    };

    const toggleTypeOfCategoryState = (category) => {
        $dropDownMenuSectionData[category].state = !$dropDownMenuSectionData[category].state;
    };

    const manageVisibleTypeOfCategory = (category) => {
        let displayCss;
        let arrowClass;
        let o = $dropDownMenuSectionData[category];

        if (o.state) {
            displayCss = 'block';
            arrowClass = 'up-arrow';
        } else {
            displayCss = 'none';
            arrowClass = 'down-arrow';
        }

        o.$element.find('.state-of-type').removeClass('up-arrow down-arrow').addClass(arrowClass);
        o.$element.find('.content-wrapper').css('display', displayCss)
    };

    const addDropDownMenuSectionToList = (name, $oneHeaderCategoryMenu) => {
        $dropDownMenuSectionData[name] = {$element: $oneHeaderCategoryMenu, state: true};
    }

    const createOneCategory = (id) => {
        let $oneCategoryAuction = g.auctions.getAuctionTemplates().get("one-category-auction");

        $oneCategoryAuction.addClass('auction-category-' + id);

        $oneCategoryAuction.html(getTextTab(id));
        //$oneCategoryAuction.find(".icon").addClass("cl-" + id);

        $oneCategoryAuction.on("click", function () {
            //debugger
            let newShowCategory = getNewShowCategory(id);
            clickCategoryOfItem(1, newShowCategory);
        });

        return $oneCategoryAuction;
    }

    const addClassSelectedToCategory = () => {
        //if (showCategory == 0) return
        if (!isShowCategoryExist()) return;

        let content = g.auctions.getAuctionWindow().getContent();

        //content.find('.one-category-auction').find(`.icon.cl-${showCategory}`).parent().addClass('selected');
        content.find(`.auction-category-${showCategory}`).addClass('selected');
    }

    const isShowCategoryExist = () => {
        return showCategory != 0;
    };

    const removeClassSelectedFromCategory = () => {
        let content = g.auctions.getAuctionWindow().getContent();

        content.find('.one-category-auction.selected').removeClass('selected');
    }

    const getNewShowCategory = (id) => {
        return showCategory == id ? 0 : id;
    }

    function getTextTab (val) {
        return _t("au_cat" + val, null, "auction");
    }

    const getTextCat = (val) => {
        return _t("tab_" + val, null, "auction");
    };

    const clickCategoryOfItem = (page, idCategory) => {
        removeClassSelectedFromCategory();
        setShowCategory(idCategory);
        addClassSelectedToCategory();

        g.auctions.getAuctionRequest().mainAuctionRequest(page);
        g.auctions.getAuctionWindow().setVisibleAllAuctionsInfoWrapper(false);
        g.auctions.getAuctionWindow().setVisibleAmountOfAuction(true);
    };

    const getShowCategory = () => {
        return showCategory;
    }

    this.init = init;
    this.getShowCategory = getShowCategory;
    this.isShowCategoryExist = isShowCategoryExist;
    //this.setShowCategory = setShowCategory;
    this.clearItemCategory = clearItemCategory;

}