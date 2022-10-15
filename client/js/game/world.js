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
                ap.name = airplane_1.allAirplaneTypes[0].model + (x + 1);
                ap.speed = airplane_1.allAirplaneTypes[0].speed;
                ap.costs = airplane_1.allAirplaneTypes[0].costs;
                ap.capacity = airplane_1.allAirplaneTypes[0].capacity;
                ap.x = this.cities[0].x;
                ap.y = this.cities[0].y;
                this.cities[0].airplanesInCity.push(x);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3dvcmxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFPQSxTQUFTLFlBQVksQ0FBQyxHQUFHO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELE1BQWEsS0FBSztRQVNkO1lBRkEsU0FBSSxHQUFHLE9BQU8sQ0FBQztZQUNmLGVBQVUsR0FBRyxTQUFTLENBQUM7WUFFbkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTs7Z0JBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxNQUFBLEtBQUssQ0FBQyxTQUFTLDBDQUFFLE1BQU0sQ0FBQSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM5Qzs7Ozt1QkFJRztvQkFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUMvQjtZQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUdaLENBQUM7UUFDTyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3ZCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUVqQiw0QkFBNEI7WUFDNUIsa0RBQWtEO1lBQ2xELEdBQUc7Z0JBQ0MsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENB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QjthQUNKO1lBQ0QsT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUNELE9BQU87WUFDSCxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FDSjtJQXZKRCxzQkF1SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB7IENpdHksIGNyZWF0ZUNpdGllcyB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUsIGFsbEFpcnBsYW5lVHlwZXMgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCJnYW1lL2dhbWVcIjtcclxuaW1wb3J0IHsgQWlycGxhbmVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZWRpYWxvZ1wiO1xyXG5mdW5jdGlvbiBnZXRSYW5kb21JbnQobWF4KSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcclxufVxyXG5leHBvcnQgY2xhc3MgV29ybGQge1xyXG4gICAgX2ludGVydmFsbDtcclxuICAgIGNpdGllczogQ2l0eVtdO1xyXG4gICAgYWlycGxhbmVzOiBBaXJwbGFuZVtdO1xyXG4gICAgc2VsZWN0aW9uO1xyXG4gICAgZG9tOiBIVE1MRWxlbWVudDtcclxuICAgIGdhbWU6IEdhbWU7XHJcbiAgICB0eXBlID0gXCJXb3JsZFwiO1xyXG4gICAgbGFzdFVwZGF0ZSA9IHVuZGVmaW5lZDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaXRpZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmFpcnBsYW5lcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2ludGVydmFsbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBfdGhpcy5haXJwbGFuZXM/Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAvKmlmICh0aGlzLmFpcnBsYW5lc1t4XS54IDwgNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSB0aGlzLmFpcnBsYW5lc1t4XS54ICsgMTtcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSAxMDA7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lc1t4XS51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcblxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0RWxlbWVudE9mZnNldChlbCkge1xyXG4gICAgICAgIGxldCB0b3AgPSAwO1xyXG4gICAgICAgIGxldCBsZWZ0ID0gMDtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGVsO1xyXG5cclxuICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIERPTSB0cmVlXHJcbiAgICAgICAgLy8gYW5kIGFkZCBpdCdzIHBhcmVudCdzIG9mZnNldCB0byBnZXQgcGFnZSBvZmZzZXRcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHRvcCArPSBlbGVtZW50Lm9mZnNldFRvcCB8fCAwO1xyXG4gICAgICAgICAgICBsZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdCB8fCAwO1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XHJcbiAgICAgICAgfSB3aGlsZSAoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRvcCxcclxuICAgICAgICAgICAgbGVmdCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgb25jb250ZXh0bWVudShldnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0aW9uKXtcclxuICAgICAgICAgICAgICAgICAgICAgdmFyIHB0PXRoaXMuZ2V0RWxlbWVudE9mZnNldChldnQuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxBaXJwbGFuZT50aGlzLnNlbGVjdGlvbikuZmx5VG8oZXZ0LngtcHQubGVmdC04LGV2dC55LXB0LnRvcC0xMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZ0Lm9mZnNldFgpO1xyXG4gICAgICAgICAgICAgICAgfSovXHJcblxyXG4gICAgfVxyXG4gICAgb25jbGljayh0aDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xvc2VcIik7XHJcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24/LnVuc2VsZWN0KCk7XHJcbiAgICAgICAgaWYgKHRoLnRhcmdldCA9PT0gdGhpcy5kb20gJiYgIUFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuZHJvcENpdGllc0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5sYXN0VXBkYXRlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gdGhpcy5nYW1lLmRhdGUuZ2V0VGltZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdGllcz8ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgLyppZiAodGhpcy5haXJwbGFuZXNbeF0ueCA8IDUwMClcclxuICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSB0aGlzLmFpcnBsYW5lc1t4XS54ICsgMTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gMTAwO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbeF0udXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmdhbWUuZGF0ZS5nZXREYXRlKCkgIT09IG5ldyBEYXRlKHRoaXMubGFzdFVwZGF0ZSkuZ2V0RGF0ZSgpKSB7XHJcbiAgICAgICAgICAgIHZhciBnZXMgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBnZXMgKz0gdGhpcy5haXJwbGFuZXNbeF0uY29zdHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNoYW5nZU1vbmV5KC1nZXMsIFwiZGFpbHkgY29zdHMgYWlycGxhbmVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IHRoaXMuZ2FtZS5kYXRlLmdldFRpbWUoKTtcclxuICAgIH1cclxuICAgIGFkZENpdHkoKSB7XHJcbiAgICAgICAgdmFyIGNpdHk6IENpdHkgPSBjcmVhdGVDaXRpZXModGhpcywgMSlbMF07XHJcbiAgICAgICAgY2l0eS5yZW5kZXIodGhpcy5jaXRpZXMuaW5kZXhPZihjaXR5KSk7XHJcbiAgICAgICAgY2l0eS51cGRhdGUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbmV3R2FtZSgpIHtcclxuICAgICAgICBjcmVhdGVDaXRpZXModGhpcywgMTUpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgMTsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBhcCA9IG5ldyBBaXJwbGFuZSh0aGlzKTtcclxuICAgICAgICAgICAgYXAubmFtZSA9IGFsbEFpcnBsYW5lVHlwZXNbMF0ubW9kZWwgKyAoeCsxKTtcclxuICAgICAgICAgICAgYXAuc3BlZWQgPSBhbGxBaXJwbGFuZVR5cGVzWzBdLnNwZWVkO1xyXG4gICAgICAgICAgICBhcC5jb3N0cyA9IGFsbEFpcnBsYW5lVHlwZXNbMF0uY29zdHM7XHJcbiAgICAgICAgICAgIGFwLmNhcGFjaXR5ID0gYWxsQWlycGxhbmVUeXBlc1swXS5jYXBhY2l0eTtcclxuICAgICAgICAgICAgYXAueCA9IHRoaXMuY2l0aWVzWzBdLng7XHJcbiAgICAgICAgICAgIGFwLnkgPXRoaXMuY2l0aWVzWzBdLnk7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzWzBdLmFpcnBsYW5lc0luQ2l0eS5wdXNoKHgpOyBcclxuICAgICAgICAgICAgYXAud29ybGQgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmFpcnBsYW5lcy5wdXNoKGFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaXRpZXNbMF0uaG91c2VzID0gMTtcclxuICAgICAgICB0aGlzLmNpdGllc1swXS53YXJlaG91c2VzID0gMTtcclxuICAgIH1cclxuICAgIHJlbmRlcihkb206IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvbSA9IGRvbTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdGllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1t4XS5yZW5kZXIoeCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzW3hdLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBhcCA9IHRoaXMuYWlycGxhbmVzW3hdO1xyXG4gICAgICAgICAgICBhcC5yZW5kZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQoYXAuZG9tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXY6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMub25jbGljayhldik7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXY6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMub25jb250ZXh0bWVudShldik7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgZmluZENpdHlBdCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2l0aWVzW2ldLnggPT09IHggJiYgdGhpcy5jaXRpZXNbaV0ueSA9PT0geSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2l0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWxsKTtcclxuICAgIH1cclxufVxyXG5cclxuIl19