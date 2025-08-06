"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const Products_1 = require("northwind/remote/Products");
const Transaction_1 = require("jassijs/remote/Transaction");
async function test() {
    var p = await Products_1.Products.findOne();
    var tr = new Transaction_1.Transaction();
    await tr.useTransaction(async () => {
        return [p.save()];
    });
}
exports.test = test;
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
//# sourceMappingURL=MyTest.js.map