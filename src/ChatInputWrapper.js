//const tpl = require('core/Templates');
//var ChatData = require('core/chat/ChatData');
//var MagicInput3 = require('core/chat/MagicInput3');
//var ChatNotificationView = require('core/chat/ChatNotificationView');
//var ChatNotificationManager = require('core/chat/ChatNotificationManager');
//var ChatConfigureWindow = require('core/chat/ChatConfigureWindow');

function ChatInputWrapper() {

    let channelName         = ChatData.CHANNEL.GLOBAL;
    let $chatInputWrapper   = null;
    let $clearCross         = null;
    let magicInput          = null;
    let $chatInput          = null;
    let chatNotificationView    = null;
    let chatNotificationManager    = null;
    let privateReceiver     = null;
    let styleMessage        = null;
    let chatConfigureWindow = null;
    let blockNearOnEnterUp  = null;


    let mode        = null;  //todo #30935 //#30932

    const init = () => {
        //return
        resestMode();
        initWrapperElement();
        //initMagicInput();
        initInput();
        initChatNotificationManager();
        initChatNotificationView();
        initStyle();
        appendChatInputWrapper();
        initMenu();
        initBackToDefault();
        initChatConfigWrapper();
        //initRemoveMessage();
        initChatSwitchMode();
        setBlockNearOnEnterUp(false);
        //initMobilePlug();
        //appendRemoveMessage();
    };

    const initChatSwitchMode = () => {
        $('#bchat').click(function () {
            getEngine().chatController.getChatWindow().chatToggle();
        });
    };

    //const initMobilePlug = () => {
    //    //if (!mobileCheck()) return;
    //
    //    let $typeMobileMessage = $chatInputWrapper.find('.magic-input-wrapper').find('.type-mobile-message');
    //
    //    $typeMobileMessage.css('display', "block");
    //
    //
    //    $typeMobileMessage.click(() => {
    //        focus();
    //    })
    //}

    //const initRemoveMessage = () => {
    //    let clearCrossWrapper;
    //
    //    $clearCross = $('<div>').addClass('clear-cross');
    //    $clearCross.tip(_t('reset', null, 'ah_filter_history'));
    //
    //    $clearCross.on('click', () => {
    //        setClearCross(false);
    //        //magicInput.setInput('');
    //        //$chatInput.val('');
    //        setInput('');
    //    });
    //
    //    //if (mobileCheck())  clearCrossWrapper = getEngine().interface.get$gameWindowPositioner().find('.chat-layer').find('.magic-input-wrapper');
    //    clearCrossWrapper = $chatInputWrapper.find('.magic-input-wrapper');
    //
    //    clearCrossWrapper.append($clearCross);
    //};

    //const appendRemoveMessage = () => {
    //    $chatInputWrapper.find('.magic-input-wrapper').append($clearCross);
    //}

    const resestMode = () => {
        setMode(null);
    };

    const initChatConfigWrapper = () => {
        let $b = $('<div>').addClass('chat-config-wrapper-button');

        $b.on('click', function () {

            if (chatConfigureWindow) closeChatConfigureWindow();
            else                     initChatConfigureWindow();

        });

        //$b.tip(_t("config_button", null, "chat_lang"));
        $b.tip(getEngine().chatController.chatLang("config_button"));

        $chatInputWrapper.find(".chat-config-wrapper").append($b)
    }

    const initChatConfigureWindow = () => {
        chatConfigureWindow = new ChatConfigureWindow();
        chatConfigureWindow.init();
    }

    const closeChatConfigureWindow = () => {
        chatConfigureWindow.closeWindow();
        clearChatConfigureWindow();
    }

    const clearChatConfigureWindow = () => {
        chatConfigureWindow = null;
    }

    const initStyle = () => {
        $chatInputWrapper.find(".private-nick").css('color', ChatData.INPUT_CHANNEL_HEADER.PRIVATE.heroMsgColor);
    };

    const setVisibleBackToDefault = () => {
        //let visible = getEngine().chatController.getChatChannelCardWrapper().getActiveChannelName() == channelName ? "none" : "inline-block";

        let chooseCard          = getEngine().chatController.getChatChannelCardWrapper().getActiveChannelName();
        let inputWrapperName    = ChatData.INPUT_CHANNEL_HEADER[chooseCard].inputWrapper;
        let visible;

        if (inputWrapperName == ChatData.INPUT_CHANNEL_HEADER[chooseCard].name) visible = chooseCard == channelName ? "none" : "inline-block";
        else                                                                    visible = channelName == inputWrapperName ? "none" : "inline-block";


        $chatInputWrapper.find(".card-remove").css('display', visible);
    };

    const initBackToDefault = () => {
        //let data = ChatData.INPUT_CHANNEL_HEADER[name];
        //
        //setChannel(data);
        let $cardRemove = $chatInputWrapper.find(".card-remove");
        $cardRemove.on("click", () => {
            //let name = getEngine().chatController.getChatChannelCardWrapper().getActiveChannelName();
            //let data = ChatData.INPUT_CHANNEL_HEADER[name];

            let name                = getEngine().chatController.getChatChannelCardWrapper().getActiveChannelName();
            let inputWrapperName    = ChatData.INPUT_CHANNEL_HEADER[name].inputWrapper;
            let data                = ChatData.INPUT_CHANNEL_HEADER[inputWrapperName];

            setChannel(data);
        });
        $cardRemove.tip(_t('reset', null, 'ah_filter_history'));
    };

    const initMenu = () => {
        $chatInputWrapper.find(".card-name").on("click", (e) => {
            e.stopPropagation();
            togleCardList();
        });
        createMenu();
    };

    const createMenu = () => {
        let list        = ChatData.INPUT_CHANNEL_HEADER;
        let $cardList   = $chatInputWrapper.find(".card-list");

        for (let k in list) {
            createOneChannelElement(list[k], $cardList)
        }

        $("body").on("click", function (e) {
            if (getVisibleCardList()) hideCardList();
        })
    };

    const createOneChannelElement = (oneChannelData, $cardList) => {

        if (!oneChannelData.menu) return;

        let short           = oneChannelData.short[_l()];
        let color           = oneChannelData.heroMsgColor;
        //let $oneChannel     = $("<div>").addClass("input-channel-item").html(_t(oneChannelData.name.toLowerCase(), null, 'chat_lang') + ' /' + short);
        let $oneChannel     = $("<div>").addClass("input-channel-item").html(getEngine().chatController.chatLang(oneChannelData.name.toLowerCase()) + ' /' + short);

        $oneChannel.css("color", color);

        oneChannelClickInit($oneChannel, oneChannelData);

        $cardList.append($oneChannel, oneChannelData);
    };

    const oneChannelClickInit = ($oneChannel, oneChannelData) => {
        $oneChannel.on("click", function () {
            setChannel(oneChannelData);
        })
    };

    const setChannel = (oneChannelData,  _privateReciver, _styleMessage, ignoreCheckCardCanChoose) => {
        let name                = oneChannelData.name;
        let color               = oneChannelData.heroMsgColor;
        //let nickCardHeader      = _privateReciver ? _privateReciver : "";

        if (!ignoreCheckCardCanChoose) {
            if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(name)) return;
        }

        privateReceiver = _privateReciver ? _privateReciver : null;
        styleMessage    = _styleMessage ? _styleMessage : null;
        channelName     = name;

        setCardHeader(name);
        setColorCardName(color);
        setVisibleBackToDefault();
        setPrivateReceiverHeader(privateReceiver);
        setStyleMessageHeader(styleMessage);
        //hideCardList();

        chatNotificationManager.setVisible(channelName);

        //magicInput.setColorInput(color)
    };

    const setColorCardName = (color) => {
        $chatInputWrapper.find(".card-name").css("color", color);
    };

    const getVisibleCardList = () => {
        return $chatInputWrapper.find(".card-list").css('display') != "none"
    };


    const initChatNotificationView = () => {
        chatNotificationView = new ChatNotificationView();
        chatNotificationView.init($chatInputWrapper.find('.chat-notification-wrapper'));
    }

    const initChatNotificationManager = () => {
        chatNotificationManager= new ChatNotificationManager();
        chatNotificationManager.init();
    }

    //const createMobileSendMessage = () => {
    //    let button = createButton(_t('send_message', null, "chat"), ['small','green'],  () => {
    //        sendCallback(getEscapeVal());
    //    });
    //
    //    getEngine().interface.get$gameWindowPositioner().find('.chat-layer').find(".send-mobile-message-wrapper").append($(button));
    //};

    const getMark = (inputVal) => {
        let channels    = ChatData.INPUT_CHANNEL_HEADER;
        let l           = _l();

        if (inputVal == '') return null;

        for (let channelName in channels) {
            let oneChannelData  = channels[channelName];
            let short           = oneChannelData.short[l];

            if (short == null) continue;

            let prefix      = channels[channelName].prefix;
            let suffix      = channels[channelName].suffix;
            let findMark    = prefix + short + suffix;
            if (inputVal.length != findMark.length) continue;

            if (compareMarkWithString(findMark, inputVal)) return findMark;

        }

        return null;
    }

    const compareMarkWithString = (mark, allString) => {
        for (let i = 0; i < mark.length; i++) {
            if (mark[i] != allString[i]) return false;
        }

        return true;
    };

    const manageMarkAfterInputFocus = () => {
        let channelName     = getEngine().chatController.getChatChannelCardWrapper().getActiveChannelName();
        let focusMark       = ChatData.INPUT_CHANNEL_HEADER[channelName].focusMark;
        let short           = ChatData.INPUT_CHANNEL_HEADER[channelName].short[_l()];
        let suffix          = ChatData.INPUT_CHANNEL_HEADER[channelName].suffix;
        let prefix          = ChatData.INPUT_CHANNEL_HEADER[channelName].prefix;
        let inputVal        = getVal();
        let markFromInput   = getMark(inputVal);

        if (inputVal == '' && focusMark == true) {
            let newMark = prefix + short + suffix;
            setInput(newMark);
            return;
        }

        if (focusMark == false && markFromInput != null) {
            setInput('');
            return
        }

        if (markFromInput != null) {
            let newMark = prefix + short + suffix;

            if (newMark != markFromInput) {
                setInput(newMark);

                return
            }
        }
    }

    const initInput = () => {
        $chatInput = $('#bottombar').find('#inpchat');

        $chatInput.on('click', function () {
            manageMarkAfterInputFocus();
        });

        $chatInput.on('keydown', function (e) {
            if (e.originalEvent.key == "Enter") {
                e.preventDefault();
                //if (getVal() == "" && isFocus()) blur();

                if (isFocus()) {

                    let inputValue = getVal();

                    if (inputValue == "") {
                        blur();
                        return;
                    }

                    let dataToSend = getDataToSend(inputValue);
                    //if (checkValIsEmpty(dataToSend.val)) {
                    if (checkDataToSendIsEmpty(dataToSend)) {
                        blur();
                        return;
                    }

                }
            } else {
                if (ChatData.CHANNEL.LOCAL == channelName) setBlockNearOnEnterUp(false) // DIRTY FIX #40925 See you again in next deploy...
            }
        });

        $chatInput.on('keyup', function (e) {
            let inputValue  = getVal();
            inputValue      = getUpdateInputValue(inputValue);
            if (e.originalEvent.key == "Enter") {

                if (checkValIsEmpty(inputValue)) return;

                if (blockNearOnEnterUp) {
                    setBlockNearOnEnterUp(false);
                    return
                }

                let dataToSend  = getDataToSend(inputValue);

                sendCallback(dataToSend);
            }
        });

        $chatInput.focusin(function() {
            $('#bottxt').hide();
        });

        $chatInput.focusout(function() {
            //console.log('focusout');
            let inputVal = getVal();

            if (inputVal == "") {
                $('#bottxt').show();
                return
            }

            let dataToSend = getDataToSend(inputVal);
            //if (checkValIsEmpty(dataToSend.val)) {
            if (checkDataToSendIsEmpty(dataToSend)) {
                clearInput();
                $('#bottxt').show();
            }
        });
    }

    const getUpdateInputValue = (val) => {
        let INPUT_REGEXP = ChatData.INPUT_REGEXP;

        for (let i = 0; i < INPUT_REGEXP.length; i++) {
            //let pattern = INPUT_REGEXP[i].getPattern();

            let newVal = getDataFromInputChannelData(val, INPUT_REGEXP[i]);

            if (newVal) return newVal.val;
        }



        return val;
    };

    //const initMagicInput = () => {
    //    magicInput = new MagicInput3();
    //
    //    let $magicInputWrapper;
    //
    //    //let isMobile    = mobileCheck();
    //    //let $chatLayer  = getEngine().interface.get$gameWindowPositioner().find('.chat-layer');
    //
    //    //if (isMobile) {
    //    //    $magicInputWrapper = $chatLayer.find(".mobile-magic-input-wrapper");
    //    //    createMobileSendMessage();
    //    //} else {
    //        $magicInputWrapper = $chatInputWrapper.find('.magic-input-wrapper');
    //    //}
    //
    //    magicInput.init(
    //        $magicInputWrapper,
    //        ChatData.INPUT_REGEXP,
    //        ChatData.CHANNEL_INPUT_DATA,
    //        getEngine().chatController.chatLang("chat_placeholder"),
    //        sendCallback,
    //        changeInputCallback
    //    )
    //};

    const changeInputCallback = (clear) => {
        getEngine().chatController.getChatMessageWrapper().updateScroll();
        setClearCross(!clear);
    }

    const setClearCross = (newDisplay) => {
        let currentDisplay = $clearCross.css('display');

        if (currentDisplay == 'none' && newDisplay) {
            $clearCross.css('display', 'block');
            return
        }

        if (currentDisplay == 'block' && !newDisplay) {
            $clearCross.css('display', 'none');
            return
        }
    }

    const checkDice = (val) => {
        let r       = new RegExp('^\/dice(\\s{1}|\&nbsp;)([0-9]+)', "g");
        let result  = r.exec(val);

        return result;
    }

    const checkLevel = (val) => {
        let r       = new RegExp('^\/lvl(\\s{1}|\&nbsp;)([A-Za-z\_]+)', "g");
        let result  = r.exec(val);

        return result;
    }

    const isClsVal = (val) => {
        return val == '/cls';
    }

    const isClsAllVal = (val) => {
        return val == '/clsall';
    }

    const isChatCommand = (val, withoutFuckingCrazyDiceWhichSooMuchExceptional) => {
        if (isClsVal(val))              return true;
        if (isClsAllVal(val))           return true;
        if (checkLevel(val))            return true;

        if (!withoutFuckingCrazyDiceWhichSooMuchExceptional && checkDice(val)) return true;

        return false;
    }

    const checkIncorrectSlash = (val) => {
        if (isChatCommand(val)) return false;

        return val[0] == "/";
    }

    const getDataAndSendRequest = (val) => {
        let dataToSend = getDataToSend(val);

        sendRequest(
            dataToSend.channelRequest,
            dataToSend.reciverRequest,
            dataToSend.styleRequest,
            dataToSend.val
        );
    };

    const alertOfGetItemsFromAnotherWorld = (str) => {
        let msg = _t("item_from_another_world");
        confirmWithCallback({msg:msg, clb: () => {
            getDataAndSendRequest(str);
            clearInput();
        }});
    };

    const sendCallback = (dataToSend, notClearInput) => {
        //if (checkValIsEmpty(val)) return;

        //let dataToSend  = getDataToSend(val);
        let newVal      = dataToSend.val;

        if (!checkValToSendIsCorrect(newVal, dataToSend.channelName)) return;

        let chatLinkedItemsManager  = getEngine().chatLinkedItemsManager;
        let isLinkedItem            = checkSendMessageIsItemLinked(newVal);

        if (isLinkedItem) {
            dataToSend.val  = chatLinkedItemsManager.getReplacedStrWithoutWorldWhereHeroStay(newVal);
            newVal          = dataToSend.val;
            let isCorrect   = chatLinkedItemsManager.checkLinkedItemsAreOnlyFromWorldWhereHeroStay(newVal);

            if (!isCorrect) {
                alertOfGetItemsFromAnotherWorld(newVal);
                blur();
                return
            }

        }

        //getDataAndSendRequest(val);

        sendRequest(
            dataToSend.channelRequest,
            dataToSend.reciverRequest,
            dataToSend.styleRequest,
            dataToSend.val
        );

        if (!notClearInput) clearInput();
    };

    const getDataToSend = (val) => {
        //let serverChannelName       = getEngine().chatController.getChatDataUpdater().getServerChannelNameByChannelName(channelName);
        let dataFromVal             = getDataFromVal(val);
        let reciverRequest          = dataFromVal.valFromPattern ? '&receiver=' + dataFromVal.valFromPattern.replaceAll(" ", "_") : "";
        let styleRequest            = dataFromVal.style ? '&style=' + dataFromVal.style : "";
        let channelRequest          = '&channel=' + ChatData.SERVER_CHANNEL[dataFromVal.channel];

        return {
            channelName         : dataFromVal.channel,
            serverChannelName   : channelRequest,
            reciverRequest      : reciverRequest,
            styleRequest        : styleRequest,
            channelRequest      : channelRequest,
            val                 : dataFromVal.val,
            clearWithBlur       : dataFromVal.clearWithBlur
        }
    };

    const getDataFromVal = (val) => {

        let CHANNEL_INPUT_DATA = ChatData.CHANNEL_INPUT_DATA;

        for (let kk in CHANNEL_INPUT_DATA) {
            let newVal = getDataFromInputChannelData(val, CHANNEL_INPUT_DATA[kk]);

            if (newVal) return newVal;
        }

        return {
            val             : val,
            channel         : ChatData.INPUT_CHANNEL_HEADER.LOCAL.name,
            style           : null,
            valFromPattern  : null,
            clearWithBlur   : false
        }
    };

    const getDataFromInputChannelData = (html, replaceData) => {
        let myRe      = replaceData.getPattern();
        let execData  = myRe.exec(html);

        if (execData) {
            let valFromPattern  = null;
            let clearWithBlur   = false;

            if (replaceData.getValFromPatter) {
                valFromPattern = execData[1];
            }

            if (replaceData.clearWithBlur) {
                clearWithBlur = true
            }

            if (replaceData.callback) {
                if (replaceData)  replaceData.callback(execData[1]);
                else              replaceData.callback();
            }

            //let val = html.replace(replaceData.getPattern(), "");
            let val;

            if (replaceData.getVal)     val = replaceData.getVal();
            else                        val = html.replace(replaceData.getPattern(), "");


            let channel = replaceData.getChannel ? replaceData.getChannel() : null;
            let style   = replaceData.getStyle ? replaceData.getStyle() : null;


            return {
                val             : val,
                channel         : channel,
                style           : style,
                valFromPattern  : valFromPattern,
                clearWithBlur   : clearWithBlur
            }
        }

        return null;
    };

    const sendRequest = (channelRequest, reciverRequest, styleRequest, val) => {
        _g('chat' + channelRequest + reciverRequest + styleRequest, false, {c: val});
    };

    const setLinkedItem = (hid) => {
        let linkedItem = `ITEM#${hid} `;

        //if (mobileCheck())  {
        //    getEngine().chatController.getChatWindow().setVisibleMobileView(true);
        //    addToInput(linkedItem, true);   //todo mobile input ....
        //} else {
            addToInput(linkedItem, true);
        //}

    };

    const checkValIsEmpty = (val) => {
        if (val == '')                  return true;
        if (val.trim() == '')           return true;

        return false;
    }

    const checkDataToSendIsEmpty = (dataToSend) => {
        //console.log(dataToSend);
        if (dataToSend.reciverRequest != '') return false;

        if (checkValIsEmpty(dataToSend.val)) return true;


        return false;
    }

    const checkValToSendIsCorrect = (val, _channelName) => {
        if (val == '')                  return false;
        if (val.trim() == '')           return false;

        if (_channelName == ChatData.CHANNEL.CLAN && !checkHeroHaveClan()) {
            //if (checkBreak(val)) {
            if (!isChatCommand(val)) {
                message(_t('haveNotClan', null, "clan"));
                return false
            }
        }

        if (_channelName == ChatData.CHANNEL.GROUP && !checkHeroHaveParty()) {
            //if (checkBreak(val)) {
            if (!isChatCommand(val)) {
                message(_t('group_is_not_set', null, "clan"));
                return false
            }
        }

        if(chatNotificationManager.checkBlockadeLeftSeconds(_channelName)) {
            if (!isChatCommand(val, true)) {
                message(getEngine().chatController.chatLang("toFastMessageSendOn") + getEngine().chatController.chatLang(_channelName.toLocaleLowerCase()));
                return false
            }
        }

        //if (privateReceiver && privateReceiver.toLocaleLowerCase() == getEngine().hero.d.nick.toLocaleLowerCase()) {
        //    message(_t('can_not_send_message_to_yourself'));
        //    return false
        //}

        return true;
    };

    const initWrapperElement = () => {
        //$chatInputWrapper = getEngine().chatController.getChatTemplates().get("chat-input-wrapper");
        $chatInputWrapper = $('#bottombar').find("#bottxt").find('#inpchat');
    };

    const appendChatInputWrapper = () => {
        let $chatWindow = getEngine().chatController.getChatWindow().get$chatWindow()

        $chatWindow.find(".chat-input-wrapper").replaceWith($chatInputWrapper);
    };

    const setCardHeader = (headerName) => {
        //console.log(`set input header ${headerName}`);
        //$chatInputWrapper.find(".card-name").html(_t(headerName.toLowerCase(), null, 'chat_lang'))
        $chatInputWrapper.find(".card-name").html(getEngine().chatController.chatLang(headerName.toLowerCase()))
    };

    const setPrivateReceiverHeader = (_privateReceiver) => {
        $chatInputWrapper.find(".private-nick").html(_privateReceiver ? _privateReceiver.replaceAll("_", " ") : '');
    };

    const setStyleMessageHeader = (_styleMessage) => {
        $chatInputWrapper.find(".style-message").html(_styleMessage ? _styleMessage : '');
    };

    const showCardList = () => {
        $chatInputWrapper.find(".card-list").css('display', 'block');
    };

    const hideCardList = () => {
        $chatInputWrapper.find(".card-list").css('display', 'none');
    };

    const togleCardList = () => {
        if (getVisibleCardList())   hideCardList();
        else                        showCardList();
    }

    const getVal = () => {
        //return magicInput.getFullInputVal();
        return $chatInput.val();
    }

    const getEscapeVal = () => {
        //return magicInput.getEscapeFullInputVal()
        return escapeInputValue($chatInput.val());
    }

    const escapeInputValue = (val) => {
        return val.replace(/(?=\s)[^\r\n\t]/g, ' ');
    }

    const getChannelName = () => {
        return channelName
    }

    const getPrivateReceiver = () => {
        return privateReceiver
    }

    const getStyleMessage = () => {
        return styleMessage
    }

    const getChatNotificationManager = () => {
        return chatNotificationManager
    };

    const getChatNotificationView = () => {
        return chatNotificationView
    };

    const setMode = (_mode) => {
        mode = _mode;
    };

    const clearInput = () => {
        //magicInput.clearMagicInput();
        setInput('');
        blur();
    }

    const focus = () => {

        //if (mobileCheck()) getEngine().chatController.getChatWindow().setVisibleMobileView(true);

        //magicInput.focus();
        $chatInput.focus();
    };

    const setBlockNearOnEnterUp = (_blockNearOnEnterUp) => {
        blockNearOnEnterUp = _blockNearOnEnterUp;
    };

    const blurIFFocus = () => {
        if (!isFocus()) return;

        blur();
    };

    const blur = () => {

        //if (mobileCheck()) getEngine().chatController.getChatWindow().setVisibleMobileView(false);

        //magicInput.blur();
        $chatInput.blur();
    };

    const isFocus = () => {
        //magicInput.isFocus();
        return $chatInput.is(":focus");
    };

    const setInput = (val) => {
        //magicInput.setInput(val);
        $chatInput.val(val);
        setDisplayPlaceholder(val == '');
    };

    const setDisplayPlaceholder = (state) => {

        return

        let display     = $magicInputPlaceholder.css('display');
        let newDisplay  = state ? 'block' : 'none';

        if (state) {
            if (display == 'block') return
        } else {
            if (display == 'none') return
        }

        $magicInputPlaceholder.css('display', newDisplay);
    };

    const addToInput = (val, pleaseFocus) => {
        let v       = getVal();
        let newVal  = null;

        if (v == '') newVal = val;
        else {
            let length      = v.length;
            let lastChar    = v[length - 1];

            if (lastChar == " ")    newVal = v + val;
            else                    newVal = v + " " +  val;
        }

        setInput(newVal);
        if (!pleaseFocus) return;
        //magicInput.setCaretOnTheEndOfInput();
        focus();
    };

    const setPrivateMessageProcedure = (nick) => {
        focus();
        setChannel(ChatData.INPUT_CHANNEL_HEADER.PRIVATE, nick);
        setInput('@' + nick.replaceAll(" ", "_") + ' ');
        //magicInput.setCaretOnTheEndOfInput();
    };

    const sendMessageGhostMessageProcedure = (text, _channelName) => { // message without change input val
        let tempChannel = channelName;


        setChannel(ChatData.INPUT_CHANNEL_HEADER[_channelName]);
        sendCallback(getDataToSend(text), true);
        setChannel(ChatData.INPUT_CHANNEL_HEADER[tempChannel]);
    };

    this.init                                   = init;
    this.setChannel                             = setChannel;
    this.clearInput                             = clearInput;
    this.blurIFFocus                            = blurIFFocus;
    this.focus                                  = focus;
    this.setBlockNearOnEnterUp                  = setBlockNearOnEnterUp;
    this.blur                                   = blur;
    this.isFocus                                = isFocus;
    this.setInput                               = setInput;
    this.addToInput                             = addToInput;
    this.setPrivateMessageProcedure             = setPrivateMessageProcedure;
    this.getVal                                 = getVal;
    this.getChannelName                         = getChannelName;
    this.getPrivateReceiver                     = getPrivateReceiver;
    this.getStyleMessage                        = getStyleMessage;
    this.clearChatConfigureWindow               = clearChatConfigureWindow;
    this.getChatNotificationManager             = getChatNotificationManager;
    this.getChatNotificationView                = getChatNotificationView;
    this.setLinkedItem                          = setLinkedItem;
    this.sendMessageGhostMessageProcedure       = sendMessageGhostMessageProcedure;
    this.manageMarkAfterInputFocus              = manageMarkAfterInputFocus;

}