define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Product = exports.allProducts = void 0;
    exports.allProducts = [
        { name: "Holz", dailyProduce: 2.5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0015, priceProduction: 33, pricePurchase: 40, priceSelling: 59 },
        { name: "Ziegel", dailyProduce: 6, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0029, priceProduction: 33, pricePurchase: 40, priceSelling: 59 },
        { name: "Getreide", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.003068, priceProduction: 33, pricePurchase: 40, priceSelling: 59 },
        { name: "Hanf", dailyProduce: 2.5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0015, priceProduction: 33, pricePurchase: 40, priceSelling: 59 },
        { name: "Wolle", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 50, pricePurchase: 60, priceSelling: 90 },
        { name: "Metalle", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 50, pricePurchase: 60, priceSelling: 90 },
        { name: "Honig", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 50, pricePurchase: 60, priceSelling: 90 },
        { name: "Salz", dailyProduce: 1, input1: 0, input1Amount: 0.25, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0006, priceProduction: 58, pricePurchase: 70, priceSelling: 104 },
        { name: "Metallwaren", dailyProduce: 1.5, input1: 0, input1Amount: 0.5, input2: 5, input2Amount: 1, dailyConsumtion: 0.0009, priceProduction: 167, pricePurchase: 200, priceSelling: 301 },
        { name: "Met", dailyProduce: 2, input1: 6, input1Amount: 1, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 150, pricePurchase: 180, priceSelling: 270 },
        { name: "Tuch", dailyProduce: 1, input1: 4, input1Amount: 1, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0006, priceProduction: 150, pricePurchase: 180, priceSelling: 270 },
        { name: "Bier", dailyProduce: 3, input1: 2, input1Amount: 0.25, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001768, priceProduction: 75, pricePurchase: 90, priceSelling: 135 },
        { name: "Stockfisch", dailyProduce: 3, input1: 7, input1Amount: 0.5, input2: 3, input2Amount: 1, dailyConsumtion: 0.001768, priceProduction: 129, pricePurchase: 155, priceSelling: 232 },
        { name: "Kleidung", dailyProduce: 1, input1: 10, input1Amount: 1, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0006, priceProduction: 350, pricePurchase: 420, priceSelling: 630 },
        { name: "Käse", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 100, pricePurchase: 120, priceSelling: 180 },
        { name: "Pech", dailyProduce: 2, input1: 0, input1Amount: 0.5, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 117, pricePurchase: 140, priceSelling: 211 },
        { name: "Felle", dailyProduce: 1, input1: 3, input1Amount: 0.5, input2: 8, input2Amount: 0.5, dailyConsumtion: 0.0006, priceProduction: 300, pricePurchase: 360, priceSelling: 540 },
        { name: "Fleisch", dailyProduce: 1, input1: 7, input1Amount: 1.5, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0006, priceProduction: 288, pricePurchase: 346, priceSelling: 518 },
        { name: "Wein", dailyProduce: 0.5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.000336, priceProduction: 400, pricePurchase: 480, priceSelling: 720 },
        { name: "Gewürze", dailyProduce: 0, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.000336, priceProduction: 0, pricePurchase: 600, priceSelling: 900 }
    ];
    //25 Arbeiter je Haus
    //0.14 Kosten je Arbeiter je Tag
    class Product {
    }
    exports.Product = Product;
});
//# sourceMappingURL=products.js.map