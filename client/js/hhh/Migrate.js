define(["require", "exports", "jassijs/server/Filesystem"], function (require, exports, Filesystem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test() {
        //await myfs.mkdir("./client");
        /*  var jassijs=`{
              "modules": {
              "hhh": "hhh"
              },
              "server":{
                   "modules": {
                      "hhh": "hhh"
                     },
              }
          }`;
          await myfs.writeFile("./client/jassijs.json",jassijs);*/
        await new Filesystem_1.default().createModule("hhh");
        console.log("hallo");
    }
    exports.test = test;
});
//# sourceMappingURL=Migrate.js.map