import { Context } from "jassijs/remote/RemoteObject";
import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";
export declare function messageReceived(param: any): Promise<void>;
export declare function test(): Promise<void>;
export declare function localExec(prot: RemoteProtocol, context?: Context): Promise<any>;
