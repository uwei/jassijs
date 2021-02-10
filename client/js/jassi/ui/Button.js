var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "remote/jassi/base/Jassi", "jassi/ui/Component", "jassi/ui/Property"], function (require, exports, Jassi_1, Component_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Button = void 0;
    let Button = class Button extends Component_1.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            super.init($('<button class="Button" id="dummy" contenteditable=false><span class="element1"></span><span class="element2" > </span></button>')[0]);
        }
        /**
        * register an event if the button is clicked
        * @param {function} handler - the function that is called on change
        */
        onclick(handler, removeOldHandler = true) {
            if (removeOldHandler)
                $("#" + this._id).prop("onclick", null).off("click");
            $("#" + this._id).click(function (ob) {
                handler(ob);
            });
        }
        /**
        * @member {string} - the icon of the button
        */
        set icon(icon) {
            var img;
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi")) {
                img = $('<span >')[0];
                $(img).removeClass();
                $(img).addClass(icon);
            }
            else {
                img = $('<img vspace="0" hspace="0"  border="0"  src="" alt="">')[0];
                $(img).attr("src", icon);
            }
            var dompic = $(this.dom).find(".element1")[0];
            if (dompic.children.length === 1)
                dompic.removeChild(dompic.children[0]);
            dompic.appendChild(img);
        }
        get icon() {
            var dompic = $(this.dom).find(".element1")[0];
            if (dompic.children.length === 1)
                return "";
            return ($(this.dom).find(".element1")).attr("class");
        }
        /**
         * @member {string} - the caption of the button
         */
        set text(value) {
            $(this.dom).find(".element2").html(value);
        }
        get text() {
            return $(this.dom).find(".element2").text();
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
        Property_1.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], Button.prototype, "onclick", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Button.prototype, "icon", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Button.prototype, "text", null);
    Button = __decorate([
        Component_1.$UIComponent({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } }),
        Jassi_1.$Class("jassi.ui.Button"),
        __metadata("design:paramtypes", [])
    ], Button);
    exports.Button = Button;
});
//# sourceMappingURL=Button.js.map