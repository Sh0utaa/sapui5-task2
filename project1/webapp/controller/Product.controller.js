sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/core/routing/History"
], (BaseController, History ) => { 
    "use strict"; 

    return BaseController.extend("project1.controller.Product", {

        onNavBack() {
            const oHistory = History.getInstance();
			const sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				const oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("home", {}, true);
			}
        }

    });
});