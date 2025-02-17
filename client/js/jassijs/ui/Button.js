var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Registry_1, Component_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Button = void 0;
    let Button = class Button extends Component_1.Component {
        constructor(properties = {}) {
            super(properties);
        }
        config(config, forceRender = false) {
            super.config(config);
            return this;
        }
        get dom() {
            return super.dom;
        }
        set dom(value) {
            super.dom = value;
        }
        render() {
            return React.createElement("button", Object.assign(Object.assign({}, this.props.domProperties), { className: "Button", contenteditable: false }), React.createElement("span", {
                className: "buttonspan"
            }, React.createElement("img", {
                style: { display: "none" },
                className: "buttonimg"
            }), React.createElement("span", {
                className: "buttontext"
            })));
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
            if (this.dom === undefined || this.dom === null)
                debugger;
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
        destroy() {
            super.destroy();
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
        __metadata("design:paramtypes", [Object])
    ], Button);
    exports.Button = Button;
    async function test() {
        var Panel = (await (new Promise((resolve_1, reject_1) => { require(["jassijs/ui/Panel"], resolve_1, reject_1); }).then(__importStar))).Panel;
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