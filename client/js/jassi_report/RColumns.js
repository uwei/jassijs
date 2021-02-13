var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/Property", "jassi_report/ReportDesign", "jassi_report/ReportComponent"], function (require, exports, Jassi_1, Property_1, ReportDesign_1, ReportComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RColumns = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RColumns = class RColumns extends ReportComponent_1.ReportComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "columns";
            $(this.domWrapper).addClass('BoxPanel').removeClass('Panel');
            $(this.dom).css("display", "table");
            $(this.dom).css("min-width", "50px");
            // this.width="300px"
        }
        /**
       * adds a component to the container before an other component
       * @param {jassi.ui.Component} component - the component to add
       * @param {jassi.ui.Component} before - the component before then component to add
       */
        addBefore(component, before) {
            if (component["reporttype"] === "text") {
                //(<RText>component).newlineafter=true;
            }
            super.addBefore(component, before);
            $(component.domWrapper).css("display", "table-cell");
        }
        /**
      * adds a component to the container
      * @param {jassi.ui.Component} component - the component to add
      */
        add(component) {
            super.add(component);
            $(component.domWrapper).css("display", "table-cell");
        }
        toJSON() {
            var ret = super.toJSON();
            ret.columns = [];
            for (let x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //@ts-ignore
                ret.columns.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            for (let x = 0; x < ob.columns.length; x++) {
                ret.add(ReportDesign_1.ReportDesign.fromJSON(ob.columns[x]));
            }
            delete ob.columns;
            super.fromJSON(ob);
            return ret;
        }
    };
    RColumns = __decorate([
        ReportComponent_1.$ReportComponent({ fullPath: "report/Columns", icon: "mdi mdi-view-parallel-outline", editableChildComponents: ["this"] }),
        Jassi_1.$Class("jassi_report.RColumns"),
        Property_1.$Property({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], RColumns);
    exports.RColumns = RColumns;
});
//    jassi.register("reportcomponent","jassi_report.Stack","report/Stack","res/boxpanel.ico");
//# sourceMappingURL=RColumns.js.map