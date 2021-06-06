var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Select", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/PropertyEditors/JsonEditor", "jassijs/util/Tools", "jassijs/ui/converters/StringConverter", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Classes"], function (require, exports, Select_1, Editor_1, JsonEditor_1, Tools_1, StringConverter_1, Jassi_1, Panel_1, Textbox_1, Registry_1, ComponentDescriptor_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClassSelectorEditor = void 0;
    let ClassSelectorEditor = class ClassSelectorEditor extends Editor_1.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property = undefined, propertyEditor = undefined) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_1.Panel();
            this.component.width = "100%";
            this.select = new Select_1.Select();
            this.select.width = "calc(100% - 26px)";
            this.property = Tools_1.Tools.copyObject(property);
            this.jsonEditor = new JsonEditor_1.JsonEditor(this.property, propertyEditor);
            this.jsonEditor.parentPropertyEditor = this;
            this.jsonEditor.component.text = "";
            this.jsonEditor.component.icon = "mdi mdi-glasses";
            this.jsonEditor.component.width = 26;
            this.component.add(this.select);
            this.component.add(this.jsonEditor.getComponent());
            var _this = this;
            this.jsonEditor.onpropertyChanged(function (param) {
                return;
            });
            this.select.onchange(function (sel) {
                var converter = sel.data;
                _this.changeConverter(converter);
            });
            this.initSelect();
            // this.component.onclick(function(param){
            //     _this._onclick(param);
            // });
        }
        changeConverter(converter) {
            var _this = this;
            var testval = _this.propertyEditor.getPropertyValue(_this.property);
            var shortClassname = converter.classname.split(".")[converter.classname.split(".").length - 1];
            if (testval === undefined || !testval.startsWith("new " + shortClassname)) {
                _this.propertyEditor.setPropertyInCode(_this.property.name, "new " + shortClassname + "()");
                var file = converter.classname.replaceAll(".", "/");
                var stype = file.split("/")[file.split("/").length - 1];
                _this.propertyEditor.addImportIfNeeded(stype, file);
                Classes_1.classes.loadClass(converter.classname).then((pclass) => {
                    _this.propertyEditor.setPropertyInDesign(_this.property.name, new pclass());
                });
            }
            _this.property.constructorClass = converter.classname;
            _this.jsonEditor.showThisProperties = ComponentDescriptor_1.ComponentDescriptor.describe(Classes_1.classes.getClass(converter.classname)).fields;
            for (var x = 0; x < _this.jsonEditor.showThisProperties.length; x++) {
                var test = _this.jsonEditor.showThisProperties[x].name;
                if (test.startsWith("new")) {
                    _this.jsonEditor.showThisProperties[x].name = _this.property.name + test.substring(3);
                }
            }
            _this.jsonEditor.ob = {};
            _this.jsonEditor.component.text = "";
        }
        initSelect() {
            var _this = this;
            Registry_1.default.loadAllFilesForService(this.property.service).then(function () {
                var converters = Registry_1.default.getData(_this.property.service);
                var data = [];
                /*data.push({
                       classname:undefined,
                       data:""
                   });*/
                for (var x = 0; x < converters.length; x++) {
                    var con = converters[x];
                    var cname = Classes_1.classes.getClassName(con.oclass);
                    var name = cname;
                    if (con.params[0] && con.params[0].name !== undefined)
                        name = con.params[0].name;
                    data.push({
                        classname: cname,
                        data: name
                    });
                }
                _this.select.items = data;
                _this.select.display = "data";
                _this.ob = _this.ob;
            });
            //	this.select
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            if (this.propertyEditor === undefined)
                return;
            if (this.select.items === undefined)
                return; //list is not inited
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined) {
                for (var x = 0; x < this.select.items.length; x++) {
                    var sel = this.select.items[x];
                    var shortClassname = sel.classname;
                    if (shortClassname !== undefined) {
                        shortClassname = shortClassname.split(".")[shortClassname.split(".").length - 1];
                        if (value.indexOf(shortClassname) > -1) {
                            this.select.value = sel;
                            this.changeConverter(sel);
                            break;
                        }
                    }
                }
            }
            else {
                this.select.value = "";
            }
            super.ob = ob;
            // this.component.value=value;
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
        _onclick(param) {
            var val = this.component.value;
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
            super.callEvent("edit", param);
        }
        layout() {
            var me = this.me = {};
            me.pan = new Panel_1.Panel();
            me.tb = new Textbox_1.Textbox();
            me.pan.height = 15;
            me.pan.add(me.tb);
            me.tb.height = 15;
            me.tb.converter = new StringConverter_1.StringConverter();
        }
        destroy() {
            this.select.destroy();
            super.destroy();
        }
    };
    ClassSelectorEditor = __decorate([
        Editor_1.$PropertyEditor(["classselector"]),
        Jassi_1.$Class("jassijs.ui.PropertyEditors.ClassSelectorEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ClassSelectorEditor);
    exports.ClassSelectorEditor = ClassSelectorEditor;
    Jassi_1.default.test = function () {
        ComponentDescriptor_1.ComponentDescriptor.cache = {};
        var t = new ClassSelectorEditor();
        t.layout();
        return t.me.pan;
    };
});
//# sourceMappingURL=ClassSelectorEditor.js.map