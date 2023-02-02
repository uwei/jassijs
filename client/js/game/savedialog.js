define(["require", "exports", "game/product", "game/airplane", "game/route", "game/city", "game/world", "game/company", "game/citydialog"], function (require, exports, product_1, airplane_1, route_1, city_1, world_1, company_1, citydialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SaveDialog = void 0;
    class SaveDialog {
        constructor() {
            this.create();
        }
        static getInstance() {
            if (SaveDialog.instance === undefined)
                SaveDialog.instance = new SaveDialog();
            return SaveDialog.instance;
        }
        create() {
            //template for code reloading
            var sdom = `
          <div hidden id="SaveDialog" class="SaveDialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
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
                        <button id="save-save" title="save" style="width:100%" class="mybutton">Save</button>
                        <button id="save-load" title="save" style="width:100%" class="mybutton">Load</button>
                        <button id="save-delete" title="save" style="width:100%" class="mybutton">Delete</button>
                        <button id="save-export" title="save" style="width:100%" class="mybutton">Export</button>
                        <button id="save-import" title="save" style="width:100%" class="mybutton">Import</button>
                        <button id="save-cancel" title="save" style="width:100%" class="mybutton">Cancel</button>
            
                    </td>
                </tr>    

            </table>         
           </div> 
            `;
            var newdom = document.createRange().createContextualFragment(sdom).children[0];
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
            var idfilename = document.getElementById("save-filename");
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
                idfilename.value = ev.target.getAttribute("value"); //.substring(4);
                var el = ev.target;
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
                document.getElementById("save-filename").value = last;
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
        save(filename) {
            this.game.pause();
            var sdata = JSON.stringify(this.game, (key, value) => {
                var _a, _b, _c, _d, _e;
                var ret = {};
                if (value instanceof HTMLElement) {
                    return undefined;
                }
                if (key === "lastUpdate")
                    return undefined;
                if (((_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name) === "World") {
                    Object.assign(ret, value);
                    delete ret.game;
                    return ret;
                }
                if (((_b = value === null || value === void 0 ? void 0 : value.constructor) === null || _b === void 0 ? void 0 : _b.name) === "Airplane") {
                    Object.assign(ret, value);
                    delete ret.world;
                    return ret;
                }
                if (((_c = value === null || value === void 0 ? void 0 : value.constructor) === null || _c === void 0 ? void 0 : _c.name) === "City") {
                    Object.assign(ret, value);
                    delete ret.world;
                    delete ret.domProductNeeded;
                    return ret;
                }
                if (((_d = value === null || value === void 0 ? void 0 : value.constructor) === null || _d === void 0 ? void 0 : _d.name) === "Company") {
                    Object.assign(ret, value);
                    delete ret.city;
                    return ret;
                }
                if (((_e = value === null || value === void 0 ? void 0 : value.constructor) === null || _e === void 0 ? void 0 : _e.name) === "Route") {
                    Object.assign(ret, value);
                    delete ret.airplane;
                    return ret;
                }
                return value;
            }, "\t");
            window.localStorage.setItem("save" + filename, sdata);
            window.localStorage.setItem("lastgame", filename);
            //this.load();
            console.log(sdata);
            this.game.resume();
        }
        load(filename) {
            this.game.pause();
            citydialog_1.CityDialog.getInstance().filteredCities = undefined;
            var data = window.localStorage.getItem("save" + filename);
            var ret = JSON.parse(data, (key, value) => {
                var r = value;
                if (value === null)
                    return undefined;
                if (key === "parameter") {
                    Object.assign(parameter, value);
                    /*  for (var x = 0; x < parameter.allProducts.length; x++) {
                          parameter.allProducts[x] = new Product(parameter.allProducts[x]);
                      }*/
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "Company") {
                    r = new company_1.Company();
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "Product" || (value === null || value === void 0 ? void 0 : value.dailyConsumtion)) {
                    r = new product_1.Product(value);
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "Airplane") {
                    r = new airplane_1.Airplane(undefined);
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "World") {
                    r = new world_1.World();
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "City") {
                    r = new city_1.City();
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "Route") {
                    r = new route_1.Route();
                    Object.assign(r, value);
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
            game.render(this.game.dom);
            game.resume();
            window.localStorage.setItem("lastgame", filename);
        }
    }
    exports.SaveDialog = SaveDialog;
    function test() {
        SaveDialog.getInstance().show();
    }
    exports.test = test;
});
//# sourceMappingURL=savedialog.js.map