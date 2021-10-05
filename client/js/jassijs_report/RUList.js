var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Jassi_1, Component_1, ReportDesign_1, RComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RUList = void 0;
    //mdi-format-list-numbered
    let RUList = 
    //@$Property({name:"horizontal",hide:true})
    class RUList extends RComponent_1.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "ul";
            this.init($("<ul></ul>")[0]);
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            Component_1.Component.replaceWrapper(component, document.createElement("li"));
            super.addBefore(component, before);
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            Component_1.Component.replaceWrapper(component, document.createElement("li"));
            super.add(component);
        }
        toJSON() {
            var ret = super.toJSON();
            ret.ul = [];
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                ret.ul.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob.ul;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_1.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.ul;
            return ret;
        }
    };
    RUList = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Unordered List", icon: "mdi mdi-format-list-bulleted", editableChildComponents: ["this"] }),
        (0, Jassi_1.$Class)("jassijs_report.RUList")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RUList);
    exports.RUList = RUList;
});
//# sourceMappingURL=RUList.js.map