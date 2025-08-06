import { $Class } from "jassijs/remote/Registry";
import { Context, DefaultParameterValue, UseServer } from "jassijs/remote/RemoteObject";
import { ValidateFunctionParameter, ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";

@$Class("de.remote.ll")
export class ll{

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
                return "static  from "+(`Node.js version: ${process.version}`);  //this would be execute on server  
            }catch{
                return "static server runs on browser";
            }
    }
}
export async function test(){
    console.log(await new ll().sayHello("Kurtt"));
    console.log(await new ll().sayHello("Kurtt",10));
    console.log(await ll.info());

}
