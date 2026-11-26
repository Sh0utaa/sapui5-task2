sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/core/mvc/XMLView"
    ], (BaseController, XMLView ) => {
    "use strict";

    const mTabs = {
        "json-model": "TargetJSON",
        "odata-v2": "TargetV2",
        "odata-v4": "TargetV4" 
    };

    return BaseController.extend("project1.controller.Main", {

        onInit() {
            this._mLoaded = {};

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("tab").attachMatched(this._onTabMatched, this);
        },

        _onTabMatched(oEvent) {
            const sKey = oEvent.getParameter("arguments").tabKey;
            this.byId("iconTabBar").setSelectedKey(sKey);

            this._loadTab(sKey);
        },

        _loadTab(sKey) {
            const sTarget = mTabs[sKey];

            if(!sTarget) {
                console.error(`Tab for '${sKey}' doesn't exist.`);
                return;
            }

            if(this._mLoaded[sKey]) return;
            this._mLoaded[sKey] = true;
            
            this.getOwnerComponent().getRouter().getTargets().display(sTarget);
        },

        onTabSelect(oEvent) {
            const sKey = oEvent.getParameter("key");
            const oRouter = this.getOwnerComponent().getRouter();
            
            oRouter.navTo("tab", {tabKey: sKey});
        }
    });
});