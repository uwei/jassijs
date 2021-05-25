define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class NumberParser {
        constructor(locale) {
            const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
            const numerals = [...new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)].reverse();
            const index = new Map(numerals.map((d, i) => [d, i]));
            this._group = new RegExp(`[${parts.find(d => d.type === "group").value}]`, "g");
            this._decimal = new RegExp(`[${parts.find(d => d.type === "decimal").value}]`);
            this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
            this._index = d => index.get(d);
        }
        parse(string) {
            return (string = string.trim()
                .replace(this._group, "")
                .replace(this._decimal, ".")
                .replace(this._numeral, this._index)) ? +string : NaN;
        }
    }
    function test() {
        var hh = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).resolvedOptions();
        console.log(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(55.66));
        var hh2 = new Intl.NumberFormat("de-DE").format(12345678.90, { style: 'currency', currency: "EUR" });
        var ll = new NumberParser("de").parse("500 €");
    }
    exports.test = test;
});
//# sourceMappingURL=NumberFormat.js.map