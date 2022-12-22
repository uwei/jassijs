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
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    class Product {
        constructor(prod) {
            Object.assign(this, prod);
            this.dailyConsumtion = Math.round((100000 * this.amountForPeople / (parameter.workerInCompany * 19))) / 100000;
            this.pricePurchase = Math.round(this.priceProduction * parameter.ratePurchase);
            this.priceSelling = Math.round(this.priceProduction * parameter.rateSelling);
        }
        static randomUpdateConsumtion() {
            var prod1 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
            var prod2 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
            var proz = Math.round(getRandomInt(50)) / 10; //Prozent
            var diff = Math.round(100000 * prod1.dailyConsumtion * proz / 100) / 100000;
            var proz1 = prod1.dailyConsumtion + diff;
            var proz2 = prod2.dailyConsumtion - diff;
            //change should not be greater then 5%
            var test1 = Math.round((100000 * prod1.amountForPeople / (parameter.workerInCompany * parameter.allProducts.length))) / 100000;
            var test2 = Math.round((100000 * prod2.amountForPeople / (parameter.workerInCompany * parameter.allProducts.length))) / 100000;
            var abw1 = (proz1 - test1) / proz1;
            var abw2 = (proz2 - test2) / proz2;
            if (Math.abs(abw1) > 0.1 || Math.abs(abw2) > 0.1) {
                console.log("change price " + prod1.name + " +" + proz + "% and " + prod2.name + " -" + proz + "% failed. Diff is Prod1 " + Math.abs(abw1) + " Prod2 " + Math.abs(abw2));
                Product.randomUpdateConsumtion();
                return;
            }
            alert("change price " + prod1.name + " +" + proz + "% and " + prod2.name + " -" + proz);
            prod1.dailyConsumtion = prod1.dailyConsumtion + diff;
            prod2.dailyConsumtion = prod2.dailyConsumtion - diff;
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