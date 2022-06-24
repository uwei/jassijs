import { OrderDetails } from "northwind/remote/OrderDetails";
import { Orders } from "northwind/remote/Orders";
import { Transaction } from "jassijs/remote/Transaction";

export async function test() {
    var a = await Orders.find();
    var ids = [];
    a.forEach((o) => { ids.push(o.id) });


    var all = await Orders.find({
        where: "id in (:...ids)",
        whereParams: { ids: ids },
        relations: ["Details"]
    });
    var all2 = await OrderDetails.find({
        where: "Order.id in (:...ids)",
        whereParams: { ids: ids }
    });
    var trans = new Transaction();
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
