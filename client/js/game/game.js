define(["require", "exports", "game/citydialog", "game/world", "game/airplanedialog", "game/icons"], function (require, exports, citydialog_1, world_1, airplanedialog_1, icons_1) {
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
            this.nevercallthisfunction();
        }
        updateTitle() {
            try {
                document.getElementById("gamemoney").innerHTML = this.money;
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
          <div style="height:15px">
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBT0EsTUFBYSxJQUFJO1FBWWY7WUFIQSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBSWhCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDakQsdUJBQVUsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQy9CLENBQUM7UUFDTSxXQUFXO1lBQ2hCLElBQUk7Z0JBQ0YsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDNUQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM5SyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3JCO1lBQUMsV0FBTTtnQkFDTixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6QixPQUFPO2FBQ1I7UUFDSCxDQUFDO1FBQ0QsNkRBQTZEO1FBQ3JELHFCQUFxQjtZQUMzQiw2QkFBNkI7WUFDN0IsSUFBSSxTQUFTLEdBQUUsSUFBSSxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUU7WUFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUEsdUZBQXVGO1lBQ2pILElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUN6QixLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUVoQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDZCxnREFBZ0Q7WUFDaEQsdUJBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQywrQkFBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXhDLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBZ0I7WUFDckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBRWYsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLFVBQVUsR0FBRzs7c0ZBRWlFLEdBQUMsYUFBSyxDQUFDLEtBQUssR0FBQzs7U0FFMUYsQ0FBQztZQUNOLElBQUksQ0FBQyxTQUFTLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU5RixJQUFJLFNBQVMsR0FBRzs7O1NBR1gsQ0FBQztZQUVOLElBQUksQ0FBQyxRQUFRLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUdqQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtvQkFDckUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDVixDQUFDO1FBQ0QsTUFBTTtZQUNKLElBQUcsSUFBSSxDQUFDLEtBQUssS0FBRyxDQUFDO2dCQUNoQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNoQyxDQUFDO1FBQ0QsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBRyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUNELEtBQUs7WUFDSixZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDO1FBQ2QsQ0FBQztRQUVELE9BQU87WUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQztLQUNGO0lBL0ZELG9CQStGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImdhbWUvd29ybGRcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgQWlycGxhbmVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBJY29ucyB9IGZyb20gXCJnYW1lL2ljb25zXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcbiAgc3RhdGljIGluc3RhbmNlOiBHYW1lO1xyXG4gIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgd29ybGQ6IFdvcmxkO1xyXG4gIGRvbUhlYWRlcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgZG9tV29ybGQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gIG1vbmV5O1xyXG4gIGRhdGU6IERhdGU7XHJcbiAgbGFzdFVwZGF0ZTogbnVtYmVyO1xyXG4gIHNwZWVkOiBudW1iZXIgPSAxO1xyXG4gIHBhdXNlZFNwZWVkOiBudW1iZXI7XHJcbiAgdGltZXI7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgR2FtZS5pbnN0YW5jZSA9IHRoaXM7XHJcbiAgICB0aGlzLm1vbmV5ID0gMjAwMDA7XHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy5kYXRlID0gbmV3IERhdGUoXCJTYXQgSmFuIDAxIDIwMDAgMDA6MDA6MDBcIik7XHJcbiAgICBDaXR5RGlhbG9nLmluc3RhbmNlID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuICB9XHJcbiAgcHVibGljIHVwZGF0ZVRpdGxlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lbW9uZXlcIikuaW5uZXJIVE1MID0gdGhpcy5tb25leTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lZGF0ZVwiKS5pbm5lckhUTUwgPSB0aGlzLmRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCkgKyBcIiBcIiArIHRoaXMuZGF0ZS50b0xvY2FsZVRpbWVTdHJpbmcoKS5zdWJzdHJpbmcoMCwgdGhpcy5kYXRlLnRvTG9jYWxlVGltZVN0cmluZygpLmxlbmd0aCAtIDMpO1xyXG4gICAgICB0aGlzLndvcmxkLnVwZGF0ZSgpO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwic3RvcCBnYW1lXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vbmV2ZXIgY2FsbCB0aGlzIG91dHNpZGUgdGhlIHRpbWVyIC0gdGhlbiB3b3VsZCBiZSAyIHVwZGF0ZXNcclxuICBwcml2YXRlIG5ldmVyY2FsbHRoaXNmdW5jdGlvbigpIHtcclxuICAgIC8vdmFyIHQ9bmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB2YXIgaW50ZXJ2YWxsID0xMDAwL3RoaXMuc3BlZWQgO1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIHZhciBkaWZmID0gMTAwMCAqIDYwICogNjA7Ly91cGRhdGUgYWx3YXlzIGF0IGZ1bGwgY2xvY2svLygoRGF0ZS5ub3coKSAtIHRoaXMubGFzdFVwZGF0ZSkpICogNjAgKiA2MCAqIHRoaXMuc3BlZWQ7XHJcbiAgICB0aGlzLmRhdGUgPSBuZXcgRGF0ZSh0aGlzLmRhdGUuZ2V0VGltZSgpICsgZGlmZik7XHJcbiAgdGhpcy51cGRhdGVUaXRsZSgpO1xyXG4gICAgdGhpcy5sYXN0VXBkYXRlID0gRGF0ZS5ub3coKTtcclxuICAgIHRoaXMudGltZXI9c2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIF90aGlzLm5ldmVyY2FsbHRoaXNmdW5jdGlvbigpO1xyXG5cclxuICAgIH0sIGludGVydmFsbCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKFwidG9va3NcIisobmV3IERhdGUoKS5nZXRUaW1lKCktdCkpO1xyXG4gICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSgpO1xyXG4gICAgQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcclxuXHJcbiAgfVxyXG4gIGNyZWF0ZShkb206IEhUTUxFbGVtZW50KSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgdGhpcy5kb20gPSBkb207XHJcblxyXG4gICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG4gICAgdGhpcy53b3JsZC5nYW1lID0gdGhpcztcclxuICAgIHZhciBzZG9tSGVhZGVyID0gYFxyXG4gICAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDoxNXB4XCI+XHJcbiAgICAgICAgICAgIFRyYWZmaWNzIDxzcGFuIGlkPVwiZ2FtZWRhdGVcIj48L3NwYW4+ICAgTW9uZXk6PHNwYW4gaWQ9XCJnYW1lbW9uZXlcIj48L3NwYW4+YCtJY29ucy5tb25leStgXHJcbiAgICAgICAgICA8L2Rpdj4gIFxyXG4gICAgICAgIGA7XHJcbiAgICB0aGlzLmRvbUhlYWRlciA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbUhlYWRlcikuY2hpbGRyZW5bMF07XHJcblxyXG4gICAgdmFyIHNkb21Xb3JsZCA9IGBcclxuICAgICAgICAgIDxkaXYgaWQ9XCJ3b3JsZFwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6IDEwMCU7aGVpZ2h0OmNhbGMoMTAwJSAtIDE1cHgpO1wiPlxyXG4gICAgICAgICAgPC9kaXY+ICBcclxuICAgICAgICBgO1xyXG5cclxuICAgIHRoaXMuZG9tV29ybGQgPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb21Xb3JsZCkuY2hpbGRyZW5bMF07XHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmRvbUhlYWRlcik7XHJcbiAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZCh0aGlzLmRvbVdvcmxkKTtcclxuICAgIHRoaXMud29ybGQuY3JlYXRlKHRoaXMuZG9tV29ybGQpO1xyXG5cclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lZGF0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsICgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImRvd25cIik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSwgNTAwKTtcclxuICB9XHJcbiAgcmVzdW1lKCkge1xyXG4gICAgaWYodGhpcy50aW1lcj09PTApXHJcbiAgICAgdGhpcy5uZXZlcmNhbGx0aGlzZnVuY3Rpb24oKTtcclxuICB9XHJcbiAgaXNQYXVzZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50aW1lcj09PTA7XHJcbiAgfVxyXG4gIHBhdXNlKCkge1xyXG4gICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgIHRoaXMudGltZXI9MDtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLndvcmxkLmRlc3Ryb3koKTtcclxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcclxuICB9XHJcbn1cclxuIl19