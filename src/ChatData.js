
let moduleData = {fileName:"ChatData.js"};

let ChatData = {
    CHANNEL                 : null,
    CHANNEL_CARDS           : null,
    SERVER_CHANNEL          : null,
    INPUT_CHANNEL_HEADER    : null,
    INPUT_REGEXP            : null,
    CHANNEL_INPUT_DATA      : null,
    MESSAGE_SECTIONS_VISIBLE: null,
    MESSAGE_SECTIONS        : null,
    MESSAGE_SUB_SECTIONS    : null,
    MESSAGE_LINK_REGEXP     : null,
    MESSAGE_MARK_REGEXP     : null,
    SYSTEM_MESSAGE_MARK_REGEXP : null,
    NOTIFICATION            : null,
    AVAILABLE               : null,
    MESSAGES_ADD_TO_GENERAL  : null,
    STATIC_KEYS             : null,
    SERVER_STORAGE          : null
};

let TS = "TS";
let CHANNEL_TAG = "CHANNEL_TAG";

let DISPLAY     = "DISPLAY";
let ALL_TAG     = "ALL_TAG";
let TWELVE_HOUR = "TWELVE_HOUR";
let ALL_UNIT    = "ALL_UNIT";

let ADD    = "ADD";

ChatData.SERVER_STORAGE = {
    SI_VISIBLE : "SI_VISIBLE",
    SI_CHANNEL : "SI_CHANNEL",
    DATA    : "DATA"
}

ChatData.SERVER_STYLE = {
    ME   : 2,
    TOWN : 7
}

ChatData.STYLE = {
    SPECIAL : 'special',
    NAR     : 'nar',
    ME      : 'me'
};

ChatData.STATIC_KEYS = {
    MESSAGES_ADD_TO_GENERAL : "MESSAGES_ADD_TO_GENERAL"
};

ChatData.NOTIFICATION = {
    WATCH   : "WATCH",
    WARNING : "WARNING",
    MUTE    : "MUTE"

}

ChatData.CHANNEL = {
    GENERAL   : "GENERAL",
    GLOBAL    : "GLOBAL",
    LOCAL     : "LOCAL",
    TRADE     : "TRADE",
    GROUP     : "GROUP",
    CLAN      : "CLAN",
    SYSTEM    : "SYSTEM",
    PRIVATE   : "PRIVATE",
    COMMERCIAL: "COMMERCIAL"
}


ChatData.CHANNEL_CARDS = {
    GENERAL   : "GENERAL",
    GLOBAL    : "GLOBAL",
    LOCAL     : "LOCAL",
    TRADE     : "TRADE",
    GROUP     : "GROUP",
    CLAN      : "CLAN",
    SYSTEM    : "SYSTEM",
    PRIVATE   : "PRIVATE",
}


ChatData.MESSAGES_ADD_TO_GENERAL_OPT = {
    [ADD]: ADD
};

ChatData.SERVER_CHANNEL = {
    [ChatData.CHANNEL.LOCAL  ] : 'local',
    [ChatData.CHANNEL.GLOBAL  ] : 'global',
    [ChatData.CHANNEL.TRADE  ] : 'trade',
    [ChatData.CHANNEL.GROUP  ] : 'party',
    [ChatData.CHANNEL.CLAN   ] : 'clan',
    [ChatData.CHANNEL.SYSTEM ] : 'system',
    [ChatData.CHANNEL.PRIVATE] : 'personal',
    [ChatData.CHANNEL.COMMERCIAL] : 'commercial',
};

ChatData.MESSAGES_ADD_TO_GENERAL = {
    [ChatData.CHANNEL.GLOBAL       ] : {[ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD]:true},
    [ChatData.CHANNEL.LOCAL        ] : {[ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD]:true},
    [ChatData.CHANNEL.TRADE        ] : {[ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD]:true},
    [ChatData.CHANNEL.GROUP        ] : {[ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD]:true},
    [ChatData.CHANNEL.CLAN         ] : {[ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD]:true},
    [ChatData.CHANNEL.SYSTEM       ] : {[ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD]:true},
    [ChatData.CHANNEL.PRIVATE      ] : {[ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD]:true},
    [ChatData.CHANNEL.COMMERCIAL   ] : {[ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD]:true}
}

ChatData.MESSAGE_SECTIONS = {
    [TS]            : TS,
    [CHANNEL_TAG]   : CHANNEL_TAG
};
ChatData.MESSAGE_SUB_SECTIONS = {
    [DISPLAY]       : DISPLAY,
    [TWELVE_HOUR]   : TWELVE_HOUR,
    [ALL_UNIT]      : ALL_UNIT,
    [ALL_TAG]       : ALL_TAG
};
ChatData.MESSAGE_SECTIONS_VISIBLE = {
    [TS]        : {
        [ChatData.MESSAGE_SUB_SECTIONS.DISPLAY]    : false,
        [ChatData.MESSAGE_SUB_SECTIONS.TWELVE_HOUR]: false,
        [ChatData.MESSAGE_SUB_SECTIONS.ALL_UNIT]   : false
    },
    [CHANNEL_TAG]: {
        [ChatData.MESSAGE_SUB_SECTIONS.DISPLAY] : false,
        [ChatData.MESSAGE_SUB_SECTIONS.ALL_TAG] : false
    }
}

ChatData.MESSAGE_LINK_REGEXP = {
    PROFILE: {
        getText    : function () {
            return '[' + _t('player_profile') + ']'
        },
        style      : '{"color":"#008000","font-weight": "bold"}',
        htmlClass  : 'chat-message-profile-link',
        getTip     : function () {
            return _t('player_profile')
        },
        getPattern: function () {
            //let link = isPl() ? 'www.margonem.pl' : 'margonem.com';

            //if (isPl()) return new RegExp('^https:\/\/www.margonem.pl\/profile\/view\,([0-9]+)\#char\_([0-9]+)\,([a-zA-Z]+)', "g")
            if (isPl()) return new RegExp('^https:\/\/www.margonem.pl\/profile\/view\,([0-9]+)($|\\s|\&nbsp;|\#char\_([0-9]+)\,([a-zA-Z]+))', "g")
            else        return new RegExp('^https:\/\/margonem.com\/profile\/view,([0-9]+)($|\\s|\#char\_([0-9]+)($|\\s|,([a-zA-Z]+)($|\\s)))', "g")

            //return new RegExp('https:\/\/' + link + '\/profile\/view\,([0-9]+)\#char\_([0-9]+)\,([a-zA-Z]+)', "g")
        }
    },
    CLAN_PROFILE: {
        getText    : function () {
            return '[' + getEngine().chatController.chatLang('clanProfile') + ']'
        },
        style      : '{"color":"#ee82ee","font-weight": "bold"}',
        htmlClass  : 'chat-message-clan-link',
        getTip     : function () {
            return _t('clan_page', null, 'clan');
        },
        getPattern: function () {
            let link = isPl() ? 'www.margonem.pl' : 'margonem.com';
            return new RegExp('^https:\/\/' + link + '\/guilds\/view\,([a-zA-Z]+)\,([0-9]+)', "g")
        }
    }
}

ChatData.MESSAGE_MARK_REGEXP = {
    ASD: {
        text        : "[ASD]",
        style       : '{"color":"yellow"}',
        dynamicMark : false,
        getPattern  : function () {return new RegExp('ASD([0-9]{3})', "g")}
    },
    QWE: {
        text        : "[QWE]",
        style       : '{"color":"orange"}',
        dynamicMark : false,
        getPattern  : function () {return new RegExp('QWE([0-9]{3})', "g")}
    },
    ZXC: {
        text        : "[ZXC]",
        style       : '{"color":"red"}',
        dynamicMark : false,
        getTip      : function () {return 'ZXC_TEST'},
        getPattern  : function () {return new RegExp('ZXC([0-9]{3})', "g")}
    },
    NICK: {
        style           : '{"color":"#48D1CC","font-weight": "bold"}',
        dynamicMark     : function (regexpArray) {return regexpArray[0]},
        //getDynamicTip   : function (regexpArray) {return 'Priv message to: ' + regexpArray[0];},
        getPattern      : function () {return new RegExp('(' + hero.nick + ')', "g")}
    }
}

ChatData.SYSTEM_MESSAGE_MARK_REGEXP = {
    RELATED_NICK: {
        style               : '{"font-weight": "bold"}',
        dynamicMark         : function (regexpArray) {return regexpArray[0]},
        getDynamicPattern   : function (data) {
            if (!isset(data.relatedNick)) {
                errorReport(moduleData.fileName, "getDynamicPattern", "data.relatedNick not exist", data);
                return null;
            }

            return new RegExp('(' + data.relatedNick + ')', "g")
        },
        editMark            : function (chatMessage, $mark, additionalData) {
            chatMessage.attachContextMenuToRelatedNick($mark, additionalData.relatedNick, additionalData.relatedId);
        }
    }
}

ChatData.AVAILABLE = {
    [ChatData.CHANNEL.GENERAL ]: true,
    [ChatData.CHANNEL.GLOBAL  ]: true,
    [ChatData.CHANNEL.LOCAL   ]: true,
    [ChatData.CHANNEL.TRADE   ]: true,
    [ChatData.CHANNEL.GROUP   ]: false,
    [ChatData.CHANNEL.CLAN    ]: false,
    [ChatData.CHANNEL.SYSTEM  ]: true,
    [ChatData.CHANNEL.PRIVATE ]: true
};

ChatData.INPUT_CHANNEL_HEADER = {
    [ChatData.CHANNEL.GENERAL      ]: {name: ChatData.CHANNEL.GENERAL,        focusMark : false, prefix: null, suffix: null, short: {pl:null, en:null},      heroMsgColor: "#D49999", otherMsgColor: "#D49999", inputWrapper: ChatData.CHANNEL.LOCAL        , remove: false, menu: true},
    [ChatData.CHANNEL.GLOBAL       ]: {name: ChatData.CHANNEL.GLOBAL,         focusMark : true,  prefix: '/',  suffix: ' ',  short: {pl:'o', en:'o'},        heroMsgColor: "#D49999", otherMsgColor: "#D49999", inputWrapper: ChatData.CHANNEL.GLOBAL       , remove: false, menu: true},
    [ChatData.CHANNEL.LOCAL        ]: {name: ChatData.CHANNEL.LOCAL,          focusMark : false, prefix: null, suffix: null, short: {pl:null, en:null},      heroMsgColor: "#FFFFDD", otherMsgColor: "#FFFFDD", inputWrapper: ChatData.CHANNEL.LOCAL        , remove: true,  menu: true},
    [ChatData.CHANNEL.TRADE        ]: {name: ChatData.CHANNEL.TRADE,          focusMark : true,  prefix: '/',  suffix: ' ',  short: {pl:'h', en:'t'},        heroMsgColor: "#3AB6C9", otherMsgColor: "#3AB6C9", inputWrapper: ChatData.CHANNEL.TRADE        , remove: true,  menu: true},
    [ChatData.CHANNEL.GROUP        ]: {name: ChatData.CHANNEL.GROUP,          focusMark : true,  prefix: '/',  suffix: ' ',  short: {pl:'g', en:'p'},        heroMsgColor: "#B554FF", otherMsgColor: "#B554FF", inputWrapper: ChatData.CHANNEL.GROUP        , remove: true,  menu: true},
    [ChatData.CHANNEL.CLAN         ]: {name: ChatData.CHANNEL.CLAN,           focusMark : true,  prefix: '/',  suffix: ' ',  short: {pl:'k', en:'g'},        heroMsgColor: "#FFA500", otherMsgColor: "#FFA500", inputWrapper: ChatData.CHANNEL.CLAN         , remove: true,  menu: true},
    [ChatData.CHANNEL.SYSTEM       ]: {name: ChatData.CHANNEL.SYSTEM,         focusMark : false, prefix: '/',  suffix: ' ',  short: {pl:'s', en:'s'},        heroMsgColor: "#B1B7BD", otherMsgColor: "#B1B7BD", inputWrapper: ChatData.CHANNEL.SYSTEM       , remove: true,  menu: false},
    [ChatData.CHANNEL.COMMERCIAL   ]: {name: ChatData.CHANNEL.COMMERCIAL,     focusMark : false, prefix: null, suffix: null, short: {pl:null, en:null},      heroMsgColor: "#ec0c0c", otherMsgColor: "#ec0c0c", inputWrapper: ChatData.CHANNEL.COMMERCIAL   , remove: true,  menu: false},
    [ChatData.CHANNEL.PRIVATE      ]: {name: ChatData.CHANNEL.PRIVATE,        focusMark : true,  prefix: '',   suffix: '',   short: {pl:'@', en:'@'},        heroMsgColor: "#FFCC00", otherMsgColor: "#CCFF00", inputWrapper: ChatData.CHANNEL.PRIVATE      , remove: true,  menu: false},
};

ChatData.INPUT_CHANNEL_MODE = {
  [ChatData.STYLE.SPECIAL]  : {name: ChatData.STYLE.SPECIAL,    short: 's', request: "special"},
  [ChatData.STYLE.NAR]      : {name: ChatData.STYLE.NAR,        short: 'n', request: "nar"},
  [ChatData.STYLE.ME]       : {name: ChatData.STYLE.ME,         short: 'm', request: "me"}
};

//ChatData.INPUT_REGEXP = {
//    $_LINKED_ITEMS : {
//        tag       : "$_LINKED_ITEMS",
//        //src       : (createTextGraphic('[PRZEDMIOT]', 13, 'yellow', '')).url,
//        getSrc    : function () {return (createTextGraphic('[' + getEngine().chatController.chatLang('Item') + ']', 13, 'yellow', '')).url},
//        getPattern: function () {return new RegExp('ITEM#([0-9a-z]{64}|[0-9]{7,11})(\\.[a-z]+|)(\\s|\&nbsp;)', "g")}
//    },
//    $_TEST_ASD_ITEMS : {
//        tag       : "$_TEST_ASD_ITEMS",
//        getSrc    : function () {return (createTextGraphic('[ASD_TEST]', 13, 'pink', '')).url},
//        getPattern: function () {return new RegExp('ASD([0-9]{3})', "g")}
//    },
//    $_TEST_QWE_ITEMS : {
//        tag       : "$_TEST_QWE_ITEMS",
//        getSrc    : function () {return (createTextGraphic('[QWE_TEST]', 13, 'orange', '')).url},
//        getPattern: function () {return new RegExp('QWE([0-9]{3})', "g")}
//    },
//    $_TEST_ZXC_ITEMS : {
//        tag       : "$_TEST_ZXC_ITEMS",
//        getSrc    : function () {return (createTextGraphic('[ZXC_TEST]', 13, 'red', '')).url},
//        getPattern: function () {return new RegExp('ZXC([0-9]{3})', "g")}
//    },
//    $_PROFILE_ITEMS : {
//        tag       : "$_PROFILE_ITEMS",
//        getSrc    : function () {return (createTextGraphic('[' + getEngine().chatController.chatLang('playerProfile') + ']', 13, 'green', '')).url},
//        getPattern: function () {
//
//
//            if (isPl()) return new RegExp('^https:\/\/www.margonem.pl\/profile\/view\,([0-9]+)\#char\_([0-9]+)\,([a-zA-Z]+)(\\s|\&nbsp;)', "g");
//            else {
//                return new RegExp('^https:\/\/margonem.com\/profile\/view\,([0-9]+)(\\s|\&nbsp;|(\#char\_([0-9]+(\\s|\&nbsp;|\,[a-zA-Z]+(\\s|\&nbsp;)))))', "g")
//                //                    https://margonem.com/profile/view,4102548#char_63022,Beluga
//                //                    https://margonem.com/profile/view,4102548#char_63022
//                //                    https://margonem.com/profile/view,4102548
//            }
//        }
//    },
//    $_CLAN_ITEMS : {
//        tag       : "$_CLAN_ITEMS",
//        getSrc    : function () {return (createTextGraphic('[' + getEngine().chatController.chatLang('clanProfile') + ']', 13, 'violet', '')).url},
//        getPattern: function () {return new RegExp('^https:\/\/www.margonem.pl\/guilds\/view\,([a-z]+)\,([0-9]+)(\\s|\&nbsp;)', "g")}
//    },
//    /*
//    $_FORUM_ITEMS : {
//        tag       : "$_FORUM_ITEMS",
//        src       : (createTextGraphic('[FORUM_TITLE]', 13, 'yellow', '')).url,
//        getPattern: function () {
//            //if (isPl()) return new RegExp('https:\/\/forum.margonem.pl\/\\?task=forum\&amp;show=posts\&amp;id=([0-9]+)(\\s|\&nbsp;)', "g");
//            if (isPl()) return new RegExp('https:\/\/forum.margonem.pl\/([a-zA-Z0-9\/\,\?\=\&\;]+)(\\s|\&nbsp;)', "g");
//            else        return new RegExp('https:\/\/forum.margonem.com\/([a-zA-Z0-9\/\,]+)(\\s|\&nbsp;)', "g");
//        }
//    }
//    */
//};
ChatData.INPUT_REGEXP = [
    {
        callback: function () {
            let lastUserWhoSendToHeroPrivateMessage = getEngine().chatController.getChatPrivateMessageData().getLastUserWhoSendToHeroPrivateMessage();

            if (!lastUserWhoSendToHeroPrivateMessage) {
                message(getEngine().chatController.chatLang('nobodySendToYouAnyPrivateMessage'));
                return
            }

            //getEngine().chatController.getChatInputWrapper().setChannel(ChatData.INPUT_CHANNEL_HEADER.PRIVATE, lastUserWhoSendToHeroPrivateMessage);
            let PRIVATE = ChatData.CHANNEL.PRIVATE;
            getEngine().chatController.getChatInputWrapper().setInput(ChatData.INPUT_CHANNEL_HEADER[PRIVATE].short[_l()] + lastUserWhoSendToHeroPrivateMessage.replaceAll(" ", "_") + ' ');
        },
        getPattern: function () {return new RegExp('^\/r', "g")}
    }
];

ChatData.CHANNEL_INPUT_DATA = [
    {
        getPattern: function () {
            //let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.LOCAL)
            return new RegExp('^\/cls$', "g")
        },
        getVal: function () {
            return '/cls';
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.LOCAL.name;
        }
    },
    {
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.GLOBAL)
            return new RegExp('^\/' + short + 'cls$', "g")
        },
        getVal: function () {
            return '/cls';
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.GLOBAL.name;
        }
    },
    {
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.TRADE)
            return new RegExp('^\/' + short + 'cls$', "g")
        },
        getVal: function () {
            return '/cls';
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.TRADE.name;
        }
    },
    {
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.GROUP)
            return new RegExp('^\/' + short + 'cls$', "g")
        },
        getVal: function () {
            return '/cls';
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.GROUP.name;
        }
    },
    {
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.CLAN)
            return new RegExp('^\/' + short + 'cls$', "g")
        },
        getVal: function () {
            return '/cls';
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.CLAN.name;
        }
    },
    {
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.SYSTEM)
            return new RegExp('^\/' + short + 'cls$', "g")
        },
        getVal: function () {
            return '/cls';
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.SYSTEM.name;
        }
    },
    {
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.PRIVATE)
            return new RegExp('^' + short + 'cls$', "g")
        },
        getVal: function () {
            return '/cls';
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.PRIVATE.name;
        }
    },
    {
        clearWithBlur: true,
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.GROUP)

            return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.GROUP.name;
        }
    },
    {
        clearWithBlur: true,
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.TRADE)

            return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.TRADE.name;
        }
    },
    //{
    //    clearWithBlur: true,
    //    getPattern: function () {
    //        let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.LOCAL)
    //
    //        return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
    //    },
    //    getChannel: function () {
    //        return ChatData.INPUT_CHANNEL_HEADER.LOCAL.name;
    //        //return ChatData.SERVER_CHANNEL[ChatData.INPUT_CHANNEL_HEADER.LOCAL.name];
    //    }
    //},
    {
        clearWithBlur: true,
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.CLAN)

            return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.CLAN.name;
        }
    },
    {
        getPattern: function () {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.GLOBAL);

            return new RegExp('^\/' + short + '(\\s|\&nbsp;)', "g")
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.GLOBAL.name;
        }
    },
    {
        getPattern: function () {

            //let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.LOCAL);
            let short = "l"; // EXCEPTION local dont have short in SI so HARD CODED /lm is local_me!
            let style = ChatData.INPUT_CHANNEL_MODE[ChatData.STYLE.ME].short;

            return new RegExp('^\/' + short + style + '(\\s|\&nbsp;)', "g")
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.LOCAL.name;
        },
        getStyle: function () {
            return ChatData.STYLE.ME
        }
    },
    {
        getPattern: function () {

            //let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.LOCAL);
            let short = "l"; // EXCEPTION local dont have short in SI so HARD CODED /ln is local_nar!
            let style = ChatData.INPUT_CHANNEL_MODE[ChatData.STYLE.NAR].short;

            return new RegExp('^\/' + short + style + '(\\s|\&nbsp;)', "g")
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.LOCAL.name;
            //return ChatData.SERVER_CHANNEL[ChatData.INPUT_CHANNEL_HEADER.LOCAL.name];
        },
        getStyle: function () {
            return ChatData.STYLE.NAR
        }
    },
    {
        getPattern: function () {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.GLOBAL);
            let style = ChatData.INPUT_CHANNEL_MODE[ChatData.STYLE.SPECIAL].short;

            return new RegExp('^\/' + short + style + '(\\s|\&nbsp;)', "g")
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.GLOBAL.name;
        },
        getStyle: function () {
            return ChatData.STYLE.SPECIAL
        }
    },
    {
        getPattern: function () {

            //let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.LOCAL);
            let short = "l"; // EXCEPTION local dont have short in SI so HARD CODED /ls is local_special!
            let style = ChatData.INPUT_CHANNEL_MODE[ChatData.STYLE.SPECIAL].short;

            return new RegExp('^\/' + short + style + '(\\s|\&nbsp;)', "g")
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.LOCAL.name;
        },
        getStyle: function () {
            return ChatData.STYLE.SPECIAL
        }
    },
    {
        //callback: function () {
        //
        //    getEngine().chatController.getChatWindow().setChannel(ChatData.CHANNEL.TRADE, ChatData.INPUT_CHANNEL_MODE[ChatData.STYLE.SPECIAL].request);
        //},
        getPattern: function () {

            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.TRADE);
            let style = ChatData.INPUT_CHANNEL_MODE[ChatData.STYLE.SPECIAL].short;

            return new RegExp('^\/' + short + style + '(\\s|\&nbsp;)', "g")
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.TRADE.name;
            //return ChatData.SERVER_CHANNEL[ChatData.INPUT_CHANNEL_HEADER.TRADE.name];
        },
        getStyle: function () {
            return ChatData.STYLE.SPECIAL
        }
    },
    {
        //callback: function (nick) {
        //    getEngine().chatController.getChatInputWrapper().setChannel(ChatData.INPUT_CHANNEL_HEADER.PRIVATE, nick);
        //},
        getValFromPatter: true,
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.PRIVATE);

            return new RegExp('^'+ short +'([\-\'\`\~ÄÄÄÄÄÄÅÅÅÅÃÃ³ÅÅÅ¹ÅºÅ»Å¼_a-zA-Z]+)(\\s|\&nbsp;)', "g")
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.PRIVATE.name;
            //return ChatData.SERVER_CHANNEL[ChatData.INPUT_CHANNEL_HEADER.PRIVATE.name];
        }
    },
    {
        clearWithBlur: true,
        getPattern: function () {
            let short = getEngine().chatController.getChatDataUpdater().getShortInputChannelData(ChatData.INPUT_CHANNEL_HEADER.PRIVATE);

            return new RegExp('^'+ short +'$', "g");
        },
        getChannel: function () {
            return ChatData.INPUT_CHANNEL_HEADER.PRIVATE.name;
        }
    }
]

//module.exports = o;
