import { World } from "game/world";
import { CityDialog } from "game/citydialog";
import { Product } from "game/product";
import { Company, debugNeed } from "game/company";
import { Airplane } from "game/airplane";
import { Icons } from "game/icons";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
class QueueItem {
    typeid: number;
    name: string;
    ready: number;
}
export class City {
    id: number;
    x: number;
    y: number;
    name: string;
    country: string;
    icon: string;
    dom: HTMLElement;
    domAirport: HTMLElement;
    domStar: HTMLElement;
    domRating: HTMLSpanElement;
    domProductNeeded: HTMLSpanElement[] = [];
    domWarning: HTMLSpanElement;
    domDesc: HTMLSpanElement;
    domShopinfo: HTMLTableElement;
    world: World;
    people: number;
    market: number[];
    companies: Company[];
    neutralDailyProducedToday: number[];
    consumedToday: number[];
    lastUpdate = undefined;
    score: number[] = [];
    shop: number[] = [];
    shops = 0;
    houses = 0;
    buildingplaces = 0;
    shopMinStock: number[];
    //shopSellingPrice: number[];
    queueAirplane: QueueItem[] = [];
    queueBuildings: QueueItem[] = [];
    domShopfull: HTMLSpanElement;
    type = "City";
    domName: HTMLSpanElement;
    domPeople: HTMLSpanElement;
    hasAirport;
    cityShowShopInfo: boolean;
    constructor() {
        this.hasAirport = true;
        this.people = parameter.neutralStartPeople;
        this.market = [];
        this.shopMinStock = [];
        //this.shopSellingPrice = [];
        this.createCompanies();
        for (var x = 0; x < parameter.allProducts.length; x++) {
            var val = 0;
            this.score.push(50);
            /* for (var y = 0; y < this.companies.length; y++) {
                 if (this.companies[y].productid === x) {
                     val = 22 * Math.round(parameter.neutralStartPeople * parameter.allProducts[x].dailyConsumtion * parameter.neutralProductionRate);
                 }
             }
             if (val === 0) {*/
            val = 10 * Math.round(parameter.neutralStartPeople * parameter.allProducts[x].dailyConsumtion * parameter.neutralProductionRate);

            //}
            this.shopMinStock.push(undefined);
            //this.shopSellingPrice.push(this.isProducedHere(x) ? parameter.allProducts[x].pricePurchase : parameter.allProducts[x].priceSelling);
            this.shop.push(0);
            this.market.push(val);
        }
    }

    private createCompanies() {
        var allready = [];
        this.companies = [];
        for (var x = 0; x < 5; x++) {
            var comp = new Company(allready);
            comp.city = this;
            this.companies.push(comp);
            allready.push(comp.productid);
        }
        this.companies.sort((a, b) => {
            return a.productid - b.productid;
        });
    }
    getAirplanesInCity(): Airplane[] {
        var ret: Airplane[] = [];
        for (var x = 0; x < this.world.airplanes.length; x++) {
            var ap = this.world.airplanes[x];
            if (ap.x === this.x && ap.y === this.y)
                ret.push(ap);
        }
        return ret;
    }
    renderWarningIcons() {
        this.domShopfull = <any>document.createRange().createContextualFragment(Icons.store).children[0];
        this.domShopfull.style.color = "red";
        this.domShopfull.style.display = "none";
        this.domWarning.appendChild(this.domShopfull);

        this.domRating = <any>document.createRange().createContextualFragment(Icons.people).children[0];
        this.domRating.style.color = "red";
        this.domRating.style.display = "none";
        this.domWarning.appendChild(this.domRating);

        this.domProductNeeded = [];
        for (var x = 0; x < parameter.allProducts.length; x++) {
            var dom = <any>document.createRange().createContextualFragment(parameter.allProducts[x].getIcon()).children[0];
            //this.dom.style.color = "red";
            dom.style.display = "none";
            this.domWarning.appendChild(dom);
            this.domProductNeeded.push(dom);
        }

    }
    move(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.dom.style.left = x + "px";
        this.dom.style.top = y + "px";
        this.domAirport.style.top = (y) + "px";
        this.domAirport.style.left = (x - 20) + "px";
        this.domDesc.style.top = (y + 30) + "px";
        this.domDesc.style.left = (x - 20) + "px";
        this.domStar.style.top = (y) + "px";
        this.domStar.style.left = (x + 16) + "px";
        this.domStar = <any>document.createRange().createContextualFragment('<span style="position:absolute;top:' + (this.y - 16) +
            'px;left:' + (this.x + 40) + 'px;font-size:40px;color:yellow;display:none;animation: animate   0.5s linear infinite;" >' + Icons.stare + '</span>').children[0];
        this.renderShopinfo(false);
        this.renderShopinfo(this.cityShowShopInfo);
    }
   
    renderShopinfo(enable) {
        if (enable) {
            var s = `<table style="position:absolute;top:` + (this.y - 4) +
                `px;left:` + (this.x + 40) + `px;font-size:12px;">
            <tr><td product="1">` + parameter.allProducts[0].getIcon() + `</td><td>100.000</td></tr>
            <tr><td product="2">` + parameter.allProducts[1].getIcon() + `</td><td>100.000</td></tr>
            <tr><td product="3">` + parameter.allProducts[2].getIcon() + `</td><td>100.000</td></tr>
            <tr><td product="4">` + parameter.allProducts[3].getIcon() + `</td><td>100.000</td></tr>
            </table>`;

            this.domShopinfo = <any>document.createRange().createContextualFragment(s).children[0];
            this.world.dom.appendChild(this.domShopinfo);
        } else {
            if (this.domShopinfo !== undefined) {
                this.world.dom.removeChild(this.domShopinfo);
                this.domShopinfo = undefined;
            }
        }
    }
    render(cityid: number) {
        var _this = this;
        this.dom = <any>document.createElement("img");
        this.dom.style.border = "1px solid black";
        this.dom.setAttribute("src", this.icon);
        this.dom.setAttribute("cityid", cityid.toString())
        this.dom.style.position = "absolute";
        this.dom.classList.add("city");
        this.dom["city"] = this;
        this.dom.style.top = this.y.toString() + "px";
        this.dom.style.left = this.x.toString() + "px";
        this.world.dom.appendChild(this.dom);
        this.dom.style.zIndex = "1";
        this.domStar = <any>document.createRange().createContextualFragment('<span style="position:absolute;top:' + (this.y + 16) +
            'px;left:' + (this.x) + 'px;font-size:40px;color:yellow;display:none;animation: animate   0.5s linear infinite;" >' + Icons.stare + '</span>').children[0];
        this.domStar.addEventListener("click", (ev: MouseEvent) => {
            _this.resetBuildingsWithoutCosts();
        });
        this.domStar.style.zIndex = "3";
        this.world.dom.appendChild(this.domStar);
        this.domDesc = <any>document.createRange().createContextualFragment('<span style="position:absolute;top:' + (30 + this.y) +
            'px;left:' + (this.x - 20) + 'px;font-size:12px;"></span>').children[0];
        this.domName = <any>document.createRange().createContextualFragment('<span>' + this.name.substring(0, 12) + '</span>').children[0];
        this.domPeople = <any>document.createRange().createContextualFragment('<span>0</span>').children[0];
        this.domDesc.appendChild(this.domName);
        this.domDesc.appendChild(<any>document.createRange().createContextualFragment("<br/>").children[0]);
        this.domWarning = <any>document.createRange().createContextualFragment('<span style="font-size:14px"></span>').children[0];
        this.renderWarningIcons();
        this.domDesc.appendChild(this.domWarning);
        this.domDesc.appendChild(this.domPeople);
        this.world.dom.appendChild(this.domDesc);
        this.domDesc.style.zIndex = "2";
        this.domAirport = <any>document.createRange().createContextualFragment('<span style="position:absolute;top:' + (this.y) +
            'px;left:' + (this.x - 20) + 'px;font-size:20px;color:white;">' + Icons.airport + '</span>').children[0];
        this.world.dom.appendChild(this.domAirport);

        this.renderShopinfo(this.cityShowShopInfo);
        if (!this.hasAirport) {
            this.domAirport.style.visibility = "hidden";
        }
        this.dom.addEventListener("click", (ev: MouseEvent) => {
            _this.onclick(ev);
            return undefined;
        });

        this.dom.addEventListener("contextmenu", (ev: MouseEvent) => {
            _this.oncontextmenu(ev);
            return undefined;
        });
        this.domAirport.addEventListener("click", (ev: MouseEvent) => {
            _this.oncontextmenu(ev);
            return undefined;
        });
        this.domAirport.addEventListener("contextmenu", (ev: MouseEvent) => {
            _this.oncontextmenu(ev);
            return undefined;
        });
    }
    resetBuildingsWithoutCosts() {
        var _this = this;
        this.domStar.style.visibility = "hidden";
        for (var x = 0; x < this.companies.length; x++) {
            this.companies[x].buildingsWithoutCosts = this.companies[x].buildings;
        }

        alert("Congratulations. All building costs " + this.name + " are reset.")
    }
    buildBuilding(typeid: number) {
        var last = this.world.game.date.getTime();
        if (this.queueBuildings.length > 0)
            last = this.queueBuildings[this.queueBuildings.length - 1].ready;
        last += (parameter.daysBuildBuilding * 1000 * 60 * 60 * 24) / (!this.buildingplaces ? 1 : (this.buildingplaces + 1));
        this.queueBuildings.push({ ready: last, typeid: typeid, name: "" });
        //shop should create at first
        if (typeid === 10000) {
            var t = this.queueBuildings[0].typeid;
            this.queueBuildings[0].typeid = this.queueBuildings[this.queueBuildings.length - 1].typeid;
            this.queueBuildings[this.queueBuildings.length - 1].typeid = t;
        }
    }
    buildAirplane(typeid: number) {
        var last = this.world.game.date.getTime();
        if (this.queueAirplane.length > 0)
            last = this.queueAirplane[this.buildAirplane.length - 1].ready;
        last += parameter.allAirplaneTypes[typeid].buildDays * 1000 * 60 * 60 * 24;
        this.queueAirplane.push({ ready: last, typeid: typeid, name: parameter.allAirplaneTypes[typeid].model });
    }
    newAirplane(typeid: number) {
        var _this = this;

        var maxNumber = 1;
        for (var x = 0; x < _this.world.airplanes.length; x++) {
            var test = _this.world.airplanes[x];
            var pos = test.name.indexOf(parameter.allAirplaneTypes[typeid].model);
            if (pos === 0) {
                var nr = <any>parseInt(test.name.substring(parameter.allAirplaneTypes[typeid].model.length));
                if (Number.isNaN(nr) && nr > maxNumber)
                    maxNumber = nr;
            }
        }
        maxNumber++;
        var ap = new Airplane(_this.world);
        ap.speed = 200;
        ap.x = _this.x;
        ap.y = _this.y;
        ap.world = _this.world;
        ap.typeid = parameter.allAirplaneTypes[typeid].typeid;
        ap.name = parameter.allAirplaneTypes[typeid].model + maxNumber;
        ap.speed = parameter.allAirplaneTypes[typeid].speed;
        ap.costs = parameter.allAirplaneTypes[typeid].costs;
        ap.capacity = parameter.allAirplaneTypes[typeid].capacity;
        _this.world.airplanes.push(ap);
        ap.render();
        _this.world.dom.appendChild(ap.dom);

    }
    updateNeutralCompanies() {
        if (this.people > 500)
            return;
        //neutral companies
        if (this.neutralDailyProducedToday === undefined) {
            this.neutralDailyProducedToday = [];
            for (var x = 0; x < this.companies.length; x++) {
                this.neutralDailyProducedToday[x] = 0;
            }
        }
        var dayProcent = this.world.game.date.getHours() / 24;
        if (this.world.game.date.getDate() !== new Date(this.lastUpdate).getDate()) {
            dayProcent = 1;

        }

        for (var x = 0; x < this.companies.length; x++) {
            var prod = this.companies[x].productid;
            var totalDailyProduce = Math.round(parameter.neutralStartPeople * parameter.allProducts[prod].dailyConsumtion * parameter.neutralProductionRate);
            if (totalDailyProduce < 1)
                totalDailyProduce = 1;
            var untilNow = Math.round(totalDailyProduce * dayProcent);
            if (untilNow > this.neutralDailyProducedToday[x]) {
                var diff = untilNow - this.neutralDailyProducedToday[x];
                if (diff > 0) {//only go to markt if price is ok
                    var product = parameter.allProducts[prod];
                    for (var o = 0; o < diff; o++) {
                        var price = product.calcPrice(this.people, this.market[prod] + 1/*diff*/, true);
                        // if(this.world.cities.indexOf(this)===0)
                        //    console.log("check " + this.companies[x].productid + ":  " + price + " > " + (product.pricePurchase * 2 / 3) + " Bestand: " + this.market[prod]);
                        var fact = 1 - (1 - parameter.ratePriceMin) / 2;
                        if (price > product.pricePurchase * fact) {
                            this.market[prod] = this.market[prod] + diff;
                            //  if(this.world.cities.indexOf(this)===0)
                            //    console.log("produce " + this.companies[x].productid + ":" + diff + "/" + "  ->" + untilNow + "/" + totalDailyProduce);
                        } else {
                            // if(this.world.cities.indexOf(this)===0)
                            //  debugger;
                        }
                    }
                    this.neutralDailyProducedToday[x] = this.neutralDailyProducedToday[x] + diff;
                }

            }
            if (dayProcent === 1) {
                this.neutralDailyProducedToday[x] = 0;
            }
        }
    }

    isProducedHere(productid: number) {
        for (var x = 0; x < this.companies.length; x++) {
            if (this.companies[x].productid === productid)
                return true;
        }
        return false;
    }
    transferWorker(numberOfWorker: number) {
        for (var y = 0; y < numberOfWorker; y++) {
            var comps = [];
            for (var x = 0; x < this.companies.length; x++) {
                if ((this.companies[x].buildings * parameter.workerInCompany) > this.companies[x].workers)
                    comps.push(x);
            }
            if (comps.length === 0)
                return;

            var winner = getRandomInt(comps.length);
            this.companies[comps[winner]].workers++;
        }
    }
    tryRemoveBuildingInProgress(typeid) {
        var ret = false;
        for (var x = this.queueBuildings.length - 1; x > -1; x--) {
            if (this.queueBuildings[x].typeid === typeid) {
                this.queueBuildings.splice(x, 1);
                return true;
            }
        }
        return false;
    }
    getBuildingInProgress(typeid) {
        var ret = 0;
        for (var x = 0; x < this.queueBuildings.length; x++) {
            if (this.queueBuildings[x].typeid === typeid)
                ret++;
        }
        return ret;
    }
    updateAirplaneQueue() {
        if (this.queueAirplane.length > 0 && this.queueAirplane[0].ready <= this.world.game.date.getTime()) {
            this.newAirplane(this.queueAirplane[0].typeid);
            this.queueAirplane.splice(0, 1);
        }
    }
    updateBuildingQueue() {
        if (this.queueBuildings.length > 0 && this.queueBuildings[0].ready <= this.world.game.date.getTime()) {
            if (this.queueBuildings[0].typeid === 10000) {
                this.shops++;
            } else {
                for (var x = 0; x < this.companies.length; x++) {
                    if (this.companies[x].productid === this.queueBuildings[0].typeid) {
                        this.companies[x].buildings++;
                        this.companies[x].workers += parameter.workerInCompany;
                        break;
                    }
                }
            }
            //this.newAirplane(this.queueAirplane[0].typeid);
            this.queueBuildings.splice(0, 1);
        }
    }
    getScore(): number {
        var ret = 0;
        for (var x = 0; x < this.score.length; x++) {
            if (this.score[x] > 70)
                ret++;
        }
        return ret;
    }
    getRating(people: number) {
        var score = this.getScore();
        var maxpeople = Math.max(parameter.neutralStartPeople, (score + 1) * 200);
        if (score === 19)
            return 1;
        if (people === maxpeople)
            return 0;
        if (people > maxpeople) {
            return -1;
        } else
            return 1;
        /*        if(people<1000){
                    return true;
                }else if(people<300&&score>0){
                    return true;
                }else if(people<400&&score>1){
                    return true;
                }else if(people<500&&score>2){
                    return true;
                }else if(people<600&&score>3){
                    return true;
                }else if(people<7000&&score>4){
                    return true;
                }else if(people<9000&&score>5){
                    return true;
                }else if(people<1200&&score>6){
                    return true;
                }else if(people<2000&&score>7){
                    return true;
                }else if(people<2500&&score>8){
                    return true;
                }else if(people<3000&&score>9){
                    return true;
                }else if(people<4000&&score>10){
                    return true;
                }else if(people<5000&&score>11){
                    return true;
                }else if(people<6000&&score>12){
                    return true;
                }else if(people<8000&&score>13){
                    return true;
                }else if(people<10000&&score>14){
                    return true;
                }else if(people<15000&&score>15){
                    return true;
                }else if(people<20000&&score>16){
                    return true;
                }else if(people<25000&&score>17){
                    return true;
                }else if(people<30000&&score>18){
                    return true;
                }else if(score>18){
                    return true;
                }
        
                return false;*/
    }
    updatePeople() {
        var newPeople = Math.max(1, Math.round(this.people / 1000));

        var workers = parameter.neutralStartPeople;
        //  for(var x=0;x<this.world.cities.length;x++){
        // var ct=this.world.cities[x];
        for (var i = 0; i < this.companies.length; i++) {
            workers += this.companies[i].workers;
        }
        // }
        if (this.people > workers) {
            this.people = workers;
            return;
        }
        //  var rating=this.getRating(this.people)===-1?Math.round(newPeople/2):newPeople;
        while (newPeople > 0) {
            var rate = this.getRating(this.people)
            if (rate === 1)
                this.people++;
            if (rate < 0) {

            }
            //   if (this.getRating(this.people) === -1)
            //     this.people--;
            newPeople--;
        }
        if (this.people > workers) {
            this.people = workers;
        }
        // if (this.people > this.houses * parameter.peopleInHouse) {
        //      this.people = this.houses * parameter.peopleInHouse;
        //  }


    }
    updatePeopleOld() {
        var newPeople = 1;
        while (newPeople > 0) {
            var comps = [];
            for (var x = 0; x < this.companies.length; x++) {
                if ((this.companies[x].buildings * parameter.workerInCompany) > this.companies[x].workers)
                    comps.push(x);
            }
            if (comps.length === 0)
                return;
            this.people++;
            var winner = getRandomInt(comps.length);
            //            console.log("+1 in company " + winner);
            this.companies[comps[winner]].workers++;
            newPeople--;
        }

        var comps = [];
        for (var x = 0; x < this.companies.length; x++) {
            if (this.companies[x].workers > this.companies[x].buildings * parameter.workerInCompany)
                this.companies[x].workers = this.companies[x].buildings * parameter.workerInCompany
        }


    }
     
    updateDailyConsumtion() {

        //neutral companies
        if (this.consumedToday === undefined) {
            this.consumedToday = [];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                this.consumedToday[x] = 0;
            }
        }
        var dayProcent = this.world.game.date.getHours() / 24;
        if (this.world.game.date.getHours() === 23) {
            dayProcent = 1;

        }

        for (var x = 0; x < parameter.allProducts.length; x++) {
            var totalDailyConsumtion = Math.round(parameter.allProducts[x].dailyConsumtion * this.people * (this.world.advertising[x] ? 1.15 : 1));
         //   totalDailyConsumtion--;//never go down
            if (totalDailyConsumtion < 1)
                totalDailyConsumtion = 1;
            var untilNow = Math.round(totalDailyConsumtion * dayProcent);
            if (untilNow > this.consumedToday[x]) {
                var diff = untilNow - this.consumedToday[x];
                var product = parameter.allProducts[x];


                var price = 99999999999999; //product.calcPrice(this.people, this.market[x] - diff, false);
                var fromshop = false;
                if (this.shop[x] >= diff && (this.shopMinStock[x] === undefined || (this.shop[x] - diff) > this.shopMinStock[x])) {
                    if (parameter.allProducts[x].priceSelling <= price) {
                        fromshop = true;
                        price = parameter.allProducts[x].priceSelling;
                    }
                }
                var priceMax = product.priceSelling + getRandomInt(Math.round(product.priceSelling) * parameter.ratePriceMax - product.priceSelling);
                this.consumedToday[x] = untilNow;
                if (price <= priceMax) {
                    if (fromshop) {
                        this.world.game.changeMoney((Math.round(price * diff)), "people buy from the shop", this);
                        this.shop[x] -= diff;
                    } else {
                        //  if (this.isProducedHere(product.id)&&this.world.cities.indexOf(this)===0) 
                        //      console.log(x+"kaufe von markt " + price + "<=" + priceMax+" ("+this.market[x]+")");
                        this.market[x] -= diff;
                    }
                    this.score[x] = Math.round((this.score[x] + 0.1) * 100) / 100;
                } else {
                    this.score[x] = Math.round((this.score[x] - 0.1) * 100) / 100;

                }

                if (this.score[x] > 100)
                    this.score[x] = 100;
                if (this.score[x] < 0)
                    this.score[x] = 0.01;

            }
            if (dayProcent === 1) {

                //  console.log("consumed "+x+"  "+this.consumedToday[x]);
                this.consumedToday[x] = 0;
            }
        }
    }
    /*sellShopToMarket() {
        for (var x = 0; x < parameter.allProducts.length; x++) {
            var product = parameter.allProducts[x];
            while (true) {
                var price = product.calcPrice(this.people, this.market[x], this.isProducedHere(x));
                if (price >= this.shopSellingPrice[x] && this.shop[x] > 1) {
                    if (this.shopMinStock[x] === undefined || (this.shop[x] - 1 > this.shopMinStock[x])) {
                        this.world.game.changeMoney((Math.round(price * 1)), "market buy from the shop", this);
                        this.shop[x] -= 1;
                        this.market[x] += 1;
                    } else
                        break;
                } else
                    break;
            }
        }
    }*/
    getDailyCostsShops() {
        if (this.shops === 1)
            return 20;
        return Math.round(this.shops * (this.shops >= 5 ? parameter.rateCostsShopMany : parameter.rateCostShop));
    }
    updateDailyCosts() {
        if (this.shops > 0)
            this.world.game.changeMoney(- this.getDailyCostsShops(), "daily costs shops", this);


        var companycosts = 0;
        for (var x = 0; x < this.companies.length; x++) {
            companycosts += this.companies[x].getDayilyCosts();

        }
        if (companycosts > 0) {
            this.world.game.changeMoney(-companycosts, "daily costs salary", this);
        }
    }
    getCompleteAmount() {
        var gesamount = 0;
        for (var x = 0; x < parameter.allProducts.length; x++) {
            gesamount += this.shop[x];
        }
        return gesamount;
    }
    updateStatus() {
        if (!this.hasAirport)
            return;
        //shop full
        var gesamount = this.getCompleteAmount();
        var max = this.shops * parameter.capacityShop;
        if (gesamount >= max) {
            this.domShopfull.style.display = "initial";
        } else {
            this.domShopfull.style.display = "none";
        }
        if (this.getRating(this.people + 1) < 0) {
            this.domRating.style.display = "initial";
        } else
            this.domRating.style.display = "none";
    }
    updateresetBuildingsWithoutCosts() {
        var _this = this;
        if (this.world.game.date.getHours() === 0) {
            var test = getRandomInt(8000);
            if (test === 0) {
                this.domStar.style.display = "initial";
                setTimeout(() => {
                    _this.domStar.style.display = "none";
                }, 7000);
            }
        }
    }
     updateShopinfo(){
        var arr=[];
        var _this=this;
        var gesamount=0;
        for(var x=0;x<parameter.allProducts.length;x++){
            arr.push(x);
            gesamount+=this.shop[x];
        }
        var sorted:number[]=arr.sort((a, b) => {
            return _this.shop[b]-_this.shop[a];
                });
        for(var x=0;x<4;x++){
            var row=this.domShopinfo.children[0].children[x];
            if(row.getAttribute("product")!==sorted[x].toString()){
                row.children[0].innerHTML=parameter.allProducts[sorted[x]].getIcon();
                row.setAttribute("product",sorted[x].toString());
            }
             row.children[1].textContent=this.shop[sorted[x]].toLocaleString();
        }
        var proz=gesamount/ (this.shops * parameter.capacityShop);
        if(proz>0.75&&this.domShopinfo.style.backgroundColor!=="LightPink")
            this.domShopinfo.style.backgroundColor="LightPink";
        if(proz<=0.75&&this.domShopinfo.style.backgroundColor!=="white")
            this.domShopinfo.style.backgroundColor="white";
    }
    updateUI(){
        var _this = this;
   //  setTimeout(()=>{
        var s = (this.people === 0 ? "" : this.people.toLocaleString());
        if (_this.domPeople.textContent !== s) {

            _this.domPeople.textContent = s;

        }
         if(this.cityShowShopInfo)
            this.updateShopinfo();
    }
    update() {
        var _this = this;
        if (this.lastUpdate === undefined) {
            this.lastUpdate = this.world.game.date.getTime();
        }
      //  _this.updateUI();

        //  },1);


        //this.updateNeutralCompanies();
        for (var x = 0; x < this.companies.length; x++) {
            this.companies[x].update();
        }
        //  if (this === this.world.cities[0])
        this.updateDailyConsumtion();
        this.updateAirplaneQueue();
        this.updateBuildingQueue();
        this.updateresetBuildingsWithoutCosts();
       
        // this.sellShopToMarket();
        if (this.world.game.date.getHours() % 1 === 0)
            this.updatePeople();
        if (this.world.game.date.getDate() !== new Date(this.lastUpdate).getDate()) {
            //a new day starts
            this.updateDailyCosts();
        }

        if (this.world.game.date.getHours() === 23) {

            this.updateStatus();
            for (var x = 0; x < debugNeed.length; x++) {
                // console.log("needed "+x+" "+debugNeed[x]);
                debugNeed[x] = 0;
            }
        }
        this.lastUpdate = this.world.game.date.getTime();
    }

    oncontextmenu(evt: MouseEvent) {
        evt.preventDefault();
        //(<Airplane>this.world.selection).status = "to " + this.name;
        (<Airplane>this.world.selection).flyTo(this);
        console.log(evt.offsetX);


    }
    onclick(th: MouseEvent) {
        if (this.hasAirport === false) {
            var iprice = Math.round(parameter.newAirportRate * (this.world.cities.length - 15) * 1000000);
            var price = Number(iprice).toLocaleString();
            if (confirm(`Do you want to buy an airport for ${price}?`)) {
                if (this.world.game.getMoney() < iprice) {
                    alert("Not enough money");
                    return;
                }
                this.world.game.changeMoney(-iprice, "bay an airport", this);
                this.hasAirport = true;
                this.domAirport.style.visibility = "initial";
                this.world.addCity(false);//cities[this.world.cities.length - 1].hasAirport = false;
            }
            return;
        }
        th.preventDefault();
        var h = CityDialog.getInstance();
        h.city = this;
        h.show();

    }
    commitBuildingCosts(buildPrice: number, buildMaterial: number[], transactiontext: string, doUpdateCity = true): boolean {
        if (this.canBuild(buildPrice, buildMaterial) !== "")
            return false;
        var total = buildPrice;
        var ret = "";
        for (var x = 0; x < buildMaterial.length; x++) {
            if (buildMaterial[x] > 0) {
                //checkshop
                var min = Math.min(buildMaterial[x], this.shop[x]);
                this.shop[x] -= min;
                var diff = buildMaterial[x] - min;
                if (diff > 0) {//markt
                    var price = parameter.allProducts[x].calcPrice(this.people, this.market[x] - diff, false);
                    this.market[x] -= diff;
                    total += (price * diff);
                }
            }
        }
        this.world.game.changeMoney(-total, transactiontext, this);
        if (doUpdateCity)
            CityDialog.getInstance().update(true);
        return true;
    }
    //returns undefined if markt
    canBuild(buildPrice: number, buildMaterial: number[]) {
        var total = buildPrice;
        var ret = "";
        for (var x = 0; x < buildMaterial.length; x++) {
            //checkshop
            if (buildMaterial[x] > this.shop[x]) {
                var diff = buildMaterial[x] - this.shop[x];
                if ((diff) > this.market[x])
                    ret += ret + " " + parameter.allProducts[x].getIcon();
                total += parameter.allProducts[x].calcPrice(this.people, this.market[x] - diff, false);
            }
        }
        if (total > this.world.game.getMoney()) {
            ret += total + " " + Icons.money;
        }
        return ret;
    }

    static getBuildingCostsAsIcon(money: number, buildingMaterial: number[], withBreak = false) {
        var s = (money / 1000).toLocaleString() + "K";
        if (money >= 10000000)
            s = (money / 1000000).toLocaleString() + "M";
        if (money >= 10000000000)
            s = (money / 1000000000).toLocaleString() + "Mrd";
        var lastAmount = undefined;
        for (var x = 0; x < buildingMaterial.length; x++) {
            if (buildingMaterial[x]) {
                var s1 = buildingMaterial[x] + "x";
                if (lastAmount === buildingMaterial[x])
                    s1 = "";

                s = s + " " + (withBreak ? "<br/>" : "") + s1 + parameter.allProducts[x].getIcon();
                lastAmount = buildingMaterial[x];
            }
        }
        return s;
    }
}

function createCities2(count, checkProduction = false) {
    var allids = [];
    var cities: City[] = []
    for (var x = 0; x < count; x++) {
        var city = new City();
        if (checkProduction && x === 0) {
            city.companies[0].productid = 0;
            city.companies[0].hasLicense = true;
            city.companies[1].productid = 1;
            city.companies[1].hasLicense = true;
        }
        cities.push(city);
        for (var y = 0; y < city.companies.length; y++) {
            allids.push(city.companies[y].productid);

        }

    }
    if (checkProduction) {
        //check if all Procducts with distribution> 4could be produces
        for (var x = 0; x < parameter.allProducts.length; x++) {
            if (allids.indexOf(parameter.allProducts[x].id) === -1) {

                return createCities2(count, checkProduction);
            }
        }
    }
    return cities;
}
function calcPosNewCity(world: World, deep) {
    var x = getRandomInt(world.game.mapWidth - 40) + 40;
    var y = getRandomInt(world.game.mapHeight - 12) + 12;
    for (var i = 0; i < world.cities.length; i++) {
        var ct = world.cities[i];
        if (x > (ct.x - 70) && x < (ct.x + 70) && y > (ct.y - 68) && (y < ct.y + 68) ){
            //conflict
            if (deep > 0) {
                deep--;
                return calcPosNewCity(world, deep);
            } else { //
                world.game.mapHeight = world.game.mapHeight + 50;
                world.game.mapWidth = world.game.mapWidth + 50;
                world.game.updateSize();
                return calcPosNewCity(world, 250);
            }
        }
    }
    return [x, y]
}
export function createCities(world: World, count: number) {
    if (world.cities.length === 0 && count < 5) {
        throw new Error("min 5 cities");
    }
    var cities = [];
    if (world.cities.length === 0)
        cities = createCities2(count, true);
    else
        cities = createCities2(count, false);

    var allready = [];
    for (var x = 0; x < world.cities.length; x++) {
        allready.push(world.cities[x].id);
    }
    for (var x = 0; x < count; x++) {
        if (world.cities.length >= allCities.length) {
            alert("Congratulations. You have built airports in all cities.");
            throw new Error("all built");
        }
        var city = cities[x];
        world.cities.push(city);

        if (world.cities.length === 1) {
            city.x = world.game.mapWidth;
            city.y = world.game.mapHeight;
        } else {
            var test = calcPosNewCity(world, 100);
            city.x = test[0];
            city.y = test[1];
            //überschneidung

        }
        city.world = world;
        var num = getRandomInt(allCities.length);
        while (allready.indexOf(num) !== -1) {
            num = getRandomInt(allCities.length);
        }
        allready.push(num);
        city.id = num;
        city.name = allCities[num][1].substring(0, 17);
        city.country = allCities[num][0];
        city.icon = "https://" + allCities[num][2];
        //  cities.push(city);
    }
    return cities;
}

export function test() {
    console.log(getRandomInt(2));
}
//https://de.wikipedia.org/wiki/Liste_der_Hauptst%C3%A4dte_der_Erde   https://lizenzhinweisgenerator.de/ Wikipedia
var allCities = [
    ["Afghanistan", "Kabul", "upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Flag_of_Afghanistan_%282004%E2%80%932021%29.svg/40px-Flag_of_Afghanistan_%282004%E2%80%932021%29.svg.png"],
    ["Ägypten", "Kairo", "upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/40px-Flag_of_Egypt.svg.png"],
    ["Albanien", "Tirana", "upload.wikimedia.org/wikipedia/commons/thumb/3/36/Flag_of_Albania.svg/40px-Flag_of_Albania.svg.png"],
    ["Algerien", "Algier", "upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Algeria.svg/40px-Flag_of_Algeria.svg.png"],
    ["Andorra", "Andorra la Vella", "upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Andorra.svg/40px-Flag_of_Andorra.svg.png"],
    ["Angola", "Luanda", "upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Angola.svg/40px-Flag_of_Angola.svg.png"],
    ["Antigua und Barbuda", "Saint John’s (Antigua und Barbuda)", "upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Antigua_and_Barbuda.svg/40px-Flag_of_Antigua_and_Barbuda.svg.png"],
    ["Äquatorialguinea", "Malabo", "upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Equatorial_Guinea.svg/40px-Flag_of_Equatorial_Guinea.svg.png"],
    ["Argentinien", "Buenos Aires", "upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/40px-Flag_of_Argentina.svg.png"],
    ["Armenien", "Jerewan", "upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Armenia.svg/40px-Flag_of_Armenia.svg.png"],
    ["Aserbaidschan", "Baku", "upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Azerbaijan.svg/40px-Flag_of_Azerbaijan.svg.png"],
    ["Äthiopien", "Addis Abeba", "upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_Ethiopia.svg/40px-Flag_of_Ethiopia.svg.png"],
    ["Australien", "Canberra", "upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/40px-Flag_of_Australia_%28converted%29.svg.png"],
    ["Bahamas", "Nassau (Bahamas)", "upload.wikimedia.org/wikipedia/commons/thumb/9/93/Flag_of_the_Bahamas.svg/40px-Flag_of_the_Bahamas.svg.png"],
    ["Bahrain", "Manama", "upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Bahrain.svg/40px-Flag_of_Bahrain.svg.png"],
    ["Bangladesch", "Dhaka", "upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/40px-Flag_of_Bangladesh.svg.png"],
    ["Barbados", "Bridgetown", "upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Barbados.svg/40px-Flag_of_Barbados.svg.png"],
    ["Belarus", "Minsk", "upload.wikimedia.org/wikipedia/commons/thumb/8/85/Flag_of_Belarus.svg/40px-Flag_of_Belarus.svg.png"],
    ["Belgien", "Brüssel", "upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_Belgium_%28civil%29.svg/40px-Flag_of_Belgium_%28civil%29.svg.png"],
    ["Belize", "Belmopan", "upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Flag_of_Belize.svg/40px-Flag_of_Belize.svg.png"],
    ["Benin", "Porto-Novo", "upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Benin.svg/40px-Flag_of_Benin.svg.png"],
    ["Bhutan", "Thimphu", "upload.wikimedia.org/wikipedia/commons/thumb/9/91/Flag_of_Bhutan.svg/40px-Flag_of_Bhutan.svg.png"],
    ["Bolivien", "Sucre", "upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Bolivia.svg/40px-Flag_of_Bolivia.svg.png"],
    ["Bosnien und Herzegowina", "Sarajevo", "upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Flag_of_Bosnia_and_Herzegovina.svg/40px-Flag_of_Bosnia_and_Herzegovina.svg.png"],
    ["Botswana", "Gaborone", "upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_Botswana.svg/40px-Flag_of_Botswana.svg.png"],
    ["Brasilien", "Brasília", "upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/40px-Flag_of_Brazil.svg.png"],
    ["Brunei", "Bandar Seri Begawan", "upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Brunei.svg/40px-Flag_of_Brunei.svg.png"],
    ["Bulgarien", "Sofia", "upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Bulgaria.svg/40px-Flag_of_Bulgaria.svg.png"],
    ["Burkina Faso", "Ouagadougou", "upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Burkina_Faso.svg/40px-Flag_of_Burkina_Faso.svg.png"],
    ["Burundi", "Gitega", "upload.wikimedia.org/wikipedia/commons/thumb/5/50/Flag_of_Burundi.svg/40px-Flag_of_Burundi.svg.png"],
    ["Chile", "Santiago de Chile", "upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/40px-Flag_of_Chile.svg.png"],
    ["Costa Rica", "San José (Costa Rica)", "upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Costa_Rica.svg/40px-Flag_of_Costa_Rica.svg.png"],
    ["Dänemark", "Kopenhagen", "upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Denmark.svg/40px-Flag_of_Denmark.svg.png"],
    ["Demokratische Republik Kongo", "Kinshasa", "upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg/40px-Flag_of_the_Democratic_Republic_of_the_Congo.svg.png"],
    ["Deutschland", "Berlin", "upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/40px-Flag_of_Germany.svg.png"],
    ["Dominica", "Roseau", "upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Flag_of_Dominica.svg/40px-Flag_of_Dominica.svg.png"],
    ["Dominikanische Republik", "Santo Domingo", "upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_the_Dominican_Republic.svg/40px-Flag_of_the_Dominican_Republic.svg.png"],
    ["Dschibuti", "Dschibuti (Stadt)", "upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_Djibouti.svg/40px-Flag_of_Djibouti.svg.png"],
    ["Ecuador", "Quito", "upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Flag_of_Ecuador.svg/40px-Flag_of_Ecuador.svg.png"],
    ["El Salvador", "San Salvador", "upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_El_Salvador.svg/40px-Flag_of_El_Salvador.svg.png"],
    ["Elfenbeinküste", "Yamoussoukro", "upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_C%C3%B4te_d%27Ivoire.svg/40px-Flag_of_C%C3%B4te_d%27Ivoire.svg.png"],
    ["Eritrea", "Asmara", "upload.wikimedia.org/wikipedia/commons/thumb/2/29/Flag_of_Eritrea.svg/40px-Flag_of_Eritrea.svg.png"],
    ["Estland", "Tallinn", "upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flag_of_Estonia.svg/40px-Flag_of_Estonia.svg.png"],
    ["Eswatini", "Mbabane", "upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Flag_of_Eswatini.svg/40px-Flag_of_Eswatini.svg.png"],
    ["Fidschi", "Suva", "upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Fiji.svg/40px-Flag_of_Fiji.svg.png"],
    ["Finnland", "Helsinki", "upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Flag_of_Finland_icon.svg/40px-Flag_of_Finland_icon.svg.png"],
    ["Frankreich", "Paris", "upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_France_%281794%E2%80%931815%2C_1830%E2%80%931974%2C_2020%E2%80%93present%29.svg/40px-Flag_of_France_%281794%E2%80%931815%2C_1830%E2%80%931974%2C_2020%E2%80%93present%29.svg.png"],
    ["Gabun", "Libreville", "upload.wikimedia.org/wikipedia/commons/thumb/0/04/Flag_of_Gabon.svg/40px-Flag_of_Gabon.svg.png"],
    ["Gambia", "Banjul", "upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_The_Gambia.svg/40px-Flag_of_The_Gambia.svg.png"],
    ["Georgien", "Tiflis", "upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Georgia.svg/40px-Flag_of_Georgia.svg.png"],
    ["Ghana", "Accra", "upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/40px-Flag_of_Ghana.svg.png"],
    ["Grenada", "St. George’s", "upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Grenada.svg/40px-Flag_of_Grenada.svg.png"],
    ["Griechenland", "Athen", "upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Greece.svg/40px-Flag_of_Greece.svg.png"],
    ["Guatemala", "Guatemala-Stadt", "upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Flag_of_Guatemala.svg/40px-Flag_of_Guatemala.svg.png"],
    ["Guinea-Bissau", "Bissau", "upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Guinea-Bissau.svg/40px-Flag_of_Guinea-Bissau.svg.png"],
    ["Guinea", "Conakry", "upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Flag_of_Guinea.svg/40px-Flag_of_Guinea.svg.png"],
    ["Guyana", "Georgetown (Guyana)", "upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_Guyana.svg/40px-Flag_of_Guyana.svg.png"],
    ["Haiti", "Port-au-Prince", "upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Haiti.svg/40px-Flag_of_Haiti.svg.png"],
    ["Honduras", "Tegucigalpa", "upload.wikimedia.org/wikipedia/commons/thumb/8/82/Flag_of_Honduras.svg/40px-Flag_of_Honduras.svg.png"],
    ["Indien", "Neu-Delhi", "upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_India.svg/40px-Flag_of_India.svg.png"],
    ["Indonesien", "Jakarta", "upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/40px-Flag_of_Indonesia.svg.png"],
    ["Irak", "Bagdad", "upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_Iraq.svg/40px-Flag_of_Iraq.svg.png"],
    ["Iran", "Teheran", "upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Iran.svg/40px-Flag_of_Iran.svg.png"],
    ["Irland", "Dublin", "upload.wikimedia.org/wikipedia/commons/thumb/4/45/Flag_of_Ireland.svg/40px-Flag_of_Ireland.svg.png"],
    ["Island", "Reykjavík", "upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Iceland.svg/40px-Flag_of_Iceland.svg.png"],
    ["Israel", "Jerusalem", "upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Israel.svg/40px-Flag_of_Israel.svg.png"],
    ["Italien", "Rom", "upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/40px-Flag_of_Italy.svg.png"],
    ["Jamaika", "Kingston (Jamaika)", "upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Jamaica.svg/40px-Flag_of_Jamaica.svg.png"],
    ["Japan", "Tokio", "upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/40px-Flag_of_Japan.svg.png"],
    ["Jemen", "Sanaa", "upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Yemen.svg/40px-Flag_of_Yemen.svg.png"],
    ["Jordanien", "Amman", "upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_Jordan.svg/40px-Flag_of_Jordan.svg.png"],
    ["Kambodscha", "Phnom Penh", "upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_Cambodia.svg/40px-Flag_of_Cambodia.svg.png"],
    ["Kamerun", "Yaoundé", "upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Cameroon.svg/40px-Flag_of_Cameroon.svg.png"],
    ["Kanada", "Ottawa", "upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/40px-Flag_of_Canada_%28Pantone%29.svg.png"],
    ["Kap Verde", "Praia", "upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Cape_Verde.svg/40px-Flag_of_Cape_Verde.svg.png"],
    ["Kasachstan", "Astana", "upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kazakhstan.svg/40px-Flag_of_Kazakhstan.svg.png"],
    ["Katar", "Doha", "upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/40px-Flag_of_Qatar.svg.png"],
    ["Kenia", "Nairobi", "upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/40px-Flag_of_Kenya.svg.png"],
    ["Kirgisistan", "Bischkek", "upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Flag_of_Kyrgyzstan.svg/40px-Flag_of_Kyrgyzstan.svg.png"],
    ["Kiribati", "South Tarawa", "upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kiribati.svg/40px-Flag_of_Kiribati.svg.png"],
    ["Kolumbien", "Bogotá", "upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/40px-Flag_of_Colombia.svg.png"],
    ["Komoren", "Moroni (Komoren)", "upload.wikimedia.org/wikipedia/commons/thumb/9/94/Flag_of_the_Comoros.svg/40px-Flag_of_the_Comoros.svg.png"],
    ["Kroatien", "Zagreb", "upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Croatia.svg/40px-Flag_of_Croatia.svg.png"],
    ["Kuba", "Havanna", "upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Flag_of_Cuba.svg/40px-Flag_of_Cuba.svg.png"],
    ["Kuwait", "Kuwait (Stadt)", "upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Kuwait.svg/40px-Flag_of_Kuwait.svg.png"],
    ["Laos", "Vientiane", "upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Laos.svg/40px-Flag_of_Laos.svg.png"],
    ["Lesotho", "Maseru", "upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Flag_of_Lesotho.svg/40px-Flag_of_Lesotho.svg.png"],
    ["Lettland", "Riga", "upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Latvia.svg/40px-Flag_of_Latvia.svg.png"],
    ["Libanon", "Beirut", "upload.wikimedia.org/wikipedia/commons/thumb/5/59/Flag_of_Lebanon.svg/40px-Flag_of_Lebanon.svg.png"],
    ["Liberia", "Monrovia", "upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Flag_of_Liberia.svg/40px-Flag_of_Liberia.svg.png"],
    ["Libyen", "Tripolis", "upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Libya.svg/40px-Flag_of_Libya.svg.png"],
    ["Liechtenstein", "Vaduz", "upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Liechtenstein.svg/40px-Flag_of_Liechtenstein.svg.png"],
    ["Litauen", "Vilnius", "upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Lithuania.svg/40px-Flag_of_Lithuania.svg.png"],
    ["Luxemburg", "Luxemburg (Stadt)", "upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Luxembourg.svg/40px-Flag_of_Luxembourg.svg.png"],
    ["Madagaskar", "Antananarivo", "upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Madagascar.svg/40px-Flag_of_Madagascar.svg.png"],
    ["Malawi", "Lilongwe", "upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Flag_of_Malawi.svg/40px-Flag_of_Malawi.svg.png"],
    ["Malaysia", "Kuala Lumpur", "upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flag_of_Malaysia.svg/40px-Flag_of_Malaysia.svg.png"],
    ["Malediven", "Malé", "upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Maldives.svg/40px-Flag_of_Maldives.svg.png"],
    ["Mali", "Bamako", "upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_Mali.svg/40px-Flag_of_Mali.svg.png"],
    ["Malta", "Valletta", "upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Malta.svg/40px-Flag_of_Malta.svg.png"],
    ["Marokko", "Rabat", "upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/40px-Flag_of_Morocco.svg.png"],
    ["Marshallinseln", "Majuro", "upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flag_of_the_Marshall_Islands.svg/40px-Flag_of_the_Marshall_Islands.svg.png"],
    ["Mauretanien", "Nouakchott", "upload.wikimedia.org/wikipedia/commons/thumb/4/43/Flag_of_Mauritania.svg/40px-Flag_of_Mauritania.svg.png"],
    ["Mauritius", "Port Louis", "upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Mauritius.svg/40px-Flag_of_Mauritius.svg.png"],
    ["Mexiko", "Mexiko-Stadt", "upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/40px-Flag_of_Mexico.svg.png"],
    ["Mikronesien", "Palikir", "upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Flag_of_the_Federated_States_of_Micronesia.svg/40px-Flag_of_the_Federated_States_of_Micronesia.svg.png"],
    ["Monaco", "Mongolei", "upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Flag_of_Monaco.svg/40px-Flag_of_Monaco.svg.png"],
    ["Mongolei", "Ulaanbaatar", "upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Mongolia.svg/40px-Flag_of_Mongolia.svg.png"],
    ["Montenegro", "Podgorica", "upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Montenegro.svg/40px-Flag_of_Montenegro.svg.png"],
    ["Mosambik", "Maputo", "upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Mozambique.svg/40px-Flag_of_Mozambique.svg.png"],
    ["Myanmar", "Naypyidaw", "upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Flag_of_Myanmar.svg/40px-Flag_of_Myanmar.svg.png"],
    ["Namibia", "Windhoek", "upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Namibia.svg/40px-Flag_of_Namibia.svg.png"],
    ["Nauru", "Yaren (Distrikt)", "upload.wikimedia.org/wikipedia/commons/thumb/3/30/Flag_of_Nauru.svg/40px-Flag_of_Nauru.svg.png"],
    ["Nepal", "Kathmandu", "upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_Nepal_%28with_spacing%2C_aspect_ratio_4-3%29.svg/40px-Flag_of_Nepal_%28with_spacing%2C_aspect_ratio_4-3%29.svg.png"],
    ["Neuseeland", "Wellington", "upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/40px-Flag_of_New_Zealand.svg.png"],
    ["Nicaragua", "Managua", "upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Nicaragua.svg/40px-Flag_of_Nicaragua.svg.png"],
    ["Niederlande", "Amsterdam", "upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/40px-Flag_of_the_Netherlands.svg.png"],
    ["Niger", "Niamey", "upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Flag_of_Niger.svg/40px-Flag_of_Niger.svg.png"],
    ["Nigeria", "Abuja", "upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/40px-Flag_of_Nigeria.svg.png"],
    ["Nordkorea", "Pjöngjang", "upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_North_Korea.svg/40px-Flag_of_North_Korea.svg.png"],
    ["Nordmazedonien", "Skopje", "upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_North_Macedonia.svg/40px-Flag_of_North_Macedonia.svg.png"],
    ["Norwegen", "Oslo", "upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/40px-Flag_of_Norway.svg.png"],
    ["Oman", "Maskat", "upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Oman.svg/40px-Flag_of_Oman.svg.png"],
    ["Österreich", "Wien", "upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Austria.svg/40px-Flag_of_Austria.svg.png"],
    ["Osttimor", "Dili", "upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_East_Timor.svg/40px-Flag_of_East_Timor.svg.png"],
    ["Pakistan", "Islamabad", "upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/40px-Flag_of_Pakistan.svg.png"],
    ["Palau", "Ngerulmud", "upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Palau.svg/40px-Flag_of_Palau.svg.png"],
    ["Panama", "Panama-Stadt", "upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/40px-Flag_of_Panama.svg.png"],
    ["Papua-Neuguinea", "Port Moresby", "upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Flag_of_Papua_New_Guinea.svg/40px-Flag_of_Papua_New_Guinea.svg.png"],
    ["Paraguay", "Asunción", "upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Paraguay.svg/40px-Flag_of_Paraguay.svg.png"],
    ["Peru", "Lima", "upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Peru.svg/40px-Flag_of_Peru.svg.png"],
    ["Philippinen", "Manila", "upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_the_Philippines.svg/40px-Flag_of_the_Philippines.svg.png"],
    ["Polen", "Warschau", "upload.wikimedia.org/wikipedia/commons/thumb/1/12/Flag_of_Poland.svg/40px-Flag_of_Poland.svg.png"],
    ["Portugal", "Lissabon", "upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/40px-Flag_of_Portugal.svg.png"],
    ["Republik Kongo", "Brazzaville", "upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_the_Republic_of_the_Congo.svg/40px-Flag_of_the_Republic_of_the_Congo.svg.png"],
    ["Republik Moldau", "Chișinău", "upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Moldova.svg/40px-Flag_of_Moldova.svg.png"],
    ["Ruanda", "Kigali", "upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Rwanda.svg/40px-Flag_of_Rwanda.svg.png"],
    ["Rumänien", "Bukarest", "upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/40px-Flag_of_Romania.svg.png"],
    ["Russland", "Moskau", "upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/40px-Flag_of_Russia.svg.png"],
    ["Salomonen", "Honiara", "upload.wikimedia.org/wikipedia/commons/thumb/7/74/Flag_of_the_Solomon_Islands.svg/40px-Flag_of_the_Solomon_Islands.svg.png"],
    ["Sambia", "Lusaka", "upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/40px-Flag_of_Zambia.svg.png"],
    ["Samoa", "Apia", "upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Samoa.svg/40px-Flag_of_Samoa.svg.png"],
    ["San Marino", "Stadt San Marino", "upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Flag_of_San_Marino.svg/40px-Flag_of_San_Marino.svg.png"],
    ["São Tomé und Príncipe", "São Tomé", "upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Sao_Tome_and_Principe.svg/40px-Flag_of_Sao_Tome_and_Principe.svg.png"],
    ["Saudi-Arabien", "Riad", "upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/40px-Flag_of_Saudi_Arabia.svg.png"],
    ["Schweden", "Stockholm", "upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/40px-Flag_of_Sweden.svg.png"],
    ["Schweiz", "Bern", "upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Flag_of_Switzerland_within_2to3.svg/40px-Flag_of_Switzerland_within_2to3.svg.png"],
    ["Senegal", "Dakar", "upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/40px-Flag_of_Senegal.svg.png"],
    ["Serbien", "Belgrad", "upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Flag_of_Serbia.svg/40px-Flag_of_Serbia.svg.png"],
    ["Seychellen", "Victoria (Seychellen)", "upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Seychelles.svg/40px-Flag_of_Seychelles.svg.png"],
    ["Sierra Leone", "Freetown", "upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Sierra_Leone.svg/40px-Flag_of_Sierra_Leone.svg.png"],
    ["Simbabwe", "Harare", "upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Zimbabwe.svg/40px-Flag_of_Zimbabwe.svg.png"],
    ["Singapur", "Slowakei", "upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/40px-Flag_of_Singapore.svg.png"],
    ["Slowakei", "Bratislava", "upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_Slovakia.svg/40px-Flag_of_Slovakia.svg.png"],
    ["Slowenien", "Ljubljana", "upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Flag_of_Slovenia.svg/40px-Flag_of_Slovenia.svg.png"],
    ["Somalia", "Mogadischu", "upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Flag_of_Somalia.svg/40px-Flag_of_Somalia.svg.png"],
    ["Spanien", "Madrid", "upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/40px-Flag_of_Spain.svg.png"],
    ["Sri Lanka", "Sri Jayewardenepura Kotte", "upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Sri_Lanka.svg/40px-Flag_of_Sri_Lanka.svg.png"],
    ["St. Kitts Nevis", "Basseterre", "upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Saint_Kitts_and_Nevis.svg/40px-Flag_of_Saint_Kitts_and_Nevis.svg.png"],
    ["St. Lucia", "Castries", "upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Saint_Lucia.svg/40px-Flag_of_Saint_Lucia.svg.png"],
    ["St. Vincent und die Grenadinen", "Kingstown", "upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Flag_of_Saint_Vincent_and_the_Grenadines.svg/40px-Flag_of_Saint_Vincent_and_the_Grenadines.svg.png"],
    ["Südafrika", "Bloemfontein", "upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/40px-Flag_of_South_Africa.svg.png"],
    ["Sudan", "Khartum", "upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Sudan.svg/40px-Flag_of_Sudan.svg.png"],
    ["Südkorea", "Seoul", "upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/40px-Flag_of_South_Korea.svg.png"],
    ["Südsudan", "Juba", "upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Flag_of_South_Sudan.svg/40px-Flag_of_South_Sudan.svg.png"],
    ["Suriname", "Paramaribo", "upload.wikimedia.org/wikipedia/commons/thumb/6/60/Flag_of_Suriname.svg/40px-Flag_of_Suriname.svg.png"],
    ["Syrien", "Damaskus", "upload.wikimedia.org/wikipedia/commons/thumb/5/53/Flag_of_Syria.svg/40px-Flag_of_Syria.svg.png"],
    ["Tadschikistan", "Duschanbe", "upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/40px-Flag_of_Tajikistan.svg.png"],
    ["Tansania", "Dodoma", "upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tanzania.svg/40px-Flag_of_Tanzania.svg.png"],
    ["Thailand", "Bangkok", "upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/40px-Flag_of_Thailand.svg.png"],
    ["Togo", "Lomé", "upload.wikimedia.org/wikipedia/commons/thumb/6/68/Flag_of_Togo.svg/40px-Flag_of_Togo.svg.png"],
    ["Tonga", "Nukuʻalofa", "upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Tonga.svg/40px-Flag_of_Tonga.svg.png"],
    ["Trinidad und Tobago", "Port of Spain", "upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Trinidad_and_Tobago.svg/40px-Flag_of_Trinidad_and_Tobago.svg.png"],
    ["Tschad", "N’Djamena", "upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Flag_of_Chad.svg/40px-Flag_of_Chad.svg.png"],
    ["Tschechien", "Prag", "upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/40px-Flag_of_the_Czech_Republic.svg.png"],
    ["Tunesien", "Tunis", "upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Tunisia.svg/40px-Flag_of_Tunisia.svg.png"],
    ["Türkei", "Ankara", "upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/40px-Flag_of_Turkey.svg.png"],
    ["Turkmenistan", "Aşgabat", "upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Turkmenistan.svg/40px-Flag_of_Turkmenistan.svg.png"],
    ["Tuvalu", "Funafuti", "upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tuvalu.svg/40px-Flag_of_Tuvalu.svg.png"],
    ["Uganda", "Kampala", "upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Flag_of_Uganda.svg/40px-Flag_of_Uganda.svg.png"],
    ["Ukraine", "Kiew", "upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/40px-Flag_of_Ukraine.svg.png"],
    ["Ungarn", "Budapest", "upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/40px-Flag_of_Hungary.svg.png"],
    ["Uruguay", "Montevideo", "upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Uruguay.svg/40px-Flag_of_Uruguay.svg.png"],
    ["Usbekistan", "Taschkent", "upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/40px-Flag_of_Uzbekistan.svg.png"],
    ["Vanuatu", "Port Vila", "upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Vanuatu.svg/40px-Flag_of_Vanuatu.svg.png"],
    ["Vatikan", "Vatikanstadt", "upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_the_Vatican_City.svg/40px-Flag_of_the_Vatican_City.svg.png"],
    ["Venezuela", "Caracas", "upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/40px-Flag_of_Venezuela.svg.png"],
    ["Vereinigte Arabische Emirate", "Abu Dhabi", "upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/40px-Flag_of_the_United_Arab_Emirates.svg.png"],
    ["Vereinigte Staaten", "Washington, D.C.", "upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/40px-Flag_of_the_United_States.svg.png"],
    ["Vereinigtes Königreich", "London", "upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/40px-Flag_of_the_United_Kingdom.svg.png"],
    ["Vietnam", "Hanoi", "upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/40px-Flag_of_Vietnam.svg.png"],
    ["Volksrepublik China", "Peking", "upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/40px-Flag_of_the_People%27s_Republic_of_China.svg.png"],
    ["Zentralafrikanische Republik", "Bangui", "upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Central_African_Republic.svg/40px-Flag_of_the_Central_African_Republic.svg.png"],
]
