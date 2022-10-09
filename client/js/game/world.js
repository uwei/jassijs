define(["require", "exports", "game/city", "game/airplane", "game/citydialog", "game/airplanedialog"], function (require, exports, city_1, airplane_1, citydialog_1, airplanedialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.World = void 0;
    class World {
        constructor() {
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
            city.create();
            city.update();
        }
        create(dom) {
            var _this = this;
            this.dom = dom;
            (0, city_1.createCities)(this, 5);
            for (var x = 0; x < this.cities.length; x++) {
                this.cities[x].create(x);
                this.cities[x].update();
            }
            for (var x = 0; x < 1; x++) {
                var ap = new airplane_1.Airplane(this);
                ap.name = "Airplane " + x;
                ap.speed = 200;
                ap.create();
                ap.world = this;
                this.dom.appendChild(ap.dom);
                this.airplanes.push(ap);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3dvcmxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFRQSxNQUFhLEtBQUs7UUFPZDtZQUNJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUU7O2dCQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUcsTUFBQSxLQUFLLENBQUMsU0FBUywwQ0FBRSxNQUFNLENBQUEsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDOUM7Ozs7dUJBSUc7b0JBQ0gsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDL0I7WUFDTCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFHWixDQUFDO1FBQ08sZ0JBQWdCLENBQUMsRUFBRTtZQUN2QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFFakIsNEJBQTRCO1lBQzVCLGtEQUFrRDtZQUNsRCxHQUFHO2dCQUNDLEdBQUcsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxJQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQzthQUNsQyxRQUFRLE9BQU8sRUFBRTtZQUVsQixPQUFPO2dCQUNILEdBQUc7Z0JBQ0gsSUFBSTthQUNQLENBQUM7UUFDTixDQUFDO1FBQ0QsYUFBYSxDQUFDLEdBQWU7WUFDekIsR0FBRyxDQUFDLGNBQWMsRUFB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QyxDQUFDO1FBRVAsQ0FBQztRQUNELFVBQVUsQ0FBQyxDQUFTLEVBQUUsQ0FBUztZQUMzQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDbEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNKO1lBQ0QsT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUNELE9BQU87WUFDSCxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FDSjtJQTlIRCxzQkE4SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB7IENpdHksIGNyZWF0ZUNpdGllcyB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCJnYW1lL2dhbWVcIjtcclxuaW1wb3J0IHsgQWlycGxhbmVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZWRpYWxvZ1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcclxuICAgIF9pbnRlcnZhbGw7XHJcbiAgICBjaXRpZXM6IENpdHlbXTtcclxuICAgIGFpcnBsYW5lczogQWlycGxhbmVbXTtcclxuICAgIHNlbGVjdGlvbjtcclxuICAgIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBnYW1lOiBHYW1lO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmNpdGllcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWlycGxhbmVzID0gW107XHJcbiAgICAgICAgdGhpcy5faW50ZXJ2YWxsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IF90aGlzLmFpcnBsYW5lcz8ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIC8qaWYgKHRoaXMuYWlycGxhbmVzW3hdLnggPCA1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IHRoaXMuYWlycGxhbmVzW3hdLnggKyAxO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IDEwMDtcclxuICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmVzW3hdLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwKTtcclxuXHJcblxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRFbGVtZW50T2Zmc2V0KGVsKSB7XHJcbiAgICAgICAgbGV0IHRvcCA9IDA7XHJcbiAgICAgICAgbGV0IGxlZnQgPSAwO1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZWw7XHJcblxyXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgRE9NIHRyZWVcclxuICAgICAgICAvLyBhbmQgYWRkIGl0J3MgcGFyZW50J3Mgb2Zmc2V0IHRvIGdldCBwYWdlIG9mZnNldFxyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wIHx8IDA7XHJcbiAgICAgICAgICAgIGxlZnQgKz0gZWxlbWVudC5vZmZzZXRMZWZ0IHx8IDA7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcclxuICAgICAgICB9IHdoaWxlIChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdG9wLFxyXG4gICAgICAgICAgICBsZWZ0LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBvbmNvbnRleHRtZW51KGV2dDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgICAgICB2YXIgcHQ9dGhpcy5nZXRFbGVtZW50T2Zmc2V0KGV2dC5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAoPEFpcnBsYW5lPnRoaXMuc2VsZWN0aW9uKS5mbHlUbyhldnQueC1wdC5sZWZ0LTgsZXZ0LnktcHQudG9wLTEwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldnQub2Zmc2V0WCk7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuXHJcbiAgICB9XHJcbiAgICBvbmNsaWNrKHRoOiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbG9zZVwiKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGlvbj8udW5zZWxlY3QoKTtcclxuICAgICAgICBpZiAodGgudGFyZ2V0ID09PSB0aGlzLmRvbSYmIUFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuZHJvcENpdGllc0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdGllcz8ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgLyppZiAodGhpcy5haXJwbGFuZXNbeF0ueCA8IDUwMClcclxuICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSB0aGlzLmFpcnBsYW5lc1t4XS54ICsgMTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gMTAwO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbeF0udXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYWRkQ2l0eSgpIHtcclxuICAgICAgICB2YXIgY2l0eSA9IGNyZWF0ZUNpdGllcyh0aGlzLCAxKVswXTtcclxuICAgICAgICBjaXR5LmNyZWF0ZSgpO1xyXG4gICAgICAgIGNpdHkudXBkYXRlKCk7XHJcblxyXG4gICAgfVxyXG4gICAgY3JlYXRlKGRvbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZG9tID0gZG9tO1xyXG4gICAgICAgIGNyZWF0ZUNpdGllcyh0aGlzLCA1KTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY2l0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzW3hdLmNyZWF0ZSh4KTtcclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbeF0udXBkYXRlKCk7XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCAxOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIGFwID0gbmV3IEFpcnBsYW5lKHRoaXMpO1xyXG4gICAgICAgICAgICBhcC5uYW1lID0gXCJBaXJwbGFuZSBcIiArIHg7XHJcbiAgICAgICAgICAgIGFwLnNwZWVkID0gMjAwO1xyXG4gICAgICAgICAgICBhcC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgYXAud29ybGQgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChhcC5kb20pO1xyXG4gICAgICAgICAgICB0aGlzLmFpcnBsYW5lcy5wdXNoKGFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXY6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMub25jbGljayhldik7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXY6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMub25jb250ZXh0bWVudShldik7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgZmluZENpdHlBdCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2l0aWVzW2ldLnggPT09IHggJiYgdGhpcy5jaXRpZXNbaV0ueSA9PT0geSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2l0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWxsKTtcclxuICAgIH1cclxufVxyXG5cclxuIl19