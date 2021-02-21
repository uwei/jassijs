"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Transaction_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.TransactionItem = void 0;
const Jassi_1 = require("jassi/remote/Jassi");
const RemoteObject_1 = require("jassi/remote/RemoteObject");
var serversession;
class TransactionItem {
    constructor() {
        this.result = "**unresolved**";
    }
}
exports.TransactionItem = TransactionItem;
let Transaction = Transaction_1 = class Transaction extends RemoteObject_1.RemoteObject {
    constructor() {
        super(...arguments);
        this.statements = [];
    }
    addToCache(obj, method, id) {
        let el = Transaction_1.cache.get(obj);
        if (!el) {
            el = {};
            Transaction_1.cache.set(obj, el);
        }
        el[method] = [this, id];
    }
    removeFromCache(obj, method) {
        var c = Transaction_1.cache.get(obj);
        delete c[method];
        if (Object.keys(c).length === 0)
            Transaction_1.cache.delete(obj);
    }
    static redirectTransaction(objold, objnew, methodold, methodnew) {
        var obj = Transaction_1.cache.get(objold);
        if (obj !== undefined) {
            var test = obj[methodold.name];
            if (test) {
                test[0].removeFromCache(objold, methodold.name);
                test[0].addToCache(objnew, methodnew.name, test[1]);
            }
        }
        //methodnew["transaction"] = methodold["transaction"];
        //delete methodold["transaction"];
        return methodnew;
    }
    async execute() {
        this.statements.forEach((it => {
            it.promise = it.obj[it.method.name](...it.params);
            it.promise.then((val) => {
                it.result = val; //promise returned or resolved out of Transaction
            });
        }));
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
        //this.statements=[];
    }
    async _push(obj, method, prot, id) {
        var stat = this.statements[id];
        stat.remoteProtocol = prot;
        this.removeFromCache(obj, method.name);
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
            stat.resolve = res;
        }); //await this.statements[id].result;//wait for result - comes with Request
    }
    async sendRequest() {
        if (!Jassi_1.default.isServer) {
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
            var ret = await this.call(this, this.sendRequest);
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
            var ObjectTransaction = (await Promise.resolve().then(() => require("jassi/server/ObjectTransaction"))).ObjectTransaction;
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
                ret.push(this.doServerStatement(this.statements, ot, x));
            }
            await Promise.all(ret);
            return ret;
        }
    }
    async doServerStatement(statements, ot, num) {
        //@ts-ignore
        var req = (await Promise.resolve().then(() => require("jassi/server/getRequest"))).getRequest();
        //@ts-ignore
        var createNamespace = require('cls-hooked').createNamespace;
        //@ts-ignore
        var _execute = (await Promise.resolve().then(() => require("jassi/server/DoRemoteProtocol")))._execute;
        if (!serversession) {
            serversession = createNamespace("objecttransaction");
        }
        var _this = this;
        serversession.run(function () {
            serversession.set('objecttransaction', ot.statements[num]);
            //@ts-ignore
            ot.statements[num].result = _execute(_this.statements[num], req, (obj) => {
                obj.objecttransaction = ot;
                return obj;
            });
        });
        //serversession.bindEmitter(ot.statements[num]);
        //serversession.run(function () {
        //});
        //@ts-ignore
        return ot.statements[num].result;
    }
    add(obj, method, ...params) {
        var ti = new TransactionItem();
        ti.method = method;
        ti.obj = obj;
        ti.params = params;
        this.addToCache(obj, method.name, this.statements.length);
        this.statements.push(ti);
    }
};
Transaction.cache = new Map();
Transaction = Transaction_1 = __decorate([
    Jassi_1.$Class("jassi.remote.Transaction")
], Transaction);
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map