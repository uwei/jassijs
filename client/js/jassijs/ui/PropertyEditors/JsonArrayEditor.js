var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/PropertyEditor", "jassijs/ui/BoxPanel", "jassijs/ui/Table", "jassijs/ui/Button"], function (require, exports, Editor_1, Registry_1, Property_1, PropertyEditor_1, BoxPanel_1, Table_1, Button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.JsonArrayEditor = void 0;
    let JsonArrayEditor = class JsonArrayEditor extends Editor_1.Editor {
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
        _onclick(param) {
        }
        /**
        * get the renderer for the PropertyEditor
        * @returns - the UI-component for the editor
        */
        getComponent() {
            return this.component;
        }
        /**
        * @member {object} ob - the object which is edited
        */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        showDialog(control, propEditor) {
            var panel = new BoxPanel_1.BoxPanel();
            var panelButtons = new BoxPanel_1.BoxPanel();
            var table = new Table_1.Table({
                columns: [{ field: "field", title: "field" }]
            });
            var up = new Button_1.Button();
            table.height = "100%";
            panel.horizontal = true;
            panelButtons.add(up);
            panel.add(table);
            panel.add(panelButtons);
            panel.add(control);
            var docheight = $(document).height();
            $(panel.dom).dialog({
                height: docheight,
                width: "320px"
            });
        }
    };
    JsonArrayEditor = __decorate([
        (0, Editor_1.$PropertyEditor)(["jsonarray"]),
        (0, Registry_1.$Class)("jassijs.ui.PropertyEditors.JsonArrayEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], JsonArrayEditor);
    exports.JsonArrayEditor = JsonArrayEditor;
    let TestProperties = class TestProperties {
    };
    __decorate([
        (0, Property_1.$Property)({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "name1", void 0);
    __decorate([
        (0, Property_1.$Property)({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "name2", void 0);
    TestProperties = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.JsonArrayEditor.TestProperties")
    ], TestProperties);
    let TestProperties2 = class TestProperties2 {
    };
    __decorate([
        (0, Property_1.$Property)({ decription: "name of the dialog", type: "jsonarray", componentType: "jassijs.ui.JsonArrayEditor.TestProperties" }),
        __metadata("design:type", Object)
    ], TestProperties2.prototype, "ob", void 0);
    TestProperties2 = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.JsonArrayEditor.TestProperties2")
    ], TestProperties2);
    function test() {
        var ret = new PropertyEditor_1.PropertyEditor();
        ret.value = new TestProperties2();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=JsonArrayEditor.js.map