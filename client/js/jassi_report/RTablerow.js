var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component", "jassi_report/ReportDesign", "jassi_report/ReportComponent"], function (require, exports, Jassi_1, Component_1, ReportDesign_1, ReportComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RTablerow = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RTablerow = 
    //@$Property({name:"horizontal",hide:true})
    class RTablerow extends ReportComponent_1.ReportComponent {
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
            var colspan = $(component.domWrapper).attr("colspan"); //save colspan
            Component_1.Component.replaceWrapper(component, document.createElement("td"));
            $(component.domWrapper).attr("colspan", colspan);
            $(component.domWrapper).css("word-break", "break-all");
            $(component.domWrapper).css("display", "");
        }
        correctHideAfterSpan() {
            //rowspan
            var span;
            for (var x = 0; x < this._components.length; x++) {
                if (this._components[x]["colSpan"]) {
                    span = this._components[x]["colSpan"];
                }
                else {
                    span--;
                    if (span > 0) {
                        $(this._components[x].domWrapper).addClass("invisibleAfterColspan");
                    }
                    else {
                        $(this._components[x].domWrapper).removeClass("invisibleAfterColspan");
                    }
                }
            }
        }
        /**
        * adds a component to the container
        * @param {jassi.ui.Component} component - the component to add
        */
        add(component) {
            this.wrapComponent(component);
            super.add(component);
            // $(component.domWrapper).css("display", "table-cell");
            this.callEvent("componentAdded", component, this);
            if (this._parent)
                this._parent.addEmptyCellsIfNeeded(this);
        }
        /**
      * adds a component to the container before an other component
      * @param {jassi.ui.Component} component - the component to add
      * @param {jassi.ui.Component} before - the component before then component to add
      */
        addBefore(component, before) {
            this.wrapComponent(component);
            if (component["reporttype"] === "text") {
                //(<RText>component).newlineafter = true;
            }
            super.addBefore(component, before);
            // $(component.domWrapper).css("display", "table-cell");
            this.callEvent("componentAdded", component, this);
            if (this._parent)
                this._parent.addEmptyCellsIfNeeded(this);
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
        ReportComponent_1.$ReportComponent({ editableChildComponents: ["this"] }),
        Jassi_1.$Class("jassi_report.RTablerow")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RTablerow);
    exports.RTablerow = RTablerow;
});
//    jassi.register("reportcomponent","jassi_report.Stack","report/Stack","res/boxpanel.ico");
//# sourceMappingURL=RTablerow.js.map