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
                    <li><a href="#citydialog-market" id="citydialog-market-tab" class="citydialog-market-tabs">Market</a></li>
                    <li><a href="#citydialog-buildings" class="citydialog-market-tabs">Buildings</a></li>
                    <li><a href="#citydialog-warehouse" class="citydialog-market-tabs">` + icons_1.Icons.warehouse + ` Warehouse</a></li>
                    <li><a href="#citydialog-construction" class="citydialog-construction-tabs">Construction</a></li>
                    <li><a href="#citydialog-score" class="citydialog-market-tabs">Score</a></li>
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
            $('.citydialog-market-tabs').click(function (event) {
                _this.update();
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
        }
        sellOrBuy(productid, amount, price, storetarget, isWarehouse) {
            if (isWarehouse) {
                this.city.warehouse[productid] -= amount;
            }
            else {
                this.city.world.game.changeMoney(-amount * price, "sell or buy from market", this.city);
                this.city.market[productid] -= amount;
            }
            storetarget[productid] += amount;
            this.update(true);
            this.city.world.game.updateTitle();
        }
        getStore() {
            var select = document.getElementById("citydialog-market-table-target");
            var val = select.value;
            if (val) {
                if (this.city.warehouses > 0 && val === "Warehouse") {
                    return this.city.warehouse;
                }
                for (var x = 0; x < this.city.world.airplanes.length; x++) {
                    if (val === this.city.world.airplanes[x].name)
                        return this.city.world.airplanes[x].products;
                }
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
                opt.value = this.city.airplanesInCity[x].name;
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
                    tr.children[4].children[0].readOnly = false;
                    tr.children[6].children[0].readOnly = false;
                    tr.children[4].children[0].max = "40"; //storesource[x].toString();
                    tr.children[4].children[0].setAttribute("maxValue", storesource[x].toString());
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
            document.getElementById("count-warehouses").innerHTML = "" + this.city.warehouses;
            // document.getElementById("costs-warehouses").innerHTML=""+(this.city.warehouses*50);
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
            var _a, _b, _c;
            if (!this.city)
                return;
            try {
                if (!$(this.dom).dialog('isOpen')) {
                    return;
                }
            }
            catch (_d) {
                return;
            }
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
            this.updateMarket();
            this.updateBuildings();
            this.updateWarehouse();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBS0EsSUFBSSxHQUFHLEdBQUc7Ozs7Ozs7Ozs7Ozs7Q0FhVCxDQUFDO0lBQ0YsWUFBWTtJQUNaLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDVixPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDekMsQ0FBQyxDQUFBO0lBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNQLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxVQUFVLENBQUMsRUFBRSxJQUFJO1lBQ3BCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDTCxNQUFhLFVBQVU7UUFLbkI7WUFGQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBR2QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksVUFBVSxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNqQyxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDM0MsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQy9CLENBQUM7UUFDTyxXQUFXO1lBQ2YsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxLQUFLLENBQUMsRUFBRSxHQUFHLGVBQWUsQ0FBQztZQUMzQixLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztZQUN4QixLQUFLLENBQUMsU0FBUyxHQUFH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QUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQzdDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQSw0QkFBNEI7b0JBQ25FLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0JBQ25HLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDbEMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFBLDRCQUE0QjtvQkFDbkUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztpQkFDdEc7cUJBQU07b0JBQ2dCLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQzVDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQy9ELEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztvQkFDWCxFQUFFLENBQUMsUUFB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RUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRCxDQUFDO1FBQ0QsS0FBSztZQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FDSjtJQTl1QkQsZ0NBOHVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XG5pbXBvcnQgeyBhbGxQcm9kdWN0cywgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcbmltcG9ydCB7IEFpcnBsYW5lLCBhbGxBaXJwbGFuZVR5cGVzIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcbmltcG9ydCB7IEFpcnBsYW5lRGlhbG9nIH0gZnJvbSBcImdhbWUvYWlycGxhbmVkaWFsb2dcIjtcbnZhciBjc3MgPSBgXG4gICAgdGFibGV7XG4gICAgICAgIGZvbnQtc2l6ZTppbmhlcml0O1xuICAgIH1cbiAgICAuY2l0eWRpYWxvZyA+KntcbiAgICAgICAgZm9udC1zaXplOjEwcHg7XG4gICAgfVxuICAgIC51aS1kaWFsb2ctdGl0bGV7XG4gICAgICAgIGZvbnQtc2l6ZToxMHB4O1xuICAgIH1cbiAgICAudWktZGlhbG9nLXRpdGxlYmFye1xuICAgICAgICBoZWlnaHQ6MTBweDtcbiAgICB9IFxuYDtcbi8vQHRzLWlnbm9yZVxud2luZG93LmNpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xufVxudmFyIGxvZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvZyA9IE1hdGgubG9nO1xuICAgIHJldHVybiBmdW5jdGlvbiAobiwgYmFzZSkge1xuICAgICAgICByZXR1cm4gbG9nKG4pIC8gKGJhc2UgPyBsb2coYmFzZSkgOiAxKTtcbiAgICB9O1xufSkoKTtcbmV4cG9ydCBjbGFzcyBDaXR5RGlhbG9nIHtcbiAgICBkb206IEhUTUxEaXZFbGVtZW50O1xuICAgIGNpdHk6IENpdHk7XG4gICAgaGFzUGF1c2VkID0gZmFsc2U7XG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcbiAgICB9XG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IENpdHlEaWFsb2cge1xuICAgICAgICBpZiAoQ2l0eURpYWxvZy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgQ2l0eURpYWxvZy5pbnN0YW5jZSA9IG5ldyBDaXR5RGlhbG9nKCk7XG4gICAgICAgIHJldHVybiBDaXR5RGlhbG9nLmluc3RhbmNlO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVN0eWxlKCkge1xuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pZCA9IFwiY2l0eWRpYWxvZ2Nzc1wiO1xuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gY3NzO1xuXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2djc3NcIik7XG4gICAgICAgIGlmIChvbGQpIHtcbiAgICAgICAgICAgIG9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZCk7XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICAgIHByaXZhdGUgY2FsY1ByaWNlKGVsOiBIVE1MSW5wdXRFbGVtZW50LCB2YWw6IG51bWJlcikge1xuICAgICAgICB2YXIgaWQgPSBOdW1iZXIoZWwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgdmFyIGlzUHJvZHVjZWRIZXJlID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXR5LmNvbXBhbmllcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5jb21wYW5pZXNbeF0ucHJvZHVjdGlkID09PSBpZClcbiAgICAgICAgICAgICAgICBpc1Byb2R1Y2VkSGVyZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb2QgPSBhbGxQcm9kdWN0c1tpZF0ucHJpY2VTZWxsaW5nO1xuXG4gICAgICAgIGlmIChlbC5pZC5pbmRleE9mKFwic2VsbFwiKSA+IC0xKVxuICAgICAgICAgICAgdmFsID0gLXZhbDtcbiAgICAgICAgdmFyIHJldCA9IGFsbFByb2R1Y3RzW2lkXS5jYWxjUHJpY2UodGhpcy5jaXR5LnBlb3BsZSwgdGhpcy5jaXR5Lm1hcmtldFtpZF0gLSB2YWwsIGlzUHJvZHVjZWRIZXJlKTtcbiAgICAgICAgdmFyIGNvbG9yID0gXCJncmVlblwiO1xuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqIDIgLyAzKSlcbiAgICAgICAgICAgIGNvbG9yID0gXCJMaWdodEdyZWVuXCI7XG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogMi41IC8gMykpXG4gICAgICAgICAgICBjb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiAxKSlcbiAgICAgICAgICAgIGNvbG9yID0gXCJMaWdodFBpbmtcIjtcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiA0IC8gMykpXG4gICAgICAgICAgICBjb2xvciA9IFwicmVkXCI7XG4gICAgICAgICg8SFRNTEVsZW1lbnQ+ZWwucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzNdKS5zdHlsZS5iYWNrZ3JvdW5kID0gY29sb3I7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xuICAgICAgICAvL3RlbXBsYXRlIGZvciBjb2RlIHJlbG9hZGluZ1xuICAgICAgICB2YXIgc2RvbSA9IGBcbiAgICAgICAgICA8ZGl2IGhpZGRlbiBpZD1cImNpdHlkaWFsb2dcIiBjbGFzcz1cImNpdHlkaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2dcIik7XG4gICAgICAgIGlmIChvbGQpIHtcbiAgICAgICAgICAgIG9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcmVhdGVTdHlsZSgpO1xuXG4gICAgICAgIHZhciBwcm9kdWN0cyA9IGFsbFByb2R1Y3RzO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY2l0eT1fdGhpcy5jaXR5O1xuICAgICAgICB2YXIgc2RvbSA9IGBcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJjaXR5ZGlhbG9nLXByZXZcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI8XCIvPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiY2l0eWRpYWxvZy1uZXh0XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPlwiLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLXRhYnNcIj5cbiAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2NpdHlkaWFsb2ctbWFya2V0XCIgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC10YWJcIiBjbGFzcz1cImNpdHlkaWFsb2ctbWFya2V0LXRhYnNcIj5NYXJrZXQ8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1idWlsZGluZ3NcIiBjbGFzcz1cImNpdHlkaWFsb2ctbWFya2V0LXRhYnNcIj5CdWlsZGluZ3M8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy13YXJlaG91c2VcIiBjbGFzcz1cImNpdHlkaWFsb2ctbWFya2V0LXRhYnNcIj5gKyBJY29ucy53YXJlaG91c2UgKyBgIFdhcmVob3VzZTwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvblwiIGNsYXNzPVwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb24tdGFic1wiPkNvbnN0cnVjdGlvbjwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLXNjb3JlXCIgY2xhc3M9XCJjaXR5ZGlhbG9nLW1hcmtldC10YWJzXCI+U2NvcmU8L2E+PC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldFwiPmArdGhpcy5jcmVhdGVNYXJrZXQoKStgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctYnVpbGRpbmdzXCI+IGArdGhpcy5jcmVhdGVCdWlsZGluZ3MoKStgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctd2FyZWhvdXNlXCI+YCt0aGlzLmNyZWF0ZVdhcmVob3VzZSgpK2BcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb25cIj5gK3RoaXMuY3JlYXRlQ29uc3RydWN0aW9uKCkrYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLXNjb3JlXCI+YCt0aGlzLmNyZWF0ZVNjb3JlKCkrYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB2YXIgbmV3ZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20uY2hpbGRyZW5bMF0pO1xuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdkb20pO1xuICAgICAgICAkKFwiI2NpdHlkaWFsb2ctdGFic1wiKS50YWJzKHtcblxuICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkKFwiI2NpdHlkaWFsb2ctdGFic1wiKS50YWJzKHtcbiAgICAgICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcblxuICAgICAgICAvLyAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIilcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IF90aGlzLmJpbmRBY3Rpb25zKCk7IH0sIDUwMCk7XG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgfVxuICAgIGNyZWF0ZU1hcmtldCgpe1xuICAgICAgICByZXR1cm4gYCA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiIHN0eWxlPVwid2lkdGg6NTVweFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk1hcmtldFwiPk1hcmtldDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5QcmljZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJ1eTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8c2VsZWN0IGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIgc3R5bGU9XCJ3aWR0aDo1MHB4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGxhY2Vob2xkZXJcIj5wbGFjZWhvbGRlcjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TZWxsPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmljZShpZDogc3RyaW5nLCBjaGFuZ2U6IG51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCArIFwiIFwiICsgY2hhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBjbGFzcz1cImNkbXNsaWRlclwiIGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtYnV5LXNsaWRlcl8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCIxMFwiIHN0ZXA9XCIxLjBcIiB2YWx1ZT1cIjBcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwib3ZlcmZsb3c6IGhpZGRlbjt3aWR0aDogNTAlO2hlaWdodDogNzAlO1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAvLydvbmlucHV0PVwidGhpcy5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MID0gdGhpcy52YWx1ZTsnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJ3RoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzNdLmlubmVySFRNTD0xOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPicgKyBcIjxzcGFuPjA8L3NwYW4+PC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGlucHV0IGNsYXNzPVwiY2Rtc2xpZGVyXCIgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC1zZWxsLXNsaWRlcl8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCI1MDBcIiBzdGVwPVwiMS4wXCIgdmFsdWU9XCIwXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIm92ZXJmbG93OiBoaWRkZW47d2lkdGg6IDUwJTtoZWlnaHQ6IDcwJTtcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8nb25pbnB1dD1cInRoaXMubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IHRoaXMudmFsdWU7JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAndGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bM10uaW5uZXJIVE1MPXZhbHVlOycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPicgKyBcIjxzcGFuPjA8L3NwYW4+PC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+PC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5gO1xuICAgIH1cbiAgICBjcmVhdGVCdWlsZGluZ3MoKXtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLWJ1aWxkaW5ncy10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlByb2R1Y2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4gPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QnVpbGRpbmdzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+Sm9iczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5lZWRzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QWN0aW9uczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCA1OyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+PGJ1dHRvbiBpZD1cIm5ldy1mYWN0b3J5XycgKyB4ICsgJ1wiPicgKyBcIitcIiArIEljb25zLmZhY3RvcnkgKyAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiBpZD1cImRlbGV0ZS1mYWN0b3J5XycgKyB4ICsgJ1wiPicgKyBcIi1cIiArIEljb25zLmZhY3RvcnkgKyAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiBpZD1cImJ1eS1saWNlbnNlXycgKyB4ICsgJ1wiPicgKyBcImJ1eSBsaWNlbnNlIHRvIHByb2R1Y2UgZm9yIDUwLjAwMFwiICsgSWNvbnMubW9uZXkgKyAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cIm5vLXdhcmVob3VzZV8nICsgeCArICdcIj5uZWVkIGEgd2FyZWhvdXNlIHRvIHByb2R1Y2U8L2Rpdj4nICtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICAgICAgPGI+cmVzaWRlbnRpYWwgYnVpbGRpbmc8L2I+XG4gICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgIGArIEljb25zLmhvbWUgKyBgIGhvdXNlczogPHNwYW4gaWQ9XCJob3VzZXNcIj4wLzA8L3NwYW4+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGArIEljb25zLnBlb3BsZSArIGAgcmVudGVyOiA8c3BhbiBpZD1cInJlbnRlclwiPjAvMDwvc3Bhbj4gIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImJ1eS1ob3VzZVwiPitgKyBJY29ucy5ob21lICsgYCBmb3IgMjUuMDAwYCArIEljb25zLm1vbmV5ICsgXCIgNDB4XCIgKyBhbGxQcm9kdWN0c1swXS5nZXRJY29uKCkgK1xuICAgICAgICAgICAgXCIgODB4XCIgKyBhbGxQcm9kdWN0c1sxXS5nZXRJY29uKCkgKyBgPC9idXR0b24+IFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImRlbGV0ZS1ob3VzZVwiPi1gKyBJY29ucy5ob21lICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxiPldhcmVob3VzZTwvYj5cbiAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgYCsgSWNvbnMud2FyZWhvdXNlICsgYCBob3VzZXM6IDxzcGFuIGlkPVwiY291bnQtd2FyZWhvdXNlc1wiPjAvMDwvc3Bhbj4gIFxuICAgICAgICAgICAgICAgICAgICAgICAgYCArIGAgY29zdHM6IDxzcGFuIGlkPVwiY29zdHMtd2FyZWhvdXNlc1wiPjA8L3NwYW4+IGAgKyBJY29ucy5tb25leSArIGAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImJ1eS13YXJlaG91c2VcIj4rYCsgSWNvbnMuaG9tZSArIGAgZm9yIDE1LjAwMGAgKyBJY29ucy5tb25leSArIFwiIDIweFwiICsgYWxsUHJvZHVjdHNbMF0uZ2V0SWNvbigpICtcbiAgICAgICAgICAgIFwiIDQweFwiICsgYWxsUHJvZHVjdHNbMV0uZ2V0SWNvbigpICsgYDwvYnV0dG9uPiBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkZWxldGUtd2FyZWhvdXNlXCI+LWArIEljb25zLmhvbWUgKyBgPC9idXR0b24+YDtcbiAgICB9XG4gICAgY3JlYXRlV2FyZWhvdXNlKCl7XG4gICAgICAgIHJldHVybiBgPHRhYmxlIGlkPVwiY2l0eWRpYWxvZy13YXJlaG91c2UtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+U3RvY2s8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Qcm9kdWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmVlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1pbi1TdG9jazwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlNlbGxpbmcgcHJpY2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0uZ2V0SWNvbigpICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLm5hbWUgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD4wPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJ3YXJlaG91c2UtbWluLXN0b2NrXCIgaWQ9XCJ3YXJlaG91c2UtbWluLXN0b2NrXycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cIndhcmVob3VzZS1zZWxsaW5nLXByaWNlXCIgaWQ9XCJ3YXJlaG91c2Utc2VsbGluZy1wcmljZV8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgIDxwPm51bWJlciBvZiB3YXJlaG91c2VzIDxzcGFuIGlkPVwiY2l0eWRpYWxvZy13YXJlaG91c2UtY291bnRcIj48c3Bhbj48L3A+YDtcbiAgICB9XG4gICAgY3JlYXRlU2NvcmUoKXtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLXNjb3JlLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TY29yZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+YDtcbiAgICB9XG4gICAgY3JlYXRlQ29uc3RydWN0aW9uKCl7XG4gICAgICAgIHJldHVybiBgPHRhYmxlIGlkPVwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb24tdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Nb2RlbDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlNwZWVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+Q2FwYWNpdHk8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5EYWlseSBDb3N0czwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJ1aWxkIGRheXM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5BY3Rpb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbEFpcnBsYW5lVHlwZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsQWlycGxhbmVUeXBlc1t4XS5tb2RlbCArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxBaXJwbGFuZVR5cGVzW3hdLnNwZWVkICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbEFpcnBsYW5lVHlwZXNbeF0uY2FwYWNpdHkgKyBcIjwvdGQ+XCI7IFxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbEFpcnBsYW5lVHlwZXNbeF0uY29zdHMgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsQWlycGxhbmVUeXBlc1t4XS5idWlsZERheXMgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgJzxidXR0b24gaWQ9XCJuZXctYWlycGxhbmVfJyArIHggKyAnXCI+JyArIFwiK1wiK0ljb25zLmFpcnBsYW5lICtcIiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgIENpdHkuZ2V0QnVpbGRpbmdDb3N0c0FzSWNvbihhbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkaW5nQ29zdHMsIGFsbEFpcnBsYW5lVHlwZXNbeF0uYnVpbGRpbmdNYXRlcmlhbCkgKyBcIjwvYnV0dG9uPjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgPC90YWJsZT4gYDtcbiAgICB9XG4gICAgZ2V0U2xpZGVyVmFsdWUoZG9tOiBIVE1MSW5wdXRFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgdmFyIG1heFZhbHVlID0gcGFyc2VJbnQoZG9tLmdldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIpKTtcbiAgICAgICAgdmFyIHZhbCA9IHBhcnNlSW50KGRvbS52YWx1ZSk7XG4gICAgICAgIHZhciBleHAgPSBNYXRoLnJvdW5kKGxvZyhtYXhWYWx1ZSwgNDApICogMTAwMCkgLyAxMDAwO1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnBvdyh2YWwsIGV4cCkpO1xuICAgIH1cbiAgICBiaW5kQWN0aW9ucygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzLmluZGV4T2YoX3RoaXMuY2l0eSk7XG4gICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgIGlmIChwb3MgPj0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgICAgICBfdGhpcy5jaXR5ID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXNbcG9zXTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIHZhciBwb3MgPSBfdGhpcy5jaXR5LndvcmxkLmNpdGllcy5pbmRleE9mKF90aGlzLmNpdHkpO1xuICAgICAgICAgICAgcG9zLS07XG4gICAgICAgICAgICBpZiAocG9zID09PSAtMSlcbiAgICAgICAgICAgICAgICBwb3MgPSBfdGhpcy5jaXR5LndvcmxkLmNpdGllcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgX3RoaXMuY2l0eSA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzW3Bvc107XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2l0eWRpYWxvZy1tYXJrZXQtdGFicycpLmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWJ1eS1zbGlkZXJfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0O1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5nZXRTbGlkZXJWYWx1ZSh0KTtcbiAgICAgICAgICAgICAgICB2YXIgcHJpY2UgPSBfdGhpcy5jYWxjUHJpY2UodCwgdmFsKTtcbiAgICAgICAgICAgICAgICB0Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUwgPSBcIlwiICsgdmFsICsgXCIgXCIgKyB2YWwgKiBwcmljZTtcbiAgICAgICAgICAgICAgICB0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlblszXS5pbm5lckhUTUwgPSBcIlwiICsgcHJpY2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtc2VsbC1zbGlkZXJfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0O1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5nZXRTbGlkZXJWYWx1ZSh0KTtcbiAgICAgICAgICAgICAgICB2YXIgcHJpY2UgPSBfdGhpcy5jYWxjUHJpY2UodCwgdmFsKTtcbiAgICAgICAgICAgICAgICB0Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUwgPSBcIlwiICsgdmFsICsgXCIgXCIgKyB2YWwgKiBwcmljZTtcbiAgICAgICAgICAgICAgICB0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlblszXS5pbm5lckhUTUwgPSBcIlwiICsgcHJpY2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBpbmVkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtYnV5LXNsaWRlcl9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5lZGl0KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcbiAgICAgICAgICAgICAgICBpbmVkaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcih0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdHNvdXJjZTogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtc291cmNlXCIpO1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5nZXRTbGlkZXJWYWx1ZSh0KTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxsT3JCdXkoaWQsIHZhbCwgX3RoaXMuY2FsY1ByaWNlKHQsIHZhbCksIF90aGlzLmdldFN0b3JlKCksIHNlbGVjdHNvdXJjZS52YWx1ZSA9PT0gXCJXYXJlaG91c2VcIik7XG4gICAgICAgICAgICAgICAgdC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgdC52YWx1ZSA9IFwiMFwiO1xuICAgICAgICAgICAgICAgIGluZWRpdCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtc2VsbC1zbGlkZXJfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGluZWRpdClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgaW5lZGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gX3RoaXMuZ2V0U2xpZGVyVmFsdWUodCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKHQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0c291cmNlOiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS1zb3VyY2VcIik7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsbE9yQnV5KGlkLCAtdmFsLCBfdGhpcy5jYWxjUHJpY2UodCwgdmFsKSwgX3RoaXMuZ2V0U3RvcmUoKSwgc2VsZWN0c291cmNlLnZhbHVlID09PSBcIldhcmVob3VzZVwiKTtcbiAgICAgICAgICAgICAgICB0Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUwgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICB0LnZhbHVlID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgaW5lZGl0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtc291cmNlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcblxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IDU7IHgrKykge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoc2lkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBfdGhpcy5jaXR5LmNvbXBhbmllc1tpZF07XG5cbiAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LmNvbW1pdEJ1aWxkaW5nQ29zdHMoY29tcC5nZXRCdWlsZGluZ0Nvc3RzKCksIGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpLCBcImJ1eSBidWlsZGluZ1wiKTtcbiAgICAgICAgICAgICAgICBjb21wLndvcmtlcnMgKz0gMjU7XG4gICAgICAgICAgICAgICAgY29tcC5idWlsZGluZ3MrKztcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KFwiY3JlYXRlIHhcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWZhY3RvcnlfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBzaWQgPSAoPGFueT5ldnQudGFyZ2V0KS5pZDtcbiAgICAgICAgICAgICAgICBpZiAoc2lkID09PSBcIlwiKVxuICAgICAgICAgICAgICAgICAgICBzaWQgPSAoPGFueT5ldnQudGFyZ2V0KS5wYXJlbnROb2RlLmlkXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKHNpZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIHZhciBjb21wID0gX3RoaXMuY2l0eS5jb21wYW5pZXNbaWRdO1xuICAgICAgICAgICAgICAgIGlmIChjb21wLmJ1aWxkaW5ncyA+IDApXG4gICAgICAgICAgICAgICAgICAgIGNvbXAuYnVpbGRpbmdzLS07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXAud29ya2VycyA+IGNvbXAuYnVpbGRpbmdzICogMjUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcC53b3JrZXJzID0gY29tcC5idWlsZGluZ3MgKiAyNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBzaWQgPSAoPGFueT5ldnQudGFyZ2V0KS5pZDtcbiAgICAgICAgICAgICAgICBpZiAoc2lkID09PSBcIlwiKVxuICAgICAgICAgICAgICAgICAgICBzaWQgPSAoPGFueT5ldnQudGFyZ2V0KS5wYXJlbnROb2RlLmlkXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKHNpZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIHZhciBjb21wID0gX3RoaXMuY2l0eS5jb21wYW5pZXNbaWRdO1xuICAgICAgICAgICAgICAgIF90aGlzLmNpdHkuY29tbWl0QnVpbGRpbmdDb3N0cyg1MDAwMCwgW10sIFwiYnV5IGxpY2VuY2VcIik7XG4gICAgICAgICAgICAgICAgY29tcC5oYXNMaWNlbnNlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktaG91c2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKDE1MDAwLCBbMjAsIDQwXSwgXCJidXkgYnVpbGRpbmdcIik7XG4gICAgICAgICAgICBfdGhpcy5jaXR5LmhvdXNlcysrO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1ob3VzZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgaWYgKF90aGlzLmNpdHkuaG91c2VzID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIF90aGlzLmNpdHkuaG91c2VzLS07XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIGlmICgoX3RoaXMuY2l0eS5wZW9wbGUgLSAxMDAwKSA+IF90aGlzLmNpdHkuaG91c2VzICogMTAwKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2l0eS5wZW9wbGUgPSAxMDAwICsgX3RoaXMuY2l0eS5ob3VzZXMgKiAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlbW92ZSB3b3JrZXJcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS13YXJlaG91c2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcblxuICAgICAgICAgICAgX3RoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKDI1MDAwLCBbNDAsIDgwXSwgXCJidXkgYnVpbGRpbmdcIik7XG4gICAgICAgICAgICBfdGhpcy5jaXR5LndhcmVob3VzZXMrKztcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtd2FyZWhvdXNlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuY2l0eS53YXJlaG91c2VzID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIF90aGlzLmNpdHkud2FyZWhvdXNlcy0tO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FyZWhvdXNlLW1pbi1zdG9ja19cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLmNpdHkud2FyZWhvdXNlTWluU3RvY2tbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhcmVob3VzZS1zZWxsaW5nLXByaWNlX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2l0eS53YXJlaG91c2VNaW5TdG9ja1tpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgc2VsbE9yQnV5KHByb2R1Y3RpZCwgYW1vdW50OiBudW1iZXIsIHByaWNlOiBudW1iZXIsIHN0b3JldGFyZ2V0OiBudW1iZXJbXSwgaXNXYXJlaG91c2U6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKGlzV2FyZWhvdXNlKSB7XG4gICAgICAgICAgICB0aGlzLmNpdHkud2FyZWhvdXNlW3Byb2R1Y3RpZF0gLT0gYW1vdW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaXR5LndvcmxkLmdhbWUuY2hhbmdlTW9uZXkoLWFtb3VudCAqIHByaWNlLCBcInNlbGwgb3IgYnV5IGZyb20gbWFya2V0XCIsIHRoaXMuY2l0eSk7XG4gICAgICAgICAgICB0aGlzLmNpdHkubWFya2V0W3Byb2R1Y3RpZF0gLT0gYW1vdW50O1xuICAgICAgICB9XG4gICAgICAgIHN0b3JldGFyZ2V0W3Byb2R1Y3RpZF0gKz0gYW1vdW50O1xuICAgICAgICB0aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgdGhpcy5jaXR5LndvcmxkLmdhbWUudXBkYXRlVGl0bGUoKTtcbiAgICB9XG4gICAgZ2V0U3RvcmUoKSB7XG4gICAgICAgIHZhciBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKTtcbiAgICAgICAgdmFyIHZhbCA9IHNlbGVjdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS53YXJlaG91c2VzID4gMCAmJiB2YWwgPT09IFwiV2FyZWhvdXNlXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaXR5LndhcmVob3VzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXR5LndvcmxkLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IHRoaXMuY2l0eS53b3JsZC5haXJwbGFuZXNbeF0ubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2l0eS53b3JsZC5haXJwbGFuZXNbeF0ucHJvZHVjdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdXBkYXRlTWFya2V0KCkge1xuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIik7XG4gICAgICAgIHZhciBzZWxlY3Rzb3VyY2U6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiKTtcbiAgICAgICAgdmFyIGxhc3QgPSBzZWxlY3QudmFsdWU7XG4gICAgICAgIHNlbGVjdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBpZiAodGhpcy5jaXR5LndhcmVob3VzZXMgPiAwKSB7XG4gICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgICAgICBvcHQudmFsdWUgPSBcIldhcmVob3VzZVwiO1xuICAgICAgICAgICAgb3B0LnRleHQgPSBvcHQudmFsdWU7XG4gICAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICAgICAgICAgIGlmIChzZWxlY3Rzb3VyY2UuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICAgICAgICAgIG9wdC52YWx1ZSA9IFwiV2FyZWhvdXNlXCI7XG4gICAgICAgICAgICAgICAgb3B0LnRleHQgPSBvcHQudmFsdWU7XG4gICAgICAgICAgICAgICAgc2VsZWN0c291cmNlLmFwcGVuZENoaWxkKG9wdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0c291cmNlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHNlbGVjdHNvdXJjZS5yZW1vdmVDaGlsZChzZWxlY3Rzb3VyY2UuY2hpbGRyZW5bMV0pO1xuICAgICAgICAgICAgICAgIHNlbGVjdHNvdXJjZS52YWx1ZSA9IFwiTWFya2V0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNpdHkuYWlycGxhbmVzSW5DaXR5Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgICAgICBvcHQudmFsdWUgPSB0aGlzLmNpdHkuYWlycGxhbmVzSW5DaXR5W3hdLm5hbWU7XG4gICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxhc3QgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHNlbGVjdC52YWx1ZSA9IGxhc3Q7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5pY29uPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPm1hcmtldDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmJ1eTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmFpcnBsYW5lMTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPnNlbGw8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5wcmljZTwvdGg+XG4gICAgICAgICovXG4gICAgICAgIHZhciBzdG9yZXRhcmdldCA9IHRoaXMuZ2V0U3RvcmUoKTtcbiAgICAgICAgdmFyIHN0b3Jlc291cmNlID0gdGhpcy5jaXR5Lm1hcmtldDtcbiAgICAgICAgaWYgKHNlbGVjdHNvdXJjZS52YWx1ZSA9PT0gXCJXYXJlaG91c2VcIikge1xuICAgICAgICAgICAgc3RvcmVzb3VyY2UgPSB0aGlzLmNpdHkud2FyZWhvdXNlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG5cbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzJdLmlubmVySFRNTCA9IHN0b3Jlc291cmNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblszXS5pbm5lckhUTUwgPSAoc2VsZWN0c291cmNlLnZhbHVlID09PSBcIldhcmVob3VzZVwiID8gXCJcIiA6IHRoaXMuY2FsY1ByaWNlKDxhbnk+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0sIDApLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdKS5tYXggPSBzdG9yZXNvdXJjZVt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKHN0b3JldGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdKS5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls2XS5jaGlsZHJlblswXSkucmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0pLm1heCA9IFwiNDBcIjsvL3N0b3Jlc291cmNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdKS5zZXRBdHRyaWJ1dGUoXCJtYXhWYWx1ZVwiLCBzdG9yZXNvdXJjZVt4XS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB0ci5jaGlsZHJlbls1XS5pbm5lckhUTUwgPSBzdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls2XS5jaGlsZHJlblswXSkubWF4ID0gXCI0MFwiOy8vc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLnNldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIsIHN0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0pLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0ci5jaGlsZHJlbls1XS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls0XS5jaGlsZHJlblswXSkubWF4ID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzZdLmNoaWxkcmVuWzBdKS5tYXggPSBcIjBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgdXBkYXRlQnVpbGRpbmdzKCkge1xuICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5wcm9kdWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+YnVpbGRpbmdzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmpvYnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmVlZHM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmNvc3RzIG5ldyBidWlsZGluZzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5hY3Rpb25zPC90aD5cbiAgICAgICAgICAgICAgICovXG4gICAgICAgIHZhciBjb21wYW5pZXMgPSB0aGlzLmNpdHkuY29tcGFuaWVzO1xuICAgICAgICB2YXIgYWxsID0gYWxsUHJvZHVjdHM7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY29tcGFuaWVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IGNvbXBhbmllc1t4XTtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG4gICAgICAgICAgICB2YXIgcHJvZHVjdCA9IGFsbFtjb21wLnByb2R1Y3RpZF07XG4gICAgICAgICAgICB2YXIgcHJvZHVjZSA9IGNvbXAuZ2V0RGFpbHlQcm9kdWNlKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblswXS5pbm5lckhUTUwgPSBwcm9kdWNlICsgXCIgXCIgKyBwcm9kdWN0LmdldEljb24oKTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzFdLmlubmVySFRNTCA9IHByb2R1Y3QubmFtZTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzJdLmlubmVySFRNTCA9IGNvbXAuYnVpbGRpbmdzLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblszXS5pbm5lckhUTUwgPSBjb21wLndvcmtlcnMgKyBcIi9cIiArIGNvbXAuZ2V0TWF4V29ya2VycygpO1xuICAgICAgICAgICAgdmFyIG5lZWRzMSA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgbmVlZHMyID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChwcm9kdWN0LmlucHV0MSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIG5lZWRzMSA9IFwiXCIgKyBjb21wLmdldERhaWx5SW5wdXQxKCkgKyBcIjxici8+XCIgKyBhbGxbcHJvZHVjdC5pbnB1dDFdLmdldEljb24oKSArIFwiIFwiO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bNF0uaW5uZXJIVE1MID0gbmVlZHMxO1xuICAgICAgICAgICAgaWYgKHByb2R1Y3QuaW5wdXQyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgbmVlZHMyID0gbmVlZHMyICsgXCJcIiArIGNvbXAuZ2V0RGFpbHlJbnB1dDIoKSArIFwiPGJyLz5cIiArIGFsbFtwcm9kdWN0LmlucHV0Ml0uZ2V0SWNvbigpO1xuICAgICAgICAgICAvLyB0ci5jaGlsZHJlbls1XS5pbm5lckhUTUwgPSBDaXR5LmdldEJ1aWxkaW5nQ29zdHNBc0ljb24oY29tcC5nZXRCdWlsZGluZ0Nvc3RzKCksIGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpLCB0cnVlKTtcblxuICAgICAgICAgICAgaWYgKGNvbXAuaGFzTGljZW5zZSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaXR5LndhcmVob3VzZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vLXdhcmVob3VzZV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby13YXJlaG91c2VfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb21wLmhhc0xpY2Vuc2UgJiYgdGhpcy5jaXR5LndhcmVob3VzZXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLmlubmVySFRNTD1cIitcIiArIEljb25zLmZhY3RvcnkgKyAgXG4gICAgICAgICAgICAgICAgICAgICAgICBDaXR5LmdldEJ1aWxkaW5nQ29zdHNBc0ljb24oY29tcC5nZXRCdWlsZGluZ0Nvc3RzKCksIGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLWZhY3RvcnlfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtZmFjdG9yeV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLCBcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtYXQgPSBjb21wLmdldEJ1aWxkaW5nTWF0ZXJpYWwoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNpdHkuY2FuQnVpbGQoY29tcC5nZXRCdWlsZGluZ0Nvc3RzKCksIGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpKSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy5jaXR5LndvcmxkLmdhbWUuZ2V0TW9uZXkoKSA8IGNvbXAuZ2V0QnVpbGRpbmdDb3N0cygpIHx8IHRoaXMuY2l0eS5tYXJrZXRbMF0gPCBtYXRbMF0gfHwgdGhpcy5jaXR5Lm1hcmtldFsxXSA8IG1hdFsxXSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgXCJub3QgYWxsIGJ1aWxkaW5nIGNvc3RzIGFyZSBhdmFpbGFibGVcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwidGl0bGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaXR5LmNhbkJ1aWxkKDUwMDAwLCBbXSkgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWxpY2Vuc2VfXCIgKyB4KS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG91c2VzXCIpLmlubmVySFRNTCA9IFwiXCIgKyAodGhpcy5jaXR5LmhvdXNlcyArIFwiL1wiICsgdGhpcy5jaXR5LmhvdXNlcyk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVudGVyXCIpLmlubmVySFRNTCA9IFwiXCIgKyAodGhpcy5jaXR5LnBlb3BsZSAtIDEwMDAgKyBcIi9cIiArIHRoaXMuY2l0eS5ob3VzZXMgKiAxMDApO1xuICAgICAgICBpZiAodGhpcy5jaXR5LmNhbkJ1aWxkKDI1MDAwLCBbNDAsIDgwXSkgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LWhvdXNlXCIpLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktaG91c2VcIikucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2l0eS5jYW5CdWlsZCgxNTAwMCwgWzIwLCA0MF0pICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS13YXJlaG91c2VcIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS13YXJlaG91c2VcIikucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jaXR5LmhvdXNlcyA9PT0gMCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtaG91c2VcIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1ob3VzZVwiKS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG4gICAgdXBkYXRlV2FyZWhvdXNlKCkge1xuICAgICAgICB2YXIgbmVlZHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgbmVlZHMucHVzaCgwKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2l0eS5jb21wYW5pZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gYWxsUHJvZHVjdHNbdGhpcy5jaXR5LmNvbXBhbmllc1tpXS5wcm9kdWN0aWRdO1xuICAgICAgICAgICAgaWYgKHRlc3QuaW5wdXQxICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBuZWVkc1t0ZXN0LmlucHV0MV0gKz0gKE1hdGgucm91bmQodGhpcy5jaXR5LmNvbXBhbmllc1tpXS53b3JrZXJzICogdGVzdC5pbnB1dDFBbW91bnQgLyAyNSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRlc3QuaW5wdXQyID09PSB4KSB7XG4gICAgICAgICAgICAgICAgbmVlZHNbdGVzdC5pbnB1dDJdICs9IChNYXRoLnJvdW5kKHRoaXMuY2l0eS5jb21wYW5pZXNbaV0ud29ya2VycyAqIHRlc3QuaW5wdXQyQW1vdW50IC8gMjUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctd2FyZWhvdXNlLXRhYmxlXCIpO1xuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xuXG4gICAgICAgICAgICB0ci5jaGlsZHJlblsyXS5pbm5lckhUTUwgPSB0aGlzLmNpdHkud2FyZWhvdXNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB2YXIgcHJvZCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgcHJvZHVjdCA9IGFsbFByb2R1Y3RzW3hdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNpdHkuY29tcGFuaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5jb21wYW5pZXNbaV0ucHJvZHVjdGlkID09PSB4KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2QgPSBNYXRoLnJvdW5kKHRoaXMuY2l0eS5jb21wYW5pZXNbaV0ud29ya2VycyAqIHByb2R1Y3QuZGFpbHlQcm9kdWNlIC8gMjUpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bM10uaW5uZXJIVE1MID0gcHJvZDtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzRdLmlubmVySFRNTCA9IG5lZWRzW3hdID09PSAwID8gXCJcIiA6IG5lZWRzW3hdO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRyLmNoaWxkcmVuWzVdLmNoaWxkcmVuWzBdKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls1XS5jaGlsZHJlblswXSkudmFsdWUgPSB0aGlzLmNpdHkud2FyZWhvdXNlTWluU3RvY2tbeF0gPT09IHVuZGVmaW5lZCA/IFwiXCIgOiB0aGlzLmNpdHkud2FyZWhvdXNlTWluU3RvY2tbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0ci5jaGlsZHJlbls2XS5jaGlsZHJlblswXSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLnZhbHVlID0gdGhpcy5jaXR5LndhcmVob3VzZVNlbGxpbmdQcmljZVt4XSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHRoaXMuY2l0eS53YXJlaG91c2VTZWxsaW5nUHJpY2VbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvdW50LXdhcmVob3VzZXNcIikuaW5uZXJIVE1MID0gXCJcIiArIHRoaXMuY2l0eS53YXJlaG91c2VzO1xuICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvc3RzLXdhcmVob3VzZXNcIikuaW5uZXJIVE1MPVwiXCIrKHRoaXMuY2l0eS53YXJlaG91c2VzKjUwKTtcbiAgICB9XG4gICAgdXBkYXRlU2NvcmUoKSB7XG4gICAgICAgXG4gICAgICAgIC8vc2NvcmVcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNjb3JlLXRhYmxlXCIpO1xuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bMl0uaW5uZXJIVE1MID0gdGhpcy5jaXR5LnNjb3JlW3hdICsgXCI8L3RkPlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZShmb3JjZSA9IGZhbHNlKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNpdHkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoISQodGhpcy5kb20pLmRpYWxvZygnaXNPcGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vcGF1c2UgZ2FtZSB3aGlsZSB0cmFkaW5nXG4gICAgICAgIGlmICghZm9yY2UpIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYlwiKT8ucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0Py5jb250YWlucyhcInVpLXRhYnMtYWN0aXZlXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNpdHkud29ybGQuZ2FtZS5pc1BhdXNlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5LndvcmxkLmdhbWUucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuOy8vL25vIHVwZGF0ZSBiZWNhdXNlIG9mIHNsaWRlclxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5LndvcmxkLmdhbWUucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVNYXJrZXQoKTtcbiAgICAgICAgdGhpcy51cGRhdGVCdWlsZGluZ3MoKTtcbiAgICAgICAgdGhpcy51cGRhdGVXYXJlaG91c2UoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlVGl0bGUoKSB7XG4gICAgICAgIHZhciBzaWNvbiA9ICcnO1xuICAgICAgICBpZiAoJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJylbMF0uaW5uZXJIVE1MID0gJzxpbWcgc3R5bGU9XCJmbG9hdDogcmlnaHRcIiBpZD1cImNpdHlkaWFsb2ctaWNvblwiIHNyYz1cIicgKyB0aGlzLmNpdHkuaWNvbiArXG4gICAgICAgICAgICAgICAgJ1wiICBoZWlnaHQ9XCIxNVwiPjwvaW1nPiAnICsgdGhpcy5jaXR5Lm5hbWUgKyBcIiBcIiArIHRoaXMuY2l0eS5wZW9wbGUgKyBcIiBcIiArIEljb25zLnBlb3BsZTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKHtcbiAgICAgICAgICAgIHdpZHRoOiBcIjQ1MHB4XCIsXG4gICAgICAgICAgICAvLyBwb3NpdGlvbjogeyBteTogXCJsZWZ0IHRvcFwiLCBhdDogXCJyaWdodCB0b3BcIiwgb2Y6ICQoQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5kb20pIH0sXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoZXYsIGV2Mikge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5oYXNQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2l0eS53b3JsZC5nYW1lLnJlc3VtZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmNzcyh7IHBvc2l0aW9uOiBcImZpeGVkXCIgfSk7XG5cbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgIH1cbn0iXX0=