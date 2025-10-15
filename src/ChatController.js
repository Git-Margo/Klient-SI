//var ChatData = require('core/chat/ChatData.js');
//var ChatConfig = require('core/chat/ChatConfig.js');
//var ChatInputWrapper = require('core/chat/ChatInputWrapper');
//var ChatChannelCardWrapper = require('core/chat/ChatChannelCardWrapper');
//var ChatMessageWrapper = require('core/chat/ChatMessageWrapper');
//var ChatWindow = require('core/chat/ChatWindow');
//var ChatMessage = require('core/chat/ChatMessage');
//var ChatChannelsAvailable = require('core/chat/ChatChannelsAvailable');
//var ChatPrivateMessageData = require('core/chat/ChatPrivateMessageData');
//var ChatDataUpdater = require('core/chat/ChatDataUpdater');
//var ServerStorageData = require('core/storage/ServerStorageData.js');

function ChatController () {

    let chatTemplates = null;
    let chatMessageWithMarkReplace = null;
    let chatConfig = null;
    let chatInputWrapper = null;
    let chatChannelsAvailable = null;
    let chatPrivateMessageData = null;
    let chatChannelCardWrapper = null;
    let chatMessageWrapper = null;
    let chatDataUpdater = null;
    let chatWindow = null;
    let messageList = null;
    let messageListIdByTs = null;

    const init = () => {
        initObjects();
    };

    const initObjects = () => {
        chatTemplates = new ChatTemplates();
        chatMessageWithMarkReplace = new ChatMessageWithMarkReplace();
        chatDataUpdater = new ChatDataUpdater();
        chatPrivateMessageData = new ChatPrivateMessageData();
        chatChannelsAvailable = new ChatChannelsAvailable();
        chatConfig = new ChatConfig();
        chatInputWrapper = new ChatInputWrapper();
        chatChannelCardWrapper = new ChatChannelCardWrapper();
        chatMessageWrapper = new ChatMessageWrapper();
        chatWindow = new ChatWindow();


        chatTemplates.init();
        chatMessageWithMarkReplace.init();
        chatDataUpdater.init();
        chatChannelsAvailable.init();
        chatPrivateMessageData.init();
        chatWindow.init();
        chatConfig.init();
        chatInputWrapper.init();
        chatChannelCardWrapper.init();
        chatMessageWrapper.init();


        //chatDataUpdater.setDataFromServerStorage();
        initMessageList();
        initMessageListIdByTs();
        chatWindow.showChat();



    };

    const initMessageList = () => {

        messageList = {};

        let CHANNEL = ChatData.CHANNEL;
        for (let channelName in CHANNEL) {
            messageList[channelName] = {};
        }
    };

    const initMessageListIdByTs = () => {
        messageListIdByTs = [];
    };

    //let messageListIdByTs = [];
    const addToMessageListIdByTs = (newMessageData) => {
        let length = messageListIdByTs.length;

        if (!length) {
            messageListIdByTs.push(newMessageData);
            return;
        }

        let findTs = newMessageData.ts;

        for (let i = length - 1; i > -1 ; i--) {
            if (messageListIdByTs[i].ts < findTs) {
                let nextI = i + 1;
                messageListIdByTs.splice(nextI, 0, newMessageData);
                return
            }
        }

        messageListIdByTs.unshift(newMessageData);
    };

    const getMessageWithLastTs = () => {
        let length = messageListIdByTs.length;
        if (!length) return null;

        return messageListIdByTs[length - 1];
    }

    const rebuiltMessage = () => {
        chatMessageWrapper.clearAllMessageWrapperChannel();
        chatConfig.updateSectionsVisible();
        chatConfig.updateMessagesAddToGeneral();

        let dataUpdater     = getEngine().chatController.getChatDataUpdater();
        let mergeMsg        = getArrayOfMessageInCorrectOrder();
        let archivedMessage = dataUpdater.getArchivedMessage();

        let sortedMsg = dataUpdater.sortMessage({
            mergeMessage                : mergeMsg,
            mergeArchivedMessage        : archivedMessage
        });


        for (let k in sortedMsg) {

            if (sortedMsg[k].isCodeMessage()) {

            }

            if (!sortedMsg[k].isCodeMessage()) {
                sortedMsg[k].updateMessage();
                sortedMsg[k].appendMessageToChannel(true);
            }
        }

        chatMessageWrapper.updateScroll()
    };

    const getSortMessage = (allMsg) => {
        let sortable = [];

        for (let k in allMsg) {
            sortable.push(allMsg[k]);
        }

        sortable.sort(function(a, b) {
            return a.getTs() - b.getTs();
        });

        return sortable;
    };

    const getArrayOfMessageInCorrectOrder = () => {
        let allMessage = [];
        for (let channelName in messageList) {
            let oneChannel = messageList[channelName];
            for (let k in oneChannel) {
                allMessage.push(oneChannel[k]);
            }
        }

        return allMessage
    };

    const addMessage = (data) => {

        if (data.id == undefined) {
            errorReport("ChatController.js", "addMessage", "Chat message id == undefined !")
            return
        }

        let messageId   = data.id;
        let channelName = data.channel;


        let newMessage = new ChatMessage();

        //console.log(data.authorBusinessCard.getNick());


        if (data.receiverBusinessCard && data.authorBusinessCard && data.authorBusinessCard.getNick() != hero.nick) chatPrivateMessageData.addReceiveMessageUser(data.authorBusinessCard.getNick());
        if (data.receiverBusinessCard && data.authorBusinessCard && data.authorBusinessCard.getNick() == hero.nick) chatPrivateMessageData.addSendMessageUser(data.receiverBusinessCard.getNick());

        if (data.channel != ChatData.CHANNEL.SYSTEM) addToMessageListIdByTs(data);

        addToMessageList(newMessage, messageId, channelName);

        if (!data.town) getEngine().chatController.getChatMessageWrapper().manageChatWidgetAmountAfterAddMessage();

        newMessage.init(data);
        newMessage.updateMessage();

        newMessage.appendMessageToChannel(getEngine().init < 5);
    };



    //const showCommercials = (data, kind) => {
    //    if (!data.length) return;
    //
    //    deleteCommercialMessage(kind);
    //
    //    chatDataUpdater.updateMessages(data);
    //}

    //const deleteCommercialMessage = (kind) => {
    //    let data = messageList[ChatData.CHANNEL.GLOBAL];
    //
    //    for (let k in data) {
    //        let commercials = data[k].getCommercials();
    //        if (commercials && commercials == kind) {
    //            data[k].remove();
    //            delete data[k];
    //        }
    //    }
    //}

    const clearMessageList = (channel) => {
        messageList[channel] = {};
    }

    const checkMessageExist = (id, channel) => {
        return messageList[channel][id] ? true : false;
    };

    const addToMessageList = (newMessage, id, channel) => {
        messageList[channel][id] = newMessage;
    };

    const getMessageList = () => {
        return messageList;
    }

    const getChatConfig = () => {
        return chatConfig;
    };

    const getChatWindow = () => {
        return chatWindow;
    };

    const getChatInputWrapper = () => {
        return chatInputWrapper;
    };

    const getChatMessageWrapper = () => {
        return chatMessageWrapper;
    };

    const getChatChannelCardWrapper = () => {
        return chatChannelCardWrapper;
    };

    const getChatChannelsAvailable = () => {
        return chatChannelsAvailable;
    };

    const getChatPrivateMessageData = () => {
        return chatPrivateMessageData;
    };

    const getChatDataUpdater = () => {
        return chatDataUpdater;
    };

    const getChatTemplates = () => {
        return chatTemplates;
    };

    const getChatMessageWithMarkReplace = () => {
        return chatMessageWithMarkReplace;
    };


    const chatLang = (key, parameters) => {
        return _t(key, parameters ? parameters : null, "chat_lang")
    }

    this.init = init;
    //this.showCommercials = showCommercials;
    //this.getChatSizeFromServerStorage = getChatSizeFromServerStorage;
    this.getChatConfig = getChatConfig;
    this.getChatWindow = getChatWindow;
    this.getChatDataUpdater = getChatDataUpdater;
    this.getChatMessageWithMarkReplace = getChatMessageWithMarkReplace;
    this.getChatTemplates = getChatTemplates;
    this.getChatInputWrapper = getChatInputWrapper;
    this.getChatMessageWrapper = getChatMessageWrapper;
    this.getChatChannelCardWrapper = getChatChannelCardWrapper;
    this.getChatChannelsAvailable = getChatChannelsAvailable;
    this.getChatPrivateMessageData = getChatPrivateMessageData;
    this.addMessage = addMessage;
    this.rebuiltMessage = rebuiltMessage;
    this.checkMessageExist = checkMessageExist;
    this.addToMessageList = addToMessageList;
    this.clearMessageList = clearMessageList;
    this.chatLang = chatLang;
    this.getMessageList = getMessageList;
    this.getMessageWithLastTs = getMessageWithLastTs;

}