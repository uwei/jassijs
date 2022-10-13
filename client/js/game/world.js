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
            this.lastUpdate = undefined;
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
            if (this.lastUpdate === undefined) {
                this.lastUpdate = this.game.date.getTime();
            }
            for (var x = 0; x < ((_a = this.cities) === null || _a === void 0 ? void 0 : _a.length); x++) {
                /*if (this.airplanes[x].x < 500)
                    this.airplanes[x].x = this.airplanes[x].x + 1;
                else {
                    this.airplanes[x].x = 100;
                }*/
                this.cities[x].update();
            }
            if (this.game.date.getDate() !== new Date(this.lastUpdate).getDate()) {
                var ges = 0;
                for (var x = 0; x < this.airplanes.length; x++) {
                    ges += this.airplanes[x].costs;
                }
                this.game.changeMoney(-ges, "daily costs airplane");
            }
            this.lastUpdate = this.game.date.getTime();
        }
        addCity() {
            var city = (0, city_1.createCities)(this, 1)[0];
            city.render(this.cities.indexOf(city));
            city.update();
        }
        newGame() {
            (0, city_1.createCities)(this, 15);
            for (var x = 0; x < 1; x++) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3dvcmxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFPQSxTQUFTLFlBQVksQ0FBQyxHQUFHO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELE1BQWEsS0FBSztRQVNkO1lBRkEsU0FBSSxHQUFHLE9BQU8sQ0FBQztZQUNmLGVBQVUsR0FBRyxTQUFTLENBQUM7WUFFbkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTs7Z0JBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxNQUFBLEtBQUssQ0FBQyxTQUFTLDBDQUFFLE1BQU0sQ0FBQSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM5Qzs7Ozt1QkFJRztvQkFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUMvQjtZQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUdaLENBQUM7UUFDTyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3ZCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUVqQiw0QkFBNEI7WUFDNUIsa0RBQWtEO1lBQ2xELEdBQUc7Z0JBQ0MsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENB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RUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2hDO1lBQ0QsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQWMsRUFBRSxFQUFFO2dCQUM3QyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNsQixPQUFPLFNBQVMsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztZQUNILEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFjLEVBQUUsRUFBRTtnQkFDbkQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsT0FBTyxTQUFTLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7UUFFUCxDQUFDO1FBQ0QsVUFBVSxDQUFDLENBQVMsRUFBRSxDQUFTO1lBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNsRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3pCO2FBQ0o7WUFDRCxPQUFPLFNBQVMsQ0FBQztRQUNyQixDQUFDO1FBQ0QsT0FBTztZQUNILGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsQ0FBQztLQUNKO0lBcEpELHNCQW9KQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHsgQ2l0eSwgY3JlYXRlQ2l0aWVzIH0gZnJvbSBcImdhbWUvY2l0eVwiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZSB9IGZyb20gXCJnYW1lL2FpcnBsYW5lXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcImdhbWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZURpYWxvZyB9IGZyb20gXCJnYW1lL2FpcnBsYW5lZGlhbG9nXCI7XHJcbmZ1bmN0aW9uIGdldFJhbmRvbUludChtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBXb3JsZCB7XHJcbiAgICBfaW50ZXJ2YWxsO1xyXG4gICAgY2l0aWVzOiBDaXR5W107XHJcbiAgICBhaXJwbGFuZXM6IEFpcnBsYW5lW107XHJcbiAgICBzZWxlY3Rpb247XHJcbiAgICBkb206IEhUTUxFbGVtZW50O1xyXG4gICAgZ2FtZTogR2FtZTtcclxuICAgIHR5cGUgPSBcIldvcmxkXCI7XHJcbiAgICBsYXN0VXBkYXRlID0gdW5kZWZpbmVkO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmNpdGllcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWlycGxhbmVzID0gW107XHJcbiAgICAgICAgdGhpcy5faW50ZXJ2YWxsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IF90aGlzLmFpcnBsYW5lcz8ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIC8qaWYgKHRoaXMuYWlycGxhbmVzW3hdLnggPCA1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IHRoaXMuYWlycGxhbmVzW3hdLnggKyAxO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IDEwMDtcclxuICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmVzW3hdLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwKTtcclxuXHJcblxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRFbGVtZW50T2Zmc2V0KGVsKSB7XHJcbiAgICAgICAgbGV0IHRvcCA9IDA7XHJcbiAgICAgICAgbGV0IGxlZnQgPSAwO1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZWw7XHJcblxyXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgRE9NIHRyZWVcclxuICAgICAgICAvLyBhbmQgYWRkIGl0J3MgcGFyZW50J3Mgb2Zmc2V0IHRvIGdldCBwYWdlIG9mZnNldFxyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wIHx8IDA7XHJcbiAgICAgICAgICAgIGxlZnQgKz0gZWxlbWVudC5vZmZzZXRMZWZ0IHx8IDA7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcclxuICAgICAgICB9IHdoaWxlIChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdG9wLFxyXG4gICAgICAgICAgICBsZWZ0LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBvbmNvbnRleHRtZW51KGV2dDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgICAgICB2YXIgcHQ9dGhpcy5nZXRFbGVtZW50T2Zmc2V0KGV2dC5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAoPEFpcnBsYW5lPnRoaXMuc2VsZWN0aW9uKS5mbHlUbyhldnQueC1wdC5sZWZ0LTgsZXZ0LnktcHQudG9wLTEwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldnQub2Zmc2V0WCk7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuXHJcbiAgICB9XHJcbiAgICBvbmNsaWNrKHRoOiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbG9zZVwiKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGlvbj8udW5zZWxlY3QoKTtcclxuICAgICAgICBpZiAodGgudGFyZ2V0ID09PSB0aGlzLmRvbSAmJiAhQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5kcm9wQ2l0aWVzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xyXG5cclxuICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RVcGRhdGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSB0aGlzLmdhbWUuZGF0ZS5nZXRUaW1lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY2l0aWVzPy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAvKmlmICh0aGlzLmFpcnBsYW5lc1t4XS54IDwgNTAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IHRoaXMuYWlycGxhbmVzW3hdLnggKyAxO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSAxMDA7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1t4XS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5kYXRlLmdldERhdGUoKSAhPT0gbmV3IERhdGUodGhpcy5sYXN0VXBkYXRlKS5nZXREYXRlKCkpIHtcclxuICAgICAgICAgICAgdmFyIGdlcyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGdlcyArPSB0aGlzLmFpcnBsYW5lc1t4XS5jb3N0cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuY2hhbmdlTW9uZXkoLWdlcywgXCJkYWlseSBjb3N0cyBhaXJwbGFuZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gdGhpcy5nYW1lLmRhdGUuZ2V0VGltZSgpO1xyXG4gICAgfVxyXG4gICAgYWRkQ2l0eSgpIHtcclxuICAgICAgICB2YXIgY2l0eTogQ2l0eSA9IGNyZWF0ZUNpdGllcyh0aGlzLCAxKVswXTtcclxuICAgICAgICBjaXR5LnJlbmRlcih0aGlzLmNpdGllcy5pbmRleE9mKGNpdHkpKTtcclxuICAgICAgICBjaXR5LnVwZGF0ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBuZXdHYW1lKCkge1xyXG4gICAgICAgIGNyZWF0ZUNpdGllcyh0aGlzLCAxNSk7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCAxOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIGFwID0gbmV3IEFpcnBsYW5lKHRoaXMpO1xyXG4gICAgICAgICAgICBhcC5uYW1lID0gXCJBaXJwbGFuZSBcIiArIHg7XHJcbiAgICAgICAgICAgIGFwLnNwZWVkID0gMjAwO1xyXG4gICAgICAgICAgICBhcC54ID0gZ2V0UmFuZG9tSW50KHRoaXMuZ2FtZS5tYXBXaWR0aCk7XHJcbiAgICAgICAgICAgIGFwLnkgPSBnZXRSYW5kb21JbnQodGhpcy5nYW1lLm1hcEhlaWdodCk7XHJcbiAgICAgICAgICAgIGFwLndvcmxkID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5haXJwbGFuZXMucHVzaChhcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2l0aWVzWzBdLmhvdXNlcyA9IDE7XHJcbiAgICAgICAgdGhpcy5jaXRpZXNbMF0ud2FyZWhvdXNlcyA9IDE7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoZG9tOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb20gPSBkb207XHJcblxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbeF0ucmVuZGVyKHgpO1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1t4XS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgYXAgPSB0aGlzLmFpcnBsYW5lc1t4XTtcclxuICAgICAgICAgICAgYXAucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKGFwLmRvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIF90aGlzLm9uY2xpY2soZXYpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIF90aGlzLm9uY29udGV4dG1lbnUoZXYpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGZpbmRDaXR5QXQoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2l0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNpdGllc1tpXS54ID09PSB4ICYmIHRoaXMuY2l0aWVzW2ldLnkgPT09IHkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNpdGllc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsbCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==