import { World } from "game/world";
import { allProducts } from "game/product";
import { AirplaneDialog } from "game/airplanedialog";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export class Airplane {
    name: string;
    action:string;
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
    status:string="";
    constructor(world:World){
        this.world=world;
    }
    create() {
        var _this = this;
        this.dom = <any>document.createRange().createContextualFragment("<span style='transform:rotate(0turn)' class='mdi mdi-airplane'></span>").children[0];//document.createElement("span");
        this.dom.style.position = "absolute";
        this.x = getRandomInt(500);
        this.y = getRandomInt(500);
        this.action="wait";
        this.products=[];
        for(var x=0;x<allProducts.length;x++){
            this.products[x]=0;

        }
        this.dom.addEventListener("click", (ev: MouseEvent) => {
            _this.onclick(ev);
            return undefined;
        });
        this.lastUpdate=this.world.game.date.getTime();
        this.update();

    }
    
    flyTo(x: number, y: number) {
        this.lastUpdate=this.world.game.date.getTime();
        console.log("fly to "+x+":"+y)
        this.action="fly";
        this.targetX = x;
        this.targetY = y;
        this.update();
        for(var i=0;i<this.world.cities.length;i++){
            var pos=this.world.cities[i].airplanesInCity.indexOf(this);
            if(pos!==-1){
                this.world.cities[i].airplanesInCity.splice(pos,1);
            }
        }
    }
    select() {
        this.dom.style.color = "red";
    }
    unselect() {
        this.dom.style.color = "black";
    }
 calcNewPosition(){
        var pixelToTarget=Math.round( Math.sqrt(Math.pow(this.targetX-this.x,2)+Math.pow(this.targetY-this.y,2)));//Pytharoras
        var fromX=this.x;
        var fromY=this.y;
        var fromTime=0;
        var toX=this.targetX;
        var toY=this.targetY;
        var toTime=pixelToTarget/this.speed;    //t=s/v; in Tage
        var speedVectorX=toX-fromX;
        var speedVectorY=toY-fromY;
        var speedVectorTime=(toTime-fromTime);
        var nowTime=(this.world.game.date.getTime()-this.lastUpdate)/(1000*60*60*24);
        var nowX=Math.round((nowTime/speedVectorTime)*speedVectorX+fromX);
        var nowY=Math.round((nowTime/speedVectorTime)*speedVectorY+fromY);
        if(nowTime>=toTime){
            this.x=this.targetX;
            this.y=this.targetY;
            console.log("target arrived");
            this.targetX=undefined;
            this.targetY=undefined;
            this.action="wait";
            this.status="";
            this.world.findCityAt(this.x,this.y)?.airplanesInCity.push(this);
            this.dom.style.transform="rotate(0deg)";
        }else{
            var rad=Math.atan((fromX-toX)/(fromY-toY));
            var winkel=0;
            if(fromY>toY){
                winkel=360-rad*(180)/Math.PI;
            }else{
                winkel=180-rad*(180)/Math.PI;
            }
            var s=(""+winkel).replace(",",".");
            this.dom.style.transform="rotate("+s+"deg)";
           // console.log(pixelToTarget+" pixel in "+toTime+" seconds. Position "+nowX+" "+nowY+" lastupdate "+nowTime+" "+winkel+"°");
            this.x=nowX;
            this.y=nowY;
        }
    }
    update() {
       
        if(this.targetX!==undefined){
            this.calcNewPosition();
        }
        this.lastUpdate=this.world.game.date.getTime();
       this.dom.style.top = this.y + "px";
       this.dom.style.left = this.x + "px";

    }
    onclick(th: MouseEvent) {
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

//<span style='font-size:100px;'>&#9951;</span>