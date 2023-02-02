import { City } from "game/city";
import { Product } from "game/product";
import { CityDialog } from "game/citydialog";
var log = (function () {
    var log = Math.log;
    return function (n, base) {
        return log(n) / (base ? log(base) : 1);
    };
})();
export class CityDialogMarket {
    static instance: CityDialogMarket;
    static getInstance(): CityDialogMarket {
        if (CityDialogMarket.instance === undefined)
            CityDialogMarket.instance = new CityDialogMarket();
        return CityDialogMarket.instance;
    }
    static inedit;
    create() {

        return ` <table id="citydialog-market-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Name</th>
                            <th></th>
                            <th></th>
                            <th style="width:50px">
                                Market
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
                for (var x = 0; x < window.parameter.allProducts.length; x++) {
                    ret = ret + '<tr >';
                    ret = ret + "<td>" + window.parameter.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + window.parameter.allProducts[x].name + "</td>";
                    ret = ret + '<td style="width:20px"><div style="position:relative">' +
                        '<div id="sell-slider_' + x + '" style="overflow:float;position:absolute;height:1px;top:5px;width: 66px" ><div>' +
                        '</div></td>';
                    ret = ret + "<td >0</td>";
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



        document.getElementById("citydialog-market-table-target").addEventListener("change", (e) => {

            CityDialog.getInstance().update(true);
        });
        $('.citydialog-tabs').click(function (event) {
            CityDialog.getInstance().update(true);
        });

        for (var x = 0; x < parameter.allProducts.length; x++) {
            $("#sell-slider_" + x).slider({
                min: 0,
                max: 40,
                range: "min",
                value: 40,
                slide: function (event, ui) {
                    CityDialogMarket.slide(event, false, "citydialog-market-info_");
                },
                change: function (e, ui) {
                    CityDialogMarket.changeSlider(e, true,"citydialog-market-info_");
                },
                stop: function (e: any, ui) {
                    setTimeout(() => {
                        CityDialogMarket.inedit = true;
                        var id = Number(e.target.id.split("_")[1]);
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                        $(e.target).slider("value", 40);
                        CityDialogMarket.inedit = false;
                    }, 200);
                }
            });
            $("#buy-slider_" + x).slider({
                min: 0,
                max: 40,
                range: "min",
                value: 0,
                slide: function (event, ui) {
                    CityDialogMarket.slide(event, true, "citydialog-market-info_");
                },

                change: function (e, ui) {
                    CityDialogMarket.changeSlider(e, false,"citydialog-market-info_");
                },
                stop: function (e: any, ui) {
                    setTimeout(() => {
                        CityDialogMarket.inedit = true;
                        var id = Number(e.target.id.split("_")[1]);
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                        $(e.target).slider("value", 0);
                        CityDialogMarket.inedit = false;

                    }, 200);
                }
            });

        }
    }
    static changeSlider(event, buy,infofield,targetMarket=true) {
        if (CityDialogMarket.inedit)
            return;
        var t = <HTMLInputElement>event.target;
        var test = $(t).slider("value");
        var val;
        if (test === 0 || test === 40)//Cursor verspringt
            val = CityDialogMarket.getSliderValue(t);//
        else
            val = parseInt(t.getAttribute("curVal"));
        if (val === 0)
            return;
        CityDialogMarket.inedit = true;
        var id = Number(t.id.split("_")[1]);
        if(targetMarket)
            CityDialogMarket.sellOrBuy(id, (buy ? -1 : 1) * val, CityDialogMarket.calcPrice(t, val), CityDialogMarket.getStore("citydialog-market-table-target"), false);
        else{
            var city = CityDialog.getInstance().city;
            city.shop[id] -= (buy ? -1 : 1) * val;
            var storetarget=CityDialogMarket.getStore("citydialog-shop-table-target");
            storetarget[id] += (buy ? -1 : 1) * val;
            this.getAirplaneInMarket("citydialog-shop-table-target")?.refreshLoadedCount();
        }
        document.getElementById(infofield + id).innerHTML = "";
        $(t).slider("value", 40);
        CityDialogMarket.inedit = false;
        CityDialog.getInstance().update(true);
        CityDialog.getInstance().city.world.game.updateTitle();

    }
    static slide(event, buy, infofield, changePrice = true) {
        var _this = this;
        var t = <HTMLInputElement>event.target;
        var val = CityDialogMarket.getSliderValue(t);
        t.setAttribute("curVal", val.toString());
        console.log(val);
        var price=0;
        var id = parseInt(t.id.split("_")[1]);
        if (val === 0)
            document.getElementById(infofield + id).innerHTML = "";
        else {
            if (changePrice){
                price = CityDialogMarket.calcPrice(t, val);
                document.getElementById(infofield + id).innerHTML = "x" + val + "<br/>= " + (buy ? "-" : "") + val * price;
            }else
                document.getElementById(infofield + id).innerHTML = ""+val;
        }
        if (changePrice)
            t.parentNode.parentNode.parentNode.children[4].children[0].innerHTML = "" + price;
    }
    static sellOrBuy(productid, amount: number, price: number, storetarget: number[], isshop: boolean) {
        var city = CityDialog.getInstance().city;
        if (isshop) {
            city.shop[productid] -= amount;
        } else {
            city.world.game.changeMoney(-amount * price, "sell or buy from market", city);
            city.market[productid] -= amount;
        }
        storetarget[productid] += amount;
        this.getAirplaneInMarket("citydialog-market-table-target")?.refreshLoadedCount();
        this.getAirplaneInMarket("citydialog-shop-table-target")?.refreshLoadedCount();
        CityDialog.getInstance().update(true);
    }
    static getAirplaneInMarket(target) {
        var city = CityDialog.getInstance().city;
        var select: HTMLSelectElement = <any>document.getElementById(target);
        var val = select.value;
        if (val) {
            for (var x = 0; x < city.world.airplanes.length; x++) {
                if (val === city.world.airplanes[x].name)
                    return city.world.airplanes[x];
            }
        }
        return undefined;
    }
    static getStore(target) {
        var city = CityDialog.getInstance().city;
        var select: HTMLSelectElement = <any>document.getElementById(target);
        var val = select.value;
        if (val) {
            if (city.shops > 0 && val === "MyShop") {
                return city.shop;
            }
            return this.getAirplaneInMarket(target)?.products;
        }
        return undefined;
    }
    update() {

        var city = CityDialog.getInstance().city;
        if (!city)
            return;
        var select: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-target");
        var last = select.value;
        select.innerHTML = "";
        if (city.shops > 0) {
            var opt: HTMLOptionElement = document.createElement("option");
            opt.value = "MyShop";
            opt.text = opt.value;
            select.appendChild(opt);
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
        var storetarget = CityDialogMarket.getStore("citydialog-market-table-target");
        var storesource = city.market;

        for (var x = 0; x < parameter.allProducts.length; x++) {
            var table = document.getElementById("citydialog-market-table");
            var tr = table.children[0].children[x + 1];

            tr.children[3].innerHTML = storesource[x].toString();
            var buyslider = <HTMLInputElement>document.getElementById("buy-slider_" + x);
            var sellslider = <HTMLInputElement>document.getElementById("sell-slider_" + x);
            tr.children[4].children[0].innerHTML = CityDialogMarket.calcPrice(buyslider, 0).toString();
            if (storetarget) {
                var max = storesource[x];
                var testap = CityDialogMarket.getAirplaneInMarket("citydialog-market-table-target");
                if (testap)
                    max = Math.min(max, testap.capacity - testap.loadedCount);
                else{
                    var diff=city.shops*parameter.capacityShop-city.getCompleteAmount();
                    
                    if(diff>0)
                        max=Math.min(max, diff);
                     else
                        max=0;
                }
                buyslider.readOnly = false;
                // sellslider.readOnly = false;
                buyslider.setAttribute("maxValue", max.toString());
                tr.children[6].innerHTML = storetarget[x].toString();
                if (storetarget[x] !== 0)
                    $(sellslider).slider("enable");//storetarget[x].toString();
                else
                    $(sellslider).slider("disable");//storetarget[x].toString();
                if (max !== 0)
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
    static getSliderValue(dom: HTMLInputElement): number {
        var maxValue = parseInt(dom.getAttribute("maxValue"));
        var val = $(dom).slider("value");// parseInt(dom.value);

        if (dom.id.indexOf("sell") > -1)
            val = 40 - val;
        if (val === 0)
            return 0;
        if (val === 40)
            return maxValue;
        var exp = Math.round(log(maxValue, 40) * 1000) / 1000;
        var ret = Math.round(Math.pow(val, exp));
        return ret;
    }
    private static calcPrice(el: HTMLInputElement, val: number) {
        var city = CityDialog.getInstance().city;
        var id = Number(el.id.split("_")[1]);
        var isProducedHere = false;
        for (var x = 0; x < city.companies.length; x++) {
            if (city.companies[x].productid === id)
                isProducedHere = true;
        }
        var prod = isProducedHere ? parameter.allProducts[id].pricePurchase : parameter.allProducts[id].priceSelling;

        if (el.id.indexOf("sell") > -1)
            val = -val;
        var ret = parameter.allProducts[id].calcPrice(city.people, city.market[id] - val, isProducedHere);
        var color = "#32CD32";
        if (ret > ((0.0 + prod) * ((1 - parameter.ratePriceMin) * 2 / 4 + parameter.ratePriceMin)))
            color = "#DAF7A6 ";
        if (ret > ((0.0 + prod) * ((1 - parameter.ratePriceMin) * 3 / 4 + parameter.ratePriceMin)))
            color = "white";
        if (ret > ((0.0 + prod) * 1))
            color = "Yellow";
        if (ret > ((0.0 + prod) * ((parameter.ratePriceMax - 1) * 2 / 4 + 1)))
            color = "LightPink";
        try {
            (<HTMLElement>el.parentElement.parentElement.parentElement.children[4]).style.background = color;
        } catch {

        }
        return ret;
    }


}
