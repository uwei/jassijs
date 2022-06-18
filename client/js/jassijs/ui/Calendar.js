var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jquery"], function (require, exports, Textbox_1, Component_1, Registry_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Calendar = void 0;
    let Calendar = class Calendar extends Textbox_1.Textbox {
        constructor(properties = undefined) {
            super(properties);
            $(this.dom).datepicker();
        }
        config(config) {
            super.config(config);
            return this;
        }
        get value() {
            return $(this.dom).datepicker('getDate');
        }
        set value(val) {
            $(this.dom).datepicker('setDate', val);
        }
        static parseDate(date, format = undefined, settings = undefined) {
            if (settings === undefined)
                settings = $.datepicker.regional[navigator.language.split("-")[0]];
            if (format === undefined)
                format = settings.dateFormat;
            return $.datepicker.parseDate(format, date, settings);
        }
        static formatDate(date, format = undefined, settings = undefined) {
            if (settings === undefined)
                settings = $.datepicker.regional[navigator.language.split("-")[0]];
            if (format === undefined)
                format = settings.dateFormat;
            return $.datepicker.formatDate(format, date, settings);
        }
    };
    Calendar = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/Calendar", icon: "mdi mdi-calendar-month" }),
        (0, Registry_1.$Class)("jassijs.ui.Calendar"),
        (0, Property_1.$Property)({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [Object])
    ], Calendar);
    exports.Calendar = Calendar;
    function test() {
        var cal = new Calendar();
        cal.value = new Date(1978, 5, 1);
        var h = Calendar.parseDate("18.03.2020");
        var hh = Calendar.formatDate(h);
        var i = cal.value;
        // cal.value=Date.now()
        return cal;
    }
    exports.test = test;
});
//# sourceMappingURL=Calendar.js.map