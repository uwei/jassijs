define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog", "game/icons", "game/company"], function (require, exports, citydialog_1, world_1, airplanedialog_1, icons_1, company_1) {
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
        create(dom) {
            var _this = this;
            this.dom = dom;
            this.world = new world_1.World();
            this.world.game = this;
            var sdomHeader = `
          <div style="height:15px;position:fixed;">
            Traffics <span id="gamedate"></span>   Money:<span id="gamemoney"></span>` + icons_1.Icons.money + `
            <button id="save-game">` + icons_1.Icons.save + `</button> 
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
            this.world.create(this.domWorld);
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
        }
        save() {
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
            this.load(sdata);
            console.log(sdata);
        }
        load(data) {
            var ret = JSON.parse(data, (key, value) => {
                var r = value;
                if ((value === null || value === void 0 ? void 0 : value.type) === "Company") {
                    r = new company_1.Company();
                    Object.assign(r, value);
                    return r;
                }
                return r;
            });
            debugger;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBU0EsTUFBYSxJQUFJO1FBY2Y7WUFMQSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEIsY0FBUyxHQUFHLEdBQUcsQ0FBQztZQUVkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDakQsdUJBQVUsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQy9CLENBQUM7UUFDTSxXQUFXO1lBQ2hCLElBQUk7Z0JBQ0YsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN6RixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDckI7WUFBQyxXQUFN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LENBQUM7S0FDRjtJQXJKRCxvQkFxSkM7SUFFRCxTQUFnQixJQUFJO0lBRXBCLENBQUM7SUFGRCxvQkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImdhbWUvd29ybGRcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgQWlycGxhbmVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBJY29ucyB9IGZyb20gXCJnYW1lL2ljb25zXCI7XHJcbmltcG9ydCB7IENvbXBhbnkgfSBmcm9tIFwiZ2FtZS9jb21wYW55XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gIHN0YXRpYyBpbnN0YW5jZTogR2FtZTtcclxuICBkb206IEhUTUxFbGVtZW50O1xyXG4gIHdvcmxkOiBXb3JsZDtcclxuICBkb21IZWFkZXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGRvbVdvcmxkOiBIVE1MRGl2RWxlbWVudDtcclxuICBtb25leTtcclxuICBkYXRlOiBEYXRlO1xyXG4gIGxhc3RVcGRhdGU6IG51bWJlcjtcclxuICBzcGVlZDogbnVtYmVyID0gMTtcclxuICBwYXVzZWRTcGVlZDogbnVtYmVyO1xyXG4gIHRpbWVyO1xyXG4gIG1hcFdpZHRoID0gMTAwMDtcclxuICBtYXBIZWlnaHQgPSA2MDA7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgR2FtZS5pbnN0YW5jZSA9IHRoaXM7XHJcbiAgICB0aGlzLm1vbmV5ID0gMjAwMDAwMDtcclxuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZShcIlNhdCBKYW4gMDEgMjAwMCAwMDowMDowMFwiKTtcclxuICAgIENpdHlEaWFsb2cuaW5zdGFuY2UgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLm5ldmVyY2FsbHRoaXNmdW5jdGlvbigpO1xyXG4gIH1cclxuICBwdWJsaWMgdXBkYXRlVGl0bGUoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVtb25leVwiKS5pbm5lckhUTUwgPSBuZXcgTnVtYmVyKHRoaXMubW9uZXkpLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuaW5uZXJIVE1MID0gdGhpcy5kYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpICsgXCIgXCIgKyB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCkuc3Vic3RyaW5nKDAsIHRoaXMuZGF0ZS50b0xvY2FsZVRpbWVTdHJpbmcoKS5sZW5ndGggLSAzKTtcclxuICAgICAgdGhpcy53b3JsZC51cGRhdGUoKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInN0b3AgZ2FtZVwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxuICAvL25ldmVyIGNhbGwgdGhpcyBvdXRzaWRlIHRoZSB0aW1lciAtIHRoZW4gd291bGQgYmUgMiB1cGRhdGVzXHJcbiAgcHJpdmF0ZSBuZXZlcmNhbGx0aGlzZnVuY3Rpb24oKSB7XHJcbiAgICAvL3ZhciB0PW5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgdmFyIGludGVydmFsbCA9IDEwMDAgLyB0aGlzLnNwZWVkO1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIHZhciBkaWZmID0gMTAwMCAqIDYwICogNjA7Ly91cGRhdGUgYWx3YXlzIGF0IGZ1bGwgY2xvY2svLygoRGF0ZS5ub3coKSAtIHRoaXMubGFzdFVwZGF0ZSkpICogNjAgKiA2MCAqIHRoaXMuc3BlZWQ7XHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZSh0aGlzLmRhdGUuZ2V0VGltZSgpICsgZGlmZik7XHJcbiAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBfdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuXHJcbiAgICB9LCBpbnRlcnZhbGwpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcInRvb2tzXCIrKG5ldyBEYXRlKCkuZ2V0VGltZSgpLXQpKTtcclxuICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcclxuICAgIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKCk7XHJcblxyXG4gIH1cclxuICBjcmVhdGUoZG9tOiBIVE1MRWxlbWVudCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIHRoaXMuZG9tID0gZG9tO1xyXG5cclxuICAgIHRoaXMud29ybGQgPSBuZXcgV29ybGQoKTtcclxuICAgIHRoaXMud29ybGQuZ2FtZSA9IHRoaXM7XHJcbiAgICB2YXIgc2RvbUhlYWRlciA9IGBcclxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6MTVweDtwb3NpdGlvbjpmaXhlZDtcIj5cclxuICAgICAgICAgICAgVHJhZmZpY3MgPHNwYW4gaWQ9XCJnYW1lZGF0ZVwiPjwvc3Bhbj4gICBNb25leTo8c3BhbiBpZD1cImdhbWVtb25leVwiPjwvc3Bhbj5gKyBJY29ucy5tb25leSArIGBcclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhdmUtZ2FtZVwiPmArIEljb25zLnNhdmUgKyBgPC9idXR0b24+IFxyXG4gICAgICAgICAgPC9kaXY+ICBcclxuICAgICAgICBgO1xyXG4gICAgdGhpcy5kb21IZWFkZXIgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb21IZWFkZXIpLmNoaWxkcmVuWzBdO1xyXG5cclxuICAgIHZhciBzZG9tV29ybGQgPSBgXHJcbiAgICAgICAgICA8ZGl2IGlkPVwid29ybGRcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOiAxMDAlO2hlaWdodDpjYWxjKDEwMCUgLSAxNXB4KTtcIj5cclxuICAgICAgICAgIDwvZGl2PiAgXHJcbiAgICAgICAgYDtcclxuXHJcbiAgICB0aGlzLmRvbVdvcmxkID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tV29ybGQpLmNoaWxkcmVuWzBdO1xyXG4gICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5kb21IZWFkZXIpO1xyXG4gICAgdmFyIGhlYWRlclBsYWNlZWhvbGRlciA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoJzxkaXYgc3R5bGU9XCJoZWlnaHQ6MTVweFwiPjwvZGl2PicpLmNoaWxkcmVuWzBdXHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChoZWFkZXJQbGFjZWVob2xkZXIpO1xyXG4gICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5kb21Xb3JsZCk7XHJcbiAgICB0aGlzLndvcmxkLmNyZWF0ZSh0aGlzLmRvbVdvcmxkKTtcclxuXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIF90aGlzLmJpbmRBY3Rpb25zKCk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxuICBiaW5kQWN0aW9ucygpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVkYXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImRvd25cIik7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1nYW1lXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBzYXZlKCkge1xyXG4gICAgdmFyIHNkYXRhID0gSlNPTi5zdHJpbmdpZnkodGhpcywgKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgIHZhciByZXQ6YW55PXt9O1xyXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYoa2V5PT09XCJsYXN0VXBkYXRlXCIpXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJXb3JsZFwiKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsdmFsdWUpO1xyXG4gICAgICAgIGRlbGV0ZSByZXQuZ2FtZTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiQWlycGxhbmVcIikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LndvcmxkO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJDaXR5XCIpIHtcclxuICAgICAgIFxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LHZhbHVlKTtcclxuICAgICAgICBkZWxldGUgcmV0LndvcmxkO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSwgXCJcXHRcIik7XHJcbiAgICB0aGlzLmxvYWQoc2RhdGEpO1xyXG4gICAgY29uc29sZS5sb2coc2RhdGEpO1xyXG4gIH1cclxuICBsb2FkKGRhdGE6c3RyaW5nKXtcclxuICAgIHZhciByZXQ9SlNPTi5wYXJzZShkYXRhLChrZXksdmFsdWUpPT57XHJcbiAgICAgIHZhciByPXZhbHVlO1xyXG4gICAgICBpZih2YWx1ZT8udHlwZT09PVwiQ29tcGFueVwiKXtcclxuICAgICAgICByPW5ldyBDb21wYW55KCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyLHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH0pO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgfVxyXG4gIHJlc3VtZSgpIHtcclxuICAgIGlmICh0aGlzLnRpbWVyID09PSAwKVxyXG4gICAgICB0aGlzLm5ldmVyY2FsbHRoaXNmdW5jdGlvbigpO1xyXG4gIH1cclxuICBpc1BhdXNlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRpbWVyID09PSAwO1xyXG4gIH1cclxuICBwYXVzZSgpIHtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcclxuICAgIHRoaXMudGltZXIgPSAwO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSgpIHtcclxuICAgIHRoaXMud29ybGQuZGVzdHJveSgpO1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKSB7XHJcblxyXG59XHJcbiJdfQ==