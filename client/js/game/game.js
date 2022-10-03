define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog"], function (require, exports, citydialog_1, world_1, airplanedialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Game = void 0;
    class Game {
        constructor() {
            this.speed = 1;
            this.refreshIntervall = 1000;
            var _this = this;
            Game.instance = this;
            this.money = 20000;
            this.lastUpdate = Date.now();
            this.date = new Date("Sat Jan 01 2000 00:00:00");
            citydialog_1.CityDialog.instance = undefined;
        }
        update() {
            //var t=new Date().getTime();
            var _this = this;
            var diff = 1000 * 60 * 60 * this.speed; //((Date.now() - this.lastUpdate)) * 60 * 60 * this.speed;
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
            }, this.refreshIntervall);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBTUEsTUFBYSxJQUFJO1FBWWY7WUFIQSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBRWxCLHFCQUFnQixHQUFDLElBQUksQ0FBQztZQUVwQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ2pELHVCQUFVLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsTUFBTTtZQUNKLDZCQUE2QjtZQUU3QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBLDBEQUEwRDtZQUM1RixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDakQsSUFBSTtnQkFDRixRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUM1RCxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDdEgsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNyQjtZQUFDLFdBQU07Z0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDekIsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFakIsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzFCLGdEQUFnRDtZQUNoRCx1QkFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xDLCtCQUFjLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFeEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFnQjtZQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFFZixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksVUFBVSxHQUFHOzs7O1NBSVosQ0FBQztZQUNOLElBQUksQ0FBQyxTQUFTLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU5RixJQUFJLFNBQVMsR0FBRzs7O1NBR1gsQ0FBQztZQUVOLElBQUksQ0FBQyxRQUFRLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVqQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtvQkFDckUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDVixDQUFDO1FBQ0QsTUFBTTtZQUNKLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7YUFDOUI7UUFFSCxDQUFDO1FBQ0QsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDLFdBQVcsSUFBSSxTQUFTLENBQUM7UUFDdkMsQ0FBQztRQUNELEtBQUs7WUFDSCxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUztnQkFDaEMsT0FBTztZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLHdCQUF3QixDQUFDO1FBQ3hDLENBQUM7UUFFRCxPQUFPO1lBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN2QixDQUFDO0tBQ0Y7SUE5RkQsb0JBOEZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiZ2FtZS93b3JsZFwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZURpYWxvZyB9IGZyb20gXCJnYW1lL2FpcnBsYW5lZGlhbG9nXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcbiAgc3RhdGljIGluc3RhbmNlOiBHYW1lO1xyXG4gIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgd29ybGQ6IFdvcmxkO1xyXG4gIGRvbUhlYWRlcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgZG9tV29ybGQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gIG1vbmV5O1xyXG4gIGRhdGU6IERhdGU7XHJcbiAgbGFzdFVwZGF0ZTogbnVtYmVyO1xyXG4gIHNwZWVkOiBudW1iZXIgPSAxO1xyXG4gIHBhdXNlZFNwZWVkOiBudW1iZXI7XHJcbiAgcmVmcmVzaEludGVydmFsbD0xMDAwO1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIEdhbWUuaW5zdGFuY2UgPSB0aGlzO1xyXG4gICAgdGhpcy5tb25leSA9IDIwMDAwO1xyXG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKFwiU2F0IEphbiAwMSAyMDAwIDAwOjAwOjAwXCIpO1xyXG4gICAgQ2l0eURpYWxvZy5pbnN0YW5jZSA9IHVuZGVmaW5lZDtcclxuICB9XHJcbiAgdXBkYXRlKCkge1xyXG4gICAgLy92YXIgdD1uZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgdmFyIGRpZmYgPSAxMDAwKjYwKjYwKiB0aGlzLnNwZWVkOy8vKChEYXRlLm5vdygpIC0gdGhpcy5sYXN0VXBkYXRlKSkgKiA2MCAqIDYwICogdGhpcy5zcGVlZDtcclxuICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKHRoaXMuZGF0ZS5nZXRUaW1lKCkgKyBkaWZmKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZW1vbmV5XCIpLmlubmVySFRNTCA9IHRoaXMubW9uZXk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWRhdGVcIikuaW5uZXJIVE1MID0gdGhpcy5kYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpICsgXCIgXCIgKyB0aGlzLmRhdGUudG9Mb2NhbGVUaW1lU3RyaW5nKCk7XHJcbiAgICAgIHRoaXMud29ybGQudXBkYXRlKCk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgY29uc29sZS5sb2coXCJzdG9wIGdhbWVcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMubGFzdFVwZGF0ZSA9IERhdGUubm93KCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgX3RoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgfSwgdGhpcy5yZWZyZXNoSW50ZXJ2YWxsKTtcclxuICAgIC8vY29uc29sZS5sb2coXCJ0b29rc1wiKyhuZXcgRGF0ZSgpLmdldFRpbWUoKS10KSk7XHJcbiAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKCk7XHJcbiAgICBBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSgpO1xyXG5cclxuICB9XHJcbiAgY3JlYXRlKGRvbTogSFRNTEVsZW1lbnQpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB0aGlzLmRvbSA9IGRvbTtcclxuXHJcbiAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XHJcbiAgICB0aGlzLndvcmxkLmdhbWUgPSB0aGlzO1xyXG4gICAgdmFyIHNkb21IZWFkZXIgPSBgXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjE1cHhcIj5cclxuICAgICAgICAgICAgVHJhZmZpY3MgPHNwYW4gaWQ9XCJnYW1lZGF0ZVwiPjwvc3Bhbj4gICBNb25leTo8c3BhbiBpZD1cImdhbWVtb25leVwiPjwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PiAgXHJcbiAgICAgICAgYDtcclxuICAgIHRoaXMuZG9tSGVhZGVyID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tSGVhZGVyKS5jaGlsZHJlblswXTtcclxuXHJcbiAgICB2YXIgc2RvbVdvcmxkID0gYFxyXG4gICAgICAgICAgPGRpdiBpZD1cIndvcmxkXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDogMTAwJTtoZWlnaHQ6Y2FsYygxMDAlIC0gMTVweCk7XCI+XHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgdGhpcy5kb21Xb3JsZCA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbVdvcmxkKS5jaGlsZHJlblswXTtcclxuICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZG9tSGVhZGVyKTtcclxuICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHRoaXMuZG9tV29ybGQpO1xyXG4gICAgdGhpcy53b3JsZC5jcmVhdGUodGhpcy5kb21Xb3JsZCk7XHJcblxyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVkYXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZG93blwiKTtcclxuICAgICAgfSk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxuICByZXN1bWUoKSB7XHJcbiAgICBpZiAodGhpcy5wYXVzZWRTcGVlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLnBhdXNlZFNwZWVkO1xyXG4gICAgICB0aGlzLnBhdXNlZFNwZWVkID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbiAgaXNQYXVzZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wYXVzZWRTcGVlZCAhPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIHBhdXNlKCkge1xyXG4gICAgaWYgKHRoaXMucGF1c2VkU3BlZWQgIT09IHVuZGVmaW5lZClcclxuICAgICAgcmV0dXJuO1xyXG4gICAgdGhpcy5wYXVzZWRTcGVlZCA9IHRoaXMuc3BlZWQ7XHJcbiAgICB0aGlzLnNwZWVkID0gMC4wMDAwMDAwMDAwMDAwMDAwMDAwMDAxO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSgpIHtcclxuICAgIHRoaXMud29ybGQuZGVzdHJveSgpO1xyXG4gIH1cclxufVxyXG4iXX0=