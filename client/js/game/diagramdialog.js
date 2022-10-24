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
                tr.children[2].innerHTML = buildings[x] === undefined ? "" : buildings[x];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ3JhbWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvZGlhZ3JhbWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBUUEsTUFBYSxhQUFhO1FBS3RCO1lBRUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksYUFBYSxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNwQyxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7WUFDakQsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDO1FBQ2xDLENBQUM7UUFFRCxXQUFXO1lBQ1AsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBRWpCLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDN0UsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVPLE1BQU07WUFDViw2QkFBNkI7WUFDN0IsSUFBSSxJQUFJLEdBQUc7Ozs7U0FJVixDQUFDO1lBQ0YsSUFBSSxDQUFDLEdBQUcsR0FBUSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDbkQsSUFBSSxHQUFHLEVBQUU7Z0JBQ0wsR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkM7WUFDRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxJQUFJLEdBQUc7O3FFQUVrRCxHQUFFLGFBQUssQ0FBQyxPQUFPLEdBQUc7Ozs7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QUM7Z0JBQ2YsS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLEtBQUssRUFBRSxPQUFPO2dCQUNkLFNBQVMsRUFBRSxJQUFJO2dCQUNmLCtEQUErRDtnQkFDL0QsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFLEVBQUU7b0JBQ3JCLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbkIsQ0FBQztnQkFDRCxLQUFLLEVBQUU7Z0JBQ1AsQ0FBQzthQUNKLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRCxDQUFDO1FBQ0QsS0FBSztZQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FDSjtJQXZLRCxzQ0F1S0MiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGFsbFByb2R1Y3RzLCBQcm9kdWN0IH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xuaW1wb3J0IHsgUm91dGUgfSBmcm9tIFwiZ2FtZS9yb3V0ZVwiO1xuaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImdhbWUvd29ybGRcIjtcblxuZXhwb3J0IGNsYXNzIERpYWdyYW1EaWFsb2cge1xuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XG4gICAgd29ybGQ6IFdvcmxkO1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xuXG4gICAgfVxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBEaWFncmFtRGlhbG9nIHtcbiAgICAgICAgaWYgKERpYWdyYW1EaWFsb2cuaW5zdGFuY2UgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIERpYWdyYW1EaWFsb2cuaW5zdGFuY2UgPSBuZXcgRGlhZ3JhbURpYWxvZygpO1xuICAgICAgICByZXR1cm4gRGlhZ3JhbURpYWxvZy5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBiaW5kQWN0aW9ucygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpYWdyYW1kaWFsb2ctcmVmcmVzaFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXG4gICAgICAgIHZhciBzZG9tID0gYFxuICAgICAgICAgIDxkaXYgaGlkZGVuIGlkPVwiZGlhZ3JhbWRpYWxvZ1wiIGNsYXNzPVwiZGlhZ3JhbWRpYWxvZ1wiPlxuICAgICAgICAgICAgPGRpdj48L2Rpdj5cbiAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHRoaXMuZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcbiAgICAgICAgdmFyIG9sZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiRGlhZ3JhbURpYWxvZ1wiKTtcbiAgICAgICAgaWYgKG9sZCkge1xuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc2RvbSA9IGBcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImRpYWdyYW1kaWFsb2ctcmVmcmVzaFwiIHRpdGxlPVwicmVmcmVzaCBkYXRhXCI+YCsgSWNvbnMucmVmcmVzaCArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJkaWFncmFtZGlhbG9nLXRhYnNcIj5cbiAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2RpYWdyYW1kaWFsb2ctYnVpbGRpbmdzXCIgaWQ9XCJkaWFncmFtZGlhbG9nLWJ1aWxkaW5ncy10YWJcIiBjbGFzcz1cImRpYWdyYW1kaWFsb2ctdGFic1wiPkJ1aWxkaW5nczwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNkaWFncmFtZGlhbG9nLWJhbGFuY2VcIiBpZD1cImRpYWdyYW1kaWFsb2ctYmFsYW5jZS10YWJcIiBjbGFzcz1cImRpYWdyYW1kaWFsb2ctdGFic1wiPkJhbGFuY2U8L2E+PC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiZGlhZ3JhbWRpYWxvZy1idWlsZGluZ3NcIj5gKyBfdGhpcy5jcmVhdGVCdWlsZGluZ3MoKSArIGBcbiAgICAgICAgICAgICAgICA8L2Rpdj4gXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImRpYWdyYW1kaWFsb2ctYmFsYW5jZVwiPiAgIFxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgaWQ9XCJkaWFncmFtZGlhbG9nLWJhbGFuY2UtdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT4gICAgICAgICBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICA8L2Rpdj4gXG4gICAgICAgICAgICBgO1xuICAgICAgICB2YXIgbmV3ZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20uY2hpbGRyZW5bMF0pO1xuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdkb20pO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuICAgICAgICAkKFwiI2RpYWdyYW1kaWFsb2ctdGFic1wiKS50YWJzKHtcbiAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICQoXCIjZGlhZ3JhbWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgX3RoaXMuYmluZEFjdGlvbnMoKTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB9XG4gICAgY3JlYXRlQnVpbGRpbmdzKCkge1xuICAgICAgICByZXR1cm4gYDx0YWJsZSBpZD1cImRpYWdyYW1kaWFsb2ctYnVpbGRpbmdzLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5jb3VudCBCdWlsZGluZ3M8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgYWxsUHJvZHVjdHNbeF0uZ2V0SWNvbigpICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIGFsbFByb2R1Y3RzW3hdLm5hbWUgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPmA7XG4gICAgfVxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghJCh0aGlzLmRvbSkuZGlhbG9nKCdpc09wZW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFncmFtZGlhbG9nLWJ1aWxkaW5ncy10YWJsZVwiKTtcbiAgICAgICAgdmFyIGJ1aWxkaW5ncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBidWlsZGluZ3MucHVzaCgwKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud29ybGQuY2l0aWVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllcy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb21wID0gdGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzW3ldO1xuICAgICAgICAgICAgICAgIGJ1aWxkaW5nc1tjb21wLnByb2R1Y3RpZF0gKz0gY29tcC5idWlsZGluZ3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bMl0uaW5uZXJIVE1MID0gYnVpbGRpbmdzW3hdPT09dW5kZWZpbmVkP1wiXCI6YnVpbGRpbmdzW3hdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9cbiAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaWFncmFtZGlhbG9nLWJhbGFuY2UtdGFibGVcIik7XG4gICAgICAgIHZhciBjb250ZW50PWBcbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGg+V2hhdDwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlllc3RlcmRheTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlRvZGF5PC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgIGA7XG4gICAgICAgIHZhciBhbGxLZXlzPVtdO1xuICAgICAgICBmb3IodmFyIGtleSBpbiB0aGlzLndvcmxkLmdhbWUuc3RhdGlzdGljLnRvZGF5KXtcbiAgICAgICAgICAgIGlmKGFsbEtleXMuaW5kZXhPZihrZXkpPT09LTEpXG4gICAgICAgICAgICAgICAgYWxsS2V5cy5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBrZXkgaW4gdGhpcy53b3JsZC5nYW1lLnN0YXRpc3RpYy55ZXN0ZXJkYXkpe1xuICAgICAgICAgICAgaWYoYWxsS2V5cy5pbmRleE9mKGtleSk9PT0tMSlcbiAgICAgICAgICAgICAgICBhbGxLZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBhbGxLZXlzLnNvcnQoKGE6c3RyaW5nLGIpPT5hLmxvY2FsZUNvbXBhcmUoYikpO1xuICAgICAgICBmb3IodmFyIHg9MDt4PGFsbEtleXMubGVuZ3RoO3grKyl7XG4gICAgICAgICAgICB2YXIgaz1hbGxLZXlzW3hdO1xuICAgICAgICAgICAgY29udGVudCs9YDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5gK2srYDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodFwiPmArKHRoaXMud29ybGQuZ2FtZS5zdGF0aXN0aWMueWVzdGVyZGF5W2tdPT09dW5kZWZpbmVkP1wiXCI6dGhpcy53b3JsZC5nYW1lLnN0YXRpc3RpYy55ZXN0ZXJkYXlba10pK2A8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHRcIj5gKyh0aGlzLndvcmxkLmdhbWUuc3RhdGlzdGljLnRvZGF5W2tdPT09dW5kZWZpbmVkP1wiXCI6dGhpcy53b3JsZC5nYW1lLnN0YXRpc3RpYy50b2RheVtrXSkrYDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPC90cj5gXG4gICAgICAgIH1cbiAgICAgICAgdGFibGUuaW5uZXJIVE1MPWNvbnRlbnQ7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgLy91aS10YWJzLWFjdGl2ZVxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coe1xuICAgICAgICAgICAgdGl0bGU6IFwiU3RhdGlzdGljc1wiLFxuICAgICAgICAgICAgd2lkdGg6IFwiNDAwcHhcIixcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjp7bXk6XCJsZWZ0IHRvcFwiLGF0OlwicmlnaHQgdG9wXCIsb2Y6JChkb2N1bWVudCl9ICxcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5kaWFsb2coXCJ3aWRnZXRcIikuZHJhZ2dhYmxlKFwib3B0aW9uXCIsIFwiY29udGFpbm1lbnRcIiwgXCJub25lXCIpO1xuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xuXG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICB9XG59XG4iXX0=