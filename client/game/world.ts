import { Panel } from "jassijs/ui/Panel";
import { City, createCities } from "game/city";
import { Airplane } from "game/airplane";
import windows from "jassijs/base/Windows";
import { CityDialog } from "game/citydialog";
import { Game } from "game/game";
import { AirplaneDialog } from "game/airplanedialog";

export class World {
    _intervall;
    cities: City[];
    airplanes: Airplane[];
    selection;
    dom: HTMLElement;
    game: Game;
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
        if (th.target === this.dom) {
            CityDialog.getInstance().close();
            AirplaneDialog.getInstance().close();
        }
    }
    update() {

        for (var x = 0; x < this.cities?.length; x++) {
            /*if (this.airplanes[x].x < 500)
                this.airplanes[x].x = this.airplanes[x].x + 1;
            else {
                this.airplanes[x].x = 100;
            }*/
            this.cities[x].update();
        }
    }
    addCity() {
        var city = createCities(this, 1)[0];
        city.create();
        city.update();

    }
    create(dom: HTMLElement) {
        var _this = this;
        this.dom = dom;
        createCities(this, 5);
        for (var x = 0; x < this.cities.length; x++) {
            this.cities[x].create();
            this.cities[x].update();


        }
        for (var x = 0; x < 20; x++) {
            var ap = new Airplane(this);
            ap.name = "Airplane " + x;
            ap.speed = 200;
            ap.create();
            ap.world = this;
            this.dom.appendChild(ap.dom);
            this.airplanes.push(ap);
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

