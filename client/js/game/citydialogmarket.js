define(["require", "exports", "game/product", "game/citydialog"], function (require, exports, product_1, citydialog_1) {
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
                function price(id, change) {
                    console.log(id + " " + change);
                }
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    ret = ret + '<tr >';
                    ret = ret + "<td>" + product_1.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + product_1.allProducts[x].name + "</td>";
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
            var city = citydialog_1.CityDialog.getInstance().city;
            document.getElementById("citydialog-market-table-source").addEventListener("change", (e) => {
                citydialog_1.CityDialog.getInstance().update(true);
            });
            document.getElementById("citydialog-market-table-target").addEventListener("change", (e) => {
                citydialog_1.CityDialog.getInstance().update(true);
            });
            $('.citydialog-tabs').click(function (event) {
                citydialog_1.CityDialog.getInstance().update(true);
            });
            var inedit;
            for (var x = 0; x < product_1.allProducts.length; x++) {
                $("#sell-slider_" + x).slider({
                    min: 0,
                    max: 40,
                    range: "min",
                    value: 40,
                    slide: function (event, ui) {
                        var t = event.target;
                        var val = _this.getSliderValue(t);
                        t.setAttribute("curVal", val.toString());
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
                        var t = e.target;
                        var test = $(t).slider("value");
                        var val;
                        if (test === 0 || test === 40) //Cursor verspringt
                            val = _this.getSliderValue(t); //
                        else
                            val = parseInt(t.getAttribute("curVal"));
                        if (val === 0)
                            return;
                        console.log("sell " + val);
                        inedit = true;
                        var id = Number(t.id.split("_")[1]);
                        var selectsource = document.getElementById("citydialog-market-table-source");
                        _this.sellOrBuy(id, -val, _this.calcPrice(t, val), _this.getStore(), selectsource.value === "Warehouse");
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                        $(t).slider("value", 40);
                        inedit = false;
                    },
                    stop: function (e, ui) {
                        inedit = true;
                        setTimeout(() => {
                            var id = Number(e.target.id.split("_")[1]);
                            document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                            $(e.target).slider("value", 40);
                            inedit = false;
                        }, 200);
                    }
                });
                $("#buy-slider_" + x).slider({
                    min: 0,
                    max: 40,
                    range: "min",
                    value: 0,
                    slide: function (event, ui) {
                        var t = event.target;
                        var val = _this.getSliderValue(t);
                        t.setAttribute("curVal", val.toString());
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
                        var t = e.target;
                        var test = $(t).slider("value");
                        var val;
                        if (test === 0 || test === 40) //Cursor verspringt
                            val = _this.getSliderValue(t); //
                        else
                            val = parseInt(t.getAttribute("curVal"));
                        //var val =parseInt(t.getAttribute("curVal"));
                        console.log("buy " + val);
                        if (val === 0)
                            return;
                        inedit = true;
                        var id = Number(t.id.split("_")[1]);
                        var selectsource = document.getElementById("citydialog-market-table-source");
                        _this.sellOrBuy(id, val, _this.calcPrice(t, val), _this.getStore(), selectsource.value === "Warehouse");
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                        $(t).slider("value", 0);
                        inedit = false;
                    },
                    stop: function (e, ui) {
                        setTimeout(() => {
                            inedit = true;
                            var id = Number(e.target.id.split("_")[1]);
                            document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                            $(e.target).slider("value", 0);
                            inedit = false;
                        }, 200);
                    }
                });
            }
            for (var x = 0; x < product_1.allProducts.length; x++) {
                document.getElementById("warehouse-min-stock_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    city.warehouseMinStock[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("warehouse-selling-price_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    city.warehouseMinStock[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
            }
        }
        sellOrBuy(productid, amount, price, storetarget, isWarehouse) {
            var _a;
            var city = citydialog_1.CityDialog.getInstance().city;
            if (isWarehouse) {
                city.warehouse[productid] -= amount;
            }
            else {
                city.world.game.changeMoney(-amount * price, "sell or buy from market", city);
                city.market[productid] -= amount;
            }
            storetarget[productid] += amount;
            (_a = this.getAirplaneInMarket()) === null || _a === void 0 ? void 0 : _a.refreshLoadedCount();
            citydialog_1.CityDialog.getInstance().update(true);
        }
        getAirplaneInMarket() {
            var city = citydialog_1.CityDialog.getInstance().city;
            var select = document.getElementById("citydialog-market-table-target");
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
            var _a;
            var city = citydialog_1.CityDialog.getInstance().city;
            var select = document.getElementById("citydialog-market-table-target");
            var val = select.value;
            if (val) {
                if (city.warehouses > 0 && val === "Warehouse") {
                    return city.warehouse;
                }
                return (_a = this.getAirplaneInMarket()) === null || _a === void 0 ? void 0 : _a.products;
            }
            return undefined;
        }
        update() {
            var city = citydialog_1.CityDialog.getInstance().city;
            if (!city)
                return;
            var select = document.getElementById("citydialog-market-table-target");
            var selectsource = document.getElementById("citydialog-market-table-source");
            var last = select.value;
            select.innerHTML = "";
            if (city.warehouses > 0) {
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
            var storetarget = this.getStore();
            var storesource = city.market;
            if (selectsource.value === "Warehouse") {
                storesource = city.warehouse;
            }
            for (var x = 0; x < product_1.allProducts.length; x++) {
                var table = document.getElementById("citydialog-market-table");
                var tr = table.children[0].children[x + 1];
                tr.children[3].innerHTML = storesource[x].toString();
                var buyslider = document.getElementById("buy-slider_" + x);
                var sellslider = document.getElementById("sell-slider_" + x);
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
        getSliderValue(dom) {
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
        calcPrice(el, val) {
            var city = citydialog_1.CityDialog.getInstance().city;
            var id = Number(el.id.split("_")[1]);
            var isProducedHere = false;
            for (var x = 0; x < city.companies.length; x++) {
                if (city.companies[x].productid === id)
                    isProducedHere = true;
            }
            var prod = isProducedHere ? product_1.allProducts[id].pricePurchase : product_1.allProducts[id].priceSelling;
            if (el.id.indexOf("sell") > -1)
                val = -val;
            var ret = product_1.allProducts[id].calcPrice(city.people, city.market[id] - val, isProducedHere);
            var color = "#32CD32";
            if (ret > ((0.0 + prod) * ((1 - product_1.Product.rateMin) * 2 / 4 + product_1.Product.rateMin)))
                color = "#DAF7A6 ";
            if (ret > ((0.0 + prod) * ((1 - product_1.Product.rateMin) * 3 / 4 + product_1.Product.rateMin)))
                color = "white";
            if (ret > ((0.0 + prod) * 1))
                color = "Yellow";
            if (ret > ((0.0 + prod) * ((product_1.Product.rateMax - 1) * 2 / 4 + 1)))
                color = "LightPink";
            el.parentElement.parentElement.parentElement.children[4].style.background = color;
            return ret;
        }
    }
    exports.CityDialogMarket = CityDialogMarket;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZ21hcmtldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZ21hcmtldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBR0EsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNQLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxVQUFVLENBQUMsRUFBRSxJQUFJO1lBQ3BCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDTCxNQUFhLGdCQUFnQjtRQUV6QixNQUFNLENBQUMsV0FBVztZQUNkLElBQUksZ0JBQWdCLENBQUMsUUFBUSxLQUFLLFNBQVM7Z0JBQ3ZDLGdCQUFnQixDQUFDLFFBQVEsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDdkQsT0FBTyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7UUFDckMsQ0FBQztRQUNELE1BQU07WUFFRixPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBa0JVLENBQUMsU0FBUyxHQUFHO2dCQUN0QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2IsU0FBUyxLQUFLLENBQUMsRUFBVSxFQUFFLE1BQWM7b0JBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcscUJBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsT0FBTyxDQUFDO29CQUNwQixHQUFHLEdBQUcsR0FBRyxHQUFHLE1B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LEdBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELEtBQUssR0FBRyxXQUFXLENBQUM7WUFFVixFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBQ2pHLE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUdKO0lBdldELDRDQXVXQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XHJcbmltcG9ydCB7IGFsbFByb2R1Y3RzLCBQcm9kdWN0IH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xyXG5pbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xyXG52YXIgbG9nID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBsb2cgPSBNYXRoLmxvZztcclxuICAgIHJldHVybiBmdW5jdGlvbiAobiwgYmFzZSkge1xyXG4gICAgICAgIHJldHVybiBsb2cobikgLyAoYmFzZSA/IGxvZyhiYXNlKSA6IDEpO1xyXG4gICAgfTtcclxufSkoKTtcclxuZXhwb3J0IGNsYXNzIENpdHlEaWFsb2dNYXJrZXQge1xyXG4gICAgc3RhdGljIGluc3RhbmNlOiBDaXR5RGlhbG9nTWFya2V0O1xyXG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IENpdHlEaWFsb2dNYXJrZXQge1xyXG4gICAgICAgIGlmIChDaXR5RGlhbG9nTWFya2V0Lmluc3RhbmNlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuaW5zdGFuY2UgPSBuZXcgQ2l0eURpYWxvZ01hcmtldCgpO1xyXG4gICAgICAgIHJldHVybiBDaXR5RGlhbG9nTWFya2V0Lmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gYCA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiIHN0eWxlPVwid2lkdGg6ODBweFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiTWFya2V0XCI+TWFya2V0PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlByaWNlPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8c2VsZWN0IGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIgc3R5bGU9XCJ3aWR0aDo4MHB4XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwbGFjZWhvbGRlclwiPnBsYWNlaG9sZGVyPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmljZShpZDogc3RyaW5nLCBjaGFuZ2U6IG51bWJlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkICsgXCIgXCIgKyBjaGFuZ2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dHIgPic7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5uYW1lICsgXCI8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDoyMHB4XCI+PGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwic2VsbC1zbGlkZXJfJyArIHggKyAnXCIgc3R5bGU9XCJvdmVyZmxvdzpmbG9hdDtwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MXB4O3RvcDo1cHg7d2lkdGg6IDkycHhcIiA+PGRpdj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PjwvdGQ+JztcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD4wPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkIHN0eWxlPVwid2lkdGg6NDBweDtcIj48c3Bhbj4wPC9zcGFuPjxzcGFuIGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtaW5mb18nICsgeCArICdcIj48L3NwYW4+PC90ZD4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDoyMHB4XCI+PGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwiYnV5LXNsaWRlcl8nICsgeCArICdcIiBzdHlsZT1cIm92ZXJmbG93OmZsb2F0O3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6NHB4O2hlaWdodDoxcHg7dG9wOjVweDt3aWR0aDogOTJweFwiID48ZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+PC90ZD4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfSkoKX1cclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPmA7XHJcbiAgICB9XHJcbiAgICBiaW5kQWN0aW9ucygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjaXR5ID0gQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNpdHk7XHJcblxyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcuY2l0eWRpYWxvZy10YWJzJykuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGluZWRpdDtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICQoXCIjc2VsbC1zbGlkZXJfXCIgKyB4KS5zbGlkZXIoe1xyXG4gICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiA0MCxcclxuICAgICAgICAgICAgICAgIHJhbmdlOiBcIm1pblwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDQwLFxyXG4gICAgICAgICAgICAgICAgc2xpZGU6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IDxIVE1MSW5wdXRFbGVtZW50PmV2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gX3RoaXMuZ2V0U2xpZGVyVmFsdWUodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoXCJjdXJWYWxcIiwgdmFsLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IF90aGlzLmNhbGNQcmljZSh0LCB2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KHQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsID09PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtaW5mb19cIiArIGlkKS5pbm5lckhUTUwgPSBcInhcIiArIHZhbCArIFwiPGJyLz49IFwiICsgdmFsICogcHJpY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlbls0XS5jaGlsZHJlblswXS5pbm5lckhUTUwgPSBcIlwiICsgcHJpY2U7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY2hhbmdlOiBmdW5jdGlvbiAoZSwgdWkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZWRpdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSAkKHQpLnNsaWRlcihcInZhbHVlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT09IDAgfHwgdGVzdCA9PT0gNDApLy9DdXJzb3IgdmVyc3ByaW5ndFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBfdGhpcy5nZXRTbGlkZXJWYWx1ZSh0KTsvL1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcGFyc2VJbnQodC5nZXRBdHRyaWJ1dGUoXCJjdXJWYWxcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbGwgXCIgKyB2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZWRpdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKHQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0c291cmNlOiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS1zb3VyY2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2VsbE9yQnV5KGlkLCAtdmFsLCBfdGhpcy5jYWxjUHJpY2UodCwgdmFsKSwgX3RoaXMuZ2V0U3RvcmUoKSwgc2VsZWN0c291cmNlLnZhbHVlID09PSBcIldhcmVob3VzZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAkKHQpLnNsaWRlcihcInZhbHVlXCIsIDQwKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmVkaXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdG9wOiBmdW5jdGlvbiAoZTogYW55LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgICBpbmVkaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoZS50YXJnZXQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLnNsaWRlcihcInZhbHVlXCIsIDQwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5lZGl0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKFwiI2J1eS1zbGlkZXJfXCIgKyB4KS5zbGlkZXIoe1xyXG4gICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiA0MCxcclxuICAgICAgICAgICAgICAgIHJhbmdlOiBcIm1pblwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDAsXHJcbiAgICAgICAgICAgICAgICBzbGlkZTogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5nZXRTbGlkZXJWYWx1ZSh0KTtcclxuICAgICAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZShcImN1clZhbFwiLCB2YWwudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codmFsKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJpY2UgPSBfdGhpcy5jYWxjUHJpY2UodCwgdmFsKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludCh0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJ4XCIgKyB2YWwgKyBcIjxici8+PSAtXCIgKyB2YWwgKiBwcmljZTtcclxuICAgICAgICAgICAgICAgICAgICB0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IFwiXCIgKyBwcmljZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY2hhbmdlOiBmdW5jdGlvbiAoZSwgdWkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZWRpdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSAkKHQpLnNsaWRlcihcInZhbHVlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT09IDAgfHwgdGVzdCA9PT0gNDApLy9DdXJzb3IgdmVyc3ByaW5ndFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBfdGhpcy5nZXRTbGlkZXJWYWx1ZSh0KTsvL1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcGFyc2VJbnQodC5nZXRBdHRyaWJ1dGUoXCJjdXJWYWxcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdmFyIHZhbCA9cGFyc2VJbnQodC5nZXRBdHRyaWJ1dGUoXCJjdXJWYWxcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnV5IFwiICsgdmFsKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsID09PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgaW5lZGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIodC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rzb3VyY2U6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZWxsT3JCdXkoaWQsIHZhbCwgX3RoaXMuY2FsY1ByaWNlKHQsIHZhbCksIF90aGlzLmdldFN0b3JlKCksIHNlbGVjdHNvdXJjZS52YWx1ZSA9PT0gXCJXYXJlaG91c2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0KS5zbGlkZXIoXCJ2YWx1ZVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmVkaXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzdG9wOiBmdW5jdGlvbiAoZTogYW55LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgaW5lZGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKGUudGFyZ2V0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtaW5mb19cIiArIGlkKS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5zbGlkZXIoXCJ2YWx1ZVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5lZGl0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FyZWhvdXNlLW1pbi1zdG9ja19cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgIGNpdHkud2FyZWhvdXNlTWluU3RvY2tbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YXJlaG91c2Utc2VsbGluZy1wcmljZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgIGNpdHkud2FyZWhvdXNlTWluU3RvY2tbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZWxsT3JCdXkocHJvZHVjdGlkLCBhbW91bnQ6IG51bWJlciwgcHJpY2U6IG51bWJlciwgc3RvcmV0YXJnZXQ6IG51bWJlcltdLCBpc1dhcmVob3VzZTogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBjaXR5ID0gQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNpdHk7XHJcbiAgICAgICAgaWYgKGlzV2FyZWhvdXNlKSB7XHJcbiAgICAgICAgICAgIGNpdHkud2FyZWhvdXNlW3Byb2R1Y3RpZF0gLT0gYW1vdW50O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNpdHkud29ybGQuZ2FtZS5jaGFuZ2VNb25leSgtYW1vdW50ICogcHJpY2UsIFwic2VsbCBvciBidXkgZnJvbSBtYXJrZXRcIiwgY2l0eSk7XHJcbiAgICAgICAgICAgIGNpdHkubWFya2V0W3Byb2R1Y3RpZF0gLT0gYW1vdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdG9yZXRhcmdldFtwcm9kdWN0aWRdICs9IGFtb3VudDtcclxuICAgICAgICB0aGlzLmdldEFpcnBsYW5lSW5NYXJrZXQoKT8ucmVmcmVzaExvYWRlZENvdW50KCk7XHJcbiAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSh0cnVlKTtcclxuICAgIH1cclxuICAgIGdldEFpcnBsYW5lSW5NYXJrZXQoKSB7XHJcbiAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcclxuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIik7XHJcbiAgICAgICAgdmFyIHZhbCA9IHNlbGVjdC52YWx1ZTtcclxuICAgICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2l0eS53b3JsZC5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IGNpdHkud29ybGQuYWlycGxhbmVzW3hdLm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNpdHkud29ybGQuYWlycGxhbmVzW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBnZXRTdG9yZSgpIHtcclxuICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xyXG4gICAgICAgIHZhciBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKTtcclxuICAgICAgICB2YXIgdmFsID0gc2VsZWN0LnZhbHVlO1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgICAgaWYgKGNpdHkud2FyZWhvdXNlcyA+IDAgJiYgdmFsID09PSBcIldhcmVob3VzZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2l0eS53YXJlaG91c2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWlycGxhbmVJbk1hcmtldCgpPy5wcm9kdWN0cztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuXHJcbiAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcclxuICAgICAgICBpZiAoIWNpdHkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIik7XHJcbiAgICAgICAgdmFyIHNlbGVjdHNvdXJjZTogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtc291cmNlXCIpO1xyXG4gICAgICAgIHZhciBsYXN0ID0gc2VsZWN0LnZhbHVlO1xyXG4gICAgICAgIHNlbGVjdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGlmIChjaXR5LndhcmVob3VzZXMgPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgICAgb3B0LnZhbHVlID0gXCJXYXJlaG91c2VcIjtcclxuICAgICAgICAgICAgb3B0LnRleHQgPSBvcHQudmFsdWU7XHJcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0c291cmNlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgb3B0LnZhbHVlID0gXCJXYXJlaG91c2VcIjtcclxuICAgICAgICAgICAgICAgIG9wdC50ZXh0ID0gb3B0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0c291cmNlLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0c291cmNlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0c291cmNlLnJlbW92ZUNoaWxkKHNlbGVjdHNvdXJjZS5jaGlsZHJlblsxXSk7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rzb3VyY2UudmFsdWUgPSBcIk1hcmtldFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhbGxBUHMgPSBjaXR5LmdldEFpcnBsYW5lc0luQ2l0eSgpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsQVBzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgICAgb3B0LnZhbHVlID0gYWxsQVBzW3hdLm5hbWU7XHJcbiAgICAgICAgICAgIG9wdC50ZXh0ID0gb3B0LnZhbHVlO1xyXG4gICAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChsYXN0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdC52YWx1ZSA9IGxhc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGVUaXRsZSgpO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+aWNvbjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmFtZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bWFya2V0PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5idXk8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmFpcnBsYW5lMTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+c2VsbDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+cHJpY2U8L3RoPlxyXG4gICAgICAgICovXHJcbiAgICAgICAgdmFyIHN0b3JldGFyZ2V0ID0gdGhpcy5nZXRTdG9yZSgpO1xyXG4gICAgICAgIHZhciBzdG9yZXNvdXJjZSA9IGNpdHkubWFya2V0O1xyXG4gICAgICAgIGlmIChzZWxlY3Rzb3VyY2UudmFsdWUgPT09IFwiV2FyZWhvdXNlXCIpIHtcclxuICAgICAgICAgICAgc3RvcmVzb3VyY2UgPSBjaXR5LndhcmVob3VzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlXCIpO1xyXG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XHJcblxyXG4gICAgICAgICAgICB0ci5jaGlsZHJlblszXS5pbm5lckhUTUwgPSBzdG9yZXNvdXJjZVt4XS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB2YXIgYnV5c2xpZGVyID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktc2xpZGVyX1wiICsgeCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxsc2xpZGVyID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxsLXNsaWRlcl9cIiArIHgpO1xyXG4gICAgICAgICAgICB0ci5jaGlsZHJlbls0XS5jaGlsZHJlblswXS5pbm5lckhUTUwgPSAoc2VsZWN0c291cmNlLnZhbHVlID09PSBcIldhcmVob3VzZVwiID8gXCJcIiA6IHRoaXMuY2FsY1ByaWNlKGJ1eXNsaWRlciwgMCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGlmIChzdG9yZXRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1heCA9IHN0b3Jlc291cmNlW3hdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlc3RhcCA9IHRoaXMuZ2V0QWlycGxhbmVJbk1hcmtldCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3RhcClcclxuICAgICAgICAgICAgICAgICAgICBtYXggPSBNYXRoLm1pbihtYXgsIHRlc3RhcC5jYXBhY2l0eSAtIHRlc3RhcC5sb2FkZWRDb3VudCk7XHJcbiAgICAgICAgICAgICAgICBidXlzbGlkZXIucmVhZE9ubHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8vIHNlbGxzbGlkZXIucmVhZE9ubHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJ1eXNsaWRlci5zZXRBdHRyaWJ1dGUoXCJtYXhWYWx1ZVwiLCBtYXgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB0ci5jaGlsZHJlbls2XS5pbm5lckhUTUwgPSBzdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0b3JldGFyZ2V0W3hdICE9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICQoc2VsbHNsaWRlcikuc2xpZGVyKFwiZW5hYmxlXCIpOy8vc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAkKHNlbGxzbGlkZXIpLnNsaWRlcihcImRpc2FibGVcIik7Ly9zdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1heCAhPT0gMClcclxuICAgICAgICAgICAgICAgICAgICAkKGJ1eXNsaWRlcikuc2xpZGVyKFwiZW5hYmxlXCIpOy8vc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAkKGJ1eXNsaWRlcikuc2xpZGVyKFwiZGlzYWJsZVwiKTsvL3N0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsbHNsaWRlci5zZXRBdHRyaWJ1dGUoXCJtYXhWYWx1ZVwiLCBzdG9yZXRhcmdldFt4XS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJ1eXNsaWRlci5yZWFkT25seSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAvLyBzZWxsc2xpZGVyLnJlYWRPbmx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzZdLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAkKGJ1eXNsaWRlcikuc2xpZGVyKFwiZGlzYWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICQoc2VsbHNsaWRlcikuc2xpZGVyKFwiZGlzYWJsZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlVGl0bGUoKTtcclxuICAgIH1cclxuICAgIGdldFNsaWRlclZhbHVlKGRvbTogSFRNTElucHV0RWxlbWVudCk6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIG1heFZhbHVlID0gcGFyc2VJbnQoZG9tLmdldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIpKTtcclxuICAgICAgICB2YXIgdmFsID0gJChkb20pLnNsaWRlcihcInZhbHVlXCIpOy8vIHBhcnNlSW50KGRvbS52YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmIChkb20uaWQuaW5kZXhPZihcInNlbGxcIikgPiAtMSlcclxuICAgICAgICAgICAgdmFsID0gNDAgLSB2YWw7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gNDApXHJcbiAgICAgICAgICAgIHJldHVybiBtYXhWYWx1ZTtcclxuICAgICAgICB2YXIgZXhwID0gTWF0aC5yb3VuZChsb2cobWF4VmFsdWUsIDQwKSAqIDEwMDApIC8gMTAwMDtcclxuICAgICAgICB2YXIgcmV0ID0gTWF0aC5yb3VuZChNYXRoLnBvdyh2YWwsIGV4cCkpO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNhbGNQcmljZShlbDogSFRNTElucHV0RWxlbWVudCwgdmFsOiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xyXG4gICAgICAgIHZhciBpZCA9IE51bWJlcihlbC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgIHZhciBpc1Byb2R1Y2VkSGVyZSA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2l0eS5jb21wYW5pZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKGNpdHkuY29tcGFuaWVzW3hdLnByb2R1Y3RpZCA9PT0gaWQpXHJcbiAgICAgICAgICAgICAgICBpc1Byb2R1Y2VkSGVyZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwcm9kID0gaXNQcm9kdWNlZEhlcmU/YWxsUHJvZHVjdHNbaWRdLnByaWNlUHVyY2hhc2U6IGFsbFByb2R1Y3RzW2lkXS5wcmljZVNlbGxpbmc7XHJcblxyXG4gICAgICAgIGlmIChlbC5pZC5pbmRleE9mKFwic2VsbFwiKSA+IC0xKVxyXG4gICAgICAgICAgICB2YWwgPSAtdmFsO1xyXG4gICAgICAgIHZhciByZXQgPSBhbGxQcm9kdWN0c1tpZF0uY2FsY1ByaWNlKGNpdHkucGVvcGxlLCBjaXR5Lm1hcmtldFtpZF0gLSB2YWwsIGlzUHJvZHVjZWRIZXJlKTtcclxuICAgICAgICB2YXIgY29sb3IgPSBcIiMzMkNEMzJcIjtcclxuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqICgoMS1Qcm9kdWN0LnJhdGVNaW4pKjIvNCtQcm9kdWN0LnJhdGVNaW4pKSlcclxuICAgICAgICAgICAgY29sb3IgPSBcIiNEQUY3QTYgXCI7XHJcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKigoMS1Qcm9kdWN0LnJhdGVNaW4pKjMvNCtQcm9kdWN0LnJhdGVNaW4pKSlcclxuICAgICAgICAgICAgY29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiAxKSlcclxuICAgICAgICAgICAgY29sb3IgPSBcIlllbGxvd1wiO1xyXG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICooKFByb2R1Y3QucmF0ZU1heC0xKSoyLzQrMSkpKVxyXG4gICAgICAgICAgICBjb2xvciA9IFwiTGlnaHRQaW5rXCI7XHJcblxyXG4gICAgICAgICg8SFRNTEVsZW1lbnQ+ZWwucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bNF0pLnN0eWxlLmJhY2tncm91bmQgPSBjb2xvcjtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIl19