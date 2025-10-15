
function ChatChannelCardWrapper () {

    let $chatChannelCardWrapper = null;
    let activeChannelName;

    const init = () => {
        init$chatChannelCardWrapper();
        appendChatChannelCardWrapper();
        initChatChannelCards();
    };

    const init$chatChannelCardWrapper = () => {
        $chatChannelCardWrapper = getEngine().chatController.getChatTemplates().get("chat-channel-card-wrapper");
    };

    const appendChatChannelCardWrapper = () => {
        let $chatWindow = getEngine().chatController.getChatWindow().get$chatWindow();
        $chatWindow.append($chatChannelCardWrapper);
    };

    const initChatChannelCards = () => {
        let CHANNEL_CARDS = ChatData.CHANNEL_CARDS;
        for (let k in CHANNEL_CARDS) {
            let $chatChannelCard = createChatChannelCard(CHANNEL_CARDS[k]);
            $chatChannelCardWrapper.append($chatChannelCard);
        }
    };

    const setChannelCard = (channelName) => {
        activeChannelName = channelName;
        $chatChannelCardWrapper.find('.chat-channel-card').removeClass('active');
        $chatChannelCardWrapper.find(`.${channelName}-channel`).addClass('active')
    };

    const createChatChannelCard = (channelName) => {
        let $chatChannelCard = getEngine().chatController.getChatTemplates().get("chat-channel-card");
        $chatChannelCard.addClass(`${channelName}-channel`);

        $chatChannelCard.on("click", function () {

            if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(channelName)) return;

            showNotReadElement(channelName, false);
            getEngine().chatController.getChatWindow().setChannel(channelName);

            let CHAT_KEY    = ServerStorageData.CHAT;
            let SI_CHANNEL  = ChatData.SERVER_STORAGE.SI_CHANNEL;


            //margoStorage.set(CHAT_KEY + '/' + CHANNEL, channelName);

            getEngine().serverStorage.sendData({[CHAT_KEY]:{[SI_CHANNEL]:channelName}});
        });

        //let short   = ChatData.INPUT_CHANNEL_HEADER[channelName].short[_l()];
        //let tip     = _t(channelName.toLocaleLowerCase(), null, 'chat_lang') + (short ? ' /' + short + short : '');
        let text    = getEngine().chatController.chatLang(channelName.toLocaleLowerCase());
        //let tip     = short ? ' /' + short + short : '';

        //$chatChannelCard.tip(tip);

        //let tip     = addGeneralText(channelName, getEngine().chatController.chatLang(channelName.toLocaleLowerCase()));
        let tip     = getEngine().chatController.chatLang(channelName.toLocaleLowerCase());
        $chatChannelCard.tip(tip);
        $chatChannelCard.find(".chat-channel-card-icon").html(goldTxt(text));

        return $chatChannelCard
    };

    //const addGeneralText = (channelName, text) => {
    //    switch (channelName) {
    //        case ChatData.CHANNEL_CARDS.GLOBAL :
    //        case ChatData.CHANNEL_CARDS.LOCAL :
    //        case ChatData.CHANNEL_CARDS.TRADE :
    //            return _t('chat_global_tab') + " (" + text + ") ";
    //        default :
    //            return text
    //    }
    //}

    const setChannelCardFullProcedure = (channelName) => {
        if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(channelName)) return;

        showNotReadElement(channelName, false);
        getEngine().chatController.getChatWindow().setChannel(channelName);

        let CHAT_KEY    = ServerStorageData.CHAT;
        let SI_CHANNEL  = ChatData.SERVER_STORAGE.SI_CHANNEL;


        //margoStorage.set(CHAT_KEY + '/' + CHANNEL, channelName);

        getEngine().serverStorage.sendData({[CHAT_KEY]:{[SI_CHANNEL]:channelName}});
    }

    const showNotReadElement = (channelName, state) => {
        let $gfont = $chatChannelCardWrapper.find(`.${channelName}-channel`).find('.gfont');

        if (state)    updateGoldTxtColor($gfont, ['white']);
        else          updateGoldTxtColor($gfont, []);
    };

    const getActiveChannelName = () => {
        return activeChannelName;
    };

    const addOneMessageCounterProcedure = (channelName, author, wasRead) => {

        if (wasRead)                            return;
        if (hero.nick == author)                return;
        if (activeChannelName == channelName)   return;

        let state = getEngine().chatController.getChatConfig().getMessagesAddToGeneralData(channelName, ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD);
        if (activeChannelName == ChatData.CHANNEL.GENERAL && state) return;

        showNotReadElement(channelName, true);
    };

    this.init = init;
    this.addOneMessageCounterProcedure = addOneMessageCounterProcedure;
    this.showNotReadElement = showNotReadElement;
    this.setChannelCard = setChannelCard;
    this.setChannelCardFullProcedure = setChannelCardFullProcedure;
    this.getActiveChannelName = getActiveChannelName;

}