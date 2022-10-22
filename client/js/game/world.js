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
                    ges += this.airplanes[x].getDailyCosts();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3dvcmxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFVQSxTQUFTLFlBQVksQ0FBQyxHQUFHO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELE1BQWEsS0FBSztRQVNkO1lBRkEsU0FBSSxHQUFHLE9BQU8sQ0FBQztZQUNmLGVBQVUsR0FBRyxTQUFTLENBQUM7WUFFbkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTs7Z0JBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxNQUFBLEtBQUssQ0FBQyxTQUFTLDBDQUFFLE1BQU0sQ0FBQSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM5Qzs7Ozt1QkFJRztvQkFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUMvQjtZQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUdaLENBQUM7UUFDTyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3ZCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUVqQiw0QkFBNEI7WUFDNUIsa0RBQWtEO1lBQ2xELEdBQUc7Z0JBQ0MsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENB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O1xyXG5pbXBvcnQgeyBDaXR5LCBjcmVhdGVDaXRpZXMgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lLCBhbGxBaXJwbGFuZVR5cGVzIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHdpbmRvd3MgZnJvbSBcImphc3NpanMvYmFzZS9XaW5kb3dzXCI7XHJcbmltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiZ2FtZS9nYW1lXCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lRGlhbG9nIH0gZnJvbSBcImdhbWUvYWlycGxhbmVkaWFsb2dcIjtcclxuaW1wb3J0IHsgUm91dGVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9yb3V0ZWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBTcXVhZHJvbkRpYWxvZyB9IGZyb20gXCJnYW1lL3NxdWFkcm9uZGlhbG9nXCI7XHJcbmltcG9ydCB7IENvbXBhbnkgfSBmcm9tIFwiZ2FtZS9jb21wYW55XCI7XHJcbmZ1bmN0aW9uIGdldFJhbmRvbUludChtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBXb3JsZCB7XHJcbiAgICBfaW50ZXJ2YWxsO1xyXG4gICAgY2l0aWVzOiBDaXR5W107XHJcbiAgICBhaXJwbGFuZXM6IEFpcnBsYW5lW107XHJcbiAgICBzZWxlY3Rpb247XHJcbiAgICBkb206IEhUTUxFbGVtZW50O1xyXG4gICAgZ2FtZTogR2FtZTtcclxuICAgIHR5cGUgPSBcIldvcmxkXCI7XHJcbiAgICBsYXN0VXBkYXRlID0gdW5kZWZpbmVkO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmNpdGllcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWlycGxhbmVzID0gW107XHJcbiAgICAgICAgdGhpcy5faW50ZXJ2YWxsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IF90aGlzLmFpcnBsYW5lcz8ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIC8qaWYgKHRoaXMuYWlycGxhbmVzW3hdLnggPCA1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IHRoaXMuYWlycGxhbmVzW3hdLnggKyAxO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IDEwMDtcclxuICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmVzW3hdLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwKTtcclxuXHJcblxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRFbGVtZW50T2Zmc2V0KGVsKSB7XHJcbiAgICAgICAgbGV0IHRvcCA9IDA7XHJcbiAgICAgICAgbGV0IGxlZnQgPSAwO1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZWw7XHJcblxyXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgRE9NIHRyZWVcclxuICAgICAgICAvLyBhbmQgYWRkIGl0J3MgcGFyZW50J3Mgb2Zmc2V0IHRvIGdldCBwYWdlIG9mZnNldFxyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wIHx8IDA7XHJcbiAgICAgICAgICAgIGxlZnQgKz0gZWxlbWVudC5vZmZzZXRMZWZ0IHx8IDA7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcclxuICAgICAgICB9IHdoaWxlIChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdG9wLFxyXG4gICAgICAgICAgICBsZWZ0LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBmaW5kQWlycGxhbmUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5haXJwbGFuZXNbeF0ubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWlycGxhbmVzW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5haXJwbGFuZXNbeF0uc3F1YWRyb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFpcnBsYW5lc1t4XS5zcXVhZHJvbltpXS5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWlycGxhbmVzW3hdLnNxdWFkcm9uW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25jb250ZXh0bWVudShldnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0aW9uKXtcclxuICAgICAgICAgICAgICAgICAgICAgdmFyIHB0PXRoaXMuZ2V0RWxlbWVudE9mZnNldChldnQuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxBaXJwbGFuZT50aGlzLnNlbGVjdGlvbikuZmx5VG8oZXZ0LngtcHQubGVmdC04LGV2dC55LXB0LnRvcC0xMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXZ0Lm9mZnNldFgpO1xyXG4gICAgICAgICAgICAgICAgfSovXHJcblxyXG4gICAgfVxyXG4gICAgb25jbGljayh0aDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xvc2VcIik7XHJcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24/LnVuc2VsZWN0KCk7XHJcbiAgICAgICAgaWYgKHRoLnRhcmdldCA9PT0gdGhpcy5kb20gJiYgIUFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuZHJvcENpdGllc0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIFNxdWFkcm9uRGlhbG9nLmdldEluc3RhbmNlKCkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RVcGRhdGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSB0aGlzLmdhbWUuZGF0ZS5nZXRUaW1lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY2l0aWVzPy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAvKmlmICh0aGlzLmFpcnBsYW5lc1t4XS54IDwgNTAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IHRoaXMuYWlycGxhbmVzW3hdLnggKyAxO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSAxMDA7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1t4XS51cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5kYXRlLmdldERhdGUoKSAhPT0gbmV3IERhdGUodGhpcy5sYXN0VXBkYXRlKS5nZXREYXRlKCkpIHtcclxuICAgICAgICAgICAgdmFyIGdlcyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGdlcyArPSB0aGlzLmFpcnBsYW5lc1t4XS5nZXREYWlseUNvc3RzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5nYW1lLmNoYW5nZU1vbmV5KC1nZXMsIFwiZGFpbHkgY29zdHMgYWlycGxhbmVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZSA9IHRoaXMuZ2FtZS5kYXRlLmdldFRpbWUoKTtcclxuICAgIH1cclxuICAgIGFkZENpdHkoKSB7XHJcbiAgICAgICAgdmFyIGNpdHk6IENpdHkgPSBjcmVhdGVDaXRpZXModGhpcywgMSlbMF07XHJcbiAgICAgICAgY2l0eS5yZW5kZXIodGhpcy5jaXRpZXMuaW5kZXhPZihjaXR5KSk7XHJcbiAgICAgICAgY2l0eS51cGRhdGUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbmV3R2FtZSgpIHtcclxuICAgICAgICBjcmVhdGVDaXRpZXModGhpcywgMTUpO1xyXG4gICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCAxOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIGFwID0gbmV3IEFpcnBsYW5lKHRoaXMpO1xyXG4gICAgICAgICAgICBhcC5uYW1lID0gYWxsQWlycGxhbmVUeXBlc1swXS5tb2RlbCArICh4ICsgMSk7XHJcbiAgICAgICAgICAgIGFwLnNwZWVkID0gYWxsQWlycGxhbmVUeXBlc1swXS5zcGVlZDtcclxuICAgICAgICAgICAgYXAuY29zdHMgPSBhbGxBaXJwbGFuZVR5cGVzWzBdLmNvc3RzO1xyXG4gICAgICAgICAgICBhcC5jYXBhY2l0eSA9IGFsbEFpcnBsYW5lVHlwZXNbMF0uY2FwYWNpdHk7XHJcbiAgICAgICAgICAgIGFwLnggPSB0aGlzLmNpdGllc1swXS54O1xyXG4gICAgICAgICAgICBhcC55ID0gdGhpcy5jaXRpZXNbMF0ueTtcclxuICAgICAgICAgICAgYXAudHlwZWlkID0gYWxsQWlycGxhbmVUeXBlc1swXS50eXBlaWQ7XHJcbiAgICAgICAgICAgIGFwLndvcmxkID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5haXJwbGFuZXMucHVzaChhcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2l0aWVzWzBdLmhvdXNlcyA9IDE7XHJcbiAgICAgICAgdGhpcy5jaXRpZXNbMF0ud2FyZWhvdXNlcyA9IDE7XHJcblxyXG5cclxuICAgICAvKiBMYXN0ZW5hdXNnbGVpY2ggICBcclxuICAgICAgICB0aGlzLmNpdGllcz1bdGhpcy5jaXRpZXNbMF1dO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzWzBdLmNvbXBhbmllcz1bXTtcclxuICAgICAgICBmb3IodmFyIHg9MDt4PDE5O3grKyl7XHJcbiAgICAgICAgICAgIHZhciBjb21wPW5ldyBDb21wYW55KCk7XHJcbiAgICAgICAgICAgIGNvbXAuY2l0eT10aGlzLmNpdGllc1swXTtcclxuICAgICAgICAgICAgY29tcC5wcm9kdWN0aWQ9eDtcclxuICAgICAgICAgICAgY29tcC53b3JrZXJzPTIwKjEwO1xyXG4gICAgICAgICAgICBjb21wLmJ1aWxkaW5ncz0xMDtcclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbMF0uY29tcGFuaWVzLnB1c2goY29tcCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzWzBdLndhcmVob3VzZVt4XT0xMDAwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaXRpZXNbMF0ucGVvcGxlPTEwKjE5KjIwO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzWzBdLmhvdXNlcz0xMCoxOSoyMC8xMDArMTsqL1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKGRvbTogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZG9tID0gZG9tO1xyXG5cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY2l0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzW3hdLnJlbmRlcih4KTtcclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbeF0udXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIGFwID0gdGhpcy5haXJwbGFuZXNbeF07XHJcbiAgICAgICAgICAgIGFwLnJlbmRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChhcC5kb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldjogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBfdGhpcy5vbmNsaWNrKGV2KTtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldjogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBfdGhpcy5vbmNvbnRleHRtZW51KGV2KTtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBmaW5kQ2l0eUF0KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNpdGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaXRpZXNbaV0ueCA9PT0geCAmJiB0aGlzLmNpdGllc1tpXS55ID09PSB5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaXRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbGwpO1xyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=