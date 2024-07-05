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
define(["require", "exports", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Actions", "jassijs/base/Windows", "northwind/remote/Customer"], function (require, exports, Table_1, Registry_1, Panel_1, Actions_1, Windows_1, Customer_1) {
    "use strict";
    var CustomerPhoneList_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerPhoneList = void 0;
    Windows_1 = __importDefault(Windows_1);
    let CustomerPhoneList = CustomerPhoneList_1 = class CustomerPhoneList extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            var _this = this;
            me.table = new Table_1.Table();
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
            var all = await Customer_1.Customer.find();
            this.me.table.items = all;
            //  new Customer().Fax
        }
        static showDialog() {
            Windows_1.default.add(new CustomerPhoneList_1(), "Customer Phone List");
        }
    };
    __decorate([
        (0, Actions_1.$Action)({ name: "Northwind/Customer Phone List", icon: "mdi-script-text-play-outline" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CustomerPhoneList, "showDialog", null);
    CustomerPhoneList = CustomerPhoneList_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("northwind/CustomerPhoneList"),
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
//# sourceMappingURL=CustomerPhoneList.js.map