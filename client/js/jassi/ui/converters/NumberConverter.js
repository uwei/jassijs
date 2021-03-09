var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/converters/DefaultConverter", "jassi/remote/Jassi", "jassi/ui/Property"], function (require, exports, DefaultConverter_1, Jassi_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberConverter = void 0;
    let NumberConverter = 
    //@$Property({name:"new/min",type:"number",default:undefined})
    //@$Property({name:"new/max",type:"number",default:undefined})
    class NumberConverter extends DefaultConverter_1.DefaultConverter {
        constructor(param = {}) {
            super();
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            if (str === undefined || str === "")
                return undefined;
            return Number(str);
        }
        /**
         * converts an object to string
         * @param {string} obj - the object to convert
         */
        objectToString(obj) {
            if (obj === undefined)
                return undefined;
            return obj.ToString();
        }
    };
    NumberConverter = __decorate([
        DefaultConverter_1.$Converter({ name: "number" }),
        Jassi_1.$Class("jassi.ui.converters.NumberConverter"),
        Property_1.$Property({ name: "new", type: "json" })
        //@$Property({name:"new/min",type:"number",default:undefined})
        //@$Property({name:"new/max",type:"number",default:undefined})
        ,
        __metadata("design:paramtypes", [Object])
    ], NumberConverter);
    exports.NumberConverter = NumberConverter;
});
//# sourceMappingURL=NumberConverter.js.map