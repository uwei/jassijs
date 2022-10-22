define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog", "game/icons", "game/company", "game/airplane", "game/city", "game/route", "game/product"], function (require, exports, citydialog_1, world_1, airplanedialog_1, icons_1, company_1, airplane_1, city_1, route_1, product_1) {
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
            console.log(change + " " + why);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBWUEsTUFBTSxDQUFDLGNBQWMsR0FBRztRQUNsQixPQUFPLHNCQUFzQixDQUFDO0lBRXBDLENBQUMsQ0FBQztJQUNGLE1BQWEsSUFBSTtRQWVmO1lBTkEsVUFBSyxHQUFXLENBQUMsQ0FBQztZQUdsQixhQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLGNBQVMsR0FBRyxHQUFHLENBQUM7WUFHZCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFFckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ2pELHVCQUFVLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztZQUNoQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMvQixDQUFDO1FBQ00sV0FBVztZQUNoQixJQUFJO2dCQUNGLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUM5RixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlLLElBQUksQ0FBQyxLQUFLLENB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QyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDN0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDckU7YUFDRjtZQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUN2QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDL0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0Q7Z0JBQ0QsMkRBQTJEO2dCQUMzRCxzQ0FBc0M7Z0JBQ3RDLEdBQUc7YUFDSjtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixDQUFDO1FBQ0QsTUFBTTtZQUNKLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDO2dCQUNsQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNqQyxDQUFDO1FBQ0QsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUM7UUFDMUIsQ0FBQztRQUNELEtBQUs7WUFDSCxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxPQUFPO1lBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQixZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUM7O0lBL1FILG9CQWdSQztJQWxRUSxlQUFVLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQW9ROUQsU0FBZ0IsSUFBSTtJQUVwQixDQUFDO0lBRkQsb0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCJnYW1lL3dvcmxkXCI7XHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHdpbmRvd3MgZnJvbSBcImphc3NpanMvYmFzZS9XaW5kb3dzXCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lRGlhbG9nIH0gZnJvbSBcImdhbWUvYWlycGxhbmVkaWFsb2dcIjtcclxuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xyXG5pbXBvcnQgeyBDb21wYW55IH0gZnJvbSBcImdhbWUvY29tcGFueVwiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZSB9IGZyb20gXCJnYW1lL2FpcnBsYW5lXCI7XHJcbmltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XHJcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSBcImdhbWUvcm91dGVcIjtcclxuaW1wb3J0IHsgYWxsUHJvZHVjdHMgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XHJcblxyXG53aW5kb3cub25iZWZvcmV1bmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIFwiRG8geW91IHdhbnQgdG8gZXhpdD9cIjtcclxuXHJcbn07XHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuICBzdGF0aWMgaW5zdGFuY2U6IEdhbWU7XHJcbiAgZG9tOiBIVE1MRWxlbWVudDtcclxuICB3b3JsZDogV29ybGQ7XHJcbiAgZG9tSGVhZGVyOiBIVE1MRGl2RWxlbWVudDtcclxuICBkb21Xb3JsZDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgX21vbmV5O1xyXG4gIGRhdGU6IERhdGU7XHJcbiAgbGFzdFVwZGF0ZTogbnVtYmVyO1xyXG4gIHNwZWVkOiBudW1iZXIgPSAxO1xyXG4gIHBhdXNlZFNwZWVkOiBudW1iZXI7XHJcbiAgdGltZXI7XHJcbiAgbWFwV2lkdGggPSAxMDAwO1xyXG4gIG1hcEhlaWdodCA9IDYwMDtcclxuICBzdGF0aWMgdGVtcG9zY2FsZSA9IFswLjAxLCAwLjUsIDEsIDIsIDQsIDgsIDE2LCAzMiwgNjQsIDEyOF1cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBHYW1lLmluc3RhbmNlID0gdGhpcztcclxuICAgIFxyXG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKFwiU2F0IEphbiAwMSAyMDAwIDAwOjAwOjAwXCIpO1xyXG4gICAgQ2l0eURpYWxvZy5pbnN0YW5jZSA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMubmV2ZXJjYWxsdGhpc2Z1bmN0aW9uKCk7XHJcbiAgfVxyXG4gIHB1YmxpYyB1cGRhdGVUaXRsZSgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZW1vbmV5XCIpLmlubmVySFRNTCA9IG5ldyBOdW1iZXIodGhpcy5nZXRNb25leSgpKS50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVkYXRlXCIpLmlubmVySFRNTCA9IHRoaXMuZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSArIFwiIFwiICsgdGhpcy5kYXRlLnRvTG9jYWxlVGltZVN0cmluZygpLnN1YnN0cmluZygwLCB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCkubGVuZ3RoIC0gMyk7XHJcbiAgICAgIHRoaXMud29ybGQudXBkYXRlKCk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgY29uc29sZS5sb2coXCJzdG9wIGdhbWVcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcbiAgdXBkYXRlU2l6ZSgpe1xyXG4gICAgdGhpcy5kb21Xb3JsZC5zdHlsZS53aWR0aD0odGhpcy5tYXBXaWR0aCs4MCkrXCJweFwiOyBcclxuICAgIHRoaXMuZG9tV29ybGQuc3R5bGUuaGVpZ2h0PSh0aGlzLm1hcEhlaWdodCsxMDApK1wicHhcIjsgXHJcbiAgICAoPEhUTUxFbGVtZW50PiB0aGlzLmRvbVdvcmxkLnBhcmVudE5vZGUpLnN0eWxlLndpZHRoPSh0aGlzLm1hcFdpZHRoKzgwKStcInB4XCI7IFxyXG4gICAgKDxIVE1MRWxlbWVudD4gdGhpcy5kb21Xb3JsZC5wYXJlbnROb2RlKS5zdHlsZS5oZWlnaHQ9KHRoaXMubWFwSGVpZ2h0KzEwMCkrXCJweFwiOyBcclxuICAgIFxyXG4gIH1cclxuICAvL25ldmVyIGNhbGwgdGhpcyBvdXRzaWRlIHRoZSB0aW1lciAtIHRoZW4gd291bGQgYmUgMiB1cGRhdGVzXHJcbiAgcHJpdmF0ZSBuZXZlcmNhbGx0aGlzZnVuY3Rpb24oKSB7XHJcbiAgICAvL3ZhciB0PW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgdmFyIGludGVydmFsbCA9IDEwMDAgLyB0aGlzLnNwZWVkO1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIHZhciBkaWZmID0gMTAwMCAqIDYwICogNjA7Ly91cGRhdGUgYWx3YXlzIGF0IGZ1bGwgY2xvY2svLygoRGF0ZS5ub3coKSAtIHRoaXMubGFzdFVwZGF0ZSkpICogNjAgKiA2MCAqIHRoaXMuc3BlZWQ7XHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZSh0aGlzLmRhdGUuZ2V0VGltZSgpICsgZGlmZik7XHJcbiAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBfdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuXHJcbiAgICB9LCBpbnRlcnZhbGwpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcInRvb2tzXCIrKG5ldyBEYXRlKCkuZ2V0VGltZSgpLXQpKTtcclxuICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcclxuICAgIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKCk7XHJcblxyXG4gIH1cclxuICBuZXdHYW1lKCkge1xyXG4gICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG4gICAgdGhpcy53b3JsZC5nYW1lID0gdGhpczsgXHJcbiAgICB0aGlzLl9tb25leSA9IDIwMDAwO1xyXG4gICAgdGhpcy53b3JsZC5uZXdHYW1lKCk7XHJcbiAgfVxyXG4gIGdldE1vbmV5KCl7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9uZXk7XHJcbiAgfVxyXG4gIGNoYW5nZU1vbmV5KGNoYW5nZTpudW1iZXIsd2h5OnN0cmluZyxjaXR5OkNpdHk9dW5kZWZpbmVkKXtcclxuICAgIHRoaXMuX21vbmV5Kz1jaGFuZ2U7XHJcbiAgICBjb25zb2xlLmxvZyhjaGFuZ2UrXCIgXCIrd2h5KTtcclxuICB9XHJcbiAgcmVuZGVyKGRvbTogSFRNTEVsZW1lbnQpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBkb20uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIGRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9XCJsaWdodGJsdWVcIjtcclxuICAgIHRoaXMuZG9tID0gZG9tO1xyXG4gICAgdmFyIHNkb21IZWFkZXIgPSBgXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjE1cHg7cG9zaXRpb246Zml4ZWQ7ei1pbmRleDoxMDAwMDtiYWNrZ3JvdW5kLWNvbG9yOmxpZ2h0Ymx1ZTtcIj5cclxuICAgICAgICAgICAgVHJhZmZpY3MgXHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJnYW1lLXNsb3dlclwiPmArIEljb25zLm1pbnVzICsgYDwvYnV0dG9uPiBcclxuICAgICAgICAgICAgPHNwYW4gaWQ9XCJnYW1lZGF0ZVwiPjwvc3Bhbj4gICBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImdhbWUtZmFzdGVyXCI+YCsgSWNvbnMucGx1cyArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICAgIE1vbmV5OjxzcGFuIGlkPVwiZ2FtZW1vbmV5XCI+PC9zcGFuPmArIEljb25zLm1vbmV5ICsgYFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwic2F2ZS1nYW1lXCI+YCsgSWNvbnMuc2F2ZSArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkZWJ1Zy1nYW1lXCI+YCsgSWNvbnMuZGVidWcgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwibG9hZC1nYW1lXCI+YCsgSWNvbnMubG9hZCArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIGA7XHJcbiAgICB0aGlzLmRvbUhlYWRlciA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbUhlYWRlcikuY2hpbGRyZW5bMF07XHJcblxyXG4gICAgdmFyIHNkb21Xb3JsZCA9IGBcclxuICAgICAgICAgIDxkaXYgaWQ9XCJ3b3JsZFwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7dG9wOjIwcHg7XCI+XHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgdGhpcy5kb21Xb3JsZCA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbVdvcmxkKS5jaGlsZHJlblswXTtcclxuICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZG9tSGVhZGVyKTtcclxuICAgLy8gdmFyIGhlYWRlclBsYWNlZWhvbGRlciA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoJzxkaXYgc3R5bGU9XCJoZWlnaHQ6MTVweFwiPjwvZGl2PicpLmNoaWxkcmVuWzBdXHJcbiAgIC8vIHRoaXMuZG9tLmFwcGVuZENoaWxkKGhlYWRlclBsYWNlZWhvbGRlcik7XHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmRvbVdvcmxkKTtcclxuICAgIHRoaXMud29ybGQucmVuZGVyKHRoaXMuZG9tV29ybGQpO1xyXG4gICAgdGhpcy51cGRhdGVTaXplKCk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIF90aGlzLmJpbmRBY3Rpb25zKCk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxuICBiaW5kQWN0aW9ucygpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVkYXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImRvd25cIik7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1nYW1lXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLWdhbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgX3RoaXMubG9hZCgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYnVnLWdhbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgX3RoaXMud29ybGQuYWRkQ2l0eSgpO1xyXG4gICAgICBmb3IodmFyIHg9MDt4PGFsbFByb2R1Y3RzLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgIF90aGlzLndvcmxkLmNpdGllc1swXS53YXJlaG91c2VbeF09NTAwMDtcclxuICAgICAgfVxyXG4gICAgICBfdGhpcy5fbW9uZXk9MTAwMDAwO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtc2xvd2VyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIGlmIChfdGhpcy5zcGVlZCA9PT0gR2FtZS50ZW1wb3NjYWxlWzBdKSB7XHJcbiAgICAgICAgX3RoaXMucGF1c2UoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInBhdXNlXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB2YXIgcG9zID0gR2FtZS50ZW1wb3NjYWxlLmluZGV4T2YoX3RoaXMuc3BlZWQpO1xyXG4gICAgICBwb3MtLTtcclxuICAgICAgaWYgKHBvcyA9PSAtMSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF90aGlzLnNwZWVkID0gR2FtZS50ZW1wb3NjYWxlW3Bvc107XHJcbiAgICAgIF90aGlzLnBhdXNlKCk7XHJcbiAgICAgIF90aGlzLnJlc3VtZSgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtZmFzdGVyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIGlmIChfdGhpcy5pc1BhdXNlZCgpKSB7XHJcbiAgICAgICAgX3RoaXMucmVzdW1lKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBwb3MgPSBHYW1lLnRlbXBvc2NhbGUuaW5kZXhPZihfdGhpcy5zcGVlZCk7XHJcbiAgICAgIHBvcysrO1xyXG4gICAgICBpZiAocG9zID49IEdhbWUudGVtcG9zY2FsZS5sZW5ndGgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm1heFwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgX3RoaXMuc3BlZWQgPSBHYW1lLnRlbXBvc2NhbGVbcG9zXTtcclxuICAgICAgX3RoaXMucGF1c2UoKTtcclxuICAgICAgX3RoaXMucmVzdW1lKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgc2F2ZSgpIHtcclxuICAgIHRoaXMucGF1c2UoKTtcclxuICAgIHZhciBzZGF0YSA9IEpTT04uc3RyaW5naWZ5KHRoaXMsIChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICB2YXIgcmV0OiBhbnkgPSB7fTtcclxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChrZXkgPT09IFwibGFzdFVwZGF0ZVwiKVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiV29ybGRcIikge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC5nYW1lO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJBaXJwbGFuZVwiKSB7XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC53b3JsZDtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiQ2l0eVwiKSB7XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgZGVsZXRlIHJldC53b3JsZDtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiQ29tcGFueVwiKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LmNpdHk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIlJvdXRlXCIpIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LmFpcnBsYW5lO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSwgXCJcXHRcIik7XHJcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzYXZlZ2FtZVwiLCBzZGF0YSk7XHJcbiAgICAvL3RoaXMubG9hZCgpO1xyXG4gICAgY29uc29sZS5sb2coc2RhdGEpO1xyXG4gICAgdGhpcy5yZXN1bWUoKTtcclxuXHJcbiAgfVxyXG4gIGxvYWQoKSB7XHJcbiAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICB2YXIgZGF0YSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdmVnYW1lXCIpO1xyXG4gICAgdmFyIHJldCA9IEpTT04ucGFyc2UoZGF0YSwgKGtleSwgdmFsdWUpID0+IHtcclxuICAgICAgdmFyIHI6IGFueSA9IHZhbHVlO1xyXG4gICAgICBpZiAodmFsdWUgPT09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkNvbXBhbnlcIikge1xyXG4gICAgICAgIHIgPSBuZXcgQ29tcGFueSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJBaXJwbGFuZVwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBBaXJwbGFuZSh1bmRlZmluZWQpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJXb3JsZFwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBXb3JsZCgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJDaXR5XCIpIHtcclxuICAgICAgICByID0gbmV3IENpdHkoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiUm91dGVcIikge1xyXG4gICAgICAgIHIgPSBuZXcgUm91dGUoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCByZXQpO1xyXG4gICAgdGhpcy53b3JsZC5nYW1lID0gdGhpcztcclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKHRoaXMuZGF0ZSk7XHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud29ybGQuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgIHRoaXMud29ybGQuYWlycGxhbmVzW3hdLndvcmxkID0gdGhpcy53b3JsZDtcclxuICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLndvcmxkLmFpcnBsYW5lc1t4XS5yb3V0ZS5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgIHRoaXMud29ybGQuYWlycGxhbmVzW3hdLnJvdXRlW3ldLmFpcnBsYW5lID0gdGhpcy53b3JsZC5haXJwbGFuZXNbeF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53b3JsZC5jaXRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgdGhpcy53b3JsZC5jaXRpZXNbeF0ud29ybGQgPSB0aGlzLndvcmxkO1xyXG4gICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXMubGVuZ3RoOyB5KyspIHtcclxuICAgICAgICB0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXNbeV0uY2l0eSA9IHRoaXMud29ybGQuY2l0aWVzW3hdO1xyXG4gICAgICB9XHJcbiAgICAgIC8vZm9yKHZhciB5PTA7eTx0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXMubGVuZ3RoO3krKyl7XHJcbiAgICAgIC8vICB0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXNbeV0uXHJcbiAgICAgIC8vfVxyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXIodGhpcy5kb20pO1xyXG4gICAgdGhpcy5yZXN1bWUoKTtcclxuICB9XHJcbiAgcmVzdW1lKCkge1xyXG4gICAgaWYgKHRoaXMudGltZXIgPT09IDApXHJcbiAgICAgIHRoaXMubmV2ZXJjYWxsdGhpc2Z1bmN0aW9uKCk7XHJcbiAgfVxyXG4gIGlzUGF1c2VkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGltZXIgPT09IDA7XHJcbiAgfVxyXG4gIHBhdXNlKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xyXG4gICAgdGhpcy50aW1lciA9IDA7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95KCkge1xyXG4gICAgdGhpcy53b3JsZC5kZXN0cm95KCk7XHJcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcclxuXHJcbn1cclxuIl19