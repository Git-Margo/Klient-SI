//const Templates             = require('../Templates');
//const BuildsData            = require('core/builds/BuildsData.js');
//const OneBuild              = require('core/builds/OneBuild.js');


function BuildsWindow () {

    const moduleData     = {fileName: "BuildsWindow.js"};

    //let wnd             = null;
    let content         = null;
    let buyBuildList    = null;
    let currentId       = null;

    const init = () => {
        initWindow();
        //initScrollBar();
        initBuyBuildList();
    };

    const initBuyBuildList = () => {
        buyBuildList = {};
    };

    const initWindow = () => {
        content = getEngine().buildsManager.getBuildsTemplates().getBuildsWindow();


        content.find('.builds-close-button').on('click', function () {
            managePanelVisible();
        });


        content.find('.info-icon').tip(_t('builds_info', null, "builds"));

        content.find('.builds-title').html(goldTxt(_t('builds', null, 'builds')));

        closePanel();

        $('#builds-window').append(content);
    };

    const createOneBuildToBuy = (data, active) => {
        //let $oneBuildToBuy      = Templates.get("one-build-to-buy");
        let $oneBuildToBuy      = getEngine().buildsManager.getBuildsTemplates().getOneBuildToBuy();
        let id                  = data.id;
        let $buildWrapper       = $oneBuildToBuy.find(".build-buttons-wrapper");
        let goldData            = roundParser(data.cost.gold);
        let goldText            = goldData.val + goldData.postfix;
        let slVal               = data.cost.credits;

        const CREDITS                = BuildsData.REQUEST.CURRENCY_CREDITS;
        const GOLD              = BuildsData.REQUEST.CURRENCY_GOLD;

        let buttonGold         = createButton(goldText, ['small', 'green', "background-gold"],  () => {

            let msg = _t("buy_new_build", {"%id%": id, "%cost%": goldText}, "builds")  + " " + _t('cost_table') + " " + goldText + " " + _t("cost_gold");
            let req = getEngine().buildsManager.getBuildsRequests().buyBuildStr(id, GOLD);

            //confirmWithCallbackAcceptCost(msg, req, GOLD, goldText);
            mAlert(msg,2,[function(){_g(req)}, null])
        });

        let buttonSl           = createButton(slVal + _t("sl"), ['small', 'purple', 'green', "background-draconite"],  () => {

            let msg = _t("buy_new_build", {"%id%": id, "%cost%": slVal}, "builds") + " " + _t('cost_table') + " " + slVal  + " " + _t("sl");
            let req = getEngine().buildsManager.getBuildsRequests().buyBuildStr(id, CREDITS);

            //confirmWithCallbackAcceptCost(msg, req, SL, slVal);
            mAlert(msg,2,[function(){_g(req)}, null])
        });

        if (active) {
            addActiveToOneBuildToBuy($oneBuildToBuy)
        }

        $buildWrapper.append($(buttonGold));
        $buildWrapper.append($(buttonSl));

        //updateNameBuild($oneBuildToBuy, {name: "Zestaw " + (id)});
        updateNameBuild($oneBuildToBuy, {name: _t("one_battle_set", null, "builds") + " " + (id)});


        return $oneBuildToBuy;
    };

    const addActiveToOneBuildToBuy = ($oneBuildToBuy) => {
        $oneBuildToBuy.addClass('active');
    };

    const updateCurrentId = (_currentID) => {

        if (!getBuilById(_currentID)) {
            return
        }

        if (currentId == _currentID) {
            return;
        }

        setCurrentId(_currentID);

        clearCurrentIdInBuilds();

        let currentBuildData = getBuilById(currentId);
        let $currentBuild = currentBuildData.get$build();

        $currentBuild.addClass("active")
    };

    const setCurrentId = (_currentID) => {
        currentId = _currentID;
    };

    const clearCurrentIdInBuilds = () => {
        let all$builds = getEngine().buildsManager.getBuildsCommons().getAll$builds();

        for (let index in all$builds) {
            all$builds[index].removeClass("active")
        }
    };

    const updateBuyNewBuild = (data) => {
        let id                  = data.id;
        let $buyBuild           = getBuyBuilById(id);
        let $nextBuyBuild       = getBuyBuilById(id + 1);

        if ($nextBuyBuild) {
            addActiveToOneBuildToBuy($nextBuyBuild);
        }

        removeOneBuildToBuyFromBuyBuildList(id);
        $buyBuild.remove();


        updateOneBuild(data);
    };

    const updateOneBuild = (data) => {

        let oneBuild        = null;
        let $oneBuild       = null;
        let id              = data.id;
        let buildsCommons   = getEngine().buildsManager.getBuildsCommons();
        let exist           = buildsCommons.checkBuildExist(id);

        if (exist) {
            oneBuild = getBuilById(id);
            $oneBuild = oneBuild.get$build();
        } else {
            oneBuild = new OneBuild();
            oneBuild.init(data, true);
            $oneBuild = oneBuild.get$build();

            buildsCommons.addOneBuildToBuildList(id, oneBuild);
        }

        oneBuild.update(data);

        if (exist) {
            return;
        }

        if (isWrapperEmpty())   addOneBuildToWrapper($oneBuild);
        else                    addOneBuildAfterLastBoughtBuild($oneBuild);
    };

    const updateOneBuildToBuy = (data, active) => {
        let id                  = data.id;

        if (getBuyBuilById(id)) {
            return
        }

        let $oneBuildToBuy      = createOneBuildToBuy(data, active);

        addOneBuildToBuyToBuyBuildList(id, $oneBuildToBuy);
        addOneBuildToBuyToWrapper($oneBuildToBuy);
    };

    const isWrapperEmpty = () => {
        return content.find('.scroll-pane').children().length == 0;
    };

    const updateNameBuild = ($oneBuild, data) => {
        $oneBuild.find(".build-name").html(data.name);
    };

    const removeItem = (id, $itemsWrapper) => {
        $itemsWrapper.find(`.item-id-${id}`).remove();
        //Engine.items.deleteViewIconIfExist(id, Engine.itemsViewData.BUILDS_VIEW);
    };

    const updateSkillsLeftBuild = ($oneBuild, data) => {
        $oneBuild.find(".build-skills-left").html(data.skillsLearnt + "/" + data.skillsTotal).tip(_t("skills_status", null, "builds"));
    };

    const updateIconBuild = ($oneBuild, data) => {
        $oneBuild.find(".build-icon").attr("icon-id", data.iconId);
    };

    const managePanelVisible = function () {
        getWindowShow() ? closePanel() : openPanel();
    };

    const getWindowShow = () => {
        //return wnd.isShow();
        return $('#builds-window').css('display') == "block";
    };

    const openPanel = () => {
        //if (getEngine().hero.getLvl() < 25) {
        //    message(_t('too_low_lvl'));
        //    return
        //}

        if (getEngine().matchmaking.getEqPanelOpen()) {
            message(_t('window_not_available_now'));
            return
        }
        $('#builds-window').css('display', "block");
        $('#builds-window').absCenter();
        //wnd.show();
        //wnd.setWndOnPeak();
        //updateScroll();
    };

    const closePanel = () => {
        $('#builds-window').css('display', "none");
    };

    const updateScroll = () => {
        //$('.scroll-wrapper', wnd.$).trigger('update');
    };

    const addOneBuildToBuyToBuyBuildList = (id, $oneBuildToBuy) => {
        buyBuildList[id] = $oneBuildToBuy;
    };

    const removeOneBuildToBuyFromBuyBuildList = (id) => {
        delete buyBuildList[id];
    };

    const addOneBuildToWrapper = ($oneBuild) => {
        content.find('.scroll-pane').append($oneBuild)
    };

    const addOneBuildAfterLastBoughtBuild = ($oneBuild) => {
        $oneBuild.insertAfter(content.find('.scroll-pane').find(".one-build").last())
    };

    const addOneBuildToBuyToWrapper = ($oneBuildToBuy) => {
        content.find('.scroll-pane').append($oneBuildToBuy)
    };

    const getBuilById = (id) => {
        //return buildList[id];
        return getEngine().buildsManager.getBuildsCommons().getBuilById(id);
    };

    const getBuyBuilById = (id) => {
        return buyBuildList[id];
    };

    const getCurrentId = () => {
        return currentId;
    };

    const getCurrentName = () => {
        let oneBuild = getBuilById(currentId);

        if (!oneBuild) {
            return null
        }

        return oneBuild.getName();
    };

    this.init                           = init;
    this.updateOneBuild                 = updateOneBuild;
    this.updateOneBuildToBuy            = updateOneBuildToBuy;
    this.updateBuyNewBuild              = updateBuyNewBuild;
    this.updateCurrentId                = updateCurrentId;
    this.updateScroll                   = updateScroll;
    this.managePanelVisible             = managePanelVisible;
    this.closePanel                     = closePanel;
    this.getWindowShow                  = getWindowShow;
    this.getCurrentId                   = getCurrentId;
    this.getCurrentName                 = getCurrentName;

};
