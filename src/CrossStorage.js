function CrossStorage () {
  this.storage = null;
  this._isConnected = false;

  this.init = () => {
    let hitUrl = this.getHitUrl();
    this.storage = new CrossStorageClient(hitUrl);
    return this.storage.onConnect().then(() => {
      this._isConnected = true;
    }, (err) => {

    });
  };

  this.getHitUrl = () => {
    return `${_COMMONS_PATH}/cross-storage/hub.html`;
  };

  this.set = (key, value) => {
    if (typeof value === 'string'){
      return this.storage.set(key, value);
    } else {
      return this.storage.set(key, JSON.stringify(value));
    }
  };
  this.get = (key) => {
    return this.storage.get(key);
  };

};
