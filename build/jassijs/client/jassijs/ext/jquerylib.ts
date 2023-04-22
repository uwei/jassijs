import "jquery";
import "jquery.ui";
import "jquery.ui.touch";

jassijs.includeCSSFile("jquery-ui.css");

define("../widgets/datepicker", [], function () {
    return $.datepicker;

});
requirejs(['jquery.language'], function () {
    $.datepicker.setDefaults($.datepicker.regional[navigator.language.split("-")[0]]);
});
