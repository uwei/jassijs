var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
            me.table1 = new Table_1.Table({ options: { data: this.value } });
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
                        width: "100%",
                        tooltip: "e"
                    })
                ] });
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Categories_1.Categories !== "undefined" && Categories_1.Categories) === "function" ? _a : Object)
    ], CategoriesView.prototype, "value", void 0);
    CategoriesView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.Categories", actionname: "Northwind/Categories", icon: "mdi mdi-cube" }),
        Registry_1.$Class("northwind.CategoriesView"),
        __metadata("design:paramtypes", [])
    ], CategoriesView);
    exports.CategoriesView = CategoriesView;
    async function test() {
        var ret = new CategoriesView();
        var data = await Categories_1.Categories.findOne({ relations: ["*"] });
        ret.config({ value: data });
        //    ret["value"] = 
        return ret;
    }
    exports.test = test;
});
define("northwind/CustomerOrders", ["require", "exports", "jassijs/ui/Table", "jassijs/ui/BoxPanel", "jassijs/ui/HTMLPanel", "jassijs/ui/Databinder", "jassijs/ui/ObjectChooser", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Customer", "northwind/remote/Orders", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, Table_2, BoxPanel_2, HTMLPanel_1, Databinder_1, ObjectChooser_1, Registry_2, Panel_2, Customer_1, Orders_1, Actions_1, Windows_1) {
    "use strict";
    var CustomerOrders_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerOrders = void 0;
    let CustomerOrders = CustomerOrders_1 = class CustomerOrders extends Panel_2.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            var _this = this;
            me.IDChooseCustomer = new ObjectChooser_1.ObjectChooser();
            me.databinderCustomer = new Databinder_1.Databinder();
            me.htmlpanel = new HTMLPanel_1.HTMLPanel();
            me.boxpanel = new BoxPanel_2.BoxPanel();
            me.boxpanel2 = new BoxPanel_2.BoxPanel();
            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
            me.IDOrders = new Table_2.Table();
            me.databinderOrder = new Databinder_1.Databinder();
            me.table = new Table_2.Table();
            this.config({ children: [
                    me.databinderCustomer.config({}),
                    me.boxpanel.config({ children: [
                            me.boxpanel2.config({
                                children: [
                                    me.htmlpanel.config({
                                        width: 185,
                                        value: "Berglunds snabbköp",
                                        bind: [me.databinderCustomer, "CompanyName"],
                                        label: "Company Name",
                                        height: 20
                                    }),
                                    me.IDChooseCustomer.config({
                                        width: 25,
                                        bind: [me.databinderCustomer, "this"],
                                        items: "northwind.Customer",
                                        onchange: function (event) {
                                            _this.customerChanged();
                                        }
                                    }),
                                    me.htmlpanel2.config({
                                        width: 110,
                                        value: " ",
                                        bind: [me.databinderCustomer, "Country"],
                                        label: "Country"
                                    })
                                ],
                                horizontal: true
                            }),
                            me.IDOrders.config({
                                width: "100%",
                                label: "Click an order...",
                                height: "180"
                            }),
                            me.table.config({
                                width: "100%",
                                bindItems: [me.databinderOrder, "Details"],
                                height: "140",
                                label: "...to see order details"
                            })
                        ] }),
                    me.databinderOrder.config({})
                ] });
            me.IDOrders.selectComponent = me.databinderOrder;
            this.setData();
            this.width = "100%";
            this.height = "100%";
        }
        static showDialog() {
            Windows_1.default.add(new CustomerOrders_1(), "Customer Orders");
        }
        async customerChanged() {
            var cust = this.me.databinderCustomer.value;
            var orders = await Orders_1.Orders.find({ where: "Customer.id=:param",
                whereParams: { param: cust.id } });
            this.me.IDOrders.items = orders;
            this.me.databinderOrder.value = orders[0];
        }
        async setData() {
            var all = await Customer_1.Customer.find();
            this.me.databinderCustomer.value = all[0];
            this.customerChanged();
            //        this.me.IDChooseCustomer.items = all;
            //      this.me.databinderCustomer.value = all[0];
        }
    };
    __decorate([
        Actions_1.$Action({ name: "Northwind/Customer Orders", icon: "mdi-script-text-play-outline" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CustomerOrders, "showDialog", null);
    CustomerOrders = CustomerOrders_1 = __decorate([
        Actions_1.$ActionProvider("jassijs.base.ActionNode"),
        Registry_2.$Class("northwind/CustomerOrders"),
        __metadata("design:paramtypes", [])
    ], CustomerOrders);
    exports.CustomerOrders = CustomerOrders;
    async function test() {
        var ret = new CustomerOrders();
        return ret;
    }
    exports.test = test;
});
define("northwind/CustomerPhoneList", ["require", "exports", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Actions", "jassijs/base/Windows", "northwind/remote/Customer"], function (require, exports, Table_3, Registry_3, Panel_3, Actions_2, Windows_2, Customer_2) {
    "use strict";
    var CustomerPhoneList_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerPhoneList = void 0;
    let CustomerPhoneList = CustomerPhoneList_1 = class CustomerPhoneList extends Panel_3.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            var _this = this;
            me.table = new Table_3.Table();
            this.config({
                children: [
                    me.table.config({
                        width: "100%",
                        height: "100%",
                        showSearchbox: true,
                        options: {
                            autoColumns: false,
                            columns: [
                                { title: "Company Name:", field: "CompanyName" },
                                { title: "Contact:", field: "ContactName" },
                                { title: "Phone:", field: "Phone" },
                                { title: "Fax:", field: "Fax" }
                            ]
                        }
                    })
                ]
            });
            this.width = "100%";
            this.height = "100%";
            this.setData();
        }
        async setData() {
            var all = await Customer_2.Customer.find();
            this.me.table.items = all;
            //  new Customer().Fax
        }
        static showDialog() {
            Windows_2.default.add(new CustomerPhoneList_1(), "Customer Phone List");
        }
    };
    __decorate([
        Actions_2.$Action({ name: "Northwind/Customer Phone List", icon: "mdi-script-text-play-outline" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CustomerPhoneList, "showDialog", null);
    CustomerPhoneList = CustomerPhoneList_1 = __decorate([
        Actions_2.$ActionProvider("jassijs.base.ActionNode"),
        Registry_3.$Class("northwind/CustomerPhoneList"),
        __metadata("design:paramtypes", [])
    ], CustomerPhoneList);
    exports.CustomerPhoneList = CustomerPhoneList;
    async function test() {
        var ret = new CustomerPhoneList();
        //    alert(ret.me.table.height);
        return ret;
    }
    exports.test = test;
});
define("northwind/CustomerView", ["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Customer", "jassijs/ui/DBObjectView"], function (require, exports, Textbox_2, Registry_4, Property_2, Customer_3, DBObjectView_2) {
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
                    me.contactname.config({
                        x: 90,
                        y: 5,
                        label: "Contact Name",
                        bind: [me.databinder, "ContactName"],
                        width: 260
                    }),
                    me.contacttitle.config({
                        x: 10,
                        y: 45,
                        label: "Contact Title",
                        bind: [me.databinder, "ContactTitle"]
                    }),
                    me.companyname.config({
                        x: 195,
                        y: 45,
                        bind: [me.databinder, "CompanyName"],
                        label: "Company Name",
                        width: 155
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
        Property_2.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Customer_3.Customer !== "undefined" && Customer_3.Customer) === "function" ? _a : Object)
    ], CustomerView.prototype, "value", void 0);
    CustomerView = __decorate([
        DBObjectView_2.$DBObjectView({
            classname: "northwind.Customer",
            actionname: "Northwind/Customers",
            icon: "mdi mdi-nature-people"
        }),
        Registry_4.$Class("northwind/CustomerView"),
        __metadata("design:paramtypes", [])
    ], CustomerView);
    exports.CustomerView = CustomerView;
    async function test() {
        var ret = new CustomerView;
        ret["value"] = await Customer_3.Customer.findOne();
        return ret;
    }
    exports.test = test;
});
define("northwind/DetailTest", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/OrderDetails", "jassijs/ui/DBObjectView", "jassijs/ui/Textbox"], function (require, exports, Registry_5, Property_3, OrderDetails_1, DBObjectView_3, Textbox_3) {
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
        Property_3.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof OrderDetails_1.OrderDetails !== "undefined" && OrderDetails_1.OrderDetails) === "function" ? _a : Object)
    ], DetailTest.prototype, "value", void 0);
    DetailTest = __decorate([
        DBObjectView_3.$DBObjectView({ classname: "northwind.OrderDetails" }),
        Registry_5.$Class("northwind.DetailTest"),
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
define("northwind/EmployeesView", ["require", "exports", "jassijs/ui/converters/DateTimeConverter", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Image", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Employees", "jassijs/ui/DBObjectView", "jassijs/remote/Validator"], function (require, exports, DateTimeConverter_1, ObjectChooser_2, HTMLPanel_2, NumberConverter_2, Image_1, Textarea_2, Textbox_4, Registry_6, Property_4, Employees_1, DBObjectView_4, Validator_1) {
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
            me.birthDate = new Textbox_4.Textbox();
            me.hiredate = new Textbox_4.Textbox();
            me.homephone = new Textbox_4.Textbox();
            me.notes = new Textarea_2.Textarea();
            me.image1 = new Image_1.Image();
            me.photoPath = new Textbox_4.Textbox();
            me.id = new Textbox_4.Textbox();
            me.reportsTo = new HTMLPanel_2.HTMLPanel();
            me.objectchooser1 = new ObjectChooser_2.ObjectChooser();
            this.me.main.config({
                children: [
                    me.id.config({
                        x: 5,
                        y: 5,
                        width: 60,
                        label: "Id",
                        bind: [me.databinder, "id"],
                        converter: new NumberConverter_2.NumberConverter()
                    }),
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
                        width: 100,
                        bind: [me.databinder, "BirthDate"],
                        label: "Birth Date",
                        converter: new DateTimeConverter_1.DateTimeConverter()
                    }),
                    me.hiredate.config({
                        x: 115,
                        y: 190,
                        bind: [me.databinder, "HireDate"],
                        label: "Hire Date",
                        width: 95,
                        converter: new DateTimeConverter_1.DateTimeConverter()
                    }),
                    me.homephone.config({
                        x: 220,
                        y: 190,
                        bind: [me.databinder, "HomePhone"],
                        label: "Home Phone",
                        width: 130
                    }),
                    me.photoPath.config({
                        x: 5,
                        y: 240,
                        bind: [me.databinder, "PhotoPath"],
                        label: "Photo Path",
                        width: 460
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
                        style: {
                            backgroundColor: "black",
                            borderStyle: "solid"
                        },
                        width: 125,
                        bind: [me.databinder, "PhotoPath"]
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
                width: "750",
                height: "360"
            });
        }
    };
    __decorate([
        Property_4.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Employees_1.Employees !== "undefined" && Employees_1.Employees) === "function" ? _a : Object)
    ], EmployeesView.prototype, "value", void 0);
    EmployeesView = __decorate([
        DBObjectView_4.$DBObjectView({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        Registry_6.$Class("northwind.EmployeesView"),
        __metadata("design:paramtypes", [])
    ], EmployeesView);
    exports.EmployeesView = EmployeesView;
    async function test() {
        var em = (await Employees_1.Employees.find({ id: 4 }))[0];
        var ret = new EmployeesView;
        ret["value"] = em;
        var h = await Validator_1.validate(em);
        // ret.me.address
        return ret;
    }
    exports.test = test;
});
define("northwind/ImportData", ["require", "exports", "jassijs/ui/Button", "jassijs/ui/HTMLPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/util/CSVImport", "jassijs/base/Actions", "jassijs/base/Router", "northwind/remote/OrderDetails", "jassijs/remote/Transaction"], function (require, exports, Button_1, HTMLPanel_3, Registry_7, Panel_4, CSVImport_1, Actions_3, Router_1, OrderDetails_2, Transaction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ImportData = void 0;
    let ImportData = class ImportData extends Panel_4.Panel {
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
                data.forEach((o) => { delete o.id; }); //remove id is autoid
            });
            this.me.IDProtokoll.value += "<br>OrderDetails " + s;
            this.me.IDProtokoll.value += "<br>Fertig";
        }
        layout(me) {
            var _this = this;
            me.htmlpanel1 = new HTMLPanel_3.HTMLPanel();
            me.IDImport = new Button_1.Button();
            me.htmlpanel2 = new HTMLPanel_3.HTMLPanel();
            me.IDProtokoll = new HTMLPanel_3.HTMLPanel();
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
        Actions_3.$Action({ name: "Northwind", icon: "mdi mdi-warehouse" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImportData, "dummy", null);
    __decorate([
        Actions_3.$Action({ name: "Northwind/Import sample data", icon: "mdi mdi-database-import" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImportData, "showDialog", null);
    ImportData = __decorate([
        Actions_3.$ActionProvider("jassijs.base.ActionNode"),
        Registry_7.$Class("northwind.ImportData"),
        __metadata("design:paramtypes", [])
    ], ImportData);
    exports.ImportData = ImportData;
    async function test() {
        var ret = new ImportData();
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
define("northwind/OrdersView", ["require", "exports", "jassijs/ui/converters/DateTimeConverter", "jassijs/ui/Style", "jassijs/ui/BoxPanel", "jassijs/ui/Repeater", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Property", "northwind/remote/Orders", "jassijs/ui/DBObjectView"], function (require, exports, DateTimeConverter_2, Style_1, BoxPanel_3, Repeater_1, ObjectChooser_3, HTMLPanel_4, NumberConverter_3, Textbox_5, Registry_8, Panel_5, Property_5, Orders_2, DBObjectView_5) {
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
            me.boxpanel1 = new BoxPanel_3.BoxPanel();
            me.panel1 = new Panel_5.Panel();
            me.shipName = new Textbox_5.Textbox();
            me.shipAddress = new Textbox_5.Textbox();
            me.shipPostalCode = new Textbox_5.Textbox();
            me.shipCity = new Textbox_5.Textbox();
            me.shipCountry = new Textbox_5.Textbox();
            me.shipRegion = new Textbox_5.Textbox();
            me.panel2 = new Panel_5.Panel();
            me.id = new Textbox_5.Textbox();
            me.freight = new Textbox_5.Textbox();
            me.panel3 = new Panel_5.Panel();
            me.customername = new HTMLPanel_4.HTMLPanel();
            me.choosecustomer = new ObjectChooser_3.ObjectChooser();
            me.shipVia = new HTMLPanel_4.HTMLPanel();
            me.shipviaChooser = new ObjectChooser_3.ObjectChooser();
            me.employeename = new HTMLPanel_4.HTMLPanel();
            me.chooseEmployee = new ObjectChooser_3.ObjectChooser();
            me.orderDate = new Textbox_5.Textbox();
            me.requiredDate = new Textbox_5.Textbox();
            me.shippedDate = new Textbox_5.Textbox();
            me.boxpanel2 = new BoxPanel_3.BoxPanel();
            me.htmlpanel1 = new HTMLPanel_4.HTMLPanel();
            me.htmlpanel2 = new HTMLPanel_4.HTMLPanel();
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
            me.panel1.add(me.shipRegion);
            me.panel1.add(me.shipCountry);
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
                me.detailsProduct = new HTMLPanel_4.HTMLPanel();
                me.objectchooser1 = new ObjectChooser_3.ObjectChooser();
                me.repeater1.design.add(me.detailsQuantity);
                me.repeater1.design.add(me.detailsProduct);
                me.repeater1.design.add(me.objectchooser1);
                me.detailsQuantity.bind = [me.repeater1.design.databinder, "Quantity"];
                me.detailsQuantity.width = 60;
                me.detailsProduct.width = 530;
                me.detailsProduct.bind = [me.repeater1.design.databinder, "Product"];
                me.detailsProduct.template = "{{ProductName}}";
                me.detailsProduct.style = {
                    overflow: "hidden",
                    marginTop: "5px"
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
            me.id.style = {
                textAlign: "right"
            };
            me.freight.x = 5;
            me.freight.y = 50;
            me.freight.bind = [me.databinder, "Freight"];
            me.freight.width = 70;
            me.freight.label = "Freight";
            me.freight.converter = new NumberConverter_3.NumberConverter({ format: "#.##0,00" });
            me.freight.style = {
                textAlign: "right"
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
            me.employeename.value = "6 Michael Suyama";
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
            me.orderDate.width = 95;
            me.orderDate.readOnly = false;
            me.orderDate.converter = new DateTimeConverter_2.DateTimeConverter();
            me.requiredDate.x = 110;
            me.requiredDate.y = 130;
            me.requiredDate.bind = [me.databinder, "RequiredDate"];
            me.requiredDate.label = "Required Date";
            me.requiredDate.width = 95;
            me.requiredDate.converter = new DateTimeConverter_2.DateTimeConverter();
            me.shippedDate.x = 210;
            me.shippedDate.y = 130;
            me.shippedDate.bind = [me.databinder, "ShippedDate"];
            me.shippedDate.width = "95";
            me.shippedDate.label = "Shipped Date";
            me.shippedDate.converter = new DateTimeConverter_2.DateTimeConverter();
            me.htmlpanel1.value = "Quantity<br>";
            me.htmlpanel1.width = 65;
            me.htmlpanel1.styles = [];
            me.htmlpanel2.value = "Text<br>";
            me.htmlpanel2.width = 100;
            me.style1.style = {};
        }
    };
    __decorate([
        Property_5.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Orders_2.Orders !== "undefined" && Orders_2.Orders) === "function" ? _a : Object)
    ], OrdersView.prototype, "value", void 0);
    OrdersView = __decorate([
        DBObjectView_5.$DBObjectView({ classname: "northwind.Orders", actionname: "Northwind/Orders", icon: "mdi mdi-script-text" }),
        Registry_8.$Class("northwind.OrdersView"),
        __metadata("design:paramtypes", [])
    ], OrdersView);
    exports.OrdersView = OrdersView;
    async function test() {
        var ret = new OrdersView;
        ret["value"] = await Orders_2.Orders.findOne({ id: 10249, relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
define("northwind/ProductList", ["require", "exports", "jassijs/ui/Checkbox", "jassijs/ui/Textbox", "jassijs/ui/Repeater", "jassijs/ui/BoxPanel", "jassijs/ui/HTMLPanel", "jassijs/ui/Databinder", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Actions", "jassijs/base/Windows", "northwind/remote/Products", "jassijs/ui/converters/NumberConverter"], function (require, exports, Checkbox_1, Textbox_6, Repeater_2, BoxPanel_4, HTMLPanel_5, Databinder_2, Registry_9, Panel_6, Actions_4, Windows_3, Products_1, NumberConverter_4) {
    "use strict";
    var ProductList_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ProductList = void 0;
    let ProductList = ProductList_1 = class ProductList extends Panel_6.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            var _this = this;
            me.databinder = new Databinder_2.Databinder();
            me.repeater = new Repeater_2.Repeater();
            this.config({
                children: [
                    me.databinder.config({}),
                    me.repeater.config({
                        //isAbsolute: false,
                        bind: [me.databinder, "this"],
                        createRepeatingComponent: function (me) {
                            me.textbox = new Textbox_6.Textbox();
                            me.htmlpanel = new HTMLPanel_5.HTMLPanel();
                            me.checkbox = new Checkbox_1.Checkbox();
                            me.htmlpanel3 = new HTMLPanel_5.HTMLPanel();
                            me.boxpanel = new BoxPanel_4.BoxPanel();
                            me.panel = new Panel_6.Panel();
                            me.boxpanel2 = new BoxPanel_4.BoxPanel();
                            me.htmlpanel2 = new HTMLPanel_5.HTMLPanel();
                            me.textbox2 = new Textbox_6.Textbox();
                            me.htmlpanel22 = new HTMLPanel_5.HTMLPanel();
                            me.textbox22 = new Textbox_6.Textbox();
                            me.repeater.design.config({
                                children: [
                                    me.htmlpanel3.config({ value: " " }),
                                    me.boxpanel.config({
                                        children: [
                                            me.htmlpanel.config({ value: "Product Name:", width: "150" }),
                                            me.textbox.config({
                                                bind: [me.repeater.design.databinder, "ProductName"],
                                                readOnly: true,
                                                width: 290
                                            }),
                                            me.checkbox.config({
                                                bind: [me.repeater.design.databinder, "Discontinued"],
                                                text: "Discontinued"
                                            }),
                                            me.panel.config({})
                                        ],
                                        horizontal: true
                                    }),
                                    me.boxpanel2.config({
                                        children: [
                                            me.htmlpanel2.config({ value: "Quantity Per Unit:", width: "150" }),
                                            me.textbox2.config({
                                                readOnly: true,
                                                width: 175,
                                                bind: [me.repeater.design.databinder, "QuantityPerUnit"]
                                            }),
                                            me.htmlpanel22.config({ value: "&nbsp; &nbsp; &nbsp;Unit Price:", width: 110 }),
                                            me.textbox22.config({
                                                readOnly: true,
                                                width: 100,
                                                bind: [me.repeater.design.databinder, "UnitPrice"],
                                                converter: new NumberConverter_4.NumberConverter({ format: "#.##0,00" }),
                                            })
                                        ],
                                        horizontal: true
                                    })
                                ]
                            });
                        }
                    })
                ]
            });
            this.setData();
        }
        static showDialog() {
            Windows_3.default.add(new ProductList_1(), "ProductList");
        }
        async setData() {
            var all = await Products_1.Products.find({});
            all.sort((a, b) => { return a.ProductName.localeCompare(b.ProductName); });
            this.me.databinder.value = all;
            //        this.me.IDChooseCustomer.items = all;
            //      this.me.databinderCustomer.value = all[0];
        }
    };
    __decorate([
        Actions_4.$Action({ name: "Northwind/Product List", icon: "mdi mdi-reproduction" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ProductList, "showDialog", null);
    ProductList = ProductList_1 = __decorate([
        Actions_4.$ActionProvider("jassijs.base.ActionNode"),
        Registry_9.$Class("northwind/ProductList"),
        __metadata("design:paramtypes", [])
    ], ProductList);
    exports.ProductList = ProductList;
    async function test() {
        var ret = new ProductList();
        return ret;
    }
    exports.test = test;
});
define("northwind/ProductView", ["require", "exports", "jassijs/ui/Style", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Products", "jassijs/ui/DBObjectView"], function (require, exports, Style_2, ObjectChooser_4, HTMLPanel_6, Checkbox_2, NumberConverter_5, Textbox_7, Registry_10, Property_6, Products_2, DBObjectView_6) {
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
            me.id = new Textbox_7.Textbox();
            me.styleNumber = new Style_2.Style();
            me.supplierchooser = new ObjectChooser_4.ObjectChooser();
            me.supplier = new HTMLPanel_6.HTMLPanel();
            me.categoryChooser = new ObjectChooser_4.ObjectChooser();
            me.category = new HTMLPanel_6.HTMLPanel();
            me.discontinued = new Checkbox_2.Checkbox();
            me.reorderLevel = new Textbox_7.Textbox();
            me.unitsOnOrder = new Textbox_7.Textbox();
            me.unitsInStock = new Textbox_7.Textbox();
            me.unitPrice = new Textbox_7.Textbox();
            me.quantityPerUnit = new Textbox_7.Textbox();
            me.productName = new Textbox_7.Textbox();
            this.me.main.config({ isAbsolute: true, width: "678", height: "170", children: [
                    me.id.config({
                        x: 10,
                        y: 10,
                        bind: [me.databinder, "id"],
                        label: "Id",
                        width: 65,
                        converter: new NumberConverter_5.NumberConverter()
                    }),
                    me.productName.config({
                        x: 90,
                        y: 10,
                        bind: [me.databinder, "ProductName"],
                        label: "Product Name",
                        width: 310
                    }),
                    me.discontinued.config({
                        x: 415,
                        y: 10,
                        width: 70,
                        bind: [me.databinder, "Discontinued"],
                        label: "Discontinued"
                    }),
                    me.quantityPerUnit.config({
                        x: 10,
                        y: 60,
                        bind: [me.databinder, "QuantityPerUnit"],
                        width: 135,
                        label: "Quantity per Unit"
                    }),
                    me.unitPrice.config({
                        x: 160,
                        y: 60,
                        bind: [me.databinder, "UnitPrice"],
                        label: "Unit Price",
                        width: 65,
                        converter: new NumberConverter_5.NumberConverter({ format: "#.##0,00" }),
                        styles: [me.styleNumber]
                    }),
                    me.unitsInStock.config({
                        x: 240,
                        y: 60,
                        bind: [me.databinder, "UnitsInStock"],
                        label: "Units in Stock",
                        width: 70,
                        converter: new NumberConverter_5.NumberConverter({ format: "#.##0,00" }),
                        styles: [me.styleNumber]
                    }),
                    me.unitsOnOrder.config({
                        x: 325,
                        y: 60,
                        bind: [me.databinder, "UnitsOnOrder"],
                        label: "Units on Order",
                        width: 75,
                        converter: new NumberConverter_5.NumberConverter({ format: "#.##0,00" }),
                        styles: [me.styleNumber]
                    }),
                    me.reorderLevel.config({
                        x: 415,
                        y: 60,
                        bind: [me.databinder, "ReorderLevel"],
                        width: 70,
                        label: "Reorder Level",
                        converter: new NumberConverter_5.NumberConverter(),
                        styles: [me.styleNumber]
                    }),
                    me.category.config({
                        x: 10,
                        y: 110,
                        template: "{{CategoryName}}",
                        value: "Beverages",
                        bind: [me.databinder, "Category"],
                        width: 170,
                        label: "Category"
                    }),
                    me.categoryChooser.config({
                        x: 185,
                        y: 125,
                        items: "northwind.Categories",
                        bind: [me.databinder, "Category"],
                        width: 30,
                        value: "Beverages"
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
                    me.supplierchooser.config({
                        x: 460,
                        y: 125,
                        bind: [me.databinder, "Supplier"],
                        items: "northwind.Suppliers"
                    }),
                    me.styleNumber.config({
                        style: {
                            textAlign: "right"
                        }
                    })
                ] });
        }
    };
    __decorate([
        Property_6.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Products_2.Products !== "undefined" && Products_2.Products) === "function" ? _a : Object)
    ], ProductView.prototype, "value", void 0);
    ProductView = __decorate([
        DBObjectView_6.$DBObjectView({ classname: "northwind.Products", actionname: "Northwind/Products", icon: "mdi mdi-reproduction" }),
        Registry_10.$Class("northwind.ProductView"),
        __metadata("design:paramtypes", [])
    ], ProductView);
    exports.ProductView = ProductView;
    async function test() {
        var ret = new ProductView;
        //var h=await Products.find({relations:["Category"]});
        ret["value"] = await Products_2.Products.findOne({ relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
//this file is autogenerated don't modify
define("northwind/registry", ["require"], function (require) {
    return {
        default: {
            "northwind/CategoriesView.ts": {
                "date": 1697199759329.1274,
                "northwind.CategoriesView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Categories",
                            "actionname": "Northwind/Categories",
                            "icon": "mdi mdi-cube"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/CustomerOrders.ts": {
                "date": 1656502358000,
                "northwind/CustomerOrders": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Northwind/Customer Orders",
                                    "icon": "mdi-script-text-play-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/CustomerPhoneList.ts": {
                "date": 1681640214000,
                "northwind/CustomerPhoneList": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Northwind/Customer Phone List",
                                    "icon": "mdi-script-text-play-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/CustomerView.ts": {
                "date": 1682164038000,
                "northwind/CustomerView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Customer",
                            "actionname": "Northwind/Customers",
                            "icon": "mdi mdi-nature-people"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/DetailTest.ts": {
                "date": 1656073048000,
                "northwind.DetailTest": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.OrderDetails"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/EmployeesView.ts": {
                "date": 1698508046916.7515,
                "northwind.EmployeesView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Employees",
                            "actionname": "Northwind/Employees",
                            "icon": "mdi mdi-account-tie"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/ImportData.ts": {
                "date": 1656501506000,
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
                "date": 1698507857261.209,
                "northwind.OrdersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Orders",
                            "actionname": "Northwind/Orders",
                            "icon": "mdi mdi-script-text"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/ProductList.ts": {
                "date": 1697197602604.6377,
                "northwind/ProductList": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Northwind/Product List",
                                    "icon": "mdi mdi-reproduction"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/ProductView.ts": {
                "date": 1698508046916.7515,
                "northwind.ProductView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Products",
                            "actionname": "Northwind/Products",
                            "icon": "mdi mdi-reproduction"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/remote/Categories.ts": {
                "date": 1681228126000,
                "northwind.Categories": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "CategoryName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Description": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Picture": {
                            "ValidateIsString": [],
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
                "date": 1681125124000,
                "northwind.Customer": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "CompanyName": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "ContactName": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "ContactTitle": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "Address": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "City": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "Region": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PostalCode": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Country": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Phone": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Fax": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
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
                "date": 1681322814000,
                "northwind.Employees": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "LastName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "FirstName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Title": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "TitleOfCourtesy": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Address": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "City": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Region": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PostalCode": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Country": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "HomePhone": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
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
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PhotoPath": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ReportsTo": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function",
                                    "optional": true
                                }
                            ],
                            "JoinColumn": [],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "BirthDate": {
                            "ValidateIsDate": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "HireDate": {
                            "ValidateIsDate": [
                                {
                                    "optional": true
                                }
                            ],
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
                "date": 1681322822000,
                "northwind.OrderDetails": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryGeneratedColumn": []
                        },
                        "Order": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function",
                                "function"
                            ]
                        },
                        "Product": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "UnitPrice": {
                            "ValidateIsNumber": [],
                            "Column": [
                                {
                                    "nullable": false,
                                    "type": "decimal"
                                }
                            ]
                        },
                        "Quantity": {
                            "ValidateIsNumber": [],
                            "Column": []
                        },
                        "Discount": {
                            "ValidateIsNumber": [],
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
                "date": 1681322834000,
                "northwind.Orders": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "Customer": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "Employee": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "OrderDate": {
                            "ValidateIsDate": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "RequiredDate": {
                            "ValidateIsDate": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShippedDate": {
                            "ValidateIsDate": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipVia": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "Freight": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true,
                                    "type": "decimal"
                                }
                            ]
                        },
                        "ShipName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipAddress": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipCity": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipRegion": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipPostalCode": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipCountry": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Details": {
                            "ValidateIsArray": [
                                {
                                    "type": "function"
                                }
                            ],
                            "OneToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "northwind/remote/Products.ts": {
                "date": 1681322712000,
                "northwind.Products": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "ProductName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Supplier": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "Category": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function",
                                "function"
                            ]
                        },
                        "QuantityPerUnit": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "UnitPrice": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true,
                                    "type": "decimal"
                                }
                            ]
                        },
                        "UnitsInStock": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "UnitsOnOrder": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ReorderLevel": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Discontinued": {
                            "ValidateIsBoolean": [],
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
                "date": 1681236442000,
                "northwind.Shippers": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "CompanyName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Phone": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
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
                "date": 1681236516000,
                "northwind.Suppliers": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "CompanyName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ContactName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ContactTitle": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Address": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "City": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Region": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PostalCode": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Country": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Phone": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Fax": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "HomePage": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/reports/CustomerLabels.ts": {
                "date": 1656456456000,
                "nothwind.CustomerLabels": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "$Report": [
                        {
                            "name": "nothwind/Customer Labels",
                            "actionname": "Northwind/Reports/Customer Labels",
                            "icon": "mdi mdi-file-chart-outline"
                        }
                    ],
                    "@members": {
                        "dummy": {
                            "$Action": [
                                {
                                    "name": "Northwind/Reports",
                                    "icon": "mdi mdi-file-chart-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/ShippersView.ts": {
                "date": 1656683118000,
                "northwind.ShippersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Shippers",
                            "actionname": "Northwind/Shippers",
                            "icon": "mdi mdi-truck-delivery"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/SuppliersView.ts": {
                "date": 1656683258000,
                "northwind.SuppliersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Suppliers",
                            "actionname": "Northwind/Suppliers",
                            "icon": "mdi mdi-office-building-outline"
                        }
                    ],
                    "@members": {}
                }
            }
        }
    };
});
define("northwind/remote/Categories", ["require", "exports", "northwind/remote/Products", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, Products_3, DBObject_1, Registry_11, DatabaseSchema_1, Validator_2) {
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
        Validator_2.ValidateIsInt({ optional: true }),
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Categories.prototype, "id", void 0);
    __decorate([
        Validator_2.ValidateIsString({ optional: true }),
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "CategoryName", void 0);
    __decorate([
        Validator_2.ValidateIsString({ optional: true }),
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "Description", void 0);
    __decorate([
        Validator_2.ValidateIsString(),
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Categories.prototype, "Picture", void 0);
    __decorate([
        DatabaseSchema_1.OneToMany(type => Products_3.Products, e => e.Category),
        __metadata("design:type", typeof (_a = typeof Products_3.Products !== "undefined" && Products_3.Products) === "function" ? _a : Object)
    ], Categories.prototype, "Products", void 0);
    Categories = __decorate([
        DBObject_1.$DBObject(),
        Registry_11.$Class("northwind.Categories"),
        __metadata("design:paramtypes", [])
    ], Categories);
    exports.Categories = Categories;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Customer", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, DBObject_2, Registry_12, DatabaseSchema_2, Validator_3) {
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
        Validator_3.ValidateIsString({ optional: true }),
        DatabaseSchema_2.PrimaryColumn(),
        __metadata("design:type", String)
    ], Customer.prototype, "id", void 0);
    __decorate([
        Validator_3.ValidateIsString(),
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "CompanyName", void 0);
    __decorate([
        Validator_3.ValidateIsString(),
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "ContactName", void 0);
    __decorate([
        Validator_3.ValidateIsString(),
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "ContactTitle", void 0);
    __decorate([
        Validator_3.ValidateIsString(),
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "Address", void 0);
    __decorate([
        Validator_3.ValidateIsString(),
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "City", void 0);
    __decorate([
        Validator_3.ValidateIsString({ optional: true }),
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Region", void 0);
    __decorate([
        Validator_3.ValidateIsString({ optional: true }),
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "PostalCode", void 0);
    __decorate([
        Validator_3.ValidateIsString({ optional: true }),
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Country", void 0);
    __decorate([
        Validator_3.ValidateIsString({ optional: true }),
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Phone", void 0);
    __decorate([
        Validator_3.ValidateIsString({ optional: true }),
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Fax", void 0);
    Customer = __decorate([
        DBObject_2.$DBObject(),
        Registry_12.$Class("northwind.Customer"),
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
define("northwind/remote/Employees", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Transaction", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, DBObject_3, Registry_13, DatabaseSchema_3, Transaction_2, Serverservice_1, Validator_4) {
    "use strict";
    var Employees_2, _a, _b;
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
                var man = await (await Serverservice_1.serverservices.db);
                return man.find(context, this, options);
            }
        }
    };
    __decorate([
        Validator_4.ValidateIsInt({ optional: true }),
        DatabaseSchema_3.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Employees.prototype, "id", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "LastName", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "FirstName", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Title", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "TitleOfCourtesy", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Address", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "City", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Region", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PostalCode", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Country", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
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
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Notes", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PhotoPath", void 0);
    __decorate([
        Validator_4.ValidateIsInstanceOf({ type: type => Employees_2, optional: true }),
        DatabaseSchema_3.JoinColumn(),
        DatabaseSchema_3.ManyToOne(type => Employees_2),
        __metadata("design:type", Employees)
    ], Employees.prototype, "ReportsTo", void 0);
    __decorate([
        Validator_4.ValidateIsDate({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
    ], Employees.prototype, "BirthDate", void 0);
    __decorate([
        Validator_4.ValidateIsDate({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
    ], Employees.prototype, "HireDate", void 0);
    Employees = Employees_2 = __decorate([
        DBObject_3.$DBObject(),
        Registry_13.$Class("northwind.Employees"),
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
define("northwind/remote/OrderDetails", ["require", "exports", "northwind/remote/Products", "northwind/remote/Orders", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, Products_4, Orders_3, DBObject_4, Registry_14, DatabaseSchema_4, Validator_5) {
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
        Validator_5.ValidateIsInt({ optional: true }),
        DatabaseSchema_4.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "id", void 0);
    __decorate([
        Validator_5.ValidateIsInstanceOf({ type: type => Orders_3.Orders }),
        DatabaseSchema_4.ManyToOne(type => Orders_3.Orders, e => e.Details),
        __metadata("design:type", typeof (_a = typeof Orders_3.Orders !== "undefined" && Orders_3.Orders) === "function" ? _a : Object)
    ], OrderDetails.prototype, "Order", void 0);
    __decorate([
        Validator_5.ValidateIsInstanceOf({ type: type => Products_4.Products }),
        DatabaseSchema_4.ManyToOne(type => Products_4.Products),
        __metadata("design:type", typeof (_b = typeof Products_4.Products !== "undefined" && Products_4.Products) === "function" ? _b : Object)
    ], OrderDetails.prototype, "Product", void 0);
    __decorate([
        Validator_5.ValidateIsNumber(),
        DatabaseSchema_4.Column({ nullable: false, type: "decimal" }),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "UnitPrice", void 0);
    __decorate([
        Validator_5.ValidateIsNumber(),
        DatabaseSchema_4.Column(),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "Quantity", void 0);
    __decorate([
        Validator_5.ValidateIsNumber(),
        DatabaseSchema_4.Column({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "Discount", void 0);
    OrderDetails = __decorate([
        DBObject_4.$DBObject(),
        Registry_14.$Class("northwind.OrderDetails"),
        __metadata("design:paramtypes", [])
    ], OrderDetails);
    exports.OrderDetails = OrderDetails;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Orders", ["require", "exports", "northwind/remote/OrderDetails", "northwind/remote/Employees", "northwind/remote/Customer", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "northwind/remote/Shippers", "jassijs/remote/Validator"], function (require, exports, OrderDetails_3, Employees_3, Customer_4, DBObject_5, Registry_15, DatabaseSchema_5, Shippers_1, Validator_6) {
    "use strict";
    var _a, _b, _c, _d, _e, _f;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Orders = void 0;
    let Orders = class Orders extends DBObject_5.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        Validator_6.ValidateIsNumber({ optional: true }),
        DatabaseSchema_5.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Orders.prototype, "id", void 0);
    __decorate([
        Validator_6.ValidateIsInstanceOf({ type: type => Customer_4.Customer }),
        DatabaseSchema_5.ManyToOne(type => Customer_4.Customer),
        __metadata("design:type", typeof (_a = typeof Customer_4.Customer !== "undefined" && Customer_4.Customer) === "function" ? _a : Object)
    ], Orders.prototype, "Customer", void 0);
    __decorate([
        Validator_6.ValidateIsInstanceOf({ type: type => Employees_3.Employees }),
        DatabaseSchema_5.ManyToOne(type => Employees_3.Employees),
        __metadata("design:type", typeof (_b = typeof Employees_3.Employees !== "undefined" && Employees_3.Employees) === "function" ? _b : Object)
    ], Orders.prototype, "Employee", void 0);
    __decorate([
        Validator_6.ValidateIsDate({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
    ], Orders.prototype, "OrderDate", void 0);
    __decorate([
        Validator_6.ValidateIsDate({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
    ], Orders.prototype, "RequiredDate", void 0);
    __decorate([
        Validator_6.ValidateIsDate({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
    ], Orders.prototype, "ShippedDate", void 0);
    __decorate([
        Validator_6.ValidateIsInstanceOf({ type: type => Shippers_1.Shippers }),
        DatabaseSchema_5.ManyToOne(type => Shippers_1.Shippers),
        __metadata("design:type", typeof (_f = typeof Shippers_1.Shippers !== "undefined" && Shippers_1.Shippers) === "function" ? _f : Object)
    ], Orders.prototype, "ShipVia", void 0);
    __decorate([
        Validator_6.ValidateIsNumber({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], Orders.prototype, "Freight", void 0);
    __decorate([
        Validator_6.ValidateIsString({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipName", void 0);
    __decorate([
        Validator_6.ValidateIsString({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipAddress", void 0);
    __decorate([
        Validator_6.ValidateIsString({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipCity", void 0);
    __decorate([
        Validator_6.ValidateIsString({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipRegion", void 0);
    __decorate([
        Validator_6.ValidateIsString({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipPostalCode", void 0);
    __decorate([
        Validator_6.ValidateIsString({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipCountry", void 0);
    __decorate([
        Validator_6.ValidateIsArray({ type: type => OrderDetails_3.OrderDetails }),
        DatabaseSchema_5.OneToMany(type => OrderDetails_3.OrderDetails, e => e.Order),
        __metadata("design:type", Array)
    ], Orders.prototype, "Details", void 0);
    Orders = __decorate([
        DBObject_5.$DBObject(),
        Registry_15.$Class("northwind.Orders"),
        __metadata("design:paramtypes", [])
    ], Orders);
    exports.Orders = Orders;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Products", ["require", "exports", "northwind/remote/Categories", "northwind/remote/Suppliers", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, Categories_2, Suppliers_1, DBObject_6, Registry_16, DatabaseSchema_6, Validator_7) {
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
        Validator_7.ValidateIsInt({ optional: true }),
        DatabaseSchema_6.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Products.prototype, "id", void 0);
    __decorate([
        Validator_7.ValidateIsString({ optional: true }),
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "ProductName", void 0);
    __decorate([
        Validator_7.ValidateIsInstanceOf({ type: type => Suppliers_1.Suppliers }),
        DatabaseSchema_6.ManyToOne(type => Suppliers_1.Suppliers),
        __metadata("design:type", typeof (_a = typeof Suppliers_1.Suppliers !== "undefined" && Suppliers_1.Suppliers) === "function" ? _a : Object)
    ], Products.prototype, "Supplier", void 0);
    __decorate([
        Validator_7.ValidateIsInstanceOf({ type: c => Categories_2.Categories }),
        DatabaseSchema_6.ManyToOne(type => Categories_2.Categories, e => e.Products),
        __metadata("design:type", typeof (_b = typeof Categories_2.Categories !== "undefined" && Categories_2.Categories) === "function" ? _b : Object)
    ], Products.prototype, "Category", void 0);
    __decorate([
        Validator_7.ValidateIsString({ optional: true }),
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "QuantityPerUnit", void 0);
    __decorate([
        Validator_7.ValidateIsNumber({ optional: true }),
        DatabaseSchema_6.Column({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitPrice", void 0);
    __decorate([
        Validator_7.ValidateIsNumber({ optional: true }),
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsInStock", void 0);
    __decorate([
        Validator_7.ValidateIsNumber({ optional: true }),
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsOnOrder", void 0);
    __decorate([
        Validator_7.ValidateIsNumber({ optional: true }),
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "ReorderLevel", void 0);
    __decorate([
        Validator_7.ValidateIsBoolean(),
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", Boolean)
    ], Products.prototype, "Discontinued", void 0);
    Products = __decorate([
        DBObject_6.$DBObject(),
        Registry_16.$Class("northwind.Products"),
        __metadata("design:paramtypes", [])
    ], Products);
    exports.Products = Products;
    async function test() {
        var p = await Products.findOne();
    }
    exports.test = test;
    ;
});
define("northwind/remote/Shippers", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, DBObject_7, Registry_17, DatabaseSchema_7, Validator_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Shippers = void 0;
    let Shippers = class Shippers extends DBObject_7.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        Validator_8.ValidateIsInt({ optional: true }),
        DatabaseSchema_7.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Shippers.prototype, "id", void 0);
    __decorate([
        Validator_8.ValidateIsString({ optional: true }),
        DatabaseSchema_7.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Shippers.prototype, "CompanyName", void 0);
    __decorate([
        Validator_8.ValidateIsString({ optional: true }),
        DatabaseSchema_7.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Shippers.prototype, "Phone", void 0);
    Shippers = __decorate([
        DBObject_7.$DBObject(),
        Registry_17.$Class("northwind.Shippers"),
        __metadata("design:paramtypes", [])
    ], Shippers);
    exports.Shippers = Shippers;
    async function test() {
    }
    exports.test = test;
    ;
});
define("northwind/remote/Suppliers", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, DBObject_8, Registry_18, DatabaseSchema_8, Validator_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Suppliers = void 0;
    let Suppliers = class Suppliers extends DBObject_8.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        Validator_9.ValidateIsInt({ optional: true }),
        DatabaseSchema_8.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Suppliers.prototype, "id", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "CompanyName", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "ContactName", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "ContactTitle", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Address", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "City", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Region", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "PostalCode", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Country", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Phone", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Fax", void 0);
    __decorate([
        Validator_9.ValidateIsString({ optional: true }),
        DatabaseSchema_8.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "HomePage", void 0);
    Suppliers = __decorate([
        DBObject_8.$DBObject(),
        Registry_18.$Class("northwind.Suppliers"),
        __metadata("design:paramtypes", [])
    ], Suppliers);
    exports.Suppliers = Suppliers;
    async function test() {
    }
    exports.test = test;
    ;
    function ValidateIsIntn(arg0) {
        throw new Error("Function not implemented.");
    }
});
define("northwind/reports/CustomerLabels", ["require", "exports", "jassijs_report/Report", "jassijs/ui/Property", "jassijs/remote/Registry", "northwind/remote/Customer", "jassijs/base/Actions"], function (require, exports, Report_1, Property_7, Registry_19, Customer_5, Actions_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerLabels = void 0;
    var reportdesign = {
        content: [
            {
                table: {
                    dontBreakRows: false,
                    widths: ["33%", "33%", "33%"],
                    body: []
                },
                layout: "noBorders"
            }
        ]
    };
    var allCountries = ["Germany"];
    let CustomerLabels = class CustomerLabels extends Report_1.Report {
        async fill() {
            var customers = await Customer_5.Customer.find();
            for (var x = 0; x < customers.length; x++) {
                if (allCountries.indexOf(customers[x].Country) === -1) {
                    allCountries.push(customers[x].Country);
                }
            }
            allCountries.sort();
            if (this.country) {
                customers = await Customer_5.Customer.find({ where: "Country=:c", whereParams: { c: this.country } });
            }
            var line;
            reportdesign.content[0].table.body = [];
            for (var x = 0; x < customers.length; x++) {
                if (x % 3 === 0) {
                    line = [];
                    reportdesign.content[0].table.body.push(line);
                }
                var adr = { text: customers[x].CompanyName + "\n" +
                        customers[x].Address + "\n" +
                        customers[x].City + " " + customers[x].PostalCode + "\n" +
                        customers[x].Country + "\n\n\n" };
                if ((x - 1) % 21 === 0 && x > 16)
                    adr.pageBreak = 'after';
                line.push(adr);
            }
            while (x % 3 !== 0) {
                x = x + 1;
                line.push("");
            }
            return {
                reportdesign
            };
        }
        static async dummy() {
        }
    };
    __decorate([
        Property_7.$Property({ chooseFrom: function () {
                return allCountries;
            } }),
        __metadata("design:type", String)
    ], CustomerLabels.prototype, "country", void 0);
    __decorate([
        Actions_5.$Action({
            name: "Northwind/Reports",
            icon: "mdi mdi-file-chart-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], CustomerLabels, "dummy", null);
    CustomerLabels = __decorate([
        Actions_5.$ActionProvider("jassijs.base.ActionNode"),
        Report_1.$Report({ name: "nothwind/Customer Labels", actionname: "Northwind/Reports/Customer Labels", icon: "mdi mdi-file-chart-outline" }),
        Registry_19.$Class("nothwind.CustomerLabels")
    ], CustomerLabels);
    exports.CustomerLabels = CustomerLabels;
    async function test() {
        var cl = new CustomerLabels();
        cl.country = "USA";
        return await cl.fill();
        //await cl.open();
    }
    exports.test = test;
});
define("northwind/ShippersView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Shippers", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_6, Textbox_8, Registry_20, Property_8, Shippers_2, DBObjectView_7) {
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
            me.id = new Textbox_8.Textbox();
            me.phone = new Textbox_8.Textbox();
            me.companyName = new Textbox_8.Textbox();
            this.me.main.config({
                isAbsolute: true,
                width: "626",
                height: "150",
                children: [
                    me.id.config({
                        converter: new NumberConverter_6.NumberConverter(),
                        bind: [me.databinder, "id"],
                        label: "Id",
                        width: 40,
                        x: 5,
                        y: 0
                    }),
                    me.companyName.config({
                        x: 60,
                        y: 0,
                        bind: [me.databinder, "CompanyName"],
                        label: "Company name",
                        width: 160
                    }),
                    me.phone.config({
                        x: 5,
                        y: 50,
                        width: 215,
                        bind: [me.databinder, "Phone"],
                        label: "Phone"
                    })
                ]
            });
        }
    };
    __decorate([
        Property_8.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Shippers_2.Shippers !== "undefined" && Shippers_2.Shippers) === "function" ? _a : Object)
    ], ShippersView.prototype, "value", void 0);
    ShippersView = __decorate([
        DBObjectView_7.$DBObjectView({ classname: "northwind.Shippers", actionname: "Northwind/Shippers", icon: "mdi mdi-truck-delivery" }),
        Registry_20.$Class("northwind.ShippersView"),
        __metadata("design:paramtypes", [])
    ], ShippersView);
    exports.ShippersView = ShippersView;
    async function test() {
        var ret = new ShippersView;
        ret["value"] = await Shippers_2.Shippers.findOne();
        return ret;
    }
    exports.test = test;
});
define("northwind/SuppliersView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Suppliers", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_7, Textbox_9, Registry_21, Property_9, Suppliers_2, DBObjectView_8) {
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
            me.id = new Textbox_9.Textbox();
            me.homepage = new Textbox_9.Textbox();
            me.fax = new Textbox_9.Textbox();
            me.phone = new Textbox_9.Textbox();
            me.Country = new Textbox_9.Textbox();
            me.region = new Textbox_9.Textbox();
            me.city = new Textbox_9.Textbox();
            me.postalCode = new Textbox_9.Textbox();
            me.address = new Textbox_9.Textbox();
            me.contactTitle = new Textbox_9.Textbox();
            me.contactName = new Textbox_9.Textbox();
            me.companyName = new Textbox_9.Textbox();
            this.me.main.config({ isAbsolute: true, width: "800", height: "800", children: [
                    me.id.config({
                        x: 10,
                        y: 5,
                        converter: new NumberConverter_7.NumberConverter(),
                        width: 50,
                        bind: [me.databinder, "id"],
                        label: "Id"
                    }),
                    me.companyName.config({
                        x: 75,
                        y: 5,
                        label: "Company Name",
                        bind: [me.databinder, "CompanyName"],
                        width: 290
                    }),
                    me.contactName.config({
                        x: 10,
                        y: 50,
                        bind: [me.databinder, "ContactName"],
                        label: "Contact Name"
                    }),
                    me.contactTitle.config({
                        x: 180,
                        y: 50,
                        bind: [me.databinder, "ContactTitle"],
                        label: "Contact Title",
                        width: 185
                    }),
                    me.address.config({
                        x: 10,
                        y: 95,
                        bind: [me.databinder, "Address"],
                        label: "Address",
                        width: 355
                    }),
                    me.postalCode.config({
                        x: 10,
                        y: 140,
                        bind: [me.databinder, "PostalCode"],
                        width: 95,
                        label: "Postal Code"
                    }),
                    me.city.config({
                        x: 120,
                        y: 140,
                        bind: [me.databinder, "City"],
                        label: "City",
                        width: 245
                    }),
                    me.region.config({
                        x: 10,
                        y: 185,
                        bind: [me.databinder, "Region"],
                        label: "Region",
                        width: 155
                    }),
                    me.Country.config({
                        x: 180,
                        y: 185,
                        bind: [me.databinder, "Country"],
                        label: "Country",
                        width: 185
                    }),
                    me.phone.config({
                        x: 10,
                        y: 230,
                        bind: [me.databinder, "Phone"],
                        label: "Phone",
                        width: 155
                    }),
                    me.fax.config({
                        x: 180,
                        y: 230,
                        bind: [me.databinder, "Fax"],
                        label: "Fax",
                        width: 185
                    }),
                    me.homepage.config({
                        x: 10,
                        y: 275,
                        bind: [me.databinder, "HomePage"],
                        label: "Home Page",
                        width: 355
                    })
                ] });
        }
    };
    __decorate([
        Property_9.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Suppliers_2.Suppliers !== "undefined" && Suppliers_2.Suppliers) === "function" ? _a : Object)
    ], SuppliersView.prototype, "value", void 0);
    SuppliersView = __decorate([
        DBObjectView_8.$DBObjectView({ classname: "northwind.Suppliers", actionname: "Northwind/Suppliers", icon: "mdi mdi-office-building-outline" }),
        Registry_21.$Class("northwind.SuppliersView"),
        __metadata("design:paramtypes", [])
    ], SuppliersView);
    exports.SuppliersView = SuppliersView;
    async function test() {
        var ret = new SuppliersView;
        ret["value"] = await Suppliers_2.Suppliers.findOne();
        return ret;
    }
    exports.test = test;
});
//this file is autogenerated don't modify
define("northwind/registry", ["require"], function (require) {
    return {
        default: {
            "northwind/CategoriesView.ts": {
                "date": 1697199759329.1274,
                "northwind.CategoriesView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Categories",
                            "actionname": "Northwind/Categories",
                            "icon": "mdi mdi-cube"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/CustomerOrders.ts": {
                "date": 1656502358000,
                "northwind/CustomerOrders": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Northwind/Customer Orders",
                                    "icon": "mdi-script-text-play-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/CustomerPhoneList.ts": {
                "date": 1681640214000,
                "northwind/CustomerPhoneList": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Northwind/Customer Phone List",
                                    "icon": "mdi-script-text-play-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/CustomerView.ts": {
                "date": 1682164038000,
                "northwind/CustomerView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Customer",
                            "actionname": "Northwind/Customers",
                            "icon": "mdi mdi-nature-people"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/DetailTest.ts": {
                "date": 1656073048000,
                "northwind.DetailTest": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.OrderDetails"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/EmployeesView.ts": {
                "date": 1698508046916.7515,
                "northwind.EmployeesView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Employees",
                            "actionname": "Northwind/Employees",
                            "icon": "mdi mdi-account-tie"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/ImportData.ts": {
                "date": 1656501506000,
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
                "date": 1698507857261.209,
                "northwind.OrdersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Orders",
                            "actionname": "Northwind/Orders",
                            "icon": "mdi mdi-script-text"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/ProductList.ts": {
                "date": 1697197602604.6377,
                "northwind/ProductList": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Northwind/Product List",
                                    "icon": "mdi mdi-reproduction"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/ProductView.ts": {
                "date": 1698508046916.7515,
                "northwind.ProductView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Products",
                            "actionname": "Northwind/Products",
                            "icon": "mdi mdi-reproduction"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/remote/Categories.ts": {
                "date": 1681228126000,
                "northwind.Categories": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "CategoryName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Description": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Picture": {
                            "ValidateIsString": [],
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
                "date": 1681125124000,
                "northwind.Customer": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "CompanyName": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "ContactName": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "ContactTitle": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "Address": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "City": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "Region": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PostalCode": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Country": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Phone": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Fax": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
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
                "date": 1681322814000,
                "northwind.Employees": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "LastName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "FirstName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Title": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "TitleOfCourtesy": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Address": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "City": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Region": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PostalCode": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Country": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "HomePhone": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
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
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PhotoPath": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ReportsTo": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function",
                                    "optional": true
                                }
                            ],
                            "JoinColumn": [],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "BirthDate": {
                            "ValidateIsDate": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "HireDate": {
                            "ValidateIsDate": [
                                {
                                    "optional": true
                                }
                            ],
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
                "date": 1681322822000,
                "northwind.OrderDetails": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryGeneratedColumn": []
                        },
                        "Order": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function",
                                "function"
                            ]
                        },
                        "Product": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "UnitPrice": {
                            "ValidateIsNumber": [],
                            "Column": [
                                {
                                    "nullable": false,
                                    "type": "decimal"
                                }
                            ]
                        },
                        "Quantity": {
                            "ValidateIsNumber": [],
                            "Column": []
                        },
                        "Discount": {
                            "ValidateIsNumber": [],
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
                "date": 1681322834000,
                "northwind.Orders": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "Customer": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "Employee": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "OrderDate": {
                            "ValidateIsDate": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "RequiredDate": {
                            "ValidateIsDate": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShippedDate": {
                            "ValidateIsDate": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipVia": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "Freight": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true,
                                    "type": "decimal"
                                }
                            ]
                        },
                        "ShipName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipAddress": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipCity": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipRegion": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipPostalCode": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ShipCountry": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Details": {
                            "ValidateIsArray": [
                                {
                                    "type": "function"
                                }
                            ],
                            "OneToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "northwind/remote/Products.ts": {
                "date": 1681322712000,
                "northwind.Products": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "ProductName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Supplier": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "Category": {
                            "ValidateIsInstanceOf": [
                                {
                                    "type": "function"
                                }
                            ],
                            "ManyToOne": [
                                "function",
                                "function"
                            ]
                        },
                        "QuantityPerUnit": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "UnitPrice": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true,
                                    "type": "decimal"
                                }
                            ]
                        },
                        "UnitsInStock": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "UnitsOnOrder": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ReorderLevel": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Discontinued": {
                            "ValidateIsBoolean": [],
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
                "date": 1681236442000,
                "northwind.Shippers": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "CompanyName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Phone": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
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
                "date": 1681236516000,
                "northwind.Suppliers": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "CompanyName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ContactName": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "ContactTitle": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Address": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "City": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Region": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "PostalCode": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Country": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Phone": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "Fax": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "HomePage": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/reports/CustomerLabels.ts": {
                "date": 1656456456000,
                "nothwind.CustomerLabels": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "$Report": [
                        {
                            "name": "nothwind/Customer Labels",
                            "actionname": "Northwind/Reports/Customer Labels",
                            "icon": "mdi mdi-file-chart-outline"
                        }
                    ],
                    "@members": {
                        "dummy": {
                            "$Action": [
                                {
                                    "name": "Northwind/Reports",
                                    "icon": "mdi mdi-file-chart-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "northwind/ShippersView.ts": {
                "date": 1656683118000,
                "northwind.ShippersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Shippers",
                            "actionname": "Northwind/Shippers",
                            "icon": "mdi mdi-truck-delivery"
                        }
                    ],
                    "@members": {}
                }
            },
            "northwind/SuppliersView.ts": {
                "date": 1656683258000,
                "northwind.SuppliersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Suppliers",
                            "actionname": "Northwind/Suppliers",
                            "icon": "mdi mdi-office-building-outline"
                        }
                    ],
                    "@members": {}
                }
            }
        }
    };
});
//# sourceMappingURL=northwind.js.map