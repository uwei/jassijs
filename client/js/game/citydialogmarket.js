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
            var id = parseInt(t.id.split("_")[1]);
            if (val === 0)
                document.getElementById(infofield + id).innerHTML = "";
            else {
                if (changePrice) {
                    var price = CityDialogMarket.calcPrice(t, val);
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
                return (_a = this.getAirplaneInMarket("citydialog-market-table-target")) === null || _a === void 0 ? void 0 : _a.products;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZ21hcmtldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZ21hcmtldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBR0EsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNQLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxVQUFVLENBQUMsRUFBRSxJQUFJO1lBQ3BCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDTCxNQUFhLGdCQUFnQjtRQUV6QixNQUFNLENBQUMsV0FBVztZQUNkLElBQUksZ0JBQWdCLENBQUMsUUFBUSxLQUFLLFNBQVM7Z0JBQ3ZDLGdCQUFnQixDQUFDLFFBQVEsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDdkQsT0FBTyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7UUFDckMsQ0FBQztRQUVELE1BQU07WUFFRixPQUFPOzs7Ozs7Ozs7Ozs7Ozs7O3lCQWdCVSxDQUFDLFNBQVMsR0FBRztnQkFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNiLFNBQVMsS0FBSyxDQUFDLEVBQVUsRUFBRSxNQUFjO29CQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDMUQsR0FBRyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUM7b0JBQ3BCLEdBQUcs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RyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pFLEtBQUssR0FBRyxXQUFXLENBQUM7WUFDeEIsSUFBSTtnQkFDYyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2FBQ3BHO1lBQUMsV0FBTTthQUVQO1lBQ0QsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO0tBR0o7SUFoVUQsNENBZ1VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcbmltcG9ydCB7IFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XG5pbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xudmFyIGxvZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvZyA9IE1hdGgubG9nO1xuICAgIHJldHVybiBmdW5jdGlvbiAobiwgYmFzZSkge1xuICAgICAgICByZXR1cm4gbG9nKG4pIC8gKGJhc2UgPyBsb2coYmFzZSkgOiAxKTtcbiAgICB9O1xufSkoKTtcbmV4cG9ydCBjbGFzcyBDaXR5RGlhbG9nTWFya2V0IHtcbiAgICBzdGF0aWMgaW5zdGFuY2U6IENpdHlEaWFsb2dNYXJrZXQ7XG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IENpdHlEaWFsb2dNYXJrZXQge1xuICAgICAgICBpZiAoQ2l0eURpYWxvZ01hcmtldC5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbnN0YW5jZSA9IG5ldyBDaXR5RGlhbG9nTWFya2V0KCk7XG4gICAgICAgIHJldHVybiBDaXR5RGlhbG9nTWFya2V0Lmluc3RhbmNlO1xuICAgIH1cbiAgICBzdGF0aWMgaW5lZGl0O1xuICAgIGNyZWF0ZSgpIHtcblxuICAgICAgICByZXR1cm4gYCA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT1cIndpZHRoOjUwcHhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWFya2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+UHJpY2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4gPHNlbGVjdCBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiIHN0eWxlPVwid2lkdGg6ODBweFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBsYWNlaG9sZGVyXCI+cGxhY2Vob2xkZXI8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmljZShpZDogc3RyaW5nLCBjaGFuZ2U6IG51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCArIFwiIFwiICsgY2hhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3aW5kb3cucGFyYW1ldGVyLmFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dHIgPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgd2luZG93LnBhcmFtZXRlci5hbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgd2luZG93LnBhcmFtZXRlci5hbGxQcm9kdWN0c1t4XS5uYW1lICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkIHN0eWxlPVwid2lkdGg6MjBweFwiPjxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJzZWxsLXNsaWRlcl8nICsgeCArICdcIiBzdHlsZT1cIm92ZXJmbG93OmZsb2F0O3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxcHg7dG9wOjVweDt3aWR0aDogNjZweFwiID48ZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDo0MHB4O1wiPjxzcGFuPjA8L3NwYW4+PHNwYW4gaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvXycgKyB4ICsgJ1wiPjwvc3Bhbj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDoyMHB4XCI+PGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImJ1eS1zbGlkZXJfJyArIHggKyAnXCIgc3R5bGU9XCJvdmVyZmxvdzpmbG9hdDtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjRweDtoZWlnaHQ6MXB4O3RvcDo1cHg7d2lkdGg6IDkycHhcIiA+PGRpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPmA7XG4gICAgfVxuICAgIGJpbmRBY3Rpb25zKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xuXG5cblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG5cbiAgICAgICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2l0eWRpYWxvZy10YWJzJykuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgJChcIiNzZWxsLXNsaWRlcl9cIiArIHgpLnNsaWRlcih7XG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIG1heDogNDAsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDQwLFxuICAgICAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuc2xpZGUoZXZlbnQsIGZhbHNlLCBcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2hhbmdlOiBmdW5jdGlvbiAoZSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5jaGFuZ2VTbGlkZXIoZSwgdHJ1ZSxcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24gKGU6IGFueSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDaXR5RGlhbG9nTWFya2V0LmluZWRpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoZS50YXJnZXQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtaW5mb19cIiArIGlkKS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuc2xpZGVyKFwidmFsdWVcIiwgNDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoXCIjYnV5LXNsaWRlcl9cIiArIHgpLnNsaWRlcih7XG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIG1heDogNDAsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICAgICAgc2xpZGU6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5zbGlkZShldmVudCwgdHJ1ZSwgXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgY2hhbmdlOiBmdW5jdGlvbiAoZSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5jaGFuZ2VTbGlkZXIoZSwgZmFsc2UsXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uIChlOiBhbnksIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKGUudGFyZ2V0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLnNsaWRlcihcInZhbHVlXCIsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIGNoYW5nZVNsaWRlcihldmVudCwgYnV5LGluZm9maWVsZCx0YXJnZXRNYXJrZXQ9dHJ1ZSkge1xuICAgICAgICBpZiAoQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgdGVzdCA9ICQodCkuc2xpZGVyKFwidmFsdWVcIik7XG4gICAgICAgIHZhciB2YWw7XG4gICAgICAgIGlmICh0ZXN0ID09PSAwIHx8IHRlc3QgPT09IDQwKS8vQ3Vyc29yIHZlcnNwcmluZ3RcbiAgICAgICAgICAgIHZhbCA9IENpdHlEaWFsb2dNYXJrZXQuZ2V0U2xpZGVyVmFsdWUodCk7Ly9cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdmFsID0gcGFyc2VJbnQodC5nZXRBdHRyaWJ1dGUoXCJjdXJWYWxcIikpO1xuICAgICAgICBpZiAodmFsID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBDaXR5RGlhbG9nTWFya2V0LmluZWRpdCA9IHRydWU7XG4gICAgICAgIHZhciBpZCA9IE51bWJlcih0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgIGlmKHRhcmdldE1hcmtldClcbiAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuc2VsbE9yQnV5KGlkLCAoYnV5ID8gLTEgOiAxKSAqIHZhbCwgQ2l0eURpYWxvZ01hcmtldC5jYWxjUHJpY2UodCwgdmFsKSwgQ2l0eURpYWxvZ01hcmtldC5nZXRTdG9yZShcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKSwgZmFsc2UpO1xuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbiAgICAgICAgICAgIGNpdHkuc2hvcFtpZF0gLT0gKGJ1eSA/IC0xIDogMSkgKiB2YWw7XG4gICAgICAgICAgICB2YXIgc3RvcmV0YXJnZXQ9Q2l0eURpYWxvZ01hcmtldC5nZXRTdG9yZShcImNpdHlkaWFsb2ctc2hvcC10YWJsZS10YXJnZXRcIik7XG4gICAgICAgICAgICBzdG9yZXRhcmdldFtpZF0gKz0gKGJ1eSA/IC0xIDogMSkgKiB2YWw7XG4gICAgICAgICAgICB0aGlzLmdldEFpcnBsYW5lSW5NYXJrZXQoXCJjaXR5ZGlhbG9nLXNob3AtdGFibGUtdGFyZ2V0XCIpPy5yZWZyZXNoTG9hZGVkQ291bnQoKTtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbmZvZmllbGQgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgJCh0KS5zbGlkZXIoXCJ2YWx1ZVwiLCA0MCk7XG4gICAgICAgIENpdHlEaWFsb2dNYXJrZXQuaW5lZGl0ID0gZmFsc2U7XG4gICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUodHJ1ZSk7XG4gICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5LndvcmxkLmdhbWUudXBkYXRlVGl0bGUoKTtcblxuICAgIH1cbiAgICBzdGF0aWMgc2xpZGUoZXZlbnQsIGJ1eSwgaW5mb2ZpZWxkLCBjaGFuZ2VQcmljZSA9IHRydWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5ldmVudC50YXJnZXQ7XG4gICAgICAgIHZhciB2YWwgPSBDaXR5RGlhbG9nTWFya2V0LmdldFNsaWRlclZhbHVlKHQpO1xuICAgICAgICB0LnNldEF0dHJpYnV0ZShcImN1clZhbFwiLCB2YWwudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgaWQgPSBwYXJzZUludCh0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgIGlmICh2YWwgPT09IDApXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbmZvZmllbGQgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2hhbmdlUHJpY2Upe1xuICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IENpdHlEaWFsb2dNYXJrZXQuY2FsY1ByaWNlKHQsIHZhbCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5mb2ZpZWxkICsgaWQpLmlubmVySFRNTCA9IFwieFwiICsgdmFsICsgXCI8YnIvPj0gXCIgKyAoYnV5ID8gXCItXCIgOiBcIlwiKSArIHZhbCAqIHByaWNlO1xuICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbmZvZmllbGQgKyBpZCkuaW5uZXJIVE1MID0gXCJcIit2YWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5nZVByaWNlKVxuICAgICAgICAgICAgdC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlbls0XS5jaGlsZHJlblswXS5pbm5lckhUTUwgPSBcIlwiICsgcHJpY2U7XG4gICAgfVxuICAgIHN0YXRpYyBzZWxsT3JCdXkocHJvZHVjdGlkLCBhbW91bnQ6IG51bWJlciwgcHJpY2U6IG51bWJlciwgc3RvcmV0YXJnZXQ6IG51bWJlcltdLCBpc3Nob3A6IGJvb2xlYW4pIHtcbiAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbiAgICAgICAgaWYgKGlzc2hvcCkge1xuICAgICAgICAgICAgY2l0eS5zaG9wW3Byb2R1Y3RpZF0gLT0gYW1vdW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2l0eS53b3JsZC5nYW1lLmNoYW5nZU1vbmV5KC1hbW91bnQgKiBwcmljZSwgXCJzZWxsIG9yIGJ1eSBmcm9tIG1hcmtldFwiLCBjaXR5KTtcbiAgICAgICAgICAgIGNpdHkubWFya2V0W3Byb2R1Y3RpZF0gLT0gYW1vdW50O1xuICAgICAgICB9XG4gICAgICAgIHN0b3JldGFyZ2V0W3Byb2R1Y3RpZF0gKz0gYW1vdW50O1xuICAgICAgICB0aGlzLmdldEFpcnBsYW5lSW5NYXJrZXQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIik/LnJlZnJlc2hMb2FkZWRDb3VudCgpO1xuICAgICAgICB0aGlzLmdldEFpcnBsYW5lSW5NYXJrZXQoXCJjaXR5ZGlhbG9nLXNob3AtdGFibGUtdGFyZ2V0XCIpPy5yZWZyZXNoTG9hZGVkQ291bnQoKTtcbiAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSh0cnVlKTtcbiAgICB9XG4gICAgc3RhdGljIGdldEFpcnBsYW5lSW5NYXJrZXQodGFyZ2V0KSB7XG4gICAgICAgIHZhciBjaXR5ID0gQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNpdHk7XG4gICAgICAgIHZhciBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXQpO1xuICAgICAgICB2YXIgdmFsID0gc2VsZWN0LnZhbHVlO1xuICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNpdHkud29ybGQuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gY2l0eS53b3JsZC5haXJwbGFuZXNbeF0ubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNpdHkud29ybGQuYWlycGxhbmVzW3hdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHN0YXRpYyBnZXRTdG9yZSh0YXJnZXQpIHtcbiAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbiAgICAgICAgdmFyIHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldCk7XG4gICAgICAgIHZhciB2YWwgPSBzZWxlY3QudmFsdWU7XG4gICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgIGlmIChjaXR5LnNob3BzID4gMCAmJiB2YWwgPT09IFwiTXlTaG9wXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2l0eS5zaG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWlycGxhbmVJbk1hcmtldChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKT8ucHJvZHVjdHM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdXBkYXRlKCkge1xuXG4gICAgICAgIHZhciBjaXR5ID0gQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNpdHk7XG4gICAgICAgIGlmICghY2l0eSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIpO1xuICAgICAgICB2YXIgbGFzdCA9IHNlbGVjdC52YWx1ZTtcbiAgICAgICAgc2VsZWN0LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGlmIChjaXR5LnNob3BzID4gMCkge1xuICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICAgICAgb3B0LnZhbHVlID0gXCJNeVNob3BcIjtcbiAgICAgICAgICAgIG9wdC50ZXh0ID0gb3B0LnZhbHVlO1xuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFsbEFQcyA9IGNpdHkuZ2V0QWlycGxhbmVzSW5DaXR5KCk7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsQVBzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgICAgICBvcHQudmFsdWUgPSBhbGxBUHNbeF0ubmFtZTtcbiAgICAgICAgICAgIG9wdC50ZXh0ID0gb3B0LnZhbHVlO1xuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGFzdCAhPT0gXCJcIikge1xuICAgICAgICAgICAgc2VsZWN0LnZhbHVlID0gbGFzdDtcbiAgICAgICAgfVxuICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlVGl0bGUoKTtcbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+aWNvbjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPm5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5tYXJrZXQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5idXk8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5haXJwbGFuZTE8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5zZWxsPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+cHJpY2U8L3RoPlxuICAgICAgICAqL1xuICAgICAgICB2YXIgc3RvcmV0YXJnZXQgPSBDaXR5RGlhbG9nTWFya2V0LmdldFN0b3JlKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIpO1xuICAgICAgICB2YXIgc3RvcmVzb3VyY2UgPSBjaXR5Lm1hcmtldDtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZVwiKTtcbiAgICAgICAgICAgIHZhciB0ciA9IHRhYmxlLmNoaWxkcmVuWzBdLmNoaWxkcmVuW3ggKyAxXTtcblxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bM10uaW5uZXJIVE1MID0gc3RvcmVzb3VyY2VbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHZhciBidXlzbGlkZXIgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1zbGlkZXJfXCIgKyB4KTtcbiAgICAgICAgICAgIHZhciBzZWxsc2xpZGVyID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxsLXNsaWRlcl9cIiArIHgpO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gQ2l0eURpYWxvZ01hcmtldC5jYWxjUHJpY2UoYnV5c2xpZGVyLCAwKS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKHN0b3JldGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG1heCA9IHN0b3Jlc291cmNlW3hdO1xuICAgICAgICAgICAgICAgIHZhciB0ZXN0YXAgPSBDaXR5RGlhbG9nTWFya2V0LmdldEFpcnBsYW5lSW5NYXJrZXQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIik7XG4gICAgICAgICAgICAgICAgaWYgKHRlc3RhcClcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5taW4obWF4LCB0ZXN0YXAuY2FwYWNpdHkgLSB0ZXN0YXAubG9hZGVkQ291bnQpO1xuICAgICAgICAgICAgICAgIGJ1eXNsaWRlci5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIHNlbGxzbGlkZXIucmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBidXlzbGlkZXIuc2V0QXR0cmlidXRlKFwibWF4VmFsdWVcIiwgbWF4LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzZdLmlubmVySFRNTCA9IHN0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0b3JldGFyZ2V0W3hdICE9PSAwKVxuICAgICAgICAgICAgICAgICAgICAkKHNlbGxzbGlkZXIpLnNsaWRlcihcImVuYWJsZVwiKTsvL3N0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAkKHNlbGxzbGlkZXIpLnNsaWRlcihcImRpc2FibGVcIik7Ly9zdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGlmIChtYXggIT09IDApXG4gICAgICAgICAgICAgICAgICAgICQoYnV5c2xpZGVyKS5zbGlkZXIoXCJlbmFibGVcIik7Ly9zdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgJChidXlzbGlkZXIpLnNsaWRlcihcImRpc2FibGVcIik7Ly9zdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgc2VsbHNsaWRlci5zZXRBdHRyaWJ1dGUoXCJtYXhWYWx1ZVwiLCBzdG9yZXRhcmdldFt4XS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnV5c2xpZGVyLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBzZWxsc2xpZGVyLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0ci5jaGlsZHJlbls2XS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICQoYnV5c2xpZGVyKS5zbGlkZXIoXCJkaXNhYmxlXCIpO1xuICAgICAgICAgICAgICAgICQoc2VsbHNsaWRlcikuc2xpZGVyKFwiZGlzYWJsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlVGl0bGUoKTtcbiAgICB9XG4gICAgc3RhdGljIGdldFNsaWRlclZhbHVlKGRvbTogSFRNTElucHV0RWxlbWVudCk6IG51bWJlciB7XG4gICAgICAgIHZhciBtYXhWYWx1ZSA9IHBhcnNlSW50KGRvbS5nZXRBdHRyaWJ1dGUoXCJtYXhWYWx1ZVwiKSk7XG4gICAgICAgIHZhciB2YWwgPSAkKGRvbSkuc2xpZGVyKFwidmFsdWVcIik7Ly8gcGFyc2VJbnQoZG9tLnZhbHVlKTtcblxuICAgICAgICBpZiAoZG9tLmlkLmluZGV4T2YoXCJzZWxsXCIpID4gLTEpXG4gICAgICAgICAgICB2YWwgPSA0MCAtIHZhbDtcbiAgICAgICAgaWYgKHZhbCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICBpZiAodmFsID09PSA0MClcbiAgICAgICAgICAgIHJldHVybiBtYXhWYWx1ZTtcbiAgICAgICAgdmFyIGV4cCA9IE1hdGgucm91bmQobG9nKG1heFZhbHVlLCA0MCkgKiAxMDAwKSAvIDEwMDA7XG4gICAgICAgIHZhciByZXQgPSBNYXRoLnJvdW5kKE1hdGgucG93KHZhbCwgZXhwKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHByaXZhdGUgc3RhdGljIGNhbGNQcmljZShlbDogSFRNTElucHV0RWxlbWVudCwgdmFsOiBudW1iZXIpIHtcbiAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbiAgICAgICAgdmFyIGlkID0gTnVtYmVyKGVsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgIHZhciBpc1Byb2R1Y2VkSGVyZSA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNpdHkuY29tcGFuaWVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAoY2l0eS5jb21wYW5pZXNbeF0ucHJvZHVjdGlkID09PSBpZClcbiAgICAgICAgICAgICAgICBpc1Byb2R1Y2VkSGVyZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb2QgPSBpc1Byb2R1Y2VkSGVyZSA/IHBhcmFtZXRlci5hbGxQcm9kdWN0c1tpZF0ucHJpY2VQdXJjaGFzZSA6IHBhcmFtZXRlci5hbGxQcm9kdWN0c1tpZF0ucHJpY2VTZWxsaW5nO1xuXG4gICAgICAgIGlmIChlbC5pZC5pbmRleE9mKFwic2VsbFwiKSA+IC0xKVxuICAgICAgICAgICAgdmFsID0gLXZhbDtcbiAgICAgICAgdmFyIHJldCA9IHBhcmFtZXRlci5hbGxQcm9kdWN0c1tpZF0uY2FsY1ByaWNlKGNpdHkucGVvcGxlLCBjaXR5Lm1hcmtldFtpZF0gLSB2YWwsIGlzUHJvZHVjZWRIZXJlKTtcbiAgICAgICAgdmFyIGNvbG9yID0gXCIjMzJDRDMyXCI7XG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogKCgxIC0gcGFyYW1ldGVyLnJhdGVQcmljZU1pbikgKiAyIC8gNCArIHBhcmFtZXRlci5yYXRlUHJpY2VNaW4pKSlcbiAgICAgICAgICAgIGNvbG9yID0gXCIjREFGN0E2IFwiO1xuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqICgoMSAtIHBhcmFtZXRlci5yYXRlUHJpY2VNaW4pICogMyAvIDQgKyBwYXJhbWV0ZXIucmF0ZVByaWNlTWluKSkpXG4gICAgICAgICAgICBjb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiAxKSlcbiAgICAgICAgICAgIGNvbG9yID0gXCJZZWxsb3dcIjtcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiAoKHBhcmFtZXRlci5yYXRlUHJpY2VNYXggLSAxKSAqIDIgLyA0ICsgMSkpKVxuICAgICAgICAgICAgY29sb3IgPSBcIkxpZ2h0UGlua1wiO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgKDxIVE1MRWxlbWVudD5lbC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlbls0XSkuc3R5bGUuYmFja2dyb3VuZCA9IGNvbG9yO1xuICAgICAgICB9IGNhdGNoIHtcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG5cbn1cbiJdfQ==