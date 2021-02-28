import { Context } from "jassi/remote/RemoteObject";
import { TransactionItem } from "jassi/remote/Transaction";



export class ObjectTransaction {
    public statements: TransactionItem[] = [];
    saveresolve:any[];
    private functionsFinally: (() => any)[] = [];
    transactionResolved(context:Context){
        //var session = getNamespace('objecttransaction');
        var test: TransactionItem =context.objecttransactionitem; // session.get("objecttransaction");
        if (test)
            test.resolve = true;
    }
    addFunctionFinally(functionToAdd: () => any) {
        this.functionsFinally.push(functionToAdd);
        
       
        
    }
    checkFinally(){
        let canFinally = true;
        this.statements.forEach((ent) => {
            if (ent.result === "**unresolved**")
                canFinally = false;
            if (ent.result["then"]&&!ent["resolve"]) {//Promise, which is not resolved by addFunctionFinally
                canFinally=false;
            }
        });
        if (canFinally) {
            this.finally();
        }
    }
    async finally() {
        for (let x = 0; x < this.functionsFinally.length; x++) {
            await this.functionsFinally[x]();
        }
    }
}