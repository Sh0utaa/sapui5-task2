sap.ui.define([
    "project1/controller/BaseController"
], (BaseController) => { 
    "use strict"; 

    return BaseController.extend("project1.controller.Product", {

        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();

            oRouter.getRoute("product").attachMatched(this._onObjectMatched, this);
        },

        _onObjectMatched(oEvent) {
            const sProductID = oEvent.getParameter("arguments").productID;
            const sPath = `/Products(${sProductID})`;

            this.getView().bindElement({
                path: sPath,
                model: "odatav2",
                parameters: {
                    expand: "Supplier"
                }
            });
        }
    });
});