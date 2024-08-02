var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define("jassijs/base/ActionNode", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionNode = void 0;
    exports.test = test;
    let ActionNode = class ActionNode {
    };
    exports.ActionNode = ActionNode;
    exports.ActionNode = ActionNode = __decorate([
        (0, Registry_1.$Class)("jassijs.base.ActionNode")
    ], ActionNode);
    async function test() {
        var Actions = (await new Promise((resolve_1, reject_1) => { require(["jassijs/base/Actions"], resolve_1, reject_1); }).then(__importStar)).Actions;
        var actions = await Actions.getActionsFor([new ActionNode()]); //Class Actions
        console.log("found " + actions.length + " Actions");
    }
});
define("jassijs/base/Actions", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Registry_2, Registry_3, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Actions = exports.ActionProperties = void 0;
    exports.$Actions = $Actions;
    exports.$Action = $Action;
    exports.$ActionProvider = $ActionProvider;
    exports.test = test;
    Registry_2 = __importDefault(Registry_2);
    class ActionProperties {
    }
    exports.ActionProperties = ActionProperties;
    /**
     * usage
     * @$Actions()
     * static test():ActionProperties[]{
     * }
     */
    function $Actions() {
        return function (target, propertyKey, descriptor) {
            Registry_2.default.registerMember("$Actions", target, propertyKey);
        };
    }
    function $Action(property) {
        return function (target, propertyKey, descriptor) {
            Registry_2.default.registerMember("$Action", target, propertyKey, property);
        };
    }
    function $ActionProvider(longclassname) {
        return function (pclass) {
            Registry_2.default.register("$ActionProvider", pclass);
        };
    }
    let Actions = class Actions {
        static async getActionsFor(vdata) {
            var _a, _b, _c, _d;
            //var oclass = vdata[0].constructor;
            var ret = [];
            /*men.text = actions[x].name;
                    men.icon = actions[x].icon;
                    men.onclick(function (evt) {
                        ac.run([node]);
                    });*/
            var sclass = Classes_1.classes.getClassName(vdata[0]);
            var allclasses = (await Registry_2.default.getJSONData("$ActionProvider")).filter(entr => entr.params[0] === sclass);
            //await registry.loadAllFilesForEntries(allclasses);
            //let data = registry.getData("$ActionProvider");
            for (let x = 0; x < allclasses.length; x++) {
                var entr = allclasses[x];
                var mem = Registry_2.default.getJSONMemberData("$Action")[entr.classname];
                for (let name in mem) {
                    let ac = mem[name][0][0];
                    if (ac.isEnabled !== undefined || ac.run !== undefined) { //we musst load the class
                        await Classes_1.classes.loadClass(entr.classname);
                        ac = Registry_2.default.getMemberData("$Action")[entr.classname][name][0][0];
                    }
                    if (ac.isEnabled !== undefined) {
                        if ((await ac.isEnabled(vdata)) === false)
                            continue;
                    }
                    let sclassname = entr.classname;
                    let sname = name;
                    ret.push({
                        name: ac.name,
                        icon: ac.icon,
                        call: ac.run ? ac.run : async (...param) => {
                            (await Classes_1.classes.loadClass(sclassname))[sname](...param);
                        }
                    });
                }
                mem = Registry_2.default.getJSONMemberData("$Actions")[entr.classname];
                for (let name in mem) {
                    let acs = await (await Classes_1.classes.loadClass(entr.classname))[name]();
                    for (let x = 0; x < acs.length; x++) {
                        let ac = acs[x];
                        if (ac.isEnabled !== undefined && ((await ac.isEnabled(vdata)) === false))
                            continue;
                        ret.push({
                            name: ac.name,
                            icon: ac.icon,
                            call: ac.run
                        });
                    }
                }
            }
            if ((_b = (_a = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _a === void 0 ? void 0 : _a.Server) === null || _b === void 0 ? void 0 : _b.filterActions) {
                var test = (_d = (_c = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _c === void 0 ? void 0 : _c.Server) === null || _d === void 0 ? void 0 : _d.filterActions[sclass];
                var filterd = [];
                if (test) {
                    for (var x = 0; x < ret.length; x++) {
                        if (test.indexOf(ret[x].name) !== -1) {
                            filterd.push(ret[x]);
                        }
                    }
                    ret = filterd;
                }
            }
            return ret;
        }
    };
    exports.Actions = Actions;
    exports.Actions = Actions = __decorate([
        (0, Registry_3.$Class)("jassijs.base.Actions")
    ], Actions);
    async function test() {
    }
});
define("jassijs/base/CurrentSettings", ["require", "exports", "jassijs/remote/Settings", "async!jassijs/remote/Settings:load"], function (require, exports, Settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.currentsettings = void 0;
    var currentsettings = new Settings_1.Settings();
    exports.currentsettings = currentsettings;
});
define("jassijs/base/Errors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.errors = exports.Errors = void 0;
    class Errors {
        /**
        * Error handling.
        * @class jassijs.base.Error
        */
        constructor() {
            this.items = [];
            this.handler = {};
            var _this = this;
            Errors.errors = this;
            window.addEventListener("unhandledrejection", function (err) {
                _this.addError(err);
            });
            window.addEventListener("error", function (err) {
                _this.addError(err);
            });
            /* window.onerror =function(errorMsg, url, lineNumber, column, errorObj) {
                  var stack=(errorObj===null||errorObj===undefined)?"":errorObj.stack;
                  var s = 'Error: ' + errorMsg +
                                             ' Script: ' + url +
                                             ' (' + lineNumber +
                                             ', ' + column +
                                             '): ' +  stack+"->"+url;
                  var err={ errorMsg:errorMsg,url:url,lineNumber:lineNumber,column:column,errorObj:errorObj};
                 _this.addError(err);
                  console.error(s);
                  
                  if(orge!==null)
                  return orge(errorMsg, url, lineNumber, column, errorObj);
              }*/
            var org = console.log;
            console.log = function (ob) {
                org(ob);
                if (ob === undefined)
                    return;
                var logOb = { infoMsg: ob };
                _this.items.push(logOb);
                if (_this.items.count > 10) {
                    _this.items.splice(10, 1);
                }
                for (var key in _this.handler) {
                    _this.handler[key](logOb);
                }
            };
        }
        addError(err) {
            this.items.push(err);
            if (this.items.count > 20) {
                this.items.splice(20, 1);
            }
            for (var key in this.handler) {
                this.handler[key](err);
            }
        }
        /**
         * raise if error is thrown
         * @param {function} func - callback function
         * @param {string} [id] - the id of the component that registers the error
         */
        onerror(func, id) {
            if (id === undefined)
                id = Errors._randomID++;
            this.handler[id] = func;
            return id;
        }
        /**
         * delete the error handler
         * @param {function} func - callback function
         * @param {string} [id] - the id of the component that registers the error
         */
        offerror(id) {
            delete this.handler[id];
        }
    }
    exports.Errors = Errors;
    Errors._randomID = 100000;
    ;
    var errors = new Errors();
    exports.errors = errors;
});
define("jassijs/base/Extensions", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Extensions = void 0;
    Registry_4 = __importDefault(Registry_4);
    class Extensions {
        constructor() {
            this.items = {};
        }
        /**
         * extend the class
         * @param {class} type - extend the type - add functions
         */
        extend(classname, classdef) {
            var exts = this.items[classname];
            if (exts !== undefined) {
                for (var alias in exts) {
                    var cl = exts[alias];
                    if (cl.extend) {
                        cl.extend(classdef);
                    }
                }
            }
        }
        async forFile(file) {
            var items = await Registry_4.default.getJSONData("extensions");
            return items[file];
        }
        /**
         * init the Extensions
         */
        init() {
            /*
            var config={
                paths:{},
                shim:{},
                map:{'*':{}}
            }

            var items=registry.get("extensions");
            for(var clname in items){
                var file=clname.replaceAll(".","/");
                config.paths[clname]=file;
                config.map["*"][file]=clname;
                
                var files=["jassijs/jassi"];
                for(var f=0;f<items[clname].length;f++){
                    files.push("js/"+items[clname][f].file.replace(".ts",".js"));
                }
                config.shim[clname]=files;
            }*/
            //requirejs.config(config);
        }
        /**
         * extend an existing class
         * all methods and property where copied
         * @param {string} - the name of the class to extend
         * @param {class} - the class
         */
        register(name, extClass, alias) {
            if (alias === undefined)
                throw "Error Extension " + name + ": alias must be implemented";
            if (this.items[name] === undefined)
                this.items[name] = {};
            this.items[name][alias] = extClass;
        }
    }
    exports.Extensions = Extensions;
    var extensions = jassijs.extensions;
    exports.default = extensions;
});
define("jassijs/base/LoginDialog", ["require", "exports", "jassijs/ui/Component", "jassijs/ext/jquerylib"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.doAfterLogin = doAfterLogin;
    exports.login = login;
    exports.test = test;
    var queue = [];
    function doAfterLogin(resolve, prot) {
        queue.push([resolve, prot]);
    }
    var isrunning = false;
    var y = 0;
    async function check(dialog, win) {
        //console.log("check"+(y++));
        var test = (win.document && win.document.body) ? win.document.body.innerHTML : "";
        if (test.indexOf("{}") !== -1) {
            //dialog.dialog("destroy");
            document.body.removeChild(dialog);
            isrunning = false;
            for (var x = 0; x < queue.length; x++) {
                var data = queue[x];
                data[0](await data[1].call());
            }
            queue = [];
            navigator.serviceWorker.controller.postMessage({
                type: 'LOGGED_IN'
            }); //, [channel.port2]);
        }
        else if (test.indexOf('{"error"') !== -1) {
            //dialog.dialog("destroy");
            alert("Login failed");
            dialog.src = "/login.html";
            //document.body.removeChild(dialog);
            setTimeout(() => {
                check(dialog, win);
            }, 400);
        }
        else {
            //  if (!dialog.isClosed) {
            setTimeout(() => {
                check(dialog, win);
            }, 200);
            // }
        }
    }
    async function login() {
        if (isrunning)
            return;
        queue = [];
        isrunning = true;
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!fr.contentWindow) {
                    alert("no content window for login");
                }
                check(fr, fr["contentWindow"]);
            }, 100);
            var fr = Component_1.Component.createHTMLElement('<iframe  src="/login.html" name="navigation"></iframe>');
            document.body.appendChild(fr);
            fr.style.position = "absolute";
            fr.style.left = (window.innerWidth / 2 - fr.offsetWidth / 2) + "px";
            fr.style.top = (window.innerHeight / 2 - fr.offsetHeight / 2) + "px";
            fr.style.zIndex = "100";
            fr.contentWindow.focus();
            setTimeout(() => {
                var _a;
                (_a = fr.contentWindow.document.querySelector("#loginButton")) === null || _a === void 0 ? void 0 : _a.focus();
            }, 200);
        });
    }
    function test() {
        //  login();
    }
});
define("jassijs/base/PropertyEditorService", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Registry_5, Classes_2, Registry_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propertyeditor = exports.PropertyEditorService = void 0;
    Registry_6 = __importDefault(Registry_6);
    let PropertyEditorService = class PropertyEditorService {
        /**
        * manage all PropertyEditors
        * @class jassijs.ui.PropertyEditorService
        */
        constructor() {
            /** @member {Object.<string,[class]>}
             *  data[type]*/
            this.data = {};
            this.funcRegister = Registry_6.default.onregister("$PropertyEditor", this.register.bind(this));
        }
        reset() {
            this.data = {};
        }
        destroy() {
            Registry_6.default.offregister("$PropertyEditor", this.funcRegister);
        }
        async loadType(type) {
            if (this.data[type] === undefined) {
                var dat = await Registry_6.default.getJSONData("$PropertyEditor");
                for (var x = 0; x < dat.length; x++) {
                    if (dat[x].params[0].indexOf(type) !== -1) {
                        await Classes_2.classes.loadClass(dat[x].classname);
                    }
                }
                if (this.data[type] === undefined)
                    throw "PropertyEditor not found for type:" + type;
            }
            return Classes_2.classes.loadClass(this.data[type]);
        }
        /**
         * creates PropertyEditor for type
         *
         * @param {string} variablename - the name of the variable
         * @param {jassijs.ui.Property} property - name of the type
         * @param {jassijs.ui.PropertyEditor} propertyEditor - the PropertyEditor instance
         */
        createFor(property, propertyEditor) {
            var sclass = undefined;
            var promise = undefined;
            if (property.editor !== undefined) {
                sclass = property.editor;
                //   return this.loadType(sclass);
            }
            else {
                if (this.data[property.type] === undefined) {
                    return this.loadType(property.type);
                }
                else
                    sclass = this.data[property.type][0];
            }
            var oclass = Classes_2.classes.getClass(sclass);
            if (oclass === undefined)
                return Classes_2.classes.loadClass(sclass);
            if (oclass)
                return new (oclass)(property, propertyEditor);
            throw new Error("class not loaded " + sclass);
            //return new LoadingEditor(property,propertyEditor,classes.loadClass(sclass));
        }
        register(oclass, types) {
            var name = Classes_2.classes.getClassName(oclass);
            for (var x = 0; x < types.length; x++) {
                if (this.data[types[x]] === undefined)
                    this.data[types[x]] = [];
                if (this.data[types[x]].indexOf(name) === -1)
                    this.data[types[x]].push(name);
            }
        }
    };
    exports.PropertyEditorService = PropertyEditorService;
    exports.PropertyEditorService = PropertyEditorService = __decorate([
        (0, Registry_5.$Class)("jassijs.base.PropertyEditorService"),
        __metadata("design:paramtypes", [])
    ], PropertyEditorService);
    var propertyeditor = new PropertyEditorService();
    exports.propertyeditor = propertyeditor;
});
define("jassijs/base/Router", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/ComponentDescriptor", "jassijs/base/Windows"], function (require, exports, Registry_7, Classes_3, ComponentDescriptor_1, Windows_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.router = exports.Router = void 0;
    Windows_1 = __importDefault(Windows_1);
    new Promise((resolve_2, reject_2) => { require(["jassijs/remote/Classes"], resolve_2, reject_2); }).then(__importStar);
    let Router = class Router {
        constructor() {
        }
        /**
         * registers a database class
         * @param {string} - the name of the class
         * @param {class} - the class
         */
        register(name, data) {
            throw "Error not implemented";
        }
        /**
         * resolve the url
         * @param {string} hash - the hash to resolve
         */
        resolve(hash) {
            if (hash === "")
                return;
            var tags = hash.substring(1).split("&");
            var params = {};
            for (var x = 0; x < tags.length; x++) {
                var kv = tags[x].split("=");
                params[kv[0]] = kv[1];
            }
            if (params.do !== undefined) {
                var clname = params.do;
                //load js file
                Classes_3.classes.loadClass(clname).then(function (cl) {
                    if (cl === undefined)
                        return;
                    var props = ComponentDescriptor_1.ComponentDescriptor.describe(cl).fields;
                    ;
                    var id = undefined;
                    for (var p = 0; p < props.length; p++) {
                        if (props[p].id) {
                            id = props[p].name;
                        }
                    }
                    var name = params.do;
                    if (params[id])
                        name = name + "-" + params[id];
                    if (Windows_1.default.contains(name)) {
                        var window = Windows_1.default.show(name);
                        var ob = Windows_1.default.findComponent(name);
                        if (ob !== undefined) {
                            for (var key in params) {
                                if (key !== "do" && //no classname
                                    key !== id) { //no id!
                                    ob[key] = params[key];
                                }
                            }
                        }
                        return window;
                    }
                    else {
                        var ob = new cl();
                        for (var key in params) {
                            if (key !== "do") {
                                ob[key] = params[key];
                            }
                        }
                        Windows_1.default.add(ob, ob.title, name);
                        if (ob.callEvent !== undefined) {
                            Windows_1.default.onclose(ob, function (param) {
                                ob.callEvent("close", param);
                            });
                        }
                    }
                });
                /*var urltags=[];
                for(var p=0;p<props.length;p){
                    if(props[p].isUrlTag){
                        urltags.push(props[p]);
                    }
                }*/
            }
        }
        /**
         * generate a URL from the component
         * @param {jassijs.ui.Component} component - the component to inspect
         */
        getURLFromComponent(component) {
        }
        /**
         *
         * @param {string} hash - the hash to navigate
         */
        navigate(hash) {
            window.location.hash = hash;
            this.resolve(hash);
        }
    };
    exports.Router = Router;
    exports.Router = Router = __decorate([
        (0, Registry_7.$Class)("jassijs.base.Router"),
        __metadata("design:paramtypes", [])
    ], Router);
    ;
    window.addEventListener("popstate", function (evt) {
        router.resolve(window.location.hash);
    });
    let router = new Router();
    exports.router = router;
});
define("jassijs/base/Windows", ["require", "exports", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Classes", "jassijs/util/Cookies", "jassijs/ui/Component", "jassijs/ext/goldenlayout"], function (require, exports, Panel_1, Registry_8, ComponentDescriptor_2, Classes_4, Cookies_1, Component_2, goldenlayout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Windows = void 0;
    goldenlayout_1 = __importDefault(goldenlayout_1);
    let Windows = class Windows {
        /**
         * the window system -> jassijs.windows
         * @class jassijs.base.Windows
         */
        constructor() {
            this._noRestore = [];
            this._myLayout = undefined;
            this._counter = 0;
            this._id = "jassijs.windows";
            this.dom = Component_2.Component.createHTMLElement('<div class="Windows" id="' + this._id + 'jassijs.windows"/>');
            this._desktop = new Panel_1.Panel();
            this._desktop.maximize();
            //@member {Object.<string,lm.items.Component>} holds all known windows 
            this.components = [];
            //  this._desktop.add(new jassijs.ui.Button());
            document.body.append(this.dom);
            //formemoryleak
            this._init();
        }
        /**
         * inits the component
         */
        _init() {
            var config = {
                settings: {
                    showPopoutIcon: false
                },
                content: [{
                        type: 'row',
                        name: 'mid',
                        isClosable: false,
                        content: [
                            {
                                type: 'stack',
                                name: 'center',
                                isClosable: false,
                                content: [{
                                        type: 'component',
                                        isClosable: false,
                                        componentName: 'main',
                                        componentState: {}
                                    }]
                            }
                        ]
                    }]
            };
            this._myLayout = new goldenlayout_1.default(config);
            var thisDesktop = this._desktop;
            var _this = this;
            this._myLayout.registerComponent('main', function (container, state) {
                var v = container.getElement();
                v[0].appendChild(thisDesktop.dom); //html( '<h2>' + state.text + '</h2>');
                _this.inited = true;
            });
            this._myLayout.init();
            setTimeout(() => this.restoreWindows(), 100);
            var j = this._myLayout;
        }
        /**
         * search a window
         * @param {object|undefined} parent - the parent window
         * @param {type} name - name of the window
         * @returns {object} - the founded window
         */
        _findDeep(parent, name) {
            if (parent === undefined)
                parent = this._myLayout.root;
            for (var x = 0; x < parent.contentItems.length; x++) {
                if (parent.contentItems[x].config.name === name || parent.contentItems[x].config.componentName === name)
                    return parent.contentItems[x];
                var test = this._findDeep(parent.contentItems[x], name);
                if (test !== undefined)
                    return test;
            }
            return undefined;
        }
        /**
         * true if there a window with that name
         * @param {string} name
         * @returns {boolean}
         */
        contains(name) {
            return this._myLayout._components[name] !== undefined;
        }
        /**
         * activate the window
         * @param {string} name - the neme of the window
         * @returns {objet} - the window
         */
        show(name) {
            //           var m=this._find(this._myLayout.root,name);
            var m = this.components[name];
            if (m.parent.header !== undefined)
                m.parent.header.parent.setActiveContentItem(m);
            return m;
        }
        /**
         * finds the component for the name
         * @param {string} name - the name of the window
         * @returns {jassijs.ui.Component} - the found dom element
         */
        findComponent(name) {
            var m = this.components[name]; //this._find(this._myLayout.root,name);
            if (m === undefined)
                return undefined;
            if (m.container === undefined || m.container._config === undefined || m.container._config.componentState === undefined)
                return undefined;
            var ret = m.container._config.componentState.component;
            if (ret._this !== undefined)
                return ret._this;
        }
        /**
         * adds a window to the side (left - area)
         * @param {dom|jassijs.ui.Component} component - the component to add
         * @param {string} title - the title
         */
        addLeft(component, title) {
            var parentname = 'xxxleft';
            if (this._noRestore.indexOf(title) === -1)
                this._noRestore.push(title);
            var config = {
                name: parentname,
                type: 'stack',
                content: []
            };
            var _this = this;
            var parent = this.components[parentname];
            if (parent === undefined) {
                this._myLayout.root.contentItems[0].addChild(config, 0);
                parent = this._myLayout.root.contentItems[0].contentItems[0];
                this._myLayout.root.contentItems[0].contentItems[0].config.width = 15;
                this.components[parentname] = parent;
                parent.on("itemDestroyed", () => {
                    //delete _this.components[config.name];
                    _this._myLayout.updateSize();
                });
            }
            this._add(parent, component, title);
        }
        /**
        * adds a window to the side (left - area)
        * @param {dom|jassijs.ui.Component} component - the component to add
        * @param {string} title - the title
        */
        addRight(component, title) {
            var parentname = 'xxxright';
            this._noRestore.push(title);
            var _this = this;
            var config = {
                name: parentname,
                type: 'column',
                content: []
            };
            var parent = this.components[parentname];
            if (parent === undefined) {
                var pos = this._myLayout.root.contentItems[0].contentItems.length;
                this._myLayout.root.contentItems[0].addChild(config, pos);
                parent = this._myLayout.root.contentItems[0].contentItems[pos];
                parent.config.width = 15;
                this.components[parentname] = parent;
                parent.on("itemDestroyed", () => {
                    //delete _this.components[parentname];
                    _this._myLayout.updateSize();
                });
            }
            this._add(parent, component, title);
        }
        add(component, title, name = undefined) {
            var parent = this.components["center"];
            if (parent === undefined)
                parent = this.components["center"] = this._findDeep(this._myLayout.root, "center");
            return this._add(parent, component, title, name);
        }
        /**
         * add a window to the main area
         * @param {dom|jassijs.ui.Component} component - the component to add
         * @param {string} title - the title
         * @param {string} [id] - the name (id) - =title if undefined
         */
        _add(parent, component, title, name = undefined) {
            var _this = this;
            if (component.dom !== undefined)
                component = component.dom;
            if (name === undefined)
                name = title;
            if (this.components[name] !== undefined)
                name = name + this._counter++;
            var config = {
                title: title,
                type: 'component',
                componentName: name,
                componentState: { title: title, name: name, component: component }
            };
            this._myLayout.registerComponent(name, function (container, state) {
                var v = container.getElement();
                state.component._container = container;
                var z = v[0].appendChild(state.component); //html( '<h2>' + state.text + '</h2>');
                _this.onclose(state.component, function (data) {
                    if (data.config.componentState.component._this !== undefined)
                        data.config.componentState.component._this.destroy();
                    delete data.config.componentState.component._container;
                    delete data.config.componentState.component;
                    //memory leak golden layout
                    // container.tab._dragListener._oDocument.unbind('mouseup touchend', container.tab._dragListener._fUp);
                    /*  container.tab.element.remove();
                      var myNode =container.tab.element[0];
                      while (myNode.firstChild) {
                          myNode.removeChild(myNode.firstChild);
                      }*/
                    // container.tab.header.activeContentItem = undefined;
                    delete _this._myLayout._components[name];
                    delete _this.components[name];
                    _this.saveWindows();
                });
                var test = _this.components[name];
            });
            parent.addChild(config);
            for (var x = 0; x < parent.contentItems.length; x++) {
                if (parent.contentItems[x].config.name === name || parent.contentItems[x].config.componentName === name) {
                    this.components[name] = parent.contentItems[x];
                    //activate
                    var _this = this;
                    setTimeout(function () {
                        _this.show(name);
                        _this.saveWindows();
                    }, 10);
                    //this.components[name].parent.header.parent.setActiveContentItem(this.components[name]);
                }
            }
            var j = 9;
        }
        test() {
            var name = "oo";
            var title = "oo";
            var config = {
                title: title,
                type: 'component',
                componentName: name,
                componentState: { title: title, name: name }
            };
            var tt = Component_2.Component.createHTMLElement("<Button>");
            var _this = this;
            this._myLayout.registerComponent(name, function (container, componentState) {
                // var v=container.getElement();
                container.on("destroy", function (data) {
                    var hh = container.tab;
                    hh._dragListener._oDocument.unbind('mouseup touchend', hh._dragListener._fUp);
                    delete _this._myLayout._components[name];
                });
            });
            var center = this.components["center"];
            if (center === undefined)
                center = this.components["center"] = this._findDeep(this._myLayout.root, "center");
            center.addChild(config);
        }
        /**
         * gets the url for the given component
         * @param {jassijs.ui.component} comp - the component to read
         */
        getUrlFromComponent(comp) {
            var props = ComponentDescriptor_2.ComponentDescriptor.describe(comp.constructor).fields;
            var urltags = [];
            for (var p = 0; p < props.length; p++) {
                if (props[p].isUrlTag) {
                    urltags.push(props[p]);
                }
            }
            var url = "#do=" + Classes_4.classes.getClassName(comp);
            for (var x = 0; x < urltags.length; x++) {
                url = url + "&" + urltags[x].name + "=" + comp[urltags[x].name];
            }
            return url;
            return "";
        }
        restoreWindows() {
            var save = Cookies_1.Cookies.get('openedwindows');
            if (save === undefined || save === "")
                return;
            var all = save.split(",");
            new Promise((resolve_3, reject_3) => { require(["./Router"], resolve_3, reject_3); }).then(__importStar).then(function (router) {
                for (var x = 0; x < all.length; x++) {
                    router.router.navigate(all[x]);
                }
            });
        }
        /*
         * writes all opened components to cookie
         */
        saveWindows() {
            var all = [];
            for (var key in this.components) {
                var comp = this.findComponent(key); //this.components[key].container._config.componentState.component;
                if (comp !== undefined && this._noRestore.indexOf(key) === -1) {
                    // comp=comp._this;
                    if (comp !== undefined) {
                        var url = this.getUrlFromComponent(comp);
                        all.push(url);
                    }
                }
            }
            var s = "";
            for (var x = 0; x < all.length; x++) {
                s = s + (s === "" ? "" : ",") + all[x];
            }
            Cookies_1.Cookies.set('openedwindows', s, { expires: 30 });
        }
        /**
         * fired if component is closing
         * @param {dom|jassijs.UI.Component} component - the component to register this event
         * @param {function} func
         */
        onclose(component, func) {
            if (component.dom !== undefined)
                component = component.dom;
            component._container.on("destroy", function (data) {
                func(data);
            });
        }
    };
    exports.Windows = Windows;
    exports.Windows = Windows = __decorate([
        (0, Registry_8.$Class)("jassijs.base.Windows"),
        __metadata("design:paramtypes", [])
    ], Windows);
    var windows = new Windows();
    windows = windows;
    exports.default = windows;
});
//   myRequire("lib/goldenlayout.js",function(){
//  jassijs.windows._init();
//  });
//return Component.constructor;
//Hack for jquery.fancytree.dnd
define("jquery-ui/ui/widgets/draggable", function () {
    return jQuery.ui;
});
define("jquery-ui/ui/widgets/droppable", function () {
    return jQuery.ui;
});
//END Hack
define("jassijs/ext/fancytree", ["jassijs/remote/Jassi", "jquery.fancytree", 'jquery.fancytree.filter', 'jquery.fancytree.multi', 'jquery.fancytree.dnd', "jassijs/modul"], function () {
    //jassijs.myRequire("lib/skin-win8/ui.fancytree.min.css");
    //'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
    var path = require('jassijs/modul').default.require.paths["jquery.fancytree"];
    path = path.substring(0, path.lastIndexOf("/"));
    jassijs.myRequire(path + "/skin-win8/ui.fancytree.css");
    return { default: "" };
});
define("jassijs/ext/goldenlayout", ["require", "exports", "goldenlayout"], function (require, exports, goldenlayout) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="goldenlayout" name="goldenlayout"/>
    jassijs.includeCSSFile("goldenlayout-base.css");
    jassijs.includeCSSFile("goldenlayout-light-theme.css");
    exports.default = goldenlayout;
});
//polyfill for old ios
var def = [];
if (window.IntersectionObserver === undefined) {
    def = ["intersection-observer"];
}
define("jassijs/ext/intersection-observer", def, function () {
    return {};
});
define("jassijs/ext/jquerylib", ["require", "exports", "jquery", "jquery.ui", "jquery.ui.touch"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jassijs.includeCSSFile("jquery-ui.css");
    define("../widgets/datepicker", [], function () {
        return $.datepicker;
    });
    requirejs(['jquery.language'], function () {
        $.datepicker.setDefaults($.datepicker.regional[navigator.language.split("-")[0]]);
    });
});
define("jassijs/ext/js-cookie", ['js-cookie'], function (cookie) {
    return {
        default: cookie
    };
});
define("jassijs/ext/papaparse", ["require", "exports", "papaparse"], function (require, exports, Papa) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="papaparse" name="Papa"/>
    exports.default = Papa;
});
//dummy for sourcemap 
define("fs", [], function () {
    return undefined;
});
define("path", [], function () {
    return undefined;
});
define("jassijs/ext/sourcemap", ["source.map", "exports"], function (sm, exp) {
    exp = 1;
    // requirejs.undef("fs");
    // requirejs.undef("path");
    return {
        sourceMap: sm
    };
});
define("jassijs/ext/spectrum", ["require", "exports", "spectrum", "jassijs/modul"], function (require, exports, spectrum, modul_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    modul_1 = __importDefault(modul_1);
    //'spectrum':'//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min'
    var path = modul_1.default.require.paths["spectrum"];
    //path=path.substring(0,path.lastIndexOf("/"));
    jassijs.myRequire(path + ".css");
});
define("tabulator-tables", ["require", "exports", "tabulatorlib", "jassijs/modul"], function (require, exports, tabulator, modul_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tabulator = void 0;
    modul_2 = __importDefault(modul_2);
    var Tabulator = tabulator;
    exports.Tabulator = Tabulator;
    var path = modul_2.default.require.paths["tabulatorlib"];
    jassijs.myRequire(path.replace("/js/", "/css/") + ".css");
});
define("jassijs/ext/tinymce", ["require", "exports", "tinymcelib"], function (require, exports, tinymce) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="tinymcelib" name="tinymce"/>
    ////GEHT NICHT 
    ////use requirejs(["https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min.js"],function(tinymcelib){
    //var path = require('jassijs/modul').default.require.paths["tinymcelib"];
    //path=path.substring(0,path.lastIndexOf("/"));
    //var path="//cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min";
    const tinymceBind = window["tinymce"].DOM.bind;
    window["tinymce"].DOM.bind = (target, name, func, scope) => {
        // TODO This is only necessary until https://github.com/tinymce/tinymce/issues/4355 is fixed
        if (name === 'mouseup' && func.toString().includes('throttle()')) {
            return func;
        }
        else {
            return tinymceBind(target, name, func, scope);
        }
    };
    exports.default = tinymce;
});
define("jassijs/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var jquery_language = 'https://cdn.jsdelivr.net/gh/jquery/jquery-ui@main/ui/i18n/datepicker-' + navigator.language.split("-")[0];
    var tinyurl = "//cdnjs.cloudflare.com/ajax/libs/tinymce/5.9.2";
    exports.default = {
        "css": {
            "jassijs.css": "jassijs.css",
            "materialdesignicons.min.css": "https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css",
            "jquery-ui.css": "https:///cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css",
            "chosen.css": 'https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.css',
            "goldenlayout-base.css": "https://cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-base.css",
            "goldenlayout-light-theme.css": "https://cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-light-theme.css",
            "contextMenu.css": 'https://rawgit.com/s-yadav/contextMenu.js/master/contextMenu.css'
        },
        "types": {
            "node_modules/jquery/JQuery.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/JQuery.d.ts",
            "node_modules/jquery/JQueryStatic.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/JQueryStatic.d.ts",
            "node_modules/jquery/legacy.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/legacy.d.ts",
            "node_modules/jquery/misc.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/misc.d.ts",
            "node_modules/jqueryui/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/jqueryui/index.d.ts",
            "node_modules/chosen-js/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/chosen-js/index.d.ts",
            "node_modules/jquery.fancytree/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery.fancytree/index.d.ts",
            "node_modules/requirejs/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/requirejs/index.d.ts",
            "node_modules/sizzle/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/sizzle/index.d.ts",
            "tabulator-tables.ts": "https://cdn.jsdelivr.net/npm/@types/tabulator-tables@5.1.4/index.d.ts"
        },
        "require": {
            "shim": {
                //'tabulator-tables': ['tabulatorext'],
                'goldenlayout': ["jquery"],
                "jquery.choosen": ["jquery"],
                "jquery.contextMenu": ["jquery.ui"],
                'jquery.fancytree': ["jquery", "jquery.ui"],
                'jquery.fancytree.dnd': ["jquery", "jquery.ui"],
                'jquery.ui': ["jquery"],
                'jquery.notify': ["jquery"],
                'jquery.ui.touch': ["jquery", "jquery.ui"],
                //            'jquery.doubletap': ["jquery"],
                //  'jassijs/jassi': ['jquery', 'jquery.ui', /*'jquery.ui.touch'*/],
                "spectrum": ["jquery"]
            },
            "paths": {
                'intersection-observer': '//cdn.jsdelivr.net/npm/intersection-observer@0.7.0/intersection-observer.js',
                'goldenlayout': '//cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/goldenlayout',
                'jquery.choosen': '//cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery',
                'jquery.contextMenu': '//rawgit.com/s-yadav/contextMenu.js/master/contextMenu',
                'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
                "jquery.fancytree.ui-deps": '//cdn.jsdelivr.net/npm/jquery.fancytree@2.38.2/dist/modules/jquery.fancytree.ui-deps',
                'jquery.fancytree.filter': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.38.2/dist/modules/jquery.fancytree.filter',
                'jquery.fancytree.multi': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.38.2/dist/modules/jquery.fancytree.multi',
                'jquery.fancytree.dnd': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.dnd',
                'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery',
                'jquery.ui': '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui',
                'jquery.ui.touch': '//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min',
                //use dblcklick 'jquery.doubletap': '//cdnjs.cloudflare.com/ajax/libs/jquery-touch-events/2.0.3/jquery.mobile-events.min',
                'jquery.notify': '//cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min',
                'jquery.language': jquery_language,
                'js-cookie': '//cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min',
                'lodash': '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
                "luxon": "//cdnjs.cloudflare.com/ajax/libs/luxon/3.0.1/luxon.min",
                'papaparse': '//cdnjs.cloudflare.com/ajax/libs/PapaParse/4.6.3/papaparse.min',
                'source.map': "https://unpkg.com/source-map@0.7.3/dist/source-map",
                'spectrum': '//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min',
                'splitlib': '//cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min',
                //'tabulatorlib': '//unpkg.com/tabulator-tables@5.2.7/dist/js/tabulator',
                'tabulatorlib': '//cdnjs.cloudflare.com/ajax/libs/tabulator/5.4.4/js/tabulator.min',
                'tinymcelib': tinyurl + '/tinymce.min', //also define in tinymce.js
                'tabulator-tables': "jassijs/ext/tabulator",
                //"tabulatorext":'jassijs/ext/tabulator',
                // 'tinymcelib': '//cdnjs.cloudflare.com/ajax/libs/tinymce/6.0.3/tinymce.min'//also define in tinymce.js
                "reflect-metadata": "https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect"
            }
        },
        server: {
            "require": {
                "shim": {},
                "paths": {
                    'js-cookie': '//cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min',
                    "reflect-metadata": "https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect",
                    //localserver
                    "jszip": "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip",
                    "js-sql-parser": "https://cdn.jsdelivr.net/npm/js-sql-parser@1.4.1/dist/parser/sqlParser.min",
                    "typeorm": "jassijs/server/ext/typeorm",
                    "typeormbrowser": "https://uwei.github.io/jassijs/dist/typeorm/typeormbrowser",
                    "window.SQL": "https://sql.js.org/dist/sql-wasm",
                    //"jassijs/util/DatabaseSchema": "jassijs/server/DatabaseSchema"
                }
            },
            "loadbeforestart": ["js-sql-parser", "typeormbrowser", "jassijs/server/Installserver"],
        }
        //localserver
    };
    window["tinyMCEPreInit"] = {
        suffix: '.min',
        base: tinyurl,
        //base: "//cdnjs.cloudflare.com/ajax/libs/tinymce/6.0.3",
        query: ''
    };
});
//this file is autogenerated don't modify
define("jassijs/registry", ["require"], function (require) {
    return {
        default: {
            "jassijs/base/ActionNode.ts": {
                "date": 1655556796000,
                "jassijs.base.ActionNode": {}
            },
            "jassijs/base/Actions.ts": {
                "date": 1681570168000,
                "jassijs.base.Actions": {}
            },
            "jassijs/base/CurrentSettings.ts": {
                "date": 1655740040000
            },
            "jassijs/base/Errors.ts": {
                "date": 1720116065571.527
            },
            "jassijs/base/Extensions.ts": {
                "date": 1655549184000
            },
            "jassijs/base/LoginDialog.ts": {
                "date": 1683051936000
            },
            "jassijs/base/PropertyEditorService.ts": {
                "date": 1721676432668.211,
                "jassijs.base.PropertyEditorService": {}
            },
            "jassijs/base/Router.ts": {
                "date": 1655556796000,
                "jassijs.base.Router": {}
            },
            "jassijs/base/Windows.ts": {
                "date": 1720115647321.4683,
                "jassijs.base.Windows": {}
            },
            "jassijs/ext/goldenlayout.ts": {
                "date": 1657655070000
            },
            "jassijs/ext/jquerylib.ts": {
                "date": 1657655350000
            },
            "jassijs/ext/papaparse.ts": {
                "date": 1657656072000
            },
            "jassijs/ext/spectrum.ts": {
                "date": 1657656778000
            },
            "jassijs/ext/tabulator.ts": {
                "date": 1683657412000
            },
            "jassijs/ext/tinymce.ts": {
                "date": 1657658562000
            },
            "jassijs/modul.ts": {
                "date": 1683648574000
            },
            "jassijs/remote/Classes.ts": {
                "date": 1686759604000,
                "jassijs.remote.JassiError": {},
                "jassijs.remote.Classes": {}
            },
            "jassijs/remote/ClientError.ts": {
                "date": 1655556930000,
                "jassijs.remote.ClientError": {}
            },
            "jassijs/remote/Config.ts": {
                "date": 1719331708682.118
            },
            "jassijs/remote/Database.ts": {
                "date": 1655556796000,
                "jassijs.remote.Database": {}
            },
            "jassijs/remote/DatabaseTools.ts": {
                "date": 1681309882000,
                "jassijs.remote.DatabaseTools": {
                    "@members": {
                        "runSQL": {
                            "ValidateFunctionParameter": []
                        }
                    }
                }
            },
            "jassijs/remote/DBArray.ts": {
                "date": 1655556796000,
                "jassijs.remote.DBArray": {}
            },
            "jassijs/remote/DBObject.ts": {
                "date": 1697209147073.5745,
                "jassijs.remote.DBObject": {}
            },
            "jassijs/remote/DBObjectQuery.ts": {
                "date": 1623876714000
            },
            "jassijs/remote/Extensions.ts": {
                "date": 1626209336000
            },
            "jassijs/remote/FileNode.ts": {
                "date": 1655556796000,
                "jassijs.remote.FileNode": {}
            },
            "jassijs/remote/hallo.ts": {
                "date": 1622985410000
            },
            "jassijs/remote/Jassi.ts": {
                "date": 1697209123749.7214
            },
            "jassijs/remote/jassijsGlobal.ts": {
                "date": 1655549782000
            },
            "jassijs/remote/Modules.ts": {
                "date": 1682799476000
            },
            "jassijs/remote/ObjectTransaction.ts": {
                "date": 1622985414000
            },
            "jassijs/remote/Registry.ts": {
                "date": 1721754483315.839
            },
            "jassijs/remote/RemoteObject.ts": {
                "date": 1655556866000,
                "jassijs.remote.RemoteObject": {}
            },
            "jassijs/remote/RemoteProtocol.ts": {
                "date": 1655556796000,
                "jassijs.remote.RemoteProtocol": {}
            },
            "jassijs/remote/security/Group.ts": {
                "date": 1682888736000,
                "jassijs.security.Group": {
                    "$DBObject": [
                        {
                            "name": "jassijs_group"
                        }
                    ],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "name": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "parentRights": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "JoinTable": [],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        },
                        "rights": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "JoinTable": [],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        },
                        "users": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "jassijs/remote/security/ParentRight.ts": {
                "date": 1681581398000,
                "jassijs.security.ParentRight": {
                    "$DBObject": [
                        {
                            "name": "jassijs_parentright"
                        }
                    ],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryGeneratedColumn": []
                        },
                        "name": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "classname": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "i1": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "i2": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "s1": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "s2": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "groups": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "jassijs/remote/security/Right.ts": {
                "date": 1681322768000,
                "jassijs.security.Right": {
                    "$DBObject": [
                        {
                            "name": "jassijs_right"
                        }
                    ],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "name": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "groups": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "jassijs/remote/security/Rights.ts": {
                "date": 1655556796000,
                "jassijs.security.Rights": {}
            },
            "jassijs/remote/security/Setting.ts": {
                "date": 1681316436000,
                "jassijs.security.Setting": {
                    "$DBObject": [
                        {
                            "name": "jassijs_setting"
                        }
                    ],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "data": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/remote/security/User.ts": {
                "date": 1681329604000,
                "jassijs.security.User": {
                    "$DBObject": [
                        {
                            "name": "jassijs_user"
                        }
                    ],
                    "@members": {
                        "id": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryGeneratedColumn": []
                        },
                        "email": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "password": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "select": false
                                }
                            ]
                        },
                        "groups": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "JoinTable": [],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        },
                        "isAdmin": {
                            "ValidateIsBoolean": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/remote/Server.ts": {
                "date": 1695399507170.7808,
                "jassijs.remote.Server": {
                    "@members": {
                        "dir": {
                            "ValidateFunctionParameter": []
                        },
                        "zip": {
                            "ValidateFunctionParameter": []
                        },
                        "loadFiles": {
                            "ValidateFunctionParameter": []
                        },
                        "loadFile": {
                            "ValidateFunctionParameter": []
                        },
                        "saveFiles": {
                            "ValidateFunctionParameter": []
                        },
                        "saveFile": {
                            "ValidateFunctionParameter": []
                        },
                        "testServersideFile": {
                            "ValidateFunctionParameter": []
                        },
                        "removeServerModul": {
                            "ValidateFunctionParameter": []
                        },
                        "delete": {
                            "ValidateFunctionParameter": []
                        },
                        "rename": {
                            "ValidateFunctionParameter": []
                        },
                        "createFile": {
                            "ValidateFunctionParameter": []
                        },
                        "createFolder": {
                            "ValidateFunctionParameter": []
                        },
                        "createModule": {
                            "ValidateFunctionParameter": []
                        }
                    }
                }
            },
            "jassijs/remote/Serverservice.ts": {
                "date": 1695999826188.6174
            },
            "jassijs/remote/Settings.ts": {
                "date": 1681315776000,
                "jassijs.remote.Settings": {
                    "@members": {
                        "remove": {
                            "ValidateFunctionParameter": []
                        },
                        "save": {
                            "ValidateFunctionParameter": []
                        },
                        "saveAll": {
                            "ValidateFunctionParameter": []
                        }
                    }
                }
            },
            "jassijs/remote/Test.ts": {
                "date": 1655556930000,
                "jassijs.remote.Test": {}
            },
            "jassijs/remote/Transaction.ts": {
                "date": 1655556866000,
                "jassijs.remote.Transaction": {}
            },
            "jassijs/remote/Validator.ts": {
                "date": 1681322648000
            },
            "jassijs/security/GroupView.ts": {
                "date": 1722608022347.401,
                "jassijs/security/GroupView": {
                    "$DBObjectView": [
                        {
                            "classname": "jassijs.security.Group",
                            "icon": "mdi mdi-account-group",
                            "actionname": "Administration/Security/Groups"
                        }
                    ]
                }
            },
            "jassijs/security/UserView.ts": {
                "date": 1722610068691.7795,
                "jassijs/security/UserView": {
                    "$DBObjectView": [
                        {
                            "classname": "jassijs.security.User",
                            "actionname": "Administration/Security/Users",
                            "icon": "mdi mdi-account-key-outline",
                            "queryname": "findWithRelations"
                        }
                    ]
                }
            },
            "jassijs/server/Compile.ts": {
                "date": 1720553680038.0745
            },
            "jassijs/server/DatabaseSchema.ts": {
                "date": 1682241710000
            },
            "jassijs/server/DBManager.ts": {
                "date": 1697213352571.0527,
                "jassijs/server/DBManager": {
                    "$Serverservice": [
                        {
                            "name": "db",
                            "getInstance": "function"
                        }
                    ]
                }
            },
            "jassijs/server/DBManagerExt.ts": {
                "date": 1683399518000
            },
            "jassijs/server/DoRemoteProtocol.ts": {
                "date": 1686853328000
            },
            "jassijs/server/ext/EmpyDeclaration.ts": {
                "date": 1682275348000
            },
            "jassijs/server/ext/jszip.ts": {
                "date": 1657714030000
            },
            "jassijs/server/Filesystem.ts": {
                "date": 1719332352671.4578,
                "jassijs.server.Filesystem": {
                    "$Serverservice": [
                        {
                            "name": "filesystem",
                            "getInstance": "function"
                        }
                    ]
                }
            },
            "jassijs/server/FS.ts": {
                "date": 1684358274000
            },
            "jassijs/server/Indexer.ts": {
                "date": 1722612829860.7268
            },
            "jassijs/server/Installserver.ts": {
                "date": 1719314261039.9204
            },
            "jassijs/server/LocalFS.ts": {
                "date": 1697206634326.1233
            },
            "jassijs/server/LocalProtocol.ts": {
                "date": 1686757420000
            },
            "jassijs/server/NativeAdapter.ts": {
                "date": 1686927798000
            },
            "jassijs/server/RegistryIndexer.ts": {
                "date": 1682799792000
            },
            "jassijs/server/Reloader.ts": {
                "date": 1697206596099.5015,
                "jassijs.server.Reloader": {}
            },
            "jassijs/server/Testuser.ts": {
                "date": 1655556794000,
                "Testuser": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "firstname": {
                            "Column": []
                        },
                        "lastname": {
                            "Column": []
                        }
                    }
                }
            },
            "jassijs/server/TypeORMListener.ts": {
                "date": 1682885926000,
                "jassijs.server.TypeORMListener": {
                    "EventSubscriber": []
                }
            },
            "jassijs/ui/ActionNodeMenu.ts": {
                "date": 1697206579333.4006,
                "jassijs/ui/ActionNodeMenu": {}
            },
            "jassijs/ui/BoxPanel.ts": {
                "date": 1721763062471.5164,
                "jassijs.ui.BoxPanel": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/BoxPanel",
                            "icon": "mdi mdi-view-sequential-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "name": "isAbsolute",
                            "hide": true,
                            "type": "boolean"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Button.ts": {
                "date": 1720246151798.6426,
                "jassijs.ui.Button": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Button",
                            "icon": "mdi mdi-gesture-tap-button",
                            "initialize": {
                                "text": "button"
                            }
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Calendar.ts": {
                "date": 1719769978901.3284,
                "jassijs.ui.Calendar": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Calendar",
                            "icon": "mdi mdi-calendar-month"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "string"
                        }
                    ]
                }
            },
            "jassijs/ui/Checkbox.ts": {
                "date": 1720458180025.6687,
                "jassijs.ui.Checkbox": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Ceckbox",
                            "icon": "mdi mdi-checkbox-marked-outline"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Component.ts": {
                "date": 1722432039088.2495,
                "jassijs.ui.Component": {
                    "$Property": [
                        {
                            "name": "testuw",
                            "type": "string"
                        }
                    ],
                    "@members": {}
                },
                "jassijs.ui.HTMLComponent": {
                    "$Property": [
                        {
                            "name": "children",
                            "type": "jassijs.ui.Component",
                            "createDummyInDesigner": "doCreateDummyForHTMLComponent"
                        }
                    ],
                    "@members": {}
                },
                "jassijs.ui.TextComponent": {
                    "@members": {}
                }
            },
            "jassijs/ui/ComponentDescriptor.ts": {
                "date": 1721651327481.3347,
                "jassijs.ui.ComponentDescriptor": {}
            },
            "jassijs/ui/Container.ts": {
                "date": 1721763066839.484,
                "jassijs.ui.Container": {
                    "$Property": [
                        {
                            "name": "children",
                            "type": "jassijs.ui.Component"
                        }
                    ]
                }
            },
            "jassijs/ui/ContextMenu.ts": {
                "date": 1719778747000.2986,
                "jassijs.ui.ContextMenu": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/ContextMenu",
                            "icon": "mdi mdi-dots-vertical",
                            "editableChildComponents": [
                                "menu"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/converters/DateTimeConverter.ts": {
                "date": 1681559014000,
                "jassijs.ui.converters.DateTimeConverterProperies": {
                    "@members": {}
                },
                "jassijs.ui.converters.DateTimeConverter": {
                    "$Converter": [
                        {
                            "name": "datetime"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.converters.DateTimeConverterProperties"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/converters/DefaultConverter.ts": {
                "date": 1657922212000,
                "jassijs.ui.converters.DefaultConverterProperties": {
                    "@members": {}
                },
                "jassijs.ui.converters.DefaultConverter": {
                    "$Converter": [
                        {
                            "name": "custom"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.converters.DefaultConverterProperties"
                        }
                    ]
                }
            },
            "jassijs/ui/converters/NumberConverter.ts": {
                "date": 1658334942000,
                "jassijs.ui.converters.NumberConverterProperies": {
                    "@members": {}
                },
                "jassijs.ui.converters.NumberConverter": {
                    "$Converter": [
                        {
                            "name": "number"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.converters.NumberConverterProperies"
                        }
                    ]
                }
            },
            "jassijs/ui/converters/StringConverter.ts": {
                "date": 1657129814000,
                "jassijs.ui.converters.StringConverterProperies": {
                    "@members": {}
                },
                "jassijs.ui.converters.StringConverter": {
                    "$Converter": [
                        {
                            "name": "string"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.converters.StringConverterProperies"
                        }
                    ]
                }
            },
            "jassijs/ui/CSSProperties.ts": {
                "date": 1698507590656.5051,
                "jassijs.ui.CSSProperties": {
                    "@members": {}
                }
            },
            "jassijs/ui/DataComponent.ts": {
                "date": 1722610184187.7512,
                "jassijs.ui.DataComponent": {
                    "@members": {}
                }
            },
            "jassijs/ui/DBObjectDialog.ts": {
                "date": 1721687478072.3645,
                "jassijs.ui.DBObjectDialog": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "createActions": {
                            "$Actions": []
                        }
                    }
                }
            },
            "jassijs/ui/DBObjectExplorer.ts": {
                "date": 1655556796000,
                "jassijs.ui.DBObjectNode": {},
                "jassijs.ui.DBFileActions": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "ViewData": {
                            "$Action": [
                                {
                                    "name": "View Data",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                },
                "jassijs.ui.DBObjectActions": {
                    "$ActionProvider": [
                        "jassijs.ui.DBObjectNode"
                    ],
                    "@members": {
                        "ViewData": {
                            "$Action": [
                                {
                                    "name": "View Data"
                                }
                            ]
                        },
                        "OpenCode": {
                            "$Action": [
                                {
                                    "name": "Open Code"
                                }
                            ]
                        }
                    }
                },
                "jassijs.ui.DBObjectExplorer": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "dummy": {
                            "$Action": [
                                {
                                    "name": "Windows",
                                    "icon": "mdi mdi-iframe-array-outline"
                                }
                            ]
                        },
                        "dummy2": {
                            "$Action": [
                                {
                                    "name": "Windows/Development",
                                    "icon": "mdi mdi-dev-to"
                                }
                            ]
                        },
                        "show": {
                            "$Action": [
                                {
                                    "name": "Windows/Development/DBObjects",
                                    "icon": "mdi mdi-database-search"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/ui/DBObjectView.ts": {
                "date": 1722610210933.4746,
                "jassijs/ui/DBObjectView": {
                    "@members": {}
                }
            },
            "jassijs/ui/DockingContainer.ts": {
                "date": 1719608546166.3955,
                "jassijs.ui.DockingContainer": {}
            },
            "jassijs/ui/HTMLEditorPanel.ts": {
                "date": 1655641682000,
                "jassijs.ui.HTMLEditorPanel": {}
            },
            "jassijs/ui/InvisibleComponent.ts": {
                "date": 1719775654357.0962,
                "jassijs.ui.InvisibleComponent": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ]
                }
            },
            "jassijs/ui/Menu.ts": {
                "date": 1721762942678.6074,
                "jassijs.ui.Menu": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Menu",
                            "icon": "mdi mdi-menu",
                            "initialize": {
                                "text": "menu"
                            }
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Notify.ts": {
                "date": 1655585212000
            },
            "jassijs/ui/ObjectChooser.ts": {
                "date": 1722193753659.7104,
                "jassijs.ui.ObjectChooser": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/ObjectChooser",
                            "icon": "mdi mdi-glasses"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/OptionDialog.ts": {
                "date": 1656067784000,
                "jassijs.ui.OptionDialog": {
                    "@members": {}
                },
                "jassijs.ui.OptionDialogTestProp": {
                    "@members": {}
                }
            },
            "jassijs/ui/Panel.ts": {
                "date": 1722600511317.7644,
                "jassijs.ui.Panel": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Panel",
                            "icon": "mdi mdi-checkbox-blank-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.PanelProperties"
                        },
                        {
                            "name": "new/useSpan",
                            "type": "boolean",
                            "default": false
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Property.ts": {
                "date": 1722004167335.1917,
                "jassijs.ui.Property": {}
            },
            "jassijs/ui/PropertyEditors/BooleanEditor.ts": {
                "date": 1655556866000,
                "jassijs.ui.PropertyEditors.BooleanEditor": {
                    "$PropertyEditor": [
                        [
                            "boolean"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/ClassSelectorEditor.ts": {
                "date": 1657571442000,
                "jassijs.ui.PropertyEditors.ClassSelectorEditor": {
                    "$PropertyEditor": [
                        [
                            "classselector"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/ColorEditor.ts": {
                "date": 1656017118000,
                "jassijs.ui.PropertyEditors.ColorEditor": {
                    "$PropertyEditor": [
                        [
                            "color"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/ComponentEditor.ts": {
                "date": 1696713045170.9973,
                "jassijs.ui.PropertyEditors.ComponentEditor": {
                    "$PropertyEditor": [
                        [
                            "jassijs.ui.Component"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/ComponentSelectorEditor.ts": {
                "date": 1655556796000,
                "jassijs.ui.PropertyEditors.ComponentSelectorEditor": {
                    "$PropertyEditor": [
                        [
                            "componentselector"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/DatabinderEditor.ts": {
                "date": 1722589839416.9033,
                "jassijs.ui.PropertyEditors.DatabinderEditor": {
                    "$PropertyEditor": [
                        [
                            "databinder"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/DBObjectEditor.ts": {
                "date": 1721680313435.5005,
                "jassijs.ui.PropertyEditors.DBObjectEditor": {
                    "$PropertyEditor": [
                        [
                            "dbobject"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/DefaultEditor.ts": {
                "date": 1697402486773.8264,
                "jassijs.ui.PropertyEditors.DefaultEditor": {
                    "$PropertyEditor": [
                        [
                            "string",
                            "number",
                            "number[]",
                            "boolean[]"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/Editor.ts": {
                "date": 1655556796000,
                "jassijs.ui.PropertyEditors.Editor": {}
            },
            "jassijs/ui/PropertyEditors/FontEditor.ts": {
                "date": 1655556866000,
                "jassijs.ui.PropertyEditors.FontEditor": {
                    "$PropertyEditor": [
                        [
                            "font"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/FunctionEditor.ts": {
                "date": 1655556866000,
                "jassijs.ui.PropertyEditors.FunctionEditor": {
                    "$PropertyEditor": [
                        [
                            "function"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/HTMLEditor.ts": {
                "date": 1655556866000,
                "jassijs.ui.PropertyEditors.HTMLEditor": {
                    "$PropertyEditor": [
                        [
                            "html"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/ImageEditor.ts": {
                "date": 1656189492000,
                "jassijs.ui.PropertyEditors.ImageEditor": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "$PropertyEditor": [
                        [
                            "image"
                        ]
                    ],
                    "@members": {
                        "dummy": {
                            "$Action": [
                                {
                                    "name": "Tools",
                                    "icon": "mdi mdi-tools"
                                }
                            ]
                        },
                        "show": {
                            "$Action": [
                                {
                                    "name": "Tools/Icons",
                                    "icon": "mdi mdi-image-area"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/ui/PropertyEditors/JsonArrayEditor.ts": {
                "date": 1697199579697.335,
                "jassijs.ui.PropertyEditors.JsonArrayEditor": {
                    "$PropertyEditor": [
                        [
                            "jsonarray"
                        ]
                    ]
                },
                "jassijs.ui.JsonArrayEditor.TestProperties": {
                    "@members": {}
                },
                "jassijs.ui.JsonArrayEditor.TestProperties2": {
                    "@members": {}
                }
            },
            "jassijs/ui/PropertyEditors/JsonEditor.ts": {
                "date": 1721755050984.9895,
                "jassijs.ui.PropertyEditors.JsonEditor": {
                    "$PropertyEditor": [
                        [
                            "json"
                        ]
                    ]
                },
                "jassijs.ui.PropertyEditorTestProperties2": {
                    "@members": {}
                },
                "jassijs.ui.PropertyEditorTestProperties": {
                    "@members": {}
                }
            },
            "jassijs/ui/PropertyEditors/NameEditor.ts": {
                "date": 1721495087931.3462,
                "jassijs.ui.PropertyEditors.NameEditor": {
                    "$PropertyEditor": [
                        [
                            "*name*"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/TableColumnImport.ts": {
                "date": 1657049000000,
                "jassijs/ui/PropertyEditors/TableColumnImport": {}
            },
            "jassijs/ui/Select.ts": {
                "date": 1722606114318.6875,
                "jassijs.ui.Select": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Select",
                            "icon": "mdi mdi-form-dropdown"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.SelectProperties"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/SettingsDialog.ts": {
                "date": 1698507857246.2312,
                "jassijs.ui.SettingsObject": {},
                "jassijs.ui.SettingsDialog": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "show": {
                            "$Action": [
                                {
                                    "name": "Settings",
                                    "icon": "mdi mdi-settings-helper"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/ui/Style.ts": {
                "date": 1719755851416.894,
                "jassijs.ui.Style": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Style",
                            "icon": "mdi mdi-virus"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Table.ts": {
                "date": 1721754550199.457,
                "jassijs.ui.TableEditorProperties": {
                    "@members": {}
                },
                "jassijs.ui.Table": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Table",
                            "icon": "mdi mdi-grid"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.TableEditorProperties"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Textarea.ts": {
                "date": 1719770473688.5388,
                "jassijs.ui.Textarea": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Textarea",
                            "icon": "mdi mdi-text-box-outline"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "string"
                        }
                    ]
                }
            },
            "jassijs/ui/Textbox.ts": {
                "date": 1722607447334.1543,
                "jassijs.ui.Textbox": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Textbox",
                            "icon": "mdi mdi-form-textbox"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Tree.ts": {
                "date": 1719768890018.7583,
                "jassijs.ui.TreeEditorPropertiesMulti": {
                    "@members": {}
                },
                "jassijs.ui.TreeEditorProperties": {
                    "@members": {}
                },
                "jassijs.ui.Tree": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Tree",
                            "icon": "mdi mdi-file-tree"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.TreeEditorProperties"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Upload.ts": {
                "date": 1719770567272.5264,
                "jassijs.ui.Upload": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Upload",
                            "icon": "mdi mdi-cloud-upload-outline"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/VariablePanel.ts": {
                "date": 1721762514604.182,
                "jassijs.ui.VariablePanel": {}
            },
            "jassijs/util/Cookies.ts": {
                "date": 1720099914948.8174
            },
            "jassijs/util/CSVImport.ts": {
                "date": 1697199596581.038,
                "jassijs.util.CSVImport": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Database CSV-Import",
                                    "icon": "mdi mdi-database-import"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/util/DatabaseSchema.ts": {
                "date": 1622984214000
            },
            "jassijs/util/Numberformatter.ts": {
                "date": 1657046808000,
                "jassijs.util.Numberformatter": {}
            },
            "jassijs/util/Reloader.ts": {
                "date": 1697201960827.66,
                "jassijs.util.Reloader": {}
            },
            "jassijs/util/Runlater.ts": {
                "date": 1655556796000,
                "jassi.util.Runlater": {}
            },
            "jassijs/util/Tools.ts": {
                "date": 1657655420000,
                "jassijs.util.Tools": {}
            },
            "jassijs/ui/State.ts": {
                "date": 1722584965641.039
            },
            "jassijs/ui/StateBinder.ts": {
                "date": 1722607242193.9792
            },
            "jassijs/ui/Repeater2.ts": {
                "date": 1722280627736.2734,
                "jassijs.ui.Repeater2": {
                    "@members": {}
                }
            },
            "jassijs/ui/HTMLPanel.tsx": {
                "date": 1722193753694.9727,
                "jassijs.ui.HTMLPanel": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/HTMLPanel",
                            "icon": "mdi mdi-cloud-tags"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Image.tsx": {
                "date": 1719770180674.2976,
                "jassijs.ui.Image": {
                    "$UIComponent": [
                        {
                            "fullPath": "default/Image",
                            "icon": "mdi mdi-file-image"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/MenuItem.tsx": {
                "date": 1721754305868.5278,
                "jassijs.ui.MenuItem": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/MenuItem",
                            "icon": "mdi mdi-menu-open",
                            "initialize": {
                                "text": "menu"
                            },
                            "editableChildComponents": [
                                "items"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/PropertyEditor.tsx": {
                "date": 1721754309694.6438,
                "jassijs.ui.PropertyEditor": {},
                "jassijs.ui.PropertyEditorTestSubProperties": {
                    "@members": {}
                },
                "jassijs.ui.PropertyEditorTestProperties": {
                    "@members": {}
                }
            },
            "jassijs/ui/TinymcePanel.ts": {
                "date": 1721805715426.5576,
                "jassijs.ui.TinymcePanel": {
                    "@members": {}
                }
            }
        }
    };
});
define("jassijs/remote/Classes", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.classes = exports.Classes = exports.JassiError = void 0;
    exports.test = test;
    Registry_9 = __importDefault(Registry_9);
    let JassiError = class JassiError extends Error {
        constructor(msg) {
            super(msg);
        }
    };
    exports.JassiError = JassiError;
    exports.JassiError = JassiError = __decorate([
        $Class("jassijs.remote.JassiError"),
        __metadata("design:paramtypes", [String])
    ], JassiError);
    function $Class(longclassname) {
        return function (pclass) {
            Registry_9.default.register("$Class", pclass, longclassname);
        };
    }
    /**
    * manage all registered classes ->jassijs.register("classes")
    * @class jassijs.base.Classes
    */
    let Classes = class Classes {
        constructor() {
            this._cache = {};
            this.funcRegister = Registry_9.default.onregister("$Class", this.register.bind(this));
        }
        destroy() {
            Registry_9.default.offregister("$Class", this.funcRegister);
        }
        /**
         * load the a class
         * @param classname - the class to load
         */
        async loadClass(classname) {
            var config = (await new Promise((resolve_4, reject_4) => { require(["./Config"], resolve_4, reject_4); }).then(__importStar)).config;
            var cl = await Registry_9.default.getJSONData("$Class", classname);
            if (cl === undefined) {
                try {
                    //@ts-ignore
                    if (require.main) { //nodes load project class from module
                        //@ts-ignore 
                        await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                    }
                    else {
                        await new Promise((resolve_5, reject_5) => { require([classname.replaceAll(".", "/")], resolve_5, reject_5); }).then(__importStar);
                    }
                }
                catch (err) {
                    err = err;
                }
            }
            else {
                if (cl === undefined || cl.length === 0) {
                    throw new JassiError("Class not found:" + classname);
                }
                var file = cl[0].filename;
                //@ts-ignore
                if (window.document === undefined) {
                    var pack = file.split("/");
                    if (pack.length < 2 || pack[1] === "server") {
                        // throw new JassiError("Server classes could not be loaded: " + classname );
                    }
                }
                //@ts-ignore
                if (require.main) { //nodes load project class from module
                    //@ts-ignore
                    var imp = await Promise.resolve().then(() => require.main.require(file.replace(".ts", "")));
                }
                else {
                    var imp = await new Promise((resolve_6, reject_6) => { require([file.replace(".ts", "")], resolve_6, reject_6); }).then(__importStar);
                }
            }
            return this.getClass(classname);
        }
        /**
        * get the class of the given classname
        * @param {string} - the classname
        * @returns {class} - the class
        */
        getClass(classname) {
            return this._cache[classname];
            /* var ret=this.getPackage(classname);
             
             if(ret!==undefined&&ret.prototype!==undefined && ret.prototype.constructor === ret)
                 return ret;
             else
                 return undefined; */
        }
        /**
        * get the name of the given class
        * @param {class} _class - the class (prototype)
        * @returns {string} name of the class
        */
        getClassName(_class) {
            var _a, _b, _c, _d, _e, _f;
            if (_class === undefined)
                return undefined;
            if ((_a = _class.constructor) === null || _a === void 0 ? void 0 : _a._classname)
                return (_b = _class.constructor) === null || _b === void 0 ? void 0 : _b._classname;
            if ((_d = (_c = _class.prototype) === null || _c === void 0 ? void 0 : _c.constructor) === null || _d === void 0 ? void 0 : _d._classname)
                return (_f = (_e = _class.prototype) === null || _e === void 0 ? void 0 : _e.constructor) === null || _f === void 0 ? void 0 : _f._classname;
            return undefined;
        }
        register(data, name) {
            //data.prototype._classname=name;
            this._cache[name] = data;
        }
    };
    exports.Classes = Classes;
    exports.Classes = Classes = __decorate([
        $Class("jassijs.remote.Classes"),
        __metadata("design:paramtypes", [])
    ], Classes);
    ;
    let classes = new Classes();
    exports.classes = classes;
    async function test(t) {
        var cl = classes.getClass("jassijs.ui.Button");
        t.expectEqual(cl === await classes.loadClass("jassijs.ui.Button"));
        t.expectEqual(classes.getClassName(cl) === "jassijs.ui.Button");
    }
});
define("jassijs/remote/ClientError", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClientError = void 0;
    let ClientError = class ClientError extends Error {
        constructor(msg) {
            super(msg);
        }
    };
    exports.ClientError = ClientError;
    exports.ClientError = ClientError = __decorate([
        (0, Registry_10.$Class)("jassijs.remote.ClientError"),
        __metadata("design:paramtypes", [String])
    ], ClientError);
});
define("jassijs/remote/Config", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.config = exports.Config = void 0;
    class Config {
        constructor() {
            this.name = './client/jassijs.json';
            if (!window.document) {
                this.isServer = true;
                //@ts-ignore
                var fs = require("fs");
                this.init(fs.readFileSync(this.name, 'utf-8'));
            }
        }
        init(configtext, name = undefined) {
            if (name !== undefined)
                this.name = name;
            this.jsonData = JSON.parse(configtext);
            this.modules = this.jsonData.modules;
            this.server = {
                modules: this.jsonData.server.modules
            };
        }
        async reload() {
            if (!window.document) {
                this.isServer = true;
                //@ts-ignore
                var fs = require("fs");
                this.init(fs.readFileSync(this.name, 'utf-8'));
            }
            else {
                var Server = (await new Promise((resolve_7, reject_7) => { require(["jassijs/remote/Server"], resolve_7, reject_7); }).then(__importStar)).Server;
                var text = await new Server().loadFile("jassijs.json");
                this.init(text);
            }
        }
        async saveJSON() {
            var myfs = (await new Promise((resolve_8, reject_8) => { require(["jassijs/server/NativeAdapter"], resolve_8, reject_8); }).then(__importStar)).myfs;
            var fname = this.name;
            await myfs.writeFile(fname, JSON.stringify(this.jsonData, undefined, "\t"));
            this.init(await myfs.readFile(fname));
        }
    }
    exports.Config = Config;
    var config = new Config();
    exports.config = config;
});
define("jassijs/remote/Database", ["require", "exports", "jassijs/remote/Registry", "./Classes"], function (require, exports, Registry_11, Classes_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.db = exports.Database = exports.TypeDef = void 0;
    class TypeDef {
        constructor() {
            this.fields = {};
        }
        getRelation(fieldname) {
            var ret = undefined;
            var test = this.fields[fieldname];
            for (let key in test) {
                if (key === "OneToOne" || key === "OneToMany" || key === "ManyToOne" || key === "ManyToMany") {
                    return { type: key, oclass: test[key][0]() };
                }
            }
            return ret;
        }
    }
    exports.TypeDef = TypeDef;
    let Database = class Database {
        constructor() {
            this.typeDef = new Map();
            this.decoratorCalls = new Map();
            ;
        }
        removeOld(oclass) {
            var name = Classes_5.classes.getClassName(oclass);
            this.typeDef.forEach((value, key) => {
                var testname = Classes_5.classes.getClassName(key);
                if (testname === name && key !== oclass)
                    this.typeDef.delete(key);
            });
            this.decoratorCalls.forEach((value, key) => {
                var testname = Classes_5.classes.getClassName(key);
                if (testname === name && key !== oclass) {
                    this.decoratorCalls.delete(key);
                }
            });
        }
        _setMetadata(constructor, field, decoratername, fieldprops, decoraterprops, delegate) {
            var def = this.typeDef.get(constructor);
            if (def === undefined) {
                def = new TypeDef();
                this.decoratorCalls.set(constructor, []);
                this.typeDef.set(constructor, def); //new class
            }
            if (field === "this") {
                this.removeOld(constructor);
            }
            /*if(delegate===undefined){
                debugger;
            }*/
            this.decoratorCalls.get(constructor).push([delegate, fieldprops, decoraterprops]);
            var afield = def.fields[field];
            if (def.fields[field] === undefined) {
                afield = {};
                def.fields[field] = afield;
            }
            afield[decoratername] = fieldprops;
        }
        fillDecorators() {
            this.decoratorCalls.forEach((allvalues, key) => {
                allvalues.forEach((value) => {
                    value[0](...value[1])(...value[2]);
                });
            });
        }
        getMetadata(sclass) {
            return this.typeDef.get(sclass);
        }
    };
    exports.Database = Database;
    exports.Database = Database = __decorate([
        (0, Registry_11.$Class)("jassijs.remote.Database"),
        __metadata("design:paramtypes", [])
    ], Database);
    //@ts-ignore
    var db = new Database();
    exports.db = db;
});
define("jassijs/remote/DatabaseTools", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/Classes", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, Registry_12, RemoteObject_1, Classes_6, Serverservice_1, Validator_1) {
    "use strict";
    var DatabaseTools_1;
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DatabaseTools = void 0;
    exports.test = test;
    let DatabaseTools = DatabaseTools_1 = class DatabaseTools extends RemoteObject_1.RemoteObject {
        //this is a sample remote function
        static async runSQL(sql, parameter = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.runSQL, sql, parameter, context);
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_6.JassiError("only admins can delete");
                return (await Serverservice_1.serverservices.db).runSQL(context, sql, parameter);
            }
        }
        static async dropTables(tables) {
            for (var i = 0; i < tables.length; i++) {
                if ((/[A-Z,a-z,_,0-9]+/g).exec(tables[i])[0] !== tables[i]) {
                    throw new Classes_6.JassiError(tables[i] + " is not a valid tablename");
                }
            }
            if (tables.length === 0) {
                throw new Classes_6.JassiError("no tables to drop");
            }
            return await DatabaseTools_1.runSQL("DROP TABLE " + tables.join(","));
        }
    };
    exports.DatabaseTools = DatabaseTools;
    __decorate([
        (0, Validator_1.ValidateFunctionParameter)(),
        __param(0, (0, Validator_1.ValidateIsString)()),
        __param(1, (0, Validator_1.ValidateIsArray)({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Array, typeof (_a = typeof RemoteObject_1.Context !== "undefined" && RemoteObject_1.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], DatabaseTools, "runSQL", null);
    exports.DatabaseTools = DatabaseTools = DatabaseTools_1 = __decorate([
        (0, Registry_12.$Class)("jassijs.remote.DatabaseTools")
    ], DatabaseTools);
    async function test() {
        /*  var h=await DatabaseTools.runSQL('DROP TABLE :p1,:p2',[
                              {p1:"te_person2",
                                          p2:"tg_person"}]);//,"te_person2"]);*/
        //var h=await DatabaseTools.runSQL('select * from jassijs_rights'); 
    }
});
define("jassijs/remote/DBArray", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Registry_13, Classes_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBArray = void 0;
    let cl = Classes_7.classes; //force Classes.
    let DBArray = class DBArray
    /**
    * Array for jassijs.base.DBObject's
    * can be saved to db
    * @class jassijs.base.DBArray
    */
     extends Array {
        constructor(...args) {
            super(...args);
        }
        /**
         * adds an object
         * if the object is linked to an other object then update this
         * @param {object} ob - the object to add
         */
        add(ob) {
            if (ob === undefined || ob === null)
                throw new Classes_7.JassiError("Error cannot add object null");
            this.push(ob);
            if (this._parentObject !== undefined) {
                //set linked object
                var link = jassijs.db.typeDef.linkForField(this._parentObject.__proto__._dbtype, this._parentObjectMember);
                if (link !== undefined && link.type === "array") { //array can not connected){
                    var test = ob._objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname === undefined) {
                        if (test.indexOf(this._parentObject) < 0)
                            test.add(this._parentObject);
                    }
                }
                if (link !== undefined && link.type === "object") {
                    var test = ob.__objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname !== undefined && test !== this) {
                        ob._setObjectProperty(link.name, this._parentObject);
                    }
                }
            }
        }
        /**
         * for compatibility
         */
        async resolve() {
            //Object was already resolved   
            return this;
        }
        /**
         * remove an object
         * if the object is linked to an other object then update this
         * @param {object} ob - the object to remove
         */
        remove(ob) {
            var pos = this.indexOf(ob);
            if (pos >= 0)
                this.splice(pos, 1);
            if (this._parentObject !== undefined) {
                //set linked object
                var link = jassijs.db.typeDef.linkForField(this._parentObject.__proto__._dbtype, this._parentObjectMember);
                if (link !== undefined && link.type === "array") { //array can not connected){
                    var test = ob._objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname === undefined) {
                        if (test.indexOf(this._parentObject) >= 0)
                            test.remove(this._parentObject);
                    }
                }
                if (link !== undefined && link.type === "object") {
                    var test = ob._getObjectProperty(link.name);
                    if (test !== undefined && test.unresolvedclassname !== undefined && test !== this) {
                        ob._setObjectProperty(link.name, null);
                    }
                }
            }
        }
    };
    exports.DBArray = DBArray;
    exports.DBArray = DBArray = __decorate([
        (0, Registry_13.$Class)("jassijs.remote.DBArray"),
        __metadata("design:paramtypes", [Object])
    ], DBArray);
});
define("jassijs/remote/DBObject", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/RemoteObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Database", "jassijs/remote/Validator", "jassijs/remote/Serverservice"], function (require, exports, Registry_14, Classes_8, RemoteObject_2, Registry_15, DatabaseSchema_1, Database_1, Validator_2, Serverservice_2) {
    "use strict";
    var DBObject_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBObject = exports.MyFindManyOptions = void 0;
    exports.$DBObject = $DBObject;
    exports.test = test;
    Registry_15 = __importDefault(Registry_15);
    let cl = Classes_8.classes; //force Classes
    function $DBObject(options) {
        return function (pclass, ...params) {
            var classname = Classes_8.classes.getClassName(pclass);
            if (!options)
                options = {};
            if (!options.name)
                options.name = classname.toLowerCase().replaceAll(".", "_");
            Registry_15.default.register("$DBObject", pclass, options);
            //@ts-ignore
            (0, DatabaseSchema_1.Entity)(options)(pclass, ...params); //pass to orginal Entitiy
        };
    }
    class MyFindManyOptions {
    }
    exports.MyFindManyOptions = MyFindManyOptions;
    /**
    * base class for all database entfities
    * all objects which use the jassijs.db must implement this
    * @class DBObject
    */
    let DBObject = DBObject_1 = class DBObject extends RemoteObject_2.RemoteObject {
        //clear cache on reload
        static _initFunc() {
            Registry_15.default.onregister("$Class", (data, name) => {
                delete DBObject_1.cache[name];
            });
        }
        constructor() {
            super();
        }
        isAutoId() {
            var _a;
            var h = Database_1.db;
            var def = (_a = Database_1.db.getMetadata(this.constructor)) === null || _a === void 0 ? void 0 : _a.fields;
            return def.id.PrimaryGeneratedColumn !== undefined;
        }
        static getFromCache(classname, id) {
            if (!DBObject_1.cache[classname])
                return undefined;
            return DBObject_1.cache[classname][id.toString()];
        }
        async validate(options = undefined, throwError = false) {
            var ret = (0, Validator_2.validate)(this, options, throwError);
            return ret;
        }
        static addToCache(ob) {
            if (ob === undefined)
                return undefined;
            var clname = Classes_8.classes.getClassName(ob);
            var cl = DBObject_1.cache[clname];
            if (cl === undefined) {
                cl = {};
                DBObject_1.cache[clname] = cl;
            }
            cl[ob.id] = ob;
        }
        static clearCache(classname) {
            DBObject_1.cache[classname] = {};
        }
        removeFromCache() {
            var clname = Classes_8.classes.getClassName(this);
            if (!DBObject_1.cache[clname])
                return;
            delete DBObject_1.cache[clname][this.id.toString()];
        }
        static _createObject(ob) {
            if (ob === undefined)
                return undefined;
            var cl = DBObject_1.cache[ob.__clname__];
            if (cl === undefined) {
                cl = {};
                DBObject_1.cache[ob.__clname__] = cl;
            }
            var ret = cl[ob.id];
            if (ret === undefined) {
                ret = new (Classes_8.classes.getClass(ob.__clname__))();
                cl[ob.id] = ret;
            }
            return ret;
        }
        //public id:number;
        /**
         * replace all childs objects with {id:}
         */
        _replaceObjectWithId(obj) {
            var ret = {};
            if (obj === undefined)
                return undefined;
            for (var key in obj) {
                ret[key] = obj[key];
                if (ret[key] !== undefined && ret[key] !== null && ret[key].id !== undefined) {
                    ret[key] = { id: ret[key].id };
                }
                if (Array.isArray(ret[key])) {
                    ret[key] = [];
                    for (var i = 0; i < obj[key].length; i++) {
                        ret[key].push(obj[key][i]);
                        if (ret[key][i] !== undefined && ret[key][i] !== null && ret[key][i].id !== undefined) {
                            ret[key][i] = { id: ret[key][i].id };
                        }
                    }
                }
            }
            return ret;
        }
        /**
        * save the object to jassijs.db
        */
        async save(context = undefined) {
            await this.validate({
                delegateOptions: {
                    ValidateIsInstanceOf: { alternativeJsonProperties: ["id"] },
                    ValidateIsArray: { alternativeJsonProperties: ["id"] }
                }
            });
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if (this.id !== undefined) {
                    var cname = Classes_8.classes.getClassName(this);
                    /* var cl = DBObject.cache[cname];
                     if (cl === undefined) {
                         cl = {};
                         DBObject.cache[cname] = cl;
                     }*/
                    var cached = DBObject_1.getFromCache(cname, this.id);
                    if (cached === undefined) {
                        DBObject_1.addToCache(this); //must be cached before inserting, so the new properties are introduced to the existing
                        if (this.isAutoId())
                            throw new Classes_8.JassiError("autoid - load the object  before saving or remove id");
                        else
                            return await this.call(this, this._createObjectInDB, context);
                        //}//fails if the Object is saved before loading 
                    }
                    else {
                        if (cached !== this) {
                            throw new Classes_8.JassiError("the object must be loaded before save");
                        }
                    }
                    DBObject_1.addToCache(this);
                    //                cl[this.id] = this;//Update cache on save
                    var newob = this._replaceObjectWithId(this);
                    var id = await this.call(newob, this.save, context);
                    this.id = id;
                    return this;
                }
                else {
                    if (!this.isAutoId()) {
                        throw new Classes_8.JassiError("error while saving the Id is not set");
                    }
                    else {
                        var newob = this._replaceObjectWithId(this);
                        var h = await this.call(newob, this._createObjectInDB, context);
                        this.id = h;
                        DBObject_1.addToCache(this);
                        //                	 DBObject.cache[classes.getClassName(this)][this.id]=this;
                        return this;
                    }
                }
            }
            else {
                return (await Serverservice_2.serverservices.db).save(context, this);
            }
        }
        async _createObjectInDB(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                throw new Classes_8.JassiError("createObject could oly be called on server");
            }
            else {
                return (await Serverservice_2.serverservices.db).insert(context, this);
            }
        }
        static async findOne(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.findOne, options, context);
            }
            else {
                return (await Serverservice_2.serverservices.db).findOne(context, this, options);
            }
        }
        static async find(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.find, options, context);
            }
            else {
                return (await Serverservice_2.serverservices.db).find(context, this, options);
            }
        }
        /**
        * reload the object from jassijs.db
        */
        async remove(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                //@ts-ignore
                var cl = DBObject_1.cache[Classes_8.classes.getClassName(this)];
                if (cl !== undefined) {
                    delete cl[this.id];
                }
                return await this.call({ id: this.id }, this.remove, context);
            }
            else {
                //@ts-ignore
                return (await Serverservice_2.serverservices.db).remove(context, this);
            }
        }
        _getObjectProperty(dummy) {
        }
        _setObjectProperty(dummy, dumm1) {
        }
    };
    exports.DBObject = DBObject;
    DBObject.cache = {};
    DBObject._init = DBObject_1._initFunc();
    exports.DBObject = DBObject = DBObject_1 = __decorate([
        (0, Registry_14.$Class)("jassijs.remote.DBObject"),
        __metadata("design:paramtypes", [])
    ], DBObject);
    async function test() {
        var h = Database_1.db.getMetadata(Classes_8.classes.getClass("de.Kunde"));
        // debugger;
    }
});
define("jassijs/remote/DBObjectQuery", ["require", "exports", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Classes_9, Registry_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBObjectQuery = exports.DBObjectQueryProperties = void 0;
    exports.$DBObjectQuery = $DBObjectQuery;
    exports.test = test;
    Registry_16 = __importDefault(Registry_16);
    class DBObjectQueryProperties {
    }
    exports.DBObjectQueryProperties = DBObjectQueryProperties;
    function $DBObjectQuery(property) {
        return function (target, propertyKey, descriptor) {
            var test = Classes_9.classes.getClassName(target);
            Registry_16.default.registerMember("$DBObjectQuery", target, propertyKey, property);
        };
    }
    class DBObjectQuery {
        async execute() {
            return undefined;
        }
        static async getQueries(classname) {
            var cl = await Classes_9.classes.loadClass(classname);
            var ret = [];
            var all = Registry_16.default.getMemberData("$DBObjectQuery");
            var queries = all[classname];
            for (var name in queries) {
                var qu = queries[name][0][0];
                var query = new DBObjectQuery();
                query.classname = classname;
                query.name = qu.name;
                query.description = qu.description;
                query.execute = async function () {
                    return await cl[name]();
                };
                ret.push(query);
            }
            return ret;
        }
    }
    exports.DBObjectQuery = DBObjectQuery;
    async function test() {
        //	var qu=(await DBObjectQuery.getQueries("de.Kunde"))[0];
        //	var j=await qu.execute();
    }
});
define("jassijs/remote/Extensions", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extensions = exports.Extensions = void 0;
    exports.$Extension = $Extension;
    Registry_17 = __importDefault(Registry_17);
    function $Extension(forclass) {
        return function (pclass) {
            Registry_17.default.register("$Extension", pclass, forclass);
        };
    }
    class ExtensionTarget {
        addFunction(name, func, ifExists) {
        }
        addMember(name) {
        }
        annotateMember(member, type, ...annotations) {
        }
    }
    class Extensions {
        constructor() {
            this.funcRegister = Registry_17.default.onregister("$Extension", this.register.bind(this));
        }
        destroy() {
            Registry_17.default.offregister("$Extension", this.funcRegister);
        }
        annotate(oclass, ...annotations) {
            throw new Error("not implemented yet");
        }
        register(extensionclass, forclass) {
            //TODO reloading???
            //we must wait with to extent because forclass ist not loaded
            var func = Registry_17.default.onregister("$Class", function (oclass, params) {
                if (oclass.prototype.constructor._classname === forclass) {
                    // reloading code-> registry.offregister("$Class", func);
                    let props = Object.getOwnPropertyNames(extensionclass.prototype);
                    for (var m = 0; m < props.length; m++) {
                        var member = props[m];
                        if (member !== "_classname" && member !== "constructor") {
                            if (typeof extensionclass.prototype[member] === "function") {
                                if (oclass.prototype[member] !== undefined) {
                                    var sic = oclass.prototype[member];
                                    var ext = extensionclass.prototype[member];
                                    oclass.prototype[member] = function (...p) {
                                        sic.bind(this)(...p);
                                        ext.bind(this)(...p);
                                    };
                                }
                                else
                                    oclass.prototype[member] = extensionclass.prototype[member];
                            }
                        }
                    }
                }
            });
            //  alert(forclass);
        }
        annotateMember(classname, member, type, ...annotations) {
            var func = Registry_17.default.onregister("$Class", function (oclass, params) {
                if (oclass.prototype.constructor._classname === classname) {
                    Registry_17.default.offregister("$Class", func);
                    //designtype
                    Reflect["metadata"]("design:type", type)(oclass.prototype, member);
                    for (var x = 0; x < annotations.length; x++) {
                        let ann = annotations[x];
                        ann(oclass.prototype, member);
                    }
                }
            });
        }
    }
    exports.Extensions = Extensions;
    var extensions = new Extensions();
    exports.extensions = extensions;
});
define("jassijs/remote/FileNode", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FileNode = void 0;
    ;
    let FileNode = class FileNode {
        constructor(fullpath = undefined) {
            if (fullpath) {
                this.fullpath = fullpath;
                this.name = fullpath.split("/")[fullpath.split("/").length - 1];
            }
        }
        isDirectory() {
            return this.files !== undefined;
        }
        resolveChilds(all) {
            if (all === undefined)
                all = {};
            //var ret:FileNode[]=[];
            if (this.files !== undefined) {
                for (let x = 0; x < this.files.length; x++) {
                    all[this.files[x].fullpath] = this.files[x];
                    this.files[x].resolveChilds(all);
                }
            }
            return all;
        }
    };
    exports.FileNode = FileNode;
    exports.FileNode = FileNode = __decorate([
        (0, Registry_18.$Class)("jassijs.remote.FileNode"),
        __metadata("design:paramtypes", [String])
    ], FileNode);
});
define("jassijs/remote/hallo", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OO = void 0;
    class KK {
    }
    class OO {
        constructor() {
            this.hallo = "";
        }
        static test() {
            //  var result = Reflect.getOwnMetadata("design:type", OO,"hallo");
            //  var result = Reflect.getMetadata("design:type", OO,"hallo");
            //  var jj=Reflect.getMetadataKeys(OO);
            //  var jj2=Reflect.getOwnMetadataKeys(OO);
        }
    }
    exports.OO = OO;
});
define("jassijs/remote/Jassi", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Jassi = void 0;
    //@ts-ignore
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
    /**
    * main class for jassi
    * @class Jassi
    */
    class Jassi {
        constructor() {
            this.isServer = false;
            //@ts-ignore
            this.isServer = window.document === undefined;
            //@ts-ignore
            //this.modules = window?.__jassijsconfig__?.modules;
            //@ts-ignore
            //this.options = window?.__jassijsconfig__?.options;
            if (!this.isServer) {
                //@ts-ignore 
                /*import("jassijs/modul").then((modul)=>{
                    jassijs.myRequire(modul.default.css["jassijs.css"]);
                    jassijs.myRequire(modul.default.css["jquery-ui.css"]);
                    jassijs.myRequire(modul.default.css["materialdesignicons.min.css"]);
        
                });*/
                //  this.myRequire("jassi/jassijs.css");
                //  this.myRequire("https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css");
                //  this.myRequire("https:///cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css");
            }
        }
        includeCSSFile(modulkey) {
            this.myRequire(this.cssFiles[modulkey]);
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
                //@ts-ignore
                style = document.createRange().createContextualFragment('<style id=' + id + '></style>').children[0];
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
                throw new Error("jassi.Require is only available on client");
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
                //@ts-ignore
                if (document.getElementById("-->" + url) != null) {
                    if (event)
                        event();
                    return;
                }
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
                //@ts-ignore 
                link.onload = function (data1, data2) {
                    _this.myRequire(href, event);
                };
                head.appendChild(link);
            }
        }
    }
    exports.Jassi = Jassi;
    ;
    var jassijs = new Jassi();
    globalThis.jassijs = jassijs;
});
define("jassijs/remote/Modules", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.modules = void 0;
    class Modules {
        constructor() {
            if (!window.document) {
                var fs = require("fs");
                var all = JSON.parse(fs.readFileSync('./client/jassijs.json', 'utf-8'));
                Object.assign(this, all);
            }
        }
    }
    var modules = new Modules();
    exports.modules = modules;
});
define("jassijs/remote/ObjectTransaction", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObjectTransaction = void 0;
    class ObjectTransaction {
        constructor() {
            this.statements = [];
            this.functionsFinally = [];
        }
        transactionResolved(context) {
            //var session = getNamespace('objecttransaction');
            var test = context.objecttransactionitem; // session.get("objecttransaction");
            if (test)
                test.resolve = true;
        }
        addFunctionFinally(functionToAdd) {
            this.functionsFinally.push(functionToAdd);
        }
        checkFinally() {
            let canFinally = true;
            this.statements.forEach((ent) => {
                if (ent.result === "**unresolved**")
                    canFinally = false;
                if (ent.result["then"] && !ent["resolve"]) { //Promise, which is not resolved by addFunctionFinally
                    canFinally = false;
                }
            });
            if (canFinally) {
                this.finally();
            }
        }
        async finally() {
            for (let x = 0; x < this.functionsFinally.length; x++) {
                await this.functionsFinally[x]();
            }
        }
    }
    exports.ObjectTransaction = ObjectTransaction;
});
define("jassijs/remote/Registry", ["require", "exports", "jassijs/remote/Config", "reflect-metadata"], function (require, exports, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Registry = void 0;
    exports.$Class = $Class;
    exports.$register = $register;
    exports.migrateModul = migrateModul;
    function $Class(longclassname) {
        return function (pclass) {
            registry.register("$Class", pclass, longclassname);
        };
    }
    function $register(servicename, ...params) {
        return function (pclass) {
            registry.register(servicename, pclass, params);
        };
    }
    if (Reflect["_metadataorg"] === undefined) {
        Reflect["_metadataorg"] = Reflect["metadata"];
        if (Reflect["_metadataorg"] === undefined)
            Reflect["_metadataorg"] = null;
    }
    //@ts-ignore
    Reflect["metadata"] = function (o, property, ...args) {
        return function (target, propertyKey, descriptor, ...fargs) {
            //delegation to 
            if (Reflect["_metadataorg"] !== null) {
                var func = Reflect["_metadataorg"](o, property, ...args);
                func(target, propertyKey, descriptor, ...fargs);
            }
            if (o === "design:type") {
                registry.registerMember("design:type", target, propertyKey, property);
            }
        };
    };
    class DataEntry {
    }
    class JSONDataEntry {
    }
    /**
    * Manage all known data registered by jassijs.register
    * the data is downloaded by /registry.json
    * registry.json is updated by the server on code upload
    * @class jassijs.base.Registry
    */
    class Registry {
        constructor() {
            this.jsondata = undefined;
            this.data = {};
            this.dataMembers = {};
            this.jsondataMembers = {};
            this._eventHandler = {};
            this._nextID = 10;
            this.isLoading = this.reload();
        }
        getData(service, classname = undefined) {
            var olddata = this.data[service];
            if (olddata === undefined)
                return [];
            var ret = [];
            if (classname !== undefined) {
                if (olddata[classname] !== undefined) {
                    ret.push(olddata[classname]);
                }
            }
            else {
                for (var key in olddata) {
                    ret.push(olddata[key]);
                }
            }
            return ret;
        }
        onregister(service, callback) {
            var events = this._eventHandler[service];
            if (events === undefined) {
                events = [];
                this._eventHandler[service] = events;
            }
            events.push(callback);
            //push already registered events
            var olddata = this.data[service];
            for (var key in olddata) {
                var dataentry = olddata[key];
                callback(dataentry.oclass, ...dataentry.params);
            }
            return callback;
        }
        offregister(service, callback) {
            var events = this._eventHandler[service];
            var pos = events.indexOf(callback);
            if (pos >= 0)
                events.splice(pos, 1);
        }
        /**
         * register an anotation
         * Important: this function should only used from an annotation, because the annotation is saved in
         *            index.json and could be read without loading the class
         **/
        register(service, oclass, ...params) {
            var sclass = oclass.prototype.constructor._classname;
            if (sclass === undefined && service !== "$Class") {
                throw new Error("@$Class member is missing or must be set at last");
                return;
            }
            if (service === "$Class") {
                sclass = params[0];
                oclass.prototype.constructor._classname = params[0];
            }
            if (this.data[service] === undefined) {
                this.data[service] = {};
            }
            this.data[service][sclass] = { oclass, params };
            //the array could be modified so we need a copy
            var events = this._eventHandler[service] === undefined ? undefined : [].concat(this._eventHandler[service]);
            if (events !== undefined) {
                for (var x = 0; x < events.length; x++) {
                    events[x](oclass, ...params);
                }
            }
            if (service === "$Class") {
                //console.log("load " + params[0]);
                //finalize temporary saved registerd members
                let tempMem = oclass.prototype.$$tempRegisterdMembers$$;
                if (tempMem === undefined)
                    //@ts-ignore
                    tempMem = oclass.$$tempRegisterdMembers$$;
                if (tempMem !== undefined) {
                    //this.dataMembers = oclass.prototype.$$tempRegisterdMembers$$;
                    for (var sservice in tempMem) {
                        var pservice = tempMem[sservice];
                        if (this.dataMembers[sservice] === undefined) {
                            this.dataMembers[sservice] = {};
                        }
                        this.dataMembers[sservice][sclass] = pservice;
                    }
                    delete oclass.prototype.$$tempRegisterdMembers$$;
                    //@ts-ignore
                    delete oclass.$$tempRegisterdMembers$$;
                }
            }
        }
        getMemberData(service) {
            return this.dataMembers[service];
        }
        getJSONMemberData(service) {
            return this.jsondataMembers[service];
        }
        /**
         * register an anotation
         * Important: this function should only used from an annotation
         **/
        registerMember(service, oclass /*new (...args: any[]) => any*/, membername, ...params) {
            var _a, _b;
            var m = oclass;
            if (oclass.prototype !== undefined)
                m = oclass.prototype;
            var clname = (_b = (_a = oclass.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b._classname;
            if (clname) {
                if (this.dataMembers[service] === undefined) {
                    this.dataMembers[service] = {};
                }
                if (this.dataMembers[service][clname] === undefined) {
                    this.dataMembers[service][clname] = {};
                }
                if (this.dataMembers[service][clname][membername] === undefined) {
                    this.dataMembers[service][clname][membername] = [];
                }
                this.dataMembers[service][clname][membername].push(params);
            }
            else {
                //the classname is not already known so we temporarly store the data in oclass.$$tempRegisterdMembers$$
                //and register the member in register("$Class",....)
                if (m.$$tempRegisterdMembers$$ === undefined) {
                    m.$$tempRegisterdMembers$$ = {};
                }
                if (m.$$tempRegisterdMembers$$[service] === undefined) {
                    m.$$tempRegisterdMembers$$[service] = {};
                }
                if (m.$$tempRegisterdMembers$$[service][membername] === undefined) {
                    m.$$tempRegisterdMembers$$[service][membername] = [];
                }
                m.$$tempRegisterdMembers$$[service][membername].push(params);
            }
        }
        /**
        * with every call a new id is generated - used to create a free id for the dom
        * @returns {number} - the id
        */
        nextID() {
            this._nextID = this._nextID + 1;
            return this._nextID.toString();
        }
        /**
        * Load text with Ajax synchronously: takes path to file and optional MIME type
        * @param {string} filePath - the url
        * @returns {string} content
        */ /*
        loadFile(filePath)
        {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let response = null;
                xhr.addEventListener("readystatechange", function() {
                  if (this.readyState === xhr.DONE) {
                    response = this.responseText;
                    if (response) {
                      //response = JSON.parse(response);
                      resolve(response);
                    }
                  }
                });
                xhr.open("GET",filePath, true);
                xhr.send();
                xhr.overrideMimeType("application/json");
                xhr.onerror = function(error) {
                  reject({
                    error: "Some error"
                  })
                }
              });
        }*/
        async loadText(url) {
            return new Promise((resolve) => {
                //@ts-ignore
                let oReq = new XMLHttpRequest();
                oReq.open("GET", url);
                oReq.onerror = () => {
                    resolve(undefined);
                };
                oReq.addEventListener("load", () => {
                    if (oReq.status === 200)
                        resolve(oReq.responseText);
                    else
                        resolve(undefined);
                });
                oReq.send();
            });
        }
        /**
         * reload the registry
         */
        async reload() {
            this.jsondata = { $Class: {} };
            this.jsondataMembers = {};
            var _this = this;
            var modultext = "";
            //@ts-ignore
            if ((window === null || window === void 0 ? void 0 : window.document) === undefined) { //on server
                //@ts-ignore 
                var fs = await new Promise((resolve_9, reject_9) => { require(['fs'], resolve_9, reject_9); }).then(__importStar);
                var Filesystem = await new Promise((resolve_10, reject_10) => { require(["jassijs/server/Filesystem"], resolve_10, reject_10); }).then(__importStar);
                var modules = Config_1.config.server.modules;
                for (let modul in modules) {
                    try {
                        try {
                            //@ts-ignore
                            delete require.cache[require.resolve(modul + "/registry")];
                        }
                        catch (_a) {
                            //@ts-ignore
                            var s = (require.main["path"] + "/" + modul + "/registry").replaceAll("\\", "/") + ".js";
                            //@ts-ignore
                            delete require.cache[s];
                            //@ts-ignore
                            delete require.cache[s.replaceAll("/", "\\")];
                        }
                        //@ts-ignore
                        var data = (await require.main.require(modul + "/registry")).default;
                        this.initJSONData(data);
                    }
                    catch (_b) {
                        console.error("failed load registry " + modul + "/registry.js");
                    }
                }
            }
            else { //on client
                // var config=(await import("./Config")).config;
                //   this.isServer=config.isServer;
                var all = {};
                var modules = Config_1.config.modules;
                var myrequire;
                if (Config_1.config.isServer) {
                    //if(require.defined("jassijs/server/Installserver")){
                    myrequire = Config_1.config.serverrequire;
                    modules = Config_1.config.server.modules;
                }
                else {
                    myrequire = Config_1.config.clientrequire;
                }
                this.isServer = Config_1.config.isServer; //is this needed?
                for (let modul in modules) {
                    if (!modules[modul].endsWith(".js") && modules[modul].indexOf(".js?") === -1)
                        myrequire.undef(modul + "/registry");
                    {
                        var m = modul;
                        all[modul] = new Promise((resolve, reject) => {
                            //@ts-ignore
                            myrequire([m + "/registry"], function (ret) {
                                resolve(ret.default);
                            });
                        });
                    }
                }
                for (let modul in modules) {
                    var data = await all[modul];
                    _this.initJSONData(data);
                }
            }
            /* for (let modul in modules) {
            
                        //requirejs.undef("js/"+modul+"/registry.js");
                        all[modul] = fs.readFileSync("./../client/"+modul+"/registry.js", 'utf-8');
                    }
                    for (let modul in modules) {
                        var data = await all[modul].default;
                        _this.initJSONData(data);
                    }
            */
            //var reg = await this.reloadRegistry();
            //_this.initJSONData(reg);
            /*     requirejs.undef("text!../../../../registry.json?bust="+window["jassiversion"]);
             require(["text!../../../../registry.json?bust="+window["jassiversion"]], function(registry){
                 _this.init(registry);
             });*/
        }
        /**
        * loads entries from json string
        * @param {string} json - jsondata
        */
        initJSONData(json) {
            if (json === undefined)
                return;
            var vdata = json;
            for (var file in vdata) {
                var vfiles = vdata[file];
                for (var classname in vfiles) {
                    if (classname === "date")
                        continue;
                    this.jsondata.$Class[classname] = {
                        classname: classname,
                        params: [classname],
                        filename: file
                    };
                    var theclass = vfiles[classname];
                    for (var service in theclass) {
                        if (service === "@members") {
                            //public jsondataMembers: { [service: string]: { [classname: string]: { [membername: string]: any[] } } } = {};
                            var mems = theclass[service];
                            for (let mem in mems) {
                                let scs = mems[mem];
                                for (let sc in scs) {
                                    if (!this.jsondataMembers[sc])
                                        this.jsondataMembers[sc] = {};
                                    if (!this.jsondataMembers[sc][classname])
                                        this.jsondataMembers[sc][classname] = {};
                                    if (this.jsondataMembers[sc][classname][mem] === undefined)
                                        this.jsondataMembers[sc][classname][mem] = [];
                                    this.jsondataMembers[sc][classname][mem].push(scs[sc]);
                                }
                            }
                        }
                        else {
                            if (this.jsondata[service] === undefined)
                                this.jsondata[service] = {};
                            var entr = new JSONDataEntry();
                            entr.params = theclass[service];
                            entr.classname = classname; //vfiles.$Class === undefined ? undefined : vfiles.$Class[0];
                            entr.filename = file;
                            this.jsondata[service][entr.classname] = entr;
                        }
                    }
                }
            }
        }
        /**
         *
         * @param service - the service for which we want informations
         */
        async getJSONData(service, classname = undefined) {
            // if (this.isLoading)
            await this.isLoading;
            /* if (this.jsondata === undefined) {
                 this.isLoading = this.reload();
                 await this.isLoading;
             }
             this.isLoading = undefined;*/
            var ret = [];
            var odata = this.jsondata[service];
            if (odata === undefined)
                return ret;
            if (classname !== undefined)
                return odata[classname] === undefined ? undefined : [odata[classname]];
            for (var clname in odata) {
                if (classname === undefined || classname === clname)
                    ret.push(odata[clname]);
            }
            return ret;
        }
        getAllFilesForService(service, classname = undefined) {
            var data = this.jsondata[service];
            var ret = [];
            for (var clname in data) {
                var test = data[clname];
                if (classname == undefined || test.classname === classname)
                    ret.push(test.filename);
            }
            return ret;
        }
        async loadAllFilesForEntries(entries) {
            var files = [];
            for (let x = 0; x < entries.length; x++) {
                if (files.indexOf(entries[x].filename) === -1)
                    files.push(entries[x].filename);
            }
            await this.loadAllFiles(files);
        }
        /**
         * load all files that registered the service
         * @param {string} service - name of the service
         * @param {function} callback - called when loading is finished
         */
        async loadAllFilesForService(service) {
            var services = this.getAllFilesForService(service);
            await this.loadAllFiles(services);
        }
        /**
         * load all files
         * @param {string} files - the files to load
         */
        async loadAllFiles(files) {
            //   var services = this.getAllFilesForService(service);
            return new Promise((resolve, reject) => {
                var dependency = [];
                for (var x = 0; x < files.length; x++) {
                    var name = files[x];
                    if (name.endsWith(".ts"))
                        name = name.substring(0, name.length - 3);
                    else if (name.endsWith(".tsx"))
                        name = name.substring(0, name.length - 4);
                    dependency.push(name);
                }
                var req = require;
                req(dependency, function () {
                    resolve(undefined);
                });
            });
        }
    }
    exports.Registry = Registry;
    ;
    var registry = new Registry();
    exports.default = registry;
    function migrateModul(oldModul, newModul) {
        if (newModul.registry) {
            newModul.registry._nextID = oldModul.registry._nextID;
            newModul.registry.entries = oldModul.registry.entries;
        }
    }
});
//jassijs.registry=registry;
define("jassijs/remote/RemoteObject", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/RemoteProtocol"], function (require, exports, Registry_19, Classes_10, RemoteProtocol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoteObject = exports.Context = void 0;
    class Context {
    }
    exports.Context = Context;
    let RemoteObject = class RemoteObject {
        static async call(method, ...parameter) {
            if (jassijs.isServer)
                throw new Classes_10.JassiError("should be called on client");
            var prot = new RemoteProtocol_1.RemoteProtocol();
            var context = parameter[parameter.length - 1];
            prot.classname = Classes_10.classes.getClassName(this);
            prot._this = "static";
            prot.parameter = parameter;
            prot.method = method.name;
            prot.parameter.splice(parameter.length - 1, 1);
            var ret;
            if (context === null || context === void 0 ? void 0 : context.transactionitem) {
                ret = await context.transactionitem.transaction.wait(context.transactionitem, prot);
                return ret;
            }
            //let Transaction= (await import("jassijs/remote/Transaction")).Transaction;
            //var trans=Transaction.cache.get(_this);
            //if(trans&&trans[method.name]){
            //	throw "not implemented"
            //	ret=await trans[method.name][0]._push(undefined,prot.method,prot,trans[method.name][1]);
            //}
            ret = await prot.call();
            return ret;
        }
        async call(_this, method, ...parameter) {
            if (jassijs.isServer)
                throw new Classes_10.JassiError("should be called on client");
            var prot = new RemoteProtocol_1.RemoteProtocol();
            var context = parameter[parameter.length - 1];
            prot.classname = Classes_10.classes.getClassName(this);
            prot._this = _this;
            prot.parameter = parameter;
            prot.method = method.name;
            prot.parameter.splice(parameter.length - 1, 1);
            var ret;
            //let context=(await import("jassijs/remote/Context")).Context;
            //let Transaction= (await import("jassijs/remote/Transaction")).Transaction;
            //var trans=Transaction.cache.get(_this);
            //var trans=context.get("transaction");
            if (context === null || context === void 0 ? void 0 : context.transactionitem) {
                ret = await context.transactionitem.transaction.wait(context.transactionitem, prot);
                return ret;
            }
            ret = await prot.call();
            return ret;
        }
    };
    exports.RemoteObject = RemoteObject;
    exports.RemoteObject = RemoteObject = __decorate([
        (0, Registry_19.$Class)("jassijs.remote.RemoteObject")
    ], RemoteObject);
});
define("jassijs/remote/RemoteProtocol", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Registry_20, Classes_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoteProtocol = void 0;
    let RemoteProtocol = class RemoteProtocol {
        /**
         * converts object to jsonstring
         * if class is registerd in classes then the class is used
         * if id is used then recursive childs are possible
         * @param obj
         */
        stringify(obj) {
            var ref = [];
            return JSON.stringify(obj, function (key, value) {
                var val = {};
                var clname = value === null ? undefined : Classes_11.classes.getClassName(value);
                var k = clname;
                if (k !== undefined) {
                    val.__clname__ = clname;
                    //if (value.id !== undefined)
                    //	k = k + ":" + (value.id === undefined ? RemoteProtocol.counter++ : value.id);
                    //the object was seen the we save a ref
                    if (ref.indexOf(value) >= 0) {
                        val.__ref__ = ref.indexOf(value);
                    }
                    else {
                        Object.assign(val, value);
                        ref.push(value);
                        val.__refid__ = ref.length - 1;
                    }
                }
                else {
                    val = value;
                }
                return val;
            });
        }
        static async simulateUser(user = undefined, password = undefined) {
            var rights = (await new Promise((resolve_11, reject_11) => { require(["jassijs/remote/security/Rights"], resolve_11, reject_11); }).then(__importStar)).default;
            //	if(await rights.isAdmin()){
            //		throw new Error("not an admin")
            //	}
            //@ts-ignore
            var Cookies = (await new Promise((resolve_12, reject_12) => { require(["jassijs/util/Cookies"], resolve_12, reject_12); }).then(__importStar)).Cookies;
            if (user === undefined) {
                Cookies.remove("simulateUser", {});
                Cookies.remove("simulateUserPassword", {});
            }
            else {
                Cookies.set("simulateUser", user, {});
                Cookies.set("simulateUserPassword", password, {});
            }
        }
        async exec(config, object) {
            return await new Promise((resolve, reject) => {
                //@ts-ignore
                var xhr = new XMLHttpRequest();
                xhr.open('POST', config.url, true);
                xhr.setRequestHeader("Content-Type", "text");
                xhr.onload = function (data) {
                    if (this.status === 200)
                        resolve(this.responseText);
                    else
                        reject(this);
                };
                xhr.send(config.data);
                xhr.onerror = function (data) {
                    reject(data);
                };
            });
            //return await $.ajax(config, object);
        }
        /**
       * call the server
       */
        async call() {
            if (jassijs.isServer)
                throw new Classes_11.JassiError("should be called on client");
            var sdataObject = undefined;
            var url = "remoteprotocol?" + Date.now();
            var _this = this;
            var redirect = undefined;
            var config = {
                url: url,
                type: 'post',
                dataType: "text",
                data: this.stringify(this),
            };
            var ret;
            try {
                ret = await this.exec(config, this._this);
            }
            catch (ex) {
                if (ex.status === 401 || (ex.responseText && ex.responseText.indexOf("jwt expired") !== -1)) {
                    redirect = new Promise((resolve) => {
                        //@ts-ignore
                        new Promise((resolve_13, reject_13) => { require(["jassijs/base/LoginDialog"], resolve_13, reject_13); }).then(__importStar).then((lib) => {
                            lib.doAfterLogin(resolve, _this);
                        });
                    });
                }
                else {
                    throw ex;
                }
            }
            if (redirect !== undefined)
                return await redirect;
            if (ret === "$$undefined$$")
                return undefined;
            var retval = await this.parse(ret);
            if (retval["**throw error**"] !== undefined) {
                throw new Classes_11.JassiError(retval["**throw error**"]);
            }
            return retval;
        }
        /**
         * converts jsonstring to an object
         */
        async parse(text) {
            var ref = {};
            if (text === undefined)
                return undefined;
            if (text === "")
                return "";
            //first get all classnames	
            var allclassnames = [];
            JSON.parse(text, function (key, value) {
                if (value === null || value === undefined)
                    return value;
                if (value.__clname__ !== null && value.__clname__ !== undefined && allclassnames.indexOf(value.__clname__) === -1) {
                    allclassnames.push(value.__clname__);
                }
                return value;
            });
            //all classes must be loaded
            for (var x = 0; x < allclassnames.length; x++) {
                await Classes_11.classes.loadClass(allclassnames[x]);
            }
            return JSON.parse(text, function (key, value) {
                var val = value;
                if (value === null || value === undefined)
                    return value;
                if (value.__ref__ !== undefined) {
                    val = ref[value.__ref__];
                    if (val === undefined) {
                        //TODO import types from js
                        //create dummy
                        var type = Classes_11.classes.getClass(value.__clname__);
                        //@ts-ignore
                        var test = type._createObject === undefined ? undefined : type._createObject(val);
                        if (test !== undefined)
                            val = test;
                        else
                            val = new type();
                        ref[value.__ref__] = val;
                    }
                }
                else {
                    if (value.__clname__ !== undefined) {
                        if (value.__refid__ !== undefined && ref[value.__refid__] !== undefined) { //there is a dummy
                            val = ref[value.__refid__];
                        }
                        else {
                            //TODO import types from js
                            var type = Classes_11.classes.getClass(value.__clname__);
                            //@ts-ignore
                            var test = type._createObject === undefined ? undefined : type._createObject(value);
                            if (test !== undefined)
                                val = test;
                            else
                                val = new type();
                            if (value.__refid__ !== undefined) {
                                ref[value.__refid__] = val;
                            }
                        }
                        Object.assign(val, value);
                        delete val.__refid__;
                        delete val.__clname__;
                    }
                }
                //Date conversation
                var datepattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
                if (typeof value === 'string') {
                    var a = datepattern.exec(value);
                    if (a)
                        return new Date(value);
                }
                return val;
            });
        }
        async test() {
            var a = new A();
            var b = new B();
            a.b = b;
            a.name = "max";
            a.id = 9;
            b.a = a;
            b.id = 7;
            var s = this.stringify(a);
            var test = await this.parse(s);
        }
    };
    exports.RemoteProtocol = RemoteProtocol;
    RemoteProtocol.counter = 0;
    exports.RemoteProtocol = RemoteProtocol = __decorate([
        (0, Registry_20.$Class)("jassijs.remote.RemoteProtocol")
    ], RemoteProtocol);
    class A {
    }
    //jassijs.register("classes", "de.A", A);
    class B {
    }
});
//jassijs.register("classes", "de.B", B);
define("jassijs/remote/security/Group", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/ParentRight", "jassijs/remote/security/User", "jassijs/remote/security/Right", "jassijs/remote/Validator", "../Config"], function (require, exports, DBObject_2, Registry_21, DatabaseSchema_2, ParentRight_1, User_1, Right_1, Validator_3, Config_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Group = void 0;
    var hh = Config_2.config;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let Group = class Group extends DBObject_2.DBObject {
    };
    exports.Group = Group;
    __decorate([
        (0, Validator_3.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_2.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Group.prototype, "id", void 0);
    __decorate([
        (0, Validator_3.ValidateIsString)(),
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], Group.prototype, "name", void 0);
    __decorate([
        (0, Validator_3.ValidateIsArray)({ optional: true, type: type => ParentRight_1.ParentRight }),
        (0, DatabaseSchema_2.JoinTable)(),
        (0, DatabaseSchema_2.ManyToMany)(type => ParentRight_1.ParentRight, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "parentRights", void 0);
    __decorate([
        (0, Validator_3.ValidateIsArray)({ optional: true, type: type => Right_1.Right }),
        (0, DatabaseSchema_2.JoinTable)(),
        (0, DatabaseSchema_2.ManyToMany)(type => Right_1.Right, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "rights", void 0);
    __decorate([
        (0, Validator_3.ValidateIsArray)({ optional: true, type: type => User_1.User }),
        (0, DatabaseSchema_2.ManyToMany)(type => User_1.User, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "users", void 0);
    exports.Group = Group = __decorate([
        (0, DBObject_2.$DBObject)({ name: "jassijs_group" }),
        (0, Registry_21.$Class)("jassijs.security.Group")
    ], Group);
});
define("jassijs/remote/security/ParentRight", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Group", "jassijs/remote/Validator"], function (require, exports, DBObject_3, Registry_22, DatabaseSchema_3, Group_1, Validator_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParentRight = void 0;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let ParentRight = class ParentRight extends DBObject_3.DBObject {
    };
    exports.ParentRight = ParentRight;
    __decorate([
        (0, Validator_4.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_3.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "id", void 0);
    __decorate([
        (0, Validator_4.ValidateIsString)(),
        (0, DatabaseSchema_3.Column)(),
        __metadata("design:type", String)
    ], ParentRight.prototype, "name", void 0);
    __decorate([
        (0, Validator_4.ValidateIsString)(),
        (0, DatabaseSchema_3.Column)(),
        __metadata("design:type", String)
    ], ParentRight.prototype, "classname", void 0);
    __decorate([
        (0, Validator_4.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "i1", void 0);
    __decorate([
        (0, Validator_4.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "i2", void 0);
    __decorate([
        (0, Validator_4.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], ParentRight.prototype, "s1", void 0);
    __decorate([
        (0, Validator_4.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_3.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], ParentRight.prototype, "s2", void 0);
    __decorate([
        (0, Validator_4.ValidateIsArray)({ optional: true, type: type => Group_1.Group }),
        (0, DatabaseSchema_3.ManyToMany)(type => Group_1.Group, ob => ob.parentRights),
        __metadata("design:type", Array)
    ], ParentRight.prototype, "groups", void 0);
    exports.ParentRight = ParentRight = __decorate([
        (0, DBObject_3.$DBObject)({ name: "jassijs_parentright" }),
        (0, Registry_22.$Class)("jassijs.security.ParentRight")
    ], ParentRight);
});
define("jassijs/remote/security/Right", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Group", "jassijs/remote/Validator"], function (require, exports, DBObject_4, Registry_23, DatabaseSchema_4, Group_2, Validator_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Right = void 0;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let Right = class Right extends DBObject_4.DBObject {
    };
    exports.Right = Right;
    __decorate([
        (0, Validator_5.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_4.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Right.prototype, "id", void 0);
    __decorate([
        (0, Validator_5.ValidateIsString)(),
        (0, DatabaseSchema_4.Column)(),
        __metadata("design:type", String)
    ], Right.prototype, "name", void 0);
    __decorate([
        (0, Validator_5.ValidateIsArray)({ optional: true, type: type => Group_2.Group }),
        (0, DatabaseSchema_4.ManyToMany)(type => Group_2.Group, ob => ob.rights),
        __metadata("design:type", Array)
    ], Right.prototype, "groups", void 0);
    exports.Right = Right = __decorate([
        (0, DBObject_4.$DBObject)({ name: "jassijs_right" }),
        (0, Registry_23.$Class)("jassijs.security.Right")
    ], Right);
});
define("jassijs/remote/security/Rights", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/remote/RemoteObject"], function (require, exports, Registry_24, Registry_25, RemoteObject_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rights = exports.ParentRightProperties = exports.RightProperties = void 0;
    exports.$Rights = $Rights;
    exports.$ParentRights = $ParentRights;
    exports.$CheckParentRight = $CheckParentRight;
    Registry_25 = __importDefault(Registry_25);
    class RightProperties {
    }
    exports.RightProperties = RightProperties;
    class ParentRightProperties {
    }
    exports.ParentRightProperties = ParentRightProperties;
    function $Rights(rights) {
        return function (pclass) {
            Registry_25.default.register("$Rights", pclass, rights);
        };
    }
    function $ParentRights(rights) {
        return function (pclass) {
            Registry_25.default.register("$ParentRights", pclass, rights);
        };
    }
    function $CheckParentRight() {
        return function (target, propertyKey, descriptor) {
            Registry_25.default.registerMember("$CheckParentRight", target, propertyKey, undefined);
        };
    }
    let Rights = class Rights extends RemoteObject_3.RemoteObject {
        async isAdmin(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if (this._isAdmin !== undefined)
                    return this._isAdmin;
                return await this.call(this, this.isAdmin, context);
            }
            else {
                //@ts-ignore
                var req = context.request;
                return req.user.isAdmin;
            }
        }
    };
    exports.Rights = Rights;
    exports.Rights = Rights = __decorate([
        (0, Registry_24.$Class)("jassijs.security.Rights")
    ], Rights);
    var rights = new Rights();
    exports.default = rights;
});
define("jassijs/remote/security/Setting", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "../Classes", "jassijs/remote/Validator"], function (require, exports, DBObject_5, Registry_26, DatabaseSchema_5, Classes_12, Validator_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Setting = void 0;
    exports.test = test;
    let Setting = class Setting extends DBObject_5.DBObject {
        constructor() {
            super();
        }
        async save(context = undefined) {
            throw new Classes_12.JassiError("not suported");
        }
        static async findOne(options = undefined, context = undefined) {
            throw new Classes_12.JassiError("not suported");
        }
        static async find(options = undefined, context = undefined) {
            throw new Classes_12.JassiError("not suported");
        }
        /**
        * reload the object from jassijs.db
        */
        async remove(context = undefined) {
            throw new Classes_12.JassiError("not suported");
        }
    };
    exports.Setting = Setting;
    __decorate([
        (0, Validator_6.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_5.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Setting.prototype, "id", void 0);
    __decorate([
        (0, Validator_6.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_5.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Setting.prototype, "data", void 0);
    exports.Setting = Setting = __decorate([
        (0, DBObject_5.$DBObject)({ name: "jassijs_setting" }),
        (0, Registry_26.$Class)("jassijs.security.Setting"),
        __metadata("design:paramtypes", [])
    ], Setting);
    async function test() {
    }
    ;
});
define("jassijs/remote/security/User", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Group", "jassijs/remote/security/ParentRight", "jassijs/remote/Validator"], function (require, exports, DBObject_6, Registry_27, DatabaseSchema_6, Group_3, ParentRight_2, Validator_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.User = void 0;
    exports.test = test;
    exports.test2 = test2;
    let User = class User extends DBObject_6.DBObject {
        static async findWithRelations() {
            return this.find({ relations: ["*"] });
        }
        /**
       * reload the object from jassijs.db
       */
        async hallo(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.hallo, context);
            }
            else {
                return 11;
            }
        }
        async save(context = undefined) {
            return await super.save(context);
        }
    };
    exports.User = User;
    __decorate([
        (0, Validator_7.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_6.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    __decorate([
        (0, Validator_7.ValidateIsString)(),
        (0, DatabaseSchema_6.Column)(),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        (0, Validator_7.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_6.Column)({ select: false }),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        (0, Validator_7.ValidateIsArray)({ optional: true, type: type => Group_3.Group }),
        (0, DatabaseSchema_6.JoinTable)(),
        (0, DatabaseSchema_6.ManyToMany)(type => Group_3.Group, ob => ob.users),
        __metadata("design:type", Array)
    ], User.prototype, "groups", void 0);
    __decorate([
        (0, Validator_7.ValidateIsBoolean)({ optional: true }),
        (0, DatabaseSchema_6.Column)({ nullable: true }),
        __metadata("design:type", Boolean)
    ], User.prototype, "isAdmin", void 0);
    exports.User = User = __decorate([
        (0, DBObject_6.$DBObject)({ name: "jassijs_user" }),
        (0, Registry_27.$Class)("jassijs.security.User")
    ], User);
    async function test() {
        var gps = await (Group_3.Group.find({}));
    }
    async function test2() {
        var user = new User();
        user.id = 1;
        user.email = "a@b.com";
        user.password = "";
        var group1 = new Group_3.Group();
        group1.id = 1;
        group1.name = "Mandanten I";
        var group2 = new Group_3.Group();
        group2.id = 2;
        group2.name = "Mandanten 2";
        var pr1 = new ParentRight_2.ParentRight();
        pr1.id = 10;
        pr1.classname = "de.Kunde";
        pr1.name = "Kunden";
        pr1.i1 = 1;
        pr1.i2 = 4;
        await pr1.save();
        var pr2 = new ParentRight_2.ParentRight();
        pr2.id = 11;
        pr2.classname = "de.Kunde";
        pr2.name = "Kunden";
        pr2.i1 = 6;
        pr2.i2 = 10;
        await pr2.save();
        group1.parentRights = [pr1];
        await group1.save();
        group2.parentRights = [pr2];
        await group2.save();
        user.groups = [group1, group2];
        await user.save();
    }
});
define("jassijs/remote/Server", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/FileNode", "./Classes", "./Serverservice", "jassijs/remote/Validator", "./Config"], function (require, exports, Registry_28, RemoteObject_4, FileNode_1, Classes_13, Serverservice_3, Validator_8, Config_3) {
    "use strict";
    var Server_1;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Server = void 0;
    let Server = Server_1 = class Server extends RemoteObject_4.RemoteObject {
        constructor() {
            super();
        }
        _convertFileNode(node) {
            var ret = new FileNode_1.FileNode();
            Object.assign(ret, node);
            if (ret.files !== undefined) {
                for (let x = 0; x < ret.files.length; x++) {
                    ret.files[x].parent = ret;
                    var s = ret.fullpath === undefined ? "" : ret.fullpath;
                    ret.files[x].fullpath = s + (s === "" ? "" : "/") + ret.files[x].name;
                    ret.files[x] = this._convertFileNode(ret.files[x]);
                }
            }
            return ret;
        }
        async fillMapModules(ret, serverModules) {
            var _a, _b, _c, _d, _e, _f, _g;
            var modules = Config_3.config.modules;
            if (serverModules === true)
                modules = (_a = Config_3.config.server) === null || _a === void 0 ? void 0 : _a.modules;
            if (modules === undefined)
                return;
            for (var mod in modules) {
                if ((_c = (_b = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _b === void 0 ? void 0 : _b.Server) === null || _c === void 0 ? void 0 : _c.filterModulInFilemap) {
                    if (((_e = (_d = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _d === void 0 ? void 0 : _d.Server) === null || _e === void 0 ? void 0 : _e.filterModulInFilemap.indexOf(mod)) === -1)
                        continue;
                }
                if (modules[mod].endsWith(".js") || modules[mod].indexOf(".js?") > -1) {
                    let mapname = modules[mod].split("?")[0] + ".map";
                    if (modules[mod].indexOf(".js?") > -1)
                        mapname = mapname + "?" + modules[mod].split("?")[1];
                    var code = await $.ajax({ url: mapname, dataType: "text" });
                    var data = JSON.parse(code);
                    var files = data.sources;
                    for (let x = 0; x < files.length; x++) {
                        let fname = files[x].substring(files[x].indexOf(mod + "/"));
                        if (((_g = (_f = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _f === void 0 ? void 0 : _f.Server) === null || _g === void 0 ? void 0 : _g.filterSytemfilesInFilemap) === true) {
                            if (fname.endsWith("/modul.js") || fname.endsWith("/registry.js"))
                                continue;
                        }
                        if (fname.endsWith)
                            ret[(serverModules ? "$serverside/" : "") + fname] = {
                                id: x,
                                modul: mod
                            };
                    }
                }
            }
        }
        async fillFilesInMapIfNeeded() {
            if (Server_1.filesInMap)
                return;
            var ret = {};
            await this.fillMapModules(ret, false);
            await this.fillMapModules(ret, true);
            Server_1.filesInMap = ret;
        }
        async addFilesFromMap(root) {
            await this.fillFilesInMapIfNeeded();
            for (var fname in Server_1.filesInMap) {
                if (fname.startsWith("$serverside"))
                    continue;
                let path = fname.split("/");
                var parent = root;
                for (let p = 0; p < path.length; p++) {
                    if (p + 1 < path.length) {
                        let dirname = path[p];
                        var found = undefined;
                        for (let f = 0; f < parent.files.length; f++) {
                            if (parent.files[f].name === dirname)
                                found = parent.files[f];
                        }
                        if (!found) {
                            found = {
                                flag: "fromMap",
                                name: dirname,
                                files: []
                            };
                            parent.files.push(found);
                        }
                        parent = found;
                    }
                    else {
                        parent.files.push({
                            flag: "fromMap",
                            name: path[p],
                            date: undefined
                        });
                    }
                }
            }
        }
        /**
        * gets alls ts/js-files from server
        * @param {Promise<string>} [async] - returns a Promise for asynchros handling
        * @returns {string[]} - list of files
        */
        async dir(withDate = false, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret;
                if ((await Server_1.isOnline(context)) === true)
                    ret = await this.call(this, this.dir, withDate, context);
                else
                    ret = { name: "", files: [] };
                await this.addFilesFromMap(ret);
                ret.fullpath = ""; //root
                let r = this._convertFileNode(ret);
                return r;
            }
            else {
                var rett = await (await Serverservice_3.serverservices.filesystem).dir("", withDate);
                return rett;
                // return ["jassijs/base/ChromeDebugger.ts"];
            }
        }
        async zip(directoryname, serverdir = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.zip, directoryname, serverdir, context);
            }
            else {
                return (await Serverservice_3.serverservices.filesystem).zip(directoryname, serverdir);
                // return ["jassijs/base/ChromeDebugger.ts"];
            }
        }
        /**
         * gets the content of a file from server
         * @param {string} fileNamew
         * @returns {string} content of the file
         */
        async loadFiles(fileNames, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.loadFiles, fileNames, context);
            }
            else {
                return (await Serverservice_3.serverservices.filesystem).loadFiles(fileNames);
                // return ["jassijs/base/ChromeDebugger.ts"];
            }
        }
        /**
         * gets the content of a file from server
         * @param {string} fileName
         * @returns {string} content of the file
         */
        async loadFile(fileName, context = undefined) {
            var fromServerdirectory = fileName.startsWith("$serverside/");
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                await this.fillFilesInMapIfNeeded();
                if (Server_1.filesInMap[fileName]) {
                    var foundOnLocalserver = false;
                    if (Config_3.config.serverrequire) {
                        var r = await new Promise((resolve) => {
                            Config_3.config.serverrequire(["jassijs/server/NativeAdapter"], (adapter) => {
                                resolve(adapter);
                            });
                        });
                        var fname = "./client/" + fileName;
                        if (fromServerdirectory)
                            fname = fileName.replace("$serverside/", "./");
                        if (r.exists && await r.exists(fname)) {
                            foundOnLocalserver = true;
                        }
                    }
                    if (foundOnLocalserver) {
                        //use ajax
                    }
                    else {
                        var found = Server_1.filesInMap[fileName];
                        let mapname = Config_3.config.modules[found.modul].split("?")[0] + ".map";
                        if (fromServerdirectory)
                            mapname = Config_3.config.server.modules[found.modul].split("?")[0] + ".map";
                        if (Config_3.config.modules[found.modul].indexOf(".js?") > -1)
                            mapname = mapname + "?" + Config_3.config.modules[found.modul].split("?")[1];
                        var code = await this.loadFile(mapname, context);
                        var data = JSON.parse(code).sourcesContent[found.id];
                        return data;
                    }
                }
                if (fromServerdirectory) {
                    return await this.call(this, this.loadFile, fileName, context);
                }
                else
                    return $.ajax({ url: fileName, dataType: "text" });
                //return await this.call(this,"loadFile", fileName);
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_13.JassiError("only admins can loadFile from Serverdirectory");
                var rett = await (await Serverservice_3.serverservices.filesystem).loadFile(fileName);
                return rett;
            }
        }
        /**
        * put the content to a file
        * @param [{string}] fileNames - the name of the file
        * @param [{string}] contents
        */
        async saveFiles(fileNames, contents, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var allfileNames = [];
                var allcontents = [];
                var alltsfiles = [];
                for (var f = 0; f < fileNames.length; f++) {
                    var _this = this;
                    var fileName = fileNames[f];
                    var content = contents[f];
                    if (!fileName.startsWith("$serverside/") && (fileName.endsWith(".tsx") || fileName.endsWith(".ts") || fileName.endsWith(".js"))) {
                        //var tss = await import("jassijs_editor/util/Typescript");
                        var tss = await Classes_13.classes.loadClass("jassijs_editor.util.Typescript");
                        var rets = await tss.instance.transpile(fileName, content);
                        allfileNames = allfileNames.concat(rets.fileNames);
                        allcontents = allcontents.concat(rets.contents);
                        alltsfiles.push(fileName);
                    }
                    else {
                        allfileNames.push(fileName);
                        allcontents.push(content);
                    }
                }
                var res = await this.call(this, this.saveFiles, allfileNames, allcontents, context);
                if (res === "") {
                    //@ts-ignore
                    new Promise((resolve_14, reject_14) => { require(["jassijs/ui/Notify"], resolve_14, reject_14); }).then(__importStar).then((el) => {
                        el.notify(fileName + " saved", "info", { position: "bottom right" });
                    });
                    //if (!fromServerdirectory) {
                    for (var x = 0; x < alltsfiles.length; x++) {
                        await $.ajax({ url: alltsfiles[x], dataType: "text" });
                    }
                    // }
                }
                else {
                    //@ts-ignore
                    new Promise((resolve_15, reject_15) => { require(["jassijs/ui/Notify"], resolve_15, reject_15); }).then(__importStar).then((el) => {
                        el.notify(fileName + " not saved", "error", { position: "bottom right" });
                    });
                    throw new Classes_13.JassiError(res);
                }
                return res;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_13.JassiError("only admins can saveFiles");
                var ret = (await Serverservice_3.serverservices.filesystem).saveFiles(fileNames, contents, true);
                return ret;
            }
        }
        /**
        * put the content to a file
        * @param {string} fileName - the name of the file
        * @param {string} content
        */
        async saveFile(fileName, content, context = undefined) {
            /*await this.fillFilesInMapIfNeeded();
            if (Server.filesInMap[fileName]) {
                //@ts-ignore
                 notify(fileName + " could not be saved on server", "error", { position: "bottom right" });
                return;
            }*/
            return await this.saveFiles([fileName], [content], context);
        }
        /**
       * deletes a server modul
       **/
        async testServersideFile(name, context = undefined) {
            if (!name.startsWith("$serverside/"))
                throw new Classes_13.JassiError(name + " is not a serverside file");
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.testServersideFile, name, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin) {
                    throw new Classes_13.JassiError("only admins can delete");
                }
                //@ts-ignore
                var test = (await new Promise((resolve_16, reject_16) => { require([name.replaceAll("$serverside/", "")], resolve_16, reject_16); }).then(__importStar)).test;
                var ret;
                if (test)
                    ret = await test();
                return ret;
            }
        }
        /**
       * deletes a server modul
       **/
        async removeServerModul(name, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.removeServerModul, name, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_13.JassiError("only admins can delete");
                return (await Serverservice_3.serverservices.filesystem).removeServerModul(name);
            }
        }
        /**
        * deletes a file or directory
        **/
        async delete(name, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.delete, name, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_13.JassiError("only admins can delete");
                return (await Serverservice_3.serverservices.filesystem).remove(name);
            }
        }
        /**
         * renames a file or directory
         **/
        async rename(oldname, newname, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.rename, oldname, newname, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_13.JassiError("only admins can rename");
                return (await Serverservice_3.serverservices.filesystem).rename(oldname, newname);
                ;
            }
        }
        /**
        * is the nodes server running
        **/
        static async isOnline(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                //no serviceworker no serverside implementation
                //@ts-ignore
                if (navigator.serviceWorker.controller === null)
                    return false;
                try {
                    if (this.isonline === undefined)
                        Server_1.isonline = await this.call(this.isOnline, context);
                    return await Server_1.isonline;
                }
                catch (_a) {
                    return false;
                }
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            }
            else {
                return true;
            }
        }
        /**
         * creates a file
         **/
        async createFile(filename, content, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.createFile, filename, content, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_13.JassiError("only admins can createFile");
                return (await Serverservice_3.serverservices.filesystem).createFile(filename, content);
            }
        }
        /**
        * creates a file
        **/
        async createFolder(foldername, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.createFolder, foldername, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_13.JassiError("only admins can createFolder");
                return (await Serverservice_3.serverservices.filesystem).createFolder(foldername);
            }
        }
        async createModule(modulename, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.createModule, modulename, context);
                if (!Config_3.config.modules[modulename]) {
                    //config.jsonData.modules[modulename] = modulename;
                    await Config_3.config.reload();
                }
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_13.JassiError("only admins can createFolder");
                return (await Serverservice_3.serverservices.filesystem).createModule(modulename);
            }
        }
        static async mytest(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.mytest, context);
            }
            else
                return 14; //this is called on server
        }
    };
    exports.Server = Server;
    Server.isonline = undefined;
    //files found in js.map of modules in the jassijs.json
    Server.filesInMap = undefined;
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsBoolean)({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Boolean, typeof (_a = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
    ], Server.prototype, "dir", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsString)()),
        __param(1, (0, Validator_8.ValidateIsBoolean)({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Boolean, typeof (_c = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _c : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "zip", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsArray)({ type: tp => String })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, typeof (_d = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _d : Object]),
        __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
    ], Server.prototype, "loadFiles", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_f = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _f : Object]),
        __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
    ], Server.prototype, "loadFile", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsArray)({ type: type => String })),
        __param(1, (0, Validator_8.ValidateIsArray)({ type: type => String })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Array, typeof (_h = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _h : Object]),
        __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
    ], Server.prototype, "saveFiles", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsString)()),
        __param(1, (0, Validator_8.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_k = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _k : Object]),
        __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
    ], Server.prototype, "saveFile", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_m = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _m : Object]),
        __metadata("design:returntype", typeof (_o = typeof Promise !== "undefined" && Promise) === "function" ? _o : Object)
    ], Server.prototype, "testServersideFile", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_p = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _p : Object]),
        __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
    ], Server.prototype, "removeServerModul", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_r = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _r : Object]),
        __metadata("design:returntype", typeof (_s = typeof Promise !== "undefined" && Promise) === "function" ? _s : Object)
    ], Server.prototype, "delete", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsString)()),
        __param(1, (0, Validator_8.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_t = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _t : Object]),
        __metadata("design:returntype", typeof (_u = typeof Promise !== "undefined" && Promise) === "function" ? _u : Object)
    ], Server.prototype, "rename", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_v = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _v : Object]),
        __metadata("design:returntype", typeof (_w = typeof Promise !== "undefined" && Promise) === "function" ? _w : Object)
    ], Server.prototype, "createFile", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_x = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _x : Object]),
        __metadata("design:returntype", typeof (_y = typeof Promise !== "undefined" && Promise) === "function" ? _y : Object)
    ], Server.prototype, "createFolder", null);
    __decorate([
        (0, Validator_8.ValidateFunctionParameter)(),
        __param(0, (0, Validator_8.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_z = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _z : Object]),
        __metadata("design:returntype", typeof (_0 = typeof Promise !== "undefined" && Promise) === "function" ? _0 : Object)
    ], Server.prototype, "createModule", null);
    exports.Server = Server = Server_1 = __decorate([
        (0, Registry_28.$Class)("jassijs.remote.Server"),
        __metadata("design:paramtypes", [])
    ], Server);
});
//@ts-ignore
define("jassijs/remote/Serverservice", ["require", "exports", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Classes_14, Registry_29) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runningServerservices = exports.doNotReloadModule = exports.serverservices = exports.ServerserviceProperties = void 0;
    exports.beforeServiceLoad = beforeServiceLoad;
    exports.$Serverservice = $Serverservice;
    Registry_29 = __importDefault(Registry_29);
    class ServerserviceProperties {
    }
    exports.ServerserviceProperties = ServerserviceProperties;
    var runningServerservices = {};
    exports.runningServerservices = runningServerservices;
    var beforeServiceLoadHandler = [];
    function beforeServiceLoad(func) {
        beforeServiceLoadHandler.push(func);
    }
    var serverservices = new Proxy(runningServerservices, {
        get(target, prop, receiver) {
            return new Promise(async (resolve, reject) => {
                var khsdf = runningServerservices;
                if (target[prop]) {
                    resolve(target[prop]);
                    return;
                }
                else {
                    var all = await Registry_29.default.getJSONData("$Serverservice");
                    for (var x = 0; x < all.length; x++) {
                        var serv = all[x];
                        var name = serv.params[0].name;
                        if (name === prop) {
                            var classname = serv.classname;
                            var cl = await Registry_29.default.getJSONData("$Class", classname);
                            //@ts-ignore
                            if (require.main) { //nodes load project class from module
                                /*for (var jfile in require.cache) {
                                    if(jfile.replaceAll("\\","/").endsWith(serv.filename.substring(0,serv.filename.length-2)+"js")){
                                        delete require.cache[jfile];
                                    }
                                }*/
                                //@ts-ignore
                                await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                            }
                            else {
                                await Classes_14.classes.loadClass(classname); //await import(classname.replaceAll(".", "/"));
                            }
                            var props = Registry_29.default.getData("$Serverservice", classname)[0].params[0];
                            for (var x = 0; x < beforeServiceLoadHandler.length; x++) {
                                await beforeServiceLoadHandler[x](prop, props);
                            }
                            var instance = props.getInstance();
                            target[prop] = instance;
                            resolve(instance);
                            return;
                        }
                    }
                }
                reject("serverservice not found:" + prop);
            });
        }
    });
    exports.serverservices = serverservices;
    function $Serverservice(properties) {
        return function (pclass) {
            Registry_29.default.register("$Serverservice", pclass, properties);
        };
    }
    var doNotReloadModule = true;
    exports.doNotReloadModule = doNotReloadModule;
});
define("jassijs/remote/Settings", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/security/Setting", "./Server", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, Registry_30, Registry_31, RemoteObject_5, Setting_1, Server_2, Serverservice_4, Validator_9) {
    "use strict";
    var Settings_2;
    var _a, _b, _c, _d;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.settings = exports.Settings = void 0;
    exports.$SettingsDescriptor = $SettingsDescriptor;
    exports.autostart = autostart;
    exports.test = test;
    exports.load = load;
    Registry_31 = __importDefault(Registry_31);
    const proxyhandler = {
        get: function (target, prop, receiver) {
            return prop;
        }
    };
    let Settings = Settings_2 = class Settings extends RemoteObject_5.RemoteObject {
        /**
        * loads the settings
        */
        static async load(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                //browser
                let entr = window.localStorage.getItem("jassijs.settings");
                if (entr) {
                    Settings_2.browserSettings = JSON.parse(entr);
                }
                else
                    Settings_2.browserSettings = {};
                var all = (await Server_2.Server.isOnline() === false) ? undefined : await this.call(this.load, context);
                if (all === null || all === void 0 ? void 0 : all.user) {
                    Settings_2.userSettings = JSON.parse(all.user.data);
                }
                else
                    Settings_2.userSettings = {};
                if (all === null || all === void 0 ? void 0 : all.allusers) {
                    Settings_2.allusersSettings = JSON.parse(all.allusers.data);
                }
                else
                    Settings_2.allusersSettings = {};
            }
            else {
                //@ts-ignore
                var man = await Serverservice_4.serverservices.db;
                var id = context.request.user.user;
                return {
                    user: await man.findOne(context, Setting_1.Setting, { "id": 1 }),
                    allusers: await man.findOne(context, Setting_1.Setting, { "id": 0 }),
                };
            }
        }
        static getAll(scope) {
            var ret = {};
            if (scope === "browser") {
                Object.assign(ret, Settings_2.browserSettings);
            }
            if (scope === "user") {
                Object.assign(ret, Settings_2.userSettings);
            }
            if (scope === "allusers") {
                Object.assign(ret, Settings_2.allusersSettings);
            }
            return ret;
        }
        gets(Settings_key) {
            if (Settings_2.browserSettings && Settings_2.browserSettings[Settings_key])
                return Settings_2.browserSettings[Settings_key];
            if (Settings_2.userSettings && Settings_2.userSettings[Settings_key])
                return Settings_2.userSettings[Settings_key];
            if (Settings_2.allusersSettings && Settings_2.allusersSettings[Settings_key])
                return Settings_2.allusersSettings[Settings_key];
            return undefined;
        }
        static async remove(Settings_key, scope, context = undefined) {
            if (scope === "browser") {
                delete Settings_2.browserSettings[Settings_key];
                window.localStorage.setItem("jassijs.settings", JSON.stringify(Settings_2.browserSettings));
            }
            if (scope === "user" || scope === "allusers") {
                if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                    if (scope == "user" && Settings_2.userSettings)
                        delete Settings_2.userSettings[Settings_key];
                    if (scope == "allusers" && Settings_2.allusersSettings)
                        delete Settings_2.allusersSettings[Settings_key];
                    this.call(this.remove, Settings_key, scope, context);
                }
                else {
                    //@ts-ignore
                    var man = await Serverservice_4.serverservices.db;
                    var id = context.request.user.user;
                    //first load
                    let entr = await man.findOne(context, Setting_1.Setting, { "id": (scope === "user" ? id : 0) });
                    if (entr !== undefined) {
                        var data = JSON.parse(entr.data);
                        delete data[Settings_key];
                        entr.data = JSON.stringify(data);
                        await man.save(context, entr);
                    }
                }
            }
        }
        static async save(Settings_key, value, scope) {
            let ob = {};
            //@ts-ignore
            ob[Settings_key] = value;
            return await this.saveAll(ob, scope);
        }
        static async saveAll(namevaluepair, scope, removeOtherKeys = false, context = undefined) {
            if (scope === "browser") {
                let entr = window.localStorage.getItem("jassijs.settings");
                var data = namevaluepair;
                if (entr) {
                    data = JSON.parse(entr);
                    Object.assign(data, namevaluepair);
                }
                if (removeOtherKeys)
                    data = namevaluepair;
                window.localStorage.setItem("jassijs.settings", JSON.stringify(data));
                if (removeOtherKeys)
                    Settings_2.browserSettings = {};
                Object.assign(Settings_2.browserSettings, namevaluepair);
            }
            if (scope === "user" || scope === "allusers") {
                if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                    var props = {};
                    Object.assign(props, namevaluepair);
                    if (scope == "user" && Settings_2.userSettings) {
                        if (removeOtherKeys)
                            Settings_2.userSettings = {};
                        Object.assign(Settings_2.userSettings, namevaluepair);
                    }
                    if (scope == "allusers" && Settings_2.allusersSettings) {
                        if (removeOtherKeys)
                            Settings_2.allusersSettings = {};
                        Object.assign(Settings_2.allusersSettings, namevaluepair);
                    }
                    return await this.call(this.saveAll, props, scope, removeOtherKeys, context);
                }
                else {
                    //@ts-ignore
                    var man = await Serverservice_4.serverservices.db;
                    var id = context.request.user.user;
                    //first load
                    let entr = await man.findOne(context, Setting_1.Setting, { "id": (scope === "user" ? id : 0) });
                    var data = namevaluepair;
                    if (removeOtherKeys !== true) {
                        if (entr !== undefined) {
                            data = JSON.parse(entr.data);
                            Object.assign(data, namevaluepair);
                        }
                    }
                    var newsetting = new Setting_1.Setting();
                    newsetting.id = (scope === "user" ? id : 0);
                    newsetting.data = JSON.stringify(data);
                    return await man.save(context, newsetting);
                    //return man.find(context, this, { "id": "admin" });
                }
            }
        }
    };
    exports.Settings = Settings;
    Settings.keys = new Proxy({}, proxyhandler); //the Proxy allwas give the key back
    Settings.browserSettings = undefined;
    Settings.userSettings = undefined;
    Settings.allusersSettings = undefined;
    __decorate([
        (0, Validator_9.ValidateFunctionParameter)(),
        __param(0, (0, Validator_9.ValidateIsString)()),
        __param(1, (0, Validator_9.ValidateIsIn)({ in: ["browser", "user", "allusers"] })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_a = typeof RemoteObject_5.Context !== "undefined" && RemoteObject_5.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], Settings, "remove", null);
    __decorate([
        (0, Validator_9.ValidateFunctionParameter)(),
        __param(0, (0, Validator_9.ValidateIsString)()),
        __param(2, (0, Validator_9.ValidateIsIn)({ in: ["browser", "user", "allusers"] })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_b = typeof T !== "undefined" && T) === "function" ? _b : Object, typeof (_c = typeof T !== "undefined" && T) === "function" ? _c : Object, String]),
        __metadata("design:returntype", Promise)
    ], Settings, "save", null);
    __decorate([
        (0, Validator_9.ValidateFunctionParameter)(),
        __param(1, (0, Validator_9.ValidateIsIn)({ in: ["browser", "user", "allusers"] })),
        __param(2, (0, Validator_9.ValidateIsBoolean)({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, Object, typeof (_d = typeof RemoteObject_5.Context !== "undefined" && RemoteObject_5.Context) === "function" ? _d : Object]),
        __metadata("design:returntype", Promise)
    ], Settings, "saveAll", null);
    exports.Settings = Settings = Settings_2 = __decorate([
        (0, Registry_30.$Class)("jassijs.remote.Settings")
    ], Settings);
    var settings = new Settings();
    exports.settings = settings;
    function $SettingsDescriptor() {
        return function (pclass) {
            Registry_31.default.register("$SettingsDescriptor", pclass);
        };
    }
    async function autostart() {
        await Settings.load();
    }
    async function test(t) {
        try {
            await Settings.load();
            var settings = new Settings();
            await Settings.remove("antestsetting", "user");
            await Settings.remove("antestsetting", "browser");
            await Settings.remove("antestsetting", "allusers");
            t.expectEqual(settings.gets("antestsetting") === undefined);
            await Settings.load();
            t.expectEqual(settings.gets("antestsetting") === undefined);
            await Settings.save("antestsetting", "1", "allusers");
            t.expectEqual(settings.gets("antestsetting") === "1");
            await Settings.load();
            t.expectEqual(settings.gets("antestsetting") === "1");
            await Settings.save("antestsetting", "2", "user");
            t.expectEqual(settings.gets("antestsetting") === "2");
            await Settings.load();
            t.expectEqual(settings.gets("antestsetting") === "2");
            await Settings.save("antestsetting", "3", "browser");
            t.expectEqual(settings.gets("antestsetting") === "3");
            await Settings.load();
            t.expectEqual(settings.gets("antestsetting") === "3");
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await Settings.remove("antestsetting", "user");
            await Settings.remove("antestsetting", "browser");
            await Settings.remove("antestsetting", "allusers");
        }
    }
    async function load() {
        return Settings.load();
    }
});
define("jassijs/remote/Test", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_32) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Test = void 0;
    let Test = class Test {
        /**
         * fails if the condition is false
         * @parameter condition
         **/
        expectEqual(condition) {
            if (!condition)
                throw new Error("Test fails");
        }
        /**
         * fails if the func does not throw an error
         * @parameter func - the function that should failed
         **/
        expectError(func) {
            try {
                if (func.toString().startsWith("async ")) {
                    var errobj;
                    try {
                        throw new Error("test fails");
                    }
                    catch (err) {
                        errobj = err;
                    }
                    func().then(() => {
                        throw errobj;
                    }).catch((err) => {
                        if (err.message === "test fails")
                            throw errobj;
                        var k = 1; //io
                    });
                    return;
                }
                else {
                    func();
                }
            }
            catch (_a) {
                return; //io
            }
            throw new Error("test fails");
        }
        /**
        * fails if the func does not throw an error
        * @parameter func - the function that should failed
        **/
        async expectErrorAsync(func) {
            var errors = false;
            try {
                var errobj;
                await func().then((e) => {
                }).catch((e) => {
                    errors = true;
                });
            }
            catch (_a) {
                errors = true;
            }
            if (!errors)
                throw new Error("test fails");
        }
    };
    exports.Test = Test;
    exports.Test = Test = __decorate([
        (0, Registry_32.$Class)("jassijs.remote.Test")
    ], Test);
});
define("jassijs/remote/Transaction", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject"], function (require, exports, Registry_33, RemoteObject_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transaction = exports.TransactionItem = void 0;
    //var serversession;
    class TransactionItem {
        constructor() {
            this.result = "**unresolved**";
        }
    }
    exports.TransactionItem = TransactionItem;
    let Transaction = class Transaction extends RemoteObject_6.RemoteObject {
        constructor() {
            super(...arguments);
            this.statements = [];
            this.context = new RemoteObject_6.Context();
        }
        async execute() {
            //  return this.context.register("transaction", this, async () => {
            for (var x = 0; x < this.statements.length; x++) {
                var it = this.statements[x];
                var context = {
                    isServer: false,
                    transaction: this,
                    transactionitem: it
                };
                it.promise = it.obj[it.method.name](...it.params, context);
                it.promise.then((val) => {
                    it.result = val; //promise returned or resolved out of Transaction
                });
            }
            let _this = this;
            await new Promise((res) => {
                _this.ready = res;
            });
            var ret = [];
            for (let x = 0; x < this.statements.length; x++) {
                var res = await this.statements[x].promise;
                ret.push(res);
            }
            return ret;
            //  });
        }
        async wait(transactionItem, prot) {
            transactionItem.remoteProtocol = prot;
            //if all transactions are placed then do the request
            var foundUnplaced = false;
            for (let x = 0; x < this.statements.length; x++) {
                let it = this.statements[x];
                if (it.result === "**unresolved**" && it.remoteProtocol === undefined)
                    foundUnplaced = true;
            }
            if (foundUnplaced === false) {
                this.sendRequest();
            }
            let _this = this;
            return new Promise((res) => {
                transactionItem.resolve = res;
            }); //await this.statements[id].result;//wait for result - comes with Request
        }
        async sendRequest(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var prots = [];
                for (let x = 0; x < this.statements.length; x++) {
                    let st = this.statements[x];
                    if (st.result !== "**unresolved**")
                        prots.push(undefined);
                    else
                        prots.push(st.remoteProtocol.stringify(st.remoteProtocol));
                }
                var sic = this.statements;
                this.statements = prots;
                var ret = await this.call(this, this.sendRequest, context);
                this.statements = sic;
                for (let x = 0; x < this.statements.length; x++) {
                    this.statements[x].resolve(ret[x]);
                }
                this.ready();
                //ret is not what we want - perhaps there is a modification
                /* let ret2=[];
                 for(let x=0;x<this.statements.length;x++){
                     ret2.push(await this.statements[x].promise);
                 }
                 this.resolve(ret);*/
                return true;
            }
            else {
                //@ts-ignore
                //@ts-ignore
                var ObjectTransaction = (await new Promise((resolve_17, reject_17) => { require(["jassijs/remote/ObjectTransaction"], resolve_17, reject_17); }).then(__importStar)).ObjectTransaction;
                var ot = new ObjectTransaction();
                ot.statements = [];
                let ret = [];
                for (let x = 0; x < this.statements.length; x++) {
                    var stat = {
                        result: "**unresolved**"
                    };
                    ot.statements.push(stat);
                }
                for (let x = 0; x < this.statements.length; x++) {
                    ret.push(this.doServerStatement(this.statements, ot, x, context));
                }
                for (let x = 0; x < ret.length; x++) {
                    ret[x] = await ret[x];
                }
                return ret;
            }
        }
        async doServerStatement(statements, ot /*:ObjectTransaction*/, num, context) {
            //@ts-ignore
            var _execute = (await new Promise((resolve_18, reject_18) => { require(["jassijs/server/DoRemoteProtocol"], resolve_18, reject_18); }).then(__importStar))._execute;
            var _this = this;
            var newcontext = {};
            Object.assign(newcontext, context);
            newcontext.objecttransaction = ot;
            newcontext.objecttransactionitem = ot.statements[num];
            //@ts-ignore
            ot.statements[num].result = _execute(_this.statements[num], context.request, newcontext);
            return ot.statements[num].result;
        }
        add(obj, method, ...params) {
            var ti = new TransactionItem();
            ti.method = method;
            ti.obj = obj;
            ti.params = params;
            ti.transaction = this;
            this.statements.push(ti);
        }
    };
    exports.Transaction = Transaction;
    exports.Transaction = Transaction = __decorate([
        (0, Registry_33.$Class)("jassijs.remote.Transaction")
    ], Transaction);
});
define("jassijs/remote/Validator", ["require", "exports", "reflect-metadata"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValidationIsStringOptions = exports.ValidationIsNumberOptions = exports.ValidationMinOptions = exports.ValidationMaxOptions = exports.ValidationIsIntOptions = exports.ValidationIsInstanceOfOptions = exports.ValidationIsInOptions = exports.ValidationIsDateOptions = exports.ValidationIsBooleanOptions = exports.ValidationIsArrayOptions = exports.ValidationError = exports.ValidationOptions = void 0;
    exports.registerValidation = registerValidation;
    exports.validate = validate;
    exports.ValidateIsArray = ValidateIsArray;
    exports.ValidateIsBoolean = ValidateIsBoolean;
    exports.ValidateIsDate = ValidateIsDate;
    exports.ValidateFunctionParameter = ValidateFunctionParameter;
    exports.ValidateIsIn = ValidateIsIn;
    exports.ValidateIsInstanceOf = ValidateIsInstanceOf;
    exports.ValidateIsInt = ValidateIsInt;
    exports.ValidateMax = ValidateMax;
    exports.ValidateMin = ValidateMin;
    exports.ValidateIsNumber = ValidateIsNumber;
    exports.ValidateIsString = ValidateIsString;
    exports.test = test;
    const paramMetadataKey = Symbol("paramMetadataKey");
    class ValidationOptions {
    }
    exports.ValidationOptions = ValidationOptions;
    function registerValidation(name, options, func) {
        return (target, propertyKey, parameterIndex) => {
            //@ts-ignore
            let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) || {};
            if (params[parameterIndex] === undefined)
                params[parameterIndex] = {};
            params[parameterIndex][name] = {
                func,
                options
            };
            //@ts-ignore
            Reflect.defineMetadata(paramMetadataKey, params, target, propertyKey);
        };
    }
    function translateMessage(msg, rule, property, target, value, options) {
        if (msg === undefined)
            return undefined;
        var ret = (options === null || options === void 0 ? void 0 : options.message) ? options === null || options === void 0 ? void 0 : options.message : msg;
        ret = ret.replaceAll("{rule}", rule).replaceAll("{property}", property).replaceAll("{target}", target).replaceAll("{value}", value);
        if (options) {
            for (var key in options) {
                ret = ret.replaceAll("{" + key + "}", options[key]);
            }
        }
        return ret;
    }
    class ValidationError {
        constructor(value, target, property, message) {
            this.value = value;
            this.target = target;
            this.property = property;
            this.message = message;
        }
    }
    exports.ValidationError = ValidationError;
    class ValidateOptions {
    }
    function validate(obj, options = undefined, raiseError = undefined) {
        var _a, _b;
        var ret = [];
        var target = obj.__proto__;
        for (var propertyName in obj) {
            //@ts-ignore
            let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyName);
            if (params) {
                for (var p in params) {
                    for (var rule in params[p]) {
                        //@ts-ignore
                        var val = obj[propertyName];
                        var func = params[p][rule].func;
                        var opts = Object.assign({}, params[p][rule].options);
                        if ((_a = options === null || options === void 0 ? void 0 : options.delegateOptions) === null || _a === void 0 ? void 0 : _a.ALL) {
                            opts = Object.assign(opts, (_b = options === null || options === void 0 ? void 0 : options.delegateOptions) === null || _b === void 0 ? void 0 : _b.ALL);
                        }
                        if ((options === null || options === void 0 ? void 0 : options.delegateOptions) && (options === null || options === void 0 ? void 0 : options.delegateOptions[rule])) {
                            opts = Object.assign(opts, options === null || options === void 0 ? void 0 : options.delegateOptions[rule]);
                        }
                        var err = func(target, propertyName, val, opts);
                        var test = translateMessage(err, rule, propertyName, obj, val, params[p][rule].options);
                        if (test !== undefined)
                            ret.push(new ValidationError(val, target, propertyName, test));
                    }
                }
            }
        }
        if (raiseError && ret.length > 0) {
            var sret = [];
            ret.forEach((err) => sret.push("ValidationError " + err.property + ": " + err.message));
            throw new Error(sret.join("\r\n"));
        }
        return ret;
    }
    class ValidationIsArrayOptions extends ValidationOptions {
    }
    exports.ValidationIsArrayOptions = ValidationIsArrayOptions;
    function ValidateIsArray(options) {
        return registerValidation("ValidateIsArray", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (!Array.isArray(val))
                return "value {value} is not an array";
            if (options === null || options === void 0 ? void 0 : options.type) {
                for (var x = 0; x < val.length; x++) {
                    var tp = options.type();
                    if (val[x] !== undefined && !(val[x] instanceof tp)) {
                        if (typeof val[x] === 'string' && tp == String)
                            continue;
                        if (typeof val[x] === 'number' && tp == Number)
                            continue;
                        if (typeof val[x] === 'boolean' && tp == Boolean)
                            continue;
                        if (options === null || options === void 0 ? void 0 : options.alternativeJsonProperties) {
                            for (var x = 0; x < options.alternativeJsonProperties.length; x++) {
                                var key = options.alternativeJsonProperties[x];
                                if (val[x][key] === undefined)
                                    return propertyName + " is not array of type " + tp.name;
                            }
                        }
                        else
                            return "value {value} is not an array ot type " + tp.name;
                    }
                }
            }
        });
    }
    class ValidationIsBooleanOptions extends ValidationOptions {
    }
    exports.ValidationIsBooleanOptions = ValidationIsBooleanOptions;
    function ValidateIsBoolean(options) {
        return registerValidation("ValidateIsBoolean", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (typeof val !== 'boolean')
                return propertyName + " is not a Boolean";
        });
    }
    class ValidationIsDateOptions extends ValidationOptions {
    }
    exports.ValidationIsDateOptions = ValidationIsDateOptions;
    function ValidateIsDate(options) {
        return registerValidation("ValidateIsDate", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (!(val instanceof Date && !isNaN(val.valueOf())))
                return propertyName + " is not a date";
        });
    }
    function ValidateFunctionParameter() {
        return (target, propertyName, descriptor, options) => {
            let method = descriptor.value;
            if (method === undefined)
                throw new Error("sdfgsdfgsfd");
            const funcname = method.name;
            const { [funcname]: newfunc } = {
                [funcname]: function () {
                    //@ts-ignore
                    let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyName);
                    if (params) {
                        for (var p in params) {
                            for (var rule in params[p]) {
                                //@ts-ignore
                                var arg = (p > arguments.length) ? undefined : arguments[p];
                                var val = arguments[p];
                                var func = params[p][rule].func;
                                var opt = params[p][rule].options;
                                var err = func(target, "parameter " + p, val, opt);
                                var test = translateMessage(err, rule, propertyName, target, val, params[p][rule].options);
                                if (test !== undefined)
                                    throw new Error(test);
                            }
                        }
                    }
                    return method.apply(this, arguments);
                }
            };
            descriptor.value = newfunc;
        };
    }
    class ValidationIsInOptions extends ValidationOptions {
    }
    exports.ValidationIsInOptions = ValidationIsInOptions;
    function ValidateIsIn(options) {
        return registerValidation("ValidateIsIn", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (options.in.indexOf(val) === -1)
                return propertyName + " is not valid";
        });
    }
    class ValidationIsInstanceOfOptions extends ValidationOptions {
    }
    exports.ValidationIsInstanceOfOptions = ValidationIsInstanceOfOptions;
    function ValidateIsInstanceOf(options) {
        return registerValidation("ValidateIsInstanceOf", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            var tp = options.type();
            if (!(val instanceof tp)) {
                if (options === null || options === void 0 ? void 0 : options.alternativeJsonProperties) {
                    for (var x = 0; x < options.alternativeJsonProperties.length; x++) {
                        var key = options.alternativeJsonProperties[x];
                        if (val[key] === undefined)
                            return propertyName + " is not of type " + tp.name;
                    }
                }
                else
                    return propertyName + " is not of type " + tp.name;
            }
        });
    }
    class ValidationIsIntOptions extends ValidationOptions {
    }
    exports.ValidationIsIntOptions = ValidationIsIntOptions;
    function ValidateIsInt(options) {
        return registerValidation("ValidateIsInt", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (!Number.isInteger(val))
                return propertyName + " is not an Integer";
        });
    }
    class ValidationMaxOptions extends ValidationOptions {
    }
    exports.ValidationMaxOptions = ValidationMaxOptions;
    function ValidateMax(options) {
        return registerValidation("ValidateMax", options, (target, propertyName, val, options) => {
            if ((options === null || options === void 0 ? void 0 : options.max) && val > (options === null || options === void 0 ? void 0 : options.max))
                return "value {value} is not longer then {max}";
        });
    }
    class ValidationMinOptions extends ValidationOptions {
    }
    exports.ValidationMinOptions = ValidationMinOptions;
    function ValidateMin(options) {
        return registerValidation("ValidateMin", options, (target, propertyName, val, options) => {
            if ((options === null || options === void 0 ? void 0 : options.min) && val < (options === null || options === void 0 ? void 0 : options.min))
                return "value {value} is not smaller then {min}";
        });
    }
    class ValidationIsNumberOptions extends ValidationOptions {
    }
    exports.ValidationIsNumberOptions = ValidationIsNumberOptions;
    function ValidateIsNumber(options) {
        return registerValidation("ValidateIsNumber", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (!(typeof val === 'number' && isFinite(val)))
                return propertyName + " is not a Number";
        });
    }
    class ValidationIsStringOptions extends ValidationOptions {
    }
    exports.ValidationIsStringOptions = ValidationIsStringOptions;
    function ValidateIsString(options) {
        return registerValidation("ValidateIsInt", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (typeof val !== 'string' && !(val instanceof String))
                return propertyName + " is not a String";
        });
    }
    class TestSample {
        constructor() {
            this.test = this;
            this.testarr = [this];
            this.num = 9.1;
            this.bol = true;
            this.inprop = 1;
        }
        async call(num, text = undefined) {
            return num;
        }
    }
    __decorate([
        ValidateIsInt({ message: "r:{rule} p:{property} v:{value}" }),
        ValidateMax({ max: 10, message: "{max}" }),
        ValidateMin({ min: 5, message: "{value} is smaller then {min}" }),
        __metadata("design:type", Number)
    ], TestSample.prototype, "id", void 0);
    __decorate([
        ValidateFunctionParameter(),
        __param(0, ValidateIsInt()),
        __param(1, ValidateIsString({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], TestSample.prototype, "call", null);
    __decorate([
        ValidateIsString({ optional: true, message: "no string" }),
        __metadata("design:type", Object)
    ], TestSample.prototype, "str", void 0);
    __decorate([
        ValidateIsInstanceOf({ type: t => TestSample }),
        __metadata("design:type", Object)
    ], TestSample.prototype, "test", void 0);
    __decorate([
        ValidateIsArray({ type: t => TestSample }),
        __metadata("design:type", Object)
    ], TestSample.prototype, "testarr", void 0);
    __decorate([
        ValidateIsNumber(),
        __metadata("design:type", Object)
    ], TestSample.prototype, "num", void 0);
    __decorate([
        ValidateIsBoolean(),
        __metadata("design:type", Object)
    ], TestSample.prototype, "bol", void 0);
    __decorate([
        ValidateIsIn({ in: [1, "2", "3"] }),
        __metadata("design:type", Object)
    ], TestSample.prototype, "inprop", void 0);
    async function test(test) {
        var obj = new TestSample();
        obj.id = 8;
        var hh = validate(obj);
        test.expectEqual(validate(obj).length === 0);
        //@ts-ignore
        obj.id = "8";
        test.expectEqual(validate(obj)[0].message === "r:ValidateIsInt p:id v:8");
        test.expectEqual(await obj.call(8) === 8);
        test.expectError(() => obj.call("8"));
        obj.id = 0;
        test.expectEqual(validate(obj)[0].message === "0 is smaller then 5");
        obj.id = 20;
        test.expectEqual(validate(obj)[0].message === "10");
        obj.str = 20;
        obj.id = 8;
        var hdh = validate(obj)[0].message;
        test.expectError(() => validate(obj, undefined, true));
        test.expectEqual(validate(obj)[0].message === "no string");
        test.expectEqual(await obj.call(8, "ok") === 8);
        test.expectError(() => obj.call("8", 8));
        test.expectEqual(await obj.call(8, "ok") === 8);
        obj.str = "kk";
        test.expectEqual(validate(obj).length === 0);
        obj.num = "1.2";
        test.expectError(() => validate(obj, undefined, true));
        obj.num = 1.2;
        obj.testarr = 8;
        test.expectError(() => validate(obj, undefined, true));
        obj.testarr = [8];
        test.expectError(() => validate(obj, undefined, true));
        obj.testarr = [];
        test.expectEqual(validate(obj).length === 0);
        obj.bol = "";
        test.expectError(() => validate(obj, undefined, true));
        obj.bol = true;
        test.expectEqual(validate(obj).length === 0);
        obj.test = { kk: 9 };
        test.expectError(() => validate(obj, undefined, true));
        obj.test = { id: 9 };
        test.expectEqual(validate(obj, {
            delegateOptions: {
                ValidateIsInstanceOf: { alternativeJsonProperties: ["id"] }
            }
        }).length === 0);
        obj.test = obj;
        obj.testarr = [{ id: 8 }];
        test.expectError(() => validate(obj, undefined, true));
        test.expectEqual(validate(obj, {
            delegateOptions: {
                ValidateIsArray: { alternativeJsonProperties: ["id"] }
            }
        }).length === 0);
        obj.testarr = [];
        test.expectEqual(validate(obj).length === 0);
        obj.inprop = 5;
        test.expectError(() => validate(obj, undefined, true));
        obj.inprop = "2";
        test.expectEqual(validate(obj).length === 0);
    }
    var l;
});
define("jassijs/security/GroupView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/remote/security/Group", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, NumberConverter_1, Textbox_1, Registry_34, Panel_2, Group_4, DBObjectView_1, Component_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GroupView = void 0;
    exports.test = test;
    let GroupView = class GroupView extends DBObjectView_1.DBObjectView {
        get title() {
            return this.value === undefined ? "GroupView" : "GroupView " + this.value.id;
        }
        render() {
            return (0, Component_3.jc)(Panel_2.Panel, {
                children: [
                    (0, Component_3.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_3.jc)(Textbox_1.Textbox, { converter: new NumberConverter_1.NumberConverter(), bind: this.states.value.bind.id, label: "Id" }),
                    (0, Component_3.jc)(Textbox_1.Textbox, { bind: this.states.value.bind.name, label: "Name" })
                ]
            });
        }
    };
    exports.GroupView = GroupView;
    exports.GroupView = GroupView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "jassijs.security.Group", icon: "mdi mdi-account-group", actionname: "Administration/Security/Groups" }),
        (0, Registry_34.$Class)("jassijs/security/GroupView")
    ], GroupView);
    async function test() {
        var gr = await Group_4.Group.findOne();
        var ret = new GroupView({ value: gr });
        return ret;
    }
});
define("jassijs/security/UserView", ["require", "exports", "jassijs/ui/Select", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/remote/security/User", "jassijs/ui/DBObjectView", "jassijs/ui/Notify", "jassijs/remote/security/Group", "jassijs/ui/Component"], function (require, exports, Select_1, Checkbox_1, NumberConverter_2, Textbox_2, Registry_35, Panel_3, User_2, DBObjectView_2, Notify_1, Group_5, Component_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserView = void 0;
    exports.test = test;
    let UserView = class UserView extends DBObjectView_2.DBObjectView {
        get title() {
            return this.value === undefined ? "User" : "User " + this.value.email;
        }
        render() {
            Group_5.Group.find().then((data) => {
                this.states.items.current = data;
            });
            return (0, Component_4.jc)(Panel_3.Panel, {
                children: [
                    (0, Component_4.jc)(DBObjectView_2.DBObjectViewToolbar, { view: this }),
                    (0, Component_4.jc)(Textbox_2.Textbox, { converter: new NumberConverter_2.NumberConverter(), bind: this.states.value.bind.id, label: "Id" }),
                    (0, Component_4.jc)(Textbox_2.Textbox, { bind: this.states.value.bind.email, label: "E-Mail" }),
                    (0, Component_4.jc)(Checkbox_1.Checkbox, { bind: this.states.value.bind.isAdmin, label: "IsAdmin" }),
                    (0, Component_4.jc)("br", {}),
                    (0, Component_4.jc)(Select_1.Select, {
                        bind: this.states.value.bind.groups, width: 200,
                        multiple: true,
                        items: this.states.items, label: "Groups", display: "name"
                    })
                ]
            });
        }
        createObject() {
            super.createObject();
            this.value.password = Math.random().toString(36).slice(-8); //random password
            (0, Notify_1.notify)("random password set: " + this.value.password, "info", { position: "right" });
            console.log("random password set: " + this.value.password);
        }
    };
    exports.UserView = UserView;
    exports.UserView = UserView = __decorate([
        (0, DBObjectView_2.$DBObjectView)({ classname: "jassijs.security.User", actionname: "Administration/Security/Users", icon: "mdi mdi-account-key-outline", queryname: "findWithRelations" }),
        (0, Registry_35.$Class)("jassijs/security/UserView")
    ], UserView);
    async function test() {
        var u = (await User_2.User.findWithRelations())[0];
        var ret = new UserView({
            value: u
        });
        return ret;
    }
});
define("jassijs/ui/ActionNodeMenu", ["require", "exports", "jassijs/ui/Menu", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Actions", "jassijs/base/ActionNode", "jassijs/ui/MenuItem"], function (require, exports, Menu_1, Registry_36, Panel_4, Actions_1, ActionNode_1, MenuItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionNodeMenu = exports.ActionNodeMenuProperties = void 0;
    exports.test = test;
    class ActionNodeMenuProperties {
    }
    exports.ActionNodeMenuProperties = ActionNodeMenuProperties;
    let ActionNodeMenu = class ActionNodeMenu extends Panel_4.Panel {
        constructor(props = {}) {
            super(props);
            this.me = {};
            this.layout(this.me);
        }
        config(config) {
            super.config(config);
            return this;
        }
        layout(me) {
            me.menu = new Menu_1.Menu();
            me.menu.width = 150;
            this.add(me.menu);
            this.fillActions();
        }
        async fillActions() {
            var actions = await Actions_1.Actions.getActionsFor([new ActionNode_1.ActionNode()]); //Class Actions
            actions.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            actions.forEach(action => {
                var path = action.name.split("/"); //childmenus
                var parent = this.me.menu;
                for (var i = 0; i < path.length; i++) {
                    if (i === path.length - 1) {
                        var men = new MenuItem_1.MenuItem();
                        men["_classaction"] = true;
                        men.text = path[i];
                        men.icon = action.icon;
                        men.onclick(() => {
                            action.call(undefined);
                        });
                        parent.add(men);
                    }
                    else {
                        var name = path[i];
                        var found = undefined;
                        parent._components.forEach((men) => {
                            if (men.text === name)
                                found = men.items;
                        });
                        if (found === undefined) {
                            var men = new MenuItem_1.MenuItem();
                            men["_classaction"] = true;
                            men.text = name;
                            parent.add(men);
                            parent = men.items;
                        }
                        else {
                            parent = found;
                        }
                    }
                }
            });
        }
    };
    exports.ActionNodeMenu = ActionNodeMenu;
    exports.ActionNodeMenu = ActionNodeMenu = __decorate([
        (0, Registry_36.$Class)("jassijs/ui/ActionNodeMenu"),
        __metadata("design:paramtypes", [ActionNodeMenuProperties])
    ], ActionNodeMenu);
    async function test() {
        var ret = new ActionNodeMenu();
        return ret;
    }
});
define("jassijs/ui/BoxPanel", ["require", "exports", "splitlib", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Classes"], function (require, exports, Split, Panel_5, Registry_37, Component_5, Property_1, Classes_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BoxPanel = void 0;
    exports.test = test;
    /// <amd-dependency path="splitlib" name="Split"/>
    let BoxPanel = class BoxPanel extends Panel_5.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = {}) {
            super(properties);
            this.domWrapper.classList.add('BoxPanel');
            this.domWrapper.classList.remove('Panel');
            this.horizontal = !(properties === null || properties === void 0 ? void 0 : properties.horizontal) === false;
            this.dom.style.display = "flex";
        }
        config(config) {
            super.config(config);
            return this;
        }
        set horizontal(value) {
            this._horizontal = value;
            if (value)
                this.dom.style["flex-direction"] = "row";
            else
                this.dom.style["flex-direction"] = "column";
            this.updateSpliter();
        }
        get horizontal() {
            return this._horizontal;
        }
        /**
        * adds a component to the container
        * @param {jassijs.ui.Component} component - the component to add
        */
        add(component) {
            super.add(component);
            this.updateSpliter();
        }
        /**
        * adds a component to the container before an other component
        * @param {jassijs.ui.Component} component - the component to add
        * @param {jassijs.ui.Component} before - the component before then component to add
        */
        addBefore(component, before) {
            super.addBefore(component, before);
            this.updateSpliter();
        }
        set spliter(size) {
            this._spliter = size;
            this.updateSpliter();
        }
        get spliter() {
            return this._spliter;
        }
        updateSpliter() {
            if (this._splitcomponent) {
                this._splitcomponent.destroy();
                this._splitcomponent = undefined;
            }
            if (!this._spliter)
                return;
            var comp = [];
            for (var x = 0; x < this._components.length; x++) {
                //test
                this._components[x].__dom.style.overflow = "scroll";
                this._components[x].__dom.style.width = (this.horizontal ? "calc(100% - 5px)" : "100%");
                this._components[x].__dom.style.height = (this.horizontal ? "100%" : "calc(100% - 5px)");
                comp.push(this._components[x].domWrapper);
            }
            this._splitcomponent = Split(comp, {
                sizes: this._spliter,
                gutterSize: 8,
                minSize: [50, 50, 50, 50, 50, 50, 50, 50],
                direction: this.horizontal ? 'horizontal' : 'vertical'
            });
        }
    };
    exports.BoxPanel = BoxPanel;
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], BoxPanel.prototype, "horizontal", null);
    __decorate([
        (0, Property_1.$Property)({ type: "number[]", description: "set the size of splitter e.g. [40,60] the firstcomponent size is 40%" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], BoxPanel.prototype, "spliter", null);
    exports.BoxPanel = BoxPanel = __decorate([
        (0, Component_5.$UIComponent)({ fullPath: "common/BoxPanel", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] }),
        (0, Registry_37.$Class)("jassijs.ui.BoxPanel"),
        (0, Property_1.$Property)({ name: "isAbsolute", hide: true, type: "boolean" }),
        __metadata("design:paramtypes", [Object])
    ], BoxPanel);
    async function test() {
        var HTMLPanel = await Classes_15.classes.loadClass("jassijs.ui.HTMLPanel");
        var ret = new BoxPanel();
        var me = {};
        ret["me"] = me;
        // ret.horizontal = true;
        me.tb = new HTMLPanel();
        me.tb2 = new HTMLPanel();
        me.tb.value = "l&ouml;&auml;k&ouml;lk &ouml;lsfdk sd&auml;&ouml;flgkdf ";
        me.tb.width = 135;
        me.tb2.value = "löäkölk ölsfdk sdäöflgkdf ";
        ret.add(me.tb);
        ret.add(me.tb2);
        ret.spliter = [40, 60];
        ret.height = 50;
        ret.width = "100%";
        return ret;
    }
    ;
});
define("jassijs/ui/Button", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Registry_38, Component_6, Property_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Button = void 0;
    exports.test = test;
    let Button = class Button extends Component_6.Component {
        constructor(properties = {}) {
            super(properties);
        }
        config(config, forceRender = false) {
            super.config(config);
            return this;
        }
        get dom() {
            return super.dom;
        }
        set dom(value) {
            super.dom = value;
        }
        render() {
            return React.createElement("button", Object.assign(Object.assign({}, this.props.domProperties), { className: "Button", contenteditable: false }), React.createElement("span", {
                className: "buttonspan"
            }, React.createElement("img", {
                style: { display: "none" },
                className: "buttonimg"
            }), React.createElement("span", {
                className: "buttontext"
            })));
        }
        onclick(handler, removeOldHandler = true) {
            if (removeOldHandler) {
                this.off("click");
            }
            return this.on("click", handler);
        }
        set icon(icon) {
            var img;
            if (icon === undefined)
                icon = "";
            if (this.dom === undefined || this.dom === null)
                debugger;
            var el1 = this.dom.querySelector(".buttonspan");
            el1.classList.forEach((cl) => { el1.classList.remove(cl); });
            el1.classList.add("buttonspan");
            this.dom.querySelector(".buttonimg").setAttribute("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi")) {
                icon.split(" ").forEach((cl) => { el1.classList.add(cl); });
                this.dom.querySelector(".buttonimg").style.display = "none";
            }
            else {
                this.dom.querySelector(".buttonimg").style.display = "initial";
                this.dom.querySelector(".buttonimg").setAttribute("src", icon);
            }
        }
        get icon() {
            var ret = this.dom.querySelector(".buttonimg").getAttribute("src");
            if (ret === "") {
                ret = this.dom.querySelector(".buttonspan").getAttribute("class").replace("buttonspan ", "");
            }
            return ret;
        }
        set text(value) {
            this.dom.querySelector(".buttontext").innerText = value === undefined ? "" : value;
        }
        get text() {
            var ret = this.dom.querySelector(".buttontext").innerText;
            if (ret === undefined)
                ret = "";
            return ret;
        }
        toggle(setDown = undefined) {
            if (setDown === undefined) {
                this.dom.classList.contains("down") ? this.dom.classList.remove("down") : this.dom.classList.add("down");
                return this.dom.classList.contains("down");
            }
            else {
                if (setDown && !this.dom.classList.contains("down"))
                    this.dom.classList.contains("down") ? this.dom.classList.remove("down") : this.dom.classList.add("down");
                if (!setDown && this.dom.classList.contains("down"))
                    this.dom.classList.contains("down") ? this.dom.classList.remove("down") : this.dom.classList.add("down");
                return this.dom.classList.contains("down");
            }
        }
        destroy() {
            super.destroy();
        }
    };
    exports.Button = Button;
    __decorate([
        (0, Property_2.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], Button.prototype, "onclick", null);
    __decorate([
        (0, Property_2.$Property)({ type: "image" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Button.prototype, "icon", null);
    __decorate([
        (0, Property_2.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Button.prototype, "text", null);
    exports.Button = Button = __decorate([
        (0, Component_6.$UIComponent)({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } }),
        (0, Registry_38.$Class)("jassijs.ui.Button"),
        __metadata("design:paramtypes", [Object])
    ], Button);
    async function test() {
        var Panel = (await (new Promise((resolve_19, reject_19) => { require(["jassijs/ui/Panel"], resolve_19, reject_19); }).then(__importStar))).Panel;
        var pan = new Panel();
        var but = new Button();
        but.text = "Hallo";
        but.icon = "mdi mdi-car"; //"mdi mdi-car";//"res/red.jpg";
        but.onclick(() => alert(1));
        //alert(but.icon);
        pan.add(but);
        pan.width = 100;
        pan.height = 100;
        return pan;
    }
});
define("jassijs/ui/Calendar", ["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ext/jquerylib"], function (require, exports, Textbox_3, Component_7, Registry_39, Property_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Calendar = void 0;
    exports.test = test;
    let Calendar = class Calendar extends Textbox_3.Textbox {
        constructor(properties = undefined) {
            super(properties);
            $(this.dom).datepicker();
        }
        config(config) {
            super.config(config);
            return this;
        }
        get value() {
            return $(this.dom).datepicker('getDate');
        }
        set value(val) {
            $(this.dom).datepicker('setDate', val);
        }
        static parseDate(date, format = undefined, settings = undefined) {
            if (settings === undefined)
                settings = $.datepicker.regional[navigator.language.split("-")[0]];
            if (format === undefined)
                format = settings.dateFormat;
            return $.datepicker.parseDate(format, date, settings);
        }
        static formatDate(date, format = undefined, settings = undefined) {
            if (settings === undefined)
                settings = $.datepicker.regional[navigator.language.split("-")[0]];
            if (format === undefined)
                format = settings.dateFormat;
            return $.datepicker.formatDate(format, date, settings);
        }
    };
    exports.Calendar = Calendar;
    exports.Calendar = Calendar = __decorate([
        (0, Component_7.$UIComponent)({ fullPath: "common/Calendar", icon: "mdi mdi-calendar-month" }),
        (0, Registry_39.$Class)("jassijs.ui.Calendar"),
        (0, Property_3.$Property)({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [Object])
    ], Calendar);
    function test() {
        var cal = new Calendar();
        cal.value = new Date(1978, 5, 1);
        var h = Calendar.parseDate("18.03.2020");
        var hh = Calendar.formatDate(h);
        var i = cal.value;
        // cal.value=Date.now()
        return cal;
    }
});
define("jassijs/ui/Checkbox", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/ui/DataComponent"], function (require, exports, Registry_40, Component_8, Property_4, DataComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Checkbox = void 0;
    exports.test = test;
    let Checkbox = class Checkbox extends DataComponent_1.DataComponent {
        /* get dom(){
             return this.dom;
         }*/
        constructor(properties = {}) {
            super(properties);
            //super.init('<div><input type="checkbox"><span class="checkboxtext" style="width:100%"></span></div>');
        }
        componentDidMount() {
            this.checkbox = this.dom.firstChild;
        }
        render() {
            //this.checkbox={current:undefined}
            return React.createElement("div", {}, React.createElement("input", Object.assign(Object.assign({}, this.props.domProperties), { type: "checkbox" })), React.createElement("span", {
                className: "checkboxtext",
                style: {
                    width: "100%"
                }
            }));
        }
        config(config) {
            super.config(config);
            return this;
        }
        onclick(handler) {
            this.on("click", function () {
                handler();
            });
        }
        set value(value) {
            if (value === "true")
                value = true;
            if (value === "false")
                value = false;
            this.checkbox.checked = value;
        }
        get value() {
            return this.checkbox.checked;
        }
        set text(value) {
            this.domWrapper.querySelector(".checkboxtext").innerHTML = (value === undefined ? "" : value);
        }
        get text() {
            return this.domWrapper.querySelector(".checkboxtext").innerHTML;
        }
    };
    exports.Checkbox = Checkbox;
    __decorate([
        (0, Property_4.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Checkbox.prototype, "onclick", null);
    __decorate([
        (0, Property_4.$Property)({ type: "boolean" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Checkbox.prototype, "value", null);
    __decorate([
        (0, Property_4.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Checkbox.prototype, "text", null);
    exports.Checkbox = Checkbox = __decorate([
        (0, Component_8.$UIComponent)({ fullPath: "common/Ceckbox", icon: "mdi mdi-checkbox-marked-outline" }),
        (0, Registry_40.$Class)("jassijs.ui.Checkbox"),
        __metadata("design:paramtypes", [Object])
    ], Checkbox);
    function test() {
        var cb = new Checkbox();
        cb.label = "label";
        cb.value = true;
        return cb;
    }
});
define("jassijs/ui/Component", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/CSSProperties", "jassijs/ui/State"], function (require, exports, Registry_41, Property_5, Registry_42, Classes_16, CSSProperties_1, State_1) {
    "use strict";
    var Component_9;
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextComponent = exports.HTMLComponent = exports.FunctionComponent = exports.Component = exports.React = exports.UIComponentProperties = void 0;
    exports.$UIComponent = $UIComponent;
    exports.jc = jc;
    exports.createComponent = createComponent;
    exports.createRef = createRef;
    exports.createRefs = createRefs;
    Registry_42 = __importDefault(Registry_42);
    //import { CSSProperties } from "jassijs/ui/Style";
    jassijs.includeCSSFile("jassijs.css");
    jassijs.includeCSSFile("materialdesignicons.min.css");
    //vergleichen
    //jeder bekommt componentid
    //gehe durch baum wenn dom_component fehlt, dann ist kopiert und muss mit id von componentid gerenderd werden
    class UIComponentProperties {
    }
    exports.UIComponentProperties = UIComponentProperties;
    function $UIComponent(properties) {
        return function (pclass) {
            Registry_42.default.register("$UIComponent", pclass, properties);
        };
    }
    var React = {
        createElement(type, props, ...children) {
            if (props === undefined || props === null) //TODO is this right?
                props = {};
            if ((children === null || children === void 0 ? void 0 : children.length) > 0) {
                props.children = children;
            }
            var ret = {
                props: props,
                type: type
            };
            //@ts-ignore
            for (var x = 0; x < Component._componentHook.length; x++) {
                //@ts-ignore
                Component._componentHook[x]("create", ret, "React.createElement");
            }
            return ret;
        }
    };
    exports.React = React;
    //@ts-ignore
    React.Component = class {
        constructor(props) {
            this.props = props;
        }
    };
    function jc(type, props) {
        return React.createElement(type, props);
    }
    function createFunctionComponent(type, props, ...children) {
        var p = props || {};
        p.renderFunc = type;
        var ret = new FunctionComponent(p);
        return ret;
    }
    window.React = React;
    function createComponent(node) {
        var _a, _b;
        var atype = node.type;
        var props = node.props;
        var ret;
        if (typeof atype === "string") {
            if (props === undefined)
                props = {};
            props.tag = atype;
            ret = new HTMLComponent(props);
        }
        else if (atype.constructor !== undefined) {
            if (atype.prototype._rerenderMe === undefined) { //Functioncompoment
                var p = props || {};
                p.renderFunc = atype;
                ret = new FunctionComponent(p);
            }
            else {
                ret = new atype(props);
            }
        }
        if (((_a = node === null || node === void 0 ? void 0 : node.props) === null || _a === void 0 ? void 0 : _a.children) !== undefined) {
            if (props === null || props === undefined)
                props = {};
            props.children = (_b = node === null || node === void 0 ? void 0 : node.props) === null || _b === void 0 ? void 0 : _b.children;
            for (var x = 0; x < props.children.length; x++) {
                //delegate renderFunc
                var child = props.children[x];
                /*if(child?.props?.calculateState){
                    props.calculateState=child?.props?.renderFunc;
                    delete child?.props?.calculateState;
                    
    
                }*/
                var cchild;
                if (typeof child === "string") {
                    cchild = new TextComponent();
                    cchild.tag = "";
                    cchild.text = child;
                    //child.dom = nd;
                }
                else if (child === null || child === void 0 ? void 0 : child._$isState$_) {
                    cchild = new TextComponent();
                    cchild.tag = "";
                    child === null || child === void 0 ? void 0 : child._observe_(cchild, "text", "property");
                    cchild.text = child.current;
                }
                else {
                    cchild = createComponent(child);
                }
                ret.add(cchild);
            }
        }
        if (props === null || props === void 0 ? void 0 : props.ref) {
            props.ref.current = ret;
            props === null || props === void 0 ? true : delete props.ref;
        }
        return ret;
    }
    function createRef(val = undefined) {
        var ret;
        ret.current = val;
        return ret;
    }
    function createRefs() {
        var me = {};
        var data = {};
        var ret = new Proxy(me, {
            get(target, key) {
                if (target[key] === undefined) {
                    target[key] = {
                        _current: undefined,
                        set current(value) {
                            data[key] = value;
                            me[key] = value;
                            this._current = value;
                        },
                        get current() {
                            return this._current;
                        }
                    };
                }
                return target[key];
            }
        });
        return ret;
    }
    //class TC <Prop>extends React.Component<Prop,{}>{
    let Component = Component_9 = class Component {
        /*  get domWrapper():Element{
              return this._domWrapper;
          }
          set domWrapper(element:Element){
              if(element===undefined){
                  debugger;
              }
              this._domWrapper=element;
          }*/
        /**
         * base class for each Component
         * @class jassijs.ui.Component
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = {}) {
            // super(properties, undefined);
            // if(properties===undefined)
            // properties={};
            this.refs = createRefs();
            this.states = (0, State_1.createStates)(properties);
            this.props = properties;
            (0, State_1.resolveState)(this, this.props);
            this._rerenderMe(true);
            this.config(this.props);
        }
        _rerenderMe(firstTime = false) {
            var _a;
            //@ts-ignore
            var rend = this.render(this.states);
            if (rend) {
                if (rend instanceof Node) {
                    this._initComponent(rend);
                }
                else {
                    if ((_a = rend === null || rend === void 0 ? void 0 : rend.props) === null || _a === void 0 ? void 0 : _a.calculateState) {
                        this.calculateState = rend.props.calculateState;
                        delete rend.props.calculateState;
                    }
                    var comp = createComponent(rend);
                    this._initComponent(comp.dom);
                }
            }
            if (firstTime)
                this.componentDidMount();
        }
        componentDidMount() {
        }
        render() {
            return undefined;
        }
        /*  rerender() {
              var alt = this.dom;
              this.init(this.lastinit, { replaceNode: this.dom });
              this.config(this.lastconfig);
          }*/
        config(config) {
            var _a, _b;
            var con = Object.assign({}, config);
            delete con.noWrapper;
            delete con.replaceNode;
            // this.lastconfig = config;
            var notfound = {};
            for (var key in con) {
                if (key in this) {
                    var me = this;
                    var val = con[key];
                    if (val === null || val === void 0 ? void 0 : val._$isState$_) {
                        val === null || val === void 0 ? void 0 : val._observe_(this, key, "property");
                        con[key] = val.current;
                        config[key] = con[key];
                    }
                    if (typeof me[key] === 'function') {
                        me[key](config[key]);
                    }
                    else {
                        if (((_a = me[key]) === null || _a === void 0 ? void 0 : _a._$isState$_) !== undefined) {
                            me[key].current = config[key];
                        }
                        else
                            me[key] = config[key];
                    }
                }
                else if (this.states && this.states._used.indexOf(key) !== -1) {
                    this.states[key].current = config[key];
                }
                else
                    notfound[key] = con;
            }
            if ((_b = this.states) === null || _b === void 0 ? void 0 : _b._onconfig)
                this.states._onconfig(config);
            Object.assign(this.props === undefined ? {} : this.props, config);
            if (Object.keys(notfound).length > 0) {
                if (this.calculateState) {
                    this.calculateState(config);
                    return this;
                }
                /* var rerender = this.render();
                 if (rerender) {
                     this.init(createComponent(rerender).dom);
                     
                 }*/
            }
            return this;
            //    return new c();
        }
        /**
         * called if the component is created
         */
        static onComponentCreated(func) {
            this._componentHook.push(func);
        }
        static offComponentCreated(func) {
            var pos = this._componentHook.indexOf(func);
            if (pos >= 0)
                this._componentHook.splice(pos, 1);
        }
        /**
         * adds an event
         * @param {type} name - the name of the event
         * @param {function} func - callfunction for the event
         */
        addEvent(name, func) {
            var events = this._eventHandler[name];
            if (events === undefined) {
                events = [];
                this._eventHandler[name] = events;
            }
            events.push(func);
        }
        /**
         * call the event
         * @param {name} name - the name of the event
         * @param {object} param 1- parameter for the event
         * @param {object} param 2- parameter for the event
         * @param {object} param 3- parameter for the event
         * @param {object} param 4- parameter for the event
         */
        callEvent(name, param1, param2 = undefined, param3 = undefined, param4 = undefined) {
            var ret = [];
            var events = this._eventHandler[name];
            if (events === undefined)
                return;
            for (var x = 0; x < events.length; x++) {
                ret.push(events[x](param1, param2, param3, param4));
            }
            return ret;
        }
        /**
         * @member {dom} - the dom element
         */
        get dom() {
            return this.__dom;
        }
        set dom(value) {
            var domalt = this.__dom;
            this.__dom = value;
            /** @member {dom} - the dom-element*/
            /** @member {numer}  - the id of the element */
            if (this.dom.classList) { //Textnode!
                this.dom.classList.add("jinlinecomponent");
                this.dom.classList.add("jresizeable");
                if (domalt !== undefined) {
                    domalt.classList.remove("jinlinecomponent");
                    domalt.classList.remove("jresizeable");
                }
            }
            if (this.dom._this && this.dom._this !== this) {
                if (this.dom._thisOther === undefined)
                    this.dom._thisOther = [];
                this.dom._thisOther.splice(0, 0, this.dom._this);
            }
            this.dom._this = this;
        }
        /**
       * inits the component
       * @param {dom} dom - init the dom element
       * @paran {object} properties - properties to init
      */
        _initComponent(dom) {
            // this.lastinit = dom;
            var oldwrapper = this.domWrapper;
            var olddom = this.dom;
            //is already attached
            if (this.domWrapper !== undefined) {
                var thisProperties = this.props;
                this.domWrapper._this = undefined;
            }
            if (this.dom !== undefined) {
                this.__dom._this = undefined;
            }
            //notify Hook
            for (var x = 0; x < Component_9._componentHook.length; x++) {
                Component_9._componentHook[x]("precreate", this);
            }
            //allready watched?
            // if (jassijs.componentSpy !== undefined) {
            //   jassijs.componentSpy.unwatch(this);
            // }
            this.dom = dom;
            this._id = olddom ? olddom.id : ("j" + Registry_42.default.nextID());
            if (this.dom.setAttribute !== undefined) //Textnode
                this.dom.setAttribute("id", this._id);
            /** @member {Object.<string,function>} - all event handlers*/
            this._eventHandler = {};
            //add _this to the dom element
            var lid = oldwrapper ? oldwrapper.id : ("j" + Registry_42.default.nextID());
            var st = 'style="display: inline-block"';
            if (this instanceof Classes_16.classes.getClass("jassijs.ui.Container")) {
                st = "";
            }
            if (this.props !== undefined && this.props.noWrapper === true) {
                this.domWrapper = this.dom;
                this.domWrapper._id = this._id;
                if (this.domWrapper.classList !== undefined)
                    this.domWrapper.classList.add("jcomponent");
            }
            else {
                /** @member {dom} - the dom element for label*/
                let strdom = '<div id="' + lid + '" class ="jcomponent"' + st + '></div>';
                this.domWrapper = Component_9.createHTMLElement(strdom);
                this.domWrapper._this = this;
                this.domWrapper._id = lid;
                this.domWrapper.appendChild(dom);
            }
            if ((oldwrapper === null || oldwrapper === void 0 ? void 0 : oldwrapper.parentNode) !== undefined) {
                oldwrapper.parentNode.replaceChild(this.domWrapper, oldwrapper); //removeChild(this.domWrapper);
            }
            //append temporary so new elements must not added immediately
            if (document.getElementById("jassitemp") === null) {
                var temp = Component_9.createHTMLElement('<template id="jassitemp"></template>');
                document.body.appendChild(temp);
            }
            //notify Hook
            for (var x = 0; x < Component_9._componentHook.length; x++) {
                Component_9._componentHook[x]("create", this);
            }
            //for profilling save code pos
            //if (jassijs.componentSpy !== undefined) {
            //     jassijs.componentSpy.watch(this);
            //  }
            if (!oldwrapper)
                document.getElementById("jassitemp").appendChild(this.domWrapper);
        }
        onfocus(handler) {
            return this.on("focus", handler);
        }
        onblur(handler) {
            return this.on("blur", handler);
        }
        /**
         * attach an eventhandler
         * @returns the handler to off the event
         */
        on(eventname, handler) {
            this.dom.addEventListener(eventname, handler);
            /*let func = function (e) {
                 handler(e);
             };*/
            return handler;
        }
        off(eventname, handler = undefined) {
            this.dom.removeEventListener(eventname, handler);
        }
        static cloneAttributes(target, source) {
            [...source.attributes].forEach(attr => { target.setAttribute(attr.nodeName === "id" ? 'data-id' : attr.nodeName, attr.nodeValue); });
        }
        static replaceWrapper(old, newWrapper) {
            //Component.cloneAttributes(newWrapper,old.domWrapper);
            var cls = old.domWrapper.getAttribute("class");
            var id = old.domWrapper.getAttribute("id"); //old.domWrapper._id;
            newWrapper.setAttribute("id", id);
            newWrapper.setAttribute("class", cls);
            while (old.domWrapper.children.length > 0) {
                newWrapper.appendChild(old.domWrapper.children[0]);
            }
            if (old.domWrapper.parentNode != null)
                old.domWrapper.parentNode.replaceChild(newWrapper, old.domWrapper);
            old.domWrapper = newWrapper;
            old.domWrapper._this = old;
            old.domWrapper._id = id;
        }
        /**
         * create an Element from an htmlstring e.g. createDom("<input/>")
         */
        static createHTMLElement(html) {
            var lower = html.toLocaleLowerCase();
            if (lower.startsWith("<td") || lower.startsWith("<tr")) {
                const template = document.createElement("template");
                template.innerHTML = html;
                const node = template.content.firstElementChild;
                return node;
            }
            else
                return document.createRange().createContextualFragment(html).children[0];
        }
        replaceDom(dom) {
            var oldwrapper = this.domWrapper;
            var olddom = this.dom;
            if (olddom === null || olddom === void 0 ? void 0 : olddom.parentNode) {
                olddom.parentNode.replaceChild(dom, olddom);
            }
            this.dom = dom;
            if (oldwrapper === olddom)
                this.domWrapper = dom;
            this.dom.setAttribute("id", olddom.getAttribute("id"));
        }
        set label(value) {
            if (value === undefined) {
                var lab = this.domWrapper.querySelector(".jlabel"); //this.domWrapper.getElementsByClassName("jlabel");
                if (lab)
                    this.domWrapper.removeChild(lab);
            }
            else {
                //CHECK children(0)-> first() 
                if (!this.domWrapper.querySelector(".jlabel")) {
                    let lab = Component_9.createHTMLElement('<label class="jlabel" for="' + this._id + '"></label>'); //
                    this.domWrapper.prepend(lab);
                }
                this.domWrapper.querySelector(".jlabel").innerHTML = value;
            }
        }
        get label() {
            var _a;
            return (_a = this.domWrapper.querySelector(".jlabel")) === null || _a === void 0 ? void 0 : _a.innerHTML;
        }
        get tooltip() {
            return this.dom.getAttribute("title");
        }
        set tooltip(value) {
            this.dom.setAttribute("title", value);
        }
        get x() {
            return Number(this.domWrapper.style.left.replace("px", ""));
        }
        set x(value) {
            this.domWrapper.style.left = value.toString().replace("px", "") + "px";
            this.domWrapper.style.position = "absolute";
        }
        get y() {
            return Number(this.domWrapper.style.top.replace("px", ""));
        }
        set y(value) {
            this.domWrapper.style.top = value.toString().replace("px", "") + "px";
            this.domWrapper.style.position = "absolute";
        }
        get hidden() {
            return (this.dom.getAttribute("hidden") === "");
        }
        set hidden(value) {
            if (value)
                this.dom.setAttribute("hidden", "");
            else
                this.dom.removeAttribute("hidden");
        }
        set width(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            value = value.toString();
            if (!isNaN(value))
                value = value + "px";
            if (typeof (value) === "string" && value.indexOf("%") > -1 && this.domWrapper.style.display !== "inline") {
                this.dom.style.width = "100%";
                this.domWrapper.style.width = value;
            }
            else {
                this.dom.style.width = value.toString();
                this.domWrapper.style.width = "";
            }
            //  
        }
        get width() {
            if (this.domWrapper.style.width !== undefined)
                return this.domWrapper.style.width;
            return this.dom.style.width.replace("px", "");
        }
        set height(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            value = value.toString();
            if (!isNaN(value))
                value = value + "px";
            if (typeof (value) === "string" && value.indexOf("%") > -1) {
                this.dom.style.height = "100%";
                this.domWrapper.style.height = value;
            }
            else {
                this.dom.style.height = value.toString();
                this.domWrapper.style.height = "";
            }
        }
        get height() {
            if (this.domWrapper.style.height !== undefined)
                return this.domWrapper.style.height;
            if (this.dom.style.height !== undefined)
                return undefined;
            return this.dom.style.height.replace("px", "");
        }
        set style(properties) {
            var prop = CSSProperties_1.CSSProperties.applyTo(properties, this);
            for (let key in prop) {
                this.dom.style[key] = prop[key];
            }
            //if css-properties are already set and now a properties is deleted
            if (this["_lastCssChange"]) {
                for (let key in this["_lastCssChange"]) {
                    if (prop[key] === undefined) {
                        this.dom.style[key] = "";
                    }
                }
            }
            this["_lastCssChange"] = prop;
        }
        /**
         * maximize the component
         */
        maximize() {
            this.dom.style.width = "calc(100% - 2px)";
            this.dom.style.height = "calc(100% - 2px)";
        }
        get styles() {
            return this._styles;
        }
        set styles(styles) {
            this._styles = styles;
            var newstyles = [];
            styles.forEach((st) => {
                newstyles.push(st.styleid);
            });
            //removeOld
            var classes = this.dom.getAttribute("class").split(" ");
            classes.forEach((cl) => {
                if (cl.startsWith("jassistyle") && newstyles.indexOf(cl) === -1) {
                    this.dom.classList.remove(cl);
                }
            });
            newstyles.forEach((st) => {
                if (classes.indexOf(st) === -1)
                    this.dom.classList.add(st);
            });
        }
        get contextMenu() {
            return this._contextMenu;
        }
        set contextMenu(value) {
            if (this._contextMenu !== undefined)
                this._contextMenu.unregisterComponent(this);
            if (value !== undefined) {
                if (value.current)
                    value = value.current;
                var ContextMenu = Classes_16.classes.getClass("jassijs.ui.ContextMenu");
                if (value instanceof ContextMenu === false) {
                    throw new Error("value is not of type jassijs.ui.ContextMenu");
                }
                this._contextMenu = value;
                value.registerComponent(this);
            }
            else
                this._contextMenu = undefined;
        }
        destroy() {
            if (this.contextMenu !== undefined) {
                this.contextMenu.destroy();
            }
            //notify Hook
            for (var x = 0; x < Component_9._componentHook.length; x++) {
                Component_9._componentHook[x]("destroy", this);
            }
            // if (jassijs.componentSpy !== undefined) {
            //    jassijs.componentSpy.unwatch(this);
            //  }
            if (this._parent !== undefined) {
                this._parent.remove(this);
            }
            if (this.domWrapper !== undefined && this.domWrapper.parentNode !== undefined && this.domWrapper.parentNode !== null)
                this.domWrapper.parentNode.removeChild(this.domWrapper);
            if (this.__dom !== undefined) {
                this.__dom.remove();
                this.__dom._this = undefined;
                this.__dom = undefined;
            }
            if (this.domWrapper !== undefined) {
                this.domWrapper.remove();
                this.domWrapper._this = undefined;
                this.domWrapper = undefined;
            }
            this.events = [];
        }
        extensionCalled(action) {
        }
        /**
         * @deprecated React things-not implemented
         */
        /**
        * @deprecated React things-not implemented
        */
        setState() {
            throw new Error("not implemented");
        }
        /**
         * @deprecated React things-not implemented
         */
        forceUpdate() {
            throw new Error("not implemented");
        }
    };
    exports.Component = Component;
    Component._componentHook = [];
    __decorate([
        (0, Property_5.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Component.prototype, "onfocus", null);
    __decorate([
        (0, Property_5.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Component.prototype, "onblur", null);
    __decorate([
        (0, Property_5.$Property)({ description: "adds a label above the component" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Component.prototype, "label", null);
    __decorate([
        (0, Property_5.$Property)({ description: "tooltip are displayed on mouse over" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Component.prototype, "tooltip", null);
    __decorate([
        (0, Property_5.$Property)(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], Component.prototype, "x", null);
    __decorate([
        (0, Property_5.$Property)(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], Component.prototype, "y", null);
    __decorate([
        (0, Property_5.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Component.prototype, "hidden", null);
    __decorate([
        (0, Property_5.$Property)({ type: "number" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "width", null);
    __decorate([
        (0, Property_5.$Property)({ type: "number" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "height", null);
    __decorate([
        (0, Property_5.$Property)({ type: "json", componentType: "jassijs.ui.CSSProperties" }),
        __metadata("design:type", typeof (_a = typeof React !== "undefined" && React.CSSProperties) === "function" ? _a : Object),
        __metadata("design:paramtypes", [typeof (_b = typeof React !== "undefined" && React.CSSProperties) === "function" ? _b : Object])
    ], Component.prototype, "style", null);
    __decorate([
        (0, Property_5.$Property)({ type: "componentselector", componentType: "[jassijs.ui.Style]" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], Component.prototype, "styles", null);
    __decorate([
        (0, Property_5.$Property)({ type: "componentselector", componentType: "jassijs.ui.ContextMenu" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "contextMenu", null);
    exports.Component = Component = Component_9 = __decorate([
        (0, Registry_41.$Class)("jassijs.ui.Component"),
        (0, Property_5.$Property)({ name: "testuw", type: "string" })
        //@ts-ignore
        ,
        __metadata("design:paramtypes", [Object])
    ], Component);
    /*interface FunctionComponentProperties extends ComponentProperties, Omit<React.HTMLProps<Element>, "contextMenu"> {
        tag?: string;
        children?;
        renderFunc;
        calculateState?: (prop) => void;
    }*/
    class FunctionComponent extends Component {
        constructor(properties) {
            super(properties);
            this._components = [];
        }
        config(config, forceRender = false) {
            super.config(config);
            return this;
        }
        render() {
            var Rend = this.props.renderFunc;
            var ret = new Rend(this.props, this.states);
            if (ret.props.calculateState) {
                //@ts-ignore
                this.calculateState = ret.props.calculateState;
                //this.calculateState(this.props);
            }
            return ret;
        }
        /**
        * adds a component to the container
        * @param {jassijs.ui.Component} component - the component to add
        */
        add(component) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper._parent = this;
            this._components.push(component);
            this.dom.appendChild(component.domWrapper);
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper["_parent"] = this;
            var index = this._components.indexOf(before);
            if (component.domWrapper.parentNode !== null && component.domWrapper.parentNode !== undefined) {
                component.domWrapper.parentNode.removeChild(component.domWrapper);
            }
            this._components.splice(index, 0, component);
            before.domWrapper.parentNode.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
        }
        /**
        * remove the component
        * @param {jassijs.ui.Component} component - the component to remove
        * @param {boolean} destroy - if true the component would be destroyed
        */
        remove(component, destroy = false) {
            if (destroy)
                component.destroy();
            component._parent = undefined;
            if (component.domWrapper !== undefined)
                component.domWrapper._parent = undefined;
            if (this._components) {
                var pos = this._components.indexOf(component);
                if (pos >= 0)
                    this._components.splice(pos, 1);
            }
            try {
                this.dom.removeChild(component.domWrapper);
            }
            catch (ex) {
            }
        }
        /**
        * remove all component
        * @param {boolean} destroy - if true the component would be destroyed
        */
        removeAll(destroy = undefined) {
            while (this._components.length > 0) {
                this.remove(this._components[0], destroy);
            }
        }
        destroy() {
            if (this._components !== undefined) {
                var tmp = [].concat(this._components);
                for (var k = 0; k < tmp.length; k++) {
                    tmp[k].destroy();
                }
                this._components = [];
            }
            super.destroy();
        }
    }
    exports.FunctionComponent = FunctionComponent;
    function doCreateDummyForHTMLComponent(component, isPreDummy) {
        var disabledBoth = ["tr", "td", "th"];
        var enabledPost = ["div"];
        var disabledPre = [];
        var tag = component === null || component === void 0 ? void 0 : component.tag;
        if (tag === undefined)
            return false;
        if (disabledBoth.indexOf(tag.toLowerCase()) !== -1) {
            return false;
        }
        else if (isPreDummy && disabledPre.indexOf(tag.toLowerCase()) !== -1) {
            return false;
        }
        else if (!isPreDummy && enabledPost.indexOf(tag.toLowerCase()) !== -1) {
            return true;
        }
        return isPreDummy; //prodummy is enabled at default / postdummy is disabled 
    }
    // ret.tag = atype;
    //        var newdom = document.createElement(atype);
    let HTMLComponent = class HTMLComponent extends Component {
        constructor(prop = {}) {
            super(Object.assign(prop, { noWrapper: true }));
            this._components = [];
            //this.init(document.createElement(tag), { noWrapper: true });
        }
        render() {
            var _a, _b, _c, _d;
            var ret;
            var tag = ((_a = this.props) === null || _a === void 0 ? void 0 : _a.tag) === undefined ? "span" : (_b = this.props) === null || _b === void 0 ? void 0 : _b.tag;
            if (((_c = this.props) === null || _c === void 0 ? void 0 : _c.tag) !== this.tag.toLowerCase()) {
                var childs = (_d = this.dom) === null || _d === void 0 ? void 0 : _d.childNodes;
                ret = document.createElement(tag);
                //this.init(document.createElement(tag), { replaceNode: this.dom, noWrapper: true });
                if ((childs === null || childs === void 0 ? void 0 : childs.length) > 0)
                    ret.append(...childs);
            }
            return ret;
        }
        config(props) {
            var _a;
            var tag = (props === null || props === void 0 ? void 0 : props.tag) === undefined ? "span" : props === null || props === void 0 ? void 0 : props.tag;
            if ((props === null || props === void 0 ? void 0 : props.tag) !== undefined && (props === null || props === void 0 ? void 0 : props.tag) !== this.tag.toLowerCase()) {
                var childs = (_a = this.dom) === null || _a === void 0 ? void 0 : _a.childNodes;
                this.replaceDom(document.createElement(tag));
                //            this.init(document.createElement(tag), { replaceNode: this.dom, noWrapper: true });
                if ((childs === null || childs === void 0 ? void 0 : childs.length) > 0)
                    this.dom.append(...childs);
            }
            super.config(props);
            for (var prop in props) {
                var val = props[prop];
                if (prop === "style") {
                    for (var key in props.style) {
                        val = props.style[key];
                        this.dom.style[key] = val;
                    }
                }
                else if (prop in this.dom) {
                    Reflect.set(this.dom, prop, val);
                    //Reflect.set(this.dom, prop, [val])
                }
                else if (prop.toLocaleLowerCase() in this.dom) {
                    Reflect.set(this.dom, prop.toLocaleLowerCase(), val);
                }
                else if (prop in this.dom) {
                    if (val === null || val === void 0 ? void 0 : val._$isState$_) {
                        val === null || val === void 0 ? void 0 : val._observe_(this, prop, "attribute");
                        val = val.current;
                    }
                    this.dom.setAttribute(prop, val);
                }
                // }
            }
            if (props === null || props === void 0 ? void 0 : props.children) {
                if ((props === null || props === void 0 ? void 0 : props.children.length) > 0 && (props === null || props === void 0 ? void 0 : props.children[0]) instanceof Component) {
                    this.removeAll(false);
                    for (var x = 0; x < props.children.length; x++) {
                        this.add(props.children[x]);
                    }
                    delete props.children;
                }
            }
            return this;
        }
        set tag(value) {
            var tag = value == undefined ? "span" : value;
            if (tag.toLowerCase() !== this.tag.toLowerCase()) {
                this.props.tag = value;
                this.config(this.props);
                /*
                var childs = this.dom?.childNodes;
                this.init(document.createElement(value), { replaceNode: this.dom, noWrapper: true });
                if (childs?.length > 0)
                    this.dom.append(...<any>childs);
                */
            }
        }
        get tag() {
            var _a;
            var ret = (_a = this.dom) === null || _a === void 0 ? void 0 : _a.tagName;
            if (ret === null || ret === undefined)
                return "";
            return ret;
        }
        /**
        * adds a component to the container
        * @param {jassijs.ui.Component} component - the component to add
        */
        add(component) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper._parent = this;
            /* component._parent=this;
             component.domWrapper._parent=this;
             if(component.domWrapper.parentNode!==null&&component.domWrapper.parentNode!==undefined){
                  component.domWrapper.parentNode.removeChild(component.domWrapper);
             }*/
            this._components.push(component);
            this.dom.appendChild(component.domWrapper);
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper["_parent"] = this;
            var index = this._components.indexOf(before);
            if (component.domWrapper.parentNode !== null && component.domWrapper.parentNode !== undefined) {
                component.domWrapper.parentNode.removeChild(component.domWrapper);
            }
            this._components.splice(index, 0, component);
            before.domWrapper.parentNode.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
        }
        /**
        * remove the component
        * @param {jassijs.ui.Component} component - the component to remove
        * @param {boolean} destroy - if true the component would be destroyed
        */
        remove(component, destroy = false) {
            if (destroy)
                component.destroy();
            component._parent = undefined;
            if (component.domWrapper !== undefined)
                component.domWrapper._parent = undefined;
            if (this._components) {
                var pos = this._components.indexOf(component);
                if (pos >= 0)
                    this._components.splice(pos, 1);
            }
            try {
                this.dom.removeChild(component.domWrapper);
            }
            catch (ex) {
            }
        }
        /**
        * remove all component
        * @param {boolean} destroy - if true the component would be destroyed
        */
        removeAll(destroy = undefined) {
            while (this._components.length > 0) {
                this.remove(this._components[0], destroy);
            }
        }
        destroy() {
            if (this._components !== undefined) {
                var tmp = [].concat(this._components);
                for (var k = 0; k < tmp.length; k++) {
                    tmp[k].destroy();
                }
                this._components = [];
            }
            super.destroy();
        }
    };
    exports.HTMLComponent = HTMLComponent;
    __decorate([
        (0, Property_5.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLComponent.prototype, "tag", null);
    exports.HTMLComponent = HTMLComponent = __decorate([
        (0, Registry_41.$Class)("jassijs.ui.HTMLComponent"),
        (0, Property_5.$Property)({ name: "children", type: "jassijs.ui.Component", createDummyInDesigner: doCreateDummyForHTMLComponent }),
        __metadata("design:paramtypes", [Object])
    ], HTMLComponent);
    let TextComponent = class TextComponent extends Component {
        constructor(props = {}) {
            super(Object.assign(props, { noWrapper: true }));
        }
        get label() {
            return "";
        }
        get width() {
            return 0;
        }
        get height() {
            return 0;
        }
        get x() {
            return 0;
        }
        get y() {
            return 0;
        }
        get tooltip() {
            return "";
        }
        get hidden() {
            return false;
        }
        render() {
            var _a;
            var text = (_a = this.props) === null || _a === void 0 ? void 0 : _a.text;
            if (text === undefined)
                text = "";
            return document.createTextNode(text);
        }
        config(props) {
            //  if (this.dom === undefined) {
            //      this.init(<any>document.createTextNode(props?.text));
            //  }
            super.config(props);
            return this;
        }
        get text() {
            var _a;
            return (_a = this.dom) === null || _a === void 0 ? void 0 : _a.textContent;
        }
        ;
        set text(value) {
            // var p = JSON.parse(value);//`{"a":"` + value + '"}').a;
            this.dom.textContent = value;
        }
        ;
    };
    exports.TextComponent = TextComponent;
    __decorate([
        (0, Property_5.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], TextComponent.prototype, "text", null);
    exports.TextComponent = TextComponent = __decorate([
        (0, Registry_41.$Class)("jassijs.ui.TextComponent"),
        __metadata("design:paramtypes", [Object])
    ], TextComponent);
});
define("jassijs/ui/ComponentDescriptor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Registry_43, Property_6, Classes_17, Registry_44) {
    "use strict";
    var ComponentDescriptor_3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDescriptor = void 0;
    Registry_44 = __importDefault(Registry_44);
    let ComponentDescriptor = ComponentDescriptor_3 = class ComponentDescriptor {
        /**
        * describes a Component
        * @class jassijs.ui.EditorProperty
        */
        constructor() {
            /** @member {[jassijs.ui.Property]}  - all property fields which should visible in PropertyEditor*/
            this.fields = [];
            /** @member {[jassijs.ui.Property]}  - all property fields which acts are editable*/
            this.editableComponents = [];
        }
        findField(name) {
            for (var x = 0; x < this.fields.length; x++) {
                if (this.fields[x].name === name) {
                    return this.fields[x];
                }
            }
            return undefined;
        }
        /**
         * describes a class
         * @param {class}  type - the type of the class
         * @param {boolean}  nocache - an uncached version
         * @returns {jassijs.ui.ComponentDescriptor} - which describes the component
         */
        static describe(type, nocache = undefined) {
            var _a;
            if (ComponentDescriptor_3.cache === undefined) {
                ComponentDescriptor_3.cache = {};
            }
            var cache = ComponentDescriptor_3.cache[type];
            var allFields = [];
            var isDescribeComponentOverided = undefined;
            if (cache === undefined || nocache === true) {
                var family = [];
                if (type.customComponentDescriptor) {
                    cache = type.customComponentDescriptor();
                }
                else {
                    cache = new ComponentDescriptor_3();
                    cache.fields = [];
                    var hideBaseClassProperties = false;
                    do {
                        family.push(type);
                        var sclass = Classes_17.classes.getClassName(type);
                        if (Registry_44.default.getMemberData("$Property") === undefined)
                            return cache;
                        var props = Registry_44.default.getMemberData("$Property")[sclass];
                        /*if(props?.new){
                            var clname=props.new[0][0].componentType;
                            if(classes.getClass(clname)){
                                type=classes.getClass(clname);
                                sclass = classes.getClassName(type);
                                props = registry.getMemberData("$Property")[sclass];
                            }
                        }*/
                        if (props !== undefined) {
                            var info = Registry_44.default.getMemberData("design:type")[sclass];
                            for (var key in props) {
                                var data = props[key];
                                for (let x = 0; x < data.length; x++) {
                                    if ((_a = data[x][0]) === null || _a === void 0 ? void 0 : _a.hideBaseClassProperties) {
                                        hideBaseClassProperties = data[x][0].hideBaseClassProperties;
                                        continue;
                                    }
                                    var prop = new Property_6.Property(key);
                                    Object.assign(prop, data[x][0]);
                                    if (prop.type === undefined) {
                                        if (info !== undefined && info[key] !== undefined) {
                                            var tp = info[key][0][0];
                                            if (tp.name === "String")
                                                prop.type = "string";
                                            else if (tp.name === "Number")
                                                prop.type = "number";
                                            else if (tp.name === "Boolean")
                                                prop.type = "boolean";
                                            else if (tp.name === "Function")
                                                prop.type = "function";
                                            else
                                                prop.type = Classes_17.classes.getClassName(tp);
                                        }
                                    }
                                    if (prop.type === undefined && prop.hide !== true)
                                        throw "Property Type not found:" + sclass + "." + key;
                                    if (cache.fields !== undefined && allFields.indexOf(prop.name) === -1) {
                                        cache.fields.push(prop);
                                        allFields.push(prop.name);
                                    }
                                }
                            }
                        }
                        type = type.__proto__;
                    } while (type !== null && type.name !== "" && !hideBaseClassProperties);
                    //Hidden fields
                    if (cache.fields !== undefined) {
                        for (let c = 0; c < cache.fields.length; c++) {
                            if (cache.fields[c].hide === true) {
                                cache.fields.splice(c--, 1);
                            }
                        }
                    }
                }
            }
            return cache;
        }
        /**
         * get the ids of all editable Components by the designer
         * @param {jassijs.ui.Component} component - the component to inspect
         * @param {boolean} idFromLabel - if true not the id but the id form label is returned
         * @param {flag} - undocumented-used for recursation
         **/
        static getEditableComponents(component, idFromLabel, includeFrozenContainer, flag) {
            var ret = "";
            var sclass = Classes_17.classes.getClassName(component);
            var props = Registry_44.default.getData("$UIComponent")[sclass];
            if (!props) {
                props = props = Registry_44.default.getData("$ReportComponent")[sclass];
            }
            if (!props === undefined)
                return ret;
            var prop = props.params[0];
            if (includeFrozenContainer === false && prop.editableChildComponents.length === 0 && flag === "child")
                ret = "";
            else
                ret = "#" + ((idFromLabel === true) ? component.domWrapper._id : component._id);
            //TODO implement child container
            if (flag === "child" && prop.editableChildComponents.length === 0)
                return ret;
            if (component["_components"] !== undefined) {
                for (var x = 0; x < component["_components"].length; x++) {
                    var t = ComponentDescriptor_3.getEditableComponents(component["_components"][x], idFromLabel, includeFrozenContainer, "child");
                    if (t !== "") {
                        ret = ret + (ret === "" ? "" : ",") + t;
                    }
                }
            }
            return ret;
        }
        /** calc editableComponents
         * @param {object} ob - the object to resolve
         * @returns {Object.<string,jassijs.ui.Component> - <name,component>
         **/
        resolveEditableComponents(ob, type = undefined, ret = undefined) {
            var sclass;
            var type;
            if (ret === undefined) {
                ret = {};
                sclass = Classes_17.classes.getClassName(ob);
                type = ob.constructor;
            }
            else {
                sclass = Classes_17.classes.getClassName(type);
            }
            var found = false;
            if (Registry_44.default.getData("$UIComponent", sclass) !== undefined && Registry_44.default.getData("$UIComponent", sclass)[0] !== undefined) {
                var props = Registry_44.default.getData("$UIComponent", sclass)[0].params[0];
                this.editableComponents = props.editableChildComponents;
                if (props.editableChildComponents !== undefined)
                    found = true;
            }
            if (Registry_44.default.getData("$ReportComponent", sclass) !== undefined && Registry_44.default.getData("$ReportComponent", sclass)[0] !== undefined) {
                var props = Registry_44.default.getData("$ReportComponent", sclass)[0].params[0];
                this.editableComponents = props.editableChildComponents;
                if (props.editableChildComponents !== undefined)
                    found = true;
            }
            if (found) {
                for (var x = 0; x < this.editableComponents.length; x++) {
                    var field = this.editableComponents[x];
                    var members = field.split(".");
                    var retob = ob;
                    for (var m = 0; m < members.length; m++) {
                        if (members[m] === "this")
                            retob = retob;
                        else
                            retob = retob[members[m]];
                    }
                    ret[field] = retob;
                }
            }
            else {
                type = type.__proto__;
                if (type !== null && type.name !== "")
                    return this.resolveEditableComponents(ob, type, ret);
            }
            return ret;
        }
        /* ohne subclasses
        resolveEditableComponents(ob) {
             var ret = {};
             var sclass = classes.getClassName(ob);
             if (registry.getData("$UIComponent", sclass) !== undefined && registry.getData("$UIComponent", sclass)[0] !== undefined) {
                 var props: UIComponentProperties = registry.getData("$UIComponent", sclass)[0].params[0];
                 this.editableComponents = props.editableChildComponents;
             }
             if (registry.getData("$ReportComponent", sclass) !== undefined && registry.getData("$ReportComponent", sclass)[0] !== undefined) {
                 var props: UIComponentProperties = registry.getData("$ReportComponent", sclass)[0].params[0];
                 this.editableComponents = props.editableChildComponents;
             }
             if (this.editableComponents !== undefined) {
                 for (var x = 0; x < this.editableComponents.length; x++) {
                     var field = this.editableComponents[x];
                     var members = field.split(".");
                     var retob = ob;
                     for (var m = 0; m < members.length; m++) {
                         if (members[m] === "this")
                             retob = retob;
                         else
                             retob = retob[members[m]];
                     }
                     ret[field] = retob;
                 }
             }
             return ret;
         }*/
        /**
         * remove a field
         * @param {string} field - the name of the field to remove
         */
        removeField(field) {
            for (var x = 0; x < this.fields.length; x++) {
                if (this.fields[x].name === field) {
                    this.fields.splice(x, 1);
                    x = x - 1;
                }
            }
        }
    };
    exports.ComponentDescriptor = ComponentDescriptor;
    exports.ComponentDescriptor = ComponentDescriptor = ComponentDescriptor_3 = __decorate([
        (0, Registry_43.$Class)("jassijs.ui.ComponentDescriptor"),
        __metadata("design:paramtypes", [])
    ], ComponentDescriptor);
});
define("jassijs/ui/Container", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Registry_45, Component_10, Property_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Container = void 0;
    let Container = class Container extends Component_10.Component {
        /**
         *
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties) {
            var _a, _b;
            super(properties);
            this._components = [];
            if ((_a = this.domWrapper) === null || _a === void 0 ? void 0 : _a.classList)
                (_b = this.domWrapper) === null || _b === void 0 ? void 0 : _b.classList.add("jcontainer");
        }
        config(config, forceRender = false) {
            if (config === null || config === void 0 ? void 0 : config.children) {
                if ((config === null || config === void 0 ? void 0 : config.children.length) > 0 && (config === null || config === void 0 ? void 0 : config.children[0]) instanceof Component_10.Component) {
                    this.removeAll(false);
                    for (var x = 0; x < config.children.length; x++) {
                        this.add(config.children[x]);
                    }
                    delete config.children;
                }
            }
            super.config(config);
            return this;
        }
        /**
        * inits the component
        * @param {dom} dom - init the dom element
        * @paran {object} properties - properties to init
       */
        //  init(dom) {
        //    super.init(dom);
        // }
        /**
         * adds a component to the container
         * @param {jassijs.ui.Component} component - the component to add
         */
        add(component) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper._parent = this;
            /* component._parent=this;
             component.domWrapper._parent=this;
             if(component.domWrapper.parentNode!==null&&component.domWrapper.parentNode!==undefined){
                  component.domWrapper.parentNode.removeChild(component.domWrapper);
             }*/
            this._components.push(component);
            this.dom.appendChild(component.domWrapper);
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper["_parent"] = this;
            var index = this._components.indexOf(before);
            if (component.domWrapper.parentNode !== null && component.domWrapper.parentNode !== undefined) {
                component.domWrapper.parentNode.removeChild(component.domWrapper);
            }
            this._components.splice(index, 0, component);
            this.dom.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
            //before.domWrapper.parentNode.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
        }
        /**
       * remove the component
       * @param {jassijs.ui.Component} component - the component to remove
       * @param {boolean} destroy - if true the component would be destroyed
       */
        remove(component, destroy = false) {
            var _a;
            if (destroy)
                component.destroy();
            component._parent = undefined;
            if (component.domWrapper !== undefined)
                component.domWrapper._parent = undefined;
            if (this._components) {
                var pos = this._components.indexOf(component);
                if (pos >= 0)
                    this._components.splice(pos, 1);
            }
            let posd = (_a = this.designDummies) === null || _a === void 0 ? void 0 : _a.indexOf(component);
            if (posd >= 0)
                this.designDummies.splice(posd, 1);
            try {
                this.dom.removeChild(component.domWrapper);
            }
            catch (ex) {
            }
        }
        /**
       * remove all component
       * @param {boolean} destroy - if true the component would be destroyed
       */
        removeAll(destroy = undefined) {
            while (this._components.length > 0) {
                this.remove(this._components[0], destroy);
            }
        }
        destroy() {
            if (this._components !== undefined) {
                var tmp = [].concat(this._components);
                for (var k = 0; k < tmp.length; k++) {
                    tmp[k].destroy();
                }
                this._components = [];
            }
            super.destroy();
        }
    };
    exports.Container = Container;
    exports.Container = Container = __decorate([
        (0, Registry_45.$Class)("jassijs.ui.Container"),
        (0, Property_7.$Property)({ name: "children", type: "jassijs.ui.Component" }),
        __metadata("design:paramtypes", [Object])
    ], Container);
});
define("jassijs/ui/ContextMenu", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Menu", "jassijs/ui/InvisibleComponent", "jassijs/ui/Component", "jassijs/remote/Classes", "jassijs/ui/Property", "jassijs/base/Actions", "jassijs/ui/MenuItem", "jassijs/ext/jquerylib", "jquery.contextMenu"], function (require, exports, Registry_46, Menu_2, InvisibleComponent_1, Component_11, Classes_18, Property_8, Actions_2, MenuItem_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContextMenu = void 0;
    exports.test = test;
    jassijs.includeCSSFile("contextMenu.css");
    //https://github.com/s-yadav/contextMenu.js/
    let ContextMenu = class ContextMenu extends InvisibleComponent_1.InvisibleComponent {
        constructor(props = {}) {
            super(props);
        }
        set menu(val) {
            this._menu = val;
        }
        get menu() {
            return this._menu;
        }
        add(menu) {
            if (menu instanceof MenuItem_2.MenuItem)
                this.menu.add(menu);
        }
        addBefore(menu, before) {
            this.menu.addBefore(menu, before);
        }
        remove(item) {
            this.remove(item);
        }
        /* set children(data){
             if(data.length>0)
                 this.menu=data[0];
         }*/
        /**
         * @member - the objects for the includeClassActions @ActionProvider if  is enabled
         **/
        set value(value) {
            this._value = value;
        }
        get value() {
            return this._value;
        }
        render() {
            return React.createElement("span", { className: "InvisibleComponent" });
        }
        componentDidMount() {
            var _this = this;
            this.menu = new Menu_2.Menu({ noUpdate: true });
            this.menu._mainMenu = this;
            //this.menu._parent=this;
            this.dom.append(this.menu.dom);
            $(this.menu.dom).contextMenu("menu", "#" + this.menu._id, { triggerOn: 'dummyevent' });
            this.contextComponents = [];
            //this.menu._parent=this;
            this.menu.dom.classList.add("jcontainer");
            this._components = [this.menu]; //neede for getEditablecontextComponents
            this.onbeforeshow(function () {
                return _this._updateClassActions();
            });
        }
        config(config) {
            super.config(config);
            return this;
        }
        /**
         * could be override to provide Context-actions
         * exsample:
         * cmen.getActions=async function(objects:[]){
         *		return [{name:"hallo",call:ob=>{}]
         *	};
         **/
        async getActions(data) {
            return [];
        }
        //		static async  getActionsFor(oclass:new (...args: any[]) => any):Promise<{name:string,icon?:string,call:(objects:any[])}[]>{
        /*	registerActions(func:{(any[]):Promise<{name:string,icon?:string,call:(objects:any[])}[]}>){
                this._getActions=func;
            }*/
        _removeClassActions(menu) {
            for (var y = 0; y < menu._components.length; y++) {
                var test = menu._components[y];
                if (test["_classaction"] == true) {
                    menu.remove(test);
                    test.destroy();
                    y--;
                }
                if (test._components !== undefined) {
                    this._removeClassActions(test);
                }
            }
        }
        _setDesignMode(enable) {
            var h = 9;
        }
        async _updateClassActions() {
            //remove classActions
            this._removeClassActions(this.menu);
            var _this = this;
            var actions = await this.getActions(this.value);
            if (this.value === undefined || this.includeClassActions !== true || this.value.length <= 0)
                actions = actions; //do nothing
            else {
                var a = await Actions_2.Actions.getActionsFor(this.value); //Class Actions
                for (var x = 0; x < a.length; x++) {
                    actions.push(a[x]);
                }
            }
            actions.forEach(action => {
                var path = action.name.split("/"); //childmenus
                var parent = this.menu;
                for (var i = 0; i < path.length; i++) {
                    if (i === path.length - 1) {
                        var men = new MenuItem_2.MenuItem();
                        men["_classaction"] = true;
                        men.text = path[i];
                        if (action.icon !== undefined)
                            men.icon = action.icon;
                        men.onclick(() => action.call(_this.value));
                        parent.add(men);
                    }
                    else {
                        var name = path[i];
                        var found = undefined;
                        parent._components.forEach((men) => {
                            if (men.text === name)
                                found = men.items;
                        });
                        if (found === undefined) {
                            var men = new MenuItem_2.MenuItem();
                            men["_classaction"] = true;
                            men.text = name;
                            parent.add(men);
                            parent = men.items;
                        }
                        else {
                            parent = found;
                        }
                    }
                }
            });
        }
        _menueChanged() {
        }
        getMainMenu() {
            return this;
        }
        onbeforeshow(handler) {
            this.addEvent("beforeshow", handler);
        }
        async _callContextmenu(evt) {
            this.target = evt.target;
            var cancel = this.callEvent("beforeshow", evt);
            if (cancel !== undefined) {
                for (var x = 0; x < cancel.length; x++) {
                    if (cancel[x] !== undefined && cancel[x].then !== undefined)
                        cancel[x] = await cancel[x];
                    if (cancel[x] === false)
                        return;
                }
            }
            let y = evt.originalEvent.clientY;
            this.show({ left: evt.originalEvent.clientX, top: y });
        }
        /**
         * register the contextMenu (right click) on the component
         * @member {jassijs.ui.Component} - the component which gets the contextmenu
         **/
        registerComponent(component) {
            this.contextComponents.push(component);
            var _this = this;
            $(component.dom).contextmenu(function (evt) {
                if (evt.preventDefault !== undefined)
                    evt.preventDefault();
                setTimeout(() => {
                    _this._callContextmenu(evt);
                }, 10);
            });
        }
        /**
         * unregister the contextMenu (right click) on the component
         * @member {jassijs.ui.Component} - the component which gets the contextmenu
         **/
        unregisterComponent(component) {
            //$(component.dom).contextmenu(function(ob){});//now we always can destroy
            $(component.dom).off("contextmenu");
            //$(component.dom).contextmenu("destroy");
            var pos = this.contextComponents.indexOf(component);
            if (pos >= 0)
                this.contextComponents.splice(pos, 1);
        }
        /**
         * shows the contextMenu
         */
        show(event) {
            //@ts-ignore
            if (this.domWrapper.parentNode.getAttribute('id') === "jassitemp" && this.contextComponents.length > 0) {
                //the contextmenu is not added to a container to we add the contextmenu to the contextComponent
                this.contextComponents[0].domWrapper.appendChild(this.domWrapper);
            }
            var _this = this;
            window.setTimeout(function () {
                $(_this.menu.dom).menu();
                $(_this.menu.dom).menu("destroy");
                $(_this.menu.dom).contextMenu("menu", "#" + _this.menu._id, { triggerOn: 'dummyevent' });
                //correct pos menu not visible
                if (!event) {
                    event = $(':hover').last().offset();
                }
                if (event.top + $(_this.menu.dom).height() > window.innerHeight) {
                    event.top = window.innerHeight - $(_this.menu.dom).height();
                }
                if (event.left + $(_this.menu.dom).width() > window.innerWidth) {
                    event.left = window.innerWidth - $(_this.menu.dom).width();
                }
                $(_this.menu.dom).contextMenu('open', event);
            }, 10);
        }
        close() {
            $(this.menu.dom).contextMenu('close', event);
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                return this.menu.extensionCalled(action);
            }
            if (action.componentDesignerInvisibleComponentClicked) {
                var design = action.componentDesignerInvisibleComponentClicked.designButton.dom;
                return this.show(design); //{ top: $(design).offset().top, left: $(design).offset().left });
            }
            super.extensionCalled(action);
        }
        destroy() {
            this._value = undefined;
            while (this.contextComponents.length > 0) {
                this.unregisterComponent(this.contextComponents[0]);
            }
            $(this.menu.dom).contextMenu("menu", "#" + this.menu._id);
            $(this.menu.dom).contextMenu("destroy");
            this.menu.destroy();
            super.destroy();
        }
    };
    exports.ContextMenu = ContextMenu;
    __decorate([
        (0, Property_8.$Property)(),
        __metadata("design:type", Boolean)
    ], ContextMenu.prototype, "includeClassActions", void 0);
    __decorate([
        (0, Property_8.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ContextMenu.prototype, "onbeforeshow", null);
    exports.ContextMenu = ContextMenu = __decorate([
        (0, Component_11.$UIComponent)({ fullPath: "common/ContextMenu", icon: "mdi mdi-dots-vertical", editableChildComponents: ["menu"] }),
        (0, Registry_46.$Class)("jassijs.ui.ContextMenu"),
        __metadata("design:paramtypes", [Object])
    ], ContextMenu);
    async function test() {
        var Panel = Classes_18.classes.getClass("jassijs.ui.Panel");
        var Button = Classes_18.classes.getClass("jassijs.ui.Button");
        var MenuItem = Classes_18.classes.getClass("jassijs.ui.MenuItem");
        var FileNode = Classes_18.classes.getClass("jassijs.remote.FileNode");
        var bt = new Button();
        var cmen = new ContextMenu();
        var men = new MenuItem();
        //var pan=new Panel();
        men.text = "static Menu";
        men.onclick(() => { alert("ok"); });
        cmen.includeClassActions = true;
        cmen.menu.add(men);
        var nd = new FileNode();
        nd.name = "File";
        cmen.value = [nd];
        cmen.getActions = async function (objects) {
            var all = objects;
            return [{
                    name: "getActions-Action", call: function (ob) {
                        alert(ob[0]["name"]);
                    }
                }];
        };
        bt.contextMenu = cmen;
        bt.text = "hallo";
        //pan.add(bt);
        //bt.domWrapper.appendChild(cmen.domWrapper);
        //pan.add(cmen);
        return bt;
    }
});
define("jassijs/ui/converters/DateTimeConverter", ["require", "exports", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/Textbox", "luxon"], function (require, exports, DefaultConverter_1, Registry_47, Property_9, Textbox_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DateTimeConverter = void 0;
    exports.test = test;
    let DateTimeConverterProperties = class DateTimeConverterProperties {
    };
    __decorate([
        (0, Property_9.$Property)({ type: "string", chooseFrom: ["DATE_SHORT", "TIME_SIMPLE", "DATETIME_SHORT", "TIME_WITH_SECONDS", "DATETIME_SHORT_WITH_SECONDS"] }),
        __metadata("design:type", String)
    ], DateTimeConverterProperties.prototype, "type", void 0);
    DateTimeConverterProperties = __decorate([
        (0, Registry_47.$Class)("jassijs.ui.converters.DateTimeConverterProperies")
    ], DateTimeConverterProperties);
    let DateTimeConverter = class DateTimeConverter extends DefaultConverter_1.DefaultConverter {
        constructor(props) {
            super();
            this.type = (props === null || props === void 0 ? void 0 : props.type) === undefined ? "DATE_SHORT" : props === null || props === void 0 ? void 0 : props.type;
        }
        get component() {
            return super.component;
        }
        set component(component) {
            super.component = component;
            if (this.type === "DATE_SHORT") {
                component.dom.setAttribute("type", "date");
            }
            if (this.type === "TIME_SIMPLE" || this.type === "TIME_WITH_SECONDS") {
                component.dom.setAttribute("type", "time");
            }
            if (this.type === "TIME_WITH_SECONDS") {
                component.dom.setAttribute("step", "2");
            }
            if (this.type === "DATETIME_SHORT" || this.type === "DATETIME_SHORT_WITH_SECONDS") {
                component.dom.setAttribute("type", "datetime-local");
            }
            if (this.type === "DATETIME_SHORT_WITH_SECONDS") {
                component.dom.setAttribute("step", "2");
            }
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            if (str === undefined || str === "")
                return undefined;
            var ret;
            if (this.type === "DATE_SHORT" || this.type === undefined) {
                ret = luxon.DateTime.fromFormat(str, 'yyyy-MM-dd');
            }
            else if (this.type === "DATETIME_SHORT") {
                ret = luxon.DateTime.fromFormat(str, "yyyy-MM-dd\'T\'HH:mm");
            }
            else if (this.type === "TIME_SIMPLE") {
                ret = luxon.DateTime.fromFormat(str, 'HH:mm');
            }
            else if (this.type === "DATETIME_SHORT_WITH_SECONDS") {
                ret = luxon.DateTime.fromFormat(str, "yyyy-MM-dd\'T\'HH:mm:ss");
            }
            else if (this.type === "TIME_WITH_SECONDS") {
                ret = luxon.DateTime.fromFormat(str, 'HH:mm:ss');
            }
            return ret.toJSDate();
            // return Numberformatter.stringToNumber(str);
        }
        /**
         * converts an object to string
         * @param  obj - the object to convert
         */
        objectToString(obj) {
            if (obj === undefined)
                return undefined;
            var ret;
            if (this.type === "DATE_SHORT" || this.type === undefined) {
                ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd");
            }
            else if (this.type === "DATETIME_SHORT") {
                ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd\'T\'HH:mm");
            }
            else if (this.type === "TIME_SIMPLE") {
                ret = luxon.DateTime.fromJSDate(obj).toFormat("HH:mm");
            }
            else if (this.type === "DATETIME_SHORT_WITH_SECONDS") {
                ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd\'T\'HH:mm:ss");
            }
            else if (this.type === "TIME_WITH_SECONDS") {
                ret = luxon.DateTime.fromJSDate(obj).toFormat("HH:mm:ss");
            }
            return ret;
            //        1979-12-31
            //return Numberformatter.numberToString(obj);
        }
        /**
         * format date to string
         * @param format- e.g. "yyyy-MM-dd" or "HH:mm:ss"
         */
        static toFormat(date, format) {
            return luxon.DateTime.fromJSDate(date).toFormat(format);
        }
        /**
       * parse date a string
       * @param format- e.g. "yyyy-MM-dd" or "HH:mm:ss"
       */
        static fromFormat(date, format) {
            return luxon.DateTime.fromFormat(date, format).toJSDate();
        }
        static toLocalString(date, format) {
            return luxon.DateTime.fromJSDate(date).toLocaleString(luxon.DateTime[format]);
        }
    };
    exports.DateTimeConverter = DateTimeConverter;
    __decorate([
        (0, Property_9.$Property)({ type: "string", chooseFrom: ["DATE_SHORT", "TIME_SIMPLE", "DATETIME_SHORT", "TIME_WITH_SECONDS", "DATETIME_SHORT_WITH_SECONDS"] }),
        __metadata("design:type", String)
    ], DateTimeConverter.prototype, "type", void 0);
    exports.DateTimeConverter = DateTimeConverter = __decorate([
        (0, DefaultConverter_1.$Converter)({ name: "datetime" }),
        (0, Registry_47.$Class)("jassijs.ui.converters.DateTimeConverter"),
        (0, Property_9.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.converters.DateTimeConverterProperties" }),
        __metadata("design:paramtypes", [DateTimeConverterProperties])
    ], DateTimeConverter);
    function test() {
        var tb = new Textbox_4.Textbox();
        tb.converter = new DateTimeConverter({
            type: "DATETIME_SHORT_WITH_SECONDS"
        });
        tb.value = new Date(2022, 12, 3, 15, 5);
        //console.log(DateTimeConverter.toLocalString(new Date(),""));
        // console.log(luxon.DateTime.fromJSDate(new Date()).toLocaleString(luxon.DateTime.DATETIME_SHORT));//Format(luxon.DateTime["DATETIME_SHORT"]));
        //    return tb;
    }
});
define("jassijs/ui/converters/DefaultConverter", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Registry_48, Registry_49, Property_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultConverter = exports.$ConverterProperties = void 0;
    exports.$Converter = $Converter;
    Registry_49 = __importDefault(Registry_49);
    class $ConverterProperties {
    }
    exports.$ConverterProperties = $ConverterProperties;
    function $Converter(param) {
        return function (pclass) {
            Registry_49.default.register("$Converter", pclass, param);
        };
    }
    let DefaultConverterProperties = class DefaultConverterProperties {
        stringToObject() {
        }
    };
    __decorate([
        (0, Property_10.$Property)({ default: "function(ob){}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DefaultConverterProperties.prototype, "stringToObject", null);
    DefaultConverterProperties = __decorate([
        (0, Registry_48.$Class)("jassijs.ui.converters.DefaultConverterProperties")
    ], DefaultConverterProperties);
    let DefaultConverter = class DefaultConverter {
        constructor() {
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            return str;
        }
        /**
         * converts an object to string
         * @param {string} obj - the object to convert
         */
        objectToString(obj) {
            return obj.ToString();
        }
        get component() {
            return this._component;
        }
        set component(component) {
            this._component = component;
        }
        /**
        * converts an object to an formatted string
        * @param {string} obj - the object to convert
        */
        objectToFormatedString(obj) {
            return this.objectToString(obj);
        }
    };
    exports.DefaultConverter = DefaultConverter;
    exports.DefaultConverter = DefaultConverter = __decorate([
        $Converter({ name: "custom" }),
        (0, Registry_48.$Class)("jassijs.ui.converters.DefaultConverter"),
        (0, Property_10.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.converters.DefaultConverterProperties" })
        //@$Property({ name: "new/stringToObject", type: "function", default: "function(ob){}" })
        ,
        __metadata("design:paramtypes", [])
    ], DefaultConverter);
});
define("jassijs/ui/converters/NumberConverter", ["require", "exports", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/util/Numberformatter"], function (require, exports, DefaultConverter_2, Registry_50, Property_11, Numberformatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberConverter = void 0;
    let allFormats = (() => {
        var ret = [];
        const format = new Intl.NumberFormat();
        var decimal = format.format(1.1).substring(1, 2);
        var group = format.format(1234).substring(1, 2);
        /*	const parts = format.formatToParts(1234.6);
                var decimal = ".";
            var group=",";
            parts.forEach(p => {
                if (p.type === "decimal")
                    decimal = p.value;
                if (p.type === "group")
                    group = p.value;
            });*/
        ret.push("#" + group + "##0" + decimal + "00");
        ret.push("#" + group + "##0" + decimal + "00 €");
        ret.push("#" + group + "##0" + decimal + "00 $");
        ret.push("0");
        ret.push("0" + decimal + "00");
        return ret;
    })();
    let NumberConverterProperties = class NumberConverterProperties {
    };
    __decorate([
        (0, Property_11.$Property)(),
        __metadata("design:type", Number)
    ], NumberConverterProperties.prototype, "min", void 0);
    __decorate([
        (0, Property_11.$Property)(),
        __metadata("design:type", Number)
    ], NumberConverterProperties.prototype, "max", void 0);
    __decorate([
        (0, Property_11.$Property)({ type: "string", chooseFrom: allFormats }),
        __metadata("design:type", String)
    ], NumberConverterProperties.prototype, "format", void 0);
    NumberConverterProperties = __decorate([
        (0, Registry_50.$Class)("jassijs.ui.converters.NumberConverterProperies")
    ], NumberConverterProperties);
    let NumberConverter = class NumberConverter extends DefaultConverter_2.DefaultConverter {
        constructor(props) {
            super();
            this.min = props === null || props === void 0 ? void 0 : props.min;
            this.max = props === null || props === void 0 ? void 0 : props.max;
            this.format = props === null || props === void 0 ? void 0 : props.format;
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            if (str === undefined || str === "")
                return undefined;
            return Numberformatter_1.Numberformatter.stringToNumber(str);
        }
        /**
         * converts an object to string
         * @param  obj - the object to convert
         */
        objectToString(obj) {
            if (obj === undefined)
                return undefined;
            return Numberformatter_1.Numberformatter.numberToString(obj);
        }
        objectToFormatedString(obj) {
            return Numberformatter_1.Numberformatter.format(this.format, obj);
        }
    };
    exports.NumberConverter = NumberConverter;
    exports.NumberConverter = NumberConverter = __decorate([
        (0, DefaultConverter_2.$Converter)({ name: "number" }),
        (0, Registry_50.$Class)("jassijs.ui.converters.NumberConverter"),
        (0, Property_11.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.converters.NumberConverterProperies" }),
        __metadata("design:paramtypes", [NumberConverterProperties])
    ], NumberConverter);
});
define("jassijs/ui/converters/StringConverter", ["require", "exports", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, DefaultConverter_3, Registry_51, Property_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StringConverter = void 0;
    let StringConverterProperties = class StringConverterProperties {
    };
    __decorate([
        (0, Property_12.$Property)(),
        __metadata("design:type", Number)
    ], StringConverterProperties.prototype, "minChars", void 0);
    __decorate([
        (0, Property_12.$Property)(),
        __metadata("design:type", Number)
    ], StringConverterProperties.prototype, "maxChars", void 0);
    StringConverterProperties = __decorate([
        (0, Registry_51.$Class)("jassijs.ui.converters.StringConverterProperies")
    ], StringConverterProperties);
    let StringConverter = class StringConverter extends DefaultConverter_3.DefaultConverter {
        constructor(props) {
            super();
            this.minChars = props === null || props === void 0 ? void 0 : props.minChars;
            this.maxChars = props === null || props === void 0 ? void 0 : props.maxChars;
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            return str;
        }
        /**
         * converts an object to string
         * @param {string} obj - the object to convert
         */
        objectToString(obj) {
            return (obj === null || obj === void 0 ? void 0 : obj.toString()) + this.maxChars;
        }
    };
    exports.StringConverter = StringConverter;
    exports.StringConverter = StringConverter = __decorate([
        (0, DefaultConverter_3.$Converter)({ name: "string" }),
        (0, Registry_51.$Class)("jassijs.ui.converters.StringConverter"),
        (0, Property_12.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.converters.StringConverterProperies" })
        //@$Property({ name: "new/minChars", type: "number", default: undefined })
        //@$Property({ name: "new/maxChars", type: "number", default: undefined })
        ,
        __metadata("design:paramtypes", [StringConverterProperties])
    ], StringConverter);
});
define("jassijs/ui/CSSProperties", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Registry_52, Property_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSSProperties = void 0;
    exports.loadFontIfNedded = loadFontIfNedded;
    var systemFonts = ["Arial", "Helvetica Neue", "Courier New", "Times New Roman", "Comic Sans MS", "Impact"];
    var api = 'https://fonts.googleapis.com/css?family=';
    /**
     * loads googlefonts if needed
     **/
    function loadFontIfNedded(font) {
        if (systemFonts.indexOf(font) === -1) {
            var sfont = font.replaceAll(" ", "+");
            if (!document.getElementById("-->" + api + sfont)) { //"-->https://fonts.googleapis.com/css?family=Aclonica">
                jassijs.myRequire(api + sfont);
            }
        }
    }
    var hj = {
        backgroundColor: undefined,
    };
    let CSSProperties = class CSSProperties {
        static applyTo(properties, component) {
            var prop = {};
            for (let key in properties) {
                var newKey = key; //.replaceAll("_","-");
                prop[newKey] = properties[key];
                if (newKey === "font-family") {
                    loadFontIfNedded(prop[newKey]);
                }
                component.dom.style[newKey] = properties[key];
            }
            return prop;
        }
    };
    exports.CSSProperties = CSSProperties;
    __decorate([
        (0, Property_13.$Property)({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "backgroundColor", void 0);
    __decorate([
        (0, Property_13.$Property)(),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "backgroundImage", void 0);
    __decorate([
        (0, Property_13.$Property)({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "borderColor", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "borderStyle", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["thin", "medium", "thick", "2px", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "borderWidth", void 0);
    __decorate([
        (0, Property_13.$Property)({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "color", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["auto", "default", "none", "context-menu", "help", "pointer", "progress", "wait", "cell", "crosshair", "text", "vertical-text", "alias", "copy", "move", "no-drop", "not-allowed", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "cursor", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["blur(5px)", "brightness(0.4)", "contrast(200%)", "drop-shadow(16px 16px 20px blue)", "grayscale(50%)", "hue-rotate(90deg)", "invert(75%)", "opacity(25%)", "saturate(30%)", "sepia(60%)", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "filter", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["left", "right", "none", "inline-start", "inline-end", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "float", void 0);
    __decorate([
        (0, Property_13.$Property)({ type: "font" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "fontFamily", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["12px", "xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large", "larger", "smaller", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "fontSize", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["normal", "small-caps", "small-caps slashed-zero", "common-ligatures tabular-nums", "no-common-ligatures proportional-nums", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "fontVariant", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["normal", "bold", "lighter", "bolder", "100", "900", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "fontWeight", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["normal", "1px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "letterSpacing", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["normal", "32px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "lineHeight", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "marginBottom", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "marginLeft", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "marginRight", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "marginTop", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["visible", "hidden", "clip", "scroll", "auto", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "overflow", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "paddingBottom", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "paddingLeft", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "paddingRight", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "paddingTop", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["static", "relative", "absolute", "sticky", "fixed", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "position", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["start", "end", "left", "right", "center", "justify", "match-parent", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "textAlign", void 0);
    __decorate([
        (0, Property_13.$Property)({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "textDecorationColor", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["none", "underline", "overline", "line-through", "blink", "spelling-error", "grammar-error", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "textDecorationLine", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["solid", "double", "dotted", "dashed", "wavy", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "textDecorationStyle", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "textDecorationThickness", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["none", "capitalize", "uppercase", "lowercase", "full-width", "full-size-kana", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "textTransform", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["baseline", "sub", "super", "text-top", "text-bottom", "middle", "top", "bottom", "3px", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "verticalAlign", void 0);
    __decorate([
        (0, Property_13.$Property)({ chooseFrom: ["1", "2", "auto"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "zIndex", void 0);
    exports.CSSProperties = CSSProperties = __decorate([
        (0, Registry_52.$Class)("jassijs.ui.CSSProperties")
    ], CSSProperties);
});
define("jassijs/ui/DataComponent", ["require", "exports", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/ui/State"], function (require, exports, Component_12, Property_14, Registry_53, State_2) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataComponent = void 0;
    var tmpDatabinder = undefined;
    let DataComponent = class DataComponent extends Component_12.Component {
        /**
        * base class for each Component
        * @class jassijs.ui.Component
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = {}) {
            super(properties);
            this._autocommit = false;
        }
        get autocommit() {
            return this._autocommit;
        }
        set autocommit(value) {
            this._autocommit = value;
            //if (this._databinder !== undefined)
            //    this._databinder.checkAutocommit(this);
        }
        get bind() {
            return this._boundProperty;
        }
        /**
         * @param [databinder:jassijs.ui.Databinder,"propertyToBind"]
         */
        set bind(boundProperty) {
            this._boundProperty = boundProperty;
            if (boundProperty === undefined) {
                if (boundProperty._databinder !== undefined) {
                    boundProperty._databinder.remove(this);
                }
                return;
            }
            var property = boundProperty._propertyname;
            if (this._boundProperty !== undefined)
                this._boundProperty._databinder.add(property, this, "onchange");
        }
        /*  rerender(){
               if (this._databinder !== undefined) {
                  this._databinder.remove(this);
                  this._databinder = undefined;
              }
              super.rerender();
          }*/
        destroy() {
            var _a, _b;
            if (((_a = this._boundProperty) === null || _a === void 0 ? void 0 : _a._databinder) !== undefined) {
                (_b = this._boundProperty) === null || _b === void 0 ? void 0 : _b._databinder.remove(this);
            }
            super.destroy();
        }
    };
    exports.DataComponent = DataComponent;
    __decorate([
        (0, Property_14.$Property)({ type: "databinder" }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], DataComponent.prototype, "autocommit", null);
    __decorate([
        (0, Property_14.$Property)({ type: "databinder" }),
        __metadata("design:type", typeof (_a = typeof State_2.BoundProperty !== "undefined" && State_2.BoundProperty) === "function" ? _a : Object),
        __metadata("design:paramtypes", [typeof (_b = typeof State_2.BoundProperty !== "undefined" && State_2.BoundProperty) === "function" ? _b : Object])
    ], DataComponent.prototype, "bind", null);
    exports.DataComponent = DataComponent = __decorate([
        (0, Registry_53.$Class)("jassijs.ui.DataComponent"),
        __metadata("design:paramtypes", [Object])
    ], DataComponent);
});
define("jassijs/ui/DBObjectDialog", ["require", "exports", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/BoxPanel", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, Table_1, Registry_54, Panel_6, Registry_55, Classes_19, BoxPanel_1, Actions_3, Windows_2) {
    "use strict";
    var DBObjectDialog_1;
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBObjectDialog = void 0;
    exports.test = test;
    Registry_55 = __importDefault(Registry_55);
    Windows_2 = __importDefault(Windows_2);
    let DBObjectDialog = DBObjectDialog_1 = class DBObjectDialog extends Panel_6.Panel {
        //data: DBObject[];
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.splitpanel1 = new BoxPanel_1.BoxPanel();
            me.IDDBView = new Panel_6.Panel();
            me.table1 = new Table_1.Table();
            me.table1.height = "calc(100% - 300px)";
            me.table1.width = "calc(100% - 20px)";
            me.table1.showSearchbox = true,
                me.splitpanel1.add(me.IDDBView);
            me.splitpanel1.spliter = [70, 30];
            me.splitpanel1.height = "100%";
            me.splitpanel1.horizontal = false;
            //	me.splitpanel1.width=910;
            me.splitpanel1.add(me.table1);
            this.add(me.splitpanel1);
            //    me.table1.height = "150";
        }
        /**
         * set the DBObject-classname to show in this dialog
         **/
        set dbclassname(classname) {
            this._dbclassname = classname;
            this.update();
        }
        get dbclassname() {
            return this._dbclassname;
        }
        async update() {
            //DBTable
            var cl = await Classes_19.classes.loadClass(this._dbclassname);
            var _this = this;
            //@ts-ignore
            // this.data = await cl.find();
            //this.me.table1.items = this.data;
            //DBView
            var data = await Registry_55.default.getJSONData("$DBObjectView");
            for (var x = 0; x < data.length; x++) {
                var param = data[x].params[0];
                if (param.classname === this.dbclassname) {
                    var cl = await Classes_19.classes.loadClass(data[x].classname);
                    this.me.IDDBView.removeAll();
                    this.view = new cl();
                    this.me.table1.options = {
                        lazyLoad: {
                            classname: this._dbclassname,
                            loadFunc: (param.queryname === undefined ? "find" : param.queryname)
                        }
                    };
                    this.me.IDDBView.add(this.view);
                    this.me.table1.onlazyloaded((data) => {
                        if ((data === null || data === void 0 ? void 0 : data.length) > 0 && this.view.value === undefined)
                            this.view.value = data[0];
                    });
                    //@ts-ignore
                    //   this.view.value = this.data.length > 0 ? this.data[0] : undefined;
                    this.view.onrefreshed(() => {
                        _this.me.table1.update();
                    });
                    this.view.oncreated((obj) => {
                        // _this.me.table1.insertItem(obj);
                    });
                    this.view.onsaved((obj) => {
                        _this.me.table1.updateOrInsertItem(obj);
                        /* var all = _this.me.table1.items;
                         if (all.indexOf(obj) === -1) {
                             all.push(obj);
                             _this.me.table1.items = _this.me.table1.items;
                             _this.me.table1.value = obj;
                             _this.me.table1.update();
                         }
                         else
                             _this.me.table1.update();*/
                    });
                    this.view.ondeleted((obj) => {
                        this.me.table1.removeItem(obj);
                        _this.view.value = this.me.table1.value;
                        /*var all = _this.me.table1.items;
                        var pos = all.indexOf(obj);
                        if (pos >= 0)
                            all.splice(pos, 1);
                        _this.me.table1.items = all;
                        //select prev element
                        while (pos !== 0 && pos > all.length - 1) {
                            pos--;
                        }
                        if (pos >= 0) {
                            _this.me.table1.value = all[pos];
                            _this.view.value = all[pos];
                        }
                        _this.me.table1.update();*/
                    });
                    this.me.table1.selectComponent = this.view;
                }
            }
        }
        static createFunction(classname) {
            return function () {
                var ret = new DBObjectDialog_1();
                ret.dbclassname = classname;
                ret.height = "100%";
                Windows_2.default.add(ret, classname);
            };
        }
        /**
         * create Action for all DBObjectView with actionname is defined
         */
        static async createActions() {
            var ret = [];
            var data = await Registry_55.default.getJSONData("$DBObjectView");
            for (var x = 0; x < data.length; x++) {
                var param = data[x].params[0];
                if (param.actionname) {
                    ret.push({
                        name: param.actionname,
                        icon: param.icon,
                        run: this.createFunction(param.classname)
                    });
                }
            }
            return ret;
        }
        static async createFor(classname) {
            var ret = new DBObjectDialog_1();
            ret.height = 400;
            ret.dbclassname = classname;
            /*	setimeout(()=>{
             //	ret.height="100%";
             //	ret.me.splitpanel1.refresh();
             },1000);*/
            return ret;
        }
    };
    exports.DBObjectDialog = DBObjectDialog;
    __decorate([
        (0, Actions_3.$Actions)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
    ], DBObjectDialog, "createActions", null);
    exports.DBObjectDialog = DBObjectDialog = DBObjectDialog_1 = __decorate([
        (0, Actions_3.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_54.$Class)("jassijs.ui.DBObjectDialog"),
        __metadata("design:paramtypes", [])
    ], DBObjectDialog);
    async function test() {
        // var ret = await DBObjectDialog.createFor("jassijs.security.User");
        var ret = await DBObjectDialog.createFor("northwind.Employees");
        return ret;
    }
});
define("jassijs/ui/DBObjectExplorer", ["require", "exports", "jassijs/ui/ContextMenu", "jassijs/ui/Tree", "jassijs/remote/Registry", "jassijs/base/Actions", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/base/Router", "jassijs/ui/DBObjectDialog", "jassijs/base/Windows"], function (require, exports, ContextMenu_1, Tree_1, Registry_56, Actions_4, Panel_7, Registry_57, Router_1, DBObjectDialog_2, Windows_3) {
    "use strict";
    var DBObjectExplorer_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBObjectExplorer = exports.DBObjectActions = exports.DBFileActions = exports.DBObjectNode = void 0;
    exports.test = test;
    Registry_57 = __importDefault(Registry_57);
    Windows_3 = __importDefault(Windows_3);
    let DBObjectNode = class DBObjectNode {
    };
    exports.DBObjectNode = DBObjectNode;
    exports.DBObjectNode = DBObjectNode = __decorate([
        (0, Registry_56.$Class)("jassijs.ui.DBObjectNode")
    ], DBObjectNode);
    let DBFileActions = class DBFileActions {
        static async ViewData(all) {
            var entrys = await Registry_57.default.getJSONData("$DBObject");
            for (var x = 0; x < entrys.length; x++) {
                if (all[0].fullpath === entrys[x].filename) {
                    var h = new DBObjectNode();
                    h.name = entrys[x].classname;
                    h.filename = entrys[x].filename;
                    DBObjectActions.ViewData([h]);
                }
            }
        }
    };
    exports.DBFileActions = DBFileActions;
    __decorate([
        (0, Actions_4.$Action)({
            name: "View Data",
            isEnabled: async function (all) {
                if (all[0].isDirectory())
                    return false;
                //console.log("TODO make isEnabled this async")
                var entrys = await Registry_57.default.getJSONData("$DBObject");
                for (var x = 0; x < entrys.length; x++) {
                    if (all[0].fullpath === entrys[x].filename)
                        return true;
                }
                return false;
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], DBFileActions, "ViewData", null);
    exports.DBFileActions = DBFileActions = __decorate([
        (0, Actions_4.$ActionProvider)("jassijs.remote.FileNode"),
        (0, Registry_56.$Class)("jassijs.ui.DBFileActions")
    ], DBFileActions);
    let DBObjectActions = class DBObjectActions {
        static async ViewData(all) {
            var ret = new DBObjectDialog_2.DBObjectDialog();
            ret.dbclassname = all[0].name;
            ret.height = "100%";
            Windows_3.default.add(ret, all[0].name);
        }
        static async OpenCode(all) {
            Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + all[0].filename);
        }
    };
    exports.DBObjectActions = DBObjectActions;
    __decorate([
        (0, Actions_4.$Action)({ name: "View Data" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], DBObjectActions, "ViewData", null);
    __decorate([
        (0, Actions_4.$Action)({ name: "Open Code" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], DBObjectActions, "OpenCode", null);
    exports.DBObjectActions = DBObjectActions = __decorate([
        (0, Actions_4.$ActionProvider)("jassijs.ui.DBObjectNode"),
        (0, Registry_56.$Class)("jassijs.ui.DBObjectActions")
    ], DBObjectActions);
    let DBObjectExplorer = DBObjectExplorer_1 = class DBObjectExplorer extends Panel_7.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.tree = new Tree_1.Tree();
            me.contextmenu = new ContextMenu_1.ContextMenu();
            this.add(me.contextmenu);
            this.add(me.tree);
            me.tree.width = "100%";
            me.tree.height = "100%";
            me.tree.propDisplay = "name";
            me.tree.contextMenu = me.contextmenu;
            me.tree.onclick(function (event /*, data?:Fancytree.EventData*/) {
                var node = event.data;
                DBObjectActions.OpenCode([node]);
            });
            me.contextmenu.includeClassActions = true;
            this.update();
        }
        static async dummy() {
        }
        static async dummy2() {
        }
        static async show() {
            if (Windows_3.default.contains("DBObjects"))
                var window = Windows_3.default.show("DBObjects");
            else
                Windows_3.default.addLeft(new DBObjectExplorer_1(), "DBObjects");
        }
        async update() {
            var entrys = await Registry_57.default.getJSONData("$DBObject");
            var all = [];
            entrys.forEach((entry) => {
                var h = new DBObjectNode();
                ;
                h.name = entry.classname;
                h.filename = entry.filename;
                all.push(h);
            });
            this.me.tree.items = all;
        }
    };
    exports.DBObjectExplorer = DBObjectExplorer;
    __decorate([
        (0, Actions_4.$Action)({
            name: "Windows",
            icon: "mdi mdi-iframe-array-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DBObjectExplorer, "dummy", null);
    __decorate([
        (0, Actions_4.$Action)({
            name: "Windows/Development",
            icon: "mdi mdi-dev-to",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DBObjectExplorer, "dummy2", null);
    __decorate([
        (0, Actions_4.$Action)({
            name: "Windows/Development/DBObjects",
            icon: "mdi mdi-database-search",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DBObjectExplorer, "show", null);
    exports.DBObjectExplorer = DBObjectExplorer = DBObjectExplorer_1 = __decorate([
        (0, Actions_4.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_56.$Class)("jassijs.ui.DBObjectExplorer"),
        __metadata("design:paramtypes", [])
    ], DBObjectExplorer);
    async function test() {
        var ret = new DBObjectExplorer();
        ret.height = 100;
        return ret;
    }
});
define("jassijs/ui/DBObjectView", ["require", "exports", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/Property", "jassijs/ui/Notify"], function (require, exports, Button_1, BoxPanel_2, Registry_58, Panel_8, Component_13, Registry_59, Classes_20, Property_15, Notify_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBObjectViewToolbar = exports.DBObjectView = exports.$DBObjectViewProperties = void 0;
    exports.$DBObjectView = $DBObjectView;
    exports.test = test;
    Registry_59 = __importDefault(Registry_59);
    class $DBObjectViewProperties {
    }
    exports.$DBObjectViewProperties = $DBObjectViewProperties;
    function $DBObjectView(properties) {
        return function (pclass) {
            Registry_59.default.register("$DBObjectView", pclass, properties);
            var p = { name: "value", componentType: properties.classname, type: "DBObject", isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" };
            Registry_59.default.registerMember("$Property", pclass, undefined, p);
        };
    }
    //@$UIComponent({ editableChildComponents: ["this", "me.main", "me.toolbar", "me.save", "me.remove", "me.refresh", "me.databinder"] })
    let DBObjectView = class DBObjectView extends Panel_8.Panel {
        constructor(props = {}) {
            super(props);
            this.dom.classList.add("designerNoResizable"); //this should not be resized only me.main
            //everytime call super.layout
            //DBObjectView.prototype.layout.bind(this)(this.me);
            // this.layout(this.me);
        }
        config(config) {
            super.config(config);
            return this;
        }
        _setDesignMode(enable) {
            //no Icons to add Components in designer
        }
        set value(value) {
            this.states.value.current = value;
        }
        get value() {
            return this.states.value.current;
        }
        /**
         * create a new object
         */
        createObject() {
            var clname = Registry_59.default.getData("$DBObjectView", Classes_20.classes.getClassName(this))[0].params[0].classname;
            var cl = Classes_20.classes.getClass(clname);
            this["value"] = new cl();
            this.callEvent("created", this["value"]);
            return this["value"];
        }
        oncreated(handler) {
            this.addEvent("created", handler);
        }
        async doSave(ob) {
            var obj = await ob.save();
            this["value"] = typeof obj === "object" ? obj : ob;
            this.callEvent("saved", ob);
        }
        /**
         * saves the object
         */
        async saveObject() {
            var ob = await this.states.value.bind.$fromForm();
            if (ob !== undefined) {
                await this.doSave(ob);
                (0, Notify_2.notify)("saved", "info");
            }
        }
        onsaved(handler) {
            this.addEvent("saved", handler);
        }
        /**
         * refresh the object
         */
        refreshObject() {
            this.states.value.bind.$toForm(); //this["value"]);
            this.callEvent("refreshed", this["value"]);
        }
        onrefreshed(handler) {
            this.addEvent("refreshed", handler);
        }
        /**
         * deletes Object
         **/
        deleteObject() {
            var ob = this.states.value.bind.$fromForm();
            if (ob === undefined)
                return;
            ob.remove();
            //set obj to null
            var clname = Registry_59.default.getData("$DBObjectView", Classes_20.classes.getClassName(this))[0].params[0].classname;
            var cl = Classes_20.classes.getClass(clname);
            this["value"] = new cl();
            this.callEvent("deleted", ob);
        }
        ondeleted(handler) {
            this.addEvent("deleted", handler);
        }
    };
    exports.DBObjectView = DBObjectView;
    __decorate([
        (0, Property_15.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "oncreated", null);
    __decorate([
        (0, Property_15.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "onsaved", null);
    __decorate([
        (0, Property_15.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "onrefreshed", null);
    __decorate([
        (0, Property_15.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "ondeleted", null);
    exports.DBObjectView = DBObjectView = __decorate([
        (0, Registry_58.$Class)("jassijs/ui/DBObjectView")
        //see export function $DBObjectView =>@$Property({name:"value", type: "DBObject", isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
        ,
        __metadata("design:paramtypes", [Object])
    ], DBObjectView);
    async function test() {
        var ret = new DBObjectView();
        return ret;
    }
    //@ts-ignore
    class DBObjectViewToolbar extends Panel_8.Panel {
        constructor(props) {
            super(props);
        }
        render() {
            return (0, Component_13.jc)(BoxPanel_2.BoxPanel, {
                horizontal: true,
                children: [
                    (0, Component_13.jc)(Button_1.Button, {
                        text: "",
                        tooltip: "save",
                        icon: "mdi mdi-content-save",
                        onclick: (event) => {
                            this.props.view.saveObject();
                        }
                    }),
                    (0, Component_13.jc)(Button_1.Button, {
                        text: "",
                        tooltip: "remove",
                        icon: "mdi mdi-delete",
                        onclick: (event) => {
                            this.props.view.deleteObject();
                        }
                    }),
                    (0, Component_13.jc)(Button_1.Button, {
                        text: "",
                        tooltip: "refresh",
                        icon: "mdi mdi-refresh",
                        onclick: (event) => {
                            this.props.view.refreshObject();
                        }
                    }),
                    (0, Component_13.jc)(Button_1.Button, {
                        text: "",
                        tooltip: "new",
                        icon: "mdi mdi-tooltip-plus-outline",
                        onclick: (event) => {
                            this.props.view.createObject();
                        }
                    })
                ]
            });
        }
    }
    exports.DBObjectViewToolbar = DBObjectViewToolbar;
});
define("jassijs/ui/DockingContainer", ["require", "exports", "jassijs/ext/goldenlayout", "jassijs/remote/Registry", "jassijs/ui/Container", "jassijs/ui/Button", "jassijs/ui/Textbox", "jassijs/ext/jquerylib", "jassijs/ext/intersection-observer"], function (require, exports, goldenlayout_2, Registry_60, Container_1, Button_2, Textbox_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DockingContainer = void 0;
    exports.test = test;
    goldenlayout_2 = __importDefault(goldenlayout_2);
    //goldenlayout custom version - fixed leak s.u.
    let DockingContainer = class DockingContainer extends Container_1.Container {
        ;
        /**
    * a container where the components could be docked
    * @class jassijs.ui.DockingContainer
    */
        constructor(id = undefined) {
            super(id);
        }
        componentDidMount() {
            this.maximize();
            var _this = this;
            this._registeredcomponents = {};
            this._init();
            this._lastSize = -1;
            this._intersectionObserver = new IntersectionObserver(entries => {
                if (entries[0].intersectionRatio <= 0) {
                    return;
                }
                if (_this._lastSize !== _this.dom.offsetWidth * _this.dom.offsetHeight) {
                    _this._lastSize = _this.dom.offsetWidth * _this.dom.offsetHeight;
                    _this._myLayout.updateSize();
                }
            }, { rootMargin: `0px 0px 0px 0px` });
            this._intersectionObserver.observe(_this.dom);
        }
        render() {
            return React.createElement("div", { className: "DockingContainer" /*, style= "Menu" */ });
        }
        static clearMemoryleak(container) {
            if (container === undefined) {
                //initialize to clean this code line $( document ).mouseup( lm.utils.fnBind( this._hideAdditionalTabsDropdown, this ) );
                if (goldenlayout_2.default.__lm.utils.fnBind.inited === undefined) {
                    goldenlayout_2.default.__lm.utils.fnBind = function (fn, context, boundArgs) {
                        var func = Function.prototype.bind.apply(fn, [context].concat(boundArgs || []));
                        func.orgFunc = fn;
                        func.orgOb = context;
                        return func;
                    };
                    goldenlayout_2.default.__lm.utils.fnBind.inited = true;
                }
                return;
            }
            container.off("destroy");
            //memory leak golden layout
            container.tab._dragListener._oDocument.unbind('mouseup touchend', container.tab._dragListener._fUp);
            container.tab._dragListener._fUp = undefined;
            container.tab._dragListener._oDocument.off('mousemove touchmove', container.tab._dragListener._fMove);
            container.tab._dragListener._oDocument.off('mouseup touchend', container.tab._dragListener._fUp);
            //uw hack in goldenlayout.js memory leak
            //change: $( document ).mouseup( lm.utils.fnBind( this._hideAdditionalTabsDropdown, this ) );
            //in    : this._uweiMouseUp=lm.utils.fnBind( this._hideAdditionalTabsDropdown, this );
            //        $( document ).mouseup(this._uweiMouseUp );
            $(document).off("mouseup", container.tab.header._uweiMouseUp);
            container.tab.header.activeContentItem = undefined;
            $(container.tab.header.element).off("destroy");
            $(container.tab.header.element).off("mouseup");
            $(container.tab.header.element).remove();
            $(container.tab.element).remove();
            $(container.element).remove();
        }
        /**
         * add a component to the container
         * @param {jassijs.ui.Component} component - the component to add
         * @param {string} title - the caption of the window
         * @param {string} name - the name of the window
         */
        add(component, title = "", name = undefined) {
            var exists = this._find(this._myLayout.root, name);
            component._parent = this;
            component.maximize();
            component.domWrapper._parent = this;
            if (name === undefined)
                name = title;
            this._registeredcomponents[name] = component;
            if (exists !== undefined) {
                console.warn("check memory leak");
                var old = exists.element[0].children[0].children[0];
                exists.element[0].children[0].replaceChild(component.domWrapper, old);
                old._this._parent = undefined;
                old._this.domWrapper._parent = undefined;
                return;
            }
            this._components.push(component);
            //delete from old parent
            if (component.domWrapper.parentNode !== null && component.domWrapper.parentNode !== undefined) {
                component.domWrapper.parentNode.removeChild(component.domWrapper);
            }
            var config = {
                title: title,
                type: 'component',
                componentName: name,
                componentState: { title: title, name: name }
            };
            this._registerGL(name);
            var center = this._myLayout.root.contentItems[0];
            center.addChild(config);
        }
        /**
         * called on resizing could be redefined
         */
        onresize() {
        }
        /**
         * register a component to Golden layout
         * @param {String} name - the name of the component
         */
        _registerGL(name) {
            var _this = this;
            //save the component
            this._myLayout.registerComponent(name, function (container, state) {
                var component = _this._registeredcomponents[name];
                container.on('resize', function () {
                    _this.onresize();
                });
                container.on("destroy", function (data) {
                    container.off("resize");
                    container.off("destroy");
                    //memory leak golden layout
                    container.tab._dragListener._oDocument.unbind('mouseup touchend', container.tab._dragListener._fUp);
                    container.tab._dragListener._fUp = undefined;
                    container.tab._dragListener._oDocument.off('mousemove touchmove', container.tab._dragListener._fMove);
                    container.tab._dragListener._oDocument.off('mouseup touchend', container.tab._dragListener._fUp);
                    if (_this._noDestroyChilds !== true) {
                        if (component._this !== undefined)
                            component._this.destroy();
                        delete _this._registeredcomponents[name];
                    }
                    delete _this._myLayout._components[name];
                    //uw hack in goldenlayout.js memory leak
                    //change: $( document ).mouseup( lm.utils.fnBind( this._hideAdditionalTabsDropdown, this ) );
                    //in    : this._uweiMouseUp=lm.utils.fnBind( this._hideAdditionalTabsDropdown, this );
                    //        $( document ).mouseup(this._uweiMouseUp );
                    var kk = container.tab.header._hideAdditionalTabsDropdown.bound === container.tab.header._uweiMouseUp;
                    //$(document).off("mouseup", container.tab.header._uweiMouseUp);
                    // container.tab.header.activeContentItem = undefined;
                    $(container.tab.header.element).off("destroy");
                    $(container.tab.header.element).off("mouseup");
                    $(container.tab.header.element).remove();
                    $(container.tab.element).remove();
                    $(container.element).remove();
                    delete component._container;
                });
                if (component.dom !== undefined)
                    component = component.dom;
                component._container = container;
                container.getElement()[0].appendChild(component); //html( '<h2>' + state.text + '</h2>');
            });
        }
        /**
         * remove a component from the container
         * @param {jassijs.ui.Component} component - the component to add
         */
        remove(component) {
            component._parent = undefined;
            component.domWrapper._parent = undefined;
            var pos = this._components.indexOf(component);
            if (pos >= 0)
                this._components.splice(pos, 1);
            var container = component.dom._container;
            //   container.getElement()[0].removeChild(component.dom);
            //            this.dom.removeChild(component.domWrapper);
            //console.warn("TODO call close tab?")
        }
        _init() {
            var config = {
                settings: {
                    showPopoutIcon: false,
                },
                content: [{
                        type: 'row',
                        isClosable: false,
                        content: []
                    }],
            };
            this._myLayout = new goldenlayout_2.default(config, this.dom);
            //	this._myLayout.on( 'selectionChanged', function(evt){
            //	    debugger;
            //	});
            var _this = this;
            this._myLayout.init();
            var thislayout = this._myLayout;
            this._windowResizer = function () {
                _this.update();
                window.setTimeout(function () {
                    _this.update();
                }, 100);
            };
            $(window).resize(this._windowResizer);
            /* this._parentResizer=function(){
                 //   alert("now");
                   var h = $(_this.dom.parent).height();
                   var w = $(_this.dom.parent).weigth();
                   _this.width=w;
                   _this.height=h;
               }
             $(this.dom.parent).resize(this._parentResizer);*/
            var func = function () {
                _this._myLayout.update();
                //     window.setTimeout(func,500);
            };
            // var thislayout=this._myLayout;
            //    window.setTimeout(func,500);
            /* var test=this.dom.parent;
                  $(this.dom.parent).resize(function(){
                 var h = $(_this.dom.parent).height();
                 var w = $(_this.dom.parent).weigth();
                 _this.width=w;
                 _this.height=h;
             });*/
            // $(this.dom.firstChild).css("height","100%");
            //   $(this.dom.firstChild).css("width","100%");
        }
        /**
         * activate the window
         * @param {string} name - the name of the window
         */
        show(name) {
            var m = this._find(this._myLayout.root, name);
            if (m.parent.header !== undefined)
                m.parent.header.parent.setActiveContentItem(m);
        }
        /**
         * update the layout (size)
         */
        update() {
            this._myLayout.updateSize();
        }
        /**
         * finds a child in the config
         */
        _find(parent, name) {
            if (parent.contentItems === undefined)
                return undefined;
            for (var x = 0; x < parent.contentItems.length; x++) {
                if (parent.contentItems[x].config.componentName === name)
                    return parent.contentItems[x];
                var test = this._find(parent.contentItems[x], name);
                if (test !== undefined)
                    return test;
            }
            return undefined;
        }
        /** @member {String} - the layout of the windows */
        get layout() {
            return JSON.stringify(this._myLayout.toConfig());
        }
        set layoutold(value) {
            var fc = this.dom.firstChild;
            while (fc) {
                this.dom.removeChild(fc);
                fc = this.dom.firstChild;
            }
            var config = JSON.parse(value);
            this._myLayout = new goldenlayout_2.default(config, this.dom);
            for (var name in this._registeredcomponents)
                this._registerGL(name);
            this._myLayout.init();
            this.update();
        }
        set layout(value) {
            for (var x = 0; x < this._components.length; x++) {
                var component = this._components[x];
                var container = component.dom["_container"];
                try {
                    if (container && container.getElement()[0].children.length > 0)
                        container.getElement()[0].removeChild(container.getElement()[0].firstChild);
                }
                catch (_a) {
                    var h = 9;
                }
            }
            /* var fc = this.dom.firstChild;
    
             while( fc ) {
                 this.dom.removeChild( fc );
                 fc = this.dom.firstChild;
             }*/
            this._noDestroyChilds = true;
            this._myLayout.destroy();
            delete this._noDestroyChilds;
            var config = JSON.parse(value);
            this._myLayout = new goldenlayout_2.default(config, this.dom);
            for (var name in this._registeredcomponents)
                this._registerGL(name);
            this._myLayout.init();
            this.update();
            this.addSelectionEvent(this._myLayout.root);
        }
        addSelectionEvent(element) {
            if (element.contentItems !== undefined) {
                element.on("activeContentItemChanged", function (evt) {
                    //console.log(evt.componentName);
                });
                for (let x = 0; x < element.contentItems.length; x++) {
                    this.addSelectionEvent(element.contentItems[x]);
                }
            }
        }
        destroy() {
            var _a;
            $(window).off("resize", this._windowResizer);
            //  $(this.dom.parent).off("resize",this._parentResizer);
            this._windowResizer = undefined;
            // this._parentResizer=undefined;
            (_a = this._intersectionObserver) === null || _a === void 0 ? void 0 : _a.unobserve(this.dom);
            this._intersectionObserver = undefined;
            this._myLayout.destroy();
            this._myLayout = undefined;
            this._registeredcomponents = {};
            super.destroy();
        }
    };
    exports.DockingContainer = DockingContainer;
    exports.DockingContainer = DockingContainer = __decorate([
        (0, Registry_60.$Class)("jassijs.ui.DockingContainer"),
        __metadata("design:paramtypes", [Object])
    ], DockingContainer);
    function test() {
        var dock = new DockingContainer();
        var bt = new Button_2.Button();
        dock.add(bt, "Hallo1", "Hallo1");
        var text = new Textbox_5.Textbox();
        dock.add(text, "Hallo2", "Hallo2");
        // jassijs.windows.add(dock,"dock");
        //dock.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"stack","width":100,"height":80.99041533546327,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Hallo","type":"component","componentName":"Hallo","componentState":{"title":"Hallo","name":"Hallo"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.00958466453674,"content":[{"title":"Hallo2","type":"component","componentName":"Hallo2","componentState":{"title":"Hallo2","name":"Hallo2"},"isClosable":true,"reorderEnabled":true}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        bt.onclick(function () {
            text.value = dock.layout;
            //  dock.layout=state;
            //var config=JSON.parse(state);
            //dock._myLayout = new GoldenLayout( config,dock.dom );
            //dock._myLayout.init();
        });
        return dock;
    }
});
define("jassijs/ui/HTMLEditorPanel", ["require", "exports", "jassijs/ui/Panel", "jassijs/ui/HTMLPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ext/tinymce", "jassijs/remote/Registry"], function (require, exports, Panel_9, HTMLPanel_1, Button_3, Registry_61, tinymce_1, Registry_62) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEditorPanel = void 0;
    exports.te = te;
    tinymce_1 = __importDefault(tinymce_1);
    Registry_62 = __importDefault(Registry_62);
    class Me {
    }
    let HTMLEditorPanel = class HTMLEditorPanel extends Panel_9.Panel {
        constructor(id = undefined) {
            super();
            this.layout();
        }
        async layout() {
            var me = this.me = {};
            me.IDHtml = new HTMLPanel_1.HTMLPanel();
            me.IDChange = new Button_3.Button();
            this.add(me.IDHtml);
            this.add(me.IDChange);
            //me.IDHtml.text="Hallo";
            var randclass = "ed" + Registry_62.default.nextID();
            me.IDHtml.dom.classList.add(randclass);
            me.IDChange.text = "OK";
            me.IDChange.onclick(function (event) {
            });
            /*	 $(randclass).tinymce({
                 //	script_url : '../js/tinymce/tinymce.min.js',
                         statusbar: false,
                            //toolbar: true,
                            menubar: false
                 });*/
            // tinymce.activeEditor.destroy();
            var editor = await tinymce_1.default.init({
                statusbar: false,
                //toolbar: true,
                menubar: false,
                selector: '.' + randclass,
                //  setup:function(ed) {
                //   ed.on('blur', function(e) {
                //    		if($("#"+ed.id)[0]===undefined)
                //  			return;
                //    var html=$("#"+ed.id)[0]._this;
                //  var text= ed.getContent();
                //text='"'+text.substring(31,text.length-7).replaceAll("\"","\\\"")+'"';
                //_this._propertyEditor.setPropertyInCode("text",text,true);
                //$(html.domWrapper).draggable('enable');
                //   }
                // );
                // }
            });
            // editor.setContent("Hallo");
            //tinymce.activeEditor.remove();
            //tinymce.execCommand('mceRemoveControl', true, '');
            // me.IDHtml.height="calc(100% - 50px)";
        }
        set value(val) {
            var el = this.dom.children[0];
            if (el === undefined) {
                var el1 = document.createTextNode(val);
                this.dom.appendChild(el1);
            }
            else
                el.innerHTML = val;
        }
        get value() {
            var el = this.dom.children[0];
            if (el === undefined)
                return "";
            return el.innerHTML;
        }
    };
    exports.HTMLEditorPanel = HTMLEditorPanel;
    exports.HTMLEditorPanel = HTMLEditorPanel = __decorate([
        (0, Registry_61.$Class)("jassijs.ui.HTMLEditorPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLEditorPanel);
    function te() {
        //var dlg=new HTMLEditorPanel();
        // dlg.value="Sample text";
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //return dlg;
    }
});
// return CodeEditor.constructor;
define("jassijs/ui/HTMLPanel", ["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/DataComponent"], function (require, exports, Component_14, Registry_63, Property_16, DataComponent_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLPanel = void 0;
    exports.test = test;
    var bugtinymce = undefined;
    let HTMLPanel = class HTMLPanel extends DataComponent_2.DataComponent {
        constructor(properties = {}) {
            super(properties);
            this.toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
            this.newlineafter = false;
        }
        render() {
            return React.createElement("div", { contentEditable: "false", className: "HTMLPanel", tabIndex: -1 },
                React.createElement("div", { className: "HTMLPanelContent" }, " "));
        }
        config(config) {
            super.config(config);
            return this;
        }
        get newlineafter() {
            return this.dom.style.display === "inline-block";
        }
        set newlineafter(value) {
            this.dom.style.display = value ? "" : "inline-block";
            this.domWrapper.style.display = value ? "" : "inline-block";
            this.dom.children[0].style.display = value ? "" : "inline-block";
        }
        compileTemplate(template) {
            return new Function('obj', 'with(obj){ return \'' +
                template.replace(/\n/g, '\\n').split(/{{([^{}]+)}}/g).map(function (expression, i) {
                    return i % 2 ? ('\'+(' + expression.trim() + ')+\'') : expression;
                }).join('') +
                '\'; }');
        }
        get template() {
            return this._template;
        }
        set template(value) {
            this._template = value;
            this.value = this.value; //reformat value
        }
        /**
         * @member {string} code - htmlcode of the component
         **/
        set value(code) {
            var scode = code;
            this.states.value.current = code;
            if (this.template) {
                if (this.states.value.current === undefined)
                    scode = "";
                else {
                    try {
                        scode = this.compileTemplate(this.template)(code);
                    }
                    catch (err) {
                        scode = err.message;
                    }
                }
            }
            var el = this.dom.children[0];
            if (el === undefined) {
                el = document.createTextNode(scode);
                this.dom.appendChild(el);
            }
            else
                el.innerHTML = scode;
        }
        get value() {
            return this.states.value.current;
        }
        destroy() {
            super.destroy();
        }
    };
    exports.HTMLPanel = HTMLPanel;
    __decorate([
        (0, Property_16.$Property)({ description: "line break after element", default: false }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel.prototype, "newlineafter", null);
    __decorate([
        (0, Property_16.$Property)({ decription: 'e.g. component.value=new Person();component.template:"{{name}}"' }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLPanel.prototype, "template", null);
    __decorate([
        (0, Property_16.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLPanel.prototype, "value", null);
    exports.HTMLPanel = HTMLPanel = __decorate([
        (0, Component_14.$UIComponent)({ fullPath: "common/HTMLPanel", icon: "mdi mdi-cloud-tags" /*, initialize: { value: "text" } */ }),
        (0, Registry_63.$Class)("jassijs.ui.HTMLPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel);
    function test() {
        var ret = new HTMLPanel();
        ret.value = "<span style='font-size: 12px;' data-mce-style='font-size: 12px;'>dsf<span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>g<strong>sdfgsd</strong>fgsdfg</span></span><br><strong><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>sdfgsdgsdf</span>gfdsg</strong>";
        ret.height = 400;
        ret.width = 400;
        return ret;
    }
});
define("jassijs/ui/Image", ["require", "exports", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/ui/DataComponent"], function (require, exports, Component_15, Property_17, Registry_64, DataComponent_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Image = void 0;
    exports.test = test;
    let Image = class Image extends DataComponent_3.DataComponent {
        /* get dom(){
             return this.dom;
         }*/
        constructor(config = {}) {
            super(config);
        }
        render() {
            return React.createElement("div", { style: { display: "inline-block", whiteSpace: "nowrap" } },
                React.createElement("img", Object.assign({}, this.props.domProperties, { src: "", alt: "" })));
        }
        config(config) {
            super.config(config);
            return this;
        }
        onclick(handler) {
            this.on("click", handler);
        }
        /**
        * @member {string} value - value of the component
        */
        set value(value) {
            this.src = value;
        }
        get value() {
            return this.src;
        }
        get width() {
            return super.width;
        }
        set width(value) {
            if (value === undefined)
                this.dom.children[0].setAttribute("width", "");
            else
                (this.dom.children[0]).setAttribute("width", "100%");
            super.width = value;
        }
        get height() {
            return super.height;
        }
        set height(value) {
            if (value === undefined)
                (this.dom.children[0]).setAttribute("height", "");
            else
                (this.dom.children[0]).setAttribute("height", "100%");
            super.height = value;
        }
        set src(icon) {
            this.dom.classList.forEach((cl) => { this.dom.classList.remove(cl); });
            (this.dom.children[0]).setAttribute("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi ")) {
                icon.split(" ").forEach((cl) => this.dom.classList.add(cl));
                this.dom.children[0].style.visibility = "hidden";
            }
            else {
                (this.dom.children[0]).setAttribute("src", icon);
                this.dom.children[0].style.visibility = "";
            }
        }
        get src() {
            var ret = this.dom.children[0].getAttribute("src");
            if (ret === "")
                return this.dom.getAttribute('class');
            else
                return ret;
            //            return $(this.dom).attr("src");
        }
    };
    exports.Image = Image;
    __decorate([
        (0, Property_17.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Image.prototype, "onclick", null);
    __decorate([
        (0, Property_17.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Image.prototype, "value", null);
    __decorate([
        (0, Property_17.$Property)({ type: "image" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Image.prototype, "src", null);
    exports.Image = Image = __decorate([
        (0, Component_15.$UIComponent)({ fullPath: "default/Image", icon: "mdi mdi-file-image" }) //
        ,
        (0, Registry_64.$Class)("jassijs.ui.Image"),
        __metadata("design:paramtypes", [Object])
    ], Image);
    function test() {
        var ret = new Image().config({ src: "mdi mdi-file-image" });
        return ret;
    }
});
define("jassijs/ui/InvisibleComponent", ["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Component_16, Registry_65, Property_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvisibleComponent = void 0;
    /**
     * invivisible Component
     **/
    let InvisibleComponent = class InvisibleComponent extends Component_16.Component {
        constructor(properties = {}) {
            super(properties);
            this.$isInivisibleComponent = true;
        }
    };
    exports.InvisibleComponent = InvisibleComponent;
    exports.InvisibleComponent = InvisibleComponent = __decorate([
        (0, Registry_65.$Class)("jassijs.ui.InvisibleComponent")
        /*@$Property({name:"label",hide:true})
        @$Property({name:"icon",hide:true})
        @$Property({name:"tooltip",hide:true})
        @$Property({name:"x",hide:true})
        @$Property({name:"y",hide:true})
        @$Property({name:"width",hide:true})
        @$Property({name:"height",hide:true})
        @$Property({name:"contextMenu",hide:true})
        @$Property({name:"invisible",hide:true})
        @$Property({name:"hidden",hide:true})
        @$Property({name:"styles",hide:true})*/
        ,
        (0, Property_18.$Property)({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], InvisibleComponent);
});
define("jassijs/ui/Menu", ["require", "exports", "jassijs/ui/Container", "jassijs/ui/Property", "jassijs/ui/MenuItem", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ext/jquerylib"], function (require, exports, Container_2, Property_19, MenuItem_3, Registry_66, Component_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Menu = void 0;
    exports.test = test;
    let Menu = class Menu extends Container_2.Container {
        constructor(options = undefined) {
            var _a;
            super(options);
            this._isRoot = true;
            if (((_a = this.props) === null || _a === void 0 ? void 0 : _a.noUpdate) === true) {
                this._noUpdate = true;
            }
            else
                $(this.dom).menu();
            this._text = "";
            this._icon = "";
        }
        componentDidMount() {
        }
        render() {
            return React.createElement("ul", { className: "InvisibleComponent" /*, style= "Menu" */ });
        }
        config(config) {
            super.config(config);
            return this;
        }
        _sample() {
            /*
        <li>  <div><img  src="res/car.ico" />Save</div></li>
        <li title="create button" onclick="doCreate()"><div><img  src="res/car.ico" />Create</div>
            <ul class="Menu" style="visibility:hidden">
            <li title="add new" onclick="doCreate()"><div><img  src="res/add-component.ico" /></div></li>
            </ul>
        </li>
        <li title="update button2"> <div> <img src="res/tree.ico" />Update2</div>
            <ul style="Menu">
              <li> <div><img   src="res/car.ico" />Hoho</div></li>
             <li title="add new" onclick="doCreate()"><div><img  src="res/add-component.ico" /></div></li>
              </ul>
        </li>
        <li title="add new" onclick="doCreate()"><div><img  src="res/add-component.ico" /></div></li>
        </ul>`);*/
        }
        _menueChanged() {
            if (this._isRoot && this._noUpdate !== true) {
                $(this.dom).menu();
                $(this.dom).menu("destroy");
                $(this.dom).menu();
            }
            if (this._parent !== undefined && this._parent._menueChanged !== undefined)
                this._parent._menueChanged();
        }
        getMainMenu() {
            if (this._parent !== undefined && this._parent.getMainMenu !== undefined)
                return this._parent.getMainMenu();
            if (this._mainMenu !== undefined)
                return this._mainMenu;
            return this;
        }
        /**
        * adds a component to the container before an other component
        * @param {jassijs.ui.Component} component - the component to add
        * @param {jassijs.ui.Component} before - the component before then component to add
        */
        addBefore(component, before) {
            super.addBefore(component, before);
            this._menueChanged();
        }
        /**
          * adds a component to the container
          * @param {jassijs.ui.Menu} component - the component to add
          */
        add(component) {
            super.add(component);
            this._menueChanged();
        }
        onclick(handler) {
            document.getElementById(this._id).addEventListener("click", function (ob) {
                handler(ob);
            });
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
            }
            super.extensionCalled(action);
        }
        /**
        * activates or deactivates designmode
        * @param {boolean} enable - true if activate designMode
        */
        _setDesignMode(enable) {
        }
        destroy() {
            $(this.dom).menu();
            $(this.dom).menu("destroy");
            super.destroy();
        }
    };
    exports.Menu = Menu;
    __decorate([
        (0, Property_19.$Property)({ name: "onclick", type: "function", default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Menu.prototype, "onclick", null);
    exports.Menu = Menu = __decorate([
        (0, Component_17.$UIComponent)({ fullPath: "common/Menu", icon: "mdi mdi-menu", initialize: { text: "menu" } }),
        (0, Registry_66.$Class)("jassijs.ui.Menu"),
        __metadata("design:paramtypes", [Object])
    ], Menu);
    function test() {
        var men = new Menu();
        var it = new MenuItem_3.MenuItem();
        it.text = "Hallo";
        //it.onclick(() => alert("ok"));
        men.add(it);
        return men;
    }
});
define("jassijs/ui/MenuItem", ["require", "exports", "jassijs/ui/Component", "jassijs/ui/Menu", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/ui/Container", "jassijs/ext/jquerylib"], function (require, exports, Component_18, Menu_3, Property_20, Registry_67, Container_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MenuItem = void 0;
    exports.test = test;
    let MenuItem = class MenuItem extends Container_3.Container {
        //_components: Component[];
        constructor(props = {}) {
            super(Object.assign(props, { noWrapper: true }));
            //super.init('<li style="white-space: nowrap"><div><span class="menuitemspan"><img style="display: none" class="menuitemicon" /></span><span class="menuitemtext">.</span></div></li>');
            this.dom.classList.add("designerNoResizable");
            this._text = "";
            this._icon = "";
            this.items = new Menu_3.Menu();
            $(this.items.dom).menu("destroy");
            this.items._parent = this;
            this._components = [this.items]; //neede for getEditableComponents
            delete this.items._isRoot;
        }
        render() {
            return React.createElement("li", Object.assign({}, this.props.domProperties, { style: { whiteSpace: "nowrap" } }),
                React.createElement("div", null,
                    React.createElement("span", { className: "menuitemspan" },
                        React.createElement("img", { style: { display: "none" }, className: "menuitemicon" })),
                    React.createElement("span", { className: "menuitemtext" }, ".")));
        }
        config(config) {
            super.config(config);
            return this;
        }
        onclick(handler) {
            this.on("click", handler);
        }
        set icon(icon) {
            this._icon = icon;
            var img;
            var el1 = this.dom.querySelector(".menuitemspan");
            el1.setAttribute("class", ""); //removeClass();
            el1.classList.add("menuitemspan");
            this.dom.querySelector(".menuitemicon").setAttribute("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi")) {
                icon.split(" ").forEach((cl) => el1.classList.add(cl));
                this.dom.querySelector(".menuitemicon").style.display = "none";
            }
            else {
                if (icon)
                    this.dom.querySelector(".menuitemicon").style.display = "initial";
                this.dom.querySelector(".menuitemicon").setAttribute("src", icon);
            }
            //if (icon === "")
            //    icon = "res/dummy.ico";
            //$(this.dom).find(".menuitemicon").attr("src", icon);
        }
        get icon() {
            var ret = this.dom.querySelector(".menuitemicon").getAttribute("src");
            if (ret === "") {
                ret = this.dom.querySelector(".menuitemicon").getAttribute("class").replace("menuitemspan ", "");
            }
            return ret;
        }
        set text(value) {
            //<li><div><img  src="res/car.ico" /><span>Save</span></div></li>
            this._text = value;
            var h;
            this.dom.querySelector(".menuitemtext").innerText = value;
        }
        get text() {
            return this.dom.querySelector(".menuitemtext").innerText;
        }
        destroy() {
            super.destroy();
            this.items.destroy;
        }
        getMainMenu() {
            if (this._parent !== undefined && this._parent.getMainMenu !== undefined)
                return this._parent.getMainMenu();
            if (this._mainMenu !== undefined)
                return this._mainMenu;
            return undefined;
        }
        _menueChanged() {
            if (this.items._components.length > 0 && this.items.dom.parentNode !== this.dom) {
                this.items.dom.parentNode.removeChild(this.items.dom);
                this.dom.appendChild(this.items.dom);
                this.items.dom.classList.add("jcontainer"); //for drop-target
            }
            if (this.items._components.length > 0)
                this.dom.classList.add("iw-has-submenu");
            else
                this.dom.classList.remove("iw-has-submenu");
            if (this._parent !== undefined && this._parent._menueChanged !== undefined)
                this._parent._menueChanged();
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._designMode = action.componentDesignerSetDesignMode.enable;
                return this.items.extensionCalled(action); //setDesignMode(enable);
            }
            if (action.componentDesignerComponentCreated) {
                var x = 0;
                var test = this.getMainMenu();
                if (test !== undefined) {
                    //$(test.menu.dom).css("display","inline-block");//
                    test._menueChanged();
                }
                return;
                //var design=codeeditor._design.dom;
                //component.show({top:$(design).offset().top+30,left:$(design).offset().left+5});
            }
            super.extensionCalled(action);
        }
    };
    exports.MenuItem = MenuItem;
    __decorate([
        (0, Property_20.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], MenuItem.prototype, "onclick", null);
    __decorate([
        (0, Property_20.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MenuItem.prototype, "icon", null);
    __decorate([
        (0, Property_20.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MenuItem.prototype, "text", null);
    exports.MenuItem = MenuItem = __decorate([
        (0, Component_18.$UIComponent)({ fullPath: "common/MenuItem", icon: "mdi mdi-menu-open", initialize: { text: "menu" }, editableChildComponents: ["items"] }),
        (0, Registry_67.$Class)("jassijs.ui.MenuItem"),
        __metadata("design:paramtypes", [Object])
    ], MenuItem);
    async function test() {
        // kk.o=0;
        var menu = new Menu_3.Menu();
        var save = new MenuItem();
        var save2 = new MenuItem();
        menu.width = 200;
        menu.add(save);
        save.onclick(function () {
            alert("ok");
        });
        save.text = "dd";
        save.items.add(save2);
        save2.text = "pppq";
        save2.icon = "mdi mdi-car"; //"res/red.jpg";
        save2.onclick(function (event) {
        });
        return menu;
    }
});
define("jassijs/ui/Notify", ["require", "exports", "jquery", "jquery.notify"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.notify = notify;
    exports.notifyAddStyle = notifyAddStyle;
    //@ts-ignore
    $.notify.defaults({ position: "bottom right", className: "info" });
    function notify(text, style, options = undefined) {
        //@ts-ignore
        $.notify(text, style, options);
    }
    function notifyAddStyle(style, options) {
        //@ts-ignore
        $.notify.addStyle(style, options);
    }
});
define("jassijs/ui/ObjectChooser", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Table", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Textbox", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/remote/Classes", "jassijs/ext/jquerylib"], function (require, exports, Registry_68, Table_2, Panel_10, Button_4, Textbox_6, Property_21, Component_19, Classes_21) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObjectChooser = void 0;
    exports.test = test;
    exports.test2 = test2;
    /*
    https://blog.openshift.com/using-filezilla-and-sftp-on-windows-with-openshift/
    */
    class Me {
    }
    let ObjectChooser = class ObjectChooser extends Button_4.Button {
        constructor(props = {}) {
            super(props);
            /**
            * @member {number} - the height of the dialog
            */
            this.dialogHeight = 300;
            /**
            * @member {number} - the width of the dialog
            */
            this.dialogWidth = 450;
            this.layout();
        }
        config(config) {
            super.config(config);
            return this;
        }
        get title() {
            return "Select";
        }
        layout() {
            var me = this.me = {};
            var _this = this;
            this.autocommit = true;
            this.text = "";
            this.onclick(function (event) {
                if (_this.value !== undefined) {
                    me.IDTable.value = _this.value;
                }
                var dlg = $(me.IDPanel.dom).dialog({
                    width: _this.dialogWidth,
                    height: _this.dialogHeight,
                    modal: true
                    /*beforeClose: function(event, ui) {
                       
                    } */
                });
                if (me.IDTable.table.getSelectedRows().length > 0)
                    me.IDTable.table.scrollToRow(me.IDTable.table.getSelectedRows()[0]);
                _this.callEvent("showDialog", event);
            });
            this.icon = "mdi mdi-glasses";
            this.width = 29;
            this.height = 21;
            me.IDPanel = new Panel_10.Panel();
            me.IDCancel = new Button_4.Button();
            var _this = this;
            me.IDSearch = new Textbox_6.Textbox();
            me.IDOK = new Button_4.Button();
            me.IDTable = new Table_2.Table();
            me.IDPanel.add(me.IDSearch);
            me.IDPanel.add(me.IDOK);
            me.IDPanel.add(me.IDCancel);
            me.IDPanel.add(me.IDTable);
            me.IDOK.width = 65;
            me.IDOK.text = "OK";
            me.IDSearch.width = "calc(100% - 132px)";
            me.IDOK.onclick(function (event) {
                _this.ok();
            });
            //me.IDSearch.width = "calc (100% - 300px)";
            me.IDSearch.oninput(function (event) {
                me.IDTable.search("all", me.IDSearch.value, true);
            });
            me.IDTable.dom.addEventListener("dblclick", function (data) {
                setTimeout(() => { _this.ok(); }, 200);
            });
            me.IDSearch.onkeydown(function (event) {
                if (event.keyCode == 13) {
                    _this.ok();
                    return false;
                }
                if (event.keyCode == 27) {
                    _this.cancel();
                    return false;
                }
            });
            me.IDSearch.height = 15;
            me.IDTable.width = "100%";
            me.IDTable.height = "calc(100% - 38px)";
            setTimeout(() => { me.IDSearch.focus(); }, 200);
            setTimeout(() => { me.IDSearch.focus(); }, 1000);
            me.IDCancel.onclick(function (event) {
                _this.cancel();
            });
            me.IDCancel.width = 65;
            me.IDCancel.text = "Cancel";
            me.IDPanel.height = "100%";
            me.IDPanel.width = "100%";
        }
        ok() {
            var me = this.me;
            this.value = me.IDTable.value;
            $(me.IDPanel.dom).dialog("destroy");
            this.callEvent("change", event);
        }
        cancel() {
            var me = this.me;
            $(me.IDPanel.dom).dialog("destroy");
        }
        set value(value) {
            this.states.value.current = value;
        }
        get value() {
            return this.states.value.current;
        }
        async loadObjects(classname) {
            var cl = await Classes_21.classes.loadClass(classname);
            return await cl.find();
        }
        set items(value) {
            var _this = this;
            if (value !== undefined && typeof (value) === "string") {
                this.loadObjects(value).then((data) => {
                    _this.me.IDTable.items = data;
                });
            }
            else
                _this.me.IDTable.items = value;
        }
        get items() {
            return this._items;
        }
        onchange(handler) {
            this.addEvent("change", handler);
        }
        get autocommit() {
            return this._autocommit;
        }
        set autocommit(value) {
            this._autocommit = value;
            //if (this._databinder !== undefined)
            //	this._databinder.checkAutocommit(this);
        }
        /**
         * binds a component to a databinder
         * @param {jassijs.ui.Databinder} databinder - the databinder to bind
         * @param {string} property - the property to bind
         */
        set bind(databinder) {
            if (Array.isArray(databinder)) {
                this._databinder = databinder[0];
                this._databinder.add(databinder[1], this, "onchange");
            }
            else {
                this._databinder = databinder._databinder;
                this._databinder.add(databinder._propertyname, this, "onchange");
            }
            //databinder.checkAutocommit(this);
        }
        destroy() {
            this.states.value.current = undefined;
            this.me.IDPanel.destroy();
            super.destroy();
        }
    };
    exports.ObjectChooser = ObjectChooser;
    __decorate([
        (0, Property_21.$Property)({ default: 450 }),
        __metadata("design:type", Number)
    ], ObjectChooser.prototype, "dialogHeight", void 0);
    __decorate([
        (0, Property_21.$Property)({ default: 300 }),
        __metadata("design:type", Number)
    ], ObjectChooser.prototype, "dialogWidth", void 0);
    __decorate([
        (0, Property_21.$Property)({ type: "string", description: "the classname for to choose" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ObjectChooser.prototype, "items", null);
    __decorate([
        (0, Property_21.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ObjectChooser.prototype, "onchange", null);
    __decorate([
        (0, Property_21.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], ObjectChooser.prototype, "autocommit", null);
    __decorate([
        (0, Property_21.$Property)({ type: "databinder" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ObjectChooser.prototype, "bind", null);
    exports.ObjectChooser = ObjectChooser = __decorate([
        (0, Component_19.$UIComponent)({ fullPath: "common/ObjectChooser", icon: "mdi mdi-glasses" }),
        (0, Registry_68.$Class)("jassijs.ui.ObjectChooser"),
        __metadata("design:paramtypes", [Object])
    ], ObjectChooser);
    async function test() {
        // kk.o=0;
        var User = (await new Promise((resolve_20, reject_20) => { require(["jassijs/remote/security/User"], resolve_20, reject_20); }).then(__importStar)).User;
        var dlg = new ObjectChooser();
        dlg.items = "jassijs.security.User";
        dlg.value = (await User.findOne());
        //	var kunden=await jassijs.db.load("de.Kunde");
        //	dlg.value=kunden[4];
        //	dlg.me.IDTable.items=kunden;
        return dlg;
    }
    async function test2() {
        // kk.o=0;
        /* var Kunde = (await import("de/remote/Kunde")).Kunde;
         var dlg = new ObjectChooser();
         dlg.items = "de.Kunde";
         dlg.value = (await Kunde.find({ id: 1 }))[0];
         //	var kunden=await jassijs.db.load("de.Kunde");
         //	dlg.value=kunden[4];
         //	dlg.me.IDTable.items=kunden;
         return dlg;*/
    }
});
define("jassijs/ui/OptionDialog", ["require", "exports", "jassijs/ui/Panel", "jassijs/ui/BoxPanel", "jassijs/ui/HTMLPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/Textbox", "jassijs/remote/Classes", "jassijs/ext/jquerylib"], function (require, exports, Panel_11, BoxPanel_3, HTMLPanel_2, Button_5, Registry_69, Property_22, Textbox_7, Classes_22) {
    "use strict";
    var OptionDialog_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OptionDialog = void 0;
    exports.test2 = test2;
    class Me {
    }
    let OptionDialog = OptionDialog_1 = class OptionDialog extends Panel_11.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.parentComponent = undefined;
            this.text = "";
            this.options = [];
            this.selectedOption = "cancel";
            /* @member {string} - the text for the Dialog*/
        }
        layout() {
            var me = this.me = {};
            var _this = this;
            me.boxpanel1 = new BoxPanel_3.BoxPanel();
            me.htmlpanel1 = new HTMLPanel_2.HTMLPanel();
            me.buttons = new BoxPanel_3.BoxPanel();
            me.buttons.horizontal = true;
            me.htmlpanel1.value = this.text;
            this.add(me.boxpanel1);
            this.add(me.buttons);
            me.htmlpanel1.value = "";
            me.boxpanel1.add(me.htmlpanel1);
            me.boxpanel1.width = "100%";
            me.boxpanel1.height = "calc(100% - 50px)";
            me.inputText = new Textbox_7.Textbox();
            me.boxpanel1.add(me.inputText);
            for (var x = 0; x < this.options.length; x++) {
                var button = new Button_5.Button();
                me.buttons.add(button);
                button.onclick(function (evt) {
                    _this.selectedOption = evt.currentTarget._this.text;
                    $(_this.dom).dialog("close");
                });
                button.text = this.options[x];
            }
        }
        /**
        * ask for properties in propertygrid
        * @param text - the text to be displayed
        * @param  properties - the properties which should be filled, marked by @$Property
        * @param  options - the options e.g ["ok","Cancel"]
        * @param parent - the parent component
        * @param modal - display the dialog modal
        */
        static async askProperties(text, properties, options, parent = undefined, modal = false) {
            return await OptionDialog_1._show(text, options, parent, modal, undefined, properties);
        }
        /**
        * @param text - the text to be displayed
        * @param  options - the options
        * @param parent - the parent component
        * @param modal - display the dialog modal
        * @param  inputDefaultText - if the user should input something
        *
        */
        static async show(text, options, parent = undefined, modal = false, inputDefaultText = undefined) {
            return await OptionDialog_1._show(text, options, parent, modal, inputDefaultText);
        }
        static async _show(text, options, parent, modal, inputDefaultText = undefined, properties = undefined) {
            var ret = new OptionDialog_1();
            var config = {};
            ret.options = options;
            ret.layout();
            if (properties !== undefined) {
                var PropertyEditor = await Classes_22.classes.loadClass("jassijs.ui.PropertyEditor");
                ret.me.propertyEditor = new PropertyEditor(undefined);
                ret.me.propertyEditor.width = "100%";
                ret.me.propertyEditor.height = "100%";
                ret.me.boxpanel1.add(ret.me.propertyEditor);
                ret.me.propertyEditor.value = properties;
                //config.width = "400";
                config.height = "400";
            }
            var promise = new Promise(function (resolve, reject) {
                ret.me.htmlpanel1.value = text;
                if (inputDefaultText === undefined) {
                    ret.me.boxpanel1.remove(ret.me.inputText);
                    ret.me.inputText.destroy();
                }
                else {
                    ret.me.inputText.value = inputDefaultText;
                }
                config.beforeClose = function (event, ui) {
                    resolve({ button: ret.selectedOption, text: ret.me.inputText.value, properties: properties });
                };
                if (modal)
                    config.modal = modal;
                if (parent !== undefined)
                    config.appendTo = "#" + parent._id;
                var dlg = $(ret.dom).dialog(config);
            });
            return await promise;
        }
    };
    exports.OptionDialog = OptionDialog;
    __decorate([
        (0, Property_22.$Property)(),
        __metadata("design:type", String)
    ], OptionDialog.prototype, "text", void 0);
    exports.OptionDialog = OptionDialog = OptionDialog_1 = __decorate([
        (0, Registry_69.$Class)("jassijs.ui.OptionDialog"),
        __metadata("design:paramtypes", [Object])
    ], OptionDialog);
    let Testprop = class Testprop {
    };
    __decorate([
        (0, Property_22.$Property)(),
        __metadata("design:type", Boolean)
    ], Testprop.prototype, "visible", void 0);
    __decorate([
        (0, Property_22.$Property)(),
        __metadata("design:type", String)
    ], Testprop.prototype, "text", void 0);
    Testprop = __decorate([
        (0, Registry_69.$Class)("jassijs.ui.OptionDialogTestProp")
    ], Testprop);
    async function test2() {
        var tet = await OptionDialog.show("Should I ask?", ["yes", "no"], undefined, false);
        if (tet.button === "yes") {
            var age = await OptionDialog.show("Whats yout age?", ["ok", "cancel"], undefined, false, "18");
            if (age.button === "ok")
                console.log(age.text);
            var prop = new Testprop();
            var ret2 = await OptionDialog.askProperties("Please fill:", prop, ["ok", "cancel"]);
        }
        //var ret=new jassijs.ui.Dialog();
        //return ret;
    }
    ;
});
define("jassijs/ui/Panel", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Container", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Registry_70, Container_4, Component_20, Property_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Panel = void 0;
    let Panel = class Panel extends Container_4.Container {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = {}) {
            super(properties);
            this._designMode = false;
            this.isAbsolute = (properties === null || properties === void 0 ? void 0 : properties.isAbsolute) === true;
        }
        render() {
            var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
            return React.createElement(tag, Object.assign(Object.assign({}, this.props.domProperties), { className: "Panel" }));
        }
        set isAbsolute(value) {
            this._isAbsolute = value;
            if (value)
                this.dom.classList.add("jabsolutelayout");
            else
                this.dom.classList.remove("jabsolutelayout");
            if (this._designMode !== undefined)
                this._setDesignMode(this._designMode);
            if (this._designMode && this._activeComponentDesigner) {
                this._activeComponentDesigner.editDialog(true);
            }
        }
        get isAbsolute() {
            return this._isAbsolute;
        }
        max() {
            if (this._id == "body") {
                this.domWrapper.style.width = "100%";
                this.domWrapper.style.height = "calc(100vh - 2px)";
            }
            else {
                this.domWrapper.style.width = "100%";
                this.domWrapper.style.height = "100%";
            }
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._activeComponentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
            }
            super.extensionCalled(action);
        }
        /**
        * adds a component to the container
        * @param {jassijs.ui.Component} component - the component to add
        */
        add(component) {
            // $(component.domWrapper).css({position:(this.isAbsolute ? "absolute" : "relative")});
            return super.add(component);
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            //   $(component.domWrapper).css({position:(this.isAbsolute ? "absolute" : "relative")});
            return super.addBefore(component, before);
        }
        /**
         * activates or deactivates designmode
         * @param {boolean} enable - true if activate designMode
         */
        _setDesignMode(enable) {
        }
        destroy() {
            super.destroy();
            this._activeComponentDesigner = undefined;
        }
    };
    exports.Panel = Panel;
    __decorate([
        (0, Property_23.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Panel.prototype, "isAbsolute", null);
    exports.Panel = Panel = __decorate([
        (0, Component_20.$UIComponent)({ fullPath: "common/Panel", icon: "mdi mdi-checkbox-blank-outline", editableChildComponents: ["this"] }),
        (0, Registry_70.$Class)("jassijs.ui.Panel"),
        (0, Property_23.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.PanelProperties" }),
        (0, Property_23.$Property)({ name: "new/useSpan", type: "boolean", default: false }),
        __metadata("design:paramtypes", [Object])
    ], Panel);
});
define("jassijs/ui/Property", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Registry_71, Registry_72, Classes_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Property = void 0;
    exports.$Property = $Property;
    Registry_72 = __importDefault(Registry_72);
    function $Property(property = undefined) {
        return function (target, propertyKey, descriptor) {
            //debugger;
            var test = Classes_23.classes.getClassName(target);
            if (propertyKey === undefined)
                Registry_72.default.registerMember("$Property", target.prototype, "new", property); //allow registerMember in class definition
            else
                Registry_72.default.registerMember("$Property", target, propertyKey, property);
        };
    }
    let Property = class Property {
        /**
         * Property for PropertyEditor
         * @class jassijs.ui.EditorProperty
         */
        constructor(name = undefined, type = undefined) {
            this.name = name;
            this.type = type;
        }
    };
    exports.Property = Property;
    exports.Property = Property = __decorate([
        (0, Registry_71.$Class)("jassijs.ui.Property"),
        __metadata("design:paramtypes", [Object, Object])
    ], Property);
});
define("jassijs/ui/PropertyEditor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Image", "jassijs/ui/ComponentDescriptor", "jassijs/ui/PropertyEditors/NameEditor", "jassijs/base/PropertyEditorService", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/ext/jquerylib", "jassijs/base/PropertyEditorService"], function (require, exports, Registry_73, Panel_12, Button_6, Image_1, ComponentDescriptor_4, NameEditor_1, PropertyEditorService_1, Property_24, Component_21) {
    "use strict";
    var PropertyEditor_1;
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PropertyEditorTestSubProperties = exports.PropertyEditor = void 0;
    exports.test = test;
    let PropertyEditor = PropertyEditor_1 = class PropertyEditor extends Panel_12.Panel {
        /**
        * edit object properties
        */
        constructor(codeEditor = undefined, parser = undefined) {
            super();
            this.readPropertyValueFromDesign = false;
            this.codeChanges = {};
            this.table = (0, Component_21.createComponent)(this.createTable());
            this.toolbar = new Panel_12.Panel();
            this.parser = parser;
            this.add(this.toolbar);
            this.add(this.table);
            this.table.width = "98%";
            $(this.table.dom).find(".propertyeditorheader").resizable({ handles: "e" });
            this.clear();
            this.layout();
            /**
             * @member {jassijs_editor.CodeEditor} - the parent CodeEditor
             * if undefined - no code changes would be done
             * */
            this.codeEditor = codeEditor;
            /** @member {jassijs.base.Parser} - the code-parser*/
            /** @member {string} - the name of the variable in code*/
            this.variablename = "";
            /** @member {jassijs.ui.PropertyEditor} - parent propertyeditor*/
            this.parentPropertyEditor;
            /** @member {[jassijs.ui.PropertyEditor]} - if multiselect - the propertyeditors of the other elements*/
            this._multiselectEditors;
        }
        createTable() {
            return React.createElement("table", { style: { tableLayout: "fixed", fontSize: "11px" } },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "propertyeditorheader" }, "Name"),
                        React.createElement("th", { className: "propertyeditorheader" }, "Value"))),
                React.createElement("tbody", null,
                    React.createElement("tr", { className: "propertyeditorrow" },
                        React.createElement("td", null, "a1"),
                        React.createElement("td", null, "b1"))));
        }
        componentDidMount() {
        }
        /**
         * adds a new property
         * @param {string} name  - the name of the property
         * @param {jassijs.ui.PropertyEditors.Editor} editor - the propertyeditor to render the property
         * @param {string} description - the the description is tooltip over the name
         */
        addProperty(name, editor, description) {
            var component = editor.getComponent();
            //dont work
            //var row =Component.createHTMLElement('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>');
            var row = Component_21.Component.createHTMLElement('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>');
            //var row=$('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>')[0];
            var deletebutton = new Image_1.Image();
            deletebutton.src = "mdi mdi-delete-forever-outline";
            var _this = this;
            deletebutton.onclick(function () {
                _this.removePropertyInDesign(name);
                _this.removePropertyInCode(name);
                _this.updateParser();
                _this.value = _this.value;
                _this.callEvent("propertyChanged", event);
            });
            row.children[0].prepend(deletebutton.dom);
            this.table.dom.children[1].appendChild(row);
            row["propertyName"] = name;
            row["_components"] = [editor, deletebutton];
            try {
                row.children[1].appendChild(component.dom);
            }
            catch (_a) {
                //Why
                //debugger;
            }
        }
        /**
         * register an event if the property has changed
         * @param {function} handler - the function that is called on change
         */
        oncodeChanged(handler) {
            this.addEvent("codeChanged", handler);
        }
        /**
         * register an event if the property has changed
         * @param {function} handler - the function that is called on change
         */
        onpropertyChanged(handler) {
            this.addEvent("propertyChanged", handler);
        }
        /**
         * delete all properties
         */
        clear() {
            var trs = this.dom.querySelectorAll(".propertyeditorrow");
            for (var x = 0; x < trs.length; x++) {
                var row = trs[x];
                if (row["_components"] !== undefined) {
                    for (var c = 0; c < row["_components"].length; c++) {
                        row["_components"][c]["__destroyed"] = true;
                        row["_components"][c].destroy();
                    }
                }
                row.remove();
            }
        }
        /**
       * if parentPropertyEditor is defined then the value of the property must be substituted
       * @param {jassijs.ui.PropertyEditor propertyEditor
       * @param {[opject} props
       * @param {string} propname the propertyName
       */
        /* _getParentEditorValue(propertyEditor,ob,propname){
             
         }*/
        /**
         * if parentPropertyEditor is defined then the properties are defined there
         * @param {jassijs.ui.PropertyEditor propertyEditor
         * @param {[opject} props
         * @param {string} propname the propertyName
        
        _addParentEditorProperties(propertyEditor, props, propname) {
            if (propertyEditor.parentPropertyEditor !== undefined)
                this._addParentEditorProperties(propertyEditor.parentPropertyEditor, props, propertyEditor.variablename + "/" + propname);
            else {
                var ret;
                if (this.showThisProperties !== undefined) {
                    ret = Tools.copyObject(this.showThisProperties);
                } else
                    ret = ComponentDescriptor.describe(propertyEditor.value.constructor, true).fields;
                for (var x = 0;x < ret.length;x++) {
                    if (ret[x].name.startsWith(propname + "/")) {
                        var test = ret[x].name.substring((propname + "/").length);
                        if (test.indexOf("/") < 0) {
                            ret[x].name = test;
                            props.push(ret[x]);
                        }
                    }
    
                }
            }
        } */
        /**
         * get all known instances for type
         * @param {type} type - the type we are interested
         * @returns {[string]}
         */
        getVariablesForType(type) {
            if (this.codeEditor === undefined)
                return undefined;
            return this.codeEditor.getVariablesForType(type);
        }
        /**
         * get the variablename of an object
         * @param {object} ob - the object to search
         * @returns {string}
         */
        getVariableFromObject(ob) {
            if (this.codeEditor === undefined)
                return undefined;
            return this.codeEditor.getVariableFromObject(ob);
        }
        /**
          * gets the name object of the given variabel
          * @param {string} ob - the name of the variable
         *  @returns {string}
         */
        getObjectFromVariable(ob) {
            if (this.codeEditor === undefined)
                return undefined;
            return this.codeEditor.getObjectFromVariable(ob);
        }
        isVariableAutoGenerated(varname) {
            return this.codeEditor.isVariableAutogenerated(varname);
        }
        /**
         * @member {object}  - the rendered object
         */
        set value(value) {
            if (value !== this._value && this.parentPropertyEditor === undefined)
                this.codeChanges = {};
            if (value !== undefined || (value === null || value === void 0 ? void 0 : value.dom) !== undefined) {
                //if (!$(value.dom).is(":focus"))
                if (value.dom && document.activeElement !== value.dom && value.dom.focus)
                    value.dom.focus();
            }
            if (value !== undefined && this.value !== undefined && this.value.constructor === value.constructor) {
                this._value = value;
                if (this.codeEditor)
                    this.variablename = this.codeEditor.getVariableFromObject(this._value);
                this.update();
                this.addActions();
                return;
            }
            this._multiselectEditors = [];
            if (value !== undefined && value.length > 1) {
                for (var x = 1; x < value.length; x++) {
                    var multi = new PropertyEditor_1(this.codeEditor, this.parser);
                    multi.codeEditor = this.codeEditor;
                    multi.parentPropertyEditor = this.parentPropertyEditor;
                    multi.value = value[x];
                    multi.parser = this.parser;
                    if (multi.codeEditor !== undefined)
                        this.variablename = this.codeEditor.getVariableFromObject(value[x]);
                    this._multiselectEditors.push(multi);
                }
                this._value = value;
            }
            else
                this._value = value;
            if (Array.isArray(value) && value.length === 0) {
                this._value = undefined;
                this.addActions();
                return;
            }
            if (this.codeEditor !== undefined && this.parentPropertyEditor === undefined) {
                if (Array.isArray(this._value) && this._value.length > 0)
                    this.variablename = this.codeEditor.getVariableFromObject(this._value[0]);
                else
                    this.variablename = this.codeEditor.getVariableFromObject(this._value);
            }
            this.addActions();
            var _this = this;
            if (this._initValue())
                _this.update();
        }
        addActions() {
            var _a, _b, _c;
            var _this = this;
            var all = [];
            (_a = this.actions) === null || _a === void 0 ? void 0 : _a.forEach((e) => all.push(e));
            if ((_b = this._value) === null || _b === void 0 ? void 0 : _b.extensionCalled) {
                (_c = this._value) === null || _c === void 0 ? void 0 : _c.extensionCalled({
                    getPropertyEditorActions: {
                        propertyEditor: this,
                        actions: all
                    }
                });
            }
            this.toolbar.removeAll();
            for (var x = 0; x < all.length; x++) {
                var bt = this.createAction(all[x]);
                this.toolbar.add(bt);
            }
        }
        createAction(action) {
            var bt = new Button_6.Button();
            bt.icon = action.icon;
            bt.onclick(() => action.call(this._value, this));
            bt.tooltip = action.description;
            return bt;
        }
        swapComponents(first, second) {
            //swap Design
            if (first._parent !== second._parent)
                throw "swaped components must have the same parent";
            var parent = first._parent;
            var ifirst = parent._components.indexOf(first);
            var isecond = parent._components.indexOf(second);
            var dummy = Component_21.Component.createHTMLElement("<div/>");
            parent._components[ifirst] = second;
            parent._components[isecond] = first;
            first.domWrapper.replaceWith(dummy);
            second.domWrapper.replaceWith(first.domWrapper);
            dummy.replaceWith(second.domWrapper);
            //swap Code
            var firstname = this.getVariableFromObject(first);
            var secondname = this.getVariableFromObject(second);
            var parentname = this.getVariableFromObject(parent);
            this.parser.swapPropertyWithParameter(parentname, "add", firstname, secondname);
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
        }
        controlEditor(editor) {
            let _this = this;
            editor.onedit(function (event) {
                _this.callEvent("propertyChanged", event);
                let deletebutton = editor.component.dom.parentNode.parentNode.children[0].children[0];
                if (deletebutton)
                    deletebutton.style.visibility = 'visible';
            });
        }
        _initValue() {
            var _a, _b;
            var props = [];
            /* if (this.parentPropertyEditor !== undefined)
                 this._addParentEditorProperties(this.parentPropertyEditor, props, this.variablename);
             else*/ {
                if (this.showThisProperties !== undefined)
                    props = this.showThisProperties;
                else {
                    if (!this._value)
                        props = [];
                    else {
                        if (Array.isArray(this._value) && this._value.length > 0)
                            props = (_a = ComponentDescriptor_4.ComponentDescriptor.describe(this._value[0].constructor)) === null || _a === void 0 ? void 0 : _a.fields;
                        else
                            props = (_b = ComponentDescriptor_4.ComponentDescriptor.describe(this._value.constructor)) === null || _b === void 0 ? void 0 : _b.fields;
                    }
                    if (!props)
                        props = [];
                }
            }
            //TODO cache this
            var _this = this;
            _this.properties = {};
            /*for (var x = 0; x < props.length; x++) {
                _this.properties[props[x].name] = { name: props[x].name, component: undefined, description: props[x].description };
            }*/
            var allProperties = [];
            if (_this._multiselectEditors.length === 0) {
                var hasvarname = _this.getVariableFromObject(_this._value);
                if (hasvarname !== undefined) {
                    var nameEditor = new NameEditor_1.NameEditor("name", _this);
                    //_this.addProperty("name", nameEditor, "the name of the component");
                    //allProperties.push({name:"name",editor:nameEditor,description:"the name of the component"});
                    _this.properties["name"] = {
                        name: "name", editor: nameEditor,
                        description: "the name of the component", "component": nameEditor.getComponent()
                    };
                    //nameEditor.ob = _this._value;
                }
            }
            var editorNotLoaded = [];
            for (var x = 0; x < props.length; x++) {
                if (props[x].name.indexOf("/") > -1) {
                }
                else {
                    _this.properties[props[x].name] = { isVisible: props[x].isVisible, name: props[x].name, component: undefined, description: props[x].description };
                    var editor = PropertyEditorService_1.propertyeditor.createFor(props[x], _this);
                    if (editor["then"]) { //editor is not loaded yet
                        editorNotLoaded.push(editor);
                    }
                    else {
                        //  if (classes.getClassName(editor) === "jassijs.ui.PropertyEditors.LoadingEditor") {
                        //    this.hasLoadingEditor = true;
                        // }
                        if (editor === undefined) {
                            console.log("Editor not found for " + _this.variablename);
                            continue;
                        }
                        var sname = editor.property.name;
                        this.controlEditor(editor);
                        if (_this.properties[editor.property.name] === undefined) {
                            console.log("Property not found " + editor.property);
                            continue;
                        }
                        _this.properties[editor.property.name].editor = editor;
                        if (editor !== undefined && _this.properties[editor.property.name] !== undefined) {
                            _this.properties[editor.property.name].component = editor.getComponent();
                        }
                    }
                }
            }
            if (editorNotLoaded.length > 0) {
                Promise.all(editorNotLoaded).then(() => {
                    _this._initValue();
                    _this.value = this.value; //load again
                });
                return false;
            }
            for (var key in _this.properties) {
                var prop = _this.properties[key];
                var doAdd = true;
                for (var m = 0; m < _this._multiselectEditors.length; m++) {
                    var test = _this._multiselectEditors[m].properties[prop.name];
                    if (test === undefined)
                        doAdd = false;
                }
                if (doAdd) {
                    if (prop.component !== undefined)
                        //_this.addProperty(prop.name, prop.editor, prop.description);
                        allProperties.push({ name: prop.name, editor: prop.editor, description: prop.description, isVisible: prop.isVisible });
                }
            }
            _this.clear();
            for (let p = 0; p < allProperties.length; p++) {
                let prop = allProperties[p];
                _this.addProperty(prop.name, prop.editor, prop.description);
            }
            return true;
            // });
        }
        /**
         * updates values
         */
        update() {
            for (var key in this.properties) {
                var prop = this.properties[key];
                if (prop.editor === undefined) {
                    console.warn("PropertyEditor for " + key + " not found");
                    continue;
                }
                //sometimes the component is already deleted e.g.resize
                if (prop.editor["__destroyed"] !== true) {
                    if (prop.isVisible) {
                        var isVisible = prop.isVisible(this.value, this);
                        var label = undefined;
                        for (let r = 0; r < this.table.dom.children[1].children.length; r++) {
                            var row = this.table.dom.children[1].children[r];
                            if (row["propertyName"] === prop.name)
                                label = row;
                        }
                        if (isVisible) {
                            prop.editor.component.dom.parentNode.style.display = '';
                            label.style.display = '';
                        }
                        else {
                            prop.editor.component.dom.parentNode.style.display = 'none';
                            label.style.display = 'none';
                        }
                    }
                    let deletebutton = prop.editor.component.dom.parentNode.parentNode.children[0].children[0];
                    if (deletebutton) {
                        var ll = this.getPropertyValue(prop, false);
                        if (ll === undefined) {
                            deletebutton.style.visibility = 'hidden';
                        }
                        else {
                            deletebutton.style.visibility = 'visible';
                        }
                    }
                    prop.editor.ob = this.value;
                }
            }
        }
        get value() {
            return this._value;
        }
        /**
         * gets the value of the property
         * @param {string} property
         * @param {boolean} [noDefaultValue] - returns no default value of the property
         * @returns {object}
         */
        getPropertyValue(property, noDefaultValue = undefined) {
            var _a, _b;
            if (this.readPropertyValueFromDesign) {
                let ret = this._value[property.name];
                if (ret === undefined && !noDefaultValue)
                    ret = property.default;
                return ret;
            }
            var ret = undefined;
            if (this.codeEditor === undefined) { //read property
                var r = this.codeChanges[property.name];
                if (r === undefined) {
                    if (this.parentPropertyEditor === undefined && this._value[property.name])
                        return this._value[property.name];
                    if (noDefaultValue !== true)
                        return property.default;
                    return r;
                }
                return r;
            }
            if (property.name === "new" && ((_a = this.variablename) === null || _a === void 0 ? void 0 : _a.startsWith("me."))) {
                if (this.parser.data["me"] === undefined)
                    return undefined;
                var prop = this.parser.data["me"][this.variablename.substring(3)];
                if (prop === undefined)
                    return undefined;
                var constr = prop[0].value;
                if (constr.startsWith("typedeclaration:") && prop.length > 1)
                    constr = prop[1].value;
                ret = constr.substring(constr.indexOf("(") + 1, constr.lastIndexOf(")"));
                if (ret === "")
                    ret = undefined;
            }
            else {
                ret = (_b = this.parser) === null || _b === void 0 ? void 0 : _b.getPropertyValue(this.variablename, property.name);
                if (this.codeEditor === undefined && ret === undefined && this._value !== undefined) {
                    ret = this._value[property.name];
                    if (typeof (ret) === "function") {
                        ret = undefined;
                    }
                }
                if (ret === undefined && noDefaultValue !== true)
                    ret = property.default;
            }
            if (this._multiselectEditors !== undefined) {
                for (var m = 0; m < this._multiselectEditors.length; m++) {
                    this._multiselectEditors[m].updateParser();
                    var test = this._multiselectEditors[m].getPropertyValue(property, noDefaultValue);
                    if (test !== ret) {
                        return undefined;
                    }
                }
            }
            return ret;
        }
        updateCodeEditor() {
            this.codeEditor.evalCode();
        }
        /**
         * update the parser
         */
        updateParser() {
            if (this.codeEditor === undefined)
                return;
            if (this.codeEditor.file.endsWith(".tsx"))
                return;
            if (this.parentPropertyEditor !== undefined) {
                this.parentPropertyEditor.updateParser();
            }
            else {
                var text = this.codeEditor.value;
                var val = this.codeEditor.getObjectFromVariable("this");
                if (text && this.parser)
                    this.parser.updateCode(text);
                // this.parser.parse(text, [{ classname: val?.constructor?.name, methodname: "layout" }, { classname: undefined, methodname: "test" }]);
            }
        }
        /**
         * adds an required file to the code
         */
        addImportIfNeeded(name, file) {
            if (this.codeEditor === undefined)
                return;
            this.parser.addImportIfNeeded(name, file);
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
        }
        /**
         * gets the next variablename
         * */
        getNextVariableNameForType(type) {
            return this.parser.getNextVariableNameForType(type);
        }
        /**
         * adds an Property
         * @param type - name of the type o create
         * @param scopename - the scope {variable: ,methodname:} to add the variable - if missing layout()
         * @returns  the name of the object
         */
        addVariableInCode(type, scopename, suggestedName = undefined) {
            var val = this.codeEditor.getObjectFromVariable("this");
            var codeHasChanged = {};
            var ret = this.parser.addVariableInCode(type, undefined, scopename, suggestedName, codeHasChanged);
            /* var ret = this.parser.addVariableInCode(type, [{ classname: val?.constructor?.name, methodname: "layout" },
             { classname: undefined, methodname: "test" }], scopename);
             */
            if ((codeHasChanged === null || codeHasChanged === void 0 ? void 0 : codeHasChanged.value) === false) {
            }
            else {
                this.codeEditor.value = this.parser.getModifiedCode();
                this.updateParser();
                this.callEvent("codeChanged", {});
            }
            return ret;
        }
        /**
         * modify the property in code
         * @param {string} property - the property
         * @param {string} value - the new value
         * @param {boolean} [replace]  - if true the old value is deleted
         * @param {string} [variablename] - the name of the variable - default=this.variablename
         * @param {object} [before] - {variablename,property,value=undefined}
         * @param {object} scope - the scope {variable: ,methodname:} the scope - if missing layout()
        */
        setPropertyInCode(property, value, replace = undefined, variableName = undefined, before = undefined, scopename = undefined, doUpdate = true) {
            if (this.codeEditor === undefined) {
                this.codeChanges[property] = value;
                this.callEvent("codeChanged", {});
                return;
            }
            if (this.codeEditor === undefined || this.parentPropertyEditor !== undefined) {
                this.callEvent("codeChanged", {});
                return;
            }
            if (variableName === undefined && this._multiselectEditors !== undefined) {
                for (var m = 0; m < this._multiselectEditors.length; m++) {
                    this._multiselectEditors[m].updateParser();
                    this._multiselectEditors[m].setPropertyInCode(property, value, replace, variableName, before);
                }
                if (this._multiselectEditors.length > 0)
                    this.updateParser();
            }
            var prop;
            var isFunction = false;
            if (property !== "") {
                if (variableName === undefined) {
                    variableName = this.variablename;
                    prop = this._value[property];
                }
                else {
                    prop = this.codeEditor.getObjectFromVariable(variableName)[property];
                }
                isFunction = (typeof (prop) === "function");
            }
            this.parser.setPropertyInCode(variableName, property, value, 
            /*[{ classname: val?.constructor?.name, methodname: "layout" }, { classname: undefined, methodname: "test" }]*/ undefined, isFunction, replace, before, scopename);
            if (doUpdate) {
                //correct spaces
                if (value && value.indexOf && value.indexOf("\n") > -1) {
                    // this.codeEditor.value = this.parser.getModifiedCode();
                    // this.updateParser();
                }
                this.codeEditor.value = this.parser.getModifiedCode();
                this.updateParser();
                this.callEvent("codeChanged", {});
            }
        }
        /**
        * modify the property in design
        * @param {string} property - the property
        * @param {string} value - the new value
        */
        setPropertyInDesign(property, value) {
            var _a, _b;
            if (this._multiselectEditors) {
                for (var m = 0; m < this._multiselectEditors.length; m++) {
                    this._multiselectEditors[m].setPropertyInDesign(property, value);
                }
            }
            if (property === "new" && this.variablename.startsWith("me.")) {
                this.codeEditor.evalCode();
                //  var test=this.codeEditor.getObjectFromVariable(this.variablename);
                //  this.value=this.codeEditor.getObjectFromVariable(this.variablename);
                return;
            }
            if (typeof (this._value[property]) === "function")
                this._value[property](value);
            else {
                // if(property==="value"){
                //   console.log("rerender");
                //this._value.lastconfig[property]=value;
                //this._value.rerender();
                if (this._value.config) {
                    var prop = {};
                    prop[property] = value;
                    this._value.config(prop);
                }
                else
                    this._value[property] = value;
            }
            var updateDummies = (_a = this.codeEditor) === null || _a === void 0 ? void 0 : _a.getDesigner().updateDummies;
            if (updateDummies) {
                (_b = this.codeEditor) === null || _b === void 0 ? void 0 : _b.getDesigner().updateDummies();
            }
        }
        /**
         * goto source position
         * @param position - in Code
         */
        gotoCodePosition(position) {
            if (this.parentPropertyEditor !== undefined)
                return this.parentPropertyEditor.gotoCodePosition(position);
            this.codeEditor.viewmode = "code";
            this.codeEditor.setCursorPorition(position);
        }
        /**
         * goto source line
         * @param {number} line - line in Code
         */
        gotoCodeLine(line) {
            if (this.parentPropertyEditor !== undefined)
                return this.parentPropertyEditor.gotoCodeLine(line);
            this.codeEditor.viewmode = "code";
            this.codeEditor.cursorPosition = { row: line, column: 200 };
        }
        /**
         * renames a variable in code
         */
        renameVariableInCode(oldName, newName) {
            var code = this.codeEditor.value;
            if (this.codeEditor === undefined)
                return;
            var found = true;
            if (oldName.startsWith("me."))
                oldName = oldName.substring(3);
            if (newName.startsWith("me."))
                newName = newName.substring(3);
            if (oldName.startsWith("this."))
                oldName = oldName.substring(5);
            if (newName.startsWith("this."))
                newName = newName.substring(5);
            var reg = new RegExp("\\W" + oldName + "\\W");
            while (found == true) {
                found = false;
                code = code.replace(reg, function replacer(match, offset, string) {
                    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
                    found = true;
                    return match.substring(0, 1) + newName + match.substring(match.length - 1, match.length);
                });
            }
            var newvarname = this.parser.renameVariable(oldName, newName);
            this.codeEditor.value = this.parser.getModifiedCode();
            //this.codeEditor.value = code;
            this.updateParser();
            this.callEvent("codeChanged", {});
            return newvarname;
        }
        /**
         * renames a variable in design
         */
        renameVariableInDesign(oldName, newName, autogenerated = false) {
            this.codeEditor.renameVariable(oldName, newName, autogenerated);
        }
        /**
        * removes the variable from design
        * @param  varname - the variable to remove
        */
        removeVariableInDesign(varname) {
            //TODO this und var?
            if (varname.startsWith("me.") && this.codeEditor.getObjectFromVariable("me")) {
                var vname = varname.substring(3);
                var me = this.codeEditor.getObjectFromVariable("me");
                delete me[vname];
            }
            this.codeEditor.removeVariableInDesign(varname);
        }
        /**
         * removes the variable from code
         * @param {string} varname - the variable to remove
         */
        removeVariablesInCode(varname) {
            if (this.codeEditor === undefined) {
                this.callEvent("codeChanged", {});
                return;
            }
            this.parser.removeVariablesInCode(varname);
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
            this.callEvent("codeChanged", {});
        }
        /**
        * removes the property from code
        * @param {type} property - the property to remove
        * @param {type} [onlyValue] - remove the property only if the value is found
        * @param {string} [variablename] - the name of the variable - default=this.variablename
        */
        removePropertyInCode(property, onlyValue = undefined, variablename = undefined, doupdate = true) {
            if (this.codeEditor === undefined) {
                delete this.codeChanges[property];
                this.callEvent("codeChanged", {});
                return;
            }
            if (this.codeEditor === undefined) {
                delete this._value[property];
                this.callEvent("codeChanged", {});
                return;
            }
            for (var m = 0; m < this._multiselectEditors.length; m++) {
                this._multiselectEditors[m].updateParser();
                this._multiselectEditors[m].removePropertyInCode(property, onlyValue, variablename);
            }
            if (variablename === undefined)
                variablename = this.variablename;
            if (doupdate) {
                this.updateParser(); //notwendig?
            }
            var ret = this.parser.removePropertyInCode(property, onlyValue, variablename);
            if (doupdate) {
                var text = this.parser.getModifiedCode();
                this.codeEditor.value = text;
                this.updateParser();
                this.callEvent("codeChanged", {});
            }
            return ret;
        }
        /**
        * removes the property in design
        */
        removePropertyInDesign(property) {
            for (var m = 0; m < this._multiselectEditors.length; m++) {
                this._multiselectEditors[m].removePropertyInDesign(property);
            }
            if (typeof (this._value[property]) === "function")
                this._value[property](undefined);
            else {
                try {
                    this._value[property] = undefined;
                }
                catch (_a) {
                }
                delete this._value[property];
            }
        }
        layout(me = undefined) {
        }
        destroy() {
            this._value = undefined;
            this.clear();
            super.destroy();
        }
    };
    exports.PropertyEditor = PropertyEditor;
    exports.PropertyEditor = PropertyEditor = PropertyEditor_1 = __decorate([
        (0, Registry_73.$Class)("jassijs.ui.PropertyEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], PropertyEditor);
    let PropertyEditorTestSubProperties = class PropertyEditorTestSubProperties {
        constructor() {
            this.num = 19;
            this.text = "prop";
        }
    };
    exports.PropertyEditorTestSubProperties = PropertyEditorTestSubProperties;
    __decorate([
        (0, Property_24.$Property)(),
        __metadata("design:type", Number)
    ], PropertyEditorTestSubProperties.prototype, "num", void 0);
    __decorate([
        (0, Property_24.$Property)(),
        __metadata("design:type", String)
    ], PropertyEditorTestSubProperties.prototype, "text", void 0);
    exports.PropertyEditorTestSubProperties = PropertyEditorTestSubProperties = __decorate([
        (0, Registry_73.$Class)("jassijs.ui.PropertyEditorTestSubProperties")
    ], PropertyEditorTestSubProperties);
    let TestProperties = class TestProperties {
        constructor() {
            this.html = "sample";
        }
        func(any) {
        }
        ;
    };
    __decorate([
        (0, Property_24.$Property)({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "dialogname", void 0);
    __decorate([
        (0, Property_24.$Property)(),
        __metadata("design:type", Boolean)
    ], TestProperties.prototype, "checked", void 0);
    __decorate([
        (0, Property_24.$Property)({ type: "color" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "color", void 0);
    __decorate([
        (0, Property_24.$Property)({ type: "componentselector", componentType: "jassi.ui.Component" }),
        __metadata("design:type", typeof (_a = typeof Component_21.Component !== "undefined" && Component_21.Component) === "function" ? _a : Object)
    ], TestProperties.prototype, "component", void 0);
    __decorate([
        (0, Property_24.$Property)({ type: "databinder" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "databinder", void 0);
    __decorate([
        (0, Property_24.$Property)({ type: "dbobject", componentType: "de.Kunde" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "dbobject", void 0);
    __decorate([
        (0, Property_24.$Property)({ default: 80 }),
        __metadata("design:type", Number)
    ], TestProperties.prototype, "num", void 0);
    __decorate([
        (0, Property_24.$Property)({ type: "font" }),
        __metadata("design:type", Number)
    ], TestProperties.prototype, "font", void 0);
    __decorate([
        (0, Property_24.$Property)({ type: "function" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TestProperties.prototype, "func", null);
    __decorate([
        (0, Property_24.$Property)({ type: "html" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "html", void 0);
    __decorate([
        (0, Property_24.$Property)({ type: "image" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "image", void 0);
    __decorate([
        (0, Property_24.$Property)({ type: "json", componentType: "jassijs.ui.PropertyEditorTestSubProperties" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "json", void 0);
    TestProperties = __decorate([
        (0, Registry_73.$Class)("jassijs.ui.PropertyEditorTestProperties")
    ], TestProperties);
    function test() {
        var ret = new PropertyEditor();
        ret.value = new TestProperties();
        return ret;
    }
});
define("jassijs/ui/PropertyEditors/BooleanEditor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Checkbox", "jassijs/ui/PropertyEditors/Editor"], function (require, exports, Registry_74, Checkbox_2, Editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BooleanEditor = void 0;
    let BooleanEditor = class BooleanEditor extends Editor_1.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Checkbox_2.Checkbox();
            var _this = this;
            this.component.onclick(function (param) {
                _this._onclick(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onclick(param) {
            var val = this.component.value;
            this.propertyEditor.setPropertyInCode(this.property.name, val.toString());
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
            super.callEvent("edit", param);
        }
    };
    exports.BooleanEditor = BooleanEditor;
    exports.BooleanEditor = BooleanEditor = __decorate([
        (0, Editor_1.$PropertyEditor)(["boolean"]),
        (0, Registry_74.$Class)("jassijs.ui.PropertyEditors.BooleanEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], BooleanEditor);
});
define("jassijs/ui/PropertyEditors/ClassSelectorEditor", ["require", "exports", "jassijs/ui/Select", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/PropertyEditors/JsonEditor", "jassijs/util/Tools", "jassijs/ui/converters/StringConverter", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Classes"], function (require, exports, Select_2, Editor_2, JsonEditor_1, Tools_1, StringConverter_1, Registry_75, Panel_13, Textbox_8, Registry_76, ComponentDescriptor_5, Classes_24) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClassSelectorEditor = void 0;
    Registry_76 = __importDefault(Registry_76);
    let ClassSelectorEditor = class ClassSelectorEditor extends Editor_2.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property = undefined, propertyEditor = undefined) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_13.Panel();
            this.component.width = "100%";
            this.select = new Select_2.Select();
            this.select.width = "calc(100% - 26px)";
            this.property = Tools_1.Tools.copyObject(property);
            //  this.property.componentType="jassijs.ui.converters.StringConverterProperies";
            this.jsonEditor = new JsonEditor_1.JsonEditor(this.property, propertyEditor);
            this.jsonEditor.parentPropertyEditor = propertyEditor.parentPropertyEditor;
            //this.jsonEditor.component.text = "";
            // this.jsonEditor.component.icon = "mdi mdi-glasses";
            // this.jsonEditor.component.width = 26;
            this.component.add(this.select);
            this.component.add(this.jsonEditor.getComponent());
            var _this = this;
            this.select.onchange(function (sel) {
                var converter = sel.data;
                _this.changeConverter(converter);
            });
            this.initSelect();
            // this.component.onclick(function(param){
            //     _this._onclick(param);
            // });
        }
        changeConverter(converter) {
            var _this = this;
            var testval = _this.propertyEditor.getPropertyValue(_this.property);
            var shortClassname = converter.classname.split(".")[converter.classname.split(".").length - 1];
            if (testval === undefined || !testval.startsWith("new " + shortClassname)) {
                _this.propertyEditor.setPropertyInCode(_this.property.name, "new " + shortClassname + "()");
                var file = converter.classname.replaceAll(".", "/");
                var stype = file.split("/")[file.split("/").length - 1];
                _this.propertyEditor.addImportIfNeeded(stype, file);
                Classes_24.classes.loadClass(converter.classname).then((pclass) => {
                    _this.propertyEditor.setPropertyInDesign(_this.property.name, new pclass());
                });
            }
            Classes_24.classes.loadClass(converter.classname).then((cl) => {
                var _a;
                var meta = (_a = ComponentDescriptor_5.ComponentDescriptor.describe(cl)) === null || _a === void 0 ? void 0 : _a.fields;
                for (var x = 0; x < meta.length; x++) {
                    if (meta[x].name === "new") {
                        _this.jsonEditor.property.componentType = meta[x].componentType;
                    }
                }
            });
            _this.property.constructorClass = converter.classname;
            //        _this.jsonEditor.showThisProperties = ComponentDescriptor.describe(classes.getClass(converter.classname)).fields;
            /*        for (var x = 0; x < _this.jsonEditor.showThisProperties.length; x++) {
                        var test = _this.jsonEditor.showThisProperties[x].name;
                        if (test.startsWith("new")) {
                            _this.jsonEditor.showThisProperties[x].name = _this.property.name + test.substring(3);
                        }
                    }*/
            //  _this.jsonEditor.ob = {};
            //   _this.jsonEditor.component.text = "";
        }
        initSelect() {
            var _this = this;
            Registry_76.default.loadAllFilesForService(this.property.service).then(function () {
                var converters = Registry_76.default.getData(_this.property.service);
                var data = [];
                /*data.push({
                       classname:undefined,
                       data:""
                   });*/
                for (var x = 0; x < converters.length; x++) {
                    var con = converters[x];
                    var cname = Classes_24.classes.getClassName(con.oclass);
                    var name = cname;
                    if (con.params[0] && con.params[0].name !== undefined)
                        name = con.params[0].name;
                    data.push({
                        classname: cname,
                        data: name
                    });
                }
                if (!_this.destroyed) {
                    _this.select.items = data;
                    _this.select.display = "data";
                    if (_this.ob)
                        _this.ob = _this.ob;
                }
            });
            //	this.select
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            this._ob = ob;
            if (this.propertyEditor === undefined)
                return;
            if (this.select.items === undefined)
                return; //list is not inited
            if (ob === undefined)
                return;
            var value = this.propertyEditor.getPropertyValue(this.property);
            this.jsonEditor.ob = ob;
            if (value !== undefined) {
                for (var x = 0; x < this.select.items.length; x++) {
                    var sel = this.select.items[x];
                    var shortClassname = sel.classname;
                    if (shortClassname !== undefined) {
                        shortClassname = shortClassname.split(".")[shortClassname.split(".").length - 1];
                        if (value.indexOf(shortClassname) > -1) {
                            this.select.value = sel;
                            this.changeConverter(sel);
                            break;
                        }
                    }
                }
            }
            else {
                this.select.value = "";
            }
            super.ob = ob;
            // this.component.value=value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onclick(param) {
            var val = this.component.value;
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
            super.callEvent("edit", param);
        }
        layout() {
            var me = this.me = {};
            me.pan = new Panel_13.Panel();
            me.tb = new Textbox_8.Textbox();
            me.pan.height = 15;
            me.pan.add(me.tb);
            me.tb.height = 15;
            me.tb.converter = new StringConverter_1.StringConverter();
        }
        destroy() {
            this.destroyed = true;
            this.select.destroy();
            super.destroy();
        }
    };
    exports.ClassSelectorEditor = ClassSelectorEditor;
    exports.ClassSelectorEditor = ClassSelectorEditor = __decorate([
        (0, Editor_2.$PropertyEditor)(["classselector"]),
        (0, Registry_75.$Class)("jassijs.ui.PropertyEditors.ClassSelectorEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ClassSelectorEditor);
    jassijs.test = function () {
        ComponentDescriptor_5.ComponentDescriptor.cache = {};
        var t = new ClassSelectorEditor();
        t.layout();
        return t.me.pan;
    };
});
define("jassijs/ui/PropertyEditors/ColorEditor", ["require", "exports", "jassijs/ui/PropertyEditor", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Select", "jassijs/ui/BoxPanel", "jassijs/ext/jquerylib", "jassijs/ext/spectrum"], function (require, exports, PropertyEditor_2, Editor_3, Textbox_9, Registry_77, Select_3, BoxPanel_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ColorEditor = void 0;
    exports.test3 = test3;
    exports.test2 = test2;
    var colors = ["black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "orange", "aliceblue", "antiquewhite", "aquamarine", "azure", "beige", "bisque", "blanchedalmond", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "gold", "goldenrod", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "limegreen", "linen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace", "olivedrab", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "wheat", "whitesmoke", "yellowgreen", "rebeccapurple"];
    let ColorEditor = class ColorEditor extends Editor_3.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            var _this = this;
            /** @member - the renedering component **/
            this.component = new BoxPanel_4.BoxPanel();
            this.component.horizontal = true;
            this.icon = new Textbox_9.Textbox();
            this.icon.width = "10px";
            this.select = new Select_3.Select();
            this.select.width = "85px";
            this.component.add(this.select);
            this.component.add(this.icon);
            this.select.items = colors;
            this.select.display = function (color) {
                return "<span><div style='float:left;width:10px;height:10px;background:" + color + "'></div>" + color + "</span>";
            };
            var spec = $(this.icon.dom)["spectrum"]({
                color: "#f00",
                change: function (color) {
                    var scolor = color.toHexString();
                    var old = _this.select.items;
                    if (old.indexOf(scolor) === -1)
                        old.push(scolor);
                    _this.select.items = old;
                    _this.select.value = scolor;
                    _this._onchange({});
                    //		    _this.paletteChanged(color.toHexString()); // #ff0000
                }
            });
            //correct height
            var bt = this.icon.domWrapper.querySelector(".sp-preview");
            bt.style.width = "8px";
            bt.style.height = "8px";
            var bx = this.icon.domWrapper.querySelector(".sp-replacer");
            bx.style.height = "10px";
            bx.style.width = "10px";
            var bp = this.icon.domWrapper.querySelector(".sp-dd");
            bp.style.height = "6px";
            //spec.width="10px";
            //   this.component.dom=font[0];
            this.select.onchange(function (param) {
                _this._onchange(param);
            });
        }
        onedit(param) {
            super.onedit(param);
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value === null || value === undefined || value === "")
                value = "";
            else
                value = value.substring(1, value.length - 1);
            $(this.icon.dom)["spectrum"]("set", value);
            var old = this.select.items;
            if (old.indexOf(value) === -1)
                old.push(value);
            this.select.items = old;
            this.select.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        paletteChanged(color) {
            //var val =  "\"" + color + "\"";
            //this.propertyEditor.setPropertyInCode(this.property.name, val);
            //this.propertyEditor.setPropertyInDesign(this.property.name, color);
            this.select.value = color;
            //super.callEvent("edit", color);
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var val = this.select.value;
            val = "\"" + val + "\"";
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var oval = this.select.value;
            $(this.icon.dom)["spectrum"]("set", oval);
            this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            super.callEvent("edit", param);
        }
    };
    exports.ColorEditor = ColorEditor;
    exports.ColorEditor = ColorEditor = __decorate([
        (0, Editor_3.$PropertyEditor)(["color"]),
        (0, Registry_77.$Class)("jassijs.ui.PropertyEditors.ColorEditor")
        /**
        * Editor for color
        * used by PropertyEditor
        **/
        ,
        __metadata("design:paramtypes", [Object, Object])
    ], ColorEditor);
    function test3() {
        var prop = new PropertyEditor_2.PropertyEditor();
        prop.value = new Textbox_9.Textbox();
        return prop;
    }
    function test2() {
        var panel = new BoxPanel_4.BoxPanel();
        panel.horizontal = false;
        var icon = new Textbox_9.Textbox();
        var textbox = new Textbox_9.Textbox();
        panel.add(textbox);
        panel.add(icon);
        var spec = $(icon.dom)["spectrum"]({
            color: "#f00"
        });
        spec.width = "10px";
        spec.height = "10px";
        return panel;
    }
});
define("jassijs/ui/PropertyEditors/ComponentEditor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox"], function (require, exports, Registry_78, Editor_4, Textbox_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BooleanEditor = void 0;
    let BooleanEditor = class BooleanEditor extends Editor_4.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Textbox_10.Textbox();
            var _this = this;
            this.component.onclick(function (param) {
                _this._onclick(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            /*   this.component.value = value;*/
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onclick(param) {
            /* var val = this.component.value;
             this.propertyEditor.setPropertyInCode(this.property.name, val.toString());
             this.propertyEditor.setPropertyInDesign(this.property.name, val);
             super.callEvent("edit", param);*/
        }
    };
    exports.BooleanEditor = BooleanEditor;
    exports.BooleanEditor = BooleanEditor = __decorate([
        (0, Editor_4.$PropertyEditor)(["jassijs.ui.Component"]),
        (0, Registry_78.$Class)("jassijs.ui.PropertyEditors.ComponentEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], BooleanEditor);
});
define("jassijs/ui/PropertyEditors/ComponentSelectorEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Select", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Editor_5, Select_4, Classes_25, Registry_79) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentSelectorEditor = void 0;
    exports.test = test;
    /**
     * select one or more instances of an class
     * used by PropertyEditor
     **/
    let ComponentSelectorEditor = class ComponentSelectorEditor extends Editor_5.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Select_4.Select({
                multiple: (property.componentType.indexOf("[") === 0)
            });
            this.component.width = "100%";
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var scomponentType = this.property.componentType.replace("[", "").replace("]", "");
            var data = this.propertyEditor.getVariablesForType(Classes_25.classes.getClass(scomponentType));
            this.component.items = data === undefined ? [] : data;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (this.property.componentType.indexOf("[") === 0 && value) {
                value = value.substring(1, value.length - 1).split(",");
            }
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var val = this.component.value;
            if (this.property.componentType.indexOf("[") === 0) {
                let oval = [];
                let code = "";
                for (var x = 0; x < val.length; x++) {
                    code = code + (code === "" ? "" : ",") + val[x];
                    let o = this.propertyEditor.getObjectFromVariable(val[x]);
                    oval.push(o);
                }
                this.propertyEditor.setPropertyInCode(this.property.name, "[" + code + "]");
                this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            }
            else {
                let oval = this.propertyEditor.getObjectFromVariable(val);
                this.propertyEditor.setPropertyInCode(this.property.name, val);
                this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            }
            super.callEvent("edit", param);
        }
    };
    exports.ComponentSelectorEditor = ComponentSelectorEditor;
    exports.ComponentSelectorEditor = ComponentSelectorEditor = __decorate([
        (0, Editor_5.$PropertyEditor)(["componentselector"]),
        (0, Registry_79.$Class)("jassijs.ui.PropertyEditors.ComponentSelectorEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ComponentSelectorEditor);
    function test() {
    }
});
define("jassijs/ui/PropertyEditors/DatabinderEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Textbox", "jassijs/ui/Component"], function (require, exports, Editor_6, Registry_80, Textbox_11, Component_22) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DatabinderEditor = void 0;
    let DatabinderEditor = class DatabinderEditor extends Editor_6.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            this.foundBounds = {};
            this.foundFunctionComponents = {};
            /** @member - the renedering component **/
            this.component = new Textbox_11.Textbox(); //Select();
            this.component.width = "100%";
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        collectStates(comp, found) {
            var keys = [...comp.dom._this.states._used];
            for (var k in comp.dom._this.props) {
                keys.push(k);
            }
            for (var x = 0; x < keys.length; x++) {
                var prop = keys[x];
                var ob = comp.dom._this.states[prop].current;
                if (found.indexOf(prop) === -1) {
                    found.push(prop);
                    this.foundBounds[prop] = comp.dom._this.states[prop].bind;
                    if (comp.dom._this instanceof Component_22.FunctionComponent)
                        this.foundFunctionComponents[prop] = true;
                }
                if (ob) {
                    for (var key in ob) {
                        if (found.indexOf(prop + "." + key) === -1) {
                            found.push(prop + "." + key);
                            if (comp.dom._this instanceof Component_22.FunctionComponent)
                                this.foundFunctionComponents[prop + "." + key] = true;
                            this.foundBounds[prop + "." + key] = comp.dom._this.states[prop].bind[key];
                        }
                    }
                }
            }
            if (comp._parent)
                this.collectStates(comp._parent, found);
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined) {
                if (value.startsWith("this."))
                    value = value.substring(5);
                if (value.startsWith("states."))
                    value = value.substring(7);
                value = value.replace(".bind.", ".");
                this.component.value = value;
            }
            else {
                this.component.value = "";
            }
            var comps = [];
            this.foundBounds = {};
            this.foundFunctionComponents = {};
            this.collectStates(this._ob._parent, comps);
            //TODO call this on focus
            /*var binders = this.propertyEditor.getVariablesForType(Databinder);
            if (binders !== undefined) {
                var comps = [];
                for (var x = 0; x < binders.length; x++) {
                    var binder = this.propertyEditor.getObjectFromVariable(binders[x]);
                    if (binder === undefined)
                        continue;
                    let ob = binder.value;
                    if (ob !== undefined&&!Array.isArray(ob)) {
                        for (var m in ob) {
                            comps.push(m + "-" + binders[x]);
                        }
                    }
                    comps.push("this-" + binders[x]);
                }*/
            this.component.autocompleter = comps;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param) {
            var val = this.component.value;
            var sp = "this.states." + val.split(".")[0] + ".bind."; //funcioncomponents doesnt have this
            if (this.foundFunctionComponents[val])
                sp = "states." + val.split(".")[0] + ".bind.";
            if (val.split(".").length > 1)
                sp = sp + val.substring(val.indexOf(".") + 1);
            this.propertyEditor.setPropertyInCode(this.property.name, sp);
            //var func = this.propertyEditor.value[this.property.name];
            //var binder = this.propertyEditor.getObjectFromVariable(sp[1]);
            this.propertyEditor.value[this.property.name] = this.foundBounds[val];
            //setPropertyInDesign(this.property.name,val);
            super.callEvent("edit", param);
        }
    };
    exports.DatabinderEditor = DatabinderEditor;
    exports.DatabinderEditor = DatabinderEditor = __decorate([
        (0, Editor_6.$PropertyEditor)(["databinder"]),
        (0, Registry_80.$Class)("jassijs.ui.PropertyEditors.DatabinderEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DatabinderEditor);
});
define("jassijs/ui/PropertyEditors/DBObjectEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/ui/ObjectChooser", "jassijs/remote/Classes"], function (require, exports, Editor_7, Registry_81, Panel_14, Textbox_12, ObjectChooser_1, Classes_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBObjectEditor = void 0;
    Registry_81 = __importStar(Registry_81);
    let DBObjectEditor = class DBObjectEditor extends Editor_7.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_14.Panel( /*{useSpan:true}*/);
            this._textbox = new Textbox_12.Textbox();
            this._objectchooser = new ObjectChooser_1.ObjectChooser();
            this._objectchooser.width = 16;
            this._objectchooser.height = 16;
            this._textbox.width = "calc(100% - 34px)";
            this.component.height = 16;
            this.component.add(this._textbox);
            this.component.add(this._objectchooser);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange(param);
            });
            this._objectchooser.onclick(function (ob) {
                _this._objectchooser.items = _this.property.componentType;
            }, false);
            this._objectchooser.onchange(function (ob) {
                _this.dbobject = _this._objectchooser.value;
                _this._textbox.value = _this._objectchooser.value.id;
                _this._onchange();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var h = Registry_81.default;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined) {
                //jassijs.db.load("de.Kunde",9);
                if (value.startsWith("jassijs.db.load")) {
                    var nr = value.split(",")[1];
                    nr = nr.substring(0, nr.indexOf(")") - 1);
                    this._textbox.value = nr;
                }
            }
            else {
                this._textbox.value = "";
            }
            var _this = this;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        async loadObject(id) {
            var tp = await Classes_26.classes.loadClass(this.property.componentType);
            return await tp["findOne"](parseInt(id));
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param = undefined) {
            var val = this._textbox.value;
            var type = this.property.componentType;
            var sval = "jassijs.db.load(\"" + type + "\"," + val + ")";
            var _this = this;
            this.propertyEditor.setPropertyInCode(this.property.name, sval);
            if (val && val !== "" && this.dbobject === undefined) {
                this.loadObject(val).then((ob) => {
                    _this.dbobject = ob;
                    _this.propertyEditor.setPropertyInDesign(_this.property.name, _this.dbobject);
                });
            }
            else
                this.propertyEditor.setPropertyInDesign(this.property.name, this.dbobject);
            /* var _this=this;
             jassijs.db.load("de.Kunde",val).then(function(ob){
                 _this.propertyEditor.setPropertyInDesign(_this.property.name,ob);
             });*/
            /*
            var func=this.propertyEditor.value[this.property.name];
            var binder=this.propertyEditor.getObjectFromVariable(sp[1]);
            this.propertyEditor.value[this.property.name](binder,sp[0]);
            //setPropertyInDesign(this.property.name,val);*/
            super.callEvent("edit", param);
        }
    };
    exports.DBObjectEditor = DBObjectEditor;
    exports.DBObjectEditor = DBObjectEditor = __decorate([
        (0, Editor_7.$PropertyEditor)(["dbobject"]),
        (0, Registry_81.$Class)("jassijs.ui.PropertyEditors.DBObjectEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DBObjectEditor);
});
define("jassijs/ui/PropertyEditors/DefaultEditor", ["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Select"], function (require, exports, Textbox_13, Editor_8, Registry_82, Select_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let DefaultEditor = class DefaultEditor extends Editor_8.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            if (property.chooseFrom !== undefined) {
                if (typeof (property.chooseFrom) === "function") {
                    this.component = new Textbox_13.Textbox();
                    this.component.autocompleter = function () {
                        return property.chooseFrom(_this.ob);
                    };
                }
                else {
                    if (property.chooseFromStrict) {
                        this.component = new Select_5.Select();
                        this.component.items = property.chooseFrom;
                    }
                    else {
                        this.component = new Textbox_13.Textbox();
                        this.component.autocompleter = property.chooseFrom;
                    }
                }
            }
            else {
                this.component = new Textbox_13.Textbox();
            }
            this.component.width = "100%";
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined && this.property.type === "string" && typeof value === 'string' && value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length - 1);
            }
            else if (value !== undefined && (this.property.type === "number[]" || this.property.type === "boolean[]")) {
                if (typeof (value) === "string")
                    value = value.replaceAll("[", "").replaceAll("]", "");
                else {
                    value = value.join(",");
                }
            }
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var val = this.component.value;
            if (this.property.type === "string")
                val = "\"" + val + "\"";
            if (this.property.type === "number[]" || this.property.type === "boolean[]")
                val = (val === "" ? "undefined" : "[" + val + "]");
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var oval = this.component.value;
            if (this.property.type === "number") {
                oval = Number(oval);
            }
            if (this.property.type === "string") {
                oval = JSON.parse('"' + oval + '"');
            }
            if (this.property.type === "number[]") {
                if (oval === "")
                    oval = undefined;
                else {
                    var all = oval.split(",");
                    oval = [];
                    for (var x = 0; x < all.length; x++) {
                        oval.push(Number(all[x].trim()));
                    }
                }
            }
            if (this.property.type === "boolean[]") {
                if (oval === "")
                    oval = undefined;
                else {
                    var all = oval.split(",");
                    oval = [];
                    for (var x = 0; x < all.length; x++) {
                        oval.push(all[x].trim() === "true");
                    }
                }
            }
            this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            super.callEvent("edit", param);
        }
    };
    DefaultEditor = __decorate([
        (0, Editor_8.$PropertyEditor)(["string", "number", "number[]", "boolean[]"]),
        (0, Registry_82.$Class)("jassijs.ui.PropertyEditors.DefaultEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DefaultEditor);
});
define("jassijs/ui/PropertyEditors/Editor", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry"], function (require, exports, Registry_83, Registry_84) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Editor = void 0;
    exports.$PropertyEditor = $PropertyEditor;
    Registry_84 = __importDefault(Registry_84);
    function $PropertyEditor(supportedtypes) {
        return function (pclass) {
            Registry_84.default.register("$PropertyEditor", pclass, supportedtypes);
        };
    }
    let Editor = class Editor {
        /**
        * Editor for number and string
        * used by PropertyEditor
        * @class jassijs.ui.PropertyEditors.DefaultEditor
        */
        constructor(property, propertyEditor) {
            /** @member - the renedering component **/
            this.component = undefined;
            /** @member - the edited object */
            this._ob = undefined;
            /** @member {string} - the name of the variable */
            /** @member {jassijs.ui.Property} - the property to edit */
            this.property = property;
            /** @member {jassijs.ui.PropertEditor} - the PropertyEditor instance */
            this.propertyEditor = propertyEditor;
            /** @member {Object.<string,function>} - all event handlers*/
            this._eventHandler = {};
        }
        /**
         * adds an event
         * @param {type} name - the name of the event
         * @param {function} func - callfunction for the event
         */
        addEvent(name, func) {
            var events = this._eventHandler[name];
            if (events === undefined) {
                events = [];
                this._eventHandler[name] = events;
            }
            events.push(func);
        }
        /**
         * call the event
         * @param {name} name - the name of the event
         * @param {object} param 1- parameter for the event
         * @param {object} param 2- parameter for the event
         * @param {object} param 3- parameter for the event
         */
        callEvent(name, param1 = undefined, param2 = undefined, param3 = undefined) {
            var events = this._eventHandler[name];
            if (events === undefined)
                return;
            if (name === "edit") {
                if (param1 === undefined)
                    param1 = {};
                param1.property = this.property.name;
            }
            for (var x = 0; x < events.length; x++) {
                events[x](param1, param2, param3);
            }
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            this._ob = ob;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return undefined;
        }
        /**
         * called on value changes
         * @param handler - function(oldValue,newValue)
         */
        onedit(handler) {
            this.addEvent("edit", handler);
        }
        destroy() {
            if (this.component !== undefined) {
                this.component.destroy();
            }
        }
    };
    exports.Editor = Editor;
    exports.Editor = Editor = __decorate([
        (0, Registry_83.$Class)("jassijs.ui.PropertyEditors.Editor"),
        __metadata("design:paramtypes", [Object, Object])
    ], Editor);
});
define("jassijs/ui/PropertyEditors/FontEditor", ["require", "exports", "jassijs/ui/PropertyEditor", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Select", "jassijs/ui/CSSProperties"], function (require, exports, PropertyEditor_3, Editor_9, Textbox_14, Registry_85, Select_6, CSSProperties_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FontEditor = void 0;
    exports.test2 = test2;
    exports.test = test;
    let systemFonts = ["Arial", "Helvetica Neue", "Courier New", "Times New Roman", "Comic Sans MS", "Impact"];
    let googleFonts = ["Aclonica", "Allan", "Annie Use Your Telescope", "Anonymous Pro", "Allerta Stencil", "Allerta", "Amaranth", "Anton", "Architects Daughter", "Arimo", "Artifika", "Arvo", "Asset", "Astloch", "Bangers", "Bentham", "Bevan", "Bigshot One", "Bowlby One", "Bowlby One SC", "Brawler", "Buda:300", "Cabin", "Calligraffitti", "Candal", "Cantarell", "Cardo", "Carter One", "Caudex", "Cedarville Cursive", "Cherry Cream Soda", "Chewy", "Coda", "Coming Soon", "Copse", "Corben", "Cousine", "Covered By Your Grace", "Crafty Girls", "Crimson Text", "Crushed", "Cuprum", "Damion", "Dancing Script", "Dawning of a New Day", "Didact Gothic", "Droid Sans", "Droid Serif", "EB Garamond", "Expletus Sans", "Fontdiner Swanky", "Forum", "Francois One", "Geo", "Give You Glory", "Goblin One", "Goudy Bookletter 1911", "Gravitas One", "Gruppo", "Hammersmith One", "Holtwood One SC", "Homemade Apple", "Inconsolata", "Indie Flower", "Irish Grover", "Istok Web", "Josefin Sans", "Josefin Slab", "Judson", "Jura", "Just Another Hand", "Just Me Again Down Here", "Kameron", "Kenia", "Kranky", "Kreon", "Kristi", "La Belle Aurore", "Lato", "League Script", "Lekton", "Limelight", "Lobster", "Lobster Two", "Lora", "Love Ya Like A Sister", "Loved by the King", "Luckiest Guy", "Maiden Orange", "Mako", "Maven Pro", "Maven Pro:900", "Meddon", "MedievalSharp", "Megrim", "Merriweather", "Metrophobic", "Michroma", "Miltonian Tattoo", "Miltonian", "Modern Antiqua", "Monofett", "Molengo", "Mountains of Christmas", "Muli:300", "Muli", "Neucha", "Neuton", "News Cycle", "Nixie One", "Nobile", "Nova Cut", "Nova Flat", "Nova Mono", "Nova Oval", "Nova Round", "Nova Script", "Nova Slim", "Nova Square", "Nunito", "Old Standard TT", "Open Sans:300", "Open Sans", "Open Sans:600", "Open Sans:800", "Open Sans Condensed:300", "Orbitron", "Orbitron:500", "Orbitron:700", "Orbitron:900", "Oswald", "Over the Rainbow", "Reenie Beanie", "Pacifico", "Patrick Hand", "Paytone One", "Permanent Marker", "Philosopher", "Play", "Playfair Display", "Podkova", "Press Start 2P", "Puritan", "Quattrocento", "Quattrocento Sans", "Radley", "Raleway:100", "Redressed", "Roboto", "Rock Salt", "Rokkitt", "Ruslan Display", "Schoolbell", "Shadows Into Light", "Shanti", "Sigmar One", "Six Caps", "Slackey", "Smythe", "Sniglet", "Sniglet:800", "Special Elite", "Stardos Stencil", "Sue Elen Francisco", "Sunshiney", "Swanky and Moo Moo", "Syncopate", "Tangerine", "Tenor Sans", "Terminal Dosis Light", "The Girl Next Door", "Tinos", "Ubuntu", "Ultra", "Unkempt", "UnifrakturCook:bold", "UnifrakturMaguntia", "Varela", "Varela Round", "Vibur", "Vollkorn", "VT323", "Waiting for the Sunrise", "Wallpoet", "Walter Turncoat", "Wire One", "Yanone Kaffeesatz", "Yeseva One", "Zeyada"];
    let FontEditor = class FontEditor extends Editor_9.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Select_6.Select({
                "multiple": false,
                "placeholder": "select a font",
                "allowDeselect": false
            });
            this.component.width = "100%";
            this.component.display = function (item) {
                return '<span style=font-family:"' + item + '>' + item + '</span>';
            };
            var all = [];
            for (let i = 0; i < systemFonts.length; i++) {
                all.push(systemFonts[i]);
            }
            for (let i = 0; i < googleFonts.length; i++) {
                all.push(googleFonts[i]);
                (0, CSSProperties_2.loadFontIfNedded)(googleFonts[i]);
            }
            this.component.items = all;
            //   this.component.dom=font[0];
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined && value.length > 1)
                value = value.substring(1, value.length - 1);
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var val = this.component.value;
            val = "\"" + val + "\"";
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var oval = this.component.value;
            this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            super.callEvent("edit", param);
        }
    };
    exports.FontEditor = FontEditor;
    exports.FontEditor = FontEditor = __decorate([
        (0, Editor_9.$PropertyEditor)(["font"]),
        (0, Registry_85.$Class)("jassijs.ui.PropertyEditors.FontEditor")
        /**
        * Editor for font
        * used by PropertyEditor
        **/
        ,
        __metadata("design:paramtypes", [Object, Object])
    ], FontEditor);
    function test2() {
        var prop = new PropertyEditor_3.PropertyEditor();
        prop.value = new Textbox_14.Textbox();
        return prop;
    }
    function test() {
        var prop = new FontEditor(undefined, undefined);
        return prop.component;
    }
});
define("jassijs/ui/PropertyEditors/FunctionEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Button", "jassijs/remote/Registry"], function (require, exports, Editor_10, Button_7, Registry_86) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FunctionEditor = void 0;
    let FunctionEditor = class FunctionEditor extends Editor_10.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Button_7.Button();
            this.component.width = "100%";
            var _this = this;
            this.component.onclick(function (param) {
                _this._onclick(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property, true);
            if (value === undefined) {
                this.component.text = "none";
            }
            else
                this.component.text = "function";
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onclick(param) {
            var val = this.component.text;
            if (val !== "function") { //function is still empty
                var value = this.propertyEditor.parser.getPropertyValue(this.propertyEditor.variablename, this.property.name);
                this.propertyEditor.setPropertyInCode(this.property.name, this.property.default);
                this.component.value = "function";
                //  this.propertyEditor.gotoCodeLine(line + 1);
                super.callEvent("edit", param);
            } /* else {//function is already defined so goto
                let line = this.propertyEditor.parser.data[this.propertyEditor.variablename][this.property.name][0].linestart;
                this.propertyEditor.gotoCodeLine(line + 1);
    
            }*/
            var node = this.propertyEditor.parser.data[this.propertyEditor.variablename][this.property.name][0].node;
            var pos = -1;
            if (node["expression"])
                pos = node["expression"].arguments[0].body.pos;
            else
                pos = node["initializer"].body.pos;
            this.propertyEditor.gotoCodePosition(pos + 2);
        }
    };
    exports.FunctionEditor = FunctionEditor;
    exports.FunctionEditor = FunctionEditor = __decorate([
        (0, Editor_10.$PropertyEditor)(["function"]),
        (0, Registry_86.$Class)("jassijs.ui.PropertyEditors.FunctionEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], FunctionEditor);
});
define("jassijs/ui/PropertyEditors/HTMLEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Textbox", "jassijs/ui/ObjectChooser", "jassijs/ui/Panel"], function (require, exports, Editor_11, Registry_87, Textbox_15, ObjectChooser_2, Panel_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEditor = void 0;
    let HTMLEditor = class HTMLEditor extends Editor_11.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_15.Panel( /*{useSpan:true}*/);
            this._textbox = new Textbox_15.Textbox();
            this._objectchooser = new ObjectChooser_2.ObjectChooser();
            this._objectchooser.width = 24;
            this._textbox.width = "calc(100% - 28px)";
            this.component.height = 24;
            this.component.add(this._textbox);
            this.component.add(this._objectchooser);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange('"' + param + '"');
            });
            this._objectchooser.onclick(function (ob) {
                _this._objectchooser.items = _this.property.type;
            });
            this._objectchooser.onchange(function (ob) {
                _this._textbox.value = _this._objectchooser.value.id;
                _this._onchange();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined && this.property.type === "string" && value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length - 1);
            }
            this._textbox.value = value;
            var _this = this;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param = undefined) {
            var val = this._textbox.value;
            var type = this.property.type;
            // var sval="jassijs.db.load(\""+type+"\","+val+")";
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
            /* var _this=this;
             jassijs.db.load("de.Kunde",val).then(function(ob){
                 _this.propertyEditor.setPropertyInDesign(_this.property.name,ob);
             });*/
            /*
            var func=this.propertyEditor.value[this.property.name];
            var binder=this.propertyEditor.getObjectFromVariable(sp[1]);
            this.propertyEditor.value[this.property.name](binder,sp[0]);
            //setPropertyInDesign(this.property.name,val);*/
            super.callEvent("edit", param);
        }
    };
    exports.HTMLEditor = HTMLEditor;
    exports.HTMLEditor = HTMLEditor = __decorate([
        (0, Editor_11.$PropertyEditor)(["html"]),
        (0, Registry_87.$Class)("jassijs.ui.PropertyEditors.HTMLEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], HTMLEditor);
});
define("jassijs/ui/PropertyEditors/ImageEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/base/Actions", "../Component", "jassijs/ext/jquerylib"], function (require, exports, Editor_12, Registry_88, Panel_16, Textbox_16, Button_8, Actions_5, Component_23) {
    "use strict";
    var ImageEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImageEditor = void 0;
    exports.test2 = test2;
    let ImageEditor = ImageEditor_1 = class ImageEditor extends Editor_12.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_16.Panel( /*{useSpan:true}*/);
            this._button = new Button_8.Button();
            this._textbox = new Textbox_16.Textbox();
            this._textbox.width = "calc(100% - 34px)";
            this.component.height = 24;
            this._button.icon = "mdi mdi-glasses";
            this.component.add(this._textbox);
            this.component.add(this._button);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange(param);
            });
            this._button.onclick(() => {
                _this.showDialog();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value === null || value === void 0 ? void 0 : value.startsWith('"'))
                value = value.substring(1);
            if (value === null || value === void 0 ? void 0 : value.endsWith('"')) {
                value = value.substring(0, value.length - 1);
            }
            this._textbox.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param = undefined) {
            var val = this._textbox.value;
            if (this.property) {
                this.propertyEditor.setPropertyInCode(this.property.name, '"' + val + '"');
                this.propertyEditor.setPropertyInDesign(this.property.name, val);
            }
            super.callEvent("edit", param);
        }
        static async dummy() {
        }
        static async show() {
            await new ImageEditor_1(undefined, undefined).showDialog();
        }
        async showDialog(onlytest = undefined) {
            if (!this.dialog) {
                var _this = this;
                this.dialog = new Panel_16.Panel();
                var suche = new Textbox_16.Textbox();
                var icons = new Panel_16.Panel();
                this.dialog.add(suche);
                this.dialog.add(icons);
                suche.onchange((data) => {
                    var su = suche.value;
                    for (var x = 0; x < icons.dom.children[0].children.length; x++) {
                        var ic = icons.dom.children[0].children[x];
                        if (ic.className.indexOf(su) > -1) {
                            ic.setAttribute("style", "display:inline");
                        }
                        else
                            ic.setAttribute("style", "display:none");
                    }
                });
                var file = (await new Promise((resolve_21, reject_21) => { require(["jassijs/modul"], resolve_21, reject_21); }).then(__importStar)).default.css["materialdesignicons.min.css"] + "?ooo=9";
                var text = await $.ajax({ method: "get", url: file, crossDomain: true, contentType: "text/plain" });
                var all = text.split("}.");
                var html = "";
                window["ImageEditorClicked"] = function (data) {
                    _this._textbox.value = "mdi " + data;
                    suche.value = data;
                    _this._onchange();
                };
                var len = onlytest ? 20 : all.length;
                for (var x = 1; x < len; x++) {
                    var icon = all[x].split(":")[0];
                    html = html + "<span title='" + icon + "' onclick=ImageEditorClicked('" + icon + "') class='mdi " + icon + "'></span>";
                }
                var node = Component_23.Component.createHTMLElement("<span style='font-size:18pt'>" + html + "</span>");
                icons.__dom.appendChild(node);
                if (!onlytest)
                    $(this.dialog.__dom).dialog({ height: "400", width: "400" });
            }
            else {
                $(this.dialog.__dom).dialog("open");
            }
        }
    };
    exports.ImageEditor = ImageEditor;
    __decorate([
        (0, Actions_5.$Action)({
            name: "Tools",
            icon: "mdi mdi-tools",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImageEditor, "dummy", null);
    __decorate([
        (0, Actions_5.$Action)({
            name: "Tools/Icons",
            icon: "mdi mdi-image-area",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImageEditor, "show", null);
    exports.ImageEditor = ImageEditor = ImageEditor_1 = __decorate([
        (0, Actions_5.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Editor_12.$PropertyEditor)(["image"]),
        (0, Registry_88.$Class)("jassijs.ui.PropertyEditors.ImageEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ImageEditor);
    function test2() {
        var ed = new ImageEditor(undefined, undefined);
        ed.showDialog(true);
        return ed.dialog;
    }
});
define("jassijs/ui/PropertyEditors/JsonArrayEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/PropertyEditor", "jassijs/ui/BoxPanel", "jassijs/ui/Table", "jassijs/ui/Button"], function (require, exports, Editor_13, Registry_89, Property_25, PropertyEditor_4, BoxPanel_5, Table_3, Button_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JsonArrayEditor = void 0;
    exports.test = test;
    let JsonArrayEditor = class JsonArrayEditor extends Editor_13.Editor {
        /**
           * Editor for number and string
           * used by PropertyEditor
           * @class jassijs.ui.PropertyEditors.DefaultEditor
           */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Button_9.Button();
            var _this = this;
            this.component.onclick(function (param) {
                _this._onclick(param);
            });
        }
        _onclick(param) {
        }
        /**
        * get the renderer for the PropertyEditor
        * @returns - the UI-component for the editor
        */
        getComponent() {
            return this.component;
        }
        /**
        * @member {object} ob - the object which is edited
        */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        showDialog(control, propEditor) {
            var panel = new BoxPanel_5.BoxPanel();
            var panelButtons = new BoxPanel_5.BoxPanel();
            var table = new Table_3.Table({
                options: {
                    columns: [{ field: "field", title: "field" }]
                }
            });
            var up = new Button_9.Button();
            table.height = "100%";
            panel.horizontal = true;
            panelButtons.add(up);
            panel.add(table);
            panel.add(panelButtons);
            panel.add(control);
            var docheight = $(document).height();
            $(panel.dom).dialog({
                height: docheight,
                width: "320px"
            });
        }
    };
    exports.JsonArrayEditor = JsonArrayEditor;
    exports.JsonArrayEditor = JsonArrayEditor = __decorate([
        (0, Editor_13.$PropertyEditor)(["jsonarray"]),
        (0, Registry_89.$Class)("jassijs.ui.PropertyEditors.JsonArrayEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], JsonArrayEditor);
    let TestProperties = class TestProperties {
    };
    __decorate([
        (0, Property_25.$Property)({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "name1", void 0);
    __decorate([
        (0, Property_25.$Property)({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "name2", void 0);
    TestProperties = __decorate([
        (0, Registry_89.$Class)("jassijs.ui.JsonArrayEditor.TestProperties")
    ], TestProperties);
    let TestProperties2 = class TestProperties2 {
    };
    __decorate([
        (0, Property_25.$Property)({ decription: "name of the dialog", type: "jsonarray", componentType: "jassijs.ui.JsonArrayEditor.TestProperties" }),
        __metadata("design:type", Object)
    ], TestProperties2.prototype, "ob", void 0);
    TestProperties2 = __decorate([
        (0, Registry_89.$Class)("jassijs.ui.JsonArrayEditor.TestProperties2")
    ], TestProperties2);
    function test() {
        var ret = new PropertyEditor_4.PropertyEditor();
        ret.value = new TestProperties2();
        return ret;
    }
});
define("jassijs/ui/PropertyEditors/JsonEditor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Button", "jassijs/ui/PropertyEditor", "jassijs/util/Tools", "jassijs/remote/Classes", "jassijs/ui/Property", "jassijs/ext/jquerylib"], function (require, exports, Registry_90, Editor_14, Button_10, PropertyEditor_5, Tools_2, Classes_27, Property_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JsonEditor = void 0;
    exports.test = test;
    let JsonEditor = class JsonEditor extends Editor_14.Editor {
        /**
         * Editor for number and string
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.DefaultEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Button_10.Button();
            var _this = this;
            this.component.onclick(function (param) {
                _this._onclick(param);
            });
            this.component.icon = "mdi mdi-decagram-outline";
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            this._ob = ob;
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            var empty = value === undefined || value.length === 0;
            if (empty) {
                this.component.icon = "mdi mdi-decagram-outline";
            }
            else
                this.component.icon = "mdi mdi-decagram";
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        _getPropertyValue(property) {
        }
        /**
         * register an event if the property has changed
         * @param {function} handler - the function that is called on change
         */
        onpropertyChanged(handler) {
            this.addEvent("propertyChanged", handler);
        }
        propertyChanged(param, propEditor) {
            var _this = this;
            _this.callEvent("propertyChanged", param);
            if (_this.propertyEditor.parentPropertyEditor === undefined) { //only if the last JSON-PropertyEditor Window is closed
                var space = ""; //_this.propertyEditor.getSpace(_this.property.name);
                //var str = Tools.objectToJson(propEditor.value, space);
                var str = Tools_2.Tools.stringObjectToJson(propEditor.codeChanges, space);
                if (_this.property.name === "new") {
                    var shortClassname = Classes_27.classes.getClassName(_this._ob).split(".")[Classes_27.classes.getClassName(_this._ob).split(".").length - 1];
                    str = "new " + shortClassname + "(" + str + ")";
                }
                if (_this.property.constructorClass !== undefined) {
                    var shortClassname = _this.property.constructorClass.split(".")[_this.property.constructorClass.split(".").length - 1];
                    str = "new " + shortClassname + "(" + str + ")";
                }
                var line = _this.propertyEditor.setPropertyInCode(_this.property.name, str);
                //set Property in Design
                //???Alternativ: 
                var test = _this._ob; //Tools.stringObjectToObject
                if (test === undefined) {
                    //_this.ob={};
                    // _this.propertyEditor.setPropertyInDesign(_this.property.name,_this.ob);
                }
                var newvalue = propEditor.value;
                if (_this.property.constructorClass !== undefined) {
                    var cl = Classes_27.classes.getClass(_this.property.constructorClass);
                    newvalue = new cl(propEditor.value);
                }
                if (typeof (_this._ob[_this.property.name]) === "function")
                    _this._ob[_this.property.name](newvalue);
                else
                    _this._ob[_this.property.name] = newvalue;
                _this.callEvent("edit", param);
            }
            else
                propEditor.parentPropertyEditor.callEvent("propertyChanged", param);
            let val = propEditor.value;
            if (!val) {
                _this.component.icon = "mdi mdi-decagram-outline";
            }
            else {
                _this.component.icon = "mdi mdi-decagram";
            }
        }
        /**
         * initiate the default values in the PropertyEditor from code
         **/
        setCode(propEditor) {
            var _this = this;
            var av = this.propertyEditor.getPropertyValue(this.property);
            if (av !== undefined) {
                if (_this.propertyEditor.parentPropertyEditor === undefined) {
                    //we convert the ob to a stringobject and initialize the values
                    let textob = Tools_2.Tools.jsonToStringObject(av);
                    propEditor.codeChanges = textob === undefined ? {} : textob;
                }
                else {
                    propEditor.codeChanges = av;
                }
            }
            else {
                if (_this.propertyEditor.parentPropertyEditor === undefined) {
                    propEditor.codeChanges = {};
                }
                else {
                    this.propertyEditor.codeChanges[this.property.name] = {};
                    propEditor.codeChanges = this.propertyEditor.codeChanges[this.property.name];
                }
            }
        }
        createPropertyEditor() {
            var propEditor = new PropertyEditor_5.PropertyEditor();
            propEditor.actions = this.property.editoractions;
            propEditor.readPropertyValueFromDesign = this.propertyEditor.readPropertyValueFromDesign;
            propEditor.showThisProperties = this.showThisProperties;
            var _this = this;
            this.setCode(propEditor);
            propEditor.onpropertyChanged(function (param) {
                _this.propertyChanged(param, propEditor);
            });
            propEditor.parentPropertyEditor = this.propertyEditor;
            propEditor.variablename = this.property.name;
            if (this.propertyEditor.parentPropertyEditor !== undefined) {
                propEditor.showThisProperties = this.propertyEditor.showThisProperties;
            }
            return propEditor;
        }
        /**
         * get the propertyvalue from code
         */
        async getInitialPropertyValue(code) {
            var newvalue = undefined;
            if (this.property.componentType) {
                let newclass = Classes_27.classes.getClass(this.property.componentType);
                newvalue = new newclass();
            }
            else {
                newvalue = {};
            }
            //only the top-PropertyEditor changed something
            if (this.propertyEditor.parentPropertyEditor === undefined) {
                /* if (this.property.constructorClass !== undefined) {
                     var param = code === undefined ? undefined : code.substring(code.indexOf("(") + 1, code.indexOf(")"));
                     if (param === "")
                         param = undefined;
                     var oclass = await classes.loadClass(this.property.constructorClass);
                     let oparam = Tools.jsonToObject(param);
                     newvalue = new oclass(param === undefined ? undefined : oparam);
                 } else */ {
                    let val = undefined;
                    if (code === undefined) {
                        val = {};
                    }
                    else if (typeof (code) === "string") {
                        val = Tools_2.Tools.jsonToObject(code);
                    }
                    else
                        val = code;
                    Object.assign(newvalue, val);
                }
            }
            else {
                var val = this.propertyEditor.value[this.property.name];
                if (val !== undefined) {
                    Object.assign(newvalue, val);
                }
            }
            return newvalue;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        async _onclick(param) {
            var propEditor = this.createPropertyEditor();
            propEditor.value = await this.getInitialPropertyValue(this.propertyEditor.getPropertyValue(this.property));
            //if a new property is created attach it to the parenteditor
            if (this.propertyEditor.parentPropertyEditor && this.propertyEditor.value[this.property.name] === undefined) {
                this.propertyEditor.value[this.property.name] = propEditor.value;
            }
            this.showDialog(propEditor, propEditor);
        }
        showDialog(control, propEditor) {
            var docheight = $(document).height();
            $(control.dom).dialog({
                height: docheight,
                width: "320px",
                beforeClose: function (event, ui) {
                    if (propEditor.variablename === "new") {
                        propEditor.parentPropertyEditor.updateCodeEditor();
                    }
                }
            });
        }
    };
    exports.JsonEditor = JsonEditor;
    exports.JsonEditor = JsonEditor = __decorate([
        (0, Editor_14.$PropertyEditor)(["json"]),
        (0, Registry_90.$Class)("jassijs.ui.PropertyEditors.JsonEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], JsonEditor);
    var actions = [{
            name: "PropertyAction",
            call: (hallo) => alert("Hallo2"),
            description: "Hallodesc2",
            icon: "mdi mdi-account-hard-hat"
        }];
    let TestProperties2 = class TestProperties2 {
    };
    __decorate([
        (0, Property_26.$Property)(),
        __metadata("design:type", Boolean)
    ], TestProperties2.prototype, "hallo", void 0);
    TestProperties2 = __decorate([
        (0, Registry_90.$Class)("jassijs.ui.PropertyEditorTestProperties2")
    ], TestProperties2);
    let TestProperties = class TestProperties {
        extensionCalled(action) {
            if (action.getPropertyEditorActions) {
                action.getPropertyEditorActions.actions.push({
                    name: "Hallo", description: "Hallodesc", icon: "mdi mdi-table-arrow-up",
                    call: (hallo) => alert(hallo)
                });
            }
        }
    };
    __decorate([
        (0, Property_26.$Property)({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "dialogname", void 0);
    __decorate([
        (0, Property_26.$Property)({ name: "jo", type: "json", componentType: "jassijs.ui.PropertyEditorTestProperties2",
            editoractions: actions
        }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "jo", void 0);
    TestProperties = __decorate([
        (0, Registry_90.$Class)("jassijs.ui.PropertyEditorTestProperties")
    ], TestProperties);
    function test() {
        var ret = new PropertyEditor_5.PropertyEditor();
        ret.value = new TestProperties();
        return ret;
    }
});
define("jassijs/ui/PropertyEditors/NameEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox", "jassijs/remote/Registry"], function (require, exports, Editor_15, Textbox_17, Registry_91) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NameEditor = void 0;
    let NameEditor = class NameEditor extends Editor_15.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Textbox_17.Textbox();
            this.component.width = "100%";
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getVariableFromObject(ob);
            var auto = this.propertyEditor.isVariableAutoGenerated(value);
            if (value.startsWith("this."))
                value = value.substring(5);
            if (value.startsWith("me."))
                value = value.substring(3);
            /*            var value=this.propertyEditor.getPropertyValue(this.property);
                        if(value!==undefined&&value.startsWith("\"")&&value.endsWith("\"")&&this.property.type==="string"){
                            value=value.substring(1,value.length-1);
                        }*/
            this.component.value = auto ? "" : value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var old = this.propertyEditor.getVariableFromObject(this._ob);
            var changedvar = this.propertyEditor.renameVariableInCode(old, this.component.value);
            this.propertyEditor.renameVariableInDesign(old, changedvar, this.component.value === "");
            var varname = this.component.value;
            if (old !== undefined && old.startsWith("me."))
                varname = "me." + varname;
            if (old !== undefined && old.startsWith("this."))
                varname = "this." + varname;
            this.propertyEditor.variablename = varname;
            /*  var val=this.component.value;
              if(this.property.type==="string")
                  val="\""+val+"\"";
              this.propertyEditor.setPropertyInCode(this.property.name,val);
              this.propertyEditor.setPropertyInDesign(this.property.name,val);
              super.callEvent("edit",param);*/
        }
    };
    exports.NameEditor = NameEditor;
    exports.NameEditor = NameEditor = __decorate([
        (0, Editor_15.$PropertyEditor)(["*name*"]),
        (0, Registry_91.$Class)("jassijs.ui.PropertyEditors.NameEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], NameEditor);
});
define("jassijs/ui/PropertyEditors/TableColumnImport", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Registry_92, Panel_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TableColumnImport = void 0;
    exports.test = test;
    let TableColumnImport = class TableColumnImport extends Panel_17.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            //default dataformat
            //default numberformat
            //selectable table fields to import
            //button import fields
            this.config({});
        }
    };
    exports.TableColumnImport = TableColumnImport;
    exports.TableColumnImport = TableColumnImport = __decorate([
        (0, Registry_92.$Class)("jassijs/ui/PropertyEditors/TableColumnImport"),
        __metadata("design:paramtypes", [])
    ], TableColumnImport);
    async function test() {
        var ret = new TableColumnImport();
        return ret;
    }
});
define("jassijs/ui/Repeater2", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/DataComponent", "jassijs/ui/Property", "jassijs/ui/Textbox", "jassijs/ui/State", "jassijs/ui/Button", "jassijs/ui/Panel", "jassijs/ui/Table", "jassijs/ext/jquerylib", "jquery.choosen"], function (require, exports, Registry_93, Component_24, DataComponent_4, Property_27, Textbox_18, State_3, Button_11, Panel_18, Table_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Repeater2 = void 0;
    exports.test = test;
    ///@$UIComponent({ fullPath: "common/Select", icon: "mdi mdi-form-dropdown" })
    let Repeater2 = class Repeater2 extends DataComponent_4.DataComponent {
        constructor(properties = undefined) {
            super(properties);
            this._components = [];
            // super.init('<select class="Select"><option value=""></option></select>');
        }
        render() {
            //  super.init('<select class="Select"><option value=""></option></select>');
            return React.createElement("span", {});
        }
        onchange(handler) {
        }
        set value(value) {
            this.states.value.current = value;
        }
        get value() {
            return this.states.value.current;
        }
        set items(value) {
            this.states.items.current = value;
        }
        get items() {
            return this.states.items.current;
        }
        /* get bindItems() {
             return this._bindItems;
         }
     
         @$Property({ type: "databinder" })
         set bindItems(bound: BoundProperty) {
             this._bindItems = bound;
             var _this = this;
             this._bindItems._databinder.add(bound._propertyname, this,(tab) => {
                 return _this.items;
             }, (tab, val) => {
                 _this.items = val;
             });
             //databinderItems.add(property, this, "onchange");
             //databinder.checkAutocommit(this);
         }*/
        duplicateChildren(children, state) {
            var _a, _b, _c, _d, _e;
            var ret = [];
            for (var x = 0; x < children.length; x++) {
                var n = Object.assign({}, children[x]);
                if (n.props) {
                    n.props = {};
                    Object.assign(n.props, children[x].props);
                }
                if ((_a = n.props) === null || _a === void 0 ? void 0 : _a.children) {
                    n.props.children = this.duplicateChildren(n.props.children, state);
                }
                if (((_c = (_b = n.props) === null || _b === void 0 ? void 0 : _b.bind) === null || _c === void 0 ? void 0 : _c._databinder) === ((_d = this.bind) === null || _d === void 0 ? void 0 : _d._databinder) && ((_e = this.bind) === null || _e === void 0 ? void 0 : _e._databinder) !== undefined) {
                    var path = n.props.bind._propertyname.split(".");
                    var pp = state.bind;
                    for (var y = 0; y < path.length; y++) {
                        if (path[y] !== this) {
                            pp = pp[path[y]];
                        }
                    }
                    n.props.bind = pp;
                }
                ret.push(n);
            }
            return ret;
        }
        createRepeatingItem(ob, children) {
            //this._boundProperty._databinder.value=ob;
            var jchilds = [];
            var stat = (0, State_3.createState)();
            stat.current = ob;
            var dup = this.duplicateChildren(children, stat);
            jchilds.push(...dup);
            var comp = (0, Component_24.createComponent)((0, Component_24.jc)(Component_24.HTMLComponent, {
                tag: "span",
                children: jchilds,
                onMouseEnter: () => {
                    var _a;
                    console.log(JSON.stringify(ob));
                    if (((_a = this.bind._databinder.connectedState) === null || _a === void 0 ? void 0 : _a.current) !== ob)
                        this.bind._databinder.connectedState.current = ob;
                }
            }));
            comp.repeatingObject = stat;
            this.add(comp);
        }
        config(config, forceRender = false) {
            var _a, _b, _c, _d, _e;
            Object.assign(this.props, config);
            if (((_a = this.props) === null || _a === void 0 ? void 0 : _a.children) && ((_b = this.props) === null || _b === void 0 ? void 0 : _b.items)) {
                if (((_c = this.props) === null || _c === void 0 ? void 0 : _c.children.length) > 0 && ((_d = this.props) === null || _d === void 0 ? void 0 : _d.bind)) {
                    this.bind = this.props.bind; //setup databinder
                    delete config.bind;
                    if (this._components === undefined)
                        this._components = [];
                    this.removeAll(false);
                    if ((_e = this.props) === null || _e === void 0 ? void 0 : _e.items) {
                        for (var i = 0; i < this.props.items.length; i++) {
                            var ob = this.props.items[i];
                            this.createRepeatingItem(ob, this.props.children);
                        }
                    }
                    delete config.children;
                }
            }
            super.config(config);
            return this;
        }
        add(component) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper._parent = this;
            this._components.push(component);
            this.dom.appendChild(component.domWrapper);
        }
        addBefore(component, before) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper["_parent"] = this;
            var index = this._components.indexOf(before);
            if (component.domWrapper.parentNode !== null && component.domWrapper.parentNode !== undefined) {
                component.domWrapper.parentNode.removeChild(component.domWrapper);
            }
            this._components.splice(index, 0, component);
            this.dom.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
            //before.domWrapper.parentNode.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
        }
        remove(component, destroy = false) {
            if (destroy)
                component.destroy();
            component._parent = undefined;
            if (component.domWrapper !== undefined)
                component.domWrapper._parent = undefined;
            if (this._components) {
                var pos = this._components.indexOf(component);
                if (pos >= 0)
                    this._components.splice(pos, 1);
            }
            try {
                this.dom.removeChild(component.domWrapper);
            }
            catch (ex) {
            }
        }
        removeAll(destroy = undefined) {
            while (this._components.length > 0) {
                this.remove(this._components[0], destroy);
            }
        }
        destroy() {
            if (this._components !== undefined) {
                var tmp = [].concat(this._components);
                for (var k = 0; k < tmp.length; k++) {
                    tmp[k].destroy();
                }
                this._components = [];
            }
            super.destroy();
        }
    };
    exports.Repeater2 = Repeater2;
    __decorate([
        (0, Property_27.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Repeater2.prototype, "onchange", null);
    exports.Repeater2 = Repeater2 = __decorate([
        (0, Registry_93.$Class)("jassijs.ui.Repeater2")
        //@$Property({ name: "new", type: "json", componentType: "jassijs.ui.SelectProperties" })
        ,
        __metadata("design:paramtypes", [Object])
    ], Repeater2);
    class TestComp extends Component_24.Component {
        render() {
            return (0, Component_24.jc)(Repeater2, {
                items: data,
                bind: this.states.customer.bind,
                children: [
                    (0, Component_24.jc)(Panel_18.Panel, {
                        children: [
                            (0, Component_24.jc)(Textbox_18.Textbox, { bind: this.states.customer.bind.id }),
                            (0, Component_24.jc)(Textbox_18.Textbox, {
                                bind: this.states.customer.bind.name
                            }),
                            (0, Component_24.jc)(Button_11.Button, {
                                text: "go",
                                onclick: () => {
                                    alert(this.states.customer.current.name);
                                }
                            }),
                            (0, Component_24.jc)(Table_4.Table, {
                                height: 100,
                                width: 100,
                                bind: this.states.activeChild.bind,
                                bindItems: this.states.customer.bind.childs
                            }),
                            (0, Component_24.jc)(Textbox_18.Textbox, {
                                bind: this.states.activeChild.bind.name
                            }),
                        ]
                    })
                ]
            });
        }
    }
    var data = [
        { id: 1, name: "Max", childs: [{ name: "Anna" }, { name: "Aria" }] },
        { id: 2, name: "Moritz", childs: [{ name: "Clara" }, { name: "Heidi" }] },
        { id: 3, name: "Heinz", childs: [{ name: "Rosa" }, { name: "Luise" }] },
    ];
    function DetailComponent(props, states = {}) {
        var ret = (0, Component_24.jc)("div", {
            children: [
                (0, Component_24.jc)(Textbox_18.Textbox, {
                    bind: states.value.bind.id
                }),
                (0, Component_24.jc)(Textbox_18.Textbox, {
                    bind: states.value.bind.name
                }),
                (0, Component_24.jc)(Table_4.Table, {
                    height: 100,
                    width: 100,
                    bind: states.activeChild.bind,
                    bindItems: states.value.bind.childs
                }),
                (0, Component_24.jc)(Textbox_18.Textbox, {
                    bind: states.activeChild.bind.name
                }),
                (0, Component_24.jc)(Button_11.Button, { text: "erter" }),
                (0, Component_24.jc)("br")
            ]
        });
        return ret;
    }
    function MainComponent(props, states) {
        var ch = props.items.map(item => (0, Component_24.jc)(DetailComponent, { value: item }));
        var ret = (0, Component_24.jc)("span", {
            children: ch
        });
        return ret;
    }
    async function test() {
        var j = (0, Component_24.jc)(MainComponent, { items: data });
        var pan = (0, Component_24.createComponent)(j);
        return pan;
    }
});
define("jassijs/ui/Select", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/DataComponent", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs/ext/jquerylib", "jquery.choosen"], function (require, exports, Registry_94, Component_25, DataComponent_5, Property_28, Classes_28) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Select = void 0;
    exports.test = test;
    jassijs.includeCSSFile("chosen.css");
    let Select = class Select extends DataComponent_5.DataComponent {
        constructor(properties = undefined) {
            super(properties);
            // super.init('<select class="Select"><option value=""></option></select>');
            var _this = this;
            if (properties !== undefined && properties.multiple === true)
                document.getElementById(this._id)["multiple"] = true;
            var single = false;
            if (properties !== undefined && properties.allowDeselect !== undefined)
                single = properties.allowDeselect;
            var placeholder = "Select...";
            if (properties !== undefined && properties.placeholder !== undefined)
                placeholder = properties.placeholder;
            $('#' + this._id).chosen({
                width: "100px",
                placeholder_text_single: placeholder,
                allow_single_deselect: single
            });
            var domSelect = this.dom;
            if (this.domWrapper.children.length == 1) { //mobile device
                this.dom = domSelect;
            }
            else
                this.dom = this.domWrapper.children[1];
            domSelect.setAttribute("id", "");
            this.dom.setAttribute("id", this._id);
            $(domSelect).chosen().change(function (e) {
                if (_this._select !== undefined)
                    _this._select.value = _this.value;
                //e.data = _this.value;
                //handler(e);
            });
            // this.layout();
        }
        render() {
            //  super.init('<select class="Select"><option value=""></option></select>');
            return React.createElement("select", Object.assign(Object.assign({ ref: this.refs.select }, this.props.domProperties), { className: "Select" }), React.createElement("option", {
                value: ""
            }));
        }
        config(config) {
            //width first else it doesnt work ?bug 
            if (config === null || config === void 0 ? void 0 : config.width)
                this.width = config.width;
            super.config(config);
            return this;
        }
        refresh() {
            $(this.refs.select.dom).trigger("chosen:updated");
        }
        onchange(handler) {
            var _this = this;
            $(this.refs.select.dom).chosen().change(function (e) {
                e.data = _this.value;
                handler(e);
            });
        }
        set selectComponent(_component) {
            this._select = _component;
        }
        get selectComponent() {
            return this._select; //$(this.dom).text();
        }
        set display(value) {
            this._display = value;
            if (this.items !== undefined)
                this.items = this.items;
        }
        get display() {
            return this._display;
        }
        set items(value) {
            this._items = value;
            this.options = { undefined: undefined };
            if (this.refs.select.dom === undefined)
                return;
            //TODO console.log("dekt.memoryleak");
            /* slow
            while (this.domSelect.firstChild) {
                        $(this.domSelect.firstChild).remove();
    
            }
                    this.domSelect.appendChild($('<option value=""></option>')[0]);
                    for (var x = 0;x < value.length;x++) {
                var ob = value[x];
                    var val = undefined;
                    if (typeof (this.display) === "function")
                    val = this.display(ob);
                    else if (this.display !== undefined)
                    val = ob[this.display];
                    else
                    val = ob;
                    this.options[x.toString()] = ob;
                    var it = $('<option value="' + x + '">' + val + '</option>')[0];
                    this.domSelect.appendChild(it);
            }
                    this.refresh();
                    */
            var html = '<option value=""></option>';
            if (value !== undefined) {
                for (var x = 0; x < value.length; x++) {
                    var ob = value[x];
                    var val = undefined;
                    if (typeof (this.display) === "function")
                        val = this.display(ob);
                    else if (this.display !== undefined)
                        val = ob[this.display];
                    else
                        val = ob;
                    this.options[x.toString()] = ob;
                    html += '<option value="' + x + '">' + val + '</option>';
                    //this.domSelect.appendChild(it);
                }
            }
            this.refs.select.dom.innerHTML = html;
            this.refresh();
        }
        get items() {
            return this._items;
        }
        set width(value) {
            var s = value + "px";
            $(this.refs.select.dom).chosen({ width: s }); //.trigger("chosen:updated");
            var _this = this;
            //  setTimeout(() => $(_this.refs.select.dom).chosen({ width: s }), 1000);
            //  $(this.refs.select.dom).chosen().trigger("chosen:updated");
        }
        set value(sel) {
            var found = false;
            if ($(this.refs.select.dom).chosen().prop("multiple")) {
                var keys = [];
                if (sel) {
                    sel.forEach((se) => {
                        for (var key in this.options) {
                            if (this.options[key] === se) {
                                keys.push(key);
                                found = true;
                                break;
                            }
                        }
                        $(this.refs.select.dom).val(keys).trigger("chosen:updated");
                    });
                }
            }
            else {
                for (var key in this.options) {
                    if (this.options[key] === sel) {
                        $(this.refs.select.dom).val(key).trigger("chosen:updated");
                        found = true;
                        break;
                    }
                }
            }
            if (!found)
                $(this.refs.select.dom).val("").trigger("chosen:updated");
            // refresh()
        }
        get value() {
            if (this.options === undefined)
                return undefined;
            var val = $(this.refs.select.dom).chosen().val();
            if ($(this.refs.select.dom).chosen().prop("multiple")) {
                var opts = [];
                val.forEach((e) => {
                    if (e !== "") //placeholder for empty
                        opts.push(this.options[e]);
                });
                return opts;
            }
            return this.options[val];
        }
        /**
         * @member {string|number} - the width of the component
                            * e.g. 50 or "100%"
                            */
        /* set width(value){ //the Code
                                super.width=value;
         
              
              if(this.domWrapper.children.length>1){
                 var val=$(this.domWrapper).css("width");
                            $(this.domWrapper.children[1]).css("width",val);
              }
         }*/
        /**
         * binds a component to a databinder
         * @param {Databinder} databinder - the databinder to bind
                            * @param {string} property - the property to bind
    
                            bind(databinder,property){
                                this._databinder=databinder;
                            databinder.add(property,this,"onselect");
                            databinder.checkAutocommit(this);
        } */
        destroy() {
            //	$(this.domSelect).chosen('destroy');
            $(this.refs.select.dom).chosen("destroy"); //.search_choices;
            $('#' + this._id).remove(); //.search_choices;
            $(this.refs.select.dom).remove();
            $(this.dom).remove();
            // this.refs.select.dom = undefined;
            super.destroy();
        }
    };
    exports.Select = Select;
    __decorate([
        (0, Property_28.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Select.prototype, "onchange", null);
    __decorate([
        (0, Property_28.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Select.prototype, "display", null);
    exports.Select = Select = __decorate([
        (0, Component_25.$UIComponent)({ fullPath: "common/Select", icon: "mdi mdi-form-dropdown" }),
        (0, Registry_94.$Class)("jassijs.ui.Select"),
        (0, Property_28.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.SelectProperties" }),
        __metadata("design:paramtypes", [Object])
    ], Select);
    async function test() {
        var Panel = Classes_28.classes.getClass("jassijs.ui.Panel");
        var Button = Classes_28.classes.getClass("jassijs.ui.Button");
        var me = {};
        var pan = new Panel();
        var bt = new Button();
        bt.text = "wer";
        bt.onclick(function (event) {
            //	bt.text=me.sel.value.vorname;	
            me.sel.value = me.sel.items[1];
        });
        bt.height = 15;
        pan.width = 500;
        /* me.sel = new Select({
                                "multiple": false,
                            "placeholder": "Hallo",
                            "allowDeselect": false
          });
                            me.sel.display = "nachname";
    
                            me.sel.items=[{name:"Achim",nachname:"<b>Wenzel</b>"},
                            {name:"Anne",nachname:"Meier"}];
    
    
                            me.sel.width = 195;
                            me.sel.height = 25;
                            me.sel.onchange(function(event) {
                                alert(event.data.nachname);
          }); */
        var items = [{ name: "Achim", nachname: "<b>Wenzel</b>" },
            { name: "Anne", nachname: "Meier" }];
        var c = (0, Component_25.jc)(Select, {
            items: items,
            display: "nachname",
            value: items[0],
            width: 500
        });
        me.sel = (0, Component_25.createComponent)(c);
        //	$('#'+sel._id).data("placeholder","Select2...").chosen({width: "200px"});
        pan.add(me.sel);
        var sel2 = new Select({
            items: ["jj", "pp"],
            width: 24
        });
        pan.add(sel2);
        pan.add(bt);
        return pan;
    }
});
define("jassijs/ui/SettingsDialog", ["require", "exports", "jassijs/ui/HTMLPanel", "jassijs/ui/Select", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/PropertyEditor", "jassijs/ui/Button", "jassijs/remote/Settings", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Registry", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, HTMLPanel_3, Select_7, Registry_95, Panel_19, PropertyEditor_6, Button_12, Settings_3, ComponentDescriptor_6, Registry_96, Actions_6, Windows_4) {
    "use strict";
    var SettingsDialog_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SettingsDialog = void 0;
    exports.test = test;
    Registry_96 = __importDefault(Registry_96);
    Windows_4 = __importDefault(Windows_4);
    let SettingsObject = class SettingsObject {
        static customComponentDescriptor() {
            var allcl = Registry_96.default.getData("$SettingsDescriptor");
            var ret = new ComponentDescriptor_6.ComponentDescriptor();
            ret.fields = [];
            for (var x = 0; x < allcl.length; x++) {
                var cl = allcl[x].oclass;
                var all = ComponentDescriptor_6.ComponentDescriptor.describe(cl, true);
                all.fields.forEach((f) => {
                    ret.fields.push(f);
                });
            }
            return ret;
        }
    };
    SettingsObject = __decorate([
        (0, Registry_95.$Class)("jassijs.ui.SettingsObject")
    ], SettingsObject);
    let SettingsDialog = SettingsDialog_1 = class SettingsDialog extends Panel_19.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        static async show() {
            Windows_4.default.add(new SettingsDialog_1(), "Settings");
        }
        async update() {
            await Settings_3.Settings.load();
            await Registry_96.default.loadAllFilesForService("$SettingsDescriptor");
            var testob = new SettingsObject();
            var scope = "browser";
            if (this.me.Scope.value === "current user") {
                Object.assign(testob, Settings_3.Settings.getAll("user"));
            }
            else if (this.me.Scope.value === "all users") {
                Object.assign(testob, Settings_3.Settings.getAll("allusers"));
            }
            else {
                Object.assign(testob, Settings_3.Settings.getAll("browser"));
            }
            this.me.propertyeditor.value = testob;
        }
        async save() {
            var ob = this.me.propertyeditor.value;
            var scope = "browser";
            if (this.me.Scope.value === "current user") {
                await Settings_3.Settings.saveAll(ob, "user", true);
            }
            else if (this.me.Scope.value === "all users") {
                await Settings_3.Settings.saveAll(ob, "allusers", true);
            }
            else {
                await Settings_3.Settings.saveAll(ob, "browser", true);
            }
        }
        layout(me) {
            var _this = this;
            me.propertyeditor = new PropertyEditor_6.PropertyEditor();
            me.Save = new Button_12.Button();
            me.Scope = new Select_7.Select();
            me.htmlpanel1 = new HTMLPanel_3.HTMLPanel();
            me.Scope.items = ["this browser", "current user", "all users"];
            me.Scope.value = "current user";
            this.add(me.htmlpanel1);
            this.add(me.Scope);
            this.add(me.propertyeditor);
            this.add(me.Save);
            me.propertyeditor.width = "400";
            me.propertyeditor.height = 145;
            me.Save.text = "Save";
            me.Save.onclick(function (event) {
                _this.save();
            });
            me.Save.icon = "mdi mdi-content-save-outline";
            me.Scope.width = "150";
            me.Scope.onchange(function (event) {
                _this.update();
            });
            this.update();
            me.htmlpanel1.value = "Settings for  ";
            me.htmlpanel1.width = "80";
            me.htmlpanel1.style = {
                fontSize: "small",
                fontWeight: "bold"
            };
        }
    };
    exports.SettingsDialog = SettingsDialog;
    __decorate([
        (0, Actions_6.$Action)({
            name: "Settings",
            icon: "mdi mdi-settings-helper",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SettingsDialog, "show", null);
    exports.SettingsDialog = SettingsDialog = SettingsDialog_1 = __decorate([
        (0, Actions_6.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_95.$Class)("jassijs.ui.SettingsDialog"),
        __metadata("design:paramtypes", [])
    ], SettingsDialog);
    async function test() {
        var ret = new SettingsDialog();
        // var allcl=registry.getData("$SettingsDescriptor");
        //var all=ComponentDescriptor.describe(cl,true);
        return ret;
    }
});
define("jassijs/ui/State", ["require", "exports", "jassijs/ui/StateBinder", "jassijs/ui/Component"], function (require, exports, StateBinder_1, Component_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.State = void 0;
    exports.resolveState = resolveState;
    exports.foreach = foreach;
    exports.createStates = createStates;
    exports.createState = createState;
    exports.test = test;
    var teset = new StateBinder_1.StateDatabinder();
    class StateProp {
    }
    //window.timecount=0;
    function _resolve(ob, props, path, recurseCount) {
        if (recurseCount > 3)
            return;
        for (var key in props) {
            var val = props[key];
            if (val instanceof State) {
                props[key] = val.current;
                val._comps_.push({ ob: ob, proppath: [...path, key] });
                continue;
            }
            if (typeof val === "object" && Array.isArray(val) === false && ((val === null || val === void 0 ? void 0 : val._rerenderMe) === undefined)) {
                _resolve(ob, val, [...path, key], recurseCount++);
            }
        }
    }
    function resolveState(ob, config) {
        var test = new Date().getTime();
        _resolve(ob, config, [], 0);
        //window.timecount=window.timecount+new Date().getTime()-test;
    }
    function foreach(stateWithArray, func) {
        var retState = createState();
        //update retState on stateWithArray is changing
        var updateOB = {
            set value(ob) {
                var ret = [];
                var arr = stateWithArray.current;
                if (arr !== undefined) {
                    for (var x = 0; x < arr.length; x++) {
                        // if (ret === undefined)
                        //   ret = [];
                        var comp = func(arr[x]);
                        if ((ob === null || ob === void 0 ? void 0 : ob.initial) !== true) {
                            comp = (0, Component_26.createComponent)(comp);
                        }
                        ret.push(comp);
                    }
                }
                retState.current = ret;
            }
        };
        updateOB.value = { initial: true }; //fill state
        stateWithArray._observe_(updateOB, "value");
        return retState;
    }
    function createStates(initialValues = undefined, propertyname = undefined) {
        var data = new State(initialValues); // { _used: [], _data: initialValues };
        data._$propertyname_ = propertyname;
        return new Proxy(data, {
            get(target, key) {
                if (key === "_onconfig")
                    return target._onconfig;
                if (target[key] === undefined && key !== "data" && key !== "_comps_" && key != "_used" && key !== "bind" && key !== "current") {
                    var newstate = createStates(data.current !== undefined ? data.current[key] : undefined, key);
                    target[key] = newstate;
                    target._observe_(newstate, "_$setparentobject");
                    if (target._used.indexOf(key) === -1)
                        target._used.push(key);
                }
                return target[key];
            },
            set(target, key, value) {
                if (key === "_$setparentobject") {
                    var propname = data._$propertyname_;
                    target.current = value[propname];
                }
                else if (key === "_onconfig")
                    target._onconfig = value;
                else if (key === "current") {
                    target.current = value;
                }
                else
                    throw "not implemented " + key;
                return true;
            }
        });
    }
    class State {
        constructor(data = undefined) {
            //self: any = this;
            this._comps_ = [];
            this._used = [];
            this._$isState$_ = true;
            this.bind = createBoundProperty(this);
            this.data = data;
        }
        _observe_(control, property, atype = undefined) {
            this._comps_.push({ ob: control, proppath: [property] });
        }
        get current() {
            return this.data;
        }
        set current(data) {
            var _a;
            if (this.data === data)
                return;
            this.data = data;
            for (var x = 0; x < this._comps_.length; x++) {
                var c = this._comps_[x];
                var newVal = {};
                var cur = newVal;
                for (var y = 0; y < c.proppath.length; y++) {
                    var prop = c.proppath[y];
                    cur[prop] = {};
                    if (y == c.proppath.length - 1) {
                        cur[prop] = data;
                    }
                    else
                        cur = cur[prop];
                }
                if (((_a = c.ob) === null || _a === void 0 ? void 0 : _a._$isState$_) !== true && typeof c.ob.config === "function")
                    c.ob.config(newVal);
                else
                    c.ob[c.proppath[0]] = data;
            }
        }
    }
    exports.State = State;
    function createState(val = undefined) {
        var ret = new State();
        ret.current = val;
        return ret;
    }
    function createBoundProperty(state = undefined, parent = undefined, propertyname = "this") {
        var data = {
            _databinder: (parent === undefined ? new StateBinder_1.StateDatabinder() : parent._databinder),
            _propertyname: propertyname,
            $fromForm() { return this._databinder.fromForm(); },
            $toForm() { return this._databinder.toForm(); }
        };
        if (state)
            data._databinder.connectedState = state;
        var ret = new Proxy(data, {
            get(target, key) {
                if (key === "_observe_" || key === "_$isState$_")
                    return undefined;
                if (target[key] === undefined) {
                    var pname = key;
                    if (target._propertyname !== "this") {
                        pname = target._propertyname + "." + key;
                    }
                    target[key] = createBoundProperty(undefined, ret, pname);
                }
                return target[key];
            },
            set(target, key, value) {
                if (key === "_propertyname") {
                    target[key] = value;
                    return true;
                }
                throw "not implemented " + key;
            }
        });
        if (state !== undefined) {
            state._observe_(data._databinder, "value", "property");
        }
        return ret;
    }
    var j = {};
    var invoices = [
        {
            title: "R1",
            customer: {
                id: 1,
                name: "Meier"
            },
            positions: [{ id: 1, text: "P1" }, { id: 2, text: "P2" }]
        },
        {
            title: "R2",
            customer: {
                id: 2,
                name: "Lehmann"
            },
            positions: [{ id: 3, text: "P3" }, { id: 4, text: "P4" }]
        },
        {
            title: "R3",
            customer: {
                id: 3,
                name: "Schulze"
            },
            positions: [{ id: 6, text: "P6" }, { id: 6, text: "P6" }]
        },
    ];
    var inv = {
        invoice: invoices[1],
        invoices: invoices
    };
    function test() {
        var k = createStates(undefined);
        var ll = k.invoice.customer.current;
        var vname = k.invoice.customer.name;
        var ll2 = k.invoice.customer.name.current;
        k.invoice.current = invoices[0];
        var hhl = k.invoice.customer;
        ll = k.invoice.customer.name.current;
    }
});
define("jassijs/ui/StateBinder", ["require", "exports", "jassijs/remote/Database", "jassijs/ui/Notify"], function (require, exports, Database_2, Notify_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PropertyAccessor = exports.StateDatabinder = void 0;
    class StateDatabinder {
        constructor() {
            // super.init('<span class="InvisibleComponent"></span>');
            /** @member {[jassijs.ui.Component]} components - all binded components*/
            this.components = [];
            /** @member {[string]} properties - all binded properties*/
            this._properties = [];
            /** @member [[function]] getter - all functions to get the component value*/
            this._getter = [];
            /** @member [[function]] setter - all functions to set the component value*/
            this._setter = [];
            /** @member {[function]} onChange - changeHandler for all components used for autocommit*/
            this._onChange = [];
            /** @member {[function]} autocommit - autocommitHandler for all components*/
            this._autocommit = [];
        }
        /**
        * binds the component to the property of the userObject
        * @param {string} property - the name of the property to bind
        * @param {jassijs.ui.Component} component - the component to bind
        * @param {string} [onChange] - functionname to register the  changehandler - if missing no autocommit is possible
        * @param {function} [getter] - function to get the value of the component - if missing .value is used
        * @param {function} [setter] - function to put the value of the component - if missing .value is used
        */
        add(property, component, onChange = undefined, getter = undefined, setter = undefined) {
            var _a;
            this.remove(component);
            this.components.push(component);
            this._properties.push(property);
            if (getter === undefined) {
                this._getter.push(function (component) {
                    return component["value"];
                });
            }
            else
                this._getter.push(getter);
            if (setter === undefined) {
                this._setter.push(function (component, value) {
                    component["value"] = value;
                });
            }
            else
                this._setter.push(setter);
            if (onChange === undefined) {
                this._onChange.push(component["onChange"]);
            }
            else
                this._onChange.push(onChange);
            var ob = (_a = this.connectedState) === null || _a === void 0 ? void 0 : _a.current;
            if (ob !== undefined) {
                var acc = new PropertyAccessor();
                acc.userObject = ob;
                let setter = this._setter[this._setter.length - 1];
                acc.setProperty(setter, component, property, undefined);
                acc.finalizeSetProperty();
            }
            let _this = this;
            if (component[this._onChange[this._onChange.length - 1]]) {
                component[this._onChange[this._onChange.length - 1]]((event) => {
                    _this.componentChanged(component, property, event);
                });
            }
            // this._autocommit.push(undefined);
        }
        componentChanged(component, property, event) {
            let pos = this.components.indexOf(component);
            if (component.autocommit) {
                this._fromForm(pos);
            }
            var val = this._getter[pos](this.components[pos]); //this._getter[pos](this.components[pos]);
            //synchronize the new object to all the other components
            for (let x = 0; x < this.components.length; x++) {
                var test = this._getter[x](this.components[x]);
                if (this._properties[x] === property && test != val && this.components[x] !== component) {
                    this._setter[x](this.components[x], val);
                }
            }
            //set nested Properties
            for (let x = 0; x < this.components.length; x++) {
                if (this._properties[x].startsWith(property + ".") && this.components[x] !== component) {
                    this._toForm(x);
                }
            }
            if (property === "this" && this.connectedState) {
                this.connectedState.current = val;
            }
        }
        remove(component) {
            for (var x = 0; x < this.components.length; x++) {
                if (this.components[x] === component) {
                    this.components.splice(x, 1);
                    this._properties.splice(x, 1);
                    this._getter.splice(x, 1);
                    this._setter.splice(x, 1);
                    this._onChange.splice(x, 1);
                    this._autocommit.splice(x, 1);
                }
            }
        }
        /**
         * defines getter and setter and connect this to the databinder
         * @param {object} object - the object where we define the property
         * @param {string} propertyname - the name of the property
         **/
        definePropertyFor(object, propertyname) {
            var _this = this;
            Object.defineProperty(object, propertyname, {
                get: function () { return _this.value; },
                set: function (newValue) {
                    if (newValue !== undefined && newValue.then !== undefined) {
                        newValue.then(function (ob2) {
                            _this.value = ob2;
                        });
                    }
                    else
                        _this.value = newValue;
                },
                enumerable: true,
                configurable: true
            });
        }
        /**
         * @member {object} value - the binded userobject - call toForm on set
         */
        get value() {
            var _a;
            // this.fromForm();
            return (_a = this.connectedState) === null || _a === void 0 ? void 0 : _a.current;
        }
        set value(obj) {
            var _this = this;
            if (obj !== undefined && (obj === null || obj === void 0 ? void 0 : obj.then) !== undefined) {
                obj.then(function (ob2) {
                    _this.toForm(ob2);
                });
            }
            else
                this.toForm(obj);
        }
        async doValidation(ob) {
            var allErr = [];
            if (ob.validate) {
                for (var c = 0; c < this.components.length; c++) {
                    var comp = this.components[c];
                    comp.__dom.classList.remove("invalid");
                }
                var validationerrors = await ob.validate();
                for (var x = 0; x < validationerrors.length; x++) {
                    var err = validationerrors[x];
                    for (var c = 0; c < this.components.length; c++) {
                        var comp = this.components[c];
                        var prop = this._properties[c];
                        if (err.property === prop) {
                            //@ts-ignore
                            $(comp.__dom).notify(err.message, { position: 'bottom left', className: 'error' });
                            comp.__dom.classList.add("invalid");
                            //(<any>comp.__dom).setCustomValidity(err.message);
                            //(<any>comp.__dom).reportValidity();
                            allErr.push(err.message);
                            break;
                        }
                    }
                }
                if (validationerrors.length > 0) {
                    (0, Notify_3.notify)(allErr.join("\r\n"), "error", { position: "bottom right" });
                    return false;
                }
            }
            return true;
        }
        _toForm(x, setter = undefined) {
            var fin = false;
            var ob = this.connectedState.current;
            if (setter === undefined) {
                setter = new PropertyAccessor();
                setter.userObject = ob;
                fin = true;
            }
            var comp = this.components[x];
            var prop = this._properties[x];
            var sfunc = this._setter[x];
            var sget = this._getter[x];
            var oldValue = sget(comp);
            if (prop === "this") {
                if (oldValue !== ob) {
                    sfunc(comp, ob);
                }
            }
            else {
                if (ob === undefined) {
                    if (oldValue !== undefined)
                        sfunc(comp, undefined);
                }
                else {
                    setter.setProperty(sfunc, comp, prop, oldValue);
                }
            }
            if (fin) {
                setter.finalizeSetProperty();
            }
        }
        /**
         * binds the object to all added components
         * @param {object} obj - the object to bind
         */
        toForm(obj) {
            this.connectedState.current = obj;
            var setter = new PropertyAccessor();
            setter.userObject = this.connectedState.current;
            for (var x = 0; x < this.components.length; x++) {
                this._toForm(x, setter);
            }
            setter.finalizeSetProperty();
        }
        async validateObject() {
        }
        /**
         * gets the objectproperties from all added components
         * @return {object}
         */
        async fromForm() {
            this.rollbackObject = {};
            var ob = this.connectedState.current;
            if (ob === undefined)
                return undefined;
            for (var x = 0; x < this.components.length; x++) {
                this._fromForm(x);
            }
            if (!await this.doValidation(ob)) { //rollback
                for (var x = 0; x < this.components.length; x++) {
                    var prop = this._properties[x];
                    new PropertyAccessor().setNestedProperty(ob, prop, this.rollbackObject[prop]);
                }
                return undefined;
            }
            return ob;
        }
        /**
         * get objectproperty
         * @param {number} x - the numer of the component
         */
        _fromForm(x) {
            if (this.rollbackObject === undefined)
                this.rollbackObject = {};
            var comp = this.components[x];
            var prop = this._properties[x];
            var sfunc = this._getter[x];
            var ob = this.connectedState.current;
            var test = sfunc(comp);
            if (test !== undefined) {
                if (prop === "this") {
                    var val = test;
                    if (this.value !== test)
                        this.value = test;
                }
                else {
                    // if (comp["converter"] !== undefined) {
                    //     test = comp["converter"].stringToObject(test);
                    // }
                    this.rollbackObject[prop] = new PropertyAccessor().getNestedProperty(ob, prop);
                    new PropertyAccessor().setNestedProperty(ob, prop, test);
                }
            }
        }
        /**
         * register the autocommit handler if needed
         * @param {jassijs.ui.DataComponent} component
         */
        /* checkAutocommit(component){
             if(component.autocommit!==true)
                 return;
             var pos=this.components.indexOf(component);
             if(this._autocommit[pos]!==undefined)
                 return;
             var onchange=this._onChange[pos];
             if(onchange===undefined)
                 return;
             var _this=this;
             this._autocommit[pos]=function(){
                 pos=_this.components.indexOf(component);
                 _this._fromForm(pos);
             };
             component[onchange](this._autocommit[pos]);
         }*/
        destroy() {
            this.components = [];
            this._properties = [];
            this._getter = [];
            this._setter = [];
            this._onChange = [];
            this._autocommit = [];
            this.connectedState = undefined;
        }
    }
    exports.StateDatabinder = StateDatabinder;
    class PropertyAccessor {
        constructor() {
            this.relationsToResolve = [];
            this.todo = [];
        }
        getNestedProperty(obj, property) {
            if (obj === undefined || obj === null)
                return undefined;
            var path = property.split(".");
            var ret = obj[path[0]];
            if (ret === undefined)
                return undefined;
            if (path.length === 1)
                return ret;
            else {
                path.splice(0, 1);
                return this.getNestedProperty(ret, path.join("."));
            }
        }
        setNestedProperty(obj, property, value) {
            var path = property.split(".");
            path.splice(path.length - 1, 1);
            var ob = obj;
            if (path.length > 0)
                ob = this.getNestedProperty(ob, path.join("."));
            ob[property.split(".")[property.split(".").length - 1]] = value;
        }
        /**
         * check if relation must be resolved and queue it
         */
        testRelation(def, property, propertypath, setter, comp) {
            var rel = def === null || def === void 0 ? void 0 : def.getRelation(property);
            var ret = false;
            if (this.getNestedProperty(this.userObject, propertypath) !== undefined)
                return ret; //the relation is resolved
            if (rel) {
                //the relation should be resolved on finalize
                if (this.relationsToResolve.indexOf(propertypath) === -1)
                    this.relationsToResolve.push(propertypath);
                ret = true;
            }
            if (setter && (propertypath.indexOf(".") > -1 || ret))
                this.todo.push(() => setter(comp, this.getNestedProperty(this.userObject, propertypath)));
            return ret;
        }
        /**
         * set a nested property and load the db relation if needed
         */
        setProperty(setter, comp, property, oldValue) {
            var _a;
            var _this = this;
            var propValue = this.getNestedProperty(this.userObject, property);
            if (oldValue !== propValue) {
                setter(comp, propValue);
            }
            let path = property.split(".");
            let currenttype = this.userObject.constructor;
            var def = Database_2.db.getMetadata(currenttype);
            if (def !== undefined) {
                let propertypath = "";
                for (let x = 0; x < path.length; x++) {
                    propertypath += (propertypath === "" ? "" : ".") + path[x];
                    this.testRelation(def, path[x], propertypath, path.length - 1 === x ? setter : undefined, comp);
                    currenttype = (_a = def.getRelation(path[x])) === null || _a === void 0 ? void 0 : _a.oclass;
                    if (currenttype === undefined)
                        break;
                    def = Database_2.db.getMetadata(currenttype);
                }
            }
        }
        async finalizeSetProperty() {
            if (this.relationsToResolve.length > 0) {
                await this.userObject.constructor.findOne({ onlyColumns: [], id: this.userObject.id, relations: this.relationsToResolve });
            }
            this.todo.forEach((func) => {
                func();
            });
        }
    }
    exports.PropertyAccessor = PropertyAccessor;
});
// return CodeEditor.constructor;
define("jassijs/ui/Style", ["require", "exports", "jassijs/ui/InvisibleComponent", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, InvisibleComponent_2, Component_27, Registry_97, Property_29) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Style = void 0;
    exports.test = test;
    exports.test2 = test2;
    let Style = class Style extends InvisibleComponent_2.InvisibleComponent {
        constructor(props = {}) {
            super(props);
        }
        render() {
            return React.createElement("span", { className: "InvisibleComponent" });
        }
        componentDidMount() {
        }
        config(config) {
            super.config(config);
            return this;
        }
        get styleid() {
            return "jassistyle" + this._id;
        }
        /**
        * sets CSS Properties
        */
        set style(properties) {
            //never!super.css(properties,removeOldProperties);
            var style = document.getElementById(this.styleid);
            if (!document.getElementById(this.styleid)) {
                style = Component_27.Component.createHTMLElement('<style id=' + this.styleid + '></style>');
                document.head.appendChild(style);
            }
            var prop = {};
            var sstyle = "\t." + this.styleid + "{\n";
            for (let key in properties) {
                var newKey = key.replaceAll("_", "-");
                prop[newKey] = properties[key];
                sstyle = sstyle + "\t\t" + newKey + ":" + properties[key] + ";\n";
            }
            sstyle = sstyle + "\t}\n";
            style.innerHTML = sstyle;
        }
        destroy() {
            super.destroy();
            if (document.getElementById(this.styleid)) {
                document.head.removeChild(document.getElementById(this.styleid));
            }
        }
    };
    exports.Style = Style;
    __decorate([
        (0, Property_29.$Property)({ type: "json", componentType: "jassijs.ui.CSSProperties" }),
        __metadata("design:type", typeof (_a = typeof React !== "undefined" && React.CSSProperties) === "function" ? _a : Object),
        __metadata("design:paramtypes", [typeof (_b = typeof React !== "undefined" && React.CSSProperties) === "function" ? _b : Object])
    ], Style.prototype, "style", null);
    exports.Style = Style = __decorate([
        (0, Component_27.$UIComponent)({ fullPath: "common/Style", icon: "mdi mdi-virus" }),
        (0, Registry_97.$Class)("jassijs.ui.Style")
        /**
         * on ore mors Style can be assigned to component
         * the style is appended to the head
         **/
        ,
        __metadata("design:paramtypes", [Object])
    ], Style);
    function test() {
        var css = {
            filter: "drop-shadow(16px 16px 20px blue)"
        };
        jassijs.includeCSS("mytest2id", {
            ".Panel": css,
            ".jinlinecomponent": {
                color: "red"
            }
        });
        setTimeout(() => {
            jassijs.includeCSS("mytest2id", undefined); //remove
        }, 400);
        // includeCSS("mytest2id",undefined);
    }
    function test2() {
        var st = new Style();
        st.style = {
            color: "red"
        };
        st.destroy();
    }
});
define("jassijs/ui/Table", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/DataComponent", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/ui/Textbox", "jassijs/remote/Classes", "tabulator-tables", "jassijs/ui/converters/DateTimeConverter", "jassijs/util/Numberformatter", "jassijs/ui/State"], function (require, exports, Registry_98, DataComponent_6, Property_30, Component_28, Textbox_19, Classes_29, tabulator_tables_1, DateTimeConverter_1, Numberformatter_2, State_4) {
    "use strict";
    var _a, _b, _c, _d;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Table = void 0;
    exports.test = test;
    Registry_98 = __importStar(Registry_98);
    let TableEditorProperties = class TableEditorProperties {
    };
    __decorate([
        (0, Property_30.$Property)({ default: undefined }),
        __metadata("design:type", Number)
    ], TableEditorProperties.prototype, "paginationSize", void 0);
    __decorate([
        (0, Property_30.$Property)({ default: true }),
        __metadata("design:type", Boolean)
    ], TableEditorProperties.prototype, "headerSort", void 0);
    __decorate([
        (0, Property_30.$Property)({ default: "fitDataStretch", chooseFrom: ['fitData', 'fitColumns', 'fitDataFill', 'fitDataStretch'] }),
        __metadata("design:type", String)
    ], TableEditorProperties.prototype, "layout", void 0);
    __decorate([
        (0, Property_30.$Property)({ default: undefined }),
        __metadata("design:type", Function)
    ], TableEditorProperties.prototype, "dataTreeChildFunction", void 0);
    __decorate([
        (0, Property_30.$Property)({ default: false }),
        __metadata("design:type", Boolean)
    ], TableEditorProperties.prototype, "movableColumns", void 0);
    TableEditorProperties = __decorate([
        (0, Registry_98.$Class)("jassijs.ui.TableEditorProperties")
    ], TableEditorProperties);
    let Table = class Table extends DataComponent_6.DataComponent {
        constructor(properties) {
            super(properties);
            this._lastLazySort = undefined;
            this._lastLazySearch = undefined;
            this._lazyDataHasChanged = undefined;
            var _this = this;
            //this.options = properties;
            this._selectHandler = [];
        }
        config(config) {
            if (this.table === undefined) {
                if ((config === null || config === void 0 ? void 0 : config.options) === undefined) {
                    this.options = {}; //this is not called if not options are set
                }
                if (config === null || config === void 0 ? void 0 : config.items) {
                    this.options = {
                        items: config.items
                    };
                    delete config.items; //or set async
                }
            }
            super.config(config);
            return this;
        }
        render() {
            return React.createElement("div", { className: "Table" });
        }
        rerender() {
            this.table.destroy();
            if (this._databinderItems !== undefined) {
                this._databinderItems.remove(this);
                this._databinderItems = undefined;
            }
            this.table = undefined;
            // super.rerender();
            this.options = this._lastOptions;
        }
        set options(properties) {
            var _this = this;
            this._lastOptions = properties;
            if (this.table) {
                var lastSel = this.value;
                var lastItems = this.items;
                this.table.destroy();
                this.table = undefined;
            }
            if (properties === undefined)
                properties = {};
            if (properties.autoColumns === undefined && properties.columns === undefined)
                properties.autoColumns = true;
            if (properties.autoColumnsDefinitions === undefined) {
                properties.autoColumnsDefinitions = this.defaultAutoColumnDefinitions.bind(this);
            }
            if (properties.dataTreeChildFunction !== undefined) {
                //@ts-ignore
                properties.dataTreeChildField = "__treechilds";
                this.dataTreeChildFunction = properties.dataTreeChildFunction;
                delete properties.dataTreeChildFunction;
            }
            if (properties.dataTreeChildField !== undefined)
                properties.dataTree = true;
            //if (properties.paginationSize !== undefined && properties.pagination == undefined)
            //   properties.pagination = "local";
            // if(properties.layoutColumnsOnNewData===undefined)
            //     properties.layoutColumnsOnNewData=true;
            if (properties.selectable === undefined)
                properties.selectable = 1;
            // if (properties.autoResize === undefined)//error ResizeObserver loop limit exceeded 
            //    properties.autoResize = false;
            if (properties.layout === undefined)
                properties.layout = "fitDataStretch"; //"fitDataFill";////"fitColumns";
            if (properties.lazyLoad) {
                this._lazyLoadOption = properties.lazyLoad;
                properties.ajaxURL = 'does/not/matter';
                properties.ajaxRequestFunc = _this.lazyLoadFunc.bind(this); // (p1,p2,p3)=>_this.progressiveLoad(p1,p2,p3);
                properties.progressiveLoad = 'scroll';
            }
            if (properties.items) {
                properties.data = this._setItemsIntern(properties.items, false);
                delete properties.items;
                ;
            }
            this.table = new tabulator_tables_1.Tabulator("[id='" + this._id + "']", properties);
            this.table.on("rowClick", (e, e2) => { _this._onselect(e, e2); });
            this.table.on("cellContext", (e, e2) => { _this._oncontext(e, e2); });
            this.table.on("dataTreeRowExpanded", (e, e2) => { _this.onTreeExpanded(e, e2); });
            if (properties.lazyLoad) {
                //updates the tabledata if user sort with headerclick
                this.table.on("headerClick", function (e, c) {
                    setTimeout(() => {
                        _this.update();
                    }, 1000);
                });
                if (this._searchbox) {
                    this._searchbox.onchange(() => {
                        setTimeout(() => {
                            _this.update();
                        }, 50);
                    });
                }
                delete properties.lazyLoad;
            }
            if (lastItems) {
                this.items = lastItems;
            }
            if (lastSel) {
                this.value = lastSel;
            }
        }
        get options() {
            return this._lastOptions;
        }
        /**
         * create a SQL-Querry for a search in all visible columns
         */
        sqlForLazySearch() {
            if (this._searchbox.value === undefined || this._searchbox.value === "") {
                return undefined;
            }
            var fields = Registry_98.default.getMemberData("design:type")[this._lazyLoadOption.classname];
            var columns = this.table.getColumns(false);
            var wheres = [];
            for (var x = 0; x < columns.length; x++) {
                var found = fields[columns[x].getField()];
                //           where:`UPPER(CAST(ID AS TEXT)) LIKE :mftext`,
                //        whereParams:{mftext:"%24%"}
                if (found) { //
                    if (found[0][0] === String) {
                        wheres.push("UPPER(\"" + columns[x].getField() + "\") LIKE :mftext");
                    }
                    else if (found[0][0] === Number || found[0][0] === Date)
                        wheres.push("UPPER(CAST(\"" + columns[x].getField() + "\" AS TEXT)) LIKE :mftext");
                }
            }
            if (wheres.length > 0) {
                return wheres.join(" or ");
            }
        }
        onlazyloaded(func) {
            this.addEvent("lazyloaded", func);
        }
        /**
         * loads lazy data from _progressiveLoadFunc
         */
        lazyLoadFunc(url, param, param2) {
            //var data=await this._progressiveLoadFunc();
            //return data;
            // debugger;
            var _this = this;
            return new Promise((resolve) => {
                Classes_29.classes.loadClass(_this._lazyLoadOption.classname).then((cl) => {
                    var newSort = undefined;
                    var tt = _this.table.getSorters();
                    if (tt) {
                        newSort = {};
                        for (var x = 0; x < tt.length; x++) {
                            newSort[tt[x].field] = tt[x].dir.toUpperCase();
                        }
                    }
                    var pageSize = _this._lazyLoadOption.pageSize;
                    if (pageSize === undefined)
                        pageSize = 200;
                    var opt = {
                        skip: (param2.page - 1) * pageSize,
                        take: pageSize,
                        order: newSort
                    };
                    var where = _this.sqlForLazySearch();
                    if (where) {
                        opt.where = where;
                        opt.whereParams = { mftext: "%" + this._searchbox.value.toUpperCase() + "%" };
                        //   console.log(where);
                    }
                    if (JSON.stringify(newSort) !== this._lastLazySort || this._searchbox.value !== this._lastLazySearch || this._lazyDataHasChanged) {
                        pageSize = (1 + param2.page) * pageSize;
                        opt.take = pageSize;
                        opt.skip = 0;
                        this._lastLazySort = JSON.stringify(newSort);
                        this._lastLazySearch = this._searchbox.value;
                        this._lazyDataHasChanged = undefined;
                    }
                    cl[_this._lazyLoadOption.loadFunc](opt).then((data) => {
                        var ret = {
                            "last_page": data.length < pageSize ? 0 : (param2.page + 1),
                            data: data
                        };
                        console.log(param2.page * pageSize);
                        resolve(ret);
                        _this.callEvent("lazyloaded", data, opt, param, param2);
                    });
                });
            });
        }
        defaultAutoColumnDefinitions(definitions) {
            var _this = this;
            var ret = [];
            for (let x = 0; x < definitions.length; x++) {
                var data;
                if (definitions[x].sorter === "array")
                    continue;
                if (_this.items && _this.items.length > 0) {
                    data = _this.items[0][definitions[x].field];
                    if (typeof data === "function")
                        continue;
                    if (data instanceof Date && definitions[x].formatter === undefined) {
                        definitions[x].formatter = function (cell, formatterParams, onRendered) {
                            return cell.getValue() === undefined ? "" : cell.getValue().toLocaleDateString(); //return the contents of the cell;
                        };
                    }
                }
                ret.push(definitions[x]);
            }
            return ret;
        }
        getChildsFromTreeFunction(data) {
            var childs;
            if (typeof this.dataTreeChildFunction === "function") {
                childs = this.dataTreeChildFunction(data);
            }
            else {
                childs = data[this.dataTreeChildFunction];
                if (typeof childs === "function")
                    childs = childs.bind(data)();
            }
            return childs;
        }
        populateTreeData(data) {
            var childs = this.getChildsFromTreeFunction(data);
            if (childs && childs.length > 0) {
                Object.defineProperty(data, "__treechilds", {
                    configurable: true,
                    get: function () {
                        return childs;
                    }
                });
                for (var x = 0; x < childs.length; x++) {
                    var nchilds = this.getChildsFromTreeFunction(childs[x]);
                    if (nchilds && nchilds.length > 0) {
                        Object.defineProperty(childs[x], "__treechilds", {
                            configurable: true,
                            get: function () {
                                return ["dummy"];
                            }
                        });
                    }
                }
            }
        }
        onTreeExpanded(row, level) {
            if (this.dataTreeChildFunction) {
                var data = row.getData();
                let childs = data.__treechilds; //this.getChildsFromTreeFunction(data)   //row.getData()["childs"];
                for (let f = 0; f < childs.length; f++) {
                    this.populateTreeData(childs[f]);
                }
                row.update(data);
            }
        }
        async update() {
            if (this._lazyLoadOption) {
                this._lazyDataHasChanged = true;
                var sel = this.value;
                await this.table.replaceData("/data.php");
                this.value = sel;
            }
            else {
                await this.table.updateData(this.items);
            }
        }
        _oncontext(event, row) {
            if (this.contextMenu !== undefined) {
                this.contextMenu.value = [row.getData()];
                event.data = [row.getData()];
                this.contextMenu.show(event);
            }
        }
        _onselect(event, row) {
            var selection = [];
            var aids = undefined;
            if (this.selectComponent === undefined && this._eventHandler["select"] === undefined)
                return;
            event.data = row.getData();
            if (this._select !== undefined)
                this._select.value = event.data;
            this.callEvent("select", event);
        }
        onchange(handler) {
            this.addEvent("select", handler);
        }
        get showSearchbox() {
            return this._searchbox !== undefined;
        }
        set showSearchbox(enable) {
            let _this = this;
            if (!enable) {
                if (this._searchbox !== undefined) {
                    this._searchbox.destroy();
                    delete this._searchbox;
                }
                if (this.height === "calc(100% - 28px)")
                    this.height = "100%";
            }
            else {
                this._searchbox = new Textbox_19.Textbox();
                this._searchbox.placeholder = "search table...";
                this._searchbox.onkeydown(() => {
                    window.setTimeout(() => {
                        var text = _this._searchbox.value;
                        _this.table.setFilter(data => {
                            for (var key in data) {
                                if (data[key] !== undefined && data[key] !== null && data[key].toString().toLowerCase().indexOf(text) >= 0) {
                                    return true;
                                }
                            }
                            return false;
                        });
                    }, 100);
                });
                if (this._lazyLoadOption) {
                    this._searchbox.onchange(() => {
                        setTimeout(() => {
                            _this.table.replaceData("/data.php");
                        }, 50);
                    });
                }
                this.domWrapper.prepend(this._searchbox.domWrapper);
                if (this.height === "calc(100% - 7px)") ///correct height
                    this.height = "100%";
            }
        }
        set selectComponent(_component) {
            this._select = _component;
        }
        get selectComponent() {
            return this._select;
        }
        _setItemsIntern(value, updateData = true) {
            if (value && this.dataTreeChildFunction) { //populate __treechilds
                for (let x = 0; x < value.length; x++) {
                    this.populateTreeData(value[x]);
                }
            }
            this._items = value;
            if (value !== undefined && updateData) {
                // try{
                // this.table.setData(value);
                var _this = this;
                // }catch{
                setTimeout(() => { _this.table.setData(value); }, 100);
                //}
            }
            return value;
        }
        set items(value) {
            this._setItemsIntern(value);
        }
        get items() {
            return this._items;
        }
        async updateOrInsertItem(item) {
            var ret = await this.updateItem(item);
            if (ret === undefined)
                return await this.insertItem(item);
        }
        async updateItem(item) {
            var rows = this.table.getRows();
            for (var x = 0; x < rows.length; x++) {
                if (rows[x].getData() === item) {
                    //@ts-ignore
                    await rows[x].update(item);
                    return rows[x];
                }
            }
            return undefined;
        }
        async insertItem(item) {
            var ret = await this.table.addRow(item);
            ret.select();
            ret.scrollTo();
            return ret;
        }
        async removeItem(item) {
            var rows = this.table.getRows();
            for (var x = 0; x < rows.length; x++) {
                if (rows[x].getData() === item) {
                    //@ts-ignore
                    try {
                        rows[x + 1].select();
                        rows[x + 1].scrollTo();
                    }
                    catch (_a) { }
                    await rows[x].delete();
                    return;
                }
            }
        }
        /**
         * @member {object} sel - the selected object
         */
        set value(sel) {
            //@ts-ignore
            this.table.deselectRow(this.table.getSelectedRows());
            var rows = this.table.getRows();
            for (var x = 0; x < rows.length; x++) {
                if (rows[x].getData() === sel) {
                    //@ts-ignore
                    this.table.selectRow(rows[x]);
                    this.table.scrollToRow(rows[x]);
                }
            }
            return;
            debugger;
            if (this.items === undefined)
                return;
            var pos = this.items.indexOf(sel);
            //@ts-ignore
            this.table.deselectRow(this.table.getSelectedRows());
            if (pos === -1)
                return;
        }
        get value() {
            var ret = this.table.getSelectedRows();
            if (ret.length === 0) {
                return undefined;
            }
            return ret[0].getData();
        }
        /**
        * @member {string|number} - the height of the component
        * e.g. 50 or "100%"
        */
        set height(value) {
            if (value === "100%") {
                if (this.showSearchbox)
                    value = "calc(100% - 28px)";
                else
                    value = "calc(100% - 7px)";
            }
            super.height = value;
        }
        get height() {
            return super.height;
        }
        set width(value) {
            if (value === "100%")
                value = "calc(100% - 5px)";
            super.width = value;
        }
        get width() {
            return super.width;
        }
        /**
         * Searches records in the grid
         * @param {string} field - name of the search field
         * @param {string} value - value of the search field
         * @param {boolean} [doSelect] - if true the first entry is selected
         */
        search(field, value, doSelect) {
            //custom filter function
            function matchAny(data, filterParams) {
                var _a;
                //data - the data for the row being filtered
                //filterParams - params object passed to the filter
                var match = false;
                for (var key in data) {
                    if (filterParams.value === undefined || filterParams.value === "" || ((_a = data[key]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase().indexOf(filterParams.value.toLowerCase())) > -1) {
                        match = true;
                    }
                }
                return match;
            }
            //set filter to custom function
            this.table.setFilter(matchAny, { value: value });
            if (doSelect) {
                //@ts-ignore
                this.table.deselectRow(this.table.getSelectedRows());
                //@ts-ignore
                this.table.selectRow(this.table.getRowFromPosition(0, true));
            }
        }
        destroy() {
            // this.tree = undefined;
            if (this._searchbox !== undefined)
                this._searchbox.destroy();
            if (this._databinderItems !== undefined) {
                this._databinderItems.remove(this);
                this._databinderItems = undefined;
            }
            super.destroy();
        }
        set columns(value) {
            this.table.setColumns(value);
            this.update();
        }
        get columns() {
            return this.table.getColumnDefinitions();
        }
        get bindItems() {
            return this._bindItems;
        }
        set bindItems(databinder) {
            if (!Array.isArray(databinder)) {
                this.bindItems2 = databinder;
                return;
            }
            this._databinderItems = databinder[0];
            var _this = this;
            this._databinderItems.add(databinder[1], this, undefined, (tab) => {
                return tab.items;
            }, (tab, val) => {
                tab.items = val;
            });
            //databinderItems.add(property, this, "onchange");
            //databinder.checkAutocommit(this);
        }
        set bindItems2(bound) {
            this._bindItems = bound;
            this._databinderItems = bound._databinder;
            var _this = this;
            this._databinderItems.add(bound._propertyname, this, undefined, (tab) => {
                return tab.items;
            }, (tab, val) => {
                tab.items = val;
            });
            //databinderItems.add(property, this, "onchange");
            //databinder.checkAutocommit(this);
        }
    };
    exports.Table = Table;
    __decorate([
        (0, Property_30.$Property)({ type: "json", componentType: "jassijs.ui.TableEditorProperties" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "options", null);
    __decorate([
        (0, Property_30.$Property)({ default: "function(event?: JQueryEventObject, data?:Tabulator.RowComponent){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Table.prototype, "onchange", null);
    __decorate([
        (0, Property_30.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Table.prototype, "showSearchbox", null);
    __decorate([
        (0, Property_30.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "height", null);
    __decorate([
        (0, Property_30.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "width", null);
    __decorate([
        (0, Property_30.$Property)({ type: "databinder" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "bindItems", null);
    __decorate([
        (0, Property_30.$Property)({ type: "databinder" }),
        __metadata("design:type", typeof (_c = typeof State_4.BoundProperty !== "undefined" && State_4.BoundProperty) === "function" ? _c : Object),
        __metadata("design:paramtypes", [typeof (_d = typeof State_4.BoundProperty !== "undefined" && State_4.BoundProperty) === "function" ? _d : Object])
    ], Table.prototype, "bindItems2", null);
    exports.Table = Table = __decorate([
        (0, Component_28.$UIComponent)({ fullPath: "common/Table", icon: "mdi mdi-grid" }),
        (0, Registry_98.$Class)("jassijs.ui.Table"),
        (0, Property_30.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.TableEditorProperties" }),
        __metadata("design:paramtypes", [Object])
    ], Table);
    tabulator_tables_1.Tabulator.extendModule("format", "formatters", {
        datetimeformat: function (cell, formatterParams) {
            var val = cell.getValue();
            if (val === undefined)
                return "";
            if ((formatterParams === null || formatterParams === void 0 ? void 0 : formatterParams.datefimeformat) === undefined) {
                return DateTimeConverter_1.DateTimeConverter.toLocalString(val, "DATE_SHORT");
            }
            else {
                return DateTimeConverter_1.DateTimeConverter.toLocalString(val, formatterParams === null || formatterParams === void 0 ? void 0 : formatterParams.datefimeformat);
            }
        },
        numberformat: function (cell, formatterParams) {
            var val = cell.getValue();
            if (val === undefined)
                return "";
            if ((formatterParams === null || formatterParams === void 0 ? void 0 : formatterParams.numberformat) === undefined) {
                return val.toLocaleString();
            }
            else {
                return Numberformatter_2.Numberformatter.format(formatterParams === null || formatterParams === void 0 ? void 0 : formatterParams.numberformat, val);
            }
        }
    });
    tabulator_tables_1.Tabulator.extendModule("edit", "editors", {
        datetimeformat: function (cell, onRendered, success, cancel, editorParams) {
            var _a, _b;
            var f = (_b = (_a = cell.getColumn().getDefinition()) === null || _a === void 0 ? void 0 : _a.formatterParams) === null || _b === void 0 ? void 0 : _b.datefimeformat;
            var editor = document.createElement("input");
            var format = "yyyy-MM-dd";
            if (f === undefined || f.startsWith("DATE_")) {
                format = "yyyy-MM-dd";
                editor.setAttribute("type", "date");
            }
            else if (f.startsWith("DATE_")) {
                format = "yyyy-MM-dd";
            }
            else if (f.startsWith("TIME_") && f.indexOf("SECONDS") > 0) {
                editor.setAttribute("type", "time");
                editor.setAttribute("step", "2");
                format = "HH:mm:ss";
            }
            else if (f.startsWith("TIME_") && f.indexOf("SECONDS") === -1) {
                editor.setAttribute("type", "time");
                format = "HH:mm";
            }
            else if (f.startsWith("DATETIME_") && f.indexOf("SECONDS") > 0) {
                editor.setAttribute("type", "datetime-local");
                editor.setAttribute("step", "2");
                format = "yyyy-MM-dd\'T\'HH:mm";
            }
            else if (f.startsWith("DATETIME_") && f.indexOf("SECONDS") === -1) {
                editor.setAttribute("type", "datetime-local");
                format = "yyyy-MM-dd\'T\'HH:mm:ss";
            }
            //create and style input
            editor.style.padding = "3px";
            editor.style.width = "100%";
            editor.style.boxSizing = "border-box";
            //Set value of editor to the current value of the cell
            editor.value = DateTimeConverter_1.DateTimeConverter.toFormat(cell.getValue(), format);
            //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
            onRendered(function () {
                editor.focus();
                // editor.style.css = "100%";
            });
            editor.addEventListener("keydown", (ev) => {
                if (ev.keyCode == 13) {
                    successFunc();
                }
                if (ev.keyCode == 27) {
                    cancel();
                }
            });
            //when the value has been set, trigger the cell to update
            function successFunc() {
                var str = editor.value;
                if (format.split(":").length > editor.value.split(":").length)
                    str = str + ":00";
                var ret = DateTimeConverter_1.DateTimeConverter.fromFormat(str, format);
                console.log(ret);
                success(ret);
            }
            // editor.addEventListener("change", successFunc);
            editor.addEventListener("blur", successFunc);
            //return the editor element
            return editor;
        },
        numberformat: function (cell, onRendered, success, cancel, editorParams) {
            var editor = document.createElement("input");
            var format = "yyyy-MM-dd";
            // editor.setAttribute("type", "number");
            //create and style input
            editor.style.padding = "3px";
            editor.style.width = "100%";
            editor.style.boxSizing = "border-box";
            //Set value of editor to the current value of the cell
            editor.value = Numberformatter_2.Numberformatter.numberToString(cell.getValue());
            //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
            onRendered(function () {
                editor.focus();
                //  editor.style.css = "100%";
            });
            editor.addEventListener("keydown", (ev) => {
                if (ev.keyCode == 13) {
                    successFunc();
                }
                if (ev.keyCode == 27) {
                    cancel();
                }
            });
            //when the value has been set, trigger the cell to update
            function successFunc() {
                var str = editor.value;
                var ret = Numberformatter_2.Numberformatter.stringToNumber(str);
                success(ret);
            }
            // editor.addEventListener("change", successFunc);
            editor.addEventListener("blur", successFunc);
            //return the editor element
            return editor;
        }
    });
    async function test() {
        var tabledata = [
            { id: 1, name: "Oli Bob", age: 12.5, col: "red", dob: new Date() },
            { id: 2, name: "Mary May", age: 1.555, col: "blue", dob: new Date() },
            { id: 3, name: "Christine Lobowski", age: 42, col: "green", dob: new Date() },
            { id: 4, name: "Brendon Philips", age: 12, col: "orange", dob: new Date() },
            { id: 5, name: "Margret Marmajuke", age: 99, col: "yellow", dob: new Date() },
        ];
        /* var tab=new Table();
         setTimeout(()=>{
         tab.items=tabledata;
     
         },100);*/
        var tab = new Table({
            options: {
                height: 300,
                headerSort: true,
                items: tabledata,
                columns: [
                    { field: "id", title: "id" },
                    { field: "age", title: "age", formatter: "numberformat", formatterParams: { numberformat: "#.##0,00" }, editor: "numberformat" },
                    { field: "name", title: "name", formatter: "buttonTick" },
                    { field: "dob", title: "dob", formatter: "datetimeformat", formatterParams: { datefimeformat: "DATETIME_SHORT" }, editor: "datetimeformat" }
                ]
            }
        });
        tab.showSearchbox = true;
        tab.on("dblclick", () => {
            //  alert(tab.value);
        });
        tab.width = 417;
        tab.height = 324;
        return tab;
    }
});
define("jassijs/ui/Textarea", ["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/Textbox"], function (require, exports, Component_29, Registry_99, Property_31, Textbox_20) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Textarea = void 0;
    let Textarea = class Textarea extends Textbox_20.Textbox {
        constructor(props = {}) {
            super(props);
        }
        render() {
            var _this = this;
            return React.createElement("textarea", { className: "Textarea" });
        }
        componentDidMount() {
        }
    };
    exports.Textarea = Textarea;
    exports.Textarea = Textarea = __decorate([
        (0, Component_29.$UIComponent)({ fullPath: "common/Textarea", icon: "mdi mdi-text-box-outline" }),
        (0, Registry_99.$Class)("jassijs.ui.Textarea"),
        (0, Property_31.$Property)({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [typeof (_a = typeof Textbox_20.TextboxProperties !== "undefined" && Textbox_20.TextboxProperties) === "function" ? _a : Object])
    ], Textarea);
});
define("jassijs/ui/Textbox", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/DataComponent", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Registry_100, Component_30, DataComponent_7, DefaultConverter_4, Registry_101, Property_32) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Textbox = void 0;
    exports.test = test;
    Registry_101 = __importDefault(Registry_101);
    let Textbox = class Textbox extends DataComponent_7.DataComponent {
        constructor(props = {}) {
            super(props);
            this._value = "";
            this._isFocused = false;
            var _this = this;
            this.onblur((e) => _this.blurcalled(e));
            this.onfocus((e) => _this.focuscalled(e));
            // this.converter = undefined;
        }
        render() {
            return React.createElement("input", Object.assign(Object.assign({}, this.props.domProperties), { type: "text" }));
        }
        get dom() {
            return super.dom;
        }
        set dom(value) {
            super.dom = value;
        }
        set disabled(value) {
            this.dom.disabled = true;
        }
        get disabled() {
            return this.dom.disabled;
        }
        set readOnly(value) {
            this.dom.readOnly = value;
        }
        get converter() {
            return this._converter;
        }
        set converter(value) {
            this._converter = value;
            if (value)
                this.converter.component = this;
            this.value = this.value;
        }
        get readOnly() {
            return this.dom.readOnly;
        }
        focuscalled(evt) {
            this._isFocused = true;
            if (this.converter) {
                this.dom.value = this.converter.objectToString(this._value);
            }
        }
        blurcalled(evt) {
            this._isFocused = false;
            this.updateValue();
            if (this.converter) {
                this.dom.value = this.converter.objectToFormatedString(this.value);
            }
        }
        set value(value) {
            this._value = value;
            var v = value;
            if (this.converter)
                v = this.converter.objectToFormatedString(v);
            if (this.dom)
                this.dom.value = v === undefined ? "" : v;
        }
        get value() {
            //  if (this._isFocused)
            this.updateValue();
            // else if (this.converter) {
            //   return  this.converter.stringToObject(this.dom.value);
            //} 
            return this._value;
        }
        updateValue() {
            var _a;
            if (this.converter) {
                this.value = this.converter.stringToObject(this.dom.value);
            }
            else {
                this.value = (_a = this.dom) === null || _a === void 0 ? void 0 : _a.value;
            }
        }
        onclick(handler) {
            return this.on("click", handler);
        }
        onchange(handler) {
            return this.on("change", handler);
        }
        onkeydown(handler) {
            return this.on("keydown", handler);
        }
        oninput(handler) {
            return this.on("input", handler);
        }
        /*
         * <input list="browsers" name="myBrowser" />
    <datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    </datalist>+>
         */
        set placeholder(text) {
            this.dom.placeholder = text;
        }
        get placeholder() {
            return this.dom.placeholder;
        }
        set autocompleterDisplay(value) {
            this._autocompleterDisplay = value;
            if (this.autocompleter !== undefined) {
                this.autocompleter = this.autocompleter; //force rendering
            }
        }
        get autocompleterDisplay() {
            return this._autocompleterDisplay;
        }
        fillCompletionList(values) {
            var h;
            var list = this.dom.getAttribute("list");
            var html = "";
            var comp = document.getElementById(list);
            comp._values = values;
            //comp.empty();
            for (var x = 0; x < values.length; x++) {
                var val = values[x];
                if (typeof (this.autocompleterDisplay) === "function") {
                    val = this.autocompleterDisplay(val);
                }
                else if (this.autocompleterDisplay !== undefined) {
                    val = val[this.autocompleterDisplay];
                }
                html += '<option value="' + val + '">';
                //comp.append('<option value="'+val+'">');
            }
            comp.innerHTML = html;
        }
        set autocompleter(value) {
            var list = this.dom.getAttribute("list");
            var _this = this;
            if (!list && typeof (value) === "function") {
                this.on("mouseover", (ob) => {
                    if (_this._autocompleter.children.length === 0) {
                        var values = value();
                        _this.fillCompletionList(values);
                    }
                });
            }
            if (list === undefined || list === null) {
                list = "j" + Registry_101.default.nextID();
                this._autocompleter = Component_30.Component.createHTMLElement('<datalist id="' + list + '"/>');
                this.domWrapper.appendChild(this._autocompleter);
                this.dom.setAttribute("list", list);
            }
            if (typeof (value) === "function") {
            }
            else {
                this.fillCompletionList(value);
            }
        }
        get autocompleter() {
            var list = this.dom.list;
            if (list === undefined)
                return undefined;
            var comp = list; //$(list)[0];
            if (comp === undefined)
                return undefined;
            return comp["_values"];
        }
        /**
         * focus the textbox
         */
        focus() {
            this.dom.focus();
        }
        destroy() {
            if (this._autocompleter)
                this._autocompleter.remove();
            super.destroy();
        }
    };
    exports.Textbox = Textbox;
    __decorate([
        (0, Property_32.$Property)({ type: "classselector", service: "$Converter" }),
        __metadata("design:type", typeof (_a = typeof DefaultConverter_4.DefaultConverter !== "undefined" && DefaultConverter_4.DefaultConverter) === "function" ? _a : Object),
        __metadata("design:paramtypes", [typeof (_b = typeof DefaultConverter_4.DefaultConverter !== "undefined" && DefaultConverter_4.DefaultConverter) === "function" ? _b : Object])
    ], Textbox.prototype, "converter", null);
    __decorate([
        (0, Property_32.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Textbox.prototype, "value", null);
    __decorate([
        (0, Property_32.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onclick", null);
    __decorate([
        (0, Property_32.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onchange", null);
    __decorate([
        (0, Property_32.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onkeydown", null);
    __decorate([
        (0, Property_32.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "oninput", null);
    __decorate([
        (0, Property_32.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Textbox.prototype, "placeholder", null);
    exports.Textbox = Textbox = __decorate([
        (0, Component_30.$UIComponent)({ fullPath: "common/Textbox", icon: "mdi mdi-form-textbox" }),
        (0, Registry_100.$Class)("jassijs.ui.Textbox"),
        __metadata("design:paramtypes", [Object])
    ], Textbox);
    function test() {
        var ret = new Textbox();
        ret.autocompleter = ["Hallo", "Du"];
        ret.value = 10.1;
        //ret.autocompleter=()=>[];
        return ret;
    }
});
// return CodeEditor.constructor;
define("jassijs/ui/TinymcePanel", ["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/DataComponent"], function (require, exports, Component_31, Registry_102, Property_33, DataComponent_8) {
    "use strict";
    var TinymcePanel_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TinymcePanel = void 0;
    exports.test = test;
    var bugtinymce = undefined;
    //@$UIComponent({ fullPath: "common/HTMLPanel", icon: "mdi mdi-cloud-tags" /*, initialize: { value: "text" } */ })
    let TinymcePanel = TinymcePanel_1 = class TinymcePanel extends DataComponent_8.DataComponent {
        /*[
            'undo redo | bold italic underline | fontsizeselect', //fontselect
            'forecolor backcolor | numlist bullist outdent indent'
        ];*/
        constructor(properties = {}) {
            super();
            this.toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
            this.inited = false;
            this.customToolbarButtons = {};
            //$(this.domWrapper).removeClass("jcontainer");
            //  super.init($('<div class="HTMLPanel"></div>')[0]);
            this._designMode = false;
            this.newlineafter = false;
            // $(this.__dom).css("min-width", "10px");
        }
        render() {
            return (0, Component_31.jc)("div", {
                className: "HTMLPanel mce-content-body", tabIndex: -1, children: [
                    (0, Component_31.jc)("div", { className: "HTMLPanelContent" })
                ]
            });
        }
        config(config) {
            super.config(config);
            return this;
        }
        get newlineafter() {
            return this.dom.style.display === "inline-block";
        }
        set newlineafter(value) {
            this.dom.style.display = value ? "" : "inline-block";
            this.domWrapper.style.display = value ? "" : "inline-block";
            this.dom.children[0].style.display = value ? "" : "inline-block";
        }
        compileTemplate(template) {
            return new Function('obj', 'with(obj){ return \'' +
                template.replace(/\n/g, '\\n').split(/{{([^{}]+)}}/g).map(function (expression, i) {
                    return i % 2 ? ('\'+(' + expression.trim() + ')+\'') : expression;
                }).join('') +
                '\'; }');
        }
        get template() {
            return this._template;
        }
        set template(value) {
            this._template = value;
            this.value = this.value; //reformat value
        }
        /**
         * @member {string} code - htmlcode of the component
         **/
        set value(code) {
            var scode = code;
            this._value = code;
            if (this.template) {
                if (this._value === undefined)
                    scode = "";
                else {
                    try {
                        scode = this.compileTemplate(this.template)(code);
                    }
                    catch (err) {
                        scode = err.message;
                    }
                }
            }
            var el = this.dom.children[0];
            if (el === undefined) {
                el = document.createTextNode(scode);
                this.dom.appendChild(el);
            }
            else
                el.innerHTML = scode;
        }
        get value() {
            return this._value;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable, action.componentDesignerSetDesignMode.componentDesigner);
            }
            super.extensionCalled(action);
        }
        initIfNeeded(tinymce, config) {
            let _this = this;
            if (!this.inited) {
                let sic = _this.value;
                _this._tcm = tinymce.init(config); //changes the text to <br> if empty - why?
                if (sic === "" && _this.value !== sic)
                    _this.value = "";
                this.inited = true;
                // edi.show();
                // edi.hide();
            }
        }
        focusLost() {
            var _a, _b;
            var editor = this.editor;
            var _this = this;
            var text = (_b = (_a = _this.dom) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.innerHTML;
            if (text === '<br data-mce-bogus="1">')
                text = "";
            editor._propertyEditor.setPropertyInCode("value", '"' + text.replaceAll('"', "'") + '"', true);
            if (_this._designMode === false)
                return;
            //editor.editDialog(false);
            if (!document.getElementById(editor.id))
                return;
            editor._draganddropper.enableDraggable(true);
        }
        _initTinymce(editor) {
            var _this = this;
            var tinymce = window["tinymce"]; //oder tinymcelib.default
            console.log("run config");
            var config = {
                //	                valid_elements: 'strong,em,span[style],a[href],ul,ol,li',
                //  valid_styles: {
                //    '*': 'font-size,font-family,color,text-decoration,text-align'
                //  },
                menubar: false,
                //statusbar: false,
                selector: '#' + _this._id,
                fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
                inline: true,
                fixed_toolbar_container: '#' + this.editor.inlineEditorPanel._id,
                setup: function (ed) {
                    ed.on('change', function (e) {
                    });
                    ed.on('focus', function (e) {
                        //   $(ed.getContainer()).css("display", "inline");
                        //   debugger;
                    });
                    ed.on('blur', function (e) {
                        _this.focusLost();
                        //editor.editDialog(true);
                    });
                    ed.on('NodeChange', function (e) {
                        // $(ed.getContainer()).find("svg").attr("width", "16").attr("height", "16").attr("viewbox", "0 0 24 24");
                        //$(ed.getContainer()).css("white-space","nowrap");
                    });
                    for (var name in _this.customToolbarButtons) {
                        var bt = _this.customToolbarButtons[name];
                        var button;
                        var test = ed.ui.registry.addButton(name, {
                            text: bt.title,
                            onAction: function (e, f) {
                                var bt2 = this;
                                bt.action(e);
                            },
                            onpostrender: function () {
                                button = this;
                            }
                        });
                    }
                }
            };
            var mytoolbarwidth = 240;
            console.log("fix Component width in tiny");
            // if (Number(_this.editor.inlineEditorPanel._parent.width.replace("px", "")) - Number(_this.editor.inlineEditorPanel._parent._components[0].width.replace("px", "")) < mytoolbarwidth) {
            //     delete config.fixed_toolbar_container;
            // }
            if (_this["toolbar"])
                config["toolbar"] = _this["toolbar"];
            for (var name in _this.customToolbarButtons) {
                config["toolbar"][config["toolbar"].length - 1] =
                    config["toolbar"][config["toolbar"].length - 1] + " | " + name;
            }
            this.on("mouseup", (e) => {
                if (_this._designMode === false)
                    return;
                editor._draganddropper.enableDraggable(false);
                let edi = tinymce.editors[_this._id];
                if (edi.getContainer())
                    edi.getContainer().style.display = "flex";
                //$(this.domWrapper).draggable('disable');
            });
            //_this.value=sic;
            /*    $(_this.dom).doubletap(function (e) {
                    if (_this._designMode === false)
                        return;
                    _this.initIfNeeded(tinymce, config);
                    editor._draganddropper.enableDraggable(false);
                });*/
            _this.on('blur', function () {
                _this.focusLost();
            });
            _this.on('focus', function () {
                _this.initIfNeeded(tinymce, config);
                var el = document.getElementById(_this.editor.inlineEditorPanel._id).querySelector(".tox-tinymce-inline");
                if (el)
                    el.style.display = "none";
                if (TinymcePanel_1.oldeditor) {
                    TinymcePanel_1.oldeditor.getContainer().style.display = "none";
                }
            });
        }
        /**
         * activates or deactivates designmode
         * @param {boolean} enable - true if activate designMode
         * @param {jassijs.ui.ComponentDesigner} editor - editor instance
         */
        _setDesignMode(enable, editor) {
            this.editor = editor;
            var _this = this;
            this._designMode = enable;
            if (enable) {
                // console.log("activate tiny");
                requirejs(["jassijs/ext/tinymce"], function (tinymcelib) {
                    _this._initTinymce(editor);
                });
            }
        }
        destroy() {
            super.destroy();
        }
    };
    exports.TinymcePanel = TinymcePanel;
    __decorate([
        (0, Property_33.$Property)({ description: "line break after element", default: false }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Object])
    ], TinymcePanel.prototype, "newlineafter", null);
    __decorate([
        (0, Property_33.$Property)({ decription: 'e.g. component.value=new Person();component.template:"{{name}}"' }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], TinymcePanel.prototype, "template", null);
    __decorate([
        (0, Property_33.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], TinymcePanel.prototype, "value", null);
    exports.TinymcePanel = TinymcePanel = TinymcePanel_1 = __decorate([
        (0, Registry_102.$Class)("jassijs.ui.TinymcePanel"),
        __metadata("design:paramtypes", [Object])
    ], TinymcePanel);
    function test() {
        var ret = new TinymcePanel();
        ret.customToolbarButtons.Table = {
            title: "Table",
            action: () => { alert(8); }
        };
        ret.value = "<span style='font-size: 12px;' data-mce-style='font-size: 12px;'>dsf<span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>g<strong>sdfgsd</strong>fgsdfg</span></span><br><strong><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>sdfgsdgsdf</span>gfdsg</strong>";
        ret.height = 400;
        ret.width = 400;
        return ret;
    }
});
define("jassijs/ui/Tree", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ext/jquerylib", "jassijs/ext/fancytree"], function (require, exports, Registry_103, Component_32, Registry_104, Property_34) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tree = void 0;
    exports.test = test;
    Registry_104 = __importDefault(Registry_104);
    /*declare global {
        interface JQuery {
            fancytree: any;
        }
    }*/
    let TreeEditorPropertiesMulti = class TreeEditorPropertiesMulti {
    };
    __decorate([
        (0, Property_34.$Property)({ default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" }),
        __metadata("design:type", String)
    ], TreeEditorPropertiesMulti.prototype, "mode", void 0);
    TreeEditorPropertiesMulti = __decorate([
        (0, Registry_103.$Class)("jassijs.ui.TreeEditorPropertiesMulti")
    ], TreeEditorPropertiesMulti);
    let TreeEditorProperties = class TreeEditorProperties {
    };
    __decorate([
        (0, Property_34.$Property)({ default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" }),
        __metadata("design:type", Number)
    ], TreeEditorProperties.prototype, "selectMode", void 0);
    __decorate([
        (0, Property_34.$Property)({ default: false, description: "display a checkbox before the node" }),
        __metadata("design:type", Boolean)
    ], TreeEditorProperties.prototype, "checkbox", void 0);
    __decorate([
        (0, Property_34.$Property)({ type: "json", componentType: "jassijs.ui.TreeEditorPropertiesMulti" }),
        __metadata("design:type", TreeEditorPropertiesMulti)
    ], TreeEditorProperties.prototype, "multi", void 0);
    TreeEditorProperties = __decorate([
        (0, Registry_103.$Class)("jassijs.ui.TreeEditorProperties")
    ], TreeEditorProperties);
    let Tree = class Tree extends Component_32.Component {
        constructor(props = {}) {
            super(props);
            this._itemToKey = new Map();
            if ((props === null || props === void 0 ? void 0 : props.options) === undefined)
                this.options = props === null || props === void 0 ? void 0 : props.options;
        }
        render() {
            var _this = this;
            return React.createElement("div", Object.assign(Object.assign({}, this.props.domProperties), { className: "Tree" }));
        }
        componentDidMount() {
        }
        config(config) {
            super.config(config);
            return this;
        }
        set options(options) {
            var _this = this;
            this._lastOptions = options;
            if (this.tree) {
                var lastSel = this.value;
                var lastItems = this.items;
                //this.table.destroy();
                //this.table = undefined;
            }
            var _this = this;
            if (options === undefined) {
                options = {};
            }
            //Default Options
            if (options.extensions === undefined) {
                options.extensions = ["filter", "multi", "dnd"];
            }
            if (options.extensions.indexOf("filter") === -1)
                options.extensions.push("filter");
            if (options.extensions.indexOf("multi") === -1)
                options.extensions.push("multi");
            if (options.extensions.indexOf("dnd") === -1)
                options.extensions.push("dnd");
            if (options.filter === undefined)
                options.filter = {};
            if (options.filter.mode === undefined)
                options.filter.mode = "hide";
            if (options.filter.autoExpand === undefined)
                options.filter.autoExpand = true;
            var beforeExpand = options.beforeExpand;
            var select = options.select;
            var click = options.click;
            options.source = [{ title: 'Folder in home folder', key: 'fA100', folder: true, lazy: true }];
            options.icon = false; //we have an own
            options.lazyLoad = function (event, data) {
                TreeNode.loadChilds(event, data);
            };
            options.select = function (event, data) {
                _this._onselect(event, data);
                if (select !== undefined)
                    select(event, data);
            };
            options.click = function (event, data) {
                _this._onclick(event, data);
                if (click !== undefined)
                    return click(event, data);
                return true;
            };
            $("#" + this._id).fancytree(options);
            //@ts-ignore
            this.tree = $.ui.fancytree.getTree("#" + this._id);
            $("#" + this._id).find("ul").css("height", "calc(100% - 8px)");
            $("#" + this._id).find("ul").css("weight", "calc(100% - 8px)");
            $("#" + this._id).find("ul").css("overflow", "auto");
            if (lastItems) {
                this.items = lastItems;
            }
            if (lastSel) {
                this.value = lastSel;
            }
        }
        get options() {
            return this._lastOptions;
        }
        /**
        * @member - get the property for the display of the item or an function to get the display from an item
        */
        set propStyle(value) {
            this._propStyle = value;
        }
        get propStyle() {
            return this._propStyle;
        }
        set propDisplay(value) {
            this._propDisplay = value;
        }
        get propDisplay() {
            return this._propDisplay;
        }
        set propIcon(icon) {
            this._propIcon = icon;
        }
        get propIcon() {
            return this._propIcon;
        }
        set propChilds(child) {
            this._propChilds = child;
        }
        get propChilds() {
            return this._propChilds;
        }
        onselect(handler) {
            this.addEvent("select", handler);
        }
        onclick(handler) {
            this.addEvent("click", handler);
        }
        filter(text) {
            // this.expandAll();
            this._readAllNodesIfNeeded().then(() => {
                if (text === "") {
                    this.tree.clearFilter();
                    // this.expandAll();
                }
                else {
                    //@ts-ignore
                    this.tree.filterNodes(text, { leavesOnly: true });
                }
            });
        }
        /**
        * get title from node
        */
        getTitleFromItem(item) {
            var ret = "";
            if (typeof (this.propDisplay) === "function") {
                ret = this.propDisplay(item);
            }
            else
                ret = item[this.propDisplay];
            return ret;
        }
        /**
       * get title from node
       */
        getStyleFromItem(item) {
            var ret;
            if (item === undefined)
                return undefined;
            if (typeof (this.propStyle) === "function") {
                ret = this.propStyle(item);
            }
            else
                ret = item[this.propStyle];
            return ret;
        }
        /**
        * get icon from node
        */
        getIconFromItem(item) {
            if (item === undefined)
                return undefined;
            if (this.propIcon !== undefined) {
                if (typeof (this.propIcon) === "function") {
                    return this.propIcon(item);
                }
                else
                    return item[this.propIcon];
            }
            return undefined;
        }
        /**
        * get childs from node
        */
        getChildsFromItem(item) {
            var cs = undefined;
            if (item === undefined)
                return undefined;
            if (typeof (this.propChilds) === "function") {
                cs = this.propChilds(item);
            }
            else
                cs = item[this.propChilds];
            return cs;
        }
        /*private getTreeNodeFromId(id:string):TreeNode{
            //@ts-ignore
            for(var entr of this.objectToNode){
                if(entr[1]._id===id)
                    return entr[1];
                //entries.return;
            }
            return undefined;
        }*/
        _onselect(event, data) {
            var item = this._itemToKey.get(data.node.data);
            event.data = item;
            this.callEvent("select", event, data);
        }
        _onclick(event, data) {
            if (event.originalEvent.target["className"].startsWith("MenuButton")) {
                this._callContextmenu(event.originalEvent);
                return;
            }
            if (event.ctrlKey === true)
                return; //only selection
            event.data = data.node.data.item;
            if (this._select !== undefined)
                this._select.value = data.node.data.item;
            this.callEvent("click", event, data);
        }
        set selection(values) {
            this.tree.getSelectedNodes().forEach((item) => {
                item.setSelected(false);
            });
            if (values === undefined)
                return;
            this["_selectionIsWaiting"] = values;
            var _this = this;
            for (var v = 0; v < values.length; v++) {
                var item = values[v];
                this._readNodeFromItem(item).then((node) => {
                    node.setSelected(true);
                    delete this["_selectionIsWaiting"];
                });
            }
        }
        get selection() {
            var ret = [];
            if (this["_selectionIsWaiting"] !== undefined)
                return this["_selectionIsWaiting"];
            this.tree.getSelectedNodes().forEach((item) => {
                ret.push(item.data.item);
            });
            return ret;
        }
        async activateKey(key, parent = undefined) {
            var node = await this._readNodeFromKey(key);
            if (node === null)
                return false;
            await node.setActive(true);
            return true;
        }
        async expandLater(promise, expand, node, allreadySeen) {
            return this.expandAll(expand, node, allreadySeen);
        }
        /**
         * expand all nodes
         */
        async expandAll(expand = true, parent = undefined, allreadySeen = undefined) {
            var isRoot = parent === undefined;
            var all = [];
            if (parent === undefined)
                parent = this.tree.rootNode;
            if (expand === undefined)
                expand = true;
            if (allreadySeen === undefined) {
                allreadySeen = [];
            }
            if (parent.hasChildren()) {
                for (var x = 0; x < parent.children.length; x++) {
                    var node = parent.children[x];
                    if (allreadySeen.indexOf(node.data.item) === -1)
                        allreadySeen.push(node.data.item);
                    else
                        continue;
                    if (node.hasChildren() || node.isLazy) {
                        var prom = node.setExpanded(expand);
                        all.push(this.expandLater(prom, expand, node, allreadySeen));
                    }
                }
                await Promise.all(all);
            }
        }
        async expandKeys(keys) {
            var all = [];
            for (var x = 0; x < keys.length; x++) {
                var n = await this._readNodeFromKey(keys[x]);
                if (n) {
                    await n.setExpanded(true);
                    all.push(n);
                }
            }
            await Promise.all(all);
        }
        getExpandedKeys(parent = undefined, expandedNodes = undefined) {
            var isRoot = parent === undefined;
            if (parent === undefined)
                parent = this.tree.getRootNode();
            if (expandedNodes === undefined) {
                expandedNodes = [];
            }
            if (parent.hasChildren()) {
                parent.children.forEach((node) => {
                    if (node.isExpanded()) {
                        expandedNodes.push(node.key);
                        this.getExpandedKeys(node, expandedNodes);
                    }
                });
            }
            return expandedNodes;
        }
        async expandNode(node) {
            node.setActive(true);
            var list = node.getParentList(false, false);
            for (var x = 0; x < list.length; x++) {
                if (!list[x].isExpanded())
                    await list[x].setExpanded(true);
            }
        }
        async _readNodeFromItem(item) {
            var key = this._itemToKey.get(item);
            if (key === undefined)
                this._readAllKeysIfNeeded();
            key = this._itemToKey.get(item);
            return this._readNodeFromKey(key);
        }
        async _readNodeFromKey(key) {
            var nd = this.tree.getNodeByKey(key);
            if (nd === null) {
                var path = "";
                var geskey = "";
                key === null || key === void 0 ? void 0 : key.split("|").forEach((k) => {
                    geskey = geskey + (geskey === "" ? "" : "|") + k;
                    path = path + "/" + geskey;
                });
                var _this = this;
                await this.tree.loadKeyPath(path, undefined);
            }
            nd = this.tree.getNodeByKey(key);
            return nd;
        }
        set value(value) {
            this["_valueIsWaiting"] = value;
            this._readNodeFromItem(value).then((node) => {
                node.setActive(true);
                delete this["_valueIsWaiting"];
            });
        }
        /**
         * get the active item
         **/
        get value() {
            if (this["_valueIsWaiting"] !== undefined) //async setting 
                return this["_valueIsWaiting"];
            var h = this.tree.getActiveNode();
            if (h === null)
                return undefined;
            return h.data.item;
        }
        async _readAllNodesIfNeeded() {
            if (this._allNodesReaded === true)
                return;
            if (this._allNodesReaded === false) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (this._allNodesReaded === true)
                            resolve(undefined);
                        else
                            resolve(this._readAllNodesIfNeeded());
                    }, 50);
                });
            }
            this._allNodesReaded = false;
            this._readAllKeysIfNeeded();
            var allPathes = [];
            var allPathes = [];
            this._itemToKey.forEach((key) => {
                //var key=entry[1];
                var path = "";
                var geskey = "";
                key.split("|").forEach((k) => {
                    geskey = geskey + (geskey === "" ? "" : "|") + k;
                    path = path + "/" + geskey;
                });
                allPathes.push(path);
            });
            var allPromise = [];
            for (var i = 0; i < allPathes.length; i++) {
                //@ts-ignore
                allPromise.push(this.tree.loadKeyPath(allPathes[i], undefined));
            }
            await Promise.all(allPromise);
            this._allNodesReaded = true;
            //    	await Promise.all(allPromise);
            //	await this.tree.loadKeyPath(allPathes,undefined);
        }
        getKeyFromItem(item) {
            var ret = this._itemToKey.get(item);
            if (ret === undefined)
                this._readAllKeysIfNeeded();
            return this._itemToKey.get(item);
        }
        /**
         * read all keys if not allready readed
         **/
        _readAllKeysIfNeeded(item = undefined, path = undefined, allreadySeen = undefined) {
            if (item === undefined && this._allKeysReaded === true)
                return;
            if (item === undefined) {
                this.tree.getRootNode().children.forEach((child) => {
                    this._readAllKeysIfNeeded(child.data.item, "", []);
                });
                return;
            }
            if (allreadySeen.indexOf(item) === -1)
                allreadySeen.push(item);
            else
                return;
            var title = this.getTitleFromItem(item).replaceAll("|", "!");
            var key = path + (path === "" ? "" : "|") + title;
            this._itemToKey.set(item, key);
            var cs = this.getChildsFromItem(item);
            if (cs !== undefined) {
                cs.forEach((c => {
                    this._readAllKeysIfNeeded(c, key, allreadySeen);
                }));
            }
            this._allKeysReaded = true;
        }
        set items(value) {
            this._items = value;
            this._allKeysReaded = undefined;
            this._allNodesReaded = undefined;
            this._itemToKey = new Map();
            if (!Array.isArray(value))
                value = [value];
            var avalue = [];
            for (var x = 0; x < value.length; x++) {
                avalue.push(new TreeNode(this, value[x]));
            }
            this.tree.reload(avalue);
            /*        var root: Fancytree.FancytreeNode = $("#" + this._id).fancytree("getTree").rootNode;
                    root.removeChildren();
                    this.objectToNode = new Map();
                    //this._allNodes={};
                    root.addChildren(avalue);
                    for (var j = 0;j < root.children.length;j++) {
                        avalue[j].fancyNode = root.children[j];
                        this.objectToNode.set(value[j], avalue[j]);
                    }*/
        }
        get items() {
            return this._items;
        }
        set selectComponent(_component) {
            this._select = _component;
        }
        get selectComponent() {
            return this._select;
        }
        _callContextmenu(event) {
            var x = 9;
            var newevent = {
                originalEvent: event,
                target: $(event.target).prev()[0]
            };
            event.preventDefault();
            if (this.contextMenu !== undefined) {
                this.contextMenu._callContextmenu(newevent);
            }
            //evt.originalEvent.clientY}
            //	tree.contextMenu.show(event);
        }
        /**
         * create the contextmenu
         * @param {object} evt  the click event in the contextmenu
         **/
        _prepareContextmenu(evt) {
            //var node: TreeNode = undefined;
            var node = $.ui.fancytree.getNode(evt.target);
            //node = this._allNodes[evt.target.id];
            if (this._contextMenu !== undefined) {
                if (node.data.item === undefined)
                    return;
                var test = node.data.tree.selection;
                //multiselect and the clicked is within the selection
                if (test !== undefined && test.indexOf(node.data.item) !== -1) {
                    this._contextMenu.value = test;
                }
                else
                    this._contextMenu.value = [node === undefined ? undefined : node.data.item];
            }
        }
        set contextMenu(value) {
            super.contextMenu = value;
            var _this = this;
            value.onbeforeshow(function (evt) {
                _this._prepareContextmenu(evt);
            });
        }
        get contextMenu() {
            return super.contextMenu;
        }
        destroy() {
            this._items = undefined;
            super.destroy();
        }
    };
    exports.Tree = Tree;
    __decorate([
        (0, Property_34.$Property)({ type: "json", componentType: "jassijs.ui.TableEditorProperties" }),
        __metadata("design:type", typeof (_a = typeof Fancytree !== "undefined" && Fancytree.FancytreeOptions) === "function" ? _a : Object),
        __metadata("design:paramtypes", [typeof (_b = typeof Fancytree !== "undefined" && Fancytree.FancytreeOptions) === "function" ? _b : Object])
    ], Tree.prototype, "options", null);
    __decorate([
        (0, Property_34.$Property)({ type: "string", description: "the property called to get the style of the item" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Tree.prototype, "propStyle", null);
    __decorate([
        (0, Property_34.$Property)({ type: "string", description: "the property called to get the name of the item" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Tree.prototype, "propDisplay", null);
    __decorate([
        (0, Property_34.$Property)({ default: "function(event?: JQueryEventObject/*, data?:Fancytree.EventData*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Tree.prototype, "onclick", null);
    exports.Tree = Tree = __decorate([
        (0, Component_32.$UIComponent)({ fullPath: "common/Tree", icon: "mdi mdi-file-tree" }),
        (0, Registry_103.$Class)("jassijs.ui.Tree"),
        (0, Property_34.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.TreeEditorProperties" })
        /*@$Property({ name: "new/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" })
        @$Property({ name: "new/checkbox", type: "boolean", default: false, description: "desplay a checkbos before the node" })
        @$Property({ name: "new/multi", type: "json" })
        @$Property({ name: "new/multi/mode", type: "string", default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" })
        */
        ,
        __metadata("design:paramtypes", [Object])
    ], Tree);
    class TreeNode {
        //options.source=[ { title: 'Folder in home folder', key: 'fA100', folder: true, lazy: true }];
        constructor(tree, item, parent = undefined) {
            this.tree = tree;
            this.parent = parent;
            this._id = "j" + Registry_104.default.nextID();
            this.item = item;
            var title = this.tree.getTitleFromItem(this.item);
            this.key = (parent !== undefined ? parent.key + "|" : "") + (title === undefined ? "" : title).replaceAll("|", "!");
            this.tree._itemToKey.set(item, this.key);
            this.icon = this.tree.getIconFromItem(this.item);
            var cs = this.tree.getChildsFromItem(this.item);
            if (cs !== undefined && cs.length > 0) {
                this.lazy = true;
            }
        }
        getStyle() {
            var ret = "";
            var style = this.tree.getStyleFromItem(this.item);
            if (style) {
                for (let key in style) {
                    if (key === "_classname")
                        continue;
                    var newKey = key.replaceAll("_", "-");
                    ret = ret + "\t\t" + newKey + ":" + style[key] + ";\n";
                }
            }
            return ret;
        }
        get title() {
            var ret = this.tree.getTitleFromItem(this.item);
            var bt = "";
            if (this.tree.contextMenu !== undefined)
                bt = "<span class='MenuButton menu mdi mdi-menu-down' id=900  treeid=" + this.tree._id + "  height='10' width='10' onclick='/*jassijs.ui.Tree._callContextmenu(event);*/'>";
            //prevent XSS
            ret = (ret === undefined ? "" : ret).replaceAll("<", "&lt").replaceAll(">", "&gt");
            ret = "<span id=" + this._id + " style='" + this.getStyle() + "'  >" + ret + "</span>";
            return ret + bt;
        }
        static loadChilds(event, data) {
            var node = data.node;
            var deferredResult = jQuery.Deferred();
            var tree = data.node.data.tree;
            var _this = data.node;
            var cs = tree.getChildsFromItem(data.node.data.item);
            var childs = [];
            if (cs !== undefined && cs.length > 0) {
                for (var x = 0; x < cs.length; x++) {
                    var nd = new TreeNode(tree, cs[x], _this);
                    childs.push(nd);
                }
            }
            data.result = childs;
            return;
            /*        fancynode.removeChildren();
                    fancynode.addChildren(childs);
                    for (var j = 0;j < fancynode.children.length;j++) {
                        childs[j].fancyNode = fancynode.children[j];
                        this.tree.objectToNode.set(cs[j], childs[j]);
                    }*/
            // delete this._dummy;
        }
    }
    ;
    async function test() {
        var tree = new Tree();
        var s = { name: "Sansa", id: 1, style: { color: "blue" } };
        var p = { name: "Peter", id: 2 };
        var u = { name: "Uwe", id: 3, childs: [p, s] };
        var t = { name: "Tom", id: 5 };
        var c = { name: "Christoph", id: 4, childs: [u, t] };
        s.childs = [c];
        tree.config({
            options: {
            // checkbox: true
            },
            propDisplay: "name",
            propChilds: "childs",
            propStyle: "style",
            items: [c],
            width: "100%",
            height: "100px",
            onclick: function (data) {
                console.log("select " + data["data"].name);
            },
            selection: [p, s],
            value: p
        });
        tree.onselect(() => {
            console.log(tree.selection);
        });
        /*tree.propIcon = function(data) {
            if (data.name === "Uwe")
                return "res/car.ico";
        };*/
        //  tree._readAllKeysIfNeeded();
        //	await tree.tree.loadKeyPath(["/Christoph/Christoph|Uwe/Christoph|Uwe|Peter"],undefined);
        //		var h=tree.tree.getNodeByKey("Christoph|Uwe|Peter");
        //		tree.tree.activateKey("Christoph|Uwe|Peter");
        //["Christoph","Christoph/Uwe/Tom1"],()=>{});
        //	node.setActive(true);
        // var j = tree.value;
        window.setTimeout(async () => {
            u.childs = [p];
            tree.items = [c];
            var k = tree.selection;
            //		var nod=tree.tree.getNodeByKey("Christoph/Uwe/Tom1");
            // await tree.expandAll(true);
            // await tree.expandAll(false);
            //	var node=tree.tree.getNodeByKey("Christoph/Uwe/Peter");
            //	node.setActive(true);
            //await tree.expandAll();
            // tree.value = p;
            //tree.expandAll(false);
            // tree.value = p;
            //var k=tree.getExpandedKeys();
            // tree.expandKeys(k);
            /* tree.expandAll();
             tree.value = p;
             var l=tree.value;*/
            //  var j = tree.value;
            // alert(tree.value.name);
        }, 4000);
        //    	$(tree.__dom).dialog();
        return tree;
    }
});
define("jassijs/ui/Upload", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Registry_105, Component_33, Property_35) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Upload = void 0;
    exports.test = test;
    let Upload = class Upload extends Component_33.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor(props = {}) {
            super(props);
        }
        render() {
            var _this = this;
            return React.createElement("input", {
                className: "Upload", type: "file", name: "files[]",
                onChange: (evt) => {
                    _this.readUpload(evt);
                }
            });
        }
        config(config) {
            super.config(config);
            return this;
        }
        componentDidMount() {
        }
        get dom() {
            return super.dom;
        }
        set dom(value) {
            super.dom = value;
        }
        get accept() {
            return this.dom.accept;
        }
        /**
         * which file types are accepted e.g ".txt,.csv"
         **/
        set accept(value) {
            this.dom.accept = value;
        }
        get multiple() {
            return this.dom.multiple;
        }
        /**
         * multiple files can be uploaded
         **/
        set multiple(value) {
            this.dom.multiple = value;
        }
        async readUpload(evt) {
            var files = evt.target["files"];
            var _this = this;
            var data = {};
            var downloaded = 0;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    data[file.name] = reader.result;
                    downloaded++;
                    if (downloaded == files.length) {
                        _this.callEvent("uploaded", data, files, evt);
                    }
                }, false);
                if (this.readAs === "DataUrl") {
                    reader.readAsDataURL(file);
                    // data[file.name]=reader.result;
                }
                else if (this.readAs === "ArrayBuffer") {
                    reader.readAsArrayBuffer(file);
                    // data[file.name]=reader.result;
                }
                else if (this.readAs === "BinaryString") {
                    reader.readAsBinaryString(file);
                }
                else {
                    reader.readAsText(file);
                }
            }
        }
        ;
        /**
         * register handler to get the uploaded data
         */
        onuploaded(handler) {
            this.addEvent("uploaded", handler);
        }
    };
    exports.Upload = Upload;
    __decorate([
        (0, Property_35.$Property)({ chooseFromStrict: true, chooseFrom: ["Text", "DataUrl", "ArrayBuffer", "BinaryString"] }),
        __metadata("design:type", String)
    ], Upload.prototype, "readAs", void 0);
    __decorate([
        (0, Property_35.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Upload.prototype, "accept", null);
    __decorate([
        (0, Property_35.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Upload.prototype, "multiple", null);
    __decorate([
        (0, Property_35.$Property)({ default: "function(data:{[file:string]:string}){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Upload.prototype, "onuploaded", null);
    exports.Upload = Upload = __decorate([
        (0, Component_33.$UIComponent)({ fullPath: "common/Upload", icon: "mdi mdi-cloud-upload-outline" }),
        (0, Registry_105.$Class)("jassijs.ui.Upload"),
        __metadata("design:paramtypes", [Object])
    ], Upload);
    /*
        // UI-Events erst registrieren wenn das DOM bereit ist!
    document.addEventListener("DOMContentLoaded", function () {
        // Falls neue Eingabe, neuer Aufruf der Auswahlfunktion
        document.getElementById('dateien')
            .addEventListener('change', dateiauswahl, false);
    });*/
    function test() {
        var upload = new Upload();
        upload.readAs = "DataUrl";
        upload.multiple = true;
        upload.onuploaded(function (data) {
            debugger;
        });
        //	upload.accept=".txt,.csv";
        return upload;
    }
});
define("jassijs/ui/VariablePanel", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Component", "jassijs/ui/ComponentDescriptor"], function (require, exports, Registry_106, Panel_20, Component_34, ComponentDescriptor_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VariablePanel = void 0;
    jassijs.d = function (id) {
        if (jassijs.d[id] === true)
            return false;
        jassijs.d[id] = true;
        return true;
    };
    // console.log(jassijs.d(9)?debug:0);
    // console.log(jassijs.d(9)?debug:0);
    let VariablePanel = class VariablePanel extends Panel_20.Panel {
        constructor() {
            super();
            this._items = [];
            /**cache**/
            /**@member {Object.<number, boolean>} **/
            this.debugpoints = {};
        }
        async createTable() {
            var Table = (await new Promise((resolve_22, reject_22) => { require(["jassijs/ui/Table"], resolve_22, reject_22); }).then(__importStar)).Table;
            this.table = new Table({
                options: {
                    dataTreeChildFunction: function (obj) {
                        var ret = [];
                        if (typeof (obj.value) === "string")
                            return ret;
                        for (var v in obj.value) {
                            var oval = obj.value[v];
                            ret.push({
                                name: v,
                                value: oval
                            });
                        }
                        return ret;
                    }
                }
            });
            this.table.width = "calc(100% - 2px)";
            this.table.height = "calc(100% - 2px)";
            super.add(this.table);
        }
        /**
         * VariabelPanel for id
         * @id {number} - the id
         * @returns  {jassijs.ui.VariablePanel}
        **/
        static get(id) {
            if (!document.getElementById(id)) //dummy for Codeeditor has closed
                return { __db: true, add: function () { }, update: function () { } };
            return document.getElementById(id)._this;
        }
        clear() {
            this.value = [];
            this._cache = [];
        }
        /**
         * add variables to variabelpanel
         * @param Object<string,object> variables ["name"]=value
         */
        addAll(vars) {
            for (var key in vars) {
                this.addVariable(key, vars[key], false);
            }
            this.update();
        }
        removeVariable(name) {
            var values = this.value;
            for (var x = 0; x < values.length; x++) {
                if (values[x].name === name) {
                    values.splice(x, 1);
                    return;
                }
            }
            this.updateCache();
        }
        /**
         *
         * @param {string} name - name of the variable
         * @param {object} value - the value of the variable
         * @param {boolean} [refresh] - refresh the dialog
         */
        addVariable(name, value, refresh = undefined, autoGenerated = false) {
            var values;
            //@ts-ignore
            if (this.value === undefined || this.value === "")
                values = [];
            else
                values = this.value;
            var found = false;
            for (var x = 0; x < values.length; x++) {
                if (values[x].name === name) {
                    found = true;
                    values[x].value = value;
                    break;
                }
            }
            if (!found)
                values.push({ name: name, value: value, autoGenerated });
            this._cache[name] = value;
            if (refresh !== false)
                this.update();
        }
        /**
         * analyze describeComponent(desc) -> desc.editableComponents and publish this
         **/
        updateCache() {
            this._cache = {};
            var vars = this.value;
            for (var x = 0; x < vars.length; x++) {
                var val = vars[x].value;
                var name = vars[x].name;
                this._cache[name] = val;
                /* if (name === "me" || name === "this") {
                     for (var key in val) {
                         this._cache[name + "." + key] = val[key];
                     }
                 }*/
            }
            var _this = this;
            function update(key, val) {
                if (val instanceof Component_34.Component) {
                    var comps = undefined;
                    try {
                        comps = ComponentDescriptor_7.ComponentDescriptor.describe(val.constructor).resolveEditableComponents(val);
                    }
                    catch (_a) {
                    }
                    var ret = [];
                    for (var name in comps) {
                        var comp = comps[name];
                        var fname = name;
                        if (comps !== undefined && name !== "this") {
                            fname = key + "." + name;
                            _this._cache[fname] = comp;
                            update(fname, comps[name]);
                        }
                        if (comp === undefined)
                            comp = comp;
                        /* var complist = comp?._components;
                         if (complist !== undefined) {
                             for (var o = 0; o < complist.length; o++) {
                                 update(fname, complist[o]);
                             }
                         }*/
                    }
                }
            }
            for (var key in this._cache) {
                val = this._cache[key];
                update(key, val);
            }
        }
        /**
         * get the ids of all editable Components by the designer
         * @param {jassijs.ui.Component} component - the component to inspect
         * @param {boolean} idFromLabel - if true not the id but the id form label is returned
         **/
        getEditableComponents(component, idFromLabel = undefined) {
            var ret = "";
            if (component._isNotEditableInDesigner === true)
                return ret;
            if (this.getVariableFromObject(component) !== undefined)
                ret = "#" + ((idFromLabel === true) ? component.domWrapper._id : component._id);
            var all = [component.dom._this];
            if (component.dom._thisOther) {
                all = [component.dom._this, ...component.dom._thisOther];
            }
            for (var y = 0; y < all.length; y++) {
                var ch = all[y];
                if (ch._components !== undefined) {
                    for (var x = 0; x < ch._components.length; x++) {
                        var t = this.getEditableComponents(ch._components[x], idFromLabel);
                        if (t !== "") {
                            ret = ret + (ret === "" ? "" : ",") + t;
                        }
                    }
                }
            }
            return ret;
        }
        isTypeOf(value, type) {
            if (value === undefined || value === null)
                return false;
            if (typeof type === "function") {
                return value instanceof type;
            }
            else
                return (value[type] !== undefined);
        }
        /**
        * get all known instances for type
        * @param {type|string} type - the type we are interested or the member which is implemented
        * @returns {[string]}
        */
        getVariablesForType(type) {
            var ret = [];
            var vars = this.value;
            if (type === undefined)
                return ret;
            for (var x = 0; x < vars.length; x++) {
                var val = vars[x].value;
                var name = vars[x].name;
                if (this.isTypeOf(val, type) && ret.indexOf(name) === -1)
                    ret.push(name);
            }
            /*  //seach in this
              vars = this._cache["this"];
              for (let y in vars) {
      
                  if (this.isTypeOf(vars[y],type))//&&ret.indexOf("this." + y)===-1)
                      ret.push("this." + y);
              }
              //seach in me
              vars = this._cache["me"];
              if (vars !== undefined) {
                  for (let z in vars) {
      
                      if (this.isTypeOf(vars[z],type)&&ret.indexOf("me." + z)===-1)
                          ret.push("me." + z);
                  }
              }*/
            //search in cache (published by updateCache)
            for (let key in this._cache) {
                if (this.isTypeOf(this._cache[key], type) && ret.indexOf(key) === -1)
                    ret.push(key);
            }
            return ret;
        }
        /**
         * gets the name of the variabel that holds the object
         * @param {object} ob - the
         */
        getVariableFromObject(ob) {
            for (var key in this._cache) {
                if (this._cache[key] === ob)
                    return key;
            }
        }
        /**
         * gets the name object of the given variabel
         * @param {string} ob - the name of the variable
         */
        getObjectFromVariable(varname) {
            if (this._cache === undefined)
                return undefined;
            return this._cache[varname];
        }
        isVariableAutogenerated(varname) {
            var _a;
            for (var x = 0; x < ((_a = this._items) === null || _a === void 0 ? void 0 : _a.length); x++) {
                if (this._items[x].name === varname)
                    return this._items[x].autoGenerated;
            }
            return undefined;
        }
        /**
          * renames a variable in design
          * @param {string} oldName
          * @param {string} newName
          */
        renameVariable(oldName, newName, autoGenerated = false) {
            if (oldName.startsWith("this.")) {
                oldName = oldName.substring(5);
                if (newName.startsWith("this."))
                    newName = newName.substring(5);
                let vars = this._cache["this"];
                vars[newName] = vars[oldName];
                vars[newName].autoGenerated = autoGenerated;
                delete vars[oldName];
            }
            else if (oldName.startsWith("me.")) {
                oldName = oldName.substring(3);
                if (newName.startsWith("me."))
                    newName = newName.substring(3);
                let vars = this._cache["me"];
                vars[newName] = vars[oldName];
                vars[newName].autoGenerated = autoGenerated;
                delete vars[oldName];
            }
            else {
                let vars = this.value;
                for (var x = 0; x < vars.length; x++) {
                    var val = vars[x].value;
                    var name = vars[x].name;
                    if (name === oldName) {
                        vars[x].name = newName;
                        vars[x].autoGenerated = autoGenerated;
                    }
                }
            }
            this.update();
        }
        /**
         * refreshes Table
         */
        update() {
            this.value = this.value;
            this.updateCache();
        }
        set value(value) {
            this._items = value;
            if (this.table)
                this.table.items = value;
        }
        get value() {
            return this._items; //this.table.items;
        }
        static getMembers(ob, withFunction) {
            if (withFunction === undefined)
                withFunction = false;
            var ret = [];
            for (var k in ob) {
                ret.push(k);
            }
            if (withFunction) {
                var type = ob.__proto__;
                if (ob.constructor !== null) //ob is a class
                    type = ob;
                this._getMembersProto(type, ret, ob);
            }
            return ret;
        }
        static _getMembersProto(proto, ret, ob) {
            if (proto === null)
                return;
            if (proto.constructor.name === "Object")
                return;
            var names = Object.getOwnPropertyNames(proto);
            for (var x = 0; x < names.length; x++) {
                ret.push(names[x]);
            }
            if (proto.__proto__ !== undefined && proto.__proto__ !== null) {
                this._getMembersProto(proto.__proto__, ret, ob);
            }
        }
        /**
        *
        * @param {string} name - the name of the object
        */
        evalExpression(name) {
            var toEval = "_variables_._curCursor=" + name + ";";
            var vals = this.value;
            for (var x = 0; x < vals.length; x++) {
                var v = vals[x];
                var sname = v.name;
                if (sname === "this")
                    sname = "this_this";
                if (sname !== "windows")
                    toEval = "var " + sname + "=_variables_.getObjectFromVariable(\"" + v.name + "\");" + toEval;
            }
            toEval = "var ev=function(){" + toEval + '};ev.bind(_variables_.getObjectFromVariable("this"))();';
            toEval = "var _variables_=$('#" + this._id + "')[0]._this;" + toEval;
            try {
                eval(toEval);
            }
            catch (ex) {
            }
            //this is the real object for .
            return this._curCursor;
        }
        destroy() {
            this.clear();
            this.debugpoints = [];
            if (this.table)
                this.table.items = [];
            super.destroy();
        }
    };
    exports.VariablePanel = VariablePanel;
    exports.VariablePanel = VariablePanel = __decorate([
        (0, Registry_106.$Class)("jassijs.ui.VariablePanel"),
        __metadata("design:paramtypes", [])
    ], VariablePanel);
});
define("jassijs/util/Cookies", ["require", "exports", "jassijs/ext/js-cookie"], function (require, exports, js_cookie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cookies = void 0;
    js_cookie_1 = __importDefault(js_cookie_1);
    class C {
        set(name, value, params = undefined) {
        }
        get(name) {
        }
        remove(name, params = undefined) {
        }
        getJSON() {
            return "";
        } // removed!
    }
    var Cookies = js_cookie_1.default.default;
    exports.Cookies = Cookies;
});
define("jassijs/util/CSVImport", ["require", "exports", "jassijs/ui/Upload", "jassijs/ui/Button", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/ui/BoxPanel", "jassijs/ui/Select", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ext/papaparse", "jassijs/remote/Database", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/DBObject", "jassijs/base/Actions", "jassijs/base/Router", "jassijs/remote/Server", "jassijs/remote/Transaction"], function (require, exports, Upload_1, Button_13, NumberConverter_3, Textbox_21, BoxPanel_6, Select_8, Table_5, Registry_107, Panel_21, papaparse_1, Database_3, Registry_108, Classes_30, DBObject_7, Actions_7, Router_2, Server_3, Transaction_1) {
    "use strict";
    var CSVImport_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSVImport = void 0;
    exports.test = test;
    papaparse_1 = __importDefault(papaparse_1);
    Registry_108 = __importDefault(Registry_108);
    let CSVImport = CSVImport_1 = class CSVImport extends Panel_21.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        static async showDialog() {
            Router_2.router.navigate("#do=jassijs.util.CSVImport");
        }
        async initTableHeaders() {
            var _a;
            var _this = this;
            var html = "<option></option>";
            var meta = (_a = Database_3.db.getMetadata(await Classes_30.classes.loadClass(this.me.select.value))) === null || _a === void 0 ? void 0 : _a.fields;
            var lkeys = [];
            for (var key in meta) {
                if (key === "this")
                    continue;
                html = html + '<option value="' + key.toLowerCase() + '">' + key.toLowerCase() + '</option>';
                lkeys.push(key.toLowerCase());
            }
            for (var x = 0; x < this.fieldCount; x++) {
                var el = document.getElementById(this._id + "--" + x);
                el.innerHTML = html;
                var pos = lkeys.indexOf(this.data[0]["Column " + x].toLowerCase());
                //assign dettected fields in first row
                if (pos !== -1) {
                    document.getElementById(this._id + "--" + x).value = lkeys[pos];
                }
            }
            //this.me.table.
        }
        async initClasses() {
            var cls = [];
            var _this = this;
            await Registry_108.default.loadAllFilesForService("$DBObject");
            var data = Registry_108.default.getData("$DBObject");
            data.forEach((entr) => {
                cls.push(Classes_30.classes.getClassName(entr.oclass));
            });
            this.me.select.items = cls;
            //debug
        }
        readData(csvdata) {
            csvdata = papaparse_1.default.parse(csvdata, { skipEmptyLines: true }).data;
            var len = csvdata[0].length;
            this.data = [];
            //convert [{1:hallo",2:"Du"}]
            for (var z = 0; z < csvdata.length; z++) {
                var ob = {};
                for (var x = 0; x < len; x++) {
                    ob["Column " + x] = csvdata[z][x];
                }
                this.data.push(ob);
            }
        }
        updateTable() {
            let _this = this;
            this.fieldCount = 0;
            for (var key in this.data[0]) {
                this.fieldCount++;
            }
            this.initClasses();
            var cols = [];
            var formatter = function (cell, formatterParams, onRendered) {
                return '<select name="pets" id="' + _this._id + "--" + formatterParams.max + '"><option>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option></select';
            };
            for (var x = 0; x < this.fieldCount; x++) {
                cols.push({
                    headerSort: false,
                    title: "Column " + x,
                    field: "Column " + x,
                    titleFormatter: formatter,
                    titleFormatterParams: { max: x }
                });
            }
            this.me.table.columns = cols;
            this.me.table.items = this.data;
        }
        layout(me) {
            me.boxpanel1 = new BoxPanel_6.BoxPanel();
            me.fromLine = new Textbox_21.Textbox();
            me.next = new Button_13.Button();
            me.upload = new Upload_1.Upload();
            var _this = this;
            this.me.table = new Table_5.Table({
                options: {
                    autoColumns: false
                }
            });
            me.select = new Select_8.Select();
            me.table.width = 500;
            me.table.height = "200";
            me.fromLine.value = 2;
            this.add(me.upload);
            this.add(me.boxpanel1);
            this.add(me.table);
            this.add(me.next);
            me.select.label = "DB-Class";
            me.select.width = 235;
            me.select.onchange(function (event) {
                _this.initTableHeaders();
            });
            me.select.height = 30;
            me.boxpanel1.width = 195;
            me.boxpanel1.horizontal = false;
            me.boxpanel1.add(me.fromLine);
            me.boxpanel1.add(me.select);
            me.fromLine.label = "start from line";
            me.fromLine.width = "80";
            me.fromLine.converter = new NumberConverter_3.NumberConverter();
            me.next.text = "Import";
            me.next.onclick(function (event) {
                _this.doimport().then((prot) => {
                    alert(prot);
                    console.log(prot);
                });
            });
            me.upload.onuploaded(function (fdata) {
                for (var key in fdata) {
                    _this.readData(fdata[key]);
                    _this.updateTable();
                }
            });
        }
        /**
         * imports a csv-file into database
         * @param urlcsv - the link to the csv which we import
         * @param dbclass
         * @param fieldmapping - e.g. {"id":"CUSTOMERID"} if the field id is in csv-column CUSTOMERID or {"id":1} if the field id is in column 1
         * @param replace - replace text e.g. {"für":"fuer"}
         * returns the message if succeeded
         */
        static async startImport(urlcsv, dbclass, fieldmapping = undefined, replace = undefined, beforeSave = undefined) {
            var _a;
            var imp = new CSVImport_1();
            var mapping = {};
            let ret = await new Server_3.Server().loadFile(urlcsv);
            if (replace) {
                for (let key in replace) {
                    ret = ret.replaceAll(key, replace[key]);
                }
            }
            imp.readData(ret);
            var _meta = (_a = Database_3.db.getMetadata(await Classes_30.classes.loadClass(dbclass))) === null || _a === void 0 ? void 0 : _a.fields;
            var meta = {};
            for (let k in _meta) {
                meta[k.toLowerCase()] = k;
            }
            var lkeys = [];
            var fieldids = {};
            for (var field in imp.data[0]) { //fieldnames
                //let field=imp.data[0][x];
                var x = Number(field.replace("Column ", ""));
                var fieldname = imp.data[0][field];
                fieldids[fieldname.toLowerCase()] = x;
                if (meta[fieldname.toLowerCase()]) {
                    mapping[fieldname.toLowerCase()] = x;
                }
            }
            if (fieldmapping) {
                for (var key in fieldmapping) {
                    let val = fieldmapping[key];
                    if (Number.isInteger(val)) {
                        mapping[key] = Number(val) - 1;
                    }
                    else {
                        if (fieldids[val.toLowerCase()] !== undefined)
                            mapping[key] = fieldids[val.toLowerCase()];
                    }
                }
            }
            /*		for (var key in meta) {
                        if (key === "this")
                            continue;
                        html = html + '<option value="' + key.toLowerCase() + '">' + key.toLowerCase() + '</option>';
                        lkeys.push(key.toLowerCase());
                    }*/
            //	if(beforeSave)
            //	await beforeSave(imp.data, dbclass,mapping);
            return await imp._doimport(imp.data, dbclass, 2, mapping, beforeSave);
        }
        async doimport() {
            //read userchoices
            var assignedfields = {};
            for (var x = 0; x < this.fieldCount; x++) {
                var value = document.getElementById(this._id + "--" + x).value;
                if (value !== "")
                    assignedfields[value] = x;
            }
            return await this._doimport(this.data, this.me.select.value, this.me.fromLine.value, assignedfields, undefined);
        }
        async _doimport(data, dbclass, fromLine, assignedfields, beforeSave) {
            var _a;
            var Type = Classes_30.classes.getClass(dbclass);
            //read objects so we can read from cache
            let nil = await Type["find"]();
            var meta = (_a = Database_3.db.getMetadata(await Classes_30.classes.loadClass(dbclass))) === null || _a === void 0 ? void 0 : _a.fields;
            var members = Registry_108.default.getMemberData("design:type")[dbclass];
            var allObjects = [];
            var from = fromLine;
            for (var x = from - 1; x < data.length; x++) {
                var satz = data[x];
                var ob = new Type();
                for (var fname in meta) {
                    let pos = assignedfields[fname.toLowerCase()];
                    if (pos !== undefined) {
                        let val = satz["Column " + pos];
                        var mtype = members[fname];
                        if (mtype !== undefined) {
                            var mt = mtype[0][0];
                            if (mt === Number)
                                val = Number(val.replaceAll(",", "."));
                            if (mt === Boolean) {
                                val = (val === "true" || val === true || val === 1 || val === "1");
                            }
                            if (val === "#NV")
                                val = undefined;
                            if (mt === Date) {
                                if (typeof val === "string")
                                    val = new Date(val);
                            }
                        }
                        if ((meta[fname].OneToOne || meta[fname].ManyToOne) && val !== undefined) {
                            let cl = meta[fname].ManyToOne[0]();
                            var nob = new cl();
                            nob.id = val;
                            val = { id: val };
                        }
                        ob[fname] = val;
                    }
                }
                var exists = DBObject_7.DBObject.getFromCache(dbclass, ob.id);
                if (exists) {
                    Object.assign(exists, ob);
                    allObjects.push(exists);
                }
                else
                    allObjects.push(ob);
            }
            if (beforeSave)
                await beforeSave(allObjects);
            var ret = [];
            var trans = new Transaction_1.Transaction();
            for (var x = 0; x < allObjects.length; x++) {
                var obs = allObjects[x];
                trans.add(obs, obs.save);
            }
            await trans.execute();
            //remove relations
            var rels = [];
            for (var fname in meta) {
                if (meta[fname].OneToOne || meta[fname].ManyToOne) {
                    rels.push(fname);
                }
            }
            for (var x = 0; x < allObjects.length; x++) {
                var obs = allObjects[x];
                rels.forEach(el => { delete obs[el]; });
            }
            return "imported " + allObjects.length + " objects";
        }
    };
    exports.CSVImport = CSVImport;
    __decorate([
        (0, Actions_7.$Action)({ name: "Administration/Database CSV-Import", icon: "mdi mdi-database-import" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], CSVImport, "showDialog", null);
    exports.CSVImport = CSVImport = CSVImport_1 = __decorate([
        (0, Actions_7.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_107.$Class)("jassijs.util.CSVImport"),
        __metadata("design:paramtypes", [])
    ], CSVImport);
    async function test() {
        var csv = `id,testid,companyname,contactname,contacttitle,address,city,region,postalcode,country,phone,fax
ALFKI,1,Alfreds Futterkiste,Maria Anders,Sales Representative,Obere Str. 57,Berlin,#NV,12209,Germany,030-0074321,030-0076545
ANATR,2,Ana Trujillo Emparedados y helados,Ana Trujillo,Owner,Avda. de la Constitución 2222,México D.F.,#NV,05021,Mexico,(5) 555-4729,(5) 555-3745
ANTON,3,Antonio Moreno Taquería,Antonio Moreno,Owner,Mataderos  2312,México D.F.,#NV,05023,Mexico,(5) 555-3932,#NV
AROUT,4,Around the Horn,Thomas Hardy,Sales Representative,120 Hanover Sq.,London,#NV,WA1 1DP,UK,(171) 555-7788,(171) 555-6750
BERGS,5,Berglunds snabbköp,Christina Berglund,Order Administrator,Berguvsvägen  8,Luleå,#NV,S-958 22,Sweden,0921-12 34 65,0921-12 34 67
BLAUS,6,Blauer See Delikatessen,Hanna Moos,Sales Representative,Forsterstr. 57,Mannheim,#NV,68306,Germany,0621-08460,0621-08924
BLONP,7,Blondesddsl père et fils,Frédérique Citeaux,Marketing Manager,"24, place Kléber",Strasbourg,#NV,67000,France,88.60.15.31,88.60.15.32
BOLID,8,Bólido Comidas preparadas,Martín Sommer,Owner,"C/ Araquil, 67",Madrid,#NV,28023,Spain,(91) 555 22 82,(91) 555 91 99
BONAP,9,Bon app',Laurence Lebihan,Owner,"12, rue des Bouchers",Marseille,#NV,13008,France,91.24.45.40,91.24.45.41
BOTTM,10,Bottom-Dollar Markets,Elizabeth Lincoln,Accounting Manager,23 Tsawassen Blvd.,Tsawassen,BC,T2F 8M4,Canada,(604) 555-4729,(604) 555-3745
BSBEV,11,B's Beverages,Victoria Ashworth,Sales Representative,Fauntleroy Circus,London,#NV,EC2 5NT,UK,(171) 555-1212,#NV
CACTU,12,Cactus Comidas para llevar,Patricio Simpson,Sales Agent,Cerrito 333,Buenos Aires,#NV,1010,Argentina,(1) 135-5555,(1) 135-4892
CENTC,13,Centro comercial Moctezuma,Francisco Chang,Marketing Manager,Sierras de Granada 9993,México D.F.,#NV,05022,Mexico,(5) 555-3392,(5) 555-7293
CHOPS,14,Chop-suey Chinese,Yang Wang,Owner,Hauptstr. 29,Bern,#NV,3012,Switzerland,0452-076545,#NV
COMMI,15,Comércio Mineiro,Pedro Afonso,Sales Associate,"Av. dos Lusíadas, 23",Sao Paulo,SP,05432-043,Brazil,(11) 555-7647,#NV
CONSH,16,Consolidated Holdings,Elizabeth Brown,Sales Representative,Berkeley Gardens 12  Brewery,London,#NV,WX1 6LT,UK,(171) 555-2282,(171) 555-9199
DRACD,17,Drachenblut Delikatessen,Sven Ottlieb,Order Administrator,Walserweg 21,Aachen,#NV,52066,Germany,0241-039123,0241-059428
DUMON,18,Du monde entier,Janine Labrune,Owner,"67, rue des Cinquante Otages",Nantes,#NV,44000,France,40.67.88.88,40.67.89.89
EASTC,19,Eastern Connection,Ann Devon,Sales Agent,35 King George,London,#NV,WX3 6FW,UK,(171) 555-0297,(171) 555-3373
ERNSH,20,Ernst Handel,Roland Mendel,Sales Manager,Kirchgasse 6,Graz,#NV,8010,Austria,7675-3425,7675-3426
FAMIA,21,Familia Arquibaldo,Aria Cruz,Marketing Assistant,"Rua Orós, 92",Sao Paulo,SP,05442-030,Brazil,(11) 555-9857,#NV
FISSA,22,FISSA Fabrica Inter. Salchichas S.A.,Diego Roel,Accounting Manager,"C/ Moralzarzal, 86",Madrid,#NV,28034,Spain,(91) 555 94 44,(91) 555 55 93
FOLIG,23,Folies gourmandes,Martine Rancé,Assistant Sales Agent,"184, chaussée de Tournai",Lille,#NV,59000,France,20.16.10.16,20.16.10.17
FOLKO,24,Folk och fä HB,Maria Larsson,Owner,Åkergatan 24,Bräcke,#NV,S-844 67,Sweden,0695-34 67 21,#NV
FRANK,25,Frankenversand,Peter Franken,Marketing Manager,Berliner Platz 43,München,#NV,80805,Germany,089-0877310,089-0877451
FRANR,26,France restauration,Carine Schmitt,Marketing Manager,"54, rue Royale",Nantes,#NV,44000,France,40.32.21.21,40.32.21.20
FRANS,27,Franchi S.p.A.,Paolo Accorti,Sales Representative,Via Monte Bianco 34,Torino,#NV,10100,Italy,011-4988260,011-4988261
FURIB,28,Furia Bacalhau e Frutos do Mar,Lino Rodriguez,Sales Manager,Jardim das rosas n. 32,Lisboa,#NV,1675,Portugal,(1) 354-2534,(1) 354-2535
GALED,29,Galería del gastrónomo,Eduardo Saavedra,Marketing Manager,"Rambla de Cataluña, 23",Barcelona,#NV,08022,Spain,(93) 203 4560,(93) 203 4561
GODOS,30,Godos Cocina Típica,José Pedro Freyre,Sales Manager,"C/ Romero, 33",Sevilla,#NV,41101,Spain,(95) 555 82 82,#NV
GOURL,31,Gourmet Lanchonetes,André Fonseca,Sales Associate,"Av. Brasil, 442",Campinas,SP,04876-786,Brazil,(11) 555-9482,#NV
GREAL,32,Great Lakes Food Market,Howard Snyder,Marketing Manager,2732 Baker Blvd.,Eugene,OR,97403,USA,(503) 555-7555,#NV
GROSR,33,GROSELLA-Restaurante,Manuel Pereira,Owner,5ª Ave. Los Palos Grandes,Caracas,DF,1081,Venezuela,(2) 283-2951,(2) 283-3397
HANAR,34,Hanari Carnes,Mario Pontes,Accounting Manager,"Rua do Paço, 67",Rio de Janeiro,RJ,05454-876,Brazil,(21) 555-0091,(21) 555-8765
HILAA,35,HILARION-Abastos,Carlos Hernández,Sales Representative,Carrera 22 con Ave. Carlos Soublette #8-35,San Cristóbal,Táchira,5022,Venezuela,(5) 555-1340,(5) 555-1948
HUNGC,36,Hungry Coyote Import Store,Yoshi Latimer,Sales Representative,City Center Plaza 516 Main St.,Elgin,OR,97827,USA,(503) 555-6874,(503) 555-2376
HUNGO,37,Hungry Owl All-Night Grocers,Patricia McKenna,Sales Associate,8 Johnstown Road,Cork,Co. Cork,#NV,Ireland,2967 542,2967 3333
ISLAT,38,Island Trading,Helen Bennett,Marketing Manager,Garden House Crowther Way,Cowes,Isle of Wight,PO31 7PJ,UK,(198) 555-8888,#NV
KOENE,39,Königlich Essen,Philip Cramer,Sales Associate,Maubelstr. 90,Brandenburg,#NV,14776,Germany,0555-09876,#NV
LACOR,40,La corne d'abondance,Daniel Tonini,Sales Representative,"67, avenue de l'Europe",Versailles,#NV,78000,France,30.59.84.10,30.59.85.11
LAMAI,41,La maison d'Asie,Annette Roulet,Sales Manager,1 rue Alsace-Lorraine,Toulouse,#NV,31000,France,61.77.61.10,61.77.61.11
LAUGB,42,Laughing Bacchus Wine Cellars,Yoshi Tannamuri,Marketing Assistant,1900 Oak St.,Vancouver,BC,V3F 2K1,Canada,(604) 555-3392,(604) 555-7293
LAZYK,43,Lazy K Kountry Store,John Steel,Marketing Manager,12 Orchestra Terrace,Walla Walla,WA,99362,USA,(509) 555-7969,(509) 555-6221
LEHMS,44,Lehmanns Marktstand,Renate Messner,Sales Representative,Magazinweg 7,Frankfurt a.M.,#NV,60528,Germany,069-0245984,069-0245874
LETSS,45,Let's Stop N Shop,Jaime Yorres,Owner,87 Polk St. Suite 5,San Francisco,CA,94117,USA,(415) 555-5938,#NV
LILAS,46,LILA-Supermercado,Carlos González,Accounting Manager,Carrera 52 con Ave. Bolívar #65-98 Llano Largo,Barquisimeto,Lara,3508,Venezuela,(9) 331-6954,(9) 331-7256
LINOD,47,LINO-Delicateses,Felipe Izquierdo,Owner,Ave. 5 de Mayo Porlamar,I. de Margarita,Nueva Esparta,4980,Venezuela,(8) 34-56-12,(8) 34-93-93
LONEP,48,Lonesome Pine Restaurant,Fran Wilson,Sales Manager,89 Chiaroscuro Rd.,Portland,OR,97219,USA,(503) 555-9573,(503) 555-9646
MAGAA,49,Magazzini Alimentari Riuniti,Giovanni Rovelli,Marketing Manager,Via Ludovico il Moro 22,Bergamo,#NV,24100,Italy,035-640230,035-640231
MAISD,50,Maison Dewey,Catherine Dewey,Sales Agent,Rue Joseph-Bens 532,Bruxelles,#NV,B-1180,Belgium,(02) 201 24 67,(02) 201 24 68
MEREP,51,Mère Paillarde,Jean Fresnière,Marketing Assistant,43 rue St. Laurent,Montréal,Québec,H1J 1C3,Canada,(514) 555-8054,(514) 555-8055
MORGK,52,Morgenstern Gesundkost,Alexander Feuer,Marketing Assistant,Heerstr. 22,Leipzig,#NV,04179,Germany,0342-023176,#NV
NORTS,53,North/South,Simon Crowther,Sales Associate,South House 300 Queensbridge,London,#NV,SW7 1RZ,UK,(171) 555-7733,(171) 555-2530
OCEAN,54,Océano Atlántico Ltda.,Yvonne Moncada,Sales Agent,Ing. Gustavo Moncada 8585 Piso 20-A,Buenos Aires,#NV,1010,Argentina,(1) 135-5333,(1) 135-5535
OLDWO,55,Old World Delicatessen,Rene Phillips,Sales Representative,2743 Bering St.,Anchorage,AK,99508,USA,(907) 555-7584,(907) 555-2880
OTTIK,56,Ottilies Käseladen,Henriette Pfalzheim,Owner,Mehrheimerstr. 369,Köln,#NV,50739,Germany,0221-0644327,0221-0765721
PARIS,57,Paris spécialités,Marie Bertrand,Owner,"265, boulevard Charonne",Paris,#NV,75012,France,(1) 42.34.22.66,(1) 42.34.22.77
PERIC,58,Pericles Comidas clásicas,Guillermo Fernández,Sales Representative,Calle Dr. Jorge Cash 321,México D.F.,#NV,05033,Mexico,(5) 552-3745,(5) 545-3745
PICCO,59,Piccolo und mehr,Georg Pipps,Sales Manager,Geislweg 14,Salzburg,#NV,5020,Austria,6562-9722,6562-9723
PRINI,60,Princesa Isabel Vinhos,Isabel de Castro,Sales Representative,Estrada da saúde n. 58,Lisboa,#NV,1756,Portugal,(1) 356-5634,#NV
QUEDE,61,Que Delícia,Bernardo Batista,Accounting Manager,"Rua da Panificadora, 12",Rio de Janeiro,RJ,02389-673,Brazil,(21) 555-4252,(21) 555-4545
QUEEN,62,Queen Cozinha,Lúcia Carvalho,Marketing Assistant,"Alameda dos Canàrios, 891",Sao Paulo,SP,05487-020,Brazil,(11) 555-1189,#NV
QUICK,63,QUICK-Stop,Horst Kloss,Accounting Manager,Taucherstraße 10,Cunewalde,#NV,01307,Germany,0372-035188,#NV
RANCH,64,Rancho grande,Sergio Gutiérrez,Sales Representative,Av. del Libertador 900,Buenos Aires,#NV,1010,Argentina,(1) 123-5555,(1) 123-5556
RATTC,65,Rattlesnake Canyon Grocery,Paula Wilson,Assistant Sales Representative,2817 Milton Dr.,Albuquerque,NM,87110,USA,(505) 555-5939,(505) 555-3620
REGGC,66,Reggiani Caseifici,Maurizio Moroni,Sales Associate,Strada Provinciale 124,Reggio Emilia,#NV,42100,Italy,0522-556721,0522-556722
RICAR,67,Ricardo Adocicados,Janete Limeira,Assistant Sales Agent,"Av. Copacabana, 267",Rio de Janeiro,RJ,02389-890,Brazil,(21) 555-3412,#NV
RICSU,68,Richter Supermarkt,Michael Holz,Sales Manager,Grenzacherweg 237,Genève,#NV,1203,Switzerland,0897-034214,#NV
ROMEY,69,Romero y tomillo,Alejandra Camino,Accounting Manager,"Gran Vía, 1",Madrid,#NV,28001,Spain,(91) 745 6200,(91) 745 6210
SANTG,70,Santé Gourmet,Jonas Bergulfsen,Owner,Erling Skakkes gate 78,Stavern,#NV,4110,Norway,07-98 92 35,07-98 92 47
SAVEA,71,Save-a-lot Markets,Jose Pavarotti,Sales Representative,187 Suffolk Ln.,Boise,ID,83720,USA,(208) 555-8097,#NV
SEVES,72,Seven Seas Imports,Hari Kumar,Sales Manager,90 Wadhurst Rd.,London,#NV,OX15 4NB,UK,(171) 555-1717,(171) 555-5646
SIMOB,73,Simons bistro,Jytte Petersen,Owner,Vinbæltet 34,Kobenhavn,#NV,1734,Denmark,31 12 34 56,31 13 35 57
SPECD,74,Spécialités du monde,Dominique Perrier,Marketing Manager,"25, rue Lauriston",Paris,#NV,75016,France,(1) 47.55.60.10,(1) 47.55.60.20
SPLIR,75,Split Rail Beer & Ale,Art Braunschweiger,Sales Manager,P.O. Box 555,Lander,WY,82520,USA,(307) 555-4680,(307) 555-6525
SUPRD,76,Suprêmes délices,Pascale Cartrain,Accounting Manager,"Boulevard Tirou, 255",Charleroi,#NV,B-6000,Belgium,(071) 23 67 22 20,(071) 23 67 22 21
THEBI,77,The Big Cheese,Liz Nixon,Marketing Manager,89 Jefferson Way Suite 2,Portland,OR,97201,USA,(503) 555-3612,#NV
THECR,78,The Cracker Box,Liu Wong,Marketing Assistant,55 Grizzly Peak Rd.,Butte,MT,59801,USA,(406) 555-5834,(406) 555-8083
TOMSP,79,Toms Spezialitäten,Karin Josephs,Marketing Manager,Luisenstr. 48,Münster,#NV,44087,Germany,0251-031259,0251-035695
TORTU,80,Tortuga Restaurante,Miguel Angel Paolino,Owner,Avda. Azteca 123,México D.F.,#NV,05033,Mexico,(5) 555-2933,#NV
TRADH,81,Tradição Hipermercados,Anabela Domingues,Sales Representative,"Av. Inês de Castro, 414",Sao Paulo,SP,05634-030,Brazil,(11) 555-2167,(11) 555-2168
TRAIH,82,Trail's Head Gourmet Provisioners,Helvetius Nagy,Sales Associate,722 DaVinci Blvd.,Kirkland,WA,98034,USA,(206) 555-8257,(206) 555-2174
VAFFE,83,Vaffeljernet,Palle Ibsen,Sales Manager,Smagsloget 45,Århus,#NV,8200,Denmark,86 21 32 43,86 22 33 44
VICTE,84,Victuailles en stock,Mary Saveley,Sales Agent,"2, rue du Commerce",Lyon,#NV,69004,France,78.32.54.86,78.32.54.87
VINET,85,Vins et alcools Chevalier,Paul Henriot,Accounting Manager,59 rue de l'Abbaye,Reims,#NV,51100,France,26.47.15.10,26.47.15.11
WANDK,86,Die Wandernde Kuh,Rita Müller,Sales Representative,Adenauerallee 900,Stuttgart,#NV,70563,Germany,0711-020361,0711-035428
WARTH,87,Wartian Herkku,Pirkko Koskitalo,Accounting Manager,Torikatu 38,Oulu,#NV,90110,Finland,981-443655,981-443655
WELLI,88,Wellington Importadora,Paula Parente,Sales Manager,"Rua do Mercado, 12",Resende,SP,08737-363,Brazil,(14) 555-8122,#NV
WHITC,89,White Clover Markets,Karl Jablonski,Owner,305 - 14th Ave. S. Suite 3B,Seattle,WA,98128,USA,(206) 555-4112,(206) 555-4115
WILMK,90,Wilman Kala,Matti Karttunen,Owner/Marketing Assistant,Keskuskatu 45,Helsinki,#NV,21240,Finland,90-224 8858,90-224 8858
WOLZA,91,Wolski  Zajazd,Zbyszek Piestrzeniewicz,Owner,ul. Filtrowa 68,Warszawa,#NV,01-012,Poland,(26) 642-7012,(26) 642-7012
`;
        var s = await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/products.csv", "northwind.Products", { "id": "productid", "supplier": "supplierid", "category": "categoryid" });
        console.log(s);
    }
});
define("jassijs/util/DatabaseSchema", ["require", "exports", "jassijs/remote/Database", "jassijs/remote/Classes"], function (require, exports, Database_4, Classes_31) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Entity = Entity;
    exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
    exports.JoinColumn = JoinColumn;
    exports.JoinTable = JoinTable;
    exports.Column = Column;
    exports.PrimaryColumn = PrimaryColumn;
    exports.OneToOne = OneToOne;
    exports.OneToMany = OneToMany;
    exports.ManyToOne = ManyToOne;
    exports.ManyToMany = ManyToMany;
    //define Decoraters for typeorm
    let cache = {};
    function addDecorater(decoratername, ...args) {
        return function (...fargs) {
            var con = fargs.length === 1 ? fargs[0] : fargs[0].constructor;
            var clname = Classes_31.classes.getClassName(con);
            var field = fargs.length == 1 ? "this" : fargs[1];
            Database_4.db._setMetadata(con, field, decoratername, args, fargs, undefined);
        };
    }
    function Entity(...param) {
        return addDecorater("Entity", ...param);
    }
    function PrimaryGeneratedColumn(...param) {
        return addDecorater("PrimaryGeneratedColumn", ...param);
    }
    function JoinColumn(...param) {
        return addDecorater("JoinColumn", ...param);
    }
    function JoinTable(...param) {
        return addDecorater("JoinTable", ...param);
    }
    function Column(...any) {
        return addDecorater("Column", ...any);
    }
    function PrimaryColumn(...any) {
        return addDecorater("PrimaryColumn", ...any);
    }
    function OneToOne(...any) {
        return addDecorater("OneToOne", ...any);
    }
    function OneToMany(...any) {
        return addDecorater("OneToMany", ...any);
    }
    function ManyToOne(...any) {
        return addDecorater("ManyToOne", ...any);
    }
    function ManyToMany(...any) {
        return addDecorater("ManyToMany", ...any);
    }
});
define("jassijs/util/Numberformatter", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_109) {
    "use strict";
    var Numberformatter_3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Numberformatter = void 0;
    exports.test = test;
    //https://github.com/Mottie/javascript-number-formatter/blob/master/src/format.js
    //license https://github.com/Mottie/javascript-number-formatter/blob/master/LICENSE
    const maskRegex = /[0-9\-+#]/;
    const notMaskRegex = /[^\d\-+#]/g;
    function getIndex(mask) {
        return mask.search(maskRegex);
    }
    function processMask(mask = "#.##") {
        const maskObj = {};
        const len = mask.length;
        const start = getIndex(mask);
        maskObj.prefix = start > 0 ? mask.substring(0, start) : "";
        // Reverse string: not an ideal method if there are surrogate pairs
        const end = getIndex(mask.split("").reverse().join(""));
        const offset = len - end;
        const substr = mask.substring(offset, offset + 1);
        // Add 1 to offset if mask has a trailing decimal/comma
        const indx = offset + ((substr === "." || (substr === ",")) ? 1 : 0);
        maskObj.suffix = end > 0 ? mask.substring(indx, len) : "";
        maskObj.mask = mask.substring(start, indx);
        maskObj.maskHasNegativeSign = maskObj.mask.charAt(0) === "-";
        maskObj.maskHasPositiveSign = maskObj.mask.charAt(0) === "+";
        // Search for group separator & decimal; anything not digit,
        // not +/- sign, and not #
        let result = maskObj.mask.match(notMaskRegex);
        // Treat the right most symbol as decimal
        maskObj.decimal = (result && result[result.length - 1]) || ".";
        // Treat the left most symbol as group separator
        maskObj.separator = (result && result[1] && result[0]) || ",";
        // Split the decimal for the format string if any
        result = maskObj.mask.split(maskObj.decimal);
        maskObj.integer = result[0];
        maskObj.fraction = result[1];
        return maskObj;
    }
    function processValue(value, maskObj, options) {
        let isNegative = false;
        const valObj = {
            value
        };
        if (value < 0) {
            isNegative = true;
            // Process only abs(), and turn on flag.
            valObj.value = -valObj.value;
        }
        valObj.sign = isNegative ? "-" : "";
        // Fix the decimal first, toFixed will auto fill trailing zero.
        valObj.value = Number(valObj.value).toFixed(maskObj.fraction && maskObj.fraction.length);
        // Convert number to string to trim off *all* trailing decimal zero(es)
        valObj.value = Number(valObj.value).toString();
        // Fill back any trailing zero according to format
        // look for last zero in format
        const posTrailZero = maskObj.fraction && maskObj.fraction.lastIndexOf("0");
        let [valInteger = "0", valFraction = ""] = valObj.value.split(".");
        if (!valFraction || (valFraction && valFraction.length <= posTrailZero)) {
            valFraction = posTrailZero < 0
                ? ""
                : (Number("0." + valFraction).toFixed(posTrailZero + 1)).replace("0.", "");
        }
        valObj.integer = valInteger;
        valObj.fraction = valFraction;
        addSeparators(valObj, maskObj);
        // Remove negative sign if result is zero
        if (valObj.result === "0" || valObj.result === "") {
            // Remove negative sign if result is zero
            isNegative = false;
            valObj.sign = "";
        }
        if (!isNegative && maskObj.maskHasPositiveSign) {
            valObj.sign = "+";
        }
        else if (isNegative && maskObj.maskHasPositiveSign) {
            valObj.sign = "-";
        }
        else if (isNegative) {
            valObj.sign = options && options.enforceMaskSign && !maskObj.maskHasNegativeSign
                ? ""
                : "-";
        }
        return valObj;
    }
    function addSeparators(valObj, maskObj) {
        valObj.result = "";
        // Look for separator
        const szSep = maskObj.integer.split(maskObj.separator);
        // Join back without separator for counting the pos of any leading 0
        const maskInteger = szSep.join("");
        const posLeadZero = maskInteger && maskInteger.indexOf("0");
        if (posLeadZero > -1) {
            while (valObj.integer.length < (maskInteger.length - posLeadZero)) {
                valObj.integer = "0" + valObj.integer;
            }
        }
        else if (Number(valObj.integer) === 0) {
            valObj.integer = "";
        }
        // Process the first group separator from decimal (.) only, the rest ignore.
        // get the length of the last slice of split result.
        const posSeparator = (szSep[1] && szSep[szSep.length - 1].length);
        if (posSeparator) {
            const len = valObj.integer.length;
            const offset = len % posSeparator;
            for (let indx = 0; indx < len; indx++) {
                valObj.result += valObj.integer.charAt(indx);
                // -posSeparator so that won't trail separator on full length
                if (!((indx - offset + 1) % posSeparator) && indx < len - posSeparator) {
                    valObj.result += maskObj.separator;
                }
            }
        }
        else {
            valObj.result = valObj.integer;
        }
        valObj.result += (maskObj.fraction && valObj.fraction)
            ? maskObj.decimal + valObj.fraction
            : "";
        return valObj;
    }
    function _format(mask, value, options = {}) {
        const maskObj = processMask(mask);
        if (typeof value === "string")
            value = value.replace(maskObj.separator, ".");
        if (!mask || isNaN(Number(value))) {
            // Invalid inputs
            return value;
        }
        const valObj = processValue(value, maskObj, options);
        return maskObj.prefix + valObj.sign + valObj.result + maskObj.suffix;
    }
    ;
    let Numberformatter = Numberformatter_3 = class Numberformatter {
        static format(mask, value, options = {}) {
            return _format(mask, value, options);
        }
        static getLocaleDecimal() {
            const format = new Intl.NumberFormat();
            /*const parts = format.formatToParts(12.6);
    
            var dec = ".";
            parts.forEach(p => {
                if (p.type === "decimal")
                    dec = p.value;
            });
            return dec;*/
            return format.format(1.1).substring(1, 2);
        }
        static numberToString(num) {
            if (num === undefined)
                return undefined;
            if (num === null)
                return null;
            var l = num.toString().replace(".", Numberformatter_3.getLocaleDecimal());
            return l;
        }
        static stringToNumber(num) {
            if (num === undefined)
                return undefined;
            if (num === null)
                return null;
            var l = num.replace(Numberformatter_3.getLocaleDecimal(), ".");
            return Number.parseFloat(l);
        }
    };
    exports.Numberformatter = Numberformatter;
    exports.Numberformatter = Numberformatter = Numberformatter_3 = __decorate([
        (0, Registry_109.$Class)("jassijs.util.Numberformatter")
    ], Numberformatter);
    function test() {
        console.log(Numberformatter.format("##0,00", 90.8));
        let t = Numberformatter.numberToString(90.8);
        console.log(t);
        console.log(Numberformatter.stringToNumber(t));
    }
});
define("jassijs/util/Reloader", ["require", "exports", "jassijs/remote/Config", "jassijs/remote/Registry", "jassijs/remote/Registry"], function (require, exports, Config_4, Registry_110, Registry_111) {
    "use strict";
    var Reloader_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Reloader = void 0;
    Registry_111 = __importDefault(Registry_111);
    let Reloader = Reloader_1 = class Reloader {
        /**
         * reloads Code
         */
        constructor() {
            this.listener = [];
        }
        /**
         * check code changes out of the browser if localhost and load the changes in to the browser
         */
        static startReloadCodeFromServer() {
            if (Reloader_1.reloadCodeFromServerIsRunning)
                return;
            if (window.location.hostname !== "localhost") {
                return;
            }
            var h = { date: 0, files: [] };
            var f = async function () {
                jassijs.server.call("checkDir", h.date).then(function (t) {
                    h = JSON.parse(t);
                    var len = h.files.length;
                    if (len > 3)
                        len = 1;
                    for (var x = 0; x < len; x++) {
                        var file = h.files[x];
                        new Reloader_1().reloadJS(file);
                        // notify(file + " reloaded", "info", { position: "bottom right" });
                    }
                    window.setTimeout(f, 100000);
                });
            };
            window.setTimeout(f, 100000);
        }
        /**
         * listener for code reloaded
         * @param {function} func - callfunction for the event
         */
        addEventCodeReloaded(func) {
            this.listener.push(func);
        }
        removeEventCodeReloaded(func) {
            var pos = this.listener.indexOf(func);
            if (pos !== -1) {
                this.listener.splice(pos, 1);
            }
        }
        _findScript(name) {
            var scripts = document.querySelectorAll('script');
            for (var x = 0; x < scripts.length; x++) {
                var attr = scripts[x].getAttributeNode("src");
                if (attr !== null && attr !== undefined && attr.value === (name + ".js")) { //?bust="+window.jassiversion
                    return scripts[x];
                }
            }
            return undefined;
        }
        async reloadJS(fileName) {
            await this.reloadJSAll([fileName]);
        }
        async reloadJSAll(fileNames, afterUnload = undefined, useServerRequire = false) {
            //classname->file
            var files = {};
            let allModules = {};
            var allfiles = [];
            for (let ff = 0; ff < fileNames.length; ff++) {
                var fileName = fileNames[ff];
                fileName = fileName.replace("$serverside/", "");
                var fileNameBlank = fileName;
                if (fileName.toLocaleLowerCase().endsWith("css")) {
                    /*var node=document.getElementById("-->"+fileName);
                    if(node){
                        document.getElementById("-->"+fileName).remove();
                    }*/
                    jassijs.myRequire(fileName);
                    continue;
                }
                if (fileName.toLocaleLowerCase().endsWith("json") || fileName.toLocaleLowerCase().endsWith("html")) {
                    continue;
                }
                if (fileNameBlank.endsWith(".js"))
                    fileNameBlank = fileNameBlank.substring(0, fileNameBlank.length - 3);
                var test = this._findScript(fileNameBlank);
                //de.Kunde statt de/kunde
                if (test !== undefined) {
                    var attr = test.getAttributeNode("data-requiremodule");
                    if (attr !== null) {
                        fileNameBlank = attr.value;
                    }
                }
                //load all classes which are in the same filename
                var allclasses = await Registry_111.default.getJSONData("$Class");
                var classesInFile = [];
                for (var x = 0; x < allclasses.length; x++) {
                    var pclass = allclasses[x];
                    if (pclass.filename === fileName) {
                        classesInFile.push(pclass.filename);
                    }
                }
                //collect all classes which depends on the class
                var family = {};
                for (var x = 0; x < classesInFile.length; x++) {
                    var classname = classesInFile[x];
                    var check = classes.getClass(classname);
                    if (check === undefined)
                        continue;
                    var classes = classes.getCache();
                    family[classname] = {};
                    for (var key in classes) {
                        if (key === classname)
                            files[key] = allclasses[key][0].file;
                        if (classes[key].prototype instanceof check) {
                            files[key] = allclasses[key][0].file;
                            var tree = [];
                            let test = classes[key].prototype;
                            while (test !== check.prototype) {
                                tree.push(classes.getClassName(test));
                                test = test["__proto__"];
                                //all.push(allclasses[key][0].file);
                            }
                            var cur = family[classname];
                            for (var c = tree.length - 1; c >= 0; c--) {
                                var cl = tree[c];
                                if (cur[cl] === undefined)
                                    cur[cl] = {};
                                cur = cur[cl];
                            }
                            //delete class - its better to get an exception if sonething goes wrong
                            //  classes[key]=undefined;
                            //jassijs.classes.removeClass(key);
                        }
                    }
                }
                for (var key in files) {
                    if (files[key].endsWith(".js"))
                        files[key] = files[key].substring(0, files[key].length - 3); //files._self_=fileName;
                    allfiles.push(files[key]);
                }
                if (allfiles.indexOf(fileNameBlank) < 0) {
                    allfiles.push(fileNameBlank);
                }
                //save all modules
            }
            var myrequire;
            //@ts-ignore
            if (require.defined("jassijs/server/Installserver") || useServerRequire) {
                myrequire = Config_4.config.serverrequire;
            }
            else {
                myrequire = Config_4.config.clientrequire;
            }
            await new Promise((resolve, reject) => {
                //@ts-ignore
                myrequire(allfiles, function (...ret) {
                    for (var rx = 0; rx < ret.length; rx++) {
                        allModules[allfiles[rx]] = ret[rx];
                    }
                    resolve(undefined);
                }, (err) => {
                    throw err;
                });
            });
            for (let x = 0; x < allfiles.length; x++) {
                myrequire.undef(allfiles[x]);
            }
            if (afterUnload !== undefined)
                await afterUnload();
            var _this = this;
            // console.log("reload " + JSON.stringify(fileNameBlank));
            await new Promise((resolve, reject) => {
                //@ts-ignore
                myrequire(allfiles, function (...ret) {
                    async function run() {
                        for (let f = 0; f < allfiles.length; f++) {
                            if (ret && !ret[x].doNotReloadModule)
                                _this.migrateModul(allModules, allfiles[f], ret[f]);
                        }
                        for (let i = 0; i < _this.listener.length; i++) {
                            await _this.listener[i](allfiles);
                        }
                        ;
                    }
                    run().then(() => {
                        resolve(undefined);
                    }).catch(err => {
                        reject(err);
                    });
                });
            }).catch(err => {
                throw err;
            });
        }
        migrateModul(allModules, file, modul) {
            if (modul === undefined)
                return;
            var old = allModules[file];
            if (old === modul) {
                console.log("migrate Modul " + file + " not work");
                return;
            }
            this.migrateClasses(file, old, modul);
            //now migrate loaded modules
            modul.__oldModul = old;
            while (old !== undefined) {
                for (let key in old) {
                    if (key !== "__oldModul") {
                        old[key] = modul[key];
                    }
                }
                old = old.__oldModul;
            }
        }
        migrateClasses(file, oldmodul, modul) {
            if (oldmodul === undefined)
                return;
            for (let key in modul) {
                var newClass = modul[key];
                if (newClass.prototype !== undefined && key !== "__oldModul") {
                    //migrate old Class
                    var meths = Object.getOwnPropertyNames(newClass.prototype);
                    if (Reloader_1.cache[file + "/" + key] === undefined) {
                        Reloader_1.cache[file + "/" + key] = [];
                        Reloader_1.cache[file + "/" + key].push(oldmodul[key]);
                    }
                    for (let c = 0; c < Reloader_1.cache[file + "/" + key].length; c++) {
                        var oldClass = Reloader_1.cache[file + "/" + key][c];
                        if (oldClass !== undefined) {
                            for (var x = 0; x < meths.length; x++) {
                                var m = meths[x];
                                if (m === "constructor" || m === "length" || m === "prototype") {
                                    continue;
                                }
                                var desc = Object.getOwnPropertyDescriptor(newClass.prototype, m);
                                if (desc.value !== undefined) { //function
                                    oldClass.prototype[m] = newClass.prototype[m];
                                }
                                if (desc.get !== undefined || desc.set !== undefined) {
                                    Object.defineProperty(oldClass.prototype, m, desc);
                                }
                            }
                        }
                    }
                    Reloader_1.cache[file + "/" + key].push(newClass);
                }
            }
        }
    };
    exports.Reloader = Reloader;
    Reloader.cache = [];
    Reloader.reloadCodeFromServerIsRunning = false;
    Reloader.instance = new Reloader_1();
    exports.Reloader = Reloader = Reloader_1 = __decorate([
        (0, Registry_110.$Class)("jassijs.util.Reloader"),
        __metadata("design:paramtypes", [])
    ], Reloader);
});
define("jassijs/util/Runlater", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_112) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Runlater = void 0;
    let Runlater = class Runlater {
        constructor(func, timeout) {
            this.isRunning = false;
            this.func = func;
            this.timeout = timeout;
        }
        _checkRun() {
            var _this = this;
            if (Date.now() > this.timeout + this.lastRun) {
                this.isRunning = false;
                this.func();
            }
            else {
                setTimeout(function () {
                    _this._checkRun();
                }, this.timeout);
            }
        }
        runlater() {
            var _this = this;
            this.lastRun = Date.now();
            if (this.isRunning) {
                return;
            }
            else {
                this.isRunning = true;
                setTimeout(function () {
                    _this._checkRun();
                }, this.timeout);
            }
        }
    };
    exports.Runlater = Runlater;
    exports.Runlater = Runlater = __decorate([
        (0, Registry_112.$Class)("jassi.util.Runlater"),
        __metadata("design:paramtypes", [Object, Object])
    ], Runlater);
});
define("jassijs/util/Tools", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_113) {
    "use strict";
    var Tools_3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tools = void 0;
    exports.test = test;
    let Tools = Tools_3 = class Tools {
        constructor() {
        }
        static copyObject(obj) {
            if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
                return obj;
            if (obj instanceof Date || typeof obj === "object")
                var temp = new obj.constructor(); //or new Date(obj);
            else
                var temp = obj.constructor();
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    obj['isActiveClone'] = null;
                    temp[key] = Tools_3.copyObject(obj[key]);
                    delete obj['isActiveClone'];
                }
            }
            return temp;
        }
        /*   static copyObject(src) {
              lodash();
               //@ts-ignore
               return _.cloneDeep(src);
       
           }*/
        /**
               * converts a json string to a object
               * @param {string} value - the code
               */
        static jsonToObject(code) {
            //var ret=eval("("+value+")");
            code = "a=" + code;
            var sourceFile = ts.createSourceFile('hallo.ts', code, ts.ScriptTarget.ES5, true);
            var ret = Tools_3.visitNode2(sourceFile);
            return ret;
        }
        static replaceQuotes(value) {
            if (Array.isArray(value)) {
                for (var x = 0; x < value.length; x++) {
                    if (typeof (value[x]) === "object") {
                        value[x] = this.replaceQuotes(value[x]);
                    }
                }
                return value;
            }
            //if (typeof (value) === "object") {
            var ret = {};
            for (var key in value) {
                var newkey = "$%)" + key + "$%)";
                ret[newkey] = value[key];
                if (typeof value[key] === "object") {
                    ret[newkey] = this.replaceQuotes(ret[newkey]);
                }
            }
            return ret;
            //}
        }
        /**
       * converts a string to a object
       * @param value - the object to stringify
       * @param space - the space before the property
       * @param nameWithQuotes - if true "key":value else key:value
       */
        static objectToJson(value, space = undefined, nameWithQuotes = true, lengthForLinebreak = undefined) {
            var ovalue = value;
            if (nameWithQuotes === false)
                ovalue = Tools_3.replaceQuotes(Tools_3.copyObject(ovalue));
            var ret = JSON.stringify(ovalue, function (key, value) {
                if (typeof (value) === "function") {
                    let r = value.toString();
                    r = r.replaceAll("\r" + space, "\r");
                    r = r.replaceAll("\n" + space, "\n");
                    r = r.replaceAll("\r", "$§&\r");
                    r = r.replaceAll("\n", "$§&\n");
                    r = r.replaceAll("\t", "$§&\t");
                    r = r.replaceAll('\"', '$§&\"');
                    //  ret=ret.replace("\t\t","");
                    return "$%&" + r + "$%&";
                }
                return value;
            }, "\t");
            if (ret !== undefined) {
                ret = ret.replaceAll("\"$%&", "");
                ret = ret.replaceAll("$%&\"", "");
                //  ret = ret.replaceAll("\\r", "\r");
                //  ret = ret.replaceAll("\\n", "\n");
                //  ret = ret.replaceAll("\\t", "\t");
                //  ret = ret.replaceAll('\\"', '\"');
            }
            if (nameWithQuotes === false) {
                ret = ret.replaceAll("\"$%)", "");
                ret = ret.replaceAll("$%)\"", "");
            }
            ret = ret.replaceAll("$§&\\n", "\n");
            ret = ret.replaceAll("$§&\\r", "\t");
            ret = ret.replaceAll("$§&\\t", "\t");
            ret = ret.replaceAll('$§&\\"', '\"');
            //stick linebreak together
            /* {
                  a:1,
                  b:2
               }
               wird
               { a:1, b:2}
            }*/
            if (lengthForLinebreak) {
                let pos = 0;
                var sret = "";
                var startBlock = undefined;
                var startBlock2 = undefined;
                for (var x = 0; x < ret.length; x++) {
                    if (ret[x] === "{") {
                        startBlock = x;
                    }
                    if (ret[x] === "[") {
                        startBlock2 = x;
                    }
                    if (ret[x] === "}" && startBlock !== undefined) {
                        var test = ret.substring(startBlock, x);
                        if (test.length < lengthForLinebreak) {
                            var neu = ret.substring(0, startBlock);
                            var rep = test.replaceAll("\r", "").replaceAll("\n", "").replaceAll("\t", "");
                            neu += rep;
                            neu += ret.substring(x);
                            ret = neu;
                            x = startBlock + rep.length + 1;
                            startBlock = undefined;
                        }
                    }
                    if (ret[x] === "]" && startBlock2 !== undefined) {
                        var test = ret.substring(startBlock2, x);
                        if (test.length < lengthForLinebreak) {
                            var neu = ret.substring(0, startBlock2);
                            var rep = test.replaceAll("\r", "").replaceAll("\n", "").replaceAll("\t", "");
                            neu += rep;
                            neu += ret.substring(x);
                            ret = neu;
                            x = startBlock2 + rep.length + 1;
                            startBlock2 = undefined;
                        }
                    }
                }
            }
            //one to much
            //  ret=ret.substring(0,ret.length-2)+ret.substring(ret.length-1);
            return ret;
        }
        static toText(node, text) {
            return text.substring(node.pos, node.end).trim();
        }
        static getValueFromNode(node, val, prop) {
        }
        static visitObject(node) {
            if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                var ret = {};
                for (var i = 0; i < node["properties"].length; i++) {
                    var s = node["properties"][i];
                    var name = s["name"].text;
                    ret[name] = Tools_3.visitObject(s["initializer"]);
                }
                return ret;
            }
            else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) { //[]
                let ret = [];
                for (let i = 0; i < node["elements"].length; i++) {
                    let ob = this.visitObject(node["elements"][i]);
                    ret.push(ob);
                    /* if (s["initializer"].elements[i].kind === ts.SyntaxKind.ObjectLiteralExpression) {
                         ob[name].push(_newob);
                         Tools.visitNode2(code, s["initializer"].elements[i], _newob);
                     }*/
                }
                return ret;
            }
            else if (node.kind === ts.SyntaxKind.StringLiteral) {
                return node.getText().substring(1, node.getText().length - 1);
            }
            else if (node.kind === ts.SyntaxKind.NumericLiteral) {
                return new Number(node.getText());
            }
            else if (node.kind === ts.SyntaxKind.FalseKeyword) {
                return false;
            }
            else if (node.kind === ts.SyntaxKind.TrueKeyword) {
                return true;
            }
            else if (node.getText().startsWith("function")) {
                var func = function () {
                    return node.getText();
                };
                func.toString = function () {
                    return node.getText();
                };
                return func;
            }
            else {
                return node.getText();
            }
        }
        static visitNode2(node) {
            if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                return Tools_3.visitObject(node);
            }
            else {
                var childs = node.getChildren();
                for (var x = 0; x < childs.length; x++) {
                    var ret = Tools_3.visitNode2(childs[x]);
                    if (ret)
                        return ret;
                }
            }
            return undefined;
        }
        static visitNode(code, node, ob) {
            if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                node["properties"].forEach((s) => {
                    var name = s["name"].text;
                    var val = s["initializer"].getText(); //Tools.toText(s["initializer"], code);
                    if (s["initializer"].kind === ts.SyntaxKind.ObjectLiteralExpression) {
                        ob[name] = {};
                        Tools_3.visitNode(code, s, ob[name]);
                    }
                    else {
                        if (s["initializer"].kind === ts.SyntaxKind.StringLiteral) {
                            ob[name] = val;
                        }
                        else
                            ob[name] = val;
                    }
                });
            }
            else
                node.getChildren().forEach(c => {
                    Tools_3.visitNode(code, c, ob);
                });
        }
        /**
         * parse a json string and returns an object an embed all values in string
         * e.g.
         * { a:"hallo",i:{b:9,c:"test"}} would be convert to{ a:""hallo"",i:{b:"9",c:""test""}}
         **/
        static jsonToStringObject(code) {
            code = "a=" + code;
            var sourceFile = ts.createSourceFile('hallo.ts', code, ts.ScriptTarget.ES5, true);
            var ret = {};
            Tools_3.visitNode(code, sourceFile, ret);
            return ret;
        }
        static _stringObjectToJson(ob, ret) {
            for (var key in ob) {
                if (typeof (ob[key]) === "string") {
                    ret[key] = "%&&/" + ob[key] + "%&&/";
                }
                else {
                    ret[key] = {};
                    Tools_3._stringObjectToJson(ob[key], ret[key]);
                }
            }
        }
        /**
        * parse a json string and returns an object an embed all values in string
        * e.g.
        * { a:"hallo",i:{b:9,c:"test"}} would be convert to{ a:""hallo"",i:{b:"9",c:""test""}}
        **/
        static stringObjectToJson(ob, space) {
            var ret = {};
            Tools_3._stringObjectToJson(ob, ret);
            var sret = JSON.stringify(ret, function (key, value) {
                //rename propertynames
                if (typeof (value) === "object") {
                    var keys = Object.assign({}, value);
                    for (var key in keys) {
                        value["<<&START" + key + "END&>>"] = value[key];
                        delete value[key];
                    }
                }
                return value;
            }, "      ");
            sret = sret.replaceAll("\\\"%&&/", "").replaceAll("%&&/\\\"", "");
            sret = sret.replaceAll("\"%&&/", "").replaceAll("%&&/\"", "");
            var aret = sret.split("\r");
            for (let x = 0; x < aret.length; x++) {
                aret[x] = space + aret[x];
            }
            var r = aret.join("\r");
            r = r.replaceAll("\\r", "\r");
            r = r.replaceAll("\\n", "\n");
            r = r.replaceAll("\\t", "\t");
            r = r.replaceAll("\"<<&START", "");
            r = r.replaceAll("END&>>\"", "");
            return r;
        }
    };
    exports.Tools = Tools;
    exports.Tools = Tools = Tools_3 = __decorate([
        (0, Registry_113.$Class)("jassijs.util.Tools"),
        __metadata("design:paramtypes", [])
    ], Tools);
    async function test() {
        var k = Tools.objectToJson({
            g: { k: 9, p: 2 },
            a: "h\no", b: 1, c: function () {
                var ad = "\n";
            }
        }, undefined, false, 60);
        console.log(k);
        var k2 = Tools.jsonToObject(k);
        var code = `{ 
	g:function(){
		return 1;
		
	}
	a:"hallo",
	i:{
		b:9,
		c:"test"
		}
	} `;
        var h = await Tools.jsonToStringObject(code);
        var h2 = Tools.stringObjectToJson(h, "    ");
        var j = {
            body: [
                ['Item', 'Price'],
                {
                    foreach: "line in invoice.lines", do: [
                        '{{line.text}}', '{{line.price}}'
                    ]
                }
            ]
        };
        var j2 = Tools.objectToJson(j, undefined, false);
        var g = Tools.jsonToObject(j2);
    }
});
//this file is autogenerated don't modify
define("jassijs/registry", ["require"], function (require) {
    return {
        default: {
            "jassijs/base/ActionNode.ts": {
                "date": 1655556796000,
                "jassijs.base.ActionNode": {}
            },
            "jassijs/base/Actions.ts": {
                "date": 1681570168000,
                "jassijs.base.Actions": {}
            },
            "jassijs/base/CurrentSettings.ts": {
                "date": 1655740040000
            },
            "jassijs/base/Errors.ts": {
                "date": 1720116065571.527
            },
            "jassijs/base/Extensions.ts": {
                "date": 1655549184000
            },
            "jassijs/base/LoginDialog.ts": {
                "date": 1683051936000
            },
            "jassijs/base/PropertyEditorService.ts": {
                "date": 1721676432668.211,
                "jassijs.base.PropertyEditorService": {}
            },
            "jassijs/base/Router.ts": {
                "date": 1655556796000,
                "jassijs.base.Router": {}
            },
            "jassijs/base/Windows.ts": {
                "date": 1720115647321.4683,
                "jassijs.base.Windows": {}
            },
            "jassijs/ext/goldenlayout.ts": {
                "date": 1657655070000
            },
            "jassijs/ext/jquerylib.ts": {
                "date": 1657655350000
            },
            "jassijs/ext/papaparse.ts": {
                "date": 1657656072000
            },
            "jassijs/ext/spectrum.ts": {
                "date": 1657656778000
            },
            "jassijs/ext/tabulator.ts": {
                "date": 1683657412000
            },
            "jassijs/ext/tinymce.ts": {
                "date": 1657658562000
            },
            "jassijs/modul.ts": {
                "date": 1683648574000
            },
            "jassijs/remote/Classes.ts": {
                "date": 1686759604000,
                "jassijs.remote.JassiError": {},
                "jassijs.remote.Classes": {}
            },
            "jassijs/remote/ClientError.ts": {
                "date": 1655556930000,
                "jassijs.remote.ClientError": {}
            },
            "jassijs/remote/Config.ts": {
                "date": 1719331708682.118
            },
            "jassijs/remote/Database.ts": {
                "date": 1655556796000,
                "jassijs.remote.Database": {}
            },
            "jassijs/remote/DatabaseTools.ts": {
                "date": 1681309882000,
                "jassijs.remote.DatabaseTools": {
                    "@members": {
                        "runSQL": {
                            "ValidateFunctionParameter": []
                        }
                    }
                }
            },
            "jassijs/remote/DBArray.ts": {
                "date": 1655556796000,
                "jassijs.remote.DBArray": {}
            },
            "jassijs/remote/DBObject.ts": {
                "date": 1697209147073.5745,
                "jassijs.remote.DBObject": {}
            },
            "jassijs/remote/DBObjectQuery.ts": {
                "date": 1623876714000
            },
            "jassijs/remote/Extensions.ts": {
                "date": 1626209336000
            },
            "jassijs/remote/FileNode.ts": {
                "date": 1655556796000,
                "jassijs.remote.FileNode": {}
            },
            "jassijs/remote/hallo.ts": {
                "date": 1622985410000
            },
            "jassijs/remote/Jassi.ts": {
                "date": 1697209123749.7214
            },
            "jassijs/remote/jassijsGlobal.ts": {
                "date": 1655549782000
            },
            "jassijs/remote/Modules.ts": {
                "date": 1682799476000
            },
            "jassijs/remote/ObjectTransaction.ts": {
                "date": 1622985414000
            },
            "jassijs/remote/Registry.ts": {
                "date": 1721754483315.839
            },
            "jassijs/remote/RemoteObject.ts": {
                "date": 1655556866000,
                "jassijs.remote.RemoteObject": {}
            },
            "jassijs/remote/RemoteProtocol.ts": {
                "date": 1655556796000,
                "jassijs.remote.RemoteProtocol": {}
            },
            "jassijs/remote/security/Group.ts": {
                "date": 1682888736000,
                "jassijs.security.Group": {
                    "$DBObject": [
                        {
                            "name": "jassijs_group"
                        }
                    ],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "name": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "parentRights": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "JoinTable": [],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        },
                        "rights": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "JoinTable": [],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        },
                        "users": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "jassijs/remote/security/ParentRight.ts": {
                "date": 1681581398000,
                "jassijs.security.ParentRight": {
                    "$DBObject": [
                        {
                            "name": "jassijs_parentright"
                        }
                    ],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryGeneratedColumn": []
                        },
                        "name": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "classname": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "i1": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "i2": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "s1": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "s2": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "groups": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "jassijs/remote/security/Right.ts": {
                "date": 1681322768000,
                "jassijs.security.Right": {
                    "$DBObject": [
                        {
                            "name": "jassijs_right"
                        }
                    ],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "name": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "groups": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "jassijs/remote/security/Rights.ts": {
                "date": 1655556796000,
                "jassijs.security.Rights": {}
            },
            "jassijs/remote/security/Setting.ts": {
                "date": 1681316436000,
                "jassijs.security.Setting": {
                    "$DBObject": [
                        {
                            "name": "jassijs_setting"
                        }
                    ],
                    "@members": {
                        "id": {
                            "ValidateIsInt": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryColumn": []
                        },
                        "data": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/remote/security/User.ts": {
                "date": 1681329604000,
                "jassijs.security.User": {
                    "$DBObject": [
                        {
                            "name": "jassijs_user"
                        }
                    ],
                    "@members": {
                        "id": {
                            "ValidateIsNumber": [
                                {
                                    "optional": true
                                }
                            ],
                            "PrimaryGeneratedColumn": []
                        },
                        "email": {
                            "ValidateIsString": [],
                            "Column": []
                        },
                        "password": {
                            "ValidateIsString": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "select": false
                                }
                            ]
                        },
                        "groups": {
                            "ValidateIsArray": [
                                {
                                    "optional": true,
                                    "type": "function"
                                }
                            ],
                            "JoinTable": [],
                            "ManyToMany": [
                                "function",
                                "function"
                            ]
                        },
                        "isAdmin": {
                            "ValidateIsBoolean": [
                                {
                                    "optional": true
                                }
                            ],
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/remote/Server.ts": {
                "date": 1695399507170.7808,
                "jassijs.remote.Server": {
                    "@members": {
                        "dir": {
                            "ValidateFunctionParameter": []
                        },
                        "zip": {
                            "ValidateFunctionParameter": []
                        },
                        "loadFiles": {
                            "ValidateFunctionParameter": []
                        },
                        "loadFile": {
                            "ValidateFunctionParameter": []
                        },
                        "saveFiles": {
                            "ValidateFunctionParameter": []
                        },
                        "saveFile": {
                            "ValidateFunctionParameter": []
                        },
                        "testServersideFile": {
                            "ValidateFunctionParameter": []
                        },
                        "removeServerModul": {
                            "ValidateFunctionParameter": []
                        },
                        "delete": {
                            "ValidateFunctionParameter": []
                        },
                        "rename": {
                            "ValidateFunctionParameter": []
                        },
                        "createFile": {
                            "ValidateFunctionParameter": []
                        },
                        "createFolder": {
                            "ValidateFunctionParameter": []
                        },
                        "createModule": {
                            "ValidateFunctionParameter": []
                        }
                    }
                }
            },
            "jassijs/remote/Serverservice.ts": {
                "date": 1695999826188.6174
            },
            "jassijs/remote/Settings.ts": {
                "date": 1681315776000,
                "jassijs.remote.Settings": {
                    "@members": {
                        "remove": {
                            "ValidateFunctionParameter": []
                        },
                        "save": {
                            "ValidateFunctionParameter": []
                        },
                        "saveAll": {
                            "ValidateFunctionParameter": []
                        }
                    }
                }
            },
            "jassijs/remote/Test.ts": {
                "date": 1655556930000,
                "jassijs.remote.Test": {}
            },
            "jassijs/remote/Transaction.ts": {
                "date": 1655556866000,
                "jassijs.remote.Transaction": {}
            },
            "jassijs/remote/Validator.ts": {
                "date": 1681322648000
            },
            "jassijs/security/GroupView.ts": {
                "date": 1722608022347.401,
                "jassijs/security/GroupView": {
                    "$DBObjectView": [
                        {
                            "classname": "jassijs.security.Group",
                            "icon": "mdi mdi-account-group",
                            "actionname": "Administration/Security/Groups"
                        }
                    ]
                }
            },
            "jassijs/security/UserView.ts": {
                "date": 1722610068691.7795,
                "jassijs/security/UserView": {
                    "$DBObjectView": [
                        {
                            "classname": "jassijs.security.User",
                            "actionname": "Administration/Security/Users",
                            "icon": "mdi mdi-account-key-outline",
                            "queryname": "findWithRelations"
                        }
                    ]
                }
            },
            "jassijs/ui/ActionNodeMenu.ts": {
                "date": 1697206579333.4006,
                "jassijs/ui/ActionNodeMenu": {}
            },
            "jassijs/ui/BoxPanel.ts": {
                "date": 1721763062471.5164,
                "jassijs.ui.BoxPanel": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/BoxPanel",
                            "icon": "mdi mdi-view-sequential-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "name": "isAbsolute",
                            "hide": true,
                            "type": "boolean"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Button.ts": {
                "date": 1720246151798.6426,
                "jassijs.ui.Button": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Button",
                            "icon": "mdi mdi-gesture-tap-button",
                            "initialize": {
                                "text": "button"
                            }
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Calendar.ts": {
                "date": 1719769978901.3284,
                "jassijs.ui.Calendar": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Calendar",
                            "icon": "mdi mdi-calendar-month"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "string"
                        }
                    ]
                }
            },
            "jassijs/ui/Checkbox.ts": {
                "date": 1720458180025.6687,
                "jassijs.ui.Checkbox": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Ceckbox",
                            "icon": "mdi mdi-checkbox-marked-outline"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Component.ts": {
                "date": 1722432039088.2495,
                "jassijs.ui.Component": {
                    "$Property": [
                        {
                            "name": "testuw",
                            "type": "string"
                        }
                    ],
                    "@members": {}
                },
                "jassijs.ui.HTMLComponent": {
                    "$Property": [
                        {
                            "name": "children",
                            "type": "jassijs.ui.Component",
                            "createDummyInDesigner": "doCreateDummyForHTMLComponent"
                        }
                    ],
                    "@members": {}
                },
                "jassijs.ui.TextComponent": {
                    "@members": {}
                }
            },
            "jassijs/ui/ComponentDescriptor.ts": {
                "date": 1721651327481.3347,
                "jassijs.ui.ComponentDescriptor": {}
            },
            "jassijs/ui/Container.ts": {
                "date": 1721763066839.484,
                "jassijs.ui.Container": {
                    "$Property": [
                        {
                            "name": "children",
                            "type": "jassijs.ui.Component"
                        }
                    ]
                }
            },
            "jassijs/ui/ContextMenu.ts": {
                "date": 1719778747000.2986,
                "jassijs.ui.ContextMenu": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/ContextMenu",
                            "icon": "mdi mdi-dots-vertical",
                            "editableChildComponents": [
                                "menu"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/converters/DateTimeConverter.ts": {
                "date": 1681559014000,
                "jassijs.ui.converters.DateTimeConverterProperies": {
                    "@members": {}
                },
                "jassijs.ui.converters.DateTimeConverter": {
                    "$Converter": [
                        {
                            "name": "datetime"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.converters.DateTimeConverterProperties"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/converters/DefaultConverter.ts": {
                "date": 1657922212000,
                "jassijs.ui.converters.DefaultConverterProperties": {
                    "@members": {}
                },
                "jassijs.ui.converters.DefaultConverter": {
                    "$Converter": [
                        {
                            "name": "custom"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.converters.DefaultConverterProperties"
                        }
                    ]
                }
            },
            "jassijs/ui/converters/NumberConverter.ts": {
                "date": 1658334942000,
                "jassijs.ui.converters.NumberConverterProperies": {
                    "@members": {}
                },
                "jassijs.ui.converters.NumberConverter": {
                    "$Converter": [
                        {
                            "name": "number"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.converters.NumberConverterProperies"
                        }
                    ]
                }
            },
            "jassijs/ui/converters/StringConverter.ts": {
                "date": 1657129814000,
                "jassijs.ui.converters.StringConverterProperies": {
                    "@members": {}
                },
                "jassijs.ui.converters.StringConverter": {
                    "$Converter": [
                        {
                            "name": "string"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.converters.StringConverterProperies"
                        }
                    ]
                }
            },
            "jassijs/ui/CSSProperties.ts": {
                "date": 1698507590656.5051,
                "jassijs.ui.CSSProperties": {
                    "@members": {}
                }
            },
            "jassijs/ui/DataComponent.ts": {
                "date": 1722610184187.7512,
                "jassijs.ui.DataComponent": {
                    "@members": {}
                }
            },
            "jassijs/ui/DBObjectDialog.ts": {
                "date": 1721687478072.3645,
                "jassijs.ui.DBObjectDialog": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "createActions": {
                            "$Actions": []
                        }
                    }
                }
            },
            "jassijs/ui/DBObjectExplorer.ts": {
                "date": 1655556796000,
                "jassijs.ui.DBObjectNode": {},
                "jassijs.ui.DBFileActions": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "ViewData": {
                            "$Action": [
                                {
                                    "name": "View Data",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                },
                "jassijs.ui.DBObjectActions": {
                    "$ActionProvider": [
                        "jassijs.ui.DBObjectNode"
                    ],
                    "@members": {
                        "ViewData": {
                            "$Action": [
                                {
                                    "name": "View Data"
                                }
                            ]
                        },
                        "OpenCode": {
                            "$Action": [
                                {
                                    "name": "Open Code"
                                }
                            ]
                        }
                    }
                },
                "jassijs.ui.DBObjectExplorer": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "dummy": {
                            "$Action": [
                                {
                                    "name": "Windows",
                                    "icon": "mdi mdi-iframe-array-outline"
                                }
                            ]
                        },
                        "dummy2": {
                            "$Action": [
                                {
                                    "name": "Windows/Development",
                                    "icon": "mdi mdi-dev-to"
                                }
                            ]
                        },
                        "show": {
                            "$Action": [
                                {
                                    "name": "Windows/Development/DBObjects",
                                    "icon": "mdi mdi-database-search"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/ui/DBObjectView.ts": {
                "date": 1722610210933.4746,
                "jassijs/ui/DBObjectView": {
                    "@members": {}
                }
            },
            "jassijs/ui/DockingContainer.ts": {
                "date": 1719608546166.3955,
                "jassijs.ui.DockingContainer": {}
            },
            "jassijs/ui/HTMLEditorPanel.ts": {
                "date": 1655641682000,
                "jassijs.ui.HTMLEditorPanel": {}
            },
            "jassijs/ui/InvisibleComponent.ts": {
                "date": 1719775654357.0962,
                "jassijs.ui.InvisibleComponent": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ]
                }
            },
            "jassijs/ui/Menu.ts": {
                "date": 1721762942678.6074,
                "jassijs.ui.Menu": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Menu",
                            "icon": "mdi mdi-menu",
                            "initialize": {
                                "text": "menu"
                            }
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Notify.ts": {
                "date": 1655585212000
            },
            "jassijs/ui/ObjectChooser.ts": {
                "date": 1722193753659.7104,
                "jassijs.ui.ObjectChooser": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/ObjectChooser",
                            "icon": "mdi mdi-glasses"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/OptionDialog.ts": {
                "date": 1656067784000,
                "jassijs.ui.OptionDialog": {
                    "@members": {}
                },
                "jassijs.ui.OptionDialogTestProp": {
                    "@members": {}
                }
            },
            "jassijs/ui/Panel.ts": {
                "date": 1722600511317.7644,
                "jassijs.ui.Panel": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Panel",
                            "icon": "mdi mdi-checkbox-blank-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.PanelProperties"
                        },
                        {
                            "name": "new/useSpan",
                            "type": "boolean",
                            "default": false
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Property.ts": {
                "date": 1722004167335.1917,
                "jassijs.ui.Property": {}
            },
            "jassijs/ui/PropertyEditors/BooleanEditor.ts": {
                "date": 1655556866000,
                "jassijs.ui.PropertyEditors.BooleanEditor": {
                    "$PropertyEditor": [
                        [
                            "boolean"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/ClassSelectorEditor.ts": {
                "date": 1657571442000,
                "jassijs.ui.PropertyEditors.ClassSelectorEditor": {
                    "$PropertyEditor": [
                        [
                            "classselector"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/ColorEditor.ts": {
                "date": 1656017118000,
                "jassijs.ui.PropertyEditors.ColorEditor": {
                    "$PropertyEditor": [
                        [
                            "color"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/ComponentEditor.ts": {
                "date": 1696713045170.9973,
                "jassijs.ui.PropertyEditors.ComponentEditor": {
                    "$PropertyEditor": [
                        [
                            "jassijs.ui.Component"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/ComponentSelectorEditor.ts": {
                "date": 1655556796000,
                "jassijs.ui.PropertyEditors.ComponentSelectorEditor": {
                    "$PropertyEditor": [
                        [
                            "componentselector"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/DatabinderEditor.ts": {
                "date": 1722589839416.9033,
                "jassijs.ui.PropertyEditors.DatabinderEditor": {
                    "$PropertyEditor": [
                        [
                            "databinder"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/DBObjectEditor.ts": {
                "date": 1721680313435.5005,
                "jassijs.ui.PropertyEditors.DBObjectEditor": {
                    "$PropertyEditor": [
                        [
                            "dbobject"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/DefaultEditor.ts": {
                "date": 1697402486773.8264,
                "jassijs.ui.PropertyEditors.DefaultEditor": {
                    "$PropertyEditor": [
                        [
                            "string",
                            "number",
                            "number[]",
                            "boolean[]"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/Editor.ts": {
                "date": 1655556796000,
                "jassijs.ui.PropertyEditors.Editor": {}
            },
            "jassijs/ui/PropertyEditors/FontEditor.ts": {
                "date": 1655556866000,
                "jassijs.ui.PropertyEditors.FontEditor": {
                    "$PropertyEditor": [
                        [
                            "font"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/FunctionEditor.ts": {
                "date": 1655556866000,
                "jassijs.ui.PropertyEditors.FunctionEditor": {
                    "$PropertyEditor": [
                        [
                            "function"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/HTMLEditor.ts": {
                "date": 1655556866000,
                "jassijs.ui.PropertyEditors.HTMLEditor": {
                    "$PropertyEditor": [
                        [
                            "html"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/ImageEditor.ts": {
                "date": 1656189492000,
                "jassijs.ui.PropertyEditors.ImageEditor": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "$PropertyEditor": [
                        [
                            "image"
                        ]
                    ],
                    "@members": {
                        "dummy": {
                            "$Action": [
                                {
                                    "name": "Tools",
                                    "icon": "mdi mdi-tools"
                                }
                            ]
                        },
                        "show": {
                            "$Action": [
                                {
                                    "name": "Tools/Icons",
                                    "icon": "mdi mdi-image-area"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/ui/PropertyEditors/JsonArrayEditor.ts": {
                "date": 1697199579697.335,
                "jassijs.ui.PropertyEditors.JsonArrayEditor": {
                    "$PropertyEditor": [
                        [
                            "jsonarray"
                        ]
                    ]
                },
                "jassijs.ui.JsonArrayEditor.TestProperties": {
                    "@members": {}
                },
                "jassijs.ui.JsonArrayEditor.TestProperties2": {
                    "@members": {}
                }
            },
            "jassijs/ui/PropertyEditors/JsonEditor.ts": {
                "date": 1721755050984.9895,
                "jassijs.ui.PropertyEditors.JsonEditor": {
                    "$PropertyEditor": [
                        [
                            "json"
                        ]
                    ]
                },
                "jassijs.ui.PropertyEditorTestProperties2": {
                    "@members": {}
                },
                "jassijs.ui.PropertyEditorTestProperties": {
                    "@members": {}
                }
            },
            "jassijs/ui/PropertyEditors/NameEditor.ts": {
                "date": 1721495087931.3462,
                "jassijs.ui.PropertyEditors.NameEditor": {
                    "$PropertyEditor": [
                        [
                            "*name*"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/TableColumnImport.ts": {
                "date": 1657049000000,
                "jassijs/ui/PropertyEditors/TableColumnImport": {}
            },
            "jassijs/ui/Select.ts": {
                "date": 1722606114318.6875,
                "jassijs.ui.Select": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Select",
                            "icon": "mdi mdi-form-dropdown"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.SelectProperties"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/SettingsDialog.ts": {
                "date": 1698507857246.2312,
                "jassijs.ui.SettingsObject": {},
                "jassijs.ui.SettingsDialog": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "show": {
                            "$Action": [
                                {
                                    "name": "Settings",
                                    "icon": "mdi mdi-settings-helper"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/ui/Style.ts": {
                "date": 1719755851416.894,
                "jassijs.ui.Style": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Style",
                            "icon": "mdi mdi-virus"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Table.ts": {
                "date": 1721754550199.457,
                "jassijs.ui.TableEditorProperties": {
                    "@members": {}
                },
                "jassijs.ui.Table": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Table",
                            "icon": "mdi mdi-grid"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.TableEditorProperties"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Textarea.ts": {
                "date": 1719770473688.5388,
                "jassijs.ui.Textarea": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Textarea",
                            "icon": "mdi mdi-text-box-outline"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "string"
                        }
                    ]
                }
            },
            "jassijs/ui/Textbox.ts": {
                "date": 1722607447334.1543,
                "jassijs.ui.Textbox": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Textbox",
                            "icon": "mdi mdi-form-textbox"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Tree.ts": {
                "date": 1719768890018.7583,
                "jassijs.ui.TreeEditorPropertiesMulti": {
                    "@members": {}
                },
                "jassijs.ui.TreeEditorProperties": {
                    "@members": {}
                },
                "jassijs.ui.Tree": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Tree",
                            "icon": "mdi mdi-file-tree"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.TreeEditorProperties"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Upload.ts": {
                "date": 1719770567272.5264,
                "jassijs.ui.Upload": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Upload",
                            "icon": "mdi mdi-cloud-upload-outline"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/VariablePanel.ts": {
                "date": 1721762514604.182,
                "jassijs.ui.VariablePanel": {}
            },
            "jassijs/util/Cookies.ts": {
                "date": 1720099914948.8174
            },
            "jassijs/util/CSVImport.ts": {
                "date": 1697199596581.038,
                "jassijs.util.CSVImport": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Database CSV-Import",
                                    "icon": "mdi mdi-database-import"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs/util/DatabaseSchema.ts": {
                "date": 1622984214000
            },
            "jassijs/util/Numberformatter.ts": {
                "date": 1657046808000,
                "jassijs.util.Numberformatter": {}
            },
            "jassijs/util/Reloader.ts": {
                "date": 1697201960827.66,
                "jassijs.util.Reloader": {}
            },
            "jassijs/util/Runlater.ts": {
                "date": 1655556796000,
                "jassi.util.Runlater": {}
            },
            "jassijs/util/Tools.ts": {
                "date": 1657655420000,
                "jassijs.util.Tools": {}
            },
            "jassijs/ui/State.ts": {
                "date": 1722584965641.039
            },
            "jassijs/ui/StateBinder.ts": {
                "date": 1722607242193.9792
            },
            "jassijs/ui/Repeater2.ts": {
                "date": 1722280627736.2734,
                "jassijs.ui.Repeater2": {
                    "@members": {}
                }
            },
            "jassijs/ui/HTMLPanel.tsx": {
                "date": 1722193753694.9727,
                "jassijs.ui.HTMLPanel": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/HTMLPanel",
                            "icon": "mdi mdi-cloud-tags"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Image.tsx": {
                "date": 1719770180674.2976,
                "jassijs.ui.Image": {
                    "$UIComponent": [
                        {
                            "fullPath": "default/Image",
                            "icon": "mdi mdi-file-image"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/MenuItem.tsx": {
                "date": 1721754305868.5278,
                "jassijs.ui.MenuItem": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/MenuItem",
                            "icon": "mdi mdi-menu-open",
                            "initialize": {
                                "text": "menu"
                            },
                            "editableChildComponents": [
                                "items"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/PropertyEditor.tsx": {
                "date": 1721754309694.6438,
                "jassijs.ui.PropertyEditor": {},
                "jassijs.ui.PropertyEditorTestSubProperties": {
                    "@members": {}
                },
                "jassijs.ui.PropertyEditorTestProperties": {
                    "@members": {}
                }
            },
            "jassijs/ui/TinymcePanel.ts": {
                "date": 1721805715426.5576,
                "jassijs.ui.TinymcePanel": {
                    "@members": {}
                }
            }
        }
    };
});
//# sourceMappingURL=jassijs.js.map