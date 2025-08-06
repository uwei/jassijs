import { $Class } from "jassijs/remote/Registry";
import { UseServer } from "jassijs/remote/RemoteObject";

@$Class("de.remote.MyRemoteObject2")
export class MyRemoteObject2{
    //this is a sample remote function
    public async sayHello(name: string) {
            return "Hello "+name;  //this would be execute on server  
    }
}
export async function test(){
    console.log(await new MyRemoteObject2().sayHello("Kurt"));
}


import { $Class } from "jassijs/remote/Registry";
import { Context, DefaultParameterValue, UseServer } from "jassijs/remote/RemoteObject";
import { ValidateFunctionParameter, ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";

@$Class("de.remote.MyRemoteObject")
export class MyRemoteObject{
    //this is a sample remote function
    async tt(@ValidateIsString() name){
        return "oo";
    }
    @UseServer()
    @ValidateFunctionParameter()
    public async sayHello( @ValidateIsString() name: string, @DefaultParameterValue(9) age:number=9,context?:Context) {
            console.log(await this.tt("hallo"));
            console.log(context.isServer)
            return "Hello3 "+name+"("+age+")";  //this would be execute on server  
    }
    @UseServer()
    @ValidateFunctionParameter()
    public static async sayHello2(@ValidateIsString() name: string) {
            try{
                return "Hello static "+name+" from "+(`Node.js version: ${process.version}`);  //this would be execute on server  
            }catch{
                return "Hello static "+name+" from Browser";
            }
    }
}
export async function test(){
    console.log(await new MyRemoteObject().sayHello("Kurtt"));
    console.log(await new MyRemoteObject().sayHello("Kurtt",10));
    console.log(await MyRemoteObject.sayHello2("5"));

}
