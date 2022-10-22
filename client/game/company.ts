import { allProducts } from "game/product";
import { Icons } from "game/icons";
import { City } from "game/city";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
var distributionTable: number[] = undefined;
var debugNeed=[];
for(var x=0;x<19;x++){
    debugNeed.push(x);
}
export {debugNeed};
function getRandomCompanyType(notThisIds: number[] = undefined) {
    if (notThisIds === undefined)
        notThisIds = [];
    if (!distributionTable) {
        distributionTable = [];
        var distCount = 0;
        for (var x = 0; x < allProducts.length; x++) {
            for (var y = 0; y < allProducts[x].distribution; y++) {
                distributionTable.push(allProducts[x].id);
            }
        }
    }
    var rand = undefined;
    while (rand === undefined || notThisIds.indexOf(rand) > -1) {
        rand = getRandomInt(distributionTable.length);
        rand = distributionTable[rand];
    }

    return rand;
}
export class Company {
    productid: number;
    buildings: number = 0;
    workers: number = 0;
    hasLicense = false;
    type = "Company";
    dailyProducedToday: number;
    lastUpdate: number;
    city: City;
     static workerInCompany=20;
    constructor(notThisIds: number[] = undefined) {
        this.dailyProducedToday = 0;
        this.productid = getRandomCompanyType(notThisIds);
        this.buildings = 0;// getRandomInt(3)+1;
        this.workers = Company.workerInCompany * this.buildings;
        this.hasLicense = (allProducts[this.productid].distribution <= 8) ? false : true;

    }
    getMaxWorkers(): number {
        return this.buildings * Company.workerInCompany;
    }
    getDailyProduce(): number {
        var produce = this.workers * allProducts[this.productid].dailyProduce / Company.workerInCompany;
        return Math.round(produce);
    }
    getDailyInput1(): number {
        var needs = 0;
        var product = allProducts[this.productid];
        if (product.input1 !== undefined) {
            var p = allProducts[product.input1];
            needs = this.workers * product.input1Amount / Company.workerInCompany;
        }
        return needs;
    }
    getDayilyCosts(){
        var fact=8;
        if(allProducts[this.productid].distribution===8){
            fact=9;
        }
        if(allProducts[this.productid].distribution===4){
            fact=10;
        }
        return Math.round(this.workers*fact/allProducts[this.productid].dailyProduce);
    }
    getBuildingMaterial() {
        var fact = 5 - (allProducts[this.productid].distribution) / 4;
        return [
            fact * 5,
            fact * 10]
    }
    getBuildingCosts() {
        var fact = 5 - (allProducts[this.productid].distribution) / 4;
        return fact * 10000;
    }
    getDailyInput2(): number {
        var needs = 0;
        var product = allProducts[this.productid];
        if (product.input2 !== undefined) {
            needs = this.workers * product.input2Amount /Company.workerInCompany;
        }
        return needs;
    }
    update() {
        if (this.lastUpdate === undefined) {
            this.lastUpdate = this.city.world.game.date.getTime();
        }
        this.updateProduction();
        this.lastUpdate = this.city.world.game.date.getTime();
    }
    updateProduction() {

        if (this.workers === 0)
            return;
        var dayProcent = this.city.world.game.date.getHours() / 24;
      //  if (this.city.world.game.date.getDate() !== new Date(this.lastUpdate).getDate()) {
        if(this.city.world.game.date.getHours()===23){
            dayProcent = 1;
        }

        var prod = this.productid;
        var totalDailyProduce = Math.round(this.workers * allProducts[prod].dailyProduce / Company.workerInCompany);
        var totalDailyNeed1 = undefined;
        var totalDailyNeed2 = undefined;
        if (allProducts[prod].input1!==undefined)
            totalDailyNeed1 = Math.round(this.workers * allProducts[prod].input1Amount / Company.workerInCompany);
        if (allProducts[prod].input2!==undefined)
            totalDailyNeed2 = Math.round(this.workers * allProducts[prod].input2Amount / Company.workerInCompany);

        if (this.dailyProducedToday === 0 && totalDailyNeed1 !== undefined) {
            if (totalDailyNeed1 >= this.city.warehouse[allProducts[prod].input1]) {
               // console.log(totalDailyNeed1 + "x" + allProducts[prod].input1 + " needed");
                return;
            } else {

            }
        }
        if (this.dailyProducedToday === 0 && totalDailyNeed2 !== undefined) {
            if (totalDailyNeed2 >= this.city.warehouse[allProducts[prod].input2]) {
               // console.log(totalDailyNeed2 + "x" + allProducts[prod].input2 + " needed");
                return;
            }
        }
        var untilNow = Math.round(totalDailyProduce * dayProcent);
        if (untilNow > this.dailyProducedToday) {
            var diff = untilNow - this.dailyProducedToday;
            if (diff > 0) {
                if (this.dailyProducedToday === 0) {
                    if (totalDailyNeed1 !== undefined){
                        this.city.warehouse[allProducts[prod].input1] -= totalDailyNeed1;
                         debugNeed[allProducts[prod].input1]+=totalDailyNeed1;
                    }
                    if (totalDailyNeed2 !== undefined){
                        this.city.warehouse[allProducts[prod].input2] -= totalDailyNeed2;
                        debugNeed[allProducts[prod].input2]+=totalDailyNeed2;
                    }
                }
                this.city.warehouse[prod] += diff;
               // console.log(diff + "x" + prod + " produced");
                this.dailyProducedToday = this.dailyProducedToday + diff;
            }



        }
        if (dayProcent === 1) {
            //console.log("prod "+this.productid+ " "+this.dailyProducedToday);

            this.dailyProducedToday = 0;
        }
    }

}
export function test() {
    var ids = [];
    var t = [];
    for (var x = 0; x < allProducts.length; x++) {
        var h = new Company(ids);
        ids.push(h.productid);
        t.push(h.productid);
    }
    t.sort();
    for (var x = 0; x < t.length; x++) {
        console.log(t[x]);
    }
}