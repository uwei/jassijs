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
            this.money = 2000000;
            this.lastUpdate = Date.now();
            this.date = new Date("Sat Jan 01 2000 00:00:00");
            citydialog_1.CityDialog.instance = undefined;
            this.nevercallthisfunction();
        }
        updateTitle() {
            try {
                document.getElementById("gamemoney").innerHTML = new Number(this.money).toLocaleString();
                document.getElementById("gamedate").innerHTML = this.date.toLocaleDateString() + " " + this.date.toLocaleTimeString().substring(0, this.date.toLocaleTimeString().length - 3);
                this.world.update();
            }
            catch (_a) {
                console.log("stop game");
                return;
            }
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
            this.world.newGame();
        }
        render(dom) {
            var _this = this;
            dom.innerHTML = "";
            this.dom = dom;
            var sdomHeader = `
          <div style="height:15px;position:fixed;">
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
          <div id="world" style="position:relative;width: 100%;height:calc(100% - 15px);">
          </div>  
        `;
            this.domWorld = document.createRange().createContextualFragment(sdomWorld).children[0];
            this.dom.appendChild(this.domHeader);
            var headerPlaceeholder = document.createRange().createContextualFragment('<div style="height:15px"></div>').children[0];
            this.dom.appendChild(headerPlaceeholder);
            this.dom.appendChild(this.domWorld);
            this.world.render(this.domWorld);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBWUEsTUFBYSxJQUFJO1FBZWY7WUFOQSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEIsY0FBUyxHQUFHLEdBQUcsQ0FBQztZQUdkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDakQsdUJBQVUsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQy9CLENBQUM7UUFDTSxXQUFXO1lBQ2hCLElBQUk7Z0JBQ0YsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN6RixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDckI7WUFBQyxXQUFN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QUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM3RCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNyRTthQUNGO1lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUMvRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMvRDtnQkFDRCwyREFBMkQ7Z0JBQzNELHNDQUFzQztnQkFDdEMsR0FBRzthQUNKO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxNQUFNO1lBQ0osSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ2pDLENBQUM7UUFDRCxRQUFRO1lBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztRQUMxQixDQUFDO1FBQ0QsS0FBSztZQUNILFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDakIsQ0FBQztRQUVELE9BQU87WUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQzs7SUEzUEgsb0JBNFBDO0lBOU9RLGVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBZ1A5RCxTQUFnQixJQUFJO0lBRXBCLENBQUM7SUFGRCxvQkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImdhbWUvd29ybGRcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgQWlycGxhbmVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBJY29ucyB9IGZyb20gXCJnYW1lL2ljb25zXCI7XHJcbmltcG9ydCB7IENvbXBhbnkgfSBmcm9tIFwiZ2FtZS9jb21wYW55XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgUm91dGUgfSBmcm9tIFwiZ2FtZS9yb3V0ZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuICBzdGF0aWMgaW5zdGFuY2U6IEdhbWU7XHJcbiAgZG9tOiBIVE1MRWxlbWVudDtcclxuICB3b3JsZDogV29ybGQ7XHJcbiAgZG9tSGVhZGVyOiBIVE1MRGl2RWxlbWVudDtcclxuICBkb21Xb3JsZDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgbW9uZXk7XHJcbiAgZGF0ZTogRGF0ZTtcclxuICBsYXN0VXBkYXRlOiBudW1iZXI7XHJcbiAgc3BlZWQ6IG51bWJlciA9IDE7XHJcbiAgcGF1c2VkU3BlZWQ6IG51bWJlcjtcclxuICB0aW1lcjtcclxuICBtYXBXaWR0aCA9IDEwMDA7XHJcbiAgbWFwSGVpZ2h0ID0gNjAwO1xyXG4gIHN0YXRpYyB0ZW1wb3NjYWxlID0gWzAuMDEsIDAuNSwgMSwgMiwgNCwgOCwgMTYsIDMyLCA2NCwgMTI4XVxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIEdhbWUuaW5zdGFuY2UgPSB0aGlzO1xyXG4gICAgdGhpcy5tb25leSA9IDIwMDAwMDA7XHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoXCJTYXQgSmFuIDAxIDIwMDAgMDA6MDA6MDBcIik7XHJcbiAgICBDaXR5RGlhbG9nLmluc3RhbmNlID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuICB9XHJcbiAgcHVibGljIHVwZGF0ZVRpdGxlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lbW9uZXlcIikuaW5uZXJIVE1MID0gbmV3IE51bWJlcih0aGlzLm1vbmV5KS50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVkYXRlXCIpLmlubmVySFRNTCA9IHRoaXMuZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSArIFwiIFwiICsgdGhpcy5kYXRlLnRvTG9jYWxlVGltZVN0cmluZygpLnN1YnN0cmluZygwLCB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCkubGVuZ3RoIC0gMyk7XHJcbiAgICAgIHRoaXMud29ybGQudXBkYXRlKCk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgY29uc29sZS5sb2coXCJzdG9wIGdhbWVcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcbiAgLy9uZXZlciBjYWxsIHRoaXMgb3V0c2lkZSB0aGUgdGltZXIgLSB0aGVuIHdvdWxkIGJlIDIgdXBkYXRlc1xyXG4gIHByaXZhdGUgbmV2ZXJjYWxsdGhpc2Z1bmN0aW9uKCkge1xyXG4gICAgLy92YXIgdD1uZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIHZhciBpbnRlcnZhbGwgPSAxMDAwIC8gdGhpcy5zcGVlZDtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB2YXIgZGlmZiA9IDEwMDAgKiA2MCAqIDYwOy8vdXBkYXRlIGFsd2F5cyBhdCBmdWxsIGNsb2NrLy8oKERhdGUubm93KCkgLSB0aGlzLmxhc3RVcGRhdGUpKSAqIDYwICogNjAgKiB0aGlzLnNwZWVkO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUodGhpcy5kYXRlLmdldFRpbWUoKSArIGRpZmYpO1xyXG4gICAgdGhpcy51cGRhdGVUaXRsZSgpO1xyXG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcclxuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgX3RoaXMubmV2ZXJjYWxsdGhpc2Z1bmN0aW9uKCk7XHJcblxyXG4gICAgfSwgaW50ZXJ2YWxsKTtcclxuICAgIC8vY29uc29sZS5sb2coXCJ0b29rc1wiKyhuZXcgRGF0ZSgpLmdldFRpbWUoKS10KSk7XHJcbiAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKCk7XHJcbiAgICBBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSgpO1xyXG5cclxuICB9XHJcbiAgbmV3R2FtZSgpIHtcclxuICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcclxuICAgIHRoaXMud29ybGQuZ2FtZSA9IHRoaXM7XHJcbiAgICB0aGlzLndvcmxkLm5ld0dhbWUoKTtcclxuICB9XHJcbiAgcmVuZGVyKGRvbTogSFRNTEVsZW1lbnQpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBkb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIHRoaXMuZG9tID0gZG9tO1xyXG4gICAgdmFyIHNkb21IZWFkZXIgPSBgXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjE1cHg7cG9zaXRpb246Zml4ZWQ7XCI+XHJcbiAgICAgICAgICAgIFRyYWZmaWNzIFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiZ2FtZS1zbG93ZXJcIj5gKyBJY29ucy5taW51cyArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICAgIDxzcGFuIGlkPVwiZ2FtZWRhdGVcIj48L3NwYW4+ICAgXHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJnYW1lLWZhc3RlclwiPmArIEljb25zLnBsdXMgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICBNb25leTo8c3BhbiBpZD1cImdhbWVtb25leVwiPjwvc3Bhbj5gKyBJY29ucy5tb25leSArIGBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhdmUtZ2FtZVwiPmArIEljb25zLnNhdmUgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwibG9hZC1nYW1lXCI+YCsgSWNvbnMubG9hZCArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkZWJ1Zy1nYW1lXCI+YCsgSWNvbnMuZGVidWcgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgPC9kaXY+ICBcclxuICAgICAgICBgO1xyXG4gICAgdGhpcy5kb21IZWFkZXIgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb21IZWFkZXIpLmNoaWxkcmVuWzBdO1xyXG5cclxuICAgIHZhciBzZG9tV29ybGQgPSBgXHJcbiAgICAgICAgICA8ZGl2IGlkPVwid29ybGRcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiAxMDAlO2hlaWdodDpjYWxjKDEwMCUgLSAxNXB4KTtcIj5cclxuICAgICAgICAgIDwvZGl2PiAgXHJcbiAgICAgICAgYDtcclxuXHJcbiAgICB0aGlzLmRvbVdvcmxkID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tV29ybGQpLmNoaWxkcmVuWzBdO1xyXG4gICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5kb21IZWFkZXIpO1xyXG4gICAgdmFyIGhlYWRlclBsYWNlZWhvbGRlciA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoJzxkaXYgc3R5bGU9XCJoZWlnaHQ6MTVweFwiPjwvZGl2PicpLmNoaWxkcmVuWzBdXHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChoZWFkZXJQbGFjZWVob2xkZXIpO1xyXG4gICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5kb21Xb3JsZCk7XHJcbiAgICB0aGlzLndvcmxkLnJlbmRlcih0aGlzLmRvbVdvcmxkKTtcclxuXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIF90aGlzLmJpbmRBY3Rpb25zKCk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxuICBiaW5kQWN0aW9ucygpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVkYXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImRvd25cIik7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1nYW1lXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLWdhbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgX3RoaXMubG9hZCgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYnVnLWdhbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgX3RoaXMud29ybGQuYWRkQ2l0eSgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtc2xvd2VyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIGlmIChfdGhpcy5zcGVlZCA9PT0gR2FtZS50ZW1wb3NjYWxlWzBdKSB7XHJcbiAgICAgICAgX3RoaXMucGF1c2UoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInBhdXNlXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB2YXIgcG9zID0gR2FtZS50ZW1wb3NjYWxlLmluZGV4T2YoX3RoaXMuc3BlZWQpO1xyXG4gICAgICBwb3MtLTtcclxuICAgICAgaWYgKHBvcyA9PSAtMSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF90aGlzLnNwZWVkID0gR2FtZS50ZW1wb3NjYWxlW3Bvc107XHJcbiAgICAgIF90aGlzLnBhdXNlKCk7XHJcbiAgICAgIF90aGlzLnJlc3VtZSgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtZmFzdGVyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIGlmIChfdGhpcy5pc1BhdXNlZCgpKSB7XHJcbiAgICAgICAgX3RoaXMucmVzdW1lKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBwb3MgPSBHYW1lLnRlbXBvc2NhbGUuaW5kZXhPZihfdGhpcy5zcGVlZCk7XHJcbiAgICAgIHBvcysrO1xyXG4gICAgICBpZiAocG9zID49IEdhbWUudGVtcG9zY2FsZS5sZW5ndGgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm1heFwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgX3RoaXMuc3BlZWQgPSBHYW1lLnRlbXBvc2NhbGVbcG9zXTtcclxuICAgICAgX3RoaXMucGF1c2UoKTtcclxuICAgICAgX3RoaXMucmVzdW1lKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgc2F2ZSgpIHtcclxuICAgIHRoaXMucGF1c2UoKTtcclxuICAgIHZhciBzZGF0YSA9IEpTT04uc3RyaW5naWZ5KHRoaXMsIChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICB2YXIgcmV0OiBhbnkgPSB7fTtcclxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChrZXkgPT09IFwibGFzdFVwZGF0ZVwiKVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiV29ybGRcIikge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC5nYW1lO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJBaXJwbGFuZVwiKSB7XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC53b3JsZDtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiQ2l0eVwiKSB7XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC53b3JsZDtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiQ29tcGFueVwiKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LmNpdHk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIlJvdXRlXCIpIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LmFpcnBsYW5lO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSwgXCJcXHRcIik7XHJcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzYXZlZ2FtZVwiLCBzZGF0YSk7XHJcbiAgICAvL3RoaXMubG9hZCgpO1xyXG4gICAgY29uc29sZS5sb2coc2RhdGEpO1xyXG4gICAgdGhpcy5yZXN1bWUoKTtcclxuXHJcbiAgfVxyXG4gIGxvYWQoKSB7XHJcbiAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICB2YXIgZGF0YSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdmVnYW1lXCIpO1xyXG4gICAgdmFyIHJldCA9IEpTT04ucGFyc2UoZGF0YSwgKGtleSwgdmFsdWUpID0+IHtcclxuICAgICAgdmFyIHI6IGFueSA9IHZhbHVlO1xyXG4gICAgICBpZiAodmFsdWUgPT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkNvbXBhbnlcIikge1xyXG4gICAgICAgIHIgPSBuZXcgQ29tcGFueSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJBaXJwbGFuZVwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBBaXJwbGFuZSh1bmRlZmluZWQpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJXb3JsZFwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBXb3JsZCgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJDaXR5XCIpIHtcclxuICAgICAgICByID0gbmV3IENpdHkoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiUm91dGVcIikge1xyXG4gICAgICAgIHIgPSBuZXcgUm91dGUoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCByZXQpO1xyXG4gICAgdGhpcy53b3JsZC5nYW1lID0gdGhpcztcclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKHRoaXMuZGF0ZSk7XHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud29ybGQuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgIHRoaXMud29ybGQuYWlycGxhbmVzW3hdLndvcmxkID0gdGhpcy53b3JsZDtcclxuICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLndvcmxkLmFpcnBsYW5lc1t4XS5yb3V0ZS5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgIHRoaXMud29ybGQuYWlycGxhbmVzW3hdLnJvdXRlW3ldLmFpcnBsYW5lID0gdGhpcy53b3JsZC5haXJwbGFuZXNbeF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53b3JsZC5jaXRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgdGhpcy53b3JsZC5jaXRpZXNbeF0ud29ybGQgPSB0aGlzLndvcmxkO1xyXG4gICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXMubGVuZ3RoOyB5KyspIHtcclxuICAgICAgICB0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXNbeV0uY2l0eSA9IHRoaXMud29ybGQuY2l0aWVzW3hdO1xyXG4gICAgICB9XHJcbiAgICAgIC8vZm9yKHZhciB5PTA7eTx0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXMubGVuZ3RoO3krKyl7XHJcbiAgICAgIC8vICB0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXNbeV0uXHJcbiAgICAgIC8vfVxyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXIodGhpcy5kb20pO1xyXG4gICAgdGhpcy5yZXN1bWUoKTtcclxuICB9XHJcbiAgcmVzdW1lKCkge1xyXG4gICAgaWYgKHRoaXMudGltZXIgPT09IDApXHJcbiAgICAgIHRoaXMubmV2ZXJjYWxsdGhpc2Z1bmN0aW9uKCk7XHJcbiAgfVxyXG4gIGlzUGF1c2VkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGltZXIgPT09IDA7XHJcbiAgfVxyXG4gIHBhdXNlKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xyXG4gICAgdGhpcy50aW1lciA9IDA7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95KCkge1xyXG4gICAgdGhpcy53b3JsZC5kZXN0cm95KCk7XHJcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcclxuXHJcbn1cclxuIl19