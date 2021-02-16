var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/InvisibleComponent", "jassi/ui/Component", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/ui/CSSProperties"], function (require, exports, InvisibleComponent_1, Component_1, Jassi_1, Property_1, CSSProperties_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.Style = void 0;
    let Style = 
    /**
     * on ore mors Style can be assigned to component
     * the style is appended to the head
     **/
    class Style extends InvisibleComponent_1.InvisibleComponent {
        constructor() {
            super();
            super.init($('<span class="InvisibleComponent"></span>')[0]);
        }
        get styleid() {
            return "jassistyle" + this._id;
        }
        /**
        * sets CSS Properties
        */
        css(properties, removeOldProperties = true) {
            //never!super.css(properties,removeOldProperties);
            var style = document.getElementById(this.styleid);
            if (!document.getElementById(this.styleid)) {
                style = $('<style id=' + this.styleid + '></style>')[0];
                document.head.appendChild(style);
            }
            var prop = {};
            var sstyle = "\t." + this.styleid + "{\n";
            for (let key in properties) {
                var newKey = key.replaceAll("_", "-");
                prop[newKey] = properties[key];
                sstyle = sstyle + "\t\t" + newKey + ":" + properties[key] + ";\n";
            }
            sstyle = sstyle + "\t}\n";
            style.innerHTML = sstyle;
        }
        destroy() {
            super.destroy();
            if (document.getElementById(this.styleid)) {
                document.head.removeChild(document.getElementById(this.styleid));
            }
        }
    };
    __decorate([
        Property_1.$Property({ type: "json", componentType: "jassi.ui.CSSProperties" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [CSSProperties_1.CSSProperties, Boolean]),
        __metadata("design:returntype", void 0)
    ], Style.prototype, "css", null);
    Style = __decorate([
        Component_1.$UIComponent({ fullPath: "common/Style", icon: "mdi mdi-virus" }),
        Jassi_1.$Class("jassi.ui.Style")
        /**
         * on ore mors Style can be assigned to component
         * the style is appended to the head
         **/
        ,
        __metadata("design:paramtypes", [])
    ], Style);
    exports.Style = Style;
    function test() {
        var css = {
            filter: "drop-shadow(16px 16px 20px blue)"
        };
        Jassi_1.default.includeCSS("mytest2id", {
            ".Panel": css,
            ".jinlinecomponent": {
                color: "red"
            }
        });
        setTimeout(() => {
            Jassi_1.default.includeCSS("mytest2id", undefined); //remove
        }, 400);
        // includeCSS("mytest2id",undefined);
    }
    exports.test = test;
    function test2() {
        var st = new Style();
        st.css({
            color: "red"
        });
        st.destroy();
    }
    exports.test2 = test2;
});
//# sourceMappingURL=Style.js.map