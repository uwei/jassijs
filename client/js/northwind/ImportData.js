var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Button", "jassi/ui/HTMLPanel", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/util/CSVImport", "jassi/base/Actions", "jassi/base/Router"], function (require, exports, Button_1, HTMLPanel_1, Jassi_1, Panel_1, CSVImport_1, Actions_1, Router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ImportData = void 0;
    let ImportData = class ImportData extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        static async showDialog() {
            Router_1.router.navigate("#do=northwind.ImportData");
        }
        async startImport() {
            var path = "https://uwei.github.io/jassijs/client/northwind/import";
            this.me.IDProtokoll.value = "";
            var s = await CSVImport_1.CSVImport.startImport(path + "/customers.csv", "northwind.Customer", { "id": "CustomerID" });
            this.me.IDProtokoll.value += "<br>Customer " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/employees.csv", "northwind.Employees", { "id": "EmployeeID" });
            this.me.IDProtokoll.value += "<br>Employees " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/shippers.csv", "northwind.Shippers", { "id": "shipperid" });
            this.me.IDProtokoll.value += "<br>Shippers " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/categories.csv", "northwind.Categories", { "id": "categoryid" });
            this.me.IDProtokoll.value += "<br>Categories " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/suppliers.csv", "northwind.Suppliers", { "id": "supplierid" });
            this.me.IDProtokoll.value += "<br>Suppliers " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/products.csv", "northwind.Products", { "id": "productid", "SupplierID": "Supplier", "CategoryID": "Category" });
            this.me.IDProtokoll.value += "<br>Products " + s;
            this.me.IDProtokoll.value += "<br>Fertig";
        }
        layout(me) {
            var _this = this;
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.IDImport = new Button_1.Button();
            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
            me.IDProtokoll = new HTMLPanel_1.HTMLPanel();
            this.add(me.htmlpanel1);
            this.add(me.IDImport);
            this.add(me.htmlpanel2);
            this.add(me.IDProtokoll);
            me.htmlpanel1.value = "Imports cvs-data from&nbsp;<a href='https://github.com/tmcnab/northwind-mongo' data-mce-selected='inline-boundary'>https://github.com/tmcnab/northwind-mongo</a><br>";
            me.htmlpanel1.newlineafter = true;
            me.IDImport.text = "Start Import";
            me.IDImport.onclick(function (event) {
                _this.startImport();
            });
            me.htmlpanel2.newlineafter = true;
        }
    };
    __decorate([
        Actions_1.$Action({ name: "Northwind/Import sample data", icon: "mdi mdi-database-import" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImportData, "showDialog", null);
    ImportData = __decorate([
        Actions_1.$ActionProvider("jassi.base.ActionNode"),
        Jassi_1.$Class("northwind.ImportData"),
        __metadata("design:paramtypes", [])
    ], ImportData);
    exports.ImportData = ImportData;
    async function test() {
        var ret = new ImportData();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wb3J0RGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vcnRod2luZC9JbXBvcnREYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFlQSxJQUFhLFVBQVUsR0FBdkIsTUFBYSxVQUFXLFNBQVEsYUFBSztRQUVqQztZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVO1lBRW5CLGVBQU0sQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBQ0QsS0FBSyxDQUFDLFdBQVc7WUFDYixJQUFJLElBQUksR0FBRyx3REFBd0QsQ0FBQztZQUNwRSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxHQUFHLE1BQU0scUJBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7WUFDM0csSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7WUFDakQsQ0FBQyxHQUFHLE1BQU0scUJBQVMsQ0FBQyxXQUFXLENBQUMsc0VBQXNFLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztZQUN2SixJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO1lBQ2xELENBQUMsR0FBRyxNQUFNLHFCQUFTLENBQUMsV0FBVyxDQUFDLHFFQUFxRSxFQUFFLG9CQUFv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amFzc2kvdWkvQnV0dG9uXCI7XG5pbXBvcnQgeyBIVE1MUGFuZWwgfSBmcm9tIFwiamFzc2kvdWkvSFRNTFBhbmVsXCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2kvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaS91aS9QYW5lbFwiO1xuaW1wb3J0IHsgQ1NWSW1wb3J0IH0gZnJvbSBcImphc3NpL3V0aWwvQ1NWSW1wb3J0XCI7XG5pbXBvcnQgeyAkQWN0aW9uLCAkQWN0aW9uUHJvdmlkZXIgfSBmcm9tIFwiamFzc2kvYmFzZS9BY3Rpb25zXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiamFzc2kvYmFzZS9Sb3V0ZXJcIjtcbnR5cGUgTWUgPSB7XG4gICAgaHRtbHBhbmVsMT86IEhUTUxQYW5lbDtcbiAgICBJREltcG9ydD86IEJ1dHRvbjtcbiAgICBodG1scGFuZWwyPzogSFRNTFBhbmVsO1xuICAgIElEUHJvdG9rb2xsPzogSFRNTFBhbmVsO1xufTtcbkAkQWN0aW9uUHJvdmlkZXIoXCJqYXNzaS5iYXNlLkFjdGlvbk5vZGVcIilcbkAkQ2xhc3MoXCJub3J0aHdpbmQuSW1wb3J0RGF0YVwiKVxuZXhwb3J0IGNsYXNzIEltcG9ydERhdGEgZXh0ZW5kcyBQYW5lbCB7XG4gICAgbWU6IE1lO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1lID0ge307XG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xuICAgIH1cbiAgICBAJEFjdGlvbih7IG5hbWU6IFwiTm9ydGh3aW5kL0ltcG9ydCBzYW1wbGUgZGF0YVwiLCBpY29uOiBcIm1kaSBtZGktZGF0YWJhc2UtaW1wb3J0XCIgfSlcbiAgICBzdGF0aWMgYXN5bmMgc2hvd0RpYWxvZygpIHtcblxuICAgICAgICByb3V0ZXIubmF2aWdhdGUoXCIjZG89bm9ydGh3aW5kLkltcG9ydERhdGFcIik7XG4gICAgfVxuICAgIGFzeW5jIHN0YXJ0SW1wb3J0KCkge1xuICAgICAgICB2YXIgcGF0aCA9IFwiaHR0cHM6Ly91d2VpLmdpdGh1Yi5pby9qYXNzaWpzL2NsaWVudC9ub3J0aHdpbmQvaW1wb3J0XCI7XG4gICAgICAgIHRoaXMubWUuSURQcm90b2tvbGwudmFsdWUgPSBcIlwiO1xuICAgICAgICB2YXIgcyA9IGF3YWl0IENTVkltcG9ydC5zdGFydEltcG9ydChwYXRoICsgXCIvY3VzdG9tZXJzLmNzdlwiLCBcIm5vcnRod2luZC5DdXN0b21lclwiLCB7IFwiaWRcIjogXCJDdXN0b21lcklEXCIgfSk7XG4gICAgICAgIHRoaXMubWUuSURQcm90b2tvbGwudmFsdWUgKz0gXCI8YnI+Q3VzdG9tZXIgXCIgKyBzO1xuICAgICAgICBzID0gYXdhaXQgQ1NWSW1wb3J0LnN0YXJ0SW1wb3J0KFwiaHR0cHM6Ly91d2VpLmdpdGh1Yi5pby9qYXNzaWpzL2NsaWVudC9ub3J0aHdpbmQvaW1wb3J0L2VtcGxveWVlcy5jc3ZcIiwgXCJub3J0aHdpbmQuRW1wbG95ZWVzXCIsIHsgXCJpZFwiOiBcIkVtcGxveWVlSURcIiB9KTtcbiAgICAgICAgdGhpcy5tZS5JRFByb3Rva29sbC52YWx1ZSArPSBcIjxicj5FbXBsb3llZXMgXCIgKyBzO1xuICAgICAgICBzID0gYXdhaXQgQ1NWSW1wb3J0LnN0YXJ0SW1wb3J0KFwiaHR0cHM6Ly91d2VpLmdpdGh1Yi5pby9qYXNzaWpzL2NsaWVudC9ub3J0aHdpbmQvaW1wb3J0L3NoaXBwZXJzLmNzdlwiLCBcIm5vcnRod2luZC5TaGlwcGVyc1wiLCB7IFwiaWRcIjogXCJzaGlwcGVyaWRcIiB9KTtcbiAgICAgICAgdGhpcy5tZS5JRFByb3Rva29sbC52YWx1ZSArPSBcIjxicj5TaGlwcGVycyBcIiArIHM7XG4gICAgICAgIHMgPSBhd2FpdCBDU1ZJbXBvcnQuc3RhcnRJbXBvcnQoXCJodHRwczovL3V3ZWkuZ2l0aHViLmlvL2phc3NpanMvY2xpZW50L25vcnRod2luZC9pbXBvcnQvY2F0ZWdvcmllcy5jc3ZcIiwgXCJub3J0aHdpbmQuQ2F0ZWdvcmllc1wiLCB7IFwiaWRcIjogXCJjYXRlZ29yeWlkXCIgfSk7XG4gICAgICAgIHRoaXMubWUuSURQcm90b2tvbGwudmFsdWUgKz0gXCI8YnI+Q2F0ZWdvcmllcyBcIiArIHM7XG4gICAgICAgIHMgPSBhd2FpdCBDU1ZJbXBvcnQuc3RhcnRJbXBvcnQoXCJodHRwczovL3V3ZWkuZ2l0aHViLmlvL2phc3NpanMvY2xpZW50L25vcnRod2luZC9pbXBvcnQvc3VwcGxpZXJzLmNzdlwiLCBcIm5vcnRod2luZC5TdXBwbGllcnNcIiwgeyBcImlkXCI6IFwic3VwcGxpZXJpZFwiIH0pO1xuICAgICAgICB0aGlzLm1lLklEUHJvdG9rb2xsLnZhbHVlICs9IFwiPGJyPlN1cHBsaWVycyBcIiArIHM7XG4gICAgICAgIHMgPSBhd2FpdCBDU1ZJbXBvcnQuc3RhcnRJbXBvcnQoXCJodHRwczovL3V3ZWkuZ2l0aHViLmlvL2phc3NpanMvY2xpZW50L25vcnRod2luZC9pbXBvcnQvcHJvZHVjdHMuY3N2XCIsIFwibm9ydGh3aW5kLlByb2R1Y3RzXCIsIHsgXCJpZFwiOiBcInByb2R1Y3RpZFwiLFwiU3VwcGxpZXJJRFwiOlwiU3VwcGxpZXJcIixcIkNhdGVnb3J5SURcIjpcIkNhdGVnb3J5XCIgfSk7XG4gICAgICAgIHRoaXMubWUuSURQcm90b2tvbGwudmFsdWUgKz0gXCI8YnI+UHJvZHVjdHMgXCIgKyBzO1xuICAgICAgICB0aGlzLm1lLklEUHJvdG9rb2xsLnZhbHVlICs9IFwiPGJyPkZlcnRpZ1wiO1xuICAgIH1cbiAgICBsYXlvdXQobWU6IE1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIG1lLmh0bWxwYW5lbDEgPSBuZXcgSFRNTFBhbmVsKCk7XG4gICAgICAgIG1lLklESW1wb3J0ID0gbmV3IEJ1dHRvbigpO1xuICAgICAgICBtZS5odG1scGFuZWwyID0gbmV3IEhUTUxQYW5lbCgpO1xuICAgICAgICBtZS5JRFByb3Rva29sbCA9IG5ldyBIVE1MUGFuZWwoKTtcbiAgICAgICAgdGhpcy5hZGQobWUuaHRtbHBhbmVsMSk7XG4gICAgICAgIHRoaXMuYWRkKG1lLklESW1wb3J0KTtcbiAgICAgICAgdGhpcy5hZGQobWUuaHRtbHBhbmVsMik7XG4gICAgICAgIHRoaXMuYWRkKG1lLklEUHJvdG9rb2xsKTtcbiAgICAgICAgbWUuaHRtbHBhbmVsMS52YWx1ZSA9IFwiSW1wb3J0cyBjdnMtZGF0YSBmcm9tJm5ic3A7PGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL3RtY25hYi9ub3J0aHdpbmQtbW9uZ28nIGRhdGEtbWNlLXNlbGVjdGVkPSdpbmxpbmUtYm91bmRhcnknPmh0dHBzOi8vZ2l0aHViLmNvbS90bWNuYWIvbm9ydGh3aW5kLW1vbmdvPC9hPjxicj5cIjtcbiAgICAgICAgbWUuaHRtbHBhbmVsMS5uZXdsaW5lYWZ0ZXIgPSB0cnVlO1xuICAgICAgICBtZS5JREltcG9ydC50ZXh0ID0gXCJTdGFydCBJbXBvcnRcIjtcbiAgICAgICAgbWUuSURJbXBvcnQub25jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLnN0YXJ0SW1wb3J0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBtZS5odG1scGFuZWwyLm5ld2xpbmVhZnRlciA9IHRydWU7XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHJldCA9IG5ldyBJbXBvcnREYXRhKCk7XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==