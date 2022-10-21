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
            var prod = product_1.allProducts[id].priceSelling;
            if (el.id.indexOf("sell") > -1)
                val = -val;
            var ret = product_1.allProducts[id].calcPrice(city.people, city.market[id] - val, isProducedHere);
            var color = "#32CD32";
            if (ret > ((0.0 + prod) * 2 / 3))
                color = "#DAF7A6 ";
            if (ret > ((0.0 + prod) * 2.5 / 3))
                color = "white";
            if (ret > ((0.0 + prod) * 1))
                color = "Yellow";
            if (ret > ((0.0 + prod) * 4 / 3))
                color = "LightPink";
            el.parentElement.parentElement.parentElement.children[4].style.background = color;
            return ret;
        }
    }
    exports.CityDialogMarket = CityDialogMarket;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZ21hcmtldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZ21hcmtldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBR0EsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNQLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxVQUFVLENBQUMsRUFBRSxJQUFJO1lBQ3BCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDTCxNQUFhLGdCQUFnQjtRQUV6QixNQUFNLENBQUMsV0FBVztZQUNkLElBQUksZ0JBQWdCLENBQUMsUUFBUSxLQUFLLFNBQVM7Z0JBQ3ZDLGdCQUFnQixDQUFDLFFBQVEsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDdkQsT0FBTyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7UUFDckMsQ0FBQztRQUNELE1BQU07WUFFRixPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBa0JVLENBQUMsU0FBUyxHQUFHO2dCQUN0QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2IsU0FBUyxLQUFLLENBQUMsRUFBVSxFQUFFLE1BQWM7b0JBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcscUJBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsT0FBTyxDQUFDO29CQUNwQixHQUFHLEdBQUcsR0FBRyxHQUFHLE1B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WUFBWSxDQUFDO1lBRXhDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7WUFDZixJQUFJLEdBQUcsR0FBRyxxQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3hGLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQztZQUN0QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVCLEtBQUssR0FBRyxVQUFVLENBQUM7WUFDdkIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixLQUFLLEdBQUcsT0FBTyxDQUFDO1lBQ3BCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ3JCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsS0FBSyxHQUFHLFdBQVcsQ0FBQztZQUVWLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDakcsT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO0tBR0o7SUF2V0QsNENBdVdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgYWxsUHJvZHVjdHMgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XHJcbmltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbnZhciBsb2cgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGxvZyA9IE1hdGgubG9nO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuLCBiYXNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGxvZyhuKSAvIChiYXNlID8gbG9nKGJhc2UpIDogMSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5leHBvcnQgY2xhc3MgQ2l0eURpYWxvZ01hcmtldCB7XHJcbiAgICBzdGF0aWMgaW5zdGFuY2U6IENpdHlEaWFsb2dNYXJrZXQ7XHJcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQ2l0eURpYWxvZ01hcmtldCB7XHJcbiAgICAgICAgaWYgKENpdHlEaWFsb2dNYXJrZXQuaW5zdGFuY2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbnN0YW5jZSA9IG5ldyBDaXR5RGlhbG9nTWFya2V0KCk7XHJcbiAgICAgICAgcmV0dXJuIENpdHlEaWFsb2dNYXJrZXQuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICBjcmVhdGUoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBgIDx0YWJsZSBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtc291cmNlXCIgc3R5bGU9XCJ3aWR0aDo4MHB4XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJNYXJrZXRcIj5NYXJrZXQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+UHJpY2U8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IDxzZWxlY3QgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIiBzdHlsZT1cIndpZHRoOjgwcHhcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBsYWNlaG9sZGVyXCI+cGxhY2Vob2xkZXI8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByaWNlKGlkOiBzdHJpbmcsIGNoYW5nZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaWQgKyBcIiBcIiArIGNoYW5nZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ciA+JztcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLm5hbWUgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZCBzdHlsZT1cIndpZHRoOjIwcHhcIj48ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmVcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJzZWxsLXNsaWRlcl8nICsgeCArICdcIiBzdHlsZT1cIm92ZXJmbG93OmZsb2F0O3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxcHg7dG9wOjVweDt3aWR0aDogOTJweFwiID48ZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+PC90ZD4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDo0MHB4O1wiPjxzcGFuPjA8L3NwYW4+PHNwYW4gaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvXycgKyB4ICsgJ1wiPjwvc3Bhbj48L3RkPic7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZCBzdHlsZT1cIndpZHRoOjIwcHhcIj48ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmVcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJidXktc2xpZGVyXycgKyB4ICsgJ1wiIHN0eWxlPVwib3ZlcmZsb3c6ZmxvYXQ7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo0cHg7aGVpZ2h0OjFweDt0b3A6NXB4O3dpZHRoOiA5MnB4XCIgPjxkaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj48L3RkPic7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+PC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9KSgpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+YDtcclxuICAgIH1cclxuICAgIGJpbmRBY3Rpb25zKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcclxuXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtc291cmNlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5jaXR5ZGlhbG9nLXRhYnMnKS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZSh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgaW5lZGl0O1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgJChcIiNzZWxsLXNsaWRlcl9cIiArIHgpLnNsaWRlcih7XHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDQwLFxyXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFwibWluXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogNDAsXHJcbiAgICAgICAgICAgICAgICBzbGlkZTogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5nZXRTbGlkZXJWYWx1ZSh0KTtcclxuICAgICAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZShcImN1clZhbFwiLCB2YWwudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlID0gX3RoaXMuY2FsY1ByaWNlKHQsIHZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQodC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtaW5mb19cIiArIGlkKS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwieFwiICsgdmFsICsgXCI8YnIvPj0gXCIgKyB2YWwgKiBwcmljZTtcclxuICAgICAgICAgICAgICAgICAgICB0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IFwiXCIgKyBwcmljZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2U6IGZ1bmN0aW9uIChlLCB1aSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5lZGl0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9ICQodCkuc2xpZGVyKFwidmFsdWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdCA9PT0gMCB8fCB0ZXN0ID09PSA0MCkvL0N1cnNvciB2ZXJzcHJpbmd0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpOy8vXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBwYXJzZUludCh0LmdldEF0dHJpYnV0ZShcImN1clZhbFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsbCBcIiArIHZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5lZGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIodC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rzb3VyY2U6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZWxsT3JCdXkoaWQsIC12YWwsIF90aGlzLmNhbGNQcmljZSh0LCB2YWwpLCBfdGhpcy5nZXRTdG9yZSgpLCBzZWxlY3Rzb3VyY2UudmFsdWUgPT09IFwiV2FyZWhvdXNlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtaW5mb19cIiArIGlkKS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICQodCkuc2xpZGVyKFwidmFsdWVcIiwgNDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZWRpdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uIChlOiBhbnksIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGluZWRpdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcihlLnRhcmdldC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuc2xpZGVyKFwidmFsdWVcIiwgNDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmVkaXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoXCIjYnV5LXNsaWRlcl9cIiArIHgpLnNsaWRlcih7XHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDQwLFxyXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFwibWluXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMCxcclxuICAgICAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5ldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKFwiY3VyVmFsXCIsIHZhbC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IF90aGlzLmNhbGNQcmljZSh0LCB2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KHQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsID09PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtaW5mb19cIiArIGlkKS5pbm5lckhUTUwgPSBcInhcIiArIHZhbCArIFwiPGJyLz49IC1cIiArIHZhbCAqIHByaWNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gXCJcIiArIHByaWNlO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2U6IGZ1bmN0aW9uIChlLCB1aSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5lZGl0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9ICQodCkuc2xpZGVyKFwidmFsdWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdCA9PT0gMCB8fCB0ZXN0ID09PSA0MCkvL0N1cnNvciB2ZXJzcHJpbmd0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpOy8vXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBwYXJzZUludCh0LmdldEF0dHJpYnV0ZShcImN1clZhbFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy92YXIgdmFsID1wYXJzZUludCh0LmdldEF0dHJpYnV0ZShcImN1clZhbFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJidXkgXCIgKyB2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICBpbmVkaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcih0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdHNvdXJjZTogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtc291cmNlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNlbGxPckJ1eShpZCwgdmFsLCBfdGhpcy5jYWxjUHJpY2UodCwgdmFsKSwgX3RoaXMuZ2V0U3RvcmUoKSwgc2VsZWN0c291cmNlLnZhbHVlID09PSBcIldhcmVob3VzZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAkKHQpLnNsaWRlcihcInZhbHVlXCIsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZWRpdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uIChlOiBhbnksIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBpbmVkaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoZS50YXJnZXQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoZS50YXJnZXQpLnNsaWRlcihcInZhbHVlXCIsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmVkaXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YXJlaG91c2UtbWluLXN0b2NrX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgY2l0eS53YXJlaG91c2VNaW5TdG9ja1tpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhcmVob3VzZS1zZWxsaW5nLXByaWNlX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgY2l0eS53YXJlaG91c2VNaW5TdG9ja1tpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNlbGxPckJ1eShwcm9kdWN0aWQsIGFtb3VudDogbnVtYmVyLCBwcmljZTogbnVtYmVyLCBzdG9yZXRhcmdldDogbnVtYmVyW10sIGlzV2FyZWhvdXNlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcclxuICAgICAgICBpZiAoaXNXYXJlaG91c2UpIHtcclxuICAgICAgICAgICAgY2l0eS53YXJlaG91c2VbcHJvZHVjdGlkXSAtPSBhbW91bnQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2l0eS53b3JsZC5nYW1lLmNoYW5nZU1vbmV5KC1hbW91bnQgKiBwcmljZSwgXCJzZWxsIG9yIGJ1eSBmcm9tIG1hcmtldFwiLCBjaXR5KTtcclxuICAgICAgICAgICAgY2l0eS5tYXJrZXRbcHJvZHVjdGlkXSAtPSBhbW91bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0b3JldGFyZ2V0W3Byb2R1Y3RpZF0gKz0gYW1vdW50O1xyXG4gICAgICAgIHRoaXMuZ2V0QWlycGxhbmVJbk1hcmtldCgpPy5yZWZyZXNoTG9hZGVkQ291bnQoKTtcclxuICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKHRydWUpO1xyXG4gICAgfVxyXG4gICAgZ2V0QWlycGxhbmVJbk1hcmtldCgpIHtcclxuICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xyXG4gICAgICAgIHZhciBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKTtcclxuICAgICAgICB2YXIgdmFsID0gc2VsZWN0LnZhbHVlO1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjaXR5LndvcmxkLmFpcnBsYW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gY2l0eS53b3JsZC5haXJwbGFuZXNbeF0ubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2l0eS53b3JsZC5haXJwbGFuZXNbeF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGdldFN0b3JlKCkge1xyXG4gICAgICAgIHZhciBjaXR5ID0gQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNpdHk7XHJcbiAgICAgICAgdmFyIHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIpO1xyXG4gICAgICAgIHZhciB2YWwgPSBzZWxlY3QudmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgICAgICBpZiAoY2l0eS53YXJlaG91c2VzID4gMCAmJiB2YWwgPT09IFwiV2FyZWhvdXNlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjaXR5LndhcmVob3VzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRBaXJwbGFuZUluTWFya2V0KCk/LnByb2R1Y3RzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG5cclxuICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xyXG4gICAgICAgIGlmICghY2l0eSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKTtcclxuICAgICAgICB2YXIgc2VsZWN0c291cmNlOiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS1zb3VyY2VcIik7XHJcbiAgICAgICAgdmFyIGxhc3QgPSBzZWxlY3QudmFsdWU7XHJcbiAgICAgICAgc2VsZWN0LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKGNpdHkud2FyZWhvdXNlcyA+IDApIHtcclxuICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICBvcHQudmFsdWUgPSBcIldhcmVob3VzZVwiO1xyXG4gICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcclxuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rzb3VyY2UuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICAgICAgICBvcHQudmFsdWUgPSBcIldhcmVob3VzZVwiO1xyXG4gICAgICAgICAgICAgICAgb3B0LnRleHQgPSBvcHQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rzb3VyY2UuYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rzb3VyY2UuY2hpbGRyZW4ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rzb3VyY2UucmVtb3ZlQ2hpbGQoc2VsZWN0c291cmNlLmNoaWxkcmVuWzFdKTtcclxuICAgICAgICAgICAgICAgIHNlbGVjdHNvdXJjZS52YWx1ZSA9IFwiTWFya2V0XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFsbEFQcyA9IGNpdHkuZ2V0QWlycGxhbmVzSW5DaXR5KCk7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxBUHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICBvcHQudmFsdWUgPSBhbGxBUHNbeF0ubmFtZTtcclxuICAgICAgICAgICAgb3B0LnRleHQgPSBvcHQudmFsdWU7XHJcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxhc3QgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgc2VsZWN0LnZhbHVlID0gbGFzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZVRpdGxlKCk7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5pY29uPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5uYW1lPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5tYXJrZXQ8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmJ1eTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+YWlycGxhbmUxPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5zZWxsPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5wcmljZTwvdGg+XHJcbiAgICAgICAgKi9cclxuICAgICAgICB2YXIgc3RvcmV0YXJnZXQgPSB0aGlzLmdldFN0b3JlKCk7XHJcbiAgICAgICAgdmFyIHN0b3Jlc291cmNlID0gY2l0eS5tYXJrZXQ7XHJcbiAgICAgICAgaWYgKHNlbGVjdHNvdXJjZS52YWx1ZSA9PT0gXCJXYXJlaG91c2VcIikge1xyXG4gICAgICAgICAgICBzdG9yZXNvdXJjZSA9IGNpdHkud2FyZWhvdXNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGVcIik7XHJcbiAgICAgICAgICAgIHZhciB0ciA9IHRhYmxlLmNoaWxkcmVuWzBdLmNoaWxkcmVuW3ggKyAxXTtcclxuXHJcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzNdLmlubmVySFRNTCA9IHN0b3Jlc291cmNlW3hdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHZhciBidXlzbGlkZXIgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1zbGlkZXJfXCIgKyB4KTtcclxuICAgICAgICAgICAgdmFyIHNlbGxzbGlkZXIgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGwtc2xpZGVyX1wiICsgeCk7XHJcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IChzZWxlY3Rzb3VyY2UudmFsdWUgPT09IFwiV2FyZWhvdXNlXCIgPyBcIlwiIDogdGhpcy5jYWxjUHJpY2UoYnV5c2xpZGVyLCAwKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgaWYgKHN0b3JldGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWF4ID0gc3RvcmVzb3VyY2VbeF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVzdGFwID0gdGhpcy5nZXRBaXJwbGFuZUluTWFya2V0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGVzdGFwKVxyXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IE1hdGgubWluKG1heCwgdGVzdGFwLmNhcGFjaXR5IC0gdGVzdGFwLmxvYWRlZENvdW50KTtcclxuICAgICAgICAgICAgICAgIGJ1eXNsaWRlci5yZWFkT25seSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLy8gc2VsbHNsaWRlci5yZWFkT25seSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnV5c2xpZGVyLnNldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIsIG1heC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzZdLmlubmVySFRNTCA9IHN0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RvcmV0YXJnZXRbeF0gIT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgJChzZWxsc2xpZGVyKS5zbGlkZXIoXCJlbmFibGVcIik7Ly9zdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICQoc2VsbHNsaWRlcikuc2xpZGVyKFwiZGlzYWJsZVwiKTsvL3N0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4ICE9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICQoYnV5c2xpZGVyKS5zbGlkZXIoXCJlbmFibGVcIik7Ly9zdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICQoYnV5c2xpZGVyKS5zbGlkZXIoXCJkaXNhYmxlXCIpOy8vc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxsc2xpZGVyLnNldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIsIHN0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYnV5c2xpZGVyLnJlYWRPbmx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIC8vIHNlbGxzbGlkZXIucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bNl0uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICQoYnV5c2xpZGVyKS5zbGlkZXIoXCJkaXNhYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgJChzZWxsc2xpZGVyKS5zbGlkZXIoXCJkaXNhYmxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGVUaXRsZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0U2xpZGVyVmFsdWUoZG9tOiBIVE1MSW5wdXRFbGVtZW50KTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgbWF4VmFsdWUgPSBwYXJzZUludChkb20uZ2V0QXR0cmlidXRlKFwibWF4VmFsdWVcIikpO1xyXG4gICAgICAgIHZhciB2YWwgPSAkKGRvbSkuc2xpZGVyKFwidmFsdWVcIik7Ly8gcGFyc2VJbnQoZG9tLnZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGRvbS5pZC5pbmRleE9mKFwic2VsbFwiKSA+IC0xKVxyXG4gICAgICAgICAgICB2YWwgPSA0MCAtIHZhbDtcclxuICAgICAgICBpZiAodmFsID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICBpZiAodmFsID09PSA0MClcclxuICAgICAgICAgICAgcmV0dXJuIG1heFZhbHVlO1xyXG4gICAgICAgIHZhciBleHAgPSBNYXRoLnJvdW5kKGxvZyhtYXhWYWx1ZSwgNDApICogMTAwMCkgLyAxMDAwO1xyXG4gICAgICAgIHZhciByZXQgPSBNYXRoLnJvdW5kKE1hdGgucG93KHZhbCwgZXhwKSk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2FsY1ByaWNlKGVsOiBIVE1MSW5wdXRFbGVtZW50LCB2YWw6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBjaXR5ID0gQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNpdHk7XHJcbiAgICAgICAgdmFyIGlkID0gTnVtYmVyKGVsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XHJcbiAgICAgICAgdmFyIGlzUHJvZHVjZWRIZXJlID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjaXR5LmNvbXBhbmllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAoY2l0eS5jb21wYW5pZXNbeF0ucHJvZHVjdGlkID09PSBpZClcclxuICAgICAgICAgICAgICAgIGlzUHJvZHVjZWRIZXJlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByb2QgPSBhbGxQcm9kdWN0c1tpZF0ucHJpY2VTZWxsaW5nO1xyXG5cclxuICAgICAgICBpZiAoZWwuaWQuaW5kZXhPZihcInNlbGxcIikgPiAtMSlcclxuICAgICAgICAgICAgdmFsID0gLXZhbDtcclxuICAgICAgICB2YXIgcmV0ID0gYWxsUHJvZHVjdHNbaWRdLmNhbGNQcmljZShjaXR5LnBlb3BsZSwgY2l0eS5tYXJrZXRbaWRdIC0gdmFsLCBpc1Byb2R1Y2VkSGVyZSk7XHJcbiAgICAgICAgdmFyIGNvbG9yID0gXCIjMzJDRDMyXCI7XHJcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiAyIC8gMykpXHJcbiAgICAgICAgICAgIGNvbG9yID0gXCIjREFGN0E2IFwiO1xyXG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogMi41IC8gMykpXHJcbiAgICAgICAgICAgIGNvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogMSkpXHJcbiAgICAgICAgICAgIGNvbG9yID0gXCJZZWxsb3dcIjtcclxuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqIDQgLyAzKSlcclxuICAgICAgICAgICAgY29sb3IgPSBcIkxpZ2h0UGlua1wiO1xyXG5cclxuICAgICAgICAoPEhUTUxFbGVtZW50PmVsLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzRdKS5zdHlsZS5iYWNrZ3JvdW5kID0gY29sb3I7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiJdfQ==