define("jassijs/ext/jquerylib", [
    "jquery",
    "jquery.ui"
], function (require) {
    jassijs.includeCSSFile("jquery-ui.css");
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