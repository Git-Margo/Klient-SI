//var Tpl = require('core/Templates');
//var ChatData = require('core/chat/ChatData');

function ChatNotificationView () {

    let $chatNotificationWrapper = null;


    const init = (_$chatNotificationWrapper) => {
        initChatNotificationWrapper();
        addNotificationToWrapper();
        appendChatNotificationWrapper(_$chatNotificationWrapper)


        for (let k in ChatData.NOTIFICATION) {
            turnOffNotification(k);
        }

        //turnOnNotification(ChatData.NOTIFICATION.WATCH);

    };

    const appendChatNotificationWrapper = (_$chatNotificationWrapper) => {
        _$chatNotificationWrapper.replaceWith($chatNotificationWrapper);
    }

    const addNotificationToWrapper = () => {
        let NOTIFICATION = ChatData.NOTIFICATION;

        for (let k in NOTIFICATION) {
            let $notification = createChatNotification(k);
            appendChatNotification($notification);
        }
    };

    const createChatNotification = (name) => {
        let $notification = $('<div>').addClass('chat-notification chat-notification-' + name);
        $notification.tip(`chat-notification-${name}`);

        return $notification;

    };

    const appendChatNotification = ($notification) => {
        $chatNotificationWrapper.append($notification);
    };


    const initChatNotificationWrapper = () => {
        $chatNotificationWrapper = getEngine().chatController.getChatTemplates().get('chat-notification-wrapper');
    };

    const turnOnNotification = (name, tip) => {
        let $notification = $chatNotificationWrapper.find(`.chat-notification-${name}`);
        $notification.css('display', 'inline-block');
        if (tip) $notification.tip(tip);
    };

    const turnOffNotification = (name) => {
        $chatNotificationWrapper.find(`.chat-notification-${name}`).css('display', 'none');
    };

    this.init = init;
    this.turnOnNotification = turnOnNotification;
    this.turnOffNotification = turnOffNotification;

};