var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/BoxPanel", "jassijs/ui/HTMLPanel", "jassijs/ui/Databinder", "jassijs/ui/Textbox", "jassijs/ui/Checkbox", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Component"], function (require, exports, BoxPanel_1, HTMLPanel_1, Databinder_1, Textbox_1, Checkbox_1, Button_1, Registry_1, Panel_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog = void 0;
    let Dialog = class Dialog extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.textbox1 = new Textbox_1.Textbox();
            me.databinder1 = new Databinder_1.Databinder();
            me.panel1 = new Panel_1.Panel();
            me.button1 = new Button_1.Button();
            me.textbox2 = new Textbox_1.Textbox();
            me.htmlpanel = new HTMLPanel_1.HTMLPanel();
            me.checkbox = new Checkbox_1.Checkbox();
            me.button = new Button_1.Button();
            me.button2 = new Button_1.Button();
            me.textbox22 = new Textbox_1.Textbox();
            me.boxpanel = new BoxPanel_1.BoxPanel();
            me.textbox = new Textbox_1.Textbox();
            me.checkbox2 = new Checkbox_1.Checkbox();
            me.databinder1.value = {
                Halo: "Du"
            };
            this.config({
                children: [
                    me.textbox1.config({
                        value: "sadfasdf",
                        label: "asdf",
                        bind: [me.databinder1, "Halo"],
                        width: 95,
                    }),
                    me.databinder1.config({}),
                    me.checkbox.config({}),
                    me.textbox22.config({ width: 180, height: 20 }),
                    me.textbox2.config({ width: 180 }),
                    me.button.config({ text: "button", onclick: () => alert(8) }),
                    me.htmlpanel.config({ value: "dddd<br>" }),
                    me.button2.config({ text: "button", onclick: () => alert(8) }),
                    me.boxpanel.config({ children: [
                            me.checkbox2.config({}),
                            me.textbox.config({})
                        ] }),
                    me.panel1.config({ children: [
                            me.button1.config({ text: "button" })
                        ] })
                ]
            });
            me.textbox1.domWrapper.style.marginRight = "4px";
            me.button.domWrapper.style.marginRight = "4px";
        }
    };
    Dialog = __decorate([
        (0, Registry_1.$Class)("de/Dialog"),
        __metadata("design:paramtypes", [])
    ], Dialog);
    exports.Dialog = Dialog;
    async function test() {
        var ret = new Dialog();
        var nd = Component_1.Component.createHTMLElement("<table><tr><td>hall<button>fdg</button><td>jj</td></tr><tr><td>hall<td>jj</td></tr></table>");
        ret.dom.appendChild(nd);
        ret.dom.contentEditable = "true";
        //  windows.add(ret,"Hall");
        var h = ret.dom.querySelectorAll('input');
        h.forEach((el) => el.style.color = "red");
        h.forEach((el) => el.contentEditable = "false");
        h.forEach((el) => el.setAttribute("draggable", "true"));
        return ret;
        var divMO = new window.MutationObserver(function (e) {
            //    console.log(e);
        });
        divMO.observe(ret.dom, { childList: true, subtree: true, characterData: true });
        //return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog.js.map