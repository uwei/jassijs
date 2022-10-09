import { Airplane } from "game/airplane";
import { allProducts } from "game/product";

export class Route {
    cityid: number;
    unloadMarketAmount: number[];
    unloadMarketPrice: number[];
    unloadWarehouseAmount: number[];
    loadMarketAmount: number[];
    loadMarketPrice: number[];
    loadWarehouseAmount: number[];
    loadWarehouseUntilAmount: number[];
    constructor(){
        this.unloadMarketAmount=[];
        this.unloadMarketPrice=[];
        this.unloadWarehouseAmount=[];
        this.loadMarketAmount=[];
        this.loadMarketPrice=[];
        this.loadWarehouseAmount=[];
        this.loadWarehouseUntilAmount=[];
         for (var x = 0; x < allProducts.length; x++) {
            this.unloadMarketAmount.push(undefined);
            this.unloadMarketPrice.push(allProducts[x].priceSelling);
            this.unloadWarehouseAmount.push(undefined);
            this.loadMarketAmount.push(undefined);
            this.loadMarketPrice.push(allProducts[x].pricePurchase);
            this.loadWarehouseAmount.push(undefined);
            this.loadWarehouseUntilAmount.push(undefined);
        }
    }
}