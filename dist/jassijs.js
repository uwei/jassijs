var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
    exports.test = exports.ActionNode = void 0;
    let ActionNode = class ActionNode {
    };
    ActionNode = __decorate([
        Registry_1.$Class("jassijs.base.ActionNode")
    ], ActionNode);
    exports.ActionNode = ActionNode;
    async function test() {
        var Actions = (await new Promise((resolve_1, reject_1) => { require(["jassijs/base/Actions"], resolve_1, reject_1); })).Actions;
        var actions = await Actions.getActionsFor([new ActionNode()]); //Class Actions
        console.log("found " + actions.length + " Actions");
    }
    exports.test = test;
});
define("jassijs/base/Actions", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Registry_2, Registry_3, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Actions = exports.$ActionProvider = exports.$Action = exports.$Actions = exports.ActionProperties = void 0;
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
    exports.$Actions = $Actions;
    function $Action(property) {
        return function (target, propertyKey, descriptor) {
            Registry_2.default.registerMember("$Action", target, propertyKey, property);
        };
    }
    exports.$Action = $Action;
    function $ActionProvider(longclassname) {
        return function (pclass) {
            Registry_2.default.register("$ActionProvider", pclass);
        };
    }
    exports.$ActionProvider = $ActionProvider;
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
    Actions = __decorate([
        Registry_3.$Class("jassijs.base.Actions")
    ], Actions);
    exports.Actions = Actions;
    async function test() {
    }
    exports.test = test;
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
    exports.test = exports.login = exports.doAfterLogin = void 0;
    var queue = [];
    function doAfterLogin(resolve, prot) {
        queue.push([resolve, prot]);
    }
    exports.doAfterLogin = doAfterLogin;
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
    exports.login = login;
    function test() {
        //  login();
    }
    exports.test = test;
});
define("jassijs/base/PropertyEditorService", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Registry_5, Classes_2, Registry_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propertyeditor = exports.PropertyEditorService = void 0;
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
            }
            else {
                if (this.data[property.type] === undefined) {
                    return this.loadType(property.type);
                }
                else
                    sclass = this.data[property.type][0];
            }
            var oclass = Classes_2.classes.getClass(sclass);
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
    PropertyEditorService = __decorate([
        Registry_5.$Class("jassijs.base.PropertyEditorService"),
        __metadata("design:paramtypes", [])
    ], PropertyEditorService);
    exports.PropertyEditorService = PropertyEditorService;
    var propertyeditor = new PropertyEditorService();
    exports.propertyeditor = propertyeditor;
});
define("jassijs/base/Router", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/ComponentDescriptor", "jassijs/base/Windows"], function (require, exports, Registry_7, Classes_3, ComponentDescriptor_1, Windows_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.router = exports.Router = void 0;
    new Promise((resolve_2, reject_2) => { require(["jassijs/remote/Classes"], resolve_2, reject_2); });
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
    Router = __decorate([
        Registry_7.$Class("jassijs.base.Router"),
        __metadata("design:paramtypes", [])
    ], Router);
    exports.Router = Router;
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
            this.restoreWindows();
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
            new Promise((resolve_3, reject_3) => { require(["./Router"], resolve_3, reject_3); }).then(function (router) {
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
    Windows = __decorate([
        Registry_8.$Class("jassijs.base.Windows"),
        __metadata("design:paramtypes", [])
    ], Windows);
    exports.Windows = Windows;
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
        default: sm
    };
});
define("jassijs/ext/spectrum", ["require", "exports", "spectrum", "jassijs/modul"], function (require, exports, spectrum, modul_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //'spectrum':'//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min'
    var path = modul_1.default.require.paths["spectrum"];
    //path=path.substring(0,path.lastIndexOf("/"));
    jassijs.myRequire(path + ".css");
});
define("tabulator-tables", ["require", "exports", "tabulatorlib", "jassijs/modul"], function (require, exports, tabulator, modul_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tabulator = void 0;
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
                'tinymcelib': tinyurl + '/tinymce.min',
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
                "date": 1655726580000
            },
            "jassijs/base/Extensions.ts": {
                "date": 1655549184000
            },
            "jassijs/base/LoginDialog.ts": {
                "date": 1683051936000
            },
            "jassijs/base/PropertyEditorService.ts": {
                "date": 1657571268000,
                "jassijs.base.PropertyEditorService": {}
            },
            "jassijs/base/Router.ts": {
                "date": 1655556796000,
                "jassijs.base.Router": {}
            },
            "jassijs/base/Windows.ts": {
                "date": 1657655076000,
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
                "date": 1686853238000
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
                "date": 1681317356000,
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
                "date": 1695580332624.7742
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
                "date": 1686762490000
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
                "date": 1681328192000,
                "jassijs/security/GroupView": {
                    "$DBObjectView": [
                        {
                            "classname": "jassijs.security.Group",
                            "icon": "mdi mdi-account-group",
                            "actionname": "Administration/Security/Groups"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/security/UserView.ts": {
                "date": 1681330006000,
                "jassijs/security/UserView": {
                    "$DBObjectView": [
                        {
                            "classname": "jassijs.security.User",
                            "actionname": "Administration/Security/Users",
                            "icon": "mdi mdi-account-key-outline",
                            "queryname": "findWithRelations"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/server/Compile.ts": {
                "date": 1696792044302.5027
            },
            "jassijs/server/DatabaseSchema.ts": {
                "date": 1682241710000
            },
            "jassijs/server/DBManager.ts": {
                "date": 1682710552000,
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
                "date": 1684401442000,
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
                "date": 1684515212000
            },
            "jassijs/server/Installserver.ts": {
                "date": 1682930464000
            },
            "jassijs/server/LocalFS.ts": {
                "date": 1684358616000
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
                "date": 1686927696000,
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
                "date": 1655556796000,
                "jassijs/ui/ActionNodeMenu": {}
            },
            "jassijs/ui/BoxPanel.ts": {
                "date": 1696687199000.2588,
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
                "date": 1696716964055.2097,
                "jassijs.ui.ButtonProperties": {
                    "@members": {}
                },
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
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.ButtonProperties"
                        }
                    ]
                }
            },
            "jassijs/ui/Calendar.ts": {
                "date": 1696687306198.7598,
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
                "date": 1696687306208.776,
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
                "date": 1696716743889.7158,
                "jassijs.ui.ComponentProperties": {
                    "@members": {}
                },
                "jassijs.ui.Component": {
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.ComponentProperties"
                        }
                    ]
                },
                "jassijs.ui.HTMLComponent": {},
                "jassijs.ui.TextComponent": {
                    "@members": {}
                }
            },
            "jassijs/ui/ComponentDescriptor.ts": {
                "date": 1696717595128.208,
                "jassijs.ui.ComponentDescriptor": {}
            },
            "jassijs/ui/Container.ts": {
                "date": 1697130215042.4993,
                "jassijs.ui.ContainerProperties": {
                    "@members": {}
                },
                "jassijs.ui.Container": {}
            },
            "jassijs/ui/ContextMenu.ts": {
                "date": 1696687306206.7812,
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
                "date": 1656016872000,
                "jassijs.ui.CSSProperties": {
                    "@members": {}
                }
            },
            "jassijs/ui/Databinder.ts": {
                "date": 1681560838000,
                "jassijs.ui.Databinder": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Databinder",
                            "icon": "mdi mdi-connection"
                        }
                    ]
                }
            },
            "jassijs/ui/DataComponent.ts": {
                "date": 1696782620600.11,
                "jassijs.ui.DataComponentProperties": {
                    "@members": {}
                },
                "jassijs.ui.DataComponent": {
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.DataComponentProperties"
                        }
                    ]
                }
            },
            "jassijs/ui/DBObjectDialog.ts": {
                "date": 1681562926000,
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
                "date": 1696687306204.7815,
                "jassijs/ui/DBObjectView": {
                    "$UIComponent": [
                        {
                            "editableChildComponents": [
                                "this",
                                "me.main",
                                "me.toolbar",
                                "me.save",
                                "me.remove",
                                "me.refresh",
                                "me.databinder"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/DesignDummy.ts": {
                "date": 1655755336000,
                "jassijs.ui.DesignDummy": {}
            },
            "jassijs/ui/DockingContainer.ts": {
                "date": 1681513934000,
                "jassijs.ui.DockingContainer": {}
            },
            "jassijs/ui/HTMLEditorPanel.ts": {
                "date": 1655641682000,
                "jassijs.ui.HTMLEditorPanel": {}
            },
            "jassijs/ui/HTMLPanel.ts": {
                "date": 1697050316322.105,
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
            "jassijs/ui/Image.ts": {
                "date": 1696687306208.776,
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
            "jassijs/ui/InvisibleComponent.ts": {
                "date": 1655843346000,
                "jassijs.ui.InvisibleComponent": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ]
                }
            },
            "jassijs/ui/Menu.ts": {
                "date": 1696691833397.9663,
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
            "jassijs/ui/MenuItem.ts": {
                "date": 1696691833393.435,
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
            "jassijs/ui/Notify.ts": {
                "date": 1655585212000
            },
            "jassijs/ui/ObjectChooser.ts": {
                "date": 1696713688001.8782,
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
                "date": 1697130279944.2292,
                "jassijs.ui.PanelProperties": {
                    "@members": {}
                },
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
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Property.ts": {
                "date": 1658347724000,
                "jassijs.ui.Property": {}
            },
            "jassijs/ui/PropertyEditor.ts": {
                "date": 1696320466897.5088,
                "jassijs.ui.PropertyEditor": {},
                "jassijs.ui.PropertyEditorTestSubProperties": {
                    "@members": {}
                },
                "jassijs.ui.PropertyEditorTestProperties": {
                    "@members": {}
                }
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
                "date": 1656506936000,
                "jassijs.ui.PropertyEditors.DatabinderEditor": {
                    "$PropertyEditor": [
                        [
                            "databinder"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/DBObjectEditor.ts": {
                "date": 1655556866000,
                "jassijs.ui.PropertyEditors.DBObjectEditor": {
                    "$PropertyEditor": [
                        [
                            "dbobject"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/DefaultEditor.ts": {
                "date": 1655556796000,
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
                "date": 1656960820000,
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
                "date": 1658349512000,
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
                "date": 1655556796000,
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
            "jassijs/ui/Repeater.ts": {
                "date": 1696687306208.776,
                "jassijs.ui.RepeaterDesignPanel": {
                    "$UIComponent": [
                        {
                            "editableChildComponents": [
                                "databinder"
                            ]
                        }
                    ]
                },
                "jassijs.ui.Repeater": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Repeater",
                            "icon": "mdi mdi-locker-multiple",
                            "editableChildComponents": [
                                "this",
                                "design"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Select.ts": {
                "date": 1696688613448.2766,
                "jassijs.ui.SelectCreateProperties": {
                    "@members": {}
                },
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
                            "componentType": "jassijs.ui.SelectCreateProperties"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/SettingsDialog.ts": {
                "date": 1681570600000,
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
                "date": 1696687306208.776,
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
                "date": 1696687306210.771,
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
                "date": 1655757394000,
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
                "date": 1696782997596.7163,
                "jassijs.ui.TextboxProperties": {
                    "@members": {}
                },
                "jassijs.ui.Textbox": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Textbox",
                            "icon": "mdi mdi-form-textbox"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.TextboxProperties"
                        }
                    ]
                }
            },
            "jassijs/ui/Tree.ts": {
                "date": 1696687306236.517,
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
                "date": 1655847946000,
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
                "date": 1656066842000,
                "jassijs.ui.VariablePanel": {}
            },
            "jassijs/util/Cookies.ts": {
                "date": 1682364420000
            },
            "jassijs/util/CSVImport.ts": {
                "date": 1681562976000,
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
                "date": 1684441726000,
                "jassijs.util.Reloader": {}
            },
            "jassijs/util/Runlater.ts": {
                "date": 1655556796000,
                "jassi.util.Runlater": {}
            },
            "jassijs/util/Tools.ts": {
                "date": 1657655420000,
                "jassijs.util.Tools": {}
            }
        }
    };
});
define("jassijs/remote/Classes", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.classes = exports.Classes = exports.JassiError = void 0;
    let JassiError = class JassiError extends Error {
        constructor(msg) {
            super(msg);
        }
    };
    JassiError = __decorate([
        $Class("jassijs.remote.JassiError"),
        __metadata("design:paramtypes", [String])
    ], JassiError);
    exports.JassiError = JassiError;
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
            var config = (await new Promise((resolve_4, reject_4) => { require(["./Config"], resolve_4, reject_4); })).config;
            var cl = await Registry_9.default.getJSONData("$Class", classname);
            if (cl === undefined) {
                try {
                    //@ts-ignore
                    if (require.main) { //nodes load project class from module
                        //@ts-ignore 
                        await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                    }
                    else {
                        await new Promise((resolve_5, reject_5) => { require([classname.replaceAll(".", "/")], resolve_5, reject_5); });
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
                    var imp = await new Promise((resolve_6, reject_6) => { require([file.replace(".ts", "")], resolve_6, reject_6); });
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
    Classes = __decorate([
        $Class("jassijs.remote.Classes"),
        __metadata("design:paramtypes", [])
    ], Classes);
    exports.Classes = Classes;
    ;
    let classes = new Classes();
    exports.classes = classes;
    async function test(t) {
        var cl = classes.getClass("jassijs.ui.Button");
        t.expectEqual(cl === await classes.loadClass("jassijs.ui.Button"));
        t.expectEqual(classes.getClassName(cl) === "jassijs.ui.Button");
    }
    exports.test = test;
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
    ClientError = __decorate([
        Registry_10.$Class("jassijs.remote.ClientError"),
        __metadata("design:paramtypes", [String])
    ], ClientError);
    exports.ClientError = ClientError;
});
define("jassijs/remote/Config", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.config = exports.Config = void 0;
    class Config {
        constructor() {
            if (!window.document) {
                this.isServer = true;
                //@ts-ignore
                var fs = require("fs");
                this.init(fs.readFileSync('./client/jassijs.json', 'utf-8'));
            }
        }
        init(configtext) {
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
                this.init(fs.readFileSync('./client/jassijs.json', 'utf-8'));
            }
            else {
                var Server = (await new Promise((resolve_7, reject_7) => { require(["jassijs/remote/Server"], resolve_7, reject_7); })).Server;
                var text = await new Server().loadFile("jassijs.json");
                this.init(text);
            }
        }
        async saveJSON() {
            var myfs = (await new Promise((resolve_8, reject_8) => { require(["jassijs/server/NativeAdapter"], resolve_8, reject_8); })).myfs;
            var fname = './client/jassijs.json';
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
    Database = __decorate([
        Registry_11.$Class("jassijs.remote.Database"),
        __metadata("design:paramtypes", [])
    ], Database);
    exports.Database = Database;
    //@ts-ignore
    var db = new Database();
    exports.db = db;
});
define("jassijs/remote/DatabaseTools", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/Classes", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, Registry_12, RemoteObject_1, Classes_6, Serverservice_1, Validator_1) {
    "use strict";
    var DatabaseTools_1, _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DatabaseTools = void 0;
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
    __decorate([
        Validator_1.ValidateFunctionParameter(),
        __param(0, Validator_1.ValidateIsString()),
        __param(1, Validator_1.ValidateIsArray({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Array, typeof (_a = typeof RemoteObject_1.Context !== "undefined" && RemoteObject_1.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], DatabaseTools, "runSQL", null);
    DatabaseTools = DatabaseTools_1 = __decorate([
        Registry_12.$Class("jassijs.remote.DatabaseTools")
    ], DatabaseTools);
    exports.DatabaseTools = DatabaseTools;
    async function test() {
        /*  var h=await DatabaseTools.runSQL('DROP TABLE :p1,:p2',[
                              {p1:"te_person2",
                                          p2:"tg_person"}]);//,"te_person2"]);*/
        //var h=await DatabaseTools.runSQL('select * from jassijs_rights'); 
    }
    exports.test = test;
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
    DBArray = __decorate([
        Registry_13.$Class("jassijs.remote.DBArray"),
        __metadata("design:paramtypes", [Object])
    ], DBArray);
    exports.DBArray = DBArray;
});
define("jassijs/remote/DBObject", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/RemoteObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Database", "jassijs/remote/Validator", "jassijs/remote/Serverservice"], function (require, exports, Registry_14, Classes_8, RemoteObject_2, Registry_15, DatabaseSchema_1, Database_1, Validator_2, Serverservice_2) {
    "use strict";
    var DBObject_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObject = exports.MyFindManyOptions = exports.$DBObject = void 0;
    let cl = Classes_8.classes; //force Classes
    function $DBObject(options) {
        return function (pclass, ...params) {
            var classname = Classes_8.classes.getClassName(pclass);
            if (!options)
                options = {};
            if (!options.name)
                options.name = classname.toLowerCase().replaceAll(".", "_");
            Registry_15.default.register("$DBObject", pclass, options);
            DatabaseSchema_1.Entity(options)(pclass, ...params); //pass to orginal Entitiy
        };
    }
    exports.$DBObject = $DBObject;
    class MyFindManyOptions {
    }
    exports.MyFindManyOptions = MyFindManyOptions;
    /**
    * base class for all database entfities
    * all objects which use the jassijs.db must implement this
    * @class DBObject
    */
    let DBObject = DBObject_1 = class DBObject extends RemoteObject_2.RemoteObject {
        constructor() {
            super();
        }
        //clear cache on reload
        static _initFunc() {
            Registry_15.default.onregister("$Class", (data, name) => {
                delete DBObject_1.cache[name];
            });
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
            var ret = Validator_2.validate(this, options, throwError);
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
    DBObject.cache = {};
    DBObject._init = DBObject_1._initFunc();
    DBObject = DBObject_1 = __decorate([
        Registry_14.$Class("jassijs.remote.DBObject"),
        __metadata("design:paramtypes", [])
    ], DBObject);
    exports.DBObject = DBObject;
    async function test() {
        var h = Database_1.db.getMetadata(Classes_8.classes.getClass("de.Kunde"));
        // debugger;
    }
    exports.test = test;
});
define("jassijs/remote/DBObjectQuery", ["require", "exports", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Classes_9, Registry_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectQuery = exports.$DBObjectQuery = exports.DBObjectQueryProperties = void 0;
    class DBObjectQueryProperties {
    }
    exports.DBObjectQueryProperties = DBObjectQueryProperties;
    function $DBObjectQuery(property) {
        return function (target, propertyKey, descriptor) {
            var test = Classes_9.classes.getClassName(target);
            Registry_16.default.registerMember("$DBObjectQuery", target, propertyKey, property);
        };
    }
    exports.$DBObjectQuery = $DBObjectQuery;
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
    exports.test = test;
});
define("jassijs/remote/Extensions", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extensions = exports.Extensions = exports.$Extension = void 0;
    function $Extension(forclass) {
        return function (pclass) {
            Registry_17.default.register("$Extension", pclass, forclass);
        };
    }
    exports.$Extension = $Extension;
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
    FileNode = __decorate([
        Registry_18.$Class("jassijs.remote.FileNode"),
        __metadata("design:paramtypes", [String])
    ], FileNode);
    exports.FileNode = FileNode;
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
    exports.migrateModul = exports.Registry = exports.$register = exports.$Class = void 0;
    function $Class(longclassname) {
        return function (pclass) {
            registry.register("$Class", pclass, longclassname);
        };
    }
    exports.$Class = $Class;
    function $register(servicename, ...params) {
        return function (pclass) {
            registry.register(servicename, pclass, params);
        };
    }
    exports.$register = $register;
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
            var m = oclass;
            if (oclass.prototype !== undefined)
                m = oclass.prototype;
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
                var fs = await new Promise((resolve_9, reject_9) => { require(['fs'], resolve_9, reject_9); });
                var Filesystem = await new Promise((resolve_10, reject_10) => { require(["jassijs/server/Filesystem"], resolve_10, reject_10); });
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
                this.isServer = Config_1.config.isServer;
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
    exports.migrateModul = migrateModul;
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
    RemoteObject = __decorate([
        Registry_19.$Class("jassijs.remote.RemoteObject")
    ], RemoteObject);
    exports.RemoteObject = RemoteObject;
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
            var rights = (await new Promise((resolve_11, reject_11) => { require(["jassijs/remote/security/Rights"], resolve_11, reject_11); })).default;
            //	if(await rights.isAdmin()){
            //		throw new Error("not an admin")
            //	}
            //@ts-ignore
            var Cookies = (await new Promise((resolve_12, reject_12) => { require(["jassijs/util/Cookies"], resolve_12, reject_12); })).Cookies;
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
                        new Promise((resolve_13, reject_13) => { require(["jassijs/base/LoginDialog"], resolve_13, reject_13); }).then((lib) => {
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
    RemoteProtocol.counter = 0;
    RemoteProtocol = __decorate([
        Registry_20.$Class("jassijs.remote.RemoteProtocol")
    ], RemoteProtocol);
    exports.RemoteProtocol = RemoteProtocol;
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
    __decorate([
        Validator_3.ValidateIsInt({ optional: true }),
        DatabaseSchema_2.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Group.prototype, "id", void 0);
    __decorate([
        Validator_3.ValidateIsString(),
        DatabaseSchema_2.Column(),
        __metadata("design:type", String)
    ], Group.prototype, "name", void 0);
    __decorate([
        Validator_3.ValidateIsArray({ optional: true, type: type => ParentRight_1.ParentRight }),
        DatabaseSchema_2.JoinTable(),
        DatabaseSchema_2.ManyToMany(type => ParentRight_1.ParentRight, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "parentRights", void 0);
    __decorate([
        Validator_3.ValidateIsArray({ optional: true, type: type => Right_1.Right }),
        DatabaseSchema_2.JoinTable(),
        DatabaseSchema_2.ManyToMany(type => Right_1.Right, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "rights", void 0);
    __decorate([
        Validator_3.ValidateIsArray({ optional: true, type: type => User_1.User }),
        DatabaseSchema_2.ManyToMany(type => User_1.User, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "users", void 0);
    Group = __decorate([
        DBObject_2.$DBObject({ name: "jassijs_group" }),
        Registry_21.$Class("jassijs.security.Group")
    ], Group);
    exports.Group = Group;
});
define("jassijs/remote/security/ParentRight", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Group", "jassijs/remote/Validator"], function (require, exports, DBObject_3, Registry_22, DatabaseSchema_3, Group_1, Validator_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParentRight = void 0;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let ParentRight = class ParentRight extends DBObject_3.DBObject {
    };
    __decorate([
        Validator_4.ValidateIsInt({ optional: true }),
        DatabaseSchema_3.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "id", void 0);
    __decorate([
        Validator_4.ValidateIsString(),
        DatabaseSchema_3.Column(),
        __metadata("design:type", String)
    ], ParentRight.prototype, "name", void 0);
    __decorate([
        Validator_4.ValidateIsString(),
        DatabaseSchema_3.Column(),
        __metadata("design:type", String)
    ], ParentRight.prototype, "classname", void 0);
    __decorate([
        Validator_4.ValidateIsNumber({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "i1", void 0);
    __decorate([
        Validator_4.ValidateIsNumber({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "i2", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], ParentRight.prototype, "s1", void 0);
    __decorate([
        Validator_4.ValidateIsString({ optional: true }),
        DatabaseSchema_3.Column({ nullable: true }),
        __metadata("design:type", String)
    ], ParentRight.prototype, "s2", void 0);
    __decorate([
        Validator_4.ValidateIsArray({ optional: true, type: type => Group_1.Group }),
        DatabaseSchema_3.ManyToMany(type => Group_1.Group, ob => ob.parentRights),
        __metadata("design:type", Array)
    ], ParentRight.prototype, "groups", void 0);
    ParentRight = __decorate([
        DBObject_3.$DBObject({ name: "jassijs_parentright" }),
        Registry_22.$Class("jassijs.security.ParentRight")
    ], ParentRight);
    exports.ParentRight = ParentRight;
});
define("jassijs/remote/security/Right", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Group", "jassijs/remote/Validator"], function (require, exports, DBObject_4, Registry_23, DatabaseSchema_4, Group_2, Validator_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Right = void 0;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let Right = class Right extends DBObject_4.DBObject {
    };
    __decorate([
        Validator_5.ValidateIsInt({ optional: true }),
        DatabaseSchema_4.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Right.prototype, "id", void 0);
    __decorate([
        Validator_5.ValidateIsString(),
        DatabaseSchema_4.Column(),
        __metadata("design:type", String)
    ], Right.prototype, "name", void 0);
    __decorate([
        Validator_5.ValidateIsArray({ optional: true, type: type => Group_2.Group }),
        DatabaseSchema_4.ManyToMany(type => Group_2.Group, ob => ob.rights),
        __metadata("design:type", Array)
    ], Right.prototype, "groups", void 0);
    Right = __decorate([
        DBObject_4.$DBObject({ name: "jassijs_right" }),
        Registry_23.$Class("jassijs.security.Right")
    ], Right);
    exports.Right = Right;
});
define("jassijs/remote/security/Rights", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/remote/RemoteObject"], function (require, exports, Registry_24, Registry_25, RemoteObject_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rights = exports.$CheckParentRight = exports.$ParentRights = exports.$Rights = exports.ParentRightProperties = exports.RightProperties = void 0;
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
    exports.$Rights = $Rights;
    function $ParentRights(rights) {
        return function (pclass) {
            Registry_25.default.register("$ParentRights", pclass, rights);
        };
    }
    exports.$ParentRights = $ParentRights;
    function $CheckParentRight() {
        return function (target, propertyKey, descriptor) {
            Registry_25.default.registerMember("$CheckParentRight", target, propertyKey, undefined);
        };
    }
    exports.$CheckParentRight = $CheckParentRight;
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
    Rights = __decorate([
        Registry_24.$Class("jassijs.security.Rights")
    ], Rights);
    exports.Rights = Rights;
    var rights = new Rights();
    exports.default = rights;
});
define("jassijs/remote/security/Setting", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "../Classes", "jassijs/remote/Validator"], function (require, exports, DBObject_5, Registry_26, DatabaseSchema_5, Classes_12, Validator_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Setting = void 0;
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
    __decorate([
        Validator_6.ValidateIsInt({ optional: true }),
        DatabaseSchema_5.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Setting.prototype, "id", void 0);
    __decorate([
        Validator_6.ValidateIsString({ optional: true }),
        DatabaseSchema_5.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Setting.prototype, "data", void 0);
    Setting = __decorate([
        DBObject_5.$DBObject({ name: "jassijs_setting" }),
        Registry_26.$Class("jassijs.security.Setting"),
        __metadata("design:paramtypes", [])
    ], Setting);
    exports.Setting = Setting;
    async function test() {
    }
    exports.test = test;
    ;
});
define("jassijs/remote/security/User", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Group", "jassijs/remote/security/ParentRight", "jassijs/remote/Validator"], function (require, exports, DBObject_6, Registry_27, DatabaseSchema_6, Group_3, ParentRight_2, Validator_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.User = void 0;
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
    __decorate([
        Validator_7.ValidateIsNumber({ optional: true }),
        DatabaseSchema_6.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    __decorate([
        Validator_7.ValidateIsString(),
        DatabaseSchema_6.Column(),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        Validator_7.ValidateIsString({ optional: true }),
        DatabaseSchema_6.Column({ select: false }),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        Validator_7.ValidateIsArray({ optional: true, type: type => Group_3.Group }),
        DatabaseSchema_6.JoinTable(),
        DatabaseSchema_6.ManyToMany(type => Group_3.Group, ob => ob.users),
        __metadata("design:type", Array)
    ], User.prototype, "groups", void 0);
    __decorate([
        Validator_7.ValidateIsBoolean({ optional: true }),
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", Boolean)
    ], User.prototype, "isAdmin", void 0);
    User = __decorate([
        DBObject_6.$DBObject({ name: "jassijs_user" }),
        Registry_27.$Class("jassijs.security.User")
    ], User);
    exports.User = User;
    async function test() {
        var gps = await (Group_3.Group.find({}));
    }
    exports.test = test;
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
    exports.test2 = test2;
});
define("jassijs/remote/Server", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/FileNode", "./Classes", "./Serverservice", "jassijs/remote/Validator", "./Config"], function (require, exports, Registry_28, RemoteObject_4, FileNode_1, Classes_13, Serverservice_3, Validator_8, Config_3) {
    "use strict";
    var Server_1, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
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
                    new Promise((resolve_14, reject_14) => { require(["jassijs/ui/Notify"], resolve_14, reject_14); }).then((el) => {
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
                    new Promise((resolve_15, reject_15) => { require(["jassijs/ui/Notify"], resolve_15, reject_15); }).then((el) => {
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
                var test = (await new Promise((resolve_16, reject_16) => { require([name.replaceAll("$serverside/", "")], resolve_16, reject_16); })).test;
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
    Server.isonline = undefined;
    //files found in js.map of modules in the jassijs.json
    Server.filesInMap = undefined;
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsBoolean({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Boolean, typeof (_a = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
    ], Server.prototype, "dir", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsString()),
        __param(1, Validator_8.ValidateIsBoolean({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Boolean, typeof (_c = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _c : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "zip", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsArray({ type: tp => String })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, typeof (_d = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _d : Object]),
        __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
    ], Server.prototype, "loadFiles", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsString()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_f = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _f : Object]),
        __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
    ], Server.prototype, "loadFile", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsArray({ type: type => String })),
        __param(1, Validator_8.ValidateIsArray({ type: type => String })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Array, typeof (_h = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _h : Object]),
        __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
    ], Server.prototype, "saveFiles", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsString()),
        __param(1, Validator_8.ValidateIsString()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_k = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _k : Object]),
        __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
    ], Server.prototype, "saveFile", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsString()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_m = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _m : Object]),
        __metadata("design:returntype", typeof (_o = typeof Promise !== "undefined" && Promise) === "function" ? _o : Object)
    ], Server.prototype, "testServersideFile", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsString()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_p = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _p : Object]),
        __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
    ], Server.prototype, "removeServerModul", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsString()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_r = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _r : Object]),
        __metadata("design:returntype", typeof (_s = typeof Promise !== "undefined" && Promise) === "function" ? _s : Object)
    ], Server.prototype, "delete", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsString()),
        __param(1, Validator_8.ValidateIsString()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_t = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _t : Object]),
        __metadata("design:returntype", typeof (_u = typeof Promise !== "undefined" && Promise) === "function" ? _u : Object)
    ], Server.prototype, "rename", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsString()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_v = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _v : Object]),
        __metadata("design:returntype", typeof (_w = typeof Promise !== "undefined" && Promise) === "function" ? _w : Object)
    ], Server.prototype, "createFile", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsString()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_x = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _x : Object]),
        __metadata("design:returntype", typeof (_y = typeof Promise !== "undefined" && Promise) === "function" ? _y : Object)
    ], Server.prototype, "createFolder", null);
    __decorate([
        Validator_8.ValidateFunctionParameter(),
        __param(0, Validator_8.ValidateIsString()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_z = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _z : Object]),
        __metadata("design:returntype", typeof (_0 = typeof Promise !== "undefined" && Promise) === "function" ? _0 : Object)
    ], Server.prototype, "createModule", null);
    Server = Server_1 = __decorate([
        Registry_28.$Class("jassijs.remote.Server"),
        __metadata("design:paramtypes", [])
    ], Server);
    exports.Server = Server;
});
//@ts-ignore
define("jassijs/remote/Serverservice", ["require", "exports", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Classes_14, Registry_29) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runningServerservices = exports.doNotReloadModule = exports.serverservices = exports.$Serverservice = exports.beforeServiceLoad = exports.ServerserviceProperties = void 0;
    class ServerserviceProperties {
    }
    exports.ServerserviceProperties = ServerserviceProperties;
    var runningServerservices = {};
    exports.runningServerservices = runningServerservices;
    var beforeServiceLoadHandler = [];
    function beforeServiceLoad(func) {
        beforeServiceLoadHandler.push(func);
    }
    exports.beforeServiceLoad = beforeServiceLoad;
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
    exports.$Serverservice = $Serverservice;
    var doNotReloadModule = true;
    exports.doNotReloadModule = doNotReloadModule;
});
define("jassijs/remote/Settings", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/security/Setting", "./Server", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, Registry_30, Registry_31, RemoteObject_5, Setting_1, Server_2, Serverservice_4, Validator_9) {
    "use strict";
    var Settings_2, _a, _b, _c, _d;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.load = exports.test = exports.autostart = exports.$SettingsDescriptor = exports.settings = exports.Settings = void 0;
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
    Settings.keys = new Proxy({}, proxyhandler); //the Proxy allwas give the key back
    Settings.browserSettings = undefined;
    Settings.userSettings = undefined;
    Settings.allusersSettings = undefined;
    __decorate([
        Validator_9.ValidateFunctionParameter(),
        __param(0, Validator_9.ValidateIsString()),
        __param(1, Validator_9.ValidateIsIn({ in: ["browser", "user", "allusers"] })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_a = typeof RemoteObject_5.Context !== "undefined" && RemoteObject_5.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], Settings, "remove", null);
    __decorate([
        Validator_9.ValidateFunctionParameter(),
        __param(0, Validator_9.ValidateIsString()),
        __param(2, Validator_9.ValidateIsIn({ in: ["browser", "user", "allusers"] })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_b = typeof T !== "undefined" && T) === "function" ? _b : Object, typeof (_c = typeof T !== "undefined" && T) === "function" ? _c : Object, String]),
        __metadata("design:returntype", Promise)
    ], Settings, "save", null);
    __decorate([
        Validator_9.ValidateFunctionParameter(),
        __param(1, Validator_9.ValidateIsIn({ in: ["browser", "user", "allusers"] })),
        __param(2, Validator_9.ValidateIsBoolean({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, Object, typeof (_d = typeof RemoteObject_5.Context !== "undefined" && RemoteObject_5.Context) === "function" ? _d : Object]),
        __metadata("design:returntype", Promise)
    ], Settings, "saveAll", null);
    Settings = Settings_2 = __decorate([
        Registry_30.$Class("jassijs.remote.Settings")
    ], Settings);
    exports.Settings = Settings;
    var settings = new Settings();
    exports.settings = settings;
    function $SettingsDescriptor() {
        return function (pclass) {
            Registry_31.default.register("$SettingsDescriptor", pclass);
        };
    }
    exports.$SettingsDescriptor = $SettingsDescriptor;
    async function autostart() {
        await Settings.load();
    }
    exports.autostart = autostart;
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
    exports.test = test;
    async function load() {
        return Settings.load();
    }
    exports.load = load;
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
    Test = __decorate([
        Registry_32.$Class("jassijs.remote.Test")
    ], Test);
    exports.Test = Test;
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
                var ObjectTransaction = (await new Promise((resolve_17, reject_17) => { require(["jassijs/remote/ObjectTransaction"], resolve_17, reject_17); })).ObjectTransaction;
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
            var _execute = (await new Promise((resolve_18, reject_18) => { require(["jassijs/server/DoRemoteProtocol"], resolve_18, reject_18); }))._execute;
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
    Transaction = __decorate([
        Registry_33.$Class("jassijs.remote.Transaction")
    ], Transaction);
    exports.Transaction = Transaction;
});
define("jassijs/remote/Validator", ["require", "exports", "reflect-metadata"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ValidateIsString = exports.ValidationIsStringOptions = exports.ValidateIsNumber = exports.ValidationIsNumberOptions = exports.ValidateMin = exports.ValidationMinOptions = exports.ValidateMax = exports.ValidationMaxOptions = exports.ValidateIsInt = exports.ValidationIsIntOptions = exports.ValidateIsInstanceOf = exports.ValidationIsInstanceOfOptions = exports.ValidateIsIn = exports.ValidationIsInOptions = exports.ValidateFunctionParameter = exports.ValidateIsDate = exports.ValidationIsDateOptions = exports.ValidateIsBoolean = exports.ValidationIsBooleanOptions = exports.ValidateIsArray = exports.ValidationIsArrayOptions = exports.validate = exports.ValidationError = exports.registerValidation = exports.ValidationOptions = void 0;
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
    exports.registerValidation = registerValidation;
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
    exports.validate = validate;
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
    exports.ValidateIsArray = ValidateIsArray;
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
    exports.ValidateIsBoolean = ValidateIsBoolean;
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
    exports.ValidateIsDate = ValidateIsDate;
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
    exports.ValidateFunctionParameter = ValidateFunctionParameter;
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
    exports.ValidateIsIn = ValidateIsIn;
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
    exports.ValidateIsInstanceOf = ValidateIsInstanceOf;
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
    exports.ValidateIsInt = ValidateIsInt;
    class ValidationMaxOptions extends ValidationOptions {
    }
    exports.ValidationMaxOptions = ValidationMaxOptions;
    function ValidateMax(options) {
        return registerValidation("ValidateMax", options, (target, propertyName, val, options) => {
            if ((options === null || options === void 0 ? void 0 : options.max) && val > (options === null || options === void 0 ? void 0 : options.max))
                return "value {value} is not longer then {max}";
        });
    }
    exports.ValidateMax = ValidateMax;
    class ValidationMinOptions extends ValidationOptions {
    }
    exports.ValidationMinOptions = ValidationMinOptions;
    function ValidateMin(options) {
        return registerValidation("ValidateMin", options, (target, propertyName, val, options) => {
            if ((options === null || options === void 0 ? void 0 : options.min) && val < (options === null || options === void 0 ? void 0 : options.min))
                return "value {value} is not smaller then {min}";
        });
    }
    exports.ValidateMin = ValidateMin;
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
    exports.ValidateIsNumber = ValidateIsNumber;
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
    exports.ValidateIsString = ValidateIsString;
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
    exports.test = test;
    var l;
});
define("jassijs/security/GroupView", ["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/remote/security/Group", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Registry_34, Property_1, Group_4, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.GroupView = void 0;
    let GroupView = class GroupView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "GroupView" : "GroupView " + this.value.id;
        }
        layout(me) {
            me.textbox = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            this.me.main.height = "100";
            this.me.main.add(me.textbox);
            this.me.main.isAbsolute = true;
            this.me.main.add(me.textbox2);
            me.textbox.x = 5;
            me.textbox.y = 10;
            me.textbox.width = 45;
            me.textbox.autocommit = false;
            me.textbox.converter = new NumberConverter_1.NumberConverter();
            me.textbox.bind = [this.me.databinder, "id"];
            me.textbox.label = "ID";
            me.textbox2.x = 65;
            me.textbox2.y = 10;
            me.textbox2.bind = [this.me.databinder, "name"];
            me.textbox2.label = "Name";
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Group_4.Group !== "undefined" && Group_4.Group) === "function" ? _a : Object)
    ], GroupView.prototype, "value", void 0);
    GroupView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "jassijs.security.Group", icon: "mdi mdi-account-group", actionname: "Administration/Security/Groups" }),
        Registry_34.$Class("jassijs/security/GroupView"),
        __metadata("design:paramtypes", [])
    ], GroupView);
    exports.GroupView = GroupView;
    async function test() {
        var ret = new GroupView;
        ret["value"] = await Group_4.Group.findOne();
        return ret;
    }
    exports.test = test;
});
define("jassijs/security/UserView", ["require", "exports", "jassijs/ui/Select", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Property", "jassijs/remote/security/User", "jassijs/ui/DBObjectView", "jassijs/ui/Notify", "jassijs/remote/security/Group"], function (require, exports, Select_1, Checkbox_1, NumberConverter_2, Textbox_2, Registry_35, Panel_2, Property_2, User_2, DBObjectView_2, Notify_1, Group_5) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.UserView = void 0;
    let UserView = class UserView extends DBObjectView_2.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "User" : "User " + this.value.email;
        }
        layout(me) {
            me.IDID = new Textbox_2.Textbox();
            me.IDEmail = new Textbox_2.Textbox();
            me.checkbox = new Checkbox_1.Checkbox();
            me.panel = new Panel_2.Panel();
            me.IDGroups = new Select_1.Select({ multiple: true });
            me.IDID.bind = [me.databinder, "id"];
            me.IDID.width = 40;
            me.IDID.converter = new NumberConverter_2.NumberConverter();
            me.IDID.label = "ID";
            me.IDEmail.bind = [me.databinder, "email"];
            me.IDEmail.label = "E-Mail";
            this.me.main.height = "100";
            me.panel.add(me.IDID);
            this.me.main.add(me.panel);
            this.me.main.add(me.IDGroups);
            me.panel.add(me.IDEmail);
            me.panel.add(me.checkbox);
            me.checkbox.bind = [this.me.databinder, "isAdmin"];
            me.checkbox.width = 15;
            me.checkbox.label = "IsAdmin";
            me.IDGroups.width = "400";
            me.IDGroups.display = "name";
            me.IDGroups.bind = [this.me.databinder, "groups"];
            Group_5.Group.find().then((data) => {
                me.IDGroups.items = data;
            });
        }
        createObject() {
            super.createObject();
            this.value.password = Math.random().toString(36).slice(-8); //random password
            Notify_1.notify("random password set: " + this.value.password, "info", { position: "right" });
            console.log("random password set: " + this.value.password);
        }
    };
    __decorate([
        Property_2.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof User_2.User !== "undefined" && User_2.User) === "function" ? _a : Object)
    ], UserView.prototype, "value", void 0);
    UserView = __decorate([
        DBObjectView_2.$DBObjectView({ classname: "jassijs.security.User", actionname: "Administration/Security/Users", icon: "mdi mdi-account-key-outline", queryname: "findWithRelations" }),
        Registry_35.$Class("jassijs/security/UserView"),
        __metadata("design:paramtypes", [])
    ], UserView);
    exports.UserView = UserView;
    async function test() {
        var ret = new UserView();
        ret["value"] = (await User_2.User.findWithRelations())[0];
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/ActionNodeMenu", ["require", "exports", "jassijs/ui/Menu", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Actions", "jassijs/base/ActionNode", "jassijs/ui/MenuItem"], function (require, exports, Menu_1, Registry_36, Panel_3, Actions_1, ActionNode_1, MenuItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ActionNodeMenu = void 0;
    let ActionNodeMenu = class ActionNodeMenu extends Panel_3.Panel {
        constructor() {
            super();
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
    ActionNodeMenu = __decorate([
        Registry_36.$Class("jassijs/ui/ActionNodeMenu"),
        __metadata("design:paramtypes", [])
    ], ActionNodeMenu);
    exports.ActionNodeMenu = ActionNodeMenu;
    async function test() {
        var ret = new ActionNodeMenu();
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/BoxPanel", ["require", "exports", "splitlib", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Classes"], function (require, exports, Split, Panel_4, Registry_37, Component_3, Property_3, Classes_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.BoxPanel = void 0;
    /// <amd-dependency path="splitlib" name="Split"/>
    let BoxPanel = class BoxPanel extends Panel_4.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.domWrapper.classList.add('BoxPanel');
            this.domWrapper.classList.remove('Panel');
            this.horizontal = false;
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
                if (this._components[x]["designDummyFor"])
                    continue;
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
    __decorate([
        Property_3.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], BoxPanel.prototype, "horizontal", null);
    __decorate([
        Property_3.$Property({ type: "number[]", description: "set the size of splitter e.g. [40,60] the firstcomponent size is 40%" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], BoxPanel.prototype, "spliter", null);
    BoxPanel = __decorate([
        Component_3.$UIComponent({ fullPath: "common/BoxPanel", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] }),
        Registry_37.$Class("jassijs.ui.BoxPanel"),
        Property_3.$Property({ name: "isAbsolute", hide: true, type: "boolean" }),
        __metadata("design:paramtypes", [Object])
    ], BoxPanel);
    exports.BoxPanel = BoxPanel;
    async function test() {
        var HTMLPanel = await Classes_15.classes.loadClass("jassijs.ui.HTMLPanel");
        var ret = new BoxPanel();
        var me = {};
        ret["me"] = me;
        ret.horizontal = true;
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
    exports.test = test;
    ;
});
define("jassijs/ui/Button", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Registry_38, Component_4, Property_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Button = exports.ButtonProperties = void 0;
    let ButtonProperties = class ButtonProperties extends Component_4.ComponentProperties {
    };
    __decorate([
        Property_4.$Property({ type: "image" }),
        __metadata("design:type", String)
    ], ButtonProperties.prototype, "icon", void 0);
    __decorate([
        Property_4.$Property(),
        __metadata("design:type", String)
    ], ButtonProperties.prototype, "text", void 0);
    ButtonProperties = __decorate([
        Registry_38.$Class("jassijs.ui.ButtonProperties")
    ], ButtonProperties);
    exports.ButtonProperties = ButtonProperties;
    let Button = class Button extends Component_4.Component {
        constructor(properties) {
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
            return React.createElement("button", {
                className: "Button",
                contenteditable: false
            }, React.createElement("span", {
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
            if (this.dom === undefined)
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
    Button = __decorate([
        Component_4.$UIComponent({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } }),
        Registry_38.$Class("jassijs.ui.Button"),
        Property_4.$Property({ name: "new", type: "json", componentType: "jassijs.ui.ButtonProperties" }),
        __metadata("design:paramtypes", [ButtonProperties])
    ], Button);
    exports.Button = Button;
    async function test() {
        var Panel = (await (new Promise((resolve_19, reject_19) => { require(["jassijs/ui/Panel"], resolve_19, reject_19); }))).Panel;
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
    exports.test = test;
});
define("jassijs/ui/Calendar", ["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ext/jquerylib"], function (require, exports, Textbox_3, Component_5, Registry_39, Property_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Calendar = void 0;
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
    Calendar = __decorate([
        Component_5.$UIComponent({ fullPath: "common/Calendar", icon: "mdi mdi-calendar-month" }),
        Registry_39.$Class("jassijs.ui.Calendar"),
        Property_5.$Property({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [Object])
    ], Calendar);
    exports.Calendar = Calendar;
    function test() {
        var cal = new Calendar();
        cal.value = new Date(1978, 5, 1);
        var h = Calendar.parseDate("18.03.2020");
        var hh = Calendar.formatDate(h);
        var i = cal.value;
        // cal.value=Date.now()
        return cal;
    }
    exports.test = test;
});
define("jassijs/ui/Checkbox", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/ui/DataComponent"], function (require, exports, Registry_40, Component_6, Property_6, DataComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Checkbox = void 0;
    let Checkbox = class Checkbox extends DataComponent_1.DataComponent {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            super.init('<div><input type="checkbox"><span class="checkboxtext" style="width:100%"></span></div>');
            this.checkbox = this.dom.firstChild;
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
            this.domWrapper.querySelector(".checkboxtext").innerHTML = value === undefined ? "" : value;
        }
        get text() {
            return this.domWrapper.querySelector(".checkboxtext").innerHTML;
        }
    };
    __decorate([
        Property_6.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Checkbox.prototype, "onclick", null);
    __decorate([
        Property_6.$Property({ type: "boolean" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Checkbox.prototype, "value", null);
    __decorate([
        Property_6.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Checkbox.prototype, "text", null);
    Checkbox = __decorate([
        Component_6.$UIComponent({ fullPath: "common/Ceckbox", icon: "mdi mdi-checkbox-marked-outline" }),
        Registry_40.$Class("jassijs.ui.Checkbox"),
        __metadata("design:paramtypes", [])
    ], Checkbox);
    exports.Checkbox = Checkbox;
    function test() {
        var cb = new Checkbox();
        cb.label = "label";
        cb.value = true;
        return cb;
    }
    exports.test = test;
});
define("jassijs/ui/Component", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/CSSProperties"], function (require, exports, Registry_41, Property_7, Registry_42, Classes_16, CSSProperties_1) {
    "use strict";
    var _a, Component_7;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextComponent = exports.HTMLComponent = exports.Component = exports.createComponent = exports.React = exports.ComponentProperties = exports.$UIComponent = exports.UIComponentProperties = void 0;
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
    exports.$UIComponent = $UIComponent;
    let ComponentProperties = class ComponentProperties {
    };
    __decorate([
        Property_7.$Property({ description: "adds a label above the component" }),
        __metadata("design:type", String)
    ], ComponentProperties.prototype, "label", void 0);
    __decorate([
        Property_7.$Property({ description: "tooltip are displayed on mouse over" }),
        __metadata("design:type", String)
    ], ComponentProperties.prototype, "tooltip", void 0);
    __decorate([
        Property_7.$Property(),
        __metadata("design:type", Number)
    ], ComponentProperties.prototype, "x", void 0);
    __decorate([
        Property_7.$Property(),
        __metadata("design:type", Number)
    ], ComponentProperties.prototype, "y", void 0);
    __decorate([
        Property_7.$Property(),
        __metadata("design:type", Boolean)
    ], ComponentProperties.prototype, "hidden", void 0);
    __decorate([
        Property_7.$Property({ type: "string" }),
        __metadata("design:type", Object)
    ], ComponentProperties.prototype, "width", void 0);
    __decorate([
        Property_7.$Property({ type: "string" }),
        __metadata("design:type", Object)
    ], ComponentProperties.prototype, "height", void 0);
    __decorate([
        Property_7.$Property({ type: "json", componentType: "jassijs.ui.CSSProperties" }),
        __metadata("design:type", typeof (_a = typeof CSSProperties_1.CSSProperties !== "undefined" && CSSProperties_1.CSSProperties) === "function" ? _a : Object)
    ], ComponentProperties.prototype, "css", void 0);
    __decorate([
        Property_7.$Property({ type: "componentselector", componentType: "[jassijs.ui.Style]" }),
        __metadata("design:type", Array)
    ], ComponentProperties.prototype, "styles", void 0);
    __decorate([
        Property_7.$Property({ type: "componentselector", componentType: "jassijs.ui.ContextMenu" }),
        __metadata("design:type", Object)
    ], ComponentProperties.prototype, "contextMenu", void 0);
    ComponentProperties = __decorate([
        Registry_41.$Class("jassijs.ui.ComponentProperties")
    ], ComponentProperties);
    exports.ComponentProperties = ComponentProperties;
    var React = {
        createElement(type, props, ...children) {
            if (props === undefined || props === null) //TODO is this right?
                props = {};
            if (children) {
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
    window.React = React;
    function createComponent(node) {
        var _a, _b, _c, _d;
        var atype = node.type;
        var props = node.props;
        var ret;
        if (typeof atype === "string") {
            ret = new HTMLComponent(props);
            ret.tag = atype;
            var newdom = document.createElement(atype);
            for (var prop in props) {
                if (prop === "style") {
                    for (var key in props.style) {
                        var val = props.style[key];
                        newdom.style[key] = val;
                    }
                }
                else if (prop in newdom) {
                    Reflect.set(newdom, prop, [props[prop]]);
                }
                else if (prop.toLocaleLowerCase() in newdom) {
                    Reflect.set(newdom, prop.toLocaleLowerCase(), props[prop]);
                }
                else if (prop in newdom)
                    newdom.setAttribute(prop, props[prop]);
                // }
            }
            ret.init(newdom, { noWrapper: true });
        }
        else if (atype.constructor !== undefined) {
            ret = new atype(props);
        }
        else if (typeof atype === "function") {
            ret = atype(props);
        }
        if (((_b = (_a = node) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.children) !== undefined) {
            if (props === null || props === undefined)
                props = {};
            props.children = (_d = (_c = node) === null || _c === void 0 ? void 0 : _c.props) === null || _d === void 0 ? void 0 : _d.children;
            for (var x = 0; x < props.children.length; x++) {
                var child = props.children[x];
                var cchild;
                if (typeof child === "string") {
                    var nd = document.createTextNode(child);
                    cchild = new TextComponent();
                    cchild.tag = "";
                    cchild.init(nd, { noWrapper: true });
                    //child.dom = nd;
                }
                else {
                    cchild = createComponent(child);
                }
                ret.add(cchild);
            }
        }
        return ret;
    }
    exports.createComponent = createComponent;
    //class TC <Prop>extends React.Component<Prop,{}>{
    let Component = Component_7 = class Component extends React.Component {
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
        constructor(properties = undefined) {
            super(properties, undefined);
            this.props = properties;
            var rend = this.render();
            if (rend) {
                var comp = createComponent(rend);
                this.init(comp.dom);
            }
            this.config(this.props);
        }
        render() {
            return undefined;
        }
        /*  rerender() {
              var alt = this.dom;
              this.init(this.lastinit, { replaceNode: this.dom });
              this.config(this.lastconfig);
          }*/
        config(config, forceRender = false) {
            var con = Object.assign({}, config);
            delete con.noWrapper;
            delete con.replaceNode;
            // this.lastconfig = config;
            var notfound = {};
            for (var key in con) {
                if (key in this) {
                    var me = this;
                    if (typeof me[key] === 'function') {
                        me[key](config[key]);
                    }
                    else {
                        me[key] = config[key];
                    }
                }
                else
                    notfound[key] = con;
            }
            Object.assign(this.props === undefined ? {} : this.props, config);
            if (Object.keys(notfound).length > 0 && forceRender) {
                var rerender = this.render();
                if (rerender) {
                    this.init(createComponent(rerender).dom);
                    console.log("rerender");
                }
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
                this.dom._thisOther.push(this.dom._this);
            }
            this.dom._this = this;
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
        /**
         * inits the component
         * @param {dom} dom - init the dom element
         * @paran {object} properties - properties to init
        */
        init(dom, properties = undefined) {
            var _a;
            // this.lastinit = dom;
            var oldwrapper = this.domWrapper;
            var olddom = this.dom;
            if (typeof dom === "string")
                dom = Component_7.createHTMLElement(dom);
            //is already attached
            if (this.domWrapper !== undefined) {
                var thisProperties = properties;
                if ((_a = thisProperties === null || thisProperties === void 0 ? void 0 : thisProperties.replaceNode) === null || _a === void 0 ? void 0 : _a.parentNode) {
                    thisProperties === null || thisProperties === void 0 ? void 0 : thisProperties.replaceNode.parentNode.replaceChild(dom, thisProperties === null || thisProperties === void 0 ? void 0 : thisProperties.replaceNode);
                    this.dom = dom;
                    this.dom.setAttribute("id", thisProperties === null || thisProperties === void 0 ? void 0 : thisProperties.replaceNode.getAttribute("id"));
                    return;
                }
                this.domWrapper._this = undefined;
            }
            if (this.dom !== undefined) {
                this.__dom._this = undefined;
            }
            //notify Hook
            for (var x = 0; x < Component_7._componentHook.length; x++) {
                Component_7._componentHook[x]("precreate", this);
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
            if (properties !== undefined && properties.noWrapper === true) {
                this.domWrapper = this.dom;
                this.domWrapper._id = this._id;
                if (this.domWrapper.classList !== undefined)
                    this.domWrapper.classList.add("jcomponent");
            }
            else {
                /** @member {dom} - the dom element for label*/
                let strdom = '<div id="' + lid + '" class ="jcomponent"' + st + '></div>';
                this.domWrapper = Component_7.createHTMLElement(strdom);
                this.domWrapper._this = this;
                this.domWrapper._id = lid;
                this.domWrapper.appendChild(dom);
            }
            if ((oldwrapper === null || oldwrapper === void 0 ? void 0 : oldwrapper.parentNode) !== undefined) {
                oldwrapper.parentNode.replaceChild(this.domWrapper, oldwrapper); //removeChild(this.domWrapper);
            }
            //append temporary so new elements must not added immediately
            if (document.getElementById("jassitemp") === null) {
                var temp = Component_7.createHTMLElement('<template id="jassitemp"></template>');
                document.body.appendChild(temp);
            }
            //notify Hook
            for (var x = 0; x < Component_7._componentHook.length; x++) {
                Component_7._componentHook[x]("create", this);
            }
            //for profilling save code pos
            //if (jassijs.componentSpy !== undefined) {
            //     jassijs.componentSpy.watch(this);
            //  }
            if (!oldwrapper)
                document.getElementById("jassitemp").appendChild(this.domWrapper);
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
                    let lab = Component_7.createHTMLElement('<label class="jlabel" for="' + this._id + '"></label>'); //
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
        set css(properties) {
            var prop = CSSProperties_1.CSSProperties.applyTo(properties, this);
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
            for (var x = 0; x < Component_7._componentHook.length; x++) {
                Component_7._componentHook[x]("destroy", this);
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
            if (this.designDummies) {
                this.designDummies.forEach((dummy) => { dummy.destroy(); });
            }
            this.events = [];
        }
        extensionCalled(action) {
        }
        setState() {
            throw new Error("not implemented");
        }
        forceUpdate() {
            throw new Error("not implemented");
        }
    };
    Component._componentHook = [];
    Component = Component_7 = __decorate([
        Registry_41.$Class("jassijs.ui.Component")
        //@ts-ignore
        ,
        Property_7.$Property({ name: "new", type: "json", componentType: "jassijs.ui.ComponentProperties" }),
        __metadata("design:paramtypes", [Object])
    ], Component);
    exports.Component = Component;
    class HTMLComponentProperties extends ComponentProperties {
    }
    // ret.tag = atype;
    //        var newdom = document.createElement(atype);
    let HTMLComponent = class HTMLComponent extends Component {
        constructor() {
            super(...arguments);
            this._components = [];
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
            if (this["designDummyFor"])
                this.designDummies.push(component);
            else
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
            if (component["designDummyFor"])
                this.designDummies.push(component);
            else
                this._components.splice(index, 0, component);
            before.domWrapper.parentNode.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
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
    HTMLComponent = __decorate([
        Registry_41.$Class("jassijs.ui.HTMLComponent")
    ], HTMLComponent);
    exports.HTMLComponent = HTMLComponent;
    let TextComponent = class TextComponent extends Component {
        get text() {
            return this.dom.textContent;
        }
        ;
        set text(value) {
            var p = JSON.parse(`{"a":"` + value + '"}').a;
            this.dom.textContent = p;
        }
        ;
    };
    __decorate([
        Property_7.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], TextComponent.prototype, "text", null);
    TextComponent = __decorate([
        Registry_41.$Class("jassijs.ui.TextComponent")
    ], TextComponent);
    exports.TextComponent = TextComponent;
});
define("jassijs/ui/ComponentDescriptor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Registry_43, Property_8, Classes_17, Registry_44) {
    "use strict";
    var ComponentDescriptor_3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDescriptor = void 0;
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
                        if (props === null || props === void 0 ? void 0 : props.new) {
                            var clname = props.new[0][0].componentType;
                            if (Classes_17.classes.getClass(clname)) {
                                type = Classes_17.classes.getClass(clname);
                                sclass = Classes_17.classes.getClassName(type);
                                props = Registry_44.default.getMemberData("$Property")[sclass];
                            }
                        }
                        if (props !== undefined) {
                            var info = Registry_44.default.getMemberData("design:type")[sclass];
                            for (var key in props) {
                                var data = props[key];
                                for (let x = 0; x < data.length; x++) {
                                    if ((_a = data[x][0]) === null || _a === void 0 ? void 0 : _a.hideBaseClassProperties) {
                                        hideBaseClassProperties = data[x][0].hideBaseClassProperties;
                                        continue;
                                    }
                                    var prop = new Property_8.Property(key);
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
    ComponentDescriptor = ComponentDescriptor_3 = __decorate([
        Registry_43.$Class("jassijs.ui.ComponentDescriptor"),
        __metadata("design:paramtypes", [])
    ], ComponentDescriptor);
    exports.ComponentDescriptor = ComponentDescriptor;
});
define("jassijs/ui/Container", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Registry_45, Component_8, Property_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Container = exports.ContainerProperties = void 0;
    let ContainerProperties = class ContainerProperties extends Component_8.ComponentProperties {
    };
    __decorate([
        Property_9.$Property({ type: "jassijs.ui.Component" }),
        __metadata("design:type", Object)
    ], ContainerProperties.prototype, "children", void 0);
    ContainerProperties = __decorate([
        Registry_45.$Class("jassijs.ui.ContainerProperties")
    ], ContainerProperties);
    exports.ContainerProperties = ContainerProperties;
    let Container = class Container extends Component_8.Component {
        /**
         *
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = undefined) {
            super(properties);
            this._components = [];
        }
        config(config, forceRender = false) {
            if (config === null || config === void 0 ? void 0 : config.children) {
                if ((config === null || config === void 0 ? void 0 : config.children.length) > 0 && (config === null || config === void 0 ? void 0 : config.children[0]) instanceof Component_8.Component) {
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
        init(dom, properties = undefined) {
            super.init(dom, properties);
            this.domWrapper.classList.add("jcontainer");
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
            if (this["designDummyFor"])
                this.designDummies.push(component);
            else
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
            if (component["designDummyFor"])
                this.designDummies.push(component);
            else
                this._components.splice(index, 0, component);
            before.domWrapper.parentNode.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
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
    Container = __decorate([
        Registry_45.$Class("jassijs.ui.Container"),
        __metadata("design:paramtypes", [ContainerProperties])
    ], Container);
    exports.Container = Container;
});
define("jassijs/ui/ContextMenu", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Menu", "jassijs/ui/InvisibleComponent", "jassijs/ui/Component", "jassijs/remote/Classes", "jassijs/ui/Property", "jassijs/base/Actions", "jassijs/ui/MenuItem", "jassijs/ext/jquerylib", "jquery.contextMenu"], function (require, exports, Registry_46, Menu_2, InvisibleComponent_1, Component_9, Classes_18, Property_10, Actions_2, MenuItem_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ContextMenu = void 0;
    jassijs.includeCSSFile("contextMenu.css");
    //https://github.com/s-yadav/contextMenu.js/
    let ContextMenu = class ContextMenu extends InvisibleComponent_1.InvisibleComponent {
        constructor() {
            super();
            super.init('<span class="InvisibleComponent"></span>');
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
        /**
         * @member - the objects for the includeClassActions @ActionProvider if  is enabled
         **/
        set value(value) {
            this._value = value;
        }
        get value() {
            return this._value;
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
    __decorate([
        Property_10.$Property(),
        __metadata("design:type", Boolean)
    ], ContextMenu.prototype, "includeClassActions", void 0);
    __decorate([
        Property_10.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ContextMenu.prototype, "onbeforeshow", null);
    ContextMenu = __decorate([
        Component_9.$UIComponent({ fullPath: "common/ContextMenu", icon: "mdi mdi-dots-vertical", editableChildComponents: ["menu"] }),
        Registry_46.$Class("jassijs.ui.ContextMenu"),
        __metadata("design:paramtypes", [])
    ], ContextMenu);
    exports.ContextMenu = ContextMenu;
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
    exports.test = test;
});
define("jassijs/ui/converters/DateTimeConverter", ["require", "exports", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/Textbox", "luxon"], function (require, exports, DefaultConverter_1, Registry_47, Property_11, Textbox_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DateTimeConverter = void 0;
    let DateTimeConverterProperties = class DateTimeConverterProperties {
    };
    __decorate([
        Property_11.$Property({ type: "string", chooseFrom: ["DATE_SHORT", "TIME_SIMPLE", "DATETIME_SHORT", "TIME_WITH_SECONDS", "DATETIME_SHORT_WITH_SECONDS"] }),
        __metadata("design:type", String)
    ], DateTimeConverterProperties.prototype, "type", void 0);
    DateTimeConverterProperties = __decorate([
        Registry_47.$Class("jassijs.ui.converters.DateTimeConverterProperies")
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
    __decorate([
        Property_11.$Property({ type: "string", chooseFrom: ["DATE_SHORT", "TIME_SIMPLE", "DATETIME_SHORT", "TIME_WITH_SECONDS", "DATETIME_SHORT_WITH_SECONDS"] }),
        __metadata("design:type", String)
    ], DateTimeConverter.prototype, "type", void 0);
    DateTimeConverter = __decorate([
        DefaultConverter_1.$Converter({ name: "datetime" }),
        Registry_47.$Class("jassijs.ui.converters.DateTimeConverter"),
        Property_11.$Property({ name: "new", type: "json", componentType: "jassijs.ui.converters.DateTimeConverterProperties" }),
        __metadata("design:paramtypes", [DateTimeConverterProperties])
    ], DateTimeConverter);
    exports.DateTimeConverter = DateTimeConverter;
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
    exports.test = test;
});
define("jassijs/ui/converters/DefaultConverter", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Registry_48, Registry_49, Property_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultConverter = exports.$Converter = exports.$ConverterProperties = void 0;
    class $ConverterProperties {
    }
    exports.$ConverterProperties = $ConverterProperties;
    function $Converter(param) {
        return function (pclass) {
            Registry_49.default.register("$Converter", pclass, param);
        };
    }
    exports.$Converter = $Converter;
    let DefaultConverterProperties = class DefaultConverterProperties {
        stringToObject() {
        }
    };
    __decorate([
        Property_12.$Property({ default: "function(ob){}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DefaultConverterProperties.prototype, "stringToObject", null);
    DefaultConverterProperties = __decorate([
        Registry_48.$Class("jassijs.ui.converters.DefaultConverterProperties")
    ], DefaultConverterProperties);
    let DefaultConverter = 
    //@$Property({ name: "new/stringToObject", type: "function", default: "function(ob){}" })
    class DefaultConverter {
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
    DefaultConverter = __decorate([
        $Converter({ name: "custom" }),
        Registry_48.$Class("jassijs.ui.converters.DefaultConverter"),
        Property_12.$Property({ name: "new", type: "json", componentType: "jassijs.ui.converters.DefaultConverterProperties" })
        //@$Property({ name: "new/stringToObject", type: "function", default: "function(ob){}" })
        ,
        __metadata("design:paramtypes", [])
    ], DefaultConverter);
    exports.DefaultConverter = DefaultConverter;
});
define("jassijs/ui/converters/NumberConverter", ["require", "exports", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/util/Numberformatter"], function (require, exports, DefaultConverter_2, Registry_50, Property_13, Numberformatter_1) {
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
        Property_13.$Property(),
        __metadata("design:type", Number)
    ], NumberConverterProperties.prototype, "min", void 0);
    __decorate([
        Property_13.$Property(),
        __metadata("design:type", Number)
    ], NumberConverterProperties.prototype, "max", void 0);
    __decorate([
        Property_13.$Property({ type: "string", chooseFrom: allFormats }),
        __metadata("design:type", String)
    ], NumberConverterProperties.prototype, "format", void 0);
    NumberConverterProperties = __decorate([
        Registry_50.$Class("jassijs.ui.converters.NumberConverterProperies")
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
    NumberConverter = __decorate([
        DefaultConverter_2.$Converter({ name: "number" }),
        Registry_50.$Class("jassijs.ui.converters.NumberConverter"),
        Property_13.$Property({ name: "new", type: "json", componentType: "jassijs.ui.converters.NumberConverterProperies" }),
        __metadata("design:paramtypes", [NumberConverterProperties])
    ], NumberConverter);
    exports.NumberConverter = NumberConverter;
});
define("jassijs/ui/converters/StringConverter", ["require", "exports", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, DefaultConverter_3, Registry_51, Property_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StringConverter = void 0;
    let StringConverterProperties = class StringConverterProperties {
    };
    __decorate([
        Property_14.$Property(),
        __metadata("design:type", Number)
    ], StringConverterProperties.prototype, "minChars", void 0);
    __decorate([
        Property_14.$Property(),
        __metadata("design:type", Number)
    ], StringConverterProperties.prototype, "maxChars", void 0);
    StringConverterProperties = __decorate([
        Registry_51.$Class("jassijs.ui.converters.StringConverterProperies")
    ], StringConverterProperties);
    let StringConverter = 
    //@$Property({ name: "new/minChars", type: "number", default: undefined })
    //@$Property({ name: "new/maxChars", type: "number", default: undefined })
    class StringConverter extends DefaultConverter_3.DefaultConverter {
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
    StringConverter = __decorate([
        DefaultConverter_3.$Converter({ name: "string" }),
        Registry_51.$Class("jassijs.ui.converters.StringConverter"),
        Property_14.$Property({ name: "new", type: "json", componentType: "jassijs.ui.converters.StringConverterProperies" })
        //@$Property({ name: "new/minChars", type: "number", default: undefined })
        //@$Property({ name: "new/maxChars", type: "number", default: undefined })
        ,
        __metadata("design:paramtypes", [StringConverterProperties])
    ], StringConverter);
    exports.StringConverter = StringConverter;
});
define("jassijs/ui/CSSProperties", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Registry_52, Property_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSSProperties = exports.loadFontIfNedded = void 0;
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
    exports.loadFontIfNedded = loadFontIfNedded;
    let CSSProperties = class CSSProperties {
        static applyTo(properties, component) {
            var prop = {};
            for (let key in properties) {
                var newKey = key.replaceAll("_", "-");
                prop[newKey] = properties[key];
                if (newKey === "font-family") {
                    loadFontIfNedded(prop[newKey]);
                }
                component.dom.style[newKey] = properties[key];
            }
            return prop;
        }
    };
    __decorate([
        Property_15.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "background_color", void 0);
    __decorate([
        Property_15.$Property(),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "background_image", void 0);
    __decorate([
        Property_15.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "border_color", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "border_style", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["thin", "medium", "thick", "2px", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "border_width", void 0);
    __decorate([
        Property_15.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "color", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["auto", "default", "none", "context-menu", "help", "pointer", "progress", "wait", "cell", "crosshair", "text", "vertical-text", "alias", "copy", "move", "no-drop", "not-allowed", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "cursor", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["blur(5px)", "brightness(0.4)", "contrast(200%)", "drop-shadow(16px 16px 20px blue)", "grayscale(50%)", "hue-rotate(90deg)", "invert(75%)", "opacity(25%)", "saturate(30%)", "sepia(60%)", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "filter", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["left", "right", "none", "inline-start", "inline-end", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "float", void 0);
    __decorate([
        Property_15.$Property({ type: "font" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_family", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["12px", "xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large", "larger", "smaller", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_size", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["normal", "small-caps", "small-caps slashed-zero", "common-ligatures tabular-nums", "no-common-ligatures proportional-nums", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_variant", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["normal", "bold", "lighter", "bolder", "100", "900", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_weight", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["normal", "1px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "letter_spacing", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["normal", "32px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "line_height", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_bottom", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_left", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_right", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_top", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["visible", "hidden", "clip", "scroll", "auto", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "overflow", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_bottom", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_left", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_right", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_top", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["static", "relative", "absolute", "sticky", "fixed", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "position", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["start", "end", "left", "right", "center", "justify", "match-parent", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_align", void 0);
    __decorate([
        Property_15.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_color", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["none", "underline", "overline", "line-through", "blink", "spelling-error", "grammar-error", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_line", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["solid", "double", "dotted", "dashed", "wavy", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_style", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_thickness", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["none", "capitalize", "uppercase", "lowercase", "full-width", "full-size-kana", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_transform", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["baseline", "sub", "super", "text-top", "text-bottom", "middle", "top", "bottom", "3px", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "vertical_align", void 0);
    __decorate([
        Property_15.$Property({ chooseFrom: ["1", "2", "auto"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "z_index", void 0);
    CSSProperties = __decorate([
        Registry_52.$Class("jassijs.ui.CSSProperties")
    ], CSSProperties);
    exports.CSSProperties = CSSProperties;
});
define("jassijs/ui/Databinder", ["require", "exports", "jassijs/ui/InvisibleComponent", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/remote/Database", "jassijs/ui/Notify"], function (require, exports, InvisibleComponent_2, Component_10, Registry_53, Database_2, Notify_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Databinder = void 0;
    let Databinder = class Databinder extends InvisibleComponent_2.InvisibleComponent {
        constructor() {
            super();
            super.init('<span class="InvisibleComponent"></span>');
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
            /** @member [{object}] userObject - the object to bind*/
            this.userObject = undefined;
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
            if (this.userObject !== undefined) {
                var acc = new PropertyAccessor();
                acc.userObject = this.userObject;
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
            // this.fromForm();
            return this.userObject;
        }
        set value(obj) {
            var _this = this;
            if (obj !== undefined && obj.then !== undefined) {
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
                    Notify_2.notify(allErr.join("\r\n"), "error", { position: "bottom right" });
                    return false;
                }
            }
            return true;
        }
        /**
         * binds the object to all added components
         * @param {object} obj - the object to bind
         */
        toForm(obj) {
            this.userObject = obj;
            var setter = new PropertyAccessor();
            setter.userObject = obj;
            for (var x = 0; x < this.components.length; x++) {
                var comp = this.components[x];
                var prop = this._properties[x];
                var sfunc = this._setter[x];
                var sget = this._getter[x];
                var oldValue = sget(comp);
                if (prop === "this") {
                    if (oldValue !== this.userObject) {
                        sfunc(comp, this.userObject);
                    }
                }
                else {
                    if (this.userObject === undefined) {
                        if (oldValue !== undefined)
                            sfunc(comp, undefined);
                    }
                    else {
                        setter.setProperty(sfunc, comp, prop, oldValue);
                    }
                }
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
            if (this.userObject === undefined)
                return undefined;
            for (var x = 0; x < this.components.length; x++) {
                this._fromForm(x);
            }
            if (!await this.doValidation(this.userObject)) { //rollback
                for (var x = 0; x < this.components.length; x++) {
                    var prop = this._properties[x];
                    new PropertyAccessor().setNestedProperty(this.userObject, prop, this.rollbackObject[prop]);
                }
                return undefined;
            }
            return this.userObject;
        }
        /**
         * get objectproperty
         * @param {number} x - the numer of the component
         */
        _fromForm(x) {
            var comp = this.components[x];
            var prop = this._properties[x];
            var sfunc = this._getter[x];
            var test = sfunc(comp);
            if (test !== undefined) {
                if (prop === "this") {
                    var val = test;
                    this.value = test;
                }
                else {
                    // if (comp["converter"] !== undefined) {
                    //     test = comp["converter"].stringToObject(test);
                    // }
                    this.rollbackObject[prop] = new PropertyAccessor().getNestedProperty(this.userObject, prop);
                    new PropertyAccessor().setNestedProperty(this.userObject, prop, test);
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
            this.userObject = undefined;
            super.destroy();
        }
    };
    Databinder = __decorate([
        Component_10.$UIComponent({ fullPath: "common/Databinder", icon: "mdi mdi-connection" }),
        Registry_53.$Class("jassijs.ui.Databinder"),
        __metadata("design:paramtypes", [])
    ], Databinder);
    exports.Databinder = Databinder;
    class PropertyAccessor {
        constructor() {
            this.relationsToResolve = [];
            this.todo = [];
        }
        getNestedProperty(obj, property) {
            if (obj === undefined)
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
            ob[property.split(".")[0]] = value;
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
});
// return CodeEditor.constructor;
define("jassijs/ui/DataComponent", ["require", "exports", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Registry"], function (require, exports, Component_11, Property_16, Registry_54) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataComponent = exports.DataComponentProperties = void 0;
    let DataComponentProperties = class DataComponentProperties extends Component_11.ComponentProperties {
    };
    __decorate([
        Property_16.$Property({ type: "databinder" }),
        __metadata("design:type", Array)
    ], DataComponentProperties.prototype, "bind", void 0);
    __decorate([
        Property_16.$Property(),
        __metadata("design:type", Boolean)
    ], DataComponentProperties.prototype, "autocommit", void 0);
    DataComponentProperties = __decorate([
        Registry_54.$Class("jassijs.ui.DataComponentProperties")
    ], DataComponentProperties);
    exports.DataComponentProperties = DataComponentProperties;
    var tmpDatabinder = undefined;
    let DataComponent = class DataComponent extends Component_11.Component {
        /**
        * base class for each Component
        * @class jassijs.ui.Component
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = undefined) {
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
        /**
         * @param [databinder:jassijs.ui.Databinder,"propertyToBind"]
         */
        set bind(databinder) {
            if (databinder === undefined) {
                if (this._databinder !== undefined) {
                    this._databinder.remove(this);
                    this._databinder = undefined;
                }
                return;
            }
            var property = databinder[1];
            this._databinder = databinder[0];
            if (this._databinder !== undefined)
                this._databinder.add(property, this, "onchange");
        }
        /*  rerender(){
               if (this._databinder !== undefined) {
                  this._databinder.remove(this);
                  this._databinder = undefined;
              }
              super.rerender();
          }*/
        destroy() {
            if (this._databinder !== undefined) {
                this._databinder.remove(this);
                this._databinder = undefined;
            }
            super.destroy();
        }
    };
    DataComponent = __decorate([
        Registry_54.$Class("jassijs.ui.DataComponent"),
        Property_16.$Property({ name: "new", type: "json", componentType: "jassijs.ui.DataComponentProperties" }),
        __metadata("design:paramtypes", [Object])
    ], DataComponent);
    exports.DataComponent = DataComponent;
});
define("jassijs/ui/DBObjectDialog", ["require", "exports", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/BoxPanel", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, Table_1, Registry_55, Panel_5, Registry_56, Classes_19, BoxPanel_1, Actions_3, Windows_2) {
    "use strict";
    var DBObjectDialog_1, _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectDialog = void 0;
    let DBObjectDialog = DBObjectDialog_1 = class DBObjectDialog extends Panel_5.Panel {
        //data: DBObject[];
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.splitpanel1 = new BoxPanel_1.BoxPanel();
            me.IDDBView = new Panel_5.Panel();
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
            var data = await Registry_56.default.getJSONData("$DBObjectView");
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
            var data = await Registry_56.default.getJSONData("$DBObjectView");
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
    __decorate([
        Actions_3.$Actions(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
    ], DBObjectDialog, "createActions", null);
    DBObjectDialog = DBObjectDialog_1 = __decorate([
        Actions_3.$ActionProvider("jassijs.base.ActionNode"),
        Registry_55.$Class("jassijs.ui.DBObjectDialog"),
        __metadata("design:paramtypes", [])
    ], DBObjectDialog);
    exports.DBObjectDialog = DBObjectDialog;
    async function test() {
        var ret = await DBObjectDialog.createFor("jassijs.security.User");
        // var ret = await DBObjectDialog.createFor("northwind.Customer");
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/DBObjectExplorer", ["require", "exports", "jassijs/ui/ContextMenu", "jassijs/ui/Tree", "jassijs/remote/Registry", "jassijs/base/Actions", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/base/Router", "jassijs/ui/DBObjectDialog", "jassijs/base/Windows"], function (require, exports, ContextMenu_1, Tree_1, Registry_57, Actions_4, Panel_6, Registry_58, Router_1, DBObjectDialog_2, Windows_3) {
    "use strict";
    var DBObjectExplorer_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectExplorer = exports.DBObjectActions = exports.DBFileActions = exports.DBObjectNode = void 0;
    let DBObjectNode = class DBObjectNode {
    };
    DBObjectNode = __decorate([
        Registry_57.$Class("jassijs.ui.DBObjectNode")
    ], DBObjectNode);
    exports.DBObjectNode = DBObjectNode;
    let DBFileActions = class DBFileActions {
        static async ViewData(all) {
            var entrys = await Registry_58.default.getJSONData("$DBObject");
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
    __decorate([
        Actions_4.$Action({
            name: "View Data",
            isEnabled: async function (all) {
                if (all[0].isDirectory())
                    return false;
                //console.log("TODO make isEnabled this async")
                var entrys = await Registry_58.default.getJSONData("$DBObject");
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
    DBFileActions = __decorate([
        Actions_4.$ActionProvider("jassijs.remote.FileNode"),
        Registry_57.$Class("jassijs.ui.DBFileActions")
    ], DBFileActions);
    exports.DBFileActions = DBFileActions;
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
    __decorate([
        Actions_4.$Action({ name: "View Data" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], DBObjectActions, "ViewData", null);
    __decorate([
        Actions_4.$Action({ name: "Open Code" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], DBObjectActions, "OpenCode", null);
    DBObjectActions = __decorate([
        Actions_4.$ActionProvider("jassijs.ui.DBObjectNode"),
        Registry_57.$Class("jassijs.ui.DBObjectActions")
    ], DBObjectActions);
    exports.DBObjectActions = DBObjectActions;
    let DBObjectExplorer = DBObjectExplorer_1 = class DBObjectExplorer extends Panel_6.Panel {
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
            var entrys = await Registry_58.default.getJSONData("$DBObject");
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
    __decorate([
        Actions_4.$Action({
            name: "Windows",
            icon: "mdi mdi-iframe-array-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DBObjectExplorer, "dummy", null);
    __decorate([
        Actions_4.$Action({
            name: "Windows/Development",
            icon: "mdi mdi-dev-to",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DBObjectExplorer, "dummy2", null);
    __decorate([
        Actions_4.$Action({
            name: "Windows/Development/DBObjects",
            icon: "mdi mdi-database-search",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DBObjectExplorer, "show", null);
    DBObjectExplorer = DBObjectExplorer_1 = __decorate([
        Actions_4.$ActionProvider("jassijs.base.ActionNode"),
        Registry_57.$Class("jassijs.ui.DBObjectExplorer"),
        __metadata("design:paramtypes", [])
    ], DBObjectExplorer);
    exports.DBObjectExplorer = DBObjectExplorer;
    async function test() {
        var ret = new DBObjectExplorer();
        ret.height = 100;
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/DBObjectView", ["require", "exports", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Databinder", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/Property", "jassijs/ui/Notify"], function (require, exports, Button_1, BoxPanel_2, Registry_59, Panel_7, Databinder_1, Component_12, Registry_60, Classes_20, Property_17, Notify_3) {
    "use strict";
    var DBObjectView_3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectView = exports.$DBObjectView = exports.DBObjectViewProperties = void 0;
    class DBObjectViewProperties {
    }
    exports.DBObjectViewProperties = DBObjectViewProperties;
    function $DBObjectView(properties) {
        return function (pclass) {
            Registry_60.default.register("$DBObjectView", pclass, properties);
        };
    }
    exports.$DBObjectView = $DBObjectView;
    let DBObjectView = DBObjectView_3 = class DBObjectView extends Panel_7.Panel {
        constructor() {
            super();
            this.me = {};
            this.dom.classList.add("designerNoResizable"); //this should not be resized only me.main
            //everytime call super.layout
            DBObjectView_3.prototype.layout.bind(this)(this.me);
            // this.layout(this.me);
        }
        config(config) {
            super.config(config);
            return this;
        }
        _setDesignMode(enable) {
            //no Icons to add Components in designer
        }
        /**
         * create a new object
         */
        createObject() {
            var clname = Registry_60.default.getData("$DBObjectView", Classes_20.classes.getClassName(this))[0].params[0].classname;
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
            var ob = await this.me.databinder.fromForm();
            if (ob !== undefined) {
                await this.doSave(ob);
                Notify_3.notify("saved", "info");
            }
        }
        onsaved(handler) {
            this.addEvent("saved", handler);
        }
        /**
         * refresh the object
         */
        refreshObject() {
            this.me.databinder.toForm(this["value"]);
            this.callEvent("refreshed", this["value"]);
        }
        onrefreshed(handler) {
            this.addEvent("refreshed", handler);
        }
        /**
         * deletes Object
         **/
        deleteObject() {
            var ob = this.me.databinder.fromForm();
            if (ob === undefined)
                return;
            ob.remove();
            //set obj to null
            var clname = Registry_60.default.getData("$DBObjectView", Classes_20.classes.getClassName(this))[0].params[0].classname;
            var cl = Classes_20.classes.getClass(clname);
            this["value"] = new cl();
            this.callEvent("deleted", ob);
        }
        ondeleted(handler) {
            this.addEvent("deleted", handler);
        }
        layout(me) {
            var _this = this;
            me.toolbar = new BoxPanel_2.BoxPanel();
            me.save = new Button_1.Button();
            me.remove = new Button_1.Button();
            me.refresh = new Button_1.Button();
            me.create = new Button_1.Button();
            me.databinder = new Databinder_1.Databinder();
            me.main = new Panel_7.Panel();
            me.databinder.definePropertyFor(this, "value");
            this.add(me.toolbar);
            this.add(me.main);
            me.main.width = "100%";
            me.main.height = "100%";
            me.main.css = { position: "relative" };
            me.toolbar.add(me.create);
            me.toolbar.add(me.save);
            me.toolbar.horizontal = true;
            me.toolbar.add(me.refresh);
            me.toolbar.add(me.remove);
            me.save.text = "";
            me.save.tooltip = "save";
            me.save.icon = "mdi mdi-content-save";
            me.save.onclick(function (event) {
                _this.saveObject();
            });
            me.remove.text = "";
            me.remove.icon = "mdi mdi-delete";
            me.remove.onclick(function (event) {
                _this.deleteObject();
            });
            me.remove.tooltip = "remove";
            me.refresh.text = "";
            me.refresh.icon = "mdi mdi-refresh";
            me.refresh.onclick(function (event) {
                _this.refreshObject();
            });
            me.refresh.tooltip = "refresh";
            me.create.text = "";
            me.create.icon = "mdi mdi-tooltip-plus-outline";
            me.create.onclick(function (event) {
                _this.createObject();
                //me.binder.toForm();
            });
            me.create.tooltip = "new";
        }
    };
    __decorate([
        Property_17.$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "oncreated", null);
    __decorate([
        Property_17.$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "onsaved", null);
    __decorate([
        Property_17.$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "onrefreshed", null);
    __decorate([
        Property_17.$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "ondeleted", null);
    DBObjectView = DBObjectView_3 = __decorate([
        Component_12.$UIComponent({ editableChildComponents: ["this", "me.main", "me.toolbar", "me.save", "me.remove", "me.refresh", "me.databinder"] }),
        Registry_59.$Class("jassijs/ui/DBObjectView"),
        __metadata("design:paramtypes", [])
    ], DBObjectView);
    exports.DBObjectView = DBObjectView;
    async function test() {
        var ret = new DBObjectView();
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/DesignDummy", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Image"], function (require, exports, Registry_61, Image_1) {
    "use strict";
    var DesignDummy_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DesignDummy = void 0;
    let DesignDummy = DesignDummy_1 = class DesignDummy extends Image_1.Image {
        constructor() {
            super();
        }
        static createIfNeeded(designDummyFor, type, editorselectthis = undefined, oclass = undefined) {
            var icon = "mdi mdi-card-plus-outline";
            if (type === "beforeComponent")
                icon = "mdi mdi-card-plus";
            if (designDummyFor["designDummies"]) {
                for (var x = 0; x < designDummyFor["designDummies"].length; x++) {
                    var du = designDummyFor["designDummies"][x];
                    if (du.type === type)
                        return du;
                }
            }
            var designDummy;
            if (oclass === undefined)
                designDummy = new DesignDummy_1();
            else
                designDummy = new oclass();
            designDummy.designDummyFor = designDummyFor;
            designDummy.type = type;
            designDummy._parent = designDummyFor;
            designDummy.editorselectthis = editorselectthis;
            designDummy.domWrapper.classList.remove("jcomponent");
            designDummy.domWrapper.classList.add("jdesigndummy");
            designDummy.domWrapper.style.width = "16px";
            if ((oclass === null || oclass === void 0 ? void 0 : oclass._classname) === 'jassijs.ui.MenuItem') {
                designDummy.icon = icon;
            }
            else
                designDummy.src = icon;
            if (type === "atEnd")
                designDummyFor.add(designDummy);
            if (type === "beforeComponent")
                designDummyFor.domWrapper.prepend(designDummy.domWrapper);
            if (!designDummyFor["designDummies"])
                designDummyFor["designDummies"] = [];
            designDummyFor["designDummies"].push(designDummy);
            designDummy.dom.classList.add("designerNoResizable");
            return designDummy;
            //
        }
        static destroyIfNeeded(designDummyFor, type) {
            if (designDummyFor["designDummies"]) {
                designDummyFor["designDummies"].forEach((dummy) => {
                    if (dummy["type"] === type) {
                        if (type === "atEnd")
                            designDummyFor.remove(dummy);
                        if (type === "beforeComponent")
                            designDummyFor.domWrapper.removeChild(dummy.domWrapper);
                        //(<Container>designDummyFor).remove(dummy); // comp.domWrapper.removeChild(comp["_designDummyPre"].domWrapper);
                        dummy.destroy();
                        /*dummy.domWrapper.parentNode.removeChild(dummy.domWrapper)
                        var pos=designDummyFor["designDummies"].indexOf(dummy);
                        if(pos>=0)
                            designDummyFor["designDummies"].splice(pos, 1);*/
                    }
                });
            }
        }
    };
    DesignDummy = DesignDummy_1 = __decorate([
        Registry_61.$Class("jassijs.ui.DesignDummy"),
        __metadata("design:paramtypes", [])
    ], DesignDummy);
    exports.DesignDummy = DesignDummy;
});
define("jassijs/ui/DockingContainer", ["require", "exports", "jassijs/ext/goldenlayout", "jassijs/remote/Registry", "jassijs/ui/Container", "jassijs/ui/Button", "jassijs/ui/Textbox", "jassijs/ext/jquerylib", "jassijs/ext/intersection-observer"], function (require, exports, goldenlayout_2, Registry_62, Container_1, Button_2, Textbox_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DockingContainer = void 0;
    //goldenlayout custom version - fixed leak s.u.
    let DockingContainer = class DockingContainer extends Container_1.Container {
        /**
    * a container where the components could be docked
    * @class jassijs.ui.DockingContainer
    */
        constructor(id = undefined) {
            super(id);
            super.init('<div class="DockingContainer"/>');
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
        ;
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
    DockingContainer = __decorate([
        Registry_62.$Class("jassijs.ui.DockingContainer"),
        __metadata("design:paramtypes", [Object])
    ], DockingContainer);
    exports.DockingContainer = DockingContainer;
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
    exports.test = test;
});
define("jassijs/ui/HTMLEditorPanel", ["require", "exports", "jassijs/ui/Panel", "jassijs/ui/HTMLPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ext/tinymce", "jassijs/remote/Registry"], function (require, exports, Panel_8, HTMLPanel_1, Button_3, Registry_63, tinymce_1, Registry_64) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.te = exports.HTMLEditorPanel = void 0;
    class Me {
    }
    let HTMLEditorPanel = class HTMLEditorPanel extends Panel_8.Panel {
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
            var randclass = "ed" + Registry_64.default.nextID();
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
    HTMLEditorPanel = __decorate([
        Registry_63.$Class("jassijs.ui.HTMLEditorPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLEditorPanel);
    exports.HTMLEditorPanel = HTMLEditorPanel;
    function te() {
        //var dlg=new HTMLEditorPanel();
        // dlg.value="Sample text";
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //return dlg;
    }
    exports.te = te;
});
// return CodeEditor.constructor;
define("jassijs/ui/HTMLPanel", ["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/DataComponent"], function (require, exports, Component_13, Registry_65, Property_18, DataComponent_2) {
    "use strict";
    var HTMLPanel_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.HTMLPanel = void 0;
    var bugtinymce = undefined;
    let HTMLPanel = HTMLPanel_2 = class HTMLPanel extends DataComponent_2.DataComponent {
        /*[
            'undo redo | bold italic underline | fontsizeselect', //fontselect
            'forecolor backcolor | numlist bullist outdent indent'
        ];*/
        constructor(id = undefined) {
            super();
            this.toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
            this.inited = false;
            this.customToolbarButtons = {};
            super.init('<div class="HTMLPanel mce-content-body" tabindex="-1" ><div class="HTMLPanelContent"> </div></div>'); //tabindex for key-event
            //$(this.domWrapper).removeClass("jcontainer");
            //  super.init($('<div class="HTMLPanel"></div>')[0]);
            var el = this.dom.children[0];
            this._designMode = false;
            this.newlineafter = false;
            // $(this.__dom).css("min-width", "10px");
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
                if (HTMLPanel_2.oldeditor) {
                    HTMLPanel_2.oldeditor.getContainer().style.display = "none";
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
    __decorate([
        Property_18.$Property({ description: "line break after element", default: false }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel.prototype, "newlineafter", null);
    __decorate([
        Property_18.$Property({ decription: 'e.g. component.value=new Person();component.template:"{{name}}"' }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLPanel.prototype, "template", null);
    __decorate([
        Property_18.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLPanel.prototype, "value", null);
    HTMLPanel = HTMLPanel_2 = __decorate([
        Component_13.$UIComponent({ fullPath: "common/HTMLPanel", icon: "mdi mdi-cloud-tags" /*, initialize: { value: "text" } */ }),
        Registry_65.$Class("jassijs.ui.HTMLPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel);
    exports.HTMLPanel = HTMLPanel;
    function test() {
        var ret = new HTMLPanel();
        ret.customToolbarButtons.Table = {
            title: "Table",
            action: () => { alert(8); }
        };
        ret.value = "<span style='font-size: 12px;' data-mce-style='font-size: 12px;'>dsf<span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>g<strong>sdfgsd</strong>fgsdfg</span></span><br><strong><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>sdfgsdgsdf</span>gfdsg</strong>";
        ret.height = 400;
        ret.width = 400;
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/Image", ["require", "exports", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/ui/DataComponent"], function (require, exports, Component_14, Property_19, Registry_66, DataComponent_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Image = void 0;
    let Image = class Image extends DataComponent_3.DataComponent {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            super.init('<div style="display: inline-block;white-space: nowrap;"><img  vspace="0" hspace="0"  border="0"  src="" alt=""></div>');
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
                this.dom.children[0].setAttribute("width", "100%");
            super.width = value;
        }
        get height() {
            return super.height;
        }
        set height(value) {
            if (value === undefined)
                this.dom.children[0].setAttribute("height", "");
            else
                this.dom.children[0].setAttribute("height", "100%");
            super.height = value;
        }
        set src(icon) {
            this.dom.classList.forEach((cl) => { this.dom.classList.remove(cl); });
            this.dom.children[0].setAttribute("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi ")) {
                icon.split(" ").forEach((cl) => this.dom.classList.add(cl));
                this.dom.children[0].style.visibility = "hidden";
            }
            else {
                this.dom.children[0].setAttribute("src", icon);
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
    __decorate([
        Property_19.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Image.prototype, "onclick", null);
    __decorate([
        Property_19.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Image.prototype, "value", null);
    __decorate([
        Property_19.$Property({ type: "image" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Image.prototype, "src", null);
    Image = __decorate([
        Component_14.$UIComponent({ fullPath: "default/Image", icon: "mdi mdi-file-image" }) //
        ,
        Registry_66.$Class("jassijs.ui.Image"),
        __metadata("design:paramtypes", [])
    ], Image);
    exports.Image = Image;
    function test() {
        var ret = new Image().config({ src: "mdi mdi-file-image" });
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/InvisibleComponent", ["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Component_15, Registry_67, Property_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvisibleComponent = void 0;
    /**
     * invivisible Component
     **/
    let InvisibleComponent = class InvisibleComponent extends Component_15.Component {
        constructor(properties = undefined) {
            super(properties);
            this.$isInivisibleComponent = true;
        }
    };
    InvisibleComponent = __decorate([
        Registry_67.$Class("jassijs.ui.InvisibleComponent")
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
        Property_20.$Property({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], InvisibleComponent);
    exports.InvisibleComponent = InvisibleComponent;
});
define("jassijs/ui/Menu", ["require", "exports", "jassijs/ui/Container", "jassijs/ui/Property", "jassijs/ui/MenuItem", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/DesignDummy", "jassijs/ext/jquerylib"], function (require, exports, Container_2, Property_21, MenuItem_3, Registry_68, Component_16, DesignDummy_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Menu = void 0;
    let Menu = class Menu extends Container_2.Container {
        constructor(options = undefined) {
            super();
            this._isRoot = true;
            super.init('<ul ' + ` style="Menu"></ul>`);
            if (options !== undefined && options.noUpdate === true) {
                this._noUpdate = true;
            }
            else
                $(this.dom).menu();
            this._text = "";
            this._icon = "";
        }
        config(config) {
            super.config(config);
            return this;
        }
        _sample() {
            super.init('<ul ' + ` class="Menu">
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
</ul>`);
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
            if (this._designDummy !== undefined && this._components[this._components.length - 1] === this._designDummy)
                super.addBefore(component, this._designDummy);
            else
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
            this._designMode = enable;
            if (enable) { //dummy at the end
                DesignDummy_2.DesignDummy.createIfNeeded(this, "atEnd", undefined, MenuItem_3.MenuItem);
                /*            if(this._designDummy===undefined){
                                this._designDummy=new MenuItem();
                                this._designDummy.icon="res/add-component.ico";
                                $(this._designDummy.domWrapper).removeClass("jcomponent");
                                this._designDummy.designDummyFor="atEnd";
                                this.add(this._designDummy);
                            }else if(this._designDummy!==undefined&& this["isAbsolute"]===true){//TODO isAbsolute relevant?
                                this.remove(this._designDummy);
                                this._designDummy=undefined;
                            }*/
            }
            else {
                DesignDummy_2.DesignDummy.destroyIfNeeded(this, "atEnd");
                /* if(this._designDummy!==undefined){
                    this.remove(this._designDummy);
                    this._designDummy=undefined;
                }*/
            }
        }
        destroy() {
            $(this.dom).menu();
            $(this.dom).menu("destroy");
            super.destroy();
        }
    };
    __decorate([
        Property_21.$Property({ name: "onclick", type: "function", default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Menu.prototype, "onclick", null);
    Menu = __decorate([
        Component_16.$UIComponent({ fullPath: "common/Menu", icon: "mdi mdi-menu", initialize: { text: "menu" } }),
        Registry_68.$Class("jassijs.ui.Menu"),
        __metadata("design:paramtypes", [Object])
    ], Menu);
    exports.Menu = Menu;
    function test() {
        var men = new Menu();
        var it = new MenuItem_3.MenuItem();
        it.text = "Hallo";
        //it.onclick(() => alert("ok"));
        men.add(it);
        return men;
    }
    exports.test = test;
});
define("jassijs/ui/MenuItem", ["require", "exports", "jassijs/ui/Component", "jassijs/ui/Menu", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/ui/Container", "jassijs/ext/jquerylib"], function (require, exports, Component_17, Menu_3, Property_22, Registry_69, Container_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MenuItem = void 0;
    let MenuItem = class MenuItem extends Container_3.Container {
        //_components: Component[];
        constructor() {
            super();
            super.init('<li style="white-space: nowrap"><div><span class="menuitemspan"><img style="display: none" class="menuitemicon" /></span><span class="menuitemtext">.</span></div></li>', { noWrapper: true });
            this.dom.classList.add("designerNoResizable");
            this._text = "";
            this._icon = "";
            this.items = new Menu_3.Menu();
            $(this.items.dom).menu("destroy");
            this.items._parent = this;
            this._components = [this.items]; //neede for getEditableComponents
            delete this.items._isRoot;
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
    __decorate([
        Property_22.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], MenuItem.prototype, "onclick", null);
    __decorate([
        Property_22.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MenuItem.prototype, "icon", null);
    __decorate([
        Property_22.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MenuItem.prototype, "text", null);
    MenuItem = __decorate([
        Component_17.$UIComponent({ fullPath: "common/MenuItem", icon: "mdi mdi-menu-open", initialize: { text: "menu" }, editableChildComponents: ["items"] }),
        Registry_69.$Class("jassijs.ui.MenuItem"),
        __metadata("design:paramtypes", [])
    ], MenuItem);
    exports.MenuItem = MenuItem;
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
    exports.test = test;
});
define("jassijs/ui/Notify", ["require", "exports", "jquery", "jquery.notify"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.notifyAddStyle = exports.notify = void 0;
    //@ts-ignore
    $.notify.defaults({ position: "bottom right", className: "info" });
    function notify(text, style, options = undefined) {
        //@ts-ignore
        $.notify(text, style, options);
    }
    exports.notify = notify;
    function notifyAddStyle(style, options) {
        //@ts-ignore
        $.notify.addStyle(style, options);
    }
    exports.notifyAddStyle = notifyAddStyle;
});
define("jassijs/ui/ObjectChooser", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Table", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Textbox", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/remote/Classes", "jassijs/ext/jquerylib"], function (require, exports, Registry_70, Table_2, Panel_9, Button_4, Textbox_6, Property_23, Component_18, Classes_21) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.ObjectChooser = void 0;
    /*
    https://blog.openshift.com/using-filezilla-and-sftp-on-windows-with-openshift/
    */
    class Me {
    }
    let ObjectChooser = class ObjectChooser extends Button_4.Button {
        constructor() {
            super();
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
            me.IDPanel = new Panel_9.Panel();
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
            this._value = value;
        }
        get value() {
            return this._value;
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
            this._databinder = databinder[0];
            this._databinder.add(databinder[1], this, "onchange");
            //databinder.checkAutocommit(this);
        }
        destroy() {
            this._value = undefined;
            this.me.IDPanel.destroy();
            super.destroy();
        }
    };
    __decorate([
        Property_23.$Property({ default: 450 }),
        __metadata("design:type", Number)
    ], ObjectChooser.prototype, "dialogHeight", void 0);
    __decorate([
        Property_23.$Property({ default: 300 }),
        __metadata("design:type", Number)
    ], ObjectChooser.prototype, "dialogWidth", void 0);
    __decorate([
        Property_23.$Property({ type: "string", description: "the classname for to choose" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ObjectChooser.prototype, "items", null);
    __decorate([
        Property_23.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ObjectChooser.prototype, "onchange", null);
    __decorate([
        Property_23.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], ObjectChooser.prototype, "autocommit", null);
    __decorate([
        Property_23.$Property({ type: "databinder" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], ObjectChooser.prototype, "bind", null);
    ObjectChooser = __decorate([
        Component_18.$UIComponent({ fullPath: "common/ObjectChooser", icon: "mdi mdi-glasses" }),
        Registry_70.$Class("jassijs.ui.ObjectChooser"),
        __metadata("design:paramtypes", [])
    ], ObjectChooser);
    exports.ObjectChooser = ObjectChooser;
    async function test() {
        // kk.o=0;
        var User = (await new Promise((resolve_20, reject_20) => { require(["jassijs/remote/security/User"], resolve_20, reject_20); })).User;
        var dlg = new ObjectChooser();
        dlg.items = "jassijs.security.User";
        dlg.value = (await User.findOne());
        //	var kunden=await jassijs.db.load("de.Kunde");
        //	dlg.value=kunden[4];
        //	dlg.me.IDTable.items=kunden;
        return dlg;
    }
    exports.test = test;
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
    exports.test2 = test2;
});
define("jassijs/ui/OptionDialog", ["require", "exports", "jassijs/ui/Panel", "jassijs/ui/BoxPanel", "jassijs/ui/HTMLPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/Textbox", "jassijs/remote/Classes", "jassijs/ext/jquerylib"], function (require, exports, Panel_10, BoxPanel_3, HTMLPanel_3, Button_5, Registry_71, Property_24, Textbox_7, Classes_22) {
    "use strict";
    var OptionDialog_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.OptionDialog = void 0;
    class Me {
    }
    let OptionDialog = OptionDialog_1 = class OptionDialog extends Panel_10.Panel {
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
            me.htmlpanel1 = new HTMLPanel_3.HTMLPanel();
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
    __decorate([
        Property_24.$Property(),
        __metadata("design:type", String)
    ], OptionDialog.prototype, "text", void 0);
    OptionDialog = OptionDialog_1 = __decorate([
        Registry_71.$Class("jassijs.ui.OptionDialog"),
        __metadata("design:paramtypes", [Object])
    ], OptionDialog);
    exports.OptionDialog = OptionDialog;
    let Testprop = class Testprop {
    };
    __decorate([
        Property_24.$Property(),
        __metadata("design:type", Boolean)
    ], Testprop.prototype, "visible", void 0);
    __decorate([
        Property_24.$Property(),
        __metadata("design:type", String)
    ], Testprop.prototype, "text", void 0);
    Testprop = __decorate([
        Registry_71.$Class("jassijs.ui.OptionDialogTestProp")
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
    exports.test2 = test2;
    ;
});
define("jassijs/ui/Panel", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Container", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/ui/DesignDummy"], function (require, exports, Registry_72, Container_4, Component_19, Property_25, DesignDummy_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Panel = exports.PanelProperties = void 0;
    let PanelProperties = class PanelProperties extends Container_4.ContainerProperties {
    };
    __decorate([
        Property_25.$Property(),
        __metadata("design:type", Boolean)
    ], PanelProperties.prototype, "isAbsolute", void 0);
    __decorate([
        Property_25.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], PanelProperties.prototype, "useSpan", void 0);
    PanelProperties = __decorate([
        Registry_72.$Class("jassijs.ui.PanelProperties")
    ], PanelProperties);
    exports.PanelProperties = PanelProperties;
    let Panel = 
    //@$Property({ name: "new/useSpan", type: "boolean", default: false })
    class Panel extends Container_4.Container {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this._designMode = false;
            this.isAbsolute = (properties === null || properties === void 0 ? void 0 : properties.isAbsolute) === true;
        }
        render() {
            var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
            return React.createElement(tag, { className: "Panel" });
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
            this._designMode = enable;
            if (enable) { //dummy in containers at the end
                if (this.isAbsolute === false) {
                    DesignDummy_3.DesignDummy.createIfNeeded(this, "atEnd", (this["_editorselectthis"] ? this["_editorselectthis"] : this));
                    /*            if (this._designDummy === undefined && this.isAbsolute === false) {
                                    this._designDummy = new Image();
                                    this._designDummy._parent=this;
                                    console.log(this._designDummy._id);
                                    $(this._designDummy.domWrapper).removeClass("jcomponent");
                                    $(this._designDummy.domWrapper).addClass("jdesigndummy");
                                    $(this._designDummy.domWrapper).css("width","16px");
                                    this._designDummy["designDummyFor"] = "atEnd";
                                    this._designDummy["src"] = "res/add-component.ico";
                                    this._designDummy["_editorselectthis"]=(this["_editorselectthis"]?this["_editorselectthis"]:this);
                                    //$(this.domWrapper).append(this._designDummy.domWrapper);
                                    this.domWrapper.appendChild(this._designDummy.domWrapper);
                                } else if (this._designDummy !== undefined && this.isAbsolute === true) {
                                    this.remove(this._designDummy);
                                    this._designDummy.destroy();
                                    this._designDummy = undefined;
                                }*/
                }
                else {
                    DesignDummy_3.DesignDummy.destroyIfNeeded(this, "atEnd");
                    /* if (this._designDummy !== undefined) {
                         this.remove(this._designDummy);
                         this._designDummy = undefined;
                     }*/
                }
            }
            else {
                DesignDummy_3.DesignDummy.destroyIfNeeded(this, "atEnd");
            }
            if (enable) { //dummy in containers at the end
                if (this.isAbsolute === false && this._components) {
                    for (var x = 0; x < this._components.length; x++) {
                        var comp = this._components[x];
                        if (comp instanceof Container_4.Container && !comp.dom.classList.contains("jdisableaddcomponents")) {
                            DesignDummy_3.DesignDummy.createIfNeeded(comp, "beforeComponent", (this["_editorselectthis"] ? this["_editorselectthis"] : this));
                        }
                    }
                }
            }
            else {
                if (this._components) {
                    for (var x = 0; x < this._components.length; x++) {
                        var comp = this._components[x];
                        DesignDummy_3.DesignDummy.destroyIfNeeded(comp, "beforeComponent");
                    }
                }
            }
        }
        destroy() {
            super.destroy();
            if (this._designDummy)
                this._designDummy.destroy();
            this._activeComponentDesigner = undefined;
        }
    };
    __decorate([
        Property_25.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Panel.prototype, "isAbsolute", null);
    Panel = __decorate([
        Component_19.$UIComponent({ fullPath: "common/Panel", icon: "mdi mdi-checkbox-blank-outline", editableChildComponents: ["this"] }),
        Registry_72.$Class("jassijs.ui.Panel"),
        Property_25.$Property({ name: "new", type: "json", componentType: "jassijs.ui.PanelProperties" })
        //@$Property({ name: "new/useSpan", type: "boolean", default: false })
        ,
        __metadata("design:paramtypes", [PanelProperties])
    ], Panel);
    exports.Panel = Panel;
});
define("jassijs/ui/Property", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Registry_73, Registry_74, Classes_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Property = exports.$Property = void 0;
    function $Property(property = undefined) {
        return function (target, propertyKey, descriptor) {
            //debugger;
            var test = Classes_23.classes.getClassName(target);
            if (propertyKey === undefined)
                Registry_74.default.registerMember("$Property", target.prototype, "new", property); //allow registerMember in class definition
            else
                Registry_74.default.registerMember("$Property", target, propertyKey, property);
        };
    }
    exports.$Property = $Property;
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
    Property = __decorate([
        Registry_73.$Class("jassijs.ui.Property"),
        __metadata("design:paramtypes", [Object, Object])
    ], Property);
    exports.Property = Property;
});
define("jassijs/ui/PropertyEditor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Image", "jassijs/ui/ComponentDescriptor", "jassijs/ui/PropertyEditors/NameEditor", "jassijs/base/PropertyEditorService", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/ext/jquerylib", "jassijs/base/PropertyEditorService"], function (require, exports, Registry_75, Panel_11, Button_6, Image_2, ComponentDescriptor_4, NameEditor_1, PropertyEditorService_1, Property_26, Component_20) {
    "use strict";
    var PropertyEditor_1, _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.PropertyEditorTestSubProperties = exports.PropertyEditor = void 0;
    let PropertyEditor = PropertyEditor_1 = class PropertyEditor extends Panel_11.Panel {
        /**
        * edit object properties
        */
        constructor(codeEditor = undefined, parser = undefined) {
            super();
            this.readPropertyValueFromDesign = false;
            this.codeChanges = {};
            this.table = new Panel_11.Panel();
            this.toolbar = new Panel_11.Panel();
            this.parser = parser;
            this.table.init(`<table style="table-layout: fixed;font-size:11px">
                            <thead>
                                <tr>
                                    <th class="propertyeditorheader">Name</th>
                                    <th class="propertyeditorheader">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="propertyeditorrow">
                                    <td >a1</td><td>b1</td>
                                </tr>
                            </tbody>
                            </table>`);
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
            var row = Component_20.Component.createHTMLElement('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>');
            //var row=$('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>')[0];
            var deletebutton = new Image_2.Image();
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
            var dummy = Component_20.Component.createHTMLElement("<div/>");
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
                    this.parser.parse(text);
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
            var ret = this.parser.addVariableInCode(type, undefined, scopename, suggestedName);
            /* var ret = this.parser.addVariableInCode(type, [{ classname: val?.constructor?.name, methodname: "layout" },
             { classname: undefined, methodname: "test" }], scopename);
             */ this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
            this.callEvent("codeChanged", {});
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
                this._value[property] = value;
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
            this.codeEditor.value = code;
            this.updateParser();
            this.callEvent("codeChanged", {});
        }
        /**
         * renames a variable in design
         */
        renameVariableInDesign(oldName, newName) {
            this.codeEditor.renameVariable(oldName, newName);
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
    PropertyEditor = PropertyEditor_1 = __decorate([
        Registry_75.$Class("jassijs.ui.PropertyEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], PropertyEditor);
    exports.PropertyEditor = PropertyEditor;
    let PropertyEditorTestSubProperties = class PropertyEditorTestSubProperties {
        constructor() {
            this.num = 19;
            this.text = "prop";
        }
    };
    __decorate([
        Property_26.$Property(),
        __metadata("design:type", Number)
    ], PropertyEditorTestSubProperties.prototype, "num", void 0);
    __decorate([
        Property_26.$Property(),
        __metadata("design:type", String)
    ], PropertyEditorTestSubProperties.prototype, "text", void 0);
    PropertyEditorTestSubProperties = __decorate([
        Registry_75.$Class("jassijs.ui.PropertyEditorTestSubProperties")
    ], PropertyEditorTestSubProperties);
    exports.PropertyEditorTestSubProperties = PropertyEditorTestSubProperties;
    let TestProperties = class TestProperties {
        constructor() {
            this.html = "sample";
        }
        func(any) {
        }
        ;
    };
    __decorate([
        Property_26.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "dialogname", void 0);
    __decorate([
        Property_26.$Property(),
        __metadata("design:type", Boolean)
    ], TestProperties.prototype, "checked", void 0);
    __decorate([
        Property_26.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "color", void 0);
    __decorate([
        Property_26.$Property({ type: "componentselector", componentType: "jassi.ui.Component" }),
        __metadata("design:type", typeof (_a = typeof Component_20.Component !== "undefined" && Component_20.Component) === "function" ? _a : Object)
    ], TestProperties.prototype, "component", void 0);
    __decorate([
        Property_26.$Property({ type: "databinder" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "databinder", void 0);
    __decorate([
        Property_26.$Property({ type: "dbobject", componentType: "de.Kunde" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "dbobject", void 0);
    __decorate([
        Property_26.$Property({ default: 80 }),
        __metadata("design:type", Number)
    ], TestProperties.prototype, "num", void 0);
    __decorate([
        Property_26.$Property({ type: "font" }),
        __metadata("design:type", Number)
    ], TestProperties.prototype, "font", void 0);
    __decorate([
        Property_26.$Property({ type: "function" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], TestProperties.prototype, "func", null);
    __decorate([
        Property_26.$Property({ type: "html" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "html", void 0);
    __decorate([
        Property_26.$Property({ type: "image" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "image", void 0);
    __decorate([
        Property_26.$Property({ type: "json", componentType: "jassijs.ui.PropertyEditorTestSubProperties" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "json", void 0);
    TestProperties = __decorate([
        Registry_75.$Class("jassijs.ui.PropertyEditorTestProperties")
    ], TestProperties);
    function test() {
        var ret = new PropertyEditor();
        ret.value = new TestProperties();
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/PropertyEditors/BooleanEditor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Checkbox", "jassijs/ui/PropertyEditors/Editor"], function (require, exports, Registry_76, Checkbox_2, Editor_1) {
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
    BooleanEditor = __decorate([
        Editor_1.$PropertyEditor(["boolean"]),
        Registry_76.$Class("jassijs.ui.PropertyEditors.BooleanEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], BooleanEditor);
    exports.BooleanEditor = BooleanEditor;
});
define("jassijs/ui/PropertyEditors/ClassSelectorEditor", ["require", "exports", "jassijs/ui/Select", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/PropertyEditors/JsonEditor", "jassijs/util/Tools", "jassijs/ui/converters/StringConverter", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Classes"], function (require, exports, Select_2, Editor_2, JsonEditor_1, Tools_1, StringConverter_1, Registry_77, Panel_12, Textbox_8, Registry_78, ComponentDescriptor_5, Classes_24) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClassSelectorEditor = void 0;
    let ClassSelectorEditor = class ClassSelectorEditor extends Editor_2.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property = undefined, propertyEditor = undefined) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_12.Panel();
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
            Registry_78.default.loadAllFilesForService(this.property.service).then(function () {
                var converters = Registry_78.default.getData(_this.property.service);
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
            me.pan = new Panel_12.Panel();
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
    ClassSelectorEditor = __decorate([
        Editor_2.$PropertyEditor(["classselector"]),
        Registry_77.$Class("jassijs.ui.PropertyEditors.ClassSelectorEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ClassSelectorEditor);
    exports.ClassSelectorEditor = ClassSelectorEditor;
    jassijs.test = function () {
        ComponentDescriptor_5.ComponentDescriptor.cache = {};
        var t = new ClassSelectorEditor();
        t.layout();
        return t.me.pan;
    };
});
define("jassijs/ui/PropertyEditors/ColorEditor", ["require", "exports", "jassijs/ui/PropertyEditor", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Select", "jassijs/ui/BoxPanel", "jassijs/ext/jquerylib", "jassijs/ext/spectrum"], function (require, exports, PropertyEditor_2, Editor_3, Textbox_9, Registry_79, Select_3, BoxPanel_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test3 = exports.ColorEditor = void 0;
    var colors = ["black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "orange", "aliceblue", "antiquewhite", "aquamarine", "azure", "beige", "bisque", "blanchedalmond", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "gold", "goldenrod", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "limegreen", "linen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace", "olivedrab", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "wheat", "whitesmoke", "yellowgreen", "rebeccapurple"];
    let ColorEditor = 
    /**
    * Editor for color
    * used by PropertyEditor
    **/
    class ColorEditor extends Editor_3.Editor {
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
    ColorEditor = __decorate([
        Editor_3.$PropertyEditor(["color"]),
        Registry_79.$Class("jassijs.ui.PropertyEditors.ColorEditor")
        /**
        * Editor for color
        * used by PropertyEditor
        **/
        ,
        __metadata("design:paramtypes", [Object, Object])
    ], ColorEditor);
    exports.ColorEditor = ColorEditor;
    function test3() {
        var prop = new PropertyEditor_2.PropertyEditor();
        prop.value = new Textbox_9.Textbox();
        return prop;
    }
    exports.test3 = test3;
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
    exports.test2 = test2;
});
define("jassijs/ui/PropertyEditors/ComponentEditor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox"], function (require, exports, Registry_80, Editor_4, Textbox_10) {
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
    BooleanEditor = __decorate([
        Editor_4.$PropertyEditor(["jassijs.ui.Component"]),
        Registry_80.$Class("jassijs.ui.PropertyEditors.ComponentEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], BooleanEditor);
    exports.BooleanEditor = BooleanEditor;
});
define("jassijs/ui/PropertyEditors/ComponentSelectorEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Select", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Editor_5, Select_4, Classes_25, Registry_81) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentSelectorEditor = void 0;
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
    ComponentSelectorEditor = __decorate([
        Editor_5.$PropertyEditor(["componentselector"]),
        Registry_81.$Class("jassijs.ui.PropertyEditors.ComponentSelectorEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ComponentSelectorEditor);
    exports.ComponentSelectorEditor = ComponentSelectorEditor;
    function test() {
    }
    exports.test = test;
});
define("jassijs/ui/PropertyEditors/DatabinderEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Databinder", "jassijs/remote/Registry", "jassijs/ui/Textbox"], function (require, exports, Editor_6, Databinder_2, Registry_82, Textbox_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DatabinderEditor = void 0;
    let DatabinderEditor = class DatabinderEditor extends Editor_6.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Textbox_11.Textbox(); //Select();
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
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined) {
                try {
                    if (value.startsWith("["))
                        value = value.substring(1);
                    if (value.endsWith("]"))
                        value = value.substring(0, value.length - 1);
                    var sp = value.replaceAll('"', "").split(",");
                    value = sp[1] + "-" + sp[0];
                    this.component.value = value;
                }
                catch ( //PropertyEditor without codeeditor
                _a) { //PropertyEditor without codeeditor
                    this.component.value = "";
                }
            }
            else {
                this.component.value = "";
            }
            //TODO call this on focus
            var binders = this.propertyEditor.getVariablesForType(Databinder_2.Databinder);
            if (binders !== undefined) {
                var comps = [];
                for (var x = 0; x < binders.length; x++) {
                    var binder = this.propertyEditor.getObjectFromVariable(binders[x]);
                    if (binder === undefined)
                        continue;
                    let ob = binder.value;
                    if (ob !== undefined && !Array.isArray(ob)) {
                        for (var m in ob) {
                            comps.push(m + "-" + binders[x]);
                        }
                    }
                    comps.push("this-" + binders[x]);
                }
                this.component.autocompleter = comps;
            }
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
            var sp = val.split("-");
            val = "[" + sp[1] + ',"' + sp[0] + '"]';
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var func = this.propertyEditor.value[this.property.name];
            var binder = this.propertyEditor.getObjectFromVariable(sp[1]);
            this.propertyEditor.value[this.property.name] = [binder, sp[0]];
            //setPropertyInDesign(this.property.name,val);
            super.callEvent("edit", param);
        }
    };
    DatabinderEditor = __decorate([
        Editor_6.$PropertyEditor(["databinder"]),
        Registry_82.$Class("jassijs.ui.PropertyEditors.DatabinderEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DatabinderEditor);
    exports.DatabinderEditor = DatabinderEditor;
});
define("jassijs/ui/PropertyEditors/DBObjectEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/ui/ObjectChooser", "jassijs/remote/Classes"], function (require, exports, Editor_7, Registry_83, Panel_13, Textbox_12, ObjectChooser_1, Classes_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBObjectEditor = void 0;
    let DBObjectEditor = class DBObjectEditor extends Editor_7.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_13.Panel( /*{useSpan:true}*/);
            this._textbox = new Textbox_12.Textbox();
            this._objectchooser = new ObjectChooser_1.ObjectChooser();
            this._objectchooser.width = 24;
            this._textbox.width = "calc(100% - 34px)";
            this.component.height = 24;
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
    DBObjectEditor = __decorate([
        Editor_7.$PropertyEditor(["dbobject"]),
        Registry_83.$Class("jassijs.ui.PropertyEditors.DBObjectEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DBObjectEditor);
    exports.DBObjectEditor = DBObjectEditor;
});
define("jassijs/ui/PropertyEditors/DefaultEditor", ["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Select"], function (require, exports, Textbox_13, Editor_8, Registry_84, Select_5) {
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
        Editor_8.$PropertyEditor(["string", "number", "number[]", "boolean[]"]),
        Registry_84.$Class("jassijs.ui.PropertyEditors.DefaultEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DefaultEditor);
});
define("jassijs/ui/PropertyEditors/Editor", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry"], function (require, exports, Registry_85, Registry_86) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Editor = exports.$PropertyEditor = void 0;
    function $PropertyEditor(supportedtypes) {
        return function (pclass) {
            Registry_86.default.register("$PropertyEditor", pclass, supportedtypes);
        };
    }
    exports.$PropertyEditor = $PropertyEditor;
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
    Editor = __decorate([
        Registry_85.$Class("jassijs.ui.PropertyEditors.Editor"),
        __metadata("design:paramtypes", [Object, Object])
    ], Editor);
    exports.Editor = Editor;
});
define("jassijs/ui/PropertyEditors/FontEditor", ["require", "exports", "jassijs/ui/PropertyEditor", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Select", "jassijs/ui/CSSProperties"], function (require, exports, PropertyEditor_3, Editor_9, Textbox_14, Registry_87, Select_6, CSSProperties_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.test2 = exports.FontEditor = void 0;
    let systemFonts = ["Arial", "Helvetica Neue", "Courier New", "Times New Roman", "Comic Sans MS", "Impact"];
    let googleFonts = ["Aclonica", "Allan", "Annie Use Your Telescope", "Anonymous Pro", "Allerta Stencil", "Allerta", "Amaranth", "Anton", "Architects Daughter", "Arimo", "Artifika", "Arvo", "Asset", "Astloch", "Bangers", "Bentham", "Bevan", "Bigshot One", "Bowlby One", "Bowlby One SC", "Brawler", "Buda:300", "Cabin", "Calligraffitti", "Candal", "Cantarell", "Cardo", "Carter One", "Caudex", "Cedarville Cursive", "Cherry Cream Soda", "Chewy", "Coda", "Coming Soon", "Copse", "Corben", "Cousine", "Covered By Your Grace", "Crafty Girls", "Crimson Text", "Crushed", "Cuprum", "Damion", "Dancing Script", "Dawning of a New Day", "Didact Gothic", "Droid Sans", "Droid Serif", "EB Garamond", "Expletus Sans", "Fontdiner Swanky", "Forum", "Francois One", "Geo", "Give You Glory", "Goblin One", "Goudy Bookletter 1911", "Gravitas One", "Gruppo", "Hammersmith One", "Holtwood One SC", "Homemade Apple", "Inconsolata", "Indie Flower", "Irish Grover", "Istok Web", "Josefin Sans", "Josefin Slab", "Judson", "Jura", "Just Another Hand", "Just Me Again Down Here", "Kameron", "Kenia", "Kranky", "Kreon", "Kristi", "La Belle Aurore", "Lato", "League Script", "Lekton", "Limelight", "Lobster", "Lobster Two", "Lora", "Love Ya Like A Sister", "Loved by the King", "Luckiest Guy", "Maiden Orange", "Mako", "Maven Pro", "Maven Pro:900", "Meddon", "MedievalSharp", "Megrim", "Merriweather", "Metrophobic", "Michroma", "Miltonian Tattoo", "Miltonian", "Modern Antiqua", "Monofett", "Molengo", "Mountains of Christmas", "Muli:300", "Muli", "Neucha", "Neuton", "News Cycle", "Nixie One", "Nobile", "Nova Cut", "Nova Flat", "Nova Mono", "Nova Oval", "Nova Round", "Nova Script", "Nova Slim", "Nova Square", "Nunito", "Old Standard TT", "Open Sans:300", "Open Sans", "Open Sans:600", "Open Sans:800", "Open Sans Condensed:300", "Orbitron", "Orbitron:500", "Orbitron:700", "Orbitron:900", "Oswald", "Over the Rainbow", "Reenie Beanie", "Pacifico", "Patrick Hand", "Paytone One", "Permanent Marker", "Philosopher", "Play", "Playfair Display", "Podkova", "Press Start 2P", "Puritan", "Quattrocento", "Quattrocento Sans", "Radley", "Raleway:100", "Redressed", "Roboto", "Rock Salt", "Rokkitt", "Ruslan Display", "Schoolbell", "Shadows Into Light", "Shanti", "Sigmar One", "Six Caps", "Slackey", "Smythe", "Sniglet", "Sniglet:800", "Special Elite", "Stardos Stencil", "Sue Elen Francisco", "Sunshiney", "Swanky and Moo Moo", "Syncopate", "Tangerine", "Tenor Sans", "Terminal Dosis Light", "The Girl Next Door", "Tinos", "Ubuntu", "Ultra", "Unkempt", "UnifrakturCook:bold", "UnifrakturMaguntia", "Varela", "Varela Round", "Vibur", "Vollkorn", "VT323", "Waiting for the Sunrise", "Wallpoet", "Walter Turncoat", "Wire One", "Yanone Kaffeesatz", "Yeseva One", "Zeyada"];
    let FontEditor = 
    /**
    * Editor for font
    * used by PropertyEditor
    **/
    class FontEditor extends Editor_9.Editor {
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
                CSSProperties_2.loadFontIfNedded(googleFonts[i]);
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
    FontEditor = __decorate([
        Editor_9.$PropertyEditor(["font"]),
        Registry_87.$Class("jassijs.ui.PropertyEditors.FontEditor")
        /**
        * Editor for font
        * used by PropertyEditor
        **/
        ,
        __metadata("design:paramtypes", [Object, Object])
    ], FontEditor);
    exports.FontEditor = FontEditor;
    function test2() {
        var prop = new PropertyEditor_3.PropertyEditor();
        prop.value = new Textbox_14.Textbox();
        return prop;
    }
    exports.test2 = test2;
    function test() {
        var prop = new FontEditor(undefined, undefined);
        return prop.component;
    }
    exports.test = test;
});
define("jassijs/ui/PropertyEditors/FunctionEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Button", "jassijs/remote/Registry"], function (require, exports, Editor_10, Button_7, Registry_88) {
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
    FunctionEditor = __decorate([
        Editor_10.$PropertyEditor(["function"]),
        Registry_88.$Class("jassijs.ui.PropertyEditors.FunctionEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], FunctionEditor);
    exports.FunctionEditor = FunctionEditor;
});
define("jassijs/ui/PropertyEditors/HTMLEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Textbox", "jassijs/ui/ObjectChooser", "jassijs/ui/Panel"], function (require, exports, Editor_11, Registry_89, Textbox_15, ObjectChooser_2, Panel_14) {
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
            this.component = new Panel_14.Panel( /*{useSpan:true}*/);
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
    HTMLEditor = __decorate([
        Editor_11.$PropertyEditor(["html"]),
        Registry_89.$Class("jassijs.ui.PropertyEditors.HTMLEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], HTMLEditor);
    exports.HTMLEditor = HTMLEditor;
});
define("jassijs/ui/PropertyEditors/ImageEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/base/Actions", "../Component", "jassijs/ext/jquerylib"], function (require, exports, Editor_12, Registry_90, Panel_15, Textbox_16, Button_8, Actions_5, Component_21) {
    "use strict";
    var ImageEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.ImageEditor = void 0;
    let ImageEditor = ImageEditor_1 = class ImageEditor extends Editor_12.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_15.Panel( /*{useSpan:true}*/);
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
                this.dialog = new Panel_15.Panel();
                var suche = new Textbox_16.Textbox();
                var icons = new Panel_15.Panel();
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
                var file = (await new Promise((resolve_21, reject_21) => { require(["jassijs/modul"], resolve_21, reject_21); })).default.css["materialdesignicons.min.css"] + "?ooo=9";
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
                var node = Component_21.Component.createHTMLElement("<span style='font-size:18pt'>" + html + "</span>");
                icons.__dom.appendChild(node);
                if (!onlytest)
                    $(this.dialog.__dom).dialog({ height: "400", width: "400" });
            }
            else {
                $(this.dialog.__dom).dialog("open");
            }
        }
    };
    __decorate([
        Actions_5.$Action({
            name: "Tools",
            icon: "mdi mdi-tools",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImageEditor, "dummy", null);
    __decorate([
        Actions_5.$Action({
            name: "Tools/Icons",
            icon: "mdi mdi-image-area",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImageEditor, "show", null);
    ImageEditor = ImageEditor_1 = __decorate([
        Actions_5.$ActionProvider("jassijs.base.ActionNode"),
        Editor_12.$PropertyEditor(["image"]),
        Registry_90.$Class("jassijs.ui.PropertyEditors.ImageEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ImageEditor);
    exports.ImageEditor = ImageEditor;
    function test2() {
        var ed = new ImageEditor(undefined, undefined);
        ed.showDialog(true);
        return ed.dialog;
    }
    exports.test2 = test2;
});
define("jassijs/ui/PropertyEditors/JsonArrayEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/PropertyEditor", "jassijs/ui/BoxPanel", "jassijs/ui/Table", "jassijs/ui/Button"], function (require, exports, Editor_13, Registry_91, Property_27, PropertyEditor_4, BoxPanel_5, Table_3, Button_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.JsonArrayEditor = void 0;
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
                columns: [{ field: "field", title: "field" }]
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
    JsonArrayEditor = __decorate([
        Editor_13.$PropertyEditor(["jsonarray"]),
        Registry_91.$Class("jassijs.ui.PropertyEditors.JsonArrayEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], JsonArrayEditor);
    exports.JsonArrayEditor = JsonArrayEditor;
    let TestProperties = class TestProperties {
    };
    __decorate([
        Property_27.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "name1", void 0);
    __decorate([
        Property_27.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "name2", void 0);
    TestProperties = __decorate([
        Registry_91.$Class("jassijs.ui.JsonArrayEditor.TestProperties")
    ], TestProperties);
    let TestProperties2 = class TestProperties2 {
    };
    __decorate([
        Property_27.$Property({ decription: "name of the dialog", type: "jsonarray", componentType: "jassijs.ui.JsonArrayEditor.TestProperties" }),
        __metadata("design:type", Object)
    ], TestProperties2.prototype, "ob", void 0);
    TestProperties2 = __decorate([
        Registry_91.$Class("jassijs.ui.JsonArrayEditor.TestProperties2")
    ], TestProperties2);
    function test() {
        var ret = new PropertyEditor_4.PropertyEditor();
        ret.value = new TestProperties2();
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/PropertyEditors/JsonEditor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Button", "jassijs/ui/PropertyEditor", "jassijs/util/Tools", "jassijs/remote/Classes", "jassijs/ui/Property", "jassijs/ext/jquerylib"], function (require, exports, Registry_92, Editor_14, Button_10, PropertyEditor_5, Tools_2, Classes_27, Property_28) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.JsonEditor = void 0;
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
            debugger;
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
    JsonEditor = __decorate([
        Editor_14.$PropertyEditor(["json"]),
        Registry_92.$Class("jassijs.ui.PropertyEditors.JsonEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], JsonEditor);
    exports.JsonEditor = JsonEditor;
    var actions = [{
            name: "PropertyAction",
            call: (hallo) => alert("Hallo2"),
            description: "Hallodesc2",
            icon: "mdi mdi-account-hard-hat"
        }];
    let TestProperties2 = class TestProperties2 {
    };
    __decorate([
        Property_28.$Property(),
        __metadata("design:type", Boolean)
    ], TestProperties2.prototype, "hallo", void 0);
    TestProperties2 = __decorate([
        Registry_92.$Class("jassijs.ui.PropertyEditorTestProperties2")
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
        Property_28.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "dialogname", void 0);
    __decorate([
        Property_28.$Property({ name: "jo", type: "json", componentType: "jassijs.ui.PropertyEditorTestProperties2",
            editoractions: actions
        }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "jo", void 0);
    TestProperties = __decorate([
        Registry_92.$Class("jassijs.ui.PropertyEditorTestProperties")
    ], TestProperties);
    function test() {
        var ret = new PropertyEditor_5.PropertyEditor();
        ret.value = new TestProperties();
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/PropertyEditors/NameEditor", ["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox", "jassijs/remote/Registry"], function (require, exports, Editor_15, Textbox_17, Registry_93) {
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
            if (value.startsWith("this."))
                value = value.substring(5);
            if (value.startsWith("me."))
                value = value.substring(3);
            /*            var value=this.propertyEditor.getPropertyValue(this.property);
                        if(value!==undefined&&value.startsWith("\"")&&value.endsWith("\"")&&this.property.type==="string"){
                            value=value.substring(1,value.length-1);
                        }*/
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
            var old = this.propertyEditor.getVariableFromObject(this._ob);
            this.propertyEditor.renameVariableInCode(old, this.component.value);
            this.propertyEditor.renameVariableInDesign(old, this.component.value);
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
    NameEditor = __decorate([
        Editor_15.$PropertyEditor(["*name*"]),
        Registry_93.$Class("jassijs.ui.PropertyEditors.NameEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], NameEditor);
    exports.NameEditor = NameEditor;
});
define("jassijs/ui/PropertyEditors/TableColumnImport", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Registry_94, Panel_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TableColumnImport = void 0;
    let TableColumnImport = class TableColumnImport extends Panel_16.Panel {
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
    TableColumnImport = __decorate([
        Registry_94.$Class("jassijs/ui/PropertyEditors/TableColumnImport"),
        __metadata("design:paramtypes", [])
    ], TableColumnImport);
    exports.TableColumnImport = TableColumnImport;
    async function test() {
        var ret = new TableColumnImport();
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/Repeater", ["require", "exports", "jassijs/ui/Panel", "jassijs/ui/Databinder", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Registry"], function (require, exports, Panel_17, Databinder_3, Component_22, Property_29, Registry_95) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Repeater = void 0;
    let RepeaterDesignPanel = class RepeaterDesignPanel extends Panel_17.Panel {
    };
    RepeaterDesignPanel = __decorate([
        Component_22.$UIComponent({ editableChildComponents: ["databinder"] }),
        Registry_95.$Class("jassijs.ui.RepeaterDesignPanel")
    ], RepeaterDesignPanel);
    let Repeater = class Repeater extends Panel_17.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super();
            this._autocommit = false;
            this.design = new RepeaterDesignPanel();
            this.add(this.design);
            this.design.width = "100%";
            this.design.height = "100%";
            this.design.domWrapper.classList.add("designerNoDraggable");
            this.design.dom.classList.add("designerNoSelectable");
            this.design.dom.classList.add("designerNoResizable");
        }
        config(config) {
            super.config(config);
            return this;
        }
        createRepeatingComponent(func) {
            this._createRepeatingComponent = func;
            func.bind(this);
            if (this._value !== undefined)
                this.update();
        }
        _copyMeFromParent(me, parent, override = true) {
            if (parent === undefined)
                return;
            if (parent.me !== undefined) {
                for (var key in parent.me) {
                    if (override === true || me[key] === undefined) {
                        me[key] = parent.me[key];
                    }
                }
                return;
            }
            this._copyMeFromParent(me, parent._parent);
        }
        update() {
            if (this._createRepeatingComponent === undefined)
                return;
            if (this._designMode === true) {
                if (this.design._parent !== this) {
                    this.removeAll();
                    this.add(this.design);
                }
                if (this._isCreated !== true) {
                    this.design.databinder = new Databinder_3.Databinder();
                    // var code:string=this._createRepeatingComponent.toString();
                    // var varname=code.substring(code.indexOf("(")+1,code.indexOf(")"));
                    // this._componentDesigner._codeEditor.variables.addVariable(varname,this.design.databinder);
                    this.me = {};
                    this._copyMeFromParent(this.me, this._parent);
                    this._createRepeatingComponent(this.me);
                    var comp = this._componentDesigner.designedComponent;
                    if (comp["me"] !== undefined) {
                        this._copyMeFromParent(comp["me"], this, false); //me from Dialog
                        this._componentDesigner._codeEditor.variables.addVariable("me", comp["me"]);
                        this._componentDesigner._codeEditor.variables.updateCache();
                    }
                    this._isCreated = true;
                }
                if (this.value === undefined || this.value === null || this.value.length < 0)
                    this.design.databinder.value = undefined;
                else
                    this.design.databinder.value = this.value[0];
                this.design.extensionCalled({
                    componentDesignerSetDesignMode: {
                        enable: this._designMode,
                        componentDesigner: undefined
                    }
                });
                //this.design._setDesignMode(this._designMode);
            }
            else {
                this.remove(this.design); //no destroy the design
                this.removeAll(true);
                if (this.value === undefined)
                    return;
                var sic = this.design;
                for (var x = 0; x < this.value.length; x++) {
                    this.design = new RepeaterDesignPanel();
                    var ob = this.value[x];
                    this.design.databinder = new Databinder_3.Databinder();
                    this.design.databinder.value = ob;
                    this.design.me = {};
                    this._copyMeFromParent(this.design.me, this._parent);
                    this._createRepeatingComponent(this.design.me);
                    this.add(this.design);
                    this.design.add(this.design.databinder);
                }
                this.design = sic;
            }
        }
        /**
         * adds a component to the container
         * @param {jassijs.ui.Component} component - the component to add
         */
        add(component) {
            super.add(component);
        }
        _dummy(func) {
            //dummy
        }
        set value(val) {
            this._value = val;
            this.update();
        }
        get value() {
            return this._value;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._setDesignMode(action.componentDesignerSetDesignMode.enable, action.componentDesignerSetDesignMode.componentDesigner);
            }
        }
        /**
         * activates or deactivates designmode
         * @param {boolean} enable - true if activate designMode
         */
        _setDesignMode(enable, designer = undefined) {
            this._componentDesigner = designer;
            if (this._designMode !== enable) {
                this._designMode = enable;
                this.update();
            }
            else
                this._designMode = enable;
            //	super.setDesignMode(enable);
        }
        set bind(databinder) {
            this._databinder = databinder[0];
            this._databinder.add(databinder[1], this, "_dummy");
        }
        destroy() {
            this._value = undefined;
            this.design.destroy();
            super.destroy();
        }
    };
    __decorate([
        Property_29.$Property({ type: "databinder" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], Repeater.prototype, "bind", null);
    Repeater = __decorate([
        Component_22.$UIComponent({ fullPath: "common/Repeater", icon: "mdi mdi-locker-multiple", editableChildComponents: ["this", "design"] }),
        Registry_95.$Class("jassijs.ui.Repeater"),
        __metadata("design:paramtypes", [Object])
    ], Repeater);
    exports.Repeater = Repeater;
});
define("jassijs/ui/Select", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/DataComponent", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs/ext/jquerylib", "jquery.choosen"], function (require, exports, Registry_96, Component_23, DataComponent_4, Property_30, Classes_28) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Select = void 0;
    jassijs.includeCSSFile("chosen.css");
    let SelectCreateProperties = class SelectCreateProperties extends Component_23.ComponentProperties {
    };
    __decorate([
        Property_30.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], SelectCreateProperties.prototype, "multiple", void 0);
    __decorate([
        Property_30.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], SelectCreateProperties.prototype, "allowDeselect", void 0);
    __decorate([
        Property_30.$Property({ default: "" }),
        __metadata("design:type", String)
    ], SelectCreateProperties.prototype, "placeholder", void 0);
    SelectCreateProperties = __decorate([
        Registry_96.$Class("jassijs.ui.SelectCreateProperties")
    ], SelectCreateProperties);
    let Select = class Select extends DataComponent_4.DataComponent {
        constructor(properties = undefined) {
            super();
            super.init('<select class="Select"><option value=""></option></select>');
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
                // width: "100px",
                placeholder_text_single: placeholder,
                allow_single_deselect: single
            });
            this.domSelect = this.dom;
            if (this.domWrapper.children.length == 1) { //mobile device
                this.dom = this.domSelect;
            }
            else
                this.dom = this.domWrapper.children[1];
            this.domSelect.setAttribute("id", "");
            this.dom.setAttribute("id", this._id);
            $(this.domSelect).chosen().change(function (e) {
                if (_this._select !== undefined)
                    _this._select.value = _this.value;
                //e.data = _this.value;
                //handler(e);
            });
            // this.layout();
        }
        config(config) {
            super.config(config);
            return this;
        }
        refresh() {
            $(this.domSelect).trigger("chosen:updated");
        }
        onchange(handler) {
            var _this = this;
            $(this.domSelect).chosen().change(function (e) {
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
            if (this.domSelect === undefined)
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
            this.domSelect.innerHTML = html;
            this.refresh();
        }
        get items() {
            return this._items;
        }
        set value(sel) {
            var found = false;
            if ($(this.domSelect).chosen().prop("multiple")) {
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
                        $(this.domSelect).val(keys).trigger("chosen:updated");
                    });
                }
            }
            else {
                for (var key in this.options) {
                    if (this.options[key] === sel) {
                        $(this.domSelect).val(key).trigger("chosen:updated");
                        found = true;
                        break;
                    }
                }
            }
            if (!found)
                $(this.domSelect).val("").trigger("chosen:updated");
            // refresh()
        }
        get value() {
            if (this.options === undefined)
                return undefined;
            var val = $(this.domSelect).chosen().val();
            if ($(this.domSelect).chosen().prop("multiple")) {
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
            $(this.domSelect).chosen("destroy"); //.search_choices;
            $('#' + this._id).remove(); //.search_choices;
            $(this.domSelect).remove();
            $(this.dom).remove();
            this.domSelect = undefined;
            super.destroy();
        }
    };
    __decorate([
        Property_30.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Select.prototype, "onchange", null);
    __decorate([
        Property_30.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Select.prototype, "display", null);
    Select = __decorate([
        Component_23.$UIComponent({ fullPath: "common/Select", icon: "mdi mdi-form-dropdown" }),
        Registry_96.$Class("jassijs.ui.Select"),
        Property_30.$Property({ name: "new", type: "json", componentType: "jassijs.ui.SelectCreateProperties" }),
        __metadata("design:paramtypes", [SelectCreateProperties])
    ], Select);
    exports.Select = Select;
    async function test() {
        var Panel = Classes_28.classes.getClass("jassijs.ui.Panel");
        var Button = Classes_28.classes.getClass("jassijs.ui.Button");
        var me = {};
        var pan = new Panel();
        var bt = new Button();
        var bt2 = new Button();
        me.sel = new Select({
            "multiple": false,
            "placeholder": "Hallo",
            "allowDeselect": false
        });
        bt.text = "wer";
        bt.onclick(function (event) {
            //	bt.text=me.sel.value.vorname;	
            me.sel.value = me.sel.items[1];
        });
        bt.height = 15;
        pan.width = 500;
        me.sel.display = "nachname";
        me.sel.items = [{ name: "Achim", nachname: "<b>Wenzel</b>" },
            { name: "Anne", nachname: "Meier" }];
        var h = me.sel.items;
        me.sel.width = 195;
        me.sel.height = 25;
        me.sel.onchange(function (event) {
            alert(event.data.nachname);
        });
        //	$('#'+sel._id).data("placeholder","Select2...").chosen({width: "200px"});
        pan.add(me.sel);
        pan.add(bt);
        pan.add(bt2);
        return pan;
    }
    exports.test = test;
});
define("jassijs/ui/SettingsDialog", ["require", "exports", "jassijs/ui/HTMLPanel", "jassijs/ui/Select", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/PropertyEditor", "jassijs/ui/Button", "jassijs/remote/Settings", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Registry", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, HTMLPanel_4, Select_7, Registry_97, Panel_18, PropertyEditor_6, Button_11, Settings_3, ComponentDescriptor_6, Registry_98, Actions_6, Windows_4) {
    "use strict";
    var SettingsDialog_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SettingsDialog = void 0;
    let SettingsObject = class SettingsObject {
        static customComponentDescriptor() {
            var allcl = Registry_98.default.getData("$SettingsDescriptor");
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
        Registry_97.$Class("jassijs.ui.SettingsObject")
    ], SettingsObject);
    let SettingsDialog = SettingsDialog_1 = class SettingsDialog extends Panel_18.Panel {
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
            await Registry_98.default.loadAllFilesForService("$SettingsDescriptor");
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
            me.Save = new Button_11.Button();
            me.Scope = new Select_7.Select();
            me.htmlpanel1 = new HTMLPanel_4.HTMLPanel();
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
            me.htmlpanel1.css = {
                font_size: "small",
                font_weight: "bold"
            };
        }
    };
    __decorate([
        Actions_6.$Action({
            name: "Settings",
            icon: "mdi mdi-settings-helper",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SettingsDialog, "show", null);
    SettingsDialog = SettingsDialog_1 = __decorate([
        Actions_6.$ActionProvider("jassijs.base.ActionNode"),
        Registry_97.$Class("jassijs.ui.SettingsDialog"),
        __metadata("design:paramtypes", [])
    ], SettingsDialog);
    exports.SettingsDialog = SettingsDialog;
    async function test() {
        var ret = new SettingsDialog();
        // var allcl=registry.getData("$SettingsDescriptor");
        //var all=ComponentDescriptor.describe(cl,true);
        return ret;
    }
    exports.test = test;
});
define("jassijs/ui/Style", ["require", "exports", "jassijs/ui/InvisibleComponent", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/CSSProperties"], function (require, exports, InvisibleComponent_3, Component_24, Registry_99, Property_31, CSSProperties_3) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.Style = void 0;
    let Style = 
    /**
     * on ore mors Style can be assigned to component
     * the style is appended to the head
     **/
    class Style extends InvisibleComponent_3.InvisibleComponent {
        constructor() {
            super();
            super.init('<span class="InvisibleComponent"></span>');
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
        set css(properties) {
            //never!super.css(properties,removeOldProperties);
            var style = document.getElementById(this.styleid);
            if (!document.getElementById(this.styleid)) {
                style = Component_24.Component.createHTMLElement('<style id=' + this.styleid + '></style>');
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
    __decorate([
        Property_31.$Property({ type: "json", componentType: "jassijs.ui.CSSProperties" }),
        __metadata("design:type", typeof (_a = typeof CSSProperties_3.CSSProperties !== "undefined" && CSSProperties_3.CSSProperties) === "function" ? _a : Object),
        __metadata("design:paramtypes", [typeof (_b = typeof CSSProperties_3.CSSProperties !== "undefined" && CSSProperties_3.CSSProperties) === "function" ? _b : Object])
    ], Style.prototype, "css", null);
    Style = __decorate([
        Component_24.$UIComponent({ fullPath: "common/Style", icon: "mdi mdi-virus" }),
        Registry_99.$Class("jassijs.ui.Style")
        /**
         * on ore mors Style can be assigned to component
         * the style is appended to the head
         **/
        ,
        __metadata("design:paramtypes", [])
    ], Style);
    exports.Style = Style;
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
    exports.test = test;
    function test2() {
        var st = new Style();
        st.css = {
            color: "red"
        };
        st.destroy();
    }
    exports.test2 = test2;
});
define("jassijs/ui/Table", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/DataComponent", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/ui/Textbox", "jassijs/remote/Classes", "tabulator-tables", "jassijs/ui/converters/DateTimeConverter", "jassijs/util/Numberformatter"], function (require, exports, Registry_100, DataComponent_5, Property_32, Component_25, Textbox_18, Classes_29, tabulator_tables_1, DateTimeConverter_1, Numberformatter_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Table = void 0;
    let TableEditorProperties = class TableEditorProperties {
    };
    __decorate([
        Property_32.$Property({ default: undefined }),
        __metadata("design:type", Number)
    ], TableEditorProperties.prototype, "paginationSize", void 0);
    __decorate([
        Property_32.$Property({ default: true }),
        __metadata("design:type", Boolean)
    ], TableEditorProperties.prototype, "headerSort", void 0);
    __decorate([
        Property_32.$Property({ default: "fitDataStretch", chooseFrom: ['fitData', 'fitColumns', 'fitDataFill', 'fitDataStretch'] }),
        __metadata("design:type", String)
    ], TableEditorProperties.prototype, "layout", void 0);
    __decorate([
        Property_32.$Property({ default: undefined }),
        __metadata("design:type", Function)
    ], TableEditorProperties.prototype, "dataTreeChildFunction", void 0);
    __decorate([
        Property_32.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], TableEditorProperties.prototype, "movableColumns", void 0);
    TableEditorProperties = __decorate([
        Registry_100.$Class("jassijs.ui.TableEditorProperties")
    ], TableEditorProperties);
    let Table = class Table extends DataComponent_5.DataComponent {
        constructor(properties) {
            super();
            this._lastLazySort = undefined;
            this._lastLazySearch = undefined;
            this._lazyDataHasChanged = undefined;
            super.init('<div class="Table"></div>');
            var _this = this;
            this.options = properties;
            this._selectHandler = [];
        }
        ;
        config(config) {
            super.config(config);
            return this;
        }
        rerender() {
            this.table.destroy();
            if (this._databinderItems !== undefined) {
                this._databinderItems.remove(this);
                this._databinderItems = undefined;
            }
            this.table = undefined;
            super.rerender();
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
            var fields = Registry_100.default.getMemberData("design:type")[this._lazyLoadOption.classname];
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
                this._searchbox = new Textbox_18.Textbox();
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
            if (value !== undefined && updateData)
                this.table.setData(value);
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
        set bindItems(databinder) {
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
    };
    __decorate([
        Property_32.$Property({ type: "json", componentType: "jassijs.ui.TableEditorProperties" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "options", null);
    __decorate([
        Property_32.$Property({ default: "function(event?: JQueryEventObject, data?:Tabulator.RowComponent){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Table.prototype, "onchange", null);
    __decorate([
        Property_32.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Table.prototype, "showSearchbox", null);
    __decorate([
        Property_32.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "height", null);
    __decorate([
        Property_32.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "width", null);
    __decorate([
        Property_32.$Property({ type: "databinder" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], Table.prototype, "bindItems", null);
    Table = __decorate([
        Component_25.$UIComponent({ fullPath: "common/Table", icon: "mdi mdi-grid" }),
        Registry_100.$Class("jassijs.ui.Table"),
        Property_32.$Property({ name: "new", type: "json", componentType: "jassijs.ui.TableEditorProperties" }),
        __metadata("design:paramtypes", [Object])
    ], Table);
    exports.Table = Table;
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
        var tab = new Table({
            height: 300,
            headerSort: true,
            items: tabledata,
            columns: [
                { field: "id", title: "id" },
                { field: "age", title: "age", formatter: "numberformat", formatterParams: { numberformat: "#.##0,00" }, editor: "numberformat" },
                { field: "name", title: "name", formatter: "buttonTick" },
                { field: "dob", title: "dob", formatter: "datetimeformat", formatterParams: { datefimeformat: "DATETIME_SHORT" }, editor: "datetimeformat" }
            ]
        });
        tab.showSearchbox = true;
        tab.on("dblclick", () => {
            //  alert(tab.value);
        });
        tab.width = 417;
        tab.height = 324;
        return tab;
    }
    exports.test = test;
});
define("jassijs/ui/Textarea", ["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/Textbox"], function (require, exports, Component_26, Registry_101, Property_33, Textbox_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Textarea = void 0;
    let Textarea = class Textarea extends Textbox_19.Textbox {
        constructor() {
            super();
            super.init('<textarea  />');
        }
    };
    Textarea = __decorate([
        Component_26.$UIComponent({ fullPath: "common/Textarea", icon: "mdi mdi-text-box-outline" }),
        Registry_101.$Class("jassijs.ui.Textarea"),
        Property_33.$Property({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [])
    ], Textarea);
    exports.Textarea = Textarea;
});
define("jassijs/ui/Textbox", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/DataComponent", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, Registry_102, Component_27, DataComponent_6, DefaultConverter_4, Registry_103, Property_34) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Textbox = exports.TextboxProperties = void 0;
    let TextboxProperties = class TextboxProperties extends DataComponent_6.DataComponentProperties {
    };
    __decorate([
        Property_34.$Property({ type: "classselector", service: "$Converter" }),
        __metadata("design:type", typeof (_a = typeof DefaultConverter_4.DefaultConverter !== "undefined" && DefaultConverter_4.DefaultConverter) === "function" ? _a : Object)
    ], TextboxProperties.prototype, "converter", void 0);
    __decorate([
        Property_34.$Property({ type: "string" }),
        __metadata("design:type", Object)
    ], TextboxProperties.prototype, "value", void 0);
    __decorate([
        Property_34.$Property(),
        __metadata("design:type", String)
    ], TextboxProperties.prototype, "placeholder", void 0);
    __decorate([
        Property_34.$Property(),
        __metadata("design:type", Boolean)
    ], TextboxProperties.prototype, "readOnly", void 0);
    TextboxProperties = __decorate([
        Registry_102.$Class("jassijs.ui.TextboxProperties")
    ], TextboxProperties);
    exports.TextboxProperties = TextboxProperties;
    let Textbox = class Textbox extends DataComponent_6.DataComponent {
        constructor(props = undefined) {
            super(props);
            this._value = "";
            this._isFocused = false;
            var _this = this;
            this.onblur((e) => _this.blurcalled(e));
            this.onfocus((e) => _this.focuscalled(e));
            // this.converter = undefined;
        }
        render() {
            return React.createElement("input", { type: "text" });
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
        updateValue() {
            if (this.converter) {
                this.value = this.converter.stringToObject(this.dom.value);
            }
            else {
                this.value = this.dom.value;
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
            this.dom.value = v === undefined ? "" : v;
        }
        get value() {
            if (this._isFocused)
                this.updateValue();
            return this._value;
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
                list = "j" + Registry_103.default.nextID();
                this._autocompleter = Component_27.Component.createHTMLElement('<datalist id="' + list + '"/>');
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
    Textbox = __decorate([
        Component_27.$UIComponent({ fullPath: "common/Textbox", icon: "mdi mdi-form-textbox" }),
        Registry_102.$Class("jassijs.ui.Textbox"),
        Property_34.$Property({ name: "new", type: "json", componentType: "jassijs.ui.TextboxProperties" }),
        __metadata("design:paramtypes", [TextboxProperties])
    ], Textbox);
    exports.Textbox = Textbox;
    function test() {
        var ret = new Textbox();
        ret.autocompleter = ["Hallo", "Du"];
        ret.value = 10.1;
        //ret.autocompleter=()=>[];
        return ret;
    }
    exports.test = test;
});
// return CodeEditor.constructor;
define("jassijs/ui/Tree", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ext/jquerylib", "jassijs/ext/fancytree"], function (require, exports, Registry_104, Component_28, Registry_105, Property_35) {
    "use strict";
    var _a, _b, _c;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Tree = void 0;
    /*declare global {
        interface JQuery {
            fancytree: any;
        }
    }*/
    let TreeEditorPropertiesMulti = class TreeEditorPropertiesMulti {
    };
    __decorate([
        Property_35.$Property({ default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" }),
        __metadata("design:type", String)
    ], TreeEditorPropertiesMulti.prototype, "mode", void 0);
    TreeEditorPropertiesMulti = __decorate([
        Registry_104.$Class("jassijs.ui.TreeEditorPropertiesMulti")
    ], TreeEditorPropertiesMulti);
    let TreeEditorProperties = class TreeEditorProperties {
    };
    __decorate([
        Property_35.$Property({ default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" }),
        __metadata("design:type", Number)
    ], TreeEditorProperties.prototype, "selectMode", void 0);
    __decorate([
        Property_35.$Property({ default: false, description: "display a checkbox before the node" }),
        __metadata("design:type", Boolean)
    ], TreeEditorProperties.prototype, "checkbox", void 0);
    __decorate([
        Property_35.$Property({ type: "json", componentType: "jassijs.ui.TreeEditorPropertiesMulti" }),
        __metadata("design:type", TreeEditorPropertiesMulti)
    ], TreeEditorProperties.prototype, "multi", void 0);
    TreeEditorProperties = __decorate([
        Registry_104.$Class("jassijs.ui.TreeEditorProperties")
    ], TreeEditorProperties);
    let Tree = 
    /*@$Property({ name: "new/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" })
    @$Property({ name: "new/checkbox", type: "boolean", default: false, description: "desplay a checkbos before the node" })
    @$Property({ name: "new/multi", type: "json" })
    @$Property({ name: "new/multi/mode", type: "string", default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" })
    */
    class Tree extends Component_28.Component {
        constructor(options) {
            super();
            super.init('<div class="Tree"></div>');
            this._itemToKey = new Map();
            this.options = options;
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
    __decorate([
        Property_35.$Property({ type: "json", componentType: "jassijs.ui.TableEditorProperties" }),
        __metadata("design:type", typeof (_a = typeof Fancytree !== "undefined" && Fancytree.FancytreeOptions) === "function" ? _a : Object),
        __metadata("design:paramtypes", [typeof (_b = typeof Fancytree !== "undefined" && Fancytree.FancytreeOptions) === "function" ? _b : Object])
    ], Tree.prototype, "options", null);
    __decorate([
        Property_35.$Property({ type: "string", description: "the property called to get the style of the item" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Tree.prototype, "propStyle", null);
    __decorate([
        Property_35.$Property({ type: "string", description: "the property called to get the name of the item" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Tree.prototype, "propDisplay", null);
    __decorate([
        Property_35.$Property({ default: "function(event?: JQueryEventObject/*, data?:Fancytree.EventData*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Tree.prototype, "onclick", null);
    Tree = __decorate([
        Component_28.$UIComponent({ fullPath: "common/Tree", icon: "mdi mdi-file-tree" }),
        Registry_104.$Class("jassijs.ui.Tree"),
        Property_35.$Property({ name: "new", type: "json", componentType: "jassijs.ui.TreeEditorProperties" })
        /*@$Property({ name: "new/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" })
        @$Property({ name: "new/checkbox", type: "boolean", default: false, description: "desplay a checkbos before the node" })
        @$Property({ name: "new/multi", type: "json" })
        @$Property({ name: "new/multi/mode", type: "string", default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" })
        */
        ,
        __metadata("design:paramtypes", [typeof (_c = typeof Fancytree !== "undefined" && Fancytree.FancytreeOptions) === "function" ? _c : Object])
    ], Tree);
    exports.Tree = Tree;
    class TreeNode {
        //options.source=[ { title: 'Folder in home folder', key: 'fA100', folder: true, lazy: true }];
        constructor(tree, item, parent = undefined) {
            this.tree = tree;
            this.parent = parent;
            this._id = "j" + Registry_105.default.nextID();
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
    exports.test = test;
});
define("jassijs/ui/Upload", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Registry_106, Component_29, Property_36) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Upload = void 0;
    let Upload = class Upload extends Component_29.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            super.init('<input type="file" id="dateien" name="files[]" />');
            var _this = this;
            this.on("change", function (evt) {
                _this.readUpload(evt);
            });
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
    __decorate([
        Property_36.$Property({ chooseFromStrict: true, chooseFrom: ["Text", "DataUrl", "ArrayBuffer", "BinaryString"] }),
        __metadata("design:type", String)
    ], Upload.prototype, "readAs", void 0);
    __decorate([
        Property_36.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Upload.prototype, "accept", null);
    __decorate([
        Property_36.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Upload.prototype, "multiple", null);
    __decorate([
        Property_36.$Property({ default: "function(data:{[file:string]:string}){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Upload.prototype, "onuploaded", null);
    Upload = __decorate([
        Component_29.$UIComponent({ fullPath: "common/Upload", icon: "mdi mdi-cloud-upload-outline" }),
        Registry_106.$Class("jassijs.ui.Upload"),
        __metadata("design:paramtypes", [])
    ], Upload);
    exports.Upload = Upload;
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
    exports.test = test;
});
define("jassijs/ui/VariablePanel", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Component", "jassijs/ui/ComponentDescriptor"], function (require, exports, Registry_107, Panel_19, Component_30, ComponentDescriptor_7) {
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
    let VariablePanel = class VariablePanel extends Panel_19.Panel {
        constructor() {
            super();
            this._items = [];
            /**cache**/
            /**@member {Object.<number, boolean>} **/
            this.debugpoints = {};
        }
        async createTable() {
            var Table = (await new Promise((resolve_22, reject_22) => { require(["jassijs/ui/Table"], resolve_22, reject_22); })).Table;
            this.table = new Table({
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
        addVariable(name, value, refresh = undefined) {
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
                values.push({ name: name, value: value });
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
                if (val instanceof Component_30.Component) {
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
            if (component._components !== undefined) {
                for (var x = 0; x < component._components.length; x++) {
                    var t = this.getEditableComponents(component._components[x], idFromLabel);
                    if (t !== "") {
                        ret = ret + (ret === "" ? "" : ",") + t;
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
        /**
          * renames a variable in design
          * @param {string} oldName
          * @param {string} newName
          */
        renameVariable(oldName, newName) {
            if (oldName.startsWith("this.")) {
                oldName = oldName.substring(5);
                if (newName.startsWith("this."))
                    newName = newName.substring(5);
                let vars = this._cache["this"];
                vars[newName] = vars[oldName];
                delete vars[oldName];
            }
            else if (oldName.startsWith("me.")) {
                oldName = oldName.substring(3);
                if (newName.startsWith("me."))
                    newName = newName.substring(3);
                let vars = this._cache["me"];
                vars[newName] = vars[oldName];
                delete vars[oldName];
            }
            else {
                let vars = this.value;
                for (var x = 0; x < vars.length; x++) {
                    var val = vars[x].value;
                    var name = vars[x].name;
                    if (name === oldName) {
                        vars[x].name = newName;
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
    VariablePanel = __decorate([
        Registry_107.$Class("jassijs.ui.VariablePanel"),
        __metadata("design:paramtypes", [])
    ], VariablePanel);
    exports.VariablePanel = VariablePanel;
});
define("jassijs/util/Cookies", ["require", "exports", "jassijs/ext/js-cookie"], function (require, exports, js_cookie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cookies = void 0;
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
    var Cookies = js_cookie_1.default;
    exports.Cookies = Cookies;
});
define("jassijs/util/CSVImport", ["require", "exports", "jassijs/ui/Upload", "jassijs/ui/Button", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/ui/BoxPanel", "jassijs/ui/Select", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ext/papaparse", "jassijs/remote/Database", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/DBObject", "jassijs/base/Actions", "jassijs/base/Router", "jassijs/remote/Server", "jassijs/remote/Transaction"], function (require, exports, Upload_1, Button_12, NumberConverter_3, Textbox_20, BoxPanel_6, Select_8, Table_4, Registry_108, Panel_20, papaparse_1, Database_3, Registry_109, Classes_30, DBObject_7, Actions_7, Router_2, Server_3, Transaction_1) {
    "use strict";
    var CSVImport_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CSVImport = void 0;
    let CSVImport = CSVImport_1 = class CSVImport extends Panel_20.Panel {
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
            await Registry_109.default.loadAllFilesForService("$DBObject");
            var data = Registry_109.default.getData("$DBObject");
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
            me.fromLine = new Textbox_20.Textbox();
            me.next = new Button_12.Button();
            me.upload = new Upload_1.Upload();
            var _this = this;
            this.me.table = new Table_4.Table({
                autoColumns: false
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
            var members = Registry_109.default.getMemberData("design:type")[dbclass];
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
    __decorate([
        Actions_7.$Action({ name: "Administration/Database CSV-Import", icon: "mdi mdi-database-import" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], CSVImport, "showDialog", null);
    CSVImport = CSVImport_1 = __decorate([
        Actions_7.$ActionProvider("jassijs.base.ActionNode"),
        Registry_108.$Class("jassijs.util.CSVImport"),
        __metadata("design:paramtypes", [])
    ], CSVImport);
    exports.CSVImport = CSVImport;
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
    exports.test = test;
});
define("jassijs/util/DatabaseSchema", ["require", "exports", "jassijs/remote/Database", "jassijs/remote/Classes"], function (require, exports, Database_4, Classes_31) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ManyToMany = exports.ManyToOne = exports.OneToMany = exports.OneToOne = exports.PrimaryColumn = exports.Column = exports.JoinTable = exports.JoinColumn = exports.PrimaryGeneratedColumn = exports.Entity = void 0;
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
    exports.Entity = Entity;
    function PrimaryGeneratedColumn(...param) {
        return addDecorater("PrimaryGeneratedColumn", ...param);
    }
    exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
    function JoinColumn(...param) {
        return addDecorater("JoinColumn", ...param);
    }
    exports.JoinColumn = JoinColumn;
    function JoinTable(...param) {
        return addDecorater("JoinTable", ...param);
    }
    exports.JoinTable = JoinTable;
    function Column(...any) {
        return addDecorater("Column", ...any);
    }
    exports.Column = Column;
    function PrimaryColumn(...any) {
        return addDecorater("PrimaryColumn", ...any);
    }
    exports.PrimaryColumn = PrimaryColumn;
    function OneToOne(...any) {
        return addDecorater("OneToOne", ...any);
    }
    exports.OneToOne = OneToOne;
    function OneToMany(...any) {
        return addDecorater("OneToMany", ...any);
    }
    exports.OneToMany = OneToMany;
    function ManyToOne(...any) {
        return addDecorater("ManyToOne", ...any);
    }
    exports.ManyToOne = ManyToOne;
    function ManyToMany(...any) {
        return addDecorater("ManyToMany", ...any);
    }
    exports.ManyToMany = ManyToMany;
});
define("jassijs/util/Numberformatter", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_110) {
    "use strict";
    var Numberformatter_3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Numberformatter = void 0;
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
    Numberformatter = Numberformatter_3 = __decorate([
        Registry_110.$Class("jassijs.util.Numberformatter")
    ], Numberformatter);
    exports.Numberformatter = Numberformatter;
    function test() {
        console.log(Numberformatter.format("##0,00", 90.8));
        let t = Numberformatter.numberToString(90.8);
        console.log(t);
        console.log(Numberformatter.stringToNumber(t));
    }
    exports.test = test;
});
define("jassijs/util/Reloader", ["require", "exports", "jassijs/remote/Config", "jassijs/remote/Registry", "jassijs/remote/Registry"], function (require, exports, Config_4, Registry_111, Registry_112) {
    "use strict";
    var Reloader_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Reloader = void 0;
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
                var allclasses = await Registry_112.default.getJSONData("$Class");
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
    Reloader.cache = [];
    Reloader.reloadCodeFromServerIsRunning = false;
    Reloader.instance = new Reloader_1();
    Reloader = Reloader_1 = __decorate([
        Registry_111.$Class("jassijs.util.Reloader"),
        __metadata("design:paramtypes", [])
    ], Reloader);
    exports.Reloader = Reloader;
});
define("jassijs/util/Runlater", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_113) {
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
    Runlater = __decorate([
        Registry_113.$Class("jassi.util.Runlater"),
        __metadata("design:paramtypes", [Object, Object])
    ], Runlater);
    exports.Runlater = Runlater;
});
define("jassijs/util/Tools", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_114) {
    "use strict";
    var Tools_3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Tools = void 0;
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
    Tools = Tools_3 = __decorate([
        Registry_114.$Class("jassijs.util.Tools"),
        __metadata("design:paramtypes", [])
    ], Tools);
    exports.Tools = Tools;
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
    exports.test = test;
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
                "date": 1655726580000
            },
            "jassijs/base/Extensions.ts": {
                "date": 1655549184000
            },
            "jassijs/base/LoginDialog.ts": {
                "date": 1683051936000
            },
            "jassijs/base/PropertyEditorService.ts": {
                "date": 1657571268000,
                "jassijs.base.PropertyEditorService": {}
            },
            "jassijs/base/Router.ts": {
                "date": 1655556796000,
                "jassijs.base.Router": {}
            },
            "jassijs/base/Windows.ts": {
                "date": 1657655076000,
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
                "date": 1686853238000
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
                "date": 1681317356000,
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
                "date": 1695580332624.7742
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
                "date": 1686762490000
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
                "date": 1681328192000,
                "jassijs/security/GroupView": {
                    "$DBObjectView": [
                        {
                            "classname": "jassijs.security.Group",
                            "icon": "mdi mdi-account-group",
                            "actionname": "Administration/Security/Groups"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/security/UserView.ts": {
                "date": 1681330006000,
                "jassijs/security/UserView": {
                    "$DBObjectView": [
                        {
                            "classname": "jassijs.security.User",
                            "actionname": "Administration/Security/Users",
                            "icon": "mdi mdi-account-key-outline",
                            "queryname": "findWithRelations"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/ActionNodeMenu.ts": {
                "date": 1655556796000,
                "jassijs/ui/ActionNodeMenu": {}
            },
            "jassijs/ui/BoxPanel.ts": {
                "date": 1696687199000.2588,
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
                "date": 1696716964055.2097,
                "jassijs.ui.ButtonProperties": {
                    "@members": {}
                },
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
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.ButtonProperties"
                        }
                    ]
                }
            },
            "jassijs/ui/Calendar.ts": {
                "date": 1696687306198.7598,
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
                "date": 1696687306208.776,
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
                "date": 1696716743889.7158,
                "jassijs.ui.ComponentProperties": {
                    "@members": {}
                },
                "jassijs.ui.Component": {
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.ComponentProperties"
                        }
                    ]
                },
                "jassijs.ui.HTMLComponent": {},
                "jassijs.ui.TextComponent": {
                    "@members": {}
                }
            },
            "jassijs/ui/ComponentDescriptor.ts": {
                "date": 1696717595128.208,
                "jassijs.ui.ComponentDescriptor": {}
            },
            "jassijs/ui/Container.ts": {
                "date": 1697130215042.4993,
                "jassijs.ui.ContainerProperties": {
                    "@members": {}
                },
                "jassijs.ui.Container": {}
            },
            "jassijs/ui/ContextMenu.ts": {
                "date": 1696687306206.7812,
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
                "date": 1656016872000,
                "jassijs.ui.CSSProperties": {
                    "@members": {}
                }
            },
            "jassijs/ui/Databinder.ts": {
                "date": 1681560838000,
                "jassijs.ui.Databinder": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Databinder",
                            "icon": "mdi mdi-connection"
                        }
                    ]
                }
            },
            "jassijs/ui/DataComponent.ts": {
                "date": 1696782620600.11,
                "jassijs.ui.DataComponentProperties": {
                    "@members": {}
                },
                "jassijs.ui.DataComponent": {
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.DataComponentProperties"
                        }
                    ]
                }
            },
            "jassijs/ui/DBObjectDialog.ts": {
                "date": 1681562926000,
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
                "date": 1696687306204.7815,
                "jassijs/ui/DBObjectView": {
                    "$UIComponent": [
                        {
                            "editableChildComponents": [
                                "this",
                                "me.main",
                                "me.toolbar",
                                "me.save",
                                "me.remove",
                                "me.refresh",
                                "me.databinder"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/DesignDummy.ts": {
                "date": 1655755336000,
                "jassijs.ui.DesignDummy": {}
            },
            "jassijs/ui/DockingContainer.ts": {
                "date": 1681513934000,
                "jassijs.ui.DockingContainer": {}
            },
            "jassijs/ui/HTMLEditorPanel.ts": {
                "date": 1655641682000,
                "jassijs.ui.HTMLEditorPanel": {}
            },
            "jassijs/ui/HTMLPanel.ts": {
                "date": 1697050316322.105,
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
            "jassijs/ui/Image.ts": {
                "date": 1696687306208.776,
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
            "jassijs/ui/InvisibleComponent.ts": {
                "date": 1655843346000,
                "jassijs.ui.InvisibleComponent": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ]
                }
            },
            "jassijs/ui/Menu.ts": {
                "date": 1696691833397.9663,
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
            "jassijs/ui/MenuItem.ts": {
                "date": 1696691833393.435,
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
            "jassijs/ui/Notify.ts": {
                "date": 1655585212000
            },
            "jassijs/ui/ObjectChooser.ts": {
                "date": 1696713688001.8782,
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
                "date": 1697130279944.2292,
                "jassijs.ui.PanelProperties": {
                    "@members": {}
                },
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
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Property.ts": {
                "date": 1658347724000,
                "jassijs.ui.Property": {}
            },
            "jassijs/ui/PropertyEditor.ts": {
                "date": 1696320466897.5088,
                "jassijs.ui.PropertyEditor": {},
                "jassijs.ui.PropertyEditorTestSubProperties": {
                    "@members": {}
                },
                "jassijs.ui.PropertyEditorTestProperties": {
                    "@members": {}
                }
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
                "date": 1656506936000,
                "jassijs.ui.PropertyEditors.DatabinderEditor": {
                    "$PropertyEditor": [
                        [
                            "databinder"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/DBObjectEditor.ts": {
                "date": 1655556866000,
                "jassijs.ui.PropertyEditors.DBObjectEditor": {
                    "$PropertyEditor": [
                        [
                            "dbobject"
                        ]
                    ]
                }
            },
            "jassijs/ui/PropertyEditors/DefaultEditor.ts": {
                "date": 1655556796000,
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
                "date": 1656960820000,
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
                "date": 1658349512000,
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
                "date": 1655556796000,
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
            "jassijs/ui/Repeater.ts": {
                "date": 1696687306208.776,
                "jassijs.ui.RepeaterDesignPanel": {
                    "$UIComponent": [
                        {
                            "editableChildComponents": [
                                "databinder"
                            ]
                        }
                    ]
                },
                "jassijs.ui.Repeater": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Repeater",
                            "icon": "mdi mdi-locker-multiple",
                            "editableChildComponents": [
                                "this",
                                "design"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/Select.ts": {
                "date": 1696688613448.2766,
                "jassijs.ui.SelectCreateProperties": {
                    "@members": {}
                },
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
                            "componentType": "jassijs.ui.SelectCreateProperties"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs/ui/SettingsDialog.ts": {
                "date": 1681570600000,
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
                "date": 1696687306208.776,
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
                "date": 1696687306210.771,
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
                "date": 1655757394000,
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
                "date": 1696782997596.7163,
                "jassijs.ui.TextboxProperties": {
                    "@members": {}
                },
                "jassijs.ui.Textbox": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Textbox",
                            "icon": "mdi mdi-form-textbox"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassijs.ui.TextboxProperties"
                        }
                    ]
                }
            },
            "jassijs/ui/Tree.ts": {
                "date": 1696687306236.517,
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
                "date": 1655847946000,
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
                "date": 1656066842000,
                "jassijs.ui.VariablePanel": {}
            },
            "jassijs/util/Cookies.ts": {
                "date": 1682364420000
            },
            "jassijs/util/CSVImport.ts": {
                "date": 1681562976000,
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
                "date": 1684441726000,
                "jassijs.util.Reloader": {}
            },
            "jassijs/util/Runlater.ts": {
                "date": 1655556796000,
                "jassi.util.Runlater": {}
            },
            "jassijs/util/Tools.ts": {
                "date": 1657655420000,
                "jassijs.util.Tools": {}
            }
        }
    };
});
//# sourceMappingURL=jassijs.js.map