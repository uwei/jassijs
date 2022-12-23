define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Company = exports.debugNeed = void 0;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    var distributionTable = undefined;
    var debugNeed = [];
    exports.debugNeed = debugNeed;
    for (var x = 0; x < 19; x++) {
        debugNeed.push(0);
    }
    function getRandomCompanyType(notThisIds = undefined) {
        if (notThisIds === undefined)
            notThisIds = [];
        if (!distributionTable) {
            distributionTable = [];
            var distCount = 0;
            for (var x = 0; x < parameter.allProducts.length; x++) {
                for (var y = 0; y < parameter.allProducts[x].distribution; y++) {
                    distributionTable.push(parameter.allProducts[x].id);
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
        // static workerInCompany=20;
        constructor(notThisIds = undefined) {
            this.buildings = 0;
            this.workers = 0;
            this.hasLicense = false;
            this.type = "Company";
            this.dailyProducedToday = 0;
            this.productid = getRandomCompanyType(notThisIds);
            this.buildings = 0; // getRandomInt(3)+1;
            this.workers = parameter.workerInCompany * this.buildings;
            this.hasLicense = (parameter.allProducts[this.productid].distribution <= 2) ? false : true;
        }
        getMaxWorkers() {
            return this.buildings * parameter.workerInCompany;
        }
        getDailyProduce() {
            var produce = this.workers * parameter.allProducts[this.productid].dailyProduce / parameter.workerInCompany;
            return Math.round(produce);
        }
        getDailyInput1() {
            var needs = 0;
            var product = parameter.allProducts[this.productid];
            if (product.input1 !== undefined) {
                var p = parameter.allProducts[product.input1];
                needs = this.workers * product.input1Amount / parameter.workerInCompany;
            }
            return needs;
        }
        getDayilyCosts() {
            var fact = 8;
            if (parameter.allProducts[this.productid].distribution === 2) {
                fact = 9;
            }
            if (parameter.allProducts[this.productid].distribution === 1) {
                fact = 10;
            }
            return Math.round(this.workers * fact / parameter.allProducts[this.productid].dailyProduce);
        }
        getBuildingMaterial() {
            var fact = 4 - (parameter.allProducts[this.productid].distribution);
            return [];
        }
        getBuildingCosts() {
            var fact = 4 - (parameter.allProducts[this.productid].distribution);
            var buildings = this.buildings + this.city.getBuildingInProgress(this.productid);
            return Math.round(parameter.rateBuyBuilding * fact * 10000 + Math.round(parameter.rateBuyBuildingGrowFactor * buildings));
        }
        getDailyInput2() {
            var needs = 0;
            var product = parameter.allProducts[this.productid];
            if (product.input2 !== undefined) {
                needs = this.workers * product.input2Amount / parameter.workerInCompany;
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
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (this.workers === 0)
                return;
            var dayProcent = this.city.world.game.date.getHours() / 24;
            //  if (this.city.world.game.date.getDate() !== new Date(this.lastUpdate).getDate()) {
            if (this.city.world.game.date.getHours() === 23) {
                dayProcent = 1;
            }
            var prod = this.productid;
            var totalDailyProduce = Math.round(this.workers * parameter.allProducts[prod].dailyProduce / parameter.workerInCompany);
            var totalDailyNeed1 = undefined;
            var totalDailyNeed2 = undefined;
            if (parameter.allProducts[prod].input1 !== undefined)
                totalDailyNeed1 = Math.round(this.workers * parameter.allProducts[prod].input1Amount / parameter.workerInCompany);
            if (parameter.allProducts[prod].input2 !== undefined)
                totalDailyNeed2 = Math.round(this.workers * parameter.allProducts[prod].input2Amount / parameter.workerInCompany);
            if (this.dailyProducedToday === 0 && totalDailyNeed1 !== undefined) {
                if (totalDailyNeed1 >= this.city.shop[parameter.allProducts[prod].input1]) {
                    if (((_b = (_a = this.city.domProductNeeded[parameter.allProducts[prod].input1]) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.display) !== "initial")
                        this.city.domProductNeeded[parameter.allProducts[prod].input1].style.display = "initial";
                    // console.log(totalDailyNeed1 + "x" + parameter.allProducts[prod].input1 + " needed");
                    return;
                }
                else {
                    if (((_d = (_c = this.city.domProductNeeded[parameter.allProducts[prod].input1]) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.display) !== "none")
                        this.city.domProductNeeded[parameter.allProducts[prod].input1].style.display = "none";
                }
            }
            if (this.dailyProducedToday === 0 && totalDailyNeed2 !== undefined) {
                if (totalDailyNeed2 >= this.city.shop[parameter.allProducts[prod].input2]) {
                    if (((_f = (_e = this.city.domProductNeeded[parameter.allProducts[prod].input2]) === null || _e === void 0 ? void 0 : _e.style) === null || _f === void 0 ? void 0 : _f.display) !== "initial")
                        this.city.domProductNeeded[parameter.allProducts[prod].input2].style.display = "initial";
                    // console.log(totalDailyNeed2 + "x" + parameter.allProducts[prod].input2 + " needed");
                    return;
                }
                else {
                    if (((_h = (_g = this.city.domProductNeeded[parameter.allProducts[prod].input2]) === null || _g === void 0 ? void 0 : _g.style) === null || _h === void 0 ? void 0 : _h.display) !== "none")
                        this.city.domProductNeeded[parameter.allProducts[prod].input2].style.display = "none";
                }
            }
            var untilNow = Math.round(totalDailyProduce * dayProcent);
            if (untilNow > this.dailyProducedToday) {
                var diff = untilNow - this.dailyProducedToday;
                if (diff > 0) {
                    if (this.dailyProducedToday === 0) {
                        if (totalDailyNeed1 !== undefined) {
                            this.city.shop[parameter.allProducts[prod].input1] -= totalDailyNeed1;
                            debugNeed[parameter.allProducts[prod].input1] += totalDailyNeed1;
                        }
                        if (totalDailyNeed2 !== undefined) {
                            this.city.shop[parameter.allProducts[prod].input2] -= totalDailyNeed2;
                            debugNeed[parameter.allProducts[prod].input2] += totalDailyNeed2;
                        }
                    }
                    this.city.shop[prod] += diff;
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
    exports.Company = Company;
    function test() {
        var ids = [];
        var t = [];
        for (var x = 0; x < parameter.allProducts.length; x++) {
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