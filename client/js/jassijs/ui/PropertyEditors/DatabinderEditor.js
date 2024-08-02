var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Textbox", "jassijs/ui/Component"], function (require, exports, Editor_1, Registry_1, Textbox_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DatabinderEditor = void 0;
    let DatabinderEditor = class DatabinderEditor extends Editor_1.Editor {
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
            this.component = new Textbox_1.Textbox(); //Select();
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
                    if (comp.dom._this instanceof Component_1.FunctionComponent)
                        this.foundFunctionComponents[prop] = true;
                }
                if (ob) {
                    for (var key in ob) {
                        if (found.indexOf(prop + "." + key) === -1) {
                            found.push(prop + "." + key);
                            if (comp.dom._this instanceof Component_1.FunctionComponent)
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
    DatabinderEditor = __decorate([
        (0, Editor_1.$PropertyEditor)(["databinder"]),
        (0, Registry_1.$Class)("jassijs.ui.PropertyEditors.DatabinderEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DatabinderEditor);
    exports.DatabinderEditor = DatabinderEditor;
});
//# sourceMappingURL=DatabinderEditor.js.map