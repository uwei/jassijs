var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Registry_1, Component_1, Property_1, ReportDesign_1, RComponent_1) {
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
            this.init("<ul></ul>");
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
            if (component._listType !== undefined)
                component.listType = component._listType;
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
            if (component.listType !== undefined)
                component.listType = component._listType;
            super.add(component);
        }
        set type(value) {
            this._type = value;
            if (value === undefined)
                this.dom.style["list-style-type"] = "";
            else
                this.dom.style["list-style-type"] = value;
        }
        get type() {
            return this._type;
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
            if (this.type)
                ret.type = this.type;
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob.ul;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_1.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.ul;
            if (ob.type)
                ret.type = ob.type;
            delete ob.type;
            super.fromJSON(ob);
            return ret;
        }
    };
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["square", "circle", "none"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RUList.prototype, "type", null);
    RUList = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Unordered List", icon: "mdi mdi-format-list-bulleted", editableChildComponents: ["this"] }),
        (0, Registry_1.$Class)("jassijs_report.RUList")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RUList);
    exports.RUList = RUList;
});
//# sourceMappingURL=RUList.js.map