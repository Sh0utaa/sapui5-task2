sap.ui.define([], () => {
    "use strict";

    return {
        displayPublishedYear: function(sDate) {
            return this.getText("published", [sDate.substring(0,4)]);
        }
    };
});