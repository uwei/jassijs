import { Table } from "jassi/ui/Table";
import { Button } from "jassi/ui/Button";
import { Panel } from "jassi/ui/Panel";
import { Textbox } from "jassi/ui/Textbox";

import { Server } from "jassi/remote/Server";
type Me = {
    button1?: Button;
    button2?: Button;
    button3?: Button;
    table1?: Table;
};
class Test{
    test(id){
        var test=id;
        for(var x=1;x<1000;y++){
            var ob=Context.get("meintest");
        }
        return ob.hallo;
    }
}
async function c(){
    var err=new Error();
    return 1;
}
async function b(){
    var p=await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(5)

        },100);
    })
    return c();
}
async function a(){
    return await b();
}
export async function test() {
  debugger;
   /*var t=new Test();
   var context=new Context();
   var r=context.register("meintest",{hallo:9},async ()=>{
       return t.test(8);
   });
   alert(await r);
   context.destroy();*/
}
