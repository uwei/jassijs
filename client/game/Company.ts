import { allProducts } from "game/product";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
var distributionTable: number[] = undefined;

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
    constructor(notThisIds: number[] = undefined) {
        this.productid = getRandomCompanyType(notThisIds);
        this.buildings = getRandomInt(3)+1;
        this.workers = 25 * this.buildings;
    }
    getMaxWorkers(): number {
        return this.buildings * 25;
    }
    getDailyProduce(): number {
        var produce = this.workers * allProducts[this.productid].dailyProduce / 25;
        return Math.round(produce);
    }
    getDailyInput1(): number {
        var needs = 0;
        var product = allProducts[this.productid];
        if (product.input1 !== undefined) {
            var p= allProducts[product.input1];
            needs = this.workers * product.input1Amount/25;
        }
        return needs;
    }
    getDailyInput2(): number {
        var needs = 0;
        var product = allProducts[this.productid];
        if (product.input2 !== undefined) {
            needs = this.workers * product.input2Amount/25;
        }
        return needs;
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