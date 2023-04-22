import { Context } from "jassijs/remote/RemoteObject";
import { TransactionItem } from "jassijs/remote/Transaction";
export declare class ObjectTransaction {
    statements: TransactionItem[];
    saveresolve: any[];
    private functionsFinally;
    transactionResolved(context: Context): void;
    addFunctionFinally(functionToAdd: () => any): void;
    checkFinally(): void;
    finally(): Promise<void>;
}
