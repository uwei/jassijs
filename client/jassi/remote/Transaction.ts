import jassi, { $Class } from "jassi/remote/Jassi";
import { RemoteObject } from "jassi/remote/RemoteObject";
import { RemoteProtocol } from "jassi/remote/RemoteProtocol";
import { ObjectTransaction } from "jassi/server/ObjectTransaction";
import { openStdin } from "process";
var serversession;



export class TransactionItem {
    obj: any;
    method: (...args) => any;
    params: any[];
    promise: Promise<any>;
    result: any = "**unresolved**";
    remoteProtocol: RemoteProtocol;
    resolve;
}
@$Class("jassi.remote.Transaction")
export class Transaction extends RemoteObject {
    public static cache:Map<RemoteObject,any>=new Map() 
    private statements: TransactionItem[] = [];
    private ready;
    private  addToCache(obj,method:string,id){
        let el=Transaction.cache.get(obj);
        if(!el){
            el={};
            Transaction.cache.set(obj,el);
        }
        el[method] = [this, id];
    }
    private removeFromCache(obj,method:string){
        var c=Transaction.cache.get(obj);
        delete c[method];
        if(Object.keys(c).length === 0)
            Transaction.cache.delete(obj);

    }
    static redirectTransaction(objold,objnew,methodold: (...args) => any, methodnew: (...args) => any): (...args) => any {
        var obj=Transaction.cache.get(objold);
        if(obj!==undefined){
            var test=obj[methodold.name];
            if(test){
                test[0].removeFromCache(objold,methodold.name);
                test[0].addToCache(objnew,methodnew.name,test[1]);
            }
        }
        //methodnew["transaction"] = methodold["transaction"];
        //delete methodold["transaction"];
        return methodnew;
    }
    async execute():Promise<any[]> {
        
        this.statements.forEach((it => {
            it.promise = it.obj[it.method.name](...it.params);
            it.promise.then((val) => {
                it.result = val;//promise returned or resolved out of Transaction
            })
        }));
        let _this=this;
        await new Promise((res)=>{
            _this.ready=res;
        })
        var ret=[];
        for(let x=0;x<this.statements.length;x++){
            var res=await this.statements[x].promise;
            ret.push(res);
        }
        return ret;
        //this.statements=[];
    }
    async _push(obj:any,method: (...args) => any, prot: RemoteProtocol, id): Promise<any> {
        var stat=this.statements[id];
        stat.remoteProtocol = prot;
        this.removeFromCache(obj,method.name);
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
        let _this=this;
        return new Promise((res)=>{

            stat.resolve=res;
        });//await this.statements[id].result;//wait for result - comes with Request
    }
    private async sendRequest() {
        if (!jassi.isServer) {
            var prots = [];
            for (let x = 0; x < this.statements.length; x++) {
                let st = this.statements[x];
                if (st.result !== "**unresolved**")
                    prots.push(undefined);
                else
                    prots.push(st.remoteProtocol.stringify(st.remoteProtocol));
            }
            var sic=this.statements;
            this.statements=prots;
            var ret=await this.call(this, this.sendRequest);
            this.statements=sic;
            for(let x=0;x<this.statements.length;x++){
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
            var ObjectTransaction=(await import("jassi/server/ObjectTransaction")).ObjectTransaction;
            var ot=new ObjectTransaction();
            ot.statements=[];
            let ret=[]; 
            for(let x=0;x<this.statements.length;x++){ 
                var stat:any={
                    result:"**unresolved**"
                    
                }
                ot.statements.push(stat);
            }
            for(let x=0;x<this.statements.length;x++){ 
               ret.push(this.doServerStatement(this.statements,ot,x)); 
            }
            await Promise.all(ret);

            return ret;
        }


    }
    private async  doServerStatement(statements,ot:ObjectTransaction,num:number){
        //@ts-ignore
        var req=(await import( "jassi/server/getRequest")).getRequest();
        //@ts-ignore
        var createNamespace = require('cls-hooked').createNamespace;
         //@ts-ignore
         var _execute=(await import("jassi/server/DoRemoteProtocol"))._execute;
         if(!serversession){
            serversession= createNamespace("objecttransaction");
            
         }
         var _this=this;
         serversession.run(function(){
            serversession.set('objecttransaction', ot.statements[num]);
            //@ts-ignore
            ot.statements[num].result= _execute(<string>_this.statements[num],req,(obj)=>{
                obj.objecttransaction=ot;
                return obj;
            })
         });
            //serversession.bindEmitter(ot.statements[num]);
            //serversession.run(function () {
                
        //});
         
        //@ts-ignore
       
        return ot.statements[num].result;
        
    }
    add(obj: any, method: (...args) => any, ...params) {

        var ti = new TransactionItem();
        ti.method = method;
        ti.obj = obj;
        ti.params = params;
        this.addToCache(obj,method.name,this.statements.length);
        
        this.statements.push(ti);
    }

}