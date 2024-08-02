var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Registry"], function (require, exports, Component_1, Property_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataComponent = void 0;
    var tmpDatabinder = undefined;
    let DataComponent = class DataComponent extends Component_1.Component {
        /**
        * base class for each Component
        * @class jassijs.ui.Component
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = {}) {
            super(properties);
            this._autocommit = false;
        }
        get autocommit() {
            return this._autocommit;
        }
        set autocommit(value) {
            this._autocommit = value;
            //if (this._databinder !== undefined)
            //    this._databinder.checkAutocommit(this);
        }
        get bind() {
            return this._boundProperty;
        }
        /**
         * @param [databinder:jassijs.ui.Databinder,"propertyToBind"]
         */
        set bind(boundProperty) {
            this._boundProperty = boundProperty;
            if (boundProperty === undefined) {
                if (boundProperty._databinder !== undefined) {
                    boundProperty._databinder.remove(this);
                }
                return;
            }
            var property = boundProperty._propertyname;
            if (this._boundProperty !== undefined)
                this._boundProperty._databinder.add(property, this, "onchange");
        }
        /*  rerender(){
               if (this._databinder !== undefined) {
                  this._databinder.remove(this);
                  this._databinder = undefined;
              }
              super.rerender();
          }*/
        destroy() {
            var _a, _b;
            if (((_a = this._boundProperty) === null || _a === void 0 ? void 0 : _a._databinder) !== undefined) {
                (_b = this._boundProperty) === null || _b === void 0 ? void 0 : _b._databinder.remove(this);
            }
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)({ type: "databinder" }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], DataComponent.prototype, "autocommit", null);
    __decorate([
        (0, Property_1.$Property)({ type: "databinder" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DataComponent.prototype, "bind", null);
    DataComponent = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.DataComponent"),
        __metadata("design:paramtypes", [Object])
    ], DataComponent);
    exports.DataComponent = DataComponent;
});
//# sourceMappingURL=DataComponent.js.map