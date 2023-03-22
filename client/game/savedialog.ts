
import { Product } from "game/product";
import { Airplane } from "game/airplane";
import { Icons } from "game/icons";
import { Route } from "game/route";
import { City } from "game/city";
import { World } from "game/world";
import { Game, Statistic } from "game/game";
import { Company } from "game/company";
import { CityDialog } from "game/citydialog";

export class SaveDialog {
    dom: HTMLDivElement;
    game: Game;
    public static instance;

    constructor() {

        this.create();

    }
    static getInstance(): SaveDialog {
        if (SaveDialog.instance === undefined)
            SaveDialog.instance = new SaveDialog();
        return SaveDialog.instance;
    }


    private create() {
        //template for code reloading
        var sdom = `
          <div hidden id="SaveDialog" class="SaveDialog">
            <div></div>
           </div>
        `;
        this.dom = <any>document.createRange().createContextualFragment(sdom).children[0];
        var old = document.getElementById("SaveDialog");
        if (old) {
            old.parentNode.removeChild(old);
        }
        var _this = this;
        var sdom = `
          <div>
            <table>
                <tr>
                    <td>
                        Filename: <input id="save-filename"/>
                    </td>
                    <td>
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: top;width:100%">
                     <ul style="width:100%" class="mylist boxborder" id="save-files">
                     
           
                    </ul>
                      
                    </td>
                    <td>
                        <input type="file" id="save-import" name="files[]" accept="application/json" style="display: none;"  />
                        <button id="save-save" title="save" style="width:100%" class="mybutton">Save</button>
                        <button id="save-load" title="save" style="width:100%" class="mybutton">Load</button>
                        <button id="save-delete" title="save" style="width:100%" class="mybutton">Delete</button>
                        <button id="save-export" title="save" style="width:100%" class="mybutton">Export</button>
                        <button id="save-doupload" title="save" style="width:100%" class="mybutton" onclick="document.getElementById('save-import').click();">Import</button>
                        <button id="save-cancel" title="save" style="width:100%" class="mybutton">Cancel</button>
            
                    </td>
                </tr>    

            </table>         
           </div> 
            `;
        var newdom = <any>document.createRange().createContextualFragment(sdom).children[0];
        this.dom.removeChild(this.dom.children[0]);
        this.dom.appendChild(newdom);

        document.body.appendChild(this.dom);
        //        document.getElementById("citydialog-prev")
        setTimeout(() => {
            $("#SaveDialog-tabs").tabs({
                //collapsible: true
            });
            _this.bindActions();
        }, 500);
        //document.createElement("span");
    }
    bindActions() {
        var _this = this;
        var idfilename = (<HTMLInputElement>document.getElementById("save-filename"));
        document.getElementById("save-cancel").addEventListener("click", (ev) => {
            _this.close();
        });
        document.getElementById("save-save").addEventListener("click", (ev) => {
            if (idfilename.value === "") {
                alert("Error:Filename is empty");
                return;
            }
            _this.save(idfilename.value);
            _this.close();
        });
        document.getElementById("save-load").addEventListener("click", (ev) => {
            if (idfilename.value === "") {
                alert("Error:Filename is empty");
                return;
            }
            _this.load(idfilename.value);
            _this.close();
        });
        document.getElementById("save-files").addEventListener("click", (ev) => {
            idfilename.value = (<any>ev.target).getAttribute("value");//.substring(4);
            var el = <HTMLElement>ev.target;
            var select = document.getElementById("save-files");
            for (var x = 0; x < select.children.length; x++) {
                select.children[x].classList.remove("active-listitem");
            }
            el.classList.add("active-listitem");

        });
        document.getElementById("save-delete").addEventListener("click", (ev) => {
            window.localStorage.removeItem("save" + idfilename.value);

            _this.update();

        });
        document.getElementById("save-export").addEventListener("click", (ev) => {
            var text = _this.toJson();

            var fileBlob = new Blob([text], { type: "application/json" });
            var link = document.createElement("a");
            link.setAttribute("href", URL.createObjectURL(fileBlob));
            link.setAttribute("download", "export.json");
            link.appendChild(document.createTextNode("Save file"));
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
        document.getElementById("save-import").addEventListener("change", function (evt) {
            var files: FileList = evt.target["files"];
            var data: { [file: string]: string | ArrayBuffer } = {};
            var downloaded = 0;
            var file = files[0];
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                var s = <string>reader.result;
                _this.loadContent(s);
                //alert(s);
            }, false);

            reader.readAsText(file);
        });

    }

    update() {
        var list = [];
        var ret = "";
        for (var key in window.localStorage) {
            if (key.startsWith("save")) {
                ret += '<li value="' + key.substring(4) + '">' + key.substring(4) + '</li>';
                //list.push();
            }
        }
        document.getElementById("save-files").innerHTML = ret;
        var last = window.localStorage.getItem("lastgame");
        if (last)
            (<HTMLInputElement>document.getElementById("save-filename")).value = last;

    }
    show() {
        var _this = this;
        this.dom.removeAttribute("hidden");
        //ui-tabs-active
        $(this.dom).dialog({
            title: "Statistics",
            width: "400px",
            draggable: true,
            //     position:{my:"left top",at:"right top",of:$(document)} ,
            open: function (event, ui) {
                _this.update();
            },
            close: function () {
            },
            create: function (e) {
                setTimeout(() => {
                    $(e.target).dialog("widget").find(".ui-dialog-titlebar-close")[0].addEventListener('touchstart', (e) => {
                        _this.close();
                    });
                }, 200);
            }
        }).dialog("widget").draggable("option", "containment", "none");
        $(this.dom).parent().css({ position: "fixed" });

    }
    close() {
        $(this.dom).dialog("close");
    }
    toJson() {
        var sdata = JSON.stringify(this.game, (key: string, value: any) => {
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
                delete ret.domProductNeeded;
                (<City>ret).shopMinStock = this.packArray((<City>ret).shopMinStock);
                return ret;
            }
            if (value?.constructor?.name === "Company") {
                Object.assign(ret, value);
                delete ret.city;
                return ret;
            }
            if (value?.constructor?.name === "Route") {

                Object.assign(ret, value);
                (<Route>ret).loadShopAmount = this.packArray((<Route>ret).loadShopAmount);
                (<Route>ret).loadShopUntilAmount = this.packArray((<Route>ret).loadShopUntilAmount);
                (<Route>ret).unloadShopAmount = this.packArray((<Route>ret).unloadShopAmount);
                delete ret.airplane;
                return ret;
            }
            return value;
        });
        return sdata;
    }
    save(filename: string) {
        this.game.pause();
        var sdata = this.toJson();
        window.localStorage.setItem("save" + filename, sdata);
        window.localStorage.setItem("lastgame", filename);
        //this.load();
        console.log(sdata);
        this.game.resume();

    }
    packArray(arr: number[]): any {
        var test = arr[0];
        for (var x = 1; x < arr.length; x++) {
            if (arr[x] !== test)
                return arr;
        }
        return test;
    }
    unpackArray(value) {
        if (Array.isArray(value))
            return value;
        var ret = [];
        for (var x = 0; x < parameter.allProducts.length; x++) {
            ret.push(value);
        }
        return ret;
    }
    private loadContent(data: string) {
        this.game.close();
        var ret = JSON.parse(data, (key, value) => {
            var r: any = value;
            if (value === null)
                return undefined;
            if (key === "parameter") {
                Object.assign(parameter, value);
                return parameter;
                /*  for (var x = 0; x < parameter.allProducts.length; x++) {
                      parameter.allProducts[x] = new Product(parameter.allProducts[x]);
                  }*/
            }
            if (value?.type === "Company") {
                r = new Company();
                Object.assign(r, value);
                return r;
            }
            if (value?.type === "Product" || value?.dailyConsumtion) {
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
                delete value._intervall;
                r = new World();
                Object.assign(r, value);
                return r;
            }
            if (value?.type === "City") {
                r = new City();

                Object.assign(r, value);
                r.shopMinStock = this.unpackArray(r.shopMinStock);
                return r;
            }
            if (value?.type === "Route") {
                r = new Route();

                Object.assign(r, value);
                r.loadShopAmount = this.unpackArray(r.loadShopAmount);
                r.loadShopUntilAmount = this.unpackArray(r.loadShopUntilAmount);
                r.unloadShopAmount = this.unpackArray(r.unloadShopAmount);
                return r;
            }
            return r;
        });
        if (parameter.allProducts[0].distribution === 16) {
            for (var x = 0; x < parameter.allProducts.length; x++) {
                if (parameter.allProducts[x].distribution === 16)
                    parameter.allProducts[x].distribution = 3;
                if (parameter.allProducts[x].distribution === 8)
                    parameter.allProducts[x].distribution = 2;
                if (parameter.allProducts[x].distribution === 4)
                    parameter.allProducts[x].distribution = 1;

            }
        }
        var game = this.game;
        
        Object.assign(this.game, ret);
        game.world.game = game;
        game.date = new Date(game.date);
        for (var x = 0; x < game.world.airplanes.length; x++) {
            game.world.airplanes[x].world = game.world;
            for (var y = 0; y < game.world.airplanes[x].route.length; y++) {
                game.world.airplanes[x].route[y].airplane = game.world.airplanes[x];
            }
        }
        for (var x = 0; x < game.world.cities.length; x++) {
            game.world.cities[x].world = game.world;
            for (var y = 0; y < game.world.cities[x].companies.length; y++) {
                game.world.cities[x].companies[y].city = game.world.cities[x];
            }
            //for(var y=0;y<this.world.cities[x].companies.length;y++){
            //  this.world.cities[x].companies[y].
            //}
        }
        /*  if (game.world.cities[1].people > 0) {
              //migration
              for (var x = 1; x < game.world.cities.length; x++) {
                  game.world.cities[0].people += game.world.cities[x].people;
                  game.world.cities[x].people = 0;
              }
              for (var x = 1; x < parameter.allProducts.length; x++) {
                  game.world.cities[0].score[x] = 50;
  
              }
              game.world.cities[0].people = Math.round(game.world.cities[0].people);
              game.world.cities[0].shops = game.world.cities[0].shops * 7;
              game.world.cities[0].houses = Math.round(game.world.cities[0].people / parameter.peopleInHouse);
          }
          console.log("People: " + game.world.cities[0].people.toLocaleString());
  */

        if (ret.version === undefined) {
            //migration
            for (let x = 0; x < parameter.allProducts.length; x++) {
                parameter.allProducts[x].dailyConsumtion = parameter.allProducts[x].getAmountForPeople() / (parameter.workerInCompany * 19);
            }
        }
        if (parseFloat(ret.version) <= 1.2) {
            game.parameter.allAirplaneTypes[0].buildingMaterial = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        if (parseFloat(ret.version) <= 1.2) {
            for (var x = 0; x < game.world.cities.length; x++) {
                delete game.world.cities[x]["shopSellingPrice"];
            }
            for (var x = 0; x < game.world.airplanes.length; x++) {
                for (var y = 0; y < game.world.airplanes[x].route.length; y++) {
                    delete game.world.airplanes[x].route[y]["loadMarketAmount"];
                    delete game.world.airplanes[x].route[y]["loadMarketPrice"];
                    delete game.world.airplanes[x].route[y]["unloadMarketPrice"];
                    delete game.world.airplanes[x].route[y]["unloadMarketAmount"];
                }
            }
        }
        if (parseFloat(ret.version) < 1.4) {

            for (var x = 1; x < game.world.cities.length; x++) {
                game.world.cities[x].shops = Math.round(game.world.cities[x].shops * 2);
            }
            game.version = "1.4";
        }
        if (parseFloat(ret.version) < 1.5) {

            for (var x = 1; x < game.world.cities.length; x++) {
                var max = 0;
                for (var y = 0; y < 5; y++) {
                    max += game.world.cities[x].companies[y].buildings * parameter.workerInCompany;
                }
                game.world.cities[x].people = max;
                //game.world.cities[x].people=game.world.cities[x].shops*2);
            }
            game.version = "1.5";
        }
        if (parseFloat(ret.version) < 1.7) {
            game.statistic.successfulLoad = new Statistic().successfulLoad;
            game.statistic.unsuccessfulLoad = new Statistic().unsuccessfulLoad;
            for (var x = 1; x < game.world.cities.length; x++) {
                game.world.cities[x].buildingplaces = 0;
            }
            game.version = "1.7";
        }
        if (parseFloat(ret.version) < 1.9) {
            for (var x = 0; x < game.world.cities.length; x++) {
                for (var y = 0; y < 5; y++) {
                    game.world.cities[x].companies[y].workers = game.world.cities[x].companies[y].buildings * parameter.workerInCompany;
                }
                //game.world.cities[x].people=game.world.cities[x].shops*2);
            }
            game.version = "1.9";
        }
        if (parseFloat(ret.version) < 2.5) {
            parameter.allProducts[2]["amountForPeople"] = 3;
            parameter.allProducts[3]["amountForPeople"] = 4;
            parameter.allProducts[5]["amountForPeople"] = 2;

            game.version = "2.5";
        }
        if (parseFloat(ret.version) < 2.7) {
            var test = [
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
            for (var x = 0; x < test.length; x++) {
                parameter.allProducts[x].dailyProduce = test[x].dailyProduce;
                parameter.allProducts[x].input1 = test[x].input1;
                parameter.allProducts[x].input1Amount = test[x].input1Amount;
                parameter.allProducts[x].input2 = test[x].input2;
                parameter.allProducts[x].input2Amount = test[x].input2Amount;
                parameter.allProducts[x]["amountForPeople"] = test[x].getAmountForPeople();

                if(parameter.allProducts[x].getDiffConsumtion()>0.3){
                    parameter.allProducts[x].dailyConsumtion=1.3*parameter.allProducts[x].getAmountForPeople() / (parameter.workerInCompany * parameter.allProducts.length);
                }
                if(parameter.allProducts[x].getDiffConsumtion()<-0.3){
                    parameter.allProducts[x].dailyConsumtion=0.7*parameter.allProducts[x].getAmountForPeople() / (parameter.workerInCompany * parameter.allProducts.length);
                }
            }

            game.version = "2.7";
        }
         if (parseFloat(ret.version) < 2.9) {
           
            for (var x = 0; x < parameter.allProducts.length; x++) {
               
                if(parameter.allProducts[x].getDiffConsumtion()>0.4){
                    parameter.allProducts[x].dailyConsumtion=1.4*parameter.allProducts[x].getAmountForPeople() / (parameter.workerInCompany * parameter.allProducts.length);
                }
            }

            game.version = "2.9";
        }
        game.render(this.game.dom);
        game.resume();
    }
    load(filename: string) {
        this.game.pause();
        CityDialog.getInstance().filteredCities = undefined;
        var data = window.localStorage.getItem("save" + filename);
        this.loadContent(data);
        window.localStorage.setItem("lastgame", filename);

    }
}

export function test() {

    SaveDialog.getInstance().show();
}
