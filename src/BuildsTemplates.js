function BuildsTemplates () {

    const init = () => {

    }


    const getBuildsWindow = () => {
        return $(`
        <div class="builds-window">

            <div class="builds-title"></div>
            <div class="builds-close-button"></div>
            <div class="scroll-wrapper classic-bar">
                <div class="window-wood-background"></div>
                <div class="scroll-pane">

                </div>
            </div>
        </div>
        `)
    }

    const getOneBuild = () => {
        return $(`
        <div class="one-build">
            <div class="build-click-area">
                <div class="build-name-wrapper">
                    <div class="build-number"></div>
                    <div class="build-name"></div>
                </div>
                <div class="build-icon-wrapper">
                    <div class="build-icon"></div>
                </div>
                <div class="build-items-wrapper">
                    <div class="items"></div>
                    <div class="build-index-wrapper">
                        <div class="build-index"></div>
                    </div>
                </div>
            </div>
            <div class="build-skills-left-wrapper">
                <div class="build-skills-left"></div>
            </div>
            <div class="build-edit-name-button-wrapper"></div>
        </div>
        `)
    }

    const getOneBuildToBuy = () => {
        return $(`
        <div class="one-build-to-buy">
            <div class="build-name-wrapper">
                <div class="build-name"></div>
            </div>
            <div class="build-items-wrapper">
                <div class="items"></div>
            </div>
            <div class="build-overlay"></div>
            <div class="build-buttons-wrapper"></div>
        </div>
        `);
    }

    this.init               = init;
    this.getBuildsWindow    = getBuildsWindow;
    this.getOneBuild        = getOneBuild;
    this.getOneBuildToBuy   = getOneBuildToBuy;

}