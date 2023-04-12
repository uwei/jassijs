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
        var abw1 = (this.dailyConsumtion - test1) / test1;
        return abw1;
    }
    private getBuildings(world: World) {
        var ges = 0;
        for (var x = 0; x < world.cities.length; x++) {
            for (var c = 0; c < world.cities[x].companies.length; c++) {
                if (world.cities[x].companies[c].productid === this.id) {
                    ges += (world.cities[x].companies[c].buildings);
                }
            }
        }
        return ges;
    }
    private getAverageBuildingCosts(world: World) {
        var ges = 0;
        var count = 0;
        for (var x = 0; x < world.cities.length; x++) {
            for (var c = 0; c < world.cities[x].companies.length; c++) {
                if (world.cities[x].companies[c].productid === this.id) {
                    count++;
                    ges += (world.cities[x].companies[c].buildings - (world.cities[x].companies[c].buildingsWithoutCosts ? world.cities[x].companies[c].buildingsWithoutCosts : 0));
                }
            }
        }
        var comp = new Company();
        comp.productid = this.id;
        comp.buildings = Math.round(ges / count);
        comp.city = world.cities[0];
        return comp.getBuildingCosts();
    }
    /**
     * -40% stone and +40% fishburger is a problem, because there are also worker for fish and bred needed
     */
    private static getFactor(prod: Product) {
        var ret = 1 / prod.dailyProduce;
        if (prod.input1) {
            var f = prod.input1Amount / parameter.allProducts[prod.input1].dailyProduce;
            ret += f;
            ret += f * Product.getFactor(parameter.allProducts[prod.input1]);
        }
        if (prod.input2) {
            ret += prod.input2Amount / parameter.allProducts[prod.input2].dailyProduce;
            ret += f;
            ret += f * Product.getFactor(parameter.allProducts[prod.input2]);
        }
        return ret;
    }
    /**
    * -40% stone and +40% fishburger is a problem, because there are also worker for fish and bred needed
    */
    private static getFactorOld(prod: Product) {
        var ret = 0;
        if (prod.input1) {
            var f = prod.input1Amount / parameter.allProducts[prod.input1].dailyProduce;
            ret += f;
            ret += f * Product.getFactor(parameter.allProducts[prod.input1]);
        }
        if (prod.input2) {
            ret += prod.input2Amount / parameter.allProducts[prod.input2].dailyProduce;
            ret += f;
            ret += f * Product.getFactor(parameter.allProducts[prod.input2]);
        }
        return ret;
    }
    static randomUpdateConsumtion(world: World, product1: number = undefined, product2: number = undefined, proz = undefined, changeBuildings = false) {

        if (product1 === undefined)
            product1 = getRandomInt(parameter.allProducts.length);
        if (product2 === undefined)
            product2 = getRandomInt(parameter.allProducts.length);
        var prod1 = parameter.allProducts[product1];
        var prod2 = parameter.allProducts[product2];
        if (prod1 === prod2) {
            Product.randomUpdateConsumtion(world);
            return;
        }
     /*   if (getRandomInt(2) === 0) {//The Biggest diff should be smaller
            var varprod1 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
            if (prod1.getDiffConsumtion() < varprod1.getDiffConsumtion())
                prod1 = varprod1;
            var varprod2 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
            if (prod2.getDiffConsumtion() > varprod2.getDiffConsumtion())
                prod2 = varprod2;
        }*/
        if (proz === undefined)
            proz = Math.round(getRandomInt(50)) / 10;//Prozent





        //on lately game the prozent is smaller
        var costs = prod1.getAverageBuildingCosts(world);
        var profit = Game.instance.statistic.yesterday["people buy from the shop"];
        var diffbuildings = Math.round(1 / 100 * prod1.getBuildings(world));
        var faktor = 1;
        if (diffbuildings * costs > profit * 7) { //the eliminated buildings by -1% should be buy back in 7 days
            faktor = (profit * 5) / (diffbuildings * costs);
            proz = proz * faktor;
        }

        var proz1 = prod1.dailyConsumtion * (1 - ((proz) / 100));
        var companycount=0;//1000;
        for(var x=0;x<world.cities.length;x++){
            for(var y=0;y<world.cities[x].companies.length;y++){
                companycount+=world.cities[x].companies[y].buildings;
            }    
        }   
       // companycount=100000;//Math.round(companycount/parameter.allProducts.length);//each agerage of companies
        
        var people = parameter.workerInCompany * parameter.allProducts.length * companycount;//10000companies
        if(people==0)
            return;
        class ProductCalc {
            neededInProduction = 0;
            buildings = 0;
            neededForPeople = 0;

        }
        var allCalc: ProductCalc[] = [];
        for (var x = 0; x < parameter.allProducts.length; x++) {
            allCalc.push(new ProductCalc());
        }
        var proz2=parameter.allProducts[product2].dailyConsumtion;
        for (var recurse = 0; recurse < 50; recurse++) {
            var allBuildings = 0;
            for (var x = 0; x < parameter.allProducts.length; x++) {
                 allCalc[x].neededInProduction=0;
            }
            for (var x = parameter.allProducts.length - 1; x >= 0; x--) {
                var calc = allCalc[x];
                var p = parameter.allProducts[x];
                var cons = p.dailyConsumtion;
                if (x === product1)
                    cons = proz1;
                if(x===product2)
                    cons=proz2;
                calc.neededForPeople = Math.round(cons * people);
                calc.buildings = Math.round((calc.neededForPeople + calc.neededInProduction) / p.dailyProduce);
                if (p.input1 !== undefined) {
                    allCalc[p.input1].neededInProduction += calc.buildings * p.input1Amount;
                }
                if (p.input2 !== undefined) {
                    allCalc[p.input2].neededInProduction += calc.buildings * p.input2Amount;
                }
                allBuildings += calc.buildings;
            }
            var diffBuildings = parameter.allProducts.length * companycount - allBuildings;
            allCalc[product2].buildings += diffBuildings;
            allCalc[product2].neededForPeople += diffBuildings * parameter.allProducts[product2].dailyProduce;
            proz2 = allCalc[product2].neededForPeople / people;
           
        }
         if (changeBuildings) {
                world.cities[0].people = people;
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    world.cities[0].companies[x].buildings = allCalc[x].buildings;
                    world.cities[0].companies[x].workers = allCalc[x].buildings * parameter.workerInCompany;
                }
            }
        //var proz2 =  prod2.dailyConsumtion * (1 + ((prozadd/5)/100 ));

        /*   if(changeBuildings){
               var count=Math.round(world.cities[0].companies[product1].buildings*proz/100);
               world.cities[0].companies[product1].buildings=Math.round(world.cities[0].companies[product1].buildings-count);
               world.cities[0].companies[product2].buildings=Math.round(world.cities[0].companies[product2].buildings+count);
               world.cities[0].companies[product1].workers = Math.round(world.cities[0].companies[product1].workers -count*parameter.workerInCompany);
                world.cities[0].companies[product2].workers = Math.round(world.cities[0].companies[product2].workers +count*parameter.workerInCompany);
           }*/


        /*        var ges = 0;
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ges += parameter.allProducts[x].getDiffConsumtion();
                }
        
                var proz2 = prod2.dailyConsumtion * (1 + (proz / 100) - ges);*/

        //change should not be greater then 40%
        var test1 = prod1.amountForPeople / (parameter.workerInCompany * parameter.allProducts.length);
        var test2 = prod2.amountForPeople / (parameter.workerInCompany * parameter.allProducts.length);
        //var abw1 = (proz1 - test1) / proz1;
        //var abw2 = (proz2 - test2) / proz2;
        var abw1 = (test1-proz1) / test1;
        var abw2 = (test2 - proz2) / test2;
        if (Math.abs(abw1) > 0.4 || Math.abs(abw2) > 0.4 || prod1 === prod2) {
            console.log("change price " + prod1.name + " -" + proz + "% and " + prod2.name + " +" + proz + "% failed. Diff is Prod1 " + Math.abs(abw1) + " Prod2 " + Math.abs(abw2));
            Product.randomUpdateConsumtion(world);
            return;
        }
        world.game.statistic.lastPriceChange = "change price " + prod1.name + " -" + proz + "% and " + prod2.name + " +"+(( prod2.dailyConsumtion-proz2)*100/prod2.dailyConsumtion);
        console.log(world.game.statistic.lastPriceChange);
        prod1.dailyConsumtion = proz1;
        prod2.dailyConsumtion = proz2;

    }
    static randomUpdateConsumtion3(world: World, product1: number = undefined, product2: number = undefined, proz = undefined, changeBuildings = false) {

        if (product1 === undefined)
            product1 = getRandomInt(parameter.allProducts.length);
        if (product2 === undefined)
            product2 = getRandomInt(parameter.allProducts.length);
        var prod1 = parameter.allProducts[product1];
        var prod2 = parameter.allProducts[product2];
        if (prod1 === prod2) {
            Product.randomUpdateConsumtion(world);
            return;
        }
        if (getRandomInt(2) === 0) {//The Biggest diff should be smaller
            var varprod1 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
            if (prod1.getDiffConsumtion() < varprod1.getDiffConsumtion())
                prod1 = varprod1;
            var varprod2 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
            if (prod2.getDiffConsumtion() > varprod2.getDiffConsumtion())
                prod2 = varprod2;
        }
        if (proz === undefined)
            proz = Math.round(getRandomInt(50)) / 10;//Prozent





        //on lately game the prozent is smaller
        var costs = prod1.getAverageBuildingCosts(world);
        var profit = Game.instance.statistic.yesterday["people buy from the shop"];
        var diffbuildings = Math.round(1 / 100 * prod1.getBuildings(world));
        var faktor = 1;
        if (diffbuildings * costs > profit * 7) { //the eliminated buildings by -1% should be buy back in 7 days
            faktor = (profit * 5) / (diffbuildings * costs);
            proz = proz * faktor;
        }

        var proz1 = prod1.dailyConsumtion * (1 - ((proz) / 100));
        var diff = 0;//-1 / (parameter.workerInCompany * parameter.allProducts.length*4);//Mangelwirtschaft
        var oldp2 = 0;
        for (var x = 0; x < parameter.allProducts.length; x++) {
            var test = (x === prod1.id ? proz1 : parameter.allProducts[x].dailyConsumtion);// / parameter.allProducts[x].getAmountForPeople();
            var norm = parameter.allProducts[x].getAmountForPeople() / (parameter.workerInCompany * parameter.allProducts.length);
            var abwproz = (test - norm) / norm;
            var abwworker = abwproz * this.getFactor(parameter.allProducts[x]);
            //if (x !== prod2.id)
            diff += abwworker;
        }
        //var org = prod2.getAmountForPeople() / (parameter.workerInCompany * 19);
        var prozadd = -100 * diff * this.getFactor(prod2);
        var proz2 = 1.25 * 0.75 * prod2.amountForPeople / (parameter.workerInCompany * parameter.allProducts.length) + 0.25 * prod2.dailyProduce / (parameter.workerInCompany * parameter.allProducts.length);
        //var proz2 =  prod2.dailyConsumtion * (1 + ((prozadd/5)/100 ));

        if (changeBuildings) {
            var count = Math.round(world.cities[0].companies[product1].buildings * proz / 100);
            world.cities[0].companies[product1].buildings = Math.round(world.cities[0].companies[product1].buildings - count);
            world.cities[0].companies[product2].buildings = Math.round(world.cities[0].companies[product2].buildings + count);
            world.cities[0].companies[product1].workers = Math.round(world.cities[0].companies[product1].workers - count * parameter.workerInCompany);
            world.cities[0].companies[product2].workers = Math.round(world.cities[0].companies[product2].workers + count * parameter.workerInCompany);
        }


        /*        var ges = 0;
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ges += parameter.allProducts[x].getDiffConsumtion();
                }
        
                var proz2 = prod2.dailyConsumtion * (1 + (proz / 100) - ges);*/


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
        world.game.statistic.lastPriceChange = "change price " + prod1.name + " -" + proz + "% and " + prod2.name + " +" + prozadd;
        console.log(world.game.statistic.lastPriceChange);
        prod1.dailyConsumtion = proz1;
        prod2.dailyConsumtion = proz2;

    }
    static randomUpdateConsumtionAlt(world: World, product1: number = undefined, product2: number = undefined, proz = undefined, changeBuildings = false) {
        if (product1 === undefined)
            product1 = getRandomInt(parameter.allProducts.length);
        if (product2 === undefined)
            product2 = getRandomInt(parameter.allProducts.length);
        var prod1 = parameter.allProducts[product1];
        var prod2 = parameter.allProducts[product2];
        if (prod1 === prod2) {
            Product.randomUpdateConsumtion(world);
            return;
        }
        if (getRandomInt(2) === 0) {//The Biggest diff should be smaller
            var varprod1 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
            if (prod1.getDiffConsumtion() < varprod1.getDiffConsumtion())
                prod1 = varprod1;
            var varprod2 = parameter.allProducts[getRandomInt(parameter.allProducts.length)];
            if (prod2.getDiffConsumtion() > varprod2.getDiffConsumtion())
                prod2 = varprod2;
        }
        if (proz === undefined)
            proz = Math.round(getRandomInt(50)) / 10;//Prozent
        var proz1 = prod1.dailyConsumtion * (1 - (proz / 100));




        //on lately game the prozent is smaller
        var costs = prod1.getAverageBuildingCosts(world);
        var profit = Game.instance.statistic.yesterday["people buy from the shop"];
        var diffbuildings = Math.round(1 / 100 * prod1.getBuildings(world));
        var faktor = 1;
        if (diffbuildings * costs > profit * 7) { //the eliminated buildings by -1% should be buy back in 7 days
            faktor = (profit * 5) / (diffbuildings * costs);
            proz = proz * faktor;
        }

        var diff = 0;//-1 / (parameter.workerInCompany * parameter.allProducts.length*4);//Mangelwirtschaft
        var oldp2 = 0;
        for (var x = 0; x < parameter.allProducts.length; x++) {
            var test = (x === prod1.id ? proz1 : parameter.allProducts[x].dailyConsumtion) / parameter.allProducts[x].getAmountForPeople();
            var norm = 1 / (parameter.workerInCompany * parameter.allProducts.length);
            var d = test - norm;
            d = d * (1 + Product.getFactor(parameter.allProducts[x]));
            if (x === prod2.id)
                oldp2 = parameter.allProducts[x].dailyConsumtion;
            else
                diff += d;
        }

        var org = prod2.getAmountForPeople() / (parameter.workerInCompany * 19);
        var proz2 = org - diff * prod2.getAmountForPeople() / (1 + Product.getFactor(prod2));


        /*        var ges = 0;
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ges += parameter.allProducts[x].getDiffConsumtion();
                }
        
                var proz2 = prod2.dailyConsumtion * (1 + (proz / 100) - ges);*/


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
        world.game.statistic.lastPriceChange = "change price " + prod1.name + " -" + proz + "% and " + prod2.name + " +" + (100 * (oldp2 - proz2) / oldp2);
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

}


