sap.ui.define([], () => {
    "use strict";

    return {
        displayPublishedYear: function(sDate) {
            return `Published: {${sDate.substring(0,4)}}`;
        }
    };
});