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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YUNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvRGF0YUNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBc0JBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQztJQUU5QixJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFjLFNBQVEscUJBQVM7UUFLeEM7Ozs7OztXQU1HO1FBQ0gsWUFBWSxVQUFVLEdBQUcsU0FBUztZQUM5QixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDN0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUEyQjtZQUM5QixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxJQUFJLFVBQVU7WUFDVixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDNUIsQ0FBQztRQUNELElBQUksVUFBVSxDQUFDLEtBQWM7WUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDekIscUNBQXFDO1lBQ3JDLDZDQUE2QztRQUNqRCxDQUFDO1FBQ0Q7O1dBRUc7UUFFSCxJQUFJLElBQUksQ0FBQyxVQUFpQjtZQUN0QixJQUFHLFVBQVUsS0FBRyxTQUFTLEVBQUM7Z0JBQ3RCLElBQUcsSUFBSSxDQUFDLFdBQVcsS0FBRyxTQUFTLEVBQUM7b0JBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM5QixJQUFJLENBQUMsV0FBVyxHQUFDLFNBQVMsQ0FBQztpQkFDOUI7Z0JBQ0QsT0FBTzthQUNWO1lBQ0QsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTO2dCQUM5QixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFHRCxPQUFPO1lBQ0gsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO2FBQ2hDO1lBQ0QsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUM7S0FDSixDQUFBO0lBbENHO1FBREMsSUFBQSxvQkFBUyxHQUFFOzs7bURBR1g7SUFVRDtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsQ0FBQzs7OzZDQWFqQztJQTdDUSxhQUFhO1FBRHpCLElBQUEsY0FBTSxFQUFDLDBCQUEwQixDQUFDOztPQUN0QixhQUFhLENBdUR6QjtJQXZEWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGphc3NpIGZyb20gXCJqYXNzaWpzL2phc3NpXCI7XG5pbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENvbmZpZyB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGF0YWJpbmRlciB9IGZyb20gXCJqYXNzaWpzL3VpL0RhdGFiaW5kZXJcIjtcbmltcG9ydCB7IFByb3BlcnR5LCAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGF0YUNvbXBvbmVudENvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZyB7XG4gICAgLyoqXG4gICAgICAgICogYmluZHMgYSBjb21wb25lbnQgdG8gYSBkYXRhYmluZGVyXG4gICAgICAgICogQHBhcmFtIFt7amFzc2lqcy51aS5EYXRhYmluZGVyfSBkYXRhYmluZGVyIC0gdGhlIGRhdGFiaW5kZXIgdG8gYmluZCxcbiAgICAgICAgKiAgICAgICAgIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IHRvIGJpbmRdXG4gICAgICAgICovXG4gICAgYmluZD86IGFueVtdO1xuICAgIC8qKlxuICAgKiBAbWVtYmVyIHtib29sfSBhdXRvY29tbWl0IC0gIGlmIHRydWUgdGhlIGRhdGFiaW5kZXIgd2lsbCB1cGRhdGUgdGhlIHZhbHVlIG9uIGV2ZXJ5IGNoYW5nZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGZhbHNlIHRoZSBkYXRhYmluZGVyIHdpbGwgdXBkYXRlIHRoZSB2YWx1ZSBvbiBkYXRhYmluZGVyLnRvRm9ybSBcbiAgICovXG4gICAgYXV0b2NvbW1pdD86IGJvb2xlYW47XG4gICAgdmFsdWU/OiBhbnk7XG59XG5cbnZhciB0bXBEYXRhYmluZGVyID0gdW5kZWZpbmVkO1xuQCRDbGFzcyhcImphc3NpanMudWkuRGF0YUNvbXBvbmVudFwiKVxuZXhwb3J0IGNsYXNzIERhdGFDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQgaW1wbGVtZW50cyBEYXRhQ29tcG9uZW50Q29uZmlnIHtcbiAgICBfYXV0b2NvbW1pdDogYm9vbGVhbjtcbiAgICBfZGF0YWJpbmRlcjogRGF0YWJpbmRlcjtcblxuXG4gICAgLyoqXG4gICAgKiBiYXNlIGNsYXNzIGZvciBlYWNoIENvbXBvbmVudFxuICAgICogQGNsYXNzIGphc3NpanMudWkuQ29tcG9uZW50XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHByb3BlcnRpZXMgLSBwcm9wZXJ0aWVzIHRvIGluaXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3Byb3BlcnRpZXMuaWRdIC0gIGNvbm5lY3QgdG8gZXhpc3RpbmcgaWQgKG5vdCByZXFpcmVkKVxuICAgICAqIFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXMgPSB1bmRlZmluZWQpIHsvL2lkIGNvbm5lY3QgdG8gZXhpc3Rpbmcobm90IHJlcWlyZWQpXG4gICAgICAgIHN1cGVyKHByb3BlcnRpZXMpO1xuICAgICAgICB0aGlzLl9hdXRvY29tbWl0ID0gZmFsc2U7XG4gICAgfVxuICAgIGNvbmZpZyhjb25maWc6IERhdGFDb21wb25lbnRDb25maWcpOiBEYXRhQ29tcG9uZW50IHtcbiAgICAgICAgc3VwZXIuY29uZmlnKGNvbmZpZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KClcbiAgICBnZXQgYXV0b2NvbW1pdCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dG9jb21taXQ7XG4gICAgfVxuICAgIHNldCBhdXRvY29tbWl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2F1dG9jb21taXQgPSB2YWx1ZTtcbiAgICAgICAgLy9pZiAodGhpcy5fZGF0YWJpbmRlciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAvLyAgICB0aGlzLl9kYXRhYmluZGVyLmNoZWNrQXV0b2NvbW1pdCh0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIFtkYXRhYmluZGVyOmphc3NpanMudWkuRGF0YWJpbmRlcixcInByb3BlcnR5VG9CaW5kXCJdXG4gICAgICovXG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwiZGF0YWJpbmRlclwiIH0pXG4gICAgc2V0IGJpbmQoZGF0YWJpbmRlcjogYW55W10pIHtcbiAgICAgICAgaWYoZGF0YWJpbmRlcj09PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICBpZih0aGlzLl9kYXRhYmluZGVyIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhYmluZGVyLnJlbW92ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhYmluZGVyPXVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvcGVydHkgPSBkYXRhYmluZGVyWzFdO1xuICAgICAgICB0aGlzLl9kYXRhYmluZGVyID0gZGF0YWJpbmRlclswXTtcbiAgICAgICAgaWYgKHRoaXMuX2RhdGFiaW5kZXIgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX2RhdGFiaW5kZXIuYWRkKHByb3BlcnR5LCB0aGlzLCBcIm9uY2hhbmdlXCIpO1xuICAgIH1cblxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RhdGFiaW5kZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fZGF0YWJpbmRlci5yZW1vdmUodGhpcyk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhYmluZGVyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICB9XG59XG4iXX0=