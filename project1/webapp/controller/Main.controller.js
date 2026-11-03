sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (BaseController, 
    JSONModel, 
    Filter, 
    FilterOperator, 
    MessageToast, 
    MessageBox
    ) => {
    "use strict";

    return BaseController.extend("project1.controller.Main", {
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
                addRecordForm: {
                    name: "The Hunger Games",
                    author: "Suzanne Collins",
                    genre: "Science Fiction",
                    releaseDate: "14-09-2008",
                    availableQuantity: 67
                }
            });
        
            this.getView().setModel(oModel, "books");

            this._updateGenres();
        },

        onAddRecord() {
            const oModel = this.getModel("books");
            const aBooks = oModel.getProperty("/books");

            const oUserRecord = oModel.getProperty("/addRecordForm");

            const oNewBook = {
                ID: Math.floor(Math.random() * 99) + 10,
                Name: oUserRecord.name,
                Author: oUserRecord.author,
                Genre: oUserRecord.genre,
                ReleaseDate: oUserRecord.releaseDate,
                AvailableQuantity: oUserRecord.availableQuantity
            };

            aBooks.push(oNewBook);
            oModel.setProperty("/books", aBooks);

            this._updateGenres();

            if(this.oRecordDialog) this.oRecordDialog.close();
        },
        
        async onAddRecordDialogPress() {
            this.oRecordDialog ??= await this.loadFragment({
                name: "project1.view.fragments.AddRecordDialog"
            });
            this.oRecordDialog.open();
        },

        onCloseRecordDialog() {
            if(this.oRecordDialog) this.oRecordDialog.close();
        },

        onDeleteRecord() {
            // this.getModel method is from teh BaseController
            const oModel = this.getModel("books");
            const aBooks = oModel.getProperty("/books");
            const oTable = this.byId("booksTable");

            // message toast showing up if there's nothing selected (overridden by disabled button)
            const aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageToast.show(this.getResourceBundle().getText("selectRecordFirst"));
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

            const oBundle = this.getResourceBundle();
            aGenres.unshift({ key: "all", name: oBundle.getText("allGenres") });

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

            console.log(oContext.getObject());
        } 
    });
});