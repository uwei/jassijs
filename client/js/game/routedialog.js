define(["require", "exports", "game/product", "game/icons"], function (require, exports, product_1, icons_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RouteDialog = void 0;
    var css = `
  .routedialog >*{
        font-size:10px; 
    }
`;
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
        createStyle() {
            var style = document.createElement('style');
            style.id = "routedialogcss";
            style.type = 'text/css';
            style.innerHTML = css;
            var old = document.getElementById("routedialogcss");
            if (old) {
                old.parentNode.removeChild(old);
            }
            document.getElementsByTagName('head')[0].appendChild(style);
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
                            store[prod.input1] += Math.round((1.1 * city.companies[c].buildings * 25 * prod.input1Amount / 25));
                        if (prod.input2)
                            store[prod.input2] += Math.round((1.1 * city.companies[c].buildings * 25 * prod.input2Amount / 25));
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
            this.createStyle();
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
                //     position:{my:"left top",at:"right top",of:$(document)} ,
                open: function (event, ui) {
                    _this.update(true);
                },
                close: function () {
                }
            });
            $(this.dom).parent().css({ position: "fixed" });
        }
        close() {
            $(this.dom).dialog("close");
        }
    }
    exports.RouteDialog = RouteDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3JvdXRlZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFLQSxJQUFJLEdBQUcsR0FBRzs7OztDQUlULENBQUM7SUFFRixNQUFhLFdBQVc7UUFPcEI7WUFITyxzQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFLN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNsQyxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDN0MsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2hDLENBQUM7UUFFTyxXQUFXO1lBQ2YsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxLQUFLLENBQUMsRUFBRSxHQUFHLGdCQUFnQixDQUFDO1lBQzVCLEtBQUssQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1lBRXRCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNwRCxJQUFJLEdBQUcsRUFBRTtnQkFDTCxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQztZQUNELFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUNELFdBQVc7WUFDUCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHFCQUFXLENBQUMsTUFBTSxFQUFF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SUFBSSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQy9NO1FBRUwsQ0FBQztRQUNELElBQUk7WUFDQSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsZ0JBQWdCO1lBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUNmLEtBQUssRUFBRSxPQUFPO2dCQUNkLCtEQUErRDtnQkFDL0QsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFLEVBQUU7b0JBQ3JCLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBQ0QsS0FBSyxFQUFFO2dCQUNQLENBQUM7YUFDSixDQUFDLENBQUM7WUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXBELENBQUM7UUFDRCxLQUFLO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBM2JELGtDQTJiQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgYWxsUHJvZHVjdHMsIFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XG5pbXBvcnQgeyBBaXJwbGFuZSB9IGZyb20gXCJnYW1lL2FpcnBsYW5lXCI7XG5pbXBvcnQgeyBJY29ucyB9IGZyb20gXCJnYW1lL2ljb25zXCI7XG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XG52YXIgY3NzID0gYFxuICAucm91dGVkaWFsb2cgPip7XG4gICAgICAgIGZvbnQtc2l6ZToxMHB4OyBcbiAgICB9XG5gO1xuXG5leHBvcnQgY2xhc3MgUm91dGVEaWFsb2cge1xuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XG4gICAgYWlycGxhbmU6IEFpcnBsYW5lO1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U7XG4gICAgcHVibGljIGRyb3BDaXRpZXNFbmFibGVkID0gZmFsc2U7XG4gICAgcm91dGU6IFJvdXRlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcblxuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogUm91dGVEaWFsb2cge1xuICAgICAgICBpZiAoUm91dGVEaWFsb2cuaW5zdGFuY2UgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIFJvdXRlRGlhbG9nLmluc3RhbmNlID0gbmV3IFJvdXRlRGlhbG9nKCk7XG4gICAgICAgIHJldHVybiBSb3V0ZURpYWxvZy5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVN0eWxlKCkge1xuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pZCA9IFwicm91dGVkaWFsb2djc3NcIjtcbiAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGNzcztcblxuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZWRpYWxvZ2Nzc1wiKTtcbiAgICAgICAgaWYgKG9sZCkge1xuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gICAgYmluZEFjdGlvbnMoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LXVudGlsLWFtb3VudF9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1pbi1wcmljZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLnVubG9hZE1hcmtldFByaWNlW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudF9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZE1hcmtldEFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LXByaWNlX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZE1hcmtldFByaWNlW2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlQW1vdW50W2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS11bnRpbC1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnRbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtc2VsZWN0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHZhciB2YWwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1zZWxlY3RcIikpLnZhbHVlO1xuICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQodmFsKTtcbiAgICAgICAgICAgIF90aGlzLnJvdXRlID0gX3RoaXMuYWlycGxhbmUucm91dGVbaWRdO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLXVubG9hZC1tYXJrZXQtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAxOyB4IDwgX3RoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRBbW91bnRbeF0gPSB0aGlzLnJvdXRlLnVubG9hZE1hcmtldEFtb3VudFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS11bmxvYWQtd2FyZWhvdXMtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAxOyB4IDwgX3RoaXMucm91dGUudW5sb2FkV2FyZWhvdXNlQW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS51bmxvYWRXYXJlaG91c2VBbW91bnRbeF0gPSB0aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLW1hcmtldC1maWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPCBfdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50W3hdID0gdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50WzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxvYWQtbWFya2V0LXVudGlsLWZpbGxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IF90aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGUubG9hZE1hcmtldFVudGlsQW1vdW50W3hdID0gdGhpcy5yb3V0ZS5sb2FkTWFya2V0VW50aWxBbW91bnRbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbG9hZC13YXJlaG91c2UtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAxOyB4IDwgX3RoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFt4XSA9IHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLXdhcmVob3VzZS11bnRpbC1maWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPCBfdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XSA9IHRoaXMucm91dGUubG9hZFdhcmVob3VzZVVudGlsQW1vdW50WzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxvYWQtZmlsbC1jb25zdW10aW9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgX3RoaXMubG9hZEZpbGxDb25zdW10aW9uKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLWZpbGwtY29uc3VtdGlvbi11bnRpbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIF90aGlzLmxvYWRGaWxsQ29uc3VtdGlvbihmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWNvcHktcHJldlwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIF90aGlzLmNvcHlSb3V0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZWRpYWxvZy1haXJwbGFuZS1wcmV2XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgX3RoaXMucHJldlJvdXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nLWFpcnBsYW5lLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBfdGhpcy5uZXh0Um91dGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHByZXZSb3V0ZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcbiAgICAgICAgcG9zLS07XG4gICAgICAgIGlmIChwb3MgPT09IDApXG4gICAgICAgICAgICBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgX3RoaXMuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXTtcbiAgICAgICAgX3RoaXMucm91dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXS5yb3V0ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIF90aGlzLnJvdXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5wcmV2Um91dGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdLnJvdXRlWzBdO1xuICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgfVxuICAgIG5leHRSb3V0ZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcbiAgICAgICAgcG9zKys7XG4gICAgICAgIGlmIChwb3MgPj0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmxlbmd0aClcbiAgICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgIF90aGlzLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc107XG4gICAgICAgIGlmIChfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXS5yb3V0ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIF90aGlzLnJvdXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5uZXh0Um91dGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdLnJvdXRlWzBdO1xuICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgfVxuXG4gICAgY29weVJvdXRlKCkge1xuICAgICAgICB2YXIgcG9zID0gdGhpcy5yb3V0ZS5haXJwbGFuZS5yb3V0ZS5pbmRleE9mKHRoaXMucm91dGUpO1xuICAgICAgICBpZiAocG9zID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBwb3MtLTtcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMucm91dGUuYWlycGxhbmUucm91dGVbcG9zXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50W3hdID0gc291cmNlLmxvYWRNYXJrZXRBbW91bnRbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRNYXJrZXRQcmljZVt4XSA9IHNvdXJjZS5sb2FkTWFya2V0UHJpY2VbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudFt4XSA9IHNvdXJjZS5sb2FkTWFya2V0VW50aWxBbW91bnRbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VBbW91bnRbeF0gPSBzb3VyY2UubG9hZFdhcmVob3VzZUFtb3VudFt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUubG9hZFdhcmVob3VzZVVudGlsQW1vdW50W3hdID0gc291cmNlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50W3hdID0gc291cmNlLnVubG9hZE1hcmtldEFtb3VudFt4XTtcbiAgICAgICAgICAgIHRoaXMucm91dGUudW5sb2FkTWFya2V0UHJpY2VbeF0gPSBzb3VyY2UudW5sb2FkTWFya2V0UHJpY2VbeF07XG4gICAgICAgICAgICB0aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFt4XSA9IHNvdXJjZS51bmxvYWRXYXJlaG91c2VBbW91bnRbeF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9XG4gICAgbG9hZEZpbGxDb25zdW10aW9uKGFsbENpdGllczogYm9vbGVhbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgYWxsID0gX3RoaXMucm91dGUuYWlycGxhbmUucm91dGU7XG4gICAgICAgIHZhciBsZW5waXhlbCA9IDA7XG4gICAgICAgIHZhciBsYXN0cG9zID0gdW5kZWZpbmVkO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIGNpdHkgPSBfdGhpcy5yb3V0ZS5haXJwbGFuZS53b3JsZC5jaXRpZXNbYWxsW3hdLmNpdHlpZF07XG4gICAgICAgICAgICBpZiAobGFzdHBvcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbGFzdHBvcyA9IFtjaXR5LngsIGNpdHkueV07XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RjaXR5ID0gX3RoaXMucm91dGUuYWlycGxhbmUud29ybGQuY2l0aWVzW2FsbFthbGwubGVuZ3RoIC0gMV0uY2l0eWlkXTtcbiAgICAgICAgICAgICAgICB2YXIgZGlzdCA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KE1hdGgucG93KGxhc3Rwb3NbMF0gLSBsYXN0Y2l0eS54LCAyKSArIE1hdGgucG93KGxhc3Rwb3NbMV0gLSBsYXN0Y2l0eS55LCAyKSkpOy8vUHl0aGFyb3Jhc1xuICAgICAgICAgICAgICAgIGxlbnBpeGVsICs9IGRpc3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBkaXN0ID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoTWF0aC5wb3cobGFzdHBvc1swXSAtIGNpdHkueCwgMikgKyBNYXRoLnBvdyhsYXN0cG9zWzFdIC0gY2l0eS55LCAyKSkpOy8vUHl0aGFyb3Jhc1xuICAgICAgICAgICAgICAgIGxlbnBpeGVsICs9IGRpc3Q7XG4gICAgICAgICAgICAgICAgbGFzdHBvcyA9IFtjaXR5LngsIGNpdHkueV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRheXMgPSBsZW5waXhlbCAvIF90aGlzLnJvdXRlLmFpcnBsYW5lLnNwZWVkOyAvL3Q9cy92OyBpbiBUYWdlXG4gICAgICAgIHZhciB0b3RhbERheXMgPSAoTWF0aC5yb3VuZChkYXlzICogMjQpICsgMSArIGFsbC5sZW5ndGggKiAzICsgYWxsLmxlbmd0aCAqIDMpOyAgIC8vKzNoIGxvYWQgYW5kIHVubG9hZFxuICAgICAgICBjb25zb2xlLmxvZyh0b3RhbERheXMpO1xuICAgICAgICB2YXIgc3RvcmUgPSBhbGxDaXRpZXMgPyB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VBbW91bnQgOiB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudDtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgc3RvcmVbeF0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgY2l0eSA9IF90aGlzLnJvdXRlLmFpcnBsYW5lLndvcmxkLmNpdGllc1thbGxbeF0uY2l0eWlkXTtcbiAgICAgICAgICAgIHZhciBjYXVzZTtcbiAgICAgICAgICAgIGlmIChhbGxDaXRpZXMpIHtcbiAgICAgICAgICAgICAgICBjYXVzZSA9IChhbGxbeF0uY2l0eWlkICE9PSB0aGlzLnJvdXRlLmNpdHlpZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhdXNlID0gYWxsW3hdLmNpdHlpZCA9PT0gdGhpcy5yb3V0ZS5jaXR5aWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjYXVzZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY2l0eS5jb21wYW5pZXMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb2QgPSBhbGxQcm9kdWN0c1tjaXR5LmNvbXBhbmllc1tjXS5wcm9kdWN0aWRdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZC5pbnB1dDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZVtwcm9kLmlucHV0MV0gKz0gTWF0aC5yb3VuZCgoMS4xKmNpdHkuY29tcGFuaWVzW2NdLmJ1aWxkaW5ncyoyNSAqIHByb2QuaW5wdXQxQW1vdW50IC8gMjUpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2QuaW5wdXQyKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVbcHJvZC5pbnB1dDJdICs9IE1hdGgucm91bmQoKDEuMSpjaXR5LmNvbXBhbmllc1tjXS5idWlsZGluZ3MqMjUgKiBwcm9kLmlucHV0MkFtb3VudCAvIDI1KSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVt5XSArPSBNYXRoLnJvdW5kKDEuMSp0b3RhbERheXMgKiBhbGxQcm9kdWN0c1t5XS5kYWlseUNvbnN1bXRpb24gKiBjaXR5LnBlb3BsZSAvIDI0KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJyb3V0ZWRpYWxvZ1wiIGNsYXNzPVwicm91dGVkaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nXCIpO1xuICAgICAgICBpZiAob2xkKSB7XG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3JlYXRlU3R5bGUoKTtcbiAgICAgICAgdmFyIGFpcnBsYW5lID0gdGhpcy5haXJwbGFuZTtcbiAgICAgICAgdmFyIHByb2R1Y3RzID0gYWxsUHJvZHVjdHM7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBzZG9tID0gYFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInJvdXRlZGlhbG9nLWFpcnBsYW5lLXByZXZcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI8XCIvPlxuICAgICAgICAgICAgPHNwYW4gaWQ9XCJyb3V0ZWRpYWxvZy1haXJwbGFuZS1uYW1lXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwicm91dGVkaWFsb2ctYWlycGxhbmUtbmV4dFwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIj5cIi8+XG4gICAgICAgICAgICA8c2VsZWN0IGlkPVwicm91dGUtc2VsZWN0XCIgPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJyb3V0ZS1jb3B5LXByZXZcIiB0aXRsZT1cImNvcHkgcHJldiByb3V0ZVwiPmArIEljb25zLmNvcHkgKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicm91dGVkaWFsb2ctdGFic1wiPlxuICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjcm91dGVkaWFsb2ctdW5sb2FkXCIgY2xhc3M9XCJyb3V0ZWRpYWxvZy10YWJzXCI+VW5sb2FkPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3JvdXRlZGlhbG9nLWxvYWRcIiBjbGFzcz1cInJvdXRlZGlhbG9nLXRhYnNcIj5Mb2FkPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwicm91dGVkaWFsb2ctdW5sb2FkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGlkPVwicm91dGVkaWFsb2ctdW5sb2FkLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1hcmtldDxici8+bWF4IGFtb3VudDxici8+PGJ1dHRvbiBpZD1cInJvdXRlLXVubG9hZC1tYXJrZXQtZmlsbFwiIHRpdGxlPVwiZmlsbCBmaXJzdCByb3cgZG93blwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPiA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5NYXJrZXQ8YnIvPm1pbiBwcmljZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPldhcmVob3VzZTxici8+YW1vdW50PGJyLz48YnV0dG9uIGlkPVwicm91dGUtdW5sb2FkLXdhcmVob3VzLWZpbGxcIiB0aXRsZT1cImZpbGwgZmlyc3Qgcm93IGRvd25cIj5gKyBJY29ucy5maWxsRG93biArIGA8L2J1dHRvbj48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByaWNlKGlkOiBzdHJpbmcsIGNoYW5nZTogbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkICsgXCIgXCIgKyBjaGFuZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5uYW1lICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRcIiBpZD1cInVubG9hZC1tYXJrZXQtbWF4LWFtb3VudF8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwidW5sb2FkLW1hcmtldC1taW4tcHJpY2VcIiBpZD1cInVubG9hZC1tYXJrZXQtbWluLXByaWNlXycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudFwiIGlkPVwidW5sb2FkLXdhcmVob3VzZS1hbW91bnRfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+ICAgIFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJyb3V0ZWRpYWxvZy1sb2FkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGlkPVwicm91dGVkaWFsb2ctbG9hZC10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5NYXJrZXQ8YnIvPmFtb3VudDxici8+PGJ1dHRvbiBpZD1cInJvdXRlLWxvYWQtbWFya2V0LWZpbGxcIj5gKyBJY29ucy5maWxsRG93biArIGA8L2J1dHRvbj48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5NYXJrZXQ8YnIvPnVudGlsIGFtb3VudDxici8+PGJ1dHRvbiBpZD1cInJvdXRlLWxvYWQtbWFya2V0LXVudGlsLWZpbGxcIiB0aXRsZT1cImZpbGwgZmlyc3Qgcm93IGRvd25cIj5gKyBJY29ucy5maWxsRG93biArIGA8L2J1dHRvbj48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5NYXJrZXQ8YnIvPm1heCBwcmljZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPldhcmVob3VzZTxici8+YW1vdW50PGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJvdXRlLWxvYWQtd2FyZWhvdXNlLWZpbGxcIiB0aXRsZT1cImZpbGwgZmlyc3Qgcm93IGRvd25cIj5gKyBJY29ucy5maWxsRG93biArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJvdXRlLWxvYWQtZmlsbC1jb25zdW10aW9uXCIgdGl0bGU9XCJmaWxsIGNvbnN1bXRpb25cIj5gKyBJY29ucy5mb29kICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPldhcmVob3VzZTxici8+dW50aWwgYW1vdW50PGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJvdXRlLWxvYWQtd2FyZWhvdXNlLXVudGlsLWZpbGxcIiB0aXRsZT1cImZpbGwgZmlyc3Qgcm93IGRvd25cIj5gKyBJY29ucy5maWxsRG93biArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInJvdXRlLWxvYWQtZmlsbC1jb25zdW10aW9uLXVudGlsXCIgdGl0bGU9XCJmaWxsIGNvbnN1bXRpb25cIj5gKyBJY29ucy5mb29kICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJpY2UoaWQ6IHN0cmluZywgY2hhbmdlOiBudW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaWQgKyBcIiBcIiArIGNoYW5nZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0uZ2V0SWNvbigpICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLm5hbWUgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cImxvYWQtbWFya2V0LW1heC1hbW91bnRcIiBpZD1cImxvYWQtbWFya2V0LW1heC1hbW91bnRfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cImxvYWQtbWFya2V0LXVudGlsLWFtb3VudFwiIGlkPVwibG9hZC1tYXJrZXQtdW50aWwtYW1vdW50XycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJsb2FkLW1hcmtldC1tYXgtcHJpY2VcIiBpZD1cImxvYWQtbWFya2V0LW1heC1wcmljZV8nICsgeCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwibG9hZC13YXJlaG91c2UtYW1vdW50XCIgaWQ9XCJsb2FkLXdhcmVob3VzZS1hbW91bnRfJyArIHggKyAnXCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArICdcIj48L3RkPic7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cImxvYWQtd2FyZWhvdXNlLXVudGlsLWFtb3VudFwiIGlkPVwibG9hZC13YXJlaG91c2UtdW50aWwtYW1vdW50XycgKyB4ICsgJ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPiAgICBcbiAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB2YXIgbmV3ZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20uY2hpbGRyZW5bMF0pO1xuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdkb20pO1xuICAgICAgICAkKFwiI3JvdXRlZGlhbG9nLXRhYnNcIikudGFicyh7XG4gICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICQoXCIjcm91dGVkaWFsb2ctdGFic1wiKS50YWJzKHtcbiAgICAgICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vICAkKCBcIiNyb3V0ZS1saXN0XCIgKS5zb3J0YWJsZSgpO1xuICAgICAgICB9LCAxMDApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcblxuICAgICAgICAvLyAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIilcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBfdGhpcy5iaW5kQWN0aW9ucygpO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgICAvL2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIH1cblxuICAgIHVwZGF0ZShmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoISQodGhpcy5kb20pLmRpYWxvZygnaXNPcGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGVkaWFsb2ctYWlycGxhbmUtbmFtZVwiKS5pbm5lckhUTUwgPSB0aGlzLmFpcnBsYW5lLm5hbWU7XG4gICAgICAgIHZhciBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLXNlbGVjdFwiKTtcbiAgICAgICAgc2VsZWN0LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZS5yb3V0ZS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICAgICAgdmFyIGNpdHkgPSB0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1t0aGlzLmFpcnBsYW5lLnJvdXRlW3hdLmNpdHlpZF07XG4gICAgICAgICAgICBvcHQudmFsdWUgPSBcIlwiICsgeDtcbiAgICAgICAgICAgIG9wdC50ZXh0ID0gY2l0eS5uYW1lO1xuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucm91dGUpXG4gICAgICAgICAgICBzZWxlY3QudmFsdWUgPSBcIlwiICsgdGhpcy5haXJwbGFuZS5yb3V0ZS5pbmRleE9mKHRoaXMucm91dGUpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWF4LWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLW1hcmtldC1taW4tcHJpY2VcIikpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC13YXJlaG91c2UtYW1vdW50XCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50XCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC11bnRpbC1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1wcmljZVwiKSkudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC13YXJlaG91c2UtYW1vdW50XCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS11bnRpbC1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWF4LWFtb3VudF9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWF4LWFtb3VudF9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLnVubG9hZE1hcmtldEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLnVubG9hZE1hcmtldEFtb3VudFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLW1hcmtldC1taW4tcHJpY2VfXCIgKyB4KSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1pbi1wcmljZV9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLnVubG9hZE1hcmtldFByaWNlW3hdID09PSB1bmRlZmluZWQpID8gXCJcIiA6IHRoaXMucm91dGUudW5sb2FkTWFya2V0UHJpY2VbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC13YXJlaG91c2UtYW1vdW50X1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLXdhcmVob3VzZS1hbW91bnRfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS51bmxvYWRXYXJlaG91c2VBbW91bnRbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS51bmxvYWRXYXJlaG91c2VBbW91bnRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUubG9hZE1hcmtldEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRNYXJrZXRBbW91bnRbeF0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LXVudGlsLWFtb3VudF9cIiArIHgpKVxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LXVudGlsLWFtb3VudF9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LXByaWNlX1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LXByaWNlX1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUubG9hZE1hcmtldFByaWNlW3hdID09PSB1bmRlZmluZWQpID8gXCJcIiA6IHRoaXMucm91dGUubG9hZE1hcmtldFByaWNlW3hdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS1hbW91bnRfXCIgKyB4KSlcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS1hbW91bnRfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlQW1vdW50W3hdID09PSB1bmRlZmluZWQpID8gXCJcIiA6IHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFt4XS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC13YXJlaG91c2UtdW50aWwtYW1vdW50X1wiICsgeCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC13YXJlaG91c2UtdW50aWwtYW1vdW50X1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUubG9hZFdhcmVob3VzZVVudGlsQW1vdW50W3hdID09PSB1bmRlZmluZWQpID8gXCJcIiA6IHRoaXMucm91dGUubG9hZFdhcmVob3VzZVVudGlsQW1vdW50W3hdLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIC8vdWktdGFicy1hY3RpdmVcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKHtcbiAgICAgICAgICAgIHdpZHRoOiBcIjU4M3B4XCIsXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xuXG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICB9XG59XG4iXX0=