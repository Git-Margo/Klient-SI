// let Templates = require('../Templates');

function AuctionCards() {

    // let $auctionContent = null;
    let showCard = 0;

    const init = () => {
        // $auctionContent = _$auctionContent;
        // $auctionContent = Engine.auction.getAuctionWindow().getContent();
    }

    const newCard = ($par, label, clb) => {
        // let $card = g.auctions.getAuctionTemplates().get('card');
        let $card = drawSIButton(label);
        // $card.find('.label').html(label);
        $par.append($card);
        $card.click(function () {

            let index = $(this).index();
            clickCard(index, clb);

        });
    };

    const clickCard = (index, clb) => {
        //let content = g.auctions.getAuctionWindow().getContent();
        setVisible(index);
        //g.auctions.getAuctionWindow().updateScroll();
        // content.find('.edit-header-label').html(label);
        if (clb) clb();
    }

    const setVisible = (index) => {
        let content     = g.auctions.getAuctionWindow().getContent();
        let $allC       = content.find('.cards-header').find('.SI-button').removeClass('active');
        let $bottomBar  = content.find('.bottom-bar');
        let $allS       = content.find('.section').removeClass('visible');

        $allC.eq(index).addClass('active');
        $allS.eq(index).addClass('visible');

        $bottomBar.children().css('display', 'none');
        $bottomBar.children().eq(index).css('display', 'block');
        showCard = index;
    };


    // this.setFirstCard = setFirstCard;
    this.init = init;
    this.clickCard = clickCard;
    this.newCard = newCard;
}