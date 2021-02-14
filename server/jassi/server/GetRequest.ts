var cls = require('cls-hooked');
var namespace = cls.createNamespace('my.jassi');
//install the hook to use getRequest - warning it has performance impact
export function installGetRequest(req, res, next) {
    namespace.bindEmitter(req);
    namespace.run(function () {
        namespace.set('req', req);
        namespace.set('re', 1);
        next();
    });
}
//gets the current request
export function getRequest(){
   return namespace.get('req');
}