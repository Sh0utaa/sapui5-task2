sap.ui.define([
    "project1/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("project1.controller.ProductsV4", {

        async onDeleteProduct() {
            const oTable = this.byId("odatav4-table");
            const aSelectedContexts = oTable.getSelectedContexts();

            if(aSelectedContexts.length === 0) {
                MessageBox.error(this.getText("productsDeleteNoSelection"));
                return;
            }

            try {
                await Promise.all(aSelectedContexts.map((oContext) => oContext.delete("$auto")));
                MessageToast.show(this.getText("productsDeleteSuccess"));
            } catch (oError) {
                MessageBox.error(this.getText("productsDeleteError"));
                console.error(oError);
            }
        }
    });
});