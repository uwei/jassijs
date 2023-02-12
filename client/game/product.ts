import { Game } from "game/game";
import { Company } from "game/company";
import { DiagramDialog } from "game/diagramdialog";
import { World } from "game/world";

var log = (function () {
    var log = Math.log;
    return function (n, base) {
        return log(n) / (base ? log(base) : 1);
    };
})();
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
export class Product {
    id: number;
    name: string;
    dailyProduce: number;
    input1: number;
    input1Amount: number;
    input2: number;
    input2Amount: number;
    dailyConsumtion: number;
    priceProduction: number;
    pricePurchase: number;
    priceSelling: number;
    private amountForPeople: number;
    //how often it is used
    distribution: number;
    type = "Product";
    constructor(prod) {
        Object.assign(this, prod);
        this.dailyConsumtion = this.amountForPeople / (parameter.workerInCompany * 19);///Math.round((100000*this.amountForPeople/(parameter.workerInCompany*19)))/100000;
        this.pricePurchase = Math.round(this.priceProduction * parameter.ratePurchase);
        this.priceSelling = Math.round(this.priceProduction * parameter.rateSelling);
    }
    getAmountForPeople() {
        return this.amountForPeople;
    }
    getDiffConsumtion() {

        var test1 = this.getAmountForPeople() / (parameter.workerInCompany * parameter.allProducts.length);
        var abw1 = (this.dailyConsumtion - test1) / this.dailyConsumtion;
        return abw1;
    }
     private getBuildings(world:World){
        var ges=0;
        for(var x=0;x<world.cities.length;x++){
             for(var c=0;c<world.cities[x].companies.length;c++){
                if(world.cities[x].companies[c].productid===this.id){
                    ges+=(world.cities[x].companies[c].buildings);
                }
            }
        }
        return ges;
     }
    private getAverageBuildingCosts(world:World){
        var ges=0;
        var count=0;
        for(var x=0;x<world.cities.length;x++){
            for(var c=0;c<world.cities[x].companies.length;c++){
                if(world.cities[x].companies[c].productid===this.id){
                    count++;
                    ges+=(world.cities[x].companies[c].buildings-(world.cities[x].companies[c].buildingsWithoutCosts?world.cities[x].companies[c].buildingsWithoutCosts:0);
                }
            }
        }
        var comp=new Company();
        comp.productid=this.id;
        comp.buildings=Math.round(ges/count);
        comp.city=world.cities[0];
        return comp.getBuildingCosts();
    }
    static randomUpdateConsumtion(world:World) {
        var prod1 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
        var prod2 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
        if (getRandomInt(2) === 0) {//The Biggest diff should be smaller
            var varprod1 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
            if (prod1.getDiffConsumtion() < varprod1.getDiffConsumtion())
                prod1 = varprod1;
            var varprod2 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
            if (prod2.getDiffConsumtion() > varprod2.getDiffConsumtion())
                prod2 = varprod2;
        }
        var proz = Math.round(getRandomInt(50)) / 10;//Prozent
        var proz1 = prod1.dailyConsumtion * (1 - (proz / 100));

        //on lately game the prozent is smaller
        var costs=prod1.getAverageBuildingCosts(world);
        var profit=Game.instance.statistic.yesterday["people buy from the shop"];
        var diffbuildings=Math.round(1/100*prod1.getBuildings(world));
        var faktor=1;
        if(diffbuildings*costs>profit*7){ //the eliminated buildings by -1% should be buy back in 7 days
            faktor=(profit*5)/(diffbuildings*costs);
            proz=proz*faktor;
        }
        var ges = 0;
        for (var x = 0; x < parameter.allProducts.length; x++) {
            ges += parameter.allProducts[x].getDiffConsumtion();
        }

        var proz2 = prod2.dailyConsumtion * (1 + (proz / 100) - ges);


        //change should not be greater then 40%
        var test1 = prod1.amountForPeople / (parameter.workerInCompany * parameter.allProducts.length);
        var test2 = prod2.amountForPeople / (parameter.workerInCompany * parameter.allProducts.length);
        var abw1 = (proz1 - test1) / proz1;
        var abw2 = (proz2 - test2) / proz2;
        if (Math.abs(abw1) > 0.4 || Math.abs(abw2) > 0.4 || prod1 === prod2) {
            console.log("change price " + prod1.name + " -" + proz + "% and " + prod2.name + " +" + proz + "% failed. Diff is Prod1 " + Math.abs(abw1) + " Prod2 " + Math.abs(abw2));
            Product.randomUpdateConsumtion(world);
            return;
        }
        world.game.statistic.lastPriceChange="change price " + prod1.name + " -" + proz + "% and " + prod2.name + " +" + proz;
        console.log(world.game.statistic.lastPriceChange);
        prod1.dailyConsumtion = proz1;
        prod2.dailyConsumtion = proz2;

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
    calcPrice0(people: number, amount: number, isProducedHere: boolean) {
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

    calcPrice(people: number, amount: number, isProducedHere: boolean) {
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
        } else {
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



    getIcon(): string {
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

export function test() {
    var people = 30656;
    console.log(parameter.allProducts[1].pricePurchase + " " + Math.round(200 * parameter.allProducts[1].dailyConsumtion * 40));
    console.log(parameter.allProducts[1].calcPrice(200, 2, true));
}


