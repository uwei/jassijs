define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog", "game/icons", "game/company", "game/airplane", "game/city"], function (require, exports, citydialog_1, world_1, airplanedialog_1, icons_1, company_1, airplane_1, city_1) {
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
            Traffics <span id="gamedate"></span>   Money:<span id="gamemoney"></span>` + icons_1.Icons.money + `
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
        }
        save() {
            this.pause();
            var sdata = JSON.stringify(this, (key, value) => {
                var _a, _b, _c;
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
                return r;
            });
            Object.assign(this, ret);
            this.world.game = this;
            this.date = new Date(this.date);
            for (var x = 0; x < this.world.airplanes.length; x++) {
                this.world.airplanes[x].world = this.world;
            }
            for (var x = 0; x < this.world.cities.length; x++) {
                this.world.cities[x].world = this.world;
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
    function test() {
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBV0EsTUFBYSxJQUFJO1FBY2Y7WUFMQSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEIsY0FBUyxHQUFHLEdBQUcsQ0FBQztZQUVkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDakQsdUJBQVUsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQy9CLENBQUM7UUFDTSxXQUFXO1lBQ2hCLElBQUk7Z0JBQ0YsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN6RixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDckI7WUFBQyxXQUFN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QUMzQixDQUFDO0tBQ0Y7SUFuTUQsb0JBbU1DO0lBRUQsU0FBZ0IsSUFBSTtJQUVwQixDQUFDO0lBRkQsb0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCJnYW1lL3dvcmxkXCI7XHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHdpbmRvd3MgZnJvbSBcImphc3NpanMvYmFzZS9XaW5kb3dzXCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lRGlhbG9nIH0gZnJvbSBcImdhbWUvYWlycGxhbmVkaWFsb2dcIjtcclxuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xyXG5pbXBvcnQgeyBDb21wYW55IH0gZnJvbSBcImdhbWUvY29tcGFueVwiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZSB9IGZyb20gXCJnYW1lL2FpcnBsYW5lXCI7XHJcbmltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gIHN0YXRpYyBpbnN0YW5jZTogR2FtZTtcclxuICBkb206IEhUTUxFbGVtZW50O1xyXG4gIHdvcmxkOiBXb3JsZDtcclxuICBkb21IZWFkZXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGRvbVdvcmxkOiBIVE1MRGl2RWxlbWVudDtcclxuICBtb25leTtcclxuICBkYXRlOiBEYXRlO1xyXG4gIGxhc3RVcGRhdGU6IG51bWJlcjtcclxuICBzcGVlZDogbnVtYmVyID0gMTtcclxuICBwYXVzZWRTcGVlZDogbnVtYmVyO1xyXG4gIHRpbWVyO1xyXG4gIG1hcFdpZHRoID0gMTAwMDtcclxuICBtYXBIZWlnaHQgPSA2MDA7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgR2FtZS5pbnN0YW5jZSA9IHRoaXM7XHJcbiAgICB0aGlzLm1vbmV5ID0gMjAwMDAwMDtcclxuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZShcIlNhdCBKYW4gMDEgMjAwMCAwMDowMDowMFwiKTtcclxuICAgIENpdHlEaWFsb2cuaW5zdGFuY2UgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLm5ldmVyY2FsbHRoaXNmdW5jdGlvbigpO1xyXG4gIH1cclxuICBwdWJsaWMgdXBkYXRlVGl0bGUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVtb25leVwiKS5pbm5lckhUTUwgPSBuZXcgTnVtYmVyKHRoaXMubW9uZXkpLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuaW5uZXJIVE1MID0gdGhpcy5kYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpICsgXCIgXCIgKyB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCkuc3Vic3RyaW5nKDAsIHRoaXMuZGF0ZS50b0xvY2FsZVRpbWVTdHJpbmcoKS5sZW5ndGggLSAzKTtcclxuICAgICAgdGhpcy53b3JsZC51cGRhdGUoKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInN0b3AgZ2FtZVwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuICAvL25ldmVyIGNhbGwgdGhpcyBvdXRzaWRlIHRoZSB0aW1lciAtIHRoZW4gd291bGQgYmUgMiB1cGRhdGVzXHJcbiAgcHJpdmF0ZSBuZXZlcmNhbGx0aGlzZnVuY3Rpb24oKSB7XHJcbiAgICAvL3ZhciB0PW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgdmFyIGludGVydmFsbCA9IDEwMDAgLyB0aGlzLnNwZWVkO1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIHZhciBkaWZmID0gMTAwMCAqIDYwICogNjA7Ly91cGRhdGUgYWx3YXlzIGF0IGZ1bGwgY2xvY2svLygoRGF0ZS5ub3coKSAtIHRoaXMubGFzdFVwZGF0ZSkpICogNjAgKiA2MCAqIHRoaXMuc3BlZWQ7XHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZSh0aGlzLmRhdGUuZ2V0VGltZSgpICsgZGlmZik7XHJcbiAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBfdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuXHJcbiAgICB9LCBpbnRlcnZhbGwpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcInRvb2tzXCIrKG5ldyBEYXRlKCkuZ2V0VGltZSgpLXQpKTtcclxuICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcclxuICAgIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKCk7XHJcblxyXG4gIH1cclxuICBuZXdHYW1lKCkge1xyXG4gICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG4gICAgdGhpcy53b3JsZC5nYW1lID0gdGhpcztcclxuICAgIHRoaXMud29ybGQubmV3R2FtZSgpO1xyXG4gIH1cclxuICByZW5kZXIoZG9tOiBIVE1MRWxlbWVudCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIGRvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgdGhpcy5kb20gPSBkb207XHJcbiAgICB2YXIgc2RvbUhlYWRlciA9IGBcclxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6MTVweDtwb3NpdGlvbjpmaXhlZDtcIj5cclxuICAgICAgICAgICAgVHJhZmZpY3MgPHNwYW4gaWQ9XCJnYW1lZGF0ZVwiPjwvc3Bhbj4gICBNb25leTo8c3BhbiBpZD1cImdhbWVtb25leVwiPjwvc3Bhbj5gKyBJY29ucy5tb25leSArIGBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhdmUtZ2FtZVwiPmArIEljb25zLnNhdmUgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwibG9hZC1nYW1lXCI+YCsgSWNvbnMubG9hZCArIGA8L2J1dHRvbj4gXHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkZWJ1Zy1nYW1lXCI+YCsgSWNvbnMuZGVidWcgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgPC9kaXY+ICBcclxuICAgICAgICBgO1xyXG4gICAgdGhpcy5kb21IZWFkZXIgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb21IZWFkZXIpLmNoaWxkcmVuWzBdO1xyXG5cclxuICAgIHZhciBzZG9tV29ybGQgPSBgXHJcbiAgICAgICAgICA8ZGl2IGlkPVwid29ybGRcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiAxMDAlO2hlaWdodDpjYWxjKDEwMCUgLSAxNXB4KTtcIj5cclxuICAgICAgICAgIDwvZGl2PiAgXHJcbiAgICAgICAgYDtcclxuXHJcbiAgICB0aGlzLmRvbVdvcmxkID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tV29ybGQpLmNoaWxkcmVuWzBdO1xyXG4gICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5kb21IZWFkZXIpO1xyXG4gICAgdmFyIGhlYWRlclBsYWNlZWhvbGRlciA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoJzxkaXYgc3R5bGU9XCJoZWlnaHQ6MTVweFwiPjwvZGl2PicpLmNoaWxkcmVuWzBdXHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChoZWFkZXJQbGFjZWVob2xkZXIpO1xyXG4gICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5kb21Xb3JsZCk7XHJcbiAgICB0aGlzLndvcmxkLnJlbmRlcih0aGlzLmRvbVdvcmxkKTtcclxuXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIF90aGlzLmJpbmRBY3Rpb25zKCk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxuICBiaW5kQWN0aW9ucygpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVkYXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImRvd25cIik7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1nYW1lXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLWdhbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgX3RoaXMubG9hZCgpO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYnVnLWdhbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgX3RoaXMud29ybGQuYWRkQ2l0eSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHNhdmUoKSB7XHJcbiAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICB2YXIgc2RhdGEgPSBKU09OLnN0cmluZ2lmeSh0aGlzLCAoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgdmFyIHJldDogYW55ID0ge307XHJcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoa2V5ID09PSBcImxhc3RVcGRhdGVcIilcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIldvcmxkXCIpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQuZ2FtZTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiQWlycGxhbmVcIikge1xyXG5cclxuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQud29ybGQ7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIkNpdHlcIikge1xyXG5cclxuICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQud29ybGQ7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9LCBcIlxcdFwiKTtcclxuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNhdmVnYW1lXCIsIHNkYXRhKTtcclxuICAgIC8vdGhpcy5sb2FkKCk7XHJcbiAgICBjb25zb2xlLmxvZyhzZGF0YSk7XHJcbiAgICB0aGlzLnJlc3VtZSgpO1xyXG5cclxuICB9XHJcbiAgbG9hZCgpIHtcclxuICAgIHRoaXMucGF1c2UoKTtcclxuICAgIHZhciBkYXRhID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F2ZWdhbWVcIik7XHJcbiAgICB2YXIgcmV0ID0gSlNPTi5wYXJzZShkYXRhLCAoa2V5LCB2YWx1ZSkgPT4ge1xyXG4gICAgICB2YXIgcjogYW55ID0gdmFsdWU7XHJcbiAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJDb21wYW55XCIpIHtcclxuICAgICAgICByID0gbmV3IENvbXBhbnkoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiQWlycGxhbmVcIikge1xyXG4gICAgICAgIHIgPSBuZXcgQWlycGxhbmUodW5kZWZpbmVkKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiV29ybGRcIikge1xyXG4gICAgICAgIHIgPSBuZXcgV29ybGQoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiQ2l0eVwiKSB7XHJcbiAgICAgICAgciA9IG5ldyBDaXR5KCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyLCB2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHI7XHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgcmV0KTtcclxuICAgIHRoaXMud29ybGQuZ2FtZSA9IHRoaXM7XHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZSh0aGlzLmRhdGUpO1xyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndvcmxkLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICB0aGlzLndvcmxkLmFpcnBsYW5lc1t4XS53b3JsZCA9IHRoaXMud29ybGQ7XHJcblxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndvcmxkLmNpdGllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICB0aGlzLndvcmxkLmNpdGllc1t4XS53b3JsZCA9IHRoaXMud29ybGQ7XHJcbiAgICAgIC8vZm9yKHZhciB5PTA7eTx0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXMubGVuZ3RoO3krKyl7XHJcbiAgICAgIC8vICB0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXNbeV0uXHJcbiAgICAgIC8vfVxyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXIodGhpcy5kb20pO1xyXG4gICAgdGhpcy5yZXN1bWUoKTtcclxuICB9XHJcbiAgcmVzdW1lKCkge1xyXG4gICAgaWYgKHRoaXMudGltZXIgPT09IDApXHJcbiAgICAgIHRoaXMubmV2ZXJjYWxsdGhpc2Z1bmN0aW9uKCk7XHJcbiAgfVxyXG4gIGlzUGF1c2VkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGltZXIgPT09IDA7XHJcbiAgfVxyXG4gIHBhdXNlKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xyXG4gICAgdGhpcy50aW1lciA9IDA7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95KCkge1xyXG4gICAgdGhpcy53b3JsZC5kZXN0cm95KCk7XHJcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcclxuXHJcbn1cclxuIl19