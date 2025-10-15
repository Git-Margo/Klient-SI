//var ChatData = require('core/chat/ChatData.js');
//var Tpl = require('core/Templates');
//var ChatMessageWithMarkReplace = require('core/chat/ChatMessageWithMarkReplace');
//var MCAddon = require('core/MCAddon');
//var SMCAddon = require('core/SMCAddon');

function ChatMessage () {

    let moduleData                  = {fileName: "ChatMessage.js"};
    let $chatMsg                    = null;
    let $cloneChatMsg               = null;

    //let commercials                 = null;
    let id                          = null;
    let ts                          = null;
    let expiredMessage              = null;
    let channel                     = null;
    let text                        = null;
    let systemRelatedBusinessCard   = null;

    let authorBusinessCard          = null;
    let receiverBusinessCard        = null;

    let author                      = null;
    let authorId                    = null;
    let receiver                    = null;
    let receiverId                  = null;
    let guest                       = null;

    let color                       = null;
    let style                       = null;

    const init = (data) => {
        initChatMessage();
        initChatMessgeData(data);

        $chatMsg.addClass('chat-' + channel + '-message');

        manageGuestMessage();
        manageExpiredMessage();
        //manageCommercialsMessage();
    };

    const manageGuestMessage = () => {
        if (!guest) {
            return;
        }

        $chatMsg.addClass('guest-message');
        $chatMsg.find('.guest-section').tip(_t('deputy'));
    }

    const manageExpiredMessage = () => {
        if (!expiredMessage) return;

        $chatMsg.addClass('expired-message');
    };

    //const manageCommercialsMessage = () => {
    //    if (!commercials) return;
    //    $chatMsg.addClass(`commercials-${commercials}-message`);
    //};

    const appendMessageToChannel = (wasRead) => {
        getEngine().chatController.getChatMessageWrapper().appendMessageToMessageWrapper(channel, author, $chatMsg, wasRead);
    };

    const initChatMessgeData = (data) => {
        id                          = data.id;
        ts                          = data.ts;
        //commercials                 = isset(data.commercials) ? data.commercials : null;
        expiredMessage              = data.expiredMessage;
        channel                     = data.channel;
        authorBusinessCard          = data.authorBusinessCard;
        receiverBusinessCard        = data.receiverBusinessCard;
        text                        = data.text;
        systemRelatedBusinessCard   = isset(data.systemRelatedBusinessCard) ? data.systemRelatedBusinessCard : null;

        if (data.authorBusinessCard)    author          = authorBusinessCard.getNick();
        if (data.receiverBusinessCard)  receiver        = receiverBusinessCard.getNick();
        if (data.authorBusinessCard)    authorId        = authorBusinessCard.getId();
        if (data.receiverBusinessCard)  receiverId      = receiverBusinessCard.getId();
        if (data.style)                 style           = data.style;
        if (data.guest)                 guest           = true;
    };

    const initChatMessage = () => {
        $chatMsg = createMessage();
    };

    //const setCloneChatMessage = () => {
    //    $cloneChatMsg = $chatMsg.clone(true);
    //};

    const createMessage = () => {
        return getEngine().chatController.getChatTemplates().get("new-chat-message");
    };

    const updateMessage = () => {
        updateColor();
        updateTsSection();
        //updateChannelSection();
        updateAuthorSection();
        updateReceiverSection();
        updateMessageSection();
        updateMessageStyle();
    };

    const updateColor = () => {
        let color = $chatMsg.css("color");

        let chatConfig              = getEngine().chatController.getChatConfig();
        let heroMessage             = hero.nick == author;
        let configChannelColor      = chatConfig.getChannelColor(channel, heroMessage);


        $chatMsg.css("color", configChannelColor);
    };

    const setSectionDisplay = ($element, state) => {
        let elementVisibleState = $element.css('display') == "inline";

        if (elementVisibleState == state) return;

        let visible = state ? "inline" : "none";

        $element.css("display", visible);
    };

    const updateTsSection = () => {

        let chatConfig      = getEngine().chatController.getChatConfig();
        let display         = chatConfig.getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY);
        let $tsSection      = $chatMsg.find('.ts-section');
        let $authorSection  = $chatMsg.find('.author-section');

        //setSectionDisplay($tsSection, display);

        //if (!display) return;

        //let allUnit         = chatConfig.getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.ALL_UNIT);
        let twelveHour      = chatConfig.getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.TWELVE_HOUR);
        //let formattedTime   = ut_time(Math.floor(ts), allUnit, twelveHour);

        //$tsSection.html('[' + formattedTime + '] ');
        $authorSection.tip(ut_time(Math.floor(ts), true, twelveHour));
    };

    const updateChannelSection = () => {
        let chatConfig      = getEngine().chatController.getChatConfig();
        let display         = chatConfig.getMessageSectionData(ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY);
        let $channelSection = $chatMsg.find('.channel-section');

        setSectionDisplay($channelSection, display);

        if (!display) return;

        let allTag  = chatConfig.getMessageSectionData(ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.ALL_TAG);
        //let str     = _t(channel.toLocaleLowerCase(), null, 'chat_lang');
        let str     = getEngine().chatController.chatLang(channel.toLocaleLowerCase());
        let html    = allTag ? str : str[0];

        $channelSection.html("[" + html + "] ");
        $channelSection.tip(str);
    };

    const checkTownMessage = () => {
        return style == ChatData.SERVER_STYLE.TOWN;
    }

    const updateAuthorSection = () => {
        let $authorSection = $chatMsg.find('.author-section');


        //setSectionDisplay($authorSection, visible);

        //if (!visible) return;

        if (style == ChatData.SERVER_STYLE.ME || !author) $authorSection.css('display', 'none');

        $authorSection.html('Â«' + author + (receiver ? '' : 'Â»'));

        //if (visible) menageMessageEvent()
        menageMessageEvent()
    };

    const updateReceiverSection = () => {

        let $receiverSection        = $chatMsg.find('.receiver-section');
        let $receiverArrowSection   = $chatMsg.find('.receiver-arrow-section');

        let visible = receiver ? true : false;

        setSectionDisplay($receiverArrowSection, visible);
        setSectionDisplay($receiverSection, visible);

        if (!visible) return;

        $receiverSection.html(' -> ' + receiver + 'Â» ');

        menageMessageEvent()


    };

    const menageMessageEvent = () => {
        let clickData = getClickData();

        if (!clickData) return;

        attachClickMessage(clickData)
    };

    const getClickData = (systemMessageWithMarkData) => {

        let heroNick = hero.nick;

        //if (channel == ChatData.CHANNEL.SYSTEM) return null;
        if (channel == ChatData.CHANNEL.SYSTEM) {
            if (systemMessageWithMarkData) return {nick:systemMessageWithMarkData.nick, id: systemMessageWithMarkData.id, $clickField:systemMessageWithMarkData.$clickField};

            return null;
        }

        if (channel == ChatData.CHANNEL.PRIVATE) {
            if (author == heroNick)   return {nick:receiver, id: receiverId, $clickField:$chatMsg.find('.receiver-section')};
            else                      return {nick:author, id: authorId, $clickField:$chatMsg.find('.author-section')};
        }

        if (author == heroNick) return null;

        return {nick:author, id: authorId, $chatMessage:$chatMsg, $clickField:$chatMsg.find('.author-section')};
    };

    const attachClickMessage = (clickData) => {
        clickData.$clickField.addClass('click-able');

        clickData.$clickField.on('click', function (e) {
            e.stopPropagation();
            getEngine().chatController.getChatInputWrapper().setPrivateMessageProcedure(clickData.nick);
        });

        clickData.$clickField.on('contextmenu', function (e, mE) {
            const u = hero.uprawnienia;
            if (u == 0) return;
            e.preventDefault();
            _g(`administration&targetId=${clickData.id}`);
            if (u == 4 || u == 16) g.sMCAddon.update(clickData.nick)

        });

        //clickData.$clickField.tip('Priv message to: ' + clickData.nick);
        //clickData.$clickField.tip(getEngine().chatController.chatLang('privMessageTo') + clickData.nick);
    };

    const replyItem = (nick, menu) => {
        menu.push([_t('send_message', null, 'chat'), function () {
            getEngine().chatController.getChatInputWrapper().setPrivateMessageProcedure(nick);
        }]);
    };

    //const goToGroupOrClan = function ($msg, menu) {
    //    if ($msg.hasClass(ChatData.CHANNEL.CLAN + '-channel-in-' + ChatData.CHANNEL.GLOBAL + '-channel')) {
    //        menu.push([_t('to-clan'), function () {
    //            getEngine().chatController.getChatWindow().setChannel(ChatData.CHANNEL.CLAN);
    //        }]);
    //    }
    //
    //    if ($msg.hasClass(ChatData.CHANNEL.GROUP + '-channel-in-' + ChatData.CHANNEL.GLOBAL + '-channel')) {
    //        menu.push([_t('to-group'), function () {
    //            getEngine().chatController.getChatWindow().setChannel(ChatData.CHANNEL.GROUP);
    //        }]);
    //    }
    //};

    const putNickInInput = (nick, menu) => {
        menu.push([_t('player_nick', null, 'clan'), function () {
            getEngine().chatController.getChatInputWrapper().addToInput(nick + '&nbsp;', true);
        }]);
    };

    const checkSmc = (nick, menu) => {
        var rights = getEngine().hero.d.uprawnienia;
        if (rights == 0) return;
        if (nick == hero.nick || nick == 'System') return;

        menu.push(['MC Panel', function () {
            if (!getEngine().mcAddon) {
                getEngine().mcAddon = new MCAddon(self);
                getEngine().mcAddon.init();
            }
            getEngine().mcAddon.update(nick);
        }]);

        if (rights == 4 || rights == 16) {
            menu.push(['SMC Panel', function () {
                if (getEngine().smcAddon) getEngine().smcAddon.close();
                getEngine().smcAddon = new SMCAddon(nick);
                getEngine().smcAddon.init();
            }]);
        }
    };


    const updateMessageSection = () => {
        let isSystem                    = channel == ChatData.CHANNEL.SYSTEM;
        let isClan                      = channel == ChatData.CHANNEL.CLAN;
        let isCommercial                = channel == ChatData.CHANNEL.COMMERCIAL;
        let isTownMessage               = checkTownMessage();
        let nodes;

        if (isSystem)                               nodes = getReplaceNodes(text, true, true);
        if (isClan && systemRelatedBusinessCard)    nodes = getReplaceNodes(text, true, true);
        if (isCommercial)                           nodes = parseChatBB(text);
        if (!nodes)                                 nodes = getReplaceNodes(text, false, !isTownMessage);

        $chatMsg.find('.message-section').html(nodes);
    };

    const updateMessageStyle = () => {
        if (!style) return;

        $chatMsg.find('.message-part').addClass('special-style-' + style);
        $chatMsg.addClass('wrapper-special-style-' + style);
    };


    const getReplaceNodes = (_text, parseBB, parseMessageMark) => {

        if (parseBB) _text = parseChatBB(_text);

        let nodes = [createTextNode(_text, parseBB)];

        for (let i = 0; i < nodes.length; i++) {

            let textNode        = nodes[i];
            let textContent     = textNode.textContent;

            if (textNode.nodeName != '#text') {

                if (textNode.hasClass("mark-message-span")) continue;
                else {

                    if (parseBB)    textContent = textNode.html();
                    else            textContent = textNode.text();

                }

            }

            if (checkMessageHaveLink(textContent)) {
                deleteIndexFromArray(nodes, i);
                parseMessageWithLink(i, nodes, textContent, parseBB);
                i--;
                continue;
            }

            if (checkReceiveMessageHaveLinkedItem(textContent, false)) {
                deleteIndexFromArray(nodes, i);
                addToArray(i, nodes, parseReceiveMessageWithLinkedItem(textContent, false, parseBB));
                i--;
                continue;
            }

            if (checkSystemMessageMark(textContent)) {
                deleteIndexFromArray(nodes, i);
                addToArray(i, nodes, parseMessageWithSystemMark(i, nodes, textContent, parseBB));
                i--;
                continue;
            }

            if (parseMessageMark && checkMessageMark(textContent)) {
                deleteIndexFromArray(nodes, i);
                addToArray(i, nodes, parseMessageWithMark(i, nodes, textContent, parseBB));
                i--;
                continue;
            }

        }

        return nodes;
    };

    const checkMessageMark = (textContent) => {

        let messageMark         = ChatData.MESSAGE_MARK_REGEXP;
        let additionalData      = {};

        for (let k in messageMark) {

            let oneMarkData = messageMark[k];

            if (checkPatternIsMatch(oneMarkData, textContent, additionalData)) return true;
        }

        return false;
    };

    const checkSystemMessageMark = (textContent) => {
        let isSystem                    = channel == ChatData.CHANNEL.SYSTEM;
        let isClan                      = channel == ChatData.CHANNEL.CLAN;
        let isSystemRelatedBusinessCard = isSystem && systemRelatedBusinessCard || isClan && systemRelatedBusinessCard;

        if (!isSystemRelatedBusinessCard) {
            return false;
        }

        let relatedNick         = systemRelatedBusinessCard.getNick();
        let additionalData      = {relatedNick: relatedNick};

        let messageMark = ChatData.SYSTEM_MESSAGE_MARK_REGEXP;

        for (let k in messageMark) {

            let oneMarkData = messageMark[k];

            if (checkPatternIsMatch(oneMarkData, textContent, additionalData)) return true;
        }

        return false;
    };

    const parseMessageWithMark = (startIndex, nodes, textContent, unsecure) => {

        let messageMark     = ChatData.MESSAGE_MARK_REGEXP;
        let additionalData  = {};

        for (let k in messageMark) {

            let oneMarkData = messageMark[k];

            if (!checkPatternIsMatch(oneMarkData, textContent, additionalData)) continue;

            return getEngine().chatController.getChatMessageWithMarkReplace().parseReceiveMessageWithMark(textContent, oneMarkData, unsecure)
        }


    };

    const parseMessageWithSystemMark = (startIndex, nodes, textContent, unsecure) => {

        let systemMessageMark   = ChatData.SYSTEM_MESSAGE_MARK_REGEXP;
        let relatedNick         = systemRelatedBusinessCard.getNick();
        let additionalData      = {relatedNick: relatedNick};

        for (let k in systemMessageMark) {

            let oneMarkData = systemMessageMark[k];

            if (!checkPatternIsMatch(oneMarkData, textContent, additionalData)) continue;

            let nodesWithClickSpan = getEngine().chatController.getChatMessageWithMarkReplace().parseReceiveSystemMessageWithMark(textContent, oneMarkData, unsecure, additionalData);

            if (oneMarkData.editMark) attachRelatedNickWithContextMenu(oneMarkData, nodesWithClickSpan, additionalData);

            return nodesWithClickSpan;
        }

    };

    const attachRelatedNickWithContextMenu = (oneMarkData, nodesWithClickSpan, additionalData) => {
        for (let k in nodesWithClickSpan) {
            let $e = nodesWithClickSpan[k];

            if (!$e.hasClass('mark-message-span')) continue;

            oneMarkData.editMark(this, $e, additionalData);
            return
        }
    };

    const attachContextMenuToRelatedNick = ($e, relatedNick) => {
        let clickData = getClickData({
            $clickField : $e,
            nick        : relatedNick
        });

        attachClickMessage(clickData);
    };

    const checkPatternIsMatch = (oneMarkData, textContent, additionalData) => {

        let myRe = getEngine().chatController.getChatMessageWithMarkReplace().getMyRegExp(oneMarkData, additionalData);

        if (myRe == null) return false;

        let execData = myRe.exec(textContent);

        if (!execData) return false;

        return true;
    }

    const parseMessageWithLink = (startIndex, nodes, textContent, unsecure) => {
        let tokens          = linkify.tokenize(textContent);

        for (let k in tokens) {
            let o = tokens[k];

            if (o.isLink) {
                addToArray(startIndex, nodes, createLinkPart(o));
                startIndex++;
            } else {
                let oneText = o.toString();
                addToArray(startIndex, nodes, [createTextNode(oneText, unsecure)]);
                startIndex++;
            }

        }
    };

    const deleteIndexFromArray = (array, index) => {
        array.splice(index, 1);
    };

    const checkMessageHaveLink = (textContent) => {
        let tokens = linkify.tokenize(textContent);

        for (let k in tokens) {
            let o = tokens[k];
            let text = o.toString();
            if (o.type == "url" && checkCorrectlyURL(text)) return true;
            //if (tokens[k].isLink) return true
        }

        return false;
    };

    const checkCorrectlyURL = function (url) {
        var rx = /^(?:(https?:\/\/)|(www\.))/i;
        return rx.test(url);
    };

    const replaceContent = () => {

    };

    const addToArray = (startIndex, a1, a2) => {
        for (let i = 0; i < a2.length; i++) {
            let index = startIndex + i;
            a1.splice(index, 0, a2[i])
        }
    };

    const createLinkPart = (o) => {
        let url = o.toObject('https');

        let whiteListLinData = getWhiteListLink(url.href);

        if (whiteListLinData)   return createLinkNodeFromWhiteList(url, whiteListLinData);
        else                    return createUnsecureLinkNode(url);
    };

    const createLinkNodeFromWhiteList = (url, whiteListLinData) => {
        let $link = $("<span>");
        let styles       = null;
        let htmlClass   = whiteListLinData.htmlClass;
        let getTip      = whiteListLinData.getTip;

        try {
            styles = JSON.parse(whiteListLinData.style);
        } catch(e) {
            errorReport('ChatMessage.js', 'createLinkNodeFromWhiteList', 'Incorrect JSON format!', styles);
        }

        if (htmlClass != null)  $link.addClass(htmlClass);
        if (styles != null)     $link.css(styles);
        if (getTip != null)     $link.tip(getTip());

        $link.addClass('message-mark "mark-message-span');
        $link.text(whiteListLinData.getText());

        $link.click(function(e) {
            e.stopPropagation();
            //getEngine().iframeWindowManager.newPlayerProfile({ staticUrl: url.href })
            goToUrl(url.href, true);
        });

        return [$link];
    };

    const createUnsecureLinkNode = (url) => {
        let $u = $("<u>");

        $u.addClass('link mark-message-span');
        $u.text(url.href);

        $u.click(function(e) {
            e.stopPropagation();
            goToUrl(url.href);
        });

        return [$u];
    };

    const createTextNode = (text, unsecure) => {
        //return unsecure ? document.createElement('span').innerHTML = text :document.createTextNode(text);
        let element;
        if (unsecure) {
            element = document.createElement('span');
            element.innerHTML = text;
            element = $('<span>').html(text);
            //element.innerHTML = text;
        } else {
            element = document.createTextNode(text);
        }

        return element
    };

    const getWhiteListLink = (url) => {
        let messageLink = ChatData.MESSAGE_LINK_REGEXP;

        for (let k in messageLink) {

            let oneLinkData = messageLink[k];
            let myRe        = oneLinkData.getPattern();
            let execData    = myRe.exec(url);

            if (execData) return oneLinkData;
        }

        return null;
    };

    const getTextWithNickReplace = (parseText) => {
        let nick        = hero.nick;
        let re          = new RegExp('^' + nick + ' | ' + nick + ' | ' + nick + '$|^' + nick + '$', 'ig');

        return parseText.replace(re, ' <b class="yourname">' + nick + '</b> ');
    };

    const getTs = () => {
        return ts;
    };

    const getId = () => {
        return id;
    };

    const getStyle = () => {
        return style;
    };

    const isCodeMessage = () => {
        return false;
    };

    //const getCommercials = () => {
    //    return commercials ? commercials : null;
    //};

    const remove = () => {
        $chatMsg.remove();
        if ($cloneChatMsg) $cloneChatMsg.remove();
    };

    const get$chatMsg = () => {
        return $chatMsg;
    }

    this.init = init;
    this.getTs = getTs;
    this.getId = getId;
    this.getStyle = getStyle;
    this.isCodeMessage = isCodeMessage;
    this.updateMessage = updateMessage;
    //this.getCommercials = getCommercials;
    this.remove = remove;
    this.get$chatMsg = get$chatMsg;
    this.appendMessageToChannel = appendMessageToChannel;
    this.attachContextMenuToRelatedNick = attachContextMenuToRelatedNick;
}
