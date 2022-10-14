define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog", "game/icons", "game/company", "game/airplane", "game/city", "game/route"], function (require, exports, citydialog_1, world_1, airplanedialog_1, icons_1, company_1, airplane_1, city_1, route_1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBWUEsTUFBYSxJQUFJO1FBZWY7WUFOQSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEIsY0FBUyxHQUFHLEdBQUcsQ0FBQztZQUdkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUVyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDakQsdUJBQVUsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQy9CLENBQUM7UUFDTSxXQUFXO1lBQ2hCLElBQUk7Z0JBQ0YsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQzlGLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDOUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNyQjtZQUFDLFdBQU07Z0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFX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LElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDOztJQTNRSCxvQkE0UUM7SUE5UFEsZUFBVSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFnUTlELFNBQWdCLElBQUk7SUFFcEIsQ0FBQztJQUZELG9CQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiZ2FtZS93b3JsZFwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZURpYWxvZyB9IGZyb20gXCJnYW1lL2FpcnBsYW5lZGlhbG9nXCI7XHJcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcclxuaW1wb3J0IHsgQ29tcGFueSB9IGZyb20gXCJnYW1lL2NvbXBhbnlcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgeyBDaXR5IH0gZnJvbSBcImdhbWUvY2l0eVwiO1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gIHN0YXRpYyBpbnN0YW5jZTogR2FtZTtcclxuICBkb206IEhUTUxFbGVtZW50O1xyXG4gIHdvcmxkOiBXb3JsZDtcclxuICBkb21IZWFkZXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGRvbVdvcmxkOiBIVE1MRGl2RWxlbWVudDtcclxuICBfbW9uZXk7XHJcbiAgZGF0ZTogRGF0ZTtcclxuICBsYXN0VXBkYXRlOiBudW1iZXI7XHJcbiAgc3BlZWQ6IG51bWJlciA9IDE7XHJcbiAgcGF1c2VkU3BlZWQ6IG51bWJlcjtcclxuICB0aW1lcjtcclxuICBtYXBXaWR0aCA9IDEwMDA7XHJcbiAgbWFwSGVpZ2h0ID0gNjAwO1xyXG4gIHN0YXRpYyB0ZW1wb3NjYWxlID0gWzAuMDEsIDAuNSwgMSwgMiwgNCwgOCwgMTYsIDMyLCA2NCwgMTI4XVxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIEdhbWUuaW5zdGFuY2UgPSB0aGlzO1xyXG4gICAgXHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoXCJTYXQgSmFuIDAxIDIwMDAgMDA6MDA6MDBcIik7XHJcbiAgICBDaXR5RGlhbG9nLmluc3RhbmNlID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuICB9XHJcbiAgcHVibGljIHVwZGF0ZVRpdGxlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lbW9uZXlcIikuaW5uZXJIVE1MID0gbmV3IE51bWJlcih0aGlzLmdldE1vbmV5KCkpLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuaW5uZXJIVE1MID0gdGhpcy5kYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpICsgXCIgXCIgKyB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCkuc3Vic3RyaW5nKDAsIHRoaXMuZGF0ZS50b0xvY2FsZVRpbWVTdHJpbmcoKS5sZW5ndGggLSAzKTtcclxuICAgICAgdGhpcy53b3JsZC51cGRhdGUoKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInN0b3AgZ2FtZVwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuICB1cGRhdGVTaXplKCl7XHJcbiAgICB0aGlzLmRvbVdvcmxkLnN0eWxlLndpZHRoPSh0aGlzLm1hcFdpZHRoKzgwKStcInB4XCI7IFxyXG4gICAgdGhpcy5kb21Xb3JsZC5zdHlsZS5oZWlnaHQ9KHRoaXMubWFwSGVpZ2h0KzEwMCkrXCJweFwiOyBcclxuICAgICg8SFRNTEVsZW1lbnQ+IHRoaXMuZG9tV29ybGQucGFyZW50Tm9kZSkuc3R5bGUud2lkdGg9KHRoaXMubWFwV2lkdGgrODApK1wicHhcIjsgXHJcbiAgICAoPEhUTUxFbGVtZW50PiB0aGlzLmRvbVdvcmxkLnBhcmVudE5vZGUpLnN0eWxlLmhlaWdodD0odGhpcy5tYXBIZWlnaHQrMTAwKStcInB4XCI7IFxyXG4gICAgXHJcbiAgfVxyXG4gIC8vbmV2ZXIgY2FsbCB0aGlzIG91dHNpZGUgdGhlIHRpbWVyIC0gdGhlbiB3b3VsZCBiZSAyIHVwZGF0ZXNcclxuICBwcml2YXRlIG5ldmVyY2FsbHRoaXNmdW5jdGlvbigpIHtcclxuICAgIC8vdmFyIHQ9bmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB2YXIgaW50ZXJ2YWxsID0gMTAwMCAvIHRoaXMuc3BlZWQ7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgdmFyIGRpZmYgPSAxMDAwICogNjAgKiA2MDsvL3VwZGF0ZSBhbHdheXMgYXQgZnVsbCBjbG9jay8vKChEYXRlLm5vdygpIC0gdGhpcy5sYXN0VXBkYXRlKSkgKiA2MCAqIDYwICogdGhpcy5zcGVlZDtcclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKHRoaXMuZGF0ZS5nZXRUaW1lKCkgKyBkaWZmKTtcclxuICAgIHRoaXMudXBkYXRlVGl0bGUoKTtcclxuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XHJcbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIF90aGlzLm5ldmVyY2FsbHRoaXNmdW5jdGlvbigpO1xyXG5cclxuICAgIH0sIGludGVydmFsbCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwidG9va3NcIisobmV3IERhdGUoKS5nZXRUaW1lKCktdCkpO1xyXG4gICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSgpO1xyXG4gICAgQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcclxuXHJcbiAgfVxyXG4gIG5ld0dhbWUoKSB7XHJcbiAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XHJcbiAgICB0aGlzLndvcmxkLmdhbWUgPSB0aGlzOyBcclxuICAgIHRoaXMuX21vbmV5ID0gMjAwMDA7XHJcbiAgICB0aGlzLndvcmxkLm5ld0dhbWUoKTtcclxuICB9XHJcbiAgZ2V0TW9uZXkoKXtcclxuICAgIHJldHVybiB0aGlzLl9tb25leTtcclxuICB9XHJcbiAgY2hhbmdlTW9uZXkoY2hhbmdlOm51bWJlcix3aHk6c3RyaW5nLGNpdHk6Q2l0eT11bmRlZmluZWQpe1xyXG4gICAgdGhpcy5fbW9uZXkrPWNoYW5nZTtcclxuICAvLyAgY29uc29sZS5sb2coY2hhbmdlK1wiIFwiK3doeSk7XHJcbiAgfVxyXG4gIHJlbmRlcihkb206IEhUTUxFbGVtZW50KSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgZG9tLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICBkb20uc3R5bGUuYmFja2dyb3VuZENvbG9yPVwibGlnaHRibHVlXCI7XHJcbiAgICB0aGlzLmRvbSA9IGRvbTtcclxuICAgIHZhciBzZG9tSGVhZGVyID0gYFxyXG4gICAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDoxNXB4O3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTAwMDA7YmFja2dyb3VuZC1jb2xvcjpsaWdodGJsdWU7XCI+XHJcbiAgICAgICAgICAgIFRyYWZmaWNzIFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiZ2FtZS1zbG93ZXJcIj5gKyBJY29ucy5taW51cyArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICAgIDxzcGFuIGlkPVwiZ2FtZWRhdGVcIj48L3NwYW4+ICAgXHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJnYW1lLWZhc3RlclwiPmArIEljb25zLnBsdXMgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICBNb25leTo8c3BhbiBpZD1cImdhbWVtb25leVwiPjwvc3Bhbj5gKyBJY29ucy5tb25leSArIGBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhdmUtZ2FtZVwiPmArIEljb25zLnNhdmUgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwibG9hZC1nYW1lXCI+YCsgSWNvbnMubG9hZCArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkZWJ1Zy1nYW1lXCI+YCsgSWNvbnMuZGVidWcgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgPC9kaXY+ICBcclxuICAgICAgICBgO1xyXG4gICAgdGhpcy5kb21IZWFkZXIgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb21IZWFkZXIpLmNoaWxkcmVuWzBdO1xyXG5cclxuICAgIHZhciBzZG9tV29ybGQgPSBgXHJcbiAgICAgICAgICA8ZGl2IGlkPVwid29ybGRcIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlO3RvcDoyMHB4O1wiPlxyXG4gICAgICAgICAgPC9kaXY+ICBcclxuICAgICAgICBgO1xyXG5cclxuICAgIHRoaXMuZG9tV29ybGQgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb21Xb3JsZCkuY2hpbGRyZW5bMF07XHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmRvbUhlYWRlcik7XHJcbiAgIC8vIHZhciBoZWFkZXJQbGFjZWVob2xkZXIgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCc8ZGl2IHN0eWxlPVwiaGVpZ2h0OjE1cHhcIj48L2Rpdj4nKS5jaGlsZHJlblswXVxyXG4gICAvLyB0aGlzLmRvbS5hcHBlbmRDaGlsZChoZWFkZXJQbGFjZWVob2xkZXIpO1xyXG4gICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5kb21Xb3JsZCk7XHJcbiAgICB0aGlzLndvcmxkLnJlbmRlcih0aGlzLmRvbVdvcmxkKTtcclxuICAgIHRoaXMudXBkYXRlU2l6ZSgpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBfdGhpcy5iaW5kQWN0aW9ucygpO1xyXG4gICAgfSwgNTAwKTtcclxuICB9XHJcbiAgYmluZEFjdGlvbnMoKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lZGF0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsICgpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coXCJkb3duXCIpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmUtZ2FtZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBfdGhpcy5zYXZlKCk7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1nYW1lXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIF90aGlzLmxvYWQoKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWJ1Zy1nYW1lXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIF90aGlzLndvcmxkLmFkZENpdHkoKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLXNsb3dlclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBpZiAoX3RoaXMuc3BlZWQgPT09IEdhbWUudGVtcG9zY2FsZVswXSkge1xyXG4gICAgICAgIF90aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwYXVzZVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHBvcyA9IEdhbWUudGVtcG9zY2FsZS5pbmRleE9mKF90aGlzLnNwZWVkKTtcclxuICAgICAgcG9zLS07XHJcbiAgICAgIGlmIChwb3MgPT0gLTEpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBfdGhpcy5zcGVlZCA9IEdhbWUudGVtcG9zY2FsZVtwb3NdO1xyXG4gICAgICBfdGhpcy5wYXVzZSgpO1xyXG4gICAgICBfdGhpcy5yZXN1bWUoKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLWZhc3RlclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBpZiAoX3RoaXMuaXNQYXVzZWQoKSkge1xyXG4gICAgICAgIF90aGlzLnJlc3VtZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB2YXIgcG9zID0gR2FtZS50ZW1wb3NjYWxlLmluZGV4T2YoX3RoaXMuc3BlZWQpO1xyXG4gICAgICBwb3MrKztcclxuICAgICAgaWYgKHBvcyA+PSBHYW1lLnRlbXBvc2NhbGUubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJtYXhcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIF90aGlzLnNwZWVkID0gR2FtZS50ZW1wb3NjYWxlW3Bvc107XHJcbiAgICAgIF90aGlzLnBhdXNlKCk7XHJcbiAgICAgIF90aGlzLnJlc3VtZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHNhdmUoKSB7XHJcbiAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICB2YXIgc2RhdGEgPSBKU09OLnN0cmluZ2lmeSh0aGlzLCAoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgdmFyIHJldDogYW55ID0ge307XHJcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoa2V5ID09PSBcImxhc3RVcGRhdGVcIilcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIldvcmxkXCIpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQuZ2FtZTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiQWlycGxhbmVcIikge1xyXG5cclxuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQud29ybGQ7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIkNpdHlcIikge1xyXG5cclxuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQud29ybGQ7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIkNvbXBhbnlcIikge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC5jaXR5O1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJSb3V0ZVwiKSB7XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC5haXJwbGFuZTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0sIFwiXFx0XCIpO1xyXG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2F2ZWdhbWVcIiwgc2RhdGEpO1xyXG4gICAgLy90aGlzLmxvYWQoKTtcclxuICAgIGNvbnNvbGUubG9nKHNkYXRhKTtcclxuICAgIHRoaXMucmVzdW1lKCk7XHJcblxyXG4gIH1cclxuICBsb2FkKCkge1xyXG4gICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgdmFyIGRhdGEgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXZlZ2FtZVwiKTtcclxuICAgIHZhciByZXQgPSBKU09OLnBhcnNlKGRhdGEsIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICAgIHZhciByOiBhbnkgPSB2YWx1ZTtcclxuICAgICAgaWYgKHZhbHVlID09PSBudWxsKVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJDb21wYW55XCIpIHtcclxuICAgICAgICByID0gbmV3IENvbXBhbnkoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiQWlycGxhbmVcIikge1xyXG4gICAgICAgIHIgPSBuZXcgQWlycGxhbmUodW5kZWZpbmVkKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiV29ybGRcIikge1xyXG4gICAgICAgIHIgPSBuZXcgV29ybGQoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiQ2l0eVwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBDaXR5KCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIlJvdXRlXCIpIHtcclxuICAgICAgICByID0gbmV3IFJvdXRlKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHI7XHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgcmV0KTtcclxuICAgIHRoaXMud29ybGQuZ2FtZSA9IHRoaXM7XHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZSh0aGlzLmRhdGUpO1xyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndvcmxkLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICB0aGlzLndvcmxkLmFpcnBsYW5lc1t4XS53b3JsZCA9IHRoaXMud29ybGQ7XHJcbiAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy53b3JsZC5haXJwbGFuZXNbeF0ucm91dGUubGVuZ3RoOyB5KyspIHtcclxuICAgICAgICB0aGlzLndvcmxkLmFpcnBsYW5lc1t4XS5yb3V0ZVt5XS5haXJwbGFuZSA9IHRoaXMud29ybGQuYWlycGxhbmVzW3hdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud29ybGQuY2l0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgIHRoaXMud29ybGQuY2l0aWVzW3hdLndvcmxkID0gdGhpcy53b3JsZDtcclxuICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzLmxlbmd0aDsgeSsrKSB7XHJcbiAgICAgICAgdGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzW3ldLmNpdHkgPSB0aGlzLndvcmxkLmNpdGllc1t4XTtcclxuICAgICAgfVxyXG4gICAgICAvL2Zvcih2YXIgeT0wO3k8dGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzLmxlbmd0aDt5Kyspe1xyXG4gICAgICAvLyAgdGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzW3ldLlxyXG4gICAgICAvL31cclxuICAgIH1cclxuICAgIHRoaXMucmVuZGVyKHRoaXMuZG9tKTtcclxuICAgIHRoaXMucmVzdW1lKCk7XHJcbiAgfVxyXG4gIHJlc3VtZSgpIHtcclxuICAgIGlmICh0aGlzLnRpbWVyID09PSAwKVxyXG4gICAgICB0aGlzLm5ldmVyY2FsbHRoaXNmdW5jdGlvbigpO1xyXG4gIH1cclxuICBpc1BhdXNlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRpbWVyID09PSAwO1xyXG4gIH1cclxuICBwYXVzZSgpIHtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcclxuICAgIHRoaXMudGltZXIgPSAwO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSgpIHtcclxuICAgIHRoaXMud29ybGQuZGVzdHJveSgpO1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKSB7XHJcblxyXG59XHJcbiJdfQ==