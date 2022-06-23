var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Databinder", "jassijs/ui/Upload", "jassijs/ui/Textbox", "jassijs/ui/Image", "jassijs/ui/Button", "jassijs/ui/Repeater", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/PropertyEditors/Editor", "jassijs_report/RComponent", "jassijs/ext/jquerylib"], function (require, exports, Databinder_1, Upload_1, Textbox_1, Image_1, Button_1, Repeater_1, Registry_1, Panel_1, Editor_1, RComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RImageChooser = exports.RImageEditor = void 0;
    let RImageEditor = class RImageEditor extends Editor_1.Editor {
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
        async showDialog(onlytest = undefined) {
            var _this = this;
            if (!this.dialog) {
                this.dialog = new RImageChooser();
                var image = this.ob;
                var report = RComponent_1.RComponent.findReport(image);
                if (report === null || report === void 0 ? void 0 : report.images)
                    this.dialog.items = report.images;
                $(this.dialog.__dom).dialog({ height: "400", width: "400",
                    close: () => {
                        if (report)
                            report.images = _this.dialog.items;
                        _this._onchange();
                    } });
                this.dialog.onpictureselected((val) => {
                    _this._textbox.value = val;
                    if (report)
                        report.images = _this.dialog.items;
                    _this._onchange();
                    $(this.dialog.__dom).dialog("close");
                });
            }
            else {
                $(this.dialog.__dom).dialog("open");
            }
        }
    };
    RImageEditor = __decorate([
        (0, Editor_1.$PropertyEditor)(["rimage"]),
        (0, Registry_1.$Class)("jassi_report/RImagePropertyEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], RImageEditor);
    exports.RImageEditor = RImageEditor;
    class RImageChooser extends Panel_1.Panel {
        constructor() {
            super();
            this._items = [];
            this.me = {};
            this.layout(this.me);
        }
        set items(val) {
            this._items.splice(0, this._items.length);
            for (var key in val) {
                this._items.push({ name: key, data: val[key] });
            }
            this.me.repeater1.value = this._items;
        }
        get items() {
            var ret = {};
            for (var x = 0; x < this._items.length; x++) {
                ret[this._items[x].name] = this._items[x].data;
            }
            return ret;
        }
        onpictureselected(func) {
            this.addEvent("pictureselected", func);
        }
        layout(me) {
            var _this = this;
            me.repeater1 = new Repeater_1.Repeater();
            me.databinder1 = new Databinder_1.Databinder();
            me.databinder1.value = this;
            me.repeater1.value = this._items;
            me.upload1 = new Upload_1.Upload();
            me.upload1.onuploaded((data) => {
                for (var key in data) {
                    _this._items.push({ name: key.split(".")[0], data: data[key] });
                }
                _this.items = _this.items;
            });
            me.upload1.readAs = "DataUrl";
            this.add(me.upload1);
            this.add(me.repeater1);
            me.repeater1.createRepeatingComponent(function (me) {
                me.panel1 = new Panel_1.Panel();
                me.image1 = new Image_1.Image();
                me.itile = new Textbox_1.Textbox();
                me.remove = new Button_1.Button();
                me.repeater1.design.add(me.panel1);
                me.panel1.add(me.itile);
                me.panel1.add(me.remove);
                me.panel1.add(me.image1);
                me.image1.height = "75";
                me.remove.text = "";
                me.remove.icon = "mdi mdi-delete-forever-outline";
                me.itile.bind = [me.repeater1.design.databinder, "name"];
                me.itile.onchange(function (event) {
                    var ob = me.itile._databinder.value;
                    ob.name = me.itile.value;
                    _this.items = _this.items;
                });
                me.image1.bind = [me.repeater1.design.databinder, "data"];
                me.remove.onclick(function (event) {
                    var ob = me.itile._databinder.value;
                    let pos = _this._items.indexOf(ob);
                    _this._items.splice(pos, 1);
                    _this.items = _this.items;
                });
                me.image1.onclick(function (event) {
                    var ob = me.itile._databinder.value;
                    _this.value = ob.name;
                    _this.callEvent("pictureselected", ob.name);
                });
            });
        }
    }
    exports.RImageChooser = RImageChooser;
    async function test() {
        var ret = new RImageChooser();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=RImageEditor.js.map