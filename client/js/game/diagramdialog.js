define(["require", "exports", "game/product", "game/icons"], function (require, exports, product_1, icons_1) {
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
        }
        create() {
            //template for code reloading
            var sdom = `
          <div hidden id="diagramdialog" class="diagramdialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
            var old = document.getElementById("DiagramDialog");
            if (old) {
                old.parentNode.removeChild(old);
            }
            var _this = this;
            var sdom = `
          <div>
            <button id="diagramdialog-refresh" title="refresh data">` + icons_1.Icons.refresh + `</button>
                            
            <div id="diagramdialog-tabs">
                <ul>
                    <li><a href="#diagramdialog-buildings" id="diagramdialog-buildings-tab" class="diagramdialog-tabs">Buildings</a></li>
                    <li><a href="#diagramdialog-balance" id="diagramdialog-balance-tab" class="diagramdialog-tabs">Balance</a></li>
                </ul>
                 <div id="diagramdialog-buildings">` + _this.createBuildings() + `
                </div> 
                <div id="diagramdialog-balance">   
                    <table id="diagramdialog-balance-table">
                    </table>         
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
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < product_1.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + product_1.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + product_1.allProducts[x].name + "</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>`;
        }
        update() {
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
            for (var x = 0; x < product_1.allProducts.length; x++) {
                buildings.push(0);
            }
            for (var x = 0; x < this.world.cities.length; x++) {
                for (var y = 0; y < this.world.cities[x].companies.length; y++) {
                    var comp = this.world.cities[x].companies[y];
                    buildings[comp.productid] += comp.buildings;
                }
            }
            for (var x = 0; x < product_1.allProducts.length; x++) {
                var tr = table.children[0].children[x + 1];
                tr.children[2].innerHTML = buildings[x];
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
                        <td>` + this.world.game.statistic.yesterday[k] + `</td>
                        <td>` + this.world.game.statistic.today[k] + `</td>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ3JhbWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZGlhZ3JhbWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsTUFBYSxhQUFhO1FBS3RCO1lBRUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksYUFBYSxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNwQyxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7WUFDakQsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDO1FBQ2xDLENBQUM7UUFFRCxXQUFXO1lBQ1AsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBRWpCLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDN0UsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVPLE1BQU07WUFDViw2QkFBNkI7WUFDN0IsSUFBSSxJQUFJLEdBQUc7Ozs7U0FJVixDQUFDO1lBQ0YsSUFBSSxDQUFDLEdBQUcsR0FBUSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDbkQsSUFBSSxHQUFHLEVBQUU7Z0JBQ0wsR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkM7WUFDRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxJQUFJLEdBQUc7O3FFQUVrRCxHQUFFLGFBQUssQ0FBQyxPQUFPLEdBQUc7Ozs7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QUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFcEQsQ0FBQztRQUNELEtBQUs7WUFDRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDO0tBQ0o7SUF2S0Qsc0NBdUtDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBhbGxQcm9kdWN0cywgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSBcImdhbWUvcm91dGVcIjtcbmltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCJnYW1lL3dvcmxkXCI7XG5cbmV4cG9ydCBjbGFzcyBEaWFncmFtRGlhbG9nIHtcbiAgICBkb206IEhUTUxEaXZFbGVtZW50O1xuICAgIHdvcmxkOiBXb3JsZDtcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcblxuICAgIH1cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogRGlhZ3JhbURpYWxvZyB7XG4gICAgICAgIGlmIChEaWFncmFtRGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBEaWFncmFtRGlhbG9nLmluc3RhbmNlID0gbmV3IERpYWdyYW1EaWFsb2coKTtcbiAgICAgICAgcmV0dXJuIERpYWdyYW1EaWFsb2cuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgYmluZEFjdGlvbnMoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFncmFtZGlhbG9nLXJlZnJlc2hcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xuICAgICAgICAvL3RlbXBsYXRlIGZvciBjb2RlIHJlbG9hZGluZ1xuICAgICAgICB2YXIgc2RvbSA9IGBcbiAgICAgICAgICA8ZGl2IGhpZGRlbiBpZD1cImRpYWdyYW1kaWFsb2dcIiBjbGFzcz1cImRpYWdyYW1kaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIkRpYWdyYW1EaWFsb2dcIik7XG4gICAgICAgIGlmIChvbGQpIHtcbiAgICAgICAgICAgIG9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkaWFncmFtZGlhbG9nLXJlZnJlc2hcIiB0aXRsZT1cInJlZnJlc2ggZGF0YVwiPmArIEljb25zLnJlZnJlc2ggKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICA8ZGl2IGlkPVwiZGlhZ3JhbWRpYWxvZy10YWJzXCI+XG4gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNkaWFncmFtZGlhbG9nLWJ1aWxkaW5nc1wiIGlkPVwiZGlhZ3JhbWRpYWxvZy1idWlsZGluZ3MtdGFiXCIgY2xhc3M9XCJkaWFncmFtZGlhbG9nLXRhYnNcIj5CdWlsZGluZ3M8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZGlhZ3JhbWRpYWxvZy1iYWxhbmNlXCIgaWQ9XCJkaWFncmFtZGlhbG9nLWJhbGFuY2UtdGFiXCIgY2xhc3M9XCJkaWFncmFtZGlhbG9nLXRhYnNcIj5CYWxhbmNlPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImRpYWdyYW1kaWFsb2ctYnVpbGRpbmdzXCI+YCsgX3RoaXMuY3JlYXRlQnVpbGRpbmdzKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+IFxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJkaWFncmFtZGlhbG9nLWJhbGFuY2VcIj4gICBcbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGlkPVwiZGlhZ3JhbWRpYWxvZy1iYWxhbmNlLXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+ICAgICAgICAgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgPC9kaXY+IFxuICAgICAgICAgICAgYDtcbiAgICAgICAgdmFyIG5ld2RvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQobmV3ZG9tKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcbiAgICAgICAgJChcIiNkaWFncmFtZGlhbG9nLXRhYnNcIikudGFicyh7XG4gICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIilcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkKFwiI2RpYWdyYW1kaWFsb2ctdGFic1wiKS50YWJzKHtcbiAgICAgICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF90aGlzLmJpbmRBY3Rpb25zKCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgfVxuICAgIGNyZWF0ZUJ1aWxkaW5ncygpIHtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJkaWFncmFtZGlhbG9nLWJ1aWxkaW5ncy10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD4gPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+Y291bnQgQnVpbGRpbmdzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBhbGxQcm9kdWN0c1t4XS5uYW1lICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD4wPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5gO1xuICAgIH1cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoISQodGhpcy5kb20pLmRpYWxvZygnaXNPcGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhZ3JhbWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIik7XG4gICAgICAgIHZhciBidWlsZGluZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgYnVpbGRpbmdzLnB1c2goMCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndvcmxkLmNpdGllcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLndvcmxkLmNpdGllc1t4XS5jb21wYW5pZXMubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tcCA9IHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllc1t5XTtcbiAgICAgICAgICAgICAgICBidWlsZGluZ3NbY29tcC5wcm9kdWN0aWRdICs9IGNvbXAuYnVpbGRpbmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciB0ciA9IHRhYmxlLmNoaWxkcmVuWzBdLmNoaWxkcmVuW3ggKyAxXTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzJdLmlubmVySFRNTCA9IGJ1aWxkaW5nc1t4XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vXG4gICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlhZ3JhbWRpYWxvZy1iYWxhbmNlLXRhYmxlXCIpO1xuICAgICAgICB2YXIgY29udGVudD1gXG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRoPldoYXQ8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5ZZXN0ZXJkYXk8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5Ub2RheTwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICBgO1xuICAgICAgICB2YXIgYWxsS2V5cz1bXTtcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gdGhpcy53b3JsZC5nYW1lLnN0YXRpc3RpYy50b2RheSl7XG4gICAgICAgICAgICBpZihhbGxLZXlzLmluZGV4T2Yoa2V5KT09PS0xKVxuICAgICAgICAgICAgICAgIGFsbEtleXMucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIga2V5IGluIHRoaXMud29ybGQuZ2FtZS5zdGF0aXN0aWMueWVzdGVyZGF5KXtcbiAgICAgICAgICAgIGlmKGFsbEtleXMuaW5kZXhPZihrZXkpPT09LTEpXG4gICAgICAgICAgICAgICAgYWxsS2V5cy5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgYWxsS2V5cy5zb3J0KChhOnN0cmluZyxiKT0+YS5sb2NhbGVDb21wYXJlKGIpKTtcbiAgICAgICAgZm9yKHZhciB4PTA7eDxhbGxLZXlzLmxlbmd0aDt4Kyspe1xuICAgICAgICAgICAgdmFyIGs9YWxsS2V5c1t4XTtcbiAgICAgICAgICAgIGNvbnRlbnQrPWA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+YCtrK2A8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPmArdGhpcy53b3JsZC5nYW1lLnN0YXRpc3RpYy55ZXN0ZXJkYXlba10rYDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+YCt0aGlzLndvcmxkLmdhbWUuc3RhdGlzdGljLnRvZGF5W2tdK2A8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgIDwvdHI+YFxuICAgICAgICB9XG4gICAgICAgIHRhYmxlLmlubmVySFRNTD1jb250ZW50O1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIC8vdWktdGFicy1hY3RpdmVcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKHtcbiAgICAgICAgICAgIHRpdGxlOiBcIlN0YXRpc3RpY3NcIixcbiAgICAgICAgICAgIHdpZHRoOiBcIjQwMHB4XCIsXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZGlhbG9nKFwid2lkZ2V0XCIpLmRyYWdnYWJsZShcIm9wdGlvblwiLCBcImNvbnRhaW5tZW50XCIsIFwibm9uZVwiKTtcbiAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuY3NzKHsgcG9zaXRpb246IFwiZml4ZWRcIiB9KTtcblxuICAgIH1cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgfVxufVxuIl19