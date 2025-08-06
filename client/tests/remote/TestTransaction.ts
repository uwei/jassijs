import { UseServer } from "jassijs/remote/RemoteObject";
import { Test } from "jassijs/remote/Test";
import { Transaction, TransactionContext } from "jassijs/remote/Transaction";
import { $Class } from "jassijs/remote/Registry";
import { Customer } from "northwind/remote/Customer";
import { Products } from "northwind/remote/Products";

@$Class("tests.remote.TransactionTest")
export class TransactionTest {
    @UseServer()
    async product(num: number,context:TransactionContext=undefined){
        
        if(context.transaction){
            return context.transaction.registerAction("hi",num+10000,async (nums)=>{
                var ret=[];
                for(let x=0;x<nums.length;x++){
                    ret.push("product:"+num*num+" ("+x+"/"+nums.length+")");
                }
                return ret;
            },context)
        }
        return "product:"+num*num;
    }
   
}
export async function test(t: Test) {
    var trans = new Transaction();
    var cs:Products=<any>await Products.findOne(1);
    var cs2:Products=<any>await Products.findOne(2);
    console.log(cs.UnitPrice+":"+cs2.UnitPrice);
        var tr = new TransactionTest();
        cs.UnitPrice=66;
        trans.add(cs,cs.save);
        cs2.UnitPrice="jjj";
        trans.add(cs2,cs2.save);
    
    debugger;
    var all = await trans.execute();

   
} 
export async function test2(t: Test) {
    let single=await new TransactionTest().product(2);
    t.expectEqual(single==="product:4");
    var trans = new Transaction();
    for (var x = 0; x < 3; x++) {
        var tr = new TransactionTest();

        trans.add(tr, tr.product, x);
    }
    var all = await trans.execute();

    t.expectEqual(all.join() === 'product:4 (0/3),product:4 (1/3),product:4 (2/3)')

} 