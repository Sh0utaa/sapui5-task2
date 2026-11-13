sap.ui.define([
    "project1/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("project1.controller.Products.v2", {
        onInit() {},

        onDeleteProduct() {
            const oTable = this.byId("odatav2-table");

            const aSelectedObjects = oTable.getSelectedItems();

            const aContexts = aSelectedObjects.map(obj => 
                obj.getBindingContext("odatav2")
            );
            const sGroupId = "deleteProducts";

            if(aContexts.length === 0) {
                MessageBox.error(this.getText("productsDeleteNoSelection"));
                return;
            }
            
            const aPromises = aContexts.map((oContext) => oContext.delete({ groupId: sGroupId }));

            Promise.all(aPromises)
            .then(() => {
                MessageToast.show(this.getText("productsDeleteSuccess"));
                oTable.removeSelections(true);
            })
            .catch((oError) => {
                MessageBox.error(this.getText("productsDeleteError"));
                console.error(oError);
            });
        }
    });
});