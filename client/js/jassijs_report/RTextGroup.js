var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_report/ReportDesign", "jassijs_report/RComponent", "jassijs/remote/Classes"], function (require, exports, Jassi_1, ReportDesign_1, RComponent_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RTextGroup = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RTextGroup = 
    //@$Property({name:"horizontal",hide:true})
    class RTextGroup extends RComponent_1.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            if (!properties)
                properties = {};
            properties.useSpan = true;
            super(properties);
            this.reporttype = "textgroup";
            // $(this.dom).css("flex-direction", "column");
            //$(this.dom).addClass("designerNoResizable");
        }
        /**
          * adds a component to the container before an other component
          * @param {jassijs.ui.Component} component - the component to add
          * @param {jassijs.ui.Component} before - the component before then component to add
          */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            if (component.reporttype !== "text" && component.reporttype !== "textgroup" && !component.designDummyFor)
                throw new Classes_1.JassiError("only text oder textgroup could be added to TextGroup");
            super.addBefore(component, before);
            //  $(component.dom).css("display", "inline");
            $(component.domWrapper).css("display", "inline-block");
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            if (component.reporttype !== "text" && component.reporttype !== "textgroup" && !component.designDummyFor)
                throw new Classes_1.JassiError("only text oder textgroup could be added to TextGroup");
            super.add(component);
            //  $(component.dom).css("display", "inline-block");
            $(component.domWrapper).css("display", "inline-block");
        }
        toJSON() {
            var ret = super.toJSON();
            ret.text = [];
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                ret.text.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob.text;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_1.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.text;
            return ret;
        }
    };
    RTextGroup = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/TextGroup", icon: "mdi mdi-text-box-multiple-outline", editableChildComponents: ["this"] }),
        (0, Jassi_1.$Class)("jassijs_report.RTextGroup")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RTextGroup);
    exports.RTextGroup = RTextGroup;
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
//# sourceMappingURL=RTextGroup.js.map