function nightController () {

    let rayData = null;

    const init = () => {

    }

    const updateData = (_rajData) => {
        let nightData = _rajData.night;

        onClear();

        //if (nightData.action == "REMOVE") {
        //    setRayData(null);
        //    onClear();
        //}

        //if (nightData.action == "CREATE") {
            setRayData(_rajData);
            //onClear();

            if (nightData.dayNightCycle) return;

            //if (Engine.opt(11)) return;
            //if (get_config_opt(11)) return;
            if (!g.settingsOptions.isCycleDayAndNightOn()) return;

            createNight(_rajData.night);
        //}
    }



    const onClear = () => {
        $('.nightfilterwrapper').remove();
    }

    const setRayData = (_rayData) => {
        rayData = _rayData
    };

    const createNight = (v) => {
        if (!checkFilterDataCorrect(v)) return;

        onClear();

        if (isset(v.remove)) return;

        var w       = $('#ground').width();
        var h       = $('#ground').height();
        var nbase   = $('<div class="nightfilterwrapper"></div>');

        nbase.css({
            width       : w,
            height      : h,
            background  : `rgba(${v.color.r},${v.color.g},${v.color.b},${v.color.a})`,
            zIndex      : getLayerOrder(map.y, 11)
        });

        $("#base").append(nbase);
    }

    const rebuiltAfterSettingsSave = () => {
        if (rayData == null) return

        updateData(rayData)
    }



    this.init = init;
    this.updateData = updateData;
    this.rebuiltAfterSettingsSave = rebuiltAfterSettingsSave;
}