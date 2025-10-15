function RajController () {

    let screenEffects;

    const init = () => {
        screenEffects = {}
    }

    const callSrajFromTemplate = (data, kind) => {
        let srajStore = getEngine().srajStore;
        for (let i = 0; i < data.length; i++) {

            let id                  = data[i].id;
            //let additionalData      = data[i].additionalData ? data[i].additionalData : null;
            //let exceptionData       = data[i].exception ? data[i].exception : [];
            //let additionalData      = null;
            //let exceptionData       = [];

            if (srajStore.checkSrajTemplate(id)) {
                let srajToCall = srajStore.getSrajTemplate(id, kind);

                //parseJSON(srajToCall, exceptionData, additionalData)
                parseJSONRajController(srajToCall)
            }

        }
    };

    const parseJSONRajController = (d) => {
        let data;
        try {
            data = JSON.parse(d);
        } catch(e) {
            console.error('RajController.js', 'parseJSON', 'Incorrect JSON format!', d);
        }

        if (data.weather)   map.weatherRayControllerServe(data);
        if (data.mapFilter) map.weatherRayControllerServe(data);
        if (data.night) g.nightController.updateData(data);
        if (data.jsScript) eval(data.jsScript);

        if (data.screenEffects) {
            updateScreenEffects(data.screenEffects);
        }

        if (data.interfaceKind && elementIsObject(data.interfaceKind) && data.interfaceKind.kind == "NI") {
            setNiInterfaceCookie();
            window.location.reload();
        }
    };

    const addScreenEffect = (id, r, g, b, a) => {
        let $screenEffectsDiv   = $('<div>').addClass(`screenEffectsWrapper screenEffect-${id}`);
        let $ground             = $('#ground');

        $screenEffectsDiv.css({
            position            : 'absolute',
            width               : $ground.width(),
            height              : $ground.height(),
            backgroundColor     : `rgba(${r},${g},${b}, ${a})`,
            pointerEvents       : "none",
            zIndex              : getLayerOrder(map.y, 10)
        });

        $('#base').append($screenEffectsDiv);
    };

    const removeScreen = (id) => {
        let $base = $('#base')

        $base.find(`.screenEffectsWrapper.screenEffect-${id}`).remove();
    }

    const updateScreenEffects = (screenEffectsData) => {
        let list = screenEffectsData.list;
        if (!list) {
            return
        }

        if (!Array.isArray(list)) {
            return
        }

        for (let k in list) {
            updateOneScreenEffect(list[k]);

        }
    };

    const updateOneScreenEffect = (oneScreenEffect) => {
        let id              = oneScreenEffect.id;
        let action          = oneScreenEffect.action;
        let interfaceKind   = oneScreenEffect.interfaceKind ? oneScreenEffect.interfaceKind : '';

        let availableInterfaceKind = ['ALL', 'SI'];

        if (!availableInterfaceKind.includes(interfaceKind)) {
            return;
        }

        if (action == 'CREATE' && !checkScreenEffect(id)) {
            createScreenEffect(id, oneScreenEffect)
        }

        if (action == 'REMOVE' && checkScreenEffect(id)) {
            removeScreenEffect(id)
        }

    };

    const createScreenEffect = (id, oneScreenEffect) => {
        screenEffects[id] = {
            behaviorList    : oneScreenEffect.behavior.list,
            behaviorIndex   : 0,
            timeout         : null
        };

        callBehavior(id);
    };

    const callBehavior = (id) => {
        let behaviorIndex   = screenEffects[id].behaviorIndex;
        let behaviorList    = screenEffects[id].behaviorList;
        let duration        = behaviorList[behaviorIndex].duration ? behaviorList[behaviorIndex].duration : 5;
        let mode            = behaviorList[behaviorIndex].mode;
        let data            = behaviorList[behaviorIndex].data;

        if (mode != 'static' || !data || !data.color) {
            afterFinishBehavior(id);
            return;
        }

        let dataColor = data.color;

        addScreenEffect(id, dataColor.r, dataColor.g, dataColor.b, dataColor.a);

        screenEffects[id].timeout = setTimeout(function () {

            afterFinishBehavior(id);

        }, duration * 1000);
    };

    const afterFinishBehavior = (id) => {
        clearScreenEffectsTimeout(id);
        removeScreen(id);

        let behaviorList        = screenEffects[id].behaviorList;
        let nextBehaviorIndex   = screenEffects[id].behaviorIndex + 1;

        if (behaviorList[nextBehaviorIndex]) {
            screenEffects[id].behaviorIndex++;
            callBehavior(id);
        } else {
            removeScreenEffect(id);
        }
    }

    const clearScreenEffectsTimeout = (id) => {
        if (!screenEffects[id].timeout) {
            return
        }

        clearTimeout(screenEffects[id].timeout);
        screenEffects[id].timeout = null;
    };

    const removeScreenEffect = (id) => {
        clearScreenEffectsTimeout(id);
        removeScreen(id);

        delete screenEffects[id];
    };

    const checkScreenEffect = (id) => {
        return screenEffects[id] ? true : false
    };


    const getScreenEffects = () => {
        return screenEffects
    }

    this.init                   = init;
    this.callSrajFromTemplate   = callSrajFromTemplate;
    this.getScreenEffects       = getScreenEffects;
    this.parseJSONRajController = parseJSONRajController;

}