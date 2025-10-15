function BuildsCommons () {

    let buildList       = null;
    let itemsFetchData  = null;

    const init = (_itemsFetchData) => {

        //initItemsFetch(itemsFetchData);
        clearBuilds();

        itemsFetchData = _itemsFetchData
    }

    const clearBuilds = () => {
        buildList = {};
    }

    const initItemsFetch = () => {
        //Engine.items.fetch(itemsFetchData, newBuildItem);


        for (let idItem in g.item) {
            if (g.item[idItem].loc != "g") continue;

            newBuildItem(g.item[idItem]);
        }
    }

    const clearItemsFetch = () => {
        //Engine.items.removeCallback(itemsFetchData)
    }

    const newBuildItem = (i, finish) => {
        let itemId              = i.id;
        let buildsWithItems     = getItemByIdInBuilds(itemId);

        if (!buildsWithItems) {
            return
        }

        for (let buildId in buildsWithItems) {

            let st              = buildsWithItems[buildId];
            let buildData       = getBuilById(buildId);
            let $oneBuild       = buildData.get$build();
            let $itemsWrapper   = $oneBuild.find(".items");

            createItem(itemId, st, $itemsWrapper)
        }

    };

    const createItem = (id, st, $itemsWrapper) => {
        //let item        = getEngine().items.getItemById(id);
        let item        = g.item[id];
        //let iconData    = Engine.items.createViewIcon(id, Engine.itemsViewData.BUILDS_VIEW);

        if (!item) {
            console.log('none');
            return
        }

        let $icon = item.$item.clone();
        $icon.addClass('item' + id);
        $icon.attr("data-st", parseInt(st) + 1);

        $itemsWrapper.append($icon);
    };

    const getItemByIdInBuilds = (idItem) => {
        let obj = {};

        for (let idBuild in buildList) {

            let st = buildList[idBuild].getItemsIds()[idItem];

            if (isset(st)) {
                obj[idBuild] = st;
            }
        }

        return lengthObject(obj) ? obj : null;
    };

    const getBuilById = (id) => {
        return buildList[id];
    };

    const checkBuildExist = (id) => {
        return buildList[id] ? true : false;
    };

    const addOneBuildToBuildList = (id, oneBuild) => {
        buildList[id] = oneBuild;
    };

    const getCrazyDataToMatchmaking = () => {
        let data = {}
        for (let id in buildList) {
            data[id] = buildList[id].getData();
        }

        return data
    }

    const getAll$builds = () => {
        let a = [];
        for (let id in buildList) {
            let build   = getBuilById(id);
            a.push(build.get$build());
            //$build.removeClass("active")
        }

        return a;
    }


    this.init                           = init;
    this.initItemsFetch                 = initItemsFetch;
    this.clearItemsFetch                = clearItemsFetch;
    this.clearBuilds                    = clearBuilds;

    this.getItemByIdInBuilds            = getItemByIdInBuilds;
    this.getBuilById                    = getBuilById;
    this.checkBuildExist                = checkBuildExist;
    this.getAll$builds                  = getAll$builds;
    this.addOneBuildToBuildList         = addOneBuildToBuildList;
    this.getCrazyDataToMatchmaking      = getCrazyDataToMatchmaking ;
    this.newBuildItem                   = newBuildItem ;

}