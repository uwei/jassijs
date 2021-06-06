"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTransaction = void 0;
class ObjectTransaction {
    constructor() {
        this.statements = [];
        this.functionsFinally = [];
    }
    transactionResolved(context) {
        //var session = getNamespace('objecttransaction');
        var test = context.objecttransactionitem; // session.get("objecttransaction");
        if (test)
            test.resolve = true;
    }
    addFunctionFinally(functionToAdd) {
        this.functionsFinally.push(functionToAdd);
    }
    checkFinally() {
        let canFinally = true;
        this.statements.forEach((ent) => {
            if (ent.result === "**unresolved**")
                canFinally = false;
            if (ent.result["then"] && !ent["resolve"]) { //Promise, which is not resolved by addFunctionFinally
                canFinally = false;
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
exports.ObjectTransaction = ObjectTransaction;
//# sourceMappingURL=ObjectTransaction.js.map