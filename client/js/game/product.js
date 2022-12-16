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
    function test() {
        var people = 30656;
        console.log(parameter.allProducts[1].pricePurchase + " " + Math.round(200 * parameter.allProducts[1].dailyConsumtion * 40));
        console.log(parameter.allProducts[1].calcPrice(200, 2, true));
    }
    exports.test = test;
});
//# sourceMappingURL=product.js.map