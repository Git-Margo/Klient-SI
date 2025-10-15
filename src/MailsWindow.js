function MailsWindow () {

    let blockGetNextPage = false

    const initScrollBar = () => {
        let el = $('#inbox')[0];

        el.onscroll = function(e) {
            if (!checkIsScrollBottom()) return;

            if (blockGetNextPage) return;

            blockGetNextPage = true;
            setTimeout(() => {
                blockGetNextPage = false
            }, 200);

            scrollMove();
        };
    };

    const scrollMove = () => {
        g.mailsPages.getNextPageAction();
    }

    const checkIsScrollBottom = () => {
        let el = $('#inbox')[0];

        return el.scrollTop + el.offsetHeight >= el.scrollHeight - 1 && el.scrollTop + el.offsetHeight <= el.scrollHeight + 1;
    };

    const scrollTop = () => {
        let el = $('#inbox')[0];
        el.scrollTo({
            top: 0,
            left: 0
        });
    };

    const stopDragBar = () => {
        let el = $('#inbox')[0];
        el.scrollTo({
            top : el.scrollTop,
            left: 0
        });
    };


    this.initScrollBar = initScrollBar;
    this.scrollMove = scrollMove;
    this.checkIsScrollBottom = checkIsScrollBottom;
    this.scrollTop = scrollTop;
    this.stopDragBar = stopDragBar;

}
