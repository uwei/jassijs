var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Button", "jassijs/ui/PropertyEditor", "jassijs/util/Tools", "jassijs/remote/Classes", "jassijs/ui/Property", "jassijs/ext/jquerylib"], function (require, exports, Registry_1, Editor_1, Button_1, PropertyEditor_1, Tools_1, Classes_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.JsonEditor = void 0;
    let JsonEditor = class JsonEditor extends Editor_1.Editor {
        /**
         * Editor for number and string
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.DefaultEditor
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
            this._ob = ob;
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
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
        propertyChanged(param, propEditor) {
            var _this = this;
            _this.callEvent("propertyChanged", param);
            if (_this.propertyEditor.parentPropertyEditor === undefined) { //only if the last JSON-PropertyEditor Window is closed
                var space = ""; //_this.propertyEditor.getSpace(_this.property.name);
                //var str = Tools.objectToJson(propEditor.value, space);
                var str = Tools_1.Tools.stringObjectToJson(propEditor.codeChanges, space);
                if (_this.property.name === "new") {
                    var shortClassname = Classes_1.classes.getClassName(_this._ob).split(".")[Classes_1.classes.getClassName(_this._ob).split(".").length - 1];
                    str = "new " + shortClassname + "(" + str + ")";
                }
                if (_this.property.constructorClass !== undefined) {
                    var shortClassname = _this.property.constructorClass.split(".")[_this.property.constructorClass.split(".").length - 1];
                    str = "new " + shortClassname + "(" + str + ")";
                }
                var line = _this.propertyEditor.setPropertyInCode(_this.property.name, str);
                //set Property in Design
                //???Alternativ: 
                var test = _this._ob; //Tools.stringObjectToObject
                if (test === undefined) {
                    //_this.ob={};
                    // _this.propertyEditor.setPropertyInDesign(_this.property.name,_this.ob);
                }
                var newvalue = propEditor.value;
                if (_this.property.constructorClass !== undefined) {
                    var cl = Classes_1.classes.getClass(_this.property.constructorClass);
                    newvalue = new cl(propEditor.value);
                }
                if (typeof (_this._ob[_this.property.name]) === "function")
                    _this._ob[_this.property.name](newvalue);
                else
                    _this._ob[_this.property.name] = newvalue;
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
        createPropertyEditor() {
            var propEditor = new PropertyEditor_1.PropertyEditor();
            propEditor.readPropertyValueFromDesign = this.propertyEditor.readPropertyValueFromDesign;
            propEditor.showThisProperties = this.showThisProperties;
            var _this = this;
            this.setCode(propEditor);
            propEditor.onpropertyChanged(function (param) {
                _this.propertyChanged(param, propEditor);
            });
            propEditor.parentPropertyEditor = this.propertyEditor;
            propEditor.variablename = this.property.name;
            if (this.propertyEditor.parentPropertyEditor !== undefined) {
                propEditor.showThisProperties = this.propertyEditor.showThisProperties;
            }
            return propEditor;
        }
        /**
         * get the propertyvalue from code
         */
        async getInitialPropertyValue(code) {
            var newvalue = undefined;
            if (this.property.componentType) {
                let newclass = Classes_1.classes.getClass(this.property.componentType);
                newvalue = new newclass();
            }
            else {
                newvalue = {};
            }
            //only the top-PropertyEditor changed something
            if (this.propertyEditor.parentPropertyEditor === undefined) {
                /* if (this.property.constructorClass !== undefined) {
                     var param = code === undefined ? undefined : code.substring(code.indexOf("(") + 1, code.indexOf(")"));
                     if (param === "")
                         param = undefined;
                     var oclass = await classes.loadClass(this.property.constructorClass);
                     let oparam = Tools.jsonToObject(param);
                     newvalue = new oclass(param === undefined ? undefined : oparam);
                 } else */ {
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
                }
            }
            else {
                var val = this.propertyEditor.value[this.property.name];
                if (val !== undefined) {
                    Object.assign(newvalue, val);
                }
            }
            return newvalue;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        async _onclick(param) {
            var propEditor = this.createPropertyEditor();
            propEditor.value = await this.getInitialPropertyValue(this.propertyEditor.getPropertyValue(this.property));
            //if a new property is created attach it to the parenteditor
            if (this.propertyEditor.parentPropertyEditor && this.propertyEditor.value[this.property.name] === undefined) {
                this.propertyEditor.value[this.property.name] = propEditor.value;
            }
            this.showDialog(propEditor, propEditor);
        }
        showDialog(control, propEditor) {
            var docheight = $(document).height();
            $(control.dom).dialog({
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
        (0, Editor_1.$PropertyEditor)(["json"]),
        (0, Registry_1.$Class)("jassijs.ui.PropertyEditors.JsonEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], JsonEditor);
    exports.JsonEditor = JsonEditor;
    let TestProperties = class TestProperties {
        extensionCalled(action) {
            if (action.getPropertyEditorActions) {
                action.getPropertyEditorActions.actions.push({
                    name: "Hallo", description: "Hallodesc", icon: "mdi mdi-table-arrow-up",
                    run: (hallo) => alert(hallo)
                });
            }
            if (action.getPropertyEditorActions) {
                action.getPropertyEditorActions.actions.push({
                    name: "Hallo", description: "Hallodesc", icon: "mdi mdi-table-arrow-up",
                    run: (hallo) => alert("h2" + hallo)
                });
            }
        }
    };
    __decorate([
        (0, Property_1.$Property)({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "dialogname", void 0);
    __decorate([
        (0, Property_1.$Property)({ name: "jo/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" }),
        (0, Property_1.$Property)({ name: "jo", type: "json", componentType: "jassijs.ui.PropertyEditorTestProperties2" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "jo", void 0);
    TestProperties = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.PropertyEditorTestProperties")
    ], TestProperties);
    function test() {
        var ret = new PropertyEditor_1.PropertyEditor();
        ret.value = new TestProperties();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=JsonEditor.js.map