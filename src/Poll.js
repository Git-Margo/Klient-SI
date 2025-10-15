function poll () {
	let content;
	let formEl;
	let pollId;
	let confirmButtonEl;
	let config = {
		rateRange: [1, 10],
		pollApiUrl: null,
		pollApiUrlPush: null,
		pollHitKey: 'pollHit',
		pollDisplayedKey: 'pollDisplayed'
	}

	this.wndEl = document.getElementById('poll');

	function setAttributes(el, attrs) {
		for(const key in attrs) {
			el.setAttribute(key, attrs[key]);
		}
	}

	this.getApiDomain = () => {
		return this.getEngine().worldConfig.getApiDomain();
	}

	this.getConfig = () => {
		return config;
	}

	this.setApiUrl = () => {
		const
			hs3 = this.getHS3Cookie(),
			pollApiDomain = this.getApiDomain();

		this.getConfig().pollApiUrl = `${pollApiDomain}/surveys/get?hs3=${hs3}`;
		this.getConfig().pollApiUrlPush = `${pollApiDomain}/surveys/vote`;
	};

	this.init = () => {
		this.canHitForPoll().then(can => {
			if (can) {
				this.setPollHitDate();
				this.getPollData();
			}
		});
	};

	this.canHitForPoll = async () => {
		const hasPollDisplayedToday = await this.hasPollDisplayedToday();
		return !(this.hasPollHitToday() || hasPollDisplayedToday);
	};

	this.hasPollDisplayedToday = async () => {
		const pollDisplayedDate = await g.crossStorage.get(this.getConfig().pollDisplayedKey);
		return pollDisplayedDate && pollDisplayedDate === getCurrentDate();
	};

	this.setPollDisplayedDate = () => {
		g.crossStorage.set(this.getConfig().pollDisplayedKey, getCurrentDate());
	};

	this.hasPollHitToday = () => {
		const pollHitDate = margoStorage.get(this.getConfig().pollHitKey);
		return pollHitDate && pollHitDate === getCurrentDate();
	};

	this.setPollHitDate = () => {
		margoStorage.set(this.getConfig().pollHitKey, getCurrentDate());
	};

	this.getPollData = () => {
		this.setApiUrl();
		fetch(this.getConfig().pollApiUrl, {
			credentials: 'include'
		}).then((response) => {
			return response.json();
		}).then((data) => {
			const survey = data.survey;
			if (survey) {
				this.updateData({ data: survey });
			} else if (isset(data.error)) {
				console.warn('Poll - Something went wrong.');
			}
		}).catch((err) => {
			console.warn('Poll - Something went wrong.', err);
		});
	};

	this.updateData = ({ data }) => {
		if (isset(data)) {
			pollId = data.id;
			this.openPoll({ data });
		}
	};

	this.openPoll = ({ data }) => {
		this.close(); // return;

		this.setPollDisplayedDate();
		this.initWindow();
		this.create({ data });
	};

	this.create = ({ data }) => {
		this.clear();
		this.createQuestion({ data });
		this.createConfirmButton();
		formEl = this.wndEl.querySelector('form');

		this.wndEl.style.display = 'block';
		$(this.wndEl).absCenter();
	};

	this.createQuestion = ({ data }) => {
		const listEl = content.querySelector('.poll__list');
		data.questions.forEach((el, index, array) => {
			const listItemEl = $(this.tplListItem())[0];
			const answersEl = listItemEl.querySelector('.poll__answers');
			listItemEl.querySelector('.poll__question').textContent = `${index+1}. ${el}`;
			this.createAnswers(answersEl, index+1);
			listEl.appendChild(listItemEl);
		});
	};

	this.createAnswers = (answersEl, questionId) => {
		for (let i = rateRange[0]; i <= rateRange[1]; i++) {
			const ansId = `answer_${questionId}-${i}`;
			const answerEl = document.createElement("div");
			answerEl.classList.add('poll__answers-item');

			const radioEl = document.createElement("input");
			setAttributes(radioEl, { type: 'radio', value: i, id: ansId, name: `q_${questionId}`, required: true });
			radioEl.addEventListener('change', this.checkValid);

			const labelEl = document.createElement("label");
			setAttributes(labelEl, { for: ansId });
			labelEl.textContent = i.toString();

			answerEl.appendChild(radioEl);
			answerEl.appendChild(labelEl);
			answersEl.appendChild(answerEl);
		}
		return answersEl;
	};

	this.createOneButton = (name, classes, clb) => {
		const btn = drawSIButton(name, classes)[0];
		//btn.classList.add(...classes);
		btn.addEventListener('click', clb);
		return btn;
	};

	this.createConfirmButton = () => {
		confirmButtonEl = this.createOneButton(_t('send', null, 'mails'), 'wood disable', this.confirmOnClick);
		content.querySelector('.poll__confirm').append(confirmButtonEl);
	};

	this.checkValid = () => {
		if (formEl.checkValidity()) {
			confirmButtonEl.classList.remove('disable');
			return true;
		} else {
			confirmButtonEl.classList.add('disable');
			return false;
		}
	};

	this.getHS3Cookie = () => {
		return getCookie('hs3');
	};

	this.confirmOnClick = () => {
		const answers = $(formEl).serializeArray().map(answer => parseInt(answer.value));
		const obj = {
			vote: pollId,
			w: g.worldConfig.getWorldName(),
			answer: answers,
			hs3: this.getHS3Cookie()
		};

		const response = fetch(this.getConfig().pollApiUrlPush, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			//mode: 'no-cors', // no-cors, *cors, same-origin
			credentials: 'include',
			headers: {
				// 'Content-Type': 'application/json'
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify(obj)
			//body: `t=surveys&vote=${pollId}&w=${Engine.worldName}&answer=${answers}`
		}).then((response) => {
			if (response.status === 0) return null;
			return response.json();
		}).then((data) => {
			//console.log(data);
		}).catch((err) => {
			console.warn('Something went wrong.', err);
		});

		this.close();
	};

	this.initWindow = () => {
		const title = _t('poll');
		this.setDefaultContent();
		this.wndEl.querySelector('.poll__title').appendChild($(goldTxt(title))[0]);
		this.wndEl.querySelector('.closebut').addEventListener('click', () => {
			this.close();
		});
	};

	this.clear = () => {
		delete content;
	};

	this.setDefaultContent = () => {
		content = $(this.tpl())[0];
		this.wndEl.appendChild(content);
	};

	this.close = function () {
		this.wndEl.style.display = 'none';
		this.wndEl.innerHTML = '';
		delete content;
	};

	this.getEngine = () => {
		return g;
	}

	this.tpl = () => `
		<div class="poll">
			<div class="poll__header"></div>
			<div class="poll__title"></div>
			<div class="poll__content">
				<form>
					<div class="poll__list"></div>
					<div class="poll__confirm"></div>
				</form>
			</div>
			<div class="closebut"></div>
    	</div>
	`;

	this.tplListItem = () => `
		<div class="poll__list-item">
			<div class="poll__question"></div>
			<div class="poll__answers"></div>
		</div>
	`;
};
