//var Tpl = require('core/Templates');
//var ChatData = require('core/chat/ChatData.js');
//var ServerStorageData = require('core/storage/ServerStorageData.js');

function ChatWindow () {

    let $chatWindow = null;
    let chatVisible = 1;

    const init = () => {
        initChatWindow();
        //initCloseMobileOverlay();
        initEvents();
        appendChatWindow();
    };

    const initEvents = () => {
        $('#base').on('click', function(e) {
            getEngine().chatController.getChatInputWrapper().blurIFFocus();
        });

        addEventListener('keydown', function (e) {

            if (!e.altKey) return;

            switch (e.key) {
                case '1': setChannelAndSetMarkInInputIfFocus(ChatData.CHANNEL.GENERAL);e.preventDefault();break;
                case '2': setChannelAndSetMarkInInputIfFocus(ChatData.CHANNEL.GLOBAL);e.preventDefault();break;
                case '3': setChannelAndSetMarkInInputIfFocus(ChatData.CHANNEL.LOCAL);e.preventDefault();break;
                case '4': setChannelAndSetMarkInInputIfFocus(ChatData.CHANNEL.TRADE);e.preventDefault();break;
                case '5': setChannelAndSetMarkInInputIfFocus(ChatData.CHANNEL.GROUP);e.preventDefault();break;
                case '6': setChannelAndSetMarkInInputIfFocus(ChatData.CHANNEL.CLAN);e.preventDefault();break;
                case '7': setChannelAndSetMarkInInputIfFocus(ChatData.CHANNEL.SYSTEM);e.preventDefault();break;
                case '8': setChannelAndSetMarkInInputIfFocus(ChatData.CHANNEL.PRIVATE);e.preventDefault();break;
            }
        });
    };

    const setChannelAndSetMarkInInputIfFocus = (channelName) => {
        let chatChannelCardWrapper  = getEngine().chatController.getChatChannelCardWrapper();
        let chatInputWrapper        = getEngine().chatController.getChatInputWrapper();

        chatChannelCardWrapper.setChannelCardFullProcedure(channelName);

        if (chatInputWrapper.isFocus()) chatInputWrapper.manageMarkAfterInputFocus();
    };

    //const initCloseMobileOverlay = () => {
    //    //getEngine().interface.get$gameWindowPositioner().find('.chat-layer').find('.chat-overlay').click(() => {
    //    //    setVisibleMobileView(false)
    //    //});
    //}

    const initChatWindow = () => {
        //$chatWindow = getEngine().chatController.getChatTemplates().get("new-chat-window");
        $chatWindow = $('#chat');
    };

    const appendChatWindow = () => {
        //$('body').append($chatWindow);
        //getEngine().interface.get$interfaceLayer().find('.left-column').find('.inner-wrapper').append($chatWindow);
    };

    //const appendMessageToChatWindow = ($msg) => {
    //    $chatWindow.find(".message-wrapper").append($msg);
    //}

    const get$chatWindow = () => {
        return $chatWindow;
    };

    const setChannel = (channelName, _styleMessage, ignoreCheckCardCanChoose) => {
        //let data            = ChatData.INPUT_CHANNEL_HEADER[channelName];
        //let styleMessage    = _styleMessage ? _styleMessage : null;

        let styleMessage        = _styleMessage ? _styleMessage : null;
        let inputWrapperName    = ChatData.INPUT_CHANNEL_HEADER[channelName].inputWrapper;
        let data                = ChatData.INPUT_CHANNEL_HEADER[inputWrapperName];

        getEngine().chatController.getChatChannelCardWrapper().setChannelCard(channelName);
        getEngine().chatController.getChatInputWrapper().setChannel(data, null, styleMessage, ignoreCheckCardCanChoose);
        getEngine().chatController.getChatMessageWrapper().setChannelMessageWrapper(channelName);
        getEngine().chatController.getChatMessageWrapper().updateScroll();
        getEngine().chatController.getChatMessageWrapper().setScrollOnBottom();
    };

    const getChatSize = () => {
        //return chatVisible ? 1 : 0;
        return chatVisible;
    };

    const manageChatWindowAfterEnter = () => {
        let s = getChatSize();

        if (!s) chatToggle();

        console.trace("manageChatWindowAfterEnter");
        getEngine().chatController.getChatInputWrapper().focus();
    };

    const chatToggle = function () {
        const CHAT_KEY 	    = ServerStorageData.CHAT;
        const SI_VISIBLE 	= ChatData.SERVER_STORAGE.SI_VISIBLE;;

        //margoStorage.get(CHAT_KEY + '/' + VISIBLE, state);
        //margoStorage.set('quest-log-visible', state);

        setChatVisible(chatVisible + 1);

        if (chatVisible > 2) setChatVisible(0);

        //setChatVisible();

        let data		= {
            [CHAT_KEY] : {
                [SI_VISIBLE] : chatVisible
            }
        };

        //margoStorage.set(CHAT_KEY + '/' + VISIBLE, chatVisible);

        getEngine().serverStorage.sendData(data);
        rebuildChatAfterToggle();
    };

    const rebuildChatAfterToggle = () => {
        //getEngine().interface.setChat();

        //if (!getEngine().interface.isShowLeftColumn()) return;
        showChat();

        let chatMessageWrapper 	= getEngine().chatController.getChatMessageWrapper();

        //chatMessageWrapper.resetHideChatMessageCounterAndChatWidgetAmount();
        chatMessageWrapper.setScrollOnBottom();

    };

    const setChatVisible = (_chatVisible) => {
        chatVisible = _chatVisible;
    };

    const setChatOverAdditionalBarPanel = (state) => {
        var bottom = state ? 49 : 0;
        $chatWindow.css('bottom', bottom + 'px');
    };

    const setVisibleMobileView = (state) => {
        getEngine().interface.get$gameWindowPositioner().find('.chat-layer').css('display', state ? 'block' : "none");
    };

    const showChat = () => {

        //if (newChatMode) if (g.chatController) g.chatController.getChatWindow().setChatState(g.chat.state)

        //if (y==3 && $(window).width() < 1068){
        //    return showChat(0);
        //}
        switch(parseInt(chatVisible)){
            case 0:
                makeChatRight();
                $chatWindow.hide();
                $('#mailnotifier').fadeTo(100, 1);
                $('#pvpStatMainBox').css({top:503});
                //$('#youtube').height(512);
                break;
            case 1:
                //let h = 150;
                let h = 168;
                $chatWindow.height(h).show();
                if(window.opera) $('#chattxt').height(68);
                //$('#youtube').height(512-h+3);
                //chatScroll(-1);
                $('#mailnotifier').fadeTo(100, 0.5);
                $('#chatMoveHandler').css({display:'block'});
                $('#pvpStatMainBox').css({top:356});
                break;
            //case 2:
            //    $('#chat').height(160).show();
            //    if(window.opera) $('#chattxt').height(138);
            //    $('#youtube').height(512-160+3);
            //    chatScroll(-1);
            //    $('#mailnotifier').fadeTo(100, 0.5);
            //    $('#chatMoveHandler').css({display:'block'});
            //    $('#pvpStatMainBox').css({top:346});
            //    if (getCookie('battleLogSize') == 'big') toggleBattleLog();
            //    break;
            case 2:
                makeChatLeft();
                $('#mailnotifier').fadeTo(100, 1);
                //$('#youtube').height(512);
                $('#pvpStatMainBox').css({top:503});
                break;

        }
        //g.chat.state=y;
        setCookie('cy', chatVisible);
        map.resizeView();
        reCenter();
    };

    const makeChatLeft = () => {
        $chatWindow.detach().appendTo('body').css({
            width:      '',
            height:     '',
            display:    'block',
            top:        $('#centerbox').offset().top,
            left:       $('#centerbox').offset().left-276}).addClass('left');

        var chatTxtContainer = $(document.createElement('div')).css({padding:'4px 20px 3px 5px'}).attr('id', 'chatTxtContainer');

        $('#chattxt').detach().appendTo(chatTxtContainer).css({height:460});
        $chatWindow.append(chatTxtContainer);
        //$('#chatscrollbar').css({left:256});
        //chatScrollbar('chattxt', chatVisible == 3?255:500, 'chatscrollbar');
        //chatScroll(-1);
    }

    const makeChatRight = () => {
        $chatWindow.detach().appendTo('#centerbox').css({
            width       :512,
            bottom      :25,
            left        :0,
            top         :'auto'
        }).removeClass('left');

        $('#chattxt').detach().appendTo('#chat');
        $('#chatTxtContainer').remove();
        $('#chattxt').css({padding:'',height:''});
        //$('#chatscrollbar').css({left:500});
        //chatScrollbar('chattxt', chatVisible == 3 ? 255 : 500, 'chatscrollbar');
        //chatScroll(-1);
    }

    const chatScrollbar = (id, left, handleId) => {
        var $el= $('#'+id), $bar = $('#'+handleId);
        if( $el.position() == null ) return;
        var elH=$el.prop('scrollHeight');
        if(elH <= Math.round($el.outerHeight())){
            $bar.css({
                height: $el.height(),
                top: $el.position().top
            });
            if(isset($bar.data('uiDraggable')))
                $bar.draggable("option", "containment", [left,$el.offset().top,left,$el.offset().top]);
            // $bar.data('draggable').containment=[left,$el.offset().top,left,$el.offset().top];
            $bar.css({
                top: $el.position().top,
                visibility: 'hidden'
            });
            $el.scrollTop($el.offset().top);
            return;
        }
        $bar.css({
            visibility: 'visible'
        });
        var barH=Math.max(15,parseInt($el.height()*$el.height()/parseFloat(elH)));
        $bar.css({
            height: barH
        });
        //log($el.height()+' '+barH+' '+ $el.position().top+' '+$el.offset().top);
        if ($bar.attr('on_bottom') == '1') {
            $bar.css({
                'top': $el.height() - barH + $el.position().top
            });
        }
        if($el.position().top>$bar.position().top)
            $bar.css('top', $el.position().top);
        if($el.height()-barH == 0 ) return;
        $el.scrollTop((elH-$el.height())*parseFloat(parseFloat($bar.position().top-$el.position().top)/parseFloat($el.height()-barH)));
        // $bar.data('draggable').containment= [left,$el.offset().top,left,$el.offset().top+$el.height()-barH];
        $bar.draggable("option", "containment", [left,$el.offset().top,left,$el.offset().top+$el.height()-barH]);
        if($bar.position().top-$el.position().top >= $('#'+id).height()-barH )
            $bar.attr('on_bottom', '1');
    }

    const chatScroll = (dtop) => {
        $("#chattxt").scrollTop($("#chattxt").prop("scrollHeight"));
    }

    this.init = init;
    this.setChatOverAdditionalBarPanel = setChatOverAdditionalBarPanel;
    this.get$chatWindow = get$chatWindow;
    this.manageChatWindowAfterEnter = manageChatWindowAfterEnter;
    this.setChatVisible = setChatVisible;
    this.chatToggle = chatToggle;
    //this.appendMessageToChatWindow = appendMessageToChatWindow;
    this.setChannel = setChannel;
    this.showChat = showChat;
    this.getChatSize = getChatSize;
    this.setVisibleMobileView = setVisibleMobileView;
    this.chatScrollbar = chatScrollbar;
    this.rebuildChatAfterToggle = rebuildChatAfterToggle;

};
