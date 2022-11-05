define(["require", "exports", "game/citydialog"], function (require, exports, citydialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CityDialogMarket = void 0;
    var log = (function () {
        var log = Math.log;
        return function (n, base) {
            return log(n) / (base ? log(base) : 1);
        };
    })();
    class CityDialogMarket {
        static getInstance() {
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
                function price(id, change) {
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
            var city = citydialog_1.CityDialog.getInstance().city;
            document.getElementById("citydialog-market-table-target").addEventListener("change", (e) => {
                citydialog_1.CityDialog.getInstance().update(true);
            });
            $('.citydialog-tabs').click(function (event) {
                citydialog_1.CityDialog.getInstance().update(true);
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
                        CityDialogMarket.changeSlider(e, true, "citydialog-market-info_");
                    },
                    stop: function (e, ui) {
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
                        CityDialogMarket.changeSlider(e, false, "citydialog-market-info_");
                    },
                    stop: function (e, ui) {
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
        static changeSlider(event, buy, infofield, targetMarket = true) {
            var _a;
            if (CityDialogMarket.inedit)
                return;
            var t = event.target;
            var test = $(t).slider("value");
            var val;
            if (test === 0 || test === 40) //Cursor verspringt
                val = CityDialogMarket.getSliderValue(t); //
            else
                val = parseInt(t.getAttribute("curVal"));
            if (val === 0)
                return;
            CityDialogMarket.inedit = true;
            var id = Number(t.id.split("_")[1]);
            if (targetMarket)
                CityDialogMarket.sellOrBuy(id, (buy ? -1 : 1) * val, CityDialogMarket.calcPrice(t, val), CityDialogMarket.getStore("citydialog-market-table-target"), false);
            else {
                var city = citydialog_1.CityDialog.getInstance().city;
                city.shop[id] -= (buy ? -1 : 1) * val;
                var storetarget = CityDialogMarket.getStore("citydialog-shop-table-target");
                storetarget[id] += (buy ? -1 : 1) * val;
                (_a = this.getAirplaneInMarket("citydialog-shop-table-target")) === null || _a === void 0 ? void 0 : _a.refreshLoadedCount();
            }
            document.getElementById(infofield + id).innerHTML = "";
            $(t).slider("value", 40);
            CityDialogMarket.inedit = false;
            citydialog_1.CityDialog.getInstance().update(true);
            citydialog_1.CityDialog.getInstance().city.world.game.updateTitle();
        }
        static slide(event, buy, infofield, changePrice = true) {
            var _this = this;
            var t = event.target;
            var val = CityDialogMarket.getSliderValue(t);
            t.setAttribute("curVal", val.toString());
            console.log(val);
            var price = 0;
            var id = parseInt(t.id.split("_")[1]);
            if (val === 0)
                document.getElementById(infofield + id).innerHTML = "";
            else {
                if (changePrice) {
                    price = CityDialogMarket.calcPrice(t, val);
                    document.getElementById(infofield + id).innerHTML = "x" + val + "<br/>= " + (buy ? "-" : "") + val * price;
                }
                else
                    document.getElementById(infofield + id).innerHTML = "" + val;
            }
            if (changePrice)
                t.parentNode.parentNode.parentNode.children[4].children[0].innerHTML = "" + price;
        }
        static sellOrBuy(productid, amount, price, storetarget, isshop) {
            var _a, _b;
            var city = citydialog_1.CityDialog.getInstance().city;
            if (isshop) {
                city.shop[productid] -= amount;
            }
            else {
                city.world.game.changeMoney(-amount * price, "sell or buy from market", city);
                city.market[productid] -= amount;
            }
            storetarget[productid] += amount;
            (_a = this.getAirplaneInMarket("citydialog-market-table-target")) === null || _a === void 0 ? void 0 : _a.refreshLoadedCount();
            (_b = this.getAirplaneInMarket("citydialog-shop-table-target")) === null || _b === void 0 ? void 0 : _b.refreshLoadedCount();
            citydialog_1.CityDialog.getInstance().update(true);
        }
        static getAirplaneInMarket(target) {
            var city = citydialog_1.CityDialog.getInstance().city;
            var select = document.getElementById(target);
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
            var _a;
            var city = citydialog_1.CityDialog.getInstance().city;
            var select = document.getElementById(target);
            var val = select.value;
            if (val) {
                if (city.shops > 0 && val === "MyShop") {
                    return city.shop;
                }
                return (_a = this.getAirplaneInMarket(target)) === null || _a === void 0 ? void 0 : _a.products;
            }
            return undefined;
        }
        update() {
            var city = citydialog_1.CityDialog.getInstance().city;
            if (!city)
                return;
            var select = document.getElementById("citydialog-market-table-target");
            var last = select.value;
            select.innerHTML = "";
            if (city.shops > 0) {
                var opt = document.createElement("option");
                opt.value = "MyShop";
                opt.text = opt.value;
                select.appendChild(opt);
            }
            var allAPs = city.getAirplanesInCity();
            for (var x = 0; x < allAPs.length; x++) {
                var opt = document.createElement("option");
                opt.value = allAPs[x].name;
                opt.text = opt.value;
                select.appendChild(opt);
            }
            if (last !== "") {
                select.value = last;
            }
            citydialog_1.CityDialog.getInstance().updateTitle();
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
                var buyslider = document.getElementById("buy-slider_" + x);
                var sellslider = document.getElementById("sell-slider_" + x);
                tr.children[4].children[0].innerHTML = CityDialogMarket.calcPrice(buyslider, 0).toString();
                if (storetarget) {
                    var max = storesource[x];
                    var testap = CityDialogMarket.getAirplaneInMarket("citydialog-market-table-target");
                    if (testap)
                        max = Math.min(max, testap.capacity - testap.loadedCount);
                    else {
                        var diff = city.shops * parameter.capacityShop - city.getCompleteAmount();
                        if (diff > 0)
                            max = Math.min(max, diff);
                        else
                            max = 0;
                    }
                    buyslider.readOnly = false;
                    // sellslider.readOnly = false;
                    buyslider.setAttribute("maxValue", max.toString());
                    tr.children[6].innerHTML = storetarget[x].toString();
                    if (storetarget[x] !== 0)
                        $(sellslider).slider("enable"); //storetarget[x].toString();
                    else
                        $(sellslider).slider("disable"); //storetarget[x].toString();
                    if (max !== 0)
                        $(buyslider).slider("enable"); //storetarget[x].toString();
                    else
                        $(buyslider).slider("disable"); //storetarget[x].toString();
                    sellslider.setAttribute("maxValue", storetarget[x].toString());
                }
                else {
                    buyslider.readOnly = true;
                    // sellslider.readOnly = true;
                    tr.children[6].innerHTML = "";
                    $(buyslider).slider("disable");
                    $(sellslider).slider("disable");
                }
            }
            citydialog_1.CityDialog.getInstance().updateTitle();
        }
        static getSliderValue(dom) {
            var maxValue = parseInt(dom.getAttribute("maxValue"));
            var val = $(dom).slider("value"); // parseInt(dom.value);
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
        static calcPrice(el, val) {
            var city = citydialog_1.CityDialog.getInstance().city;
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
                el.parentElement.parentElement.parentElement.children[4].style.background = color;
            }
            catch (_a) {
            }
            return ret;
        }
    }
    exports.CityDialogMarket = CityDialogMarket;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZ21hcmtldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZ21hcmtldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBR0EsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNQLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxVQUFVLENBQUMsRUFBRSxJQUFJO1lBQ3BCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDTCxNQUFhLGdCQUFnQjtRQUV6QixNQUFNLENBQUMsV0FBVztZQUNkLElBQUksZ0JBQWdCLENBQUMsUUFBUSxLQUFLLFNBQVM7Z0JBQ3ZDLGdCQUFnQixDQUFDLFFBQVEsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDdkQsT0FBTyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7UUFDckMsQ0FBQztRQUVELE1BQU07WUFFRixPQUFPOzs7Ozs7Ozs7Ozs7Ozs7O3lCQWdCVSxDQUFDLFNBQVMsR0FBRztnQkFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNiLFNBQVMsS0FBSyxDQUFDLEVBQVUsRUFBRSxNQUFjO29CQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDMUQsR0FBRyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUM7b0JBQ3BCLEdBQUcs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Q0FBQyxDQUFDO2dCQUN0RixLQUFLLEdBQUcsT0FBTyxDQUFDO1lBQ3BCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ3JCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDakUsS0FBSyxHQUFHLFdBQVcsQ0FBQztZQUN4QixJQUFJO2dCQUNjLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7YUFDcEc7WUFBQyxXQUFNO2FBRVA7WUFDRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FHSjtJQXhVRCw0Q0F3VUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaXR5IH0gZnJvbSBcImdhbWUvY2l0eVwiO1xuaW1wb3J0IHsgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcbmltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XG52YXIgbG9nID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbG9nID0gTWF0aC5sb2c7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuLCBiYXNlKSB7XG4gICAgICAgIHJldHVybiBsb2cobikgLyAoYmFzZSA/IGxvZyhiYXNlKSA6IDEpO1xuICAgIH07XG59KSgpO1xuZXhwb3J0IGNsYXNzIENpdHlEaWFsb2dNYXJrZXQge1xuICAgIHN0YXRpYyBpbnN0YW5jZTogQ2l0eURpYWxvZ01hcmtldDtcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQ2l0eURpYWxvZ01hcmtldCB7XG4gICAgICAgIGlmIChDaXR5RGlhbG9nTWFya2V0Lmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBDaXR5RGlhbG9nTWFya2V0Lmluc3RhbmNlID0gbmV3IENpdHlEaWFsb2dNYXJrZXQoKTtcbiAgICAgICAgcmV0dXJuIENpdHlEaWFsb2dNYXJrZXQuaW5zdGFuY2U7XG4gICAgfVxuICAgIHN0YXRpYyBpbmVkaXQ7XG4gICAgY3JlYXRlKCkge1xuXG4gICAgICAgIHJldHVybiBgIDx0YWJsZSBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPVwid2lkdGg6NTBweFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXJrZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5QcmljZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8c2VsZWN0IGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIgc3R5bGU9XCJ3aWR0aDo4MHB4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGxhY2Vob2xkZXJcIj5wbGFjZWhvbGRlcjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByaWNlKGlkOiBzdHJpbmcsIGNoYW5nZTogbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkICsgXCIgXCIgKyBjaGFuZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHdpbmRvdy5wYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ciA+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyB3aW5kb3cucGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyB3aW5kb3cucGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdLm5hbWUgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDoyMHB4XCI+PGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cInNlbGwtc2xpZGVyXycgKyB4ICsgJ1wiIHN0eWxlPVwib3ZlcmZsb3c6ZmxvYXQ7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjFweDt0b3A6NXB4O3dpZHRoOiA2NnB4XCIgPjxkaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZCA+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDo0MHB4O1wiPjxzcGFuPjA8L3NwYW4+PHNwYW4gaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvXycgKyB4ICsgJ1wiPjwvc3Bhbj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDoyMHB4XCI+PGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImJ1eS1zbGlkZXJfJyArIHggKyAnXCIgc3R5bGU9XCJvdmVyZmxvdzpmbG9hdDtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjRweDtoZWlnaHQ6MXB4O3RvcDo1cHg7d2lkdGg6IDkycHhcIiA+PGRpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPmA7XG4gICAgfVxuICAgIGJpbmRBY3Rpb25zKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xuXG5cblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG5cbiAgICAgICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2l0eWRpYWxvZy10YWJzJykuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgJChcIiNzZWxsLXNsaWRlcl9cIiArIHgpLnNsaWRlcih7XG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIG1heDogNDAsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDQwLFxuICAgICAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuc2xpZGUoZXZlbnQsIGZhbHNlLCBcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2hhbmdlOiBmdW5jdGlvbiAoZSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5jaGFuZ2VTbGlkZXIoZSwgdHJ1ZSxcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24gKGU6IGFueSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDaXR5RGlhbG9nTWFya2V0LmluZWRpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoZS50YXJnZXQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtaW5mb19cIiArIGlkKS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuc2xpZGVyKFwidmFsdWVcIiwgNDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoXCIjYnV5LXNsaWRlcl9cIiArIHgpLnNsaWRlcih7XG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIG1heDogNDAsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICAgICAgc2xpZGU6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5zbGlkZShldmVudCwgdHJ1ZSwgXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgY2hhbmdlOiBmdW5jdGlvbiAoZSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5jaGFuZ2VTbGlkZXIoZSwgZmFsc2UsXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uIChlOiBhbnksIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKGUudGFyZ2V0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLnNsaWRlcihcInZhbHVlXCIsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIGNoYW5nZVNsaWRlcihldmVudCwgYnV5LGluZm9maWVsZCx0YXJnZXRNYXJrZXQ9dHJ1ZSkge1xuICAgICAgICBpZiAoQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgdGVzdCA9ICQodCkuc2xpZGVyKFwidmFsdWVcIik7XG4gICAgICAgIHZhciB2YWw7XG4gICAgICAgIGlmICh0ZXN0ID09PSAwIHx8IHRlc3QgPT09IDQwKS8vQ3Vyc29yIHZlcnNwcmluZ3RcbiAgICAgICAgICAgIHZhbCA9IENpdHlEaWFsb2dNYXJrZXQuZ2V0U2xpZGVyVmFsdWUodCk7Ly9cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdmFsID0gcGFyc2VJbnQodC5nZXRBdHRyaWJ1dGUoXCJjdXJWYWxcIikpO1xuICAgICAgICBpZiAodmFsID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBDaXR5RGlhbG9nTWFya2V0LmluZWRpdCA9IHRydWU7XG4gICAgICAgIHZhciBpZCA9IE51bWJlcih0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgIGlmKHRhcmdldE1hcmtldClcbiAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuc2VsbE9yQnV5KGlkLCAoYnV5ID8gLTEgOiAxKSAqIHZhbCwgQ2l0eURpYWxvZ01hcmtldC5jYWxjUHJpY2UodCwgdmFsKSwgQ2l0eURpYWxvZ01hcmtldC5nZXRTdG9yZShcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKSwgZmFsc2UpO1xuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbiAgICAgICAgICAgIGNpdHkuc2hvcFtpZF0gLT0gKGJ1eSA/IC0xIDogMSkgKiB2YWw7XG4gICAgICAgICAgICB2YXIgc3RvcmV0YXJnZXQ9Q2l0eURpYWxvZ01hcmtldC5nZXRTdG9yZShcImNpdHlkaWFsb2ctc2hvcC10YWJsZS10YXJnZXRcIik7XG4gICAgICAgICAgICBzdG9yZXRhcmdldFtpZF0gKz0gKGJ1eSA/IC0xIDogMSkgKiB2YWw7XG4gICAgICAgICAgICB0aGlzLmdldEFpcnBsYW5lSW5NYXJrZXQoXCJjaXR5ZGlhbG9nLXNob3AtdGFibGUtdGFyZ2V0XCIpPy5yZWZyZXNoTG9hZGVkQ291bnQoKTtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbmZvZmllbGQgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgJCh0KS5zbGlkZXIoXCJ2YWx1ZVwiLCA0MCk7XG4gICAgICAgIENpdHlEaWFsb2dNYXJrZXQuaW5lZGl0ID0gZmFsc2U7XG4gICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUodHJ1ZSk7XG4gICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5LndvcmxkLmdhbWUudXBkYXRlVGl0bGUoKTtcblxuICAgIH1cbiAgICBzdGF0aWMgc2xpZGUoZXZlbnQsIGJ1eSwgaW5mb2ZpZWxkLCBjaGFuZ2VQcmljZSA9IHRydWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5ldmVudC50YXJnZXQ7XG4gICAgICAgIHZhciB2YWwgPSBDaXR5RGlhbG9nTWFya2V0LmdldFNsaWRlclZhbHVlKHQpO1xuICAgICAgICB0LnNldEF0dHJpYnV0ZShcImN1clZhbFwiLCB2YWwudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbCk7XG4gICAgICAgIHZhciBwcmljZT0wO1xuICAgICAgICB2YXIgaWQgPSBwYXJzZUludCh0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgIGlmICh2YWwgPT09IDApXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbmZvZmllbGQgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2hhbmdlUHJpY2Upe1xuICAgICAgICAgICAgICAgIHByaWNlID0gQ2l0eURpYWxvZ01hcmtldC5jYWxjUHJpY2UodCwgdmFsKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbmZvZmllbGQgKyBpZCkuaW5uZXJIVE1MID0gXCJ4XCIgKyB2YWwgKyBcIjxici8+PSBcIiArIChidXkgPyBcIi1cIiA6IFwiXCIpICsgdmFsICogcHJpY2U7XG4gICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGluZm9maWVsZCArIGlkKS5pbm5lckhUTUwgPSBcIlwiK3ZhbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlUHJpY2UpXG4gICAgICAgICAgICB0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IFwiXCIgKyBwcmljZTtcbiAgICB9XG4gICAgc3RhdGljIHNlbGxPckJ1eShwcm9kdWN0aWQsIGFtb3VudDogbnVtYmVyLCBwcmljZTogbnVtYmVyLCBzdG9yZXRhcmdldDogbnVtYmVyW10sIGlzc2hvcDogYm9vbGVhbikge1xuICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xuICAgICAgICBpZiAoaXNzaG9wKSB7XG4gICAgICAgICAgICBjaXR5LnNob3BbcHJvZHVjdGlkXSAtPSBhbW91bnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaXR5LndvcmxkLmdhbWUuY2hhbmdlTW9uZXkoLWFtb3VudCAqIHByaWNlLCBcInNlbGwgb3IgYnV5IGZyb20gbWFya2V0XCIsIGNpdHkpO1xuICAgICAgICAgICAgY2l0eS5tYXJrZXRbcHJvZHVjdGlkXSAtPSBhbW91bnQ7XG4gICAgICAgIH1cbiAgICAgICAgc3RvcmV0YXJnZXRbcHJvZHVjdGlkXSArPSBhbW91bnQ7XG4gICAgICAgIHRoaXMuZ2V0QWlycGxhbmVJbk1hcmtldChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKT8ucmVmcmVzaExvYWRlZENvdW50KCk7XG4gICAgICAgIHRoaXMuZ2V0QWlycGxhbmVJbk1hcmtldChcImNpdHlkaWFsb2ctc2hvcC10YWJsZS10YXJnZXRcIik/LnJlZnJlc2hMb2FkZWRDb3VudCgpO1xuICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKHRydWUpO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0QWlycGxhbmVJbk1hcmtldCh0YXJnZXQpIHtcbiAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbiAgICAgICAgdmFyIHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldCk7XG4gICAgICAgIHZhciB2YWwgPSBzZWxlY3QudmFsdWU7XG4gICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2l0eS53b3JsZC5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsID09PSBjaXR5LndvcmxkLmFpcnBsYW5lc1t4XS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2l0eS53b3JsZC5haXJwbGFuZXNbeF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgc3RhdGljIGdldFN0b3JlKHRhcmdldCkge1xuICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KTtcbiAgICAgICAgdmFyIHZhbCA9IHNlbGVjdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgaWYgKGNpdHkuc2hvcHMgPiAwICYmIHZhbCA9PT0gXCJNeVNob3BcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaXR5LnNob3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBaXJwbGFuZUluTWFya2V0KHRhcmdldCk/LnByb2R1Y3RzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHVwZGF0ZSgpIHtcblxuICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xuICAgICAgICBpZiAoIWNpdHkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKTtcbiAgICAgICAgdmFyIGxhc3QgPSBzZWxlY3QudmFsdWU7XG4gICAgICAgIHNlbGVjdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBpZiAoY2l0eS5zaG9wcyA+IDApIHtcbiAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IFwiTXlTaG9wXCI7XG4gICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbGxBUHMgPSBjaXR5LmdldEFpcnBsYW5lc0luQ2l0eSgpO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbEFQcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICAgICAgb3B0LnZhbHVlID0gYWxsQVBzW3hdLm5hbWU7XG4gICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxhc3QgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHNlbGVjdC52YWx1ZSA9IGxhc3Q7XG4gICAgICAgIH1cbiAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZVRpdGxlKCk7XG4gICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmljb248L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5uYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bWFya2V0PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+YnV5PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+YWlycGxhbmUxPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+c2VsbDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPnByaWNlPC90aD5cbiAgICAgICAgKi9cbiAgICAgICAgdmFyIHN0b3JldGFyZ2V0ID0gQ2l0eURpYWxvZ01hcmtldC5nZXRTdG9yZShcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKTtcbiAgICAgICAgdmFyIHN0b3Jlc291cmNlID0gY2l0eS5tYXJrZXQ7XG5cbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG5cbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzNdLmlubmVySFRNTCA9IHN0b3Jlc291cmNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB2YXIgYnV5c2xpZGVyID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktc2xpZGVyX1wiICsgeCk7XG4gICAgICAgICAgICB2YXIgc2VsbHNsaWRlciA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsbC1zbGlkZXJfXCIgKyB4KTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IENpdHlEaWFsb2dNYXJrZXQuY2FsY1ByaWNlKGJ1eXNsaWRlciwgMCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChzdG9yZXRhcmdldCkge1xuICAgICAgICAgICAgICAgIHZhciBtYXggPSBzdG9yZXNvdXJjZVt4XTtcbiAgICAgICAgICAgICAgICB2YXIgdGVzdGFwID0gQ2l0eURpYWxvZ01hcmtldC5nZXRBaXJwbGFuZUluTWFya2V0KFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0YXApXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IE1hdGgubWluKG1heCwgdGVzdGFwLmNhcGFjaXR5IC0gdGVzdGFwLmxvYWRlZENvdW50KTtcbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlmZj1jaXR5LnNob3BzKnBhcmFtZXRlci5jYXBhY2l0eVNob3AtY2l0eS5nZXRDb21wbGV0ZUFtb3VudCgpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYoZGlmZj4wKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4PU1hdGgubWluKG1heCwgZGlmZik7XG4gICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXg9MDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnV5c2xpZGVyLnJlYWRPbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gc2VsbHNsaWRlci5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJ1eXNsaWRlci5zZXRBdHRyaWJ1dGUoXCJtYXhWYWx1ZVwiLCBtYXgudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bNl0uaW5uZXJIVE1MID0gc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RvcmV0YXJnZXRbeF0gIT09IDApXG4gICAgICAgICAgICAgICAgICAgICQoc2VsbHNsaWRlcikuc2xpZGVyKFwiZW5hYmxlXCIpOy8vc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICQoc2VsbHNsaWRlcikuc2xpZGVyKFwiZGlzYWJsZVwiKTsvL3N0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgaWYgKG1heCAhPT0gMClcbiAgICAgICAgICAgICAgICAgICAgJChidXlzbGlkZXIpLnNsaWRlcihcImVuYWJsZVwiKTsvL3N0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAkKGJ1eXNsaWRlcikuc2xpZGVyKFwiZGlzYWJsZVwiKTsvL3N0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICBzZWxsc2xpZGVyLnNldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIsIHN0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBidXlzbGlkZXIucmVhZE9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIHNlbGxzbGlkZXIucmVhZE9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzZdLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgJChidXlzbGlkZXIpLnNsaWRlcihcImRpc2FibGVcIik7XG4gICAgICAgICAgICAgICAgJChzZWxsc2xpZGVyKS5zbGlkZXIoXCJkaXNhYmxlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGVUaXRsZSgpO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0U2xpZGVyVmFsdWUoZG9tOiBIVE1MSW5wdXRFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgdmFyIG1heFZhbHVlID0gcGFyc2VJbnQoZG9tLmdldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIpKTtcbiAgICAgICAgdmFyIHZhbCA9ICQoZG9tKS5zbGlkZXIoXCJ2YWx1ZVwiKTsvLyBwYXJzZUludChkb20udmFsdWUpO1xuXG4gICAgICAgIGlmIChkb20uaWQuaW5kZXhPZihcInNlbGxcIikgPiAtMSlcbiAgICAgICAgICAgIHZhbCA9IDQwIC0gdmFsO1xuICAgICAgICBpZiAodmFsID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIGlmICh2YWwgPT09IDQwKVxuICAgICAgICAgICAgcmV0dXJuIG1heFZhbHVlO1xuICAgICAgICB2YXIgZXhwID0gTWF0aC5yb3VuZChsb2cobWF4VmFsdWUsIDQwKSAqIDEwMDApIC8gMTAwMDtcbiAgICAgICAgdmFyIHJldCA9IE1hdGgucm91bmQoTWF0aC5wb3codmFsLCBleHApKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FsY1ByaWNlKGVsOiBIVE1MSW5wdXRFbGVtZW50LCB2YWw6IG51bWJlcikge1xuICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xuICAgICAgICB2YXIgaWQgPSBOdW1iZXIoZWwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgdmFyIGlzUHJvZHVjZWRIZXJlID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2l0eS5jb21wYW5pZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmIChjaXR5LmNvbXBhbmllc1t4XS5wcm9kdWN0aWQgPT09IGlkKVxuICAgICAgICAgICAgICAgIGlzUHJvZHVjZWRIZXJlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvZCA9IGlzUHJvZHVjZWRIZXJlID8gcGFyYW1ldGVyLmFsbFByb2R1Y3RzW2lkXS5wcmljZVB1cmNoYXNlIDogcGFyYW1ldGVyLmFsbFByb2R1Y3RzW2lkXS5wcmljZVNlbGxpbmc7XG5cbiAgICAgICAgaWYgKGVsLmlkLmluZGV4T2YoXCJzZWxsXCIpID4gLTEpXG4gICAgICAgICAgICB2YWwgPSAtdmFsO1xuICAgICAgICB2YXIgcmV0ID0gcGFyYW1ldGVyLmFsbFByb2R1Y3RzW2lkXS5jYWxjUHJpY2UoY2l0eS5wZW9wbGUsIGNpdHkubWFya2V0W2lkXSAtIHZhbCwgaXNQcm9kdWNlZEhlcmUpO1xuICAgICAgICB2YXIgY29sb3IgPSBcIiMzMkNEMzJcIjtcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiAoKDEgLSBwYXJhbWV0ZXIucmF0ZVByaWNlTWluKSAqIDIgLyA0ICsgcGFyYW1ldGVyLnJhdGVQcmljZU1pbikpKVxuICAgICAgICAgICAgY29sb3IgPSBcIiNEQUY3QTYgXCI7XG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogKCgxIC0gcGFyYW1ldGVyLnJhdGVQcmljZU1pbikgKiAzIC8gNCArIHBhcmFtZXRlci5yYXRlUHJpY2VNaW4pKSlcbiAgICAgICAgICAgIGNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqIDEpKVxuICAgICAgICAgICAgY29sb3IgPSBcIlllbGxvd1wiO1xuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqICgocGFyYW1ldGVyLnJhdGVQcmljZU1heCAtIDEpICogMiAvIDQgKyAxKSkpXG4gICAgICAgICAgICBjb2xvciA9IFwiTGlnaHRQaW5rXCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAoPEhUTUxFbGVtZW50PmVsLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzRdKS5zdHlsZS5iYWNrZ3JvdW5kID0gY29sb3I7XG4gICAgICAgIH0gY2F0Y2gge1xuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cblxufVxuIl19