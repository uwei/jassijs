var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Component", "jassi/ui/Property", "remote/jassi/base/Jassi"], function (require, exports, Component_1, Property_1, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Image = void 0;
    let Image = class Image extends Component_1.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            //  var img=$('<div >')[0];
            //super.init($('<img vspace="0" hspace="0"  border="0"  src="" alt="">')[0]);
            super.init($('<span><img vspace="0" hspace="0"  border="0"  src="" alt=""></span>')[0]);
        }
        onclick(handler) {
            $("#" + this._id).click(function () {
                handler();
            });
        }
        /**
        * @member {string} - link to image
        */
        set src(icon) {
            $(this.dom).removeClass();
            $(this.dom.children[0]).attr("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi ")) {
                $(this.dom).addClass(icon);
            }
            else {
                $(this.dom.children[0]).attr("src", icon);
            }
        }
        get src() {
            var ret = $(this.dom).attr("src");
            if (ret === "")
                return $(this.dom).attr('class');
            else
                return ret;
            //            return $(this.dom).attr("src");
        }
    };
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Image.prototype, "src", null);
    Image = __decorate([
        Component_1.$UIComponent({ fullPath: "default/Image", icon: "mdi mdi-file-image" }) //
        ,
        Jassi_1.$Class("jassi.ui.Image"),
        __metadata("design:paramtypes", [])
    ], Image);
    exports.Image = Image;
});
//# sourceMappingURL=Image.js.map