import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";



//var serversession;



export class TransactionItem {
    transaction:Transaction;
    obj: any;
    method: (...args) => any;
    params: any[];
    promise: Promise<any>;
    result: any = "**unresolved**";
    remoteProtocol: RemoteProtocol;
    resolve;
}
@$Class("jassijs.remote.Transaction")
export class Transaction extends RemoteObject {
    private statements: TransactionItem[] = [];
    private ready;
    private context = new Context();
  
    async execute(): Promise<any[]> {
        //  return this.context.register("transaction", this, async () => {
        for (var x = 0; x < this.statements.length; x++) {
            var it = this.statements[x];
            var context:Context={
                isServer:false,
                transaction:this,
                transactionitem:it
            }
            it.promise = it.obj[it.method.name](...it.params,context);
            it.promise.then((val) => {
                it.result = val;//promise returned or resolved out of Transaction
            })
        }
        let _this = this;
        await new Promise((res) => {
            _this.ready = res;
        })
        var ret = [];
        for (let x = 0; x < this.statements.length; x++) {
            var res = await this.statements[x].promise;
            ret.push(res);
        }
        return ret;
        //  });

    }
    async wait(transactionItem:TransactionItem,prot: RemoteProtocol): Promise<any> {
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
        });//await this.statements[id].result;//wait for result - comes with Request
    }
  
    private async sendRequest(context: Context = undefined) {
        if (!context?.isServer) {
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
        } else {
            //@ts-ignore


            //@ts-ignore
            var ObjectTransaction = (await import("jassijs/remote/ObjectTransaction")).ObjectTransaction;
            var ot = new ObjectTransaction();
            ot.statements = [];
            let ret = [];
            for (let x = 0; x < this.statements.length; x++) {
                var stat: any = {
                    result: "**unresolved**"

                }
                ot.statements.push(stat);
            }
            for (let x = 0; x < this.statements.length; x++) {
                ret.push( this.doServerStatement(this.statements, ot, x, context));
            }
            for(let x=0;x<ret.length;x++){
                ret[x]=await ret[x];
            }

            return ret;
        }


    }
    private async doServerStatement(statements, ot/*:ObjectTransaction*/, num: number, context) {
        //@ts-ignore
        var _execute = (await import("jassijs/server/DoRemoteProtocol"))._execute;
        var _this = this;
        var newcontext: any = {};
        Object.assign(newcontext, context);
        newcontext.objecttransaction = ot;
        newcontext.objecttransactionitem = ot.statements[num];
        //@ts-ignore
        ot.statements[num].result = _execute(<string>_this.statements[num], context.request, newcontext);

        return ot.statements[num].result;

    }
    public add(obj: any, method: (...args) => any, ...params) {

        var ti = new TransactionItem();
        ti.method = method;
        ti.obj = obj;
        ti.params = params;
        ti.transaction=this;
        
        this.statements.push(ti);
    }

}