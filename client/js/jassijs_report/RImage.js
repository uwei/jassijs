var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Property", "jassijs_report/RComponent"], function (require, exports, Jassi_1, Property_1, RComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RImage = void 0;
    //mdi-format-list-numbered
    let RImage = 
    //@$Property({name:"horizontal",hide:true})
    class RImage extends RComponent_1.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "image";
            this._image = "";
            this.init($('<img class="RImage"></img>')[0]);
            $(this.domWrapper).removeClass("jcontainer");
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            //do nothing
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            //do nothing
        }
        set image(value) {
            this._image = value;
            if (value === undefined)
                $(this.dom).attr("src", "");
            else {
                //later we have a parent
                var report = RComponent_1.RComponent.findReport(this);
                var _this = this;
                if (report === undefined) {
                    if (_this["nextTry"] === undefined) { //deny recurse
                        setTimeout(() => {
                            _this["nextTry"] = true;
                            _this.image = value;
                        }, 200);
                    }
                    else {
                        delete _this["nextTry"];
                    }
                }
                else {
                    var im = report.images;
                    if (im !== undefined && im[value] !== undefined) {
                        $(this.dom).attr("src", im[value]);
                    }
                    else {
                        $(this.dom).attr("src", value);
                    }
                }
            }
        }
        get image() {
            return this._image;
        }
        toJSON() {
            var ret = super.toJSON();
            //if (this.image)
            ret.image = this.image;
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            //if (ob.image)
            ret.image = ob.image;
            delete ob.image;
            super.fromJSON(ob);
            return ret;
        }
    };
    __decorate([
        Property_1.$Property({
            type: "rimage",
            chooseFrom: (data) => {
                debugger;
                return [];
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RImage.prototype, "image", null);
    RImage = __decorate([
        RComponent_1.$ReportComponent({ fullPath: "report/Image", icon: "mdi mdi-image-frame" }),
        Jassi_1.$Class("jassijs_report.RImage")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RImage);
    exports.RImage = RImage;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUkltYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvUkltYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFRQSwwQkFBMEI7SUFLMUIsSUFBYSxNQUFNO0lBRm5CLDJDQUEyQztJQUUzQyxNQUFhLE1BQU8sU0FBUSx1QkFBVTtRQUdsQzs7Ozs7O1VBTUU7UUFDRixZQUFZLFVBQVUsR0FBRyxTQUFTO1lBQzlCLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQVZ0QixlQUFVLEdBQVcsT0FBTyxDQUFDO1lBQzdCLFdBQU0sR0FBVyxFQUFFLENBQUM7WUFVaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFDRDs7OztXQUlHO1FBQ0gsU0FBUyxDQUFDLFNBQVMsRUFBRSxNQUFNO1lBQ3ZCLFlBQVk7UUFDaEIsQ0FBQztRQUNEOzs7UUFHQTtRQUNBLEdBQUcsQ0FBQyxTQUFTO1lBQ1QsWUFBWTtRQUNoQixDQUFDO1FBUUQsSUFBSSxLQUFLLENBQUMsS0FBYTtZQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLEtBQUssS0FBSyxTQUFTO2dCQUNuQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7aUJBQzVCO2dCQUVGLHdCQUF3QjtnQkFDeEIsSUFBSSxNQUFNLEdBQUcsdUJBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDakIsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO29CQUN0QixJQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBRyxTQUFTLEVBQUMsRUFBQyxjQUFjO3dCQUMzQyxVQUFVLENBQUMsR0FBRyxFQUFFOzRCQUNaLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBQyxJQUFJLENBQUM7NEJBQ3RCLEtBQUssQ0FBQyxLQUFLLEdBQUMsS0FBSyxDQUFDO3dCQUN0QixDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ1Y7eUJBQUk7d0JBQ0QsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQzNCO2lCQUNKO3FCQUFJO29CQUNELElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7b0JBQ3ZCLElBQUksRUFBRSxLQUFLLFNBQVMsSUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUcsU0FBUyxFQUFFO3dCQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ3RDO3lCQUFJO3dCQUNGLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDakM7aUJBQ0o7YUFDRjtRQUVMLENBQUM7UUFDRCxJQUFJLEtBQUs7WUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdkIsQ0FBQztRQUNELE1BQU07WUFDRixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFekIsaUJBQWlCO1lBQ2pCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN2QixPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFDRCxRQUFRLENBQUMsRUFBTztZQUNaLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQztZQUVmLGVBQWU7WUFDZixHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDckIsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ2hCLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkIsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO0tBQ0osQ0FBQTtJQWhERztRQVBDLG9CQUFTLENBQUM7WUFDUCxJQUFJLEVBQUUsUUFBUTtZQUNkLFVBQVUsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNqQixRQUFRLENBQUM7Z0JBQ1QsT0FBTyxFQUFFLENBQUM7WUFDZCxDQUFDO1NBQ0osQ0FBQzs7O3VDQTZCRDtJQWpFUSxNQUFNO1FBSmxCLDZCQUFnQixDQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsQ0FBQztRQUMzRSxjQUFNLENBQUMsdUJBQXVCLENBQUM7UUFDaEMsMkNBQTJDOzs7T0FFOUIsTUFBTSxDQXFGbEI7SUFyRlksd0JBQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCb3hQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL0JveFBhbmVsXCI7XHJcbmltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5pbXBvcnQgeyAkVUlDb21wb25lbnQsIENvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xyXG5pbXBvcnQgeyBSZXBvcnREZXNpZ24gfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUmVwb3J0RGVzaWduXCI7XHJcbmltcG9ydCB7ICRSZXBvcnRDb21wb25lbnQsIFJDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUkNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcblxyXG4vL21kaS1mb3JtYXQtbGlzdC1udW1iZXJlZFxyXG5AJFJlcG9ydENvbXBvbmVudCh7IGZ1bGxQYXRoOiBcInJlcG9ydC9JbWFnZVwiLCBpY29uOiBcIm1kaSBtZGktaW1hZ2UtZnJhbWVcIiB9KVxyXG5AJENsYXNzKFwiamFzc2lqc19yZXBvcnQuUkltYWdlXCIpXHJcbi8vQCRQcm9wZXJ0eSh7bmFtZTpcImhvcml6b250YWxcIixoaWRlOnRydWV9KVxyXG5cclxuZXhwb3J0IGNsYXNzIFJJbWFnZSBleHRlbmRzIFJDb21wb25lbnQge1xyXG4gICAgcmVwb3J0dHlwZTogc3RyaW5nID0gXCJpbWFnZVwiO1xyXG4gICAgX2ltYWdlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcGVydGllcyAtIHByb3BlcnRpZXMgdG8gaW5pdFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW3Byb3BlcnRpZXMuaWRdIC0gIGNvbm5lY3QgdG8gZXhpc3RpbmcgaWQgKG5vdCByZXFpcmVkKVxyXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wZXJ0aWVzLnVzZVNwYW5dIC0gIHVzZSBzcGFuIG5vdCBkaXZcclxuICAgICogXHJcbiAgICAqL1xyXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcyA9IHVuZGVmaW5lZCkgey8vaWQgY29ubmVjdCB0byBleGlzdGluZyhub3QgcmVxaXJlZClcclxuICAgICAgICBzdXBlcihwcm9wZXJ0aWVzKTtcclxuICAgICAgICB0aGlzLmluaXQoJCgnPGltZyBjbGFzcz1cIlJJbWFnZVwiPjwvaW1nPicpWzBdKTtcclxuICAgICAgICAkKHRoaXMuZG9tV3JhcHBlcikucmVtb3ZlQ2xhc3MoXCJqY29udGFpbmVyXCIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGRzIGEgY29tcG9uZW50IHRvIHRoZSBjb250YWluZXIgYmVmb3JlIGFuIG90aGVyIGNvbXBvbmVudFxyXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCB0byBhZGRcclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGJlZm9yZSAtIHRoZSBjb21wb25lbnQgYmVmb3JlIHRoZW4gY29tcG9uZW50IHRvIGFkZFxyXG4gICAgICovXHJcbiAgICBhZGRCZWZvcmUoY29tcG9uZW50LCBiZWZvcmUpIHtcclxuICAgICAgICAvL2RvIG5vdGhpbmdcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICogYWRkcyBhIGNvbXBvbmVudCB0byB0aGUgY29udGFpbmVyXHJcbiAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IHRvIGFkZFxyXG4gICovXHJcbiAgICBhZGQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgLy9kbyBub3RoaW5nXHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHtcclxuICAgICAgICB0eXBlOiBcInJpbWFnZVwiLFxyXG4gICAgICAgIGNob29zZUZyb206IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHNldCBpbWFnZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5faW1hZ2UgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgJCh0aGlzLmRvbSkuYXR0cihcInNyY1wiLCBcIlwiKTtcclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgLy9sYXRlciB3ZSBoYXZlIGEgcGFyZW50XHJcbiAgICAgICAgICB2YXIgcmVwb3J0ID0gUkNvbXBvbmVudC5maW5kUmVwb3J0KHRoaXMpO1xyXG4gICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgIGlmIChyZXBvcnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGlmKF90aGlzW1wibmV4dFRyeVwiXT09PXVuZGVmaW5lZCl7Ly9kZW55IHJlY3Vyc2VcclxuICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBfdGhpc1tcIm5leHRUcnlcIl09dHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmltYWdlPXZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICB9LDIwMCk7XHJcbiAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBfdGhpc1tcIm5leHRUcnlcIl07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgdmFyIGltID0gcmVwb3J0LmltYWdlcztcclxuICAgICAgICAgICAgICBpZiAoaW0gIT09IHVuZGVmaW5lZCYmaW1bdmFsdWVdIT09dW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICQodGhpcy5kb20pLmF0dHIoXCJzcmNcIiwgaW1bdmFsdWVdKTtcclxuICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAkKHRoaXMuZG9tKS5hdHRyKFwic3JjXCIsIHZhbHVlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGdldCBpbWFnZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbWFnZTtcclxuICAgIH1cclxuICAgIHRvSlNPTigpIHtcclxuICAgICAgICB2YXIgcmV0ID0gc3VwZXIudG9KU09OKCk7XHJcblxyXG4gICAgICAgIC8vaWYgKHRoaXMuaW1hZ2UpXHJcbiAgICAgICAgcmV0LmltYWdlID0gdGhpcy5pbWFnZTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgZnJvbUpTT04ob2I6IGFueSk6IFJVTGlzdCB7XHJcbiAgICAgICAgdmFyIHJldCA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vaWYgKG9iLmltYWdlKVxyXG4gICAgICAgIHJldC5pbWFnZSA9IG9iLmltYWdlO1xyXG4gICAgICAgIGRlbGV0ZSBvYi5pbWFnZTtcclxuICAgICAgICBzdXBlci5mcm9tSlNPTihvYik7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxufVxyXG4iXX0=