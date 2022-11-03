
import { Product } from "game/product";
import { Airplane } from "game/airplane";
import { Icons } from "game/icons";
import { Route } from "game/route";
import { City } from "game/city";
import { World } from "game/world";
import { Game } from "game/game";
import { Company } from "game/company";

export class SaveDialog {
    dom: HTMLDivElement;
    game: Game;
    public static instance;

    constructor() {

        this.create();

    }
    static getInstance(): SaveDialog {
        if (SaveDialog.instance === undefined)
            SaveDialog.instance = new SaveDialog();
        return SaveDialog.instance;
    }


    private create() {
        //template for code reloading
        var sdom = `
          <div hidden id="SaveDialog" class="SaveDialog">
            <div></div>
           </div>
        `;
        this.dom = <any>document.createRange().createContextualFragment(sdom).children[0];
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
        var newdom = <any>document.createRange().createContextualFragment(sdom).children[0];
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
        var idfilename = (<HTMLInputElement>document.getElementById("save-filename"));
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
            idfilename.value = (<any>ev.target).getAttribute("value");//.substring(4);
            var el = <HTMLElement>ev.target;
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
        var ret = ""
        for (var key in window.localStorage) {
            if (key.startsWith("save")) {
                ret += '<li value="' + key.substring(4) + '">' + key.substring(4) + '</li>';
                //list.push();
            }
        }
        document.getElementById("save-files").innerHTML = ret;
        var last = window.localStorage.getItem("lastgame");
        if (last)
            (<HTMLInputElement>document.getElementById("save-filename")).value = last;

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
    save(filename: string) {
        this.game.pause();
        var sdata = JSON.stringify(this.game, (key: string, value: any) => {
            var ret: any = {};
            if (value instanceof HTMLElement) {
                return undefined;
            }
            if (key === "lastUpdate")
                return undefined;
            if (value?.constructor?.name === "World") {
                Object.assign(ret, value);
                delete ret.game;
                return ret;
            }
            if (value?.constructor?.name === "Airplane") {

                Object.assign(ret, value);
                delete ret.world;
                return ret;
            }
            if (value?.constructor?.name === "City") {

                Object.assign(ret, value);
                delete ret.world;
                return ret;
            }
            if (value?.constructor?.name === "Company") {
                Object.assign(ret, value);
                delete ret.city;
                return ret;
            }
            if (value?.constructor?.name === "Route") {

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
    load(filename: string) {
        this.game.pause();
        var data = window.localStorage.getItem("save" + filename);
        var ret = JSON.parse(data, (key, value) => {
            var r: any = value;
            if (value === null)
                return undefined;
            if (key === "parameter") {
                Object.assign(parameter, value);
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    parameter.allProducts[x] = new Product(parameter.allProducts[x]);
                }
            }
            if (value?.type === "Company") {
                r = new Company();
                Object.assign(r, value);
                return r;
            }
            if (value?.type === "Product") {
                r = new Product(value);
                Object.assign(r, value);
                return r;
            }
            if (value?.type === "Airplane") {
                r = new Airplane(undefined);
                Object.assign(r, value);
                return r;
            }
            if (value?.type === "World") {
                r = new World();
                Object.assign(r, value);
                return r;
            }
            if (value?.type === "City") {
                r = new City();
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
            if (value?.type === "Route") {
                r = new Route();
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

export function test() {
    SaveDialog.getInstance().show();
}
