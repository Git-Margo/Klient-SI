
function OneBuild () {

    let id;
    let name;
    let icon;
    let items;
    let itemsIds;
    let skillsLearnt;
    let skillsTotal;
    let $build;

    const init = (data, fullOptions) => {
        createBuild(data, fullOptions);
        setItemsByBuildId([0,0,0,0,0,0,0,0]);
    };

    const createBuild = (data, fullOptions) => {
        $build      = getEngine().buildsManager.getBuildsTemplates().getOneBuild();
        id          = data.id;


        $build.find(".build-index").html(goldTxt(parseInt(id)));
        $build.find(".build-name").html(goldTxt(''));

        if (fullOptions) {
            let $buildName = $build.find(".build-name");

            //$buildName.on('contextmenu', function (e) {
            //    clickEditName(e)
            //});

            //$buildName.tip(_t("change_build_name_tip", null, "builds"));
            createButtonEditName()
        }

        $build.find('.build-click-area').on('click', function () {
            clickBuild();
        });
    };

    const createButtonEditName = () => {
        let str = _t('change_name_tip', null, "builds");
        let editName = createButton(str, ['small', 'green'],  (e) => {
            clickEditName(e)
        });

        let $button = $(editName);

        $build.find('.build-edit-name-button-wrapper').append($button)
    };

    const update = (data) => {
        if (isset(data.name))       updateNameBuild(data);
        if (isset(data.iconId))     updateIconBuild(data);
        if (isset(data.items))      updateItemsBuild(data);
        if (isset(data.skillsLearnt) && isset(data.skillsTotal)) updateSkillsLeftBuild(data);
    };

    const updateNameBuild = (data) => {
        name = data.name;

        //$build.find(".build-name").html(getEngine().buildsManager.changeDefaultNameIfExist(name));

        let $e  = $build.find(".build-name");
        let v   = getEngine().buildsManager.changeDefaultNameIfExist(name);

        updateGoldTxt($e, v)
    };

    const updateIconBuild = (data) => {
        icon = data.iconId;
        $build.find(".build-icon").attr("icon-id", icon);
    };

    const updateItemsBuild = (data) => {
        let newItems        = data.items;

        setItemsByBuildId(newItems);
    };

    const setItemsByBuildId = (newItemsArray) => {
        items     = newItemsArray;
        itemsIds  = {};

        for (let st in newItemsArray) {

            let newItemId = newItemsArray[st];

            if (newItemId != 0) {
                itemsIds[newItemId] = st;
            }
        }
    };

    const updateSkillsLeftBuild = (data) => {
        skillsLearnt    = data.skillsLearnt;
        skillsTotal     = data.skillsTotal;

        $build.find(".build-skills-left").html(skillsLearnt + "/" + skillsTotal).tip(_t("skills_status", null, "builds"));
    };

    const get$build = () => {
        return $build;
    };

    const getItemsIds = () => {
        return itemsIds;
    };

    const clickBuild = () => {
        getEngine().buildsManager.getBuildsRequests().setCurrentBuildId(id);
    };

    const clickEditName = (e) => {

        mAlert(_t('give_new_build_name', null, 'builds'), 3,
            [function(){
                let val = $('input[name="mAlertInput"]').val();

                getEngine().buildsManager.getBuildsRequests().setNameInBuild(esc(val), id)
            },
                function(){

                }
            ]
        );

    };

    const getName = () => {
        return name;
    }

    const getData = () => {
        return {
            id : id,
            name: name,
            iconId: icon,
            items: items,
            skillsLearnt: skillsLearnt,
            skillsTotal: skillsTotal
        }
    };


    this.init           = init;
    this.update         = update;
    this.get$build      = get$build;
    this.getItemsIds    = getItemsIds;
    this.getData        = getData;
    this.getName        = getName;
};