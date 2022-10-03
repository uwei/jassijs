import { City } from "game/city";
import { allProducts, Product } from "game/product";
var css = `
    .citydialog >*{
        font-size:10px;
    }
    .ui-dialog-title{
        font-size:10px;
    }
    .ui-dialog-titlebar{
        height:10px;
    }
`;
//@ts-ignore
window.city = function () {
    return CityDialog.getInstance().city;
}
export class CityDialog {
    dom: HTMLDivElement;
    city: City;
    hasPaused = false;
    public static instance;
    constructor() {
        this.create();
    }
    static getInstance(): CityDialog {
        if (CityDialog.instance === undefined)
            CityDialog.instance = new CityDialog();
        return CityDialog.instance;
    }
    private createStyle() {
        var style = document.createElement('style');
        style.id = "citydialogcss";
        style.type = 'text/css';
        style.innerHTML = css;

        var old = document.getElementById("citydialogcss");
        if (old) {
            old.parentNode.removeChild(old);
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    private calcPrice(el: HTMLInputElement, val: number) {
        var id = Number(el.id.split("_")[1]);
        var isProducedHere = false;
        for (var x = 0; x < this.city.companies.length; x++) {
            if (this.city.companies[x].productid === id)
                isProducedHere = true;
        }
        var prod = allProducts[id].priceSelling;

        if (el.id.indexOf("sell") > -1)
            val = -val;
        var ret = allProducts[id].calcPrice(this.city.people, this.city.market[id] - val, isProducedHere);
        var color = "green";
        if (ret > ((0.0 + prod) * 2 / 3))
            color = "LightGreen";
        if (ret > ((0.0 + prod) * 2.5 / 3))
            color = "white";
        if (ret > ((0.0 + prod) * 1))
            color = "LightPink";
        if (ret > ((0.0 + prod) * 4 / 3))
            color = "red";
        (<HTMLElement>el.parentElement.parentElement.children[3]).style.background = color;
        return ret;
    }
    private create() {
        //template for code reloading
        var sdom = `
          <div id="citydialog" class="citydialog">
            <div></div>
           </div>
        `;
        this.dom = <any>document.createRange().createContextualFragment(sdom).children[0];
        var old = document.getElementById("citydialog");
        if (old) {
            old.parentNode.removeChild(old);
        }
        this.createStyle();

        var products = allProducts;
        var _this = this;
        var sdom = `
          <div>
          <div>
            <input id="citydialog-prev" type="button" value="<"/>"
            <input id="citydialog-next" type="button" value=">"/>"
          </div>
            <div id="citydialog-tabs">
                <ul>
                    <li><a href="#citydialog-market" id="citydialog-market-tab">Market</a></li>
                    <li><a href="#citydialog-buildings">Buildings</a></li>
                    <li><a href="#citydialog-warehouse">Warehouse</a></li>
                </ul>
                <div id="citydialog-market">
                    <table id="citydialog-market-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>icon</th>
                            <th>name</th>
                            <th>market</th>
                            <th>price</th>
                            <th>buy</th>
                            <th> <select id="citydialog-market-table-partner">
                                    <option value="placeholder">placeholder</option>
                                </select>
                            </th>
                            <th>sell</th>
                            
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
                    ret = ret + "<td>0</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + '<td>' +
                        '<input class="cdmslider" id="citydialog-market-buy-slider_' + x + '"' +
                        'type="range" min="0" max="10" step="1.0" value="0"' +
                        'style="overflow: hidden;width: 50%;height: 70%;"' +
                        //'oninput="this.nextElementSibling.innerHTML = this.value;' +
                        //'this.parentNode.parentNode.children[3].innerHTML=1;' +
                        '">' + "<span>0</span></td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + '<td>' +
                        '<input class="cdmslider" id="citydialog-market-sell-slider_' + x + '"' +
                        'type="range" min="0" max="500" step="1.0" value="0"' +
                        'style="overflow: hidden;width: 50%;height: 70%;"' +
                        //'oninput="this.nextElementSibling.innerHTML = this.value;' +
                        // 'this.parentNode.parentNode.children[3].innerHTML=value;' +
                        '">' + "<span>0</span></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>
                </div>
                <div id="citydialog-buildings">
                     <table id="citydialog-buildings-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>produce</th>
                            <th> </th>
                            <th>buildings</th>
                            <th>jobs</th>
                            <th>costs</th>
                            <th>needs</th>
                            <th>new building</th>
                            <th>actions</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < 5; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>
                </div>
                <div id="citydialog-warehouse">
                    <p>Warehouse1.</p>sad asd sd as 
                </div>
            </div>
          </div>
        `;
        var newdom = <any>document.createRange().createContextualFragment(sdom).children[0];
        this.dom.removeChild(this.dom.children[0]);
        this.dom.appendChild(newdom);
        $("#citydialog-tabs").tabs({
            //collapsible: true
        });
        setTimeout(() => {
            $("#citydialog-tabs").tabs({
                //collapsible: true
            });
        }, 100);
        document.body.appendChild(this.dom);

        //        document.getElementById("citydialog-prev")
        setTimeout(() => {
            document.getElementById("citydialog-next").addEventListener("click", (ev) => {
                var pos = _this.city.world.cities.indexOf(_this.city);
                pos++;
                if (pos >= _this.city.world.cities.length)
                    pos = 0;
                _this.city = _this.city.world.cities[pos];
                _this.update(true);
            });
            document.getElementById("citydialog-prev").addEventListener("click", (ev) => {
                var pos = _this.city.world.cities.indexOf(_this.city);
                pos--;
                if (pos === -1)
                    pos = _this.city.world.cities.length - 1;
                _this.city = _this.city.world.cities[pos];
                _this.update(true);
            });

            for (var x = 0; x < allProducts.length; x++) {
                document.getElementById("citydialog-market-buy-slider_" + x).addEventListener("input", (e) => {
                    var t = <HTMLInputElement>e.target;
                    var price = _this.calcPrice(t, Number(t.value));
                    t.nextElementSibling.innerHTML = "" + t.value + " " + Number(t.value) * price;

                    t.parentNode.parentNode.children[3].innerHTML = "" + price;
                });
                document.getElementById("citydialog-market-sell-slider_" + x).addEventListener("input", (e) => {
                    var t = <HTMLInputElement>e.target;
                    var price = _this.calcPrice(t, -Number(t.value));
                    t.nextElementSibling.innerHTML = "" + t.value + " " + Number(t.value) * price;

                    t.parentNode.parentNode.children[3].innerHTML = "" + price;
                });
                var inedit = false;
                document.getElementById("citydialog-market-buy-slider_" + x).addEventListener("change", (e) => {
                    if (inedit)
                        return;
                    var t = <HTMLInputElement>e.target;
                    inedit = true;
                    var id = Number(t.id.split("_")[1]);
                    _this.sellOrBuy(id, Number(t.value), _this.calcPrice(t, Number(t.value)), _this.getStore());
                    t.nextElementSibling.innerHTML = "0";
                    t.value = "0";
                    inedit = false;

                });
                document.getElementById("citydialog-market-sell-slider_" + x).addEventListener("change", (e) => {
                    if (inedit)
                        return;
                    var t = <HTMLInputElement>e.target;
                    inedit = true;
                    var id = Number(t.id.split("_")[1]);
                    _this.sellOrBuy(id, -Number(t.value), _this.calcPrice(t, Number(t.value)), _this.getStore());
                    t.nextElementSibling.innerHTML = "0";
                    t.value = "0";
                    inedit = false;

                });
            }
        }, 500);
        //document.createElement("span");
    }
    sellOrBuy(productid, amount: number, price: number, store: number[]) {
        this.city.world.game.money += -amount * price;

        this.city.market[productid] -= amount;
        store[productid] += amount;

        this.update(true);
        this.city.world.game.update();
    }
    getStore() {
        var select: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-partner");
        var val = select.value;
        if (val) {
            for (var x = 0; x < this.city.world.airplanes.length; x++) {
                if (val === this.city.world.airplanes[x].name)
                    return this.city.world.airplanes[x].products;
            }
        }
        return undefined;
    }
    update(force = false) {

        if (!this.city)
            return;
        try {
            if (!$(this.dom).dialog('isOpen')) {
                return;
            }
        } catch {
            return;
        }
        //pause game while trading
        if (!force) {
            if (document.getElementById("citydialog-market-tab")?.parentElement?.classList?.contains("ui-tabs-active")) {
                if (!this.city.world.game.isPaused()) {
                    this.hasPaused = true;
                    this.city.world.game.pause();
                }
                return;//no update because of slider
            } else {
                if (this.hasPaused) {
                    this.city.world.game.resume();
                }
            }
        }

        var select: HTMLSelectElement = <any>document.getElementById("citydialog-market-table-partner");
        select.innerHTML = "";
        for (var x = 0; x < this.city.airplanesInCity.length; x++) {
            var opt: HTMLOptionElement = document.createElement("option");
            opt.value = this.city.airplanesInCity[x].name;
            opt.text = opt.value;
            select.appendChild(opt);
        }

        this.updateTitle();
        /*
                            <th>icon</th>
                            <th>name</th>
                            <th>market</th>
                            <th>buy</th>
                            <th>airplane1</th>
                            <th>sell</th>
                            <th>price</th>
        */
        var store = this.getStore();

        for (var x = 0; x < allProducts.length; x++) {
            var table = document.getElementById("citydialog-market-table");
            var tr = table.children[0].children[x + 1];
            tr.children[2].innerHTML = this.city.market[x].toString();
            tr.children[3].innerHTML = this.calcPrice(<any>tr.children[4].children[0], 0).toString();
            (<HTMLInputElement>tr.children[4].children[0]).max = this.city.market[x].toString();
            if (store) {
                (<HTMLInputElement>tr.children[4].children[0]).max = this.city.market[x].toString();
                tr.children[5].innerHTML = store[x].toString();
                (<HTMLInputElement>tr.children[6].children[0]).max = store[x].toString();
            } else {
                (<HTMLInputElement>tr.children[4].children[0]).max = "0";
                (<HTMLInputElement>tr.children[6].children[0]).max = "0";
            }
            /*   ret = ret + "<td>" + _this.city.market[x] + "</td>";
               ret = ret + '<td>' +
                   '<input class="cdmslider" id="citydialog-market-slider${x}"' +
                   'type="range" min="0" max="29000" step="1.0" value="0"' +
                   'style="overflow: hidden;width: 50%;height: 70%;"' +
                   'oninput="this.nextElementSibling.innerHTML = this.value;' +
                   'this.parentNode.parentNode.children[4].innerHTML=value;' +
                   '">' + "<span>0</span></td>";
               ret = ret + "<td>" + 0 + "</td>";
               ret = ret + '<td>' +
                   '<input class="cdmslider" id="citydialog-market-slider${x}"' +
                   'type="range" min="0" max="29000" step="1.0" value="0"' +
                   'style="overflow: hidden;width: 50%;height: 70%;"' +
                   'oninput="this.nextElementSibling.innerHTML = this.value;' +
                   'this.parentNode.parentNode.children[4].innerHTML=value;' +
                   '">' + "<span>0</span></td>";
               ret = ret + "<td>100</td>";
               ret = ret + "<tr>";
           }*/
        }

        /*
                            <th>icon</th>
                            <th>name</th>
                            <th>buildings</th>
                            <th>jobs</th>
                            <th>cost per day<th>
                            <th>produce</th>
                            <th>needs1</th>
                            <th>needs2</th>
                            <th>new building</th>
                            <th>create</th>
                            <th>destroy</th>
        */
        var companies = this.city.companies;
        var all = allProducts;
        for (var x = 0; x < companies.length; x++) {
            var table = document.getElementById("citydialog-buildings-table");
            var tr = table.children[0].children[x + 1];
            var product = all[companies[x].productid];
            var produce = companies[x].getDailyProduce();
            tr.children[0].innerHTML = produce + " " + product.getIcon();
            tr.children[1].innerHTML = product.name + "</td>";
            tr.children[2].innerHTML = companies[x].buildings + "</td>";
            tr.children[3].innerHTML = companies[x].workers + "/" + companies[x].getMaxWorkers() + "</td>";
            tr.children[4].innerHTML = "1000" + "</td>";
            var needs = "";
            if (product.input1 !== undefined)
                needs = "" + companies[x].getDailyInput1() + " " + all[product.input1].getIcon() + " ";
            if (product.input2 !== undefined)
                needs = needs + "" + companies[x].getDailyInput2() + " " + all[product.input2].getIcon();
            tr.children[5].innerHTML = needs + "</td>";
            tr.children[6].innerHTML = '<input type="button" value="+">' + "</td>" + '<input type="button" value="-">' + "</td>";

        }
        return;
    }
    updateTitle() {
        var sicon = '';
        if ($(this.dom).parent().find('.ui-dialog-title').length > 0)
            $(this.dom).parent().find('.ui-dialog-title')[0].innerHTML = '<img style="float: right" id="citydialog-icon" src="' + this.city.icon + '"  height="15"></img> ' + this.city.name + " " + this.city.people;
    }
    show() {
        var _this = this;
        this.update();

        $(this.dom).dialog({
            width: "450px",
            open: function (event, ui) {
                _this.update(true);
            },
            close: function (ev, ev2) {
               if (_this.hasPaused) {
                    _this.city.world.game.resume();
                }
            }
        });

    }

}