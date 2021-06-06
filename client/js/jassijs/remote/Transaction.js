var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/RemoteObject"], function (require, exports, Jassi_1, RemoteObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transaction = exports.TransactionItem = void 0;
    //var serversession;
    class TransactionItem {
        constructor() {
            this.result = "**unresolved**";
        }
    }
    exports.TransactionItem = TransactionItem;
    let Transaction = class Transaction extends RemoteObject_1.RemoteObject {
        constructor() {
            super(...arguments);
            this.statements = [];
            this.context = new RemoteObject_1.Context();
        }
        async execute() {
            //  return this.context.register("transaction", this, async () => {
            for (var x = 0; x < this.statements.length; x++) {
                var it = this.statements[x];
                var context = {
                    isServer: false,
                    transaction: this,
                    transactionitem: it
                };
                it.promise = it.obj[it.method.name](...it.params, context);
                it.promise.then((val) => {
                    it.result = val; //promise returned or resolved out of Transaction
                });
            }
            let _this = this;
            await new Promise((res) => {
                _this.ready = res;
            });
            var ret = [];
            for (let x = 0; x < this.statements.length; x++) {
                var res = await this.statements[x].promise;
                ret.push(res);
            }
            return ret;
            //  });
        }
        async wait(transactionItem, prot) {
            transactionItem.remoteProtocol = prot;
            //if all transactions are placed then do the request
            var foundUnplaced = false;
            for (let x = 0; x < this.statements.length; x++) {
                let it = this.statements[x];
                if (it.result === "**unresolved**" && it.remoteProtocol === undefined)
                    foundUnplaced = true;
            }
            if (foundUnplaced === false) {
                this.sendRequest();
            }
            let _this = this;
            return new Promise((res) => {
                transactionItem.resolve = res;
            }); //await this.statements[id].result;//wait for result - comes with Request
        }
        async sendRequest(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var prots = [];
                for (let x = 0; x < this.statements.length; x++) {
                    let st = this.statements[x];
                    if (st.result !== "**unresolved**")
                        prots.push(undefined);
                    else
                        prots.push(st.remoteProtocol.stringify(st.remoteProtocol));
                }
                var sic = this.statements;
                this.statements = prots;
                var ret = await this.call(this, this.sendRequest, context);
                this.statements = sic;
                for (let x = 0; x < this.statements.length; x++) {
                    this.statements[x].resolve(ret[x]);
                }
                this.ready();
                //ret is not what we want - perhaps there is a modification
                /* let ret2=[];
                 for(let x=0;x<this.statements.length;x++){
                     ret2.push(await this.statements[x].promise);
                 }
                 this.resolve(ret);*/
                return true;
            }
            else {
                //@ts-ignore
                //@ts-ignore
                var ObjectTransaction = (await new Promise((resolve_1, reject_1) => { require(["jassijs/remote/ObjectTransaction"], resolve_1, reject_1); })).ObjectTransaction;
                var ot = new ObjectTransaction();
                ot.statements = [];
                let ret = [];
                for (let x = 0; x < this.statements.length; x++) {
                    var stat = {
                        result: "**unresolved**"
                    };
                    ot.statements.push(stat);
                }
                for (let x = 0; x < this.statements.length; x++) {
                    ret.push(this.doServerStatement(this.statements, ot, x, context));
                }
                for (let x = 0; x < ret.length; x++) {
                    ret[x] = await ret[x];
                }
                return ret;
            }
        }
        async doServerStatement(statements, ot /*:ObjectTransaction*/, num, context) {
            //@ts-ignore
            var _execute = (await new Promise((resolve_2, reject_2) => { require(["jassijs/server/DoRemoteProtocol"], resolve_2, reject_2); }))._execute;
            var _this = this;
            var newcontext = {};
            Object.assign(newcontext, context);
            newcontext.objecttransaction = ot;
            newcontext.objecttransactionitem = ot.statements[num];
            //@ts-ignore
            ot.statements[num].result = _execute(_this.statements[num], context.request, newcontext);
            return ot.statements[num].result;
        }
        add(obj, method, ...params) {
            var ti = new TransactionItem();
            ti.method = method;
            ti.obj = obj;
            ti.params = params;
            ti.transaction = this;
            this.statements.push(ti);
        }
    };
    Transaction = __decorate([
        Jassi_1.$Class("jassijs.remote.Transaction")
    ], Transaction);
    exports.Transaction = Transaction;
});
//# sourceMappingURL=Transaction.js.map