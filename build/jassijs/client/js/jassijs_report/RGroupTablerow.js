var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs_report/RTablerow", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, RTablerow_1, Registry_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RGroupTablerow = void 0;
    //@$ReportComponent({ editableChildComponents: ["this"] })
    let RGroupTablerow = class RGroupTablerow extends RTablerow_1.RTablerow {
        get expression() {
            var _a, _b, _c;
            var pos = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.groupFooterPanel.indexOf(this);
            if (pos === -1)
                pos = (_b = this.parent) === null || _b === void 0 ? void 0 : _b.groupHeaderPanel.indexOf(this);
            if (pos === -1)
                return undefined;
            return (_c = this.parent) === null || _c === void 0 ? void 0 : _c.groupExpression[pos];
        }
        set expression(value) {
            var _a, _b;
            var pos = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.groupFooterPanel.indexOf(this);
            if (pos === -1)
                pos = (_b = this.parent) === null || _b === void 0 ? void 0 : _b.groupHeaderPanel.indexOf(this);
            if (pos === -1)
                return;
            this.parent.groupExpression[pos] = value;
        }
        get _editorselectthis() {
            return this;
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RGroupTablerow.prototype, "expression", null);
    RGroupTablerow = __decorate([
        (0, Registry_1.$Class)("jassijs_report.RTablerow")
        //@$Property({name:"horizontal",hide:true})
    ], RGroupTablerow);
    exports.RGroupTablerow = RGroupTablerow;
});
//# sourceMappingURL=RGroupTablerow.js.map