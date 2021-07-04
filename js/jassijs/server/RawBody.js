"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawbody = void 0;
function rawbody(req, res, next) {
    var data = "";
    req.on('data', function (chunk) { data += chunk; });
    req.on('end', function () {
        req.rawBody = data;
        next();
    });
}
exports.rawbody = rawbody;
//# sourceMappingURL=RawBody.js.map