
import { allProducts, Product } from "game/product";
import { Airplane } from "game/airplane";
import { Icons } from "game/icons";
import { Route } from "game/route";
var css = `
  .routedialog >*{
        font-size:10px; 
    }
`;

export class RouteDialog {
    dom: HTMLDivElement;
    airplane: Airplane;
    public static instance;
    public dropCitiesEnabled = false;
    route: Route;

    constructor() {

        this.create();

    }
    static getInstance(): RouteDialog {
        if (RouteDialog.instance === undefined)
            RouteDialog.instance = new RouteDialog();
        return RouteDialog.instance;
    }

    private createStyle() {
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
        for (var x = 0; x < allProducts.length; x++) {

            document.getElementById("unload-market-max-amount_" + x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                _this.route.unloadMarketAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
            });
            document.getElementById("unload-market-min-price_" + x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                _this.route.unloadMarketPrice[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
            });
            document.getElementById("unload-warehouse-amount_" + x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                _this.route.unloadWarehouseAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
            });

            document.getElementById("load-market-max-amount_" + x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                _this.route.loadMarketAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
            });
            document.getElementById("load-market-max-price_" + x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                _this.route.loadMarketPrice[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
            });
            document.getElementById("load-warehouse-amount_" + x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                _this.route.loadWarehouseAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
            });
            document.getElementById("load-warehouse-until-amount_" + x).addEventListener("change", (e) => {
                var ctrl = (<HTMLInputElement>e.target);
                var id = parseInt(ctrl.id.split("_")[1]);
                _this.route.loadWarehouseUntilAmount[id] = ctrl.value === "" ? undefined : parseInt(ctrl.value);
            });
           

        }
         document.getElementById("route-select").addEventListener("change", (e) => {
                var val=(<HTMLInputElement> document.getElementById("route-select")).value;
                var id=parseInt(val);
                _this.route=_this.airplane.route[id];
                _this.update();
            });
    }
    private create() {
        //template for code reloading
        var sdom = `
          <div hidden id="routedialog" class="routedialog">
            <div></div>
           </div>
        `;
        this.dom = <any>document.createRange().createContextualFragment(sdom).children[0];
        var old = document.getElementById("routedialog");
        if (old) {
            old.parentNode.removeChild(old);
        }
        this.createStyle();
        var airplane = this.airplane;
        var products = allProducts;
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
                            <th>Market<br/>max amount</th>
                            <th>Market<br/>min price</th>
                            <th>Warehouse<br/>amount</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                function price(id: string, change: number) {
                    console.log(id + " " + change);
                }
                for (var x = 0; x < allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + allProducts[x].name + "</td>";
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
                            <th>Market<br/>max amount</th>
                            <th>Market<br/>max price</th>
                            <th>Warehouse<br/>amount</th>
                            <th>Warehouse<br/>until amount</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                function price(id: string, change: number) {
                    console.log(id + " " + change);
                }
                for (var x = 0; x < allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + allProducts[x].name + "</td>";
                    ret = ret + '<td>' + '<input type="number" min="0" class="load-market-max-amount" id="load-market-max-amount_' + x + '"' +
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
        var newdom = <any>document.createRange().createContextualFragment(sdom).children[0];
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
        var select: HTMLSelectElement = <any>document.getElementById("route-select");
        select.innerHTML = "";
        for (var x = 0; x < this.airplane.route.length; x++) {
            var opt: HTMLOptionElement = document.createElement("option");
            var city = this.airplane.world.cities[this.airplane.route[x].cityid];
            opt.value = ""+x;
            opt.text = city.name;
            select.appendChild(opt);
        }
        if (this.route)
            select.value = ""+this.airplane.route.indexOf(this.route);
        else {
            (<HTMLInputElement>document.getElementById("unload-market-max-amount")).value = "";
            (<HTMLInputElement>document.getElementById("unload-market-min-price")).value = "";
            (<HTMLInputElement>document.getElementById("unload-warehouse-amount")).value = "";
            (<HTMLInputElement>document.getElementById("load-market-max-amount")).value = "";
            (<HTMLInputElement>document.getElementById("load-market-max-price")).value = "";
            (<HTMLInputElement>document.getElementById("load-warehouse-amount")).value = "";
            (<HTMLInputElement>document.getElementById("load-warehouse-until-amount")).value = "";
            return;
        }

        for (var x = 0; x < allProducts.length; x++) {
            if (document.activeElement !== document.getElementById("unload-market-max-amount_"+x))
                (<HTMLInputElement>document.getElementById("unload-market-max-amount_"+x)).value = (this.route.unloadMarketAmount[x] === undefined) ? "" : this.route.unloadMarketAmount[x].toString();
            if (document.activeElement !== document.getElementById("unload-market-min-price_"+x))
                (<HTMLInputElement>document.getElementById("unload-market-min-price_"+x)).value = (this.route.unloadMarketPrice[x] === undefined) ? "" : this.route.unloadMarketPrice[x].toString();
            if (document.activeElement !== document.getElementById("unload-warehouse-amount_"+x))
                (<HTMLInputElement>document.getElementById("unload-warehouse-amount_"+x)).value = (this.route.unloadWarehouseAmount[x] === undefined) ? "" : this.route.unloadMarketAmount[x].toString();
            if (document.activeElement !== document.getElementById("load-market-max-amount_"+x))
                (<HTMLInputElement>document.getElementById("load-market-max-amount_"+x)).value = (this.route.loadMarketAmount[x] === undefined) ? "" : this.route.loadMarketAmount[x].toString();
            if (document.activeElement !== document.getElementById("load-market-max-price_"+x))
                (<HTMLInputElement>document.getElementById("load-market-max-price_"+x)).value = (this.route.loadMarketPrice[x] === undefined) ? "" : this.route.loadMarketPrice[x].toString();
            if (document.activeElement !== document.getElementById("load-warehouse-amount_"+x))
                (<HTMLInputElement>document.getElementById("load-warehouse-amount_"+x)).value = (this.route.loadWarehouseAmount[x] === undefined) ? "" : this.route.loadWarehouseAmount[x].toString();
            if (document.activeElement !== document.getElementById("load-warehouse-until-amount_"+x))
                (<HTMLInputElement>document.getElementById("load-warehouse-until-amount_"+x)).value = (this.route.loadWarehouseUntilAmount[x] === undefined) ? "" : this.route.loadWarehouseUntilAmount[x].toString();
        }

    }
    show() {
        var _this = this;
        this.dom.removeAttribute("hidden");
        this.update();
        //ui-tabs-active
        $(this.dom).dialog({
            width: "400px",
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
