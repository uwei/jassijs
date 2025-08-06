var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
<<<<<<< HEAD
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject"], function (require, exports, Registry_1, RemoteObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TransactionTest = exports.Transaction = exports.TransactionContext = exports.TransactionItem = exports.GenericTransactionItem = void 0;
    //var serversession;
    class GenericTransactionItem {
    }
    exports.GenericTransactionItem = GenericTransactionItem;
    class TransactionItem extends GenericTransactionItem {
    }
    exports.TransactionItem = TransactionItem;
    class TransactionContext extends RemoteObject_1.Context {
    }
    exports.TransactionContext = TransactionContext;
    class GenericTransaction {
        constructor() {
            this.finalizer = {};
            this.allPromises = [];
            this.filledTransactions = [];
            this.finalized = 0;
            this.transactions = [];
            this.registerdTransactions = {};
        }
        registerAction(name, userdata, finalize, config) {
            this.finalizer[name] = finalize;
            if (this.registerdTransactions[name] === undefined)
                this.registerdTransactions[name] = [];
            var it = config.transactionItem;
            if (this.registerdTransactions[name].indexOf(it) < 0)
                this.registerdTransactions[name].push(it);
            var pr = new Promise((res) => { it.resolve = res; });
            it.promise = pr;
            it.userData = userdata;
            if (this.finalized < 1 && this.filledTransactions.indexOf(it) === -1)
                this.filledTransactions.push(it);
            this.tryFinalize();
            return it.promise;
        }
        tryFinalize() {
            if (this.finalized === 0 && this.filledTransactions.length === this.transactions.length) {
                if (this.resolveFinalizer)
                    this.resolveFinalizer();
            }
        }
        async finalize() {
            if (this.finalized)
                return;
            this.finalized = 1;
            for (var key in this.finalizer) {
                if (this.registerdTransactions[key] === undefined) {
                    continue;
                }
                var trans = this.registerdTransactions[key];
                var alluserdata = [];
                await trans.forEach((o) => alluserdata.push(o.userData));
                var results = await this.finalizer[key](alluserdata);
                for (var x = 0; x < trans.length; x++) {
                    var tran = trans[x];
                    tran.resolve(await results[x]);
                }
            }
        }
        async wait() {
            var _this = this;
            var pp = new Promise((res) => { _this.resolveFinalizer = res; });
            //  this.tryFinalize();
            await pp;
            await this.finalize();
            return await Promise.all(this.allPromises);
        }
    }
    let Transaction = class Transaction extends GenericTransaction {
        addProtocol(prot, config) {
            return super.registerAction("transaction", prot, this.sendRequest.bind(this), config);
        }
        async sendRequest(userData, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var prots = [];
                for (let x = 0; x < userData.length; x++) {
                    let st = userData[x];
                    // if (st.result !== "**unresolved**")
                    //     prots.push(undefined);
                    // else
                    prots.push(st.stringify(st));
                }
                if (context)
                    delete context.transaction;
                var ret = await RemoteObject_1.RemoteObject.docallWithReplaceThis({}, this, this.sendRequest, prots, context); //WithReplaceThis({userData:prots}, this, this.sendRequest);
                return ret;
            }
            else {
<<<<<<< HEAD
                var servertransaction = new GenericTransaction();
                var all = [];
                var _execute = (await new Promise((resolve_1, reject_1) => { require(["jassijs/server/DoRemoteProtocol"], resolve_1, reject_1); }).then(__importStar))._execute;
                //try {
                for (let x = 0; x < userData.length; x++) {
                    var item = new TransactionItem();
                    var st = userData[x];
                    item.transaction = servertransaction;
                    var contextneu = { isServer: true };
                    Object.assign(contextneu, context);
                    contextneu.transactionItem = item;
                    servertransaction.transactions.push(item);
                    contextneu.transaction = servertransaction;
                    var res = _execute(st, context.request, contextneu);
                    all.push(res);
=======
                //@ts-ignore
                //@ts-ignore
                var ObjectTransaction = (await new Promise((resolve_1, reject_1) => { require(["jassijs/remote/ObjectTransaction"], resolve_1, reject_1); }).then(__importStar)).ObjectTransaction;
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
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
                }
                await servertransaction.wait(); //await Promise.all(all)
                ret = await Promise.all(all);
                // } catch (err) {
                //    throw err;
                //} 
                return ret;
            }
        }
<<<<<<< HEAD
        //runs the transaction
        async execute(context = undefined) {
            //  return this.context.register("transaction", this, async () => {
            var allPromises = [];
            for (var x = 0; x < this.transactions.length; x++) {
                var it = this.transactions[x];
                var newcontext = context ? context : { isServer: false };
                newcontext.transaction = this;
                newcontext.transactionItem = it;
                (0, RemoteObject_1._fillDefaultParameter)(it.obj, it.method, it.params, newcontext);
                var pr = it.obj[it.method.name](...it.params, newcontext);
                // RemoteObject.docall(it.obj,it.method,...it.params,newcontext);
                allPromises.push(pr);
            }
            var ret = await this.wait(); //Promise.all(allPromises);
            return ret;
=======
        async doServerStatement(statements, ot /*:ObjectTransaction*/, num, context) {
            //@ts-ignore
            var _execute = (await new Promise((resolve_2, reject_2) => { require(["jassijs/server/DoRemoteProtocol"], resolve_2, reject_2); }).then(__importStar))._execute;
            var _this = this;
            var newcontext = {};
            Object.assign(newcontext, context);
            newcontext.objecttransaction = ot;
            newcontext.objecttransactionitem = ot.statements[num];
            //@ts-ignore
            ot.statements[num].result = _execute(_this.statements[num], context.request, newcontext);
            return ot.statements[num].result;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        }
        //add a transaction
        add(obj, method, ...params) {
            var ti = new TransactionItem();
            ti.method = method;
            ti.obj = obj;
            ti.params = params;
            ti.transaction = this;
            this.transactions.push(ti);
        }
    };
    Transaction = __decorate([
        (0, Registry_1.$Class)("jassijs.remote.Transaction")
    ], Transaction);
    exports.Transaction = Transaction;
    let TransactionTest = class TransactionTest {
        hi(num) {
            return num + 10000;
        }
    };
    __decorate([
        (0, RemoteObject_1.UseServer)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], TransactionTest.prototype, "hi", null);
    TransactionTest = __decorate([
        (0, Registry_1.$Class)("jassijs.remote.TransactionTest")
    ], TransactionTest);
    exports.TransactionTest = TransactionTest;
    async function test(t) {
        var trans = new Transaction();
        for (var x = 0; x < 3; x++) {
            var tr = new TransactionTest();
            trans.add(tr, tr.hi, x);
        }
        var all = await trans.execute();
        t.expectEqual(all.join() === "10000,10001,10002");
    }
    exports.test = test;
});
//# sourceMappingURL=Transaction.js.map