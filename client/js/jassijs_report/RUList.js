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
    __decorate([
        Property_1.$Property({ chooseFrom: ["square", "circle", "none"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RUList.prototype, "type", null);
    RUList = __decorate([
        RComponent_1.$ReportComponent({ fullPath: "report/Unordered List", icon: "mdi mdi-format-list-bulleted", editableChildComponents: ["this"] }),
        Jassi_1.$Class("jassijs_report.RUList")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RUList);
    exports.RUList = RUList;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlVMaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvUlVMaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFRQSwwQkFBMEI7SUFLMUIsSUFBYSxNQUFNO0lBRm5CLDJDQUEyQztJQUUzQyxNQUFhLE1BQU8sU0FBUSx1QkFBVTtRQUdsQzs7Ozs7O1VBTUU7UUFDRixZQUFZLFVBQVUsR0FBRyxTQUFTO1lBQzlCLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQVZ0QixlQUFVLEdBQVcsSUFBSSxDQUFDO1lBV3RCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakMsQ0FBQztRQUNBOzs7O1dBSUc7UUFDSixTQUFTLENBQUMsU0FBUyxFQUFFLE1BQU07WUFDdkIsSUFBSSxTQUFTLENBQUMsV0FBVztnQkFDckIsT0FBTyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLHFCQUFTLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUNEOzs7UUFHQTtRQUNBLEdBQUcsQ0FBQyxTQUFTO1lBQ1QsSUFBSSxTQUFTLENBQUMsV0FBVztnQkFDckIsT0FBTyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLHFCQUFTLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBWTtZQUNqQixJQUFJLENBQUMsS0FBSyxHQUFDLEtBQUssQ0FBQztZQUNqQixJQUFHLEtBQUssS0FBRyxTQUFTO2dCQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBQyxFQUFFLENBQUMsQ0FBQzs7Z0JBRXRDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFDRCxJQUFJLElBQUk7WUFDSixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEIsQ0FBQztRQUNELE1BQU07WUFDSixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdkIsR0FBRyxDQUFDLEVBQUUsR0FBRSxFQUFFLENBQUM7WUFDWCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQzVDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDckMsU0FBUztnQkFDYixZQUFZO2dCQUNaLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUM3QztZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztRQUNELFFBQVEsQ0FBQyxFQUFPO1lBQ1osSUFBSSxHQUFHLEdBQUUsSUFBSSxDQUFDO1lBQ2QsSUFBSSxHQUFHLEdBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFFO2dCQUMvQixHQUFHLENBQUMsR0FBRyxDQUFDLDJCQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUM7WUFDRCxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDYixPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FDSixDQUFBO0lBOUJHO1FBREMsb0JBQVMsQ0FBQyxFQUFDLFVBQVUsRUFBQyxDQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQzs7O3NDQU9sRDtJQTNDUSxNQUFNO1FBSmxCLDZCQUFnQixDQUFDLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFLElBQUksRUFBRSw4QkFBOEIsRUFBRSx1QkFBdUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDaEksY0FBTSxDQUFDLHVCQUF1QixDQUFDO1FBQ2hDLDJDQUEyQzs7O09BRTlCLE1BQU0sQ0FtRWxCO0lBbkVZLHdCQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQm94UGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9Cb3hQYW5lbFwiO1xyXG5pbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgJFVJQ29tcG9uZW50LCBDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcclxuaW1wb3J0IHsgUmVwb3J0RGVzaWduIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiO1xyXG5pbXBvcnQgeyAkUmVwb3J0Q29tcG9uZW50LCBSQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JDb21wb25lbnRcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5cclxuLy9tZGktZm9ybWF0LWxpc3QtbnVtYmVyZWRcclxuQCRSZXBvcnRDb21wb25lbnQoeyBmdWxsUGF0aDogXCJyZXBvcnQvVW5vcmRlcmVkIExpc3RcIiwgaWNvbjogXCJtZGkgbWRpLWZvcm1hdC1saXN0LWJ1bGxldGVkXCIsIGVkaXRhYmxlQ2hpbGRDb21wb25lbnRzOiBbXCJ0aGlzXCJdIH0pXHJcbkAkQ2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5SVUxpc3RcIilcclxuLy9AJFByb3BlcnR5KHtuYW1lOlwiaG9yaXpvbnRhbFwiLGhpZGU6dHJ1ZX0pXHJcblxyXG5leHBvcnQgY2xhc3MgUlVMaXN0IGV4dGVuZHMgUkNvbXBvbmVudCB7XHJcbiAgICByZXBvcnR0eXBlOiBzdHJpbmcgPSBcInVsXCI7XHJcbiAgICBfdHlwZTpzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wZXJ0aWVzIC0gcHJvcGVydGllcyB0byBpbml0XHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbcHJvcGVydGllcy5pZF0gLSAgY29ubmVjdCB0byBleGlzdGluZyBpZCAobm90IHJlcWlyZWQpXHJcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BlcnRpZXMudXNlU3Bhbl0gLSAgdXNlIHNwYW4gbm90IGRpdlxyXG4gICAgKiBcclxuICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzID0gdW5kZWZpbmVkKSB7Ly9pZCBjb25uZWN0IHRvIGV4aXN0aW5nKG5vdCByZXFpcmVkKVxyXG4gICAgICAgIHN1cGVyKHByb3BlcnRpZXMpO1xyXG4gICAgICAgIHRoaXMuaW5pdCgkKFwiPHVsPjwvdWw+XCIpWzBdKTtcclxuICAgICAgIFxyXG4gICAgfVxyXG4gICAgIC8qKlxyXG4gICAgICAqIGFkZHMgYSBjb21wb25lbnQgdG8gdGhlIGNvbnRhaW5lciBiZWZvcmUgYW4gb3RoZXIgY29tcG9uZW50XHJcbiAgICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0byBhZGRcclxuICAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBiZWZvcmUgLSB0aGUgY29tcG9uZW50IGJlZm9yZSB0aGVuIGNvbXBvbmVudCB0byBhZGRcclxuICAgICAgKi9cclxuICAgIGFkZEJlZm9yZShjb21wb25lbnQsIGJlZm9yZSkge1xyXG4gICAgICAgIGlmIChjb21wb25lbnQuYWRkVG9QYXJlbnQpXHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQuYWRkVG9QYXJlbnQodGhpcyk7XHJcbiAgICAgICAgQ29tcG9uZW50LnJlcGxhY2VXcmFwcGVyKGNvbXBvbmVudCwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpKTtcclxuICAgICAgICBzdXBlci5hZGRCZWZvcmUoY29tcG9uZW50LCBiZWZvcmUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgKiBhZGRzIGEgY29tcG9uZW50IHRvIHRoZSBjb250YWluZXJcclxuICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gYWRkXHJcbiAgKi9cclxuICAgIGFkZChjb21wb25lbnQpIHtcclxuICAgICAgICBpZiAoY29tcG9uZW50LmFkZFRvUGFyZW50KVxyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50LmFkZFRvUGFyZW50KHRoaXMpO1xyXG4gICAgICAgIENvbXBvbmVudC5yZXBsYWNlV3JhcHBlcihjb21wb25lbnQsIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKSk7XHJcbiAgICAgICAgc3VwZXIuYWRkKGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHtjaG9vc2VGcm9tOltcInNxdWFyZVwiLFwiY2lyY2xlXCIsXCJub25lXCJdfSlcclxuICAgIHNldCB0eXBlKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5fdHlwZT12YWx1ZTtcclxuICAgICAgICBpZih2YWx1ZT09PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwibGlzdC1zdHlsZS10eXBlXCIsXCJcIik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJsaXN0LXN0eWxlLXR5cGVcIix2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBnZXQgdHlwZSgpOnN0cmluZ3tcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH0gXHJcbiAgICB0b0pTT04oKSB7XHJcbiAgICBcdCB2YXIgcmV0ID0gc3VwZXIudG9KU09OKCk7XHJcbiAgICAgICAgcmV0LnVsPSBbXTtcclxuICAgICAgICBmb3IgKGxldCB4ID0gMDt4IDwgdGhpcy5fY29tcG9uZW50cy5sZW5ndGg7eCsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb21wb25lbnRzW3hdW1wiZGVzaWduRHVtbXlGb3JcIl0pXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHJldC51bC5wdXNoKHRoaXMuX2NvbXBvbmVudHNbeF0udG9KU09OKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgZnJvbUpTT04ob2I6IGFueSk6UlVMaXN0e1xyXG4gICAgICAgIHZhciByZXQ9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFycj1vYi51bDtcclxuICAgICAgICBmb3IgKGxldCB4ID0gMDt4IDwgYXJyLmxlbmd0aDt4KyspIHtcclxuICAgICAgICAgICAgcmV0LmFkZChSZXBvcnREZXNpZ24uZnJvbUpTT04oYXJyW3hdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZSBvYi51bDtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==