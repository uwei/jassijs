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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycGxhbmVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2FpcnBsYW5lZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFRQSxZQUFZO0lBQ1osTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE9BQU8sY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxDQUFDLENBQUE7SUFDRCxNQUFhLGNBQWM7UUFNdkI7WUFIQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBRVgsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1lBRTdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLGNBQWMsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDckMsY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25ELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsSUFBSSxRQUFRLENBQUMsS0FBZTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksUUFBUTtZQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBRU8sTUFBTTtZQUNWLDZCQUE2QjtZQUM3QixJQUFJLElBQUksR0FBRzs7OztTQUlWLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM3QixJQUFJLFFBQVEsR0FBRyxxQkFBVyxDQUFDO1lBQzNCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRzs7Ozs7Ozs7d0ZBUXFFLEdBQUUsYUFBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLEdBQUc7b0ZBQzNELEdBQUUsYUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLG9CQUFvQixDQUFDLEdBQUc7b0hBQ3RCLEdBQUUsYUFBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLHFCQUFxQixDQUFDLEdBQUc7Ozs7Ozs7Ozs7Ozt1RUFZckcsR0FBRSxhQUFLLENBQUMsSUFBSSxHQUFHOzs7OztvRUFLbEIsR0FBRSxhQUFLLENBQUMsSUFBSSxHQUFHO3VFQUNaLEdBQUUsYUFBSyxDQUFDLE1BQU0sR0FBRzs7Ozs7Ozs7O1NBUy9FLENBQUM7WUFDRixJQUFJLE1BQU0sR0FBUSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzNCLG1CQUFtQjthQUN0QixDQUFDLENBQUM7WUFDSCxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNaLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDM0IsbUJBQW1CO2lCQUN0QixDQUFDLENBQUM7Z0JBQ0gsa0NBQWtDO1lBQ3RDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVwQyxvREFBb0Q7WUFDcEQsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixRQUFRLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7b0JBQzVFLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNqRSxHQUFHLEVBQUUsQ0FBQztvQkFDTixJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTt3QkFDNUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDWixLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxDQUFDLENBQUMsQ0FBQztnQkFDSCxRQUFRLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7b0JBQzVFLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNqRSxHQUFHLEVBQUUsQ0FBQztvQkFDTixJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7d0JBQ1YsR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUNwRCxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDckQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDcEUsSUFBSSxHQUFHLEdBQUcsQ0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1RSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsS0FBSyxDQUFDO3dCQUM5QyxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQzs7d0JBRWhDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUE7Z0JBQy9FLENBQUMsQ0FBQyxDQUFDO2dCQUVILFFBQVEsQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDNUUsSUFBSSxDQUFDLEdBQXFCLENBQUMsQ0FBQyxNQUFNLENBQUM7b0JBQ25DLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQ2xCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTt3QkFDckQsS0FBSyxDQUFDLHdCQUF3QixHQUFHLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO3dCQUMxRCxPQUFPO3FCQUNWO29CQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztvQkFDMUIsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNuQixDQUFDLENBQUMsQ0FBQztnQkFFSCxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLO29CQUMzQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLHVCQUF1Qjt3QkFDdkQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFXLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLHVCQUF1QixFQUFFO3dCQUNqRixLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ2hDO3lCQUFNO3dCQUNILEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDakM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDbEUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM5Qix5QkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO29CQUNwRCx5QkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7b0JBQzVDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUM7d0JBQy9CLHlCQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN6RDt3QkFDRCxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQzt3QkFDMUIsT0FBTztxQkFDVjtvQkFDRCx5QkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNyQyxDQUFDLENBQUMsQ0FBQztnQkFDSCxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNyRSwrQkFBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO29CQUN2RCwrQkFBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN4QyxDQUFDLENBQUMsQ0FBQztnQkFDSCxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNwRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUNuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzdDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFOzRCQUN2RCxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO3lCQUVsQztxQkFDSjtvQkFDRCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBRXZCLENBQUMsQ0FBQyxDQUFDO2dCQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ2xFLElBQUksRUFBRSxHQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFbkQsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUM3QixJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkMsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFDbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUM3QyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7eUJBQ3ZEO3FCQUVKO29CQUNELEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDLENBQUMsQ0FBQztnQkFDSCxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUN6QixJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQ1osQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzt3QkFDNUIsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUN2QixDQUFDO2lCQUNKLENBQUMsQ0FBQztZQUNQLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSLGlDQUFpQztRQUNyQyxDQUFDO1FBQ0QsZ0JBQWdCLENBQUMsTUFBZTtZQUM1QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4RCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDbkMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNuQztZQUNELElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLEtBQUssSUFBSSxNQUFNLEVBQUU7Z0JBQzVDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQ2pCLGlCQUFpQixFQUFFLGFBQWE7b0JBQ2hDLE1BQU0sRUFBRSxVQUFVLEtBQUs7d0JBQ25CLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzNDLElBQUksR0FBRyxHQUFHLGdCQUFnQixHQUFHLEVBQUUsR0FBRywwREFBMEQsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQzt3QkFFNUksT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2QsK0JBQStCO29CQUNuQyxDQUFDO29CQUNELE1BQU0sRUFBRSxTQUFTO2lCQUNwQixDQUFDLENBQUM7YUFDTjtZQUNELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUM7UUFDcEMsQ0FBQztRQUNELFVBQVU7WUFDTixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFDNUQsSUFBSSxHQUFHLEdBQVksRUFBRSxDQUFDO1lBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xELEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNyQztZQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLGFBQWE7b0JBQzlCLFNBQVM7Z0JBQ2IsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxLQUFLLEdBQVUsU0FBUyxDQUFDO2dCQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDakMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEVBQUUsRUFBRTt3QkFDdEIsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDZixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDakIsTUFBTTtxQkFDVDtpQkFDSjtnQkFDRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7b0JBQ3JCLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO29CQUNwQixLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7b0JBQ2hDLEtBQUssQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO2lCQUNyQjtnQkFDRCxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEM7UUFDTCxDQUFDO1FBQ0QsV0FBVztZQUNQLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEtBQUssSUFBSTtnQkFDOUMsT0FBTztZQUNYLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNkLHVDQUF1QztZQUN2QyxzRUFBc0U7WUFDdEUsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDakQsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUN2QyxJQUFJLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxHQUFHLDJEQUEyRCxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsVUFBVTtvQkFDMUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7Z0JBRWxELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3hDLFdBQVc7Z0JBQ1gsa0dBQWtHO2FBRXJHO1lBQ0QsSUFBSSxJQUFJLDBEQUEwRCxDQUFDO1lBQ25FLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN2RCxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUN0QixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7b0JBQ2xCLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDbkIsVUFBVSxDQUFDLEdBQUcsRUFBRTt3QkFDWixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBRXhCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDWCxDQUFDO2FBQ0osQ0FBQyxDQUFDO1lBSUgsc0NBQXNDO1lBQ3RDLDRHQUE0RztZQUM1RywwR0FBMEc7WUFDMUcsd0dBQXdHO1FBRTVHLENBQUM7UUFDRCxjQUFjLENBQUMsRUFBRTs7WUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNuQixNQUFBLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUywwQ0FBRSxRQUFRLEVBQUUsQ0FBQztZQUMvQixFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDeEIsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QixDQUFDO1FBQ0QsVUFBVTtZQUNOLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxRQUFRLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDO2dCQUN0RCxRQUFRLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQy9FLFFBQVEsQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUUsQ0FBQyxTQUFTLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzVGLFFBQVEsQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUUsQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQzdGLFFBQVEsQ0FBQyxjQUFjLENBQUMseUJBQXlCLENBQUUsQ0FBQyxTQUFTLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUM5SixDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLO1lBQ2hCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDM0IsT0FBTztZQUNYLElBQUk7Z0JBQ0EsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUMvQixPQUFPO2lCQUNWO2FBQ0o7WUFBQyxXQUFNO2dCQUNKLE9BQU87YUFDVjtZQUNELElBQUksR0FBRyxHQUFHLHdFQUF3RSxDQUFDO1lBQ25GLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxxQkFBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsT0FBTyxHQUFHLHFCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUM7aUJBQ3JHO2FBQ0o7WUFDRCxHQUFHLElBQUksT0FBTyxDQUFDO1lBQ2YsUUFBUSxDQUFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFDeEUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRWIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFGLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUV0QixDQUFDO1FBQ0QsV0FBVztZQUNQLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDeEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsK0lBQStJO1FBQ3JRLENBQUM7UUFDRCxJQUFJO1lBQ0EsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7Z0JBQzNELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoQztZQUNELGdCQUFnQjtZQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDZixLQUFLLEVBQUUsT0FBTztnQkFDZCxTQUFTLEVBQUUsSUFBSTtnQkFDZiwrREFBK0Q7Z0JBQy9ELElBQUksRUFBRSxVQUFVLEtBQUssRUFBRSxFQUFFO29CQUNyQixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixDQUFDO2dCQUNELEtBQUssRUFBRTtvQkFDSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7YUFDSixDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQy9ELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFcEQsQ0FBQztRQUNELEtBQUs7WUFDRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDO0tBQ0o7SUFyVkQsd0NBcVZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcbmltcG9ydCB7IGFsbFByb2R1Y3RzLCBQcm9kdWN0IH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xuaW1wb3J0IHsgUm91dGUgfSBmcm9tIFwiZ2FtZS9yb3V0ZVwiO1xuaW1wb3J0IHsgUm91dGVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9yb3V0ZWRpYWxvZ1wiO1xuaW1wb3J0IHsgU3F1YWRyb25EaWFsb2cgfSBmcm9tIFwiZ2FtZS9zcXVhZHJvbmRpYWxvZ1wiO1xuXG4vL0B0cy1pZ25vcmVcbndpbmRvdy5haXJwbGFuZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5haXJwbGFuZTtcbn1cbmV4cG9ydCBjbGFzcyBBaXJwbGFuZURpYWxvZyB7XG4gICAgZG9tOiBIVE1MRGl2RWxlbWVudDtcbiAgICBwcml2YXRlIF9haXJwbGFuZTogQWlycGxhbmU7XG4gICAgaGFzUGF1c2VkID0gZmFsc2U7XG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcbiAgICBwdWJsaWMgZHJvcENpdGllc0VuYWJsZWQgPSBmYWxzZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcbiAgICB9XG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IEFpcnBsYW5lRGlhbG9nIHtcbiAgICAgICAgaWYgKEFpcnBsYW5lRGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBBaXJwbGFuZURpYWxvZy5pbnN0YW5jZSA9IG5ldyBBaXJwbGFuZURpYWxvZygpO1xuICAgICAgICByZXR1cm4gQWlycGxhbmVEaWFsb2cuaW5zdGFuY2U7XG4gICAgfVxuICAgIHNldCBhaXJwbGFuZSh2YWx1ZTogQWlycGxhbmUpIHtcbiAgICAgICAgdGhpcy5fYWlycGxhbmUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVSb3V0ZSgpO1xuICAgIH1cbiAgICBnZXQgYWlycGxhbmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9haXJwbGFuZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJhaXJwbGFuZWRpYWxvZ1wiIGNsYXNzPVwiYWlycGxhbmVkaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nXCIpO1xuICAgICAgICBpZiAob2xkKSB7XG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhaXJwbGFuZSA9IHRoaXMuYWlycGxhbmU7XG4gICAgICAgIHZhciBwcm9kdWN0cyA9IGFsbFByb2R1Y3RzO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc2RvbSA9IGBcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJhaXJwbGFuZWRpYWxvZy1wcmV2XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPFwiLz5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImFpcnBsYW5lZGlhbG9nLW5leHRcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI+XCIvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5cbiAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2FpcnBsYW5lZGlhbG9nLXByb2R1Y3RzXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+YCsgSWNvbnMudGFibGUucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJMb2FkXCInKSArIGA8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjYWlycGxhbmVkaWFsb2ctaW5mb1wiIGNsYXNzPVwiYWlycGxhbmVkaWFsb2ctdGFic1wiPmArIEljb25zLmluZm8ucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJJbmZvXCInKSArIGA8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpICBpZD1cImFpcnBsYW5lZGlhbG9nLXJvdXRlLXRhYlwiPjxhIGhyZWY9XCIjYWlycGxhbmVkaWFsb2ctcm91dGVcIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5gKyBJY29ucy5yb3V0ZS5yZXBsYWNlKCc8c3BhbicsICc8c3BhbiB0aXRsZT1cIlJvdXRlXCInKSArIGA8L2E+PC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0c1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctcHJvZHVjdHMtbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICBcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctaW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImFpcnBsYW5lZGlhbG9nLW5hbWVcIj4gPC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJhaXJwbGFuZWRpYWxvZy10eXBlXCI+VHlwZTo8L3NwYW4+PGJyLz5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJhaXJwbGFuZWRpYWxvZy1zcGVlZFwiPlNwZWVkOjwvc3Bhbj48YnIvPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImFpcnBsYW5lZGlhbG9nLWNhcGFjaXR5XCI+Q2FwYWNpdHk6PC9zcGFuPjxici8+IFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHN0eWxlPVwiZm9udC1zaXplOjE0cHhcIiBpZD1cImVkaXQtc3F1YWRyb25cIj5gKyBJY29ucy5lZGl0ICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXJvdXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJyb3V0ZS1hY3RpdmVcIj4gYWN0aXZlPC9pbnB1dD5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT1cImZvbnQtc2l6ZToxNHB4XCIgaWQ9XCJlZGl0LXJvdXRlXCI+YCsgSWNvbnMuZWRpdCArIGA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT1cImZvbnQtc2l6ZToxNHB4XCIgIGlkPVwiZGVsZXRlLXJvdXRlXCI+YCsgSWNvbnMucmVtb3ZlICsgYDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8dWwgc3R5bGU9XCJtaW4taGVpZ3Q6NDBweFwiIGlkPVwicm91dGUtbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgdmFyIG5ld2RvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQobmV3ZG9tKTtcbiAgICAgICAgJChcIiNhaXJwbGFuZWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkKFwiI2FpcnBsYW5lZGlhbG9nLXRhYnNcIikudGFicyh7XG4gICAgICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyAgJCggXCIjcm91dGUtbGlzdFwiICkuc29ydGFibGUoKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XG5cbiAgICAgICAgLy8gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1uZXh0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoX3RoaXMuYWlycGxhbmUpO1xuICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgICAgIGlmIChwb3MgPj0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxlY3RBaXJwbGFjZShfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctcHJldlwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcbiAgICAgICAgICAgICAgICBwb3MtLTtcbiAgICAgICAgICAgICAgICBpZiAocG9zID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXTtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYWN0aXZlXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgYWN0ID0gKCg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYWN0aXZlXCIpKS5jaGVja2VkID8gMSA6IC0xKTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0ID09PSAtMSAmJiBfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPSAtMTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID0gYWN0ICogTWF0aC5hYnMoX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1uYW1lXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0O1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSB0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFpcnBsYW5lLndvcmxkLmZpbmRBaXJwbGFuZSh2YWwpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJhbiBhaXJwbGFuZSB3aXRoIG5hbWUgXCIgKyB2YWwgKyBcIiBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5uYW1lID0gdmFsO1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJy5haXJwbGFuZWRpYWxvZy10YWJzJykuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiIHx8XG4gICAgICAgICAgICAgICAgICAgICg8YW55PmV2ZW50LnRhcmdldC5wYXJlbnROb2RlKS5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmVuYWJsZURyb3BDaXRpZXModHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXQtcm91dGVcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIF90aGlzLmVuYWJsZURyb3BDaXRpZXMoZmFsc2UpO1xuICAgICAgICAgICAgICAgIFJvdXRlRGlhbG9nLmdldEluc3RhbmNlKCkuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZTtcbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLnJvdXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5haXJwbGFuZS5yb3V0ZS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLnJvdXRlID0gX3RoaXMuYWlycGxhbmUucm91dGVbMF07XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwibm8gcm91dGUgZGVmaW5lZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLnNob3coKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LXNxdWFkcm9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBTcXVhZHJvbkRpYWxvZy5nZXRJbnN0YW5jZSgpLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmU7XG4gICAgICAgICAgICAgICAgU3F1YWRyb25EaWFsb2cuZ2V0SW5zdGFuY2UoKS5zaG93KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLXJvdXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgc2VsZWN0LmNoaWxkcmVuLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3QuY2hpbGRyZW5beF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLXJvdXRlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHNlbGVjdC5jaGlsZHJlblt4XSkucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVEYXRhKCk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSA8SFRNTEVsZW1lbnQ+JChlLnRhcmdldCkuY2xvc2VzdCgnbGknKVswXTtcblxuICAgICAgICAgICAgICAgIGlmIChlbC5pZC5zcGxpdChcIi1cIikubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChlbC5pZC5zcGxpdChcIi1cIilbMV0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlbGVjdC5jaGlsZHJlbi5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LmNoaWxkcmVuW3hdLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmUtcm91dGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlLXJvdXRlXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1yb3V0ZVwiKS5kcm9wcGFibGUoe1xuICAgICAgICAgICAgICAgIGRyb3A6IChlLCBlMikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkKGUyLmRyYWdnYWJsZVswXSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZURhdGEoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB9XG4gICAgZW5hYmxlRHJvcENpdGllcyhlbmFibGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgY29uc29sZS5sb2coXCJyb3V0ZSBcIiArIChlbmFibGUgPyBcImVuYWJsZVwiIDogXCJkaXNhYmxlXCIpKTtcbiAgICAgICAgaWYgKHRoaXMuZHJvcENpdGllc0VuYWJsZWQgJiYgIWVuYWJsZSkge1xuICAgICAgICAgICAgJChcIi5jaXR5XCIpLmRyYWdnYWJsZSgnZGVzdHJveScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRyb3BDaXRpZXNFbmFibGVkID09PSBmYWxzZSAmJiBlbmFibGUpIHtcbiAgICAgICAgICAgICQoXCIuY2l0eVwiKS5kcmFnZ2FibGUoe1xuICAgICAgICAgICAgICAgIGNvbm5lY3RUb1NvcnRhYmxlOiAnI3JvdXRlLWxpc3QnLFxuICAgICAgICAgICAgICAgIGhlbHBlcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJjaXR5aWRcIikpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2l0eSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF07XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSAnPGxpIGlkPVwicm91dGUtJyArIGlkICsgJ1wiIGNsYXNzPVwidWktc3RhdGUtZGVmYXVsdFwiPjxpbWcgc3R5bGU9XCJ3aWR0aDoyMHB4XCIgc3JjPVwiJyArIGNpdHkuaWNvbiArICdcIiA8L2ltZz4nICsgY2l0eS5uYW1lICsgXCI8L2xpPlwiO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHJldCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBoZWxwZXIuX3Bvc2l0aW9uLmRvbTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJldmVydDogJ2ludmFsaWQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyb3BDaXRpZXNFbmFibGVkID0gZW5hYmxlO1xuICAgIH1cbiAgICB1cGRhdGVEYXRhKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY2hpbGRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpLmNoaWxkcmVuO1xuICAgICAgICB2YXIgb2xkOiBSb3V0ZVtdID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgX3RoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIG9sZC5wdXNoKF90aGlzLmFpcnBsYW5lLnJvdXRlW3hdKTtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5haXJwbGFuZS5yb3V0ZSA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNoaWxkcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKGNoaWxkc1t4XS5pZCA9PT0gXCJyb3V0ZS1kdW1teVwiKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgdmFyIHNpZCA9IGNoaWxkc1t4XS5pZC5zcGxpdChcIi1cIilbMV07XG4gICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChzaWQpO1xuICAgICAgICAgICAgdmFyIGZvdW5kOiBSb3V0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgb2xkLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9sZFt5XS5jaXR5aWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gb2xkW3ldO1xuICAgICAgICAgICAgICAgICAgICBvbGQuc3BsaWNlKHksIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZm91bmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGZvdW5kID0gbmV3IFJvdXRlKCk7XG4gICAgICAgICAgICAgICAgZm91bmQuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZTtcbiAgICAgICAgICAgICAgICBmb3VuZC5jaXR5aWQgPSBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLnJvdXRlLnB1c2goZm91bmQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZVJvdXRlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG4gICAgICAgIC8vaWYgKHRoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoID09PSAwKVxuICAgICAgICAvLyAgaHRtbCA9ICc8bGkgaWQ9XCJyb3V0ZS1kdW1teVwiPmRyYWcgYW5kIGRyb3AgY2l0aWVzIGhlcmU8L2JyPjwvbGk+JztcbiAgICAgICAgdmFyIGlkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuYWlycGxhbmUucm91dGVbeF0uY2l0eWlkO1xuICAgICAgICAgICAgaHRtbCArPSAnPGxpIGlkPVwicm91dGUtJyArIGlkICsgJ1wiIGNsYXNzPVwidWktc3RhdGUtZGVmYXVsdFwiPjxpbWcgc3R5bGU9XCJ3aWR0aDoyMHB4O1wiIHNyYz1cIicgKyB0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF0uaWNvbiArICdcIiA8L2ltZz4nICtcbiAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF0ubmFtZSArIFwiPC9saT5cIjtcblxuICAgICAgICAgICAgaWRzLnB1c2godGhpcy5haXJwbGFuZS5yb3V0ZVt4XS5jaXR5aWQpO1xuICAgICAgICAgICAgLy92YXIgc2RvbTtcbiAgICAgICAgICAgIC8vdmFyIGRvbTpIVE1MU3BhbkVsZW1lbnQ9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG5cbiAgICAgICAgfVxuICAgICAgICBodG1sICs9ICc8bGkgaWQ9XCJyb3V0ZS1kdW1teVwiPmRyYWcgYW5kIGRyb3A8YnIvPiBjaXRpZXMgaGVyZTwvbGk+JztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICQoXCIjcm91dGUtbGlzdFwiKS5zb3J0YWJsZSh7XG4gICAgICAgICAgICB1cGRhdGU6IChldmVudCwgdWkpID0+IHtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVEYXRhKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZVJvdXRlKCk7XG5cbiAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICAvLyAgJChcImFpcnBsYW5lZGlhbG9nLXJvdXRlXCIpLnNvcnRhYmxlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgIDxzcGFuPmArdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMF0uaWNvbit0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1swXS5uYW1lK2A8L3NwYW4+IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgPHNwYW4+YCt0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1sxXS5pY29uK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzFdLm5hbWUrYDwvc3Bhbj4gXG4gICAgICAgIC8vICAgICAgICAgICAgICAgPHNwYW4+YCt0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1szXS5pY29uK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzNdLm5hbWUrYDwvc3Bhbj4gXG5cbiAgICB9XG4gICAgc2VsZWN0QWlycGxhY2UoYXApIHtcbiAgICAgICAgdGhpcy5haXJwbGFuZSA9IGFwO1xuICAgICAgICBhcC53b3JsZC5zZWxlY3Rpb24/LnVuc2VsZWN0KCk7XG4gICAgICAgIGFwLndvcmxkLnNlbGVjdGlvbiA9IGFwO1xuICAgICAgICBhcC5zZWxlY3QoKTtcbiAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XG5cbiAgICB9XG4gICAgdXBkYXRlSW5mbygpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctbmFtZVwiKSlcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLW5hbWVcIikpLnZhbHVlID0gdGhpcy5haXJwbGFuZS5uYW1lO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy10eXBlXCIpKS5pbm5lckhUTUwgPSBcIlR5cGU6IFwiICsgdGhpcy5haXJwbGFuZS50eXBlaWQ7XG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLXNwZWVkXCIpKS5pbm5lckhUTUwgPSBcIlNwZWVkOiBcIiArIHRoaXMuYWlycGxhbmUuc3BlZWQ7XG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLWNhcGFjaXR5XCIpKS5pbm5lckhUTUwgPSBcIkNhcGFjaXR5OlwiICsgdGhpcy5haXJwbGFuZS5sb2FkZWRDb3VudCArIFwiL1wiICsgdGhpcy5haXJwbGFuZS5jYXBhY2l0eTtcbiAgICB9XG4gICAgdXBkYXRlKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghJCh0aGlzLmRvbSkuZGlhbG9nKCdpc09wZW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9ICc8ZGl2IHN0eWxlPVwiZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczogMzBweCAzMHB4IDMwcHggMzBweDtcIj4nO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5haXJwbGFuZS5wcm9kdWN0c1t4XSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8ZGl2PicgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIiBcIiArIHRoaXMuYWlycGxhbmUucHJvZHVjdHNbeF0gKyBcIiBcIiArIFwiPC9kaXY+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0ICs9IFwiPGRpdj5cIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0cy1saXN0XCIpLmlubmVySFRNTCA9IHJldDtcbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuXG4gICAgICAgICg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYWN0aXZlXCIpKS5jaGVja2VkID0gKHRoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPiAtMSk7XG4gICAgICAgIHRoaXMudXBkYXRlSW5mbygpO1xuXG4gICAgfVxuICAgIHVwZGF0ZVRpdGxlKCkge1xuICAgICAgICB2YXIgc2ljb24gPSAnJztcbiAgICAgICAgaWYgKCQodGhpcy5kb20pLnBhcmVudCgpLmZpbmQoJy51aS1kaWFsb2ctdGl0bGUnKS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpWzBdLmlubmVySFRNTCA9IHRoaXMuYWlycGxhbmUubmFtZSArIFwiIFwiICsgdGhpcy5haXJwbGFuZS5zdGF0dXM7IC8vJzxpbWcgc3R5bGU9XCJmbG9hdDogcmlnaHRcIiBpZD1cImNpdHlkaWFsb2ctaWNvblwiIHNyYz1cIicgKyB0aGlzLmNpdHkuaWNvbiArICdcIiAgaGVpZ2h0PVwiMTVcIj48L2ltZz4gJyArIHRoaXMuY2l0eS5uYW1lICsgXCIgXCIgKyB0aGlzLmNpdHkucGVvcGxlO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIGlmICgkKFwiI2FpcnBsYW5lZGlhbG9nLXJvdXRlLXRhYlwiKS5oYXNDbGFzcyhcInVpLXRhYnMtYWN0aXZlXCIpKSB7XG4gICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vdWktdGFicy1hY3RpdmVcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKHtcbiAgICAgICAgICAgIHdpZHRoOiBcIjE5MHB4XCIsXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyhmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmRpYWxvZyhcIndpZGdldFwiKS5kcmFnZ2FibGUoXCJvcHRpb25cIiwgXCJjb250YWlubWVudFwiLCBcIm5vbmVcIik7XG4gICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmNzcyh7IHBvc2l0aW9uOiBcImZpeGVkXCIgfSk7XG5cbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgIH1cbn0iXX0=