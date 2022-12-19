import { City } from "game/city";
import { Product } from "game/product";
import { Icons } from "game/icons";
import { Airplane } from "game/airplane";
import { AirplaneDialog } from "game/airplanedialog";
import { Company } from "game/company";
import { CityDialogShop } from "game/citydialogshop";

//@ts-ignore
window.city = function () {
    return CityDialog.getInstance().city;
}

export class CityDialog {
    dom: HTMLDivElement;
    city: City;
    hasPaused = false;
    filteredCities: City[];
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

        var products = parameter.allProducts;
        var _this = this;
        var city = _this.city;
        var sdom = `
          <div>
          <div>
            <input style="width:30px" id="citydialog-prev" type="button" value="<"  class="mybutton"/>
            <input style="width:30px" id="citydialog-next" type="button" value=">"  class="mybutton"/>
            
            <select id="citydialog-filter" style="width:80px">
                `+ this.productFilter() + `
            </select>
            <input type="checkbox" id="hide-busy" name="vehicle1">hide busy
          </div>
            <div id="citydialog-tabs">
                <ul>
                    <li><a href="#citydialog-buildings" id="citydialog-buildings-tab" class="citydialog-tabs">Buildings</a></li>
                    <li><a href="#citydialog-shop" id="citydialog-shop-tab"  class="citydialog-tabs">`+ Icons.shop + ` MyShop</a></li>
                    <li><a href="#citydialog-construction" id="citydialog-construction-tab" class="citydialog-tabs">Construction</a></li>
                    <li><a href="#citydialog-score" id="citydialog-score-tab"  class="citydialog-tabs">Score</a></li>
                </ul>
                <div id="citydialog-buildings"> `+ this.createBuildings() + `
                </div>
                <div id="citydialog-shop">`+ CityDialogShop.getInstance().create() + `
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
    productFilter() {
        var ret = '<option value="all">All</option>';
        for (var x = 0; x < parameter.allProducts.length; x++) {
            //  ret+='<option value="'+x+'"><span>'+parameter.allProducts[x].getIcon()+" "+parameter.allProducts[x].name+'</span></option>';
            ret += '<option value="' + x + '">' + parameter.allProducts[x].name + '</option>';

        }
        return ret;
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
                    ret = ret + '<td><button id="new-factory_' + x + '" class="mybutton">' + "+" + Icons.factory + '</button>' +
                        '<button id="delete-factory_' + x + '" class="mybutton">' + "-" + Icons.factory + '</button>' +
                        '<button id="buy-license_' + x + '" class="mybutton">' + "buy license to produce for 50.000" + Icons.money + '</button>' +
                        '<div id="no-shop_' + x + '">need a shop to produce</div>' +

                        '</td>';
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>
                    <br/>
                        <br/>
                        <b>My-Shops</b>
                    <br/>
                       `+ Icons.shop + ` Shops: <span id="count-shops">0/0</span>  
                        ` + ` costs: <span id="costs-shops">0</span> ` + Icons.money + `  
                        <button id="buy-shop"  class="mybutton">+`+ Icons.home + ` for 15.000` + Icons.money +`</button> 
                        <button id="delete-shop"  class="mybutton">-`+ Icons.home + `</button>`;
    }

    createScore() {
        return `<table id="citydialog-score-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Name</th>
                            <th> </th>
                            <th>Produce</th>
                            <th>Need</th>
                            <th>Score</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + parameter.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + parameter.allProducts[x].name + "</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + "<td>0</td>";
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
                for (var x = 0; x < parameter.allAirplaneTypes.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + parameter.allAirplaneTypes[x].model + "</td>";
                    ret = ret + "<td>" + parameter.allAirplaneTypes[x].speed + "</td>";
                    ret = ret + "<td>" + parameter.allAirplaneTypes[x].capacity + "</td>";
                    ret = ret + "<td>" + parameter.allAirplaneTypes[x].costs + "</td>";
                    ret = ret + "<td>" + parameter.allAirplaneTypes[x].buildDays + "</td>";
                    ret = ret + "<td>" + '<button id="new-airplane_' + x + '" class="mybutton">' + "+" + Icons.airplane + " " +
                        City.getBuildingCostsAsIcon(Math.round(parameter.allAirplaneTypes[x].buildingCosts * parameter.rateCostsAirplaine), parameter.allAirplaneTypes[x].buildingMaterial) + "</button></td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}  
                </table>

                <table id="citydialog-constructionqueue-table" style="height:100%;weight:100%;">
                        
                </table> 
            
            `;
    }
    nextCity() {
        var _this = this;
        if (_this.filteredCities === undefined)
            _this.filteredCities = _this.city.world.cities;
        var pos = _this.filteredCities.indexOf(_this.city);
        pos++;
        if (pos >= _this.filteredCities.length)
            pos = 0;
        _this.city = _this.filteredCities[pos];
        if (_this.city === undefined)
            _this.city = _this.filteredCities[0];
        if (!_this.city.hasAirport)
            this.nextCity();
        _this.update(true);
    }
    prevCity() {
        var _this = this;
        if (this.filteredCities === undefined)
            this.filteredCities = _this.city.world.cities;
        var pos = _this.filteredCities.indexOf(_this.city);
        pos--;
        if (pos === -1)
            pos = _this.filteredCities.length - 1;
        _this.city = _this.filteredCities[pos];
        if (_this.city === undefined)
            _this.city = _this.filteredCities[0];
        if (!_this.city.hasAirport)
            this.prevCity();

        _this.update(true);
    }
    bindActions() {
        var _this = this;
        document.getElementById("citydialog-next").addEventListener("click", (ev) => {
            _this.nextCity();
        });
        document.getElementById("citydialog-prev").addEventListener("click", (ev) => {
            _this.prevCity();
        });
        document.getElementById("citydialog-filter").addEventListener("change", (ev) => {
            var sel = (<HTMLSelectElement>document.getElementById("citydialog-filter")).value;
            var hide_busy=(<HTMLInputElement>document.getElementById("hide-busy")).checked;
            
            if (sel === "all")
                this.filteredCities = _this.city.world.cities;
            else {
                this.filteredCities = [];
                for (var x = 0; x < _this.city.world.cities.length; x++) {
                    var city = _this.city.world.cities[x];
                    for (var y = 0; y < city.companies.length; y++) {
                        if (city.companies[y].productid === Number(sel)) {
                            if(hide_busy&&city.queueBuildings.length>0){
                                //
                            }else
                                this.filteredCities.push(city);
                        }
                    }
                }
                this.filteredCities.sort((a, b) => {
                    var a1, b1;
                    for (var y = 0; y < a.companies.length; y++) {
                        if (a.companies[y].productid === Number(sel)) {
                            a1 = a.companies[y].buildings;
                        }
                    }
                    for (var y = 0; y < b.companies.length; y++) {
                        if (b.companies[y].productid === Number(sel)) {
                            b1 = b.companies[y].buildings;
                        }
                    }
                    return a1 - b1;
                });
                this.city = this.filteredCities[this.filteredCities.length - 1];
            }
            _this.nextCity();
        });

        for (var x = 0; x < 5; x++) {
            document.getElementById("new-factory_" + x).addEventListener("click", (evt) => {
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = Number(sid.split("_")[1]);
                var comp = _this.city.companies[id];
                     if (!_this.city.commitBuildingCosts(comp.getBuildingCosts(), comp.getBuildingMaterial(), "buy building"))
                        return;
                    _this.city.buildBuilding(comp.productid);
                //comp.buildings++;
                _this.update();
            });
             document.getElementById("new-factory_" + x).addEventListener("contextmenu", (evt) => {
                 evt.preventDefault();
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = Number(sid.split("_")[1]);
                var comp = _this.city.companies[id];
                for (var i = 0; i < parameter.numberBuildWithContextMenu; i++) {
                    if (!_this.city.commitBuildingCosts(comp.getBuildingCosts(), comp.getBuildingMaterial(), "buy building"))
                        return;
                    _this.city.buildBuilding(comp.productid);
                }
                //comp.buildings++;
                _this.update();
            });
            document.getElementById("delete-factory_" + x).addEventListener("click", (evt) => {
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = Number(sid.split("_")[1]);
                var comp = _this.city.companies[id];
                if (_this.city.tryRemoveBuildingInProgress(comp.productid)) {
                    _this.update();
                    return;
                }

                if (comp.buildings > 0)
                    comp.buildings--;
                var unempl = this.city.companies[id].workers - (this.city.companies[id].buildings * parameter.workerInCompany);
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
                if (!_this.city.commitBuildingCosts(50000, [], "buy licence"))
                    return;
                comp.hasLicense = true;
            });

        }

        document.getElementById("buy-shop").addEventListener("click", (evt) => {
            if (!_this.city.commitBuildingCosts(15000, [], "buy building"))
                return;
            _this.city.buildBuilding(10000);
            _this.update();
        });
        document.getElementById("delete-shop").addEventListener("click", (evt) => {
            if (_this.city.shops === 0)
                return;
            if (_this.city.tryRemoveBuildingInProgress(10000)) {
                _this.update();
                return;
            }
            _this.city.shops--;
            _this.update();

        });

        for (var x = 0; x < 1; x++) {
            document.getElementById("new-airplane_" + x).addEventListener("click", (evt) => {
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = parseInt(sid.split("_")[1]);
                if (!_this.city.commitBuildingCosts(Math.round(parameter.allAirplaneTypes[id].buildingCosts *
                    parameter.rateBuyAirplane), parameter.allAirplaneTypes[id].buildingMaterial, "buy airplane"))
                    return;
                _this.city.buildAirplane(id);
                _this.update(true);
                //_this.newAirplane(id);
            });

        }
        CityDialogShop.getInstance().bindActions();
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
        var all = parameter.allProducts;
        for (var x = 0; x < companies.length; x++) {
            var comp = companies[x];
            var table = document.getElementById("citydialog-buildings-table");
            var tr = table.children[0].children[x + 1];
            var product = all[comp.productid];
            var produce = comp.getDailyProduce();
            tr.children[0].innerHTML = produce + " " + product.getIcon();
            tr.children[1].innerHTML = product.name;
            var s = comp.buildings.toString();
            var inprogr = this.city.getBuildingInProgress(comp.productid);
            if (inprogr) {
                s = s + "(" + inprogr + Icons.hammer + ")";
            }
            tr.children[2].innerHTML = s;
            tr.children[3].innerHTML = comp.workers + "/" + comp.getMaxWorkers();
            var needs1 = "";
            var needs2 = "";
            if (product.input1 !== undefined)
                needs1 = "" + comp.getDailyInput1() + all[product.input1].getIcon() + " ";
            tr.children[4].innerHTML = needs1;
            if (product.input2 !== undefined)
                needs2 = "<br/>" + comp.getDailyInput2() + all[product.input2].getIcon();
            tr.children[4].innerHTML = needs1 + " " + needs2;

            if (comp.hasLicense) {
                document.getElementById("buy-license_" + x).setAttribute("hidden", "");
            } else {
                document.getElementById("buy-license_" + x).removeAttribute("hidden");
            }
            if (this.city.shops === 0) {
                document.getElementById("no-shop_" + x).removeAttribute("hidden");
            } else {
                document.getElementById("no-shop_" + x).setAttribute("hidden", "");
            }

            if (comp.hasLicense && this.city.shops > 0) {
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
        var sh = "" + this.city.shops;
        var inprogr = this.city.getBuildingInProgress(10000);
        if (inprogr) {
            sh = sh + "(" + inprogr + Icons.hammer + ")";
        }
        document.getElementById("count-shops").innerHTML = "" + sh;
        document.getElementById("costs-shops").innerHTML = "" + this.city.getDailyCostsShops();

        if (this.city.canBuild(15000, []) !== "") {
            document.getElementById("buy-shop").setAttribute("disabled", "");
        } else {
            document.getElementById("buy-shop").removeAttribute("disabled");
        }




    }

    updateConstruction() {
        for (var x = 0; x < 1; x++) {
            if (this.city.canBuild(Math.round(parameter.allAirplaneTypes[x].buildingCosts * parameter.rateCostsAirplaine), parameter.allAirplaneTypes[x].buildingMaterial) === "") {
                document.getElementById("new-airplane_" + x).removeAttribute("disabled");
            } else {
                document.getElementById("new-airplane_" + x).setAttribute("disabled", "");

            }
        }
        var tab = document.getElementById("citydialog-constructionqueue-table");
        var html = `<tr>
                    <th>Modelname</th>
                    <th>Finished</th>
                    <th></th>
                </tr>`;
        for (var x = 0; x < this.city.queueAirplane.length; x++) {
            html += '<tr><td >' + this.city.queueAirplane[x].name + "</td>";
            html += "     <td>" + new Date(this.city.queueAirplane[x].ready).toLocaleDateString() + "</td>";
            html += "</tr>";
        }
        tab.innerHTML = html;
    }
    updateScore() {
        var needs = [];
        for (var x = 0; x < parameter.allProducts.length; x++) {
            needs.push(0);
        }
        for (var i = 0; i < this.city.companies.length; i++) {
            var test = parameter.allProducts[this.city.companies[i].productid];
            if (test.input1 !== undefined) {
                needs[test.input1] += (Math.round(this.city.companies[i].workers * test.input1Amount / parameter.workerInCompany));
            }
            if (test.input2 !== undefined) {
                needs[test.input2] += (Math.round(this.city.companies[i].workers * test.input2Amount / parameter.workerInCompany));
            }
        }
        //score
        for (var x = 0; x < parameter.allProducts.length; x++) {
            var table = document.getElementById("citydialog-score-table");
            var tr = table.children[0].children[x + 1];
            var prod = "";
            var product = parameter.allProducts[x];
            for (var i = 0; i < this.city.companies.length; i++) {
                if (this.city.companies[i].productid === x) {
                    prod = Math.round(this.city.companies[i].workers * product.dailyProduce / parameter.workerInCompany).toString();
                }
            }

            tr.children[2].innerHTML = prod;
            tr.children[3].innerHTML = needs[x] === 0 ? "" : needs[x];
            tr.children[4].innerHTML = this.city.score[x] + "</td>";
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
        if (!this.city.hasAirport)
            return;
        this.updateTitle();
       
        if (document.getElementById("citydialog-buildings-tab")?.parentElement?.classList?.contains("ui-tabs-active"))
            this.updateBuildings();
        if (force || document.getElementById("citydialog-shop-tab")?.parentElement?.classList?.contains("ui-tabs-active"))
            CityDialogShop.getInstance().update();
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
}
