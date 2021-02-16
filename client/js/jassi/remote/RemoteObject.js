var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes", "jassi/remote/RemoteProtocol"], function (require, exports, Jassi_1, Classes_1, RemoteProtocol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoteObject = void 0;
    let RemoteObject = class RemoteObject {
        static async call(method, ...parameter) {
            if (Jassi_1.default.isServer)
                throw "should be called on client";
            var prot = new RemoteProtocol_1.RemoteProtocol();
            prot.classname = Classes_1.classes.getClassName(this);
            prot._this = "static";
            prot.parameter = parameter;
            prot.method = method;
            var ret = await prot.call();
            return ret;
        }
        async call(_this, method, ...parameter) {
            if (Jassi_1.default.isServer)
                throw "should be called on client";
            var prot = new RemoteProtocol_1.RemoteProtocol();
            prot.classname = Classes_1.classes.getClassName(this);
            prot._this = _this;
            prot.parameter = parameter;
            prot.method = method;
            var ret = await prot.call();
            return ret;
        }
    };
    RemoteObject = __decorate([
        Jassi_1.$Class("jassi.remote.RemoteObject")
    ], RemoteObject);
    exports.RemoteObject = RemoteObject;
});
//# sourceMappingURL=RemoteObject.js.map