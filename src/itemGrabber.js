class ItemGrabber {
  constructor(options) {
    this.setFilters(options);
  }

  setFilters(options) {
    this.options = options;
  }

  grab(bagNumber) {
    --bagNumber; // index

    const items = [];
    const hItems = g.hItems;
    const min = bagNumber * 6;
    const max = min + 6;

    for (let k in hItems) {
      const item = hItems[k];
      if (!this.checkBag(item, min, max)) continue;
      if (!this.checkCl(item)) continue;
      if (!this.checkStats(item)) continue;
      items.push(item);
    }

    return items;
  }

  checkBag(item, min, max) {
    return item.st === 0 && item.y >= min && item.y < max;
  }

  checkCl(item) {
    let clOk = true; // default true
    if (isset(this.options.allow.cls)) {
      if (this.options.allow.cls.length > 0) {
        if (!this.options.allow.cls.includes(item.cl)) clOk = false;
      } else {
        // if cls key is exist but array is empty = false
        clOk = false;
      }
    }
    if (isset(this.options.deny.cls)) {
      if (this.options.deny.cls.includes(item.cl)) clOk = false;
    }

    return clOk;
  }

  checkStats(item) {
    let statsOk = true; // default true

    const allowStats = this.options.allow.stats;
    const denyStats = this.options.deny.stats;

    if (isset(allowStats)) {
      for (const stat of allowStats) {
        if (!this.checkOneStat(item, stat)) statsOk = false;
      }
    }

    if (isset(denyStats)) {
      for (const stat of denyStats) {
        if (this.checkOneStat(item, stat)) statsOk = false;
      }
    }

    return statsOk;
  }

  checkOneStat(item, oneStat) {
    if (typeof oneStat === 'object') {
      const { name: statName, params: statParams } = oneStat;

      if (checkItemStat(item, statName)) {
        const [operator, value] = statParams,
          itemStats = parseItemStat(item.stat),
          itemStatValue = itemStats[statName];
        if (count(operator, itemStatValue, value)) return true; // e.g (itemLvl < lvl)
      } else {
        return false;
      }
    } else {
      if (checkItemStat(item, oneStat)) return true;
    }

    return false;
  }
}
