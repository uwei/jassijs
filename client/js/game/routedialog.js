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
            <input id="routedialog-airplane-prev" type="button" value="<" class="mybutton"/>
            <div id="routedialog-airplane-name" style="display:inline;width:50px"></div>
            <input id="routedialog-airplane-next" type="button" value=">" class="mybutton"/>
            <select id="route-select" >
            </select>
            <input id="routedialog-route-next" type="button" value=">" class="mybutton"/>
           
                      
          </div>
          
            <div id="routedialog-tabs">
                <div id="routedialog-load">
                
                      <table id="routedialog-load-table" style="height:100%;weight:100%;">
                        <tr >
                            <th>Name</th>
                            <th></th>
                             <th>unload<br/>
                                <button id="route-unload-warehous-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button>
                                <button id="route-unload-warehous-fill9" title="fill 99999999 down">` + icons_1.Icons.nine + `</button>
                            </th>
                            <th>load<br/>
                                <button id="route-load-shop-fill" title="fill first row down">` + icons_1.Icons.fillDown + `</button>
                                <button id="route-load-fill-consumtion" title="fill consumtion">` + icons_1.Icons.food + `</button>
                            </th>

                            <th>load<br/>everything except<br/>
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
                    ret = ret + '<td>' + '<input type="number" min="0" class="unload-shop-amount" id="unload-shop-amount_' + x + '"' +
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
                document.getElementById("unload-shop-amount_" + x).addEventListener("change", (e) => {
                    var ctrl = e.target;
                    var id = parseInt(ctrl.id.split("_")[1]);
                    _this.route.unloadShopAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
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
            document.getElementById("route-select").addEventListener("change", (e) => {
                var val = document.getElementById("route-select").value;
                var id = parseInt(val);
                _this.route = _this.airplane.route[id];
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
                this.route.loadShopAmount[x] = source.loadShopAmount[x];
                this.route.loadShopUntilAmount[x] = source.loadShopUntilAmount[x];
                this.route.unloadShopAmount[x] = source.unloadShopAmount[x];
            }
            this.update();
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
            var totalDays = (Math.round(days * 24) + 1 + all.length * 3 + all.length * 3) / 24; //+4h load and unload
            if (totalDays < 3)
                totalDays = 3;
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
                            store[prod.input1] += Math.round((1.3 * buildings * prod.input1Amount * totalDays));
                        if (prod.input2)
                            store[prod.input2] += Math.round((1.3 * buildings * prod.input2Amount * totalDays));
                    }
                    for (var y = 0; y < parameter.allProducts.length; y++) {
                        store[y] += Math.round(1.3 * totalDays * parameter.allProducts[y].dailyConsumtion * (allPeople + parameter.neutralStartPeople));
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
                document.getElementById("unload-shop-amount").value = "";
                document.getElementById("load-shop-amount").value = "";
                document.getElementById("load-shop-until-amount").value = "";
                return;
            }
            for (var x = 0; x < parameter.allProducts.length; x++) {
                if (document.activeElement !== document.getElementById("unload-shop-amount_" + x))
                    document.getElementById("unload-shop-amount_" + x).value = (this.route.unloadShopAmount[x] === undefined) ? "" : this.route.unloadShopAmount[x].toString();
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
//# sourceMappingURL=routedialog.js.map