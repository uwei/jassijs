var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "remote/jassi/base/Jassi", "jassi/ui/PropertyEditors/Editor", "jassi/ui/Button", "jassi/ui/PropertyEditor", "jassi/util/Tools", "remote/jassi/base/Classes", "jassi/ui/Property"], function (require, exports, Jassi_1, Editor_1, Button_1, PropertyEditor_1, Tools_1, Classes_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.JsonEditor = void 0;
    let JsonEditor = class JsonEditor extends Editor_1.Editor {
        /**
         * Editor for number and string
         * used by PropertyEditor
         * @class jassi.ui.PropertyEditors.DefaultEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Button_1.Button();
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
            //set cache for propertyvalues
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
        makePropertyChangedEvent(propEditor) {
            var _this = this;
            propEditor.onpropertyChanged(function (param) {
                _this.callEvent("propertyChanged", param);
                if (_this.propertyEditor.parentPropertyEditor === undefined) { //only if the last JSON-PropertyEditor Window is closed
                    var space = ""; //_this.propertyEditor.getSpace(_this.property.name);
                    //var str = Tools.objectToJson(propEditor.value, space);
                    var str = Tools_1.Tools.stringObjectToJson(propEditor.codeChanges, space);
                    if (_this.property.constructorClass !== undefined) {
                        var shortClassname = _this.property.constructorClass.split(".")[_this.property.constructorClass.split(".").length - 1];
                        str = "new " + shortClassname + "(" + str + ")";
                    }
                    var line = _this.propertyEditor.setPropertyInCode(_this.property.name, str);
                    //set Property in Design
                    //???Alternativ: 
                    var test = _this._ob; //Tools.stringObjectToObject
                    if (typeof (_this._ob[_this.property.name]) === "function")
                        _this._ob[_this.property.name](propEditor.value);
                    else
                        _this._ob[_this.property.name] = propEditor.value;
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
            });
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
                    let textob = Tools_1.Tools.jsonToStringObject(av);
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
        /**
         * intern the value changes
         * @param {type} param
         */
        _onclick(param) {
            var val = this.component.text;
            //if(val!=="function"){//function is still empty
            var propEditor = new PropertyEditor_1.PropertyEditor(undefined);
            propEditor.readPropertyValueFromDesign = this.propertyEditor.readPropertyValueFromDesign;
            propEditor.showThisProperties = this.showThisProperties;
            var _this = this;
            this.setCode(propEditor);
            this.makePropertyChangedEvent(propEditor);
            propEditor.parentPropertyEditor = this.propertyEditor;
            propEditor.variablename = this.property.name;
            var newclass = Classes_1.classes.getClass(this.property.componentType);
            var newvalue = new newclass();
            //only the top-PropertyEditor changed something
            if (this.propertyEditor.parentPropertyEditor === undefined) {
                var code = this.propertyEditor.getPropertyValue(this.property);
                if (this.property.constructorClass !== undefined) {
                    var param = code === undefined ? undefined : code.substring(code.indexOf("(") + 1, code.indexOf(")"));
                    if (param === "")
                        param = undefined;
                    Classes_1.classes.loadClass(this.property.constructorClass).then((oclass) => {
                        let oparam = Tools_1.Tools.jsonToObject(param);
                        var vv = new oclass(param === undefined ? undefined : oparam);
                        propEditor.value = vv;
                    });
                }
                else {
                    let val = undefined;
                    if (code === undefined) {
                        val = {};
                    }
                    else if (typeof (code) === "string") {
                        val = Tools_1.Tools.jsonToObject(code);
                    }
                    else
                        val = code;
                    Object.assign(newvalue, val);
                    val = newvalue;
                    propEditor.value = val;
                }
            }
            else {
                propEditor.showThisProperties = this.propertyEditor.showThisProperties;
                var val = this.propertyEditor.value[this.property.name];
                //if (propEditor.value === undefined) {
                if (val === undefined) {
                    propEditor.value = newvalue;
                    this.propertyEditor.value[this.property.name] = propEditor.value;
                }
                else {
                    Object.assign(newvalue, val);
                    val = newvalue;
                    propEditor.value = val;
                }
            }
            var docheight = $(document).height();
            var docwidth = $(document).width();
            $(propEditor.dom).dialog({
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
        Editor_1.$PropertyEditor(["json"]),
        Jassi_1.$Class("jassi.ui.PropertyEditors.JsonEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], JsonEditor);
    exports.JsonEditor = JsonEditor;
    let TestProperties = class TestProperties {
    };
    __decorate([
        Property_1.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "dialogname", void 0);
    __decorate([
        Property_1.$Property({ name: "jo/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" }),
        Property_1.$Property({ name: "jo", type: "json", componentType: "jassi.ui.PropertyEditorTestProperties2" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "jo", void 0);
    TestProperties = __decorate([
        Jassi_1.$Class("jassi.ui.PropertyEditorTestProperties")
    ], TestProperties);
    let TestProperties2 = class TestProperties2 {
    };
    __decorate([
        Property_1.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties2.prototype, "name1", void 0);
    __decorate([
        Property_1.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties2.prototype, "name2", void 0);
    TestProperties2 = __decorate([
        Jassi_1.$Class("jassi.ui.PropertyEditorTestProperties2")
    ], TestProperties2);
    function test() {
        var ret = new PropertyEditor_1.PropertyEditor(undefined);
        ret.value = new TestProperties();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=JsonEditor.js.map