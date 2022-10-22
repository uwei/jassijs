define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog", "game/icons", "game/company", "game/airplane", "game/city", "game/route", "game/product", "game/diagramdialog"], function (require, exports, citydialog_1, world_1, airplanedialog_1, icons_1, company_1, airplane_1, city_1, route_1, product_1, diagramdialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Game = void 0;
    window.onbeforeunload = function () {
        return "Do you want to exit?";
    };
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
                _this.world.addCity();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBYUEsTUFBTSxDQUFDLGNBQWMsR0FBRztRQUN0QixPQUFPLHNCQUFzQixDQUFDO0lBRWhDLENBQUMsQ0FBQztJQUNGLE1BQWEsSUFBSTtRQWVmO1lBTkEsVUFBSyxHQUFXLENBQUMsQ0FBQztZQUdsQixhQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLGNBQVMsR0FBRyxHQUFHLENBQUM7WUFHZCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFFckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ2pELHVCQUFVLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztZQUNoQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMvQixDQUFDO1FBQ00sV0FBVztZQUNoQixJQUFJO2dCQUNGLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUM5RixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlLLElBQUksQ0FBQyxLQUFLLENB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QUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQy9EO2dCQUNELDJEQUEyRDtnQkFDM0Qsc0NBQXNDO2dCQUN0QyxHQUFHO2FBQ0o7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEIsQ0FBQztRQUNELE1BQU07WUFDSixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQztnQkFDbEIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDakMsQ0FBQztRQUNELFFBQVE7WUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDRCxLQUFLO1lBQ0gsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNqQixDQUFDO1FBRUQsT0FBTztZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDOztJQXBSSCxvQkFxUkM7SUF2UVEsZUFBVSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUE7SUF5UTlELFNBQWdCLElBQUk7SUFFcEIsQ0FBQztJQUZELG9CQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiZ2FtZS93b3JsZFwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZURpYWxvZyB9IGZyb20gXCJnYW1lL2FpcnBsYW5lZGlhbG9nXCI7XHJcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcclxuaW1wb3J0IHsgQ29tcGFueSB9IGZyb20gXCJnYW1lL2NvbXBhbnlcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgeyBDaXR5IH0gZnJvbSBcImdhbWUvY2l0eVwiO1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XHJcbmltcG9ydCB7IGFsbFByb2R1Y3RzIH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xyXG5pbXBvcnQgeyBEaWFncmFtRGlhbG9nIH0gZnJvbSBcImdhbWUvZGlhZ3JhbWRpYWxvZ1wiO1xyXG5cclxud2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBcIkRvIHlvdSB3YW50IHRvIGV4aXQ/XCI7XHJcblxyXG59O1xyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcbiAgc3RhdGljIGluc3RhbmNlOiBHYW1lO1xyXG4gIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgd29ybGQ6IFdvcmxkO1xyXG4gIGRvbUhlYWRlcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgZG9tV29ybGQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gIF9tb25leTtcclxuICBkYXRlOiBEYXRlO1xyXG4gIGxhc3RVcGRhdGU6IG51bWJlcjtcclxuICBzcGVlZDogbnVtYmVyID0gMTtcclxuICBwYXVzZWRTcGVlZDogbnVtYmVyO1xyXG4gIHRpbWVyO1xyXG4gIG1hcFdpZHRoID0gMTAwMDtcclxuICBtYXBIZWlnaHQgPSA2MDA7XHJcbiAgc3RhdGljIHRlbXBvc2NhbGUgPSBbMC4wMSwgMC41LCAxLCAyLCA0LCA4LCAxNiwgMzIsIDY0LCAxMjhdXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgR2FtZS5pbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKFwiU2F0IEphbiAwMSAyMDAwIDAwOjAwOjAwXCIpO1xyXG4gICAgQ2l0eURpYWxvZy5pbnN0YW5jZSA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMubmV2ZXJjYWxsdGhpc2Z1bmN0aW9uKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyB1cGRhdGVUaXRsZSgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZW1vbmV5XCIpLmlubmVySFRNTCA9IG5ldyBOdW1iZXIodGhpcy5nZXRNb25leSgpKS50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVkYXRlXCIpLmlubmVySFRNTCA9IHRoaXMuZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSArIFwiIFwiICsgdGhpcy5kYXRlLnRvTG9jYWxlVGltZVN0cmluZygpLnN1YnN0cmluZygwLCB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCkubGVuZ3RoIC0gMyk7XHJcbiAgICAgIHRoaXMud29ybGQudXBkYXRlKCk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgY29uc29sZS5sb2coXCJzdG9wIGdhbWVcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcbiAgdXBkYXRlU2l6ZSgpIHtcclxuICAgIHRoaXMuZG9tV29ybGQuc3R5bGUud2lkdGggPSAodGhpcy5tYXBXaWR0aCArIDgwKSArIFwicHhcIjtcclxuICAgIHRoaXMuZG9tV29ybGQuc3R5bGUuaGVpZ2h0ID0gKHRoaXMubWFwSGVpZ2h0ICsgMTAwKSArIFwicHhcIjtcclxuICAgICg8SFRNTEVsZW1lbnQ+dGhpcy5kb21Xb3JsZC5wYXJlbnROb2RlKS5zdHlsZS53aWR0aCA9ICh0aGlzLm1hcFdpZHRoICsgODApICsgXCJweFwiO1xyXG4gICAgKDxIVE1MRWxlbWVudD50aGlzLmRvbVdvcmxkLnBhcmVudE5vZGUpLnN0eWxlLmhlaWdodCA9ICh0aGlzLm1hcEhlaWdodCArIDEwMCkgKyBcInB4XCI7XHJcblxyXG4gIH1cclxuICAvL25ldmVyIGNhbGwgdGhpcyBvdXRzaWRlIHRoZSB0aW1lciAtIHRoZW4gd291bGQgYmUgMiB1cGRhdGVzXHJcbiAgcHJpdmF0ZSBuZXZlcmNhbGx0aGlzZnVuY3Rpb24oKSB7XHJcbiAgICAvL3ZhciB0PW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgdmFyIGludGVydmFsbCA9IDEwMDAgLyB0aGlzLnNwZWVkO1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIHZhciBkaWZmID0gMTAwMCAqIDYwICogNjA7Ly91cGRhdGUgYWx3YXlzIGF0IGZ1bGwgY2xvY2svLygoRGF0ZS5ub3coKSAtIHRoaXMubGFzdFVwZGF0ZSkpICogNjAgKiA2MCAqIHRoaXMuc3BlZWQ7XHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZSh0aGlzLmRhdGUuZ2V0VGltZSgpICsgZGlmZik7XHJcbiAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBfdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuXHJcbiAgICB9LCBpbnRlcnZhbGwpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcInRvb2tzXCIrKG5ldyBEYXRlKCkuZ2V0VGltZSgpLXQpKTtcclxuICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcclxuICAgIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKCk7XHJcblxyXG4gIH1cclxuICBuZXdHYW1lKCkge1xyXG4gICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG4gICAgdGhpcy53b3JsZC5nYW1lID0gdGhpcztcclxuICAgIHRoaXMuX21vbmV5ID0gMjAwMDA7XHJcbiAgICB0aGlzLndvcmxkLm5ld0dhbWUoKTtcclxuICB9XHJcbiAgZ2V0TW9uZXkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9uZXk7XHJcbiAgfVxyXG4gIGNoYW5nZU1vbmV5KGNoYW5nZTogbnVtYmVyLCB3aHk6IHN0cmluZywgY2l0eTogQ2l0eSA9IHVuZGVmaW5lZCkge1xyXG4gICAgdGhpcy5fbW9uZXkgKz0gY2hhbmdlO1xyXG4gICAgLy8gIGNvbnNvbGUubG9nKGNoYW5nZStcIiBcIit3aHkpO1xyXG4gIH1cclxuICByZW5kZXIoZG9tOiBIVE1MRWxlbWVudCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIGRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwibGlnaHRibHVlXCI7XHJcbiAgICB0aGlzLmRvbSA9IGRvbTtcclxuICAgIHZhciBzZG9tSGVhZGVyID0gYFxyXG4gICAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDoxNXB4O3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTAwMDA7YmFja2dyb3VuZC1jb2xvcjpsaWdodGJsdWU7XCI+XHJcbiAgICAgICAgICAgIFRyYWZmaWNzIFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiZ2FtZS1zbG93ZXJcIj5gKyBJY29ucy5taW51cyArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICAgIDxzcGFuIGlkPVwiZ2FtZWRhdGVcIj48L3NwYW4+ICAgXHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJnYW1lLWZhc3RlclwiPmArIEljb25zLnBsdXMgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICBNb25leTo8c3BhbiBpZD1cImdhbWVtb25leVwiPjwvc3Bhbj5gKyBJY29ucy5tb25leSArIGBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhdmUtZ2FtZVwiPmArIEljb25zLnNhdmUgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiZGVidWctZ2FtZVwiPmArIEljb25zLmRlYnVnICsgYDwvYnV0dG9uPiBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImxvYWQtZ2FtZVwiPmArIEljb25zLmxvYWQgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwic2hvdy1kaWFncmFtXCI+YCsgSWNvbnMuZGlhZ3JhbSArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIGA7XHJcbiAgICB0aGlzLmRvbUhlYWRlciA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbUhlYWRlcikuY2hpbGRyZW5bMF07XHJcblxyXG4gICAgdmFyIHNkb21Xb3JsZCA9IGBcclxuICAgICAgICAgIDxkaXYgaWQ9XCJ3b3JsZFwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7dG9wOjIwcHg7XCI+XHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgdGhpcy5kb21Xb3JsZCA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbVdvcmxkKS5jaGlsZHJlblswXTtcclxuICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZG9tSGVhZGVyKTtcclxuICAgIC8vIHZhciBoZWFkZXJQbGFjZWVob2xkZXIgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCc8ZGl2IHN0eWxlPVwiaGVpZ2h0OjE1cHhcIj48L2Rpdj4nKS5jaGlsZHJlblswXVxyXG4gICAgLy8gdGhpcy5kb20uYXBwZW5kQ2hpbGQoaGVhZGVyUGxhY2VlaG9sZGVyKTtcclxuICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZG9tV29ybGQpO1xyXG4gICAgdGhpcy53b3JsZC5yZW5kZXIodGhpcy5kb21Xb3JsZCk7XHJcbiAgICB0aGlzLnVwZGF0ZVNpemUoKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgX3RoaXMuYmluZEFjdGlvbnMoKTtcclxuICAgIH0sIDUwMCk7XHJcbiAgfVxyXG4gIGJpbmRBY3Rpb25zKCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZG93blwiKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWdhbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgX3RoaXMuc2F2ZSgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtZ2FtZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBfdGhpcy5sb2FkKCk7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVidWctZ2FtZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBfdGhpcy53b3JsZC5hZGRDaXR5KCk7XHJcbiAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICBfdGhpcy53b3JsZC5jaXRpZXNbMF0ud2FyZWhvdXNlW3hdID0gNTAwMDtcclxuICAgICAgfVxyXG4gICAgICBfdGhpcy5fbW9uZXkgPSAxMDAwMDA7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvdy1kaWFncmFtXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIERpYWdyYW1EaWFsb2cuZ2V0SW5zdGFuY2UoKS53b3JsZD10aGlzLndvcmxkO1xyXG4gICAgICBEaWFncmFtRGlhbG9nLmdldEluc3RhbmNlKCkuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtc2xvd2VyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIGlmIChfdGhpcy5zcGVlZCA9PT0gR2FtZS50ZW1wb3NjYWxlWzBdKSB7XHJcbiAgICAgICAgX3RoaXMucGF1c2UoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInBhdXNlXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB2YXIgcG9zID0gR2FtZS50ZW1wb3NjYWxlLmluZGV4T2YoX3RoaXMuc3BlZWQpO1xyXG4gICAgICBwb3MtLTtcclxuICAgICAgaWYgKHBvcyA9PSAtMSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF90aGlzLnNwZWVkID0gR2FtZS50ZW1wb3NjYWxlW3Bvc107XHJcbiAgICAgIF90aGlzLnBhdXNlKCk7XHJcbiAgICAgIF90aGlzLnJlc3VtZSgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtZmFzdGVyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIGlmIChfdGhpcy5pc1BhdXNlZCgpKSB7XHJcbiAgICAgICAgX3RoaXMucmVzdW1lKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBwb3MgPSBHYW1lLnRlbXBvc2NhbGUuaW5kZXhPZihfdGhpcy5zcGVlZCk7XHJcbiAgICAgIHBvcysrO1xyXG4gICAgICBpZiAocG9zID49IEdhbWUudGVtcG9zY2FsZS5sZW5ndGgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm1heFwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgX3RoaXMuc3BlZWQgPSBHYW1lLnRlbXBvc2NhbGVbcG9zXTtcclxuICAgICAgX3RoaXMucGF1c2UoKTtcclxuICAgICAgX3RoaXMucmVzdW1lKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgc2F2ZSgpIHtcclxuICAgIHRoaXMucGF1c2UoKTtcclxuICAgIHZhciBzZGF0YSA9IEpTT04uc3RyaW5naWZ5KHRoaXMsIChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICB2YXIgcmV0OiBhbnkgPSB7fTtcclxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChrZXkgPT09IFwibGFzdFVwZGF0ZVwiKVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiV29ybGRcIikge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC5nYW1lO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJBaXJwbGFuZVwiKSB7XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC53b3JsZDtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiQ2l0eVwiKSB7XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC53b3JsZDtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiQ29tcGFueVwiKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LmNpdHk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIlJvdXRlXCIpIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LmFpcnBsYW5lO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSwgXCJcXHRcIik7XHJcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzYXZlZ2FtZVwiLCBzZGF0YSk7XHJcbiAgICAvL3RoaXMubG9hZCgpO1xyXG4gICAgY29uc29sZS5sb2coc2RhdGEpO1xyXG4gICAgdGhpcy5yZXN1bWUoKTtcclxuXHJcbiAgfVxyXG4gIGxvYWQoKSB7XHJcbiAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICB2YXIgZGF0YSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdmVnYW1lXCIpO1xyXG4gICAgdmFyIHJldCA9IEpTT04ucGFyc2UoZGF0YSwgKGtleSwgdmFsdWUpID0+IHtcclxuICAgICAgdmFyIHI6IGFueSA9IHZhbHVlO1xyXG4gICAgICBpZiAodmFsdWUgPT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkNvbXBhbnlcIikge1xyXG4gICAgICAgIHIgPSBuZXcgQ29tcGFueSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJBaXJwbGFuZVwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBBaXJwbGFuZSh1bmRlZmluZWQpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJXb3JsZFwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBXb3JsZCgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJDaXR5XCIpIHtcclxuICAgICAgICByID0gbmV3IENpdHkoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiUm91dGVcIikge1xyXG4gICAgICAgIHIgPSBuZXcgUm91dGUoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCByZXQpO1xyXG4gICAgdGhpcy53b3JsZC5nYW1lID0gdGhpcztcclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKHRoaXMuZGF0ZSk7XHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud29ybGQuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgIHRoaXMud29ybGQuYWlycGxhbmVzW3hdLndvcmxkID0gdGhpcy53b3JsZDtcclxuICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLndvcmxkLmFpcnBsYW5lc1t4XS5yb3V0ZS5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgIHRoaXMud29ybGQuYWlycGxhbmVzW3hdLnJvdXRlW3ldLmFpcnBsYW5lID0gdGhpcy53b3JsZC5haXJwbGFuZXNbeF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53b3JsZC5jaXRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgdGhpcy53b3JsZC5jaXRpZXNbeF0ud29ybGQgPSB0aGlzLndvcmxkO1xyXG4gICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllcy5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgIHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllc1t5XS5jaXR5ID0gdGhpcy53b3JsZC5jaXRpZXNbeF07XHJcbiAgICAgIH1cclxuICAgICAgLy9mb3IodmFyIHk9MDt5PHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllcy5sZW5ndGg7eSsrKXtcclxuICAgICAgLy8gIHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllc1t5XS5cclxuICAgICAgLy99XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbmRlcih0aGlzLmRvbSk7XHJcbiAgICB0aGlzLnJlc3VtZSgpO1xyXG4gIH1cclxuICByZXN1bWUoKSB7XHJcbiAgICBpZiAodGhpcy50aW1lciA9PT0gMClcclxuICAgICAgdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuICB9XHJcbiAgaXNQYXVzZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50aW1lciA9PT0gMDtcclxuICB9XHJcbiAgcGF1c2UoKSB7XHJcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgICB0aGlzLnRpbWVyID0gMDtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLndvcmxkLmRlc3Ryb3koKTtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG5cclxufVxyXG4iXX0=