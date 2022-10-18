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
                _this.prevRoute();
            });
            document.getElementById("routedialog-airplane-next").addEventListener("click", (e) => {
                _this.nextRoute();
            });
        }
        prevRoute() {
            var _this = this;
            var pos = _this.airplane.world.airplanes.indexOf(_this.airplane);
            pos--;
            if (pos === 0)
                pos = _this.airplane.world.airplanes.length - 1;
            _this.airplane = _this.airplane.world.airplanes[pos];
            _this.route = undefined;
            if (_this.airplane.world.airplanes[pos].route.length === 0) {
                _this.route = undefined;
                this.prevRoute();
                return;
            }
            _this.route = _this.airplane.world.airplanes[pos].route[0];
            _this.update(true);
        }
        nextRoute() {
            var _this = this;
            var pos = _this.airplane.world.airplanes.indexOf(_this.airplane);
            pos++;
            if (pos >= _this.airplane.world.airplanes.length)
                pos = 0;
            _this.airplane = _this.airplane.world.airplanes[pos];
            if (_this.airplane.world.airplanes[pos].route.length === 0) {
                _this.route = undefined;
                this.nextRoute();
                return;
            }
            _this.route = _this.airplane.world.airplanes[pos].route[0];
            _this.update(true);
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
                            <th>Warehouse<br/>amount<br/><button id="route-unload-warehous-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button></th>
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
                        <tr>
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
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-market-until-amount" id="load-market-until-amount_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-market-max-price" id="load-market-max-price_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-warehouse-amount" id="load-warehouse-amount_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-warehouse-until-amount" id="load-warehouse-until-amount_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
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
                width: "583px",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3JvdXRlZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFNQSxNQUFhLFdBQVc7UUFPcEI7WUFITyxzQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFLN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNsQyxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDN0MsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2hDLENBQUM7UUFHRCxXQUFXO1lBQ1AsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxxQkFBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFFekMsUUFBUSxDQUFDLGNBQWMsQ0FBQywyQkFBMkIsR0FBRyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDdEYsSUFBSSxJQUFJLEdBQXNCLENBQUMsQ0FBQyxNQUFPLENBQUM7b0JBQ3hDLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlGLENBQUMsQ0FBQyxDQUFDO2dCQUNILFFBQVEsQ0FB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QUFLLEVBQUU7Z0JBQ1AsQ0FBQzthQUNKLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBQyxhQUFhLEVBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRCxDQUFDO1FBQ0QsS0FBSztZQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FDSjtJQWhiRCxrQ0FnYkMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGFsbFByb2R1Y3RzLCBQcm9kdWN0IH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xuaW1wb3J0IHsgUm91dGUgfSBmcm9tIFwiZ2FtZS9yb3V0ZVwiO1xuXG5leHBvcnQgY2xhc3MgUm91dGVEaWFsb2cge1xuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XG4gICAgYWlycGxhbmU6IEFpcnBsYW5lO1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U7XG4gICAgcHVibGljIGRyb3BDaXRpZXNFbmFibGVkID0gZmFsc2U7XG4gICAgcm91dGU6IFJvdXRlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcblxuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogUm91dGVEaWFsb2cge1xuICAgICAgICBpZiAoUm91dGVEaWFsb2cuaW5zdGFuY2UgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIFJvdXRlRGlhbG9nLmluc3RhbmNlID0gbmV3IFJvdXRlRGlhbG9nKCk7XG4gICAgICAgIHJldHVybiBSb3V0ZURpYWxvZy5pbnN0YW5jZTtcbiAgICB9XG5cbiAgXG4gICAgYmluZEFjdGlvbnMoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LXVudGlsLWFtb3VudF9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1pbi1wcmljZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLnVubG9hZE1hcmtldFByaWNlW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudF9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZE1hcmtldEFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LXByaWNlX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZE1hcmtldFByaWNlW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlQW1vdW50W2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS11bnRpbC1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnRbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtc2VsZWN0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHZhciB2YWwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1zZWxlY3RcIikpLnZhbHVlO1xuICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQodmFsKTtcbiAgICAgICAgICAgIF90aGlzLnJvdXRlID0gX3RoaXMuYWlycGxhbmUucm91dGVbaWRdO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLXVubG9hZC1tYXJrZXQtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAxOyB4IDwgX3RoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbeF0gPSB0aGlzLnJvdXRlLnVubG9hZE1hcmtldEFtb3VudFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS11bmxvYWQtd2FyZWhvdXMtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAxOyB4IDwgX3RoaXMucm91dGUudW5sb2FkV2FyZWhvdXNlQW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS51bmxvYWRXYXJlaG91c2VBbW91bnRbeF0gPSB0aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLW1hcmtldC1maWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPCBfdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50W3hdID0gdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50WzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxvYWQtbWFya2V0LXVudGlsLWZpbGxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IF90aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGUubG9hZE1hcmtldFVudGlsQW1vdW50W3hdID0gdGhpcy5yb3V0ZS5sb2FkTWFya2V0VW50aWxBbW91bnRbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbG9hZC13YXJlaG91c2UtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAxOyB4IDwgX3RoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFt4XSA9IHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLXdhcmVob3VzZS11bnRpbC1maWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPCBfdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XSA9IHRoaXMucm91dGUubG9hZFdhcmVob3VzZVVudGlsQW1vdW50WzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxvYWQtZmlsbC1jb25zdW10aW9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgX3RoaXMubG9hZEZpbGxDb25zdW10aW9uKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLWZpbGwtY29uc3VtdGlvbi11bnRpbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIF90aGlzLmxvYWRGaWxsQ29uc3VtdGlvbihmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWNvcHktcHJldlwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIF90aGlzLmNvcHlSb3V0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZWRpYWxvZy1haXJwbGFuZS1wcmV2XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgX3RoaXMucHJldlJvdXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nLWFpcnBsYW5lLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBfdGhpcy5uZXh0Um91dGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHByZXZSb3V0ZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcbiAgICAgICAgcG9zLS07XG4gICAgICAgIGlmIChwb3MgPT09IDApXG4gICAgICAgICAgICBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgX3RoaXMuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXTtcbiAgICAgICAgX3RoaXMucm91dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXS5yb3V0ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIF90aGlzLnJvdXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5wcmV2Um91dGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdLnJvdXRlWzBdO1xuICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgfVxuICAgIG5leHRSb3V0ZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcbiAgICAgICAgcG9zKys7XG4gICAgICAgIGlmIChwb3MgPj0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmxlbmd0aClcbiAgICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgIF90aGlzLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc107XG4gICAgICAgIGlmIChfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXS5yb3V0ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIF90aGlzLnJvdXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5uZXh0Um91dGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdLnJvdXRlWzBdO1xuICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgfVxuXG4gICAgY29weVJvdXRlKCkge1xuICAgICAgICB2YXIgcG9zID0gdGhpcy5yb3V0ZS5haXJwbGFuZS5yb3V0ZS5pbmRleE9mKHRoaXMucm91dGUpO1xuICAgICAgICBpZiAocG9zID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBwb3MtLTtcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMucm91dGUuYWlycGxhbmUucm91dGVbcG9zXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50W3hdID0gc291cmNlLmxvYWRNYXJrZXRBbW91bnRbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRNYXJrZXRQcmljZVt4XSA9IHNvdXJjZS5sb2FkTWFya2V0UHJpY2VbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudFt4XSA9IHNvdXJjZS5sb2FkTWFya2V0VW50aWxBbW91bnRbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VBbW91bnRbeF0gPSBzb3VyY2UubG9hZFdhcmVob3VzZUFtb3VudFt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUubG9hZFdhcmVob3VzZVVudGlsQW1vdW50W3hdID0gc291cmNlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50W3hdID0gc291cmNlLnVubG9hZE1hcmtldEFtb3VudFt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUudW5sb2FkTWFya2V0UHJpY2VbeF0gPSBzb3VyY2UudW5sb2FkTWFya2V0UHJpY2VbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFt4XSA9IHNvdXJjZS51bmxvYWRXYXJlaG91c2VBbW91bnRbeF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9XG4gICAgbG9hZEZpbGxDb25zdW10aW9uKGFsbENpdGllczogYm9vbGVhbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgYWxsID0gX3RoaXMucm91dGUuYWlycGxhbmUucm91dGU7XG4gICAgICAgIHZhciBsZW5waXhlbCA9IDA7XG4gICAgICAgIHZhciBsYXN0cG9zID0gdW5kZWZpbmVkO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIGNpdHkgPSBfdGhpcy5yb3V0ZS5haXJwbGFuZS53b3JsZC5jaXRpZXNbYWxsW3hdLmNpdHlpZF07XG4gICAgICAgICAgICBpZiAobGFzdHBvcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbGFzdHBvcyA9IFtjaXR5LngsIGNpdHkueV07XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RjaXR5ID0gX3RoaXMucm91dGUuYWlycGxhbmUud29ybGQuY2l0aWVzW2FsbFthbGwubGVuZ3RoIC0gMV0uY2l0eWlkXTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdCA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KE1hdGgucG93KGxhc3Rwb3NbMF0gLSBsYXN0Y2l0eS54LCAyKSArIE1hdGgucG93KGxhc3Rwb3NbMV0gLSBsYXN0Y2l0eS55LCAyKSkpOy8vUHl0aGFyb3Jhc1xuICAgICAgICAgICAgICAgIGxlbnBpeGVsICs9IGRpc3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0ID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoTWF0aC5wb3cobGFzdHBvc1swXSAtIGNpdHkueCwgMikgKyBNYXRoLnBvdyhsYXN0cG9zWzFdIC0gY2l0eS55LCAyKSkpOy8vUHl0aGFyb3Jhc1xuICAgICAgICAgICAgICAgIGxlbnBpeGVsICs9IGRpc3Q7XG4gICAgICAgICAgICAgICAgbGFzdHBvcyA9IFtjaXR5LngsIGNpdHkueV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRheXMgPSBsZW5waXhlbCAvIF90aGlzLnJvdXRlLmFpcnBsYW5lLnNwZWVkOyAvL3Q9cy92OyBpbiBUYWdlXG4gICAgICAgIHZhciB0b3RhbERheXMgPSAoTWF0aC5yb3VuZChkYXlzICogMjQpICsgMSArIGFsbC5sZW5ndGggKiAzICsgYWxsLmxlbmd0aCAqIDMpOyAgIC8vKzNoIGxvYWQgYW5kIHVubG9hZFxuICAgICAgICBjb25zb2xlLmxvZyh0b3RhbERheXMpO1xuICAgICAgICB2YXIgc3RvcmUgPSBhbGxDaXRpZXMgPyB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VBbW91bnQgOiB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudDtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgc3RvcmVbeF0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgY2l0eSA9IF90aGlzLnJvdXRlLmFpcnBsYW5lLndvcmxkLmNpdGllc1thbGxbeF0uY2l0eWlkXTtcbiAgICAgICAgICAgIHZhciBjYXVzZTtcbiAgICAgICAgICAgIGlmIChhbGxDaXRpZXMpIHtcbiAgICAgICAgICAgICAgICBjYXVzZSA9IChhbGxbeF0uY2l0eWlkICE9PSB0aGlzLnJvdXRlLmNpdHlpZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhdXNlID0gYWxsW3hdLmNpdHlpZCA9PT0gdGhpcy5yb3V0ZS5jaXR5aWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjYXVzZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY2l0eS5jb21wYW5pZXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb2QgPSBhbGxQcm9kdWN0c1tjaXR5LmNvbXBhbmllc1tjXS5wcm9kdWN0aWRdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZC5pbnB1dDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZVtwcm9kLmlucHV0MV0gKz0gTWF0aC5yb3VuZCgoMS4xKmNpdHkuY29tcGFuaWVzW2NdLmJ1aWxkaW5ncyogcHJvZC5pbnB1dDFBbW91bnQgKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9kLmlucHV0MilcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlW3Byb2QuaW5wdXQyXSArPSBNYXRoLnJvdW5kKCgxLjEqY2l0eS5jb21wYW5pZXNbY10uYnVpbGRpbmdzICogcHJvZC5pbnB1dDJBbW91bnQgKSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVt5XSArPSBNYXRoLnJvdW5kKDEuMSp0b3RhbERheXMgKiBhbGxQcm9kdWN0c1t5XS5kYWlseUNvbnN1bXRpb24gKiBjaXR5LnBlb3BsZSAvIDI0KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJyb3V0ZWRpYWxvZ1wiIGNsYXNzPVwicm91dGVkaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nXCIpO1xuICAgICAgICBpZiAob2xkKSB7XG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhaXJwbGFuZSA9IHRoaXMuYWlycGxhbmU7XG4gICAgICAgIHZhciBwcm9kdWN0cyA9IGFsbFByb2R1Y3RzO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc2RvbSA9IGBcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJyb3V0ZWRpYWxvZy1haXJwbGFuZS1wcmV2XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPFwiLz5cbiAgICAgICAgICAgIDxzcGFuIGlkPVwicm91dGVkaWFsb2ctYWlycGxhbmUtbmFtZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInJvdXRlZGlhbG9nLWFpcnBsYW5lLW5leHRcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI+XCIvPlxuICAgICAgICAgICAgPHNlbGVjdCBpZD1cInJvdXRlLXNlbGVjdFwiID5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwicm91dGUtY29weS1wcmV2XCIgdGl0bGU9XCJjb3B5IHByZXYgcm91dGVcIj5gKyBJY29ucy5jb3B5ICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInJvdXRlZGlhbG9nLXRhYnNcIj5cbiAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3JvdXRlZGlhbG9nLXVubG9hZFwiIGNsYXNzPVwicm91dGVkaWFsb2ctdGFic1wiPlVubG9hZDwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNyb3V0ZWRpYWxvZy1sb2FkXCIgY2xhc3M9XCJyb3V0ZWRpYWxvZy10YWJzXCI+TG9hZDwvYT48L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInJvdXRlZGlhbG9nLXVubG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBpZD1cInJvdXRlZGlhbG9nLXVubG9hZC10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5NYXJrZXQ8YnIvPm1heCBhbW91bnQ8YnIvPjxidXR0b24gaWQ9XCJyb3V0ZS11bmxvYWQtbWFya2V0LWZpbGxcIiB0aXRsZT1cImZpbGwgZmlyc3Qgcm93IGRvd25cIj5gKyBJY29ucy5maWxsRG93biArIGA8L2J1dHRvbj4gPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWFya2V0PGJyLz5taW4gcHJpY2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5XYXJlaG91c2U8YnIvPmFtb3VudDxici8+PGJ1dHRvbiBpZD1cInJvdXRlLXVubG9hZC13YXJlaG91cy1maWxsXCIgdGl0bGU9XCJmaWxsIGZpcnN0IHJvdyBkb3duXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmljZShpZDogc3RyaW5nLCBjaGFuZ2U6IG51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCArIFwiIFwiICsgY2hhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwidW5sb2FkLW1hcmtldC1tYXgtYW1vdW50XCIgaWQ9XCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cInVubG9hZC1tYXJrZXQtbWluLXByaWNlXCIgaWQ9XCJ1bmxvYWQtbWFya2V0LW1pbi1wcmljZV8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwidW5sb2FkLXdhcmVob3VzZS1hbW91bnRcIiBpZD1cInVubG9hZC13YXJlaG91c2UtYW1vdW50XycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPiAgICBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwicm91dGVkaWFsb2ctbG9hZFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBpZD1cInJvdXRlZGlhbG9nLWxvYWQtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWFya2V0PGJyLz5hbW91bnQ8YnIvPjxidXR0b24gaWQ9XCJyb3V0ZS1sb2FkLW1hcmtldC1maWxsXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWFya2V0PGJyLz51bnRpbCBhbW91bnQ8YnIvPjxidXR0b24gaWQ9XCJyb3V0ZS1sb2FkLW1hcmtldC11bnRpbC1maWxsXCIgdGl0bGU9XCJmaWxsIGZpcnN0IHJvdyBkb3duXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWFya2V0PGJyLz5tYXggcHJpY2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5XYXJlaG91c2U8YnIvPmFtb3VudDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS1sb2FkLXdhcmVob3VzZS1maWxsXCIgdGl0bGU9XCJmaWxsIGZpcnN0IHJvdyBkb3duXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS1sb2FkLWZpbGwtY29uc3VtdGlvblwiIHRpdGxlPVwiZmlsbCBjb25zdW10aW9uXCI+YCsgSWNvbnMuZm9vZCArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5XYXJlaG91c2U8YnIvPnVudGlsIGFtb3VudDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS1sb2FkLXdhcmVob3VzZS11bnRpbC1maWxsXCIgdGl0bGU9XCJmaWxsIGZpcnN0IHJvdyBkb3duXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS1sb2FkLWZpbGwtY29uc3VtdGlvbi11bnRpbFwiIHRpdGxlPVwiZmlsbCBjb25zdW10aW9uXCI+YCsgSWNvbnMuZm9vZCArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByaWNlKGlkOiBzdHJpbmcsIGNoYW5nZTogbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkICsgXCIgXCIgKyBjaGFuZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5uYW1lICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJsb2FkLW1hcmtldC1tYXgtYW1vdW50XCIgaWQ9XCJsb2FkLW1hcmtldC1tYXgtYW1vdW50XycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJsb2FkLW1hcmtldC11bnRpbC1hbW91bnRcIiBpZD1cImxvYWQtbWFya2V0LXVudGlsLWFtb3VudF8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwibG9hZC1tYXJrZXQtbWF4LXByaWNlXCIgaWQ9XCJsb2FkLW1hcmtldC1tYXgtcHJpY2VfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cImxvYWQtd2FyZWhvdXNlLWFtb3VudFwiIGlkPVwibG9hZC13YXJlaG91c2UtYW1vdW50XycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJsb2FkLXdhcmVob3VzZS11bnRpbC1hbW91bnRcIiBpZD1cImxvYWQtd2FyZWhvdXNlLXVudGlsLWFtb3VudF8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT4gICAgXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgdmFyIG5ld2RvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQobmV3ZG9tKTtcbiAgICAgICAgJChcIiNyb3V0ZWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkKFwiI3JvdXRlZGlhbG9nLXRhYnNcIikudGFicyh7XG4gICAgICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyAgJCggXCIjcm91dGUtbGlzdFwiICkuc29ydGFibGUoKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XG5cbiAgICAgICAgLy8gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgX3RoaXMuYmluZEFjdGlvbnMoKTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCEkKHRoaXMuZG9tKS5kaWFsb2coJ2lzT3BlbicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nLWFpcnBsYW5lLW5hbWVcIikuaW5uZXJIVE1MID0gdGhpcy5haXJwbGFuZS5uYW1lO1xuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1zZWxlY3RcIik7XG4gICAgICAgIHNlbGVjdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgIHZhciBjaXR5ID0gdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbdGhpcy5haXJwbGFuZS5yb3V0ZVt4XS5jaXR5aWRdO1xuICAgICAgICAgICAgb3B0LnZhbHVlID0gXCJcIiArIHg7XG4gICAgICAgICAgICBvcHQudGV4dCA9IGNpdHkubmFtZTtcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJvdXRlKVxuICAgICAgICAgICAgc2VsZWN0LnZhbHVlID0gXCJcIiArIHRoaXMuYWlycGxhbmUucm91dGUuaW5kZXhPZih0aGlzLnJvdXRlKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWluLXByaWNlXCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtdW50aWwtYW1vdW50XCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtcHJpY2VcIikpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtd2FyZWhvdXNlLWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC13YXJlaG91c2UtdW50aWwtYW1vdW50XCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWluLXByaWNlX1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLW1hcmtldC1taW4tcHJpY2VfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRQcmljZVt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLnVubG9hZE1hcmtldFByaWNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudF9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC13YXJlaG91c2UtYW1vdW50X1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUudW5sb2FkV2FyZWhvdXNlQW1vdW50W3hdID09PSB1bmRlZmluZWQpID8gXCJcIiA6IHRoaXMucm91dGUudW5sb2FkV2FyZWhvdXNlQW1vdW50W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LWFtb3VudF9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLmxvYWRNYXJrZXRBbW91bnRbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC11bnRpbC1hbW91bnRfXCIgKyB4KSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC11bnRpbC1hbW91bnRfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS5sb2FkTWFya2V0VW50aWxBbW91bnRbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS5sb2FkTWFya2V0VW50aWxBbW91bnRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1wcmljZV9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1wcmljZV9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLmxvYWRNYXJrZXRQcmljZVt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRNYXJrZXRQcmljZVt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC13YXJlaG91c2UtYW1vdW50X1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC13YXJlaG91c2UtYW1vdW50X1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VBbW91bnRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtd2FyZWhvdXNlLXVudGlsLWFtb3VudF9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtd2FyZWhvdXNlLXVudGlsLWFtb3VudF9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XS50b1N0cmluZygpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAvL3VpLXRhYnMtYWN0aXZlXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XG4gICAgICAgICAgICB3aWR0aDogXCI1ODNweFwiLFxuICAgICAgICAgICAgZHJhZ2dhYmxlOnRydWUsXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmRpYWxvZyhcIndpZGdldFwiKS5kcmFnZ2FibGUoXCJvcHRpb25cIixcImNvbnRhaW5tZW50XCIsXCJub25lXCIpO1xuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xuXG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICB9XG59XG4iXX0=