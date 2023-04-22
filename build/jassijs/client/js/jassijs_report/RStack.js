var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Registry_1, ReportDesign_1, RComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RStack = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RStack = class RStack extends RComponent_1.RComponent {
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
            this.dom.style["flex-direction"] = "column";
            this.dom.classList.add("designerNoResizable");
        }
        /**
          * adds a component to the container before an other component
          * @param {jassijs.ui.Component} component - the component to add
          * @param {jassijs.ui.Component} before - the component before then component to add
          */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            super.addBefore(component, before);
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            super.add(component);
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
            var test = 0;
            for (var key in ret) {
                test++;
            }
            if (test === 1)
                ret = ret.stack; //short version
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob;
            if (ob.stack)
                arr = ob.stack;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_1.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.stack;
            if (!Array.isArray(ob))
                super.fromJSON(ob);
            return ret;
        }
    };
    RStack = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Stack", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] }),
        (0, Registry_1.$Class)("jassijs_report.RStack")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RStack);
    exports.RStack = RStack;
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
//# sourceMappingURL=RStack.js.map