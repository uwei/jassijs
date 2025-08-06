import { Products } from "northwind/remote/Products";
import { Transaction } from "jassijs/remote/Transaction";

export async function test() {
    var p: Products = <Products>await Products.findOne();
    var tr=new Transaction();
    await tr.useTransaction(async ()=>{
        return [ p.save()];
    });
}
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
    
   
