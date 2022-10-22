define(["require", "exports", "game/product", "game/icons", "game/route", "game/routedialog", "game/squadrondialog"], function (require, exports, product_1, icons_1, route_1, routedialog_1, squadrondialog_1) {
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
            var products = product_1.allProducts;
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
                    var el = $(e.target).closest('li')[0];
                    if (el.id.split("-").length > 1) {
                        var id = parseInt(el.id.split("-")[1]);
                        var select = document.getElementById("route-list");
                        for (var x = 0; x < select.children.length; x++) {
                            select.children[x].classList.remove("active-route");
                        }
                    }
                    el.classList.add("active-route");
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
        enableDropCities(enable) {
            var _this = this;
            console.log("route " + (enable ? "enable" : "disable"));
            if (this.dropCitiesEnabled && !enable) {
                $(".city").draggable('destroy');
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
            for (var x = 0; x < product_1.allProducts.length; x++) {
                if (this.airplane.products[x] !== 0) {
                    ret = ret + '<div>' + product_1.allProducts[x].getIcon() + " " + this.airplane.products[x] + " " + "</div>";
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
            $(this.dom).dialog({
                width: "190px",
                draggable: true,
                //     position:{my:"left top",at:"right top",of:$(document)} ,
                open: function (event, ui) {
                    _this.update(true);
                },
                close: function () {
                    _this.enableDropCities(false);
                }
            }).dialog("widget").draggable("option", "containment", "none");
            $(this.dom).parent().css({ position: "fixed" });
        }
        close() {
            $(this.dom).dialog("close");
        }
    }
    exports.AirplaneDialog = AirplaneDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycGxhbmVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2FpcnBsYW5lZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFRQSxZQUFZO0lBQ1osTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE9BQU8sY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxDQUFDLENBQUE7SUFDRCxNQUFhLGNBQWM7UUFNdkI7WUFIQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBRVgsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1lBRTdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLGNBQWMsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDckMsY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25ELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsSUFBSSxRQUFRLENBQUMsS0FBZTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksUUFBUTtZQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBRU8sTUFBTTtZQUNWLDZCQUE2QjtZQUM3QixJQUFJLElBQUksR0FBRzs7OztTQUlWLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFV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QztZQUMvRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXBELENBQUM7UUFDRCxLQUFLO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBcFZELHdDQW9WQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XG5pbXBvcnQgeyBhbGxQcm9kdWN0cywgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSBcImdhbWUvcm91dGVcIjtcbmltcG9ydCB7IFJvdXRlRGlhbG9nIH0gZnJvbSBcImdhbWUvcm91dGVkaWFsb2dcIjtcbmltcG9ydCB7IFNxdWFkcm9uRGlhbG9nIH0gZnJvbSBcImdhbWUvc3F1YWRyb25kaWFsb2dcIjtcblxuLy9AdHMtaWdub3JlXG53aW5kb3cuYWlycGxhbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuYWlycGxhbmU7XG59XG5leHBvcnQgY2xhc3MgQWlycGxhbmVEaWFsb2cge1xuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBfYWlycGxhbmU6IEFpcnBsYW5lO1xuICAgIGhhc1BhdXNlZCA9IGZhbHNlO1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U7XG4gICAgcHVibGljIGRyb3BDaXRpZXNFbmFibGVkID0gZmFsc2U7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XG4gICAgfVxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBaXJwbGFuZURpYWxvZyB7XG4gICAgICAgIGlmIChBaXJwbGFuZURpYWxvZy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgQWlycGxhbmVEaWFsb2cuaW5zdGFuY2UgPSBuZXcgQWlycGxhbmVEaWFsb2coKTtcbiAgICAgICAgcmV0dXJuIEFpcnBsYW5lRGlhbG9nLmluc3RhbmNlO1xuICAgIH1cbiAgICBzZXQgYWlycGxhbmUodmFsdWU6IEFpcnBsYW5lKSB7XG4gICAgICAgIHRoaXMuX2FpcnBsYW5lID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlUm91dGUoKTtcbiAgICB9XG4gICAgZ2V0IGFpcnBsYW5lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWlycGxhbmU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXG4gICAgICAgIHZhciBzZG9tID0gYFxuICAgICAgICAgIDxkaXYgaGlkZGVuIGlkPVwiYWlycGxhbmVkaWFsb2dcIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nXCI+XG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxuICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgdGhpcy5kb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZ1wiKTtcbiAgICAgICAgaWYgKG9sZCkge1xuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYWlycGxhbmUgPSB0aGlzLmFpcnBsYW5lO1xuICAgICAgICB2YXIgcHJvZHVjdHMgPSBhbGxQcm9kdWN0cztcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiYWlycGxhbmVkaWFsb2ctcHJldlwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjxcIi8+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJhaXJwbGFuZWRpYWxvZy1uZXh0XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPlwiLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+XG4gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNhaXJwbGFuZWRpYWxvZy1wcm9kdWN0c1wiIGNsYXNzPVwiYWlycGxhbmVkaWFsb2ctdGFic1wiPmArIEljb25zLnRhYmxlLnJlcGxhY2UoJzxzcGFuJywgJzxzcGFuIHRpdGxlPVwiTG9hZFwiJykgKyBgPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2FpcnBsYW5lZGlhbG9nLWluZm9cIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5gKyBJY29ucy5pbmZvLnJlcGxhY2UoJzxzcGFuJywgJzxzcGFuIHRpdGxlPVwiSW5mb1wiJykgKyBgPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaSAgaWQ9XCJhaXJwbGFuZWRpYWxvZy1yb3V0ZS10YWJcIj48YSBocmVmPVwiI2FpcnBsYW5lZGlhbG9nLXJvdXRlXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+YCsgSWNvbnMucm91dGUucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJSb3V0ZVwiJykgKyBgPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctcHJvZHVjdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXByb2R1Y3RzLWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLWluZm9cIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJhaXJwbGFuZWRpYWxvZy1uYW1lXCI+IDwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiYWlycGxhbmVkaWFsb2ctdHlwZVwiPlR5cGU6PC9zcGFuPjxici8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiYWlycGxhbmVkaWFsb2ctc3BlZWRcIj5TcGVlZDo8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJhaXJwbGFuZWRpYWxvZy1jYXBhY2l0eVwiPkNhcGFjaXR5Ojwvc3Bhbj48YnIvPiBcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT1cImZvbnQtc2l6ZToxNHB4XCIgaWQ9XCJlZGl0LXNxdWFkcm9uXCI+YCsgSWNvbnMuZWRpdCArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwicm91dGUtYWN0aXZlXCI+IGFjdGl2ZTwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9XCJmb250LXNpemU6MTRweFwiIGlkPVwiZWRpdC1yb3V0ZVwiPmArIEljb25zLmVkaXQgKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9XCJmb250LXNpemU6MTRweFwiICBpZD1cImRlbGV0ZS1yb3V0ZVwiPmArIEljb25zLnJlbW92ZSArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPHVsIHN0eWxlPVwibWluLWhlaWd0OjQwcHhcIiBpZD1cInJvdXRlLWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XG4gICAgICAgICQoXCIjYWlycGxhbmVkaWFsb2ctdGFic1wiKS50YWJzKHtcbiAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJChcIiNhaXJwbGFuZWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gICQoIFwiI3JvdXRlLWxpc3RcIiApLnNvcnRhYmxlKCk7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcbiAgICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgICAgICBpZiAocG9zID49IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0QWlycGxhY2UoX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc10pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLXByZXZcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMuaW5kZXhPZihfdGhpcy5haXJwbGFuZSk7XG4gICAgICAgICAgICAgICAgcG9zLS07XG4gICAgICAgICAgICAgICAgaWYgKHBvcyA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc107XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGFjdCA9ICgoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKSkuY2hlY2tlZCA/IDEgOiAtMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFjdCA9PT0gLTEgJiYgX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPT09IDApXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID0gLTE7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA9IGFjdCAqIE1hdGguYWJzKF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctbmFtZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gdC52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5haXJwbGFuZS53b3JsZC5maW5kQWlycGxhbmUodmFsKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiYW4gYWlycGxhbmUgd2l0aCBuYW1lIFwiICsgdmFsICsgXCIgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUubmFtZSA9IHZhbDtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcuYWlycGxhbmVkaWFsb2ctdGFicycpLmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIjYWlycGxhbmVkaWFsb2ctcm91dGVcIiB8fFxuICAgICAgICAgICAgICAgICAgICAoPGFueT5ldmVudC50YXJnZXQucGFyZW50Tm9kZSkuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIjYWlycGxhbmVkaWFsb2ctcm91dGVcIikge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKHRydWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmVuYWJsZURyb3BDaXRpZXMoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LXJvdXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmU7XG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5yb3V0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLnJvdXRlWzBdO1xuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIm5vIHJvdXRlIGRlZmluZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5zaG93KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdC1zcXVhZHJvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgU3F1YWRyb25EaWFsb2cuZ2V0SW5zdGFuY2UoKS5haXJwbGFuZSA9IF90aGlzLmFpcnBsYW5lO1xuICAgICAgICAgICAgICAgIFNxdWFkcm9uRGlhbG9nLmdldEluc3RhbmNlKCkuc2hvdygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1yb3V0ZVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlbGVjdC5jaGlsZHJlbi5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0LmNoaWxkcmVuW3hdLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZS1yb3V0ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxlY3QuY2hpbGRyZW5beF0pLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlRGF0YSgpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGVsID0gPEhUTUxFbGVtZW50PiQoZS50YXJnZXQpLmNsb3Nlc3QoJ2xpJylbMF07XG5cbiAgICAgICAgICAgICAgICBpZiAoZWwuaWQuc3BsaXQoXCItXCIpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoZWwuaWQuc3BsaXQoXCItXCIpWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBzZWxlY3QuY2hpbGRyZW4ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC5jaGlsZHJlblt4XS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlLXJvdXRlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcImFjdGl2ZS1yb3V0ZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJChcIiNkZWxldGUtcm91dGVcIikuZHJvcHBhYmxlKHtcbiAgICAgICAgICAgICAgICBkcm9wOiAoZSwgZTIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJChlMi5kcmFnZ2FibGVbMF0pLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVEYXRhKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgfVxuICAgIGVuYWJsZURyb3BDaXRpZXMoZW5hYmxlOiBib29sZWFuKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicm91dGUgXCIgKyAoZW5hYmxlID8gXCJlbmFibGVcIiA6IFwiZGlzYWJsZVwiKSk7XG4gICAgICAgIGlmICh0aGlzLmRyb3BDaXRpZXNFbmFibGVkICYmICFlbmFibGUpIHtcbiAgICAgICAgICAgICQoXCIuY2l0eVwiKS5kcmFnZ2FibGUoJ2Rlc3Ryb3knKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kcm9wQ2l0aWVzRW5hYmxlZCA9PT0gZmFsc2UgJiYgZW5hYmxlKSB7XG4gICAgICAgICAgICAkKFwiLmNpdHlcIikuZHJhZ2dhYmxlKHtcbiAgICAgICAgICAgICAgICBjb25uZWN0VG9Tb3J0YWJsZTogJyNyb3V0ZS1saXN0JyxcbiAgICAgICAgICAgICAgICBoZWxwZXI6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiY2l0eWlkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNpdHkgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbaWRdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gJzxsaSBpZD1cInJvdXRlLScgKyBpZCArICdcIiBjbGFzcz1cInVpLXN0YXRlLWRlZmF1bHRcIj48aW1nIHN0eWxlPVwid2lkdGg6MjBweFwiIHNyYz1cIicgKyBjaXR5Lmljb24gKyAnXCIgPC9pbWc+JyArIGNpdHkubmFtZSArIFwiPC9saT5cIjtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJChyZXQpO1xuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gaGVscGVyLl9wb3NpdGlvbi5kb207XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXZlcnQ6ICdpbnZhbGlkJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcm9wQ2l0aWVzRW5hYmxlZCA9IGVuYWJsZTtcbiAgICB9XG4gICAgdXBkYXRlRGF0YSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGNoaWxkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5jaGlsZHJlbjtcbiAgICAgICAgdmFyIG9sZDogUm91dGVbXSA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IF90aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBvbGQucHVzaChfdGhpcy5haXJwbGFuZS5yb3V0ZVt4XSk7XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMuYWlycGxhbmUucm91dGUgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjaGlsZHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmIChjaGlsZHNbeF0uaWQgPT09IFwicm91dGUtZHVtbXlcIilcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIHZhciBzaWQgPSBjaGlsZHNbeF0uaWQuc3BsaXQoXCItXCIpWzFdO1xuICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoc2lkKTtcbiAgICAgICAgICAgIHZhciBmb3VuZDogUm91dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG9sZC5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgIGlmIChvbGRbeV0uY2l0eWlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IG9sZFt5XTtcbiAgICAgICAgICAgICAgICAgICAgb2xkLnNwbGljZSh5LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZvdW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IG5ldyBSb3V0ZSgpO1xuICAgICAgICAgICAgICAgIGZvdW5kLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmU7XG4gICAgICAgICAgICAgICAgZm91bmQuY2l0eWlkID0gaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5yb3V0ZS5wdXNoKGZvdW5kKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB1cGRhdGVSb3V0ZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKSA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xuICAgICAgICAvL2lmICh0aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLy8gIGh0bWwgPSAnPGxpIGlkPVwicm91dGUtZHVtbXlcIj5kcmFnIGFuZCBkcm9wIGNpdGllcyBoZXJlPC9icj48L2xpPic7XG4gICAgICAgIHZhciBpZHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmFpcnBsYW5lLnJvdXRlW3hdLmNpdHlpZDtcbiAgICAgICAgICAgIGh0bWwgKz0gJzxsaSBpZD1cInJvdXRlLScgKyBpZCArICdcIiBjbGFzcz1cInVpLXN0YXRlLWRlZmF1bHRcIj48aW1nIHN0eWxlPVwid2lkdGg6MjBweDtcIiBzcmM9XCInICsgdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbaWRdLmljb24gKyAnXCIgPC9pbWc+JyArXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbaWRdLm5hbWUgKyBcIjwvbGk+XCI7XG5cbiAgICAgICAgICAgIGlkcy5wdXNoKHRoaXMuYWlycGxhbmUucm91dGVbeF0uY2l0eWlkKTtcbiAgICAgICAgICAgIC8vdmFyIHNkb207XG4gICAgICAgICAgICAvL3ZhciBkb206SFRNTFNwYW5FbGVtZW50PSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuXG4gICAgICAgIH1cbiAgICAgICAgaHRtbCArPSAnPGxpIGlkPVwicm91dGUtZHVtbXlcIj5kcmFnIGFuZCBkcm9wPGJyLz4gY2l0aWVzIGhlcmU8L2xpPic7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAkKFwiI3JvdXRlLWxpc3RcIikuc29ydGFibGUoe1xuICAgICAgICAgICAgdXBkYXRlOiAoZXZlbnQsIHVpKSA9PiB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlRGF0YSgpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVSb3V0ZSgpO1xuXG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgLy8gICQoXCJhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiKS5zb3J0YWJsZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICA8c3Bhbj5gK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzBdLmljb24rdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMF0ubmFtZStgPC9zcGFuPiBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIDxzcGFuPmArdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMV0uaWNvbit0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1sxXS5uYW1lK2A8L3NwYW4+IFxuICAgICAgICAvLyAgICAgICAgICAgICAgIDxzcGFuPmArdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbM10uaWNvbit0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1szXS5uYW1lK2A8L3NwYW4+IFxuXG4gICAgfVxuICAgIHNlbGVjdEFpcnBsYWNlKGFwKSB7XG4gICAgICAgIHRoaXMuYWlycGxhbmUgPSBhcDtcbiAgICAgICAgYXAud29ybGQuc2VsZWN0aW9uPy51bnNlbGVjdCgpO1xuICAgICAgICBhcC53b3JsZC5zZWxlY3Rpb24gPSBhcDtcbiAgICAgICAgYXAuc2VsZWN0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlKHRydWUpO1xuXG4gICAgfVxuICAgIHVwZGF0ZUluZm8oKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLW5hbWVcIikpXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1uYW1lXCIpKS52YWx1ZSA9IHRoaXMuYWlycGxhbmUubmFtZTtcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctdHlwZVwiKSkuaW5uZXJIVE1MID0gXCJUeXBlOiBcIiArIHRoaXMuYWlycGxhbmUudHlwZWlkO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1zcGVlZFwiKSkuaW5uZXJIVE1MID0gXCJTcGVlZDogXCIgKyB0aGlzLmFpcnBsYW5lLnNwZWVkO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1jYXBhY2l0eVwiKSkuaW5uZXJIVE1MID0gXCJDYXBhY2l0eTpcIiArIHRoaXMuYWlycGxhbmUubG9hZGVkQ291bnQgKyBcIi9cIiArIHRoaXMuYWlycGxhbmUuY2FwYWNpdHk7XG4gICAgfVxuICAgIHVwZGF0ZShmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmFpcnBsYW5lID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoISQodGhpcy5kb20pLmRpYWxvZygnaXNPcGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXQgPSAnPGRpdiBzdHlsZT1cImRpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDMwcHggMzBweCAzMHB4IDMwcHg7XCI+JztcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUucHJvZHVjdHNbeF0gIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPGRpdj4nICsgYWxsUHJvZHVjdHNbeF0uZ2V0SWNvbigpICsgXCIgXCIgKyB0aGlzLmFpcnBsYW5lLnByb2R1Y3RzW3hdICsgXCIgXCIgKyBcIjwvZGl2PlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldCArPSBcIjxkaXY+XCI7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctcHJvZHVjdHMtbGlzdFwiKS5pbm5lckhUTUwgPSByZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlVGl0bGUoKTtcblxuICAgICAgICAoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKSkuY2hlY2tlZCA9ICh0aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID4gLTEpO1xuICAgICAgICB0aGlzLnVwZGF0ZUluZm8oKTtcblxuICAgIH1cbiAgICB1cGRhdGVUaXRsZSgpIHtcbiAgICAgICAgdmFyIHNpY29uID0gJyc7XG4gICAgICAgIGlmICgkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJykubGVuZ3RoID4gMClcbiAgICAgICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmZpbmQoJy51aS1kaWFsb2ctdGl0bGUnKVswXS5pbm5lckhUTUwgPSB0aGlzLmFpcnBsYW5lLm5hbWUgKyBcIiBcIiArIHRoaXMuYWlycGxhbmUuc3RhdHVzOyAvLyc8aW1nIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0XCIgaWQ9XCJjaXR5ZGlhbG9nLWljb25cIiBzcmM9XCInICsgdGhpcy5jaXR5Lmljb24gKyAnXCIgIGhlaWdodD1cIjE1XCI+PC9pbWc+ICcgKyB0aGlzLmNpdHkubmFtZSArIFwiIFwiICsgdGhpcy5jaXR5LnBlb3BsZTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICBpZiAoJChcIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZS10YWJcIikuaGFzQ2xhc3MoXCJ1aS10YWJzLWFjdGl2ZVwiKSkge1xuICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICAvL3VpLXRhYnMtYWN0aXZlXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XG4gICAgICAgICAgICB3aWR0aDogXCIxOTBweFwiLFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgLy8gICAgIHBvc2l0aW9uOntteTpcImxlZnQgdG9wXCIsYXQ6XCJyaWdodCB0b3BcIixvZjokKGRvY3VtZW50KX0gLFxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmVuYWJsZURyb3BDaXRpZXMoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5kaWFsb2coXCJ3aWRnZXRcIikuZHJhZ2dhYmxlKFwib3B0aW9uXCIsIFwiY29udGFpbm1lbnRcIiwgXCJub25lXCIpO1xuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xuXG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICB9XG59Il19