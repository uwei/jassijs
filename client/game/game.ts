import { CityDialog } from "game/citydialog";
import { World } from "game/world";
import { Panel } from "jassijs/ui/Panel";
import windows from "jassijs/base/Windows";
import { AirplaneDialog } from "game/airplanedialog";
import { Icons } from "game/icons";


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
  timer;
  mapWidth = 1000;
  mapHeight = 600;
  constructor() {
    var _this = this;
    Game.instance = this;
    this.money = 2000000;
    this.lastUpdate = Date.now();
    this.date = new Date("Sat Jan 01 2000 00:00:00");
    CityDialog.instance = undefined;
    this.nevercallthisfunction();
  }
  public updateTitle() {
    try {
      document.getElementById("gamemoney").innerHTML = new Number(this.money).toLocaleString();
      document.getElementById("gamedate").innerHTML = this.date.toLocaleDateString() + " " + this.date.toLocaleTimeString().substring(0, this.date.toLocaleTimeString().length - 3);
      this.world.update();
    } catch {
      console.log("stop game");
      return;
    }
  }
  //never call this outside the timer - then would be 2 updates
  private nevercallthisfunction() {
    //var t=new Date().getTime();
    var intervall = 1000 / this.speed;
    var _this = this;
    var diff = 1000 * 60 * 60;//update always at full clock//((Date.now() - this.lastUpdate)) * 60 * 60 * this.speed;
    this.date = new Date(this.date.getTime() + diff);
    this.updateTitle();
    this.lastUpdate = Date.now();
    this.timer = setTimeout(() => {
      _this.nevercallthisfunction();

    }, intervall);
    //console.log("tooks"+(new Date().getTime()-t));
    CityDialog.getInstance().update();
    AirplaneDialog.getInstance().update();

  }
  create(dom: HTMLElement) {
    var _this = this;
    this.dom = dom;

    this.world = new World();
    this.world.game = this;
    var sdomHeader = `
          <div style="height:15px;position:fixed;">
            Traffics <span id="gamedate"></span>   Money:<span id="gamemoney"></span>`+ Icons.money + `
          </div>  
        `;
    this.domHeader = <any>document.createRange().createContextualFragment(sdomHeader).children[0];

    var sdomWorld = `
          <div id="world" style="position:relative;width: 100%;height:calc(100% - 15px);">
          </div>  
        `;

    this.domWorld = <any>document.createRange().createContextualFragment(sdomWorld).children[0];
    this.dom.appendChild(this.domHeader);
    var headerPlaceeholder=<any>document.createRange().createContextualFragment('<div style="height:15px"></div>').children[0]
    this.dom.appendChild(headerPlaceeholder);
    this.dom.appendChild(this.domWorld);
    this.world.create(this.domWorld);


    setTimeout(() => {
      document.getElementById("gamedate").addEventListener("mousedown", () => {
        console.log("down");
      });
    }, 500);
  }
  resume() {
    if (this.timer === 0)
      this.nevercallthisfunction();
  }
  isPaused() {
    return this.timer === 0;
  }
  pause() {
    clearTimeout(this.timer);
    this.timer = 0;
  }

  destroy() {
    this.world.destroy();
    clearTimeout(this.timer);
  }
}

export function test(){

}
