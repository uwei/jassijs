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
                    <span id="airplanedialog-capacity">Capacity:</span><br/> <button id="edit-squadron">` + icons_1.Icons.edit + `</button>
                 </div>
                 <div id="airplanedialog-route">
                    
                    <input type="checkbox" id="route-active"> active</input>
                    <button id="edit-route">` + icons_1.Icons.edit + `</button>
                    <ul id="route-list">
                     
           
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
            if (this.airplane.route.length === 0)
                html = '<li id="route-dummy">drag and drop cities here</li>';
            var ids = [];
            for (var x = 0; x < this.airplane.route.length; x++) {
                var id = this.airplane.route[x].cityid;
                html += '<li id="route-' + id + '" class="ui-state-default"><img style="width:20px;" src="' + this.airplane.world.cities[id].icon + '" </img>' +
                    this.airplane.world.cities[id].name + " " + icons_1.Icons.trash.replace("mdi ", "mdi route-delete") + "</li>";
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
            $(".route-delete").click(function () {
                $(this).closest('li').remove();
                _this.updateData();
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycGxhbmVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2FpcnBsYW5lZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFRQSxZQUFZO0lBQ1osTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE9BQU8sY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxDQUFDLENBQUE7SUFDRCxNQUFhLGNBQWM7UUFNdkI7WUFIQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBRVgsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1lBRTdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLGNBQWMsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDckMsY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25ELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsSUFBSSxRQUFRLENBQUMsS0FBZTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksUUFBUTtZQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBRU8sTUFBTTtZQUNWLDZCQUE2QjtZQUM3QixJQUFJLElBQUksR0FBRzs7OztTQUlWLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFV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QXZURCx3Q0F1VEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaXR5IH0gZnJvbSBcImdhbWUvY2l0eVwiO1xyXG5pbXBvcnQgeyBhbGxQcm9kdWN0cywgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgeyBJY29ucyB9IGZyb20gXCJnYW1lL2ljb25zXCI7XHJcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSBcImdhbWUvcm91dGVcIjtcclxuaW1wb3J0IHsgUm91dGVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9yb3V0ZWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBTcXVhZHJvbkRpYWxvZyB9IGZyb20gXCJnYW1lL3NxdWFkcm9uZGlhbG9nXCI7XHJcblxyXG4vL0B0cy1pZ25vcmVcclxud2luZG93LmFpcnBsYW5lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuYWlycGxhbmU7XHJcbn1cclxuZXhwb3J0IGNsYXNzIEFpcnBsYW5lRGlhbG9nIHtcclxuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9haXJwbGFuZTogQWlycGxhbmU7XHJcbiAgICBoYXNQYXVzZWQgPSBmYWxzZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U7XHJcbiAgICBwdWJsaWMgZHJvcENpdGllc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQWlycGxhbmVEaWFsb2cge1xyXG4gICAgICAgIGlmIChBaXJwbGFuZURpYWxvZy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBBaXJwbGFuZURpYWxvZy5pbnN0YW5jZSA9IG5ldyBBaXJwbGFuZURpYWxvZygpO1xyXG4gICAgICAgIHJldHVybiBBaXJwbGFuZURpYWxvZy5pbnN0YW5jZTtcclxuICAgIH1cclxuICAgIHNldCBhaXJwbGFuZSh2YWx1ZTogQWlycGxhbmUpIHtcclxuICAgICAgICB0aGlzLl9haXJwbGFuZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUm91dGUoKTtcclxuICAgIH1cclxuICAgIGdldCBhaXJwbGFuZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWlycGxhbmU7XHJcbiAgICB9XHJcbiBcclxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xyXG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXHJcbiAgICAgICAgdmFyIHNkb20gPSBgXHJcbiAgICAgICAgICA8ZGl2IGhpZGRlbiBpZD1cImFpcnBsYW5lZGlhbG9nXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxyXG4gICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhpcy5kb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nXCIpO1xyXG4gICAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFpcnBsYW5lID0gdGhpcy5haXJwbGFuZTtcclxuICAgICAgICB2YXIgcHJvZHVjdHMgPSBhbGxQcm9kdWN0cztcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzZG9tID0gYFxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImFpcnBsYW5lZGlhbG9nLXByZXZcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI8XCIvPlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJhaXJwbGFuZWRpYWxvZy1uZXh0XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPlwiLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctdGFic1wiPlxyXG4gICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2FpcnBsYW5lZGlhbG9nLXByb2R1Y3RzXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+YCsgSWNvbnMudGFibGUucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJMb2FkXCInKSArIGA8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNhaXJwbGFuZWRpYWxvZy1pbmZvXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+YCsgSWNvbnMuaW5mby5yZXBsYWNlKCc8c3BhbicsICc8c3BhbiB0aXRsZT1cIkluZm9cIicpICsgYDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSAgaWQ9XCJhaXJwbGFuZWRpYWxvZy1yb3V0ZS10YWJcIj48YSBocmVmPVwiI2FpcnBsYW5lZGlhbG9nLXJvdXRlXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+YCsgSWNvbnMucm91dGUucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJSb3V0ZVwiJykgKyBgPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXByb2R1Y3RzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXByb2R1Y3RzLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctaW5mb1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiYWlycGxhbmVkaWFsb2ctbmFtZVwiPiA8L2lucHV0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiYWlycGxhbmVkaWFsb2ctdHlwZVwiPlR5cGU6PC9zcGFuPjxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJhaXJwbGFuZWRpYWxvZy1zcGVlZFwiPlNwZWVkOjwvc3Bhbj48YnIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiYWlycGxhbmVkaWFsb2ctY2FwYWNpdHlcIj5DYXBhY2l0eTo8L3NwYW4+PGJyLz4gPGJ1dHRvbiBpZD1cImVkaXQtc3F1YWRyb25cIj5gKyBJY29ucy5lZGl0ICsgYDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInJvdXRlLWFjdGl2ZVwiPiBhY3RpdmU8L2lucHV0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJlZGl0LXJvdXRlXCI+YCsgSWNvbnMuZWRpdCArIGA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XCJyb3V0ZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgICAgICB2YXIgbmV3ZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcclxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQobmV3ZG9tKTtcclxuICAgICAgICAkKFwiI2FpcnBsYW5lZGlhbG9nLXRhYnNcIikudGFicyh7XHJcbiAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgJChcIiNhaXJwbGFuZWRpYWxvZy10YWJzXCIpLnRhYnMoe1xyXG4gICAgICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gICQoIFwiI3JvdXRlLWxpc3RcIiApLnNvcnRhYmxlKCk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcclxuXHJcbiAgICAgICAgLy8gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoX3RoaXMuYWlycGxhbmUpO1xyXG4gICAgICAgICAgICAgICAgcG9zKys7XHJcbiAgICAgICAgICAgICAgICBpZiAocG9zID49IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNlbGVjdEFpcnBsYWNlKF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctcHJldlwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoX3RoaXMuYWlycGxhbmUpO1xyXG4gICAgICAgICAgICAgICAgcG9zLS07XHJcbiAgICAgICAgICAgICAgICBpZiAocG9zID09PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0ID0gKCg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYWN0aXZlXCIpKS5jaGVja2VkID8gMSA6IC0xKTtcclxuICAgICAgICAgICAgICAgIGlmIChhY3QgPT09IC0xICYmIF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID09PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID0gLTE7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPSBhY3QgKiBNYXRoLmFicyhfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLW5hbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcclxuICAgICAgICAgICAgICAgIHZhciB2YWwgPSB0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5haXJwbGFuZS53b3JsZC5maW5kQWlycGxhbmUodmFsKSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJhbiBhaXJwbGFuZSB3aXRoIG5hbWUgXCIrdmFsK1wiIGFscmVhZHkgZXhpc3RzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLm5hbWUgPSB2YWw7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkKCcuYWlycGxhbmVkaWFsb2ctdGFicycpLmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+ZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpLmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiI2FpcnBsYW5lZGlhbG9nLXJvdXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdC1yb3V0ZVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmU7XHJcbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLnJvdXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5yb3V0ZSA9IF90aGlzLmFpcnBsYW5lLnJvdXRlWzBdO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJubyByb3V0ZSBkZWZpbmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFJvdXRlRGlhbG9nLmdldEluc3RhbmNlKCkuc2hvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LXNxdWFkcm9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIFNxdWFkcm9uRGlhbG9nLmdldEluc3RhbmNlKCkuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZTtcclxuICAgICAgICAgICAgICAgIFNxdWFkcm9uRGlhbG9nLmdldEluc3RhbmNlKCkuc2hvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIH1cclxuICAgIGVuYWJsZURyb3BDaXRpZXMoZW5hYmxlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJvdXRlIFwiICsgKGVuYWJsZSA/IFwiZW5hYmxlXCIgOiBcImRpc2FibGVcIikpO1xyXG4gICAgICAgIGlmICh0aGlzLmRyb3BDaXRpZXNFbmFibGVkICYmICFlbmFibGUpIHtcclxuICAgICAgICAgICAgJChcIi5jaXR5XCIpLmRyYWdnYWJsZSgnZGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kcm9wQ2l0aWVzRW5hYmxlZCA9PT0gZmFsc2UgJiYgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgICQoXCIuY2l0eVwiKS5kcmFnZ2FibGUoe1xyXG4gICAgICAgICAgICAgICAgY29ubmVjdFRvU29ydGFibGU6ICcjcm91dGUtbGlzdCcsXHJcbiAgICAgICAgICAgICAgICBoZWxwZXI6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJjaXR5aWRcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaXR5ID0gX3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzW2lkXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gJzxsaSBpZD1cInJvdXRlLScgKyBpZCArICdcIiBjbGFzcz1cInVpLXN0YXRlLWRlZmF1bHRcIj48aW1nIHN0eWxlPVwid2lkdGg6MjBweFwiIHNyYz1cIicgKyBjaXR5Lmljb24gKyAnXCIgPC9pbWc+JyArIGNpdHkubmFtZSArIFwiPC9saT5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQocmV0KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gaGVscGVyLl9wb3NpdGlvbi5kb207XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmV2ZXJ0OiAnaW52YWxpZCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJvcENpdGllc0VuYWJsZWQgPSBlbmFibGU7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVEYXRhKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNoaWxkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5jaGlsZHJlbjtcclxuICAgICAgICB2YXIgb2xkOiBSb3V0ZVtdID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBfdGhpcy5haXJwbGFuZS5yb3V0ZS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBvbGQucHVzaChfdGhpcy5haXJwbGFuZS5yb3V0ZVt4XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF90aGlzLmFpcnBsYW5lLnJvdXRlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjaGlsZHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkc1t4XS5pZCA9PT0gXCJyb3V0ZS1kdW1teVwiKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIHZhciBzaWQgPSBjaGlsZHNbeF0uaWQuc3BsaXQoXCItXCIpWzFdO1xyXG4gICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChzaWQpO1xyXG4gICAgICAgICAgICB2YXIgZm91bmQ6IFJvdXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG9sZC5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZFt5XS5jaXR5aWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBvbGRbeV07XHJcbiAgICAgICAgICAgICAgICAgICAgb2xkLnNwbGljZSh5LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZm91bmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm91bmQgPSBuZXcgUm91dGUoKTtcclxuICAgICAgICAgICAgICAgIGZvdW5kLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmU7XHJcbiAgICAgICAgICAgICAgICBmb3VuZC5jaXR5aWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5yb3V0ZS5wdXNoKGZvdW5kKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGVSb3V0ZSgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxpc3RcIikgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICBodG1sID0gJzxsaSBpZD1cInJvdXRlLWR1bW15XCI+ZHJhZyBhbmQgZHJvcCBjaXRpZXMgaGVyZTwvbGk+JztcclxuICAgICAgICB2YXIgaWRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuYWlycGxhbmUucm91dGVbeF0uY2l0eWlkO1xyXG4gICAgICAgICAgICBodG1sICs9ICc8bGkgaWQ9XCJyb3V0ZS0nICsgaWQgKyAnXCIgY2xhc3M9XCJ1aS1zdGF0ZS1kZWZhdWx0XCI+PGltZyBzdHlsZT1cIndpZHRoOjIwcHg7XCIgc3JjPVwiJyArIHRoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzW2lkXS5pY29uICsgJ1wiIDwvaW1nPicgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbaWRdLm5hbWUgKyBcIiBcIiArIEljb25zLnRyYXNoLnJlcGxhY2UoXCJtZGkgXCIsIFwibWRpIHJvdXRlLWRlbGV0ZVwiKSArIFwiPC9saT5cIjtcclxuXHJcbiAgICAgICAgICAgIGlkcy5wdXNoKHRoaXMuYWlycGxhbmUucm91dGVbeF0uY2l0eWlkKTtcclxuICAgICAgICAgICAgLy92YXIgc2RvbTtcclxuICAgICAgICAgICAgLy92YXIgZG9tOkhUTUxTcGFuRWxlbWVudD0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgICAgICQoXCIjcm91dGUtbGlzdFwiKS5zb3J0YWJsZSh7XHJcbiAgICAgICAgICAgIHVwZGF0ZTogKGV2ZW50LCB1aSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlUm91dGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vICAkKFwiYWlycGxhbmVkaWFsb2ctcm91dGVcIikuc29ydGFibGVcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICA8c3Bhbj5gK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzBdLmljb24rdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMF0ubmFtZStgPC9zcGFuPiBcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgPHNwYW4+YCt0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1sxXS5pY29uK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzFdLm5hbWUrYDwvc3Bhbj4gXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICA8c3Bhbj5gK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzNdLmljb24rdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbM10ubmFtZStgPC9zcGFuPiBcclxuXHJcbiAgICB9XHJcbiAgICBzZWxlY3RBaXJwbGFjZShhcCkge1xyXG4gICAgICAgIHRoaXMuYWlycGxhbmUgPSBhcDtcclxuICAgICAgICBhcC53b3JsZC5zZWxlY3Rpb24/LnVuc2VsZWN0KCk7XHJcbiAgICAgICAgYXAud29ybGQuc2VsZWN0aW9uID0gYXA7XHJcbiAgICAgICAgYXAuc2VsZWN0KCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XHJcblxyXG4gICAgfVxyXG4gICAgdXBkYXRlSW5mbygpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1uYW1lXCIpKVxyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1uYW1lXCIpKS52YWx1ZSA9IHRoaXMuYWlycGxhbmUubmFtZTtcclxuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy10eXBlXCIpKS5pbm5lckhUTUwgPSBcIlR5cGU6IFwiICsgdGhpcy5haXJwbGFuZS50eXBlaWQ7XHJcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctc3BlZWRcIikpLmlubmVySFRNTCA9IFwiU3BlZWQ6IFwiICsgdGhpcy5haXJwbGFuZS5zcGVlZDtcclxuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1jYXBhY2l0eVwiKSkuaW5uZXJIVE1MID0gXCJDYXBhY2l0eTpcIiArIHRoaXMuYWlycGxhbmUubG9hZGVkQ291bnQgKyBcIi9cIiArIHRoaXMuYWlycGxhbmUuY2FwYWNpdHk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoZm9yY2UgPSBmYWxzZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICghJCh0aGlzLmRvbSkuZGlhbG9nKCdpc09wZW4nKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJldCA9ICc8ZGl2IHN0eWxlPVwiZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczogMzBweCAzMHB4IDMwcHggMzBweDtcIj4nO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUucHJvZHVjdHNbeF0gIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8ZGl2PicgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIiBcIiArIHRoaXMuYWlycGxhbmUucHJvZHVjdHNbeF0gKyBcIiBcIiArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0ICs9IFwiPGRpdj5cIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLXByb2R1Y3RzLWxpc3RcIikuaW5uZXJIVE1MID0gcmV0O1xyXG4gICAgICAgIHRoaXMudXBkYXRlVGl0bGUoKTtcclxuICAgICAgICAkKFwiLnJvdXRlLWRlbGV0ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgX3RoaXMudXBkYXRlRGF0YSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYWN0aXZlXCIpKS5jaGVja2VkID0gKHRoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPiAtMSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVJbmZvKCk7XHJcblxyXG4gICAgfVxyXG4gICAgdXBkYXRlVGl0bGUoKSB7XHJcbiAgICAgICAgdmFyIHNpY29uID0gJyc7XHJcbiAgICAgICAgaWYgKCQodGhpcy5kb20pLnBhcmVudCgpLmZpbmQoJy51aS1kaWFsb2ctdGl0bGUnKS5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJylbMF0uaW5uZXJIVE1MID0gdGhpcy5haXJwbGFuZS5uYW1lICsgXCIgXCIgKyB0aGlzLmFpcnBsYW5lLnN0YXR1czsgLy8nPGltZyBzdHlsZT1cImZsb2F0OiByaWdodFwiIGlkPVwiY2l0eWRpYWxvZy1pY29uXCIgc3JjPVwiJyArIHRoaXMuY2l0eS5pY29uICsgJ1wiICBoZWlnaHQ9XCIxNVwiPjwvaW1nPiAnICsgdGhpcy5jaXR5Lm5hbWUgKyBcIiBcIiArIHRoaXMuY2l0eS5wZW9wbGU7XHJcbiAgICB9XHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgaWYgKCQoXCIjYWlycGxhbmVkaWFsb2ctcm91dGUtdGFiXCIpLmhhc0NsYXNzKFwidWktdGFicy1hY3RpdmVcIikpIHtcclxuICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy91aS10YWJzLWFjdGl2ZVxyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiBcIjE5MHB4XCIsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTp0cnVlLFxyXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXHJcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmVuYWJsZURyb3BDaXRpZXMoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuZGlhbG9nKFwid2lkZ2V0XCIpLmRyYWdnYWJsZShcIm9wdGlvblwiLFwiY29udGFpbm1lbnRcIixcIm5vbmVcIik7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuY3NzKHsgcG9zaXRpb246IFwiZml4ZWRcIiB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcclxuICAgIH1cclxufSJdfQ==