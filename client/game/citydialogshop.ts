import { City } from "game/city";
import { Product } from "game/product";
import { CityDialog } from "game/citydialog";
import { Icons } from "game/icons";
import { CityDialogMarket } from "game/citydialogmarket";
var log = (function () {
    var log = Math.log;
    return function (n, base) {
        return log(n) / (base ? log(base) : 1);
    };
})();
export class CityDialogShop {
    static instance: CityDialogShop;
    static getInstance(): CityDialogShop {
        if (CityDialogShop.instance === undefined)
            CityDialogShop.instance = new CityDialogShop();
        return CityDialogShop.instance;
    }
    create() {
        return `<table id="citydialog-shop-table" style="height:100%;weight:100%;">
                        <tr>
                            <th></th>
                            <th>Shop</th>
                            <th></th>
                            <th>#</th>
                            <th> <select id="citydialog-shop-table-target" style="width:60px">
                                    <option value="placeholder">placeholder</option>
                                </select>
                            </th>
                            <th></th>
                            <th>Min<br/>Stock</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + parameter.allProducts[x].getIcon() + "</td>";
                    ret = ret + '<td style="text-align: right">0</td>';//stack
                    ret = ret + '<td style="width:110px"><div style="position:relative">' +
                        '<div id="shop-sell-slider_' + x + '" style="overflow:float;position:absolute;height:1px;top:5px;width: 53px" ><div>' +
                        '</div></td>';
                    ret = ret + '<td style="width:30px;"><span id="citydialog-shop-info_' + x + '"></span></td>';
                    ret = ret + '<td style="width:40px"><div style="position:relative">' +
                        '<div id="shop-buy-slider_' + x + '" style="overflow:float;position:absolute;left:4px;height:1px;top:5px;width: 62px" ><div>' +
                        '</div></td>';
                    ret = ret + '<td style="width:40px">0</td>';//Airplane stack
                    ret = ret + '<td>' +
                        '<input type="number" min="0" class="shop-min-stock" id="shop-min-stock_' + x + '"' +
                        'style="width: 50px;"' +
                        '"></td>';
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>
                    <span id="citydialog-shop-info"><span>`;

    }
    bindActions() {
        var _this = this;
        document.getElementById("citydialog-shop-table-target").addEventListener("change", (e) => {

            CityDialog.getInstance().update(true);
        });

        for (var x = 0; x < parameter.allProducts.length; x++) {
            document.getElementById("shop-min-stock_" + x).addEventListener("change", (e) => {
                var city = CityDialog.getInstance().city;
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                city.shopMinStock[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
            });
          
        }
        for (var x = 0; x < parameter.allProducts.length; x++) {
            $("#shop-sell-slider_" + x).slider({
                min: 0,
                max: 40,
                range: "min",
                value: 40,
                slide: function (event, ui) {
                    console.log("slide");
                    CityDialogMarket.slide(event, false, "citydialog-shop-info_", false);
                },
                change: function (e, ui) {
                    CityDialogMarket.changeSlider(e, true, "citydialog-shop-info_", false);
                },
                stop: function (e: any, ui) {
                    setTimeout(() => {
                        CityDialogMarket.inedit = true;
                        var id = Number(e.target.id.split("_")[1]);
                        document.getElementById("citydialog-shop-info_" + id).innerHTML = "";
                        $(e.target).slider("value", 40);
                        CityDialogMarket.inedit = false;
                    }, 200);
                }
            });
            $("#shop-buy-slider_" + x).slider({
                min: 0,
                max: 40,
                range: "min",
                value: 0,
                slide: function (event, ui) {
                    CityDialogMarket.slide(event, true, "citydialog-shop-info_", false);
                },

                change: function (e, ui) {
                    CityDialogMarket.changeSlider(e, false, "citydialog-shop-info_", false);
                },
                stop: function (e: any, ui) {
                    setTimeout(() => {
                        CityDialogMarket.inedit = true;
                        var id = Number(e.target.id.split("_")[1]);
                        document.getElementById("citydialog-shop-info_" + id).innerHTML = "";
                        $(e.target).slider("value", 0);
                        CityDialogMarket.inedit = false;

                    }, 200);
                }
            });

        }
    }


    update() {

        var city = CityDialog.getInstance().city;
        if (!city)
            return;
        var select: HTMLSelectElement = <any>document.getElementById("citydialog-shop-table-target");
        var last = select.value;

        if (document.activeElement !== <any>document.getElementById("citydialog-shop-table-target")) {
            select.innerHTML = "";

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
        }

        CityDialog.getInstance().updateTitle();

        var storetarget = CityDialogMarket.getStore("citydialog-shop-table-target");
        var storesource = city.shop;
        var gesamount = 0;
        for (var x = 0; x < parameter.allProducts.length; x++) {
            var table = document.getElementById("citydialog-shop-table");
            var tr = table.children[0].children[x + 1];
            gesamount += storesource[x];
            tr.children[1].innerHTML = city.shop[x].toLocaleString();
            var buyslider = <HTMLInputElement>document.getElementById("shop-buy-slider_" + x);
            var sellslider = <HTMLInputElement>document.getElementById("shop-sell-slider_" + x);
            if (document.activeElement !== buyslider && document.activeElement !== sellslider) {
                if (storetarget) {
                    var max = storesource[x];
                    var testap = CityDialogMarket.getAirplaneInMarket("citydialog-shop-table-target");
                    if (testap)
                        max = Math.min(max, testap.capacity - testap.loadedCount);
                    buyslider.readOnly = false;
                    // sellslider.readOnly = false;
                    buyslider.setAttribute("maxValue", max.toString());
                    tr.children[5].innerHTML = storetarget[x].toString();
                    if (storetarget[x] !== 0)
                        $(sellslider).slider("enable");//storetarget[x].toString();
                    else
                        $(sellslider).slider("disable");//storetarget[x].toString();
                    if (max !== 0)
                        $(buyslider).slider("enable");//storetarget[x].toString();
                    else
                        $(buyslider).slider("disable");//storetarget[x].toString();
                    var max2 = storetarget[x];
                    var diff = city.shops * parameter.capacityShop - city.getCompleteAmount();
                    if(diff>0)
                        max2=Math.min(max2, diff);
                     else
                        max2=0;
                    sellslider.setAttribute("maxValue", max2.toString());
                } else {
                    buyslider.readOnly = true;
                    // sellslider.readOnly = true;
                    tr.children[5].innerHTML = "";
                    $(buyslider).slider("disable");
                    $(sellslider).slider("disable");
                }
            }
            if (document.activeElement !== tr.children[6].children[0])
                (<HTMLInputElement>tr.children[6].children[0]).value = city.shopMinStock[x] === undefined ? "" : city.shopMinStock[x].toString();
           }

        document.getElementById("citydialog-shop-info").innerHTML = "Shops:" + city.shops + " Capacity " + gesamount.toLocaleString() + "/" + (city.shops * parameter.capacityShop).toLocaleString();

    }



}
