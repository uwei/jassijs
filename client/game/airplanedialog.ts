import { City } from "game/city";
import { allProducts, Product } from "game/product";
import { Airplane } from "game/airplane";
import { Icons } from "game/icons";
import { Route } from "game/route";
import { RouteDialog } from "game/routedialog";
var css = `
    table{
        font-size:inherit;
    }

    .airplanedialog >*{
        font-size:10px; 
    }
    .ui-dialog-title{ 
        font-size:10px;
    }
    .ui-dialog-titlebar{
        height:10px;
    }
    #route-list>li{
        list-style-type: none; /* Remove bullets */
        padding: 0; /* Remove padding */
        margin: 0;
    }
    #route-list{
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 0px;
    }
`;
//@ts-ignore
window.airplane = function () {
    return AirplaneDialog.getInstance().airplane;
}
export class AirplaneDialog {
    dom: HTMLDivElement;
    private _airplane: Airplane;
    hasPaused = false;
    public static instance;
    public dropCitiesEnabled = false;
    constructor() {
        this.create();
    }
    static getInstance(): AirplaneDialog {
        if (AirplaneDialog.instance === undefined)
            AirplaneDialog.instance = new AirplaneDialog();
        return AirplaneDialog.instance;
    }
    set airplane(value: Airplane) {
        this._airplane = value;
        this.updateRoute();
    }
    get airplane() {
        return this._airplane;
    }
    private createStyle() {
        var style = document.createElement('style');
        style.id = "airplanedialogcss";
        style.type = 'text/css';
        style.innerHTML = css;

        var old = document.getElementById("airplanedialogcss");
        if (old) {
            old.parentNode.removeChild(old);
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    private create() {
        //template for code reloading
        var sdom = `
          <div hidden id="airplanedialog" class="airplanedialog">
            <div></div>
           </div>
        `;
        this.dom = <any>document.createRange().createContextualFragment(sdom).children[0];
        var old = document.getElementById("airplanedialog");
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
            <input id="airplanedialog-prev" type="button" value="<"/>
            <input id="airplanedialog-next" type="button" value=">"/>
          </div>
            <div id="airplanedialog-tabs">
                <ul>
                    <li><a href="#airplanedialog-products" class="airplanedialog-tabs">`+ Icons.table.replace('<span', '<span title="Load"') + `</a></li>
                    <li><a href="#airplanedialog-info" class="airplanedialog-tabs">`+ Icons.info.replace('<span', '<span title="Info"') + `</a></li>
                    <li  id="airplanedialog-route-tab"><a href="#airplanedialog-route" class="airplanedialog-tabs">`+ Icons.route.replace('<span', '<span title="Route"') + `</a></li>
                </ul>
                <div id="airplanedialog-products">
                    <div id="airplanedialog-products-list">
                            
                    </div>         
                </div>
                <div id="airplanedialog-info">
                    
                 </div>
                 <div id="airplanedialog-route">
                    <input type="checkbox" id="route-active"> active</input>
                    <button id="edit-route">`+Icons.edit + `</button>
                    <ul id="route-list">
                     
           
                    </ul>
                <div>
                
            </div>
          </div>
        `;
        var newdom = <any>document.createRange().createContextualFragment(sdom).children[0];
        this.dom.removeChild(this.dom.children[0]);
        this.dom.appendChild(newdom);
        $("#airplanedialog-tabs").tabs({
            //collapsible: true
        });
        setTimeout(() => {
            $("#airplanedialog-tabs").tabs({
                //collapsible: true
            });
            //  $( "#route-list" ).sortable();
        }, 100);
        document.body.appendChild(this.dom);

        //        document.getElementById("citydialog-prev")
        setTimeout(() => {
            document.getElementById("airplanedialog-next").addEventListener("click", (ev) => {
                var pos = _this.airplane.world.airplanes.indexOf(_this.airplane);
                pos++;
                if (pos >= _this.airplane.world.airplanes.length)
                    pos = 0;
                _this.selectAirplace(_this.airplane.world.airplanes[pos]);
            });
            document.getElementById("airplanedialog-prev").addEventListener("click", (ev) => {
                var pos = _this.airplane.world.airplanes.indexOf(_this.airplane);
                pos--;
                if (pos === -1)
                    pos = _this.airplane.world.airplanes.length - 1;
                _this.airplane = _this.airplane.world.airplanes[pos];
                _this.update(true);
            });
            document.getElementById("route-active").addEventListener('click', (e) => {
                var act = ((<any>document.getElementById("route-active")).checked ? 1 : -1);
                if (act === -1 && _this.airplane.activeRoute === 0)
                    _this.airplane.activeRoute = -1;
                else
                    _this.airplane.activeRoute = act * Math.abs(_this.airplane.activeRoute)
            });
            $('.airplanedialog-tabs').click(function (event) {
                if (event.target.getAttribute("href") === "#airplanedialog-route" ||
                    (<any>event.target.parentNode).getAttribute("href") === "#airplanedialog-route") {
                    _this.enableDropCities(true);
                } else {
                    _this.enableDropCities(false);
                }
            });
            document.getElementById("edit-route").addEventListener('click', (e) => {
                RouteDialog.getInstance().airplane=_this.airplane;
                RouteDialog.getInstance().route=undefined;
                if(_this.airplane.route.length>0)
                    RouteDialog.getInstance().route=_this.airplane.route[0];
                else{
                    alert("no route defined");
                    return;
                }
                RouteDialog.getInstance().show();
            });
            
        }, 500);
        //document.createElement("span");
    }
    enableDropCities(enable: boolean) {
        var _this=this;
        console.log("route "+(enable ? "enable" : "disable"));
        if (this.dropCitiesEnabled && !enable) {
            $(".city").draggable('destroy');
        }
        if (this.dropCitiesEnabled === false && enable) {
            $(".city").draggable({
                connectToSortable: '#route-list',
                helper: function (event) {
                    var id = parseInt(event.target.getAttribute("cityid"));
                    var city=_this.airplane.world.cities[id];
                    var ret = '<li id="route-' + id + '" class="ui-state-default"><img src="' + city.icon + '" </img>' + city.name + "</li>";

                    return $(ret);
                    // return helper._position.dom;
                },
                revert: 'invalid'
            });
        }
        this.dropCitiesEnabled=enable;
    }
    updateData() {
        var _this = this;
        var childs = document.getElementById("route-list").children;
        var old: Route[] = [];
        for (var x = 0; x < _this.airplane.route.length; x++) {
            old.push(_this.airplane.route[x]);
        }
        _this.airplane.route = [];
        for (var x = 0; x < childs.length; x++) {
            if (childs[x].id === "route-dummy")
                continue;
            var sid = childs[x].id.split("-")[1];
            var id = parseInt(sid);
            var found: Route = undefined;
            for (var y = 0; y < old.length; y++) {
                if (old[y].cityid === id) {
                    found = old[y];
                    old.splice(y, 1);
                    break;
                }
            }
            if (found === undefined) {
                found = new Route();
                found.cityid = id;
            }
            _this.airplane.route.push(found);
        }
    }
    updateRoute() {
        var _this = this;
        if (document.getElementById("route-list") === null)
            return;
        var html = "";
        if (this.airplane.route.length === 0)
            html = '<li id="route-dummy">drag and drop cities here</li>';
        var ids = [];
        for (var x = 0; x < this.airplane.route.length; x++) {
            var id = this.airplane.route[x].cityid;
            html += '<li id="route-' + id + '" class="ui-state-default"><img src="' + this.airplane.world.cities[id].icon + '" </img>' +
                this.airplane.world.cities[id].name + " " + Icons.trash.replace("mdi ", "mdi route-delete") + "</li>";

            ids.push(this.airplane.route[x].cityid);
            //var sdom;
            //var dom:HTMLSpanElement= <any>document.createRange().createContextualFragment(sdom).children[0];

        }
        document.getElementById("route-list").innerHTML = html;
        $("#route-list").sortable({
            update: (event, ui) => {
                _this.updateData();
                setTimeout(() => {
                    _this.updateRoute();

                }, 50);
            }
        });


        //  $("airplanedialog-route").sortable
        //                   <span>`+this.airplane.world.cities[0].icon+this.airplane.world.cities[0].name+`</span> 
        //                 <span>`+this.airplane.world.cities[1].icon+this.airplane.world.cities[1].name+`</span> 
        //               <span>`+this.airplane.world.cities[3].icon+this.airplane.world.cities[3].name+`</span> 

    }
    selectAirplace(ap) {
        this.airplane = ap;
        ap.world.selection?.unselect();
        ap.world.selection = ap;
        ap.select();
        this.update(true);

    }
    update(force = false) {
        var _this = this;
        if (this.airplane === undefined)
            return;
        var ret = '<div style="display:grid;grid-template-columns: 30px 30px 30px 30px;">';
        for (var x = 0; x < allProducts.length; x++) {
            if (this.airplane.products[x] !== 0) {
                ret = ret + '<div>' + allProducts[x].getIcon() + " " + this.airplane.products[x] + " " + "</div>";
            }
        }
        ret += "<div>";
        document.getElementById("airplanedialog-products-list").innerHTML = ret;
        this.updateTitle();
        $(".route-delete").click(function () {
            $(this).closest('li').remove();
            _this.updateData();
        });
        (<any>document.getElementById("route-active")).checked = (this.airplane.activeRoute > -1);
        /*
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
  
          }*/

    }
    updateTitle() {
        var sicon = '';
        if ($(this.dom).parent().find('.ui-dialog-title').length > 0)
            $(this.dom).parent().find('.ui-dialog-title')[0].innerHTML = this.airplane.name + " " + this.airplane.status; //'<img style="float: right" id="citydialog-icon" src="' + this.city.icon + '"  height="15"></img> ' + this.city.name + " " + this.city.people;
    }
    show() {
        var _this = this;
        this.dom.removeAttribute("hidden");
        this.update();
        if ($("#airplanedialog-route-tab").hasClass("ui-tabs-active")) {
            _this.enableDropCities(true);
        }
        //ui-tabs-active
        $(this.dom).dialog({
            width: "190px",
            //     position:{my:"left top",at:"right top",of:$(document)} ,
            open: function (event, ui) {
                _this.update(true);
            },
            close: function () {
                _this.enableDropCities(false);
            }
        });
        $(this.dom).parent().css({ position: "fixed" });

    }
    close() {
        $(this.dom).dialog("close");
    }
}