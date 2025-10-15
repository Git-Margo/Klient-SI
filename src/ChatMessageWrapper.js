//const tpl = require('core/Templates');
//var ChatData = require('core/chat/ChatData');

function ChatMessageWrapper () {

    let $chatMessageWrapper;
    let hideChatMessageCounter;

    const init = () => {
        resetHideChatMessageCounter();
        init$chatMessageWrapper();
        append$chatMessageWrapperToChatWindow();
        initAllMessageWrapperChannel();
        initScrollBar();
        updateScroll();
    };

    const increaseHideChatMessageCounter = () => {
      hideChatMessageCounter++;
    };

    const resetHideChatMessageCounter = () => {
        hideChatMessageCounter = 0;
    };

    const resetHideChatMessageCounterAndChatWidgetAmount = () => {
        resetHideChatMessageCounter();
        getEngine().widgetManager.widgets.updateAmount(getEngine().widgetsData.name.CHAT, '');
    };

    const manageChatWidgetAmountAfterAddMessage = () => {

        return;
        if (getEngine().getFirstNotInit() === true) return;

        let show = getEngine().interface.isShowLeftColumn();

        if (show) return;

        increaseHideChatMessageCounter();

        getEngine().widgetManager.widgets.updateAmount(getEngine().widgetsData.name.CHAT, (hideChatMessageCounter > 999 ? "+999" : hideChatMessageCounter));
    };

    const initScrollBar = () => {
        //$chatMessageWrapper.addScrollBar({
        //    track: true,
        //    callback: scrollMove
        //});
        //document.addEventListener('scroll', function(e) {
        //    let documentHeight = document.body.scrollHeight;
        //    let currentScroll = window.scrollY + window.innerHeight;
        //    // When the user is [modifier]px from the bottom, fire the event.
        //    let modifier = 200;
        //    if(currentScroll + modifier > documentHeight) {
        //        console.log('You are at the bottom!')
        //    }
        //})

        $('#chattxt').scroll(function(event, e) {
            //console.log(event, e);

            //let $scrollWrapper      = $(event.currentTarget);
            //let $scrollPane         = $(event.currentTarget).find('.scroll-pane');

            console.log('isBottom', checkScrollIsBottom());
            //
            //debugger;
            ////console.log(event.currentTarget.offsetTop)
            //let $currentTarget      = $(event.currentTarget);
            //let $scrollPane         = $(event.currentTarget).find('.scroll-pane');
            //
            //let parentTop           = $currentTarget.offset().top;
            //let $scrollPaneTop      = $scrollPane.offset().top;
            //let parentHeight        = $currentTarget.height();
            //let $scrollPaneHeight   = $scrollPane.height();
            //
            //if ($scrollPaneTop + $scrollPaneHeight < parentTop + parentHeight) {
            //    console.log('BOTTOM');
            //}
        });
    };

    const checkScrollIsBottom = () => {
        let el = $chatMessageWrapper[0];

        return el.scrollTop + el.offsetHeight >= el.scrollHeight - 1 && el.scrollTop + el.offsetHeight <= el.scrollHeight + 1;
    };

    const setScrollOnBottom = () => {
        let el = $chatMessageWrapper[0];
        el.scrollTop = el.scrollHeight;
    };

    const updateScroll = () => {
        $chatMessageWrapper.trigger('update');
    };

    const scrollMove = (e) => {
        //console.log('scrollmove')
    };

    const initAllMessageWrapperChannel = () => {
        let CHANNEL = ChatData.CHANNEL;
        for (let k in CHANNEL) {
            let $oneChatMessageWrapper = createOneChatMessageWrapper(k);
            $chatMessageWrapper.find('.scroll-pane').append($oneChatMessageWrapper);
        }
    };

    const clearAllMessageFromWrapperByChannelName = (channel) => {
        $chatMessageWrapper.find('.chat-' + channel +'-message').remove()
    };

    const clearAllMessageWrapperChannel = () => {
        $chatMessageWrapper.find('.one-message-wrapper').empty()
    };

    const init$chatMessageWrapper = () => {
        $chatMessageWrapper = getEngine().chatController.getChatTemplates().get("chat-message-wrapper");
    };

    const setChannelMessageWrapper = (channelName) => {
        $chatMessageWrapper.find('.one-message-wrapper').removeClass('active');
        $chatMessageWrapper.find(`.${channelName}-message-wrapper`).addClass('active')
    }

    const createOneChatMessageWrapper = (channelName) => {
        let $oneChatMessageWrapper = $('<div>').addClass(`one-message-wrapper`);
        $oneChatMessageWrapper.addClass(`${channelName}-message-wrapper`);


        return $oneChatMessageWrapper
    }

    const append$chatMessageWrapperToChatWindow = (channelName) => {
        let $chatWindow = getEngine().chatController.getChatWindow().get$chatWindow()
        $chatWindow.append($chatMessageWrapper)
        //$chatWindow.find(".chat-message-wrapper").replaceWith($chatMessageWrapper);
    };

    const appendMessageToMessageWrapper = (channelName, author, $message, wasRead) => {
        //console.log('wasRead', wasRead)
        let scrollVisibleBeforeAppend   = checkScrollVisible();
        let scrollIsBottom              = false;

        if (scrollVisibleBeforeAppend) {
            scrollIsBottom = getEngine().chatController.getChatMessageWrapper().checkScrollIsBottom();
        }

        $chatMessageWrapper.find(`.${channelName}-message-wrapper`).append($message);

        if (channelName != ChatData.CHANNEL.GENERAL) {

            let state = getEngine().chatController.getChatConfig().getMessagesAddToGeneralData(channelName, ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD);
            if (state) {
                let $cloneMessage = $message.clone(true);
                //$cloneMessage.addClass(channelName + '-in-general');
                //$cloneMessage.addClass(channelName + '-channel-in-' + ChatData.CHANNEL.GLOBAL + '-channel');
                //$chatMessageWrapper.find(`.${ChatData.CHANNEL.GLOBAL}-message-wrapper`).append($cloneMessage);

                $cloneMessage.addClass(channelName + '-channel-in-' + ChatData.CHANNEL.GENERAL + '-channel');
                $chatMessageWrapper.find(`.${ChatData.CHANNEL.GENERAL}-message-wrapper`).append($cloneMessage);
            }
        }

        getEngine().chatController.getChatChannelCardWrapper().addOneMessageCounterProcedure(channelName, author, wasRead);

        updateScroll();

        let scrollVisibleAfterAppend = checkScrollVisible();

        if (g.init < 5) {
            setScrollOnBottom();
            return;
        }

        if (!scrollVisibleBeforeAppend && scrollVisibleAfterAppend) {
            setScrollOnBottom();
            return;
        }

        if (scrollIsBottom) {
            setScrollOnBottom();
            return;
        }

    };

    const checkScrollVisible = () => {
        //return $chatMessageWrapper.hasClass('scrollable');
        return $chatMessageWrapper.find('.scroll-pane').height() > $chatMessageWrapper.height();
    }

    this.init = init;
    this.setChannelMessageWrapper = setChannelMessageWrapper;
    this.appendMessageToMessageWrapper = appendMessageToMessageWrapper;
    this.updateScroll = updateScroll;
    this.setScrollOnBottom = setScrollOnBottom;
    this.manageChatWidgetAmountAfterAddMessage = manageChatWidgetAmountAfterAddMessage;
    this.resetHideChatMessageCounterAndChatWidgetAmount = resetHideChatMessageCounterAndChatWidgetAmount;
    this.clearAllMessageWrapperChannel = clearAllMessageWrapperChannel;
    this.clearAllMessageFromWrapperByChannelName = clearAllMessageFromWrapperByChannelName;
    this.checkScrollIsBottom = checkScrollIsBottom;

}