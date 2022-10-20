define(["require", "exports", "game/product"], function (require, exports, product_1) {
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
                    ret = ret + '<td style="width:20px">' +
                        '<input hidden class="cdmslider" id="citydialog-market-buy-slider_' + x + '"' +
                        'type="range" min="0" max="10" step="1.0" value="0"' +
                        'style="z-index:' + (100 - x) + '; overflow:float;position:absolute;height:1px;top:16px;width: 100px"' +
                        //'oninput="this.nextElementSibling.innerHTML = this.value;' +
                        //'this.parentNode.parentNode.children[3].innerHTML=1;' +
                        '>';
                    ret = ret + "<td>0</td>";
                    ret = ret + '<td style="width:40px;"><span>0</span><span id="citydialog-market-info_' + x + '"></span></td>';
                    ret = ret + '<td style="width:20px"><div style="position:relative">' +
                        '<div id="sell-slider_' + x + '" style="overflow:float;position:absolute;height:1px;top:5px;width: 100px" ><div>' +
                        '<input hidden class="cdmslider" id="citydialog-market-sell-slider_' + x + '"' +
                        'type="range" min="0" max="500" step="1.0" value="0"' +
                        'style="z-index:' + (100 - x) + '; overflow:float;position:absolute;height:1px;top:16px;width: 100px"' +
                        //'oninput="this.nextElementSibling.innerHTML = this.value;' +
                        // 'this.parentNode.parentNode.children[3].innerHTML=value;' +
                        '></div></td>';
                    ret = ret + "<td>0</td>";
                    ret = ret + "<td></td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>`;
        }
        bindActions() {
            var city = this.citydialog.city;
            var _this = this;
            document.getElementById("citydialog-next").addEventListener("click", (ev) => {
                var pos = city.world.cities.indexOf(city);
                pos++;
                if (pos >= city.world.cities.length)
                    pos = 0;
                city = city.world.cities[pos];
                _this.update();
            });
            document.getElementById("citydialog-prev").addEventListener("click", (ev) => {
                var pos = city.world.cities.indexOf(city);
                pos--;
                if (pos === -1)
                    pos = city.world.cities.length - 1;
                city = city.world.cities[pos];
                _this.update();
            });
            document.getElementById("citydialog-market-table-source").addEventListener("change", (e) => {
                _this.update();
            });
            document.getElementById("citydialog-market-table-target").addEventListener("change", (e) => {
                _this.update();
            });
            $('.citydialog-tabs').click(function (event) {
                _this.update();
            });
            for (var x = 0; x < product_1.allProducts.length; x++) {
                $("#sell-slider_" + x).slider({
                    min: 0,
                    max: 40,
                    range: "min",
                    value: 0,
                    slide: function (event, ui) {
                        var t = event.target;
                        var val = _this.getSliderValue(t);
                        console.log(val);
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
                        var val = _this.getSliderValue(t);
                        if (val === 0)
                            return;
                        inedit = true;
                        var id = Number(t.id.split("_")[1]);
                        var selectsource = document.getElementById("citydialog-market-table-source");
                        _this.sellOrBuy(id, -val, _this.calcPrice(t, val), _this.getStore(), selectsource.value === "Warehouse");
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                        $(t).slider("value", 0);
                        inedit = false;
                    }
                });
                document.getElementById("citydialog-market-buy-slider_" + x).addEventListener("input", (e) => {
                    var t = e.target;
                    var val = _this.getSliderValue(t);
                    var price = _this.calcPrice(t, val);
                    var id = parseInt(t.id.split("_")[1]);
                    if (val === 0)
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                    else
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "x" + val + "<br/>= -" + val * price;
                    t.parentNode.parentNode.children[4].children[0].innerHTML = "" + price;
                });
                document.getElementById("citydialog-market-sell-slider_" + x).addEventListener("input", (e) => {
                    var t = e.target;
                    var val = _this.getSliderValue(t);
                    var price = _this.calcPrice(t, val);
                    var id = parseInt(t.id.split("_")[1]);
                    if (val === 0)
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                    else
                        document.getElementById("citydialog-market-info_" + id).innerHTML = "x" + val + "<br/>= " + val * price;
                    t.parentNode.parentNode.children[4].children[0].innerHTML = "" + price;
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
                    document.getElementById("citydialog-market-info_" + id).innerHTML = "";
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
                    document.getElementById("citydialog-market-info_" + id).innerHTML = "";
                    t.value = "0";
                    inedit = false;
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
            var city = this.citydialog.city;
            if (isWarehouse) {
                city.warehouse[productid] -= amount;
            }
            else {
                city.world.game.changeMoney(-amount * price, "sell or buy from market", city);
                city.market[productid] -= amount;
            }
            storetarget[productid] += amount;
            (_a = this.getAirplaneInMarket()) === null || _a === void 0 ? void 0 : _a.refreshLoadedCount();
            this.update();
            city.world.game.updateTitle();
        }
        getAirplaneInMarket() {
            var city = this.citydialog.city;
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
            var city = this.citydialog.city;
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
            var city = this.citydialog.city;
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
            this.citydialog.updateTitle();
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
                var buyslider = document.getElementById("citydialog-market-buy-slider_" + x);
                var sellslider = document.getElementById("sell-slider_" + x);
                tr.children[4].children[0].innerHTML = (selectsource.value === "Warehouse" ? "" : this.calcPrice(buyslider, 0).toString());
                if (storetarget) {
                    var max = storesource[x];
                    var testap = this.getAirplaneInMarket();
                    if (testap)
                        max = Math.min(max, testap.capacity - testap.loadedCount);
                    buyslider.readOnly = false;
                    // sellslider.readOnly = false;
                    buyslider.max = "40"; //storesource[x].toString();
                    buyslider.setAttribute("maxValue", max.toString());
                    tr.children[6].innerHTML = storetarget[x].toString();
                    if (storetarget[x] !== 0)
                        $(sellslider).slider("enable"); //storetarget[x].toString();
                    else
                        $(sellslider).slider("disalbe"); //storetarget[x].toString();
                    sellslider.setAttribute("maxValue", storetarget[x].toString());
                }
                else {
                    buyslider.readOnly = true;
                    // sellslider.readOnly = true;
                    tr.children[6].innerHTML = "";
                    buyslider.max = "0";
                    $(sellslider).slider("disable");
                }
            }
            this.citydialog.updateTitle();
        }
        getSliderValue(dom) {
            var maxValue = parseInt(dom.getAttribute("maxValue"));
            var val = $(dom).slider("value"); // parseInt(dom.value);
            if (val === 0)
                return 0;
            var exp = Math.round(log(maxValue, 40) * 1000) / 1000;
            return Math.round(Math.pow(val, exp));
        }
        calcPrice(el, val) {
            var city = this.citydialog.city;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZ21hcmtldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZ21hcmtldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBR0EsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNQLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxVQUFVLENBQUMsRUFBRSxJQUFJO1lBQ3BCLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDTCxNQUFhLGdCQUFnQjtRQUV6QixNQUFNO1lBRUYsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQWtCVSxDQUFDLFNBQVMsR0FBRztnQkFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNiLFNBQVMsS0FBSyxDQUFDLEVBQVUsRUFBRSxNQUFjO29CQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHFCQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN6QyxHQUFHLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQztvQkFDcEIsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcscUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUM7b0JBQ3hELEdBQUcsR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLHFCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztvQkFDbkQsR0FB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QUFDO2dCQUM1QixLQUFLLEdBQUcsV0FBVyxDQUFDO1lBRVYsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztZQUNqRyxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FHSjtJQS9WRCw0Q0ErVkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaXR5IH0gZnJvbSBcImdhbWUvY2l0eVwiO1xyXG5pbXBvcnQgeyBhbGxQcm9kdWN0cyB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcclxuaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxudmFyIGxvZyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbG9nID0gTWF0aC5sb2c7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKG4sIGJhc2UpIHtcclxuICAgICAgICByZXR1cm4gbG9nKG4pIC8gKGJhc2UgPyBsb2coYmFzZSkgOiAxKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbmV4cG9ydCBjbGFzcyBDaXR5RGlhbG9nTWFya2V0IHtcclxuICAgIGNpdHlkaWFsb2c6IENpdHlEaWFsb2c7XHJcbiAgICBjcmVhdGUoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBgIDx0YWJsZSBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtc291cmNlXCIgc3R5bGU9XCJ3aWR0aDo4MHB4XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJNYXJrZXRcIj5NYXJrZXQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+UHJpY2U8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IDxzZWxlY3QgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIiBzdHlsZT1cIndpZHRoOjgwcHhcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBsYWNlaG9sZGVyXCI+cGxhY2Vob2xkZXI8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByaWNlKGlkOiBzdHJpbmcsIGNoYW5nZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaWQgKyBcIiBcIiArIGNoYW5nZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ciA+JztcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLm5hbWUgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZCBzdHlsZT1cIndpZHRoOjIwcHhcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBoaWRkZW4gY2xhc3M9XCJjZG1zbGlkZXJcIiBpZD1cImNpdHlkaWFsb2ctbWFya2V0LWJ1eS1zbGlkZXJfJyArIHggKyAnXCInICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCIxMFwiIHN0ZXA9XCIxLjBcIiB2YWx1ZT1cIjBcIicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ6LWluZGV4OicgKyAoMTAwIC0geCkgKyAnOyBvdmVyZmxvdzpmbG9hdDtwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MXB4O3RvcDoxNnB4O3dpZHRoOiAxMDBweFwiJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJ29uaW5wdXQ9XCJ0aGlzLm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUwgPSB0aGlzLnZhbHVlOycgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyd0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlblszXS5pbm5lckhUTUw9MTsnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJz4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDo0MHB4O1wiPjxzcGFuPjA8L3NwYW4+PHNwYW4gaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvXycgKyB4ICsgJ1wiPjwvc3Bhbj48L3RkPic7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZCBzdHlsZT1cIndpZHRoOjIwcHhcIj48ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmVcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJzZWxsLXNsaWRlcl8nICsgeCArICdcIiBzdHlsZT1cIm92ZXJmbG93OmZsb2F0O3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxcHg7dG9wOjVweDt3aWR0aDogMTAwcHhcIiA+PGRpdj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBoaWRkZW4gY2xhc3M9XCJjZG1zbGlkZXJcIiBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXNlbGwtc2xpZGVyXycgKyB4ICsgJ1wiJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlPVwicmFuZ2VcIiBtaW49XCIwXCIgbWF4PVwiNTAwXCIgc3RlcD1cIjEuMFwiIHZhbHVlPVwiMFwiJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cInotaW5kZXg6JyArICgxMDAgLSB4KSArICc7IG92ZXJmbG93OmZsb2F0O3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxcHg7dG9wOjE2cHg7d2lkdGg6IDEwMHB4XCInICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8nb25pbnB1dD1cInRoaXMubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IHRoaXMudmFsdWU7JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICd0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlblszXS5pbm5lckhUTUw9dmFsdWU7JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc+PC9kaXY+PC90ZD4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfSkoKX1cclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPmA7XHJcbiAgICB9XHJcbiAgICBiaW5kQWN0aW9ucygpIHtcclxuICAgICAgICB2YXIgY2l0eSA9IHRoaXMuY2l0eWRpYWxvZy5jaXR5O1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gY2l0eS53b3JsZC5jaXRpZXMuaW5kZXhPZihjaXR5KTtcclxuICAgICAgICAgICAgcG9zKys7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gY2l0eS53b3JsZC5jaXRpZXMubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgcG9zID0gMDtcclxuICAgICAgICAgICAgY2l0eSA9IGNpdHkud29ybGQuY2l0aWVzW3Bvc107XHJcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IGNpdHkud29ybGQuY2l0aWVzLmluZGV4T2YoY2l0eSk7XHJcbiAgICAgICAgICAgIHBvcy0tO1xyXG4gICAgICAgICAgICBpZiAocG9zID09PSAtMSlcclxuICAgICAgICAgICAgICAgIHBvcyA9IGNpdHkud29ybGQuY2l0aWVzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIGNpdHkgPSBjaXR5LndvcmxkLmNpdGllc1twb3NdO1xyXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXRhcmdldFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcuY2l0eWRpYWxvZy10YWJzJykuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgJChcIiNzZWxsLXNsaWRlcl9cIiArIHgpLnNsaWRlcih7XHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDQwLFxyXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFwibWluXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMCxcclxuICAgICAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5ldmVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlID0gX3RoaXMuY2FsY1ByaWNlKHQsIHZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQodC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtaW5mb19cIiArIGlkKS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwieFwiICsgdmFsICsgXCI8YnIvPj0gXCIgKyB2YWwgKiBwcmljZTtcclxuICAgICAgICAgICAgICAgICAgICB0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IFwiXCIgKyBwcmljZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2U6IGZ1bmN0aW9uIChlLCB1aSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5lZGl0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICBpbmVkaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcih0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdHNvdXJjZTogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtc291cmNlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNlbGxPckJ1eShpZCwgLXZhbCwgX3RoaXMuY2FsY1ByaWNlKHQsIHZhbCksIF90aGlzLmdldFN0b3JlKCksIHNlbGVjdHNvdXJjZS52YWx1ZSA9PT0gXCJXYXJlaG91c2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0KS5zbGlkZXIoXCJ2YWx1ZVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmVkaXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtYnV5LXNsaWRlcl9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcclxuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBfdGhpcy5nZXRTbGlkZXJWYWx1ZSh0KTtcclxuICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IF90aGlzLmNhbGNQcmljZSh0LCB2YWwpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQodC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gMClcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJ4XCIgKyB2YWwgKyBcIjxici8+PSAtXCIgKyB2YWwgKiBwcmljZTtcclxuICAgICAgICAgICAgICAgIHQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IFwiXCIgKyBwcmljZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtc2VsbC1zbGlkZXJfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gX3RoaXMuZ2V0U2xpZGVyVmFsdWUodCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJpY2UgPSBfdGhpcy5jYWxjUHJpY2UodCwgdmFsKTtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KHQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwieFwiICsgdmFsICsgXCI8YnIvPj0gXCIgKyB2YWwgKiBwcmljZTtcclxuICAgICAgICAgICAgICAgIHQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IFwiXCIgKyBwcmljZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBpbmVkaXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1idXktc2xpZGVyX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZWRpdClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB2YXIgdCA9IDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgaW5lZGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcih0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0c291cmNlOiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS1zb3VyY2VcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gX3RoaXMuZ2V0U2xpZGVyVmFsdWUodCk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxsT3JCdXkoaWQsIHZhbCwgX3RoaXMuY2FsY1ByaWNlKHQsIHZhbCksIF90aGlzLmdldFN0b3JlKCksIHNlbGVjdHNvdXJjZS52YWx1ZSA9PT0gXCJXYXJlaG91c2VcIik7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHQudmFsdWUgPSBcIjBcIjtcclxuICAgICAgICAgICAgICAgIGluZWRpdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtc2VsbC1zbGlkZXJfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5lZGl0KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBpbmVkaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IF90aGlzLmdldFNsaWRlclZhbHVlKHQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKHQuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rzb3VyY2U6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNlbGxPckJ1eShpZCwgLXZhbCwgX3RoaXMuY2FsY1ByaWNlKHQsIHZhbCksIF90aGlzLmdldFN0b3JlKCksIHNlbGVjdHNvdXJjZS52YWx1ZSA9PT0gXCJXYXJlaG91c2VcIik7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWluZm9fXCIgKyBpZCkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHQudmFsdWUgPSBcIjBcIjtcclxuICAgICAgICAgICAgICAgIGluZWRpdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhcmVob3VzZS1taW4tc3RvY2tfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XHJcbiAgICAgICAgICAgICAgICBjaXR5LndhcmVob3VzZU1pblN0b2NrW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FyZWhvdXNlLXNlbGxpbmctcHJpY2VfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XHJcbiAgICAgICAgICAgICAgICBjaXR5LndhcmVob3VzZU1pblN0b2NrW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2VsbE9yQnV5KHByb2R1Y3RpZCwgYW1vdW50OiBudW1iZXIsIHByaWNlOiBudW1iZXIsIHN0b3JldGFyZ2V0OiBudW1iZXJbXSwgaXNXYXJlaG91c2U6IGJvb2xlYW4pIHtcclxuICAgICAgICB2YXIgY2l0eSA9IHRoaXMuY2l0eWRpYWxvZy5jaXR5O1xyXG4gICAgICAgIGlmIChpc1dhcmVob3VzZSkge1xyXG4gICAgICAgICAgICBjaXR5LndhcmVob3VzZVtwcm9kdWN0aWRdIC09IGFtb3VudDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaXR5LndvcmxkLmdhbWUuY2hhbmdlTW9uZXkoLWFtb3VudCAqIHByaWNlLCBcInNlbGwgb3IgYnV5IGZyb20gbWFya2V0XCIsIGNpdHkpO1xyXG4gICAgICAgICAgICBjaXR5Lm1hcmtldFtwcm9kdWN0aWRdIC09IGFtb3VudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3RvcmV0YXJnZXRbcHJvZHVjdGlkXSArPSBhbW91bnQ7XHJcbiAgICAgICAgdGhpcy5nZXRBaXJwbGFuZUluTWFya2V0KCk/LnJlZnJlc2hMb2FkZWRDb3VudCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgY2l0eS53b3JsZC5nYW1lLnVwZGF0ZVRpdGxlKCk7XHJcbiAgICB9XHJcbiAgICBnZXRBaXJwbGFuZUluTWFya2V0KCkge1xyXG4gICAgICAgIHZhciBjaXR5ID0gdGhpcy5jaXR5ZGlhbG9nLmNpdHk7XHJcbiAgICAgICAgdmFyIHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIpO1xyXG4gICAgICAgIHZhciB2YWwgPSBzZWxlY3QudmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNpdHkud29ybGQuYWlycGxhbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsID09PSBjaXR5LndvcmxkLmFpcnBsYW5lc1t4XS5uYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjaXR5LndvcmxkLmFpcnBsYW5lc1t4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZ2V0U3RvcmUoKSB7XHJcbiAgICAgICAgdmFyIGNpdHkgPSB0aGlzLmNpdHlkaWFsb2cuY2l0eTtcclxuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS10YXJnZXRcIik7XHJcbiAgICAgICAgdmFyIHZhbCA9IHNlbGVjdC52YWx1ZTtcclxuICAgICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgICAgIGlmIChjaXR5LndhcmVob3VzZXMgPiAwICYmIHZhbCA9PT0gXCJXYXJlaG91c2VcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNpdHkud2FyZWhvdXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFpcnBsYW5lSW5NYXJrZXQoKT8ucHJvZHVjdHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcblxyXG4gICAgICAgIHZhciBjaXR5ID0gdGhpcy5jaXR5ZGlhbG9nLmNpdHk7XHJcbiAgICAgICAgaWYgKCFjaXR5KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGUtdGFyZ2V0XCIpO1xyXG4gICAgICAgIHZhciBzZWxlY3Rzb3VyY2U6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXNvdXJjZVwiKTtcclxuICAgICAgICB2YXIgbGFzdCA9IHNlbGVjdC52YWx1ZTtcclxuICAgICAgICBzZWxlY3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBpZiAoY2l0eS53YXJlaG91c2VzID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IFwiV2FyZWhvdXNlXCI7XHJcbiAgICAgICAgICAgIG9wdC50ZXh0ID0gb3B0LnZhbHVlO1xyXG4gICAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdHNvdXJjZS5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgICAgICAgIG9wdC52YWx1ZSA9IFwiV2FyZWhvdXNlXCI7XHJcbiAgICAgICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHNlbGVjdHNvdXJjZS5hcHBlbmRDaGlsZChvcHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdHNvdXJjZS5jaGlsZHJlbi5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdHNvdXJjZS5yZW1vdmVDaGlsZChzZWxlY3Rzb3VyY2UuY2hpbGRyZW5bMV0pO1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0c291cmNlLnZhbHVlID0gXCJNYXJrZXRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYWxsQVBzID0gY2l0eS5nZXRBaXJwbGFuZXNJbkNpdHkoKTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbEFQcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IGFsbEFQc1t4XS5uYW1lO1xyXG4gICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcclxuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobGFzdCAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICBzZWxlY3QudmFsdWUgPSBsYXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNpdHlkaWFsb2cudXBkYXRlVGl0bGUoKTtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmljb248L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPm5hbWU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPm1hcmtldDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+YnV5PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5haXJwbGFuZTE8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPnNlbGw8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPnByaWNlPC90aD5cclxuICAgICAgICAqL1xyXG4gICAgICAgIHZhciBzdG9yZXRhcmdldCA9IHRoaXMuZ2V0U3RvcmUoKTtcclxuICAgICAgICB2YXIgc3RvcmVzb3VyY2UgPSBjaXR5Lm1hcmtldDtcclxuICAgICAgICBpZiAoc2VsZWN0c291cmNlLnZhbHVlID09PSBcIldhcmVob3VzZVwiKSB7XHJcbiAgICAgICAgICAgIHN0b3Jlc291cmNlID0gY2l0eS53YXJlaG91c2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZVwiKTtcclxuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xyXG5cclxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bM10uaW5uZXJIVE1MID0gc3RvcmVzb3VyY2VbeF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdmFyIGJ1eXNsaWRlciA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtYnV5LXNsaWRlcl9cIiArIHgpO1xyXG4gICAgICAgICAgICB2YXIgc2VsbHNsaWRlciA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsbC1zbGlkZXJfXCIgKyB4KTtcclxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gKHNlbGVjdHNvdXJjZS52YWx1ZSA9PT0gXCJXYXJlaG91c2VcIiA/IFwiXCIgOiB0aGlzLmNhbGNQcmljZShidXlzbGlkZXIsIDApLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBpZiAoc3RvcmV0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtYXggPSBzdG9yZXNvdXJjZVt4XTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXN0YXAgPSB0aGlzLmdldEFpcnBsYW5lSW5NYXJrZXQoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0ZXN0YXApXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5taW4obWF4LCB0ZXN0YXAuY2FwYWNpdHkgLSB0ZXN0YXAubG9hZGVkQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgYnV5c2xpZGVyLnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAvLyBzZWxsc2xpZGVyLnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBidXlzbGlkZXIubWF4ID0gXCI0MFwiOy8vc3RvcmVzb3VyY2VbeF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIGJ1eXNsaWRlci5zZXRBdHRyaWJ1dGUoXCJtYXhWYWx1ZVwiLCBtYXgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB0ci5jaGlsZHJlbls2XS5pbm5lckhUTUwgPSBzdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0b3JldGFyZ2V0W3hdICE9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICQoc2VsbHNsaWRlcikuc2xpZGVyKFwiZW5hYmxlXCIpOy8vc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAkKHNlbGxzbGlkZXIpLnNsaWRlcihcImRpc2FsYmVcIik7Ly9zdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGxzbGlkZXIuc2V0QXR0cmlidXRlKFwibWF4VmFsdWVcIiwgc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBidXlzbGlkZXIucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy8gc2VsbHNsaWRlci5yZWFkT25seSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0ci5jaGlsZHJlbls2XS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYnV5c2xpZGVyLm1heCA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgJChzZWxsc2xpZGVyKS5zbGlkZXIoXCJkaXNhYmxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2l0eWRpYWxvZy51cGRhdGVUaXRsZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0U2xpZGVyVmFsdWUoZG9tOiBIVE1MSW5wdXRFbGVtZW50KTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgbWF4VmFsdWUgPSBwYXJzZUludChkb20uZ2V0QXR0cmlidXRlKFwibWF4VmFsdWVcIikpO1xyXG4gICAgICAgIHZhciB2YWwgPSAkKGRvbSkuc2xpZGVyKFwidmFsdWVcIik7Ly8gcGFyc2VJbnQoZG9tLnZhbHVlKTtcclxuICAgICAgICBpZiAodmFsID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB2YXIgZXhwID0gTWF0aC5yb3VuZChsb2cobWF4VmFsdWUsIDQwKSAqIDEwMDApIC8gMTAwMDtcclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnBvdyh2YWwsIGV4cCkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjYWxjUHJpY2UoZWw6IEhUTUxJbnB1dEVsZW1lbnQsIHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIGNpdHkgPSB0aGlzLmNpdHlkaWFsb2cuY2l0eTtcclxuICAgICAgICB2YXIgaWQgPSBOdW1iZXIoZWwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICB2YXIgaXNQcm9kdWNlZEhlcmUgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNpdHkuY29tcGFuaWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjaXR5LmNvbXBhbmllc1t4XS5wcm9kdWN0aWQgPT09IGlkKVxyXG4gICAgICAgICAgICAgICAgaXNQcm9kdWNlZEhlcmUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvZCA9IGFsbFByb2R1Y3RzW2lkXS5wcmljZVNlbGxpbmc7XHJcblxyXG4gICAgICAgIGlmIChlbC5pZC5pbmRleE9mKFwic2VsbFwiKSA+IC0xKVxyXG4gICAgICAgICAgICB2YWwgPSAtdmFsO1xyXG4gICAgICAgIHZhciByZXQgPSBhbGxQcm9kdWN0c1tpZF0uY2FsY1ByaWNlKGNpdHkucGVvcGxlLCBjaXR5Lm1hcmtldFtpZF0gLSB2YWwsIGlzUHJvZHVjZWRIZXJlKTtcclxuICAgICAgICB2YXIgY29sb3IgPSBcIiMzMkNEMzJcIjtcclxuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqIDIgLyAzKSlcclxuICAgICAgICAgICAgY29sb3IgPSBcIiNEQUY3QTYgXCI7XHJcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiAyLjUgLyAzKSlcclxuICAgICAgICAgICAgY29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgaWYgKHJldCA+ICgoMC4wICsgcHJvZCkgKiAxKSlcclxuICAgICAgICAgICAgY29sb3IgPSBcIlllbGxvd1wiO1xyXG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogNCAvIDMpKVxyXG4gICAgICAgICAgICBjb2xvciA9IFwiTGlnaHRQaW5rXCI7XHJcblxyXG4gICAgICAgICg8SFRNTEVsZW1lbnQ+ZWwucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bNF0pLnN0eWxlLmJhY2tncm91bmQgPSBjb2xvcjtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIl19