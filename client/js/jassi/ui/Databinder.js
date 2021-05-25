var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/InvisibleComponent", "jassi/ui/Component", "jassi/remote/Jassi", "jassi/remote/Database"], function (require, exports, InvisibleComponent_1, Component_1, Jassi_1, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Databinder = void 0;
    let Databinder = class Databinder extends InvisibleComponent_1.InvisibleComponent {
        constructor() {
            super();
            super.init($('<span class="InvisibleComponent"></span>')[0]);
            /** @member {[jassi.ui.Component]} components - all binded components*/
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
        * @param {jassi.ui.Component} component - the component to bind
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
         * @param {jassi.ui.DataComponent} component
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
        Jassi_1.$Class("jassi.ui.Databinder"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJpbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpL3VpL0RhdGFiaW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWFBLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSx1Q0FBa0I7UUFROUM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCx1RUFBdUU7WUFDdkUsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDckIsMkRBQTJEO1lBQzNELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLDRFQUE0RTtZQUM1RSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNsQiw0RUFBNEU7WUFDNUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDbEIsMEZBQTBGO1lBQzFGLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLDRFQUE0RTtZQUM1RSxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUN0Qix3REFBd0Q7WUFDeEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDaEMsQ0FBQztRQUdEOzs7Ozs7O1VBT0U7UUFDRixHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEdBQUcsU0FBUyxFQUFFLE1BQU0sR0FBRyxTQUFTLEVBQUUsTUFBTSxHQUFHLFNBQVM7WUFDakYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoQyxJQUFJLE1BQU0sS0FB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QUFDLENBQUMsMENBQUUsTUFBTSxDQUFDO2dCQUM3QyxJQUFHLFdBQVcsS0FBRyxTQUFTO29CQUN0QixNQUFNO2dCQUNULEdBQUcsR0FBRyxhQUFFLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3RDO1FBRUwsQ0FBQztRQUNELEtBQUssQ0FBQyxtQkFBbUI7WUFDckIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDcEMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQTthQUM3SDtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDO0tBQ0o7O0FBQ04saUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgamFzc2kgZnJvbSBcImphc3NpL2phc3NpXCI7XG5pbXBvcnQgeyBJbnZpc2libGVDb21wb25lbnQgfSBmcm9tIFwiamFzc2kvdWkvSW52aXNpYmxlQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBDb21wb25lbnQsICRVSUNvbXBvbmVudCB9IGZyb20gXCJqYXNzaS91aS9Db21wb25lbnRcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaS9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IERhdGFDb21wb25lbnQgfSBmcm9tIFwiamFzc2kvdWkvRGF0YUNvbXBvbmVudFwiO1xuaW1wb3J0IHsgZGIsIFR5cGVEZWYgfSBmcm9tIFwiamFzc2kvcmVtb3RlL0RhdGFiYXNlXCI7XG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpL3JlbW90ZS9DbGFzc2VzXCI7XG5cblxuXG5AJFVJQ29tcG9uZW50KHsgZnVsbFBhdGg6IFwiY29tbW9uL0RhdGFiaW5kZXJcIiwgaWNvbjogXCJtZGkgbWRpLWNvbm5lY3Rpb25cIiB9KVxuQCRDbGFzcyhcImphc3NpLnVpLkRhdGFiaW5kZXJcIilcbmV4cG9ydCBjbGFzcyBEYXRhYmluZGVyIGV4dGVuZHMgSW52aXNpYmxlQ29tcG9uZW50IHtcbiAgICBjb21wb25lbnRzOiBDb21wb25lbnRbXTtcbiAgICBwcml2YXRlIF9wcm9wZXJ0aWVzOiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIF9nZXR0ZXI6IHsgKGNvbXA6IENvbXBvbmVudCk6IGFueTsgfVtdO1xuICAgIHByaXZhdGUgX3NldHRlcjogeyAoY29tcDogQ29tcG9uZW50LCB2YWx1ZTogYW55KTogYW55OyB9W107XG4gICAgcHJpdmF0ZSBfb25DaGFuZ2U6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgX2F1dG9jb21taXQ6IGFueVtdO1xuICAgIHVzZXJPYmplY3Q7XG4gICAgY29uc3RydWN0b3IoKSB7Ly9pZCBjb25uZWN0IHRvIGV4aXN0aW5nKG5vdCByZXFpcmVkKVxuICAgICAgICBzdXBlcigpO1xuICAgICAgICBzdXBlci5pbml0KCQoJzxzcGFuIGNsYXNzPVwiSW52aXNpYmxlQ29tcG9uZW50XCI+PC9zcGFuPicpWzBdKTtcbiAgICAgICAgLyoqIEBtZW1iZXIge1tqYXNzaS51aS5Db21wb25lbnRdfSBjb21wb25lbnRzIC0gYWxsIGJpbmRlZCBjb21wb25lbnRzKi9cbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XG4gICAgICAgIC8qKiBAbWVtYmVyIHtbc3RyaW5nXX0gcHJvcGVydGllcyAtIGFsbCBiaW5kZWQgcHJvcGVydGllcyovXG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSBbXTtcbiAgICAgICAgLyoqIEBtZW1iZXIgW1tmdW5jdGlvbl1dIGdldHRlciAtIGFsbCBmdW5jdGlvbnMgdG8gZ2V0IHRoZSBjb21wb25lbnQgdmFsdWUqL1xuICAgICAgICB0aGlzLl9nZXR0ZXIgPSBbXTtcbiAgICAgICAgLyoqIEBtZW1iZXIgW1tmdW5jdGlvbl1dIHNldHRlciAtIGFsbCBmdW5jdGlvbnMgdG8gc2V0IHRoZSBjb21wb25lbnQgdmFsdWUqL1xuICAgICAgICB0aGlzLl9zZXR0ZXIgPSBbXTtcbiAgICAgICAgLyoqIEBtZW1iZXIge1tmdW5jdGlvbl19IG9uQ2hhbmdlIC0gY2hhbmdlSGFuZGxlciBmb3IgYWxsIGNvbXBvbmVudHMgdXNlZCBmb3IgYXV0b2NvbW1pdCovXG4gICAgICAgIHRoaXMuX29uQ2hhbmdlID0gW107XG4gICAgICAgIC8qKiBAbWVtYmVyIHtbZnVuY3Rpb25dfSBhdXRvY29tbWl0IC0gYXV0b2NvbW1pdEhhbmRsZXIgZm9yIGFsbCBjb21wb25lbnRzKi9cbiAgICAgICAgdGhpcy5fYXV0b2NvbW1pdCA9IFtdO1xuICAgICAgICAvKiogQG1lbWJlciBbe29iamVjdH1dIHVzZXJPYmplY3QgLSB0aGUgb2JqZWN0IHRvIGJpbmQqL1xuICAgICAgICB0aGlzLnVzZXJPYmplY3QgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAqIGJpbmRzIHRoZSBjb21wb25lbnQgdG8gdGhlIHByb3BlcnR5IG9mIHRoZSB1c2VyT2JqZWN0XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gYmluZFxuICAgICogQHBhcmFtIHtqYXNzaS51aS5Db21wb25lbnR9IGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gYmluZFxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvbkNoYW5nZV0gLSBmdW5jdGlvbm5hbWUgdG8gcmVnaXN0ZXIgdGhlICBjaGFuZ2VoYW5kbGVyIC0gaWYgbWlzc2luZyBubyBhdXRvY29tbWl0IGlzIHBvc3NpYmxlXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0dGVyXSAtIGZ1bmN0aW9uIHRvIGdldCB0aGUgdmFsdWUgb2YgdGhlIGNvbXBvbmVudCAtIGlmIG1pc3NpbmcgLnZhbHVlIGlzIHVzZWRcbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtzZXR0ZXJdIC0gZnVuY3Rpb24gdG8gcHV0IHRoZSB2YWx1ZSBvZiB0aGUgY29tcG9uZW50IC0gaWYgbWlzc2luZyAudmFsdWUgaXMgdXNlZFxuICAgICovXG4gICAgYWRkKHByb3BlcnR5LCBjb21wb25lbnQsIG9uQ2hhbmdlID0gdW5kZWZpbmVkLCBnZXR0ZXIgPSB1bmRlZmluZWQsIHNldHRlciA9IHVuZGVmaW5lZCkgey8vYWRkIGEgY29tcG9uZW50IHRvIHRoZSBjb250YWluZXJcbiAgICAgICAgdGhpcy5yZW1vdmUoY29tcG9uZW50KTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcbiAgICAgICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9nZXR0ZXIucHVzaChmdW5jdGlvbiAoY29tcG9uZW50OiBDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50W1widmFsdWVcIl07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICB0aGlzLl9nZXR0ZXIucHVzaChnZXR0ZXIpO1xuXG4gICAgICAgIGlmIChzZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0dGVyLnB1c2goZnVuY3Rpb24gKGNvbXBvbmVudCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRbXCJ2YWx1ZVwiXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhpcy5fc2V0dGVyLnB1c2goc2V0dGVyKTtcblxuICAgICAgICBpZiAob25DaGFuZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UucHVzaChjb21wb25lbnRbXCJvbkNoYW5nZVwiXSk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UucHVzaChvbkNoYW5nZSk7XG5cbiAgICAgICAgaWYgKHRoaXMudXNlck9iamVjdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgYWNjPW5ldyBQcm9wZXJ0eUFjY2Vzc29yKCk7XG4gICAgICAgICAgICBhY2MudXNlck9iamVjdD10aGlzLnVzZXJPYmplY3Q7XG4gICAgICAgICAgICBsZXQgc2V0dGVyID0gdGhpcy5fc2V0dGVyW3RoaXMuX3NldHRlci5sZW5ndGgtMV07XG4gICAgICAgICAgICBhY2Muc2V0UHJvcGVydHkoc2V0dGVyLGNvbXBvbmVudCxwcm9wZXJ0eSx1bmRlZmluZWQpO1xuICAgICAgICAgICAgYWNjLmZpbmFsaXplU2V0UHJvcGVydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoY29tcG9uZW50W3RoaXMuX29uQ2hhbmdlW3RoaXMuX29uQ2hhbmdlLmxlbmd0aCAtIDFdXSkge1xuICAgICAgICAgICAgY29tcG9uZW50W3RoaXMuX29uQ2hhbmdlW3RoaXMuX29uQ2hhbmdlLmxlbmd0aCAtIDFdXSgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jb21wb25lbnRDaGFuZ2VkKGNvbXBvbmVudCwgcHJvcGVydHksIGV2ZW50KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcy5fYXV0b2NvbW1pdC5wdXNoKHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIGNvbXBvbmVudENoYW5nZWQoY29tcG9uZW50LCBwcm9wZXJ0eSwgZXZlbnQpIHtcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY29tcG9uZW50cy5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgIGlmIChjb21wb25lbnQuYXV0b2NvbW1pdCkge1xuXG4gICAgICAgICAgICB0aGlzLl9mcm9tRm9ybShwb3MpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2YWwgPSB0aGlzLl9nZXR0ZXJbcG9zXSh0aGlzLmNvbXBvbmVudHNbcG9zXSk7Ly90aGlzLl9nZXR0ZXJbcG9zXSh0aGlzLmNvbXBvbmVudHNbcG9zXSk7XG4gICAgICAgIC8vc3luY2hyb25pemUgdGhlIG5ldyBvYmplY3QgdG8gYWxsIHRoZSBvdGhlciBjb21wb25lbnRzXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgeCsrKSB7XG5cbiAgICAgICAgICAgIHZhciB0ZXN0ID0gdGhpcy5fZ2V0dGVyW3hdKHRoaXMuY29tcG9uZW50c1t4XSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9wZXJ0aWVzW3hdID09PSBwcm9wZXJ0eSAmJiB0ZXN0ICE9IHZhbCAmJiB0aGlzLmNvbXBvbmVudHNbeF0gIT09IGNvbXBvbmVudCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dGVyW3hdKHRoaXMuY29tcG9uZW50c1t4XSwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZW1vdmUoY29tcG9uZW50KSB7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnRzW3hdID09PSBjb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc3BsaWNlKHgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXMuc3BsaWNlKHgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2dldHRlci5zcGxpY2UoeCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dGVyLnNwbGljZSh4LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkNoYW5nZS5zcGxpY2UoeCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXV0b2NvbW1pdC5zcGxpY2UoeCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogZGVmaW5lcyBnZXR0ZXIgYW5kIHNldHRlciBhbmQgY29ubmVjdCB0aGlzIHRvIHRoZSBkYXRhYmluZGVyIFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3QgLSB0aGUgb2JqZWN0IHdoZXJlIHdlIGRlZmluZSB0aGUgcHJvcGVydHkgXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5bmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eVxuICAgICAqKi9cbiAgICBkZWZpbmVQcm9wZXJ0eUZvcihvYmplY3QsIHByb3BlcnR5bmFtZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eW5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMudmFsdWU7IH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gdW5kZWZpbmVkICYmIG5ld1ZhbHVlLnRoZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZS50aGVuKGZ1bmN0aW9uIChvYjIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnZhbHVlID0gb2IyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge29iamVjdH0gdmFsdWUgLSB0aGUgYmluZGVkIHVzZXJvYmplY3QgLSBjYWxsIHRvRm9ybSBvbiBzZXRcbiAgICAgKi9cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIC8vIHRoaXMuZnJvbUZvcm0oKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlck9iamVjdDtcbiAgICB9XG4gICAgc2V0IHZhbHVlKG9iaikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAob2JqICE9PSB1bmRlZmluZWQgJiYgb2JqLnRoZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb2JqLnRoZW4oZnVuY3Rpb24gKG9iMikge1xuICAgICAgICAgICAgICAgIF90aGlzLnRvRm9ybShvYjIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhpcy50b0Zvcm0ob2JqKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBiaW5kcyB0aGUgb2JqZWN0IHRvIGFsbCBhZGRlZCBjb21wb25lbnRzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iaiAtIHRoZSBvYmplY3QgdG8gYmluZFxuICAgICAqL1xuICAgIHRvRm9ybShvYmopIHtcbiAgICAgIFxuICAgICAgICB0aGlzLnVzZXJPYmplY3QgPSBvYmo7XG4gICAgICAgIHZhciBzZXR0ZXIgPSBuZXcgUHJvcGVydHlBY2Nlc3NvcigpO1xuICAgICAgICBzZXR0ZXIudXNlck9iamVjdCA9IG9iajtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbXBvbmVudHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciBjb21wID0gdGhpcy5jb21wb25lbnRzW3hdO1xuICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLl9wcm9wZXJ0aWVzW3hdO1xuICAgICAgICAgICAgdmFyIHNmdW5jID0gdGhpcy5fc2V0dGVyW3hdO1xuICAgICAgICAgICAgdmFyIHNnZXQgPSB0aGlzLl9nZXR0ZXJbeF07XG4gICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSBzZ2V0KGNvbXApO1xuICAgICAgICAgICAgaWYgKHByb3AgPT09IFwidGhpc1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB0aGlzLnVzZXJPYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Z1bmMoY29tcCwgdGhpcy51c2VyT2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHNmdW5jKGNvbXAsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBzZXR0ZXIuc2V0UHJvcGVydHkoc2Z1bmMsIGNvbXAsIHByb3AsIG9sZFZhbHVlKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXR0ZXIuZmluYWxpemVTZXRQcm9wZXJ0eSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXRzIHRoZSBvYmplY3Rwcm9wZXJ0aWVzIGZyb20gYWxsIGFkZGVkIGNvbXBvbmVudHNcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgZnJvbUZvcm0oKSB7XG4gICAgICAgIGlmICh0aGlzLnVzZXJPYmplY3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb21wb25lbnRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB0aGlzLl9mcm9tRm9ybSh4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy51c2VyT2JqZWN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBvYmplY3Rwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gdGhlIG51bWVyIG9mIHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBfZnJvbUZvcm0oeCkge1xuICAgICAgICB2YXIgY29tcCA9IHRoaXMuY29tcG9uZW50c1t4XTtcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLl9wcm9wZXJ0aWVzW3hdO1xuICAgICAgICB2YXIgc2Z1bmMgPSB0aGlzLl9nZXR0ZXJbeF07XG4gICAgICAgIHZhciB0ZXN0ID0gc2Z1bmMoY29tcCk7XG4gICAgICAgIGlmICh0ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChwcm9wID09PSBcInRoaXNcIikge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSB0ZXN0O1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0ZXN0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIC8vIGlmIChjb21wW1wiY29udmVydGVyXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIC8vICAgICB0ZXN0ID0gY29tcFtcImNvbnZlcnRlclwiXS5zdHJpbmdUb09iamVjdCh0ZXN0KTtcbiAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBuZXcgUHJvcGVydHlBY2Nlc3NvcigpLnNldE5lc3RlZFByb3BlcnR5KHRoaXMudXNlck9iamVjdCxwcm9wLCB0ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiByZWdpc3RlciB0aGUgYXV0b2NvbW1pdCBoYW5kbGVyIGlmIG5lZWRlZFxuICAgICAqIEBwYXJhbSB7amFzc2kudWkuRGF0YUNvbXBvbmVudH0gY29tcG9uZW50XG4gICAgICovXG4gICAgLyogY2hlY2tBdXRvY29tbWl0KGNvbXBvbmVudCl7XG4gICAgICAgICBpZihjb21wb25lbnQuYXV0b2NvbW1pdCE9PXRydWUpXG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgdmFyIHBvcz10aGlzLmNvbXBvbmVudHMuaW5kZXhPZihjb21wb25lbnQpO1xuICAgICAgICAgaWYodGhpcy5fYXV0b2NvbW1pdFtwb3NdIT09dW5kZWZpbmVkKVxuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgIHZhciBvbmNoYW5nZT10aGlzLl9vbkNoYW5nZVtwb3NdO1xuICAgICAgICAgaWYob25jaGFuZ2U9PT11bmRlZmluZWQpXG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgdmFyIF90aGlzPXRoaXM7XG4gICAgICAgICB0aGlzLl9hdXRvY29tbWl0W3Bvc109ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICBwb3M9X3RoaXMuY29tcG9uZW50cy5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgX3RoaXMuX2Zyb21Gb3JtKHBvcyk7XG4gICAgICAgICB9O1xuICAgICAgICAgY29tcG9uZW50W29uY2hhbmdlXSh0aGlzLl9hdXRvY29tbWl0W3Bvc10pO1xuICAgICB9Ki9cbiAgICBkZXN0cm95KCkge1xuXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IFtdO1xuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gW107XG4gICAgICAgIHRoaXMuX2dldHRlciA9IFtdO1xuICAgICAgICB0aGlzLl9zZXR0ZXIgPSBbXTtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UgPSBbXTtcbiAgICAgICAgdGhpcy5fYXV0b2NvbW1pdCA9IFtdO1xuICAgICAgICB0aGlzLnVzZXJPYmplY3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICB9XG59XG4gIGNsYXNzIFByb3BlcnR5QWNjZXNzb3Ige1xuICAgICAgICAgICAgcmVsYXRpb25zVG9SZXNvbHZlOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgdXNlck9iamVjdDtcbiAgICAgICAgICAgIHRvZG86IGFueVtdID0gW107XG4gICAgICAgICAgICBnZXROZXN0ZWRQcm9wZXJ0eShvYmosIHByb3BlcnR5OiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBwcm9wZXJ0eS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IG9ialtwYXRoWzBdXTtcbiAgICAgICAgICAgICAgICBpZiAocmV0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXRoLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TmVzdGVkUHJvcGVydHkocmV0LCBwYXRoLmpvaW4oXCIuXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXROZXN0ZWRQcm9wZXJ0eShvYmosIHByb3BlcnR5OiBzdHJpbmcsdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IHByb3BlcnR5LnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgICAgICBwYXRoLnNwbGljZShwYXRoLmxlbmd0aC0xLCAxKTtcbiAgICAgICAgICAgICAgICB2YXIgb2I9b2JqO1xuICAgICAgICAgICAgICAgIGlmKHBhdGgubGVuZ3RoPjApXG4gICAgICAgICAgICAgICAgICAgIG9iPXRoaXMuZ2V0TmVzdGVkUHJvcGVydHkob2IscGF0aC5qb2luKFwiLlwiKSk7XG4gICAgICAgICAgICAgICAgb2JbcHJvcGVydHkuc3BsaXQoXCIuXCIpWzBdXT12YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogY2hlY2sgaWYgcmVsYXRpb24gbXVzdCBiZSByZXNvbHZlZCBhbmQgcXVldWUgaXRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcHJpdmF0ZSB0ZXN0UmVsYXRpb24oZGVmOlR5cGVEZWYscHJvcGVydHk6c3RyaW5nLHByb3BlcnR5cGF0aDpzdHJpbmcsc2V0dGVyLGNvbXA6Q29tcG9uZW50KXtcbiAgICAgICAgICAgICAgICB2YXIgcmVsPWRlZj8uZ2V0UmVsYXRpb24ocHJvcGVydHkpO1xuICAgICAgICAgICAgICAgIHZhciByZXQ9ZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5nZXROZXN0ZWRQcm9wZXJ0eSh0aGlzLnVzZXJPYmplY3QscHJvcGVydHlwYXRoKSE9PXVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDsvL3RoZSByZWxhdGlvbiBpcyByZXNvbHZlZFxuICAgICAgICAgICAgICAgIGlmIChyZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGUgcmVsYXRpb24gc2hvdWxkIGJlIHJlc29sdmVkIG9uIGZpbmFsaXplXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbGF0aW9uc1RvUmVzb2x2ZS5pbmRleE9mKHByb3BlcnR5cGF0aCkgPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxhdGlvbnNUb1Jlc29sdmUucHVzaChwcm9wZXJ0eXBhdGgpO1xuICAgICAgICAgICAgICAgICAgICByZXQ9dHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoc2V0dGVyJiYocHJvcGVydHlwYXRoLmluZGV4T2YoXCIuXCIpPi0xfHxyZXQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2RvLnB1c2goKCkgPT4gc2V0dGVyKGNvbXAsIHRoaXMuZ2V0TmVzdGVkUHJvcGVydHkodGhpcy51c2VyT2JqZWN0LHByb3BlcnR5cGF0aCkpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBzZXQgYSBuZXN0ZWQgcHJvcGVydHkgYW5kIGxvYWQgdGhlIGRiIHJlbGF0aW9uIGlmIG5lZWRlZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzZXRQcm9wZXJ0eShzZXR0ZXIsIGNvbXA6IENvbXBvbmVudCwgcHJvcGVydHk6IHN0cmluZywgb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wVmFsdWUgPSB0aGlzLmdldE5lc3RlZFByb3BlcnR5KCB0aGlzLnVzZXJPYmplY3QscHJvcGVydHkpO1xuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gcHJvcFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRlcihjb21wLCBwcm9wVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgcGF0aD1wcm9wZXJ0eS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnR0eXBlPXRoaXMudXNlck9iamVjdC5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICB2YXIgZGVmID0gZGIuZ2V0TWV0YWRhdGEoY3VycmVudHR5cGUpO1xuICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eXBhdGg9XCJcIjtcbiAgICAgICAgICAgICAgICBmb3IobGV0IHg9MDt4PHBhdGgubGVuZ3RoO3grKyl7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5cGF0aCs9KHByb3BlcnR5cGF0aD09PVwiXCI/XCJcIjpcIi5cIikrcGF0aFt4XTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXN0UmVsYXRpb24oZGVmLHBhdGhbeF0scHJvcGVydHlwYXRoLHBhdGgubGVuZ3RoLTE9PT14P3NldHRlcjp1bmRlZmluZWQsY29tcCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnR0eXBlPWRlZi5nZXRSZWxhdGlvbihwYXRoW3hdKT8ub2NsYXNzO1xuICAgICAgICAgICAgICAgICAgICBpZihjdXJyZW50dHlwZT09PXVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgZGVmID0gZGIuZ2V0TWV0YWRhdGEoY3VycmVudHR5cGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXN5bmMgZmluYWxpemVTZXRQcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZWxhdGlvbnNUb1Jlc29sdmUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnVzZXJPYmplY3QuY29uc3RydWN0b3IuZmluZE9uZSh7IG9ubHlDb2x1bW5zOiBbXSwgaWQ6IHRoaXMudXNlck9iamVjdC5pZCwgcmVsYXRpb25zOiB0aGlzLnJlbGF0aW9uc1RvUmVzb2x2ZSB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnRvZG8uZm9yRWFjaCgoZnVuYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmdW5jKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgLy8gcmV0dXJuIENvZGVFZGl0b3IuY29uc3RydWN0b3I7XG5cbiJdfQ==