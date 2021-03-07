var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("northwind/CustomerView", ["require", "exports", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Customer", "jassi/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Jassi_1, Property_1, Customer_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerView = void 0;
    let CustomerView = class CustomerView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "CustomerView" : "CustomerView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_1.Textbox();
            me.companyname = new Textbox_1.Textbox();
            me.contacttitle = new Textbox_1.Textbox();
            me.contactname = new Textbox_1.Textbox();
            me.address = new Textbox_1.Textbox();
            me.postalcode = new Textbox_1.Textbox();
            me.textbox1 = new Textbox_1.Textbox();
            me.region = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            me.phone = new Textbox_1.Textbox();
            me.fax = new Textbox_1.Textbox();
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
            me.id.converter = new NumberConverter_1.NumberConverter();
            me.id.label = "id";
            me.companyname.x = 195;
            me.companyname.y = 45;
            me.companyname.bind(me.databinder, "CompanyName");
            me.companyname.label = "Company Name";
            me.contacttitle.x = 10;
            me.contacttitle.y = 45;
            me.contacttitle.label = "Contact Title";
            me.contacttitle.bind(me.databinder, "ContactTitle");
            me.contactname.x = 90;
            me.contactname.y = 5;
            me.contactname.label = "Contact Name";
            me.contactname.bind(me.databinder, "ContactName");
            me.contactname.width = 215;
            me.address.x = 10;
            me.address.y = 90;
            me.address.bind(me.databinder, "Address");
            me.address.label = "Address";
            me.address.width = 355;
            me.postalcode.x = 10;
            me.postalcode.y = 140;
            me.postalcode.label = "Postal Code";
            me.postalcode.bind(me.databinder, "PostalCode");
            me.postalcode.width = 90;
            me.textbox1.x = 115;
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
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Customer_1.Customer !== "undefined" && Customer_1.Customer) === "function" ? _a : Object)
    ], CustomerView.prototype, "value", void 0);
    CustomerView = __decorate([
        DBObjectView_1.$DBObjectView({
            classname: "northwind.Customer",
            actionname: "Northwind/Customers",
            icon: "mdi mdi-nature-people"
        }),
        Jassi_1.$Class("northwind/CustomerView"),
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
define("northwind/EmployeesView", ["require", "exports", "jassi/ui/converters/NumberConverter", "jassi/ui/Image", "jassi/ui/Textarea", "jassi/ui/Calendar", "jassi/ui/Textbox", "jassi/ui/Button", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Employees", "jassi/ui/DBObjectView"], function (require, exports, NumberConverter_2, Image_1, Textarea_1, Calendar_1, Textbox_2, Button_1, Jassi_2, Property_2, Employees_1, DBObjectView_2) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.EmployeesView = void 0;
    let EmployeesView = class EmployeesView extends DBObjectView_2.DBObjectView {
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
            me.titleOfCouttesy = new Textbox_2.Textbox();
            me.firstName = new Textbox_2.Textbox();
            me.textbox1 = new Textbox_2.Textbox();
            me.title = new Textbox_2.Textbox();
            me.address = new Textbox_2.Textbox();
            me.postalCode = new Textbox_2.Textbox();
            me.city = new Textbox_2.Textbox();
            me.birthDate = new Calendar_1.Calendar();
            me.region = new Textbox_2.Textbox();
            me.state = new Textbox_2.Textbox();
            me.hiredate = new Calendar_1.Calendar();
            me.homephone = new Textbox_2.Textbox();
            me.notes = new Textarea_1.Textarea();
            me.image1 = new Image_1.Image();
            me.textbox2 = new Textbox_2.Textbox();
            me.id = new Textbox_2.Textbox();
            me.button1.text = "button";
            me.main.width = "900";
            me.main.height = "800";
            me.main.isAbsolute = true;
            me.main.add(me.titleOfCouttesy);
            me.main.add(me.firstName);
            me.main.add(me.textbox1);
            me.main.add(me.title);
            me.main.add(me.address);
            me.main.add(me.postalCode);
            me.main.add(me.city);
            me.main.add(me.birthDate);
            me.main.add(me.region);
            me.main.add(me.state);
            me.main.add(me.hiredate);
            me.main.add(me.homephone);
            me.main.add(me.notes);
            me.main.add(me.image1);
            me.main.add(me.textbox2);
            me.main.add(me.id);
            me.titleOfCouttesy.x = 525;
            me.titleOfCouttesy.y = 5;
            me.titleOfCouttesy.label = "Title of C.";
            me.titleOfCouttesy.width = 85;
            me.titleOfCouttesy.bind(me.databinder, "TitleOfCourtesy");
            me.firstName.x = 80;
            me.firstName.y = 5;
            me.firstName.label = "First name";
            me.firstName.bind(me.databinder, "FirstName");
            me.textbox1.x = 250;
            me.textbox1.y = 5;
            me.textbox1.label = "Last Name";
            me.textbox1.bind(me.databinder, "LastName");
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
            this.width = 778;
            this.height = 828;
            me.image1.x = 630;
            me.image1.y = 20;
            me.image1.src = "";
            me.image1.css({
                background_color: "black",
                border_style: "solid"
            });
            me.image1.width = 125;
            me.image1.bind(me.databinder, "PhotoPath");
            me.textbox2.x = 5;
            me.textbox2.y = 240;
            me.textbox2.bind(me.databinder, "PhotoPath");
            me.textbox2.label = "Photo Path";
            me.textbox2.width = 610;
            me.id.x = 5;
            me.id.y = 5;
            me.id.width = 60;
            me.id.label = "Id";
            me.id.bind(me.databinder, "id");
            me.id.converter = new NumberConverter_2.NumberConverter();
        }
    };
    __decorate([
        Property_2.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Employees_1.Employees !== "undefined" && Employees_1.Employees) === "function" ? _a : Object)
    ], EmployeesView.prototype, "value", void 0);
    EmployeesView = __decorate([
        DBObjectView_2.$DBObjectView({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        Jassi_2.$Class("northwind.EmployeesView"),
        __metadata("design:paramtypes", [])
    ], EmployeesView);
    exports.EmployeesView = EmployeesView;
    async function test() {
        var em = (await Employees_1.Employees.find())[0];
        var ret = new EmployeesView;
        ret["value"] = await Employees_1.Employees.findOne();
        return ret;
    }
    exports.test = test;
});
define("northwind/ImportData", ["require", "exports", "jassi/ui/Button", "jassi/ui/HTMLPanel", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/util/CSVImport", "jassi/base/Actions", "jassi/base/Router"], function (require, exports, Button_2, HTMLPanel_1, Jassi_3, Panel_1, CSVImport_1, Actions_1, Router_1) {
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
            this.me.IDProtokoll.value += "<br>Fertig";
        }
        layout(me) {
            var _this = this;
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.IDImport = new Button_2.Button();
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
        Jassi_3.$Class("northwind.ImportData"),
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
//this file is autogenerated don't modify
define("northwind/registry", ["require"], function (require) {
    return {
        default: {
            "northwind/CustomerView.ts": {
                "date": 1613583380375,
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
                "date": 1614439057694,
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
                "date": 1613935445224,
                "northwind.ImportData": {
                    "$ActionProvider": [
                        "jassi.base.ActionNode"
                    ]
                }
            },
            "northwind/modul.ts": {
                "date": 1613551043267
            },
            "northwind/remote/Customer.ts": {
                "date": 1615052487959,
                "northwind.Customer": {
                    "$DBObject": []
                }
            },
            "northwind/remote/Employees.ts": {
                "date": 1614966827636,
                "northwind.Employees": {
                    "$DBObject": []
                }
            }
        }
    };
});
define("northwind/remote/Customer", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, DBObject_1, Jassi_4, DatabaseSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Customer = void 0;
    let Customer = class Customer extends DBObject_1.DBObject {
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
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], Customer.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "CompanyName", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "ContactName", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "ContactTitle", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "Address", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Customer.prototype, "City", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Region", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "PostalCode", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Country", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Phone", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Customer.prototype, "Fax", void 0);
    Customer = __decorate([
        DBObject_1.$DBObject(),
        Jassi_4.$Class("northwind.Customer"),
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
define("northwind/remote/Employees", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema", "jassi/remote/Transaction"], function (require, exports, DBObject_2, Jassi_5, DatabaseSchema_2, Transaction_1) {
    "use strict";
    var Employees_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Employees = void 0;
    let Employees = Employees_2 = class Employees extends DBObject_2.DBObject {
        constructor() {
            super();
        }
        /* static async find(options = undefined,context:Context=undefined): Promise<any[]> {
             if (!context?.isServer) {
                 return await this.call(this.find, options,context);
             }
             else {
                 //@ts-ignore
                 var man = await (await import("jassi/server/DBManager")).DBManager.get();
                 return man.find(context,this, options);
             }
         }*/
        async hallo(num) {
            if (!Jassi_5.default.isServer) {
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
        DatabaseSchema_2.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Employees.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "LastName", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "FirstName", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Title", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "TitleOfCourtesy", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Address", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "City", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Region", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PostalCode", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Country", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "HomePhone", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Extension", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Photo", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "Notes", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Employees.prototype, "PhotoPath", void 0);
    __decorate([
        DatabaseSchema_2.JoinColumn(),
        DatabaseSchema_2.ManyToOne(type => Employees_2),
        __metadata("design:type", Employees)
    ], Employees.prototype, "ReportsTo", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", Date)
    ], Employees.prototype, "BirthDate", void 0);
    __decorate([
        DatabaseSchema_2.Column({ nullable: true }),
        __metadata("design:type", Date)
    ], Employees.prototype, "HireDate", void 0);
    Employees = Employees_2 = __decorate([
        DBObject_2.$DBObject(),
        Jassi_5.$Class("northwind.Employees"),
        __metadata("design:paramtypes", [])
    ], Employees);
    exports.Employees = Employees;
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    async function test() {
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
    exports.test = test;
    ;
});
//# sourceMappingURL=northwind.js.map