var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Button", "jassijs/ui/Table", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Button_1, Table_1, Textbox_1, Registry_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog2 = void 0;
    let Dialog2 = class Dialog2 extends Panel_1.Panel {
        constructor(data) {
            super();
            this.me = {};
            this.data = data;
            this.layout(this.me);
        }
        layout(me) {
            me.boxpanel = new Panel_1.Panel();
            me.button = new Button_1.Button();
            me.button2 = new Button_1.Button();
            me.textbox = new Textbox_1.Textbox();
            me.table = new Table_1.Table({ options: { data: this.data } });
            var _this = this;
            this.config({ children: [
                    me.boxpanel.config({
                        children: [
                            me.button.config({ text: "button", x: 10, y: 50 }),
                            me.button2.config({
                                text: "buw",
                                x: 70,
                                y: 20,
                                icon: "mdi mdi-account-box-outline",
                                onclick: function (event) {
                                    alert(6);
                                }
                            }),
                            me.textbox.config({ value: "ee", label: "s", x: 220, y: 10 }),
                            me.table.config({
                                x: 75,
                                y: 70,
                                width: 290,
                                height: 120,
                                label: "wwwsdwe",
                                onblur: function (event) {
                                },
                                tooltip: "wes"
                            })
                        ],
                        isAbsolute: true,
                        height: 215
                    })
                ] });
        }
    };
    Dialog2 = __decorate([
        (0, Registry_1.$Class)("demo/Dialog2"),
        __metadata("design:paramtypes", [Object])
    ], Dialog2);
    exports.Dialog2 = Dialog2;
    function kk() {
        return "kko";
    }
    async function test() {
        //var data = await Kunde.find();
        //var ret = new Dialog2(data);
        // return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog2.js.map