define(["require", "exports", "game/city", "game/airplane", "game/citydialog", "game/airplanedialog", "game/routedialog", "game/squadrondialog", "game/diagramdialog"], function (require, exports, city_1, airplane_1, citydialog_1, airplanedialog_1, routedialog_1, squadrondialog_1, diagramdialog_1) {
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
                try {
                    diagramdialog_1.DiagramDialog.getInstance().close();
                }
                catch (_f) {
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
                    ges += this.airplanes[x].getDailyCosts();
                }
                this.game.changeMoney(-ges, "daily costs airplane");
                this.game.statistic.yesterday = this.game.statistic.today;
                this.game.statistic.today = {};
            }
            this.lastUpdate = this.game.date.getTime();
        }
        addCity(hasAirport = true) {
            var city = (0, city_1.createCities)(this, 1)[0];
            city.hasAirport = hasAirport;
            city.render(this.cities.indexOf(city));
            city.update();
        }
        newGame() {
            (0, city_1.createCities)(this, 16);
            this.cities[this.cities.length - 1].hasAirport = false;
            for (var x = 0; x < 1; x++) {
                var ap = new airplane_1.Airplane(this);
                ap.name = airplane_1.allAirplaneTypes[0].model + (x + 1);
                ap.speed = airplane_1.allAirplaneTypes[0].speed;
                ap.costs = airplane_1.allAirplaneTypes[0].costs;
                ap.capacity = airplane_1.allAirplaneTypes[0].capacity;
                ap.x = this.cities[0].x;
                ap.y = this.cities[0].y;
                ap.typeid = airplane_1.allAirplaneTypes[0].typeid;
                ap.world = this;
                this.airplanes.push(ap);
            }
            this.cities[0].houses = 1;
            this.cities[0].warehouses = 1;
            /* Lastenausgleich
               this.cities=[this.cities[0]];
               this.cities[0].companies=[];
               for(var x=0;x<19;x++){
                   var comp=new Company();
                   comp.city=this.cities[0];
                   comp.productid=x;
                   comp.workers=20*10;
                   comp.buildings=10;
                   this.cities[0].companies.push(comp);
                   this.cities[0].warehouse[x]=10000;
               }
               this.cities[0].people=10*19*20;
               this.cities[0].houses=10*19*20/100+1;*/
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3dvcmxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFXQSxTQUFTLFlBQVksQ0FBQyxHQUFHO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELE1BQWEsS0FBSztRQVNkO1lBRkEsU0FBSSxHQUFHLE9BQU8sQ0FBQztZQUNmLGVBQVUsR0FBRyxTQUFTLENBQUM7WUFFbkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTs7Z0JBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxNQUFBLEtBQUssQ0FBQyxTQUFTLDBDQUFFLE1BQU0sQ0FBQSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM5Qzs7Ozt1QkFJRztvQkFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUMvQjtZQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUdaLENBQUM7UUFDTyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3ZCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUVqQiw0QkFBNEI7WUFDNUIsa0RBQWtEO1lBQ2xELEdBQUc7Z0JBQ0MsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENB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LEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDbEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNKO1lBQ0QsT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUNELE9BQU87WUFDSCxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FDSjtJQXRNRCxzQkFzTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB7IENpdHksIGNyZWF0ZUNpdGllcyB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUsIGFsbEFpcnBsYW5lVHlwZXMgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCJnYW1lL2dhbWVcIjtcclxuaW1wb3J0IHsgQWlycGxhbmVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBSb3V0ZURpYWxvZyB9IGZyb20gXCJnYW1lL3JvdXRlZGlhbG9nXCI7XHJcbmltcG9ydCB7IFNxdWFkcm9uRGlhbG9nIH0gZnJvbSBcImdhbWUvc3F1YWRyb25kaWFsb2dcIjtcclxuaW1wb3J0IHsgQ29tcGFueSB9IGZyb20gXCJnYW1lL2NvbXBhbnlcIjtcclxuaW1wb3J0IHsgRGlhZ3JhbURpYWxvZyB9IGZyb20gXCJnYW1lL2RpYWdyYW1kaWFsb2dcIjtcclxuZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1heCkge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XHJcbn1cclxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcclxuICAgIF9pbnRlcnZhbGw7XHJcbiAgICBjaXRpZXM6IENpdHlbXTtcclxuICAgIGFpcnBsYW5lczogQWlycGxhbmVbXTtcclxuICAgIHNlbGVjdGlvbjtcclxuICAgIGRvbTogSFRNTEVsZW1lbnQ7XHJcbiAgICBnYW1lOiBHYW1lO1xyXG4gICAgdHlwZSA9IFwiV29ybGRcIjtcclxuICAgIGxhc3RVcGRhdGUgPSB1bmRlZmluZWQ7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzID0gW107XHJcbiAgICAgICAgdGhpcy5haXJwbGFuZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9pbnRlcnZhbGwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgX3RoaXMuYWlycGxhbmVzPy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgLyppZiAodGhpcy5haXJwbGFuZXNbeF0ueCA8IDUwMClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gdGhpcy5haXJwbGFuZXNbeF0ueCArIDE7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZXNbeF0udXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDApO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEVsZW1lbnRPZmZzZXQoZWwpIHtcclxuICAgICAgICBsZXQgdG9wID0gMDtcclxuICAgICAgICBsZXQgbGVmdCA9IDA7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBlbDtcclxuXHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBET00gdHJlZVxyXG4gICAgICAgIC8vIGFuZCBhZGQgaXQncyBwYXJlbnQncyBvZmZzZXQgdG8gZ2V0IHBhZ2Ugb2Zmc2V0XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3AgfHwgMDtcclxuICAgICAgICAgICAgbGVmdCArPSBlbGVtZW50Lm9mZnNldExlZnQgfHwgMDtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgIH0gd2hpbGUgKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0b3AsXHJcbiAgICAgICAgICAgIGxlZnQsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGZpbmRBaXJwbGFuZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFpcnBsYW5lc1t4XS5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5haXJwbGFuZXNbeF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFpcnBsYW5lc1t4XS5zcXVhZHJvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWlycGxhbmVzW3hdLnNxdWFkcm9uW2ldLm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5haXJwbGFuZXNbeF0uc3F1YWRyb25baV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbmNvbnRleHRtZW51KGV2dDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3Rpb24pe1xyXG4gICAgICAgICAgICAgICAgICAgICB2YXIgcHQ9dGhpcy5nZXRFbGVtZW50T2Zmc2V0KGV2dC5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAoPEFpcnBsYW5lPnRoaXMuc2VsZWN0aW9uKS5mbHlUbyhldnQueC1wdC5sZWZ0LTgsZXZ0LnktcHQudG9wLTEwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhldnQub2Zmc2V0WCk7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuXHJcbiAgICB9XHJcbiAgICBvbmNsaWNrKHRoOiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbG9zZVwiKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGlvbj8udW5zZWxlY3QoKTtcclxuICAgICAgICBpZiAodGgudGFyZ2V0ID09PSB0aGlzLmRvbSAmJiAhQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5kcm9wQ2l0aWVzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xyXG5cclxuICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgU3F1YWRyb25EaWFsb2cuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBEaWFncmFtRGlhbG9nLmdldEluc3RhbmNlKCkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RVcGRhdGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSB0aGlzLmdhbWUuZGF0ZS5nZXRUaW1lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY2l0aWVzPy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAvKmlmICh0aGlzLmFpcnBsYW5lc1t4XS54IDwgNTAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IHRoaXMuYWlycGxhbmVzW3hdLnggKyAxO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSAxMDA7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1t4XS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5kYXRlLmdldERhdGUoKSAhPT0gbmV3IERhdGUodGhpcy5sYXN0VXBkYXRlKS5nZXREYXRlKCkpIHtcclxuICAgICAgICAgICAgdmFyIGdlcyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGdlcyArPSB0aGlzLmFpcnBsYW5lc1t4XS5nZXREYWlseUNvc3RzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNoYW5nZU1vbmV5KC1nZXMsIFwiZGFpbHkgY29zdHMgYWlycGxhbmVcIik7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0aXN0aWMueWVzdGVyZGF5PXRoaXMuZ2FtZS5zdGF0aXN0aWMudG9kYXk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0aXN0aWMudG9kYXk9e307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IHRoaXMuZ2FtZS5kYXRlLmdldFRpbWUoKTtcclxuICAgIH1cclxuICAgIGFkZENpdHkoaGFzQWlycG9ydD10cnVlKSB7XHJcbiAgICAgICAgdmFyIGNpdHk6IENpdHkgPSBjcmVhdGVDaXRpZXModGhpcywgMSlbMF07XHJcbiAgICAgICAgY2l0eS5oYXNBaXJwb3J0PWhhc0FpcnBvcnQ7XHJcbiAgICAgICAgY2l0eS5yZW5kZXIodGhpcy5jaXRpZXMuaW5kZXhPZihjaXR5KSk7XHJcbiAgICAgICAgY2l0eS51cGRhdGUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbmV3R2FtZSgpIHtcclxuICAgICAgICBjcmVhdGVDaXRpZXModGhpcywgMTYpO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzW3RoaXMuY2l0aWVzLmxlbmd0aC0xXS5oYXNBaXJwb3J0PWZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgMTsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBhcCA9IG5ldyBBaXJwbGFuZSh0aGlzKTtcclxuICAgICAgICAgICAgYXAubmFtZSA9IGFsbEFpcnBsYW5lVHlwZXNbMF0ubW9kZWwgKyAoeCArIDEpO1xyXG4gICAgICAgICAgICBhcC5zcGVlZCA9IGFsbEFpcnBsYW5lVHlwZXNbMF0uc3BlZWQ7XHJcbiAgICAgICAgICAgIGFwLmNvc3RzID0gYWxsQWlycGxhbmVUeXBlc1swXS5jb3N0cztcclxuICAgICAgICAgICAgYXAuY2FwYWNpdHkgPSBhbGxBaXJwbGFuZVR5cGVzWzBdLmNhcGFjaXR5O1xyXG4gICAgICAgICAgICBhcC54ID0gdGhpcy5jaXRpZXNbMF0ueDtcclxuICAgICAgICAgICAgYXAueSA9IHRoaXMuY2l0aWVzWzBdLnk7XHJcbiAgICAgICAgICAgIGFwLnR5cGVpZCA9IGFsbEFpcnBsYW5lVHlwZXNbMF0udHlwZWlkO1xyXG4gICAgICAgICAgICBhcC53b3JsZCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzLnB1c2goYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNpdGllc1swXS5ob3VzZXMgPSAxO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzWzBdLndhcmVob3VzZXMgPSAxO1xyXG5cclxuXHJcbiAgICAgLyogTGFzdGVuYXVzZ2xlaWNoICAgXHJcbiAgICAgICAgdGhpcy5jaXRpZXM9W3RoaXMuY2l0aWVzWzBdXTtcclxuICAgICAgICB0aGlzLmNpdGllc1swXS5jb21wYW5pZXM9W107XHJcbiAgICAgICAgZm9yKHZhciB4PTA7eDwxOTt4Kyspe1xyXG4gICAgICAgICAgICB2YXIgY29tcD1uZXcgQ29tcGFueSgpO1xyXG4gICAgICAgICAgICBjb21wLmNpdHk9dGhpcy5jaXRpZXNbMF07XHJcbiAgICAgICAgICAgIGNvbXAucHJvZHVjdGlkPXg7XHJcbiAgICAgICAgICAgIGNvbXAud29ya2Vycz0yMCoxMDtcclxuICAgICAgICAgICAgY29tcC5idWlsZGluZ3M9MTA7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzWzBdLmNvbXBhbmllcy5wdXNoKGNvbXApO1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1swXS53YXJlaG91c2VbeF09MTAwMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2l0aWVzWzBdLnBlb3BsZT0xMCoxOSoyMDtcclxuICAgICAgICB0aGlzLmNpdGllc1swXS5ob3VzZXM9MTAqMTkqMjAvMTAwKzE7Ki9cclxuICAgIH1cclxuICAgIHJlbmRlcihkb206IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvbSA9IGRvbTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdGllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1t4XS5yZW5kZXIoeCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzW3hdLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBhcCA9IHRoaXMuYWlycGxhbmVzW3hdO1xyXG4gICAgICAgICAgICBhcC5yZW5kZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQoYXAuZG9tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXY6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMub25jbGljayhldik7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXY6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMub25jb250ZXh0bWVudShldik7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgZmluZENpdHlBdCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2l0aWVzW2ldLnggPT09IHggJiYgdGhpcy5jaXRpZXNbaV0ueSA9PT0geSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2l0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWxsKTtcclxuICAgIH1cclxufVxyXG5cclxuIl19