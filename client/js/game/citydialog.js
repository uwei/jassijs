define(["require", "exports", "game/product"], function (require, exports, product_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CityDialog = void 0;
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
    };
    class CityDialog {
        constructor() {
            this.hasPaused = false;
            this.create();
        }
        static getInstance() {
            if (CityDialog.instance === undefined)
                CityDialog.instance = new CityDialog();
            return CityDialog.instance;
        }
        createStyle() {
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
        calcPrice(el, val) {
            var id = Number(el.id.split("_")[1]);
            var isProducedHere = false;
            for (var x = 0; x < this.city.companies.length; x++) {
                if (this.city.companies[x].productid === id)
                    isProducedHere = true;
            }
            var prod = product_1.allProducts[id].priceSelling;
            if (el.id.indexOf("sell") > -1)
                val = -val;
            var ret = product_1.allProducts[id].calcPrice(this.city.people, this.city.market[id] - val, isProducedHere);
            var color = "green";
            if (ret > ((0.0 + prod) * 2 / 3))
                color = "LightGreen";
            if (ret > ((0.0 + prod) * 2.5 / 3))
                color = "white";
            if (ret > ((0.0 + prod) * 1))
                color = "LightPink";
            if (ret > ((0.0 + prod) * 4 / 3))
                color = "red";
            el.parentElement.parentElement.children[3].style.background = color;
            return ret;
        }
        create() {
            //template for code reloading
            var sdom = `
          <div id="citydialog" class="citydialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
            var old = document.getElementById("citydialog");
            if (old) {
                old.parentNode.removeChild(old);
            }
            this.createStyle();
            var products = product_1.allProducts;
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
                function price(id, change) {
                    console.log(id + " " + change);
                }
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + product_1.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + product_1.allProducts[x].name + "</td>";
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
            var newdom = document.createRange().createContextualFragment(sdom).children[0];
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
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    document.getElementById("citydialog-market-buy-slider_" + x).addEventListener("input", (e) => {
                        var t = e.target;
                        var price = _this.calcPrice(t, Number(t.value));
                        t.nextElementSibling.innerHTML = "" + t.value + " " + Number(t.value) * price;
                        t.parentNode.parentNode.children[3].innerHTML = "" + price;
                    });
                    document.getElementById("citydialog-market-sell-slider_" + x).addEventListener("input", (e) => {
                        var t = e.target;
                        var price = _this.calcPrice(t, Number(t.value));
                        t.nextElementSibling.innerHTML = "" + t.value + " " + Number(t.value) * price;
                        t.parentNode.parentNode.children[3].innerHTML = "" + price;
                    });
                    var inedit = false;
                    document.getElementById("citydialog-market-buy-slider_" + x).addEventListener("change", (e) => {
                        if (inedit)
                            return;
                        var t = e.target;
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
                        var t = e.target;
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
        sellOrBuy(productid, amount, price, store) {
            this.city.world.game.money += -amount * price;
            this.city.market[productid] -= amount;
            store[productid] += amount;
            this.update(true);
            this.city.world.game.update();
        }
        getStore() {
            var select = document.getElementById("citydialog-market-table-partner");
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
            var _a, _b, _c;
            if (!this.city)
                return;
            try {
                if (!$(this.dom).dialog('isOpen')) {
                    return;
                }
            }
            catch (_d) {
                return;
            }
            //pause game while trading
            if (!force) {
                if ((_c = (_b = (_a = document.getElementById("citydialog-market-tab")) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.classList) === null || _c === void 0 ? void 0 : _c.contains("ui-tabs-active")) {
                    if (!this.city.world.game.isPaused()) {
                        this.hasPaused = true;
                        this.city.world.game.pause();
                    }
                    return; //no update because of slider
                }
                else {
                    if (this.hasPaused) {
                        this.city.world.game.resume();
                    }
                }
            }
            var select = document.getElementById("citydialog-market-table-partner");
            select.innerHTML = "";
            for (var x = 0; x < this.city.airplanesInCity.length; x++) {
                var opt = document.createElement("option");
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
            for (var x = 0; x < product_1.allProducts.length; x++) {
                var table = document.getElementById("citydialog-market-table");
                var tr = table.children[0].children[x + 1];
                tr.children[2].innerHTML = this.city.market[x].toString();
                tr.children[3].innerHTML = this.calcPrice(tr.children[4].children[0], 0).toString();
                tr.children[4].children[0].max = this.city.market[x].toString();
                if (store) {
                    tr.children[4].children[0].max = this.city.market[x].toString();
                    tr.children[5].innerHTML = store[x].toString();
                    tr.children[6].children[0].max = store[x].toString();
                }
                else {
                    tr.children[4].children[0].max = "0";
                    tr.children[6].children[0].max = "0";
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
            var all = product_1.allProducts;
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
    exports.CityDialog = CityDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBRUEsSUFBSSxHQUFHLEdBQUc7Ozs7Ozs7Ozs7Q0FVVCxDQUFDO0lBQ0YsWUFBWTtJQUNaLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDVixPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDekMsQ0FBQyxDQUFBO0lBQ0QsTUFBYSxVQUFVO1FBS25CO1lBRkEsY0FBUyxHQUFHLEtBQUssQ0FBQztZQUdkLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDakMsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQzNDLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUMvQixDQUFDO1FBQ08sV0FBVztZQUNmLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxlQUFlLENBQUM7WUFDM0IsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7WUFDeEIsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFFdEIsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNuRCxJQUFJLEdBQUcsRUFBRTtnQkFDTCxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQztZQUNELFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUNPLFNBQVMsQ0FB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LE9BQU87UUFDWCxDQUFDO1FBQ0QsV0FBVztZQUNQLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDeEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsc0RBQXNELEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2xOLENBQUM7UUFDRCxJQUFJO1lBQ0EsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVkLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUNmLEtBQUssRUFBRSxPQUFPO2dCQUNkLElBQUksRUFBRSxVQUFVLEtBQUssRUFBRSxFQUFFO29CQUNyQixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixDQUFDO2dCQUNELEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxHQUFHO29CQUNyQixJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7d0JBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDbEM7Z0JBQ0wsQ0FBQzthQUNKLENBQUMsQ0FBQztRQUVQLENBQUM7S0FFSjtJQTlZRCxnQ0E4WUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaXR5IH0gZnJvbSBcImdhbWUvY2l0eVwiO1xyXG5pbXBvcnQgeyBhbGxQcm9kdWN0cywgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcclxudmFyIGNzcyA9IGBcclxuICAgIC5jaXR5ZGlhbG9nID4qe1xyXG4gICAgICAgIGZvbnQtc2l6ZToxMHB4O1xyXG4gICAgfVxyXG4gICAgLnVpLWRpYWxvZy10aXRsZXtcclxuICAgICAgICBmb250LXNpemU6MTBweDtcclxuICAgIH1cclxuICAgIC51aS1kaWFsb2ctdGl0bGViYXJ7XHJcbiAgICAgICAgaGVpZ2h0OjEwcHg7XHJcbiAgICB9XHJcbmA7XHJcbi8vQHRzLWlnbm9yZVxyXG53aW5kb3cuY2l0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBDaXR5RGlhbG9nLmdldEluc3RhbmNlKCkuY2l0eTtcclxufVxyXG5leHBvcnQgY2xhc3MgQ2l0eURpYWxvZyB7XHJcbiAgICBkb206IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY2l0eTogQ2l0eTtcclxuICAgIGhhc1BhdXNlZCA9IGZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQ2l0eURpYWxvZyB7XHJcbiAgICAgICAgaWYgKENpdHlEaWFsb2cuaW5zdGFuY2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgQ2l0eURpYWxvZy5pbnN0YW5jZSA9IG5ldyBDaXR5RGlhbG9nKCk7XHJcbiAgICAgICAgcmV0dXJuIENpdHlEaWFsb2cuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZVN0eWxlKCkge1xyXG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcbiAgICAgICAgc3R5bGUuaWQgPSBcImNpdHlkaWFsb2djc3NcIjtcclxuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XHJcblxyXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2djc3NcIik7XHJcbiAgICAgICAgaWYgKG9sZCkge1xyXG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHN0eWxlKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2FsY1ByaWNlKGVsOiBIVE1MSW5wdXRFbGVtZW50LCB2YWw6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBpZCA9IE51bWJlcihlbC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgIHZhciBpc1Byb2R1Y2VkSGVyZSA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXR5LmNvbXBhbmllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaXR5LmNvbXBhbmllc1t4XS5wcm9kdWN0aWQgPT09IGlkKVxyXG4gICAgICAgICAgICAgICAgaXNQcm9kdWNlZEhlcmUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvZCA9IGFsbFByb2R1Y3RzW2lkXS5wcmljZVNlbGxpbmc7XHJcblxyXG4gICAgICAgIGlmIChlbC5pZC5pbmRleE9mKFwic2VsbFwiKSA+IC0xKVxyXG4gICAgICAgICAgICB2YWwgPSAtdmFsO1xyXG4gICAgICAgIHZhciByZXQgPSBhbGxQcm9kdWN0c1tpZF0uY2FsY1ByaWNlKHRoaXMuY2l0eS5wZW9wbGUsIHRoaXMuY2l0eS5tYXJrZXRbaWRdIC0gdmFsLCBpc1Byb2R1Y2VkSGVyZSk7XHJcbiAgICAgICAgdmFyIGNvbG9yID0gXCJncmVlblwiO1xyXG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogMiAvIDMpKVxyXG4gICAgICAgICAgICBjb2xvciA9IFwiTGlnaHRHcmVlblwiO1xyXG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogMi41IC8gMykpXHJcbiAgICAgICAgICAgIGNvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgIGlmIChyZXQgPiAoKDAuMCArIHByb2QpICogMSkpXHJcbiAgICAgICAgICAgIGNvbG9yID0gXCJMaWdodFBpbmtcIjtcclxuICAgICAgICBpZiAocmV0ID4gKCgwLjAgKyBwcm9kKSAqIDQgLyAzKSlcclxuICAgICAgICAgICAgY29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgICg8SFRNTEVsZW1lbnQ+ZWwucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzNdKS5zdHlsZS5iYWNrZ3JvdW5kID0gY29sb3I7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xyXG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXHJcbiAgICAgICAgdmFyIHNkb20gPSBgXHJcbiAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZ1wiIGNsYXNzPVwiY2l0eWRpYWxvZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxyXG4gICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhpcy5kb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2dcIik7XHJcbiAgICAgICAgaWYgKG9sZCkge1xyXG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZVN0eWxlKCk7XHJcblxyXG4gICAgICAgIHZhciBwcm9kdWN0cyA9IGFsbFByb2R1Y3RzO1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNkb20gPSBgXHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGlucHV0IGlkPVwiY2l0eWRpYWxvZy1wcmV2XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPFwiLz5cIlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJjaXR5ZGlhbG9nLW5leHRcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI+XCIvPlwiXHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctdGFic1wiPlxyXG4gICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2NpdHlkaWFsb2ctbWFya2V0XCIgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC10YWJcIj5NYXJrZXQ8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLWJ1aWxkaW5nc1wiPkJ1aWxkaW5nczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2NpdHlkaWFsb2ctd2FyZWhvdXNlXCI+V2FyZWhvdXNlPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctbWFya2V0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+aWNvbjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmFtZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bWFya2V0PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5wcmljZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+YnV5PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4gPHNlbGVjdCBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXRhYmxlLXBhcnRuZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBsYWNlaG9sZGVyXCI+cGxhY2Vob2xkZXI8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+c2VsbDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByaWNlKGlkOiBzdHJpbmcsIGNoYW5nZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaWQgKyBcIiBcIiArIGNoYW5nZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5uYW1lICsgXCI8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgY2xhc3M9XCJjZG1zbGlkZXJcIiBpZD1cImNpdHlkaWFsb2ctbWFya2V0LWJ1eS1zbGlkZXJfJyArIHggKyAnXCInICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCIxMFwiIHN0ZXA9XCIxLjBcIiB2YWx1ZT1cIjBcIicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3R5bGU9XCJvdmVyZmxvdzogaGlkZGVuO3dpZHRoOiA1MCU7aGVpZ2h0OiA3MCU7XCInICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8nb25pbnB1dD1cInRoaXMubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IHRoaXMudmFsdWU7JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJ3RoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzNdLmlubmVySFRNTD0xOycgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnXCI+JyArIFwiPHNwYW4+MDwvc3Bhbj48L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgY2xhc3M9XCJjZG1zbGlkZXJcIiBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXNlbGwtc2xpZGVyXycgKyB4ICsgJ1wiJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlPVwicmFuZ2VcIiBtaW49XCIwXCIgbWF4PVwiNTAwXCIgc3RlcD1cIjEuMFwiIHZhbHVlPVwiMFwiJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIm92ZXJmbG93OiBoaWRkZW47d2lkdGg6IDUwJTtoZWlnaHQ6IDcwJTtcIicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLydvbmlucHV0PVwidGhpcy5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MID0gdGhpcy52YWx1ZTsnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gJ3RoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzNdLmlubmVySFRNTD12YWx1ZTsnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPicgKyBcIjxzcGFuPjA8L3NwYW4+PC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPC90cj5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH0pKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctYnVpbGRpbmdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBpZD1cImNpdHlkaWFsb2ctYnVpbGRpbmdzLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPnByb2R1Y2U8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmJ1aWxkaW5nczwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+am9iczwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+Y29zdHM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPm5lZWRzPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5uZXcgYnVpbGRpbmc8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmFjdGlvbnM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCA1OyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+PC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+PC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfSkoKX1cclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy13YXJlaG91c2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8cD5XYXJlaG91c2UxLjwvcD5zYWQgYXNkIHNkIGFzIFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgICAgICB2YXIgbmV3ZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcclxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQobmV3ZG9tKTtcclxuICAgICAgICAkKFwiI2NpdHlkaWFsb2ctdGFic1wiKS50YWJzKHtcclxuICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2NpdHlkaWFsb2ctdGFic1wiKS50YWJzKHtcclxuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcclxuXHJcbiAgICAgICAgLy8gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1uZXh0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBfdGhpcy5jaXR5LndvcmxkLmNpdGllcy5pbmRleE9mKF90aGlzLmNpdHkpO1xyXG4gICAgICAgICAgICAgICAgcG9zKys7XHJcbiAgICAgICAgICAgICAgICBpZiAocG9zID49IF90aGlzLmNpdHkud29ybGQuY2l0aWVzLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuY2l0eSA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzW3Bvc107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXMuaW5kZXhPZihfdGhpcy5jaXR5KTtcclxuICAgICAgICAgICAgICAgIHBvcy0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA9PT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmNpdHkgPSBfdGhpcy5jaXR5LndvcmxkLmNpdGllc1twb3NdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtYnV5LXNsaWRlcl9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByaWNlID0gX3RoaXMuY2FsY1ByaWNlKHQsIE51bWJlcih0LnZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MID0gXCJcIiArIHQudmFsdWUgKyBcIiBcIiArIE51bWJlcih0LnZhbHVlKSAqIHByaWNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlblszXS5pbm5lckhUTUwgPSBcIlwiICsgcHJpY2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtc2VsbC1zbGlkZXJfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IF90aGlzLmNhbGNQcmljZSh0LCBOdW1iZXIodC52YWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IFwiXCIgKyB0LnZhbHVlICsgXCIgXCIgKyBOdW1iZXIodC52YWx1ZSkgKiBwcmljZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdC5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bM10uaW5uZXJIVE1MID0gXCJcIiArIHByaWNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5lZGl0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbWFya2V0LWJ1eS1zbGlkZXJfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZWRpdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5lZGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIodC5pZC5zcGxpdChcIl9cIilbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNlbGxPckJ1eShpZCwgTnVtYmVyKHQudmFsdWUpLCBfdGhpcy5jYWxjUHJpY2UodCwgTnVtYmVyKHQudmFsdWUpKSwgX3RoaXMuZ2V0U3RvcmUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MID0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdC52YWx1ZSA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZWRpdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC1zZWxsLXNsaWRlcl9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5lZGl0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICBpbmVkaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcih0LmlkLnNwbGl0KFwiX1wiKVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2VsbE9yQnV5KGlkLCAtTnVtYmVyKHQudmFsdWUpLCBfdGhpcy5jYWxjUHJpY2UodCwgTnVtYmVyKHQudmFsdWUpKSwgX3RoaXMuZ2V0U3RvcmUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MID0gXCIwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdC52YWx1ZSA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZWRpdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAvL2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgfVxyXG4gICAgc2VsbE9yQnV5KHByb2R1Y3RpZCwgYW1vdW50OiBudW1iZXIsIHByaWNlOiBudW1iZXIsIHN0b3JlOiBudW1iZXJbXSkge1xyXG4gICAgICAgIHRoaXMuY2l0eS53b3JsZC5nYW1lLm1vbmV5ICs9IC1hbW91bnQgKiBwcmljZTtcclxuXHJcbiAgICAgICAgdGhpcy5jaXR5Lm1hcmtldFtwcm9kdWN0aWRdIC09IGFtb3VudDtcclxuICAgICAgICBzdG9yZVtwcm9kdWN0aWRdICs9IGFtb3VudDtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jaXR5LndvcmxkLmdhbWUudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXRTdG9yZSgpIHtcclxuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS1wYXJ0bmVyXCIpO1xyXG4gICAgICAgIHZhciB2YWwgPSBzZWxlY3QudmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY2l0eS53b3JsZC5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWwgPT09IHRoaXMuY2l0eS53b3JsZC5haXJwbGFuZXNbeF0ubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaXR5LndvcmxkLmFpcnBsYW5lc1t4XS5wcm9kdWN0cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGZvcmNlID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmNpdHkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoISQodGhpcy5kb20pLmRpYWxvZygnaXNPcGVuJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vcGF1c2UgZ2FtZSB3aGlsZSB0cmFkaW5nXHJcbiAgICAgICAgaWYgKCFmb3JjZSkge1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNpdHkud29ybGQuZ2FtZS5pc1BhdXNlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNQYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eS53b3JsZC5nYW1lLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47Ly9ubyB1cGRhdGUgYmVjYXVzZSBvZiBzbGlkZXJcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc1BhdXNlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eS53b3JsZC5nYW1lLnJlc3VtZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJsZS1wYXJ0bmVyXCIpO1xyXG4gICAgICAgIHNlbGVjdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jaXR5LmFpcnBsYW5lc0luQ2l0eS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IHRoaXMuY2l0eS5haXJwbGFuZXNJbkNpdHlbeF0ubmFtZTtcclxuICAgICAgICAgICAgb3B0LnRleHQgPSBvcHQudmFsdWU7XHJcbiAgICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+aWNvbjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmFtZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bWFya2V0PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5idXk8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmFpcnBsYW5lMTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+c2VsbDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+cHJpY2U8L3RoPlxyXG4gICAgICAgICovXHJcbiAgICAgICAgdmFyIHN0b3JlID0gdGhpcy5nZXRTdG9yZSgpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1tYXJrZXQtdGFibGVcIik7XHJcbiAgICAgICAgICAgIHZhciB0ciA9IHRhYmxlLmNoaWxkcmVuWzBdLmNoaWxkcmVuW3ggKyAxXTtcclxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bMl0uaW5uZXJIVE1MID0gdGhpcy5jaXR5Lm1hcmtldFt4XS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB0ci5jaGlsZHJlblszXS5pbm5lckhUTUwgPSB0aGlzLmNhbGNQcmljZSg8YW55PnRyLmNoaWxkcmVuWzRdLmNoaWxkcmVuWzBdLCAwKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0pLm1heCA9IHRoaXMuY2l0eS5tYXJrZXRbeF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKHN0b3JlKSB7XHJcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0pLm1heCA9IHRoaXMuY2l0eS5tYXJrZXRbeF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzVdLmlubmVySFRNTCA9IHN0b3JlW3hdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNl0uY2hpbGRyZW5bMF0pLm1heCA9IHN0b3JlW3hdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dHIuY2hpbGRyZW5bNF0uY2hpbGRyZW5bMF0pLm1heCA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRyLmNoaWxkcmVuWzZdLmNoaWxkcmVuWzBdKS5tYXggPSBcIjBcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKiAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgX3RoaXMuY2l0eS5tYXJrZXRbeF0gKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8dGQ+JyArXHJcbiAgICAgICAgICAgICAgICAgICAnPGlucHV0IGNsYXNzPVwiY2Rtc2xpZGVyXCIgaWQ9XCJjaXR5ZGlhbG9nLW1hcmtldC1zbGlkZXIke3h9XCInICtcclxuICAgICAgICAgICAgICAgICAgICd0eXBlPVwicmFuZ2VcIiBtaW49XCIwXCIgbWF4PVwiMjkwMDBcIiBzdGVwPVwiMS4wXCIgdmFsdWU9XCIwXCInICtcclxuICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIm92ZXJmbG93OiBoaWRkZW47d2lkdGg6IDUwJTtoZWlnaHQ6IDcwJTtcIicgK1xyXG4gICAgICAgICAgICAgICAgICAgJ29uaW5wdXQ9XCJ0aGlzLm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUwgPSB0aGlzLnZhbHVlOycgK1xyXG4gICAgICAgICAgICAgICAgICAgJ3RoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzRdLmlubmVySFRNTD12YWx1ZTsnICtcclxuICAgICAgICAgICAgICAgICAgICdcIj4nICsgXCI8c3Bhbj4wPC9zcGFuPjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgMCArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzx0ZD4nICtcclxuICAgICAgICAgICAgICAgICAgICc8aW5wdXQgY2xhc3M9XCJjZG1zbGlkZXJcIiBpZD1cImNpdHlkaWFsb2ctbWFya2V0LXNsaWRlciR7eH1cIicgK1xyXG4gICAgICAgICAgICAgICAgICAgJ3R5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCIyOTAwMFwiIHN0ZXA9XCIxLjBcIiB2YWx1ZT1cIjBcIicgK1xyXG4gICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwib3ZlcmZsb3c6IGhpZGRlbjt3aWR0aDogNTAlO2hlaWdodDogNzAlO1wiJyArXHJcbiAgICAgICAgICAgICAgICAgICAnb25pbnB1dD1cInRoaXMubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IHRoaXMudmFsdWU7JyArXHJcbiAgICAgICAgICAgICAgICAgICAndGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bNF0uaW5uZXJIVE1MPXZhbHVlOycgK1xyXG4gICAgICAgICAgICAgICAgICAgJ1wiPicgKyBcIjxzcGFuPjA8L3NwYW4+PC90ZD5cIjtcclxuICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MTAwPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XHJcbiAgICAgICAgICAgfSovXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmljb248L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPm5hbWU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmJ1aWxkaW5nczwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+am9iczwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+Y29zdCBwZXIgZGF5PHRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPnByb2R1Y2U8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPm5lZWRzMTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmVlZHMyPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5uZXcgYnVpbGRpbmc8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmNyZWF0ZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+ZGVzdHJveTwvdGg+XHJcbiAgICAgICAgKi9cclxuICAgICAgICB2YXIgY29tcGFuaWVzID0gdGhpcy5jaXR5LmNvbXBhbmllcztcclxuICAgICAgICB2YXIgYWxsID0gYWxsUHJvZHVjdHM7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wYW5pZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLWJ1aWxkaW5ncy10YWJsZVwiKTtcclxuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xyXG4gICAgICAgICAgICB2YXIgcHJvZHVjdCA9IGFsbFtjb21wYW5pZXNbeF0ucHJvZHVjdGlkXTtcclxuICAgICAgICAgICAgdmFyIHByb2R1Y2UgPSBjb21wYW5pZXNbeF0uZ2V0RGFpbHlQcm9kdWNlKCk7XHJcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IHByb2R1Y2UgKyBcIiBcIiArIHByb2R1Y3QuZ2V0SWNvbigpO1xyXG4gICAgICAgICAgICB0ci5jaGlsZHJlblsxXS5pbm5lckhUTUwgPSBwcm9kdWN0Lm5hbWUgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzJdLmlubmVySFRNTCA9IGNvbXBhbmllc1t4XS5idWlsZGluZ3MgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzNdLmlubmVySFRNTCA9IGNvbXBhbmllc1t4XS53b3JrZXJzICsgXCIvXCIgKyBjb21wYW5pZXNbeF0uZ2V0TWF4V29ya2VycygpICsgXCI8L3RkPlwiO1xyXG4gICAgICAgICAgICB0ci5jaGlsZHJlbls0XS5pbm5lckhUTUwgPSBcIjEwMDBcIiArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgdmFyIG5lZWRzID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHByb2R1Y3QuaW5wdXQxICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBuZWVkcyA9IFwiXCIgKyBjb21wYW5pZXNbeF0uZ2V0RGFpbHlJbnB1dDEoKSArIFwiIFwiICsgYWxsW3Byb2R1Y3QuaW5wdXQxXS5nZXRJY29uKCkgKyBcIiBcIjtcclxuICAgICAgICAgICAgaWYgKHByb2R1Y3QuaW5wdXQyICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBuZWVkcyA9IG5lZWRzICsgXCJcIiArIGNvbXBhbmllc1t4XS5nZXREYWlseUlucHV0MigpICsgXCIgXCIgKyBhbGxbcHJvZHVjdC5pbnB1dDJdLmdldEljb24oKTtcclxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bNV0uaW5uZXJIVE1MID0gbmVlZHMgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzZdLmlubmVySFRNTCA9ICc8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiK1wiPicgKyBcIjwvdGQ+XCIgKyAnPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIi1cIj4nICsgXCI8L3RkPlwiO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVGl0bGUoKSB7XHJcbiAgICAgICAgdmFyIHNpY29uID0gJyc7XHJcbiAgICAgICAgaWYgKCQodGhpcy5kb20pLnBhcmVudCgpLmZpbmQoJy51aS1kaWFsb2ctdGl0bGUnKS5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJylbMF0uaW5uZXJIVE1MID0gJzxpbWcgc3R5bGU9XCJmbG9hdDogcmlnaHRcIiBpZD1cImNpdHlkaWFsb2ctaWNvblwiIHNyYz1cIicgKyB0aGlzLmNpdHkuaWNvbiArICdcIiAgaGVpZ2h0PVwiMTVcIj48L2ltZz4gJyArIHRoaXMuY2l0eS5uYW1lICsgXCIgXCIgKyB0aGlzLmNpdHkucGVvcGxlO1xyXG4gICAgfVxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiBcIjQ1MHB4XCIsXHJcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uIChldiwgZXYyKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChfdGhpcy5oYXNQYXVzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LndvcmxkLmdhbWUucmVzdW1lKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59Il19