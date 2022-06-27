import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";

@$Class("jassijs_report.remote.ServerReport")
export class ServerReport extends RemoteObject{
    public static async getDesign(path:string,parameter: any,context: Context = undefined) {
        if (!context?.isServer) {
            return await ServerReport.call(this.getDesign, path,parameter,context);
        } else {
            var DoServerreport=(await import("jassijs_report/DoServerreport")).DoServerreport;
            return await new DoServerreport().getDesign(path,parameter);
        }
    }
    public static async getBase64(path:string,parameter: any,context: Context = undefined) {
        if (!context?.isServer) {
            return await ServerReport.call(this.getBase64, path,parameter,context);
        } else {
            var DoServerreport=(await import("jassijs_report/DoServerreport")).DoServerreport;
            return await new DoServerreport().getBase64(path,parameter);
        }
    }
}
export async function test(){
  
    var ret=await ServerReport.getBase64("jassijs_report/TestServerreport",{sort:"name"});
   debugger;
   return ret;
//    console.log(await new ServerReport().sayHello("Kurt"));
}
