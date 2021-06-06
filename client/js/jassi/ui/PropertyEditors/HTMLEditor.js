var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Jassi", "jassijs/ui/Textbox", "jassijs/ui/ObjectChooser", "jassijs/ui/Panel"], function (require, exports, Editor_1, jassijs_1, Textbox_1, ObjectChooser_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEditor = void 0;
    let HTMLEditor = class HTMLEditor extends Editor_1.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_1.Panel( /*{useSpan:true}*/);
            this._textbox = new Textbox_1.Textbox();
            this._objectchooser = new ObjectChooser_1.ObjectChooser();
            this._objectchooser.width = 24;
            this._textbox.width = "calc(100% - 28px)";
            this.component.height = 24;
            this.component.add(this._textbox);
            this.component.add(this._objectchooser);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange('"' + param + '"');
            });
            this._objectchooser.onclick(function (ob) {
                _this._objectchooser.items = _this.property.type;
            });
            this._objectchooser.onchange(function (ob) {
                _this._textbox.value = _this._objectchooser.value.id;
                _this._onchange();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined && this.property.type === "string" && value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length - 1);
            }
            this._textbox.value = value;
            var _this = this;
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
        _onchange(param = undefined) {
            var val = this._textbox.value;
            var type = this.property.type;
            // var sval="jassijs.db.load(\""+type+"\","+val+")";
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
            /* var _this=this;
             jassijs.db.load("de.Kunde",val).then(function(ob){
                 _this.propertyEditor.setPropertyInDesign(_this.property.name,ob);
             });*/
            /*
            var func=this.propertyEditor.value[this.property.name];
            var binder=this.propertyEditor.getObjectFromVariable(sp[1]);
            this.propertyEditor.value[this.property.name](binder,sp[0]);
            //setPropertyInDesign(this.property.name,val);*/
            super.callEvent("edit", param);
        }
    };
    HTMLEditor = __decorate([
        Editor_1.$PropertyEditor(["html"]),
        jassijs_1.$Class("jassijs.ui.PropertyEditors.HTMLEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], HTMLEditor);
    exports.HTMLEditor = HTMLEditor;
});
//# sourceMappingURL=HTMLEditor.js.map