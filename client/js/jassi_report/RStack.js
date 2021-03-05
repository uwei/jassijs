var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi_report/ReportDesign", "jassi_report/ReportComponent"], function (require, exports, Jassi_1, ReportDesign_1, ReportComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RStack = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RStack = 
    //@$Property({name:"horizontal",hide:true})
    class RStack extends ReportComponent_1.ReportComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "stack";
            $(this.dom).css("flex-direction", "column");
        }
        toJSON() {
            var ret = super.toJSON();
            ret.stack = [];
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                ret.stack.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            for (let x = 0; x < ob.stack.length; x++) {
                ret.add(ReportDesign_1.ReportDesign.fromJSON(ob.stack[x]));
            }
            delete ob.stack;
            super.fromJSON(ob);
            return ret;
        }
    };
    RStack = __decorate([
        ReportComponent_1.$ReportComponent({ fullPath: "report/Stack", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] }),
        Jassi_1.$Class("jassi_report.RStack")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RStack);
    exports.RStack = RStack;
});
//    jassi.register("reportcomponent","jassi_report.Stack","report/Stack","res/boxpanel.ico");
//# sourceMappingURL=RStack.js.map