var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("northwind/CategoriesView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Table", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Property", "northwind/remote/Categories", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, NumberConverter_1, Table_1, Textarea_1, Textbox_1, Registry_1, Panel_1, Property_1, Categories_1, DBObjectView_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CategoriesView = void 0;
    exports.test = test;
    let CategoriesView = class CategoriesView extends DBObjectView_1.DBObjectView {
        get title() {
            return this.value === undefined ? "CategoriesView" : "CategoriesView " + this.value.id;
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Id",
                        bind: this.state.value.bind.id,
                        width: 40,
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Name",
                        bind: this.state.value.bind.CategoryName,
                        width: 235
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Textarea_1.Textarea, {
                        label: "Description",
                        bind: this.state.value.bind.Description,
                        width: 280
                    }),
                    (0, Component_1.jc)(Table_1.Table, {
                        height: "100%",
                        bindItems: this.state.value.bind.Products,
                        width: "100%"
                    }),
                ]
            });
        }
    };
    exports.CategoriesView = CategoriesView;
    exports.CategoriesView = CategoriesView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Categories", actionname: "Northwind/Categories", icon: "mdi mdi-cube" }),
        (0, Registry_1.$Class)("northwind.CategoriesView")
        //@$Property({name:"value",componentType:"northwind.Categories", type: "DBObject", isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
        ,
        (0, Property_1.$Property)({ name: "aa", type: "string" }),
        (0, Property_1.$Property)({ name: "ab", type: "string" })
    ], CategoriesView);
    async function test() {
        var ret = new CategoriesView();
        var data = await Categories_1.Categories.findOne({ relations: ["*"] });
        ret.config({ value: data });
        //    ret["value"] = 
        return ret;
    }
});
define("northwind/CustomerOrders", ["require", "exports", "jassijs/ui/Table", "jassijs/ui/HTMLPanel", "jassijs/ui/ObjectChooser", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Customer", "northwind/remote/Orders", "jassijs/base/Actions", "jassijs/base/Windows", "jassijs/ui/Component", "jassijs/ui/DBObjectView"], function (require, exports, Table_2, HTMLPanel_1, ObjectChooser_1, Registry_2, Panel_2, Customer_1, Orders_1, Actions_1, Windows_1, Component_2, DBObjectView_2) {
    "use strict";
    var CustomerOrders_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomerOrders = void 0;
    exports.test = test;
    Windows_1 = __importDefault(Windows_1);
    let CustomerOrders = CustomerOrders_1 = class CustomerOrders extends DBObjectView_2.DBObjectView {
        constructor(props = {}) {
            super(props);
            if (!(props === null || props === void 0 ? void 0 : props.order))
                this.initData();
        }
        render() {
            var _this = this;
            return (0, Component_2.jc)(Panel_2.Panel, {
                children: [
                    (0, Component_2.jc)(DBObjectView_2.DBObjectViewToolbar, { view: this }),
                    (0, Component_2.jc)(HTMLPanel_1.HTMLPanel, {
                        width: 300,
                        value: "Blauer See Delikatessen",
                        bind: this.state.value.bind.CompanyName,
                        label: "Company Name",
                        height: 20
                    }),
                    (0, Component_2.jc)(ObjectChooser_1.ObjectChooser, {
                        width: 25,
                        bind: this.state.value.bind,
                        items: "northwind.Customer",
                        onchange: function (event) {
                            _this.customerChanged();
                        }
                    }),
                    (0, Component_2.jc)(HTMLPanel_1.HTMLPanel, {
                        width: 110,
                        value: " ",
                        bind: this.state.value.bind.Country,
                        label: "Country"
                    }),
                    (0, Component_2.jc)(Table_2.Table, {
                        bind: this.state.order.bind,
                        bindItems: this.state.orders.bind,
                        width: "100%",
                        label: "Click an order...",
                        height: "180"
                    }),
                    (0, Component_2.jc)(Table_2.Table, {
                        bindItems: this.state.order.bind.Details,
                        width: "100%",
                        height: "140",
                        label: "...to see order details"
                    })
                ]
            });
        }
        static showDialog() {
            Windows_1.default.add(new CustomerOrders_1(), "Customer Orders");
        }
        async customerChanged() {
            var cust = this.state.value.current;
            this.state.orders.current = await Orders_1.Orders.find({
                where: "Customer.id=:param",
                whereParams: { param: cust.id }
            });
            this.state.order.current = this.state.orders.current.length === 0 ? undefined : this.state.orders.current[0];
            //    this.me.IDOrders.items = orders;
            //   this.me.databinderOrder.value = orders[0];
        }
        set value(value) {
            super.value = value;
            this.customerChanged();
        }
        async initData() {
            this.value = await Customer_1.Customer.findOne();
        }
    };
    exports.CustomerOrders = CustomerOrders;
    __decorate([
        (0, Actions_1.$Action)({ name: "Northwind/Customer Orders", icon: "mdi-script-text-play-outline" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CustomerOrders, "showDialog", null);
    exports.CustomerOrders = CustomerOrders = CustomerOrders_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_2.$Class)("northwind/CustomerOrders"),
        __metadata("design:paramtypes", [Object])
    ], CustomerOrders);
    async function test() {
        var ret = new CustomerOrders();
        return ret;
    }
});
define("northwind/CustomerPhoneList", ["require", "exports", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/base/Actions", "jassijs/base/Windows", "northwind/remote/Customer", "jassijs/ui/Component"], function (require, exports, Table_3, Registry_3, Actions_2, Windows_2, Customer_2, Component_3) {
    "use strict";
    var CustomerPhoneList_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomerPhoneList = void 0;
    exports.test = test;
    Windows_2 = __importDefault(Windows_2);
    let CustomerPhoneList = CustomerPhoneList_1 = class CustomerPhoneList extends Component_3.Component {
        constructor(props = {}) {
            super(props);
            this.setData();
        }
        render() {
            return (0, Component_3.jc)(Table_3.Table, {
                ref: this.refs.table,
                width: "600px",
                height: "500px",
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
            });
        }
        async setData() {
            var all = await Customer_2.Customer.find();
            this.refs.table.items = all;
            //  new Customer().Fax
        }
        static showDialog() {
            Windows_2.default.add(new CustomerPhoneList_1(), "Customer Phone List");
        }
    };
    exports.CustomerPhoneList = CustomerPhoneList;
    __decorate([
        (0, Actions_2.$Action)({ name: "Northwind/Customer Phone List", icon: "mdi-script-text-play-outline" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CustomerPhoneList, "showDialog", null);
    exports.CustomerPhoneList = CustomerPhoneList = CustomerPhoneList_1 = __decorate([
        (0, Actions_2.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_3.$Class)("northwind/CustomerPhoneList"),
        __metadata("design:paramtypes", [Object])
    ], CustomerPhoneList);
    async function test() {
        var ret = new CustomerPhoneList();
        //    alert(ret.me.table.height);
        return ret;
    }
});
define("northwind/CustomerView", ["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Registry", "northwind/remote/Customer", "jassijs/ui/DBObjectView", "jassijs/ui/Component", "jassijs/ui/Panel"], function (require, exports, Textbox_2, Registry_4, Customer_3, DBObjectView_3, Component_4, Panel_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomerView = void 0;
    exports.test = test;
    let CustomerView = class CustomerView extends DBObjectView_3.DBObjectView {
        get title() {
            return this.value === undefined ? "CustomerView" : "CustomerView " + this.value.id;
        }
        render() {
            return (0, Component_4.jc)(Panel_3.Panel, {
                children: [
                    (0, Component_4.jc)(DBObjectView_3.DBObjectViewToolbar, { view: this }),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        bind: this.state.value.bind.id,
                        width: 65,
                        label: "id"
                    }),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        label: "Contact Name",
                        bind: this.state.value.bind.ContactName,
                        width: 255
                    }),
                    (0, Component_4.jc)("br"),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        label: "Contact Title",
                        bind: this.state.value.bind.ContactTitle,
                    }),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        bind: this.state.value.bind.ContactName,
                        label: "Company Name",
                        width: 155
                    }),
                    (0, Component_4.jc)("br"),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        bind: this.state.value.bind.Address,
                        label: "Address",
                        width: 325
                    }),
                    (0, Component_4.jc)("br"),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        label: "Postal Code",
                        bind: this.state.value.bind.PostalCode,
                        width: 90
                    }),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        label: "City",
                        width: 230,
                        bind: this.state.value.bind.City,
                    }),
                    (0, Component_4.jc)("br"),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        bind: this.state.value.bind.Region,
                        label: "Region"
                    }),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        label: "Country",
                        bind: this.state.value.bind.Country,
                        width: 155,
                    }),
                    (0, Component_4.jc)("br"),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        label: "Phone",
                        bind: this.state.value.bind.Phone,
                    }),
                    (0, Component_4.jc)(Textbox_2.Textbox, {
                        label: "Fax",
                        bind: this.state.value.bind.Fax,
                        width: 155,
                    })
                ]
            });
        }
    };
    exports.CustomerView = CustomerView;
    exports.CustomerView = CustomerView = __decorate([
        (0, DBObjectView_3.$DBObjectView)({
            classname: "northwind.Customer",
            actionname: "Northwind/Customers",
            icon: "mdi mdi-nature-people"
        }),
        (0, Registry_4.$Class)("northwind.CustomerView")
    ], CustomerView);
    async function test() {
        var ret = new CustomerView;
        ret.value = await Customer_3.Customer.findOne();
        return ret;
    }
});
define("northwind/EmployeesView", ["require", "exports", "jassijs/ui/converters/DateTimeConverter", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Image", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Employees", "jassijs/ui/DBObjectView", "jassijs/ui/Component", "jassijs/ui/BoxPanel"], function (require, exports, DateTimeConverter_1, ObjectChooser_2, HTMLPanel_2, NumberConverter_2, Image_1, Textarea_2, Textbox_3, Registry_5, Panel_4, Employees_1, DBObjectView_4, Component_5, BoxPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EmployeesView = void 0;
    exports.test = test;
    let EmployeesView = class EmployeesView extends DBObjectView_4.DBObjectView {
        get title() {
            return this.value === undefined ? "EmployeesView" : "EmployeesView " + this.value.id;
        }
        render() {
            return (0, Component_5.jc)(Panel_4.Panel, {
                children: [
                    (0, Component_5.jc)(DBObjectView_4.DBObjectViewToolbar, { view: this }),
                    (0, Component_5.jc)(Textbox_3.Textbox, {
                        label: "Id",
                        bind: this.state.value.bind.id,
                        width: 60,
                        converter: new NumberConverter_2.NumberConverter()
                    }),
                    (0, Component_5.jc)(Textbox_3.Textbox, {
                        label: "First name",
                        bind: this.state.value.bind.FirstName,
                    }),
                    (0, Component_5.jc)(Textbox_3.Textbox, {
                        label: "Last Name",
                        bind: this.state.value.bind.LastName,
                    }),
                    (0, Component_5.jc)(Textbox_3.Textbox, {
                        bind: this.state.value.bind.Title,
                        label: "Title",
                        width: 90
                    }),
                    (0, Component_5.jc)(Textbox_3.Textbox, {
                        label: "Title of C.",
                        width: 85,
                        bind: this.state.value.bind.TitleOfCourtesy
                    }),
                    (0, Component_5.jc)("br"),
                    (0, Component_5.jc)(BoxPanel_1.BoxPanel, {
                        horizontal: true,
                        children: [
                            (0, Component_5.jc)(Panel_4.Panel, {
                                children: [
                                    (0, Component_5.jc)(Textbox_3.Textbox, {
                                        label: "Address",
                                        bind: this.state.value.bind.Address,
                                        width: 345
                                    }),
                                    (0, Component_5.jc)("br"),
                                    (0, Component_5.jc)(Textbox_3.Textbox, {
                                        label: "Postal Code",
                                        bind: this.state.value.bind.PostalCode,
                                        width: 90
                                    }),
                                    (0, Component_5.jc)(Textbox_3.Textbox, {
                                        bind: this.state.value.bind.City,
                                        label: "City",
                                        width: 240
                                    }),
                                    (0, Component_5.jc)("br"),
                                    (0, Component_5.jc)(Textbox_3.Textbox, {
                                        bind: this.state.value.bind.Region,
                                        label: "Region",
                                        width: 90
                                    }),
                                    (0, Component_5.jc)(Textbox_3.Textbox, {
                                        bind: this.state.value.bind.Country,
                                        label: "country",
                                        width: 240
                                    }),
                                    (0, Component_5.jc)("br"),
                                    (0, Component_5.jc)(Textbox_3.Textbox, {
                                        width: 100,
                                        bind: this.state.value.bind.BirthDate,
                                        label: "Birth Date",
                                        converter: new DateTimeConverter_1.DateTimeConverter()
                                    }),
                                    (0, Component_5.jc)(Textbox_3.Textbox, {
                                        bind: this.state.value.bind.HireDate,
                                        label: "Hire Date",
                                        width: 95,
                                        converter: new DateTimeConverter_1.DateTimeConverter()
                                    }),
                                    (0, Component_5.jc)("br"),
                                    (0, Component_5.jc)(Textbox_3.Textbox, {
                                        bind: this.state.value.bind.HomePhone,
                                        label: "Home Phone",
                                        width: 130
                                    })
                                ]
                            }),
                            (0, Component_5.jc)(Textarea_2.Textarea, {
                                width: 240,
                                height: 155,
                                bind: this.state.value.bind.Notes,
                                label: "Notes"
                            }),
                            (0, Component_5.jc)(Image_1.Image, {
                                src: "",
                                style: {
                                    backgroundColor: "black",
                                    borderStyle: "solid"
                                },
                                width: 125, bind: this.state.value.bind.PhotoPath
                            }),
                        ]
                    }),
                    (0, Component_5.jc)(Textbox_3.Textbox, {
                        bind: this.state.value.bind.PhotoPath,
                        label: "Photo Path",
                        width: 460
                    }),
                    (0, Component_5.jc)("br"),
                    (0, Component_5.jc)(Panel_4.Panel, {
                        label: "Reports To",
                        children: [
                            (0, Component_5.jc)(HTMLPanel_2.HTMLPanel, {
                                bind: this.state.value.bind.ReportsTo.FirstName
                            }),
                            " ",
                            (0, Component_5.jc)(HTMLPanel_2.HTMLPanel, {
                                bind: this.state.value.bind.ReportsTo.LastName
                            }),
                            (0, Component_5.jc)(ObjectChooser_2.ObjectChooser, {
                                width: 25,
                                height: 25,
                                bind: this.state.value.bind.ReportsTo,
                                items: "northwind.Employees"
                            })
                        ]
                    })
                ]
            });
        }
    };
    exports.EmployeesView = EmployeesView;
    exports.EmployeesView = EmployeesView = __decorate([
        (0, DBObjectView_4.$DBObjectView)({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        (0, Registry_5.$Class)("northwind.EmployeesView")
    ], EmployeesView);
    async function test() {
        var em = (await Employees_1.Employees.find({ id: 4 }))[0];
        var ret = new EmployeesView;
        ret.value = em;
        //var h=await validate(em);
        // ret.me.address
        return ret;
    }
});
define("northwind/ImportData", ["require", "exports", "jassijs/ui/Button", "jassijs/ui/HTMLPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/util/CSVImport", "jassijs/base/Actions", "jassijs/base/Router", "northwind/remote/OrderDetails", "jassijs/remote/Transaction"], function (require, exports, Button_1, HTMLPanel_3, Registry_6, Panel_5, CSVImport_1, Actions_3, Router_1, OrderDetails_1, Transaction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportData = void 0;
    exports.test = test;
    let ImportData = class ImportData extends Panel_5.Panel {
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
                var all2 = await OrderDetails_1.OrderDetails.find({ where: "Order.id in (:...ids)", whereParams: { ids: ids } });
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
    exports.ImportData = ImportData;
    __decorate([
        (0, Actions_3.$Action)({ name: "Northwind", icon: "mdi mdi-warehouse" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImportData, "dummy", null);
    __decorate([
        (0, Actions_3.$Action)({ name: "Northwind/Import sample data", icon: "mdi mdi-database-import" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImportData, "showDialog", null);
    exports.ImportData = ImportData = __decorate([
        (0, Actions_3.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_6.$Class)("northwind.ImportData"),
        __metadata("design:paramtypes", [])
    ], ImportData);
    async function test() {
        var ret = new ImportData();
        return ret;
    }
});
define("northwind/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "require": {}
    };
});
define("northwind/OrdersView", ["require", "exports", "jassijs/ui/converters/DateTimeConverter", "jassijs/ui/BoxPanel", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Orders", "jassijs/ui/DBObjectView", "jassijs/ui/Component", "jassijs/ui/State"], function (require, exports, DateTimeConverter_2, BoxPanel_2, ObjectChooser_3, HTMLPanel_4, NumberConverter_3, Textbox_4, Registry_7, Panel_6, Orders_2, DBObjectView_5, Component_6, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrdersView = void 0;
    exports.test = test;
    function ProductDetails(props, states) {
        var hh = states.product;
        return (0, Component_6.jc)(Panel_6.Panel, {
            children: [
                (0, Component_6.jc)(Textbox_4.Textbox, { bind: states.product.bind.Quantity, width: 85 }),
                (0, Component_6.jc)(HTMLPanel_4.HTMLPanel, { bind: states.product.bind.Product.ProductName, width: 365 }),
                (0, Component_6.jc)(ObjectChooser_3.ObjectChooser, {
                    bind: states.product.bind.Product,
                    items: "northwind.Products"
                }),
                (0, Component_6.jc)("br"),
            ]
        });
    }
    let OrdersView = class OrdersView extends DBObjectView_5.DBObjectView {
        render() {
            return (0, Component_6.jc)(Panel_6.Panel, {
                children: [
                    (0, Component_6.jc)(DBObjectView_5.DBObjectViewToolbar, { view: this }),
                    (0, Component_6.jc)(BoxPanel_2.BoxPanel, {
                        horizontal: true,
                        children: [
                            (0, Component_6.jc)(Panel_6.Panel, {
                                children: [
                                    (0, Component_6.jc)(Textbox_4.Textbox, { label: "Ship Name", bind: this.state.value.bind.ShipName, width: 260, ref: this.refs.shipName }),
                                    (0, Component_6.jc)(Textbox_4.Textbox, {
                                        label: "Order ID", bind: this.state.value.bind.id, converter: new NumberConverter_3.NumberConverter(), style: {
                                            textAlign: "right",
                                            width: 60
                                        }
                                    }),
                                    (0, Component_6.jc)("br", { tag: "br" }),
                                    (0, Component_6.jc)(Textbox_4.Textbox, { label: "Ship Address", bind: this.state.value.bind.ShipAddress, width: 260, ref: this.refs.shipAddress }),
                                    (0, Component_6.jc)(Textbox_4.Textbox, {
                                        label: "Freight", bind: this.state.value.bind.Freight, width: 60, converter: new NumberConverter_3.NumberConverter({ format: "#.##0,00" }), style: {
                                            textAlign: "right"
                                        }
                                    }),
                                    (0, Component_6.jc)("br", { tag: "br" }),
                                    (0, Component_6.jc)(Textbox_4.Textbox, { label: "Postal Code", bind: this.state.value.bind.ShipPostalCode, width: 60, hidden: false, ref: this.refs.shipPostalCode }),
                                    (0, Component_6.jc)(Textbox_4.Textbox, { bind: this.state.value.bind.ShipCity, label: "Ship City", width: 195, value: "shipCity" }),
                                    (0, Component_6.jc)("br", { tag: "br" }),
                                    (0, Component_6.jc)(Textbox_4.Textbox, { label: "Ship Region", bind: this.state.value.bind.ShipRegion, width: 150, ref: this.refs.shipRegion }),
                                    "",
                                    (0, Component_6.jc)(Textbox_4.Textbox, { label: " Ship Country", bind: this.state.value.bind.ShipCountry, width: 105, ref: this.refs.shipCountry })
                                ],
                                width: 485
                            }),
                            (0, Component_6.jc)(Panel_6.Panel, {
                                children: [
                                    (0, Component_6.jc)(HTMLPanel_4.HTMLPanel, { bind: this.state.value.bind.Customer.CompanyName, label: "Customer", width: 260 }),
                                    (0, Component_6.jc)(ObjectChooser_3.ObjectChooser, {
                                        autocommit: false, items: "northwind.Customer", bind: this.state.value.bind.Customer, height: 25,
                                        onchange: (data) => {
                                            var cust = this.state.value.Customer.current;
                                            this.refs.shipName.value = cust.CompanyName;
                                            this.refs.shipAddress.value = cust.Address;
                                            this.refs.shipPostalCode.value = cust.PostalCode;
                                            this.refs.shipCity.value = cust.City;
                                            this.refs.shipCountry.value = cust.Country;
                                            this.refs.shipRegion.value = cust.Region;
                                        }
                                    }),
                                    (0, Component_6.jc)("br", {}),
                                    (0, Component_6.jc)(HTMLPanel_4.HTMLPanel, { bind: this.state.value.bind.ShipVia, template: "{{id}} {{CompanyName}}", width: 260, label: "Ship Via" }),
                                    (0, Component_6.jc)(ObjectChooser_3.ObjectChooser, { items: "northwind.Shippers", bind: this.state.value.bind.ShipVia }),
                                    (0, Component_6.jc)("br", {}),
                                    (0, Component_6.jc)(HTMLPanel_4.HTMLPanel, { bind: this.state.value.bind.Employee, template: "{{id}} {{FirstName}} {{LastName}}", width: 260, label: "Employee", height: 20 }),
                                    (0, Component_6.jc)(ObjectChooser_3.ObjectChooser, { items: "northwind.Employees", bind: this.state.value.bind.Employee }),
                                    (0, Component_6.jc)("br", {}),
<<<<<<< HEAD
                                    (0, Component_6.jc)(Textbox_4.Textbox, { bind: this.state.value.bind.OrderDate, converter: new DateTimeConverter_2.DateTimeConverter(), label: "Oder Date", width: 95 }),
=======
                                    (0, Component_6.jc)(Textbox_4.Textbox, { bind: this.state.value.bind.OrderDate, converter: new DateTimeConverter_2.DateTimeConverter(), label: "Oder Date", width: 95, text: "Oder Date" }),
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
                                    (0, Component_6.jc)(Textbox_4.Textbox, { bind: this.state.value.bind.RequiredDate, converter: new DateTimeConverter_2.DateTimeConverter(), label: "Required Date", width: 95 }),
                                    (0, Component_6.jc)(Textbox_4.Textbox, { bind: this.state.value.bind.ShippedDate, converter: new DateTimeConverter_2.DateTimeConverter(), label: "Shipped Date", width: 95 })
                                ]
                            })
                        ]
                    }),
                    (0, Component_6.jc)("br", {}),
                    (0, Component_6.jc)("br", {}),
                    (0, Component_6.jc)(HTMLPanel_4.HTMLPanel, { value: "Quantity", width: 90 }),
                    (0, Component_6.jc)(HTMLPanel_4.HTMLPanel, { value: "Text" }),
                    (0, Component_6.jc)("br", {}),
                    (0, Component_6.jc)(BoxPanel_2.BoxPanel, {
                        children: (0, State_1.foreach)(this.state.value.Details, (ob) => (0, Component_6.jc)(ProductDetails, {
                            product: ob
                        }))
                    })
                ]
            });
        }
        get title() {
            return this.value === undefined ? "OrdersView" : "OrdersView " + this.value.id;
        }
    };
    exports.OrdersView = OrdersView;
    exports.OrdersView = OrdersView = __decorate([
        (0, DBObjectView_5.$DBObjectView)({ classname: "northwind.Orders", actionname: "Northwind/Orders", icon: "mdi mdi-script-text", queryname: "findAllWithDetails" }),
        (0, Registry_7.$Class)("northwind.OrdersView")
    ], OrdersView);
    async function test() {
        var order = await Orders_2.Orders.findOne({ id: 10266, relations: ["*"] });
        //  var order=await Orders.find({relations: ["*"] });
        var ret = new OrdersView({
            value: order
        });
        setTimeout(async () => {
            ret.value = order = await Orders_2.Orders.findOne({ id: 10252, relations: ["*"] });
            //  var order=await Orders.find({relations: ["*"] });
        }, 3000);
        return ret;
    }
});
define("northwind/ProductList", ["require", "exports", "jassijs/ui/Checkbox", "jassijs/ui/Textbox", "jassijs/ui/HTMLPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Actions", "jassijs/base/Windows", "northwind/remote/Products", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Component", "jassijs/ui/State"], function (require, exports, Checkbox_1, Textbox_5, HTMLPanel_5, Registry_8, Panel_7, Actions_4, Windows_3, Products_1, NumberConverter_4, Component_7, State_2) {
    "use strict";
    var ProductList_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProductList = void 0;
    exports.test = test;
    Windows_3 = __importDefault(Windows_3);
    function ProductPanel(props, states) {
        return (0, Component_7.jc)(Panel_7.Panel, {
            children: [
                (0, Component_7.jc)(HTMLPanel_5.HTMLPanel, { value: "Product Name:", width: 125 }),
                (0, Component_7.jc)(Textbox_5.Textbox, { bind: states.value.bind.ProductName }),
                (0, Component_7.jc)(Checkbox_1.Checkbox, { text: "Discounted", bind: states.value.bind.Discontinued }),
                (0, Component_7.jc)("br"),
                (0, Component_7.jc)(HTMLPanel_5.HTMLPanel, { value: "Quantity Per Unit:", width: 125 }),
                (0, Component_7.jc)(Textbox_5.Textbox, { bind: states.value.bind.QuantityPerUnit }),
                (0, Component_7.jc)(HTMLPanel_5.HTMLPanel, { value: "Unit Price:" }),
                (0, Component_7.jc)(Textbox_5.Textbox, {
                    bind: states.value.bind.UnitPrice, converter: new NumberConverter_4.NumberConverter({
                        format: "#.##0,00"
                    })
                }),
                (0, Component_7.jc)("br"),
                (0, Component_7.jc)("br"),
            ]
        });
    }
    let ProductList = ProductList_1 = class ProductList extends Panel_7.Panel {
        constructor(props) {
            super(props);
            this.setData();
        }
        render() {
            return (0, Component_7.jc)(Panel_7.Panel, {
                children: [
                    (0, Component_7.jc)(HTMLPanel_5.HTMLPanel, {
                        value: "Productlist",
                        style: {
                            fontSize: "20px",
                            color: "darkblue"
                        }
                    }),
                    (0, Component_7.jc)("br", {}),
                    (0, Component_7.jc)(Panel_7.Panel, {
                        children: (0, State_2.foreach)(this.state.values, (ob) => (0, Component_7.jc)(ProductPanel, { value: ob }))
                    })
                ]
            });
        }
        static showDialog() {
            Windows_3.default.add(new ProductList_1(), "ProductList");
        }
        async setData() {
            var all = await Products_1.Products.find({});
            all.sort((a, b) => { return a.ProductName.localeCompare(b.ProductName); });
            this.state.values.current = all;
        }
    };
    exports.ProductList = ProductList;
    __decorate([
        (0, Actions_4.$Action)({ name: "Northwind/Product List", icon: "mdi mdi-reproduction" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ProductList, "showDialog", null);
    exports.ProductList = ProductList = ProductList_1 = __decorate([
        (0, Actions_4.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_8.$Class)("northwind/ProductList"),
        __metadata("design:paramtypes", [Object])
    ], ProductList);
    async function test() {
        var all = await Products_1.Products.find({});
        all.sort((a, b) => { return a.ProductName.localeCompare(b.ProductName); });
        var ret = new ProductList({ values: all });
        return ret;
    }
});
define("northwind/ProductView", ["require", "exports", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Products", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, ObjectChooser_4, HTMLPanel_6, Checkbox_2, NumberConverter_5, Textbox_6, Registry_9, Panel_8, Products_2, DBObjectView_6, Component_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProductView = void 0;
    exports.test = test;
    let ProductView = class ProductView extends DBObjectView_6.DBObjectView {
        //@$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
        //declare value: Products;
        get title() {
            return this.value === undefined ? "ProductView" : "ProductView " + this.value.id;
        }
        render() {
            return (0, Component_8.jc)(Panel_8.Panel, {
                children: [
                    (0, Component_8.jc)(DBObjectView_6.DBObjectViewToolbar, { view: this }),
                    (0, Component_8.jc)(Textbox_6.Textbox, { label: "Id", bind: this.state.value.bind.id, converter: new NumberConverter_5.NumberConverter() }),
                    (0, Component_8.jc)(Textbox_6.Textbox, { bind: this.state.value.bind.ProductName, label: "Product Name", width: 375, height: 25 }),
                    (0, Component_8.jc)(Checkbox_2.Checkbox, { label: "Discounted", bind: this.state.value.bind.Discontinued }),
                    (0, Component_8.jc)("br", {}),
                    (0, Component_8.jc)(Textbox_6.Textbox, { label: "Quantity per Unit", bind: this.state.value.bind.QuantityPerUnit }),
                    (0, Component_8.jc)(Textbox_6.Textbox, {
                        bind: this.state.value.bind.UnitPrice, converter: new NumberConverter_5.NumberConverter({
                            format: "#.##0,00"
                        }), label: "Unit Price",
                        width: 70
                    }),
                    (0, Component_8.jc)(Textbox_6.Textbox, {
                        label: "Units in Stock", bind: this.state.value.bind.UnitsInStock, converter: new NumberConverter_5.NumberConverter({
                            format: "#.##0,00"
                        }), width: 80
                    }),
                    (0, Component_8.jc)(Textbox_6.Textbox, {
                        bind: this.state.value.bind.UnitsOnOrder, converter: new NumberConverter_5.NumberConverter({
                            format: "#.##0,00"
                        }), label: "Units on Order", width: 80
                    }),
                    (0, Component_8.jc)(Textbox_6.Textbox, { bind: this.state.value.bind.ReorderLevel, label: "Reorder Level", width: 185 }),
                    (0, Component_8.jc)("br", {}),
                    (0, Component_8.jc)(HTMLPanel_6.HTMLPanel, { label: "Category", bind: this.state.value.bind.Category.CategoryName, width: 245 }),
                    (0, Component_8.jc)(ObjectChooser_4.ObjectChooser, { bind: this.state.value.bind.Category, items: "northwind.Categories" }),
                    (0, Component_8.jc)(HTMLPanel_6.HTMLPanel, { label: "Supplier", bind: this.state.value.bind.Supplier.CompanyName, width: 310 }),
                    (0, Component_8.jc)(ObjectChooser_4.ObjectChooser, { bind: this.state.value.bind.Supplier, items: "northwind.Suppliers" })
                ]
            });
        }
    };
    exports.ProductView = ProductView;
    exports.ProductView = ProductView = __decorate([
        (0, DBObjectView_6.$DBObjectView)({ classname: "northwind.Products", actionname: "Northwind/Products", icon: "mdi mdi-reproduction" }),
        (0, Registry_9.$Class)("northwind.ProductView")
    ], ProductView);
    async function test() {
        var prod = await Products_2.Products.findOne({ relations: ["*"] });
        var ret = new ProductView({
            value: prod
        });
        //var h=await Products.find({relations:["Category"]});
        return ret;
    }
});
//this file is autogenerated don't modify
define("northwind/registry", ["require"], function (require) {
    return {
        default: {
            "northwind/CategoriesView.ts": {
                "date": 1740069816828.1345,
                "northwind.CategoriesView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Categories",
                            "actionname": "Northwind/Categories",
                            "icon": "mdi mdi-cube"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "aa",
                            "type": "string"
                        },
                        {
                            "name": "ab",
                            "type": "string"
                        }
                    ]
                }
            },
            "northwind/CustomerOrders.ts": {
                "date": 1740069816828.1345,
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
<<<<<<< HEAD
                "date": 1740306592806.8901,
=======
                "date": 1721666518282.6287,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
<<<<<<< HEAD
                "date": 1740518262796.011,
=======
                "date": 1740069816828.1345,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
                "northwind.CustomerView": {
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
<<<<<<< HEAD
                "date": 1740518268456.369,
=======
                "date": 1740069921944.0195,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
                "date": 1750090577404.1477,
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
<<<<<<< HEAD
                "date": 1740306641064.8445,
=======
                "date": 1740069931533.627,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
                "northwind.OrdersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Orders",
                            "actionname": "Northwind/Orders",
                            "icon": "mdi mdi-script-text",
                            "queryname": "findAllWithDetails"
                        }
                    ]
                }
            },
            "northwind/ProductList.ts": {
                "date": 1740069937097.2405,
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
                "date": 1740069816828.1345,
                "northwind.ProductView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Products",
                            "actionname": "Northwind/Products",
                            "icon": "mdi mdi-reproduction"
                        }
                    ]
                }
            },
            "northwind/remote/Categories.ts": {
                "date": 1750351685504.8457,
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
                "date": 1750338951067.7498,
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
<<<<<<< HEAD
                "date": 1750578071755.4602,
=======
                "date": 1721688634922.4763,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
                "date": 1722528161852.004,
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
<<<<<<< HEAD
                "date": 1750536480531.7024,
=======
                "date": 1722531390341.5852,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
                "date": 1750351726665.7576,
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
                "date": 1681236442000,
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
                "date": 1681236516000,
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
                "date": 1740069816845.413,
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
                "date": 1740069816846.4102,
                "northwind.SuppliersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Suppliers",
                            "actionname": "Northwind/Suppliers",
                            "icon": "mdi mdi-office-building-outline"
                        }
                    ]
                }
            },
            "northwind/remote/MyTest.ts": {
                "date": 1750352881481.6614
            }
        }
    };
});
define("northwind/remote/Categories", ["require", "exports", "northwind/remote/Products", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, Products_3, DBObject_1, Registry_10, DatabaseSchema_1, Validator_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Categories = void 0;
    exports.test = test;
    let Categories = class Categories extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    exports.Categories = Categories;
    __decorate([
        (0, Validator_1.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Categories.prototype, "id", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "CategoryName", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "Description", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)(),
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], Categories.prototype, "Picture", void 0);
    __decorate([
        (0, DatabaseSchema_1.OneToMany)(type => Products_3.Products, e => e.Category),
        __metadata("design:type", typeof (_a = typeof Products_3.Products !== "undefined" && Products_3.Products) === "function" ? _a : Object)
    ], Categories.prototype, "Products", void 0);
    exports.Categories = Categories = __decorate([
        (0, DBObject_1.$DBObject)(),
        (0, Registry_10.$Class)("northwind.Categories"),
        __metadata("design:paramtypes", [])
    ], Categories);
    async function test() {
    }
    ;
});
define("northwind/remote/Customer", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, DBObject_2, Registry_11, DatabaseSchema_2, Validator_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Customer = void 0;
    exports.test = test;
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
    exports.Customer = Customer;
    __decorate([
        (0, Validator_2.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_2.PrimaryColumn)(),
        __metadata("design:type", String)
    ], Customer.prototype, "id", void 0);
    __decorate([
        (0, Validator_2.ValidateIsString)(),
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "CompanyName", void 0);
    __decorate([
        (0, Validator_2.ValidateIsString)(),
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "ContactName", void 0);
    __decorate([
        (0, Validator_2.ValidateIsString)(),
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "ContactTitle", void 0);
    __decorate([
        (0, Validator_2.ValidateIsString)(),
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "Address", void 0);
    __decorate([
        (0, Validator_2.ValidateIsString)(),
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "City", void 0);
    __decorate([
        (0, Validator_2.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_2.Column)({ nullable: true })
        // @Column({default:""})
        ,
        __metadata("design:type", String)
    ], Customer.prototype, "Region", void 0);
    __decorate([
        (0, Validator_2.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_2.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "PostalCode", void 0);
    __decorate([
        (0, Validator_2.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_2.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Country", void 0);
    __decorate([
        (0, Validator_2.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_2.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Phone", void 0);
    __decorate([
        (0, Validator_2.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_2.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Fax", void 0);
    exports.Customer = Customer = __decorate([
        (0, DBObject_2.$DBObject)(),
        (0, Registry_11.$Class)("northwind.Customer"),
        __metadata("design:paramtypes", [])
    ], Customer);
    async function test() {
        var all = await Customer.find();
        //var cus2=<Customer>await Customer.findOne();
        //debugger;
        //await Kunde.sample();
        //	new de.Kunde().generate();
        //jassijs.db.uploadType(de.Kunde);
    }
    ;
});
<<<<<<< HEAD
define("northwind/remote/Employees", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Transaction", "jassijs/remote/RemoteObject", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, DBObject_3, Registry_12, DatabaseSchema_3, Transaction_2, RemoteObject_1, Serverservice_1, Validator_3) {
=======
define("northwind/remote/Employees", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Transaction", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, DBObject_3, Registry_12, DatabaseSchema_3, Transaction_2, Serverservice_1, Validator_3) {
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Employees = void 0;
    exports.test = test;
    exports.test2 = test2;
    let Employees = class Employees extends DBObject_3.DBObject {
        constructor() {
            super();
        }
        static async find(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if ((options === null || options === void 0 ? void 0 : options.relations) === undefined) {
                    if (options === undefined)
                        options = {};
                    options = { relations: ["ReportsTo"] };
                }
<<<<<<< HEAD
                var ret = await RemoteObject_1.RemoteObject.docall(this, this.find, ...arguments);
=======
                var ret = await this.call(this.find, options, context);
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
                return ret;
            }
            else {
                //@ts-ignore
                var man = await (await Serverservice_1.serverservices.db);
                return man.find(context, this, options);
            }
        }
    };
    exports.Employees = Employees;
    __decorate([
        (0, Validator_3.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_3.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Employees.prototype, "id", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "LastName", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "FirstName", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Title", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "TitleOfCourtesy", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Address", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "City", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Region", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PostalCode", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Country", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
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
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Notes", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PhotoPath", void 0);
    __decorate([
        (0, Validator_3.ValidateIsInstanceOf)({ type: type => Employees, optional: true }),
        (0, DatabaseSchema_3.JoinColumn)(),
        (0, DatabaseSchema_3.ManyToOne)(type => Employees),
        __metadata("design:type", Employees)
    ], Employees.prototype, "ReportsTo", void 0);
    __decorate([
        (0, Validator_3.ValidateIsDate)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
    ], Employees.prototype, "BirthDate", void 0);
    __decorate([
        (0, Validator_3.ValidateIsDate)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
    ], Employees.prototype, "HireDate", void 0);
    exports.Employees = Employees = __decorate([
        (0, DBObject_3.$DBObject)(),
        (0, Registry_12.$Class)("northwind.Employees"),
        __metadata("design:paramtypes", [])
    ], Employees);
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    async function test() {
        var all = await Employees.find({ where: "id>:p", whereParams: { p: 5 } });
    }
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
    ;
});
<<<<<<< HEAD
define("northwind/remote/MyTest", ["require", "exports", "northwind/remote/Products", "jassijs/remote/Transaction"], function (require, exports, Products_4, Transaction_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = test;
    async function test() {
        var p = await Products_4.Products.findOne();
        var tr = new Transaction_3.Transaction();
        await tr.useTransaction(async () => {
            return [p.save()];
        });
    }
});
//  var tr=new Transaction();
//    var ret=await tr.useTransaction(async ()=>{
// var c1=new Products();
//  c1.id=58800;
//  var c2=new Products();
//  c2.id="aa500585";
//        var ret=[];
//      ret.push(p.save()),
//    ret.push(p.save());
//   return ret;
// });
define("northwind/remote/OrderDetails", ["require", "exports", "northwind/remote/Products", "northwind/remote/Orders", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, Products_5, Orders_3, DBObject_4, Registry_13, DatabaseSchema_4, Validator_4) {
=======
define("northwind/remote/OrderDetails", ["require", "exports", "northwind/remote/Products", "northwind/remote/Orders", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, Products_4, Orders_3, DBObject_4, Registry_13, DatabaseSchema_4, Validator_4) {
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrderDetails = void 0;
    exports.test = test;
    let OrderDetails = class OrderDetails extends DBObject_4.DBObject {
        constructor() {
            super();
        }
    };
    exports.OrderDetails = OrderDetails;
    __decorate([
        (0, Validator_4.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_4.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "id", void 0);
    __decorate([
        (0, Validator_4.ValidateIsInstanceOf)({ type: type => Orders_3.Orders }),
        (0, DatabaseSchema_4.ManyToOne)(type => Orders_3.Orders, e => e.Details),
        __metadata("design:type", typeof (_a = typeof Orders_3.Orders !== "undefined" && Orders_3.Orders) === "function" ? _a : Object)
    ], OrderDetails.prototype, "Order", void 0);
    __decorate([
<<<<<<< HEAD
        (0, Validator_4.ValidateIsInstanceOf)({ type: type => Products_5.Products }),
        (0, DatabaseSchema_4.ManyToOne)(type => Products_5.Products),
        __metadata("design:type", typeof (_b = typeof Products_5.Products !== "undefined" && Products_5.Products) === "function" ? _b : Object)
=======
        (0, Validator_4.ValidateIsInstanceOf)({ type: type => Products_4.Products }),
        (0, DatabaseSchema_4.ManyToOne)(type => Products_4.Products),
        __metadata("design:type", typeof (_b = typeof Products_4.Products !== "undefined" && Products_4.Products) === "function" ? _b : Object)
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    ], OrderDetails.prototype, "Product", void 0);
    __decorate([
        (0, Validator_4.ValidateIsNumber)(),
        (0, DatabaseSchema_4.Column)({ nullable: false, type: "decimal" }),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "UnitPrice", void 0);
    __decorate([
        (0, Validator_4.ValidateIsNumber)(),
        (0, DatabaseSchema_4.Column)(),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "Quantity", void 0);
    __decorate([
        (0, Validator_4.ValidateIsNumber)(),
        (0, DatabaseSchema_4.Column)({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], OrderDetails.prototype, "Discount", void 0);
    exports.OrderDetails = OrderDetails = __decorate([
        (0, DBObject_4.$DBObject)(),
        (0, Registry_13.$Class)("northwind.OrderDetails"),
        __metadata("design:paramtypes", [])
    ], OrderDetails);
    async function test() {
    }
    ;
});
define("northwind/remote/Orders", ["require", "exports", "northwind/remote/OrderDetails", "northwind/remote/Employees", "northwind/remote/Customer", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "northwind/remote/Shippers", "jassijs/remote/Validator"], function (require, exports, OrderDetails_2, Employees_2, Customer_4, DBObject_5, Registry_14, DatabaseSchema_5, Shippers_1, Validator_5) {
    "use strict";
    var Orders_4;
    var _a, _b, _c, _d, _e, _f;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Orders = void 0;
    exports.test = test;
    let Orders = Orders_4 = class Orders extends DBObject_5.DBObject {
        constructor() {
            super();
        }
<<<<<<< HEAD
        static async findAllWithDetails(context) {
            return await Orders_4.find({ relations: ["*"] }, context);
=======
        static async findAllWithDetails() {
            return await Orders_4.find({ relations: ["*"] });
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        }
    };
    exports.Orders = Orders;
    __decorate([
        (0, Validator_5.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_5.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Orders.prototype, "id", void 0);
    __decorate([
        (0, Validator_5.ValidateIsInstanceOf)({ type: type => Customer_4.Customer }),
        (0, DatabaseSchema_5.ManyToOne)(type => Customer_4.Customer),
        __metadata("design:type", typeof (_a = typeof Customer_4.Customer !== "undefined" && Customer_4.Customer) === "function" ? _a : Object)
    ], Orders.prototype, "Customer", void 0);
    __decorate([
        (0, Validator_5.ValidateIsInstanceOf)({ type: type => Employees_2.Employees }),
        (0, DatabaseSchema_5.ManyToOne)(type => Employees_2.Employees),
        __metadata("design:type", typeof (_b = typeof Employees_2.Employees !== "undefined" && Employees_2.Employees) === "function" ? _b : Object)
    ], Orders.prototype, "Employee", void 0);
    __decorate([
        (0, Validator_5.ValidateIsDate)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
    ], Orders.prototype, "OrderDate", void 0);
    __decorate([
        (0, Validator_5.ValidateIsDate)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
    ], Orders.prototype, "RequiredDate", void 0);
    __decorate([
        (0, Validator_5.ValidateIsDate)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
    ], Orders.prototype, "ShippedDate", void 0);
    __decorate([
        (0, Validator_5.ValidateIsInstanceOf)({ type: type => Shippers_1.Shippers }),
        (0, DatabaseSchema_5.ManyToOne)(type => Shippers_1.Shippers),
        __metadata("design:type", typeof (_f = typeof Shippers_1.Shippers !== "undefined" && Shippers_1.Shippers) === "function" ? _f : Object)
    ], Orders.prototype, "ShipVia", void 0);
    __decorate([
        (0, Validator_5.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], Orders.prototype, "Freight", void 0);
    __decorate([
        (0, Validator_5.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipName", void 0);
    __decorate([
        (0, Validator_5.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipAddress", void 0);
    __decorate([
        (0, Validator_5.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipCity", void 0);
    __decorate([
        (0, Validator_5.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipRegion", void 0);
    __decorate([
        (0, Validator_5.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipPostalCode", void 0);
    __decorate([
        (0, Validator_5.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Orders.prototype, "ShipCountry", void 0);
    __decorate([
        (0, Validator_5.ValidateIsArray)({ type: type => OrderDetails_2.OrderDetails }),
        (0, DatabaseSchema_5.OneToMany)(type => OrderDetails_2.OrderDetails, e => e.Order),
        __metadata("design:type", Array)
    ], Orders.prototype, "Details", void 0);
    exports.Orders = Orders = Orders_4 = __decorate([
        (0, DBObject_5.$DBObject)(),
        (0, Registry_14.$Class)("northwind.Orders"),
        __metadata("design:paramtypes", [])
    ], Orders);
    async function test() {
    }
    ;
});
define("northwind/remote/Products", ["require", "exports", "northwind/remote/Categories", "northwind/remote/Suppliers", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, Categories_2, Suppliers_1, DBObject_6, Registry_15, DatabaseSchema_6, Validator_6) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Products = void 0;
    exports.test = test;
    let Products = class Products extends DBObject_6.DBObject {
        constructor() {
            super();
        }
    };
    exports.Products = Products;
    __decorate([
        (0, Validator_6.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_6.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Products.prototype, "id", void 0);
    __decorate([
        (0, Validator_6.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "ProductName", void 0);
    __decorate([
        (0, Validator_6.ValidateIsInstanceOf)({ type: type => Suppliers_1.Suppliers }),
        (0, DatabaseSchema_6.ManyToOne)(type => Suppliers_1.Suppliers),
        __metadata("design:type", typeof (_a = typeof Suppliers_1.Suppliers !== "undefined" && Suppliers_1.Suppliers) === "function" ? _a : Object)
    ], Products.prototype, "Supplier", void 0);
    __decorate([
        (0, Validator_6.ValidateIsInstanceOf)({ type: c => Categories_2.Categories }),
        (0, DatabaseSchema_6.ManyToOne)(type => Categories_2.Categories, e => e.Products),
        __metadata("design:type", typeof (_b = typeof Categories_2.Categories !== "undefined" && Categories_2.Categories) === "function" ? _b : Object)
    ], Products.prototype, "Category", void 0);
    __decorate([
        (0, Validator_6.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "QuantityPerUnit", void 0);
    __decorate([
        (0, Validator_6.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_6.Column)({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitPrice", void 0);
    __decorate([
        (0, Validator_6.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsInStock", void 0);
    __decorate([
        (0, Validator_6.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsOnOrder", void 0);
    __decorate([
        (0, Validator_6.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "ReorderLevel", void 0);
    __decorate([
        (0, Validator_6.ValidateIsBoolean)(),
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", Boolean)
    ], Products.prototype, "Discontinued", void 0);
    exports.Products = Products = __decorate([
        (0, DBObject_6.$DBObject)(),
        (0, Registry_15.$Class)("northwind.Products"),
        __metadata("design:paramtypes", [])
    ], Products);
    async function test() {
        // var p: Products = <Products>await Products.findOne();
        //  var tr=new Transaction();
        /*    var ret=await tr.useTransaction(async ()=>{
              // var c1=new Products();
             //  c1.id=58800;
             //  var c2=new Products();
             //  c2.id="aa500585";
               var ret=[];
              // ret.push(p.save()),
            //    ret.push(p.save());
             
               return ret;
           });*/
    }
<<<<<<< HEAD
=======
    ;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
});
define("northwind/remote/Shippers", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, DBObject_7, Registry_16, DatabaseSchema_7, Validator_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Shippers = void 0;
    exports.test = test;
    let Shippers = class Shippers extends DBObject_7.DBObject {
        constructor() {
            super();
        }
    };
    exports.Shippers = Shippers;
    __decorate([
        (0, Validator_7.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_7.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Shippers.prototype, "id", void 0);
    __decorate([
        (0, Validator_7.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_7.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Shippers.prototype, "CompanyName", void 0);
    __decorate([
        (0, Validator_7.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_7.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Shippers.prototype, "Phone", void 0);
    exports.Shippers = Shippers = __decorate([
        (0, DBObject_7.$DBObject)(),
        (0, Registry_16.$Class)("northwind.Shippers"),
        __metadata("design:paramtypes", [])
    ], Shippers);
    async function test() {
    }
    ;
});
define("northwind/remote/Suppliers", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, DBObject_8, Registry_17, DatabaseSchema_8, Validator_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Suppliers = void 0;
    exports.test = test;
    let Suppliers = class Suppliers extends DBObject_8.DBObject {
        constructor() {
            super();
        }
    };
    exports.Suppliers = Suppliers;
    __decorate([
        (0, Validator_8.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_8.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Suppliers.prototype, "id", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "CompanyName", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "ContactName", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "ContactTitle", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Address", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "City", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Region", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "PostalCode", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Country", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Phone", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Fax", void 0);
    __decorate([
        (0, Validator_8.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_8.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "HomePage", void 0);
    exports.Suppliers = Suppliers = __decorate([
        (0, DBObject_8.$DBObject)(),
        (0, Registry_17.$Class)("northwind.Suppliers"),
        __metadata("design:paramtypes", [])
    ], Suppliers);
    async function test() {
    }
    ;
    function ValidateIsIntn(arg0) {
        throw new Error("Function not implemented.");
    }
});
define("northwind/reports/CustomerLabels", ["require", "exports", "jassijs_report/Report", "jassijs/ui/Property", "jassijs/remote/Registry", "northwind/remote/Customer", "jassijs/base/Actions"], function (require, exports, Report_1, Property_2, Registry_18, Customer_5, Actions_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomerLabels = void 0;
    exports.test = test;
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
    exports.CustomerLabels = CustomerLabels;
    __decorate([
        (0, Property_2.$Property)({ chooseFrom: function () {
                return allCountries;
            } }),
        __metadata("design:type", String)
    ], CustomerLabels.prototype, "country", void 0);
    __decorate([
        (0, Actions_5.$Action)({
            name: "Northwind/Reports",
            icon: "mdi mdi-file-chart-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], CustomerLabels, "dummy", null);
    exports.CustomerLabels = CustomerLabels = __decorate([
        (0, Actions_5.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Report_1.$Report)({ name: "nothwind/Customer Labels", actionname: "Northwind/Reports/Customer Labels", icon: "mdi mdi-file-chart-outline" }),
        (0, Registry_18.$Class)("nothwind.CustomerLabels")
    ], CustomerLabels);
    async function test() {
        var cl = new CustomerLabels();
        cl.country = "USA";
        return await cl.fill();
        //await cl.open();
    }
});
define("northwind/ShippersView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Shippers", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, NumberConverter_6, Textbox_7, Registry_19, Panel_9, Shippers_2, DBObjectView_7, Component_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShippersView = void 0;
    exports.test = test;
    let ShippersView = class ShippersView extends DBObjectView_7.DBObjectView {
        get title() {
            return this.value === undefined ? "ShippersView" : "ShippersView " + this.value.id;
        }
        render() {
            return (0, Component_9.jc)(Panel_9.Panel, {
                children: [
                    (0, Component_9.jc)(DBObjectView_7.DBObjectViewToolbar, { view: this }),
                    (0, Component_9.jc)(Textbox_7.Textbox, {
                        converter: new NumberConverter_6.NumberConverter(),
                        bind: this.state.value.bind.id, //[me.databinder, "id"],
                        label: "Id",
                        width: 40,
                    }),
                    (0, Component_9.jc)(Textbox_7.Textbox, {
                        bind: this.state.value.bind.CompanyName, // [me.databinder, "CompanyName"],
                        label: "Company name",
                        width: 160
                    }),
                    (0, Component_9.jc)("br"),
                    (0, Component_9.jc)(Textbox_7.Textbox, {
                        width: 215,
                        bind: this.state.value.bind.Phone, //[me.databinder, "Phone"],
                        label: "Phone"
                    })
                ]
            });
        }
    };
    exports.ShippersView = ShippersView;
    exports.ShippersView = ShippersView = __decorate([
        (0, DBObjectView_7.$DBObjectView)({ classname: "northwind.Shippers", actionname: "Northwind/Shippers", icon: "mdi mdi-truck-delivery" }),
        (0, Registry_19.$Class)("northwind.ShippersView")
    ], ShippersView);
    async function test() {
        var ret = new ShippersView();
        ret.value = await Shippers_2.Shippers.findOne();
        return ret;
    }
});
define("northwind/SuppliersView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Suppliers", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, NumberConverter_7, Textbox_8, Registry_20, Panel_10, Suppliers_2, DBObjectView_8, Component_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuppliersView = void 0;
    exports.test = test;
    let SuppliersView = class SuppliersView extends DBObjectView_8.DBObjectView {
        get title() {
            return this.value === undefined ? "SuppliersView" : "SuppliersView " + this.value.id;
        }
        render() {
            return (0, Component_10.jc)(Panel_10.Panel, {
                children: [
                    (0, Component_10.jc)(DBObjectView_8.DBObjectViewToolbar, { view: this }),
                    (0, Component_10.jc)(Textbox_8.Textbox, { bind: this.state.value.bind.id, converter: new NumberConverter_7.NumberConverter(), label: "Id" }),
                    (0, Component_10.jc)(Textbox_8.Textbox, { bind: this.state.value.bind.CompanyName, label: "Company Name" }),
                    (0, Component_10.jc)("br", {}),
                    (0, Component_10.jc)(Textbox_8.Textbox, { bind: this.state.value.bind.ContactName, label: "Contact Name" }),
                    (0, Component_10.jc)(Textbox_8.Textbox, { label: "Contact Title", bind: this.state.value.bind.ContactTitle }),
                    (0, Component_10.jc)("br", {}),
                    (0, Component_10.jc)(Textbox_8.Textbox, { bind: this.state.value.bind.Address, label: "Address", width: 330 }),
                    (0, Component_10.jc)("br", {}),
                    (0, Component_10.jc)(Textbox_8.Textbox, { bind: this.state.value.bind.PostalCode, label: "Postal Code" }),
                    (0, Component_10.jc)(Textbox_8.Textbox, { bind: this.state.value.bind.City, label: "City" }),
                    (0, Component_10.jc)("br", {}),
                    (0, Component_10.jc)(Textbox_8.Textbox, { bind: this.state.value.bind.Region, label: "Region" }),
                    (0, Component_10.jc)(Textbox_8.Textbox, { bind: this.state.value.bind.Country, label: "Country" }),
                    (0, Component_10.jc)("br", {}),
                    (0, Component_10.jc)(Textbox_8.Textbox, { label: "Phone", bind: this.state.value.bind.Phone }),
                    (0, Component_10.jc)(Textbox_8.Textbox, { label: "Fax", bind: this.state.value.bind.Fax }),
                    (0, Component_10.jc)("br", {}),
                    (0, Component_10.jc)(Textbox_8.Textbox, { label: "Homepage", bind: this.state.value.bind.HomePage, width: 330 })
                ]
            });
        }
    };
    exports.SuppliersView = SuppliersView;
    exports.SuppliersView = SuppliersView = __decorate([
        (0, DBObjectView_8.$DBObjectView)({ classname: "northwind.Suppliers", actionname: "Northwind/Suppliers", icon: "mdi mdi-office-building-outline" }),
        (0, Registry_20.$Class)("northwind.SuppliersView")
    ], SuppliersView);
    async function test() {
        var sup = await Suppliers_2.Suppliers.findOne();
        var ret = new SuppliersView({
            value: sup
        });
        return ret;
    }
});
//this file is autogenerated don't modify
define("northwind/registry", ["require"], function (require) {
    return {
        default: {
            "northwind/CategoriesView.ts": {
                "date": 1740069816828.1345,
                "northwind.CategoriesView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Categories",
                            "actionname": "Northwind/Categories",
                            "icon": "mdi mdi-cube"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "aa",
                            "type": "string"
                        },
                        {
                            "name": "ab",
                            "type": "string"
                        }
                    ]
                }
            },
            "northwind/CustomerOrders.ts": {
                "date": 1740069816828.1345,
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
<<<<<<< HEAD
                "date": 1740306592806.8901,
=======
                "date": 1721666518282.6287,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
<<<<<<< HEAD
                "date": 1740518262796.011,
=======
                "date": 1740069816828.1345,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
                "northwind.CustomerView": {
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
<<<<<<< HEAD
                "date": 1740518268456.369,
=======
                "date": 1740069921944.0195,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
                "date": 1750090577404.1477,
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
<<<<<<< HEAD
                "date": 1740306641064.8445,
=======
                "date": 1740069931533.627,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
                "northwind.OrdersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Orders",
                            "actionname": "Northwind/Orders",
                            "icon": "mdi mdi-script-text",
                            "queryname": "findAllWithDetails"
                        }
                    ]
                }
            },
            "northwind/ProductList.ts": {
                "date": 1740069937097.2405,
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
                "date": 1740069816828.1345,
                "northwind.ProductView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Products",
                            "actionname": "Northwind/Products",
                            "icon": "mdi mdi-reproduction"
                        }
                    ]
                }
            },
            "northwind/remote/Categories.ts": {
                "date": 1750351685504.8457,
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
                "date": 1750338951067.7498,
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
<<<<<<< HEAD
                "date": 1750578071755.4602,
=======
                "date": 1721688634922.4763,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
                "date": 1722528161852.004,
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
<<<<<<< HEAD
                "date": 1750536480531.7024,
=======
                "date": 1722531390341.5852,
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
                "date": 1750351726665.7576,
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
                "date": 1681236442000,
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
                "date": 1681236516000,
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
                "date": 1740069816845.413,
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
                "date": 1740069816846.4102,
                "northwind.SuppliersView": {
                    "$DBObjectView": [
                        {
                            "classname": "northwind.Suppliers",
                            "actionname": "Northwind/Suppliers",
                            "icon": "mdi mdi-office-building-outline"
                        }
                    ]
                }
            },
            "northwind/remote/MyTest.ts": {
                "date": 1750352881481.6614
            }
        }
    };
});
//# sourceMappingURL=northwind.js.map