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
                       number build company with one click: <input id="buildWithOneClick"  value="""/>
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
                            <th>count Buildings</th>
                            <th>Advertise</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + parameter.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + parameter.allProducts[x].name + "</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + "<td>" + '<button id="diagram-advertise_' + x + '" class="mybutton"></button>' + "</td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>`;
        }
        update() {
            document.getElementById("buildWithOneClick").value = "" + parameter.numberBuildWithContextMenu;
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
                var but = document.getElementById("diagram-advertise_" + x);
                if (this.world.advertising[x]) {
                    but.innerHTML = "until " + new Date(this.world.advertising[x]).toLocaleDateString();
                    but.setAttribute("disabled", "");
                }
                else {
                    but.removeAttribute("disabled");
                    but.innerHTML = "for " + this.world.cities.length * parameter.costsAdvertising + " " + icons_1.Icons.money;
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
            for (var x = 0; x < allKeys.length; x++) {
                var k = allKeys[x];
                content += `<tr>
                        <td>` + k + `</td>
                        <td style="text-align: right">` + (this.world.game.statistic.yesterday[k] === undefined ? "" : this.world.game.statistic.yesterday[k]) + `</td>
                        <td style="text-align: right">` + (this.world.game.statistic.today[k] === undefined ? "" : this.world.game.statistic.today[k]) + `</td>
                      </tr>`;
            }
            table.innerHTML = content;
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
                }
            }).dialog("widget").draggable("option", "containment", "none");
            $(this.dom).parent().css({ position: "fixed" });
        }
        close() {
            $(this.dom).dialog("close");
        }
    }
    exports.DiagramDialog = DiagramDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ3JhbWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZGlhZ3JhbWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsTUFBYSxhQUFhO1FBS3RCO1lBRUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksYUFBYSxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNwQyxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7WUFDakQsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDO1FBQ2xDLENBQUM7UUFFRCxXQUFXO1lBQ1AsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBRWpCLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDN0UsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUMxRSxJQUFJLEdBQUcsR0FBQyxRQUFRLENBQW9CLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekYsU0FBUyxDQUFDLDBCQUEwQixHQUFDLEdBQUcsQ0FBQztnQkFDekMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDO1lBRUgsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuRCxRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUNoRixJQUFJLEdBQUcsR0FBUyxHQUFHLENBQUMsTUFBTyxDQUFDLEVBQUUsQ0FBQztvQkFDOUIsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEMsSUFBSSxLQUFLLEdBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDakUsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxFQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNuRCxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUMsRUFBRSxHQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUMsRUFBRSxHQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNqRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ25CLENBQUMsQ0FBQyxDQUFDO2FBQ047UUFDTCxDQUFDO1FBRU8sTUFBTTtZQUNWLDZCQUE2QjtZQUM3QixJQUFJLElBQUksR0FBRzs7OztTQUlWLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNuRCxJQUFJLEdBQUcsRUFBRTtnQkFDTCxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQztZQUNELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRzs7dUZBRW9FLEdBQUUsYUFBSyxDQUFDLE9BQU8sR0FBRzs7Ozs7Ozs7b0RBUXJELEdBQUUsS0FBSyxDQUFDLGVBQWUsRUFBRSxHQUFHOzs7Ozs7Ozs7OzthQVduRSxDQUFDO1lBQ04sSUFBSSxNQUFNLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTdCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsbUJBQW1CO2FBQ3RCLENBQUMsQ0FBQztZQUNILG9EQUFvRDtZQUNwRCxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNaLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsbUJBQW1CO2lCQUN0QixDQUFDLENBQUM7Z0JBQ0gsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSLGlDQUFpQztRQUNyQyxDQUFDO1FBQ0QsZUFBZTtZQUNYLE9BQU87Ozs7Ozs7eUJBT1UsQ0FBQyxTQUFTLEdBQUc7Z0JBQ3RCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ25ELEdBQUcsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDO29CQUNuQixHQUFHLEdBQUcsR0FBRyxHQUFHLE1BQU0sR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztvQkFDbEUsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO29CQUM3RCxHQUFHLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQztvQkFDekIsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsZ0NBQWdDLEdBQUcsQ0FBQyxHQUFHLDhCQUE4QixHQUFHLE9BQU8sQ0FBQztvQkFDckcsR0FBRyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUM7aUJBQ3ZCO2dCQUNELE9BQU8sR0FBRyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLEVBQUU7NkJBQ2EsQ0FBQztRQUMxQixDQUFDO1FBQ0QsTUFBTTtZQUNrQixRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFFLENBQUMsS0FBSyxHQUFDLEVBQUUsR0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUM7WUFDaEgsSUFBSTtnQkFDQSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQy9CLE9BQU87aUJBQ1Y7YUFDSjtZQUFDLFdBQU07Z0JBQ0osT0FBTzthQUNWO1lBQ0QsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUVuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25ELFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFFckI7WUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMvQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDNUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUM7aUJBQy9DO2FBQ0o7WUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25ELElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUMvQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVEO2dCQUNELElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLE9BQU8sRUFBRTtvQkFDVCxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxPQUFPLEdBQUcsYUFBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7aUJBQ2hEO2dCQUNELEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztnQkFDOUIsSUFBSSxHQUFHLEdBQXNCLFFBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQy9FLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzNCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDcEYsR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7aUJBQ3BDO3FCQUFNO29CQUNILEdBQUcsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ2hDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsZ0JBQWdCLEdBQUMsR0FBRyxHQUFDLGFBQUssQ0FBQyxLQUFLLENBQUM7aUJBQ2xHO2FBQ0o7WUFFRCxFQUFFO1lBQ0YsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ25FLElBQUksT0FBTyxHQUFHOzs7Ozs7U0FNYixDQUFDO1lBQ0YsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtnQkFDN0MsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN6QjtZQUNELEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtnQkFDakQsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN6QjtZQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxJQUFJOzZCQUNNLEdBQUUsQ0FBQyxHQUFHO3VEQUNvQixHQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHO3VEQUN6RyxHQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHOzRCQUM1SCxDQUFBO2FBQ25CO1lBQ0QsS0FBSyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7UUFDOUIsQ0FBQztRQUNELElBQUk7WUFDQSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsZ0JBQWdCO1lBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUNmLEtBQUssRUFBRSxZQUFZO2dCQUNuQixLQUFLLEVBQUUsT0FBTztnQkFDZCxTQUFTLEVBQUUsSUFBSTtnQkFDZiwrREFBK0Q7Z0JBQy9ELElBQUksRUFBRSxVQUFVLEtBQUssRUFBRSxFQUFFO29CQUNyQixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ25CLENBQUM7Z0JBQ0QsS0FBSyxFQUFFO2dCQUNQLENBQUM7Z0JBQ0QsTUFBTSxFQUFFLFVBQVUsQ0FBQztvQkFDZixVQUFVLENBQUMsR0FBRyxFQUFFO3dCQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFOzRCQUNuRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2xCLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDWixDQUFDO2FBQ0osQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXBELENBQUM7UUFDRCxLQUFLO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBdk5ELHNDQXVOQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSBcImdhbWUvcm91dGVcIjtcbmltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCJnYW1lL3dvcmxkXCI7XG5cbmV4cG9ydCBjbGFzcyBEaWFncmFtRGlhbG9nIHtcbiAgICBkb206IEhUTUxEaXZFbGVtZW50O1xuICAgIHdvcmxkOiBXb3JsZDtcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcblxuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogRGlhZ3JhbURpYWxvZyB7XG4gICAgICAgIGlmIChEaWFncmFtRGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBEaWFncmFtRGlhbG9nLmluc3RhbmNlID0gbmV3IERpYWdyYW1EaWFsb2coKTtcbiAgICAgICAgcmV0dXJuIERpYWdyYW1EaWFsb2cuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgYmluZEFjdGlvbnMoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFncmFtZGlhbG9nLXJlZnJlc2hcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1aWxkV2l0aE9uZUNsaWNrXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgICAgICB2YXIgbnVtPXBhcnNlSW50KCg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1aWxkV2l0aE9uZUNsaWNrXCIpKS52YWx1ZSk7XG4gICAgICAgICAgICBwYXJhbWV0ZXIubnVtYmVyQnVpbGRXaXRoQ29udGV4dE1lbnU9bnVtO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhZ3JhbS1hZHZlcnRpc2VfXCIgKyB4KS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBzaWQgPSAoPGFueT5ldnQudGFyZ2V0KS5pZDtcbiAgICAgICAgICAgICAgICAgdmFyIGlkID0gTnVtYmVyKHNpZC5zcGxpdChcIl9cIilbMV0pO1xuICAgICAgICAgICAgICAgIHZhciBtb25leT1fdGhpcy53b3JsZC5jaXRpZXMubGVuZ3RoICogcGFyYW1ldGVyLmNvc3RzQWR2ZXJ0aXNpbmc7XG4gICAgICAgICAgICAgICAgX3RoaXMud29ybGQuZ2FtZS5jaGFuZ2VNb25leSgtbW9uZXksXCJhZHZlcnRpc2luZ1wiKTtcbiAgICAgICAgICAgICAgICBfdGhpcy53b3JsZC5hZHZlcnRpc2luZ1tpZF09bmV3IERhdGUoX3RoaXMud29ybGQuZ2FtZS5kYXRlLmdldFRpbWUoKSszMCoyNCo2MCo2MCoxMDAwKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xuICAgICAgICAvL3RlbXBsYXRlIGZvciBjb2RlIHJlbG9hZGluZ1xuICAgICAgICB2YXIgc2RvbSA9IGBcbiAgICAgICAgICA8ZGl2IGhpZGRlbiBpZD1cImRpYWdyYW1kaWFsb2dcIiBjbGFzcz1cImRpYWdyYW1kaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpYWdyYW1kaWFsb2dcIik7XG4gICAgICAgIGlmIChvbGQpIHtcbiAgICAgICAgICAgIG9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkaWFncmFtZGlhbG9nLXJlZnJlc2hcIiB0aXRsZT1cInJlZnJlc2ggZGF0YVwiICBjbGFzcz1cIm15YnV0dG9uXCI+YCsgSWNvbnMucmVmcmVzaCArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJkaWFncmFtZGlhbG9nLXRhYnNcIj5cbiAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2RpYWdyYW1kaWFsb2ctYnVpbGRpbmdzXCIgaWQ9XCJkaWFncmFtZGlhbG9nLWJ1aWxkaW5ncy10YWJcIiBjbGFzcz1cImRpYWdyYW1kaWFsb2ctdGFic1wiPkJ1aWxkaW5nczwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNkaWFncmFtZGlhbG9nLWJhbGFuY2VcIiBpZD1cImRpYWdyYW1kaWFsb2ctYmFsYW5jZS10YWJcIiBjbGFzcz1cImRpYWdyYW1kaWFsb2ctdGFic1wiPkJhbGFuY2U8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZGlhZ3JhbWRpYWxvZy1zZXR0aW5nc1wiIGlkPVwiZGlhZ3JhbWRpYWxvZy1zZXR0aW5ncy10YWJcIiBjbGFzcz1cImRpYWdyYW1kaWFsb2ctdGFic1wiPlNldHRpbmdzPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImRpYWdyYW1kaWFsb2ctYnVpbGRpbmdzXCI+YCsgX3RoaXMuY3JlYXRlQnVpbGRpbmdzKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+IFxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJkaWFncmFtZGlhbG9nLWJhbGFuY2VcIj4gICBcbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGlkPVwiZGlhZ3JhbWRpYWxvZy1iYWxhbmNlLXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+ICAgICAgICAgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJkaWFncmFtZGlhbG9nLXNldHRpbmdzXCI+ICAgXG4gICAgICAgICAgICAgICAgICAgICAgIG51bWJlciBidWlsZCBjb21wYW55IHdpdGggb25lIGNsaWNrOiA8aW5wdXQgaWQ9XCJidWlsZFdpdGhPbmVDbGlja1wiICB2YWx1ZT1cIlwiXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgIDwvZGl2PiBcbiAgICAgICAgICAgIGA7XG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XG4gICAgICAgICQoXCIjZGlhZ3JhbWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJChcIiNkaWFncmFtZGlhbG9nLXRhYnNcIikudGFicyh7XG4gICAgICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfdGhpcy5iaW5kQWN0aW9ucygpO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgICAvL2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIH1cbiAgICBjcmVhdGVCdWlsZGluZ3MoKSB7XG4gICAgICAgIHJldHVybiBgPHRhYmxlIGlkPVwiZGlhZ3JhbWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmNvdW50IEJ1aWxkaW5nczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkFkdmVydGlzZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAkeyhmdW5jdGlvbiBmdW4oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBwYXJhbWV0ZXIuYWxsUHJvZHVjdHNbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgJzxidXR0b24gaWQ9XCJkaWFncmFtLWFkdmVydGlzZV8nICsgeCArICdcIiBjbGFzcz1cIm15YnV0dG9uXCI+PC9idXR0b24+JyArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5gO1xuICAgIH1cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidWlsZFdpdGhPbmVDbGlja1wiKSkudmFsdWU9XCJcIitwYXJhbWV0ZXIubnVtYmVyQnVpbGRXaXRoQ29udGV4dE1lbnU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoISQodGhpcy5kb20pLmRpYWxvZygnaXNPcGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhZ3JhbWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIik7XG4gICAgICAgIHZhciBidWlsZGluZ3MgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgYnVpbGRpbmdzLnB1c2goMCk7XG5cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud29ybGQuY2l0aWVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllcy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb21wID0gdGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzW3ldO1xuICAgICAgICAgICAgICAgIGJ1aWxkaW5nc1tjb21wLnByb2R1Y3RpZF0gKz0gY29tcC5idWlsZGluZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciB0ciA9IHRhYmxlLmNoaWxkcmVuWzBdLmNoaWxkcmVuW3ggKyAxXTtcbiAgICAgICAgICAgIHZhciBpbnByb2dyID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy53b3JsZC5jaXRpZXMubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICAgICAgICBpbnByb2dyICs9IHRoaXMud29ybGQuY2l0aWVzW3ldLmdldEJ1aWxkaW5nSW5Qcm9ncmVzcyh4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzaCA9IGJ1aWxkaW5nc1t4XSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IGJ1aWxkaW5nc1t4XTtcbiAgICAgICAgICAgIGlmIChpbnByb2dyKSB7XG4gICAgICAgICAgICAgICAgc2ggPSBzaCArIFwiKFwiICsgaW5wcm9nciArIEljb25zLmhhbW1lciArIFwiKVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bMl0uaW5uZXJIVE1MID0gc2g7XG4gICAgICAgICAgICB2YXIgYnV0ID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhZ3JhbS1hZHZlcnRpc2VfXCIgKyB4KTtcbiAgICAgICAgICAgIGlmICh0aGlzLndvcmxkLmFkdmVydGlzaW5nW3hdKSB7XG4gICAgICAgICAgICAgICAgYnV0LmlubmVySFRNTCA9IFwidW50aWwgXCIgKyBuZXcgRGF0ZSh0aGlzLndvcmxkLmFkdmVydGlzaW5nW3hdKS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBidXQuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1dC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICBidXQuaW5uZXJIVE1MID0gXCJmb3IgXCIgKyB0aGlzLndvcmxkLmNpdGllcy5sZW5ndGggKiBwYXJhbWV0ZXIuY29zdHNBZHZlcnRpc2luZytcIiBcIitJY29ucy5tb25leTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhZ3JhbWRpYWxvZy1iYWxhbmNlLXRhYmxlXCIpO1xuICAgICAgICB2YXIgY29udGVudCA9IGBcbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGg+V2hhdDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlllc3RlcmRheTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlRvZGF5PC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgIGA7XG4gICAgICAgIHZhciBhbGxLZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLndvcmxkLmdhbWUuc3RhdGlzdGljLnRvZGF5KSB7XG4gICAgICAgICAgICBpZiAoYWxsS2V5cy5pbmRleE9mKGtleSkgPT09IC0xKVxuICAgICAgICAgICAgICAgIGFsbEtleXMucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLndvcmxkLmdhbWUuc3RhdGlzdGljLnllc3RlcmRheSkge1xuICAgICAgICAgICAgaWYgKGFsbEtleXMuaW5kZXhPZihrZXkpID09PSAtMSlcbiAgICAgICAgICAgICAgICBhbGxLZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBhbGxLZXlzLnNvcnQoKGE6IHN0cmluZywgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxLZXlzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgayA9IGFsbEtleXNbeF07XG4gICAgICAgICAgICBjb250ZW50ICs9IGA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+YCsgayArIGA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHRcIj5gKyAodGhpcy53b3JsZC5nYW1lLnN0YXRpc3RpYy55ZXN0ZXJkYXlba10gPT09IHVuZGVmaW5lZCA/IFwiXCIgOiB0aGlzLndvcmxkLmdhbWUuc3RhdGlzdGljLnllc3RlcmRheVtrXSkgKyBgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0XCI+YCsgKHRoaXMud29ybGQuZ2FtZS5zdGF0aXN0aWMudG9kYXlba10gPT09IHVuZGVmaW5lZCA/IFwiXCIgOiB0aGlzLndvcmxkLmdhbWUuc3RhdGlzdGljLnRvZGF5W2tdKSArIGA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDwvdHI+YFxuICAgICAgICB9XG4gICAgICAgIHRhYmxlLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgLy91aS10YWJzLWFjdGl2ZVxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coe1xuICAgICAgICAgICAgdGl0bGU6IFwiU3RhdGlzdGljc1wiLFxuICAgICAgICAgICAgd2lkdGg6IFwiNDAwcHhcIixcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjp7bXk6XCJsZWZ0IHRvcFwiLGF0OlwicmlnaHQgdG9wXCIsb2Y6JChkb2N1bWVudCl9ICxcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuZGlhbG9nKFwid2lkZ2V0XCIpLmZpbmQoXCIudWktZGlhbG9nLXRpdGxlYmFyLWNsb3NlXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZGlhbG9nKFwid2lkZ2V0XCIpLmRyYWdnYWJsZShcIm9wdGlvblwiLCBcImNvbnRhaW5tZW50XCIsIFwibm9uZVwiKTtcbiAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuY3NzKHsgcG9zaXRpb246IFwiZml4ZWRcIiB9KTtcblxuICAgIH1cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgfVxufVxuIl19