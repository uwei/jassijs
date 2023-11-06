var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs_report/RComponent", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs_report/RText"], function (require, exports, RComponent_1, Registry_1, Property_1, RText_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RSimpleText = void 0;
    let RSimpleText = class RSimpleText extends RText_1.RText {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.textNode = document.createTextNode("");
            super.init(this.text, { noWrapper: true });
        }
        get value() {
            /* var el = this.dom.children[0];
             if (el === undefined)
                 return "";
             var ret = el.innerHTML;
             */
            return this.text.textContent;
        }
        set value(code) {
            this.textNode.textContent = code;
            /*  var el: any = this.dom.children[0];
              if (el === undefined) {
                  el = document.createTextNode(code);
                  this.dom.appendChild(el);
              } else
                  el.innerHTML=code;*/
        }
        fromJSON(ob) {
            return undefined;
        }
        toJSON() {
            return this.textNode.textContent;
        }
    };
    RSimpleText = __decorate([
        (0, RComponent_1.$ReportComponent)({}),
        (0, Registry_1.$Class)("jassijs_report.RSimpleText")
        //@$Property({hideBaseClassProperties:true})
        ,
        (0, Property_1.$Property)({ name: "value", type: "string", description: "text" }),
        __metadata("design:paramtypes", [Object])
    ], RSimpleText);
    exports.RSimpleText = RSimpleText;
});
//# sourceMappingURL=RSimpleText.js.map