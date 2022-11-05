define(["require", "exports", "game/citydialog", "game/icons", "game/citydialogmarket"], function (require, exports, citydialog_1, icons_1, citydialogmarket_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CityDialogShop = void 0;
    var log = (function () {
        var log = Math.log;
        return function (n, base) {
            return log(n) / (base ? log(base) : 1);
        };
    })();
    class CityDialogShop {
        static getInstance() {
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
                            <th>Selling<br/>price<br/><button id="shop-fill-price" title="reset price"  class="mybutton">` + icons_1.Icons.fillDown + `</button></th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + parameter.allProducts[x].getIcon() + "</td>";
                    ret = ret + '<td style="text-align: right">0</td>'; //stack
                    ret = ret + '<td style="width:110px"><div style="position:relative">' +
                        '<div id="shop-sell-slider_' + x + '" style="overflow:float;position:absolute;height:1px;top:5px;width: 53px" ><div>' +
                        '</div></td>';
                    ret = ret + '<td style="width:30px;"><span id="citydialog-shop-info_' + x + '"></span></td>';
                    ret = ret + '<td style="width:40px"><div style="position:relative">' +
                        '<div id="shop-buy-slider_' + x + '" style="overflow:float;position:absolute;left:4px;height:1px;top:5px;width: 62px" ><div>' +
                        '</div></td>';
                    ret = ret + '<td style="width:40px">0</td>'; //Airplane stack
                    ret = ret + '<td>' +
                        '<input type="number" min="0" class="shop-min-stock" id="shop-min-stock_' + x + '"' +
                        'style="width: 50px;"' +
                        '"></td>';
                    ret = ret + '<td>' +
                        '<input type="number" min="0" class="shop-selling-price" id="shop-selling-price_' + x + '"' +
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
                citydialog_1.CityDialog.getInstance().update(true);
            });
            document.getElementById("shop-fill-price").addEventListener("click", (evt) => {
                var city = citydialog_1.CityDialog.getInstance().city;
                if (city.shops === 0)
                    return;
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    city.shopSellingPrice[x] = city.isProducedHere(x) ? parameter.allProducts[x].pricePurchase : parameter.allProducts[x].priceSelling;
                }
                _this.update();
            });
            for (var x = 0; x < parameter.allProducts.length; x++) {
                document.getElementById("shop-min-stock_" + x).addEventListener("change", (e) => {
                    var city = citydialog_1.CityDialog.getInstance().city;
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    city.shopMinStock[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("shop-selling-price_" + x).addEventListener("change", (e) => {
                    var city = citydialog_1.CityDialog.getInstance().city;
                    var ctrl = e.target;
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
                        citydialogmarket_1.CityDialogMarket.slide(event, false, "citydialog-shop-info_", false);
                    },
                    change: function (e, ui) {
                        citydialogmarket_1.CityDialogMarket.changeSlider(e, true, "citydialog-shop-info_", false);
                    },
                    stop: function (e, ui) {
                        setTimeout(() => {
                            citydialogmarket_1.CityDialogMarket.inedit = true;
                            var id = Number(e.target.id.split("_")[1]);
                            document.getElementById("citydialog-shop-info_" + id).innerHTML = "";
                            $(e.target).slider("value", 40);
                            citydialogmarket_1.CityDialogMarket.inedit = false;
                        }, 200);
                    }
                });
                $("#shop-buy-slider_" + x).slider({
                    min: 0,
                    max: 40,
                    range: "min",
                    value: 0,
                    slide: function (event, ui) {
                        citydialogmarket_1.CityDialogMarket.slide(event, true, "citydialog-shop-info_", false);
                    },
                    change: function (e, ui) {
                        citydialogmarket_1.CityDialogMarket.changeSlider(e, false, "citydialog-shop-info_", false);
                    },
                    stop: function (e, ui) {
                        setTimeout(() => {
                            citydialogmarket_1.CityDialogMarket.inedit = true;
                            var id = Number(e.target.id.split("_")[1]);
                            document.getElementById("citydialog-shop-info_" + id).innerHTML = "";
                            $(e.target).slider("value", 0);
                            citydialogmarket_1.CityDialogMarket.inedit = false;
                        }, 200);
                    }
                });
            }
        }
        update() {
            var city = citydialog_1.CityDialog.getInstance().city;
            if (!city)
                return;
            var select = document.getElementById("citydialog-shop-table-target");
            var last = select.value;
            if (document.activeElement !== document.getElementById("citydialog-shop-table-target")) {
                select.innerHTML = "";
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
            }
            citydialog_1.CityDialog.getInstance().updateTitle();
            var storetarget = citydialogmarket_1.CityDialogMarket.getStore("citydialog-shop-table-target");
            var storesource = city.shop;
            var gesamount = 0;
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var table = document.getElementById("citydialog-shop-table");
                var tr = table.children[0].children[x + 1];
                gesamount += storesource[x];
                tr.children[1].innerHTML = city.shop[x].toString();
                var buyslider = document.getElementById("shop-buy-slider_" + x);
                var sellslider = document.getElementById("shop-sell-slider_" + x);
                if (document.activeElement !== buyslider && document.activeElement !== sellslider) {
                    if (storetarget) {
                        var max = storesource[x];
                        var testap = citydialogmarket_1.CityDialogMarket.getAirplaneInMarket("citydialog-shop-table-target");
                        if (testap)
                            max = Math.min(max, testap.capacity - testap.loadedCount);
                        buyslider.readOnly = false;
                        // sellslider.readOnly = false;
                        buyslider.setAttribute("maxValue", max.toString());
                        tr.children[5].innerHTML = storetarget[x].toString();
                        if (storetarget[x] !== 0)
                            $(sellslider).slider("enable"); //storetarget[x].toString();
                        else
                            $(sellslider).slider("disable"); //storetarget[x].toString();
                        if (max !== 0)
                            $(buyslider).slider("enable"); //storetarget[x].toString();
                        else
                            $(buyslider).slider("disable"); //storetarget[x].toString();
                        var max2 = storetarget[x];
                        var diff = city.shops * parameter.capacityShop - city.getCompleteAmount();
                        if (diff > 0)
                            max2 = Math.min(max2, diff);
                        else
                            max2 = 0;
                        sellslider.setAttribute("maxValue", max2.toString());
                    }
                    else {
                        buyslider.readOnly = true;
                        // sellslider.readOnly = true;
                        tr.children[5].innerHTML = "";
                        $(buyslider).slider("disable");
                        $(sellslider).slider("disable");
                    }
                }
                if (document.activeElement !== tr.children[6].children[0])
                    tr.children[6].children[0].value = city.shopMinStock[x] === undefined ? "" : city.shopMinStock[x].toString();
                if (document.activeElement !== tr.children[7].children[0])
                    tr.children[7].children[0].value = city.shopSellingPrice[x] === undefined ? "" : city.shopSellingPrice[x].toString();
            }
            document.getElementById("citydialog-shop-info").innerHTML = "Shops:" + city.shops + " Capacity " + gesamount + "/" + city.shops * parameter.capacityShop;
        }
    }
    exports.CityDialogShop = CityDialogShop;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZ3Nob3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2NpdHlkaWFsb2dzaG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFLQSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ1AsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNuQixPQUFPLFVBQVUsQ0FBQyxFQUFFLElBQUk7WUFDcEIsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNMLE1BQWEsY0FBYztRQUV2QixNQUFNLENBQUMsV0FBVztZQUNkLElBQUksY0FBYyxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNyQyxjQUFjLENBQUMsUUFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDbkQsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDO1FBQ25DLENBQUM7UUFDRCxNQUFNO1lBQ0YsT0FBTzs7Ozs7Ozs7Ozs7OzBIQVkyRyxHQUFFLGFBQUssQ0FBQyxRQUFRLEdBQUc7O3lCQUVwSCxDQUFDLFNBQVMsR0FBRztnQkFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDbkQsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7b0JBQ25CLEdBQUcsR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO29CQUNsRSxHQUFHLEdBQUcsR0FB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QUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNySSxJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDaEo7WUFFRCxRQUFRLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUMsU0FBUyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztRQUU3SixDQUFDO0tBSUo7SUF0TkQsd0NBc05DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcbmltcG9ydCB7IFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XG5pbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xuaW1wb3J0IHsgQ2l0eURpYWxvZ01hcmtldCB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dtYXJrZXRcIjtcbnZhciBsb2cgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2cgPSBNYXRoLmxvZztcbiAgICByZXR1cm4gZnVuY3Rpb24gKG4sIGJhc2UpIHtcbiAgICAgICAgcmV0dXJuIGxvZyhuKSAvIChiYXNlID8gbG9nKGJhc2UpIDogMSk7XG4gICAgfTtcbn0pKCk7XG5leHBvcnQgY2xhc3MgQ2l0eURpYWxvZ1Nob3Age1xuICAgIHN0YXRpYyBpbnN0YW5jZTogQ2l0eURpYWxvZ1Nob3A7XG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IENpdHlEaWFsb2dTaG9wIHtcbiAgICAgICAgaWYgKENpdHlEaWFsb2dTaG9wLmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBDaXR5RGlhbG9nU2hvcC5pbnN0YW5jZSA9IG5ldyBDaXR5RGlhbG9nU2hvcCgpO1xuICAgICAgICByZXR1cm4gQ2l0eURpYWxvZ1Nob3AuaW5zdGFuY2U7XG4gICAgfVxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLXNob3AtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TaG9wPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8c2VsZWN0IGlkPVwiY2l0eWRpYWxvZy1zaG9wLXRhYmxlLXRhcmdldFwiIHN0eWxlPVwid2lkdGg6NjBweFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBsYWNlaG9sZGVyXCI+cGxhY2Vob2xkZXI8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWluPGJyLz5TdG9jazwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlNlbGxpbmc8YnIvPnByaWNlPGJyLz48YnV0dG9uIGlkPVwic2hvcC1maWxsLXByaWNlXCIgdGl0bGU9XCJyZXNldCBwcmljZVwiICBjbGFzcz1cIm15YnV0dG9uXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBwYXJhbWV0ZXIuYWxsUHJvZHVjdHNbeF0uZ2V0SWNvbigpICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHRcIj4wPC90ZD4nOy8vc3RhY2tcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZCBzdHlsZT1cIndpZHRoOjExMHB4XCI+PGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cInNob3Atc2VsbC1zbGlkZXJfJyArIHggKyAnXCIgc3R5bGU9XCJvdmVyZmxvdzpmbG9hdDtwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MXB4O3RvcDo1cHg7d2lkdGg6IDUzcHhcIiA+PGRpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDozMHB4O1wiPjxzcGFuIGlkPVwiY2l0eWRpYWxvZy1zaG9wLWluZm9fJyArIHggKyAnXCI+PC9zcGFuPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZCBzdHlsZT1cIndpZHRoOjQwcHhcIj48ZGl2IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGlkPVwic2hvcC1idXktc2xpZGVyXycgKyB4ICsgJ1wiIHN0eWxlPVwib3ZlcmZsb3c6ZmxvYXQ7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo0cHg7aGVpZ2h0OjFweDt0b3A6NXB4O3dpZHRoOiA2MnB4XCIgPjxkaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkIHN0eWxlPVwid2lkdGg6NDBweFwiPjA8L3RkPic7Ly9BaXJwbGFuZSBzdGFja1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwic2hvcC1taW4tc3RvY2tcIiBpZD1cInNob3AtbWluLXN0b2NrXycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cInNob3Atc2VsbGluZy1wcmljZVwiIGlkPVwic2hvcC1zZWxsaW5nLXByaWNlXycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJjaXR5ZGlhbG9nLXNob3AtaW5mb1wiPjxzcGFuPmA7XG5cbiAgICB9XG4gICAgYmluZEFjdGlvbnMoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1zaG9wLXRhYmxlLXRhcmdldFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG5cbiAgICAgICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3AtZmlsbC1wcmljZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbiAgICAgICAgICAgIGlmIChjaXR5LnNob3BzID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyYW1ldGVyLmFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgY2l0eS5zaG9wU2VsbGluZ1ByaWNlW3hdID0gY2l0eS5pc1Byb2R1Y2VkSGVyZSh4KSA/IHBhcmFtZXRlci5hbGxQcm9kdWN0c1t4XS5wcmljZVB1cmNoYXNlIDogcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdLnByaWNlU2VsbGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaG9wLW1pbi1zdG9ja19cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgY2l0eS5zaG9wTWluU3RvY2tbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3Atc2VsbGluZy1wcmljZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY2l0eSA9IENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgY2l0eS5zaG9wTWluU3RvY2tbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgJChcIiNzaG9wLXNlbGwtc2xpZGVyX1wiICsgeCkuc2xpZGVyKHtcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgbWF4OiA0MCxcbiAgICAgICAgICAgICAgICByYW5nZTogXCJtaW5cIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogNDAsXG4gICAgICAgICAgICAgICAgc2xpZGU6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzbGlkZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5zbGlkZShldmVudCwgZmFsc2UsIFwiY2l0eWRpYWxvZy1zaG9wLWluZm9fXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNoYW5nZTogZnVuY3Rpb24gKGUsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuY2hhbmdlU2xpZGVyKGUsIHRydWUsIFwiY2l0eWRpYWxvZy1zaG9wLWluZm9fXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uIChlOiBhbnksIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKGUudGFyZ2V0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctc2hvcC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5zbGlkZXIoXCJ2YWx1ZVwiLCA0MCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBDaXR5RGlhbG9nTWFya2V0LmluZWRpdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJChcIiNzaG9wLWJ1eS1zbGlkZXJfXCIgKyB4KS5zbGlkZXIoe1xuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBtYXg6IDQwLFxuICAgICAgICAgICAgICAgIHJhbmdlOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuc2xpZGUoZXZlbnQsIHRydWUsIFwiY2l0eWRpYWxvZy1zaG9wLWluZm9fXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgY2hhbmdlOiBmdW5jdGlvbiAoZSwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5jaGFuZ2VTbGlkZXIoZSwgZmFsc2UsIFwiY2l0eWRpYWxvZy1zaG9wLWluZm9fXCIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uIChlOiBhbnksIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKGUudGFyZ2V0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctc2hvcC1pbmZvX1wiICsgaWQpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5zbGlkZXIoXCJ2YWx1ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuaW5lZGl0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICB1cGRhdGUoKSB7XG5cbiAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbiAgICAgICAgaWYgKCFjaXR5KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNob3AtdGFibGUtdGFyZ2V0XCIpO1xuICAgICAgICB2YXIgbGFzdCA9IHNlbGVjdC52YWx1ZTtcblxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctc2hvcC10YWJsZS10YXJnZXRcIikpIHtcbiAgICAgICAgICAgIHNlbGVjdC5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgICAgICB2YXIgYWxsQVBzID0gY2l0eS5nZXRBaXJwbGFuZXNJbkNpdHkoKTtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsQVBzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICAgICAgICAgIG9wdC52YWx1ZSA9IGFsbEFQc1t4XS5uYW1lO1xuICAgICAgICAgICAgICAgIG9wdC50ZXh0ID0gb3B0LnZhbHVlO1xuICAgICAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhc3QgIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3QudmFsdWUgPSBsYXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLnVwZGF0ZVRpdGxlKCk7XG5cbiAgICAgICAgdmFyIHN0b3JldGFyZ2V0ID0gQ2l0eURpYWxvZ01hcmtldC5nZXRTdG9yZShcImNpdHlkaWFsb2ctc2hvcC10YWJsZS10YXJnZXRcIik7XG4gICAgICAgIHZhciBzdG9yZXNvdXJjZSA9IGNpdHkuc2hvcDtcbiAgICAgICAgdmFyIGdlc2Ftb3VudCA9IDA7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyYW1ldGVyLmFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctc2hvcC10YWJsZVwiKTtcbiAgICAgICAgICAgIHZhciB0ciA9IHRhYmxlLmNoaWxkcmVuWzBdLmNoaWxkcmVuW3ggKyAxXTtcbiAgICAgICAgICAgIGdlc2Ftb3VudCArPSBzdG9yZXNvdXJjZVt4XTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzFdLmlubmVySFRNTCA9IGNpdHkuc2hvcFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgdmFyIGJ1eXNsaWRlciA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvcC1idXktc2xpZGVyX1wiICsgeCk7XG4gICAgICAgICAgICB2YXIgc2VsbHNsaWRlciA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvcC1zZWxsLXNsaWRlcl9cIiArIHgpO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGJ1eXNsaWRlciAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBzZWxsc2xpZGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0b3JldGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXggPSBzdG9yZXNvdXJjZVt4XTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3RhcCA9IENpdHlEaWFsb2dNYXJrZXQuZ2V0QWlycGxhbmVJbk1hcmtldChcImNpdHlkaWFsb2ctc2hvcC10YWJsZS10YXJnZXRcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0YXApXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXggPSBNYXRoLm1pbihtYXgsIHRlc3RhcC5jYXBhY2l0eSAtIHRlc3RhcC5sb2FkZWRDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIGJ1eXNsaWRlci5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAvLyBzZWxsc2xpZGVyLnJlYWRPbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJ1eXNsaWRlci5zZXRBdHRyaWJ1dGUoXCJtYXhWYWx1ZVwiLCBtYXgudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzVdLmlubmVySFRNTCA9IHN0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdG9yZXRhcmdldFt4XSAhPT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsbHNsaWRlcikuc2xpZGVyKFwiZW5hYmxlXCIpOy8vc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxsc2xpZGVyKS5zbGlkZXIoXCJkaXNhYmxlXCIpOy8vc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1heCAhPT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICQoYnV5c2xpZGVyKS5zbGlkZXIoXCJlbmFibGVcIik7Ly9zdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGJ1eXNsaWRlcikuc2xpZGVyKFwiZGlzYWJsZVwiKTsvL3N0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXgyID0gc3RvcmV0YXJnZXRbeF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWZmID0gY2l0eS5zaG9wcyAqIHBhcmFtZXRlci5jYXBhY2l0eVNob3AgLSBjaXR5LmdldENvbXBsZXRlQW1vdW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGRpZmY+MClcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heDI9TWF0aC5taW4obWF4MiwgZGlmZik7XG4gICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXgyPTA7XG4gICAgICAgICAgICAgICAgICAgIHNlbGxzbGlkZXIuc2V0QXR0cmlidXRlKFwibWF4VmFsdWVcIiwgbWF4Mi50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBidXlzbGlkZXIucmVhZE9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAvLyBzZWxsc2xpZGVyLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bNV0uaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgJChidXlzbGlkZXIpLnNsaWRlcihcImRpc2FibGVcIik7XG4gICAgICAgICAgICAgICAgICAgICQoc2VsbHNsaWRlcikuc2xpZGVyKFwiZGlzYWJsZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzZdLmNoaWxkcmVuWzBdKS52YWx1ZSA9IGNpdHkuc2hvcE1pblN0b2NrW3hdID09PSB1bmRlZmluZWQgPyBcIlwiIDogY2l0eS5zaG9wTWluU3RvY2tbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0ci5jaGlsZHJlbls3XS5jaGlsZHJlblswXSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bN10uY2hpbGRyZW5bMF0pLnZhbHVlID0gY2l0eS5zaG9wU2VsbGluZ1ByaWNlW3hdID09PSB1bmRlZmluZWQgPyBcIlwiIDogY2l0eS5zaG9wU2VsbGluZ1ByaWNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctc2hvcC1pbmZvXCIpLmlubmVySFRNTCA9IFwiU2hvcHM6XCIgKyBjaXR5LnNob3BzICsgXCIgQ2FwYWNpdHkgXCIgKyBnZXNhbW91bnQgKyBcIi9cIiArIGNpdHkuc2hvcHMgKiBwYXJhbWV0ZXIuY2FwYWNpdHlTaG9wO1xuXG4gICAgfVxuXG5cblxufVxuIl19