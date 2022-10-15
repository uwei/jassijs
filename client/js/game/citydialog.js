define(["require", "exports", "game/city", "game/product", "game/icons", "game/airplane"], function (require, exports, city_1, product_1, icons_1, airplane_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CityDialog = void 0;
    var css = `
    table{
        font-size:inherit;
    }
    .citydialog >*{
        font-size:10px;
    }
    .ui-dialog-title{
        font-size:10px;
    }
    .ui-dialog-titlebar{
        height:10px;
    } 
`;
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
        createStyle() {
            var style = document.createElement('style');
            style.id = "citydialogcss";
            style.type = 'text/css';
            style.innerHTML = css;
            var old = document.getElementById("citydialogcss");
            if (old) {
                old.parentNode.removeChild(old);
            }
            document.getElementsByTagName('head')[0].appendChild(style);
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
            this.createStyle();
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
                    comp.workers += 25;
                    comp.buildings++;
                    _this.update();
                    //alert("create x");
                });
                document.getElementById("delete-factory_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = Number(sid.split("_")[1]);
                    var comp = _this.city.companies[id];
                    if (comp.buildings > 0)
                        comp.buildings--;
                    if (comp.workers > comp.buildings * 25) {
                        comp.workers = comp.buildings * 25;
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
                if ((_this.city.people - 1000) > _this.city.houses * 100) {
                    _this.city.people = 1000 + _this.city.houses * 100;
                }
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
                var nr = parseInt(test.name.substring(test.name.length + pos));
                if (nr !== NaN && nr > maxNumber)
                    maxNumber = nr;
            }
            maxNumber++;
            var ap = new airplane_1.Airplane(_this.city.world);
            ap.speed = 200;
            ap.x = _this.city.x;
            ap.y = _this.city.y;
            ap.world = _this.city.world;
            ap.typeid = typeid;
            ap.name = airplane_1.allAirplaneTypes[typeid].model + maxNumber;
            ap.speed = airplane_1.allAirplaneTypes[typeid].speed;
            ap.costs = airplane_1.allAirplaneTypes[typeid].costs;
            ap.capacity = airplane_1.allAirplaneTypes[typeid].capacity;
            _this.city.world.airplanes.push(ap);
            this.city.airplanesInCity.push(_this.city.world.airplanes.indexOf(ap));
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
            for (var x = 0; x < this.city.airplanesInCity.length; x++) {
                var opt = document.createElement("option");
                opt.value = this.city.world.airplanes[this.city.airplanesInCity[x]].name;
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
                    needs1 = "" + comp.getDailyInput1() + "<br/>" + all[product.input1].getIcon() + " ";
                tr.children[4].innerHTML = needs1;
                if (product.input2 !== undefined)
                    needs2 = needs2 + "" + comp.getDailyInput2() + "<br/>" + all[product.input2].getIcon();
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
            document.getElementById("renter").innerHTML = "" + (this.city.people - 1000 + "/" + this.city.houses * 100);
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
                    needs[test.input1] += (Math.round(this.city.companies[i].workers * test.input1Amount / 25));
                }
                if (test.input2 === x) {
                    needs[test.input2] += (Math.round(this.city.companies[i].workers * test.input2Amount / 25));
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
                        prod = Math.round(this.city.companies[i].workers * product.dailyProduce / 25).toString();
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
                // position: { my: "left top", at: "right top", of: $(AirplaneDialog.getInstance().dom) },
                open: function (event, ui) {
                    _this.update(true);
                },
                close: function (ev, ev2) {
                    if (_this.hasPaused) {
                        _this.city.world.game.resume();
                    }
                }
            });
            $(this.dom).parent().css({ position: "fixed" });
        }
        close() {
            $(this.dom).dialog("close");
        }
    }
    exports.CityDialog = CityDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBS0EsSUFBSSxHQUFHLEdBQUc7Ozs7Ozs7Ozs7Ozs7Q0FhVCxDQUFDO0lBQ0YsWUFBWTtJQUNaLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDVixPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDekMsQ0FBQyxDQUFBO0lBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNQLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxVQUFVLENBQUMsRUFBRSxJQUFJO1lBQ3BCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDTCxNQUFhLFVBQVU7UUFLbkI7WUFGQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBR2QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksVUFBVSxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNqQyxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDM0MsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQy9CLENBQUM7UUFDTyxXQUFXO1lBQ2YsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxLQUFLLENBQUMsRUFBRSxHQUFHLGVBQWUsQ0FBQztZQUMzQixLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztZQUN4QixLQUFLLENBQUMsU0FBUyxHQUFH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SSxLQUFLLENBQUMsU0FBUyxFQUFFO3dCQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2xDO2dCQUNMLENBQUM7YUFDSixDQUFDLENBQUM7WUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXBELENBQUM7UUFDRCxLQUFLO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBenpCRCxnQ0F5ekJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcbmltcG9ydCB7IGFsbFByb2R1Y3RzLCBQcm9kdWN0IH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xuaW1wb3J0IHsgQWlycGxhbmUsIGFsbEFpcnBsYW5lVHlwZXMgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xuaW1wb3J0IHsgQWlycGxhbmVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZWRpYWxvZ1wiO1xudmFyIGNzcyA9IGBcbiAgICB0YWJsZXtcbiAgICAgICAgZm9udC1zaXplOmluaGVyaXQ7XG4gICAgfVxuICAgIC5jaXR5ZGlhbG9nID4qe1xuICAgICAgICBmb250LXNpemU6MTBweDtcbiAgICB9XG4gICAgLnVpLWRpYWxvZy10aXRsZXtcbiAgICAgICAgZm9udC1zaXplOjEwcHg7XG4gICAgfVxuICAgIC51aS1kaWFsb2ctdGl0bGViYXJ7XG4gICAgICAgIGhlaWdodDoxMHB4O1xuICAgIH0gXG5gO1xuLy9AdHMtaWdub3JlXG53aW5kb3cuY2l0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNpdHk7XG59XG52YXIgbG9nID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbG9nID0gTWF0aC5sb2c7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuLCBiYXNlKSB7XG4gICAgICAgIHJldHVybiBsb2cobikgLyAoYmFzZSA/IGxvZyhiYXNlKSA6IDEpO1xuICAgIH07XG59KSgpO1xuZXhwb3J0IGNsYXNzIENpdHlEaWFsb2cge1xuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XG4gICAgY2l0eTogQ2l0eTtcbiAgICBoYXNQYXVzZWQgPSBmYWxzZTtcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQ2l0eURpYWxvZyB7XG4gICAgICAgIGlmIChDaXR5RGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBDaXR5RGlhbG9nLmluc3RhbmNlID0gbmV3IENpdHlEaWFsb2coKTtcbiAgICAgICAgcmV0dXJuIENpdHlEaWFsb2cuaW5zdGFuY2U7XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlU3R5bGUoKSB7XG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLmlkID0gXCJjaXR5ZGlhbG9nY3NzXCI7XG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XG5cbiAgICAgICAgdmFyIG9sZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZ2Nzc1wiKTtcbiAgICAgICAgaWYgKG9sZCkge1xuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjYWxjUHJpY2UoZWw6IEhUTUxJbnB1dEVsZW1lbnQsIHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHZhciBpZCA9IE51bWJlcihlbC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICB2YXIgaXNQcm9kdWNlZEhlcmUgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdHkuY29tcGFuaWVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaXR5LmNvbXBhbmllc1t4XS5wcm9kdWN0aWQgPT09IGlkKVxuICAgICAgICAgICAgICAgIGlzUHJvZHVjZWRIZXJlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvZCA9IGFsbFByb2R1Y3RzW2lkXS5wcmljZVNlbGxpbmc7XG5cbiAgICAgICAgaWYgKGVsLmlkLmluZGV4T2YoXCJzZWxsXCIpID4gLTEpXG4gICAgICAgICAgICB2YWwgPSAtdmFsO1xuICAgICAgICB2YXIgcmV0ID0gYWxsUHJvZHVjdHNbaWRdLmNhbGNQcmljZSh0aGlzLmNpdHkucGVvcGxlLCB0aGlzLmNpdHkubWFya2V0W2lkXSAtIHZhbCwgaXNQcm9kdWNlZEhlcmUpO1xuICAgICAgICB2YXIgY29sb3IgPSBcImdyZWVuXCI7XG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogMiAvIDMpKVxuICAgICAgICAgICAgY29sb3IgPSBcIkxpZ2h0R3JlZW5cIjtcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiAyLjUgLyAzKSlcbiAgICAgICAgICAgIGNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqIDEpKVxuICAgICAgICAgICAgY29sb3IgPSBcIkxpZ2h0UGlua1wiO1xuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqIDQgLyAzKSlcbiAgICAgICAgICAgIGNvbG9yID0gXCJyZWRcIjtcbiAgICAgICAgKDxIVE1MRWxlbWVudD5lbC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bM10pLnN0eWxlLmJhY2tncm91bmQgPSBjb2xvcjtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXG4gICAgICAgIHZhciBzZG9tID0gYFxuICAgICAgICAgIDxkaXYgaGlkZGVuIGlkPVwiY2l0eWRpYWxvZ1wiIGNsYXNzPVwiY2l0eWRpYWxvZ1wiPlxuICAgICAgICAgICAgPGRpdj48L2Rpdj5cbiAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHRoaXMuZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcbiAgICAgICAgdmFyIG9sZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZ1wiKTtcbiAgICAgICAgaWYgKG9sZCkge1xuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyZWF0ZVN0eWxlKCk7XG5cbiAgICAgICAgdmFyIHByb2R1Y3RzID0gYWxsUHJvZHVjdHM7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjaXR5ID0gX3RoaXMuY2l0eTtcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiY2l0eWRpYWxvZy1wcmV2XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPFwiLz5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImNpdHlkaWFsb2ctbmV4dFwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIj5cIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy10YWJzXCI+XG4gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLW1hcmtldFwiIGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFiXCIgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5NYXJrZXQ8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1idWlsZGluZ3NcIiBpZD1cImNpdHlkaWFsb2ctYnVpbGRpbmdzLXRhYlwiIGNsYXNzPVwiY2l0eWRpYWxvZy10YWJzXCI+QnVpbGRpbmdzPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2NpdHlkaWFsb2ctd2FyZWhvdXNlXCIgaWQ9XCJjaXR5ZGlhbG9nLXdhcmVob3VzZS10YWJcIiAgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5gKyBJY29ucy53YXJlaG91c2UgKyBgIFdhcmVob3VzZTwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvblwiIGlkPVwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb24tdGFiXCIgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5Db25zdHJ1Y3Rpb248L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1zY29yZVwiIGlkPVwiY2l0eWRpYWxvZy1zY29yZS10YWJcIiAgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5TY29yZTwvYT48L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctbWFya2V0XCI+YCsgdGhpcy5jcmVhdGVNYXJrZXQoKSArIGBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy1idWlsZGluZ3NcIj4gYCsgdGhpcy5jcmVhdGVCdWlsZGluZ3MoKSArIGBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy13YXJlaG91c2VcIj5gKyB0aGlzLmNyZWF0ZVdhcmVob3VzZSgpICsgYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvblwiPmArIHRoaXMuY3JlYXRlQ29uc3RydWN0aW9uKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctc2NvcmVcIj5gKyB0aGlzLmNyZWF0ZVNjb3JlKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XG4gICAgICAgICQoXCIjY2l0eWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuXG4gICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICQoXCIjY2l0eWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgX3RoaXMuYmluZEFjdGlvbnMoKTsgfSwgNTAwKTtcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB9XG4gICAgY3JlYXRlTWFya2V0KCkge1xuICAgICAgICByZXR1cm4gYCA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiIHN0eWxlPVwid2lkdGg6NTVweFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk1hcmtldFwiPk1hcmtldDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5QcmljZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJ1eTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8c2VsZWN0IGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIgc3R5bGU9XCJ3aWR0aDo1MHB4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGxhY2Vob2xkZXJcIj5wbGFjZWhvbGRlcjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TZWxsPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmljZShpZDogc3RyaW5nLCBjaGFuZ2U6IG51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCArIFwiIFwiICsgY2hhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBjbGFzcz1cImNkbXNsaWRlclwiIGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtYnV5LXNsaWRlcl8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCIxMFwiIHN0ZXA9XCIxLjBcIiB2YWx1ZT1cIjBcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwib3ZlcmZsb3c6IGhpZGRlbjt3aWR0aDogNTAlO2hlaWdodDogNzAlO1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAvLydvbmlucHV0PVwidGhpcy5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MID0gdGhpcy52YWx1ZTsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJ3RoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzNdLmlubmVySFRNTD0xOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPicgKyBcIjxzcGFuPjA8L3NwYW4+PC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGlucHV0IGNsYXNzPVwiY2Rtc2xpZGVyXCIgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC1zZWxsLXNsaWRlcl8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCI1MDBcIiBzdGVwPVwiMS4wXCIgdmFsdWU9XCIwXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIm92ZXJmbG93OiBoaWRkZW47d2lkdGg6IDUwJTtoZWlnaHQ6IDcwJTtcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8nb25pbnB1dD1cInRoaXMubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IHRoaXMudmFsdWU7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAndGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bM10uaW5uZXJIVE1MPXZhbHVlOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPicgKyBcIjxzcGFuPjA8L3NwYW4+PC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+PC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5gO1xuICAgIH1cbiAgICBjcmVhdGVCdWlsZGluZ3MoKSB7XG4gICAgICAgIHJldHVybiBgPHRhYmxlIGlkPVwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Qcm9kdWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJ1aWxkaW5nczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkpvYnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OZWVkczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgNTsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPjxidXR0b24gaWQ9XCJuZXctZmFjdG9yeV8nICsgeCArICdcIj4nICsgXCIrXCIgKyBJY29ucy5mYWN0b3J5ICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gaWQ9XCJkZWxldGUtZmFjdG9yeV8nICsgeCArICdcIj4nICsgXCItXCIgKyBJY29ucy5mYWN0b3J5ICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gaWQ9XCJidXktbGljZW5zZV8nICsgeCArICdcIj4nICsgXCJidXkgbGljZW5zZSB0byBwcm9kdWNlIGZvciA1MC4wMDBcIiArIEljb25zLm1vbmV5ICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJuby13YXJlaG91c2VfJyArIHggKyAnXCI+bmVlZCBhIHdhcmVob3VzZSB0byBwcm9kdWNlPC9kaXY+JyArXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICc8L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgICAgICAgIDxiPnJlc2lkZW50aWFsIGJ1aWxkaW5nPC9iPlxuICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICBgKyBJY29ucy5ob21lICsgYCBob3VzZXM6IDxzcGFuIGlkPVwiaG91c2VzXCI+MC8wPC9zcGFuPiAgXG4gICAgICAgICAgICAgICAgICAgICAgICBgKyBJY29ucy5wZW9wbGUgKyBgIHJlbnRlcjogPHNwYW4gaWQ9XCJyZW50ZXJcIj4wLzA8L3NwYW4+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJidXktaG91c2VcIj4rYCsgSWNvbnMuaG9tZSArIGAgZm9yIDI1LjAwMGAgKyBJY29ucy5tb25leSArIFwiIDQweFwiICsgYWxsUHJvZHVjdHNbMF0uZ2V0SWNvbigpICtcbiAgICAgICAgICAgIFwiIDgweFwiICsgYWxsUHJvZHVjdHNbMV0uZ2V0SWNvbigpICsgYDwvYnV0dG9uPiBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkZWxldGUtaG91c2VcIj4tYCsgSWNvbnMuaG9tZSArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Yj5XYXJlaG91c2U8L2I+XG4gICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgIGArIEljb25zLndhcmVob3VzZSArIGAgaG91c2VzOiA8c3BhbiBpZD1cImNvdW50LXdhcmVob3VzZXNcIj4wLzA8L3NwYW4+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGAgKyBgIGNvc3RzOiA8c3BhbiBpZD1cImNvc3RzLXdhcmVob3VzZXNcIj4wPC9zcGFuPiBgICsgSWNvbnMubW9uZXkgKyBgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJidXktd2FyZWhvdXNlXCI+K2ArIEljb25zLmhvbWUgKyBgIGZvciAxNS4wMDBgICsgSWNvbnMubW9uZXkgKyBcIiAyMHhcIiArIGFsbFByb2R1Y3RzWzBdLmdldEljb24oKSArXG4gICAgICAgICAgICBcIiA0MHhcIiArIGFsbFByb2R1Y3RzWzFdLmdldEljb24oKSArIGA8L2J1dHRvbj4gXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiZGVsZXRlLXdhcmVob3VzZVwiPi1gKyBJY29ucy5ob21lICsgYDwvYnV0dG9uPmA7XG4gICAgfVxuICAgIGNyZWF0ZVdhcmVob3VzZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLXdhcmVob3VzZS10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TdG9jazwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlByb2R1Y2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OZWVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWluLVN0b2NrPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+U2VsbGluZyBwcmljZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD4wPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cIndhcmVob3VzZS1taW4tc3RvY2tcIiBpZD1cIndhcmVob3VzZS1taW4tc3RvY2tfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwid2FyZWhvdXNlLXNlbGxpbmctcHJpY2VcIiBpZD1cIndhcmVob3VzZS1zZWxsaW5nLXByaWNlXycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPHA+bnVtYmVyIG9mIHdhcmVob3VzZXMgPHNwYW4gaWQ9XCJjaXR5ZGlhbG9nLXdhcmVob3VzZS1jb3VudFwiPjxzcGFuPjwvcD5gO1xuICAgIH1cbiAgICBjcmVhdGVTY29yZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLXNjb3JlLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TY29yZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+YDtcbiAgICB9XG4gICAgY3JlYXRlQ29uc3RydWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYDx0YWJsZSBpZD1cImNpdHlkaWFsb2ctY29uc3RydWN0aW9uLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TW9kZWw8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TcGVlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkNhcGFjaXR5PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+RGFpbHkgQ29zdHM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5CdWlsZCBkYXlzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxBaXJwbGFuZVR5cGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbEFpcnBsYW5lVHlwZXNbeF0ubW9kZWwgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsQWlycGxhbmVUeXBlc1t4XS5zcGVlZCArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxBaXJwbGFuZVR5cGVzW3hdLmNhcGFjaXR5ICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbEFpcnBsYW5lVHlwZXNbeF0uY29zdHMgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsQWlycGxhbmVUeXBlc1t4XS5idWlsZERheXMgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgJzxidXR0b24gaWQ9XCJuZXctYWlycGxhbmVfJyArIHggKyAnXCI+JyArIFwiK1wiICsgSWNvbnMuYWlycGxhbmUgKyBcIiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBDaXR5LmdldEJ1aWxkaW5nQ29zdHNBc0ljb24oYWxsQWlycGxhbmVUeXBlc1t4XS5idWlsZGluZ0Nvc3RzLCBhbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkaW5nTWF0ZXJpYWwpICsgXCI8L2J1dHRvbj48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfSAgXG4gICAgICAgICAgICAgICAgPC90YWJsZT4gYDtcbiAgICB9XG4gICAgZ2V0U2xpZGVyVmFsdWUoZG9tOiBIVE1MSW5wdXRFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgdmFyIG1heFZhbHVlID0gcGFyc2VJbnQoZG9tLmdldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIpKTtcbiAgICAgICAgdmFyIHZhbCA9IHBhcnNlSW50KGRvbS52YWx1ZSk7XG4gICAgICAgIGlmKHZhbD09PTApXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgdmFyIGV4cCA9IE1hdGgucm91bmQobG9nKG1heFZhbHVlLCA0MCkgKiAxMDAwKSAvIDEwMDA7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKE1hdGgucG93KHZhbCwgZXhwKSk7XG4gICAgfVxuICAgIGJpbmRBY3Rpb25zKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXMuaW5kZXhPZihfdGhpcy5jaXR5KTtcbiAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgaWYgKHBvcyA+PSBfdGhpcy5jaXR5LndvcmxkLmNpdGllcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgICAgIF90aGlzLmNpdHkgPSBfdGhpcy5jaXR5LndvcmxkLmNpdGllc1twb3NdO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzLmluZGV4T2YoX3RoaXMuY2l0eSk7XG4gICAgICAgICAgICBwb3MtLTtcbiAgICAgICAgICAgIGlmIChwb3MgPT09IC0xKVxuICAgICAgICAgICAgICAgIHBvcyA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBfdGhpcy5jaXR5ID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXNbcG9zXTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5jaXR5ZGlhbG9nLXRhYnMnKS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtYnV5LXNsaWRlcl9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpO1xuICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IF90aGlzLmNhbGNQcmljZSh0LCB2YWwpO1xuICAgICAgICAgICAgICAgIHQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IFwiXCIgKyB2YWwgKyBcIiBcIiArIHZhbCAqIHByaWNlO1xuICAgICAgICAgICAgICAgIHQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzNdLmlubmVySFRNTCA9IFwiXCIgKyBwcmljZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1zZWxsLXNsaWRlcl9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpO1xuICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IF90aGlzLmNhbGNQcmljZSh0LCB2YWwpO1xuICAgICAgICAgICAgICAgIHQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IFwiXCIgKyB2YWwgKyBcIiBcIiArIHZhbCAqIHByaWNlO1xuICAgICAgICAgICAgICAgIHQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzNdLmlubmVySFRNTCA9IFwiXCIgKyBwcmljZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGluZWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1idXktc2xpZGVyX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpbmVkaXQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0O1xuICAgICAgICAgICAgICAgIGluZWRpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKHQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0c291cmNlOiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS1zb3VyY2VcIik7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpO1xuICAgICAgICAgICAgICAgIF90aGlzLnNlbGxPckJ1eShpZCwgdmFsLCBfdGhpcy5jYWxjUHJpY2UodCwgdmFsKSwgX3RoaXMuZ2V0U3RvcmUoKSwgc2VsZWN0c291cmNlLnZhbHVlID09PSBcIldhcmVob3VzZVwiKTtcbiAgICAgICAgICAgICAgICB0Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUwgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICB0LnZhbHVlID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgaW5lZGl0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1zZWxsLXNsaWRlcl9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5lZGl0KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcbiAgICAgICAgICAgICAgICBpbmVkaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5nZXRTbGlkZXJWYWx1ZSh0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIodC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rzb3VyY2U6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxsT3JCdXkoaWQsIC12YWwsIF90aGlzLmNhbGNQcmljZSh0LCB2YWwpLCBfdGhpcy5nZXRTdG9yZSgpLCBzZWxlY3Rzb3VyY2UudmFsdWUgPT09IFwiV2FyZWhvdXNlXCIpO1xuICAgICAgICAgICAgICAgIHQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IFwiMFwiO1xuICAgICAgICAgICAgICAgIHQudmFsdWUgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICBpbmVkaXQgPSBmYWxzZTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS1zb3VyY2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG5cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgNTsgeCsrKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkuaWQ7XG4gICAgICAgICAgICAgICAgaWYgKHNpZCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkucGFyZW50Tm9kZS5pZFxuICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcihzaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgY29tcCA9IF90aGlzLmNpdHkuY29tcGFuaWVzW2lkXTtcblxuICAgICAgICAgICAgICAgIF90aGlzLmNpdHkuY29tbWl0QnVpbGRpbmdDb3N0cyhjb21wLmdldEJ1aWxkaW5nQ29zdHMoKSwgY29tcC5nZXRCdWlsZGluZ01hdGVyaWFsKCksIFwiYnV5IGJ1aWxkaW5nXCIpO1xuICAgICAgICAgICAgICAgIGNvbXAud29ya2VycyArPSAyNTtcbiAgICAgICAgICAgICAgICBjb21wLmJ1aWxkaW5ncysrO1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIC8vYWxlcnQoXCJjcmVhdGUgeFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtZmFjdG9yeV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoc2lkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBfdGhpcy5jaXR5LmNvbXBhbmllc1tpZF07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXAuYnVpbGRpbmdzID4gMClcbiAgICAgICAgICAgICAgICAgICAgY29tcC5idWlsZGluZ3MtLTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcC53b3JrZXJzID4gY29tcC5idWlsZGluZ3MgKiAyNSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wLndvcmtlcnMgPSBjb21wLmJ1aWxkaW5ncyAqIDI1O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktbGljZW5zZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoc2lkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBfdGhpcy5jaXR5LmNvbXBhbmllc1tpZF07XG4gICAgICAgICAgICAgICAgX3RoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKDUwMDAwLCBbXSwgXCJidXkgbGljZW5jZVwiKTtcbiAgICAgICAgICAgICAgICBjb21wLmhhc0xpY2Vuc2UgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1ob3VzZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaXR5LmNvbW1pdEJ1aWxkaW5nQ29zdHMoMTUwMDAsIFsyMCwgNDBdLCBcImJ1eSBidWlsZGluZ1wiKTtcbiAgICAgICAgICAgIF90aGlzLmNpdHkuaG91c2VzKys7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWhvdXNlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuY2l0eS5ob3VzZXMgPT09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgX3RoaXMuY2l0eS5ob3VzZXMtLTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgaWYgKChfdGhpcy5jaXR5LnBlb3BsZSAtIDEwMDApID4gX3RoaXMuY2l0eS5ob3VzZXMgKiAxMDApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LnBlb3BsZSA9IDEwMDAgKyBfdGhpcy5jaXR5LmhvdXNlcyAqIDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVtb3ZlIHdvcmtlclwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LXdhcmVob3VzZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuXG4gICAgICAgICAgICBfdGhpcy5jaXR5LmNvbW1pdEJ1aWxkaW5nQ29zdHMoMjUwMDAsIFs0MCwgODBdLCBcImJ1eSBidWlsZGluZ1wiKTtcbiAgICAgICAgICAgIF90aGlzLmNpdHkud2FyZWhvdXNlcysrO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS13YXJlaG91c2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5jaXR5LndhcmVob3VzZXMgPT09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgX3RoaXMuY2l0eS53YXJlaG91c2VzLS07XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YXJlaG91c2UtbWluLXN0b2NrX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2l0eS53YXJlaG91c2VNaW5TdG9ja1tpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FyZWhvdXNlLXNlbGxpbmctcHJpY2VfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LndhcmVob3VzZU1pblN0b2NrW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxBaXJwbGFuZVR5cGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1haXJwbGFuZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChzaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5uZXdBaXJwbGFuZShpZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuICAgIG5ld0FpcnBsYW5lKHR5cGVpZDogbnVtYmVyKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF90aGlzLmNpdHkuY29tbWl0QnVpbGRpbmdDb3N0cyhhbGxBaXJwbGFuZVR5cGVzW3R5cGVpZF0uYnVpbGRpbmdDb3N0cywgYWxsQWlycGxhbmVUeXBlc1t0eXBlaWRdLmJ1aWxkaW5nTWF0ZXJpYWwsIFwiYnV5IGFpcnBsYW5lXCIpO1xuICAgICAgICB2YXIgbWF4TnVtYmVyPTE7XG4gICAgICAgIGZvcih2YXIgeD0wO3g8X3RoaXMuY2l0eS53b3JsZC5haXJwbGFuZXMubGVuZ3RoO3grKyl7XG4gICAgICAgICAgICB2YXIgdGVzdD1fdGhpcy5jaXR5LndvcmxkLmFpcnBsYW5lc1t4XTtcbiAgICAgICAgICAgIHZhciBwb3M9dGVzdC5uYW1lLmluZGV4T2YoYWxsQWlycGxhbmVUeXBlc1t0eXBlaWRdLm1vZGVsKTtcbiAgICAgICAgICAgIHZhciBucj1wYXJzZUludCh0ZXN0Lm5hbWUuc3Vic3RyaW5nKHRlc3QubmFtZS5sZW5ndGgrcG9zKSk7XG4gICAgICAgICAgICBpZihuciE9PU5hTiYmbnI+bWF4TnVtYmVyIClcbiAgICAgICAgICAgICAgICBtYXhOdW1iZXI9bnI7XG4gICAgICAgIH1cbiAgICAgICAgbWF4TnVtYmVyKys7XG4gICAgICAgIHZhciBhcCA9IG5ldyBBaXJwbGFuZShfdGhpcy5jaXR5LndvcmxkKTtcbiAgICAgICAgYXAuc3BlZWQgPSAyMDA7XG4gICAgICAgIGFwLnggPSBfdGhpcy5jaXR5Lng7XG4gICAgICAgIGFwLnkgPSBfdGhpcy5jaXR5Lnk7XG4gICAgICAgIGFwLndvcmxkID0gX3RoaXMuY2l0eS53b3JsZDtcbiAgICAgICAgYXAudHlwZWlkPXR5cGVpZDtcbiAgICAgICAgYXAubmFtZSA9IGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS5tb2RlbCsgbWF4TnVtYmVyO1xuICAgICAgICBhcC5zcGVlZCA9IGFsbEFpcnBsYW5lVHlwZXNbdHlwZWlkXS5zcGVlZDtcbiAgICAgICAgYXAuY29zdHMgPSBhbGxBaXJwbGFuZVR5cGVzW3R5cGVpZF0uY29zdHM7XG4gICAgICAgIGFwLmNhcGFjaXR5ID0gYWxsQWlycGxhbmVUeXBlc1t0eXBlaWRdLmNhcGFjaXR5O1xuICAgICAgICBfdGhpcy5jaXR5LndvcmxkLmFpcnBsYW5lcy5wdXNoKGFwKTtcbiAgICAgICAgdGhpcy5jaXR5LmFpcnBsYW5lc0luQ2l0eS5wdXNoKF90aGlzLmNpdHkud29ybGQuYWlycGxhbmVzLmluZGV4T2YoYXApKTtcbiAgICAgICAgYXAucmVuZGVyKCk7XG4gICAgICAgIF90aGlzLmNpdHkud29ybGQuZG9tLmFwcGVuZENoaWxkKGFwLmRvbSk7XG4gICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICB9XG4gICAgc2VsbE9yQnV5KHByb2R1Y3RpZCwgYW1vdW50OiBudW1iZXIsIHByaWNlOiBudW1iZXIsIHN0b3JldGFyZ2V0OiBudW1iZXJbXSwgaXNXYXJlaG91c2U6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKGlzV2FyZWhvdXNlKSB7XG4gICAgICAgICAgICB0aGlzLmNpdHkud2FyZWhvdXNlW3Byb2R1Y3RpZF0gLT0gYW1vdW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaXR5LndvcmxkLmdhbWUuY2hhbmdlTW9uZXkoLWFtb3VudCAqIHByaWNlLCBcInNlbGwgb3IgYnV5IGZyb20gbWFya2V0XCIsIHRoaXMuY2l0eSk7XG4gICAgICAgICAgICB0aGlzLmNpdHkubWFya2V0W3Byb2R1Y3RpZF0gLT0gYW1vdW50O1xuICAgICAgICB9XG4gICAgICAgIHN0b3JldGFyZ2V0W3Byb2R1Y3RpZF0gKz0gYW1vdW50O1xuICAgICAgICB0aGlzLmdldEFpcnBsYW5lSW5NYXJrZXQoKT8ucmVmcmVzaExvYWRlZENvdW50KCk7XG4gICAgICAgIHRoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICB0aGlzLmNpdHkud29ybGQuZ2FtZS51cGRhdGVUaXRsZSgpO1xuICAgIH1cbiAgICBnZXRBaXJwbGFuZUluTWFya2V0KCl7XG4gICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIik7XG4gICAgICAgIHZhciB2YWwgPSBzZWxlY3QudmFsdWU7XG4gICAgICAgIGlmKHZhbCl7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXR5LndvcmxkLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IHRoaXMuY2l0eS53b3JsZC5haXJwbGFuZXNbeF0ubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2l0eS53b3JsZC5haXJwbGFuZXNbeF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZ2V0U3RvcmUoKSB7XG4gICAgICAgIHZhciBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKTtcbiAgICAgICAgdmFyIHZhbCA9IHNlbGVjdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS53YXJlaG91c2VzID4gMCAmJiB2YWwgPT09IFwiV2FyZWhvdXNlXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaXR5LndhcmVob3VzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFpcnBsYW5lSW5NYXJrZXQoKT8ucHJvZHVjdHM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdXBkYXRlTWFya2V0KCkge1xuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIik7XG4gICAgICAgIHZhciBzZWxlY3Rzb3VyY2U6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiKTtcbiAgICAgICAgdmFyIGxhc3QgPSBzZWxlY3QudmFsdWU7XG4gICAgICAgIHNlbGVjdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBpZiAodGhpcy5jaXR5LndhcmVob3VzZXMgPiAwKSB7XG4gICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgICAgICBvcHQudmFsdWUgPSBcIldhcmVob3VzZVwiO1xuICAgICAgICAgICAgb3B0LnRleHQgPSBvcHQudmFsdWU7XG4gICAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICAgICAgICAgIGlmIChzZWxlY3Rzb3VyY2UuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICAgICAgICAgIG9wdC52YWx1ZSA9IFwiV2FyZWhvdXNlXCI7XG4gICAgICAgICAgICAgICAgb3B0LnRleHQgPSBvcHQudmFsdWU7XG4gICAgICAgICAgICAgICAgc2VsZWN0c291cmNlLmFwcGVuZENoaWxkKG9wdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0c291cmNlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHNlbGVjdHNvdXJjZS5yZW1vdmVDaGlsZChzZWxlY3Rzb3VyY2UuY2hpbGRyZW5bMV0pO1xuICAgICAgICAgICAgICAgIHNlbGVjdHNvdXJjZS52YWx1ZSA9IFwiTWFya2V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdHkuYWlycGxhbmVzSW5DaXR5Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgICAgICBvcHQudmFsdWUgPSB0aGlzLmNpdHkud29ybGQuYWlycGxhbmVzW3RoaXMuY2l0eS5haXJwbGFuZXNJbkNpdHlbeF1dLm5hbWU7XG4gICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxhc3QgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHNlbGVjdC52YWx1ZSA9IGxhc3Q7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5pY29uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPm1hcmtldDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmJ1eTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmFpcnBsYW5lMTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPnNlbGw8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5wcmljZTwvdGg+XG4gICAgICAgICovXG4gICAgICAgIHZhciBzdG9yZXRhcmdldCA9IHRoaXMuZ2V0U3RvcmUoKTtcbiAgICAgICAgdmFyIHN0b3Jlc291cmNlID0gdGhpcy5jaXR5Lm1hcmtldDtcbiAgICAgICAgaWYgKHNlbGVjdHNvdXJjZS52YWx1ZSA9PT0gXCJXYXJlaG91c2VcIikge1xuICAgICAgICAgICAgc3RvcmVzb3VyY2UgPSB0aGlzLmNpdHkud2FyZWhvdXNlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG5cbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzJdLmlubmVySFRNTCA9IHN0b3Jlc291cmNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblszXS5pbm5lckhUTUwgPSAoc2VsZWN0c291cmNlLnZhbHVlID09PSBcIldhcmVob3VzZVwiID8gXCJcIiA6IHRoaXMuY2FsY1ByaWNlKDxhbnk+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0sIDApLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdKS5tYXggPSBzdG9yZXNvdXJjZVt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKHN0b3JldGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG1heD1zdG9yZXNvdXJjZVt4XTtcbiAgICAgICAgICAgICAgICB2YXIgdGVzdGFwPXRoaXMuZ2V0QWlycGxhbmVJbk1hcmtldCgpO1xuICAgICAgICAgICAgICAgIGlmKHRlc3RhcClcbiAgICAgICAgICAgICAgICAgICAgbWF4PU1hdGgubWluKG1heCx0ZXN0YXAuY2FwYWNpdHktdGVzdGFwLmxvYWRlZENvdW50KTtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0pLnJlYWRPbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzZdLmNoaWxkcmVuWzBdKS5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls0XS5jaGlsZHJlblswXSkubWF4ID0gXCI0MFwiOy8vc3RvcmVzb3VyY2VbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0pLnNldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIsIG1heC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB0ci5jaGlsZHJlbls1XS5pbm5lckhUTUwgPSBzdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls2XS5jaGlsZHJlblswXSkubWF4ID0gXCI0MFwiOy8vc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLnNldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIsIHN0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0pLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0ci5jaGlsZHJlbls1XS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls0XS5jaGlsZHJlblswXSkubWF4ID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzZdLmNoaWxkcmVuWzBdKS5tYXggPSBcIjBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgdXBkYXRlQnVpbGRpbmdzKCkge1xuICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5wcm9kdWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+YnVpbGRpbmdzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmpvYnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmVlZHM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmNvc3RzIG5ldyBidWlsZGluZzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5hY3Rpb25zPC90aD5cbiAgICAgICAgICAgICAgICovXG4gICAgICAgIHZhciBjb21wYW5pZXMgPSB0aGlzLmNpdHkuY29tcGFuaWVzO1xuICAgICAgICB2YXIgYWxsID0gYWxsUHJvZHVjdHM7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY29tcGFuaWVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IGNvbXBhbmllc1t4XTtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG4gICAgICAgICAgICB2YXIgcHJvZHVjdCA9IGFsbFtjb21wLnByb2R1Y3RpZF07XG4gICAgICAgICAgICB2YXIgcHJvZHVjZSA9IGNvbXAuZ2V0RGFpbHlQcm9kdWNlKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblswXS5pbm5lckhUTUwgPSBwcm9kdWNlICsgXCIgXCIgKyBwcm9kdWN0LmdldEljb24oKTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzFdLmlubmVySFRNTCA9IHByb2R1Y3QubmFtZTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzJdLmlubmVySFRNTCA9IGNvbXAuYnVpbGRpbmdzLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblszXS5pbm5lckhUTUwgPSBjb21wLndvcmtlcnMgKyBcIi9cIiArIGNvbXAuZ2V0TWF4V29ya2VycygpO1xuICAgICAgICAgICAgdmFyIG5lZWRzMSA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgbmVlZHMyID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChwcm9kdWN0LmlucHV0MSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIG5lZWRzMSA9IFwiXCIgKyBjb21wLmdldERhaWx5SW5wdXQxKCkgKyBcIjxici8+XCIgKyBhbGxbcHJvZHVjdC5pbnB1dDFdLmdldEljb24oKSArIFwiIFwiO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bNF0uaW5uZXJIVE1MID0gbmVlZHMxO1xuICAgICAgICAgICAgaWYgKHByb2R1Y3QuaW5wdXQyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgbmVlZHMyID0gbmVlZHMyICsgXCJcIiArIGNvbXAuZ2V0RGFpbHlJbnB1dDIoKSArIFwiPGJyLz5cIiArIGFsbFtwcm9kdWN0LmlucHV0Ml0uZ2V0SWNvbigpO1xuICAgICAgICAgICAgLy8gdHIuY2hpbGRyZW5bNV0uaW5uZXJIVE1MID0gQ2l0eS5nZXRCdWlsZGluZ0Nvc3RzQXNJY29uKGNvbXAuZ2V0QnVpbGRpbmdDb3N0cygpLCBjb21wLmdldEJ1aWxkaW5nTWF0ZXJpYWwoKSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmIChjb21wLmhhc0xpY2Vuc2UpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS53YXJlaG91c2VzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby13YXJlaG91c2VfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm8td2FyZWhvdXNlX1wiICsgeCkuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29tcC5oYXNMaWNlbnNlICYmIHRoaXMuY2l0eS53YXJlaG91c2VzID4gMCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5pbm5lckhUTUwgPSBcIitcIiArIEljb25zLmZhY3RvcnkgK1xuICAgICAgICAgICAgICAgICAgICBDaXR5LmdldEJ1aWxkaW5nQ29zdHNBc0ljb24oY29tcC5nZXRCdWlsZGluZ0Nvc3RzKCksIGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWZhY3RvcnlfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtZmFjdG9yeV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLCBcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtYXQgPSBjb21wLmdldEJ1aWxkaW5nTWF0ZXJpYWwoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNpdHkuY2FuQnVpbGQoY29tcC5nZXRCdWlsZGluZ0Nvc3RzKCksIGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpKSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy5jaXR5LndvcmxkLmdhbWUuZ2V0TW9uZXkoKSA8IGNvbXAuZ2V0QnVpbGRpbmdDb3N0cygpIHx8IHRoaXMuY2l0eS5tYXJrZXRbMF0gPCBtYXRbMF0gfHwgdGhpcy5jaXR5Lm1hcmtldFsxXSA8IG1hdFsxXSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgXCJub3QgYWxsIGJ1aWxkaW5nIGNvc3RzIGFyZSBhdmFpbGFibGVcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwidGl0bGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaXR5LmNhbkJ1aWxkKDUwMDAwLCBbXSkgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY291bnQtd2FyZWhvdXNlc1wiKS5pbm5lckhUTUwgPSBcIlwiICsgdGhpcy5jaXR5LndhcmVob3VzZXM7XG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob3VzZXNcIikuaW5uZXJIVE1MID0gXCJcIiArICh0aGlzLmNpdHkuaG91c2VzICsgXCIvXCIgKyB0aGlzLmNpdHkuaG91c2VzKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZW50ZXJcIikuaW5uZXJIVE1MID0gXCJcIiArICh0aGlzLmNpdHkucGVvcGxlIC0gMTAwMCArIFwiL1wiICsgdGhpcy5jaXR5LmhvdXNlcyAqIDEwMCk7XG4gICAgICAgIGlmICh0aGlzLmNpdHkuY2FuQnVpbGQoMjUwMDAsIFs0MCwgODBdKSAhPT0gXCJcIikge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktaG91c2VcIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1ob3VzZVwiKS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaXR5LmNhbkJ1aWxkKDE1MDAwLCBbMjAsIDQwXSkgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LXdhcmVob3VzZVwiKS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LXdhcmVob3VzZVwiKS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNpdHkuaG91c2VzID09PSAwKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1ob3VzZVwiKS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWhvdXNlXCIpLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICB9XG5cblxuICAgIH1cbiAgICB1cGRhdGVXYXJlaG91c2UoKSB7XG4gICAgICAgIHZhciBuZWVkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBuZWVkcy5wdXNoKDApO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaXR5LmNvbXBhbmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRlc3QgPSBhbGxQcm9kdWN0c1t0aGlzLmNpdHkuY29tcGFuaWVzW2ldLnByb2R1Y3RpZF07XG4gICAgICAgICAgICBpZiAodGVzdC5pbnB1dDEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5lZWRzW3Rlc3QuaW5wdXQxXSArPSAoTWF0aC5yb3VuZCh0aGlzLmNpdHkuY29tcGFuaWVzW2ldLndvcmtlcnMgKiB0ZXN0LmlucHV0MUFtb3VudCAvIDI1KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGVzdC5pbnB1dDIgPT09IHgpIHtcbiAgICAgICAgICAgICAgICBuZWVkc1t0ZXN0LmlucHV0Ml0gKz0gKE1hdGgucm91bmQodGhpcy5jaXR5LmNvbXBhbmllc1tpXS53b3JrZXJzICogdGVzdC5pbnB1dDJBbW91bnQgLyAyNSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy13YXJlaG91c2UtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG5cbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzJdLmlubmVySFRNTCA9IHRoaXMuY2l0eS53YXJlaG91c2VbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHZhciBwcm9kID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBwcm9kdWN0ID0gYWxsUHJvZHVjdHNbeF07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2l0eS5jb21wYW5pZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaXR5LmNvbXBhbmllc1tpXS5wcm9kdWN0aWQgPT09IHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZCA9IE1hdGgucm91bmQodGhpcy5jaXR5LmNvbXBhbmllc1tpXS53b3JrZXJzICogcHJvZHVjdC5kYWlseVByb2R1Y2UgLyAyNSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ci5jaGlsZHJlblszXS5pbm5lckhUTUwgPSBwcm9kO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bNF0uaW5uZXJIVE1MID0gbmVlZHNbeF0gPT09IDAgPyBcIlwiIDogbmVlZHNbeF07XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdHIuY2hpbGRyZW5bNV0uY2hpbGRyZW5bMF0pXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzVdLmNoaWxkcmVuWzBdKS52YWx1ZSA9IHRoaXMuY2l0eS53YXJlaG91c2VNaW5TdG9ja1t4XSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHRoaXMuY2l0eS53YXJlaG91c2VNaW5TdG9ja1t4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRyLmNoaWxkcmVuWzZdLmNoaWxkcmVuWzBdKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls2XS5jaGlsZHJlblswXSkudmFsdWUgPSB0aGlzLmNpdHkud2FyZWhvdXNlU2VsbGluZ1ByaWNlW3hdID09PSB1bmRlZmluZWQgPyBcIlwiIDogdGhpcy5jaXR5LndhcmVob3VzZVNlbGxpbmdQcmljZVt4XS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXdhcmVob3VzZS1jb3VudFwiKS5pbm5lckhUTUwgPSBcIlwiICsgdGhpcy5jaXR5LndhcmVob3VzZXM7XG4gICAgIFxuICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvc3RzLXdhcmVob3VzZXNcIikuaW5uZXJIVE1MPVwiXCIrKHRoaXMuY2l0eS53YXJlaG91c2VzKjUwKTtcbiAgICB9XG4gICAgdXBkYXRlQ29uc3RydWN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbEFpcnBsYW5lVHlwZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNpdHkuY2FuQnVpbGQoYWxsQWlycGxhbmVUeXBlc1t4XS5idWlsZGluZ0Nvc3RzLCBhbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkaW5nTWF0ZXJpYWwpID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctYWlycGxhbmVfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctYWlycGxhbmVfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZVNjb3JlKCkge1xuXG4gICAgICAgIC8vc2NvcmVcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNjb3JlLXRhYmxlXCIpO1xuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bMl0uaW5uZXJIVE1MID0gdGhpcy5jaXR5LnNjb3JlW3hdICsgXCI8L3RkPlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZShmb3JjZSA9IGZhbHNlKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNpdHkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoISQodGhpcy5kb20pLmRpYWxvZygnaXNPcGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlVGl0bGUoKTtcbiAgICAgICAgLy9wYXVzZSBnYW1lIHdoaWxlIHRyYWRpbmdcbiAgICAgICAgaWYgKCFmb3JjZSkge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIikpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2l0eS53b3JsZC5nYW1lLmlzUGF1c2VkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNQYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNpdHkud29ybGQuZ2FtZS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47Ly8vbm8gdXBkYXRlIGJlY2F1c2Ugb2Ygc2xpZGVyXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc1BhdXNlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNpdHkud29ybGQuZ2FtZS5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYlwiKT8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0Py5jb250YWlucyhcInVpLXRhYnMtYWN0aXZlXCIpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVNYXJrZXQoKTtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIikpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1aWxkaW5ncygpO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXdhcmVob3VzZS10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKSlcbiAgICAgICAgICAgIHRoaXMudXBkYXRlV2FyZWhvdXNlKCk7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctY29uc3RydWN0aW9uLXRhYlwiKT8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0Py5jb250YWlucyhcInVpLXRhYnMtYWN0aXZlXCIpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVDb25zdHJ1Y3Rpb24oKTtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1zY29yZS10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKSlcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHVwZGF0ZVRpdGxlKCkge1xuICAgICAgICB2YXIgc2ljb24gPSAnJztcbiAgICAgICAgaWYgKCQodGhpcy5kb20pLnBhcmVudCgpLmZpbmQoJy51aS1kaWFsb2ctdGl0bGUnKS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpWzBdLmlubmVySFRNTCA9ICc8aW1nIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0XCIgaWQ9XCJjaXR5ZGlhbG9nLWljb25cIiBzcmM9XCInICsgdGhpcy5jaXR5Lmljb24gK1xuICAgICAgICAgICAgICAgICdcIiAgaGVpZ2h0PVwiMTVcIj48L2ltZz4gJyArIHRoaXMuY2l0eS5uYW1lICsgXCIgXCIgKyB0aGlzLmNpdHkucGVvcGxlICsgXCIgXCIgKyBJY29ucy5wZW9wbGU7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XG4gICAgICAgICAgICB3aWR0aDogXCI0NTBweFwiLFxuICAgICAgICAgICAgLy8gcG9zaXRpb246IHsgbXk6IFwibGVmdCB0b3BcIiwgYXQ6IFwicmlnaHQgdG9wXCIsIG9mOiAkKEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuZG9tKSB9LFxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKGV2LCBldjIpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuaGFzUGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNpdHkud29ybGQuZ2FtZS5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xuXG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICB9XG59Il19