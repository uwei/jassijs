define(["require", "exports", "game/city", "game/product", "game/icons", "game/airplane", "game/company", "game/citydialogmarket"], function (require, exports, city_1, product_1, icons_1, airplane_1, company_1, citydialogmarket_1) {
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
            var products = product_1.allProducts;
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
                    <li><a href="#citydialog-warehouse" id="citydialog-warehouse-tab"  class="citydialog-tabs">` + icons_1.Icons.warehouse + ` Warehouse</a></li>
                    <li><a href="#citydialog-construction" id="citydialog-construction-tab" class="citydialog-tabs">Construction</a></li>
                    <li><a href="#citydialog-score" id="citydialog-score-tab"  class="citydialog-tabs">Score</a></li>
                </ul>
                <div id="citydialog-market">` + citydialogmarket_1.CityDialogMarket.getInstance().create() + `
                </div>
                <div id="citydialog-buildings"> ` + this.createBuildings() + `
                </div>
                <div id="citydialog-warehouse">` + this.createWarehouse() + `
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
                    ret = ret + '<td><button id="new-factory_' + x + '">' + "+" + icons_1.Icons.factory + '</button>' +
                        '<button id="delete-factory_' + x + '">' + "-" + icons_1.Icons.factory + '</button>' +
                        '<button id="buy-license_' + x + '">' + "buy license to produce for 50.000" + icons_1.Icons.money + '</button>' +
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
                       ` + icons_1.Icons.home + ` houses: <span id="houses">0/0</span>  
                        ` + icons_1.Icons.people + ` renter: <span id="renter">0/0</span>  
                        <button id="buy-house">+` + icons_1.Icons.home + ` for 25.000` + icons_1.Icons.money + " 40x" + product_1.allProducts[0].getIcon() +
                " 80x" + product_1.allProducts[1].getIcon() + `</button> 
                        <button id="delete-house">-` + icons_1.Icons.home + `</button>
                        <br/>
                        <b>Warehouse</b>
                    <br/>
                       ` + icons_1.Icons.warehouse + ` houses: <span id="count-warehouses">0/0</span>  
                        ` + ` costs: <span id="costs-warehouses">0</span> ` + icons_1.Icons.money + `  
                        <button id="buy-warehouse">+` + icons_1.Icons.home + ` for 15.000` + icons_1.Icons.money + " 20x" + product_1.allProducts[0].getIcon() +
                " 40x" + product_1.allProducts[1].getIcon() + `</button> 
                        <button id="delete-warehouse">-` + icons_1.Icons.home + `</button>`;
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
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + product_1.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + product_1.allProducts[x].name + "</td>";
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
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + product_1.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + product_1.allProducts[x].name + "</td>";
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
                for (var x = 0; x < airplane_1.allAirplaneTypes.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + airplane_1.allAirplaneTypes[x].model + "</td>";
                    ret = ret + "<td>" + airplane_1.allAirplaneTypes[x].speed + "</td>";
                    ret = ret + "<td>" + airplane_1.allAirplaneTypes[x].capacity + "</td>";
                    ret = ret + "<td>" + airplane_1.allAirplaneTypes[x].costs + "</td>";
                    ret = ret + "<td>" + airplane_1.allAirplaneTypes[x].buildDays + "</td>";
                    ret = ret + "<td>" + '<button id="new-airplane_' + x + '">' + "+" + icons_1.Icons.airplane + " " +
                        city_1.City.getBuildingCostsAsIcon(airplane_1.allAirplaneTypes[x].buildingCosts, airplane_1.allAirplaneTypes[x].buildingMaterial) + "</button></td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}  
                </table> `;
        }
        bindActions() {
            var _this = this;
            document.getElementById("citydialog-next").addEventListener("click", (ev) => {
                var pos = _this.city.world.cities.indexOf(_this.city);
                pos++;
                if (pos >= _this.city.world.cities.length - 1)
                    pos = 0;
                _this.city = _this.city.world.cities[pos];
                _this.update(true);
            });
            document.getElementById("citydialog-prev").addEventListener("click", (ev) => {
                var pos = _this.city.world.cities.indexOf(_this.city);
                pos--;
                if (pos === -1)
                    pos = _this.city.world.cities.length - 2;
                _this.city = _this.city.world.cities[pos];
                _this.update(true);
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
                    comp.buildings++;
                    _this.update();
                });
                document.getElementById("delete-factory_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = Number(sid.split("_")[1]);
                    var comp = _this.city.companies[id];
                    if (comp.buildings > 0)
                        comp.buildings--;
                    var unempl = this.city.companies[id].workers - (this.city.companies[id].buildings * company_1.Company.workerInCompany);
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
            document.getElementById("buy-house").addEventListener("click", (evt) => {
                if (!this.city.commitBuildingCosts(15000, [20, 40], "buy building"))
                    reutrn;
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
                if (!_this.city.commitBuildingCosts(25000, [40, 80], "buy building"))
                    return;
                _this.city.warehouses++;
                _this.update();
            });
            document.getElementById("delete-warehouse").addEventListener("click", (evt) => {
                if (_this.city.warehouses === 0)
                    return;
                _this.city.warehouses--;
                _this.update();
            });
            for (var x = 0; x < airplane_1.allAirplaneTypes.length; x++) {
                document.getElementById("new-airplane_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = parseInt(sid.split("_")[1]);
                    _this.newAirplane(id);
                });
            }
            citydialogmarket_1.CityDialogMarket.getInstance().bindActions();
        }
        newAirplane(typeid) {
            var _this = this;
            if (!_this.city.commitBuildingCosts(airplane_1.allAirplaneTypes[typeid].buildingCosts, airplane_1.allAirplaneTypes[typeid].buildingMaterial, "buy airplane"))
                return;
            var maxNumber = 1;
            for (var x = 0; x < _this.city.world.airplanes.length; x++) {
                var test = _this.city.world.airplanes[x];
                var pos = test.name.indexOf(airplane_1.allAirplaneTypes[typeid].model);
                if (pos === 0) {
                    var nr = parseInt(test.name.substring(airplane_1.allAirplaneTypes[typeid].model.length));
                    if (nr !== NaN && nr > maxNumber)
                        maxNumber = nr;
                }
            }
            maxNumber++;
            var ap = new airplane_1.Airplane(_this.city.world);
            ap.speed = 200;
            ap.x = _this.city.x;
            ap.y = _this.city.y;
            ap.world = _this.city.world;
            ap.typeid = airplane_1.allAirplaneTypes[typeid].typeid;
            ap.name = airplane_1.allAirplaneTypes[typeid].model + maxNumber;
            ap.speed = airplane_1.allAirplaneTypes[typeid].speed;
            ap.costs = airplane_1.allAirplaneTypes[typeid].costs;
            ap.capacity = airplane_1.allAirplaneTypes[typeid].capacity;
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
            var all = product_1.allProducts;
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
                }
                else {
                    document.getElementById("buy-license_" + x).removeAttribute("hidden");
                }
                if (this.city.warehouses === 0) {
                    document.getElementById("no-warehouse_" + x).removeAttribute("hidden");
                }
                else {
                    document.getElementById("no-warehouse_" + x).setAttribute("hidden", "");
                }
                if (comp.hasLicense && this.city.warehouses > 0) {
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
                    //    this.city.world.game.getMoney() < comp.getBuildingCosts() || this.city.market[0] < mat[0] || this.city.market[1] < mat[1]) {
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
            document.getElementById("count-warehouses").innerHTML = "" + this.city.warehouses;
            document.getElementById("houses").innerHTML = "" + (this.city.houses + "/" + this.city.houses);
            document.getElementById("renter").innerHTML = "" + (this.city.people - city_1.City.neutralStartPeople + "/" + this.city.houses * 100);
            if (this.city.canBuild(25000, [40, 80]) !== "") {
                document.getElementById("buy-house").setAttribute("disabled", "");
            }
            else {
                document.getElementById("buy-house").removeAttribute("disabled");
            }
            if (this.city.canBuild(15000, [20, 40]) !== "") {
                document.getElementById("buy-warehouse").setAttribute("disabled", "");
            }
            else {
                document.getElementById("buy-warehouse").removeAttribute("disabled");
            }
            if (this.city.houses === 0) {
                document.getElementById("delete-house").setAttribute("disabled", "");
            }
            else {
                document.getElementById("delete-house").removeAttribute("disabled");
            }
        }
        updateWarehouse() {
            var needs = [];
            for (var x = 0; x < product_1.allProducts.length; x++) {
                needs.push(0);
            }
            for (var i = 0; i < this.city.companies.length; i++) {
                var test = product_1.allProducts[this.city.companies[i].productid];
                if (test.input1 !== undefined) {
                    needs[test.input1] += (Math.round(this.city.companies[i].workers * test.input1Amount / company_1.Company.workerInCompany));
                }
                if (test.input2 !== undefined) {
                    needs[test.input2] += (Math.round(this.city.companies[i].workers * test.input2Amount / company_1.Company.workerInCompany));
                }
            }
            for (var x = 0; x < product_1.allProducts.length; x++) {
                var table = document.getElementById("citydialog-warehouse-table");
                var tr = table.children[0].children[x + 1];
                tr.children[2].innerHTML = this.city.warehouse[x].toString();
                var prod = "";
                var product = product_1.allProducts[x];
                for (var i = 0; i < this.city.companies.length; i++) {
                    if (this.city.companies[i].productid === x) {
                        prod = Math.round(this.city.companies[i].workers * product.dailyProduce / company_1.Company.workerInCompany).toString();
                    }
                }
                tr.children[3].innerHTML = prod;
                tr.children[4].innerHTML = needs[x] === 0 ? "" : needs[x];
                if (document.activeElement !== tr.children[5].children[0])
                    tr.children[5].children[0].value = this.city.warehouseMinStock[x] === undefined ? "" : this.city.warehouseMinStock[x].toString();
                if (document.activeElement !== tr.children[6].children[0])
                    tr.children[6].children[0].value = this.city.warehouseSellingPrice[x] === undefined ? "" : this.city.warehouseSellingPrice[x].toString();
            }
            document.getElementById("citydialog-warehouse-count").innerHTML = "" + this.city.warehouses;
            // document.getElementById("costs-warehouses").innerHTML=""+(this.city.warehouses*50);
        }
        updateConstruction() {
            for (var x = 0; x < airplane_1.allAirplaneTypes.length; x++) {
                if (this.city.canBuild(airplane_1.allAirplaneTypes[x].buildingCosts, airplane_1.allAirplaneTypes[x].buildingMaterial) === "") {
                    document.getElementById("new-airplane_" + x).removeAttribute("disabled");
                }
                else {
                    document.getElementById("new-airplane_" + x).setAttribute("disabled", "");
                }
            }
        }
        updateScore() {
            //score
            for (var x = 0; x < product_1.allProducts.length; x++) {
                var table = document.getElementById("citydialog-score-table");
                var tr = table.children[0].children[x + 1];
                tr.children[2].innerHTML = this.city.score[x] + "</td>";
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
            if ((_m = (_l = (_k = document.getElementById("citydialog-warehouse-tab")) === null || _k === void 0 ? void 0 : _k.parentElement) === null || _l === void 0 ? void 0 : _l.classList) === null || _m === void 0 ? void 0 : _m.contains("ui-tabs-active"))
                this.updateWarehouse();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsWUFBWTtJQUNaLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDVixPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDekMsQ0FBQyxDQUFBO0lBRUQsTUFBYSxVQUFVO1FBS25CO1lBRkEsY0FBUyxHQUFHLEtBQUssQ0FBQztZQUdkLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDakMsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQzNDLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUMvQixDQUFDO1FBR08sTUFBTTtZQUNWLDZCQUE2QjtZQUM3QixJQUFJLElBQUksR0FBRzs7OztTQUlWLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNoRCxJQUFJLEdBQUcsRUFBRTtnQkFDTCxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQztZQUVELElBQUksUUFBUSxHQUFHLHFCQUFXLENBQUM7WUFDM0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDdEIsSUFBSSxJQUFJLEdBQUc7Ozs7Ozs7Ozs7Z0hBVTZGLEdBQUUsYUFBSyxDQUFDLFNBQVMs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LENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDbEM7Z0JBQ0wsQ0FBQzthQUNKLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRCxDQUFDO1FBQ0QsS0FBSztZQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FDSjtJQXJqQkQsZ0NBcWpCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XG5pbXBvcnQgeyBhbGxQcm9kdWN0cywgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcbmltcG9ydCB7IEFpcnBsYW5lLCBhbGxBaXJwbGFuZVR5cGVzIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcbmltcG9ydCB7IEFpcnBsYW5lRGlhbG9nIH0gZnJvbSBcImdhbWUvYWlycGxhbmVkaWFsb2dcIjtcbmltcG9ydCB7IENvbXBhbnkgfSBmcm9tIFwiZ2FtZS9jb21wYW55XCI7XG5pbXBvcnQgeyBDaXR5RGlhbG9nTWFya2V0IH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ21hcmtldFwiO1xuXG4vL0B0cy1pZ25vcmVcbndpbmRvdy5jaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbn1cblxuZXhwb3J0IGNsYXNzIENpdHlEaWFsb2cge1xuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XG4gICAgY2l0eTogQ2l0eTtcbiAgICBoYXNQYXVzZWQgPSBmYWxzZTtcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQ2l0eURpYWxvZyB7XG4gICAgICAgIGlmIChDaXR5RGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBDaXR5RGlhbG9nLmluc3RhbmNlID0gbmV3IENpdHlEaWFsb2coKTtcbiAgICAgICAgcmV0dXJuIENpdHlEaWFsb2cuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXG4gICAgICAgIHZhciBzZG9tID0gYFxuICAgICAgICAgIDxkaXYgaGlkZGVuIGlkPVwiY2l0eWRpYWxvZ1wiIGNsYXNzPVwiY2l0eWRpYWxvZ1wiPlxuICAgICAgICAgICAgPGRpdj48L2Rpdj5cbiAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHRoaXMuZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcbiAgICAgICAgdmFyIG9sZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZ1wiKTtcbiAgICAgICAgaWYgKG9sZCkge1xuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm9kdWN0cyA9IGFsbFByb2R1Y3RzO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY2l0eSA9IF90aGlzLmNpdHk7XG4gICAgICAgIHZhciBzZG9tID0gYFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImNpdHlkaWFsb2ctcHJldlwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjxcIi8+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJjaXR5ZGlhbG9nLW5leHRcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI+XCIvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctdGFic1wiPlxuICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1tYXJrZXRcIiBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXRhYlwiIGNsYXNzPVwiY2l0eWRpYWxvZy10YWJzXCI+TWFya2V0PC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2NpdHlkaWFsb2ctYnVpbGRpbmdzXCIgaWQ9XCJjaXR5ZGlhbG9nLWJ1aWxkaW5ncy10YWJcIiBjbGFzcz1cImNpdHlkaWFsb2ctdGFic1wiPkJ1aWxkaW5nczwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLXdhcmVob3VzZVwiIGlkPVwiY2l0eWRpYWxvZy13YXJlaG91c2UtdGFiXCIgIGNsYXNzPVwiY2l0eWRpYWxvZy10YWJzXCI+YCsgSWNvbnMud2FyZWhvdXNlICsgYCBXYXJlaG91c2U8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb25cIiBpZD1cImNpdHlkaWFsb2ctY29uc3RydWN0aW9uLXRhYlwiIGNsYXNzPVwiY2l0eWRpYWxvZy10YWJzXCI+Q29uc3RydWN0aW9uPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2NpdHlkaWFsb2ctc2NvcmVcIiBpZD1cImNpdHlkaWFsb2ctc2NvcmUtdGFiXCIgIGNsYXNzPVwiY2l0eWRpYWxvZy10YWJzXCI+U2NvcmU8L2E+PC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldFwiPmArIENpdHlEaWFsb2dNYXJrZXQuZ2V0SW5zdGFuY2UoKS5jcmVhdGUoKSArIGBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy1idWlsZGluZ3NcIj4gYCsgdGhpcy5jcmVhdGVCdWlsZGluZ3MoKSArIGBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy13YXJlaG91c2VcIj5gKyB0aGlzLmNyZWF0ZVdhcmVob3VzZSgpICsgYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvblwiPmArIHRoaXMuY3JlYXRlQ29uc3RydWN0aW9uKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctc2NvcmVcIj5gKyB0aGlzLmNyZWF0ZVNjb3JlKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XG4gICAgICAgICQoXCIjY2l0eWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuXG4gICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICQoXCIjY2l0eWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgX3RoaXMuYmluZEFjdGlvbnMoKTsgfSwgNTAwKTtcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB9XG4gIFxuICAgIGNyZWF0ZUJ1aWxkaW5ncygpIHtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLWJ1aWxkaW5ncy10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlByb2R1Y2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4gPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QnVpbGRpbmdzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+Sm9iczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5lZWRzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCA1OyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+PGJ1dHRvbiBpZD1cIm5ldy1mYWN0b3J5XycgKyB4ICsgJ1wiPicgKyBcIitcIiArIEljb25zLmZhY3RvcnkgKyAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiBpZD1cImRlbGV0ZS1mYWN0b3J5XycgKyB4ICsgJ1wiPicgKyBcIi1cIiArIEljb25zLmZhY3RvcnkgKyAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiBpZD1cImJ1eS1saWNlbnNlXycgKyB4ICsgJ1wiPicgKyBcImJ1eSBsaWNlbnNlIHRvIHByb2R1Y2UgZm9yIDUwLjAwMFwiICsgSWNvbnMubW9uZXkgKyAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cIm5vLXdhcmVob3VzZV8nICsgeCArICdcIj5uZWVkIGEgd2FyZWhvdXNlIHRvIHByb2R1Y2U8L2Rpdj4nICtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICAgICAgPGI+cmVzaWRlbnRpYWwgYnVpbGRpbmc8L2I+XG4gICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgIGArIEljb25zLmhvbWUgKyBgIGhvdXNlczogPHNwYW4gaWQ9XCJob3VzZXNcIj4wLzA8L3NwYW4+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGArIEljb25zLnBlb3BsZSArIGAgcmVudGVyOiA8c3BhbiBpZD1cInJlbnRlclwiPjAvMDwvc3Bhbj4gIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImJ1eS1ob3VzZVwiPitgKyBJY29ucy5ob21lICsgYCBmb3IgMjUuMDAwYCArIEljb25zLm1vbmV5ICsgXCIgNDB4XCIgKyBhbGxQcm9kdWN0c1swXS5nZXRJY29uKCkgK1xuICAgICAgICAgICAgXCIgODB4XCIgKyBhbGxQcm9kdWN0c1sxXS5nZXRJY29uKCkgKyBgPC9idXR0b24+IFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImRlbGV0ZS1ob3VzZVwiPi1gKyBJY29ucy5ob21lICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxiPldhcmVob3VzZTwvYj5cbiAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgYCsgSWNvbnMud2FyZWhvdXNlICsgYCBob3VzZXM6IDxzcGFuIGlkPVwiY291bnQtd2FyZWhvdXNlc1wiPjAvMDwvc3Bhbj4gIFxuICAgICAgICAgICAgICAgICAgICAgICAgYCArIGAgY29zdHM6IDxzcGFuIGlkPVwiY29zdHMtd2FyZWhvdXNlc1wiPjA8L3NwYW4+IGAgKyBJY29ucy5tb25leSArIGAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImJ1eS13YXJlaG91c2VcIj4rYCsgSWNvbnMuaG9tZSArIGAgZm9yIDE1LjAwMGAgKyBJY29ucy5tb25leSArIFwiIDIweFwiICsgYWxsUHJvZHVjdHNbMF0uZ2V0SWNvbigpICtcbiAgICAgICAgICAgIFwiIDQweFwiICsgYWxsUHJvZHVjdHNbMV0uZ2V0SWNvbigpICsgYDwvYnV0dG9uPiBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkZWxldGUtd2FyZWhvdXNlXCI+LWArIEljb25zLmhvbWUgKyBgPC9idXR0b24+YDtcbiAgICB9XG4gICAgY3JlYXRlV2FyZWhvdXNlKCkge1xuICAgICAgICByZXR1cm4gYDx0YWJsZSBpZD1cImNpdHlkaWFsb2ctd2FyZWhvdXNlLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlN0b2NrPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+UHJvZHVjZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5lZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5NaW4tU3RvY2s8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TZWxsaW5nIHByaWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5uYW1lICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD4wPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwid2FyZWhvdXNlLW1pbi1zdG9ja1wiIGlkPVwid2FyZWhvdXNlLW1pbi1zdG9ja18nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJ3YXJlaG91c2Utc2VsbGluZy1wcmljZVwiIGlkPVwid2FyZWhvdXNlLXNlbGxpbmctcHJpY2VfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICA8cD5udW1iZXIgb2Ygd2FyZWhvdXNlcyA8c3BhbiBpZD1cImNpdHlkaWFsb2ctd2FyZWhvdXNlLWNvdW50XCI+PHNwYW4+PC9wPmA7XG4gICAgfVxuICAgIGNyZWF0ZVNjb3JlKCkge1xuICAgICAgICByZXR1cm4gYDx0YWJsZSBpZD1cImNpdHlkaWFsb2ctc2NvcmUtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlNjb3JlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5uYW1lICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD4wPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5gO1xuICAgIH1cbiAgICBjcmVhdGVDb25zdHJ1Y3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBgPHRhYmxlIGlkPVwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb24tdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Nb2RlbDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlNwZWVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+Q2FwYWNpdHk8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5EYWlseSBDb3N0czwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJ1aWxkIGRheXM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5BY3Rpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbEFpcnBsYW5lVHlwZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsQWlycGxhbmVUeXBlc1t4XS5tb2RlbCArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxBaXJwbGFuZVR5cGVzW3hdLnNwZWVkICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbEFpcnBsYW5lVHlwZXNbeF0uY2FwYWNpdHkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsQWlycGxhbmVUeXBlc1t4XS5jb3N0cyArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkRGF5cyArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyAnPGJ1dHRvbiBpZD1cIm5ldy1haXJwbGFuZV8nICsgeCArICdcIj4nICsgXCIrXCIgKyBJY29ucy5haXJwbGFuZSArIFwiIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIENpdHkuZ2V0QnVpbGRpbmdDb3N0c0FzSWNvbihhbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkaW5nQ29zdHMsIGFsbEFpcnBsYW5lVHlwZXNbeF0uYnVpbGRpbmdNYXRlcmlhbCkgKyBcIjwvYnV0dG9uPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9ICBcbiAgICAgICAgICAgICAgICA8L3RhYmxlPiBgO1xuICAgIH1cbiAgIFxuICAgIGJpbmRBY3Rpb25zKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzLmluZGV4T2YoX3RoaXMuY2l0eSk7XG4gICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgIGlmIChwb3MgPj0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXMubGVuZ3RoLTEpXG4gICAgICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgICAgIF90aGlzLmNpdHkgPSBfdGhpcy5jaXR5LndvcmxkLmNpdGllc1twb3NdO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBwb3MgPSBfdGhpcy5jaXR5LndvcmxkLmNpdGllcy5pbmRleE9mKF90aGlzLmNpdHkpO1xuICAgICAgICAgICAgcG9zLS07XG4gICAgICAgICAgICBpZiAocG9zID09PSAtMSlcbiAgICAgICAgICAgICAgICBwb3MgPSBfdGhpcy5jaXR5LndvcmxkLmNpdGllcy5sZW5ndGggLSAyO1xuICAgICAgICAgICAgX3RoaXMuY2l0eSA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzW3Bvc107XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IDU7IHgrKykge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoc2lkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBfdGhpcy5jaXR5LmNvbXBhbmllc1tpZF07XG5cbiAgICAgICAgICAgICAgICBpZighX3RoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKGNvbXAuZ2V0QnVpbGRpbmdDb3N0cygpLCBjb21wLmdldEJ1aWxkaW5nTWF0ZXJpYWwoKSwgXCJidXkgYnVpbGRpbmdcIikpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjb21wLmJ1aWxkaW5ncysrO1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1mYWN0b3J5X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkuaWQ7XG4gICAgICAgICAgICAgICAgaWYgKHNpZCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkucGFyZW50Tm9kZS5pZFxuICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcihzaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgY29tcCA9IF90aGlzLmNpdHkuY29tcGFuaWVzW2lkXTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5idWlsZGluZ3MgPiAwKVxuICAgICAgICAgICAgICAgICAgICBjb21wLmJ1aWxkaW5ncy0tO1xuICAgICAgICAgICAgICAgIHZhciB1bmVtcGwgPSB0aGlzLmNpdHkuY29tcGFuaWVzW2lkXS53b3JrZXJzIC0gKHRoaXMuY2l0eS5jb21wYW5pZXNbaWRdLmJ1aWxkaW5ncyAqIENvbXBhbnkud29ya2VySW5Db21wYW55KTtcbiAgICAgICAgICAgICAgICBpZiAodW5lbXBsID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNpdHkuY29tcGFuaWVzW2lkXS53b3JrZXJzIC09IHVuZW1wbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5LnRyYW5zZmVyV29ya2VyKHVuZW1wbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkuaWQ7XG4gICAgICAgICAgICAgICAgaWYgKHNpZCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkucGFyZW50Tm9kZS5pZFxuICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcihzaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgY29tcCA9IF90aGlzLmNpdHkuY29tcGFuaWVzW2lkXTtcbiAgICAgICAgICAgICAgICBpZighX3RoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKDUwMDAwLCBbXSwgXCJidXkgbGljZW5jZVwiKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNvbXAuaGFzTGljZW5zZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWhvdXNlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBpZighdGhpcy5jaXR5LmNvbW1pdEJ1aWxkaW5nQ29zdHMoMTUwMDAsIFsyMCwgNDBdLCBcImJ1eSBidWlsZGluZ1wiKSlcbiAgICAgICAgICAgICAgICByZXV0cm47XG4gICAgICAgICAgICBfdGhpcy5jaXR5LmhvdXNlcysrO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1ob3VzZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgaWYgKF90aGlzLmNpdHkuaG91c2VzID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIF90aGlzLmNpdHkuaG91c2VzLS07XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIC8qaWYgKChfdGhpcy5jaXR5LnBlb3BsZSAtIDEwMDApID4gX3RoaXMuY2l0eS5ob3VzZXMgKiAxMDApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LnBlb3BsZSA9IDEwMDAgKyBfdGhpcy5jaXR5LmhvdXNlcyAqIDEwMDtcbiAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZW1vdmUgd29ya2VyXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktd2FyZWhvdXNlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBpZighX3RoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKDI1MDAwLCBbNDAsIDgwXSwgXCJidXkgYnVpbGRpbmdcIikpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgX3RoaXMuY2l0eS53YXJlaG91c2VzKys7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLXdhcmVob3VzZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgaWYgKF90aGlzLmNpdHkud2FyZWhvdXNlcyA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBfdGhpcy5jaXR5LndhcmVob3VzZXMtLTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIH0pO1xuICAgICAgIFxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbEFpcnBsYW5lVHlwZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWFpcnBsYW5lX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkuaWQ7XG4gICAgICAgICAgICAgICAgaWYgKHNpZCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkucGFyZW50Tm9kZS5pZFxuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KHNpZC5zcGxpdChcIl9cIilbMV0pOyBcbiAgICAgICAgICAgICAgICBfdGhpcy5uZXdBaXJwbGFuZShpZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIENpdHlEaWFsb2dNYXJrZXQuZ2V0SW5zdGFuY2UoKS5iaW5kQWN0aW9ucygpO1xuICAgIH1cbiAgICBuZXdBaXJwbGFuZSh0eXBlaWQ6IG51bWJlcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZighX3RoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS5idWlsZGluZ0Nvc3RzLCBhbGxBaXJwbGFuZVR5cGVzW3R5cGVpZF0uYnVpbGRpbmdNYXRlcmlhbCwgXCJidXkgYWlycGxhbmVcIikpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBtYXhOdW1iZXIgPSAxO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IF90aGlzLmNpdHkud29ybGQuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgdGVzdCA9IF90aGlzLmNpdHkud29ybGQuYWlycGxhbmVzW3hdO1xuICAgICAgICAgICAgdmFyIHBvcyA9IHRlc3QubmFtZS5pbmRleE9mKGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS5tb2RlbCk7XG4gICAgICAgICAgICBpZiAocG9zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5yID0gcGFyc2VJbnQodGVzdC5uYW1lLnN1YnN0cmluZyhhbGxBaXJwbGFuZVR5cGVzW3R5cGVpZF0ubW9kZWwubGVuZ3RoKSk7XG4gICAgICAgICAgICAgICAgaWYgKG5yICE9PSBOYU4gJiYgbnIgPiBtYXhOdW1iZXIpXG4gICAgICAgICAgICAgICAgICAgIG1heE51bWJlciA9IG5yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG1heE51bWJlcisrO1xuICAgICAgICB2YXIgYXAgPSBuZXcgQWlycGxhbmUoX3RoaXMuY2l0eS53b3JsZCk7XG4gICAgICAgIGFwLnNwZWVkID0gMjAwO1xuICAgICAgICBhcC54ID0gX3RoaXMuY2l0eS54O1xuICAgICAgICBhcC55ID0gX3RoaXMuY2l0eS55O1xuICAgICAgICBhcC53b3JsZCA9IF90aGlzLmNpdHkud29ybGQ7XG4gICAgICAgIGFwLnR5cGVpZCA9IGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS50eXBlaWQ7XG4gICAgICAgIGFwLm5hbWUgPSBhbGxBaXJwbGFuZVR5cGVzW3R5cGVpZF0ubW9kZWwgKyBtYXhOdW1iZXI7XG4gICAgICAgIGFwLnNwZWVkID0gYWxsQWlycGxhbmVUeXBlc1t0eXBlaWRdLnNwZWVkO1xuICAgICAgICBhcC5jb3N0cyA9IGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS5jb3N0cztcbiAgICAgICAgYXAuY2FwYWNpdHkgPSBhbGxBaXJwbGFuZVR5cGVzW3R5cGVpZF0uY2FwYWNpdHk7XG4gICAgICAgIF90aGlzLmNpdHkud29ybGQuYWlycGxhbmVzLnB1c2goYXApO1xuICAgICAgICBhcC5yZW5kZXIoKTtcbiAgICAgICAgX3RoaXMuY2l0eS53b3JsZC5kb20uYXBwZW5kQ2hpbGQoYXAuZG9tKTtcbiAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgIH1cbiAgICBcbiAgIFxuICAgIHVwZGF0ZUJ1aWxkaW5ncygpIHtcbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+cHJvZHVjZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4gPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmJ1aWxkaW5nczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5qb2JzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPm5lZWRzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5jb3N0cyBuZXcgYnVpbGRpbmc8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+YWN0aW9uczwvdGg+XG4gICAgICAgICAgICAgICAqL1xuICAgICAgICB2YXIgY29tcGFuaWVzID0gdGhpcy5jaXR5LmNvbXBhbmllcztcbiAgICAgICAgdmFyIGFsbCA9IGFsbFByb2R1Y3RzO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNvbXBhbmllcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSBjb21wYW5pZXNbeF07XG4gICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctYnVpbGRpbmdzLXRhYmxlXCIpO1xuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xuICAgICAgICAgICAgdmFyIHByb2R1Y3QgPSBhbGxbY29tcC5wcm9kdWN0aWRdO1xuICAgICAgICAgICAgdmFyIHByb2R1Y2UgPSBjb21wLmdldERhaWx5UHJvZHVjZSgpO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gcHJvZHVjZSArIFwiIFwiICsgcHJvZHVjdC5nZXRJY29uKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblsxXS5pbm5lckhUTUwgPSBwcm9kdWN0Lm5hbWU7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblsyXS5pbm5lckhUTUwgPSBjb21wLmJ1aWxkaW5ncy50b1N0cmluZygpO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bM10uaW5uZXJIVE1MID0gY29tcC53b3JrZXJzICsgXCIvXCIgKyBjb21wLmdldE1heFdvcmtlcnMoKTtcbiAgICAgICAgICAgIHZhciBuZWVkczEgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIG5lZWRzMiA9IFwiXCI7XG4gICAgICAgICAgICBpZiAocHJvZHVjdC5pbnB1dDEgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBuZWVkczEgPSBcIlwiICsgY29tcC5nZXREYWlseUlucHV0MSgpICsgYWxsW3Byb2R1Y3QuaW5wdXQxXS5nZXRJY29uKCkgKyBcIiBcIjtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzRdLmlubmVySFRNTCA9IG5lZWRzMTtcbiAgICAgICAgICAgIGlmIChwcm9kdWN0LmlucHV0MiAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIG5lZWRzMiA9IFwiPGJyLz5cIiArIGNvbXAuZ2V0RGFpbHlJbnB1dDIoKSArIGFsbFtwcm9kdWN0LmlucHV0Ml0uZ2V0SWNvbigpO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bNF0uaW5uZXJIVE1MID0gbmVlZHMxICsgXCIgXCIgKyBuZWVkczI7XG4gICAgICAgICAgICAvLyB0ci5jaGlsZHJlbls1XS5pbm5lckhUTUwgPSBDaXR5LmdldEJ1aWxkaW5nQ29zdHNBc0ljb24oY29tcC5nZXRCdWlsZGluZ0Nvc3RzKCksIGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpLCB0cnVlKTtcblxuICAgICAgICAgICAgaWYgKGNvbXAuaGFzTGljZW5zZSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaXR5LndhcmVob3VzZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vLXdhcmVob3VzZV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby13YXJlaG91c2VfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb21wLmhhc0xpY2Vuc2UgJiYgdGhpcy5jaXR5LndhcmVob3VzZXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLmlubmVySFRNTCA9IFwiK1wiICsgSWNvbnMuZmFjdG9yeSArXG4gICAgICAgICAgICAgICAgICAgIENpdHkuZ2V0QnVpbGRpbmdDb3N0c0FzSWNvbihjb21wLmdldEJ1aWxkaW5nQ29zdHMoKSwgY29tcC5nZXRCdWlsZGluZ01hdGVyaWFsKCkpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtZmFjdG9yeV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1mYWN0b3J5X1wiICsgeCkuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1hdCA9IGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5jYW5CdWlsZChjb21wLmdldEJ1aWxkaW5nQ29zdHMoKSwgY29tcC5nZXRCdWlsZGluZ01hdGVyaWFsKCkpICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLmNpdHkud29ybGQuZ2FtZS5nZXRNb25leSgpIDwgY29tcC5nZXRCdWlsZGluZ0Nvc3RzKCkgfHwgdGhpcy5jaXR5Lm1hcmtldFswXSA8IG1hdFswXSB8fCB0aGlzLmNpdHkubWFya2V0WzFdIDwgbWF0WzFdKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIm5vdCBhbGwgYnVpbGRpbmcgY29zdHMgYXJlIGF2YWlsYWJsZVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJ0aXRsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNpdHkuY2FuQnVpbGQoNTAwMDAsIFtdKSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktbGljZW5zZV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb3VudC13YXJlaG91c2VzXCIpLmlubmVySFRNTCA9IFwiXCIgKyB0aGlzLmNpdHkud2FyZWhvdXNlcztcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvdXNlc1wiKS5pbm5lckhUTUwgPSBcIlwiICsgKHRoaXMuY2l0eS5ob3VzZXMgKyBcIi9cIiArIHRoaXMuY2l0eS5ob3VzZXMpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlbnRlclwiKS5pbm5lckhUTUwgPSBcIlwiICsgKHRoaXMuY2l0eS5wZW9wbGUgLSBDaXR5Lm5ldXRyYWxTdGFydFBlb3BsZSArIFwiL1wiICsgdGhpcy5jaXR5LmhvdXNlcyAqIDEwMCk7XG4gICAgICAgIGlmICh0aGlzLmNpdHkuY2FuQnVpbGQoMjUwMDAsIFs0MCwgODBdKSAhPT0gXCJcIikge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktaG91c2VcIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1ob3VzZVwiKS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaXR5LmNhbkJ1aWxkKDE1MDAwLCBbMjAsIDQwXSkgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LXdhcmVob3VzZVwiKS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LXdhcmVob3VzZVwiKS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNpdHkuaG91c2VzID09PSAwKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1ob3VzZVwiKS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWhvdXNlXCIpLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICB9XG5cblxuICAgIH1cbiAgICB1cGRhdGVXYXJlaG91c2UoKSB7XG4gICAgICAgIHZhciBuZWVkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBuZWVkcy5wdXNoKDApO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaXR5LmNvbXBhbmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRlc3QgPSBhbGxQcm9kdWN0c1t0aGlzLmNpdHkuY29tcGFuaWVzW2ldLnByb2R1Y3RpZF07XG4gICAgICAgICAgICBpZiAodGVzdC5pbnB1dDEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5lZWRzW3Rlc3QuaW5wdXQxXSArPSAoTWF0aC5yb3VuZCh0aGlzLmNpdHkuY29tcGFuaWVzW2ldLndvcmtlcnMgKiB0ZXN0LmlucHV0MUFtb3VudCAvIENvbXBhbnkud29ya2VySW5Db21wYW55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGVzdC5pbnB1dDIgIT09dW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbmVlZHNbdGVzdC5pbnB1dDJdICs9IChNYXRoLnJvdW5kKHRoaXMuY2l0eS5jb21wYW5pZXNbaV0ud29ya2VycyAqIHRlc3QuaW5wdXQyQW1vdW50IC8gQ29tcGFueS53b3JrZXJJbkNvbXBhbnkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctd2FyZWhvdXNlLXRhYmxlXCIpO1xuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xuXG4gICAgICAgICAgICB0ci5jaGlsZHJlblsyXS5pbm5lckhUTUwgPSB0aGlzLmNpdHkud2FyZWhvdXNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB2YXIgcHJvZCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgcHJvZHVjdCA9IGFsbFByb2R1Y3RzW3hdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNpdHkuY29tcGFuaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5jb21wYW5pZXNbaV0ucHJvZHVjdGlkID09PSB4KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2QgPSBNYXRoLnJvdW5kKHRoaXMuY2l0eS5jb21wYW5pZXNbaV0ud29ya2VycyAqIHByb2R1Y3QuZGFpbHlQcm9kdWNlIC8gQ29tcGFueS53b3JrZXJJbkNvbXBhbnkpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bM10uaW5uZXJIVE1MID0gcHJvZDtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzRdLmlubmVySFRNTCA9IG5lZWRzW3hdID09PSAwID8gXCJcIiA6IG5lZWRzW3hdO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRyLmNoaWxkcmVuWzVdLmNoaWxkcmVuWzBdKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls1XS5jaGlsZHJlblswXSkudmFsdWUgPSB0aGlzLmNpdHkud2FyZWhvdXNlTWluU3RvY2tbeF0gPT09IHVuZGVmaW5lZCA/IFwiXCIgOiB0aGlzLmNpdHkud2FyZWhvdXNlTWluU3RvY2tbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0ci5jaGlsZHJlbls2XS5jaGlsZHJlblswXSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLnZhbHVlID0gdGhpcy5jaXR5LndhcmVob3VzZVNlbGxpbmdQcmljZVt4XSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHRoaXMuY2l0eS53YXJlaG91c2VTZWxsaW5nUHJpY2VbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy13YXJlaG91c2UtY291bnRcIikuaW5uZXJIVE1MID0gXCJcIiArIHRoaXMuY2l0eS53YXJlaG91c2VzO1xuXG4gICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29zdHMtd2FyZWhvdXNlc1wiKS5pbm5lckhUTUw9XCJcIisodGhpcy5jaXR5LndhcmVob3VzZXMqNTApO1xuICAgIH1cbiAgICB1cGRhdGVDb25zdHJ1Y3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsQWlycGxhbmVUeXBlcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5jYW5CdWlsZChhbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkaW5nQ29zdHMsIGFsbEFpcnBsYW5lVHlwZXNbeF0uYnVpbGRpbmdNYXRlcmlhbCkgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1haXJwbGFuZV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1haXJwbGFuZV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlU2NvcmUoKSB7XG5cbiAgICAgICAgLy9zY29yZVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctc2NvcmUtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG4gICAgICAgICAgICB0ci5jaGlsZHJlblsyXS5pbm5lckhUTUwgPSB0aGlzLmNpdHkuc2NvcmVbeF0gKyBcIjwvdGQ+XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlKGZvcmNlID0gZmFsc2UpIHtcblxuICAgICAgICBpZiAoIXRoaXMuY2l0eSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghJCh0aGlzLmRvbSkuZGlhbG9nKCdpc09wZW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoIXRoaXMuY2l0eS5oYXNBaXJwb3J0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XG4gICAgICAgIC8vcGF1c2UgZ2FtZSB3aGlsZSB0cmFkaW5nXG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYlwiKT8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0Py5jb250YWlucyhcInVpLXRhYnMtYWN0aXZlXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNpdHkud29ybGQuZ2FtZS5pc1BhdXNlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5LndvcmxkLmdhbWUucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuOy8vL25vIHVwZGF0ZSBiZWNhdXNlIG9mIHNsaWRlclxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5LndvcmxkLmdhbWUucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIENpdHlEaWFsb2dNYXJrZXQuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcblxuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKSlcbiAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIikpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1aWxkaW5ncygpO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXdhcmVob3VzZS10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKSlcbiAgICAgICAgICAgIHRoaXMudXBkYXRlV2FyZWhvdXNlKCk7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctY29uc3RydWN0aW9uLXRhYlwiKT8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0Py5jb250YWlucyhcInVpLXRhYnMtYWN0aXZlXCIpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVDb25zdHJ1Y3Rpb24oKTtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1zY29yZS10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKSlcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHVwZGF0ZVRpdGxlKCkge1xuICAgICAgICB2YXIgc2ljb24gPSAnJztcbiAgICAgICAgaWYgKCQodGhpcy5kb20pLnBhcmVudCgpLmZpbmQoJy51aS1kaWFsb2ctdGl0bGUnKS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpWzBdLmlubmVySFRNTCA9ICc8aW1nIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0XCIgaWQ9XCJjaXR5ZGlhbG9nLWljb25cIiBzcmM9XCInICsgdGhpcy5jaXR5Lmljb24gK1xuICAgICAgICAgICAgICAgICdcIiAgaGVpZ2h0PVwiMTVcIj48L2ltZz4gJyArIHRoaXMuY2l0eS5uYW1lICsgXCIgXCIgKyB0aGlzLmNpdHkucGVvcGxlICsgXCIgXCIgKyBJY29ucy5wZW9wbGU7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XG4gICAgICAgICAgICB3aWR0aDogXCI0MDBweFwiLFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgLy8gcG9zaXRpb246IHsgbXk6IFwibGVmdCB0b3BcIiwgYXQ6IFwicmlnaHQgdG9wXCIsIG9mOiAkKEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuZG9tKSB9LFxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKGV2LCBldjIpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuaGFzUGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNpdHkud29ybGQuZ2FtZS5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmRpYWxvZyhcIndpZGdldFwiKS5kcmFnZ2FibGUoXCJvcHRpb25cIiwgXCJjb250YWlubWVudFwiLCBcIm5vbmVcIik7XG4gICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmNzcyh7IHBvc2l0aW9uOiBcImZpeGVkXCIgfSk7XG5cbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgIH1cbn1cbiJdfQ==