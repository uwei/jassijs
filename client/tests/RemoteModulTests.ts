import { FileNode } from "jassijs/remote/FileNode";
import { FileActions } from "jassijs/ui/FileExplorer";
import { Server } from "jassijs/remote/Server";
import { classes } from "jassijs/remote/Classes";
import { Tests } from "jassijs/base/Tests";
import registry from "jassijs/remote/Registry";
import { DatabaseDesigner } from "jassijs/ui/DatabaseDesigner";
import { DBObject } from "jassijs/remote/DBObject";
import { DatabaseTools } from "jassijs/remote/DatabaseTools";
import { Test } from "jassijs/remote/Test";

export async function test(teste: Test) {
    try {
        await new Server().createModule("testrmodul");
        await new Server().createFolder("testrmodul/remote");
        await new Server().saveFile("testrmodul/remote/TestRModul.ts", `import { $Class } from "jassijs/remote/Jassi";
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
        var ret = new DatabaseDesigner(false);
        await ret.readSchema();
        await ret.addClass("testrmodul.TestRCustomer");
        await ret.addField("string","name");
        var sr=await ret.saveAll(false);
        teste.expectEqual(sr==="");
        ret.destroy();
        await registry.reload();
        var ro = await new (await classes.loadClass("testrmodul.remote.TestRModul"))().sayHello("you");
        teste.expectEqual(ro === "Hello you");

        var TestRCustomer:any= await classes.loadClass("testrmodul.TestRCustomer");
        DBObject.clearCache("testrmodul.TestRCustomer");
        var cust:any=new TestRCustomer();
        cust.id=50;
        cust.name="Hallo";
        await cust.save();
        var tcust=await TestRCustomer.findOne();
        teste.expectEqual(tcust?.name==="Hallo");

    } catch (err) {
        throw err;
    } finally {
        var root = new FileNode("");
        root.files = [];
        new Server().delete("testrmodul");
        new Server().removeServerModul("testrmodul");
        DatabaseTools.dropTables(["testrmodul_testrcustomer"])
    }
}