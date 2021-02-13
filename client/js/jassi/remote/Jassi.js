var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Registry"], function (require, exports, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Jassi = exports.$register = exports.$Class = void 0;
    /*
    window.extentsionCalled = function (param:  ExtensionAction) {
        if (param.sample) {
            alert("default:" + param.defaultAction.name);
        }
       
    }
    window.extentsionCalled({
        sample: { name: "Passt" }
    })*/
    function $Class(longclassname) {
        return function (pclass) {
            Registry_1.default.register("$Class", pclass, longclassname);
        };
    }
    exports.$Class = $Class;
    function $register(servicename, ...params) {
        return function (pclass) {
            Registry_1.default.register(servicename, pclass, params);
        };
    }
    exports.$register = $register;
    //@ts-ignore
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
    /**
    * main class for jassi
    * @class Jassi
    */
    let Jassi = class Jassi {
        constructor() {
            this.isServer = false;
            //@ts-ignore
            this.isServer = window.document === undefined;
            if (!this.isServer) {
                this.myRequire("jassi/jassi.css");
                this.myRequire("https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css");
                this.myRequire("//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css");
            }
        }
        /**
         * include a global stylesheet
         * @id - the given id - important for update
         * @data - the css data to insert
         **/
        includeCSS(id, data) {
            //@ts-ignore
            var style = document.getElementById(id);
            //@ts-ignore
            if (!document.getElementById(id)) {
                style = $('<style id=' + id + '></style>')[0];
                //@ts-ignore
                document.head.appendChild(style);
            }
            var sstyle = "";
            for (var selector in data) {
                var sstyle = sstyle + "\n\t" + selector + "{\n";
                var properties = data[selector];
                var prop = {};
                for (let key in properties) {
                    if (key === "_classname")
                        continue;
                    var newKey = key.replaceAll("_", "-");
                    prop[newKey] = properties[key];
                    sstyle = sstyle + "\t\t" + newKey + ":" + properties[key] + ";\n";
                }
                sstyle = sstyle + "\t}\n";
            }
            style.innerHTML = sstyle;
        }
        /**
        * include a js or a css file
        * @param {string|string[]} href - url(s) of the js or css file(s)
        * @param {function} [param] - would be added with? to the url
        */
        myRequire(href, event = undefined, param = undefined) {
            if (this.isServer)
                throw "jass.Require is only available on client";
            if ((typeof href) === "string") {
                href = [href];
            }
            var url = "";
            if (href instanceof Array) {
                if (href.length === 0) {
                    if (event !== undefined)
                        event();
                    return;
                }
                else {
                    url = href[0];
                    href.splice(0, 1);
                }
            }
            if (url.endsWith(".js")) {
                //@ts-ignore
                if (window.document.getElementById("-->" + url) !== null) {
                    this.myRequire(href, event);
                }
                else {
                    //@ts-ignore
                    var js = window.document.createElement("script");
                    //   js.type = "text/javascript";
                    js.src = url + (param !== undefined ? "?" + param : "");
                    var _this = this;
                    js.onload = function () {
                        _this.myRequire(href, event);
                    };
                    js.id = "-->" + url;
                    //@ts-ignore
                    window.document.head.appendChild(js);
                }
            }
            else {
                //    <link href="lib/jquery.splitter.css" rel="stylesheet"/>
                //@ts-ignore
                var head = window.document.getElementsByTagName('head')[0];
                //@ts-ignore
                var link = window.document.createElement('link');
                //  link.rel  = 'import';
                link.href = url;
                link.rel = "stylesheet";
                link.id = "-->" + url;
                var _this = this;
                link.onload = function () {
                    _this.myRequire(href, event);
                };
                head.appendChild(link);
            }
        }
    };
    Jassi = __decorate([
        $Class("jassi.remote.Jassi"),
        __metadata("design:paramtypes", [])
    ], Jassi);
    exports.Jassi = Jassi;
    ;
    var jassi = new Jassi();
    //@ts-ignore
    if (window["jassi"] === undefined) { //reloading this file -> no destroy namespace
        //@ts-ignore
        window["jassi"] = jassi;
    }
    exports.default = jassi;
});
//# sourceMappingURL=Jassi.js.map