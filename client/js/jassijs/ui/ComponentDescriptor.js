var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Jassi_1, Property_1, Classes_1, Registry_1) {
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
                        if (Registry_1.default.getMemberData("$Property") === undefined)
                            return cache;
                        var props = Registry_1.default.getMemberData("$Property")[sclass];
                        if (props !== undefined) {
                            var info = Registry_1.default.getMemberData("design:type")[sclass];
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
            var props = Registry_1.default.getData("$UIComponent")[sclass];
            if (!props) {
                props = props = Registry_1.default.getData("$ReportComponent")[sclass];
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
            if (Registry_1.default.getData("$UIComponent", sclass) !== undefined && Registry_1.default.getData("$UIComponent", sclass)[0] !== undefined) {
                var props = Registry_1.default.getData("$UIComponent", sclass)[0].params[0];
                this.editableComponents = props.editableChildComponents;
                if (props.editableChildComponents !== undefined)
                    found = true;
            }
            if (Registry_1.default.getData("$ReportComponent", sclass) !== undefined && Registry_1.default.getData("$ReportComponent", sclass)[0] !== undefined) {
                var props = Registry_1.default.getData("$ReportComponent", sclass)[0].params[0];
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
        (0, Jassi_1.$Class)("jassijs.ui.ComponentDescriptor"),
        __metadata("design:paramtypes", [])
    ], ComponentDescriptor);
    exports.ComponentDescriptor = ComponentDescriptor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50RGVzY3JpcHRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvQ29tcG9uZW50RGVzY3JpcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQU9BLElBQWEsbUJBQW1CLDJCQUFoQyxNQUFhLG1CQUFtQjtRQUk1Qjs7O1VBR0U7UUFDRjtZQUNJLG1HQUFtRztZQUNuRyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNqQixvRkFBb0Y7WUFDcEYsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztRQUNqQyxDQUFDO1FBQ0Q7Ozs7O1dBS0c7UUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFrQixTQUFTOztZQUM3QyxJQUFJLHFCQUFtQixDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQ3pDLHFCQUFtQixDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7YUFDbEM7WUFDRCxJQUFJLEtBQUssR0FBRyxxQkFBbUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ25CLElBQUksMkJBQTJCLEdBQUcsU0FBUyxDQUFDO1lBQzVDLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO2dCQUN6QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLElBQUksSUFBSSxDQUFDLHlCQUF5QixFQUFFO29CQUNoQyxLQUFLLEdBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7aUJBQzFDO3FCQUFNO29CQUNILEtBQUssR0FBRyxJQUFJLHFCQUFtQixFQUFFLENBQUM7b0JBQ2xDLEtBQUssQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO29CQUVsQixJQUFJLHVCQUF1QixHQUFHLEtBQUssQ0FBQztvQkFDcEMsR0FBRzt3QkFDQyxNQUFNLENB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QUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO29CQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNiO2FBQ0o7UUFDTCxDQUFDO0tBRUosQ0FBQTtJQTdOWSxtQkFBbUI7UUFEL0IsSUFBQSxjQUFNLEVBQUMsZ0NBQWdDLENBQUM7O09BQzVCLG1CQUFtQixDQTZOL0I7SUE3Tlksa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XG5pbXBvcnQgeyBDb21wb25lbnQsIFVJQ29tcG9uZW50UHJvcGVydGllcyB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XG5pbXBvcnQgcmVnaXN0cnkgZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XG5cbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLkNvbXBvbmVudERlc2NyaXB0b3JcIilcbmV4cG9ydCBjbGFzcyBDb21wb25lbnREZXNjcmlwdG9yIHtcbiAgICBzdGF0aWMgY2FjaGVcbiAgICBmaWVsZHM6IFByb3BlcnR5W107XG4gICAgZWRpdGFibGVDb21wb25lbnRzOy8vOlByb3BlcnR5W107XG4gICAgLyoqXG4gICAgKiBkZXNjcmliZXMgYSBDb21wb25lbnRcbiAgICAqIEBjbGFzcyBqYXNzaWpzLnVpLkVkaXRvclByb3BlcnR5XG4gICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyoqIEBtZW1iZXIge1tqYXNzaWpzLnVpLlByb3BlcnR5XX0gIC0gYWxsIHByb3BlcnR5IGZpZWxkcyB3aGljaCBzaG91bGQgdmlzaWJsZSBpbiBQcm9wZXJ0eUVkaXRvciovXG4gICAgICAgIHRoaXMuZmllbGRzID0gW107XG4gICAgICAgIC8qKiBAbWVtYmVyIHtbamFzc2lqcy51aS5Qcm9wZXJ0eV19ICAtIGFsbCBwcm9wZXJ0eSBmaWVsZHMgd2hpY2ggYWN0cyBhcmUgZWRpdGFibGUqL1xuICAgICAgICB0aGlzLmVkaXRhYmxlQ29tcG9uZW50cyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBkZXNjcmliZXMgYSBjbGFzc1xuICAgICAqIEBwYXJhbSB7Y2xhc3N9ICB0eXBlIC0gdGhlIHR5cGUgb2YgdGhlIGNsYXNzXG4gICAgICogQHBhcmFtIHtib29sZWFufSAgbm9jYWNoZSAtIGFuIHVuY2FjaGVkIHZlcnNpb24gXG4gICAgICogQHJldHVybnMge2phc3NpanMudWkuQ29tcG9uZW50RGVzY3JpcHRvcn0gLSB3aGljaCBkZXNjcmliZXMgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIHN0YXRpYyBkZXNjcmliZSh0eXBlLCBub2NhY2hlOmJvb2xlYW4gPSB1bmRlZmluZWQpOkNvbXBvbmVudERlc2NyaXB0b3Ige1xuICAgICAgICBpZiAoQ29tcG9uZW50RGVzY3JpcHRvci5jYWNoZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBDb21wb25lbnREZXNjcmlwdG9yLmNhY2hlID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNhY2hlID0gQ29tcG9uZW50RGVzY3JpcHRvci5jYWNoZVt0eXBlXTtcbiAgICAgICAgdmFyIGFsbEZpZWxkcyA9IFtdO1xuICAgICAgICB2YXIgaXNEZXNjcmliZUNvbXBvbmVudE92ZXJpZGVkID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoY2FjaGUgPT09IHVuZGVmaW5lZCB8fCBub2NhY2hlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgZmFtaWx5ID0gW107XG4gICAgICAgICAgICBpZiAodHlwZS5jdXN0b21Db21wb25lbnREZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICAgICAgY2FjaGU9dHlwZS5jdXN0b21Db21wb25lbnREZXNjcmlwdG9yKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhY2hlID0gbmV3IENvbXBvbmVudERlc2NyaXB0b3IoKTtcbiAgICAgICAgICAgICAgICBjYWNoZS5maWVsZHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIHZhciBoaWRlQmFzZUNsYXNzUHJvcGVydGllcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgZmFtaWx5LnB1c2godHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzY2xhc3MgPSBjbGFzc2VzLmdldENsYXNzTmFtZSh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZ2lzdHJ5LmdldE1lbWJlckRhdGEoXCIkUHJvcGVydHlcIikgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BzID0gcmVnaXN0cnkuZ2V0TWVtYmVyRGF0YShcIiRQcm9wZXJ0eVwiKVtzY2xhc3NdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZm8gPSByZWdpc3RyeS5nZXRNZW1iZXJEYXRhKFwiZGVzaWduOnR5cGVcIilbc2NsYXNzXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBwcm9wc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgZGF0YS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVt4XVswXT8uaGlkZUJhc2VDbGFzc1Byb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZGVCYXNlQ2xhc3NQcm9wZXJ0aWVzID0gZGF0YVt4XVswXS5oaWRlQmFzZUNsYXNzUHJvcGVydGllcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gbmV3IFByb3BlcnR5KGtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocHJvcCwgZGF0YVt4XVswXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mbyAhPT0gdW5kZWZpbmVkICYmIGluZm9ba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRwID0gaW5mb1trZXldWzBdWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cC5uYW1lID09PSBcIlN0cmluZ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wLnR5cGUgPSBcInN0cmluZ1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRwLm5hbWUgPT09IFwiTnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3AudHlwZSA9IFwibnVtYmVyXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHAubmFtZSA9PT0gXCJCb29sZWFuXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3AudHlwZSA9IFwiYm9vbGVhblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRwLm5hbWUgPT09IFwiRnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcC50eXBlID0gXCJmdW5jdGlvblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcC50eXBlID0gY2xhc3Nlcy5nZXRDbGFzc05hbWUodHApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AudHlwZSA9PT0gdW5kZWZpbmVkICYmIHByb3AuaGlkZSAhPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiUHJvcGVydHkgVHlwZSBub3QgZm91bmQ6XCIgKyBzY2xhc3MgKyBcIi5cIiArIGtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLmZpZWxkcyAhPT0gdW5kZWZpbmVkICYmIGFsbEZpZWxkcy5pbmRleE9mKHByb3AubmFtZSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5maWVsZHMucHVzaChwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEZpZWxkcy5wdXNoKHByb3AubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSB0eXBlLl9fcHJvdG9fXztcblxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHR5cGUgIT09IG51bGwgJiYgdHlwZS5uYW1lICE9PSBcIlwiICYmICFoaWRlQmFzZUNsYXNzUHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgICAgICAvL0hpZGRlbiBmaWVsZHNcbiAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZmllbGRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBjYWNoZS5maWVsZHMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS5maWVsZHNbY10uaGlkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmZpZWxkcy5zcGxpY2UoYy0tLCAxKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWNoZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBpZHMgb2YgYWxsIGVkaXRhYmxlIENvbXBvbmVudHMgYnkgdGhlIGRlc2lnbmVyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0byBpbnNwZWN0XG4gICAgICogQHBhcmFtIHtib29sZWFufSBpZEZyb21MYWJlbCAtIGlmIHRydWUgbm90IHRoZSBpZCBidXQgdGhlIGlkIGZvcm0gbGFiZWwgaXMgcmV0dXJuZWRcbiAgICAgKiBAcGFyYW0ge2ZsYWd9IC0gdW5kb2N1bWVudGVkLXVzZWQgZm9yIHJlY3Vyc2F0aW9uXG4gICAgICoqL1xuICAgIHN0YXRpYyBnZXRFZGl0YWJsZUNvbXBvbmVudHMoY29tcG9uZW50OiBDb21wb25lbnQsIGlkRnJvbUxhYmVsLCBpbmNsdWRlRnJvemVuQ29udGFpbmVyLCBmbGFnKSB7XG4gICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICB2YXIgc2NsYXNzID0gY2xhc3Nlcy5nZXRDbGFzc05hbWUoY29tcG9uZW50KTtcbiAgICAgICAgdmFyIHByb3BzID0gcmVnaXN0cnkuZ2V0RGF0YShcIiRVSUNvbXBvbmVudFwiKVtzY2xhc3NdO1xuICAgICAgICBpZiAoIXByb3BzKSB7XG4gICAgICAgICAgICBwcm9wcyA9IHByb3BzID0gcmVnaXN0cnkuZ2V0RGF0YShcIiRSZXBvcnRDb21wb25lbnRcIilbc2NsYXNzXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByb3BzID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB2YXIgcHJvcDogVUlDb21wb25lbnRQcm9wZXJ0aWVzID0gcHJvcHMucGFyYW1zWzBdO1xuICAgICAgICBpZiAoaW5jbHVkZUZyb3plbkNvbnRhaW5lciA9PT0gZmFsc2UgJiYgcHJvcC5lZGl0YWJsZUNoaWxkQ29tcG9uZW50cy5sZW5ndGggPT09IDAgJiYgZmxhZyA9PT0gXCJjaGlsZFwiKVxuICAgICAgICAgICAgcmV0ID0gXCJcIjtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0ID0gXCIjXCIgKyAoKGlkRnJvbUxhYmVsID09PSB0cnVlKSA/IGNvbXBvbmVudC5kb21XcmFwcGVyLl9pZCA6IGNvbXBvbmVudC5faWQpO1xuICAgICAgICAvL1RPRE8gaW1wbGVtZW50IGNoaWxkIGNvbnRhaW5lclxuICAgICAgICBpZiAoZmxhZyA9PT0gXCJjaGlsZFwiICYmIHByb3AuZWRpdGFibGVDaGlsZENvbXBvbmVudHMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgaWYgKGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl0ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IENvbXBvbmVudERlc2NyaXB0b3IuZ2V0RWRpdGFibGVDb21wb25lbnRzKGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdW3hdLCBpZEZyb21MYWJlbCwgaW5jbHVkZUZyb3plbkNvbnRhaW5lciwgXCJjaGlsZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAodCAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAocmV0ID09PSBcIlwiID8gXCJcIiA6IFwiLFwiKSArIHRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgLyoqIGNhbGMgZWRpdGFibGVDb21wb25lbnRzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iIC0gdGhlIG9iamVjdCB0byByZXNvbHZlXG4gICAgICogQHJldHVybnMge09iamVjdC48c3RyaW5nLGphc3NpanMudWkuQ29tcG9uZW50PiAtIDxuYW1lLGNvbXBvbmVudD5cbiAgICAgKiovXG4gICAgIHJlc29sdmVFZGl0YWJsZUNvbXBvbmVudHMob2IsdHlwZT11bmRlZmluZWQscmV0PXVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgc2NsYXNzO1xuICAgICAgICB2YXIgdHlwZTtcbiAgICAgICAgaWYocmV0PT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHJldD17fTtcbiAgICAgICAgICAgICBzY2xhc3M9IGNsYXNzZXMuZ2V0Q2xhc3NOYW1lKG9iKTtcbiAgICAgICAgICAgICB0eXBlPW9iLmNvbnN0cnVjdG9yO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHNjbGFzcz0gY2xhc3Nlcy5nZXRDbGFzc05hbWUodHlwZSk7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdmFyIGZvdW5kPWZhbHNlO1xuICAgICAgICBpZiAocmVnaXN0cnkuZ2V0RGF0YShcIiRVSUNvbXBvbmVudFwiLCBzY2xhc3MpICE9PSB1bmRlZmluZWQgJiYgcmVnaXN0cnkuZ2V0RGF0YShcIiRVSUNvbXBvbmVudFwiLCBzY2xhc3MpWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBwcm9wczogVUlDb21wb25lbnRQcm9wZXJ0aWVzID0gcmVnaXN0cnkuZ2V0RGF0YShcIiRVSUNvbXBvbmVudFwiLCBzY2xhc3MpWzBdLnBhcmFtc1swXTtcbiAgICAgICAgICAgIHRoaXMuZWRpdGFibGVDb21wb25lbnRzID0gcHJvcHMuZWRpdGFibGVDaGlsZENvbXBvbmVudHM7XG4gICAgICAgICAgICBpZihwcm9wcy5lZGl0YWJsZUNoaWxkQ29tcG9uZW50cyE9PXVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBmb3VuZD10cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWdpc3RyeS5nZXREYXRhKFwiJFJlcG9ydENvbXBvbmVudFwiLCBzY2xhc3MpICE9PSB1bmRlZmluZWQgJiYgcmVnaXN0cnkuZ2V0RGF0YShcIiRSZXBvcnRDb21wb25lbnRcIiwgc2NsYXNzKVswXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgcHJvcHM6IFVJQ29tcG9uZW50UHJvcGVydGllcyA9IHJlZ2lzdHJ5LmdldERhdGEoXCIkUmVwb3J0Q29tcG9uZW50XCIsIHNjbGFzcylbMF0ucGFyYW1zWzBdO1xuICAgICAgICAgICAgdGhpcy5lZGl0YWJsZUNvbXBvbmVudHMgPSBwcm9wcy5lZGl0YWJsZUNoaWxkQ29tcG9uZW50cztcbiAgICAgICAgICAgIGlmKHByb3BzLmVkaXRhYmxlQ2hpbGRDb21wb25lbnRzIT09dW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIGZvdW5kPXRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuZWRpdGFibGVDb21wb25lbnRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gdGhpcy5lZGl0YWJsZUNvbXBvbmVudHNbeF07XG4gICAgICAgICAgICAgICAgdmFyIG1lbWJlcnMgPSBmaWVsZC5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgdmFyIHJldG9iID0gb2I7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCBtZW1iZXJzLmxlbmd0aDsgbSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZW1iZXJzW21dID09PSBcInRoaXNcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldG9iID0gcmV0b2I7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldG9iID0gcmV0b2JbbWVtYmVyc1ttXV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldFtmaWVsZF0gPSByZXRvYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0eXBlID0gdHlwZS5fX3Byb3RvX187XG4gICAgICAgICAgICBpZih0eXBlICE9PSBudWxsICYmIHR5cGUubmFtZSAhPT0gXCJcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlRWRpdGFibGVDb21wb25lbnRzKG9iLHR5cGUscmV0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgIC8qIG9obmUgc3ViY2xhc3Nlc1xuICAgcmVzb2x2ZUVkaXRhYmxlQ29tcG9uZW50cyhvYikge1xuICAgICAgICB2YXIgcmV0ID0ge307XG4gICAgICAgIHZhciBzY2xhc3MgPSBjbGFzc2VzLmdldENsYXNzTmFtZShvYik7XG4gICAgICAgIGlmIChyZWdpc3RyeS5nZXREYXRhKFwiJFVJQ29tcG9uZW50XCIsIHNjbGFzcykgIT09IHVuZGVmaW5lZCAmJiByZWdpc3RyeS5nZXREYXRhKFwiJFVJQ29tcG9uZW50XCIsIHNjbGFzcylbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIHByb3BzOiBVSUNvbXBvbmVudFByb3BlcnRpZXMgPSByZWdpc3RyeS5nZXREYXRhKFwiJFVJQ29tcG9uZW50XCIsIHNjbGFzcylbMF0ucGFyYW1zWzBdO1xuICAgICAgICAgICAgdGhpcy5lZGl0YWJsZUNvbXBvbmVudHMgPSBwcm9wcy5lZGl0YWJsZUNoaWxkQ29tcG9uZW50cztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVnaXN0cnkuZ2V0RGF0YShcIiRSZXBvcnRDb21wb25lbnRcIiwgc2NsYXNzKSAhPT0gdW5kZWZpbmVkICYmIHJlZ2lzdHJ5LmdldERhdGEoXCIkUmVwb3J0Q29tcG9uZW50XCIsIHNjbGFzcylbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIHByb3BzOiBVSUNvbXBvbmVudFByb3BlcnRpZXMgPSByZWdpc3RyeS5nZXREYXRhKFwiJFJlcG9ydENvbXBvbmVudFwiLCBzY2xhc3MpWzBdLnBhcmFtc1swXTtcbiAgICAgICAgICAgIHRoaXMuZWRpdGFibGVDb21wb25lbnRzID0gcHJvcHMuZWRpdGFibGVDaGlsZENvbXBvbmVudHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZWRpdGFibGVDb21wb25lbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5lZGl0YWJsZUNvbXBvbmVudHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSB0aGlzLmVkaXRhYmxlQ29tcG9uZW50c1t4XTtcbiAgICAgICAgICAgICAgICB2YXIgbWVtYmVycyA9IGZpZWxkLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgICAgICB2YXIgcmV0b2IgPSBvYjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IG1lbWJlcnMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lbWJlcnNbbV0gPT09IFwidGhpc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0b2IgPSByZXRvYjtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0b2IgPSByZXRvYlttZW1iZXJzW21dXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0W2ZpZWxkXSA9IHJldG9iO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSovXG4gICAgLyoqXG4gICAgICogcmVtb3ZlIGEgZmllbGQgXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpZWxkIC0gdGhlIG5hbWUgb2YgdGhlIGZpZWxkIHRvIHJlbW92ZVxuICAgICAqL1xuICAgIHJlbW92ZUZpZWxkKGZpZWxkKSB7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5maWVsZHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkc1t4XS5uYW1lID09PSBmaWVsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmllbGRzLnNwbGljZSh4LCAxKTtcbiAgICAgICAgICAgICAgICB4ID0geCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==