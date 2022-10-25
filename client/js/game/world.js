define(["require", "exports", "game/city", "game/airplane", "game/citydialog", "game/airplanedialog", "game/routedialog", "game/squadrondialog", "game/diagramdialog"], function (require, exports, city_1, airplane_1, citydialog_1, airplanedialog_1, routedialog_1, squadrondialog_1, diagramdialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.World = void 0;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    class World {
        constructor() {
            this.type = "World";
            this.lastUpdate = undefined;
            var _this = this;
            this.cities = [];
            this.airplanes = [];
            this._intervall = setInterval(() => {
                var _a;
                for (var x = 0; x < ((_a = _this.airplanes) === null || _a === void 0 ? void 0 : _a.length); x++) {
                    /*if (this.airplanes[x].x < 500)
                        this.airplanes[x].x = this.airplanes[x].x + 1;
                    else {
                        this.airplanes[x].x = 100;
                    }*/
                    _this.airplanes[x].update();
                }
            }, 100);
        }
        getElementOffset(el) {
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
        findAirplane(name) {
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
        oncontextmenu(evt) {
            evt.preventDefault();
            /*
                     if(this.selection){
                         var pt=this.getElementOffset(evt.currentTarget);
                        (<Airplane>this.selection).flyTo(evt.x-pt.left-8,evt.y-pt.top-10);
                        console.log(evt.offsetX);
                    }*/
        }
        onclick(th) {
            var _a;
            console.log("close");
            (_a = this.selection) === null || _a === void 0 ? void 0 : _a.unselect();
            if (th.target === this.dom) {
                try {
                    citydialog_1.CityDialog.getInstance().close();
                }
                catch (_b) {
                }
                try {
                    airplanedialog_1.AirplaneDialog.getInstance().close();
                }
                catch (_c) {
                }
                try {
                    routedialog_1.RouteDialog.getInstance().close();
                }
                catch (_d) {
                }
                try {
                    squadrondialog_1.SquadronDialog.getInstance().close();
                }
                catch (_e) {
                }
                try {
                    diagramdialog_1.DiagramDialog.getInstance().close();
                }
                catch (_f) {
                }
            }
        }
        update() {
            var _a;
            if (this.lastUpdate === undefined) {
                this.lastUpdate = this.game.date.getTime();
            }
            for (var x = 0; x < ((_a = this.cities) === null || _a === void 0 ? void 0 : _a.length); x++) {
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
                    ges += Math.round(this.airplanes[x].getDailyCosts() * parameter.rateCostsAirplaine);
                }
                this.game.changeMoney(-ges, "daily costs airplane");
                this.game.statistic.yesterday = this.game.statistic.today;
                this.game.statistic.today = {};
            }
            this.lastUpdate = this.game.date.getTime();
        }
        addCity(hasAirport = true) {
            var city = (0, city_1.createCities)(this, 1)[0];
            city.hasAirport = hasAirport;
            city.render(this.cities.indexOf(city));
            city.update();
        }
        newGame() {
            (0, city_1.createCities)(this, 16);
            this.cities[this.cities.length - 1].hasAirport = false;
            for (var x = 0; x < 1; x++) {
                var ap = new airplane_1.Airplane(this);
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
            /* Lastenausgleich
               this.cities=[this.cities[0]];
               this.cities[0].companies=[];
               for(var x=0;x<19;x++){
                   var comp=new Company();
                   comp.city=this.cities[0];
                   comp.productid=x;
                   comp.workers=20*10;
                   comp.buildings=10;
                   this.cities[0].companies.push(comp);
                   this.cities[0].warehouse[x]=10000;
               }
               this.cities[0].people=10*19*20;
               this.cities[0].houses=10*19*20/100+1;*/
        }
        render(dom) {
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
            dom.addEventListener("click", (ev) => {
                _this.onclick(ev);
                return undefined;
            });
            dom.addEventListener("contextmenu", (ev) => {
                _this.oncontextmenu(ev);
                return undefined;
            });
        }
        findCityAt(x, y) {
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
    exports.World = World;
});
//# sourceMappingURL=world.js.map