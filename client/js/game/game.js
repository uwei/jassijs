define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog", "game/icons", "game/company", "game/airplane", "game/city", "game/route", "game/product", "game/diagramdialog"], function (require, exports, citydialog_1, world_1, airplanedialog_1, icons_1, company_1, airplane_1, city_1, route_1, product_1, diagramdialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Game = void 0;
    window.onbeforeunload = function () {
        return "Do you want to exit?";
    };
    class Statistic {
        constructor() {
            this.today = {};
            this.yesterday = {};
        }
    }
    class Game {
        constructor() {
            this.speed = 1;
            this.mapWidth = 1000;
            this.mapHeight = 600;
            this.statistic = new Statistic();
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
            if (this.statistic.today[why] === undefined)
                this.statistic.today[why] = 0;
            this.statistic.today[why] += change;
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
            <button id="debug-game">` + icons_1.Icons.debug + `</button> 
            <button id="load-game">` + icons_1.Icons.load + `</button> 
            <button id="show-diagram">` + icons_1.Icons.diagram + `</button> 
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
                _this.world.addCity(false);
                //_this.world.cities[_this.world.cities.length-1].hasAirport=false;
                return;
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    _this.world.cities[0].warehouse[x] = 5000;
                }
                _this._money = 100000;
            });
            document.getElementById("show-diagram").addEventListener("click", () => {
                diagramdialog_1.DiagramDialog.getInstance().world = this.world;
                diagramdialog_1.DiagramDialog.getInstance().show();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBYUEsTUFBTSxDQUFDLGNBQWMsR0FBRztRQUN0QixPQUFPLHNCQUFzQixDQUFDO0lBRWhDLENBQUMsQ0FBQztJQUNGLE1BQU0sU0FBUztRQUFmO1lBQ0UsVUFBSyxHQUE0QixFQUFFLENBQUM7WUFDcEMsY0FBUyxHQUE0QixFQUFFLENBQUM7UUFDMUMsQ0FBQztLQUFBO0lBQ0QsTUFBYSxJQUFJO1FBZ0JmO1lBUEEsVUFBSyxHQUFXLENBQUMsQ0FBQztZQUdsQixhQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLGNBQVMsR0FBRyxHQUFHLENBQUM7WUFDaEIsY0FBUyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7WUFHMUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBRXJCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUNqRCx1QkFBVSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7WUFDaEMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDL0IsQ0FBQztRQUNNLFdBQVc7WUFDaEIsSUFBSTtnQkFDRixRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDOUYsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxD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LFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQzs7SUExUkgsb0JBMlJDO0lBNVFRLGVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBOFE5RCxTQUFnQixJQUFJO0lBRXBCLENBQUM7SUFGRCxvQkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImdhbWUvd29ybGRcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgQWlycGxhbmVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBJY29ucyB9IGZyb20gXCJnYW1lL2ljb25zXCI7XHJcbmltcG9ydCB7IENvbXBhbnkgfSBmcm9tIFwiZ2FtZS9jb21wYW55XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgUm91dGUgfSBmcm9tIFwiZ2FtZS9yb3V0ZVwiO1xyXG5pbXBvcnQgeyBhbGxQcm9kdWN0cyB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcclxuaW1wb3J0IHsgRGlhZ3JhbURpYWxvZyB9IGZyb20gXCJnYW1lL2RpYWdyYW1kaWFsb2dcIjtcclxuXHJcbndpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gXCJEbyB5b3Ugd2FudCB0byBleGl0P1wiO1xyXG5cclxufTtcclxuY2xhc3MgU3RhdGlzdGljIHtcclxuICB0b2RheTogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfT17fTtcclxuICB5ZXN0ZXJkYXk6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH09e307XHJcbn1cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gIHN0YXRpYyBpbnN0YW5jZTogR2FtZTtcclxuICBkb206IEhUTUxFbGVtZW50O1xyXG4gIHdvcmxkOiBXb3JsZDtcclxuICBkb21IZWFkZXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGRvbVdvcmxkOiBIVE1MRGl2RWxlbWVudDtcclxuICBfbW9uZXk7XHJcbiAgZGF0ZTogRGF0ZTtcclxuICBsYXN0VXBkYXRlOiBudW1iZXI7XHJcbiAgc3BlZWQ6IG51bWJlciA9IDE7XHJcbiAgcGF1c2VkU3BlZWQ6IG51bWJlcjtcclxuICB0aW1lcjtcclxuICBtYXBXaWR0aCA9IDEwMDA7XHJcbiAgbWFwSGVpZ2h0ID0gNjAwO1xyXG4gIHN0YXRpc3RpYyA9IG5ldyBTdGF0aXN0aWMoKTtcclxuICBzdGF0aWMgdGVtcG9zY2FsZSA9IFswLjAxLCAwLjUsIDEsIDIsIDQsIDgsIDE2LCAzMiwgNjQsIDEyOF1cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBHYW1lLmluc3RhbmNlID0gdGhpcztcclxuXHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoXCJTYXQgSmFuIDAxIDIwMDAgMDA6MDA6MDBcIik7XHJcbiAgICBDaXR5RGlhbG9nLmluc3RhbmNlID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuICB9XHJcbiAgcHVibGljIHVwZGF0ZVRpdGxlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lbW9uZXlcIikuaW5uZXJIVE1MID0gbmV3IE51bWJlcih0aGlzLmdldE1vbmV5KCkpLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuaW5uZXJIVE1MID0gdGhpcy5kYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpICsgXCIgXCIgKyB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCkuc3Vic3RyaW5nKDAsIHRoaXMuZGF0ZS50b0xvY2FsZVRpbWVTdHJpbmcoKS5sZW5ndGggLSAzKTtcclxuICAgICAgdGhpcy53b3JsZC51cGRhdGUoKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInN0b3AgZ2FtZVwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuICB1cGRhdGVTaXplKCkge1xyXG4gICAgdGhpcy5kb21Xb3JsZC5zdHlsZS53aWR0aCA9ICh0aGlzLm1hcFdpZHRoICsgODApICsgXCJweFwiO1xyXG4gICAgdGhpcy5kb21Xb3JsZC5zdHlsZS5oZWlnaHQgPSAodGhpcy5tYXBIZWlnaHQgKyAxMDApICsgXCJweFwiO1xyXG4gICAgKDxIVE1MRWxlbWVudD50aGlzLmRvbVdvcmxkLnBhcmVudE5vZGUpLnN0eWxlLndpZHRoID0gKHRoaXMubWFwV2lkdGggKyA4MCkgKyBcInB4XCI7XHJcbiAgICAoPEhUTUxFbGVtZW50PnRoaXMuZG9tV29ybGQucGFyZW50Tm9kZSkuc3R5bGUuaGVpZ2h0ID0gKHRoaXMubWFwSGVpZ2h0ICsgMTAwKSArIFwicHhcIjtcclxuXHJcbiAgfVxyXG4gIC8vbmV2ZXIgY2FsbCB0aGlzIG91dHNpZGUgdGhlIHRpbWVyIC0gdGhlbiB3b3VsZCBiZSAyIHVwZGF0ZXNcclxuICBwcml2YXRlIG5ldmVyY2FsbHRoaXNmdW5jdGlvbigpIHtcclxuICAgIC8vdmFyIHQ9bmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB2YXIgaW50ZXJ2YWxsID0gMTAwMCAvIHRoaXMuc3BlZWQ7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgdmFyIGRpZmYgPSAxMDAwICogNjAgKiA2MDsvL3VwZGF0ZSBhbHdheXMgYXQgZnVsbCBjbG9jay8vKChEYXRlLm5vdygpIC0gdGhpcy5sYXN0VXBkYXRlKSkgKiA2MCAqIDYwICogdGhpcy5zcGVlZDtcclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKHRoaXMuZGF0ZS5nZXRUaW1lKCkgKyBkaWZmKTtcclxuICAgIHRoaXMudXBkYXRlVGl0bGUoKTtcclxuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XHJcbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIF90aGlzLm5ldmVyY2FsbHRoaXNmdW5jdGlvbigpO1xyXG5cclxuICAgIH0sIGludGVydmFsbCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwidG9va3NcIisobmV3IERhdGUoKS5nZXRUaW1lKCktdCkpO1xyXG4gICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSgpO1xyXG4gICAgQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcclxuXHJcbiAgfVxyXG4gIG5ld0dhbWUoKSB7XHJcbiAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XHJcbiAgICB0aGlzLndvcmxkLmdhbWUgPSB0aGlzO1xyXG4gICAgdGhpcy5fbW9uZXkgPSAyMDAwMDtcclxuICAgIHRoaXMud29ybGQubmV3R2FtZSgpO1xyXG4gIH1cclxuICBnZXRNb25leSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9tb25leTtcclxuICB9XHJcbiAgY2hhbmdlTW9uZXkoY2hhbmdlOiBudW1iZXIsIHdoeTogc3RyaW5nLCBjaXR5OiBDaXR5ID0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLl9tb25leSArPSBjaGFuZ2U7XHJcbiAgICBpZiAodGhpcy5zdGF0aXN0aWMudG9kYXlbd2h5XSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICB0aGlzLnN0YXRpc3RpYy50b2RheVt3aHldID0gMDtcclxuICAgIHRoaXMuc3RhdGlzdGljLnRvZGF5W3doeV0gKz0gY2hhbmdlO1xyXG4gICAgLy8gIGNvbnNvbGUubG9nKGNoYW5nZStcIiBcIit3aHkpO1xyXG4gIH1cclxuICByZW5kZXIoZG9tOiBIVE1MRWxlbWVudCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIGRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwibGlnaHRibHVlXCI7XHJcbiAgICB0aGlzLmRvbSA9IGRvbTtcclxuICAgIHZhciBzZG9tSGVhZGVyID0gYFxyXG4gICAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDoxNXB4O3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTAwMDA7YmFja2dyb3VuZC1jb2xvcjpsaWdodGJsdWU7XCI+XHJcbiAgICAgICAgICAgIFRyYWZmaWNzIFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiZ2FtZS1zbG93ZXJcIj5gKyBJY29ucy5taW51cyArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICAgIDxzcGFuIGlkPVwiZ2FtZWRhdGVcIj48L3NwYW4+ICAgXHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJnYW1lLWZhc3RlclwiPmArIEljb25zLnBsdXMgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICBNb25leTo8c3BhbiBpZD1cImdhbWVtb25leVwiPjwvc3Bhbj5gKyBJY29ucy5tb25leSArIGBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhdmUtZ2FtZVwiPmArIEljb25zLnNhdmUgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiZGVidWctZ2FtZVwiPmArIEljb25zLmRlYnVnICsgYDwvYnV0dG9uPiBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImxvYWQtZ2FtZVwiPmArIEljb25zLmxvYWQgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwic2hvdy1kaWFncmFtXCI+YCsgSWNvbnMuZGlhZ3JhbSArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIGA7XHJcbiAgICB0aGlzLmRvbUhlYWRlciA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbUhlYWRlcikuY2hpbGRyZW5bMF07XHJcblxyXG4gICAgdmFyIHNkb21Xb3JsZCA9IGBcclxuICAgICAgICAgIDxkaXYgaWQ9XCJ3b3JsZFwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7dG9wOjIwcHg7XCI+XHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgdGhpcy5kb21Xb3JsZCA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbVdvcmxkKS5jaGlsZHJlblswXTtcclxuICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZG9tSGVhZGVyKTtcclxuICAgIC8vIHZhciBoZWFkZXJQbGFjZWVob2xkZXIgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCc8ZGl2IHN0eWxlPVwiaGVpZ2h0OjE1cHhcIj48L2Rpdj4nKS5jaGlsZHJlblswXVxyXG4gICAgLy8gdGhpcy5kb20uYXBwZW5kQ2hpbGQoaGVhZGVyUGxhY2VlaG9sZGVyKTtcclxuICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZG9tV29ybGQpO1xyXG4gICAgdGhpcy53b3JsZC5yZW5kZXIodGhpcy5kb21Xb3JsZCk7XHJcbiAgICB0aGlzLnVwZGF0ZVNpemUoKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgX3RoaXMuYmluZEFjdGlvbnMoKTtcclxuICAgIH0sIDUwMCk7XHJcbiAgfVxyXG4gIGJpbmRBY3Rpb25zKCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZG93blwiKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWdhbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgX3RoaXMuc2F2ZSgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtZ2FtZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBfdGhpcy5sb2FkKCk7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVidWctZ2FtZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBfdGhpcy53b3JsZC5hZGRDaXR5KGZhbHNlKTtcclxuICAgICAgLy9fdGhpcy53b3JsZC5jaXRpZXNbX3RoaXMud29ybGQuY2l0aWVzLmxlbmd0aC0xXS5oYXNBaXJwb3J0PWZhbHNlO1xyXG4gICAgICByZXR1cm47XHJcbiAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICBfdGhpcy53b3JsZC5jaXRpZXNbMF0ud2FyZWhvdXNlW3hdID0gNTAwMDtcclxuICAgICAgfVxyXG4gICAgICBfdGhpcy5fbW9uZXkgPSAxMDAwMDA7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvdy1kaWFncmFtXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIERpYWdyYW1EaWFsb2cuZ2V0SW5zdGFuY2UoKS53b3JsZCA9IHRoaXMud29ybGQ7XHJcbiAgICAgIERpYWdyYW1EaWFsb2cuZ2V0SW5zdGFuY2UoKS5zaG93KCk7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1zbG93ZXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgaWYgKF90aGlzLnNwZWVkID09PSBHYW1lLnRlbXBvc2NhbGVbMF0pIHtcclxuICAgICAgICBfdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicGF1c2VcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBwb3MgPSBHYW1lLnRlbXBvc2NhbGUuaW5kZXhPZihfdGhpcy5zcGVlZCk7XHJcbiAgICAgIHBvcy0tO1xyXG4gICAgICBpZiAocG9zID09IC0xKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX3RoaXMuc3BlZWQgPSBHYW1lLnRlbXBvc2NhbGVbcG9zXTtcclxuICAgICAgX3RoaXMucGF1c2UoKTtcclxuICAgICAgX3RoaXMucmVzdW1lKCk7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1mYXN0ZXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgaWYgKF90aGlzLmlzUGF1c2VkKCkpIHtcclxuICAgICAgICBfdGhpcy5yZXN1bWUoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHBvcyA9IEdhbWUudGVtcG9zY2FsZS5pbmRleE9mKF90aGlzLnNwZWVkKTtcclxuICAgICAgcG9zKys7XHJcbiAgICAgIGlmIChwb3MgPj0gR2FtZS50ZW1wb3NjYWxlLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibWF4XCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBfdGhpcy5zcGVlZCA9IEdhbWUudGVtcG9zY2FsZVtwb3NdO1xyXG4gICAgICBfdGhpcy5wYXVzZSgpO1xyXG4gICAgICBfdGhpcy5yZXN1bWUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBzYXZlKCkge1xyXG4gICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgdmFyIHNkYXRhID0gSlNPTi5zdHJpbmdpZnkodGhpcywgKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgIHZhciByZXQ6IGFueSA9IHt9O1xyXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGtleSA9PT0gXCJsYXN0VXBkYXRlXCIpXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJXb3JsZFwiKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LmdhbWU7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIkFpcnBsYW5lXCIpIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LndvcmxkO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJDaXR5XCIpIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LndvcmxkO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJDb21wYW55XCIpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQuY2l0eTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiUm91dGVcIikge1xyXG5cclxuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQuYWlycGxhbmU7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9LCBcIlxcdFwiKTtcclxuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNhdmVnYW1lXCIsIHNkYXRhKTtcclxuICAgIC8vdGhpcy5sb2FkKCk7XHJcbiAgICBjb25zb2xlLmxvZyhzZGF0YSk7XHJcbiAgICB0aGlzLnJlc3VtZSgpO1xyXG5cclxuICB9XHJcbiAgbG9hZCgpIHtcclxuICAgIHRoaXMucGF1c2UoKTtcclxuICAgIHZhciBkYXRhID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F2ZWdhbWVcIik7XHJcbiAgICB2YXIgcmV0ID0gSlNPTi5wYXJzZShkYXRhLCAoa2V5LCB2YWx1ZSkgPT4ge1xyXG4gICAgICB2YXIgcjogYW55ID0gdmFsdWU7XHJcbiAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbClcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiQ29tcGFueVwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBDb21wYW55KCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkFpcnBsYW5lXCIpIHtcclxuICAgICAgICByID0gbmV3IEFpcnBsYW5lKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIldvcmxkXCIpIHtcclxuICAgICAgICByID0gbmV3IFdvcmxkKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkNpdHlcIikge1xyXG4gICAgICAgIHIgPSBuZXcgQ2l0eSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJSb3V0ZVwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBSb3V0ZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHJldCk7XHJcbiAgICB0aGlzLndvcmxkLmdhbWUgPSB0aGlzO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUodGhpcy5kYXRlKTtcclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53b3JsZC5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgdGhpcy53b3JsZC5haXJwbGFuZXNbeF0ud29ybGQgPSB0aGlzLndvcmxkO1xyXG4gICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMud29ybGQuYWlycGxhbmVzW3hdLnJvdXRlLmxlbmd0aDsgeSsrKSB7XHJcbiAgICAgICAgdGhpcy53b3JsZC5haXJwbGFuZXNbeF0ucm91dGVbeV0uYWlycGxhbmUgPSB0aGlzLndvcmxkLmFpcnBsYW5lc1t4XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndvcmxkLmNpdGllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICB0aGlzLndvcmxkLmNpdGllc1t4XS53b3JsZCA9IHRoaXMud29ybGQ7XHJcbiAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzLmxlbmd0aDsgeSsrKSB7XHJcbiAgICAgICAgdGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzW3ldLmNpdHkgPSB0aGlzLndvcmxkLmNpdGllc1t4XTtcclxuICAgICAgfVxyXG4gICAgICAvL2Zvcih2YXIgeT0wO3k8dGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzLmxlbmd0aDt5Kyspe1xyXG4gICAgICAvLyAgdGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzW3ldLlxyXG4gICAgICAvL31cclxuICAgIH1cclxuICAgIHRoaXMucmVuZGVyKHRoaXMuZG9tKTtcclxuICAgIHRoaXMucmVzdW1lKCk7XHJcbiAgfVxyXG4gIHJlc3VtZSgpIHtcclxuICAgIGlmICh0aGlzLnRpbWVyID09PSAwKVxyXG4gICAgICB0aGlzLm5ldmVyY2FsbHRoaXNmdW5jdGlvbigpO1xyXG4gIH1cclxuICBpc1BhdXNlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRpbWVyID09PSAwO1xyXG4gIH1cclxuICBwYXVzZSgpIHtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcclxuICAgIHRoaXMudGltZXIgPSAwO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSgpIHtcclxuICAgIHRoaXMud29ybGQuZGVzdHJveSgpO1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKSB7XHJcblxyXG59XHJcbiJdfQ==