function ClanController () {
    var self = this;
    var memberList = {};
    var cards;
    var charInf;
    var clanInf;
    var clanRankInf;
    var clList = {};

    var Members;
    var ClanList;
    var ClanSkills;
    var ClanAtributes;
    var FindPanel;
    var ClanBless;
    var PrivPage;
    var OfficialPage;
    var Recruit;
    var PlayerEdit;
    var ClanQuests

    var d;

    this.init = function () {
        this.initClasses();
        this.initTable()
    };

    this.getProp = function (name) {
        if (!d) return false;
        return d[name];
    };

    this.createPlaceHolder = function (name, txt, con) {
        var input = con.find(name);
        input.attr('placeholder', txt);
    };

    this.createRecords = function (ob, addClass) {
        var $tr = $('<tr>');
        for (var i = 0; i < ob.length; i++) {
            var $td = $('<td>').html(ob[i]);
            if (typeof addClass == 'object') {
                $td.addClass(addClass[i]);
            } else {
                $td.addClass(addClass);
            }
            $tr.append($td);
        }
        return $tr;
    };

    this.initClasses = function () {
        ClanAtributes = new clanAtributes(self);
        ClanBless = new clanBless(self);
        ClanQuests = new clanQuests(self);
        ClanSkills = new clanSkills(self);
    };

    this.initTable = function () {
        cards = [
            'clan_info',
            'clan_list',
            'clan-official-page',
            'clan_priv-page',
            'clan_recruit',
            'clan_members',
            'clan_treasury',
            'clan_manage',
            'clan_diplomacy',
            'clan_history',
            'clan_quests',
            'clan_skills'
            //'clan_socPlayGroup'
        ];
        charInf = [
            this.tLang('th_nick'),
            this.tLang('th_location'),
            this.tLang('th_rank'),
            this.tLang('th_status'),
            this.tLang('th_levelAndProf')
        ];
        clanInf = [
            this.tLang('clan_name'),
            this.tLang('clan_level'),
            this.tLang('clan_amount_members'),
            this.tLang('clan_info')
        ];
        clanRankInf = [
            this.tLang('creator_th'),
            this.tLang('rank_rEdit'),
            this.tLang('rank_treasury'),
            this.tLang('rank_invite'),
            this.tLang('rank_dismiss'),
            this.tLang('rank_privatepage'),
            this.tLang('rank_officialpage'),
            this.tLang('rank_diplomate'),
            this.tLang('rank_outfit'),
            this.tLang('tabview_th'),
            this.tLang('tabuse_th'),
            this.tLang('tablimit_th')
        ];
    };

    this.update = function (v) {
        this.updateData(v);
        this.updateRanks(v.ranks);
    };

    this.updateData = function (v) {
        //if (!d) {
        //    var $cards = this.wnd.$.find('.card');
        //    $cards.removeClass('active');
        //    $cards.eq(2).addClass('active');
        //    this.showChooseCard('clan', 'clan-official-page');
        //    this.updateHeader(this.tLang('clan-official-page'));
        //    this.initD();
        //}
        if (!d) this.initD();
        for (var k in v) {
            d[k] = v[k];
        }
    };

    this.initD = function () {
        d = {};
    };

    this.updateRanks = function (ran) {
        var clRank = hero.clan.rank
        if (!ran) {
            d['myrank'] = d['ranks'][clRank].r;
            return;
        }
        var r = ran.split(';');
        var r2 = [];
        for (var i in r) {
            r[i] = r[i].split(',');
            r2[parseInt(r[i][0])] = {
                'name': r[i][1],
                'r': parseInt(r[i][2])
            };
        }
        d['ranks'] = r2;
        d['myrank'] = r2[clRank].r;
    };

    this.updateClanList = function (v) {
        if (!ClanList) {
            ClanList = new clanList(self);
            FindPanel = new findPanel(self);
            ClanList.update(v);
        } else ClanList.update(v);
        self.updateClList(v);
    };

    this.updateClanSkills = function (v) {
        ClanSkills.update(v);
    };

    this.updateClanBless = function (v) {
        if (ClanBless) ClanBless = new clanBless(self);
        ClanBless.update(v);
    };

    this.updatePrivPage = function () {
        if (!PrivPage) PrivPage = new clanPage(self, 'priv-page', 'clan');
        PrivPage.update();
    };

    this.updateOfficialPage = function () {
        if (!OfficialPage) OfficialPage = new clanPage(self, 'official-page', 'clan');
        OfficialPage.update();
    };

    this.updateClanQuests = function (v) {
        if (!ClanQuests) ClanQuests = new clanQuests(self);
        ClanQuests.update(v);
    };

    this.updateRecruit = function (v, clanData) {
        if (!Recruit) Recruit = new recruit(self);
        Recruit.init();
        Recruit.update(v, clanData);
    };

    this.updateRecruitApplications = function (v) {
        if (!Recruit) Recruit = new recruit(self);
        Recruit.updateClanApplications(v)

    };
    this.updateRecruitInvitations = function (v) {
        if (!Recruit) Recruit = new recruit(self);
        Recruit.updateClanInvitations(v);
    };

    this.updateMembers = function (v) {
        if (!Members) Members = new clanMembers(self);
        Members.update(v);
    };

    this.updatePlayerEdit = function (v) {
        if (!PlayerEdit) PlayerEdit = new playerEdit(self);
        PlayerEdit.update(v);
    };

    this.getOtherClan = function (id) {
        var obj = {};
        var length = clList['id'].length;
        for (var i = 0; i < length; i++) {
            if (id == clList['id'][i]) break;
        }
        for (var k in clList) {
            obj[k] = clList[k][i];
        }
        return obj;
    };

    this.alert = function (msg, f) {
        mAlert(msg, 1, [function () {
            f();
            return true;
        }]);
    };

    this.createOneMember = function (v, edit, addGroup) {
        //var t = [
        //    this.tLang('member_level'),
        //    this.tLang('clan_last_visit'),
        //    $('<span>').addClass('green online-status').html('online'),
        //    //$('<div>').addClass('red online-status v-align').html('<span class="v-item">offline</span>').tip(calculateDiff(v[8]))
        //    $('<div>').addClass('red online-status-wrapper v-item').html('<div class="online-status">offline</div><div class="time-offline" time-offline="' + v[8] + '">' + calculateDiff(v[8]) + '</div>')
        //];

        let online

        if (v[9] == 0) {
            online = $('<span>').addClass('green online-status').html('online');
        }
        else {
            let onlineStr   = '<div class="online-status">offline</div><div class="time-offline" time-offline="' + v[9] + '">' + calculateDiff(v[9]) + '</div>';
            online          = $('<div>').addClass('red online-status-wrapper v-item').html(onlineStr)
        }

        var $mem = Members.getClanMember();
        var $info = v[1];
        var lastVisit = escapeHTML(v[5]) + ' (' + v[6] + ', ' + v[7] + ')';
        //var online = 0 ? t[2] : t[3];
        var allR = d['ranks'];
        var $rank = $('<div>').addClass('member-rank').html(allR[v[8]].name);
        var url = CFG.opath + v[10];
        var $levelAndProf = $('<div>');

        let charaData = {
            level           : v[2],
            operationLevel  : v[3],
            prof            : v[4],
            nick            : v[1]
        }

        let charInfo    = getCharacterInfo(charaData);


        //var $profIcon = $('<div>').addClass('profs-icon ' + v[3]);
				$rank.attr('id-rank', v[8]);
        //$profIcon.tip(v[3]);

        //var $memberLvl = $('<span>').addClass('member-lvl').html(v[2]);
        //var $memberProf = $('<span>').addClass('member-prof').html(v[3]);

        //$levelAndProf.append($memberLvl);
        $levelAndProf.append(charInfo);

        addCharacterInfoTip($levelAndProf, charaData)


        $mem.find('.icon').css('background-image', "url(" + url + ")");
        $mem.find('.char-stats').html($info);
        $mem.find('.last-visit').html(lastVisit);

        if (addGroup) Members.createAddToGroup($mem, v[0]);

        if (edit) {
            Members.createButRankEdit($mem, v[8], v[0], v[1]);
            //return this.createRecords([$mem, rank, online], 'normal-td big-height-td');
            return this.createRecords([$mem, $levelAndProf, $rank, online], 'normal-td big-height-td');
        }
        else return this.createRecords([$mem, $rank], 'normal-td big-height-td');
    };

    this.addControll = function (label, where, callback, wnd) {
        var $btn = drawSIButton(label);
        if (callback) $btn.click(callback.bind(self));
        wnd = wnd ? wnd : this.wnd.$;
        wnd.find('.' + where).append($btn);
        return $btn;
    };

    this.getMemberList = function () {
        return memberList;
    };

    this.getClanInf = function () {
        return clanInf;
    };

    this.getFindPanel = function () {
        return FindPanel;
    };

    this.getClanAtributs = function () {
        return ClanAtributes;
    };

    this.getCharInf = function () {
        return charInf;
    };

    this.getClanList = function () {
        return ClanList;
    };

    this.updateClList = function (data) {
        clList = data;
    };

    this.getRecruit = function () {
        return Recruit;
    };

    this.updateClasses = function () {
        //self.updateRecruit(false, true);
    };

    this.resetLastValClanList = function () {
        if (ClanList) ClanList.resetLastVal();
    };


    this.tLang = function (name, other) {
        return _t(name, null, other ? other : 'clan');
    };

    this.init();
}
