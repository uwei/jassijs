import { City } from "game/city";
import { allProducts, Product } from "game/product";
import { Icons } from "game/icons";
import { Airplane } from "game/airplane";
import { AirplaneDialog } from "game/airplanedialog";
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
    private createStyle() {
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
    private calcPrice(el: HTMLInputElement, val: number) {
        var id = Number(el.id.split("_")[1]);
        var isProducedHere = false;
        for (var x = 0; x < this.city.companies.length; x++) {
            if (this.city.companies[x].productid === id)
                isProducedHere = true;
        }
        var prod = allProducts[id].priceSelling;

        if (el.id.indexOf("sell") > -1)
            val = -val;
        var ret = allProducts[id].calcPrice(this.city.people, this.city.market[id] - val, isProducedHere);
        var color = "green";
        if (ret > ((0.0 + prod) * 2 / 3))
            color = "LightGreen";
        if (ret > ((0.0 + prod) * 2.5 / 3))
            color = "white";
        if (ret > ((0.0 + prod) * 1))
            color = "LightPink";
        if (ret > ((0.0 + prod) * 4 / 3))
            color = "red";
        (<HTMLElement>el.parentElement.parentElement.children[3]).style.background = color;
        return ret;
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
        this.createStyle();

        var products = allProducts;
        var _this = this;
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
                    <li><a href="#citydialog-warehouse" class="citydialog-market-tabs">`+ Icons.warehouse + ` Warehouse</a></li>
                    <li><a href="#citydialog-score" class="citydialog-market-tabs">Score</a></li>
                </ul>
                <div id="citydialog-market">
                    <table id="citydialog-market-table" style="height:100%;weight:100%;">
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
                function price(id: string, change: number) {
                    console.log(id + " " + change);
                }
                for (var x = 0; x < allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + allProducts[x].name + "</td>";
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
                    </table>
                </div>
                <div id="citydialog-buildings">
                     <table id="citydialog-buildings-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Produce</th>
                            <th> </th>
                            <th>Buildings</th>
                            <th>Jobs</th>
                            <th>Needs</th>
                            <th></th>
                            <th>Costs new<br/>building</th>
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
                        ` + ` costs: <span id="costs-warehouses">0</span> `+Icons.money+`  
                        <button id="buy-warehouse">+`+ Icons.home + ` for 15.000` + Icons.money + " 20x" + allProducts[0].getIcon() +
            " 40x" + allProducts[1].getIcon() + `</button> 
                        <button id="delete-warehouse">-`+ Icons.home + `</button>
                </div>
                <div id="citydialog-warehouse">
                    <table id="citydialog-warehouse-table" style="height:100%;weight:100%;">
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
                    <p>number of warehouses <span id="citydialog-warehouse-count"><span></p>
                </div>
                 <div id="citydialog-score">
                    <table id="citydialog-score-table" style="height:100%;weight:100%;">
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
                    </table>
                </div>
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
        for (var x = 0; x < allProducts.length; x++) {
            document.getElementById("citydialog-market-buy-slider_" + x).addEventListener("input", (e) => {
                var t = <HTMLInputElement>e.target;
                var price = _this.calcPrice(t, Number(t.value));
                t.nextElementSibling.innerHTML = "" + t.value + " " + Number(t.value) * price;

                t.parentNode.parentNode.children[3].innerHTML = "" + price;
            });
            document.getElementById("citydialog-market-sell-slider_" + x).addEventListener("input", (e) => {
                var t = <HTMLInputElement>e.target;
                var price = _this.calcPrice(t, Number(t.value));
                t.nextElementSibling.innerHTML = "" + t.value + " " + Number(t.value) * price;

                t.parentNode.parentNode.children[3].innerHTML = "" + price;
            });
            var inedit = false;
            document.getElementById("citydialog-market-buy-slider_" + x).addEventListener("change", (e) => {
                if (inedit)
                    return;
                var t = <HTMLInputElement>e.target;
                inedit = true;
                var id = Number(t.id.split("_")[1]);
                var selectsource: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-source");
                _this.sellOrBuy(id, Number(t.value), _this.calcPrice(t, Number(t.value)), _this.getStore(), selectsource.value === "Warehouse");
                t.nextElementSibling.innerHTML = "0";
                t.value = "0";
                inedit = false;

            });
            document.getElementById("citydialog-market-sell-slider_" + x).addEventListener("change", (e) => {
                if (inedit)
                    return;
                var t = <HTMLInputElement>e.target;
                inedit = true;
                var id = Number(t.id.split("_")[1]);
                var selectsource: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-source");
                _this.sellOrBuy(id, -Number(t.value), _this.calcPrice(t, Number(t.value)), _this.getStore(), selectsource.value === "Warehouse");
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
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = Number(sid.split("_")[1]);
                var comp = _this.city.companies[id];
                var coasts = comp.getBuildingCoasts();
                _this.city.world.game.money = _this.city.world.game.money - coasts[0];
                _this.city.market[0] = _this.city.market[0] - coasts[1];
                _this.city.market[1] = _this.city.market[1] - coasts[2];
                comp.workers += 25;
                comp.buildings++;
                _this.update();
                //alert("create x");
            });
            document.getElementById("delete-factory_" + x).addEventListener("click", (evt) => {
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = Number(sid.split("_")[1]);
                var comp = _this.city.companies[id];
                if (comp.buildings > 0)
                    comp.buildings--;
                _this.update();
            });
            document.getElementById("buy-license_" + x).addEventListener("click", (evt) => {
                var sid = (<any>evt.target).id;
                if (sid === "")
                    sid = (<any>evt.target).parentNode.id
                var id = Number(sid.split("_")[1]);
                var comp = _this.city.companies[id];
                _this.city.world.game.money -= 50000;
                comp.hasLicense = true;
            });

        }
        document.getElementById("buy-house").addEventListener("click", (evt) => {
            _this.city.world.game.money = _this.city.world.game.money - 25000;
            _this.city.market[0] = _this.city.market[0] - 40;
            _this.city.market[1] = _this.city.market[1] - 80;
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
            _this.city.world.game.money = _this.city.world.game.money - 25000;
            _this.city.market[0] = _this.city.market[0] - 40;
            _this.city.market[1] = _this.city.market[1] - 80;
            _this.city.warehouses++;
            _this.update();
        });
        document.getElementById("delete-warehouse").addEventListener("click", (evt) => {
            if (_this.city.warehouses === 0)
                return;
            _this.city.warehouses--;
            _this.update();
       
        });
        for (var x = 0; x < allProducts.length; x++) {
            document.getElementById("warehouse-min-stock_"+x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                _this.city.warehouseMinStock[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
            });
            document.getElementById("warehouse-selling-price_"+x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                _this.city.warehouseMinStock[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                
            });
        }

    }
    sellOrBuy(productid, amount: number, price: number, storetarget: number[], isWarehouse: boolean) {
        if (isWarehouse) {
            this.city.warehouse[productid] -= amount;
        } else {
            this.city.world.game.money += -amount * price;
            this.city.market[productid] -= amount;
        }
        storetarget[productid] += amount;
        this.update(true);
        this.city.world.game.updateTitle();
    }
    getStore() {
        var select: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-target");
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
        var select: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-target");
        var selectsource: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-source");
        var last = select.value;
        select.innerHTML = "";
        if (this.city.warehouses > 0) {
            var opt: HTMLOptionElement = document.createElement("option");
            opt.value = "Warehouse";
            opt.text = opt.value;
            select.appendChild(opt);
            if (selectsource.children.length === 1) {
                var opt: HTMLOptionElement = document.createElement("option");
                opt.value = "Warehouse";
                opt.text = opt.value;
                selectsource.appendChild(opt);
            }
        } else {
            if (selectsource.children.length === 2) {
                selectsource.removeChild(selectsource.children[1]);
                selectsource.value = "Market";
            }
        }
        for (var x = 0; x < this.city.airplanesInCity.length; x++) {
            var opt: HTMLOptionElement = document.createElement("option");
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
        for (var x = 0; x < allProducts.length; x++) {
            var table = document.getElementById("citydialog-market-table");
            var tr = table.children[0].children[x + 1];

            tr.children[2].innerHTML = storesource[x].toString();
            tr.children[3].innerHTML = (selectsource.value === "Warehouse" ? "" : this.calcPrice(<any>tr.children[4].children[0], 0).toString());
            (<HTMLInputElement>tr.children[4].children[0]).max = storesource[x].toString();
            if (storetarget) {
                (<HTMLInputElement>tr.children[4].children[0]).readOnly = false;
                (<HTMLInputElement>tr.children[6].children[0]).readOnly = false;
                (<HTMLInputElement>tr.children[4].children[0]).max = storesource[x].toString();
                tr.children[5].innerHTML = storetarget[x].toString();
                (<HTMLInputElement>tr.children[6].children[0]).max = storetarget[x].toString();
            } else {
                (<HTMLInputElement>tr.children[4].children[0]).readOnly = true;
                (<HTMLInputElement>tr.children[6].children[0]).readOnly = true;
                tr.children[5].innerHTML = "";
                (<HTMLInputElement>tr.children[4].children[0]).max = "0";
                (<HTMLInputElement>tr.children[6].children[0]).max = "0";
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
                needs1 = "" + comp.getDailyInput1() + "<br/>" + all[product.input1].getIcon() + " ";
            tr.children[4].innerHTML = needs1;
            if (product.input2 !== undefined)
                needs2 = needs2 + "" + comp.getDailyInput2() + "<br/>" + all[product.input2].getIcon();
            tr.children[5].innerHTML = needs2;
            tr.children[6].innerHTML = comp.getBuildingCoastsAsIcon();

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
                document.getElementById("new-factory_" + x).removeAttribute("hidden");
                document.getElementById("delete-factory_" + x).removeAttribute("hidden");
            } else {
                document.getElementById("new-factory_" + x).setAttribute("hidden", "");
                document.getElementById("delete-factory_" + x).setAttribute("hidden", "");
            }
            var coasts = comp.getBuildingCoasts();
            if (this.city.world.game.money < coasts[0] || this.city.market[0] < coasts[1] || this.city.market[1] < coasts[2]) {
                document.getElementById("new-factory_" + x).setAttribute("disabled", "");
                document.getElementById("new-factory_" + x).setAttribute("title", "not all building costs are available");
            } else {
                document.getElementById("new-factory_" + x).removeAttribute("disabled");
                document.getElementById("new-factory_" + x).removeAttribute("title");
            }
        }
        document.getElementById("houses").innerHTML = "" + (this.city.houses + "/" + this.city.houses);
        document.getElementById("renter").innerHTML = "" + (this.city.people - 1000 + "/" + this.city.houses * 100);
        if (this.city.world.game.money < 15000 || this.city.market[0] < 20 || this.city.market[1] < 40) {
            document.getElementById("buy-house").setAttribute("disabled", "");
        } else {
            document.getElementById("buy-house").removeAttribute("disabled");
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
                needs[test.input1] += (Math.round(this.city.companies[i].workers * test.input1Amount / 25));
            }
            if (test.input2 === x) {
                needs[test.input2] += (Math.round(this.city.companies[i].workers * test.input2Amount / 25));
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
                    prod = Math.round(this.city.companies[i].workers * product.dailyProduce / 25).toString();
                }
            }
            tr.children[3].innerHTML = prod;
            tr.children[4].innerHTML = needs[x] === 0 ? "" : needs[x];
            if(document.activeElement!==tr.children[5].children[0])
                (<HTMLInputElement>tr.children[5].children[0]).value = this.city.warehouseMinStock[x] === undefined ? "" : this.city.warehouseMinStock[x].toString();
            if(document.activeElement!==tr.children[6].children[0])
                (<HTMLInputElement>tr.children[6].children[0]).value = this.city.warehouseSellingPrice[x] === undefined ? "" : this.city.warehouseSellingPrice[x].toString();
        }
        document.getElementById("count-warehouses").innerHTML=""+this.city.warehouses;
        document.getElementById("costs-warehouses").innerHTML=""+(this.city.warehouses*50);
    }
    updateScore() {
        document.getElementById("citydialog-warehouse-count").innerHTML = this.city.warehouses.toString();

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
                '"  height="15"></img> ' + this.city.name + " " + this.city.people + " " + Icons.people;
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