var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/base/Actions", "../Component", "jassijs/ext/jquerylib"], function (require, exports, Editor_1, Registry_1, Panel_1, Textbox_1, Button_1, Actions_1, Component_1) {
    "use strict";
    var ImageEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.ImageEditor = void 0;
    let ImageEditor = ImageEditor_1 = class ImageEditor extends Editor_1.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_1.Panel( /*{useSpan:true}*/);
            this._button = new Button_1.Button();
            this._textbox = new Textbox_1.Textbox();
            this._textbox.width = "calc(100% - 34px)";
            this.component.height = 24;
            this._button.icon = "mdi mdi-glasses";
            this.component.add(this._textbox);
            this.component.add(this._button);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange(param);
            });
            this._button.onclick(() => {
                _this.showDialog();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value === null || value === void 0 ? void 0 : value.startsWith('"'))
                value = value.substring(1);
            if (value === null || value === void 0 ? void 0 : value.endsWith('"')) {
                value = value.substring(0, value.length - 1);
            }
            this._textbox.value = value;
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
            if (this.property) {
                this.propertyEditor.setPropertyInCode(this.property.name, '"' + val + '"');
                this.propertyEditor.setPropertyInDesign(this.property.name, val);
            }
            super.callEvent("edit", param);
        }
        static async dummy() {
        }
        static async show() {
            await new ImageEditor_1(undefined, undefined).showDialog();
        }
        async showDialog(onlytest = undefined) {
            if (!this.dialog) {
                var _this = this;
                this.dialog = new Panel_1.Panel();
                var suche = new Textbox_1.Textbox();
                var icons = new Panel_1.Panel();
                this.dialog.add(suche);
                this.dialog.add(icons);
                suche.onchange((data) => {
                    var su = suche.value;
                    for (var x = 0; x < icons.dom.children[0].children.length; x++) {
                        var ic = icons.dom.children[0].children[x];
                        if (ic.className.indexOf(su) > -1) {
                            ic.setAttribute("style", "display:inline");
                        }
                        else
                            ic.setAttribute("style", "display:none");
                    }
                });
                var file = (await new Promise((resolve_1, reject_1) => { require(["jassijs/modul"], resolve_1, reject_1); })).default.css["materialdesignicons.min.css"] + "?ooo=9";
                var text = await $.ajax({ method: "get", url: file, crossDomain: true, contentType: "text/plain" });
                var all = text.split("}.");
                var html = "";
                window["ImageEditorClicked"] = function (data) {
                    _this._textbox.value = "mdi " + data;
                    suche.value = data;
                    _this._onchange();
                };
                var len = onlytest ? 20 : all.length;
                for (var x = 1; x < len; x++) {
                    var icon = all[x].split(":")[0];
                    html = html + "<span title='" + icon + "' onclick=ImageEditorClicked('" + icon + "') class='mdi " + icon + "'></span>";
                }
                var node = Component_1.Component.createHTMLElement("<span style='font-size:18pt'>" + html + "</span>");
                icons.__dom.appendChild(node);
                if (!onlytest)
                    $(this.dialog.__dom).dialog({ height: "400", width: "400" });
            }
            else {
                $(this.dialog.__dom).dialog("open");
            }
        }
    };
    __decorate([
        (0, Actions_1.$Action)({
            name: "Tools",
            icon: "mdi mdi-tools",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImageEditor, "dummy", null);
    __decorate([
        (0, Actions_1.$Action)({
            name: "Tools/Icons",
            icon: "mdi mdi-image-area",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImageEditor, "show", null);
    ImageEditor = ImageEditor_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Editor_1.$PropertyEditor)(["image"]),
        (0, Registry_1.$Class)("jassijs.ui.PropertyEditors.ImageEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ImageEditor);
    exports.ImageEditor = ImageEditor;
    function test2() {
        var ed = new ImageEditor(undefined, undefined);
        ed.showDialog(true);
        return ed.dialog;
    }
    exports.test2 = test2;
});
//# sourceMappingURL=ImageEditor.js.map