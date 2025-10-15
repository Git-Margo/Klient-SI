//const tpl = require('core/Templates');
//var ChatData = require('core/chat/ChatData');
//
//const RadioList  = require("core/components/RadioList");

function ChatConfigureWindow () {

    let wnd = null;
    let content = null;

    const init = () => {
        initWindow();
        showNotificationChannelConfiguration();
        showTimeConfiguration();
        showChanelTagConfiguration();
    }

    const initWindow = () => {
        content = getEngine().chatController.getChatTemplates().get('chat-configure-window');

        wnd = getEngine().windowManager.add( {
            content           : content,
            //title             : _t("chat_options", null, 'chat_lang'),
            title             : getEngine().chatController.chatLang("chat_options"),
            nameWindow        : getEngine().windowsData.name.CHAT_CONFIGURE,
            onclose: () => {
                closeWindow();
                getEngine().chatController.getChatInputWrapper().clearChatConfigureWindow();
            }
        });

        wnd.addToAlertLayer();
        wnd.center();
    }

    const showTimeConfiguration = () => {
        let $wrapper = wnd.$.find('.time-configuration').empty();

        let twelveHour = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.TWELVE_HOUR)

        let radioListData1 = {
            radios: [
                {
                    value       : 1,
                    label       : '12h',
                    selected    : twelveHour
                },
                {
                    value       : 0,
                    label       : '24h',
                    selected    : !twelveHour
                },
            ],
            name: ChatData.MESSAGE_SUB_SECTIONS.TWELVE_HOUR,
            onSelected: clickHour
        }

        let allUnit = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.ALL_UNIT)

        let radioListData2 = {
            radios: [
                {
                    value       : 0,
                    label       : 'hh:mm',
                    selected    : !allUnit
                },
                {
                    value       : 1,
                    label       : 'hh:mm:ss',
                    selected    : allUnit
                },
            ],
            name: ChatData.MESSAGE_SUB_SECTIONS.ALL_UNIT,
            onSelected: clickHour
        }

        //const radioList1 = new RadioList.default(radioListData1, { isInline: true, label: _t('time_format', null, "chat_lang") }).getList();
        //const radioList2 = new RadioList.default(radioListData2, { isInline: true, label: _t('hour_format', null, "chat_lang") }).getList();
        const radioList1 = new RadioList.default(radioListData1, { isInline: true, label: getEngine().chatController.chatLang('time_format') }).getList();
        const radioList2 = new RadioList.default(radioListData2, { isInline: true, label: getEngine().chatController.chatLang('hour_format') }).getList();

        //let $one = createCheckBox(_t("show_time", null, 'chat_lang'), '', function (state) {
        let $one = createCheckBox(getEngine().chatController.chatLang("show_time"), '', function (state) {

            let chatConfig = getEngine().chatController.getChatConfig();

            chatConfig.setStorageData(
                [ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY],
                state
            );

            if (state) {
                radioList1.classList.add('active-section');
                radioList2.classList.add('active-section');
            } else {
                radioList1.classList.remove('active-section');
                radioList2.classList.remove('active-section');
            }

            getEngine().chatController.rebuiltMessage();
            getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
        });

        let state = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY);
        if (state) {
            $one.find('.checkbox').addClass('active');
            radioList1.classList.add('active-section');
            radioList2.classList.add('active-section');
        }



        $wrapper.append($one);
        $wrapper[0].appendChild(radioList1);
        $wrapper[0].appendChild(radioList2);
    }

    const showChanelTagConfiguration = () => {
        let $wrapper    = wnd.$.find('.tag-configuration').empty();


        let allTag = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.ALL_TAG)

        let radioListData = {
            radios: [
                {
                    value       : 1,
                    label       : _t("full_channel_tag", null, 'chat_lang'),
                    selected    : allTag
                },
                {
                    value       : 0,
                    label       : _t("shot_channel_tag", null, 'chat_lang'),
                    selected    : !allTag
                },
            ],
            name: ChatData.MESSAGE_SUB_SECTIONS.ALL_TAG,
            onSelected: clickHour
        }

        const label         = _t('tag_format', null, "chat_lang");
        const $smallIcon    = $('<div>').addClass('small-icon-wrapper').append(getEngine().chatController.getChatTemplates().get('info-icon').addClass('small-info').tip(_t("tag_format_tip", null, "chat_lang")));
        const radioList     = new RadioList.default(radioListData, { isInline: true, label: label, elementAfterLabel:$smallIcon[0] }).getList();
        const $one          = createCheckBox(_t("tag_show_options", null, 'chat_lang'), '', function (state) {

            getEngine().chatController.getChatConfig().setStorageData(
                [ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY],
                state
            );

            if (state)  radioList.classList.add('active-section');
            else        radioList.classList.remove('active-section');

            getEngine().chatController.rebuiltMessage();
            getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
        });

        let state = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY);
        if (state) {
            $one.find('.checkbox').addClass('active');
            radioList.classList.add('active-section');
        }

        $wrapper.append($one);
        $wrapper[0].appendChild(radioList);
    }

    const clickHour = (e1,e2) => {

        let value   = e1.target.value;
        let name    = e1.target.name;

        if (value === "1") value = true;
        if (value === "0") value = false;

        let chatConfig = getEngine().chatController.getChatConfig();

        switch (name) {
            case ChatData.MESSAGE_SUB_SECTIONS.ALL_TAG:     chatConfig.setStorageData([ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, name], value); break;
            case ChatData.MESSAGE_SUB_SECTIONS.ALL_UNIT:    chatConfig.setStorageData([ChatData.MESSAGE_SECTIONS.TS, name], value); break;
            case ChatData.MESSAGE_SUB_SECTIONS.TWELVE_HOUR: chatConfig.setStorageData([ChatData.MESSAGE_SECTIONS.TS, name], value); break;
        }

        getEngine().chatController.rebuiltMessage();
        getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
    }

    const showNotificationChannelConfiguration = () => {
        let CHANNEL_CARDS   = ChatData.CHANNEL_CARDS;
        let $wrapper        = wnd.$.find('.notification-configuration');

        for (let k in CHANNEL_CARDS) {
            if (k == ChatData.CHANNEL.GENERAL) continue;

            let $one = addMessageToGeneralOneCheckbox(k, k);
            $wrapper.append($one);
        }
    }

    const addMessageToGeneralOneCheckbox = (name, cl) => {
        let $one = createCheckBox(_t(name.toLowerCase(), null, 'chat_lang'), cl, function (state) {
            getEngine().chatController.getChatConfig().setStorageData(
                [ChatData.STATIC_KEYS.MESSAGES_ADD_TO_GENERAL, name, ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD],
                state);

            getEngine().chatController.rebuiltMessage();
            getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
        });


        let state = getEngine().chatController.getChatConfig().getMessagesAddToGeneralData(name, ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD);
        if (state) $one.find('.checkbox').addClass('active');

        return $one
    };

    const closeWindow = () => {
        wnd.remove();
    }

    this.init = init;
    this.closeWindow = closeWindow;

}