var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Button"], function (require, exports, Registry_1, Component_1, Button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog1 = void 0;
    let Dialog1 = class Dialog1 extends Component_1.Component {
        constructor(props = {}) {
            super(props);
        }
        render() {
            return (0, Component_1.jc)("div", { children: [
                    this.state.sampleProp,
                    (0, Component_1.jc)(Button_1.Button)
                ], ref: this.refs.sdf });
        }
    };
    Dialog1 = __decorate([
        (0, Registry_1.$Class)("demo/Dialog1"),
        __metadata("design:paramtypes", [Object])
    ], Dialog1);
    exports.Dialog1 = Dialog1;
    async function test() {
        var ret = new Dialog1({ sampleProp: "jj" });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog1.js.map