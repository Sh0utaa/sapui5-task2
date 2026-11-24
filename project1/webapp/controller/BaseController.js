sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("project1.controller.BaseController", {
        getModel(sName) {
            return this.getView().getModel(sName);
        },

        getText(sKey, aPlaceholders) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey, aPlaceholders);
        },

        validateLength(sKey, sValue, iMin, iMax) {
                if(sValue.length < iMin || sValue.length > iMax) {
                    MessageBox.error(
                        this.getText(
                            "validateLength",
                            [this.getText(sKey), iMin, iMax]
                        )
                    );

                    return false;
                }

                return true;
        }
    });
});