sap.ui.define([
    "project1/controller/BaseController" ], (BaseController) => {
    "use strict";

    return BaseController.extend("project1.controller.Main", {

        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("tab").attachMatched(this._onTabMatched, this);
        },

        _onTabMatched(oEvent) {
            const sKey = oEvent.getParameter("arguments").tabKey;
            this.byId("iconTabBar").setSelectedKey(sKey);
        },

        onTabSelect(oEvent) {
            const sKey = oEvent.getParameter("key");
            const oRouter = this.getOwnerComponent().getRouter();
            
            oRouter.navTo("tab", {tabKey: sKey});
        }
    });
});