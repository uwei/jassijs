define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog", "game/icons"], function (require, exports, citydialog_1, world_1, airplanedialog_1, icons_1) {
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
                document.getElementById("gamedate").addEventListener("mousedown", () => {
                    console.log("down");
                });
            }, 500);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsTUFBYSxJQUFJO1FBY2Y7WUFMQSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBR2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEIsY0FBUyxHQUFHLEdBQUcsQ0FBQztZQUVkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDakQsdUJBQVUsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQy9CLENBQUM7UUFDTSxXQUFXO1lBQ2hCLElBQUk7Z0JBQ0YsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN6RixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDckI7WUFBQyxXQUFNO2dCQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3pCLE9BQU87YUFDUjtRQUNILENBQUM7UUFDRCw2REFBNkQ7UUFDckQscUJBQXFCO1lBQzNCLDZCQUE2QjtZQUM3QixJQUFJLFNBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNsQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQSx1RkFBdUY7WUFDakgsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQzNCLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBRWhDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNkLGdEQUFnRDtZQUNoRCx1QkFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xDLCtCQUFjLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFeEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFnQjtZQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFFZixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksVUFBVSxHQUFHOztzRkFFaUUsR0FBRSxhQUFLLENBQUMsS0FBSyxHQUFHOztTQUU3RixDQUFDO1lBQ04sSUFBSSxDQUFDLFNBQVMsR0FBUSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlGLElBQUksU0FBUyxHQUFHOzs7U0FHWCxDQUFDO1lBRU4sSUFBSSxDQUFDLFFBQVEsR0FBUSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVGLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyQyxJQUFJLGtCQUFrQixHQUFNLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMxSCxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFHakMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7b0JBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUNELE1BQU07WUFDSixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQztnQkFDbEIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDakMsQ0FBQztRQUNELFFBQVE7WUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDRCxLQUFLO1lBQ0gsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNqQixDQUFDO1FBRUQsT0FBTztZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDO0tBQ0Y7SUFuR0Qsb0JBbUdDO0lBRUQsU0FBZ0IsSUFBSTtJQUVwQixDQUFDO0lBRkQsb0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCJnYW1lL3dvcmxkXCI7XHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHdpbmRvd3MgZnJvbSBcImphc3NpanMvYmFzZS9XaW5kb3dzXCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lRGlhbG9nIH0gZnJvbSBcImdhbWUvYWlycGxhbmVkaWFsb2dcIjtcclxuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuICBzdGF0aWMgaW5zdGFuY2U6IEdhbWU7XHJcbiAgZG9tOiBIVE1MRWxlbWVudDtcclxuICB3b3JsZDogV29ybGQ7XHJcbiAgZG9tSGVhZGVyOiBIVE1MRGl2RWxlbWVudDtcclxuICBkb21Xb3JsZDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgbW9uZXk7XHJcbiAgZGF0ZTogRGF0ZTtcclxuICBsYXN0VXBkYXRlOiBudW1iZXI7XHJcbiAgc3BlZWQ6IG51bWJlciA9IDE7XHJcbiAgcGF1c2VkU3BlZWQ6IG51bWJlcjtcclxuICB0aW1lcjtcclxuICBtYXBXaWR0aCA9IDEwMDA7XHJcbiAgbWFwSGVpZ2h0ID0gNjAwO1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIEdhbWUuaW5zdGFuY2UgPSB0aGlzO1xyXG4gICAgdGhpcy5tb25leSA9IDIwMDAwMDA7XHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoXCJTYXQgSmFuIDAxIDIwMDAgMDA6MDA6MDBcIik7XHJcbiAgICBDaXR5RGlhbG9nLmluc3RhbmNlID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuICB9XHJcbiAgcHVibGljIHVwZGF0ZVRpdGxlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lbW9uZXlcIikuaW5uZXJIVE1MID0gbmV3IE51bWJlcih0aGlzLm1vbmV5KS50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVkYXRlXCIpLmlubmVySFRNTCA9IHRoaXMuZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSArIFwiIFwiICsgdGhpcy5kYXRlLnRvTG9jYWxlVGltZVN0cmluZygpLnN1YnN0cmluZygwLCB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCkubGVuZ3RoIC0gMyk7XHJcbiAgICAgIHRoaXMud29ybGQudXBkYXRlKCk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgY29uc29sZS5sb2coXCJzdG9wIGdhbWVcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcbiAgLy9uZXZlciBjYWxsIHRoaXMgb3V0c2lkZSB0aGUgdGltZXIgLSB0aGVuIHdvdWxkIGJlIDIgdXBkYXRlc1xyXG4gIHByaXZhdGUgbmV2ZXJjYWxsdGhpc2Z1bmN0aW9uKCkge1xyXG4gICAgLy92YXIgdD1uZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIHZhciBpbnRlcnZhbGwgPSAxMDAwIC8gdGhpcy5zcGVlZDtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB2YXIgZGlmZiA9IDEwMDAgKiA2MCAqIDYwOy8vdXBkYXRlIGFsd2F5cyBhdCBmdWxsIGNsb2NrLy8oKERhdGUubm93KCkgLSB0aGlzLmxhc3RVcGRhdGUpKSAqIDYwICogNjAgKiB0aGlzLnNwZWVkO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUodGhpcy5kYXRlLmdldFRpbWUoKSArIGRpZmYpO1xyXG4gICAgdGhpcy51cGRhdGVUaXRsZSgpO1xyXG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcclxuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgX3RoaXMubmV2ZXJjYWxsdGhpc2Z1bmN0aW9uKCk7XHJcblxyXG4gICAgfSwgaW50ZXJ2YWxsKTtcclxuICAgIC8vY29uc29sZS5sb2coXCJ0b29rc1wiKyhuZXcgRGF0ZSgpLmdldFRpbWUoKS10KSk7XHJcbiAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKCk7XHJcbiAgICBBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSgpO1xyXG5cclxuICB9XHJcbiAgY3JlYXRlKGRvbTogSFRNTEVsZW1lbnQpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB0aGlzLmRvbSA9IGRvbTtcclxuXHJcbiAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XHJcbiAgICB0aGlzLndvcmxkLmdhbWUgPSB0aGlzO1xyXG4gICAgdmFyIHNkb21IZWFkZXIgPSBgXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjE1cHg7cG9zaXRpb246Zml4ZWQ7XCI+XHJcbiAgICAgICAgICAgIFRyYWZmaWNzIDxzcGFuIGlkPVwiZ2FtZWRhdGVcIj48L3NwYW4+ICAgTW9uZXk6PHNwYW4gaWQ9XCJnYW1lbW9uZXlcIj48L3NwYW4+YCsgSWNvbnMubW9uZXkgKyBgXHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIGA7XHJcbiAgICB0aGlzLmRvbUhlYWRlciA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbUhlYWRlcikuY2hpbGRyZW5bMF07XHJcblxyXG4gICAgdmFyIHNkb21Xb3JsZCA9IGBcclxuICAgICAgICAgIDxkaXYgaWQ9XCJ3b3JsZFwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6IDEwMCU7aGVpZ2h0OmNhbGMoMTAwJSAtIDE1cHgpO1wiPlxyXG4gICAgICAgICAgPC9kaXY+ICBcclxuICAgICAgICBgO1xyXG5cclxuICAgIHRoaXMuZG9tV29ybGQgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb21Xb3JsZCkuY2hpbGRyZW5bMF07XHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmRvbUhlYWRlcik7XHJcbiAgICB2YXIgaGVhZGVyUGxhY2VlaG9sZGVyPTxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoJzxkaXYgc3R5bGU9XCJoZWlnaHQ6MTVweFwiPjwvZGl2PicpLmNoaWxkcmVuWzBdXHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChoZWFkZXJQbGFjZWVob2xkZXIpO1xyXG4gICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQodGhpcy5kb21Xb3JsZCk7XHJcbiAgICB0aGlzLndvcmxkLmNyZWF0ZSh0aGlzLmRvbVdvcmxkKTtcclxuXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJkb3duXCIpO1xyXG4gICAgICB9KTtcclxuICAgIH0sIDUwMCk7XHJcbiAgfVxyXG4gIHJlc3VtZSgpIHtcclxuICAgIGlmICh0aGlzLnRpbWVyID09PSAwKVxyXG4gICAgICB0aGlzLm5ldmVyY2FsbHRoaXNmdW5jdGlvbigpO1xyXG4gIH1cclxuICBpc1BhdXNlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRpbWVyID09PSAwO1xyXG4gIH1cclxuICBwYXVzZSgpIHtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcclxuICAgIHRoaXMudGltZXIgPSAwO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSgpIHtcclxuICAgIHRoaXMud29ybGQuZGVzdHJveSgpO1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKXtcclxuXHJcbn1cclxuIl19