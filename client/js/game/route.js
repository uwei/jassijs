define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Route = void 0;
    class Route {
        constructor() {
            this.type = "Route";
            this.unloadMarketAmount = [];
            this.unloadMarketPrice = [];
            this.unloadWarehouseAmount = [];
            this.loadMarketAmount = [];
            this.loadMarketPrice = [];
            this.loadWarehouseAmount = [];
            this.loadWarehouseUntilAmount = [];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                this.unloadMarketAmount.push(undefined);
                this.unloadMarketPrice.push(parameter.allProducts[x].priceSelling);
                this.unloadWarehouseAmount.push(undefined);
                this.loadMarketAmount.push(undefined);
                this.loadMarketPrice.push(parameter.allProducts[x].pricePurchase);
                this.loadWarehouseAmount.push(undefined);
                this.loadWarehouseUntilAmount.push(undefined);
            }
        }
        unloadMarket() {
            var city = this.airplane.world.cities[this.cityid];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var max = this.airplane.products[x];
                if (this.unloadMarketAmount[x] !== undefined) {
                    max = Math.min(this.airplane.products[x], this.unloadMarketAmount[x]);
                    if (max < 0)
                        max = 0;
                }
                else
                    max = 0;
                if (max) {
                    for (var y = 0; y < max; y++) {
                        var price = parameter.allProducts[x].calcPrice(city.people, city.market[x], false); //city.isProducedHere(x));
                        if (price >= this.unloadMarketPrice[x]) {
                            city.world.game.changeMoney(1 * price, "airplane sells from market", city);
                            city.market[x] += 1;
                            this.airplane.products[x] -= 1;
                            this.airplane.refreshLoadedCount();
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        unloadWarehouse() {
            var city = this.airplane.world.cities[this.cityid];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var max = this.unloadWarehouseAmount[x];
                if (max !== undefined) {
                    max = Math.min(max, this.airplane.products[x]);
                    if (max) {
                        this.airplane.products[x] -= max;
                        this.airplane.refreshLoadedCount();
                        city.warehouse[x] += max;
                    }
                }
            }
        }
        loadWarehouse() {
            var city = this.airplane.world.cities[this.cityid];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var max = this.loadWarehouseUntilAmount[x];
                if (max === undefined) {
                    max = this.loadWarehouseAmount[x];
                    if (max && max > city.warehouse[x])
                        max = city.warehouse[x];
                }
                else {
                    max = city.warehouse[x] - this.loadWarehouseUntilAmount[x];
                }
                if (max < 0)
                    max = 0;
                if (this.maxLoad !== undefined && max !== undefined) {
                    max = Math.min(this.maxLoad - this.airplane.products[x], max);
                    if (max < 0)
                        max = 0;
                }
                if (max && city.warehouseMinStock[x]) {
                    if (city.warehouse[x] - max < city.warehouseMinStock[x]) {
                        max = city.warehouse[x] - city.warehouseMinStock[x];
                        if (max < 0)
                            max = 0;
                    }
                }
                if (max && max > (this.airplane.capacity - this.airplane.loadedCount))
                    max = this.airplane.capacity - this.airplane.loadedCount;
                if (max) {
                    this.airplane.products[x] += max;
                    this.airplane.refreshLoadedCount();
                    city.warehouse[x] -= max;
                }
            }
        }
        loadMarket() {
            var city = this.airplane.world.cities[this.cityid];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var max = this.loadMarketAmount[x];
                if (this.maxLoad !== undefined && max) {
                    max = Math.min(max, this.maxLoad - this.airplane.products[x]);
                    if (max < 0)
                        max = 0;
                }
                if (max && max > (this.airplane.capacity - this.airplane.loadedCount))
                    max = this.airplane.capacity - this.airplane.loadedCount;
                if (max) {
                    for (var y = 0; y < max; y++) {
                        var price = parameter.allProducts[x].calcPrice(city.people, city.market[x] - 1, city.isProducedHere(x));
                        if (price <= this.loadMarketPrice[x]) {
                            city.world.game.changeMoney(-1 * price, "airplane buys from market", city);
                            city.market[x] -= 1;
                            this.airplane.products[x] += 1;
                            this.airplane.refreshLoadedCount();
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        load() {
            this.loadWarehouse();
            this.loadMarket();
        }
        unload() {
            this.unloadMarket();
            this.unloadWarehouse();
        }
    }
    exports.Route = Route;
});
//# sourceMappingURL=route.js.map