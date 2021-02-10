var cls = require('cls-hooked');
var namespace = cls.createNamespace('my.jassi');
export function manageRequest(req, res, next) {
    
    
    namespace.bindEmitter(req);
    namespace.run(function () {
        namespace.set('req', req);
        namespace.set('re', 1);

     
        next();
    });
}
export function getRequest(){

    var test=namespace.get('req');
    var test2=namespace.get('re');
    return namespace.get('req');
}