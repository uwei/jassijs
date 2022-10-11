import { Airplane } from "game/airplane";
import { allProducts } from "game/product";

export class Route {
    cityid: number;
    unloadMarketAmount: number[];
    unloadMarketPrice: number[];
    unloadWarehouseAmount: number[];
    loadMarketAmount: number[];
    loadMarketUntilAmount: number[];
    loadMarketPrice: number[];
    loadWarehouseAmount: number[];
    loadWarehouseUntilAmount: number[];
    airplane: Airplane;
    type = "Route";
    constructor() {
        this.unloadMarketAmount = [];
        this.unloadMarketPrice = [];
        this.unloadWarehouseAmount = [];
        this.loadMarketAmount = [];
        this.loadMarketUntilAmount = [];
        this.loadMarketPrice = [];
        this.loadWarehouseAmount = [];
        this.loadWarehouseUntilAmount = [];
        for (var x = 0; x < allProducts.length; x++) {
            this.unloadMarketAmount.push(undefined);
            this.unloadMarketPrice.push(allProducts[x].priceSelling);
            this.unloadWarehouseAmount.push(undefined);
            this.loadMarketAmount.push(undefined);
            this.loadMarketUntilAmount.push(undefined);
            this.loadMarketPrice.push(allProducts[x].pricePurchase);
            this.loadWarehouseAmount.push(undefined);
            this.loadWarehouseUntilAmount.push(undefined);
        }
    }
    unloadMarket() {
        var city = this.airplane.world.cities[this.cityid];
        for (var x = 0; x < allProducts.length; x++) {
            var max = this.airplane.products[x];

            if (this.unloadMarketAmount[x] !== undefined) {
                max=Math.min(this.airplane.products[x],this.unloadMarketAmount[x]);
                if(max<0)
                    max=0;
            }
            if(max){
                for (var y = 0; y < max; y++) {
                    var price = allProducts[x].calcPrice(city.people, city.market[x] + 1, city.isProducedHere(x));
                    if (price >= this.unloadMarketPrice[x]) {
                        city.world.game.money += 1 * price;
                        city.market[x] += 1;
                        this.airplane.products[x] -= 1;
                    } else {
                        break;

                    }
                }

            }
        }
    }
    loadMarket() {
        var city = this.airplane.world.cities[this.cityid];
        for (var x = 0; x < allProducts.length; x++) {
            var max = this.loadMarketAmount[x];
            if (this.loadMarketUntilAmount[x] !== undefined) {
                max=this.loadMarketUntilAmount[x]-this.airplane.products[x];
                if(max<0)
                    max=0;
            }
            if(max){
                for (var y = 0; y < max; y++) {
                    var price = allProducts[x].calcPrice(city.people, city.market[x] - 1, city.isProducedHere(x));
                    if (price <= this.loadMarketPrice[x]) {
                        city.world.game.money += -1 * price;
                        city.market[x] -= 1;
                        this.airplane.products[x] += 1;
                    } else {
                        break;

                    }
                }

            }
        }
    }
    load() {

        this.loadMarket();
    }
    unload() {

        this.unloadMarket();
    }
}