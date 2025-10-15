//var TextCodeMessageParser = require('core/codeMessage/TextCodeMessageParser');
//var ViewCodeMessageParser = require('core/codeMessage/ViewCodeMessageParser');
//var CodeMessageData = require('core/codeMessage/CodeMessageData');
//var ChatData = require('core/chat/ChatData');

function CodeMessageManager () {

    let textCodeMessageParser = null;
    let viewCodeMessageParser = null;

    const init = () => {

        initTextCodeMessageParser();
        initViewCodeMessageParser();
        initTranslateList();
        initWrapperMessage();
        textCodeMessageParser.createAllInWorkLog()
    };

    const initTextCodeMessageParser = () => {
        textCodeMessageParser = new TextCodeMessageParser();
    };

    const initViewCodeMessageParser = () => {
        viewCodeMessageParser = new ViewCodeMessageParser();
    };

    function initWrapperMessage () {

        let CODE_MESSAGE_WRAPPER = CodeMessageData.CODE_MESSAGE_WRAPPER;

        let KEY_CODE    = CodeMessageData.CODE_MESSAGE_ATTR.KEY_CODE;
        let NAME        = CodeMessageData.CODE_MESSAGE_ATTR.NAME;

        for (let keyCode in CODE_MESSAGE_WRAPPER) {
            let oneKeyCodeData = CODE_MESSAGE_WRAPPER[keyCode];

            textCodeMessageParser.addRecordWrapperMessage(oneKeyCodeData[KEY_CODE], oneKeyCodeData[NAME]);
        }

    }

    function initTranslateList () {

        let CODE_MESSAGE = CodeMessageData.CODE_MESSAGE;

        let KEY_CODE    = CodeMessageData.CODE_MESSAGE_ATTR.KEY_CODE;
        let NAME        = CodeMessageData.CODE_MESSAGE_ATTR.NAME;

        for (let keyCode in CODE_MESSAGE) {
            let oneKeyCodeData = CODE_MESSAGE[keyCode];

            textCodeMessageParser.addRecord(oneKeyCodeData[KEY_CODE], oneKeyCodeData);
            viewCodeMessageParser.addRecord(oneKeyCodeData[KEY_CODE], oneKeyCodeData);
        }

    }

    const updateData = (codeMessageData, codeMessageSource, additionalData) => {

        switch (codeMessageSource) {
            case CodeMessageData.SOURCE.MESSAGE :       updateMessageSource(codeMessageSource, codeMessageData); break;
            case CodeMessageData.SOURCE.CHAT    :       updateChatSource(codeMessageSource, codeMessageData, additionalData); break;
            default :                                   errorReport('CodeMessageManager.js', 'updateData', `codeMessageSource ${codeMessageSource} not exist!`)
        }

    };

    const updateChatSource = (codeMessageSource, codeMessageData, additionalData) => {
        //for (let i = 0; i < codeMessageDataArray.length; i++) {

        let idMessage = codeMessageData.id;
        let o = textCodeMessageParser.getCodeMessageData(idMessage, codeMessageData);

        if (o.fullText == null) return;

        createOneMessageFromMessageSource(codeMessageSource, o, idMessage, additionalData);
        //}
    }

    const updateMessageSource = (codeMessageSource, codeMessageData) => {
        //for (let idMessage in codeMessageDataArray) {
            let idMessage = codeMessageData.id;
            let o = textCodeMessageParser.getCodeMessageData(idMessage, codeMessageData);

            if (o.fullText == null) return;
            if (o.confirm) {
                if (o.config && o.config.buttons) {
                    askAlert({
                        m   : 'buttons',
                        q   : parsePopupBB(o.fullText),
                        re  : o.confirm,
                        config: o.config
                    });
                    return;
                }
                askAlert({
                    m   : 'yesno',
                    q   : parsePopupBB(o.fullText),
                    re  : o.confirm
                });
                return;
            }

            createOneMessageFromMessageSource(codeMessageSource, o, idMessage);
        //}
    }

    const createOneMessageFromMessageSource = (codeMessageSource, o, idMessage, additionalData) => {

        let viewCodeMessageData = viewCodeMessageParser.getCodeMessageData(idMessage);
        let MESSAGE                 = CodeMessageData.SOURCE.MESSAGE;
        let CHAT                    = CodeMessageData.SOURCE.CHAT;
        let YELLOW_MESSAGE          = CodeMessageData.VISIBLE_KIND.YELLOW_MESSAGE;
        let ALERT                   = CodeMessageData.VISIBLE_KIND.ALERT;
        let CHAT_SYSTEM_MESSAGE     = CodeMessageData.VISIBLE_KIND.CHAT_SYSTEM_MESSAGE;
        const CHAT_CLAN_MESSAGE     = CodeMessageData.VISIBLE_KIND.CHAT_CLAN_MESSAGE;

        if (viewCodeMessageData && (viewCodeMessageData.viewParams[MESSAGE] || viewCodeMessageData.viewParams[CHAT])) {

            let viewType = getViewType(viewCodeMessageData, codeMessageSource);

            switch (viewType) {
                case YELLOW_MESSAGE         : message(o.fullText); break;
                case ALERT                  : mAlert(o.fullText);  break;
                case CHAT_SYSTEM_MESSAGE    : addChatMessage(additionalData, o.fullText, ChatData.CHANNEL.SYSTEM);  break;
                case CHAT_CLAN_MESSAGE      : addChatMessage(additionalData, o.fullText, ChatData.CHANNEL.CLAN);  break;
                //case CHAT_SYSTEM_MESSAGE    :
                //    getEngine().chatController.addMessage({
                //        ts                          : additionalData.ts,
                //        expiredMessage              : getEngine().chatController.getChatDataUpdater().checkExpiredMessage(additionalData.id, additionalData.ts),
                //        id                          : additionalData.id,
                //        channel                     : ChatData.CHANNEL.SYSTEM,
                //        systemRelatedBusinessCard   : additionalData.getSystemRelatedBusinessCard(),
                //        authorBusinessCard          : null,
                //        receiverBusinessCard        : null,
                //        text                        : o.fullText
                //    });
                //    break;
                default                     : errorReport('CodeMessageManager.js', 'createOneMessageFromMessageSource', `not supporter VISIBLE_KIND!`, viewCodeMessageData.viewParams[MESSAGE])
            }

        } else message(o.fullText);
    };

    const addChatMessage = (additionalData, text, channel) => {
        getEngine().chatController.addMessage({
            ts                          : additionalData.ts,
            expiredMessage              : getEngine().chatController.getChatDataUpdater().checkExpiredMessage(additionalData.id, additionalData.ts),
            id                          : additionalData.id,
            channel                     : channel,
            systemRelatedBusinessCard   : additionalData.getSystemRelatedBusinessCard(),
            authorBusinessCard          : null,
            receiverBusinessCard        : null,
            text                        : text
        });
    }

    const getViewType = (viewCodeMessageData, codeMessageSource) => {
        const MESSAGE                 = CodeMessageData.SOURCE.MESSAGE;
        const CHAT                    = CodeMessageData.SOURCE.CHAT;
        let viewType                  = null;

        if (viewCodeMessageData.viewParams[codeMessageSource]) viewType = viewCodeMessageData.viewParams[codeMessageSource]; // codes with multi VIEW_PARAMS, e.g. 4001001 has CHAT_SYSTEM_MESSAGE and YELLOW_MESSAGE
        else {

            if (viewCodeMessageData.viewParams[MESSAGE])    viewType = viewCodeMessageData.viewParams[MESSAGE];
            if (viewCodeMessageData.viewParams[CHAT])       viewType = viewCodeMessageData.viewParams[CHAT];

        }

        return viewType;
    };


    this.init       = init;
    this.updateData = updateData;
}
