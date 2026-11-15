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

                // oProductModel.setData({
                //     Name: "Pencil",
                //     Description: "Normal wooden pencil for writing",
                //     ReleaseDate: "1999-12-12",
                //     DiscontinuedDate: "2008-02-03",
                //     Rating: "8.56",
                //     Price: "1.99"
                // });

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

            if(!this._validateFormData(oFormData)) return;

            const oData = {
                Name: oFormData.Name,
                Description: oFormData.Description,
                ReleaseDate: new Date(oFormData.ReleaseDate),
                DiscontinuedDate: new Date(oFormData.DiscontinuedDate),
                Rating: oFormData.Rating,
                Price: oFormData.Price
            };

            oItemsBinding.create(oData, true, {
                success: () => {
                    MessageToast.show(this.getText("productCreateSuccess"));
                    oProductModel.setData({});
                },
                error: (oError) => {
                    MessageBox.error(this.getText("productCreateError"));
                    console.log(oError);
                },
                groupId: sGroupId 
            });

            oModel.submitChanges({ groupId: sGroupId });

            this.closeProductDialog();
        },

        _validateFormData(oFormData) {
            const iMin = 3;
            const iMax = 50;

            const sName = (oFormData.Name || "").trim();
            if (sName.length < iMin || sName.length > iMax) {
                MessageBox.error(this.getText("validateLength", [this.getText("productFieldName"), iMin, iMax]));
                return false;
            }

            const sDescription = (oFormData.Description || "").trim();
            if (sDescription.length < iMin || sDescription.length > iMax) {
                MessageBox.error(this.getText("validateLength", [this.getText("productFieldDescription"), iMin, iMax]));
                return false;
            }

            const oReleaseDP = this.byId("o2ReleaseDate");
            const dRelease = new Date(oFormData.ReleaseDate);
            if (!oReleaseDP.isValidValue() || !dRelease) {
                MessageBox.error(this.getText("validateDate", [this.getText("productReleaseDate"), iMin, iMax]));
                return false;
            }

            const oDiscontinuedDP = this.byId("o2DiscontinuedDate");
            const dDiscontinued = new Date(oFormData.DiscontinuedDate);
            if (!oDiscontinuedDP.isValidValue() || !dDiscontinued) {
                MessageBox.error(this.getText("validateDate", [this.getText("productDiscontinuedDate"), iMin, iMax]));
                return false;
            }

            if (dDiscontinued < dRelease) {
                MessageBox.error(this.getText("productDateOrderError"));
                return false;
            }

            const sRating = oFormData.Rating.trim();
            const iRating = Number(sRating);
            if (sRating === "" || iRating < 0 || iRating > 10) {
                MessageBox.error(this.getText("productRatingError"));
                return false;
            }

            const sPrice = oFormData.Price.trim();
            const fPrice = Number(sPrice);
            if (sPrice === "" || fPrice < 0) {
                MessageBox.error(this.getText("productPriceError"));
                return false;
            }

            return true;
        },

        onInputChange(oEvent) {
            const oInput = this.byId(oEvent.getSource().getId());
            
            const sValue = oEvent.getParameters().value;
            if(sValue.length < 1) {
                oInput.setValueState("Error");
                oInput.setValueStateText("Can't be left empty.");
            } else {
                oInput.setValueState("None");
            }
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