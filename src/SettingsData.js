const SettingsData = {
    LIST : null,
    VARS : null,
    KEY : {
        RECEIVE_PRIVATE_CHAT_MESSAGE                                : 1,
        INVITATION_TO_CLAN_AND_DIPLOMACY                            : 2,
        TRADE_WITH_OTHERS                                           : 3,
        TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK                      : 4,
        INVITATION_TO_FRIENDS                                       : 5,
        MAIL_FROM_UNKNOWN                                           : 6,
        MOUSE_HERO_WALK                                             : 7,
        INTERFACE_ANIMATION                                         : 8,
        CLAN_MEMBER_ENTRY_CHAT_MESSAGE                              : 9,

        CYCLE_DAY_AND_NIGHT                                         : 11,
        AUTO_GO_THROUGH_GATEWAY                                     : 12,
        SHOW_ITEMS_RANK                                             : 13,
        INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY : 14,
        FRIEND_ENTRY_CHAT_MESSAGE                                   : 15,
        WEATHER_AND_EVENT_EFFECTS                                   : 16,
        BANNERS                                                     : 17,
        ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE                     : 18,
        MAP_ANIMATION                                               : 19,

        INFORM_ABOUT_FREE_PLACE_IN_BAG                              : 21,

        LOADER_SPLASH                                               : 23,
        WAR_SHADOW                                                  : 24,
        AUTO_COMPARE_ITEMS                                          : 25,
        BATTLE_EFFECTS                                              : 26,
        AUTO_CLOSE_BATTLE                                           : 27,
        RECEIVE_FROM_ENEMY_CHAT_MESSAGE                             : 28,
        ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE                : 29,
        EXCHANGE_SAFE_MODE                                          : 30,
        LOOT_FILTER                                                 : 32,
        KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL                      : 33
    }
};


SettingsData.VARS    = {
    OPERATION_LEVEL : {
        MODE : "mode"
    },
    LOOT_FILTER: {
        V: "v",
    }
}

SettingsData.LIST = {
    [SettingsData.KEY.RECEIVE_PRIVATE_CHAT_MESSAGE]                                  : {type: "BOOL",       name: "RECEIVE_PRIVATE_CHAT_MESSAGE"},
    [SettingsData.KEY.INVITATION_TO_CLAN_AND_DIPLOMACY]                              : {type: "BOOL",       name: "INVITATION_TO_CLAN_AND_DIPLOMACY"},
    [SettingsData.KEY.TRADE_WITH_OTHERS]                                             : {type: "BOOL",       name: "TRADE_WITH_OTHERS"},
    [SettingsData.KEY.TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK]                        : {type: "BOOL",       name: "TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK"},
    [SettingsData.KEY.INVITATION_TO_FRIENDS]                                         : {type: "BOOL",       name: "INVITATION_TO_FRIENDS"},
    [SettingsData.KEY.MAIL_FROM_UNKNOWN]                                             : {type: "BOOL",       name: "MAIL_FROM_UNKNOWN"},
    [SettingsData.KEY.MOUSE_HERO_WALK]                                               : {type: "BOOL",       name: "MOUSE_HERO_WALK"},
    [SettingsData.KEY.INTERFACE_ANIMATION]                                           : {type: "BOOL",       name: "INTERFACE_ANIMATION"},
    [SettingsData.KEY.CLAN_MEMBER_ENTRY_CHAT_MESSAGE]                                : {type: "BOOL",       name: "CLAN_MEMBER_ENTRY_CHAT_MESSAGE"},
    [SettingsData.KEY.CYCLE_DAY_AND_NIGHT]                                           : {type: "BOOL",       name: "CYCLE_DAY_AND_NIGHT"},
    [SettingsData.KEY.AUTO_GO_THROUGH_GATEWAY]                                       : {type: "BOOL",       name: "AUTO_GO_THROUGH_GATEWAY"},
    [SettingsData.KEY.SHOW_ITEMS_RANK]                                               : {type: "BOOL",       name: "SHOW_ITEMS_RANK"},
    [SettingsData.KEY.INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY]   : {type: "BOOL",       name: "INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY"},
    [SettingsData.KEY.FRIEND_ENTRY_CHAT_MESSAGE]                                     : {type: "BOOL",       name: "FRIEND_ENTRY_CHAT_MESSAGE"},
    [SettingsData.KEY.WEATHER_AND_EVENT_EFFECTS]                                     : {type: "BOOL",       name: "WEATHER_AND_EVENT_EFFECTS"},
    [SettingsData.KEY.BANNERS]                                                       : {type: "BOOL",       name: "BANNERS"},
    [SettingsData.KEY.ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE]                       : {type: "BOOL",       name: "ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE"},
    [SettingsData.KEY.MAP_ANIMATION]                                                 : {type: "BOOL",       name: "MAP_ANIMATION"},
    [SettingsData.KEY.INFORM_ABOUT_FREE_PLACE_IN_BAG]                                : {type: "BOOL",       name: "INFORM_ABOUT_FREE_PLACE_IN_BAG"},
    [SettingsData.KEY.LOADER_SPLASH]                                                 : {type: "BOOL",       name: "LOADER_SPLASH"},
    [SettingsData.KEY.WAR_SHADOW]                                                    : {type: "BOOL",       name: "WAR_SHADOW"},
    [SettingsData.KEY.AUTO_COMPARE_ITEMS]                                            : {type: "BOOL",       name: "AUTO_COMPARE_ITEMS"},
    [SettingsData.KEY.BATTLE_EFFECTS]                                                : {type: "BOOL",       name: "BATTLE_EFFECTS"},
    [SettingsData.KEY.AUTO_CLOSE_BATTLE]                                             : {type: "BOOL",       name: "AUTO_CLOSE_BATTLE"},
    [SettingsData.KEY.RECEIVE_FROM_ENEMY_CHAT_MESSAGE]                               : {type: "BOOL",       name: "RECEIVE_FROM_ENEMY_CHAT_MESSAGE"},
    [SettingsData.KEY.ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE]                  : {type: "BOOL",       name: "ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE"},
    [SettingsData.KEY.EXCHANGE_SAFE_MODE]                                            : {type: "BOOL",       name: "EXCHANGE_SAFE_MODE"},
    [SettingsData.KEY.KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL]                        : {type: "OBJECT",     name: "KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL",
        object : {
            [SettingsData.VARS.OPERATION_LEVEL.MODE]                                 : {type: "LIST", list: ["level|operation_level", "operation_level|level", "only_operation_level", "only_level"]}
        }
    },
    [SettingsData.KEY.LOOT_FILTER]                                                   : {type: "OBJECT", name: "LOOT_FILTER",
        object: {
            [SettingsData.VARS.LOOT_FILTER.V]                                        : {type: "BOOL"},
        }
    }
}


