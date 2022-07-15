var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/DefaultConverter", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/Textbox", "luxon"], function (require, exports, DefaultConverter_1, Registry_1, Property_1, Textbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DateTimeConverter = void 0;
    let DateTimeConverterProperties = class DateTimeConverterProperties {
    };
    __decorate([
        (0, Property_1.$Property)({ type: "string", chooseFrom: ["date", "time", "datetime", "timeseconds", "datetimeseconds"] }),
        __metadata("design:type", String)
    ], DateTimeConverterProperties.prototype, "type", void 0);
    DateTimeConverterProperties = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.converters.DateTimeConverterProperies")
    ], DateTimeConverterProperties);
    let DateTimeConverter = class DateTimeConverter extends DefaultConverter_1.DefaultConverter {
        constructor(props) {
            super();
            this.type = (props === null || props === void 0 ? void 0 : props.type) === undefined ? "date" : props === null || props === void 0 ? void 0 : props.type;
        }
        get component() {
            return super.component;
        }
        set component(component) {
            super.component = component;
            if (this.type === "date") {
                component.dom.setAttribute("type", "date");
            }
            if (this.type === "time" || this.type === "timeseconds") {
                component.dom.setAttribute("type", "time");
            }
            if (this.type === "timeseconds") {
                component.dom.setAttribute("step", "2");
            }
            if (this.type === "datetime" || this.type === "datetimeseconds") {
                component.dom.setAttribute("type", "datetime-local");
            }
            if (this.type === "datetimeseconds") {
                component.dom.setAttribute("step", "2");
            }
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            if (str === undefined || str === "")
                return undefined;
            var ret;
            if (this.type === "date" || this.type === undefined) {
                ret = luxon.DateTime.fromFormat(str, 'yyyy-MM-dd');
            }
            else if (this.type === "datetime") {
                ret = luxon.DateTime.fromFormat(str, "yyyy-MM-dd\'T\'HH:mm");
            }
            else if (this.type === "time") {
                ret = luxon.DateTime.fromFormat(str, 'HH:mm');
            }
            else if (this.type === "datetimeseconds") {
                ret = luxon.DateTime.fromFormat(str, "yyyy-MM-dd\'T\'HH:mm:ss");
            }
            else if (this.type === "timeseconds") {
                ret = luxon.DateTime.fromFormat(str, 'HH:mm:ss');
            }
            return ret.toJSDate();
            // return Numberformatter.stringToNumber(str);
        }
        /**
         * converts an object to string
         * @param  obj - the object to convert
         */
        objectToString(obj) {
            if (obj === undefined)
                return undefined;
            var ret;
            if (this.type === "date" || this.type === undefined) {
                ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd");
            }
            else if (this.type === "datetime") {
                ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd\'T\'HH:mm");
            }
            else if (this.type === "time") {
                ret = luxon.DateTime.fromJSDate(obj).toFormat("HH:mm");
            }
            else if (this.type === "datetimeseconds") {
                ret = luxon.DateTime.fromJSDate(obj).toFormat("yyyy-MM-dd\'T\'HH:mm:ss");
            }
            else if (this.type === "timeseconds") {
                ret = luxon.DateTime.fromJSDate(obj).toFormat("HH:mm:ss");
            }
            return ret;
            //        1979-12-31
            //return Numberformatter.numberToString(obj);
        }
    };
    __decorate([
        (0, Property_1.$Property)({ type: "string", chooseFrom: ["date", "time", "datetime", "timeseconds", "datetimeseconds"] }),
        __metadata("design:type", String)
    ], DateTimeConverter.prototype, "type", void 0);
    DateTimeConverter = __decorate([
        (0, DefaultConverter_1.$Converter)({ name: "datetime" }),
        (0, Registry_1.$Class)("jassijs.ui.converters.DateTimeConverter"),
        (0, Property_1.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.converters.DateTimeConverterProperties" }),
        __metadata("design:paramtypes", [DateTimeConverterProperties])
    ], DateTimeConverter);
    exports.DateTimeConverter = DateTimeConverter;
    function test() {
        var tb = new Textbox_1.Textbox();
        tb.converter = new DateTimeConverter({
            type: "datetimeseconds"
        });
        tb.value = new Date(2022, 12, 3, 15, 5);
        return tb;
    }
    exports.test = test;
});
//# sourceMappingURL=DateTimeConverter.js.map