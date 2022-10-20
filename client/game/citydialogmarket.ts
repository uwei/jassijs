import { City } from "game/city";
import { allProducts } from "game/product";
import { CityDialog } from "game/citydialog";
var log = (function () {
    var log = Math.log;
    return function (n, base) {
        return log(n) / (base ? log(base) : 1);
    };
})();
export class CityDialogMarket {
    static instance:CityDialogMarket;
    static getInstance(): CityDialogMarket {
        if (CityDialogMarket.instance === undefined)
            CityDialogMarket.instance = new CityDialogMarket();
        return CityDialogMarket.instance;
    }
    create() { 

        return ` <table id="citydialog-market-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Name</th>
                            <th></th>
                            <th></th>
                            <th>
                                <select id="citydialog-market-table-source" style="width:80px">
                                    <option value="Market">Market</option>
                                </select>
                            </th>
                            <th>Price</th>
                            <th></th>
                            <th> <select id="citydialog-market-table-target" style="width:80px">
                                    <option value="placeholder">placeholder</option>
                                </select>
                            </th>
                            
                        </tr>
                       ${(function fun() {
                var ret = "";
                function price(id: string, change: number) { 
                    console.log(id + " " + change);
                }
                for (var x = 0; x < allProducts.length; x++) {
                    ret = ret + '<tr >';
                    ret = ret + "<td>" + allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + allProducts[x].name + "</td>";
                    ret = ret + '<td style="width:20px"><div style="position:relative">' +
                        '<div id="sell-slider_' + x + '" style="overflow:float;position:absolute;height:1px;top:5px;width: 92px" ><div>' +
                        '</div></td>';
                    ret = ret + "<td>0</td>";
                    ret = ret + '<td style="width:40px;"><span>0</span><span id="citydialog-market-info_' + x + '"></span></td>';
                    ret = ret + '<td style="width:20px"><div style="position:relative">' +
                        '<div id="buy-slider_' + x + '" style="overflow:float;position:absolute;left:4px;height:1px;top:5px;width: 92px" ><div>' +
                        '</div></td>';
                    ret = ret + "<td>0</td>";
                    ret = ret + "<td></td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>`;
    }
    bindActions() {
        var _this = this;
         var city = CityDialog.getInstance().city;
       
      
        document.getElementById("citydialog-market-table-source").addEventListener("change", (e) => {

            _this.update();
        });
        document.getElementById("citydialog-market-table-target").addEventListener("change", (e) => {

            _this.update();
        });
        $('.citydialog-tabs').click(function (event) {
            _this.update();
        });
        var inedit;
        for (var x = 0; x < allProducts.length; x++) {
            $("#sell-slider_" + x).slider({
                min: 0,
                max: 40,
                range: "min",
                value: 40,
                slide: function (event, ui) {
                    var t = <HTMLInputElement>event.target;
                    var val = _this.getSliderValue(t);
                     t.setAttribute("curVal",val.toString());
                    var price = _this.calcPrice(t, val);
                    var id = parseInt(t.id.split("_")[1]);
                    if (val === 0)
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                    else
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "x" + val + "<br/>= " + val * price;
                    t.parentNode.parentNode.parentNode.children[4].children[0].innerHTML = "" + price;
                },
                change: function (e, ui) {

                    if (inedit)
                        return;
                    var t = <HTMLInputElement>e.target;

                    var val =parseInt(t.getAttribute("curVal"));
                    if (val === 0)
                        return;
                    inedit = true;
                    var id = Number(t.id.split("_")[1]);
                    var selectsource: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-source");
                    _this.sellOrBuy(id, -val, _this.calcPrice(t, val), _this.getStore(), selectsource.value === "Warehouse");
                    document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                    $(t).slider("value", 40);
                    inedit = false;
                }
            });
            $("#buy-slider_" + x).slider({
                min: 0,
                max: 40,
                range: "min",
                value: 0,
                slide: function (event, ui) {
                    var t = <HTMLInputElement>event.target;
                    var val = _this.getSliderValue(t);
                    t.setAttribute("curVal",val.toString());
                    console.log(val);
                    var price = _this.calcPrice(t, val);
                    var id = parseInt(t.id.split("_")[1]);
                    if (val === 0)
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                    else
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "x" + val + "<br/>= -" + val * price;
                    t.parentNode.parentNode.parentNode.children[4].children[0].innerHTML = "" + price;
                },
                change: function (e, ui) {

                    if (inedit)
                        return;
                    var t = <HTMLInputElement>e.target;

                    var val =parseInt(t.getAttribute("curVal"));
                    console.log("buy "+val);
                    if (val === 0)
                        return;
                    inedit = true;
                    var id = Number(t.id.split("_")[1]);
                    var selectsource: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-source");
                    _this.sellOrBuy(id, val, _this.calcPrice(t, val), _this.getStore(), selectsource.value === "Warehouse");
                    document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                    $(t).slider("value", 0);
                    inedit = false;
                }
            });

        }


        for (var x = 0; x < allProducts.length; x++) {
            document.getElementById("warehouse-min-stock_" + x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                city.warehouseMinStock[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
            });
            document.getElementById("warehouse-selling-price_" + x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                city.warehouseMinStock[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);

            });
        }

    }

    sellOrBuy(productid, amount: number, price: number, storetarget: number[], isWarehouse: boolean) {
         var city = CityDialog.getInstance().city;
        if (isWarehouse) {
            city.warehouse[productid] -= amount;
        } else {
            city.world.game.changeMoney(-amount * price, "sell or buy from market", city);
            city.market[productid] -= amount;
        }
        storetarget[productid] += amount;
        this.getAirplaneInMarket()?.refreshLoadedCount();
        this.update();
        city.world.game.updateTitle();
    }
    getAirplaneInMarket() {
         var city = CityDialog.getInstance().city;
        var select: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-target");
        var val = select.value;
        if (val) {
            for (var x = 0; x < city.world.airplanes.length; x++) {
                if (val === city.world.airplanes[x].name)
                    return city.world.airplanes[x];
            }
        }
        return undefined;
    }
    getStore() {
        var city = CityDialog.getInstance().city;
        var select: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-target");
        var val = select.value;
        if (val) {
            if (city.warehouses > 0 && val === "Warehouse") {
                return city.warehouse;
            }
            return this.getAirplaneInMarket()?.products;
        }
        return undefined;
    }
    update() {

        var city = CityDialog.getInstance().city;
        if (!city)
            return;
        var select: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-target");
        var selectsource: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-source");
        var last = select.value;
        select.innerHTML = "";
        if (city.warehouses > 0) {
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
        var allAPs = city.getAirplanesInCity();
        for (var x = 0; x < allAPs.length; x++) {
            var opt: HTMLOptionElement = document.createElement("option");
            opt.value = allAPs[x].name;
            opt.text = opt.value;
            select.appendChild(opt);
        }

        if (last !== "") {
            select.value = last;
        }
         CityDialog.getInstance().updateTitle();
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
        var storesource = city.market;
        if (selectsource.value === "Warehouse") {
            storesource = city.warehouse;
        }
        for (var x = 0; x < allProducts.length; x++) {
            var table = document.getElementById("citydialog-market-table");
            var tr = table.children[0].children[x + 1];

            tr.children[3].innerHTML = storesource[x].toString();
            var buyslider = <HTMLInputElement>document.getElementById("buy-slider_" + x);
            var sellslider = <HTMLInputElement>document.getElementById("sell-slider_" + x);
            tr.children[4].children[0].innerHTML = (selectsource.value === "Warehouse" ? "" : this.calcPrice(buyslider, 0).toString());
            if (storetarget) {
                var max = storesource[x];
                var testap = this.getAirplaneInMarket();
                if (testap)
                    max = Math.min(max, testap.capacity - testap.loadedCount);
                buyslider.readOnly = false;
                // sellslider.readOnly = false;
                buyslider.setAttribute("maxValue", max.toString());
                tr.children[6].innerHTML = storetarget[x].toString();
                if (storetarget[x] !== 0)
                    $(sellslider).slider("enable");//storetarget[x].toString();
                else
                    $(sellslider).slider("disable");//storetarget[x].toString();
                if (max!== 0)
                    $(buyslider).slider("enable");//storetarget[x].toString();
                else
                    $(buyslider).slider("disable");//storetarget[x].toString();

                sellslider.setAttribute("maxValue", storetarget[x].toString());
            } else {
                buyslider.readOnly = true;
                // sellslider.readOnly = true;
                tr.children[6].innerHTML = "";
                $(buyslider).slider("disable");
                $(sellslider).slider("disable");
            }
        }
        CityDialog.getInstance().updateTitle();
    }
    getSliderValue(dom: HTMLInputElement): number {
        var maxValue = parseInt(dom.getAttribute("maxValue"));
        var val = $(dom).slider("value");// parseInt(dom.value);
        console.log(val);
        if (dom.id.indexOf("sell") > -1)
            val = 40 - val;
        if (val === 0)
            return 0;
        var exp = Math.round(log(maxValue, 40) * 1000) / 1000;
        return Math.round(Math.pow(val, exp));
    }
    private calcPrice(el: HTMLInputElement, val: number) {
         var city = CityDialog.getInstance().city;
        var id = Number(el.id.split("_")[1]);
        var isProducedHere = false;
        for (var x = 0; x < city.companies.length; x++) {
            if (city.companies[x].productid === id)
                isProducedHere = true;
        }
        var prod = allProducts[id].priceSelling;

        if (el.id.indexOf("sell") > -1)
            val = -val;
        var ret = allProducts[id].calcPrice(city.people, city.market[id] - val, isProducedHere);
        var color = "#32CD32";
        if (ret > ((0.0 + prod) * 2 / 3))
            color = "#DAF7A6 ";
        if (ret > ((0.0 + prod) * 2.5 / 3))
            color = "white";
        if (ret > ((0.0 + prod) * 1))
            color = "Yellow";
        if (ret > ((0.0 + prod) * 4 / 3))
            color = "LightPink";

        (<HTMLElement>el.parentElement.parentElement.parentElement.children[4]).style.background = color;
        return ret;
    }


}
