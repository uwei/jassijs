define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog", "game/icons", "game/company", "game/airplane", "game/city", "game/route", "game/product"], function (require, exports, citydialog_1, world_1, airplanedialog_1, icons_1, company_1, airplane_1, city_1, route_1, product_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Game = void 0;
    class Game {
        constructor() {
            this.speed = 1;
            this.mapWidth = 1000;
            this.mapHeight = 600;
            var _this = this;
            Game.instance = this;
            this.lastUpdate = Date.now();
            this.date = new Date("Sat Jan 01 2000 00:00:00");
            citydialog_1.CityDialog.instance = undefined;
            this.nevercallthisfunction();
        }
        updateTitle() {
            try {
                document.getElementById("gamemoney").innerHTML = new Number(this.getMoney()).toLocaleString();
                document.getElementById("gamedate").innerHTML = this.date.toLocaleDateString() + " " + this.date.toLocaleTimeString().substring(0, this.date.toLocaleTimeString().length - 3);
                this.world.update();
            }
            catch (_a) {
                console.log("stop game");
                return;
            }
        }
        updateSize() {
            this.domWorld.style.width = (this.mapWidth + 80) + "px";
            this.domWorld.style.height = (this.mapHeight + 100) + "px";
            this.domWorld.parentNode.style.width = (this.mapWidth + 80) + "px";
            this.domWorld.parentNode.style.height = (this.mapHeight + 100) + "px";
        }
        //never call this outside the timer - then would be 2 updates
        nevercallthisfunction() {
            //var t=new Date().getTime();
            var intervall = 1000 / this.speed;
            var _this = this;
            var diff = 1000 * 60 * 60; //update always at full clock//((Date.now() - this.lastUpdate)) * 60 * 60 * this.speed;
            this.date = new Date(this.date.getTime() + diff);
            this.updateTitle();
            this.lastUpdate = Date.now();
            this.timer = setTimeout(() => {
                _this.nevercallthisfunction();
            }, intervall);
            //console.log("tooks"+(new Date().getTime()-t));
            citydialog_1.CityDialog.getInstance().update();
            airplanedialog_1.AirplaneDialog.getInstance().update();
        }
        newGame() {
            this.world = new world_1.World();
            this.world.game = this;
            this._money = 20000;
            this.world.newGame();
        }
        getMoney() {
            return this._money;
        }
        changeMoney(change, why, city = undefined) {
            this._money += change;
            //  console.log(change+" "+why);
        }
        render(dom) {
            var _this = this;
            dom.innerHTML = "";
            dom.style.backgroundColor = "lightblue";
            this.dom = dom;
            var sdomHeader = `
          <div style="height:15px;position:fixed;z-index:10000;background-color:lightblue;">
            Traffics 
            <button id="game-slower">` + icons_1.Icons.minus + `</button> 
            <span id="gamedate"></span>   
            <button id="game-faster">` + icons_1.Icons.plus + `</button> 
            Money:<span id="gamemoney"></span>` + icons_1.Icons.money + `
            <button id="save-game">` + icons_1.Icons.save + `</button> 
            <button id="load-game">` + icons_1.Icons.load + `</button> 
            <button id="debug-game">` + icons_1.Icons.debug + `</button> 
          </div>  
        `;
            this.domHeader = document.createRange().createContextualFragment(sdomHeader).children[0];
            var sdomWorld = `
          <div id="world" style="position:absolute;top:20px;">
          </div>  
        `;
            this.domWorld = document.createRange().createContextualFragment(sdomWorld).children[0];
            this.dom.appendChild(this.domHeader);
            // var headerPlaceeholder = <any>document.createRange().createContextualFragment('<div style="height:15px"></div>').children[0]
            // this.dom.appendChild(headerPlaceeholder);
            this.dom.appendChild(this.domWorld);
            this.world.render(this.domWorld);
            this.updateSize();
            setTimeout(() => {
                _this.bindActions();
            }, 500);
        }
        bindActions() {
            var _this = this;
            document.getElementById("gamedate").addEventListener("mousedown", () => {
                console.log("down");
            });
            document.getElementById("save-game").addEventListener("click", () => {
                _this.save();
            });
            document.getElementById("load-game").addEventListener("click", () => {
                _this.load();
            });
            document.getElementById("debug-game").addEventListener("click", () => {
                _this.world.addCity();
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    _this.world.cities[0].warehouse[x] = 5000;
                }
                _this._money = 100000;
            });
            document.getElementById("game-slower").addEventListener("click", () => {
                if (_this.speed === Game.temposcale[0]) {
                    _this.pause();
                    console.log("pause");
                    return;
                }
                var pos = Game.temposcale.indexOf(_this.speed);
                pos--;
                if (pos == -1)
                    return;
                _this.speed = Game.temposcale[pos];
                _this.pause();
                _this.resume();
            });
            document.getElementById("game-faster").addEventListener("click", () => {
                if (_this.isPaused()) {
                    _this.resume();
                    return;
                }
                var pos = Game.temposcale.indexOf(_this.speed);
                pos++;
                if (pos >= Game.temposcale.length) {
                    console.log("max");
                    return;
                }
                _this.speed = Game.temposcale[pos];
                _this.pause();
                _this.resume();
            });
        }
        save() {
            this.pause();
            var sdata = JSON.stringify(this, (key, value) => {
                var _a, _b, _c, _d, _e;
                var ret = {};
                if (value instanceof HTMLElement) {
                    return undefined;
                }
                if (key === "lastUpdate")
                    return undefined;
                if (((_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name) === "World") {
                    Object.assign(ret, value);
                    delete ret.game;
                    return ret;
                }
                if (((_b = value === null || value === void 0 ? void 0 : value.constructor) === null || _b === void 0 ? void 0 : _b.name) === "Airplane") {
                    Object.assign(ret, value);
                    delete ret.world;
                    return ret;
                }
                if (((_c = value === null || value === void 0 ? void 0 : value.constructor) === null || _c === void 0 ? void 0 : _c.name) === "City") {
                    Object.assign(ret, value);
                    delete ret.world;
                    return ret;
                }
                if (((_d = value === null || value === void 0 ? void 0 : value.constructor) === null || _d === void 0 ? void 0 : _d.name) === "Company") {
                    Object.assign(ret, value);
                    delete ret.city;
                    return ret;
                }
                if (((_e = value === null || value === void 0 ? void 0 : value.constructor) === null || _e === void 0 ? void 0 : _e.name) === "Route") {
                    Object.assign(ret, value);
                    delete ret.airplane;
                    return ret;
                }
                return value;
            }, "\t");
            window.localStorage.setItem("savegame", sdata);
            //this.load();
            console.log(sdata);
            this.resume();
        }
        load() {
            this.pause();
            var data = window.localStorage.getItem("savegame");
            var ret = JSON.parse(data, (key, value) => {
                var r = value;
                if (value === null)
                    return undefined;
                if ((value === null || value === void 0 ? void 0 : value.type) === "Company") {
                    r = new company_1.Company();
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "Airplane") {
                    r = new airplane_1.Airplane(undefined);
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "World") {
                    r = new world_1.World();
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "City") {
                    r = new city_1.City();
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "Route") {
                    r = new route_1.Route();
                    Object.assign(r, value);
                    return r;
                }
                return r;
            });
            Object.assign(this, ret);
            this.world.game = this;
            this.date = new Date(this.date);
            for (var x = 0; x < this.world.airplanes.length; x++) {
                this.world.airplanes[x].world = this.world;
                for (var y = 0; y < this.world.airplanes[x].route.length; y++) {
                    this.world.airplanes[x].route[y].airplane = this.world.airplanes[x];
                }
            }
            for (var x = 0; x < this.world.cities.length; x++) {
                this.world.cities[x].world = this.world;
                for (var y = 0; y < this.world.cities[x].companies.length; y++) {
                    this.world.cities[x].companies[y].city = this.world.cities[x];
                }
                //for(var y=0;y<this.world.cities[x].companies.length;y++){
                //  this.world.cities[x].companies[y].
                //}
            }
            this.render(this.dom);
            this.resume();
        }
        resume() {
            if (this.timer === 0)
                this.nevercallthisfunction();
        }
        isPaused() {
            return this.timer === 0;
        }
        pause() {
            clearTimeout(this.timer);
            this.timer = 0;
        }
        destroy() {
            this.world.destroy();
            clearTimeout(this.timer);
        }
    }
    exports.Game = Game;
    Game.temposcale = [0.01, 0.5, 1, 2, 4, 8, 16, 32, 64, 128];
    function test() {
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBYUEsTUFBYSxJQUFJO1FBZWY7WUFOQSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEIsY0FBUyxHQUFHLEdBQUcsQ0FBQztZQUdkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUVyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDakQsdUJBQVUsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQy9CLENBQUM7UUFDTSxXQUFXO1lBQ2hCLElBQUk7Z0JBQ0YsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQzlGLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDOUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNyQjtZQUFDLFdBQU07Z0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDekIsT0FBTzthQUNSO1FBQ0gsQ0FBQztRQUNELFVBQVU7WUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQztZQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFDLEdBQUcsQ0FBQyxHQUFDLElBQUksQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUM7WUFDOUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUMsR0FBRyxDQUFDLEdBQUMsSUFBSSxDQUFDO1FBRWxGLENBQUM7UUFDRCw2REFBNkQ7UUFDckQscUJBQXFCO1lBQzNCLDZCQUE2QjtZQUM3QixJQUFJLFNBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNsQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQSx1RkFBdUY7WUFDakgsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQzNCLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBRWhDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNkLGdEQUFnRDtZQUNoRCx1QkFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xDLCtCQUFjLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFeEMsQ0FBQztRQUNELE9BQU87WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELFFBQVE7WUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQztRQUNELFdBQVcsQ0FBQyxNQUFhLEVBQUMsR0FBVSxFQUFDLE9BQVUsU0FBUztZQUN0RCxJQUFJLENBQUMsTUFBTSxJQUFFLE1BQU0sQ0FBQztZQUN0QixnQ0FBZ0M7UUFDaEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFnQjtZQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsR0FBRyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDbkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUMsV0FBVyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ2YsSUFBSSxVQUFVLEdBQUc7OztzQ0FHaUIsR0FBRSxhQUFLLENBQUMsS0FBSyxHQUFHOztzQ0FFaEIsR0FBRSxhQUFLLENBQUMsSUFBSSxHQUFHOytDQUNOLEdBQUUsYUFBSyxDQUFDLEtBQUssR0FBRztvQ0FDM0IsR0FBRSxhQUFLLENBQUMsSUFBSSxHQUFHO29DQUNmLEdBQUUsYUFBSyxDQUFDLElBQUksR0FBRztxQ0FDZCxHQUFFLGFBQUssQ0FBQyxLQUFLLEdBQUc7O1NBRTVDLENBQUM7WUFDTixJQUFJLENBQUMsU0FBUyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUYsSUFBSSxTQUFTLEdBQUc7OztTQUdYLENBQUM7WUFFTixJQUFJLENBQUMsUUFBUSxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLCtIQUErSDtZQUMvSCw0Q0FBNEM7WUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFFbEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUNELFdBQVc7WUFDVCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO2dCQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO2dCQUNsRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztZQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDbEUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7WUFDSCxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ25FLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3RCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxxQkFBVyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztvQkFDbkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQztpQkFDekM7Z0JBQ0QsS0FBSyxDQUFDLE1BQU0sR0FBQyxNQUFNLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7WUFDSCxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ3BFLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckIsT0FBTztpQkFDUjtnQkFDRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQy9DLEdBQUcsRUFBRSxDQUFDO2dCQUNOLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDWCxPQUFPO2dCQUNULEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNkLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztZQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDcEUsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBQ3BCLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDZixPQUFPO2lCQUNSO2dCQUNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0MsR0FBRyxFQUFFLENBQUM7Z0JBQ04sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7b0JBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ25CLE9BQU87aUJBQ1I7Z0JBQ0QsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2QsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUk7WUFDRixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQVcsRUFBRSxLQUFVLEVBQUUsRUFBRTs7Z0JBQzNELElBQUksR0FBRyxHQUFRLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxLQUFLLFlBQVksV0FBVyxFQUFFO29CQUNoQyxPQUFPLFNBQVMsQ0FBQztpQkFDbEI7Z0JBQ0QsSUFBSSxHQUFHLEtBQUssWUFBWTtvQkFDdEIsT0FBTyxTQUFTLENBQUM7Z0JBQ25CLElBQUksQ0FBQSxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLDBDQUFFLElBQUksTUFBSyxPQUFPLEVBQUU7b0JBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMxQixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLE9BQU8sR0FBRyxDQUFDO2lCQUNaO2dCQUNELElBQUksQ0FBQSxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLDBDQUFFLElBQUksTUFBSyxVQUFVLEVBQUU7b0JBRTNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMxQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUM7b0JBQ2pCLE9BQU8sR0FBRyxDQUFDO2lCQUNaO2dCQUNELElBQUksQ0FBQSxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLDBDQUFFLElBQUksTUFBSyxNQUFNLEVBQUU7b0JBRXZDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMxQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUM7b0JBQ2pCLE9BQU8sR0FBRyxDQUFDO2lCQUNaO2dCQUNELElBQUksQ0FBQSxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLDBDQUFFLElBQUksTUFBSyxTQUFTLEVBQUU7b0JBQzFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMxQixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLE9BQU8sR0FBRyxDQUFDO2lCQUNaO2dCQUNELElBQUksQ0FBQSxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLDBDQUFFLElBQUksTUFBSyxPQUFPLEVBQUU7b0JBRXhDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUMxQixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUM7b0JBQ3BCLE9BQU8sR0FBRyxDQUFDO2lCQUNaO2dCQUNELE9BQU8sS0FBSyxDQUFDO1lBQ2YsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1QsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9DLGNBQWM7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVoQixDQUFDO1FBQ0QsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25ELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsR0FBUSxLQUFLLENBQUM7Z0JBQ25CLElBQUksS0FBSyxLQUFLLElBQUk7b0JBQ2hCLE9BQU8sU0FBUyxDQUFDO2dCQUNuQixJQUFJLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUksTUFBSyxTQUFTLEVBQUU7b0JBQzdCLENBQUMsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztvQkFDbEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3hCLE9BQU8sQ0FBQyxDQUFDO2lCQUNWO2dCQUNELElBQUksQ0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsSUFBSSxNQUFLLFVBQVUsRUFBRTtvQkFDOUIsQ0FBQyxHQUFHLElBQUksbUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3hCLE9BQU8sQ0FBQyxDQUFDO2lCQUNWO2dCQUNELElBQUksQ0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsSUFBSSxNQUFLLE9BQU8sRUFBRTtvQkFDM0IsQ0FBQyxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7b0JBQ2hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN4QixPQUFPLENBQUMsQ0FBQztpQkFDVjtnQkFDRCxJQUFJLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUksTUFBSyxNQUFNLEVBQUU7b0JBQzFCLENBQUMsR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO29CQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN4QixPQUFPLENBQUMsQ0FBQztpQkFDVjtnQkFDRCxJQUFJLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUksTUFBSyxPQUFPLEVBQUU7b0JBQzNCLENBQUMsR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO29CQUNoQixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLENBQUM7aUJBQ1Y7Z0JBQ0QsT0FBTyxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzdELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3JFO2FBQ0Y7WUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQy9ELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQy9EO2dCQUNELDJEQUEyRDtnQkFDM0Qsc0NBQXNDO2dCQUN0QyxHQUFHO2FBQ0o7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEIsQ0FBQztRQUNELE1BQU07WUFDSixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQztnQkFDbEIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDakMsQ0FBQztRQUNELFFBQVE7WUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDRCxLQUFLO1lBQ0gsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNqQixDQUFDO1FBRUQsT0FBTztZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDOztJQS9RSCxvQkFnUkM7SUFsUVEsZUFBVSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFvUTlELFNBQWdCLElBQUk7SUFFcEIsQ0FBQztJQUZELG9CQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiZ2FtZS93b3JsZFwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZURpYWxvZyB9IGZyb20gXCJnYW1lL2FpcnBsYW5lZGlhbG9nXCI7XHJcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcclxuaW1wb3J0IHsgQ29tcGFueSB9IGZyb20gXCJnYW1lL2NvbXBhbnlcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgeyBDaXR5IH0gZnJvbSBcImdhbWUvY2l0eVwiO1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XHJcbmltcG9ydCB7IGFsbFByb2R1Y3RzIH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuICBzdGF0aWMgaW5zdGFuY2U6IEdhbWU7XHJcbiAgZG9tOiBIVE1MRWxlbWVudDtcclxuICB3b3JsZDogV29ybGQ7XHJcbiAgZG9tSGVhZGVyOiBIVE1MRGl2RWxlbWVudDtcclxuICBkb21Xb3JsZDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgX21vbmV5O1xyXG4gIGRhdGU6IERhdGU7XHJcbiAgbGFzdFVwZGF0ZTogbnVtYmVyO1xyXG4gIHNwZWVkOiBudW1iZXIgPSAxO1xyXG4gIHBhdXNlZFNwZWVkOiBudW1iZXI7XHJcbiAgdGltZXI7XHJcbiAgbWFwV2lkdGggPSAxMDAwO1xyXG4gIG1hcEhlaWdodCA9IDYwMDtcclxuICBzdGF0aWMgdGVtcG9zY2FsZSA9IFswLjAxLCAwLjUsIDEsIDIsIDQsIDgsIDE2LCAzMiwgNjQsIDEyOF1cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBHYW1lLmluc3RhbmNlID0gdGhpcztcclxuICAgIFxyXG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKFwiU2F0IEphbiAwMSAyMDAwIDAwOjAwOjAwXCIpO1xyXG4gICAgQ2l0eURpYWxvZy5pbnN0YW5jZSA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMubmV2ZXJjYWxsdGhpc2Z1bmN0aW9uKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyB1cGRhdGVUaXRsZSgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZW1vbmV5XCIpLmlubmVySFRNTCA9IG5ldyBOdW1iZXIodGhpcy5nZXRNb25leSgpKS50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVkYXRlXCIpLmlubmVySFRNTCA9IHRoaXMuZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSArIFwiIFwiICsgdGhpcy5kYXRlLnRvTG9jYWxlVGltZVN0cmluZygpLnN1YnN0cmluZygwLCB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCkubGVuZ3RoIC0gMyk7XHJcbiAgICAgIHRoaXMud29ybGQudXBkYXRlKCk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgY29uc29sZS5sb2coXCJzdG9wIGdhbWVcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcbiAgdXBkYXRlU2l6ZSgpe1xyXG4gICAgdGhpcy5kb21Xb3JsZC5zdHlsZS53aWR0aD0odGhpcy5tYXBXaWR0aCs4MCkrXCJweFwiOyBcclxuICAgIHRoaXMuZG9tV29ybGQuc3R5bGUuaGVpZ2h0PSh0aGlzLm1hcEhlaWdodCsxMDApK1wicHhcIjsgXHJcbiAgICAoPEhUTUxFbGVtZW50PiB0aGlzLmRvbVdvcmxkLnBhcmVudE5vZGUpLnN0eWxlLndpZHRoPSh0aGlzLm1hcFdpZHRoKzgwKStcInB4XCI7IFxyXG4gICAgKDxIVE1MRWxlbWVudD4gdGhpcy5kb21Xb3JsZC5wYXJlbnROb2RlKS5zdHlsZS5oZWlnaHQ9KHRoaXMubWFwSGVpZ2h0KzEwMCkrXCJweFwiOyBcclxuICAgIFxyXG4gIH1cclxuICAvL25ldmVyIGNhbGwgdGhpcyBvdXRzaWRlIHRoZSB0aW1lciAtIHRoZW4gd291bGQgYmUgMiB1cGRhdGVzXHJcbiAgcHJpdmF0ZSBuZXZlcmNhbGx0aGlzZnVuY3Rpb24oKSB7XHJcbiAgICAvL3ZhciB0PW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgdmFyIGludGVydmFsbCA9IDEwMDAgLyB0aGlzLnNwZWVkO1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIHZhciBkaWZmID0gMTAwMCAqIDYwICogNjA7Ly91cGRhdGUgYWx3YXlzIGF0IGZ1bGwgY2xvY2svLygoRGF0ZS5ub3coKSAtIHRoaXMubGFzdFVwZGF0ZSkpICogNjAgKiA2MCAqIHRoaXMuc3BlZWQ7XHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZSh0aGlzLmRhdGUuZ2V0VGltZSgpICsgZGlmZik7XHJcbiAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBfdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuXHJcbiAgICB9LCBpbnRlcnZhbGwpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcInRvb2tzXCIrKG5ldyBEYXRlKCkuZ2V0VGltZSgpLXQpKTtcclxuICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcclxuICAgIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKCk7XHJcblxyXG4gIH1cclxuICBuZXdHYW1lKCkge1xyXG4gICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG4gICAgdGhpcy53b3JsZC5nYW1lID0gdGhpczsgXHJcbiAgICB0aGlzLl9tb25leSA9IDIwMDAwO1xyXG4gICAgdGhpcy53b3JsZC5uZXdHYW1lKCk7XHJcbiAgfVxyXG4gIGdldE1vbmV5KCl7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9uZXk7XHJcbiAgfVxyXG4gIGNoYW5nZU1vbmV5KGNoYW5nZTpudW1iZXIsd2h5OnN0cmluZyxjaXR5OkNpdHk9dW5kZWZpbmVkKXtcclxuICAgIHRoaXMuX21vbmV5Kz1jaGFuZ2U7XHJcbiAgLy8gIGNvbnNvbGUubG9nKGNoYW5nZStcIiBcIit3aHkpO1xyXG4gIH1cclxuICByZW5kZXIoZG9tOiBIVE1MRWxlbWVudCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIGRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvcj1cImxpZ2h0Ymx1ZVwiO1xyXG4gICAgdGhpcy5kb20gPSBkb207XHJcbiAgICB2YXIgc2RvbUhlYWRlciA9IGBcclxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6MTVweDtwb3NpdGlvbjpmaXhlZDt6LWluZGV4OjEwMDAwO2JhY2tncm91bmQtY29sb3I6bGlnaHRibHVlO1wiPlxyXG4gICAgICAgICAgICBUcmFmZmljcyBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImdhbWUtc2xvd2VyXCI+YCsgSWNvbnMubWludXMgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICA8c3BhbiBpZD1cImdhbWVkYXRlXCI+PC9zcGFuPiAgIFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiZ2FtZS1mYXN0ZXJcIj5gKyBJY29ucy5wbHVzICsgYDwvYnV0dG9uPiBcclxuICAgICAgICAgICAgTW9uZXk6PHNwYW4gaWQ9XCJnYW1lbW9uZXlcIj48L3NwYW4+YCsgSWNvbnMubW9uZXkgKyBgXHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzYXZlLWdhbWVcIj5gKyBJY29ucy5zYXZlICsgYDwvYnV0dG9uPiBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImxvYWQtZ2FtZVwiPmArIEljb25zLmxvYWQgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiZGVidWctZ2FtZVwiPmArIEljb25zLmRlYnVnICsgYDwvYnV0dG9uPiBcclxuICAgICAgICAgIDwvZGl2PiAgXHJcbiAgICAgICAgYDtcclxuICAgIHRoaXMuZG9tSGVhZGVyID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tSGVhZGVyKS5jaGlsZHJlblswXTtcclxuXHJcbiAgICB2YXIgc2RvbVdvcmxkID0gYFxyXG4gICAgICAgICAgPGRpdiBpZD1cIndvcmxkXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MjBweDtcIj5cclxuICAgICAgICAgIDwvZGl2PiAgXHJcbiAgICAgICAgYDtcclxuXHJcbiAgICB0aGlzLmRvbVdvcmxkID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tV29ybGQpLmNoaWxkcmVuWzBdO1xyXG4gICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5kb21IZWFkZXIpO1xyXG4gICAvLyB2YXIgaGVhZGVyUGxhY2VlaG9sZGVyID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCgnPGRpdiBzdHlsZT1cImhlaWdodDoxNXB4XCI+PC9kaXY+JykuY2hpbGRyZW5bMF1cclxuICAgLy8gdGhpcy5kb20uYXBwZW5kQ2hpbGQoaGVhZGVyUGxhY2VlaG9sZGVyKTtcclxuICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZG9tV29ybGQpO1xyXG4gICAgdGhpcy53b3JsZC5yZW5kZXIodGhpcy5kb21Xb3JsZCk7XHJcbiAgICB0aGlzLnVwZGF0ZVNpemUoKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgX3RoaXMuYmluZEFjdGlvbnMoKTtcclxuICAgIH0sIDUwMCk7XHJcbiAgfVxyXG4gIGJpbmRBY3Rpb25zKCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZG93blwiKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWdhbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgX3RoaXMuc2F2ZSgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtZ2FtZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBfdGhpcy5sb2FkKCk7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVidWctZ2FtZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBfdGhpcy53b3JsZC5hZGRDaXR5KCk7XHJcbiAgICAgIGZvcih2YXIgeD0wO3g8YWxsUHJvZHVjdHMubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgX3RoaXMud29ybGQuY2l0aWVzWzBdLndhcmVob3VzZVt4XT01MDAwO1xyXG4gICAgICB9XHJcbiAgICAgIF90aGlzLl9tb25leT0xMDAwMDA7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1zbG93ZXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgaWYgKF90aGlzLnNwZWVkID09PSBHYW1lLnRlbXBvc2NhbGVbMF0pIHtcclxuICAgICAgICBfdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicGF1c2VcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBwb3MgPSBHYW1lLnRlbXBvc2NhbGUuaW5kZXhPZihfdGhpcy5zcGVlZCk7XHJcbiAgICAgIHBvcy0tO1xyXG4gICAgICBpZiAocG9zID09IC0xKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX3RoaXMuc3BlZWQgPSBHYW1lLnRlbXBvc2NhbGVbcG9zXTtcclxuICAgICAgX3RoaXMucGF1c2UoKTtcclxuICAgICAgX3RoaXMucmVzdW1lKCk7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1mYXN0ZXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgaWYgKF90aGlzLmlzUGF1c2VkKCkpIHtcclxuICAgICAgICBfdGhpcy5yZXN1bWUoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHBvcyA9IEdhbWUudGVtcG9zY2FsZS5pbmRleE9mKF90aGlzLnNwZWVkKTtcclxuICAgICAgcG9zKys7XHJcbiAgICAgIGlmIChwb3MgPj0gR2FtZS50ZW1wb3NjYWxlLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibWF4XCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBfdGhpcy5zcGVlZCA9IEdhbWUudGVtcG9zY2FsZVtwb3NdO1xyXG4gICAgICBfdGhpcy5wYXVzZSgpO1xyXG4gICAgICBfdGhpcy5yZXN1bWUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBzYXZlKCkge1xyXG4gICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgdmFyIHNkYXRhID0gSlNPTi5zdHJpbmdpZnkodGhpcywgKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgIHZhciByZXQ6IGFueSA9IHt9O1xyXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGtleSA9PT0gXCJsYXN0VXBkYXRlXCIpXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJXb3JsZFwiKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LmdhbWU7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIkFpcnBsYW5lXCIpIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LndvcmxkO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJDaXR5XCIpIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LndvcmxkO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJDb21wYW55XCIpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQuY2l0eTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiUm91dGVcIikge1xyXG5cclxuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQuYWlycGxhbmU7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9LCBcIlxcdFwiKTtcclxuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNhdmVnYW1lXCIsIHNkYXRhKTtcclxuICAgIC8vdGhpcy5sb2FkKCk7XHJcbiAgICBjb25zb2xlLmxvZyhzZGF0YSk7XHJcbiAgICB0aGlzLnJlc3VtZSgpO1xyXG5cclxuICB9XHJcbiAgbG9hZCgpIHtcclxuICAgIHRoaXMucGF1c2UoKTtcclxuICAgIHZhciBkYXRhID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F2ZWdhbWVcIik7XHJcbiAgICB2YXIgcmV0ID0gSlNPTi5wYXJzZShkYXRhLCAoa2V5LCB2YWx1ZSkgPT4ge1xyXG4gICAgICB2YXIgcjogYW55ID0gdmFsdWU7XHJcbiAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiQ29tcGFueVwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBDb21wYW55KCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkFpcnBsYW5lXCIpIHtcclxuICAgICAgICByID0gbmV3IEFpcnBsYW5lKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIldvcmxkXCIpIHtcclxuICAgICAgICByID0gbmV3IFdvcmxkKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkNpdHlcIikge1xyXG4gICAgICAgIHIgPSBuZXcgQ2l0eSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJSb3V0ZVwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBSb3V0ZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHJldCk7XHJcbiAgICB0aGlzLndvcmxkLmdhbWUgPSB0aGlzO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUodGhpcy5kYXRlKTtcclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53b3JsZC5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgdGhpcy53b3JsZC5haXJwbGFuZXNbeF0ud29ybGQgPSB0aGlzLndvcmxkO1xyXG4gICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMud29ybGQuYWlycGxhbmVzW3hdLnJvdXRlLmxlbmd0aDsgeSsrKSB7XHJcbiAgICAgICAgdGhpcy53b3JsZC5haXJwbGFuZXNbeF0ucm91dGVbeV0uYWlycGxhbmUgPSB0aGlzLndvcmxkLmFpcnBsYW5lc1t4XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndvcmxkLmNpdGllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICB0aGlzLndvcmxkLmNpdGllc1t4XS53b3JsZCA9IHRoaXMud29ybGQ7XHJcbiAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllcy5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgIHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllc1t5XS5jaXR5ID0gdGhpcy53b3JsZC5jaXRpZXNbeF07XHJcbiAgICAgIH1cclxuICAgICAgLy9mb3IodmFyIHk9MDt5PHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllcy5sZW5ndGg7eSsrKXtcclxuICAgICAgLy8gIHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllc1t5XS5cclxuICAgICAgLy99XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbmRlcih0aGlzLmRvbSk7XHJcbiAgICB0aGlzLnJlc3VtZSgpO1xyXG4gIH1cclxuICByZXN1bWUoKSB7XHJcbiAgICBpZiAodGhpcy50aW1lciA9PT0gMClcclxuICAgICAgdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuICB9XHJcbiAgaXNQYXVzZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50aW1lciA9PT0gMDtcclxuICB9XHJcbiAgcGF1c2UoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgICB0aGlzLnRpbWVyID0gMDtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLndvcmxkLmRlc3Ryb3koKTtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG5cclxufVxyXG4iXX0=