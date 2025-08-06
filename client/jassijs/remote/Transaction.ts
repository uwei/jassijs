import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject, UseServer, _fillDefaultParameter, getContext, useContext } from "jassijs/remote/RemoteObject";
import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";
import { Test } from "jassijs/remote/Test";
//var serversession;


export class GenericTransactionItem {
    transaction: GenericTransaction;
    userData;
    promise: Promise<any>;
    resolve;
    reject;
}
export class TransactionItem extends GenericTransactionItem {
    obj: any;
    method: (...args) => any;
    params: any[];
    remoteProtocol: RemoteProtocol;
}

export class TransactionContext extends Context {
    transaction?: GenericTransaction;
    transactionItem?: GenericTransactionItem;
}
class GenericTransaction {
    protected finalizer: { [key: string]: (any) => any } = {}
    protected allPromises: Promise<any>[] = [];
    protected filledTransactions: GenericTransactionItem[] = [];
    protected finalized: number = 0;
    public transactions: GenericTransactionItem[] = [];
    protected registerdTransactions: { [name: string]: GenericTransactionItem[] } = {};
    private resolveFinalizer;
    public registerAction<T>(name: string, userdata: T, finalize: (alluserdata: T[]) => Promise<any[]>, config: TransactionContext): Promise<any> {
        this.finalizer[name] = finalize;
        if (this.registerdTransactions[name] === undefined)
            this.registerdTransactions[name] = [];
        var it = config.transactionItem;
        if (this.registerdTransactions[name].indexOf(it) < 0)
            this.registerdTransactions[name].push(it);
        var pr = new Promise((res) => { it.resolve = res });
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
    protected async finalize() {
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
    protected async wait() {
        var _this = this;
        var pp = new Promise((res) => { _this.resolveFinalizer = res });
        //  this.tryFinalize();
        await pp;
        await this.finalize();
        return await Promise.all(this.allPromises);
    }
}
@$Class("jassijs.remote.Transaction")
export class Transaction extends GenericTransaction {

    addProtocol(prot: RemoteProtocol, config: TransactionContext) {
        return super.registerAction("transaction", prot, this.sendRequest.bind(this), config);
    }

    private async sendRequest(userData: RemoteProtocol[], context: Context = undefined) {

        if (!context?.isServer) {
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
            var ret = await RemoteObject.docallWithReplaceThis({}, this, this.sendRequest, prots, context);//WithReplaceThis({userData:prots}, this, this.sendRequest);

            return ret;
        } else {
            var servertransaction = new GenericTransaction();
            var all = [];
            var _execute = (await import("jassijs/server/DoRemoteProtocol"))._execute;
            //try {
            for (let x = 0; x < userData.length; x++) {
                var item = new TransactionItem();
                var st = userData[x];
                item.transaction = servertransaction;
                var contextneu: TransactionContext = { isServer: true };
                Object.assign(contextneu, context);
                contextneu.transactionItem = item;
                servertransaction.transactions.push(item);
                contextneu.transaction = servertransaction;
                var res = _execute(<any>st, context.request, contextneu);
                all.push(res);
            }
            await servertransaction.wait(); //await Promise.all(all)
            ret = await Promise.all(all);
            // } catch (err) {
            //    throw err;
            //} 
            return ret;
        }
    }
    //runs the transaction
    async execute(context: TransactionContext = undefined): Promise<any[]> {
        //  return this.context.register("transaction", this, async () => {
        var allPromises = [];
        for (var x = 0; x < this.transactions.length; x++) {
            var it: TransactionItem = <any>this.transactions[x];
            var newcontext = context ? context : <TransactionContext>{ isServer: false };
            newcontext.transaction = this;
            newcontext.transactionItem = it;
            _fillDefaultParameter(it.obj, it.method, it.params, newcontext);
            var pr = it.obj[it.method.name](...it.params, newcontext);
            // RemoteObject.docall(it.obj,it.method,...it.params,newcontext);
            allPromises.push(pr);
        }
        var ret = await this.wait();//Promise.all(allPromises);
        return ret;
    }
    //add a transaction
    public add(obj: any, method: (...args) => any, ...params) {

        var ti = new TransactionItem();
        ti.method = method;
        ti.obj = obj;
        ti.params = params;
        ti.transaction = this;
        this.transactions.push(ti);
    }

}



@$Class("jassijs.remote.TransactionTest")
export class TransactionTest {
    @UseServer()
    hi(num: number) {
        return num + 10000;
    }
}
export async function test(t: Test) {
    var trans = new Transaction();
    for (var x = 0; x < 3; x++) {
        var tr = new TransactionTest();
        trans.add(tr, tr.hi, x);
    }
    var all = await trans.execute();
    t.expectEqual(all.join() === "10000,10001,10002")
} 