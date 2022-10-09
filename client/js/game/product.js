//25 Arbeiter je Haus
//0.14 Kosten je Arbeiter je Tag
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.allProducts = exports.Product = void 0;
    class Product {
        constructor(prod) {
            Object.assign(this, prod);
        }
        getMinPrice() {
            return Math.round(this.priceSelling * 2 / 3);
        }
        getMaxPrice() {
            return Math.round(this.priceSelling * 5 / 3);
        }
        /**
         * calc price for a city with people and the
         */
        calcPrice(people, amount, isProducedHere) {
            var consume = Math.round(this.dailyConsumtion * people * 4);
            var normal = isProducedHere ? this.pricePurchase : this.priceSelling;
            var min = Math.round((0.0 + normal) * 2 / 3);
            var max = Math.round((0.0 + normal) * 5 / 3);
            // var test = Math.round(consume * normal / amount);
            // var test=Math.round((0.0+normal)+Math.pow(consume,0.6)-Math.pow(amount,0.6));
            var test = Math.round(normal + (normal - (amount / consume * normal)));
            if (test < min)
                return min;
            if (test > max || amount < 30) {
                return max;
            }
            return test;
        }
        getIcon() {
            var colors = [
                ["green", "brown"],
                ["white", "amber"],
                ["white", "yellow"],
                ["green", "yellow"],
                ["lightgray", "white"],
                ["white", "silver"],
                ["white", "khaki"],
                ["lightblue", "white"],
                ["brown", "silver"],
                ["brown", "khaki"],
                ["white", "blue"],
                ["brown", "yellow"],
                ["blue", "white"],
                ["red", "blue"],
                ["blue", "white"],
                ["white", "black"],
                ["white", "brown"],
                ["white", "red"],
                ["white", "violet"],
                ["white", "pink"]
            ];
            return "<span style='width:14px;font-size:10px;color:" + colors[this.id][1] + ";background-color:" + colors[this.id][0] + "' class='mdi mdi-circle-multiple'></span>";
        }
    }
    exports.Product = Product;
    exports.allProducts = [
        new Product({ id: 0, name: "Holz", dailyProduce: 2.5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.015, priceProduction: 33, pricePurchase: 40, priceSelling: 59, distribution: 16 }),
        new Product({ id: 1, name: "Ziegel", dailyProduce: 6, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.029, priceProduction: 33, pricePurchase: 40, priceSelling: 59, distribution: 16 }),
        new Product({ id: 2, name: "Getreide", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.03068, priceProduction: 33, pricePurchase: 40, priceSelling: 59, distribution: 16 }),
        new Product({ id: 3, name: "Hanf", dailyProduce: 2.5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.015, priceProduction: 33, pricePurchase: 40, priceSelling: 59, distribution: 16 }),
        new Product({ id: 4, name: "Wolle", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.01168, priceProduction: 50, pricePurchase: 60, priceSelling: 90, distribution: 8 }),
        new Product({ id: 5, name: "Metalle", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.01168, priceProduction: 50, pricePurchase: 60, priceSelling: 90, distribution: 8 }),
        new Product({ id: 6, name: "Honig", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.01168, priceProduction: 50, pricePurchase: 60, priceSelling: 90, distribution: 8 }),
        new Product({ id: 7, name: "Salz", dailyProduce: 1, input1: 0, input1Amount: 0.25, input2: undefined, input2Amount: 0, dailyConsumtion: 0.006, priceProduction: 58, pricePurchase: 70, priceSelling: 104, distribution: 8 }),
        new Product({ id: 8, name: "Metallwaren", dailyProduce: 1.5, input1: 0, input1Amount: 0.5, input2: 5, input2Amount: 5, dailyConsumtion: 0.009, priceProduction: 167, pricePurchase: 200, priceSelling: 301, distribution: 8 }),
        new Product({ id: 9, name: "Met", dailyProduce: 2, input1: 6, input1Amount: 1, input2: undefined, input2Amount: 0, dailyConsumtion: 0.01168, priceProduction: 150, pricePurchase: 180, priceSelling: 270, distribution: 8 }),
        new Product({ id: 10, name: "Tuch", dailyProduce: 1, input1: 4, input1Amount: 1, input2: undefined, input2Amount: 0, dailyConsumtion: 0.006, priceProduction: 150, pricePurchase: 180, priceSelling: 270, distribution: 8 }),
        new Product({ id: 11, name: "Bier", dailyProduce: 3, input1: 2, input1Amount: 0.25, input2: undefined, input2Amount: 0, dailyConsumtion: 0.01768, priceProduction: 75, pricePurchase: 90, priceSelling: 135, distribution: 4 }),
        new Product({ id: 12, name: "Stockfisch", dailyProduce: 3, input1: 7, input1Amount: 0.5, input2: 3, input2Amount: 3, dailyConsumtion: 0.01768, priceProduction: 129, pricePurchase: 155, priceSelling: 232, distribution: 4 }),
        new Product({ id: 13, name: "Kleidung", dailyProduce: 1, input1: 10, input1Amount: 1, input2: undefined, input2Amount: 0, dailyConsumtion: 0.006, priceProduction: 350, pricePurchase: 420, priceSelling: 630, distribution: 4 }),
        new Product({ id: 14, name: "Käse", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.01168, priceProduction: 100, pricePurchase: 120, priceSelling: 180, distribution: 4 }),
        new Product({ id: 15, name: "Pech", dailyProduce: 2, input1: 0, input1Amount: 0.5, input2: undefined, input2Amount: 0, dailyConsumtion: 0.01168, priceProduction: 117, pricePurchase: 140, priceSelling: 211, distribution: 4 }),
        new Product({ id: 16, name: "Felle", dailyProduce: 1, input1: 3, input1Amount: 0.5, input2: 8, input2Amount: 0.5, dailyConsumtion: 0.006, priceProduction: 300, pricePurchase: 360, priceSelling: 540, distribution: 4 }),
        new Product({ id: 17, name: "Fleisch", dailyProduce: 1, input1: 7, input1Amount: 1.5, input2: undefined, input2Amount: 0, dailyConsumtion: 0.006, priceProduction: 288, pricePurchase: 346, priceSelling: 518, distribution: 4 }),
        new Product({ id: 18, name: "Wein", dailyProduce: 0.5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.00336, priceProduction: 400, pricePurchase: 480, priceSelling: 720, distribution: 4 })
        //    new Product({ id:19, name: "Gewürze", dailyProduce: 0, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.00336, priceProduction: 0, pricePurchase: 600, priceSelling: 900 })
    ];
    function test() {
        var people = 30656;
        var prodid = 4;
        var prod = exports.allProducts[4];
        /* var consume = Math.round(prod.dailyConsumtion * people * 4);
         var normal = prod.pricePurchase;
         var min = Math.round(normal * 2 / 3);
         var max = Math.round(normal * 5 / 3);
         var testmenge = 10;
         var test = Math.round(consume * normal / testmenge);
         //allProducts[2].calcPrice(10000,0);
         //((23.5+60*0.4)*60-0.4*Math.pow(60,2))
         //console.log(consume);
         var p=(23.5+60*0.4)/-0.4;
         var q=500/0.4;
         var x2=-p/2+Math.sqrt((Math.pow(p/2,2))-q);
     */
        console.log(prod.calcPrice(people, 99, true));
    }
    exports.test = test;
});
//# sourceMappingURL=product.js.map