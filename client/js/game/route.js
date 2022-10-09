define(["require", "exports", "game/product"], function (require, exports, product_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Route = void 0;
    class Route {
        constructor() {
            this.unloadMarketAmount = [];
            this.unloadMarketPrice = [];
            this.unloadWarehouseAmount = [];
            this.loadMarketAmount = [];
            this.loadMarketPrice = [];
            this.loadWarehouseAmount = [];
            this.loadWarehouseUntilAmount = [];
            for (var x = 0; x < product_1.allProducts.length; x++) {
                this.unloadMarketAmount.push(undefined);
                this.unloadMarketPrice.push(product_1.allProducts[x].priceSelling);
                this.unloadWarehouseAmount.push(undefined);
                this.loadMarketAmount.push(undefined);
                this.loadMarketPrice.push(product_1.allProducts[x].pricePurchase);
                this.loadWarehouseAmount.push(undefined);
                this.loadWarehouseUntilAmount.push(undefined);
            }
        }
    }
    exports.Route = Route;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFHQSxNQUFhLEtBQUs7UUFTZDtZQUNJLElBQUksQ0FBQyxrQkFBa0IsR0FBQyxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLGlCQUFpQixHQUFDLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMscUJBQXFCLEdBQUMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxnQkFBZ0IsR0FBQyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBQyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLG1CQUFtQixHQUFDLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsd0JBQXdCLEdBQUMsRUFBRSxDQUFDO1lBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxxQkFBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxxQkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxxQkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ2pEO1FBQ0wsQ0FBQztLQUNKO0lBM0JELHNCQTJCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHsgYWxsUHJvZHVjdHMgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUm91dGUge1xyXG4gICAgY2l0eWlkOiBudW1iZXI7XHJcbiAgICB1bmxvYWRNYXJrZXRBbW91bnQ6IG51bWJlcltdO1xyXG4gICAgdW5sb2FkTWFya2V0UHJpY2U6IG51bWJlcltdO1xyXG4gICAgdW5sb2FkV2FyZWhvdXNlQW1vdW50OiBudW1iZXJbXTtcclxuICAgIGxvYWRNYXJrZXRBbW91bnQ6IG51bWJlcltdO1xyXG4gICAgbG9hZE1hcmtldFByaWNlOiBudW1iZXJbXTtcclxuICAgIGxvYWRXYXJlaG91c2VBbW91bnQ6IG51bWJlcltdO1xyXG4gICAgbG9hZFdhcmVob3VzZVVudGlsQW1vdW50OiBudW1iZXJbXTtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy51bmxvYWRNYXJrZXRBbW91bnQ9W107XHJcbiAgICAgICAgdGhpcy51bmxvYWRNYXJrZXRQcmljZT1bXTtcclxuICAgICAgICB0aGlzLnVubG9hZFdhcmVob3VzZUFtb3VudD1bXTtcclxuICAgICAgICB0aGlzLmxvYWRNYXJrZXRBbW91bnQ9W107XHJcbiAgICAgICAgdGhpcy5sb2FkTWFya2V0UHJpY2U9W107XHJcbiAgICAgICAgdGhpcy5sb2FkV2FyZWhvdXNlQW1vdW50PVtdO1xyXG4gICAgICAgIHRoaXMubG9hZFdhcmVob3VzZVVudGlsQW1vdW50PVtdO1xyXG4gICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMudW5sb2FkTWFya2V0QW1vdW50LnB1c2godW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgdGhpcy51bmxvYWRNYXJrZXRQcmljZS5wdXNoKGFsbFByb2R1Y3RzW3hdLnByaWNlU2VsbGluZyk7XHJcbiAgICAgICAgICAgIHRoaXMudW5sb2FkV2FyZWhvdXNlQW1vdW50LnB1c2godW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkTWFya2V0QW1vdW50LnB1c2godW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkTWFya2V0UHJpY2UucHVzaChhbGxQcm9kdWN0c1t4XS5wcmljZVB1cmNoYXNlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkV2FyZWhvdXNlQW1vdW50LnB1c2godW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnQucHVzaCh1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==