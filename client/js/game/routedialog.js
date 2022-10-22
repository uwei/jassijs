define(["require", "exports", "game/product", "game/icons"], function (require, exports, product_1, icons_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RouteDialog = void 0;
    class RouteDialog {
        constructor() {
            this.dropCitiesEnabled = false;
            this.create();
        }
        static getInstance() {
            if (RouteDialog.instance === undefined)
                RouteDialog.instance = new RouteDialog();
            return RouteDialog.instance;
        }
        create() {
            //template for code reloading
            var sdom = `
          <div hidden id="routedialog" class="routedialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
            var old = document.getElementById("routedialog");
            if (old) {
                old.parentNode.removeChild(old);
            }
            var airplane = this.airplane;
            var products = product_1.allProducts;
            var _this = this;
            var sdom = `
          <div>
          <div>
            <input id="routedialog-airplane-prev" type="button" value="<"/>
            <span id="routedialog-airplane-name"></span>
            <input id="routedialog-airplane-next" type="button" value=">"/>
            <select id="route-select" >
            </select>
            <input id="routedialog-route-next" type="button" value=">"/>
            <button id="route-copy-prev" title="copy prev route">` + icons_1.Icons.copy + `</button>
                      
          </div>
            <div id="routedialog-tabs">
                <ul>
                    <li><a href="#routedialog-unload" class="routedialog-tabs">Unload</a></li>
                    <li><a href="#routedialog-load" class="routedialog-tabs">Load</a></li>
                </ul>
                <div id="routedialog-unload">
                      <table id="routedialog-unload-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Name</th>
                            <th></th>
                            <th>Market<br/>max amount<br/><button id="route-unload-market-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button> </th>
                            <th>Market<br/>min price</th>
                            <th>Warehouse<br/>amount<br/>
                            <button id="route-unload-warehous-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button>
                            <button id="route-unload-warehous-fill9" title="fill 99999999 down">` + icons_1.Icons.nine + `</button>
                            </th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                function price(id, change) {
                    console.log(id + " " + change);
                }
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + product_1.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + product_1.allProducts[x].name + "</td>";
                    ret = ret + '<td>' + '<input type="number" min="0" class="unload-market-max-amount" id="unload-market-max-amount_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="unload-market-min-price" id="unload-market-min-price_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="unload-warehouse-amount" id="unload-warehouse-amount_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>    
                </div>
                <div id="routedialog-load">
                      <table id="routedialog-load-table" style="height:100%;weight:100%;">
                        <tr >
                            <th>Name</th>
                            <th></th>
                            <th>Market<br/>amount<br/><button id="route-load-market-fill">` + icons_1.Icons.fillDown + `</button></th>
                            <th>Market<br/>until amount<br/><button id="route-load-market-until-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button></th>
                            <th>Market<br/>max price</th>
                            <th>Warehouse<br/>amount<br/>
                                <button id="route-load-warehouse-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button>
                                <button id="route-load-fill-consumtion" title="fill consumtion">` + icons_1.Icons.food + `</button>
                            </th>
                            <th>Warehouse<br/>until amount<br/>
                                <button id="route-load-warehouse-until-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button>
                                <button id="route-load-fill-consumtion-until" title="fill consumtion">` + icons_1.Icons.food + `</button>
                            </th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                function price(id, change) {
                    console.log(id + " " + change);
                }
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + product_1.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + product_1.allProducts[x].name + "</td>";
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-market-max-amount" id="load-market-max-amount_' + x + '"' +
                        'style="width: 40px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-market-until-amount" id="load-market-until-amount_' + x + '"' +
                        'style="width: 40px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-market-max-price" id="load-market-max-price_' + x + '"' +
                        'style="width: 40px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-warehouse-amount" id="load-warehouse-amount_' + x + '"' +
                        'style="width: 40px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-warehouse-until-amount" id="load-warehouse-until-amount_' + x + '"' +
                        'style="width: 40px;"' + '"></td>';
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>    
                 </div>
                <div>
                
            </div>
          </div>
        `;
            var newdom = document.createRange().createContextualFragment(sdom).children[0];
            this.dom.removeChild(this.dom.children[0]);
            this.dom.appendChild(newdom);
            $("#routedialog-tabs").tabs({
            //collapsible: true
            });
            setTimeout(() => {
                $("#routedialog-tabs").tabs({
                //collapsible: true
                });
                //  $( "#route-list" ).sortable();
            }, 100);
            document.body.appendChild(this.dom);
            //        document.getElementById("citydialog-prev")
            setTimeout(() => {
                _this.bindActions();
            }, 500);
            //document.createElement("span");
        }
        bindActions() {
            var _this = this;
            for (var x = 0; x < product_1.allProducts.length; x++) {
                document.getElementById("unload-market-max-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.unloadMarketAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("load-market-until-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.loadMarketUntilAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("unload-market-min-price_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.unloadMarketPrice[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("unload-warehouse-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.unloadWarehouseAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("load-market-max-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.loadMarketAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("load-market-max-price_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.loadMarketPrice[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("load-warehouse-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.loadWarehouseAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("load-warehouse-until-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.loadWarehouseUntilAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
            }
            document.getElementById("route-select").addEventListener("change", (e) => {
                var val = document.getElementById("route-select").value;
                var id = parseInt(val);
                _this.route = _this.airplane.route[id];
                _this.update();
            });
            document.getElementById("route-unload-market-fill").addEventListener("click", (e) => {
                for (var x = 1; x < _this.route.unloadMarketAmount.length; x++) {
                    this.route.unloadMarketAmount[x] = this.route.unloadMarketAmount[0];
                }
                _this.update();
            });
            document.getElementById("route-unload-warehous-fill").addEventListener("click", (e) => {
                for (var x = 1; x < _this.route.unloadWarehouseAmount.length; x++) {
                    this.route.unloadWarehouseAmount[x] = this.route.unloadWarehouseAmount[0];
                }
                _this.update();
            });
            document.getElementById("route-unload-warehous-fill9").addEventListener("click", (e) => {
                for (var x = 0; x < _this.route.unloadWarehouseAmount.length; x++) {
                    this.route.unloadWarehouseAmount[x] = 9999999999;
                }
                _this.update();
            });
            document.getElementById("route-load-market-fill").addEventListener("click", (e) => {
                for (var x = 1; x < _this.route.loadMarketAmount.length; x++) {
                    this.route.loadMarketAmount[x] = this.route.loadMarketAmount[0];
                }
                _this.update();
            });
            document.getElementById("route-load-market-until-fill").addEventListener("click", (e) => {
                for (var x = 1; x < _this.route.loadMarketUntilAmount.length; x++) {
                    this.route.loadMarketUntilAmount[x] = this.route.loadMarketUntilAmount[0];
                }
                _this.update();
            });
            document.getElementById("route-load-warehouse-fill").addEventListener("click", (e) => {
                for (var x = 1; x < _this.route.loadWarehouseAmount.length; x++) {
                    this.route.loadWarehouseAmount[x] = this.route.loadWarehouseAmount[0];
                }
                _this.update();
            });
            document.getElementById("route-load-warehouse-until-fill").addEventListener("click", (e) => {
                for (var x = 1; x < _this.route.loadWarehouseUntilAmount.length; x++) {
                    this.route.loadWarehouseUntilAmount[x] = this.route.loadWarehouseUntilAmount[0];
                }
                _this.update();
            });
            document.getElementById("route-load-fill-consumtion").addEventListener("click", (e) => {
                _this.loadFillConsumtion(true);
            });
            document.getElementById("route-load-fill-consumtion-until").addEventListener("click", (e) => {
                _this.loadFillConsumtion(false);
            });
            document.getElementById("route-copy-prev").addEventListener("click", (e) => {
                _this.copyRoute();
            });
            document.getElementById("routedialog-airplane-prev").addEventListener("click", (e) => {
                _this.prevAirplane();
            });
            document.getElementById("routedialog-airplane-next").addEventListener("click", (e) => {
                _this.nextAirplane();
            });
            document.getElementById("routedialog-route-next").addEventListener("click", (e) => {
                _this.nextRoute();
            });
        }
        prevAirplane() {
            var _this = this;
            var pos = _this.airplane.world.airplanes.indexOf(_this.airplane);
            pos--;
            if (pos === 0)
                pos = _this.airplane.world.airplanes.length - 1;
            _this.airplane = _this.airplane.world.airplanes[pos];
            _this.route = undefined;
            if (_this.airplane.world.airplanes[pos].route.length === 0) {
                _this.route = undefined;
                this.prevAirplane();
                return;
            }
            _this.route = _this.airplane.world.airplanes[pos].route[0];
            _this.update(true);
        }
        nextAirplane() {
            var _this = this;
            var pos = _this.airplane.world.airplanes.indexOf(_this.airplane);
            pos++;
            if (pos >= _this.airplane.world.airplanes.length)
                pos = 0;
            _this.airplane = _this.airplane.world.airplanes[pos];
            if (_this.airplane.world.airplanes[pos].route.length === 0) {
                _this.route = undefined;
                this.nextAirplane();
                return;
            }
            _this.route = _this.airplane.world.airplanes[pos].route[0];
            _this.update(true);
        }
        nextRoute() {
            var _this = this;
            var pos = _this.airplane.route.indexOf(this.route);
            pos++;
            if (pos === _this.airplane.route.length) {
                pos = 0;
            }
            _this.route = _this.airplane.route[pos];
            _this.update();
        }
        copyRoute() {
            var pos = this.route.airplane.route.indexOf(this.route);
            if (pos === 0)
                return;
            pos--;
            var source = this.route.airplane.route[pos];
            for (var x = 0; x < product_1.allProducts.length; x++) {
                this.route.loadMarketAmount[x] = source.loadMarketAmount[x];
                this.route.loadMarketPrice[x] = source.loadMarketPrice[x];
                this.route.loadMarketUntilAmount[x] = source.loadMarketUntilAmount[x];
                this.route.loadWarehouseAmount[x] = source.loadWarehouseAmount[x];
                this.route.loadWarehouseUntilAmount[x] = source.loadWarehouseUntilAmount[x];
                this.route.unloadMarketAmount[x] = source.unloadMarketAmount[x];
                this.route.unloadMarketPrice[x] = source.unloadMarketPrice[x];
                this.route.unloadWarehouseAmount[x] = source.unloadWarehouseAmount[x];
            }
            this.update();
        }
        loadFillConsumtion(allCities) {
            var _this = this;
            var all = _this.route.airplane.route;
            var lenpixel = 0;
            var lastpos = undefined;
            for (var x = 0; x < all.length; x++) {
                var city = _this.route.airplane.world.cities[all[x].cityid];
                if (lastpos === undefined) {
                    lastpos = [city.x, city.y];
                    var lastcity = _this.route.airplane.world.cities[all[all.length - 1].cityid];
                    var dist = Math.round(Math.sqrt(Math.pow(lastpos[0] - lastcity.x, 2) + Math.pow(lastpos[1] - lastcity.y, 2))); //Pytharoras
                    lenpixel += dist;
                }
                else {
                    var dist = Math.round(Math.sqrt(Math.pow(lastpos[0] - city.x, 2) + Math.pow(lastpos[1] - city.y, 2))); //Pytharoras
                    lenpixel += dist;
                    lastpos = [city.x, city.y];
                }
            }
            var days = lenpixel / _this.route.airplane.speed; //t=s/v; in Tage
            var totalDays = (Math.round(days * 24) + 1 + all.length * 3 + all.length * 3); //+3h load and unload
            console.log(totalDays);
            var store = allCities ? this.route.loadWarehouseAmount : this.route.loadWarehouseUntilAmount;
            for (var x = 0; x < product_1.allProducts.length; x++) {
                store[x] = 0;
            }
            for (var x = 0; x < all.length; x++) {
                var city = _this.route.airplane.world.cities[all[x].cityid];
                var cause;
                if (allCities) {
                    cause = (all[x].cityid !== this.route.cityid);
                }
                else {
                    cause = all[x].cityid === this.route.cityid;
                }
                if (cause) {
                    for (var c = 0; c < city.companies.length; c++) {
                        var prod = product_1.allProducts[city.companies[c].productid];
                        if (prod.input1)
                            store[prod.input1] += Math.round((1.1 * city.companies[c].buildings * prod.input1Amount));
                        if (prod.input2)
                            store[prod.input2] += Math.round((1.1 * city.companies[c].buildings * prod.input2Amount));
                    }
                    for (var y = 0; y < product_1.allProducts.length; y++) {
                        store[y] += Math.round(1.1 * totalDays * product_1.allProducts[y].dailyConsumtion * city.people / 24);
                    }
                }
            }
            _this.update();
        }
        update(force = false) {
            try {
                if (!$(this.dom).dialog('isOpen')) {
                    return;
                }
            }
            catch (_a) {
                return;
            }
            document.getElementById("routedialog-airplane-name").innerHTML = this.airplane.name;
            var select = document.getElementById("route-select");
            select.innerHTML = "";
            for (var x = 0; x < this.airplane.route.length; x++) {
                var opt = document.createElement("option");
                var city = this.airplane.world.cities[this.airplane.route[x].cityid];
                opt.value = "" + x;
                opt.text = city.name;
                select.appendChild(opt);
            }
            if (this.route)
                select.value = "" + this.airplane.route.indexOf(this.route);
            else {
                document.getElementById("unload-market-max-amount").value = "";
                document.getElementById("unload-market-min-price").value = "";
                document.getElementById("unload-warehouse-amount").value = "";
                document.getElementById("load-market-max-amount").value = "";
                document.getElementById("load-market-until-amount").value = "";
                document.getElementById("load-market-max-price").value = "";
                document.getElementById("load-warehouse-amount").value = "";
                document.getElementById("load-warehouse-until-amount").value = "";
                return;
            }
            for (var x = 0; x < product_1.allProducts.length; x++) {
                if (document.activeElement !== document.getElementById("unload-market-max-amount_" + x))
                    document.getElementById("unload-market-max-amount_" + x).value = (this.route.unloadMarketAmount[x] === undefined) ? "" : this.route.unloadMarketAmount[x].toString();
                if (document.activeElement !== document.getElementById("unload-market-min-price_" + x))
                    document.getElementById("unload-market-min-price_" + x).value = (this.route.unloadMarketPrice[x] === undefined) ? "" : this.route.unloadMarketPrice[x].toString();
                if (document.activeElement !== document.getElementById("unload-warehouse-amount_" + x))
                    document.getElementById("unload-warehouse-amount_" + x).value = (this.route.unloadWarehouseAmount[x] === undefined) ? "" : this.route.unloadWarehouseAmount[x].toString();
                if (document.activeElement !== document.getElementById("load-market-max-amount_" + x))
                    document.getElementById("load-market-max-amount_" + x).value = (this.route.loadMarketAmount[x] === undefined) ? "" : this.route.loadMarketAmount[x].toString();
                if (document.activeElement !== document.getElementById("load-market-until-amount_" + x))
                    document.getElementById("load-market-until-amount_" + x).value = (this.route.loadMarketUntilAmount[x] === undefined) ? "" : this.route.loadMarketUntilAmount[x].toString();
                if (document.activeElement !== document.getElementById("load-market-max-price_" + x))
                    document.getElementById("load-market-max-price_" + x).value = (this.route.loadMarketPrice[x] === undefined) ? "" : this.route.loadMarketPrice[x].toString();
                if (document.activeElement !== document.getElementById("load-warehouse-amount_" + x))
                    document.getElementById("load-warehouse-amount_" + x).value = (this.route.loadWarehouseAmount[x] === undefined) ? "" : this.route.loadWarehouseAmount[x].toString();
                if (document.activeElement !== document.getElementById("load-warehouse-until-amount_" + x))
                    document.getElementById("load-warehouse-until-amount_" + x).value = (this.route.loadWarehouseUntilAmount[x] === undefined) ? "" : this.route.loadWarehouseUntilAmount[x].toString();
            }
        }
        show() {
            var _this = this;
            this.dom.removeAttribute("hidden");
            this.update();
            //ui-tabs-active
            $(this.dom).dialog({
                width: "425px",
                draggable: true,
                //     position:{my:"left top",at:"right top",of:$(document)} ,
                open: function (event, ui) {
                    _this.update(true);
                },
                close: function () {
                }
            }).dialog("widget").draggable("option", "containment", "none");
            $(this.dom).parent().css({ position: "fixed" });
        }
        close() {
            $(this.dom).dialog("close");
        }
    }
    exports.RouteDialog = RouteDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3JvdXRlZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFNQSxNQUFhLFdBQVc7UUFPcEI7WUFITyxzQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFLN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNsQyxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDN0MsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2hDLENBQUM7UUFDTyxNQUFNO1lBQ1YsNkJBQTZCO1lBQzdCLElBQUksSUFBSSxHQUFHOzs7O1NBSVYsQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2pELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM3QixJQUFJLFFBQVEsR0FBRyxxQkFBVyxDQUFDO1lBQzNCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRzs7Ozs7Ozs7O2tFQVMrQyxHQUFFLGFBQUssQ0FBQyxJQUFJLEdBQUc7Ozs7Ozs7Ozs7Ozs7NkhBYTRDLEdBQUUsYUFBSyxDQUFDLFFBQVEsR0FBRzs7O2lHQUcvQyxHQUFFLGFBQUssQ0FBQyxRQUFRLEdBQUc7aUdBQ25CLEdB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LFFBQVEsRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRCxDQUFDO1FBQ0QsS0FBSztZQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FDSjtJQXJjRCxrQ0FxY0MiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGFsbFByb2R1Y3RzLCBQcm9kdWN0IH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xuaW1wb3J0IHsgUm91dGUgfSBmcm9tIFwiZ2FtZS9yb3V0ZVwiO1xuXG5leHBvcnQgY2xhc3MgUm91dGVEaWFsb2cge1xuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XG4gICAgYWlycGxhbmU6IEFpcnBsYW5lO1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U7XG4gICAgcHVibGljIGRyb3BDaXRpZXNFbmFibGVkID0gZmFsc2U7XG4gICAgcm91dGU6IFJvdXRlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcblxuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogUm91dGVEaWFsb2cge1xuICAgICAgICBpZiAoUm91dGVEaWFsb2cuaW5zdGFuY2UgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIFJvdXRlRGlhbG9nLmluc3RhbmNlID0gbmV3IFJvdXRlRGlhbG9nKCk7XG4gICAgICAgIHJldHVybiBSb3V0ZURpYWxvZy5pbnN0YW5jZTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXG4gICAgICAgIHZhciBzZG9tID0gYFxuICAgICAgICAgIDxkaXYgaGlkZGVuIGlkPVwicm91dGVkaWFsb2dcIiBjbGFzcz1cInJvdXRlZGlhbG9nXCI+XG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxuICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgdGhpcy5kb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZWRpYWxvZ1wiKTtcbiAgICAgICAgaWYgKG9sZCkge1xuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYWlycGxhbmUgPSB0aGlzLmFpcnBsYW5lO1xuICAgICAgICB2YXIgcHJvZHVjdHMgPSBhbGxQcm9kdWN0cztcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGlucHV0IGlkPVwicm91dGVkaWFsb2ctYWlycGxhbmUtcHJldlwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjxcIi8+XG4gICAgICAgICAgICA8c3BhbiBpZD1cInJvdXRlZGlhbG9nLWFpcnBsYW5lLW5hbWVcIj48L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJyb3V0ZWRpYWxvZy1haXJwbGFuZS1uZXh0XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPlwiLz5cbiAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJyb3V0ZS1zZWxlY3RcIiA+XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInJvdXRlZGlhbG9nLXJvdXRlLW5leHRcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI+XCIvPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJvdXRlLWNvcHktcHJldlwiIHRpdGxlPVwiY29weSBwcmV2IHJvdXRlXCI+YCsgSWNvbnMuY29weSArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJyb3V0ZWRpYWxvZy10YWJzXCI+XG4gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNyb3V0ZWRpYWxvZy11bmxvYWRcIiBjbGFzcz1cInJvdXRlZGlhbG9nLXRhYnNcIj5VbmxvYWQ8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjcm91dGVkaWFsb2ctbG9hZFwiIGNsYXNzPVwicm91dGVkaWFsb2ctdGFic1wiPkxvYWQ8L2E+PC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJyb3V0ZWRpYWxvZy11bmxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgaWQ9XCJyb3V0ZWRpYWxvZy11bmxvYWQtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWFya2V0PGJyLz5tYXggYW1vdW50PGJyLz48YnV0dG9uIGlkPVwicm91dGUtdW5sb2FkLW1hcmtldC1maWxsXCIgdGl0bGU9XCJmaWxsIGZpcnN0IHJvdyBkb3duXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+IDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1hcmtldDxici8+bWluIHByaWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+V2FyZWhvdXNlPGJyLz5hbW91bnQ8YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS11bmxvYWQtd2FyZWhvdXMtZmlsbFwiIHRpdGxlPVwiZmlsbCBmaXJzdCByb3cgZG93blwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS11bmxvYWQtd2FyZWhvdXMtZmlsbDlcIiB0aXRsZT1cImZpbGwgOTk5OTk5OTkgZG93blwiPmArIEljb25zLm5pbmUgKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmljZShpZDogc3RyaW5nLCBjaGFuZ2U6IG51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCArIFwiIFwiICsgY2hhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwidW5sb2FkLW1hcmtldC1tYXgtYW1vdW50XCIgaWQ9XCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cInVubG9hZC1tYXJrZXQtbWluLXByaWNlXCIgaWQ9XCJ1bmxvYWQtbWFya2V0LW1pbi1wcmljZV8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwidW5sb2FkLXdhcmVob3VzZS1hbW91bnRcIiBpZD1cInVubG9hZC13YXJlaG91c2UtYW1vdW50XycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPiAgICBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwicm91dGVkaWFsb2ctbG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBpZD1cInJvdXRlZGlhbG9nLWxvYWQtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1hcmtldDxici8+YW1vdW50PGJyLz48YnV0dG9uIGlkPVwicm91dGUtbG9hZC1tYXJrZXQtZmlsbFwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1hcmtldDxici8+dW50aWwgYW1vdW50PGJyLz48YnV0dG9uIGlkPVwicm91dGUtbG9hZC1tYXJrZXQtdW50aWwtZmlsbFwiIHRpdGxlPVwiZmlsbCBmaXJzdCByb3cgZG93blwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1hcmtldDxici8+bWF4IHByaWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+V2FyZWhvdXNlPGJyLz5hbW91bnQ8YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicm91dGUtbG9hZC13YXJlaG91c2UtZmlsbFwiIHRpdGxlPVwiZmlsbCBmaXJzdCByb3cgZG93blwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicm91dGUtbG9hZC1maWxsLWNvbnN1bXRpb25cIiB0aXRsZT1cImZpbGwgY29uc3VtdGlvblwiPmArIEljb25zLmZvb2QgKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+V2FyZWhvdXNlPGJyLz51bnRpbCBhbW91bnQ8YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicm91dGUtbG9hZC13YXJlaG91c2UtdW50aWwtZmlsbFwiIHRpdGxlPVwiZmlsbCBmaXJzdCByb3cgZG93blwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicm91dGUtbG9hZC1maWxsLWNvbnN1bXRpb24tdW50aWxcIiB0aXRsZT1cImZpbGwgY29uc3VtdGlvblwiPmArIEljb25zLmZvb2QgKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmljZShpZDogc3RyaW5nLCBjaGFuZ2U6IG51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCArIFwiIFwiICsgY2hhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwibG9hZC1tYXJrZXQtbWF4LWFtb3VudFwiIGlkPVwibG9hZC1tYXJrZXQtbWF4LWFtb3VudF8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDQwcHg7XCInICsgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwibG9hZC1tYXJrZXQtdW50aWwtYW1vdW50XCIgaWQ9XCJsb2FkLW1hcmtldC11bnRpbC1hbW91bnRfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA0MHB4O1wiJyArICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cImxvYWQtbWFya2V0LW1heC1wcmljZVwiIGlkPVwibG9hZC1tYXJrZXQtbWF4LXByaWNlXycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNDBweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJsb2FkLXdhcmVob3VzZS1hbW91bnRcIiBpZD1cImxvYWQtd2FyZWhvdXNlLWFtb3VudF8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDQwcHg7XCInICsgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwibG9hZC13YXJlaG91c2UtdW50aWwtYW1vdW50XCIgaWQ9XCJsb2FkLXdhcmVob3VzZS11bnRpbC1hbW91bnRfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA0MHB4O1wiJyArICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+ICAgIFxuICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XG4gICAgICAgICQoXCIjcm91dGVkaWFsb2ctdGFic1wiKS50YWJzKHtcbiAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJChcIiNyb3V0ZWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gICQoIFwiI3JvdXRlLWxpc3RcIiApLnNvcnRhYmxlKCk7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIF90aGlzLmJpbmRBY3Rpb25zKCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgfVxuXG4gICAgYmluZEFjdGlvbnMoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LXVudGlsLWFtb3VudF9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1pbi1wcmljZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLnVubG9hZE1hcmtldFByaWNlW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudF9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZE1hcmtldEFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LXByaWNlX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZE1hcmtldFByaWNlW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlQW1vdW50W2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS11bnRpbC1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnRbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtc2VsZWN0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHZhciB2YWwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1zZWxlY3RcIikpLnZhbHVlO1xuICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQodmFsKTtcbiAgICAgICAgICAgIF90aGlzLnJvdXRlID0gX3RoaXMuYWlycGxhbmUucm91dGVbaWRdO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLXVubG9hZC1tYXJrZXQtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAxOyB4IDwgX3RoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbeF0gPSB0aGlzLnJvdXRlLnVubG9hZE1hcmtldEFtb3VudFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS11bmxvYWQtd2FyZWhvdXMtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAxOyB4IDwgX3RoaXMucm91dGUudW5sb2FkV2FyZWhvdXNlQW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS51bmxvYWRXYXJlaG91c2VBbW91bnRbeF0gPSB0aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS11bmxvYWQtd2FyZWhvdXMtZmlsbDlcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IF90aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGUudW5sb2FkV2FyZWhvdXNlQW1vdW50W3hdID0gOTk5OTk5OTk5OTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLW1hcmtldC1maWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPCBfdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50W3hdID0gdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50WzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxvYWQtbWFya2V0LXVudGlsLWZpbGxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IF90aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGUubG9hZE1hcmtldFVudGlsQW1vdW50W3hdID0gdGhpcy5yb3V0ZS5sb2FkTWFya2V0VW50aWxBbW91bnRbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbG9hZC13YXJlaG91c2UtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAxOyB4IDwgX3RoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFt4XSA9IHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLXdhcmVob3VzZS11bnRpbC1maWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPCBfdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XSA9IHRoaXMucm91dGUubG9hZFdhcmVob3VzZVVudGlsQW1vdW50WzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxvYWQtZmlsbC1jb25zdW10aW9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgX3RoaXMubG9hZEZpbGxDb25zdW10aW9uKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLWZpbGwtY29uc3VtdGlvbi11bnRpbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIF90aGlzLmxvYWRGaWxsQ29uc3VtdGlvbihmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWNvcHktcHJldlwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIF90aGlzLmNvcHlSb3V0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZWRpYWxvZy1haXJwbGFuZS1wcmV2XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgX3RoaXMucHJldkFpcnBsYW5lKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nLWFpcnBsYW5lLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBfdGhpcy5uZXh0QWlycGxhbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGVkaWFsb2ctcm91dGUtbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIF90aGlzLm5leHRSb3V0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHJldkFpcnBsYW5lKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoX3RoaXMuYWlycGxhbmUpO1xuICAgICAgICBwb3MtLTtcbiAgICAgICAgaWYgKHBvcyA9PT0gMClcbiAgICAgICAgICAgIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5sZW5ndGggLSAxO1xuICAgICAgICBfdGhpcy5haXJwbGFuZSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdO1xuICAgICAgICBfdGhpcy5yb3V0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdLnJvdXRlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgX3RoaXMucm91dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnByZXZBaXJwbGFuZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLnJvdXRlID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc10ucm91dGVbMF07XG4gICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICB9XG4gICAgbmV4dEFpcnBsYW5lKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoX3RoaXMuYWlycGxhbmUpO1xuICAgICAgICBwb3MrKztcbiAgICAgICAgaWYgKHBvcyA+PSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoKVxuICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgX3RoaXMuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXTtcbiAgICAgICAgaWYgKF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdLnJvdXRlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgX3RoaXMucm91dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLm5leHRBaXJwbGFuZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLnJvdXRlID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc10ucm91dGVbMF07XG4gICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICB9XG4gICAgbmV4dFJvdXRlKCkge1xuICAgICAgICB2YXIgX3RoaXM9dGhpcztcbiAgICAgICAgdmFyIHBvcz1fdGhpcy5haXJwbGFuZS5yb3V0ZS5pbmRleE9mKHRoaXMucm91dGUpO1xuICAgICAgICBwb3MrKztcbiAgICAgICAgaWYocG9zPT09X3RoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoKXtcbiAgICAgICAgICAgIHBvcz0wO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLnJvdXRlID0gX3RoaXMuYWlycGxhbmUucm91dGVbcG9zXTtcbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgY29weVJvdXRlKCkge1xuICAgICAgICB2YXIgcG9zID0gdGhpcy5yb3V0ZS5haXJwbGFuZS5yb3V0ZS5pbmRleE9mKHRoaXMucm91dGUpO1xuICAgICAgICBpZiAocG9zID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBwb3MtLTtcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMucm91dGUuYWlycGxhbmUucm91dGVbcG9zXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50W3hdID0gc291cmNlLmxvYWRNYXJrZXRBbW91bnRbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRNYXJrZXRQcmljZVt4XSA9IHNvdXJjZS5sb2FkTWFya2V0UHJpY2VbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudFt4XSA9IHNvdXJjZS5sb2FkTWFya2V0VW50aWxBbW91bnRbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VBbW91bnRbeF0gPSBzb3VyY2UubG9hZFdhcmVob3VzZUFtb3VudFt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUubG9hZFdhcmVob3VzZVVudGlsQW1vdW50W3hdID0gc291cmNlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50W3hdID0gc291cmNlLnVubG9hZE1hcmtldEFtb3VudFt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUudW5sb2FkTWFya2V0UHJpY2VbeF0gPSBzb3VyY2UudW5sb2FkTWFya2V0UHJpY2VbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFt4XSA9IHNvdXJjZS51bmxvYWRXYXJlaG91c2VBbW91bnRbeF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9XG4gICAgbG9hZEZpbGxDb25zdW10aW9uKGFsbENpdGllczogYm9vbGVhbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgYWxsID0gX3RoaXMucm91dGUuYWlycGxhbmUucm91dGU7XG4gICAgICAgIHZhciBsZW5waXhlbCA9IDA7XG4gICAgICAgIHZhciBsYXN0cG9zID0gdW5kZWZpbmVkO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIGNpdHkgPSBfdGhpcy5yb3V0ZS5haXJwbGFuZS53b3JsZC5jaXRpZXNbYWxsW3hdLmNpdHlpZF07XG4gICAgICAgICAgICBpZiAobGFzdHBvcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbGFzdHBvcyA9IFtjaXR5LngsIGNpdHkueV07XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RjaXR5ID0gX3RoaXMucm91dGUuYWlycGxhbmUud29ybGQuY2l0aWVzW2FsbFthbGwubGVuZ3RoIC0gMV0uY2l0eWlkXTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdCA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KE1hdGgucG93KGxhc3Rwb3NbMF0gLSBsYXN0Y2l0eS54LCAyKSArIE1hdGgucG93KGxhc3Rwb3NbMV0gLSBsYXN0Y2l0eS55LCAyKSkpOy8vUHl0aGFyb3Jhc1xuICAgICAgICAgICAgICAgIGxlbnBpeGVsICs9IGRpc3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0ID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoTWF0aC5wb3cobGFzdHBvc1swXSAtIGNpdHkueCwgMikgKyBNYXRoLnBvdyhsYXN0cG9zWzFdIC0gY2l0eS55LCAyKSkpOy8vUHl0aGFyb3Jhc1xuICAgICAgICAgICAgICAgIGxlbnBpeGVsICs9IGRpc3Q7XG4gICAgICAgICAgICAgICAgbGFzdHBvcyA9IFtjaXR5LngsIGNpdHkueV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRheXMgPSBsZW5waXhlbCAvIF90aGlzLnJvdXRlLmFpcnBsYW5lLnNwZWVkOyAvL3Q9cy92OyBpbiBUYWdlXG4gICAgICAgIHZhciB0b3RhbERheXMgPSAoTWF0aC5yb3VuZChkYXlzICogMjQpICsgMSArIGFsbC5sZW5ndGggKiAzICsgYWxsLmxlbmd0aCAqIDMpOyAgIC8vKzNoIGxvYWQgYW5kIHVubG9hZFxuICAgICAgICBjb25zb2xlLmxvZyh0b3RhbERheXMpO1xuICAgICAgICB2YXIgc3RvcmUgPSBhbGxDaXRpZXMgPyB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VBbW91bnQgOiB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudDtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgc3RvcmVbeF0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgY2l0eSA9IF90aGlzLnJvdXRlLmFpcnBsYW5lLndvcmxkLmNpdGllc1thbGxbeF0uY2l0eWlkXTtcbiAgICAgICAgICAgIHZhciBjYXVzZTtcbiAgICAgICAgICAgIGlmIChhbGxDaXRpZXMpIHtcbiAgICAgICAgICAgICAgICBjYXVzZSA9IChhbGxbeF0uY2l0eWlkICE9PSB0aGlzLnJvdXRlLmNpdHlpZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhdXNlID0gYWxsW3hdLmNpdHlpZCA9PT0gdGhpcy5yb3V0ZS5jaXR5aWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjYXVzZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY2l0eS5jb21wYW5pZXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb2QgPSBhbGxQcm9kdWN0c1tjaXR5LmNvbXBhbmllc1tjXS5wcm9kdWN0aWRdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZC5pbnB1dDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZVtwcm9kLmlucHV0MV0gKz0gTWF0aC5yb3VuZCgoMS4xICogY2l0eS5jb21wYW5pZXNbY10uYnVpbGRpbmdzICogcHJvZC5pbnB1dDFBbW91bnQpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2QuaW5wdXQyKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVbcHJvZC5pbnB1dDJdICs9IE1hdGgucm91bmQoKDEuMSAqIGNpdHkuY29tcGFuaWVzW2NdLmJ1aWxkaW5ncyAqIHByb2QuaW5wdXQyQW1vdW50KSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVt5XSArPSBNYXRoLnJvdW5kKDEuMSAqIHRvdGFsRGF5cyAqIGFsbFByb2R1Y3RzW3ldLmRhaWx5Q29uc3VtdGlvbiAqIGNpdHkucGVvcGxlIC8gMjQpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgfVxuXG5cbiAgICB1cGRhdGUoZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCEkKHRoaXMuZG9tKS5kaWFsb2coJ2lzT3BlbicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nLWFpcnBsYW5lLW5hbWVcIikuaW5uZXJIVE1MID0gdGhpcy5haXJwbGFuZS5uYW1lO1xuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1zZWxlY3RcIik7XG4gICAgICAgIHNlbGVjdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgIHZhciBjaXR5ID0gdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbdGhpcy5haXJwbGFuZS5yb3V0ZVt4XS5jaXR5aWRdO1xuICAgICAgICAgICAgb3B0LnZhbHVlID0gXCJcIiArIHg7XG4gICAgICAgICAgICBvcHQudGV4dCA9IGNpdHkubmFtZTtcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJvdXRlKVxuICAgICAgICAgICAgc2VsZWN0LnZhbHVlID0gXCJcIiArIHRoaXMuYWlycGxhbmUucm91dGUuaW5kZXhPZih0aGlzLnJvdXRlKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWluLXByaWNlXCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtdW50aWwtYW1vdW50XCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtcHJpY2VcIikpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtd2FyZWhvdXNlLWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC13YXJlaG91c2UtdW50aWwtYW1vdW50XCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWluLXByaWNlX1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLW1hcmtldC1taW4tcHJpY2VfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRQcmljZVt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLnVubG9hZE1hcmtldFByaWNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudF9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC13YXJlaG91c2UtYW1vdW50X1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUudW5sb2FkV2FyZWhvdXNlQW1vdW50W3hdID09PSB1bmRlZmluZWQpID8gXCJcIiA6IHRoaXMucm91dGUudW5sb2FkV2FyZWhvdXNlQW1vdW50W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LWFtb3VudF9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLmxvYWRNYXJrZXRBbW91bnRbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC11bnRpbC1hbW91bnRfXCIgKyB4KSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC11bnRpbC1hbW91bnRfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS5sb2FkTWFya2V0VW50aWxBbW91bnRbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS5sb2FkTWFya2V0VW50aWxBbW91bnRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1wcmljZV9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1wcmljZV9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLmxvYWRNYXJrZXRQcmljZVt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRNYXJrZXRQcmljZVt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC13YXJlaG91c2UtYW1vdW50X1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC13YXJlaG91c2UtYW1vdW50X1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VBbW91bnRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtd2FyZWhvdXNlLXVudGlsLWFtb3VudF9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtd2FyZWhvdXNlLXVudGlsLWFtb3VudF9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XS50b1N0cmluZygpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAvL3VpLXRhYnMtYWN0aXZlXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XG4gICAgICAgICAgICB3aWR0aDogXCI0MjVweFwiLFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgLy8gICAgIHBvc2l0aW9uOntteTpcImxlZnQgdG9wXCIsYXQ6XCJyaWdodCB0b3BcIixvZjokKGRvY3VtZW50KX0gLFxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5kaWFsb2coXCJ3aWRnZXRcIikuZHJhZ2dhYmxlKFwib3B0aW9uXCIsIFwiY29udGFpbm1lbnRcIiwgXCJub25lXCIpO1xuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xuXG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICB9XG59XG4iXX0=