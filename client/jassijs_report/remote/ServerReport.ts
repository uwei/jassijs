import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";

@$Class("jassijs_report.remote.ServerReport")
export class ServerReport extends RemoteObject{
    //this is a sample remote function
    public static async fillReport(path:string,parameter: any,context: Context = undefined) {
        if (!context?.isServer) {
            return await ServerReport.call(this.fillReport, path,parameter,context);
        } else {
            var fill=(await import(path)).fill;
            return await fill(parameter);
            //return "Hello "+name;  //this would be execute on server  
        }
    }
}
export async function test(){
  
    var ret=await ServerReport.fillReport("jassijs_report/TestServerreport",{sort:"name"});
    return ret;
//    console.log(await new ServerReport().sayHello("Kurt"));
}
