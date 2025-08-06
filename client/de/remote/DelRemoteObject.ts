import { $Class } from "jassijs/remote/Registry";
import { UseServer } from "jassijs/remote/RemoteObject";

@$Class("de.remote.DelRemoteObject")
export class DelRemoteObject{
    //this is a sample remote function
    public async sayHello(name: string) {
            return "Hello "+name;  //this would be execute on server  
    }
}
export async function test(){
    console.log(await new DelRemoteObject().sayHello("Kurt"));
}
