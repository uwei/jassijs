define(["require", "exports", "./Runlocalserver"], function (require, exports, Runlocalserver_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.patchHTTP = void 0;
    class Server {
        constructor() {
        }
        get(url, func) {
            debugger;
        }
        //listen(port:number,hostname:string,backlog:number,callback:()=>void){
        listen(port, callback) {
            this.port = port;
            //  this.hostname=hostname;
            //this.backlog=backlog;
            this.callback = callback;
            var lib = (0, Runlocalserver_1.jrequire)("http");
            lib.serverListening[port] = this;
            if (callback)
                callback();
            return {};
        }
        doRequest(req, res) {
            this.requestListener(req, res, () => 1);
        }
    }
    class ServerResponse {
        constructor() {
            this.statusCode = 200;
            this.headers = {};
            this.bodyChunks = [];
            this.finished = false;
            this._onFinish = null;
        }
        writeHead(statusCode, maybeHeaders = {}) {
            this.statusCode = statusCode;
            this.headers = Object.assign(Object.assign({}, this.headers), maybeHeaders);
        }
        setHeader(name, value) {
            this.headers[name.toLowerCase()] = value;
        }
        getHeader(name) {
            return this.headers[name.toLowerCase()];
        }
        write(chunk, encoding = 'utf-8') {
            if (this.finished)
                throw new Error('Cannot write after end');
            if (typeof chunk === 'string') {
                this.bodyChunks.push(Buffer.from(chunk, encoding).toString());
            }
            else if (chunk instanceof Uint8Array || Buffer.isBuffer(chunk)) {
                this.bodyChunks.push(chunk.toString(encoding));
            }
            else {
                throw new Error('Unsupported chunk type');
            }
        }
        end(chunk = '', encoding = 'utf-8') {
            if (this.finished)
                return;
            if (chunk)
                this.write(chunk, encoding);
            this.finished = true;
            const fullBody = this.bodyChunks.join('');
            console.log('📦 Full Response Body:\n' + fullBody);
            if (typeof this._onFinish === 'function') {
                this._onFinish(this);
            }
        }
        on(event, callback) {
            if (event === 'finish') {
                this._onFinish = callback;
            }
        }
        toJSON() {
            return {
                statusCode: this.statusCode,
                headers: this.headers,
                body: this.bodyChunks.join(''),
            };
        }
    }
    function patchHTTP(ob) {
        ob.ServerResponse = ServerResponse;
        ob.serverListening = {};
        ob.createServer = (requestListener) => {
            var ret = new Server();
            ret.requestListener = requestListener;
            return ret;
        };
        ob.STATUS_CODES = {
            100: 'Continue',
            101: 'Switching Protocols',
            102: 'Processing',
            200: 'OK',
            201: 'Created',
            202: 'Accepted',
            203: 'Non-Authoritative Information',
            204: 'No Content',
            205: 'Reset Content',
            206: 'Partial Content',
            300: 'Multiple Choices',
            301: 'Moved Permanently',
            302: 'Found',
            303: 'See Other',
            304: 'Not Modified',
            307: 'Temporary Redirect',
            308: 'Permanent Redirect',
            400: 'Bad Request',
            401: 'Unauthorized',
            402: 'Payment Required',
            403: 'Forbidden',
            404: 'Not Found',
            405: 'Method Not Allowed',
            406: 'Not Acceptable',
            407: 'Proxy Authentication Required',
            408: 'Request Timeout',
            409: 'Conflict',
            410: 'Gone',
            411: 'Length Required',
            412: 'Precondition Failed',
            413: 'Payload Too Large',
            414: 'URI Too Long',
            415: 'Unsupported Media Type',
            416: 'Range Not Satisfiable',
            417: 'Expectation Failed',
            418: "I'm a Teapot",
            422: 'Unprocessable Entity',
            425: 'Too Early',
            426: 'Upgrade Required',
            428: 'Precondition Required',
            429: 'Too Many Requests',
            431: 'Request Header Fields Too Large',
            451: 'Unavailable For Legal Reasons',
            500: 'Internal Server Error',
            501: 'Not Implemented',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
            505: 'HTTP Version Not Supported',
            507: 'Insufficient Storage',
            511: 'Network Authentication Required'
        };
        ob.METHODS = [
            'ACL',
            'BIND',
            'CHECKOUT',
            'CONNECT',
            'COPY',
            'DELETE',
            'GET',
            'HEAD',
            'LINK',
            'LOCK',
            'M-SEARCH',
            'MERGE',
            'MKACTIVITY',
            'MKCALENDAR',
            'MKCOL',
            'MOVE',
            'NOTIFY',
            'OPTIONS',
            'PATCH',
            'POST',
            'PROPFIND',
            'PROPPATCH',
            'PURGE',
            'PUT',
            'REBIND',
            'REPORT',
            'SEARCH',
            'SOURCE',
            'SUBSCRIBE',
            'TRACE',
            'UNBIND',
            'UNLINK',
            'UNLOCK',
            'UNSUBSCRIBE'
        ];
    }
    exports.patchHTTP = patchHTTP;
});
//# sourceMappingURL=HTTPPatch.js.map