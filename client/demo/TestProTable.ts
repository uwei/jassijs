import { Table } from "jassijs/ui/Table";


var x = 0;
export async function test() {
    /*  var dat=await Orders.find({
         //where:`UPPER("ShipName") LIKE '%AC%'`
         where:`UPPER(CAST(ID AS TEXT)) LIKE :mftext`,
         whereParams:{mftext:"%24%"}
      });
     debugger;*/
    var tab = new Table({
        options: {
            lazyLoad: {
                classname: "tests.TestBigData",
                loadFunc: "find",
                pageSize: 10
            }
        }
    });
    tab.showSearchbox = true;
    tab.table.on("headerClick", function (e, c) {
        setTimeout(() => {
            tab.table.replaceData("/data.php");

        }, 100);
        //debugger;
        console.log("now");
    });
    tab.width = "100%";
    tab.height = 300;
    return tab;
}
