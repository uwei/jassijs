var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/RemoteProtocol", "jassijs/remote/Context"], function (require, exports, Registry_1, Classes_1, RemoteProtocol_1, Context_1) {
    "use strict";
    var RemoteObject_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RemoteObject = exports._fillDefaultParameter = exports.DefaultParameterValue = exports.UseServer = exports.getContext = exports.useContext = exports.Context = void 0;
    const paramMetadataKey = Symbol("paramMetadataKey");
    class Context {
    }
    exports.Context = Context;
    function useContext(context, fn, ...args) {
        return (0, Context_1.useZoneContext)(context, fn);
    }
    exports.useContext = useContext;
    function getContext() {
        return (0, Context_1.getZoneContext)();
    }
    exports.getContext = getContext;
    function UseServer() {
        return (target, propertyName, descriptor, options) => {
            let isstatic = target.constructor.name === "Function";
            let method = descriptor.value;
            let testuuu = 9;
            const funcname = method.name;
            let smethod = target[method.name].toString();
            let sparam = smethod.substring(smethod.indexOf('(') + 1, smethod.indexOf(')'));
            let paramnames = sparam.split(',');
            if (method["__originalParams"])
                paramnames = method["__originalParams"];
            let posContext = undefined;
            if (paramnames.length > 1 && paramnames[paramnames.length - 1].split('=')[0].trim() === "context")
                posContext = paramnames.length - 1;
            else
                posContext = paramnames.length; //func  without context declaration
            const { [funcname]: newfunc } = {
                [funcname]: function (...paramnames) {
                    let test = paramnames;
                    let test2 = posContext;
                    let test3 = target[method.name].toString();
                    var context = undefined;
                    if (posContext !== undefined && arguments.length > posContext) {
                        context = arguments[posContext];
                    }
                    if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                        return RemoteObject.docall(target, method, ...arguments);
                    }
                    else
                        return method.apply(this, arguments);
                }
            };
            newfunc["__originalParams"] = paramnames;
            descriptor.value = newfunc;
        };
    }
    exports.UseServer = UseServer;
    function DefaultParameterValue(value) {
        return (target, propertyKey, parameterIndex) => {
            //@ts-ignore
            let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) || {};
            if (params[parameterIndex] === undefined)
                params[parameterIndex] = {};
            params[parameterIndex]["DefaultParameterValue"] = {
                value,
                index: parameterIndex
            };
            //@ts-ignore
            Reflect.defineMetadata(paramMetadataKey, params, target, propertyKey);
        };
    }
    exports.DefaultParameterValue = DefaultParameterValue;
    function _fillDefaultParameter(_this, method, parameter, withContext = undefined) {
        let smethod = _this[method.name].toString();
        let sparam = smethod.substring(smethod.indexOf('(') + 1, smethod.indexOf(')'));
        let paramnames = sparam.split(',');
        //the method is manipulated so we dont read the original params - we saved this in @UseServer and ValidateFunctionParameter
        if (_this[method.name]["__originalParams"])
            paramnames = _this[method.name]["__originalParams"];
        //remove context from parameters
        let posContext = undefined;
        var context = withContext;
        if (paramnames.length > 0 && paramnames[paramnames.length - 1].split('=')[0].trim() === "context")
            posContext = paramnames.length - 1;
        if (parameter.length > paramnames.length) { //no parameter für context
            context = parameter[parameter.length - 1];
            posContext = parameter.length - 1;
        }
        else if (posContext !== undefined) {
            paramnames.pop();
            context = parameter[posContext];
        }
        if (posContext !== undefined && parameter.length > posContext) {
            parameter.pop();
        }
        //read default parameter from @DefaultParameterValue parameter decorator
        //@ts-ignore
        let meta = Reflect.getOwnMetadata(paramMetadataKey, _this, method.name);
        var defaultparams = {};
        for (var key in meta) {
            let entr = meta[key].DefaultParameterValue;
            defaultparams[entr.index] = entr.value;
        }
        //filling function parameter so we can add context on last parameter
        for (var x = parameter.length; x < paramnames.length; x++) {
            if (defaultparams[x] !== undefined)
                parameter.push(defaultparams[x]);
            else
                parameter.push(undefined);
        }
        return context;
    }
    exports._fillDefaultParameter = _fillDefaultParameter;
    let RemoteObject = RemoteObject_1 = class RemoteObject {
        static async docall(_this, method, ...parameter) {
            return RemoteObject_1.docallWithReplaceThis(_this, _this, method, ...parameter);
        }
        static async docallWithReplaceThis(replaceThis, _this, method, ...parameter) {
            if (jassijs.isServer)
                throw new Classes_1.JassiError("should be called on client");
            var prot = new RemoteProtocol_1.RemoteProtocol();
            prot.classname = Classes_1.classes.getClassName(_this);
            prot._this = _this.constructor.prototype[method.name] !== undefined ? replaceThis : "static";
            prot.parameter = parameter;
            prot.method = method.name;
            var context = _fillDefaultParameter(_this, method, parameter);
            var ret;
            if (context === null || context === void 0 ? void 0 : context.transaction) {
                let ccontext = context;
                ret = await ccontext.transaction.addProtocol(prot, context);
                //ret = await context.transactionitem.transaction.wait(context.transactionitem, prot);
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
    };
    RemoteObject = RemoteObject_1 = __decorate([
        (0, Registry_1.$Class)("jassijs.remote.RemoteObject")
    ], RemoteObject);
    exports.RemoteObject = RemoteObject;
    function test2() {
        console.log(JSON.stringify(getContext()));
        return 2;
    }
    async function test() {
        const hallo = await useContext({ isServer: false, hallo: "Du" }, async () => {
            // await new Promise(res => setTimeout(res, 10));
            return test2();
        });
        console.log(hallo);
    }
    exports.test = test;
});
//# sourceMappingURL=RemoteObject.js.map