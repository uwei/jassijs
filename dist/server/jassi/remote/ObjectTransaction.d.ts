import { Context } from "jassi/remote/RemoteObject";
import { TransactionItem } from "jassi/remote/Transaction";
export declare class ObjectTransaction {
    statements: TransactionItem[];
    saveresolve: any[];
    private functionsFinally;
    transactionResolved(context: Context): void;
    addFunctionFinally(functionToAdd: () => any): void;
    checkFinally(): void;
    finally(): Promise<void>;
}
