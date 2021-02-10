"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequest = exports.manageRequest = void 0;
var cls = require('cls-hooked');
var namespace = cls.createNamespace('my.jassi');
function manageRequest(req, res, next) {
    namespace.bindEmitter(req);
    namespace.run(function () {
        namespace.set('req', req);
        namespace.set('re', 1);
        next();
    });
}
exports.manageRequest = manageRequest;
function getRequest() {
    var test = namespace.get('req');
    var test2 = namespace.get('re');
    return namespace.get('req');
}
exports.getRequest = getRequest;
//# sourceMappingURL=getRequest.js.map