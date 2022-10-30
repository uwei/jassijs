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
                    <td>
                            <select id="save-files" size="7" style="width:100%">
                            </select>
                    </td>
                    <td>
                        <button id="save-save" title="save">Save</button>
                        <br/><br/>
                        <button id="save-load" title="save">Load</button>
                        <br/><br/>
                        <button id="save-delete" title="save">Delete</button>
                        <br/><br/>
                        <button id="save-export" title="save">Export</button>
                        <br/><br/>
                        <button id="save-import" title="save">Import</button>
                        <br/><br/>
                        <button id="save-cancel" title="save">Cancel</button>
            
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
                idfilename.value = ev.target.value; //.substring(4);
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
                    ret += '<option value="' + key.substring(4) + '">' + key.substring(4) + '</option>';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvc2F2ZWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBVUEsTUFBYSxVQUFVO1FBS25CO1lBRUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWxCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksVUFBVSxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNqQyxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDM0MsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQy9CLENBQUM7UUFHTyxNQUFNO1lBQ1YsNkJBQTZCO1lBQzdCLElBQUksSUFBSSxHQUFHOzs7O1NBSVYsQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FBa0NOLENBQUM7WUFDTixJQUFJLE1BQU0sR0FBUSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFD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QUFLLENBQUM7Z0JBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUMzRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN2RTthQUNKO1lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ3hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqRTtnQkFDRCwyREFBMkQ7Z0JBQzNELHNDQUFzQztnQkFDdEMsR0FBRzthQUNOO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0RCxDQUFDO0tBQ0o7SUFqU0QsZ0NBaVNDO0lBRUQsU0FBZ0IsSUFBSTtRQUNoQixVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUZELG9CQUVDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XHJcbmltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImdhbWUvd29ybGRcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCJnYW1lL2dhbWVcIjtcclxuaW1wb3J0IHsgQ29tcGFueSB9IGZyb20gXCJnYW1lL2NvbXBhbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXZlRGlhbG9nIHtcclxuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBnYW1lOiBHYW1lO1xyXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuXHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogU2F2ZURpYWxvZyB7XHJcbiAgICAgICAgaWYgKFNhdmVEaWFsb2cuaW5zdGFuY2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgU2F2ZURpYWxvZy5pbnN0YW5jZSA9IG5ldyBTYXZlRGlhbG9nKCk7XHJcbiAgICAgICAgcmV0dXJuIFNhdmVEaWFsb2cuaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xyXG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXHJcbiAgICAgICAgdmFyIHNkb20gPSBgXHJcbiAgICAgICAgICA8ZGl2IGhpZGRlbiBpZD1cIlNhdmVEaWFsb2dcIiBjbGFzcz1cIlNhdmVEaWFsb2dcIj5cclxuICAgICAgICAgICAgPGRpdj48L2Rpdj5cclxuICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIHRoaXMuZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcclxuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJTYXZlRGlhbG9nXCIpO1xyXG4gICAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgc2RvbSA9IGBcclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDx0YWJsZT5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVuYW1lOiA8aW5wdXQgaWQ9XCJzYXZlLWZpbGVuYW1lXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwic2F2ZS1maWxlc1wiIHNpemU9XCI3XCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhdmUtc2F2ZVwiIHRpdGxlPVwic2F2ZVwiPlNhdmU8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz48YnIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic2F2ZS1sb2FkXCIgdGl0bGU9XCJzYXZlXCI+TG9hZDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIvPjxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzYXZlLWRlbGV0ZVwiIHRpdGxlPVwic2F2ZVwiPkRlbGV0ZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIvPjxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzYXZlLWV4cG9ydFwiIHRpdGxlPVwic2F2ZVwiPkV4cG9ydDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIvPjxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzYXZlLWltcG9ydFwiIHRpdGxlPVwic2F2ZVwiPkltcG9ydDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnIvPjxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzYXZlLWNhbmNlbFwiIHRpdGxlPVwic2F2ZVwiPkNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj4gICAgXHJcblxyXG4gICAgICAgICAgICA8L3RhYmxlPiAgICAgICAgIFxyXG4gICAgICAgICAgIDwvZGl2PiBcclxuICAgICAgICAgICAgYDtcclxuICAgICAgICB2YXIgbmV3ZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcclxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQobmV3ZG9tKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XHJcbiAgICAgICAgLy8gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjU2F2ZURpYWxvZy10YWJzXCIpLnRhYnMoe1xyXG4gICAgICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgX3RoaXMuYmluZEFjdGlvbnMoKTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB9XHJcbiAgICBiaW5kQWN0aW9ucygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBpZGZpbGVuYW1lID0gKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1maWxlbmFtZVwiKSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWNhbmNlbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIF90aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLXNhdmVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaWRmaWxlbmFtZS52YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvcjpGaWxlbmFtZSBpcyBlbXB0eVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy5zYXZlKGlkZmlsZW5hbWUudmFsdWUpO1xyXG4gICAgICAgICAgICBfdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1sb2FkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlkZmlsZW5hbWUudmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3I6RmlsZW5hbWUgaXMgZW1wdHlcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMubG9hZChpZGZpbGVuYW1lLnZhbHVlKTtcclxuICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmUtZmlsZXNcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWRmaWxlbmFtZS52YWx1ZSA9ICg8YW55PmV2LnRhcmdldCkudmFsdWU7Ly8uc3Vic3RyaW5nKDQpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWRlbGV0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJzYXZlXCIraWRmaWxlbmFtZS52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgdmFyIGxpc3QgPSBbXTtcclxuICAgICAgICB2YXIgcmV0ID0gXCJcIlxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB3aW5kb3cubG9jYWxTdG9yYWdlKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChcInNhdmVcIikpIHtcclxuICAgICAgICAgICAgICAgIHJldCArPSAnPG9wdGlvbiB2YWx1ZT1cIicgKyBrZXkuc3Vic3RyaW5nKDQpICsgJ1wiPicgKyBrZXkuc3Vic3RyaW5nKDQpICsgJzwvb3B0aW9uPic7XHJcbiAgICAgICAgICAgICAgICAvL2xpc3QucHVzaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1maWxlc1wiKS5pbm5lckhUTUwgPSByZXQ7XHJcbiAgICAgICAgdmFyIGxhc3QgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJsYXN0Z2FtZVwiKTtcclxuICAgICAgICBpZiAobGFzdClcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1maWxlbmFtZVwiKSkudmFsdWUgPSBsYXN0O1xyXG5cclxuICAgIH1cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgLy91aS10YWJzLWFjdGl2ZVxyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIlN0YXRpc3RpY3NcIixcclxuICAgICAgICAgICAgd2lkdGg6IFwiNDAwcHhcIixcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXHJcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5kaWFsb2coXCJ3aWRnZXRcIikuZmluZChcIi51aS1kaWFsb2ctdGl0bGViYXItY2xvc2VcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuZGlhbG9nKFwid2lkZ2V0XCIpLmRyYWdnYWJsZShcIm9wdGlvblwiLCBcImNvbnRhaW5tZW50XCIsIFwibm9uZVwiKTtcclxuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xyXG4gICAgfVxyXG4gICAgc2F2ZShmaWxlbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLnBhdXNlKCk7XHJcbiAgICAgICAgdmFyIHNkYXRhID0gSlNPTi5zdHJpbmdpZnkodGhpcy5nYW1lLCAoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgdmFyIHJldDogYW55ID0ge307XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IFwibGFzdFVwZGF0ZVwiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJXb3JsZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHJldC5nYW1lO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmFsdWU/LmNvbnN0cnVjdG9yPy5uYW1lID09PSBcIkFpcnBsYW5lXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHJldC53b3JsZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJDaXR5XCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHJldCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHJldC53b3JsZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJDb21wYW55XCIpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcmV0LmNpdHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZT8uY29uc3RydWN0b3I/Lm5hbWUgPT09IFwiUm91dGVcIikge1xyXG5cclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmV0LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcmV0LmFpcnBsYW5lO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfSwgXCJcXHRcIik7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2F2ZVwiICsgZmlsZW5hbWUsIHNkYXRhKTtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJsYXN0Z2FtZVwiLCBmaWxlbmFtZSk7XHJcbiAgICAgICAgLy90aGlzLmxvYWQoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhzZGF0YSk7XHJcbiAgICAgICAgdGhpcy5nYW1lLnJlc3VtZSgpO1xyXG5cclxuICAgIH1cclxuICAgIGxvYWQoZmlsZW5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5wYXVzZSgpO1xyXG4gICAgICAgIHZhciBkYXRhID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F2ZVwiICsgZmlsZW5hbWUpO1xyXG4gICAgICAgIHZhciByZXQgPSBKU09OLnBhcnNlKGRhdGEsIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciByOiBhbnkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gXCJwYXJhbWV0ZXJcIikge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwYXJhbWV0ZXIsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyYW1ldGVyLmFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdID0gbmV3IFByb2R1Y3QocGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmFsdWU/LnR5cGUgPT09IFwiQ29tcGFueVwiKSB7XHJcbiAgICAgICAgICAgICAgICByID0gbmV3IENvbXBhbnkoKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIlByb2R1Y3RcIikge1xyXG4gICAgICAgICAgICAgICAgciA9IG5ldyBQcm9kdWN0KHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkFpcnBsYW5lXCIpIHtcclxuICAgICAgICAgICAgICAgIHIgPSBuZXcgQWlycGxhbmUodW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIldvcmxkXCIpIHtcclxuICAgICAgICAgICAgICAgIHIgPSBuZXcgV29ybGQoKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbHVlPy50eXBlID09PSBcIkNpdHlcIikge1xyXG4gICAgICAgICAgICAgICAgciA9IG5ldyBDaXR5KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUud2FyZWhvdXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvcCA9IHZhbHVlLndhcmVob3VzZTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaG9wcyA9IHZhbHVlLndhcmVob3VzZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2hvcFNlbGxpbmdQcmljZSA9IHZhbHVlLndhcmVob3VzZVNlbGxpbmdQcmljZTtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWUud2FyZWhvdXNlU2VsbGluZ1ByaWNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZS53YXJlaG91c2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlLndhcmVob3VzZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHIsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gXCJSb3V0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByID0gbmV3IFJvdXRlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUubG9hZFdhcmVob3VzZUFtb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmxvYWRTaG9wQW1vdW50ID0gdmFsdWUubG9hZFdhcmVob3VzZUFtb3VudDtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS51bmxvYWRTaG9wQW1vdW50ID0gdmFsdWUudW5sb2FkV2FyZWhvdXNlQW1vdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmxvYWRTaG9wVW50aWxBbW91bnQgPSB2YWx1ZS5sb2FkV2FyZWhvdXNlVW50aWxBbW91bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlLmxvYWRXYXJlaG91c2VBbW91bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlLnVubG9hZFdhcmVob3VzZUFtb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWUubG9hZFdhcmVob3VzZVVudGlsQW1vdW50O1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ociwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGdhbWUgPSB0aGlzLmdhbWU7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmdhbWUsIHJldCk7XHJcbiAgICAgICAgZ2FtZS53b3JsZC5nYW1lID0gZ2FtZTtcclxuICAgICAgICBnYW1lLmRhdGUgPSBuZXcgRGF0ZShnYW1lLmRhdGUpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZ2FtZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgZ2FtZS53b3JsZC5haXJwbGFuZXNbeF0ud29ybGQgPSBnYW1lLndvcmxkO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGdhbWUud29ybGQuYWlycGxhbmVzW3hdLnJvdXRlLmxlbmd0aDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLndvcmxkLmFpcnBsYW5lc1t4XS5yb3V0ZVt5XS5haXJwbGFuZSA9IGdhbWUud29ybGQuYWlycGxhbmVzW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZ2FtZS53b3JsZC5jaXRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgZ2FtZS53b3JsZC5jaXRpZXNbeF0ud29ybGQgPSBnYW1lLndvcmxkO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGdhbWUud29ybGQuY2l0aWVzW3hdLmNvbXBhbmllcy5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzW3ldLmNpdHkgPSBnYW1lLndvcmxkLmNpdGllc1t4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2Zvcih2YXIgeT0wO3k8dGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzLmxlbmd0aDt5Kyspe1xyXG4gICAgICAgICAgICAvLyAgdGhpcy53b3JsZC5jaXRpZXNbeF0uY29tcGFuaWVzW3ldLlxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9XHJcbiAgICAgICAgZ2FtZS5yZW5kZXIodGhpcy5nYW1lLmRvbSk7XHJcbiAgICAgICAgZ2FtZS5yZXN1bWUoKTtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJsYXN0Z2FtZVwiLCBmaWxlbmFtZSk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIFNhdmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5zaG93KCk7XHJcbn0iXX0=