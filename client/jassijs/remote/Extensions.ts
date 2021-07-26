import registry from "jassijs/remote/Registry";


export function $Extension(forclass): Function {
    return function (pclass) {
        registry.register("$Extension", pclass, forclass);
    }
}
class ExtensionTarget{
    oclass:any;
    addFunction(name:string,func:(...any)=>any,ifExists:"replace"|"append"|"prepend"){

    }
    addMember(name:string){

    }
    annotateMember( member, type, ...annotations) {
    }
}
export interface ExtensionProvider {
    initExtensions(extend:ExtensionTarget);
}
export class Extensions {
    constructor() {
        this.funcRegister = registry.onregister("$Extension", this.register.bind(this));
    }
    private funcRegister;
    destroy() { 
        registry.offregister("$Extension", this.funcRegister);
    }
    annotate(oclass, ...annotations) {
        throw new Error("not implemented yet");
    }
    
    register(extensionclass: new (...args: any[]) => any, forclass) {
        //TODO reloading???
        //we must wait with to extent because forclass ist not loaded
        var func = registry.onregister("$Class", function (oclass, params) {
            if (oclass.prototype.constructor._classname === forclass) {
               // reloading code-> registry.offregister("$Class", func);
                let props = Object.getOwnPropertyNames(extensionclass.prototype);
                for (var m = 0; m < props.length; m++) {
                    var member = props[m];
                    if (member !== "_classname" && member !== "constructor") {
                        if (typeof extensionclass.prototype[member] === "function") {
                            if (oclass.prototype[member] !== undefined) {
                                var sic = oclass.prototype[member];
                                var ext = extensionclass.prototype[member];
                                oclass.prototype[member] = function (...p) {
                                    sic.bind(this)(...p);
                                    ext.bind(this)(...p);
                                }

                            } else
                                oclass.prototype[member] = extensionclass.prototype[member];
                        }
                    }
                }
            }
        });

        //  alert(forclass);
    }
    annotateMember(classname, member, type, ...annotations) {
       
        var func = registry.onregister("$Class", function (oclass, params) {
            if (oclass.prototype.constructor._classname === classname) {
                registry.offregister("$Class", func);
                //designtype
              
                Reflect["metadata"]("design:type", type)(oclass.prototype, member);
                for (var x = 0; x < annotations.length; x++) {
                    let ann = annotations[x];
                    ann(oclass.prototype, member);
                }
            }
        });
    }
}
var extensions = new Extensions();
export { extensions };