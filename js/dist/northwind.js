var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define("northwind/CategoriesView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Table", "jassijs/ui/BoxPanel", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Property", "northwind/remote/Categories", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Table_1, BoxPanel_1, Textarea_1, Textbox_1, Registry_1, Panel_1, Property_1, Categories_1, DBObjectView_1) {
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
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.Id = new Textbox_1.Textbox();
            me.name = new Textbox_1.Textbox();
            me.description = new Textarea_1.Textarea();
            me.panel1 = new Panel_1.Panel();
            me.table1 = new Table_1.Table();
            this.me.main.config({ children: [
                    me.boxpanel1.config({
                        children: [
                            me.Id.config({
                                label: "Id",
                                bind: [me.databinder, "id"],
                                width: 40,
                                converter: new NumberConverter_1.NumberConverter()
                            }),
                            me.name.config({
                                bind: [me.databinder, "CategoryName"],
                                label: "Name",
                                width: 225
                            })
                        ],
                        width: 80,
                        horizontal: true
                    }),
                    me.description.config({
                        height: 70,
                        width: 280,
                        bind: [me.databinder, "Description"],
                        label: "Description"
                    }),
                    me.panel1.config({}),
                    me.table1.config({
                        height: "100%",
                        bindItems: [me.databinder, "Products"],
                        width: "100%"
                    })
                ] });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Categories_1.Categories !== "undefined" && Categories_1.Categories) === "function" ? _a : Object)
    ], CategoriesView.prototype, "value", void 0);
    CategoriesView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Categories", actionname: "Northwind/Categories", icon: "mdi mdi-cube" }),
        (0, Registry_1.$Class)("northwind.CategoriesView"),
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
define("northwind/CustomerView", ["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Customer", "jassijs/ui/DBObjectView"], function (require, exports, Textbox_2, Registry_2, Property_2, Customer_1, DBObjectView_2) {
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
            this.me.main.config({
                isAbsolute: true,
                width: 560,
                height: "300",
                children: [
                    me.id.config({
                        x: 10,
                        y: 5,
                        bind: [me.databinder, "id"],
                        width: 65,
                        label: "id"
                    }),
                    me.companyname.config({
                        x: 195,
                        y: 45,
                        bind: [me.databinder, "CompanyName"],
                        label: "Company Name",
                        width: 155
                    }),
                    me.contacttitle.config({
                        x: 10,
                        y: 45,
                        label: "Contact Title",
                        bind: [me.databinder, "ContactTitle"]
                    }),
                    me.contactname.config({
                        x: 90,
                        y: 5,
                        label: "Contact Name",
                        bind: [me.databinder, "ContactName"],
                        width: 260
                    }),
                    me.address.config({
                        x: 10,
                        y: 90,
                        bind: [me.databinder, "Address"],
                        label: "Address",
                        width: 340
                    }),
                    me.postalcode.config({
                        x: 10,
                        y: 140,
                        label: "Postal Code",
                        bind: [me.databinder, "PostalCode"],
                        width: 90
                    }),
                    me.textbox1.config({
                        x: 100,
                        y: 140,
                        label: "City",
                        width: 250,
                        bind: [me.databinder, "City"]
                    }),
                    me.region.config({
                        x: 10,
                        y: 185,
                        bind: [me.databinder, "Region"],
                        label: "Region"
                    }),
                    me.textbox2.config({
                        x: 195,
                        y: 185,
                        label: "Country",
                        bind: [me.databinder, "Country"]
                    }),
                    me.phone.config({
                        x: 10,
                        y: 230,
                        label: "Phone",
                        bind: [me.databinder, "Phone"]
                    }),
                    me.fax.config({
                        x: 195,
                        y: 230,
                        label: "Fax",
                        bind: [me.databinder, "Fax"]
                    })
                ]
            });
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
        (0, Registry_2.$Class)("northwind/CustomerView"),
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
define("northwind/DetailTest", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/OrderDetails", "jassijs/ui/DBObjectView", "jassijs/ui/Textbox"], function (require, exports, Registry_3, Property_3, OrderDetails_1, DBObjectView_3, Textbox_3) {
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
        (0, Registry_3.$Class)("northwind.DetailTest"),
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
define("northwind/EmployeesView", ["require", "exports", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Image", "jassijs/ui/Textarea", "jassijs/ui/Calendar", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Employees", "jassijs/ui/DBObjectView"], function (require, exports, ObjectChooser_1, HTMLPanel_1, NumberConverter_2, Image_1, Textarea_2, Calendar_1, Textbox_4, Registry_4, Property_4, Employees_1, DBObjectView_4) {
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
            me.firstName = new Textbox_4.Textbox();
            me.lastName = new Textbox_4.Textbox();
            me.title = new Textbox_4.Textbox();
            me.titleOfCouttesy = new Textbox_4.Textbox();
            me.address = new Textbox_4.Textbox();
            me.postalCode = new Textbox_4.Textbox();
            me.city = new Textbox_4.Textbox();
            me.region = new Textbox_4.Textbox();
            me.state = new Textbox_4.Textbox();
            me.birthDate = new Calendar_1.Calendar();
            me.hiredate = new Calendar_1.Calendar();
            me.homephone = new Textbox_4.Textbox();
            me.notes = new Textarea_2.Textarea();
            me.image1 = new Image_1.Image();
            me.photoPath = new Textbox_4.Textbox();
            me.id = new Textbox_4.Textbox();
            me.reportsTo = new HTMLPanel_1.HTMLPanel();
            me.objectchooser1 = new ObjectChooser_1.ObjectChooser();
            this.me.main.config({
                children: [
                    me.firstName.config({
                        x: 80,
                        y: 5,
                        label: "First name",
                        bind: [me.databinder, "FirstName"]
                    }),
                    me.lastName.config({
                        x: 250,
                        y: 5,
                        label: "Last Name",
                        bind: [me.databinder, "LastName"]
                    }),
                    me.title.config({
                        x: 420,
                        y: 5,
                        bind: [me.databinder, "Title"],
                        label: "Title",
                        width: 90
                    }),
                    me.titleOfCouttesy.config({
                        x: 525,
                        y: 5,
                        label: "Title of C.",
                        width: 85,
                        bind: [me.databinder, "TitleOfCourtesy"]
                    }),
                    me.address.config({
                        x: 5,
                        y: 50,
                        label: "Address",
                        bind: [me.databinder, "Address"],
                        width: 345
                    }),
                    me.postalCode.config({
                        x: 5,
                        y: 95,
                        label: "Postal Code",
                        bind: [me.databinder, "PostalCode"],
                        width: 90
                    }),
                    me.city.config({
                        x: 110,
                        y: 95,
                        bind: [me.databinder, "City"],
                        label: "City",
                        width: 240
                    }),
                    me.region.config({
                        x: 5,
                        y: 140,
                        bind: [me.databinder, "Region"],
                        label: "Region",
                        width: 90
                    }),
                    me.state.config({
                        x: 110,
                        y: 140,
                        bind: [me.databinder, "Country"],
                        label: "country",
                        width: 240
                    }),
                    me.birthDate.config({
                        x: 5,
                        y: 190,
                        width: 90,
                        bind: [me.databinder, "BirthDate"],
                        label: "Birth Date"
                    }),
                    me.hiredate.config({
                        x: 110,
                        y: 190,
                        bind: [me.databinder, "HireDate"],
                        label: "Hire Date",
                        width: 85
                    }),
                    me.homephone.config({
                        x: 210,
                        y: 190,
                        bind: [me.databinder, "HomePhone"],
                        label: "Home Phone",
                        width: 140
                    }),
                    me.notes.config({
                        x: 375,
                        y: 50,
                        width: 240,
                        height: 155,
                        bind: [me.databinder, "Notes"],
                        label: "Notes"
                    }),
                    me.image1.config({
                        x: 630,
                        y: 20,
                        src: "",
                        css: {
                            background_color: "black",
                            border_style: "solid"
                        },
                        width: 125,
                        bind: [me.databinder, "PhotoPath"]
                    }),
                    me.photoPath.config({
                        x: 5,
                        y: 240,
                        bind: [me.databinder, "PhotoPath"],
                        label: "Photo Path",
                        width: 460
                    }),
                    me.id.config({
                        x: 5,
                        y: 5,
                        width: 60,
                        label: "Id",
                        bind: [me.databinder, "id"],
                        converter: new NumberConverter_2.NumberConverter()
                    }),
                    me.reportsTo.config({
                        x: 7,
                        y: 298,
                        label: "Reports To",
                        bind: [me.databinder, "ReportsTo"],
                        template: "{{FirstName}} {{LastName}}",
                        width: 160
                    }),
                    me.objectchooser1.config({
                        x: 170,
                        y: 310,
                        width: 25,
                        height: 25,
                        bind: [me.databinder, "ReportsTo"],
                        items: "northwind.Employees"
                    })
                ],
                isAbsolute: true,
                width: "900",
                height: "900"
            });
        }
    };
    __decorate([
        (0, Property_4.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Employees_1.Employees !== "undefined" && Employees_1.Employees) === "function" ? _a : Object)
    ], EmployeesView.prototype, "value", void 0);
    EmployeesView = __decorate([
        (0, DBObjectView_4.$DBObjectView)({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        (0, Registry_4.$Class)("northwind.EmployeesView"),
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
define("northwind/ImportData", ["require", "exports", "jassijs/ui/Button", "jassijs/ui/HTMLPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/util/CSVImport", "jassijs/base/Actions", "jassijs/base/Router", "northwind/remote/OrderDetails", "jassijs/remote/Transaction"], function (require, exports, Button_1, HTMLPanel_2, Registry_5, Panel_2, CSVImport_1, Actions_1, Router_1, OrderDetails_2, Transaction_1) {
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
            me.IDImport = new Button_1.Button();
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
        (0, Registry_5.$Class)("northwind.ImportData"),
        __metadata("design:paramtypes", [])
    ], ImportData);
    exports.ImportData = ImportData;
    async function test() {
        var ret = new ImportData();
        return ret;
    }
    exports.test = test;
});
define("northwind/OrdersView", ["require", "exports", "jassijs/ui/Style", "jassijs/ui/BoxPanel", "jassijs/ui/Repeater", "jassijs/ui/Calendar", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Property", "northwind/remote/Orders", "jassijs/ui/DBObjectView"], function (require, exports, Style_1, BoxPanel_2, Repeater_1, Calendar_2, ObjectChooser_2, HTMLPanel_3, NumberConverter_3, Textbox_5, Registry_6, Panel_3, Property_5, Orders_1, DBObjectView_5) {
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
            me.boxpanel1 = new BoxPanel_2.BoxPanel();
            me.panel1 = new Panel_3.Panel();
            me.shipName = new Textbox_5.Textbox();
            me.shipAddress = new Textbox_5.Textbox();
            me.shipPostalCode = new Textbox_5.Textbox();
            me.shipCity = new Textbox_5.Textbox();
            me.shipCountry = new Textbox_5.Textbox();
            me.shipRegion = new Textbox_5.Textbox();
            me.panel2 = new Panel_3.Panel();
            me.id = new Textbox_5.Textbox();
            me.freight = new Textbox_5.Textbox();
            me.panel3 = new Panel_3.Panel();
            me.customername = new HTMLPanel_3.HTMLPanel();
            me.choosecustomer = new ObjectChooser_2.ObjectChooser();
            me.shipVia = new HTMLPanel_3.HTMLPanel();
            me.shipviaChooser = new ObjectChooser_2.ObjectChooser();
            me.employeename = new HTMLPanel_3.HTMLPanel();
            me.chooseEmployee = new ObjectChooser_2.ObjectChooser();
            me.orderDate = new Calendar_2.Calendar();
            me.requiredDate = new Calendar_2.Calendar();
            me.shippedDate = new Calendar_2.Calendar();
            me.boxpanel2 = new BoxPanel_2.BoxPanel();
            me.htmlpanel1 = new HTMLPanel_3.HTMLPanel();
            me.htmlpanel2 = new HTMLPanel_3.HTMLPanel();
            me.repeater1 = new Repeater_1.Repeater();
            me.style1 = new Style_1.Style();
            this.me.main.add(me.boxpanel1);
            this.me.main.add(me.boxpanel2);
            this.me.main.add(me.repeater1);
            this.me.main.add(me.style1);
            me.boxpanel1.add(me.panel1);
            me.boxpanel1.add(me.panel2);
            me.boxpanel1.add(me.panel3);
            me.boxpanel1.height = 230;
            me.boxpanel1.horizontal = true;
            me.panel1.add(me.shipName);
            me.panel1.add(me.shipAddress);
            me.panel1.add(me.shipPostalCode);
            me.panel1.add(me.shipCity);
            me.panel1.add(me.shipCountry);
            me.panel1.add(me.shipRegion);
            me.panel1.width = 250;
            me.panel1.height = 185;
            me.panel1.isAbsolute = true;
            me.panel2.add(me.id);
            me.panel2.add(me.freight);
            me.panel2.isAbsolute = true;
            me.panel2.height = 185;
            me.panel2.width = 105;
            me.panel3.add(me.customername);
            me.panel3.add(me.choosecustomer);
            me.panel3.add(me.shipVia);
            me.panel3.add(me.shipviaChooser);
            me.panel3.add(me.employeename);
            me.panel3.add(me.chooseEmployee);
            me.panel3.add(me.orderDate);
            me.panel3.add(me.requiredDate);
            me.panel3.add(me.shippedDate);
            me.panel3.isAbsolute = true;
            me.panel3.height = 185;
            me.panel3.width = 320;
            me.boxpanel2.add(me.htmlpanel1);
            me.boxpanel2.add(me.htmlpanel2);
            me.boxpanel2.horizontal = true;
            me.repeater1.createRepeatingComponent(function (me) {
                me.detailsQuantity = new Textbox_5.Textbox();
                me.detailsProduct = new HTMLPanel_3.HTMLPanel();
                me.objectchooser1 = new ObjectChooser_2.ObjectChooser();
                me.repeater1.design.add(me.detailsQuantity);
                me.repeater1.design.add(me.detailsProduct);
                me.repeater1.design.add(me.objectchooser1);
                me.detailsQuantity.bind = [me.repeater1.design.databinder, "Quantity"];
                me.detailsQuantity.width = 60;
                me.detailsProduct.width = 530;
                me.detailsProduct.bind = [me.repeater1.design.databinder, "Product"];
                me.detailsProduct.template = "{{ProductName}}";
                me.detailsProduct.css = {
                    overflow: "hidden",
                    margin_top: "5px"
                };
                me.detailsProduct.styles = [me.style1];
                me.objectchooser1.bind = [me.repeater1.design.databinder, "Product"];
                me.objectchooser1.items = "northwind.Products";
            });
            me.repeater1.width = 675;
            me.repeater1.bind = [me.databinder, "Details"];
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
            me.id.x = 5;
            me.id.y = 5;
            me.id.converter = new NumberConverter_3.NumberConverter();
            me.id.bind = [me.databinder, "id"];
            me.id.label = "Order ID";
            me.id.width = 70;
            me.id.css = {
                text_align: "right"
            };
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
            me.customername.x = 10;
            me.customername.y = 5;
            me.customername.width = 265;
            me.customername.template = "{{id}} {{CompanyName}}";
            me.customername.bind = [me.databinder, "Customer"];
            me.customername.value = "VINET Vins et alcools Chevalier";
            me.customername.label = "Customer";
            me.customername.height = 15;
            me.customername.styles = [me.style1];
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
        (0, Registry_6.$Class)("northwind.OrdersView"),
        __metadata("design:paramtypes", [])
    ], OrdersView);
    exports.OrdersView = OrdersView;
    async function test() {
        var ret = new OrdersView;
        ret["value"] = await Orders_1.Orders.findOne({ id: 10249, relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
define("northwind/ProductView", ["require", "exports", "jassijs/ui/Style", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Products", "jassijs/ui/DBObjectView"], function (require, exports, Style_2, ObjectChooser_3, HTMLPanel_4, Checkbox_1, NumberConverter_4, Textbox_6, Registry_7, Property_6, Products_1, DBObjectView_6) {
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
            me.styleNumber = new Style_2.Style();
            me.supplierchooser = new ObjectChooser_3.ObjectChooser();
            me.supplier = new HTMLPanel_4.HTMLPanel();
            me.categoryChooser = new ObjectChooser_3.ObjectChooser();
            me.category = new HTMLPanel_4.HTMLPanel();
            me.discontinued = new Checkbox_1.Checkbox();
            me.reorderLevel = new Textbox_6.Textbox();
            me.unitsOnOrder = new Textbox_6.Textbox();
            me.unitsInStock = new Textbox_6.Textbox();
            me.unitPrice = new Textbox_6.Textbox();
            me.quantityPerUnit = new Textbox_6.Textbox();
            me.productName = new Textbox_6.Textbox();
            this.me.main.config({ isAbsolute: true, width: "678", height: "170", children: [
                    me.id.config({
                        x: 10,
                        y: 10,
                        bind: [me.databinder, "id"],
                        label: "Id",
                        width: 65,
                        converter: new NumberConverter_4.NumberConverter()
                    }),
                    me.styleNumber.config({
                        css: {
                            text_align: "right"
                        }
                    }),
                    me.supplierchooser.config({
                        x: 460,
                        y: 125,
                        bind: [me.databinder, "Supplier"],
                        items: "northwind.Suppliers"
                    }),
                    me.supplier.config({
                        x: 225,
                        y: 110,
                        bind: [me.databinder, "Supplier"],
                        value: "New Orleans Cajun Delights",
                        template: "{{CompanyName}}",
                        label: "Supplier",
                        width: 230
                    }),
                    me.categoryChooser.config({
                        x: 185,
                        y: 125,
                        items: "northwind.Categories",
                        bind: [me.databinder, "Category"],
                        width: 30
                    }),
                    me.category.config({
                        x: 10,
                        y: 110,
                        template: "{{CategoryName}}",
                        value: "Condiments",
                        bind: [me.databinder, "Category"],
                        width: 170,
                        label: "Category"
                    }),
                    me.discontinued.config({
                        x: 415,
                        y: 10,
                        width: 70,
                        bind: [me.databinder, "Discontinued"],
                        label: "Discontinued"
                    }),
                    me.reorderLevel.config({
                        x: 415,
                        y: 60,
                        bind: [me.databinder, "ReorderLevel"],
                        width: 70,
                        label: "Reorder Level",
                        converter: new NumberConverter_4.NumberConverter(),
                        styles: [me.styleNumber]
                    }),
                    me.unitsOnOrder.config({
                        x: 325,
                        y: 60,
                        bind: [me.databinder, "UnitsOnOrder"],
                        label: "Units on Order",
                        width: 75,
                        converter: new NumberConverter_4.NumberConverter(),
                        format: "#.##0,00",
                        styles: [me.styleNumber]
                    }),
                    me.unitsInStock.config({
                        x: 240,
                        y: 60,
                        bind: [me.databinder, "UnitsInStock"],
                        label: "Units in Stock",
                        width: 70,
                        converter: new NumberConverter_4.NumberConverter(),
                        format: "#.##0,00",
                        styles: [me.styleNumber]
                    }),
                    me.unitPrice.config({
                        x: 160,
                        y: 60,
                        bind: [me.databinder, "UnitPrice"],
                        label: "Unit Price",
                        width: 65,
                        converter: new NumberConverter_4.NumberConverter(),
                        format: "#.##0,00",
                        styles: [me.styleNumber]
                    }),
                    me.quantityPerUnit.config({
                        x: 10,
                        y: 60,
                        bind: [me.databinder, "QuantityPerUnit"],
                        width: 135,
                        label: "Quantity per Unit"
                    }),
                    me.productName.config({
                        x: 90,
                        y: 10,
                        bind: [me.databinder, "ProductName"],
                        label: "Product Name",
                        width: 310
                    })
                ] });
        }
    };
    __decorate([
        (0, Property_6.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Products_1.Products !== "undefined" && Products_1.Products) === "function" ? _a : Object)
    ], ProductView.prototype, "value", void 0);
    ProductView = __decorate([
        (0, DBObjectView_6.$DBObjectView)({ classname: "northwind.Products", actionname: "Northwind/Products", icon: "mdi mdi-reproduction" }),
        (0, Registry_7.$Class)("northwind.ProductView"),
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
define("northwind/SampleServerReport", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Registry_8, Property_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.SampleClientReport = exports.SampleServerReport = exports.$Report = exports.ReportProperties = void 0;
    class ReportProperties {
    }
    exports.ReportProperties = ReportProperties;
    function $Report(properties) {
        return function (pclass) {
            Registry_8.default.register("$Report", pclass, properties);
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
define("northwind/ShippersView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Shippers", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_5, Textbox_7, Registry_9, Property_8, Shippers_1, DBObjectView_7) {
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
            me.phone = new Textbox_7.Textbox();
            me.companyName = new Textbox_7.Textbox();
            this.me.main.config({
                isAbsolute: true,
                width: "626",
                height: "150",
                children: [
                    me.id.config({
                        converter: new NumberConverter_5.NumberConverter(),
                        bind: [me.databinder, "id"],
                        label: "Id",
                        width: 40,
                        x: 5,
                        y: 0
                    }),
                    me.phone.config({
                        x: 5,
                        y: 50,
                        width: 215,
                        bind: [me.databinder, "Phone"],
                        label: "Phone"
                    }),
                    me.companyName.config({
                        x: 60,
                        y: 0,
                        bind: [me.databinder, "CompanyName"],
                        label: "Company name",
                        width: 160
                    })
                ]
            });
        }
    };
    __decorate([
        (0, Property_8.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Shippers_1.Shippers !== "undefined" && Shippers_1.Shippers) === "function" ? _a : Object)
    ], ShippersView.prototype, "value", void 0);
    ShippersView = __decorate([
        (0, DBObjectView_7.$DBObjectView)({ classname: "northwind.Shippers", actionname: "Northwind/Shippers", icon: "mdi mdi-truck-delivery" }),
        (0, Registry_9.$Class)("northwind.ShippersView"),
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
define("northwind/SuppliersView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Suppliers", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_6, Textbox_8, Registry_10, Property_9, Suppliers_1, DBObjectView_8) {
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
            me.homepage = new Textbox_8.Textbox();
            me.fax = new Textbox_8.Textbox();
            me.phone = new Textbox_8.Textbox();
            me.Country = new Textbox_8.Textbox();
            me.region = new Textbox_8.Textbox();
            me.city = new Textbox_8.Textbox();
            me.postalCode = new Textbox_8.Textbox();
            me.address = new Textbox_8.Textbox();
            me.contactTitle = new Textbox_8.Textbox();
            me.contactName = new Textbox_8.Textbox();
            me.companyName = new Textbox_8.Textbox();
            this.me.main.config({ isAbsolute: true, width: "800", height: "800", children: [
                    me.id.config({
                        x: 10,
                        y: 5,
                        converter: new NumberConverter_6.NumberConverter(),
                        width: 50,
                        bind: [me.databinder, "id"],
                        label: "Id"
                    }),
                    me.homepage.config({
                        x: 10,
                        y: 275,
                        bind: [me.databinder, "HomePage"],
                        label: "Home Page",
                        width: 355
                    }),
                    me.fax.config({
                        x: 180,
                        y: 230,
                        bind: [me.databinder, "Fax"],
                        label: "Fax",
                        width: 185
                    }),
                    me.phone.config({
                        x: 10,
                        y: 230,
                        bind: [me.databinder, "Phone"],
                        label: "Phone",
                        width: 155
                    }),
                    me.Country.config({
                        x: 180,
                        y: 185,
                        bind: [me.databinder, "Country"],
                        label: "Country",
                        width: 185
                    }),
                    me.region.config({
                        x: 10,
                        y: 185,
                        bind: [me.databinder, "Region"],
                        label: "Region",
                        width: 155
                    }),
                    me.city.config({
                        x: 120,
                        y: 140,
                        bind: [me.databinder, "City"],
                        label: "City",
                        width: 245
                    }),
                    me.postalCode.config({
                        x: 10,
                        y: 140,
                        bind: [me.databinder, "PostalCode"],
                        width: 95,
                        label: "Postal Code"
                    }),
                    me.address.config({
                        x: 10,
                        y: 95,
                        bind: [me.databinder, "Address"],
                        label: "Address",
                        width: 355
                    }),
                    me.contactTitle.config({
                        x: 180,
                        y: 50,
                        bind: [me.databinder, "ContactTitle"],
                        label: "Contact Title",
                        width: 185
                    }),
                    me.contactName.config({
                        x: 10,
                        y: 50,
                        bind: [me.databinder, "ContactName"],
                        label: "Contact Name"
                    }),
                    me.companyName.config({
                        x: 75,
                        y: 5,
                        label: "Company Name",
                        bind: [me.databinder, "CompanyName"],
                        width: 290
                    })
                ] });
        }
    };
    __decorate([
        (0, Property_9.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Suppliers_1.Suppliers !== "undefined" && Suppliers_1.Suppliers) === "function" ? _a : Object)
    ], SuppliersView.prototype, "value", void 0);
    SuppliersView = __decorate([
        (0, DBObjectView_8.$DBObjectView)({ classname: "northwind.Suppliers", actionname: "Northwind/Suppliers", icon: "mdi mdi-office-building-outline" }),
        (0, Registry_10.$Class)("northwind.SuppliersView"),
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
                "date": 1655761083704,
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
                "date": 1656073060541,
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
                "date": 1656073047502,
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
                "date": 1655556792358,
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
                "date": 1655556792358,
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
                "date": 1655556792358,
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
                "date": 1655556792358,
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
                "date": 1656072698870,
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
                "date": 1656072702725,
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
                "date": 1656072706426,
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
                "date": 1656072709725,
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
                "date": 1656072712907,
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
                "date": 1656072718206,
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
                "date": 1656072722755,
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
                "date": 1656072727295,
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
                "date": 1655556792357,
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
                "date": 1655556792356,
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
define("northwind/remote/Categories", ["require", "exports", "northwind/remote/Products", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema"], function (require, exports, Products_2, DBObject_1, Registry_11, DatabaseSchema_1) {
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
        (0, Registry_11.$Class)("northwind.Categories"),
        __metadata("design:paramtypes", [])
    ], Categories);
    exports.Categories = Categories;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Customer", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema"], function (require, exports, DBObject_2, Registry_12, DatabaseSchema_2) {
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
        (0, Registry_12.$Class)("northwind.Customer"),
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
define("northwind/remote/Employees", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Transaction"], function (require, exports, DBObject_3, Registry_13, DatabaseSchema_3, Transaction_2) {
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
            if (!jassijs.isServer) {
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
        (0, Registry_13.$Class)("northwind.Employees"),
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
define("northwind/remote/OrderDetails", ["require", "exports", "northwind/remote/Products", "northwind/remote/Orders", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema"], function (require, exports, Products_3, Orders_2, DBObject_4, Registry_14, DatabaseSchema_4) {
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
        (0, Registry_14.$Class)("northwind.OrderDetails"),
        __metadata("design:paramtypes", [])
    ], OrderDetails);
    exports.OrderDetails = OrderDetails;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Orders", ["require", "exports", "northwind/remote/OrderDetails", "northwind/remote/Employees", "northwind/remote/Customer", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "northwind/remote/Shippers"], function (require, exports, OrderDetails_3, Employees_3, Customer_2, DBObject_5, Registry_15, DatabaseSchema_5, Shippers_2) {
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
        (0, Registry_15.$Class)("northwind.Orders"),
        __metadata("design:paramtypes", [])
    ], Orders);
    exports.Orders = Orders;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Products", ["require", "exports", "northwind/remote/Categories", "northwind/remote/Suppliers", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema"], function (require, exports, Categories_2, Suppliers_2, DBObject_6, Registry_16, DatabaseSchema_6) {
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
        (0, Registry_16.$Class)("northwind.Products"),
        __metadata("design:paramtypes", [])
    ], Products);
    exports.Products = Products;
    async function test() {
        var p = await Products.findOne();
    }
    exports.test = test;
    ;
});
define("northwind/remote/Shippers", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema"], function (require, exports, DBObject_7, Registry_17, DatabaseSchema_7) {
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
        (0, Registry_17.$Class)("northwind.Shippers"),
        __metadata("design:paramtypes", [])
    ], Shippers);
    exports.Shippers = Shippers;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Suppliers", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema"], function (require, exports, DBObject_8, Registry_18, DatabaseSchema_8) {
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
        (0, Registry_18.$Class)("northwind.Suppliers"),
        __metadata("design:paramtypes", [])
    ], Suppliers);
    exports.Suppliers = Suppliers;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=northwind.js.map
//# sourceMappingURL=northwind.js.map