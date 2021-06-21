var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "./Jassi"], function (require, exports, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClientError = void 0;
    let ClientError = class ClientError extends Error {
        constructor(msg) {
            super(msg);
        }
    };
    ClientError = __decorate([
        Jassi_1.$Class("jassijs.remote.ClientError"),
        __metadata("design:paramtypes", [String])
    ], ClientError);
    exports.ClientError = ClientError;
});
//# sourceMappingURL=ClientError.js.map