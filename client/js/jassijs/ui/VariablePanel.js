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
                        var complist = comp === null || comp === void 0 ? void 0 : comp._components;
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
        Jassi_1.$Class("jassijs.ui.VariablePanel"),
        __metadata("design:paramtypes", [])
    ], VariablePanel);
    exports.VariablePanel = VariablePanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFyaWFibGVQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvVmFyaWFibGVQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBS0EsZUFBTyxDQUFDLENBQUMsR0FBRyxVQUFVLEVBQUU7UUFDcEIsSUFBSSxlQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUk7WUFDdEIsT0FBTyxLQUFLLENBQUE7UUFDaEIsZUFBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFBO0lBQ0QscUNBQXFDO0lBQ3JDLHFDQUFxQztJQUdyQyxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFjLFNBQVEsYUFBSztRQUtwQztZQUNJLEtBQUssRUFBRSxDQUFDO1lBRlosV0FBTSxHQUFRLEVBQUUsQ0FBQztZQUliLFdBQVc7WUFDWCx5Q0FBeUM7WUFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELEtBQUssQ0FBQyxXQUFXO1lBRWIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxzREFBYSxrQkFBa0IsMkJBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtZQUNwRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDO2dCQUVuQixxQkFBcUIsRUFBRSxVQUFVLEdBQUc7b0JBQ2hDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDYixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUTt3QkFDL0IsT0FBTyxHQUFHLENBQUM7b0JBQ2YsS0FBSyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO3dCQUNyQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixHQUFH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RSxDQUFDO1lBQ2IsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDdEIsSUFBRyxJQUFJLENBQUMsS0FBSztnQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDMUIsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUM7S0FDSixDQUFBO0lBN1ZZLGFBQWE7UUFEekIsY0FBTSxDQUFDLDBCQUEwQixDQUFDOztPQUN0QixhQUFhLENBNlZ6QjtJQTdWWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5cclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50RGVzY3JpcHRvciB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudERlc2NyaXB0b3JcIjtcclxuamFzc2lqcy5kID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBpZiAoamFzc2lqcy5kW2lkXSA9PT0gdHJ1ZSlcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIGphc3NpanMuZFtpZF0gPSB0cnVlO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuLy8gY29uc29sZS5sb2coamFzc2lqcy5kKDkpP2RlYnVnOjApO1xyXG4vLyBjb25zb2xlLmxvZyhqYXNzaWpzLmQoOSk/ZGVidWc6MCk7XHJcblxyXG5AJENsYXNzKFwiamFzc2lqcy51aS5WYXJpYWJsZVBhbmVsXCIpXHJcbmV4cG9ydCBjbGFzcyBWYXJpYWJsZVBhbmVsIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgdGFibGU6IGFueTsvL1RhYmxlIGlzIGhpZGRlbiBpbiBkZWZhdWx0XHJcbiAgICBkZWJ1Z3BvaW50czogeyBbbjogbnVtYmVyXTogYm9vbGVhbiB9O1xyXG4gICAgW19jYWNoZTogc3RyaW5nXTogYW55O1xyXG4gICAgX2l0ZW1zOiBhbnlbXT1bXTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8qKmNhY2hlKiovXHJcbiAgICAgICAgLyoqQG1lbWJlciB7T2JqZWN0LjxudW1iZXIsIGJvb2xlYW4+fSAqKi9cclxuICAgICAgICB0aGlzLmRlYnVncG9pbnRzID0ge307XHJcbiAgICB9XHJcbiAgICBhc3luYyBjcmVhdGVUYWJsZSgpIHtcclxuICAgICAgIFxyXG4gICAgICAgIHZhciBUYWJsZSA9IChhd2FpdCBpbXBvcnQoXCJqYXNzaWpzL3VpL1RhYmxlXCIpKS5UYWJsZVxyXG4gICAgICAgIHRoaXMudGFibGUgPSBuZXcgVGFibGUoe1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBkYXRhVHJlZUNoaWxkRnVuY3Rpb246IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKG9iai52YWx1ZSkgPT09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHYgaW4gb2JqLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG92YWwgPSBvYmoudmFsdWVbdl07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG92YWxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRhYmxlLndpZHRoID0gXCJjYWxjKDEwMCUgLSAycHgpXCI7XHJcbiAgICAgICAgdGhpcy50YWJsZS5oZWlnaHQgPSBcImNhbGMoMTAwJSAtIDJweClcIjtcclxuICAgICAgICBzdXBlci5hZGQodGhpcy50YWJsZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFZhcmlhYmVsUGFuZWwgZm9yIGlkXHJcbiAgICAgKiBAaWQge251bWJlcn0gLSB0aGUgaWRcclxuICAgICAqIEByZXR1cm5zICB7amFzc2lqcy51aS5WYXJpYWJsZVBhbmVsfVxyXG4gICAgKiovXHJcbiAgICBzdGF0aWMgZ2V0KGlkKSB7XHJcbiAgICAgICAgaWYgKCQoXCIjXCIgKyBpZCkubGVuZ3RoID09PSAwKS8vZHVtbXkgZm9yIENvZGVlZGl0b3IgaGFzIGNsb3NlZFxyXG4gICAgICAgICAgICByZXR1cm4geyBfX2RiOiB0cnVlLCBhZGQ6IGZ1bmN0aW9uICgpIHsgfSwgdXBkYXRlOiBmdW5jdGlvbiAoKSB7IH0gfTtcclxuICAgICAgICByZXR1cm4gJChcIiNcIiArIGlkKVswXS5fdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gW107XHJcbiAgICAgICAgdGhpcy5fY2FjaGUgPSBbXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYWRkIHZhcmlhYmxlcyB0byB2YXJpYWJlbHBhbmVsXHJcbiAgICAgKiBAcGFyYW0gT2JqZWN0PHN0cmluZyxvYmplY3Q+IHZhcmlhYmxlcyBbXCJuYW1lXCJdPXZhbHVlXHJcbiAgICAgKi9cclxuICAgIGFkZEFsbCh2YXJzKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHZhcnMpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRWYXJpYWJsZShrZXksIHZhcnNba2V5XSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgdmFyaWFibGVcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZSAtIHRoZSB2YWx1ZSBvZiB0aGUgdmFyaWFibGVcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3JlZnJlc2hdIC0gcmVmcmVzaCB0aGUgZGlhbG9nIFxyXG4gICAgICovXHJcbiAgICBhZGRWYXJpYWJsZShuYW1lLCB2YWx1ZSwgcmVmcmVzaCA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhciB2YWx1ZXM7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCB8fCB0aGlzLnZhbHVlID09PSBcIlwiKVxyXG4gICAgICAgICAgICB2YWx1ZXMgPSBbXTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHZhbHVlcyA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YWx1ZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlc1t4XS5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXNbeF0udmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWZvdW5kKVxyXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh7IG5hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZSB9KTtcclxuXHJcbiAgICAgICAgaWYgKHJlZnJlc2ggIT09IGZhbHNlKVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYW5hbHl6ZSBkZXNjcmliZUNvbXBvbmVudChkZXNjKSAtPiBkZXNjLmVkaXRhYmxlQ29tcG9uZW50cyBhbmQgcHVibGlzaCB0aGlzXHJcbiAgICAgKiovXHJcbiAgICB1cGRhdGVDYWNoZSgpIHtcclxuICAgICAgICB0aGlzLl9jYWNoZSA9IHt9XHJcbiAgICAgICAgdmFyIHZhcnMgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmFycy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdmFyc1t4XS52YWx1ZTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB2YXJzW3hdLm5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlW25hbWVdID0gdmFsO1xyXG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJtZVwiIHx8IG5hbWUgPT09IFwidGhpc1wiKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVbbmFtZSArIFwiLlwiICsga2V5XSA9IHZhbFtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGtleSwgdmFsKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb21wcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcHMgPSBDb21wb25lbnREZXNjcmlwdG9yLmRlc2NyaWJlKHZhbC5jb25zdHJ1Y3RvcikucmVzb2x2ZUVkaXRhYmxlQ29tcG9uZW50cyh2YWwpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBjb21wcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wID0gY29tcHNbbmFtZV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBzICE9PSB1bmRlZmluZWQgJiYgbmFtZSAhPT0gXCJ0aGlzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5hbWUgPSBrZXkgKyBcIi5cIiArIG5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9jYWNoZVtmbmFtZV0gPSBjb21wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoZm5hbWUsIGNvbXBzW25hbWVdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXAgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcCA9IGNvbXA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBsaXN0ID0gY29tcD8uX2NvbXBvbmVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsaXN0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbyA9IDA7IG8gPCBjb21wbGlzdC5sZW5ndGg7IG8rKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKGZuYW1lLCBjb21wbGlzdFtvXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuX2NhY2hlKSB7XHJcbiAgICAgICAgICAgIHZhbCA9IHRoaXMuX2NhY2hlW2tleV07XHJcbiAgICAgICAgICAgIHVwZGF0ZShrZXksIHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXQgdGhlIGlkcyBvZiBhbGwgZWRpdGFibGUgQ29tcG9uZW50cyBieSB0aGUgZGVzaWduZXJcclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gaW5zcGVjdFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpZEZyb21MYWJlbCAtIGlmIHRydWUgbm90IHRoZSBpZCBidXQgdGhlIGlkIGZvcm0gbGFiZWwgaXMgcmV0dXJuZWRcclxuICAgICAqKi9cclxuICAgIGdldEVkaXRhYmxlQ29tcG9uZW50cyhjb21wb25lbnQsIGlkRnJvbUxhYmVsID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdmFyIHJldCA9IFwiXCI7XHJcbiAgICAgICAgaWYoY29tcG9uZW50Ll9pc05vdEVkaXRhYmxlSW5EZXNpZ25lcj09PXRydWUpXHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KGNvbXBvbmVudCkgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0ID0gXCIjXCIgKyAoKGlkRnJvbUxhYmVsID09PSB0cnVlKSA/IGNvbXBvbmVudC5kb21XcmFwcGVyLl9pZCA6IGNvbXBvbmVudC5faWQpO1xyXG4gICAgICAgIGlmIChjb21wb25lbnQuX2NvbXBvbmVudHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNvbXBvbmVudC5fY29tcG9uZW50cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHQgPSB0aGlzLmdldEVkaXRhYmxlQ29tcG9uZW50cyhjb21wb25lbnQuX2NvbXBvbmVudHNbeF0sIGlkRnJvbUxhYmVsKTtcclxuICAgICAgICAgICAgICAgIGlmICh0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgKHJldCA9PT0gXCJcIiA/IFwiXCIgOiBcIixcIikgKyB0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNUeXBlT2YodmFsdWUsdHlwZSk6Ym9vbGVhbntcclxuICAgICAgICBpZih2YWx1ZT09PXVuZGVmaW5lZHx8dmFsdWU9PT1udWxsKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYodHlwZW9mIHR5cGUgPT09XCJmdW5jdGlvblwiKXtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgdHlwZTtcclxuICAgICAgICB9ZWxzZSBcclxuICAgICAgICAgICAgcmV0dXJuKHZhbHVlW3R5cGVdIT09dW5kZWZpbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogZ2V0IGFsbCBrbm93biBpbnN0YW5jZXMgZm9yIHR5cGVcclxuICAgICogQHBhcmFtIHt0eXBlfHN0cmluZ30gdHlwZSAtIHRoZSB0eXBlIHdlIGFyZSBpbnRlcmVzdGVkIG9yIHRoZSBtZW1iZXIgd2hpY2ggaXMgaW1wbGVtZW50ZWRcclxuICAgICogQHJldHVybnMge1tzdHJpbmddfVxyXG4gICAgKi9cclxuICAgIGdldFZhcmlhYmxlc0ZvclR5cGUodHlwZSkge1xyXG4gICAgICAgIHZhciByZXQgPSBbXTtcclxuICAgICAgICB2YXIgdmFycyA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZhcnMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHZhcnNbeF0udmFsdWU7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gdmFyc1t4XS5uYW1lO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1R5cGVPZih2YWwsdHlwZSkmJnJldC5pbmRleE9mKG5hbWUpPT09LTEpXHJcbiAgICAgICAgICAgICAgICByZXQucHVzaChuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9zZWFjaCBpbiB0aGlzXHJcbiAgICAgICAgdmFycyA9IHRoaXMuX2NhY2hlW1widGhpc1wiXTtcclxuICAgICAgICBmb3IgKGxldCB5IGluIHZhcnMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVHlwZU9mKHZhcnNbeV0sdHlwZSkmJnJldC5pbmRleE9mKFwidGhpcy5cIiArIHkpPT09LTEpXHJcbiAgICAgICAgICAgICAgICByZXQucHVzaChcInRoaXMuXCIgKyB5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9zZWFjaCBpbiBtZVxyXG4gICAgICAgIHZhcnMgPSB0aGlzLl9jYWNoZVtcIm1lXCJdO1xyXG4gICAgICAgIGlmICh2YXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeiBpbiB2YXJzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNUeXBlT2YodmFyc1t6XSx0eXBlKSYmcmV0LmluZGV4T2YoXCJtZS5cIiArIHopPT09LTEpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goXCJtZS5cIiArIHopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vc2VhcmNoIGluIGNhY2hlIChwdWJsaXNoZWQgYnkgdXBkYXRlQ2FjaGUpXHJcbiAgICAgICAgZm9yKGxldCBrZXkgaW4gdGhpcy5fY2FjaGUgKXtcclxuICAgICAgICAgICAgaWYoIWtleS5zdGFydHNXaXRoKFwidGhpcy5cIikgJiZ0aGlzLmlzVHlwZU9mKHRoaXMuX2NhY2hlW2tleV0gLHR5cGUpICYmICByZXQuaW5kZXhPZihrZXkpPT09LTEpXHJcbiAgICAgICAgICAgICByZXQucHVzaChrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0cyB0aGUgbmFtZSBvZiB0aGUgdmFyaWFiZWwgdGhhdCBob2xkcyB0aGUgb2JqZWN0XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2IgLSB0aGVcclxuICAgICAqL1xyXG4gICAgZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG9iKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9jYWNoZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGVba2V5XSA9PT0gb2IpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdldHMgdGhlIG5hbWUgb2JqZWN0IG9mIHRoZSBnaXZlbiB2YXJpYWJlbFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9iIC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlXHJcbiAgICAgKi9cclxuICAgIGdldE9iamVjdEZyb21WYXJpYWJsZSh2YXJuYW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NhY2hlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW3Zhcm5hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIHJlbmFtZXMgYSB2YXJpYWJsZSBpbiBkZXNpZ25cclxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gb2xkTmFtZVxyXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdOYW1lXHJcbiAgICAgICovXHJcbiAgICByZW5hbWVWYXJpYWJsZShvbGROYW1lLCBuZXdOYW1lKSB7XHJcbiAgICAgICAgaWYgKG9sZE5hbWUuc3RhcnRzV2l0aChcInRoaXMuXCIpKSB7XHJcbiAgICAgICAgICAgIG9sZE5hbWUgPSBvbGROYW1lLnN1YnN0cmluZyg1KTtcclxuICAgICAgICAgICAgaWYgKG5ld05hbWUuc3RhcnRzV2l0aChcInRoaXMuXCIpKVxyXG4gICAgICAgICAgICAgICAgbmV3TmFtZSA9IG5ld05hbWUuc3Vic3RyaW5nKDUpO1xyXG4gICAgICAgICAgICBsZXQgdmFycyA9IHRoaXMuX2NhY2hlW1widGhpc1wiXTtcclxuICAgICAgICAgICAgdmFyc1tuZXdOYW1lXSA9IHZhcnNbb2xkTmFtZV07XHJcbiAgICAgICAgICAgIGRlbGV0ZSB2YXJzW29sZE5hbWVdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob2xkTmFtZS5zdGFydHNXaXRoKFwibWUuXCIpKSB7XHJcbiAgICAgICAgICAgIG9sZE5hbWUgPSBvbGROYW1lLnN1YnN0cmluZygzKTtcclxuICAgICAgICAgICAgaWYgKG5ld05hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSlcclxuICAgICAgICAgICAgICAgIG5ld05hbWUgPSBuZXdOYW1lLnN1YnN0cmluZygzKTtcclxuICAgICAgICAgICAgbGV0IHZhcnMgPSB0aGlzLl9jYWNoZVtcIm1lXCJdO1xyXG4gICAgICAgICAgICB2YXJzW25ld05hbWVdID0gdmFyc1tvbGROYW1lXTtcclxuICAgICAgICAgICAgZGVsZXRlIHZhcnNbb2xkTmFtZV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHZhcnMgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZhcnMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWwgPSB2YXJzW3hdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSB2YXJzW3hdLm5hbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gb2xkTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhcnNbeF0ubmFtZSA9IG5ld05hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmVmcmVzaGVzIFRhYmxlXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDYWNoZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2YWx1ZSh2YWx1ZSkgeyAvL3RoZSBDb2RlXHJcbiAgICAgICAgdGhpcy5faXRlbXMgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy50YWJsZSlcclxuICAgICAgICAgICAgdGhpcy50YWJsZS5pdGVtcyA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcy8vdGhpcy50YWJsZS5pdGVtcztcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRNZW1iZXJzKG9iLCB3aXRoRnVuY3Rpb24pIHtcclxuICAgICAgICBpZiAod2l0aEZ1bmN0aW9uID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHdpdGhGdW5jdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIHZhciByZXQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBrIGluIG9iKSB7XHJcbiAgICAgICAgICAgIHJldC5wdXNoKGspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAod2l0aEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gb2IuX19wcm90b19fO1xyXG4gICAgICAgICAgICBpZiAob2IuY29uc3RydWN0b3IgIT09IG51bGwpLy9vYiBpcyBhIGNsYXNzXHJcbiAgICAgICAgICAgICAgICB0eXBlID0gb2I7XHJcbiAgICAgICAgICAgIHRoaXMuX2dldE1lbWJlcnNQcm90byh0eXBlLCByZXQsIG9iKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBfZ2V0TWVtYmVyc1Byb3RvKHByb3RvLCByZXQsIG9iKSB7XHJcbiAgICAgICAgaWYgKHByb3RvID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHByb3RvLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiT2JqZWN0XCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgbmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90byk7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBuYW1lcy5sZW5ndGg7IHgrKykge1xyXG5cclxuICAgICAgICAgICAgcmV0LnB1c2gobmFtZXNbeF0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHByb3RvLl9fcHJvdG9fXyAhPT0gdW5kZWZpbmVkICYmIHByb3RvLl9fcHJvdG9fXyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9nZXRNZW1iZXJzUHJvdG8ocHJvdG8uX19wcm90b19fLCByZXQsIG9iKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIG9iamVjdFxyXG4gICAgKi9cclxuICAgIGV2YWxFeHByZXNzaW9uKG5hbWUpIHtcclxuXHJcbiAgICAgICAgdmFyIHRvRXZhbCA9IFwiX3ZhcmlhYmxlc18uX2N1ckN1cnNvcj1cIiArIG5hbWUgKyBcIjtcIjtcclxuICAgICAgICB2YXIgdmFscyA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YWxzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2ID0gdmFsc1t4XTtcclxuICAgICAgICAgICAgdmFyIHNuYW1lID0gdi5uYW1lO1xyXG4gICAgICAgICAgICBpZiAoc25hbWUgPT09IFwidGhpc1wiKVxyXG4gICAgICAgICAgICAgICAgc25hbWUgPSBcInRoaXNfdGhpc1wiO1xyXG4gICAgICAgICAgICBpZiAoc25hbWUgIT09IFwid2luZG93c1wiKVxyXG4gICAgICAgICAgICAgICAgdG9FdmFsID0gXCJ2YXIgXCIgKyBzbmFtZSArIFwiPV92YXJpYWJsZXNfLmdldE9iamVjdEZyb21WYXJpYWJsZShcXFwiXCIgKyB2Lm5hbWUgKyBcIlxcXCIpO1wiICsgdG9FdmFsO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdG9FdmFsID0gXCJ2YXIgZXY9ZnVuY3Rpb24oKXtcIiArIHRvRXZhbCArICd9O2V2LmJpbmQoX3ZhcmlhYmxlc18uZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKFwidGhpc1wiKSkoKTsnO1xyXG4gICAgICAgIHRvRXZhbCA9IFwidmFyIF92YXJpYWJsZXNfPSQoJyNcIiArIHRoaXMuX2lkICsgXCInKVswXS5fdGhpcztcIiArIHRvRXZhbDtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBldmFsKHRvRXZhbCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vdGhpcyBpcyB0aGUgcmVhbCBvYmplY3QgZm9yIC5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VyQ3Vyc29yO1xyXG4gICAgfVxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5kZWJ1Z3BvaW50cyA9IFtdO1xyXG4gICAgICAgIGlmKHRoaXMudGFibGUpXHJcbiAgICAgICAgICAgIHRoaXMudGFibGUuaXRlbXMgPSBbXTtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbn1cclxuIl19