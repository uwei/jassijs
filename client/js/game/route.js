define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Route = void 0;
    class Route {
        constructor() {
            this.type = "Route";
            this.unloadMarketAmount = [];
            this.unloadMarketPrice = [];
            this.unloadshopAmount = [];
            this.loadMarketAmount = [];
            this.loadMarketPrice = [];
            this.loadshopAmount = [];
            this.loadshopUntilAmount = [];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                this.unloadMarketAmount.push(undefined);
                this.unloadMarketPrice.push(parameter.allProducts[x].priceSelling);
                this.unloadshopAmount.push(undefined);
                this.loadMarketAmount.push(undefined);
                this.loadMarketPrice.push(parameter.allProducts[x].pricePurchase);
                this.loadshopAmount.push(undefined);
                this.loadshopUntilAmount.push(undefined);
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
        unloadshop() {
            var city = this.airplane.world.cities[this.cityid];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var max = this.unloadshopAmount[x];
                if (max !== undefined) {
                    max = Math.min(max, this.airplane.products[x]);
                    if (max) {
                        this.airplane.products[x] -= max;
                        this.airplane.refreshLoadedCount();
                        city.shop[x] += max;
                    }
                }
            }
        }
        loadshop() {
            var city = this.airplane.world.cities[this.cityid];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var max = this.loadshopUntilAmount[x];
                if (max === undefined) {
                    max = this.loadshopAmount[x];
                    if (max && max > city.shop[x])
                        max = city.shop[x];
                }
                else {
                    max = city.shop[x] - this.loadshopUntilAmount[x];
                }
                if (max < 0)
                    max = 0;
                if (this.maxLoad !== undefined && max !== undefined) {
                    max = Math.min(this.maxLoad - this.airplane.products[x], max);
                    if (max < 0)
                        max = 0;
                }
                if (max && city.shopMinStock[x]) {
                    if (city.shop[x] - max < city.shopMinStock[x]) {
                        max = city.shop[x] - city.shopMinStock[x];
                        if (max < 0)
                            max = 0;
                    }
                }
                if (max && max > (this.airplane.capacity - this.airplane.loadedCount))
                    max = this.airplane.capacity - this.airplane.loadedCount;
                if (max) {
                    this.airplane.products[x] += max;
                    this.airplane.refreshLoadedCount();
                    city.shop[x] -= max;
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
            this.loadshop();
            this.loadMarket();
        }
        unload() {
            this.unloadMarket();
            this.unloadshop();
        }
    }
    exports.Route = Route;
});
//# sourceMappingURL=route.js.map