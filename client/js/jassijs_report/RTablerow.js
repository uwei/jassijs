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
    exports.RTablerow = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RTablerow = 
    //@$Property({name:"horizontal",hide:true})
    class RTablerow extends RComponent_1.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "tablerow";
            properties = undefined === properties ? {} : properties;
            properties.noWrapper = true;
            super.init($("<tr></tr>")[0], properties);
            $(this.dom).addClass("designerNoResizable");
        }
        toJSON() {
            var columns = [];
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                columns.push(this._components[x].toJSON());
            }
            //Object.assign(ret, this["otherProperties"]);
            return columns;
        }
        oncomponentAdded(callback) {
            this.addEvent("componentAdded", callback);
        }
        get _editorselectthis() {
            return this._parent;
        }
        setChildWidth(component, value) {
            var _a;
            (_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth(component, value);
        }
        getChildWidth(component) {
            var _a;
            return (_a = this._parent) === null || _a === void 0 ? void 0 : _a.getChildWidth(component);
        }
        wrapComponent(component) {
            var _a;
            if (((_a = component.domWrapper) === null || _a === void 0 ? void 0 : _a.tagName) === "TD")
                return; //allready wrapped
            var colspan = $(component.domWrapper).attr("colspan"); //save colspan
            Component_1.Component.replaceWrapper(component, document.createElement("td"));
            $(component.domWrapper).attr("colspan", colspan);
            $(component.dom).css("background-color", "inherit");
            $(component.domWrapper).css("word-break", "break-all");
            $(component.domWrapper).css("display", "");
        }
        /**
        * adds a component to the container
        * @param {jassijs.ui.Component} component - the component to add
        */
        add(component) {
            var _a;
            if (component.addToParent)
                return component.addToParent(this);
            this.wrapComponent(component);
            component.parent = this;
            super.add(component);
            // $(component.domWrapper).css("display", "table-cell");
            this.callEvent("componentAdded", component, this);
            if (this._parent)
                this._parent.addEmptyCellsIfNeeded(this);
            if (component.designDummyFor) {
                $(component.domWrapper).attr("colspan", "100");
                if ($(this.dom).width() < 140) {
                    component.width = 140 - $(this.dom).width();
                }
            }
            $(component.dom).removeClass("designerNoResizable");
            $(component.dom).addClass("designerNoResizableY");
            (_a = this.parent) === null || _a === void 0 ? void 0 : _a.updateLayout(true);
        }
        /**
      * adds a component to the container before an other component
      * @param {jassijs.ui.Component} component - the component to add
      * @param {jassijs.ui.Component} before - the component before then component to add
      */
        addBefore(component, before) {
            var _a;
            if (component.addToParent)
                return component.addToParent(this);
            this.wrapComponent(component);
            component.parent = this;
            if (component["reporttype"] === "text") {
                //(<RText>component).newlineafter = true;
            }
            super.addBefore(component, before);
            // $(component.domWrapper).css("display", "table-cell");
            this.callEvent("componentAdded", component, this);
            if (this._parent)
                this._parent.addEmptyCellsIfNeeded(this);
            (_a = this.parent) === null || _a === void 0 ? void 0 : _a.updateLayout(true);
        }
        fromJSON(columns) {
            var ret = this;
            for (let x = 0; x < columns.length; x++) {
                ret.add(ReportDesign_1.ReportDesign.fromJSON(columns[x]));
            }
            return ret;
        }
    };
    RTablerow = __decorate([
        (0, RComponent_1.$ReportComponent)({ editableChildComponents: ["this"] }),
        (0, Jassi_1.$Class)("jassijs_report.RTablerow")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RTablerow);
    exports.RTablerow = RTablerow;
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
//# sourceMappingURL=RTablerow.js.map