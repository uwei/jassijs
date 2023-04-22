define(["require", "exports", "jquery", "jquery.notify"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.notifyAddStyle = exports.notify = void 0;
    //@ts-ignore
    $.notify.defaults({ position: "bottom right", className: "info" });
    function notify(text, style, options = undefined) {
        //@ts-ignore
        $.notify(text, style, options);
    }
    exports.notify = notify;
    function notifyAddStyle(style, options) {
        //@ts-ignore
        $.notify.addStyle(style, options);
    }
    exports.notifyAddStyle = notifyAddStyle;
});
//# sourceMappingURL=Notify.js.map