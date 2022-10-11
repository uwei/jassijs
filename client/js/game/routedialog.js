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
            <input id="routedialog-prev" type="button" value="<"/>
            <input id="routedialog-next" type="button" value=">"/>
            <select id="route-select" >
                    
                    
            </select>
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
                            <th>Market<br/>max amount<br/><button id="route-unload-market-fill">` + icons_1.Icons.fillDown + `</button> </th>
                            <th>Market<br/>min price</th>
                            <th>Warehouse<br/>amount<br/><button id="route-unload-warehous-fill">` + icons_1.Icons.fillDown + `</button></th>
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
                            <th>Market<br/>until amount<br/><button id="route-load-market-until-fill">` + icons_1.Icons.fillDown + `</button></th>
                            <th>Market<br/>max price</th>
                            <th>Warehouse<br/>amount<br/><button id="route-load-warehouse-fill">` + icons_1.Icons.fillDown + `</button></th>
                            <th>Warehouse<br/>until amount<br/><button id="route-load-warehouse-until-fill">` + icons_1.Icons.fillDown + `</button></th>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3JvdXRlZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFLQSxJQUFJLEdBQUcsR0FBRzs7OztDQUlULENBQUM7SUFFRixNQUFhLFdBQVc7UUFPcEI7WUFITyxzQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFLN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNsQyxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDN0MsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ2hDLENBQUM7UUFFTyxXQUFXO1lBQ2YsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxLQUFLLENBQUMsRUFBRSxHQUFHLGdCQUFnQixDQUFDO1lBQzVCLEtBQUssQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1lBRXRCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNwRCxJQUFJLEdBQUcsRUFBRTtnQkFDTCxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQztZQUNELFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUNELFdBQVc7WUFDUCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHFCQUFXLENBQUMsTUFBTSxFQUFF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LElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLGdCQUFnQjtZQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDZixLQUFLLEVBQUUsT0FBTztnQkFDZCwrREFBK0Q7Z0JBQy9ELElBQUksRUFBRSxVQUFVLEtBQUssRUFBRSxFQUFFO29CQUNyQixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixDQUFDO2dCQUNELEtBQUssRUFBRTtnQkFDUCxDQUFDO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRCxDQUFDO1FBQ0QsS0FBSztZQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FDSjtJQXRURCxrQ0FzVEMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgYWxsUHJvZHVjdHMsIFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XHJcbnZhciBjc3MgPSBgXHJcbiAgLnJvdXRlZGlhbG9nID4qe1xyXG4gICAgICAgIGZvbnQtc2l6ZToxMHB4OyBcclxuICAgIH1cclxuYDtcclxuXHJcbmV4cG9ydCBjbGFzcyBSb3V0ZURpYWxvZyB7XHJcbiAgICBkb206IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgYWlycGxhbmU6IEFpcnBsYW5lO1xyXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcclxuICAgIHB1YmxpYyBkcm9wQ2l0aWVzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgcm91dGU6IFJvdXRlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xyXG5cclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBSb3V0ZURpYWxvZyB7XHJcbiAgICAgICAgaWYgKFJvdXRlRGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIFJvdXRlRGlhbG9nLmluc3RhbmNlID0gbmV3IFJvdXRlRGlhbG9nKCk7XHJcbiAgICAgICAgcmV0dXJuIFJvdXRlRGlhbG9nLmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU3R5bGUoKSB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgICBzdHlsZS5pZCA9IFwicm91dGVkaWFsb2djc3NcIjtcclxuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XHJcblxyXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nY3NzXCIpO1xyXG4gICAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgICB9XHJcbiAgICBiaW5kQWN0aW9ucygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50W2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtdW50aWwtYW1vdW50X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZE1hcmtldFVudGlsQW1vdW50W2lkXSA9IGN0cmwudmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUludChjdHJsLnZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWluLXByaWNlX1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUudW5sb2FkTWFya2V0UHJpY2VbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudF9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN0cmwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoY3RybC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucm91dGUubG9hZE1hcmtldEFtb3VudFtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtbWFya2V0LW1heC1wcmljZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLmxvYWRNYXJrZXRQcmljZVtpZF0gPSBjdHJsLnZhbHVlID09PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VJbnQoY3RybC52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtd2FyZWhvdXNlLWFtb3VudF9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGN0cmwuaWQuc3BsaXQoXCJfXCIpWzFdKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VBbW91bnRbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS11bnRpbC1hbW91bnRfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChjdHJsLmlkLnNwbGl0KFwiX1wiKVsxXSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnRbaWRdID0gY3RybC52YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KGN0cmwudmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLXNlbGVjdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1zZWxlY3RcIikpLnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludCh2YWwpO1xyXG4gICAgICAgICAgICBfdGhpcy5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLnJvdXRlW2lkXTtcclxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS11bmxvYWQtbWFya2V0LWZpbGxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAxOyB4IDwgX3RoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlLnVubG9hZE1hcmtldEFtb3VudFt4XSA9IHRoaXMucm91dGUudW5sb2FkTWFya2V0QW1vdW50WzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS11bmxvYWQtd2FyZWhvdXMtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPCBfdGhpcy5yb3V0ZS51bmxvYWRXYXJlaG91c2VBbW91bnQubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGUudW5sb2FkV2FyZWhvdXNlQW1vdW50W3hdID0gdGhpcy5yb3V0ZS51bmxvYWRXYXJlaG91c2VBbW91bnRbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbG9hZC1tYXJrZXQtZmlsbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPCBfdGhpcy5yb3V0ZS5sb2FkTWFya2V0QW1vdW50Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlLmxvYWRNYXJrZXRBbW91bnRbeF0gPSB0aGlzLnJvdXRlLmxvYWRNYXJrZXRBbW91bnRbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLW1hcmtldC11bnRpbC1maWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IF90aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudC5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkTWFya2V0VW50aWxBbW91bnRbeF0gPSB0aGlzLnJvdXRlLmxvYWRNYXJrZXRVbnRpbEFtb3VudFswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLXdhcmVob3VzZS1maWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IF90aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VBbW91bnQubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFt4XSA9IHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1sb2FkLXdhcmVob3VzZS11bnRpbC1maWxsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IF90aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudC5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnRbeF0gPSB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAgXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcclxuICAgICAgICAvL3RlbXBsYXRlIGZvciBjb2RlIHJlbG9hZGluZ1xyXG4gICAgICAgIHZhciBzZG9tID0gYFxyXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJyb3V0ZWRpYWxvZ1wiIGNsYXNzPVwicm91dGVkaWFsb2dcIj5cclxuICAgICAgICAgICAgPGRpdj48L2Rpdj5cclxuICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIHRoaXMuZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcclxuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZWRpYWxvZ1wiKTtcclxuICAgICAgICBpZiAob2xkKSB7XHJcbiAgICAgICAgICAgIG9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3JlYXRlU3R5bGUoKTtcclxuICAgICAgICB2YXIgYWlycGxhbmUgPSB0aGlzLmFpcnBsYW5lO1xyXG4gICAgICAgIHZhciBwcm9kdWN0cyA9IGFsbFByb2R1Y3RzO1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNkb20gPSBgXHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGlucHV0IGlkPVwicm91dGVkaWFsb2ctcHJldlwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjxcIi8+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cInJvdXRlZGlhbG9nLW5leHRcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI+XCIvPlxyXG4gICAgICAgICAgICA8c2VsZWN0IGlkPVwicm91dGUtc2VsZWN0XCIgPlxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwicm91dGVkaWFsb2ctdGFic1wiPlxyXG4gICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3JvdXRlZGlhbG9nLXVubG9hZFwiIGNsYXNzPVwicm91dGVkaWFsb2ctdGFic1wiPlVubG9hZDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3JvdXRlZGlhbG9nLWxvYWRcIiBjbGFzcz1cInJvdXRlZGlhbG9nLXRhYnNcIj5Mb2FkPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInJvdXRlZGlhbG9nLXVubG9hZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGlkPVwicm91dGVkaWFsb2ctdW5sb2FkLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWFya2V0PGJyLz5tYXggYW1vdW50PGJyLz48YnV0dG9uIGlkPVwicm91dGUtdW5sb2FkLW1hcmtldC1maWxsXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+IDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWFya2V0PGJyLz5taW4gcHJpY2U8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPldhcmVob3VzZTxici8+YW1vdW50PGJyLz48YnV0dG9uIGlkPVwicm91dGUtdW5sb2FkLXdhcmVob3VzLWZpbGxcIj5gKyBJY29ucy5maWxsRG93biArIGA8L2J1dHRvbj48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJpY2UoaWQ6IHN0cmluZywgY2hhbmdlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCArIFwiIFwiICsgY2hhbmdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLm5hbWUgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwidW5sb2FkLW1hcmtldC1tYXgtYW1vdW50XCIgaWQ9XCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfJyArIHggKyAnXCInICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJ1bmxvYWQtbWFya2V0LW1pbi1wcmljZVwiIGlkPVwidW5sb2FkLW1hcmtldC1taW4tcHJpY2VfJyArIHggKyAnXCInICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudFwiIGlkPVwidW5sb2FkLXdhcmVob3VzZS1hbW91bnRfJyArIHggKyAnXCInICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9KSgpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+ICAgIFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwicm91dGVkaWFsb2ctbG9hZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGlkPVwicm91dGVkaWFsb2ctbG9hZC10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1hcmtldDxici8+YW1vdW50PGJyLz48YnV0dG9uIGlkPVwicm91dGUtbG9hZC1tYXJrZXQtZmlsbFwiPmArIEljb25zLmZpbGxEb3duICsgYDwvYnV0dG9uPjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TWFya2V0PGJyLz51bnRpbCBhbW91bnQ8YnIvPjxidXR0b24gaWQ9XCJyb3V0ZS1sb2FkLW1hcmtldC11bnRpbC1maWxsXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5NYXJrZXQ8YnIvPm1heCBwcmljZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+V2FyZWhvdXNlPGJyLz5hbW91bnQ8YnIvPjxidXR0b24gaWQ9XCJyb3V0ZS1sb2FkLXdhcmVob3VzZS1maWxsXCI+YCsgSWNvbnMuZmlsbERvd24gKyBgPC9idXR0b24+PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5XYXJlaG91c2U8YnIvPnVudGlsIGFtb3VudDxici8+PGJ1dHRvbiBpZD1cInJvdXRlLWxvYWQtd2FyZWhvdXNlLXVudGlsLWZpbGxcIj5gKyBJY29ucy5maWxsRG93biArIGA8L2J1dHRvbj48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJpY2UoaWQ6IHN0cmluZywgY2hhbmdlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZCArIFwiIFwiICsgY2hhbmdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLm5hbWUgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwibG9hZC1tYXJrZXQtbWF4LWFtb3VudFwiIGlkPVwibG9hZC1tYXJrZXQtbWF4LWFtb3VudF8nICsgeCArICdcIicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cImxvYWQtbWFya2V0LXVudGlsLWFtb3VudFwiIGlkPVwibG9hZC1tYXJrZXQtdW50aWwtYW1vdW50XycgKyB4ICsgJ1wiJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArICdcIj48L3RkPic7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICsgJzxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPVwiMFwiIGNsYXNzPVwibG9hZC1tYXJrZXQtbWF4LXByaWNlXCIgaWQ9XCJsb2FkLW1hcmtldC1tYXgtcHJpY2VfJyArIHggKyAnXCInICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IDUwcHg7XCInICsgJ1wiPjwvdGQ+JztcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJudW1iZXJcIiBtaW49XCIwXCIgY2xhc3M9XCJsb2FkLXdhcmVob3VzZS1hbW91bnRcIiBpZD1cImxvYWQtd2FyZWhvdXNlLWFtb3VudF8nICsgeCArICdcIicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJ3aWR0aDogNTBweDtcIicgKyAnXCI+PC90ZD4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArICc8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj1cIjBcIiBjbGFzcz1cImxvYWQtd2FyZWhvdXNlLXVudGlsLWFtb3VudFwiIGlkPVwibG9hZC13YXJlaG91c2UtdW50aWwtYW1vdW50XycgKyB4ICsgJ1wiJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiA1MHB4O1wiJyArICdcIj48L3RkPic7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfSkoKX1cclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPiAgICBcclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdkb20pO1xyXG4gICAgICAgICQoXCIjcm91dGVkaWFsb2ctdGFic1wiKS50YWJzKHtcclxuICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI3JvdXRlZGlhbG9nLXRhYnNcIikudGFicyh7XHJcbiAgICAgICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyAgJCggXCIjcm91dGUtbGlzdFwiICkuc29ydGFibGUoKTtcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xyXG5cclxuICAgICAgICAvLyAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIilcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMuYmluZEFjdGlvbnMoKTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGZvcmNlID0gZmFsc2UpIHtcclxuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1zZWxlY3RcIik7XHJcbiAgICAgICAgc2VsZWN0LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgICAgdmFyIGNpdHkgPSB0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1t0aGlzLmFpcnBsYW5lLnJvdXRlW3hdLmNpdHlpZF07XHJcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IFwiXCIgKyB4O1xyXG4gICAgICAgICAgICBvcHQudGV4dCA9IGNpdHkubmFtZTtcclxuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJvdXRlKVxyXG4gICAgICAgICAgICBzZWxlY3QudmFsdWUgPSBcIlwiICsgdGhpcy5haXJwbGFuZS5yb3V0ZS5pbmRleE9mKHRoaXMucm91dGUpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLW1hcmtldC1taW4tcHJpY2VcIikpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLXdhcmVob3VzZS1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC11bnRpbC1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LXByaWNlXCIpKS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtd2FyZWhvdXNlLWFtb3VudFwiKSkudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS11bnRpbC1hbW91bnRcIikpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1heC1hbW91bnRfXCIgKyB4KSlcclxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC1tYXJrZXQtbWF4LWFtb3VudF9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLnVubG9hZE1hcmtldEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLnVubG9hZE1hcmtldEFtb3VudFt4XS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtbWFya2V0LW1pbi1wcmljZV9cIiArIHgpKVxyXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5sb2FkLW1hcmtldC1taW4tcHJpY2VfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS51bmxvYWRNYXJrZXRQcmljZVt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLnVubG9hZE1hcmtldFByaWNlW3hdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVubG9hZC13YXJlaG91c2UtYW1vdW50X1wiICsgeCkpXHJcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bmxvYWQtd2FyZWhvdXNlLWFtb3VudF9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLnVubG9hZFdhcmVob3VzZUFtb3VudFt4XS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkpXHJcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtYW1vdW50X1wiICsgeCkpLnZhbHVlID0gKHRoaXMucm91dGUubG9hZE1hcmtldEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRNYXJrZXRBbW91bnRbeF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtdW50aWwtYW1vdW50X1wiICsgeCkpXHJcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC11bnRpbC1hbW91bnRfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS5sb2FkTWFya2V0VW50aWxBbW91bnRbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS5sb2FkTWFya2V0VW50aWxBbW91bnRbeF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1tYXJrZXQtbWF4LXByaWNlX1wiICsgeCkpXHJcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLW1hcmtldC1tYXgtcHJpY2VfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS5sb2FkTWFya2V0UHJpY2VbeF0gPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogdGhpcy5yb3V0ZS5sb2FkTWFya2V0UHJpY2VbeF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC13YXJlaG91c2UtYW1vdW50X1wiICsgeCkpXHJcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS1hbW91bnRfXCIgKyB4KSkudmFsdWUgPSAodGhpcy5yb3V0ZS5sb2FkV2FyZWhvdXNlQW1vdW50W3hdID09PSB1bmRlZmluZWQpID8gXCJcIiA6IHRoaXMucm91dGUubG9hZFdhcmVob3VzZUFtb3VudFt4XS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXdhcmVob3VzZS11bnRpbC1hbW91bnRfXCIgKyB4KSlcclxuICAgICAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtd2FyZWhvdXNlLXVudGlsLWFtb3VudF9cIiArIHgpKS52YWx1ZSA9ICh0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XSA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiB0aGlzLnJvdXRlLmxvYWRXYXJlaG91c2VVbnRpbEFtb3VudFt4XS50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgLy91aS10YWJzLWFjdGl2ZVxyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiBcIjU4M3B4XCIsXHJcbiAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjp7bXk6XCJsZWZ0IHRvcFwiLGF0OlwicmlnaHQgdG9wXCIsb2Y6JChkb2N1bWVudCl9ICxcclxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuY3NzKHsgcG9zaXRpb246IFwiZml4ZWRcIiB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcclxuICAgIH1cclxufVxyXG4iXX0=