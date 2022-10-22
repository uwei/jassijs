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
            /*
            
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3dvcmxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFVQSxTQUFTLFlBQVksQ0FBQyxHQUFHO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELE1BQWEsS0FBSztRQVNkO1lBRkEsU0FBSSxHQUFHLE9BQU8sQ0FBQztZQUNmLGVBQVUsR0FBRyxTQUFTLENBQUM7WUFFbkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTs7Z0JBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxNQUFBLEtBQUssQ0FBQyxTQUFTLDBDQUFFLE1BQU0sQ0FBQSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM5Qzs7Ozt1QkFJRztvQkFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUMvQjtZQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUdaLENBQUM7UUFDTyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3ZCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNiLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUVqQiw0QkFBNEI7WUFDNUIsa0RBQWtEO1lBQ2xELEdBQUc7Z0JBQ0MsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO2dCQUM5QixJQUFJLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENB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IjtcclxuaW1wb3J0IHsgQ2l0eSwgY3JlYXRlQ2l0aWVzIH0gZnJvbSBcImdhbWUvY2l0eVwiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZSwgYWxsQWlycGxhbmVUeXBlcyB9IGZyb20gXCJnYW1lL2FpcnBsYW5lXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcImdhbWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZURpYWxvZyB9IGZyb20gXCJnYW1lL2FpcnBsYW5lZGlhbG9nXCI7XHJcbmltcG9ydCB7IFJvdXRlRGlhbG9nIH0gZnJvbSBcImdhbWUvcm91dGVkaWFsb2dcIjtcclxuaW1wb3J0IHsgU3F1YWRyb25EaWFsb2cgfSBmcm9tIFwiZ2FtZS9zcXVhZHJvbmRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBDb21wYW55IH0gZnJvbSBcImdhbWUvY29tcGFueVwiO1xyXG5mdW5jdGlvbiBnZXRSYW5kb21JbnQobWF4KSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcclxufVxyXG5leHBvcnQgY2xhc3MgV29ybGQge1xyXG4gICAgX2ludGVydmFsbDtcclxuICAgIGNpdGllczogQ2l0eVtdO1xyXG4gICAgYWlycGxhbmVzOiBBaXJwbGFuZVtdO1xyXG4gICAgc2VsZWN0aW9uO1xyXG4gICAgZG9tOiBIVE1MRWxlbWVudDtcclxuICAgIGdhbWU6IEdhbWU7XHJcbiAgICB0eXBlID0gXCJXb3JsZFwiO1xyXG4gICAgbGFzdFVwZGF0ZSA9IHVuZGVmaW5lZDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaXRpZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmFpcnBsYW5lcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2ludGVydmFsbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBfdGhpcy5haXJwbGFuZXM/Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAvKmlmICh0aGlzLmFpcnBsYW5lc1t4XS54IDwgNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSB0aGlzLmFpcnBsYW5lc1t4XS54ICsgMTtcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSAxMDA7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lc1t4XS51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcblxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0RWxlbWVudE9mZnNldChlbCkge1xyXG4gICAgICAgIGxldCB0b3AgPSAwO1xyXG4gICAgICAgIGxldCBsZWZ0ID0gMDtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGVsO1xyXG5cclxuICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIERPTSB0cmVlXHJcbiAgICAgICAgLy8gYW5kIGFkZCBpdCdzIHBhcmVudCdzIG9mZnNldCB0byBnZXQgcGFnZSBvZmZzZXRcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHRvcCArPSBlbGVtZW50Lm9mZnNldFRvcCB8fCAwO1xyXG4gICAgICAgICAgICBsZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdCB8fCAwO1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XHJcbiAgICAgICAgfSB3aGlsZSAoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRvcCxcclxuICAgICAgICAgICAgbGVmdCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZmluZEFpcnBsYW5lKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYWlycGxhbmVzW3hdLm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFpcnBsYW5lc1t4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYWlycGxhbmVzW3hdLnNxdWFkcm9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5haXJwbGFuZXNbeF0uc3F1YWRyb25baV0ubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFpcnBsYW5lc1t4XS5zcXVhZHJvbltpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uY29udGV4dG1lbnUoZXZ0OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICBpZih0aGlzLnNlbGVjdGlvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgIHZhciBwdD10aGlzLmdldEVsZW1lbnRPZmZzZXQoZXZ0LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICg8QWlycGxhbmU+dGhpcy5zZWxlY3Rpb24pLmZseVRvKGV2dC54LXB0LmxlZnQtOCxldnQueS1wdC50b3AtMTApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2dC5vZmZzZXRYKTtcclxuICAgICAgICAgICAgICAgIH0qL1xyXG5cclxuICAgIH1cclxuICAgIG9uY2xpY2sodGg6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsb3NlXCIpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uPy51bnNlbGVjdCgpO1xyXG4gICAgICAgIGlmICh0aC50YXJnZXQgPT09IHRoaXMuZG9tICYmICFBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLmRyb3BDaXRpZXNFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIFJvdXRlRGlhbG9nLmdldEluc3RhbmNlKCkuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBTcXVhZHJvbkRpYWxvZy5nZXRJbnN0YW5jZSgpLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5sYXN0VXBkYXRlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5sYXN0VXBkYXRlID0gdGhpcy5nYW1lLmRhdGUuZ2V0VGltZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdGllcz8ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgLyppZiAodGhpcy5haXJwbGFuZXNbeF0ueCA8IDUwMClcclxuICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnggPSB0aGlzLmFpcnBsYW5lc1t4XS54ICsgMTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gMTAwO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgdGhpcy5jaXRpZXNbeF0udXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmdhbWUuZGF0ZS5nZXREYXRlKCkgIT09IG5ldyBEYXRlKHRoaXMubGFzdFVwZGF0ZSkuZ2V0RGF0ZSgpKSB7XHJcbiAgICAgICAgICAgIHZhciBnZXMgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBnZXMgKz0gdGhpcy5haXJwbGFuZXNbeF0uZ2V0RGFpbHlDb3N0cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jaGFuZ2VNb25leSgtZ2VzLCBcImRhaWx5IGNvc3RzIGFpcnBsYW5lXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxhc3RVcGRhdGUgPSB0aGlzLmdhbWUuZGF0ZS5nZXRUaW1lKCk7XHJcbiAgICB9XHJcbiAgICBhZGRDaXR5KCkge1xyXG4gICAgICAgIHZhciBjaXR5OiBDaXR5ID0gY3JlYXRlQ2l0aWVzKHRoaXMsIDEpWzBdO1xyXG4gICAgICAgIGNpdHkucmVuZGVyKHRoaXMuY2l0aWVzLmluZGV4T2YoY2l0eSkpO1xyXG4gICAgICAgIGNpdHkudXBkYXRlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5ld0dhbWUoKSB7XHJcbiAgICAgICAgY3JlYXRlQ2l0aWVzKHRoaXMsIDE1KTtcclxuICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgMTsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBhcCA9IG5ldyBBaXJwbGFuZSh0aGlzKTtcclxuICAgICAgICAgICAgYXAubmFtZSA9IGFsbEFpcnBsYW5lVHlwZXNbMF0ubW9kZWwgKyAoeCArIDEpO1xyXG4gICAgICAgICAgICBhcC5zcGVlZCA9IGFsbEFpcnBsYW5lVHlwZXNbMF0uc3BlZWQ7XHJcbiAgICAgICAgICAgIGFwLmNvc3RzID0gYWxsQWlycGxhbmVUeXBlc1swXS5jb3N0cztcclxuICAgICAgICAgICAgYXAuY2FwYWNpdHkgPSBhbGxBaXJwbGFuZVR5cGVzWzBdLmNhcGFjaXR5O1xyXG4gICAgICAgICAgICBhcC54ID0gdGhpcy5jaXRpZXNbMF0ueDtcclxuICAgICAgICAgICAgYXAueSA9IHRoaXMuY2l0aWVzWzBdLnk7XHJcbiAgICAgICAgICAgIGFwLnR5cGVpZCA9IGFsbEFpcnBsYW5lVHlwZXNbMF0udHlwZWlkO1xyXG4gICAgICAgICAgICBhcC53b3JsZCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzLnB1c2goYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNpdGllc1swXS5ob3VzZXMgPSAxO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzWzBdLndhcmVob3VzZXMgPSAxO1xyXG4vKlxyXG5cclxuICAgICAgICAgdGhpcy5jaXRpZXM9W3RoaXMuY2l0aWVzWzBdXTtcclxuICAgICAgICB0aGlzLmNpdGllc1swXS5jb21wYW5pZXM9W107XHJcbiAgICAgICAgZm9yKHZhciB4PTA7eDwxOTt4Kyspe1xyXG4gICAgICAgICAgICB2YXIgY29tcD1uZXcgQ29tcGFueSgpO1xyXG4gICAgICAgICAgICBjb21wLmNpdHk9dGhpcy5jaXRpZXNbMF07XHJcbiAgICAgICAgICAgIGNvbXAucHJvZHVjdGlkPXg7XHJcbiAgICAgICAgICAgIGNvbXAud29ya2Vycz0yMCoxMDtcclxuICAgICAgICAgICAgY29tcC5idWlsZGluZ3M9MTA7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzWzBdLmNvbXBhbmllcy5wdXNoKGNvbXApO1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1swXS53YXJlaG91c2VbeF09MTAwMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2l0aWVzWzBdLnBlb3BsZT0xMCoxOSoyMDtcclxuICAgICAgICB0aGlzLmNpdGllc1swXS5ob3VzZXM9MTAqMTkqMjAvMTAwKzE7Ki9cclxuICAgIH1cclxuICAgIHJlbmRlcihkb206IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvbSA9IGRvbTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdGllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1t4XS5yZW5kZXIoeCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzW3hdLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBhcCA9IHRoaXMuYWlycGxhbmVzW3hdO1xyXG4gICAgICAgICAgICBhcC5yZW5kZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQoYXAuZG9tKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXY6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMub25jbGljayhldik7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXY6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMub25jb250ZXh0bWVudShldik7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgZmluZENpdHlBdCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2l0aWVzW2ldLnggPT09IHggJiYgdGhpcy5jaXRpZXNbaV0ueSA9PT0geSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2l0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWxsKTtcclxuICAgIH1cclxufVxyXG5cclxuIl19