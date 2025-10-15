//var SettingsData = require('core/settings/SettingsData');


function SettingsOptions () {

    const moduleData = {fileName: "SettingsOptions.js"};

    const init = () => {

    };
/*
    const isReceivePrivateChatMessageOn = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.RECEIVE_PRIVATE_CHAT_MESSAGE);
    };

    const isInvitationToClanAndDiplomacyOn = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.INVITATION_TO_CLAN_AND_DIPLOMACY);
    };

    const isTradeWithOthersOn = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.TRADE_WITH_OTHERS);
    };

    const isTurnBasedCombatAfterMonsterAttackOn = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK);
    };

    const isInvitationToFriendsOn = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.INVITATION_TO_FRIENDS);
    };

    const isMailFromUnknownOn = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.MAIL_FROM_UNKNOWN);
    };
*/
    const isMouseHeroWalkOn = () => {
        // return checkOpt(SettingsData.KEY.MOUSE_HERO_WALK) ? false : true;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.MOUSE_HERO_WALK);
    };

    const isInterfaceAnimationOn = () => {
        // return checkOpt(SettingsData.KEY.INTERFACE_ANIMATION) ? false : true;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.INTERFACE_ANIMATION);
    };
/*
    const isClanMemberEntryChatMessageOn = () => {
        //return getEngine().settingsStorage.getValue(9);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.CLAN_MEMBER_ENTRY_CHAT_MESSAGE);
    };
*/

    // 10 empty

    const isCycleDayAndNightOn = () => {
        // return checkOpt(SettingsData.KEY.CYCLE_DAY_AND_NIGHT) ? false : true;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.CYCLE_DAY_AND_NIGHT);
    };

    const isAutoGoThroughGatewayOn = () => {
        // return checkOpt(SettingsData.KEY.AUTO_GO_THROUGH_GATEWAY) ? false : true;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.AUTO_GO_THROUGH_GATEWAY);
    };

    const isShowItemsRankOn = () => {
        // return checkOpt(SettingsData.KEY.SHOW_ITEMS_RANK) ? false : true;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.SHOW_ITEMS_RANK);
    };
/*
    const isInvitationToPartyBeyondFriendsAndClansAndClansAllyOn = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY);
    };

    const isFriendEntryChatMessageOn = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.FRIEND_ENTRY_CHAT_MESSAGE);
    };
*/
    const isWeatherAndEventEffectsOn = () => {
        // return checkOpt(SettingsData.KEY.WEATHER_AND_EVENT_EFFECTS) ? false : true;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.WEATHER_AND_EVENT_EFFECTS);
    };
/*
    const isBannersOn = () => {
        return checkOpt(SettingsData.KEY.BANNERS) ? false : true;
    };
*/
    const isAddOrRemovePartyMemberChatMessageOn = () => {
        // return checkOpt(SettingsData.KEY.ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE) ? false : true;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE);
    };
/*
    const isMapAnimationOn = () => {
        return checkOpt(SettingsData.KEY.MAP_ANIMATION) ? true : false;
    };
*/
    //20 empty

    const isInformAboutFreePlaceInBagOn = () => {
        // return checkOpt(SettingsData.KEY.INFORM_ABOUT_FREE_PLACE_IN_BAG) ? false : true;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.INFORM_ABOUT_FREE_PLACE_IN_BAG);
    };

    //22 empty
/*
    const isLoaderSplashOn = () => {
        return checkOpt(SettingsData.KEY.LOADER_SPLASH) ? false : true;
    };

    const isWarShadowOn = () => {
        return checkOpt(SettingsData.KEY.WAR_SHADOW) ? false : true;
    };

    const isAutoCompareItemsOn = () => {
        return checkOpt(SettingsData.KEY.AUTO_COMPARE_ITEMS) ? false : true;
    };

    const isBattleEffectsOn = () => {
        return checkOpt(SettingsData.KEY.BATTLE_EFFECTS) ? false : true;
    };
 */
    const isAutoCloseBattleOn = () => {
        // return checkOpt(SettingsData.KEY.AUTO_CLOSE_BATTLE) ? true : false;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.AUTO_CLOSE_BATTLE);
    };

    const isReceiveFromEnemyChatMessageOn = () => {
        // return checkOpt(SettingsData.KEY.RECEIVE_FROM_ENEMY_CHAT_MESSAGE) ? true : false;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.RECEIVE_FROM_ENEMY_CHAT_MESSAGE);
    };

    const isAnnouceClanAboutLeggendDropChatMessageOn = () => {
        // return checkOpt(SettingsData.KEY.ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE) ? true : false;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE);
    };

    const isExchangeSafeMode = () => {
        // return checkOpt(SettingsData.KEY.EXCHANGE_SAFE_MODE) ? true : false;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.EXCHANGE_SAFE_MODE);
    }

    const getKindOfShowLevelAndOperationLevel = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL, SettingsData.VARS.OPERATION_LEVEL.MODE);
    };

    // const checkOpt = function (which) {
    //     //if (opt) {
    //     //    return opt & (1 << which - 1);
    //     //}
    //
    //     //if (!Engine || !Engine.hero || !Engine.hero.d || !isset(Engine.hero.d.opt)) {
    //     if (!hero || !isset(hero.opt)) {
    //         debugger;
    //         console.error(moduleData.fileName, "checkOpt", "can not check opt!");
    //         console.trace()
    //         return;
    //     }
    //
    //     return hero.opt & (1 << which - 1);
    //
    // };


    const getMenuData = (settingsNumber, key) => {
        const FUNC  = "getMenuData";
        let data    = SettingsData.LIST[settingsNumber];

        if (!data) {
            errorReport(moduleData.fileName, FUNC, "settingsNumber no exist", settingsNumber);
            return null;
        }

        if (key) {

            if (!checkCorrectDataWithKey(data)) {
                return
            }

            data = data.object[key];

            if (!data.list) {
                errorReport(moduleData.fileName, FUNC, `data.object[${key}].list not exist!`, settingsNumber);
                return null;
            }

        } else {

            if (!data.list) {
                errorReport(moduleData.fileName, FUNC, "settingsNumber no exist list", settingsNumber);
                return null;
            }

        }

        let list = [];

        for (let i = 0 ; i < data.list.length; i++) {
            let menuOption  = data.list[i];

            list.push({

                text            : getOneListItemLang(settingsNumber, key, menuOption),
                menuOption      : menuOption,
                val             : i
            });
        }

        return {
            list    : list,
            index   : getEngine().settingsStorage.getValue(settingsNumber, key)
        }
    };

    const checkCorrectDataWithKey = (data) => {
        const FUNC = "FUNC";

        if (!data.object) {
            errorReport(moduleData.fileName, FUNC, "data.object not exist!", settingsNumber);
            return false;
        }


        if (!isset(data)) {
            errorReport(moduleData.fileName, FUNC, `data.object[${key}] not exist!`, settingsNumber);
            return false;
        }

        return true;
    }

    const getOneListItemLang = (settingsNumber, key, menuOption) => {
        let keyStr      = key ? ("__key_" + key) : "";

        return _t("opt_" + settingsNumber + keyStr + "__menuOption_" + menuOption, null, "SettingsOptions")
    };

    const getOneBitLang = (settingsNumber, key, bitOption) => {
        let keyStr      = key ? ("__key_" + key) : "";

        return _t("opt_" + settingsNumber + keyStr + "__bitOption_" + bitOption, null, "SettingsOptions")
    }

    const getDescriptionLang = (settingsNumber, key) => {
        let keyStr = key ? ("__key_" + key) : "";

        return _t("opt_" + settingsNumber + keyStr, null, "SettingsOptions")
    }

    this.init                                   = init;
    this.isInterfaceAnimationOn                 = isInterfaceAnimationOn;
    this.isWeatherAndEventEffectsOn             = isWeatherAndEventEffectsOn;
    this.isInformAboutFreePlaceInBagOn          = isInformAboutFreePlaceInBagOn;
    this.isAutoCloseBattleOn                    = isAutoCloseBattleOn;
    this.isAutoGoThroughGatewayOn               = isAutoGoThroughGatewayOn;
    this.isMouseHeroWalkOn                      = isMouseHeroWalkOn;
    this.isShowItemsRankOn                      = isShowItemsRankOn;
    this.isCycleDayAndNightOn                   = isCycleDayAndNightOn;
    this.isExchangeSafeMode                     = isExchangeSafeMode;
    this.getKindOfShowLevelAndOperationLevel    = getKindOfShowLevelAndOperationLevel;

    this.getMenuData                            = getMenuData;

}
