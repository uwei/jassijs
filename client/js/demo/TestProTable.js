define(["require", "exports", "jassijs/ui/Table"], function (require, exports, Table_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var x = 0;
    async function test() {
        /*  var dat=await Orders.find({
             //where:`UPPER("ShipName") LIKE '%AC%'`
             where:`UPPER(CAST(ID AS TEXT)) LIKE :mftext`,
             whereParams:{mftext:"%24%"}
          });
         debugger;*/
        var tab = new Table_1.Table({
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
    exports.test = test;
});
//# sourceMappingURL=TestProTable.js.map