import { CityDialog } from "game/citydialog";
import { World } from "game/world";
import { Panel } from "jassijs/ui/Panel";
import windows from "jassijs/base/Windows";
import { AirplaneDialog } from "game/airplanedialog";
import { Icons } from "game/icons";
import { Company } from "game/company";
import { Airplane } from "game/airplane";
import { City, createCities } from "game/city";
import { Route } from "game/route";
import { Product } from "game/product";
import { DiagramDialog } from "game/diagramdialog";
import { SaveDialog } from "game/savedialog";
var gameversion = "3.0";
window.onbeforeunload = function () {
  return "Do you want to exit?";

};
export class Statistic {
  today: { [key: string]: number } = {};
  yesterday: { [key: string]: number } = {};
  successfulLoad: any[];
  unsuccessfulLoad: any[];
  constructor() {
    this.successfulLoad = [];
    this.unsuccessfulLoad = [];
    for (var x = 0; x < 7; x++) {
      var data1 = [];
      var data2 = [];
      for (var y = 0; y < parameter.allProducts.length; y++) {
        data1.push(0);
        data2.push(0);
      }
      this.successfulLoad.push(data1);
      this.unsuccessfulLoad.push(data2);
    }
  }
  lastPriceChange: string;
}

declare global {
  var parameter: Parameter;
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
  rateCostShop = 100;
  rateCostsShopMany = 1000;
  workerInCompany = 20;
  neutralStartPeople = 200;
  neutralProductionRate = 2;
  newAirportRate = 1.05;
  capacityShop = 5000;
  allProducts: Product[];
  daysBuildBuilding = 4;
  costsAdvertising = 2000;
  peopleInHouse = 200;
  numberBuildWithContextMenu = 10;
  numberBuildHousesWithContextMenu = 10;
  startMoney = 250000;
  allAirplaneTypes = [
    { typeid: 0, model: "Airplane", speed: 200, capacity: 200, costs: 60, buildDays: 20, buildingCosts: 20000, buildingMaterial: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
    /* {typeid:1,model:"Airplane B",speed:210,capacity:300, costs:90,buildDays:25,buildingCosts:40000,buildingMaterial:[0,0,0,20,0,20,0,20,0,20,0,0,0,0,20]},
     {typeid:2,model:"Airplane C",speed:220,capacity:400, costs:150,buildDays:35,buildingCosts:60000,buildingMaterial:[0,0,0,30,0,30,0,30,0,30,0,0,0,0,30]},
     {typeid:3,model:"Airplane D",speed:240,capacity:700, costs:180,buildDays:40,buildingCosts:80000,buildingMaterial:[0,0,0,40,0,40,0,40,0,40,0,0,0,0,40]},
     {typeid:4,model:"Airplane E",speed:260,capacity:1500, costs:270,buildDays:50,buildingCosts:200000,buildingMaterial:[0,0,0,50,0,50,0,50,0,50,0,0,0,0,50]},
     {typeid:5,model:"Airplane F",speed:300,capacity:3000, costs:700,buildDays:80,buildingCosts:350000,buildingMaterial:[0,0,0,100,0,100,0,100,0,100,0,0,0,0,100]},*/
  ];
}
function createParameter() {
  window.parameter = new Parameter();
  globalThis.parameter = new Parameter();

  parameter.allProducts = [
    new Product({ id: 0, name: "Stein", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 32, distribution: 3, amountForPeople: 5 }),
    new Product({ id: 1, name: "Holz", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 32, distribution: 3, amountForPeople: 4.5 }),
    new Product({ id: 2, name: "Getreide", dailyProduce: 7, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 23, distribution: 3, amountForPeople: 3 }),
    new Product({ id: 3, name: "Eisen", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 32, distribution: 3, amountForPeople: 4 }),
    new Product({ id: 4, name: "Wolle", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 32, distribution: 3, amountForPeople: 2.5 }),
    new Product({ id: 5, name: "Öl", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 32, distribution: 3, amountForPeople: 2 }),
    new Product({ id: 6, name: "Brot", dailyProduce: 6, input1: 2, input1Amount: 3, input2: undefined, input2Amount: 0, priceProduction: 49, distribution: 2, amountForPeople: 5 }),
    new Product({ id: 7, name: "Plaste", dailyProduce: 6, input1: 5, input1Amount: 3, input2: undefined, input2Amount: 0, priceProduction: 57, distribution: 2, amountForPeople: 5 }),
    new Product({ id: 8, name: "Fleisch", dailyProduce: 2, input1: 2, input1Amount: 1, input2: undefined, input2Amount: 0, priceProduction: 109, distribution: 2, amountForPeople: 2 }),
    new Product({ id: 9, name: "Möbel", dailyProduce: 2, input1: 1, input1Amount: 0.5, input2: 3, input2Amount: 0.5, priceProduction: 117, distribution: 2, amountForPeople: 2 }),
    new Product({ id: 10, name: "Kleidung", dailyProduce: 1, input1: 4, input1Amount: 2, input2: undefined, input2Amount: 0, priceProduction: 286, distribution: 2, amountForPeople: 1 }),
    new Product({ id: 11, name: "Fisch", dailyProduce: 3, input1: undefined, input1Amount: undefined, input2: undefined, input2Amount: 0, priceProduction: 60, distribution: 2, amountForPeople: 2 }),
    new Product({ id: 12, name: "Apfel", dailyProduce: 4, input1: undefined, input1Amount: undefined, input2: undefined, input2Amount: 0, priceProduction: 45, distribution: 2, amountForPeople: 3 }),
    new Product({ id: 13, name: "Saft", dailyProduce: 3, input1: 12, input1Amount: 1, input2: undefined, input2Amount: 0, priceProduction: 85, distribution: 1, amountForPeople: 3 }),
    new Product({ id: 14, name: "Gold", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 100, distribution: 1, amountForPeople: 1 }),
    new Product({ id: 15, name: "Schmuck", dailyProduce: 2, input1: 14, input1Amount: 1, input2: undefined, input2Amount: 0, priceProduction: 184, distribution: 1, amountForPeople: 2 }),
    new Product({ id: 16, name: "Spielzeug", dailyProduce: 1, input1: 4, input1Amount: 0.5, input2: 7, input2Amount: 0.5, priceProduction: 274, distribution: 1, amountForPeople: 1 }),
    new Product({ id: 17, name: "Fahrrad", dailyProduce: 1, input1: 3, input1Amount: 0.5, input2: 7, input2Amount: 0.5, priceProduction: 274, distribution: 1, amountForPeople: 1 }),
    new Product({ id: 18, name: "Fischbrot", dailyProduce: 1, input1: 11, input1Amount: 1, input2: 6, input2Amount: 1, priceProduction: 382, distribution: 1, amountForPeople: 1 })
  ];
  /*parameter.allProducts = [
      new Product({ id: 0, name: "Stein", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 32, distribution: 3, amountForPeople: 5 }),
    new Product({ id: 1, name: "Holz", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 32, distribution: 3, amountForPeople: 4.5 }),
    new Product({ id: 2, name: "Getreide", dailyProduce: 7, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 23, distribution: 3, amountForPeople: 4 }),
    new Product({ id: 3, name: "Eisen", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 32, distribution: 3, amountForPeople: 3 }),
    new Product({ id: 4, name: "Wolle", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 32, distribution: 3, amountForPeople: 2.5 }),
    new Product({ id: 5, name: "Öl", dailyProduce: 5, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 32, distribution: 3, amountForPeople: 3 }),
    new Product({ id: 6, name: "Brot", dailyProduce: 6, input1: 2, input1Amount: 2, input2: undefined, input2Amount: 0, priceProduction: 49, distribution: 2, amountForPeople: 5 }),
    new Product({ id: 7, name: "Plaste", dailyProduce: 6, input1: 5, input1Amount: 2, input2: undefined, input2Amount: 0, priceProduction: 57, distribution: 2, amountForPeople: 5 }),
    new Product({ id: 8, name: "Fleisch", dailyProduce: 2, input1: 2, input1Amount: 1, input2: undefined, input2Amount: 0, priceProduction: 109, distribution: 2, amountForPeople: 2 }),
    new Product({ id: 9, name: "Möbel", dailyProduce: 2, input1: 1, input1Amount: 0.5, input2: 3, input2Amount: 1, priceProduction: 117, distribution: 2, amountForPeople: 2 }),
    new Product({ id: 10, name: "Kleidung", dailyProduce: 1, input1: 4, input1Amount: 2, input2: undefined, input2Amount: 0, priceProduction: 286, distribution: 2, amountForPeople: 1 }),
    new Product({ id: 11, name: "Fisch", dailyProduce: 3, input1: undefined, input1Amount: undefined, input2: undefined, input2Amount: 0, priceProduction: 60, distribution: 2, amountForPeople: 2 }),
    new Product({ id: 12, name: "Apfel", dailyProduce: 4, input1: undefined, input1Amount: undefined, input2: undefined, input2Amount: 0, priceProduction: 45, distribution: 2, amountForPeople: 3 }),
    new Product({ id: 13, name: "Saft", dailyProduce: 3, input1: 12, input1Amount: 1, input2: undefined, input2Amount: 0, priceProduction: 85, distribution: 1, amountForPeople: 3 }),
    new Product({ id: 14, name: "Gold", dailyProduce: 2, input1: undefined, input1Amount: 0, input2: undefined, input2Amount: 0, priceProduction: 100, distribution: 1, amountForPeople: 1 }),
    new Product({ id: 15, name: "Schmuck", dailyProduce: 2, input1: 14, input1Amount: 1, input2: undefined, input2Amount: 0, priceProduction: 184, distribution: 1, amountForPeople: 2 }),
    new Product({ id: 16, name: "Spielzeug", dailyProduce: 1, input1: 4, input1Amount: 0.5, input2: 7, input2Amount: 0.5, priceProduction: 274, distribution: 1, amountForPeople: 1 }),
    new Product({ id: 17, name: "Fahrrad", dailyProduce: 1, input1: 3, input1Amount: 1, input2: 7, input2Amount: 0.5, priceProduction: 274, distribution: 1, amountForPeople: 1 }),
    new Product({ id: 18, name: "Fischbrot", dailyProduce: 1, input1: 11, input1Amount: 1, input2: 6, input2Amount: 1, priceProduction: 382, distribution: 1, amountForPeople: 1 })
  ];:*/
  return parameter;
};
//global.parameter=new Parametetr();
export class Game {
  parameter: Parameter;
  static instance: Game;
  dom: HTMLElement;
  world: World;
  domHeader: HTMLDivElement;
  domWorld: HTMLDivElement;
  _money;
  version = "3.0";
  date: Date;
  lastUpdate: number;
  speed: number;
  pausedSpeed: number;
  timer;
  mapWidth = 1000;
  mapHeight = 600;
  updateUIID;
  statistic: Statistic;
  static temposcale = [0.01, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256]
  constructor() {
    var _this = this;
    Game.instance = this;
    this.parameter = createParameter();
    this.speed = Game.temposcale[6];
    this.lastUpdate = Date.now();
    this.date = new Date("Sat Jan 01 2000 00:00:00");
    CityDialog.instance = undefined;
    this.statistic = new Statistic()
    this.nevercallthisfunction();
    this.updateUIID = setInterval(() => {
      _this.updateUI();
    }, 100);
  }
  public updateTitle() {
    try {
      var m = this.getMoney();
      if (m >= 10000000)
        document.getElementById("gamemoney").textContent = Math.round(m / 1000000).toLocaleString() + "M";
      else
        document.getElementById("gamemoney").textContent = new Number(m).toLocaleString();
      document.getElementById("gamedate").textContent = this.date.toLocaleDateString();

    } catch (ex) {
      console.log("stop game");
      return;
    }
  }

  updateUI() {
    this.updateTitle();
    this.world.updateUI();
    //console.log("tooks"+(new Date().getTime()-t));
    CityDialog.getInstance().update();
    AirplaneDialog.getInstance().update();
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

    if (this.world)
      this.world.update();
    this.lastUpdate = Date.now();
    this.timer = setTimeout(() => {
      _this.nevercallthisfunction();

    }, intervall);

  }

  newGame() {
    this.world = new World();
    this.world.game = this;
    this._money = parameter.startMoney;
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
            Traffics `+ gameversion + ` 
            <button id="game-slower"  class="mybutton">`+ Icons.minus + `</button> 
            <span id="gamedate"></span>   
            <button id="game-faster"  class="mybutton">`+ Icons.plus + `</button> 
            <span id="gamemoney"></span>`+ Icons.money + `
            <button id="save-game"  class="mybutton">`+ Icons.save + `</button> 
            <!--button id="debug-game"  class="mybutton">`+ Icons.debug + `</button--> 
            <button id="show-diagram"  class="mybutton">`+ Icons.diagram + `</button> 
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
      SaveDialog.getInstance().game = _this;
      SaveDialog.getInstance().show();
    });

  /*  document.getElementById("debug-game").addEventListener("click", () => {
      // _this.world.showMoveIcon();
      //Product.randomUpdateConsumtion(_this.world,9,18,3,false);
     Product.randomUpdateConsumtion(this.world);
     });*/
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
    clearInterval(this.updateUIID);
  }
  close(){
    //clearInterval(this.updateUIID);
  //  clearTimeout(this.timer);
  console.log("clearIntervall "+this.world._intervall);
    clearInterval(this.world._intervall);
  }
}

export function test() {

}
