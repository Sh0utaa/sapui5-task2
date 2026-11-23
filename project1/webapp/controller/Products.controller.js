sap.ui.define([
    "project1/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, MessageToast, MessageBox) => {
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
                    name: "project1.view.fragments.ProductDialog"
                });
            }

            const oModel = this.getOdataV2();
            const oContext = oModel.createEntry("/Products");

            this.oProductDialog.setBindingContext(oContext, "odatav2");

            this.oProductDialog.open();
        },

        async onCancelProduct() {
            const oModel = this.getOdataV2();
            const oContext = this.oProductDialog.getBindingContext("odatav2");

            if(oContext) {
                await oModel.resetChanges([oContext.getPath()]);
            }

            this.oProductDialog.close();
        },

        onSaveProduct() {
            const oModel = this.getOwnerComponent().getModel("odatav2");
            const oContext = this.oProductDialog.getBindingContext("odatav2");

            const oFormData = oContext.getObject();

            if(!this._validateFormData(oFormData)) return;

            oModel.submitChanges({
                success: () => {
                    MessageToast.show(this.getText("productCreateSuccess"));
                },
                error: (oError) => {
                    MessageBox.error(this.getText("productCreateError"));
                    console.log(oError);
                }
            });

            this.onCancelProduct();
        },

        _validateFormData(oFormData) {
            const iMin = 3;
            const iMax = 50;

            // validate empty fields
            const oIdObj = {
                Name: "o2Name",
                Description: "o2Description",
                ReleaseDate: "o2ReleaseDate",
                DiscontinuedDate: "o2DiscontinuedDate",
                Rating: "o2ProductRating",
                Price: "o2ProductPrice"
            };

            const aKeys = Object.keys(oIdObj);

            let bIsValid = true;
            for(let i = 0; i < aKeys.length; i++) {
                const sProductKey = aKeys[i];
                const oInput = this.byId(oIdObj[sProductKey]);

                if(!(sProductKey in oFormData) || oFormData[sProductKey] === "") {
                    oInput.setValueState("Error");
                    oInput.setValueStateText(this.getText("productEmptyProductsError"));

                    bIsValid = false;
                } else {
                    oInput.setValueState("None");
                }
            }

            if(!bIsValid) {
                MessageBox.error(this.getText("emptyFields"));
                return false;
            }

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
            if (sRating === "" || isNaN(iRating) || iRating <= 0 || iRating > 10) {
                MessageBox.error(this.getText("productRatingError"));
                return false;
            }

            const sPrice = oFormData.Price.trim();
            const fPrice = Number(sPrice);
            if (sPrice === "" || isNaN(fPrice) || fPrice < 0) {
                MessageBox.error(this.getText("productPriceError"));
                return false;
            }

            return true;
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