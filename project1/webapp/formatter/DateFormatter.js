sap.ui.define([], () => {
    "use strict";

    return {
        displayPublishedYear: function(sDate) {
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

            return `${oResourceBundle.getText("published")}: ${sDate.substring(0,4)}`;
        }
    };
});