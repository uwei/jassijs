var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("northwind/CategoriesView", ["require", "exports", "jassi/ui/Textarea", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Categories", "jassi/ui/DBObjectView"], function (require, exports, Textarea_1, Textbox_1, Jassi_1, Property_1, Categories_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CategoriesView = void 0;
    let CategoriesView = class CategoriesView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "CategoriesView" : "CategoriesView " + this.value.id;
        }
        layout(me) {
            me.Id = new Textbox_1.Textbox();
            me.name = new Textbox_1.Textbox();
            me.description = new Textarea_1.Textarea();
            me.main.add(me.Id);
            me.main.isAbsolute = true;
            me.main.add(me.description);
            me.main.add(me.name);
            this.width = 626;
            this.height = 178;
            me.Id.x = 5;
            me.Id.y = 5;
            me.Id.label = "Id";
            me.Id.bind(me.databinder, "id");
            me.Id.width = 65;
            me.name.x = 85;
            me.name.y = 5;
            me.name.bind(me.databinder, "CategoryName");
            me.name.label = "Name";
            me.name.width = 180;
            me.description.x = 5;
            me.description.y = 60;
            me.description.height = 35;
            me.description.width = 260;
            me.description.bind(me.databinder, "Description");
            me.description.label = "Description";
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Categories_1.Categories !== "undefined" && Categories_1.Categories) === "function" ? _a : Object)
    ], CategoriesView.prototype, "value", void 0);
    CategoriesView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.Categories", actionname: "Northwind/Categories", icon: "mdi mdi-cube" }),
        Jassi_1.$Class("northwind.CategoriesView"),
        __metadata("design:paramtypes", [])
    ], CategoriesView);
    exports.CategoriesView = CategoriesView;
    async function test() {
        var ret = new CategoriesView;
        ret["value"] = await Categories_1.Categories.findOne();
        return ret;
    }
    exports.test = test;
});
define("northwind/CustomerView", ["require", "exports", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Customer", "jassi/ui/DBObjectView"], function (require, exports, Textbox_2, Jassi_2, Property_2, Customer_1, DBObjectView_2) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerView = void 0;
    let CustomerView = class CustomerView extends DBObjectView_2.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "CustomerView" : "CustomerView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_2.Textbox();
            me.companyname = new Textbox_2.Textbox();
            me.contacttitle = new Textbox_2.Textbox();
            me.contactname = new Textbox_2.Textbox();
            me.address = new Textbox_2.Textbox();
            me.postalcode = new Textbox_2.Textbox();
            me.textbox1 = new Textbox_2.Textbox();
            me.region = new Textbox_2.Textbox();
            me.textbox2 = new Textbox_2.Textbox();
            me.phone = new Textbox_2.Textbox();
            me.fax = new Textbox_2.Textbox();
            me.main.isAbsolute = true;
            me.main.width = 560;
            me.main.height = "300";
            me.main.add(me.id);
            me.main.add(me.companyname);
            me.main.add(me.contacttitle);
            me.main.add(me.contactname);
            me.main.add(me.address);
            me.main.add(me.postalcode);
            me.main.add(me.textbox1);
            me.main.add(me.region);
            me.main.add(me.textbox2);
            me.main.add(me.phone);
            me.main.add(me.fax);
            me.id.x = 10;
            me.id.y = 5;
            me.id.bind(me.databinder, "id");
            me.id.width = 65;
            me.id.label = "id";
            me.companyname.x = 195;
            me.companyname.y = 45;
            me.companyname.bind(me.databinder, "CompanyName");
            me.companyname.label = "Company Name";
            me.companyname.width = 155;
            me.contacttitle.x = 10;
            me.contacttitle.y = 45;
            me.contacttitle.label = "Contact Title";
            me.contacttitle.bind(me.databinder, "ContactTitle");
            me.contactname.x = 90;
            me.contactname.y = 5;
            me.contactname.label = "Contact Name";
            me.contactname.bind(me.databinder, "ContactName");
            me.contactname.width = 260;
            me.address.x = 10;
            me.address.y = 90;
            me.address.bind(me.databinder, "Address");
            me.address.label = "Address";
            me.address.width = 340;
            me.postalcode.x = 10;
            me.postalcode.y = 140;
            me.postalcode.label = "Postal Code";
            me.postalcode.bind(me.databinder, "PostalCode");
            me.postalcode.width = 90;
            me.textbox1.x = 100;
            me.textbox1.y = 140;
            me.textbox1.label = "City";
            me.textbox1.width = 250;
            me.textbox1.bind(me.databinder, "City");
            me.region.x = 10;
            me.region.y = 185;
            me.region.bind(me.databinder, "Region");
            me.region.label = "Region";
            me.textbox2.x = 195;
            me.textbox2.y = 185;
            me.textbox2.label = "Country";
            me.textbox2.bind(me.databinder, "Country");
            this.width = 940;
            this.height = 377;
            me.phone.x = 10;
            me.phone.y = 230;
            me.phone.label = "Phone";
            me.phone.bind(me.databinder, "Phone");
            me.fax.x = 195;
            me.fax.y = 230;
            me.fax.label = "Fax";
            me.fax.bind(me.databinder, "Fax");
            me.toolbar.height = 20;
        }
    };
    __decorate([
        Property_2.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Customer_1.Customer !== "undefined" && Customer_1.Customer) === "function" ? _a : Object)
    ], CustomerView.prototype, "value", void 0);
    CustomerView = __decorate([
        DBObjectView_2.$DBObjectView({
            classname: "northwind.Customer",
            actionname: "Northwind/Customers",
            icon: "mdi mdi-nature-people"
        }),
        Jassi_2.$Class("northwind/CustomerView"),
        __metadata("design:paramtypes", [])
    ], CustomerView);
    exports.CustomerView = CustomerView;
    async function test() {
        var ret = new CustomerView;
        ret["value"] = await Customer_1.Customer.findOne();
        return ret;
    }
    exports.test = test;
});
define("northwind/EmployeesView", ["require", "exports", "jassi/ui/ObjectChooser", "jassi/ui/HTMLPanel", "jassi/ui/converters/NumberConverter", "jassi/ui/Image", "jassi/ui/Textarea", "jassi/ui/Calendar", "jassi/ui/Textbox", "jassi/ui/Button", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Employees", "jassi/ui/DBObjectView"], function (require, exports, ObjectChooser_1, HTMLPanel_1, NumberConverter_1, Image_1, Textarea_2, Calendar_1, Textbox_3, Button_1, Jassi_3, Property_3, Employees_1, DBObjectView_3) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.EmployeesView = void 0;
    let EmployeesView = class EmployeesView extends DBObjectView_3.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "EmployeesView" : "EmployeesView " + this.value.id;
        }
        layout(me) {
            me.button1 = new Button_1.Button();
            me.titleOfCouttesy = new Textbox_3.Textbox();
            me.firstName = new Textbox_3.Textbox();
            me.lastName = new Textbox_3.Textbox();
            me.title = new Textbox_3.Textbox();
            me.address = new Textbox_3.Textbox();
            me.postalCode = new Textbox_3.Textbox();
            me.city = new Textbox_3.Textbox();
            me.birthDate = new Calendar_1.Calendar();
            me.region = new Textbox_3.Textbox();
            me.state = new Textbox_3.Textbox();
            me.hiredate = new Calendar_1.Calendar();
            me.homephone = new Textbox_3.Textbox();
            me.notes = new Textarea_2.Textarea();
            me.image1 = new Image_1.Image();
            me.photoPath = new Textbox_3.Textbox();
            me.id = new Textbox_3.Textbox();
            me.reportsTo = new HTMLPanel_1.HTMLPanel();
            me.objectchooser1 = new ObjectChooser_1.ObjectChooser();
            me.button1.text = "button";
            me.main.width = 900;
            me.main.height = "900";
            me.main.isAbsolute = true;
            me.main.add(me.firstName);
            me.main.add(me.lastName);
            me.main.add(me.title);
            me.main.add(me.titleOfCouttesy);
            me.main.add(me.address);
            me.main.add(me.postalCode);
            me.main.add(me.city);
            me.main.add(me.region);
            me.main.add(me.state);
            me.main.add(me.birthDate);
            me.main.add(me.hiredate);
            me.main.add(me.homephone);
            me.main.add(me.notes);
            me.main.add(me.image1);
            me.main.add(me.photoPath);
            me.main.add(me.id);
            me.main.add(me.reportsTo);
            me.main.add(me.objectchooser1);
            me.titleOfCouttesy.x = 525;
            me.titleOfCouttesy.y = 5;
            me.titleOfCouttesy.label = "Title of C.";
            me.titleOfCouttesy.width = 85;
            me.titleOfCouttesy.bind(me.databinder, "TitleOfCourtesy");
            me.firstName.x = 80;
            me.firstName.y = 5;
            me.firstName.label = "First name";
            me.firstName.bind(me.databinder, "FirstName");
            me.lastName.x = 250;
            me.lastName.y = 5;
            me.lastName.label = "Last Name";
            me.lastName.bind(me.databinder, "LastName");
            me.title.x = 420;
            me.title.y = 5;
            me.title.bind(me.databinder, "Title");
            me.title.label = "Title";
            me.title.width = 90;
            me.address.x = 5;
            me.address.y = 50;
            me.address.label = "Address";
            me.address.bind(me.databinder, "Address");
            me.address.width = 345;
            me.postalCode.x = 5;
            me.postalCode.y = 95;
            me.postalCode.label = "Postal Code";
            me.postalCode.bind(me.databinder, "PostalCode");
            me.postalCode.width = 90;
            me.city.x = 110;
            me.city.y = 95;
            me.city.bind(me.databinder, "City");
            me.city.label = "City";
            me.city.width = 240;
            me.birthDate.x = 5;
            me.birthDate.y = 190;
            me.birthDate.width = 90;
            me.birthDate.bind(me.databinder, "BirthDate");
            me.birthDate.label = "Birth Date";
            me.region.x = 5;
            me.region.y = 140;
            me.region.bind(me.databinder, "Region");
            me.region.label = "Region";
            me.region.width = 90;
            me.state.x = 110;
            me.state.y = 140;
            me.state.bind(me.databinder, "Country");
            me.state.label = "country";
            me.state.width = 240;
            me.hiredate.x = 110;
            me.hiredate.y = 190;
            me.hiredate.bind(me.databinder, "HireDate");
            me.hiredate.label = "Hire Date";
            me.hiredate.width = 85;
            me.homephone.x = 210;
            me.homephone.y = 190;
            me.homephone.bind(me.databinder, "HomePhone");
            me.homephone.label = "Home Phone";
            me.homephone.width = 140;
            me.notes.x = 375;
            me.notes.y = 50;
            me.notes.width = 240;
            me.notes.height = 155;
            me.notes.bind(me.databinder, "Notes");
            me.notes.label = "Notes";
            me.image1.x = 630;
            me.image1.y = 20;
            me.image1.src = "";
            me.image1.css({
                background_color: "black",
                border_style: "solid"
            });
            me.image1.width = 125;
            me.image1.bind(me.databinder, "PhotoPath");
            me.photoPath.x = 5;
            me.photoPath.y = 240;
            me.photoPath.bind(me.databinder, "PhotoPath");
            me.photoPath.label = "Photo Path";
            me.photoPath.width = 460;
            me.id.x = 5;
            me.id.y = 5;
            me.id.width = 60;
            me.id.label = "Id";
            me.id.bind(me.databinder, "id");
            me.id.converter = new NumberConverter_1.NumberConverter();
            me.reportsTo.x = 7;
            me.reportsTo.y = 298;
            me.reportsTo.label = "Reports To";
            me.reportsTo.bind(me.databinder, "ReportsTo");
            me.reportsTo.template = "{{FirstName}} {{LastName}}";
            me.reportsTo.width = 160;
            me.objectchooser1.x = 170;
            me.objectchooser1.y = 310;
            me.objectchooser1.width = 25;
            me.objectchooser1.height = 25;
            me.objectchooser1.bind(me.databinder, "ReportsTo");
            me.objectchooser1.items = "northwind.Employees";
        }
    };
    __decorate([
        Property_3.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Employees_1.Employees !== "undefined" && Employees_1.Employees) === "function" ? _a : Object)
    ], EmployeesView.prototype, "value", void 0);
    EmployeesView = __decorate([
        DBObjectView_3.$DBObjectView({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        Jassi_3.$Class("northwind.EmployeesView"),
        __metadata("design:paramtypes", [])
    ], EmployeesView);
    exports.EmployeesView = EmployeesView;
    async function test() {
        var em = (await Employees_1.Employees.find({ id: 4 }))[0];
        var ret = new EmployeesView;
        ret["value"] = em;
        return ret;
    }
    exports.test = test;
});
define("northwind/ImportData", ["require", "exports", "jassi/ui/Button", "jassi/ui/HTMLPanel", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/util/CSVImport", "jassi/base/Actions", "jassi/base/Router"], function (require, exports, Button_2, HTMLPanel_2, Jassi_4, Panel_1, CSVImport_1, Actions_1, Router_1) {
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
            me.htmlpanel1 = new HTMLPanel_2.HTMLPanel();
            me.IDImport = new Button_2.Button();
            me.htmlpanel2 = new HTMLPanel_2.HTMLPanel();
            me.IDProtokoll = new HTMLPanel_2.HTMLPanel();
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
        Jassi_4.$Class("northwind.ImportData"),
        __metadata("design:paramtypes", [])
    ], ImportData);
    exports.ImportData = ImportData;
    async function test() {
        var ret = new ImportData();
        return ret;
    }
    exports.test = test;
});
define("northwind/ProductView", ["require", "exports", "jassi/ui/ObjectChooser", "jassi/ui/HTMLPanel", "jassi/ui/Checkbox", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Products", "jassi/ui/DBObjectView"], function (require, exports, ObjectChooser_2, HTMLPanel_3, Checkbox_1, NumberConverter_2, Textbox_4, Jassi_5, Property_4, Products_1, DBObjectView_4) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ProductView = void 0;
    let ProductView = class ProductView extends DBObjectView_4.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "ProductView" : "ProductView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_4.Textbox();
            me.productName = new Textbox_4.Textbox();
            me.quantityPerUnit = new Textbox_4.Textbox();
            me.unitPrice = new Textbox_4.Textbox();
            me.unitsInStock = new Textbox_4.Textbox();
            me.unitsOnOrder = new Textbox_4.Textbox();
            me.reorderLevel = new Textbox_4.Textbox();
            me.checkbox1 = new Checkbox_1.Checkbox();
            me.category = new HTMLPanel_3.HTMLPanel();
            me.categoryChooser = new ObjectChooser_2.ObjectChooser();
            me.supplier = new HTMLPanel_3.HTMLPanel();
            me.supplierchooser = new ObjectChooser_2.ObjectChooser();
            me.main.add(me.id);
            me.main.isAbsolute = true;
            me.main.x = 15;
            me.main.y = 105;
            me.main.add(me.supplierchooser);
            me.main.add(me.supplier);
            me.main.add(me.categoryChooser);
            me.main.add(me.category);
            me.main.add(me.checkbox1);
            me.main.add(me.reorderLevel);
            me.main.add(me.unitsOnOrder);
            me.main.add(me.unitsInStock);
            me.main.add(me.unitPrice);
            me.main.add(me.quantityPerUnit);
            me.main.add(me.productName);
            this.width = 678;
            this.height = 220;
            me.id.x = 10;
            me.id.y = 10;
            me.id.bind(me.databinder, "id");
            me.id.label = "Id";
            me.id.width = 65;
            me.id.converter = new NumberConverter_2.NumberConverter();
            me.productName.x = 92;
            me.productName.y = 12;
            me.productName.bind(me.databinder, "ProductName");
            me.productName.label = "Product Name";
            me.quantityPerUnit.x = 10;
            me.quantityPerUnit.y = 60;
            me.quantityPerUnit.bind(me.databinder, "QuantityPerUnit");
            me.quantityPerUnit.width = 135;
            me.quantityPerUnit.label = "Quantity per Unit";
            me.unitPrice.x = 160;
            me.unitPrice.y = 60;
            me.unitPrice.bind(me.databinder, "UnitPrice");
            me.unitPrice.label = "Unit Price";
            me.unitPrice.width = 65;
            me.unitPrice.converter = new NumberConverter_2.NumberConverter();
            me.unitsInStock.x = 240;
            me.unitsInStock.y = 60;
            me.unitsInStock.bind(me.databinder, "UnitsInStock");
            me.unitsInStock.label = "Units in Stock";
            me.unitsInStock.width = 70;
            me.unitsInStock.converter = new NumberConverter_2.NumberConverter();
            me.unitsOnOrder.x = 325;
            me.unitsOnOrder.y = 60;
            me.unitsOnOrder.bind(me.databinder, "UnitsOnOrder");
            me.unitsOnOrder.label = "Units on Order";
            me.unitsOnOrder.width = 75;
            me.unitsOnOrder.converter = new NumberConverter_2.NumberConverter();
            me.reorderLevel.x = 415;
            me.reorderLevel.y = 60;
            me.reorderLevel.bind(me.databinder, "ReorderLevel");
            me.reorderLevel.width = 70;
            me.reorderLevel.label = "Reorder Level";
            me.reorderLevel.converter = new NumberConverter_2.NumberConverter();
            me.checkbox1.x = 268;
            me.checkbox1.y = 18;
            me.checkbox1.width = 15;
            me.category.x = 10;
            me.category.y = 110;
            me.category.template = "{{CategoryName}}";
            me.category.value = "Condiments";
            me.category.bind(me.databinder, "Category");
            me.category.width = 170;
            me.category.label = "Category";
            me.categoryChooser.x = 185;
            me.categoryChooser.y = 125;
            me.categoryChooser.items = "northwind.Categories";
            me.categoryChooser.bind(me.databinder, "Category");
            me.categoryChooser.width = 30;
            me.supplier.x = 225;
            me.supplier.y = 110;
            me.supplier.bind(me.databinder, "Supplier");
            me.supplier.value = "New Orleans Cajun Delights";
            me.supplier.template = "{{CompanyName}}";
            me.supplier.label = "Supplier";
            me.supplier.width = 230;
            me.supplierchooser.x = 460;
            me.supplierchooser.y = 125;
            me.supplierchooser.bind(me.databinder, "Supplier");
            me.supplierchooser.items = "northwind.Suppliers";
        }
    };
    __decorate([
        Property_4.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Products_1.Products !== "undefined" && Products_1.Products) === "function" ? _a : Object)
    ], ProductView.prototype, "value", void 0);
    ProductView = __decorate([
        DBObjectView_4.$DBObjectView({ classname: "northwind.Products" }),
        Jassi_5.$Class("northwind.ProductView"),
        __metadata("design:paramtypes", [])
    ], ProductView);
    exports.ProductView = ProductView;
    async function test() {
        var ret = new ProductView;
        //var h=await Products.find({relations:["Category"]});
        ret["value"] = await Products_1.Products.findOne({ relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
define("northwind/ShippersView", ["require", "exports", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Shippers", "jassi/ui/DBObjectView"], function (require, exports, NumberConverter_3, Textbox_5, Jassi_6, Property_5, Shippers_1, DBObjectView_5) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ShippersView = void 0;
    let ShippersView = class ShippersView extends DBObjectView_5.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "ShippersView" : "ShippersView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_5.Textbox();
            me.companyName = new Textbox_5.Textbox();
            me.phone = new Textbox_5.Textbox();
            me.main.add(me.id);
            me.main.isAbsolute = true;
            me.main.height = 110;
            me.main.add(me.phone);
            me.main.add(me.companyName);
            this.width = 626;
            this.height = 146;
            me.id.converter = new NumberConverter_3.NumberConverter();
            me.id.bind(me.databinder, "id");
            me.id.label = "Id";
            me.id.width = 40;
            me.id.x = 5;
            me.id.y = 0;
            me.companyName.x = 60;
            me.companyName.y = 0;
            me.companyName.bind(me.databinder, "CompanyName");
            me.companyName.label = "Company name";
            me.companyName.width = 160;
            me.phone.x = 5;
            me.phone.y = 50;
            me.phone.width = 215;
            me.phone.bind(me.databinder, "Phone");
            me.phone.label = "Phone";
        }
    };
    __decorate([
        Property_5.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Shippers_1.Shippers !== "undefined" && Shippers_1.Shippers) === "function" ? _a : Object)
    ], ShippersView.prototype, "value", void 0);
    ShippersView = __decorate([
        DBObjectView_5.$DBObjectView({ classname: "northwind.Shippers", actionname: "Northwind/Shippers", icon: "mdi mdi-truck-delivery" }),
        Jassi_6.$Class("northwind.ShippersView"),
        __metadata("design:paramtypes", [])
    ], ShippersView);
    exports.ShippersView = ShippersView;
    async function test() {
        var ret = new ShippersView;
        ret["value"] = await Shippers_1.Shippers.findOne();
        return ret;
    }
    exports.test = test;
});
define("northwind/SuppliersView", ["require", "exports", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Suppliers", "jassi/ui/DBObjectView"], function (require, exports, NumberConverter_4, Textbox_6, Jassi_7, Property_6, Suppliers_1, DBObjectView_6) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SuppliersView = void 0;
    let SuppliersView = class SuppliersView extends DBObjectView_6.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "SuppliersView" : "SuppliersView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_6.Textbox();
            me.companyName = new Textbox_6.Textbox();
            me.contactName = new Textbox_6.Textbox();
            me.contactTitle = new Textbox_6.Textbox();
            me.address = new Textbox_6.Textbox();
            me.postalCode = new Textbox_6.Textbox();
            me.city = new Textbox_6.Textbox();
            me.region = new Textbox_6.Textbox();
            me.Country = new Textbox_6.Textbox();
            me.phone = new Textbox_6.Textbox();
            me.fax = new Textbox_6.Textbox();
            me.homepage = new Textbox_6.Textbox();
            me.main.add(me.id);
            me.main.isAbsolute = true;
            me.main.height = "800";
            me.main.width = 800;
            me.main.add(me.homepage);
            me.main.add(me.fax);
            me.main.add(me.phone);
            me.main.add(me.Country);
            me.main.add(me.region);
            me.main.add(me.city);
            me.main.add(me.postalCode);
            me.main.add(me.address);
            me.main.add(me.contactTitle);
            me.main.add(me.contactName);
            me.main.add(me.companyName);
            me.id.x = 10;
            me.id.y = 5;
            me.id.converter = new NumberConverter_4.NumberConverter();
            me.id.width = 50;
            me.id.bind(me.databinder, "id");
            me.id.label = "Id";
            me.companyName.x = 75;
            me.companyName.y = 5;
            me.companyName.label = "Company Name";
            me.companyName.bind(me.databinder, "CompanyName");
            me.companyName.width = 290;
            me.contactName.x = 10;
            me.contactName.y = 50;
            me.contactName.bind(me.databinder, "ContactName");
            me.contactName.label = "Contact Name";
            me.contactTitle.x = 180;
            me.contactTitle.y = 50;
            me.contactTitle.bind(me.databinder, "ContactTitle");
            me.contactTitle.label = "Contact Title";
            me.contactTitle.width = 185;
            me.address.x = 10;
            me.address.y = 95;
            me.address.bind(me.databinder, "Address");
            me.address.label = "Address";
            me.address.width = 355;
            me.postalCode.x = 10;
            me.postalCode.y = 140;
            me.postalCode.bind(me.databinder, "PostalCode");
            me.postalCode.width = 95;
            me.postalCode.label = "Postal Code";
            me.city.x = 120;
            me.city.y = 140;
            me.city.bind(me.databinder, "City");
            me.city.label = "City";
            me.city.width = 245;
            me.region.x = 10;
            me.region.y = 185;
            me.region.bind(me.databinder, "Region");
            me.region.label = "Region";
            me.region.width = 155;
            me.Country.x = 180;
            me.Country.y = 185;
            me.Country.bind(me.databinder, "Country");
            me.Country.label = "Country";
            me.Country.width = 185;
            me.phone.x = 10;
            me.phone.y = 230;
            me.phone.bind(me.databinder, "Phone");
            me.phone.label = "Phone";
            me.phone.width = 155;
            me.fax.x = 180;
            me.fax.y = 230;
            me.fax.bind(me.databinder, "Fax");
            me.fax.label = "Fax";
            me.fax.width = 185;
            me.homepage.x = 10;
            me.homepage.y = 275;
            me.homepage.bind(me.databinder, "HomePage");
            me.homepage.label = "Home Page";
            me.homepage.width = 355;
        }
    };
    __decorate([
        Property_6.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Suppliers_1.Suppliers !== "undefined" && Suppliers_1.Suppliers) === "function" ? _a : Object)
    ], SuppliersView.prototype, "value", void 0);
    SuppliersView = __decorate([
        DBObjectView_6.$DBObjectView({ classname: "northwind.Suppliers", actionname: "Northwind/Suppliers", icon: "mdi mdi-office-building-outline" }),
        Jassi_7.$Class("northwind.SuppliersView"),
        __metadata("design:paramtypes", [])
    ], SuppliersView);
    exports.SuppliersView = SuppliersView;
    async function test() {
        var ret = new SuppliersView;
        ret["value"] = await Suppliers_1.Suppliers.findOne();
        return ret;
    }
    exports.test = test;
});
define("northwind/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "require": {}
    };
});
//this file is autogenerated don't modify
define("northwind/registry", ["require"], function (require) {
    return {
        default: {
            "northwind/CategoriesView.ts": {
                "date": 1615758610480,
                "northwind.CategoriesView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Categories",
                            "actionname": "Northwind/Categories",
                            "icon": "mdi mdi-cube"
                        }
                    ]
                }
            },
            "northwind/CustomerView.ts": {
                "date": 1615490345648,
                "northwind/CustomerView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Customer",
                            "actionname": "Northwind/Customers",
                            "icon": "mdi mdi-nature-people"
                        }
                    ]
                }
            },
            "northwind/EmployeesView.ts": {
                "date": 1615590101914,
                "northwind.EmployeesView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Employees",
                            "actionname": "Northwind/Employees",
                            "icon": "mdi mdi-account-tie"
                        }
                    ]
                }
            },
            "northwind/ImportData.ts": {
                "date": 1615842426557,
                "northwind.ImportData": {
                    "$ActionProvider": [
                        "jassi.base.ActionNode"
                    ]
                }
            },
            "northwind/modul.ts": {
                "date": 1613551043267
            },
            "northwind/ProductView.ts": {
                "date": 1615922270670,
                "northwind.ProductView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Products"
                        }
                    ]
                }
            },
            "northwind/remote/Categories.ts": {
                "date": 1615758109294,
                "northwind.Categories": {
                    "$DBObject": []
                }
            },
            "northwind/remote/Customer.ts": {
                "date": 1615052487959,
                "northwind.Customer": {
                    "$DBObject": []
                }
            },
            "northwind/remote/Employees.ts": {
                "date": 1615492081804,
                "northwind.Employees": {
                    "$DBObject": []
                }
            },
            "northwind/remote/Products.ts": {
                "date": 1615918366138,
                "northwind.Products": {
                    "$DBObject": []
                }
            },
            "northwind/remote/Shippers.ts": {
                "date": 1615757238969,
                "northwind.Shippers": {
                    "$DBObject": []
                }
            },
            "northwind/remote/Suppliers.ts": {
                "date": 1615758951978,
                "northwind.Suppliers": {
                    "$DBObject": []
                }
            },
            "northwind/ShippersView.ts": {
                "date": 1615757648366,
                "northwind.ShippersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Shippers",
                            "actionname": "Northwind/Shippers",
                            "icon": "mdi mdi-truck-delivery"
                        }
                    ]
                }
            },
            "northwind/SuppliersView.ts": {
                "date": 1615759779463,
                "northwind.SuppliersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Suppliers",
                            "actionname": "Northwind/Suppliers",
                            "icon": "mdi mdi-office-building-outline"
                        }
                    ]
                }
            }
        }
    };
});
define("northwind/remote/Categories", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, DBObject_1, Jassi_8, DatabaseSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Categories = void 0;
    let Categories = class Categories extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Categories.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "CategoryName", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "Description", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Categories.prototype, "Picture", void 0);
    Categories = __decorate([
        DBObject_1.$DBObject(),
        Jassi_8.$Class("northwind.Categories"),
        __metadata("design:paramtypes", [])
    ], Categories);
    exports.Categories = Categories;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Customer", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, DBObject_2, Jassi_9, DatabaseSchema_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Customer = void 0;
    let Customer = class Customer extends DBObject_2.DBObject {
        constructor() {
            super();
            this.CompanyName = "";
            this.ContactName = "";
            this.ContactTitle = "";
            this.Address = "";
            this.City = "";
            /*  this.id = 0;
              this.vorname = "";
              this.nachname = "";
              this.strasse = "";
              this.PLZ = "";
              this.hausnummer = 0;
              this.initExtensions();*/
        }
    };
    __decorate([
        DatabaseSchema_2.PrimaryColumn(),
        __metadata("design:type", String)
    ], Customer.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "CompanyName", void 0);
    __decorate([
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "ContactName", void 0);
    __decorate([
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "ContactTitle", void 0);
    __decorate([
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "Address", void 0);
    __decorate([
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "City", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Region", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "PostalCode", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Country", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Phone", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Fax", void 0);
    Customer = __decorate([
        DBObject_2.$DBObject(),
        Jassi_9.$Class("northwind.Customer"),
        __metadata("design:paramtypes", [])
    ], Customer);
    exports.Customer = Customer;
    async function test() {
        var all = await Customer.find();
        //var cus2=<Customer>await Customer.findOne();
        //debugger;
        //await Kunde.sample();
        //	new de.Kunde().generate();
        //jassi.db.uploadType(de.Kunde);
    }
    exports.test = test;
    ;
});
define("northwind/remote/Employees", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema", "jassi/remote/Transaction"], function (require, exports, DBObject_3, Jassi_10, DatabaseSchema_3, Transaction_1) {
    "use strict";
    var Employees_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.Employees = void 0;
    let Employees = Employees_2 = class Employees extends DBObject_3.DBObject {
        constructor() {
            super();
        }
        static async find(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if (options === undefined)
                    options = { relations: ["ReportsTo"] };
                return await this.call(this.find, options, context);
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_1, reject_1) => { require(["jassi/server/DBManager"], resolve_1, reject_1); })).DBManager.get();
                return man.find(context, this, options);
            }
        }
        async hallo(num) {
            if (!Jassi_10.default.isServer) {
                var ret = await this.call(this, this.hallo, num);
                return ret * 10;
            }
            else {
                return num + 1;
                // return ["jassi/base/ChromeDebugger.ts"];
            }
        }
    };
    __decorate([
        DatabaseSchema_3.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Employees.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "LastName", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "FirstName", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Title", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "TitleOfCourtesy", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Address", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "City", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Region", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PostalCode", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Country", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "HomePhone", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Extension", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Photo", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Notes", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PhotoPath", void 0);
    __decorate([
        DatabaseSchema_3.JoinColumn(),
        DatabaseSchema_3.ManyToOne(type => Employees_2),
        __metadata("design:type", Employees)
    ], Employees.prototype, "ReportsTo", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", Date)
    ], Employees.prototype, "BirthDate", void 0);
    __decorate([
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", Date)
    ], Employees.prototype, "HireDate", void 0);
    Employees = Employees_2 = __decorate([
        DBObject_3.$DBObject(),
        Jassi_10.$Class("northwind.Employees"),
        __metadata("design:paramtypes", [])
    ], Employees);
    exports.Employees = Employees;
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    async function test() {
        var all = await Employees.find({ where: "id>:p", whereParams: { p: 5 } });
        debugger;
    }
    exports.test = test;
    async function test2() {
        var em = new Employees();
        em.id = getRandomInt(100000);
        var em2 = new Employees();
        em2.id = getRandomInt(100000);
        var trans = new Transaction_1.Transaction();
        console.log(em.id + " " + em2.id);
        trans.add(em, em.save);
        trans.add(em2, em2.save);
        var h = await trans.execute();
        h = h;
        /*  var emp = new Employees();
          emp.id = 100003;
          emp.BirthDate = new Date(Date.now());
          //await emp.save();
          var emp2 = new Employees();
          emp2.id = 200000;
          emp2.ReportsTo = emp;
          //await emp2.save();*/
    }
    exports.test2 = test2;
    ;
});
define("northwind/remote/Products", ["require", "exports", "northwind/remote/Categories", "northwind/remote/Suppliers", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, Categories_2, Suppliers_2, DBObject_4, Jassi_11, DatabaseSchema_4) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Products = void 0;
    let Products = class Products extends DBObject_4.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        DatabaseSchema_4.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Products.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "ProductName", void 0);
    __decorate([
        DatabaseSchema_4.ManyToOne(type => Suppliers_2.Suppliers),
        __metadata("design:type", typeof (_a = typeof Suppliers_2.Suppliers !== "undefined" && Suppliers_2.Suppliers) === "function" ? _a : Object)
    ], Products.prototype, "Supplier", void 0);
    __decorate([
        DatabaseSchema_4.ManyToOne(type => Categories_2.Categories),
        __metadata("design:type", typeof (_b = typeof Categories_2.Categories !== "undefined" && Categories_2.Categories) === "function" ? _b : Object)
    ], Products.prototype, "Category", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "QuantityPerUnit", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitPrice", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsInStock", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsOnOrder", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "ReorderLevel", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true }),
        __metadata("design:type", Boolean)
    ], Products.prototype, "Discontinued", void 0);
    Products = __decorate([
        DBObject_4.$DBObject(),
        Jassi_11.$Class("northwind.Products"),
        __metadata("design:paramtypes", [])
    ], Products);
    exports.Products = Products;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Shippers", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, DBObject_5, Jassi_12, DatabaseSchema_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Shippers = void 0;
    let Shippers = class Shippers extends DBObject_5.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        DatabaseSchema_5.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Shippers.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Shippers.prototype, "CompanyName", void 0);
    __decorate([
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Shippers.prototype, "Phone", void 0);
    Shippers = __decorate([
        DBObject_5.$DBObject(),
        Jassi_12.$Class("northwind.Shippers"),
        __metadata("design:paramtypes", [])
    ], Shippers);
    exports.Shippers = Shippers;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Suppliers", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, DBObject_6, Jassi_13, DatabaseSchema_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Suppliers = void 0;
    let Suppliers = class Suppliers extends DBObject_6.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        DatabaseSchema_6.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Suppliers.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "CompanyName", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "ContactName", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "ContactTitle", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Address", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "City", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Region", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "PostalCode", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Country", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Phone", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Fax", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "HomePage", void 0);
    Suppliers = __decorate([
        DBObject_6.$DBObject(),
        Jassi_13.$Class("northwind.Suppliers"),
        __metadata("design:paramtypes", [])
    ], Suppliers);
    exports.Suppliers = Suppliers;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=northwind.js.map