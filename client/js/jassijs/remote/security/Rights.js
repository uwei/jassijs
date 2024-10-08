var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/remote/RemoteObject"], function (require, exports, Registry_1, Registry_2, RemoteObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rights = exports.$CheckParentRight = exports.$ParentRights = exports.$Rights = exports.ParentRightProperties = exports.RightProperties = void 0;
    Registry_2 = __importDefault(Registry_2);
    class RightProperties {
    }
    exports.RightProperties = RightProperties;
    class ParentRightProperties {
    }
    exports.ParentRightProperties = ParentRightProperties;
    function $Rights(rights) {
        return function (pclass) {
            Registry_2.default.register("$Rights", pclass, rights);
        };
    }
    exports.$Rights = $Rights;
    function $ParentRights(rights) {
        return function (pclass) {
            Registry_2.default.register("$ParentRights", pclass, rights);
        };
    }
    exports.$ParentRights = $ParentRights;
    function $CheckParentRight() {
        return function (target, propertyKey, descriptor) {
            Registry_2.default.registerMember("$CheckParentRight", target, propertyKey, undefined);
        };
    }
    exports.$CheckParentRight = $CheckParentRight;
    let Rights = class Rights extends RemoteObject_1.RemoteObject {
        async isAdmin(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if (this._isAdmin !== undefined)
                    return this._isAdmin;
                return await this.call(this, this.isAdmin, context);
            }
            else {
                //@ts-ignore
                var req = context.request;
                return req.user.isAdmin;
            }
        }
    };
    Rights = __decorate([
        (0, Registry_1.$Class)("jassijs.security.Rights")
    ], Rights);
    exports.Rights = Rights;
    var rights = new Rights();
    exports.default = rights;
});
//# sourceMappingURL=Rights.js.map