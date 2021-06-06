import { $ActionProvider, $Action } from "jassijs/base/Actions";
import { $Class } from "jassijs/remote/Jassi";
import { FileNode } from "jassijs/remote/FileNode";
import { OptionDialog } from "jassijs/ui/OptionDialog";
import { FileExplorer, FileActions } from "jassijs/ui/FileExplorer";
import { Server } from "jassijs/remote/Server";
import { router } from "jassijs/base/Router";
const code=`import { $Class } from "jassijs/remote/Jassi";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";

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

@$ActionProvider("jassijs.remote.FileNode")
@$Class("jassijs.template.TemplateRemoteObject")
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



