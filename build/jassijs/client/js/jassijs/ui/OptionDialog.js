var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/ui/BoxPanel", "jassijs/ui/HTMLPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/Textbox", "jassijs/remote/Classes", "jassijs/ext/jquerylib"], function (require, exports, Panel_1, BoxPanel_1, HTMLPanel_1, Button_1, Registry_1, Property_1, Textbox_1, Classes_1) {
    "use strict";
    var OptionDialog_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.OptionDialog = void 0;
    class Me {
    }
    let OptionDialog = OptionDialog_1 = class OptionDialog extends Panel_1.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.parentComponent = undefined;
            this.text = "";
            this.options = [];
            this.selectedOption = "cancel";
            /* @member {string} - the text for the Dialog*/
        }
        layout() {
            var me = this.me = {};
            var _this = this;
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.buttons = new BoxPanel_1.BoxPanel();
            me.buttons.horizontal = true;
            me.htmlpanel1.value = this.text;
            this.add(me.boxpanel1);
            this.add(me.buttons);
            me.htmlpanel1.value = "";
            me.boxpanel1.add(me.htmlpanel1);
            me.boxpanel1.width = "100%";
            me.boxpanel1.height = "calc(100% - 50px)";
            me.inputText = new Textbox_1.Textbox();
            me.boxpanel1.add(me.inputText);
            for (var x = 0; x < this.options.length; x++) {
                var button = new Button_1.Button();
                me.buttons.add(button);
                button.onclick(function (evt) {
                    _this.selectedOption = evt.currentTarget._this.text;
                    $(_this.dom).dialog("close");
                });
                button.text = this.options[x];
            }
        }
        /**
        * ask for properties in propertygrid
        * @param text - the text to be displayed
        * @param  properties - the properties which should be filled, marked by @$Property
        * @param  options - the options e.g ["ok","Cancel"]
        * @param parent - the parent component
        * @param modal - display the dialog modal
        */
        static async askProperties(text, properties, options, parent = undefined, modal = false) {
            return await OptionDialog_1._show(text, options, parent, modal, undefined, properties);
        }
        /**
        * @param text - the text to be displayed
        * @param  options - the options
        * @param parent - the parent component
        * @param modal - display the dialog modal
        * @param  inputDefaultText - if the user should input something
        *
        */
        static async show(text, options, parent = undefined, modal = false, inputDefaultText = undefined) {
            return await OptionDialog_1._show(text, options, parent, modal, inputDefaultText);
        }
        static async _show(text, options, parent, modal, inputDefaultText = undefined, properties = undefined) {
            var ret = new OptionDialog_1();
            var config = {};
            ret.options = options;
            ret.layout();
            if (properties !== undefined) {
                var PropertyEditor = await Classes_1.classes.loadClass("jassijs.ui.PropertyEditor");
                ret.me.propertyEditor = new PropertyEditor(undefined);
                ret.me.propertyEditor.width = "100%";
                ret.me.propertyEditor.height = "100%";
                ret.me.boxpanel1.add(ret.me.propertyEditor);
                ret.me.propertyEditor.value = properties;
                //config.width = "400";
                config.height = "400";
            }
            var promise = new Promise(function (resolve, reject) {
                ret.me.htmlpanel1.value = text;
                if (inputDefaultText === undefined) {
                    ret.me.boxpanel1.remove(ret.me.inputText);
                    ret.me.inputText.destroy();
                }
                else {
                    ret.me.inputText.value = inputDefaultText;
                }
                config.beforeClose = function (event, ui) {
                    resolve({ button: ret.selectedOption, text: ret.me.inputText.value, properties: properties });
                };
                if (modal)
                    config.modal = modal;
                if (parent !== undefined)
                    config.appendTo = "#" + parent._id;
                var dlg = $(ret.dom).dialog(config);
            });
            return await promise;
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String)
    ], OptionDialog.prototype, "text", void 0);
    OptionDialog = OptionDialog_1 = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.OptionDialog"),
        __metadata("design:paramtypes", [Object])
    ], OptionDialog);
    exports.OptionDialog = OptionDialog;
    let Testprop = class Testprop {
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean)
    ], Testprop.prototype, "visible", void 0);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String)
    ], Testprop.prototype, "text", void 0);
    Testprop = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.OptionDialogTestProp")
    ], Testprop);
    async function test2() {
        var tet = await OptionDialog.show("Should I ask?", ["yes", "no"], undefined, false);
        if (tet.button === "yes") {
            var age = await OptionDialog.show("Whats yout age?", ["ok", "cancel"], undefined, false, "18");
            if (age.button === "ok")
                console.log(age.text);
            var prop = new Testprop();
            var ret2 = await OptionDialog.askProperties("Please fill:", prop, ["ok", "cancel"]);
        }
        //var ret=new jassijs.ui.Dialog();
        //return ret;
    }
    exports.test2 = test2;
    ;
});
//# sourceMappingURL=OptionDialog.js.map