import { Airplane } from "game/airplane";


export class Route {
    cityid: number;
    maxLoad: number;
    unloadMarketAmount: number[];
    unloadMarketPrice: number[];
    unloadShopAmount: number[];
    loadMarketAmount: number[];
    loadMarketPrice: number[];
    loadShopAmount: number[];
    loadShopUntilAmount: number[];
    airplane: Airplane;
    type = "Route";
    constructor() {
        this.unloadMarketAmount = [];
        this.unloadMarketPrice = [];
        this.unloadShopAmount = [];
        this.loadMarketAmount = [];
        this.loadMarketPrice = [];
        this.loadShopAmount = [];
        this.loadShopUntilAmount = [];
        for (var x = 0; x < parameter.allProducts.length; x++) {
            this.unloadMarketAmount.push(undefined);
            this.unloadMarketPrice.push(parameter.allProducts[x].priceSelling);
            this.unloadShopAmount.push(undefined);
            this.loadMarketAmount.push(undefined);
            this.loadMarketPrice.push(parameter.allProducts[x].pricePurchase);
            this.loadShopAmount.push(undefined);
            this.loadShopUntilAmount.push(undefined);
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
            } else
                max = 0;
            if (max) {
                for (var y = 0; y < max; y++) {
                    var price = parameter.allProducts[x].calcPrice(city.people, city.market[x], false);//city.isProducedHere(x));
                    if (price >= this.unloadMarketPrice[x]) {
                        city.world.game.changeMoney(1 * price, "airplane sells from market", city);
                        city.market[x] += 1;
                        this.airplane.products[x] -= 1;
                        this.airplane.refreshLoadedCount();
                    } else {
                        break;

                    }
                }

            }
        }
    }
    unloadShop() {
        var city = this.airplane.world.cities[this.cityid];
        for (var x = 0; x < parameter.allProducts.length; x++) {
            var max = this.unloadShopAmount[x];
            if (max !== undefined) {
                max = Math.min(max, this.airplane.products[x]);
                if (max) {
                    var diff = city.shops * parameter.capacityShop - city.getCompleteAmount();
                    if(diff>0)
                        max=Math.min(max, diff);
                     else
                        max=0;
                    this.airplane.products[x] -= max;
                    this.airplane.refreshLoadedCount();
                    city.shop[x] += max;
                    diff = city.shops * parameter.capacityShop - city.getCompleteAmount();
                    if(diff<=0){
                        city.domShopfull.style.display = "initial";
                    }
                }
            }
        }
    }
    loadShop() {
        var city = this.airplane.world.cities[this.cityid];
        for (var x = 0; x < parameter.allProducts.length; x++) {
            var minStock=city.shopMinStock[x]?city.shopMinStock[x]:0;
            var max = this.loadShopUntilAmount[x];
            if (max === undefined) {
                max = this.loadShopAmount[x];
                if (max && max > (city.shop[x]-minStock))
                    max = city.shop[x]-minStock;
            } else {
                max = city.shop[x] - (this.loadShopUntilAmount[x]+minStock);
            }
             if (max < 0)
                max = 0;
            if (this.maxLoad !== undefined&&max!==undefined) {
                max = Math.min(this.maxLoad - this.airplane.products[x],max);
            } 
            if (max < 0)
                max = 0;
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
            if (this.maxLoad !== undefined&&max) {
                max = Math.min(max,this.maxLoad - this.airplane.products[x]);
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
                    } else {
                        break;

                    }
                }

            }
        }
    }
    load() {
        this.loadShop();
        this.loadMarket();
    }
    unload() {

        this.unloadMarket();
        this.unloadShop();
    }
}