function ChatTemplates () {

    let templates = {};

    const init = () => {
        initTemplates();
    }

    const initTemplates = () => {
        templates['chat-channel-card-wrapper'] = `
    <div id="chattabs" class="chat-channel-card-wrapper">

    </div>`;

        templates['chat-channel-card'] = `
    <div class="chat-channel-card">
        <div class="chat-channel-card-icon"></div>
        <div class="chat-channel-not-read-counter"></div>
    </div>`;

        templates['chat-configure-window'] = `
    <div class="chat-configure-window">
        <div class="middle-graphic"></div>
        <div class="chat-option-header" data-trans="#notifications#chat_lang"></div>
        <div class="notification-text" data-trans="#notifications_on_global_chat#chat_lang"></div>
        <div class="notification-configuration"></div>
        <div class="chat-option-header" data-trans="#formatting#chat_lang"></div>
        <div class="time-configuration"></div>
        <div class="tag-configuration"></div>
    </div>
`;

        templates['info-icon'] = `<div class="info-icon"></div>`;

        templates['chat-input-wrapper'] = `
    <div class="chat-input-wrapper">
        <div class="control-wrapper">
            <div class="menu-card">
                <div class="card-name"></div>
                <div class="card-remove close-button"></div>
                <div class="card-list"></div>
            </div>
            <div class="private-nick"></div>
            <div class="style-message"></div>
            <div class="chat-notification-wrapper"></div>
            <div class="chat-config-wrapper"></div>
        </div>
        <div class="magic-input-wrapper"></div>
    </div>`;

        templates['new-chat-message'] = `
    <div class="new-chat-message">
        <span class="information-part">
            <span class="ts-section"></span>
            <span class="channel-section"></span>
            <span class="guest-section" data-trans="data-tip#deputy">[Z]</span>
            <span class="author-section"></span>
            <!--<span class="receiver-arrow-section">-></span>-->
            <span class="receiver-section"></span>
        </span>
        <span class="message-part">
            <span class="message-section"></span>
        </span>

    </div>
`
        templates['chat-message-wrapper'] = `
    <div id="chattxt" class="scroll-wrapper chat-message-wrapper">
        <div class="scroll-pane"></div>
    </div>`;

        templates['chat-notification-wrapper'] = `
    <div class="chat-notification-wrapper">

    </div>`;

        templates['new-chat-window'] = `
    <div class="new-chat-window">
        <div class="chat-channel-card-wrapper"></div>
        <div class="chat-message-wrapper"></div>
        <div class="chat-input-wrapper"></div>
    </div>
`;

    }

    const get = (key) => {
        if (!templates[key]) {
            console.error('Templates not exist!', key);
            return
        }

        return $(templates[key]);
    }



    this.get = get;
    this.init = init;
}
