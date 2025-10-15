class MapConfig {
  #config = null;

  constructor() {
    this.setDefaults();
  }

  setDefaults() {
    this.#config = {
      lvlMin: null,
      lvlMax: null,
      isLvlAddLootRangeEnabled: false,
      isPrivRoom: false,
      isTeleportBlocked: false,
      isRespawnShortened: false,
      isClearEnabled: false,
      isTimeticketsUsageDisabled: false,
      isTpOutAfterOffline: false,
      isPartiesDisabled: false,
      isChangeOutfitAtDie: false,
      isTeleportAt5AM: false,
      isPvpLvlAdvantageDisabled: false,
      isAlwaysPvpForced: false,
      isMakeNoobImmune: false,
    };
  }

  update(config) {
    this.#config = { ...this.#config, ...config };
  }

  getLvlMin() {
    return this.#config.lvlMin;
  }

  getLvlMax() {
    return this.#config.lvlMax;
  }

  getIsLvlAddLootRangeEnabled() {
    return this.#config.isLvlAddLootRangeEnabled;
  }

  getIsPrivRoom() {
    return this.#config.isPrivRoom;
  }

  getIsTeleportBlocked() {
    return this.#config.isTeleportBlocked;
  }

  getIsRespawnShortened() {
    return this.#config.isRespawnShortened;
  }

  getIsClearEnabled() {
    return this.#config.isClearEnabled;
  }

  getIsTimeticketsUsageDisabled() {
    return this.#config.isTimeticketsUsageDisabled;
  }

  getIsTpOutAfterOffline() {
    return this.#config.isTpOutAfterOffline;
  }

  getIsPartiesDisabled() {
    return this.#config.isPartiesDisabled;
  }

  getIsChangeOutfitAtDie() {
    return this.#config.isChangeOutfitAtDie;
  }

  getIsTeleportAt5AM() {
    return this.#config.isTeleportAt5AM;
  }

  getIsPvpLvlAdvantageDisabled() {
    return this.#config.isPvpLvlAdvantageDisabled;
  }

  getIsAlwaysPvpForced() {
    return this.#config.isAlwaysPvpForced;
  }

  getIsMakeNoobImmune() {
    return this.#config.isMakeNoobImmune;
  }
}
