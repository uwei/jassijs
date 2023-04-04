define(["require", "exports", "game/airplanedialog"], function (require, exports, airplanedialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Airplane = void 0;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    //
    class Airplane {
        get squadron() {
            return []; //Geschwader
        }
        set squadron(val) {
            //Geschwader
        }
        constructor(world) {
            this.status = "";
            this.loadedCount = 0;
            this.activeRoute = -1;
            this.type = "Airplane";
            this.world = world;
            this.route = [];
            this.products = [];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                this.products[x] = 0;
            }
            this.typeid = 1;
            this.action = "";
            /*  for(var x=0;x<4;x++){
                  var rt=new Route();
                  rt.cityid=x;
                  this.route.push(rt);
              }*/
        }
        getCurrentCity() {
            for (var x = 0; x < this.world.cities.length; x++) {
                if (this.world.cities[x].x === this.x && this.world.cities[x].y === this.y) {
                    return this.world.cities[x];
                }
            }
            return undefined;
        }
        upgrade() {
            this.typeid++;
            this.speed = Math.round(this.speed * 1.02);
            this.capacity = Math.round(this.capacity * 1.5);
            this.world.game.changeMoney(-this.typeid * 10000, "upgrade airplane");
            this.costs = Math.round(this.costs * 1.5);
        }
        updateSquadron() {
            var speed = parameter.allAirplaneTypes[this.typeid].speed;
            var capacity = parameter.allAirplaneTypes[this.typeid].capacity;
            for (var x = 0; x < this.squadron.length; x++) {
                speed = Math.min(this.squadron[x].speed, speed);
                capacity += this.squadron[x].capacity;
            }
            this.speed = speed;
            this.capacity = capacity;
        }
        render() {
            var _this = this;
            this.dom = document.createRange().createContextualFragment("<span z-index:2;style='font-size:20px;transform:rotate(0turn)' class='mdi mdi-airplane'></span>").children[0]; //document.createElement("span");
            this.dom.style.position = "absolute";
            this.dom.style.zIndex = "10";
            this.dom.addEventListener("click", (ev) => {
                _this.onclick(ev);
                return undefined;
            });
            this.lastUpdate = this.world.game.date.getTime();
            this.update();
        }
        refreshLoadedCount() {
            var all = 0;
            for (var x = 0; x < parameter.allProducts.length; x++) {
                all += this.products[x];
            }
            this.loadedCount = all;
        }
        flyTo(city) {
            var x = city.x;
            var y = city.y;
            this.lastUpdate = this.world.game.date.getTime();
            // console.log("fly to " + city.name)
            this.action = "fly";
            this.status = "fly to " + city.name;
            this.targetX = x;
            this.targetY = y;
            this.update();
        }
        select() {
            if (this.dom)
                this.dom.classList.add("airplane_selected");
        }
        unselect() {
            if (this.dom)
                this.dom.classList.remove("airplane_selected");
        }
        arrived() {
            this.targetX = undefined;
            this.targetY = undefined;
            this.action = "";
            this.status = "";
            this.dom.style.transform = "rotate(0deg)";
            if (this.activeRoute !== -1) {
                this.action = "unload";
                this.status = "unload";
                this.lastAction = this.lastUpdate;
            }
        }
        calcNewPosition() {
            var _this = this;
            var pixelToTarget = Math.round(Math.sqrt(Math.pow(this.targetX - this.x, 2) + Math.pow(this.targetY - this.y, 2))); //Pytharoras
            var fromX = this.x;
            var fromY = this.y;
            var fromTime = 0;
            var toX = this.targetX;
            var toY = this.targetY;
            var toTime = pixelToTarget / this.speed; //t=s/v; in Tage
            var speedVectorX = toX - fromX;
            var speedVectorY = toY - fromY;
            var speedVectorTime = (toTime - fromTime);
            var nowTime = (this.world.game.date.getTime() - this.lastUpdate) / (1000 * 60 * 60 * 24);
            var nowX = Math.round((nowTime / speedVectorTime) * speedVectorX + fromX);
            var nowY = Math.round((nowTime / speedVectorTime) * speedVectorY + fromY);
            if (nowTime >= toTime) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.arrived();
            }
            else {
                var rad = Math.atan((fromX - toX) / (fromY - toY));
                var winkel = 0;
                if (fromY > toY) {
                    winkel = 360 - rad * (180) / Math.PI;
                }
                else {
                    winkel = 180 - rad * (180) / Math.PI;
                }
                var s = ("" + winkel).replace(",", ".");
                //   setTimeout(()=>{
                _this.dom.style.transform = "rotate(" + s + "deg)";
                //   });
                // console.log(pixelToTarget+" pixel in "+toTime+" seconds. Position "+nowX+" "+nowY+" lastupdate "+nowTime+" "+winkel+"°");
                this.x = nowX;
                this.y = nowY;
            }
        }
        update() {
            if (!this.dom) {
                return;
            }
            if (this.loadedCount === this.capacity && !this.dom.classList.contains("airplane_fullloaded")) {
                this.dom.classList.add("airplane_fullloaded");
            }
            if (this.loadedCount !== this.capacity && this.dom.classList.contains("airplane_fullloaded")) {
                this.dom.classList.remove("airplane_fullloaded");
            }
            if (this.status === "" && !this.dom.classList.contains("airplane_lazy")) {
                this.dom.classList.add("airplane_lazy");
            }
            if (this.status !== "" && this.dom.classList.contains("airplane_lazy")) {
                this.dom.classList.remove("airplane_lazy");
            }
            if (this.targetX !== undefined) {
                this.calcNewPosition();
            }
            this.lastUpdate = this.world.game.date.getTime();
            this.dom.style.top = this.y + "px";
            this.dom.style.left = (this.x - 18) + "px";
            if (this.activeRoute !== -1 && this.route.length > 1) {
                if (this.action === "unload" && (this.lastUpdate - this.lastAction) > (3 * 1000 * 60 * 60)) {
                    // console.log("load now");
                    this.action = "load";
                    this.status = "load";
                    this.lastAction = this.lastUpdate;
                    if (this.activeRoute >= this.route.length) {
                        this.activeRoute = 0;
                    }
                    else
                        this.route[this.activeRoute].unload();
                    airplanedialog_1.AirplaneDialog.getInstance().update();
                }
                if (this.action === "load" && (this.lastUpdate - this.lastAction) > (3 * 1000 * 60 * 60)) {
                    this.lastAction = this.lastUpdate;
                    if (this.activeRoute >= this.route.length)
                        this.activeRoute = 0;
                    else
                        this.route[this.activeRoute].load();
                    airplanedialog_1.AirplaneDialog.getInstance().update();
                    this.activeRoute++;
                    if (this.activeRoute >= this.route.length)
                        this.activeRoute = 0;
                    var city = this.world.cities[this.route[this.activeRoute].cityid];
                    this.flyTo(city);
                }
            }
        }
        onclick(th) {
            var _a;
            th.preventDefault();
            th.stopPropagation();
            (_a = this.world.selection) === null || _a === void 0 ? void 0 : _a.unselect();
            this.world.selection = this;
            this.select();
            var h = airplanedialog_1.AirplaneDialog.getInstance();
            h.airplane = this;
            h.show();
        }
        getDailyCosts() {
            /*var ret=parameter.allAirplaneTypes[this.typeid].costs;
            for(var x=0;x<this.squadron.length;x++){
                ret+=parameter.allAirplaneTypes[this.squadron[x].typeid].costs;
            }
            return ret;*/
            return this.costs;
        }
    }
    exports.Airplane = Airplane;
});
//<span style='font-size:100px;'>&#9951;</span>
//# sourceMappingURL=airplane.js.map