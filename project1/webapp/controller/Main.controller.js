sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("project1.controller.Main", {
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
            ]
            });
        
            this.getView().setModel(oModel, "books");
        },

        onAddRecord() {
            const oModel = this.getView().getModel("books");
            const aBooks = oModel.getProperty("/books");

            const oNewBook = {
                ID: "",
                Name: "",
                Author: "",
                Genre: "",
                ReleaseDate: "",
                AvailableQuantity: 0
            };

            aBooks.push(oNewBook);
            oModel.setProperty("/books", aBooks);
        },

        onDeleteRecord() {
            const oModel = this.getView().getModel("books");
            const aBooks = oModel.getProperty("/books");
            const oTable = this.byId("booksTable");

            const aSelectedBooks = oTable.getSelectedItems().map(oItem =>
                oItem.getBindingContext("books").getObject()
            );

            const aRemaining = aBooks.filter(oBook => !aSelectedBooks.includes(oBook));

            oModel.setProperty("/books", aRemaining);
            oTable.removeSelections();
        }
    });
});