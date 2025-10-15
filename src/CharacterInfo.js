const CharacterInfo = {

    getCharacterInfo : function (data) {

        if (!this.checkCorrectCharacterData(data)) {
            return '';
        }

        let nick;

        if (data.showNick) {
            nick = data.nick;
            nick += " ";
        } else {
            nick = "";
        }

        let operationLevel  = data.operationLevel || 0;
        let level           = data.level || 0;
        let prof            = data.prof;

        if (level < 301) {
            operationLevel = 0;
        }
        const useHtml = !!data.htmlElement;
        let result          = this.getCharacterInfoText(nick, level, operationLevel, prof, useHtml);

        if (!useHtml) return result;

        return `<div class="character-info" nick="${nick}" level="${level}" operationLevel="${operationLevel}" prof="${prof}">${result}</div>`;
    },

    checkCorrectCharacterData : function (data) {
        const FUNC = "checkCorrectCharacterData";

        if (!elementIsObject(data)) {
            errorReport(moduleData.fileName, FUNC, "incorrect data object!", data);
            return false;
        }

        if (!isset(data.level)) {
            errorReport(moduleData.fileName, FUNC, "attr level not exist!", data);
            return false
        }

        if (!isset(data.operationLevel)) {
            errorReport(moduleData.fileName, FUNC, "attr operationLevel not exist!", data);
            return false
        }

        //if (!isset(data.prof)) {      // npc issue
        //    errorReport(moduleData.fileName, FUNC, "attr prof not exist!", data);
        //    return false
        //}

        return true;
    },
  getLevelAndOperationLevel: function (level, operationLevel, prof) {
    const profStr = prof || '';
    return operationLevel
      ? `${level}${profStr}|${operationLevel}${profStr}`
      : `${level}${profStr}`;
  },

  getOperationLevelAndLevel: function (level, operationLevel, prof) {
    const profStr = prof ? prof : '';

    return operationLevel
      ? `${operationLevel}${profStr}|${level}${profStr}`
      : `${level}${profStr}`;
  },

  getOnlyOperationLevel: function (level, operationLevel, prof) {
    const profStr = prof ? prof : '';

    return operationLevel
      ? `${operationLevel}${profStr}`
      : `${level}${profStr}`;
  },

  getOnlyLevel: function (level, operationLevel, prof) {
    const profStr = prof ? prof : '';

    return `${level}${profStr}`;
  },

  getLevelAndProfString: function (level, operationLevel, prof) {
    const kindOfShowLevelAndOperationLevel = getKindOfShowLevelAndOperationLevel();

    switch (kindOfShowLevelAndOperationLevel) {
      case 0:
        return  this.getLevelAndOperationLevel(level, operationLevel, prof);
      case 1:
        return  this.getOperationLevelAndLevel(level, operationLevel, prof);
      case 2:
        return  this.getOnlyOperationLevel(level, operationLevel, prof);
      case 3:
        return  this.getOnlyLevel(level, operationLevel, prof);
      default :
        errorReport("Helpers.js", "getCharacterInfo", "incorrect case", kindOfShowLevelAndOperationLevel);
        return  this.getLevelAndOperationLevel(level, operationLevel, prof);
    }
  },

  formatNick: function (nick, useHtml = false) {
    return useHtml ? `<span class="character-info-nick">${nick}</span>` : nick;
  },

  getCharacterInfoText: function (nick, level, operationLevel, prof, useHtml = false) {
    const kindOfShowLevelAndOperationLevel = getKindOfShowLevelAndOperationLevel();
    const formattedNick = this.formatNick(nick, useHtml);
    const levelString = this.getLevelAndProfString(level, operationLevel, prof, kindOfShowLevelAndOperationLevel);

    return `${formattedNick}(${levelString})`;
  },

    addCharacterInfoTip : function ($objectToTip, data) {

        if (!$objectToTip) {
            errorReport("Helpers.js", "addCharacterInfoTip", "$objectToTip is null");
            return;
        }

        if (!this.checkCorrectCharacterData(data)) {
            return;
        }

        let br 					= "<br>";
        let colon 				= ": ";
        let nick 				= data.nick;
        let level 				= data.level;
        let operationLevel 		= data.operationLevel;
        let prof 				= data.prof;

        if (level < 301) {
            operationLevel = 0;
        }

        let operationLevelStr 	= operationLevel ? (_t('character_operation_lvl') + colon + operationLevel + br) : '';

        let tip = _t('character_nick') + colon + nick + br +
            _t('character_lvl') + colon + level + br +
            operationLevelStr +
            _t('character_prof') + colon + getAllProfName(prof) + br;

        $objectToTip.tip(tip);
    }
};
