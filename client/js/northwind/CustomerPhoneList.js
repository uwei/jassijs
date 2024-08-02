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
define(["require", "exports", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/base/Actions", "jassijs/base/Windows", "northwind/remote/Customer", "jassijs/ui/Component"], function (require, exports, Table_1, Registry_1, Actions_1, Windows_1, Customer_1, Component_1) {
    "use strict";
    var CustomerPhoneList_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerPhoneList = void 0;
    Windows_1 = __importDefault(Windows_1);
    let CustomerPhoneList = CustomerPhoneList_1 = class CustomerPhoneList extends Component_1.Component {
        constructor(props = {}) {
            super(props);
            this.setData();
        }
        render() {
            return (0, Component_1.jc)(Table_1.Table, {
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
            var all = await Customer_1.Customer.find();
            this.refs.table.items = all;
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
        __metadata("design:paramtypes", [Object])
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