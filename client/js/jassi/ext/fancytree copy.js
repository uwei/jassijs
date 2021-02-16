//Hack for jquery.fancytree.dnd
define("jquery-ui/ui/widgets/draggable", function () {
    return jQuery.ui;
});
define("jquery-ui/ui/widgets/droppable", function () {
    return jQuery.ui;
});
//END Hack
requirejs.config({
    paths: {
        'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
        "jquery.fancytree.ui-deps": '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.ui-deps',
        'jquery.fancytree.filter': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.filter',
        'jquery.fancytree.multi': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.multi',
        'jquery.fancytree.dnd': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.dnd',
    },
    shim: {
        'jquery.fancytree': ["jquery", "jquery.ui"],
        'jquery.fancytree.dnd': ["jquery", "jquery.ui"],
    }
});
define("jassi/ext/fancytree", ["jassi/remote/Jassi", "jquery.fancytree", 'jquery.fancytree.filter', 'jquery.fancytree.multi', 'jquery.fancytree.dnd'], function () {
    //jassi.myRequire("lib/skin-win8/ui.fancytree.min.css");
    jassi.myRequire("//cdn.jsdelivr.net/npm/jquery.fancytree@2.35.0/dist/skin-win8/ui.fancytree.css");
    return { default: "" };
});
//# sourceMappingURL=fancytree%20copy.js.map