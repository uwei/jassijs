define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Product = void 0;
    var log = (function () {
        var log = Math.log;
        return function (n, base) {
            return log(n) / (base ? log(base) : 1);
        };
    })();
    class Product {
        constructor(prod) {
            Object.assign(this, prod);
            this.dailyConsumtion = Math.round((10000 * this.amountForPeople / 380)) / 10000 - 0.0001;
            this.pricePurchase = Math.round(this.priceProduction * parameter.ratePurchase);
            this.priceSelling = Math.round(this.priceProduction * parameter.rateSelling);
        }
        getMinPrice() {
            return Math.round(this.priceSelling * parameter.ratePriceMin);
        }
        getMaxPrice() {
            return Math.round(this.priceSelling * parameter.ratePriceMax);
        }
        /**
         * calc price for a city with people and the
         */
        calcPrice0(people, amount, isProducedHere) {
            var consume = Math.round(this.dailyConsumtion * people * 40);
            var normal = isProducedHere ? this.pricePurchase : this.priceSelling;
            var min = Math.round((0.0 + normal) * parameter.ratePriceMin);
            var max = Math.round((0.0 + normal) * parameter.ratePriceMax);
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
        calcPrice(people, amount, isProducedHere) {
            var consume = Math.round(this.dailyConsumtion * people * 40);
            var normal = isProducedHere ? this.pricePurchase : this.priceSelling;
            var min = Math.round((0.0 + normal) * parameter.ratePriceMin);
            var max = Math.round((0.0 + normal) * parameter.ratePriceMax);
            var consumeMin = Math.round(consume * parameter.ratePriceMin);
            var consumeMax = Math.round(consume * parameter.ratePriceMax);
            if (amount < consumeMin)
                return max;
            if (amount > consumeMax)
                return min;
            var test = 0;
            if (amount > consume) {
                var exp = Math.round(log(consume - consumeMin, normal - min) * 1000) / 1000;
                var diff = Math.pow(amount - consume, 1 / exp);
                test = Math.round(normal - diff);
            }
            else {
                var exp = Math.round(log(-consume + consumeMax, -normal + max) * 1000) / 1000;
                var diff = Math.pow(-amount + consume, 1 / exp);
                test = Math.round(normal + diff);
            }
            // var test = Math.round(consume * normal / amount);
            // var test=Math.round((0.0+normal)+Math.pow(consume,0.6)-Math.pow(amount,0.6));
            /*        var test = Math.round(normal + (normal - (amount / consume * normal)));
                    if (test < min)
                        return min;
                    if (test > max || amount < 30) {
                        return max;
                    }*/
            return test;
        }
        getIcon() {
            var colors = [
                ["", "orange", "mdi-format-line-style"],
                ["", "green", "mdi-pine-tree"],
                ["", "yellow", "mdi-grass"],
                ["", "silver", "mdi-checkbox-blank-circle"],
                ["", "lightgray", "mdi-apple-icloud"],
                ["", "black", "mdi-water"],
                ["", "brown", "mdi-food-croissant"],
                ["blue", "red", "mdi-square-circle"],
                ["", "orange", "mdi-food-drumstick"],
                ["", "purple", "mdi-sofa"],
                ["", "lightblue", "mdi-tshirt-v"],
                ["", "gray", "mdi-fish"],
                ["", "red", "mdi-food-apple"],
                ["", "gamboge", "mdi-bottle-soda"],
                ["", "gold", "mdi-checkbox-blank-circle"],
                ["", "gold", "mdi-ring"],
                ["", "blue", "mdi-toy-brick"],
                ["", "black", "mdi-motorbike"],
                ["", "brown", "mdi-hamburger"],
            ];
            var ic = colors[this.id].length === 3 ? colors[this.id][2] : "mdi-circle-multiple";
            return "<span style='width:14px;font-size:15px;color:" + colors[this.id][1] + ";background-color:" + colors[this.id][0] + "' class='mdi " + ic + "'></span>";
        }
    }
    exports.Product = Product;
    /*export var parameter.allProducts = [
        new Product({ id: 0, name: "Holz", dailyProduce: 2.5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0015, priceProduction: 33, pricePurchase: 40, priceSelling: 59, distribution: 16 }),
        new Product({ id: 1, name: "Ziegel", dailyProduce: 6, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0029, priceProduction: 33, pricePurchase: 40, priceSelling: 59, distribution: 16 }),
        new Product({ id: 2, name: "Getreide", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.003068, priceProduction: 33, pricePurchase: 40, priceSelling: 59, distribution: 16 }),
        new Product({ id: 3, name: "Hanf", dailyProduce: 2.5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0015, priceProduction: 33, pricePurchase: 40, priceSelling: 59, distribution: 16 }),
        new Product({ id: 4, name: "Wolle", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 50, pricePurchase: 60, priceSelling: 90, distribution: 8 }),
        new Product({ id: 5, name: "Metalle", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 50, pricePurchase: 60, priceSelling: 90, distribution: 8 }),
        new Product({ id: 6, name: "Honig", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 50, pricePurchase: 60, priceSelling: 90, distribution: 8 }),
        new Product({ id: 7, name: "Salz", dailyProduce: 1, input1: 0, input1Amount: 0.25, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0006, priceProduction: 58, pricePurchase: 70, priceSelling: 104, distribution: 8 }),
        new Product({ id: 8, name: "Metallwaren", dailyProduce: 1.5, input1: 0, input1Amount: 0.5, input2: 5, input2Amount: 5, dailyConsumtion: 0.0009, priceProduction: 167, pricePurchase: 200, priceSelling: 301, distribution: 8 }),
        new Product({ id: 9, name: "Met", dailyProduce: 2, input1: 6, input1Amount: 1, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 150, pricePurchase: 180, priceSelling: 270, distribution: 8 }),
        new Product({ id: 10, name: "Tuch", dailyProduce: 1, input1: 4, input1Amount: 1, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0006, priceProduction: 150, pricePurchase: 180, priceSelling: 270, distribution: 8 }),
        new Product({ id: 11, name: "Bier", dailyProduce: 3, input1: 2, input1Amount: 0.25, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001768, priceProduction: 75, pricePurchase: 90, priceSelling: 135, distribution: 4 }),
        new Product({ id: 12, name: "Stockfisch", dailyProduce: 3, input1: 7, input1Amount: 0.5, input2: 3, input2Amount: 3, dailyConsumtion: 0.001768, priceProduction: 129, pricePurchase: 155, priceSelling: 232, distribution: 4 }),
        new Product({ id: 13, name: "Kleidung", dailyProduce: 1, input1: 10, input1Amount: 1, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0006, priceProduction: 350, pricePurchase: 420, priceSelling: 630, distribution: 4 }),
        new Product({ id: 14, name: "Käse", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 100, pricePurchase: 120, priceSelling: 180, distribution: 4 }),
        new Product({ id: 15, name: "Pech", dailyProduce: 2, input1: 0, input1Amount: 0.5, input2: undefined, input2Amount: 0, dailyConsumtion: 0.001168, priceProduction: 117, pricePurchase: 140, priceSelling: 211, distribution: 4 }),
        new Product({ id: 16, name: "Felle", dailyProduce: 1, input1: 3, input1Amount: 0.5, input2: 8, input2Amount: 0.5, dailyConsumtion: 0.0006, priceProduction: 300, pricePurchase: 360, priceSelling: 540, distribution: 4 }),
        new Product({ id: 17, name: "Fleisch", dailyProduce: 1, input1: 7, input1Amount: 1.5, input2: undefined, input2Amount: 0, dailyConsumtion: 0.0006, priceProduction: 288, pricePurchase: 346, priceSelling: 518, distribution: 4 }),
        new Product({ id: 18, name: "Wein", dailyProduce: 0.5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.000336, priceProduction: 400, pricePurchase: 480, priceSelling: 720, distribution: 4 })
        //    new Product({ id:19, name: "Gewürze", dailyProduce: 0, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, dailyConsumtion: 0.000336, priceProduction: 0, pricePurchase: 600, priceSelling: 900 })
    ];*/
    function test() {
        var people = 30656;
        console.log(parameter.allProducts[1].pricePurchase + " " + Math.round(200 * parameter.allProducts[1].dailyConsumtion * 40));
        console.log(parameter.allProducts[1].calcPrice(200, 2, true));
    }
    exports.test = test;
});
//# sourceMappingURL=product.js.map