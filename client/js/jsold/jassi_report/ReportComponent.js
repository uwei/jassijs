var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Property"], function (require, exports, Component_1, Registry_1, jassijs_1, Panel_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReportComponent = exports.$ReportComponent = exports.ReportComponentProperties = void 0;
    class ReportComponentProperties extends Component_1.UIComponentProperties {
    }
    exports.ReportComponentProperties = ReportComponentProperties;
    function $ReportComponent(properties) {
        return function (pclass) {
            Registry_1.default.register("$ReportComponent", pclass, properties);
        };
    }
    exports.$ReportComponent = $ReportComponent;
    let ReportComponent = class ReportComponent extends Panel_1.Panel {
        constructor() {
            super(...arguments);
            this.reporttype = "nothing";
        }
        get colSpan() {
            /*if(this._parent?.setChildWidth!==undefined)
                return this._parent.getChildWidth(this);
            else
                return this._width;*/
            return this._colSpan;
        }
        set colSpan(value) {
            $(this.domWrapper).attr("colspan", value === undefined ? "" : value);
            /*	if(this._parent?.setChildWidth!==undefined)
                    this._parent.setChildWidth(this,value);
                else{
                    this._width = value;
                    console.log(value);
                    super.width = value;
                }*/
            this._colSpan = value;
            if (this._parent)
                this._parent.correctHideAfterSpan();
        }
        get width() {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) !== undefined)
                return this._parent.getChildWidth(this);
            else
                return this._width;
        }
        set width(value) {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) !== undefined)
                this._parent.setChildWidth(this, value);
            else {
                this._width = value;
                console.log(value);
                super.width = value;
            }
        }
        fromJSON(ob) {
            var ret = this;
            if (ob.foreach) {
                ret.foreach = ob.foreach;
                delete ob.foreach;
            }
            if (ob.colSpan) {
                ret.colSpan = ob.colSpan;
                delete ob.colSpan;
            }
            ret.otherProperties = ob;
            return ret;
        }
        toJSON() {
            var ret = {};
            if (this.colSpan !== undefined)
                ret.colSpan = this.colSpan;
            if (this.foreach !== undefined)
                ret.foreach = this.foreach;
            Object.assign(ret, this["otherProperties"]);
            return ret;
        }
    };
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String)
    ], ReportComponent.prototype, "foreach", void 0);
    __decorate([
        Property_1.$Property({
            type: "string",
            isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], ReportComponent.prototype, "colSpan", null);
    __decorate([
        Property_1.$Property({ type: "string", isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns";
            } }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ReportComponent.prototype, "width", null);
    ReportComponent = __decorate([
        jassijs_1.$Class("jassijs_report.ReportComponent"),
        Property_1.$Property({ hideBaseClassProperties: true })
    ], ReportComponent);
    exports.ReportComponent = ReportComponent;
});
//# sourceMappingURL=ReportComponent.js.map
//# sourceMappingURL=ReportComponent.js.map