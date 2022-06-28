var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry"], function (require, exports, Textbox_1, Editor_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoadingEditor = void 0;
    let LoadingEditor = class LoadingEditor extends Editor_1.Editor {
        constructor(property, propertyEditor, waitforclass) {
            super(property, propertyEditor);
            this._property = property;
            this._propertyEditor = propertyEditor;
            /** @member - the renedering component **/
            this.component = new Textbox_1.Textbox();
            let _this = this;
            waitforclass.then((cl) => {
                _this._editor = new cl(_this.property, _this.propertyEditor);
                _this.component.dom.parentNode.replaceChild(_this._editor.getComponent().dom, _this.component.dom);
                _this._editor.ob = _this._saveOb;
                _this._editor.onedit((p1, p2) => {
                    debugger;
                    _this.callEvent("edit", p1, p2);
                });
                _this.component = _this._editor.component;
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            this._saveOb = ob;
            if (this._editor)
                this._editor = ob;
            else
                super.ob = ob;
        }
        get ob() {
            if (this._editor)
                return this._editor.ob;
            else
                return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
    };
    LoadingEditor = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.PropertyEditors.LoadingEditor"),
        __metadata("design:paramtypes", [Object, Object, Promise])
    ], LoadingEditor);
    exports.LoadingEditor = LoadingEditor;
});
//# sourceMappingURL=LoadingEditor.js.map