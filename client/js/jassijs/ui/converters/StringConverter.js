var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, DefaultConverter_1, Registry_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StringConverter = void 0;
    let StringConverterProperties = class StringConverterProperties {
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Number)
    ], StringConverterProperties.prototype, "minChars", void 0);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Number)
    ], StringConverterProperties.prototype, "maxChars", void 0);
    StringConverterProperties = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.converters.StringConverterProperies")
    ], StringConverterProperties);
    let StringConverter = class StringConverter extends DefaultConverter_1.DefaultConverter {
        constructor(props) {
            super();
            this.minChars = props === null || props === void 0 ? void 0 : props.minChars;
            this.maxChars = props === null || props === void 0 ? void 0 : props.maxChars;
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            return str;
        }
        /**
         * converts an object to string
         * @param {string} obj - the object to convert
         */
        objectToString(obj) {
            return (obj === null || obj === void 0 ? void 0 : obj.toString()) + this.maxChars;
        }
    };
    StringConverter = __decorate([
        (0, DefaultConverter_1.$Converter)({ name: "string" }),
        (0, Registry_1.$Class)("jassijs.ui.converters.StringConverter"),
        (0, Property_1.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.converters.StringConverterProperies" })
        //@$Property({ name: "new/minChars", type: "number", default: undefined })
        //@$Property({ name: "new/maxChars", type: "number", default: undefined })
        ,
        __metadata("design:paramtypes", [StringConverterProperties])
    ], StringConverter);
    exports.StringConverter = StringConverter;
});
//# sourceMappingURL=StringConverter.js.map