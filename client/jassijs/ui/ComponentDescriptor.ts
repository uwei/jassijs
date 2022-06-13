import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Property } from "jassijs/ui/Property";
import { Component, UIComponentProperties } from "jassijs/ui/Component";
import { classes } from "jassijs/remote/Classes";
import registry from "jassijs/remote/Registry";

@$Class("jassijs.ui.ComponentDescriptor")
export class ComponentDescriptor {
    static cache
    fields: Property[];
    editableComponents;//:Property[];
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
    /**
     * describes a class
     * @param {class}  type - the type of the class
     * @param {boolean}  nocache - an uncached version 
     * @returns {jassijs.ui.ComponentDescriptor} - which describes the component
     */
    static describe(type, nocache:boolean = undefined):ComponentDescriptor {
        if (ComponentDescriptor.cache === undefined) {
            ComponentDescriptor.cache = {};
        }
        var cache = ComponentDescriptor.cache[type];
        var allFields = [];
        var isDescribeComponentOverided = undefined;
        if (cache === undefined || nocache === true) {
            var family = [];
            if (type.customComponentDescriptor) {
                cache=type.customComponentDescriptor();
            } else {
                cache = new ComponentDescriptor();
                cache.fields = [];

                var hideBaseClassProperties = false;
                do {
                    family.push(type);
                    var sclass = classes.getClassName(type);
                    if (registry.getMemberData("$Property") === undefined)
                        return cache;
                    var props = registry.getMemberData("$Property")[sclass];
                    if (props !== undefined) {
                        var info = registry.getMemberData("design:type")[sclass];

                        for (var key in props) {
                            var data = props[key];
                            for (let x = 0; x < data.length; x++) {
                                if (data[x][0]?.hideBaseClassProperties) {
                                    hideBaseClassProperties = data[x][0].hideBaseClassProperties;
                                    continue;
                                }
                                var prop = new Property(key);
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
                                            prop.type = classes.getClassName(tp)
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
    static getEditableComponents(component: Component, idFromLabel, includeFrozenContainer, flag) {
        var ret = "";
        var sclass = classes.getClassName(component);
        var props = registry.getData("$UIComponent")[sclass];
        if (!props) {
            props = props = registry.getData("$ReportComponent")[sclass];
        }
        if (!props === undefined)
            return ret;
        var prop: UIComponentProperties = props.params[0];
        if (includeFrozenContainer === false && prop.editableChildComponents.length === 0 && flag === "child")
            ret = "";
        else
            ret = "#" + ((idFromLabel === true) ? component.domWrapper._id : component._id);
        //TODO implement child container
        if (flag === "child" && prop.editableChildComponents.length === 0)
            return ret;
        if (component["_components"] !== undefined) {
            for (var x = 0; x < component["_components"].length; x++) {
                var t = ComponentDescriptor.getEditableComponents(component["_components"][x], idFromLabel, includeFrozenContainer, "child");
                if (t !== "") {
                    ret = ret + (ret === "" ? "" : ",") + t
                }
            }
        }
        return ret;
    }
    /** calc editableComponents
     * @param {object} ob - the object to resolve
     * @returns {Object.<string,jassijs.ui.Component> - <name,component>
     **/
     resolveEditableComponents(ob,type=undefined,ret=undefined) {
        var sclass;
        var type;
        if(ret===undefined){
            ret={};
             sclass= classes.getClassName(ob);
             type=ob.constructor;
        }else{
            sclass= classes.getClassName(type);

        }
        
        var found=false;
        if (registry.getData("$UIComponent", sclass) !== undefined && registry.getData("$UIComponent", sclass)[0] !== undefined) {
            var props: UIComponentProperties = registry.getData("$UIComponent", sclass)[0].params[0];
            this.editableComponents = props.editableChildComponents;
            if(props.editableChildComponents!==undefined)
                found=true;
        }
        if (registry.getData("$ReportComponent", sclass) !== undefined && registry.getData("$ReportComponent", sclass)[0] !== undefined) {
            var props: UIComponentProperties = registry.getData("$ReportComponent", sclass)[0].params[0];
            this.editableComponents = props.editableChildComponents;
            if(props.editableChildComponents!==undefined)
                found=true;
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
        }else{
            type = type.__proto__;
            if(type !== null && type.name !== "")
                return this.resolveEditableComponents(ob,type,ret);
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

}
