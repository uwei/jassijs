import { City } from "game/city";
import { allProducts, Product } from "game/product";
import { Icons } from "game/icons";
import { Airplane, allAirplaneTypes } from "game/airplane";
import { AirplaneDialog } from "game/airplanedialog";
import { Company } from "game/company";
import { CityDialogMarket } from "game/citydialogmarket";

//@ts-ignore
window.city = function () {
    return CityDialog.getInstance().city;
}

export class CityDialog {
    dom: HTMLDivElement;
    city: City;
    hasPaused = false;
    public static instance;
    constructor() {
        this.create();
    }
    static getInstance(): CityDialog {
        if (CityDialog.instance === undefined)
            CityDialog.instance = new CityDialog();
        return CityDialog.instance;
    }

    
    private create() {
        //template for code reloading
        var sdom = `
          <div hidden id="citydialog" class="citydialog">
            <div></div>
           </div>
        `;
        this.dom = <any>document.createRange().createContextualFragment(sdom).children[0];
        var old = document.getElementById("citydialog");
        if (old) {
            old.parentNode.removeChild(old);
        }

        var products = allProducts;
        var _this = this;
        var city = _this.city;
        var sdom = `
          <div>
          <div>
            <input id="citydialog-prev" type="button" value="<"/>
            <input id="citydialog-next" type="button" value=">"/>
          </div>
            <div id="citydialog-tabs">
                <ul>
                    <li><a href="#citydialog-market" id="citydialog-market-tab" class="citydialog-tabs">Market</a></li>
                    <li><a href="#citydialog-buildings" id="citydialog-buildings-tab" class="citydialog-tabs">Buildings</a></li>
                    <li><a href="#citydialog-warehouse" id="citydialog-warehouse-tab"  class="citydialog-tabs">`+ Icons.warehouse + ` Warehouse</a></li>
                    <li><a href="#citydialog-construction" id="citydialog-construction-tab" class="citydialog-tabs">Construction</a></li>
                    <li><a href="#citydialog-score" id="citydialog-score-tab"  class="citydialog-tabs">Score</a></li>
                </ul>
                <div id="citydialog-market">`+ CityDialogMarket.getInstance().create() + `
                </div>
                <div id="citydialog-buildings"> `+ this.createBuildings() + `
                </div>
                <div id="citydialog-warehouse">`+ this.createWarehouse() + `
                </div>
                <div id="citydialog-construction">`+ this.createConstruction() + `
                </div>
                <div id="citydialog-score">`+ this.createScore() + `
                </div>
          </div>
        `;
        var newdom = <any>document.createRange().createContextualFragment(sdom).children[0];
        this.dom.removeChild(this.dom.children[0]);
        this.dom.appendChild(newdom);
        $("#citydialog-tabs").tabs({

            //collapsible: true
        });
        setTimeout(() => {
            $("#citydialog-tabs").tabs({
                //collapsible: true
            });
        }, 100);

        document.body.appendChild(this.dom);

        //        document.getElementById("citydialog-prev")
        setTimeout(() => { _this.bindActions(); }, 500);
        //document.createElement("span");
    }
  
    createBuildings() {
        return `<table id="citydialog-buildings-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Produce</th>
                            <th> </th>
                            <th>Buildings</th>
                            <th>Jobs</th>
                            <th>Needs</th>
                            <th></th>
                            <th>Actions</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < 5; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + '<td><button id="new-factory_' + x + '">' + "+" + Icons.factory + '</button>' +
                        '<button id="delete-factory_' + x + '">' + "-" + Icons.factory + '</button>' +
                        '<button id="buy-license_' + x + '">' + "buy license to produce for 50.000" + Icons.money + '</button>' +
                        '<div id="no-warehouse_' + x + '">need a warehouse to produce</div>' +

                        '</td>';
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>
                    <br/>
                    <b>residential building</b>
                    <br/>
                       `+ Icons.home + ` houses: <span id="houses">0/0</span>  
                        `+ Icons.people + ` renter: <span id="renter">0/0</span>  
                        <button id="buy-house">+`+ Icons.home + ` for 25.000` + Icons.money + " 40x" + allProducts[0].getIcon() +
            " 80x" + allProducts[1].getIcon() + `</button> 
                        <button id="delete-house">-`+ Icons.home + `</button>
                        <br/>
                        <b>Warehouse</b>
                    <br/>
                       `+ Icons.warehouse + ` houses: <span id="count-warehouses">0/0</span>  
                        ` + ` costs: <span id="costs-warehouses">0</span> ` + Icons.money + `  
                        <button id="buy-warehouse">+`+ Icons.home + ` for 15.000` + Icons.money + " 20x" + allProducts[0].getIcon() +
            " 40x" + allProducts[1].getIcon() + `</button> 
                        <button id="delete-warehouse">-`+ Icons.home + `</button>`;
    }
    createWarehouse() {
        return `<table id="citydialog-warehouse-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Name</th>
                            <th></th>
                            <th>Stock</th>
                            <th>Produce</th>
                            <th>Need</th>
                            <th>Min-Stock</th>
                            <th>Selling price</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + allProducts[x].name + "</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + '<td>' +
                        '<input type="number" min="0" class="warehouse-min-stock" id="warehouse-min-stock_' + x + '"' +
                        'style="width: 50px;"' +
                        '"></td>';
                    ret = ret + '<td>' +
                        '<input type="number" min="0" class="warehouse-selling-price" id="warehouse-selling-price_' + x + '"' +
                        'style="width: 50px;"' +
                        '"></td>';
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>
                    <p>number of warehouses <span id="citydialog-warehouse-count"><span></p>`;
    }
    createScore() {
        return `<table id="citydialog-score-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Name</th>
                            <th> </th>
                            <th>Score</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + allProducts[x].name + "</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>`;
    }
    createConstruction() {
        return `<table id="citydialog-construction-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Model</th>
                            <th>Speed</th>
                            <th>Capacity</th>
                            <th>Daily Costs</th>
                            <th>Build days</th>
                            <th>Action</th>
                        </tr>
                        ${(function fun() {
                var ret = "";
                for (var x = 0; x < allAirplaneTypes.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + allAirplaneTypes[x].model + "</td>";
                    ret = ret + "<td>" + allAirplaneTypes[x].speed + "</td>";
                    ret = ret + "<td>" + allAirplaneTypes[x].capacity + "</td>";
                    ret = ret + "<td>" + allAirplaneTypes[x].costs + "</td>";
                    ret = ret + "<td>" + allAirplaneTypes[x].buildDays + "</td>";
                    ret = ret + "<td>" + '<button id="new-airplane_' + x + '">' + "+" + Icons.airplane + " " +
                        City.getBuildingCostsAsIcon(allAirplaneTypes[x].buildingCosts, allAirplaneTypes[x].buildingMaterial) + "</button></td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}  
                </table> `;
    }
   
    bindActions() {
        var _this = this;
        CityDialogMarket.getInstance().update();
         document.getElementById("citydialog-next").addEventListener("click", (ev) => {
            var pos = _this.city.world.cities.indexOf(_this.city);
            pos++;
            if (pos >= _this.city.world.cities.length)
                pos = 0;
            _this.city = _this.city.world.cities[pos];
            _this.update();
        });
        document.getElementById("citydialog-prev").addEventListener("click", (ev) => {
           
            var pos = _this.city.world.cities.indexOf(_this.city);
            pos--;
            if (pos === -1)
                pos = _this.city.world.cities.length - 1;
            _this.city = _this.city.world.cities[pos];
            _this.update();
        });
        for (var x = 0; x < 5; x++) {
            document.getElementById("new-factory_" + x).addEventListener("click", (evt) => {
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = Number(sid.split("_")[1]);
                var comp = _this.city.companies[id];

                _this.city.commitBuildingCosts(comp.getBuildingCosts(), comp.getBuildingMaterial(), "buy building");
                comp.buildings++;
                _this.update();
            });
            document.getElementById("delete-factory_" + x).addEventListener("click", (evt) => {
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = Number(sid.split("_")[1]);
                var comp = _this.city.companies[id];
                if (comp.buildings > 0)
                    comp.buildings--;
                var unempl = this.city.companies[id].workers - (this.city.companies[id].buildings * Company.workerInCompany);
                if (unempl > 0) {
                    this.city.companies[id].workers -= unempl;
                    this.city.transferWorker(unempl);
                }
                _this.update();
            });
            document.getElementById("buy-license_" + x).addEventListener("click", (evt) => {
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = Number(sid.split("_")[1]);
                var comp = _this.city.companies[id];
                _this.city.commitBuildingCosts(50000, [], "buy licence");
                comp.hasLicense = true;
            });

        }
        document.getElementById("buy-house").addEventListener("click", (evt) => {
            this.city.commitBuildingCosts(15000, [20, 40], "buy building");
            _this.city.houses++;
            _this.update();
        });
        document.getElementById("delete-house").addEventListener("click", (evt) => {
            if (_this.city.houses === 0)
                return;
            _this.city.houses--;
            _this.update();
            /*if ((_this.city.people - 1000) > _this.city.houses * 100) {
                _this.city.people = 1000 + _this.city.houses * 100;
            }*/
            console.log("remove worker");
        });
        document.getElementById("buy-warehouse").addEventListener("click", (evt) => {

            _this.city.commitBuildingCosts(25000, [40, 80], "buy building");
            _this.city.warehouses++;
            _this.update();
        });
        document.getElementById("delete-warehouse").addEventListener("click", (evt) => {
            if (_this.city.warehouses === 0)
                return;
            _this.city.warehouses--;
            _this.update();

        });
       
        for (var x = 0; x < allAirplaneTypes.length; x++) {
            document.getElementById("new-airplane_" + x).addEventListener("click", (evt) => {
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = parseInt(sid.split("_")[1]); 
                _this.newAirplane(id);
            });

        }
        CityDialogMarket.getInstance().bindActions();
    }
    newAirplane(typeid: number) {
        var _this = this;
        _this.city.commitBuildingCosts(allAirplaneTypes[typeid].buildingCosts, allAirplaneTypes[typeid].buildingMaterial, "buy airplane");
        var maxNumber = 1;
        for (var x = 0; x < _this.city.world.airplanes.length; x++) {
            var test = _this.city.world.airplanes[x];
            var pos = test.name.indexOf(allAirplaneTypes[typeid].model);
            if (pos === 0) {
                var nr = parseInt(test.name.substring(allAirplaneTypes[typeid].model.length));
                if (nr !== NaN && nr > maxNumber)
                    maxNumber = nr;
            }
        }
        maxNumber++;
        var ap = new Airplane(_this.city.world);
        ap.speed = 200;
        ap.x = _this.city.x;
        ap.y = _this.city.y;
        ap.world = _this.city.world;
        ap.typeid = allAirplaneTypes[typeid].typeid;
        ap.name = allAirplaneTypes[typeid].model + maxNumber;
        ap.speed = allAirplaneTypes[typeid].speed;
        ap.costs = allAirplaneTypes[typeid].costs;
        ap.capacity = allAirplaneTypes[typeid].capacity;
        _this.city.world.airplanes.push(ap);
        ap.render();
        _this.city.world.dom.appendChild(ap.dom);
        _this.update(true);
    }
    
   
    updateBuildings() {
        /*
                               <th>produce</th>
                                   <th> </th>
                                   <th>buildings</th>
                                   <th>jobs</th>
                                   <th>needs</th>
                                   <th></th>
                                   <th>costs new building</th>
                                   <th>actions</th>
               */
        var companies = this.city.companies;
        var all = allProducts;
        for (var x = 0; x < companies.length; x++) {
            var comp = companies[x];
            var table = document.getElementById("citydialog-buildings-table");
            var tr = table.children[0].children[x + 1];
            var product = all[comp.productid];
            var produce = comp.getDailyProduce();
            tr.children[0].innerHTML = produce + " " + product.getIcon();
            tr.children[1].innerHTML = product.name;
            tr.children[2].innerHTML = comp.buildings.toString();
            tr.children[3].innerHTML = comp.workers + "/" + comp.getMaxWorkers();
            var needs1 = "";
            var needs2 = "";
            if (product.input1 !== undefined)
                needs1 = "" + comp.getDailyInput1() + all[product.input1].getIcon() + " ";
            tr.children[4].innerHTML = needs1;
            if (product.input2 !== undefined)
                needs2 = "<br/>" + comp.getDailyInput2() + all[product.input2].getIcon();
            tr.children[4].innerHTML = needs1 + " " + needs2;
            // tr.children[5].innerHTML = City.getBuildingCostsAsIcon(comp.getBuildingCosts(), comp.getBuildingMaterial(), true);

            if (comp.hasLicense) {
                document.getElementById("buy-license_" + x).setAttribute("hidden", "");
            } else {
                document.getElementById("buy-license_" + x).removeAttribute("hidden");
            }
            if (this.city.warehouses === 0) {
                document.getElementById("no-warehouse_" + x).removeAttribute("hidden");
            } else {
                document.getElementById("no-warehouse_" + x).setAttribute("hidden", "");
            }

            if (comp.hasLicense && this.city.warehouses > 0) {
                document.getElementById("new-factory_" + x).innerHTML = "+" + Icons.factory +
                    City.getBuildingCostsAsIcon(comp.getBuildingCosts(), comp.getBuildingMaterial());
                document.getElementById("new-factory_" + x).removeAttribute("hidden");
                document.getElementById("delete-factory_" + x).removeAttribute("hidden");
            } else {
                document.getElementById("new-factory_" + x).setAttribute("hidden", "");
                document.getElementById("delete-factory_" + x).setAttribute("hidden", "");
            }
            var mat = comp.getBuildingMaterial();
            if (this.city.canBuild(comp.getBuildingCosts(), comp.getBuildingMaterial()) != "") {
                //    this.city.world.game.getMoney() < comp.getBuildingCosts() || this.city.market[0] < mat[0] || this.city.market[1] < mat[1]) {
                document.getElementById("new-factory_" + x).setAttribute("disabled", "");
                document.getElementById("new-factory_" + x).setAttribute("title", "not all building costs are available");
            } else {
                document.getElementById("new-factory_" + x).removeAttribute("disabled");
                document.getElementById("new-factory_" + x).removeAttribute("title");
            }
            if (this.city.canBuild(50000, []) === "") {
                document.getElementById("buy-license_" + x).removeAttribute("disabled");
            } else {
                document.getElementById("buy-license_" + x).setAttribute("disabled", "");
            }

        }
        document.getElementById("count-warehouses").innerHTML = "" + this.city.warehouses;

        document.getElementById("houses").innerHTML = "" + (this.city.houses + "/" + this.city.houses);
        document.getElementById("renter").innerHTML = "" + (this.city.people - City.neutralStartPeople + "/" + this.city.houses * 100);
        if (this.city.canBuild(25000, [40, 80]) !== "") {
            document.getElementById("buy-house").setAttribute("disabled", "");
        } else {
            document.getElementById("buy-house").removeAttribute("disabled");
        }
        if (this.city.canBuild(15000, [20, 40]) !== "") {
            document.getElementById("buy-warehouse").setAttribute("disabled", "");
        } else {
            document.getElementById("buy-warehouse").removeAttribute("disabled");
        }

        if (this.city.houses === 0) {
            document.getElementById("delete-house").setAttribute("disabled", "");
        } else {
            document.getElementById("delete-house").removeAttribute("disabled");
        }


    }
    updateWarehouse() {
        var needs = [];
        for (var x = 0; x < allProducts.length; x++) {
            needs.push(0);
        }
        for (var i = 0; i < this.city.companies.length; i++) {
            var test = allProducts[this.city.companies[i].productid];
            if (test.input1 !== undefined) {
                needs[test.input1] += (Math.round(this.city.companies[i].workers * test.input1Amount / Company.workerInCompany));
            }
            if (test.input2 === x) {
                needs[test.input2] += (Math.round(this.city.companies[i].workers * test.input2Amount / Company.workerInCompany));
            }
        }
        for (var x = 0; x < allProducts.length; x++) {
            var table = document.getElementById("citydialog-warehouse-table");
            var tr = table.children[0].children[x + 1];

            tr.children[2].innerHTML = this.city.warehouse[x].toString();
            var prod = "";
            var product = allProducts[x];
            for (var i = 0; i < this.city.companies.length; i++) {
                if (this.city.companies[i].productid === x) {
                    prod = Math.round(this.city.companies[i].workers * product.dailyProduce / Company.workerInCompany).toString();
                }
            }
            tr.children[3].innerHTML = prod;
            tr.children[4].innerHTML = needs[x] === 0 ? "" : needs[x];
            if (document.activeElement !== tr.children[5].children[0])
                (<HTMLInputElement>tr.children[5].children[0]).value = this.city.warehouseMinStock[x] === undefined ? "" : this.city.warehouseMinStock[x].toString();
            if (document.activeElement !== tr.children[6].children[0])
                (<HTMLInputElement>tr.children[6].children[0]).value = this.city.warehouseSellingPrice[x] === undefined ? "" : this.city.warehouseSellingPrice[x].toString();
        }

        document.getElementById("citydialog-warehouse-count").innerHTML = "" + this.city.warehouses;

        // document.getElementById("costs-warehouses").innerHTML=""+(this.city.warehouses*50);
    }
    updateConstruction() {
        for (var x = 0; x < allAirplaneTypes.length; x++) {
            if (this.city.canBuild(allAirplaneTypes[x].buildingCosts, allAirplaneTypes[x].buildingMaterial) === "") {
                document.getElementById("new-airplane_" + x).removeAttribute("disabled");
            } else {
                document.getElementById("new-airplane_" + x).setAttribute("disabled", "");

            }
        }
    }
    updateScore() {

        //score
        for (var x = 0; x < allProducts.length; x++) {
            var table = document.getElementById("citydialog-score-table");
            var tr = table.children[0].children[x + 1];
            tr.children[2].innerHTML = this.city.score[x] + "</td>";
        }
    }
    update(force = false) {

        if (!this.city)
            return;
        try {
            if (!$(this.dom).dialog('isOpen')) {
                return;
            }
        } catch {
            return;
        }
        this.updateTitle();
        //pause game while trading
        if (!force) {
            if (document.getElementById("citydialog-market-tab")?.parentElement?.classList?.contains("ui-tabs-active")) {
                if (!this.city.world.game.isPaused()) {
                    this.hasPaused = true;
                    this.city.world.game.pause();
                }
                return;///no update because of slider
            } else {
                if (this.hasPaused) {
                    this.city.world.game.resume();
                }
            }
        }


        if (document.getElementById("citydialog-market-tab")?.parentElement?.classList?.contains("ui-tabs-active"))
            CityDialogMarket.getInstance().update();
        if (document.getElementById("citydialog-buildings-tab")?.parentElement?.classList?.contains("ui-tabs-active"))
            this.updateBuildings();
        if (document.getElementById("citydialog-warehouse-tab")?.parentElement?.classList?.contains("ui-tabs-active"))
            this.updateWarehouse();
        if (document.getElementById("citydialog-construction-tab")?.parentElement?.classList?.contains("ui-tabs-active"))
            this.updateConstruction();
        if (document.getElementById("citydialog-score-tab")?.parentElement?.classList?.contains("ui-tabs-active"))
            this.updateScore();

        return;
    }
    updateTitle() {
        var sicon = '';
        if ($(this.dom).parent().find('.ui-dialog-title').length > 0)
            $(this.dom).parent().find('.ui-dialog-title')[0].innerHTML = '<img style="float: right" id="citydialog-icon" src="' + this.city.icon +
                '"  height="15"></img> ' + this.city.name + " " + this.city.people + " " + Icons.people;
    }
    show() {
        var _this = this;

        this.dom.removeAttribute("hidden");
        this.update();

        $(this.dom).dialog({
            width: "400px",
            draggable: true,
            // position: { my: "left top", at: "right top", of: $(AirplaneDialog.getInstance().dom) },
            open: function (event, ui) {
                _this.update(true);
            },
            close: function (ev, ev2) {
                if (_this.hasPaused) {
                    _this.city.world.game.resume();
                }
            }
        }).dialog("widget").draggable("option", "containment", "none");
        $(this.dom).parent().css({ position: "fixed" });

    }
    close() {
        $(this.dom).dialog("close");
    }
}
