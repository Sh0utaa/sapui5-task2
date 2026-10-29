sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project1.controller.BaseController", {
        getModel(sName) {
            return this.getView().getModel(sName);
        },

        getResourceBundle() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        toggleEditMode: function (oEvent, sModelName) {
            var oContext = oEvent.getSource().getBindingContext(sModelName);
            var oModel   = oContext.getModel();
            var sPath    = oContext.getPath() + "/editMode";

            oModel.setProperty(sPath, !oModel.getProperty(sPath));
        }
    });
});