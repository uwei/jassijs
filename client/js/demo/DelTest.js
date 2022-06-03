define(["require", "exports", "northwind/remote/OrderDetails", "northwind/remote/Orders", "jassijs/remote/Transaction"], function (require, exports, OrderDetails_1, Orders_1, Transaction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test() {
        var a = await Orders_1.Orders.find();
        var ids = [];
        a.forEach((o) => { ids.push(o.id); });
        var all = await Orders_1.Orders.find({
            where: "id in (:...ids)",
            whereParams: { ids: ids },
            relations: ["Details"]
        });
        var all2 = await OrderDetails_1.OrderDetails.find({
            where: "Order.id in (:...ids)",
            whereParams: { ids: ids }
        });
        var trans = new Transaction_1.Transaction();
        console.log(all2.length);
        trans.add(all2[0], all2[0].remove);
        trans.add(all2[1], all2[1].remove);
        await trans.execute();
        // var all2=await OrderDetails.find({where:"Order.id in (10050)"});
        //    debugger;
        /*var dat=new OrderDetails();
        dat.UnitPrice=1;
        dat.Quantity=1;
        await dat.save();
        console.log(dat.id);*/
    }
    exports.test = test;
});
//# sourceMappingURL=DelTest.js.map