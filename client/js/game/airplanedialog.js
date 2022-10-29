define(["require", "exports", "game/icons", "game/route", "game/routedialog", "game/squadrondialog"], function (require, exports, icons_1, route_1, routedialog_1, squadrondialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AirplaneDialog = void 0;
    //@ts-ignore
    window.airplane = function () {
        return AirplaneDialog.getInstance().airplane;
    };
    class AirplaneDialog {
        constructor() {
            this.hasPaused = false;
            this.dropCitiesEnabled = false;
            this.create();
        }
        static getInstance() {
            if (AirplaneDialog.instance === undefined)
                AirplaneDialog.instance = new AirplaneDialog();
            return AirplaneDialog.instance;
        }
        set airplane(value) {
            this._airplane = value;
            this.updateRoute();
        }
        get airplane() {
            return this._airplane;
        }
        create() {
            //template for code reloading
            var sdom = `
          <div hidden id="airplanedialog" class="airplanedialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
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
                    <li><a href="#airplanedialog-products" class="airplanedialog-tabs">` + icons_1.Icons.table.replace('<span', '<span title="Load"') + `</a></li>
                    <li><a href="#airplanedialog-info" class="airplanedialog-tabs">` + icons_1.Icons.info.replace('<span', '<span title="Info"') + `</a></li>
                    <li  id="airplanedialog-route-tab"><a href="#airplanedialog-route" class="airplanedialog-tabs">` + icons_1.Icons.route.replace('<span', '<span title="Route"') + `</a></li>
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
                    <button style="font-size:14px" id="edit-squadron">` + icons_1.Icons.edit + `</button>
                 </div>
                 <div id="airplanedialog-route">
                    
                    <input type="checkbox" id="route-active"> active</input>
                    <button style="font-size:14px" id="edit-route">` + icons_1.Icons.edit + `</button>
                    <button style="font-size:14px"  id="delete-route">` + icons_1.Icons.remove + `</button>
                    <ul style="min-heigt:40px" id="route-list">
                     
           
                    </ul>
                <div>
                
            </div>
          </div>
        `;
            var newdom = document.createRange().createContextualFragment(sdom).children[0];
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
                    var act = (document.getElementById("route-active").checked ? 1 : -1);
                    if (act === -1 && _this.airplane.activeRoute === 0)
                        _this.airplane.activeRoute = -1;
                    else
                        _this.airplane.activeRoute = act * Math.abs(_this.airplane.activeRoute);
                });
                document.getElementById("airplanedialog-name").addEventListener("change", (e) => {
                    var t = e.target;
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
                        event.target.parentNode.getAttribute("href") === "#airplanedialog-route") {
                        _this.enableDropCities(true);
                    }
                    else {
                        _this.enableDropCities(false);
                    }
                });
                document.getElementById("edit-route").addEventListener('click', (e) => {
                    _this.enableDropCities(false);
                    routedialog_1.RouteDialog.getInstance().airplane = _this.airplane;
                    routedialog_1.RouteDialog.getInstance().route = undefined;
                    if (_this.airplane.route.length > 0)
                        routedialog_1.RouteDialog.getInstance().route = _this.airplane.route[0];
                    else {
                        alert("no route defined");
                        return;
                    }
                    routedialog_1.RouteDialog.getInstance().show();
                });
                document.getElementById("edit-squadron").addEventListener('click', (e) => {
                    squadrondialog_1.SquadronDialog.getInstance().airplane = _this.airplane;
                    squadrondialog_1.SquadronDialog.getInstance().show();
                });
                document.getElementById("delete-route").addEventListener('click', (e) => {
                    var select = document.getElementById("route-list");
                    for (var x = 0; x < select.children.length; x++) {
                        if (select.children[x].classList.contains("active-route")) {
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
        selectCíty(e) {
            var el = $(e.target).closest('li')[0];
            if (el.id.split("-").length > 1) {
                var id = parseInt(el.id.split("-")[1]);
                var select = document.getElementById("route-list");
                for (var x = 0; x < select.children.length; x++) {
                    select.children[x].classList.remove("active-route");
                }
            }
            el.classList.add("active-route");
        }
        enableDropCities(enable) {
            var _this = this;
            console.log("route " + (enable ? "enable" : "disable"));
            if (this.dropCitiesEnabled && !enable) {
                for (var x = 0; x < this.airplane.world.cities.length; x++) {
                    try {
                        $(this.airplane.world.cities[x].dom).draggable('destroy');
                    }
                    catch (_a) {
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
            var old = [];
            for (var x = 0; x < _this.airplane.route.length; x++) {
                old.push(_this.airplane.route[x]);
            }
            _this.airplane.route = [];
            for (var x = 0; x < childs.length; x++) {
                if (childs[x].id === "route-dummy")
                    continue;
                var sid = childs[x].id.split("-")[1];
                var id = parseInt(sid);
                var found = undefined;
                for (var y = 0; y < old.length; y++) {
                    if (old[y].cityid === id) {
                        found = old[y];
                        old.splice(y, 1);
                        break;
                    }
                }
                if (found === undefined) {
                    found = new route_1.Route();
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
            var _a;
            this.airplane = ap;
            (_a = ap.world.selection) === null || _a === void 0 ? void 0 : _a.unselect();
            ap.world.selection = ap;
            ap.select();
            this.update(true);
        }
        updateInfo() {
            if (document.activeElement !== document.getElementById("airplanedialog-name"))
                document.getElementById("airplanedialog-name").value = this.airplane.name;
            document.getElementById("airplanedialog-type").innerHTML = "Type: " + this.airplane.typeid;
            document.getElementById("airplanedialog-speed").innerHTML = "Speed: " + this.airplane.speed;
            document.getElementById("airplanedialog-capacity").innerHTML = "Capacity:" + this.airplane.loadedCount + "/" + this.airplane.capacity;
        }
        update(force = false) {
            var _this = this;
            if (this.airplane === undefined)
                return;
            try {
                if (!$(this.dom).dialog('isOpen')) {
                    return;
                }
            }
            catch (_a) {
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
            document.getElementById("route-active").checked = (this.airplane.activeRoute > -1);
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
                create: function () {
                    setTimeout(() => {
                        var j = dlg.dialog("widget").find(".ui-dialog-titlebar-close");
                        j[0].addEventListener('touchstart', (e) => {
                            _this.close();
                        });
                    }, 200);
                }
            });
            dlg.dialog("widget").draggable("option", "containment", "none");
            $(this.dom).parent().css({ position: "fixed" });
        }
        close() {
            $(this.dom).dialog("close");
        }
    }
    exports.AirplaneDialog = AirplaneDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycGxhbmVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2FpcnBsYW5lZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFRQSxZQUFZO0lBQ1osTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE9BQU8sY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxDQUFDLENBQUE7SUFDRCxNQUFhLGNBQWM7UUFNdkI7WUFIQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBRVgsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1lBRTdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLGNBQWMsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDckMsY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25ELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsSUFBSSxRQUFRLENBQUMsS0FBZTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksUUFBUTtZQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBRU8sTUFBTTtZQUNWLDZCQUE2QjtZQUM3QixJQUFJLElBQUksR0FBRzs7OztTQUlWLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFV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QUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFOzRCQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2xCLENBQUMsQ0FBQyxDQUFDO29CQUNILENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQztnQkFDWCxDQUFDO2FBQ0osQ0FBQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXBELENBQUM7UUFDRCxLQUFLO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBalhELHdDQWlYQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XG5pbXBvcnQgeyBQcm9kdWN0IH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xuaW1wb3J0IHsgUm91dGUgfSBmcm9tIFwiZ2FtZS9yb3V0ZVwiO1xuaW1wb3J0IHsgUm91dGVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9yb3V0ZWRpYWxvZ1wiO1xuaW1wb3J0IHsgU3F1YWRyb25EaWFsb2cgfSBmcm9tIFwiZ2FtZS9zcXVhZHJvbmRpYWxvZ1wiO1xuXG4vL0B0cy1pZ25vcmVcbndpbmRvdy5haXJwbGFuZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5haXJwbGFuZTtcbn1cbmV4cG9ydCBjbGFzcyBBaXJwbGFuZURpYWxvZyB7XG4gICAgZG9tOiBIVE1MRGl2RWxlbWVudDtcbiAgICBwcml2YXRlIF9haXJwbGFuZTogQWlycGxhbmU7XG4gICAgaGFzUGF1c2VkID0gZmFsc2U7XG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcbiAgICBwdWJsaWMgZHJvcENpdGllc0VuYWJsZWQgPSBmYWxzZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcbiAgICB9XG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IEFpcnBsYW5lRGlhbG9nIHtcbiAgICAgICAgaWYgKEFpcnBsYW5lRGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBBaXJwbGFuZURpYWxvZy5pbnN0YW5jZSA9IG5ldyBBaXJwbGFuZURpYWxvZygpO1xuICAgICAgICByZXR1cm4gQWlycGxhbmVEaWFsb2cuaW5zdGFuY2U7XG4gICAgfVxuICAgIHNldCBhaXJwbGFuZSh2YWx1ZTogQWlycGxhbmUpIHtcbiAgICAgICAgdGhpcy5fYWlycGxhbmUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVSb3V0ZSgpO1xuICAgIH1cbiAgICBnZXQgYWlycGxhbmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9haXJwbGFuZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJhaXJwbGFuZWRpYWxvZ1wiIGNsYXNzPVwiYWlycGxhbmVkaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nXCIpO1xuICAgICAgICBpZiAob2xkKSB7XG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhaXJwbGFuZSA9IHRoaXMuYWlycGxhbmU7XG4gICAgICAgIHZhciBwcm9kdWN0cyA9IHdpbmRvdy5wYXJhbWV0ZXIuYWxsUHJvZHVjdHM7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBzZG9tID0gYFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImFpcnBsYW5lZGlhbG9nLXByZXZcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI8XCIvPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiYWlycGxhbmVkaWFsb2ctbmV4dFwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIj5cIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctdGFic1wiPlxuICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjYWlycGxhbmVkaWFsb2ctcHJvZHVjdHNcIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5gKyBJY29ucy50YWJsZS5yZXBsYWNlKCc8c3BhbicsICc8c3BhbiB0aXRsZT1cIkxvYWRcIicpICsgYDwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNhaXJwbGFuZWRpYWxvZy1pbmZvXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+YCsgSWNvbnMuaW5mby5yZXBsYWNlKCc8c3BhbicsICc8c3BhbiB0aXRsZT1cIkluZm9cIicpICsgYDwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGkgIGlkPVwiYWlycGxhbmVkaWFsb2ctcm91dGUtdGFiXCI+PGEgaHJlZj1cIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiIGNsYXNzPVwiYWlycGxhbmVkaWFsb2ctdGFic1wiPmArIEljb25zLnJvdXRlLnJlcGxhY2UoJzxzcGFuJywgJzxzcGFuIHRpdGxlPVwiUm91dGVcIicpICsgYDwvYT48L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXByb2R1Y3RzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0cy1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgIFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1pbmZvXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiYWlycGxhbmVkaWFsb2ctbmFtZVwiPiA8L2lucHV0PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImFpcnBsYW5lZGlhbG9nLXR5cGVcIj5UeXBlOjwvc3Bhbj48YnIvPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImFpcnBsYW5lZGlhbG9nLXNwZWVkXCI+U3BlZWQ6PC9zcGFuPjxici8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiYWlycGxhbmVkaWFsb2ctY2FwYWNpdHlcIj5DYXBhY2l0eTo8L3NwYW4+PGJyLz4gXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9XCJmb250LXNpemU6MTRweFwiIGlkPVwiZWRpdC1zcXVhZHJvblwiPmArIEljb25zLmVkaXQgKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctcm91dGVcIj5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInJvdXRlLWFjdGl2ZVwiPiBhY3RpdmU8L2lucHV0PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHN0eWxlPVwiZm9udC1zaXplOjE0cHhcIiBpZD1cImVkaXQtcm91dGVcIj5gKyBJY29ucy5lZGl0ICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHN0eWxlPVwiZm9udC1zaXplOjE0cHhcIiAgaWQ9XCJkZWxldGUtcm91dGVcIj5gKyBJY29ucy5yZW1vdmUgKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBzdHlsZT1cIm1pbi1oZWlndDo0MHB4XCIgaWQ9XCJyb3V0ZS1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB2YXIgbmV3ZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20uY2hpbGRyZW5bMF0pO1xuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdkb20pO1xuICAgICAgICAkKFwiI2FpcnBsYW5lZGlhbG9nLXRhYnNcIikudGFicyh7XG4gICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICQoXCIjYWlycGxhbmVkaWFsb2ctdGFic1wiKS50YWJzKHtcbiAgICAgICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vICAkKCBcIiNyb3V0ZS1saXN0XCIgKS5zb3J0YWJsZSgpO1xuICAgICAgICB9LCAxMDApO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcblxuICAgICAgICAvLyAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIilcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMuaW5kZXhPZihfdGhpcy5haXJwbGFuZSk7XG4gICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgICAgaWYgKHBvcyA+PSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICAgICAgICAgIF90aGlzLnNlbGVjdEFpcnBsYWNlKF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1wcmV2XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoX3RoaXMuYWlycGxhbmUpO1xuICAgICAgICAgICAgICAgIHBvcy0tO1xuICAgICAgICAgICAgICAgIGlmIChwb3MgPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdO1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1hY3RpdmVcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBhY3QgPSAoKDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1hY3RpdmVcIikpLmNoZWNrZWQgPyAxIDogLTEpO1xuICAgICAgICAgICAgICAgIGlmIChhY3QgPT09IC0xICYmIF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID09PSAwKVxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA9IC0xO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPSBhY3QgKiBNYXRoLmFicyhfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLW5hbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IHQudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUud29ybGQuZmluZEFpcnBsYW5lKHZhbCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcImFuIGFpcnBsYW5lIHdpdGggbmFtZSBcIiArIHZhbCArIFwiIGFscmVhZHkgZXhpc3RzXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLm5hbWUgPSB2YWw7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnLmFpcnBsYW5lZGlhbG9nLXRhYnMnKS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiI2FpcnBsYW5lZGlhbG9nLXJvdXRlXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+ZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpLmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiI2FpcnBsYW5lZGlhbG9nLXJvdXRlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyh0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdC1yb3V0ZVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5haXJwbGFuZSA9IF90aGlzLmFpcnBsYW5lO1xuICAgICAgICAgICAgICAgIFJvdXRlRGlhbG9nLmdldEluc3RhbmNlKCkucm91dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgICAgIFJvdXRlRGlhbG9nLmdldEluc3RhbmNlKCkucm91dGUgPSBfdGhpcy5haXJwbGFuZS5yb3V0ZVswXTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJubyByb3V0ZSBkZWZpbmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFJvdXRlRGlhbG9nLmdldEluc3RhbmNlKCkuc2hvdygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXQtc3F1YWRyb25cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIFNxdWFkcm9uRGlhbG9nLmdldEluc3RhbmNlKCkuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZTtcbiAgICAgICAgICAgICAgICBTcXVhZHJvbkRpYWxvZy5nZXRJbnN0YW5jZSgpLnNob3coKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtcm91dGVcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxpc3RcIik7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBzZWxlY3QuY2hpbGRyZW4ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdC5jaGlsZHJlblt4XS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmUtcm91dGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZWN0LmNoaWxkcmVuW3hdKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZURhdGEoKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxpc3RcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIF90aGlzLnNlbGVjdEPDrXR5KGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxpc3RcIikuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0Q8OtdHkoZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoXCIjZGVsZXRlLXJvdXRlXCIpLmRyb3BwYWJsZSh7XG4gICAgICAgICAgICAgICAgZHJvcDogKGUsIGUyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICQoZTIuZHJhZ2dhYmxlWzBdKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlRGF0YSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgICAvL2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIH1cbiAgICBzZWxlY3RDw610eShlKSB7XG4gICAgICAgIHZhciBlbCA9IDxIVE1MRWxlbWVudD4kKGUudGFyZ2V0KS5jbG9zZXN0KCdsaScpWzBdO1xuXG4gICAgICAgIGlmIChlbC5pZC5zcGxpdChcIi1cIikubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoZWwuaWQuc3BsaXQoXCItXCIpWzFdKTtcbiAgICAgICAgICAgIHZhciBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxpc3RcIik7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlbGVjdC5jaGlsZHJlbi5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHNlbGVjdC5jaGlsZHJlblt4XS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlLXJvdXRlXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcImFjdGl2ZS1yb3V0ZVwiKTtcbiAgICB9XG4gICAgZW5hYmxlRHJvcENpdGllcyhlbmFibGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgY29uc29sZS5sb2coXCJyb3V0ZSBcIiArIChlbmFibGUgPyBcImVuYWJsZVwiIDogXCJkaXNhYmxlXCIpKTtcbiAgICAgICAgaWYgKHRoaXMuZHJvcENpdGllc0VuYWJsZWQgJiYgIWVuYWJsZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbeF0uZG9tKS5kcmFnZ2FibGUoJ2Rlc3Ryb3knKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIHtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRyb3BDaXRpZXNFbmFibGVkID09PSBmYWxzZSAmJiBlbmFibGUpIHtcbiAgICAgICAgICAgICQoXCIuY2l0eVwiKS5kcmFnZ2FibGUoe1xuICAgICAgICAgICAgICAgIGNvbm5lY3RUb1NvcnRhYmxlOiAnI3JvdXRlLWxpc3QnLFxuICAgICAgICAgICAgICAgIGhlbHBlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJjaXR5aWRcIikpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2l0eSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF07XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSAnPGxpIGlkPVwicm91dGUtJyArIGlkICsgJ1wiIGNsYXNzPVwidWktc3RhdGUtZGVmYXVsdFwiPjxpbWcgc3R5bGU9XCJ3aWR0aDoyMHB4XCIgc3JjPVwiJyArIGNpdHkuaWNvbiArICdcIiA8L2ltZz4nICsgY2l0eS5uYW1lICsgXCI8L2xpPlwiO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHJldCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBoZWxwZXIuX3Bvc2l0aW9uLmRvbTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJldmVydDogJ2ludmFsaWQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgX3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzW3hdLmhhc0FpcnBvcnQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbeF0uZG9tKS5kcmFnZ2FibGUoJ2Rpc2FibGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcm9wQ2l0aWVzRW5hYmxlZCA9IGVuYWJsZTtcbiAgICB9XG4gICAgdXBkYXRlRGF0YSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGNoaWxkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5jaGlsZHJlbjtcbiAgICAgICAgdmFyIG9sZDogUm91dGVbXSA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IF90aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBvbGQucHVzaChfdGhpcy5haXJwbGFuZS5yb3V0ZVt4XSk7XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMuYWlycGxhbmUucm91dGUgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjaGlsZHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmIChjaGlsZHNbeF0uaWQgPT09IFwicm91dGUtZHVtbXlcIilcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIHZhciBzaWQgPSBjaGlsZHNbeF0uaWQuc3BsaXQoXCItXCIpWzFdO1xuICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoc2lkKTtcbiAgICAgICAgICAgIHZhciBmb3VuZDogUm91dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG9sZC5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgIGlmIChvbGRbeV0uY2l0eWlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IG9sZFt5XTtcbiAgICAgICAgICAgICAgICAgICAgb2xkLnNwbGljZSh5LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZvdW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IG5ldyBSb3V0ZSgpO1xuICAgICAgICAgICAgICAgIGZvdW5kLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmU7XG4gICAgICAgICAgICAgICAgZm91bmQuY2l0eWlkID0gaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5yb3V0ZS5wdXNoKGZvdW5kKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB1cGRhdGVSb3V0ZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKSA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xuICAgICAgICAvL2lmICh0aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLy8gIGh0bWwgPSAnPGxpIGlkPVwicm91dGUtZHVtbXlcIj5kcmFnIGFuZCBkcm9wIGNpdGllcyBoZXJlPC9icj48L2xpPic7XG4gICAgICAgIHZhciBpZHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmFpcnBsYW5lLnJvdXRlW3hdLmNpdHlpZDtcbiAgICAgICAgICAgIGh0bWwgKz0gJzxsaSBpZD1cInJvdXRlLScgKyBpZCArICdcIiBjbGFzcz1cInVpLXN0YXRlLWRlZmF1bHRcIj48aW1nIHN0eWxlPVwid2lkdGg6MjBweDtcIiBzcmM9XCInICsgdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbaWRdLmljb24gKyAnXCIgPC9pbWc+JyArXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbaWRdLm5hbWUgKyBcIjwvbGk+XCI7XG5cbiAgICAgICAgICAgIGlkcy5wdXNoKHRoaXMuYWlycGxhbmUucm91dGVbeF0uY2l0eWlkKTtcbiAgICAgICAgICAgIC8vdmFyIHNkb207XG4gICAgICAgICAgICAvL3ZhciBkb206SFRNTFNwYW5FbGVtZW50PSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuXG4gICAgICAgIH1cbiAgICAgICAgaHRtbCArPSAnPGxpIGlkPVwicm91dGUtZHVtbXlcIj5kcmFnIGFuZCBkcm9wPGJyLz4gY2l0aWVzIGhlcmU8L2xpPic7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAkKFwiI3JvdXRlLWxpc3RcIikuc29ydGFibGUoe1xuICAgICAgICAgICAgdXBkYXRlOiAoZXZlbnQsIHVpKSA9PiB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlRGF0YSgpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVSb3V0ZSgpO1xuXG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgLy8gICQoXCJhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiKS5zb3J0YWJsZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICA8c3Bhbj5gK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzBdLmljb24rdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMF0ubmFtZStgPC9zcGFuPiBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIDxzcGFuPmArdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMV0uaWNvbit0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1sxXS5uYW1lK2A8L3NwYW4+IFxuICAgICAgICAvLyAgICAgICAgICAgICAgIDxzcGFuPmArdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbM10uaWNvbit0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1szXS5uYW1lK2A8L3NwYW4+IFxuXG4gICAgfVxuICAgIHNlbGVjdEFpcnBsYWNlKGFwKSB7XG4gICAgICAgIHRoaXMuYWlycGxhbmUgPSBhcDtcbiAgICAgICAgYXAud29ybGQuc2VsZWN0aW9uPy51bnNlbGVjdCgpO1xuICAgICAgICBhcC53b3JsZC5zZWxlY3Rpb24gPSBhcDtcbiAgICAgICAgYXAuc2VsZWN0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlKHRydWUpO1xuXG4gICAgfVxuICAgIHVwZGF0ZUluZm8oKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLW5hbWVcIikpXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1uYW1lXCIpKS52YWx1ZSA9IHRoaXMuYWlycGxhbmUubmFtZTtcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctdHlwZVwiKSkuaW5uZXJIVE1MID0gXCJUeXBlOiBcIiArIHRoaXMuYWlycGxhbmUudHlwZWlkO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1zcGVlZFwiKSkuaW5uZXJIVE1MID0gXCJTcGVlZDogXCIgKyB0aGlzLmFpcnBsYW5lLnNwZWVkO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1jYXBhY2l0eVwiKSkuaW5uZXJIVE1MID0gXCJDYXBhY2l0eTpcIiArIHRoaXMuYWlycGxhbmUubG9hZGVkQ291bnQgKyBcIi9cIiArIHRoaXMuYWlycGxhbmUuY2FwYWNpdHk7XG4gICAgfVxuICAgIHVwZGF0ZShmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmFpcnBsYW5lID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoISQodGhpcy5kb20pLmRpYWxvZygnaXNPcGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXQgPSAnPGRpdiBzdHlsZT1cImRpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDMwcHggMzBweCAzMHB4IDMwcHg7XCI+JztcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFpcnBsYW5lLnByb2R1Y3RzW3hdICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzxkaXY+JyArIHBhcmFtZXRlci5hbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIiBcIiArIHRoaXMuYWlycGxhbmUucHJvZHVjdHNbeF0gKyBcIiBcIiArIFwiPC9kaXY+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0ICs9IFwiPGRpdj5cIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0cy1saXN0XCIpLmlubmVySFRNTCA9IHJldDtcbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuXG4gICAgICAgICg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYWN0aXZlXCIpKS5jaGVja2VkID0gKHRoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPiAtMSk7XG4gICAgICAgIHRoaXMudXBkYXRlSW5mbygpO1xuXG4gICAgfVxuICAgIHVwZGF0ZVRpdGxlKCkge1xuICAgICAgICB2YXIgc2ljb24gPSAnJztcbiAgICAgICAgaWYgKCQodGhpcy5kb20pLnBhcmVudCgpLmZpbmQoJy51aS1kaWFsb2ctdGl0bGUnKS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpWzBdLmlubmVySFRNTCA9IHRoaXMuYWlycGxhbmUubmFtZSArIFwiIFwiICsgdGhpcy5haXJwbGFuZS5zdGF0dXM7IC8vJzxpbWcgc3R5bGU9XCJmbG9hdDogcmlnaHRcIiBpZD1cImNpdHlkaWFsb2ctaWNvblwiIHNyYz1cIicgKyB0aGlzLmNpdHkuaWNvbiArICdcIiAgaGVpZ2h0PVwiMTVcIj48L2ltZz4gJyArIHRoaXMuY2l0eS5uYW1lICsgXCIgXCIgKyB0aGlzLmNpdHkucGVvcGxlO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIGlmICgkKFwiI2FpcnBsYW5lZGlhbG9nLXJvdXRlLXRhYlwiKS5oYXNDbGFzcyhcInVpLXRhYnMtYWN0aXZlXCIpKSB7XG4gICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vdWktdGFicy1hY3RpdmVcbiAgICAgICAgdmFyIGRsZz0kKHRoaXMuZG9tKS5kaWFsb2coe1xuICAgICAgICAgICAgd2lkdGg6IFwiMTkwcHhcIixcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjp7bXk6XCJsZWZ0IHRvcFwiLGF0OlwicmlnaHQgdG9wXCIsb2Y6JChkb2N1bWVudCl9ICxcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcblxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgICAgIHZhciBqPWRsZy5kaWFsb2coXCJ3aWRnZXRcIikuZmluZChcIi51aS1kaWFsb2ctdGl0bGViYXItY2xvc2VcIik7XG4gICAgICAgICAgICAgICAgalswXS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LDIwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAgZGxnLmRpYWxvZyhcIndpZGdldFwiKS5kcmFnZ2FibGUoXCJvcHRpb25cIiwgXCJjb250YWlubWVudFwiLCBcIm5vbmVcIik7XG4gICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmNzcyh7IHBvc2l0aW9uOiBcImZpeGVkXCIgfSk7XG5cbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgIH1cbn0iXX0=