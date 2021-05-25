var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Button", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/converters/NumberConverter"], function (require, exports, Button_1, Textbox_1, Jassi_1, Panel_1, NumberConverter_1) {
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
            me.button1 = new Button_1.Button();
            this.width = 750;
            this.height = 206;
            this.isAbsolute = false;
            me.textbox1.value = 50000;
            me.textbox1.format = "#.##0,00€";
            me.textbox1.converter = new NumberConverter_1.NumberConverter();
            me.textbox1.onclick(() => {
            });
            me.textbox1.height = 10;
            me.textbox1.width = 135;
            /* let r=()=>{
                 alert(1);
             };
             var a=$(me.textbox1.dom).on("click",r);
             $(me.textbox1.dom).click("click",()=>{
                 alert(2);
             });
             $(me.textbox1.dom).off("click",undefined,a);*/
            /*   me.textbox1.dom.addEventListener('focus', (event) => {
                   $(event.target).val(Numberformatter.numberToString(me.textbox1.value));
               });
       
               me.textbox1.dom.addEventListener('blur', (event) => {
                   $(event.target).val(Numberformatter.stringToNumber($(me.textbox1.dom).val()));
               });*/
            this.add(me.textbox1);
            this.add(me.button1);
            me.button1.text = "button";
            me.button1.onclick(function (event) {
                var test = me.textbox1.value;
                debugger;
            });
        }
    };
    Dialog = __decorate([
        Jassi_1.$Class("de/Dialog"),
        __metadata("design:paramtypes", [])
    ], Dialog);
    exports.Dialog = Dialog;
    async function test() {
        var ret = new Dialog();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog.js.map