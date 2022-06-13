var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Component", "jassijs/ui/ComponentDescriptor"], function (require, exports, Jassi_1, Panel_1, Component_1, ComponentDescriptor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VariablePanel = void 0;
    Jassi_1.default.d = function (id) {
        if (Jassi_1.default.d[id] === true)
            return false;
        Jassi_1.default.d[id] = true;
        return true;
    };
    // console.log(jassijs.d(9)?debug:0);
    // console.log(jassijs.d(9)?debug:0);
    let VariablePanel = class VariablePanel extends Panel_1.Panel {
        constructor() {
            super();
            this._items = [];
            /**cache**/
            /**@member {Object.<number, boolean>} **/
            this.debugpoints = {};
        }
        async createTable() {
            var Table = (await new Promise((resolve_1, reject_1) => { require(["jassijs/ui/Table"], resolve_1, reject_1); })).Table;
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
            //seach in this
            vars = this._cache["this"];
            for (let y in vars) {
                if (this.isTypeOf(vars[y], type) && ret.indexOf("this." + y) === -1)
                    ret.push("this." + y);
            }
            //seach in me
            vars = this._cache["me"];
            if (vars !== undefined) {
                for (let z in vars) {
                    if (this.isTypeOf(vars[z], type) && ret.indexOf("me." + z) === -1)
                        ret.push("me." + z);
                }
            }
            //search in cache (published by updateCache)
            for (let key in this._cache) {
                if (!key.startsWith("this.") && this.isTypeOf(this._cache[key], type) && ret.indexOf(key) === -1)
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
        (0, Jassi_1.$Class)("jassijs.ui.VariablePanel"),
        __metadata("design:paramtypes", [])
    ], VariablePanel);
    exports.VariablePanel = VariablePanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFyaWFibGVQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvVmFyaWFibGVQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBS0EsZUFBTyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUU7UUFDcEIsSUFBSSxlQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUk7WUFDdEIsT0FBTyxLQUFLLENBQUE7UUFDaEIsZUFBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFBO0lBQ0QscUNBQXFDO0lBQ3JDLHFDQUFxQztJQUdyQyxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFjLFNBQVEsYUFBSztRQUtwQztZQUNJLEtBQUssRUFBRSxDQUFDO1lBRlosV0FBTSxHQUFRLEVBQUUsQ0FBQztZQUliLFdBQVc7WUFDWCx5Q0FBeUM7WUFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELEtBQUssQ0FBQyxXQUFXO1lBRWIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxzREFBYSxrQkFBa0IsMkJBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtZQUNwRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDO2dCQUVuQixxQkFBcUIsRUFBRSxVQUFVLEdBQUc7b0JBQ2hDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDYixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUTt3QkFDL0IsT0FBTyxHQUFHLENBQUM7b0JBQ2YsS0FBSyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUNyQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixHQUFH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LENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUMxQixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsQ0FBQztLQUNKLENBQUE7SUF4V1ksYUFBYTtRQUR6QixJQUFBLGNBQU0sRUFBQywwQkFBMEIsQ0FBQzs7T0FDdEIsYUFBYSxDQXdXekI7SUF4V1ksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuXHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IENvbXBvbmVudERlc2NyaXB0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnREZXNjcmlwdG9yXCI7XHJcbmphc3NpanMuZCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgaWYgKGphc3NpanMuZFtpZF0gPT09IHRydWUpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBqYXNzaWpzLmRbaWRdID0gdHJ1ZTtcclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbi8vIGNvbnNvbGUubG9nKGphc3NpanMuZCg5KT9kZWJ1ZzowKTtcclxuLy8gY29uc29sZS5sb2coamFzc2lqcy5kKDkpP2RlYnVnOjApO1xyXG5cclxuQCRDbGFzcyhcImphc3NpanMudWkuVmFyaWFibGVQYW5lbFwiKVxyXG5leHBvcnQgY2xhc3MgVmFyaWFibGVQYW5lbCBleHRlbmRzIFBhbmVsIHtcclxuICAgIHRhYmxlOiBhbnk7Ly9UYWJsZSBpcyBoaWRkZW4gaW4gZGVmYXVsdFxyXG4gICAgZGVidWdwb2ludHM6IHsgW246IG51bWJlcl06IGJvb2xlYW4gfTtcclxuICAgIFtfY2FjaGU6IHN0cmluZ106IGFueTtcclxuICAgIF9pdGVtczogYW55W109W107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvKipjYWNoZSoqL1xyXG4gICAgICAgIC8qKkBtZW1iZXIge09iamVjdC48bnVtYmVyLCBib29sZWFuPn0gKiovXHJcbiAgICAgICAgdGhpcy5kZWJ1Z3BvaW50cyA9IHt9O1xyXG4gICAgfVxyXG4gICAgYXN5bmMgY3JlYXRlVGFibGUoKSB7XHJcbiAgICAgICBcclxuICAgICAgICB2YXIgVGFibGUgPSAoYXdhaXQgaW1wb3J0KFwiamFzc2lqcy91aS9UYWJsZVwiKSkuVGFibGVcclxuICAgICAgICB0aGlzLnRhYmxlID0gbmV3IFRhYmxlKHtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgZGF0YVRyZWVDaGlsZEZ1bmN0aW9uOiBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gW107XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChvYmoudmFsdWUpID09PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2IGluIG9iai52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvdmFsID0gb2JqLnZhbHVlW3ZdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBvdmFsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50YWJsZS53aWR0aCA9IFwiY2FsYygxMDAlIC0gMnB4KVwiO1xyXG4gICAgICAgIHRoaXMudGFibGUuaGVpZ2h0ID0gXCJjYWxjKDEwMCUgLSAycHgpXCI7XHJcbiAgICAgICAgc3VwZXIuYWRkKHRoaXMudGFibGUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBWYXJpYWJlbFBhbmVsIGZvciBpZFxyXG4gICAgICogQGlkIHtudW1iZXJ9IC0gdGhlIGlkXHJcbiAgICAgKiBAcmV0dXJucyAge2phc3NpanMudWkuVmFyaWFibGVQYW5lbH1cclxuICAgICoqL1xyXG4gICAgc3RhdGljIGdldChpZCkge1xyXG4gICAgICAgIGlmICgkKFwiI1wiICsgaWQpLmxlbmd0aCA9PT0gMCkvL2R1bW15IGZvciBDb2RlZWRpdG9yIGhhcyBjbG9zZWRcclxuICAgICAgICAgICAgcmV0dXJuIHsgX19kYjogdHJ1ZSwgYWRkOiBmdW5jdGlvbiAoKSB7IH0sIHVwZGF0ZTogZnVuY3Rpb24gKCkgeyB9IH07XHJcbiAgICAgICAgcmV0dXJuICQoXCIjXCIgKyBpZClbMF0uX3RoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2NhY2hlID0gW107XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGFkZCB2YXJpYWJsZXMgdG8gdmFyaWFiZWxwYW5lbFxyXG4gICAgICogQHBhcmFtIE9iamVjdDxzdHJpbmcsb2JqZWN0PiB2YXJpYWJsZXMgW1wibmFtZVwiXT12YWx1ZVxyXG4gICAgICovXHJcbiAgICBhZGRBbGwodmFycykge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB2YXJzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVmFyaWFibGUoa2V5LCB2YXJzW2tleV0sIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuICAgIHJlbW92ZVZhcmlhYmxlKG5hbWU6c3RyaW5nKXtcclxuICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YWx1ZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlc1t4XS5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMuc3BsaWNlKHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlIC0gdGhlIHZhbHVlIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbcmVmcmVzaF0gLSByZWZyZXNoIHRoZSBkaWFsb2cgXHJcbiAgICAgKi9cclxuICAgIGFkZFZhcmlhYmxlKG5hbWUsIHZhbHVlLCByZWZyZXNoID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlcztcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMudmFsdWUgPT09IFwiXCIpXHJcbiAgICAgICAgICAgIHZhbHVlcyA9IFtdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdmFsdWVzID0gdGhpcy52YWx1ZTtcclxuICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZhbHVlcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAodmFsdWVzW3hdLm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZhbHVlc1t4XS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZm91bmQpXHJcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHsgbmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlIH0pO1xyXG5cclxuICAgICAgICBpZiAocmVmcmVzaCAhPT0gZmFsc2UpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBhbmFseXplIGRlc2NyaWJlQ29tcG9uZW50KGRlc2MpIC0+IGRlc2MuZWRpdGFibGVDb21wb25lbnRzIGFuZCBwdWJsaXNoIHRoaXNcclxuICAgICAqKi9cclxuICAgIHVwZGF0ZUNhY2hlKCkge1xyXG4gICAgICAgIHRoaXMuX2NhY2hlID0ge31cclxuICAgICAgICB2YXIgdmFycyA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YXJzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB2YXJzW3hdLnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHZhcnNbeF0ubmFtZTtcclxuICAgICAgICAgICAgdGhpcy5fY2FjaGVbbmFtZV0gPSB2YWw7XHJcbiAgICAgICAgICAgLyogaWYgKG5hbWUgPT09IFwibWVcIiB8fCBuYW1lID09PSBcInRoaXNcIikge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlW25hbWUgKyBcIi5cIiArIGtleV0gPSB2YWxba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGtleSwgdmFsKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb21wcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcHMgPSBDb21wb25lbnREZXNjcmlwdG9yLmRlc2NyaWJlKHZhbC5jb25zdHJ1Y3RvcikucmVzb2x2ZUVkaXRhYmxlQ29tcG9uZW50cyh2YWwpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBjb21wcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wID0gY29tcHNbbmFtZV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBzICE9PSB1bmRlZmluZWQgJiYgbmFtZSAhPT0gXCJ0aGlzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5hbWUgPSBrZXkgKyBcIi5cIiArIG5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9jYWNoZVtmbmFtZV0gPSBjb21wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoZm5hbWUsIGNvbXBzW25hbWVdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXAgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcCA9IGNvbXA7XHJcbiAgICAgICAgICAgICAgICAgICAvKiB2YXIgY29tcGxpc3QgPSBjb21wPy5fY29tcG9uZW50cztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxpc3QgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBvID0gMDsgbyA8IGNvbXBsaXN0Lmxlbmd0aDsgbysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoZm5hbWUsIGNvbXBsaXN0W29dKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9jYWNoZSkge1xyXG4gICAgICAgICAgICB2YWwgPSB0aGlzLl9jYWNoZVtrZXldO1xyXG4gICAgICAgICAgICB1cGRhdGUoa2V5LCB2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0IHRoZSBpZHMgb2YgYWxsIGVkaXRhYmxlIENvbXBvbmVudHMgYnkgdGhlIGRlc2lnbmVyXHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IHRvIGluc3BlY3RcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaWRGcm9tTGFiZWwgLSBpZiB0cnVlIG5vdCB0aGUgaWQgYnV0IHRoZSBpZCBmb3JtIGxhYmVsIGlzIHJldHVybmVkXHJcbiAgICAgKiovXHJcbiAgICBnZXRFZGl0YWJsZUNvbXBvbmVudHMoY29tcG9uZW50LCBpZEZyb21MYWJlbCA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhciByZXQgPSBcIlwiO1xyXG4gICAgICAgIGlmKGNvbXBvbmVudC5faXNOb3RFZGl0YWJsZUluRGVzaWduZXI9PT10cnVlKVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIGlmICh0aGlzLmdldFZhcmlhYmxlRnJvbU9iamVjdChjb21wb25lbnQpICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldCA9IFwiI1wiICsgKChpZEZyb21MYWJlbCA9PT0gdHJ1ZSkgPyBjb21wb25lbnQuZG9tV3JhcHBlci5faWQgOiBjb21wb25lbnQuX2lkKTtcclxuICAgICAgICBpZiAoY29tcG9uZW50Ll9jb21wb25lbnRzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wb25lbnQuX2NvbXBvbmVudHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB0ID0gdGhpcy5nZXRFZGl0YWJsZUNvbXBvbmVudHMoY29tcG9uZW50Ll9jb21wb25lbnRzW3hdLCBpZEZyb21MYWJlbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodCAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIChyZXQgPT09IFwiXCIgPyBcIlwiIDogXCIsXCIpICsgdFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzVHlwZU9mKHZhbHVlLHR5cGUpOmJvb2xlYW57XHJcbiAgICAgICAgaWYodmFsdWU9PT11bmRlZmluZWR8fHZhbHVlPT09bnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmKHR5cGVvZiB0eXBlID09PVwiZnVuY3Rpb25cIil7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIHR5cGU7XHJcbiAgICAgICAgfWVsc2UgXHJcbiAgICAgICAgICAgIHJldHVybih2YWx1ZVt0eXBlXSE9PXVuZGVmaW5lZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIGdldCBhbGwga25vd24gaW5zdGFuY2VzIGZvciB0eXBlXHJcbiAgICAqIEBwYXJhbSB7dHlwZXxzdHJpbmd9IHR5cGUgLSB0aGUgdHlwZSB3ZSBhcmUgaW50ZXJlc3RlZCBvciB0aGUgbWVtYmVyIHdoaWNoIGlzIGltcGxlbWVudGVkXHJcbiAgICAqIEByZXR1cm5zIHtbc3RyaW5nXX1cclxuICAgICovXHJcbiAgICBnZXRWYXJpYWJsZXNGb3JUeXBlKHR5cGUpIHtcclxuICAgICAgICB2YXIgcmV0ID0gW107XHJcbiAgICAgICAgdmFyIHZhcnMgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YXJzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB2YXJzW3hdLnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHZhcnNbeF0ubmFtZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNUeXBlT2YodmFsLHR5cGUpJiZyZXQuaW5kZXhPZihuYW1lKT09PS0xKVxyXG4gICAgICAgICAgICAgICAgcmV0LnB1c2gobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vc2VhY2ggaW4gdGhpc1xyXG4gICAgICAgIHZhcnMgPSB0aGlzLl9jYWNoZVtcInRoaXNcIl07XHJcbiAgICAgICAgZm9yIChsZXQgeSBpbiB2YXJzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1R5cGVPZih2YXJzW3ldLHR5cGUpJiZyZXQuaW5kZXhPZihcInRoaXMuXCIgKyB5KT09PS0xKVxyXG4gICAgICAgICAgICAgICAgcmV0LnB1c2goXCJ0aGlzLlwiICsgeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vc2VhY2ggaW4gbWVcclxuICAgICAgICB2YXJzID0gdGhpcy5fY2FjaGVbXCJtZVwiXTtcclxuICAgICAgICBpZiAodmFycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHogaW4gdmFycykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVHlwZU9mKHZhcnNbel0sdHlwZSkmJnJldC5pbmRleE9mKFwibWUuXCIgKyB6KT09PS0xKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKFwibWUuXCIgKyB6KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL3NlYXJjaCBpbiBjYWNoZSAocHVibGlzaGVkIGJ5IHVwZGF0ZUNhY2hlKVxyXG4gICAgICAgIGZvcihsZXQga2V5IGluIHRoaXMuX2NhY2hlICl7XHJcbiAgICAgICAgICAgIGlmKCFrZXkuc3RhcnRzV2l0aChcInRoaXMuXCIpICYmdGhpcy5pc1R5cGVPZih0aGlzLl9jYWNoZVtrZXldICx0eXBlKSAmJiAgcmV0LmluZGV4T2Yoa2V5KT09PS0xKVxyXG4gICAgICAgICAgICAgcmV0LnB1c2goa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldHMgdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmVsIHRoYXQgaG9sZHMgdGhlIG9iamVjdFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iIC0gdGhlXHJcbiAgICAgKi9cclxuICAgIGdldFZhcmlhYmxlRnJvbU9iamVjdChvYikge1xyXG5cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fY2FjaGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlW2tleV0gPT09IG9iKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRzIHRoZSBuYW1lIG9iamVjdCBvZiB0aGUgZ2l2ZW4gdmFyaWFiZWxcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvYiAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgICovXHJcbiAgICBnZXRPYmplY3RGcm9tVmFyaWFibGUodmFybmFtZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jYWNoZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZVt2YXJuYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgKiByZW5hbWVzIGEgdmFyaWFibGUgaW4gZGVzaWduXHJcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IG9sZE5hbWVcclxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3TmFtZVxyXG4gICAgICAqL1xyXG4gICAgcmVuYW1lVmFyaWFibGUob2xkTmFtZSwgbmV3TmFtZSkge1xyXG4gICAgICAgIGlmIChvbGROYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSkge1xyXG4gICAgICAgICAgICBvbGROYW1lID0gb2xkTmFtZS5zdWJzdHJpbmcoNSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdOYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSlcclxuICAgICAgICAgICAgICAgIG5ld05hbWUgPSBuZXdOYW1lLnN1YnN0cmluZyg1KTtcclxuICAgICAgICAgICAgbGV0IHZhcnMgPSB0aGlzLl9jYWNoZVtcInRoaXNcIl07XHJcbiAgICAgICAgICAgIHZhcnNbbmV3TmFtZV0gPSB2YXJzW29sZE5hbWVdO1xyXG4gICAgICAgICAgICBkZWxldGUgdmFyc1tvbGROYW1lXTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9sZE5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSkge1xyXG4gICAgICAgICAgICBvbGROYW1lID0gb2xkTmFtZS5zdWJzdHJpbmcoMyk7XHJcbiAgICAgICAgICAgIGlmIChuZXdOYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikpXHJcbiAgICAgICAgICAgICAgICBuZXdOYW1lID0gbmV3TmFtZS5zdWJzdHJpbmcoMyk7XHJcbiAgICAgICAgICAgIGxldCB2YXJzID0gdGhpcy5fY2FjaGVbXCJtZVwiXTtcclxuICAgICAgICAgICAgdmFyc1tuZXdOYW1lXSA9IHZhcnNbb2xkTmFtZV07XHJcbiAgICAgICAgICAgIGRlbGV0ZSB2YXJzW29sZE5hbWVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB2YXJzID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YXJzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gdmFyc1t4XS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gdmFyc1t4XS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IG9sZE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXJzW3hdLm5hbWUgPSBuZXdOYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlZnJlc2hlcyBUYWJsZVxyXG4gICAgICovXHJcbiAgICB1cGRhdGUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FjaGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdmFsdWUodmFsdWUpIHsgLy90aGUgQ29kZVxyXG4gICAgICAgIHRoaXMuX2l0ZW1zID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMudGFibGUpXHJcbiAgICAgICAgICAgIHRoaXMudGFibGUuaXRlbXMgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXRlbXMvL3RoaXMudGFibGUuaXRlbXM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0TWVtYmVycyhvYiwgd2l0aEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKHdpdGhGdW5jdGlvbiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB3aXRoRnVuY3Rpb24gPSBmYWxzZTtcclxuICAgICAgICB2YXIgcmV0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgayBpbiBvYikge1xyXG4gICAgICAgICAgICByZXQucHVzaChrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHdpdGhGdW5jdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IG9iLl9fcHJvdG9fXztcclxuICAgICAgICAgICAgaWYgKG9iLmNvbnN0cnVjdG9yICE9PSBudWxsKS8vb2IgaXMgYSBjbGFzc1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9IG9iO1xyXG4gICAgICAgICAgICB0aGlzLl9nZXRNZW1iZXJzUHJvdG8odHlwZSwgcmV0LCBvYik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgX2dldE1lbWJlcnNQcm90byhwcm90bywgcmV0LCBvYikge1xyXG4gICAgICAgIGlmIChwcm90byA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmIChwcm90by5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9iamVjdFwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIG5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbmFtZXMubGVuZ3RoOyB4KyspIHtcclxuXHJcbiAgICAgICAgICAgIHJldC5wdXNoKG5hbWVzW3hdKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwcm90by5fX3Byb3RvX18gIT09IHVuZGVmaW5lZCAmJiBwcm90by5fX3Byb3RvX18gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2V0TWVtYmVyc1Byb3RvKHByb3RvLl9fcHJvdG9fXywgcmV0LCBvYik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBvYmplY3RcclxuICAgICovXHJcbiAgICBldmFsRXhwcmVzc2lvbihuYW1lKSB7XHJcblxyXG4gICAgICAgIHZhciB0b0V2YWwgPSBcIl92YXJpYWJsZXNfLl9jdXJDdXJzb3I9XCIgKyBuYW1lICsgXCI7XCI7XHJcbiAgICAgICAgdmFyIHZhbHMgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmFscy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgdiA9IHZhbHNbeF07XHJcbiAgICAgICAgICAgIHZhciBzbmFtZSA9IHYubmFtZTtcclxuICAgICAgICAgICAgaWYgKHNuYW1lID09PSBcInRoaXNcIilcclxuICAgICAgICAgICAgICAgIHNuYW1lID0gXCJ0aGlzX3RoaXNcIjtcclxuICAgICAgICAgICAgaWYgKHNuYW1lICE9PSBcIndpbmRvd3NcIilcclxuICAgICAgICAgICAgICAgIHRvRXZhbCA9IFwidmFyIFwiICsgc25hbWUgKyBcIj1fdmFyaWFibGVzXy5nZXRPYmplY3RGcm9tVmFyaWFibGUoXFxcIlwiICsgdi5uYW1lICsgXCJcXFwiKTtcIiArIHRvRXZhbDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRvRXZhbCA9IFwidmFyIGV2PWZ1bmN0aW9uKCl7XCIgKyB0b0V2YWwgKyAnfTtldi5iaW5kKF92YXJpYWJsZXNfLmdldE9iamVjdEZyb21WYXJpYWJsZShcInRoaXNcIikpKCk7JztcclxuICAgICAgICB0b0V2YWwgPSBcInZhciBfdmFyaWFibGVzXz0kKCcjXCIgKyB0aGlzLl9pZCArIFwiJylbMF0uX3RoaXM7XCIgKyB0b0V2YWw7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZXZhbCh0b0V2YWwpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvL3RoaXMgaXMgdGhlIHJlYWwgb2JqZWN0IGZvciAuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1ckN1cnNvcjtcclxuICAgIH1cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuZGVidWdwb2ludHMgPSBbXTtcclxuICAgICAgICBpZih0aGlzLnRhYmxlKVxyXG4gICAgICAgICAgICB0aGlzLnRhYmxlLml0ZW1zID0gW107XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==