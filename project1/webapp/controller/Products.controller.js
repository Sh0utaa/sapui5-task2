sap.ui.define([
    "project1/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, MessageToast, MessageBox) => {
    "use strict";
    const sGroupId = "deleteProducts";

    return BaseController.extend("project1.controller.Products.v2", {
        onInit() {
            const oModel = this.getOwnerComponent().getModel("odatav2");

            const aDeferredGroups = oModel.getDeferredGroups();
            oModel.setDeferredGroups(aDeferredGroups.concat([sGroupId]));
        },

        onDeleteProduct() {
            const oModel = this.getView().getModel("odatav2");
            const oTable = this.byId("odatav2-table");

            const aContexts = oTable.getSelectedContexts();

            if(aContexts.length === 0) {
                MessageBox.error(this.getText("productsDeleteNoSelection"));
                return;
            }
            
            aContexts.map((oContext) => oContext.delete({ groupId: sGroupId }));

            oModel.submitChanges({groupId: sGroupId, 
                success: () => {
                    MessageToast.show(this.getText("productsDeleteSuccess"));
                    oTable.removeSelections(true);
                },
                error: (oError) => {
                    MessageBox.error(this.getText("productsDeleteError"));
                    console.error(oError);
                }
            });
        }
    });
});