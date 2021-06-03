import { $ActionProvider, $Action } from "jassi/base/Actions";
import { $Class } from "jassi/remote/Jassi";
import { FileNode } from "jassi/remote/FileNode";
import { OptionDialog } from "jassi/ui/OptionDialog";
import { FileExplorer, FileActions } from "jassi/ui/FileExplorer";
import { Server } from "jassi/remote/Server";
import { router } from "jassi/base/Router";
const code=`import { $Class } from "jassi/remote/Jassi";
import { Context, RemoteObject } from "jassi/remote/RemoteObject";

@$Class("{{fullclassname}}")
export class {{name}} extends RemoteObject{
    //this is a sample remote function
    public async sayHello(name: string,context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call(this, this.sayHello, name,context);
        } else {
            return "Hello "+name;  //this would be execute on server  
        }
    }
}
export async function test(){
    console.log(await new {{name}}().sayHello("Kurt"));
}
`;

@$ActionProvider("jassi.remote.FileNode")
@$Class("jassi.template.TemplateRemoteObject")
export class TemplateRemoteObject {
	static code:string=code;
    @$Action({
        name: "New/RemoteObject",
        isEnabled: function(all: FileNode[]): boolean {
            return all[0].isDirectory()&&all[0].fullpath.split("/").length>1&&all[0].fullpath.split("/")[1]==="remote";
        }
    })
    static async newFile(all: FileNode[]) {

        var res = await OptionDialog.show("Enter RemoteObject name:", ["ok", "cancel"], undefined, true, "MyRemoteObject");
        if (res.button === "ok" && res.text !== all[0].name) {
	    	var scode=code.replaceAll("{{name}}",res.text);
	    	scode=scode.replaceAll("{{fullclassname}}",all[0].fullpath+"/"+res.text);
	    	FileActions.newFile(all,res.text+".ts",scode,true);
        }
    }
}



