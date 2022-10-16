define(["require", "exports", "game/city", "game/airplane", "game/citydialog", "game/airplanedialog", "game/routedialog", "game/squadrondialog"], function (require, exports, city_1, airplane_1, citydialog_1, airplanedialog_1, routedialog_1, squadrondialog_1) {
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
        findAirplane(name) {
            for (var x = 0; x < this.airplanes.length; x++) {
                if (this.airplanes[x].name === name) {
                    return this.airplanes[x];
                }
                for (var i = 0; i < this.airplanes[x].squadron.length; i++) {
                    if (this.airplanes[x].squadron[i].name === name) {
                        return this.airplanes[x].squadron[i];
                    }
                }
            }
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
                try {
                    routedialog_1.RouteDialog.getInstance().close();
                }
                catch (_d) {
                }
                try {
                    squadrondialog_1.SquadronDialog.getInstance().close();
                }
                catch (_e) {
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
                ap.typeid = airplane_1.allAirplaneTypes[0].typeid;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3dvcmxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFTQSxTQUFTLFlBQVksQ0FBQyxHQUFHO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELE1BQWEsS0FBSztRQVNkO1lBRkEsU0FBSSxHQUFHLE9BQU8sQ0FBQztZQUNmLGVBQVUsR0FBRyxTQUFTLENBQUM7WUFFbkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTs7Z0JBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxNQUFBLEtBQUssQ0FBQyxTQUFTLDBDQUFFLE1BQU0sQ0FBQSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM5Qzs7Ozt1QkFJRztvQkFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUMvQjtZQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUdaLENBQUM7UUFDTyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3ZCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUVqQiw0QkFBNEI7WUFDNUIsa0RBQWtEO1lBQ2xELEdBQUc7Z0JBQ0MsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENB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dCI6WyJpbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB7IENpdHksIGNyZWF0ZUNpdGllcyB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUsIGFsbEFpcnBsYW5lVHlwZXMgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCJnYW1lL2dhbWVcIjtcclxuaW1wb3J0IHsgQWlycGxhbmVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBSb3V0ZURpYWxvZyB9IGZyb20gXCJnYW1lL3JvdXRlZGlhbG9nXCI7XHJcbmltcG9ydCB7IFNxdWFkcm9uRGlhbG9nIH0gZnJvbSBcImdhbWUvc3F1YWRyb25kaWFsb2dcIjtcclxuZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1heCkge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XHJcbn1cclxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcclxuICAgIF9pbnRlcnZhbGw7XHJcbiAgICBjaXRpZXM6IENpdHlbXTtcclxuICAgIGFpcnBsYW5lczogQWlycGxhbmVbXTtcclxuICAgIHNlbGVjdGlvbjtcclxuICAgIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBnYW1lOiBHYW1lO1xyXG4gICAgdHlwZSA9IFwiV29ybGRcIjtcclxuICAgIGxhc3RVcGRhdGUgPSB1bmRlZmluZWQ7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzID0gW107XHJcbiAgICAgICAgdGhpcy5haXJwbGFuZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9pbnRlcnZhbGwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgX3RoaXMuYWlycGxhbmVzPy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgLyppZiAodGhpcy5haXJwbGFuZXNbeF0ueCA8IDUwMClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gdGhpcy5haXJwbGFuZXNbeF0ueCArIDE7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZXNbeF0udXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDApO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEVsZW1lbnRPZmZzZXQoZWwpIHtcclxuICAgICAgICBsZXQgdG9wID0gMDtcclxuICAgICAgICBsZXQgbGVmdCA9IDA7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBlbDtcclxuXHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBET00gdHJlZVxyXG4gICAgICAgIC8vIGFuZCBhZGQgaXQncyBwYXJlbnQncyBvZmZzZXQgdG8gZ2V0IHBhZ2Ugb2Zmc2V0XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3AgfHwgMDtcclxuICAgICAgICAgICAgbGVmdCArPSBlbGVtZW50Lm9mZnNldExlZnQgfHwgMDtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgIH0gd2hpbGUgKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0b3AsXHJcbiAgICAgICAgICAgIGxlZnQsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGZpbmRBaXJwbGFuZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFpcnBsYW5lc1t4XS5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5haXJwbGFuZXNbeF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFpcnBsYW5lc1t4XS5zcXVhZHJvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWlycGxhbmVzW3hdLnNxdWFkcm9uW2ldLm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5haXJwbGFuZXNbeF0uc3F1YWRyb25baV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbmNvbnRleHRtZW51KGV2dDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgICAgICB2YXIgcHQ9dGhpcy5nZXRFbGVtZW50T2Zmc2V0KGV2dC5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAoPEFpcnBsYW5lPnRoaXMuc2VsZWN0aW9uKS5mbHlUbyhldnQueC1wdC5sZWZ0LTgsZXZ0LnktcHQudG9wLTEwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldnQub2Zmc2V0WCk7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuXHJcbiAgICB9XHJcbiAgICBvbmNsaWNrKHRoOiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbG9zZVwiKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGlvbj8udW5zZWxlY3QoKTtcclxuICAgICAgICBpZiAodGgudGFyZ2V0ID09PSB0aGlzLmRvbSAmJiAhQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5kcm9wQ2l0aWVzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xyXG5cclxuICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgU3F1YWRyb25EaWFsb2cuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdFVwZGF0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IHRoaXMuZ2FtZS5kYXRlLmdldFRpbWUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXRpZXM/Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIC8qaWYgKHRoaXMuYWlycGxhbmVzW3hdLnggPCA1MDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gdGhpcy5haXJwbGFuZXNbeF0ueCArIDE7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IDEwMDtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzW3hdLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5nYW1lLmRhdGUuZ2V0RGF0ZSgpICE9PSBuZXcgRGF0ZSh0aGlzLmxhc3RVcGRhdGUpLmdldERhdGUoKSkge1xyXG4gICAgICAgICAgICB2YXIgZ2VzID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgZ2VzICs9IHRoaXMuYWlycGxhbmVzW3hdLmNvc3RzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jaGFuZ2VNb25leSgtZ2VzLCBcImRhaWx5IGNvc3RzIGFpcnBsYW5lXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSB0aGlzLmdhbWUuZGF0ZS5nZXRUaW1lKCk7XHJcbiAgICB9XHJcbiAgICBhZGRDaXR5KCkge1xyXG4gICAgICAgIHZhciBjaXR5OiBDaXR5ID0gY3JlYXRlQ2l0aWVzKHRoaXMsIDEpWzBdO1xyXG4gICAgICAgIGNpdHkucmVuZGVyKHRoaXMuY2l0aWVzLmluZGV4T2YoY2l0eSkpO1xyXG4gICAgICAgIGNpdHkudXBkYXRlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5ld0dhbWUoKSB7XHJcbiAgICAgICAgY3JlYXRlQ2l0aWVzKHRoaXMsIDE1KTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IDE7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgYXAgPSBuZXcgQWlycGxhbmUodGhpcyk7XHJcbiAgICAgICAgICAgIGFwLm5hbWUgPSBhbGxBaXJwbGFuZVR5cGVzWzBdLm1vZGVsICsgKHggKyAxKTtcclxuICAgICAgICAgICAgYXAuc3BlZWQgPSBhbGxBaXJwbGFuZVR5cGVzWzBdLnNwZWVkO1xyXG4gICAgICAgICAgICBhcC5jb3N0cyA9IGFsbEFpcnBsYW5lVHlwZXNbMF0uY29zdHM7XHJcbiAgICAgICAgICAgIGFwLmNhcGFjaXR5ID0gYWxsQWlycGxhbmVUeXBlc1swXS5jYXBhY2l0eTtcclxuICAgICAgICAgICAgYXAueCA9IHRoaXMuY2l0aWVzWzBdLng7XHJcbiAgICAgICAgICAgIGFwLnkgPSB0aGlzLmNpdGllc1swXS55O1xyXG4gICAgICAgICAgICBhcC50eXBlaWQgPSBhbGxBaXJwbGFuZVR5cGVzWzBdLnR5cGVpZDtcclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbMF0uYWlycGxhbmVzSW5DaXR5LnB1c2goeCk7XHJcbiAgICAgICAgICAgIGFwLndvcmxkID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5haXJwbGFuZXMucHVzaChhcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2l0aWVzWzBdLmhvdXNlcyA9IDE7XHJcbiAgICAgICAgdGhpcy5jaXRpZXNbMF0ud2FyZWhvdXNlcyA9IDE7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoZG9tOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb20gPSBkb207XHJcblxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbeF0ucmVuZGVyKHgpO1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1t4XS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgYXAgPSB0aGlzLmFpcnBsYW5lc1t4XTtcclxuICAgICAgICAgICAgYXAucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKGFwLmRvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIF90aGlzLm9uY2xpY2soZXYpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIF90aGlzLm9uY29udGV4dG1lbnUoZXYpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGZpbmRDaXR5QXQoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2l0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNpdGllc1tpXS54ID09PSB4ICYmIHRoaXMuY2l0aWVzW2ldLnkgPT09IHkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNpdGllc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsbCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==