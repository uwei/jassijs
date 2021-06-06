import { $Class } from "jassi/remote/Jassi";
import { Context, RemoteObject } from "jassi/remote/RemoteObject";

@$Class("tg/remote/MyRemoteObject")
export class MyRemoteObject extends RemoteObject{
    //this is a sample remote function
    public async sayHello(name: string,context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call(this, this.sayHello, name,context);
        } else {
            return "Heillo "+name;  //this would be execute on server  
        }
    }
}
export async function test(){
    console.log(await new MyRemoteObject().sayHello("Kurt"));
}
