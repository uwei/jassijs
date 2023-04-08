import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { serverservices } from "jassijs/remote/Serverservice";

@$Class("de.remote.MyRemoteObject")
export class MyRemoteObject extends RemoteObject{
    //this is a sample remote function
    public async sayHello(name: string,context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call(this, this.sayHello, name,context);
        } else {
            await (await serverservices.db).renewConnection();
await (await serverservices.db).renewConnection();
            return "Hello "+name;  //this would be execute on server  
        }
    }
}
export async function test(){
    console.log(await new MyRemoteObject().sayHello("Kurt"));
}
