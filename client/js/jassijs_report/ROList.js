var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Jassi_1, Component_1, Property_1, ReportDesign_1, RComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ROList = void 0;
    //not implemented: separator,markerColor, counter is counting also the next elements
    let ROList = 
    //@$Property({name:"horizontal",hide:true})
    class ROList extends RComponent_1.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "ol";
            this.init($("<ol></ol>")[0]);
        }
        set type(value) {
            this._type = value;
            if (value === undefined)
                $(this.dom).css("list-style-type", "");
            else
                $(this.dom).css("list-style-type", value);
        }
        get type() {
            return this._type;
        }
        set reversed(value) {
            this._reversed = value;
            if (this._reversed)
                $(this.__dom).attr("reversed", "");
            else
                $(this.__dom).removeAttr("reversed");
        }
        get reversed() {
            return this._reversed;
        }
        set start(value) {
            this._start = value;
            $(this.__dom).attr("start", value);
        }
        get start() {
            return this._start;
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
            if (component._counter)
                component.counter = component._counter;
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
            if (component._counter)
                component.counter = component._counter;
            super.add(component);
        }
        toJSON() {
            var ret = super.toJSON();
            ret.ol = [];
            if (this.reversed)
                ret.reversed = true;
            if (this.start)
                ret.start = this.start;
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                ret.ol.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob.ol;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_1.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.ol;
            if (ob.reversed)
                ret.reversed = ob.reversed;
            delete ob.reversed;
            if (ob.start)
                ret.start = ob.start;
            delete ob.start;
            return ret;
        }
    };
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["lower-alpha", "upper-alpha", "lower-roman", "upper-roman", "none"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ROList.prototype, "type", null);
    __decorate([
        (0, Property_1.$Property)({ default: false }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], ROList.prototype, "reversed", null);
    __decorate([
        (0, Property_1.$Property)({ default: 1 }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], ROList.prototype, "start", null);
    ROList = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Ordered List", icon: "mdi mdi-format-list-numbered", editableChildComponents: ["this"] }),
        (0, Jassi_1.$Class)("jassijs_report.ROList")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], ROList);
    exports.ROList = ROList;
});
//# sourceMappingURL=ROList.js.map