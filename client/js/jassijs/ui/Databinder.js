var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/InvisibleComponent", "jassijs/ui/Component", "jassijs/remote/Jassi", "jassijs/remote/Database"], function (require, exports, InvisibleComponent_1, Component_1, Jassi_1, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Databinder = void 0;
    let Databinder = class Databinder extends InvisibleComponent_1.InvisibleComponent {
        constructor() {
            super();
            super.init($('<span class="InvisibleComponent"></span>')[0]);
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
        /**
         * gets the objectproperties from all added components
         * @return {object}
         */
        fromForm() {
            if (this.userObject === undefined)
                return undefined;
            for (var x = 0; x < this.components.length; x++) {
                this._fromForm(x);
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
        Component_1.$UIComponent({ fullPath: "common/Databinder", icon: "mdi mdi-connection" }),
        Jassi_1.$Class("jassijs.ui.Databinder"),
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
            var def = Database_1.db.getMetadata(currenttype);
            if (def !== undefined) {
                let propertypath = "";
                for (let x = 0; x < path.length; x++) {
                    propertypath += (propertypath === "" ? "" : ".") + path[x];
                    this.testRelation(def, path[x], propertypath, path.length - 1 === x ? setter : undefined, comp);
                    currenttype = (_a = def.getRelation(path[x])) === null || _a === void 0 ? void 0 : _a.oclass;
                    if (currenttype === undefined)
                        break;
                    def = Database_1.db.getMetadata(currenttype);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJpbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvRGF0YWJpbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBYUEsSUFBYSxVQUFVLEdBQXZCLE1BQWEsVUFBVyxTQUFRLHVDQUFrQjtRQVE5QztZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdELHlFQUF5RTtZQUN6RSxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUNyQiwyREFBMkQ7WUFDM0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDdEIsNEVBQTRFO1lBQzVFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLDRFQUE0RTtZQUM1RSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNsQiwwRkFBMEY7WUFDMUYsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDcEIsNEVBQTRFO1lBQzVFLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLHdEQUF3RDtZQUN4RCxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUNoQyxDQUFDO1FBR0Q7Ozs7Ozs7VUFPRTtRQUNGLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsR0FBRyxTQUFTLEVBQUUsTUFBTSxHQUFHLFNBQVMsRUFBRSxNQUFNLEdBQUcsU0FBUztZQUNqRixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLElBQUksTUFBTSxL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QUEsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsMENBQUUsTUFBTSxDQUFDO29CQUM3QyxJQUFHLFdBQVcsS0FBRyxTQUFTO3dCQUN0QixNQUFNO29CQUNULEdBQUcsR0FBRyxhQUFFLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN0QzthQUNKO1FBRUwsQ0FBQztRQUNELEtBQUssQ0FBQyxtQkFBbUI7WUFDckIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDcEMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQTthQUM3SDtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDO0tBQ0o7O0FBQ04saUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgamFzc2kgZnJvbSBcImphc3NpanMvamFzc2lcIjtcbmltcG9ydCB7IEludmlzaWJsZUNvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzL3VpL0ludmlzaWJsZUNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29tcG9uZW50LCAkVUlDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgRGF0YUNvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzL3VpL0RhdGFDb21wb25lbnRcIjtcbmltcG9ydCB7IGRiLCBUeXBlRGVmIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0RhdGFiYXNlXCI7XG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcblxuXG5cbkAkVUlDb21wb25lbnQoeyBmdWxsUGF0aDogXCJjb21tb24vRGF0YWJpbmRlclwiLCBpY29uOiBcIm1kaSBtZGktY29ubmVjdGlvblwiIH0pXG5AJENsYXNzKFwiamFzc2lqcy51aS5EYXRhYmluZGVyXCIpXG5leHBvcnQgY2xhc3MgRGF0YWJpbmRlciBleHRlbmRzIEludmlzaWJsZUNvbXBvbmVudCB7XG4gICAgY29tcG9uZW50czogQ29tcG9uZW50W107XG4gICAgcHJpdmF0ZSBfcHJvcGVydGllczogc3RyaW5nW107XG4gICAgcHJpdmF0ZSBfZ2V0dGVyOiB7IChjb21wOiBDb21wb25lbnQpOiBhbnk7IH1bXTtcbiAgICBwcml2YXRlIF9zZXR0ZXI6IHsgKGNvbXA6IENvbXBvbmVudCwgdmFsdWU6IGFueSk6IGFueTsgfVtdO1xuICAgIHByaXZhdGUgX29uQ2hhbmdlOiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIF9hdXRvY29tbWl0OiBhbnlbXTtcbiAgICB1c2VyT2JqZWN0O1xuICAgIGNvbnN0cnVjdG9yKCkgey8vaWQgY29ubmVjdCB0byBleGlzdGluZyhub3QgcmVxaXJlZClcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgc3VwZXIuaW5pdCgkKCc8c3BhbiBjbGFzcz1cIkludmlzaWJsZUNvbXBvbmVudFwiPjwvc3Bhbj4nKVswXSk7XG4gICAgICAgIC8qKiBAbWVtYmVyIHtbamFzc2lqcy51aS5Db21wb25lbnRdfSBjb21wb25lbnRzIC0gYWxsIGJpbmRlZCBjb21wb25lbnRzKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XG4gICAgICAgIC8qKiBAbWVtYmVyIHtbc3RyaW5nXX0gcHJvcGVydGllcyAtIGFsbCBiaW5kZWQgcHJvcGVydGllcyovXG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSBbXTtcbiAgICAgICAgLyoqIEBtZW1iZXIgW1tmdW5jdGlvbl1dIGdldHRlciAtIGFsbCBmdW5jdGlvbnMgdG8gZ2V0IHRoZSBjb21wb25lbnQgdmFsdWUqL1xuICAgICAgICB0aGlzLl9nZXR0ZXIgPSBbXTtcbiAgICAgICAgLyoqIEBtZW1iZXIgW1tmdW5jdGlvbl1dIHNldHRlciAtIGFsbCBmdW5jdGlvbnMgdG8gc2V0IHRoZSBjb21wb25lbnQgdmFsdWUqL1xuICAgICAgICB0aGlzLl9zZXR0ZXIgPSBbXTtcbiAgICAgICAgLyoqIEBtZW1iZXIge1tmdW5jdGlvbl19IG9uQ2hhbmdlIC0gY2hhbmdlSGFuZGxlciBmb3IgYWxsIGNvbXBvbmVudHMgdXNlZCBmb3IgYXV0b2NvbW1pdCovXG4gICAgICAgIHRoaXMuX29uQ2hhbmdlID0gW107XG4gICAgICAgIC8qKiBAbWVtYmVyIHtbZnVuY3Rpb25dfSBhdXRvY29tbWl0IC0gYXV0b2NvbW1pdEhhbmRsZXIgZm9yIGFsbCBjb21wb25lbnRzKi9cbiAgICAgICAgdGhpcy5fYXV0b2NvbW1pdCA9IFtdO1xuICAgICAgICAvKiogQG1lbWJlciBbe29iamVjdH1dIHVzZXJPYmplY3QgLSB0aGUgb2JqZWN0IHRvIGJpbmQqL1xuICAgICAgICB0aGlzLnVzZXJPYmplY3QgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAqIGJpbmRzIHRoZSBjb21wb25lbnQgdG8gdGhlIHByb3BlcnR5IG9mIHRoZSB1c2VyT2JqZWN0XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gYmluZFxuICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0byBiaW5kXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29uQ2hhbmdlXSAtIGZ1bmN0aW9ubmFtZSB0byByZWdpc3RlciB0aGUgIGNoYW5nZWhhbmRsZXIgLSBpZiBtaXNzaW5nIG5vIGF1dG9jb21taXQgaXMgcG9zc2libGVcbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXR0ZXJdIC0gZnVuY3Rpb24gdG8gZ2V0IHRoZSB2YWx1ZSBvZiB0aGUgY29tcG9uZW50IC0gaWYgbWlzc2luZyAudmFsdWUgaXMgdXNlZFxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW3NldHRlcl0gLSBmdW5jdGlvbiB0byBwdXQgdGhlIHZhbHVlIG9mIHRoZSBjb21wb25lbnQgLSBpZiBtaXNzaW5nIC52YWx1ZSBpcyB1c2VkXG4gICAgKi9cbiAgICBhZGQocHJvcGVydHksIGNvbXBvbmVudCwgb25DaGFuZ2UgPSB1bmRlZmluZWQsIGdldHRlciA9IHVuZGVmaW5lZCwgc2V0dGVyID0gdW5kZWZpbmVkKSB7Ly9hZGQgYSBjb21wb25lbnQgdG8gdGhlIGNvbnRhaW5lclxuICAgICAgICB0aGlzLnJlbW92ZShjb21wb25lbnQpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzLnB1c2gocHJvcGVydHkpO1xuICAgICAgICBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2dldHRlci5wdXNoKGZ1bmN0aW9uIChjb21wb25lbnQ6IENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRbXCJ2YWx1ZVwiXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHRoaXMuX2dldHRlci5wdXNoKGdldHRlcik7XG5cbiAgICAgICAgaWYgKHNldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXR0ZXIucHVzaChmdW5jdGlvbiAoY29tcG9uZW50LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudFtcInZhbHVlXCJdID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICB0aGlzLl9zZXR0ZXIucHVzaChzZXR0ZXIpO1xuXG4gICAgICAgIGlmIChvbkNoYW5nZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZS5wdXNoKGNvbXBvbmVudFtcIm9uQ2hhbmdlXCJdKTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZS5wdXNoKG9uQ2hhbmdlKTtcblxuICAgICAgICBpZiAodGhpcy51c2VyT2JqZWN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBhY2M9bmV3IFByb3BlcnR5QWNjZXNzb3IoKTtcbiAgICAgICAgICAgIGFjYy51c2VyT2JqZWN0PXRoaXMudXNlck9iamVjdDtcbiAgICAgICAgICAgIGxldCBzZXR0ZXIgPSB0aGlzLl9zZXR0ZXJbdGhpcy5fc2V0dGVyLmxlbmd0aC0xXTtcbiAgICAgICAgICAgIGFjYy5zZXRQcm9wZXJ0eShzZXR0ZXIsY29tcG9uZW50LHByb3BlcnR5LHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBhY2MuZmluYWxpemVTZXRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChjb21wb25lbnRbdGhpcy5fb25DaGFuZ2VbdGhpcy5fb25DaGFuZ2UubGVuZ3RoIC0gMV1dKSB7XG4gICAgICAgICAgICBjb21wb25lbnRbdGhpcy5fb25DaGFuZ2VbdGhpcy5fb25DaGFuZ2UubGVuZ3RoIC0gMV1dKChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIF90aGlzLmNvbXBvbmVudENoYW5nZWQoY29tcG9uZW50LCBwcm9wZXJ0eSwgZXZlbnQpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLl9hdXRvY29tbWl0LnB1c2godW5kZWZpbmVkKTtcbiAgICB9XG4gICAgY29tcG9uZW50Q2hhbmdlZChjb21wb25lbnQsIHByb3BlcnR5LCBldmVudCkge1xuICAgICAgICBsZXQgcG9zID0gdGhpcy5jb21wb25lbnRzLmluZGV4T2YoY29tcG9uZW50KTtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5hdXRvY29tbWl0KSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2Zyb21Gb3JtKHBvcyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZhbCA9IHRoaXMuX2dldHRlcltwb3NdKHRoaXMuY29tcG9uZW50c1twb3NdKTsvL3RoaXMuX2dldHRlcltwb3NdKHRoaXMuY29tcG9uZW50c1twb3NdKTtcbiAgICAgICAgLy9zeW5jaHJvbml6ZSB0aGUgbmV3IG9iamVjdCB0byBhbGwgdGhlIG90aGVyIGNvbXBvbmVudHNcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyB4KyspIHtcblxuICAgICAgICAgICAgdmFyIHRlc3QgPSB0aGlzLl9nZXR0ZXJbeF0odGhpcy5jb21wb25lbnRzW3hdKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb3BlcnRpZXNbeF0gPT09IHByb3BlcnR5ICYmIHRlc3QgIT0gdmFsICYmIHRoaXMuY29tcG9uZW50c1t4XSAhPT0gY29tcG9uZW50KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR0ZXJbeF0odGhpcy5jb21wb25lbnRzW3hdLCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZShjb21wb25lbnQpIHtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudHNbeF0gPT09IGNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zcGxpY2UoeCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcy5zcGxpY2UoeCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0dGVyLnNwbGljZSh4LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR0ZXIuc3BsaWNlKHgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlLnNwbGljZSh4LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvY29tbWl0LnNwbGljZSh4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBkZWZpbmVzIGdldHRlciBhbmQgc2V0dGVyIGFuZCBjb25uZWN0IHRoaXMgdG8gdGhlIGRhdGFiaW5kZXIgXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCAtIHRoZSBvYmplY3Qgd2hlcmUgd2UgZGVmaW5lIHRoZSBwcm9wZXJ0eSBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHluYW1lIC0gdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5XG4gICAgICoqL1xuICAgIGRlZmluZVByb3BlcnR5Rm9yKG9iamVjdCwgcHJvcGVydHluYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5bmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy52YWx1ZTsgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSB1bmRlZmluZWQgJiYgbmV3VmFsdWUudGhlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlLnRoZW4oZnVuY3Rpb24gKG9iMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMudmFsdWUgPSBvYjI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICBfdGhpcy52YWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7b2JqZWN0fSB2YWx1ZSAtIHRoZSBiaW5kZWQgdXNlcm9iamVjdCAtIGNhbGwgdG9Gb3JtIG9uIHNldFxuICAgICAqL1xuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgLy8gdGhpcy5mcm9tRm9ybSgpO1xuICAgICAgICByZXR1cm4gdGhpcy51c2VyT2JqZWN0O1xuICAgIH1cbiAgICBzZXQgdmFsdWUob2JqKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChvYmogIT09IHVuZGVmaW5lZCAmJiBvYmoudGhlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvYmoudGhlbihmdW5jdGlvbiAob2IyKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudG9Gb3JtKG9iMik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICB0aGlzLnRvRm9ybShvYmopO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGJpbmRzIHRoZSBvYmplY3QgdG8gYWxsIGFkZGVkIGNvbXBvbmVudHNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gdGhlIG9iamVjdCB0byBiaW5kXG4gICAgICovXG4gICAgdG9Gb3JtKG9iaikge1xuICAgICAgXG4gICAgICAgIHRoaXMudXNlck9iamVjdCA9IG9iajtcbiAgICAgICAgdmFyIHNldHRlciA9IG5ldyBQcm9wZXJ0eUFjY2Vzc29yKCk7XG4gICAgICAgIHNldHRlci51c2VyT2JqZWN0ID0gb2JqO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29tcG9uZW50cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSB0aGlzLmNvbXBvbmVudHNbeF07XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuX3Byb3BlcnRpZXNbeF07XG4gICAgICAgICAgICB2YXIgc2Z1bmMgPSB0aGlzLl9zZXR0ZXJbeF07XG4gICAgICAgICAgICB2YXIgc2dldCA9IHRoaXMuX2dldHRlclt4XTtcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHNnZXQoY29tcCk7XG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJ0aGlzXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgIT09IHRoaXMudXNlck9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBzZnVuYyhjb21wLCB0aGlzLnVzZXJPYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlck9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2Z1bmMoY29tcCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHNldHRlci5zZXRQcm9wZXJ0eShzZnVuYywgY29tcCwgcHJvcCwgb2xkVmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNldHRlci5maW5hbGl6ZVNldFByb3BlcnR5KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGdldHMgdGhlIG9iamVjdHByb3BlcnRpZXMgZnJvbSBhbGwgYWRkZWQgY29tcG9uZW50c1xuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBmcm9tRm9ybSgpIHtcbiAgICAgICAgaWYgKHRoaXMudXNlck9iamVjdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHRoaXMuX2Zyb21Gb3JtKHgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJPYmplY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IG9iamVjdHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSB0aGUgbnVtZXIgb2YgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIF9mcm9tRm9ybSh4KSB7XG4gICAgICAgIHZhciBjb21wID0gdGhpcy5jb21wb25lbnRzW3hdO1xuICAgICAgICB2YXIgcHJvcCA9IHRoaXMuX3Byb3BlcnRpZXNbeF07XG4gICAgICAgIHZhciBzZnVuYyA9IHRoaXMuX2dldHRlclt4XTtcbiAgICAgICAgdmFyIHRlc3QgPSBzZnVuYyhjb21wKTtcbiAgICAgICAgaWYgKHRlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKHByb3AgPT09IFwidGhpc1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IHRlc3Q7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRlc3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgLy8gaWYgKGNvbXBbXCJjb252ZXJ0ZXJcIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgLy8gICAgIHRlc3QgPSBjb21wW1wiY29udmVydGVyXCJdLnN0cmluZ1RvT2JqZWN0KHRlc3QpO1xuICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIG5ldyBQcm9wZXJ0eUFjY2Vzc29yKCkuc2V0TmVzdGVkUHJvcGVydHkodGhpcy51c2VyT2JqZWN0LHByb3AsIHRlc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlZ2lzdGVyIHRoZSBhdXRvY29tbWl0IGhhbmRsZXIgaWYgbmVlZGVkXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkRhdGFDb21wb25lbnR9IGNvbXBvbmVudFxuICAgICAqL1xuICAgIC8qIGNoZWNrQXV0b2NvbW1pdChjb21wb25lbnQpe1xuICAgICAgICAgaWYoY29tcG9uZW50LmF1dG9jb21taXQhPT10cnVlKVxuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgIHZhciBwb3M9dGhpcy5jb21wb25lbnRzLmluZGV4T2YoY29tcG9uZW50KTtcbiAgICAgICAgIGlmKHRoaXMuX2F1dG9jb21taXRbcG9zXSE9PXVuZGVmaW5lZClcbiAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB2YXIgb25jaGFuZ2U9dGhpcy5fb25DaGFuZ2VbcG9zXTtcbiAgICAgICAgIGlmKG9uY2hhbmdlPT09dW5kZWZpbmVkKVxuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgIHZhciBfdGhpcz10aGlzO1xuICAgICAgICAgdGhpcy5fYXV0b2NvbW1pdFtwb3NdPWZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgcG9zPV90aGlzLmNvbXBvbmVudHMuaW5kZXhPZihjb21wb25lbnQpO1xuICAgICAgICAgICAgIF90aGlzLl9mcm9tRm9ybShwb3MpO1xuICAgICAgICAgfTtcbiAgICAgICAgIGNvbXBvbmVudFtvbmNoYW5nZV0odGhpcy5fYXV0b2NvbW1pdFtwb3NdKTtcbiAgICAgfSovXG4gICAgZGVzdHJveSgpIHtcblxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IFtdO1xuICAgICAgICB0aGlzLl9nZXR0ZXIgPSBbXTtcbiAgICAgICAgdGhpcy5fc2V0dGVyID0gW107XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlID0gW107XG4gICAgICAgIHRoaXMuX2F1dG9jb21taXQgPSBbXTtcbiAgICAgICAgdGhpcy51c2VyT2JqZWN0ID0gdW5kZWZpbmVkO1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgfVxufVxuICBjbGFzcyBQcm9wZXJ0eUFjY2Vzc29yIHtcbiAgICAgICAgICAgIHJlbGF0aW9uc1RvUmVzb2x2ZTogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgIHVzZXJPYmplY3Q7XG4gICAgICAgICAgICB0b2RvOiBhbnlbXSA9IFtdO1xuICAgICAgICAgICAgZ2V0TmVzdGVkUHJvcGVydHkob2JqLCBwcm9wZXJ0eTogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gcHJvcGVydHkuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBvYmpbcGF0aFswXV07XG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE5lc3RlZFByb3BlcnR5KHJldCwgcGF0aC5qb2luKFwiLlwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0TmVzdGVkUHJvcGVydHkob2JqLCBwcm9wZXJ0eTogc3RyaW5nLHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBwcm9wZXJ0eS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgcGF0aC5zcGxpY2UocGF0aC5sZW5ndGgtMSwgMSk7XG4gICAgICAgICAgICAgICAgdmFyIG9iPW9iajtcbiAgICAgICAgICAgICAgICBpZihwYXRoLmxlbmd0aD4wKVxuICAgICAgICAgICAgICAgICAgICBvYj10aGlzLmdldE5lc3RlZFByb3BlcnR5KG9iLHBhdGguam9pbihcIi5cIikpO1xuICAgICAgICAgICAgICAgIG9iW3Byb3BlcnR5LnNwbGl0KFwiLlwiKVswXV09dmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGNoZWNrIGlmIHJlbGF0aW9uIG11c3QgYmUgcmVzb2x2ZWQgYW5kIHF1ZXVlIGl0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHByaXZhdGUgdGVzdFJlbGF0aW9uKGRlZjpUeXBlRGVmLHByb3BlcnR5OnN0cmluZyxwcm9wZXJ0eXBhdGg6c3RyaW5nLHNldHRlcixjb21wOkNvbXBvbmVudCl7XG4gICAgICAgICAgICAgICAgdmFyIHJlbD1kZWY/LmdldFJlbGF0aW9uKHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICB2YXIgcmV0PWZhbHNlO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0TmVzdGVkUHJvcGVydHkodGhpcy51c2VyT2JqZWN0LHByb3BlcnR5cGF0aCkhPT11bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7Ly90aGUgcmVsYXRpb24gaXMgcmVzb2x2ZWRcbiAgICAgICAgICAgICAgICBpZiAocmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhlIHJlbGF0aW9uIHNob3VsZCBiZSByZXNvbHZlZCBvbiBmaW5hbGl6ZVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZWxhdGlvbnNUb1Jlc29sdmUuaW5kZXhPZihwcm9wZXJ0eXBhdGgpID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpb25zVG9SZXNvbHZlLnB1c2gocHJvcGVydHlwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0PXRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHNldHRlciYmKHByb3BlcnR5cGF0aC5pbmRleE9mKFwiLlwiKT4tMXx8cmV0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9kby5wdXNoKCgpID0+IHNldHRlcihjb21wLCB0aGlzLmdldE5lc3RlZFByb3BlcnR5KHRoaXMudXNlck9iamVjdCxwcm9wZXJ0eXBhdGgpKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogc2V0IGEgbmVzdGVkIHByb3BlcnR5IGFuZCBsb2FkIHRoZSBkYiByZWxhdGlvbiBpZiBuZWVkZWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2V0UHJvcGVydHkoc2V0dGVyLCBjb21wOiBDb21wb25lbnQsIHByb3BlcnR5OiBzdHJpbmcsIG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgcHJvcFZhbHVlID0gdGhpcy5nZXROZXN0ZWRQcm9wZXJ0eSggdGhpcy51c2VyT2JqZWN0LHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgIT09IHByb3BWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzZXR0ZXIoY29tcCwgcHJvcFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHBhdGg9cHJvcGVydHkuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50dHlwZT10aGlzLnVzZXJPYmplY3QuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgdmFyIGRlZiA9IGRiLmdldE1ldGFkYXRhKGN1cnJlbnR0eXBlKTtcbiAgICAgICAgICAgICAgICBpZihkZWYhPT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcGVydHlwYXRoPVwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgeD0wO3g8cGF0aC5sZW5ndGg7eCsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5cGF0aCs9KHByb3BlcnR5cGF0aD09PVwiXCI/XCJcIjpcIi5cIikrcGF0aFt4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGVzdFJlbGF0aW9uKGRlZixwYXRoW3hdLHByb3BlcnR5cGF0aCxwYXRoLmxlbmd0aC0xPT09eD9zZXR0ZXI6dW5kZWZpbmVkLGNvbXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudHR5cGU9ZGVmLmdldFJlbGF0aW9uKHBhdGhbeF0pPy5vY2xhc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjdXJyZW50dHlwZT09PXVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICBkZWYgPSBkYi5nZXRNZXRhZGF0YShjdXJyZW50dHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzeW5jIGZpbmFsaXplU2V0UHJvcGVydHkoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVsYXRpb25zVG9SZXNvbHZlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy51c2VyT2JqZWN0LmNvbnN0cnVjdG9yLmZpbmRPbmUoeyBvbmx5Q29sdW1uczogW10sIGlkOiB0aGlzLnVzZXJPYmplY3QuaWQsIHJlbGF0aW9uczogdGhpcy5yZWxhdGlvbnNUb1Jlc29sdmUgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy50b2RvLmZvckVhY2goKGZ1bmMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgIC8vIHJldHVybiBDb2RlRWRpdG9yLmNvbnN0cnVjdG9yO1xuXG4iXX0=