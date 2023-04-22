define(["require", "exports", "game/icons"], function (require, exports, icons_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiagramDialog = void 0;
    class DiagramDialog {
        constructor() {
            this.create();
        }
        static getInstance() {
            if (DiagramDialog.instance === undefined)
                DiagramDialog.instance = new DiagramDialog();
            return DiagramDialog.instance;
        }
        bindActions() {
            var _this = this;
            document.getElementById("diagramdialog-refresh").addEventListener('click', (e) => {
                _this.update();
            });
            document.getElementById("buildWithOneClick").addEventListener('change', (e) => {
                var num = parseInt(document.getElementById("buildWithOneClick").value);
                parameter.numberBuildWithContextMenu = num;
                _this.update();
            });
            document.getElementById("buildHousesWithOneClick").addEventListener('change', (e) => {
                var num = parseInt(document.getElementById("buildHousesWithOneClick").value);
                parameter.numberBuildHousesWithContextMenu = num;
                _this.update();
            });
            for (var x = 0; x < parameter.allProducts.length; x++) {
                document.getElementById("diagram-advertise_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    var id = Number(sid.split("_")[1]);
                    var money = _this.world.cities.length * parameter.costsAdvertising;
                    _this.world.game.changeMoney(-money, "advertising");
                    _this.world.advertising[id] = new Date(_this.world.game.date.getTime() + 30 * 24 * 60 * 60 * 1000).getTime();
                    _this.update();
                });
            }
        }
        create() {
            //template for code reloading
            var sdom = `
          <div hidden id="diagramdialog" class="diagramdialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
            var old = document.getElementById("diagramdialog");
            if (old) {
                old.parentNode.removeChild(old);
            }
            var _this = this;
            var sdom = `
          <div>
            <button id="diagramdialog-refresh" title="refresh data"  class="mybutton">` + icons_1.Icons.refresh + `</button>
                            
            <div id="diagramdialog-tabs">
                <ul>
                    <li><a href="#diagramdialog-buildings" id="diagramdialog-buildings-tab" class="diagramdialog-tabs">Buildings</a></li>
                    <li><a href="#diagramdialog-balance" id="diagramdialog-balance-tab" class="diagramdialog-tabs">Balance</a></li>
                    <li><a href="#diagramdialog-settings" id="diagramdialog-settings-tab" class="diagramdialog-tabs">Settings</a></li>
                </ul>
                 <div id="diagramdialog-buildings">` + _this.createBuildings() + `
                </div> 
                <div id="diagramdialog-balance">   
                    <table id="diagramdialog-balance-table">
                    </table>         
                </div>
                 <div id="diagramdialog-settings">   
                       number build company with one click: <input id="buildWithOneClick"  value="""/><br/>
                       number build houses with one click: <input id="buildHousesWithOneClick"  value="""/>
                </div>
            </div>
           </div> 
            `;
            var newdom = document.createRange().createContextualFragment(sdom).children[0];
            this.dom.removeChild(this.dom.children[0]);
            this.dom.appendChild(newdom);
            document.body.appendChild(this.dom);
            $("#diagramdialog-tabs").tabs({
            //collapsible: true
            });
            //        document.getElementById("citydialog-prev")
            setTimeout(() => {
                $("#diagramdialog-tabs").tabs({
                //collapsible: true
                });
                _this.bindActions();
            }, 500);
            //document.createElement("span");
        }
        createBuildings() {
            return `<table id="diagramdialog-buildings-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Name</th>
                            <th> </th>
                            <th>Buildings</th>
                            <th align=right>Rate Load</th>
                            <th style="align:right">Consum.</th>
                            <th>Advertise</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + parameter.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + parameter.allProducts[x].name + "</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + '<td align=right>100,00</td>';
                    ret = ret + '<td align=right>0</td>';
                    ret = ret + "<td>" + '<button id="diagram-advertise_' + x + '" class="mybutton"></button>' + "</td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>
                    <span id="diagramdialog-buildings-last-change"></span>`;
        }
        update() {
            if (document.activeElement !== document.getElementById("buildWithOneClick"))
                document.getElementById("buildWithOneClick").value = "" + parameter.numberBuildWithContextMenu;
            if (document.activeElement !== document.getElementById("buildHousesWithOneClick"))
                document.getElementById("buildHousesWithOneClick").value = "" + parameter.numberBuildHousesWithContextMenu;
            try {
                if (!$(this.dom).dialog('isOpen')) {
                    return;
                }
            }
            catch (_a) {
                return;
            }
            var table = document.getElementById("diagramdialog-buildings-table");
            var buildings = [];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                buildings.push(0);
            }
            for (var x = 0; x < this.world.cities.length; x++) {
                for (var y = 0; y < this.world.cities[x].companies.length; y++) {
                    var comp = this.world.cities[x].companies[y];
                    buildings[comp.productid] += comp.buildings;
                }
            }
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var tr = table.children[0].children[x + 1];
                var inprogr = 0;
                for (var y = 0; y < this.world.cities.length; y++) {
                    inprogr += this.world.cities[y].getBuildingInProgress(x);
                }
                var sh = buildings[x] === undefined ? "" : buildings[x];
                if (inprogr) {
                    sh = sh + "(" + inprogr + icons_1.Icons.hammer + ")";
                }
                tr.children[2].innerHTML = sh;
                var suc = 0;
                var unsuc = 0;
                for (var t = 0; t < 7; t++) {
                    suc += this.world.game.statistic.successfulLoad[t][x];
                    unsuc += this.world.game.statistic.unsuccessfulLoad[t][x];
                }
                var ges = unsuc + suc;
                var dif = ges - unsuc;
                tr.children[3].innerHTML = (Math.round(10000 * dif / ges) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 });
                //tr.children[3].innerHTML = parameter.allProducts[x].dailyConsumtion.toLocaleString();
                //var test1=parameter.allProducts[x].getAmountForPeople()/(parameter.workerInCompany*parameter.allProducts.length);
                //var abw1=Math.round(1000*(parameter.allProducts[x].dailyConsumtion-test1)/parameter.allProducts[x].dailyConsumtion)/10;
                tr.children[4].innerHTML = (parameter.allProducts[x].getDiffConsumtion() * 100).toLocaleString(undefined, { maximumFractionDigits: 1 });
                var but = document.getElementById("diagram-advertise_" + x);
                if (this.world.advertising[x]) {
                    but.innerHTML = "until " + new Date(this.world.advertising[x]).toLocaleDateString();
                    but.setAttribute("disabled", "");
                }
                else {
                    but.removeAttribute("disabled");
                    but.innerHTML = "for " + (this.world.cities.length * parameter.costsAdvertising).toLocaleString() + " " + icons_1.Icons.money;
                }
            }
            //
            var table = document.getElementById("diagramdialog-balance-table");
            var content = `
            <tr>
                <th>What</th>
                <th>Yesterday</th>
                <th>Today</th>
            </tr>
        `;
            var allKeys = [];
            for (var key in this.world.game.statistic.today) {
                if (allKeys.indexOf(key) === -1)
                    allKeys.push(key);
            }
            for (var key in this.world.game.statistic.yesterday) {
                if (allKeys.indexOf(key) === -1)
                    allKeys.push(key);
            }
            allKeys.sort((a, b) => a.localeCompare(b));
            var gest = 0;
            var gesy = 0;
            for (var x = 0; x < allKeys.length; x++) {
                var k = allKeys[x];
                if (this.world.game.statistic.yesterday[k] != 0)
                    gesy += this.world.game.statistic.yesterday[k];
                if (this.world.game.statistic.today[k] != 0)
                    gest += this.world.game.statistic.today[k];
                content += `<tr>
                        <td>` + k + `</td>
                        <td style="text-align: right">` + "&nbsp;" + (this.world.game.statistic.yesterday[k] === undefined ? "" : this.world.game.statistic.yesterday[k].toLocaleString()) + `</td>
                        <td style="text-align: right">` + "&nbsp;" + (this.world.game.statistic.today[k] === undefined ? "" : this.world.game.statistic.today[k].toLocaleString()) + `</td>
                      </tr>`;
            }
            content += `<tr>
                        <td>Total</td>
                        <td style="text-align: right">` + "&nbsp;" + gesy.toLocaleString() + `</td>
                        <td style="text-align: right">` + "&nbsp;" + gest.toLocaleString() + `</td>
                      </tr>`;
            table.innerHTML = content;
            document.getElementById("diagramdialog-buildings-last-change").textContent = this.world.game.statistic.lastPriceChange;
        }
        show() {
            var _this = this;
            this.dom.removeAttribute("hidden");
            this.update();
            //ui-tabs-active
            $(this.dom).dialog({
                title: "Statistics",
                width: "400px",
                draggable: true,
                //     position:{my:"left top",at:"right top",of:$(document)} ,
                open: function (event, ui) {
                    _this.update();
                },
                close: function () {
                },
                create: function (e) {
                    setTimeout(() => {
                        $(e.target).dialog("widget").find(".ui-dialog-titlebar-close")[0].addEventListener('touchstart', (e) => {
                            _this.close();
                        });
                    }, 200);
                },
                resizable: false
            }).dialog("widget").draggable("option", "containment", "none");
            $(this.dom).parent().css({ position: "fixed" });
        }
        close() {
            $(this.dom).dialog("close");
        }
    }
    exports.DiagramDialog = DiagramDialog;
});
//# sourceMappingURL=diagramdialog.js.map