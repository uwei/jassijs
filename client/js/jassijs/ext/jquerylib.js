define("jassijs/ext/jquerylib", [
    "jquery",
    "jquery.ui",
    "jquery.ui.touch",
    "jquery.doubletap",
    "jquery.notify"
], function (require) {
    jassijs.includeCSSFile("jquery-ui.css");
    $.notify.defaults({ position: "bottom right", className: "info" });
    define("../widgets/datepicker", [], function () {
        return $.datepicker;
    });
    requirejs(['jquery.language'], function () {
        $.datepicker.setDefaults($.datepicker.regional[navigator.language.split("-")[0]]);
    });
    return {
        default: ""
    };
});
//# sourceMappingURL=jquerylib.js.map