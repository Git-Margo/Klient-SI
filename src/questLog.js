function questLog () {
    var self = this;

    this.init = function () {
        self.initWindow();
        self.attachDraggable();
        self.initClose();
    };

    this.initWindow = function () {
        self.$wnd = $('#quest-log-window');
        var visible = self.getStateOfVisibleFromStorage();

        if (visible !== null)   visible ? self.showPanel() : self.hidePanel();
        else                    self.hidePanelWithSaveInStorage();
    };

    this.initClose = function () {
        self.$wnd.find('.quest-log-close-but').click(self.hidePanelWithSaveInStorage);
    };

    this.attachDraggable = function () {
        self.$wnd.draggable({
            handle: '.quest-log-header',
            scroll: false,
            drag: function(evt,ui) {
                var maxW = window.innerWidth;
                var maxH = window.innerHeight;
                if (ui.position.left < 0) ui.position.left = 0;
                if (ui.position.top < 0) ui.position.top = 0;
                if (ui.position.left + $(this).outerWidth() > maxW) ui.position.left  = maxW - $(this).outerWidth();
                if (ui.position.top  + $(this).outerHeight() > maxH) ui.position.top  = maxH - $(this).outerHeight();
                self.setPosInStorage([ui.position.left, ui.position.top]);
            }
        });
    };

    this.saveInStorageVisible = function (state) {
        margoStorage.set('quest-log-visible', state);
    };

    this.getStateOfVisibleFromStorage = function () {
        return margoStorage.get('quest-log-visible');
    };

    this.getPosFromStorage = function () {
        return margoStorage.get('quest-log-pos');
    };

    this.setPosInStorage = function (pos) {
        margoStorage.set('quest-log-pos', pos);
    };

    this.getCenterPos = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;

        var qW = self.$wnd.width();
        var qH = self.$wnd.height();

        return [
            w / 2 - qW / 2,
            h / 2 - qH / 2
        ]
    };

    this.checkPosIsCorrect = function (pos) {
        var tolerance = 5;

        var correctWidth  = pos[0] + self.$wnd.width()  - tolerance < window.innerWidth;
        var correctHeight = pos[1] + self.$wnd.height() - tolerance < window.innerHeight;

        return correctWidth && correctHeight;
    };

    this.showPanel = function () {
        var pos = self.getPosFromStorage();

        if (pos == null || !self.checkPosIsCorrect(pos)) {
            pos = self.getCenterPos();
            self.setPosInStorage(pos);
        }

        self.$wnd.css({
            left: pos[0],
            top: pos[1]
        });

        self.$wnd.fadeIn('fast');
    };

    this.showPanelWithSaveInStorage = function () {
        self.showPanel();
        self.saveInStorageVisible(true);
    };

    this.hidePanel = function () {
        $('#quest-log-window').fadeOut("fast");
    };

    this.hidePanelWithSaveInStorage = function () {
        self.hidePanel();
        self.saveInStorageVisible(false);
    };

    this.isVisible = function () {
        var state = this.getStateOfVisibleFromStorage();
        return state === true;
    };

    this.manageVisibility = function () {
        var isVisible = self.isVisible();
        isVisible ? self.hidePanelWithSaveInStorage() : self.showPanelWithSaveInStorage();
    };

    this.update = function (quests) {
        if (isset(quests['data'])) {
            this.updateQuests(quests['data']);
        }
        if (isset(quests['del'])) {
            quests['del'].map(questId => {
                this.deleteQuest(questId);
            });
        }
    };

    this.prepareTypMonsterData = (_data) => {
        let data;
        data =_data.replace(' Common (', ' ' +_t('normal-monster', null, 'npcs_kind') + ' (');
        data = data.replace(' Elite (', ' ' +_t('elita1', null, 'npcs_kind') + ' (');
        data = data.replace(' Elite2 (', ' ' +_t('elita2', null, 'npcs_kind') + ' (');
        data = data.replace(' Hero (', ' ' +_t('heros', null, 'npcs_kind') + ' (');
        data = data.replace(' Titan (', ' ' + _t('tytan', null, 'npcs_kind') + '/' + _t('colossus', null, 'npcs_kind') + ' (');
        return data
    };

    this.updateQuests = function(_data) {

        let data = self.prepareTypMonsterData(_data);

        data = TextModifyByTag.sexModify(data);

        $(data).each(function () {
            const
                $target = $(this),
                id = $target.attr('data-quest-id'),
                selector = 'quest-log-id-' + id,
                $quest = self.$wnd.find('.' + selector),
                $title = $target.find('.q_title'),
                $doIt = $target.find('.q_doit');

            $target.addClass(selector);
            $title.html(escapeHTML($title.html()));
            if ($doIt.length > 0) {
                $doIt.html(parseContentBB($doIt.html(), false));
            }

            if ($quest.length > 0) {
                $quest.replaceWith($target);
            } else {
                self.$wnd.find('.quest-log-scroll').append($target);
            }
        });
    };

    this.deleteQuest = function(questId) {
        var selector = 'quest-log-id-' + questId;
        var $quest = self.$wnd.find('.' + selector);
        $quest.remove();
    };

}
