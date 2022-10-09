
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
                    ret = ret + '<td>' +'<input type="number" min="0" class="market-max-amount" id="market-max-amount_' + x + '"' +
                        'style="width: 50px;"' +'"></td>';
                    ret = ret + '<td>' +'<input type="number" min="0" class="market-min-price" id="market-min-price_' + x + '"' +
                        'style="width: 50px;"' +'"></td>';
                    ret = ret + '<td>' +'<input type="number" min="0" class="warehouse-amount" id="warehouse-amount_' + x + '"' +
                        'style="width: 50px;"' +'"></td>';
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
                     ret = ret + '<td>' +'<input type="number" min="0" class="market-max-amount" id="market-max-amount_' + x + '"' +
                        'style="width: 50px;"' +'"></td>';
                    ret = ret + '<td>' +'<input type="number" min="0" class="market-max-price" id="market-max-price_' + x + '"' +
                        'style="width: 50px;"' +'"></td>';
                    ret = ret + '<td>' +'<input type="number" min="0" class="warehouse-amount" id="warehouse-amount_' + x + '"' +
                        'style="width: 50px;"' +'"></td>';
                    ret = ret + '<td>' +'<input type="number" min="0" class="warehouse-until-amount" id="warehouse-until-amount_' + x + '"' +
                        'style="width: 50px;"' +'"></td>';
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
       var select:HTMLSelectElement=<any>document.getElementById("route-select");
       select.innerHTML="";
       for(var x=0;x<this.airplane.route.length;x++){
            var opt: HTMLOptionElement = document.createElement("option");
           var city=this.airplane.world.cities[ this.airplane.route[x].cityid];
            opt.value = city.name;
            opt.text = city.name;
            select.appendChild(opt);
           
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