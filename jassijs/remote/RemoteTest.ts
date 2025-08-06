import { Context, RemoteObject, UseServer } from "jassijs/remote/RemoteObject";
import { $Class } from "jassijs/remote/Registry";
import { Server } from "jassijs/remote/Server";




@$Class("jassijs.remote.RemoteTest")
export class RemoteTest {

    async createFolder(foldername: string,context:Context=undefined): Promise<string> {
        if (!context?.isServer) {
            //var ret = await this.call(this, this.createFolder, foldername, context);
            var ret = await RemoteObject.docall(this, this.createFolder,...arguments);
            //@ts-ignore
            //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            return ret;
        } else {
            console.log("Hallo");
            return "created " + foldername;
        }
    }
    @UseServer()
    async createFolder2(foldername: string): Promise<string> {
        console.log("Hallo2");
        return "created2 " + foldername;
    }
    static async mytest(context:Context=undefined) {
        if (!context?.isServer) {
            return await RemoteObject.docall(this, this.mytest,...arguments);
            // return await this.call(this.mytest, context);
        } else {
            console.log(14);
            return 14 + 1;//this is called on server
        }
    }
    @UseServer()
    static async mytest2() {
        console.log(14);
        return 14 + 1;//this is called on server
    }
}

export async function test() {
 
  
    console.log(await new RemoteTest().createFolder2("Hi"));
    console.log(await RemoteTest.mytest2());
}