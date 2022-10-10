define(["require", "exports", "game/product", "game/icons"], function (require, exports, product_1, icons_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Company = void 0;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    var distributionTable = undefined;
    function getRandomCompanyType(notThisIds = undefined) {
        if (notThisIds === undefined)
            notThisIds = [];
        if (!distributionTable) {
            distributionTable = [];
            var distCount = 0;
            for (var x = 0; x < product_1.allProducts.length; x++) {
                for (var y = 0; y < product_1.allProducts[x].distribution; y++) {
                    distributionTable.push(product_1.allProducts[x].id);
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
    class Company {
        constructor(notThisIds = undefined) {
            this.buildings = 0;
            this.workers = 0;
            this.hasLicense = false;
            this.type = "Company";
            this.productid = getRandomCompanyType(notThisIds);
            this.buildings = 0; // getRandomInt(3)+1;
            this.workers = 25 * this.buildings;
            this.hasLicense = (product_1.allProducts[this.productid].distribution <= 8) ? false : true;
        }
        getMaxWorkers() {
            return this.buildings * 25;
        }
        getDailyProduce() {
            var produce = this.workers * product_1.allProducts[this.productid].dailyProduce / 25;
            return Math.round(produce);
        }
        getDailyInput1() {
            var needs = 0;
            var product = product_1.allProducts[this.productid];
            if (product.input1 !== undefined) {
                var p = product_1.allProducts[product.input1];
                needs = this.workers * product.input1Amount / 25;
            }
            return needs;
        }
        getBuildingCoastsAsIcon() {
            var a = this.getBuildingCoasts();
            return a[0] + icons_1.Icons.money + "<br/>" + a[1] + "x" + product_1.allProducts[0].getIcon() + "<br/>" + a[2] + "x" + product_1.allProducts[1].getIcon();
        }
        getBuildingCoasts() {
            var fact = 5 - (product_1.allProducts[this.productid].distribution) / 4;
            return [fact * 10000,
                fact * 5,
                fact * 10];
        }
        getDailyInput2() {
            var needs = 0;
            var product = product_1.allProducts[this.productid];
            if (product.input2 !== undefined) {
                needs = this.workers * product.input2Amount / 25;
            }
            return needs;
        }
    }
    exports.Company = Company;
    function test() {
        var ids = [];
        var t = [];
        for (var x = 0; x < product_1.allProducts.length; x++) {
            var h = new Company(ids);
            ids.push(h.productid);
            t.push(h.productid);
        }
        t.sort();
        for (var x = 0; x < t.length; x++) {
            console.log(t[x]);
        }
    }
    exports.test = test;
});
//# sourceMappingURL=company.js.map