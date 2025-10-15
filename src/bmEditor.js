function bmEditor() {
    var self = this;
    this.handler = $('#bm_edit_panel_container');
    this.activeSkills = [];
    this.skillsLimit = 0;
    this.repeat = false;
    this.isInit = false;
    this.visible = false;
    this.cost = null;
    this.current = null;

    this.clearList = function () {
        this.activeSkills = [];
        _g('skills&battleaction=set&battleskills=' + this.getSkillList() + '&rpt=' + (self.repeat ? 1 : -1));
    };

    this.sendChangedList = function () {
        _g('skills&battleaction=set&battleskills=' + this.getSkillList() + '&rpt=' + (self.repeat ? 1 : -1));
    };

    this.turnOffMBSkillsMode = function () {
        $("#skills_footer").css('display', 'block');
        $('#skills').find(".add_to_bm").css('display', 'none');
        $('#skills').find(".set-active-state").css('display', 'block');
        $('#skills').find(".skillbox:not(:has(>.skillbox_active):has(>.learned-skill))").parent().css('display', 'inline-block');
        $('#skills').find(".skillbox_shadow").css('display', 'inline-block');
        $('#skills').find(".learn-btn:not(.disabled)").css('display', 'block');
        $('#skills').find(".skills_tab").removeClass('center');
    };

    this.turnOnMBSkillsMode = function () {
        $("#skills_footer").css('display', 'none');
        $('#skills').find(".add_to_bm").css('display', 'block');
        $('#skills').find(".set-active-state").css('display', 'none');
        $('#skills').find(".skillbox:not(:has(>.skillbox_active):has(>.learned-skill))").parent().css('display', 'none');
        $('#skills').find(".skillbox_shadow").css('display', 'none');
        $('#skills').find(".learn-btn:not(.disabled)").css('display', 'none');
        $('#skills').find(".skills_tab").addClass('center');
    };

    this.toggleShow = function () {
        self.visible ? this.hidePanel() : this.showPanel();
    };

    this.hidePanel = function () {
        self.turnOffMBSkillsMode();
        self.handler.css('display', 'none');
        self.visible = false;
        g.skills.refresh();
        $('.bm_handlerIcon').remove();
        $('#battleskills_scroll').remove();
    };

    this.showPanel = function () {
        _g('skills&battleaction=show', function () {
            self.visible = true;
            self.turnOnMBSkillsMode();
            self.handler.css('display', 'block');
            g.skills.refresh();
        });
    };

    this.getSkillList = function () {
        return this.activeSkills.length > 0 ? this.activeSkills.join(',') : 0;
    };

    this.addAndSave = function (id) {
        if (this.activeSkills.length < this.skillsLimit) {
            this.activeSkills.push(id);
            _g('skills&battleaction=set&battleskills=' + this.getSkillList() + '&rpt=' + (self.repeat ? 1 : -1));
        } else mAlert(_t('bm_limit_reached', null, 'skills'));
    };

    this.init = function () {
        if (self.isInit) return;
        self.isInit = true;
        this.initButtons();
    };

    this.update = function (data) {
        this.skillsLimit = data.max;
        this.activeSkills = data.list;
        this.cost = data.cost;
        this.current = data.cur;
        this.cost = data.cost;
        this.repeat = parseInt(data.rpt) ? true : false;
        this.setRepeatCheckbox();
        this.refreshSkillList();
    };

    this.setRepeatCheckbox = function () {
        var $e = $('#bm_rpt_switch');
        if (self.repeat) $e.addClass('active');
        else 			 $e.removeClass('active');
    };

    this.refreshSkillList = function () {
        $('#bm_skill_table').empty();
        for (var i = 0; i < 20; i++) {
            if (i + 1 > self.current) self.createUnBuySkillTr(i);
            else	 			      self.createBoughtSkillTr(i);
        }
    };

    this.getSkillNameOrEmpty = function (i) {
        var skillId = self.activeSkills[i];
        if (i + 1 > self.activeSkills.length) return _t('empty');
        if (skillId == -1) return _t('bm_normal_attack', null, 'skills');
        if (skillId == -2) return _t('step', null, 'skills');
        return g.skills.skills[skillId].name;
    };

    this.createButtonsToChangePos = function ($actionButtons, i) {
        $actionButtons.append(self.drawSkillActionMBBut('delete', i));
        $actionButtons.append(self.drawSkillActionMBBut('up', i));
        $actionButtons.append(self.drawSkillActionMBBut('down', i));
    };

    this.drawSkillActionMBBut = function (action, i) {
        var $b = $('<div>');
        switch (action) {
            case 'up':
                $b.addClass('frup');
                $b.bind('click', function () {
                    var a = self.activeSkills[i - 1];
                    var b = self.activeSkills[i];

                    self.activeSkills[i - 1] = b;
                    self.activeSkills[i] 	  = a;
                    self.sendChangedList();
                });
                break;
            case 'down':
                $b.addClass('frdn');
                $b.bind('click', function () {
                    var a = self.activeSkills[i];
                    var b = self.activeSkills[i + 1];

                    self.activeSkills[i] 		= b;
                    self.activeSkills[i + 1] 	= a;
                    self.sendChangedList();
                });
                break;
            case 'delete':
                $b.addClass('delen');
                $b.bind('click', function () {
                    //self.activeSkills.splice(i);
                    self.activeSkills[i] = 0;
                    self.sendChangedList();
                });
                break;
            default:
                console.warn('bad type');
                break;
        }
        return $b;
    };

    this.createBoughtSkillTr = function (i) {
        var $label = $('<span>').addClass('td-label').html(self.getSkillNameOrEmpty(i));
        var $actionButtons = $('<div>').addClass('action_buttons');

        var $td1 = $('<td>').addClass('lp').html((i + 1) + '.');
        var $td2 = $('<td>').addClass('buy-td').append($label).append($actionButtons);

        self.createButtonsToChangePos($actionButtons, i);
        self.showAndHideChangePosButton($actionButtons, i);

        this.appendToTr($td1, $td2);
    };

    this.showAndHideChangePosButton = function ($actionButtons, i) {
        var $up 	= $actionButtons.find('.frup');
        var $down 	= $actionButtons.find('.frdn');
        var length  = self.activeSkills.length;

        if (i + 1 > length) {
            $actionButtons.css('display', 'none');
            return;
        }

        if (i == 0) $up.css('display', 'none');

        if (i + 1 == length) $down.css('display', 'none');

        if (length == 1) {
            $down.css('display', 'none');
            $up.css('display', 'none');
        }

    };

    this.createUnBuySkillTr = function (i) {
        var b1 = drawSIButton(round(self.cost.gold[i])).addClass('gold-cost');
        var b2 = drawSIButton(self.cost.credits[i] + 'SÅ').addClass('sl-cost');

        var $label = $('<span>').addClass('td-label').html(_t('buy_skill_place'));
        var $buyWrapper = $('<div>').addClass('buy-wrapper').append(b1).append(b2);

        var $td1 = $('<td>').addClass('lp').html((i + 1) + '.');
        var $td2 = $('<td>').addClass('buy-td').append($label).append($buyWrapper);

        b1.bind('click', function () { self.buyAlert(0) });
        b2.bind('click', function () { self.buyAlert(1) });

        self.appendToTr($td1, $td2);
    };

    this.buyAlert = function (kind) {
        var str;
        switch (kind) {
            case 0:
                str = _t('confirm_upgrade_MBATLEforGold');
                break;
            case 1:
                str = _t('confirm_upgrade_MBATLEforCredits');
                break;
            default:
                console.warn('bad type of currency :' + kind);
                return;
        }
        mAlert(str, 1, [function(){_g('skills&battleaction=learn&credits=' + kind)},function(){}]);
    };

    this.appendToTr = function ($td1, $td2) {
        var $tr = $('<tr>').addClass('one-bm-skill').append($td1).append($td2);
        $('#bm_skill_table').append($tr);
    };

    this.initButtons = function () {
        $('#save-and-close-bm').parent().click(function () {
            g.bmEditor.toggleShow();
        });
        $('#clear-bm-list').parent().click(function () {
            g.bmEditor.clearList()
        });
        $('#add-normal-attack').parent().click(function () {
            g.bmEditor.addAndSave(-1);
        });
        $('#add-move-bm').parent().click(function () {
            g.bmEditor.addAndSave(-2);
        });
        $('#bm_rpt_switch_wrapper').click(function () {
            g.bmEditor.switchRepeat();
        });
    };

    this.switchRepeat = function () {
        self.repeat = !self.repeat;
        self.setRepeatCheckbox();

        _g('skills&battleaction=set&battleskills=' + this.getSkillList() + '&rpt=' + (this.repeat ? 1 : -1));
    };
}
