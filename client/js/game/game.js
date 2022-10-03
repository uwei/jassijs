define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog"], function (require, exports, citydialog_1, world_1, airplanedialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Game = void 0;
    class Game {
        constructor() {
            this.speed = 1;
            var _this = this;
            Game.instance = this;
            this.money = 20000;
            this.lastUpdate = Date.now();
            this.date = new Date("Sat Jan 01 2000 00:00:00");
            citydialog_1.CityDialog.instance = undefined;
        }
        update() {
            var _this = this;
            var diff = ((Date.now() - this.lastUpdate)) * 60 * 60 * this.speed;
            this.date = new Date(this.date.getTime() + diff);
            try {
                document.getElementById("gamemoney").innerHTML = this.money;
                document.getElementById("gamedate").innerHTML = this.date.toLocaleDateString() + " " + this.date.toLocaleTimeString();
                this.world.update();
            }
            catch (_a) {
                console.log("stop game");
                return;
            }
            this.lastUpdate = Date.now();
            setTimeout(() => {
                _this.update();
            }, 1000);
            citydialog_1.CityDialog.getInstance().update();
            airplanedialog_1.AirplaneDialog.getInstance().update();
        }
        create(dom) {
            var _this = this;
            this.dom = dom;
            this.world = new world_1.World();
            this.world.game = this;
            var sdomHeader = `
          <div style="height:15px">
            Traffics <span id="gamedate"></span>   Money:<span id="gamemoney"></span>
          </div>  
        `;
            this.domHeader = document.createRange().createContextualFragment(sdomHeader).children[0];
            var sdomWorld = `
          <div id="world" style="position:relative;width: 100%;height:calc(100% - 15px);">
          </div>  
        `;
            this.domWorld = document.createRange().createContextualFragment(sdomWorld).children[0];
            this.dom.appendChild(this.domHeader);
            this.dom.appendChild(this.domWorld);
            this.world.create(this.domWorld);
            this.update();
            setTimeout(() => {
                document.getElementById("gamedate").addEventListener("mousedown", () => {
                    console.log("down");
                });
            }, 500);
        }
        resume() {
            if (this.pausedSpeed !== undefined) {
                this.speed = this.pausedSpeed;
                this.pausedSpeed = undefined;
            }
        }
        isPaused() {
            return this.pausedSpeed != undefined;
        }
        pause() {
            if (this.pausedSpeed !== undefined)
                return;
            this.pausedSpeed = this.speed;
            this.speed = 0.0000000000000000000001;
        }
        destroy() {
            this.world.destroy();
        }
    }
    exports.Game = Game;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBTUEsTUFBYSxJQUFJO1FBV2Y7WUFGQSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBR2hCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDakQsdUJBQVUsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQ2xDLENBQUM7UUFDRCxNQUFNO1lBQ0osSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ25FLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNqRCxJQUFHO2dCQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzVELFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUN0SCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ25CO1lBQUEsV0FBSztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6QixPQUFPO2FBQ1I7WUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVqQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDVCx1QkFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xDLCtCQUFjLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFeEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFnQjtZQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFFZixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksVUFBVSxHQUFHOzs7O1NBSVosQ0FBQztZQUNOLElBQUksQ0FBQyxTQUFTLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU5RixJQUFJLFNBQVMsR0FBRzs7O1NBR1gsQ0FBQztZQUVOLElBQUksQ0FBQyxRQUFRLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVqQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxVQUFVLENBQUMsR0FBRSxFQUFFO2dCQUNiLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFDLEdBQUUsRUFBRTtvQkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDVCxDQUFDO1FBQ0QsTUFBTTtZQUNKLElBQUcsSUFBSSxDQUFDLFdBQVcsS0FBRyxTQUFTLEVBQUM7Z0JBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBQyxTQUFTLENBQUM7YUFDNUI7UUFFSCxDQUFDO1FBQ0QsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDLFdBQVcsSUFBSSxTQUFTLENBQUM7UUFDdkMsQ0FBQztRQUNELEtBQUs7WUFDSCxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUztnQkFDaEMsT0FBTztZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLHdCQUF3QixDQUFDO1FBQ3hDLENBQUM7UUFFRCxPQUFPO1lBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN2QixDQUFDO0tBQ0Y7SUExRkQsb0JBMEZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiZ2FtZS93b3JsZFwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZURpYWxvZyB9IGZyb20gXCJnYW1lL2FpcnBsYW5lZGlhbG9nXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcbiAgc3RhdGljIGluc3RhbmNlOiBHYW1lO1xyXG4gIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgd29ybGQ6IFdvcmxkO1xyXG4gIGRvbUhlYWRlcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgZG9tV29ybGQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gIG1vbmV5O1xyXG4gIGRhdGU6IERhdGU7XHJcbiAgbGFzdFVwZGF0ZTogbnVtYmVyO1xyXG4gIHNwZWVkOiBudW1iZXIgPSAxO1xyXG4gIHBhdXNlZFNwZWVkOiBudW1iZXI7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgR2FtZS5pbnN0YW5jZSA9IHRoaXM7XHJcbiAgICB0aGlzLm1vbmV5ID0gMjAwMDA7XHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoXCJTYXQgSmFuIDAxIDIwMDAgMDA6MDA6MDBcIik7XHJcbiAgICBDaXR5RGlhbG9nLmluc3RhbmNlID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuICB1cGRhdGUoKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgdmFyIGRpZmYgPSAoKERhdGUubm93KCkgLSB0aGlzLmxhc3RVcGRhdGUpKSAqIDYwICogNjAgKiB0aGlzLnNwZWVkO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUodGhpcy5kYXRlLmdldFRpbWUoKSArIGRpZmYpO1xyXG4gICAgdHJ5e1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lbW9uZXlcIikuaW5uZXJIVE1MID0gdGhpcy5tb25leTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuaW5uZXJIVE1MID0gdGhpcy5kYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpICsgXCIgXCIgKyB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCk7XHJcbiAgICB0aGlzLndvcmxkLnVwZGF0ZSgpO1xyXG4gICAgfWNhdGNoe1xyXG4gICAgICBjb25zb2xlLmxvZyhcInN0b3AgZ2FtZVwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBfdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICB9LCAxMDAwKTtcclxuICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcclxuICAgIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKCk7XHJcbiAgICBcclxuICB9XHJcbiAgY3JlYXRlKGRvbTogSFRNTEVsZW1lbnQpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB0aGlzLmRvbSA9IGRvbTtcclxuXHJcbiAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XHJcbiAgICB0aGlzLndvcmxkLmdhbWUgPSB0aGlzO1xyXG4gICAgdmFyIHNkb21IZWFkZXIgPSBgXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjE1cHhcIj5cclxuICAgICAgICAgICAgVHJhZmZpY3MgPHNwYW4gaWQ9XCJnYW1lZGF0ZVwiPjwvc3Bhbj4gICBNb25leTo8c3BhbiBpZD1cImdhbWVtb25leVwiPjwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PiAgXHJcbiAgICAgICAgYDtcclxuICAgIHRoaXMuZG9tSGVhZGVyID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tSGVhZGVyKS5jaGlsZHJlblswXTtcclxuICAgIFxyXG4gICAgdmFyIHNkb21Xb3JsZCA9IGBcclxuICAgICAgICAgIDxkaXYgaWQ9XCJ3b3JsZFwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6IDEwMCU7aGVpZ2h0OmNhbGMoMTAwJSAtIDE1cHgpO1wiPlxyXG4gICAgICAgICAgPC9kaXY+ICBcclxuICAgICAgICBgO1xyXG5cclxuICAgIHRoaXMuZG9tV29ybGQgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb21Xb3JsZCkuY2hpbGRyZW5bMF07XHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmRvbUhlYWRlcik7XHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmRvbVdvcmxkKTtcclxuICAgIHRoaXMud29ybGQuY3JlYXRlKHRoaXMuZG9tV29ybGQpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCgpPT57XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJkb3duXCIpO1xyXG4gICAgICB9KTtcclxuICAgIH0sNTAwKTtcclxuICB9XHJcbiAgcmVzdW1lKCkge1xyXG4gICAgaWYodGhpcy5wYXVzZWRTcGVlZCE9PXVuZGVmaW5lZCl7XHJcbiAgICAgIHRoaXMuc3BlZWQ9dGhpcy5wYXVzZWRTcGVlZDtcclxuICAgICAgdGhpcy5wYXVzZWRTcGVlZD11bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBcclxuICB9XHJcbiAgaXNQYXVzZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wYXVzZWRTcGVlZCAhPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIHBhdXNlKCkge1xyXG4gICAgaWYgKHRoaXMucGF1c2VkU3BlZWQgIT09IHVuZGVmaW5lZClcclxuICAgICAgcmV0dXJuO1xyXG4gICAgdGhpcy5wYXVzZWRTcGVlZCA9IHRoaXMuc3BlZWQ7XHJcbiAgICB0aGlzLnNwZWVkID0gMC4wMDAwMDAwMDAwMDAwMDAwMDAwMDAxO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSgpIHtcclxuICAgIHRoaXMud29ybGQuZGVzdHJveSgpO1xyXG4gIH1cclxufVxyXG4iXX0=