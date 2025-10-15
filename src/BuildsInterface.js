function BuildsInterface () {

    const moduleData = {fileName:"BuildsInterface.js"};

    let buildsData      = null;
    let buildsActive    = false;

    const init = () => {
        initBuildsData();
        initClick();
        initContextMenu();
        initGoldText();
    };

    const initGoldText = () => {
        let $buildsInterface = $('.builds-interface')
        $buildsInterface.find('.choose-build').html(goldTxt(''));
    }

    const setBuildsActive = (state) => {
        buildsActive = state;
    };

    const initBuildsData = () => {
        buildsData = {};
    };

    const initClick = () => {
        let $buildsInterface = $('.builds-interface')

        $buildsInterface.on('click', function () {
            getEngine().buildsManager.getBuildsWindow().managePanelVisible();
        })
    };

    const initContextMenu = () => {
        let $buildsInterface = $('.builds-interface')

        $buildsInterface.on('contextmenu', function (e) {
            let buildsWindow    = getEngine().buildsManager.getBuildsWindow();
            let currentId       = buildsWindow.getCurrentId();
            let menu            = [];

            if (!lengthObject(buildsData)) {
                //console.log('object empty!');
                return
            }


            for (let id in buildsData) {
                if (id == currentId) {
                    continue;
                }

                let menuElement = createMenuElement(buildsData[id], id);
                menu.push(menuElement);
            }


        })
    };

    const createMenuElement = (oneBuildData, id) => {
        let name = getEngine().buildsManager.changeDefaultNameIfExist(oneBuildData.name)
        return [(parseInt(id)) + ". " + name, function () {

            getEngine().buildsManager.getBuildsRequests().setCurrentBuildId(id);
        }];
    };

    const updateList = (list) => {
        for (let k in list) {

            let e               = list[k];
            let id              = e.id;
            let oneBuildData    = getBuildData(id);

            if (!oneBuildData) {
                oneBuildData = {
                    name: null,
                    icon: null
                };

                addBuildData(id, oneBuildData)
            }

            if (e.name) oneBuildData.name = e.name;
            if (e.icon) oneBuildData.icon = e.icon;
        }
    };

    const updateCurrentId = (currentId) => {

        if (!buildsActive) {
            setBuildsActive(true);
            //showBuildsInterface();
        }

        setCurrentIdInHtmlElement(currentId);
    };

    const setCurrentIdInHtmlElement = (currentId) => {
        let oneBuildData        = getBuildData(currentId);
        let $buildsInterface    = $('.builds-interface')
        let chooseBuild         = parseInt(currentId);
        let currentName         = getEngine().buildsManager.getBuildsWindow().getCurrentName();
        let name                = getEngine().buildsManager.changeDefaultNameIfExist(currentName);

        if (!oneBuildData) {
            errorReport(moduleData.fileName, "updateCurrentId", "buildData not exist", currentId);
            return;
        }

        updateGoldTxt($buildsInterface.find('.choose-build'), chooseBuild);
        $buildsInterface.tip(_t("choose_build_SI", {'%id%': name}, "builds"));
    };

    const getBuildData = (id) => {
        return buildsData[id];
    };

    const addBuildData = (id, oneBuildData) => {
        return buildsData[id] = oneBuildData ;
    };



    this.init               = init;
    this.updateList         = updateList;
    this.updateCurrentId    = updateCurrentId;
};