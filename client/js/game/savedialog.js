define(["require", "exports", "game/product", "game/airplane", "game/route", "game/city", "game/world", "game/company"], function (require, exports, product_1, airplane_1, route_1, city_1, world_1, company_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SaveDialog = void 0;
    class SaveDialog {
        constructor() {
            this.create();
        }
        static getInstance() {
            if (SaveDialog.instance === undefined)
                SaveDialog.instance = new SaveDialog();
            return SaveDialog.instance;
        }
        create() {
            //template for code reloading
            var sdom = `
          <div hidden id="SaveDialog" class="SaveDialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
            var old = document.getElementById("SaveDialog");
            if (old) {
                old.parentNode.removeChild(old);
            }
            var _this = this;
            var sdom = `
          <div>
            <table>
                <tr>
                    <td>
                        Filename: <input id="save-filename"/>
                    </td>
                    <td>
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: top;width:100%">
                     <ul style="width:100%" class="mylist boxborder" id="save-files">
                     
           
                    </ul>
                      
                    </td>
                    <td>
                        <button id="save-save" title="save" style="width:100%">Save</button>
                        <button id="save-load" title="save" style="width:100%">Load</button>
                        <button id="save-delete" title="save" style="width:100%">Delete</button>
                        <button id="save-export" title="save" style="width:100%">Export</button>
                        <button id="save-import" title="save" style="width:100%">Import</button>
                        <button id="save-cancel" title="save" style="width:100%">Cancel</button>
            
                    </td>
                </tr>    

            </table>         
           </div> 
            `;
            var newdom = document.createRange().createContextualFragment(sdom).children[0];
            this.dom.removeChild(this.dom.children[0]);
            this.dom.appendChild(newdom);
            document.body.appendChild(this.dom);
            //        document.getElementById("citydialog-prev")
            setTimeout(() => {
                $("#SaveDialog-tabs").tabs({
                //collapsible: true
                });
                _this.bindActions();
            }, 500);
            //document.createElement("span");
        }
        bindActions() {
            var _this = this;
            var idfilename = document.getElementById("save-filename");
            document.getElementById("save-cancel").addEventListener("click", (ev) => {
                _this.close();
            });
            document.getElementById("save-save").addEventListener("click", (ev) => {
                if (idfilename.value === "") {
                    alert("Error:Filename is empty");
                    return;
                }
                _this.save(idfilename.value);
                _this.close();
            });
            document.getElementById("save-load").addEventListener("click", (ev) => {
                if (idfilename.value === "") {
                    alert("Error:Filename is empty");
                    return;
                }
                _this.load(idfilename.value);
                _this.close();
            });
            document.getElementById("save-files").addEventListener("click", (ev) => {
                idfilename.value = ev.target.getAttribute("value"); //.substring(4);
                var el = ev.target;
                var select = document.getElementById("save-files");
                for (var x = 0; x < select.children.length; x++) {
                    select.children[x].classList.remove("active-listitem");
                }
                el.classList.add("active-listitem");
            });
            document.getElementById("save-delete").addEventListener("click", (ev) => {
                window.localStorage.removeItem("save" + idfilename.value);
                _this.update();
            });
        }
        update() {
            var list = [];
            var ret = "";
            for (var key in window.localStorage) {
                if (key.startsWith("save")) {
                    ret += '<li value="' + key.substring(4) + '">' + key.substring(4) + '</li>';
                    //list.push();
                }
            }
            document.getElementById("save-files").innerHTML = ret;
            var last = window.localStorage.getItem("lastgame");
            if (last)
                document.getElementById("save-filename").value = last;
        }
        show() {
            var _this = this;
            this.dom.removeAttribute("hidden");
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
        save(filename) {
            this.game.pause();
            var sdata = JSON.stringify(this.game, (key, value) => {
                var _a, _b, _c, _d, _e;
                var ret = {};
                if (value instanceof HTMLElement) {
                    return undefined;
                }
                if (key === "lastUpdate")
                    return undefined;
                if (((_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name) === "World") {
                    Object.assign(ret, value);
                    delete ret.game;
                    return ret;
                }
                if (((_b = value === null || value === void 0 ? void 0 : value.constructor) === null || _b === void 0 ? void 0 : _b.name) === "Airplane") {
                    Object.assign(ret, value);
                    delete ret.world;
                    return ret;
                }
                if (((_c = value === null || value === void 0 ? void 0 : value.constructor) === null || _c === void 0 ? void 0 : _c.name) === "City") {
                    Object.assign(ret, value);
                    delete ret.world;
                    return ret;
                }
                if (((_d = value === null || value === void 0 ? void 0 : value.constructor) === null || _d === void 0 ? void 0 : _d.name) === "Company") {
                    Object.assign(ret, value);
                    delete ret.city;
                    return ret;
                }
                if (((_e = value === null || value === void 0 ? void 0 : value.constructor) === null || _e === void 0 ? void 0 : _e.name) === "Route") {
                    Object.assign(ret, value);
                    delete ret.airplane;
                    return ret;
                }
                return value;
            }, "\t");
            window.localStorage.setItem("save" + filename, sdata);
            window.localStorage.setItem("lastgame", filename);
            //this.load();
            console.log(sdata);
            this.game.resume();
        }
        load(filename) {
            this.game.pause();
            var data = window.localStorage.getItem("save" + filename);
            var ret = JSON.parse(data, (key, value) => {
                var r = value;
                if (value === null)
                    return undefined;
                if (key === "parameter") {
                    Object.assign(parameter, value);
                    for (var x = 0; x < parameter.allProducts.length; x++) {
                        parameter.allProducts[x] = new product_1.Product(parameter.allProducts[x]);
                    }
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "Company") {
                    r = new company_1.Company();
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "Product") {
                    r = new product_1.Product(value);
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "Airplane") {
                    r = new airplane_1.Airplane(undefined);
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "World") {
                    r = new world_1.World();
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "City") {
                    r = new city_1.City();
                    if (value.warehouse) {
                        value.shop = value.warehouse;
                        value.shops = value.warehouses;
                        value.shopSellingPrice = value.warehouseSellingPrice;
                        delete value.warehouseSellingPrice;
                        delete value.warehouse;
                        delete value.warehouses;
                    }
                    Object.assign(r, value);
                    return r;
                }
                if ((value === null || value === void 0 ? void 0 : value.type) === "Route") {
                    r = new route_1.Route();
                    if (value.loadWarehouseAmount) {
                        value.loadShopAmount = value.loadWarehouseAmount;
                        value.unloadShopAmount = value.unloadWarehouseAmount;
                        value.loadShopUntilAmount = value.loadWarehouseUntilAmount;
                        delete value.loadWarehouseAmount;
                        delete value.unloadWarehouseAmount;
                        delete value.loadWarehouseUntilAmount;
                    }
                    Object.assign(r, value);
                    return r;
                }
                return r;
            });
            var game = this.game;
            Object.assign(this.game, ret);
            game.world.game = game;
            game.date = new Date(game.date);
            for (var x = 0; x < game.world.airplanes.length; x++) {
                game.world.airplanes[x].world = game.world;
                for (var y = 0; y < game.world.airplanes[x].route.length; y++) {
                    game.world.airplanes[x].route[y].airplane = game.world.airplanes[x];
                }
            }
            for (var x = 0; x < game.world.cities.length; x++) {
                game.world.cities[x].world = game.world;
                for (var y = 0; y < game.world.cities[x].companies.length; y++) {
                    game.world.cities[x].companies[y].city = game.world.cities[x];
                }
                //for(var y=0;y<this.world.cities[x].companies.length;y++){
                //  this.world.cities[x].companies[y].
                //}
            }
            game.render(this.game.dom);
            game.resume();
            window.localStorage.setItem("lastgame", filename);
        }
    }
    exports.SaveDialog = SaveDialog;
    function test() {
        SaveDialog.getInstance().show();
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvc2F2ZWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBVUEsTUFBYSxVQUFVO1FBS25CO1lBRUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksVUFBVSxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNqQyxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDM0MsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQy9CLENBQUM7UUFHTyxNQUFNO1lBQ1YsNkJBQTZCO1lBQzdCLElBQUksSUFBSSxHQUFHOzs7O1NBSVYsQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FBK0JOLENBQUM7WUFDTixJQUFJLE1BQU0sR0FBUSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0Ms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Q0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzVELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2pFO2dCQUNELDJEQUEyRDtnQkFDM0Qsc0NBQXNDO2dCQUN0QyxHQUFHO2FBQ047WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRELENBQUM7S0FDSjtJQW5TRCxnQ0FtU0M7SUFFRCxTQUFnQixJQUFJO1FBQ2hCLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRkQsb0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgeyBJY29ucyB9IGZyb20gXCJnYW1lL2ljb25zXCI7XHJcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSBcImdhbWUvcm91dGVcIjtcclxuaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiZ2FtZS93b3JsZFwiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcImdhbWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyBDb21wYW55IH0gZnJvbSBcImdhbWUvY29tcGFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNhdmVEaWFsb2cge1xyXG4gICAgZG9tOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGdhbWU6IEdhbWU7XHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xyXG5cclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBTYXZlRGlhbG9nIHtcclxuICAgICAgICBpZiAoU2F2ZURpYWxvZy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBTYXZlRGlhbG9nLmluc3RhbmNlID0gbmV3IFNhdmVEaWFsb2coKTtcclxuICAgICAgICByZXR1cm4gU2F2ZURpYWxvZy5pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XHJcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcclxuICAgICAgICB2YXIgc2RvbSA9IGBcclxuICAgICAgICAgIDxkaXYgaGlkZGVuIGlkPVwiU2F2ZURpYWxvZ1wiIGNsYXNzPVwiU2F2ZURpYWxvZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxyXG4gICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhpcy5kb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlNhdmVEaWFsb2dcIik7XHJcbiAgICAgICAgaWYgKG9sZCkge1xyXG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzZG9tID0gYFxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPHRhYmxlPlxyXG4gICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRmlsZW5hbWU6IDxpbnB1dCBpZD1cInNhdmUtZmlsZW5hbWVcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwidmVydGljYWwtYWxpZ246IHRvcDt3aWR0aDoxMDAlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgIDx1bCBzdHlsZT1cIndpZHRoOjEwMCVcIiBjbGFzcz1cIm15bGlzdCBib3hib3JkZXJcIiBpZD1cInNhdmUtZmlsZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic2F2ZS1zYXZlXCIgdGl0bGU9XCJzYXZlXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+U2F2ZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic2F2ZS1sb2FkXCIgdGl0bGU9XCJzYXZlXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+TG9hZDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic2F2ZS1kZWxldGVcIiB0aXRsZT1cInNhdmVcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj5EZWxldGU8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhdmUtZXhwb3J0XCIgdGl0bGU9XCJzYXZlXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+RXhwb3J0PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzYXZlLWltcG9ydFwiIHRpdGxlPVwic2F2ZVwiIHN0eWxlPVwid2lkdGg6MTAwJVwiPkltcG9ydDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic2F2ZS1jYW5jZWxcIiB0aXRsZT1cInNhdmVcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj5DYW5jZWw8L2J1dHRvbj5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+ICAgIFxyXG5cclxuICAgICAgICAgICAgPC90YWJsZT4gICAgICAgICBcclxuICAgICAgICAgICA8L2Rpdj4gXHJcbiAgICAgICAgICAgIGA7XHJcbiAgICAgICAgdmFyIG5ld2RvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20uY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xyXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI1NhdmVEaWFsb2ctdGFic1wiKS50YWJzKHtcclxuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIF90aGlzLmJpbmRBY3Rpb25zKCk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAvL2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgfVxyXG4gICAgYmluZEFjdGlvbnMoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgaWRmaWxlbmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmUtZmlsZW5hbWVcIikpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1jYW5jZWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBfdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1zYXZlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlkZmlsZW5hbWUudmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3I6RmlsZW5hbWUgaXMgZW1wdHlcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMuc2F2ZShpZGZpbGVuYW1lLnZhbHVlKTtcclxuICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmUtbG9hZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpZGZpbGVuYW1lLnZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yOkZpbGVuYW1lIGlzIGVtcHR5XCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF90aGlzLmxvYWQoaWRmaWxlbmFtZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIF90aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWZpbGVzXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgaWRmaWxlbmFtZS52YWx1ZSA9ICg8YW55PmV2LnRhcmdldCkuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7Ly8uc3Vic3RyaW5nKDQpO1xyXG4gICAgICAgICAgICB2YXIgZWwgPSA8SFRNTEVsZW1lbnQ+ZXYudGFyZ2V0O1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWZpbGVzXCIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlbGVjdC5jaGlsZHJlbi5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0LmNoaWxkcmVuW3hdLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmUtbGlzdGl0ZW1cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcImFjdGl2ZS1saXN0aXRlbVwiKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWRlbGV0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInNhdmVcIiArIGlkZmlsZW5hbWUudmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICB2YXIgbGlzdCA9IFtdO1xyXG4gICAgICAgIHZhciByZXQgPSBcIlwiXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcclxuICAgICAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKFwic2F2ZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0ICs9ICc8bGkgdmFsdWU9XCInICsga2V5LnN1YnN0cmluZyg0KSArICdcIj4nICsga2V5LnN1YnN0cmluZyg0KSArICc8L2xpPic7XHJcbiAgICAgICAgICAgICAgICAvL2xpc3QucHVzaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1maWxlc1wiKS5pbm5lckhUTUwgPSByZXQ7XHJcbiAgICAgICAgdmFyIGxhc3QgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJsYXN0Z2FtZVwiKTtcclxuICAgICAgICBpZiAobGFzdClcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1maWxlbmFtZVwiKSkudmFsdWUgPSBsYXN0O1xyXG5cclxuICAgIH1cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgLy91aS10YWJzLWFjdGl2ZVxyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIlN0YXRpc3RpY3NcIixcclxuICAgICAgICAgICAgd2lkdGg6IFwiNDAwcHhcIixcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXHJcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5kaWFsb2coXCJ3aWRnZXRcIikuZmluZChcIi51aS1kaWFsb2ctdGl0bGViYXItY2xvc2VcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuZGlhbG9nKFwid2lkZ2V0XCIpLmRyYWdnYWJsZShcIm9wdGlvblwiLCBcImNvbnRhaW5tZW50XCIsIFwibm9uZVwiKTtcclxuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xyXG4gICAgfVxyXG4gICAgc2F2ZShmaWxlbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLnBhdXNlKCk7XHJcbiAgICAgICAgdmFyIHNkYXRhID0gSlNPTi5zdHJpbmdpZnkodGhpcy5nYW1lLCAoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgdmFyIHJldDogYW55ID0ge307XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IFwibGFzdFVwZGF0ZVwiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJXb3JsZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHJldC5nYW1lO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIkFpcnBsYW5lXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHJldC53b3JsZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJDaXR5XCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHJldC53b3JsZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJDb21wYW55XCIpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcmV0LmNpdHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiUm91dGVcIikge1xyXG5cclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcmV0LmFpcnBsYW5lO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfSwgXCJcXHRcIik7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2F2ZVwiICsgZmlsZW5hbWUsIHNkYXRhKTtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJsYXN0Z2FtZVwiLCBmaWxlbmFtZSk7XHJcbiAgICAgICAgLy90aGlzLmxvYWQoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhzZGF0YSk7XHJcbiAgICAgICAgdGhpcy5nYW1lLnJlc3VtZSgpO1xyXG5cclxuICAgIH1cclxuICAgIGxvYWQoZmlsZW5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5wYXVzZSgpO1xyXG4gICAgICAgIHZhciBkYXRhID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F2ZVwiICsgZmlsZW5hbWUpO1xyXG4gICAgICAgIHZhciByZXQgPSBKU09OLnBhcnNlKGRhdGEsIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciByOiBhbnkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gXCJwYXJhbWV0ZXJcIikge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXIsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyYW1ldGVyLmFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdID0gbmV3IFByb2R1Y3QocGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiQ29tcGFueVwiKSB7XHJcbiAgICAgICAgICAgICAgICByID0gbmV3IENvbXBhbnkoKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIlByb2R1Y3RcIikge1xyXG4gICAgICAgICAgICAgICAgciA9IG5ldyBQcm9kdWN0KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkFpcnBsYW5lXCIpIHtcclxuICAgICAgICAgICAgICAgIHIgPSBuZXcgQWlycGxhbmUodW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIldvcmxkXCIpIHtcclxuICAgICAgICAgICAgICAgIHIgPSBuZXcgV29ybGQoKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkNpdHlcIikge1xyXG4gICAgICAgICAgICAgICAgciA9IG5ldyBDaXR5KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUud2FyZWhvdXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvcCA9IHZhbHVlLndhcmVob3VzZTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG9wcyA9IHZhbHVlLndhcmVob3VzZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvcFNlbGxpbmdQcmljZSA9IHZhbHVlLndhcmVob3VzZVNlbGxpbmdQcmljZTtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWUud2FyZWhvdXNlU2VsbGluZ1ByaWNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZS53YXJlaG91c2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlLndhcmVob3VzZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJSb3V0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByID0gbmV3IFJvdXRlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUubG9hZFdhcmVob3VzZUFtb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmxvYWRTaG9wQW1vdW50ID0gdmFsdWUubG9hZFdhcmVob3VzZUFtb3VudDtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS51bmxvYWRTaG9wQW1vdW50ID0gdmFsdWUudW5sb2FkV2FyZWhvdXNlQW1vdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmxvYWRTaG9wVW50aWxBbW91bnQgPSB2YWx1ZS5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlLmxvYWRXYXJlaG91c2VBbW91bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlLnVubG9hZFdhcmVob3VzZUFtb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWUubG9hZFdhcmVob3VzZVVudGlsQW1vdW50O1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGdhbWUgPSB0aGlzLmdhbWU7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmdhbWUsIHJldCk7XHJcbiAgICAgICAgZ2FtZS53b3JsZC5nYW1lID0gZ2FtZTtcclxuICAgICAgICBnYW1lLmRhdGUgPSBuZXcgRGF0ZShnYW1lLmRhdGUpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZ2FtZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgZ2FtZS53b3JsZC5haXJwbGFuZXNbeF0ud29ybGQgPSBnYW1lLndvcmxkO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGdhbWUud29ybGQuYWlycGxhbmVzW3hdLnJvdXRlLmxlbmd0aDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLndvcmxkLmFpcnBsYW5lc1t4XS5yb3V0ZVt5XS5haXJwbGFuZSA9IGdhbWUud29ybGQuYWlycGxhbmVzW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZ2FtZS53b3JsZC5jaXRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgZ2FtZS53b3JsZC5jaXRpZXNbeF0ud29ybGQgPSBnYW1lLndvcmxkO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGdhbWUud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllcy5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzW3ldLmNpdHkgPSBnYW1lLndvcmxkLmNpdGllc1t4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2Zvcih2YXIgeT0wO3k8dGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzLmxlbmd0aDt5Kyspe1xyXG4gICAgICAgICAgICAvLyAgdGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzW3ldLlxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9XHJcbiAgICAgICAgZ2FtZS5yZW5kZXIodGhpcy5nYW1lLmRvbSk7XHJcbiAgICAgICAgZ2FtZS5yZXN1bWUoKTtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJsYXN0Z2FtZVwiLCBmaWxlbmFtZSk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIFNhdmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5zaG93KCk7XHJcbn1cclxuIl19