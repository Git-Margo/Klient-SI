class WorldConfig {
  #config = null;

  constructor() {}

  update(config) {
    this.#config = config;
  }

  getApiDomain() {
    return this.#config.api_domain;
  }

  getEnableMe() {
    return this.#config.enableme;
  }

  getEnableNar() {
    return this.#config.enablenar;
  }

  getSkipMute() {
    return this.#config.skipmute;
  }

  getDropDestroyLvl() {
    return this.#config.dropdestroylvl;
  }

  getLoot() {
    return this.#config.loot;
  }

  getTtlLootDel() {
    return this.#config.ttlootdel;
  }

  getPvpLvlOff() {
    return this.#config.pvplvloff;
  }

  getPvpStart() {
    return this.#config.pvpstart;
  }

  getPvpEnd() {
    return this.#config.pvpend;
  }

  getNonPvpStart() {
    return this.#config.nonpvpstart;
  }

  getNonPvpEnd() {
    return this.#config.nonpvpend;
  }

  getNpcExp() {
    return this.#config.npcexp;
  }

  getNpcResp() {
    return this.#config.npcresp;
  }

  getWeakTitans() {
    return this.#config.weaktitans;
  }

  getPh() {
    return this.#config.ph;
  }

  getPrivWorld() {
    return this.#config.priv_world;
  }

  getQuestExp() {
    return this.#config.questexp;
  }

  getSupervisorIds() {
    return this.#config.supervisorIds;
  }

  getWantedShow() {
    return this.#config.wanted_show;
  }

  getWorldName() {
    return this.#config.worldname;
  }

  getPvp() {
    return this.#config.pvp;
  }

  getHardcore() {
    return this.#config.hardcore;
  }

  getBrutal() {
    return this.#config.brutal;
  }

  getRpg() {
    return this.#config.rpg;
  }
}
