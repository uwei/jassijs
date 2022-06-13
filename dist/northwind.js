var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("northwind/CategoriesView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Table", "jassijs/ui/BoxPanel", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Property", "northwind/remote/Categories", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Table_1, BoxPanel_1, Textarea_1, Textbox_1, Jassi_1, Panel_1, Property_1, Categories_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CategoriesView = void 0;
    let CategoriesView = class CategoriesView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            // this.me = {}; //this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "CategoriesView" : "CategoriesView " + this.value.id;
        }
        layout(me) {
            me.Id = new Textbox_1.Textbox();
            me.name = new Textbox_1.Textbox();
            me.description = new Textarea_1.Textarea();
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.table1 = new Table_1.Table();
            me.panel1 = new Panel_1.Panel();
            me.main.add(me.boxpanel1);
            me.main.add(me.description);
            me.main.add(me.panel1);
            me.main.add(me.table1);
            me.Id.label = "Id";
            me.Id.bind = [me.databinder, "id"];
            me.Id.width = 40;
            me.Id.converter = new NumberConverter_1.NumberConverter();
            me.name.bind = [me.databinder, "CategoryName"];
            me.name.label = "Name";
            me.name.width = 225;
            me.description.height = 70;
            me.description.width = 280;
            me.description.bind = [me.databinder, "Description"];
            me.description.label = "Description";
            me.boxpanel1.add(me.Id);
            me.boxpanel1.horizontal = true;
            me.boxpanel1.width = 80;
            me.boxpanel1.add(me.name);
            me.table1.height = "100%";
            me.table1.bindItems = [me.databinder, "Products"];
            me.table1.width = "100%";
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Categories_1.Categories !== "undefined" && Categories_1.Categories) === "function" ? _a : Object)
    ], CategoriesView.prototype, "value", void 0);
    CategoriesView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Categories", actionname: "Northwind/Categories", icon: "mdi mdi-cube" }),
        (0, Jassi_1.$Class)("northwind.CategoriesView"),
        __metadata("design:paramtypes", [])
    ], CategoriesView);
    exports.CategoriesView = CategoriesView;
    async function test() {
        var ret = new CategoriesView();
        ret["value"] = await Categories_1.Categories.findOne({ relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
define("northwind/CustomerView", ["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Customer", "jassijs/ui/DBObjectView"], function (require, exports, Textbox_2, Jassi_2, Property_2, Customer_1, DBObjectView_2) {
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
            me.id.bind = [me.databinder, "id"];
            me.id.width = 65;
            me.id.label = "id";
            me.companyname.x = 195;
            me.companyname.y = 45;
            me.companyname.bind = [me.databinder, "CompanyName"];
            me.companyname.label = "Company Name";
            me.companyname.width = 155;
            me.contacttitle.x = 10;
            me.contacttitle.y = 45;
            me.contacttitle.label = "Contact Title";
            me.contacttitle.bind = [me.databinder, "ContactTitle"];
            me.contactname.x = 90;
            me.contactname.y = 5;
            me.contactname.label = "Contact Name";
            me.contactname.bind = [me.databinder, "ContactName"];
            me.contactname.width = 260;
            me.address.x = 10;
            me.address.y = 90;
            me.address.bind = [me.databinder, "Address"];
            me.address.label = "Address";
            me.address.width = 340;
            me.postalcode.x = 10;
            me.postalcode.y = 140;
            me.postalcode.label = "Postal Code";
            me.postalcode.bind = [me.databinder, "PostalCode"];
            me.postalcode.width = 90;
            me.textbox1.x = 100;
            me.textbox1.y = 140;
            me.textbox1.label = "City";
            me.textbox1.width = 250;
            me.textbox1.bind = [me.databinder, "City"];
            me.region.x = 10;
            me.region.y = 185;
            me.region.bind = [me.databinder, "Region"];
            me.region.label = "Region";
            me.textbox2.x = 195;
            me.textbox2.y = 185;
            me.textbox2.label = "Country";
            me.textbox2.bind = [me.databinder, "Country"];
            this.width = 940;
            this.height = 377;
            me.phone.x = 10;
            me.phone.y = 230;
            me.phone.label = "Phone";
            me.phone.bind = [me.databinder, "Phone"];
            me.fax.x = 195;
            me.fax.y = 230;
            me.fax.label = "Fax";
            me.fax.bind = [me.databinder, "Fax"];
            me.toolbar.height = 20;
        }
    };
    __decorate([
        (0, Property_2.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Customer_1.Customer !== "undefined" && Customer_1.Customer) === "function" ? _a : Object)
    ], CustomerView.prototype, "value", void 0);
    CustomerView = __decorate([
        (0, DBObjectView_2.$DBObjectView)({
            classname: "northwind.Customer",
            actionname: "Northwind/Customers",
            icon: "mdi mdi-nature-people"
        }),
        (0, Jassi_2.$Class)("northwind/CustomerView"),
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
define("northwind/DetailTest", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/OrderDetails", "jassijs/ui/DBObjectView", "jassijs/ui/Textbox"], function (require, exports, Jassi_3, Property_3, OrderDetails_1, DBObjectView_3, Textbox_3) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DetailTest = void 0;
    let DetailTest = class DetailTest extends DBObjectView_3.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "DetailTest" : "DetailTest " + this.value.id;
        }
        layout(me) {
            me.textbox1 = new Textbox_3.Textbox();
            me.main.add(me.textbox1);
            me.textbox1.bind = [me.databinder, "Order.Customer.id"];
        }
    };
    __decorate([
        (0, Property_3.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof OrderDetails_1.OrderDetails !== "undefined" && OrderDetails_1.OrderDetails) === "function" ? _a : Object)
    ], DetailTest.prototype, "value", void 0);
    DetailTest = __decorate([
        (0, DBObjectView_3.$DBObjectView)({ classname: "northwind.OrderDetails" }),
        (0, Jassi_3.$Class)("northwind.DetailTest"),
        __metadata("design:paramtypes", [])
    ], DetailTest);
    exports.DetailTest = DetailTest;
    async function test() {
        var ret = new DetailTest();
        // ret.value.Order.Customer
        ret["value"] = await OrderDetails_1.OrderDetails.findOne(); //{ relations: ["Order","Order.Customer"] });
        return ret;
    }
    exports.test = test;
});
define("northwind/EmployeesView", ["require", "exports", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Image", "jassijs/ui/Textarea", "jassijs/ui/Calendar", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Employees", "jassijs/ui/DBObjectView"], function (require, exports, ObjectChooser_1, HTMLPanel_1, NumberConverter_2, Image_1, Textarea_2, Calendar_1, Textbox_4, Button_1, Jassi_4, Property_4, Employees_1, DBObjectView_4) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.EmployeesView = void 0;
    let EmployeesView = class EmployeesView extends DBObjectView_4.DBObjectView {
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
            me.titleOfCouttesy = new Textbox_4.Textbox();
            me.firstName = new Textbox_4.Textbox();
            me.lastName = new Textbox_4.Textbox();
            me.title = new Textbox_4.Textbox();
            me.address = new Textbox_4.Textbox();
            me.postalCode = new Textbox_4.Textbox();
            me.city = new Textbox_4.Textbox();
            me.birthDate = new Calendar_1.Calendar();
            me.region = new Textbox_4.Textbox();
            me.state = new Textbox_4.Textbox();
            me.hiredate = new Calendar_1.Calendar();
            me.homephone = new Textbox_4.Textbox();
            me.notes = new Textarea_2.Textarea();
            me.image1 = new Image_1.Image();
            me.photoPath = new Textbox_4.Textbox();
            me.id = new Textbox_4.Textbox();
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
            me.titleOfCouttesy.bind = [me.databinder, "TitleOfCourtesy"];
            me.firstName.x = 80;
            me.firstName.y = 5;
            me.firstName.label = "First name";
            me.firstName.bind = [me.databinder, "FirstName"];
            me.lastName.x = 250;
            me.lastName.y = 5;
            me.lastName.label = "Last Name";
            me.lastName.bind = [me.databinder, "LastName"];
            me.title.x = 420;
            me.title.y = 5;
            me.title.bind = [me.databinder, "Title"];
            me.title.label = "Title";
            me.title.width = 90;
            me.address.x = 5;
            me.address.y = 50;
            me.address.label = "Address";
            me.address.bind = [me.databinder, "Address"];
            me.address.width = 345;
            me.postalCode.x = 5;
            me.postalCode.y = 95;
            me.postalCode.label = "Postal Code";
            me.postalCode.bind = [me.databinder, "PostalCode"];
            me.postalCode.width = 90;
            me.city.x = 110;
            me.city.y = 95;
            me.city.bind = [me.databinder, "City"];
            me.city.label = "City";
            me.city.width = 240;
            me.birthDate.x = 5;
            me.birthDate.y = 190;
            me.birthDate.width = 90;
            me.birthDate.bind = [me.databinder, "BirthDate"];
            me.birthDate.label = "Birth Date";
            me.region.x = 5;
            me.region.y = 140;
            me.region.bind = [me.databinder, "Region"];
            me.region.label = "Region";
            me.region.width = 90;
            me.state.x = 110;
            me.state.y = 140;
            me.state.bind = [me.databinder, "Country"];
            me.state.label = "country";
            me.state.width = 240;
            me.hiredate.x = 110;
            me.hiredate.y = 190;
            me.hiredate.bind = [me.databinder, "HireDate"];
            me.hiredate.label = "Hire Date";
            me.hiredate.width = 85;
            me.homephone.x = 210;
            me.homephone.y = 190;
            me.homephone.bind = [me.databinder, "HomePhone"];
            me.homephone.label = "Home Phone";
            me.homephone.width = 140;
            me.notes.x = 375;
            me.notes.y = 50;
            me.notes.width = 240;
            me.notes.height = 155;
            me.notes.bind = [me.databinder, "Notes"];
            me.notes.label = "Notes";
            me.image1.x = 630;
            me.image1.y = 20;
            me.image1.src = "";
            me.image1.css = {
                background_color: "black",
                border_style: "solid"
            };
            me.image1.width = 125;
            me.image1.bind = [me.databinder, "PhotoPath"];
            me.photoPath.x = 5;
            me.photoPath.y = 240;
            me.photoPath.bind = [me.databinder, "PhotoPath"];
            me.photoPath.label = "Photo Path";
            me.photoPath.width = 460;
            me.id.x = 5;
            me.id.y = 5;
            me.id.width = 60;
            me.id.label = "Id";
            me.id.bind = [me.databinder, "id"];
            me.id.converter = new NumberConverter_2.NumberConverter();
            me.reportsTo.x = 7;
            me.reportsTo.y = 298;
            me.reportsTo.label = "Reports To";
            me.reportsTo.bind = [me.databinder, "ReportsTo"];
            me.reportsTo.template = "{{FirstName}} {{LastName}}";
            me.reportsTo.width = 160;
            me.objectchooser1.x = 170;
            me.objectchooser1.y = 310;
            me.objectchooser1.width = 25;
            me.objectchooser1.height = 25;
            me.objectchooser1.bind = [me.databinder, "ReportsTo"];
            me.objectchooser1.items = "northwind.Employees";
        }
    };
    __decorate([
        (0, Property_4.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Employees_1.Employees !== "undefined" && Employees_1.Employees) === "function" ? _a : Object)
    ], EmployeesView.prototype, "value", void 0);
    EmployeesView = __decorate([
        (0, DBObjectView_4.$DBObjectView)({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        (0, Jassi_4.$Class)("northwind.EmployeesView"),
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
define("northwind/ImportData", ["require", "exports", "jassijs/ui/Button", "jassijs/ui/HTMLPanel", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/util/CSVImport", "jassijs/base/Actions", "jassijs/base/Router", "northwind/remote/OrderDetails", "jassijs/remote/Transaction"], function (require, exports, Button_2, HTMLPanel_2, Jassi_5, Panel_2, CSVImport_1, Actions_1, Router_1, OrderDetails_2, Transaction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ImportData = void 0;
    let ImportData = class ImportData extends Panel_2.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        static async dummy() {
        }
        static async showDialog() {
            Router_1.router.navigate("#do=northwind.ImportData");
        }
        async startImport() {
            var path = "https://uwei.github.io/jassijs/client/northwind/import";
            this.me.IDProtokoll.value = "";
            var s;
            s = await CSVImport_1.CSVImport.startImport(path + "/customers.csv", "northwind.Customer", { "id": "CustomerID" });
            this.me.IDProtokoll.value += "<br>Customer " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/employees.csv", "northwind.Employees", { "id": "EmployeeID" });
            this.me.IDProtokoll.value += "<br>Employees " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/shippers.csv", "northwind.Shippers", { "id": "shipperid" });
            this.me.IDProtokoll.value += "<br>Shippers " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/categories.csv", "northwind.Categories", { "id": "categoryid" });
            this.me.IDProtokoll.value += "<br>Categories " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/suppliers.csv", "northwind.Suppliers", { "id": "supplierid" });
            this.me.IDProtokoll.value += "<br>Suppliers " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/products.csv", "northwind.Products", { "id": "productid", "supplier": "supplierid", "category": "categoryid" });
            this.me.IDProtokoll.value += "<br>Products " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/orders.csv", "northwind.Orders", { "id": "orderid", "customer": "customerid", "employee": "employeeid" }, undefined, async function (data) {
                //before save remove old OrderDetails
                //   debugger;
                var ids = [];
                data.forEach((o) => { ids.push(o.id); });
                var all2 = await OrderDetails_2.OrderDetails.find({ where: "Order.id in (:...ids)", whereParams: { ids: ids } });
                if (all2.length > 0) {
                    var trans = new Transaction_1.Transaction();
                    for (var x = 0; x < all2.length; x++) {
                        trans.add(all2[x], all2[x].remove);
                    }
                    await trans.execute();
                }
            });
            this.me.IDProtokoll.value += "<br>Orders " + s;
            s = await CSVImport_1.CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/order_details.csv", "northwind.OrderDetails", { "order": "orderid", "product": "productid" }, undefined, (data) => {
                debugger;
                data.forEach((o) => { delete o.id; }); //remove id is autoid
            });
            this.me.IDProtokoll.value += "<br>OrderDetails " + s;
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
            me.htmlpanel1.value = "Imports cvs-data from&nbsp;<a href='https://github.com/uwei/jassijs/tree/main/client/northwind/import' data-mce-selected='inline-boundary'>https://github.com/uwei/jassijs/tree/main/client/northwind/import</a><br/><br/>";
            me.htmlpanel1.newlineafter = true;
            me.IDImport.text = "Start Import";
            me.IDImport.onclick(function (event) {
                _this.startImport();
            });
            me.htmlpanel2.newlineafter = true;
        }
    };
    __decorate([
        (0, Actions_1.$Action)({ name: "Northwind", icon: "mdi mdi-warehouse" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImportData, "dummy", null);
    __decorate([
        (0, Actions_1.$Action)({ name: "Northwind/Import sample data", icon: "mdi mdi-database-import" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImportData, "showDialog", null);
    ImportData = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Jassi_5.$Class)("northwind.ImportData"),
        __metadata("design:paramtypes", [])
    ], ImportData);
    exports.ImportData = ImportData;
    async function test() {
        var ret = new ImportData();
        return ret;
    }
    exports.test = test;
});
define("northwind/OrdersView", ["require", "exports", "jassijs/ui/Style", "jassijs/ui/BoxPanel", "jassijs/ui/Repeater", "jassijs/ui/Calendar", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Property", "northwind/remote/Orders", "jassijs/ui/DBObjectView"], function (require, exports, Style_1, BoxPanel_2, Repeater_1, Calendar_2, ObjectChooser_2, HTMLPanel_3, NumberConverter_3, Textbox_5, Jassi_6, Panel_3, Property_5, Orders_1, DBObjectView_5) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.OrdersView = void 0;
    let OrdersView = class OrdersView extends DBObjectView_5.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "OrdersView" : "OrdersView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_5.Textbox();
            me.customername = new HTMLPanel_3.HTMLPanel();
            me.employeename = new HTMLPanel_3.HTMLPanel();
            me.chooseEmployee = new ObjectChooser_2.ObjectChooser();
            me.choosecustomer = new ObjectChooser_2.ObjectChooser();
            me.orderDate = new Calendar_2.Calendar();
            me.requiredDate = new Calendar_2.Calendar();
            me.shippedDate = new Calendar_2.Calendar();
            me.shipVia = new HTMLPanel_3.HTMLPanel();
            me.shipviaChooser = new ObjectChooser_2.ObjectChooser();
            me.freight = new Textbox_5.Textbox();
            me.shipName = new Textbox_5.Textbox();
            me.shipAddress = new Textbox_5.Textbox();
            me.shipPostalCode = new Textbox_5.Textbox();
            me.shipCity = new Textbox_5.Textbox();
            me.shipCountry = new Textbox_5.Textbox();
            me.shipRegion = new Textbox_5.Textbox();
            me.repeater1 = new Repeater_1.Repeater();
            me.panel1 = new Panel_3.Panel();
            me.panel2 = new Panel_3.Panel();
            me.panel3 = new Panel_3.Panel();
            me.boxpanel1 = new BoxPanel_2.BoxPanel();
            me.boxpanel2 = new BoxPanel_2.BoxPanel();
            me.htmlpanel1 = new HTMLPanel_3.HTMLPanel();
            me.htmlpanel2 = new HTMLPanel_3.HTMLPanel();
            me.style1 = new Style_1.Style();
            me.main.add(me.boxpanel1);
            me.main.add(me.boxpanel2);
            me.main.add(me.repeater1);
            me.main.add(me.style1);
            me.id.x = 5;
            me.id.y = 5;
            me.id.converter = new NumberConverter_3.NumberConverter();
            me.id.bind = [me.databinder, "id"];
            me.id.label = "Order ID";
            me.id.width = 70;
            me.id.css = {
                text_align: "right"
            };
            me.customername.x = 10;
            me.customername.y = 5;
            me.customername.width = 265;
            me.customername.template = "{{id}} {{CompanyName}}";
            me.customername.bind = [me.databinder, "Customer"];
            me.customername.value = "VINET Vins et alcools Chevalier";
            me.customername.label = "Customer";
            me.customername.height = 15;
            me.customername.styles = [me.style1];
            me.employeename.x = 10;
            me.employeename.y = 90;
            me.employeename.bind = [me.databinder, "Employee"];
            me.employeename.label = "Employee";
            me.employeename.width = 265;
            me.employeename.value = "5 Steven Buchanan";
            me.employeename.template = "{{id}} {{FirstName}} {{LastName}}";
            me.employeename.styles = [me.style1];
            me.chooseEmployee.x = 275;
            me.chooseEmployee.y = 105;
            me.chooseEmployee.bind = [me.databinder, "Employee"];
            me.chooseEmployee.items = "northwind.Employees";
            me.chooseEmployee.height = 20;
            me.choosecustomer.x = 275;
            me.choosecustomer.y = 15;
            me.choosecustomer.items = "northwind.Customer";
            me.choosecustomer.bind = [me.databinder, "Customer"];
            me.choosecustomer.onchange(function (event) {
                let cust = me.choosecustomer.value;
                me.shipName.value = cust.CompanyName;
                me.shipAddress.value = cust.Address;
                me.shipPostalCode.value = cust.PostalCode;
                me.shipCity.value = cust.City;
                me.shipCountry.value = cust.Country;
                me.shipRegion.value = cust.Region;
            });
            me.orderDate.x = 10;
            me.orderDate.y = 130;
            me.orderDate.bind = [me.databinder, "OrderDate"];
            me.orderDate.label = "Order Date";
            me.orderDate.width = 70;
            me.requiredDate.x = 90;
            me.requiredDate.y = 130;
            me.requiredDate.bind = [me.databinder, "RequiredDate"];
            me.requiredDate.label = "Required Date";
            me.requiredDate.width = 75;
            me.shippedDate.x = 175;
            me.shippedDate.y = 130;
            me.shippedDate.bind = [me.databinder, "ShippedDate"];
            me.shippedDate.width = 75;
            me.shippedDate.label = "Shipped Date";
            me.shipVia.x = 10;
            me.shipVia.y = 45;
            me.shipVia.bind = [me.databinder, "ShipVia"];
            me.shipVia.template = "{{id}} {{CompanyName}}";
            me.shipVia.label = "Ship via";
            me.shipVia.value = "3 Federal Shipping";
            me.shipVia.width = 260;
            me.shipVia.height = 20;
            me.shipVia.styles = [me.style1];
            me.shipviaChooser.x = 275;
            me.shipviaChooser.y = 60;
            me.shipviaChooser.bind = [me.databinder, "ShipVia"];
            me.shipviaChooser.items = "northwind.Shippers";
            me.shipviaChooser.width = 30;
            me.freight.x = 5;
            me.freight.y = 50;
            me.freight.bind = [me.databinder, "Freight"];
            me.freight.width = 70;
            me.freight.label = "Freight";
            me.freight.converter = new NumberConverter_3.NumberConverter();
            me.freight.format = "#.##0,00";
            me.freight.css = {
                text_align: "right"
            };
            me.shipName.x = 5;
            me.shipName.y = 5;
            me.shipName.bind = [me.databinder, "ShipName"];
            me.shipName.width = 220;
            me.shipName.label = "Ship Name";
            me.shipAddress.x = 5;
            me.shipAddress.y = 50;
            me.shipAddress.bind = [me.databinder, "ShipAddress"];
            me.shipAddress.width = 220;
            me.shipAddress.label = "Ship Address";
            me.shipPostalCode.x = 5;
            me.shipPostalCode.y = 95;
            me.shipPostalCode.bind = [me.databinder, "ShipPostalCode"];
            me.shipPostalCode.width = 55;
            me.shipPostalCode.label = "Postal Code";
            me.shipCity.x = 75;
            me.shipCity.y = 95;
            me.shipCity.bind = [me.databinder, "ShipCity"];
            me.shipCity.label = "Ship City";
            me.shipCity.width = 150;
            me.shipCountry.x = 135;
            me.shipCountry.y = 140;
            me.shipCountry.bind = [me.databinder, "ShipCountry"];
            me.shipCountry.label = "Ship Country";
            me.shipCountry.width = 90;
            me.shipRegion.x = 5;
            me.shipRegion.y = 140;
            me.shipRegion.bind = [me.databinder, "ShipRegion"];
            me.shipRegion.label = "Ship Region";
            me.shipRegion.width = 120;
            me.repeater1.bind = [me.databinder, "Details"];
            me.repeater1.width = 675;
            me.repeater1.createRepeatingComponent(function (me) {
                me.detailsQuantity = new Textbox_5.Textbox();
                me.detailsProduct = new HTMLPanel_3.HTMLPanel();
                me.objectchooser1 = new ObjectChooser_2.ObjectChooser();
                this.design.add(me.detailsQuantity);
                this.design.add(me.detailsProduct);
                this.design.add(me.objectchooser1);
                me.detailsQuantity.bind = [me.repeater1.design.databinder, "Quantity"];
                me.detailsQuantity.width = 60;
                me.detailsProduct.width = 530;
                me.detailsProduct.bind = [me.repeater1.design.databinder, "Product"];
                me.detailsProduct.template = "{{ProductName}}";
                me.objectchooser1.bind = [me.repeater1.design.databinder, "Product"];
                me.objectchooser1.items = "northwind.Products";
                me.detailsProduct.css = {
                    overflow: "hidden",
                    margin_top: "5px"
                };
                me.detailsProduct.styles = [me.style1];
            });
            me.panel1.isAbsolute = true;
            me.panel1.height = 185;
            me.panel1.width = 250;
            me.panel1.add(me.shipName);
            me.panel1.add(me.shipAddress);
            me.panel1.add(me.shipPostalCode);
            me.panel1.add(me.shipCity);
            me.panel1.add(me.shipCountry);
            me.panel1.add(me.shipRegion);
            me.panel2.width = 105;
            me.panel2.height = 185;
            me.panel2.isAbsolute = true;
            me.panel2.add(me.id);
            me.panel2.add(me.freight);
            me.panel3.width = 320;
            me.panel3.height = 185;
            me.panel3.isAbsolute = true;
            me.panel3.add(me.customername);
            me.panel3.add(me.choosecustomer);
            me.panel3.add(me.shipVia);
            me.panel3.add(me.shipviaChooser);
            me.panel3.add(me.employeename);
            me.panel3.add(me.chooseEmployee);
            me.panel3.add(me.orderDate);
            me.panel3.add(me.requiredDate);
            me.panel3.add(me.shippedDate);
            me.boxpanel1.horizontal = true;
            me.boxpanel1.add(me.panel1);
            me.boxpanel1.add(me.panel2);
            me.boxpanel1.add(me.panel3);
            me.boxpanel1.height = 230;
            me.boxpanel2.add(me.htmlpanel1);
            me.boxpanel2.add(me.htmlpanel2);
            me.boxpanel2.horizontal = true;
            me.htmlpanel1.value = "Quantity<br>";
            me.htmlpanel1.width = 65;
            me.htmlpanel1.styles = [];
            me.htmlpanel2.value = "Text<br>";
            me.htmlpanel2.width = 100;
            me.style1.css = {};
        }
    };
    __decorate([
        (0, Property_5.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Orders_1.Orders !== "undefined" && Orders_1.Orders) === "function" ? _a : Object)
    ], OrdersView.prototype, "value", void 0);
    OrdersView = __decorate([
        (0, DBObjectView_5.$DBObjectView)({ classname: "northwind.Orders", actionname: "Northwind/Orders", icon: "mdi mdi-script-text" }),
        (0, Jassi_6.$Class)("northwind.OrdersView"),
        __metadata("design:paramtypes", [])
    ], OrdersView);
    exports.OrdersView = OrdersView;
    async function test() {
        var ret = new OrdersView;
        ret["value"] = await Orders_1.Orders.findOne({ id: 10250, relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
define("northwind/ProductView", ["require", "exports", "jassijs/ui/Style", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Products", "jassijs/ui/DBObjectView"], function (require, exports, Style_2, ObjectChooser_3, HTMLPanel_4, Checkbox_1, NumberConverter_4, Textbox_6, Jassi_7, Property_6, Products_1, DBObjectView_6) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ProductView = void 0;
    let ProductView = class ProductView extends DBObjectView_6.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "ProductView" : "ProductView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_6.Textbox();
            me.productName = new Textbox_6.Textbox();
            me.quantityPerUnit = new Textbox_6.Textbox();
            me.unitPrice = new Textbox_6.Textbox();
            me.unitsInStock = new Textbox_6.Textbox();
            me.unitsOnOrder = new Textbox_6.Textbox();
            me.reorderLevel = new Textbox_6.Textbox();
            me.discontinued = new Checkbox_1.Checkbox();
            me.category = new HTMLPanel_4.HTMLPanel();
            me.categoryChooser = new ObjectChooser_3.ObjectChooser();
            me.supplier = new HTMLPanel_4.HTMLPanel();
            me.supplierchooser = new ObjectChooser_3.ObjectChooser();
            me.styleNumber = new Style_2.Style();
            me.main.add(me.id);
            me.main.isAbsolute = true;
            me.main.add(me.styleNumber);
            me.main.add(me.supplierchooser);
            me.main.add(me.supplier);
            me.main.add(me.categoryChooser);
            me.main.add(me.category);
            me.main.add(me.discontinued);
            me.main.add(me.reorderLevel);
            me.main.add(me.unitsOnOrder);
            me.main.add(me.unitsInStock);
            me.main.add(me.unitPrice);
            me.main.add(me.quantityPerUnit);
            me.main.add(me.productName);
            me.main.width = 678;
            me.main.height = "170";
            me.id.x = 10;
            me.id.y = 10;
            me.id.bind = [me.databinder, "id"];
            me.id.label = "Id";
            me.id.width = 65;
            me.id.converter = new NumberConverter_4.NumberConverter();
            me.productName.x = 90;
            me.productName.y = 10;
            me.productName.bind = [me.databinder, "ProductName"];
            me.productName.label = "Product Name";
            me.productName.width = 310;
            me.quantityPerUnit.x = 10;
            me.quantityPerUnit.y = 60;
            me.quantityPerUnit.bind = [me.databinder, "QuantityPerUnit"];
            me.quantityPerUnit.width = 135;
            me.quantityPerUnit.label = "Quantity per Unit";
            me.unitPrice.x = 160;
            me.unitPrice.y = 60;
            me.unitPrice.bind = [me.databinder, "UnitPrice"];
            me.unitPrice.label = "Unit Price";
            me.unitPrice.width = 65;
            me.unitPrice.converter = new NumberConverter_4.NumberConverter();
            me.unitPrice.format = "#.##0,00";
            me.unitPrice.styles = [me.styleNumber];
            me.unitsInStock.x = 240;
            me.unitsInStock.y = 60;
            me.unitsInStock.bind = [me.databinder, "UnitsInStock"];
            me.unitsInStock.label = "Units in Stock";
            me.unitsInStock.width = 70;
            me.unitsInStock.converter = new NumberConverter_4.NumberConverter();
            me.unitsInStock.format = "#.##0,00";
            me.unitsInStock.styles = [me.styleNumber];
            me.unitsOnOrder.x = 325;
            me.unitsOnOrder.y = 60;
            me.unitsOnOrder.bind = [me.databinder, "UnitsOnOrder"];
            me.unitsOnOrder.label = "Units on Order";
            me.unitsOnOrder.width = 75;
            me.unitsOnOrder.converter = new NumberConverter_4.NumberConverter();
            me.unitsOnOrder.format = "#.##0,00";
            me.unitsOnOrder.styles = [me.styleNumber];
            me.reorderLevel.x = 415;
            me.reorderLevel.y = 60;
            me.reorderLevel.bind = [me.databinder, "ReorderLevel"];
            me.reorderLevel.width = 70;
            me.reorderLevel.label = "Reorder Level";
            me.reorderLevel.converter = new NumberConverter_4.NumberConverter();
            me.reorderLevel.styles = [me.styleNumber];
            me.discontinued.x = 415;
            me.discontinued.y = 10;
            me.discontinued.width = 70;
            me.discontinued.bind = [me.databinder, "Discontinued"];
            me.discontinued.label = "Discontinued";
            me.category.x = 10;
            me.category.y = 110;
            me.category.template = "{{CategoryName}}";
            me.category.value = "Condiments";
            me.category.bind = [me.databinder, "Category"];
            me.category.width = 170;
            me.category.label = "Category";
            me.categoryChooser.x = 185;
            me.categoryChooser.y = 125;
            me.categoryChooser.items = "northwind.Categories";
            me.categoryChooser.bind = [me.databinder, "Category"];
            me.categoryChooser.width = 30;
            me.supplier.x = 225;
            me.supplier.y = 110;
            me.supplier.bind = [me.databinder, "Supplier"];
            me.supplier.value = "New Orleans Cajun Delights";
            me.supplier.template = "{{CompanyName}}";
            me.supplier.label = "Supplier";
            me.supplier.width = 230;
            me.supplierchooser.x = 460;
            me.supplierchooser.y = 125;
            me.supplierchooser.bind = [me.databinder, "Supplier"];
            me.supplierchooser.items = "northwind.Suppliers";
            me.styleNumber.x = 442;
            me.styleNumber.y = 183;
            me.styleNumber.css = {
                text_align: "right"
            };
            console.log("main " + me.main._id);
            console.log("this " + this._id);
        }
    };
    __decorate([
        (0, Property_6.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Products_1.Products !== "undefined" && Products_1.Products) === "function" ? _a : Object)
    ], ProductView.prototype, "value", void 0);
    ProductView = __decorate([
        (0, DBObjectView_6.$DBObjectView)({ classname: "northwind.Products", actionname: "Northwind/Products", icon: "mdi mdi-reproduction" }),
        (0, Jassi_7.$Class)("northwind.ProductView"),
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
define("northwind/SampleServerReport", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Registry_1, Property_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.SampleClientReport = exports.SampleServerReport = exports.$Report = exports.ReportProperties = void 0;
    class ReportProperties {
    }
    exports.ReportProperties = ReportProperties;
    function $Report(properties) {
        return function (pclass) {
            Registry_1.default.register("$Report", pclass, properties);
        };
    }
    exports.$Report = $Report;
    let SampleServerReport = class SampleServerReport {
        constructor() {
            this.content = undefined;
        }
        async open() {
            //  this.report.open();
        }
        async download() {
            //  this.report.download();
        }
        async print() {
            // this.report.print();
        }
        async getBase64() {
            //holt sichs vom Server - parameter übertragen
            this.content = undefined; //report;
        }
        //this would be rendered on server
        layout(me) {
            this.content = {
                stack: [
                    {
                        columns: [
                            {
                                stack: [
                                    {
                                        text: "{{name}}{{name2}}"
                                    },
                                ]
                            }
                        ]
                    }
                ]
            };
        }
    };
    __decorate([
        (0, Property_7.$Property)(),
        __metadata("design:type", String)
    ], SampleServerReport.prototype, "name", void 0);
    SampleServerReport = __decorate([
        $Report({ fullPath: "northwind.SampleServerReport", serverReportClass: "northwind.SampleServerReport" })
    ], SampleServerReport);
    exports.SampleServerReport = SampleServerReport;
    let SampleClientReport = class SampleClientReport {
        constructor() {
            this.content = undefined;
        }
        async open() {
            //  this.report.open();
        }
        async download() {
            //  this.report.download();
        }
        async print() {
            // this.report.print();
        }
        async getBase64() {
            //holt sichs vom Server - parameter übertragen
            this.content = undefined; //report;
        }
        layout(me) {
            this.content = {
                stack: [
                    {
                        columns: [
                            {
                                stack: [
                                    {
                                        text: "{{name}}{{name2}}"
                                    },
                                ]
                            }
                        ]
                    }
                ]
            };
        }
    };
    __decorate([
        (0, Property_7.$Property)(),
        __metadata("design:type", String)
    ], SampleClientReport.prototype, "name", void 0);
    SampleClientReport = __decorate([
        $Report({ fullPath: "northwind.SampleServerReport" })
    ], SampleClientReport);
    exports.SampleClientReport = SampleClientReport;
    async function test2() {
        // kk.o=0;
        var dlg = new SampleClientReport();
        dlg.name = "hh";
        this.data = {
            name2: "Hallo"
        };
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test2 = test2;
});
define("northwind/ShippersView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Shippers", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_5, Textbox_7, Jassi_8, Property_8, Shippers_1, DBObjectView_7) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ShippersView = void 0;
    let ShippersView = class ShippersView extends DBObjectView_7.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "ShippersView" : "ShippersView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_7.Textbox();
            me.companyName = new Textbox_7.Textbox();
            me.phone = new Textbox_7.Textbox();
            me.main.add(me.id);
            me.main.isAbsolute = true;
            me.main.height = 110;
            me.main.add(me.phone);
            me.main.add(me.companyName);
            this.width = 626;
            this.height = 146;
            me.id.converter = new NumberConverter_5.NumberConverter();
            me.id.bind = [me.databinder, "id"];
            me.id.label = "Id";
            me.id.width = 40;
            me.id.x = 5;
            me.id.y = 0;
            me.companyName.x = 60;
            me.companyName.y = 0;
            me.companyName.bind = [me.databinder, "CompanyName"];
            me.companyName.label = "Company name";
            me.companyName.width = 160;
            me.phone.x = 5;
            me.phone.y = 50;
            me.phone.width = 215;
            me.phone.bind = [me.databinder, "Phone"];
            me.phone.label = "Phone";
        }
    };
    __decorate([
        (0, Property_8.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Shippers_1.Shippers !== "undefined" && Shippers_1.Shippers) === "function" ? _a : Object)
    ], ShippersView.prototype, "value", void 0);
    ShippersView = __decorate([
        (0, DBObjectView_7.$DBObjectView)({ classname: "northwind.Shippers", actionname: "Northwind/Shippers", icon: "mdi mdi-truck-delivery" }),
        (0, Jassi_8.$Class)("northwind.ShippersView"),
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
define("northwind/SuppliersView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Suppliers", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_6, Textbox_8, Jassi_9, Property_9, Suppliers_1, DBObjectView_8) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SuppliersView = void 0;
    let SuppliersView = class SuppliersView extends DBObjectView_8.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "SuppliersView" : "SuppliersView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_8.Textbox();
            me.companyName = new Textbox_8.Textbox();
            me.contactName = new Textbox_8.Textbox();
            me.contactTitle = new Textbox_8.Textbox();
            me.address = new Textbox_8.Textbox();
            me.postalCode = new Textbox_8.Textbox();
            me.city = new Textbox_8.Textbox();
            me.region = new Textbox_8.Textbox();
            me.Country = new Textbox_8.Textbox();
            me.phone = new Textbox_8.Textbox();
            me.fax = new Textbox_8.Textbox();
            me.homepage = new Textbox_8.Textbox();
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
            me.id.converter = new NumberConverter_6.NumberConverter();
            me.id.width = 50;
            me.id.bind = [me.databinder, "id"];
            me.id.label = "Id";
            me.companyName.x = 75;
            me.companyName.y = 5;
            me.companyName.label = "Company Name";
            me.companyName.bind = [me.databinder, "CompanyName"];
            me.companyName.width = 290;
            me.contactName.x = 10;
            me.contactName.y = 50;
            me.contactName.bind = [me.databinder, "ContactName"];
            me.contactName.label = "Contact Name";
            me.contactTitle.x = 180;
            me.contactTitle.y = 50;
            me.contactTitle.bind = [me.databinder, "ContactTitle"];
            me.contactTitle.label = "Contact Title";
            me.contactTitle.width = 185;
            me.address.x = 10;
            me.address.y = 95;
            me.address.bind = [me.databinder, "Address"];
            me.address.label = "Address";
            me.address.width = 355;
            me.postalCode.x = 10;
            me.postalCode.y = 140;
            me.postalCode.bind = [me.databinder, "PostalCode"];
            me.postalCode.width = 95;
            me.postalCode.label = "Postal Code";
            me.city.x = 120;
            me.city.y = 140;
            me.city.bind = [me.databinder, "City"];
            me.city.label = "City";
            me.city.width = 245;
            me.region.x = 10;
            me.region.y = 185;
            me.region.bind = [me.databinder, "Region"];
            me.region.label = "Region";
            me.region.width = 155;
            me.Country.x = 180;
            me.Country.y = 185;
            me.Country.bind = [me.databinder, "Country"];
            me.Country.label = "Country";
            me.Country.width = 185;
            me.phone.x = 10;
            me.phone.y = 230;
            me.phone.bind = [me.databinder, "Phone"];
            me.phone.label = "Phone";
            me.phone.width = 155;
            me.fax.x = 180;
            me.fax.y = 230;
            me.fax.bind = [me.databinder, "Fax"];
            me.fax.label = "Fax";
            me.fax.width = 185;
            me.homepage.x = 10;
            me.homepage.y = 275;
            me.homepage.bind = [me.databinder, "HomePage"];
            me.homepage.label = "Home Page";
            me.homepage.width = 355;
        }
    };
    __decorate([
        (0, Property_9.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Suppliers_1.Suppliers !== "undefined" && Suppliers_1.Suppliers) === "function" ? _a : Object)
    ], SuppliersView.prototype, "value", void 0);
    SuppliersView = __decorate([
        (0, DBObjectView_8.$DBObjectView)({ classname: "northwind.Suppliers", actionname: "Northwind/Suppliers", icon: "mdi mdi-office-building-outline" }),
        (0, Jassi_9.$Class)("northwind.SuppliersView"),
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
                "date": 1654900468138,
                "northwind.CategoriesView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Categories",
                            "actionname": "Northwind/Categories",
                            "icon": "mdi mdi-cube"
                        }
                    ],
                    "@members": {
                        "value": {
                            "$Property": [
                                {
                                    "isUrlTag": true,
                                    "id": true,
                                    "editor": "jassijs.ui.PropertyEditors.DBObjectEditor"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/CustomerView.ts": {
                "date": 1654704542347,
                "northwind/CustomerView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Customer",
                            "actionname": "Northwind/Customers",
                            "icon": "mdi mdi-nature-people"
                        }
                    ],
                    "@members": {
                        "value": {
                            "$Property": [
                                {
                                    "isUrlTag": true,
                                    "id": true,
                                    "editor": "jassijs.ui.PropertyEditors.DBObjectEditor"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/DetailTest.ts": {
                "date": 1654704557145,
                "northwind.DetailTest": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.OrderDetails"
                        }
                    ],
                    "@members": {
                        "value": {
                            "$Property": [
                                {
                                    "isUrlTag": true,
                                    "id": true,
                                    "editor": "jassijs.ui.PropertyEditors.DBObjectEditor"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/EmployeesView.ts": {
                "date": 1654704628942,
                "northwind.EmployeesView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Employees",
                            "actionname": "Northwind/Employees",
                            "icon": "mdi mdi-account-tie"
                        }
                    ],
                    "@members": {
                        "value": {
                            "$Property": [
                                {
                                    "isUrlTag": true,
                                    "id": true,
                                    "editor": "jassijs.ui.PropertyEditors.DBObjectEditor"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/ImportData.ts": {
                "date": 1635898120000,
                "northwind.ImportData": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "dummy": {
                            "$Action": [
                                {
                                    "name": "Northwind",
                                    "icon": "mdi mdi-warehouse"
                                }
                            ]
                        },
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Northwind/Import sample data",
                                    "icon": "mdi mdi-database-import"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/modul.ts": {
                "date": 1613551044000
            },
            "northwind/OrdersView.ts": {
                "date": 1654704725860,
                "northwind.OrdersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Orders",
                            "actionname": "Northwind/Orders",
                            "icon": "mdi mdi-script-text"
                        }
                    ],
                    "@members": {
                        "value": {
                            "$Property": [
                                {
                                    "isUrlTag": true,
                                    "id": true,
                                    "editor": "jassijs.ui.PropertyEditors.DBObjectEditor"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/ProductView.ts": {
                "date": 1654705913406,
                "northwind.ProductView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Products",
                            "actionname": "Northwind/Products",
                            "icon": "mdi mdi-reproduction"
                        }
                    ],
                    "@members": {
                        "value": {
                            "$Property": [
                                {
                                    "isUrlTag": true,
                                    "id": true,
                                    "editor": "jassijs.ui.PropertyEditors.DBObjectEditor"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/remote/Categories.ts": {
                "date": 1623093052000,
                "northwind.Categories": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "CategoryName": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Description": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Picture": {
                            "Column": []
                        },
                        "Products": {
                            "OneToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "northwind/remote/Customer.ts": {
                "date": 1622985442000,
                "northwind.Customer": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "CompanyName": {
                            "Column": []
                        },
                        "ContactName": {
                            "Column": []
                        },
                        "ContactTitle": {
                            "Column": []
                        },
                        "Address": {
                            "Column": []
                        },
                        "City": {
                            "Column": []
                        },
                        "Region": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PostalCode": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Country": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Phone": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Fax": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/remote/Employees.ts": {
                "date": 1623093100000,
                "northwind.Employees": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "LastName": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "FirstName": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Title": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "TitleOfCourtesy": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Address": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "City": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Region": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PostalCode": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Country": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "HomePhone": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Extension": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Photo": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Notes": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PhotoPath": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ReportsTo": {
                            "JoinColumn": [],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "BirthDate": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "HireDate": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/remote/OrderDetails.ts": {
                "date": 1622985446000,
                "northwind.OrderDetails": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryGeneratedColumn": []
                        },
                        "Order": {
                            "ManyToOne": [
                                "function",
                                "function"
                            ]
                        },
                        "Product": {
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "UnitPrice": {
                            "Column": [
                                {
                                    "nullable": false,
                                    "type": "decimal"
                                }
                            ]
                        },
                        "Quantity": {
                            "Column": []
                        },
                        "Discount": {
                            "Column": [
                                {
                                    "nullable": true,
                                    "type": "decimal"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/remote/Orders.ts": {
                "date": 1635891936000,
                "northwind.Orders": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "Customer": {
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "Employee": {
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "OrderDate": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "RequiredDate": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShippedDate": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipVia": {
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "Freight": {
                            "Column": [
                                {
                                    "nullable": true,
                                    "type": "decimal"
                                }
                            ]
                        },
                        "ShipName": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipAddress": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipCity": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipRegion": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipPostalCode": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipCountry": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Details": {
                            "OneToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "northwind/remote/Products.ts": {
                "date": 1623093058000,
                "northwind.Products": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "ProductName": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Supplier": {
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "Category": {
                            "ManyToOne": [
                                "function",
                                "function"
                            ]
                        },
                        "QuantityPerUnit": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "UnitPrice": {
                            "Column": [
                                {
                                    "nullable": true,
                                    "type": "decimal"
                                }
                            ]
                        },
                        "UnitsInStock": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "UnitsOnOrder": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ReorderLevel": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Discontinued": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/remote/Shippers.ts": {
                "date": 1622985454000,
                "northwind.Shippers": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "CompanyName": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Phone": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/remote/Suppliers.ts": {
                "date": 1622985456000,
                "northwind.Suppliers": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "CompanyName": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ContactName": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ContactTitle": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Address": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "City": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Region": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PostalCode": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Country": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Phone": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Fax": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "HomePage": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/SampleServerReport.ts": {
                "date": 1625946850000
            },
            "northwind/ShippersView.ts": {
                "date": 1654705983583,
                "northwind.ShippersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Shippers",
                            "actionname": "Northwind/Shippers",
                            "icon": "mdi mdi-truck-delivery"
                        }
                    ],
                    "@members": {
                        "value": {
                            "$Property": [
                                {
                                    "isUrlTag": true,
                                    "id": true,
                                    "editor": "jassijs.ui.PropertyEditors.DBObjectEditor"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/SuppliersView.ts": {
                "date": 1654705965374,
                "northwind.SuppliersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Suppliers",
                            "actionname": "Northwind/Suppliers",
                            "icon": "mdi mdi-office-building-outline"
                        }
                    ],
                    "@members": {
                        "value": {
                            "$Property": [
                                {
                                    "isUrlTag": true,
                                    "id": true,
                                    "editor": "jassijs.ui.PropertyEditors.DBObjectEditor"
                                }
                            ]
                        }
                    }
                }
            }
        }
    };
});
define("northwind/remote/Categories", ["require", "exports", "northwind/remote/Products", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema"], function (require, exports, Products_2, DBObject_1, Jassi_10, DatabaseSchema_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Categories = void 0;
    let Categories = class Categories extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Categories.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "CategoryName", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "Description", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], Categories.prototype, "Picture", void 0);
    __decorate([
        (0, DatabaseSchema_1.OneToMany)(type => Products_2.Products, e => e.Category),
        __metadata("design:type", typeof (_a = typeof Products_2.Products !== "undefined" && Products_2.Products) === "function" ? _a : Object)
    ], Categories.prototype, "Products", void 0);
    Categories = __decorate([
        (0, DBObject_1.$DBObject)(),
        (0, Jassi_10.$Class)("northwind.Categories"),
        __metadata("design:paramtypes", [])
    ], Categories);
    exports.Categories = Categories;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Customer", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema"], function (require, exports, DBObject_2, Jassi_11, DatabaseSchema_2) {
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
        (0, DatabaseSchema_2.PrimaryColumn)(),
        __metadata("design:type", String)
    ], Customer.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "CompanyName", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "ContactName", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "ContactTitle", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "Address", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "City", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Region", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "PostalCode", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Country", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Phone", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Fax", void 0);
    Customer = __decorate([
        (0, DBObject_2.$DBObject)(),
        (0, Jassi_11.$Class)("northwind.Customer"),
        __metadata("design:paramtypes", [])
    ], Customer);
    exports.Customer = Customer;
    async function test() {
        var all = await Customer.find();
        //var cus2=<Customer>await Customer.findOne();
        //debugger;
        //await Kunde.sample();
        //	new de.Kunde().generate();
        //jassijs.db.uploadType(de.Kunde);
    }
    exports.test = test;
    ;
});
define("northwind/remote/Employees", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema", "jassijs/remote/Transaction"], function (require, exports, DBObject_3, Jassi_12, DatabaseSchema_3, Transaction_2) {
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
                var man = await (await new Promise((resolve_1, reject_1) => { require(["jassijs/server/DBManager"], resolve_1, reject_1); })).DBManager.get();
                return man.find(context, this, options);
            }
        }
        async hallo(num) {
            if (!Jassi_12.default.isServer) {
                var ret = await this.call(this, this.hallo, num);
                return ret * 10;
            }
            else {
                return num + 1;
                // return ["jassijs/base/ChromeDebugger.ts"];
            }
        }
    };
    __decorate([
        (0, DatabaseSchema_3.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Employees.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "LastName", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "FirstName", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Title", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "TitleOfCourtesy", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Address", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "City", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Region", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PostalCode", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Country", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "HomePhone", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Extension", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Photo", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Notes", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PhotoPath", void 0);
    __decorate([
        (0, DatabaseSchema_3.JoinColumn)(),
        (0, DatabaseSchema_3.ManyToOne)(type => Employees_2),
        __metadata("design:type", Employees)
    ], Employees.prototype, "ReportsTo", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", Date)
    ], Employees.prototype, "BirthDate", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", Date)
    ], Employees.prototype, "HireDate", void 0);
    Employees = Employees_2 = __decorate([
        (0, DBObject_3.$DBObject)(),
        (0, Jassi_12.$Class)("northwind.Employees"),
        __metadata("design:paramtypes", [])
    ], Employees);
    exports.Employees = Employees;
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    async function test() {
        var all = await Employees.find({ where: "id>:p", whereParams: { p: 5 } });
    }
    exports.test = test;
    async function test2() {
        var em = new Employees();
        em.id = getRandomInt(100000);
        var em2 = new Employees();
        em2.id = getRandomInt(100000);
        var trans = new Transaction_2.Transaction();
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
define("northwind/remote/OrderDetails", ["require", "exports", "northwind/remote/Products", "northwind/remote/Orders", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema"], function (require, exports, Products_3, Orders_2, DBObject_4, Jassi_13, DatabaseSchema_4) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.OrderDetails = void 0;
    let OrderDetails = class OrderDetails extends DBObject_4.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_4.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_4.ManyToOne)(type => Orders_2.Orders, e => e.Details),
        __metadata("design:type", typeof (_a = typeof Orders_2.Orders !== "undefined" && Orders_2.Orders) === "function" ? _a : Object)
    ], OrderDetails.prototype, "Order", void 0);
    __decorate([
        (0, DatabaseSchema_4.ManyToOne)(type => Products_3.Products),
        __metadata("design:type", typeof (_b = typeof Products_3.Products !== "undefined" && Products_3.Products) === "function" ? _b : Object)
    ], OrderDetails.prototype, "Product", void 0);
    __decorate([
        (0, DatabaseSchema_4.Column)({ nullable: false, type: "decimal" }),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "UnitPrice", void 0);
    __decorate([
        (0, DatabaseSchema_4.Column)(),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "Quantity", void 0);
    __decorate([
        (0, DatabaseSchema_4.Column)({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "Discount", void 0);
    OrderDetails = __decorate([
        (0, DBObject_4.$DBObject)(),
        (0, Jassi_13.$Class)("northwind.OrderDetails"),
        __metadata("design:paramtypes", [])
    ], OrderDetails);
    exports.OrderDetails = OrderDetails;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Orders", ["require", "exports", "northwind/remote/OrderDetails", "northwind/remote/Employees", "northwind/remote/Customer", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema", "northwind/remote/Shippers"], function (require, exports, OrderDetails_3, Employees_3, Customer_2, DBObject_5, Jassi_14, DatabaseSchema_5, Shippers_2) {
    "use strict";
    var _a, _b, _c;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Orders = void 0;
    let Orders = class Orders extends DBObject_5.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_5.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Orders.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_5.ManyToOne)(type => Customer_2.Customer),
        __metadata("design:type", typeof (_a = typeof Customer_2.Customer !== "undefined" && Customer_2.Customer) === "function" ? _a : Object)
    ], Orders.prototype, "Customer", void 0);
    __decorate([
        (0, DatabaseSchema_5.ManyToOne)(type => Employees_3.Employees),
        __metadata("design:type", typeof (_b = typeof Employees_3.Employees !== "undefined" && Employees_3.Employees) === "function" ? _b : Object)
    ], Orders.prototype, "Employee", void 0);
    __decorate([
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", Date)
    ], Orders.prototype, "OrderDate", void 0);
    __decorate([
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", Date)
    ], Orders.prototype, "RequiredDate", void 0);
    __decorate([
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", Date)
    ], Orders.prototype, "ShippedDate", void 0);
    __decorate([
        (0, DatabaseSchema_5.ManyToOne)(type => Shippers_2.Shippers),
        __metadata("design:type", typeof (_c = typeof Shippers_2.Shippers !== "undefined" && Shippers_2.Shippers) === "function" ? _c : Object)
    ], Orders.prototype, "ShipVia", void 0);
    __decorate([
        (0, DatabaseSchema_5.Column)({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], Orders.prototype, "Freight", void 0);
    __decorate([
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipName", void 0);
    __decorate([
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipAddress", void 0);
    __decorate([
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipCity", void 0);
    __decorate([
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipRegion", void 0);
    __decorate([
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipPostalCode", void 0);
    __decorate([
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipCountry", void 0);
    __decorate([
        (0, DatabaseSchema_5.OneToMany)(type => OrderDetails_3.OrderDetails, e => e.Order),
        __metadata("design:type", Array)
    ], Orders.prototype, "Details", void 0);
    Orders = __decorate([
        (0, DBObject_5.$DBObject)(),
        (0, Jassi_14.$Class)("northwind.Orders"),
        __metadata("design:paramtypes", [])
    ], Orders);
    exports.Orders = Orders;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Products", ["require", "exports", "northwind/remote/Categories", "northwind/remote/Suppliers", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema"], function (require, exports, Categories_2, Suppliers_2, DBObject_6, Jassi_15, DatabaseSchema_6) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Products = void 0;
    let Products = class Products extends DBObject_6.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_6.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Products.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "ProductName", void 0);
    __decorate([
        (0, DatabaseSchema_6.ManyToOne)(type => Suppliers_2.Suppliers),
        __metadata("design:type", typeof (_a = typeof Suppliers_2.Suppliers !== "undefined" && Suppliers_2.Suppliers) === "function" ? _a : Object)
    ], Products.prototype, "Supplier", void 0);
    __decorate([
        (0, DatabaseSchema_6.ManyToOne)(type => Categories_2.Categories, e => e.Products),
        __metadata("design:type", typeof (_b = typeof Categories_2.Categories !== "undefined" && Categories_2.Categories) === "function" ? _b : Object)
    ], Products.prototype, "Category", void 0);
    __decorate([
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "QuantityPerUnit", void 0);
    __decorate([
        (0, DatabaseSchema_6.Column)({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitPrice", void 0);
    __decorate([
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsInStock", void 0);
    __decorate([
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsOnOrder", void 0);
    __decorate([
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "ReorderLevel", void 0);
    __decorate([
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", Boolean)
    ], Products.prototype, "Discontinued", void 0);
    Products = __decorate([
        (0, DBObject_6.$DBObject)(),
        (0, Jassi_15.$Class)("northwind.Products"),
        __metadata("design:paramtypes", [])
    ], Products);
    exports.Products = Products;
    async function test() {
        var p = await Products.findOne();
    }
    exports.test = test;
    ;
});
define("northwind/remote/Shippers", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema"], function (require, exports, DBObject_7, Jassi_16, DatabaseSchema_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Shippers = void 0;
    let Shippers = class Shippers extends DBObject_7.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_7.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Shippers.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_7.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Shippers.prototype, "CompanyName", void 0);
    __decorate([
        (0, DatabaseSchema_7.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Shippers.prototype, "Phone", void 0);
    Shippers = __decorate([
        (0, DBObject_7.$DBObject)(),
        (0, Jassi_16.$Class)("northwind.Shippers"),
        __metadata("design:paramtypes", [])
    ], Shippers);
    exports.Shippers = Shippers;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Suppliers", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema"], function (require, exports, DBObject_8, Jassi_17, DatabaseSchema_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Suppliers = void 0;
    let Suppliers = class Suppliers extends DBObject_8.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_8.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Suppliers.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "CompanyName", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "ContactName", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "ContactTitle", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Address", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "City", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Region", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "PostalCode", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Country", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Phone", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Fax", void 0);
    __decorate([
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "HomePage", void 0);
    Suppliers = __decorate([
        (0, DBObject_8.$DBObject)(),
        (0, Jassi_17.$Class)("northwind.Suppliers"),
        __metadata("design:paramtypes", [])
    ], Suppliers);
    exports.Suppliers = Suppliers;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=northwind.js.map