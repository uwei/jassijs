define(["require", "exports", "game/icons"], function (require, exports, icons_1) {
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
            var products = parameter.allProducts;
            var _this = this;
            var sdom = `
          <div>
          <div>
            <input id="routedialog-airplane-prev" type="button" value="<"/>
            <div id="routedialog-airplane-name" style="display:inline;width:50px"></div>
            <input id="routedialog-airplane-next" type="button" value=">"/>
            <select id="route-select" >
            </select>
            <input id="routedialog-route-next" type="button" value=">"/>
            <button id="route-copy-prev" title="copy prev route">` + icons_1.Icons.copy + `</button>
            <button id="update-all-routes" title="update all routes">` + icons_1.Icons.food + `</button>
                      
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
                            <th>Market<br/>min<br/>price</th>
                            <th>shop<br/>amount<br/>
                                <button id="route-unload-warehous-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button>
                                <button id="route-unload-warehous-fill9" title="fill 99999999 down">` + icons_1.Icons.nine + `</button>
                            </th>

                        </tr>
                       ${(function fun() {
                var ret = "";
                function price(id, change) {
                    console.log(id + " " + change);
                }
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + parameter.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + parameter.allProducts[x].name + "</td>";
                    // ret = ret + "<td>" + parameter.allProducts[x].name + "</td>";
                    ret = ret + '<td>' + '<input type="number" min="0" class="unload-market-max-amount" id="unload-market-max-amount_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="unload-market-min-price" id="unload-market-min-price_' + x + '"' +
                        'style="width: 43px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="unload-shop-amount" id="unload-shop-amount_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table> 
                </div>
                <div id="routedialog-load">
                max amount each product: <input type="number" min="0" id="route-max-load" >
                
                      <table id="routedialog-load-table" style="height:100%;weight:100%;">
                        <tr >
                            <th>Name</th>
                            <th></th>
                              <th>Market<br/>amount<br/><button id="route-load-market-fill">` + icons_1.Icons.fillDown + `</button></th>
                            <th>Market<br/>max price</th>
                            <th>shop<br/>amount<br/>
                                <button id="route-load-shop-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button>
                                <button id="route-load-fill-consumtion" title="fill consumtion">` + icons_1.Icons.food + `</button>
                            </th>
                            <th>shop<br/>everything except<br/>
                                <button id="route-load-shop-until-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button>
                                <button id="route-load-fill-consumtion-until" title="fill consumtion">` + icons_1.Icons.food + `</button>
                            </th>


                        </tr>
                       ${(function fun() {
                var ret = "";
                function price(id, change) {
                    console.log(id + " " + change);
                }
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + parameter.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + parameter.allProducts[x].name + "</td>";
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-market-max-amount" id="load-market-max-amount_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-market-max-price" id="load-market-max-price_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-shop-amount" id="load-shop-amount_' + x + '"' +
                        'style="width: 50px;"' + '"></td>';
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-shop-until-amount" id="load-shop-until-amount_' + x + '"' +
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
        bindActions() {
            var _this = this;
            for (var x = 0; x < parameter.allProducts.length; x++) {
                document.getElementById("unload-market-max-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.unloadMarketAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("unload-market-min-price_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.unloadMarketPrice[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("unload-shop-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.unloadShopAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
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
                document.getElementById("load-shop-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.loadShopAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
                document.getElementById("load-shop-until-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.loadShopUntilAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
                });
            }
            document.getElementById("route-max-load").addEventListener("change", (e) => {
                var val = document.getElementById("route-max-load").value;
                var ival = parseInt(val);
                _this.route.maxLoad = ival;
                _this.update();
            });
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
                for (var x = 1; x < _this.route.unloadShopAmount.length; x++) {
                    this.route.unloadShopAmount[x] = this.route.unloadShopAmount[0];
                }
                _this.update();
            });
            document.getElementById("route-unload-warehous-fill9").addEventListener("click", (e) => {
                for (var x = 0; x < _this.route.unloadShopAmount.length; x++) {
                    this.route.unloadShopAmount[x] = 9999999999;
                }
                _this.update();
            });
            document.getElementById("route-load-market-fill").addEventListener("click", (e) => {
                for (var x = 1; x < _this.route.loadMarketAmount.length; x++) {
                    this.route.loadMarketAmount[x] = this.route.loadMarketAmount[0];
                }
                _this.update();
            });
            document.getElementById("route-load-shop-fill").addEventListener("click", (e) => {
                for (var x = 1; x < _this.route.loadShopAmount.length; x++) {
                    this.route.loadShopAmount[x] = this.route.loadShopAmount[0];
                }
                _this.update();
            });
            document.getElementById("route-load-shop-until-fill").addEventListener("click", (e) => {
                for (var x = 1; x < _this.route.loadShopUntilAmount.length; x++) {
                    this.route.loadShopUntilAmount[x] = this.route.loadShopUntilAmount[0];
                }
                _this.update();
            });
            document.getElementById("route-load-fill-consumtion").addEventListener("click", (e) => {
                RouteDialog.loadFillConsumtion(_this.route, true);
                _this.update();
            });
            document.getElementById("route-load-fill-consumtion-until").addEventListener("click", (e) => {
                RouteDialog.loadFillConsumtion(this.route, false);
                _this.update();
            });
            document.getElementById("update-all-routes").addEventListener("click", (e) => {
                _this.loadFillAllConsumtion();
                _this.update();
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
            this.route.maxLoad = source.maxLoad;
            for (var x = 0; x < parameter.allProducts.length; x++) {
                this.route.loadMarketAmount[x] = source.loadMarketAmount[x];
                this.route.loadMarketPrice[x] = source.loadMarketPrice[x];
                this.route.loadShopAmount[x] = source.loadShopAmount[x];
                this.route.loadShopUntilAmount[x] = source.loadShopUntilAmount[x];
                this.route.unloadMarketAmount[x] = source.unloadMarketAmount[x];
                this.route.unloadMarketPrice[x] = source.unloadMarketPrice[x];
                this.route.unloadShopAmount[x] = source.unloadShopAmount[x];
            }
            this.update();
        }
        loadFillAllConsumtion() {
            for (var x = 0; x < this.route.airplane.route.length; x++) {
                if (this.route.airplane.route[x].loadShopAmount[0] !== undefined) {
                    RouteDialog.loadFillConsumtion(this.route.airplane.route[x], true);
                }
                if (this.route.airplane.route[x].loadShopUntilAmount[0] !== undefined) {
                    RouteDialog.loadFillConsumtion(this.route.airplane.route[x], false);
                }
            }
        }
        static loadFillConsumtion(route, allCities) {
            var _this = this;
            var all = route.airplane.route;
            var lenpixel = 0;
            var lastpos = undefined;
            for (var x = 0; x < all.length; x++) {
                var city = route.airplane.world.cities[all[x].cityid];
                if (lastpos === undefined) {
                    lastpos = [city.x, city.y];
                    var lastcity = route.airplane.world.cities[all[all.length - 1].cityid];
                    var dist = Math.round(Math.sqrt(Math.pow(lastpos[0] - lastcity.x, 2) + Math.pow(lastpos[1] - lastcity.y, 2))); //Pytharoras
                    lenpixel += dist;
                }
                else {
                    var dist = Math.round(Math.sqrt(Math.pow(lastpos[0] - city.x, 2) + Math.pow(lastpos[1] - city.y, 2))); //Pytharoras
                    lenpixel += dist;
                    lastpos = [city.x, city.y];
                }
            }
            var days = lenpixel / route.airplane.speed; //t=s/v; in Tage
            var totalDays = (Math.round(days * 24) + 1 + all.length * 3 + all.length * 3) / 24; //+3h load and unload
            console.log(totalDays);
            var store = allCities ? route.loadShopAmount : route.loadShopUntilAmount;
            for (var x = 0; x < parameter.allProducts.length; x++) {
                store[x] = 0;
            }
            for (var x = 0; x < all.length; x++) {
                var city = route.airplane.world.cities[all[x].cityid];
                var cause;
                if (allCities) {
                    cause = (all[x].cityid !== route.cityid);
                }
                else {
                    cause = all[x].cityid === route.cityid;
                }
                if (cause) {
                    var allPeople = 0;
                    for (var c = 0; c < city.companies.length; c++) {
                        var buildings = city.companies[c].buildings;
                        buildings += city.getBuildingInProgress(city.companies[c].productid);
                        allPeople += buildings * parameter.workerInCompany;
                        var prod = parameter.allProducts[city.companies[c].productid];
                        if (prod.input1)
                            store[prod.input1] += Math.round((1.1 * city.companies[c].buildings * prod.input1Amount * totalDays));
                        if (prod.input2)
                            store[prod.input2] += Math.round((1.1 * city.companies[c].buildings * prod.input2Amount * totalDays));
                    }
                    for (var y = 0; y < parameter.allProducts.length; y++) {
                        store[y] += Math.round(1.1 * totalDays * parameter.allProducts[y].dailyConsumtion * (allPeople + parameter.neutralStartPeople));
                    }
                }
            }
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
                document.getElementById("unload-shop-amount").value = "";
                document.getElementById("load-market-max-amount").value = "";
                document.getElementById("load-market-max-price").value = "";
                document.getElementById("load-shop-amount").value = "";
                document.getElementById("load-shop-until-amount").value = "";
                return;
            }
            if (document.activeElement !== document.getElementById("load-market-until-amount_" + x))
                document.getElementById("route-max-load").value = (this.route.maxLoad === undefined) ? "" : this.route.maxLoad.toString();
            for (var x = 0; x < parameter.allProducts.length; x++) {
                if (document.activeElement !== document.getElementById("unload-market-max-amount_" + x))
                    document.getElementById("unload-market-max-amount_" + x).value = (this.route.unloadMarketAmount[x] === undefined) ? "" : this.route.unloadMarketAmount[x].toString();
                if (document.activeElement !== document.getElementById("unload-market-min-price_" + x))
                    document.getElementById("unload-market-min-price_" + x).value = (this.route.unloadMarketPrice[x] === undefined) ? "" : this.route.unloadMarketPrice[x].toString();
                if (document.activeElement !== document.getElementById("unload-shop-amount_" + x))
                    document.getElementById("unload-shop-amount_" + x).value = (this.route.unloadShopAmount[x] === undefined) ? "" : this.route.unloadShopAmount[x].toString();
                if (document.activeElement !== document.getElementById("load-market-max-amount_" + x))
                    document.getElementById("load-market-max-amount_" + x).value = (this.route.loadMarketAmount[x] === undefined) ? "" : this.route.loadMarketAmount[x].toString();
                if (document.activeElement !== document.getElementById("load-market-max-price_" + x))
                    document.getElementById("load-market-max-price_" + x).value = (this.route.loadMarketPrice[x] === undefined) ? "" : this.route.loadMarketPrice[x].toString();
                if (document.activeElement !== document.getElementById("load-shop-amount_" + x))
                    document.getElementById("load-shop-amount_" + x).value = (this.route.loadShopAmount[x] === undefined) ? "" : this.route.loadShopAmount[x].toString();
                if (document.activeElement !== document.getElementById("load-shop-until-amount_" + x))
                    document.getElementById("load-shop-until-amount_" + x).value = (this.route.loadShopUntilAmount[x] === undefined) ? "" : this.route.loadShopUntilAmount[x].toString();
            }
        }
        show() {
            var _this = this;
            this.dom.removeAttribute("hidden");
            this.update();
            //ui-tabs-active
            $(this.dom).dialog({
                width: "400px",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3JvdXRlZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFNQSxNQUFhLFdBQVc7UUFPcEI7WUFITyxzQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFLN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNsQyxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDN0MsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2hDLENBQUM7UUFDTyxNQUFNO1lBQ1YsNkJBQTZCO1lBQzdCLElBQUksSUFBSSxHQUFHOzs7O1NBSVYsQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2pELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM3QixJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBQ3JDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRzs7Ozs7Ozs7O2tFQVMrQyxHQUFFLGFBQUssQ0FBQyxJQUFJLEdBQUc7c0VBQ1gsR0FBRSxhQUFLLENBQUMsSUFBSSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs2SEFjd0MsR0FBRSxhQUFLLENBQUMsUUFBUSxHQUFHOzs7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LENBQUMsUUFBUSxFQUFFLENBQUM7YUFDaE07UUFFTCxDQUFDO1FBQ0QsSUFBSTtZQUNBLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxnQkFBZ0I7WUFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2YsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsK0RBQStEO2dCQUMvRCxJQUFJLEVBQUUsVUFBVSxLQUFLLEVBQUUsRUFBRTtvQkFDckIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsQ0FBQztnQkFDRCxLQUFLLEVBQUU7Z0JBQ1AsQ0FBQzthQUNKLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRCxDQUFDO1FBQ0QsS0FBSztZQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FDSjtJQTdkRCxrQ0E2ZEMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XG5pbXBvcnQgeyBBaXJwbGFuZSB9IGZyb20gXCJnYW1lL2FpcnBsYW5lXCI7XG5pbXBvcnQgeyBJY29ucyB9IGZyb20gXCJnYW1lL2ljb25zXCI7XG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZURpYWxvZyB7XG4gICAgZG9tOiBIVE1MRGl2RWxlbWVudDtcbiAgICBhaXJwbGFuZTogQWlycGxhbmU7XG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcbiAgICBwdWJsaWMgZHJvcENpdGllc0VuYWJsZWQgPSBmYWxzZTtcbiAgICByb3V0ZTogUm91dGU7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xuXG4gICAgfVxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBSb3V0ZURpYWxvZyB7XG4gICAgICAgIGlmIChSb3V0ZURpYWxvZy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgUm91dGVEaWFsb2cuaW5zdGFuY2UgPSBuZXcgUm91dGVEaWFsb2coKTtcbiAgICAgICAgcmV0dXJuIFJvdXRlRGlhbG9nLmluc3RhbmNlO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJyb3V0ZWRpYWxvZ1wiIGNsYXNzPVwicm91dGVkaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nXCIpO1xuICAgICAgICBpZiAob2xkKSB7XG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhaXJwbGFuZSA9IHRoaXMuYWlycGxhbmU7XG4gICAgICAgIHZhciBwcm9kdWN0cyA9IHBhcmFtZXRlci5hbGxQcm9kdWN0cztcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGlucHV0IGlkPVwicm91dGVkaWFsb2ctYWlycGxhbmUtcHJldlwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjxcIi8+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicm91dGVkaWFsb2ctYWlycGxhbmUtbmFtZVwiIHN0eWxlPVwiZGlzcGxheTppbmxpbmU7d2lkdGg6NTBweFwiPjwvZGl2PlxuICAgICAgICAgICAgPGlucHV0IGlkPVwicm91dGVkaWFsb2ctYWlycGxhbmUtbmV4dFwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIj5cIi8+XG4gICAgICAgICAgICA8c2VsZWN0IGlkPVwicm91dGUtc2VsZWN0XCIgPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJyb3V0ZWRpYWxvZy1yb3V0ZS1uZXh0XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPlwiLz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS1jb3B5LXByZXZcIiB0aXRsZT1cImNvcHkgcHJldiByb3V0ZVwiPmArIEljb25zLmNvcHkgKyBgPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwidXBkYXRlLWFsbC1yb3V0ZXNcIiB0aXRsZT1cInVwZGF0ZSBhbGwgcm91dGVzXCI+YCsgSWNvbnMuZm9vZCArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJyb3V0ZWRpYWxvZy10YWJzXCI+XG4gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNyb3V0ZWRpYWxvZy11bmxvYWRcIiBjbGFzcz1cInJvdXRlZGlhbG9nLXRhYnNcIj5VbmxvYWQ8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjcm91dGVkaWFsb2ctbG9hZFwiIGNsYXNzPVwicm91dGVkaWFsb2ctdGFic1wiPkxvYWQ8L2E+PC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJyb3V0ZWRpYWxvZy11bmxvYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgaWQ9XCJyb3V0ZWRpYWxvZy11bmxvYWQtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWFya2V0PGJyLz5tYXggYW1vdW50PGJyLz48YnV0dG9uIGlkPVwicm91dGUtdW5sb2FkLW1hcmtldC1maWxsXCIgdGl0bGU9XCJmaWxsIGZpcnN0IHJvdyBkb3duXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+IDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1hcmtldDxici8+bWluPGJyLz5wcmljZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPnNob3A8YnIvPmFtb3VudDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS11bmxvYWQtd2FyZWhvdXMtZmlsbFwiIHRpdGxlPVwiZmlsbCBmaXJzdCByb3cgZG93blwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicm91dGUtdW5sb2FkLXdhcmVob3VzLWZpbGw5XCIgdGl0bGU9XCJmaWxsIDk5OTk5OTk5IGRvd25cIj5gKyBJY29ucy5uaW5lICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcmljZShpZDogc3RyaW5nLCBjaGFuZ2U6IG51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCArIFwiIFwiICsgY2hhbmdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBwYXJhbWV0ZXIuYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcblxuICAgICAgICAgICAgICAgICAgICAvLyByZXQgPSByZXQgKyBcIjx0ZD5cIiArIHBhcmFtZXRlci5hbGxQcm9kdWN0c1t4XS5uYW1lICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRcIiBpZD1cInVubG9hZC1tYXJrZXQtbWF4LWFtb3VudF8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwidW5sb2FkLW1hcmtldC1taW4tcHJpY2VcIiBpZD1cInVubG9hZC1tYXJrZXQtbWluLXByaWNlXycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNDNweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJ1bmxvYWQtc2hvcC1hbW91bnRcIiBpZD1cInVubG9hZC1zaG9wLWFtb3VudF8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT4gXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInJvdXRlZGlhbG9nLWxvYWRcIj5cbiAgICAgICAgICAgICAgICBtYXggYW1vdW50IGVhY2ggcHJvZHVjdDogPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgaWQ9XCJyb3V0ZS1tYXgtbG9hZFwiID5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgaWQ9XCJyb3V0ZWRpYWxvZy1sb2FkLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1hcmtldDxici8+YW1vdW50PGJyLz48YnV0dG9uIGlkPVwicm91dGUtbG9hZC1tYXJrZXQtZmlsbFwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1hcmtldDxici8+bWF4IHByaWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+c2hvcDxici8+YW1vdW50PGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJvdXRlLWxvYWQtc2hvcC1maWxsXCIgdGl0bGU9XCJmaWxsIGZpcnN0IHJvdyBkb3duXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS1sb2FkLWZpbGwtY29uc3VtdGlvblwiIHRpdGxlPVwiZmlsbCBjb25zdW10aW9uXCI+YCsgSWNvbnMuZm9vZCArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5zaG9wPGJyLz5ldmVyeXRoaW5nIGV4Y2VwdDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS1sb2FkLXNob3AtdW50aWwtZmlsbFwiIHRpdGxlPVwiZmlsbCBmaXJzdCByb3cgZG93blwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwicm91dGUtbG9hZC1maWxsLWNvbnN1bXRpb24tdW50aWxcIiB0aXRsZT1cImZpbGwgY29uc3VtdGlvblwiPmArIEljb25zLmZvb2QgKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJpY2UoaWQ6IHN0cmluZywgY2hhbmdlOiBudW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaWQgKyBcIiBcIiArIGNoYW5nZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyYW1ldGVyLmFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIHBhcmFtZXRlci5hbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdLm5hbWUgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cImxvYWQtbWFya2V0LW1heC1hbW91bnRcIiBpZD1cImxvYWQtbWFya2V0LW1heC1hbW91bnRfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cImxvYWQtbWFya2V0LW1heC1wcmljZVwiIGlkPVwibG9hZC1tYXJrZXQtbWF4LXByaWNlXycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJsb2FkLXNob3AtYW1vdW50XCIgaWQ9XCJsb2FkLXNob3AtYW1vdW50XycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJsb2FkLXNob3AtdW50aWwtYW1vdW50XCIgaWQ9XCJsb2FkLXNob3AtdW50aWwtYW1vdW50XycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT4gICAgXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgdmFyIG5ld2RvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQobmV3ZG9tKTtcbiAgICAgICAgJChcIiNyb3V0ZWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkKFwiI3JvdXRlZGlhbG9nLXRhYnNcIikudGFicyh7XG4gICAgICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyAgJCggXCIjcm91dGUtbGlzdFwiICkuc29ydGFibGUoKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XG5cbiAgICAgICAgLy8gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgX3RoaXMuYmluZEFjdGlvbnMoKTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB9XG5cbiAgICBiaW5kQWN0aW9ucygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLW1hcmtldC1taW4tcHJpY2VfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRQcmljZVtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLXNob3AtYW1vdW50X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUudW5sb2FkU2hvcEFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZE1hcmtldEFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LXByaWNlX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZE1hcmtldFByaWNlW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXNob3AtYW1vdW50X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZFNob3BBbW91bnRbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtc2hvcC11bnRpbC1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS5sb2FkU2hvcFVudGlsQW1vdW50W2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLW1heC1sb2FkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHZhciB2YWwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1tYXgtbG9hZFwiKSkudmFsdWU7XG4gICAgICAgICAgICB2YXIgaXZhbCA9IHBhcnNlSW50KHZhbCk7XG4gICAgICAgICAgICBfdGhpcy5yb3V0ZS5tYXhMb2FkID0gaXZhbDtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLXNlbGVjdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICB2YXIgdmFsID0gKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtc2VsZWN0XCIpKS52YWx1ZTtcbiAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KHZhbCk7XG4gICAgICAgICAgICBfdGhpcy5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLnJvdXRlW2lkXTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS11bmxvYWQtbWFya2V0LWZpbGxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IF90aGlzLnJvdXRlLnVubG9hZE1hcmtldEFtb3VudC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50W3hdID0gdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtdW5sb2FkLXdhcmVob3VzLWZpbGxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IF90aGlzLnJvdXRlLnVubG9hZFNob3BBbW91bnQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlLnVubG9hZFNob3BBbW91bnRbeF0gPSB0aGlzLnJvdXRlLnVubG9hZFNob3BBbW91bnRbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtdW5sb2FkLXdhcmVob3VzLWZpbGw5XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBfdGhpcy5yb3V0ZS51bmxvYWRTaG9wQW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS51bmxvYWRTaG9wQW1vdW50W3hdID0gOTk5OTk5OTk5OTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLW1hcmtldC1maWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPCBfdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50W3hdID0gdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50WzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbG9hZC1zaG9wLWZpbGxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IF90aGlzLnJvdXRlLmxvYWRTaG9wQW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkU2hvcEFtb3VudFt4XSA9IHRoaXMucm91dGUubG9hZFNob3BBbW91bnRbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbG9hZC1zaG9wLXVudGlsLWZpbGxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IF90aGlzLnJvdXRlLmxvYWRTaG9wVW50aWxBbW91bnQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRTaG9wVW50aWxBbW91bnRbeF0gPSB0aGlzLnJvdXRlLmxvYWRTaG9wVW50aWxBbW91bnRbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbG9hZC1maWxsLWNvbnN1bXRpb25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBSb3V0ZURpYWxvZy5sb2FkRmlsbENvbnN1bXRpb24oX3RoaXMucm91dGUsdHJ1ZSk7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbG9hZC1maWxsLWNvbnN1bXRpb24tdW50aWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBSb3V0ZURpYWxvZy5sb2FkRmlsbENvbnN1bXRpb24odGhpcy5yb3V0ZSxmYWxzZSk7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXBkYXRlLWFsbC1yb3V0ZXNcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBfdGhpcy5sb2FkRmlsbEFsbENvbnN1bXRpb24oKTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1jb3B5LXByZXZcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBfdGhpcy5jb3B5Um91dGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGVkaWFsb2ctYWlycGxhbmUtcHJldlwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIF90aGlzLnByZXZBaXJwbGFuZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZWRpYWxvZy1haXJwbGFuZS1uZXh0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgX3RoaXMubmV4dEFpcnBsYW5lKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nLXJvdXRlLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBfdGhpcy5uZXh0Um91dGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHByZXZBaXJwbGFuZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcbiAgICAgICAgcG9zLS07XG4gICAgICAgIGlmIChwb3MgPT09IDApXG4gICAgICAgICAgICBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgX3RoaXMuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXTtcbiAgICAgICAgX3RoaXMucm91dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXS5yb3V0ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIF90aGlzLnJvdXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5wcmV2QWlycGxhbmUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdLnJvdXRlWzBdO1xuICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgfVxuICAgIG5leHRBaXJwbGFuZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcbiAgICAgICAgcG9zKys7XG4gICAgICAgIGlmIChwb3MgPj0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmxlbmd0aClcbiAgICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgIF90aGlzLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc107XG4gICAgICAgIGlmIChfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXS5yb3V0ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIF90aGlzLnJvdXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5uZXh0QWlycGxhbmUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdLnJvdXRlWzBdO1xuICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgfVxuICAgIG5leHRSb3V0ZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLnJvdXRlLmluZGV4T2YodGhpcy5yb3V0ZSk7XG4gICAgICAgIHBvcysrO1xuICAgICAgICBpZiAocG9zID09PSBfdGhpcy5haXJwbGFuZS5yb3V0ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMucm91dGUgPSBfdGhpcy5haXJwbGFuZS5yb3V0ZVtwb3NdO1xuICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBjb3B5Um91dGUoKSB7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLnJvdXRlLmFpcnBsYW5lLnJvdXRlLmluZGV4T2YodGhpcy5yb3V0ZSk7XG4gICAgICAgIGlmIChwb3MgPT09IDApXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBvcy0tO1xuICAgICAgICB2YXIgc291cmNlID0gdGhpcy5yb3V0ZS5haXJwbGFuZS5yb3V0ZVtwb3NdO1xuICAgICAgICB0aGlzLnJvdXRlLm1heExvYWQgPSBzb3VyY2UubWF4TG9hZDtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHRoaXMucm91dGUubG9hZE1hcmtldEFtb3VudFt4XSA9IHNvdXJjZS5sb2FkTWFya2V0QW1vdW50W3hdO1xuICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkTWFya2V0UHJpY2VbeF0gPSBzb3VyY2UubG9hZE1hcmtldFByaWNlW3hdO1xuICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkU2hvcEFtb3VudFt4XSA9IHNvdXJjZS5sb2FkU2hvcEFtb3VudFt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUubG9hZFNob3BVbnRpbEFtb3VudFt4XSA9IHNvdXJjZS5sb2FkU2hvcFVudGlsQW1vdW50W3hdO1xuICAgICAgICAgICAgdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbeF0gPSBzb3VyY2UudW5sb2FkTWFya2V0QW1vdW50W3hdO1xuICAgICAgICAgICAgdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRQcmljZVt4XSA9IHNvdXJjZS51bmxvYWRNYXJrZXRQcmljZVt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUudW5sb2FkU2hvcEFtb3VudFt4XSA9IHNvdXJjZS51bmxvYWRTaG9wQW1vdW50W3hdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfVxuICAgIGxvYWRGaWxsQWxsQ29uc3VtdGlvbigpe1xuICAgICAgICBmb3IodmFyIHg9MDt4PHRoaXMucm91dGUuYWlycGxhbmUucm91dGUubGVuZ3RoO3grKyl7XG4gICAgICAgICAgICBpZih0aGlzLnJvdXRlLmFpcnBsYW5lLnJvdXRlW3hdLmxvYWRTaG9wQW1vdW50WzBdIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5sb2FkRmlsbENvbnN1bXRpb24odGhpcy5yb3V0ZS5haXJwbGFuZS5yb3V0ZVt4XSx0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMucm91dGUuYWlycGxhbmUucm91dGVbeF0ubG9hZFNob3BVbnRpbEFtb3VudFswXSE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cubG9hZEZpbGxDb25zdW10aW9uKHRoaXMucm91dGUuYWlycGxhbmUucm91dGVbeF0sZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBsb2FkRmlsbENvbnN1bXRpb24ocm91dGU6Um91dGUsYWxsQ2l0aWVzOiBib29sZWFuKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBhbGwgPSByb3V0ZS5haXJwbGFuZS5yb3V0ZTtcbiAgICAgICAgdmFyIGxlbnBpeGVsID0gMDtcbiAgICAgICAgdmFyIGxhc3Rwb3MgPSB1bmRlZmluZWQ7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgY2l0eSA9IHJvdXRlLmFpcnBsYW5lLndvcmxkLmNpdGllc1thbGxbeF0uY2l0eWlkXTtcbiAgICAgICAgICAgIGlmIChsYXN0cG9zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsYXN0cG9zID0gW2NpdHkueCwgY2l0eS55XTtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdGNpdHkgPSByb3V0ZS5haXJwbGFuZS53b3JsZC5jaXRpZXNbYWxsW2FsbC5sZW5ndGggLSAxXS5jaXR5aWRdO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0ID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoTWF0aC5wb3cobGFzdHBvc1swXSAtIGxhc3RjaXR5LngsIDIpICsgTWF0aC5wb3cobGFzdHBvc1sxXSAtIGxhc3RjaXR5LnksIDIpKSk7Ly9QeXRoYXJvcmFzXG4gICAgICAgICAgICAgICAgbGVucGl4ZWwgKz0gZGlzdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3QgPSBNYXRoLnJvdW5kKE1hdGguc3FydChNYXRoLnBvdyhsYXN0cG9zWzBdIC0gY2l0eS54LCAyKSArIE1hdGgucG93KGxhc3Rwb3NbMV0gLSBjaXR5LnksIDIpKSk7Ly9QeXRoYXJvcmFzXG4gICAgICAgICAgICAgICAgbGVucGl4ZWwgKz0gZGlzdDtcbiAgICAgICAgICAgICAgICBsYXN0cG9zID0gW2NpdHkueCwgY2l0eS55XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF5cyA9IGxlbnBpeGVsIC8gcm91dGUuYWlycGxhbmUuc3BlZWQ7IC8vdD1zL3Y7IGluIFRhZ2VcbiAgICAgICAgdmFyIHRvdGFsRGF5cyA9IChNYXRoLnJvdW5kKGRheXMgKiAyNCkgKyAxICsgYWxsLmxlbmd0aCAqIDMgKyBhbGwubGVuZ3RoICogMykgLyAyNDsgICAvLyszaCBsb2FkIGFuZCB1bmxvYWRcbiAgICAgICAgY29uc29sZS5sb2codG90YWxEYXlzKTtcbiAgICAgICAgdmFyIHN0b3JlID0gYWxsQ2l0aWVzID8gcm91dGUubG9hZFNob3BBbW91bnQgOiByb3V0ZS5sb2FkU2hvcFVudGlsQW1vdW50O1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgc3RvcmVbeF0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgY2l0eSA9IHJvdXRlLmFpcnBsYW5lLndvcmxkLmNpdGllc1thbGxbeF0uY2l0eWlkXTtcbiAgICAgICAgICAgIHZhciBjYXVzZTtcbiAgICAgICAgICAgIGlmIChhbGxDaXRpZXMpIHtcbiAgICAgICAgICAgICAgICBjYXVzZSA9IChhbGxbeF0uY2l0eWlkICE9PSByb3V0ZS5jaXR5aWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYXVzZSA9IGFsbFt4XS5jaXR5aWQgPT09IHJvdXRlLmNpdHlpZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNhdXNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFsbFBlb3BsZT0wO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY2l0eS5jb21wYW5pZXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ1aWxkaW5ncz1jaXR5LmNvbXBhbmllc1tjXS5idWlsZGluZ3M7XG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkaW5ncys9Y2l0eS5nZXRCdWlsZGluZ0luUHJvZ3Jlc3MoY2l0eS5jb21wYW5pZXNbY10ucHJvZHVjdGlkKTtcbiAgICAgICAgICAgICAgICAgICAgYWxsUGVvcGxlKz1idWlsZGluZ3MqcGFyYW1ldGVyLndvcmtlckluQ29tcGFueTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb2QgPSBwYXJhbWV0ZXIuYWxsUHJvZHVjdHNbY2l0eS5jb21wYW5pZXNbY10ucHJvZHVjdGlkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2QuaW5wdXQxKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVbcHJvZC5pbnB1dDFdICs9IE1hdGgucm91bmQoKDEuMSAqIGNpdHkuY29tcGFuaWVzW2NdLmJ1aWxkaW5ncyAqIHByb2QuaW5wdXQxQW1vdW50ICogdG90YWxEYXlzKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9kLmlucHV0MilcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlW3Byb2QuaW5wdXQyXSArPSBNYXRoLnJvdW5kKCgxLjEgKiBjaXR5LmNvbXBhbmllc1tjXS5idWlsZGluZ3MgKiBwcm9kLmlucHV0MkFtb3VudCAqIHRvdGFsRGF5cykpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgcGFyYW1ldGVyLmFsbFByb2R1Y3RzLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlW3ldICs9IE1hdGgucm91bmQoMS4xICogdG90YWxEYXlzICogcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3ldLmRhaWx5Q29uc3VtdGlvbiAqIChhbGxQZW9wbGUrcGFyYW1ldGVyLm5ldXRyYWxTdGFydFBlb3BsZSkpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG5cbiAgICB1cGRhdGUoZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCEkKHRoaXMuZG9tKS5kaWFsb2coJ2lzT3BlbicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nLWFpcnBsYW5lLW5hbWVcIikuaW5uZXJIVE1MID0gdGhpcy5haXJwbGFuZS5uYW1lO1xuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1zZWxlY3RcIik7XG4gICAgICAgIHNlbGVjdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgIHZhciBjaXR5ID0gdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbdGhpcy5haXJwbGFuZS5yb3V0ZVt4XS5jaXR5aWRdO1xuICAgICAgICAgICAgb3B0LnZhbHVlID0gXCJcIiArIHg7XG4gICAgICAgICAgICBvcHQudGV4dCA9IGNpdHkubmFtZTtcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJvdXRlKVxuICAgICAgICAgICAgc2VsZWN0LnZhbHVlID0gXCJcIiArIHRoaXMuYWlycGxhbmUucm91dGUuaW5kZXhPZih0aGlzLnJvdXRlKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWluLXByaWNlXCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtc2hvcC1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1wcmljZVwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1zaG9wLWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1zaG9wLXVudGlsLWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LXVudGlsLWFtb3VudF9cIiArIHgpKVxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbWF4LWxvYWRcIikpLnZhbHVlID0gKHRoaXMucm91dGUubWF4TG9hZCA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLm1heExvYWQudG9TdHJpbmcoKTtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50W3hdID09PSB1bmRlZmluZWQpID8gXCJcIiA6IHRoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1pbi1wcmljZV9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWluLXByaWNlX1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUudW5sb2FkTWFya2V0UHJpY2VbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRQcmljZVt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLXNob3AtYW1vdW50X1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLXNob3AtYW1vdW50X1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUudW5sb2FkU2hvcEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLnVubG9hZFNob3BBbW91bnRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUubG9hZE1hcmtldEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRNYXJrZXRBbW91bnRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1wcmljZV9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1wcmljZV9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLmxvYWRNYXJrZXRQcmljZVt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRNYXJrZXRQcmljZVt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1zaG9wLWFtb3VudF9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtc2hvcC1hbW91bnRfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS5sb2FkU2hvcEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRTaG9wQW1vdW50W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXNob3AtdW50aWwtYW1vdW50X1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1zaG9wLXVudGlsLWFtb3VudF9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLmxvYWRTaG9wVW50aWxBbW91bnRbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS5sb2FkU2hvcFVudGlsQW1vdW50W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIC8vdWktdGFicy1hY3RpdmVcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKHtcbiAgICAgICAgICAgIHdpZHRoOiBcIjQwMHB4XCIsXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmRpYWxvZyhcIndpZGdldFwiKS5kcmFnZ2FibGUoXCJvcHRpb25cIiwgXCJjb250YWlubWVudFwiLCBcIm5vbmVcIik7XG4gICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmNzcyh7IHBvc2l0aW9uOiBcImZpeGVkXCIgfSk7XG5cbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgIH1cbn1cbiJdfQ==