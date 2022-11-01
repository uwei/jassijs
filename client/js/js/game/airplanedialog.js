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
                    <button style="font-size:14px" id="delete-airplane">` + icons_1.Icons.remove + `</button>
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
                document.getElementById("delete-airplane").addEventListener('click', (e) => {
                    if (confirm(`Delete the the entire squadron?`)) {
                        _this.deleteAirplane(_this.airplane);
                    }
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
        deleteAirplane(ap) {
            var _a;
            for (var x = 0; x < ap.squadron.length; x++) {
                this.deleteAirplane(ap.squadron[x]);
                ap.squadron = [];
            }
            if ((_a = ap.dom) === null || _a === void 0 ? void 0 : _a.style)
                ap.dom.style.display = "none";
            if (ap.dom){
               try{                    
                        this.airplane.world.dom.removeChild(ap.dom);
                }catch{
                        
                }
            }
            this.update();
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
                create: function (e) {
                    setTimeout(() => {
                        $(e.target).dialog("widget").find(".ui-dialog-titlebar-close")[0].addEventListener('touchstart', (e) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycGxhbmVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2FpcnBsYW5lZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFRQSxZQUFZO0lBQ1osTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE9BQU8sY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxDQUFDLENBQUE7SUFDRCxNQUFhLGNBQWM7UUFNdkI7WUFIQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBRVgsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1lBRTdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLGNBQWMsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDckMsY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25ELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsSUFBSSxRQUFRLENBQUMsS0FBZTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksUUFBUTtZQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBRU8sTUFBTTtZQUNWLDZCQUE2QjtZQUM3QixJQUFJLElBQUksR0FBRzs7OztTQUlWLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFV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QUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDaEUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRCxDQUFDO1FBQ0QsS0FBSztZQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FDSjtJQWxZRCx3Q0FrWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaXR5IH0gZnJvbSBcImdhbWUvY2l0eVwiO1xuaW1wb3J0IHsgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSBcImdhbWUvcm91dGVcIjtcbmltcG9ydCB7IFJvdXRlRGlhbG9nIH0gZnJvbSBcImdhbWUvcm91dGVkaWFsb2dcIjtcbmltcG9ydCB7IFNxdWFkcm9uRGlhbG9nIH0gZnJvbSBcImdhbWUvc3F1YWRyb25kaWFsb2dcIjtcblxuLy9AdHMtaWdub3JlXG53aW5kb3cuYWlycGxhbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuYWlycGxhbmU7XG59XG5leHBvcnQgY2xhc3MgQWlycGxhbmVEaWFsb2cge1xuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBfYWlycGxhbmU6IEFpcnBsYW5lO1xuICAgIGhhc1BhdXNlZCA9IGZhbHNlO1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U7XG4gICAgcHVibGljIGRyb3BDaXRpZXNFbmFibGVkID0gZmFsc2U7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XG4gICAgfVxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBaXJwbGFuZURpYWxvZyB7XG4gICAgICAgIGlmIChBaXJwbGFuZURpYWxvZy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgQWlycGxhbmVEaWFsb2cuaW5zdGFuY2UgPSBuZXcgQWlycGxhbmVEaWFsb2coKTtcbiAgICAgICAgcmV0dXJuIEFpcnBsYW5lRGlhbG9nLmluc3RhbmNlO1xuICAgIH1cbiAgICBzZXQgYWlycGxhbmUodmFsdWU6IEFpcnBsYW5lKSB7XG4gICAgICAgIHRoaXMuX2FpcnBsYW5lID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlUm91dGUoKTtcbiAgICB9XG4gICAgZ2V0IGFpcnBsYW5lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWlycGxhbmU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXG4gICAgICAgIHZhciBzZG9tID0gYFxuICAgICAgICAgIDxkaXYgaGlkZGVuIGlkPVwiYWlycGxhbmVkaWFsb2dcIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nXCI+XG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxuICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgdGhpcy5kb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZ1wiKTtcbiAgICAgICAgaWYgKG9sZCkge1xuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYWlycGxhbmUgPSB0aGlzLmFpcnBsYW5lO1xuICAgICAgICB2YXIgcHJvZHVjdHMgPSB3aW5kb3cucGFyYW1ldGVyLmFsbFByb2R1Y3RzO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc2RvbSA9IGBcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJhaXJwbGFuZWRpYWxvZy1wcmV2XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPFwiLz5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImFpcnBsYW5lZGlhbG9nLW5leHRcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI+XCIvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5cbiAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2FpcnBsYW5lZGlhbG9nLXByb2R1Y3RzXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+YCsgSWNvbnMudGFibGUucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJMb2FkXCInKSArIGA8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjYWlycGxhbmVkaWFsb2ctaW5mb1wiIGNsYXNzPVwiYWlycGxhbmVkaWFsb2ctdGFic1wiPmArIEljb25zLmluZm8ucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJJbmZvXCInKSArIGA8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpICBpZD1cImFpcnBsYW5lZGlhbG9nLXJvdXRlLXRhYlwiPjxhIGhyZWY9XCIjYWlycGxhbmVkaWFsb2ctcm91dGVcIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5gKyBJY29ucy5yb3V0ZS5yZXBsYWNlKCc8c3BhbicsICc8c3BhbiB0aXRsZT1cIlJvdXRlXCInKSArIGA8L2E+PC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0c1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctcHJvZHVjdHMtbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctaW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImFpcnBsYW5lZGlhbG9nLW5hbWVcIj4gPC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJhaXJwbGFuZWRpYWxvZy10eXBlXCI+VHlwZTo8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJhaXJwbGFuZWRpYWxvZy1zcGVlZFwiPlNwZWVkOjwvc3Bhbj48YnIvPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImFpcnBsYW5lZGlhbG9nLWNhcGFjaXR5XCI+Q2FwYWNpdHk6PC9zcGFuPjxici8+IFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHN0eWxlPVwiZm9udC1zaXplOjE0cHhcIiBpZD1cImVkaXQtc3F1YWRyb25cIj5gKyBJY29ucy5lZGl0ICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHN0eWxlPVwiZm9udC1zaXplOjE0cHhcIiBpZD1cImRlbGV0ZS1haXJwbGFuZVwiPmArIEljb25zLnJlbW92ZSArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwicm91dGUtYWN0aXZlXCI+IGFjdGl2ZTwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9XCJmb250LXNpemU6MTRweFwiIGlkPVwiZWRpdC1yb3V0ZVwiPmArIEljb25zLmVkaXQgKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9XCJmb250LXNpemU6MTRweFwiICBpZD1cImRlbGV0ZS1yb3V0ZVwiPmArIEljb25zLnJlbW92ZSArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPHVsIHN0eWxlPVwibWluLWhlaWd0OjQwcHhcIiBpZD1cInJvdXRlLWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XG4gICAgICAgICQoXCIjYWlycGxhbmVkaWFsb2ctdGFic1wiKS50YWJzKHtcbiAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJChcIiNhaXJwbGFuZWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gICQoIFwiI3JvdXRlLWxpc3RcIiApLnNvcnRhYmxlKCk7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcbiAgICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgICAgICBpZiAocG9zID49IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0QWlycGxhY2UoX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc10pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLXByZXZcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMuaW5kZXhPZihfdGhpcy5haXJwbGFuZSk7XG4gICAgICAgICAgICAgICAgcG9zLS07XG4gICAgICAgICAgICAgICAgaWYgKHBvcyA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc107XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGFjdCA9ICgoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKSkuY2hlY2tlZCA/IDEgOiAtMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFjdCA9PT0gLTEgJiYgX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPT09IDApXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID0gLTE7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA9IGFjdCAqIE1hdGguYWJzKF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctbmFtZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gdC52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5haXJwbGFuZS53b3JsZC5maW5kQWlycGxhbmUodmFsKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiYW4gYWlycGxhbmUgd2l0aCBuYW1lIFwiICsgdmFsICsgXCIgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUubmFtZSA9IHZhbDtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcuYWlycGxhbmVkaWFsb2ctdGFicycpLmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIjYWlycGxhbmVkaWFsb2ctcm91dGVcIiB8fFxuICAgICAgICAgICAgICAgICAgICAoPGFueT5ldmVudC50YXJnZXQucGFyZW50Tm9kZSkuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIjYWlycGxhbmVkaWFsb2ctcm91dGVcIikge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKHRydWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmVuYWJsZURyb3BDaXRpZXMoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LXJvdXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmU7XG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5yb3V0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLnJvdXRlWzBdO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIm5vIHJvdXRlIGRlZmluZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5zaG93KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdC1zcXVhZHJvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgU3F1YWRyb25EaWFsb2cuZ2V0SW5zdGFuY2UoKS5haXJwbGFuZSA9IF90aGlzLmFpcnBsYW5lO1xuICAgICAgICAgICAgICAgIFNxdWFkcm9uRGlhbG9nLmdldEluc3RhbmNlKCkuc2hvdygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtYWlycGxhbmVcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICBpZiAoY29uZmlybShgRGVsZXRlIHRoZSB0aGUgZW50aXJlIHNxdWFkcm9uP2ApKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRlbGV0ZUFpcnBsYW5lKF90aGlzLmFpcnBsYW5lKTtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1yb3V0ZVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlbGVjdC5jaGlsZHJlbi5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0LmNoaWxkcmVuW3hdLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZS1yb3V0ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxlY3QuY2hpbGRyZW5beF0pLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlRGF0YSgpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0Q8OtdHkoZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxlY3RDw610eShlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJChcIiNkZWxldGUtcm91dGVcIikuZHJvcHBhYmxlKHtcbiAgICAgICAgICAgICAgICBkcm9wOiAoZSwgZTIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJChlMi5kcmFnZ2FibGVbMF0pLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVEYXRhKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgfVxuICAgIGRlbGV0ZUFpcnBsYW5lKGFwOkFpcnBsYW5lKXtcblxuICAgICAgICBmb3IodmFyIHg9MDt4PGFwLnNxdWFkcm9uLmxlbmd0aDt4Kyspe1xuICAgICAgICAgICAgdGhpcy5kZWxldGVBaXJwbGFuZShhcC5zcXVhZHJvblt4XSk7XG4gICAgICAgICAgICBhcC5zcXVhZHJvbj1bXTtcbiAgICAgICAgfVxuICAgICAgICBpZihhcC5kb20/LnN0eWxlKVxuICAgICAgICAgICAgYXAuZG9tLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG4gICAgICAgIGlmKGFwLmRvbSlcbiAgICAgICAgICAgIHRoaXMuYWlycGxhbmUud29ybGQuZG9tLnJlbW92ZUNoaWxkKGFwLmRvbSk7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfVxuICAgIHNlbGVjdEPDrXR5KGUpIHtcbiAgICAgICAgdmFyIGVsID0gPEhUTUxFbGVtZW50PiQoZS50YXJnZXQpLmNsb3Nlc3QoJ2xpJylbMF07XG5cbiAgICAgICAgaWYgKGVsLmlkLnNwbGl0KFwiLVwiKS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChlbC5pZC5zcGxpdChcIi1cIilbMV0pO1xuICAgICAgICAgICAgdmFyIHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKTtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgc2VsZWN0LmNoaWxkcmVuLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0LmNoaWxkcmVuW3hdLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmUtcm91dGVcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlLXJvdXRlXCIpO1xuICAgIH1cbiAgICBlbmFibGVEcm9wQ2l0aWVzKGVuYWJsZTogYm9vbGVhbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBjb25zb2xlLmxvZyhcInJvdXRlIFwiICsgKGVuYWJsZSA/IFwiZW5hYmxlXCIgOiBcImRpc2FibGVcIikpO1xuICAgICAgICBpZiAodGhpcy5kcm9wQ2l0aWVzRW5hYmxlZCAmJiAhZW5hYmxlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1t4XS5kb20pLmRyYWdnYWJsZSgnZGVzdHJveScpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZHJvcENpdGllc0VuYWJsZWQgPT09IGZhbHNlICYmIGVuYWJsZSkge1xuICAgICAgICAgICAgJChcIi5jaXR5XCIpLmRyYWdnYWJsZSh7XG4gICAgICAgICAgICAgICAgY29ubmVjdFRvU29ydGFibGU6ICcjcm91dGUtbGlzdCcsXG4gICAgICAgICAgICAgICAgaGVscGVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImNpdHlpZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaXR5ID0gX3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldCA9ICc8bGkgaWQ9XCJyb3V0ZS0nICsgaWQgKyAnXCIgY2xhc3M9XCJ1aS1zdGF0ZS1kZWZhdWx0XCI+PGltZyBzdHlsZT1cIndpZHRoOjIwcHhcIiBzcmM9XCInICsgY2l0eS5pY29uICsgJ1wiIDwvaW1nPicgKyBjaXR5Lm5hbWUgKyBcIjwvbGk+XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQocmV0KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIGhlbHBlci5fcG9zaXRpb24uZG9tO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmV2ZXJ0OiAnaW52YWxpZCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBfdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbeF0uaGFzQWlycG9ydCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1t4XS5kb20pLmRyYWdnYWJsZSgnZGlzYWJsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyb3BDaXRpZXNFbmFibGVkID0gZW5hYmxlO1xuICAgIH1cbiAgICB1cGRhdGVEYXRhKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY2hpbGRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpLmNoaWxkcmVuO1xuICAgICAgICB2YXIgb2xkOiBSb3V0ZVtdID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgX3RoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIG9sZC5wdXNoKF90aGlzLmFpcnBsYW5lLnJvdXRlW3hdKTtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5haXJwbGFuZS5yb3V0ZSA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNoaWxkcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKGNoaWxkc1t4XS5pZCA9PT0gXCJyb3V0ZS1kdW1teVwiKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgdmFyIHNpZCA9IGNoaWxkc1t4XS5pZC5zcGxpdChcIi1cIilbMV07XG4gICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChzaWQpO1xuICAgICAgICAgICAgdmFyIGZvdW5kOiBSb3V0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgb2xkLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9sZFt5XS5jaXR5aWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gb2xkW3ldO1xuICAgICAgICAgICAgICAgICAgICBvbGQuc3BsaWNlKHksIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZm91bmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGZvdW5kID0gbmV3IFJvdXRlKCk7XG4gICAgICAgICAgICAgICAgZm91bmQuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZTtcbiAgICAgICAgICAgICAgICBmb3VuZC5jaXR5aWQgPSBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLnJvdXRlLnB1c2goZm91bmQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZVJvdXRlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG4gICAgICAgIC8vaWYgKHRoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoID09PSAwKVxuICAgICAgICAvLyAgaHRtbCA9ICc8bGkgaWQ9XCJyb3V0ZS1kdW1teVwiPmRyYWcgYW5kIGRyb3AgY2l0aWVzIGhlcmU8L2JyPjwvbGk+JztcbiAgICAgICAgdmFyIGlkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuYWlycGxhbmUucm91dGVbeF0uY2l0eWlkO1xuICAgICAgICAgICAgaHRtbCArPSAnPGxpIGlkPVwicm91dGUtJyArIGlkICsgJ1wiIGNsYXNzPVwidWktc3RhdGUtZGVmYXVsdFwiPjxpbWcgc3R5bGU9XCJ3aWR0aDoyMHB4O1wiIHNyYz1cIicgKyB0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF0uaWNvbiArICdcIiA8L2ltZz4nICtcbiAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF0ubmFtZSArIFwiPC9saT5cIjtcblxuICAgICAgICAgICAgaWRzLnB1c2godGhpcy5haXJwbGFuZS5yb3V0ZVt4XS5jaXR5aWQpO1xuICAgICAgICAgICAgLy92YXIgc2RvbTtcbiAgICAgICAgICAgIC8vdmFyIGRvbTpIVE1MU3BhbkVsZW1lbnQ9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG5cbiAgICAgICAgfVxuICAgICAgICBodG1sICs9ICc8bGkgaWQ9XCJyb3V0ZS1kdW1teVwiPmRyYWcgYW5kIGRyb3A8YnIvPiBjaXRpZXMgaGVyZTwvbGk+JztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICQoXCIjcm91dGUtbGlzdFwiKS5zb3J0YWJsZSh7XG4gICAgICAgICAgICB1cGRhdGU6IChldmVudCwgdWkpID0+IHtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVEYXRhKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZVJvdXRlKCk7XG5cbiAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICAvLyAgJChcImFpcnBsYW5lZGlhbG9nLXJvdXRlXCIpLnNvcnRhYmxlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgIDxzcGFuPmArdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMF0uaWNvbit0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1swXS5uYW1lK2A8L3NwYW4+IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgPHNwYW4+YCt0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1sxXS5pY29uK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzFdLm5hbWUrYDwvc3Bhbj4gXG4gICAgICAgIC8vICAgICAgICAgICAgICAgPHNwYW4+YCt0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1szXS5pY29uK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzNdLm5hbWUrYDwvc3Bhbj4gXG5cbiAgICB9XG4gICAgc2VsZWN0QWlycGxhY2UoYXApIHtcbiAgICAgICAgdGhpcy5haXJwbGFuZSA9IGFwO1xuICAgICAgICBhcC53b3JsZC5zZWxlY3Rpb24/LnVuc2VsZWN0KCk7XG4gICAgICAgIGFwLndvcmxkLnNlbGVjdGlvbiA9IGFwO1xuICAgICAgICBhcC5zZWxlY3QoKTtcbiAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XG5cbiAgICB9XG4gICAgdXBkYXRlSW5mbygpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctbmFtZVwiKSlcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLW5hbWVcIikpLnZhbHVlID0gdGhpcy5haXJwbGFuZS5uYW1lO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy10eXBlXCIpKS5pbm5lckhUTUwgPSBcIlR5cGU6IFwiICsgdGhpcy5haXJwbGFuZS50eXBlaWQ7XG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLXNwZWVkXCIpKS5pbm5lckhUTUwgPSBcIlNwZWVkOiBcIiArIHRoaXMuYWlycGxhbmUuc3BlZWQ7XG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLWNhcGFjaXR5XCIpKS5pbm5lckhUTUwgPSBcIkNhcGFjaXR5OlwiICsgdGhpcy5haXJwbGFuZS5sb2FkZWRDb3VudCArIFwiL1wiICsgdGhpcy5haXJwbGFuZS5jYXBhY2l0eTtcbiAgICB9XG4gICAgdXBkYXRlKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghJCh0aGlzLmRvbSkuZGlhbG9nKCdpc09wZW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9ICc8ZGl2IHN0eWxlPVwiZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczogMzBweCAzMHB4IDMwcHggMzBweDtcIj4nO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUucHJvZHVjdHNbeF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPGRpdj4nICsgcGFyYW1ldGVyLmFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiIFwiICsgdGhpcy5haXJwbGFuZS5wcm9kdWN0c1t4XSArIFwiIFwiICsgXCI8L2Rpdj5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXQgKz0gXCI8ZGl2PlwiO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLXByb2R1Y3RzLWxpc3RcIikuaW5uZXJIVE1MID0gcmV0O1xuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XG5cbiAgICAgICAgKDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1hY3RpdmVcIikpLmNoZWNrZWQgPSAodGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA+IC0xKTtcbiAgICAgICAgdGhpcy51cGRhdGVJbmZvKCk7XG5cbiAgICB9XG4gICAgdXBkYXRlVGl0bGUoKSB7XG4gICAgICAgIHZhciBzaWNvbiA9ICcnO1xuICAgICAgICBpZiAoJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJylbMF0uaW5uZXJIVE1MID0gdGhpcy5haXJwbGFuZS5uYW1lICsgXCIgXCIgKyB0aGlzLmFpcnBsYW5lLnN0YXR1czsgLy8nPGltZyBzdHlsZT1cImZsb2F0OiByaWdodFwiIGlkPVwiY2l0eWRpYWxvZy1pY29uXCIgc3JjPVwiJyArIHRoaXMuY2l0eS5pY29uICsgJ1wiICBoZWlnaHQ9XCIxNVwiPjwvaW1nPiAnICsgdGhpcy5jaXR5Lm5hbWUgKyBcIiBcIiArIHRoaXMuY2l0eS5wZW9wbGU7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgaWYgKCQoXCIjYWlycGxhbmVkaWFsb2ctcm91dGUtdGFiXCIpLmhhc0NsYXNzKFwidWktdGFicy1hY3RpdmVcIikpIHtcbiAgICAgICAgICAgIF90aGlzLmVuYWJsZURyb3BDaXRpZXModHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy91aS10YWJzLWFjdGl2ZVxuICAgICAgICB2YXIgZGxnID0gJCh0aGlzLmRvbSkuZGlhbG9nKHtcbiAgICAgICAgICAgIHdpZHRoOiBcIjE5MHB4XCIsXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG5cbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuZGlhbG9nKFwid2lkZ2V0XCIpLmZpbmQoXCIudWktZGlhbG9nLXRpdGxlYmFyLWNsb3NlXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRsZy5kaWFsb2coXCJ3aWRnZXRcIikuZHJhZ2dhYmxlKFwib3B0aW9uXCIsIFwiY29udGFpbm1lbnRcIiwgXCJub25lXCIpO1xuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xuXG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICB9XG59Il19