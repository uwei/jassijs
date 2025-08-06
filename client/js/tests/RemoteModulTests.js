var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/FileNode", "jassijs/remote/Server", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs_editor/DatabaseDesigner", "jassijs/remote/DBObject", "jassijs/remote/DatabaseTools"], function (require, exports, FileNode_1, Server_1, Classes_1, Registry_1, DatabaseDesigner_1, DBObject_1, DatabaseTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    Registry_1 = __importDefault(Registry_1);
    async function test(teste) {
        try {
            await new Server_1.Server().createModule("testrmodul");
            await new Server_1.Server().createFolder("testrmodul/remote");
            await new Server_1.Server().saveFile("testrmodul/remote/TestRModul.ts", `import { $Class } from "jassijs/remote/Registry";
import { UseServer } from "jassijs/remote/RemoteObject";

@$Class("testrmodul.remote.TestRModul")
export class TestRModul {
    //this is a sample remote function
    @UseServer()
    public async sayHello(name: string,context: Context = undefined) {
            return "Hello "+name;  //this would be execute on server  
        
    }
}`);
            //create new DB Object
            var ret = new DatabaseDesigner_1.DatabaseDesigner(false);
            await ret.readSchema();
            await ret.addClass("testrmodul.TestRCustomer");
            await ret.addField("string", "name");
            var sr = await ret.saveAll(false);
            if (sr !== "") {
                throw new Error(sr);
            }
            teste.expectEqual(sr === "");
            ret.destroy();
            await Registry_1.default.reload();
            var ro = await new (await Classes_1.classes.loadClass("testrmodul.remote.TestRModul"))().sayHello("you");
            teste.expectEqual(ro === "Hello you");
            var TestRCustomer = await Classes_1.classes.loadClass("testrmodul.TestRCustomer");
            DBObject_1.DBObject.clearCache("testrmodul.TestRCustomer");
            var cust = new TestRCustomer();
            cust.id = 52;
            cust.name = "Hallo";
            await cust.save();
            var tcust = await TestRCustomer.findOne();
            //@ts-ignore
            teste.expectEqual((tcust === null || tcust === void 0 ? void 0 : tcust.name) === "Hallo");
            await tcust.remove();
        }
        catch (err) {
            throw err;
        }
        finally {
            var root = new FileNode_1.FileNode("");
            root.files = [];
            await new Server_1.Server().delete("testrmodul");
            await new Server_1.Server().removeServerModul("testrmodul");
            try {
                var hh = await DatabaseTools_1.DatabaseTools.dropTables(["testrmodul_testrcustomer"]);
            }
            catch (err) {
            }
        }
    }
    exports.test = test;
});
//# sourceMappingURL=RemoteModulTests.js.map