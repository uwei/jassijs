var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Component", "jassi/ui/ComponentDescriptor"], function (require, exports, Jassi_1, Panel_1, Component_1, ComponentDescriptor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VariablePanel = void 0;
    Jassi_1.default.d = function (id) {
        if (Jassi_1.default.d[id] === true)
            return false;
        Jassi_1.default.d[id] = true;
        return true;
    };
    // console.log(jassi.d(9)?debug:0);
    // console.log(jassi.d(9)?debug:0);
    let VariablePanel = class VariablePanel extends Panel_1.Panel {
        constructor() {
            super();
            /**cache**/
            /**@member {Object.<number, boolean>} **/
            this.debugpoints = {};
        }
        async createTable() {
            var Table = (await new Promise((resolve_1, reject_1) => { require(["jassi/ui/Table"], resolve_1, reject_1); })).Table;
            this.table = new Table({
                dataTreeChildFunction: function (obj) {
                    var ret = [];
                    if (typeof (obj.value) === "string")
                        return ret;
                    for (var v in obj.value) {
                        var oval = obj.value[v];
                        ret.push({ name: v, value: oval });
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
         * @returns  {jassi.ui.VariablePanel}
        **/
        static get(id) {
            if ($("#" + id).length === 0) //dummy for Codeeditor has closed
                return { __db: true, add: function () { }, update: function () { } };
            return $("#" + id)[0]._this;
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
                if (name === "me" || name === "this") {
                    for (var key in val) {
                        this._cache[name + "." + key] = val[key];
                    }
                }
            }
            var _this = this;
            function update(key, val) {
                if (val instanceof Component_1.Component) {
                    var comps = undefined;
                    try {
                        comps = ComponentDescriptor_1.ComponentDescriptor.describe(val.constructor).resolveEditableComponents(val);
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
                        var complist = comp._components;
                        if (complist !== undefined) {
                            for (var o = 0; o < complist.length; o++) {
                                update(fname, complist[o]);
                            }
                        }
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
         * @param {jassi.ui.Component} component - the component to inspect
         * @param {boolean} idFromLabel - if true not the id but the id form label is returned
         **/
        getEditableComponents(component, idFromLabel = undefined) {
            var ret = "";
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
        /**
        * get all known instances for type
        * @param {type} type - the type we are interested
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
                if (val !== undefined && (val instanceof type))
                    ret.push(name);
            }
            //seach in this
            vars = this._cache["this"];
            for (let y in vars) {
                if (vars[y] instanceof type)
                    ret.push("this." + y);
            }
            //seach in me
            vars = this._cache["me"];
            if (vars !== undefined) {
                for (let z in vars) {
                    if (vars[z] instanceof type)
                        ret.push("me." + z);
                }
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
            this.table.items = [];
            super.destroy();
        }
    };
    VariablePanel = __decorate([
        Jassi_1.$Class("jassi.ui.VariablePanel"),
        __metadata("design:paramtypes", [])
    ], VariablePanel);
    exports.VariablePanel = VariablePanel;
});
//# sourceMappingURL=VariablePanel.js.map