function AuctionTemplates () {

    let templates = {};

    const init = () => {
        initTemplates();
    }

    const initTemplates = () => {
        templates['auction-window'] = `
        <div class="auction-window">
            <div class="auction-title"></div>
            <div class="amount-of-auction"></div>
            <div class="auction-close-button"></div>
            <!--<div class="middle-graphic"></div>-->

            <div class="left-column-auction">
                <div class="auction-switch-wrapper"></div>
                <div class="cards-header-wrapper">
                    <div class="header-background-graphic"></div>
                    <div class="cards-header"></div>
                </div>
                <div class="all-categories-auction"></div>
            </div>
            


            <div class="main-column-auction">
                <div class="all-auction-info-wrapper">
                    <div class="all-auction-info"></div>
                </div>
                <div class="all-auction-section section middle">
                    <table class="auction-table-header"></table>
                    <div class="scroll-wrapper main-all-auction-scroll classic-bar">
                        <div class="scroll-pane">
                            <table class="auction-table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        templates['card'] = `<div class="card">
        <div class="label">
            <div class="number"></div>
            <div class="icons">
                <div class="cl-icon icon-soulbound"></div>
            </div>
        </div>
        <div class="amount"></div>
    </div>`;

        templates['auction-off-item-panel'] = `
                <div class="auction-off-item-panel">
                    <div class="auction-off-item-panel-header"></div>
                    <div class="auction-off-item-panel-close"></div>
                    <div class="auction-off-item-panel-wrapper">
                        <div class="item-slot-wrapper">
                            <div class="item-slot"></div>
                        </div>
                        <div class="all-field">
                            <div class="one-record auction-bid"><div class="label"></div></div>
                            <div class="one-record auction-additional-gold-payment"><div class="label"></div></div>
                            <div class="one-record auction-buy-now"><div class="label"></div><div class="info-icon buy-info-icon"></div></div>
                            <div class="one-record auction-duration"><div class="label"></div><div class="h-char">h</div></div>
                        </div>
                        <div class="one-info special-offer"></div>
                        <div class="one-info auction-tax"><span class="first-span tax-label"></span><span class="second-span tax-val"></span></div>
                        <div class="one-info auction-cost">
                            <span class="first-span cost-label"></span>
                            <span class="second-span currency-icons"></span>
                        </div>
                    </div>
                    <div class="auction-off-btn-wrapper"></div>
                </div>
        `

        templates['auction-search-item'] = `<div class="auction-search-item top">
            <div class="item-lvl-wrapper">
                <div class="between-arrow"></div>
            </div>
            <div class="item-price-wrapper">
                <div class="between-arrow"></div>
            </div>

            <div class="item-name-wrapper"></div>
            <div class="refresh-button-wrapper"></div>

            <div class="all-menu-wrapper">
                <div class="auction-type-wrapper">
                    <select class="menu-wrapper menu default"></select>
                </div>
                <div class="item-rarity-wrapper">
                    <select class="menu-wrapper menu default"></select>
                </div>
                <div class="item-prof-wrapper">
                    <select class="menu-wrapper menu default"></select>
                </div>
            </div>

        <!--<div class="third-column-bar-search column-bar-search  menu-bar-search">-->
            <!--<div class="new-filter-wrapper one-record one-line">-->
                <!--<div class="menu-wrapper menu default"></div>-->
            <!--</div>-->
            <!--<div class="refresh-button-wrapper"></div>-->
        <!--</div>-->

    </div>`;

        templates['drop-down-menu-section'] =
          `<div class="drop-down-menu-section">
        <div class="type-header">
            <div class="type-header-label"></div>
        </div>
        <div class="state-of-type up-arrow"></div>
        <div class="content-wrapper">
            <div class="item-category-wrapper">

            </div>
        </div>
      </div>`;

        templates['action-menu-item'] =`
        <div class="action-menu-item">
            <div class="label"></div>
        </div>
    `

        templates['one-category-auction'] =
          `<div class="one-category-auction">
        <div class="icon"></div>
      </div>`;

        templates['one-category-auction'] =
          `<div class="one-category-auction">
        <div class="icon"></div>
      </div>`;

        templates['auction-but'] = `<div class="auction-but">
        <div class="label"></div>
    </div>`;

        templates['auction-cost-ceil'] = `
        <div class="auction-cost-ceil">
            <div class="auction-cost-label"></div>
            <div class="auction-cost-btn-wrapper"></div>
        </div>`;

        templates['auction-input-cost-ceil'] = `
        <div class="auction-input-cost-ceil">
            <input class="default input-cost"/>
            <div class="own-input-cost"></div>
            <span class="auction-cost-currency"></span>
            <div class="auction-cost-btn-wrapper"></div>
        </div>`;
    }

    const get = (key) => {
        if (!templates[key]) {
            console.error('Templates not exist!', key);
            return
        }

        return $(templates[key]);
    }



    this.get = get;
    this.init = init;
}
