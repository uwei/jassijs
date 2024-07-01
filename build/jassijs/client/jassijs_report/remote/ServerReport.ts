import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { Server } from "jassijs/remote/Server";
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
            var DoServerreport=(await import("jassijs_report/server/DoServerreport")).DoServerreport;
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
            var DoServerreport=(await import("jassijs_report/server/DoServerreport")).DoServerreport;
            if(parameter=="useLastCachedParameter")
                parameter=ServerReport.cacheLastParameter[path];
            return await new DoServerreport().getBase64(path,parameter); 
        }
    }
    public static async getBase64FromFile(file:string,context: Context = undefined) {
        if (!context?.isServer) {
            return await ServerReport.call(this.getBase64FromFile,file,context);
        } else {
            var res = await new Server().testServersideFile(file.substring(0, file.length - 3),context);
        
            //@ts-ignore 
            var DoServerreport=(await import("jassijs_report/server/DoServerreport")).DoServerreport;
            return await new DoServerreport().getBase64FromData(res);
        }
    }
  
}
export async function test(){
  
    var ret=await ServerReport.getBase64("jassijs_report/server/TestServerreport",{sort:"name"});
   
   return ret;
//    console.log(await new ServerReport().sayHello("Kurt"));
}
