var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/ui/DataComponent"], function (require, exports, Registry_1, Component_1, Property_1, DataComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Checkbox = void 0;
    let Checkbox = class Checkbox extends DataComponent_1.DataComponent {
        /* get dom(){
             return this.dom;
         }*/
        constructor(properties = {}) {
            super(properties);
            //super.init('<div><input type="checkbox"><span class="checkboxtext" style="width:100%"></span></div>');
        }
        componentDidMount() {
            this.checkbox = this.dom.firstChild;
        }
        render() {
            //this.checkbox={current:undefined}
            return React.createElement("div", {}, React.createElement("input", Object.assign(Object.assign({}, this.props.domProperties), { type: "checkbox" }), React.createElement("span", {
                className: "checkboxtext",
                style: {
                    width: "100%"
                }
            })));
        }
        config(config) {
            super.config(config);
            return this;
        }
        onclick(handler) {
            this.on("click", function () {
                handler();
            });
        }
        set value(value) {
            if (value === "true")
                value = true;
            if (value === "false")
                value = false;
            this.checkbox.checked = value;
        }
        get value() {
            return this.checkbox.checked;
        }
        set text(value) {
            this.domWrapper.querySelector(".checkboxtext").innerHTML = value === undefined ? "" : value;
        }
        get text() {
            return this.domWrapper.querySelector(".checkboxtext").innerHTML;
        }
    };
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Checkbox.prototype, "onclick", null);
    __decorate([
        (0, Property_1.$Property)({ type: "boolean" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Checkbox.prototype, "value", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Checkbox.prototype, "text", null);
    Checkbox = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/Ceckbox", icon: "mdi mdi-checkbox-marked-outline" }),
        (0, Registry_1.$Class)("jassijs.ui.Checkbox"),
        __metadata("design:paramtypes", [Object])
    ], Checkbox);
    exports.Checkbox = Checkbox;
    function test() {
        var cb = new Checkbox();
        cb.label = "label";
        cb.value = true;
        return cb;
    }
    exports.test = test;
});
//# sourceMappingURL=Checkbox.js.map