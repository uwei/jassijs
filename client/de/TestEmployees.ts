import { Table } from "jassijs/ui/Table";
import { Customer } from "northwind/remote/Customer";
import { OrderDetails } from "northwind/remote/OrderDetails";
import { Orders } from "northwind/remote/Orders";

var x=0;
export async function test() {
   /*  var dat=await Orders.find({
        //where:`UPPER("ShipName") LIKE '%AC%'`
        where:`UPPER(CAST(ID AS TEXT)) LIKE :mftext`,
        whereParams:{mftext:"%24%"}
     });
    debugger;*/
    var tab = new Table({
        lazyLoad: {
            //classname: "tests.TestBigData",
            classname:"northwind.Products",
            loadFunc: "find",
            pageSize:500
        },



    });
    tab.showSearchbox=true;
   /* tab.table.on("headerClick", function (e, c) {
        setTimeout(() => {
            tab.table.replaceData("/data.php");

        }, 100);
        //debugger;
        console.log("now");
    });*/
    tab.width = "100%";
    tab.height = 300;
    return tab;
}
