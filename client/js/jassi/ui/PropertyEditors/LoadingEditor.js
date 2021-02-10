define(["require", "exports", "jassi/ui/Textbox", "jassi/ui/PropertyEditors/Editor"], function (require, exports, Textbox_1, Editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoadingEditor = void 0;
    class LoadingEditor extends Editor_1.Editor {
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
                _this._editor.ob = _this.ob;
                _this.component = _this._editor.component;
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
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
    }
    exports.LoadingEditor = LoadingEditor;
});
//# sourceMappingURL=LoadingEditor.js.map