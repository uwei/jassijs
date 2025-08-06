"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.test2 = exports.test = exports.TransactionTest = void 0;
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
const Transaction_1 = require("jassijs/remote/Transaction");
const Registry_1 = require("jassijs/remote/Registry");
const Products_1 = require("northwind/remote/Products");
let TransactionTest = class TransactionTest {
    async product(num, context = undefined) {
        if (context.transaction) {
            return context.transaction.registerAction("hi", num + 10000, async (nums) => {
                var ret = [];
                for (let x = 0; x < nums.length; x++) {
                    ret.push("product:" + num * num + " (" + x + "/" + nums.length + ")");
                }
                return ret;
            }, context);
        }
        return "product:" + num * num;
    }
};
__decorate([
    (0, RemoteObject_1.UseServer)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_a = typeof Transaction_1.TransactionContext !== "undefined" && Transaction_1.TransactionContext) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], TransactionTest.prototype, "product", null);
TransactionTest = __decorate([
    (0, Registry_1.$Class)("tests.remote.TransactionTest")
], TransactionTest);
exports.TransactionTest = TransactionTest;
async function test(t) {
    var trans = new Transaction_1.Transaction();
    var cs = await Products_1.Products.findOne(1);
    var cs2 = await Products_1.Products.findOne(2);
    console.log(cs.UnitPrice + ":" + cs2.UnitPrice);
    var tr = new TransactionTest();
    cs.UnitPrice = 66;
    trans.add(cs, cs.save);
    cs2.UnitPrice = "jjj";
    trans.add(cs2, cs2.save);
    debugger;
    var all = await trans.execute();
}
exports.test = test;
async function test2(t) {
    let single = await new TransactionTest().product(2);
    t.expectEqual(single === "product:4");
    var trans = new Transaction_1.Transaction();
    for (var x = 0; x < 3; x++) {
        var tr = new TransactionTest();
        trans.add(tr, tr.product, x);
    }
    var all = await trans.execute();
    t.expectEqual(all.join() === 'product:4 (0/3),product:4 (1/3),product:4 (2/3)');
}
exports.test2 = test2;
//# sourceMappingURL=TestTransaction.js.map