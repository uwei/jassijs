import { World } from "game/world";
import { allProducts } from "game/product";
import { AirplaneDialog } from "game/airplanedialog";
import { Route } from "game/route";
import { City } from "game/city";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
//
export class Airplane {
    typeid:number;
    name: string;
    action: string;
    lastAction: number;
    x: number;
    y: number;
    //pixel pro second
    speed: number;
    lastUpdate: number;
    targetX: number;
    targetY: number;
    dom: HTMLSpanElement;
    world: World;
    products;
    status: string = "";
    route: Route[];
    costs:number;
    capacity:number;
    loadedCount:number=0;
    activeRoute = 0;
    squadron:Airplane[]=[];//Geschwader
    type = "Airplane";
    constructor(world: World) {
        this.world = world;
        this.route = [];
         this.products = [];
          for (var x = 0; x < allProducts.length; x++) {
            this.products[x] = 0;

        }
        this.typeid=1;
        /*  for(var x=0;x<4;x++){
              var rt=new Route();
              rt.cityid=x;
              this.route.push(rt);
          }*/
    } 
    getCurrentCity(){
        
        for (var x = 0; x < this.world.cities.length; x++) {
            if (this.world.cities[x].x===this.x&&this.world.cities[x].y===this.y) {
                return this.world.cities[x];
            }
        }
        return undefined;
    }
    updateSquadron(){
        var speed=allAirplaneTypes[this.typeid].speed;
        var capacity=allAirplaneTypes[this.typeid].capacity;
        for(var x=0;x<this.squadron.length;x++){
            speed=Math.min(this.squadron[x].speed,speed);
            capacity+=this.squadron[x].capacity;
        }
        this.speed=speed;
        this.capacity=capacity;
    }
    render() {
        var _this = this;
        this.dom = <any>document.createRange().createContextualFragment("<span style='font-size:20px;transform:rotate(0turn)' class='mdi mdi-airplane'></span>").children[0];//document.createElement("span");
        this.dom.style.position = "absolute";

        this.action = "wait";
       
       
        this.dom.addEventListener("click", (ev: MouseEvent) => {
            _this.onclick(ev);
            return undefined;
        });
        this.lastUpdate = this.world.game.date.getTime();
        this.update();

    }
    refreshLoadedCount(){
        var all=0;
        for(var x=0;x<allProducts.length;x++){
            all+=this.products[x];
        }
        this.loadedCount=all;
    }
    flyTo(city: City) {
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
            this.dom.style.color = "red";
    }
    unselect() {
        if (this.dom)
            this.dom.style.color = "black";
    }
    arrived() {
        console.log("target arrived");
        this.targetX = undefined;
        this.targetY = undefined;
        this.action = "wait";
        this.status = "";
        this.dom.style.transform = "rotate(0deg)";
        if (this.activeRoute !== -1) {
            console.log("unload now");
            this.action = "unload";
            this.status = "unload";
            this.lastAction = this.lastUpdate;
        }
    }
    calcNewPosition() {
        var pixelToTarget = Math.round(Math.sqrt(Math.pow(this.targetX - this.x, 2) + Math.pow(this.targetY - this.y, 2)));//Pytharoras
        var fromX = this.x;
        var fromY = this.y;
        var fromTime = 0;
        var toX = this.targetX;
        var toY = this.targetY;
        var toTime = pixelToTarget / this.speed;    //t=s/v; in Tage
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
        } else {
            var rad = Math.atan((fromX - toX) / (fromY - toY));
            var winkel = 0;
            if (fromY > toY) {
                winkel = 360 - rad * (180) / Math.PI;
            } else {
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
                // console.log("load now");
                this.action = "load";
                this.status = "load";
                this.lastAction = this.lastUpdate;
                 if(this.activeRoute>=this.route.length){
                    this.activeRoute=0;
                 }else
                    this.route[this.activeRoute].unload();
                AirplaneDialog.getInstance().update();
            }
            if (this.action === "load" && (this.lastUpdate - this.lastAction) > (3 * 1000 * 60 * 60)) {

                this.lastAction = this.lastUpdate;
                if(this.activeRoute>=this.route.length)
                    this.activeRoute=0;
                else
                    this.route[this.activeRoute].load();
                AirplaneDialog.getInstance().update();
                this.activeRoute++;
                if(this.activeRoute>=this.route.length)
                    this.activeRoute=0;
                var city = this.world.cities[this.route[this.activeRoute].cityid];
                this.flyTo(city);

            }
        }
    }
    onclick(th: MouseEvent) {
        th.preventDefault();
        th.stopPropagation();
        console.log(this.name);
        this.world.selection?.unselect();
        this.world.selection = this;
        this.select();
        var h = AirplaneDialog.getInstance();
        h.airplane = this;
        h.show();

    }
}
var allAirplaneTypes=[
{typeid:0,model:"Airplane A",speed:200,capacity:200, costs:20,buildDays:25,buildingCosts:11000,buildingMaterial:[0,0,0,40,0,10,0,10,0,10,0,0,0,0,10]},
{typeid:1,model:"Airplane B",speed:210,capacity:300, costs:30,buildDays:30,buildingCosts:21000,buildingMaterial:[0,0,0,60,0,20,0,20,0,20,0,0,0,0,20]},
{typeid:2,model:"Airplane C",speed:220,capacity:500, costs:50,buildDays:39,buildingCosts:32000,buildingMaterial:[0,0,0,100,0,30,0,30,0,30,0,0,0,0,30]},
{typeid:3,model:"Airplane D",speed:240,capacity:650, costs:65,buildDays:45,buildingCosts:55000,buildingMaterial:[0,0,0,120,0,40,0,40,0,40,0,0,0,0,40]},
{typeid:4,model:"Airplane E",speed:260,capacity:1000, costs:100,buildDays:56,buildingCosts:109000,buildingMaterial:[0,0,0,200,0,50,0,50,0,50,0,0,0,0,50]},
{typeid:5,model:"Airplane F",speed:280,capacity:2000, costs:200,buildDays:79,buildingCosts:110000,buildingMaterial:[0,0,0,400,0,100,0,100,0,100,0,0,0,0,100]},
];
export{allAirplaneTypes};
//<span style='font-size:100px;'>&#9951;</span>