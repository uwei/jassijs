import { City } from "game/city";
import { Product } from "game/product";
import { Airplane } from "game/airplane";
import { Icons } from "game/icons";
import { Route } from "game/route";
import { RouteDialog } from "game/routedialog";
import { SquadronDialog } from "game/squadrondialog";

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
        var airplane = this.airplane;
        var products = window.parameter.allProducts;
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
                    <input type="text" id="airplanedialog-name"> </input>
                    <span id="airplanedialog-type">Type:</span><br/>
                    <span id="airplanedialog-speed">Speed:</span><br/>
                    <span id="airplanedialog-capacity">Capacity:</span><br/> 
                    <span id="airplanedialog-costs">Daily Costs:</span><br/> 
                    <button style="font-size:14px" id="upgrade-squadron" class="mybutton">Upgrade</button>
                    <button style="font-size:14px" id="delete-airplane" class="mybutton">`+ Icons.remove + `</button>
                 </div>
                 <div id="airplanedialog-route" style="min-height:80px">
                    
                    <input type="checkbox" id="route-active"> active</input>
                    <button style="font-size:14px" id="edit-route" class="mybutton">`+ Icons.edit + `</button>
                    <button style="font-size:14px"  id="delete-route" class="mybutton">`+ Icons.remove + `</button>
                    <ul style="min-heigt:40px" class="mylist" id="route-list">
                     
           
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
                else{
                    _this.airplane.activeRoute = act * Math.abs(_this.airplane.activeRoute);
                    _this.airplane.flyTo(_this.airplane.world.cities[_this.airplane.route[0].cityid]);
                }
            });

            document.getElementById("airplanedialog-name").addEventListener("change", (e) => {
                var t = <HTMLInputElement>e.target;
                var val = t.value;
                if (this.airplane.world.findAirplane(val) !== undefined) {
                    alert("an airplane with name " + val + " already exists");
                    return;
                }
                _this.airplane.name = val;
                _this.update();
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
                _this.enableDropCities(false);
                RouteDialog.getInstance().airplane = _this.airplane;
                RouteDialog.getInstance().route = undefined;
                if (_this.airplane.route.length > 0)
                    RouteDialog.getInstance().route = _this.airplane.route[0];
                else {
                    alert("no route defined");
                    return;
                }
                RouteDialog.getInstance().show();
            });
            document.getElementById("upgrade-squadron").addEventListener('click', (e) => {
                _this.airplane.upgrade();
                _this.update();
                //SquadronDialog.getInstance().airplane = _this.airplane;
                //SquadronDialog.getInstance().show();
            });
             document.getElementById("delete-airplane").addEventListener('click', (e) => {
                 if (confirm(`Delete the the entire squadron?`)) {
                    _this.deleteAirplane(_this.airplane);
                 }
            });
            document.getElementById("delete-route").addEventListener('click', (e) => {
                var select = document.getElementById("route-list");
                for (var x = 0; x < select.children.length; x++) {
                    if (select.children[x].classList.contains("active-listitem")) {
                        $(select.children[x]).remove();

                    }
                }
                _this.updateData();

            });
            document.getElementById("route-list").addEventListener('click', (e) => {
                _this.selectCíty(e);
            });
            document.getElementById("route-list").addEventListener('touchstart', (e) => {
                _this.selectCíty(e);
            });
            $("#delete-route").droppable({
                drop: (e, e2) => {
                    $(e2.draggable[0]).remove();
                    _this.updateData();
                }
            });
        }, 500);
        //document.createElement("span");
    }
    deleteAirplane(ap:Airplane){

        for(var x=0;x<ap.squadron.length;x++){
            this.deleteAirplane(ap.squadron[x]);
            ap.squadron=[];
        }
        var pos=this.airplane.world.airplanes.indexOf(ap);
        if(pos!==-1)
            this.airplane.world.airplanes.splice(pos,1);
        if(ap.dom?.style)
            ap.dom.style.display="none";
        if(ap.dom)
            this.airplane.world.dom.removeChild(ap.dom);
        this.update();
    }
    selectCíty(e) {
        var el = <HTMLElement>$(e.target).closest('li')[0];

        if (el.id.split("-").length > 1) {
            var id = parseInt(el.id.split("-")[1]);
            var select = document.getElementById("route-list");
            for (var x = 0; x < select.children.length; x++) {
                select.children[x].classList.remove("active-listitem");
            }

        }
        el.classList.add("active-listitem");
    }
    enableDropCities(enable: boolean) {
        var _this = this;
        console.log("route " + (enable ? "enable" : "disable"));
        if (this.dropCitiesEnabled && !enable) {
            for (var x = 0; x < this.airplane.world.cities.length; x++) {
                try {
                    $(this.airplane.world.cities[x].dom).draggable('destroy');
                } catch {

                }
            }

        }
        if (this.dropCitiesEnabled === false && enable) {
            $(".city").draggable({
                connectToSortable: '#route-list',
                helper: function (event) {
                    var id = parseInt(event.target.getAttribute("cityid"));
                    var city = _this.airplane.world.cities[id];
                    var ret = '<li id="route-' + id + '" class="ui-state-default"><img style="width:20px" src="' + city.icon + '" </img>' + city.name + "</li>";

                    return $(ret);
                    // return helper._position.dom;
                },
                revert: 'invalid'
            });
            for (var x = 0; x < _this.airplane.world.cities.length; x++) {
                if (this.airplane.world.cities[x].hasAirport === false) {
                    $(this.airplane.world.cities[x].dom).draggable('disable');
                }
            }
        }
        this.dropCitiesEnabled = enable;
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
                found.airplane = _this.airplane;
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
        //if (this.airplane.route.length === 0)
        //  html = '<li id="route-dummy">drag and drop cities here</br></li>';
        var ids = [];
        for (var x = 0; x < this.airplane.route.length; x++) {
            var id = this.airplane.route[x].cityid;
            html += '<li id="route-' + id + '" class="ui-state-default"><img style="width:20px;" src="' + this.airplane.world.cities[id].icon + '" </img>' +
                this.airplane.world.cities[id].name + "</li>";

            ids.push(this.airplane.route[x].cityid);
            //var sdom;
            //var dom:HTMLSpanElement= <any>document.createRange().createContextualFragment(sdom).children[0];

        }
        html += '<li id="route-dummy">drag and drop<br/> cities here</li>';
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
    updateInfo() {
        if (document.activeElement !== document.getElementById("airplanedialog-name"))
            (<HTMLInputElement>document.getElementById("airplanedialog-name")).value = this.airplane.name;
        (<HTMLInputElement>document.getElementById("airplanedialog-type")).innerHTML = "Type: " + this.airplane.typeid;
        (<HTMLInputElement>document.getElementById("airplanedialog-speed")).innerHTML = "Speed: " + this.airplane.speed;
        (<HTMLInputElement>document.getElementById("airplanedialog-capacity")).innerHTML = "Capacity:" + this.airplane.loadedCount + "/" + this.airplane.capacity;
        (<HTMLInputElement>document.getElementById("airplanedialog-costs")).innerHTML = "Daily costs:" + this.airplane.costs;
    }
    update(force = false) {
        var _this = this;
        if (this.airplane === undefined)
            return;
        try {
            if (!$(this.dom).dialog('isOpen')) {
                return;
            }
        } catch {
            return;
        }
        var ret = '<div style="display:grid;grid-template-columns: 30px 30px 30px 30px;">';
        for (var x = 0; x < parameter.allProducts.length; x++) {
            if (this.airplane.products[x] !== 0) {
                ret = ret + '<div>' + parameter.allProducts[x].getIcon() + " " + this.airplane.products[x] + " " + "</div>";
            }
        }
        ret += "<div>";
        document.getElementById("airplanedialog-products-list").innerHTML = ret;
        this.updateTitle();

        (<any>document.getElementById("route-active")).checked = (this.airplane.activeRoute > -1);
        this.updateInfo();

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
        var dlg = $(this.dom).dialog({
            width: "190px",
            draggable: true,
            //     position:{my:"left top",at:"right top",of:$(document)} ,
            open: function (event, ui) {

                _this.update(true);
            },
            close: function () {
                _this.close();
            },
            create: function (e) {
                setTimeout(() => {
                    $(e.target).dialog("widget").find(".ui-dialog-titlebar-close")[0].addEventListener('touchstart', (e) => {
                        _this.close();
                    });
                }, 200);
            },
            resizable: false
        });
        dlg.dialog("widget").draggable("option", "containment", "none");
        $(this.dom).parent().css({ position: "fixed" });

    }
    close() {
        this.enableDropCities(false);
        $(this.dom).dialog("close");
    }
}