import { RemoteObject } from "jassijs/remote/RemoteObject";
import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";
export declare class TransactionItem {
    transaction: Transaction;
    obj: any;
    method: (...args: any[]) => any;
    params: any[];
    promise: Promise<any>;
    result: any;
    remoteProtocol: RemoteProtocol;
    resolve: any;
}
export declare class Transaction extends RemoteObject {
    private statements;
    private ready;
    private context;
    execute(): Promise<any[]>;
    wait(transactionItem: TransactionItem, prot: RemoteProtocol): Promise<any>;
    private sendRequest;
    private doServerStatement;
    add(obj: any, method: (...args: any[]) => any, ...params: any[]): void;
}
