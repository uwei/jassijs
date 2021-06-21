import { $Class } from "./Jassi";

@$Class("jassijs.remote.ClientError")
export class ClientError extends Error{
    constructor(msg:string){
        super(msg);
    }
}