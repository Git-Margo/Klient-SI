function WindowCloseManager () {

	let list = {};

	const init = () => {

	};

	const callWindowCloseConfig = (windowCloseConfig) => {
		if (!getEngine().windowsData.windowCloseConfig[windowCloseConfig]) {
			console.error('[WindowCloseManager.js, callWindowCloseConfig] That windowCloseConfig not exist!', windowCloseConfig);
			return
		}

		switch (windowCloseConfig) {
			case getEngine().windowsData.windowCloseConfig.CRAFTING:
				defaultWindowsClose();
				break;
			case getEngine().windowsData.windowCloseConfig.BARTER:
				closeCrafting();
				break;
			case getEngine().windowsData.windowCloseConfig.BONUS_SELECTOR:
				closeAllCrafts();
				break;
			case getEngine().windowsData.windowCloseConfig.DEPO:
				closeAllCrafts();
				break;
			case getEngine().windowsData.windowCloseConfig.AUCTION:
				closeAllCrafts();
				break;
			case getEngine().windowsData.windowCloseConfig.SHOP:
				closeAllCrafts();
				break;
			case getEngine().windowsData.windowCloseConfig.BATTLE:
				closeAllCrafts();
				break;
			case getEngine().windowsData.windowCloseConfig.DIALOGUE:
				closeAllCrafts();
				closeShop();
				break;
			case getEngine().windowsData.windowCloseConfig.MAIL:
				closeAllCrafts();
				break;
			// case getEngine().windowsData.windowCloseConfig.RELOAD:
			// 	closeAllCrafts();
			// 	break;
			case getEngine().windowsData.windowCloseConfig.TRADE:
				closeAllCrafts();
				break;
		}
	};

	const defaultWindowsClose = () => {
		closeShop();
		closeMails();
		closeBarter();
		closeAuction();
		closeDepo();
	};

	const closeShop = () => {
		if (Number(getEngine().shop.id) !== 0) shop_close();
	};

	const closeMails = () => {
		if (getEngine().mails) hideMails();
	};

	const closeBarter = () => {
		if (getEngine().barter) getEngine().barter.close();
	};

	const closeAuction = () => {
		if (getEngine().auctions) getEngine().auctions.close();
	};

	const closeDepo = () => {
		if (getEngine().depo.vis) depoHide();
	};

	const closeCrafting = () => {
		if (getEngine().crafting.opened) getEngine().crafting.close();
	};

	const closeAllCrafts = () => {
		closeCrafting();
		closeBarter();
	};

	const getEngine = () => {
		return g;
	}

	this.init = init;
	this.callWindowCloseConfig = callWindowCloseConfig;
};
