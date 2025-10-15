function MailsPages () {

    let currentPage         = null;
    let maxPage             = null;

    const checkCanGetNextPage = () => {
        if (currentPage === null)    return false;
        if (maxPage === null)        return false;

        return currentPage !== maxPage;
    };

    const getNextPageAction = () => {
        if (!checkCanGetNextPage()) return;

        let nextPage    = currentPage + 1;
        getNextPageRequest(nextPage, () => {
            g.mailsWindow.stopDragBar();
        })
    };

    const updatePages = (v) => {
        currentPage = v.number;
        maxPage     = v.total;
    };

    const getMaxPage = () => {
        return maxPage;
    };

    const getCurrentPage = () => {
        return currentPage
    };

    const getNextPageRequest = (nextPage, clb) => {
        const request     = `mail&page=${nextPage}`;

        _g(request, () => {
            clb()
        });
    }

    this.updatePages = updatePages;
    this.getCurrentPage = getCurrentPage;
    this.getMaxPage = getMaxPage;
    this.getNextPageAction = getNextPageAction;

}
