import { $ActionProvider, $Action } from "jassijs/base/Actions";
import { $Class } from "jassijs/remote/Registry";
import { FileNode } from "jassijs/remote/FileNode";
import { OptionDialog } from "jassijs/ui/OptionDialog";
import {  FileActions } from "jassijs_editor/FileExplorer";

const code=`import { $Class } from "jassijs/remote/Registry";
import { Context, DefaultParameterValue, UseServer } from "jassijs/remote/RemoteObject";
import { ValidateFunctionParameter, ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";

@$Class("{{fullclassname}}")
export class {{name}}{

    @UseServer()
    @ValidateFunctionParameter() 
    // name must be a string - validated on client and server
    // if age is missing set 9 as default value
    public async sayHello( @ValidateIsString() name: string, @DefaultParameterValue(9) age:number=9,context?:Context) {
            //this runs serverside
            return "Hello3 "+name+"("+age+")";  //this would be execute on server  
    }

    @UseServer()
    public static async info() {
            //this runs serverside
            try{
                return "static server runs on "+(\`Node.js version: \${process.version}\`);  //this would be execute on server  
            }catch{
                return "static server runs on browser";
            }
    }
}
export async function test(){
    console.log(await new {{name}}().sayHello("Kurtt"));
    console.log(await new {{name}}().sayHello("Kurtt",10));
    console.log(await {{name}}.info());

}
`;

@$ActionProvider("jassijs.remote.FileNode")
@$Class("jassijs_editor.template.TemplateRemoteObject")
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
	    	scode=scode.replaceAll("{{fullclassname}}",(all[0].fullpath+"/"+res.text).replaceAll("/","."));
	    	FileActions.newFile(all,res.text+".ts",scode,true);
        }
    }
}



