var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Jassi_1, Component_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Button = void 0;
    let Button = class Button extends Component_1.Component {
        constructor() {
            super();
            super.init($('<button class="Button" id="dummy" contenteditable=false><span class="buttonspan"><img style="display: none" class="buttonimg"></img></span><span class="buttontext" > </span></button>')[0]);
        }
        /**
        * register an event if the button is clicked
        * @param {function} handler - the function that is called on change
        */
        onclick(handler, removeOldHandler = true) {
            if (removeOldHandler) {
                this.off("click");
            }
            return this.on("click", handler);
            /*        if (removeOldHandler)
                        $("#" + this._id).prop("onclick", null).off("click");
                    $("#" + this._id).click(function (ob) {
                        handler(ob);
                    });*/
        }
        /**
        * @member {string} - the icon of the button
        */
        set icon(icon) {
            var img;
            var el1 = $(this.dom).find(".buttonspan");
            el1.removeClass();
            el1.addClass("buttonspan");
            $(this.dom).find(".buttonimg").attr("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi")) {
                el1.addClass(icon);
                $(this.dom).find(".buttonimg").css("display", "none");
            }
            else {
                $(this.dom).find(".buttonimg").css("display", "initial");
                $(this.dom).find(".buttonimg").attr("src", icon);
            }
        }
        get icon() {
            var ret = $(this.dom).find(".buttonimg").attr("src");
            if (ret === "") {
                ret = $(this.dom).find(".buttonspan").attr("class").replace("buttonspan ", "");
            }
            return ret;
        }
        /**
         * @member {string} - the caption of the button
         */
        set text(value) {
            $(this.dom).find(".buttontext").html(value);
        }
        get text() {
            return $(this.dom).find(".buttontext").text();
        }
        toggle(setDown = undefined) {
            if (setDown === undefined) {
                $(this.dom).toggleClass("down");
                return $(this.dom).hasClass("down");
            }
            else {
                if (setDown && !$(this.dom).hasClass("down"))
                    $(this.dom).toggleClass("down");
                if (!setDown && $(this.dom).hasClass("down"))
                    $(this.dom).toggleClass("down");
                return $(this.dom).hasClass("down");
            }
        }
    };
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], Button.prototype, "onclick", null);
    __decorate([
        (0, Property_1.$Property)({ type: "image" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Button.prototype, "icon", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Button.prototype, "text", null);
    Button = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } }),
        (0, Jassi_1.$Class)("jassijs.ui.Button"),
        __metadata("design:paramtypes", [])
    ], Button);
    exports.Button = Button;
    async function test() {
        var Panel = (await (new Promise((resolve_1, reject_1) => { require(["jassijs/ui/Panel"], resolve_1, reject_1); }))).Panel;
        var pan = new Panel();
        var but = new Button();
        but.text = "Hallo";
        but.styleToggle = true;
        but.icon = "mdi mdi-car"; //"mdi mdi-car";//"res/red.jpg";
        but.onclick(() => alert(1));
        //alert(but.icon);
        pan.add(but);
        pan.width = 100;
        pan.height = 100;
        return pan;
    }
    exports.test = test;
});
//# sourceMappingURL=Button.js.map