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
            this.advertising = [];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                this.advertising.push(undefined);
            }
            this.advertising;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3dvcmxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFXQSxTQUFTLFlBQVksQ0FBQyxHQUFHO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELE1BQWEsS0FBSztRQVVkO1lBRkEsU0FBSSxHQUFHLE9BQU8sQ0FBQztZQUNmLGVBQVUsR0FBRyxTQUFTLENBQUM7WUFFbkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUMsRUFBRSxDQUFDO1lBQ3BCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztnQkFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDcEM7WUFDRCxJQUFJLENBQUMsV0FBVyxDQUFBO1lBQ2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTs7Z0JBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxNQUFBLEtBQUssQ0FBQyxTQUFTLDBDQUFFLE1BQU0sQ0FBQSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM5Qzs7Ozt1QkFJRztvQkFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUMvQjtZQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUdaLENBQUM7UUFDTyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3ZCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUVqQiw0QkFBNEI7WUFDNUIsa0RBQWtEO1lBQ2xELEdBQUc7Z0JBQ0MsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7Z0JBQ2hDLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO2FBQ2xDLFFBQVEsT0FBTyxFQUFFO1lBRWxCLE9BQU87Z0JBQ0gsR0FBRztnQkFDSCxJQUFJO2FBQ1AsQ0FBQztRQUNOLENBQUM7UUFDRCxZQUFZLENBQUMsSUFBWTtZQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzVDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO29CQUNqQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVCO2dCQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3hELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTt3QkFDN0MsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDeEM7aUJBQ0o7YUFDSjtRQUNMLENBQUM7UUFDRCxhQUFhLENBQUMsR0FBZTtZQUN6QixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDckI7Ozs7O3VCQUtXO1FBRWYsQ0FBQztRQUNELE9BQU8sQ0FBQyxFQUFjOztZQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JCLE1BQUEsSUFBSSxDQUFDLFNBQVMsMENBQUUsUUFBUSxFQUFFLENBQUM7WUFDM0IsSUFBSSxFQUFFLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ3hCLElBQUk7b0JBQ0EsdUJBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDcEM7Z0JBQUMsV0FBTTtpQkFFUDtnQkFDRCxJQUFJO29CQUNBLCtCQUFjLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBRXhDO2dCQUFDLFdBQU07aUJBRVA7Z0JBQ0QsSUFBSTtvQkFDQSx5QkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNyQztnQkFBQyxXQUFNO2lCQUVQO2dCQUNELElBQUk7b0JBQ0EsK0JBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDeEM7Z0JBQUMsV0FBTTtpQkFFUDtnQkFDQSxJQUFJO29CQUNELDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ3ZDO2dCQUFDLFdBQU07aUJBRVA7YUFDSjtRQUNMLENBQUM7UUFDRCxNQUFNOztZQUNGLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDOUM7WUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUcsTUFBQSxJQUFJLENBQUMsTUFBTSwwQ0FBRSxNQUFNLENBQUEsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUM7Ozs7bUJBSUc7Z0JBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUMzQjtZQUNELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNsRSxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7b0JBQzNDLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBQzt3QkFDdkYsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFDLFNBQVMsQ0FBQztxQkFDNUM7aUJBQ0o7Z0JBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDNUMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsR0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDckY7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFDLEVBQUUsQ0FBQzthQUNoQztZQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0MsQ0FBQztRQUNELE9BQU8sQ0FBQyxVQUFVLEdBQUMsSUFBSTtZQUNuQixJQUFJLElBQUksR0FBUyxJQUFBLG1CQUFZLEVBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxVQUFVLEdBQUMsVUFBVSxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbEIsQ0FBQztRQUVELE9BQU87WUFDSCxJQUFBLG1CQUFZLEVBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFDLEtBQUssQ0FBQztZQUNuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4QixJQUFJLEVBQUUsR0FBRyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVCLEVBQUUsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUMvQyxFQUFFLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQy9DLEVBQUUsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFDckQsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUNqRCxFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDM0I7WUFFSjs7Ozs7Ozs7Ozs7Ozs7O3VEQWUyQztRQUM1QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQWdCO1lBQ25CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUVmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDM0I7WUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzVDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDWixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDaEM7WUFDRCxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBYyxFQUFFLEVBQUU7Z0JBQzdDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2xCLE9BQU8sU0FBUyxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQWMsRUFBRSxFQUFFO2dCQUNuRCxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN4QixPQUFPLFNBQVMsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztRQUVQLENBQUM7UUFDRCxVQUFVLENBQUMsQ0FBUyxFQUFFLENBQVM7WUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN6QyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ2xELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDekI7YUFDSjtZQUNELE9BQU8sU0FBUyxDQUFDO1FBQ3JCLENBQUM7UUFDRCxPQUFPO1lBQ0gsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuQyxDQUFDO0tBQ0o7SUFoTkQsc0JBZ05DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgeyBDaXR5LCBjcmVhdGVDaXRpZXMgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHdpbmRvd3MgZnJvbSBcImphc3NpanMvYmFzZS9XaW5kb3dzXCI7XHJcbmltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiZ2FtZS9nYW1lXCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lRGlhbG9nIH0gZnJvbSBcImdhbWUvYWlycGxhbmVkaWFsb2dcIjtcclxuaW1wb3J0IHsgUm91dGVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9yb3V0ZWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBTcXVhZHJvbkRpYWxvZyB9IGZyb20gXCJnYW1lL3NxdWFkcm9uZGlhbG9nXCI7XHJcbmltcG9ydCB7IENvbXBhbnkgfSBmcm9tIFwiZ2FtZS9jb21wYW55XCI7XHJcbmltcG9ydCB7IERpYWdyYW1EaWFsb2cgfSBmcm9tIFwiZ2FtZS9kaWFncmFtZGlhbG9nXCI7XHJcbmZ1bmN0aW9uIGdldFJhbmRvbUludChtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBXb3JsZCB7XHJcbiAgICBfaW50ZXJ2YWxsO1xyXG4gICAgY2l0aWVzOiBDaXR5W107XHJcbiAgICBhaXJwbGFuZXM6IEFpcnBsYW5lW107XHJcbiAgICBhZHZlcnRpc2luZzpudW1iZXJbXTtcclxuICAgIHNlbGVjdGlvbjtcclxuICAgIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBnYW1lOiBHYW1lO1xyXG4gICAgdHlwZSA9IFwiV29ybGRcIjtcclxuICAgIGxhc3RVcGRhdGUgPSB1bmRlZmluZWQ7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzID0gW107XHJcbiAgICAgICAgdGhpcy5haXJwbGFuZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmFkdmVydGlzaW5nPVtdO1xyXG4gICAgICAgIGZvcih2YXIgeD0wO3g8cGFyYW1ldGVyLmFsbFByb2R1Y3RzLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICB0aGlzLmFkdmVydGlzaW5nLnB1c2godW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZHZlcnRpc2luZ1xyXG4gICAgICAgIHRoaXMuX2ludGVydmFsbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBfdGhpcy5haXJwbGFuZXM/Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAvKmlmICh0aGlzLmFpcnBsYW5lc1t4XS54IDwgNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSB0aGlzLmFpcnBsYW5lc1t4XS54ICsgMTtcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSAxMDA7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lc1t4XS51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcblxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0RWxlbWVudE9mZnNldChlbCkge1xyXG4gICAgICAgIGxldCB0b3AgPSAwO1xyXG4gICAgICAgIGxldCBsZWZ0ID0gMDtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGVsO1xyXG5cclxuICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIERPTSB0cmVlXHJcbiAgICAgICAgLy8gYW5kIGFkZCBpdCdzIHBhcmVudCdzIG9mZnNldCB0byBnZXQgcGFnZSBvZmZzZXRcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHRvcCArPSBlbGVtZW50Lm9mZnNldFRvcCB8fCAwO1xyXG4gICAgICAgICAgICBsZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdCB8fCAwO1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XHJcbiAgICAgICAgfSB3aGlsZSAoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRvcCxcclxuICAgICAgICAgICAgbGVmdCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZmluZEFpcnBsYW5lKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYWlycGxhbmVzW3hdLm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFpcnBsYW5lc1t4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYWlycGxhbmVzW3hdLnNxdWFkcm9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5haXJwbGFuZXNbeF0uc3F1YWRyb25baV0ubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFpcnBsYW5lc1t4XS5zcXVhZHJvbltpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uY29udGV4dG1lbnUoZXZ0OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICBpZih0aGlzLnNlbGVjdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgIHZhciBwdD10aGlzLmdldEVsZW1lbnRPZmZzZXQoZXZ0LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICg8QWlycGxhbmU+dGhpcy5zZWxlY3Rpb24pLmZseVRvKGV2dC54LXB0LmxlZnQtOCxldnQueS1wdC50b3AtMTApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2dC5vZmZzZXRYKTtcclxuICAgICAgICAgICAgICAgIH0qL1xyXG5cclxuICAgIH1cclxuICAgIG9uY2xpY2sodGg6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsb3NlXCIpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uPy51bnNlbGVjdCgpO1xyXG4gICAgICAgIGlmICh0aC50YXJnZXQgPT09IHRoaXMuZG9tKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIFJvdXRlRGlhbG9nLmdldEluc3RhbmNlKCkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBTcXVhZHJvbkRpYWxvZy5nZXRJbnN0YW5jZSgpLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIERpYWdyYW1EaWFsb2cuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IHRoaXMuZ2FtZS5kYXRlLmdldFRpbWUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXRpZXM/Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIC8qaWYgKHRoaXMuYWlycGxhbmVzW3hdLnggPCA1MDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gdGhpcy5haXJwbGFuZXNbeF0ueCArIDE7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IDEwMDtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzW3hdLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5nYW1lLmRhdGUuZ2V0RGF0ZSgpICE9PSBuZXcgRGF0ZSh0aGlzLmxhc3RVcGRhdGUpLmdldERhdGUoKSkge1xyXG4gICAgICAgICAgICBmb3IodmFyIHk9MDt5PHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7eSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2FtZS53b3JsZC5hZHZlcnRpc2luZ1t5XSYmdGhpcy5nYW1lLmRhdGUuZ2V0VGltZSgpPnRoaXMuZ2FtZS53b3JsZC5hZHZlcnRpc2luZ1t5XSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLmFkdmVydGlzaW5nW3ldPXVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZ2VzID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgZ2VzICs9IE1hdGgucm91bmQodGhpcy5haXJwbGFuZXNbeF0uZ2V0RGFpbHlDb3N0cygpKnBhcmFtZXRlci5yYXRlQ29zdHNBaXJwbGFpbmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jaGFuZ2VNb25leSgtZ2VzLCBcImRhaWx5IGNvc3RzIGFpcnBsYW5lXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGlzdGljLnllc3RlcmRheT10aGlzLmdhbWUuc3RhdGlzdGljLnRvZGF5O1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGlzdGljLnRvZGF5PXt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSB0aGlzLmdhbWUuZGF0ZS5nZXRUaW1lKCk7XHJcbiAgICB9XHJcbiAgICBhZGRDaXR5KGhhc0FpcnBvcnQ9dHJ1ZSkge1xyXG4gICAgICAgIHZhciBjaXR5OiBDaXR5ID0gY3JlYXRlQ2l0aWVzKHRoaXMsIDEpWzBdO1xyXG4gICAgICAgIGNpdHkuaGFzQWlycG9ydD1oYXNBaXJwb3J0O1xyXG4gICAgICAgIGNpdHkucmVuZGVyKHRoaXMuY2l0aWVzLmluZGV4T2YoY2l0eSkpO1xyXG4gICAgICAgIGNpdHkudXBkYXRlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5ld0dhbWUoKSB7XHJcbiAgICAgICAgY3JlYXRlQ2l0aWVzKHRoaXMsIDE2KTtcclxuICAgICAgICB0aGlzLmNpdGllc1t0aGlzLmNpdGllcy5sZW5ndGgtMV0uaGFzQWlycG9ydD1mYWxzZTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IDE7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgYXAgPSBuZXcgQWlycGxhbmUodGhpcyk7XHJcbiAgICAgICAgICAgIGFwLm5hbWUgPSBwYXJhbWV0ZXIuYWxsQWlycGxhbmVUeXBlc1swXS5tb2RlbCArICh4ICsgMSk7XHJcbiAgICAgICAgICAgIGFwLnNwZWVkID0gcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbMF0uc3BlZWQ7XHJcbiAgICAgICAgICAgIGFwLmNvc3RzID0gcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbMF0uY29zdHM7XHJcbiAgICAgICAgICAgIGFwLmNhcGFjaXR5ID0gcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbMF0uY2FwYWNpdHk7XHJcbiAgICAgICAgICAgIGFwLnggPSB0aGlzLmNpdGllc1swXS54O1xyXG4gICAgICAgICAgICBhcC55ID0gdGhpcy5jaXRpZXNbMF0ueTtcclxuICAgICAgICAgICAgYXAudHlwZWlkID0gcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbMF0udHlwZWlkO1xyXG4gICAgICAgICAgICBhcC53b3JsZCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzLnB1c2goYXApO1xyXG4gICAgICAgIH1cclxuICAgICBcclxuICAgICAvKlxyXG4gICAgICAvL0xhc3RlbmF1c2dsZWljaCAgIFxyXG4gICAgICAgIHZhciBhbno9MTAwO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzPVt0aGlzLmNpdGllc1swXV07XHJcbiAgICAgICAgdGhpcy5jaXRpZXNbMF0uY29tcGFuaWVzPVtdO1xyXG4gICAgICAgIGZvcih2YXIgeD0wO3g8MTk7eCsrKXtcclxuICAgICAgICAgICAgdmFyIGNvbXA9bmV3IENvbXBhbnkoKTtcclxuICAgICAgICAgICAgY29tcC5jaXR5PXRoaXMuY2l0aWVzWzBdO1xyXG4gICAgICAgICAgICBjb21wLnByb2R1Y3RpZD14O1xyXG4gICAgICAgICAgICBjb21wLndvcmtlcnM9MjAqYW56O1xyXG4gICAgICAgICAgICBjb21wLmJ1aWxkaW5ncz1hbno7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzWzBdLmNvbXBhbmllcy5wdXNoKGNvbXApO1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1swXS5zaG9wW3hdPTEwMDAwMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2l0aWVzWzBdLnBlb3BsZT1hbnoqMTkqMjA7XHJcbiAgICAgICAgdGhpcy5jaXRpZXNbMF0uaG91c2VzPWFueioxOSoyMC8xMDArMTsqL1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKGRvbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZG9tID0gZG9tO1xyXG5cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY2l0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzW3hdLnJlbmRlcih4KTtcclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbeF0udXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIGFwID0gdGhpcy5haXJwbGFuZXNbeF07XHJcbiAgICAgICAgICAgIGFwLnJlbmRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChhcC5kb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldjogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBfdGhpcy5vbmNsaWNrKGV2KTtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldjogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBfdGhpcy5vbmNvbnRleHRtZW51KGV2KTtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBmaW5kQ2l0eUF0KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNpdGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaXRpZXNbaV0ueCA9PT0geCAmJiB0aGlzLmNpdGllc1tpXS55ID09PSB5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaXRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbGwpO1xyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=