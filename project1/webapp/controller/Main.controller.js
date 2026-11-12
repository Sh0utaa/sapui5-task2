sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../formatter/DateFormatter"
], (BaseController, 
    JSONModel, 
    Filter, 
    FilterOperator, 
    MessageToast, 
    MessageBox,
    DateFormatter
    ) => {
    "use strict";

    return BaseController.extend("project1.controller.Main", {
        formatter: DateFormatter,

        onInit() {
            const oModel = new JSONModel();

            oModel.setData({
                books: [
                    {
                        ID: "1",
                        Name: "The Left Hand of Darkness",
                        Author: "Ursula K. Le Guin",
                        Genre: "Science Fiction",
                        ReleaseDate: "1969-03-01",
                        AvailableQuantity: 14
                    },
                    {
                        ID: "2",
                        Name: "Pride and Prejudice",
                        Author: "Jane Austen",
                        Genre: "Romance",
                        ReleaseDate: "1813-01-28",
                        AvailableQuantity: 3
                    },
                    {
                        ID: "3",
                        Name: "The Name of the Rose",
                        Author: "Umberto Eco",
                        Genre: "Historical Mystery",
                        ReleaseDate: "1980-09-15",
                        AvailableQuantity: 27
                    },
                    {
                        ID: "4",
                        Name: "Sapiens: A Brief History of Humankind",
                        Author: "Yuval Noah Harari",
                        Genre: "Non-fiction",
                        ReleaseDate: "2011-06-04",
                        AvailableQuantity: 0
                    },
                    {
                        ID: "5",
                        Name: "Neuromancer",
                        Author: "William Gibson",
                        Genre: "Cyberpunk",
                        ReleaseDate: "1984-07-01",
                        AvailableQuantity: 8
                    }
                ],
                document: {
                    hasSelected: false
                },
                filter: {
                    query: "",
                    genre: "all"
                },
                recordId: 5
            });
        
            this.getView().setModel(oModel, "books");

            this._updateGenres();
        },

        onAddRecord() {
            const oModel = this.getModel("books");
            const oRecordModel = this.oRecordDialog.getModel("recordModel");

            const aBooks = oModel.getProperty("/books");
            const oUserRecord = oRecordModel.getProperty("/");

            const id = Number(oModel.getProperty("/recordId")) + 1;
            oModel.setProperty("/recordId", id);

            const name = oUserRecord.name?.trim();
            const author = oUserRecord.author?.trim();
            const genre = oUserRecord.genre?.trim();
            const releaseDate = oUserRecord.releaseDate;
            const availableQuantity = oUserRecord.availableQuantity;

            const oDP = this.byId("releaseDatePicker");

            // form validation
            if (!name || !author || !genre || !releaseDate) {
                MessageBox.error(this.getText("emptyFields"));
                return;
            }

            const _validateLength = (sKey, sValue, iMin, iMax) => {
                if(sValue.length < iMin || sValue.length > iMax) {
                    MessageBox.error(
                        this.getText(
                            "fieldLength",
                            [this.getText(sKey), iMin, iMax]
                        )
                    );

                    return false;
                }

                return true;
            };
 
            const iMinLen = 3;
            const iMaxLen = 5;
 
            if(!_validateLength("fieldBook", name, iMinLen, iMaxLen)) return;
            if(!_validateLength("fieldAuthor", author, iMinLen, iMaxLen)) return;
            if(!_validateLength("fieldGenre", genre, iMinLen, iMaxLen)) return;

            if(!oDP.isValidValue() || releaseDate.length === 0) {
                MessageBox.error(this.getText("validDate"));
                return;
            }

            if(availableQuantity < 0) {
                MessageBox.error(this.getText("quantityCount"));
                return;
            }

            if(availableQuantity === "" || isNaN(Number(availableQuantity))) {
                MessageBox.error(this.getText("quantityQuality"));
                return;
            }

            const oNewBook = {
                ID: id,
                Name: name,
                Author: author,
                Genre: genre,
                ReleaseDate: releaseDate,
                AvailableQuantity: availableQuantity
            };

            aBooks.push(oNewBook);
            oModel.setProperty("/books", aBooks);
            oRecordModel.setProperty("/", {availableQuantity: 0});

            this._updateGenres();

            this.onCloseRecordDialog();
        },
        
        async onAddRecordDialogPress() {

            if(this.oRecordDialog === null || this.oRecordDialog === undefined) {
                this.oRecordDialog = await this.loadFragment({
                    name: "project1.view.fragments.AddRecordDialog"
                });

                const oRecordModel = new JSONModel();

                oRecordModel.setData({
                    availableQuantity: 0
                });

                this.oRecordDialog.setModel(oRecordModel, "recordModel");
            }

            this.oRecordDialog.open();
        },

        onCloseRecordDialog() {
            this.oRecordDialog.close();
        },

        onDeleteRecord() {
            // this.getModel method is from teh BaseController
            const oModel = this.getModel("books");
            const aBooks = oModel.getProperty("/books");
            const oTable = this.byId("booksTable");

            // message toast showing up if there's nothing selected (overridden by disabled button)
            const aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageToast.show(this.getText("selectRecordFirst"));
                return;
            }

            const aSelectedBooks = oTable.getSelectedItems().map(oItem =>
                oItem.getBindingContext("books").getObject()
            );

            const aRemaining = aBooks.filter(oBook => !aSelectedBooks.includes(oBook));

            oModel.setProperty("/books", aRemaining);
            oTable.removeSelections();

            oModel.setProperty("/document/hasSelected", false);
            this._updateGenres();
        },

        onConfirmationMessageBoxPress () {
            MessageBox.confirm("Are you sure you want to delete selected records?", {
                emphasizedAction: MessageBox.Action.OK,
                icon: MessageBox.Icon.WARNING,
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        this.onDeleteRecord();
                    }
                }
            });
        },

        onFilter() {
            const oModel = this.getModel("books");
            const sQuery = oModel.getProperty("/filter/query");
            const sGenre = oModel.getProperty("/filter/genre");
            const aFilters = [];

            if (sQuery) {
                aFilters.push(new Filter("Name", FilterOperator.Contains, sQuery));
            }
            if (sGenre !== "all") {
                aFilters.push(new Filter("Genre", FilterOperator.EQ, sGenre));
            }

            this.byId("booksTable").getBinding("items").filter(aFilters);
        },

        _updateGenres() {
            const oModel = this.getModel("books");
            const aBooks = oModel.getProperty("/books");

            const aGenres = [...new Set(aBooks.map(oBook => oBook.Genre))]
                .sort()
                .map(sGenre => ({ key: sGenre, name: sGenre }));

            aGenres.unshift({ key: "all", name: this.getText("allGenres") });

            oModel.setProperty("/genres", aGenres);
        },

        onSelectionChange() {
            const bHasSelected = this.byId("booksTable").getSelectedItems().length > 0;
            this.getModel("books").setProperty("/document/hasSelected", bHasSelected);
        },

        onEditTitle(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("books");
            const oModel = oContext.getModel();
            const sPath = oContext.getPath() + "/editMode";

            const oProp = oModel.getProperty(sPath);

            oModel.setProperty(sPath, oProp === undefined || oProp === false ? true : false);

        },

        // ODATAV2
        onDeleteProduct() {
            const oModel = this.getOwnerComponent().getModel("odatav2");
            const oTable = this.byId("odatav2-table");

            const aSelectedObjects = oTable.getSelectedItems();

            const aPaths = aSelectedObjects.map(obj => 
                obj.getBindingContext("odatav2").getPath()
            );

            if(aPaths.length === 0) {
                MessageBox.error(this.getText("productsDeleteNoSelection"));
                return;
            }
            
            aPaths.forEach((sPath) => {
                oModel.remove(sPath, {
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