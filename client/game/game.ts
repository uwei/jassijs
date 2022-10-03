import { CityDialog } from "game/citydialog";
import { World } from "game/world";
import { Panel } from "jassijs/ui/Panel";
import windows from "jassijs/base/Windows";
import { AirplaneDialog } from "game/airplanedialog";

export class Game {
  static instance: Game;
  dom: HTMLElement;
  world: World;
  domHeader: HTMLDivElement;
  domWorld: HTMLDivElement;
  money;
  date: Date;
  lastUpdate: number;
  speed: number = 1;
  pausedSpeed: number;
  constructor() {
    var _this = this;
    Game.instance = this;
    this.money = 20000;
    this.lastUpdate = Date.now();
    this.date = new Date("Sat Jan 01 2000 00:00:00");
    CityDialog.instance = undefined;
  }
  update() {
    var _this = this;
    var diff = ((Date.now() - this.lastUpdate)) * 60 * 60 * this.speed;
    this.date = new Date(this.date.getTime() + diff);
    try{
    document.getElementById("gamemoney").innerHTML = this.money;
    document.getElementById("gamedate").innerHTML = this.date.toLocaleDateString() + " " + this.date.toLocaleTimeString();
    this.world.update();
    }catch{
      console.log("stop game");
      return;
    }
    this.lastUpdate = Date.now();
    setTimeout(() => {
      _this.update();

    }, 1000);
    CityDialog.getInstance().update();
    AirplaneDialog.getInstance().update();
    
  }
  create(dom: HTMLElement) {
    var _this = this;
    this.dom = dom;

    this.world = new World();
    this.world.game = this;
    var sdomHeader = `
          <div style="height:15px">
            Traffics <span id="gamedate"></span>   Money:<span id="gamemoney"></span>
          </div>  
        `;
    this.domHeader = <any>document.createRange().createContextualFragment(sdomHeader).children[0];
    
    var sdomWorld = `
          <div id="world" style="position:relative;width: 100%;height:calc(100% - 15px);">
          </div>  
        `;

    this.domWorld = <any>document.createRange().createContextualFragment(sdomWorld).children[0];
    this.dom.appendChild(this.domHeader);
    this.dom.appendChild(this.domWorld);
    this.world.create(this.domWorld);

    this.update();
    setTimeout(()=>{
      document.getElementById("gamedate").addEventListener("mousedown",()=>{
        console.log("down");
      });
    },500);
  }
  resume() {
    if(this.pausedSpeed!==undefined){
      this.speed=this.pausedSpeed;
      this.pausedSpeed=undefined;
    }
    
  }
  isPaused() {
    return this.pausedSpeed != undefined;
  }
  pause() {
    if (this.pausedSpeed !== undefined)
      return;
    this.pausedSpeed = this.speed;
    this.speed = 0.0000000000000000000001;
  }

  destroy() {
    this.world.destroy();
  }
}
