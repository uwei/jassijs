var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/util/Numberformatter"], function (require, exports, DefaultConverter_1, Registry_1, Property_1, Numberformatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberConverter = void 0;
    let allFormats = (() => {
        var ret = [];
        const format = new Intl.NumberFormat();
        var decimal = format.format(1.1).substring(1, 2);
        var group = format.format(1234).substring(1, 2);
        /*	const parts = format.formatToParts(1234.6);
                var decimal = ".";
            var group=",";
            parts.forEach(p => {
                if (p.type === "decimal")
                    decimal = p.value;
                if (p.type === "group")
                    group = p.value;
            });*/
        ret.push("#" + group + "##0" + decimal + "00");
        ret.push("#" + group + "##0" + decimal + "00 €");
        ret.push("#" + group + "##0" + decimal + "00 $");
        ret.push("0");
        ret.push("0" + decimal + "00");
        return ret;
    })();
    let NumberConverterProperties = class NumberConverterProperties {
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Number)
    ], NumberConverterProperties.prototype, "min", void 0);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Number)
    ], NumberConverterProperties.prototype, "max", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "string", chooseFrom: allFormats }),
        __metadata("design:type", String)
    ], NumberConverterProperties.prototype, "format", void 0);
    NumberConverterProperties = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.converters.NumberConverterProperies")
    ], NumberConverterProperties);
    let NumberConverter = class NumberConverter extends DefaultConverter_1.DefaultConverter {
        constructor(props) {
            super();
            this.min = props === null || props === void 0 ? void 0 : props.min;
            this.max = props === null || props === void 0 ? void 0 : props.max;
            this.format = props === null || props === void 0 ? void 0 : props.format;
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            if (str === undefined || str === "")
                return undefined;
            return Numberformatter_1.Numberformatter.stringToNumber(str);
        }
        /**
         * converts an object to string
         * @param  obj - the object to convert
         */
        objectToString(obj) {
            if (obj === undefined)
                return undefined;
            return Numberformatter_1.Numberformatter.numberToString(obj);
        }
        objectToFormatedString(obj) {
            return Numberformatter_1.Numberformatter.format(this.format, obj);
        }
    };
    NumberConverter = __decorate([
        (0, DefaultConverter_1.$Converter)({ name: "number" }),
        (0, Registry_1.$Class)("jassijs.ui.converters.NumberConverter"),
        (0, Property_1.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.converters.NumberConverterProperies" }),
        __metadata("design:paramtypes", [NumberConverterProperties])
    ], NumberConverter);
    exports.NumberConverter = NumberConverter;
});
//# sourceMappingURL=NumberConverter.js.map