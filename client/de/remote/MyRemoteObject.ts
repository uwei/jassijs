import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { serverservices } from "jassijs/remote/Serverservice";
import { ValidateFunctionParameter, ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";

@$Class("de.remote.MyRemoteObject")
export class MyRemoteObject extends RemoteObject{
    //this is a sample remote function
    async tt(@ValidateIsString() name){
        return "oo";
    }
    @ValidateFunctionParameter()
    public async sayHello(@ValidateIsString() name: string,context: Context = undefined) {

        console.log(this.sayHello.name);
        
        if (!context?.isServer) {
            return await this.call(this, this.sayHello, name,context);
        } else {
            console.log(await this.tt("hallo"));
            return "Hello "+name;  //this would be execute on server  
        }
    }
    @ValidateFunctionParameter()
    public static async sayHello2(@ValidateIsString() name: string,context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call( this.sayHello2, name,context);
        } else {
            return "Hello static "+name;  //this would be execute on server  
        }
    }
}
export async function test(){
    console.log(await new MyRemoteObject().sayHello("Kurt"));
   // console.log(await MyRemoteObject.sayHello2("5"));
}
