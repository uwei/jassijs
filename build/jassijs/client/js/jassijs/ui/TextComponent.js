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
    exports.TextComponent = void 0;
    let TextComponent = class TextComponent extends Component_1.Component {
        constructor(props = {}) {
            super(props);
        }
        config(props, forceRender = false) {
            if (this.dom === undefined) {
                this.init(document.createTextNode(props === null || props === void 0 ? void 0 : props.text), { noWrapper: true });
            }
            super.config(props, forceRender);
            return this;
        }
        get text() {
            var _a;
            return (_a = this.dom) === null || _a === void 0 ? void 0 : _a.textContent;
        }
        ;
        set text(value) {
            // var p = JSON.parse(value);//`{"a":"` + value + '"}').a;
            this.dom.textContent = value;
        }
        ;
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], TextComponent.prototype, "text", null);
    TextComponent = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.TextComponent"),
        __metadata("design:paramtypes", [Object])
    ], TextComponent);
    exports.TextComponent = TextComponent;
});
//# sourceMappingURL=TextComponent.js.map