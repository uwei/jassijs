var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
function patchHTTP(ob) {
    async function feedRequestBody(requestSW, requestNodes) {
        if (!requestSW.body) {
            // Kein Body vorhanden – trotzdem Events feuern
            requestNodes.emit('data', new Uint8Array(0)); // optional
            requestNodes.emit('end');
            return;
        }
        const reader = requestSW.body.getReader();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                /* todo
                function isProbablyText(contentType: string | null): boolean {
                if (!contentType) return false;

                const lower = contentType.toLowerCase();
                return lower.startsWith("text/") ||
                    lower.includes("json") ||
                    lower.includes("xml") ||
                    lower.includes("yaml") ||
                    lower.includes("csv") ||
                    lower.includes("html") ||
                    lower.includes("x-www-form-urlencoded");
                }*/
                var text = new TextDecoder().decode(value);
                requestNodes.emit('data', text);
            }
            requestNodes.emit('end');
        }
        catch (err) {
            requestNodes.emit('error', err);
        }
    }
    function createRequest(request, server) {
        const listeners = {};
        var req = {};
        req.headers = {};
        req.method = request.method;
        for (const [key, value] of request.headers.entries()) {
            req.headers[key] = value;
        }
        req.socket = {
            setKeepAlive() { }
        };
        req.removeListener = (event, listenerFn) => {
            if (!listeners[event])
                return;
            listeners[event] = listeners[event].filter(fn => fn !== listenerFn);
        };
        req.on = (event, callback) => {
            if (!listeners[event]) {
                listeners[event] = [];
            }
            listeners[event].push(callback);
        };
        req.emit = (event, ...args) => {
            const callbacks = listeners[event];
            if (callbacks) {
                callbacks.forEach(cb => cb(...args));
            }
        };
        req.url = request.url.replace(new URL(request.url).origin, "");
        if (req.url.startsWith("/:")) { //http://localhost:5000/:3000
            var pos = req.url.substring(1).indexOf("/");
            if (pos === -1)
                req.url = "/";
            else
                req.url = req.url.substring(pos + 1);
        }
        /*  if (request.body) {
              debugger;
              const { Readable } = jrequire('stream-browserify');
              const reader = request.body.getReader();
              let started = false;
      
              req._readable = new Readable({
                  read() {
                      if (started) return;
                      started = true;
      
                      const pump = () => {
                          reader.read().then(({ done, value }) => {
                              if (done) {
                                  this.push(null);
                                  req.emit('end');
                                  return;
                              }
                              this.push(value);
                              req.emit('data', value);
                              pump();
                          }).catch(err => {
                              this.destroy(err);
                              req.emit('error', err);
                          });
                      };
      
                      pump();
                  }
              });
      
              // Node-kompatibel: req ist der Stream
              Object.setPrototypeOf(req, Object.getPrototypeOf(req._readable));
              Object.assign(req, req._readable);
          }*/
        if (server === null || server === void 0 ? void 0 : server.serverCookies) {
            //  debugger;
            if (req.headers["cookie"] !== undefined) {
                console.warn("not implemented migrate cookies here");
            }
            req.headers["cookie"] = server === null || server === void 0 ? void 0 : server.serverCookies;
        }
        return req;
    }
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
            var lib = jrequire("http");
            lib.serverListening[port] = this;
            this.registerServiceWorker();
            if (callback)
                callback();
            return {};
        }
        /**
         * redirect all Server request to this serverport
         */
        registerServiceWorker() {
            var _this = this;
            if (!globalThis.requestHandler)
                globalThis.requestHandler = {};
            globalThis.requestHandler["http://localhost:" + this.port] = async (event) => {
                var server = this;
                // setTimeout(() => {
                const { Readable } = jrequire('stream');
                // 1. Erstelle einen Node-kompatiblen Readable Stream
                const nodeStream = new Readable({
                    read() { } // keine automatische Push-Logik
                });
                // 2. Schreibe initiale Daten
                // nodeStream.push('data: Hallo\n\n');
                let str = new ReadableStream({
                    async start(controller) {
                        var _a, e_1, _b, _c;
                        //@ts-ignore
                        const reader = nodeStream[Symbol.asyncIterator]();
                        try {
                            try {
                                for (var _d = true, reader_1 = __asyncValues(reader), reader_1_1; reader_1_1 = await reader_1.next(), _a = reader_1_1.done, !_a;) {
                                    _c = reader_1_1.value;
                                    _d = false;
                                    try {
                                        const chunk = _c;
                                        controller.enqueue(new TextEncoder().encode(chunk));
                                    }
                                    finally {
                                        _d = true;
                                    }
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (!_d && !_a && (_b = reader_1.return)) await _b.call(reader_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            controller.close();
                        }
                        catch (err) {
                            controller.error(err);
                        }
                    }
                });
                var vres;
                var resvalue = await new Promise((resolve) => {
                    // const SR= http.ServerResponse;
                    vres = new ServerResponse();
                    vres.server = _this;
                    let owrite = vres.write.bind(vres);
                    let oend = vres.end.bind(vres);
                    var data;
                    vres.write = (chunk, encoding) => {
                        data = chunk;
                        nodeStream.push(chunk);
                        resolve(1);
                        owrite(chunk, encoding);
                    };
                    vres.write = vres.write.bind(vres);
                    vres.end = ((data) => {
                        if (data)
                            nodeStream.push(data);
                        nodeStream.push(null);
                        oend();
                        resolve(data);
                    });
                    vres.end = vres.end.bind(vres);
                    let reqnew = createRequest(event.request, server);
                    //send request
                    server.requestListener(reqnew, vres, () => 1);
                    feedRequestBody(event.request, reqnew);
                });
                //if(vres.headers['Access-Control-Allow-Origin']===undefined)  vres.headers['Access-Control-Allow-Origin']= '*';
                //  if(vres.headers['Access-Control-Allow-Methods']===undefined)  vres.headers['Access-Control-Allow-Methods']= 'GET, POST, OPTIONS';
                //  if(vres.headers['Access-Control-Allow-Headers']===undefined)  vres.headers['Access-Control-Allow-Headers']= 'Origin, Content-Type, Accept, Cache-Control';
                //if(vres.headers['Access-Control-Allow-Credentials']===undefined)  vres.headers['Access-Control-Allow-Credentials']=  'true';
                if (vres.headers["content-type"] && vres.headers["content-type"].indexOf('text/event-stream') !== -1) {
                    str = str;
                } /* else {
                    var r = await str.getReader().read();
                    str = <any>(r).value;
                }*/
                console.log("fin");
                var res = new Response(str, {
                    status: vres.statusCode,
                    statusText: ob.STATUS_CODES[vres.statusCode],
                    headers: vres.headers /*{
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                    }*/
                });
                return res;
            };
            globalThis.requestHandler[self.location.origin + "/:" + this.port] = globalThis.requestHandler["http://localhost:" + this.port];
        }
    }
    class ServerResponse {
        constructor() {
            this.statusCode = 200;
            this.headers = {};
            this.bodyChunks = [];
            this.finished = false;
            this.listeners = {};
            this.emit = (event, ...args) => {
                const callbacks = this.listeners[event];
                if (callbacks) {
                    callbacks.forEach(cb => cb(...args));
                }
            };
        }
        writeHead(statusCode, maybeHeaders = {}) {
            this.statusCode = statusCode;
            this.headers = Object.assign(Object.assign({}, this.headers), maybeHeaders);
        }
        setHeader(name, value) {
            /*   function parseCookie(cookieString) {
                   const cookieHash = {};
                 
                   cookieString.split(';').forEach(part => {
                     const [key, value] = part.trim().split('=');
                     if (value !== undefined) {
                       cookieHash[key] = value;
                     }
                   });
                 
                   return cookieHash;
                 }*/
            if (name.toLowerCase() === "set-cookie" && this.server) {
                this.server.serverCookies = value;
                // if(this.server.serverCookies===undefined)
                //     this.server.serverCookies={};
                // Object.assign(this.server.serverCookie,parseCookie(value));
            }
            this.headers[name.toLowerCase()] = value;
        }
        getHeader(name) {
            return this.headers[name.toLowerCase()];
        }
        write(chunk, encoding = 'utf-8') {
            if (this.finished)
                throw new Error('Cannot write after end');
            if (typeof chunk === 'string') {
                this.bodyChunks.push(globalThis.Buffer.from(chunk, encoding).toString());
            }
            else if (chunk instanceof Uint8Array || globalThis.Buffer.isBuffer(chunk)) {
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
            // console.log('📦 Full Response Body:\n' + fullBody);
            this.emit("finish");
            this.emit("close");
        }
        removeListener(event, listenerFn) {
            if (!this.listeners[event])
                return;
            this.listeners[event] = this.listeners[event].filter(fn => fn !== listenerFn);
        }
        once(event, callback) {
            let n = (...args) => {
                callback(...args);
                var pos = this.listeners[event].indexOf(n);
                if (pos !== -1) {
                    this.listeners[event].splice(pos, 1);
                }
            };
            this.on(event, callback);
        }
        on(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
            /* if (event === "end")
                 debugger;
             if (event === 'finish') {
                 this._onFinish = callback;
             }*/
        }
    }
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
//# sourceMappingURL=PatchTTP.js.map