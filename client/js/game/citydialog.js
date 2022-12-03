define(["require", "exports", "game/city", "game/icons", "game/citydialogmarket", "game/citydialogshop"], function (require, exports, city_1, icons_1, citydialogmarket_1, citydialogshop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CityDialog = void 0;
    //@ts-ignore
    window.city = function () {
        return CityDialog.getInstance().city;
    };
    class CityDialog {
        constructor() {
            this.hasPaused = false;
            this.create();
        }
        static getInstance() {
            if (CityDialog.instance === undefined)
                CityDialog.instance = new CityDialog();
            return CityDialog.instance;
        }
        create() {
            //template for code reloading
            var sdom = `
          <div hidden id="citydialog" class="citydialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
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
            <input id="citydialog-prev" type="button" value="<"  class="mybutton"/>
            <input id="citydialog-next" type="button" value=">"  class="mybutton"/>
            <select id="citydialog-filter" style="width:80px">
                ` + this.productFilter() + `
            </select>
          </div>
            <div id="citydialog-tabs">
                <ul>
                    <li><a href="#citydialog-market" id="citydialog-market-tab" class="citydialog-tabs">Market</a></li>
                    <li><a href="#citydialog-buildings" id="citydialog-buildings-tab" class="citydialog-tabs">Buildings</a></li>
                    <li><a href="#citydialog-shop" id="citydialog-shop-tab"  class="citydialog-tabs">` + icons_1.Icons.shop + ` MyShop</a></li>
                    <li><a href="#citydialog-construction" id="citydialog-construction-tab" class="citydialog-tabs">Construction</a></li>
                    <li><a href="#citydialog-score" id="citydialog-score-tab"  class="citydialog-tabs">Score</a></li>
                </ul>
                <div id="citydialog-market">` + citydialogmarket_1.CityDialogMarket.getInstance().create() + `
                </div>
                <div id="citydialog-buildings"> ` + this.createBuildings() + `
                </div>
                <div id="citydialog-shop">` + citydialogshop_1.CityDialogShop.getInstance().create() + `
                </div>
                <div id="citydialog-construction">` + this.createConstruction() + `
                </div>
                <div id="citydialog-score">` + this.createScore() + `
                </div>
          </div>
        `;
            var newdom = document.createRange().createContextualFragment(sdom).children[0];
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
                    ret = ret + '<td><button id="new-factory_' + x + '" class="mybutton">' + "+" + icons_1.Icons.factory + '</button>' +
                        '<button id="delete-factory_' + x + '" class="mybutton">' + "-" + icons_1.Icons.factory + '</button>' +
                        '<button id="buy-license_' + x + '" class="mybutton">' + "buy license to produce for 50.000" + icons_1.Icons.money + '</button>' +
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
                       ` + icons_1.Icons.shop + ` Shops: <span id="count-shops">0/0</span>  
                        ` + ` costs: <span id="costs-shops">0</span> ` + icons_1.Icons.money + `  
                        <button id="buy-shop"  class="mybutton">+` + icons_1.Icons.home + ` for 15.000` + icons_1.Icons.money + " 20x" + parameter.allProducts[0].getIcon() +
                " 40x" + parameter.allProducts[1].getIcon() + `</button> 
                        <button id="delete-shop"  class="mybutton">-` + icons_1.Icons.home + `</button>`;
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
                    ret = ret + "<td>" + '<button id="new-airplane_' + x + '" class="mybutton">' + "+" + icons_1.Icons.airplane + " " +
                        city_1.City.getBuildingCostsAsIcon(Math.round(parameter.allAirplaneTypes[x].buildingCosts * parameter.rateCostsAirplaine), parameter.allAirplaneTypes[x].buildingMaterial) + "</button></td>";
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
                var sel = document.getElementById("citydialog-filter").value;
                if (sel === "all")
                    this.filteredCities = _this.city.world.cities;
                else {
                    this.filteredCities = [];
                    for (var x = 0; x < _this.city.world.cities.length; x++) {
                        var city = _this.city.world.cities[x];
                        for (var y = 0; y < city.companies.length; y++) {
                            if (city.companies[y].productid === Number(sel)) {
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
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
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
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
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
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
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
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = Number(sid.split("_")[1]);
                    var comp = _this.city.companies[id];
                    if (!_this.city.commitBuildingCosts(50000, [], "buy licence"))
                        return;
                    comp.hasLicense = true;
                });
            }
            document.getElementById("buy-shop").addEventListener("click", (evt) => {
                if (!_this.city.commitBuildingCosts(15000, [20, 40], "buy building"))
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
            for (var x = 0; x < parameter.allAirplaneTypes.length; x++) {
                document.getElementById("new-airplane_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = parseInt(sid.split("_")[1]);
                    if (!_this.city.commitBuildingCosts(Math.round(parameter.allAirplaneTypes[id].buildingCosts *
                        parameter.rateBuyAirplane), parameter.allAirplaneTypes[id].buildingMaterial, "buy airplane"))
                        return;
                    _this.city.buildAirplane(id);
                    _this.update(true);
                    //_this.newAirplane(id);
                });
            }
            citydialogshop_1.CityDialogShop.getInstance().bindActions();
            citydialogmarket_1.CityDialogMarket.getInstance().bindActions();
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
                    s = s + "(" + inprogr + icons_1.Icons.hammer + ")";
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
                }
                else {
                    document.getElementById("buy-license_" + x).removeAttribute("hidden");
                }
                if (this.city.shops === 0) {
                    document.getElementById("no-shop_" + x).removeAttribute("hidden");
                }
                else {
                    document.getElementById("no-shop_" + x).setAttribute("hidden", "");
                }
                if (comp.hasLicense && this.city.shops > 0) {
                    document.getElementById("new-factory_" + x).innerHTML = "+" + icons_1.Icons.factory +
                        city_1.City.getBuildingCostsAsIcon(comp.getBuildingCosts(), comp.getBuildingMaterial());
                    document.getElementById("new-factory_" + x).removeAttribute("hidden");
                    document.getElementById("delete-factory_" + x).removeAttribute("hidden");
                }
                else {
                    document.getElementById("new-factory_" + x).setAttribute("hidden", "");
                    document.getElementById("delete-factory_" + x).setAttribute("hidden", "");
                }
                var mat = comp.getBuildingMaterial();
                if (this.city.canBuild(comp.getBuildingCosts(), comp.getBuildingMaterial()) != "") {
                    document.getElementById("new-factory_" + x).setAttribute("disabled", "");
                    document.getElementById("new-factory_" + x).setAttribute("title", "not all building costs are available");
                }
                else {
                    document.getElementById("new-factory_" + x).removeAttribute("disabled");
                    document.getElementById("new-factory_" + x).removeAttribute("title");
                }
                if (this.city.canBuild(50000, []) === "") {
                    document.getElementById("buy-license_" + x).removeAttribute("disabled");
                }
                else {
                    document.getElementById("buy-license_" + x).setAttribute("disabled", "");
                }
            }
            var sh = "" + this.city.shops;
            var inprogr = this.city.getBuildingInProgress(10000);
            if (inprogr) {
                sh = sh + "(" + inprogr + icons_1.Icons.hammer + ")";
            }
            document.getElementById("count-shops").innerHTML = "" + sh;
            document.getElementById("costs-shops").innerHTML = "" + this.city.getDailyCostsShops();
            if (this.city.canBuild(15000, [20, 40]) !== "") {
                document.getElementById("buy-shop").setAttribute("disabled", "");
            }
            else {
                document.getElementById("buy-shop").removeAttribute("disabled");
            }
        }
        updateConstruction() {
            for (var x = 0; x < parameter.allAirplaneTypes.length; x++) {
                if (this.city.canBuild(Math.round(parameter.allAirplaneTypes[x].buildingCosts * parameter.rateCostsAirplaine), parameter.allAirplaneTypes[x].buildingMaterial) === "") {
                    document.getElementById("new-airplane_" + x).removeAttribute("disabled");
                }
                else {
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            if (!this.city)
                return;
            try {
                if (!$(this.dom).dialog('isOpen')) {
                    return;
                }
            }
            catch (_u) {
                return;
            }
            if (!this.city.hasAirport)
                return;
            this.updateTitle();
            //pause game while trading
            if (!force) {
                if ((_c = (_b = (_a = document.getElementById("citydialog-market-tab")) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.classList) === null || _c === void 0 ? void 0 : _c.contains("ui-tabs-active")) {
                    if (!this.city.world.game.isPaused()) {
                        this.hasPaused = true;
                        this.city.world.game.pause();
                    }
                    return; ///no update because of slider
                }
                else {
                    if (this.hasPaused) {
                        this.city.world.game.resume();
                    }
                }
            }
            citydialogmarket_1.CityDialogMarket.getInstance().update();
            if ((_f = (_e = (_d = document.getElementById("citydialog-market-tab")) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.classList) === null || _f === void 0 ? void 0 : _f.contains("ui-tabs-active"))
                citydialogmarket_1.CityDialogMarket.getInstance().update();
            if ((_j = (_h = (_g = document.getElementById("citydialog-buildings-tab")) === null || _g === void 0 ? void 0 : _g.parentElement) === null || _h === void 0 ? void 0 : _h.classList) === null || _j === void 0 ? void 0 : _j.contains("ui-tabs-active"))
                this.updateBuildings();
            if (force || ((_m = (_l = (_k = document.getElementById("citydialog-shop-tab")) === null || _k === void 0 ? void 0 : _k.parentElement) === null || _l === void 0 ? void 0 : _l.classList) === null || _m === void 0 ? void 0 : _m.contains("ui-tabs-active")))
                citydialogshop_1.CityDialogShop.getInstance().update();
            if ((_q = (_p = (_o = document.getElementById("citydialog-construction-tab")) === null || _o === void 0 ? void 0 : _o.parentElement) === null || _p === void 0 ? void 0 : _p.classList) === null || _q === void 0 ? void 0 : _q.contains("ui-tabs-active"))
                this.updateConstruction();
            if ((_t = (_s = (_r = document.getElementById("citydialog-score-tab")) === null || _r === void 0 ? void 0 : _r.parentElement) === null || _s === void 0 ? void 0 : _s.classList) === null || _t === void 0 ? void 0 : _t.contains("ui-tabs-active"))
                this.updateScore();
            return;
        }
        updateTitle() {
            var sicon = '';
            if ($(this.dom).parent().find('.ui-dialog-title').length > 0)
                $(this.dom).parent().find('.ui-dialog-title')[0].innerHTML = '<img style="float: right" id="citydialog-icon" src="' + this.city.icon +
                    '"  height="15"></img> ' + this.city.name + " " + this.city.people + " " + icons_1.Icons.people;
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
    exports.CityDialog = CityDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBU0EsWUFBWTtJQUNaLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDVixPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDekMsQ0FBQyxDQUFBO0lBRUQsTUFBYSxVQUFVO1FBTW5CO1lBSEEsY0FBUyxHQUFHLEtBQUssQ0FBQztZQUlkLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDakMsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQzNDLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUMvQixDQUFDO1FBR08sTUFBTTtZQUNWLDZCQUE2QjtZQUM3QixJQUFJLElBQUksR0FBRzs7OztTQUlWLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNoRCxJQUFJLEdBQUcsRUFBRTtnQkFDTCxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQztZQUVELElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7WUFDckMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDdEIsSUFBSSxJQUFJLEdBQUc7Ozs7OztpQkFNRixHQUFFLElBQUksQ0FBQyxh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Q0FBQztnQkFDRCxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsR0FBRztvQkFDcEIsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO3dCQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2xDO2dCQUNMLENBQUM7Z0JBQ0QsTUFBTSxFQUFFLFVBQVUsQ0FBQztvQkFDZixVQUFVLENBQUMsR0FBRyxFQUFFO3dCQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFOzRCQUNuRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2xCLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDWixDQUFDO2FBQ0osQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXBELENBQUM7UUFDRCxLQUFLO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBM2tCRCxnQ0Eya0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcbmltcG9ydCB7IFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XG5pbXBvcnQgeyBJY29ucyB9IGZyb20gXCJnYW1lL2ljb25zXCI7XG5pbXBvcnQgeyBBaXJwbGFuZSB9IGZyb20gXCJnYW1lL2FpcnBsYW5lXCI7XG5pbXBvcnQgeyBBaXJwbGFuZURpYWxvZyB9IGZyb20gXCJnYW1lL2FpcnBsYW5lZGlhbG9nXCI7XG5pbXBvcnQgeyBDb21wYW55IH0gZnJvbSBcImdhbWUvY29tcGFueVwiO1xuaW1wb3J0IHsgQ2l0eURpYWxvZ01hcmtldCB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dtYXJrZXRcIjtcbmltcG9ydCB7IENpdHlEaWFsb2dTaG9wIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ3Nob3BcIjtcblxuLy9AdHMtaWdub3JlXG53aW5kb3cuY2l0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNpdHk7XG59XG5cbmV4cG9ydCBjbGFzcyBDaXR5RGlhbG9nIHtcbiAgICBkb206IEhUTUxEaXZFbGVtZW50O1xuICAgIGNpdHk6IENpdHk7XG4gICAgaGFzUGF1c2VkID0gZmFsc2U7XG4gICAgZmlsdGVyZWRDaXRpZXM6IENpdHlbXTtcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQ2l0eURpYWxvZyB7XG4gICAgICAgIGlmIChDaXR5RGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBDaXR5RGlhbG9nLmluc3RhbmNlID0gbmV3IENpdHlEaWFsb2coKTtcbiAgICAgICAgcmV0dXJuIENpdHlEaWFsb2cuaW5zdGFuY2U7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJjaXR5ZGlhbG9nXCIgY2xhc3M9XCJjaXR5ZGlhbG9nXCI+XG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxuICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgdGhpcy5kb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nXCIpO1xuICAgICAgICBpZiAob2xkKSB7XG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByb2R1Y3RzID0gcGFyYW1ldGVyLmFsbFByb2R1Y3RzO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY2l0eSA9IF90aGlzLmNpdHk7XG4gICAgICAgIHZhciBzZG9tID0gYFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImNpdHlkaWFsb2ctcHJldlwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjxcIiAgY2xhc3M9XCJteWJ1dHRvblwiLz5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImNpdHlkaWFsb2ctbmV4dFwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIj5cIiAgY2xhc3M9XCJteWJ1dHRvblwiLz5cbiAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJjaXR5ZGlhbG9nLWZpbHRlclwiIHN0eWxlPVwid2lkdGg6ODBweFwiPlxuICAgICAgICAgICAgICAgIGArIHRoaXMucHJvZHVjdEZpbHRlcigpICsgYFxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy10YWJzXCI+XG4gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLW1hcmtldFwiIGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFiXCIgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5NYXJrZXQ8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1idWlsZGluZ3NcIiBpZD1cImNpdHlkaWFsb2ctYnVpbGRpbmdzLXRhYlwiIGNsYXNzPVwiY2l0eWRpYWxvZy10YWJzXCI+QnVpbGRpbmdzPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2NpdHlkaWFsb2ctc2hvcFwiIGlkPVwiY2l0eWRpYWxvZy1zaG9wLXRhYlwiICBjbGFzcz1cImNpdHlkaWFsb2ctdGFic1wiPmArIEljb25zLnNob3AgKyBgIE15U2hvcDwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvblwiIGlkPVwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb24tdGFiXCIgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5Db25zdHJ1Y3Rpb248L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1zY29yZVwiIGlkPVwiY2l0eWRpYWxvZy1zY29yZS10YWJcIiAgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5TY29yZTwvYT48L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctbWFya2V0XCI+YCsgQ2l0eURpYWxvZ01hcmtldC5nZXRJbnN0YW5jZSgpLmNyZWF0ZSgpICsgYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLWJ1aWxkaW5nc1wiPiBgKyB0aGlzLmNyZWF0ZUJ1aWxkaW5ncygpICsgYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLXNob3BcIj5gKyBDaXR5RGlhbG9nU2hvcC5nZXRJbnN0YW5jZSgpLmNyZWF0ZSgpICsgYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvblwiPmArIHRoaXMuY3JlYXRlQ29uc3RydWN0aW9uKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctc2NvcmVcIj5gKyB0aGlzLmNyZWF0ZVNjb3JlKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XG4gICAgICAgICQoXCIjY2l0eWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuXG4gICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICQoXCIjY2l0eWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgX3RoaXMuYmluZEFjdGlvbnMoKTsgfSwgNTAwKTtcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB9XG4gICAgcHJvZHVjdEZpbHRlcigpIHtcbiAgICAgICAgdmFyIHJldCA9ICc8b3B0aW9uIHZhbHVlPVwiYWxsXCI+QWxsPC9vcHRpb24+JztcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIC8vICByZXQrPSc8b3B0aW9uIHZhbHVlPVwiJyt4KydcIj48c3Bhbj4nK3BhcmFtZXRlci5hbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkrXCIgXCIrcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdLm5hbWUrJzwvc3Bhbj48L29wdGlvbj4nO1xuICAgICAgICAgICAgcmV0ICs9ICc8b3B0aW9uIHZhbHVlPVwiJyArIHggKyAnXCI+JyArIHBhcmFtZXRlci5hbGxQcm9kdWN0c1t4XS5uYW1lICsgJzwvb3B0aW9uPic7XG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBjcmVhdGVCdWlsZGluZ3MoKSB7XG4gICAgICAgIHJldHVybiBgPHRhYmxlIGlkPVwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Qcm9kdWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJ1aWxkaW5nczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkpvYnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OZWVkczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgNTsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPjxidXR0b24gaWQ9XCJuZXctZmFjdG9yeV8nICsgeCArICdcIiBjbGFzcz1cIm15YnV0dG9uXCI+JyArIFwiK1wiICsgSWNvbnMuZmFjdG9yeSArICc8L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YnV0dG9uIGlkPVwiZGVsZXRlLWZhY3RvcnlfJyArIHggKyAnXCIgY2xhc3M9XCJteWJ1dHRvblwiPicgKyBcIi1cIiArIEljb25zLmZhY3RvcnkgKyAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiBpZD1cImJ1eS1saWNlbnNlXycgKyB4ICsgJ1wiIGNsYXNzPVwibXlidXR0b25cIj4nICsgXCJidXkgbGljZW5zZSB0byBwcm9kdWNlIGZvciA1MC4wMDBcIiArIEljb25zLm1vbmV5ICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJuby1zaG9wXycgKyB4ICsgJ1wiPm5lZWQgYSBzaG9wIHRvIHByb2R1Y2U8L2Rpdj4nICtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Yj5NeS1TaG9wczwvYj5cbiAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgYCsgSWNvbnMuc2hvcCArIGAgU2hvcHM6IDxzcGFuIGlkPVwiY291bnQtc2hvcHNcIj4wLzA8L3NwYW4+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGAgKyBgIGNvc3RzOiA8c3BhbiBpZD1cImNvc3RzLXNob3BzXCI+MDwvc3Bhbj4gYCArIEljb25zLm1vbmV5ICsgYCAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYnV5LXNob3BcIiAgY2xhc3M9XCJteWJ1dHRvblwiPitgKyBJY29ucy5ob21lICsgYCBmb3IgMTUuMDAwYCArIEljb25zLm1vbmV5ICsgXCIgMjB4XCIgKyBwYXJhbWV0ZXIuYWxsUHJvZHVjdHNbMF0uZ2V0SWNvbigpICtcbiAgICAgICAgICAgIFwiIDQweFwiICsgcGFyYW1ldGVyLmFsbFByb2R1Y3RzWzFdLmdldEljb24oKSArIGA8L2J1dHRvbj4gXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiZGVsZXRlLXNob3BcIiAgY2xhc3M9XCJteWJ1dHRvblwiPi1gKyBJY29ucy5ob21lICsgYDwvYnV0dG9uPmA7XG4gICAgfVxuXG4gICAgY3JlYXRlU2NvcmUoKSB7XG4gICAgICAgIHJldHVybiBgPHRhYmxlIGlkPVwiY2l0eWRpYWxvZy1zY29yZS10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4gPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+UHJvZHVjZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5lZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TY29yZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBwYXJhbWV0ZXIuYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD4wPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5gO1xuICAgIH1cbiAgICBjcmVhdGVDb25zdHJ1Y3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBgPHRhYmxlIGlkPVwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb24tdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Nb2RlbDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlNwZWVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+Q2FwYWNpdHk8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5EYWlseSBDb3N0czwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJ1aWxkIGRheXM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5BY3Rpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzW3hdLm1vZGVsICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzW3hdLnNwZWVkICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzW3hdLmNhcGFjaXR5ICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzW3hdLmNvc3RzICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkRGF5cyArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyAnPGJ1dHRvbiBpZD1cIm5ldy1haXJwbGFuZV8nICsgeCArICdcIiBjbGFzcz1cIm15YnV0dG9uXCI+JyArIFwiK1wiICsgSWNvbnMuYWlycGxhbmUgKyBcIiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBDaXR5LmdldEJ1aWxkaW5nQ29zdHNBc0ljb24oTWF0aC5yb3VuZChwYXJhbWV0ZXIuYWxsQWlycGxhbmVUeXBlc1t4XS5idWlsZGluZ0Nvc3RzICogcGFyYW1ldGVyLnJhdGVDb3N0c0FpcnBsYWluZSksIHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkaW5nTWF0ZXJpYWwpICsgXCI8L2J1dHRvbj48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfSAgXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cblxuICAgICAgICAgICAgICAgIDx0YWJsZSBpZD1cImNpdHlkaWFsb2ctY29uc3RydWN0aW9ucXVldWUtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgPC90YWJsZT4gXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGA7XG4gICAgfVxuICAgIG5leHRDaXR5KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoX3RoaXMuZmlsdGVyZWRDaXRpZXMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIF90aGlzLmZpbHRlcmVkQ2l0aWVzID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXM7XG4gICAgICAgIHZhciBwb3MgPSBfdGhpcy5maWx0ZXJlZENpdGllcy5pbmRleE9mKF90aGlzLmNpdHkpO1xuICAgICAgICBwb3MrKztcbiAgICAgICAgaWYgKHBvcyA+PSBfdGhpcy5maWx0ZXJlZENpdGllcy5sZW5ndGgpXG4gICAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICBfdGhpcy5jaXR5ID0gX3RoaXMuZmlsdGVyZWRDaXRpZXNbcG9zXTtcbiAgICAgICAgaWYgKF90aGlzLmNpdHkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIF90aGlzLmNpdHkgPSBfdGhpcy5maWx0ZXJlZENpdGllc1swXTtcbiAgICAgICAgaWYgKCFfdGhpcy5jaXR5Lmhhc0FpcnBvcnQpXG4gICAgICAgICAgICB0aGlzLm5leHRDaXR5KCk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICB9XG4gICAgcHJldkNpdHkoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmZpbHRlcmVkQ2l0aWVzID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkQ2l0aWVzID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXM7XG4gICAgICAgIHZhciBwb3MgPSBfdGhpcy5maWx0ZXJlZENpdGllcy5pbmRleE9mKF90aGlzLmNpdHkpO1xuICAgICAgICBwb3MtLTtcbiAgICAgICAgaWYgKHBvcyA9PT0gLTEpXG4gICAgICAgICAgICBwb3MgPSBfdGhpcy5maWx0ZXJlZENpdGllcy5sZW5ndGggLSAxO1xuICAgICAgICBfdGhpcy5jaXR5ID0gX3RoaXMuZmlsdGVyZWRDaXRpZXNbcG9zXTtcbiAgICAgICAgaWYgKF90aGlzLmNpdHkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIF90aGlzLmNpdHkgPSBfdGhpcy5maWx0ZXJlZENpdGllc1swXTtcbiAgICAgICAgaWYgKCFfdGhpcy5jaXR5Lmhhc0FpcnBvcnQpXG4gICAgICAgICAgICB0aGlzLnByZXZDaXR5KCk7XG5cbiAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgIH1cbiAgICBiaW5kQWN0aW9ucygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgX3RoaXMubmV4dENpdHkoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIF90aGlzLnByZXZDaXR5KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctZmlsdGVyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICB2YXIgc2VsID0gKDxIVE1MU2VsZWN0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctZmlsdGVyXCIpKS52YWx1ZTtcbiAgICAgICAgICAgIGlmIChzZWwgPT09IFwiYWxsXCIpXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZENpdGllcyA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZENpdGllcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgX3RoaXMuY2l0eS53b3JsZC5jaXRpZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNpdHkgPSBfdGhpcy5jaXR5LndvcmxkLmNpdGllc1t4XTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBjaXR5LmNvbXBhbmllcy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNpdHkuY29tcGFuaWVzW3ldLnByb2R1Y3RpZCA9PT0gTnVtYmVyKHNlbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkQ2l0aWVzLnB1c2goY2l0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZENpdGllcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhMSwgYjE7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgYS5jb21wYW5pZXMubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhLmNvbXBhbmllc1t5XS5wcm9kdWN0aWQgPT09IE51bWJlcihzZWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYTEgPSBhLmNvbXBhbmllc1t5XS5idWlsZGluZ3M7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBiLmNvbXBhbmllcy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGIuY29tcGFuaWVzW3ldLnByb2R1Y3RpZCA9PT0gTnVtYmVyKHNlbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiMSA9IGIuY29tcGFuaWVzW3ldLmJ1aWxkaW5ncztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYTEgLSBiMTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmNpdHkgPSB0aGlzLmZpbHRlcmVkQ2l0aWVzW3RoaXMuZmlsdGVyZWRDaXRpZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5uZXh0Q2l0eSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IDU7IHgrKykge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoc2lkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBfdGhpcy5jaXR5LmNvbXBhbmllc1tpZF07XG4gICAgICAgICAgICAgICAgICAgICBpZiAoIV90aGlzLmNpdHkuY29tbWl0QnVpbGRpbmdDb3N0cyhjb21wLmdldEJ1aWxkaW5nQ29zdHMoKSwgY29tcC5nZXRCdWlsZGluZ01hdGVyaWFsKCksIFwiYnV5IGJ1aWxkaW5nXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LmJ1aWxkQnVpbGRpbmcoY29tcC5wcm9kdWN0aWQpO1xuICAgICAgICAgICAgICAgIC8vY29tcC5idWlsZGluZ3MrKztcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkuaWQ7XG4gICAgICAgICAgICAgICAgaWYgKHNpZCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkucGFyZW50Tm9kZS5pZFxuICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcihzaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgY29tcCA9IF90aGlzLmNpdHkuY29tcGFuaWVzW2lkXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtZXRlci5udW1iZXJCdWlsZFdpdGhDb250ZXh0TWVudTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX3RoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKGNvbXAuZ2V0QnVpbGRpbmdDb3N0cygpLCBjb21wLmdldEJ1aWxkaW5nTWF0ZXJpYWwoKSwgXCJidXkgYnVpbGRpbmdcIikpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNpdHkuYnVpbGRCdWlsZGluZyhjb21wLnByb2R1Y3RpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vY29tcC5idWlsZGluZ3MrKztcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtZmFjdG9yeV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoc2lkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBfdGhpcy5jaXR5LmNvbXBhbmllc1tpZF07XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmNpdHkudHJ5UmVtb3ZlQnVpbGRpbmdJblByb2dyZXNzKGNvbXAucHJvZHVjdGlkKSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjb21wLmJ1aWxkaW5ncyA+IDApXG4gICAgICAgICAgICAgICAgICAgIGNvbXAuYnVpbGRpbmdzLS07XG4gICAgICAgICAgICAgICAgdmFyIHVuZW1wbCA9IHRoaXMuY2l0eS5jb21wYW5pZXNbaWRdLndvcmtlcnMgLSAodGhpcy5jaXR5LmNvbXBhbmllc1tpZF0uYnVpbGRpbmdzICogcGFyYW1ldGVyLndvcmtlckluQ29tcGFueSk7XG4gICAgICAgICAgICAgICAgaWYgKHVuZW1wbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5LmNvbXBhbmllc1tpZF0ud29ya2VycyAtPSB1bmVtcGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eS50cmFuc2Zlcldvcmtlcih1bmVtcGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktbGljZW5zZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoc2lkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBfdGhpcy5jaXR5LmNvbXBhbmllc1tpZF07XG4gICAgICAgICAgICAgICAgaWYgKCFfdGhpcy5jaXR5LmNvbW1pdEJ1aWxkaW5nQ29zdHMoNTAwMDAsIFtdLCBcImJ1eSBsaWNlbmNlXCIpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY29tcC5oYXNMaWNlbnNlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1zaG9wXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLmNpdHkuY29tbWl0QnVpbGRpbmdDb3N0cygxNTAwMCwgWzIwLCA0MF0sIFwiYnV5IGJ1aWxkaW5nXCIpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIF90aGlzLmNpdHkuYnVpbGRCdWlsZGluZygxMDAwMCk7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLXNob3BcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5jaXR5LnNob3BzID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmIChfdGhpcy5jaXR5LnRyeVJlbW92ZUJ1aWxkaW5nSW5Qcm9ncmVzcygxMDAwMCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5jaXR5LnNob3BzLS07XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1haXJwbGFuZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChzaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBpZiAoIV90aGlzLmNpdHkuY29tbWl0QnVpbGRpbmdDb3N0cyhNYXRoLnJvdW5kKHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzW2lkXS5idWlsZGluZ0Nvc3RzICpcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyLnJhdGVCdXlBaXJwbGFuZSksIHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzW2lkXS5idWlsZGluZ01hdGVyaWFsLCBcImJ1eSBhaXJwbGFuZVwiKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIF90aGlzLmNpdHkuYnVpbGRBaXJwbGFuZShpZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgICAgIC8vX3RoaXMubmV3QWlycGxhbmUoaWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBDaXR5RGlhbG9nU2hvcC5nZXRJbnN0YW5jZSgpLmJpbmRBY3Rpb25zKCk7XG4gICAgICAgIENpdHlEaWFsb2dNYXJrZXQuZ2V0SW5zdGFuY2UoKS5iaW5kQWN0aW9ucygpO1xuICAgIH1cblxuXG5cbiAgICB1cGRhdGVCdWlsZGluZ3MoKSB7XG4gICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPnByb2R1Y2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5idWlsZGluZ3M8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+am9iczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5uZWVkczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+Y29zdHMgbmV3IGJ1aWxkaW5nPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmFjdGlvbnM8L3RoPlxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgdmFyIGNvbXBhbmllcyA9IHRoaXMuY2l0eS5jb21wYW5pZXM7XG4gICAgICAgIHZhciBhbGwgPSBwYXJhbWV0ZXIuYWxsUHJvZHVjdHM7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY29tcGFuaWVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IGNvbXBhbmllc1t4XTtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG4gICAgICAgICAgICB2YXIgcHJvZHVjdCA9IGFsbFtjb21wLnByb2R1Y3RpZF07XG4gICAgICAgICAgICB2YXIgcHJvZHVjZSA9IGNvbXAuZ2V0RGFpbHlQcm9kdWNlKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblswXS5pbm5lckhUTUwgPSBwcm9kdWNlICsgXCIgXCIgKyBwcm9kdWN0LmdldEljb24oKTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzFdLmlubmVySFRNTCA9IHByb2R1Y3QubmFtZTtcbiAgICAgICAgICAgIHZhciBzID0gY29tcC5idWlsZGluZ3MudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHZhciBpbnByb2dyID0gdGhpcy5jaXR5LmdldEJ1aWxkaW5nSW5Qcm9ncmVzcyhjb21wLnByb2R1Y3RpZCk7XG4gICAgICAgICAgICBpZiAoaW5wcm9ncikge1xuICAgICAgICAgICAgICAgIHMgPSBzICsgXCIoXCIgKyBpbnByb2dyICsgSWNvbnMuaGFtbWVyICsgXCIpXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ci5jaGlsZHJlblsyXS5pbm5lckhUTUwgPSBzO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bM10uaW5uZXJIVE1MID0gY29tcC53b3JrZXJzICsgXCIvXCIgKyBjb21wLmdldE1heFdvcmtlcnMoKTtcbiAgICAgICAgICAgIHZhciBuZWVkczEgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIG5lZWRzMiA9IFwiXCI7XG4gICAgICAgICAgICBpZiAocHJvZHVjdC5pbnB1dDEgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBuZWVkczEgPSBcIlwiICsgY29tcC5nZXREYWlseUlucHV0MSgpICsgYWxsW3Byb2R1Y3QuaW5wdXQxXS5nZXRJY29uKCkgKyBcIiBcIjtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzRdLmlubmVySFRNTCA9IG5lZWRzMTtcbiAgICAgICAgICAgIGlmIChwcm9kdWN0LmlucHV0MiAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIG5lZWRzMiA9IFwiPGJyLz5cIiArIGNvbXAuZ2V0RGFpbHlJbnB1dDIoKSArIGFsbFtwcm9kdWN0LmlucHV0Ml0uZ2V0SWNvbigpO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bNF0uaW5uZXJIVE1MID0gbmVlZHMxICsgXCIgXCIgKyBuZWVkczI7XG5cbiAgICAgICAgICAgIGlmIChjb21wLmhhc0xpY2Vuc2UpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5zaG9wcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm8tc2hvcF9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby1zaG9wX1wiICsgeCkuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcC5oYXNMaWNlbnNlICYmIHRoaXMuY2l0eS5zaG9wcyA+IDApIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkuaW5uZXJIVE1MID0gXCIrXCIgKyBJY29ucy5mYWN0b3J5ICtcbiAgICAgICAgICAgICAgICAgICAgQ2l0eS5nZXRCdWlsZGluZ0Nvc3RzQXNJY29uKGNvbXAuZ2V0QnVpbGRpbmdDb3N0cygpLCBjb21wLmdldEJ1aWxkaW5nTWF0ZXJpYWwoKSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1mYWN0b3J5X1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWZhY3RvcnlfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWF0ID0gY29tcC5nZXRCdWlsZGluZ01hdGVyaWFsKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5jaXR5LmNhbkJ1aWxkKGNvbXAuZ2V0QnVpbGRpbmdDb3N0cygpLCBjb21wLmdldEJ1aWxkaW5nTWF0ZXJpYWwoKSkgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgXCJub3QgYWxsIGJ1aWxkaW5nIGNvc3RzIGFyZSBhdmFpbGFibGVcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwidGl0bGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaXR5LmNhbkJ1aWxkKDUwMDAwLCBbXSkgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIHZhciBzaCA9IFwiXCIgKyB0aGlzLmNpdHkuc2hvcHM7XG4gICAgICAgIHZhciBpbnByb2dyID0gdGhpcy5jaXR5LmdldEJ1aWxkaW5nSW5Qcm9ncmVzcygxMDAwMCk7XG4gICAgICAgIGlmIChpbnByb2dyKSB7XG4gICAgICAgICAgICBzaCA9IHNoICsgXCIoXCIgKyBpbnByb2dyICsgSWNvbnMuaGFtbWVyICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb3VudC1zaG9wc1wiKS5pbm5lckhUTUwgPSBcIlwiICsgc2g7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29zdHMtc2hvcHNcIikuaW5uZXJIVE1MID0gXCJcIiArIHRoaXMuY2l0eS5nZXREYWlseUNvc3RzU2hvcHMoKTtcblxuICAgICAgICBpZiAodGhpcy5jaXR5LmNhbkJ1aWxkKDE1MDAwLCBbMjAsIDQwXSkgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LXNob3BcIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1zaG9wXCIpLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICB9XG5cblxuXG5cbiAgICB9XG5cbiAgICB1cGRhdGVDb25zdHJ1Y3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNpdHkuY2FuQnVpbGQoTWF0aC5yb3VuZChwYXJhbWV0ZXIuYWxsQWlycGxhbmVUeXBlc1t4XS5idWlsZGluZ0Nvc3RzICogcGFyYW1ldGVyLnJhdGVDb3N0c0FpcnBsYWluZSksIHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkaW5nTWF0ZXJpYWwpID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctYWlycGxhbmVfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctYWlycGxhbmVfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciB0YWIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctY29uc3RydWN0aW9ucXVldWUtdGFibGVcIik7XG4gICAgICAgIHZhciBodG1sID0gYDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRoPk1vZGVsbmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD5GaW5pc2hlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgIDwvdHI+YDtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdHkucXVldWVBaXJwbGFuZS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaHRtbCArPSAnPHRyPjx0ZCA+JyArIHRoaXMuY2l0eS5xdWV1ZUFpcnBsYW5lW3hdLm5hbWUgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICBodG1sICs9IFwiICAgICA8dGQ+XCIgKyBuZXcgRGF0ZSh0aGlzLmNpdHkucXVldWVBaXJwbGFuZVt4XS5yZWFkeSkudG9Mb2NhbGVEYXRlU3RyaW5nKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICBodG1sICs9IFwiPC90cj5cIjtcbiAgICAgICAgfVxuICAgICAgICB0YWIuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB9XG4gICAgdXBkYXRlU2NvcmUoKSB7XG4gICAgICAgIHZhciBuZWVkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgbmVlZHMucHVzaCgwKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2l0eS5jb21wYW5pZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3RoaXMuY2l0eS5jb21wYW5pZXNbaV0ucHJvZHVjdGlkXTtcbiAgICAgICAgICAgIGlmICh0ZXN0LmlucHV0MSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbmVlZHNbdGVzdC5pbnB1dDFdICs9IChNYXRoLnJvdW5kKHRoaXMuY2l0eS5jb21wYW5pZXNbaV0ud29ya2VycyAqIHRlc3QuaW5wdXQxQW1vdW50IC8gcGFyYW1ldGVyLndvcmtlckluQ29tcGFueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRlc3QuaW5wdXQyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBuZWVkc1t0ZXN0LmlucHV0Ml0gKz0gKE1hdGgucm91bmQodGhpcy5jaXR5LmNvbXBhbmllc1tpXS53b3JrZXJzICogdGVzdC5pbnB1dDJBbW91bnQgLyBwYXJhbWV0ZXIud29ya2VySW5Db21wYW55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9zY29yZVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNjb3JlLXRhYmxlXCIpO1xuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xuICAgICAgICAgICAgdmFyIHByb2QgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHByb2R1Y3QgPSBwYXJhbWV0ZXIuYWxsUHJvZHVjdHNbeF07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2l0eS5jb21wYW5pZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaXR5LmNvbXBhbmllc1tpXS5wcm9kdWN0aWQgPT09IHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZCA9IE1hdGgucm91bmQodGhpcy5jaXR5LmNvbXBhbmllc1tpXS53b3JrZXJzICogcHJvZHVjdC5kYWlseVByb2R1Y2UgLyBwYXJhbWV0ZXIud29ya2VySW5Db21wYW55KS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bMl0uaW5uZXJIVE1MID0gcHJvZDtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzNdLmlubmVySFRNTCA9IG5lZWRzW3hdID09PSAwID8gXCJcIiA6IG5lZWRzW3hdO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bNF0uaW5uZXJIVE1MID0gdGhpcy5jaXR5LnNjb3JlW3hdICsgXCI8L3RkPlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZShmb3JjZSA9IGZhbHNlKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNpdHkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoISQodGhpcy5kb20pLmRpYWxvZygnaXNPcGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5jaXR5Lmhhc0FpcnBvcnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMudXBkYXRlVGl0bGUoKTtcbiAgICAgICAgLy9wYXVzZSBnYW1lIHdoaWxlIHRyYWRpbmdcbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaXR5LndvcmxkLmdhbWUuaXNQYXVzZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1BhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eS53b3JsZC5nYW1lLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjsvLy9ubyB1cGRhdGUgYmVjYXVzZSBvZiBzbGlkZXJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzUGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eS53b3JsZC5nYW1lLnJlc3VtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBDaXR5RGlhbG9nTWFya2V0LmdldEluc3RhbmNlKCkudXBkYXRlKCk7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIikpXG4gICAgICAgICAgICBDaXR5RGlhbG9nTWFya2V0LmdldEluc3RhbmNlKCkudXBkYXRlKCk7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctYnVpbGRpbmdzLXRhYlwiKT8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0Py5jb250YWlucyhcInVpLXRhYnMtYWN0aXZlXCIpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVCdWlsZGluZ3MoKTtcbiAgICAgICAgaWYgKGZvcmNlIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1zaG9wLXRhYlwiKT8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0Py5jb250YWlucyhcInVpLXRhYnMtYWN0aXZlXCIpKVxuICAgICAgICAgICAgQ2l0eURpYWxvZ1Nob3AuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb24tdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIikpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnN0cnVjdGlvbigpO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNjb3JlLXRhYlwiKT8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0Py5jb250YWlucyhcInVpLXRhYnMtYWN0aXZlXCIpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlVGl0bGUoKSB7XG4gICAgICAgIHZhciBzaWNvbiA9ICcnO1xuICAgICAgICBpZiAoJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJylbMF0uaW5uZXJIVE1MID0gJzxpbWcgc3R5bGU9XCJmbG9hdDogcmlnaHRcIiBpZD1cImNpdHlkaWFsb2ctaWNvblwiIHNyYz1cIicgKyB0aGlzLmNpdHkuaWNvbiArXG4gICAgICAgICAgICAgICAgJ1wiICBoZWlnaHQ9XCIxNVwiPjwvaW1nPiAnICsgdGhpcy5jaXR5Lm5hbWUgKyBcIiBcIiArIHRoaXMuY2l0eS5wZW9wbGUgKyBcIiBcIiArIEljb25zLnBlb3BsZTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKHtcbiAgICAgICAgICAgIHdpZHRoOiBcIjQwMHB4XCIsXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICAvLyBwb3NpdGlvbjogeyBteTogXCJsZWZ0IHRvcFwiLCBhdDogXCJyaWdodCB0b3BcIiwgb2Y6ICQoQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5kb20pIH0sXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoZXYsIGV2Mikge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5oYXNQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2l0eS53b3JsZC5nYW1lLnJlc3VtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLmRpYWxvZyhcIndpZGdldFwiKS5maW5kKFwiLnVpLWRpYWxvZy10aXRsZWJhci1jbG9zZVwiKVswXS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmRpYWxvZyhcIndpZGdldFwiKS5kcmFnZ2FibGUoXCJvcHRpb25cIiwgXCJjb250YWlubWVudFwiLCBcIm5vbmVcIik7XG4gICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmNzcyh7IHBvc2l0aW9uOiBcImZpeGVkXCIgfSk7XG5cbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgIH1cbn1cbiJdfQ==