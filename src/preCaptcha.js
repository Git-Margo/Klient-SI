function preCaptcha () {
  var self = this;
  var si = null;
  var hidden = false;
  this.wndEl = document.getElementById('pre-captcha');
  this.toggleBtnEl = null;

  this.init = function (autostart_time_left) {
    this.clear();
    this.addPreCaptchaInfo(autostart_time_left);
    this.createToggleButton();
  };

  this.createToggleButton = () => {
    this.toggleBtnEl = this.wndEl.querySelector('.captcha-pre-info__toggler');
    this.toggleBtnEl.addEventListener("click", this.toggleWindow);

    this.show();
  };

  this.toggleWindow = () => {
    if (hidden) {
      this.show();
    } else {
      this.hide();
    }
  };

  this.show = () => {
    this.wndEl.classList.add('show');
    this.toggleBtnEl.classList.add('is-open');
    hidden = false;
  };

  this.hide = () => {
    this.wndEl.classList.remove('show');
    this.toggleBtnEl.classList.remove('is-open');
    hidden = true;
  };

  this.createOneButton = (name, classes, clb) => {
    const btn = drawSIButton(name, 'wood')[0];
    //btn.classList.add(...classes);
    btn.addEventListener('click', clb);
    return btn;
  };

  this.addPreCaptchaInfo = (autostart_time_left) => {
    let time = autostart_time_left;
    const elInfo = $(this.tpl())[0];
    const elTime = elInfo.querySelector('.captcha-pre-info__time');
    const elLabel = elInfo.querySelector('.captcha-pre-info__label');
    const elButtonWrapper = elInfo.querySelector('.captcha-pre-info__button');
    const elButton = this.createOneButton(_t('captcha_resolve_now'),['small', 'green'], () => {
      this.removePreCaptchaInfo();
      _g('captcha&start=1');
    });

    elLabel.textContent = _t('captcha_time');
    elTime.textContent = --time;
    elButtonWrapper.append(elButton);

    this.preCaptchaInfoTimeTick(elTime, time);

    this.wndEl.appendChild(elInfo);
  };

  this.preCaptchaInfoTimeTick = (elTime, time) => {
    si = setInterval(() => {
      --time;
      if (time <= 0) {
        this.removePreCaptchaInfo();
      }
      elTime.innerHTML = time;
    }, 1000);
  };

  this.removePreCaptchaInfo = () => {
    clearInterval(si);
    this.close();
  };

  this.close = () => {
    this.hide();
    this.clear();
  };

  this.clear = () => {
    this.wndEl.innerHTML = '';
  };

  this.tpl = () => `
    <div class="captcha-pre-info">
        <span class="captcha-pre-info__label"></span>
        <span class="captcha-pre-info__time"></span>s
        <div class="captcha-pre-info__button"></div>
        <div class="captcha-pre-info__toggler"></div>
    </div>
	`
};
