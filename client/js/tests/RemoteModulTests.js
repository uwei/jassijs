define(["require", "exports", "jassijs/remote/FileNode", "jassijs/remote/Server", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs/ui/DatabaseDesigner", "jassijs/remote/DBObject", "jassijs/remote/DatabaseTools"], function (require, exports, FileNode_1, Server_1, Classes_1, Registry_1, DatabaseDesigner_1, DBObject_1, DatabaseTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test(teste) {
        try {
            await new Server_1.Server().createModule("testrmodul");
            await new Server_1.Server().createFolder("testrmodul/remote");
            await new Server_1.Server().saveFile("testrmodul/remote/TestRModul.ts", `import { $Class } from "jassijs/remote/Jassi";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";

@$Class("testrmodul.remote.TestRModul")
export class TestRModul extends RemoteObject{
    //this is a sample remote function
    public async sayHello(name: string,context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call(this, this.sayHello, name,context);
        } else {
            return "Hello "+name;  //this would be execute on server  
        }
    }
}`);
            //create new DB Object
            var ret = new DatabaseDesigner_1.DatabaseDesigner(false);
            await ret.readSchema();
            await ret.addClass("testrmodul.TestRCustomer");
            await ret.addField("string", "name");
            var sr = await ret.saveAll(false);
            teste.expectEqual(sr === "");
            ret.destroy();
            await Registry_1.default.reload();
            var ro = await new (await Classes_1.classes.loadClass("testrmodul.remote.TestRModul"))().sayHello("you");
            teste.expectEqual(ro === "Hello you");
            var TestRCustomer = await Classes_1.classes.loadClass("testrmodul.TestRCustomer");
            DBObject_1.DBObject.clearCache("testrmodul.TestRCustomer");
            var cust = new TestRCustomer();
            cust.id = 50;
            cust.name = "Hallo";
            await cust.save();
            var tcust = await TestRCustomer.findOne();
            teste.expectEqual((tcust === null || tcust === void 0 ? void 0 : tcust.name) === "Hallo");
        }
        catch (err) {
            throw err;
        }
        finally {
            var root = new FileNode_1.FileNode("");
            root.files = [];
            new Server_1.Server().delete("testrmodul");
            new Server_1.Server().removeServerModul("testrmodul");
            DatabaseTools_1.DatabaseTools.dropTables(["testrmodul_testrcustomer"]);
        }
    }
    exports.test = test;
});
//# sourceMappingURL=RemoteModulTests.js.map