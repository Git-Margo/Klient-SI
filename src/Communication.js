

if (newCommunicationMode) {

	let lastRequest;
	let taskCallbacks = {};
	let taskPayload   = {};
	let taskQueue     = [];

	let webSocket;
	let webSocketTask;
	let webSocketCallBack;
	let webSocketInMove;
	let zeroInitWasReceived = false;
	let globalAddonsInitWasReceived = false;


	window.setGlobalAddonsWasReceived = (state) => {
		globalAddonsInitWasReceived = state;
	};

	this.getGlobalAddonsWasReceived = () => {
		return globalAddonsInitWasReceived;
	};

	window.initWebSocket = function () {

		let sub       = location.hostname.split('.')[0];
		let isLocal   = sub == 'local';
		let protocol  = location.protocol == "https:" || isLocal ? 'wss' : 'ws';
		let l         = _l() == 'pl' ? 'pl' : 'com';
		sub           = isLocal ? 'dev' : sub;
		if (expeMode) sub = 'experimental';
		//sub = "tabaluga";

		let url = protocol + '://' + sub + '.margonem.' + l + '/ws-engine';

		webSocket = new WebSocket(url);
		webSocket.onopen = function(evt) {
			//startGame();
			var __nga = isNaN(parseInt(getCookie('__nga'))) ? 0 : parseInt(getCookie('__nga'));
			if (!__nga) {
				//_g(`getvar_addon&callback=GLOBAL_ADDON`);
				_g(`addon`);
			} else {
				setGlobalAddonsWasReceived(true);
				startGame();
			}
		};

		webSocket.onclose = function(evt) {
			setTimeout(() => { // for FF
				location.reload();
			}, 300);
		};

		webSocket.onmessage = function(evt) {
			let data = evt.data;

			if (!zeroInitWasReceived) {
				let parseData = JSON.parse(data);

				if (isset(parseData.addon)) {
					let __nga = isNaN(parseInt(getCookie('__nga'))) ? 0 : parseInt(getCookie('__nga'));

					if (!__nga) {
						if(parseData.addon != '') loadScript(parseData.addon);

					}
					setGlobalAddonsWasReceived(true);
					zeroInitWasReceived = true;
					startGame();
					return
				}
			}

			//if (!zeroInitWasReceived && data.search("GLOBAL_ADDON") > -1) {
			//	let __nga = isNaN(parseInt(getCookie('__nga'))) ? 0 : parseInt(getCookie('__nga'));
            //
			//	if (!__nga) {
			//			data = data.replace('GLOBAL_ADDON' + '("', '');
			//			data = data.replace('")', '');
			//			if(data != '') loadScript(data);
            //
			//	}
			//	setGlobalAddonsWasReceived(true);
			//	zeroInitWasReceived = true;
			//	startGame();
			//	return
			//}

			if (data == '') {
				console.log('webSocket onmessage empty');
				location.reload();
				return
			}
			successData(data);
		};

		webSocket.onerror = function(evt) {
			//console.log('webSocket error')
			errorData(evt)
		};
	};

	window.errorData = function (e) {
		let _webSocketTask 		= webSocketTask;
		console.log(e);
		webSocketVarsClear();

		if (e.status == 504) {
			//Engine.console.warn(_t('Request rejected'));
			g.tickSuccess = true;
			if (_webSocketTask != '_') removeFromTaskQueue(_webSocketTask);
			return
		}
		location.reload();
		//Engine.reconnect.disconnect(e);
		console.log('ERROR');
	};

	window.successData  = function (d) {
		let _webSocketCallBack 		= webSocketCallBack;
		let _webSocketTask 		    = webSocketTask;
		let _webSocketInMove 		  = webSocketInMove;

		webSocketVarsClear();
		let data 			= JSON.parse(d);
		var ret = false;
		g.tickSuccess = true;
		manageHeroIdle(_webSocketInMove);
		if (_webSocketTask != '_') removeFromTaskQueue(_webSocketTask);
		if (!g.engineStopped) ret = parseInput(data, _webSocketCallBack);
		g.initAjaxState = ret;

	};

	window.webSocketVarsClear = function () {
		webSocketCallBack 	= null;
		webSocketTask 	    = null;
		webSocketInMove 	  = null;
	};

	window.setLastRequest = function () {
		lastRequest = (new Date()).getTime();
	}

	//window._g = function _g (task, callback, payload) {
	window._g = function (task, callback, payload) {

		if (!g.requestCorrect.checkTaskIsCorrect(task)) {
			console.error('Communication.js', '_g', "Task is not correct", task);
			return;
		}

		if (checkCanAddTaskToTaskQueue(task)) {
			//addToTaskQueue(task, callback, payload);
			addToTaskQueue(task, callback, payload);
			return;
		}

		//sendRequest(task, callback, payload);
		sendRequest(task, callback, payload);
	};

	window.sendRequest = function (url, callback, payload) {

		webSocketTask = url;
		webSocketCallBack = callback;

		if (g.init>4 && url == 'walk' && !(__tutorials.val&2) && __tutorials.val !== null){
			_g('tutorial&opt='+(__tutorials.val|2), function(){_g('___walk')});return;
		}
		url = url=='___walk'?'walk':url;
		g.sync=0;
		g.delays.before = new Date();
		if(url=='_' && g.ats) return;

		webSocketInMove = hero.ml.length ? true : false;

		if(hero.ml.length){

			if (g.requestCorrect.checkStepsToSendCorrect(hero.ml) && g.requestCorrect.checkTimesToSendCorrect(hero.mts)) {
				url+='&ml='+hero.ml.join(';');
				url+='&mts='+hero.mts.join(';');
			}

		} else if(g.init > 4 && hero.remoteDir != hero.dir) {
			url += "&pdir="+hero.dir;
			hero.sendDir = true;
		}
		if(g.ev) {
			if (g.lastEv !== null && g.lastEv === g.ev) window.location.reload();

			url+='&ev=' + g.ev;
			g.lastEv = g.ev;
			//g.ev += 0.01;
		}
		if(g.browser_token) {
			url+="&browser_token="+g.browser_token;
		}
		if(g.tmpParams.length) {
			url+= '&' + g.tmpParams.join('&');
			g.tmpParams = [];
		}
		if(g.bagupd!=g.bag) {
			g.bagupd=g.bag;
			url+='&bag='+g.bag;
		}
		g.ats=ts();
		var data = payload ? payload : null;
		//if(arguments.length>1) data=typeof(arguments[1]) == 'object' ? arguments[1] : null;
		g.initAjaxState = false;


		webSocketSendData('t=' + url, data);
		setLastRequest();
		g.tickSuccess = false;
	}

	window.webSocketSendData = function (getData, postData) {
		let objectToSend = {
			'g': getData,
			'p':  postData ? JSON.stringify(postData) : ''
		};

		let jsonParse = JSON.stringify(objectToSend);

		webSocket.send(jsonParse);
	};

	window.checkCanAddTaskToTaskQueue= function (task) {
		if (!globalAddonsInitWasReceived) return false;

		let time = (new Date()).getTime();
		if (g.init <= 4) return false
		return task != '_' && (!g.tickSuccess || time - lastRequest < g.delays.limit);
	}

	window.checkCanSendTaskFromTaskQueue = function () {
		return taskQueue.length;
	}

	window.sendTaskFromQueue = function () {
		var id 			= taskQueue[0];
		var callback 	= taskCallbacks[id];
		var payload 	= taskPayload[id];

		if (callback && payload) return _g(id, callback, payload);
		if (payload) 			 return _g(id, false, payload);
		if (callback)			 return _g(id, callback);

		_g(id);
	}

	//window.addToTaskQueue = function addToTaskQueue (task, callback, payload) {
	window.addToTaskQueue = function (task, callback, payload) {
		if (taskQueue.indexOf(task) > -1) return;

		taskQueue.push(task);
		taskCallbacks[task] 	= undefined == callback ? null : callback;
		taskPayload[task] 	    = undefined == payload ? null : payload;
	}

	window.removeFromTaskQueue = function (task) {
		var index = taskQueue.indexOf(task);
		if (index < 0) return;
		taskQueue.splice(index, 1);
		delete taskCallbacks[task];
		delete taskPayload[task];
	}
}
