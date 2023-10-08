var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Registry_1, Property_1, Classes_1, Registry_2) {
    "use strict";
    var ComponentDescriptor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDescriptor = void 0;
    let ComponentDescriptor = ComponentDescriptor_1 = class ComponentDescriptor {
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
            if (ComponentDescriptor_1.cache === undefined) {
                ComponentDescriptor_1.cache = {};
            }
            var cache = ComponentDescriptor_1.cache[type];
            var allFields = [];
            var isDescribeComponentOverided = undefined;
            if (cache === undefined || nocache === true) {
                var family = [];
                if (type.customComponentDescriptor) {
                    cache = type.customComponentDescriptor();
                }
                else {
                    cache = new ComponentDescriptor_1();
                    cache.fields = [];
                    var hideBaseClassProperties = false;
                    do {
                        family.push(type);
                        var sclass = Classes_1.classes.getClassName(type);
                        if (Registry_2.default.getMemberData("$Property") === undefined)
                            return cache;
                        var props = Registry_2.default.getMemberData("$Property")[sclass];
                        if (props === null || props === void 0 ? void 0 : props.new) {
                            var clname = props.new[0][0].componentType;
                            if (Classes_1.classes.getClass(clname)) {
                                type = Classes_1.classes.getClass(clname);
                                sclass = Classes_1.classes.getClassName(type);
                                props = Registry_2.default.getMemberData("$Property")[sclass];
                            }
                        }
                        if (props !== undefined) {
                            var info = Registry_2.default.getMemberData("design:type")[sclass];
                            for (var key in props) {
                                var data = props[key];
                                for (let x = 0; x < data.length; x++) {
                                    if ((_a = data[x][0]) === null || _a === void 0 ? void 0 : _a.hideBaseClassProperties) {
                                        hideBaseClassProperties = data[x][0].hideBaseClassProperties;
                                        continue;
                                    }
                                    var prop = new Property_1.Property(key);
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
                                                prop.type = Classes_1.classes.getClassName(tp);
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
            var sclass = Classes_1.classes.getClassName(component);
            var props = Registry_2.default.getData("$UIComponent")[sclass];
            if (!props) {
                props = props = Registry_2.default.getData("$ReportComponent")[sclass];
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
                    var t = ComponentDescriptor_1.getEditableComponents(component["_components"][x], idFromLabel, includeFrozenContainer, "child");
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
                sclass = Classes_1.classes.getClassName(ob);
                type = ob.constructor;
            }
            else {
                sclass = Classes_1.classes.getClassName(type);
            }
            var found = false;
            if (Registry_2.default.getData("$UIComponent", sclass) !== undefined && Registry_2.default.getData("$UIComponent", sclass)[0] !== undefined) {
                var props = Registry_2.default.getData("$UIComponent", sclass)[0].params[0];
                this.editableComponents = props.editableChildComponents;
                if (props.editableChildComponents !== undefined)
                    found = true;
            }
            if (Registry_2.default.getData("$ReportComponent", sclass) !== undefined && Registry_2.default.getData("$ReportComponent", sclass)[0] !== undefined) {
                var props = Registry_2.default.getData("$ReportComponent", sclass)[0].params[0];
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
    ComponentDescriptor = ComponentDescriptor_1 = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.ComponentDescriptor"),
        __metadata("design:paramtypes", [])
    ], ComponentDescriptor);
    exports.ComponentDescriptor = ComponentDescriptor;
});
//# sourceMappingURL=ComponentDescriptor.js.map