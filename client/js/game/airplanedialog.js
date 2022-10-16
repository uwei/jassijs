define(["require", "exports", "game/product", "game/icons", "game/route", "game/routedialog", "game/squadrondialog"], function (require, exports, product_1, icons_1, route_1, routedialog_1, squadrondialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AirplaneDialog = void 0;
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
        createStyle() {
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
            this.createStyle();
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
    exports.AirplaneDialog = AirplaneDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycGxhbmVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2FpcnBsYW5lZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFPQSxJQUFJLEdBQUcsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBd0JULENBQUM7SUFDRixZQUFZO0lBQ1osTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE9BQU8sY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxDQUFDLENBQUE7SUFDRCxNQUFhLGNBQWM7UUFNdkI7WUFIQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBRVgsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1lBRTdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLGNBQWMsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDckMsY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25ELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsSUFBSSxRQUFRLENBQUMsS0FBZTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksUUFBUTtZQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBQ08sV0FBVztZQUNmLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQztZQUMvQixLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztZQUN4QixLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztZQUV0QixJQUFJLEdBQUcsR0FBRyxRQUFRLENB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QUFPO2dCQUNkLCtEQUErRDtnQkFDL0QsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFLEVBQUU7b0JBQ3JCLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBQ0QsS0FBSyxFQUFFO29CQUNILEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEMsQ0FBQzthQUNKLENBQUMsQ0FBQztZQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFcEQsQ0FBQztRQUNELEtBQUs7WUFDRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDO0tBQ0o7SUFuVUQsd0NBbVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgYWxsUHJvZHVjdHMsIFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XHJcbmltcG9ydCB7IFJvdXRlRGlhbG9nIH0gZnJvbSBcImdhbWUvcm91dGVkaWFsb2dcIjtcclxuaW1wb3J0IHsgU3F1YWRyb25EaWFsb2cgfSBmcm9tIFwiZ2FtZS9zcXVhZHJvbmRpYWxvZ1wiO1xyXG52YXIgY3NzID0gYFxyXG4gICAgdGFibGV7XHJcbiAgICAgICAgZm9udC1zaXplOmluaGVyaXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLmFpcnBsYW5lZGlhbG9nID4qe1xyXG4gICAgICAgIGZvbnQtc2l6ZToxMHB4OyBcclxuICAgIH1cclxuICAgIC51aS1kaWFsb2ctdGl0bGV7IFxyXG4gICAgICAgIGZvbnQtc2l6ZToxMHB4O1xyXG4gICAgfVxyXG4gICAgLnVpLWRpYWxvZy10aXRsZWJhcntcclxuICAgICAgICBoZWlnaHQ6MTBweDtcclxuICAgIH1cclxuICAgICNyb3V0ZS1saXN0Pmxpe1xyXG4gICAgICAgIGxpc3Qtc3R5bGUtdHlwZTogbm9uZTsgLyogUmVtb3ZlIGJ1bGxldHMgKi9cclxuICAgICAgICBwYWRkaW5nOiAwOyAvKiBSZW1vdmUgcGFkZGluZyAqL1xyXG4gICAgICAgIG1hcmdpbjogMDtcclxuICAgIH1cclxuICAgICNyb3V0ZS1saXN0e1xyXG4gICAgICAgIG1hcmdpbi1ibG9jay1zdGFydDogMHB4O1xyXG4gICAgICAgIG1hcmdpbi1ibG9jay1lbmQ6IDBweDtcclxuICAgICAgICBwYWRkaW5nLWlubGluZS1zdGFydDogMHB4O1xyXG4gICAgfVxyXG5gO1xyXG4vL0B0cy1pZ25vcmVcclxud2luZG93LmFpcnBsYW5lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIEFpcnBsYW5lRGlhbG9nLmdldEluc3RhbmNlKCkuYWlycGxhbmU7XHJcbn1cclxuZXhwb3J0IGNsYXNzIEFpcnBsYW5lRGlhbG9nIHtcclxuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9haXJwbGFuZTogQWlycGxhbmU7XHJcbiAgICBoYXNQYXVzZWQgPSBmYWxzZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U7XHJcbiAgICBwdWJsaWMgZHJvcENpdGllc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQWlycGxhbmVEaWFsb2cge1xyXG4gICAgICAgIGlmIChBaXJwbGFuZURpYWxvZy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBBaXJwbGFuZURpYWxvZy5pbnN0YW5jZSA9IG5ldyBBaXJwbGFuZURpYWxvZygpO1xyXG4gICAgICAgIHJldHVybiBBaXJwbGFuZURpYWxvZy5pbnN0YW5jZTtcclxuICAgIH1cclxuICAgIHNldCBhaXJwbGFuZSh2YWx1ZTogQWlycGxhbmUpIHtcclxuICAgICAgICB0aGlzLl9haXJwbGFuZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUm91dGUoKTtcclxuICAgIH1cclxuICAgIGdldCBhaXJwbGFuZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWlycGxhbmU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZVN0eWxlKCkge1xyXG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcbiAgICAgICAgc3R5bGUuaWQgPSBcImFpcnBsYW5lZGlhbG9nY3NzXCI7XHJcbiAgICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XHJcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gY3NzO1xyXG5cclxuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZ2Nzc1wiKTtcclxuICAgICAgICBpZiAob2xkKSB7XHJcbiAgICAgICAgICAgIG9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xyXG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXHJcbiAgICAgICAgdmFyIHNkb20gPSBgXHJcbiAgICAgICAgICA8ZGl2IGhpZGRlbiBpZD1cImFpcnBsYW5lZGlhbG9nXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxyXG4gICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhpcy5kb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nXCIpO1xyXG4gICAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jcmVhdGVTdHlsZSgpO1xyXG4gICAgICAgIHZhciBhaXJwbGFuZSA9IHRoaXMuYWlycGxhbmU7XHJcbiAgICAgICAgdmFyIHByb2R1Y3RzID0gYWxsUHJvZHVjdHM7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgc2RvbSA9IGBcclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJhaXJwbGFuZWRpYWxvZy1wcmV2XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPFwiLz5cclxuICAgICAgICAgICAgPGlucHV0IGlkPVwiYWlycGxhbmVkaWFsb2ctbmV4dFwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIj5cIi8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5cclxuICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNhaXJwbGFuZWRpYWxvZy1wcm9kdWN0c1wiIGNsYXNzPVwiYWlycGxhbmVkaWFsb2ctdGFic1wiPmArIEljb25zLnRhYmxlLnJlcGxhY2UoJzxzcGFuJywgJzxzcGFuIHRpdGxlPVwiTG9hZFwiJykgKyBgPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjYWlycGxhbmVkaWFsb2ctaW5mb1wiIGNsYXNzPVwiYWlycGxhbmVkaWFsb2ctdGFic1wiPmArIEljb25zLmluZm8ucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJJbmZvXCInKSArIGA8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgIGlkPVwiYWlycGxhbmVkaWFsb2ctcm91dGUtdGFiXCI+PGEgaHJlZj1cIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiIGNsYXNzPVwiYWlycGxhbmVkaWFsb2ctdGFic1wiPmArIEljb25zLnJvdXRlLnJlcGxhY2UoJzxzcGFuJywgJzxzcGFuIHRpdGxlPVwiUm91dGVcIicpICsgYDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0cy1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICBcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLWluZm9cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImFpcnBsYW5lZGlhbG9nLW5hbWVcIj4gPC9pbnB1dD5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImFpcnBsYW5lZGlhbG9nLXR5cGVcIj5UeXBlOjwvc3Bhbj48YnIvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiYWlycGxhbmVkaWFsb2ctc3BlZWRcIj5TcGVlZDo8L3NwYW4+PGJyLz5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImFpcnBsYW5lZGlhbG9nLWNhcGFjaXR5XCI+Q2FwYWNpdHk6PC9zcGFuPjxici8+IDxidXR0b24gaWQ9XCJlZGl0LXNxdWFkcm9uXCI+YCsgSWNvbnMuZWRpdCArIGA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctcm91dGVcIj5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJyb3V0ZS1hY3RpdmVcIj4gYWN0aXZlPC9pbnB1dD5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiZWRpdC1yb3V0ZVwiPmArIEljb25zLmVkaXQgKyBgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVwicm91dGUtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdmFyIG5ld2RvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20uY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XHJcbiAgICAgICAgJChcIiNhaXJwbGFuZWRpYWxvZy10YWJzXCIpLnRhYnMoe1xyXG4gICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjYWlycGxhbmVkaWFsb2ctdGFic1wiKS50YWJzKHtcclxuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vICAkKCBcIiNyb3V0ZS1saXN0XCIgKS5zb3J0YWJsZSgpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XHJcblxyXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcclxuICAgICAgICAgICAgICAgIHBvcysrO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA+PSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxlY3RBaXJwbGFjZShfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLXByZXZcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcclxuICAgICAgICAgICAgICAgIHBvcy0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA9PT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1hY3RpdmVcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFjdCA9ICgoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKSkuY2hlY2tlZCA/IDEgOiAtMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0ID09PSAtMSAmJiBfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA9PT0gMClcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID0gYWN0ICogTWF0aC5hYnMoX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1uYW1lXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYWlycGxhbmUud29ybGQuZmluZEFpcnBsYW5lKHZhbCkhPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiYW4gYWlycGxhbmUgd2l0aCBuYW1lIFwiK3ZhbCtcIiBhbHJlYWR5IGV4aXN0c1wiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5uYW1lID0gdmFsO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnLmFpcnBsYW5lZGlhbG9nLXRhYnMnKS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIjYWlycGxhbmVkaWFsb2ctcm91dGVcIiB8fFxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PmV2ZW50LnRhcmdldC5wYXJlbnROb2RlKS5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyhmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXQtcm91dGVcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5haXJwbGFuZSA9IF90aGlzLmFpcnBsYW5lO1xyXG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5yb3V0ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5haXJwbGFuZS5yb3V0ZS5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIFJvdXRlRGlhbG9nLmdldEluc3RhbmNlKCkucm91dGUgPSBfdGhpcy5haXJwbGFuZS5yb3V0ZVswXTtcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwibm8gcm91dGUgZGVmaW5lZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLnNob3coKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdC1zcXVhZHJvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBTcXVhZHJvbkRpYWxvZy5nZXRJbnN0YW5jZSgpLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmU7XHJcbiAgICAgICAgICAgICAgICBTcXVhZHJvbkRpYWxvZy5nZXRJbnN0YW5jZSgpLnNob3coKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB9XHJcbiAgICBlbmFibGVEcm9wQ2l0aWVzKGVuYWJsZTogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyb3V0ZSBcIiArIChlbmFibGUgPyBcImVuYWJsZVwiIDogXCJkaXNhYmxlXCIpKTtcclxuICAgICAgICBpZiAodGhpcy5kcm9wQ2l0aWVzRW5hYmxlZCAmJiAhZW5hYmxlKSB7XHJcbiAgICAgICAgICAgICQoXCIuY2l0eVwiKS5kcmFnZ2FibGUoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZHJvcENpdGllc0VuYWJsZWQgPT09IGZhbHNlICYmIGVuYWJsZSkge1xyXG4gICAgICAgICAgICAkKFwiLmNpdHlcIikuZHJhZ2dhYmxlKHtcclxuICAgICAgICAgICAgICAgIGNvbm5lY3RUb1NvcnRhYmxlOiAnI3JvdXRlLWxpc3QnLFxyXG4gICAgICAgICAgICAgICAgaGVscGVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiY2l0eWlkXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2l0eSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldCA9ICc8bGkgaWQ9XCJyb3V0ZS0nICsgaWQgKyAnXCIgY2xhc3M9XCJ1aS1zdGF0ZS1kZWZhdWx0XCI+PGltZyBzdHlsZT1cIndpZHRoOjIwcHhcIiBzcmM9XCInICsgY2l0eS5pY29uICsgJ1wiIDwvaW1nPicgKyBjaXR5Lm5hbWUgKyBcIjwvbGk+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHJldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIGhlbHBlci5fcG9zaXRpb24uZG9tO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJldmVydDogJ2ludmFsaWQnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyb3BDaXRpZXNFbmFibGVkID0gZW5hYmxlO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlRGF0YSgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjaGlsZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxpc3RcIikuY2hpbGRyZW47XHJcbiAgICAgICAgdmFyIG9sZDogUm91dGVbXSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgX3RoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgb2xkLnB1c2goX3RoaXMuYWlycGxhbmUucm91dGVbeF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfdGhpcy5haXJwbGFuZS5yb3V0ZSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2hpbGRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZHNbeF0uaWQgPT09IFwicm91dGUtZHVtbXlcIilcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB2YXIgc2lkID0gY2hpbGRzW3hdLmlkLnNwbGl0KFwiLVwiKVsxXTtcclxuICAgICAgICAgICAgdmFyIGlkID0gcGFyc2VJbnQoc2lkKTtcclxuICAgICAgICAgICAgdmFyIGZvdW5kOiBSb3V0ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBvbGQubGVuZ3RoOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRbeV0uY2l0eWlkID09PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gb2xkW3ldO1xyXG4gICAgICAgICAgICAgICAgICAgIG9sZC5zcGxpY2UoeSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGZvdW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvdW5kID0gbmV3IFJvdXRlKCk7XHJcbiAgICAgICAgICAgICAgICBmb3VuZC5haXJwbGFuZSA9IF90aGlzLmFpcnBsYW5lO1xyXG4gICAgICAgICAgICAgICAgZm91bmQuY2l0eWlkID0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUucm91dGUucHVzaChmb3VuZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdXBkYXRlUm91dGUoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xyXG4gICAgICAgIGlmICh0aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgaHRtbCA9ICc8bGkgaWQ9XCJyb3V0ZS1kdW1teVwiPmRyYWcgYW5kIGRyb3AgY2l0aWVzIGhlcmU8L2xpPic7XHJcbiAgICAgICAgdmFyIGlkcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZS5yb3V0ZS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmFpcnBsYW5lLnJvdXRlW3hdLmNpdHlpZDtcclxuICAgICAgICAgICAgaHRtbCArPSAnPGxpIGlkPVwicm91dGUtJyArIGlkICsgJ1wiIGNsYXNzPVwidWktc3RhdGUtZGVmYXVsdFwiPjxpbWcgc3R5bGU9XCJ3aWR0aDoyMHB4O1wiIHNyYz1cIicgKyB0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF0uaWNvbiArICdcIiA8L2ltZz4nICtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzW2lkXS5uYW1lICsgXCIgXCIgKyBJY29ucy50cmFzaC5yZXBsYWNlKFwibWRpIFwiLCBcIm1kaSByb3V0ZS1kZWxldGVcIikgKyBcIjwvbGk+XCI7XHJcblxyXG4gICAgICAgICAgICBpZHMucHVzaCh0aGlzLmFpcnBsYW5lLnJvdXRlW3hdLmNpdHlpZCk7XHJcbiAgICAgICAgICAgIC8vdmFyIHNkb207XHJcbiAgICAgICAgICAgIC8vdmFyIGRvbTpIVE1MU3BhbkVsZW1lbnQ9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxpc3RcIikuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgICAgICAkKFwiI3JvdXRlLWxpc3RcIikuc29ydGFibGUoe1xyXG4gICAgICAgICAgICB1cGRhdGU6IChldmVudCwgdWkpID0+IHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZURhdGEoKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZVJvdXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyAgJChcImFpcnBsYW5lZGlhbG9nLXJvdXRlXCIpLnNvcnRhYmxlXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgPHNwYW4+YCt0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1swXS5pY29uK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzBdLm5hbWUrYDwvc3Bhbj4gXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIDxzcGFuPmArdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMV0uaWNvbit0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1sxXS5uYW1lK2A8L3NwYW4+IFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgPHNwYW4+YCt0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1szXS5pY29uK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzNdLm5hbWUrYDwvc3Bhbj4gXHJcblxyXG4gICAgfVxyXG4gICAgc2VsZWN0QWlycGxhY2UoYXApIHtcclxuICAgICAgICB0aGlzLmFpcnBsYW5lID0gYXA7XHJcbiAgICAgICAgYXAud29ybGQuc2VsZWN0aW9uPy51bnNlbGVjdCgpO1xyXG4gICAgICAgIGFwLndvcmxkLnNlbGVjdGlvbiA9IGFwO1xyXG4gICAgICAgIGFwLnNlbGVjdCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKHRydWUpO1xyXG5cclxuICAgIH1cclxuICAgIHVwZGF0ZUluZm8oKSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctbmFtZVwiKSlcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctbmFtZVwiKSkudmFsdWUgPSB0aGlzLmFpcnBsYW5lLm5hbWU7XHJcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctdHlwZVwiKSkuaW5uZXJIVE1MID0gXCJUeXBlOiBcIiArIHRoaXMuYWlycGxhbmUudHlwZWlkO1xyXG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLXNwZWVkXCIpKS5pbm5lckhUTUwgPSBcIlNwZWVkOiBcIiArIHRoaXMuYWlycGxhbmUuc3BlZWQ7XHJcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctY2FwYWNpdHlcIikpLmlubmVySFRNTCA9IFwiQ2FwYWNpdHk6XCIgKyB0aGlzLmFpcnBsYW5lLmxvYWRlZENvdW50ICsgXCIvXCIgKyB0aGlzLmFpcnBsYW5lLmNhcGFjaXR5O1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGZvcmNlID0gZmFsc2UpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLmFpcnBsYW5lID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoISQodGhpcy5kb20pLmRpYWxvZygnaXNPcGVuJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXQgPSAnPGRpdiBzdHlsZT1cImRpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDMwcHggMzBweCAzMHB4IDMwcHg7XCI+JztcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFpcnBsYW5lLnByb2R1Y3RzW3hdICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPGRpdj4nICsgYWxsUHJvZHVjdHNbeF0uZ2V0SWNvbigpICsgXCIgXCIgKyB0aGlzLmFpcnBsYW5lLnByb2R1Y3RzW3hdICsgXCIgXCIgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldCArPSBcIjxkaXY+XCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0cy1saXN0XCIpLmlubmVySFRNTCA9IHJldDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XHJcbiAgICAgICAgJChcIi5yb3V0ZS1kZWxldGVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZURhdGEoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKSkuY2hlY2tlZCA9ICh0aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID4gLTEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSW5mbygpO1xyXG5cclxuICAgIH1cclxuICAgIHVwZGF0ZVRpdGxlKCkge1xyXG4gICAgICAgIHZhciBzaWNvbiA9ICcnO1xyXG4gICAgICAgIGlmICgkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJykubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpWzBdLmlubmVySFRNTCA9IHRoaXMuYWlycGxhbmUubmFtZSArIFwiIFwiICsgdGhpcy5haXJwbGFuZS5zdGF0dXM7IC8vJzxpbWcgc3R5bGU9XCJmbG9hdDogcmlnaHRcIiBpZD1cImNpdHlkaWFsb2ctaWNvblwiIHNyYz1cIicgKyB0aGlzLmNpdHkuaWNvbiArICdcIiAgaGVpZ2h0PVwiMTVcIj48L2ltZz4gJyArIHRoaXMuY2l0eS5uYW1lICsgXCIgXCIgKyB0aGlzLmNpdHkucGVvcGxlO1xyXG4gICAgfVxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIGlmICgkKFwiI2FpcnBsYW5lZGlhbG9nLXJvdXRlLXRhYlwiKS5oYXNDbGFzcyhcInVpLXRhYnMtYWN0aXZlXCIpKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmVuYWJsZURyb3BDaXRpZXModHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vdWktdGFicy1hY3RpdmVcclxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coe1xyXG4gICAgICAgICAgICB3aWR0aDogXCIxOTBweFwiLFxyXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXHJcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmVuYWJsZURyb3BDaXRpZXMoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuY3NzKHsgcG9zaXRpb246IFwiZml4ZWRcIiB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcclxuICAgIH1cclxufSJdfQ==