import { $Class } from "jassijs/remote/Jassi";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { Server } from "jassijs/remote/Server";

@$Class("tests.remote.T")
export class T extends RemoteObject{
    //this is a sample remote function
    public async sayHello(name: string,context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call(this, this.sayHello, name,context);
        } else {
            var H=await import("Hallo");
            return "Hello "+name+H.test();  //this would be execute on server  
        }
    }
}
export async function test(){
     await new Server().saveFile("Hallo.ts","export class Hallo{};export function test(){return 2 };",true);
    console.log(await new T().sayHello("Kurt"));
}

export async function test2(){
   
       
    
}