import { $Class } from "jassijs/remote/Registry";

@$Class("jassijs.remote.ClientError")
export class ClientError extends Error{
    constructor(msg:string){
        super(msg);
    }
}