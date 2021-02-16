var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/remote/Registry", "../Property"], function (require, exports, Jassi_1, Registry_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultConverter = exports.$Converter = exports.$ConverterProperties = void 0;
    class $ConverterProperties {
    }
    exports.$ConverterProperties = $ConverterProperties;
    function $Converter(param) {
        return function (pclass) {
            Registry_1.default.register("$Converter", pclass, param);
        };
    }
    exports.$Converter = $Converter;
    let DefaultConverterProperties = class DefaultConverterProperties {
        stringToObject() {
        }
    };
    __decorate([
        Property_1.$Property({ default: "function(ob){}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DefaultConverterProperties.prototype, "stringToObject", null);
    DefaultConverterProperties = __decorate([
        Jassi_1.$Class("jassi.ui.converters.DefaultConverterProperties")
    ], DefaultConverterProperties);
    let DefaultConverter = 
    //@$Property({ name: "new/stringToObject", type: "function", default: "function(ob){}" })
    class DefaultConverter {
        constructor() {
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
            return obj.ToString();
        }
    };
    DefaultConverter = __decorate([
        $Converter({ name: "custom" }),
        Jassi_1.$Class("jassi.ui.converters.DefaultConverter"),
        Property_1.$Property({ name: "new", type: "json", componentType: "jassi.ui.converters.DefaultConverterProperties" })
        //@$Property({ name: "new/stringToObject", type: "function", default: "function(ob){}" })
        ,
        __metadata("design:paramtypes", [])
    ], DefaultConverter);
    exports.DefaultConverter = DefaultConverter;
});
//# sourceMappingURL=DefaultConverter.js.map