sap.ui.define([
    "project1/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("project1.controller.ProductsV4", {

        onDeleteProduct() {
            const oModel = this.getModel("odatav4");
            const oTable = this.byId("odatav4-table");
            const aSelectedContexts = oTable.getSelectedContexts();
            const sGroupId = "deleteBatch";

            if(aSelectedContexts.length === 0) {
                MessageBox.error(this.getText("productsDeleteNoSelection"));
                return;
            }

            aSelectedContexts.forEach((oContext) =>  oContext.delete(sGroupId));

            oModel.submitBatch(sGroupId)
                .then(() => {
                    MessageToast.show(this.getText("productsDeleteSuccess"));
                    oTable.removeSelections(true);
                })
                .catch((oError) => {
                    console.error(oError);
                });
        }
    });
});