define(["require", "exports", "game/product", "game/airplanedialog"], function (require, exports, product_1, airplanedialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Airplane = void 0;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    //
    class Airplane {
        constructor(world) {
            this.status = "";
            this.activeRoute = 0;
            this.world = world;
            this.route = [];
            /*  for(var x=0;x<4;x++){
                  var rt=new Route();
                  rt.cityid=x;
                  this.route.push(rt);
              }*/
        }
        create() {
            var _this = this;
            this.dom = document.createRange().createContextualFragment("<span style='transform:rotate(0turn)' class='mdi mdi-airplane'></span>").children[0]; //document.createElement("span");
            this.dom.style.position = "absolute";
            this.x = getRandomInt(this.world.game.mapWidth);
            this.y = getRandomInt(this.world.game.mapHeight);
            this.action = "wait";
            this.products = [];
            for (var x = 0; x < product_1.allProducts.length; x++) {
                this.products[x] = 0;
            }
            this.dom.addEventListener("click", (ev) => {
                _this.onclick(ev);
                return undefined;
            });
            this.lastUpdate = this.world.game.date.getTime();
            this.update();
        }
        flyTo(city) {
            var x = city.x;
            var y = city.y;
            this.lastUpdate = this.world.game.date.getTime();
            console.log("fly to " + city.name);
            this.action = "fly";
            this.status = "fly to " + city.name;
            this.targetX = x;
            this.targetY = y;
            this.update();
            for (var i = 0; i < this.world.cities.length; i++) {
                var pos = this.world.cities[i].airplanesInCity.indexOf(this);
                if (pos !== -1) {
                    this.world.cities[i].airplanesInCity.splice(pos, 1);
                }
            }
        }
        select() {
            this.dom.style.color = "red";
        }
        unselect() {
            this.dom.style.color = "black";
        }
        arrived() {
            var _a;
            console.log("target arrived");
            this.targetX = undefined;
            this.targetY = undefined;
            this.action = "wait";
            this.status = "";
            (_a = this.world.findCityAt(this.x, this.y)) === null || _a === void 0 ? void 0 : _a.airplanesInCity.push(this);
            this.dom.style.transform = "rotate(0deg)";
            if (this.activeRoute !== -1) {
                console.log("unload now");
                this.action = "unload";
                this.status = "unload";
                this.lastAction = this.lastUpdate;
            }
        }
        calcNewPosition() {
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
                this.dom.style.transform = "rotate(" + s + "deg)";
                // console.log(pixelToTarget+" pixel in "+toTime+" seconds. Position "+nowX+" "+nowY+" lastupdate "+nowTime+" "+winkel+"°");
                this.x = nowX;
                this.y = nowY;
            }
        }
        update() {
            if (this.targetX !== undefined) {
                this.calcNewPosition();
            }
            this.lastUpdate = this.world.game.date.getTime();
            this.dom.style.top = this.y + "px";
            this.dom.style.left = (this.x - 15) + "px";
            if (this.activeRoute !== -1 && this.route.length > 1) {
                if (this.action === "unload" && (this.lastUpdate - this.lastAction) > (3 * 1000 * 60 * 60)) {
                    console.log("load now");
                    this.action = "load";
                    this.status = "load";
                    this.lastAction = this.lastUpdate;
                }
                if (this.action === "load" && (this.lastUpdate - this.lastAction) > (3 * 1000 * 60 * 60)) {
                    this.activeRoute++;
                    if (this.activeRoute === this.route.length)
                        this.activeRoute = 0;
                    var city = this.world.cities[this.route[this.activeRoute].cityid];
                    this.flyTo(city);
                    this.lastAction = this.lastUpdate;
                }
            }
        }
        onclick(th) {
            var _a;
            th.preventDefault();
            th.stopPropagation();
            console.log(this.name);
            (_a = this.world.selection) === null || _a === void 0 ? void 0 : _a.unselect();
            this.world.selection = this;
            this.select();
            var h = airplanedialog_1.AirplaneDialog.getInstance();
            h.airplane = this;
            h.show();
        }
    }
    exports.Airplane = Airplane;
});
//<span style='font-size:100px;'>&#9951;</span>
//# sourceMappingURL=airplane.js.map