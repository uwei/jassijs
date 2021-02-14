"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequest = exports.installGetRequest = void 0;
var cls = require('cls-hooked');
var namespace = cls.createNamespace('my.jassi');
//install the hook to use getRequest - warning it has performance impact
function installGetRequest(req, res, next) {
    namespace.bindEmitter(req);
    namespace.run(function () {
        namespace.set('req', req);
        namespace.set('re', 1);
        next();
    });
}
exports.installGetRequest = installGetRequest;
//gets the current request
function getRequest() {
    return namespace.get('req');
}
exports.getRequest = getRequest;
//# sourceMappingURL=getRequest.js.map