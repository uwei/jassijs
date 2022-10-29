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
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
export class World {
    _intervall;
    cities: City[];
    airplanes: Airplane[];
    selection;
    dom: HTMLElement;
    game: Game;
    type = "World";
    lastUpdate = undefined;
    constructor() {
        var _this = this;
        this.cities = [];
        this.airplanes = [];
        this._intervall = setInterval(() => {
            for (var x = 0; x < _this.airplanes?.length; x++) {
                /*if (this.airplanes[x].x < 500)
                    this.airplanes[x].x = this.airplanes[x].x + 1;
                else {
                    this.airplanes[x].x = 100;
                }*/
                _this.airplanes[x].update();
            }
        }, 100);


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
        if (this.game.date.getDate() !== new Date(this.lastUpdate).getDate()) {
            var ges = 0;
            for (var x = 0; x < this.airplanes.length; x++) {
                ges += Math.round(this.airplanes[x].getDailyCosts()*parameter.rateCostsAirplaine);
            }
            this.game.changeMoney(-ges, "daily costs airplane");
            this.game.statistic.yesterday=this.game.statistic.today;
            this.game.statistic.today={};
        }
        this.lastUpdate = this.game.date.getTime();
    }
    addCity(hasAirport=true) {
        var city: City = createCities(this, 1)[0];
        city.hasAirport=hasAirport;
        city.render(this.cities.indexOf(city));
        city.update();

    }

    newGame() {
        createCities(this, 16);
        this.cities[this.cities.length-1].hasAirport=false;
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
     
     /*
      //Lastenausgleich   
        var anz=100;
        this.cities=[this.cities[0]];
        this.cities[0].companies=[];
        for(var x=0;x<19;x++){
            var comp=new Company();
            comp.city=this.cities[0];
            comp.productid=x;
            comp.workers=20*anz;
            comp.buildings=anz;
            this.cities[0].companies.push(comp);
            this.cities[0].shop[x]=1000000;
        }
        this.cities[0].people=anz*19*20;
        this.cities[0].houses=anz*19*20/100+1;*/
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
}

