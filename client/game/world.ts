import { Panel } from "jassijs/ui/Panel";
import { City, createCities } from "game/city";
import { Airplane } from "game/airplane";
import windows from "jassijs/base/Windows";
import { CityDialog } from "game/citydialog";
import { Game } from "game/game";
import { AirplaneDialog } from "game/airplanedialog";
import { RouteDialog } from "game/routedialog";
import { SquadronDialog } from "game/squadrondialog";
import { Company } from "game/company";
import { DiagramDialog } from "game/diagramdialog";
import { Product } from "game/product";
import { Icons } from "game/icons";
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
export class World {
    _intervall;
    cities: City[];
    airplanes: Airplane[];
    advertising: number[];
    selection;
    dom: HTMLElement;
    game: Game;
    type = "World";
    lastUpdate = undefined;
    constructor() {
        var _this = this;
        this.cities = [];
        this.airplanes = [];
        this.advertising = [];

        for (var x = 0; x < parameter.allProducts.length; x++) {
            this.advertising.push(undefined);
        }

        this._intervall = setInterval(() => {
            console.log(this._intervall);
            for (var x = 0; x < _this.airplanes?.length; x++) {
                /*if (this.airplanes[x].x < 500)
                    this.airplanes[x].x = this.airplanes[x].x + 1;
                else {
                    this.airplanes[x].x = 100;
                }*/
                _this.airplanes[x].update();
            }
        }, 100);
       // console.log("CreateIntervall"+ this._intervall );

    }
    private getElementOffset(el) {
        let top = 0;
        let left = 0;
        let element = el;

        // Loop through the DOM tree
        // and add it's parent's offset to get page offset
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return {
            top,
            left,
        };
    }
    findAirplane(name: string) {
        for (var x = 0; x < this.airplanes.length; x++) {
            if (this.airplanes[x].name === name) {
                return this.airplanes[x];
            }
            for (var i = 0; i < this.airplanes[x].squadron.length; i++) {
                if (this.airplanes[x].squadron[i].name === name) {
                    return this.airplanes[x].squadron[i];
                }
            }
        }
    }
    oncontextmenu(evt: MouseEvent) {
        evt.preventDefault();
        /*
                 if(this.selection){
                     var pt=this.getElementOffset(evt.currentTarget);
                    (<Airplane>this.selection).flyTo(evt.x-pt.left-8,evt.y-pt.top-10);
                    console.log(evt.offsetX);
                }*/

    }
    onclick(th: MouseEvent) {
        console.log("close");
        this.selection?.unselect();
        if (th.target === this.dom) {
            try {
                CityDialog.getInstance().close();
            } catch {

            }
            try {
                AirplaneDialog.getInstance().close();

            } catch {

            }
            try {
                RouteDialog.getInstance().close();
            } catch {

            }
            try {
                SquadronDialog.getInstance().close();
            } catch {

            }
            try {
                DiagramDialog.getInstance().close();
            } catch {

            }
        }
    }
    updateUI(){
        DiagramDialog.getInstance().update();
          for (var x = 0; x < this.cities?.length; x++) {
            this.cities[x].updateUI();
        }
    }
    update() {
        if (this.lastUpdate === undefined) {
            this.lastUpdate = this.game.date.getTime();
        }

        for (var x = 0; x < this.cities?.length; x++) {
            /*if (this.airplanes[x].x < 500)
                this.airplanes[x].x = this.airplanes[x].x + 1;
            else {
                this.airplanes[x].x = 100;
            }*/
            this.cities[x].update();
        }
        if (this.game.date.getMonth() !== new Date(this.lastUpdate).getMonth()) {
            Product.randomUpdateConsumtion(this);
        }
        if (this.game.date.getDate() !== new Date(this.lastUpdate).getDate()) {
            var i=getRandomInt(80);
            if (i === 0)
                this.showMoveIcon();
            for (var y = 0; y < parameter.allProducts.length; y++) {
                if (this.game.world.advertising[y] && this.game.date.getTime() > this.game.world.advertising[y]) {
                    this.game.world.advertising[y] = undefined;
                }
            }
            var ges = 0;
            for (var x = 0; x < this.airplanes.length; x++) {
                ges += Math.round(this.airplanes[x].getDailyCosts() * parameter.rateCostsAirplaine);
            }
            this.game.changeMoney(-ges, "daily costs airplane");
            this.updateStatistics();
            
        }
        this.lastUpdate = this.game.date.getTime();
    }
    updateStatistics() {
        var stat = this.game.statistic;
        stat.yesterday = stat.today;
        stat.today = {};
        var data1 = [];
        var data2 = [];
        for (var x = 0; x < parameter.allProducts.length; x++) {
            data1.push(0);
            data2.push(0);
        }
        stat.successfulLoad.splice(0, 0, data1);
        stat.unsuccessfulLoad.splice(0, 0, data2);
        stat.successfulLoad.splice(7, 1);
        stat.unsuccessfulLoad.splice(7, 1);
    }
    addCity(hasAirport = true) {
        var city: City = createCities(this, 1)[0];
        city.hasAirport = hasAirport;
        city.render(this.cities.indexOf(city));
        city.update();

    }
   
    newGame() {
        createCities(this, 15);
        this.cities[0].shops = 1;
        this.cities[0].houses = 1;


        createCities(this, 1);
        this.cities[this.cities.length - 1].hasAirport = false;
        for (var x = 0; x < 1; x++) {
            var ap = new Airplane(this);
            ap.name = parameter.allAirplaneTypes[0].model + (x + 1);
            ap.speed = parameter.allAirplaneTypes[0].speed;
            ap.costs = parameter.allAirplaneTypes[0].costs;
            ap.capacity = parameter.allAirplaneTypes[0].capacity;
            ap.x = this.cities[0].x;
            ap.y = this.cities[0].y;
            ap.typeid = parameter.allAirplaneTypes[0].typeid;
            ap.world = this;
            this.airplanes.push(ap);
        }
        

        //Lastenausgleich   
      /*  parameter.neutralStartPeople = 0;
        var anz = 100;
        this.cities = [this.cities[0]];
        this.cities[0].companies = [];
        for (var x = 0; x < 19; x++) {
            var comp = new Company();
            comp.city = this.cities[0];
            comp.productid = x;
            comp.workers = 20 * anz;
            comp.buildings = anz;
            this.cities[0].companies.push(comp);
            this.cities[0].shop[x] = 10000000;
        }
        this.cities[0].people = anz * 19 * 20;
        this.cities[0].shops = 100000;
        this.cities[0].houses = anz * 19 * 20 / 100 + 1;
        var proz = 0.114;
        var p1 = 0;
        var p2 = 14;
        var ps=JSON.parse('[{"type":"Product","id":0,"name":"Stein","dailyProduce":5,"input1Amount":0,"input2Amount":0,"priceProduction":32,"distribution":3,"amountForPeople":5,"dailyConsumtion":0.013372576177285319,"pricePurchase":36,"priceSelling":40},{"type":"Product","id":1,"name":"Holz","dailyProduce":5,"input1Amount":0,"input2Amount":0,"priceProduction":32,"distribution":3,"amountForPeople":4.5,"dailyConsumtion":0.0117,"pricePurchase":36,"priceSelling":40},{"type":"Product","id":2,"name":"Getreide","dailyProduce":7,"input1Amount":0,"input2Amount":0,"priceProduction":23,"distribution":3,"amountForPeople":3,"dailyConsumtion":0.007788088642659279,"pricePurchase":26,"priceSelling":29},{"type":"Product","id":3,"name":"Eisen","dailyProduce":5,"input1Amount":0,"input2Amount":0,"priceProduction":32,"distribution":3,"amountForPeople":4,"dailyConsumtion":0.009632053894736842,"pricePurchase":36,"priceSelling":40},{"type":"Product","id":4,"name":"Wolle","dailyProduce":5,"input1Amount":0,"input2Amount":0,"priceProduction":32,"distribution":3,"amountForPeople":2.5,"dailyConsumtion":0.006578947368421052,"pricePurchase":36,"priceSelling":40},{"type":"Product","id":5,"name":"Öl","dailyProduce":5,"input1Amount":0,"input2Amount":0,"priceProduction":32,"distribution":3,"amountForPeople":2,"dailyConsumtion":0.005023836842105263,"pricePurchase":36,"priceSelling":40},{"type":"Product","id":6,"name":"Brot","dailyProduce":6,"input1":2,"input1Amount":3,"input2Amount":0,"priceProduction":49,"distribution":2,"amountForPeople":5,"dailyConsumtion":0.013349030470914127,"pricePurchase":55,"priceSelling":61},{"type":"Product","id":7,"name":"Plaste","dailyProduce":6,"input1":5,"input1Amount":3,"input2Amount":0,"priceProduction":57,"distribution":2,"amountForPeople":5,"dailyConsumtion":0.01281578947368421,"pricePurchase":64,"priceSelling":71},{"type":"Product","id":8,"name":"Fleisch","dailyProduce":2,"input1":2,"input1Amount":1,"input2Amount":0,"priceProduction":109,"distribution":2,"amountForPeople":2,"dailyConsumtion":0.005356742382271468,"pricePurchase":123,"priceSelling":136},{"type":"Product","id":9,"name":"Möbel","dailyProduce":2,"input1":1,"input1Amount":0.5,"input2":3,"input2Amount":0.5,"priceProduction":117,"distribution":2,"amountForPeople":2,"dailyConsumtion":0.005490304709141274,"pricePurchase":132,"priceSelling":146},{"type":"Product","id":10,"name":"Kleidung","dailyProduce":1,"input1":4,"input1Amount":2,"input2Amount":0,"priceProduction":286,"distribution":2,"amountForPeople":1,"dailyConsumtion":0.002576698060941828,"pricePurchase":322,"priceSelling":358},{"type":"Product","id":11,"name":"Fisch","dailyProduce":3,"input2Amount":0,"priceProduction":60,"distribution":2,"amountForPeople":2,"dailyConsumtion":0.005263157894736842,"pricePurchase":68,"priceSelling":75},{"type":"Product","id":12,"name":"Apfel","dailyProduce":4,"input2Amount":0,"priceProduction":45,"distribution":2,"amountForPeople":3,"dailyConsumtion":0.00821606648199446,"pricePurchase":51,"priceSelling":56},{"type":"Product","id":13,"name":"Saft","dailyProduce":3,"input1":12,"input1Amount":1,"input2Amount":0,"priceProduction":85,"distribution":1,"amountForPeople":3,"dailyConsumtion":0.007531578947368421,"pricePurchase":96,"priceSelling":106},{"type":"Product","id":14,"name":"Gold","dailyProduce":2,"input1Amount":0,"input2Amount":0,"priceProduction":100,"distribution":1,"amountForPeople":1,"dailyConsumtion":0.002727157894736842,"pricePurchase":113,"priceSelling":125},{"type":"Product","id":15,"name":"Schmuck","dailyProduce":2,"input1":14,"input1Amount":1,"input2Amount":0,"priceProduction":184,"distribution":1,"amountForPeople":2,"dailyConsumtion":0.005263157894736842,"pricePurchase":207,"priceSelling":230},{"type":"Product","id":16,"name":"Spielzeug","dailyProduce":1,"input1":4,"input1Amount":0.5,"input2":7,"input2Amount":0.5,"priceProduction":274,"distribution":1,"amountForPeople":1,"dailyConsumtion":0.00275207756232687,"pricePurchase":308,"priceSelling":343},{"type":"Product","id":17,"name":"Fahrrad","dailyProduce":1,"input1":3,"input1Amount":0.5,"input2":7,"input2Amount":0.5,"priceProduction":274,"distribution":1,"amountForPeople":1,"dailyConsumtion":0.002657894736842105,"pricePurchase":308,"priceSelling":343},{"type":"Product","id":18,"name":"Fischbrot","dailyProduce":1,"input1":11,"input1Amount":1,"input2":6,"input2Amount":1,"priceProduction":382,"distribution":1,"amountForPeople":1,"dailyConsumtion":0.002631578947368421,"pricePurchase":430,"priceSelling":478}]');
        for(var x=0;x<ps.length;x++){
            parameter.allProducts[x].dailyConsumtion=ps[x].dailyConsumtion;
        }
        Product.randomUpdateConsumtion(this,7,18,4.6,true);*/

    }
    render(dom: HTMLElement) {
        var _this = this;
        this.dom = dom;

        for (var x = 0; x < this.cities.length; x++) {
            this.cities[x].render(x);
            this.cities[x].update();
        }
        for (var x = 0; x < this.airplanes.length; x++) {
            var ap = this.airplanes[x];
            ap.render();
            this.dom.appendChild(ap.dom);
        }
        dom.addEventListener("click", (ev: MouseEvent) => {
            _this.onclick(ev);
            return undefined;
        });
        dom.addEventListener("contextmenu", (ev: MouseEvent) => {
            _this.oncontextmenu(ev);
            return undefined;
        });

    }
    findCityAt(x: number, y: number) {
        for (var i = 0; i < this.cities.length; i++) {
            if (this.cities[i].x === x && this.cities[i].y === y) {
                return this.cities[i];
            }
        }
        return undefined;
    }
    destroy() {
        clearInterval(this._intervall);
    }
    private makeCityMovable(sel: any) {
        var _this = this;
        $(sel).draggable({
            stop: function (event, ui) {
                $(sel).draggable("destroy");
                var city: City = (<any>event.target).city;
                setTimeout(() => {
                    _this.makeCityMovable(city.dom);

                }, 400);
                var x = parseInt((<any>event.target).style.left.replace("px", ""));
                var y = parseInt((<any>event.target).style.top.replace("px", ""));
                city.move(x, y);
                //shrink map
                var w = 0;
                var h = 0;
                for (var x = 0; x < _this.cities.length; x++) {
                    w = Math.max(w, _this.cities[x].x);
                    h = Math.max(h, _this.cities[x].y);
                }

                _this.game.mapHeight = Math.min(_this.game.mapHeight, h);
                _this.game.mapWidth = Math.min(_this.game.mapWidth, w);
                _this.game.updateSize();
            }
        });
    }
    showMoveIcon() {
        var _this = this;
        var x = getRandomInt(this.game.mapWidth);
        var y = getRandomInt(this.game.mapHeight);
        var domStar = <any>document.createRange().createContextualFragment('<span style="position:absolute;top:' + (y) +
            'px;left:' + (x) + 'px;font-size:48px;color:yellow;animation: animate   0.5s linear infinite;z-index:4" >' + Icons.move + '</span>').children[0];
        this.dom.appendChild(domStar);
        domStar.addEventListener("click", (ev: MouseEvent) => {
            domStar.style.visibility = "hidden";
            if (confirm("Do you want to move a city (drag and drop)")) {
                _this.makeCityMovable(".city");
            }
            return undefined;
        });
        setTimeout(() => {
            _this.dom.removeChild(domStar);
        }, 8000);
    }
}

