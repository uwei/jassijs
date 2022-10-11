define(["require", "exports", "game/city", "game/airplane", "game/citydialog", "game/airplanedialog"], function (require, exports, city_1, airplane_1, citydialog_1, airplanedialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.World = void 0;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    class World {
        constructor() {
            this.type = "World";
            var _this = this;
            this.cities = [];
            this.airplanes = [];
            this._intervall = setInterval(() => {
                var _a;
                for (var x = 0; x < ((_a = _this.airplanes) === null || _a === void 0 ? void 0 : _a.length); x++) {
                    /*if (this.airplanes[x].x < 500)
                        this.airplanes[x].x = this.airplanes[x].x + 1;
                    else {
                        this.airplanes[x].x = 100;
                    }*/
                    _this.airplanes[x].update();
                }
            }, 100);
        }
        getElementOffset(el) {
            let top = 0;
            let left = 0;
            let element = el;
            // Loop through the DOM tree
            // and add it's parent's offset to get page offset
            do {
                top += element.offsetTop || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while (element);
            return {
                top,
                left,
            };
        }
        oncontextmenu(evt) {
            evt.preventDefault();
            /*
                     if(this.selection){
                         var pt=this.getElementOffset(evt.currentTarget);
                        (<Airplane>this.selection).flyTo(evt.x-pt.left-8,evt.y-pt.top-10);
                        console.log(evt.offsetX);
                    }*/
        }
        onclick(th) {
            var _a;
            console.log("close");
            (_a = this.selection) === null || _a === void 0 ? void 0 : _a.unselect();
            if (th.target === this.dom && !airplanedialog_1.AirplaneDialog.getInstance().dropCitiesEnabled) {
                try {
                    citydialog_1.CityDialog.getInstance().close();
                }
                catch (_b) {
                }
                try {
                    airplanedialog_1.AirplaneDialog.getInstance().close();
                }
                catch (_c) {
                }
            }
        }
        update() {
            var _a;
            for (var x = 0; x < ((_a = this.cities) === null || _a === void 0 ? void 0 : _a.length); x++) {
                /*if (this.airplanes[x].x < 500)
                    this.airplanes[x].x = this.airplanes[x].x + 1;
                else {
                    this.airplanes[x].x = 100;
                }*/
                this.cities[x].update();
            }
        }
        addCity() {
            var city = (0, city_1.createCities)(this, 1)[0];
            city.render(this.cities.indexOf(city));
            city.update();
        }
        newGame() {
            (0, city_1.createCities)(this, 5);
            for (var x = 0; x < 40; x++) {
                var ap = new airplane_1.Airplane(this);
                ap.name = "Airplane " + x;
                ap.speed = 200;
                ap.x = getRandomInt(this.game.mapWidth);
                ap.y = getRandomInt(this.game.mapHeight);
                ap.world = this;
                this.airplanes.push(ap);
            }
            this.cities[0].houses = 1;
            this.cities[0].warehouses = 1;
        }
        render(dom) {
            var _this = this;
            this.dom = dom;
            for (var x = 0; x < this.cities.length; x++) {
                this.cities[x].render(x);
                this.cities[x].update();
            }
            for (var x = 0; x < this.airplanes.length; x++) {
                var ap = this.airplanes[x];
                ap.render();
                this.dom.appendChild(ap.dom);
            }
            dom.addEventListener("click", (ev) => {
                _this.onclick(ev);
                return undefined;
            });
            dom.addEventListener("contextmenu", (ev) => {
                _this.oncontextmenu(ev);
                return undefined;
            });
        }
        findCityAt(x, y) {
            for (var i = 0; i < this.cities.length; i++) {
                if (this.cities[i].x === x && this.cities[i].y === y) {
                    return this.cities[i];
                }
            }
            return undefined;
        }
        destroy() {
            clearInterval(this._intervall);
        }
    }
    exports.World = World;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3dvcmxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFPQSxTQUFTLFlBQVksQ0FBQyxHQUFHO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELE1BQWEsS0FBSztRQVFkO1lBREEsU0FBSSxHQUFHLE9BQU8sQ0FBQztZQUVYLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUU7O2dCQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUcsTUFBQSxLQUFLLENBQUMsU0FBUywwQ0FBRSxNQUFNLENBQUEsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDOUM7Ozs7dUJBSUc7b0JBQ0gsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDL0I7WUFDTCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFHWixDQUFDO1FBQ08sZ0JBQWdCLENBQUMsRUFBRTtZQUN2QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFFakIsNEJBQTRCO1lBQzVCLGtEQUFrRDtZQUNsRCxHQUFHO2dCQUNDLEdBQUcsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxJQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxPQUFPLEdBQUcsT0FBTyxD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QUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3pCO2FBQ0o7WUFDRCxPQUFPLFNBQVMsQ0FBQztRQUNyQixDQUFDO1FBQ0QsT0FBTztZQUNILGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsQ0FBQztLQUNKO0lBeElELHNCQXdJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHsgQ2l0eSwgY3JlYXRlQ2l0aWVzIH0gZnJvbSBcImdhbWUvY2l0eVwiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZSB9IGZyb20gXCJnYW1lL2FpcnBsYW5lXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcImdhbWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZURpYWxvZyB9IGZyb20gXCJnYW1lL2FpcnBsYW5lZGlhbG9nXCI7XHJcbmZ1bmN0aW9uIGdldFJhbmRvbUludChtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBXb3JsZCB7XHJcbiAgICBfaW50ZXJ2YWxsO1xyXG4gICAgY2l0aWVzOiBDaXR5W107XHJcbiAgICBhaXJwbGFuZXM6IEFpcnBsYW5lW107XHJcbiAgICBzZWxlY3Rpb247XHJcbiAgICBkb206IEhUTUxFbGVtZW50O1xyXG4gICAgZ2FtZTogR2FtZTtcclxuICAgIHR5cGUgPSBcIldvcmxkXCI7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzID0gW107XHJcbiAgICAgICAgdGhpcy5haXJwbGFuZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9pbnRlcnZhbGwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgX3RoaXMuYWlycGxhbmVzPy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgLyppZiAodGhpcy5haXJwbGFuZXNbeF0ueCA8IDUwMClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gdGhpcy5haXJwbGFuZXNbeF0ueCArIDE7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZXNbeF0udXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDApO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEVsZW1lbnRPZmZzZXQoZWwpIHtcclxuICAgICAgICBsZXQgdG9wID0gMDtcclxuICAgICAgICBsZXQgbGVmdCA9IDA7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBlbDtcclxuXHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBET00gdHJlZVxyXG4gICAgICAgIC8vIGFuZCBhZGQgaXQncyBwYXJlbnQncyBvZmZzZXQgdG8gZ2V0IHBhZ2Ugb2Zmc2V0XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3AgfHwgMDtcclxuICAgICAgICAgICAgbGVmdCArPSBlbGVtZW50Lm9mZnNldExlZnQgfHwgMDtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgIH0gd2hpbGUgKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0b3AsXHJcbiAgICAgICAgICAgIGxlZnQsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIG9uY29udGV4dG1lbnUoZXZ0OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICBpZih0aGlzLnNlbGVjdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgIHZhciBwdD10aGlzLmdldEVsZW1lbnRPZmZzZXQoZXZ0LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICg8QWlycGxhbmU+dGhpcy5zZWxlY3Rpb24pLmZseVRvKGV2dC54LXB0LmxlZnQtOCxldnQueS1wdC50b3AtMTApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2dC5vZmZzZXRYKTtcclxuICAgICAgICAgICAgICAgIH0qL1xyXG5cclxuICAgIH1cclxuICAgIG9uY2xpY2sodGg6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsb3NlXCIpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uPy51bnNlbGVjdCgpO1xyXG4gICAgICAgIGlmICh0aC50YXJnZXQgPT09IHRoaXMuZG9tICYmICFBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLmRyb3BDaXRpZXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcblxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXRpZXM/Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIC8qaWYgKHRoaXMuYWlycGxhbmVzW3hdLnggPCA1MDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gdGhpcy5haXJwbGFuZXNbeF0ueCArIDE7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IDEwMDtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzW3hdLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZENpdHkoKSB7XHJcbiAgICAgICAgdmFyIGNpdHk6IENpdHkgPSBjcmVhdGVDaXRpZXModGhpcywgMSlbMF07XHJcbiAgICAgICAgY2l0eS5yZW5kZXIodGhpcy5jaXRpZXMuaW5kZXhPZihjaXR5KSk7XHJcbiAgICAgICAgY2l0eS51cGRhdGUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbmV3R2FtZSgpIHtcclxuICAgICAgICBjcmVhdGVDaXRpZXModGhpcywgNSk7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCA0MDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBhcCA9IG5ldyBBaXJwbGFuZSh0aGlzKTtcclxuICAgICAgICAgICAgYXAubmFtZSA9IFwiQWlycGxhbmUgXCIgKyB4O1xyXG4gICAgICAgICAgICBhcC5zcGVlZCA9IDIwMDtcclxuICAgICAgICAgICAgYXAueCA9IGdldFJhbmRvbUludCh0aGlzLmdhbWUubWFwV2lkdGgpO1xyXG4gICAgICAgICAgICBhcC55ID0gZ2V0UmFuZG9tSW50KHRoaXMuZ2FtZS5tYXBIZWlnaHQpO1xyXG4gICAgICAgICAgICBhcC53b3JsZCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzLnB1c2goYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNpdGllc1swXS5ob3VzZXM9MTtcclxuICAgICAgICB0aGlzLmNpdGllc1swXS53YXJlaG91c2VzPTE7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoZG9tOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb20gPSBkb207XHJcblxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbeF0ucmVuZGVyKHgpO1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1t4XS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgYXAgPSB0aGlzLmFpcnBsYW5lc1t4XTtcclxuICAgICAgICAgICAgYXAucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKGFwLmRvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIF90aGlzLm9uY2xpY2soZXYpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIF90aGlzLm9uY29udGV4dG1lbnUoZXYpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGZpbmRDaXR5QXQoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2l0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNpdGllc1tpXS54ID09PSB4ICYmIHRoaXMuY2l0aWVzW2ldLnkgPT09IHkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNpdGllc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsbCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==