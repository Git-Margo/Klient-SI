function captcha () {
	var self = this;
	var content;
	var selectedAnswers = [];

	this.wndEl = document.getElementById('captcha');

	this.init = function () {

	};

	this.update = (data) => {
		if (isset(data.content)) {
			this.openCaptcha(data);
		}
		if (isset(data.autostart_time_left)) {
			const pCaptcha = new preCaptcha();
			pCaptcha.init(data.autostart_time_left);
		}
		if (isset(data.done) && data.done) {
			this.close();
			//mAlert('Correct answer');
		}

		//if (isset(data.blockadeEndTs)) {				// this appear in normal game or when start interface
		 if (isset(data.blockade_time_left)) {
		 	this.close();
		 	this.countTimeToNextCaptcha(data.blockade_time_left);
		 	stopEngine();
		 	setBlockSendNextInit(true);
		 	//error('Engine stop');
		 }

		let alreadyInitialised = g.init >= 4;

		if (!isset(data.blockadeEndTs) && isset(data.content) && !alreadyInitialised) {
			if (!isset(data.blockade_time_left) && isset(data.content) && !alreadyInitialised) {
				stopEngine();
				setBlockSendNextInit(true);
			}
		}
	};

	this.countTimeToNextCaptcha = (blockade_time_left) => {
        let time = blockade_time_left;

        mAlert(_t('captcha_wrong_answer'), 0, function () {
	        window.location.href = 'https://www.margonem.pl/'
        });
        //mAlert(_t('captcha_wrong_answer'), [{
        //    callback: function () {
        //window.location.href = "https://www.margonem.pl/";
        //    	return true;
        //    }
        //}]);

        setInterval(function () {
        	time--;
	        if (time < 0) time = 0;
			if (time < 1) location.reload();
			$('#captcha-timer').html(getSecondLeft(time));
		}, 1000);
		$('#captcha-timer').html(getSecondLeft(time));
	};

	this.openCaptcha = (data) => {
		this.close(); // return;
		this.initWindow();
		this.create(data);
		g.lock.add('captcha');
		//self.wnd.center();
	};

	this.create = (data) => {
		this.clear();
		this.createImg({ image: data.content.image });
		this.createQuestion({ text: data.content.question.text });
		this.createButtons({ answers: data.content.question.options });
		this.createConfirmButton();
		this.createTriesLeft(data.triesLeft);

		this.wndEl.style.display = 'block';
		$(this.wndEl).absCenter();
	};

	this.createImg = ({ image }) => {
		var img = document.createElement("IMG");
		img.setAttribute("src", image.data);
		img.setAttribute("width", image.resolution.x);
		img.setAttribute("height", image.resolution.y);
		content.querySelector('.captcha__image').append(img);
	};

	this.createQuestion = ({ text }) => {
		content.querySelector('.captcha__question').textContent = text;
	};

	this.createOneButton = (name, classes, clb) => {
		const btn = drawSIButton(name, classes)[0];
		//btn.classList.add(...classes);
		btn.addEventListener('click', clb);
		return btn;
	};

	this.createButtons = ({ answers }) => {
		for(const answer in answers) {
			const value = answers[answer];
			const button = this.createOneButton(value, 'wood', this.buttonOnClick);
			content.querySelector('.captcha__buttons').append(button);
		}
	};

	this.createConfirmButton = () => {
		const confirmButton = this.createOneButton(_t('captcha_confirm'), 'wood', this.confirmOnClick);
		content.querySelector('.captcha__confirm').append(confirmButton);
	};

	this.createTriesLeft = (triesLeft) => {
		content.querySelector('.captcha__triesleft').innerHTML = (_t('captcha_triesleft')) + triesLeft;
	};

	this.buttonOnClick = (e) => {

		if (!e.isTrusted) return;

		var targetElement = e.target || e.srcElement;
		const index = this.getNodeIndex(targetElement);
		targetElement.classList.toggle('active');
		this.updateSelectedAnswers(index);
		//this.setConfirmButton();
	};

	this.updateSelectedAnswers = (index) => {
		if (!selectedAnswers.includes(index)) {
			selectedAnswers.push(index);
		} else {
			selectedAnswers.splice(selectedAnswers.indexOf(index), 1);
		}
	};

	//this.setConfirmButton = () => {
	//	const confirmBtnEl = content.querySelector('.captcha__confirm .btn-wood');
	//	if (selectedAnswers.length > 0) {
	//		confirmBtnEl.classList.remove('disable');
	//	} else {
	//		confirmBtnEl.classList.add('disable');
	//	}
	//};

	this.confirmOnClick = (e) => {

		if (!e.isTrusted) return;

		const answers = selectedAnswers.sort().join(',');
		//_g(`captcha&answerId=${answers}`);

		let alreadyInitialised = g.init >= 4;
		if (!alreadyInitialised) {
			startEngine();
			sendFirstInit(`&captcha&answerId=${answers}`);
		 } else {
		 	_g(`captcha&answerId=${answers}`);
		 }
		this.close(); // fix for SI (return on wait_for) #17782
	};

	this.initWindow = function () {
		const title = _t('captcha');
		this.setDefaultContent();
		this.wndEl.querySelector('.captcha__title').appendChild($(goldTxt(title))[0]);
	};

	this.clear = () => {
		selectedAnswers = [];
		delete content;
	};

	this.setDefaultContent = () => {
		content = $(this.tpl())[0];
		this.wndEl.appendChild(content);
	};

	this.getNodeIndex = elm => [...elm.parentNode.children].indexOf(elm);

	this.close = function () {
		this.wndEl.style.display = 'none';
		this.wndEl.innerHTML = '';
		delete content;
		g.lock.remove('captcha');
		// if(!isset(this.wnd)) return;
		// this.wnd.$.remove();
		// delete (this.wnd);
		//Engine.captcha = false;
	};

	this.tpl = () => `
		<div class="captcha">
			<div class="captcha__header"></div>
			<div class="captcha__title"></div>
			<div class="captcha__content">
				<div class="captcha__question"></div>
				<div class="captcha__image"></div>
				<div class="captcha__buttons"></div>
				<div class="captcha__confirm"></div>
				<div class="captcha__triesleft"></div>
			</div>
		</div>
	`
};
