import { World } from "game/world";
import { CityDialog } from "game/citydialog";
import { allProducts } from "game/product";
import { Company } from "game/company";
import { Airplane } from "game/airplane";
import { Icons } from "game/icons";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export class City {
    id: number;
    x: number;
    y: number;
    name: string;
    country: string;
    icon: string;
    dom: HTMLElement;
    world: World;
    people: number;
    market: number[];
    companies: Company[];
    airplanesInCity: Airplane[];
    private static neutralStartPeople = 1000;
    private static neutralProductionRate = 2;//produce 0.2 times more then neutralPeople consumed 
    neutralDailyProducedToday: number[];
    consumedToday: number[];
    lastUpdate = undefined;
    score: number[] = [];
    warehouse: number[] = [];
    warehouses = 0;
    houses = 0;
    warehouseMinStock:number[];
    warehouseSellingPrice:number[];
    type="City";
    domDesc:HTMLSpanElement;
    constructor() {
        this.market = [];
        this.airplanesInCity = [];
        this.warehouseMinStock=[];
        this.warehouseSellingPrice=[];
        this.createCompanies();
        for (var x = 0; x < allProducts.length; x++) {
            var val = 0;
            this.score.push(50);
            for (var y = 0; y < this.companies.length; y++) {
                if (this.companies[y].productid === x) {
                    val = 2 * Math.round(City.neutralStartPeople * allProducts[x].dailyConsumtion * City.neutralProductionRate);
                }
            }
            if (val === 0) {
                val = Math.round(0.5 * City.neutralStartPeople * allProducts[x].dailyConsumtion);

            }
            this.warehouseMinStock.push(undefined);
            this.warehouseSellingPrice.push(allProducts[x].priceSelling);
            this.warehouse.push(5000);
            this.market.push(val);
        }
    }
    private createCompanies() {
        var allready = [];
        this.companies = [];
        for (var x = 0; x < 5; x++) {
            var comp = new Company(allready);
            comp.city=this;
            this.companies.push(comp);
            allready.push(comp.productid);
        }
        this.companies.sort((a, b) => {
            return a.productid - b.productid;
        });
    }
    render(cityid:number) {
        var _this = this;
        this.dom = <any>document.createElement("img");
        this.dom.style.border = "1px solid black";
        this.dom.setAttribute("src", this.icon);
        this.dom.setAttribute("cityid",cityid.toString())
        this.dom.style.position = "absolute";
        this.dom.classList.add("city");
        this.dom.addEventListener("click", (ev: MouseEvent) => {
            _this.onclick(ev);
            return undefined;
        });
        this.dom.addEventListener("contextmenu", (ev: MouseEvent) => {
            _this.oncontextmenu(ev);
            return undefined;
        });
        this.dom.style.top = this.y.toString() + "px";
        this.dom.style.left = this.x.toString() + "px";
        this.world.dom.appendChild(this.dom);
        this.domDesc=<any> document.createRange().createContextualFragment('<span style="position:absolute;top:' + (14 + this.y) +
            'px;left:' + this.x + 'px;font-size:9px;">' + this.name + '</span>').children[0];
        this.world.dom.appendChild(this.domDesc);
        

    }
    updateNeutralCompanies() {

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
            var totalDailyProduce = Math.round(allProducts[prod].dailyConsumtion * City.neutralStartPeople * City.neutralProductionRate);
            var untilNow = Math.round(totalDailyProduce * dayProcent);
            if (untilNow > this.neutralDailyProducedToday[x]) {
                var diff = untilNow - this.neutralDailyProducedToday[x];
                if (diff > 0) {//only go to markt if price is ok
                    var product = allProducts[prod];
                    var price = product.calcPrice(this.people, this.market[prod] + 0/*diff*/, true);
                    // if (prod ===14)
                    //   console.log("check " + this.companies[x].productid + ":  " + price + " > " + (product.pricePurchase * 2 / 3) + " Bestand: " + this.market[prod]);

                    if (price > product.pricePurchase * 4 / 5) {
                        this.market[prod] = this.market[prod] + diff;
                        // if (prod===14)
                        //   console.log("produce " + this.companies[x].productid + ":" + diff + "/" + "  ->" + untilNow + "/" + totalDailyProduce);
                    }
                }
                this.neutralDailyProducedToday[x] = this.neutralDailyProducedToday[x] + diff;
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
    updateDailyConsumtion() {

        //neutral companies
        if (this.consumedToday === undefined) {
            this.consumedToday = [];
            for (var x = 0; x < allProducts.length; x++) {
                this.consumedToday[x] = 0;
            }
        }
        var dayProcent = this.world.game.date.getHours() / 24;
        if (this.world.game.date.getDate() !== new Date(this.lastUpdate).getDate()) {
            dayProcent = 1;

        }

        for (var x = 0; x < allProducts.length; x++) {
            var totalDailyConsumtion = Math.round(allProducts[x].dailyConsumtion * this.people);
            var untilNow = Math.round(totalDailyConsumtion * dayProcent);
            if (untilNow > this.consumedToday[x]) {
                var diff = untilNow - this.consumedToday[x];
                var product = allProducts[x];
                var price = product.calcPrice(this.people, this.market[x] - diff, false);
                var priceMax = product.priceSelling + getRandomInt(Math.round(product.priceSelling) * 4 / 3 - product.priceSelling);
                this.consumedToday[x] = untilNow;
                if (price <= priceMax) {
                    /* if (this.isProducedHere(product.id)) {
                         console.log(x+"kaufe von markt " + price + "<=" + priceMax+" ("+this.market[x]+")");
                     }*/
                    this.market[x] -= diff;
                    this.score[x] = Math.round((this.score[x] + 0.2) * 100) / 100;
                } else {
                    this.score[x] = Math.round((this.score[x] - 0.1) * 100) / 100;

                    /* if (this.isProducedHere(product.id)) {
                         console.log(x+"zu teuer " + price + ">" + priceMax);
                     }*/

                }
                if (this.score[x] > 100)
                    this.score[x] = 100;

            }
            if (dayProcent === 1) {
                this.consumedToday[x] = 0;
            }
        }
    }
    update() {
        if (this.lastUpdate === undefined) {
            this.lastUpdate = this.world.game.date.getTime();
        }

        this.domDesc.innerHTML=this.name+"("+this.people.toLocaleString()+")" + "<br/>"+allProducts[0].getIcon()+" "+Icons.edit;
      

        this.updateNeutralCompanies();
        for(var x=0;x<this.companies.length;x++){
            this.companies[x].update();
        }
        this.updateDailyConsumtion();
        this.lastUpdate = this.world.game.date.getTime();
    }

    oncontextmenu(evt: MouseEvent) {
        evt.preventDefault();
        //(<Airplane>this.world.selection).status = "to " + this.name;
        (<Airplane>this.world.selection).flyTo(this);
        console.log(evt.offsetX);


    }
    onclick(th: MouseEvent) {
        th.preventDefault();
        var h = CityDialog.getInstance();
        h.city = this;
        h.show();
        
    }
}

function createCities2(count, checkProduction = false) {
    var allids = [];
    var cities:City[]=[]
    for (var x = 0; x < count; x++) {
        var city = new City();
        cities.push(city);
        for (var y = 0; y < city.companies.length; y++) {
            allids.push(city.companies[y].productid);

        }

    }
    if (checkProduction) {
        //check if all Procducts with distribution> 4could be produces
        for (var x = 0; x < allProducts.length; x++) {
            if (allProducts[x].distribution > 4 && allids.indexOf(allProducts[x].id) === -1) {

                return createCities2(count);
            }
        }
    }
    return cities;
}
function calcPosNewCity(world: World, deep) {
    var x = getRandomInt(world.game.mapWidth);
    var y = getRandomInt(world.game.mapHeight);
    for (var i = 0; i < world.cities.length; i++) {
        var ct = world.cities[i];
        if (x > (ct.x - 100) && x < (ct.x + 100) && y > (ct.y - 100) && (y < ct.y + 100)) {
            //conflict
            if (deep > 0) {
                deep--;
                return calcPosNewCity(world, deep);
            } else { //
                world.game.mapHeight = world.game.mapHeight + 100;
                world.game.mapWidth = world.game.mapWidth + 100;
                return calcPosNewCity(world, deep);
            }
        }
    }
    return [x, y]
}
export function createCities(world: World, count: number) {
    if (world.cities.length === 0 && count < 5) {
        throw new Error("min 5 cities");
    }
    var cities=[];
    if (world.cities.length === 0)
        cities=createCities2(count, true);
    else
        cities=createCities2(count,false);

    var allready = [];
    for (var x = 0; x < world.cities.length; x++) {
        allready.push(world.cities[x].id);
    }
    for (var x = 0; x < count; x++) {
        if (world.cities.length >= allCities.length)
            throw "No more cities available";
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
        city.people = 1000;
        var num = getRandomInt(allCities.length);
        while (allready.indexOf(num) !== -1) {
            num = getRandomInt(allCities.length);
        }
        allready.push(num);
        city.id = num;
        city.name = allCities[num][1];
        city.country = allCities[num][0];
        city.icon = "https://" + allCities[num][2];
      //  cities.push(city);
    }
    return cities;
}
export function test() {

}
var allCities = [
    ["Afghanistan", "Kabul", "upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Flag_of_Afghanistan_%282004%E2%80%932021%29.svg/20px-Flag_of_Afghanistan_%282004%E2%80%932021%29.svg.png"],
    ["Ägypten", "Kairo", "upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/20px-Flag_of_Egypt.svg.png"],
    ["Albanien", "Tirana", "upload.wikimedia.org/wikipedia/commons/thumb/3/36/Flag_of_Albania.svg/20px-Flag_of_Albania.svg.png"],
    ["Algerien", "Algier", "upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Algeria.svg/20px-Flag_of_Algeria.svg.png"],
    ["Andorra", "Andorra la Vella", "upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Andorra.svg/20px-Flag_of_Andorra.svg.png"],
    ["Angola", "Luanda", "upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Angola.svg/20px-Flag_of_Angola.svg.png"],
    ["Antigua und Barbuda", "Saint John’s (Antigua und Barbuda)", "upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Antigua_and_Barbuda.svg/20px-Flag_of_Antigua_and_Barbuda.svg.png"],
    ["Äquatorialguinea", "Malabo", "upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Equatorial_Guinea.svg/20px-Flag_of_Equatorial_Guinea.svg.png"],
    ["Argentinien", "Buenos Aires", "upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/20px-Flag_of_Argentina.svg.png"],
    ["Armenien", "Jerewan", "upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Armenia.svg/20px-Flag_of_Armenia.svg.png"],
    ["Aserbaidschan", "Baku", "upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Azerbaijan.svg/20px-Flag_of_Azerbaijan.svg.png"],
    ["Äthiopien", "Addis Abeba", "upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_Ethiopia.svg/20px-Flag_of_Ethiopia.svg.png"],
    ["Australien", "Canberra", "upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/20px-Flag_of_Australia_%28converted%29.svg.png"],
    ["Bahamas", "Nassau (Bahamas)", "upload.wikimedia.org/wikipedia/commons/thumb/9/93/Flag_of_the_Bahamas.svg/20px-Flag_of_the_Bahamas.svg.png"],
    ["Bahrain", "Manama", "upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Bahrain.svg/20px-Flag_of_Bahrain.svg.png"],
    ["Bangladesch", "Dhaka", "upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/20px-Flag_of_Bangladesh.svg.png"],
    ["Barbados", "Bridgetown", "upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Barbados.svg/20px-Flag_of_Barbados.svg.png"],
    ["Belarus", "Minsk", "upload.wikimedia.org/wikipedia/commons/thumb/8/85/Flag_of_Belarus.svg/20px-Flag_of_Belarus.svg.png"],
    ["Belgien", "Brüssel", "upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_Belgium_%28civil%29.svg/20px-Flag_of_Belgium_%28civil%29.svg.png"],
    ["Belize", "Belmopan", "upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Flag_of_Belize.svg/20px-Flag_of_Belize.svg.png"],
    ["Benin", "Porto-Novo", "upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Benin.svg/20px-Flag_of_Benin.svg.png"],
    ["Bhutan", "Thimphu", "upload.wikimedia.org/wikipedia/commons/thumb/9/91/Flag_of_Bhutan.svg/20px-Flag_of_Bhutan.svg.png"],
    ["Bolivien", "Sucre", "upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Bolivia.svg/20px-Flag_of_Bolivia.svg.png"],
    ["Bosnien und Herzegowina", "Sarajevo", "upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Flag_of_Bosnia_and_Herzegovina.svg/20px-Flag_of_Bosnia_and_Herzegovina.svg.png"],
    ["Botswana", "Gaborone", "upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_Botswana.svg/20px-Flag_of_Botswana.svg.png"],
    ["Brasilien", "Brasília", "upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/20px-Flag_of_Brazil.svg.png"],
    ["Brunei", "Bandar Seri Begawan", "upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Brunei.svg/20px-Flag_of_Brunei.svg.png"],
    ["Bulgarien", "Sofia", "upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Bulgaria.svg/20px-Flag_of_Bulgaria.svg.png"],
    ["Burkina Faso", "Ouagadougou", "upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Burkina_Faso.svg/20px-Flag_of_Burkina_Faso.svg.png"],
    ["Burundi", "Gitega", "upload.wikimedia.org/wikipedia/commons/thumb/5/50/Flag_of_Burundi.svg/20px-Flag_of_Burundi.svg.png"],
    ["Chile", "Santiago de Chile", "upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/20px-Flag_of_Chile.svg.png"],
    ["Costa Rica", "San José (Costa Rica)", "upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Costa_Rica.svg/20px-Flag_of_Costa_Rica.svg.png"],
    ["Dänemark", "Kopenhagen", "upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Denmark.svg/20px-Flag_of_Denmark.svg.png"],
    ["Demokratische Republik Kongo", "Kinshasa", "upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg/20px-Flag_of_the_Democratic_Republic_of_the_Congo.svg.png"],
    ["Deutschland", "Berlin", "upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/20px-Flag_of_Germany.svg.png"],
    ["Dominica", "Roseau", "upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Flag_of_Dominica.svg/20px-Flag_of_Dominica.svg.png"],
    ["Dominikanische Republik", "Santo Domingo", "upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_the_Dominican_Republic.svg/20px-Flag_of_the_Dominican_Republic.svg.png"],
    ["Dschibuti", "Dschibuti (Stadt)", "upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_Djibouti.svg/20px-Flag_of_Djibouti.svg.png"],
    ["Ecuador", "Quito", "upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Flag_of_Ecuador.svg/20px-Flag_of_Ecuador.svg.png"],
    ["El Salvador", "San Salvador", "upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_El_Salvador.svg/20px-Flag_of_El_Salvador.svg.png"],
    ["Elfenbeinküste", "Yamoussoukro", "upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_C%C3%B4te_d%27Ivoire.svg/20px-Flag_of_C%C3%B4te_d%27Ivoire.svg.png"],
    ["Eritrea", "Asmara", "upload.wikimedia.org/wikipedia/commons/thumb/2/29/Flag_of_Eritrea.svg/20px-Flag_of_Eritrea.svg.png"],
    ["Estland", "Tallinn", "upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flag_of_Estonia.svg/20px-Flag_of_Estonia.svg.png"],
    ["Eswatini", "Mbabane", "upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Flag_of_Eswatini.svg/20px-Flag_of_Eswatini.svg.png"],
    ["Fidschi", "Suva", "upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Fiji.svg/20px-Flag_of_Fiji.svg.png"],
    ["Finnland", "Helsinki", "upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Flag_of_Finland_icon.svg/20px-Flag_of_Finland_icon.svg.png"],
    ["Frankreich", "Paris", "upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_France_%281794%E2%80%931815%2C_1830%E2%80%931974%2C_2020%E2%80%93present%29.svg/20px-Flag_of_France_%281794%E2%80%931815%2C_1830%E2%80%931974%2C_2020%E2%80%93present%29.svg.png"],
    ["Gabun", "Libreville", "upload.wikimedia.org/wikipedia/commons/thumb/0/04/Flag_of_Gabon.svg/20px-Flag_of_Gabon.svg.png"],
    ["Gambia", "Banjul", "upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_The_Gambia.svg/20px-Flag_of_The_Gambia.svg.png"],
    ["Georgien", "Tiflis", "upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Georgia.svg/20px-Flag_of_Georgia.svg.png"],
    ["Ghana", "Accra", "upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/20px-Flag_of_Ghana.svg.png"],
    ["Grenada", "St. George’s", "upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Grenada.svg/20px-Flag_of_Grenada.svg.png"],
    ["Griechenland", "Athen", "upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Greece.svg/20px-Flag_of_Greece.svg.png"],
    ["Guatemala", "Guatemala-Stadt", "upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Flag_of_Guatemala.svg/20px-Flag_of_Guatemala.svg.png"],
    ["Guinea-Bissau", "Bissau", "upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Guinea-Bissau.svg/20px-Flag_of_Guinea-Bissau.svg.png"],
    ["Guinea", "Conakry", "upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Flag_of_Guinea.svg/20px-Flag_of_Guinea.svg.png"],
    ["Guyana", "Georgetown (Guyana)", "upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_Guyana.svg/20px-Flag_of_Guyana.svg.png"],
    ["Haiti", "Port-au-Prince", "upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Haiti.svg/20px-Flag_of_Haiti.svg.png"],
    ["Honduras", "Tegucigalpa", "upload.wikimedia.org/wikipedia/commons/thumb/8/82/Flag_of_Honduras.svg/20px-Flag_of_Honduras.svg.png"],
    ["Indien", "Neu-Delhi", "upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_India.svg/20px-Flag_of_India.svg.png"],
    ["Indonesien", "Jakarta", "upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/20px-Flag_of_Indonesia.svg.png"],
    ["Irak", "Bagdad", "upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_Iraq.svg/20px-Flag_of_Iraq.svg.png"],
    ["Iran", "Teheran", "upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Iran.svg/20px-Flag_of_Iran.svg.png"],
    ["Irland", "Dublin", "upload.wikimedia.org/wikipedia/commons/thumb/4/45/Flag_of_Ireland.svg/20px-Flag_of_Ireland.svg.png"],
    ["Island", "Reykjavík", "upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Iceland.svg/20px-Flag_of_Iceland.svg.png"],
    ["Israel", "Jerusalem", "upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Israel.svg/20px-Flag_of_Israel.svg.png"],
    ["Italien", "Rom", "upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/20px-Flag_of_Italy.svg.png"],
    ["Jamaika", "Kingston (Jamaika)", "upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Jamaica.svg/20px-Flag_of_Jamaica.svg.png"],
    ["Japan", "Tokio", "upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/20px-Flag_of_Japan.svg.png"],
    ["Jemen", "Sanaa", "upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Yemen.svg/20px-Flag_of_Yemen.svg.png"],
    ["Jordanien", "Amman", "upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_Jordan.svg/20px-Flag_of_Jordan.svg.png"],
    ["Kambodscha", "Phnom Penh", "upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_Cambodia.svg/20px-Flag_of_Cambodia.svg.png"],
    ["Kamerun", "Yaoundé", "upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Cameroon.svg/20px-Flag_of_Cameroon.svg.png"],
    ["Kanada", "Ottawa", "upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/20px-Flag_of_Canada_%28Pantone%29.svg.png"],
    ["Kap Verde", "Praia", "upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Cape_Verde.svg/20px-Flag_of_Cape_Verde.svg.png"],
    ["Kasachstan", "Astana", "upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kazakhstan.svg/20px-Flag_of_Kazakhstan.svg.png"],
    ["Katar", "Doha", "upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/20px-Flag_of_Qatar.svg.png"],
    ["Kenia", "Nairobi", "upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/20px-Flag_of_Kenya.svg.png"],
    ["Kirgisistan", "Bischkek", "upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Flag_of_Kyrgyzstan.svg/20px-Flag_of_Kyrgyzstan.svg.png"],
    ["Kiribati", "South Tarawa", "upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kiribati.svg/20px-Flag_of_Kiribati.svg.png"],
    ["Kolumbien", "Bogotá", "upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/20px-Flag_of_Colombia.svg.png"],
    ["Komoren", "Moroni (Komoren)", "upload.wikimedia.org/wikipedia/commons/thumb/9/94/Flag_of_the_Comoros.svg/20px-Flag_of_the_Comoros.svg.png"],
    ["Kroatien", "Zagreb", "upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Croatia.svg/20px-Flag_of_Croatia.svg.png"],
    ["Kuba", "Havanna", "upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Flag_of_Cuba.svg/20px-Flag_of_Cuba.svg.png"],
    ["Kuwait", "Kuwait (Stadt)", "upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Kuwait.svg/20px-Flag_of_Kuwait.svg.png"],
    ["Laos", "Vientiane", "upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Laos.svg/20px-Flag_of_Laos.svg.png"],
    ["Lesotho", "Maseru", "upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Flag_of_Lesotho.svg/20px-Flag_of_Lesotho.svg.png"],
    ["Lettland", "Riga", "upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Latvia.svg/20px-Flag_of_Latvia.svg.png"],
    ["Libanon", "Beirut", "upload.wikimedia.org/wikipedia/commons/thumb/5/59/Flag_of_Lebanon.svg/20px-Flag_of_Lebanon.svg.png"],
    ["Liberia", "Monrovia", "upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Flag_of_Liberia.svg/20px-Flag_of_Liberia.svg.png"],
    ["Libyen", "Tripolis", "upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Libya.svg/20px-Flag_of_Libya.svg.png"],
    ["Liechtenstein", "Vaduz", "upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Liechtenstein.svg/20px-Flag_of_Liechtenstein.svg.png"],
    ["Litauen", "Vilnius", "upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Lithuania.svg/20px-Flag_of_Lithuania.svg.png"],
    ["Luxemburg", "Luxemburg (Stadt)", "upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Luxembourg.svg/20px-Flag_of_Luxembourg.svg.png"],
    ["Madagaskar", "Antananarivo", "upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Madagascar.svg/20px-Flag_of_Madagascar.svg.png"],
    ["Malawi", "Lilongwe", "upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Flag_of_Malawi.svg/20px-Flag_of_Malawi.svg.png"],
    ["Malaysia", "Kuala Lumpur", "upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flag_of_Malaysia.svg/20px-Flag_of_Malaysia.svg.png"],
    ["Malediven", "Malé", "upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Maldives.svg/20px-Flag_of_Maldives.svg.png"],
    ["Mali", "Bamako", "upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_Mali.svg/20px-Flag_of_Mali.svg.png"],
    ["Malta", "Valletta", "upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Malta.svg/20px-Flag_of_Malta.svg.png"],
    ["Marokko", "Rabat", "upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/20px-Flag_of_Morocco.svg.png"],
    ["Marshallinseln", "Majuro", "upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flag_of_the_Marshall_Islands.svg/20px-Flag_of_the_Marshall_Islands.svg.png"],
    ["Mauretanien", "Nouakchott", "upload.wikimedia.org/wikipedia/commons/thumb/4/43/Flag_of_Mauritania.svg/20px-Flag_of_Mauritania.svg.png"],
    ["Mauritius", "Port Louis", "upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Mauritius.svg/20px-Flag_of_Mauritius.svg.png"],
    ["Mexiko", "Mexiko-Stadt", "upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/20px-Flag_of_Mexico.svg.png"],
    ["Mikronesien", "Palikir", "upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Flag_of_the_Federated_States_of_Micronesia.svg/20px-Flag_of_the_Federated_States_of_Micronesia.svg.png"],
    ["Monaco", "Mongolei", "upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Flag_of_Monaco.svg/20px-Flag_of_Monaco.svg.png"],
    ["Mongolei", "Ulaanbaatar", "upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Mongolia.svg/20px-Flag_of_Mongolia.svg.png"],
    ["Montenegro", "Podgorica", "upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Montenegro.svg/20px-Flag_of_Montenegro.svg.png"],
    ["Mosambik", "Maputo", "upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Mozambique.svg/20px-Flag_of_Mozambique.svg.png"],
    ["Myanmar", "Naypyidaw", "upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Flag_of_Myanmar.svg/20px-Flag_of_Myanmar.svg.png"],
    ["Namibia", "Windhoek", "upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Namibia.svg/20px-Flag_of_Namibia.svg.png"],
    ["Nauru", "Yaren (Distrikt)", "upload.wikimedia.org/wikipedia/commons/thumb/3/30/Flag_of_Nauru.svg/20px-Flag_of_Nauru.svg.png"],
    ["Nepal", "Kathmandu", "upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_Nepal_%28with_spacing%2C_aspect_ratio_4-3%29.svg/20px-Flag_of_Nepal_%28with_spacing%2C_aspect_ratio_4-3%29.svg.png"],
    ["Neuseeland", "Wellington", "upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/20px-Flag_of_New_Zealand.svg.png"],
    ["Nicaragua", "Managua", "upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Nicaragua.svg/20px-Flag_of_Nicaragua.svg.png"],
    ["Niederlande", "Amsterdam", "upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/20px-Flag_of_the_Netherlands.svg.png"],
    ["Niger", "Niamey", "upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Flag_of_Niger.svg/20px-Flag_of_Niger.svg.png"],
    ["Nigeria", "Abuja", "upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/20px-Flag_of_Nigeria.svg.png"],
    ["Nordkorea", "Pjöngjang", "upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_North_Korea.svg/20px-Flag_of_North_Korea.svg.png"],
    ["Nordmazedonien", "Skopje", "upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_North_Macedonia.svg/20px-Flag_of_North_Macedonia.svg.png"],
    ["Norwegen", "Oslo", "upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/18px-Flag_of_Norway.svg.png"],
    ["Oman", "Maskat", "upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Oman.svg/18px-Flag_of_Oman.svg.png"],
    ["Österreich", "Wien", "upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Austria.svg/20px-Flag_of_Austria.svg.png"],
    ["Osttimor", "Dili", "upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_East_Timor.svg/20px-Flag_of_East_Timor.svg.png"],
    ["Pakistan", "Islamabad", "upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/18px-Flag_of_Pakistan.svg.png"],
    ["Palau", "Ngerulmud", "upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Palau.svg/20px-Flag_of_Palau.svg.png"],
    ["Panama", "Panama-Stadt", "upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/18px-Flag_of_Panama.svg.png"],
    ["Papua-Neuguinea", "Port Moresby", "upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Flag_of_Papua_New_Guinea.svg/20px-Flag_of_Papua_New_Guinea.svg.png"],
    ["Paraguay", "Asunción", "upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Paraguay.svg/20px-Flag_of_Paraguay.svg.png"],
    ["Peru", "Lima", "upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Peru.svg/20px-Flag_of_Peru.svg.png"],
    ["Philippinen", "Manila", "upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_the_Philippines.svg/20px-Flag_of_the_Philippines.svg.png"],
    ["Polen", "Warschau", "upload.wikimedia.org/wikipedia/commons/thumb/1/12/Flag_of_Poland.svg/20px-Flag_of_Poland.svg.png"],
    ["Portugal", "Lissabon", "upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/20px-Flag_of_Portugal.svg.png"],
    ["Republik Kongo", "Brazzaville", "upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_the_Republic_of_the_Congo.svg/20px-Flag_of_the_Republic_of_the_Congo.svg.png"],
    ["Republik Moldau", "Chișinău", "upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Moldova.svg/20px-Flag_of_Moldova.svg.png"],
    ["Ruanda", "Kigali", "upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Rwanda.svg/20px-Flag_of_Rwanda.svg.png"],
    ["Rumänien", "Bukarest", "upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/20px-Flag_of_Romania.svg.png"],
    ["Russland", "Moskau", "upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/20px-Flag_of_Russia.svg.png"],
    ["Salomonen", "Honiara", "upload.wikimedia.org/wikipedia/commons/thumb/7/74/Flag_of_the_Solomon_Islands.svg/20px-Flag_of_the_Solomon_Islands.svg.png"],
    ["Sambia", "Lusaka", "upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/20px-Flag_of_Zambia.svg.png"],
    ["Samoa", "Apia", "upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Samoa.svg/20px-Flag_of_Samoa.svg.png"],
    ["San Marino", "Stadt San Marino", "upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Flag_of_San_Marino.svg/20px-Flag_of_San_Marino.svg.png"],
    ["São Tomé und Príncipe", "São Tomé", "upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Sao_Tome_and_Principe.svg/20px-Flag_of_Sao_Tome_and_Principe.svg.png"],
    ["Saudi-Arabien", "Riad", "upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/20px-Flag_of_Saudi_Arabia.svg.png"],
    ["Schweden", "Stockholm", "upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/20px-Flag_of_Sweden.svg.png"],
    ["Schweiz", "Bern", "upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Flag_of_Switzerland_within_2to3.svg/20px-Flag_of_Switzerland_within_2to3.svg.png"],
    ["Senegal", "Dakar", "upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/20px-Flag_of_Senegal.svg.png"],
    ["Serbien", "Belgrad", "upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Flag_of_Serbia.svg/20px-Flag_of_Serbia.svg.png"],
    ["Seychellen", "Victoria (Seychellen)", "upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Seychelles.svg/20px-Flag_of_Seychelles.svg.png"],
    ["Sierra Leone", "Freetown", "upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Sierra_Leone.svg/20px-Flag_of_Sierra_Leone.svg.png"],
    ["Simbabwe", "Harare", "upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Zimbabwe.svg/20px-Flag_of_Zimbabwe.svg.png"],
    ["Singapur", "Slowakei", "upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/20px-Flag_of_Singapore.svg.png"],
    ["Slowakei", "Bratislava", "upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_Slovakia.svg/20px-Flag_of_Slovakia.svg.png"],
    ["Slowenien", "Ljubljana", "upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Flag_of_Slovenia.svg/20px-Flag_of_Slovenia.svg.png"],
    ["Somalia", "Mogadischu", "upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Flag_of_Somalia.svg/20px-Flag_of_Somalia.svg.png"],
    ["Spanien", "Madrid", "upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/20px-Flag_of_Spain.svg.png"],
    ["Sri Lanka", "Sri Jayewardenepura Kotte", "upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Sri_Lanka.svg/20px-Flag_of_Sri_Lanka.svg.png"],
    ["St. Kitts Nevis", "Basseterre", "upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Saint_Kitts_and_Nevis.svg/20px-Flag_of_Saint_Kitts_and_Nevis.svg.png"],
    ["St. Lucia", "Castries", "upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Saint_Lucia.svg/20px-Flag_of_Saint_Lucia.svg.png"],
    ["St. Vincent und die Grenadinen", "Kingstown", "upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Flag_of_Saint_Vincent_and_the_Grenadines.svg/20px-Flag_of_Saint_Vincent_and_the_Grenadines.svg.png"],
    ["Südafrika", "Bloemfontein", "upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/20px-Flag_of_South_Africa.svg.png"],
    ["Sudan", "Khartum", "upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Sudan.svg/20px-Flag_of_Sudan.svg.png"],
    ["Südkorea", "Seoul", "upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/20px-Flag_of_South_Korea.svg.png"],
    ["Südsudan", "Juba", "upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Flag_of_South_Sudan.svg/20px-Flag_of_South_Sudan.svg.png"],
    ["Suriname", "Paramaribo", "upload.wikimedia.org/wikipedia/commons/thumb/6/60/Flag_of_Suriname.svg/20px-Flag_of_Suriname.svg.png"],
    ["Syrien", "Damaskus", "upload.wikimedia.org/wikipedia/commons/thumb/5/53/Flag_of_Syria.svg/20px-Flag_of_Syria.svg.png"],
    ["Tadschikistan", "Duschanbe", "upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/20px-Flag_of_Tajikistan.svg.png"],
    ["Tansania", "Dodoma", "upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tanzania.svg/20px-Flag_of_Tanzania.svg.png"],
    ["Thailand", "Bangkok", "upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/20px-Flag_of_Thailand.svg.png"],
    ["Togo", "Lomé", "upload.wikimedia.org/wikipedia/commons/thumb/6/68/Flag_of_Togo.svg/20px-Flag_of_Togo.svg.png"],
    ["Tonga", "Nukuʻalofa", "upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Tonga.svg/20px-Flag_of_Tonga.svg.png"],
    ["Trinidad und Tobago", "Port of Spain", "upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Trinidad_and_Tobago.svg/20px-Flag_of_Trinidad_and_Tobago.svg.png"],
    ["Tschad", "N’Djamena", "upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Flag_of_Chad.svg/20px-Flag_of_Chad.svg.png"],
    ["Tschechien", "Prag", "upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/20px-Flag_of_the_Czech_Republic.svg.png"],
    ["Tunesien", "Tunis", "upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Tunisia.svg/20px-Flag_of_Tunisia.svg.png"],
    ["Türkei", "Ankara", "upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/20px-Flag_of_Turkey.svg.png"],
    ["Turkmenistan", "Aşgabat", "upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Turkmenistan.svg/20px-Flag_of_Turkmenistan.svg.png"],
    ["Tuvalu", "Funafuti", "upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tuvalu.svg/20px-Flag_of_Tuvalu.svg.png"],
    ["Uganda", "Kampala", "upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Flag_of_Uganda.svg/20px-Flag_of_Uganda.svg.png"],
    ["Ukraine", "Kiew", "upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/20px-Flag_of_Ukraine.svg.png"],
    ["Ungarn", "Budapest", "upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/20px-Flag_of_Hungary.svg.png"],
    ["Uruguay", "Montevideo", "upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Uruguay.svg/20px-Flag_of_Uruguay.svg.png"],
    ["Usbekistan", "Taschkent", "upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/20px-Flag_of_Uzbekistan.svg.png"],
    ["Vanuatu", "Port Vila", "upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Vanuatu.svg/20px-Flag_of_Vanuatu.svg.png"],
    ["Vatikan", "Vatikanstadt", "upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_the_Vatican_City.svg/20px-Flag_of_the_Vatican_City.svg.png"],
    ["Venezuela", "Caracas", "upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/20px-Flag_of_Venezuela.svg.png"],
    ["Vereinigte Arabische Emirate", "Abu Dhabi", "upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/20px-Flag_of_the_United_Arab_Emirates.svg.png"],
    ["Vereinigte Staaten", "Washington, D.C.", "upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/20px-Flag_of_the_United_States.svg.png"],
    ["Vereinigtes Königreich", "London", "upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/20px-Flag_of_the_United_Kingdom.svg.png"],
    ["Vietnam", "Hanoi", "upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/20px-Flag_of_Vietnam.svg.png"],
    ["Volksrepublik China", "Peking", "upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/20px-Flag_of_the_People%27s_Republic_of_China.svg.png"],
    ["Zentralafrikanische Republik", "Bangui", "upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Central_African_Republic.svg/20px-Flag_of_the_Central_African_Republic.svg.png"],
]
