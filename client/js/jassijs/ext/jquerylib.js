define(["require", "exports", "jquery", "jquery.ui", "jquery.ui.touch"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jassijs.includeCSSFile("jquery-ui.css");
    define("../widgets/datepicker", [], function () {
        return $.datepicker;
    });
    requirejs(['jquery.language'], function () {
        $.datepicker.setDefaults($.datepicker.regional[navigator.language.split("-")[0]]);
    });
});
//# sourceMappingURL=jquerylib.js.map