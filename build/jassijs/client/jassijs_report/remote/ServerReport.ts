import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { ValidateFunctionParameter, ValidateIsString } from "jassijs/remote/Validator";

@$Class("jassijs_report.remote.ServerReport")
export class ServerReport extends RemoteObject{
    static cacheLastParameter={};
    @ValidateFunctionParameter()
    public static async getDesign(@ValidateIsString() path:string,parameter: any,context: Context = undefined) {
        if (!context?.isServer) {
            return await ServerReport.call(this.getDesign, path,parameter,context);
        } else {
            //@ts-ignore
            var DoServerreport=(await import("jassijs_report/DoServerreport")).DoServerreport;
            ServerReport.cacheLastParameter[path]=parameter;
            return await new DoServerreport().getDesign(path,parameter);
        }
    }
    @ValidateFunctionParameter()
    public static async getBase64(@ValidateIsString() path:string,parameter: any,context: Context = undefined) {
        if (!context?.isServer) {
            return await ServerReport.call(this.getBase64, path,parameter,context);
        } else {
            //@ts-ignore
            var DoServerreport=(await import("jassijs_report/DoServerreport")).DoServerreport;
            if(parameter=="useLastCachedParameter")
                parameter=ServerReport.cacheLastParameter[path];
            return await new DoServerreport().getBase64(path,parameter);
        }
    }
     public static async getBase64LastTestResult(context: Context = undefined) {
        if (!context?.isServer) {
            return await ServerReport.call(this.getBase64LastTestResult,context);
        } else {
            //@ts-ignore
            var DoServerreport=(await import("jassijs_report/DoServerreport")).DoServerreport;
            return await new DoServerreport().getBase64LastTestResult();
        }
    }
}
export async function test(){
  
    var ret=await ServerReport.getBase64("jassijs_report/TestServerreport",{sort:"name"});
   
   return ret;
//    console.log(await new ServerReport().sayHello("Kurt"));
}
