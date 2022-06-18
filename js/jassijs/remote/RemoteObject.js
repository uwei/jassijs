"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteObject = exports.Context = void 0;
const Jassi_1 = require("jassijs/remote/Jassi");
const Classes_1 = require("jassijs/remote/Classes");
const RemoteProtocol_1 = require("jassijs/remote/RemoteProtocol");
class Context {
}
exports.Context = Context;
let RemoteObject = class RemoteObject {
    static async call(method, ...parameter) {
        if (jassijs.isServer)
            throw new Classes_1.JassiError("should be called on client");
        var prot = new RemoteProtocol_1.RemoteProtocol();
        var context = parameter[parameter.length - 1];
        prot.classname = Classes_1.classes.getClassName(this);
        prot._this = "static";
        prot.parameter = parameter;
        prot.method = method.name;
        prot.parameter.splice(parameter.length - 1, 1);
        var ret;
        if (context === null || context === void 0 ? void 0 : context.transactionitem) {
            ret = await context.transactionitem.transaction.wait(context.transactionitem, prot);
            return ret;
        }
        //let Transaction= (await import("jassijs/remote/Transaction")).Transaction;
        //var trans=Transaction.cache.get(_this);
        //if(trans&&trans[method.name]){
        //	throw "not implemented"
        //	ret=await trans[method.name][0]._push(undefined,prot.method,prot,trans[method.name][1]);
        //}
        ret = await prot.call();
        return ret;
    }
    async call(_this, method, ...parameter) {
        if (jassijs.isServer)
            throw new Classes_1.JassiError("should be called on client");
        var prot = new RemoteProtocol_1.RemoteProtocol();
        var context = parameter[parameter.length - 1];
        prot.classname = Classes_1.classes.getClassName(this);
        prot._this = _this;
        prot.parameter = parameter;
        prot.method = method.name;
        prot.parameter.splice(parameter.length - 1, 1);
        var ret;
        //let context=(await import("jassijs/remote/Context")).Context;
        //let Transaction= (await import("jassijs/remote/Transaction")).Transaction;
        //var trans=Transaction.cache.get(_this);
        //var trans=context.get("transaction");
        if (context === null || context === void 0 ? void 0 : context.transactionitem) {
            ret = await context.transactionitem.transaction.wait(context.transactionitem, prot);
            return ret;
        }
        ret = await prot.call();
        return ret;
    }
};
RemoteObject = __decorate([
    (0, Jassi_1.$Class)("jassijs.remote.RemoteObject")
], RemoteObject);
exports.RemoteObject = RemoteObject;
//# sourceMappingURL=RemoteObject.js.map