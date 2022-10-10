import { CityDialog } from "game/citydialog";
import { World } from "game/world";
import { Panel } from "jassijs/ui/Panel";
import windows from "jassijs/base/Windows";
import { AirplaneDialog } from "game/airplanedialog";
import { Icons } from "game/icons";
import { Company } from "game/company";
import { Airplane } from "game/airplane";
import { City } from "game/city";


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
  newGame() {
    this.world = new World();
    this.world.game = this;
    this.world.newGame();
  }
  render(dom: HTMLElement) {
    var _this = this;
    dom.innerHTML = "";
    this.dom = dom;
    var sdomHeader = `
          <div style="height:15px;position:fixed;">
            Traffics <span id="gamedate"></span>   Money:<span id="gamemoney"></span>`+ Icons.money + `
            <button id="save-game">`+ Icons.save + `</button> 
            <button id="load-game">`+ Icons.load + `</button> 
            <button id="debug-game">`+ Icons.debug + `</button> 
          </div>  
        `;
    this.domHeader = <any>document.createRange().createContextualFragment(sdomHeader).children[0];

    var sdomWorld = `
          <div id="world" style="position:relative;width: 100%;height:calc(100% - 15px);">
          </div>  
        `;

    this.domWorld = <any>document.createRange().createContextualFragment(sdomWorld).children[0];
    this.dom.appendChild(this.domHeader);
    var headerPlaceeholder = <any>document.createRange().createContextualFragment('<div style="height:15px"></div>').children[0]
    this.dom.appendChild(headerPlaceeholder);
    this.dom.appendChild(this.domWorld);
    this.world.render(this.domWorld);


    setTimeout(() => {
      _this.bindActions();
    }, 500);
  }
  bindActions() {
    var _this = this;
    document.getElementById("gamedate").addEventListener("mousedown", () => {
      console.log("down");
    });
    document.getElementById("save-game").addEventListener("click", () => {
      _this.save();
    });
    document.getElementById("load-game").addEventListener("click", () => {
      _this.load();
    });
    document.getElementById("debug-game").addEventListener("click", () => {
      _this.world.addCity();
    });
  }
  save() {
    this.pause();
    var sdata = JSON.stringify(this, (key: string, value: any) => {
      var ret: any = {};
      if (value instanceof HTMLElement) {
        return undefined;
      }
      if (key === "lastUpdate")
        return undefined;
      if (value?.constructor?.name === "World") {
        Object.assign(ret, value);
        delete ret.game;
        return ret;
      }
      if (value?.constructor?.name === "Airplane") {

        Object.assign(ret, value);
        delete ret.world;
        return ret;
      }
      if (value?.constructor?.name === "City") {

        Object.assign(ret, value);
        delete ret.world;
        return ret;
      }
      return value;
    }, "\t");
    window.localStorage.setItem("savegame", sdata);
    //this.load();
    console.log(sdata);
    this.resume();

  }
  load() {
    this.pause();
    var data = window.localStorage.getItem("savegame");
    var ret = JSON.parse(data, (key, value) => {
      var r: any = value;
      if(value===null)
        return undefined;
      if (value?.type === "Company") {
        r = new Company();
        Object.assign(r, value);
        return r;
      }
      if (value?.type === "Airplane") {
        r = new Airplane(undefined);
        Object.assign(r, value);
        return r;
      }
      if (value?.type === "World") {
        r = new World();
        Object.assign(r, value);
        return r;
      }
      if (value?.type === "City") {
        r = new City();
        Object.assign(r, value);
        return r;
      }
      return r;
    });
    Object.assign(this, ret);
    this.world.game = this;
    this.date = new Date(this.date);
    for (var x = 0; x < this.world.airplanes.length; x++) {
      this.world.airplanes[x].world = this.world;

    }
    for (var x = 0; x < this.world.cities.length; x++) {
      this.world.cities[x].world = this.world;
      //for(var y=0;y<this.world.cities[x].companies.length;y++){
      //  this.world.cities[x].companies[y].
      //}
    }
    this.render(this.dom);
    this.resume();
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

export function test() {

}
