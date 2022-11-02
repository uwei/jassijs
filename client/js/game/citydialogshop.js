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
                            <th>Selling<br/>price<br/><button id="shop-fill-price" title="reset price">` + icons_1.Icons.fillDown + `</button></th>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZ3Nob3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2NpdHlkaWFsb2dzaG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFLQSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ1AsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNuQixPQUFPLFVBQVUsQ0FBQyxFQUFFLElBQUk7WUFDcEIsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNMLE1BQWEsY0FBYztRQUV2QixNQUFNLENBQUMsV0FBVztZQUNkLElBQUksY0FBYyxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNyQyxjQUFjLENBQUMsUUFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDbkQsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDO1FBQ25DLENBQUM7UUFDRCxNQUFNO1lBQ0YsT0FBTzs7Ozs7Ozs7Ozs7O3dHQVl5RixHQUFFLGFBQUssQ0FBQyxRQUFRLEdBQUc7O3lCQUVsRyxDQUFDLFNBQVMsR0FBRztnQkFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDbkQsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7b0JBQ25CLEdBQUcsR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO29CQUNsRSxHQUFHLEdBQUcsR0FBRyxHQUFHLHNDQUFzQyxDQUFDLENBQUEsT0FBTztvQkFDMUQsR0FBRyxHQUFHLEdBQUcsR0FBRyx5REFBeUQ7d0JBQ2pFLDRCQUE0QixHQUFHLENBQUMsR0FBRyxrRkFBa0Y7d0JBQ3JILGFBQWEsQ0FBQztvQkFDbEIsR0FBRyxHQUFHLEdBQUcsR0FBRyx5REFBeUQsR0FBRyxDQUFDLEdBQUcsZ0JBQWdCLENBQUM7b0JBQzdGLEdBQUcsR0FBRyxHQUFHLEdBQUcsd0RBQXdEO3dCQUNoRSwyQkFBMkIsR0FBRyxDQUFDLEdBQUcsMkZBQTJGO3dCQUM3SCxhQUFhLENBQUM7b0JBQ2xCLEdBQUcsR0FBRyxHQUFHLEdBQUcsK0JBQStCLENBQUMsQ0FBQSxnQkFBZ0I7b0JBQzVELEdBQUcsR0FBRyxHQUFHLEdBQUcsTUFBTTt3QkFDZCx5RUFBeUUsR0FBRyxDQUFDLEdBQUcsR0FBRzt3QkFDbkYsc0JBQXNCO3dCQUN0QixTQUFTLENBQUM7b0JBQ2QsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNO3dCQUNkLGlGQUFpRixHQUFHLENBQUMsR0FBRyxHQUFHO3dCQUMzRixzQkFBc0I7d0JBQ3RCLFNBQVMsQ0FBQztvQkFDZCxHQUFHLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQztpQkFDdkI7Z0JBQ0QsT0FBTyxHQUFHLENBQUM7WUFDZixDQUFDLENBQUMsRUFBRTs7MkRBRTJDLENBQUM7UUFFeEQsQ0FBQztRQUNELFdBQVc7WUFDUCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsUUFBUSxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUVyRix1QkFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDekUsSUFBSSxJQUFJLEdBQUcsdUJBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ3pDLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDO29CQUNoQixPQUFPO2dCQUNYLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDbkQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztpQkFDdEk7Z0JBQ0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRW5CLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuRCxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUM1RSxJQUFJLElBQUksR0FBRyx1QkFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDekMsSUFBSSxJQUFJLEdBQXNCLENBQUMsQ0FBQyxNQUFPLENBQUM7b0JBQ3hDLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2pGLENBQUMsQ0FBQyxDQUFDO2dCQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMscUJBQXFCLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ2hGLElBQUksSUFBSSxHQUFHLHVCQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUN6QyxJQUFJLElBQUksR0FBc0IsQ0FBQyxDQUFDLE1BQU8sQ0FBQztvQkFDeEMsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFakYsQ0FBQyxDQUFDLENBQUM7YUFDTjtZQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbkQsQ0FBQyxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFDL0IsR0FBRyxFQUFFLENBQUM7b0JBQ04sR0FBRyxFQUFFLEVBQUU7b0JBQ1AsS0FBSyxFQUFFLEtBQUs7b0JBQ1osS0FBSyxFQUFFLEVBQUU7b0JBQ1QsS0FBSyxFQUFFLFVBQVUsS0FBSyxFQUFFLEVBQUU7d0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3JCLG1DQUFnQixDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN6RSxDQUFDO29CQUNELE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFO3dCQUNuQixtQ0FBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDM0UsQ0FBQztvQkFDRCxJQUFJLEVBQUUsVUFBVSxDQUFNLEVBQUUsRUFBRTt3QkFDdEIsVUFBVSxDQUFDLEdBQUcsRUFBRTs0QkFDWixtQ0FBZ0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzRCQUMvQixJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs0QkFDckUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzRCQUNoQyxtQ0FBZ0IsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO3dCQUNwQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ1osQ0FBQztpQkFDSixDQUFDLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFDOUIsR0FBRyxFQUFFLENBQUM7b0JBQ04sR0FBRyxFQUFFLEVBQUU7b0JBQ1AsS0FBSyxFQUFFLEtBQUs7b0JBQ1osS0FBSyxFQUFFLENBQUM7b0JBQ1IsS0FBSyxFQUFFLFVBQVUsS0FBSyxFQUFFLEVBQUU7d0JBQ3RCLG1DQUFnQixDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN4RSxDQUFDO29CQUVELE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFO3dCQUNuQixtQ0FBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDNUUsQ0FBQztvQkFDRCxJQUFJLEVBQUUsVUFBVSxDQUFNLEVBQUUsRUFBRTt3QkFDdEIsVUFBVSxDQUFDLEdBQUcsRUFBRTs0QkFDWixtQ0FBZ0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzRCQUMvQixJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs0QkFDckUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUMvQixtQ0FBZ0IsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO3dCQUVwQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ1osQ0FBQztpQkFDSixDQUFDLENBQUM7YUFFTjtRQUNMLENBQUM7UUFHRCxNQUFNO1lBRUYsSUFBSSxJQUFJLEdBQUcsdUJBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDekMsSUFBSSxDQUFDLElBQUk7Z0JBQ0wsT0FBTztZQUNYLElBQUksTUFBTSxHQUEyQixRQUFRLENBQUMsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDN0YsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUV4QixJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQVUsUUFBUSxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxFQUFFO2dCQUN6RixNQUFNLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztnQkFFdEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3ZDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNwQyxJQUFJLEdBQUcsR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDOUQsR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUMzQixHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7b0JBQ3JCLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzNCO2dCQUNELElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtvQkFDYixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztpQkFDdkI7YUFDSjtZQUVELHVCQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFdkMsSUFBSSxXQUFXLEdBQUcsbUNBQWdCLENBQUMsUUFBUSxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDNUUsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM1QixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuRCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQzdELElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsU0FBUyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbkQsSUFBSSxTQUFTLEdBQXFCLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xGLElBQUksVUFBVSxHQUFxQixRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNwRixJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssU0FBUyxJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssVUFBVSxFQUFFO29CQUMvRSxJQUFJLFdBQVcsRUFBRTt3QkFDYixJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pCLElBQUksTUFBTSxHQUFHLG1DQUFnQixDQUFDLG1CQUFtQixDQUFDLDhCQUE4QixDQUFDLENBQUM7d0JBQ2xGLElBQUksTUFBTTs0QkFDTixHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQzlELFNBQVMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO3dCQUMzQiwrQkFBK0I7d0JBQy9CLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3dCQUNuRCxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQ3JELElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7NEJBQ3BCLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQSw0QkFBNEI7OzRCQUUzRCxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUEsNEJBQTRCO3dCQUNoRSxJQUFJLEdBQUcsS0FBSyxDQUFDOzRCQUNULENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQSw0QkFBNEI7OzRCQUUxRCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUEsNEJBQTRCO3dCQUMvRCxJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzt3QkFDMUUsSUFBRyxJQUFJLEdBQUMsQ0FBQzs0QkFDTCxJQUFJLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7OzRCQUUxQixJQUFJLEdBQUMsQ0FBQyxDQUFDO3dCQUNYLFVBQVUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3FCQUN4RDt5QkFBTTt3QkFDSCxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDMUIsOEJBQThCO3dCQUM5QixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7d0JBQzlCLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQy9CLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQ25DO2lCQUNKO2dCQUNELElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNySSxJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDaEo7WUFFRCxRQUFRLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUMsU0FBUyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztRQUU3SixDQUFDO0tBSUo7SUF0TkQsd0NBc05DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcbmltcG9ydCB7IFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XG5pbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xuaW1wb3J0IHsgQ2l0eURpYWxvZ01hcmtldCB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dtYXJrZXRcIjtcbnZhciBsb2cgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2cgPSBNYXRoLmxvZztcbiAgICByZXR1cm4gZnVuY3Rpb24gKG4sIGJhc2UpIHtcbiAgICAgICAgcmV0dXJuIGxvZyhuKSAvIChiYXNlID8gbG9nKGJhc2UpIDogMSk7XG4gICAgfTtcbn0pKCk7XG5leHBvcnQgY2xhc3MgQ2l0eURpYWxvZ1Nob3Age1xuICAgIHN0YXRpYyBpbnN0YW5jZTogQ2l0eURpYWxvZ1Nob3A7XG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IENpdHlEaWFsb2dTaG9wIHtcbiAgICAgICAgaWYgKENpdHlEaWFsb2dTaG9wLmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBDaXR5RGlhbG9nU2hvcC5pbnN0YW5jZSA9IG5ldyBDaXR5RGlhbG9nU2hvcCgpO1xuICAgICAgICByZXR1cm4gQ2l0eURpYWxvZ1Nob3AuaW5zdGFuY2U7XG4gICAgfVxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLXNob3AtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5TaG9wPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8c2VsZWN0IGlkPVwiY2l0eWRpYWxvZy1zaG9wLXRhYmxlLXRhcmdldFwiIHN0eWxlPVwid2lkdGg6NjBweFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBsYWNlaG9sZGVyXCI+cGxhY2Vob2xkZXI8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWluPGJyLz5TdG9jazwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlNlbGxpbmc8YnIvPnByaWNlPGJyLz48YnV0dG9uIGlkPVwic2hvcC1maWxsLXByaWNlXCIgdGl0bGU9XCJyZXNldCBwcmljZVwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZCBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0XCI+MDwvdGQ+JzsvL3N0YWNrXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDoxMTBweFwiPjxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJzaG9wLXNlbGwtc2xpZGVyXycgKyB4ICsgJ1wiIHN0eWxlPVwib3ZlcmZsb3c6ZmxvYXQ7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjFweDt0b3A6NXB4O3dpZHRoOiA1M3B4XCIgPjxkaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkIHN0eWxlPVwid2lkdGg6MzBweDtcIj48c3BhbiBpZD1cImNpdHlkaWFsb2ctc2hvcC1pbmZvXycgKyB4ICsgJ1wiPjwvc3Bhbj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQgc3R5bGU9XCJ3aWR0aDo0MHB4XCI+PGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cInNob3AtYnV5LXNsaWRlcl8nICsgeCArICdcIiBzdHlsZT1cIm92ZXJmbG93OmZsb2F0O3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6NHB4O2hlaWdodDoxcHg7dG9wOjVweDt3aWR0aDogNjJweFwiID48ZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZCBzdHlsZT1cIndpZHRoOjQwcHhcIj4wPC90ZD4nOy8vQWlycGxhbmUgc3RhY2tcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cInNob3AtbWluLXN0b2NrXCIgaWQ9XCJzaG9wLW1pbi1zdG9ja18nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJzaG9wLXNlbGxpbmctcHJpY2VcIiBpZD1cInNob3Atc2VsbGluZy1wcmljZV8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiY2l0eWRpYWxvZy1zaG9wLWluZm9cIj48c3Bhbj5gO1xuXG4gICAgfVxuICAgIGJpbmRBY3Rpb25zKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctc2hvcC10YWJsZS10YXJnZXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuXG4gICAgICAgICAgICBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkudXBkYXRlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaG9wLWZpbGwtcHJpY2VcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgIHZhciBjaXR5ID0gQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNpdHk7XG4gICAgICAgICAgICBpZiAoY2l0eS5zaG9wcyA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIGNpdHkuc2hvcFNlbGxpbmdQcmljZVt4XSA9IGNpdHkuaXNQcm9kdWNlZEhlcmUoeCkgPyBwYXJhbWV0ZXIuYWxsUHJvZHVjdHNbeF0ucHJpY2VQdXJjaGFzZSA6IHBhcmFtZXRlci5hbGxQcm9kdWN0c1t4XS5wcmljZVNlbGxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvcC1taW4tc3RvY2tfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIGNpdHkuc2hvcE1pblN0b2NrW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaG9wLXNlbGxpbmctcHJpY2VfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGNpdHkgPSBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIGNpdHkuc2hvcE1pblN0b2NrW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICQoXCIjc2hvcC1zZWxsLXNsaWRlcl9cIiArIHgpLnNsaWRlcih7XG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIG1heDogNDAsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDQwLFxuICAgICAgICAgICAgICAgIHNsaWRlOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2xpZGVcIik7XG4gICAgICAgICAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuc2xpZGUoZXZlbnQsIGZhbHNlLCBcImNpdHlkaWFsb2ctc2hvcC1pbmZvX1wiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjaGFuZ2U6IGZ1bmN0aW9uIChlLCB1aSkge1xuICAgICAgICAgICAgICAgICAgICBDaXR5RGlhbG9nTWFya2V0LmNoYW5nZVNsaWRlcihlLCB0cnVlLCBcImNpdHlkaWFsb2ctc2hvcC1pbmZvX1wiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdG9wOiBmdW5jdGlvbiAoZTogYW55LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuaW5lZGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcihlLnRhcmdldC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNob3AtaW5mb19cIiArIGlkKS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuc2xpZGVyKFwidmFsdWVcIiwgNDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eURpYWxvZ01hcmtldC5pbmVkaXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoXCIjc2hvcC1idXktc2xpZGVyX1wiICsgeCkuc2xpZGVyKHtcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgbWF4OiA0MCxcbiAgICAgICAgICAgICAgICByYW5nZTogXCJtaW5cIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgICAgICBzbGlkZTogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICBDaXR5RGlhbG9nTWFya2V0LnNsaWRlKGV2ZW50LCB0cnVlLCBcImNpdHlkaWFsb2ctc2hvcC1pbmZvX1wiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGNoYW5nZTogZnVuY3Rpb24gKGUsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuY2hhbmdlU2xpZGVyKGUsIGZhbHNlLCBcImNpdHlkaWFsb2ctc2hvcC1pbmZvX1wiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdG9wOiBmdW5jdGlvbiAoZTogYW55LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuaW5lZGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcihlLnRhcmdldC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNob3AtaW5mb19cIiArIGlkKS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuc2xpZGVyKFwidmFsdWVcIiwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBDaXR5RGlhbG9nTWFya2V0LmluZWRpdCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgdXBkYXRlKCkge1xuXG4gICAgICAgIHZhciBjaXR5ID0gQ2l0eURpYWxvZy5nZXRJbnN0YW5jZSgpLmNpdHk7XG4gICAgICAgIGlmICghY2l0eSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSA8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1zaG9wLXRhYmxlLXRhcmdldFwiKTtcbiAgICAgICAgdmFyIGxhc3QgPSBzZWxlY3QudmFsdWU7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNob3AtdGFibGUtdGFyZ2V0XCIpKSB7XG4gICAgICAgICAgICBzZWxlY3QuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICAgICAgdmFyIGFsbEFQcyA9IGNpdHkuZ2V0QWlycGxhbmVzSW5DaXR5KCk7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbEFQcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgICAgICBvcHQudmFsdWUgPSBhbGxBUHNbeF0ubmFtZTtcbiAgICAgICAgICAgICAgICBvcHQudGV4dCA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXN0ICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0LnZhbHVlID0gbGFzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS51cGRhdGVUaXRsZSgpO1xuXG4gICAgICAgIHZhciBzdG9yZXRhcmdldCA9IENpdHlEaWFsb2dNYXJrZXQuZ2V0U3RvcmUoXCJjaXR5ZGlhbG9nLXNob3AtdGFibGUtdGFyZ2V0XCIpO1xuICAgICAgICB2YXIgc3RvcmVzb3VyY2UgPSBjaXR5LnNob3A7XG4gICAgICAgIHZhciBnZXNhbW91bnQgPSAwO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNob3AtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG4gICAgICAgICAgICBnZXNhbW91bnQgKz0gc3RvcmVzb3VyY2VbeF07XG4gICAgICAgICAgICB0ci5jaGlsZHJlblsxXS5pbm5lckhUTUwgPSBjaXR5LnNob3BbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHZhciBidXlzbGlkZXIgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3AtYnV5LXNsaWRlcl9cIiArIHgpO1xuICAgICAgICAgICAgdmFyIHNlbGxzbGlkZXIgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3Atc2VsbC1zbGlkZXJfXCIgKyB4KTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBidXlzbGlkZXIgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gc2VsbHNsaWRlcikge1xuICAgICAgICAgICAgICAgIGlmIChzdG9yZXRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4ID0gc3RvcmVzb3VyY2VbeF07XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0YXAgPSBDaXR5RGlhbG9nTWFya2V0LmdldEFpcnBsYW5lSW5NYXJrZXQoXCJjaXR5ZGlhbG9nLXNob3AtdGFibGUtdGFyZ2V0XCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdGFwKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4ID0gTWF0aC5taW4obWF4LCB0ZXN0YXAuY2FwYWNpdHkgLSB0ZXN0YXAubG9hZGVkQ291bnQpO1xuICAgICAgICAgICAgICAgICAgICBidXlzbGlkZXIucmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VsbHNsaWRlci5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBidXlzbGlkZXIuc2V0QXR0cmlidXRlKFwibWF4VmFsdWVcIiwgbWF4LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICB0ci5jaGlsZHJlbls1XS5pbm5lckhUTUwgPSBzdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RvcmV0YXJnZXRbeF0gIT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGxzbGlkZXIpLnNsaWRlcihcImVuYWJsZVwiKTsvL3N0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsbHNsaWRlcikuc2xpZGVyKFwiZGlzYWJsZVwiKTsvL3N0b3JldGFyZ2V0W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXggIT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGJ1eXNsaWRlcikuc2xpZGVyKFwiZW5hYmxlXCIpOy8vc3RvcmV0YXJnZXRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgJChidXlzbGlkZXIpLnNsaWRlcihcImRpc2FibGVcIik7Ly9zdG9yZXRhcmdldFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4MiA9IHN0b3JldGFyZ2V0W3hdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlmZiA9IGNpdHkuc2hvcHMgKiBwYXJhbWV0ZXIuY2FwYWNpdHlTaG9wIC0gY2l0eS5nZXRDb21wbGV0ZUFtb3VudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZihkaWZmPjApXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXgyPU1hdGgubWluKG1heDIsIGRpZmYpO1xuICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4Mj0wO1xuICAgICAgICAgICAgICAgICAgICBzZWxsc2xpZGVyLnNldEF0dHJpYnV0ZShcIm1heFZhbHVlXCIsIG1heDIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnV5c2xpZGVyLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VsbHNsaWRlci5yZWFkT25seSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzVdLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICQoYnV5c2xpZGVyKS5zbGlkZXIoXCJkaXNhYmxlXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKHNlbGxzbGlkZXIpLnNsaWRlcihcImRpc2FibGVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRyLmNoaWxkcmVuWzZdLmNoaWxkcmVuWzBdKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50ci5jaGlsZHJlbls2XS5jaGlsZHJlblswXSkudmFsdWUgPSBjaXR5LnNob3BNaW5TdG9ja1t4XSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IGNpdHkuc2hvcE1pblN0b2NrW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdHIuY2hpbGRyZW5bN10uY2hpbGRyZW5bMF0pXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzddLmNoaWxkcmVuWzBdKS52YWx1ZSA9IGNpdHkuc2hvcFNlbGxpbmdQcmljZVt4XSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IGNpdHkuc2hvcFNlbGxpbmdQcmljZVt4XS50b1N0cmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNob3AtaW5mb1wiKS5pbm5lckhUTUwgPSBcIlNob3BzOlwiICsgY2l0eS5zaG9wcyArIFwiIENhcGFjaXR5IFwiICsgZ2VzYW1vdW50ICsgXCIvXCIgKyBjaXR5LnNob3BzICogcGFyYW1ldGVyLmNhcGFjaXR5U2hvcDtcblxuICAgIH1cblxuXG5cbn1cbiJdfQ==