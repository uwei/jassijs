import { CityDialog } from "game/citydialog";
import { World } from "game/world";
import { Panel } from "jassijs/ui/Panel";
import windows from "jassijs/base/Windows";
import { AirplaneDialog } from "game/airplanedialog";
import { Icons } from "game/icons";
import { Company } from "game/company";
import { Airplane } from "game/airplane";
import { City } from "game/city";
import { Route } from "game/route";
import {  Product } from "game/product";
import { DiagramDialog } from "game/diagramdialog";

window.onbeforeunload = function () {
  return "Do you want to exit?";

};
class Statistic {
  today: { [key: string]: number } = {};
  yesterday: { [key: string]: number } = {};
}

declare global {
  var parameter:Parameter;
}

export class Parameter {
  ratePurchase = 1.125;
  rateSelling = 1.25;
  ratePriceMin = 0.66;
  ratePriceMax = 1.33;
  rateBuyAirplane = 1;
  rateBuyBuilding = 1;
  rateBuyBuildingGrowFactor = 5000;
  rateCostsAirplaine = 1;
  rateCostsshop = 100;
  rateCostsshopMany = 1000;
  workerInCompany = 20;
  neutralStartPeople = 200;
  neutralProductionRate = 2;
  newAirportRate=1.05;
  allProducts:Product[];
  allAirplaneTypes=[
    {typeid:0,model:"Airplane A",speed:200,capacity:200, costs:60,buildDays:25,buildingCosts:20000,buildingMaterial:[0,0,0,40,0,10,0,10,0,10,0,0,0,0,10]},
    {typeid:1,model:"Airplane B",speed:210,capacity:300, costs:90,buildDays:30,buildingCosts:41000,buildingMaterial:[0,0,0,60,0,20,0,20,0,20,0,0,0,0,20]},
    {typeid:2,model:"Airplane C",speed:220,capacity:500, costs:150,buildDays:39,buildingCosts:60000,buildingMaterial:[0,0,0,100,0,30,0,30,0,30,0,0,0,0,30]},
    {typeid:3,model:"Airplane D",speed:240,capacity:650, costs:180,buildDays:45,buildingCosts:75000,buildingMaterial:[0,0,0,120,0,40,0,40,0,40,0,0,0,0,40]},
    {typeid:4,model:"Airplane E",speed:260,capacity:1000, costs:270,buildDays:56,buildingCosts:150000,buildingMaterial:[0,0,0,200,0,50,0,50,0,50,0,0,0,0,50]},
    {typeid:5,model:"Airplane F",speed:300,capacity:2000, costs:500,buildDays:79,buildingCosts:300000,buildingMaterial:[0,0,0,400,0,100,0,100,0,100,0,0,0,0,100]},
    ];
}
window.parameter=new Parameter();
globalThis.parameter=new Parameter();


parameter.allProducts= [
  new Product({ id: 0, name: "Stein", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0,  priceProduction: 32,  distribution: 16,amountForPeople:5 }),
  new Product({ id: 1, name: "Holz", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0,  priceProduction: 32,  distribution: 16 ,amountForPeople:4.5 }),
  new Product({ id: 2, name: "Getreide", dailyProduce: 7, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0,  priceProduction: 23,distribution: 16,amountForPeople:4  }),
  new Product({ id: 3, name: "Eisen", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0,  priceProduction: 32, distribution: 16,amountForPeople:3  }),
  new Product({ id: 4, name: "Wolle", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0,  priceProduction: 32, distribution: 16,amountForPeople:2.5  }),
  new Product({ id: 5, name: "Öl", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0,  priceProduction:32,  distribution: 16,amountForPeople:3  }),
  new Product({ id: 6, name: "Brot", dailyProduce: 6, input1: 2, input1Amount: 2, input2: undefined, input2Amount: 0, priceProduction: 49, distribution: 8,amountForPeople:5  }),
  new Product({ id: 7, name: "Plaste", dailyProduce: 6, input1: 5, input1Amount: 2, input2: undefined, input2Amount: 0, priceProduction: 57,  distribution: 8 ,amountForPeople:5 }),
  new Product({ id: 8, name: "Fleisch", dailyProduce: 2, input1: 2, input1Amount: 1, input2: undefined, input2Amount: 0,  priceProduction: 109, distribution: 8,amountForPeople:2  }),
  new Product({ id: 9, name: "Möbel", dailyProduce: 2, input1: 1, input1Amount: 0.5, input2: 3, input2Amount: 1,  priceProduction: 117,  distribution: 8,amountForPeople:2  }),
  new Product({ id: 10, name: "Kleidung", dailyProduce: 1, input1: 4, input1Amount: 2, input2: undefined, input2Amount: 0,  priceProduction: 286,  distribution: 8,amountForPeople:1  }),
  new Product({ id: 11, name: "Fisch", dailyProduce: 3, input1: undefined, input1Amount: undefined, input2: undefined, input2Amount: 0, priceProduction: 60,distribution: 8,amountForPeople:2  }),
  new Product({ id: 12, name: "Apfel", dailyProduce: 4, input1: undefined, input1Amount: undefined, input2: undefined, input2Amount: 0,priceProduction: 45,  distribution: 8 ,amountForPeople:3 }),
  new Product({ id: 13, name: "Saft", dailyProduce: 3, input1: 12, input1Amount: 1, input2: undefined, input2Amount: 0,priceProduction: 85,  distribution: 8 ,amountForPeople:3 }),
  new Product({ id: 14, name: "Gold", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0,  priceProduction: 100,  distribution: 4 ,amountForPeople: 1}), 
  new Product({ id: 15, name: "Schmuck", dailyProduce: 2, input1: 14, input1Amount: 1, input2: undefined, input2Amount: 0,  priceProduction: 184, distribution: 4 ,amountForPeople:2 }),
  new Product({ id: 16, name: "Spielzeug", dailyProduce: 1, input1: 4, input1Amount: 0.5, input2: 7, input2Amount: 0.5,  priceProduction: 274,  distribution: 4,amountForPeople:1  }),
  new Product({ id: 17, name: "Fahrrad", dailyProduce: 1, input1: 3, input1Amount: 1, input2: 7, input2Amount: 0.5,  priceProduction: 274,  distribution: 4 ,amountForPeople:1 }),
  new Product({ id: 18, name: "Fischbrot", dailyProduce: 1, input1: 11, input1Amount: 1, input2: 6, input2Amount: 1,  priceProduction: 382,  distribution: 4 ,amountForPeople:1 })
];
//global.parameter=new Parametetr();
export class Game {
  static instance: Game;
  dom: HTMLElement;
  world: World;
  domHeader: HTMLDivElement;
  domWorld: HTMLDivElement;
  _money;
  version:"1.0";
  date: Date;
  lastUpdate: number;
  speed: number = 1;
  pausedSpeed: number;
  timer;
  mapWidth = 1000;
  mapHeight = 600;
  statistic = new Statistic();
  static temposcale = [0.01, 0.5, 1, 2, 4, 8, 16, 32, 64, 128]
  constructor() {
    var _this = this;
    Game.instance = this;

    this.lastUpdate = Date.now();
    this.date = new Date("Sat Jan 01 2000 00:00:00");
    CityDialog.instance = undefined;
    this.nevercallthisfunction();
  }
  public updateTitle() {
    try {
      document.getElementById("gamemoney").innerHTML = new Number(this.getMoney()).toLocaleString();
      document.getElementById("gamedate").innerHTML = this.date.toLocaleDateString();
      this.world.update();
    } catch {
      console.log("stop game");
      return;
    }
  }
  updateSize() {
    this.domWorld.style.width = (this.mapWidth + 80) + "px";
    this.domWorld.style.height = (this.mapHeight + 100) + "px";
    (<HTMLElement>this.domWorld.parentNode).style.width = (this.mapWidth + 80) + "px";
    (<HTMLElement>this.domWorld.parentNode).style.height = (this.mapHeight + 100) + "px";

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
    this._money = 20000;
    this.world.newGame();
  }
  getMoney() {
    return this._money;
  }
  changeMoney(change: number, why: string, city: City = undefined) {
    this._money += change;
    if (this.statistic.today[why] === undefined)
      this.statistic.today[why] = 0;
    this.statistic.today[why] += change;
    //  console.log(change+" "+why);
  }
  render(dom: HTMLElement) {
    var _this = this;
    dom.innerHTML = "";
    dom.style.backgroundColor = "lightblue";
    this.dom = dom;
    var sdomHeader = `
          <div style="height:15px;position:fixed;z-index:10000;background-color:lightblue;">
            Traffics 
            <button id="game-slower">`+ Icons.minus + `</button> 
            <span id="gamedate"></span>   
            <button id="game-faster">`+ Icons.plus + `</button> 
            Money:<span id="gamemoney"></span>`+ Icons.money + `
            <button id="save-game">`+ Icons.save + `</button> 
            <button id="debug-game">`+ Icons.debug + `</button> 
            <button id="load-game">`+ Icons.load + `</button> 
            <button id="show-diagram">`+ Icons.diagram + `</button> 
          </div>  
        `;
    this.domHeader = <any>document.createRange().createContextualFragment(sdomHeader).children[0];

    var sdomWorld = `
          <div id="world" style="position:absolute;top:20px;">
          </div>  
        `;

    this.domWorld = <any>document.createRange().createContextualFragment(sdomWorld).children[0];
    this.dom.appendChild(this.domHeader);
    // var headerPlaceeholder = <any>document.createRange().createContextualFragment('<div style="height:15px"></div>').children[0]
    // this.dom.appendChild(headerPlaceeholder);
    this.dom.appendChild(this.domWorld);
    this.world.render(this.domWorld);
    this.updateSize();

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
      for (var x = 0; x < parameter.allProducts.length; x++) {
        _this.world.cities[0].shop[x] = 5000;
      }
      _this._money = 1000000;
    });
    document.getElementById("show-diagram").addEventListener("click", () => {
      DiagramDialog.getInstance().world = this.world;
      DiagramDialog.getInstance().show();
    });
    document.getElementById("game-slower").addEventListener("click", () => {
      if (_this.speed === Game.temposcale[0]) {
        _this.pause();
        console.log("pause");
        return;
      }
      var pos = Game.temposcale.indexOf(_this.speed);
      pos--;
      if (pos == -1)
        return;
      _this.speed = Game.temposcale[pos];
      _this.pause();
      _this.resume();
    });
    document.getElementById("game-faster").addEventListener("click", () => {
      if (_this.isPaused()) {
        _this.resume();
        return;
      }
      var pos = Game.temposcale.indexOf(_this.speed);
      pos++;
      if (pos >= Game.temposcale.length) {
        console.log("max");
        return;
      }
      _this.speed = Game.temposcale[pos];
      _this.pause();
      _this.resume();
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
      if (value?.constructor?.name === "Company") {
        Object.assign(ret, value);
        delete ret.city;
        return ret;
      }
      if (value?.constructor?.name === "Route") {

        Object.assign(ret, value);
        delete ret.airplane;
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
      if (value === null)
        return undefined;
      if (value?.type === "Company") {
        r = new Company();
        Object.assign(r, value);
        return r;
      }
      if (value?.type === "Product") {
        r = new Product(value);
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
      if (value?.type === "Route") {
        r = new Route();
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
      for (var y = 0; y < this.world.airplanes[x].route.length; y++) {
        this.world.airplanes[x].route[y].airplane = this.world.airplanes[x];
      }
    }
    for (var x = 0; x < this.world.cities.length; x++) {
      this.world.cities[x].world = this.world;
      for (var y = 0; y < this.world.cities[x].companies.length; y++) {
        this.world.cities[x].companies[y].city = this.world.cities[x];
      }
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
