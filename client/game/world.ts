import { Panel } from "jassijs/ui/Panel";
import { City, createCities } from "game/city";
import { Airplane } from "game/airplane";
import windows from "jassijs/base/Windows";
import { CityDialog } from "game/citydialog";
import { Game } from "game/game";
import { AirplaneDialog } from "game/airplanedialog";
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
        if (th.target === this.dom && !AirplaneDialog.getInstance().dropCitiesEnabled) {
            try {
                CityDialog.getInstance().close();
            } catch {

            }
            try {
                AirplaneDialog.getInstance().close();

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
                ges += this.airplanes[x].costs;
            }
            this.game.changeMoney(-ges, "daily costs airplane");
        }
        this.lastUpdate = this.game.date.getTime();
    }
    addCity() {
        var city: City = createCities(this, 1)[0];
        city.render(this.cities.indexOf(city));
        city.update();

    }

    newGame() {
        createCities(this, 15);
        for (var x = 0; x < 1; x++) {
            var ap = new Airplane(this);
            ap.name = "Airplane " + x;
            ap.speed = 200;
            ap.x = getRandomInt(this.game.mapWidth);
            ap.y = getRandomInt(this.game.mapHeight);
            ap.world = this;
            this.airplanes.push(ap);
        }
        this.cities[0].houses = 1;
        this.cities[0].warehouses = 1;
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

