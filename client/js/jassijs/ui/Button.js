var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Registry_1, Component_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Button = void 0;
    let Button = class Button extends Component_1.Component {
        constructor() {
            super();
            super.init('<button class="Button" id="dummy" contenteditable=false><span class="buttonspan"><img style="display: none" class="buttonimg"></img></span><span class="buttontext" > </span></button>');
        }
        config(config) {
            super.config(config);
            return this;
        }
        get dom() {
            return super.dom;
        }
        set dom(value) {
            super.dom = value;
        }
        onclick(handler, removeOldHandler = true) {
            if (removeOldHandler) {
                this.off("click");
            }
            return this.on("click", handler);
        }
        set icon(icon) {
            var img;
            if (icon === undefined)
                icon = "";
            var el1 = this.dom.querySelector(".buttonspan");
            el1.classList.forEach((cl) => { el1.classList.remove(cl); });
            el1.classList.add("buttonspan");
            this.dom.querySelector(".buttonimg").setAttribute("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi")) {
                icon.split(" ").forEach((cl) => { el1.classList.add(cl); });
                this.dom.querySelector(".buttonimg").style.display = "none";
            }
            else {
                this.dom.querySelector(".buttonimg").style.display = "initial";
                this.dom.querySelector(".buttonimg").setAttribute("src", icon);
            }
        }
        get icon() {
            var ret = this.dom.querySelector(".buttonimg").getAttribute("src");
            if (ret === "") {
                ret = this.dom.querySelector(".buttonspan").getAttribute("class").replace("buttonspan ", "");
            }
            return ret;
        }
        set text(value) {
            this.dom.querySelector(".buttontext").innerText = value === undefined ? "" : value;
        }
        get text() {
            var ret = this.dom.querySelector(".buttontext").innerText;
            if (ret === undefined)
                ret = "";
            return ret;
        }
        toggle(setDown = undefined) {
            if (setDown === undefined) {
                this.dom.classList.contains("down") ? this.dom.classList.remove("down") : this.dom.classList.add("down");
                return this.dom.classList.contains("down");
            }
            else {
                if (setDown && !this.dom.classList.contains("down"))
                    this.dom.classList.contains("down") ? this.dom.classList.remove("down") : this.dom.classList.add("down");
                if (!setDown && this.dom.classList.contains("down"))
                    this.dom.classList.contains("down") ? this.dom.classList.remove("down") : this.dom.classList.add("down");
                return this.dom.classList.contains("down");
            }
        }
    };
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], Button.prototype, "onclick", null);
    __decorate([
        (0, Property_1.$Property)({ type: "image" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Button.prototype, "icon", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Button.prototype, "text", null);
    Button = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } }),
        (0, Registry_1.$Class)("jassijs.ui.Button"),
        __metadata("design:paramtypes", [])
    ], Button);
    exports.Button = Button;
    async function test() {
        var Panel = (await (new Promise((resolve_1, reject_1) => { require(["jassijs/ui/Panel"], resolve_1, reject_1); }))).Panel;
        var pan = new Panel();
        var but = new Button();
        but.text = "Hallo";
        but.icon = "mdi mdi-car"; //"mdi mdi-car";//"res/red.jpg";
        but.onclick(() => alert(1));
        //alert(but.icon);
        pan.add(but);
        pan.width = 100;
        pan.height = 100;
        return pan;
    }
    exports.test = test;
});
//# sourceMappingURL=Button.js.map