var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Jassi"], function (require, exports, Component_1, Property_1, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataComponent = void 0;
    var tmpDatabinder = undefined;
    let DataComponent = class DataComponent extends Component_1.Component {
        /**
        * base class for each Component
        * @class jassijs.ui.Component
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = undefined) {
            super(properties);
            this._autocommit = false;
        }
        config(config) {
            super.config(config);
            return this;
        }
        get autocommit() {
            return this._autocommit;
        }
        set autocommit(value) {
            this._autocommit = value;
            //if (this._databinder !== undefined)
            //    this._databinder.checkAutocommit(this);
        }
        /**
         * @param [databinder:jassijs.ui.Databinder,"propertyToBind"]
         */
        set bind(databinder) {
            if (databinder === undefined) {
                if (this._databinder !== undefined) {
                    this._databinder.remove(this);
                    this._databinder = undefined;
                }
                return;
            }
            var property = databinder[1];
            this._databinder = databinder[0];
            if (this._databinder !== undefined)
                this._databinder.add(property, this, "onchange");
        }
        destroy() {
            if (this._databinder !== undefined) {
                this._databinder.remove(this);
                this._databinder = undefined;
            }
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], DataComponent.prototype, "autocommit", null);
    __decorate([
        (0, Property_1.$Property)({ type: "databinder" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], DataComponent.prototype, "bind", null);
    DataComponent = __decorate([
        (0, Jassi_1.$Class)("jassijs.ui.DataComponent"),
        __metadata("design:paramtypes", [Object])
    ], DataComponent);
    exports.DataComponent = DataComponent;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YUNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvRGF0YUNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBc0JBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQztJQUU5QixJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFjLFNBQVEscUJBQVM7UUFLeEM7Ozs7OztXQU1HO1FBQ0gsWUFBWSxVQUFVLEdBQUcsU0FBUztZQUM5QixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDN0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUEyQjtZQUM5QixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxJQUFJLFVBQVU7WUFDVixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDNUIsQ0FBQztRQUNELElBQUksVUFBVSxDQUFDLEtBQWM7WUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDekIscUNBQXFDO1lBQ3JDLDZDQUE2QztRQUNqRCxDQUFDO1FBQ0Q7O1dBRUc7UUFFSCxJQUFJLElBQUksQ0FBQyxVQUFpQjtZQUN0QixJQUFHLFVBQVUsS0FBRyxTQUFTLEVBQUM7Z0JBQ3RCLElBQUcsSUFBSSxDQUFDLFdBQVcsS0FBRyxTQUFTLEVBQUM7b0JBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM5QixJQUFJLENBQUMsV0FBVyxHQUFDLFNBQVMsQ0FBQztpQkFDOUI7Z0JBQ0QsT0FBTzthQUNWO1lBQ0QsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTO2dCQUM5QixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFHRCxPQUFPO1lBQ0gsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO2FBQ2hDO1lBQ0QsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUM7S0FDSixDQUFBO0lBbENHO1FBREMsSUFBQSxvQkFBUyxHQUFFOzs7bURBR1g7SUFVRDtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsQ0FBQzs7OzZDQWFqQztJQTdDUSxhQUFhO1FBRHpCLElBQUEsY0FBTSxFQUFDLDBCQUEwQixDQUFDOztPQUN0QixhQUFhLENBdUR6QjtJQXZEWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGphc3NpIGZyb20gXCJqYXNzaWpzL2phc3NpXCI7XG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENvbmZpZyB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGF0YWJpbmRlciB9IGZyb20gXCJqYXNzaWpzL3VpL0RhdGFiaW5kZXJcIjtcbmltcG9ydCB7IFByb3BlcnR5LCAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGF0YUNvbXBvbmVudENvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZyB7XG4gICAgLyoqXG4gICAgICAgICogYmluZHMgYSBjb21wb25lbnQgdG8gYSBkYXRhYmluZGVyXG4gICAgICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkRhdGFiaW5kZXJ9IGRhdGFiaW5kZXIgLSB0aGUgZGF0YWJpbmRlciB0byBiaW5kXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IHRvIGJpbmRcbiAgICAgICAgKi9cbiAgICBiaW5kPzogYW55W107XG4gICAgLyoqXG4gICAqIEBtZW1iZXIge2Jvb2x9IGF1dG9jb21taXQgLSAgaWYgdHJ1ZSB0aGUgZGF0YWJpbmRlciB3aWxsIHVwZGF0ZSB0aGUgdmFsdWUgb24gZXZlcnkgY2hhbmdlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgZmFsc2UgdGhlIGRhdGFiaW5kZXIgd2lsbCB1cGRhdGUgdGhlIHZhbHVlIG9uIGRhdGFiaW5kZXIudG9Gb3JtIFxuICAgKi9cbiAgICBhdXRvY29tbWl0PzogYm9vbGVhbjtcbiAgICB2YWx1ZT86IGFueTtcbn1cblxudmFyIHRtcERhdGFiaW5kZXIgPSB1bmRlZmluZWQ7XG5AJENsYXNzKFwiamFzc2lqcy51aS5EYXRhQ29tcG9uZW50XCIpXG5leHBvcnQgY2xhc3MgRGF0YUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCBpbXBsZW1lbnRzIERhdGFDb21wb25lbnRDb25maWcge1xuICAgIF9hdXRvY29tbWl0OiBib29sZWFuO1xuICAgIF9kYXRhYmluZGVyOiBEYXRhYmluZGVyO1xuXG5cbiAgICAvKipcbiAgICAqIGJhc2UgY2xhc3MgZm9yIGVhY2ggQ29tcG9uZW50XG4gICAgKiBAY2xhc3MgamFzc2lqcy51aS5Db21wb25lbnRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcGVydGllcyAtIHByb3BlcnRpZXMgdG8gaW5pdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbcHJvcGVydGllcy5pZF0gLSAgY29ubmVjdCB0byBleGlzdGluZyBpZCAobm90IHJlcWlyZWQpXG4gICAgICogXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcyA9IHVuZGVmaW5lZCkgey8vaWQgY29ubmVjdCB0byBleGlzdGluZyhub3QgcmVxaXJlZClcbiAgICAgICAgc3VwZXIocHJvcGVydGllcyk7XG4gICAgICAgIHRoaXMuX2F1dG9jb21taXQgPSBmYWxzZTtcbiAgICB9XG4gICAgY29uZmlnKGNvbmZpZzogRGF0YUNvbXBvbmVudENvbmZpZyk6IERhdGFDb21wb25lbnQge1xuICAgICAgICBzdXBlci5jb25maWcoY29uZmlnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoKVxuICAgIGdldCBhdXRvY29tbWl0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXV0b2NvbW1pdDtcbiAgICB9XG4gICAgc2V0IGF1dG9jb21taXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fYXV0b2NvbW1pdCA9IHZhbHVlO1xuICAgICAgICAvL2lmICh0aGlzLl9kYXRhYmluZGVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgIC8vICAgIHRoaXMuX2RhdGFiaW5kZXIuY2hlY2tBdXRvY29tbWl0KHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gW2RhdGFiaW5kZXI6amFzc2lqcy51aS5EYXRhYmluZGVyLFwicHJvcGVydHlUb0JpbmRcIl1cbiAgICAgKi9cbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJkYXRhYmluZGVyXCIgfSlcbiAgICBzZXQgYmluZChkYXRhYmluZGVyOiBhbnlbXSkge1xuICAgICAgICBpZihkYXRhYmluZGVyPT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGlmKHRoaXMuX2RhdGFiaW5kZXIhPT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFiaW5kZXIucmVtb3ZlKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFiaW5kZXI9dW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IGRhdGFiaW5kZXJbMV07XG4gICAgICAgIHRoaXMuX2RhdGFiaW5kZXIgPSBkYXRhYmluZGVyWzBdO1xuICAgICAgICBpZiAodGhpcy5fZGF0YWJpbmRlciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5fZGF0YWJpbmRlci5hZGQocHJvcGVydHksIHRoaXMsIFwib25jaGFuZ2VcIik7XG4gICAgfVxuXG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5fZGF0YWJpbmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhYmluZGVyLnJlbW92ZSh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFiaW5kZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgIH1cbn1cbiJdfQ==