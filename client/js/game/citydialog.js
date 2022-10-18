define(["require", "exports", "game/city", "game/product", "game/icons", "game/airplane", "game/company"], function (require, exports, city_1, product_1, icons_1, airplane_1, company_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CityDialog = void 0;
    //@ts-ignore
    window.city = function () {
        return CityDialog.getInstance().city;
    };
    var log = (function () {
        var log = Math.log;
        return function (n, base) {
            return log(n) / (base ? log(base) : 1);
        };
    })();
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
        calcPrice(el, val) {
            var id = Number(el.id.split("_")[1]);
            var isProducedHere = false;
            for (var x = 0; x < this.city.companies.length; x++) {
                if (this.city.companies[x].productid === id)
                    isProducedHere = true;
            }
            var prod = product_1.allProducts[id].priceSelling;
            if (el.id.indexOf("sell") > -1)
                val = -val;
            var ret = product_1.allProducts[id].calcPrice(this.city.people, this.city.market[id] - val, isProducedHere);
            var color = "green";
            if (ret > ((0.0 + prod) * 2 / 3))
                color = "LightGreen";
            if (ret > ((0.0 + prod) * 2.5 / 3))
                color = "white";
            if (ret > ((0.0 + prod) * 1))
                color = "LightPink";
            if (ret > ((0.0 + prod) * 4 / 3))
                color = "red";
            el.parentElement.parentElement.children[3].style.background = color;
            return ret;
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
                <div id="citydialog-market">` + this.createMarket() + `
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
        createMarket() {
            return ` <table id="citydialog-market-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Name</th>
                            <th></th>
                            <th>
                                <select id="citydialog-market-table-source" style="width:55px">
                                    <option value="Market">Market</option>
                                </select>
                            </th>
                            <th>Price</th>
                            <th>Buy</th>
                            <th> <select id="citydialog-market-table-target" style="width:50px">
                                    <option value="placeholder">placeholder</option>
                                </select>
                            </th>
                            <th>Sell</th>
                            
                        </tr>
                       ${(function fun() {
                var ret = "";
                function price(id, change) {
                    console.log(id + " " + change);
                }
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + product_1.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + product_1.allProducts[x].name + "</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + '<td>' +
                        '<input class="cdmslider" id="citydialog-market-buy-slider_' + x + '"' +
                        'type="range" min="0" max="10" step="1.0" value="0"' +
                        'style="overflow: hidden;width: 50%;height: 70%;"' +
                        //'oninput="this.nextElementSibling.innerHTML = this.value;' +
                        //'this.parentNode.parentNode.children[3].innerHTML=1;' +
                        '">' + "<span>0</span></td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + '<td>' +
                        '<input class="cdmslider" id="citydialog-market-sell-slider_' + x + '"' +
                        'type="range" min="0" max="500" step="1.0" value="0"' +
                        'style="overflow: hidden;width: 50%;height: 70%;"' +
                        //'oninput="this.nextElementSibling.innerHTML = this.value;' +
                        // 'this.parentNode.parentNode.children[3].innerHTML=value;' +
                        '">' + "<span>0</span></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>`;
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
        getSliderValue(dom) {
            var maxValue = parseInt(dom.getAttribute("maxValue"));
            var val = parseInt(dom.value);
            if (val === 0)
                return 0;
            var exp = Math.round(log(maxValue, 40) * 1000) / 1000;
            return Math.round(Math.pow(val, exp));
        }
        bindActions() {
            var _this = this;
            document.getElementById("citydialog-next").addEventListener("click", (ev) => {
                var pos = _this.city.world.cities.indexOf(_this.city);
                pos++;
                if (pos >= _this.city.world.cities.length)
                    pos = 0;
                _this.city = _this.city.world.cities[pos];
                _this.update(true);
            });
            document.getElementById("citydialog-prev").addEventListener("click", (ev) => {
                var pos = _this.city.world.cities.indexOf(_this.city);
                pos--;
                if (pos === -1)
                    pos = _this.city.world.cities.length - 1;
                _this.city = _this.city.world.cities[pos];
                _this.update(true);
            });
            $('.citydialog-tabs').click(function (event) {
                _this.update(true);
            });
            for (var x = 0; x < product_1.allProducts.length; x++) {
                document.getElementById("citydialog-market-buy-slider_" + x).addEventListener("input", (e) => {
                    var t = e.target;
                    var val = _this.getSliderValue(t);
                    var price = _this.calcPrice(t, val);
                    t.nextElementSibling.innerHTML = "" + val + " " + val * price;
                    t.parentNode.parentNode.children[3].innerHTML = "" + price;
                });
                document.getElementById("citydialog-market-sell-slider_" + x).addEventListener("input", (e) => {
                    var t = e.target;
                    var val = _this.getSliderValue(t);
                    var price = _this.calcPrice(t, val);
                    t.nextElementSibling.innerHTML = "" + val + " " + val * price;
                    t.parentNode.parentNode.children[3].innerHTML = "" + price;
                });
                var inedit = false;
                document.getElementById("citydialog-market-buy-slider_" + x).addEventListener("change", (e) => {
                    if (inedit)
                        return;
                    var t = e.target;
                    inedit = true;
                    var id = Number(t.id.split("_")[1]);
                    var selectsource = document.getElementById("citydialog-market-table-source");
                    var val = _this.getSliderValue(t);
                    _this.sellOrBuy(id, val, _this.calcPrice(t, val), _this.getStore(), selectsource.value === "Warehouse");
                    t.nextElementSibling.innerHTML = "0";
                    t.value = "0";
                    inedit = false;
                });
                document.getElementById("citydialog-market-sell-slider_" + x).addEventListener("change", (e) => {
                    if (inedit)
                        return;
                    var t = e.target;
                    inedit = true;
                    var val = _this.getSliderValue(t);
                    var id = Number(t.id.split("_")[1]);
                    var selectsource = document.getElementById("citydialog-market-table-source");
                    _this.sellOrBuy(id, -val, _this.calcPrice(t, val), _this.getStore(), selectsource.value === "Warehouse");
                    t.nextElementSibling.innerHTML = "0";
                    t.value = "0";
                    inedit = false;
                });
            }
            document.getElementById("citydialog-market-table-source").addEventListener("change", (e) => {
                _this.update(true);
            });
            document.getElementById("citydialog-market-table-target").addEventListener("change", (e) => {
                _this.update(true);
            });
            for (var x = 0; x < 5; x++) {
                document.getElementById("new-factory_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = Number(sid.split("_")[1]);
                    var comp = _this.city.companies[id];
                    _this.city.commitBuildingCosts(comp.getBuildingCosts(), comp.getBuildingMaterial(), "buy building");
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
            for (var x = 0; x < product_1.allProducts.length; x++) {
                document.getElementById("warehouse-min-stock_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.city.warehouseMinStock[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("warehouse-selling-price_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.city.warehouseMinStock[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
            }
            for (var x = 0; x < airplane_1.allAirplaneTypes.length; x++) {
                document.getElementById("new-airplane_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = parseInt(sid.split("_")[1]);
                    _this.newAirplane(id);
                });
            }
        }
        newAirplane(typeid) {
            var _this = this;
            _this.city.commitBuildingCosts(airplane_1.allAirplaneTypes[typeid].buildingCosts, airplane_1.allAirplaneTypes[typeid].buildingMaterial, "buy airplane");
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
        sellOrBuy(productid, amount, price, storetarget, isWarehouse) {
            var _a;
            if (isWarehouse) {
                this.city.warehouse[productid] -= amount;
            }
            else {
                this.city.world.game.changeMoney(-amount * price, "sell or buy from market", this.city);
                this.city.market[productid] -= amount;
            }
            storetarget[productid] += amount;
            (_a = this.getAirplaneInMarket()) === null || _a === void 0 ? void 0 : _a.refreshLoadedCount();
            this.update(true);
            this.city.world.game.updateTitle();
        }
        getAirplaneInMarket() {
            var select = document.getElementById("citydialog-market-table-target");
            var val = select.value;
            if (val) {
                for (var x = 0; x < this.city.world.airplanes.length; x++) {
                    if (val === this.city.world.airplanes[x].name)
                        return this.city.world.airplanes[x];
                }
            }
            return undefined;
        }
        getStore() {
            var _a;
            var select = document.getElementById("citydialog-market-table-target");
            var val = select.value;
            if (val) {
                if (this.city.warehouses > 0 && val === "Warehouse") {
                    return this.city.warehouse;
                }
                return (_a = this.getAirplaneInMarket()) === null || _a === void 0 ? void 0 : _a.products;
            }
            return undefined;
        }
        updateMarket() {
            var select = document.getElementById("citydialog-market-table-target");
            var selectsource = document.getElementById("citydialog-market-table-source");
            var last = select.value;
            select.innerHTML = "";
            if (this.city.warehouses > 0) {
                var opt = document.createElement("option");
                opt.value = "Warehouse";
                opt.text = opt.value;
                select.appendChild(opt);
                if (selectsource.children.length === 1) {
                    var opt = document.createElement("option");
                    opt.value = "Warehouse";
                    opt.text = opt.value;
                    selectsource.appendChild(opt);
                }
            }
            else {
                if (selectsource.children.length === 2) {
                    selectsource.removeChild(selectsource.children[1]);
                    selectsource.value = "Market";
                }
            }
            var allAPs = this.city.getAirplanesInCity();
            for (var x = 0; x < allAPs.length; x++) {
                var opt = document.createElement("option");
                opt.value = allAPs[x].name;
                opt.text = opt.value;
                select.appendChild(opt);
            }
            if (last !== "") {
                select.value = last;
            }
            this.updateTitle();
            /*
                                <th>icon</th>
                                <th>name</th>
                                <th>market</th>
                                <th>buy</th>
                                <th>airplane1</th>
                                <th>sell</th>
                                <th>price</th>
            */
            var storetarget = this.getStore();
            var storesource = this.city.market;
            if (selectsource.value === "Warehouse") {
                storesource = this.city.warehouse;
            }
            for (var x = 0; x < product_1.allProducts.length; x++) {
                var table = document.getElementById("citydialog-market-table");
                var tr = table.children[0].children[x + 1];
                tr.children[2].innerHTML = storesource[x].toString();
                tr.children[3].innerHTML = (selectsource.value === "Warehouse" ? "" : this.calcPrice(tr.children[4].children[0], 0).toString());
                tr.children[4].children[0].max = storesource[x].toString();
                if (storetarget) {
                    var max = storesource[x];
                    var testap = this.getAirplaneInMarket();
                    if (testap)
                        max = Math.min(max, testap.capacity - testap.loadedCount);
                    tr.children[4].children[0].readOnly = false;
                    tr.children[6].children[0].readOnly = false;
                    tr.children[4].children[0].max = "40"; //storesource[x].toString();
                    tr.children[4].children[0].setAttribute("maxValue", max.toString());
                    tr.children[5].innerHTML = storetarget[x].toString();
                    tr.children[6].children[0].max = "40"; //storetarget[x].toString();
                    tr.children[6].children[0].setAttribute("maxValue", storetarget[x].toString());
                }
                else {
                    tr.children[4].children[0].readOnly = true;
                    tr.children[6].children[0].readOnly = true;
                    tr.children[5].innerHTML = "";
                    tr.children[4].children[0].max = "0";
                    tr.children[6].children[0].max = "0";
                }
            }
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
                if (test.input2 === x) {
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
            if ((_f = (_e = (_d = document.getElementById("citydialog-market-tab")) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.classList) === null || _f === void 0 ? void 0 : _f.contains("ui-tabs-active"))
                this.updateMarket();
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
                width: "450px",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBT0EsWUFBWTtJQUNaLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDVixPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDekMsQ0FBQyxDQUFBO0lBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNQLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxVQUFVLENBQUMsRUFBRSxJQUFJO1lBQ3BCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDTCxNQUFhLFVBQVU7UUFLbkI7WUFGQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBR2QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksVUFBVSxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNqQyxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDM0MsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQy9CLENBQUM7UUFFTyxTQUFTLENBQUMsRUFBb0IsRUFBRSxHQUFXO1lBQy9DLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztZQUMzQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcs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XG5pbXBvcnQgeyBhbGxQcm9kdWN0cywgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcbmltcG9ydCB7IEFpcnBsYW5lLCBhbGxBaXJwbGFuZVR5cGVzIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcbmltcG9ydCB7IEFpcnBsYW5lRGlhbG9nIH0gZnJvbSBcImdhbWUvYWlycGxhbmVkaWFsb2dcIjtcbmltcG9ydCB7IENvbXBhbnkgfSBmcm9tIFwiZ2FtZS9jb21wYW55XCI7XG5cbi8vQHRzLWlnbm9yZVxud2luZG93LmNpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xufVxudmFyIGxvZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvZyA9IE1hdGgubG9nO1xuICAgIHJldHVybiBmdW5jdGlvbiAobiwgYmFzZSkge1xuICAgICAgICByZXR1cm4gbG9nKG4pIC8gKGJhc2UgPyBsb2coYmFzZSkgOiAxKTtcbiAgICB9O1xufSkoKTtcbmV4cG9ydCBjbGFzcyBDaXR5RGlhbG9nIHtcbiAgICBkb206IEhUTUxEaXZFbGVtZW50O1xuICAgIGNpdHk6IENpdHk7XG4gICAgaGFzUGF1c2VkID0gZmFsc2U7XG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcbiAgICB9XG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IENpdHlEaWFsb2cge1xuICAgICAgICBpZiAoQ2l0eURpYWxvZy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgQ2l0eURpYWxvZy5pbnN0YW5jZSA9IG5ldyBDaXR5RGlhbG9nKCk7XG4gICAgICAgIHJldHVybiBDaXR5RGlhbG9nLmluc3RhbmNlO1xuICAgIH1cbiBcbiAgICBwcml2YXRlIGNhbGNQcmljZShlbDogSFRNTElucHV0RWxlbWVudCwgdmFsOiBudW1iZXIpIHtcbiAgICAgICAgdmFyIGlkID0gTnVtYmVyKGVsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgIHZhciBpc1Byb2R1Y2VkSGVyZSA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY2l0eS5jb21wYW5pZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNpdHkuY29tcGFuaWVzW3hdLnByb2R1Y3RpZCA9PT0gaWQpXG4gICAgICAgICAgICAgICAgaXNQcm9kdWNlZEhlcmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcm9kID0gYWxsUHJvZHVjdHNbaWRdLnByaWNlU2VsbGluZztcblxuICAgICAgICBpZiAoZWwuaWQuaW5kZXhPZihcInNlbGxcIikgPiAtMSlcbiAgICAgICAgICAgIHZhbCA9IC12YWw7XG4gICAgICAgIHZhciByZXQgPSBhbGxQcm9kdWN0c1tpZF0uY2FsY1ByaWNlKHRoaXMuY2l0eS5wZW9wbGUsIHRoaXMuY2l0eS5tYXJrZXRbaWRdIC0gdmFsLCBpc1Byb2R1Y2VkSGVyZSk7XG4gICAgICAgIHZhciBjb2xvciA9IFwiZ3JlZW5cIjtcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiAyIC8gMykpXG4gICAgICAgICAgICBjb2xvciA9IFwiTGlnaHRHcmVlblwiO1xuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqIDIuNSAvIDMpKVxuICAgICAgICAgICAgY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogMSkpXG4gICAgICAgICAgICBjb2xvciA9IFwiTGlnaHRQaW5rXCI7XG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogNCAvIDMpKVxuICAgICAgICAgICAgY29sb3IgPSBcInJlZFwiO1xuICAgICAgICAoPEhUTUxFbGVtZW50PmVsLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblszXSkuc3R5bGUuYmFja2dyb3VuZCA9IGNvbG9yO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJjaXR5ZGlhbG9nXCIgY2xhc3M9XCJjaXR5ZGlhbG9nXCI+XG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxuICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgdGhpcy5kb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nXCIpO1xuICAgICAgICBpZiAob2xkKSB7XG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xuICAgICAgICB9XG4gICAgICBcbiAgICAgICAgdmFyIHByb2R1Y3RzID0gYWxsUHJvZHVjdHM7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjaXR5ID0gX3RoaXMuY2l0eTtcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiY2l0eWRpYWxvZy1wcmV2XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPFwiLz5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImNpdHlkaWFsb2ctbmV4dFwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIj5cIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy10YWJzXCI+XG4gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLW1hcmtldFwiIGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFiXCIgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5NYXJrZXQ8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1idWlsZGluZ3NcIiBpZD1cImNpdHlkaWFsb2ctYnVpbGRpbmdzLXRhYlwiIGNsYXNzPVwiY2l0eWRpYWxvZy10YWJzXCI+QnVpbGRpbmdzPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2NpdHlkaWFsb2ctd2FyZWhvdXNlXCIgaWQ9XCJjaXR5ZGlhbG9nLXdhcmVob3VzZS10YWJcIiAgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5gKyBJY29ucy53YXJlaG91c2UgKyBgIFdhcmVob3VzZTwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvblwiIGlkPVwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb24tdGFiXCIgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5Db25zdHJ1Y3Rpb248L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1zY29yZVwiIGlkPVwiY2l0eWRpYWxvZy1zY29yZS10YWJcIiAgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5TY29yZTwvYT48L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctbWFya2V0XCI+YCsgdGhpcy5jcmVhdGVNYXJrZXQoKSArIGBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy1idWlsZGluZ3NcIj4gYCsgdGhpcy5jcmVhdGVCdWlsZGluZ3MoKSArIGBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy13YXJlaG91c2VcIj5gKyB0aGlzLmNyZWF0ZVdhcmVob3VzZSgpICsgYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvblwiPmArIHRoaXMuY3JlYXRlQ29uc3RydWN0aW9uKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctc2NvcmVcIj5gKyB0aGlzLmNyZWF0ZVNjb3JlKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XG4gICAgICAgICQoXCIjY2l0eWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuXG4gICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICQoXCIjY2l0eWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgX3RoaXMuYmluZEFjdGlvbnMoKTsgfSwgNTAwKTtcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB9XG4gICAgY3JlYXRlTWFya2V0KCkge1xuICAgICAgICByZXR1cm4gYCA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiIHN0eWxlPVwid2lkdGg6NTVweFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk1hcmtldFwiPk1hcmtldDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5QcmljZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJ1eTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8c2VsZWN0IGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIgc3R5bGU9XCJ3aWR0aDo1MHB4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGxhY2Vob2xkZXJcIj5wbGFjZWhvbGRlcjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TZWxsPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmljZShpZDogc3RyaW5nLCBjaGFuZ2U6IG51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCArIFwiIFwiICsgY2hhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBjbGFzcz1cImNkbXNsaWRlclwiIGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtYnV5LXNsaWRlcl8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCIxMFwiIHN0ZXA9XCIxLjBcIiB2YWx1ZT1cIjBcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwib3ZlcmZsb3c6IGhpZGRlbjt3aWR0aDogNTAlO2hlaWdodDogNzAlO1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAvLydvbmlucHV0PVwidGhpcy5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MID0gdGhpcy52YWx1ZTsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJ3RoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzNdLmlubmVySFRNTD0xOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPicgKyBcIjxzcGFuPjA8L3NwYW4+PC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGlucHV0IGNsYXNzPVwiY2Rtc2xpZGVyXCIgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC1zZWxsLXNsaWRlcl8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCI1MDBcIiBzdGVwPVwiMS4wXCIgdmFsdWU9XCIwXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIm92ZXJmbG93OiBoaWRkZW47d2lkdGg6IDUwJTtoZWlnaHQ6IDcwJTtcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8nb25pbnB1dD1cInRoaXMubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IHRoaXMudmFsdWU7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAndGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bM10uaW5uZXJIVE1MPXZhbHVlOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPicgKyBcIjxzcGFuPjA8L3NwYW4+PC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+PC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5gO1xuICAgIH1cbiAgICBjcmVhdGVCdWlsZGluZ3MoKSB7XG4gICAgICAgIHJldHVybiBgPHRhYmxlIGlkPVwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Qcm9kdWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJ1aWxkaW5nczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkpvYnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OZWVkczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgNTsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPjxidXR0b24gaWQ9XCJuZXctZmFjdG9yeV8nICsgeCArICdcIj4nICsgXCIrXCIgKyBJY29ucy5mYWN0b3J5ICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gaWQ9XCJkZWxldGUtZmFjdG9yeV8nICsgeCArICdcIj4nICsgXCItXCIgKyBJY29ucy5mYWN0b3J5ICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gaWQ9XCJidXktbGljZW5zZV8nICsgeCArICdcIj4nICsgXCJidXkgbGljZW5zZSB0byBwcm9kdWNlIGZvciA1MC4wMDBcIiArIEljb25zLm1vbmV5ICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJuby13YXJlaG91c2VfJyArIHggKyAnXCI+bmVlZCBhIHdhcmVob3VzZSB0byBwcm9kdWNlPC9kaXY+JyArXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICc8L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgICAgICAgIDxiPnJlc2lkZW50aWFsIGJ1aWxkaW5nPC9iPlxuICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICBgKyBJY29ucy5ob21lICsgYCBob3VzZXM6IDxzcGFuIGlkPVwiaG91c2VzXCI+MC8wPC9zcGFuPiAgXG4gICAgICAgICAgICAgICAgICAgICAgICBgKyBJY29ucy5wZW9wbGUgKyBgIHJlbnRlcjogPHNwYW4gaWQ9XCJyZW50ZXJcIj4wLzA8L3NwYW4+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJidXktaG91c2VcIj4rYCsgSWNvbnMuaG9tZSArIGAgZm9yIDI1LjAwMGAgKyBJY29ucy5tb25leSArIFwiIDQweFwiICsgYWxsUHJvZHVjdHNbMF0uZ2V0SWNvbigpICtcbiAgICAgICAgICAgIFwiIDgweFwiICsgYWxsUHJvZHVjdHNbMV0uZ2V0SWNvbigpICsgYDwvYnV0dG9uPiBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkZWxldGUtaG91c2VcIj4tYCsgSWNvbnMuaG9tZSArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Yj5XYXJlaG91c2U8L2I+XG4gICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgIGArIEljb25zLndhcmVob3VzZSArIGAgaG91c2VzOiA8c3BhbiBpZD1cImNvdW50LXdhcmVob3VzZXNcIj4wLzA8L3NwYW4+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGAgKyBgIGNvc3RzOiA8c3BhbiBpZD1cImNvc3RzLXdhcmVob3VzZXNcIj4wPC9zcGFuPiBgICsgSWNvbnMubW9uZXkgKyBgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJidXktd2FyZWhvdXNlXCI+K2ArIEljb25zLmhvbWUgKyBgIGZvciAxNS4wMDBgICsgSWNvbnMubW9uZXkgKyBcIiAyMHhcIiArIGFsbFByb2R1Y3RzWzBdLmdldEljb24oKSArXG4gICAgICAgICAgICBcIiA0MHhcIiArIGFsbFByb2R1Y3RzWzFdLmdldEljb24oKSArIGA8L2J1dHRvbj4gXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiZGVsZXRlLXdhcmVob3VzZVwiPi1gKyBJY29ucy5ob21lICsgYDwvYnV0dG9uPmA7XG4gICAgfVxuICAgIGNyZWF0ZVdhcmVob3VzZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLXdhcmVob3VzZS10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdG9jazwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlByb2R1Y2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OZWVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWluLVN0b2NrPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+U2VsbGluZyBwcmljZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD4wPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cIndhcmVob3VzZS1taW4tc3RvY2tcIiBpZD1cIndhcmVob3VzZS1taW4tc3RvY2tfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwid2FyZWhvdXNlLXNlbGxpbmctcHJpY2VcIiBpZD1cIndhcmVob3VzZS1zZWxsaW5nLXByaWNlXycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPHA+bnVtYmVyIG9mIHdhcmVob3VzZXMgPHNwYW4gaWQ9XCJjaXR5ZGlhbG9nLXdhcmVob3VzZS1jb3VudFwiPjxzcGFuPjwvcD5gO1xuICAgIH1cbiAgICBjcmVhdGVTY29yZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLXNjb3JlLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TY29yZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+YDtcbiAgICB9XG4gICAgY3JlYXRlQ29uc3RydWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYDx0YWJsZSBpZD1cImNpdHlkaWFsb2ctY29uc3RydWN0aW9uLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TW9kZWw8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TcGVlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkNhcGFjaXR5PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+RGFpbHkgQ29zdHM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5CdWlsZCBkYXlzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxBaXJwbGFuZVR5cGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbEFpcnBsYW5lVHlwZXNbeF0ubW9kZWwgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsQWlycGxhbmVUeXBlc1t4XS5zcGVlZCArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxBaXJwbGFuZVR5cGVzW3hdLmNhcGFjaXR5ICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbEFpcnBsYW5lVHlwZXNbeF0uY29zdHMgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsQWlycGxhbmVUeXBlc1t4XS5idWlsZERheXMgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgJzxidXR0b24gaWQ9XCJuZXctYWlycGxhbmVfJyArIHggKyAnXCI+JyArIFwiK1wiICsgSWNvbnMuYWlycGxhbmUgKyBcIiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBDaXR5LmdldEJ1aWxkaW5nQ29zdHNBc0ljb24oYWxsQWlycGxhbmVUeXBlc1t4XS5idWlsZGluZ0Nvc3RzLCBhbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkaW5nTWF0ZXJpYWwpICsgXCI8L2J1dHRvbj48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfSAgXG4gICAgICAgICAgICAgICAgPC90YWJsZT4gYDtcbiAgICB9XG4gICAgZ2V0U2xpZGVyVmFsdWUoZG9tOiBIVE1MSW5wdXRFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgdmFyIG1heFZhbHVlID0gcGFyc2VJbnQoZG9tLmdldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIpKTtcbiAgICAgICAgdmFyIHZhbCA9IHBhcnNlSW50KGRvbS52YWx1ZSk7XG4gICAgICAgIGlmICh2YWwgPT09IDApXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgdmFyIGV4cCA9IE1hdGgucm91bmQobG9nKG1heFZhbHVlLCA0MCkgKiAxMDAwKSAvIDEwMDA7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKE1hdGgucG93KHZhbCwgZXhwKSk7XG4gICAgfVxuICAgIGJpbmRBY3Rpb25zKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXMuaW5kZXhPZihfdGhpcy5jaXR5KTtcbiAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgaWYgKHBvcyA+PSBfdGhpcy5jaXR5LndvcmxkLmNpdGllcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgICAgIF90aGlzLmNpdHkgPSBfdGhpcy5jaXR5LndvcmxkLmNpdGllc1twb3NdO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzLmluZGV4T2YoX3RoaXMuY2l0eSk7XG4gICAgICAgICAgICBwb3MtLTtcbiAgICAgICAgICAgIGlmIChwb3MgPT09IC0xKVxuICAgICAgICAgICAgICAgIHBvcyA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBfdGhpcy5jaXR5ID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXNbcG9zXTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5jaXR5ZGlhbG9nLXRhYnMnKS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtYnV5LXNsaWRlcl9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpO1xuICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IF90aGlzLmNhbGNQcmljZSh0LCB2YWwpO1xuICAgICAgICAgICAgICAgIHQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IFwiXCIgKyB2YWwgKyBcIiBcIiArIHZhbCAqIHByaWNlO1xuICAgICAgICAgICAgICAgIHQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzNdLmlubmVySFRNTCA9IFwiXCIgKyBwcmljZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1zZWxsLXNsaWRlcl9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpO1xuICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IF90aGlzLmNhbGNQcmljZSh0LCB2YWwpO1xuICAgICAgICAgICAgICAgIHQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IFwiXCIgKyB2YWwgKyBcIiBcIiArIHZhbCAqIHByaWNlO1xuICAgICAgICAgICAgICAgIHQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzNdLmlubmVySFRNTCA9IFwiXCIgKyBwcmljZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGluZWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1idXktc2xpZGVyX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpbmVkaXQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0O1xuICAgICAgICAgICAgICAgIGluZWRpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKHQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0c291cmNlOiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS1zb3VyY2VcIik7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpO1xuICAgICAgICAgICAgICAgIF90aGlzLnNlbGxPckJ1eShpZCwgdmFsLCBfdGhpcy5jYWxjUHJpY2UodCwgdmFsKSwgX3RoaXMuZ2V0U3RvcmUoKSwgc2VsZWN0c291cmNlLnZhbHVlID09PSBcIldhcmVob3VzZVwiKTtcbiAgICAgICAgICAgICAgICB0Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUwgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICB0LnZhbHVlID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgaW5lZGl0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1zZWxsLXNsaWRlcl9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5lZGl0KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcbiAgICAgICAgICAgICAgICBpbmVkaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5nZXRTbGlkZXJWYWx1ZSh0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIodC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rzb3VyY2U6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxsT3JCdXkoaWQsIC12YWwsIF90aGlzLmNhbGNQcmljZSh0LCB2YWwpLCBfdGhpcy5nZXRTdG9yZSgpLCBzZWxlY3Rzb3VyY2UudmFsdWUgPT09IFwiV2FyZWhvdXNlXCIpO1xuICAgICAgICAgICAgICAgIHQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IFwiMFwiO1xuICAgICAgICAgICAgICAgIHQudmFsdWUgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICBpbmVkaXQgPSBmYWxzZTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS1zb3VyY2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG5cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgNTsgeCsrKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkuaWQ7XG4gICAgICAgICAgICAgICAgaWYgKHNpZCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkucGFyZW50Tm9kZS5pZFxuICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcihzaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgY29tcCA9IF90aGlzLmNpdHkuY29tcGFuaWVzW2lkXTtcblxuICAgICAgICAgICAgICAgIF90aGlzLmNpdHkuY29tbWl0QnVpbGRpbmdDb3N0cyhjb21wLmdldEJ1aWxkaW5nQ29zdHMoKSwgY29tcC5nZXRCdWlsZGluZ01hdGVyaWFsKCksIFwiYnV5IGJ1aWxkaW5nXCIpO1xuICAgICAgICAgICAgICAgIGNvbXAuYnVpbGRpbmdzKys7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWZhY3RvcnlfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBzaWQgPSAoPGFueT5ldnQudGFyZ2V0KS5pZDtcbiAgICAgICAgICAgICAgICBpZiAoc2lkID09PSBcIlwiKVxuICAgICAgICAgICAgICAgICAgICBzaWQgPSAoPGFueT5ldnQudGFyZ2V0KS5wYXJlbnROb2RlLmlkXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKHNpZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIHZhciBjb21wID0gX3RoaXMuY2l0eS5jb21wYW5pZXNbaWRdO1xuICAgICAgICAgICAgICAgIGlmIChjb21wLmJ1aWxkaW5ncyA+IDApXG4gICAgICAgICAgICAgICAgICAgIGNvbXAuYnVpbGRpbmdzLS07XG4gICAgICAgICAgICAgICAgdmFyIHVuZW1wbCA9IHRoaXMuY2l0eS5jb21wYW5pZXNbaWRdLndvcmtlcnMgLSAodGhpcy5jaXR5LmNvbXBhbmllc1tpZF0uYnVpbGRpbmdzICogQ29tcGFueS53b3JrZXJJbkNvbXBhbnkpO1xuICAgICAgICAgICAgICAgIGlmICh1bmVtcGwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eS5jb21wYW5pZXNbaWRdLndvcmtlcnMgLT0gdW5lbXBsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNpdHkudHJhbnNmZXJXb3JrZXIodW5lbXBsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBzaWQgPSAoPGFueT5ldnQudGFyZ2V0KS5pZDtcbiAgICAgICAgICAgICAgICBpZiAoc2lkID09PSBcIlwiKVxuICAgICAgICAgICAgICAgICAgICBzaWQgPSAoPGFueT5ldnQudGFyZ2V0KS5wYXJlbnROb2RlLmlkXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKHNpZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIHZhciBjb21wID0gX3RoaXMuY2l0eS5jb21wYW5pZXNbaWRdO1xuICAgICAgICAgICAgICAgIF90aGlzLmNpdHkuY29tbWl0QnVpbGRpbmdDb3N0cyg1MDAwMCwgW10sIFwiYnV5IGxpY2VuY2VcIik7XG4gICAgICAgICAgICAgICAgY29tcC5oYXNMaWNlbnNlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktaG91c2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKDE1MDAwLCBbMjAsIDQwXSwgXCJidXkgYnVpbGRpbmdcIik7XG4gICAgICAgICAgICBfdGhpcy5jaXR5LmhvdXNlcysrO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1ob3VzZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgaWYgKF90aGlzLmNpdHkuaG91c2VzID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIF90aGlzLmNpdHkuaG91c2VzLS07XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIC8qaWYgKChfdGhpcy5jaXR5LnBlb3BsZSAtIDEwMDApID4gX3RoaXMuY2l0eS5ob3VzZXMgKiAxMDApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LnBlb3BsZSA9IDEwMDAgKyBfdGhpcy5jaXR5LmhvdXNlcyAqIDEwMDtcbiAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZW1vdmUgd29ya2VyXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktd2FyZWhvdXNlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG5cbiAgICAgICAgICAgIF90aGlzLmNpdHkuY29tbWl0QnVpbGRpbmdDb3N0cygyNTAwMCwgWzQwLCA4MF0sIFwiYnV5IGJ1aWxkaW5nXCIpO1xuICAgICAgICAgICAgX3RoaXMuY2l0eS53YXJlaG91c2VzKys7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLXdhcmVob3VzZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgaWYgKF90aGlzLmNpdHkud2FyZWhvdXNlcyA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBfdGhpcy5jaXR5LndhcmVob3VzZXMtLTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhcmVob3VzZS1taW4tc3RvY2tfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LndhcmVob3VzZU1pblN0b2NrW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YXJlaG91c2Utc2VsbGluZy1wcmljZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLmNpdHkud2FyZWhvdXNlTWluU3RvY2tbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbEFpcnBsYW5lVHlwZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWFpcnBsYW5lX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkuaWQ7XG4gICAgICAgICAgICAgICAgaWYgKHNpZCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkucGFyZW50Tm9kZS5pZFxuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KHNpZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLm5ld0FpcnBsYW5lKGlkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgbmV3QWlycGxhbmUodHlwZWlkOiBudW1iZXIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3RoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS5idWlsZGluZ0Nvc3RzLCBhbGxBaXJwbGFuZVR5cGVzW3R5cGVpZF0uYnVpbGRpbmdNYXRlcmlhbCwgXCJidXkgYWlycGxhbmVcIik7XG4gICAgICAgIHZhciBtYXhOdW1iZXIgPSAxO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IF90aGlzLmNpdHkud29ybGQuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgdGVzdCA9IF90aGlzLmNpdHkud29ybGQuYWlycGxhbmVzW3hdO1xuICAgICAgICAgICAgdmFyIHBvcyA9IHRlc3QubmFtZS5pbmRleE9mKGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS5tb2RlbCk7XG4gICAgICAgICAgICBpZihwb3M9PT0wKXtcbiAgICAgICAgICAgICAgICB2YXIgbnIgPSBwYXJzZUludCh0ZXN0Lm5hbWUuc3Vic3RyaW5nKGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS5tb2RlbC5sZW5ndGgpKTtcbiAgICAgICAgICAgICAgICBpZiAobnIgIT09IE5hTiAmJiBuciA+IG1heE51bWJlcilcbiAgICAgICAgICAgICAgICAgICAgbWF4TnVtYmVyID0gbnI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWF4TnVtYmVyKys7XG4gICAgICAgIHZhciBhcCA9IG5ldyBBaXJwbGFuZShfdGhpcy5jaXR5LndvcmxkKTtcbiAgICAgICAgYXAuc3BlZWQgPSAyMDA7XG4gICAgICAgIGFwLnggPSBfdGhpcy5jaXR5Lng7XG4gICAgICAgIGFwLnkgPSBfdGhpcy5jaXR5Lnk7XG4gICAgICAgIGFwLndvcmxkID0gX3RoaXMuY2l0eS53b3JsZDtcbiAgICAgICAgYXAudHlwZWlkID0gYWxsQWlycGxhbmVUeXBlc1t0eXBlaWRdLnR5cGVpZDtcbiAgICAgICAgYXAubmFtZSA9IGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS5tb2RlbCArIG1heE51bWJlcjsgXG4gICAgICAgIGFwLnNwZWVkID0gYWxsQWlycGxhbmVUeXBlc1t0eXBlaWRdLnNwZWVkO1xuICAgICAgICBhcC5jb3N0cyA9IGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS5jb3N0cztcbiAgICAgICAgYXAuY2FwYWNpdHkgPSBhbGxBaXJwbGFuZVR5cGVzW3R5cGVpZF0uY2FwYWNpdHk7XG4gICAgICAgIF90aGlzLmNpdHkud29ybGQuYWlycGxhbmVzLnB1c2goYXApO1xuICAgICAgICBhcC5yZW5kZXIoKTtcbiAgICAgICAgX3RoaXMuY2l0eS53b3JsZC5kb20uYXBwZW5kQ2hpbGQoYXAuZG9tKTtcbiAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgIH1cbiAgICBzZWxsT3JCdXkocHJvZHVjdGlkLCBhbW91bnQ6IG51bWJlciwgcHJpY2U6IG51bWJlciwgc3RvcmV0YXJnZXQ6IG51bWJlcltdLCBpc1dhcmVob3VzZTogYm9vbGVhbikge1xuICAgICAgICBpZiAoaXNXYXJlaG91c2UpIHtcbiAgICAgICAgICAgIHRoaXMuY2l0eS53YXJlaG91c2VbcHJvZHVjdGlkXSAtPSBhbW91bnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNpdHkud29ybGQuZ2FtZS5jaGFuZ2VNb25leSgtYW1vdW50ICogcHJpY2UsIFwic2VsbCBvciBidXkgZnJvbSBtYXJrZXRcIiwgdGhpcy5jaXR5KTtcbiAgICAgICAgICAgIHRoaXMuY2l0eS5tYXJrZXRbcHJvZHVjdGlkXSAtPSBhbW91bnQ7XG4gICAgICAgIH1cbiAgICAgICAgc3RvcmV0YXJnZXRbcHJvZHVjdGlkXSArPSBhbW91bnQ7XG4gICAgICAgIHRoaXMuZ2V0QWlycGxhbmVJbk1hcmtldCgpPy5yZWZyZXNoTG9hZGVkQ291bnQoKTtcbiAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgIHRoaXMuY2l0eS53b3JsZC5nYW1lLnVwZGF0ZVRpdGxlKCk7XG4gICAgfVxuICAgIGdldEFpcnBsYW5lSW5NYXJrZXQoKSB7XG4gICAgICAgIHZhciBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKTtcbiAgICAgICAgdmFyIHZhbCA9IHNlbGVjdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdHkud29ybGQuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gdGhpcy5jaXR5LndvcmxkLmFpcnBsYW5lc1t4XS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaXR5LndvcmxkLmFpcnBsYW5lc1t4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBnZXRTdG9yZSgpIHtcbiAgICAgICAgdmFyIHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIpO1xuICAgICAgICB2YXIgdmFsID0gc2VsZWN0LnZhbHVlO1xuICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaXR5LndhcmVob3VzZXMgPiAwICYmIHZhbCA9PT0gXCJXYXJlaG91c2VcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNpdHkud2FyZWhvdXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWlycGxhbmVJbk1hcmtldCgpPy5wcm9kdWN0cztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB1cGRhdGVNYXJrZXQoKSB7XG4gICAgICAgIHZhciBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKTtcbiAgICAgICAgdmFyIHNlbGVjdHNvdXJjZTogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtc291cmNlXCIpO1xuICAgICAgICB2YXIgbGFzdCA9IHNlbGVjdC52YWx1ZTtcbiAgICAgICAgc2VsZWN0LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGlmICh0aGlzLmNpdHkud2FyZWhvdXNlcyA+IDApIHtcbiAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IFwiV2FyZWhvdXNlXCI7XG4gICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdHNvdXJjZS5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgICAgICAgICAgb3B0LnZhbHVlID0gXCJXYXJlaG91c2VcIjtcbiAgICAgICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rzb3VyY2UuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3Rzb3VyY2UuY2hpbGRyZW4ubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0c291cmNlLnJlbW92ZUNoaWxkKHNlbGVjdHNvdXJjZS5jaGlsZHJlblsxXSk7XG4gICAgICAgICAgICAgICAgc2VsZWN0c291cmNlLnZhbHVlID0gXCJNYXJrZXRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgYWxsQVBzPXRoaXMuY2l0eS5nZXRBaXJwbGFuZXNJbkNpdHkoKTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxBUHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9YWxsQVBzW3hdLm5hbWU7XG4gICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxhc3QgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHNlbGVjdC52YWx1ZSA9IGxhc3Q7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5pY29uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPm1hcmtldDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmJ1eTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmFpcnBsYW5lMTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPnNlbGw8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5wcmljZTwvdGg+XG4gICAgICAgICovXG4gICAgICAgIHZhciBzdG9yZXRhcmdldCA9IHRoaXMuZ2V0U3RvcmUoKTtcbiAgICAgICAgdmFyIHN0b3Jlc291cmNlID0gdGhpcy5jaXR5Lm1hcmtldDtcbiAgICAgICAgaWYgKHNlbGVjdHNvdXJjZS52YWx1ZSA9PT0gXCJXYXJlaG91c2VcIikge1xuICAgICAgICAgICAgc3RvcmVzb3VyY2UgPSB0aGlzLmNpdHkud2FyZWhvdXNlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG5cbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzJdLmlubmVySFRNTCA9IHN0b3Jlc291cmNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblszXS5pbm5lckhUTUwgPSAoc2VsZWN0c291cmNlLnZhbHVlID09PSBcIldhcmVob3VzZVwiID8gXCJcIiA6IHRoaXMuY2FsY1ByaWNlKDxhbnk+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0sIDApLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdKS5tYXggPSBzdG9yZXNvdXJjZVt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKHN0b3JldGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG1heCA9IHN0b3Jlc291cmNlW3hdO1xuICAgICAgICAgICAgICAgIHZhciB0ZXN0YXAgPSB0aGlzLmdldEFpcnBsYW5lSW5NYXJrZXQoKTtcbiAgICAgICAgICAgICAgICBpZiAodGVzdGFwKVxuICAgICAgICAgICAgICAgICAgICBtYXggPSBNYXRoLm1pbihtYXgsIHRlc3RhcC5jYXBhY2l0eSAtIHRlc3RhcC5sb2FkZWRDb3VudCk7XG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdKS5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls2XS5jaGlsZHJlblswXSkucmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0pLm1heCA9IFwiNDBcIjsvL3N0b3Jlc291cmNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdKS5zZXRBdHRyaWJ1dGUoXCJtYXhWYWx1ZVwiLCBtYXgudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bNV0uaW5uZXJIVE1MID0gc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLm1heCA9IFwiNDBcIjsvL3N0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLnNldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIsIHN0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0pLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0ci5jaGlsZHJlbls1XS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls0XS5jaGlsZHJlblswXSkubWF4ID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzZdLmNoaWxkcmVuWzBdKS5tYXggPSBcIjBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgdXBkYXRlQnVpbGRpbmdzKCkge1xuICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5wcm9kdWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+YnVpbGRpbmdzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmpvYnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmVlZHM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmNvc3RzIG5ldyBidWlsZGluZzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5hY3Rpb25zPC90aD5cbiAgICAgICAgICAgICAgICovXG4gICAgICAgIHZhciBjb21wYW5pZXMgPSB0aGlzLmNpdHkuY29tcGFuaWVzO1xuICAgICAgICB2YXIgYWxsID0gYWxsUHJvZHVjdHM7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY29tcGFuaWVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IGNvbXBhbmllc1t4XTtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG4gICAgICAgICAgICB2YXIgcHJvZHVjdCA9IGFsbFtjb21wLnByb2R1Y3RpZF07XG4gICAgICAgICAgICB2YXIgcHJvZHVjZSA9IGNvbXAuZ2V0RGFpbHlQcm9kdWNlKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblswXS5pbm5lckhUTUwgPSBwcm9kdWNlICsgXCIgXCIgKyBwcm9kdWN0LmdldEljb24oKTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzFdLmlubmVySFRNTCA9IHByb2R1Y3QubmFtZTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzJdLmlubmVySFRNTCA9IGNvbXAuYnVpbGRpbmdzLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblszXS5pbm5lckhUTUwgPSBjb21wLndvcmtlcnMgKyBcIi9cIiArIGNvbXAuZ2V0TWF4V29ya2VycygpO1xuICAgICAgICAgICAgdmFyIG5lZWRzMSA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgbmVlZHMyID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChwcm9kdWN0LmlucHV0MSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIG5lZWRzMSA9IFwiXCIgKyBjb21wLmdldERhaWx5SW5wdXQxKCkgKyAgYWxsW3Byb2R1Y3QuaW5wdXQxXS5nZXRJY29uKCkgKyBcIiBcIjtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzRdLmlubmVySFRNTCA9IG5lZWRzMTtcbiAgICAgICAgICAgIGlmIChwcm9kdWN0LmlucHV0MiAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIG5lZWRzMiA9ICBcIjxici8+XCIgKyBjb21wLmdldERhaWx5SW5wdXQyKCkgKyAgYWxsW3Byb2R1Y3QuaW5wdXQyXS5nZXRJY29uKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlbls0XS5pbm5lckhUTUwgPSBuZWVkczErXCIgXCIrbmVlZHMyO1xuICAgICAgICAgICAgLy8gdHIuY2hpbGRyZW5bNV0uaW5uZXJIVE1MID0gQ2l0eS5nZXRCdWlsZGluZ0Nvc3RzQXNJY29uKGNvbXAuZ2V0QnVpbGRpbmdDb3N0cygpLCBjb21wLmdldEJ1aWxkaW5nTWF0ZXJpYWwoKSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmIChjb21wLmhhc0xpY2Vuc2UpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS53YXJlaG91c2VzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby13YXJlaG91c2VfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm8td2FyZWhvdXNlX1wiICsgeCkuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcC5oYXNMaWNlbnNlICYmIHRoaXMuY2l0eS53YXJlaG91c2VzID4gMCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5pbm5lckhUTUwgPSBcIitcIiArIEljb25zLmZhY3RvcnkgK1xuICAgICAgICAgICAgICAgICAgICBDaXR5LmdldEJ1aWxkaW5nQ29zdHNBc0ljb24oY29tcC5nZXRCdWlsZGluZ0Nvc3RzKCksIGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWZhY3RvcnlfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtZmFjdG9yeV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLCBcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtYXQgPSBjb21wLmdldEJ1aWxkaW5nTWF0ZXJpYWwoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNpdHkuY2FuQnVpbGQoY29tcC5nZXRCdWlsZGluZ0Nvc3RzKCksIGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpKSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy5jaXR5LndvcmxkLmdhbWUuZ2V0TW9uZXkoKSA8IGNvbXAuZ2V0QnVpbGRpbmdDb3N0cygpIHx8IHRoaXMuY2l0eS5tYXJrZXRbMF0gPCBtYXRbMF0gfHwgdGhpcy5jaXR5Lm1hcmtldFsxXSA8IG1hdFsxXSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgXCJub3QgYWxsIGJ1aWxkaW5nIGNvc3RzIGFyZSBhdmFpbGFibGVcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwidGl0bGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaXR5LmNhbkJ1aWxkKDUwMDAwLCBbXSkgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY291bnQtd2FyZWhvdXNlc1wiKS5pbm5lckhUTUwgPSBcIlwiICsgdGhpcy5jaXR5LndhcmVob3VzZXM7XG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob3VzZXNcIikuaW5uZXJIVE1MID0gXCJcIiArICh0aGlzLmNpdHkuaG91c2VzICsgXCIvXCIgKyB0aGlzLmNpdHkuaG91c2VzKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZW50ZXJcIikuaW5uZXJIVE1MID0gXCJcIiArICh0aGlzLmNpdHkucGVvcGxlIC0gQ2l0eS5uZXV0cmFsU3RhcnRQZW9wbGUgKyBcIi9cIiArIHRoaXMuY2l0eS5ob3VzZXMgKiAxMDApO1xuICAgICAgICBpZiAodGhpcy5jaXR5LmNhbkJ1aWxkKDI1MDAwLCBbNDAsIDgwXSkgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWhvdXNlXCIpLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktaG91c2VcIikucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2l0eS5jYW5CdWlsZCgxNTAwMCwgWzIwLCA0MF0pICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS13YXJlaG91c2VcIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS13YXJlaG91c2VcIikucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jaXR5LmhvdXNlcyA9PT0gMCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtaG91c2VcIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1ob3VzZVwiKS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG4gICAgdXBkYXRlV2FyZWhvdXNlKCkge1xuICAgICAgICB2YXIgbmVlZHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgbmVlZHMucHVzaCgwKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2l0eS5jb21wYW5pZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gYWxsUHJvZHVjdHNbdGhpcy5jaXR5LmNvbXBhbmllc1tpXS5wcm9kdWN0aWRdO1xuICAgICAgICAgICAgaWYgKHRlc3QuaW5wdXQxICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBuZWVkc1t0ZXN0LmlucHV0MV0gKz0gKE1hdGgucm91bmQodGhpcy5jaXR5LmNvbXBhbmllc1tpXS53b3JrZXJzICogdGVzdC5pbnB1dDFBbW91bnQgLyBDb21wYW55LndvcmtlckluQ29tcGFueSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRlc3QuaW5wdXQyID09PSB4KSB7XG4gICAgICAgICAgICAgICAgbmVlZHNbdGVzdC5pbnB1dDJdICs9IChNYXRoLnJvdW5kKHRoaXMuY2l0eS5jb21wYW5pZXNbaV0ud29ya2VycyAqIHRlc3QuaW5wdXQyQW1vdW50IC8gQ29tcGFueS53b3JrZXJJbkNvbXBhbnkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctd2FyZWhvdXNlLXRhYmxlXCIpO1xuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xuXG4gICAgICAgICAgICB0ci5jaGlsZHJlblsyXS5pbm5lckhUTUwgPSB0aGlzLmNpdHkud2FyZWhvdXNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB2YXIgcHJvZCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgcHJvZHVjdCA9IGFsbFByb2R1Y3RzW3hdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNpdHkuY29tcGFuaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5jb21wYW5pZXNbaV0ucHJvZHVjdGlkID09PSB4KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2QgPSBNYXRoLnJvdW5kKHRoaXMuY2l0eS5jb21wYW5pZXNbaV0ud29ya2VycyAqIHByb2R1Y3QuZGFpbHlQcm9kdWNlIC8gQ29tcGFueS53b3JrZXJJbkNvbXBhbnkpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bM10uaW5uZXJIVE1MID0gcHJvZDtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzRdLmlubmVySFRNTCA9IG5lZWRzW3hdID09PSAwID8gXCJcIiA6IG5lZWRzW3hdO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRyLmNoaWxkcmVuWzVdLmNoaWxkcmVuWzBdKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls1XS5jaGlsZHJlblswXSkudmFsdWUgPSB0aGlzLmNpdHkud2FyZWhvdXNlTWluU3RvY2tbeF0gPT09IHVuZGVmaW5lZCA/IFwiXCIgOiB0aGlzLmNpdHkud2FyZWhvdXNlTWluU3RvY2tbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0ci5jaGlsZHJlbls2XS5jaGlsZHJlblswXSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLnZhbHVlID0gdGhpcy5jaXR5LndhcmVob3VzZVNlbGxpbmdQcmljZVt4XSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHRoaXMuY2l0eS53YXJlaG91c2VTZWxsaW5nUHJpY2VbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy13YXJlaG91c2UtY291bnRcIikuaW5uZXJIVE1MID0gXCJcIiArIHRoaXMuY2l0eS53YXJlaG91c2VzO1xuXG4gICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29zdHMtd2FyZWhvdXNlc1wiKS5pbm5lckhUTUw9XCJcIisodGhpcy5jaXR5LndhcmVob3VzZXMqNTApO1xuICAgIH1cbiAgICB1cGRhdGVDb25zdHJ1Y3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsQWlycGxhbmVUeXBlcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5jYW5CdWlsZChhbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkaW5nQ29zdHMsIGFsbEFpcnBsYW5lVHlwZXNbeF0uYnVpbGRpbmdNYXRlcmlhbCkgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1haXJwbGFuZV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1haXJwbGFuZV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlU2NvcmUoKSB7XG5cbiAgICAgICAgLy9zY29yZVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctc2NvcmUtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG4gICAgICAgICAgICB0ci5jaGlsZHJlblsyXS5pbm5lckhUTUwgPSB0aGlzLmNpdHkuc2NvcmVbeF0gKyBcIjwvdGQ+XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlKGZvcmNlID0gZmFsc2UpIHtcblxuICAgICAgICBpZiAoIXRoaXMuY2l0eSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghJCh0aGlzLmRvbSkuZGlhbG9nKCdpc09wZW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICAgICAgICAvL3BhdXNlIGdhbWUgd2hpbGUgdHJhZGluZ1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKSkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaXR5LndvcmxkLmdhbWUuaXNQYXVzZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1BhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eS53b3JsZC5nYW1lLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjsvLy9ubyB1cGRhdGUgYmVjYXVzZSBvZiBzbGlkZXJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzUGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eS53b3JsZC5nYW1lLnJlc3VtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIikpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1hcmtldCgpO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLWJ1aWxkaW5ncy10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKSlcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnVpbGRpbmdzKCk7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctd2FyZWhvdXNlLXRhYlwiKT8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0Py5jb250YWlucyhcInVpLXRhYnMtYWN0aXZlXCIpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVXYXJlaG91c2UoKTtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb24tdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIikpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnN0cnVjdGlvbigpO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNjb3JlLXRhYlwiKT8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0Py5jb250YWlucyhcInVpLXRhYnMtYWN0aXZlXCIpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlVGl0bGUoKSB7XG4gICAgICAgIHZhciBzaWNvbiA9ICcnO1xuICAgICAgICBpZiAoJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJylbMF0uaW5uZXJIVE1MID0gJzxpbWcgc3R5bGU9XCJmbG9hdDogcmlnaHRcIiBpZD1cImNpdHlkaWFsb2ctaWNvblwiIHNyYz1cIicgKyB0aGlzLmNpdHkuaWNvbiArXG4gICAgICAgICAgICAgICAgJ1wiICBoZWlnaHQ9XCIxNVwiPjwvaW1nPiAnICsgdGhpcy5jaXR5Lm5hbWUgKyBcIiBcIiArIHRoaXMuY2l0eS5wZW9wbGUgKyBcIiBcIiArIEljb25zLnBlb3BsZTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKHtcbiAgICAgICAgICAgIHdpZHRoOiBcIjQ1MHB4XCIsXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICAvLyBwb3NpdGlvbjogeyBteTogXCJsZWZ0IHRvcFwiLCBhdDogXCJyaWdodCB0b3BcIiwgb2Y6ICQoQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5kb20pIH0sXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoZXYsIGV2Mikge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5oYXNQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2l0eS53b3JsZC5nYW1lLnJlc3VtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZGlhbG9nKFwid2lkZ2V0XCIpLmRyYWdnYWJsZShcIm9wdGlvblwiLFwiY29udGFpbm1lbnRcIixcIm5vbmVcIik7XG4gICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmNzcyh7IHBvc2l0aW9uOiBcImZpeGVkXCIgfSk7XG5cbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgIH1cbn1cbiJdfQ==