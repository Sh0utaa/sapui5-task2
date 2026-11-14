sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, JSONModel, MessageToast, MessageBox) => {
    "use strict";
    const sGroupId = "productsGroupId";

    return BaseController.extend("project1.controller.Products.v2", {
        onInit() {
            const oModel = this.getOwnerComponent().getModel("odatav2");

            const aDeferredGroups = oModel.getDeferredGroups();
            oModel.setDeferredGroups(aDeferredGroups.concat([sGroupId]));
        },

        async showProductDialog() {
            if(this.oProductDialog === undefined || this.oProductDialog === null) {
                this.oProductDialog = await this.loadFragment({
                    name: "project1.view.fragments.AddProductDialog"
                });

                const oProductModel = new JSONModel();

                oProductModel.setData({
                    Name: "Pencil",
                    Description: "Normal wooden pencil for writing",
                    ReleaseDate: "1999-12-12",
                    DiscontinuedDate: "2008-02-03",
                    Rating: "8.56",
                    Price: "1.99"
                });

                this.oProductDialog.setModel(oProductModel, "productModel");
            }

            this.oProductDialog.open();
        },

        closeProductDialog() {
            this.oProductDialog.close();
        },

        onAddProduct() {
            const oModel = this.getOwnerComponent().getModel("odatav2");
            const oProductModel = this.oProductDialog.getModel("productModel");
            const oItemsBinding = this.getView().byId("odatav2-table").getBinding("items");
            const oFormData = oProductModel.getData();
            
            const oData = {
                Name: oFormData.Name,
                Description: oFormData.Description,
                ReleaseDate: new Date(oFormData.ReleaseDate),
                DiscontinuedDate: new Date(oFormData.DiscontinuedDate),
                Rating: oFormData.Rating,
                Price: oFormData.Price
            };

            oItemsBinding.create(oData, false, {
                success: () => {
                    MessageToast.show("Created Product");
                    oProductModel.setData({});
                },
                error: (oError) => {
                    MessageBox.error("Failed to Create Product");
                    console.log(oError);
                },
                groupId: sGroupId 
            });

            oModel.submitChanges({ groupId: sGroupId });

            this.closeProductDialog();
        },

        onDeleteProduct() {
            const oModel = this.getOwnerComponent().getModel("odatav2");
            const oTable = this.byId("odatav2-table");

            const aSelectedObjects = oTable.getSelectedItems();

            const aContexts = aSelectedObjects.map(obj => 
                obj.getBindingContext("odatav2")
            );

            if(aContexts.length === 0) {
                MessageBox.error(this.getText("productsDeleteNoSelection"));
                return;
            }
            
            const aPromises = aContexts.map((oContext) => oContext.delete({ groupId: sGroupId }));

            oModel.submitChanges({groupId: sGroupId});

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