interface BrowserServerWorkerInterface {
    patchHTTP: (http: any,jrequire:any,app:BrowserServerAppClass) => void
}

browserserverworker.patchHTTP = (ob,jrequire:any,app:BrowserServerAppClass) => {
    async function feedRequestBody(requestSW: Request, requestNodes: any) {
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
                if (done) break;
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
                var text = new TextDecoder().decode(<any>value);
                requestNodes.emit('data', text);
            }
            requestNodes.emit('end');
        } catch (err) {
            requestNodes.emit('error', err);
        }
    }
    function createRequest(request:Request, server: Server) {
        const listeners:{[key:string]:((...props:any)=>any)[]} = {};
        var req: any = {};
        req.headers = {};
        req.method = request.method;
        for (const [key, value] of request.headers.entries()) {
            req.headers[key] = value;
        }
        req.socket = {
            setKeepAlive() { }
        }
        req.removeListener = (event:string, listenerFn:any) => {
            if (!listeners[event]) return;
            //@ts-ignore
            listeners[event] = listeners[event].filter(fn => fn !== listenerFn);
        }

        req.on = (event:string, callback:any) => {
            if (!listeners[event]) {
                listeners[event] = [];
            }
            listeners[event].push(callback);
        };

        req.emit = (event:string, ...args:any) => {
            const callbacks = listeners[event];
            if (callbacks) {
                callbacks.forEach(cb => cb(...args));
            }
        };
        req.url = request.url.replace(baseroot, "");
        if(req.url.startsWith("/apps/")){
            req.url= req.url.substring("/apps/".length);
            let pos=req.url.indexOf("/");
            if(pos!==-1){
                req.url=req.url.substring(pos);
            }else{
                req.url="/";
            }
        }
        if (req.url.startsWith("/:")) {//http://localhost:5000/:3000
            var pos = req.url.substring(1).indexOf("/");
            if (pos === -1)
                req.url = "/";
            else
                req.url = req.url.substring(pos + 1);

        }

        if (server?.serverCookies) {
            //  debugger;
            if (req.headers["cookie"] !== undefined) {
                console.warn("not implemented migrate cookies here");
            }
            req.headers["cookie"] = server?.serverCookies;
        }
        return req;
    }
    class Server {
        //TODO "set-cookie" are not transfered to the client so we collect them and send it back to the server
        serverCookies?: string;
        port?: number;
        hostname?: string;
        backlog?: number;
        callback?: () => void;
        options?:any;
        requestListener?: (req:any,response:ServerResponse,evt:(...props:any)=>any) => any;
        constructor() {

        }
        get(url:string, func:any) {
            debugger;
        }
        //listen(port:number,hostname:string,backlog:number,callback:()=>void){
        listen(port: number, callback: () => void) {
            this.port = port;
            //  this.hostname=hostname;
            //this.backlog=backlog;
            this.callback = callback;
            var lib = jrequire("http");
            lib.serverListening[port] = this;
            this.registerServiceWorker();
            if (callback&&typeof callback==="function")
                callback();
            return {};
        }
        /**
         * redirect all Server request to this serverport
         */

        registerServiceWorker() {
            var _this = this;
            if (!app.requestHandler)
            app.requestHandler = {};

            app.requestHandler["http://localhost:" + this.port] = async (request) => {
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
                        //@ts-ignore
                        const reader = nodeStream[Symbol.asyncIterator]();
                        try {
                            for await (const chunk of reader) {
                                controller.enqueue(new TextEncoder().encode(chunk));
                            }
                            controller.close();
                        } catch (err) {
                            controller.error(err);
                        }
                    }
                });
                var vres:ServerResponse;
                vres=<any>{};

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


                    }
                    vres.write = vres.write.bind(vres);
                    vres.end = ((data) => {
                        if (data)
                            nodeStream.push(data);
                        nodeStream.push(null);

                        oend();
                        resolve(data);
                    });
                    vres.end = vres.end.bind(vres);
                    let reqnew = createRequest(request, server);
                    //send request
                    //@ts-ignore
                    server.requestListener(reqnew, vres, () => 1);
                    feedRequestBody(request, reqnew);
                });

                //if(vres.headers['Access-Control-Allow-Origin']===undefined)  vres.headers['Access-Control-Allow-Origin']= '*';
                //  if(vres.headers['Access-Control-Allow-Methods']===undefined)  vres.headers['Access-Control-Allow-Methods']= 'GET, POST, OPTIONS';
                //  if(vres.headers['Access-Control-Allow-Headers']===undefined)  vres.headers['Access-Control-Allow-Headers']= 'Origin, Content-Type, Accept, Cache-Control';
                //if(vres.headers['Access-Control-Allow-Credentials']===undefined)  vres.headers['Access-Control-Allow-Credentials']=  'true';

                if (vres.headers["content-type"] && vres.headers["content-type"].indexOf('text/event-stream') !== -1) {
                    str = str;
                }/* else {
                    var r = await str.getReader().read();
                    str = <any>(r).value;
                }*/
                console.log("fin");
                var res = new Response(str, {
                    status: vres.statusCode,
                    statusText: ob.STATUS_CODES[vres.statusCode],
                    headers: vres.headers/*{
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                    }*/
                });
                return res;
            };
            app.requestHandler[baseroot + "/apps/:" + this.port] = app.requestHandler["http://localhost:" + this.port]

        }
    }

    class ServerResponse {
        statusCode = 200;
        headers:{[key:string]:string} = {};
        bodyChunks = [];
        finished:boolean = false;
        listeners:{[name:string]:any} ={} ;
        server?: Server=undefined;
        constructor() {

        }

        writeHead(statusCode:number, maybeHeaders = {}) {
            this.statusCode = statusCode;
            this.headers = { ...this.headers, ...maybeHeaders };
        }

        setHeader(name:string, value:string) {
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

        getHeader(name:string) {
            return this.headers[name.toLowerCase()];
        }

        write(chunk:any, encoding = 'utf-8') {
            if (this.finished) throw new Error('Cannot write after end');

            if (typeof chunk === 'string') {
                //@ts-ignore
                this.bodyChunks.push(globalThis.Buffer.from(chunk, encoding).toString());
                //@ts-ignore
            } else if (chunk instanceof Uint8Array || globalThis.Buffer.isBuffer(chunk)) {
                //@ts-ignore
                this.bodyChunks.push(chunk.toString(encoding));
            } else {
                throw new Error('Unsupported chunk type');
            }
        }

        end(chunk = '', encoding = 'utf-8') {
            if (this.finished) return;
           if (chunk) this.write(chunk, encoding);
            this.finished = true;
            const fullBody = this.bodyChunks.join('');
            this.emit("finish");
            this.emit("close");
        }
        emit = (event:string, ...args:any) => {
            const callbacks = this.listeners[event];
            if (callbacks) {
                callbacks.forEach((cb:any) =>{
                                            cb(...args)
                 } );
            }
        };
        removeListener(event:string, listenerFn:any) {
            if (!this.listeners[event]) return;

            this.listeners[event] = this.listeners[event].filter((fn:any) => fn !== listenerFn);
        }
        once(event:string, callback:any) {
            let n = (...args:any) => {//create a new listener which delete after called
                callback(...args);
                var pos = this.listeners[event].indexOf(n);
                if (pos !== -1) {
                    this.listeners[event].splice(pos, 1)
                }

            }
            this.on(event, callback);
        }
        on(event:string, callback:any) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        }


    }

    ob.ServerResponse = ServerResponse;
    ob.serverListening = {

    }
    ob.createServer = (requestListener:any) => {
        var ret = new Server();
        ret.requestListener = requestListener;

        return ret;
    }
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
