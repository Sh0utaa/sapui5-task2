sap.ui.define([
    "project1/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("project1.controller.Products.v2", {
        onInit() {},

        // ODATAV2
        onDeleteProduct() {
            const oModel = this.getOwnerComponent().getModel("odatav2");
            const oTable = this.byId("odatav2-table");

            const aSelectedObjects = oTable.getSelectedItems();

            const aPaths = aSelectedObjects.map(obj => 
                obj.getBindingContext("odatav2").getPath()
            );
            const sGroupId = "deleteProducts";

            if(aPaths.length === 0) {
                MessageBox.error(this.getText("productsDeleteNoSelection"));
                return;
            }
            
            aPaths.forEach((sPath) => {
                oModel.remove(sPath, {
                    groupId: sGroupId,
                    success: () => {
                        MessageToast.show(this.getText("productsDeleteSuccess"));
                    },
                    error: () => {
                        MessageBox.error(this.getText("productsDeleteError"));
                    }
                }); 
            });

            oTable.removeSelections(true);
        }
    });
});